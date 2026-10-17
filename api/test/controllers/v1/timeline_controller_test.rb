require 'test_helper'

module V1
  class TimelineControllerTest < ActionDispatch::IntegrationTest
    test 'requires authentication' do
      get v1_timeline_path
      assert_response :unauthorized
    end

    test 'returns posts by followed users and your own, newest first' do
      # alice follows bob; carol follows alice but alice does not follow back.
      get v1_timeline_path, headers: auth_headers_for(users(:alice))

      assert_response :ok
      titles = json_body['posts'].map { |p| p['title'] }
      assert_equal ['Alice writes again', "Bob's only post", "Alice's first post"], titles
    end

    test 'excludes posts by people you do not follow' do
      # bob follows nobody, so he should see only his own post.
      get v1_timeline_path, headers: auth_headers_for(users(:bob))

      assert_response :ok
      assert_equal ["Bob's only post"], json_body['posts'].map { |p| p['title'] }
    end

    test 'includes your own posts even with no follows' do
      get v1_timeline_path, headers: auth_headers_for(users(:bob))

      authors = json_body['posts'].map { |p| p['user']['username'] }.uniq
      assert_equal ['bob'], authors
    end

    test 'picks up a new post as soon as you follow its author' do
      assert_equal ["Bob's only post"],
                   begin
                     get v1_timeline_path, headers: auth_headers_for(users(:bob))
                     json_body['posts'].map { |p| p['title'] }
                   end

      UserFollowing.create!(user: users(:bob), following_user: users(:carol))
      users(:carol).posts.create!(title: 'Carol speaks', content: 'Hello')

      get v1_timeline_path, headers: auth_headers_for(users(:bob))
      assert_includes json_body['posts'].map { |p| p['title'] }, 'Carol speaks'
    end

    test 'is paginated' do
      get v1_timeline_path, params: { per_page: 1 }, headers: auth_headers_for(users(:alice))

      assert_equal 1, json_body['posts'].length
      assert_equal 3, json_body['meta']['total_count']
    end

    test 'the public feed still shows everyone' do
      # /v1/posts is unchanged: it is the "everything" list.
      get v1_posts_path
      assert_equal 3, json_body['meta']['total_count']
    end
  end
end
