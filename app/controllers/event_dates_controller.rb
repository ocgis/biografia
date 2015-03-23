# -*- coding: utf-8 -*-
class EventDatesController < ApplicationController

  load_and_authorize_resource

  protected

  def new_object(options={})
  end

  def create_object
    p = ActionController::Parameters.new(event_date_params)
    object = EventDate.new()
    object.set_date(p[:date])
    return object
  end

  def find_object
    return EventDate.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = EventDate.find(params.require(:id))
    p = ActionController::Parameters.new(event_date_params)
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

  def event_date_params
    params.require(:event_date).permit(:date)
  end

end
