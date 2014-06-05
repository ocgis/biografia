# -*- coding: utf-8 -*-
class EventDatesController < ApplicationController

  protected

  def create_object
    p = ActionController::Parameters.new(params.require(:event_date))
    object = EventDate.new()
    object.set_date(p[:date])
    return object
  end

  def find_object
    return EventDate.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = EventDate.find(params.require(:id))
    p = ActionController::Parameters.new(params.require(:event_date))
    object.set_date(p[:date])
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
