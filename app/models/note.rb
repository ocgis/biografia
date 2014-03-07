class Note < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  has_and_belongs_to_many :references
end
