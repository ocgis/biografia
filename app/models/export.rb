class Export < ActiveRecord::Base
  has_paper_trail

  validates_presence_of :content_type, :file_name
   
  def path
    File.join(Biografia::Application.config.export_path, id.to_s)    
  end
  
  def relative_file_name
    File.join(Biografia::Application.config.export_relative_path, id.to_s, file_name)    
  end
  
  def full_file_name
    File.join(path, file_name)
  end
  
  def make_export
    if content_type == 'application/zip'
      a = ArchiveFile.new(full_file_name, 'application/zip', status_object: self)
      a.export
    elsif content_type == 'application/biografia-xml'
      b = BiografiaXml.new(status_object: self)
      b.export(full_file_name)
    else
      raise StandardError, "Unknown content type #{self.content_type}"
    end
  end

  def set_status(status)
    self.status = status
    self.save
  end

end
