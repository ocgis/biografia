require 'test_helper'

class EventsControllerTest < ActionController::TestCase

  test "should post createp" do
    @request.accept = "text/javascript"
    post :createp, { :event => { :name => 'Test name' }, :form => { :parentId => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    @request.accept = "text/javascript"
    get :edit, { :id => events(:event1).id }
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get newp" do
    @request.accept = "text/javascript"
    get :newp
    assert_response :success
  end

  test "should get show" do
    get :show, { :id => events(:references).id }
    assert_response :success
  end

  test "should get showp" do
    @request.accept = "text/javascript"
    get :showp, { :id => events(:event1).id }
    assert_response :success
  end

  test "should post update" do
    @request.accept = "text/javascript"
    post :update, { :id => events(:event1).id, :edited => { :name => 'Test name' } }
    assert_response :success
  end

end
