class User < ApplicationRecord
  acts_as_token_authenticatable
  devise :database_authenticatable, :registerable, :validatable

  has_many :posts
  has_many :comments
end
