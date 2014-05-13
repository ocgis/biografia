require 'RMagick'
include Magick

class Medium < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "media"
  end

  def get_thumbnail
    return Medium.get_thumbnail_for(file_name)
  end   
 
  def self.get_thumbnail_for(file_name)
    file_full = Rails.public_path.join(file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1
      if mime_type[0].media_type == "image"
        thumb = File.join('cache', 'thumbnails', file_name + '.jpg')
        thumb_full = Rails.public_path.join(thumb)
        thumb_full_dir = File.dirname(thumb_full)
        FileUtils.mkdir_p(thumb_full_dir)
        image = Magick::Image.read(file_full).first
        image.format = "JPG"
        image.change_geometry!("110X110") { |cols, rows| image.thumbnail! cols, rows }
        image.write(thumb_full)
        return thumb
      end
    end

    return "images/unknown.gif"
  end

  def get_fullsize
    file_full = Rails.public_path.join(file_name)
    mime_type = MIME::Types.type_for(file_full.to_s)
    if mime_type.length == 1
      if mime_type[0].media_type != "image/jpeg"
        fullsize = File.join('cache', 'fullsize', file_name + '.jpg')
        fullsize_full = Rails.public_path.join(fullsize)
        fullsize_full_dir = File.dirname(fullsize_full)
        FileUtils.mkdir_p(fullsize_full_dir)
        image = Magick::Image.read(file_full).first
        image.format = "JPG"
        image.write(fullsize_full)
        return fullsize
      end
    end

    return file_name
  end

end
