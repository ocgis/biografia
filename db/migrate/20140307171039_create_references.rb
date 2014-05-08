class CreateReferences < ActiveRecord::Migration
  def change
    create_table :references do |t|
      t.string :name
      t.string :type1, null: false
      t.integer :id1, null: false
      t.string :type2, null: false
      t.integer :id2, null: false

      t.timestamps
    end

    add_index :references, [:type1, :id1]
    add_index :references, [:type2, :id2]
  end
end
