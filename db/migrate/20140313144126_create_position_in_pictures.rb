class CreatePositionInPictures < ActiveRecord::Migration
  def change
    create_table :position_in_pictures do |t|
      t.float :x
      t.float :y
      t.float :width
      t.float :height
      t.integer :reference_id

      t.timestamps
    end
  end
end
