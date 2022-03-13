# frozen_string_literal: true

require 'test_helper'

# StatusObject mock
class StatusObject
  attr_reader :status

  def set_status(new_status)
    @status = new_status
  end
end

# Tests for XmlFile class
class XmlFileTest < ActiveSupport::TestCase
  setup do
    Reference.delete_all
    PersonName.delete_all
    Person.delete_all
    Address.delete_all
    Relationship.delete_all
    Note.delete_all
    Event.delete_all
    EventDate.delete_all
  end

  test 'import xml files' do
    status_object = StatusObject.new
    xml_file = XmlFile.new(status_object: status_object)

    files = {}
    %w[p v a].each do |file_type|
      files[file_type] = {
        import: file_fixture("#{file_type}.xml"),
        export: File.join(Biografia::Application.config.export_path, "#{file_type}2.xml")
      }
    end

    files.each do |file_type, paths|
      import_file = paths[:import]
      xml_file.import(import_file, type: file_type)
      assert_equal("Done importing XML file #{import_file}", status_object.status)
    end

    expected_specs = [
      { model: Person,
        objects: [{ sex: 'F', source: ' P1' },
                  { sex: 'M', source: ' P2' },
                  { sex: 'F', source: ' P3' }] },
      { model: PersonName,
        objects: [{ position: 1,
                    given_name: 'Förnamn Ett',
                    calling_name: 'Förnamn',
                    surname: 'Födelsenamn',
                    person_id: 1 },
                  { position: 2,
                    given_name: 'Förnamn Ett',
                    calling_name: 'Förnamn',
                    surname: 'Efternamn',
                    person_id: 1 },
                  { position: 1,
                    given_name: 'Förnamn Två',
                    calling_name: 'Förnamn',
                    surname: 'Efternamn Två',
                    person_id: 2 },
                  { position: 1,
                    given_name: 'Förnamn Tre',
                    calling_name: 'Förnamn',
                    surname: 'Efternamn Tre',
                    person_id: 3 }] },
      { model: Address,
        objects: [{ street: 'Hemort 1', parish: 'Hemförsamling 1', source: ' P1 hem' },
                  { street: 'Födort 1', parish: 'Födförsamling 1', source: ' P1 fod' },
                  { street: 'Dödort 1', parish: 'Dödförsamling 1', source: ' P1 dod' },
                  { parish: 'Vigförsamling 1', source: ' V1 vig' }] },
      { model: Note,
        objects: [{ title: 'Orsak', note: 'Dödorsak 1', source: ' P1 dodors' },
                  { title: 'Yrke', note: 'Yrke 1', source: ' P1 yrke' },
                  { note: 'Anmärkning 1', source: ' P1 anm1' },
                  { note: 'Anmärkning 2', source: ' P1 anm2' },
                  { note: "Anmärkningstext 1.\nFortsättning.", source: ' P1 R1 anmtext' },
                  { note: "Anmärkningstext 2.\nFortsättning.", source: ' P1 R2 anmtext' },
                  { note: "Anmärkningstext 3.\nFortsättning.", source: ' P2 R1 anmtext' }] },
      { model: Event,
        objects: [{ name: 'Födelse', source: ' P1 fod' },
                  { name: 'Dop', source: ' P1 dop' },
                  { name: 'Död', source: ' P1 dod' },
                  { name: 'Begravning', source: ' P1 beg' },
                  { name: 'Boende', source: ' P1 hem' },
                  { name: 'Äktenskap', source: ' V1' }] }
      # TODO: Should also check references and event dates
    ]

    expected_specs.each do |expected_spec|
      model = expected_spec[:model]
      model_readable = model.name.underscore.humanize.downcase
      expecteds = expected_spec[:objects]

      # model.all.each do |object|
      #   puts object.inspect
      # end

      assert_equal(expecteds.length, model.all.length, "Wrong number of #{model_readable.pluralize}")

      expecteds.each do |expected|
        assert(model.where(expected).length == 1, "Could not find the following #{model_readable}: #{expected}")
      end
    end
  end

  test 'import and export xml files' do
    status_object = StatusObject.new
    xml_file = XmlFile.new(status_object: status_object)

    files = {}
    %w[p v a].each do |file_type|
      files[file_type] = {
        import: file_fixture("#{file_type}.xml"),
        export: File.join(Biografia::Application.config.export_path, "#{file_type}2.xml")
      }
    end

    files.each do |file_type, paths|
      import_file = paths[:import]
      xml_file.import(import_file, type: file_type)
      assert_equal("Done importing XML file #{import_file}", status_object.status)
    end

    files.each do |file_type, paths|
      export_file = paths[:export]
      xml_file.export(export_file, type: file_type)
      assert_equal("Done exporting XML file #{export_file}", status_object.status)
    end

    files.each do |_, paths|
      import_file = paths[:import]
      export_file = paths[:export]

      assert FileUtils.compare_file(import_file, export_file), "Files #{import_file} and #{export_file} differ"
    end
  end
end
