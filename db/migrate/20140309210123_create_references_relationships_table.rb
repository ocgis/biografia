class CreateReferencesRelationshipsTable < ActiveRecord::Migration
  def change
    create_table :references_relationships, id: false do |t|
      t.integer :reference_id
      t.integer :relationship_id
    end
  end
end
