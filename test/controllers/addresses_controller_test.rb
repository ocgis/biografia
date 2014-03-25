require 'test_helper'

class AddressesControllerTest < ActionController::TestCase

  test "should get show" do
    get :show, {'id' => addresses(:address1).id }
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end

# FIXME
#  test "should get create" do
#    get :create
#    assert_response :success
#  end

# FIXME
#  test "should get edit" do
#    get :edit
#    assert_response :success
#  end

# FIXME
#  test "should get new" do
#    get :new
#    assert_response :success
#  end

# FIXME
#  test "should get update" do
#    get :update
#    assert_response :success
#  end

end
