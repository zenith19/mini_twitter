require 'test_helper'

class V1::UserFollowingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get v1_user_followings_index_url
    assert_response :success
  end

end
