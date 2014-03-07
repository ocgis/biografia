require 'test_helper'

class PersonTest < ActiveSupport::TestCase
  test "name method" do
    person1 = Person.find(people(:person1).id)
    expected = people(:person1).calling_name + ' ' + people(:person1).surname
    actual = person1.name
    assert actual == expected, "Got '#{actual}', expected '#{expected}'"
  end

  test "short_name method" do
    person1 = Person.find(people(:person1).id)
    expected = people(:person1).calling_name + ' ' + people(:person1).surname
    actual = person1.short_name
    assert actual == expected, "Got '#{actual}', expected '#{expected}'"
  end

  test "long_name method" do
    person1 = Person.find(people(:person1).id)
    expected = people(:person1).given_name + ' ' + people(:person1).surname
    actual = person1.long_name
    assert actual == expected, "Got '#{actual}', expected '#{expected}'"
  end
end
