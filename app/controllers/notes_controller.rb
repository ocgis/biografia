# -*- coding: utf-8 -*-
class NotesController < ApplicationController

  load_and_authorize_resource

  protected

  def create_object
    return Note.new(note_params)
  end

  def find_object
    return Note.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Note.find(params.require(:id))
    object.attributes = note_params
    return object
  end

  def all_objects
    return Note.all
  end

  def index_title
    return "Index över kommentarer"
  end

  private

  def note_params
    params.require(:note).permit(:title, :note)
  end

end
