# frozen_string_literal: true

require 'related'

# Implementation of the establishment model
class Establishment < ActiveRecord::Base
  include Related

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

  def hint
    objects = []
    related_objects[:addresses].each do |address|
      next if address.latitude.nil? && address.longitude.nil?

      distance_m = 2000.0
      latitude_delta = distance_m / 111_132
      longitude_delta = distance_m / (111_132 * Math.cos(address.latitude * Math::PI / 360))

      addresses = Address.where(
        'latitude > :min AND latitude < :max',
        min: address.latitude - latitude_delta,
        max: address.latitude + latitude_delta
      ).where(
        'longitude > :min AND longitude < :max',
        min: address.longitude - longitude_delta,
        max: address.longitude + longitude_delta
      )

      address_ids = addresses.map { |a| { _type_: 'Address', id: a.id } }
      objects = related(address_ids)
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
