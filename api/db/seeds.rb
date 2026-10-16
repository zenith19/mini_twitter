# Idempotent seed data for local development: `bin/rails db:seed`.
# All seeded accounts use the password below.
PASSWORD = 'password123'

puts 'Seeding users...'
users = 8.times.map do |i|
  User.find_or_create_by!(email: "user#{i + 1}@example.com") do |u|
    u.name     = Faker::Name.name
    u.username = "#{Faker::Internet.username(specifier: 5..10).gsub(/[^a-zA-Z0-9_]/, '_')}#{i}"
    u.password = PASSWORD
  end
end

puts 'Seeding posts...'
posts = users.flat_map do |user|
  rand(2..4).times.map do
    user.posts.create!(
      title: Faker::Lorem.sentence(word_count: rand(3..7)).chomp('.'),
      content: Faker::Lorem.paragraph(sentence_count: rand(2..5)),
      created_at: Faker::Time.between(from: 30.days.ago, to: Time.current)
    )
  end
end

puts 'Seeding comments...'
posts.each do |post|
  rand(0..4).times do
    post.comments.create!(
      user: users.sample,
      content: Faker::Lorem.sentence(word_count: rand(4..12)),
      created_at: Faker::Time.between(from: post.created_at, to: Time.current)
    )
  end
end

puts 'Seeding the follow graph...'
users.each do |user|
  (users - [user]).sample(rand(1..4)).each do |other|
    # find_or_create_by keeps re-seeding from tripping the unique index.
    UserFollowing.find_or_create_by!(user: user, following_user: other)
  end
end

puts <<~SUMMARY

  Done.
    users:    #{User.count}
    posts:    #{Post.count}
    comments: #{Comment.count}
    follows:  #{UserFollowing.count}

  Log in with any of user1@example.com .. user#{User.count}@example.com
  Password: #{PASSWORD}
SUMMARY
