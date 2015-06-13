# -*- coding: utf-8 -*-
require 'test_helper'

class MediumTest < ActiveSupport::TestCase

  test "medium extra_info image description" do
    medium = Medium.create_save(file_name: "medium_image_description.jpeg")

    extra_info = medium.extra_info

    assert extra_info[:image_description] == "Räksmörgås", "Got [#{extra_info[:image_description]}], expected [Räksmörgås]"
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

  private

  def test_assert(result)
    assert result[:got] == result[:expected], "Got [#{result[:got]}], expected [#{result[:expected]}]"
  end
end
