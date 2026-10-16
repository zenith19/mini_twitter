require 'test_helper'

class UserFollowingTest < ActiveSupport::TestCase
  test 'the same pair cannot be followed twice' do
    duplicate = UserFollowing.new(user: users(:alice), following_user: users(:bob))

    assert_not duplicate.valid?
    assert_includes duplicate.errors.attribute_names, :user_id
  end

  test 'the database rejects a duplicate pair even if validation is skipped' do
    duplicate = UserFollowing.new(user: users(:alice), following_user: users(:bob))

    assert_raises(ActiveRecord::RecordNotUnique) { duplicate.save!(validate: false) }
  end

  test 'a user cannot follow themselves' do
    follow = UserFollowing.new(user: users(:alice), following_user: users(:alice))

    assert_not follow.valid?
    assert_includes follow.errors.attribute_names, :following_user_id
  end

  test 'following a different user is allowed' do
    assert UserFollowing.new(user: users(:alice), following_user: users(:carol)).valid?
  end
end
