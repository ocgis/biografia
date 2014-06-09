class Event < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "events"
  end

  def one_line
    return name
  end

end
