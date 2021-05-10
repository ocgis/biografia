# frozen_string_literal: true

module Api
  module V1
    # Relationships API controller
    class RelationshipsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      protected

      def find_object
        Relationship.find(params.require(:id))
      end
    end
  end
end
