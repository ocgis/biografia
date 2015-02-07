class ImportsController < ApplicationController

  load_and_authorize_resource

  def new
    transfer_obj = Transfer.find(params[:transfer_id])
    object = Import.new
    object.file_name = transfer_obj.full_file_name
    object.content_type = transfer_obj.content_type
    if object.save
      Spawnling.new do
        begin
          object.make_import
        rescue => e
          object.status = "#{e.message}\n#{e.backtrace.inspect}"
          object.save
        end
      end
      redirect_to :action => 'show', :id => object.id
    else
      raise StandardError, "Could not create import object"
    end
  end


  def show
    @import = Import.find(params.require(:id))
  end

  include ActionController::Live

  def status
    response.headers['Content-Type'] = 'text/event-stream'
    sse = SSE.new(response.stream, event: "update")
    i = 0
    while true do
      Import.uncached do
        import = Import.find(params.require(:id))
        sse.write({ status: { replace: "#{import.status} #{i}" } })
      end
      i = i + 1
      sleep(1)
    end

  rescue IOError
    # Just exit

  ensure
    sse.close
  end

end
