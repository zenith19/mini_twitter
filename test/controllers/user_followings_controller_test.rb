require 'test_helper'

class UserFollowingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get user_followings_index_url
    assert_response :success
  end

end
