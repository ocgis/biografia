class UsersController < ApplicationController

  load_and_authorize_resource

  def index
    @users = User.all
    render :partial => 'indexp', :collection => @users
  end
  
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

  private

  def user_params
    params.require(:user).permit(:name, :home_object_name)
  end

end
