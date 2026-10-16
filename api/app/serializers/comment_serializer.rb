class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :post_id, :created_at

  belongs_to :user, serializer: PostAuthorSerializer
end
