class User < ActiveRecord::Base

  include RoleModel
  
  roles :admin, :editor, :watcher
  
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      if not auth.credentials.expires_at.nil?
        user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      end
      user.save!
    end
  end
end
