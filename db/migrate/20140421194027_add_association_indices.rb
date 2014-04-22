class AddAssociationIndices < ActiveRecord::Migration
  def change
    add_index :addresses_references, :address_id, :name => 'address_id_ix'
    add_index :addresses_references, :reference_id, :name => 'reference_id_ix'
    add_index :event_dates_references, :event_date_id, :name => 'event_date_id_ix'
    add_index :event_dates_references, :reference_id, :name => 'reference_id_ix'
    add_index :events_references, :event_id, :name => 'event_id_ix'
    add_index :events_references, :reference_id, :name => 'reference_id_ix'
    add_index :media_references, :medium_id, :name => 'medium_id_ix'
    add_index :media_references, :reference_id, :name => 'reference_id_ix'
    add_index :notes_references, :note_id, :name => 'note_id_ix'
    add_index :notes_references, :reference_id, :name => 'reference_id_ix'
    add_index :people_references, :person_id, :name => 'person_id_ix'
    add_index :people_references, :reference_id, :name => 'reference_id_ix'
    add_index :references_relationships, :relationship_id, :name => 'relationship_id_ix'
    add_index :references_relationships, :reference_id, :name => 'reference_id_ix'
  end
end
