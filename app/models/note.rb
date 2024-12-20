# frozen_string_literal: true

# Implementation of the note class
class Note < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'notes'
  end

  def one_line
    return title unless title.nil?
    return '' unless note.length.positive?

    note.split("\n")[0]
  end

  def limited_attributes
    attributes.update({ _type_: 'Note' })
  end

  def all_attributes
    limited_attributes.update(extras)
  end

  def self.with_associations
    self
  end
end
