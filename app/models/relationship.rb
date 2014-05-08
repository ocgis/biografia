# -*- coding: utf-8 -*-
class Relationship < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

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
