# frozen_string_literal: true

module Api
  module V1
    # References API controller
    class ReferencesController < Api::V1::ApiController
      layout false

      load_and_authorize_resource

      def list
        filter = params.require(:q)
        search_models =
          if params[:searchModel].nil?
            [Person, Event, Address, Thing]
          else
            # FIXME: Check that model is allowed for search
            [params[:searchModel].constantize]
          end

        filters = filter.split(' ')

        found = []
        search_models.each do |search_model|
          found += search_model.filtered_search(filters)
        end
        objects = found.collect do |f|
          {
            value: f.decorate.one_line,
            key: {
              type_: f.class.name,
              id: f.id
            }
          }
        end

        params[:ignoreName].nil? ||
          objects.reject! { |object| object[:value] == params[:ignoreName] }

        render json: { result: objects }
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
                                          position_in_picture_attributes:
                                            %i[x y w h])
      end
    end
  end
end
