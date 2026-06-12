/*
  Audit log schema changes:
  - Add structured audit log fields
  - Allow request_id to be nullable so logs can record actions on non-request resources
*/

ALTER TABLE "audit"."logs"
  ADD COLUMN IF NOT EXISTS resource_type varchar,
  ADD COLUMN IF NOT EXISTS resource_id uuid,
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';

ALTER TABLE "audit"."logs"
  ALTER COLUMN request_id DROP NOT NULL;
