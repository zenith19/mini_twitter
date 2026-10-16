require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'requires a name, username and email' do
    user = User.new(password: 'password123')
    assert_not user.valid?
    assert_includes user.errors.attribute_names, :name
    assert_includes user.errors.attribute_names, :username
    assert_includes user.errors.attribute_names, :email
  end

  test 'usernames are unique regardless of case' do
    duplicate = User.new(
      name: 'Imposter', username: 'ALICE',
      email: 'imposter@example.com', password: 'password123'
    )
    assert_not duplicate.valid?
    assert_includes duplicate.errors.attribute_names, :username
  end

  test 'usernames reject punctuation' do
    user = users(:alice)
    user.username = 'not valid!'
    assert_not user.valid?
  end

  test 'issuing a token stores only its digest and returns the plaintext' do
    user = users(:alice)
    raw = user.issue_authentication_token!

    assert_not_equal raw, user.authentication_token
    assert_equal 64, user.authentication_token.length
    assert_equal Digest::SHA256.hexdigest(raw), user.authentication_token
  end

  test 'a token can be exchanged back for its user' do
    user = users(:alice)
    raw = user.issue_authentication_token!

    assert_equal user, User.find_by_authentication_token(raw)
  end

  test 'issuing a new token invalidates the previous one' do
    user = users(:alice)
    old = user.issue_authentication_token!
    user.issue_authentication_token!

    assert_nil User.find_by_authentication_token(old)
  end

  test 'a blank token never matches a user whose token is nil' do
    users(:bob).update!(authentication_token: nil)

    assert_nil User.find_by_authentication_token(nil)
    assert_nil User.find_by_authentication_token('')
  end

  test 'revoking clears the token' do
    user = users(:alice)
    raw = user.issue_authentication_token!
    user.revoke_authentication_token!

    assert_nil user.reload.authentication_token
    assert_nil User.find_by_authentication_token(raw)
  end

  test 'followings and followers are distinct associations' do
    assert_equal [users(:bob)], users(:alice).followings.to_a
    assert_equal [users(:carol)], users(:alice).followers.to_a
  end

  test 'deleting a user removes their posts and follow rows' do
    alice = users(:alice)
    assert_difference ['Post.count', 'UserFollowing.count'], -2 do
      alice.destroy
    end
  end
end
