class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def new
  end
 
  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    unless user.home_object_name.nil?
      redirect_to find_by_object_name(user.home_object_name)
    else
      redirect_to root_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end
end
