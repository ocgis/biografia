class Export < ActiveRecord::Base
  has_paper_trail

  validates_presence_of :content_type, :file_name
   
  def path
    File.join(Biografia::Application.config.export_path, id.to_s)    
  end
  
  def full_file_name
    File.join(path, file_name)
  end
  
  def make_export   
    doc = Nokogiri.XML('')
    doc.encoding = 'utf-8'
    biografia = Nokogiri::XML::Node.new("biografia", doc)
    doc << biografia
    for c in [ Person, Event, EventDate, Note, Address, Relationship, Medium, Reference ]
      c.all.each do |person|
        pnode = Nokogiri::XML::Node.new(person.class.name, doc)
        
        person.attributes.each do |key,value|
          anode = Nokogiri::XML::Node.new(key, doc)
          anode.content = value
          pnode << anode
        end
  
        
        biografia << pnode
      end
    end
    File.open(full_file_name, "wb") { |f| f.write(doc.to_xml) }
  end
end
