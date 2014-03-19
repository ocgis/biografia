module PeopleHelper

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
