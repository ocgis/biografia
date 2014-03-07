class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.string "given_name",   :limit => 80
      t.string "calling_name", :limit => 80
      t.string "surname",      :limit => 80
      t.string "sex",          :limit => 1

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
