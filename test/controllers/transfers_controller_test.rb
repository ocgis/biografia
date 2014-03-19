require 'test_helper'

class TransfersControllerTest < ActionController::TestCase
  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get create" do

    class dummy_file_name
      @original_filename = 'test'
    end

    get :create, { :upload => { :file_name => { dummy_file_name.new } }
    assert_response :success
  end

  test "should get show" do
    get :show, {'id' => transfers(:transfer1).id }
    assert_response :success
  end
end
