module EventsHelper

  def events_showlimitedp(object, options)
    capture do
      parent = object.get_extra(:parent)
      related_objects = object.get_extra(:related_objects)

      concat(application_attach_modifier(object, options) do
               parts = []
               event_dates = related_objects[:event_dates].reject{|o| o.object_name == parent.object_name }
               unless event_dates.length == 0
                 parts.append(event_dates.collect{|o| link_to(o.decorate.one_line, o)}.join(" "))
               end
               parts.append(link_to(object.name, :controller => object.controller, :action => 'show', :id => object.id))
               people = related_objects[:people].reject{|o| o.object_name == parent.object_name }
               unless people.length == 0
                 parts.append("med")
                 parts.append(people.collect{|o| link_to(o.decorate.one_line, o)}.join(" "))
               end
               addresses = related_objects[:addresses].reject{|a| a.object_name == parent.object_name }
               unless addresses.length == 0
                 parts.append("vid")
                 parts.append(addresses.collect{|o| link_to(o.decorate.one_line, o)}.join(" "))
               end
               concat(parts.join(" ").html_safe)
             end)
    end
  end

end
