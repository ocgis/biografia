# frozen_string_literal: true

# This is the relationship model
class Relationship < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'relationships'
  end

  def one_line
    retstr = if name.nil? || name == ''
               'Familj'
             else
               name
             end

    unless @extras.nil?
      people = @extras[:related_objects][:people]
      unless people.nil?
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

    retstr
  end

  def self.find_by_spouses(spouses)
    found = []
    rel_refs = spouses[0].get_references(model: Relationship)
    rel_refs.each do |rel_ref|
      rel = rel_ref.other_object(spouses[0])
      rel_spouse_refs = rel.get_references({ role: 'Spouse', model: Person })
      rel_spouse_ids = rel_spouse_refs.collect { |ref| ref.other_object(rel).id }
      spouse_ids = spouses.collect(&:id)
      found.append(rel) if rel_spouse_ids.sort == spouse_ids.sort
    end
    found
  end

  def all_attributes
    attributes
  end
end
