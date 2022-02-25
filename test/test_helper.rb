ENV["RAILS_ENV"] ||= "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

include ActionDispatch::TestProcess

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...

  def make_user(role)
    user = User.create!(email: 'apa@bepa.com',
                        password: 'sdhakhsdkhksd')
    user.roles << role
    user.save
    session[:user_id] = user.id
  end

end
