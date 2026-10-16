# The slim author payload embedded in posts and comments, so the UI can show
# a name and handle instead of a bare user_id.
class PostAuthorSerializer < ActiveModel::Serializer
  attributes :id, :name, :username
end
