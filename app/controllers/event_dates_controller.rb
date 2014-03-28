# -*- coding: utf-8 -*-
class EventDatesController < ApplicationController

  protected

  def create_object
    p = ActionController::Parameters.new(:date => params.require(:date).to_s)
    return EventDate.new(event_date_params(p))
  end

  def find_object
    return EventDate.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = EventDate.find(params.require(:id))
    p = ActionController::Parameters.new(:date => params.require(:date).to_s)
    object.attributes = event_date_params(p)
    return object
  end

  def all_objects
    return EventDate.all
  end

  def index_title
    return "Index över datum"
  end

  private

  def event_date_params(params)
    params.permit(:date)
  end

end
