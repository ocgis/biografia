class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :street,   :limit => 80
      t.string :town,     :limit => 80
      t.string :zipcode,  :limit => 20
      t.string :parish,   :limit => 80
      t.string :country,  :limit => 80

      t.timestamps
    end
  end
end
