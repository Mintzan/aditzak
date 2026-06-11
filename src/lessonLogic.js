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
export function getEncouragement(correctCount, total) {
  const stars = computeStars(correctCount, total)
  switch (stars) {
    case 3:
      return { icon: '🎉', headline: 'Bikain!', messageKey: 'encouragementPerfect' }
    case 2:
      return { icon: '👏', headline: 'Oso ondo!', messageKey: 'encouragementGreat' }
    case 1:
      return { icon: '💪', headline: 'Ondo!', messageKey: 'encouragementGood' }
    default:
      return { icon: '🌱', headline: 'Ez etsi!', messageKey: 'encouragementKeepGoing' }
  }
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
    return { person: candidate, sentence: sentences[candidate].replace('___', form) }
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
export function generateQuestions(verb, tense, { noTyping = false, rounds = 1 } = {}) {
  const table = verb.conjugations[tense]
  const sentences = verb.sentences?.[tense] ?? {}
  const pronounSentences = verb.pronounSentences?.[tense] ?? {}
  const persons = Object.keys(table)
  const personsWithSentences = persons.filter((candidate) => sentences[candidate])
  const source = { verbId: verb.id, tense }

  function buildQuestion(person) {
    const sentence = sentences[person]
    const pronounSentence = verb.pronouns && pronounSentences[person]
    const availableKinds = [
      sentence && 'sentence',
      sentence && !noTyping && 'type-verb',
      sentence && !noTyping && personsWithSentences.length >= 4 && 'spot-error',
      pronounSentence && 'pronoun',
      pronounSentence && !noTyping && 'type-pronoun',
    ].filter(Boolean)

    switch (rollQuestionKind(availableKinds)) {
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
