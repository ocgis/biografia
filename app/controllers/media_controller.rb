# -*- coding: utf-8 -*-

require 'find'

class MediaController < ApplicationController

  load_and_authorize_resource

  def new
  end

  def create
    params.require(:media)
    if params.permit(:location).require(:location) == 'upload' #FIXME: Move permit?
      file_param = params.require(:upload).require(:file_name)
      filedata = file_param.read

      path = File.join(Biografia::Application.config.protected_path, params.require(:media).require(:file_name))

      # write the file
      File.open(path, "wb") { |f| f.write(filedata) }      
    end
    
    medium = Medium.new(medium_params)
    if medium.save
      handle_extra_info(medium)
      redirect_to :action => 'show', :id => medium.id
    else
      render :action => 'new'
    end
  end

  def register
    medium = Medium.new(:file_name => params.require(:file_name))
    if medium.save
      handle_extra_info(medium)
      redirect_to :action => 'show', :id => medium.id
    else
      render :action => 'new'
    end
  end
  
  def show
    @object = find_object
    @mode = params[:mode]
    related=@object.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    @object.set_extra(:related_objects, related)
  end
  
  def tag
    object = Medium.find(params.require(:id))
    locals = {}
    respond_to do |format|
      format.js { render "replace_html", :locals => { :object => object, :locals => locals, :partial => 'tag', :replaceElem => "modal_dialog", :hideElem => params[:hideElem] } }
    end
  end

  def search
    if params[:path]
      path = params[:path]
    else
      path = 'files'
    end

    old_dir = Dir.pwd
    Dir.chdir(Biografia::Application.config.protected_path)
    file_media = Medium.where("file_name LIKE \"#{path}/%\"").pluck("file_name")
    paths = search_dir(path) - file_media
    @nodes = {}

    base_length = path.length + 1
    paths.each do |p|
      parts = p[base_length..-1].split('/')
      if parts.length == 1 # File
        @nodes[p] = nil
      else
        full = path + '/' + parts[0]
        if @nodes.key?(full)
          @nodes[full] += 1
        else
          @nodes[full] = 1
        end
      end
    end

    Dir.chdir(old_dir)
  end

  def image
    medium = Medium.find(params.require(:id))
    send_file(medium.get_fullsize)
  end

  def thumb
    medium = Medium.find(params.require(:id))
    send_file(medium.get_thumbnail)
  end

  def file_thumb
    file_name = params.require(:file)
    send_file(Medium.get_thumbnail_for(file_name))
  end

  protected

  def all_objects
    Medium.all
  end

  def find_object
    medium = Medium.find(params.require(:id))
    return medium
  end

  def index_title
    return "Index över mediafiler"
  end

  private

  def medium_params
    return params.require(:media).permit(:file_name)
  end

  def handle_extra_info(medium)
    puts "Medium extra info:\n#{medium.extra_info.pretty_inspect}"
    extra_info = medium.extra_info

    if extra_info.key?(:image_description)
      puts "Add description:\n#{extra_info[:image_description]}"
      note = Note.create_save(note: extra_info[:image_description])
      medium.add_reference(note)
    end
  end

  def search_dir(path)
    old_dir = Dir.pwd
    Dir.chdir(path)
    files = []
    Find.find('.') { |file|
      re = /^#{Regexp.escape('./')}+/
      file.gsub!(re, '')
      if File.symlink?(file)
        realfile = File.readlink(file)
        if File.directory?(realfile)
          old_dir_2 = Dir.pwd
          Dir.chdir(realfile)
          search_dir('.').each do |sfile|
            sfile.gsub!(re, '')
            files.append(file+'/'+sfile)
          end
          Dir.chdir(old_dir_2)
        else
          files.append(file)
        end
      elsif File.file?(file)
        files.append(file)
      end
    }
    Dir.chdir(old_dir)
    
    out_files = []
    files.each do |file|
      out_files.append(path+'/'+file)  
    end
    
    return out_files
  end
end
