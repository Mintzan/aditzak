// Pure lesson/exercise logic, kept separate from App.jsx so it can be unit
// tested directly and so react-refresh only has to reason about components
// in App.jsx (it warns when a component file also exports plain functions).

export function computeStars(score, total) {
  if (total === 0) return 0
  const ratio = score / total
  if (ratio >= 1) return 3
  if (ratio >= 0.8) return 2
  if (ratio >= 0.5) return 1
  return 0
}

// Encouraging copy for the end-of-lesson screen, picked from the same
// score-ratio bands as `computeStars` so the message always matches the stars
// shown alongside it. `headline` is a Basque exclamation — kept as-is
// regardless of the interface language, as part of the app's voice.
// `messageKey` is looked up in the active interface language by the caller
// (via `useLanguage`'s `t`), since this module has no UI-language context of
// its own.
//
// Each star band has a few interchangeable variants so finishing a lesson
// with the same score twice in a row doesn't always show the exact same
// headline/message — `getEncouragement` takes a `variantIndex` (wrapped with
// modulo so any integer is safe) rather than rolling its own randomness, so
// it stays pure; callers pick the index via `pickEncouragementVariantIndex`.
const ENCOURAGEMENT_VARIANTS = {
  3: [
    { icon: '🎉', headline: 'Bikain!', messageKey: 'encouragementPerfect' },
    { icon: '🌟', headline: 'Ezin hobeto!', messageKey: 'encouragementPerfectAlt1' },
    { icon: '🏆', headline: 'Txapelduna!', messageKey: 'encouragementPerfectAlt2' },
  ],
  2: [
    { icon: '👏', headline: 'Oso ondo!', messageKey: 'encouragementGreat' },
    { icon: '😄', headline: 'Primeran!', messageKey: 'encouragementGreatAlt1' },
    { icon: '✨', headline: 'Aurrera!', messageKey: 'encouragementGreatAlt2' },
  ],
  1: [
    { icon: '💪', headline: 'Ondo!', messageKey: 'encouragementGood' },
    { icon: '👍', headline: 'Hor goaz!', messageKey: 'encouragementGoodAlt1' },
    { icon: '📈', headline: 'Gora!', messageKey: 'encouragementGoodAlt2' },
  ],
  0: [
    { icon: '🌱', headline: 'Ez etsi!', messageKey: 'encouragementKeepGoing' },
    { icon: '🔄', headline: 'Berriz ere!', messageKey: 'encouragementKeepGoingAlt1' },
    { icon: '🧭', headline: 'Aurrera segi!', messageKey: 'encouragementKeepGoingAlt2' },
  ],
}

export function getEncouragement(correctCount, total, variantIndex = 0) {
  const stars = computeStars(correctCount, total)
  const variants = ENCOURAGEMENT_VARIANTS[stars]
  return variants[variantIndex % variants.length]
}

export function pickEncouragementVariantIndex(correctCount, total) {
  const stars = computeStars(correctCount, total)
  return Math.floor(Math.random() * ENCOURAGEMENT_VARIANTS[stars].length)
}

// Mid-lesson momentum nudges: shown in the feedback bar exactly when a streak
// of consecutive correct answers *lands* on one of these milestones — not on
// every answer past it — so the message appears once per streak rather than
// repeating itself each turn. Same `headline`-stays-Basque /
// `messageKey`-is-translated split as `getEncouragement`.
const STREAK_MILESTONES = [
  { streak: 5, icon: '🔥', headline: 'Zoragarria!', messageKey: 'streak5' },
  { streak: 10, icon: '⚡', headline: 'Itzela!', messageKey: 'streak10' },
  { streak: 20, icon: '🚀', headline: 'Ikaragarria!', messageKey: 'streak20' },
]

export function getStreakEncouragement(streak) {
  return STREAK_MILESTONES.find((milestone) => milestone.streak === streak) ?? null
}

export function recordResult(progress, lessonId, result) {
  const previous = progress[lessonId]
  const stars = computeStars(result.correctCount, result.total)
  return {
    ...progress,
    [lessonId]: {
      attempts: (previous?.attempts ?? 0) + 1,
      bestScore: Math.max(result.correctCount, previous?.bestScore ?? 0),
      totalQuestions: result.total,
      bestStars: Math.max(stars, previous?.bestStars ?? 0),
      lastPlayed: new Date().toISOString(),
    },
  }
}

// Returns today's date as a 'YYYY-MM-DD' string in the learner's local
// timezone (as opposed to `toISOString`, which is UTC and could roll over to
// the next/previous day depending on the learner's offset). Streak logic
// always compares dates in this form.
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000

// Updates the daily streak after a lesson is completed. `today` is a
// 'YYYY-MM-DD' string (see `getLocalDateString`), passed in rather than
// computed here so this stays a pure, easily-testable function. Completing a
// lesson again on the same day is a no-op; completing one the day after
// `lastActiveDate` extends the streak; any bigger gap restarts it at 1.
export function recordDailyStreak(streak, today) {
  const { currentStreak = 0, longestStreak = 0, lastActiveDate = null } = streak ?? {}
  if (lastActiveDate === today) {
    return { currentStreak, longestStreak, lastActiveDate }
  }
  const isConsecutiveDay = lastActiveDate && Date.parse(today) - Date.parse(lastActiveDate) === ONE_DAY_MS
  const nextStreak = isConsecutiveDay ? currentStreak + 1 : 1
  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(nextStreak, longestStreak),
    lastActiveDate: today,
  }
}

// The streak as it should be *displayed*: still alive (today's or
// yesterday's `lastActiveDate`, so there's still time to extend it today) or
// broken (anything older), in which case it reads as 0 even though
// `currentStreak` itself isn't reset to 0 until the next completed lesson.
export function getActiveStreak(streak, today) {
  const { currentStreak = 0, lastActiveDate = null } = streak ?? {}
  if (!lastActiveDate) return 0
  const gap = Date.parse(today) - Date.parse(lastActiveDate)
  return gap > ONE_DAY_MS ? 0 : currentStreak
}

// =============================================================================
// Points (Duolingo-style "gems"), spendable to repair a broken streak
// =============================================================================

// A first-time pass through a lesson is worth more than a repeat — repeating
// a lesson you've already completed (any later attempt) earns half as much.
// Either way the award scales with accuracy, so a so-so run earns less than a
// perfect one.
const LESSON_POINTS_FIRST_ATTEMPT = 10
const LESSON_POINTS_REPEAT = 5

// Cost, in points, to repair a broken daily streak (see `repairStreak`).
export const STREAK_REPAIR_COST = 100

// Points earned for finishing a lesson with `correctCount`/`total`. `isRepeat`
// is whether this lesson already had at least one attempt recorded *before*
// this one (i.e. `(progress[lessonId]?.attempts ?? 0) > 0`).
export function computeLessonPoints(correctCount, total, isRepeat) {
  if (total === 0) return 0
  const base = isRepeat ? LESSON_POINTS_REPEAT : LESSON_POINTS_FIRST_ATTEMPT
  return Math.round(base * (correctCount / total))
}

// `points` is a PN-Counter (see `getPointsBalance`/`mergePoints` below): a
// device only ever increments its own `earned[deviceId]`, never touching
// another device's entries — which is what makes the cross-device merge
// lossless and order-independent.
export function addPoints(points, amount, deviceId) {
  return {
    earned: { ...(points?.earned ?? {}), [deviceId]: (points?.earned?.[deviceId] ?? 0) + amount },
    spent: points?.spent ?? {},
  }
}

// Shifts a 'YYYY-MM-DD' string by `days` (negative allowed). Operates purely
// on the UTC-midnight timestamps `Date.parse('YYYY-MM-DD')` produces, mirroring
// the date arithmetic `recordDailyStreak`/`getActiveStreak` already do, so the
// result stays a plain calendar-date string regardless of the caller's
// timezone.
function shiftDateString(dateString, days) {
  const shifted = new Date(Date.parse(dateString) + days * ONE_DAY_MS)
  const year = shifted.getUTCFullYear()
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0')
  const day = String(shifted.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// A broken streak (currentStreak > 0 but `getActiveStreak` reads 0 — see
// above) can be repaired if the learner has enough points.
export function canRepairStreak(streak, points, today) {
  const currentStreak = streak?.currentStreak ?? 0
  return currentStreak > 0 && getActiveStreak(streak, today) === 0 && getPointsBalance(points) >= STREAK_REPAIR_COST
}

// Spends `STREAK_REPAIR_COST` points to revive a broken streak: backdating
// `lastActiveDate` to "yesterday" makes `getActiveStreak` read `currentStreak`
// as alive again (gap back down to exactly one day) without touching
// `currentStreak`/`longestStreak` themselves — the streak resumes exactly
// where it left off, with today still open to extend it further. The cost is
// recorded as a `spent` increment for the current device (see `addPoints`).
export function repairStreak(streak, points, today, deviceId) {
  return {
    streak: { ...streak, lastActiveDate: shiftDateString(today, -1) },
    points: {
      earned: points?.earned ?? {},
      spent: { ...(points?.spent ?? {}), [deviceId]: (points?.spent?.[deviceId] ?? 0) + STREAK_REPAIR_COST },
    },
  }
}

// =============================================================================
// Cross-device sync: PN-Counter balance + per-field "keep the best of both" merge
// =============================================================================

// Displayed balance for the `{ earned, spent }` PN-Counter shape (each a
// `{ [deviceId]: number }` map, see `addPoints`/`repairStreak`) — also works
// for the empty `{}` shape `pointsStorage` defaults to (both maps default to
// `{}`, balance 0).
export function getPointsBalance(points) {
  const sum = (counters) => Object.values(counters ?? {}).reduce((total, value) => total + value, 0)
  return sum(points?.earned) - sum(points?.spent)
}

function dateOrEpoch(dateString) {
  return dateString ? Date.parse(dateString) : 0
}

// Per-lesson "keep the best of both": `attempts`/`bestScore`/`totalQuestions`/
// `bestStars` are each independently monotonic (they only grow within a
// device), so taking the max of each side is always safe and never loses
// progress. `lastPlayed` takes whichever side is more recent.
export function mergeProgress(local, cloud) {
  const merged = {}
  for (const lessonId of new Set([...Object.keys(local ?? {}), ...Object.keys(cloud ?? {})])) {
    const a = local?.[lessonId]
    const b = cloud?.[lessonId]
    if (!a) merged[lessonId] = b
    else if (!b) merged[lessonId] = a
    else {
      merged[lessonId] = {
        attempts: Math.max(a.attempts ?? 0, b.attempts ?? 0),
        bestScore: Math.max(a.bestScore ?? 0, b.bestScore ?? 0),
        totalQuestions: Math.max(a.totalQuestions ?? 0, b.totalQuestions ?? 0),
        bestStars: Math.max(a.bestStars ?? 0, b.bestStars ?? 0),
        lastPlayed: dateOrEpoch(a.lastPlayed) >= dateOrEpoch(b.lastPlayed) ? a.lastPlayed : b.lastPlayed,
      }
    }
  }
  return merged
}

// Unlike `progress`, `currentStreak`/`lastActiveDate` aren't independently
// monotonic — `currentStreak` resets to 1 after a gap, so maxing both sides
// could resurrect a streak that's actually broken on the more-recent side.
// Instead, the side with the more recent `lastActiveDate` wins for
// `currentStreak`/`lastActiveDate`; `longestStreak` (which only ever grows)
// is maxed across both regardless.
export function mergeDailyStreak(local, cloud) {
  const hasLocal = local && Object.keys(local).length > 0
  const hasCloud = cloud && Object.keys(cloud).length > 0
  if (!hasLocal) return cloud ?? {}
  if (!hasCloud) return local
  const longestStreak = Math.max(local.longestStreak ?? 0, cloud.longestStreak ?? 0)
  const newer = dateOrEpoch(local.lastActiveDate) >= dateOrEpoch(cloud.lastActiveDate) ? local : cloud
  return { currentStreak: newer.currentStreak ?? 0, longestStreak, lastActiveDate: newer.lastActiveDate ?? null }
}

// Union of both sides' missed-form counters (see `recordErrors`), keyed by
// `verbId:tense:person`. Overlapping entries take the higher `count` and the
// more recent `lastMissed`.
export function mergeErrorStats(local, cloud) {
  const merged = { ...(cloud ?? {}) }
  for (const [key, entry] of Object.entries(local ?? {})) {
    const existing = merged[key]
    merged[key] = !existing
      ? entry
      : {
          ...entry,
          count: Math.max(entry.count ?? 0, existing.count ?? 0),
          lastMissed:
            dateOrEpoch(entry.lastMissed) >= dateOrEpoch(existing.lastMissed) ? entry.lastMissed : existing.lastMissed,
        }
  }
  return merged
}

// The PN-Counter merge: union both sides' `deviceId` keys, `max` per counter
// per device. Lossless and order-independent — a device's own counters only
// ever grow, so the larger value of the two always reflects more (or equally)
// complete information from that device, regardless of which side is "local".
export function mergePoints(local, cloud) {
  const mergeCounters = (a, b) => {
    const merged = {}
    for (const deviceId of new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])) {
      merged[deviceId] = Math.max(a?.[deviceId] ?? 0, b?.[deviceId] ?? 0)
    }
    return merged
  }
  return { earned: mergeCounters(local?.earned, cloud?.earned), spent: mergeCounters(local?.spent, cloud?.spent) }
}

