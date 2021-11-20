# frozen_string_literal: true

require 'RMagick'

# Implementation of the medium class
class Medium < ActiveRecord::Base
  include Magick
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'media'
  end

  def get_thumbnail
    Medium.get_thumbnail_for(file_name)
  end

  def self.get_thumbnail_for(file_name)
    file_full = File.join(Biografia::Application.config.protected_path, file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1 && mime_type[0].media_type == 'image'
      thumb_full = File.join(Biografia::Application.config.cache_path, "thumbnails#{file_name}jpg")
      if !File.exist?(thumb_full) || (File.mtime(thumb_full) < File.mtime(file_full))
        thumb_full_dir = File.dirname(thumb_full)
        FileUtils.mkdir_p(thumb_full_dir)
        image = Magick::Image.read(file_full).first
        image.format = 'JPG'
        image.change_geometry!('110X110') { |cols, rows| image.thumbnail! cols, rows }
        image.write(thumb_full)
      end
      return thumb_full
    end

    File.join(Biografia::Application.config.public_path, 'images', 'unknown.gif') # FIXME: public_path not found
  end

  def get_fullsize
    Medium.get_fullsize_for(file_name)
  end

  def self.get_fullsize_for(file_name)
    file_full = File.join(Biografia::Application.config.protected_path, file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1 && mime_type[0].sub_type != 'jpeg'
      fullsize_full = File.join(Biografia::Application.config.cache_path, "fullsize#{file_name}.jpg")
      if !File.exist?(fullsize_full) || (File.mtime(fullsize_full) < File.mtime(file_full))
        fullsize_full_dir = File.dirname(fullsize_full)
        FileUtils.mkdir_p(fullsize_full_dir)
        image = Magick::Image.read(file_full).first
        image.format = 'JPG'
        image.write(fullsize_full)
      end
      return fullsize_full
    end

    file_full
  end

  def extra_info
    extra_info = {}
    full_file_name = File.join(Biografia::Application.config.protected_path, file_name)
    file_type = MIME::Types.type_for(full_file_name).first.content_type
    if (file_type == 'image/jpeg') || (file_type == 'image/tiff')
      e = Exiftool.new(full_file_name)
      extra_info = extra_info.merge(e.to_hash)
    end
    extra_info
  end

  def handle_extra_info
    extra_info = self.extra_info

    if extra_info.key?(:image_description)
      note = Note.create_save(note: extra_info[:image_description])
      add_reference(note)
    end

    if extra_info.key?(:date_time_original)
      date_time = extra_info[:date_time_original]
      date_time[4] = '-'
      date_time[7] = '-'
      event_date = EventDate.new
      event_date.set_date(date_time)

      raise StandardError, "Could not save EventDate with date #{event_date}" unless event_date.save

      add_reference(event_date, role: 'Date')
    end

    location = get_location(extra_info)
    unless location.nil?
      parts = location.split(',')
      address = Address.create_save(latitude: parts[0].to_f, longitude: parts[1].to_f)
      add_reference(address, role: 'Position')
    end

    device_attrs = {}
    device_attrs[:make] = extra_info[:make] if extra_info.key?(:make)
    device_attrs[:model] = extra_info[:model] if extra_info.key?(:model)
    device_attrs[:serial] = extra_info[:internal_serial_number] if extra_info.key?(:internal_serial_number)
    if extra_info.key?(:file_source) && extra_info[:file_source] == 'Digital Camera'
      device_attrs[:kind] = 'Camera'
      device_role = 'Camera'
    end

    device_attrs[:serial] = extra_info[:internal_serial_number] if extra_info.key?(:internal_serial_number)

    if device_attrs.length.positive?
      things = Thing.where(device_attrs)

      case things.length
      when 1
        thing = things.first
      when 0
        thing = Thing.create_save(device_attrs)
      else
        raise StandardError, "Found several matching things: #{things.pretty_inspect}"
      end
      add_reference(thing, role: device_role)
    end

    return unless extra_info.key?(:lens_type)

    lens_attrs = { kind: 'Camera Lens',
                   model: extra_info[:lens_type] }
    things = Thing.where(lens_attrs)
    case things.length
    when 1
      thing = things.first
    when 0
      thing = Thing.create_save(lens_attrs)
    else
      raise StandardError, "Found several matching things: #{things.pretty_inspect}"
    end
    add_reference(thing, role: 'CameraLens')
  end

  def get_location(extra_info)
    if extra_info.key?(:gps_latitude) && extra_info.key?(:gps_latitude_ref) &&
       extra_info.key?(:gps_longitude) && extra_info.key?(:gps_longitude_ref)
      latitude = extra_info[:gps_latitude]
      longitude = extra_info[:gps_longitude]
      "#{latitude},#{longitude}"
    end
  end

  def all_attributes
    pio_attributes = positions_in_object.map do |pio|
      pio[:object] = pio[:object].all_attributes
      pio
    end
    attributes.update({
                        type_: 'Medium',
                        positions_in_object: pio_attributes
                      }).update(extras)
  end
end
