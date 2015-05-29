module RelationshipsHelper

  def relationships_showlimitedp(showlimitedp, options)
    new_options = options.merge({ :enclosedById => true,
                                  :parent => showlimitedp,
                                  :showFull => false })
    related_objects = showlimitedp.get_extra(:related_objects)

    html = ""
    html += application_attach_modifier(showlimitedp, options) do
      link_to showlimitedp.one_line, :controller => showlimitedp.controller, :action => 'show', :id => showlimitedp.id
    end
    html += '<ul>'
    html += render(:partial => 'people/showp',
                   :collection => related_objects[:people],
                   :layout => 'li',
                   :locals => { :options => new_options }) || ''
    html += render(:partial => 'event_dates/showp',
                   :collection => related_objects[:event_dates],
                   :layout => 'li',
                   :locals => { :options => new_options }) || ''
    html += render(:partial => 'addresses/showp',
                   :collection => related_objects[:addresses],
                   :layout => 'li',
                   :locals => { :options => new_options }) || ''
    html += render(:partial => 'notes/showp',
                   :collection => related_objects[:notes],
                   :layout => 'li',
                   :locals => { :options => new_options }) || ''
    html += '</ul>'
    html.html_safe
  end

  def relationships_showp(showp, options)
    html =  ""
    if options[:enclosedById]
      html += "<span id=\"#{showp.object_name}\">"
    end

    if options[:showFull]
      html += render :partial => showp.controller + '/showfullp', :object => showp, :locals => { :options => options }
    else
      html += relationships_showlimitedp(showp, options)
    end

# FIXME: Remove?
#    if not showp.get_extra(:reference).nil?
#      if not showp.get_extra(:reference).name.nil?
#        html += showp.get_extra(:reference).name
#      end
#    end

    if options[:showFull]
      html += '<div id="modal_dialog"></div>'.html_safe
      html += render :partial => "references/related", :object => showp, :locals => { :options => options }
      html += application_make_tabs
    end

    if options[:enclosedById]
      html += '</span>'
    end
    html.html_safe
  end

  def relationships_render(relationships, options)
    render :partial => "relationships/showp",
           :layout => "li",
           :collection => relationships,
           :locals => { :options => options }
  end

end
