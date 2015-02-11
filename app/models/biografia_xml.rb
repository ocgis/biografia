# -*- coding: utf-8 -*-
class BiografiaXml

  def initialize(options = {})
    defaults = {
      status_object: nil
    }
    options = defaults.merge(options)

    @status_object = options[:status_object]
  end

  def set_status(status)
    unless @status_object.nil?
      @status_object.set_status(status)
    else
      puts("biografia_xml.rb: Status set to: #{status}")
    end
  end

  def export(full_file_name)
    self.set_status("Exporting biografia-xml to file #{full_file_name}")

    f = File.open(full_file_name, "w")
    f.puts('<?xml version="1.0" encoding="utf-8"?>')
    f.puts('<biografia>')
    for c in [ Person, PersonName, Event, EventDate, Note, Address, Relationship, Medium, PositionInPicture, Reference ]
      c.all.each do |o|
        set_status('PROCESSING ' + c.name + ' objects')
        while not o.nil?
          f.puts("<#{o.class.name}>")
          o.attributes.each do |key,value|
            f.puts("<#{key}>#{value}</#{key}>")
          end
          author = User.find(o.originator)
          f.puts("<author>#{o.originator} (#{author.name})</author>")
          f.puts("</#{o.class.name}>")
          o = o.previous_version
        end
      end
    end
    f.puts('</biografia>')
    f.close()

    self.set_status("Done exporting biografia-xml to file #{full_file_name}")
  end

end
