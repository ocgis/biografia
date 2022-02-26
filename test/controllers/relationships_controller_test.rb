# frozen_string_literal: true

require 'test_helper'

class RelationshipsControllerTest < ActionController::TestCase
  include Warden::Test::Helpers
  include Devise::Test::ControllerHelpers

  setup do
    # https://github.com/plataformatec/devise/wiki/How-To:-Test-with-Capybara
    # @user = users(:admin)
    # sign_in @user
  end

  teardown do
    Warden.test_reset!
  end

  test 'should post createp' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :createp,
         params: {
           relationship: { name: 'Test name' },
           form: { parentName: people(:person1).object_name, topName: people(:person1).object_name }
         }
    assert_response :success
  end

  test 'should get edit' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :edit, xhr: true, params: { id: relationships(:relationship1).id, topName: people(:person1).object_name }
    assert_response :success
  end

  test 'should get index' do
    sign_in make_user(:watcher)
    get :index
    assert_response :success
  end

  test 'should get newp' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :newp, xhr: true, params: { topName: people(:person1).object_name }
    assert_response :success
  end

  test 'should get show' do
    sign_in make_user(:watcher)
    get :show, params: { id: relationships(:relationships_references).id }
    assert_response :success
  end

  test 'should post update' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :update,
         params: {
           id: relationships(:relationship1).id,
           relationship: { name: 'Test name' },
           form: { topName: people(:person1).object_name }
         }
    assert_response :success
  end
end
