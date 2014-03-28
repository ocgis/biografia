# -*- coding: utf-8 -*-
require 'test_helper'

class ReferencesControllerTest < ActionController::TestCase

  test "should post connection_add" do
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
    @request.accept = "text/javascript"
    get :connection_choose, { :id => people(:person1).object_name }
    assert_response :success
  end

  test "should post connection_list" do
    @request.accept = "text/javascript"
    post :connection_list, { :filter => { :filter => 'hej' },
                             :form => { :connect1Id => people(:person1).object_name,
                                        :updateListName => 'List name' } }
    assert_response :success
  end

  test "should get delete" do
    @request.accept = "text/javascript"
    get :delete, { :id => people(:person2).object_name,
                   :referenceId => references(:reference1).id,
                   :parentId => 'Parent ID',
                   :updateName => 'Update name',
                   :removeReferenceOnly => 'Remove reference only' }
    assert_response :success
  end

  test "should post destroy" do
    @request.accept = "text/javascript"
    post :destroy, { :id => people(:person2).object_name, :referenceId => references(:reference1).id, :removeReferenceOnly => 'false' }
    assert_response :success
  end

end
