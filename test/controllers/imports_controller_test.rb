require 'test_helper'
require 'ged_build'
include GedBuild

class ImportsControllerTest < ActionController::TestCase
  test "indi simple" do
    given_name = "Fore Indi"
    surname = "Test"
    name = "Fore Indi /Test/"
    forename = "Fore"
    sex = "M"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
  end

  test "indi birth" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    birth_date_iso = "1971-11-19"
    birth = { :date => "19 NOV 1971",
              :place => "Place",
              :parish => "Parish" }
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :birth => birth)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    events = persons[0].related_objects[:events]
    assert events.length == 1, "Got #{events.length} events in database, expected 1."
    event_related = events[0].related_objects
    event_dates = event_related[:event_dates]
    assert event_dates.length == 1, "Got #{event_dates.length} event dates in database, expected 1."
    assert event_dates[0][:date] == birth_date_iso, "Got birth date #{event_dates[0][:date]}, expected #{birth_date_iso}."    
    event_addresses = event_related[:addresses]
    assert event_addresses.length == 1, "Got #{event_addresses.length} event dates in database, expected 1."
    assert event_addresses[0][:street] == birth[:place], "Got birth place #{event_addresses[0][:street]}, expected #{birth[:place]}."    
    assert event_addresses[0][:parish] == birth[:parish], "Got birth parish #{event_addresses[0][:parish]}, expected #{birth[:parish]}."    
  end
  
  test "indi burial" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    burial_date_iso = "1971-11-19"
    burial = { :date => "19 NOV 1971",
               :place => "Place",
               :parish => "Parish" }
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :burial => burial)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    events = persons[0].related_objects[:events]
    assert events.length == 1, "Got #{events.length} events in database, expected 1."
    event_related = events[0].related_objects
    event_dates = event_related[:event_dates]
    assert event_dates.length == 1, "Got #{event_dates.length} event dates in database, expected 1."
    assert event_dates[0][:date] == burial_date_iso, "Got burial date #{event_dates[0][:date]}, expected #{burial_date_iso}."    
    event_addresses = event_related[:addresses]
    assert event_addresses.length == 1, "Got #{event_addresses.length} event dates in database, expected 1."
    assert event_addresses[0][:street] == burial[:place], "Got burial place #{event_addresses[0][:street]}, expected #{burial[:place]}."    
    assert event_addresses[0][:parish] == burial[:parish], "Got burial parish #{event_addresses[0][:parish]}, expected #{burial[:parish]}."    
  end
  
  test "indi christening" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    christening = { :date => "19 NOV 1971" }
    date_iso = "1971-11-19"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :christening => christening)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    events = persons[0].related_objects[:events]
    assert events.length == 1, "Got #{events.length} events in database, expected 1."
    event_dates = events[0].related_objects[:event_dates]
    assert event_dates.length == 1, "Got #{event_dates.length} event dates in database, expected 1."
    assert event_dates[0][:date] == date_iso, "Got christening date #{event_dates[0][:date]}, expected #{date_iso}."
  end

  test "indi death" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    death_date_iso = "1971-11-19"
    death = { :date   => "19 NOV 1971",
              :place  => "Place",
              :parish => "Parish",
              :cause  => "Cause" }
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :death => death)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    events = person_related[:events]
    assert events.length == 1, "Got #{events.length} events in database, expected 1."
    event_related = events[0].related_objects
    event_dates = event_related[:event_dates]
    assert event_dates.length == 1, "Got #{event_dates.length} event dates in database, expected 1."
    assert event_dates[0][:date] == death_date_iso, "Got death date #{event_dates[0][:date]}, expected #{death_date_iso}."    
    event_addresses = event_related[:addresses]
    assert event_addresses.length == 1, "Got #{event_addresses.length} event dates in database, expected 1."
    assert event_addresses[0][:street] == death[:place], "Got death place #{event_addresses[0][:street]}, expected #{death[:place]}."    
    assert event_addresses[0][:parish] == death[:parish], "Got death parish #{event_addresses[0][:parish]}, expected #{death[:parish]}."    
    event_notes = event_related[:notes]
    assert event_notes.length == 1, "Got #{event_notes.length} event notes in database, expected 1."
    assert event_notes[0][:note] == death[:cause], "Got death cause #{event_notes[0][:note]}, expected #{death[:cause]}."    
  end
  
  test "indi hdp" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    hdp = "Hdp"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :hdp => hdp)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    assert notes[0][:note] == hdp, "Got hdp #{notes[0][:note]}, expected #{hdp}."    
  end
  
  test "indi info" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    info = "Info"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :info => info)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    assert notes[0][:note] == info, "Got info #{notes[0][:note]}, expected #{info}."    
  end
  
  test "indi misc" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    misc = "Misc"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :misc => misc)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    assert notes[0][:note] == misc, "Got misc #{notes[0][:note]}, expected #{misc}."    
  end
  
  test "indi note" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    note = "Note"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :note => note)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    assert notes[0][:note] == note, "Got note #{notes[0][:note]}, expected #{note}."    
  end
  
  test "indi remark" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    remark = "Remark"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :remark => remark)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    assert notes[0][:note] == remark, "Got remark #{notes[0][:note]}, expected #{remark}."    
  end
  
  test "indi residence" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    residence = { :place  => "Place",
                  :parish => "Parish" }
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :residence => residence)

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    addresses = person_related[:addresses]
    assert addresses.length == 1, "Got #{addresses.length} addresses in database, expected 1."
    assert addresses[0][:street] == residence[:place], "Got residence place #{addresses[0][:street]}, expected #{residence[:place]}."    
    assert addresses[0][:parish] == residence[:parish], "Got residence parish #{addresses[0][:parish]}, expected #{residence[:parish]}."    
  end
  
  test "indi title" do
    name = "Fore Indi /Test/"
    given_name = "Fore Indi"
    surname = "Test"
    forename = "Fore"
    sex = "M"
    title = "Title"
    
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_indi_with_headers(:name => name,
                                         :given_name => given_name,
                                         :surname => surname,
                                         :forename => forename,
                                         :sex => sex,
                                         :title => title)
      # puts file_data
      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => surname,
                               :given_name => given_name,
                               :calling_name => forename).collect{|pn| pn.person}.select{|p| p.sex == sex}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    
    person_related = persons[0].related_objects
    notes = person_related[:notes]
    assert notes.length == 1, "Got #{notes.length} notes in database, expected 1."
    actual = notes[0][:note]
    assert actual == title, "Got title #{actual}, expected #{title}. Full note: #{notes[0].inspect}."    
  end
  
  test "fam simple" do
    family = { :id => '@F1001@',
               :wife => { :id => '@I0001@',
                          :name => 'Wife /Test/',
                          :given_name => 'Wife',
                          :surname => 'Test',
                          :sex => 'F' },
               :husband => { :id => '@I0002@',
                             :name => 'Husband /Test/',
                             :given_name => 'Husband',
                             :surname => 'Test',
                             :sex => 'M'},
               :children => [{ :id => '@I0003@',
                               :name => 'Child /Test/',
                               :given_name => 'Child',
                               :surname => 'Test',
                               :sex => 'M' }]}
    transfer_obj = Transfer.new()
    transfer_obj.content_type = "application/x-gedcom"
    transfer_obj.file_name = "gedcom_indi.ged"
    saved = transfer_obj.save
    if saved
      Dir.mkdir(transfer_obj.path)
      file_data = make_fam_with_headers(:families => [family])

      # write the file
      File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
    else
      Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
    end

    get :new, transfer_id: transfer_obj.id
    assert_response :success
    
    persons = PersonName.where(:surname => family[:wife][:surname],
                               :given_name => family[:wife][:given_name]).collect{|pn| pn.person}.select{|p| p.sex == family[:wife][:sex]}
    assert persons.length == 1, "Got #{persons.length} person in database, expected 1."

    person_related = persons[0].related_objects
    relationships = person_related[:relationships]
    assert relationships.length == 1, "Got #{relationships.length} relationships in database, expected 1."
