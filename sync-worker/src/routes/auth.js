import { jsonResponse } from '../cors.js'
import { generateToken, hashToken } from '../crypto.js'
import { createMagicLink, createSession, deleteSession, findMagicLink, findOrCreateUser, hasProgressSnapshot, markMagicLinkUsed } from '../db.js'
import { checkRateLimit } from '../rateLimit.js'
import { sendMagicLinkEmail } from '../email.js'
import { authenticateSession, SESSION_TTL_MS } from '../session.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 320
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}

export async function handleRequestLink(request, env, cors) {
  const body = await readJson(request)
  if (body === undefined) return jsonResponse({ error: 'Invalid JSON body' }, 400, cors)

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: 'A valid email is required' }, 400, cors)
  }

  const db = env.DB
  const now = Date.now()
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'

  // 3/minute and 5/hour, per email and per IP — the per-minute limit allows a
  // few quick retries (typo'd email, resend) without the hourly ceiling
  // giving up on real abuse protection.
  const checks = [
    [`email:m:${email}`, 60_000, 3],
    [`email:h:${email}`, 3_600_000, 5],
    [`ip:m:${ip}`, 60_000, 3],
    [`ip:h:${ip}`, 3_600_000, 5],
  ]

  for (const [key, windowMs, limit] of checks) {
    const result = await checkRateLimit(db, key, windowMs, limit, now)
    if (!result.allowed) {
      const retryAfterSeconds = Math.ceil(result.retryAfterMs / 1000)
      return jsonResponse(
        { error: 'Too many requests, please try again later', retryAfterSeconds },
        429,
        { ...cors, 'Retry-After': String(retryAfterSeconds) },
      )
    }
  }

  const token = generateToken()
  const tokenHash = await hashToken(token)
  await createMagicLink(db, tokenHash, email, now, now + MAGIC_LINK_TTL_MS)

  try {
    await sendMagicLinkEmail(env, email, token)
  } catch {
    return jsonResponse({ error: 'Failed to send sign-in email' }, 502, cors)
  }

  return jsonResponse({ ok: true }, 200, cors)
}

export async function handleVerify(request, env, cors) {
  const body = await readJson(request)
  if (body === undefined) return jsonResponse({ error: 'Invalid JSON body' }, 400, cors)

  const token = typeof body.token === 'string' ? body.token : ''
  if (!token) return jsonResponse({ error: 'token is required' }, 400, cors)

  const db = env.DB
  const now = Date.now()
  const tokenHash = await hashToken(token)
  const magicLink = await findMagicLink(db, tokenHash)

  if (!magicLink || magicLink.used_at != null || magicLink.expires_at <= now) {
    return jsonResponse({ error: 'Invalid or expired link' }, 400, cors)
  }

  await markMagicLinkUsed(db, tokenHash, now)

  const user = await findOrCreateUser(db, magicLink.email, now)
  const sessionToken = generateToken()
  const sessionTokenHash = await hashToken(sessionToken)
  await createSession(db, sessionTokenHash, user.id, now, now + SESSION_TTL_MS)
  const hasCloudData = await hasProgressSnapshot(db, user.id)

  return jsonResponse({ sessionToken, email: user.email, hasCloudData }, 200, cors)
}

export async function handleSignout(request, env, cors) {
  const auth = await authenticateSession(env.DB, request, Date.now())
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401, cors)

  await deleteSession(env.DB, auth.tokenHash)
  return jsonResponse({ ok: true }, 200, cors)
}
