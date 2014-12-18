# -*- coding: utf-8 -*-
require 'ged_parse'
include GedParse

class GedcomFile < Gedcom
  
  def initialize(file)
    @file = file
    
    @family_objects = {}
  end
  
  def import
    Gedcom.instance_method(:initialize).bind(self).call(@file)
  end

  private
    
  def unflatten_details(details)
    unflat_details = []
    if details.size == 0
      # Do nothing
    else
      split_level = details[0][:level]
      split_points = []
      for i in 0..(details.size-1)
        if details[i][:level] == split_level
          split_points.append(i)
        end
      end
      split_points.append(details.size)
      
      for i in 0..(split_points.size-2)
        root = details[split_points[i]]
        root[:field] = root[:field].split('_')[-1]
        unflat_details.append({ :root => root,
                                :children => unflatten_details(details[split_points[i]+1..split_points[i+1]-1]) })
      end
    end
    
    return unflat_details
  end
  
  def parse_date(detail)
    if detail[:root][:field] != 'DATE'
      logger.error("ERROR: Field #{detail[:root][:field]} is not a date.")
      raise StandardError      
    end
    begin
      datetime = Date.strptime(detail[:root][:value], "%e %b %Y")
  
      detail[:children].each do |child|
        case child[:root][:field]
        when 'TIME'
          change_time = DateTime.strptime(child[:root][:value], "%H:%M:%S")
          datetime = DateTime.new(datetime.year, datetime.month, datetime.day, change_time.hour, change_time.minute, change_time.second)
        else
          Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
          raise StandardError
        end
      end
    rescue
      Rails::logger.warn("WARNING: Could not parse date (#{detail.inspect})")
    end
    
    return datetime
  end

  def parse_string(detail, expected_tag)
    if detail[:root][:field] != expected_tag
      Rails::logger.error("ERROR: Field #{detail[:root][:field]} is not a #{expected_tag}.")
      raise StandardError      
    end

    if detail[:children].length != 0
      Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} was not expected to have any children: #{child[:children].inspect} could not be handled")
      raise StandardError
    end

    return detail[:root][:value]
  end

  def parse_parish(detail)
    return parse_string(detail, 'PARI')  
  end
      
  def parse_place(detail)
    return parse_string(detail, 'PLAC')
  end

  def parse_hdp(detail)
    return parse_string(detail, 'HDP')
  end
  
  def parse_info(detail)
    return parse_string(detail, 'INFO')
  end
  
  def parse_misc(detail)
    return parse_string(detail, 'MISC')
  end
  
  def parse_note(detail)
    return parse_string(detail, 'NOTE')
  end
  
  def parse_remark(detail)
    return parse_string(detail, 'REMA')
  end
  
  def parse_residence(detail)
    expected_tag = 'RESI'
    if detail[:root][:field] != expected_tag
      Rails::logger.error("ERROR: Field #{detail[:root][:field]} is not a #{expected_tag}.")
      raise StandardError      
    end
  
    parish = nil
    street = nil
      
    detail[:children].each do |child|
      case child[:root][:field]
      when 'PARI'
        parish = parse_parish(child)
      when 'PLAC'
        street = parse_place(child)
      else
        Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
        raise StandardError      
      end
    end
    
    address = Address.create_save(:street => street, :parish => parish)

    return address
  end
  
  def parse_cause(detail)
    return parse_string(detail, 'CAUS')    
  end

  def parse_title(detail)
    return parse_string(detail, 'TITL')
  end
  
  def parse_hdv(detail)
    return parse_string(detail, 'HDV')
  end
  
  def parse_type(detail)
    return parse_string(detail, 'TYPE')
  end

  def extend_address(address, field, value)
    if address.nil?
      address = Address.create_save(field => value)
    else
      if !address[field].nil?
        Rails::logger.error("ERROR: #{field} not nil: #{address.inspect}")
        raise StandardError
      end
      address[field] = value
      if !address.save
        Rails::logger.error("ERROR: Address could not be saved: #{address.inspect}")
        raise StandardError
      end
    end
    
    return address
  end
  
  def parse_event(detail, expected_tag, name, extra_allowed_values=[])
    if detail[:root][:field] != expected_tag
      logger.error("ERROR: Field #{detail[:root][:field]} is not a #{expected_tag}.")
      raise StandardError      
    end

    if !detail[:root][:value].nil? && !(extra_allowed_values.include? detail[:root][:value])
        Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value #{detail[:root][:value]} and full content #{detail.inspect} could not be handled")
        raise StandardError
    end

    event = Event.create_save(:name => name)
    address = nil

    detail[:children].each do |child|
      case child[:root][:field]
      when 'CAUS'
        note = Note.create_save(:category => 'cause', :title => 'Orsak', :note => parse_cause(child))
        event.add_reference(note)
      when 'DATE'
        datetime = parse_date(child)
        if !datetime.nil?
          event_date = EventDate.new()
          if datetime.class == Date
            event_date.set_date(datetime.strftime("%Y-%m-%d"))
          else
            event_date.set_date(datetime.strftime("%Y-%m-%d %H:%M"))
          end
          if !event_date.save
            Rails::logger.error("ERROR: #{event_date.class.name} could not be saved: #{event_date.inspect}")
            raise StandardException
          end
          event.add_reference(event_date)
        end
      when 'HDV'
        note = Note.create_save(:category => 'holger hdv', :note => parse_hdv(child))
        event.add_reference(note)
      when 'PARI'
        address = extend_address(address, 'parish', parse_parish(child))
      when 'PLAC'
        address = extend_address(address, 'street', parse_place(child))
      when 'TYPE'
        note = Note.create_save(:category => 'type', :note => parse_type(child))
        event.add_reference(note)
      else
        Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
        raise StandardError
      end
    end
    if !address.nil?
      event.add_reference(address)
    end
    return event
  end
  
  def parse_birth(detail)
    return parse_event(detail, "BIRT", "Födelse")  
  end
  
  def parse_christening(detail)
    return parse_event(detail, "CHR", "Dop", ["Y"])  
  end
  
  def parse_death(detail)
    return parse_event(detail, "DEAT", "Död")      
  end
  
  def parse_burial(detail)
    return parse_event(detail, 'BURI', 'Begravning')
  end
 
  def parse_marriage(detail)
    return parse_event(detail, 'MARR', 'Giftermål')
  end
 
  def parse_engagement(detail)
    return parse_event(detail, 'ENGA', 'Förlovning')
  end
 
  def parse_family(detail)
    case detail[:root][:field]
    when 'FAMC', 'FAMS'
      # OK
    else
      logger.error("ERROR: Field #{detail[:root][:field]} is not a family tag.")
      raise StandardError      
    end

    if detail[:root][:value].nil?
        Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value #{detail[:root][:value]} and full content #{detail.inspect} could not be handled")
        raise StandardError
    end

    family = @family_objects[detail[:root][:value]]
    if family.nil?
      family = Relationship.create_save()
      @family_objects[detail[:root][:value]] = family
    end

    detail[:children].each do |child|
      Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
      raise StandardError
    end
    return family
  end
  
  def handler(section_type, section)
    case section_type
    when 'INDI'
      person = Person.create_save()

      unflat_details = unflatten_details(section.details)
      unflat_details.each do |detail|
        case detail[:root][:field]
        when 'BIRT'
          event = parse_birth(detail)
          person.add_reference(event)

        when 'BURI'
          event = parse_burial(detail)
          person.add_reference(event)
          
        when 'CHAN'
          if !detail[:root][:value].nil?
              Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value #{detail[:root][:value]} and full content #{detail.inspect} could not be handled")
              raise StandardError
          end

          detail[:children].each do |child|
            case child[:root][:field]
            when 'DATE'
              datetime = parse_date(child)
              if datetime.nil?
                raise StandardError
              else
                person.updated_at = datetime
              end
            else
              Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
              raise StandardError
            end
          end

        when 'CHR'
          event = parse_christening(detail)
          person.add_reference(event)

        when 'DEAT'
          event = parse_death(detail)
          person.add_reference(event)
          
        when 'FAMC'
          relationship = parse_family(detail)
          person.add_reference(relationship, :role => "Child")

        when 'FAMS'
          relationship = parse_family(detail)
          person.add_reference(relationship, :role => "Spouse")

        when 'HDP'
          note = Note.create_save(:category => 'gedcom hdp', :note => parse_hdp(detail))
          person.add_reference(note)

        when 'INFO'
          note = Note.create_save(:category => 'info', :note => parse_info(detail))
          person.add_reference(note)

        when 'MISC'
          note = Note.create_save(:category => 'misc', :note => parse_misc(detail))
          person.add_reference(note)

        when 'NAME'
          name_array = detail[:root][:value].split("/")
          person_name = {}
          if name_array.length > 1
            person_name[:given_name] = name_array[0].strip
            person_name[:surname] = name_array[1..-1].join('/')
          elsif name_array.length == 1
            person_name[:given_name] = name_array[0].strip
          else
            Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value [#{detail[:root][:value].inspect}] could not be handled")
            raise StandardError
          end
          
          detail[:children].each do |child|
            case child[:root][:field]
              when 'GIVN'
                person_name[:given_name] = child[:root][:value]
              when 'FORE'
                person_name[:calling_name] = child[:root][:value]
              when 'SURN'
                person_name[:surname] = child[:root][:value]
              else
                Rails::logger.error("ERROR: Field #{child[:root][:field]} with value #{child[:root][:value]} and children #{child[:children].inspect} could not be handled")
                raise StandardError
            end
          end
          person.person_names << PersonName.create(person_name)

        when 'NOTE'
          note = Note.create_save(:category => 'note', :note => parse_note(detail))
          person.add_reference(note)

        when 'REMA'
          note = Note.create_save(:category => 'remark', :note => parse_remark(detail))
          person.add_reference(note)

        when 'RESI'
          address = parse_residence(detail)
          person.add_reference(address)
        when 'SEX'
          person.sex = detail[:root][:value]
        when 'TITL'
          note = Note.create_save(:category => 'title', :title => 'Titel', :note => parse_title(detail))
          person.add_reference(note)
        else
          Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value [#{detail[:root][:value]}] and children #{detail[:children].inspect} could not be handled")
          raise StandardError
        end
      end
              
      if !person.save
        Rails::logger.error("ERROR: Person could not be saved: #{person.inspect}")
        raise StandardError
      end
      
    when 'FAM'
      family = @family_objects[section.gid]
      if family.nil?
        family = Relationship.create_save()
        @family_objects[section.gid] = family
      end
      
      unflat_details = unflatten_details(section.details)
      unflat_details.each do |detail|
        case detail[:root][:field]
        when "ENGA"
          event = parse_engagement(detail)
          family.add_reference(event)
        when "MARR"
          event = parse_marriage(detail)
          family.add_reference(event)
        else
          Rails::logger.error("ERROR: Field #{detail[:root][:field]} with value [#{detail[:root][:value]}] and children #{detail[:children].inspect} could not be handled")
          raise StandardError
        end
      end
    else
#      puts "SECTION: #{section.gid}"
#      section.details.each do |detail|
#        puts "-- #{detail[:field]}: #{detail[:value]}"
#      end
    end
  end

end
