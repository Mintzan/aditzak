const STORAGE_KEY = 'aditzak:progress:v1'

// Daily streak data lives under its own key — it tracks calendar-day
// activity across all lessons, not any single lesson's progress, and
// shouldn't need a shape-version bump every time `progress` does (or vice
// versa).
const STREAK_STORAGE_KEY = 'aditzak:streak:v1'

// Points ("gems") earned from lesson results, spendable on streak repair.
// Kept in its own key for the same reasons as the daily streak: it tracks
// something orthogonal to any single lesson's progress, and "Reset progress"
// can clear it without a version bump to `progress`/`STORAGE_KEY`.
//
// v2 (see `pointsStorage` below): a PN-Counter `{ earned, spent }` — each a
// `{ [deviceId]: number }` map — instead of a single mutable `{ balance }`,
// so cross-device sync can merge concurrent earns/spends losslessly (#91).
const POINTS_STORAGE_KEY = 'aditzak:points:v2'
const LEGACY_POINTS_STORAGE_KEY = 'aditzak:points:v1'

// Tracks the verb/tense/person combinations the learner has gotten wrong on
// the first attempt (see `lessonLogic.js`'s `recordErrors`), used to surface
// extra "weak spot" questions in review lessons (`getWeakSpotQuestions`).
// Its own key for the same reasons as the streak/points: orthogonal to any
// single lesson's progress, and "Reset progress" can clear it without a
// version bump to `progress`/`STORAGE_KEY`.
const ERROR_STORAGE_KEY = 'aditzak:errors:v1'

// `progress`/`dailyStreak`/`points`/`errorStats` each live under their own key
// (see above) but share the same read/write shape: a JSON object, defaulting
// to `{}` if missing or unparsable, silently no-oping if localStorage itself
// is unavailable (private browsing, quota).
function createStorage(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : {}
      } catch {
        return {}
      }
    },
    save(value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // localStorage may be unavailable (private browsing, quota) — ignore.
      }
    },
  }
}

export const progressStorage = createStorage(STORAGE_KEY)
export const streakStorage = createStorage(STREAK_STORAGE_KEY)
export const errorStorage = createStorage(ERROR_STORAGE_KEY)

// A random id generated once per device on first use, identifying this
// device's counters in the `points` PN-Counter (see `pointsStorage`,
// `addPoints`/`repairStreak`/`mergePoints` in `lessonLogic.js`).
const DEVICE_ID_STORAGE_KEY = 'aditzak:deviceId:v1'

export function getDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
    if (existing) return existing
    const id = crypto.randomUUID?.() ?? `device-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, id)
    return id
  } catch {
    return 'unknown-device'
  }
}

// Like `createStorage`, but migrates a pre-#91 `v1` `{ balance }` value (if
// no `v2` value exists yet) by attributing the whole balance to this device's
// `earned` counter — so upgrading never loses points.
export const pointsStorage = {
  load() {
    try {
      const raw = localStorage.getItem(POINTS_STORAGE_KEY)
      if (raw) return JSON.parse(raw)
      const legacyRaw = localStorage.getItem(LEGACY_POINTS_STORAGE_KEY)
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw)
        if (typeof legacy?.balance === 'number') {
          return { earned: { [getDeviceId()]: legacy.balance }, spent: {} }
        }
      }
      return {}
    } catch {
      return {}
    }
  },
  save(value) {
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(value))
    } catch {
      // localStorage may be unavailable (private browsing, quota) — ignore.
    }
  },
}

// The signed-in account session (sync-worker bearer token + email), set on a
// successful `/auth/verify` and restored on later loads. Unlike the maps
// above, "missing/invalid" is `null` rather than `{}` — and an expired
// session is treated as missing so a stale token never gets sent.
const SESSION_STORAGE_KEY = 'aditzak:session:v1'

// Mirrors sync-worker's SESSION_TTL_MS (sync-worker/src/session.js) — used to
// compute a local expiry, since `/auth/verify` doesn't return one.
const SESSION_TTL_MS = 60 * 24 * 60 * 60 * 1000

export const accountSessionStorage = {
  load() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return null
      const session = JSON.parse(raw)
      if (!session?.token || !session?.email || !(session.expiresAt > Date.now())) return null
      return session
    } catch {
      return null
    }
  },
  save(session) {
    try {
      if (session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      }
    } catch {
      // localStorage may be unavailable (private browsing, quota) — ignore.
    }
  },
}

export { SESSION_TTL_MS }
