module EventsHelper

  def events_showlimitedp(object, options)
    capture do
      parent = object.get_extra(:parent)
      related_objects = object.get_extra(:related_objects)

      concat(application_attach_modifier(object, options) do
               parts = []
               unless related_objects[:event_dates].length == 0
                 parts.append(related_objects[:event_dates].collect{|o| link_to(o.one_line, o)}.join(" "))
               end
               parts.append(link_to(object.name, :controller => object.controller, :action => 'show', :id => object.id))
               unless related_objects[:people].length == 0
                 parts.append("med")
                 parts.append(related_objects[:people].collect{|o| link_to(o.one_line, o)}.join(" "))
               end
               unless related_objects[:addresses].length == 0
                 parts.append("vid")
                 parts.append(related_objects[:addresses].collect{|o| link_to(o.one_line, o)}.join(" "))
               end
               concat(parts.join(" ").html_safe)
             end)
    end
  end

end
