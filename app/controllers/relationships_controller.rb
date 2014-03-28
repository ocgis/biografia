# -*- coding: utf-8 -*-
class RelationshipsController < ApplicationController

  protected

  def create_object
    relationship = params.require(:relationship)

    return Relationship.new(object_params(relationship))
  end

  def find_object
    id = params.require(:id)

    return Relationship.find(id)
  end

  def find_object_and_update_attrs
    id = params.require(:id)
    edited = params.require(:edited)

    object = Relationship.find(id)
    object.attributes = object_params(edited)
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
