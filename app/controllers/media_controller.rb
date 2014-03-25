# -*- coding: utf-8 -*-
class MediaController < ApplicationController

  def new
  end

  def create
    if params[:location] == 'upload'
      file_param = params[:upload][:file_name]
      filedata = file_param.read

      root = Pathname.new(::Rails.root).realpath.to_s
      public = File.join(root, 'public')
      path = File.join(public, params[:media][:file_name])

      # write the file
      File.open(path, "wb") { |f| f.write(filedata) }      
    end
    
    media = Medium.new(medium_params(params[:media]))
    if media.save
      redirect_to :action => 'display', :id => media.id
    else
      render :action => 'new'
    end
  end

  def show
    @media = Medium.find(params[:id])
    @mode = params[:mode]
    @file_type = MIME::Types.type_for(@media.file_name)
  end

  def edit
    #FIXME: Implement
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
    params.permit(:file_name)
  end

end
