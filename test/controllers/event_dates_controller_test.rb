# frozen_string_literal: true

require 'test_helper'

class EventDatesControllerTest < ActionController::TestCase
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
           event_date: { date: '2013-12-22 10:23' },
           form: { parentName: events(:event1).object_name, topName: people(:person1).object_name }
         }
    assert_response :success
  end

  test 'should get edit' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :edit, xhr: true, params: { id: event_dates(:event_date1).id, topName: people(:person1).object_name }
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
    get :show, params: { id: event_dates(:event_date1).id }
    assert_response :success
  end

  test 'should post update' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :update,
         params: {
           id: event_dates(:event_date1).id,
           event_date: { date: '1971-10-27' },
           form: { topName: people(:person1).object_name }
         }
    assert_response :success
  end
end
