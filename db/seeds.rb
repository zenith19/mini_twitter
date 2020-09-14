require 'faker' #   Character.create(name: 'Luke', movie: movies.first)
5.times do
  User.create(
    name: Faker::Name.name,
    username: Faker::DcComics.hero,
    email: Faker::Internet.email,
    password: "12345678"
  )
end

user_id_arr = User.all.ids
5.times do |i|
  uid = user_id_arr[i - 1]
  Post.create(
    title: "Title No #{i}", content: Faker::Lorem.paragraph, user_id: uid
  )
end

post_id_arr = Post.all.ids
5.times do |i|
  pid = post_id_arr[i - 1]
  uid = user_id_arr[i - 1]
  Comment.create(content: Faker::Lorem.sentence, post_id: pid, user_id: uid)
end

UserFollowing.create(user_id:1,following_user_id:2)
UserFollowing.create(user_id:1,following_user_id:3)
UserFollowing.create(user_id:1,following_user_id:4)
UserFollowing.create(user_id:2,following_user_id:1)
UserFollowing.create(user_id:2,following_user_id:3)
UserFollowing.create(user_id:2,following_user_id:4)
UserFollowing.create(user_id:3,following_user_id:1)
UserFollowing.create(user_id:3,following_user_id:2)
UserFollowing.create(user_id:3,following_user_id:4)
UserFollowing.create(user_id:4,following_user_id:1)
UserFollowing.create(user_id:4,following_user_id:2)
UserFollowing.create(user_id:4,following_user_id:3)
