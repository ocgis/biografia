# -*- coding: utf-8 -*-
class PeopleController < ApplicationController

  load_and_authorize_resource

  def search_ajax
  end

  def ancestry
    @ancestry = ancestry_help(params.require(:id), 4)
  end

  protected

  def create_object
    return Person.new(person_params)
  end

  def find_object
    return Person.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Person.find(params.require(:id))
    object.attributes = person_params
    return object
  end

  def all_objects
    Person.all
  end

  def index_title
    return "Index över personer"
  end

  private

  def person_params
    params.require(:person).permit(:given_name, :calling_name, :surname, :sex)
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
