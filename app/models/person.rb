class Person < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def short_name
    return self.calling_name + " " + self.surname
  end

  def long_name
    return self.given_name + " " + self.surname
  end
  
  def name
    short_name
  end  
end
