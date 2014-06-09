class Person < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "people"
  end

  def short_name
    names = [ self.calling_name, self.surname ]
    names.compact!
    return names.join(" ")
  end

  def long_name
    names = [ self.given_name, self.surname ]
    names.compact!
    return names.join(" ")
  end
  
  def name
    short_name
  end

  #FIXME: Add test
  def find_parents
    parents = []
    family_refs = get_references.where(:name => 'Child')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      parent_refs = family.get_references.where(:name => 'Spouse')
      parent_refs.each do |parent_ref|
        parents << parent_ref.other_object(family)
      end
    end
    return parents
  end

  #FIXME: Add test
  def find_spouses
    spouses = []
    family_refs = get_references.where(:name => 'Spouse')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      spouse_refs = family.get_references.where(:name => 'Spouse')
      members = []
      spouse_refs.each do |spouse_ref|
        member = spouse_ref.other_object(family)
        if member.object_name != self.object_name
          members << member
        end
      end
      spouses << { :members => members, :name => 'FIXME' }
    end
    return spouses
  end

  #FIXME: Add test
  def find_children
    children = []
    family_refs = get_references.where(:name => 'Spouse')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      child_refs = family.get_references.where(:name => 'Child')
      child_refs.each do |child_ref|
        children << child_ref.other_object(family)
      end
    end
    return children
  end
end
