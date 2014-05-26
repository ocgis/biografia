require 'test_helper'

class EventDatesControllerTest < ActionController::TestCase

  test "should post createp" do
    @request.accept = "text/javascript"
    post :createp, { :event_date => { :date => 'FIXME' }, :form => { :parentId => events(:event1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    @request.accept = "text/javascript"
    get :edit, { :id => event_dates(:event_date1).id }
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
    get :show, {'id' => event_dates(:event_date1).id }
    assert_response :success
  end

  test "should get showp" do
    @request.accept = "text/javascript"
    get :showp, { :id => event_dates(:event_date1).id }
    assert_response :success
  end

  test "should post update" do
    @request.accept = "text/javascript"
    post :update, { :id => event_dates(:event_date1).id, :event_date => { :date => 'FIXME' } }
    assert_response :success
  end

end
