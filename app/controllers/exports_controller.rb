class ExportsController < ApplicationController

  load_and_authorize_resource

  def new
    @export = Export.new({file_name: 'bah',
                          content_type: 'xml'})
  end

  def create
    object = create_object
    if object.save
      Dir.mkdir(object.path)
      object.make_export
    else
      raise StandardException
    end
  end

  def show
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
