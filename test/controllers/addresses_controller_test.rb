require 'test_helper'

class AddressesControllerTest < ActionController::TestCase

  test "should post createp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :createp, { :address => { :street => 'Street', :town => 'Town', :zipcode => '12345', :parish => 'Parish', :country => 'Country' }, :form => { :parentName => people(:person1).object_name, :topName => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    xhr :get, :edit, { :id => addresses(:address1).id, :topName => people(:person1).object_name }
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

  test "should get newp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    xhr :get, :newp, { :topName => people(:person1).object_name }
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    get :show, {'id' => addresses(:addresses_references).id }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :id => addresses(:address1).id, :address => { :street => 'Street', :town => 'Town', :zipcode => '12345', :parish => 'Parish', :country => 'Country' }, :form => { :topName => people(:person1).object_name } }
    assert_response :success
  end

end
