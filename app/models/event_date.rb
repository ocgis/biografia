# frozen_string_literal: true

# This is the event date model
class EventDate < ActiveRecord::Base
  has_paper_trail

  extend CommonClassMethods
  include CommonInstanceMethods

  def controller
    'event_dates'
  end

  def one_line
    get_date
  end

  def get_date
    return date.to_s if mask.nil?

    case mask
    when 'YYYY'
      date.strftime('%Y')
    when 'YYYY-MM'
      date.strftime('%Y-%m')
    when 'YYYY-MM-DD'
      date.strftime('%Y-%m-%d')
    when 'YYYY-MM-DD hh:mm'
      date.strftime('%Y-%m-%d %H:%M')
    when 'YYYY-MM-DD hh:mm:ss'
      date.strftime('%Y-%m-%d %H:%M:%S')
    else
      "Unknown mask #{mask} #{date}"
    end
  end

  def set_date(dstr)
    m = dstr.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/)
    unless m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i, m[3].to_i)
      self.mask = 'YYYY-MM-DD'
      return true
    end

    m = dstr.match(/^(\d\d\d\d)-(\d\d)$/)
    unless m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i)
      self.mask = 'YYYY-MM'
      return true
    end

    m = dstr.match(/^(\d\d\d\d)$/)
    unless m.nil?
      self.date = DateTime.new(m[1].to_i)
      self.mask = 'YYYY'
      return true
    end

    m = dstr.match(/^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)$/)
    unless m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i, m[3].to_i, m[4].to_i, m[5].to_i)
      self.mask = 'YYYY-MM-DD hh:mm'
      return true
    end

    m = dstr.match(/^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/)
    unless m.nil?
      self.date = DateTime.new(m[1].to_i, m[2].to_i, m[3].to_i, m[4].to_i, m[5].to_i, m[6].to_i)
      self.mask = 'YYYY-MM-DD hh:mm:ss'
      return true
    end

    raise StandardError, "Could not set date #{dstr}"
  end

  def all_attributes
    attributes.update({ _type_: 'EventDate' }).update(extras)
  end

  def self.with_associations
    self
  end
end
