class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def new
    locals = { }
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId] != nil
    end
    locals[:grandParentId] = params[:grandParentId] if params[:grandParentId] != nil
    respond_to do |format|
      format.js { render "replace_html", :locals => { :object => nil, :locals => locals, :partial => 'new', :replaceElem => params[:newElem], :hideElem => params[:hideElem] } }
    end
  end

  def create
     newObj = create_object
     saved = newObj.save
     
     if saved
        if defined? params[:form][:parentId]
          parent_obj = find_by_object_name(params[:form][:parentId])
          parent_obj.add_reference(newObj)
          controller = parent_obj.controller
          object = { :object => parent_obj }
          object[:referenceId] = params[:form][:parentReferenceId] if defined? params[:form][:parentReferenceId]
          locals = { :enclosedById => false, :showModifier => true }
          locals[:parent] = { :object => find_by_object_name(params[:form][:grandParentId]) } if params[:form][:grandParentId] != nil
          respond_to do |format|
            format.js { render "replace_html", :locals => { :locals => locals, :partial => controller + '/show', :object => object, :replaceElem => parent_obj.object_name } }
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
    object = { :object => find_object }
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
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'show', :object => object, :replaceElem => object[:object].object_name } }
    end
  end

  def edit
    object = { :object => find_object }
    object[:referenceId] = params[:referenceId] if defined? params[:referenceId]
    locals = {}
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId != nil]
    end
    @edited = object[:object]
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'edit', :object => object, :replaceElem => object[:object].object_name } }
    end
  end

  def update
    object = { :object => find_object_and_update_attrs }
    
    controller = object[:object].controller
    
    if object[:object].save
      object[:referenceId] = params[:form][:referenceId] if defined? params[:form][:referenceId]
      locals =
        {
          :enclosedById => false,
          :showModifier => true,
        }
      locals[:parentId] = params[:form][:parentId] if defined? params[:form][:parentId]
      respond_to do |format|
        format.js { render "replace_html", :locals => { :locals => locals, :partial => controller + '/show', :object => object, :replaceElem => object[:object].object_name } }
      end
    else
      render controller + '/edit' 
    end
  end

  protected

  def find_by_object_name(object_name)
    a = object_name.split('_')
    if a.length != 2
      raise StandardError
    end
    return Kernel.const_get(a[0]).find(a[1].to_i)
  end

end
