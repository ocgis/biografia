# frozen_string_literal: true

module Api
  module V1
    # Notes API controller
    class NotesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def create_object
        Note.new(note_params)
      end

      def find_object
        Note.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Note.find(params.require(:id))
        object.attributes = note_params
        object
      end

      private

      def note_params
        params.require(:note).permit(:id, :category, :title, :note, :source)
      end
    end
  end
end
