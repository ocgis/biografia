# coding: utf-8
# frozen_string_literal: true

# Implementation of the person class
class Person < ActiveRecord::Base
  has_paper_trail

  has_many :person_names, -> { order('position ASC') }, inverse_of: :person
  accepts_nested_attributes_for :person_names, allow_destroy: true

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'people'
  end

  def short_name
    person_name = person_names.last

    return '!!!Error in DB: person name missing!!!' if person_name.nil?

    names = [person_name.calling_name, person_name.surname]
    names.compact!
    names.join(' ')
  end

  def long_name
    person_names = self.person_names.collect { |pn| [pn.given_name, pn.surname].compact.join(' ') }

    return person_names[0] if person_names.length == 1
    return '!!!Error in DB: person name missing!!!' unless person_names.length > 1

    main = person_names.pop
    other = person_names.join(', ')
    "#{main} (#{other})"
  end

  def name
    short_name
  end

  # FIXME: Add test
  def find_parents
    parents = []
    family_refs = get_references.where(name: 'Child')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      parent_refs = family.get_references.where(name: 'Spouse')
      parent_refs.each do |parent_ref|
        parents << parent_ref.other_object(family)
      end
    end
    parents
  end

  # FIXME: Add test
  def find_spouses
    spouses = []
    family_refs = get_references.where(name: 'Spouse')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      spouse_refs = family.get_references.where(name: 'Spouse')
      members = []
      spouse_refs.each do |spouse_ref|
        member = spouse_ref.other_object(family)
        members << member if member.object_name != object_name
      end
      spouses << { members: members, name: 'FIXME' }
    end
    spouses
  end

  # FIXME: Add test
  def find_children
    children = []
    family_refs = get_references.where(name: 'Spouse')
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      child_refs = family.get_references.where(name: 'Child')
      child_refs.each do |child_ref|
        children << child_ref.other_object(family)
      end
    end
    children
  end

  def find_family_members
    family_members = []
    family_refs = get_references(model: Relationship)
    family_refs.each do |family_ref|
      family = family_ref.other_object(self)
      family.get_references(model: Person).each do |person_ref|
        person = person_ref.other_object(family)

        next if person.id == id

        family_member = OpenStruct.new
        family_member.object = person
        family_member.role =
          case family_ref.name
          when 'Child'
            case person_ref.name
            when 'Child'
              case person.sex
              when 'M'
                'Bror'
              when 'F'
                'Syster'
              else
                'Syskon'
              end
            when 'Spouse'
              case person.sex
              when 'M'
                'Far'
              when 'F'
                'Mor'
              else
                'Förälder'
              end
            else
              "Error: person_ref.name == #{person_ref.name}"
            end
          when 'Spouse'
            case person_ref.name
            when 'Child'
              case person.sex
              when 'M'
                'Son'
              when 'F'
                'Dotter'
              else
                'Barn'
              end
            when 'Spouse'
              case person.sex
              when 'M'
                'Make' # FIXME: Check relationship events
              when 'F'
                'Maka' # FIXME: Check relationship events
              else
                'Partner'
              end
            else
              "Error: person_ref.name == #{person_ref.name}"
            end
          else
            "Error: family_ref.name == #{family_ref.name}"
          end
        family_members << family_member
      end
    end
    family_members
  end

  def self.filtered_search(filters)
    people = Person.preload(:person_names).joins(:person_names)
    filters.each do |filter|
      people = people.where("given_name LIKE \"%#{filter}%\" OR surname LIKE \"%#{filter}%\"")
    end
    people = people.distinct.first(100)
  end

  def all_attributes
    person_names_attr = person_names.map(&:attributes)

    attributes.update({ _type_: 'Person',
                        person_names: person_names_attr,
                        name: name }).update(extras)
  end
end
