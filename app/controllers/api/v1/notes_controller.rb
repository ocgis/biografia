# frozen_string_literal: true

module Api
  module V1
    # Notes API controller
    class NotesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Note.find(params.require(:id))
      end
    end
  end
end
