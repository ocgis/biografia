class PeopleController < ApplicationController

  def new
  end

  def create
     @person = Person.new(person_params(params[:person]))
     if @person.save
       redirect_to :action => 'display', :id => @person.id
     else
       render :action => 'new'
     end
  end

  def index
    @people = Person.all
  end

  def search_ajax
  end

  def display
    @base_id = params[:id]

    @person=Person.find(params[:id])
    @related=@person.related_objects
    @relationships=@person.find_spouses
    @parents=@person.find_parents
    @children=@person.find_children

    render layout: true
  end

  def destroy
  end

  def ancestry
  end

  protected

  def find_object
    return Person.find(params[:id])
  end

  def find_object_and_update_attrs
    object = Person.find(params[:id])
    object.attributes = person_params(params[:edited])
    return object
  end

  private

  def person_params(params)
    params.permit(:given_name, :calling_name, :surname, :sex)
  end

end
