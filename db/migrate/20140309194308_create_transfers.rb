class CreateTransfers < ActiveRecord::Migration
  def change
    create_table :transfers do |t|
      t.string :file_name,    null: false
      t.string :content_type, null: false

      t.timestamps
    end
  end
end
