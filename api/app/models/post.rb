class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :title, presence: true, length: { maximum: 120 }
  validates :content, presence: true, length: { maximum: 5_000 }

  scope :newest_first, -> { order(created_at: :desc, id: :desc) }
end
