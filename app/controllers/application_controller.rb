class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

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
      object = { :object => parent_obj }
      object[:related_objects] = object[:object].related_objects
      object[:referenceId] = params[:form][:parentReferenceId] if defined? params[:form][:parentReferenceId]
      options = { :enclosedById => false, :showModifier => true }
      options[:parent] = { :object => find_by_object_name(params[:form][:grandParentId]) } if params[:form][:grandParentId] != nil
      respond_to do |format|
        format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => controller + '/showp', :object => object, :replaceElem => parent_obj.object_name } }
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
    @related=@object.related_objects
    @related[:events].each do |r|
      r[:related_objects] = r[:object].related_objects
    end
    @related[:relationships].each do |r|
      r[:related_objects] = r[:object].related_objects
    end
  end

  def showp
    object = { :object => find_object }
    object[:related_objects] = object[:object].related_objects
    object[:referenceId] = params[:referenceId] if params[:referenceId] != nil
    options = 
      {
        :enclosedById => false,
        :showModifier => true
      }
    if params[:parentId] != nil
      options[:parent] = { :object => find_by_object_name(params[:parentId]) }
      options[:parent][:referenceId] = params[:parentReferenceId] if params[:parentReferenceId] != nil
    end
    respond_to do |format|
      format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => 'showp', :object => object, :replaceElem => object[:object].object_name } }
    end
  end

  def edit
    object = { :object => find_object }
    object[:reference] = Reference.find(params[:referenceId]) if not params[:referenceId].nil?
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
    object[:related_objects] = object[:object].related_objects
    
    controller = object[:object].controller
    
    if object[:object].save
      if defined? params[:form][:referenceId]
        object[:reference] = Reference.find(params[:form][:referenceId])
        if not object[:reference].update(params[:reference].permit(:name))
          raise StandardException, "Failed to update reference"
        end
      end
      options =
        {
          :enclosedById => false,
          :showModifier => true,
        }
      options[:parentId] = params[:form][:parentId] if defined? params[:form][:parentId]
      respond_to do |format|
        format.js { render "replace_html", :locals => { :locals => { :options => options }, :partial => controller + '/showp', :object => object, :replaceElem => object[:object].object_name } }
      end
    else
      render controller + '/edit' 
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

end
