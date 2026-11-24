-- Pre-sale waitlist: one row per email address
CREATE TABLE IF NOT EXISTS waitlist (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT    NOT NULL UNIQUE,
  source          TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  -- Set when the person unsubscribes; cleared if they join again
  unsubscribed_at TEXT,
  -- Campaign tags from the link the person arrived on (see db/waitlist-utm-migration.sql)
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT
);
