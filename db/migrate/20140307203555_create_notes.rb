class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :category
      t.string :title
      t.text :note

      t.string :source

      t.timestamps
    end
  end
end
