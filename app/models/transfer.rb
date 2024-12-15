# frozen_string_literal: true

# implementation of the transfer class
class Transfer < ActiveRecord::Base
  has_paper_trail

  validates_presence_of :content_type, :file_name

  def path
    File.join(Biografia::Application.config.transfer_path, id.to_s)
  end

  def full_file_name
    File.join(path, file_name)
  end

  def one_line
    file_name
  end

  def limited_attributes
    attributes
  end

  def all_attributes
    limited_attributes
  end
end
