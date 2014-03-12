class EventDatesController < ApplicationController
  def new
    render :update do |page|
      if params[:hideElem] != nil
        page[params[:hideElem]].hide
      end
      locals = { }
      if params[:parentId] != nil
        locals[:parentId] = params[:parentId]
        locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId] != nil
      end
      locals[:grandParentId] = params[:grandParentId] if params[:grandParentId] != nil
      page.replace_html params[:newElem], :partial => 'new', :locals => locals
    end
  end

  def create
     p = ActionController::Parameters.new(:date => params[:date].to_s)
     newObj = EventDate.new(event_date_params(p))
     saved = newObj.save
     
     if defined? params[:form][:parentId]
     end
   
     if saved
        if defined? params[:form][:parentId]
          parent_obj = find_by_object_name(params[:form][:parentId])
          parent_obj.add_reference(newObj)
          controller = parent_obj.controller
          object = { :object => parent_obj }
          object[:referenceId] = params[:form][:parentReferenceId] if defined? params[:form][:parentReferenceId]
          locals = { :enclosedById => false, :showModifier => true }
          locals[:parent] = { :object => find_by_object_name(params[:form][:grandParentId]) } if params[:form][:grandParentId] != nil
          render :update do |page|
            page.replace_html parent_obj.object_name, :partial => controller + '/show', :object => object, :locals => locals
          end
        else
          Rails::logger.error("ERROR: Could not save: #{newObj}")
          raise StandardError
        end
     else
        render :action => 'new'
     end
  end

  def show
    object = { :object => EventDate.find(params[:id]) }
    object[:referenceId] = params[:referenceId] if params[:referenceId] != nil
    locals = 
      {
        :enclosedById => false,
        :showModifier => true
      }
    if params[:parentId] != nil
      locals[:parent] = { :object => find_by_object_name(params[:parentId]) }
      locals[:parent][:referenceId] = params[:parentReferenceId] if params[:parentReferenceId] != nil
    end
    render :update do |page|
      page.replace_html object[:object].object_name, :partial => 'show', :object => object, :locals => locals
    end
  end

  def edit
    object = { :object => EventDate.find(params[:id]) }
    object[:referenceId] = params[:referenceId] if defined? params[:referenceId]
    locals = {}
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId != nil]
    end
    @event_date = object[:object]
    render :update do |page|
      page.replace_html object[:object].object_name, :partial => 'edit', :object => object, :locals => locals
    end
  end
  
  def update
    object = { :object => EventDate.find(params[:id]) }
    p = ActionController::Parameters.new(:date => params[:date].to_s)
    object[:object].attributes = event_date_params(p)
    
    controller = object[:object].controller
    
    if object[:object].save
      render :update do |page|
        object[:referenceId] = params[:form][:referenceId] if defined? params[:form][:referenceId]
        locals =
          {
            :enclosedById => false,
            :showModifier => true,
          }
        locals[:parentId] = params[:form][:parentId] if defined? params[:form][:parentId]
        page.replace_html object[:object].object_name, :partial => controller + '/show', :object => object, :locals => locals
      end
    else
      render controller + '/edit' 
    end
  end

  private

  def event_date_params(params)
    params.permit(:date)
  end

end
