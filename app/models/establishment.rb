# frozen_string_literal: true

# Implementation of the establishment model
class Establishment < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'establishments'
  end

  def one_line
    parts = []

    parts.append(name) unless name.nil?

    parts.append('Okänd sak') if parts.length.zero?

    parts.join(', ')
  end

  def self.filtered_search(filters)
    establishments = Establishment.all

    filters.each do |filter|
      fields = %w[name]
      query = fields.collect { |field| "#{field} LIKE \"%#{filter}%\"" }.join(' OR ')
      establishments = establishments.where(query)
    end
    establishments.first(100)
  end

  def limited_attributes
    attributes.update({ _type_: 'Establishment' })
  end

  def all_attributes
    limited_attributes.update(extras)
  end

  def self.with_associations
    self
  end
end
