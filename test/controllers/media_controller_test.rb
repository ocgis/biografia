require 'test_helper'

class MediaControllerTest < ActionController::TestCase

  # FIXME: test location: upload as well
  test "should get create" do
    make_user(:editor)
    get :create, { :media => { :file_name => 'medium.jpeg' }, :location => 'not upload' }
    assert_response :redirect
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
    get :show, { :id => media(:media_references).id }
    assert_response :success
  end

  # FIXME: Implement
  # test "should get showp" do
  #  get :showp, { :id => media(:medium2).id }
  #  assert_response :success
  # end

end