#    puts persons[0].children.inspect
#    assert notes[0][:note] == title, "Got title #{notes[0][:note]}, expected #{title}."    
  end
  
  test "full holger gedcom" do
    if false
      given_name = "Indi"
      surname = "Test"
      sex = "M"
      
      transfer_obj = Transfer.new()
      transfer_obj.content_type = "application/x-gedcom"
      transfer_obj.file_name = "gedcom_indi.ged"
      saved = transfer_obj.save
      if saved
        Dir.mkdir(transfer_obj.path)
        infile = File.new("/home/cg/documents/Genealogi/Christer/Holger/GAGJO/gagjo.ged", "r")
        file_data = infile.read()
  
        # write the file
        File.open(transfer_obj.full_file_name, "wb") { |f| f.write(file_data) }
      else
        Rails::logger.error("ERROR: Transfer object could not be saved: #{transfer_obj}")
      end
  
      get :new, transfer_id: transfer_obj.id
      assert_response :success
      
      persons = Person.where(:surname => surname,
                             :given_name => given_name,
                             :sex => sex)
      assert persons.length == 1, "Got #{persons.length} person in database, expected 1."
    end
  end

  def setup
    FileUtils.rm_rf(Biografia::Application.config.transfer_path)
    Dir.mkdir(Biografia::Application.config.transfer_path)
  end
  
  def teardown
    FileUtils.rm_rf(Biografia::Application.config.transfer_path)
  end
  
  private
  
  def make_head
    head =  GedLine.new("HEAD",
                        children: [GedLine.new("SOUR",
                                               extra: "Gramps",
                                               children: [GedLine.new("VERS", extra: "3.4.6-1"),
                                                          GedLine.new("NAME", extra: "Gramps")]),
                                   GedLine.new("DATE",
                                               extra: "2 FEB 2014",
                                               children: [GedLine.new("TIME", extra: "20:15:15")]),
                                   GedLine.new("SUBM", extra: "@SUBM@"),
                                   GedLine.new("FILE", extra: "/home/cg/Untitled_1.ged"),
                                   GedLine.new("COPR", extra: "Copyright (c) 2014 ."),
                                   GedLine.new("GEDC",
                                               children: [GedLine.new("VERS", extra: "5.5"),
                                                          GedLine.new("FORM", extra: "LINEAGE-LINKED")]),
                                   GedLine.new("CHAR", extra: "UTF-8"),
                                   GedLine.new("LANG", extra: "Swedish")])
    return head
  end

  def make_subm
      subm = GedLine.new("SUBM",
                       id: "@SUBM@",
                       children: [GedLine.new("NAME"),
                                  GedLine.new("ADDR")])
      return subm  
  end

  def make_event_or_address(tag, options, extra = nil)
      children = []
      if !options[:date].nil?
        children.append(GedLine.new("DATE", extra: options[:date]))
      end
      if ! options[:place].nil?
        children.append(GedLine.new("PLAC", extra: options[:place]))
      end
      if ! options[:parish].nil?
        children.append(GedLine.new("PARI", extra: options[:parish]))
      end
      if ! options[:cause].nil?
        children.append(GedLine.new("CAUS", extra: options[:cause]))
      end
      return GedLine.new(tag, extra: extra, children: children)    
  end
    
  def make_indi(options={})
    defaults = { :id => "@I0000@",
                 :name => "Given Name /Surname/",
                 :sex => "F" }
    options = defaults.merge(options)

    name_children = []
    if !options[:given_name].nil?
      name_children.append(GedLine.new("GIVN", extra: options[:given_name]))
    end          
    if !options[:surname].nil?
      name_children.append(GedLine.new("SURN", extra: options[:surname]))
    end    
    if !options[:forename].nil?
      name_children.append(GedLine.new("FORE", extra: options[:forename]))
    end
    
    indi_children = []
    indi_children.append(GedLine.new("NAME",
                                     extra: "#{options[:name]}",
                                     children: name_children))
    indi_children.append(GedLine.new("SEX", extra: options[:sex]))

    if !options[:birth].nil?
      indi_children.append(make_event_or_address('BIRT', options[:birth]))
    end

    if !options[:burial].nil?
      indi_children.append(make_event_or_address('BURI', options[:burial]))
    end

    if !options[:christening].nil?
      indi_children.append(make_event_or_address('CHR', options[:christening], 'Y'))
    end
    
    if !options[:death].nil?
      indi_children.append(make_event_or_address('DEAT', options[:death]))
    end

    if !options[:famc].nil?
      indi_children.append(GedLine.new("FAMC", extra: options[:famc]))      
    end
    
    if !options[:fams].nil?
      indi_children.append(GedLine.new("FAMS", extra: options[:fams]))      
    end
    
    if !options[:hdp].nil?
      indi_children.append(GedLine.new("_HDP", extra: options[:hdp]))      
    end
    
    if !options[:info].nil?
      indi_children.append(GedLine.new("INFO", extra: options[:info]))      
    end
    
    if !options[:misc].nil?
      indi_children.append(GedLine.new("MISC", extra: options[:misc]))      
    end
    
    if !options[:note].nil?
      indi_children.append(GedLine.new("NOTE", extra: options[:note]))      
    end
    
    if !options[:remark].nil?
      indi_children.append(GedLine.new("REMA", extra: options[:remark]))      
    end
    
    if !options[:residence].nil?
      indi_children.append(make_event_or_address('RESI', options[:residence]))
    end

    if !options[:title].nil?
      indi_children.append(GedLine.new("TITL", extra: options[:title]))      
    end
    
    indi_children.append(GedLine.new("CHAN",
                                     children: [GedLine.new("DATE",
                                                            extra: "2 FEB 2014",
                                                            children: [GedLine.new("TIME", extra: "20:13:51")])]))
    indi = GedLine.new("INDI",
                        id: options[:id],
                        children: indi_children)
    return indi
  end
  
  def make_trlr
    trlr = GedLine.new("TRLR")
  end

  def make_indi_with_headers(options = {})
    defaults = { }
    options = defaults.merge(options)

    file = GedFile.new([make_head,
                        make_subm,
                        make_indi(options),
                        make_trlr
                        ])
    return file.to_s
  end
  
  def make_fam(options = {})
    defaults = { }
    options = defaults.merge(options)
    
    fam_sub = []
    if !options[:wife].nil?
      fam_sub.append(GedLine.new("WIFE", extra: options[:wife]))
    end

    if !options[:husband].nil?
      fam_sub.append(GedLine.new("HUSB", extra: options[:husband]))
    end
    
    if !options[:children].nil?
      options[:children].each do |child|
        fam_sub.append(GedLine.new("CHIL", extra: child))        
      end
    end

    fam = GedLine.new("FAM",
                      id: options[:id],
                      children: fam_sub)
    return fam
  end

  def make_fam_with_headers(options = {})
    defaults = {}
    options = defaults.merge(options)

    elements = [make_head, make_subm]
    if !options[:families].nil?
      options[:families].each do |family|
        if family[:id].nil?
          Rails::logger.error("ERROR: Family must have an id: #{family.inspect}")
          raise StandardError
        end
        
        fam_opts = {}
        if !family[:wife].nil?
          opts = family[:wife].merge(:fams => family[:id])
          elements.append(make_indi(opts))
          fam_opts[:wife] = opts[:id]
        end
        if !family[:husband].nil?
          opts = family[:husband].merge(:fams => family[:id])
          elements.append(make_indi(opts))
          fam_opts[:husband] = opts[:id]
        end
        if !family[:children].nil?
          children = []
          fam_opts[:children] = []
          family[:children].each do |child|
            opts = child.merge(:famc => family[:id])
            elements.append(make_indi(opts))
            fam_opts[:children].append(opts[:id])
          end
        end
        elements.append(make_fam(fam_opts))
      end
    else
      Rails::logger.error("ERROR: families can't be nil")
      raise StandardError
    end
    elements.append(make_trlr)
    file = GedFile.new(elements)
                        
    return file.to_s
  end
  
  # FIXME: Test NAME with no surname
  
  # FIXME: Test different encodings
end
