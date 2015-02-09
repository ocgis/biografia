class CreateImports < ActiveRecord::Migration
  def change
    create_table :imports do |t|
      t.string :file_name, null: false
      t.string :content_type, null: false
      t.string :status, limit: 1024, default: 'INIT'

      t.timestamps
    end
  end
end
