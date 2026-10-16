require 'test_helper'

module V1
  class PostsControllerTest < ActionDispatch::IntegrationTest
    test 'the index is public, newest first, and paginated' do
      get v1_posts_path

      assert_response :ok
      titles = json_body['posts'].map { |p| p['title'] }
      assert_equal ['Alice writes again', "Bob's only post", "Alice's first post"], titles
      assert_equal 3, json_body['meta']['total_count']
    end

    test 'the index embeds the author instead of a bare user_id' do
      get v1_posts_path

      author = json_body['posts'].first['user']
      assert_equal 'alice', author['username']
      assert_not_includes author.keys, 'email'
    end

    test 'per_page is honoured and clamped' do
      get v1_posts_path, params: { per_page: 2 }
      assert_equal 2, json_body['posts'].length

      get v1_posts_path, params: { per_page: 5000 }
      assert_equal 100, json_body['meta']['per_page']
    end

    test 'show returns 404 for a missing post rather than raising' do
      get v1_post_path(id: 999_999)
      assert_response :not_found
    end

    test 'creating requires authentication' do
      assert_no_difference 'Post.count' do
        post v1_posts_path, params: { post: { title: 'x', content: 'y' } }, as: :json
      end
      assert_response :unauthorized
    end

    test 'the author comes from the token, not the request body' do
      # Passing somebody else's user_id must not change the author.
      post v1_posts_path,
           params: { post: { title: 'Mine', content: 'Body', user_id: users(:bob).id } },
           headers: auth_headers_for(users(:alice)),
           as: :json

      assert_response :created
      assert_equal users(:alice).id, Post.find(json_body['post']['id']).user_id
    end

    test 'an invalid post returns 422 with the validation errors' do
      post v1_posts_path,
           params: { post: { title: '', content: '' } },
           headers: auth_headers_for(users(:alice)),
           as: :json

      assert_response 422
      assert_includes json_body['errors'].keys, 'title'
    end

    test 'an owner can update their own post' do
      patch v1_post_path(posts(:alice_post)),
            params: { post: { title: 'Edited' } },
            headers: auth_headers_for(users(:alice)),
            as: :json

      assert_response :ok
      assert_equal 'Edited', posts(:alice_post).reload.title
    end

    test 'a non-owner cannot update somebody elses post' do
      original = posts(:bob_post).title

      patch v1_post_path(posts(:bob_post)),
            params: { post: { title: 'Hijacked' } },
            headers: auth_headers_for(users(:alice)),
            as: :json

      assert_response :not_found
      assert_equal original, posts(:bob_post).reload.title
    end

    test 'a non-owner cannot delete somebody elses post' do
      assert_no_difference 'Post.count' do
        delete v1_post_path(posts(:bob_post)), headers: auth_headers_for(users(:alice))
      end
      assert_response :not_found
    end

    test 'an owner can delete their own post' do
      assert_difference 'Post.count', -1 do
        delete v1_post_path(posts(:alice_post)), headers: auth_headers_for(users(:alice))
      end
      assert_response :no_content
    end
  end
end
