class CreateEstablishment < ActiveRecord::Migration[7.0]
  def change
    create_table :establishments do |t|
      t.string :name
      t.string :kind

      t.timestamps
    end
  end
end
