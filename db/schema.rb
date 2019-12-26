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

ActiveRecord::Schema.define(version: 20150709111608) do

  create_table "addresses", force: :cascade do |t|
    t.string   "street",     limit: 80
    t.string   "town",       limit: 80
    t.string   "zipcode",    limit: 20
    t.string   "parish",     limit: 80
    t.string   "country",    limit: 80
    t.string   "source",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "latitude",   limit: 24
    t.float    "longitude",  limit: 24
  end

  create_table "event_dates", force: :cascade do |t|
    t.datetime "date"
    t.string   "mask",       limit: 255
    t.string   "source",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "source",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "exports", force: :cascade do |t|
    t.string   "file_name",    limit: 255,                   null: false
    t.string   "content_type", limit: 255,                   null: false
    t.string   "status",       limit: 1024, default: "INIT"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "identities", force: :cascade do |t|
    t.string   "name",            limit: 255
    t.string   "email",           limit: 255
    t.string   "password_digest", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "imports", force: :cascade do |t|
    t.string   "file_name",    limit: 255,                   null: false
    t.string   "content_type", limit: 255,                   null: false
    t.string   "status",       limit: 1024, default: "INIT"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "media", force: :cascade do |t|
    t.text     "file_name",  limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notes", force: :cascade do |t|
    t.string   "category",   limit: 255
    t.string   "title",      limit: 255
    t.text     "note",       limit: 65535
    t.string   "source",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "people", force: :cascade do |t|
    t.string   "sex",        limit: 1
    t.string   "source",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "person_names", force: :cascade do |t|
    t.integer  "position",     limit: 4
    t.string   "given_name",   limit: 80
    t.string   "calling_name", limit: 80
    t.string   "surname",      limit: 80
    t.integer  "person_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "position_in_pictures", force: :cascade do |t|
    t.float    "x",            limit: 24
    t.float    "y",            limit: 24
    t.float    "width",        limit: 24
    t.float    "height",       limit: 24
    t.integer  "reference_id", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "references", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "type1",      limit: 255, null: false
    t.integer  "id1",        limit: 4,   null: false
    t.string   "type2",      limit: 255, null: false
    t.integer  "id2",        limit: 4,   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "references", ["type1", "id1"], name: "index_references_on_type1_and_id1", using: :btree
  add_index "references", ["type2", "id2"], name: "index_references_on_type2_and_id2", using: :btree

  create_table "relationships", force: :cascade do |t|
    t.text     "name",       limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "things", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "kind",       limit: 255
    t.string   "make",       limit: 255
    t.string   "model",      limit: 255
    t.string   "serial",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "transfers", force: :cascade do |t|
    t.string   "file_name",    limit: 255, null: false
    t.string   "content_type", limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "provider",         limit: 255
    t.string   "uid",              limit: 255
    t.string   "name",             limit: 255
    t.string   "oauth_token",      limit: 255
    t.datetime "oauth_expires_at"
    t.integer  "roles_mask",       limit: 4,   default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "home_object_name", limit: 255
  end

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",  limit: 255,   null: false
    t.integer  "item_id",    limit: 4,     null: false
    t.string   "event",      limit: 255,   null: false
    t.string   "whodunnit",  limit: 255
    t.text     "object",     limit: 65535
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

end
