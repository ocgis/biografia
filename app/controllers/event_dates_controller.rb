class EventDatesController < ApplicationController

  protected

  def create_object
    p = ActionController::Parameters.new(:date => params[:date].to_s)
    return EventDate.new(event_date_params(p))
  end

  def find_object
    return EventDate.find(params[:id])
  end

  def find_object_and_update_attrs
    object = EventDate.find(params[:id])
    p = ActionController::Parameters.new(:date => params[:date].to_s)
    object.attributes = event_date_params(p)
    return object
  end

  private

  def event_date_params(params)
    params.permit(:date)
  end

end
