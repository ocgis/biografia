# frozen_string_literal: true

require 'related'

# Base class for the API level
module Api
  # Base class for the V1 level
  module V1
    # Base class for the V1 of the API controller
    class ApiController < ActionController::Base
      include Related

      # Log user on commit
      before_action :set_paper_trail_whodunnit
      before_action :set_current_user, only: %i[show index examine]

      # Prevent CSRF attacks by raising an exception.
      # For APIs, you may want to use :null_session instead.
      protect_from_forgery with: :exception

      rescue_from CanCan::AccessDenied do
        render status: :unauthorized, json: { error: 'Access denied' }
      end

      def initialize(model)
        super()
        @model = model
      end

      def index
        objects_name = self.class.name.underscore.split('/')[-1].split('_')[..-2].join('_').to_sym

        objects = all_objects
        objects = objects.offset(params[:offset]) unless params[:offset].nil?
        objects = objects.limit(params[:limit]) unless params[:limit].nil?

        r = {}
        r[objects_name] = objects.map(&:all_attributes)
        r[:current_user] = @current_user_hash

        render json: r
      end

      def show
        r = {}
        r[:current_user] = @current_user_hash
        r[controller_name.singularize] = related(controller_name.singularize.camelize, params[:id].to_i)

        render json: r
      end

      def create
        object = create_object
        if object.save
          object_attributes = object.all_attributes
          r = {}
          r[object.class.name.underscore.to_sym] = object_attributes

          render json: r
        else
          render json: { error: 'Object could not be created' }
        end
      end

      def update
        @object = find_object_and_update_attrs
        if @object.save
          object_attributes = @object.all_attributes
          r = {}
          r[@object.class.name.underscore.to_sym] = object_attributes

          merge_ids = params[:merge_ids]
          unless merge_ids.nil?
            merge_objects = merge_ids.map do |merge_id|
              Kernel.const_get(@object.class.name).find(merge_id.to_i)
            end
            @object.merge_references_destroy_others(merge_objects)
          end

          render json: r
        else
          render json: { error: 'Object could not be created' }
        end
      end

      def destroy
        object = find_object
        object.destroy_with_references
        render json: {}
      end

      def examine
        search = @model.where(id: params[:id])
        found =
          if search.length.positive?
            search[0]
          else
            @model.new(id: params[:id])
          end

        object = found
        versions = found.versions.reverse.map do |version|
          r =
            if object.nil?
              {}
            else
              object.all_attributes
            end

          date =
            if object.nil?
              version.created_at
            else
              object.updated_at
            end

          object = version.reify

          r.update(version: { name: User.find(version.whodunnit).name,
                              date: date.strftime('%Y-%m-%d %H:%M'),
                              event: version.event,
                              id: version.id })
        end

        render json: { versions:,
                       current_user: @current_user_hash }
      end

      def hint
        hint = []
        object = controller_name.singularize.camelize.constantize.find(params[:id])
        hint = object.hint if object.respond_to? :hint
        render json: { hint: }
      end

      protected

      def find_by_object_name(object_name)
        a = object_name.split('_')

        raise StandardError, "Not a valid object name: #{object_name}." if a.length != 2

        Kernel.const_get(a[0]).find(a[1].to_i)
      end

      private

      def set_current_user
        @current_user_hash = { name: current_user.name,
                               roles: current_user.roles }
      end
    end
  end
end
