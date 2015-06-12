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
      eo = EXIFR::JPEG.new(full_file_name)
      unless eo.exif.nil?
        extra_info = extra_info.merge(eo.exif[0])
      end
    end
    return extra_info
  end

end
