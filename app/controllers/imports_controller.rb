class ImportsController < ApplicationController

  # FIXME: load_and_authorize_resource

  def new
    transfer_obj = Transfer.find(params[:transfer_id])

    # Get the file
    filename = transfer_obj.full_file_name

    if transfer_obj.content_type == 'text/xml'
      x = XmlFile.new
      x.import(filename)
    elsif transfer_obj.content_type == 'application/x-gedcom'
      g = GedcomFile.new(filename)
      g.import
    elsif transfer_obj.content_type == 'application/zip'
      a = ArchiveFile.new(filename, transfer_obj.content_type)
      a.import
    else
      raise StandardError, "Can't import #{transfer_obj.content_type} file"
    end
  end
end
