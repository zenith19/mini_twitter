require 'test_helper'

module V1
  class UserPostsControllerTest < ActionDispatch::IntegrationTest
    test 'returns only that users posts, newest first' do
      get v1_user_posts_path(users(:alice))

      assert_response :ok
      titles = json_body['posts'].map { |p| p['title'] }
      assert_equal ['Alice writes again', "Alice's first post"], titles
    end

    test '404s for a missing user instead of returning an empty list' do
      get v1_user_posts_path(user_id: 999_999)
      assert_response :not_found
    end
  end
end
