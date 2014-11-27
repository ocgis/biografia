# -*- coding: utf-8 -*-

class Folder

  def initialize(path)
    @path = path
  end

  def import
    if not import_holger7
      raise StandardError, "Can't import folder #{@path}"
    end
  end

  def import_holger7
    retval = false

    ho7_files = Dir.glob(File.join(@path, '*.ho7'))
    if ho7_files.length == 1
      basename = File.basename(ho7_files[0], '.ho7')

      ['p'].each do |db_type|
        filename = File.join(@path, basename + db_type + '.xml')
        x = XmlFile.new(filename)
        x.import
      end

      retval = true
    end

    return retval
  end
end
