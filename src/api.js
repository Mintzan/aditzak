// Cloudflare Worker endpoint for feedback submissions — see
// docs/technical/CLOUDFLARE_FEEDBACK_WORKER.md. Defaults to the deployed worker;
// override with VITE_FEEDBACK_API_URL for forks or local `wrangler dev`.
// Not a secret — the worker's CORS is locked to ALLOWED_ORIGIN regardless.
export const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACK_API_URL || 'https://aditzak-feedback.inakiibarrola.workers.dev'
// Mirrors the worker's own limits (worker/src/index.js).
export const FEEDBACK_MESSAGE_MAX_LENGTH = 2000
export const FEEDBACK_EMAIL_MAX_LENGTH = 320

// Cloudflare Worker endpoint for the account/sync backend — see
// docs/technical/CLOUDFLARE_SYNC_WORKER.md. Defaults to the deployed worker; override
// with VITE_SYNC_API_URL for forks or local `wrangler dev`.
export const SYNC_API_URL = import.meta.env.VITE_SYNC_API_URL || 'https://aditzak-sync.inakiibarrola.workers.dev'

// `PUT /sync`'s `schemaVersion` — see docs/technical/CLOUDFLARE_SYNC_WORKER.md. The
// backend stores it as-is without validating; reconciling client/server
// schema versions (if this ever needs to change) is the frontend's job.
export const SYNC_SCHEMA_VERSION = 1

// Coalesces the five storage saves a single lesson completion triggers
// (progress/streak/points/errorStats/hearts) into one `PUT /sync`.
export const SYNC_PUSH_DEBOUNCE_MS = 1000

// The five locally-persisted maps, as the shape `/sync` stores/returns.
export function buildSyncPayload({ progress, dailyStreak, points, errorStats, hearts }) {
  return { progress, dailyStreak, points, errorStats, hearts }
}

// `null` means "no cloud snapshot yet" (404).
export async function fetchSyncSnapshot(token) {
  const response = await fetch(`${SYNC_API_URL}/sync`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('sync fetch failed')
  return response.json()
}

export async function pushSyncSnapshot(token, payload) {
  const response = await fetch(`${SYNC_API_URL}/sync`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ payload, schemaVersion: SYNC_SCHEMA_VERSION }),
  })
  if (!response.ok) throw new Error('sync push failed')
}

// Whether this device has anything worth merging on first sign-in — if not,
// there's nothing to lose by adopting the cloud copy wholesale.
export function hasLocalSyncData({ progress, dailyStreak }) {
  return Object.keys(progress ?? {}).length > 0 || Object.keys(dailyStreak ?? {}).length > 0
}
