class EventDate < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods
  
  def controller
    return "event_dates"
  end

  def one_line
    return date.to_s
  end

end
