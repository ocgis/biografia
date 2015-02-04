# -*- coding: utf-8 -*-

class Folder

  def initialize(path, options = {})
    defaults = { format: 'holger7' } # FIXME
    options = defaults.merge(options)

    @path = path
    @format = options[:format]
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

      x = XmlFile.new
      ['p', 'v', 'a', 'c', 'k', 'm' ].each do |db_type|
        filename = File.join(@path, basename + db_type + '.xml')
        x.import(filename, source: basename)
      end

      retval = true
    end

    return retval
  end

  def export
    if @format == 'holger7'
      export_holger7
    else
      raise StandardError, "Can't export to format #{@format}"
    end
  end

  def export_holger7
    Dir.mkdir(@path)
    x = XmlFile.new
    ['p', 'a', 'v'].each do |type|
      dbname = File.basename(@path).split('.')[0]
      x.export(@path + "/#{dbname}#{type}.xml", type: type)
    end
  end

end
