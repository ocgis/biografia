module CommonClassMethods
  
  def create_save(options={})
    object = new(options)
    if !object.save
      Rails::logger.error("ERROR: #{object.class.name} could not be saved: #{object.inspect}")
      raise StandardException
    end
    return object    
  end

end
