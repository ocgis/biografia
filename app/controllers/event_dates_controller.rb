# frozen_string_literal: true

# Implementation of the event dates controller class
class EventDatesController < ApplicationController
  load_and_authorize_resource

  protected

  def new_object(options = {})
    @event_date = EventDate.new
    return if options[:reference].nil?

    @event_date.set_extra(:reference, options[:reference])
  end

  def create_object
    object = EventDate.new
    object.set_date(event_date_params[:date])
    object
  end

  def find_object
    EventDate.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = EventDate.find(params.require(:id))
    object.set_date(event_date_params[:date])
    object
  end

  def all_objects
    EventDate.all
  end

  def index_title
    'Index över datum'
  end

  private

  def event_date_params
    params.require(:event_date).permit(:date)
  end
end
