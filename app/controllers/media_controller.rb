# -*- coding: utf-8 -*-

require 'find'

class MediaController < ApplicationController

  def new
  end

  def create
    params.require(:media)
    if params.permit(:location).require(:location) == 'upload' #FIXME: Move permit?
      file_param = params.require(:upload).require(:file_name)
      filedata = file_param.read

      root = Pathname.new(::Rails.root).realpath.to_s
      public = File.join(root, 'public')
      path = File.join(public, params.require(:media).require(:file_name))

      # write the file
      File.open(path, "wb") { |f| f.write(filedata) }      
    end
    
    media = Medium.new(medium_params(params.require(:media)))
    if media.save
      redirect_to :action => 'show', :id => media.id
    else
      render :action => 'new'
    end
  end

  def register
    media = Medium.new(:file_name => params.require(:file_name))
    if media.save
      redirect_to :action => 'show', :id => media.id
    else
      render :action => 'new'
    end
  end
  
  def show
    @object = Medium.find(params.require(:id))
    @mode = params[:mode]
    @file_type = MIME::Types.type_for(@object.file_name)
    related=@object.related_objects
    related[:events].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    related[:relationships].each do |r|
      r.set_extra(:related_objects, r.related_objects)
    end
    @object.set_extra(:related_objects, related)
  end
  
  def search
    old_dir = Dir.pwd
    Dir.chdir('/mnt/Data/home/cg/eclipseprojects/biografia4/public/')
    file_media = Medium.where('file_name LIKE "files/%"').pluck("file_name")
    @files = search_dir("files") - file_media

    @files = @files[0..50]    
    Dir.chdir(old_dir)
  end

  protected

  def all_objects
    Medium.all
  end

  def index_title
    return "Index över mediafiler"
  end

  private

  def medium_params(params)
    return params.permit(:file_name)
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
