module CommonInstanceMethods
  def add_reference(referenced_object, options={})
    defaults = {
      :role => nil,
    }
    options = defaults.merge(options)
    reference = Reference.create(:name => options[:role])
    self.references << reference
    referenced_object.references << reference

    return reference
  end

  def related_objects
    retval = { :object => self,
               :people => [],
               :events => [],
               :addresses => [],
               :notes => [],
               :event_dates => [],
               :relationships => [],
               :media => [],
               :unhandled_types => [] }

    self.references.each do |reference|
      ['addresses', 'event_dates', 'events', 'media', 'notes', 'people', 'relationships' ].each do |obj_type|
        retval[obj_type.to_sym] = retval[obj_type.to_sym] + (reference.send(obj_type).map do |elem|
          if elem != self
            { :object => elem, :reference => reference }
          else
            nil
          end
        end).compact
      end
    end

    return retval
  end

  def object_name
    return "#{self.class.name}_#{id}"
  end

  def positions_in_object
   positions = []
   references.each do |reference|
     position = reference.position_in_pictures
      
     if position.length > 0
       obj = reference.other_object(self)        
       positions.push( { :object => obj, :position => position[0] } )
     end
   end
   return positions  
  end

end
