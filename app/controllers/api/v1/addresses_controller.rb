# frozen_string_literal: true

module Api
  module V1
    # Addresses API controller
    class AddressesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Address.find(params.require(:id))
      end
    end
  end
end