# frozen_string_literal: true

module Api
  module V1
    # References API controller
    class ReferencesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def initialize
        super(Reference)
      end

      def list
        search_models =
          if params[:searchModel].nil?
            [Person, Event, Address, Thing]
          else
            # FIXME: Check that model is allowed for search
            [params[:searchModel].constantize]
          end

        if params[:q].present?
          filter = params.require(:q)
          filters = filter.split(' ')

          found = []
          search_models.each do |search_model|
            found += search_model.filtered_search(filters)
          end
          objects = found.collect(&:all_attributes)

          params[:ignoreName].nil? ||
            objects.reject! { |object| object[:value] == params[:ignoreName] }
        else
          ids = []
          objects = []
          references = Reference.order(updated_at: :desc).limit(30)
          references.each do |reference|
            id = "#{reference.type1}_#{reference.id1}"
            unless ids.include? id
              ids.append(id)
              objects.append(reference.type1.constantize.find(reference.id1).all_attributes)
            end
            id = "#{reference.type2}_#{reference.id2}"
            unless ids.include? id
              ids.append(id)
              objects.append(reference.type2.constantize.find(reference.id2).all_attributes)
            end
          end
        end
        render json: { result: objects }
      end

      def destroy
        reference = Reference.find(params[:id])
        reference.position_in_pictures.destroy_all
        reference.destroy

        render json: { reference: {} }
      end

      protected

      def create_object
        Reference.new(reference_params)
      end

      private

      def reference_params
        params.require(:reference).permit(:type1,
                                          :id1,
                                          :type2,
                                          :id2,
                                          position_in_pictures_attributes:
                                            %i[x y width height])
      end
    end
  end
end
