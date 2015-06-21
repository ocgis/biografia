# -*- coding: utf-8 -*-
module ThingsHelper

  def things_show_one(thing)
    parts = []
    parts.append(thing.name) unless thing.name.nil?
    make_model = []
    make_model.append(thing.make) unless thing.make.nil?
    make_model.append(thing.model) unless thing.model.nil?
    parts.append(make_model.join(" ")) if make_model.length > 0
    parts.append(thing.kind) unless thing.kind.nil?
    parts.append("Serienummer: #{thing.serial}") unless thing.serial.nil?
    parts.append("Okänd sak") if parts.length == 0

    capture do
      concat(parts.join("<br />").html_safe)
    end
  end

end
