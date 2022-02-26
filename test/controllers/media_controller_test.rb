# frozen_string_literal: true

require 'test_helper'

class MediaControllerTest < ActionController::TestCase
  include Warden::Test::Helpers
  include Devise::Test::ControllerHelpers

  setup do
    # https://github.com/plataformatec/devise/wiki/How-To:-Test-with-Capybara
    # @user = users(:admin)
    # sign_in @user
  end

  teardown do
    Warden.test_reset!
  end

  # FIXME: test location: upload as well
  test 'should get create' do
    sign_in make_user(:editor)
    media_attr = { file_name: 'medium_no_exif.jpeg' }
    post :create, params: { media: media_attr, location: 'not upload' }
    media = Medium.where(media_attr).order(id: :desc)
    assert(media.length.positive?)
    assert_redirected_to media[0]
  end

  test 'should get index' do
    sign_in make_user(:watcher)
    get :index
    assert_response :success
  end

  test 'should get new' do
    sign_in make_user(:editor)
    get :new
    assert_response :success
  end

  test 'should get show' do
    sign_in make_user(:watcher)
    get :show, params: { id: media(:media_references).id }
    assert_response :success
  end

  # FIXME: Implement
  # test "should get showp" do
  #  get :showp, { :id => media(:medium2).id }
  #  assert_response :success
  # end
end
