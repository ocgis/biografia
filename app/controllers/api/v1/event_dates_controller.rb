# frozen_string_literal: true

module Api
  module V1
    # EventDates API controller
    class EventDatesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        EventDate.find(params.require(:id))
      end
    end
  end
end
