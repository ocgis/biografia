class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.has_role? :admin
      can :manage, User
    end
    if user.has_role? :editor
      can [:newp, :createp, :edit, :update], [Address, Event, EventDate, Note, Person, Relationship]
      can [:delete, :destroy], Reference
    end
    if user.has_role? :watcher
      can [:show, :showp], [Address, Event, EventDate, Note, Person, Relationship]
    end
  end
end
