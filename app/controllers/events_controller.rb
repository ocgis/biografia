# -*- coding: utf-8 -*-

class EventsController < ApplicationController

  load_and_authorize_resource

  protected

  def new_object(options={})
    @event = Event.new()
    if not options[:reference].nil?
      @event.set_extra(:reference, options[:reference])
    end
  end

  def create_object
    return Event.new(event_params)
  end

  def find_object
    return Event.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Event.find(params.require(:id))
    object.attributes = event_params
    return object
  end

  def all_objects
    return Event.all.limit(50)
  end

  def index_title
    return "Index över händelser"
  end

  private

  def event_params
    params.require(:event).permit(:name)
  end

end
