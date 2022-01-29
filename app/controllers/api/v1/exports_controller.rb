# frozen_string_literal: true

module Api
  module V1
    # Exports API controller
    class ExportsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Export)
      end

      def show
        render json: { export: @object,
                       current_user: @current_user_hash }
      end

      protected

      def find_object
        Export.find(params.require(:id))
      end

      def all_objects
        Export.all
      end

      def set_object
        @object = find_object
      end
    end
  end
end
