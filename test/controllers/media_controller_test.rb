require 'test_helper'

class MediaControllerTest < ActionController::TestCase

  test "should get show" do
    get :show, {'id' => media(:medium2).id }
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end

end
