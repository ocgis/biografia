# -*- coding: utf-8 -*-
require 'test_helper'

class ReferencesControllerTest < ActionController::TestCase

  test "should post connection_add" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :connection_add, { :form => { :connect1Id => people(:person1).object_name,
                                      :connect2Id => media(:medium1).object_name,
                                      :x => '10',
                                      :y => '20',
                                      :w => '30',
                                      :h => '40' } }
    assert_response :success
  end

  test "should get connection_choose" do
    make_user(:editor)
    @request.accept = "text/javascript"
    xhr :get, :connection_choose, { :name => people(:person1).object_name }
    assert_response :success
  end

  test "should post connection_list" do
    make_user(:watcher)
    @request.accept = "text/javascript"
    get :connection_list, { :q => 'hej' }
    assert_response :success
  end

  test "should get delete" do
    make_user(:editor)
    @request.accept = "text/javascript"
    xhr :get, :delete, { :referencedId => people(:person2).object_name,
                         :id => references(:reference1).id,
                         :topName => people(:person1).object_name }
    assert_response :success
  end

  test "should post destroy" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :destroy, { :id => references(:reference1).id,
                     :topName => people(:person1).object_name }
    assert_response :success
  end

end
