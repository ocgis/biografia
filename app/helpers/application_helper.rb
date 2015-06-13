# -*- coding: utf-8 -*-
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

  def application_show_latest_update(object)
    version = object.versions.last
    unless version.nil?
      name = User.find(version.whodunnit).name
      date = object.updated_at.strftime("%Y-%m-%d %H:%M")
      capture do
        concat '<span class="latest_update">'.html_safe
        concat link_to "Ändrad av #{name} #{date}", { controller: object.controller, id: object.id, action: :examine }
        concat '</span>'.html_safe
      end
    else
      capture do
        concat '<span class="latest_update">Could not determine latest updater</span>'.html_safe
      end
    end
  end

  def application_make_tabs
    html = ""
    html += '<div id="tabs">'
    html += '<ul>'
    html += content_for :tabs_headers
    html += '</ul>'
    html += content_for :tabs_content
    html.html_safe
  end

  def application_attach_modifier(object, options, &block)
    html = "<table><tr><td>"
    html += capture(&block)
    html += "</td><td>"
    html += '<div class="dropdownmenu">'
    if options[:showModifier]
      html += render :partial => object.controller + '/modifier', :object => object, :locals => { :options => options }
    end
    html += application_show_latest_update(object)
    html += '</div>'
    html += "</td></tr></table>"
    html.html_safe
  end

  def application_modal_dialog(title, &block)
    capture do
      concat "<div id=\"dialog\" title=\"#{title}\">".html_safe
      concat capture(&block)
      concat '</div>'.html_safe
    end
  end

  def application_make_hidden_fields(hidden_fields)
    capture do
      hidden_fields.each do |key, value|
        concat hidden_field 'form', key, value: value
      end
    end
  end

  def application_embed_map(options={})
    defaults = { location: 'Syrhåla' }
    options = defaults.merge(options)

    capture do
      api_key = Biografia::Application.config.google_public_api_key
      attribution_url = Biografia::Application.config.google_attribution_url
      concat '<iframe width="600" height="450" frameborder="0" style="border:0"'.html_safe
      concat 'src="https://www.google.com/maps/embed/v1/place'.html_safe
      concat "?key=#{api_key}".html_safe
      concat "&q=#{options[:location]}".html_safe
      concat '&attribution_source=Google+Maps+Embed+API'.html_safe
      concat "&attribution_web_url=#{attribution_url}".html_safe
      concat "&attribution_ios_deep_link_id=comgooglemaps://?daddr=#{options[:location]}\">".html_safe
      concat '</iframe>'.html_safe
    end
  end

end
