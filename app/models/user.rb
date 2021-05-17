# frozen_string_literal: true

# implementation of the user class
class User < ActiveRecord::Base
  include RoleModel

  roles :admin, :editor, :watcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  devise :omniauthable, omniauth_providers: %i[facebook]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at) unless auth.credentials.expires_at.nil?
      user.save!
      # Make the first user admin and give all permissions
      if user.id == 1
        user.roles << :admin
        user.roles << :editor
        user.roles << :watcher
        user.save!
      end
    end
  end

  def roles_map
    map = {}
    User.valid_roles.each do |role|
      map[role] = has_role? role
    end
    map
  end

  def all_attributes
    attributes.update({ roles: roles_map })
  end
end
