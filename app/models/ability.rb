class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.admin?
      can :manage, :all
    elsif user.editor?
      can [:read, :write], :all
    elsif user.watcher?
      can :read, :all
    end
  end
end
