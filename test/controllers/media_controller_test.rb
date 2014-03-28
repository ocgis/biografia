require 'test_helper'

class MediaControllerTest < ActionController::TestCase

  # FIXME: test location: upload as well
  test "should get create" do
    get :create, { :media => { :file_name => 'file_name' }, :location => 'not upload' }
    assert_response :redirect
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
    get :show, { :id => media(:medium2).id }
    assert_response :success
  end

  # FIXME: Implement
  # test "should get showp" do
  #  get :showp, { :id => media(:medium2).id }
  #  assert_response :success
  # end

end
