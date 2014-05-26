class CreateEventDates < ActiveRecord::Migration
  def change
    create_table :event_dates do |t|
      t.datetime :date
      t.string   :mask

      t.timestamps
    end
  end
end
