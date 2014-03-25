class Event < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  has_and_belongs_to_many :references

  def controller
    return "events"
  end

  def one_line
    return name
  end

end
