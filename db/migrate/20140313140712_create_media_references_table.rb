class CreateMediaReferencesTable < ActiveRecord::Migration
  def change
    create_table :media_references, id: false do |t|
      t.integer :medium_id
      t.integer :reference_id
    end
  end
end
