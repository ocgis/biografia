module RelationshipsHelper

  def relationships_showlimitedp(showlimitedp, options)
    new_options = options.merge({ :enclosedById => true,
                                  :parent => showlimitedp,
                                  :showFull => false })
    related_objects = showlimitedp.get_extra(:related_objects)

    html = ""
    html += link_to showlimitedp.one_line, :controller => showlimitedp.controller, :action => 'show', :id => showlimitedp.id
    if options[:showModifier]
      html += render :partial => showlimitedp.controller + '/modifier', :object => showlimitedp, :locals => { :options => options }
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

    if not showp.get_extra(:reference).nil?
      if not showp.get_extra(:reference).name.nil?
        html += showp.get_extra(:reference).name
      end
    end

    if options[:showFull]
      html += render :partial => "references/related", :object => showp, :locals => { :options => options }
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
