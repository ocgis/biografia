# frozen_string_literal: true

require 'test_helper'

class ReferencesControllerTest < ActionController::TestCase
  include Warden::Test::Helpers
  include Devise::Test::ControllerHelpers

  teardown do
    Warden.test_reset!
  end

  test 'should post connection_add' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :connection_add, params: { form: { connect1Id: people(:person1).object_name,
                                            connect2Id: media(:medium1).object_name,
                                            x: '10',
                                            y: '20',
                                            w: '30',
                                            h: '40' } }
    assert_response :success
  end

  test 'should get connection_choose' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :connection_choose, xhr: true, params: { name: people(:person1).object_name }
    assert_response :success
  end

  test 'should post connection_list' do
    sign_in make_user(:watcher)
    @request.accept = 'text/javascript'
    get :connection_list, xhr: true, params: { q: 'hej' }
    assert_response :success
  end

  test 'should get delete' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    get :delete, xhr: true, params: { referencedId: people(:person2).object_name,
                                      id: references(:reference1).id,
                                      topName: people(:person1).object_name }
    assert_response :success
  end

  test 'should post destroy' do
    sign_in make_user(:editor)
    @request.accept = 'text/javascript'
    post :destroy, params: { id: references(:reference1).id,
                             topName: people(:person1).object_name }
    assert_response :success
  end
end
