# -*- coding: utf-8 -*-
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

  def find_family_members
    family_members = []
    family_refs = get_references(model: Relationship)
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      family.get_references(model: Person).each do |person_ref|
        person = person_ref.other_object(family)

        if person.id != self.id
          family_member = OpenStruct.new
          family_member.object = person
          if family_ref.name == "Child"
            if person_ref.name == "Child"
              if person.sex == "M"
                family_member.role = "Bror"
              elsif person.sex == "F"
                family_member.role = "Syster"
              else
                family_member.role = "Syskon"
              end
            elsif person_ref.name == "Spouse"
              if person.sex == "M"
                family_member.role = "Far"
              elsif person.sex == "F"
                family_member.role = "Mor"
              else
                family_member.role = "Förälder"
              end
            else
              family_member.role = "Error: person_ref.name == #{person_ref.name}" 
            end
          elsif family_ref.name == "Spouse"
            if person_ref.name == "Child"
              if person.sex == "M"
                family_member.role = "Son"
              elsif person.sex == "F"
                family_member.role = "Dotter"
              else
                family_member.role = "Barn"
              end
            elsif person_ref.name == "Spouse"
              if person.sex == "M"
                family_member.role = "Make" # FIXME: Check relationship events
              elsif person.sex == "F"
                family_member.role = "Maka" # FIXME: Check relationship events
              else
                family_member.role = "Partner"
              end
            else
              family_member.role = "Error: person_ref.name == #{person_ref.name}" 
            end
          else
            family_member.role = "Error: family_ref.name == #{family_ref.name}" 
          end
          family_members << family_member
        end
      end
    end
    return family_members
  end

  def self.filtered_search(filters)
    if filters.length > 0
      person_names = PersonName.where("given_name LIKE \"%#{filters[0]}%\" OR surname LIKE \"%#{filters[0]}%\"")

      filters[1..-1].each do |filter|
        person_names = person_names.where("given_name LIKE \"%#{filter}%\" OR surname LIKE \"%#{filter}%\"")
      end
      person_names = person_names.distinct
      person_names = person_names.first(100)

      people = person_names.collect{|person_name| person_name.person}
      people.compact! # FIXME: This should not be necessary
      return people
    else
      return []
    end
  end

end
