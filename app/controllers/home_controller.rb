# -*- coding: utf-8 -*-
class HomeController < ApplicationController

  def goto
    objectName = params.require(:form).require(:connect2Id)
    object = find_by_object_name(objectName)
    respond_to do |format|
      format.js { render "redirect", locals: { url: url_for(object) } }
    end
  end

end
