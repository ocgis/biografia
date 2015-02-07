# -*- coding: utf-8 -*-
require 'find'
require 'zip'

class ArchiveFile

  def initialize(filename, content_type, options = {})
    defaults = {
      status_object: nil
    }
    options = defaults.merge(options)

    @filename = filename
    @content_type = content_type
    @status_object = options[:status_object]
  end

  def set_status(status)
    unless @status_object.nil?
      @status_object.set_status(status)
    else
      puts("archive_file.rb: Status set to: #{status}")
    end
  end

  def import
    self.set_status("Importing archive file #{@filename}")

    if @content_type == 'application/zip'
      extract_path = @filename + '.extract'
      FileUtils.rm_r(extract_path) if File.exists?(extract_path)
      FileUtils.mkdir_p(extract_path)

      Zip::File.open(@filename) do |zip_file|
        # Handle entries one by one
        zip_file.each do |entry|
          # Extract to file/directory/symlink
          dest_file = File.join(extract_path, entry.name)

          entry.extract(dest_file)
        end
      end
    else
      raise StandardError, "Can't import #{@content_type} file"
    end

    f = Folder.new(extract_path, status_object: @status_object)
    f.import()

    self.set_status("Done importing archive file #{@filename}")
  end

  def export
    self.set_status("Exporting archive file #{@filename}")

    extract_path = @filename + '.extract'
    f = Folder.new(extract_path, status_object: @status_object)
    f.export()

    if @content_type == 'application/zip'
      Zip::File.open(@filename, Zip::File::CREATE) do |zip_file|
        old_dir = Dir.pwd
        Dir.chdir(extract_path)

        Find.find(extract_path) do |full_file|
          file = full_file.partition(extract_path+'/')[2]
          unless file == ''
            if File.directory?(full_file)
              zip_file.mkdir_p(file)
            else
              zip_file.add(file, full_file)
            end
          end
        end
        Dir.chdir(old_dir)
      end
    else
      self.set_status("Can't export archive file #{@filename}")
      raise StandardError, "Can't export #{@content_type} file"
    end

    self.set_status("Done exporting archive file #{@filename}")
  end

end
