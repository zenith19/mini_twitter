class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1_000 }

  scope :newest_first, -> { order(created_at: :desc, id: :desc) }
end
