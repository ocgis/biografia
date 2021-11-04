# frozen_string_literal: true

# Base class for the API level
module Api
  # Base class for the V1 level
  module V1
    # Base class for the V1 of the API controller
    class ApiController < ActionController::Base
      # Log user on commit
      before_action :set_paper_trail_whodunnit
      before_action :set_current_user, only: %i[show index]
      before_action :set_object, only: [:show]
      before_action :set_object_attributes, only: [:show]

      # Prevent CSRF attacks by raising an exception.
      # For APIs, you may want to use :null_session instead.
      protect_from_forgery with: :exception

      # FIXME: Don't redirect
      rescue_from CanCan::AccessDenied do |exception|
        redirect_to root_url, alert: exception.message
      end

      def index
        objects_name = self.class.name.underscore.split('/')[-1].split('_')[..-2].join('_').to_sym

        r = {}
        r[objects_name] = all_objects.map(&:all_attributes)
        r[:current_user] = @current_user_hash

        render json: r
      end

      def show
        r = {}
        r[@object.class.name.underscore.to_sym] = @object_attributes
        r[:options] = { topName: @object.object_name,
                        showFull: true,
                        enclosedById: false,
                        showModifier: true }
        r[:current_user] = @current_user_hash

        render json: r
      end

      def create
        object = create_object
        if object.save
          refer_from = params[:referFrom]
          unless refer_from.nil?
            refer_from_object = find_by_object_name("#{refer_from[:type_]}_#{refer_from[:id]}")
            refer_from_object.add_reference(object)
          end
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
          render json: {}
        else
          render json: { error: 'Object could not be created' }
        end
      end

      protected

      def find_by_object_name(object_name)
        a = object_name.split('_')
        if a.length != 2
          raise StandardError, "Not a valid object name: #{object_name}."
        end
        Kernel.const_get(a[0]).find(a[1].to_i)
      end

      private

      def set_current_user
        @current_user_hash = { name: current_user.name,
                               roles: current_user.roles }
      end

      def set_object
        @object = find_object
      end

      def set_object_attributes
        @object_attributes = @object.all_attributes
        @object_attributes.update({ version: @object.version_info,
                                    related: fetch_related_attributes(@object.related_objects,
                                                                      %i[events relationships]) })
      end

      def fetch_related_attributes(related_objects, deep_keys)
        related_attributes = {}

        related_objects.each do |key, objects|
          next if key == :object

          related_attributes[key] = objects.map do |object|
            object_attributes = object.all_attributes
            object_attributes.update({ version: object.version_info })

            if deep_keys.include? key
              object_attributes.update({ related: fetch_related_attributes(object.related_objects, []) })
            end

            object_attributes
          end
        end

        related_attributes
      end
    end
  end
end
