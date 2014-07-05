OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Rails.application.config.facebook_app_id, Rails.application.config.facebook_app_secret
  provider :identity
end
