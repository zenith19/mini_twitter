require 'test_helper'

module V1
  class CommentsControllerTest < ActionDispatch::IntegrationTest
    test 'the comment index is public and scoped to the post' do
      get v1_post_comments_path(posts(:alice_post))

      assert_response :ok
      assert_equal 2, json_body['comments'].length
    end

    test 'the index 404s for a missing post' do
      get v1_post_comments_path(post_id: 999_999)
      assert_response :not_found
    end

    test 'creating requires authentication' do
      post v1_comments_path,
           params: { comment: { content: 'Hi', post_id: posts(:alice_post).id } },
           as: :json

      assert_response :unauthorized
    end

    test 'an authenticated user can comment' do
      assert_difference 'Comment.count', 1 do
        post v1_comments_path,
             params: { comment: { content: 'Hi', post_id: posts(:alice_post).id } },
             headers: auth_headers_for(users(:alice)),
             as: :json
      end
      assert_response :created
    end

    test 'an invalid comment returns 422, not 201' do
      # The failure branch used to render status: :created.
      post v1_comments_path,
           params: { comment: { content: '', post_id: posts(:alice_post).id } },
           headers: auth_headers_for(users(:alice)),
           as: :json

      assert_response 422
    end

    test 'a non-owner cannot delete somebody elses comment' do
      assert_no_difference 'Comment.count' do
        delete v1_comment_path(comments(:bob_on_alice)), headers: auth_headers_for(users(:alice))
      end
      assert_response :not_found
    end

    test 'an owner can delete their own comment' do
      assert_difference 'Comment.count', -1 do
        delete v1_comment_path(comments(:bob_on_alice)), headers: auth_headers_for(users(:bob))
      end
      assert_response :no_content
    end
  end
end
