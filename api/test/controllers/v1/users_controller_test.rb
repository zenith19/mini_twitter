require 'test_helper'

module V1
  class UsersControllerTest < ActionDispatch::IntegrationTest
    test 'the user list does not leak email addresses to anonymous callers' do
      get v1_users_path

      assert_response :ok
      assert json_body['users'].none? { |u| u.key?('email') },
             'anonymous callers must not see email addresses'
    end

    test 'you can see your own email but not other peoples' do
      headers = auth_headers_for(users(:alice))

      get v1_user_path(users(:alice)), headers: headers
      assert_equal 'alice@example.com', json_body['user']['email']

      get v1_user_path(users(:bob)), headers: headers
      assert_not_includes json_body['user'].keys, 'email'
    end

    test 'the serializer reports whether you follow each user' do
      get v1_users_path, headers: auth_headers_for(users(:alice))

      by_username = json_body['users'].index_by { |u| u['username'] }
      assert_equal true,  by_username['bob']['following']
      assert_equal false, by_username['carol']['following']
    end

    test 'signing up returns 201 and a usable token' do
      assert_difference 'User.count', 1 do
        post v1_users_path,
             params: { name: 'Dan', username: 'dan', email: 'dan@example.com', password: 'password123' },
             as: :json
      end

      assert_response :created
      assert_equal users_count_token_user, User.find_by_authentication_token(json_body['authentication_token'])
    end

    test 'an invalid signup returns the validation errors, not a bare symbol' do
      assert_no_difference 'User.count' do
        post v1_users_path, params: { name: '', username: '', email: 'bad', password: 'x' }, as: :json
      end

      assert_response 422
      assert json_body['errors'].present?
    end

    test 'a duplicate username is rejected' do
      post v1_users_path,
           params: { name: 'Imposter', username: 'ALICE', email: 'imposter@example.com', password: 'password123' },
           as: :json

      assert_response 422
      assert_includes json_body['errors'].keys, 'username'
    end

    test 'show returns 404 for a missing user' do
      get v1_user_path(id: 999_999)
      assert_response :not_found
    end

    private

    def users_count_token_user
      User.find_by(email: 'dan@example.com')
    end
  end
end
