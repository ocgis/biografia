class AddHomeObjectNameToUsers < ActiveRecord::Migration
  def change
    add_column :users, :home_object_name, :string
  end
end
