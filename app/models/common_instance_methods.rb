module CommonInstanceMethods
  def add_reference(referenced_object, options={})
    defaults = {
      :role => nil,
    }
    options = defaults.merge(options)
    reference = Reference.create(:name  => options[:role],
                                 :type1 => referenced_object.class.name,
                                 :id1   => referenced_object.id,
                                 :type2 => self.class.name,
                                 :id2   => self.id)

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

  def get_references
    return Reference.where("(type1 = ? AND id1 = ?) OR (type2 = ? AND id2 = ?)", self.class.name, self.id, self.class.name, self.id)
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
