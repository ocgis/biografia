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

  def self.filtered_search(filters)
    events = Event.all

    filters.each do |filter|
      fields = ["name"]
      query = fields.collect{|field| "#{field} LIKE \"%#{filter}%\""}.join(" OR ")
      events = events.where(query)
    end
    events = events.first(100)

    return events
  end

  def all_attributes
    attributes
  end
end
