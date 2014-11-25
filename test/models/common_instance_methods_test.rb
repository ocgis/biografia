require 'test_helper'

class CommonInstanceMethodsTest < ActiveSupport::TestCase
  test "get_references method" do
    person = Person.create_save()
    references = person.get_references()
    assert references.length == 0, "Got #{references.length} references, expected no references"

    event = Event.create_save()
    person.add_reference(event)
    references = person.get_references()
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"

    note = Note.create_save()
    person.add_reference(note)
    references = person.get_references()
    assert references.length == 2, "Got #{references.length} references, expected 2 references"
    references = event.get_references()
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = note.get_references()
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
  end
end


class CommonInstanceMethodsTest < ActiveSupport::TestCase
  test "get_references method with model option" do
    person = Person.create_save()
    references = person.get_references({:model => Event})
    assert references.length == 0, "Got #{references.length} references, expected no references"
    references = person.get_references({:model => Note})
    assert references.length == 0, "Got #{references.length} references, expected no references"

    event = Event.create_save()
    person.add_reference(event)
    references = person.get_references({:model => Event})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"

    note = Note.create_save()
    person.add_reference(note)
    references = person.get_references({:model => Note})
    assert references.length == 1, "Got #{references.length} references, expected 1 references"
    references = person.get_references({:model => Event})
    assert references.length == 1, "Got #{references.length} references, expected 1 references"
    references = event.get_references({:model => Person})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = note.get_references({:model => Person})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
  end
end


class CommonInstanceMethodsTest < ActiveSupport::TestCase
  test "get_references method with role option" do
    person = Person.create_save()
    references = person.get_references
    assert references.length == 0, "Got #{references.length} references, expected no references"

    event = Event.create_save()
    person.add_reference(event, {:role => "Apa"})
    references = person.get_references({:role => "Apa"})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = person.get_references({:role => "Bepa"})
    assert references.length == 0, "Got #{references.length} references, expected 0 reference"

    note = Note.create_save()
    person.add_reference(note, {:role => "Bepa"})
    references = person.get_references({:role => "Apa"})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = person.get_references({:role => "Bepa"})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
  end
end


class CommonInstanceMethodsTest < ActiveSupport::TestCase
  test "get_references method with role and model options" do
    person = Person.create_save()
    references = person.get_references
    assert references.length == 0, "Got #{references.length} references, expected no references"

    event = Event.create_save()
    person.add_reference(event, {:role => "Apa"})
    references = person.get_references({:role => "Apa"})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"

    note = Note.create_save()
    person.add_reference(note, {:role => "Apa"})
    references = person.get_references({:role => "Apa"})
    assert references.length == 2, "Got #{references.length} references, expected 2 references"
    references = person.get_references({:role => "Apa", :model => Event})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = person.get_references({:role => "Apa", :model => Note})
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
  end
end


class CommonInstanceMethodsTest < ActiveSupport::TestCase
  test "get_references_to_object method" do
    person = Person.create_save()

    event = Event.create_save()
    references = person.get_references_to_object(event)
    assert references.length == 0, "Got #{references.length} references, expected 0 reference"

    person.add_reference(event)
    references = person.get_references_to_object(event)
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"

    note = Note.create_save()
    references = person.get_references_to_object(note)
    assert references.length == 0, "Got #{references.length} references, expected 0 reference"
    references = person.get_references_to_object(event)
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"

    person.add_reference(note)
    references = person.get_references_to_object(note)
    assert references.length == 1, "Got #{references.length} references, expected 1 references"
    references = person.get_references_to_object(event)
    assert references.length == 1, "Got #{references.length} references, expected 1 references"
    references = event.get_references_to_object(person)
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
    references = note.get_references_to_object(person)
    assert references.length == 1, "Got #{references.length} references, expected 1 reference"
  end
end
