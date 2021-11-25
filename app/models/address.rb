# coding: utf-8
# frozen_string_literal: true

# This is the address model
class Address < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'addresses'
  end

  # FIXME: add test
  def one_line
    parts = []

    parts << street unless street.nil?

    parts << town unless town.nil?

    parts << ("#{parish} församling") unless parish.nil?

    parts << "#{latitude},#{longitude}" unless latitude.nil? || longitude.nil? || parts.length.positive?

    return "Empty address: #{inspect}" if parts.length.zero?

    parts.join(', ')
  end

  def maps_address
    parts = []

    if latitude.nil? || longitude.nil?
      parts << street unless street.nil?
      parts << town unless town.nil?
      parts << parish unless parish.nil?
    else
      parts << "#{latitude},#{longitude}"
    end

    return nil if parts.length.zero?

    parts.join(', ')
  end

  def merge(other)
    fields = %w[street town zipcode parish country source latitude longitude]
    fields.each do |field|
      unless send(field) == other.send(field)
        if send(field).nil?
          send("#{field}=", other.send(field))
        elsif !other.send(field).nil? # Both non-nil
          send("#{field}=", "#{send(field)} / #{other.send(field)}")
        end
      end
    end
  end

  def self.filtered_search(filters)
    addresses = Address.all

    filters.each do |filter|
      addresses = addresses.where("town LIKE \"%#{filter}%\" OR street LIKE \"%#{filter}%\" OR zipcode LIKE \"%#{filter}%\" OR parish LIKE \"%#{filter}%\" OR country LIKE \"%#{filter}%\"")
    end
    addresses.first(100)
  end

  def all_attributes
    attributes.update({
                        _type_: 'Address',
                        maps_address: maps_address
                      }).update(extras)
  end
end
