require 'test_helper'

class ReferenceTest < ActiveSupport::TestCase
  test "person reference" do
    reference1 = Reference.find(references(:reference1).id)
    person2 = Person.find(people(:person2).id)
    assert reference1 == person2.references[0], 'Association from reference to person does not work'
    assert person2 == reference1.people[0], 'Association from person to reference does not work'
  end

  test "note reference" do
    reference2 = Reference.find(references(:reference2).id)
    note1 = Note.find(notes(:note1).id)
    assert reference2 == note1.references[0], 'Association from reference to note does not work'
    assert note1 == reference2.notes[0], 'Association from note to reference does not work'
  end
end
