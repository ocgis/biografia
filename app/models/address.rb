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
     parts = []

     unless self.street.nil?
       parts << self.street
     end
     unless self.town.nil?
       parts << self.town
     end

     unless self.parish.nil?
       parts << (self.parish + " församling")
     end

     unless self.latitude.nil? or self.longitude.nil? or parts.length > 0
       parts << self.latitude.to_s + ',' + self.longitude.to_s
     end

     if parts.length > 0
       return parts.join(', ')
     else
       return "Empty address: {self.inspect}"
     end
   end

   def maps_address
     parts = []

     unless self.latitude.nil? or self.longitude.nil?
       parts << self.latitude.to_s + ',' + self.longitude.to_s
     else
       unless self.street.nil?
         parts << self.street
       end
       unless self.town.nil?
         parts << self.town
       end

       unless self.parish.nil?
         parts << self.parish
       end
     end

     if parts.length > 0
       return parts.join(', ')
     else
       return nil
     end
   end

   def merge(other)
     fields = ['street','town','zipcode','parish','country','source','latitude','longitude']
     fields.each do |field|
       unless self.send(field) == other.send(field)
         if self.send(field).nil?
           self.send(field+'=', other.send(field))
         elsif not other.send(field).nil? # Both non-nil
           self.send(field+'=', self.send(field)+' / '+ other.send(field))
         end
       end
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

  def all_attributes
    attributes
  end
end
