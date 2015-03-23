module PeopleHelper

  def person_link_to(person)
    return link_to person.long_name, :controller => person.controller, :action => 'show', :id => person.id
  end

  def person_show_family(person)
    html = "<table>"
    person.find_family_members.each do |family_member|
      html << "<tr>"
      html << "<td>"
      html << person_link_to(family_member.object)
      html << "</td>"
      html << "<td>#{family_member.role}</td>"
      html << "</tr>"
    end
    html << "</table>"
    return html.html_safe
  end

  def ancestry_table(ancestry, options={:depth => 2, top => false})
    if ancestry == nil
      return ""
    else
      str = "<tr>"
      str = str + "<td>" +
            link_to(ancestry[:person].short_name,
                    :action => "ancestry", :id => ancestry[:person].id) +
            "</td>"

      if options[:depth] > 1
        str << "<td><table>" + ancestry_table(ancestry[:father], :depth => options[:depth] - 1) + ancestry_table(ancestry[:mother], :depth => options[:depth] - 1) + "</table></td>"
      end
      str = str + "</tr>"

      return str
    end
  end

end
