class WidenContentColumns < ActiveRecord::Migration[7.1]
  def change
    # Both were :string, i.e. varchar(255) — too short for a post body.
    change_column :posts, :content, :text
    change_column :comments, :content, :text

    change_column_null :posts, :user_id, false
    add_index :posts, :created_at
  end
end
