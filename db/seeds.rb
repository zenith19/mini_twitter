require 'faker'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# 5.times do
# 	first, last = Faker::Name.name.split(' ')
# 	User.create(first_name: first, 
# 				last_name: last, 
# 				email: Faker::Internet.email,
# 				age: rand(18..60),
# 				country: "Japan"
# 				)
# end

# user_id_arr = User.all.ids
5.times do |i|
	# uid = user_id_arr[i-1]
	Post.create(title: "Title No #{i}", 
				content: Faker::Lorem.paragraph)
end

# post_id_arr = Post.all.ids
# 5.times do |i|
# 	pid = post_id_arr[i-1]
# 	uid = user_id_arr[i-1]
# 	Comment.create(content: Faker::Lorem.sentence,
# 				   post_id: pid,
# 				   user_id: uid)
# end

