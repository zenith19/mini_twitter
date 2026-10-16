require 'test_helper'

class PostTest < ActiveSupport::TestCase
  test 'requires a title and content' do
    post = Post.new(user: users(:alice))
    assert_not post.valid?
    assert_includes post.errors.attribute_names, :title
    assert_includes post.errors.attribute_names, :content
  end

  test 'requires an author' do
    assert_not Post.new(title: 'x', content: 'y').valid?
  end

  test 'rejects an over-long title' do
    post = Post.new(user: users(:alice), title: 'a' * 121, content: 'ok')
    assert_not post.valid?
  end

  test 'newest_first orders by creation time descending' do
    assert_equal [posts(:alice_second_post), posts(:bob_post), posts(:alice_post)],
                 Post.newest_first.to_a
  end

  test 'deleting a post removes its comments' do
    assert_difference 'Comment.count', -2 do
      posts(:alice_post).destroy
    end
  end
end
