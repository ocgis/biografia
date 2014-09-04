module ApplicationHelper
  def link_to_object_name(name, object_name, extras)
    a = object_name.split('_')
    if a.length != 2
      raise StandardError, "Not a valid object name: #{object_name}."
    end
    controller = a[0].tableize
    id = a[1].to_i
    return link_to name, { :controller => controller, :action => :show, :id => id }, extras
  end
end
