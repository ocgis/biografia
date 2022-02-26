# frozen_string_literal: true

require 'test_helper'

class NotesControllerTest < ActionController::TestCase
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
           note: {
             title: 'Title', note: 'Note'
           },
           form: {
             parentName: people(:person1).object_name, topName: people(:person1).object_name
           }
         }
    assert_response :success
  end

  test 'should get edit' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :edit, xhr: true, params: { id: notes(:note1).id, topName: people(:person1).object_name }
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
    get :show, params: { id: notes(:notes_references).id }
    assert_response :success
  end

  test 'should post update' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :update,
         params: {
           note: { title: 'Title', note: 'Note' }, id: notes(:note1).id, form: { topName: people(:person1).object_name }
         }
    assert_response :success
  end
end
