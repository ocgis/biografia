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

  def application_show_versions(object)
    out = ''.html_safe
    out << '<hr />'.html_safe
    version = object.versions.last
    until version.nil?
      out << object.inspect
      out << '<br />'.html_safe
      out << version.inspect
      out << '<br />'.html_safe
      out << version.event
      out << ' by '
      out << User.find(version.whodunnit).name
      out << '<br />'.html_safe
      out << '<br />'.html_safe

      object = object.previous_version
      version = version.previous
    end
    return out
  end
end
