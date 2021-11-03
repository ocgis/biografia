# frozen_string_literal: true

# Methods that are common among all models
module CommonInstanceMethods
  def add_reference(referenced_object, options = {})
    Reference.add(self, referenced_object, options)
  end

  def get_or_add_reference(referenced_object, options = {})
    references = get_references_to_object(referenced_object)
    case references.length
    when 1
      reference = references[0]
    when 0
      reference = Reference.add(self, referenced_object, options)
    else
      raise StandardError, "ERROR: More than one reference between objects! #{inspect} #{referenced_object.inspect}"
    end
    reference
  end

  def destroy_with_references
    get_references.each(&:destroy)
    destroy
  end

  def related_objects
    retval = { object: self,
               people: [],
               events: [],
               addresses: [],
               notes: [],
               event_dates: [],
               relationships: [],
               media: [],
               things: [],
               unhandled_types: [] }

    referenced = {}
    get_references.each do |reference|
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

    retval
  end

  def object_name
    "#{self.class.name}_#{id}"
  end

  def positions_in_object
    positions = []
    get_references.each do |reference|
      position = reference.position_in_pictures

      next if position.empty?

      obj = reference.other_object(self)
      positions.push({ object: obj,
                       position: position[0] })
    end
    positions
  end

  def get_references(options = {})
    Reference.get_references_from_object(self, options)
  end

  def get_references_to_object(referenced)
    Reference.get_references_between_objects(self, referenced)
  end

  def find_identical
    self.class.where(attributes.except('id', 'source', 'created_at', 'updated_at')).where.not(id: id)
  end

  def merge_references_destroy_others(others)
    others.each do |merged|
      references = merged.get_references
      references.each do |reference|
        reference.replace_object(merged, self)
        raise StandardError, "Could not save object: #{reference.pretty_inspect}" unless reference.save
      end
      raise StandardError, "Could not destroy object: #{merged.pretty_inspect}" unless merged.destroy
    end
  end

  def set_extra(key, value)
    @extras = {} if @extras.nil?
    @extras[key] = value
  end

  def get_extra(key = nil)
    if @extras.nil?
      nil
    elsif key.nil?
      @extras
    else
      @extras[key]
    end
  end

  def extras
    if @extras.nil?
      {}
    else
      @extras
    end
  end

  def version_info
    version = versions.last

    return if version.nil? || version.whodunnit.nil?

    { name: User.find(version.whodunnit).name,
      date: updated_at.strftime('%Y-%m-%d %H:%M') }
  end
end
