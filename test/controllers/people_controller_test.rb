require 'test_helper'

class PeopleControllerTest < ActionController::TestCase

  test "should get ancestry" do
    make_user(:watcher)
    get :ancestry, {'id' => people(:person1).id }
    assert_response :success
  end

  test "should post create" do
    make_user(:editor)
    post :create, { :person => { :given_name => 'Given Name', :calling_name => 'Calling name', :surname => 'Surname', :sex => 'Sex' } }
    assert_response :redirect
  end

  test "should get destroy" do
    make_user(:editor)
    get :destroy, { :id => people(:person1).id }
    assert_redirected_to(:action => "index")
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :edit, { :id => people(:person1).id }
    assert_response :success
  end

  test "should get index" do
    make_user(:watcher)
    get :index
    assert_response :success
  end

  test "should get new" do
    make_user(:editor)
    get :new
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    get :show, { :id => people(:people_references).id }
    assert_response :success
  end

  test "should get showp" do
    make_user(:watcher)
    @request.accept = "text/javascript"
    get :showp, { :id => people(:person1).id }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :id => people(:person1).id, :person => { :given_name => 'Given Name', :calling_name => 'Calling name', :surname => 'Surname', :sex => 'Sex' } }
    assert_response :success
  end

end
