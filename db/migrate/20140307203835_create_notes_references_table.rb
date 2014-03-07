class CreateNotesReferencesTable < ActiveRecord::Migration
  def change
    create_table :notes_references, id: false do |t|
      t.integer :note_id
      t.integer :reference_id
    end
  end
end
