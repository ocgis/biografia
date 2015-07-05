class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.has_role? :admin
      can :manage, User
    end
    if user.has_role? :editor
      can [:delete, :destroy, :newp, :createp, :edit, :update, :examine], [Address, Event, EventDate, Note, Person, Relationship, Thing]
      can [:delete, :destroy, :connection_choose, :connection_add], Reference
      can [:create, :new], Transfer
      can [:new, :create], [ Address, Event, Person, Thing]
      can [:new, :create, :delete, :destroy, :tag, :search, :register, :file_thumb, :examine], Medium
      can [:create, :index, :new, :show, :status, :file], Export
      can [:new, :show, :status], Import
    end
    if user.has_role? :watcher
      can [:index, :show], [Address, Event, EventDate, Note, Person, Relationship, Thing]
      can [:index, :show], Transfer
      can :ancestry, Person
      can [:index, :show, :image, :thumb], Medium
      can [:connection_list], Reference
    end
  end
end
