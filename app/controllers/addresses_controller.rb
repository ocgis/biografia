# -*- coding: utf-8 -*-
class AddressesController < ApplicationController

  load_and_authorize_resource

  protected

  def find_object
    return Address.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Address.find(params.require(:id))
    object.attributes = address_params
    return object
  end

  def all_objects
    return Address.all.limit(50)
  end

  def index_title
    return "Index över adresser"
  end

  def new_object(options={})
    @address = Address.new()
    if not options[:reference].nil?
      @address.set_extra(:reference, options[:reference])
    end
  end

  def create_object
    return Address.new(address_params)
  end

  private

  def address_params
    p = params.require(:address).permit(:street, :town, :zipcode, :parish, :country, :latitude, :longitude)
    [ :street, :town, :zipcode, :parish, :country, :latitude, :longitude ].each { |attr| p[attr] = nil if p[attr].blank? }
    return p
  end

end
