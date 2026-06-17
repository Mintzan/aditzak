import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  addPoints,
  buildFlagDiagnostics,
  canRepairStreak,
  computeLessonPoints,
  computeStars,
  exerciseReducer,
  generateCaseMixerQuestions,
  generateCrossVerbQuestions,
  generateMatchPairsQuestions,
  generateQuestions,
  generateReadingQuestions,
  getActiveStreak,
  getCrossVerbCandidates,
  getExplanation,
  getEncouragement,
  getFixedArgument,
  getIntroducedSources,
  getLastPlayedLessonId,
  getLocalDateString,
  getPointsBalance,
  pickEncouragementVariantIndex,
  getStreakEncouragement,
  getUnlockedLessonIds,
  getWeakSpotQuestions,
  isAnswerCorrect,
  isLockedByGateScore,
  mergeSyncPayload,
  recordDailyStreak,
  recordErrors,
  recordResult,
  repairStreak,
  shuffle,
  STREAK_REPAIR_COST,
} from './lessonLogic'
import { GATE_LESSON_IDS, JOURNEY } from './journey'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { trackEvent } from './analytics'
import { getShareUrl, shareContent } from './shareUtils'
import { vibrateCorrect, vibrateIncorrect, vibrateResult } from './hapticsUtils'
import { VERBS, TENSE_META, TYPE_META, AGREEMENT_META, DIALECT_LABELS, PERSON_LABEL_KEYS } from './data/verbs'
import { LESSONS } from './data/lessons'
import { READING_ITEMS } from './data/readingItems'

// =============================================================================
// Section index (approximate line ranges — grep for the banner text below to
// jump straight to a section; ranges shift as the file changes):
//   ~46    Progress persistence (localStorage)
//   ~256   Small shared bits
//   ~346   Home screen — lesson selection
//   ~1336  Exercise screen — multiple choice and typed-answer questions
//   ~2140  App shell
// =============================================================================

// =============================================================================
// Progress persistence (localStorage)
// =============================================================================

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

const progressStorage = createStorage(STORAGE_KEY)
const streakStorage = createStorage(STREAK_STORAGE_KEY)
const errorStorage = createStorage(ERROR_STORAGE_KEY)

// A random id generated once per device on first use, identifying this
// device's counters in the `points` PN-Counter (see `pointsStorage`,
// `addPoints`/`repairStreak`/`mergePoints` in `lessonLogic.js`).
const DEVICE_ID_STORAGE_KEY = 'aditzak:deviceId:v1'

