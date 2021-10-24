# frozen_string_literal: true

# Ability definitions for CanCan
class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    can :manage, User if user.has_role? :admin

    if user.has_role? :editor
      can %i[delete destroy newp createp edit update selmerge edmerge domerge examine],
          [Address, Event, EventDate, Note, Person, Relationship, Thing]
      can %i[create delete destroy connection_choose connection_add], Reference
      can %i[create new], Transfer
      can %i[new create], [Address, Event, Person, Thing]
      can %i[new create delete destroy tag search show_file register file_image file_thumb examine],
          Medium
      can %i[create index new show status file], Export
      can %i[new show status], Import
    end

    return unless user.has_role? :watcher

    can %i[index show],
        [Address, Event, EventDate, Note, Person, Relationship, Thing]
    can %i[index show], Transfer
    can :ancestry, Person
    can %i[index show image thumb], Medium
    can %i[connection_list list], Reference
  end
end
