class ReferencesController < ApplicationController
  def connection_choose
  end

  def delete
    obj = find_by_object_name(params[:id])
    locals = 
      {
        :referenceId => params[:referenceId],
        :parentId => params[:parentId],
        :updateName => params[:updateName],
        :removeReferenceOnly => params[:removeReferenceOnly]
      }
    locals[:parentReferenceId] = params[:parentReferenceId] if defined? params[:parentReferenceId]  
    render :update do |page|
	    page.replace_html obj.object_name,
            :partial => 'references/delete', :object => obj,
            :locals => locals
    end
  end

  def destroy
    puts "/////// destroy params:#{params.inspect}"
    if !params[:referenceId].nil?
      reference = Reference.find(params[:referenceId])
      # FIXME:    object.position_in_pictures.destroy_all
      reference.destroy
    end
    
    puts params[:removeReferenceOnly] == "true"
    if !(params[:removeReferenceOnly]=="true")
      object = find_by_object_name(params[:id])
      puts "%%%%%% Object #{object.inspect}"
      object.references.destroy_all
      object.destroy
    end

    render :update do |page|
#      page.replace_html object_name, :text => ''
      page.reload
    end
  end

end
