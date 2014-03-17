class NotesController < ApplicationController

  protected

  def create_object
    return Note.new(note_params(params[:note]))
  end

  def find_object
    return Note.find(params[:id])
  end

  def find_object_and_update_attrs
    object = Note.find(params[:id])
    object.attributes = note_params(params[:edited])
    return object
  end

  private

  def note_params(params)
    params.permit(:title, :note)
  end

end
