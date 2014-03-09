class CreateRelationships < ActiveRecord::Migration
  def change
    create_table :relationships do |t|
      t.text :name

      t.timestamps
    end
  end
end
