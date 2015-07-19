class PersonDecorator < Draper::Decorator
  delegate_all

  def markup_calling_name(pn)
    if pn.calling_name.nil?
      pn.given_name
    else
      pn.given_name.split(pn.calling_name, -1).join("<strong>" + pn.calling_name + "</strong>").html_safe
    end    
  end

  def one_line
    person_names = model.person_names.collect{|pn| [ markup_calling_name(pn), pn.surname ].compact.join(" ")}
    if person_names.length == 1
      return person_names[0].html_safe
    elsif person_names.length > 1
      main = person_names.pop
      other = person_names.join(", ")
      return "#{main} (#{other})".html_safe
    else
      return "!!!Error in DB: person name missing!!!"
    end

  end

end
