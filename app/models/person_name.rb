class PersonName < ActiveRecord::Base
  belongs_to :person

  acts_as_list scope: :person
end