// "Keep the best of both" across all four synced fields — used for the
// first-sign-in `keepBest` merge choice and for the pull-merge that runs on
// every app load while already signed in (so edits made on another device
// since the last sync aren't lost or overwritten).
export function mergeSyncPayload(local, cloud) {
  return {
    progress: mergeProgress(local?.progress, cloud?.progress),
    dailyStreak: mergeDailyStreak(local?.dailyStreak, cloud?.dailyStreak),
    points: mergePoints(local?.points, cloud?.points),
    errorStats: mergeErrorStats(local?.errorStats, cloud?.errorStats),
  }
}

// Score threshold (≥80%, per `computeStars`) a `gate: true` unit's final
// lesson must reach before the lesson after it unlocks (see
// `getUnlockedLessonIds`/`isLockedByGateScore`) — `docs/LEARNING_JOURNEY_PROPOSED.md`,
// design principle 4. Below this the gate is a "soft wall": it stays
// replayable and nothing already-unlocked re-locks, but the next lesson
// shows a "needs 80% to continue" prompt instead of unlocking.
export const GATE_PASS_STARS = 2

// A lesson unlocks once the lesson before it has been attempted at least
// once, or once the lesson itself has — so a lesson the learner already
// completed never re-locks just because a new lesson (e.g. a unit review)
// gets inserted before it later. The one exception: if the previous lesson's
// id is in `gateLessonIds` (the final lesson of a `gate: true` unit — see
// `journey.js`'s `GATE_LESSON_IDS`), it must additionally reach
// `GATE_PASS_STARS` — merely attempting the gate isn't enough.
//
// Undocumented `?dev=unlock-all` query param bypasses this entirely and
// unlocks every lesson — for trying out/demoing any lesson without grinding
// through the journey. No UI toggle by design.
export function getUnlockedLessonIds(lessons, progress, search = window.location.search, gateLessonIds = new Set()) {
  if (new URLSearchParams(search).get('dev') === 'unlock-all') {
    return new Set(lessons.map((lesson) => lesson.id))
  }

  const unlocked = new Set()
  lessons.forEach((lesson, index) => {
    const previous = lessons[index - 1]
    const previousCleared =
      index === 0 ||
      (gateLessonIds.has(previous.id)
        ? (progress[previous.id]?.bestStars ?? 0) >= GATE_PASS_STARS
        : (progress[previous.id]?.attempts ?? 0) > 0)
    if (previousCleared || (progress[lesson.id]?.attempts ?? 0) > 0) {
      unlocked.add(lesson.id)
    }
  })
  return unlocked
}

// Whether `lessonId` is locked specifically because the `gate: true` unit
// before it was attempted but didn't reach `GATE_PASS_STARS` — as opposed to
// not having been attempted at all. Drives the "needs 80% to continue" prompt
// (`LessonNode`/`ProgressTab`) for the soft wall described above.
export function isLockedByGateScore(lessons, progress, gateLessonIds, lessonId) {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  if (index <= 0) return false
  const previous = lessons[index - 1]
  if (!gateLessonIds.has(previous.id)) return false
  const gateProgress = progress[previous.id]
  return (gateProgress?.attempts ?? 0) > 0 && (gateProgress?.bestStars ?? 0) < GATE_PASS_STARS
}

// Every `{ verbId, tense }` a practice lesson before `upToLessonId` (in
// `lessons` order) introduces — "what a learner reaching `upToLessonId` has
// already seen", position-based like `getUnlockedLessonIds`. Review lessons
// (no `verbId`/`tense` of their own) are skipped — as are "pool" lessons
// (`izan-past-pool`, `unit-10-present`, ...), which also lack `verbId`/`tense`
// of their own (they carry a `sources: [{ verbId, tense }, ...]` list instead,
// like a review). Without this second skip, those lessons would map to
// `{ verbId: undefined, tense: undefined }`; `getCrossVerbCandidates` happens
// to drop such entries silently (its `tense` filter never matches `undefined`),
// but `generateCrossVerbQuestions`/`generateCaseMixerQuestions` build
// `extraSiblingSources` by looking up `verbId` in `VERBS` and then reading
// `.id`/`.agreement` off the result — `VERBS.find` returns `undefined` for
// `verbId: undefined`, so `collectCrossSourceCandidates` would crash. Used to
// broaden the cross-verb candidate pools beyond a small review's own
// `sources` — since it only ever looks *before* `upToLessonId`, it can't
// surface a verb/tense the learner hasn't reached yet (no `future` spoilers in
// a `present`-tense review, etc.), even if that verb appears again later under
// a different tense.
export function getIntroducedSources(lessons, upToLessonId) {
  const cutoff = lessons.findIndex((lesson) => lesson.id === upToLessonId)
  const end = cutoff === -1 ? lessons.length : cutoff
  return lessons
    .slice(0, end)
    .filter((lesson) => !lesson.review && lesson.verbId)
    .map(({ verbId, tense }) => ({ verbId, tense }))
}

// The id of the lesson the learner most recently completed (by `lastPlayed`),
// or `null` if no lesson has been attempted yet — used to scroll the home
// screen to that lesson on initial load.
export function getLastPlayedLessonId(progress) {
  let latestId = null
  let latestTime = -Infinity
  for (const [lessonId, entry] of Object.entries(progress ?? {})) {
    const time = Date.parse(entry.lastPlayed)
    if (!Number.isNaN(time) && time > latestTime) {
      latestTime = time
      latestId = lessonId
    }
  }
  return latestId
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase()
}

// Shared correctness check for both interaction styles: picking an option
// (always an exact string from the same lookup table the correct answer comes
// from, so normalising is a no-op) and typing one in (where a learner
// shouldn't be marked wrong over capitalisation or stray whitespace).
export function isAnswerCorrect(submitted, correct) {
  return normalizeAnswer(submitted) === normalizeAnswer(correct)
}

export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Chance that a person with supporting data for a "fill the blank" framing
// (an example sentence, a declined pronoun) gets asked that way rather than as
// a bare-form question — rolled once per question, and split evenly between
// whichever framings are available, so a lesson ends up with an organic mix of
// styles rather than being uniformly one or the other. Weighted well above
// 50/50 so a real Basque sentence is the common case and the bare "hura → ?"
// framing is the occasional variation, not the other way around.
const SPECIAL_QUESTION_CHANCE = 0.75

// A single roll decides both *whether* a question gets a special framing and,
// if so, *which* one: `[0, SPECIAL_QUESTION_CHANCE)` is divided into one equal
// slice per available kind, `[SPECIAL_QUESTION_CHANCE, 1)` falls back to
// `form`. Equivalent in distribution to rolling "is it special?" and "which
// one?" separately, but with a single `Math.random` call to reason about.
function rollQuestionKind(availableKinds) {
  if (availableKinds.length === 0) return 'form'
  const roll = Math.random()
  if (roll >= SPECIAL_QUESTION_CHANCE) return 'form'
  const slice = SPECIAL_QUESTION_CHANCE / availableKinds.length
  return availableKinds[Math.floor(roll / slice)]
}

// Builds the options for a multiple-choice question from a person → form
// lookup table: the correct form for `person` plus three other forms from the
// same table as distractors, all shuffled together. Used both for bare/
// sentence verb-form questions (table = conjugations) and pronoun questions
// (table = declined pronouns), so every option is always a plausible answer of
// the same kind as the correct one.
//
// `extraCandidates` (optional) are additional forms — from a review's sibling
// sources, see `getCrossVerbCandidates` — merged into the same pool before
// picking distractors, occasionally surfacing a "right shape, wrong verb"
// option (e.g. `egon`'s `nago` as a distractor for `izan`'s `naiz`) alongside
// the usual "right verb, wrong person" ones. Deduplicated against `correct`
// and each other so the same surface form never appears twice in `options`.
// `borrowPool` (optional, see `getBorrowedDistractors`) is a last-resort
// top-up: only consulted when the own-table pool (`persons` + `extraCandidates`)
// can't supply 3 distractors on its own (e.g. a 3-person table like the
// upcoming imperative unit, or `nahi`/`jakin`'s 3-person `present`/`future`).
// Existing 4+-person tables are unaffected — the dedup/length check is a no-op
// for them.
//
// `priorityCandidates` (optional, see `getCaseFrameLure`/`getCaseFramePronounLure`/
// `getCrossTenseLure`) are `{ form, errorType }` pairs guaranteed a distractor
// slot (ahead of the random `pool` sample) when `form` is present, distinct
// from `correct`, and not already in `pool` — #141's matrix-row-specific
// "diagnosable mistake" slots (ergative drift, cross-pool aux, wrong tense).
// Each still counts toward the 3-distractor cap, so a table with few
// own-person candidates yields fewer random ones, not more options overall.
// `errorType` is carried through to `buildOptions`'s `optionRationale` (see
// [C2]/#229) so a lure that's picked can be explained after the fact.
//
// Every candidate is tagged with its provenance — `'same-table'` (the other
// persons' forms from `table`), `'sibling'` (`extraCandidates`/`borrowPool`,
// i.e. another verb's form), or `'lure'` (`priorityCandidates`) — so callers
// can reason about *where* a distractor came from. This tagging is purely
// internal bookkeeping: `options` is still the same flat array of form
// strings it always was, in the same order, for a given RNG seed (see
// [B1]/#226).
//
// `grounded` (default `true`, see [B2]/#227) is the single invariant that
// decides whether a question may show another verb's form at all: a bare
// `kind: 'form'` question has no sentence and no visible verb name to anchor
// correctness, so for it `grounded` is passed as `false`, which drops
// `extraCandidates`/`borrowPool`/`priorityCandidates` entirely and builds
// distractors only from `sameTable` — the only forms a learner can tell
// apart from the correct answer without any grounding context. Every other
// question kind (`sentence`/`negative`/`pronoun`) has that context and stays
// `grounded: true`.
function dedupeBySourceForm(candidates) {
  const seen = new Set()
  const deduped = []
  for (const candidate of candidates) {
    if (seen.has(candidate.form)) continue
    seen.add(candidate.form)
    deduped.push(candidate)
  }
  return deduped
}

