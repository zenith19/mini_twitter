class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :created_at
  attribute :email, if: :own_record?
  attribute :following, if: :signed_in?

  # Email used to be public on GET /v1/users, exposing every address to
  # anonymous callers. It is now visible only on your own record.
  def own_record?
    scope.present? && scope.id == object.id
  end

  def signed_in?
    scope.present? && scope.id != object.id
  end

  def following
    scope.following?(object)
  end
end
