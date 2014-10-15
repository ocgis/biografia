class CreateExports < ActiveRecord::Migration
  def change
    create_table :exports do |t|
      t.string :file_name,    null: false
      t.string :content_type, null: false

      t.timestamps
    end
  end
end
