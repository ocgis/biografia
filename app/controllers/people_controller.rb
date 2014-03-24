class PeopleController < ApplicationController

  def create
     @person = Person.new(person_params(params[:person]))
     if @person.save
       redirect_to :action => 'display', :id => @person.id
     else
       render :action => 'new'
     end
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
    Person.find(params["id"]).destroy
    redirect_to :action => "index" 
  end

  def ancestry
    @ancestry = ancestry_help(params["id"], 4)
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

  def all_objects
    Person.all
  end

  private

  def person_params(params)
    params.permit(:given_name, :calling_name, :surname, :sex)
  end

  def ancestry_help(id, depth)
    person=Person.find(id)

    if person == nil
       a = nil
    else
       a = { :person => person }

       if depth > 1
         parents=person.find_parents

         for parent in parents
           if parent.sex == "M"
              a[:father] = ancestry_help(parent.id, depth - 1)
           end
           if parent.sex == "F"
              a[:mother] = ancestry_help(parent.id, depth - 1)
           end
         end
       end
    end

    return a
  end

end
