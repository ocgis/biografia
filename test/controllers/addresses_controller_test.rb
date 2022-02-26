# frozen_string_literal: true

require 'test_helper'

class AddressesControllerTest < ActionController::TestCase
  include Warden::Test::Helpers
  include Devise::Test::ControllerHelpers

  teardown do
    Warden.test_reset!
  end

  test 'should post createp' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :createp,
         params: {
           address: { street: 'Street', town: 'Town', zipcode: '12345', parish: 'Parish', country: 'Country' },
           form: { parentName: people(:person1).object_name, topName: people(:person1).object_name }
         }
    assert_response :success
  end

  test 'should get edit' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :edit, xhr: true, params: { id: addresses(:address1).id, topName: people(:person1).object_name }
    assert_response :success
  end

  test 'should get index' do
    sign_in make_user(:watcher)
    get :index
    assert_response :success
  end

  test 'should get new' do
    sign_in make_user(:editor)
    get :new
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
    get :show, params: { id: addresses(:addresses_references).id }
    assert_response :success
  end

  test 'should post update' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :update,
         params: {
           id: addresses(:address1).id,
           address: { street: 'Street', town: 'Town', zipcode: '12345', parish: 'Parish', country: 'Country' },
           form: { topName: people(:person1).object_name }
         }
    assert_response :success
  end
end
