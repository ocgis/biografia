# coding: utf-8
# frozen_string_literal: true

# Implementation of the thing class
class Thing < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'things'
  end

  def one_line
    parts = []

    if !name.nil?
      parts.append(name)
    else
      parts.append(make) unless make.nil?
      parts.append(model) unless model.nil?
    end

    parts.append('Okänd sak') if parts.length.zero?

    parts.join(', ')
  end

  def self.filtered_search(filters)
    things = Thing.all

    filters.each do |filter|
      fields = %w[name make model serial]
      query = fields.collect { |field| "#{field} LIKE \"%#{filter}%\"" }.join(' OR ')
      things = things.where(query)
    end
    things.first(100)
  end

  def all_attributes
    attributes.update({ type_: 'Thing' }).update(extras)
  end
end
