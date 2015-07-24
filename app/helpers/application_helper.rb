# -*- coding: utf-8 -*-
module ApplicationHelper
  def link_to_object_name(name, object_name, extras)
    unless object_name.nil?
      a = object_name.split('_')
      if a.length != 2
        raise StandardError, "Not a valid object name: #{object_name}."
      end
      controller = a[0].tableize
      id = a[1].to_i
      return link_to name, { :controller => controller, :action => :show, :id => id }, extras
    else
      return name
    end
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
    unless version.nil? or version.whodunnit.nil?
      name = User.find(version.whodunnit).name
      date = object.updated_at.strftime("%Y-%m-%d %H:%M")
      capture do
        content_tag(:span, class: "latest_update") do
          link_to "Ändrad av #{name}<br />#{date}".html_safe, { controller: object.controller, id: object.id, action: :examine }
        end
      end
    else
      capture do
        content_tag(:span, "Could not determine latest updater", class: "latest_update")
      end
    end
  end

  def application_make_tabs
    capture do
      content_tag(:div, id: "tabs") do
        concat(content_tag(:ul) do
                 content_for :tabs_headers
               end)
        concat content_for :tabs_content
      end
    end
  end

  def application_attach_modifier(object, options, &block)
    capture do
      content_tag(:table) do
        content_tag(:tr) do
          concat(content_tag(:td) do
                   capture(&block)
                 end)
          concat(content_tag(:td) do
                   content_tag(:table) do
                     content_tag(:tr) do
                       if current_user and current_user.has_role?(:editor)
                         concat(content_tag(:td) do
                                  content_tag(:div, class: "dropdownmenu") do
                                    if options[:showModifier]
                                      concat render :partial => object.controller + '/modifier', :object => object, :locals => { :options => options }
                                    end
                                  end
                                end)
                       end
                       concat(content_tag(:td) do
                                concat application_show_latest_update(object)
                              end)
                     end
                   end
                 end)
        end
      end
    end
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

    api_key = Biografia::Application.config.google_public_api_key
    attribution_url = Biografia::Application.config.google_attribution_url
    location = url_encode(options[:location])

    capture do
      concat '<iframe width="600" height="450" frameborder="0" style="border:0"'.html_safe
      concat 'src="https://www.google.com/maps/embed/v1/place'.html_safe
      concat "?key=#{api_key}".html_safe
      concat "&q=#{location}".html_safe
      concat '&attribution_source=Google+Maps+Embed+API'.html_safe
      concat "&attribution_web_url=#{attribution_url}".html_safe
      concat "&attribution_ios_deep_link_id=comgooglemaps://?daddr=#{location}\">".html_safe
      concat '</iframe>'.html_safe
    end
  end

  def application_search_form(options)
    defaults = {
      submitAction: { controller: nil,
                      action: nil},
      submitRemote: true,
      showFull: nil,
      hiddenFields: {},
      showList: true,
      ignoreName: nil,
      searchModel: nil,
      submitButtons: []
    }

    options = defaults.merge(options)

    capture do
      concat '<div class="search">'.html_safe unless options[:showList]
      concat(form_tag(options[:submitAction], { :remote => true }) do
               options[:hiddenFields].each do | k, v |
                 concat hidden_field 'form', k, :value => v
               end

               concat hidden_field 'form', 'connect2Id'

               if not options[:showFull].nil?
                 concat hidden_field 'form', 'showFull', :value => options[:showFull]
               end

               filter_options = {
                 class: 'filter',
                 'data-url' => url_for(controller: 'references', action: 'connection_list')
               }
               filter_options['data-ignore-name'] = options[:ignoreName] unless options[:ignoreName].nil?
               filter_options['data-search-model'] = options[:searchModel] unless options[:searchModel].nil?
               concat text_field 'filter', 'filter', filter_options
               options[:submitButtons].each do |sb|
                 concat(content_tag(:div) do
                          submit_tag sb[1], name: sb[0]
                        end)
               end
             end)
      concat '</div>'.html_safe unless options[:showList]
    end
  end
end
