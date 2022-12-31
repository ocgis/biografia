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
          objects = latest_referenced(search_models.map(&:name))
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

      def find_object_and_update_attrs
        object = Reference.find(params.require(:id))
        object.attributes = reference_params
        object
      end

      private

      def reference_params
        params.require(:reference).permit(:name,
                                          :type1,
                                          :id1,
                                          :type2,
                                          :id2,
                                          position_in_pictures_attributes:
                                            %i[x y width height])
      end

      def latest_referenced(search_models)
        sids = []
        objects = []
        references = Reference.order(updated_at: :desc).limit(50)
        references.each do |reference|
          [[reference.type1, reference.id1], [reference.type2, reference.id2]].each do |type, id|
            sid = "#{type}_#{id}"
            next if (!search_models.include? type) || (sids.include? sid)

            sids.append(sid)
            objects.append(type.constantize.find(id).all_attributes)
          end
        end
        objects
      end
    end
  end
end
