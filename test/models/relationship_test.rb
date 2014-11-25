require 'test_helper'

class RelationshipTest < ActiveSupport::TestCase

  test "find_by_spouses method" do
    person1 = Person.create_save()
    person2 = Person.create_save()
    relationship1 = Relationship.create_save()
    person1.add_reference(relationship1, {:role => "Spouse"})
    relationships = Relationship.find_by_spouses([person1, person2])
    assert relationships.length == 0, "Got #{references.length} relationships, expected 0"
    relationships = Relationship.find_by_spouses([person1])
    assert relationships.length == 1, "Got #{references.length} relationships, expected 1"
    person2.add_reference(relationship1, {:role => "Spouse"})
    relationships = Relationship.find_by_spouses([person1, person2])
    assert relationships.length == 1, "Got #{references.length} relationships, expected 1"
    relationships = Relationship.find_by_spouses([person1])
    assert relationships.length == 0, "Got #{references.length} relationships, expected 0"
  end

end
