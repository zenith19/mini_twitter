require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  test 'requires content, a post and an author' do
    comment = Comment.new
    assert_not comment.valid?
    assert_includes comment.errors.attribute_names, :content
    assert_includes comment.errors.attribute_names, :post
    assert_includes comment.errors.attribute_names, :user
  end

  test 'is valid with all three' do
    comment = Comment.new(content: 'Nice', post: posts(:bob_post), user: users(:alice))
    assert comment.valid?
  end
end
