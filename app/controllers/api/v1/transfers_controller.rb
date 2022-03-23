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

      def create
        upload = params.require(:upload)
        file_param = upload.require(:file_name)

        transfer_obj = Transfer.new
        transfer_obj.file_name = file_param.original_filename
        transfer_obj.content_type = file_param.content_type
        saved = transfer_obj.save

        if saved
          FileUtils.mkdir_p(transfer_obj.path)
          file_data = file_param.read
          # write the file
          File.open(transfer_obj.full_file_name, 'wb') { |f| f.write(file_data) }

          render json: { transfer: { id: transfer_obj.id } }
        else
          render json: { error: "Not saved: #{file_param.original_filename}" }
        end
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
