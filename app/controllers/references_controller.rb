# -*- coding: utf-8 -*-
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
    filter = params.require(:q)
    if params[:searchModel].nil?
      searchModels = [ Person, Event, Address, Thing ]
    else
      # FIXME: Check that model is allowed for search
      searchModels = [ params[:searchModel].constantize ]
    end

    filters = filter.split(' ')

    found = []
    searchModels.each do |searchModel|
      found += searchModel.filtered_search(filters)
    end
    objects = found.collect {|f| { label: f.decorate.one_line, value: f.object_name } }

    unless params[:ignoreName].nil?
      objects.reject!{|object| object[:value] == params[:ignoreName]}
    end

    respond_to do |format|
      format.js { render json: objects.to_json, callback: params['callback'] }
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
