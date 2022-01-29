# frozen_string_literal: true

module Api
  module V1
    # Things API controller
    class ThingsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Thing)
      end

      protected

      def create_object
        Thing.new(thing_params)
      end

      def find_object
        Thing.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Thing.find(params.require(:id))
        object.attributes = thing_params
        object
      end

      def all_objects
        Thing.all
      end

      private

      def thing_params
        params.require(:thing).permit(:id, :name, :kind, :make, :model, :serial)
      end
    end
  end
end
