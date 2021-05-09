# frozen_string_literal: true

module Api
  module V1
    # Events API controller
    class EventsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Event.find(params.require(:id))
      end

      def all_objects
        Event.all.limit(50)
      end
    end
  end
end
