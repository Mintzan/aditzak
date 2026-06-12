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

export function addPoints(points, amount) {
  return { balance: (points?.balance ?? 0) + amount }
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
  const balance = points?.balance ?? 0
  return currentStreak > 0 && getActiveStreak(streak, today) === 0 && balance >= STREAK_REPAIR_COST
}

// Spends `STREAK_REPAIR_COST` points to revive a broken streak: backdating
// `lastActiveDate` to "yesterday" makes `getActiveStreak` read `currentStreak`
// as alive again (gap back down to exactly one day) without touching
// `currentStreak`/`longestStreak` themselves — the streak resumes exactly
// where it left off, with today still open to extend it further.
export function repairStreak(streak, points, today) {
  return {
    streak: { ...streak, lastActiveDate: shiftDateString(today, -1) },
    points: { balance: (points?.balance ?? 0) - STREAK_REPAIR_COST },
  }
}

// A lesson unlocks once the lesson before it has been attempted at least once.
export function getUnlockedLessonIds(lessons, progress) {
  const unlocked = new Set()
  lessons.forEach((lesson, index) => {
    const previous = lessons[index - 1]
    if (index === 0 || (progress[previous.id]?.attempts ?? 0) > 0) {
      unlocked.add(lesson.id)
    }
  })
  return unlocked
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
function buildOptions(table, persons, person) {
  const correct = table[person]
  const distractors = shuffle(persons.filter((candidate) => candidate !== person).map((candidate) => table[candidate])).slice(0, 3)
  return { correct, options: shuffle([correct, ...distractors]) }
}

// `sentences[tense][person]` may be a single string or an array of phrasing
// variants (different contexts for the same person/blank, e.g. "Ni irakaslea
// ___." vs "Ni turista ___."); picking one at random per question keeps a
// lesson from showing the exact same sentence every time it cycles back to a
// given person, while a plain string (still used by verbs without variants)
// is returned as-is.
function pickVariant(value) {
  return Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value
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
function buildSpotErrorQuestion(table, sentences, personsWithSentences, person) {
  const companions = shuffle(personsWithSentences.filter((candidate) => candidate !== person)).slice(0, 3)
  const candidates = shuffle([person, ...companions])
  const wrongIndex = Math.floor(Math.random() * candidates.length)
  const items = candidates.map((candidate, index) => {
    const isWrong = index === wrongIndex
    const form = isWrong ? table[shuffle(personsWithSentences.filter((other) => other !== candidate))[0]] : table[candidate]
    return { person: candidate, sentence: pickVariant(sentences[candidate]).replace('___', form) }
  })
  return {
    kind: 'spot-error',
    person,
    items,
    options: items.map((item) => item.sentence),
    correct: items[wrongIndex].sentence,
  }
}

// One question per grammatical person, framed one of six ways — the first
// four are multiple-choice (an `options` array to pick from), the last two
// ask the learner to type the answer instead (`correct` only, no `options`):
//   - `form`: recognise the bare conjugated form ("hura → ?")
//   - `sentence`: fill the verb into an example sentence ("Hura medikua ___.")
//   - `spot-error`: pick the one sentence, of four already filled in, whose
//     verb form doesn't match its subject (see `buildSpotErrorQuestion`)
//   - `pronoun`: fill the correctly-declined pronoun into a sentence whose verb
//     is already given ("___ etxe bat du." → "Hark")
//   - `type-verb`: type the verb into the same blanked sentence as `sentence`
//   - `type-pronoun`: type the pronoun into the same blanked sentence as `pronoun`
// The typed framings reuse exactly the same example-sentence data as their
// multiple-choice counterparts (`sentence` needs `verb.sentences[tense][person]`;
// `pronoun`/`type-pronoun` need both `verb.pronouns` and
// `verb.pronounSentences[tense][person]`) — typing only makes sense with that
// sentence context to anchor what's being asked for, and reusing the data means
// a verb that already supports one framing automatically supports its typed
// sibling. Persons missing that supporting data always fall back to the bare
// `form` question, so verbs can adopt any of the framings incrementally.
//
// `noTyping` (set for a learner's first run(s) through a lesson — see
// `createExerciseState`) drops the typed (`type-verb`/`type-pronoun`) and
// `spot-error` framings — the ones that demand recalling or cross-checking a
// brand-new form rather than just recognising it — while still letting the
// `sentence`/`pronoun` multiple-choice framings through, so a brand-new
// conjugation is met with real example sentences from the very first
// question, just without being asked to type or spot-the-error yet. Once the
// learner's been through the lesson enough times, later runs open up the full
// mix. Every question also carries the `verbId`/`tense` it was generated
// from — irrelevant within a single-verb-and-tense lesson, but what lets a
// "review" lesson (see `LESSONS`) interleave questions from several lessons'
// worth of conjugation tables and still show each one in its correct
// verb/tense context.
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
export function generateQuestions(verb, tense, { noTyping = false, rounds = 1 } = {}) {
  const table = verb.conjugations[tense]
  const sentences = verb.sentences?.[tense] ?? {}
  const pronounSentences = verb.pronounSentences?.[tense] ?? {}
  const persons = Object.keys(table)
  const personsWithSentences = persons.filter((candidate) => sentences[candidate])
  const source = { verbId: verb.id, tense }
  const usedKinds = new Map()

  function buildQuestion(person) {
    const sentence = pickVariant(sentences[person])
    const pronounSentence = verb.pronouns && pronounSentences[person]
    const availableKinds = [
      sentence && 'sentence',
      sentence && !noTyping && 'type-verb',
      sentence && !noTyping && personsWithSentences.length >= 4 && 'spot-error',
      pronounSentence && 'pronoun',
      pronounSentence && !noTyping && 'type-pronoun',
    ].filter(Boolean)

    let kind = rollQuestionKind(availableKinds)
    const used = usedKinds.get(person) ?? new Set()
    if (used.has(kind)) {
      const unused = ['form', ...availableKinds].filter((candidate) => !used.has(candidate))
      if (unused.length > 0) kind = unused[Math.floor(Math.random() * unused.length)]
    }
    used.add(kind)
    usedKinds.set(person, used)

    switch (kind) {
      case 'sentence': {
        const { correct, options } = buildOptions(table, persons, person)
        return { ...source, kind: 'sentence', person, sentence, correct, options }
      }
      case 'type-verb':
        return { ...source, kind: 'type-verb', person, sentence, correct: table[person] }
      case 'spot-error':
        return { ...source, ...buildSpotErrorQuestion(table, sentences, personsWithSentences, person) }
      case 'pronoun': {
        const { correct, options } = buildOptions(verb.pronouns, persons, person)
        return { ...source, kind: 'pronoun', person, sentence: pronounSentence, correct, options }
      }
      case 'type-pronoun':
        return { ...source, kind: 'type-pronoun', person, sentence: pronounSentence, correct: verb.pronouns[person] }
      default: {
        const { correct, options } = buildOptions(table, persons, person)
        return { ...source, kind: 'form', person, correct, options }
      }
    }
  }

  return Array.from({ length: rounds }, () => shuffle(persons).map(buildQuestion)).flat()
}

// Optional "why is this correct?" explanation, surfaced by `FeedbackBar` only
// after a *correct* answer and only for question kinds that test a concept
// rather than just a memorized form. `pronoun`/`type-pronoun` are the prime
// candidates: whether a Basque pronoun takes the ergative `-k` or stays
// unmarked depends on the verb's `agreement` (NOR vs NOR-NORK) — a distinction
// with no equivalent in English/Spanish, and the kind of thing a learner can
// answer correctly by pattern-matching the sentence without understanding why.
// Every other kind (`form`, `sentence`, `type-verb`, `spot-error`) is "produce/
// recognize this conjugated form", which doesn't have a similarly compact
// "why" beyond "that's the form" — `getExplanation` returns `null` for those,
// and `FeedbackBar` simply doesn't show the toggle.
//
// `t` is the caller's `useLanguage().t`, so the explanation text follows the
// interface language while `{pronoun}`/`{verb}`/`{form}` stay the untranslated
// Basque being taught — same split as `getEncouragement`/`describeLesson`.
export function getExplanation(verb, question, t) {
  if (question.kind !== 'pronoun' && question.kind !== 'type-pronoun') return null
  const key = verb.agreement.includes('nork') ? 'explanationPronounErgative' : 'explanationPronounAbsolutive'
  return t(key, { pronoun: question.correct, verb: verb.verb, form: verb.conjugations[question.tense][question.person] })
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
      const countsTowardScore = isCorrect && !question.retry
      return {
        ...state,
        selected: action.option,
        status: isCorrect ? 'correct' : 'incorrect',
        correctCount: state.correctCount + (countsTowardScore ? 1 : 0),
        streak: isCorrect ? state.streak + 1 : 0,
      }
    }
    case 'next': {
      const [current, ...rest] = state.queue
      const queue = state.status === 'correct' ? rest : [...rest, { ...current, retry: true }]
      return { ...state, queue, selected: null, status: 'active' }
    }
    default:
      return state
  }
}
