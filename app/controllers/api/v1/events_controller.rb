# frozen_string_literal: true

module Api
  module V1
    # Events API controller
    class EventsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def create_object
        Event.new(event_params)
      end

      def find_object
        Event.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Event.find(params.require(:id))
        object.attributes = event_params
        object
      end

      def all_objects
        Event.all.limit(50)
      end

      private

      def event_params
        params.require(:event).permit(:id, :name, :source)
      end
    end
  end
end