// Same as `buildOptions`, but returns the chosen distractors still tagged
// with their provenance (`{ form, source }`) instead of collapsing them to
// plain strings — exported only so tests can lock the tagging contract B2
// relies on; `buildOptions` itself is the one production call sites use.
export function buildTaggedOptions(table, persons, person, extraCandidates = [], borrowPool = [], priorityCandidates = [], grounded = true) {
  const correct = table[person]
  const sameTable = persons
    .filter((candidate) => candidate !== person)
    .map((candidate) => ({ form: table[candidate], source: 'same-table' }))
  if (!grounded) {
    const distractors = shuffle(dedupeBySourceForm(sameTable).filter((candidate) => candidate.form !== correct)).slice(0, 3)
    return { correct, distractors }
  }
  const sibling = extraCandidates.map((form) => ({ form, source: 'sibling' }))
  const pool = [...sameTable, ...sibling].filter((candidate) => candidate.form !== correct)
  const priority = dedupeBySourceForm(
    priorityCandidates.map((candidate) => ({ form: candidate.form, errorType: candidate.errorType, source: 'lure' })),
  ).filter((candidate) => candidate.form && candidate.form !== correct)
  const priorityForms = new Set(priority.map((candidate) => candidate.form))
  const rest = shuffle(dedupeBySourceForm(pool).filter((candidate) => !priorityForms.has(candidate.form)))
  let distractors = [...priority, ...rest].slice(0, 3)
  if (distractors.length < 3 && borrowPool.length > 0) {
    const distractorForms = new Set(distractors.map((candidate) => candidate.form))
    const borrowedCandidates = borrowPool.map((form) => ({ form, source: 'sibling' }))
    const borrowed = shuffle(dedupeBySourceForm(borrowedCandidates).filter((candidate) => candidate.form !== correct && !distractorForms.has(candidate.form)))
    distractors = [...distractors, ...borrowed].slice(0, 3)
  }
  return { correct, distractors }
}

// [C2]/#229: which i18n key explains a given lure `errorType` — see
// `getCaseFrameLure`/`getCrossTenseLure`/`getObjectNumberLure`'s doc comments
// for what each one means.
const LURE_WHY_KEYS = {
  'case-frame': 'lureRationaleCaseFrame',
  tense: 'lureRationaleTense',
  'object-number': 'lureRationaleObjectNumber',
  'progressive-vs-plain': 'lureRationaleProgressiveVsPlain',
  'dative-overgeneration': 'lureRationaleDativeOvergeneration',
}

function buildOptions(table, persons, person, extraCandidates = [], borrowPool = [], priorityCandidates = [], grounded = true) {
  const { correct, distractors } = buildTaggedOptions(table, persons, person, extraCandidates, borrowPool, priorityCandidates, grounded)
  const optionRationale = {}
  for (const candidate of distractors) {
    if (candidate.source === 'lure' && LURE_WHY_KEYS[candidate.errorType]) {
      optionRationale[candidate.form] = { errorType: candidate.errorType, whyKey: LURE_WHY_KEYS[candidate.errorType] }
    }
  }
  return { correct, options: shuffle([correct, ...distractors.map((candidate) => candidate.form)]), optionRationale }
}

// Whether two verbs' subject-marking is compatible enough that one's
// conjugated form could plausibly (if incorrectly) fill the other's blank —
// `nor` (absolutive-only: izan, egon, joan, etorri, ari) vs `nor-nork`
// (ergative subject: ukan, nahi, jakin, ...) vs `nor-nori-nork` (ditransitive:
// esan, eman, ...). Mixing across these boundaries would produce a
// structurally broken sentence rather than a "wrong verb, right shape"
// distractor — that's deliberately out of scope here (see Delivery 3 in
// `docs/EXERCISE_VARIETY_PLAN.md`). No current verb has `nori`, so the added
// check is a no-op until #147 adds the first ditransitive verb.
export function agreementsCompatible(a, b) {
  return a.includes('nork') === b.includes('nork') && a.includes('nori') === b.includes('nori')
}

// Finds the sibling verb whose subject-marking is the *case-frame inverse* of
// `agreement` — same `nori` status, but the opposite `nork` status (`nor` <->
// `nor-nork`, e.g. izan <-> ukan; or, since #165 generalized this beyond
// #141's izan/ukan-only core scope, `nor-nori` <-> `nor-nori-nork`, e.g.
// gustatu <-> esan). Used by the "ergative drift" distractor slot: a verb's
// case-frame-inverse sibling's same-person form is a plausible-looking but
// case-mismatched answer (`naiz` offered alongside `dut`, `gustatzen zait`
// offered alongside `esaten diot`, `Nik` offered alongside `Ni`). Returns the
// first such sibling in `verbs`, or `undefined` if `verbs`/`agreement` is
// missing or none qualifies.
function getCaseFrameSibling(verbs, agreement) {
  if (!verbs || !agreement) return undefined
  return verbs.find(
    (sibling) =>
      sibling.agreement &&
      sibling.agreement.includes('nori') === agreement.includes('nori') &&
      sibling.agreement.includes('nork') !== agreement.includes('nork'),
  )
}

// The case-frame-inverse sibling's (see `getCaseFrameSibling`) same-person/
// tense conjugated form — `dut` for `naiz`, `nuen` for `nintzen`, etc. — #141's
// "NOR-NORK present" Slot 3 and "Past pools" Slot 2.
export function getCaseFrameLure(verbs, verb, tense, person) {
  return getCaseFrameSibling(verbs, verb.agreement)?.conjugations[tense]?.[person]
}

// The case-frame-inverse sibling's (see `getCaseFrameSibling`) declined
// pronoun for the same person — `Nik` offered alongside `Ni`, or vice versa —
// #141's "Case-marking checkpoint" Slot 1, the "wrong-case subject"
// (ergative-drift) trap for `pronoun` questions.
export function getCaseFramePronounLure(verbs, verb, person) {
  return getCaseFrameSibling(verbs, verb.agreement)?.pronouns?.[person]
}

// For a past-tense question, the verb's own *present*-tense form for the same
// person — #141's "Past pools" Slot 3 ("present same-person form"): a
// plausible answer for the right verb and person, but the wrong tense (e.g.
// `naiz` offered alongside `nintzen`). `undefined` for any tense but `past`.
export function getCrossTenseLure(verb, tense, person) {
  if (tense !== 'past') return undefined
  return verb.conjugations.present?.[person]
}

// #283's "recency contrast" lure: present perfect and simple past share the
// same participle and differ only in the auxiliary's own tense (`etorri
// naiz` vs. `etorri nintzen`, `ikusi dut` vs. `ikusi nuen`) — the exact
// confusion Unit 11 teaches (`gaur ... da` vs. `atzo ... zen`). Returns the
// verb's own form in the *other* of these two tenses, same person; separate
// from `getCrossTenseLure` above (which only covers past <-> present) so
// both can surface as distinct guaranteed distractors on a past-tense
// question. `undefined` for any tense but `presentPerfect`/`past`, or
// without a table for the other tense (every verb except `izan`/`joan`/
// `etorri`/`ikusi` today, see #281).
export function getRecencyContrastLure(verb, tense, person) {
  if (tense === 'presentPerfect') return verb.conjugations.past?.[person]
  if (tense === 'past') return verb.conjugations.presentPerfect?.[person]
  return undefined
}

// The verb's own plural-object form for the same person/tense (`gustatzen
// zaizkit` offered alongside `gustatzen zait`, `esaten dizkiot` offered
// alongside `esaten diot`) — #165's "wrong object number" slot for NOR-NORI
// and NOR-NORI-NORK verbs, using #164/#162's `<tense>Plural` fodder.
// `undefined` for any verb/tense with no `<tense>Plural` table (everything
// else).
export function getObjectNumberLure(verb, tense, person) {
  return verb.conjugations[`${tense}Plural`]?.[person]
}

// The embedded base verb's plain present, for the same person — #230's
// targeted `ari izan` progressive-vs-plain lure ("jaten dut" offered
// alongside "ari naiz", for "Ni jaten ___."). `baseVerbId` comes from a
// sentence variant's `baseVerb` tag (see `ari`'s `sentences` in
// `verbs.js`) rather than parsing the participle string, so it's a no-op —
// returns `undefined` — for any sentence without one, i.e. every verb but
// `ari` today.
export function getProgressiveBaseLure(verbs, baseVerbId, person) {
  if (!baseVerbId) return undefined
  return verbs?.find((candidate) => candidate.id === baseVerbId)?.conjugations.present?.[person]
}

// #293's "dative overgeneration" sibling: same `nork` status as `agreement`
// but the opposite `nori` status — the inverse axis from `getCaseFrameSibling`
// (which holds `nori` fixed and flips `nork`). Also requires `recipient` (not
// `agent`) so the sibling's `person` key means the same thing (NORK) as the
// NOR-NORK verb's own `person` — `esan` qualifies, `eman` (NORI-keyed,
// `agent` fixed) doesn't, since swapping in an `eman` form would pair up two
// persons that don't actually correspond.
function getDativeOvergenerationSibling(verbs, agreement) {
  if (!verbs || !agreement) return undefined
  return verbs.find(
    (sibling) =>
      sibling.agreement &&
      sibling.recipient !== undefined &&
      sibling.agreement.includes('nork') === agreement.includes('nork') &&
      sibling.agreement.includes('nori') !== agreement.includes('nori'),
  )
}

// #293: learners drilling verbs that are modeled as plain NOR-NORK but are
// optionally ditransitive in real usage ("eraman" = carry *something to
// someone*) commonly insert a phantom dative and reach for the NOR-NORI-NORK
// auxiliary family instead (`eramango diot` for the correct `eramango dut`).
// Unlike `getCaseFrameLure`, the verb's own participle is correct — only the
// auxiliary *family* is wrong — so this swaps just the auxiliary half of a
// periphrastic form (`<participle> <auxiliary>`) for the
// `getDativeOvergenerationSibling`'s same-tense/person auxiliary, rather than
// substituting a whole borrowed form. Requires the verb to be flagged
// `dativeOvergeneration: true` in `verbs.js` (only the "transfer/handling"
// verbs learners actually over-extend this way, not every NOR-NORK verb —
// see #293) and both forms to actually be periphrastic (two words); returns
// `undefined` otherwise, e.g. for `eraman`'s synthetic present (`daramat`,
// no auxiliary to swap).
// `objectAxis` (#379, optional) — same `resolveObjectAxisTable` resolution
// `hasAmbiguousTypedForm` already does (#350), needed once a
// `dativeOvergeneration: true` verb (`erosi`/`hartu`) gets a 2D
// `presentByObject`/`pastByObject` table: looking up `[person]` directly on
// that table would return a nested object, not a form string.
export function getDativeOvergenerationLure(verbs, verb, tense, person, objectAxis) {
  if (!verb.dativeOvergeneration) return undefined
  const resolveTable = (v) => {
    const table = v?.conjugations[tense]
    if (!table) return undefined
    return objectAxis ? resolveObjectAxisTable(table, objectAxis) : table
  }
  const ownForm = resolveTable(verb)?.[person]
  if (!ownForm?.includes(' ')) return undefined
  const siblingForm = resolveTable(getDativeOvergenerationSibling(verbs, verb.agreement))?.[person]
  if (!siblingForm?.includes(' ')) return undefined
  const participle = ownForm.slice(0, ownForm.lastIndexOf(' '))
  const auxiliary = siblingForm.slice(siblingForm.lastIndexOf(' ') + 1)
  return `${participle} ${auxiliary}`
}

// For a NOR-NORI-NORK (ditransitive) verb, resolves its axis-fixed metadata
// (#142, mirroring `object: 'hura'`'s role for `nor-nork` verbs) into
// `{ role, person }`: `recipient` fixes NORI (`role: 'nori'`) so
// `conjugations[tense][person]` varies over NORK (e.g. `recipient: 'hura'` ->
// `diot`/`diozu`/`dio`/... "I/you/he tell *him*"); `agent` fixes NORK
// (`role: 'nork'`) so `person` varies over NORI (e.g. `agent: 'ni'` ->
// `diot`/`dizut`/`diet`/... "I tell him/you/them"). Returns `null` for verbs
// with neither field set — every verb today, until #147 adds `esan`/`eman`.
export function getFixedArgument(verb) {
  if (verb.recipient) return { role: 'nori', person: verb.recipient }
  if (verb.agent) return { role: 'nork', person: verb.agent }
  return null
}

