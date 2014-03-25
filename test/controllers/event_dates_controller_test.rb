require 'test_helper'

class EventDatesControllerTest < ActionController::TestCase

  test "should get show" do
    get :show, {'id' => event_dates(:event_date1).id }
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end


# FIXME
#  test "should get new" do
#    get :new
#    assert_response :success
#  end

end
