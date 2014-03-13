class Medium < ActiveRecord::Base
  has_and_belongs_to_many :references

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "media"
  end

end
