require 'test_helper'

class NotesControllerTest < ActionController::TestCase

  test "should post createp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :createp, { :note => { :title => 'Title', :note => 'Note' }, :form => { :parentId => people(:person1).object_name } }
    assert_response :success
  end

  test "should get edit" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :edit, { :id => notes(:note1).id }
    assert_response :success
  end

  test "should get index" do
    make_user(:watcher)
    get :index
    assert_response :success
  end

  test "should get newp" do
    make_user(:editor)
    @request.accept = "text/javascript"
    get :newp
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    get :show, { :id => notes(:notes_references).id }
    assert_response :success
  end

  test "should get showp" do
    make_user(:watcher)
    @request.accept = "text/javascript"
    get :showp, { :id => notes(:note1).id }
    assert_response :success
  end

  test "should post update" do
    make_user(:editor)
    @request.accept = "text/javascript"
    post :update, { :edited => { :title => 'Title', :note => 'Note' }, :id => notes(:note1).id }
    assert_response :success
  end

end
