class StrengthenUsers < ActiveRecord::Migration[7.1]
  def change
    # Tokens are now stored as a SHA256 hex digest, which needs 64 chars;
    # the old column was limit: 30, sized for the plaintext token.
    change_column :users, :authentication_token, :string, limit: 64
    add_index :users, :authentication_token, unique: true

    change_column_null :users, :name, false
    change_column_null :users, :username, false
    add_index :users, 'lower(username)', unique: true, name: 'index_users_on_lower_username'
  end
end
