# -*- coding: utf-8 -*-
class AddressesController < ApplicationController

  load_and_authorize_resource

  protected

  def find_object
    return Address.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Address.find(params.require(:id))
    object.attributes = address_params(params.require(:edited))
    return object
  end

  def all_objects
    return Address.all
  end

  def index_title
    return "Index över adresser"
  end

  def create_object
    return Address.new(address_params(params.require(:address)))
  end

  private

  def address_params(params)
    params.permit(:street, :town, :zipcode, :parish, :country)
  end

end
