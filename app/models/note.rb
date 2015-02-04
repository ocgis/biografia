class Note < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "notes"
  end

  def one_line
    unless title.nil?
      return title
    else
      if note.length > 0
        return note.split("\n")[0]
      else
        return ''
      end
    end
  end

end
