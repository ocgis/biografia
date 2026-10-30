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

  def self.filtered_search(filters, match_all: true)
    filter_queries = filters.map do |filter|
      fields = %w[name]
      field_queries = fields.collect { |field| "#{field} LIKE \"%#{filter}%\"" }.join(' OR ')
      "(#{field_queries})"
    end
    separator = match_all ? ' AND ' : ' OR '
    query = filter_queries.join(separator)
    establishments = Establishment.where(query)
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

  def hint
    objects = []
    related_objects[:addresses].each do |address|
      objects.concat(address.hint_by_position)
    end

    objects
  end

  private

  def ids(id_list)
    id_list.map do |elem|
      elem[:id]
    end
  end
end
