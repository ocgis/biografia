# frozen_string_literal: true

# Implementation of class XmlFile
class XmlFile
  ACCOMMODATION_ROLE = 'Accommodation'
  ADDRESS_ROLE = 'Address'
  DATE_ROLE = 'Date'

  RELATIONSHIP_NAMES = {
    '1' => 'Äktenskap',
    '2' => 'Samvetsäktenskap',
    '3' => 'Sambo',
    '4' => 'Relation',
    '5' => 'Förlovad',
    '6' => 'Trolovad',
    '7' => 'Partner',
    '8' => 'Särbo'
  }.freeze

  RELATIONSHIP_ROLES = {
    '1' => 'Marriage',
    '2' => 'Common-law marriage',
    '3' => 'Cohabitation',
    '4' => 'Relationship',
    '5' => 'Engagement',
    '6' => 'Espousalment',
    '7' => 'Partnership',
    '8' => 'Live-apart'
  }.freeze

  KON2SEX = {
    'm' => 'M',
    'M' => 'M',
    'k' => 'F',
    'K' => 'F',
    'o' => 'U',
    'O' => 'U'
  }.freeze

  SEX2KON = {
    'M' => 'm',
    'F' => 'k',
    'U' => 'o'
  }.freeze

  def initialize(options = {})
    defaults = {
      status_object: nil
    }
    options = defaults.merge(options)

    @maxloops = 20_000
    @families = []
    @person_attributes = {}
    @status_object = options[:status_object]
  end

  def set_status(status)
    if !@status_object.nil?
      @status_object.set_status(status)
    else
      puts("xml_file.rb: Status set to: #{status}")
    end
  end

  def import(file, options = {})
    set_status("Importing XML file #{file}")

    defaults = { source: nil }
    options = defaults.merge(options)

    @source = options[:source]

    f = File.open(file)
    doc = Nokogiri::XML(f, nil, 'UTF-8')

    rows = doc.xpath('dump/row')

    if rows.length.positive?
      if handle_persons(rows)
        # Do nothing
      elsif handle_marriages(rows)
        # Do nothing
      elsif handle_remarks(rows)
        # Do nothing
      else
        raise StandardError, "Couldn't handle #{parse_row(rows[0])}"
      end
    end

    f.close

    set_status("Done importing XML file #{file}")
  end

  def parse_row(row)
    v = {}
    row.children.each do |c|
      if c.element?
        # puts "- #{c.name} #{c['name']}"
        if c.children.size == 1
          raise StandardError, "Unexpected child element type #{c.children[0].inspect}" unless c.children[0].text?

          case c.name
          when 'number'
            v[c['name']] = c.children[0].to_s.to_i
          when 'alpha'
            v[c['name']] = CGI.unescapeHTML(c.children[0].to_s)
          when 'timestamp'
            v[c['name']] = DateTime.parse(c.children[0].to_s)
          when 'memoblob'
            v[c['name']] = CGI.unescapeHTML(c.children[0].to_s)
          else
            raise StandardError, "Unknown data type #{c.name}"
          end
        elsif c.children.empty?
          v[c['name']] = nil
        else
          raise StandardError, "Unexpected children: #{c.children.inspect}"
        end
      elsif c.text?
        # Ignore
      else
        raise StandardError, "Found unexpected content #{c.inspect}"
      end
    end

    v.each do |k, val|
      Rails.logger.error("-- #{k}: #{val}")
    end

    v
  end

  def check_person_params(record)
    req_keys = [
      'p',         # make_person, get_family
      'f',         # get_family
      'm',         # get_family
      'fornamn',   # make_person
      'patronym',  # check_person_params
      'efternamn', # make_person
      'kon',       # make_person
      'fodat',     # make_birth
      'dopdat',    # make_christening
      'fodort',    # make_birth
      'fodfs',     # make_birth
      'dodat',     # make_death
      'begdat',    # make_funeral
      'dodort',    # make_death
      'dodfs',     # make_death
      'dodors',    # make_death
      'yrke',      # handle_person
      'hemort',    # handle_person
      'hemfs',     # handle_person
      'anm1',      # handle_person
      'anm2',      # handle_person
      'ttnamn',    # make_person
      'eenamn',    # check_person_params
      'dopkod',    # check_person_params
      'begkod',    # check_person_params
      'konkod',    # check_person_params
      'markering', # check_person_params
      'sortfalt',  # Ignored
      'regtid',    # make_person, make_birth
      'upptid',    # make_person, make_birth
      'dbid',      # check_person_params
      'regid',     # check_person_params
      'uppid',     # check_person_params
      'typ',       # check_person_params
      'status'     # check_person_params
    ]

    return false unless req_keys.all? { |s| record.key? s }

    expected_values = {
      'patronym' => nil,
      'eenamn' => '0',
      'dopkod' => nil,
      'begkod' => nil,
      'konkod' => nil,
      'markering' => 'A0000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'dbid' => 0,
      'regid' => 0,
      'uppid' => 0,
      'typ' => 'P',
      'status' => nil
    }
    expected_values.each do |key, value|
      raise StandardError, "#{key} != #{value}: #{record[key]}" if record[key] != value
    end
    true
  end

  def make_calling_name(record)
    ttnamn = record['ttnamn']
    cn_end = ttnamn[0].ord - '0'.ord

    if cn_end.zero?
      nil
    # raise StandardError, "FIXME: Check if calling name correct: #{calling_name}"
    else
      record['fornamn'][0..cn_end - 1].rstrip.split(' ')[-1]
    end
  end

  def find_by_source(model, source)
    objects = model.where(source: source)
    case objects.length
    when 1
      objects[0]
    when 0
      nil
    else
      raise StandardError, "Multiple #{model.controller} with same source: #{persons.inspect}"
    end
  end

  def find_by_source_or_new(model, source, new_attributes = {})
    object = find_by_source(model, source)
    if object.nil?
      object = model.new(new_attributes)
      object[:source] = source
    end
    object
  end

  def person_source(person_id, options = {})
    source = "#{@source} P#{person_id}"
    source += " #{options[:field]}" unless options[:field].nil?
    source
  end

  def remark_source(person_id, remark_id, options = {})
    source = "#{@source} P#{person_id} R#{remark_id}"
    source += " #{options[:field]}" unless options[:field].nil?
    source
  end

  def marriage_source(marriage_id, options = {})
    source = "#{@source} V#{marriage_id}"
    source += " #{options[:field]}" unless options[:field].nil?
    source
  end

  def make_person(record)
    person = find_by_source_or_new(Person, person_source(record['p']), { id: record['p'].to_i }) # Try to keep the id
    surnames =
      if record['efternamn'].nil?
        [nil]
      else
        record['efternamn'].split(' f.', -1).collect do |e|
          if empty?(e)
            nil
          else
            e.lstrip
          end
        end
      end

    while surnames.length > person.person_names.length
      person.person_names << PersonName.new(created_at: record['regtid'],
                                            updated_at: record['upptid'])
    end
    person.person_names.last.destroy while surnames.length < person.person_names.length

    i = 0
    surnames.reverse_each do |surname|
      person_name = person.person_names[i]
      person_name.given_name = record['fornamn'] unless empty?(record['fornamn'])
      person_name.surname = surname
      person_name.calling_name = make_calling_name(record)
      if person_name.changed?
        person_name.created_at = record['regtid']
        person_name.updated_at = record['upptid']
      end
      i += 1
    end
    person.sex = KON2SEX[record['kon']]
    if person.changed?
      person.created_at = record['regtid']
      person.updated_at = record['upptid']

      # puts person.inspect

      unless person.save
        Rails.logger.error("ERROR: Person could not be saved: #{person.inspect}")
        raise StandardError
      end
    end

    @person_attributes[record['p']] = { 'regtid' => record['regtid'], 'upptid' => record['upptid'] }

    person
  end

  def extend_address(address, field, value, source)
    address = find_by_source_or_new(Address, source) if address.nil?
    address[field] = value
    address
  end

  def make_address(record, street, parish, source)
    address = extend_address(nil, 'parish', record[parish], source) unless empty?(record[parish])
    address = extend_address(address, 'street', record[street], source) unless empty?(record[street])
    if !address.nil? && address.changed?
      address.created_at = record['regtid']
      address.updated_at = record['upptid']
      unless address.save
        Rails.logger.error("ERROR: Address could not be saved: #{address.inspect}")
        raise StandardError
      end
    end
    address
  end

  def make_event_date(record, date, source)
    if empty?(record[date])
      event_date = find_by_source(EventDate, source)
      if !event_date.nil?
        event_date.destroy_with_references
      else
        event_date = find_by_source(Note, source)
        event_date&.destroy_with_references
      end
      event_date = nil
    else
      event_date = find_by_source_or_new(EventDate, source)
      begin
        event_date.set_date(record[date].gsub('.', '-')) # Handle dates written 2014.11.29 as well as ISO
        if event_date.changed?
          event_date.created_at = record['regtid']
          event_date.updated_at = record['upptid']
        end
        note = find_by_source(Note, source)
        note&.destroy_with_references
      rescue StandardError
        Rails.logger.error("ERROR: Could not set date [#{record[date]}]. Making note instead.")
        event_date.destroy_with_references
        event_date = make_note(record, nil, date, source)
      end

      unless event_date.save
        Rails.logger.error("ERROR: EventDate could not be saved: #{event_date.inspect}")
        raise StandardError
      end
    end
    event_date
  end

  def make_note(record, title, notefield, source)
    if !empty?(record[notefield])
      note = find_by_source_or_new(Note, source)
      note[:title] = title
      note[:note] = record[notefield]
      if note.changed?
        note.created_at = record['regtid']
        note.updated_at = record['upptid']
        unless note.save
          Rails.logger.error("ERROR: Note could not be saved: #{note.inspect}")
          raise StandardError
        end
      end
    else
      note = find_by_source(Note, source)
      unless note.nil?
        note.destroy_with_references
        note = nil
      end
    end
    note
  end

  def make_event(record, source, attributes, children)
    if children.any? { |_role, child| !child.nil? }
      object = find_by_source_or_new(Event, source)
      attributes.each do |key, val|
        object[key] = val
      end
      if object.changed?
        object.created_at = record['regtid']
        object.updated_at = record['upptid']
        raise StandardError, "Could not save #{model}: #{object}" unless object.save
      end
      children.each do |role, child|
        # puts "Role: #{role} Child: #{child.inspect}"
        object.get_or_add_reference(child, role: role, ts_by_objects: true) unless child.nil?
      end
    else
      object = find_by_source(Event, source)
      unless object.nil?
        object.destroy_with_references
        object = nil
      end
    end
    object
  end

  def make_birth(record)
    make_event(record, person_source(record['p'], field: 'fod'),
               { name: 'Födelse' },
               { ADDRESS_ROLE => make_address(record, 'fodort', 'fodfs', person_source(record['p'], field: 'fod')),
                 DATE_ROLE => make_event_date(record, 'fodat', person_source(record['p'], field: 'fodat')) })
  end

  def make_christening(record)
    make_event(record, person_source(record['p'], field: 'dop'),
               { name: 'Dop' },
               { DATE_ROLE => make_event_date(record, 'dopdat', person_source(record['p'], field: 'dopdat')) })
  end

  def make_death(record)
    make_event(record, person_source(record['p'], field: 'dod'),
               { name: 'Död' },
               { ADDRESS_ROLE => make_address(record, 'dodort', 'dodfs', person_source(record['p'], field: 'dod')),
                 DATE_ROLE => make_event_date(record, 'dodat', person_source(record['p'], field: 'dodat')),
                 'Cause' => make_note(record, 'Orsak', 'dodors', person_source(record['p'], field: 'dodors')) })
  end

  def make_accommodation(record)
    make_event(record, person_source(record['p'], field: 'hem'),
               { name: 'Boende' },
               { ADDRESS_ROLE => make_address(record, 'hemort', 'hemfs', person_source(record['p'], field: 'hem')) })
  end

  def make_funeral(record)
    make_event(record, person_source(record['p'], field: 'beg'),
               { name: 'Begravning' },
               { DATE_ROLE => make_event_date(record, 'begdat', person_source(record['p'], field: 'begdat')) })
  end

  def handle_person(record)
    if check_person_params(record)
      person = make_person(record)
      birth = make_birth(record)
      person.get_or_add_reference(birth, role: 'Born', ts_by_objects: true) unless birth.nil?
      christening = make_christening(record)
      person.get_or_add_reference(christening, role: 'Christened', ts_by_objects: true) unless christening.nil?
      death = make_death(record)
      person.get_or_add_reference(death, role: 'Died', ts_by_objects: true) unless death.nil?
      funeral = make_funeral(record)
      person.get_or_add_reference(funeral, role: 'Burried', ts_by_objects: true) unless funeral.nil?
      accommodation = make_accommodation(record)
      unless accommodation.nil?
        person.get_or_add_reference(accommodation, role: ACCOMMODATION_ROLE, ts_by_objects: true)
      end
      title = make_note(record, 'Yrke', 'yrke', person_source(record['p'], field: 'yrke'))
      person.get_or_add_reference(title, role: 'Profession', ts_by_objects: true) unless title.nil?
      anm1 = make_note(record, nil, 'anm1', person_source(record['p'], field: 'anm1'))
      person.get_or_add_reference(anm1, role: 'Holger:Anm1', ts_by_objects: true) unless anm1.nil?
      anm2 = make_note(record, nil, 'anm2', person_source(record['p'], field: 'anm2'))
      person.get_or_add_reference(anm2, role: 'Holger:Anm2', ts_by_objects: true) unless anm2.nil?
      return true
    end
    false
  end

  def handle_persons(rows)
    raise StandardError, 'handle_persons called with no rows!' unless rows.length.positive?

    if check_person_params(parse_row(rows[0]))
      i = 0
      rows.each do |row|
        record = parse_row(row)

        raise StandardError, "handle_person could not handle #{record}" unless handle_person(record)

        family = get_family(record)
        @families.append(family) unless family.nil?

        i += 1
        if i >= @maxloops
          break # FIXME: Remove
        end
      end

      return true
    end
    false
  end

  def get_family(record)
    family = nil
    unless record['f'].nil? && record['m'].nil?
      family = { child: record['p'] }
      family[:father] = record['f'] unless record['f'].nil?
      family[:mother] = record['m'] unless record['m'].nil?
    end
    family
  end

  def make_family(family)
    parent_ids = []
    parent_ids.append(family[:father]) unless family[:father].nil? || family[:father].zero?
    parent_ids.append(family[:mother]) unless family[:mother].nil? || family[:mother].zero?

    return if parent_ids.empty?

    parents = parent_ids.collect { |parent_id| find_by_source(Person, person_source(parent_id)) }
    if parents.all? { |parent| !parent.nil? }
      rels = Relationship.find_by_spouses(parents)
      if rels.length == 1
        rel = rels[0]
      else
        raise StandardError, "Found #{rels.length} relationships for #{parents}, <=1 expected" unless rels.length.zero?

        # Not found: OK
        rel = Relationship.new
        ts = get_object_with_latest_timestamps(parents)
        unless ts.nil?
          rel.created_at = ts.created_at
          rel.updated_at = ts.updated_at
        end

        raise StandardError, "Could not save #{rel}" unless rel.save

        parents.each do |parent|
          parent.get_or_add_reference(rel, role: 'Spouse', ts_by_objects: true)
        end
      end

      unless family[:child].nil?
        child = find_by_source(Person, person_source(family[:child]))
        child.get_or_add_reference(rel, role: 'Child', ts_by_objects: true)
      end
    else
      Rails.logger.error("ERROR: Could not find parents in db: #{parent_ids}")
    end
  end

  def empty?(str)
    str.nil? ||
      (str == '-----') ||
      (str == '---') ||
      (str == '--') ||
      (str == '?+') ||
      (str == '+?') ||
      (str == '?') ||
      (str == '??') ||
      (str == ' ??') ||
      (str == '???') ||
      (str == '?`?')
  end

  def check_marriage_params(record)
    req_keys = ['v',         # Ignored
                'f',         # make_marriage
                'm',         # make_marriage
                'p',         # check_marriage_params
                'vigdat',    # attach_wedding
                'vigort',    # attach_wedding
                'vigfs',     # attach_wedding
                'slutdat',   # check_marriage_params
                'anm',       # attach_wedding
                'eventtyp',  # check_marriage_params
                'typ',       # attach_wedding
                'status']    # check_marriage_params

    if req_keys.all? { |s| record.key? s }
      expected_values = {
        'p' => 0,
        'slutdat' => nil,
        'eventtyp' => 0,
        'status' => nil
      }
      expected_values.each do |key, value|
        raise StandardError, "#{key} != #{value}: #{record[key]}" if record[key] != value
      end
      true
    else
      false
    end
  end

  def handle_marriages(rows)
    raise StandardError, 'handle_marriages called with no rows!' if rows.empty?

    if check_marriage_params(parse_row(rows[0]))
      i = 0
      rows.each do |row|
        record = parse_row(row)

        raise StandardError, "handle_person could not handle #{row}" unless handle_marriage(record)

        i += 1
        if i >= @maxloops
          break # FIXME: Remove
        end
      end

      @families.each do |family|
        make_family(family)
      end

      return true
    end
    false
  end

  def handle_marriage(record)
    if check_marriage_params(record)
      make_marriage(record)

      return true
    end
    false
  end

  def make_marriage(record)
    spouse_ids = [record['f'], record['m']]
    spouses = spouse_ids.collect { |spouse_id| find_by_source(Person, person_source(spouse_id)) }
    if spouses.all? { |spouse| !spouse.nil? }
      rels = Relationship.find_by_spouses(spouses)
      if rels.length == 1
        rel = rels[0]
      elsif rels.length.zero?
      # Not found: OK
      else
        raise StandardError, "Found #{rels.length} relationships for #{parents}, <=1 expected"
      end
    else
      Rails.logger.error("ERROR: Could not find spouses in db: #{spouse_ids}")
      spouses = []
    end

    if rel.nil? && spouses.length.positive?
      rel = Relationship.new(id: record['v'].to_i) # Try to keep the id
      ts = get_object_with_latest_timestamps(spouses)
      unless ts.nil?
        rel.created_at = ts.created_at
        rel.updated_at = ts.updated_at
      end

      raise StandardError, "Could not save #{rel}" unless rel.save

      spouses.each do |spouse|
        spouse.get_or_add_reference(rel, role: 'Spouse', ts_by_objects: true)
      end
    end

    unless rel.nil?
      record['regtid'] = rel.created_at
      record['upptid'] = rel.updated_at
      attach_wedding(record, rel)
    end

    rel
  end

  def attach_wedding(record, relationship)
    address = make_address(record, 'vigort', 'vigfs', marriage_source(record['v'], field: 'vig'))
    event_date = make_event_date(record, 'vigdat', marriage_source(record['v'], field: 'vigdat'))
    note = make_note(record, nil, 'anm', marriage_source(record['v'], field: 'anm'))
    begin
      name = RELATIONSHIP_NAMES[record['typ']]
      role = RELATIONSHIP_ROLES[record['typ']]
    rescue
      raise StandardError, "ERROR: Unknown relationship type: #{record}"
    end
    wedding = find_by_source_or_new(Event, marriage_source(record['v']))
    wedding[:name] = name
    if wedding.changed?
      wedding.created_at = record['regtid']
      wedding.updated_at = record['upptid']

      raise StandardError, "Could not save wedding: #{wedding.inspect}" unless wedding.save
    end
    wedding.get_or_add_reference(address, role: ADDRESS_ROLE, ts_by_objects: true) unless address.nil?
    wedding.get_or_add_reference(event_date, role: DATE_ROLE, ts_by_objects: true) unless event_date.nil?
    wedding.get_or_add_reference(note, ts_by_objects: true) unless note.nil?

    relationship.get_or_add_reference(wedding, role: role, ts_by_objects: true)
  end

  def check_remark_params(record)
    req_keys = [
      'p',         # handle_remark
      'fktabell',  # check_remark_params
      'r',         # Ignored
      'anmtext',   # handle_remark
      'typ',       # check_remark_params
      'status'     # Ignored (Should be 'A' or nil)
    ]

    if req_keys.all? { |s| record.key? s }
      expected_values = { 'fktabell' => 'P',
                          'typ' => nil }
      expected_values.each do |key, value|
        raise StandardError, "#{key} != #{value}: #{record[key]}" if record[key] != value
      end
      true
    else
      false
    end
  end

  def handle_remarks(rows)
    raise StandardError, 'handle_remarks called with no rows!' unless rows.length.positive?

    if check_remark_params(parse_row(rows[0]))
      i = 0
      rows.each do |row|
        record = parse_row(row)

        raise StandardError, "handle_person could not handle #{row}" unless handle_remark(record)

        i += 1
        if i >= @maxloops
          break # FIXME: Remove
        end
      end

      return true
    end
    false
  end

  def handle_remark(record)
    if check_remark_params(record)
      unless @person_attributes[record['p']].nil?
        record['regtid'] = @person_attributes[record['p']]['regtid']
        record['upptid'] = @person_attributes[record['p']]['upptid']
      end
      make_remark(record)

      return true
    end
    false
  end

  def make_remark(record)
    person = find_by_source(Person, person_source(record['p']))
    if !person.nil?
      remark = make_note(record, nil, 'anmtext', remark_source(record['p'], record['r'], field: 'anmtext'))

      person.get_or_add_reference(remark, role: "Holger:Anmtext#{record['r']}", ts_by_objects: true) unless remark.nil?
    else
      Rails.logger.error("ERROR: Could not find person in db: #{record['p']}")
    end
  end

  def export(file, options = {})
    set_status("Exporting XML file #{file}")

    defaults = { type: nil }
    options = defaults.merge(options)

    File.open(file, 'w') do |fd|
      fd.puts('<dump>')
      case options[:type]
      when 'p'
        export_p(fd)
      when 'a'
        export_a(fd)
      when 'v'
        export_v(fd)
      else
        raise StandardError, "File type #{options[:type].inspect} not known"
      end
      fd.puts('</dump>')
    end

    set_status("Done exporting XML file #{file}")
  end

  def export_p(file)
    i = 1
    people = Person.all.preload(:person_names)
    people.each do |person|
      export_person(file, person, i)
      i += 1
    end
  end

  def export_a(file)
    people = Person.all.preload(:person_names)
    people.each do |person|
      export_person_remarks(file, person)
    end
  end

  def export_v(file)
    relationships = Relationship.all
    relationships.each do |relationship|
      export_relationship(file, relationship)
    end
  end

  def export_person(file, person, index)
    f = 0
    m = 0
    parents = person.find_parents
    parents.each do |parent|
      if parent.sex == 'M'
        if f.zero?
          f = parent.id
        else
          m = parent.id
        end
      elsif m.zero?
        m = parent.id
      else
        f = parent.id
      end
    end
    fornamn = get_given_name(person)
    patronym = ''
    efternamn = get_surname(person)
    kon = SEX2KON[person.sex]
    updated_at = person.updated_at
    birth_refs = person.get_references.where(name: 'Born')
    if birth_refs.length == 1
      birth = birth_refs[0].other_object(person)
      birth_dates = get_dates_of(birth)
      unless birth_dates.nil?
        fodat = dates_to_string(birth_dates)
        updated_at = ([updated_at] + birth_dates.collect(&:updated_at)).max
      end
      address = get_address_of(birth)
      unless address.nil?
        fodort = address.street
        fodfs = address.parish
        updated_at = [updated_at, address.updated_at].max
      end
      updated_at = [updated_at, birth.updated_at].max
    elsif birth_refs.length > 1
      raise StandardError, "More than one birth for person #{person.inspect}"
    end

    christening_refs = person.get_references.where(name: 'Christened')
    if christening_refs.length == 1
      christening = christening_refs[0].other_object(person)
      updated_at = [updated_at, christening.updated_at].max
      christening_dates = get_dates_of(christening)
      updated_at = ([updated_at] + christening_dates.collect(&:updated_at)).max
      dopdat = dates_to_string(christening_dates)
    elsif christening_refs.length > 1
      raise StandardError, "More than one christening for person #{person.inspect}"
    end

    death_refs = person.get_references.where(name: 'Died')
    if death_refs.length == 1
      death = death_refs[0].other_object(person)
      updated_at = [updated_at, death.updated_at].max
      death_dates = get_dates_of(death)
      unless death_dates.nil?
        updated_at = ([updated_at] + death_dates.collect(&:updated_at)).max
        dodat = dates_to_string(death_dates)
      end
      address = get_address_of(death)
      unless address.nil?
        updated_at = [updated_at, address.updated_at].max
        dodort = address.street
        dodfs = address.parish
      end
      cause = get_note_for(death, 'Cause')
      unless cause.nil?
        updated_at = [updated_at, cause.updated_at].max
        dodors = cause.note
      end
    elsif death_refs.length > 1
      raise StandardError, "More than one death for person #{person.inspect}"
    end

    burial_refs = person.get_references.where(name: 'Burried')
    if burial_refs.length == 1
      burial = burial_refs[0].other_object(person)
      updated_at = [updated_at, burial.updated_at].max
      burial_dates = get_dates_of(burial)
      updated_at = ([updated_at] + burial_dates.collect(&:updated_at)).max
      begdat = dates_to_string(burial_dates)
    elsif burial_refs.length > 1
      raise StandardError, "More than one burial for person #{person.inspect}"
    end

    profession = get_note_for(person, 'Profession')
    unless profession.nil?
      updated_at = [updated_at, profession.updated_at].max
      yrke = profession.note
    end

    accomodation_refs = person.get_references.where(name: ACCOMMODATION_ROLE)
    if accomodation_refs.length == 1
      accomodation = accomodation_refs[0].other_object(person)
      updated_at = [updated_at, accomodation.updated_at].max
      address = get_address_of(accomodation)
      unless address.nil?
        updated_at = [updated_at, address.updated_at].max
        hemort = address.street
        hemfs = address.parish
      end
    elsif accomodation_refs.length > 1
      raise StandardError, "More than one address for person #{person.inspect}"
    end

    note1 = get_note_for(person, 'Holger:Anm1')
    unless note1.nil?
      updated_at = [updated_at, note1.updated_at].max
      anm1 = note1.note
    end
    note2 = get_note_for(person, 'Holger:Anm2')
    unless note2.nil?
      updated_at = [updated_at, note2.updated_at].max
      anm2 = note2.note
    end
    ttnamn = get_calling_name_end_index(person)
    eenamn = '0'
    dopkod = ''
    begkod = ''
    konkod = ''
    markering = 'A0000000000000000000000000000000000000000000000000000000000000000000000000000000'
    sortfalt = format('%10d', index)
    regtid = person.created_at
    upptid = updated_at
    dbid = 0
    regid = 0
    uppid = 0
    typ = 'P'
    status = ''

    file.puts('  <row>')
    file.puts(make_number_tag('p', person.id))
    file.puts(make_number_tag('f', f))
    file.puts(make_number_tag('m', m))
    file.puts(make_alpha_tag('fornamn', fornamn))
    file.puts(make_alpha_tag('patronym', patronym))
    file.puts(make_alpha_tag('efternamn', efternamn))
    file.puts(make_alpha_tag('kon', kon))
    file.puts(make_alpha_tag('fodat', fodat))
    file.puts(make_alpha_tag('dopdat', dopdat))
    file.puts(make_alpha_tag('fodort', fodort))
    file.puts(make_alpha_tag('fodfs', fodfs))
    file.puts(make_alpha_tag('dodat', dodat))
    file.puts(make_alpha_tag('begdat', begdat))
    file.puts(make_alpha_tag('dodort', dodort))
    file.puts(make_alpha_tag('dodfs', dodfs))
    file.puts(make_alpha_tag('dodors', dodors))
    file.puts(make_alpha_tag('yrke', yrke))
    file.puts(make_alpha_tag('hemort', hemort))
    file.puts(make_alpha_tag('hemfs', hemfs))
    file.puts(make_alpha_tag('anm1', anm1))
    file.puts(make_alpha_tag('anm2', anm2))
    file.puts(make_alpha_tag('ttnamn', ttnamn))
    file.puts(make_alpha_tag('eenamn', eenamn))
    file.puts(make_alpha_tag('dopkod', dopkod))
    file.puts(make_alpha_tag('begkod', begkod))
    file.puts(make_alpha_tag('konkod', konkod))
    file.puts(make_alpha_tag('markering', markering))
    file.puts(make_alpha_tag('sortfalt', sortfalt))
    file.puts(make_timestamp_tag('regtid', regtid))
    file.puts(make_timestamp_tag('upptid', upptid))
    file.puts(make_number_tag('dbid', dbid))
    file.puts(make_number_tag('regid', regid))
    file.puts(make_number_tag('uppid', uppid))
    file.puts(make_alpha_tag('typ', typ))
    file.puts(make_alpha_tag('status', status))
    file.puts('  </row>')
  end

  def export_person_remarks(file, person)
    fktabell = 'P'
    typ = ''
    (1..2).each do |r|
      note = get_note_for(person, "Holger:Anmtext#{r}")
      next if note.nil?

      anmtext = note.note
      status = 'A'
      file.puts('  <row>')
      file.puts(make_number_tag('p', person.id))
      file.puts(make_alpha_tag('fktabell', fktabell))
      file.puts(make_number_tag('r', r))
      file.puts(make_memoblob_tag('anmtext', anmtext))
      file.puts(make_alpha_tag('typ', typ))
      file.puts(make_alpha_tag('status', status))
      file.puts('  </row>')
    end
  end

  def export_relationship(file, relationship)
    v = relationship.id
    spouse_references = relationship.get_references.where(name: 'Spouse')
    spouses = spouse_references.collect { |spouse_reference| spouse_reference.other_object(relationship) }

    return unless spouses.length == 2 # Ignore families with less than 2 spouses

    if spouses[0].sex == 'F'
      m = spouses[0].id
      f = spouses[1].id
    else
      f = spouses[0].id
      m = spouses[1].id
    end

    p = 0

    event = nil
    typ = '0'
    RELATIONSHIP_ROLES.each do |type, role|
      event_references = relationship.get_references.where(name: role)
      next if event_references.empty?

      event = event_references[0].other_object(relationship)
      typ = type
      break
    end
    unless event.nil?
      address = get_address_of(event)
      unless address.nil?
        vigort = address.street
        vigfs = address.parish
      end
      dates = get_dates_of(event)
      vigdat = dates_to_string(dates) unless dates.nil?
    end

    slutdat = '' # FIXME
    anm = '' # FIXME
    eventtyp = 0 # FIXME
    status = ''

    file.puts('  <row>')
    file.puts(make_number_tag('v', v))
    file.puts(make_number_tag('f', f))
    file.puts(make_number_tag('m', m))
    file.puts(make_number_tag('p', p))
    file.puts(make_alpha_tag('vigdat', vigdat))
    file.puts(make_alpha_tag('vigort', vigort))
    file.puts(make_alpha_tag('vigfs', vigfs))
    file.puts(make_alpha_tag('slutdat', slutdat))
    file.puts(make_alpha_tag('anm', anm))
    file.puts(make_number_tag('eventtyp', eventtyp))
    file.puts(make_alpha_tag('typ', typ))
    file.puts(make_alpha_tag('status', status))
    file.puts('  </row>')
  end

  def make_tag(tag_type, name, value)
    "    <#{tag_type} name=\"#{name}\">#{value}</#{tag_type}>"
  end

  def make_alpha_tag(name, value)
    value = '' if value.nil?
    make_tag('alpha', name, CGI.escapeHTML(value))
  end

  def make_memoblob_tag(name, value)
    value = '' if value.nil?
    make_tag('memoblob', name, CGI.escapeHTML(value))
  end

  def make_number_tag(name, value)
    make_tag('number', name, "#{value}.000000")
  end

  def make_timestamp_tag(name, value)
    make_tag('timestamp', name, value.strftime('%Y-%m-%d %H:%M:%S'))
  end

  def get_given_name(person)
    case person.person_names.length
    when 0
      given_name = ''
    when 1
      given_name = person.person_names.first.given_name
    else
      given_name = person.person_names.first.given_name
      unless person.person_names.all? { |person_name| person_name.given_name == given_name }
        raise StandardError, "Unhandled number of names #{person.person_names.length}"
      end
    end
    given_name
  end

  def get_surname(person)
    person.person_names.collect(&:surname).reverse.join(' f.')
  end

  def get_calling_name_end_index(person)
    return '0' if person.person_names.size.zero?

    calling_name = person.person_names.last.calling_name
    return '0' if calling_name.nil?

    first = person.person_names.last.given_name.index(calling_name)
    return '0' if first.nil?

    last = first + person.person_names.last.calling_name.length
    last += 1 if person.person_names.last.given_name[last].nil? || (person.person_names.last.given_name[last] == ' ')
    (last + '0'.ord).chr
  end

  def get_dates_of(event)
    references = event.get_references.where(name: DATE_ROLE)
    return nil unless references.length.positive?

    references.collect { |reference| reference.other_object(event) }
  end

  def dates_to_string(dates)
    date_strings = dates.collect { |date| date.decorate.one_line }
    date_strings.join(', ')
  end

  def get_address_of(event)
    references = event.get_references.where(name: ADDRESS_ROLE)
    addresses = references.collect { |reference| reference.other_object(event) }
    if addresses.length == 1
      addresses[0]
    elsif addresses.empty?
      nil
    else
      raise StandardError, "Event has more than one address: #{event.inspect} #{addresses.inspect}"
    end
  end

  def get_note_for(object, role)
    references = object.get_references.where(name: role)
    notes = references.collect { |reference| reference.other_object(object) }
    if notes.length == 1
      notes[0]
    elsif notes.empty?
      nil
    else
      raise StandardError, "Object has more than one note: #{object.inspect} #{notes.inspect}"
    end
  end

  def get_object_with_latest_timestamps(objects)
    latest = nil

    objects.each do |object|
      latest = object if latest.nil? || (latest.created_at < object.created_at)
    end

    latest
  end
end
