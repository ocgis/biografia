# -*- coding: utf-8 -*-
class XmlFile

  def initialize(file, options = {})
    defaults = { source: nil }
    options = defaults.merge(options)

    @file = file
    @source = options[:source]
    @maxloops = 20000
  end

  def import
    f = File.open(@file)
    doc = Nokogiri::XML(f, nil, 'UTF-8')

    rows = doc.xpath("dump/row")

    if rows.length > 0
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

    f.close()
  end

  def parse_row(row)
    v = {}
    row.children.each do |c|
      if c.element?
#        puts "- #{c.name} #{c['name']}"
        if c.children.size == 1
          if c.children[0].text?
            if c.name == 'number'
              v[c['name']] = c.children[0].to_s.to_i
            elsif (c.name == 'alpha')
              v[c['name']] = c.children[0].to_s
            elsif (c.name == 'timestamp')
              v[c['name']] = DateTime.parse(c.children[0].to_s)
            elsif (c.name == 'memoblob')
              v[c['name']] = c.children[0].to_s
            else
              raise StandardError, "Unknown data type #{c.name}"
            end
          else
            raise StandardError, "Unexpected child element type #{c.children[0].inspect}"
          end
        elsif c.children.size == 0
          v[c['name']] = nil
        elsif
          raise StandardError, "Unexpected children: #{c.children.inspect}"
        end
      elsif c.text?
        # Ignore
      else
        raise StandardError, "Found unexpected content #{c.inspect}"
      end
    end

    v.each do |k, val|
      Rails::logger.error("-- #{k}: #{val}")
    end

    return v
  end

  def check_person_params(v)
    req_keys = ['p',         # make_person, get_family
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

    if req_keys.all? {|s| v.key? s}
      expected_values = { 'patronym'  => nil,
                          'eenamn'    => '0',
                          'dopkod'    => nil,
                          'begkod'    => nil,
                          'konkod'    => nil,
                          'markering' => 'A0000000000000000000000000000000000000000000000000000000000000000000000000000000',
                          'dbid'      => 0,
                          'regid'     => 0,
                          'uppid'     => 0,
                          'typ'       => 'P',
                          'status'    => nil }
      expected_values.each do |key, value|
        raise StandardError, "#{key} != #{value}: #{v[key]}" if v[key] != value
      end
      return true
    else
      return false
    end
  end

  def make_calling_name(v)
    cn_end = v['ttnamn'][0].ord - '0'.ord

    if cn_end == 0
      calling_name = v['fornamn']
#      raise StandardError, "FIXME: Check if calling name correct: #{calling_name}"
    else
      calling_name = v['fornamn'][0..cn_end-1].rstrip.split(' ')[-1]
    end

#    puts "¤#{calling_name}¤"
    return calling_name
  end

  def find_by_source(model, source)
    objects = model.where(source: source)
    if objects.length == 1
      object = objects[0]
    elsif objects.length == 0
      object = nil
    else
      raise StandardError, "Multiple #{model.controller} with same source: #{persons.inspect}"
    end
    return object
  end

  def find_by_source_or_new(model, source)
    object = find_by_source(model, source)
    if object.nil?
      object = model.new
      object[:source] = source
    end
    return object
  end

  def person_source(person_id, options={})
    source = "#{@source} P#{person_id}"
    source = source + " #{options[:field]}" unless options[:field].nil?
    return source
  end

  def remark_source(person_id, remark_id, options={})
    source = "#{@source} P#{person_id} R#{remark_id}"
    source = source + " #{options[:field]}" unless options[:field].nil?
    return source
  end

  def marriage_source(marriage_id, options={})
    source = "#{@source} V#{marriage_id}"
    source = source + " #{options[:field]}" unless options[:field].nil?
    return source
  end

  def make_person(v)
    person = find_by_source_or_new(Person, person_source(v['p']))
    if v['efternamn'].nil?
      surnames = [nil]
    else
      surnames = v['efternamn'].split(" f.").collect{|e| e.lstrip}
    end
    while surnames.length > person.person_names.length
      person.person_names << PersonName.new
    end
    while surnames.length < person.person_names.length
      person.person_names.last.destroy
    end

    i = 0
    surnames.reverse_each do |surname|
      person_name = person.person_names[i]
      person_name.given_name = v['fornamn']
      person_name.surname = surname
      person_name.calling_name = make_calling_name(v)
      person_name.created_at = v['regtid']
      person_name.updated_at = v['upptid']
      person_name.save
      i = i + 1
    end
    if v['kon'] == 'm'
      person.sex = 'M'
    else
      person.sex = 'F'
    end
    if person.changed?
      person.created_at = v['regtid']
      person.updated_at = v['upptid']

#    puts person.inspect

      if !person.save
        Rails::logger.error("ERROR: Person could not be saved: #{person.inspect}")
        raise StandardError
      end
    end

    @@person_attributes[v['p']] = { 'regtid'=> v['regtid'], 'upptid' => v['upptid'] }

    return person
  end

  def extend_address(address, field, value, source)
    if address.nil?
      address = find_by_source_or_new(Address, source)
    end
    address[field] = value
    return address
  end
  
  def make_address(v, street, parish, field_base)
    source = person_source(v['p'], field: field_base)
    address = nil
    address = extend_address(nil, 'parish', v[parish], source) if not empty?(v[parish])
    address = extend_address(address, 'street', v[street], source) if not empty?(v[street])
    if not address.nil? and address.changed?
      address.created_at = v['regtid']
      address.updated_at = v['upptid']
      if !address.save
        Rails::logger.error("ERROR: Address could not be saved: #{address.inspect}")
        raise StandardError
      end
    end
    return address
  end

  def make_event_date(v, date)
    if empty?(v[date])
      event_date = find_by_source(EventDate, person_source(v['p'], field: date))
      unless event_date.nil?
        event_date.destroy_with_references
      else
        event_date = find_by_source(Note, person_source(v['p'], field: date))
        unless event_date.nil?
          event_date.destroy_with_references
        end
      end
      event_date = nil
    else
      event_date = find_by_source_or_new(EventDate, person_source(v['p'], field: date))
      begin
        event_date.set_date(v[date].gsub('.', '-')) # Handle dates written 2014.11.29 as well as ISO
        if event_date.changed?
          event_date.created_at = v['regtid']
          event_date.updated_at = v['upptid']
        end
        note = find_by_source(Note, person_source(v['p'], field: date))
        unless note.nil?
          note.destroy_with_references
        end

      rescue StandardError
        Rails::logger.error("ERROR: Could not set date [#{v[date]}]. Making note instead.")
        event_date.destroy_with_references
        event_date = make_note(v, nil, date)
      end

      if !event_date.save
        Rails::logger.error("ERROR: EventDate could not be saved: #{event_date.inspect}")
        raise StandardError
      end
    end
    return event_date
  end

  def make_note(v, title, notefield, source)
    unless empty?(v[notefield])
      note = find_by_source_or_new(Note, source)
      note[:title] = title
      note[:note] = v[notefield]
      if note.changed?
        note.created_at = v['regtid']
        note.updated_at = v['upptid']
        if !note.save
          Rails::logger.error("ERROR: Note could not be saved: #{note.inspect}")
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
    return note
  end

  def make_event(v, source, attributes, children)
    if children.any?{|role, child| not child.nil?}
      object = find_by_source_or_new(Event, source)
      attributes.each do |key,val|
        object[key] = val
      end
      if object.changed?
        object.created_at = v['regtid']
        object.updated_at = v['upptid']
        unless object.save
          raise StandardError, "Could not save #{model}: #{object}"
        end
      end
      children.each do |role, child|
        puts "Role: #{role} Child: #{child.inspect}"
        object.get_or_add_reference(child, role: role) unless child.nil?
      end
    else
      object = find_by_source(Event, source)
      unless object.nil?
        object.destroy_with_references
        object = nil
      end
    end
    return object
  end

  def make_birth(v)
    return make_event(v, person_source(v['p'], field: 'fod'),
                      { name: 'Födelse' },
                      { 'Address' => make_address(v, 'fodort', 'fodfs', 'fod'),
                        'Date'    => make_event_date(v, 'fodat') })
  end

  def make_christening(v)
    return make_event(v, person_source(v['p'], field: 'dop'),
                      { name: 'Dop' },
                      { 'Date' => make_event_date(v, 'dopdat') })
  end

  def make_death(v)
    return make_event(v, person_source(v['p'], field: 'dod'),
                      { name: 'Död' },
                      { 'Address' => make_address(v, 'dodort', 'dodfs', 'dod'),
                        'Date' => make_event_date(v, 'dodat'),
                        'Cause' => make_note(v, 'Orsak', 'dodors', person_source(v['p'], field: 'dodors')) })
  end

  def make_funeral(v)
    return make_event(v, person_source(v['p'], field: 'beg'),
                      { name: 'Begravning' },
                      { 'Date' => make_event_date(v, 'begdat') })
  end

  def handle_person(v)
    if check_person_params(v)
      person = make_person(v)
      birth = make_birth(v)
      person.get_or_add_reference(birth, role: 'Born') if not birth.nil?
      christening = make_christening(v)
      person.get_or_add_reference(christening, role: 'Christened') if not christening.nil?
      death = make_death(v)
      person.get_or_add_reference(death, role: 'Died') if not death.nil?
      funeral = make_funeral(v)
      person.get_or_add_reference(funeral, role: 'Burried') if not funeral.nil?
      address = make_address(v, 'hemort', 'hemfs', 'hem')
      person.get_or_add_reference(address, role: 'Address') if not address.nil?
      title = make_note(v, 'Titel', 'yrke', person_source(v['p'], field: 'yrke'))
      person.get_or_add_reference(title, role: 'Profession') if not title.nil?
      anm1 = make_note(v, 'Anmärkning 1', 'anm1', person_source(v['p'], field: 'anm1'))
      person.get_or_add_reference(anm1, role: 'Holger:Anm1') if not anm1.nil?
      anm2 = make_note(v, 'Anmärkning 2', 'anm2', person_source(v['p'], field: 'anm2'))
      person.get_or_add_reference(anm2, role: 'Holger:Anm2') if not anm2.nil?
      return true
    end
    return false
  end

  def handle_persons(rows)
    if rows.length > 0
      if check_person_params(parse_row(rows[0]))
        @@person_attributes = {}
        families = []
        i = 0
        rows.each do |row|
          v = parse_row(row)
          if not handle_person(v)
            raise StandardError, "handle_person could not handle #{v}"
          end
          family = get_family(v)
          families.append(family) if not family.nil?

          i = i + 1
          if i >= @maxloops
            break # FIXME: Remove
          end
        end

        families.each do |family|
          make_family(family)
        end

        return true
      end
    else
      raise StandardError, "handle_persons called with no rows!"
    end
    return false
  end

  def get_family(v)
    family = nil
    unless (v['f'].nil? and v['m'].nil?)
      family = { :child => v['p'] }
      family[:father] = v['f'] unless v['f'].nil?
      family[:mother] = v['m'] unless v['m'].nil?
    end
    return family
  end

  def make_family(family)
    parent_ids = []
    parent_ids.append(family[:father]) unless family[:father].nil? or (family[:father] == 0)
    parent_ids.append(family[:mother]) unless family[:mother].nil? or (family[:mother] == 0)

    if parent_ids.length > 0
      parents = parent_ids.collect{|parent_id| find_by_source(Person, person_source(parent_id))}
      if parents.all?{|parent| not parent.nil?}
        rels = Relationship.find_by_spouses(parents)
        if rels.length == 1
          rel = rels[0]
        else
          if rels.length == 0
            # Not found: OK
            rel = Relationship.create_save()
          
            for parent in parents
              parent.get_or_add_reference(rel, role: 'Spouse')
            end
          else
            raise StandardError, "Found #{rels.length} relationships for #{parents}, <=1 expected"
          end
        end

        if not family[:child].nil?
          child = find_by_source(Person, person_source(family[:child]))
          child.get_or_add_reference(rel, role: 'Child')
        end
      else
        Rails::logger.error("ERROR: Could not find parents in db: #{parent_ids}")
      end
    end
  end

  def empty?(str)
    return str.nil? ||
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

  def check_marriage_params(v)
    req_keys = ['v',         # Ignored
                'f',         # make_marriage
                'm',         # make_marriage
                'p',         # check_marriage_params
                'vigdat',    # make_wedding
                'vigort',    # make_wedding
                'vigfs',     # make_wedding
                'slutdat',   # check_marriage_params
                'anm',       # make_wedding
                'eventtyp',  # check_marriage_params
                'typ',       # make_wedding
                'status'     # check_marriage_params
               ]

    if req_keys.all? {|s| v.key? s}
      expected_values = { 'p'         => 0,
                          'slutdat'   => nil,
                          'eventtyp'  => 0,
                          'status'    => nil }
      expected_values.each do |key, value|
        raise StandardError, "#{key} != #{value}: #{v[key]}" if v[key] != value
      end
      return true
    else
      return false
    end
  end

  def handle_marriages(rows)
    if rows.length > 0
      if check_marriage_params(parse_row(rows[0]))
        i = 0
        rows.each do |row|
          v = parse_row(row)
          if not handle_marriage(v)
            raise StandardError, "handle_person could not handle #{row}"
          end

          i = i + 1
          if i >= @maxloops
            break # FIXME: Remove
          end
        end

        return true
      end
    else
      raise StandardError, "handle_marriages called with no rows!"
    end
    return false
  end

  def handle_marriage(v)
    if check_marriage_params(v)
      make_marriage(v)

      return true
    end
    return false
  end

  def make_marriage(v)
    spouse_ids = [v['f'], v['m']]
    spouses = spouse_ids.collect{|spouse_id| find_by_source(Person, person_source(spouse_id))}
    if spouses.all?{|spouse| not spouse.nil?}
      rels = Relationship.find_by_spouses(spouses)
      if rels.length == 1
        rel = rels[0]
      else
        if rels.length == 0
          # Not found: OK
        else
          raise StandardError, "Found #{rels.length} relationships for #{parents}, <=1 expected"
        end
      end
    else
      Rails::logger.error("ERROR: Could not find spouses in db: #{spouse_ids}")
      spouses = []
    end

    if rel.nil? and spouses.length > 0
      rel = Relationship.create_save()

      for spouse in spouses
        spouse.get_or_add_reference(rel, role: 'Spouse')
      end
    end

    if not rel.nil?
      wedding = make_wedding(v)
      rel.get_or_add_reference(wedding)
    end

    return rel
  end

  def make_wedding(v)
    address = make_address(v, 'vigort', 'vigfs', 'vig')
    event_date = make_event_date(v, 'vigdat')
    note = make_note(v, 'Anmärkning', 'anm', marriage_source(v['v'], field: 'anm'))
    if v['typ'] == '1'
      name = "Äktenskap"
    elsif v['typ'] == '2'
      name = "Samvetsäktenskap"
    elsif v['typ'] == '3'
      name = "Sambo"
    elsif v['typ'] == '4'
      name = "Relation"
    elsif v['typ'] == '5'
      name = "Förlovad"
    elsif v['typ'] == '6'
      name = "Trolovad"
    elsif v['typ'] == '7'
      name = "Partner"
    elsif v['typ'] == '8'
      name = "Särbo"
    else
      name = "Typ #{v['typ']}"
      Rails::logger.error("ERROR: Unknown relationship type: #{v}")
    end
    wedding = find_by_source_or_new(Event, marriage_source(v['v']))
    wedding[:name] = name
    unless wedding.save
      raise StandardError, "Could not save wedding: #{wedding.inspect}"
    end
    wedding.get_or_add_reference(address) if not address.nil?
    wedding.get_or_add_reference(event_date) if not event_date.nil?
    wedding.get_or_add_reference(note) if not note.nil?
    return wedding
  end

  def check_remark_params(v)
    req_keys = ['p',         # handle_remark
                'fktabell',  # check_remark_params
                'r',         # Ignored
                'anmtext',   # handle_remark
                'typ',       # check_remark_params
                'status'     # Ignored (Should be 'A' or nil)
               ]

    if req_keys.all? {|s| v.key? s}
      expected_values = { 'fktabell'  => 'P',
                          'typ'       => nil }
      expected_values.each do |key, value|
        raise StandardError, "#{key} != #{value}: #{v[key]}" if v[key] != value
      end
      return true
    else
      return false
    end
  end

  def handle_remarks(rows)
    if rows.length > 0
      if check_remark_params(parse_row(rows[0]))
        i = 0
        rows.each do |row|
          v = parse_row(row)
          if not handle_remark(v)
            raise StandardError, "handle_person could not handle #{row}"
          end

          i = i + 1
          if i >= @maxloops
            break # FIXME: Remove
          end
        end

        return true
      end
    else
      raise StandardError, "handle_remarks called with no rows!"
    end
    return false
  end

  def handle_remark(v)
    if check_remark_params(v)
      v['regtid'] = @@person_attributes[v['p']]['regtid']
      v['upptid'] = @@person_attributes[v['p']]['upptid']
      make_remark(v)

      return true
    end
    return false
  end

  def make_remark(v)
    person = find_by_source(Person, person_source(v['p']))
    unless person.nil?
      remark = make_note(v, "Anmärkning #{v['r']}", 'anmtext', remark_source(v['p'], v['r'], field: 'anmtext'))
      if not remark.nil?
        person.get_or_add_reference(remark, role: "Holger:Anm#{v['r']}")
      end
    else
      Rails::logger.error("ERROR: Could not find person in db: #{v['p']}")
    end
  end


  def export
    people = Person.all
    File.open(@file, "w") do |fd|
      fd.puts("<dump>")
      i = 1
      people.each do |person|
        f = 0
        m = 0
        parents = person.find_parents
        parents.each do |parent|
          if parent.sex == "M"
            f = parent.id
          else
            m = parent.id
          end
        end
        fornamn = get_given_name(person)
        patronym = ""
        efternamn = get_surname(person)
        if person.sex == 'M'
          kon = 'm'
        else
          kon = 'k'
        end
        updated_at = person.updated_at
        birth_refs = person.get_references.where(name: 'Born')
        if birth_refs.length == 1
          birth = birth_refs[0].other_object(person)
          birth_dates = get_dates_of(birth)
          fodat = dates_to_string(birth_dates)
          updated_at = ([updated_at] + birth_dates.collect{|birth_date| birth_date.updated_at}).max
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
          updated_at = ([updated_at] + christening_dates.collect{|date| date.updated_at}).max
          dopdat = dates_to_string(christening_dates)
        elsif christening_refs.length > 1
          raise StandardError, "More than one christening for person #{person.inspect}"
        end

        death_refs = person.get_references.where(name: 'Died')
        if death_refs.length == 1
          death = death_refs[0].other_object(person)
          updated_at = [updated_at, death.updated_at].max
          death_dates = get_dates_of(death)
          updated_at = ([updated_at] + death_dates.collect{|date| date.updated_at}).max
          dodat = dates_to_string(death_dates)
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
          updated_at = ([updated_at] + burial_dates.collect{|date| date.updated_at}).max
          begdat = dates_to_string(burial_dates)
        elsif burial_refs.length > 1
          raise StandardError, "More than one burial for person #{person.inspect}"
        end

        profession = get_note_for(person, 'Profession')
        updated_at = [updated_at, profession.updated_at].max
        yrke = profession.note

        address = get_address_of(person)
        unless address.nil?
          updated_at = [updated_at, address.updated_at].max
          hemort = address.street
          hemfs = address.parish
        end

        note1 = get_note_for(person, "Holger:Anm1")
        unless note1.nil?
          updated_at = [updated_at, note1.updated_at].max
          unless note1.note.include? "\n"
            anm1 = note1.note
          else
            anm1 = ''
          end
        else
          anm1 = ''
        end
        note2 = get_note_for(person, "Holger:Anm2")
        unless note2.nil?
          updated_at = [updated_at, note2.updated_at].max
          unless note2.note.include? "\n"
            anm2 = note2.note
          else
            anm2 = ''
          end
        else
          anm2 = ''
        end
        ttnamn = get_calling_name_end_index(person)
        eenamn = '0'
        dopkod = ''
        begkod = ''
        konkod = ''
        markering = 'A0000000000000000000000000000000000000000000000000000000000000000000000000000000'
        sortfalt = '%10d' % i
        regtid = person.created_at
        upptid = updated_at
        dbid = 0
        regid = 0
        uppid = 0
        typ = 'P'
        status = ''

        fd.puts("  <row>")
        fd.puts(make_number_tag("p", person.id))
        fd.puts(make_number_tag("f", f))
        fd.puts(make_number_tag("m", m))
        fd.puts(make_alpha_tag("fornamn", fornamn))
        fd.puts(make_alpha_tag("patronym", patronym))
        fd.puts(make_alpha_tag("efternamn", efternamn))
        fd.puts(make_alpha_tag("kon", kon))
        fd.puts(make_alpha_tag("fodat", fodat))
        fd.puts(make_alpha_tag("dopdat", dopdat))
        fd.puts(make_alpha_tag("fodort", fodort))
        fd.puts(make_alpha_tag("fodfs", fodfs))
        fd.puts(make_alpha_tag("dodat", dodat))
        fd.puts(make_alpha_tag("begdat", begdat))
        fd.puts(make_alpha_tag("dodort", dodort))
        fd.puts(make_alpha_tag("dodfs", dodfs))
        fd.puts(make_alpha_tag("dodors", dodors))
        fd.puts(make_alpha_tag("yrke", yrke))
        fd.puts(make_alpha_tag("hemort", hemort))
        fd.puts(make_alpha_tag("hemfs", hemfs))
        fd.puts(make_alpha_tag("anm1", anm1))
        fd.puts(make_alpha_tag("anm2", anm2))
        fd.puts(make_alpha_tag("ttnamn", ttnamn))
        fd.puts(make_alpha_tag("eenamn", eenamn))
        fd.puts(make_alpha_tag("dopkod", dopkod))
        fd.puts(make_alpha_tag("begkod", begkod))
        fd.puts(make_alpha_tag("konkod", konkod))
        fd.puts(make_alpha_tag("markering", markering))
        fd.puts(make_alpha_tag("sortfalt", sortfalt))
        fd.puts(make_timestamp_tag("regtid", regtid))
        fd.puts(make_timestamp_tag("upptid", upptid))
        fd.puts(make_number_tag("dbid", dbid))
        fd.puts(make_number_tag("regid", regid))
        fd.puts(make_number_tag("uppid", uppid))
        fd.puts(make_alpha_tag("typ", typ))
        fd.puts(make_alpha_tag("status", status))
        fd.puts("  </row>")

        i = i + 1
      end
      fd.puts("</dump>")
    end
  end

  def make_tag(tag_type, name, value)
    return "    <#{tag_type} name=\"#{name}\">#{value}</#{tag_type}>"
  end

  def make_alpha_tag(name, value)
    return make_tag("alpha", name, value)
  end

  def make_number_tag(name, value)
    return make_tag("number", name, "#{value}.000000")
  end

  def make_timestamp_tag(name, value)
    return make_tag("timestamp", name, "#{value.strftime("%Y-%m-%d %H:%M:%S")}")
  end

  def get_given_name(person)
    if person.person_names.length == 1
      given_name = person.person_names.first.given_name
    else
      given_name = person.person_names.first.given_name
      unless person.person_names.all? {|person_name| person_name.given_name == given_name}
        raise StandardError, "Unhandled number of names #{person.person_names.length}"
      end
    end
    return given_name
  end

  def get_surname(person)
    if person.person_names.length == 1
      surname = person.person_names.first.surname
    elsif person.person_names.length == 2
      surname = "#{person.person_names.last.surname} f.#{person.person_names.first.surname}"
    else
      raise StandardError, "Unhandled number of names #{person.person_names.length}"
    end
    return surname
  end

  def get_calling_name_end_index(person)
    first = person.person_names.last.given_name.index(person.person_names.last.calling_name)
    unless first.nil?
      last = first + person.person_names.last.calling_name.length + 1
    else
      last = 0
    end
    return (last + '0'.ord).chr
  end

  def get_dates_of(event)
    references = event.get_references.where(name: "Date")
    if references.length > 0
      return references.collect{|reference| reference.other_object(event)}
    else
      return nil
    end
  end

  def dates_to_string(dates)
    date_strings = dates.collect{|date| date.one_line}
    return date_strings.join(', ')
  end

  def get_address_of(event)
    references = event.get_references.where(name: "Address")
    addresses = references.collect{|reference| reference.other_object(event)}
    if addresses.length == 1
      return addresses[0]
    elsif addresses.length == 0
      return nil
    else
      raise StandardError, "Event has more than one address: #{event.inspect} #{addresses.inspect}"
    end
  end

  def get_note_for(object, role)
    references = object.get_references.where(name: role)
    notes = references.collect{|reference| reference.other_object(object)}
    if notes.length == 1
      return notes[0]
    elsif notes.length == 0
      return nil
    else
      raise StandardError, "Object has more than one note: #{object.inspect} #{notes.inspect}"
    end
  end

end
