# frozen_string_literal: true

module Api
  module V1
    # EventDates API controller
    class EventDatesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(EventDate)
      end

      protected

      def create_object
        EventDate.new(event_date_params)
      end

      def find_object
        EventDate.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = EventDate.find(params.require(:id))
        object.attributes = event_date_params
        object
      end

      private

      def event_date_params
        params.require(:event_date).permit(:id, :date, :mask, :source)
      end
    end
  end
end
