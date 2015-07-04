# -*- coding: utf-8 -*-
class UsersController < ApplicationController

  load_and_authorize_resource

  def show
    @user = User.find(params.require(:id))
  end
  
  def edit
    @user = User.find(params.require(:id))
    puts @user.inspect
  end
  
  def update
    id = params.require(:id)
    user = User.find(id)
    user.update_attributes(user_params)
    roles = params.require(:user).require(:roles)
    user.roles = []
    roles.each do |role|
      user.roles << role.to_sym
    end
    user.save
    redirect_to :action => :show, :id => id
  end

  protected

  def all_objects
    return User.all
  end

  def index_title
    return "Alla användare"
  end

  private

  def user_params
    params.require(:user).permit(:name, :home_object_name)
  end

end
