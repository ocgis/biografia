# frozen_string_literal: true

module Api
  module V1
    # Relationships API controller
    class RelationshipsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def create_object
        Relationship.new(relationship_params)
      end

      def find_object
        Relationship.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Relationship.find(params.require(:id))
        object.attributes = relationship_params
        object
      end

      private

      def relationship_params
        params.require(:relationship).permit(:id, :name)
      end
    end
  end
end
