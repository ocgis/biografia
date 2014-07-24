require 'test_helper'

class TransfersControllerTest < ActionController::TestCase
  
  test "should get create" do
    get :create, { :upload => { :file_name => fixture_file_upload('transfer_upload_test.txt', 'text/plain') } }
    assert_response :redirect
  end

  test "should get new" do
    make_user(:editor)
    get :new
    assert_response :success
  end

  test "should get show" do
    make_user(:watcher)
    
    get :show, {'id' => transfers(:transfer1).id }
    assert_response :success
  end

  def setup
    FileUtils.rm_rf(Biografia::Application.config.transfer_path)
    Dir.mkdir(Biografia::Application.config.transfer_path)
  end

  def teardown
    FileUtils.rm_rf(Biografia::Application.config.transfer_path)
  end  

end
