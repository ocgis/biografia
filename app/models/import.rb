class Import < ActiveRecord::Base

  def make_import
    if self.content_type == 'text/xml'
      x = XmlFile.new(status_object: self)
      x.import(self.file_name)
    elsif self.content_type == 'application/x-gedcom'
      g = GedcomFile.new(self.file_name)
      g.import
    elsif self.content_type == 'application/zip'
      a = ArchiveFile.new(self.file_name, self.content_type, status_object: self)
      a.import
    else
      raise StandardError, "Can't import #{transfer_obj.content_type} file"
    end
  end

  def set_status(status)
    self.status = status
    self.save
  end

end
