class EventDate < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods
  
  has_and_belongs_to_many :references

  def controller
    return "event_dates"
  end

  def one_line
    return date
  end

end
