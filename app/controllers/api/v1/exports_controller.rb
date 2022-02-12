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

      def create
        object = create_object
        if object.save
          Spawnling.new do
            FileUtils.mkdir_p(object.path)
            object.make_export
          rescue => e
            object.status = "#{e.message}\n#{e.backtrace.inspect}"
            object.save
            raise
          end
          object_attributes = object.all_attributes
          r = {}
          r[object.class.name.underscore.to_sym] = object_attributes

          render json: r
        else
          render json: { error: 'Object could not be created' }
        end
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

      def create_object
        Export.new(export_params)
      end

      private

      def export_params
        params.require(:export).permit(:file_name, :content_type)
      end
    end
  end
end
