class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end
  
  def new
  end

  def newp
    locals = { }
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId] != nil
    end
    locals[:grandParentId] = params[:grandParentId] if params[:grandParentId] != nil
    respond_to do |format|
      format.js { render "replace_html", :locals => { :object => nil, :locals => locals, :partial => 'newp', :replaceElem => params[:newElem], :hideElem => params[:hideElem] } }
    end
  end

  def createp
    parentId = params.require(:form).require(:parentId)

    newObj = create_object
    saved = newObj.save
     
    if saved
      parent_obj = find_by_object_name(parentId)
      if params[:reference].nil?
        parent_obj.add_reference(newObj)
      else
        parent_obj.add_reference(newObj, :role => params.require(:reference).require(:name))
      end
      controller = parent_obj.controller
      object = parent_obj
      object.set_extra(:related_objects, object.related_objects)
      object.set_extra(:referenceId, params[:form][:parentReferenceId]) if defined? params[:form][:parentReferenceId]
      options = { :enclosedById => false, :showModifier => true }
      options[:parent] = find_by_object_name(params[:form][:grandParentId]) if params[:form][:grandParentId] != nil
      respond_to do |format|
        format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => controller + '/showp', :object => object, :replaceElem => object.object_name } }
      end
    else
      render :action => 'new'
    end
  end

  def index
    @objects = all_objects
    @title = index_title
  end

  def show
    @object = find_object
    related=@object.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    @object.set_extra(:related_objects, related)
  end

  def showp
    object = find_object
    object.set_extra(:related_objects, object.related_objects)
    object.set_extra(:reference, Reference.find(params[:referenceId])) if not params[:referenceId].nil?
    options = 
      {
        :enclosedById => false,
        :showModifier => true
      }
    if params[:parentId] != nil
      options[:parent] = find_by_object_name(params[:parentId])
      options[:parent].set_extra(:referenceId, params[:parentReferenceId]) if not params[:parentReferenceId].nil?
    end
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => 'showp', :object => object, :replaceElem => object.object_name } }
    end
  end

  def edit
    object = find_object
    object.set_extra(:reference, Reference.find(params[:referenceId])) if not params[:referenceId].nil?
    related=object.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    object.set_extra(:related_objects, related)
    locals = {}
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId != nil]
    end
    @edited = object
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => locals, :partial => 'edit', :object => object, :replaceElem => object.object_name } }
    end
  end

  def update
    object = find_object_and_update_attrs
    object.set_extra(:related_objects, object.related_objects)
    
    controller = object.controller
    
    if object.save
      if defined? params[:form][:referenceId]
        object.set_extra(:reference, Reference.find(params[:form][:referenceId]))
        if not params[:reference].nil?
          if not object.get_extra(:reference).update(params[:reference].permit(:name))
            raise StandardException, "Failed to update reference"
          end
        end
      end
      options =
        {
          :enclosedById => false,
          :showModifier => true,
        }
      options[:parentId] = params[:form][:parentId] if defined? params[:form][:parentId]
      respond_to do |format|
        format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => controller + '/showp', :object => object, :replaceElem => object.object_name } }
      end
    else
      render controller + '/edit' 
    end
  end

  def delete
    id = params.require(:id)

    obj = find_object
    obj.set_extra(:related_objects, obj.related_objects)
    options = {}
    options[:referenceId] = params[:referenceId] if defined? params[:referenceId]  
    options[:parentId] = params[:parentId] if defined? params[:parentId]  
    options[:parentReferenceId] = params[:parentReferenceId] if defined? params[:parentReferenceId]  
    options[:updateName] = params[:updateName] if defined? params[:updateName]  
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => 'delete', :object => obj, :replaceElem => obj.object_name } }
    end
  end

  def destroy
    object = find_object
    object.get_references.each do |reference|
      reference.destroy
    end
    object.destroy

    respond_to do |format|
      format.js { render "reload_page" }
      format.html { redirect_to :action => "index" }
    end
  end

  protected

  def find_by_object_name(object_name)
    a = object_name.split('_')
    if a.length != 2
      raise StandardError, "Not a valid object name: #{object_name}."
    end
    return Kernel.const_get(a[0]).find(a[1].to_i)
  end

  private
  
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

end
