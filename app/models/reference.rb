class Reference < ActiveRecord::Base
  has_and_belongs_to_many :addresses
  has_and_belongs_to_many :event_dates
  has_and_belongs_to_many :events
  has_and_belongs_to_many :media
  has_and_belongs_to_many :notes
  has_and_belongs_to_many :people
  has_and_belongs_to_many :relationships

  has_many :position_in_pictures

  def other_object(object)
    objects = (self.addresses + self.event_dates + self.events + self.media + self.notes + self.people + self.relationships).compact
    if objects.length != 2
      Rails::logger.error("ERROR: Reference object should reference exactly two objects: #{objects.inspect}")
      raise StandardError
    end
    if object.object_name == objects[0].object_name
      other = objects[1]
    else
      other = objects[0]
    end
    return other
  end
end
