# coding: utf-8

class Address < ActiveRecord::Base
   has_paper_trail
   
   extend CommonClassMethods
   include CommonInstanceMethods

   def controller
     return 'addresses'
   end

   # FIXME: add test
   def one_line
       address = ""
       if self.street != nil
          address += self.street
       end
       if self.town != nil
         if address != ""
            address += ", "
         end
          address += self.town
       end
       if self.parish != nil
          if address != ""
             address += ", "
          end
          address += self.parish + " församling"
       end

       return address
   end

   def maps_address
     parts = []
     unless self.street.nil?
       parts << self.street
     end
     unless self.town.nil?
       parts << self.town
     end

     unless self.parish.nil?
       parts << self.parish
     end

     if parts.length > 0
       return parts.join(', ')
     else
       return nil
     end
   end


  def self.filtered_search(filters)
    addresses = Address.all

    filters.each do |filter|
      addresses = addresses.where("town LIKE \"%#{filter}%\" OR street LIKE \"%#{filter}%\" OR zipcode LIKE \"%#{filter}%\" OR parish LIKE \"%#{filter}%\" OR country LIKE \"%#{filter}%\"")
    end
    addresses = addresses.first(100)

    return addresses
  end

end
