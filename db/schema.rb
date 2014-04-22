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

ActiveRecord::Schema.define(version: 20140421194027) do

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

  add_index "addresses_references", ["address_id"], name: "address_id_ix", using: :btree
  add_index "addresses_references", ["reference_id"], name: "reference_id_ix", using: :btree

  create_table "event_dates", force: true do |t|
    t.string   "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "event_dates_references", id: false, force: true do |t|
    t.integer "event_date_id"
    t.integer "reference_id"
  end

  add_index "event_dates_references", ["event_date_id"], name: "event_date_id_ix", using: :btree
  add_index "event_dates_references", ["reference_id"], name: "reference_id_ix", using: :btree

  create_table "events", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events_references", id: false, force: true do |t|
    t.integer "event_id"
    t.integer "reference_id"
  end

  add_index "events_references", ["event_id"], name: "event_id_ix", using: :btree
  add_index "events_references", ["reference_id"], name: "reference_id_ix", using: :btree

  create_table "gagjoa", id: false, force: true do |t|
    t.float  "p",        limit: 255
    t.string "fktabell", limit: 1
    t.float  "r",        limit: 255
    t.text   "anmtext",  limit: 2147483647
    t.string "typ",      limit: 1
    t.string "status",   limit: 1
  end

  create_table "gagjoc", id: false, force: true do |t|
    t.float  "p",         limit: 255
    t.string "fktabell",  limit: 1
    t.float  "r",         limit: 255
    t.string "fktabell2", limit: 1
    t.string "fkfalt",    limit: 10
    t.float  "notnr",     limit: 255
    t.float  "k",         limit: 255
    t.string "citat",     limit: 80
    t.string "url",       limit: 80
    t.string "anm",       limit: 80
    t.string "typ",       limit: 1
    t.string "status",    limit: 1
  end

  create_table "gagjok", id: false, force: true do |t|
    t.float  "k",        limit: 255
    t.float  "a",        limit: 255
    t.string "titel"
    t.string "korttext", limit: 30
    t.string "namn"
    t.string "utgivare"
    t.string "startdat", limit: 20
    t.string "slutdat",  limit: 20
    t.string "refkod"
    t.string "url"
    t.string "anm"
    t.string "regtid"
    t.string "upptid"
    t.float  "dbid",     limit: 255
    t.float  "regid",    limit: 255
    t.float  "uppid",    limit: 255
    t.string "typ",      limit: 1
    t.string "status",   limit: 1
  end

  create_table "gagjom", id: false, force: true do |t|
    t.float  "p",         limit: 255
    t.string "fktabell",  limit: 1
    t.float  "r",         limit: 255
    t.string "medianamn"
    t.string "filnamn"
    t.float  "hojd",      limit: 255
    t.float  "bredd",     limit: 255
    t.string "cantavla",  limit: 1
    t.string "canlista",  limit: 1
    t.string "cansedel",  limit: 1
    t.string "cstamgraf", limit: 1
    t.string "chtml",     limit: 1
    t.string "cextra",    limit: 1
    t.float  "nantavla",  limit: 255
    t.float  "nanlista",  limit: 255
    t.float  "nansedel",  limit: 255
    t.float  "nstamgraf", limit: 255
    t.float  "nhtml",     limit: 255
    t.float  "nextra",    limit: 255
    t.string "mextra",    limit: 10
    t.text   "mediatext", limit: 2147483647
    t.string "typ",       limit: 1
    t.string "status",    limit: 1
  end

  create_table "gagjop", id: false, force: true do |t|
    t.float  "p",         limit: 255
    t.float  "f",         limit: 255
    t.float  "m",         limit: 255
    t.string "fornamn",   limit: 80
    t.string "patronym",  limit: 80
    t.string "efternamn", limit: 80
    t.string "kon",       limit: 1
    t.string "fodat",     limit: 20
    t.string "dopdat",    limit: 20
    t.string "fodort",    limit: 80
    t.string "fodfs",     limit: 80
    t.string "dodat",     limit: 20
    t.string "begdat",    limit: 20
    t.string "dodort",    limit: 80
    t.string "dodfs",     limit: 80
    t.string "dodors",    limit: 80
    t.string "yrke",      limit: 80
    t.string "hemort",    limit: 80
    t.string "hemfs",     limit: 80
    t.string "anm1",      limit: 80
    t.string "anm2",      limit: 80
    t.string "ttnamn",    limit: 1
    t.string "eenamn",    limit: 1
    t.string "dopkod",    limit: 1
    t.string "begkod",    limit: 1
    t.string "konkod",    limit: 1
    t.string "markering", limit: 80
    t.string "sortfalt",  limit: 20
    t.string "regtid"
    t.string "upptid"
    t.float  "dbid",      limit: 255
    t.float  "regid",     limit: 255
    t.float  "uppid",     limit: 255
    t.string "typ",       limit: 1
    t.string "status",    limit: 1
  end

  create_table "gagjov", id: false, force: true do |t|
    t.float  "v",        limit: 255
    t.float  "f",        limit: 255
    t.float  "m",        limit: 255
    t.float  "p",        limit: 255
    t.string "vigdat",   limit: 20
    t.string "vigort",   limit: 80
    t.string "vigfs",    limit: 80
    t.string "slutdat",  limit: 20
    t.string "anm",      limit: 80
    t.float  "eventtyp", limit: 255
    t.string "typ",      limit: 1
    t.string "status",   limit: 1
  end

  create_table "media", force: true do |t|
    t.text     "file_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "media_references", id: false, force: true do |t|
    t.integer "medium_id"
    t.integer "reference_id"
  end

  add_index "media_references", ["medium_id"], name: "medium_id_ix", using: :btree
  add_index "media_references", ["reference_id"], name: "reference_id_ix", using: :btree

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

  add_index "notes_references", ["note_id"], name: "note_id_ix", using: :btree
  add_index "notes_references", ["reference_id"], name: "reference_id_ix", using: :btree

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

  add_index "people_references", ["person_id"], name: "person_id_ix", using: :btree
  add_index "people_references", ["reference_id"], name: "reference_id_ix", using: :btree

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
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "references_relationships", id: false, force: true do |t|
    t.integer "reference_id"
    t.integer "relationship_id"
  end

  add_index "references_relationships", ["reference_id"], name: "reference_id_ix", using: :btree
  add_index "references_relationships", ["relationship_id"], name: "relationship_id_ix", using: :btree

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
