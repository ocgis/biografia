# -*- coding: utf-8 -*-
class Thing < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "things"
  end

  def one_line
    parts = []

    unless self.name.nil?
      parts.append(self.name)
    else
      parts.append(self.make) unless self.make.nil?
      parts.append(self.model) unless self.model.nil?
    end

    if parts.length == 0
      parts.append("Okänd sak")
    end

    return parts.join(', ')
  end

  def self.filtered_search(filters)
    things = Thing.all

    filters.each do |filter|
      fields = ["name", "make", "model", "serial"]
      query = fields.collect{|field| "#{field} LIKE \"%#{filter}%\""}.join(" OR ")
      things = things.where(query)
    end
    things = things.first(100)

    return things
  end

  def all_attributes
    attributes
  end
end
