// Fixed-window rate limiting backed by the `rate_limits` table. Returns
// `{ allowed: true }` and records the request if `key` is still under
// `limit` within the last `windowMs`, or `{ allowed: false, retryAfterMs }`
// (leaving the counter untouched) if the limit has been reached —
// `retryAfterMs` is how long until the current window resets.
export async function checkRateLimit(db, key, windowMs, limit, now) {
  const row = await db.prepare('SELECT window_start, count FROM rate_limits WHERE key = ?').bind(key).first()

  if (!row || now - row.window_start >= windowMs) {
    await db
      .prepare('INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET window_start = ?, count = 1')
      .bind(key, now, now)
      .run()
    return { allowed: true }
  }

  if (row.count >= limit) return { allowed: false, retryAfterMs: windowMs - (now - row.window_start) }

  await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run()
  return { allowed: true }
}
