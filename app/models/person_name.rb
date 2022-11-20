class PersonName < ActiveRecord::Base
  has_paper_trail

  belongs_to :person
  validates_presence_of :person

  acts_as_list scope: :person
end
