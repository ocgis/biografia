module CommonInstanceMethods
  def add_reference(referenced_object, options={})
    defaults = {
      :role => nil,
    }
    options = defaults.merge(options)
    reference = Reference.create(:name => options[:role])
    self.references << reference
    referenced_object.references << reference
  end

  def related_objects
    retval = { :object => self,
               :people => [],
               :events => [],
               :addresses => [],
               :notes => [],
               :event_dates => [],
               :relationships => [],
               :medias => [],
               :unhandled_types => [] }

    self.references.each do |reference|
      retval[:addresses] = retval[:addresses] + reference.addresses
      retval[:event_dates] = retval[:event_dates] + reference.event_dates
      retval[:events] = retval[:events] + reference.events
      retval[:notes] = retval[:notes] + reference.notes
      retval[:people] = retval[:people] + reference.people
      retval[:relationships] = retval[:relationships] + reference.relationships
#FIXME:      retval[:media] = retval[:media] + reference.media
    end

    return retval
  end
end
