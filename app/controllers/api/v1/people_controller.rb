class Api::V1::PeopleController < Api::V1::ApiController
  layout false

  load_and_authorize_resource


  protected

  def create_object
    puts person_params
  end


  def find_object
    person = Person.find(params.require(:id))

    return person
  end

  def all_objects
    Person.all.preload(:person_names).limit(50)
  end


  private
  
  def person_params
    params.require(:person).permit(:sex, person_names_attributes: [:given_name, :calling_name, :surname])
  end

end
