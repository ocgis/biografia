module ApplicationHelper

  def controller_name model_name
     if model_name == "Address"
       ctrl = "addresses"
     elsif model_name == "EventDate"
       ctrl = "event_dates"
     elsif model_name == "Person"
       ctrl = "people"
     else
       ctrl = model_name.downcase + "s"
     end
     ctrl
  end

end
