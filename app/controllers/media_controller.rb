# -*- coding: utf-8 -*-
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

  def show
    @media = Medium.find(params.require(:id))
    @mode = params[:mode]
    @file_type = MIME::Types.type_for(@media.file_name)
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

end
