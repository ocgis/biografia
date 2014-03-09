class CreateEventsReferencesTable < ActiveRecord::Migration
  def change
    create_table :events_references, id: false do |t|
      t.integer :event_id
      t.integer :reference_id
    end
  end
end
