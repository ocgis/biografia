# -*- coding: utf-8 -*-

class EventsController < ApplicationController

  protected

  def create_object
    return Event.new(event_params(params[:event]))
  end

  def find_object
    return Event.find(params[:id])
  end

  def find_object_and_update_attrs
    object = Event.find(params[:id])
    object.attributes = event_params(params[:edited])
    return object
  end

  def all_objects
    return Event.all
  end

  def index_title
    return "Index över händelser"
  end

  private

  def event_params(params)
    params.permit(:name)
  end

end
