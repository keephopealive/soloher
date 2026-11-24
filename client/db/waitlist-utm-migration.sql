-- 2026-11-24: campaign tags (utm_*) saved with each waitlist sign-up.
-- Run once on the existing database (new databases get these columns from waitlist-schema.sql):
--   npx wrangler d1 execute soloher-waitlist --remote --file db/waitlist-utm-migration.sql
ALTER TABLE waitlist ADD COLUMN utm_source   TEXT;
ALTER TABLE waitlist ADD COLUMN utm_medium   TEXT;
ALTER TABLE waitlist ADD COLUMN utm_campaign TEXT;
ALTER TABLE waitlist ADD COLUMN utm_content  TEXT;
