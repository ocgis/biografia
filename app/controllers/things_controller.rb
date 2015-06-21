# -*- coding: utf-8 -*-

class ThingsController < ApplicationController

  load_and_authorize_resource

  protected

  protected

  def new_object(options={})
    @thing = Thing.new()
    if not options[:reference].nil?
      @thing.set_extra(:reference, options[:reference])
    end
  end

  def create_object
    return Thing.new(thing_params)
  end

  def find_object
    return Thing.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Thing.find(params.require(:id))
    object.attributes = thing_params
    return object
  end

  def all_objects
    return Thing.all
  end

  def index_title
    return "Index över saker"
  end

  private

  def thing_params
    p = params.require(:thing).permit(:name, :kind, :make, :model, :serial)
    [ :name, :kind, :make, :model, :serial ].each { |attr| p[attr] = nil if p[attr].blank? }
    return p
  end

end
