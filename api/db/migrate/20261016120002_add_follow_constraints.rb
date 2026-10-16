class AddFollowConstraints < ActiveRecord::Migration[7.1]
  def change
    # following_user_id was a bare integer with no foreign key, so rows could
    # point at users that do not exist.
    change_column :user_followings, :following_user_id, :bigint, null: false
    add_foreign_key :user_followings, :users, column: :following_user_id

    # The controller's "Already Following" check was a read-then-write race;
    # this makes the database the source of truth.
    add_index :user_followings, %i[user_id following_user_id],
              unique: true, name: 'index_user_followings_on_pair'
    remove_index :user_followings, :user_id
  end
end
