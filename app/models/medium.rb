# frozen_string_literal: true

require 'rmagick'

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
    if mime_type.length >= 1 # && mime_type[0].media_type == 'image'
      extension =
        if mime_type[0].sub_type == 'jpeg'
          ''
        else
          '.jpg'
        end
      thumb_full = File.join(Biografia::Application.config.cache_path, 'thumbnails', "#{file_name}#{extension}")
      if !File.exist?(thumb_full) || (File.mtime(thumb_full) < File.mtime(file_full))
        thumb_full_dir = File.dirname(thumb_full)
        FileUtils.mkdir_p(thumb_full_dir)
        image = Magick::Image.read("#{file_full}[0]").first
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
    if mime_type.length >= 1 && mime_type[0].sub_type != 'jpeg'
      fullsize_full = File.join(Biografia::Application.config.cache_path, 'fullsize', "#{file_name}.jpg")
      if !File.exist?(fullsize_full) || (File.mtime(fullsize_full) < File.mtime(file_full))
        fullsize_full_dir = File.dirname(fullsize_full)
        FileUtils.mkdir_p(fullsize_full_dir)
        image = Magick::Image.read("#{file_full}[0]").first
        image.format = 'JPG'
        image.write(fullsize_full)
      end
      return fullsize_full
    end

    file_full
  end

  def raw
    Medium.raw_for(file_name)
  end

  def self.raw_for(file_name)
    File.join(Biografia::Application.config.protected_path, file_name)
  end

  EXIF_TAGS = {
    included: %i[app_name
                 app_version
                 create_date
                 date_time_original
                 device_manufacturer
                 device_model
                 file_source
                 gps_altitude
                 gps_date_time
                 gps_latitude
                 gps_longitude
                 image_description
                 image_height
                 image_width
                 kind
                 lens_type
                 make
                 model
                 modify_date
                 offset_time_original
                 serial
                 software
                 user_comment],
    excluded: %i[xmp_toolkit
                 photo_id
                 export_session_id
                 bits_per_sample
                 blue_matrix_column
                 blue_trc
                 cmm_flags
                 color_components
                 color_space_data
                 connection_space_illuminant
                 create_date_civil
                 current_iptc_digest
                 device_attributes
                 directory
                 encoding_process
                 exif_byte_order
                 exif_image_height
                 exif_image_width
                 exif_tool_version
                 file_access_date
                 file_access_date_civil
                 file_inode_change_date
                 file_inode_change_date_civil
                 file_modify_date
                 file_modify_date_civil
                 file_name
                 file_permissions
                 file_size
                 file_type
                 file_type_extension
                 gps_position
                 green_matrix_column
                 green_trc
                 image_size
                 iptc_digest
                 jfif_version
                 media_white_point
                 megapixels
                 mime_type
                 orientation
                 page_name
                 primary_platform
                 profile_class
                 profile_cmm_type
                 profile_connection_space
                 profile_copyright
                 profile_creator
                 profile_date_time
                 profile_description
                 profile_file_signature
                 profile_id
                 profile_version
                 red_matrix_column
                 red_trc
                 rendering_intent
                 resolution_unit
                 source_file
                 x_resolution
                 y_cb_cr_sub_sampling
                 y_resolution
                 sub_sec_time_original
                 sub_sec_time_digitized
                 flashpix_version
                 color_space
                 interop_index
                 interop_version
                 sensing_method
                 exposure_mode
                 white_balance
                 digital_zoom_ratio
                 focal_length_in35mm_format
                 scene_capture_type
                 gps_version_id
                 gps_latitude_ref
                 gps_longitude_ref
                 gps_altitude_ref
                 gps_time_stamp
                 gps_processing_method
                 gps_date_stamp
                 gps_date_stamp_civil
                 compression
                 thumbnail_offset
                 thumbnail_length
                 profile_date_time_civil
                 media_black_point
                 device_mfg_desc
                 device_model_desc
                 viewing_cond_desc
                 viewing_cond_illuminant
                 viewing_cond_surround
                 viewing_cond_illuminant_type
                 luminance
                 measurement_observer
                 measurement_backing
                 measurement_geometry
                 measurement_flare
                 measurement_illuminant
                 technology
                 aperture
                 shutter_speed
                 sub_sec_create_date
                 sub_sec_create_date_civil
                 sub_sec_date_time_original
                 sub_sec_date_time_original_civil
                 sub_sec_modify_date
                 sub_sec_modify_date_civil
                 gps_date_time_civil
                 focal_length35efl
                 light_value
                 modify_date_civil
                 y_cb_cr_positioning
                 exposure_time
                 f_number
                 exposure_program
                 iso
                 sensitivity_type
                 recommended_exposure_index
                 exif_version
                 date_time_original_civil
                 components_configuration
                 shutter_speed_value
                 aperture_value
                 brightness_value
                 exposure_compensation
                 max_aperture_value
                 metering_mode
                 light_source
                 flash
                 focal_length
                 maker_note_unknown_text
                 sub_sec_time
                 compressed_bits_per_pixel
                 scene_type
                 custom_rendered
                 print_im_version
                 thumbnail_image]
  }.freeze

  def self.info_for(file_name)
    file_full = File.join(Biografia::Application.config.protected_path, file_name)
    content_type = MIME::Types.type_for(file_full).first.content_type.to_s
    info = { content_type: }
    if ['image/tiff', 'image/jpeg'].include? content_type
      info[:exif] = {}
      Medium.exif_read_info(file_name).each do |key, value|
        if EXIF_TAGS[:included].include? key
          info[:exif][key] = value unless value.blank?
        elsif !EXIF_TAGS[:excluded].include? key
          puts "Unknown attribute: #{key} = #{value}"
        end
      end
    end
    info
  rescue NoMethodError
    info = { error: 'Could not handle file' }
  end

  def handle_extra_info
    extra_info = Medium.exif_read_info(file_name)
    exif_handle_description(extra_info)
    exif_handle_date(extra_info)
    exif_handle_location(extra_info)
    exif_handle_camera(extra_info)
    exif_handle_lens(extra_info)
  end

  def limited_attributes
    attributes.update({ _type_: 'Medium' })
  end

  def all_attributes
    pio_attributes = positions_in_object.map do |pio|
      pio[:object] = pio[:object].all_attributes
      pio
    end
    info = Medium.info_for(file_name)
    limited_attributes.update({ positions_in_object: pio_attributes,
                                info: }).update(extras)
  end

  def self.with_associations
    self
  end

  def hint
    path_name = file_name.split('/')[0..-2].join('/')
    media = Medium.where('file_name LIKE ?', "#{path_name}%").order(:file_name)
    self_index = media.index.with_index { |element, _| file_name == element.file_name }
    start_index = (self_index - 5).clamp(0, media.length)
    end_index = (self_index + 1 + 5).clamp(0, media.length)

    references = Reference.references_for_objects(media[start_index..end_index])
    ids = Reference.ids_in_references(references)
    grouped_ids = ids.group_by { |id| id[:_type_] }
    grouped_ids.delete('Medium')

    objects = []
    grouped_ids.each_key do |local_type|
      objects += local_type.constantize.with_associations.find(ids(grouped_ids[local_type])).map(&:limited_attributes)
    end

    objects
  end

  def self.exif_read_info(file_name)
    extra_info = {}
    full_file_name = File.join(Biografia::Application.config.protected_path, file_name)
    mime_types = MIME::Types.type_for(full_file_name).map(&:content_type)
    if mime_types.any? { |mime_type| mime_type.start_with?('image/') || mime_type.start_with?('video/') }
      e = Exiftool.new(full_file_name)
      extra_info = extra_info.merge(e.to_hash)
    end
    extra_info
  end

  private

  def ids(id_list)
    id_list.map do |elem|
      elem[:id]
    end
  end

  def exif_handle_description(extra_info)
    return if extra_info[:image_description].blank?

    note = Note.create_save(note: extra_info[:image_description])
    add_reference(note)
  end

  def extract_date(extra_info)
    date_time = extra_info[:date_time_original]
    date_time = extra_info[:create_date] if date_time.blank?

    return if date_time.blank?

    date_time[4] = '-'
    date_time[7] = '-'
    extra_info[:offset_time_original].present? && date_time += extra_info[:offset_time_original]
    date_time
  end

  def extract_timezone_offset(extra_info)
    return if extra_info[:offset_time_original].blank?

    m = extra_info[:offset_time_original].match(/^([+-])(\d\d):(\d\d)$/)
    raise StandardError, "Unknown timezone format: #{extra_info[:offset_time_original]}" if m.nil?

    offset = m[2].to_i * 60 + m[3].to_i

    if m[1] == '+'
      offset
    else
      -offset
    end
  end

  def exif_handle_date(extra_info)
    date_time = extract_date(extra_info)
    return if date_time.blank?

    event_date = EventDate.new
    event_date.set_date(date_time)
    timezone_offset = extract_timezone_offset(extra_info)
    event_date.update_attribute(:timezone_offset, timezone_offset) unless timezone_offset.blank?

    raise StandardError, "Could not save EventDate with date #{event_date}" unless event_date.save

    add_reference(event_date, role: 'Date')
  end

  def exif_handle_location(extra_info)
    unless extra_info[:gps_latitude].blank? ||
           extra_info[:gps_longitude].blank?
      address = Address.create_save(latitude: extra_info[:gps_latitude].to_f,
                                    longitude: extra_info[:gps_longitude].to_f)
      add_reference(address, role: 'Position')
    end
  end

  def exif_handle_camera(extra_info)
    device_attrs = {}
    make = extra_info[:make]
    make = extra_info[:android_manufacturer] if make.blank?
    device_attrs[:make] = make unless make.blank?
    model = extra_info[:model]
    model = extra_info[:android_model] if model.blank?
    device_attrs[:model] = model unless model.blank?
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
    add_reference(thing, role:)
  end
end
