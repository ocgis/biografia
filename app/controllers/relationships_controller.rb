# -*- coding: utf-8 -*-
class RelationshipsController < ApplicationController

  protected

  def create_object
    return Relationship.new(object_params(params[:relationship]))
  end

  def find_object
    return Relationship.find(params[:id])
  end

  def find_object_and_update_attrs
    object = Relationship.find(params[:id])
    object.attributes = note_params(params[:edited])
    return object
  end

  def all_objects
    return Relationship.all
  end

  def index_title
    return "Index över förhållanden"
  end

  private

  def object_params(params)
    params.permit(:name)
  end

end
