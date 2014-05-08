class Medium < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "media"
  end

end
