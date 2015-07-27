module CommonInstanceMethods
  def add_reference(referenced_object, options={})
    return Reference.add(self, referenced_object, options)
  end

  def get_or_add_reference(referenced_object, options={})
    references = get_references_to_object(referenced_object)
    if references.length == 1
      reference = references[0]
    elsif references.length == 0
      reference = Reference.add(self, referenced_object, options)
    else
      raise StandardError, "ERROR: More than one reference between objects! #{self.inspect} #{referenced_object.inspect}"
    end
    return reference
  end

  def destroy_with_references
    self.get_references.each do |reference|
      reference.destroy
    end
    self.destroy
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
               :things => [],
               :unhandled_types => [] }

    referenced = {}
    self.get_references.each do |reference|
      o = reference.other_object_type_and_id(self)
      referenced[o.type] = (referenced[o.type] || {}).merge(o.id => reference)
    end

    referenced.each do |type, ids_refs|
      objects = type.find(ids_refs.keys)
      objects.each do |object|
        object.set_extra(:parent, self)
        object.set_extra(:reference, ids_refs[object.id])
        retval[object.controller.to_sym].append(object)
      end
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

  def find_identical
    return self.class.where(self.attributes.except("id", "source", "created_at", "updated_at")).where.not(id: self.id)
  end

  def merge_references_destroy_others(others)
    others.each do |merged|
      references = merged.get_references
      references.each do |reference|
        reference.replace_object(merged, self)
        unless reference.save
          raise StandardError, "Could not save object: #{reference.pretty_inspect}"
        end
      end
      unless merged.destroy
        raise StandardError, "Could not destroy object: #{merged.pretty_inspect}"
      end
    end
  end

  def set_extra(k, v)
    @extras = {} if @extras.nil?
    @extras[k] = v
  end
  
  def get_extra(key=nil)
    if @extras.nil?
      return nil
    elsif key.nil?
      return @extras
    else
      return @extras[key]
    end
  end

end