// #346: resolves a `nor-nork` verb's real 2D conjugation table
// (`{ [nork]: { [nor]: form } }`, opted into per verb/tense — see the
// `object`-vs-2D note in `data/verbs.js`) down to the flat `{ [person]: form }`
// shape every other consumer in this file (`buildOptions`, sentences, lures,
// ...) already expects, for whichever axis a lesson declares it's drilling:
//   - `vary: 'nor'` drills the object — `nork` is pinned at `fixed`, and the
//     resulting table's keys range over `nor` (e.g. against `ukan`'s grid,
//     `{ vary: 'nor', fixed: 'ni' }` -> `{ hura: 'dut', zu: 'zaitut', ... }`,
//     "I have/see *you/him/them/...*").
//   - `vary: 'nork'` drills the subject — `nor` is pinned at `fixed`, and the
//     resulting table's keys range over `nork`. Same shape `object: 'hura'`
//     already produces for the citation paradigm, but expressible here too
//     for a non-`hura` fixed object once a verb's 2D table is authored.
// Whichever axis is pinned, a `nork`/`nor` value with no cell for `fixed`
// (a gap — `hi`, or one of the reflexive cells `data/verbs.js` documents) is
// simply absent from the result, same as a single-axis table never having
// had that person in the first place.
//
// The implementation below never references `nor`/`nork` by name — it only
// cares which side is outer vs. inner — so the exact same shape and `vary`
// values work unchanged for a nor-nori verb's outer-NORI/inner-NOR table
// (e.g. `gustatu.presentByNor`, #358): `{ vary: 'nor', fixed: 'zu' }` pins
// `nori` at `zu` and varies `nor`, same as it pins `nork` for `ukan`.
export function resolveObjectAxisTable(table2D, { vary, fixed }) {
  if (vary === 'nor') return table2D[fixed] ?? {}
  const table = {}
  for (const nork of Object.keys(table2D)) {
    const form = table2D[nork][fixed]
    if (form) table[nork] = form
  }
  return table
}

// Whether `verb`'s `[tense][person]` form is a "particle + auxiliary"
// compound (e.g. `nahi`'s `nahi dut`) whose trailing word is *itself* a
// complete, correct form of some other agreement-compatible verb for the same
// `[tense][person]` (e.g. `ukan`'s `dut`). When that's the case, a fill-in-
// the-blank sentence built for `verb` (e.g. "Nik liburu bat ___.") is
// genuinely ambiguous for a *typed* answer: typing just the trailing word
// ("dut") produces a different but equally grammatical Basque sentence ("Nik
// liburu bat dut" = "I have a book", vs the intended "Nik liburu bat nahi
// dut" = "I want a book") — a learner who knows that other verb is marked
// wrong for producing correct Basque. Multiple-choice framings aren't
// affected: their `options` are drawn from `verb`'s own table, so the
// ambiguous bare form never appears as a choice. `verbs` (optional, the full
// `VERBS` list) — without it this always returns `false`, so existing callers
// that don't pass it are unaffected.
// `objectAxis` (#350, optional) — when the calling lesson drills a 2D
// NOR-NORK object-axis table (see `generateQuestions`'s `objectAxis` doc
// comment), `tense` keys a `{ [nork]: { [nor]: form } }` table rather than a
// flat one: looking up `[person]` directly would either grab the wrong
// (nork-keyed) row or return a nested object instead of a string. Resolving
// through `resolveObjectAxisTable` first, for both `verb` and any sibling
// `other` that happens to carry the same 2D tense, keeps this comparison
// working the same way it does for a flat table — a sibling with no table at
// all for `tense` (the common case) simply contributes no match, same as
// before.
function hasAmbiguousTypedForm(verb, tense, person, verbs, objectAxis) {
  const resolveTable = (v) => {
    const table = v.conjugations[tense]
    if (!table) return undefined
    return objectAxis ? resolveObjectAxisTable(table, objectAxis) : table
  }
  const form = resolveTable(verb)?.[person]
  if (!verbs || !form || !form.includes(' ')) return false
  const trailing = form.slice(form.lastIndexOf(' ') + 1)
  return verbs.some(
    (other) => other.id !== verb.id && agreementsCompatible(other.agreement, verb.agreement) && resolveTable(other)?.[person] === trailing,
  )
}

// For a review lesson's source `{ verbId, tense }` (already resolved to
// `verb`), collects each grammatical person's conjugated form from the
// review's *other* sources (`sources`, the full resolved list including this
// one) — restricted to sources whose verb has compatible subject-marking (see
// `agreementsCompatible`) — as extra distractor candidates. Returns
// `{ [person]: Array<{ verbId, form }> }`, passed through to
// `generateQuestions`'s `extraCandidates`; `filterExtraCandidates` then narrows
// each person's list down to the forms a given sentence's `validFor` tag (see
// `docs/SENTENCE_FRAMES.md`) allows, before handing the survivors to
// `buildOptions`. Only persons present in `verb.conjugations[tense]` get an
// entry, and only if at least one compatible sibling has a form for that
// person.
//
// `extraSources` (optional, same `{ verbId, tense }` shape as `sources` —
// see `getIntroducedSources`) is a fallback pool for reviews whose own
// `sources` are too few to give much variety (Delivery 4): merged in
// alongside `sources`, deduped, and restricted to the same `tense` as this
// candidate lookup (so a `present`-tense review never pulls in a sibling
// verb's `past`/`future` forms as same-person distractors — that'd be a
// tense mismatch on top of a verb mismatch, not the "right shape, wrong
// verb" distractor this is meant to be).
export function getCrossVerbCandidates(verb, tense, sources, verbs, extraSources = []) {
  const known = new Set(sources.map((source) => `${source.verbId}:${source.tense}`))
  const pool = [...sources, ...extraSources.filter((source) => source.tense === tense && !known.has(`${source.verbId}:${source.tense}`))]
  const siblings = pool.filter((source) => !(source.verbId === verb.id && source.tense === tense))
  const candidates = {}
  for (const person of Object.keys(verb.conjugations[tense] ?? {})) {
    const forms = siblings
      .map(({ verbId, tense: siblingTense }) => {
        const siblingVerb = verbs.find((v) => v.id === verbId)
        if (!siblingVerb || !agreementsCompatible(siblingVerb.agreement, verb.agreement)) return null
        const form = siblingVerb.conjugations[siblingTense]?.[person]
        return form ? { verbId: siblingVerb.id, form } : null
      })
      .filter(Boolean)
    if (forms.length > 0) candidates[person] = forms
  }
  return candidates
}

// Last-resort distractor top-up for `buildOptions` (see #139): for a given
// `person`/`tense`, collects that same-slot conjugated form from every
// `agreementsCompatible` sibling in `verbs` (skipping `excludeVerbId`, the
// anchor verb itself). Used only when a table is too small (e.g. a 3-person
// paradigm) to supply 3 distractors on its own — `buildOptions` dedupes and
// caps the combined pool, so no capping happens here. Returns `[]` without
// `verbs` (the original same-table-only behaviour).
//
// Returns `Array<{ verbId, form }>`, not plain strings (see [B2]/#227): a
// borrowed form is exactly as much a "sibling form" as an
// `extraCandidates`/`getCrossVerbCandidates` one, so it needs the same
// `verbId` tag to be narrowed by `filterExtraCandidates` against a
// sentence's `validFor` before it's shown — without that, a sentence whose
// `validFor` lists a sibling could still surface that sibling's form via
// borrowing, bypassing the very check `validFor` exists to enforce.
function getBorrowedDistractors(verbs, agreement, tense, person, excludeVerbId) {
  if (!verbs || !agreement) return []
  return verbs
    .filter((sibling) => sibling.id !== excludeVerbId && agreementsCompatible(sibling.agreement, agreement))
    .map((sibling) => ({ verbId: sibling.id, form: sibling.conjugations[tense]?.[person] }))
    .filter((candidate) => candidate.form)
}

// Last-resort slot top-up for `buildSpotErrorQuestion` (see #139): when the
// anchor verb has fewer than 4 `personsWithSentences`, lends a compatible
// sibling's own (person, sentence, form) slots — genuinely correct sentences
// from the sibling's *own* paradigm, eligible to be either a "correct"
// companion or the deliberately-mismatched item, exactly like an anchor slot.
// `altForms` (the same sibling's other-person forms) travels with each
// borrowed slot so a mismatch never mixes a sibling's sentence with the
// anchor's (or a different sibling's) forms. `excludePersons` (the anchor's
// own `personsWithSentences`) keeps a borrowed slot's person distinct from
// the anchor's own slots — only a sibling with at least one *extra* person
// (e.g. `ukan`'s `gu`/`zuek`/`haiek` beyond `nahi`/`jakin`'s `ni`/`zu`/`hura`)
// can contribute. Requires >=2 sentenced persons in the sibling (so a
// mismatch has an `altForms` candidate). Returns `[]` without `verbs`.
function getBorrowedSpotErrorSlots(verbs, agreement, tense, excludeVerbId, excludePersons) {
  if (!verbs || !agreement) return []
  const slots = []
  for (const sibling of verbs) {
    if (sibling.id === excludeVerbId || !agreementsCompatible(sibling.agreement, agreement)) continue
    const siblingSentences = sibling.sentences?.[tense] ?? {}
    const siblingTable = sibling.conjugations[tense] ?? {}
    const siblingPersons = Object.keys(siblingSentences).filter((p) => siblingTable[p])
    if (siblingPersons.length < 2) continue
    for (const p of siblingPersons) {
      if (excludePersons.includes(p)) continue
      const sentence = normalizeSentence(pickVariant(siblingSentences[p]))
      if (!sentence) continue
      slots.push({
        verbId: sibling.id,
        person: p,
        sentence: sentence.text,
        form: siblingTable[p],
        altForms: siblingPersons.filter((other) => other !== p).map((other) => siblingTable[other]),
      })
    }
  }
  return slots
}

// `sentences[tense][person]` may be a single string or an array of phrasing
// variants (different contexts for the same person/blank, e.g. "Ni irakaslea
// ___." vs "Ni turista ___."); picking one at random per question keeps a
// lesson from showing the exact same sentence every time it cycles back to a
// given person, while a plain string (still used by verbs without variants)
// is returned as-is.
export function pickVariant(value) {
  return Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value
}

// A sentence-bearing entry (`sentences`/`pronounSentences`/`negativeSentences`
// `[tense][person]`, after `pickVariant`) is either a bare string — untagged,
// pre-`validFor` migration (see `docs/SENTENCE_FRAMES.md`) — or a
// `{ text, validFor }` object. Normalizes either shape to `{ text, validFor }`
// so callers can read `.text` uniformly; a bare string normalizes to
// `validFor: undefined` (the "not yet vetted" state — see
// `filterExtraCandidates`). `undefined` (no sentence for this person) passes
// through unchanged, so callers can keep using its truthiness to detect that.
export function normalizeSentence(value) {
  if (value === undefined) return undefined
  if (typeof value === 'string') return { text: value }
  return value
}

// Narrows a person's cross-verb candidates (`Array<{ verbId, form }>` from
// `getCrossVerbCandidates`/`collectCrossSourceCandidates`'s sibling pool, or
// `undefined` if there are none) down to the forms allowed to appear as
// distractors alongside a sentence with the given `validFor` tag — see
// `docs/SENTENCE_FRAMES.md`:
//   - `validFor` absent (untagged, not yet vetted) — the safe default: exclude
//     every sibling, returning `[]`.
//   - `validFor: []` (explicitly empty, vetted) — exclude nothing: every
//     candidate's form stays eligible.
//   - `validFor: [...verbIds]` — exclude only the listed siblings (their form
//     would *also* correctly complete this exact sentence).
export function filterExtraCandidates(candidates, validFor) {
  if (!candidates || validFor === undefined) return []
  return candidates.filter(({ verbId }) => !validFor.includes(verbId)).map(({ form }) => form)
}

