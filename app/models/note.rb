class Note < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "notes"
  end

  def one_line
    return title
  end

end
