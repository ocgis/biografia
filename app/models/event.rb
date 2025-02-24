# frozen_string_literal: true

# This is the event model
class Event < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'events'
  end

  def one_line
    name
  end

  def self.filtered_search(filters)
    events = Event.all

    filters.each do |filter|
      fields = ['name']
      query = fields.collect { |field| "#{field} LIKE \"%#{filter}%\"" }.join(' OR ')
      events = events.where(query)
    end
    events.first(100)
  end

  def limited_attributes
    attributes.update({ _type_: 'Event' })
  end

  def all_attributes
    limited_attributes.update(extras)
  end

  def self.with_associations
    self
  end
end