// Builds a "spot the error" question: four fully filled-in example sentences —
// the slot's own person plus three random companions sampled from whichever
// persons have sentence data for this tense — with exactly one sentence's
// blank filled by a *different* person's conjugated form, so it reads as a
// subject/verb mismatch ("Hura medikua naiz." — `naiz` is `ni`'s form, not
// `hura`'s). The learner picks the one sentence that's wrong; `correct` holds
// that sentence's text so the existing options/grading machinery (string
// equality via `isAnswerCorrect`, `getOptionStatus`) needs no changes to
// support it. Reuses exactly the same `sentences` data as `sentence`/
// `type-verb` — just filling the blank itself instead of leaving it open —
// so any verb that supports those automatically supports this too, once it
// has at least four sentenced persons to draw four *distinct* sentences from.
//
// `borrowedSlots` (optional, see `getBorrowedSpotErrorSlots`) tops up the
// companion pool when the anchor verb itself has fewer than 4
// `personsWithSentences` (e.g. a 3-person table) — each borrowed slot is a
// genuinely correct sentence+form from a compatible sibling's own paradigm,
// eligible to be either a "correct" companion or the mismatched item, exactly
// like an anchor slot. Every slot (own or borrowed) carries its own
// `altForms` (that same verb's other-person forms), so a mismatch never mixes
// one verb's sentence with another's forms.
function buildSpotErrorQuestion(table, sentences, personsWithSentences, person, borrowedSlots = []) {
  const ownSlots = personsWithSentences.map((p) => ({
    person: p,
    sentence: normalizeSentence(pickVariant(sentences[p])).text,
    form: table[p],
    altForms: personsWithSentences.filter((other) => other !== p).map((other) => table[other]),
  }))
  const anchorSlot = ownSlots.find((slot) => slot.person === person)
  const companions = shuffle([...ownSlots.filter((slot) => slot.person !== person), ...borrowedSlots]).slice(0, 3)
  const candidates = shuffle([anchorSlot, ...companions])
  const wrongIndex = Math.floor(Math.random() * candidates.length)
  const items = candidates.map((slot, index) => {
    const isWrong = index === wrongIndex
    const form = isWrong ? shuffle(slot.altForms)[0] : slot.form
    return { person: slot.person, sentence: slot.sentence.replace('___', form) }
  })
  return {
    kind: 'spot-error',
    person,
    items,
    options: items.map((item) => item.sentence),
    correct: items[wrongIndex].sentence,
  }
}

// Minimum word count (post-fill, post-split) for a sentence to be eligible
// for `kind: 'word-order'` — see `docs/EXERCISE_ENGINE.md`'s "Word-order
// question contract (#185)". Below this, a shuffled cloud has too few
// permutations (a 3-word sentence has only 6) to test real word-order
// knowledge rather than trial-and-error.
export const WORD_ORDER_MIN_WORDS = 4

// Maximum word count for the same eligibility check (#315). The cultural
// sentence bank runs long — some adopted variants clear 10+ words — and
// past that, the shuffled cloud stops testing word-order knowledge and
// starts testing working memory instead. 9 keeps the bulk of the curated
// "ready" sentences (most land in the 6-9 word range) eligible while
// excluding the handful of longer, more syntactically elaborate ones.
export const WORD_ORDER_MAX_WORDS = 9

// Builds a "reassemble the sentence" question: `sentence`'s blank gets
// filled with `table[person]` (same as `sentence`/`negative` already do), a
// trailing `.` or `?` stripped off and carried separately as `punctuation`
// (#214) — otherwise it glues onto the last word and becomes something the
// learner has to account for when tapping the order, even though it's never
// something the order-of-words drill is meant to test. The UI (see
// `WordOrderBoard`) renders `punctuation` as a fixed mark after the
// assembled tokens rather than dropping it, so the displayed sentence still
// reads as complete. What's left is split into a shuffled cloud of
// `{ id, text }` tokens — `id` is the token's position in the *original*
// sentence, so two instances of the same word stay distinguishable to the
// UI. `correct` stays the plain filled sentence string, punctuation-less:
// the UI rejoins whichever tokens the learner taps (in tap order) with `' '`
// and submits that through the existing `submitAnswer`, so
// `isAnswerCorrect`/`exerciseReducer`'s `case 'answer'` need no changes.
function buildWordOrderQuestion(table, sentence, person) {
  const filled = sentence.text.replace('___', table[person])
  const punctuation = /[.?]$/.test(filled) ? filled.slice(-1) : ''
  const text = punctuation ? filled.slice(0, -1) : filled
  const words = text.split(' ')
  return {
    kind: 'word-order',
    person,
    tokens: shuffle(words.map((word, id) => ({ id, text: word }))),
    correct: text,
    punctuation,
  }
}

