# frozen_string_literal: true

# Change latitude / longitude to decimal with sufficient precision
class ChangePositionToDecimal < ActiveRecord::Migration[6.1]
  def up
    change_table :addresses do |t|
      t.change :latitude, :decimal, precision: 13, scale: 9
      t.change :longitude, :decimal, precision: 13, scale: 9
    end
  end

  def down
    change_table :addresses do |t|
      t.change :latitude, :float
      t.change :longitude, :float
    end
  end
end
