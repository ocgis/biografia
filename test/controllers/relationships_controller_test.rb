require 'test_helper'

class RelationshipsControllerTest < ActionController::TestCase

  test "should post createp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :createp, { :relationship => { :name => 'Test name' }, :form => { :parentId => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :edit, { :id => relationships(:relationship1).id }
    assert_response :success
  end

  test "should get index" do
    make_user(:watcher)
    get :index
    assert_response :success
  end

  test "should get newp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :newp
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    get :show, { :id => relationships(:relationships_references).id }
    assert_response :success
  end

  test "should get showp" do
    make_user(:watcher)
    @request.accept = "text/javascript"
    get :showp, { :id => relationships(:relationship1).id }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :id => relationships(:relationship1).id, :edited => { :name => 'Test name' } }
    assert_response :success
  end

end
