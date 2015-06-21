class CreateThings < ActiveRecord::Migration
  def change
    create_table :things do |t|
      t.string :name
      t.string :kind
      t.string :make
      t.string :model
      t.string :serial

      t.timestamps
    end
  end
end
