class User < ApplicationRecord
	has_many :posts
	has_many :comments
	has_one :authentication
end
