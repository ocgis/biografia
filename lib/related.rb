# frozen_string_literal: true

# Fetch an object with related objects from the database
module Related
  def related(_type_, id)
    main_ids = [{ _type_:, id: }]
    references_level1 = matching(main_ids)
    ids_level1 = others(main_ids[0], references_level1)

    deep_ids_level1 = ids_level1.select { |object| %w[Event Relationship].include? object[:_type_] }
    references_level2 = matching(deep_ids_level1)

    all_ids = (main_ids + Reference.ids_in_references(references_level1 + references_level2)).uniq

    grouped_ids = all_ids.group_by { |local_id| local_id[:_type_] }

    objects = {}
    grouped_ids.each_key do |local_type|
      local_type_objects = local_type.constantize.with_associations.find(ids(grouped_ids[local_type]))
      local_type_object_attributes = local_type_objects.map do |object|
        if main_ids.include?({ _type_: local_type, id: object.id })
          object.all_attributes
        else
          object.limited_attributes
        end
      end
      local_type_object_attributes.each do |object|
        objects[{ _type_: object[:_type_], id: object['id'] }] = object
      end
    end

    main_objects = main_ids.map { |main_id| objects[main_id].dup }
    assign_related(objects, main_objects, references_level1)
    main_objects.each do |main_object|
      assign_related(objects, main_object[:related][:events], references_level2)
      assign_related(objects, main_object[:related][:relationships], references_level2)
    end

    # TODO: Set version info for main object, like this:
    # @object_attributes[:version] = @object.version_info if @object.respond_to?(:version_info)

    main_objects[0]
  end

  private

  def matching(list)
    string_list = list.map { |item| "#{item[:_type_]}_#{item[:id]}" }
    Reference.where('(CONCAT(type1, \'_\', id1) in (?)) OR (CONCAT(type2, \'_\', id2) in (?))',
                    string_list, string_list)
  end

  def others(object, references)
    references.filter_map { |reference| other(object, reference) }
  end

  def other(object, reference)
    if object[:_type_] == reference.type1 && object[:id] == reference.id1
      { _type_: reference.type2, id: reference.id2 }
    elsif object[:_type_] == reference.type2 && object[:id] == reference.id2
      { _type_: reference.type1, id: reference.id1 }
    end
  end

  def ids(id_list)
    id_list.map do |elem|
      elem[:id]
    end
  end

  def assign_related(objects, main_objects, references)
    main_objects.each do |main_object|
      main_object[:related] = {
        addresses: [],
        establishments: [],
        event_dates: [],
        events: [],
        media: [],
        notes: [],
        people: [],
        relationships: [],
        things: []
      }

      references.each do |reference|
        referenced_id = other({ id: main_object['id'], _type_: main_object[:_type_] }, reference)
        next if referenced_id.nil?

        referenced_object = objects[referenced_id].dup
        referenced_object[:reference] = reference
        main_object[:related][referenced_id[:_type_].pluralize.underscore.to_sym].append(referenced_object)
      end
    end
  end
end
