class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.has_role? :admin
      can :manage, User
    end
    if user.has_role? :editor
      can [:delete, :destroy, :newp, :createp, :edit, :update], [Address, Event, EventDate, Note, Person, Relationship]
      can [:delete, :destroy, :connection_choose, :connection_add, :connection_list], Reference
      can [:create, :new], Transfer
      can [:new, :create], [ Address, Event, Person]
      can [:new, :create, :search, :register], Medium
      can [:create, :index, :new, :show], Export
    end
    if user.has_role? :watcher
      can [:index, :show], [Address, Event, EventDate, Note, Person, Relationship]
      can :show, Transfer
      can :ancestry, Person
      can [:index, :show], Medium
    end
  end
end
