require 'test_helper'

class EventDatesControllerTest < ActionController::TestCase

  test "should post createp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :createp, { :event_date => { :date => '2013-12-22 10:23' }, :form => { :parentName => events(:event1).object_name, :topName => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :edit, { :id => event_dates(:event_date1).id, :topName => people(:person1).object_name }
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
    get :show, {'id' => event_dates(:event_date1).id }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :id => event_dates(:event_date1).id, :event_date => { :date => '1971-10-27' }, :form => { :topName => people(:person1).object_name } }
    assert_response :success
  end

end
