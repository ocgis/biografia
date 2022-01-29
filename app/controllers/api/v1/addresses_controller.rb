# frozen_string_literal: true

module Api
  module V1
    # Addresses API controller
    class AddressesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Address)
      end

      protected

      def create_object
        Address.new(address_params)
      end

      def find_object
        Address.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Address.find(params.require(:id))
        object.attributes = address_params
        object
      end

      def all_objects
        Address.all
      end

      private

      def address_params
        params.require(:address).permit(:id, :street, :town, :zipcode, :parish,
                                        :country, :latitude, :lognitude, :source)
      end
    end
  end
end
