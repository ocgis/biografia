# -*- coding: utf-8 -*-
class Relationship < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  has_and_belongs_to_many :references

  def controller
    return 'relationships'
  end

  def one_line
    if name.nil?
      return "Namnlöst"
    else
      return name
    end
  end

end
