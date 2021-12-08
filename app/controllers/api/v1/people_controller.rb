class Api::V1::PeopleController < Api::V1::ApiController
  layout false

  load_and_authorize_resource

  protected

  def create_object
    Person.new(person_params)
  end

  def find_object
    Person.find(params.require(:id))
  end

  def find_object_and_update_attrs
    object = Person.find(params.require(:id))
    object.attributes = person_params
    object
  end

  def all_objects
    Person.all.preload(:person_names)
  end

  private

  def person_params
    params.require(:person).permit(:id, :sex, :source,
                                   person_names_attributes: %i[id given_name calling_name surname position
                                                               person_id _destroy])
  end
end
