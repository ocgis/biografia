# frozen_string_literal: true

module Api
  module V1
    # Establishments API controller
    class EstablishmentsController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Establishment)
      end

      def by_position
        puts 'by_position called'
        latitude = params['latitude']
        longitude = params['longitude']

        new_todo = {
          "maxResultCount": 20,
          "rankPreference": 'DISTANCE',
          "locationRestriction": {
            "circle": {
              "center": {
                "latitude": latitude,
                "longitude": longitude
              },
              "radius": 500.0
            }
          },
          "languageCode": 'sv'
        }
        uri = URI('https://places.googleapis.com/v1/places:searchNearby')
        https = Net::HTTP.new(uri.host, uri.port)
        https.use_ssl = true
        headers = {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': Biografia::Application.config.google_public_api_key,
          'X-Goog-FieldMask': '*'
        }
        request = Net::HTTP::Post.new(uri.path, headers)
        request.body = new_todo.to_json

        response = https.request(request)

        render json: response.body
      end

      protected

      def create_object
        reference_attrs = nil
        reference_attrs = params.require(:reference).permit(Reference.attribute_names) if params.key? 'reference'
        create_object_by_class(Establishment, params.require(:establishment), reference_attrs)
      end

      def find_object
        Establishment.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Establishment.find(params.require(:id))
        object.attributes = establishment_params
        object
      end

      def all_objects
        Establishment.all
      end

      private

      def establishment_params
        params.require(:establishment).permit(:id, :name, :kind, :related)
      end
    end
  end
end
