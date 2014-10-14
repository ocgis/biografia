# -*- coding: utf-8 -*-
class RelationshipsController < ApplicationController

  load_and_authorize_resource

  protected

  def create_object
    return Relationship.new(object_params)
  end

  def find_object
    id = params.require(:id)

    return Relationship.find(id)
  end

  def find_object_and_update_attrs
    id = params.require(:id)

    object = Relationship.find(id)
    object.attributes = object_params
    return object
  end

  def all_objects
    return Relationship.all
  end

  def index_title
    return "Index över förhållanden"
  end

  private

  def object_params
    params.require(:relationship).permit(:name)
  end

end
