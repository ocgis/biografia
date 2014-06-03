# -*- coding: utf-8 -*-
class Relationship < ActiveRecord::Base
  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return 'relationships'
  end

  def one_line
    if name.nil? or name == ""
      retstr = "Familj"
    else
      retstr = name
    end
    
    if not @extras.nil?
      people = @extras[:related_objects][:people]
      if not people.nil?
        if people.length == 1
          retstr << " bestående av #{people[0].name}"
        elsif people.length == 2
          retstr << " bestående av #{people[0].name} och #{people[1].name}"
        elsif people.length == 3
          retstr << " bestående av #{people[0].name}, #{people[1].name} och en person till"
        elsif people.length > 3
          extra_people = people.length - 2
          retstr << " bestående av #{people[0].name}, #{people[1].name} och #{extra_people} personer till"
        end
      end
    end
    
    return retstr
  end

end
