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
      ['addresses', 'event_dates', 'events', 'media', 'notes', 'people', 'relationships' ].each do |obj_type| # FIXME: Add media
        retval[obj_type.to_sym] = retval[obj_type.to_sym] + (reference.send(obj_type).map do |elem|
          if elem != self
            { :object => elem, :referenceId => reference.id }
          else
            nil
          end
        end).compact
      end
    end

    return retval
  end

  def object_name
    return "#{self.class.name}:#{id}"
  end

  def positions_in_object
    positions = []
# FIXME: Implement
#    references.each do |reference|
#      position = reference.position_in_pictures
      
#      if !reference.position_in_pictures
#        if relation.id1 == id
#          obj = CommonId.find(relation.id2).object
#        else
#          obj = CommonId.find(relation.id1).object
#        end
        
#        positions.push( { :object => obj, :position => position[0] } )
#      end
#    end
    positions  
  end

end
