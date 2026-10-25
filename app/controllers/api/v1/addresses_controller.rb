# frozen_string_literal: true

module Api
  module V1
    # Addresses API controller
    class AddressesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Address)
      end

      def by_position
        latitude = params['latitude']
        longitude = params['longitude']
        latlng = "#{latitude},#{longitude}"
        api_key = Biografia::Application.config.google_public_api_key
        url = "https://maps.googleapis.com/maps/api/geocode/json?key=#{api_key}&region=se&language=sv&latlng=#{latlng}"
        uri = URI(url)
        https = Net::HTTP.new(uri.host, uri.port)
        https.use_ssl = true
        request = Net::HTTP::Get.new(uri)
        response = https.request(request)
        render json: response.body
      end

      def by_text
        text_query = CGI.escape(params['query'])
        api_key = Biografia::Application.config.google_public_api_key
        url = "https://maps.googleapis.com/maps/api/geocode/json?key=#{api_key}&region=se&language=sv&address=#{text_query}"
        uri = URI(url)
        https = Net::HTTP.new(uri.host, uri.port)
        https.use_ssl = true
        request = Net::HTTP::Get.new(uri)
        response = https.request(request)
        render json: response.body
      end

      protected

      def create_object
        Address.new(address_params)
      end

      def find_object
        Address.find(params.require(:id))
      end

      def find_object_and_update_attrs
        object = Address.find(params.require(:id))
        object.attributes = address_params
        object
      end

      def all_objects
        Address.all.order(:street, :town, :zipcode, :parish, :country)
      end

      private

      def address_params
        params.require(:address).permit(:id, :street, :town, :zipcode, :parish,
                                        :country, :latitude, :longitude, :source)
      end
    end
  end
end
