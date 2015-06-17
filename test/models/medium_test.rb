# -*- coding: utf-8 -*-
require 'test_helper'

class MediumTest < ActiveSupport::TestCase

  test "medium extra_info image description" do
    medium = Medium.create_save(file_name: "medium_image_description.jpeg")

    extra_info = medium.extra_info

    assert extra_info[:image_description] == "Räksmörgås", "Got [#{extra_info[:image_description]}], expected [Räksmörgås]"
  end

  test "medium extra_info date_time_original" do
    medium = Medium.create_save(file_name: "medium_date_time.jpeg")

    extra_info = medium.extra_info

    test_assert({ got: extra_info[:date_time_original],
                  expected: "2015:06:16 10:42:02" })
  end

  test "medium get_location" do
    medium = Medium.create_save(file_name: "medium_position.jpeg")

    position = medium.get_location

    test_assert({ got: position,
                  expected: "57.0,11.0" })
  end

  test "medium handle_extra_info image description" do
    medium = Medium.create_save(file_name: "medium_image_description.jpeg")

    medium.handle_extra_info

    references = medium.get_references
    referenced_objects = references.collect{ |reference| reference.other_object(medium) }

    test_assert({ got: "#{referenced_objects.length} referenced object",
                  expected: "1 referenced object" })
    test_assert({ got: "#{referenced_objects[0].class.name} object",
                  expected: "Note object" })
    test_assert({ got: referenced_objects[0][:note],
                  expected: "Räksmörgås" })
  end

  test "medium handle_extra_info date_time_original" do
    medium = Medium.create_save(file_name: "medium_date_time.jpeg")

    medium.handle_extra_info

    references = medium.get_references
    referenced_objects = references.collect{ |reference| reference.other_object(medium) }

    test_assert({ got: "#{referenced_objects.length} referenced object",
                  expected: "1 referenced object" })
    test_assert({ got: "#{referenced_objects[0].class.name} object",
                  expected: "EventDate object" })
    test_assert({ got: referenced_objects[0].get_date(),
                  expected: "2015-06-16 10:42:02" })
  end

  test "medium handle_extra_info position" do
    medium = Medium.create_save(file_name: "medium_position.jpeg")

    medium.handle_extra_info

    references = medium.get_references
    referenced_objects = references.collect{ |reference| reference.other_object(medium) }

    test_assert({ got: "#{referenced_objects.length} referenced object",
                  expected: "1 referenced object" })
    test_assert({ got: "#{referenced_objects[0].class.name} object",
                  expected: "Address object" })
    test_assert({ got: referenced_objects[0][:latitude].to_s,
                  expected: "57.0" })
    test_assert({ got: referenced_objects[0][:longitude].to_s,
                  expected: "11.0" })
  end

  private

  def test_assert(result)
    assert result[:got] == result[:expected], "Got [#{result[:got]}], expected [#{result[:expected]}]"
  end
end
