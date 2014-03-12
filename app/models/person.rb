class Person < ActiveRecord::Base
  has_and_belongs_to_many :references

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "people"
  end

  def short_name
    names = [ self.calling_name, self.surname ]
    names.compact!
    return names.join(" ")
  end

  def long_name
    names = [ self.given_name, self.surname ]
    names.compact!
    return names.join(" ")
  end
  
  def name
    short_name
  end

  #FIXME: Implement
  #FIXME: Add test
  def find_parents
    return []
  end

  #FIXME: Implement
  #FIXME: Add test
  def find_spouses
    return []
  end

  #FIXME: Implement
  #FIXME: Add test
  def find_children
    return []
  end
end
