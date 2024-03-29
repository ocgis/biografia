# frozen_string_literal: true

class Identity < OmniAuth::Identity::Models::ActiveRecord
  validates_presence_of :name
  validates_uniqueness_of :email
  validates_format_of :email, with: /\A[-a-z0-9_+.]+@([-a-z0-9]+\.)+[a-z0-9]{2,4}\z/i
end
