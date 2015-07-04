class ReferencesController < ApplicationController

  load_and_authorize_resource

  def connection_choose
    name = params.require(:name)

    object = find_by_object_name(name)
    related=object.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    object.set_extra(:related_objects, related)
    object.set_extra(:relationId, params[:relationId]) if defined? params[:relationId]

    options = {}
    options[:showFull] = params[:showFull] if params[:showFull] != nil
    
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => 'connchoose', :object => object, :replaceElem => 'modal_dialog' } }
    end
  end

  def connection_list
    filter = params.require(:filter)[:filter]
    form = params.require(:form)
    updateListName = form.require(:updateListName)

    filters = filter.split(' ')
    people = Person.filtered_search(filters)
    events = Event.where("name LIKE \"%#{filter}%\"").first(20)
    addresses = Address.filtered_search(filters)
    things = Thing.filtered_search(filters)
    @objects = people.collect {|p| [ p.long_name, p.object_name ] } +
               events.collect {|e| [ e.one_line, e.object_name ] } +
               addresses.collect {|e| [ e.one_line, e.object_name ] } +
               things.collect {|e| [ e.one_line, e.object_name ] }
    locals = {}
    locals[:showFull] = form[:showFull] if form[:showFull] != nil
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'connlist', :object => nil, :replaceElem => updateListName, :noReInit => true } }
    end
  end

  def connection_add
    form = params.require(:form)
    connect1Id = form.require(:connect1Id)
    connect2Id = form.require(:connect2Id)

    obj1 = find_by_object_name(connect1Id)
    obj2 = find_by_object_name(connect2Id)
    reference = obj1.add_reference(obj2)

    unless form[:x].nil?
      x = form[:x].to_f;
      y = form[:y].to_f;
      width = form[:w].to_f;
      height = form[:h].to_f;
      reference.position_in_pictures.create( :x => x, :y => y, :width => width, :height => height )
    end
    
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
    referencedId = params.require(:referencedId)
    
    obj = find_by_object_name(referencedId)
    obj.set_extra(:related_objects, obj.related_objects)
    options = 
      {
        :referenceId => id
      }
    options[:topName] = params.require(:topName)  
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => 'references/delete', :object => obj, :replaceElem => "modal_dialog" } }
    end
  end

  def destroy
    topName = params.require(:topName)

    if !params[:id].nil?
      reference = Reference.find(params[:id])
      reference.position_in_pictures.destroy_all
      reference.destroy
    end

    options = { :topName => topName,
                :showFull => true,
                :enclosedById => false,
                :showModifier => true }

    topObject = find_by_object_name(topName)
    related=topObject.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    topObject.set_extra(:related_objects, related)
    
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => topObject.controller + "/showp", :object => topObject, :replaceElem => topName } }
    end
  end

end
