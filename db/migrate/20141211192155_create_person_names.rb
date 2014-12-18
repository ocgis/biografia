class CreatePersonNames < ActiveRecord::Migration
  def change
    create_table :person_names do |t|
      t.integer :position
      t.string  :given_name,   limit: 80
      t.string  :calling_name, limit: 80
      t.string  :surname,      limit: 80

      t.integer :person_id

      t.timestamps
    end
  end
end
