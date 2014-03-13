class CreateMedia < ActiveRecord::Migration
  def change
    create_table :media do |t|
      t.text :file_name

      t.timestamps
    end
  end
end