// One question per grammatical person, framed one of several ways — most are
// multiple-choice (an `options` array to pick from), the typed ones ask the
// learner to type the answer instead (`correct` only, no `options`):
//   - `form`: recognise the bare conjugated form ("hura → ?")
//   - `sentence`: fill the verb into an example sentence ("Hura medikua ___.")
//   - `spot-error`: pick the one sentence, of four already filled in, whose
//     verb form doesn't match its subject (see `buildSpotErrorQuestion`)
//   - `pronoun`: fill the correctly-declined pronoun into a sentence whose verb
//     is already given ("___ etxe bat du." → "Hark")
//   - `type-verb`: type the verb into the same blanked sentence as `sentence`
//   - `type-pronoun`: type the pronoun into the same blanked sentence as `pronoun`
//   - `negative`: fill the verb into a negative-sentence template, e.g.
//     "Ni ez ___ irakaslea." → "naiz" (see `negativeSentences` below)
//   - `type-negative`: type the verb into the same negative-sentence blank as
//     `negative`
// The typed framings reuse exactly the same example-sentence data as their
// multiple-choice counterparts (`sentence` needs `verb.sentences[tense][person]`;
// `pronoun`/`type-pronoun` need both `verb.pronouns` and
// `verb.pronounSentences[tense][person]`; `negative`/`type-negative` need
// `verb.negativeSentences[tense][person]`) — typing only makes sense with that
// sentence context to anchor what's being asked for, and reusing the data means
// a verb that already supports one framing automatically supports its typed
// sibling. Persons missing that supporting data always fall back to the bare
// `form` question, so verbs can adopt any of the framings incrementally.
//
// `noTyping` (set for a learner's first run(s) through a lesson — see
// `createExerciseState`) drops the typed (`type-verb`/`type-pronoun`/
// `type-negative`) and `spot-error` framings — the ones that demand recalling
// or cross-checking a brand-new form rather than just recognising it — while
// still letting the `sentence`/`pronoun`/`negative` multiple-choice framings
// through, so a brand-new conjugation is met with real example sentences from
// the very first question, just without being asked to type or spot-the-error
// yet. Once the learner's been through the lesson enough times, later runs
// open up the full mix. Every question also carries the `verbId`/`tense` it
// was generated from — irrelevant within a single-verb-and-tense lesson, but
// what lets a "review" lesson (see `LESSONS`) interleave questions from
// several lessons' worth of conjugation tables and still show each one in its
// correct verb/tense context.
//
// `includeNegation` (set for the Refresh Gate A "Inversion Matrix" reviews —
// see `LESSONS`'s `unit-5-review-1`/`-2`/`-3`) switches a person with
// `negativeSentences[tense][person]` data over to *exclusively*
// `negative`/`type-negative` framings (plus the occasional bare `form`,
// same as any other kind) instead of the normal `sentence`/`pronoun`/...
// mix — that lesson's whole point is drilling `ez` + auxiliary-fronting, so
// negation questions shouldn't be diluted down to "one kind among six".
// Defaults to `false`, so existing (verb × tense) practice lessons — which
// don't pass it — never surface negation questions even once `negativeSentences`
// data exists for their verb, keeping negation as something Unit 5
// introduces deliberately rather than something that appears unannounced in
// Units 1–4's own lessons.
// `rounds` repeats the one-question-per-person pass this many times, each
// pass independently shuffled (order) and re-rolled (question kind/options) —
// this is how a lesson reaches a pedagogically reasonable length from a small
// (3-6 person) conjugation table: see `TARGET_EXERCISE_COUNT` in `App.jsx`,
// which derives `rounds` from the table size. Defaults to 1 (one question per
// person, the original behaviour) so existing callers/tests are unaffected.
//
// For a person with few available framings (e.g. a 3-person table during
// `noTyping`, where only `sentence`/`pronoun`/`form` are on offer), an
// independent roll per round can easily land on the same kind twice — and
// since a kind's content is otherwise fully determined by `person` (same
// sentence, same option set), that reads as the exact same question
// reappearing. `usedKinds` tracks, per person, which kinds have already been
// rolled across rounds; a repeat roll is swapped for an unused kind (`form`
// plus whatever's in `availableKinds`) when one remains, so a person cycles
// through its distinct framings before any repeats — only once every framing
// has appeared does a person start repeating. With `rounds = 1` (the
// default) `used` is always empty before the first roll, so this is a no-op
// and existing single-round behaviour/tests are unaffected.
//
// `persons` (optional) restricts question generation to a subset of the
// table's grammatical persons — e.g. `['ni', 'zu', 'hura']` for a lesson that
// should stay on Phase I's 3-person horizon even though its underlying
// `conjugations[tense]` table has grown to 6 persons (see `docs/DECISIONS.md`,
// "Restored Phase I's 3-person pacing"). Distractors and `personsWithSentences`
// are drawn from this same subset, so a filtered lesson behaves exactly like a
// lesson whose table only ever had that many persons. Defaults to every key in
// the table (the original behaviour).
//
// `extraCandidates` (optional, `{ [person]: Array<{ verbId, form }> }` — see
// `getCrossVerbCandidates`) widens `buildOptions`'s distractor pool for the
// `sentence`/`negative` kinds, which draw their options from
// `verb.conjugations[tense]` and have a sentence that can make a sibling
// verb's same-person form read as genuinely wrong. Each kind narrows its
// person's candidates via `filterExtraCandidates` against that *specific*
// sentence's `validFor` tag (see `docs/SENTENCE_FRAMES.md`) — so an untagged
// sentence contributes no extra candidates (the safe default), while a
// `validFor: []` sentence admits all of them. Not used for `pronoun`, whose
// options come from a different table (`verb.pronouns`) that cross-verb
// conjugated forms wouldn't belong in, nor for `form` (bare "which form is
// correct?" questions have no sentence to anchor a sibling verb's form as
// wrong — see `docs/DECISIONS.md`). Defaults to no extra candidates (the
// original same-table-only behaviour).
//
// `verbs` (optional, the full `VERBS` list) lets `hasAmbiguousTypedForm` rule
// out `type-verb`/`type-negative` for a person whose form is a "particle +
// auxiliary" compound (e.g. `nahi`'s `nahi dut`) that another verb's form
// (e.g. `ukan`'s `dut`) could also correctly — but differently — complete the
// same sentence with. Without `verbs`, no person is treated as ambiguous (the
// original behaviour). It doubles as the source pool for #139's small-table
// borrowing (`getBorrowedDistractors`/`getBorrowedSpotErrorSlots`) — without
// `verbs`, both return `[]` and small tables fall back to fewer
// options/no `spot-error`, same as before #139.
//
// `mode: 'recognition'` (#140, optional — `LESSONS` entries for advanced
// [R]-scoped units per `docs/LEARNING_JOURNEY_PROPOSED.md`, e.g. the dative
// conditional or ditransitive imperative/subjunctive) permanently drops the
// typed/production framings (`type-verb`/`type-pronoun`/`type-negative`) —
// like `noTyping`, but for the lesson's entire lifetime rather than just a
// learner's first attempts, since these forms are never meant to be drilled
// for recall. Unlike `noTyping`, `spot-error` stays available (it's a
// recognition task — spotting a wrong form in a sentence someone else wrote
// — not production). Defaults to `undefined`, i.e. the original behaviour
// (every kind `noTyping` would also allow stays on the table).
//
// `verb.recognitionOnly` (#330) is the per-*carrier* counterpart: a rare verb
// folded into a mixed conjugation pool (see `CARRIERS_PER_SESSION` in
// `App.jsx`) that should stay recognition-only even when sampled alongside
// ordinary production carriers in the same pool/session. Unlike
// `mode: 'recognition'`, this also drops `spot-error` — there's no per-lesson
// "recognition tier" left for it to belong to once it's just one carrier
// among others, so it gets no production-adjacent framings at all.
//
// `objectAxis` (#346, optional — `{ vary: person-role, fixed: person }`)
// declares that `verb.conjugations[tense]` is a real 2D table over `verb
// .agreement`'s two non-`nor`-or-other roles (`{ [outer]: { [inner]: form } }`,
// see `data/verbs.js`'s `ukan.presentByObject` for the NOR-NORK case, or
// `gustatu.presentByNor` for the NOR-NORI case, #358) keyed by whichever
// role each lesson resolves outer/inner to — `resolveObjectAxisTable` is
// itself axis-name-agnostic, so the same shape works for either pairing —
// and which axis this lesson drills: `resolveObjectAxisTable` collapses it to
// an ordinary flat table before anything else below runs, so `persons`,
// `buildOptions`'s distractor pool (still just "the other values on the same
// table", now the same axis being drilled by construction), sentences, and
// lures all behave exactly as they do for a single-axis verb — the 2D shape
// never reaches them directly. `fixedArgument` is overridden to describe
// whichever argument this axis pins -- `{ role, person: fixed }`, where
// `role` is whichever of `verb.agreement`'s two roles isn't `objectAxis.vary`
// itself (`'nork'` for a nor-nork verb like `ukan` varying `'nor'`; `'nori'`
// for a nor-nori verb like `gustatu` varying `'nor'`, #358) -- instead of
// `getFixedArgument(verb)`, reusing the same `FixedArgumentBadge` #142's
// `recipient`/`agent` already render. Defaults to `undefined`, i.e. the
// original flat-table behaviour.
//
// #141's case-frame/cross-tense lures (`getCaseFrameLure`/
// `getCaseFramePronounLure`/`getCrossTenseLure`) add up to two further
// guaranteed distractors, on top of the same-table ones above, for the rows
// of `docs/LEARNING_JOURNEY_PROPOSED.md`'s Distractor Engine Matrix
// implementable with existing `izan`/`ukan` data: a NOR-NORK verb's present
// (`naiz` alongside `dut`), any verb's past (`nuen` alongside `nintzen`, and
// the verb's own present form alongside its past one), and `pronoun`
// questions for any non-NOR-NORI verb (`Nik` alongside `Ni`, or vice versa —
// the "ergative drift" trap). Require `verbs` (for the sibling lookup) and
// gracefully contribute nothing without it. #165 generalized the case-frame
// lure to NOR-NORI/NOR-NORI-NORK (gustatu's "wrong case frame" Slot now
// pulls esan's form, and vice versa) and added `getObjectNumberLure` (the
// verb's own plural-object form, where one exists) for the "wrong object
// number" slot. Future's invented-non-word safety mechanism, hi/hitanoa, and
// the moods with no data yet remain out of scope — see #165's follow-up
// issue. #283 added `getRecencyContrastLure` (`presentPerfect` <-> `past`,
// same participle/different auxiliary tense — `etorri naiz` alongside
// `etorri nintzen`) and extended this gate to `tense === 'presentPerfect'`
// so it actually fires. #293 added `getDativeOvergenerationLure` (a
// `dativeOvergeneration`-flagged verb's own participle paired with a
// NOR-NORI-NORK sibling's auxiliary — `eramango diot` alongside the correct
// `eramango dut`), reusing this same gate since it's NOR-NORK-only.
export function generateQuestions(
  verb,
  tense,
  { noTyping = false, rounds = 1, includeNegation = false, persons: personsFilter, extraCandidates, verbs, mode, objectAxis } = {},
) {
  // #346: `objectAxis` opts into reading `verb.conjugations[tense]` as a 2D
  // `{ [nork]: { [nor]: form } }` table (see `resolveObjectAxisTable`)
  // instead of the usual flat one — once resolved, `table` is an ordinary
  // flat table and nothing else below needs to know the difference.
  const table = objectAxis ? resolveObjectAxisTable(verb.conjugations[tense], objectAxis) : verb.conjugations[tense]
  const sentences = verb.sentences?.[tense] ?? {}
  const pronounSentences = verb.pronounSentences?.[tense] ?? {}
  const negativeSentences = verb.negativeSentences?.[tense] ?? {}
  const persons = personsFilter ?? Object.keys(table)
  const personsWithSentences = persons.filter((candidate) => sentences[candidate])
  const fixedArgument = objectAxis
    ? { role: verb.agreement.find((role) => role !== objectAxis.vary), person: objectAxis.fixed }
    : getFixedArgument(verb)
  const source = { verbId: verb.id, tense, fixedArgument }
  const usedKinds = new Map()
  const borrowedSpotErrorSlots = getBorrowedSpotErrorSlots(verbs, verb.agreement, tense, verb.id, personsWithSentences)
  const noProduction = noTyping || mode === 'recognition' || verb.recognitionOnly

  function buildQuestion(person) {
    const sentence = normalizeSentence(pickVariant(sentences[person]))
    const pronounSentence = verb.pronouns && normalizeSentence(pronounSentences[person])
    const negativeSentence = normalizeSentence(pickVariant(negativeSentences[person]))
    const ambiguousTyping = hasAmbiguousTypedForm(verb, tense, person, verbs, objectAxis)
    // `borrowed` (see `getBorrowedDistractors`) is `Array<{ verbId, form }>` —
    // every sibling-verb candidate for this slot, unscoped (#227/[B2]
    // retired the old `reviewScoped`/`sources`-based gating). The single
    // invariant that now decides whether any of it is shown is `grounded`
    // (see `buildTaggedOptions`): a `sentence`/`negative` question narrows
    // `borrowed` through `filterExtraCandidates`'s `validFor` check before
    // passing it on grounded, a `pronoun` question is grounded with no
    // sibling pool at all, and the bare `kind: 'form'` case passes
    // `grounded: false` so `borrowed` (along with `formLures`) is dropped
    // entirely — no sentence or visible verb name means no way to tell a
    // genuinely correct sibling form from a wrong one.
    const borrowed = getBorrowedDistractors(verbs, verb.agreement, tense, person, verb.id)
    // #141's case-frame/cross-tense lures: a NOR-NORK verb's present (Slot 3,
    // "naiz for dut") and any verb's past (Slot 2 "nintzen for nuen", Slot 3
    // "naiz for nintzen") get one or two guaranteed "diagnosable mistake"
    // distractors on top of the usual same-table ones. NOR present (no
    // `nork`, present tense) is left alone — its matrix row's Slot 3 is the
    // post-Unit-7 plural/near-homophone borrow (#164), not a case-frame lure.
    // #283: `presentPerfect` joins this gate too, for the `getRecencyContrastLure`
    // past<->presentPerfect contrast Unit 11 teaches.
    const baseFormLures =
      tense === 'past' || tense === 'presentPerfect' || verb.agreement?.includes('nork') || verb.agreement?.includes('nori')
        ? [
            { form: getCaseFrameLure(verbs, verb, tense, person), errorType: 'case-frame' },
            { form: getCrossTenseLure(verb, tense, person), errorType: 'tense' },
            { form: getRecencyContrastLure(verb, tense, person), errorType: 'tense' },
            { form: getObjectNumberLure(verb, tense, person), errorType: 'object-number' },
            { form: getDativeOvergenerationLure(verbs, verb, tense, person, objectAxis), errorType: 'dative-overgeneration' },
          ]
        : []
    // #230: a sentence whose embedded participle is tagged with its base
    // verb (`ari`'s sentences only, today) gets one further "progressive vs.
    // plain present" lure on top of whichever matrix-row lures already apply.
    const formLures = sentence?.baseVerb
      ? [...baseFormLures, { form: getProgressiveBaseLure(verbs, sentence.baseVerb, person), errorType: 'progressive-vs-plain' }]
      : baseFormLures
    const pronounLures = [{ form: getCaseFramePronounLure(verbs, verb, person), errorType: 'case-frame' }]
    // A sentence only qualifies for `word-order` once its blank is filled in
    // and its word count falls within [`WORD_ORDER_MIN_WORDS`,
    // `WORD_ORDER_MAX_WORDS`] — see `buildWordOrderQuestion`.
    const meetsWordOrderThreshold = (candidate) => {
      if (!candidate) return false
      const wordCount = candidate.text.replace('___', table[person]).split(' ').length
      return wordCount >= WORD_ORDER_MIN_WORDS && wordCount <= WORD_ORDER_MAX_WORDS
    }
    const availableKinds =
      includeNegation && negativeSentence
        ? [
            negativeSentence && 'negative',
            negativeSentence && !noProduction && !ambiguousTyping && 'type-negative',
            meetsWordOrderThreshold(negativeSentence) && 'word-order',
          ].filter(Boolean)
        : [
            sentence && 'sentence',
            sentence && !noProduction && !ambiguousTyping && 'type-verb',
            sentence && !noTyping && !verb.recognitionOnly && personsWithSentences.length + borrowedSpotErrorSlots.length >= 4 && 'spot-error',
            pronounSentence && 'pronoun',
            pronounSentence && !noProduction && 'type-pronoun',
            meetsWordOrderThreshold(sentence) && 'word-order',
          ].filter(Boolean)

    let kind = rollQuestionKind(availableKinds)
    const used = usedKinds.get(person) ?? new Set()
    if (used.has(kind)) {
      // `'form'` is always a safe fallback kind (it only needs the
      // conjugation table), except under `includeNegation`: there,
      // `availableKinds` is deliberately restricted to negative framings, and
      // falling back to `'form'` would silently bypass that restriction (#200).
      const unused = (includeNegation ? availableKinds : ['form', ...availableKinds]).filter((candidate) => !used.has(candidate))
      if (unused.length > 0) kind = unused[Math.floor(Math.random() * unused.length)]
    }
    used.add(kind)
    usedKinds.set(person, used)

    switch (kind) {
      case 'sentence': {
        const extra = filterExtraCandidates(extraCandidates?.[person], sentence.validFor)
        const borrowedForms = filterExtraCandidates(borrowed, sentence.validFor)
        const { correct, options, optionRationale } = buildOptions(table, persons, person, extra, borrowedForms, formLures, true)
        return { ...source, kind: 'sentence', person, sentence: sentence.text, correct, options, optionRationale }
      }
      case 'type-verb':
        return { ...source, kind: 'type-verb', person, sentence: sentence.text, correct: table[person] }
      case 'spot-error':
        return { ...source, ...buildSpotErrorQuestion(table, sentences, personsWithSentences, person, borrowedSpotErrorSlots) }
      case 'pronoun': {
        const { correct, options, optionRationale } = buildOptions(verb.pronouns, persons, person, [], [], pronounLures, true)
        return { ...source, kind: 'pronoun', person, sentence: pronounSentence.text, correct, options, optionRationale }
      }
      case 'type-pronoun':
        return { ...source, kind: 'type-pronoun', person, sentence: pronounSentence.text, correct: verb.pronouns[person] }
      case 'negative': {
        const extra = filterExtraCandidates(extraCandidates?.[person], negativeSentence.validFor)
        const borrowedForms = filterExtraCandidates(borrowed, negativeSentence.validFor)
        const { correct, options, optionRationale } = buildOptions(table, persons, person, extra, borrowedForms, formLures, true)
        return { ...source, kind: 'negative', person, sentence: negativeSentence.text, correct, options, optionRationale }
      }
      case 'type-negative':
        return { ...source, kind: 'type-negative', person, sentence: negativeSentence.text, correct: table[person] }
      case 'word-order': {
        const wordOrderSentence = includeNegation && negativeSentence ? negativeSentence : sentence
        return { ...source, ...buildWordOrderQuestion(table, wordOrderSentence, person) }
      }
      default: {
        // A bare `kind: 'form'` question has neither a sentence nor a
        // visible verb name to anchor correctness, so it's never grounded
        // (see `buildTaggedOptions`): `borrowed` and `formLures` are passed
        // but ignored, leaving only the verb's own table to draw
        // distractors from — accept fewer than 3 options rather than let a
        // sibling's genuinely correct form, or a lure that only reads as
        // wrong given a sentence's subject marking, surface as an
        // ungrounded option here.
        const { correct, options } = buildOptions(table, persons, person, [], borrowed, formLures, false)
        return { ...source, kind: 'form', person, correct, options }
      }
    }
  }

  return Array.from({ length: rounds }, () => shuffle(persons).map(buildQuestion)).flat()
}

