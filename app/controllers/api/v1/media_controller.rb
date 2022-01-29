# frozen_string_literal: false

require 'find'

module Api
  module V1
    # Media API controller
    class MediaController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Medium)
      end

      def search
        path = params[:path] || 'files'

        old_dir = Dir.pwd
        Dir.chdir(Biografia::Application.config.protected_path)
        file_media = Medium.where("file_name LIKE \"#{path}/%\"").pluck('file_name')
        paths = search_dir(path) - file_media
        @nodes = {}

        base_length = path.length + 1
        paths.each do |p|
          parts = p[base_length..].split('/')
          if parts.length == 1 # File
            @nodes[p] = nil
          else
            full = "#{path}/#{parts[0]}"
            if @nodes.key?(full)
              @nodes[full] += 1
            else
              @nodes[full] = 1
            end
          end
        end

        Dir.chdir(old_dir)

        render json: { nodes: @nodes }
      end

      def register
        file_name = params.require(:file_name)
        media = Medium.where(file_name: file_name)
        if media.length >= 1 # Prevent double registration
          render json: { medium: { id: media[0].id } }
        else
          medium = Medium.new(file_name: file_name)
          if medium.save
            medium.handle_extra_info
            render json: { medium: { id: medium.id } }
          else
            render json: { error: 'Could not create medium' }
          end
        end
      end

      protected

      def find_object
        Medium.find(params.require(:id))
      end

      def all_objects
        Medium.all
      end

      private

      def search_dir(path)
        old_dir = Dir.pwd
        Dir.chdir(path)
        files = []
        Find.find('.') do |file|
          re = /^#{Regexp.escape('./')}+/
          file.gsub!(re, '')
          if File.symlink?(file)
            realfile = File.readlink(file)
            if File.directory?(realfile)
              old_dir2 = Dir.pwd
              Dir.chdir(realfile)
              search_dir('.').each do |sfile|
                sfile.gsub!(re, '')
                files.append("#{file}/#{sfile}")
              end
              Dir.chdir(old_dir2)
            else
              files.append(file)
            end
          elsif File.file?(file)
            files.append(file)
          end
        end
        Dir.chdir(old_dir)

        out_files = []
        files.each do |file|
          out_files.append("#{path}/#{file}")
        end

        out_files
      end
    end
  end
end
