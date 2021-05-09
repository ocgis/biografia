# frozen_string_literal: true

module Api
  module V1
    # Media API controller
    class MediaController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Medium.find(params.require(:id))
      end

      def all_objects
        Medium.all
      end
    end
  end
end