// Shared by `generateCrossVerbQuestions` and `generateCaseMixerQuestions`:
// for every (source, person) with both a `sentences[tense][person]` and a
// `conjugations[tense][person]`, collects the other sources' same-person
// forms that `agreementMatches` accepts as siblings *and* that the anchor
// sentence's `validFor` tag (see `docs/SENTENCE_FRAMES.md`, via
// `filterExtraCandidates`) doesn't exclude — an untagged sentence excludes all
// of them (the safe default), while `validFor: []` excludes none — and keeps
// the combination only if that yields at least 2 distinct option values (the
// source's own correct form plus 1+ siblings) — a source with no accepted
// siblings for a given person (e.g. a single-source review, one where every
// sibling's agreement is rejected, or an untagged sentence) simply
// contributes nothing.
//
// `extraSiblingSources` (optional, `{ verb, tense }` shape like
// `resolvedSources` — see `getIntroducedSources`) is Delivery 4's fallback
// pool for reviews whose own `resolvedSources` are too few to produce much
// variety: merged into the sibling pool (never as new anchors), deduped
// against `resolvedSources`, and restricted to the same `tense` as the
// anchor — same rationale as `getCrossVerbCandidates`'s `extraSources`.
//
// `verbs` (optional, the full `VERBS` list) is #200's counterpart for this
// question shape: even with `extraSiblingSources` wired up, a review can
// have just one compatible-and-not-`validFor`-excluded sibling for a given
// sentence (e.g. `jakin-suffix-family-review`'s "Zuk sekretua ___." accepts
// `nahi`'s form too, so `nahi` is excluded as a distractor, leaving only
// `ukan` — a 2-option question/coin flip). When the sibling pool above
// yields fewer than 2 distractors, `verbs` tops it up with any other
// `agreementMatches`-compatible verb's same-person form (still subject to
// the same `validFor` exclusion and dedup) — this question already shows a
// sentence, so an unrelated verb's form reads unambiguously as "wrong verb
// for this sentence", same as `verb-choice`/`case-mixer`'s normal siblings.
// `objectAxis` (#380, optional, `{ vary, fixed }` — same shape as
// `generateQuestions`'s) — when the review pools sources that carry a 2D
// NOR-NORK/NOR-NORI table (`ukan`/`maite`/`ikusi`/`jan`/`edan`/`erosi`/
// `hartu`'s `presentByObject`/`pastByObject`, #346/#347/#378/#379), every
// source in `resolvedSources` is read through that single shared axis —
// a review only ever fixes one axis value for all its sources, same as a
// single-verb `objectAxis` lesson does (see `data/lessons.js`'s Unit 15
// lessons). None of these verbs have `sentences` for these tenses yet, so
// candidates here skip the sentence requirement entirely and the resulting
// question has no `sentence` (`QuestionPrompt` already renders a bare
// person+`fixedArgument`-badge header when `sentence` is falsy — the same
// fallback `kind: 'form'` questions use). With no sentence there's also no
// `validFor` tag to narrow siblings by, so every agreement-compatible
// sibling's resolved form is a fair distractor.
function collectCrossSourceCandidates(resolvedSources, personsFilter, agreementMatches, extraSiblingSources = [], verbs, objectAxis) {
  const candidates = []
  const known = new Set(resolvedSources.map(({ verb, tense }) => `${verb.id}:${tense}`))
  const extras = extraSiblingSources.filter(({ verb, tense }) => !known.has(`${verb.id}:${tense}`))
  const resolveTable = (verb, tense) => {
    const table = verb.conjugations[tense]
    if (!table) return undefined
    return objectAxis ? resolveObjectAxisTable(table, objectAxis) : table
  }
  for (const { verb, tense } of resolvedSources) {
    const sentences = verb.sentences?.[tense] ?? {}
    const table = resolveTable(verb, tense)
    const persons = personsFilter ?? Object.keys(table ?? {})
    const fixedArgument = objectAxis ? { role: verb.agreement.find((role) => role !== objectAxis.vary), person: objectAxis.fixed } : undefined
    for (const person of persons) {
      const sentence = objectAxis ? undefined : normalizeSentence(pickVariant(sentences[person]))
      const correct = table?.[person]
      if ((!objectAxis && !sentence) || !correct) continue
      const siblings = [
        ...resolvedSources.filter((sibling) => !(sibling.verb.id === verb.id && sibling.tense === tense)),
        ...extras.filter((sibling) => sibling.tense === tense),
      ]
      const siblingCandidates = siblings
        .filter((sibling) => agreementMatches(sibling.verb.agreement, verb.agreement))
        .map((sibling) => {
          const form = resolveTable(sibling.verb, sibling.tense)?.[person]
          return form ? { verbId: sibling.verb.id, form } : null
        })
        .filter(Boolean)
      const siblingForms = objectAxis ? siblingCandidates.map((candidate) => candidate.form) : filterExtraCandidates(siblingCandidates, sentence.validFor)
      // Capped at 3 distractors (4 options total, including `correct`) — same
      // ceiling as `buildOptions` — so Delivery 4's broader fallback pool
      // widens *variety* (which siblings show up) without ever showing more
      // options than a regular multiple-choice question.
      let distractors = shuffle([...new Set(siblingForms)].filter((form) => form !== correct)).slice(0, 3)
      if (distractors.length < 2) {
        const knownSiblingIds = new Set([verb.id, ...siblings.map((sibling) => sibling.verb.id)])
        const borrowedCandidates = (verbs ?? [])
          .filter((sibling) => !knownSiblingIds.has(sibling.id) && agreementMatches(sibling.agreement, verb.agreement))
          .map((sibling) => {
            const form = resolveTable(sibling, tense)?.[person]
            return form ? { verbId: sibling.id, form } : null
          })
          .filter(Boolean)
        const borrowedForms = objectAxis ? borrowedCandidates.map((candidate) => candidate.form) : filterExtraCandidates(borrowedCandidates, sentence.validFor)
        const moreDistractors = shuffle([...new Set(borrowedForms)].filter((form) => form !== correct && !distractors.includes(form)))
        distractors = [...distractors, ...moreDistractors].slice(0, 3)
      }
      if (distractors.length === 0) continue
      const options = [correct, ...distractors]
      candidates.push({ verbId: verb.id, tense, person, sentence: sentence?.text, fixedArgument, correct, options })
    }
  }
  return candidates
}

// Picks up to `count` candidates at random and shapes them into questions of
// the given `kind`, shuffling each one's `options`.
function pickCrossSourceQuestions(candidates, count, kind) {
  return shuffle(candidates)
    .slice(0, count)
    .map(({ verbId, tense, person, sentence, fixedArgument, correct, options }) => ({
      verbId,
      tense,
      kind,
      person,
      sentence,
      fixedArgument,
      correct,
      options: shuffle(options),
    }))
}


// Up to this many `kind: 'verb-choice'` cross-verb questions (see
// `generateCrossVerbQuestions`) get added to a review lesson's queue — kept
// small/"a handful" since each one is a deliberately harder, single-focus
// question, on top of the review's normal cross-section and
// `getWeakSpotQuestions`'s extras.
export const CROSS_VERB_QUESTION_COUNT = 2

// A `kind: 'verb-choice'` question shows one source's example sentence
// (`sentences[tense][person]`, with `___` marking the blank, same as
// `sentence`/`type-verb`) and asks which verb's conjugated form actually
// fits it. `options` mix that source's correct form for `person` with its
// compatible siblings' (see `agreementsCompatible`) forms for the same
// person — unlike Delivery 1's occasional cross-verb distractor (one option
// among the usual same-table ones), here "which verb fits this sentence" is
// the entire point of the question. `options` has only as many entries as
// there are compatible sources with a usable form for this person (2-4, not
// padded) — a review with only one compatible pair yields 2-option
// questions.
//
// `resolvedSources` is the review's `{ verb, tense }` sources, already
// resolved from `VERBS` (as `createExerciseState` produces). `persons`
// (optional) restricts which grammatical persons are eligible, mirroring
// `generateQuestions`'s `persons` filter. `extraSiblingSources` (optional,
// see `collectCrossSourceCandidates`) widens the sibling pool for reviews
// with too few sources of their own (Delivery 4). `verbs` (optional, the
// full `VERBS` list) is #200's further top-up for when even that's not
// enough — see `collectCrossSourceCandidates`. Up to `count` questions are
// returned, picked at random from every eligible (source, person)
// combination — a review with too few eligible combinations (e.g. a
// single-source review, where there are no siblings to choose between at
// all) simply returns fewer, down to none.
//
// `objectAxis` (#380, optional, `{ vary, fixed }`) — when the review pools
// `objectAxis` sources (e.g. `ukan`/`maite`'s `presentByObject`), every
// source is read through this one shared axis instead of its flat
// `conjugations[tense]` table; see `collectCrossSourceCandidates`.
export function generateCrossVerbQuestions(
  resolvedSources,
  { persons: personsFilter, count = CROSS_VERB_QUESTION_COUNT, extraSiblingSources = [], verbs, objectAxis } = {},
) {
  return pickCrossSourceQuestions(
    collectCrossSourceCandidates(resolvedSources, personsFilter, agreementsCompatible, extraSiblingSources, verbs, objectAxis),
    count,
    'verb-choice',
  )
}

// Up to this many `kind: 'case-mixer'` questions (see
// `generateCaseMixerQuestions`) get added to a review lesson's queue — kept
// to a bare minimum (1), since this drill is narrower and harder than
// `verb-choice`: it only fires for reviews that happen to mix `nor` and
// `nor-nork` sources, which is most of them but not the point of any of them
// yet (that's Refresh Gate C / Unit 22's job, once Units 20-21 exist — see
// `docs/DECISIONS.md`).
export const CASE_MIXER_QUESTION_COUNT = 1

// A `kind: 'case-mixer'` question is `generateCrossVerbQuestions`'s mirror
// image: same shape (one source's example sentence, `options` mixing its
// correct form with sibling sources' same-person forms), but
// `agreementsCompatible`'s filter is *inverted* — only sources whose
// `agreement` differs on the `nork` axis (`nor` vs `nor-nork`) qualify as
// siblings. Where `verb-choice` asks "which verb fits this sentence" among
// same-shape verbs, `case-mixer` asks it among verbs that differ in subject
// case-marking (absolutive "Ni..." vs ergative "Nik..."), e.g. izan's `naiz`
// vs ukan's `dut` for a `ni`-person sentence — the wrong option doesn't just
// belong to a different verb, it carries the wrong case for that sentence's
// subject. Reviews with no `nor`/`nor-nork` mix among their sources (or none
// for the given `persons`) simply yield none, same graceful-degradation
// pattern as `generateCrossVerbQuestions`.
export function generateCaseMixerQuestions(
  resolvedSources,
  { persons: personsFilter, count = CASE_MIXER_QUESTION_COUNT, extraSiblingSources = [], verbs } = {},
) {
  return pickCrossSourceQuestions(
    collectCrossSourceCandidates(resolvedSources, personsFilter, (a, b) => !agreementsCompatible(a, b), extraSiblingSources, verbs),
    count,
    'case-mixer',
  )
}

// Up to this many `kind: 'match-pairs'` questions (see
// `generateMatchPairsQuestions`) get added to a lesson's queue — kept to a
// bare minimum (1), since unlike `verb-choice`/`case-mixer` this isn't a
// review-only special case but applies to ordinary practice lessons too.
export const MATCH_PAIRS_QUESTION_COUNT = 1

// A `kind: 'match-pairs'` question covers a whole source's table in one
// round, instead of one grammatical person at a time like every other kind:
// the learner matches every in-scope person to its conjugated form. Eligible
// sources are those with at least 3 in-scope persons (`persons` ??
// `Object.keys(table)`), all with distinct forms — fewer than 3 isn't a
// matching task, and a repeated form would make a pair ambiguous (no real
// example today, but `ari`/toka-noka-style 2-person tables already exist, so
// the guard matters). `correct: 'complete'` is a sentinel string, not a real
// form — the board itself (see `MatchPairsBoard` in App.jsx) determines
// success/failure and submits `'complete'`/`'incomplete'`, so
// `isAnswerCorrect`/`exerciseReducer`'s `case 'answer'` needs no changes.
export function generateMatchPairsQuestions(resolvedSources, { persons: personsFilter, count = MATCH_PAIRS_QUESTION_COUNT } = {}) {
  const candidates = []
  for (const { verb, tense } of resolvedSources) {
    const table = verb.conjugations[tense]
    if (!table) continue
    const persons = personsFilter ?? Object.keys(table)
    const pairs = persons.map((person) => ({ person, form: table[person] })).filter(({ form }) => Boolean(form))
    if (pairs.length < 3) continue
    if (new Set(pairs.map((pair) => pair.form)).size !== pairs.length) continue
    candidates.push({ verbId: verb.id, tense, kind: 'match-pairs', fixedArgument: getFixedArgument(verb), pairs, correct: 'complete' })
  }
  return shuffle(candidates).slice(0, count)
}

