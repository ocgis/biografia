class CreateAddressesReferencesTable < ActiveRecord::Migration
  def change
    create_table :addresses_references, id: false do |t|
      t.integer :address_id
      t.integer :reference_id
    end
  end
end
