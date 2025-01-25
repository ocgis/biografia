# frozen_string_literal: true

module Api
  module V1
    # Establishments API controller
    class EstablishmentsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Establishment)
      end

      protected

      def create_object
        Establishment.new(establishment_params)
      end

      def find_object
        Establishment.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Establishment.find(params.require(:id))
        object.attributes = establishment_params
        object
      end

      def all_objects
        Establishment.all
      end

      private

      def establishment_params
        params.require(:establishment).permit(:id, :name, :kind)
      end
    end
  end
end
