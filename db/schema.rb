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

ActiveRecord::Schema.define(version: 20140313144126) do

  create_table "addresses", force: true do |t|
    t.string   "street",     limit: 80
    t.string   "town",       limit: 80
    t.string   "zipcode",    limit: 20
    t.string   "parish",     limit: 80
    t.string   "country",    limit: 80
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "event_dates", force: true do |t|
    t.datetime "date"
    t.string   "mask"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "media", force: true do |t|
    t.text     "file_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notes", force: true do |t|
    t.string   "title"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "people", force: true do |t|
    t.string   "given_name",   limit: 80
    t.string   "calling_name", limit: 80
    t.string   "surname",      limit: 80
    t.string   "sex",          limit: 1
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "position_in_pictures", force: true do |t|
    t.float    "x"
    t.float    "y"
    t.float    "width"
    t.float    "height"
    t.integer  "reference_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "references", force: true do |t|
    t.string   "name"
    t.string   "type1",      null: false
    t.integer  "id1",        null: false
    t.string   "type2",      null: false
    t.integer  "id2",        null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "references", ["type1", "id1"], name: "index_references_on_type1_and_id1", using: :btree
  add_index "references", ["type2", "id2"], name: "index_references_on_type2_and_id2", using: :btree

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
