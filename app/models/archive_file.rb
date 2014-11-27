# -*- coding: utf-8 -*-
require 'zip'

class ArchiveFile

  def initialize(filename, content_type)
    @filename = filename
    @content_type = content_type
  end

  def import
    if @content_type == 'application/zip'
      extract_path = @filename + '.extract'
      FileUtils.rm_r(extract_path) if File.exists?(extract_path)
      Dir.mkdir(extract_path)

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

    f = Folder.new(extract_path)
    f.import()
  end

end
