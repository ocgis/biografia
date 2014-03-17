class ReferencesController < ApplicationController
  def connection_choose
    object = { :object => find_by_object_name(params[:id]) }
    object[:relationId] = params[:relationId] if defined? params[:relationId]

    locals = {}
    locals[:showFull] = params[:showFull] if params[:showFull] != nil
    
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'connchoose', :object => object, :replaceElem => object[:object].object_name } }
    end
  end

  def connection_list
    @people = Person.where("given_name LIKE \"%#{params[:filter][:filter]}%\"").first(20)
    @events = Event.where("name LIKE \"%#{params[:filter][:filter]}%\"").first(20)
    locals =
      {
        :connect1Id => params[:form][:connect1Id]
      }
    locals[:showFull] = params[:form][:showFull] if params[:form][:showFull] != nil
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'connlist', :object => nil, :replaceElem => params[:form][:updateListName] } }
    end
  end

  def connection_add
    params.require(:form)
    obj1 = find_by_object_name(params[:form][:connect1Id])
    obj2 = find_by_object_name(params[:form][:connect2Id])
    reference = obj1.add_reference(obj2)

    if(params[:form][:x].to_i >= 0)
      pictureWidth = 1; # FIXME
      pictureHeight = 1; # FIXME
      x = params[:form][:x].to_f / pictureWidth;
      y = params[:form][:y].to_f / pictureHeight;
      width = params[:form][:w].to_f / pictureWidth;
      height = params[:form][:h].to_f / pictureHeight;
      reference.position_in_pictures.create( :x => x, :y => y, :width => width, :height => height )
    end
    
    object = { :object => obj1 }

    locals =
      {
        :enclosedById => false,
        :showModifier => true,
        :showFull => true, # FIXME
        :mode => 'tag'     # FIXME
      }
    locals[:showFull] = params[:showFull] if params[:form][:showFull] != nil
    respond_to do |format|
      format.js { render "reload_page" }
    end
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
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'references/delete', :object => obj, :replaceElem => obj.object_name } }
    end
  end

  def destroy
    if !params[:referenceId].nil?
      reference = Reference.find(params[:referenceId])
      reference.position_in_pictures.destroy_all
      reference.destroy
    end
    
    if !(params[:removeReferenceOnly]=="true")
      object = find_by_object_name(params[:id])
      object.references.destroy_all
      object.destroy
    end

    respond_to do |format|
      format.js { render "reload_page" }
    end
  end

end
