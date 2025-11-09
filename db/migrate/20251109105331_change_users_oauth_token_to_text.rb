# frozen_string_literal: true

# Change oauth_token from string to text
class ChangeUsersOauthTokenToText < ActiveRecord::Migration[7.0]
  def up
    change_column :users, :oauth_token, :text
  end

  def down
    # This might cause trouble if you have strings longer
    # than 255 characters.
    change_column :users, :oauth_token, :string
  end
end
