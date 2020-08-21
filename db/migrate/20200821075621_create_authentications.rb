class CreateAuthentications < ActiveRecord::Migration[6.0]
  def change
    create_table :authentications do |t|
      t.string :userId
      t.string :password_digest
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
