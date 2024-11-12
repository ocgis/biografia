# frozen_string_literal: true

module Api
  module V1
    # Users API controller
    class UsersController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(User)
      end

      def show
        render json: { user: @object.all_attributes,
                       current_user: @current_user_hash }
      end

      def current
        render json: { currentUser: { name: current_user.name,
                                      roles: current_user.roles } }
      end

      protected

      def find_object
        User.find(params.require(:id))
      end

      def all_objects
        User.all
      end

      def set_object
        @object = find_object
      end

      def set_object_attributes
        @object_attributes = @object.all_attributes
      end
    end
  end
end
