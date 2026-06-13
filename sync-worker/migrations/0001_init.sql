-- Core schema for magic-link auth + cross-device progress sync.
-- See docs/CLOUDFLARE_SYNC_WORKER.md and issue #86 for the overall design.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

-- Single-use magic-link sign-in tokens. Only the hash of the token is
-- stored — the worker never persists the raw token.
CREATE TABLE magic_links (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_magic_links_email ON magic_links(email);

-- Long-lived bearer session tokens (hashed), issued on successful
-- /auth/verify.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- One row per user: the whole-blob progress payload synced from/to the app
-- (progress, dailyStreak, points, errorStats — see src/App.jsx).
CREATE TABLE progress_snapshots (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  schema_version INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
