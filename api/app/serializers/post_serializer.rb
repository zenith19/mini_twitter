class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :created_at, :comments_count

  belongs_to :user, serializer: PostAuthorSerializer

  def comments_count
    object.comments.size
  end
end
