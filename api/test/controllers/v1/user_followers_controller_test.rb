require 'test_helper'

module V1
  class UserFollowersControllerTest < ActionDispatch::IntegrationTest
    test 'followers and followings are different sets' do
      # The frontend used to call the followings endpoint for both, so the
      # "Followers" page showed the people you follow.
      get v1_user_followers_path(users(:alice))
      followers = json_body['users'].map { |u| u['username'] }

      get v1_user_followings_path(users(:alice))
      followings = json_body['users'].map { |u| u['username'] }

      assert_equal ['carol'], followers
      assert_equal ['bob'], followings
      assert_not_equal followers, followings
    end

    test '404s for a missing user' do
      get v1_user_followers_path(user_id: 999_999)
      assert_response :not_found
    end
  end
end
