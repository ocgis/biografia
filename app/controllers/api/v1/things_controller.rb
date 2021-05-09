# frozen_string_literal: true

module Api
  module V1
    # Things API controller
    class ThingsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Thing.find(params.require(:id))
      end

      def all_objects
        Thing.all.limit(50)
      end
    end
  end
end
