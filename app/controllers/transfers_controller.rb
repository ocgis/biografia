class TransfersController < ApplicationController

  load_and_authorize_resource

  def create
    upload = params.require(:upload)
    file_param = upload.require(:file_name)

    transfer_obj = Transfer.new()
    transfer_obj.file_name = file_param.original_filename
    transfer_obj.content_type = file_param.content_type
    saved = transfer_obj.save

    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = file_param.read
      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }

      redirect_to action: :show, id: transfer_obj.id
    else
      @msg = "Not saved: " + file_param.original_filename
    end
  end

  def new
  end

  def show
    @transfer_obj = Transfer.find(params[:id])
  end

end
