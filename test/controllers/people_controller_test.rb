require 'test_helper'

class PeopleControllerTest < ActionController::TestCase

  test "should get ancestry" do
    get :ancestry, {'id' => people(:person1).id }
    assert_response :success
  end

  test "should post create" do
    post :create, { :person => { :given_name => 'Given Name', :calling_name => 'Calling name', :surname => 'Surname', :sex => 'Sex' } }
    assert_response :redirect
  end

  test "should get destroy" do
    get :destroy, { :id => people(:person1).id }
    assert_redirected_to(:action => "index")
  end

  test "should get edit" do
    @request.accept = "text/javascript"
    get :edit, { :id => people(:person1).id }
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get show" do
    get :show, { :id => people(:people_references).id }
    assert_response :success
  end

  test "should get showp" do
    @request.accept = "text/javascript"
    get :showp, { :id => people(:person1).id }
    assert_response :success
  end

  test "should post update" do
    @request.accept = "text/javascript"
    post :update, { :id => people(:person1).id, :edited => { :given_name => 'Given Name', :calling_name => 'Calling name', :surname => 'Surname', :sex => 'Sex' } }
    assert_response :success
  end

end
