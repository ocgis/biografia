class AddAssociationIndices < ActiveRecord::Migration
  def change
    add_index :addresses_references, :address_id
    add_index :addresses_references, :reference_id
    add_index :event_dates_references, :event_date_id
    add_index :event_dates_references, :reference_id
    add_index :events_references, :event_id
    add_index :events_references, :reference_id
    add_index :media_references, :medium_id
    add_index :media_references, :reference_id
    add_index :notes_references, :note_id
    add_index :notes_references, :reference_id
    add_index :people_references, :person_id
    add_index :people_references, :reference_id
    add_index :references_relationships, :relationship_id
    add_index :references_relationships, :reference_id
  end
end
