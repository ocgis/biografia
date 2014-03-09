# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140309210123) do

  create_table "addresses", force: true do |t|
    t.string   "street",     limit: 80
    t.string   "town",       limit: 80
    t.string   "zipcode",    limit: 20
    t.string   "parish",     limit: 80
    t.string   "country",    limit: 80
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "addresses_references", id: false, force: true do |t|
    t.integer "address_id"
    t.integer "reference_id"
  end

  create_table "event_dates", force: true do |t|
    t.string   "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "event_dates_references", id: false, force: true do |t|
    t.integer "event_date_id"
    t.integer "reference_id"
  end

  create_table "events", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events_references", id: false, force: true do |t|
    t.integer "event_id"
    t.integer "reference_id"
  end

  create_table "notes", force: true do |t|
    t.string   "title"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notes_references", id: false, force: true do |t|
    t.integer "note_id"
    t.integer "reference_id"
  end

  create_table "people", force: true do |t|
    t.string   "given_name",   limit: 80
    t.string   "calling_name", limit: 80
    t.string   "surname",      limit: 80
    t.string   "sex",          limit: 1
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "people_references", id: false, force: true do |t|
    t.integer "person_id"
    t.integer "reference_id"
  end

  create_table "references", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "references_relationships", id: false, force: true do |t|
    t.integer "reference_id"
    t.integer "relationship_id"
  end

  create_table "relationships", force: true do |t|
    t.text     "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "transfers", force: true do |t|
    t.string   "file_name",    null: false
    t.string   "content_type", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
