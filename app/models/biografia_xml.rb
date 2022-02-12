# frozen_string_literal: true

# Handle Biografix XML files
class BiografiaXml
  def initialize(options = {})
    defaults = {
      status_object: nil
    }
    options = defaults.merge(options)

    @status_object = options[:status_object]
  end

  def status=(status)
    if !@status_object.nil?
      @status_object.set_status(status)
    else
      puts("biografia_xml.rb: Status set to: #{status}")
    end
  end

  def export(full_file_name)
    self.status = "Exporting biografia-xml to file #{full_file_name}"

    f = File.open(full_file_name, 'w')
    f.puts('<?xml version="1.0" encoding="utf-8"?>')
    f.puts('<biografia>')
    models_tags(f)
    f.puts('</biografia>')
    f.close

    self.status = "Done exporting biografia-xml to file #{full_file_name}"
  end

  private

  def models_tags(file)
    [Person, PersonName, Event, EventDate, Note, Address, Relationship,
     Medium, PositionInPicture, Thing, Reference, User].each do |c|
      objects_tags(file, c)
    end
  end

  def objects_tags(file, cls)
    self.status = "PROCESSING #{cls.name} objects"
    latest_event = {}
    versions = Version.where(item_type: cls.name).order(:item_id, :id)
    versions.each do |version|
      unless version.object.nil?
        object = YAML.safe_load(version.object, [ActiveSupport::TimeWithZone,
                                                 Time,
                                                 ActiveSupport::TimeZone,
                                                 DateTime,
                                                 BigDecimal],
                                aliases: true)
        item_tag(file, cls.name, version.item_id, object, latest_event)
      end
      latest_event[version.item_id] = { event: version.event,
                                        whodunnit: version.whodunnit,
                                        created_at: version.created_at }
    end

    objects = cls.all.order(:id)
    objects.each do |object|
      item_tag(file, cls.name, object.id, object.attributes, latest_event)
      latest_event.except!(object.id)
    end

    latest_event.each_key do |id|
      item_tag(file, cls.name, id, { id: id }, latest_event)
      latest_event.except!(id)
    end
  end

  def item_tag(file, item_type, item_id, item, latest_event)
    file.puts("<#{item_type}>")
    dict_tags(file, item)
    if latest_event.key?(item_id)
      file.puts('<version>')
      dict_tags(file, latest_event[item_id])
      file.puts('</version>')
    end
    file.puts("</#{item_type}>")
  end

  def dict_tags(file, dict)
    dict.each do |key, value|
      unless value.nil?
        safe_value = CGI.escapeHTML(value.to_s)
        file.puts("<#{key}>#{safe_value}</#{key}>")
      end
    end
  end
end
