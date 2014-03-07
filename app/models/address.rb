# coding: utf-8

class Address < ActiveRecord::Base
   extend CommonClassMethods
   include CommonInstanceMethods

   has_and_belongs_to_many :references

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
end
