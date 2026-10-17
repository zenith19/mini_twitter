class User < ApplicationRecord
  # Devise is kept only for password hashing and the email/password
  # validations. Session handling is ours (see #issue_authentication_token!).
  devise :database_authenticatable, :registerable, :validatable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  # The follow graph. `followings` are the people this user follows;
  # `followers` are the people who follow this user.
  has_many :active_follows,
           class_name: 'UserFollowing',
           foreign_key: :user_id,
           inverse_of: :user,
           dependent: :destroy
  has_many :followings, through: :active_follows, source: :following_user

  has_many :passive_follows,
           class_name: 'UserFollowing',
           foreign_key: :following_user_id,
           inverse_of: :following_user,
           dependent: :destroy
  has_many :followers, through: :passive_follows, source: :user

  validates :name, presence: true, length: { maximum: 80 }
  validates :username,
            presence: true,
            length: { maximum: 30 },
            format: { with: /\A[a-zA-Z0-9_]+\z/, message: 'may only contain letters, numbers and underscores' },
            uniqueness: { case_sensitive: false }

  # Issues a fresh token, stores only its digest, and returns the plaintext.
  # The plaintext is shown exactly once, in the POST /v1/sessions response.
  def issue_authentication_token!
    raw = SecureRandom.urlsafe_base64(32)
    update!(authentication_token: self.class.digest_token(raw))
    raw
  end

  def revoke_authentication_token!
    update!(authentication_token: nil)
  end

  def self.digest_token(raw)
    Digest::SHA256.hexdigest(raw.to_s)
  end

  # Constant-time-ish lookup by raw token. Returns nil for a blank token so
  # that a missing header can never match a row with a NULL token.
  def self.find_by_authentication_token(raw)
    return nil if raw.blank?

    find_by(authentication_token: digest_token(raw))
  end

  def following?(other_user)
    followings.exists?(id: other_user.id)
  end

  # The home timeline: posts by the people this user follows, plus their own.
  #
  # A subquery rather than `followings.ids` so the follow set never has to be
  # loaded into Ruby, and the whole thing stays one round trip.
  def timeline_posts
    followed = UserFollowing.where(user_id: id).select(:following_user_id)
    Post.where(user_id: followed).or(Post.where(user_id: id))
  end
end
