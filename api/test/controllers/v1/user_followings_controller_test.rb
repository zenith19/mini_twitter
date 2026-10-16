require 'test_helper'

module V1
  class UserFollowingsControllerTest < ActionDispatch::IntegrationTest
    test 'show lists who a user follows' do
      get v1_user_followings_path(users(:alice))

      assert_response :ok
      assert_equal ['bob'], json_body['users'].map { |u| u['username'] }
    end

    test 'following requires authentication' do
      assert_no_difference 'UserFollowing.count' do
        post v1_follows_path, params: { following_user_id: users(:carol).id }, as: :json
      end
      assert_response :unauthorized
    end

    test 'an authenticated user can follow somebody new' do
      assert_difference 'UserFollowing.count', 1 do
        post v1_follows_path,
             params: { following_user_id: users(:carol).id },
             headers: auth_headers_for(users(:alice)),
             as: :json
      end
      assert_response :created
    end

    test 'following the same person twice returns 422' do
      assert_no_difference 'UserFollowing.count' do
        post v1_follows_path,
             params: { following_user_id: users(:bob).id },
             headers: auth_headers_for(users(:alice)),
             as: :json
      end
      assert_response 422
    end

    test 'following yourself returns 422' do
      post v1_follows_path,
           params: { following_user_id: users(:alice).id },
           headers: auth_headers_for(users(:alice)),
           as: :json

      assert_response 422
    end

    test 'unfollowing actually deletes the row' do
      # The old implementation called .destroy on an ActiveRecord::Relation,
      # which raises rather than deleting anything.
      assert_difference 'UserFollowing.count', -1 do
        delete v1_follow_path(users(:bob)), headers: auth_headers_for(users(:alice))
      end
      assert_response :no_content
    end

    test 'unfollowing somebody you do not follow returns 404' do
      delete v1_follow_path(users(:carol)), headers: auth_headers_for(users(:alice))
      assert_response :not_found
    end

    test 'you cannot delete a follow row belonging to somebody else' do
      # carol follows alice; bob must not be able to undo that.
      assert_no_difference 'UserFollowing.count' do
        delete v1_follow_path(users(:alice)), headers: auth_headers_for(users(:bob))
      end
      assert_response :not_found
    end
  end
end
