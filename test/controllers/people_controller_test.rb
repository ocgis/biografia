# frozen_string_literal: true

require 'test_helper'

class PeopleControllerTest < ActionController::TestCase
  include Warden::Test::Helpers
  include Devise::Test::ControllerHelpers

  teardown do
    Warden.test_reset!
  end

  # TODO: Fix problem and enable test
  #  test 'should get ancestry' do
  #    sign_in make_user(:watcher)
  #    get :ancestry, {'id' => people(:person1).id }
  #    assert_response :success
  #  end

  test 'should post create' do
    sign_in make_user(:editor)
    post :create,
         params: {
           person: { sex: 'Sex' },
           person_name_0: { given_name: 'Given Name', calling_name: 'Calling name', surname: 'Surname' }
         }
    assert_response :redirect
  end

  test 'should get edit' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :edit, xhr: true, params: { id: people(:person1).id, topName: people(:person1).object_name }
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

  test 'should get show' do
    sign_in make_user(:watcher)
    get :show, params: { id: people(:people_references).id }
    assert_response :success
  end

  test 'should post update' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :update,
         params: {
           id: people(:person1).id,
           person: { sex: 'Sex' },
           person_name_0: {
             id: person_names(:person_name1).id,
             given_name: 'Given Name',
             calling_name: 'Calling name',
             surname: 'Surname'
           },
           form: { topName: people(:person1).object_name }
         }
    assert_response :success
  end

  test 'should get delete' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :delete, xhr: true, params: { id: people(:person2).id,
                                      topName: people(:person1).object_name }
    assert_response :success
  end

  test 'should post destroy' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :destroy, params: { id: people(:person2).id,
                             referenceId: references(:reference1).id,
                             topName: people(:person1).object_name }
    assert_response :success
  end
end
