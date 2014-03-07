require 'test_helper'

class ReferenceTest < ActiveSupport::TestCase
  test "person reference" do
    reference1 = Reference.find(references(:reference1).id)
    person2 = Person.find(people(:person2).id)
    assert reference1 == person2.references[0], 'Association from reference to person does not work'
    assert person2 == reference1.people[0], 'Association from person to reference does not work'
  end
end
