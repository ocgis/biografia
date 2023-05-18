class Reference < ActiveRecord::Base
  has_paper_trail

  has_many :position_in_pictures
  accepts_nested_attributes_for :position_in_pictures, allow_destroy: true

  def self.add(object1, object2, options={})
    defaults = {
      :role => nil,
      :ts_by_objects => false
    }
    options = defaults.merge(options)
    reference = Reference.new(:name  => options[:role],
                              :type1 => object1.class.name,
                              :id1   => object1.id,
                              :type2 => object2.class.name,
                              :id2   => object2.id)
    if options[:ts_by_objects]
      if object1.created_at > object2.created_at
        latest = object1
      else
        latest = object2
      end
      reference.created_at = latest.created_at
      reference.updated_at = latest.updated_at
    end

    unless reference.save
      raise StandardError, "Could not save #{reference.inspect}"
    end

    return reference
  end

  def other_object_type_and_id(object)
    if (object.class.name == type1) and (object.id == id1)
      other = OpenStruct.new({ type: type2.constantize, id: id2 })
    elsif (object.class.name == type2) and (object.id == id2)
      other = OpenStruct.new({ type: type1.constantize, id: id1 })
    else
      raise StandardError, "object: #{object.inspect} reference: #{self.inspect}"
    end
    return other
  end

  def other_object(object)
    o = other_object_type_and_id(object)
    return o.type.find(o.id)
  end

  def replace_object(old, new)
    if (old.class.name == self.type1) and (old.id == self.id1)
      self.type1 = new.class.name
      self.id1 = new.id
    elsif (old.class.name == self.type2) and (old.id == self.id2)
      self.type2 = new.class.name
      self.id2 = new.id
    else
      raise StandardError, "old: #{old.inspect} reference: #{self.inspect}"
    end
  end

  def self.get_references_from_object(object, options = {})
    defaults = {
      :role  => nil,
      :model => nil
    }
    options = defaults.merge(options)

    if options[:role].nil?
      if options[:model].nil?
        return Reference.where("(type1 = ? AND id1 = ?) OR (type2 = ? AND id2 = ?)",
                               object.class.name, object.id,
                               object.class.name, object.id)
      else
        return Reference.where("(type1 = ? AND id1 = ? AND type2 = ?) OR (type2 = ? AND id2 = ? AND type1 = ?)",
                               object.class.name, object.id, options[:model].name,
                               object.class.name, object.id, options[:model].name)
      end
    else # has role
      if options[:model].nil?
        return Reference.where("((type1 = ? AND id1 = ?) OR (type2 = ? AND id2 = ?)) AND (name = ?)",
                               object.class.name, object.id, object.class.name, object.id, options[:role])
      else
        return Reference.where("((type1 = ? AND id1 = ? AND type2 = ?) OR (type2 = ? AND id2 = ? AND type1 = ?)) AND (name = ?)",
                               object.class.name, object.id, options[:model].name,
                               object.class.name, object.id, options[:model].name, options[:role])
      end
    end
  end

  def self.get_references_between_objects(object1, object2)
    return Reference.where("(type1 = ? AND id1 = ? AND type2 = ? AND id2 = ?) OR (type2 = ? AND id2 = ? AND type1 = ? AND id1 = ?)",
                           object1.class.name, object1.id, object2.class.name, object2.id,
                           object1.class.name, object1.id, object2.class.name, object2.id)
  end

  def self.references_for_objects(objects)
    query =
      objects.map do |object|
        "(type1 = '#{object.class.name}' AND id1 = #{object.id}) OR " \
        "(type2 = '#{object.class.name}' AND id2 = #{object.id})"
      end.join(' OR ')

    Reference.where(query)
  end

  def self.ids_in_references(references)
    references.map do |reference|
      [
        { _type_: reference.type1, id: reference.id1 },
        { _type_: reference.type2, id: reference.id2 }
      ]
    end.flatten
  end

  def all_attributes
    attributes
  end
end
