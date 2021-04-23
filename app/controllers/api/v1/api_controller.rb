# frozen_string_literal: true

# Base class for the API level
module Api
  # Base class for the V1 level
  module V1
    # Base class for the V1 of the API controller
    class ApiController < ActionController::Base
      # Log user on commit
      before_action :set_paper_trail_whodunnit
      before_action :set_current_user, only: [:show]
      before_action :set_object, only: [:show]

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
        r[objects_name] = all_objects

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
          object_attributes = object.all_attributes
          r = {}
          r[object.class.name.underscore.to_sym] = object_attributes

          render json: r
        else
          render json: { error: 'Object could not be created' }
        end
      end

      private

      def set_current_user
        @current_user_hash = { name: current_user.name,
                               roles: current_user.roles }
      end

      def set_object
        @object = find_object

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
