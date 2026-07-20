# Database Schema

Last Updated: July 18, 2026

---

# Database

SQLite

Offline-first

---

## Table: projects

Purpose

Represents one progress project.

Examples

Kitchen Remodel

Garden 2026

Puppy

Fitness Journey

Fields

id

UUID

Primary Key

---

name

TEXT

Required

---

cover_photo_uri

TEXT

Nullable

---

created_at

DATETIME

---

updated_at

DATETIME

---

archived

BOOLEAN

Default false

---

## Table: photos

Purpose

Stores every captured photo.

Fields

id

UUID

Primary Key

---

project_id

Foreign Key

References Projects

---

image_uri

TEXT

Local file path

---

thumbnail_uri

TEXT

Generated locally

---

taken_at

DATETIME

---

note

TEXT

Optional

---

sequence_number

INTEGER

Represents progress order

---

latitude

REAL

Optional

---

longitude

REAL

Optional

---

heading

REAL

Compass direction

Future alignment

---

pitch

REAL

Future

---

roll

REAL

Future

---

camera_metadata

JSON

Reserved for future features

---

## Table: settings

Purpose

Application settings

Fields

ghost_opacity

REAL

Default 0.5

---

theme

TEXT

system/light/dark

---

grid_enabled

BOOLEAN

---

show_level_indicator

BOOLEAN

---

haptics_enabled

BOOLEAN

---

## Relationships

One Project

↓

Many Photos

Projects (1)

↓

Photos (Many)

---

# Future Tables

Cloud Sync

Users

Shared Projects

Comments

Albums

Exports

Subscriptions

Analytics

---

# Deletion Rules

Deleting a project:

Delete all associated photos.

Delete image files from local storage.

Delete thumbnails.

No orphaned records.

---

# Backups

Not supported in MVP.

Future versions may support cloud backup.

---

# Database Versioning

Use migrations.

Never modify production tables directly.

Increment schema version with every change.