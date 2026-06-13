// Thin wrappers around D1 queries. Kept free of request/response concerns so
// route handlers (src/routes/*) stay readable and these can be unit tested
// against test/d1.js's SQLite-backed fake D1.

export async function findUserByEmail(db, email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
}

export async function findOrCreateUser(db, email, now) {
  const existing = await findUserByEmail(db, email)
  if (existing) return existing
  const id = crypto.randomUUID()
  await db.prepare('INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)').bind(id, email, now).run()
  return { id, email, created_at: now }
}

export async function createMagicLink(db, tokenHash, email, now, expiresAt) {
  await db
    .prepare('INSERT INTO magic_links (token_hash, email, expires_at, used_at, created_at) VALUES (?, ?, ?, NULL, ?)')
    .bind(tokenHash, email, expiresAt, now)
    .run()
}

export async function findMagicLink(db, tokenHash) {
  return db.prepare('SELECT * FROM magic_links WHERE token_hash = ?').bind(tokenHash).first()
}

export async function markMagicLinkUsed(db, tokenHash, now) {
  await db.prepare('UPDATE magic_links SET used_at = ? WHERE token_hash = ?').bind(now, tokenHash).run()
}

export async function createSession(db, tokenHash, userId, now, expiresAt) {
  await db
    .prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)')
    .bind(tokenHash, userId, now, expiresAt, now)
    .run()
}

export async function findSession(db, tokenHash) {
  return db.prepare('SELECT * FROM sessions WHERE token_hash = ?').bind(tokenHash).first()
}

export async function touchSession(db, tokenHash, now) {
  await db.prepare('UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?').bind(now, tokenHash).run()
}

export async function deleteSession(db, tokenHash) {
  await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run()
}

export async function hasProgressSnapshot(db, userId) {
  const row = await db.prepare('SELECT user_id FROM progress_snapshots WHERE user_id = ?').bind(userId).first()
  return row != null
}

export async function getProgressSnapshot(db, userId) {
  return db
    .prepare('SELECT schema_version, payload_json, updated_at FROM progress_snapshots WHERE user_id = ?')
    .bind(userId)
    .first()
}

export async function upsertProgressSnapshot(db, userId, schemaVersion, payloadJson, now) {
  await db
    .prepare(
      `INSERT INTO progress_snapshots (user_id, schema_version, payload_json, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         schema_version = excluded.schema_version,
         payload_json = excluded.payload_json,
         updated_at = excluded.updated_at`,
    )
    .bind(userId, schemaVersion, payloadJson, now)
    .run()
}
