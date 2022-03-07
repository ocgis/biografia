# frozen_string_literal: true

require 'test_helper'

class ReferenceTest < ActiveSupport::TestCase
  test 'address reference' do
    reference3 = Reference.find(references(:reference3).id)
    address1 = Address.find(addresses(:address1).id)
    assert reference3 == address1.get_references[0], 'Association from reference to address does not work'
  end

  test 'event reference' do
    reference4 = Reference.find(references(:reference4).id)
    event1 = Event.find(events(:event1).id)
    assert reference4 == event1.get_references[0], 'Association from reference to event does not work'
  end

  test 'event date reference' do
    reference5 = Reference.find(references(:reference5).id)
    event_date1 = EventDate.find(event_dates(:event_date1).id)
    assert reference5 == event_date1.get_references[0], 'Association from reference to event date does not work'
  end

  test 'medium reference' do
    reference7 = Reference.find(references(:reference7).id)
    medium1 = Medium.find(media(:medium1).id)
    assert reference7 == medium1.get_references[0], 'Association from reference to medium does not work'
  end

  test 'note reference' do
    reference2 = Reference.find(references(:reference2).id)
    note1 = Note.find(notes(:note1).id)
    assert note1.get_references.includes(reference2), 'Association from reference to note does not work'
  end

  test 'person reference' do
    reference1 = Reference.find(references(:reference1).id)
    person2 = Person.find(people(:person2).id)
    assert person2.get_references.includes(reference1), 'Association from reference to person does not work'
  end

  test 'relationship reference' do
    reference6 = Reference.find(references(:reference6).id)
    relationship1 = Relationship.find(relationships(:relationship1).id)
    assert reference6 == relationship1.get_references[0], 'Association from reference to relationship does not work'
  end
end
