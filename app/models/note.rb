class Note < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  has_and_belongs_to_many :references

  def controller
    return "notes"
  end

  def one_line
    return title
  end

end
