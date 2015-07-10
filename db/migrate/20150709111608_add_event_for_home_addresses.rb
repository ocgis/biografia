class AddEventForHomeAddresses < ActiveRecord::Migration
  def up
    references = Reference.where(type1: "Person", type2: "Address") + Reference.where(type2: "Person", type1: "Address")

    references.each do |reference|
      PaperTrail.whodunnit = reference.versions.last.whodunnit
      event = Event.new
      event.name = "Boende"
      event.created_at = reference.created_at
      event.updated_at = reference.updated_at
      unless event.save
        raise StandardError, "Could not save event: #{event}"
      end

      if reference.type1 = "Person"
        person_id = reference.id1
        address_id = reference.id2
      else
        person_id = reference.id2
        address_id = reference.id1
      end

      person_event = Reference.new
      person_event.name = "Accommodation"
      person_event.type1 = "Person"
      person_event.id1 = person_id
      person_event.type2 = "Event"
      person_event.id2 = event.id
      person_event.created_at = reference.created_at
      person_event.updated_at = reference.updated_at
      unless person_event.save
        raise StandardError, "Could not save reference: #{person_event}"
      end
      
      address_event = Reference.new
      address_event.name = "Address"
      address_event.type1 = "Address"
      address_event.id1 = address_id
      address_event.type2 = "Event"
      address_event.id2 = event.id
      address_event.created_at = reference.created_at
      address_event.updated_at = reference.updated_at
      unless address_event.save
        raise StandardError, "Could not save reference: #{address_event}"
      end
      
      unless reference.destroy
        raise StandardError, "Could not destroy reference: #{reference}"
      end
    end
  end

  def down
  end

end
