require 'test_helper'

class EventsControllerTest < ActionController::TestCase

  test "should post createp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :createp, { :event => { :name => 'Test name' }, :form => { :parentId => people(:person1).object_name, :topName => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :edit, { :id => events(:event1).id, :topName => people(:person1).object_name }
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
    get :newp, { :topName => people(:person1).object_name }
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    get :show, { :id => events(:events_references).id }
    assert_response :success
  end

  test "should get show limited" do
    make_user(:watcher)
    @request.accept = "text/javascript"
    get :show, { :id => events(:event1).id, :parentId => people(:person1).object_name }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :id => events(:event1).id, :edited => { :name => 'Test name' }, :form => { :topName => people(:person1).object_name } }
    assert_response :success
  end

end
