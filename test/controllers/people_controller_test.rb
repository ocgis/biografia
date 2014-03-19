require 'test_helper'

class PeopleControllerTest < ActionController::TestCase

  test "should get index" do
    get :index
    assert_response :success
  end

# FIXME
#  test "should get show" do
#    get :show, {'id' => people(:person1).id }
#    assert_response :success
#  end

# FIXME
#  test "should get edit" do
#    get :edit, {'id' => people(:person1).id }
#    assert_response :success
#  end

# FIXME
#  test "should get update" do
#    get :update, {'id' => people(:person1).id }
#    assert_response :success
#  end

  test "should get destroy" do
    get :destroy, {'id' => people(:person1).id }
    assert_redirected_to(:action => "index")
  end

  test "should get ancestry" do
    get :ancestry, {'id' => people(:person1).id }
    assert_response :success
  end

end
