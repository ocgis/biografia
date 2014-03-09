class Reference < ActiveRecord::Base
  has_and_belongs_to_many :addresses
  has_and_belongs_to_many :events
  has_and_belongs_to_many :notes
  has_and_belongs_to_many :people
end
