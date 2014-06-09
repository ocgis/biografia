class Reference < ActiveRecord::Base
  has_paper_trail

  has_many :position_in_pictures

  def other_object(object)
    if (object.class.name == type1) and (object.id == id1)
      other = type2.constantize.find(id2)
    elsif (object.class.name == type2) and (object.id == id2)
      other = type1.constantize.find(id1)
    else
      raise StandardError, "object: #{object.inspect} reference: #{self.inspect}"
    end
    return other
  end
end
