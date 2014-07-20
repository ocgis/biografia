class ImportsController < ApplicationController

  load_and_authorize_resource

  def new
    @msg = params[:transfer_id] + "\n"
    
    transfer_obj = Transfer.find(params[:transfer_id])
    @msg = @msg + transfer_obj.inspect + "\n"
    @msg = @msg + transfer_obj.full_file_name + "\n"
    
#    g = Gedcom.file(transfer_obj.full_file_name, "r:ASCII-8BIT")
#    @msg = @msg + "\nExample family record\n"
#    @msg = @msg + g.transmissions[0].family_record[0].to_s
#    @msg = @msg + "\nExample family ref\n"
#    @msg = @msg + g.transmissions[0].family_record[0].family_ref.to_s
#    @msg = @msg + "\nExample individual record\n"
#    @msg = @msg + g.transmissions[0].individual_record[0].to_s
#    @msg = @msg + "\nIndividual record keys\n"
#    puts g.transmissions[0].individual_record[0].attributes
#    puts g.transmissions[0].individual_record[0].attributes.keys
#    @msg = @msg + g.transmissions[0].individual_record[0].attributes.keys.to_s
#    g.transmission[0].self_check #validate the gedcom file just loaded, printing errors found.

    f = File.new(transfer_obj.full_file_name, 'r')
    # initial pass, get meta data about the gedcom
    i = 0
    Rails::logger.debug @msg
      

    # Get the file
    ged_filename = transfer_obj.full_file_name
    #ARGV[0]

    g = GedcomFile.new(ged_filename)
    g.import
  end
end
