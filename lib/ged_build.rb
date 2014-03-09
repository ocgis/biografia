module GedBuild
  
  class GedLine
    def initialize(tag, options={})
      defaults = {
        :id => nil,
        :extra => nil,
        :children => []
      }
      options = defaults.merge(options)
      
      @id = options[:id]
      @tag = tag
      @extra = options[:extra]
      @children = options[:children]
    end
    
    def to_s(level = 0)
      text = "#{level}"
      text = text + " #{@id}" if not @id.nil?
      text = text + " #{@tag}"
      text = text + " #{@extra}" if not @extra.nil?
      text = text + "\n"
      @children.each do |child|
        text = text + child.to_s(level + 1)
      end
      return text
    end
  end
  
  class GedFile
    def initialize(gedlines=[])
      @lines = gedlines
    end
    
    def append(gedline)
      lines.append(gedline)
    end
    
    def to_s
      text = ""
      @lines.each do |line|
        text = text + line.to_s
      end

      return text
    end
  end
end