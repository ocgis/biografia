class Event < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "events"
  end

  def one_line
    return name
  end

end
