# -*- coding: utf-8 -*-

require 'RMagick'
include Magick

class Medium < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "media"
  end

  def get_thumbnail
    return Medium.get_thumbnail_for(file_name)
  end   
 
  def self.get_thumbnail_for(file_name)
    file_full = File.join(Biografia::Application.config.protected_path, file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1
      if mime_type[0].media_type == "image"
        thumb_full = File.join(Biografia::Application.config.cache_path, 'thumbnails', file_name + '.jpg')
        if (not File.exist?(thumb_full)) or (File.mtime(thumb_full) < File.mtime(file_full))
          thumb_full_dir = File.dirname(thumb_full)
          FileUtils.mkdir_p(thumb_full_dir)
          image = Magick::Image.read(file_full).first
          image.format = "JPG"
          image.change_geometry!("110X110") { |cols, rows| image.thumbnail! cols, rows }
          image.write(thumb_full)
        end
        return thumb_full
      end
    end

    return File.join(Biografia::Application.config.public_path, "images", "unknown.gif") # FIXME: public_path not found
  end

  def get_fullsize
    file_full = File.join(Biografia::Application.config.protected_path, file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1
      if mime_type[0].sub_type != "jpeg"
        fullsize_full = File.join(Biografia::Application.config.cache_path, 'fullsize', file_name + '.jpg')
        if (not File.exist?(fullsize_full)) or (File.mtime(fullsize_full) < File.mtime(file_full))
          fullsize_full_dir = File.dirname(fullsize_full)
          FileUtils.mkdir_p(fullsize_full_dir)
          image = Magick::Image.read(file_full).first
          image.format = "JPG"
          image.write(fullsize_full)
        end
        return fullsize_full
      end
    end

    return file_full
  end

  def extra_info
    extra_info = {}
    full_file_name = File.join(Biografia::Application.config.protected_path, file_name)
    file_type = MIME::Types.type_for(full_file_name).first.content_type
    if file_type == 'image/jpeg'
      e = Exiftool.new(full_file_name)
      extra_info = extra_info.merge(e.to_hash)
      if extra_info.key?(:image_description)
        extra_info[:image_description] = extra_info[:image_description].force_encoding("utf-8")
      end
    end
    return extra_info
  end

  def handle_extra_info
    extra_info = self.extra_info

    if extra_info.key?(:image_description)
      note = Note.create_save(note: extra_info[:image_description])
      self.add_reference(note)
    end
    location = get_location(extra_info)
    unless location.nil?
      parts = location.split(',')
      address = Address.create_save(latitude: parts[0].to_f, longitude: parts[1].to_f)
      self.add_reference(address)
    end
  end

  def get_location(extra_info=extra_info)
    if extra_info.key?(:gps_latitude) and extra_info.key?(:gps_latitude_ref) and
       extra_info.key?(:gps_longitude) and extra_info.key?(:gps_longitude_ref)
      latitude = extra_info[:gps_latitude]
      longitude = extra_info[:gps_longitude]
      location = latitude.to_s + ',' + longitude.to_s

      return location
    else
      return nil
    end
  end

end