function getDeviceId() {
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
const pointsStorage = {
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

const accountSessionStorage = {
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

// Looks up a verb's English/Spanish/Basque gloss, falling back to English if
// the active interface language has no translation for this verb.
function verbMeaning(verb, language) {
  return verb.meaning[language] ?? verb.meaning.en
}

// Display copy for a lesson card/row, covering both practice and review
// shapes so `LessonNode`/`ProgressTab`/`LessonResultsScreen` don't each need
// their own branching. `title`/`subtitle` are `{ main, secondary }` pairs —
// mirroring the two-tone "label · detail" layout `LessonNode` already used
// for practice lessons (e.g. "Present · oraina" / "izan — to be") — and
// `heading` is the single-line form `ProgressTab` shows in its flat list.
// Takes `t`/`language` from the caller's `useLanguage()` since this is a
// plain function, not a component.
// Lessons restricted to a `persons` subset (`PHASE_1_PERSONS`/
// `PHASE_1_PLURAL_PERSONS`, see above) show which grammatical persons they
// drill, as literal Basque pronouns — language-independent, like
// `TENSE_META`'s `basque` field.
function personsLabel(persons) {
  return persons?.join('/')
}

function describeLesson(lesson, t, language) {
  const persons = personsLabel(lesson.persons)
  const recognitionOnly = lesson.mode === 'recognition'
  if (lesson.kind === 'reading') {
    return {
      icon: '📖',
      title: { main: t('readingLessonTitle'), secondary: t('readingLessonTag') },
      subtitle: { main: t('readingLessonTag'), secondary: t('readingLessonSubtitle') },
      heading: t('readingLessonTitle'),
      recognitionOnly,
    }
  }
  if (lesson.verbId) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    const meta = TENSE_META[lesson.tense]
    const label = t(meta.labelKey)
    return {
      icon: label[0],
      title: { main: label, secondary: persons ? `${meta.basque} · ${persons}` : meta.basque },
      subtitle: { main: verb.verb, secondary: verbMeaning(verb, language) },
      heading: persons ? `${verb.verb} · ${label} (${persons})` : `${verb.verb} · ${label}`,
      recognitionOnly,
      fixedArgument: getFixedArgument(verb),
    }
  }
  const verbNames = [...new Set(lesson.sources.map(({ verbId }) => VERBS.find((v) => v.id === verbId).verb))]
  const tenseLabels = [...new Set(lesson.sources.map(({ tense }) => t(TENSE_META[tense].labelKey)))]
  const tenseLabel = tenseLabels.join(' + ')
  if (!lesson.review) {
    const meta = TENSE_META[lesson.sources[0].tense]
    return {
      icon: tenseLabel[0],
      title: { main: tenseLabel, secondary: persons ? `${meta.basque} · ${persons}` : meta.basque },
      subtitle: { main: verbNames.join(' & '), secondary: t('mixedPractice') },
      heading: persons ? `${verbNames.join(' & ')} · ${tenseLabel} (${persons})` : `${verbNames.join(' & ')} · ${tenseLabel}`,
      recognitionOnly,
    }
  }
  const reviewName = verbNames.length > 1 ? t('mixedReview') : t('verbReview', { verb: verbNames[0] })
  return {
    icon: '🔁',
    title: { main: t('reviewLabel'), secondary: persons ? `${tenseLabel} · ${persons}` : tenseLabel },
    subtitle: { main: verbNames.join(' & '), secondary: t('mixedPractice') },
    heading: persons ? `${reviewName} · ${tenseLabel} (${persons})` : `${reviewName} · ${tenseLabel}`,
    recognitionOnly,
  }
}

// =============================================================================
// Small shared bits
// =============================================================================

function TypeBadge({ type }) {
  const { t } = useLanguage()
  const meta = TYPE_META[type]
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {t(meta.labelKey)} · {meta.basqueLabel}
    </span>
  )
}

function AgreementBadge({ role }) {
  const { t } = useLanguage()
  const meta = AGREEMENT_META[role]
  return (
    <span title={t(meta.titleKey)} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {meta.label}
    </span>
  )
}

// For a NOR-NORI-NORK lesson (#142), shows which argument is fixed for this
// lesson/question — e.g. "NORI: hura" for `recipient: 'hura'` (every form
// means "... to him/her") or "NORK: ni" for `agent: 'ni'` (every form means
// "I ..."). `fixedArgument` is `getFixedArgument(verb)`'s `{ role, person }`
// result; renders nothing for the `null` every non-ditransitive verb returns.
function FixedArgumentBadge({ fixedArgument }) {
  const { t } = useLanguage()
  if (!fixedArgument) return null
  const { role, person } = fixedArgument
  return (
    <span title={t('fixedArgumentTitle')} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${AGREEMENT_META[role].className}`}>
      {AGREEMENT_META[role].label}: {t(PERSON_LABEL_KEYS[person])}
    </span>
  )
}

function DialectBadge({ dialect }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-gray-500">
      {DIALECT_LABELS[dialect] ?? dialect}
    </span>
  )
}

function VerbBadgeRow({ verb }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <TypeBadge type={verb.type} />
      {verb.agreement.map((role) => (
        <AgreementBadge key={role} role={role} />
      ))}
      <DialectBadge dialect={verb.dialect} />
      <FixedArgumentBadge fixedArgument={getFixedArgument(verb)} />
    </div>
  )
}

function Stars({ count }) {
  const { t } = useLanguage()
  return (
    <div className="flex gap-0.5 text-base text-amber-400" aria-label={t('starsLabel', { count })}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? 'opacity-100' : 'opacity-20'}>
          ★
        </span>
      ))}
    </div>
  )
}

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value * 100))
  return (
    <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full rounded-full bg-green-500 transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}

// Looks up a translated phase/stage/unit field from `JOURNEY_TRANSLATIONS`
// (`src/i18n/journeyTranslations.js`), falling back to `journey.js`'s English
// original (`fallback`) for English or any not-yet-translated entry.
function journeyText(scope, id, field, language, fallback) {
  return JOURNEY_TRANSLATIONS[scope]?.[id]?.[field]?.[language] ?? fallback
}

// =============================================================================
// Home screen — lesson selection
// =============================================================================

function LessonNode({ lesson, locked, needsGateScore, stars, onSelect }) {
  const { t, language } = useLanguage()
  const { icon, title, subtitle, recognitionOnly, fixedArgument } = describeLesson(lesson, t, language)
  return (
    <button
      type="button"
      id={`lesson-${lesson.id}`}
      disabled={locked}
      onClick={() => onSelect(lesson.id)}
      style={{ minHeight: 48 }}
      className={`flex w-full scroll-mt-20 items-center gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${
        locked
          ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-60'
          : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${
          locked ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'
        }`}
        aria-hidden="true"
      >
        {locked ? (needsGateScore ? '🛡️' : '🔒') : icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {title.main} <span className="font-normal text-gray-400">· {title.secondary}</span>
        </p>
        <p className="truncate text-sm text-gray-500">
          {subtitle.main} — {subtitle.secondary}
        </p>
        {recognitionOnly && <p className="mt-1 text-sm font-semibold text-sky-600">{t('recognitionOnly')}</p>}
        {needsGateScore && <p className="mt-1 text-sm font-semibold text-amber-600">{t('gateNeedsScore')}</p>}
        {fixedArgument && (
          <div className="mt-1">
            <FixedArgumentBadge fixedArgument={fixedArgument} />
          </div>
        )}
      </div>
      <Stars count={stars} />
    </button>
  )
}

function LessonList({ lessons, progress, unlockedIds, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => (
        <LessonNode
          key={lesson.id}
          lesson={lesson}
          locked={!unlockedIds.has(lesson.id)}
          needsGateScore={isLockedByGateScore(LESSONS, progress, GATE_LESSON_IDS, lesson.id)}
          stars={progress[lesson.id]?.bestStars ?? 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// A pending unit isn't playable yet, so it renders as a locked roadmap card
// instead of a `LessonNode` — title/focus/payload from `journey.js` give a
// preview of what's coming, with a "Coming soon" badge in place of stars.
// Refresh Gate units (`unit.gate`) get a shield icon instead of a lock to set
// them apart as checkpoints rather than ordinary lessons.
function PendingUnitCard({ unit }) {
  const { t, language } = useLanguage()
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  const payload = unit.payload ? journeyText('units', unit.number, 'payload', language, unit.payload) : null
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 opacity-70">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xl text-gray-400"
        aria-hidden="true"
      >
        {unit.gate ? '🛡️' : '🔒'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-700">
          {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
        </p>
        <p className="mt-0.5 text-sm text-gray-500 break-words">{focus}</p>
        {payload && <p className="mt-1 text-sm text-gray-400 italic break-words">{payload}</p>}
        <span className="mt-2 inline-block rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500">{t('comingSoon')}</span>
      </div>
    </div>
  )
}

// An available unit's `lessonIds` point at entries in `LESSONS` — render each
// as a `LessonNode`, with the unit's title/focus from `journey.js` as a label
// above them.
function UnitLessons({ unit, progress, unlockedIds, onSelect }) {
  const { t, language } = useLanguage()
  const lessons = unit.lessonIds.map((id) => LESSONS.find((lesson) => lesson.id === id))
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  return (
    <div>
      <p className="font-semibold text-gray-900">
        {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
      </p>
      <p className="mt-0.5 mb-2 text-sm text-gray-500 break-words">{focus}</p>
      <LessonList lessons={lessons} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
    </div>
  )
}

function StageSection({ stage, progress, unlockedIds, onSelect }) {
  const { language } = useLanguage()
  const title = journeyText('stages', stage.id, 'title', language, stage.title)
  return (
    <section className="mb-6">
      <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-400 uppercase">{title}</h3>
      <div className="flex flex-col gap-4">
        {stage.units.map((unit) =>
          unit.status === 'available' ? (
            <UnitLessons key={unit.number} unit={unit} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
          ) : (
            <PendingUnitCard key={unit.number} unit={unit} />
          ),
        )}
      </div>
    </section>
  )
}

function PhaseSection({ phase, progress, unlockedIds, onSelect }) {
  const { language } = useLanguage()
  const title = journeyText('phases', phase.id, 'title', language, phase.title)
  const subtitle = journeyText('phases', phase.id, 'subtitle', language, phase.subtitle)
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {phase.stages.map((stage) => (
        <StageSection key={stage.id} stage={stage} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
      ))}
    </section>
  )
}

// The home tab's lesson list is now driven by `JOURNEY` (`journey.js`) rather
// than `LESSONS` directly: it walks phases → stages → units so the full
// curriculum roadmap is visible, with available units rendering their
// `LessonNode`s and pending units rendering locked `PendingUnitCard`s.
function JourneyTab({ progress, onSelectLesson }) {
  const { t } = useLanguage()
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress, undefined, GATE_LESSON_IDS), [progress])

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">{t('homeIntro')}</p>
      {JOURNEY.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} progress={progress} unlockedIds={unlockedIds} onSelect={onSelectLesson} />
      ))}
    </div>
  )
}

function ProgressTab({ progress }) {
  const { t, tCount, language } = useLanguage()
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">{t('progressTitle')}</h2>
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const { heading } = describeLesson(lesson, t, language)
          const entry = progress[lesson.id]
          const needsGateScore = isLockedByGateScore(LESSONS, progress, GATE_LESSON_IDS, lesson.id)
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">
                  {entry
                    ? `${t('progressBest', { best: entry.bestScore, total: entry.totalQuestions })} · ${tCount('attempt', entry.attempts)}`
                    : t('progressNotStarted')}
                </p>
                {needsGateScore && <p className="mt-1 text-sm font-semibold text-amber-600">{t('gateNeedsScore')}</p>}
              </div>
              <Stars count={entry?.bestStars ?? 0} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Cloudflare Worker endpoint for feedback submissions — see
// docs/CLOUDFLARE_FEEDBACK_WORKER.md. Defaults to the deployed worker;
// override with VITE_FEEDBACK_API_URL for forks or local `wrangler dev`.
// Not a secret — the worker's CORS is locked to ALLOWED_ORIGIN regardless.
const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACK_API_URL || 'https://aditzak-feedback.inakiibarrola.workers.dev'
// Mirrors the worker's own limits (worker/src/index.js).
const FEEDBACK_MESSAGE_MAX_LENGTH = 2000
const FEEDBACK_EMAIL_MAX_LENGTH = 320

// Cloudflare Worker endpoint for the account/sync backend — see
// docs/CLOUDFLARE_SYNC_WORKER.md. Defaults to the deployed worker; override
// with VITE_SYNC_API_URL for forks or local `wrangler dev`.
const SYNC_API_URL = import.meta.env.VITE_SYNC_API_URL || 'https://aditzak-sync.inakiibarrola.workers.dev'

// `PUT /sync`'s `schemaVersion` — see docs/CLOUDFLARE_SYNC_WORKER.md. The
// backend stores it as-is without validating; reconciling client/server
// schema versions (if this ever needs to change) is the frontend's job.
const SYNC_SCHEMA_VERSION = 1

// Coalesces the four storage saves a single lesson completion triggers
// (progress/streak/points/errorStats) into one `PUT /sync`.
const SYNC_PUSH_DEBOUNCE_MS = 1000

// The four locally-persisted maps, as the shape `/sync` stores/returns.
function buildSyncPayload({ progress, dailyStreak, points, errorStats }) {
  return { progress, dailyStreak, points, errorStats }
}

// `null` means "no cloud snapshot yet" (404).
async function fetchSyncSnapshot(token) {
  const response = await fetch(`${SYNC_API_URL}/sync`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('sync fetch failed')
  return response.json()
}

async function pushSyncSnapshot(token, payload) {
  const response = await fetch(`${SYNC_API_URL}/sync`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ payload, schemaVersion: SYNC_SCHEMA_VERSION }),
  })
  if (!response.ok) throw new Error('sync push failed')
}

// Whether this device has anything worth merging on first sign-in — if not,
// there's nothing to lose by adopting the cloud copy wholesale.
function hasLocalSyncData({ progress, dailyStreak }) {
  return Object.keys(progress ?? {}).length > 0 || Object.keys(dailyStreak ?? {}).length > 0
}

function FeedbackModal({ onClose }) {
  const { t } = useLanguage()
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorDetail, setErrorDetail] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    setErrorDetail('')
    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: email.trim(), context: 'profile' }),
      })
      if (!response.ok) {
        let detail = `HTTP ${response.status} ${response.statusText} for ${response.url}`
        try {
          const data = await response.json()
          if (data?.error) detail += ` — ${data.error}`
        } catch {
          // response body wasn't JSON; keep the status-only detail
        }
        throw new Error(detail)
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorDetail(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="feedback-title" className="text-lg font-bold text-gray-900">
            {t('feedbackTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('feedbackClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl" aria-hidden="true">
              ✅
            </span>
            <p className="text-sm text-gray-700">{t('feedbackSuccess')}</p>
            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: 48 }}
              className="w-full rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
            >
              {t('feedbackClose')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="feedback-message" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackMessageLabel')}
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('feedbackMessagePlaceholder')}
                maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
                rows={4}
                required
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="feedback-email" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackEmailLabel')}
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('feedbackEmailPlaceholder')}
                maxLength={FEEDBACK_EMAIL_MAX_LENGTH}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {status === 'error' && (
              <div className="text-sm text-red-500">
                <p>{t('feedbackError')}</p>
                {errorDetail && <p className="mt-1 font-mono text-xs break-all text-red-400">{errorDetail}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={status === 'sending' || !message.trim()}
              style={{ minHeight: 48 }}
              className="rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'sending' ? t('feedbackSending') : t('feedbackSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// A short text summary of what the question actually showed the learner —
// used by `FlagQuestionModal` so a report is self-explanatory without the
// learner having to re-describe the question. `sentence`-bearing kinds show
// the (blanked) sentence; `spot-error` shows every candidate sentence so a
// reviewer can see which one was marked wrong; everything else (`form`) shows
// the bare pronoun/person the learner was asked to conjugate for.
function flagQuestionSummary(question, verb) {
  if (question.sentence) return question.sentence
  if (question.items) return question.items.map((item) => item.sentence).join(' / ')
  if (question.source) return question.source
  return verb.pronouns?.[question.person] ?? question.person
}

// "Report a problem with this question" modal, opened from `FeedbackBar`.
// Mirrors `FeedbackModal`'s idle|sending|success|error flow, but the message
// is optional (a comment on top of the auto-attached `diagnostics`) and there's
// no email field — reports are anonymous diagnostic snapshots, not
// conversations.
function FlagQuestionModal({ lesson, question, verb, selected, status, onClose, onSubmitted }) {
  const { t, language } = useLanguage()
  const [comment, setComment] = useState('')
  const [requestStatus, setRequestStatus] = useState('idle') // idle | sending | success | error
  const [errorDetail, setErrorDetail] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (requestStatus === 'sending') return
    setRequestStatus('sending')
    setErrorDetail('')
    try {
      const diagnostics = buildFlagDiagnostics({ lesson, question, selected, status, language })
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: comment.trim(), email: '', context: 'question-flag', diagnostics }),
      })
      if (!response.ok) {
        let detail = `HTTP ${response.status} ${response.statusText} for ${response.url}`
        try {
          const data = await response.json()
          if (data?.error) detail += ` — ${data.error}`
        } catch {
          // response body wasn't JSON; keep the status-only detail
        }
        throw new Error(detail)
      }
      setRequestStatus('success')
      onSubmitted()
    } catch (err) {
      setRequestStatus('error')
      setErrorDetail(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="flag-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="flag-title" className="text-lg font-bold text-gray-900">
            {t('flagModalTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('flagClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {requestStatus === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl" aria-hidden="true">
              ✅
            </span>
            <p className="text-sm text-gray-700">{t('flagSuccess')}</p>
            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: 48 }}
              className="w-full rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
            >
              {t('flagClose')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">{t('flagModalQuestionLabel')}: </span>
                {flagQuestionSummary(question, verb)}
              </p>
              <p>
                <span className="font-semibold">{t('flagModalCorrectLabel')}: </span>
                {question.correct}
              </p>
              {selected != null && selected !== '' && (
                <p>
                  <span className="font-semibold">{t('flagModalYourAnswerLabel')}: </span>
                  {selected}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="flag-comment" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('flagCommentLabel')}
              </label>
              <textarea
                id="flag-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t('flagCommentPlaceholder')}
                maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
                rows={3}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {requestStatus === 'error' && (
              <div className="text-sm text-red-500">
                <p>{t('flagError')}</p>
                {errorDetail && <p className="mt-1 font-mono text-xs break-all text-red-400">{errorDetail}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={requestStatus === 'sending'}
              style={{ minHeight: 48 }}
              className="rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:opacity-50"
            >
              {requestStatus === 'sending' ? t('flagSending') : t('flagSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Sign-in bottom sheet, wired to sync-worker's magic-link endpoints (see
// docs/CLOUDFLARE_SYNC_WORKER.md). Submitting the email step calls
// `POST /auth/request-link`; the actual session is created out-of-band when
// the learner clicks the emailed link (handled by `AppShell` on load), so
// this modal's job ends at "check your email".
function AccountModal({ onClose }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // email | sent
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [errorKey, setErrorKey] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || status === 'sending') return
    setStatus('sending')
    setErrorKey('')
    try {
      const response = await fetch(`${SYNC_API_URL}/auth/request-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      if (response.status === 429) {
        setStatus('error')
        setErrorKey('accountErrorRateLimited')
        return
      }
      if (response.status === 400) {
        setStatus('error')
        setErrorKey('accountErrorInvalidEmail')
        return
      }
      if (!response.ok) {
        setStatus('error')
        setErrorKey('accountErrorNetwork')
        return
      }
      setStatus('idle')
      setStep('sent')
    } catch {
      setStatus('error')
      setErrorKey('accountErrorNetwork')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="account-title" className="text-lg font-bold text-gray-900">
            {t('accountSignInTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('accountClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="account-email" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('accountEmailLabel')}
              </label>
              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('accountEmailPlaceholder')}
                required
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {status === 'error' && <p className="text-sm text-red-500">{t(errorKey)}</p>}
            <button
              type="submit"
              disabled={!email.trim() || status === 'sending'}
              style={{ minHeight: 48 }}
              className="rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'sending' ? t('accountSending') : t('accountSendLink')}
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl" aria-hidden="true">
              📧
            </span>
            <p className="text-sm font-bold text-gray-900">{t('accountLinkSentTitle')}</p>
            <p className="text-sm text-gray-500">{t('accountLinkSentBody', { email: email.trim() })}</p>
            <p className="text-xs text-gray-400">{t('accountLinkSentWaiting')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// "Synced just now" / "Synced Xm ago" / "Syncing…" / "Sync failed, will
// retry" — see `AppShell`'s `syncStatus`/`lastSyncedAt`.
function syncStatusText(syncStatus, lastSyncedAt, t, tCount) {
  if (syncStatus === 'syncing') return t('accountSyncing')
  if (syncStatus === 'error') return t('accountSyncFailed')
  if (lastSyncedAt) {
    const minutes = Math.floor((Date.now() - lastSyncedAt) / 60000)
    if (minutes >= 1) return tCount('accountSyncedMinutesAgo', minutes)
  }
  return t('accountSyncedJustNow')
}

// Card shown in the Profile tab — purely presentational, driven by the
// `account`/`syncStatus`/`lastSyncedAt` state held in `AppShell` (restored
// from/persisted to `aditzak:session:v1`).
function AccountSection({ account, syncStatus, lastSyncedAt, onOpenSignIn, onSignOut }) {
  const { t, tCount } = useLanguage()
  if (account) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            ☁️
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-700">{account.email}</p>
            <p className="text-xs text-gray-400">{syncStatusText(syncStatus, lastSyncedAt, t, tCount)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          style={{ minHeight: 48 }}
          className="mt-3 w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
        >
          {t('accountSignOut')}
        </button>
      </div>
    )
  }
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          ☁️
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('accountTitle')}</p>
          <p className="text-xs text-gray-400">{t('accountSignedOutHint')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenSignIn}
        style={{ minHeight: 48 }}
        className="mt-3 w-full rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
      >
        {t('accountSignIn')}
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">{t('accountSignedOutNote')}</p>
    </div>
  )
}

// Shown once, right after a magic-link sign-in, when this device already had
// local progress *and* the account already has cloud data from another
// device — the three `ACCOUNT_MERGE_OPTIONS` choices from the 2026-06-12
// prototype, now wired to real merge logic in `AppShell.handleResolveMerge`
// (see `mergeSyncPayload` in `lessonLogic.js` for `keepBest`). Not
// dismissible without choosing — there's no safe default that doesn't risk
// silently discarding one side's progress.
function MergeModal({ applying, onChoose }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="merge-title" className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl">
        <h2 id="merge-title" className="mb-1 text-lg font-bold text-gray-900">
          {t('accountMergeTitle')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">{t('accountMergeBody')}</p>
        {applying ? (
          <p className="py-4 text-center text-sm font-semibold text-gray-500">{t('accountSyncing')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onChoose('keepBest')}
              style={{ minHeight: 48 }}
              className="rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
            >
              {t('accountMergeKeepBest')}
            </button>
            <button
              type="button"
              onClick={() => onChoose('useDevice')}
              style={{ minHeight: 48 }}
              className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
            >
              {t('accountMergeUseDevice')}
            </button>
            <button
              type="button"
              onClick={() => onChoose('useAccount')}
              style={{ minHeight: 48 }}
              className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
            >
              {t('accountMergeUseAccount')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileTab({ streak, points, account, syncStatus, lastSyncedAt, onOpenSignIn, onSignOut, onResetProgress, onRepairStreak, onOpenFeedback }) {
  const { t, tCount, language, setLanguage, languages } = useLanguage()
  const today = getLocalDateString()
  const currentStreak = getActiveStreak(streak, today)
  const longestStreak = streak?.longestStreak ?? 0
  const balance = getPointsBalance(points)
  const canRepair = canRepairStreak(streak, points, today)

  // Briefly swaps the "Invite a friend" button's label for `shareCopied`
  // after a clipboard-fallback share (see `shareContent`) — there's no toast
  // system in the app, so this inline revert-after-2s is the confirmation.
  const [shareCopied, setShareCopied] = useState(false)
  const shareCopiedTimeoutRef = useRef(null)
  useEffect(() => () => clearTimeout(shareCopiedTimeoutRef.current), [])

  async function handleShareApp() {
    const result = await shareContent({ title: t('shareGenericTitle'), text: t('shareGenericText'), url: getShareUrl() })
    trackEvent('share_app', { variant: 'generic', result })
    if (result === 'copied') {
      setShareCopied(true)
      clearTimeout(shareCopiedTimeoutRef.current)
      shareCopiedTimeoutRef.current = setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">🧑‍🎓</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('profileGreeting')}</h2>
        <p className="text-sm text-gray-500">{t('profileAchievements')}</p>
      </div>
      <div className="flex w-full gap-3">
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            🔥
          </span>
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', currentStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakCurrent')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            🏆
          </span>
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', longestStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakLongest')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            💎
          </span>
          <span className="text-lg font-bold text-gray-900">{balance}</span>
          <span className="text-xs text-gray-500">{t('pointsBalance')}</span>
        </div>
      </div>
      {canRepair && (
        <div className="w-full rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-bold text-orange-700">{t('streakRepairTitle')}</p>
          <p className="mt-1 text-xs text-orange-600">{t('streakRepairDescription', { cost: STREAK_REPAIR_COST })}</p>
          <button
            type="button"
            onClick={onRepairStreak}
            style={{ minHeight: 48 }}
            className="mt-3 w-full rounded-2xl bg-orange-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-orange-600 active:scale-[0.98]"
          >
            {t('streakRepairButton', { cost: STREAK_REPAIR_COST })}
          </button>
        </div>
      )}
      <AccountSection
        account={account}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onOpenSignIn={onOpenSignIn}
        onSignOut={onSignOut}
      />
      <div className="w-full">
        <p className="mb-1 text-sm font-semibold text-gray-700">{t('profileLanguage')}</p>
        <p className="mb-2 text-xs text-gray-400">{t('profileLanguageHint')}</p>
        <div className="flex justify-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              style={{ minHeight: 48 }}
              className={`flex-1 rounded-2xl border-2 px-3 text-sm font-bold transition ${
                language === lang.code
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleShareApp}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
      >
        {shareCopied ? t('shareCopied') : t('shareInviteButton')}
      </button>
      <button
        type="button"
        onClick={onOpenFeedback}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
      >
        {t('profileFeedback')}
      </button>
      <button
        type="button"
        onClick={onResetProgress}
        style={{ minHeight: 48 }}
        className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
      >
        {t('profileResetProgress')}
      </button>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', labelKey: 'navLearn', icon: '🏠' },
  { id: 'progress', labelKey: 'navProgress', icon: '📊' },
  { id: 'profile', labelKey: 'navProfile', icon: '🧑‍🎓' },
]

function BottomNav({ active, onSelect }) {
  const { t } = useLanguage()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md border-t border-gray-200 bg-white">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          style={{ minHeight: 56 }}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold transition ${
            active === item.id ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl leading-none" aria-hidden="true">
            {item.icon}
          </span>
          {t(item.labelKey)}
        </button>
      ))}
    </nav>
  )
}

function HomeScreen({
  progress,
  streak,
  points,
  account,
  syncStatus,
  lastSyncedAt,
  onSignOut,
  tab,
  onChangeTab,
  onSelectLesson,
  onResetProgress,
  onRepairStreak,
  scrollTarget,
}) {
  const { t } = useLanguage()
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const maxStars = LESSONS.length * 3
  const currentStreak = getActiveStreak(streak, getLocalDateString())
  const balance = getPointsBalance(points)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  // Restores the scroll position the learner had before starting an exercise,
  // or — on the very first load — jumps straight to the last lesson they
  // completed, so returning learners don't land back at the top of the whole
  // journey. Runs once per mount (HomeScreen unmounts while an exercise is
  // active), using whichever `scrollTarget` was current at mount time. The
  // `requestAnimationFrame` defers until after layout, since the lesson list
  // isn't at its final height yet on the same tick as the initial commit.
  useEffect(() => {
    if (!scrollTarget) return
    requestAnimationFrame(() => {
      if (scrollTarget.type === 'restore') {
        window.scrollTo(0, scrollTarget.y)
      } else if (scrollTarget.type === 'lastLesson') {
        // `block: 'start'` (with the `scroll-mt-20` on `LessonNode` clearing the
        // sticky header) leaves the rest of the viewport free to show the
        // upcoming lessons below, rather than centering and hiding them.
        document.getElementById(`lesson-${scrollTarget.lessonId}`)?.scrollIntoView?.({ block: 'start' })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Aditzak</h1>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-600"
            aria-label={t('streakLabel', { count: currentStreak })}
          >
            <span aria-hidden="true">🔥</span>
            <span>{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
            <span aria-hidden="true">★</span>
            <span>
              {totalStars}
              <span className="font-normal text-amber-500">/{maxStars}</span>
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-700"
            aria-label={t('pointsLabel', { count: balance })}
          >
            <span aria-hidden="true">💎</span>
            <span>{balance}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-28">
        {tab === 'home' && <JourneyTab progress={progress} onSelectLesson={onSelectLesson} />}
        {tab === 'progress' && <ProgressTab progress={progress} />}
        {tab === 'profile' && (
          <ProfileTab
            streak={streak}
            points={points}
            account={account}
            syncStatus={syncStatus}
            lastSyncedAt={lastSyncedAt}
            onOpenSignIn={() => setShowAccountModal(true)}
            onSignOut={onSignOut}
            onResetProgress={onResetProgress}
            onRepairStreak={onRepairStreak}
            onOpenFeedback={() => setShowFeedback(true)}
          />
        )}
      </main>

      <BottomNav active={tab} onSelect={onChangeTab} />

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showAccountModal && <AccountModal onClose={() => setShowAccountModal(false)} />}
    </div>
  )
}

// =============================================================================
// Exercise screen — multiple choice and typed-answer questions
// =============================================================================

// A practice lesson has a single source (itself); a review lesson draws from
// several. Either way, `generateQuestions` runs once per source and the
// results are interleaved into one shuffled queue — so a review session mixes
// its conjugation tables together rather than working through them block by
// block.
//
// `noTyping` (see `generateQuestions`) keeps a learner's first
// `NO_TYPING_ATTEMPTS` runs through a *practice* lesson restricted to
// recognition questions — bare forms plus multiple-choice sentence/pronoun
// fill-ins, but no typing or spot-the-error — so a brand-new paradigm is met
// with real example sentences right away, just without being asked to recall
// or cross-check a form from scratch yet. Review lessons always show the full
// mix: by the time a review exists, every form in it has already had its own
// recognition-only introduction.
const NO_TYPING_ATTEMPTS = 2

// A lesson's conjugation table only has 3-6 grammatical persons, which at one
// question per person (the old behaviour) made for a session over in under a
// minute — too short to give a form more than a single retrieval attempt.
// `TARGET_EXERCISE_COUNT` is the rough total a session should reach; for each
// source, `generateQuestions`'s `rounds` is set so that source's
// (persons × rounds) lands close to its even share of the target — e.g. a
// single 3-person source gets 4 rounds (12 questions), while a review with two
// 3-person sources gets 2 rounds each (6 + 6 = 12). Each round is
// independently shuffled and re-rolled, so repeats vary in order and framing
// rather than presenting the exact same question twice in a row.
const TARGET_EXERCISE_COUNT = 12

function createExerciseState(lesson, attempts, errorStats = {}) {
  if (lesson.kind === 'reading') {
    const items = lesson.itemIds.map((itemId) => READING_ITEMS.find((item) => item.id === itemId))
    const allQuestions = generateReadingQuestions(items)
    return {
      queue: allQuestions,
      total: allQuestions.length,
      selected: null,
      status: 'active',
      correctCount: 0,
      streak: 0,
      misses: [],
    }
  }
  const sources = lesson.sources ?? [{ verbId: lesson.verbId, tense: lesson.tense }]
  const noTyping = !lesson.review && attempts < NO_TYPING_ATTEMPTS
  const targetPerSource = TARGET_EXERCISE_COUNT / sources.length
  // Reviews with fewer than 3 sources fall back to forms from verbs/tenses
  // already introduced earlier in `LESSONS` (see `getIntroducedSources`) when
  // widening the cross-verb candidate pools below — a 2-source review (e.g.
  // `unit-1-review`) otherwise has only a single sibling to draw from.
  const extraSources = lesson.review && sources.length < 3 ? getIntroducedSources(LESSONS, lesson.id) : []
  const questions = sources.flatMap(({ verbId, tense }) => {
    const verb = VERBS.find((v) => v.id === verbId)
    const personCount = (lesson.persons ?? Object.keys(verb.conjugations[tense])).length
    const rounds = Math.max(1, Math.round(targetPerSource / personCount))
    // Review lessons widen the distractor pool with sibling sources' forms
    // for the same person (see `getCrossVerbCandidates`) — occasionally
    // offering a "right shape, wrong verb" option alongside the usual
    // same-table distractors.
    const extraCandidates = lesson.review ? getCrossVerbCandidates(verb, tense, sources, VERBS, extraSources) : undefined
    return generateQuestions(verb, tense, {
      noTyping,
      rounds,
      includeNegation: Boolean(lesson.negation),
      persons: lesson.persons,
      extraCandidates,
      verbs: VERBS,
      sources,
      mode: lesson.mode,
      review: Boolean(lesson.review),
    })
  })
  // Review lessons get up to `EXTRA_REVIEW_EXERCISES` extra questions, drawn
  // from the verb/tense/person combinations this learner has most often
  // gotten wrong on the first try (see `getWeakSpotQuestions`) — extra
  // reinforcement for exactly the forms that need it, on top of the review's
  // normal cross-section.
  const extraQuestions = lesson.review ? getWeakSpotQuestions(errorStats, sources, VERBS) : []
  // Review lessons also get up to `CROSS_VERB_QUESTION_COUNT` dedicated
  // "which verb fits this sentence" questions (see
  // `generateCrossVerbQuestions`) — the deliberate, single-focus counterpart
  // to Delivery 1's occasional cross-verb distractor.
  const resolvedSources = sources.map(({ verbId, tense }) => ({ verb: VERBS.find((v) => v.id === verbId), tense }))
  const extraSiblingSources = extraSources.map(({ verbId, tense }) => ({ verb: VERBS.find((v) => v.id === verbId), tense }))
  const crossVerbQuestions = lesson.review
    ? generateCrossVerbQuestions(resolvedSources, { persons: lesson.persons, extraSiblingSources, verbs: VERBS })
    : []
  // Reviews whose sources mix `nor` and `nor-nork` verbs also get up to
  // `CASE_MIXER_QUESTION_COUNT` "which form matches this sentence's subject"
  // questions (see `generateCaseMixerQuestions`) — `verb-choice`'s mirror
  // image, framed around `-k` ergative-subject marking. Reviews with no such
  // mix simply get none.
  const caseMixerQuestions = lesson.review
    ? generateCaseMixerQuestions(resolvedSources, { persons: lesson.persons, extraSiblingSources, verbs: VERBS })
    : []
  // A whole-table match-the-pairs round (see `generateMatchPairsQuestions`)
  // — gated off `lesson.negation` lessons (Unit 10's Refresh Gate A and its
  // `unit-5-review-*` lessons), whose whole point is the `ez`/auxiliary-
  // fronting drill; a bare person↔form match would dilute that focus.
  // Otherwise applies automatically to any practice or review lesson whose
  // sources have an eligible table, per the engine's own person/distinct-
  // form check.
  const matchPairsQuestions = lesson.negation ? [] : generateMatchPairsQuestions(resolvedSources, { persons: lesson.persons })
  const allQuestions = shuffle([...questions, ...extraQuestions, ...crossVerbQuestions, ...caseMixerQuestions, ...matchPairsQuestions])
  return {
    queue: allQuestions,
    total: allQuestions.length,
    selected: null,
    status: 'active', // 'active' | 'correct' | 'incorrect'
    correctCount: 0,
    streak: 0,
    misses: [],
  }
}

// Shown once, before a learner's very first attempt at a (non-review)
// lesson: every person's conjugated form for this lesson's verb/tense, laid
// out as a plain list, so the whole paradigm is visible before any question
// is asked. Pairs with `NO_TYPING_ATTEMPTS` — the learner sees the full table
// here, then spends their first attempts recognising those same forms, in
// isolation and in example sentences, before typed answers and
// spot-the-error are introduced.
function ConjugationTable({ verb, tense }) {
  const { t } = useLanguage()
  const table = verb.conjugations[tense]
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      {Object.entries(table).map(([person, form], index) => (
        <div key={person} className={`flex items-center justify-between px-4 py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div>
            <p className="font-semibold text-gray-800">{(verb.pronouns?.[person] ?? person).toLowerCase()}</p>
            <p className="text-xs text-gray-400">{t(PERSON_LABEL_KEYS[person])}</p>
          </div>
          <p className="text-xl font-extrabold text-gray-900">{form}</p>
        </div>
      ))}
    </div>
  )
}

function LessonPreviewScreen({ verb, tense, tenseMeta, onStart, onExit }) {
  const { t, language } = useLanguage()
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onExit}
          aria-label={t('exitLessonLabel')}
          style={{ minHeight: 48, minWidth: 48 }}
          className="flex items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-4">
        <div className="mb-6">
          <VerbBadgeRow verb={verb} />
        </div>
        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
          {verb.verb} — {verbMeaning(verb, language)} · {t(tenseMeta.labelKey)}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">{t('previewTitle')}</h2>
        <p className="mt-1 text-gray-500">{t('previewSubtitle')}</p>
        <div className="mt-6">
          <ConjugationTable verb={verb} tense={tense} />
        </div>
      </div>

      <div className="px-5 pt-4 pb-6">
        <button
          type="button"
          onClick={onStart}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
        >
          {t('start')}
        </button>
      </div>
    </div>
  )
}

// On a correct answer we reveal which option it was; on an incorrect one we
// only flag the wrong pick — the correct form stays hidden so the learner has
// to actually recall it when this question comes back around.
function getOptionStatus(option, question, state) {
  if (state.status === 'active') return 'idle'
  if (state.status === 'correct') return option === question.correct ? 'correct' : 'idle'
  return option === state.selected ? 'incorrect' : 'idle'
}

const OPTION_STYLES = {
  idle: 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50',
  correct: 'border-green-500 bg-green-50 text-green-700 animate-flash',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function AnswerOption({ option, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ minHeight: 48 }}
      className={`w-full rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold transition ${OPTION_STYLES[status]} ${
        disabled ? 'cursor-default' : 'active:scale-[0.98]'
      } ${disabled && status === 'idle' ? 'opacity-50' : ''}`}
    >
      {option}
    </button>
  )
}

// Typed-answer questions (`type-verb` / `type-pronoun`, identifiable by having
// no `options`) swap the option list for a text field — same idle/correct/
// incorrect palette as `AnswerOption` (down to reusing the flash/shake
// animations), so the feedback reads consistently across both interaction
// styles even though one is a button grid and the other a form field. As with
// multiple choice, an incorrect submission doesn't reveal the right spelling —
// the learner has to actually recall it when the question resurfaces.
const TYPED_INPUT_STYLES = {
  active: 'border-gray-200 bg-white text-gray-800 focus:border-green-400',
  correct: 'border-green-500 bg-green-50 text-green-700 animate-flash',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function TypedAnswerInput({ value, status, onChange, onSubmit }) {
  const { t } = useLanguage()
  const isAnswered = status !== 'active'
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-3"
    >
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder={t('typeAnswerPlaceholder')}
        aria-label={t('typeAnswerLabel')}
        value={value}
        disabled={isAnswered}
        onChange={(event) => onChange(event.target.value)}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl border-2 px-5 py-4 text-lg font-semibold transition focus:outline-none ${TYPED_INPUT_STYLES[status]} ${
          isAnswered ? 'cursor-default' : ''
        }`}
      />
      {!isAnswered && (
        <button
          type="submit"
          disabled={value.trim() === ''}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl bg-green-500 px-5 py-4 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('check')}
        </button>
      )}
    </form>
  )
}

const MATCH_TILE_STYLES = {
  idle: 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50',
  selected: 'border-blue-400 bg-blue-50 text-blue-700',
  correct: 'border-green-500 bg-green-50 text-green-700',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function MatchTile({ label, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || status === 'correct'}
      style={{ minHeight: 48 }}
      className={`w-full rounded-2xl border-2 px-4 py-3 text-left font-semibold transition ${MATCH_TILE_STYLES[status]} ${
        disabled || status === 'correct' ? 'cursor-default' : 'active:scale-[0.98]'
      }`}
    >
      {label}
    </button>
  )
}

// `kind: 'match-pairs'` (see `generateMatchPairsQuestions`) covers a whole
// source's table at once: the learner matches every in-scope person to its
// conjugated form, rather than answering about one person at a time. Left
// and right columns are shuffled independently and locally (not relying on
// the engine's once-shuffled `pairs` order) so a retry of the same question
// doesn't reuse the exact same layout. A correct tap locks both tiles; an
// incorrect one flashes both red briefly, then clears the selection — the
// round only "fails" in the sense that `onComplete(false)` is reported once
// every pair is eventually matched, mirroring how a missed multiple-choice
// question still resolves once an answer is accepted.
function MatchPairsBoard({ pairs, verb, disabled, onComplete }) {
  const { t } = useLanguage()
  const [leftTiles] = useState(() => shuffle(pairs))
  const [rightTiles] = useState(() => shuffle(pairs))
  const [matched, setMatched] = useState(() => new Set())
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [mistake, setMistake] = useState(null)
  const hadMistakeRef = useRef(false)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!completedRef.current && matched.size === pairs.length) {
      completedRef.current = true
      onComplete(!hadMistakeRef.current)
    }
  }, [matched, pairs.length, onComplete])

  function attemptMatch(leftPerson, rightPerson) {
    if (leftPerson === rightPerson) {
      setMatched((prev) => new Set(prev).add(leftPerson))
      setSelectedLeft(null)
      setSelectedRight(null)
      return
    }
    hadMistakeRef.current = true
    setMistake({ left: leftPerson, right: rightPerson })
    setTimeout(() => {
      setMistake(null)
      setSelectedLeft(null)
      setSelectedRight(null)
    }, 600)
  }

  function handleSelectLeft(person) {
    if (disabled || matched.has(person) || mistake) return
    setSelectedLeft(person)
    if (selectedRight) attemptMatch(person, selectedRight)
  }

  function handleSelectRight(person) {
    if (disabled || matched.has(person) || mistake) return
    setSelectedRight(person)
    if (selectedLeft) attemptMatch(selectedLeft, person)
  }

  function tileStatus(person, selected, side) {
    if (matched.has(person)) return 'correct'
    if (mistake && mistake[side] === person) return 'incorrect'
    if (selected === person) return 'selected'
    return 'idle'
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-3">
        {leftTiles.map(({ person }) => (
          <MatchTile
            key={person}
            label={(verb.pronouns?.[person] ?? t(PERSON_LABEL_KEYS[person])).toLowerCase()}
            status={tileStatus(person, selectedLeft, 'left')}
            disabled={disabled || Boolean(mistake)}
            onSelect={() => handleSelectLeft(person)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {rightTiles.map(({ person, form }) => (
          <MatchTile
            key={person}
            label={form}
            status={tileStatus(person, selectedRight, 'right')}
            disabled={disabled || Boolean(mistake)}
            onSelect={() => handleSelectRight(person)}
          />
        ))}
      </div>
    </div>
  )
}

const WORD_CHIP_STYLES = {
  idle: 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50',
  correct: 'border-green-500 bg-green-50 text-green-700 animate-flash',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function WordChip({ text, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ minHeight: 44 }}
      className={`rounded-2xl border-2 px-4 py-2 text-base font-semibold transition ${WORD_CHIP_STYLES[status]} ${
        disabled ? 'cursor-default' : 'active:scale-[0.98]'
      }`}
    >
      {text}
    </button>
  )
}

// `kind: 'word-order'` (see `buildWordOrderQuestion`, #185/#186): the learner
// taps `question.tokens` — a shuffled cloud — back into sentence order.
// Tapping a cloud chip moves it into the "assembled" row in tap order;
// tapping an assembled chip undoes that, returning it to the cloud. Unlike
// every other kind, building an answer here is multi-step, so it doesn't
// submit on the first tap — `onSubmit` only fires from an explicit Check
// tap, enabled once the cloud is empty. Retries reshuffle: per
// `docs/EXERCISE_ENGINE.md`'s word-order contract, the parent keys this
// component by `question.attempt` (the same `MatchPairsBoard` precedent,
// #191), so a retry remounts it — re-running the `shuffle` below — instead
// of reusing the failed layout. `punctuation` (#214 — the sentence's
// trailing `.`/`?`, stripped out of `tokens`/`correct` so it isn't itself
// something to tap into place) renders as a fixed mark right after the
// assembled chips, so the sentence still reads as complete.
function WordOrderBoard({ tokens, punctuation, status, disabled, onSubmit }) {
  const { t } = useLanguage()
  const [cloud, setCloud] = useState(() => shuffle(tokens))
  const [assembled, setAssembled] = useState([])
  const chipStatus = status === 'active' ? 'idle' : status

  function moveToAssembled(token) {
    if (disabled) return
    setCloud((prev) => prev.filter((candidate) => candidate.id !== token.id))
    setAssembled((prev) => [...prev, token])
  }

  function moveToCloud(token) {
    if (disabled) return
    setAssembled((prev) => prev.filter((candidate) => candidate.id !== token.id))
    setCloud((prev) => [...prev, token])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-3">
        {assembled.map((token) => (
          <WordChip key={token.id} text={token.text} status={chipStatus} disabled={disabled} onSelect={() => moveToCloud(token)} />
        ))}
        {punctuation && <span className="text-2xl font-extrabold text-gray-400">{punctuation}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {cloud.map((token) => (
          <WordChip key={token.id} text={token.text} status="idle" disabled={disabled} onSelect={() => moveToAssembled(token)} />
        ))}
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={() => onSubmit(assembled.map((token) => token.text).join(' '))}
          disabled={cloud.length > 0}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl bg-green-500 px-5 py-4 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('check')}
        </button>
      )}
    </div>
  )
}

// Renders an example sentence with the conjugated verb redacted — the `___`
// placeholder in the data becomes a visual blank the learner fills in by
// picking an option below, rather than a literal "___" in running text.
function SentenceWithBlank({ sentence }) {
  const [before, after] = sentence.split('___')
  return (
    <p className="mt-3 text-2xl leading-snug font-extrabold text-gray-900">
      {before}
      <span className="mx-1 inline-block w-16 border-b-4 border-dashed border-gray-300 align-middle" aria-hidden="true" />
      {after}
    </p>
  )
}

// `generateQuestions` mixes six question styles, but they differ along just a
// couple of independent axes: how the prompt is framed — a bare person/label
// pair, a single sentence with a blank (keyed off `question.sentence` rather
// than listing every blanked `kind`, so this stays correct as new framings are
// added), or — uniquely for `spot-error` — nothing extra at all, since its
// four already-filled-in sentences (`question.items`) double as both the
// prompt and the answer options rendered below — and how the answer is given:
// multiple choice when `question.options` is present, typed in otherwise (see
// `ExerciseScreen`). Every combination still tests recognising/recalling the
// right Basque form, just packaged differently.
// `showVerb` (default `true`) controls whether the verb's name/meaning is
// shown alongside the tense — set to `false` for review-lesson questions
// with `options` (see `ExerciseScreen`), since naming the verb would give
// away the answer for questions whose options include a cross-verb
// distractor (see `getCrossVerbCandidates`). Typed questions (`type-verb`/
// `type-pronoun`/`type-negative`, no `options`) always show the verb: with
// no options to narrow things down, hiding which verb's table a review's
// blanked sentence belongs to can leave more than one real Basque word
// fitting the blank (e.g. "Irakasleak erantzun zuzena ___." fits both
// `jakin`'s `daki` and `edun`'s `du`), making the question unanswerable
// rather than just harder. The tense label alone is still shown either way.
function QuestionPrompt({ verb, tenseMeta, question, showVerb = true }) {
  const { t, language } = useLanguage()
  if (question.kind === 'reading') {
    const gloss = question.gloss[language] ?? question.gloss.en
    return (
      <>
        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">{t('readingLessonTag')}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">{question.source}</h2>
        {gloss !== question.source && <p className="mt-1 text-gray-500">{gloss}</p>}
        <p className="mt-4 text-gray-700">{question.prompt[language] ?? question.prompt.en}</p>
      </>
    )
  }
  return (
    <>
      <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {showVerb ? (
          <>
            {verb.verb} — {verbMeaning(verb, language)} · {t(tenseMeta.labelKey)}
          </>
        ) : (
          t(tenseMeta.labelKey)
        )}
      </p>
      {question.fixedArgument && (
        <div className="mt-2">
          <FixedArgumentBadge fixedArgument={question.fixedArgument} />
        </div>
      )}
      {question.sentence ? (
        <SentenceWithBlank sentence={question.sentence} />
      ) : question.items || question.pairs || question.tokens ? null : (
        <>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
            {(verb.pronouns?.[question.person] ?? question.person).toLowerCase()}
          </h2>
          <p className="mt-1 text-gray-500">{t(PERSON_LABEL_KEYS[question.person])}</p>
        </>
      )}
    </>
  )
}

// Maps each question `kind` to the translation key for its instruction line
// (`src/i18n/translations.js`) — looked up via `t()` in `ExerciseScreen`.
const QUESTION_PROMPT_KEYS = {
  form: 'questionForm',
  sentence: 'questionSentence',
  'spot-error': 'questionSpotError',
  pronoun: 'questionPronoun',
  'type-verb': 'questionTypeVerb',
  'type-pronoun': 'questionTypePronoun',
  negative: 'questionNegation',
  'type-negative': 'questionTypeNegation',
  'verb-choice': 'questionVerbChoice',
  'case-mixer': 'questionCaseMixer',
  reading: 'questionReading',
  'match-pairs': 'questionMatchPairs',
  'word-order': 'questionWordOrder',
}

// The explanation toggle is its own pill-shaped button above the
// Continue/Finish button — collapsed by default so it doesn't compete with
// the main "what happened" feedback, but styled to invite a tap (lightbulb
// icon, dashed border, chevron that flips when open) rather than reading as
// throwaway fine print. `showExplanation`/`onToggleExplanation` are owned by
// `ExerciseScreen` (reset alongside the rest of the per-question feedback
// state), not local to this component, so they can be reset together with
// `streakEncouragement`/`typedValue` when a new question comes up.
function ExplanationToggle({ explanation, expanded, onToggle }) {
  const { t } = useLanguage()
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={onToggle}
        style={{ minHeight: 48 }}
        className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-green-300 bg-white px-4 text-left text-sm font-bold text-green-700 transition hover:border-green-400 hover:bg-green-50"
      >
        <span className="text-xl" aria-hidden="true">
          💡
        </span>
        <span className="flex-1">{t('explanationToggle')}</span>
        <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {expanded && <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">{explanation}</p>}
    </div>
  )
}

function FeedbackBar({ status, isLast, streakEncouragement, explanation, showExplanation, onToggleExplanation, onContinue, lesson, question, verb, selected }) {
  const { t } = useLanguage()
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [flagged, setFlagged] = useState(false)
  if (status === 'active') return null
  const isCorrect = status === 'correct'
  return (
    <div className={`px-5 pt-4 pb-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className={`flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          <span className="text-2xl" aria-hidden="true">
            {streakEncouragement ? streakEncouragement.icon : isCorrect ? '✓' : '✕'}
          </span>
          {streakEncouragement ? (
            <span>
              {streakEncouragement.headline} {t(streakEncouragement.messageKey)}
            </span>
          ) : isCorrect ? (
            <span>{t('feedbackCorrect')}</span>
          ) : (
            <span>{t('feedbackIncorrect')}</span>
          )}
        </p>
        <button
          type="button"
          onClick={() => setShowFlagModal(true)}
          disabled={flagged}
          aria-label={flagged ? t('flagButtonFlagged') : t('flagButtonLabel')}
          title={flagged ? t('flagButtonFlagged') : t('flagButtonLabel')}
          style={{ minHeight: 44, minWidth: 44 }}
          className="flex shrink-0 items-center justify-center rounded-full text-lg text-gray-400 transition hover:bg-white hover:text-gray-600 disabled:opacity-50"
        >
          🚩
        </button>
      </div>
      {isCorrect && explanation && (
        <ExplanationToggle explanation={explanation} expanded={showExplanation} onToggle={onToggleExplanation} />
      )}
      <button
        type="button"
        onClick={onContinue}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl text-lg font-extrabold tracking-wide text-white uppercase transition active:scale-[0.98] ${
          isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLast ? t('finish') : t('continue')}
      </button>
      {showFlagModal && (
        <FlagQuestionModal
          lesson={lesson}
          question={question}
          verb={verb}
          selected={selected}
          status={status}
          onClose={() => setShowFlagModal(false)}
          onSubmitted={() => setFlagged(true)}
        />
      )}
    </div>
  )
}

// Celebration confetti/fireworks shown for a perfect (3-star) result. Picked
// once per results screen — via the lazy `useState` initializer below, the
// same pattern `createExerciseState` uses for `shuffle` — so a perfect score
// doesn't always trigger the identical animation, but it also doesn't
// re-roll (and re-trigger) on every re-render.
const CELEBRATION_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6']
const CONFETTI_PIECE_COUNT = 50
const FIREWORK_BURST_COUNT = 3
const FIREWORK_PARTICLES_PER_BURST = 12

function createCelebration() {
  if (Math.random() < 0.5) {
    const pieces = Array.from({ length: CONFETTI_PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.6,
      rotation: Math.round(Math.random() * 360),
      drift: Math.round((Math.random() - 0.5) * 160),
    }))
    return { effect: 'confetti', pieces }
  }

  const bursts = Array.from({ length: FIREWORK_BURST_COUNT }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    top: 15 + Math.random() * 45,
    color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
    delay: i * 0.3 + Math.random() * 0.2,
  }))
  return { effect: 'fireworks', bursts }
}

function Celebration({ celebration }) {
  if (celebration.effect === 'confetti') {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
        {celebration.pieces.map((piece) => (
          <span
            key={piece.id}
            className="animate-confetti-fall absolute -top-4 block h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--confetti-rotation': `${piece.rotation}deg`,
              '--confetti-drift': `${piece.drift}px`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {celebration.bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: `${burst.left}%`, top: `${burst.top}%` }}>
          {Array.from({ length: FIREWORK_PARTICLES_PER_BURST }).map((_, i) => (
            <span
              key={i}
              className="animate-firework absolute h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: burst.color,
                animationDelay: `${burst.delay}s`,
                '--firework-angle': `${(360 / FIREWORK_PARTICLES_PER_BURST) * i}deg`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function LessonResultsScreen({ lesson, correctCount, total, pointsEarned, onDone }) {
  const { t, tCount, language } = useLanguage()
  const stars = computeStars(correctCount, total)
  const [variantIndex] = useState(() => pickEncouragementVariantIndex(correctCount, total))
  const [celebration] = useState(() => (stars === 3 ? createCelebration() : null))
  const { icon, headline, messageKey } = getEncouragement(correctCount, total, variantIndex)
  const { heading } = describeLesson(lesson, t, language)

  // Vibrate once when the results screen first appears, with a pattern that
  // scales with the result — see `vibrateResult`.
  useEffect(() => {
    vibrateResult(stars)
  }, [stars])

  // Briefly swaps the "Share" button's label for `shareCopied` after a
  // clipboard-fallback share (see `shareContent`) — same pattern as the
  // Profile tab's "Invite a friend" button.
  const [shareCopied, setShareCopied] = useState(false)
  const shareCopiedTimeoutRef = useRef(null)
  useEffect(() => () => clearTimeout(shareCopiedTimeoutRef.current), [])

  async function handleShareResult() {
    const result = await shareContent({
      title: t('shareResultTitle'),
      text: t('shareResultText', { lesson: heading }),
      url: getShareUrl(),
    })
    trackEvent('share_app', { variant: 'result', lessonId: lesson.id, result })
    if (result === 'copied') {
      setShareCopied(true)
      clearTimeout(shareCopiedTimeoutRef.current)
      shareCopiedTimeoutRef.current = setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-5 bg-white px-8 text-center">
      {celebration && <Celebration celebration={celebration} />}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">{headline}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {heading} — {t('resultsScore', { correct: correctCount, total })}
        </p>
      </div>
      <Stars count={stars} />
      {pointsEarned > 0 && (
        <p className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-700">
          <span aria-hidden="true">💎</span>
          {tCount('pointsEarned', pointsEarned)}
        </p>
      )}
      <p className="text-base text-gray-600">{t(messageKey)}</p>
      <button
        type="button"
        onClick={onDone}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
      >
        {t('continue')}
      </button>
      {stars === 3 && (
        <button
          type="button"
          onClick={handleShareResult}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
        >
          {shareCopied ? t('shareCopied') : t('shareResultButton')}
        </button>
      )}
    </div>
  )
}

// Showing a streak nudge every single time someone hits a milestone would
// get mechanical fast, so it's gated two ways: a session-level cooldown
// (tracked by `App` in lessons, reset to a random span once a nudge is
// shown) and, even once eligible, only a chance of actually firing — so it
// reads as an occasional surprise rather than a predictable popup.
const STREAK_NUDGE_COOLDOWN_RANGE = [2, 4] // lessons to wait before the next one
const STREAK_NUDGE_CHANCE = 0.6

function randomStreakNudgeCooldown() {
  const [min, max] = STREAK_NUDGE_COOLDOWN_RANGE
  return min + Math.floor(Math.random() * (max - min + 1))
}

// Pulled out to its own (impure) function — the `react-hooks/purity` rule
// forbids `Math.random` calls written directly inside component bodies, even
// inside event handlers, since it can't always tell render code from event
// code apart. Calling it from `handleSelect`, in response to an answer, is
// fine: that's an event, not a render.
function rollStreakNudgeChance() {
  return Math.random() < STREAK_NUDGE_CHANCE
}

function ExerciseScreen({ lesson, attempts, errorStats, onExit, onComplete, canShowStreakNudge, onStreakNudgeShown }) {
  const { t } = useLanguage()
  const [state, dispatch] = useReducer(exerciseReducer, undefined, () => createExerciseState(lesson, attempts, errorStats))
  const [finished, setFinished] = useState(false)
  const [streakEncouragement, setStreakEncouragement] = useState(null)
  // Whether the "why is this correct?" panel (see `ExplanationToggle`) is
  // expanded for the current question's feedback — reset to collapsed
  // alongside `streakEncouragement` whenever a new answer is submitted, so
  // each question's explanation starts hidden rather than carrying over the
  // previous question's open/closed state.
  const [showExplanation, setShowExplanation] = useState(false)
  // Only used by typed-answer questions (`question.options` absent) — reset
  // whenever a new question comes up so the field doesn't carry over what was
  // typed for the previous one.
  const [typedValue, setTypedValue] = useState('')
  // Bumped on every answer; used as `FeedbackBar`'s `key` so its "flagged"
  // state (see `FlagQuestionModal`) resets between questions instead of
  // persisting onto the next one.
  const [answerSeq, setAnswerSeq] = useState(0)
  // Shown once, before the first attempt at a single-verb practice lesson —
  // see `LessonPreviewScreen`. Review lessons and pooled multi-verb practice
  // lessons (`lesson.sources`, e.g. Unit 10's `unit-10-present`) skip it:
  // either every form they cover has already had its own practice-lesson
  // intro (review), or the preview's single-verb/single-table layout doesn't
  // fit a pool of verbs (pooled practice).
  const [showPreview, setShowPreview] = useState(!lesson.sources && lesson.kind !== 'reading' && attempts === 0)

  // Fires once the learner is actually answering questions — on mount for
  // review/pooled/repeat lessons (which skip the preview), or once the
  // preview's "Start" button is dismissed for a lesson's first attempt.
  useEffect(() => {
    if (showPreview) return
    trackEvent('lesson_started', {
      lessonId: lesson.id,
      review: Boolean(lesson.review),
      attemptNumber: attempts + 1,
      ...(lesson.verbId ? { verbId: lesson.verbId, tense: lesson.tense } : {}),
    })
  }, [showPreview, lesson, attempts])

  if (showPreview) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    return (
      <LessonPreviewScreen
        verb={verb}
        tense={lesson.tense}
        tenseMeta={TENSE_META[lesson.tense]}
        onStart={() => setShowPreview(false)}
        onExit={onExit}
      />
    )
  }

  const total = state.total
  const question = state.queue[0]
  const isAnswered = state.status !== 'active'
  // Finishing means the queue is about to empty — only true once the *last*
  // remaining question has been answered correctly; an incorrect answer to it
  // sends it back to the queue and the lesson carries on.
  const isLast = state.queue.length === 1 && state.status === 'correct'
  // Looked up per *question* rather than once for the whole lesson: a practice
  // lesson's questions all share one verb/tense, but a review lesson's don't —
  // each carries the `verbId`/`tense` it was generated from (see
  // `generateQuestions`), so the prompt and badges always match what's
  // actually being asked, even as that changes question to question.
  const verb = VERBS.find((v) => v.id === question.verbId)
  const tenseMeta = TENSE_META[question.tense]
  const progressValue = (state.total - state.queue.length + (state.status === 'correct' ? 1 : 0)) / total

  // Shared by both interaction styles — a clicked multiple-choice option and a
  // typed-and-submitted string both resolve to "an answer was given for the
  // current question", compared the same forgiving way (`isAnswerCorrect`).
  function submitAnswer(value) {
    if (isAnswered || value === '') return
    // Decided here, at answer time, rather than during render: it rolls the
    // dice, and React render functions must stay pure/idempotent. Gated by
    // the session-level cooldown `App` tracks, plus a chance check, so a
    // milestone streak doesn't *always* trigger a nudge — it should read as
    // an occasional surprise, not a mechanical popup.
    const isCorrect = isAnswerCorrect(value, question.correct)
    if (isCorrect) vibrateCorrect()
    else vibrateIncorrect()
    const milestone = isCorrect ? getStreakEncouragement(state.streak + 1) : null
    const showEncouragement = milestone !== null && canShowStreakNudge && rollStreakNudgeChance()
    setStreakEncouragement(showEncouragement ? milestone : null)
    if (showEncouragement) onStreakNudgeShown()
    setShowExplanation(false)
    setAnswerSeq((n) => n + 1)
    dispatch({ type: 'answer', option: value })
  }

  function handleSubmitTyped() {
    submitAnswer(typedValue.trim())
  }

  function handleContinue() {
    if (isLast) {
      setFinished(true)
    } else {
      setTypedValue('')
      dispatch({ type: 'next' })
    }
  }

  if (finished) {
    return (
      <LessonResultsScreen
        lesson={lesson}
        correctCount={state.correctCount}
        total={total}
        pointsEarned={computeLessonPoints(state.correctCount, total, attempts > 0)}
        onDone={() => onComplete({ correctCount: state.correctCount, total, misses: state.misses })}
      />
    )
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onExit}
          aria-label={t('exitLessonLabel')}
          style={{ minHeight: 48, minWidth: 48 }}
          className="flex items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
        <ProgressBar value={progressValue} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-8">
        {!lesson.review && (
          <div className="mb-6">
            <VerbBadgeRow verb={verb} />
          </div>
        )}

        <QuestionPrompt verb={verb} tenseMeta={tenseMeta} question={question} showVerb={!lesson.review || !question.options} />

        <p className="mt-8 mb-3 text-base font-semibold text-gray-700">{t(QUESTION_PROMPT_KEYS[question.kind])}</p>
        {question.pairs ? (
          <MatchPairsBoard
            key={`match-pairs-${question.verbId}-${question.tense}-${question.attempt ?? 1}`}
            pairs={question.pairs}
            verb={verb}
            disabled={isAnswered}
            onComplete={(success) => submitAnswer(success ? question.correct : 'incomplete')}
          />
        ) : question.tokens ? (
          <WordOrderBoard
            key={`word-order-${question.verbId}-${question.tense}-${question.person}-${question.attempt ?? 1}`}
            tokens={question.tokens}
            punctuation={question.punctuation}
            status={state.status}
            disabled={isAnswered}
            onSubmit={submitAnswer}
          />
        ) : question.options ? (
          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <AnswerOption
                key={option}
                option={option}
                status={getOptionStatus(option, question, state)}
                disabled={isAnswered}
                onSelect={() => submitAnswer(option)}
              />
            ))}
          </div>
        ) : (
          <TypedAnswerInput value={typedValue} status={state.status} onChange={setTypedValue} onSubmit={handleSubmitTyped} />
        )}
      </div>

      <FeedbackBar
        key={answerSeq}
        status={state.status}
        isLast={isLast}
        streakEncouragement={streakEncouragement}
        explanation={state.status === 'correct' ? getExplanation(verb, question, t) : null}
        showExplanation={showExplanation}
        onToggleExplanation={() => setShowExplanation((expanded) => !expanded)}
        onContinue={handleContinue}
        lesson={lesson}
        question={question}
        verb={verb}
        selected={state.selected}
      />
    </div>
  )
}

// =============================================================================
// App shell
// =============================================================================

// Shown once, before anything else, when no source language has been chosen
// yet (`hasChosenLanguage` is false — see `LanguageContext`) — a "fancy"
// full-screen selector so a first-time visitor picks the language they
// already know before seeing any lesson content. Euskara is listed first
// (per `LANGUAGES`) and flagged as recommended, since most Aditzak users
// already have some grounding in Basque. Picking a language calls
// `setLanguage`, which persists the choice and flips `hasChosenLanguage`, so
// this screen doesn't render again.
function LanguageOnboardingScreen() {
  const { t, setLanguage, languages } = useLanguage()
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-8 bg-gradient-to-b from-green-50 to-white px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl" aria-hidden="true">
        🌍
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('onboardingTitle')}</h1>
        <p className="mt-2 text-gray-500">{t('onboardingSubtitle')}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            style={{ minHeight: 64 }}
            className={`flex items-center justify-between rounded-2xl border-2 px-5 text-left text-lg font-bold transition active:scale-[0.98] ${
              lang.code === 'eu'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {lang.name}
            {lang.code === 'eu' && (
              <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">{t('onboardingRecommended')}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function AppShell() {
  const { t, hasChosenLanguage } = useLanguage()
  const [progress, setProgress] = useState(progressStorage.load)
  const [dailyStreak, setDailyStreak] = useState(streakStorage.load)
  const [points, setPoints] = useState(pointsStorage.load)
  const [errorStats, setErrorStats] = useState(errorStorage.load)
  const [deviceId] = useState(getDeviceId)
  const [tab, setTab] = useState('home')
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [account, setAccount] = useState(() => {
    const session = accountSessionStorage.load()
    return session ? { email: session.email } : null
  })
  // Sync status for `AccountSection` — 'idle' before the first sync attempt
  // this session, then 'syncing'/'synced'/'error' as `PUT`/`GET /sync` calls
  // resolve. `lastSyncedAt` is a `Date.now()` timestamp, turned into "synced
  // Xm ago" by `syncStatusText`.
  const [syncStatus, setSyncStatus] = useState(() => {
    if (typeof window === 'undefined') return 'idle'
    const url = new URL(window.location.href)
    if (url.searchParams.get('authToken')) return 'syncing'
    return accountSessionStorage.load()?.token ? 'syncing' : 'idle'
  })
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  // Set right after a magic-link sign-in when this device *and* the account
  // both already have data to reconcile — `{ cloud }` holds the cloud
  // snapshot fetched for `MergeModal`'s three choices (`null` = no merge
  // pending).
  const [pendingMerge, setPendingMerge] = useState(null)
  const [mergeApplying, setMergeApplying] = useState(false)
  // Session-level gate for the mid-lesson streak nudge: counts down once a
  // nudge has been shown, so the next one waits a few lessons rather than
  // popping up again the moment another milestone streak comes around.
  const [streakNudgeCooldown, setStreakNudgeCooldown] = useState(0)
  // Where the home screen should scroll to the next time it mounts: the last
  // lesson the learner completed on initial load, or the scroll position they
  // had before starting an exercise when they return from one.
  const [homeScrollTarget, setHomeScrollTarget] = useState(() => {
    const lastLessonId = getLastPlayedLessonId(progressStorage.load())
    return lastLessonId ? { type: 'lastLesson', lessonId: lastLessonId } : null
  })
  const scrollBeforeLessonRef = useRef(null)
  // Mirrors `progress`/`dailyStreak`/`points`/`errorStats` for the async sync
  // handlers below, which need the *current* values at the time a network
  // call resolves rather than whatever was current when the handler was
  // created.
  const dataRef = useRef({ progress, dailyStreak, points, errorStats })
  // Background `PUT /sync` debounce timer (ongoing sync, see below).
  const syncTimeoutRef = useRef(null)
  // Guards the background-sync effect until the initial reconcile (push/pull/
  // merge, in the `authToken` effect below) has run — otherwise it would push
  // this device's pre-merge data to the cloud before the merge choice (or
  // pull-merge) has a chance to run.
  const skipNextPushRef = useRef(true)

  useEffect(() => {
    dataRef.current = { progress, dailyStreak, points, errorStats }
  })

  useEffect(() => {
    progressStorage.save(progress)
  }, [progress])

  useEffect(() => {
    streakStorage.save(dailyStreak)
  }, [dailyStreak])

  useEffect(() => {
    pointsStorage.save(points)
  }, [points])

  useEffect(() => {
    errorStorage.save(errorStats)
  }, [errorStats])

  const pushSnapshot = useCallback((token) => {
    setSyncStatus('syncing')
    return pushSyncSnapshot(token, buildSyncPayload(dataRef.current))
      .then(() => {
        setSyncStatus('synced')
        setLastSyncedAt(Date.now())
      })
      .catch(() => {
        setSyncStatus('error')
      })
  }, [])

  // Runs once on mount. Two cases:
  //
  // - URL has `?authToken=...` (the learner just clicked the emailed link):
  //   exchange it for a session via `/auth/verify`, persist it, and strip the
  //   token from the URL either way so it isn't left in the address bar or
  //   re-submitted on refresh. Then reconcile this device's local data with
  //   the account's cloud data — see the three branches below.
  // - Otherwise, if a session is already stored (returning signed-in
  //   learner): pull the cloud snapshot and merge it with local data
  //   (`mergeSyncPayload`, same rules as `keepBest`), so edits made on
  //   another device since the last visit aren't lost or overwritten.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const authToken = url.searchParams.get('authToken')

    if (!authToken) {
      const session = accountSessionStorage.load()
      if (!session?.token) {
        skipNextPushRef.current = false
        return
      }
      fetchSyncSnapshot(session.token)
        .then((snapshot) => {
          if (!snapshot?.payload) return pushSyncSnapshot(session.token, buildSyncPayload(dataRef.current))
          const merged = mergeSyncPayload(dataRef.current, snapshot.payload)
          setProgress(merged.progress)
          setDailyStreak(merged.dailyStreak)
          setPoints(merged.points)
          setErrorStats(merged.errorStats)
          dataRef.current = merged
          return pushSyncSnapshot(session.token, buildSyncPayload(merged))
        })
        .then(() => {
          setSyncStatus('synced')
          setLastSyncedAt(Date.now())
        })
        .catch(() => setSyncStatus('error'))
        .finally(() => {
          skipNextPushRef.current = false
        })
      return
    }

    url.searchParams.delete('authToken')
    window.history.replaceState({}, '', url.toString())

    fetch(`${SYNC_API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: authToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          skipNextPushRef.current = false
          return
        }
        const { sessionToken, email, hasCloudData } = await response.json()
        accountSessionStorage.save({ token: sessionToken, email, expiresAt: Date.now() + SESSION_TTL_MS })
        setAccount({ email, hasCloudData })

        if (!hasCloudData) {
          // New account, or first device on this account: nothing to merge —
          // push this device's local data so it becomes the cloud copy.
          await pushSnapshot(sessionToken)
          skipNextPushRef.current = false
          return
        }

        const snapshot = await fetchSyncSnapshot(sessionToken).catch(() => null)
        if (!hasLocalSyncData(dataRef.current)) {
          // Existing account, fresh device with nothing of its own yet:
          // adopt the cloud copy wholesale.
          if (snapshot?.payload) {
            setProgress(snapshot.payload.progress ?? {})
            setDailyStreak(snapshot.payload.dailyStreak ?? {})
            setPoints(snapshot.payload.points ?? {})
            setErrorStats(snapshot.payload.errorStats ?? {})
          }
          setSyncStatus('synced')
          setLastSyncedAt(Date.now())
          skipNextPushRef.current = false
          return
        }

        // Both sides have data — ask the learner how to reconcile them
        // (see `MergeModal`/`handleResolveMerge`).
        setPendingMerge({ cloud: snapshot?.payload ?? {} })
      })
      .catch(() => {
        skipNextPushRef.current = false
      })
  }, [pushSnapshot])

  // Ongoing background sync: after any of the four storage saves above, while
  // signed in, debounce a `PUT /sync` of the latest data. If it fails, local
  // data stays the source of truth and the next save (or the next app load's
  // pull-merge) retries.
  useEffect(() => {
    if (!account || skipNextPushRef.current) return
    const session = accountSessionStorage.load()
    if (!session?.token) return
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      pushSnapshot(session.token)
    }, SYNC_PUSH_DEBOUNCE_MS)
    return () => clearTimeout(syncTimeoutRef.current)
  }, [account, progress, dailyStreak, points, errorStats, pushSnapshot])

  // Applies the learner's `MergeModal` choice and clears `pendingMerge`.
  const handleResolveMerge = useCallback(
    async (choice) => {
      const session = accountSessionStorage.load()
      const cloud = pendingMerge?.cloud ?? {}
      if (!session?.token) {
        setPendingMerge(null)
        skipNextPushRef.current = false
        return
      }
      setMergeApplying(true)
      setSyncStatus('syncing')
      try {
        if (choice === 'useDevice') {
          await pushSyncSnapshot(session.token, buildSyncPayload(dataRef.current))
        } else if (choice === 'useAccount') {
          setProgress(cloud.progress ?? {})
          setDailyStreak(cloud.dailyStreak ?? {})
          setPoints(cloud.points ?? {})
          setErrorStats(cloud.errorStats ?? {})
        } else {
          const merged = mergeSyncPayload(dataRef.current, cloud)
          setProgress(merged.progress)
          setDailyStreak(merged.dailyStreak)
          setPoints(merged.points)
          setErrorStats(merged.errorStats)
          dataRef.current = merged
          await pushSyncSnapshot(session.token, buildSyncPayload(merged))
        }
        setSyncStatus('synced')
        setLastSyncedAt(Date.now())
      } catch {
        setSyncStatus('error')
      } finally {
        setMergeApplying(false)
        setPendingMerge(null)
        skipNextPushRef.current = false
      }
    },
    [pendingMerge],
  )

  const handleSignOut = useCallback(async () => {
    const session = accountSessionStorage.load()
    accountSessionStorage.save(null)
    setAccount(null)
    setSyncStatus('idle')
    setLastSyncedAt(null)
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    if (!session?.token) return
    try {
      await fetch(`${SYNC_API_URL}/auth/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      })
    } catch {
      // Best-effort — the local session is already cleared above.
    }
  }, [])

  const handleStreakNudgeShown = useCallback(() => {
    setStreakNudgeCooldown(randomStreakNudgeCooldown())
  }, [])

  function handleResetProgress() {
    if (typeof window !== 'undefined' && !window.confirm(t('profileResetConfirm'))) {
      return
    }
    setProgress({})
    setDailyStreak({})
    setPoints({})
    setErrorStats({})
  }

  function handleRepairStreak() {
    if (typeof window !== 'undefined' && !window.confirm(t('streakRepairConfirm', { cost: STREAK_REPAIR_COST }))) {
      return
    }
    const { streak, points: nextPoints } = repairStreak(dailyStreak, points, getLocalDateString(), deviceId)
    setDailyStreak(streak)
    setPoints(nextPoints)
  }

  function handleSelectLesson(lessonId) {
    scrollBeforeLessonRef.current = window.scrollY
    setActiveLessonId(lessonId)
  }

  function handleReturnToHome() {
    setHomeScrollTarget(
      scrollBeforeLessonRef.current !== null ? { type: 'restore', y: scrollBeforeLessonRef.current } : null,
    )
    scrollBeforeLessonRef.current = null
    setActiveLessonId(null)
  }

  if (!hasChosenLanguage) {
    return <LanguageOnboardingScreen />
  }

  if (activeLessonId) {
    const lesson = LESSONS.find((l) => l.id === activeLessonId)
    return (
      <ExerciseScreen
        key={lesson.id}
        lesson={lesson}
        attempts={progress[lesson.id]?.attempts ?? 0}
        errorStats={errorStats}
        onExit={handleReturnToHome}
        canShowStreakNudge={streakNudgeCooldown === 0}
        onStreakNudgeShown={handleStreakNudgeShown}
        onComplete={(result) => {
          const isRepeat = (progress[lesson.id]?.attempts ?? 0) > 0
          const pointsEarned = computeLessonPoints(result.correctCount, result.total, isRepeat)
          trackEvent('lesson_completed', {
            lessonId: lesson.id,
            review: Boolean(lesson.review),
            correctCount: result.correctCount,
            total: result.total,
            stars: computeStars(result.correctCount, result.total),
            isRepeat,
            pointsEarned,
          })
          setProgress((previous) => recordResult(previous, lesson.id, result))
          setDailyStreak((previous) => recordDailyStreak(previous, getLocalDateString()))
          setPoints((previous) => addPoints(previous, pointsEarned, deviceId))
          setErrorStats((previous) => recordErrors(previous, result.misses))
          setStreakNudgeCooldown((cooldown) => Math.max(0, cooldown - 1))
          handleReturnToHome()
        }}
      />
    )
  }

  return (
    <>
      <HomeScreen
        progress={progress}
        streak={dailyStreak}
        points={points}
        account={account}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onSignOut={handleSignOut}
        tab={tab}
        onChangeTab={setTab}
        onSelectLesson={handleSelectLesson}
        onResetProgress={handleResetProgress}
        onRepairStreak={handleRepairStreak}
        scrollTarget={homeScrollTarget}
      />
      {pendingMerge && <MergeModal applying={mergeApplying} onChoose={handleResolveMerge} />}
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
