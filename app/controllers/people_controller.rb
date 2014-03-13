class PeopleController < ApplicationController
  def show
    object = { :object => Person.find(params[:id]) }
    if object[:object] == nil
      @message = "Error: Invalid/nonexistent id for person"
      render "common/message"
    else
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
      puts object.inspect
      render :update do |page|
        page.replace_html object[:object].object_name, :partial => 'show', :object => object, :locals => locals
      end
    end
  end

  def new
  end

  def create
     @person = Person.new(person_params(params[:person]))
     if @person.save
       redirect_to :action => 'display', :id => @person.id
     else
       render :action => 'new'
     end
  end

  def index
    @people = Person.all
  end

  def search_ajax
  end

  def display
    @base_id = params[:id]

    @person=Person.find(params[:id])
    @related=@person.related_objects
    @relationships=@person.find_spouses
    @parents=@person.find_parents
    @children=@person.find_children

    render layout: true
  end

  def edit
    object = { :object => Person.find(params[:id]) }
    object[:referenceId] = params[:referenceId] if defined? params[:referenceId]
    locals = {}
    if params[:parentId] != nil
      locals[:parentId] = params[:parentId]
      locals[:parentReferenceId] = params[:parentReferenceId] if params[:parentReferenceId != nil]
    end
    @person = object[:object]
    puts "Replace html for #{object[:object].object_name}"
    render :update do |page|
      page.replace_html object[:object].object_name, :partial => 'edit', :object => object, :locals => locals
    end
  end

  def update
    object = { :object => Person.find(params[:id]) }
    object[:object].attributes = person_params(params[:person])
    
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

  def destroy
  end

  def ancestry
  end

  private

  def person_params(params)
    params.permit(:given_name, :calling_name, :surname, :sex)
  end

end
