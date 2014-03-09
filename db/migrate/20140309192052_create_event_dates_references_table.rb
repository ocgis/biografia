class CreateEventDatesReferencesTable < ActiveRecord::Migration
  def change
    create_table :event_dates_references, id: false do |t|
      t.integer :event_date_id
      t.integer :reference_id
    end
  end
end
