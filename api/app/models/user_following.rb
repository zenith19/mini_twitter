# Join row: `user` follows `following_user`.
class UserFollowing < ApplicationRecord
  belongs_to :user
  belongs_to :following_user, class_name: 'User'

  validates :user_id,
            uniqueness: {
              scope: :following_user_id,
              message: 'is already following this user'
            }
  validate :cannot_follow_self

  private

  def cannot_follow_self
    errors.add(:following_user_id, 'cannot be yourself') if user_id.present? && user_id == following_user_id
  end
end
