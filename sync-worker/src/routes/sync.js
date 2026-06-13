import { jsonResponse } from '../cors.js'
import { getProgressSnapshot, upsertProgressSnapshot } from '../db.js'
import { authenticateSession } from '../session.js'

// Whole-blob progress snapshots are JSON (progress/dailyStreak/points/errorStats
// from src/App.jsx) — 256KB is generous headroom over real-world sizes.
export const MAX_PAYLOAD_BYTES = 256 * 1024

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}

export async function handleGetSync(request, env, cors) {
  const auth = await authenticateSession(env.DB, request, Date.now())
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401, cors)

  const snapshot = await getProgressSnapshot(env.DB, auth.session.user_id)
  if (!snapshot) return jsonResponse({ payload: null }, 404, cors)

  return jsonResponse(
    {
      payload: JSON.parse(snapshot.payload_json),
      schemaVersion: snapshot.schema_version,
      updatedAt: snapshot.updated_at,
    },
    200,
    cors,
  )
}

export async function handlePutSync(request, env, cors) {
  const auth = await authenticateSession(env.DB, request, Date.now())
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401, cors)

  const body = await readJson(request)
  if (body === undefined || typeof body !== 'object' || body === null) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, cors)
  }

  const { payload, schemaVersion } = body
  if (payload === undefined || typeof schemaVersion !== 'number') {
    return jsonResponse({ error: 'payload and schemaVersion are required' }, 400, cors)
  }

  const payloadJson = JSON.stringify(payload)
  if (new TextEncoder().encode(payloadJson).length > MAX_PAYLOAD_BYTES) {
    return jsonResponse({ error: 'Payload too large' }, 413, cors)
  }

  const now = Date.now()
  await upsertProgressSnapshot(env.DB, auth.session.user_id, schemaVersion, payloadJson, now)

  return jsonResponse({ ok: true, updatedAt: now }, 200, cors)
}
