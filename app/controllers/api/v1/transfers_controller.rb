# frozen_string_literal: true

module Api
  module V1
    # Transfers API controller
    class TransfersController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Transfer)
      end

      def show
        render json: { transfer: @object,
                       current_user: @current_user_hash }
      end

      protected

      def find_object
        Transfer.find(params.require(:id))
      end

      def all_objects
        Transfer.all
      end

      def set_object
        @object = find_object
      end
    end
  end
end
