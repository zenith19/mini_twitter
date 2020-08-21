class RenameColumnToAuthentications < ActiveRecord::Migration[6.0]
  def change
  	rename_column :authentications, :userId, :user_name
  end
end
