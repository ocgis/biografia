class AddTimezoneOffsetToEventDate < ActiveRecord::Migration[7.0]
  def change
    add_column :event_dates, :timezone_offset, :integer
  end
end
