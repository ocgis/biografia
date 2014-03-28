class ReferencesController < ApplicationController
  def connection_choose
    id = params.require(:id)

    object = { :object => find_by_object_name(id) }
    object[:relationId] = params[:relationId] if defined? params[:relationId]

    locals = {}
    locals[:showFull] = params[:showFull] if params[:showFull] != nil
    
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'connchoose', :object => object, :replaceElem => object[:object].object_name } }
    end
  end

  def connection_list
    filter = params.require(:filter).require(:filter)
    form = params.require(:form)
    connect1Id = form.require(:connect1Id)
    updateListName = form.require(:updateListName)

    @people = Person.where("given_name LIKE \"%#{filter}%\"").first(20)
    @events = Event.where("name LIKE \"%#{filter}%\"").first(20)
    locals =
      {
        :connect1Id => connect1Id
      }
    locals[:showFull] = form[:showFull] if form[:showFull] != nil
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'connlist', :object => nil, :replaceElem => updateListName } }
    end
  end

  def connection_add
    form = params.require(:form)
    connect1Id = form.require(:connect1Id)
    connect2Id = form.require(:connect2Id)
    form_x = form.require(:x)
    form_y = form.require(:y)
    form_w = form.require(:w)
    form_h = form.require(:h)

    obj1 = find_by_object_name(connect1Id)
    obj2 = find_by_object_name(connect2Id)
    reference = obj1.add_reference(obj2)

    if(form_x.to_i >= 0)
      pictureWidth = 1; # FIXME
      pictureHeight = 1; # FIXME
      x = form_x.to_f / pictureWidth;
      y = form_y.to_f / pictureHeight;
      width = form_w.to_f / pictureWidth;
      height = form_h.to_f / pictureHeight;
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
    id = params.require(:id)
    referenceId = params.require(:referenceId)
    parentId = params.require(:parentId)
    updateName = params.require(:updateName)
    removeReferenceOnly = params.require(:removeReferenceOnly)

    obj = find_by_object_name(id)
    locals = 
      {
        :referenceId => referenceId,
        :parentId => parentId,
        :updateName => updateName,
        :removeReferenceOnly => removeReferenceOnly
      }
    locals[:parentReferenceId] = params[:parentReferenceId] if defined? params[:parentReferenceId]  
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'references/delete', :object => obj, :replaceElem => obj.object_name } }
    end
  end

  def destroy
    removeReferenceOnly = params.require(:removeReferenceOnly)

    if !params[:referenceId].nil?
      reference = Reference.find(params[:referenceId])
      reference.position_in_pictures.destroy_all
      reference.destroy
    end
    
    if !(removeReferenceOnly=="true")
      object = find_by_object_name(params.require(:id))
      object.references.destroy_all
      object.destroy
    end

    respond_to do |format|
      format.js { render "reload_page" }
    end
  end

end
