class CreatePeopleReferencesTable < ActiveRecord::Migration
  def change
    create_table :people_references, id: false do |t|
      t.integer :person_id
      t.integer :reference_id
    end
  end
end
