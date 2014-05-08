class Note < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "notes"
  end

  def one_line
    return title
  end

end
