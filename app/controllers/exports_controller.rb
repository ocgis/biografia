# -*- coding: utf-8 -*-
class ExportsController < ApplicationController

  load_and_authorize_resource

  def new
    @export = Export.new({file_name: 'bah',
                          content_type: 'xml'})
  end

  def create
    object = create_object
    if object.save
      Spawnling.new do
        begin
          FileUtils.mkdir_p(object.path)
          object.make_export
        rescue => e
          object.status = "#{e.message}\n#{e.backtrace.inspect}"
          object.save
        end
      end
      redirect_to :action => 'show', :id => object.id
    else
      raise StandardException
    end
  end

  def show
    @export = Export.find(params.require(:id))
  end

  def file
    export = Export.find(params.require(:id))
    send_file(export.full_file_name, type: export.content_type)
  end

  include ActionController::Live

  def status
    response.headers['Content-Type'] = 'text/event-stream'
    sse = SSE.new(response.stream, event: "update")
    i = 0
    while true do
      Export.uncached do
        export = Export.find(params.require(:id))
        sse.write({ status: { replace: export.status } })
      end
      i = i + 1
      sleep(0.5)
    end

  rescue IOError
    # Just exit

  ensure
    sse.close
  end
  
  protected
  
  def all_objects
    Export.all
  end

  def index_title
    return "Index över exporter"
  end

  def create_object
    return Export.new(export_params)
  end

  private
  
  def export_params
    params.require(:export).permit(:file_name, :content_type)
  end

end
