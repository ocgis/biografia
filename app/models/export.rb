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
    a = ArchiveFile.new(full_file_name, 'application/zip')
    a.export

    # f = File.open(full_file_name, "w")
    # f.puts('<?xml version="1.0" encoding="utf-8"?>')
    # f.puts('<biografia>')

    # for c in [ Person, Event, EventDate, Note, Address, Relationship, Medium, Reference ]
    #   c.all.each do |o|
    #     self.status = 'PROCESSING ' + c.name + ' objects'
    #     self.save
    #     while not o.nil?
    #       f.puts("<#{o.class.name}>")
    #       o.attributes.each do |key,value|
    #         f.puts("<#{key}>#{value}</#{key}>")
    #       end
    #       author = User.find(o.originator)
    #       f.puts("<author>#{o.originator} (#{author.name})</author>")
    #       f.puts("</#{o.class.name}>")
    #       o = o.previous_version
    #     end
    #   end
    # end

    # f.puts('</biografia>')
    # f.close()

    self.status = 'DONE'
    self.save
  end
end