// Up to this many `kind: 'suffix-choice'` questions get added to a lesson
// opted in via `lesson.suffixChoice: true` (#423) — kept small/"a handful",
// same rationale as `CROSS_VERB_QUESTION_COUNT`.
export const SUFFIX_CHOICE_QUESTION_COUNT = 3

// A `kind: 'suffix-choice'` question isolates the one genuinely new skill
// the periphrastic future teaches, separate from producing a full
// conjugation: given a verb's bare infinitive, pick whether its future
// attaches `-ko` or `-go`. The rule is purely orthographic — stem ends in
// `n` -> `-go` (`jan` -> `jango`), anything else -> `-ko` (`erosi` ->
// `erosiko`) — so it's derived from `verb.id` rather than stored data.
// `ukan` is deliberately excluded: its future is `izan`'s suppletive
// `izango`, not a derived `*ukango`, so applying the mechanical rule to it
// would teach the wrong lesson (see `docs/DECISIONS.md`).
export function generateSuffixChoiceQuestions(resolvedSources, { count = SUFFIX_CHOICE_QUESTION_COUNT } = {}) {
  const eligibleVerbs = resolvedSources
    .filter(({ tense, verb }) => tense === 'future' && verb.id !== 'ukan')
    .map(({ verb }) => verb)
  const uniqueVerbs = [...new Map(eligibleVerbs.map((verb) => [verb.id, verb])).values()]
  return shuffle(uniqueVerbs)
    .slice(0, count)
    .map((verb) => {
      const correct = verb.id.endsWith('n') ? '-go' : '-ko'
      return { verbId: verb.id, tense: 'future', kind: 'suffix-choice', infinitive: verb.verb, correct, options: shuffle(['-ko', '-go']) }
    })
}

// `kind: 'reading'` questions (Unit 36, see `src/data/readingItems.js`) have
// no `verbId`/`tense`/`person` of their own — each is just a source sentence
// plus a comprehension prompt and four candidate sentences, one of which
// (`item.answer`) answers it. `rounds` repeats/reshuffles the whole item set,
// same idea as `generateQuestions`'s `rounds` — each repetition gets its own
// `shuffle` of both the item order and each item's `options`, so a repeat
// isn't a verbatim rerun.
export function generateReadingQuestions(items, { rounds = 1 } = {}) {
  return Array.from({ length: rounds }, () => shuffle(items)).flatMap((roundItems) =>
    roundItems.map((item) => ({
      kind: 'reading',
      itemId: item.id,
      source: item.source,
      gloss: item.gloss,
      prompt: item.prompt,
      correct: item.answer,
      options: shuffle(item.options),
    })),
  )
}

// =============================================================================
// Error tracking & weak-spot review boosters
// =============================================================================

// Up to this many extra questions get appended to a review lesson's queue,
// targeting the verb/tense/person combinations the learner has most often
// gotten wrong on the first attempt (see `getWeakSpotQuestions`).
export const EXTRA_REVIEW_EXERCISES = 4

// Merges a batch of first-attempt misses (`{ verbId, tense, person }` — see
// `exerciseReducer`'s `misses`) into the persisted error-tracking map, keyed
// by `verbId:tense:person` so repeated misses on the same form accumulate
// into one growing count rather than separate entries. `lastMissed` is an
// ISO timestamp, used by `getWeakSpotQuestions` to break ties between
// equally-missed spots.
export function recordErrors(errorStats, misses) {
  if (!misses || misses.length === 0) return errorStats
  const next = { ...errorStats }
  const now = new Date().toISOString()
  for (const { verbId, tense, person } of misses) {
    const key = `${verbId}:${tense}:${person}`
    next[key] = { verbId, tense, person, count: (next[key]?.count ?? 0) + 1, lastMissed: now }
  }
  return next
}

// Picks the learner's most-missed verb/tense/person combinations among this
// review lesson's `sources` (so a review only ever drills forms it actually
// covers), and generates one fresh question for each — up to `count`. These
// read as "similar to the failed ones" rather than identical: each is a
// normal `generateQuestions` roll for that exact person, so the framing/kind
// and (for sentence-based kinds) the phrasing variant can differ from
// whichever question was originally missed, while still targeting the same
// conjugated form. Sorted by miss count (most-missed first), then by
// recency, so the weakest spots are favoured when there are more of them
// than slots.
export function getWeakSpotQuestions(errorStats, sources, verbs, count = EXTRA_REVIEW_EXERCISES) {
  const sourceKeys = new Set(sources.map(({ verbId, tense }) => `${verbId}:${tense}`))
  const weakSpots = Object.values(errorStats)
    .filter(({ verbId, tense, person }) => {
      if (!sourceKeys.has(`${verbId}:${tense}`)) return false
      const verb = verbs.find((v) => v.id === verbId)
      return Boolean(verb?.conjugations[tense]?.[person])
    })
    .sort((a, b) => b.count - a.count || new Date(b.lastMissed) - new Date(a.lastMissed))
    .slice(0, count)

  return weakSpots.map(({ verbId, tense, person }) => {
    const verb = verbs.find((v) => v.id === verbId)
    return generateQuestions(verb, tense, { rounds: 1, verbs, sources, review: true }).find((question) => question.person === person)
  })
}

// Optional "why is this correct?" explanation, surfaced by `FeedbackBar` only
// after a *correct* answer and only for question kinds that test a concept
// rather than just a memorized form. `pronoun`/`type-pronoun` are one prime
// candidate: whether a Basque pronoun takes the ergative `-k` or stays
// unmarked depends on the verb's `agreement` (NOR vs NOR-NORK) — a distinction
// with no equivalent in English/Spanish, and the kind of thing a learner can
// answer correctly by pattern-matching the sentence without understanding why.
// `negative`/`type-negative` are the other: Basque negation isn't just
// inserting "not" in place — `ez` plus the verb move together to right after
// the subject, with the rest of the sentence following — another pattern with
// no equivalent in English/Spanish word order. `verb-choice` (see
// `generateCrossVerbQuestions`) is the third: the "why" is exactly which verb
// this sentence's structure calls for, as opposed to its sibling option(s).
// `case-mixer` (see `generateCaseMixerQuestions`) is `verb-choice`'s mirror
// image, framed around the `-k` ergative-subject distinction instead — its
// explanation reuses the pronoun explanations' "doer always gets '-k'"
// framing. Every other kind (`form`, `sentence`, `type-verb`, `spot-error`) is
// "produce/recognize this conjugated form", which doesn't have a similarly
// compact "why" beyond "that's the form" — `getExplanation` returns `null`
// for those, and `FeedbackBar` simply doesn't show the toggle.
//
// `t` is the caller's `useLanguage().t`, so the explanation text follows the
// interface language while `{pronoun}`/`{verb}`/`{form}` stay the untranslated
// Basque being taught — same split as `getEncouragement`/`describeLesson`.
export function getExplanation(verb, question, t) {
  if (question.kind === 'negative' || question.kind === 'type-negative') {
    return t('explanationNegation', { form: verb.conjugations[question.tense][question.person] })
  }
  if (question.kind === 'verb-choice') {
    return t('explanationVerbChoice', { verb: verb.verb, form: question.correct })
  }
  if (question.kind === 'case-mixer') {
    const key = verb.agreement.includes('nork') ? 'explanationCaseMixerErgative' : 'explanationCaseMixerAbsolutive'
    return t(key, { verb: verb.verb, form: question.correct })
  }
  if (question.kind === 'suffix-choice') {
    const key = question.correct === '-go' ? 'explanationSuffixChoiceGo' : 'explanationSuffixChoiceKo'
    return t(key, { verb: question.infinitive })
  }
  if (question.kind !== 'pronoun' && question.kind !== 'type-pronoun') return null
  const key = verb.agreement.includes('nork') ? 'explanationPronounErgative' : 'explanationPronounAbsolutive'
  return t(key, { pronoun: question.correct, verb: verb.verb, form: verb.conjugations[question.tense][question.person] })
}

// [C2]/#229: makes a wrong-but-deliberate distractor ("lure", see
// `getCaseFrameLure`/`getCrossTenseLure`/`getObjectNumberLure`) legible after
// the fact, rather than reading as an arbitrary wrong answer — only a `kind:
// 'sentence'`/`'negative'`/`'pronoun'` question carries `optionRationale`
// (see `buildOptions`), since those are the only kinds with a sentence/visible
// verb name to anchor the explanation against (the `grounded` invariant from
// [B2]/#227). Returns `null` when `selected` wasn't a tagged lure — a plain
// same-table distractor has no "why" beyond "wrong person", same as
// `getExplanation`'s `null` cases.
export function getLureRationale(question, selected, t) {
  const rationale = question.optionRationale?.[selected]
  if (!rationale) return null
  return t(rationale.whyKey, { form: selected, correct: question.correct })
}

// The exercise works through a queue rather than a fixed list: a question
// answered correctly is dropped, one answered incorrectly is pushed to the
// back (marked `retry`) so it resurfaces later in the same session — the
// lesson isn't done until the queue is empty, i.e. every question has
// eventually been answered correctly. `correctCount` only credits *first*
// attempts, so the final score (and star rating) reflects how many forms the
// learner actually knew rather than how many they eventually got via retries.
export function exerciseReducer(state, action) {
  switch (action.type) {
    case 'answer': {
      if (state.status !== 'active') return state
      const question = state.queue[0]
      const isCorrect = isAnswerCorrect(action.option, question.correct)
      const isFirstAttempt = !question.retry
      const countsTowardScore = isCorrect && isFirstAttempt
      const misses =
        !isCorrect && isFirstAttempt && question.verbId && question.person
          ? [...(state.misses ?? []), { verbId: question.verbId, tense: question.tense, person: question.person }]
          : state.misses ?? []
      return {
        ...state,
        selected: action.option,
        status: isCorrect ? 'correct' : 'incorrect',
        correctCount: state.correctCount + (countsTowardScore ? 1 : 0),
        streak: isCorrect ? state.streak + 1 : 0,
        misses,
      }
    }
    case 'next': {
      const [current, ...rest] = state.queue
      // `attempt` increments on every retry rather than just flipping `retry`
      // to `true` once — `MatchPairsBoard` (App.jsx) keys its board on it so a
      // retried match-pairs question remounts with a clean slate instead of
      // reusing its already-fully-matched, frozen state from the failed
      // attempt.
      const queue =
        state.status === 'correct' ? rest : [...rest, { ...current, retry: true, attempt: (current.attempt ?? 1) + 1 }]
      return { ...state, queue, selected: null, status: 'active' }
    }
    default:
      return state
  }
}

// =============================================================================
// Question flagging
// =============================================================================

// Builds the diagnostic payload sent alongside a learner's "report a problem"
// submission for a question (see `FlagQuestionModal` in App.jsx) — a pure
// snapshot of everything needed to reproduce/inspect the question without
// asking the learner to describe it themselves. `question`'s shape varies by
// `kind` (see `generateQuestions`); only the fields relevant to *this*
// question are included (`sentence`/`options`/`items` are each omitted when
// absent rather than sent as `undefined`/`null`), keeping the payload small
// and avoiding worker-side ambiguity between "field not applicable" and
// "field present but empty".
export function buildFlagDiagnostics({ lesson, question, selected, status, language }) {
  return {
    lessonId: lesson.id,
    review: Boolean(lesson.review),
    verbId: question.verbId,
    tense: question.tense,
    person: question.person,
    kind: question.kind,
    correct: question.correct,
    userAnswer: selected,
    outcome: status,
    language,
    timestamp: new Date().toISOString(),
    question: {
      ...(question.sentence ? { sentence: question.sentence } : {}),
      ...(question.options ? { options: question.options } : {}),
      ...(question.items ? { items: question.items } : {}),
      ...(question.source ? { source: question.source } : {}),
      ...(question.pairs ? { pairs: question.pairs } : {}),
      ...(question.tokens ? { tokens: question.tokens, punctuation: question.punctuation } : {}),
    },
  }
}
