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

      def create
        media = params.permit(media: %i[file_name id]).require(:media)
        file_names = media.map { |medium| medium[:file_name] }
        existing = Medium.where(file_name: file_names).group_by(&:file_name)
        missing = file_names.reject { |file_name| existing.keys.include? file_name }
        created = Medium.create!(missing.map { |file_name| { file_name: } })
        created.each(&:handle_extra_info)
        all_d = existing.merge(created.group_by(&:file_name))
        all = media.map { |medium| all_d[medium[:file_name]].first }
        render json: { media: all }
      end

      def search
        path = params[:path] || 'files'
        filter = params[:filter] || ''
        show = params[:show] || 'unregistered'
        flatten = params[:flatten] || false

        if File.directory? File.join(Biografia::Application.config.protected_path, path)
          nodes = get_dir_nodes(path, filter, show, flatten)
          render json: { type: 'directory',
                         path:,
                         nodes: }
        else
          info = Medium.info_for(path)
          render json: { type: 'file',
                         path:,
                         info: }
        end
      end

      def info
        path = params[:path]

        info = Medium.info_for(path)
        render json: { path:,
                       info: }
      end

      def register
        file_name = params.require(:file_name)
        media = Medium.where(file_name:)
        if media.length >= 1 # Prevent double registration
          render json: { medium: { id: media[0].id } }
        else
          medium = Medium.new(file_name:)
          if medium.save
            medium.handle_extra_info
            render json: { medium: { id: medium.id } }
          else
            render json: { error: 'Could not create medium' }
          end
        end
      end

      def image
        medium = Medium.find(params.require(:id))
        send_file(medium.fullsize)
      end

      def thumb
        medium = Medium.find(params.require(:id))
        send_file(medium.thumbnail)
      end

      def raw
        medium = Medium.find(params.require(:id))
        send_file(medium.raw)
      end

      def file_image
        file_name = params.require(:file)
        send_file(Medium.fullsize_for(file_name))
      end

      def file_thumb
        file_name = params.require(:file)
        send_file(Medium.thumbnail_for(file_name))
      end

      def file_raw
        file_name = params.require(:file)
        send_file(Medium.raw_for(file_name))
      end

      protected

      def find_object
        Medium.find(params.require(:id))
      end

      def all_objects
        Medium.all
      end

      private

      def get_dir_nodes(path, filter, show, flatten)
        old_dir = Dir.pwd
        Dir.chdir(Biografia::Application.config.protected_path)
        registered_media = Medium.where("file_name LIKE \"#{path}/%\"")
        registered_media_paths = registered_media.pluck('file_name').map(&:b)
        paths =
          case show
          when 'all'
            search_dir(path, filter)
          when 'registered'
            registered_media_paths
          else
            search_dir(path, filter) - registered_media_paths
          end

        nodes = {}

        base_parts = path.split('/')
        paths.each do |p|
          if flatten
            nodes[p] = { children: 0 }
          else
            parts = p.split('/')[base_parts.length..]
            if parts.length == 1 # File
              nodes[p] = { children: 0 }
            else
              full = "#{path}/#{parts[0]}"
              if nodes.key?(full)
                nodes[full][:children] += 1
              else
                nodes[full] = { children: 1 }
              end
            end
          end
        rescue ArgumentError
          puts "Could not handle path #{p[base_length..]}"
        end

        registered_media.each do |registered_medium|
          nodes[registered_medium.file_name][:id] = registered_medium.id if nodes.key? registered_medium.file_name
        end

        Dir.chdir(old_dir)

        nodes
      end

      def search_dir(path, filter)
        if !filter.nil?
          `find -L '#{path}' -name '*#{filter}*' -type f|sort`.b.split("\n")
        else
          `find -L '#{path}' -type f|sort`.b.split("\n")
        end
      end
    end
  end
end
