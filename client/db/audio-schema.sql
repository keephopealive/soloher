-- On/off switch for each audio story (set from /admin). A story with no row is on.
-- The admin function also creates this table the first time a story is switched, so running this by hand is optional.
CREATE TABLE IF NOT EXISTS audio_settings (
  slug       TEXT PRIMARY KEY,
  enabled    INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
