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
      retval[object.controller.to_sym].append({:object => object, :reference => reference })
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
        positions.push( { :object => obj, :position => position[0] } )
      end
    end
    return positions  
  end

  def get_references
    return Reference.where("(type1 = ? AND id1 = ?) OR (type2 = ? AND id2 = ?)", self.class.name, self.id, self.class.name, self.id)
  end
end
