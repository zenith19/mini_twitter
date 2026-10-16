require 'test_helper'

# Covers the Authenticatable concern, which replaced the `authenticate`
# method copy-pasted into five controllers.
module V1
  class AuthenticationTest < ActionDispatch::IntegrationTest
    test 'a missing Authorization header returns 401, not 500' do
      # The old implementation called .delete_suffix('nil') on a nil header,
      # raising NoMethodError.
      post v1_posts_path, params: { post: { title: 'x', content: 'y' } }, as: :json

      assert_response :unauthorized
      assert_equal 'Unauthorized', json_body['error']
    end

    test 'a malformed Authorization header returns 401' do
      post v1_posts_path,
           params: { post: { title: 'x', content: 'y' } },
           headers: { 'Authorization' => 'Basic abc123' },
           as: :json

      assert_response :unauthorized
    end

    test 'an unknown token returns 401' do
      post v1_posts_path,
           params: { post: { title: 'x', content: 'y' } },
           headers: { 'Authorization' => 'Bearer not-a-real-token' },
           as: :json

      assert_response :unauthorized
    end

    test 'the raw token from the database does not authenticate' do
      # Only the digest is stored, so replaying the stored value must fail.
      users(:alice).issue_authentication_token!
      stored = users(:alice).reload.authentication_token

      post v1_posts_path,
           params: { post: { title: 'x', content: 'y' } },
           headers: { 'Authorization' => "Bearer #{stored}" },
           as: :json

      assert_response :unauthorized
    end

    test 'a valid token is accepted' do
      post v1_posts_path,
           params: { post: { title: 'x', content: 'y' } },
           headers: auth_headers_for(users(:alice)),
           as: :json

      assert_response :created
    end
  end
end
