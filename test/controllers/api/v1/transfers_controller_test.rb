# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class TransfersControllerTest < ActionController::TestCase
      include Warden::Test::Helpers
      include Devise::Test::ControllerHelpers

      setup do
        FileUtils.rm_rf(Biografia::Application.config.transfer_path)
        Dir.mkdir(Biografia::Application.config.transfer_path)
      end

      teardown do
        FileUtils.rm_rf(Biografia::Application.config.transfer_path)
        Warden.test_reset!
      end

      test 'should post create' do
        sign_in make_user(:editor)
        post :create, params: { upload: { file_name: fixture_file_upload('transfer_upload_test.txt', 'text/plain') } }
        assert_response :success
      end

      test 'should get show' do
        sign_in make_user(:watcher)
        get :show, params: { 'id' => transfers(:transfer1).id }
        assert_response :success
      end
    end
  end
end
