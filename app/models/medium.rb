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

  def thumbnail
    Medium.thumbnail_for(file_name)
  end

  def self.thumbnail_for(file_name)
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

  def fullsize
    Medium.fullsize_for(file_name)
  end

  def self.fullsize_for(file_name)
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

  def handle_extra_info
    extra_info = exif_read_info
    exif_handle_description(extra_info)
    exif_handle_date(extra_info)
    exif_handle_location(extra_info)
    exif_handle_camera(extra_info)
    exif_handle_lens(extra_info)
  end

  def all_attributes
    pio_attributes = positions_in_object.map do |pio|
      pio[:object] = pio[:object].all_attributes
      pio
    end
    attributes.update({
                        _type_: 'Medium',
                        positions_in_object: pio_attributes
                      }).update(extras)
  end

  private

  def exif_read_info
    extra_info = {}
    full_file_name = File.join(Biografia::Application.config.protected_path, file_name)
    file_type = MIME::Types.type_for(full_file_name).first.content_type
    if (file_type == 'image/jpeg') || (file_type == 'image/tiff')
      e = Exiftool.new(full_file_name)
      extra_info = extra_info.merge(e.to_hash)
    end
    extra_info
  end

  def exif_handle_description(extra_info)
    return if extra_info[:image_description].blank?

    note = Note.create_save(note: extra_info[:image_description])
    add_reference(note)
  end

  def exif_handle_date(extra_info)
    return if extra_info[:date_time_original].blank?

    date_time = extra_info[:date_time_original]
    date_time[4] = '-'
    date_time[7] = '-'
    event_date = EventDate.new
    event_date.set_date(date_time)

    raise StandardError, "Could not save EventDate with date #{event_date}" unless event_date.save

    add_reference(event_date, role: 'Date')
  end

  def exif_handle_location(extra_info)
    unless extra_info[:gps_latitude].blank? ||
           extra_info[:gps_latitude_ref].blank? ||
           extra_info[:gps_longitude].blank? ||
           extra_info[:gps_longitude_ref].blank?
      address = Address.create_save(latitude: extra_info[:gps_latitude].to_f,
                                    longitude: extra_info[:gps_longitude].to_f)
      add_reference(address, role: 'Position')
    end
  end

  def exif_handle_camera(extra_info)
    device_attrs = {}
    device_attrs[:make] = extra_info[:make] unless extra_info[:make].blank?
    device_attrs[:model] = extra_info[:model] unless extra_info[:model].blank?
    device_attrs[:serial] = extra_info[:internal_serial_number] unless extra_info[:internal_serial_number].blank?
    if extra_info[:file_source] == 'Digital Camera'
      device_attrs[:kind] = 'Camera'
      device_role = 'Camera'
    end

    return unless device_attrs.length.positive?

    attach_thing(device_attrs, device_role)
  end

  def exif_handle_lens(extra_info)
    return if extra_info[:lens_type].blank?

    lens_attrs = { kind: 'Camera Lens',
                   model: extra_info[:lens_type] }

    attach_thing(lens_attrs, 'CameraLens')
  end

  def attach_thing(attrs, role)
    things = Thing.where(attrs)
    case things.length
    when 1
      thing = things.first
    when 0
      thing = Thing.create_save(attrs)
    else
      raise StandardError, "Found several matching things: #{things.pretty_inspect}"
    end
    add_reference(thing, role: role)
  end
end
