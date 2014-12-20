class Person < ActiveRecord::Base
  has_paper_trail

  has_many :person_names, -> { order("position ASC") }

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    return "people"
  end

  def short_name
    person_name = self.person_names.last
    if not person_name.nil?
      names = [ person_name.calling_name, person_name.surname ]
      names.compact!
      return names.join(" ")
    else
      return "!!!Error in DB: person name missing!!!"
    end
  end

  def long_name
    person_names = self.person_names.collect{|pn| [ pn.given_name, pn.surname ].compact.join(" ")}
    if person_names.length == 1
      return person_names[0]
    elsif person_names.length > 1
      main = person_names.pop
      other = person_names.join(", ")
      return "#{main} (#{other})"
    else
      return "!!!Error in DB: person name missing!!!"
    end
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
