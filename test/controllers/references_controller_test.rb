require 'test_helper'

class ReferencesControllerTest < ActionController::TestCase
  test "should get connection_choose" do
    get :connection_choose
    assert_response :success
  end

  test "should get delete" do
    get :delete
    assert_response :success
  end

end
