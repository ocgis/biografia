class EventDate < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods
  
  def controller
    return "event_dates"
  end

  def one_line
    return get_date
  end

  def get_date
    if self.mask.nil?
      return self.date.to_s
    elsif self.mask == "YYYY-MM-DD"
      return self.date.strftime("%Y-%m-%d")
    elsif self.mask == "YYYY-MM-DD hh:mm"
      return self.date.strftime("%Y-%m-%d %H:%M")
    else
      return "Unknown mask #{self.mask} #{self.date.to_s}"
    end
  end
  
  def set_date(dstr)
    m = dstr.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/)
    if not m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i, m[3].to_i)
      self.mask = "YYYY-MM-DD"
      return true
    end
    
    m = dstr.match(/^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)$/)
    if not m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i, m[3].to_i, m[4].to_i, m[5].to_i)
      self.mask = "YYYY-MM-DD hh:mm"
      return true
    end
    
    raise StandardError, "Could not set date #{dstr}"
  end

end
