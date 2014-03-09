require 'test_helper'

class ReferenceTest < ActiveSupport::TestCase
  test "address reference" do
    reference3 = Reference.find(references(:reference3).id)
    address1 = Address.find(addresses(:address1).id)
    assert reference3 == address1.references[0], 'Association from reference to address does not work'
    assert address1 == reference3.addresses[0], 'Association from address to reference does not work'
  end

  test "event reference" do
    reference4 = Reference.find(references(:reference4).id)
    event1 = Event.find(events(:event1).id)
    assert reference4 == event1.references[0], 'Association from reference to event does not work'
    assert event1 == reference4.events[0], 'Association from event to reference does not work'
  end

  test "event date reference" do
    reference5 = Reference.find(references(:reference5).id)
    event_date1 = EventDate.find(event_dates(:event_date1).id)
    assert reference5 == event_date1.references[0], 'Association from reference to event date does not work'
    assert event_date1 == reference5.event_dates[0], 'Association from event date to reference does not work'
  end

  test "note reference" do
    reference2 = Reference.find(references(:reference2).id)
    note1 = Note.find(notes(:note1).id)
    assert reference2 == note1.references[0], 'Association from reference to note does not work'
    assert note1 == reference2.notes[0], 'Association from note to reference does not work'
  end

  test "person reference" do
    reference1 = Reference.find(references(:reference1).id)
    person2 = Person.find(people(:person2).id)
    assert reference1 == person2.references[0], 'Association from reference to person does not work'
    assert person2 == reference1.people[0], 'Association from person to reference does not work'
  end
end
