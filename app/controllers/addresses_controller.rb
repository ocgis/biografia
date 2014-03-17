class AddressesController < ApplicationController

  protected

  def find_object
    return Address.find(params[:id])
  end

  def find_object_and_update_attrs
    object = Address.find(params[:id])
    object.attributes = address_params(params[:edited])
    return object
  end

  def create_object
    return Address.new(address_params(params[:address]))
  end

  private

  def address_params(params)
    params.permit(:street, :town, :zipcode, :parish, :country)
  end

end
