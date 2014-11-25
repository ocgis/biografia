module CommonInstanceMethods
  def add_reference(referenced_object, options={})
    return Reference.add(self, referenced_object, options)
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

    self.get_references.each do |reference|
      object = reference.other_object(self)
      object.set_extra(:reference, reference)
      retval[object.controller.to_sym].append(object)
    end

    return retval
  end

  def object_name
    return "#{self.class.name}_#{id}"
  end

  def positions_in_object
    positions = []
    get_references.each do |reference|
      position = reference.position_in_pictures
      
      if position.length > 0
        obj = reference.other_object(self)
        obj.set_extra(:position, position[0])        
        positions.push(obj)
      end
    end
    return positions  
  end

  def get_references(options = {})
    return Reference.get_references_from_object(self, options)
  end
  
  def get_references_to_object(referenced)
    return Reference.get_references_between_objects(self, referenced)
  end

  def set_extra(k, v)
    @extras = {} if @extras.nil?
    @extras[k] = v
  end
  
  def get_extra(key)
    if @extras.nil?
      return nil
    else
      return @extras[key]
    end
  end
end
