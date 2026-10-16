require 'test_helper'

module V1
  class SessionsControllerTest < ActionDispatch::IntegrationTest
    test 'valid credentials return 201 and a token' do
      post v1_sessions_path, params: { email: 'alice@example.com', password: 'password123' }, as: :json

      assert_response :created
      assert json_body['authentication_token'].present?
      assert_equal users(:alice).id, json_body['id']
    end

    test 'the email match is case insensitive' do
      post v1_sessions_path, params: { email: 'ALICE@example.com', password: 'password123' }, as: :json
      assert_response :created
    end

    test 'a wrong password returns 401, not 200' do
      post v1_sessions_path, params: { email: 'alice@example.com', password: 'nope' }, as: :json

      assert_response :unauthorized
      assert_nil json_body['authentication_token']
    end

    test 'an unknown email returns 401' do
      post v1_sessions_path, params: { email: 'nobody@example.com', password: 'password123' }, as: :json
      assert_response :unauthorized
    end

    test 'the returned token authenticates subsequent requests' do
      post v1_sessions_path, params: { email: 'alice@example.com', password: 'password123' }, as: :json
      token = json_body['authentication_token']

      post v1_posts_path,
           params: { post: { title: 'Hello', content: 'World' } },
           headers: { 'Authorization' => "Bearer #{token}" },
           as: :json

      assert_response :created
    end

    test 'logging out revokes the token' do
      headers = auth_headers_for(users(:alice))

      delete v1_sessions_path, headers: headers
      assert_response :no_content

      post v1_posts_path,
           params: { post: { title: 'x', content: 'y' } },
           headers: headers,
           as: :json
      assert_response :unauthorized
    end
  end
end
