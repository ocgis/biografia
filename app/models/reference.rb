class Reference < ActiveRecord::Base
  has_and_belongs_to_many :addresses
  has_and_belongs_to_many :event_dates
  has_and_belongs_to_many :events
  has_and_belongs_to_many :media
  has_and_belongs_to_many :notes
  has_and_belongs_to_many :people
  has_and_belongs_to_many :relationships

  has_many :position_in_pictures
end
