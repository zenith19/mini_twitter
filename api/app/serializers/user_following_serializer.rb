class UserFollowingSerializer < ActiveModel::Serializer
    attributes :id, :user_id, :following_user_id
  end