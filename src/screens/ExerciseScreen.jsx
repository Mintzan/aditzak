import { useEffect, useReducer, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { trackEvent } from '../analytics'
import { getShareUrl, shareContent } from '../shareUtils'
import { vibrateCorrect, vibrateIncorrect, vibrateResult } from '../hapticsUtils'
import { VERBS, TENSE_META, PERSON_LABEL_KEYS } from '../data/verbs'
import { LESSONS } from '../data/lessons'
import { READING_ITEMS } from '../data/readingItems'
import {
  buildFlagDiagnostics,
  canBuyHeart,
  computeLessonPoints,
  computeStars,
  exerciseReducer,
  generateCaseMixerQuestions,
  generateCrossVerbQuestions,
  generateMatchPairsQuestions,
  generateQuestions,
  generateReadingQuestions,
  generateSuffixChoiceQuestions,
  getComposedTable,
  getCrossVerbCandidates,
  getExplanation,
  getEncouragement,
  getIntroducedSources,
  getLureRationale,
  HEART_COST_POINTS,
  isAnswerCorrect,
  pickEncouragementVariantIndex,
  getStreakEncouragement,
  getWeakSpotQuestions,
  shuffle,
} from '../lessonLogic'
import { describeLesson, verbMeaning } from '../lessonDisplay'
import { FixedArgumentBadge, ProgressBar, Stars, VerbBadgeRow } from '../components/badges'
import { FEEDBACK_API_URL, FEEDBACK_MESSAGE_MAX_LENGTH } from '../api'
import { CheckIcon, CrossIcon, FlagIcon, HeartBrokenIcon, LightbulbIcon, PointsIcon } from '../components/icons'

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

// A conjugation pool lesson (`lesson.sources`) can carry far more verbs than
// a single session should drill — at one round per source, a 30-verb pool
// blew way past `TARGET_EXERCISE_COUNT` (#318's stopgap was chaining the
// pool into `-2/-3/…` sibling lessons). Instead, once a pool exceeds this
// many carriers, `createExerciseState` shuffles and samples just this many
// per play, so session length stays bounded regardless of pool size and
// repeated plays rotate through the full pool over time. Pinned to 4
// (4 carriers × 3 persons × 1 round ≈ `TARGET_EXERCISE_COUNT`); revisit with
// real use.
const CARRIERS_PER_SESSION = 4

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
  // Sample this play's carriers from the full pool (see `CARRIERS_PER_SESSION`);
  // pools at or under the cap are left untouched, so single-source/small-pool
  // lessons behave exactly as before. Distractor/cross-verb/weak-spot logic
  // below still draws from the full `sources`, not this sampled subset — only
  // which carriers actually get drilled this session is bounded.
  const sampledSources = sources.length > CARRIERS_PER_SESSION ? shuffle(sources).slice(0, CARRIERS_PER_SESSION) : sources
  const targetPerSource = TARGET_EXERCISE_COUNT / sampledSources.length
  // Reviews with fewer than 3 sources fall back to forms from verbs/tenses
  // already introduced earlier in `LESSONS` (see `getIntroducedSources`) when
  // widening the cross-verb candidate pools below — a 2-source review (e.g.
  // `unit-1-review`) otherwise has only a single sibling to draw from.
  const extraSources = lesson.review && sources.length < 3 ? getIntroducedSources(LESSONS, lesson.id) : []
  const questions = sampledSources.flatMap(({ verbId, tense }) => {
    const verb = VERBS.find((v) => v.id === verbId)
    const personCount = (lesson.persons ?? Object.keys(getComposedTable(verb, tense))).length
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
      objectAxis: lesson.objectAxis,
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
    ? generateCrossVerbQuestions(resolvedSources, { persons: lesson.persons, extraSiblingSources, verbs: VERBS, objectAxis: lesson.objectAxis })
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
  // A lesson opted in via `lesson.suffixChoice` (#423) gets a handful of
  // "pick -ko or -go" questions on top of its normal cross-section — see
  // `generateSuffixChoiceQuestions`.
  const suffixChoiceQuestions = lesson.suffixChoice ? generateSuffixChoiceQuestions(resolvedSources) : []
  const allQuestions = shuffle([
    ...questions,
    ...extraQuestions,
    ...crossVerbQuestions,
    ...caseMixerQuestions,
    ...matchPairsQuestions,
    ...suffixChoiceQuestions,
  ])
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
  const table = getComposedTable(verb, tense)
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
          className="w-full rounded-xl bg-brand-forest text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
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
  correct: 'border-semantic-correct bg-semantic-correct-tint text-semantic-correct animate-flash',
  incorrect: 'border-semantic-error bg-semantic-error-tint text-semantic-error animate-shake',
}

function AnswerOption({ option, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ minHeight: 48 }}
      className={`w-full rounded-xl border-2 px-5 py-4 text-left text-lg font-semibold transition ${OPTION_STYLES[status]} ${
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
  correct: 'border-semantic-correct bg-semantic-correct-tint text-semantic-correct animate-flash',
  incorrect: 'border-semantic-error bg-semantic-error-tint text-semantic-error animate-shake',
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
        className={`w-full rounded-xl border-2 px-5 py-4 text-lg font-semibold transition focus:outline-none ${TYPED_INPUT_STYLES[status]} ${
          isAnswered ? 'cursor-default' : ''
        }`}
      />
      {!isAnswered && (
        <button
          type="submit"
          disabled={value.trim() === ''}
          style={{ minHeight: 48 }}
          className="w-full rounded-xl bg-brand-forest px-5 py-4 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
  correct: 'border-semantic-correct bg-semantic-correct-tint text-semantic-correct',
  incorrect: 'border-semantic-error bg-semantic-error-tint text-semantic-error animate-shake',
}

function MatchTile({ label, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || status === 'correct'}
      style={{ minHeight: 48 }}
      className={`w-full rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${MATCH_TILE_STYLES[status]} ${
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
  correct: 'border-semantic-correct bg-semantic-correct-tint text-semantic-correct animate-flash',
  incorrect: 'border-semantic-error bg-semantic-error-tint text-semantic-error animate-shake',
}

function WordChip({ text, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ minHeight: 44 }}
      className={`rounded-xl border-2 px-4 py-2 text-base font-semibold transition ${WORD_CHIP_STYLES[status]} ${
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
          className="w-full rounded-xl bg-brand-forest px-5 py-4 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
// `kind: 'form'` review questions are the same exception, for a different
// reason (#228): they have no sentence either, so with the verb name hidden
// too a player sees only a pronoun and four conjugated forms with no way to
// tell which verb is under test — a deliberately-hard lure becomes
// indistinguishable from a broken question. So `form` always shows the verb,
// review or not.
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
  if (question.kind === 'suffix-choice') {
    return (
      <>
        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">{t(tenseMeta.labelKey)}</p>
        <h2 className="mt-2 text-4xl font-extrabold text-gray-900">{question.infinitive}</h2>
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
  'suffix-choice': 'questionSuffixChoice',
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
        <LightbulbIcon className="h-5 w-5 shrink-0 text-green-600" />
        <span className="flex-1">{t('explanationToggle')}</span>
        <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {expanded && <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">{explanation}</p>}
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
            <CheckIcon className="h-10 w-10 text-green-600" />
            <p className="text-sm text-gray-700">{t('flagSuccess')}</p>
            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: 48 }}
              className="w-full rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
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
              className="rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98] disabled:opacity-50"
            >
              {requestStatus === 'sending' ? t('flagSending') : t('flagSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function FeedbackBar({
  status,
  isLast,
  streakEncouragement,
  explanation,
  lureRationale,
  showExplanation,
  onToggleExplanation,
  onContinue,
  lesson,
  question,
  verb,
  selected,
}) {
  const { t } = useLanguage()
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [flagged, setFlagged] = useState(false)
  if (status === 'active') return null
  const isCorrect = status === 'correct'
  return (
    <div className={`px-5 pt-4 pb-6 ${isCorrect ? 'bg-semantic-correct-tint' : 'bg-semantic-error-tint'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className={`flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-semantic-correct' : 'text-semantic-error'}`}>
          {streakEncouragement ? (
            <span className="text-2xl" aria-hidden="true">
              {streakEncouragement.icon}
            </span>
          ) : isCorrect ? (
            <CheckIcon className="h-6 w-6 shrink-0" />
          ) : (
            <CrossIcon className="h-6 w-6 shrink-0" />
          )}
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
          className="flex shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-gray-600 disabled:opacity-50"
        >
          <FlagIcon className="h-5 w-5" />
        </button>
      </div>
      {isCorrect && explanation && (
        <ExplanationToggle explanation={explanation} expanded={showExplanation} onToggle={onToggleExplanation} />
      )}
      {/* [C2]/#229: shown immediately rather than behind a toggle (unlike
          `ExplanationToggle` above) — it explains the *specific wrong answer
          just picked*, not a general "why is this correct" aside, so hiding
          it behind a tap would bury the one piece of feedback this answer
          needs. */}
      {!isCorrect && lureRationale && (
        <p className="mb-3 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">{lureRationale}</p>
      )}
      <button
        type="button"
        onClick={onContinue}
        style={{ minHeight: 48 }}
        className="w-full rounded-xl bg-brand-forest text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
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

// Shown when a *fresh* attempt (never completed before — see `ExerciseScreen`'s
// `isFreshAttempt`) runs out of hearts partway through. Blocking — no
// backdrop-dismiss — since it's a forced decision point, not an informational
// aside like `HeartsLockedModal` (`HomeScreen`). Buying a heart doesn't reset
// any state here: it's an overlay on top of the still-intact exercise, so
// once `hearts.currentHearts` moves off 0 the overlay just stops rendering
// and the learner is exactly where they left off (same question, same
// feedback state).
function OutOfHeartsOverlay({ canBuy, onBuyHeart, onExit }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="out-of-hearts-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 text-center sm:rounded-3xl"
      >
        <div className="mb-2 flex justify-center">
          <HeartBrokenIcon className="h-10 w-10 text-rose-400" />
        </div>
        <h2 id="out-of-hearts-title" className="mb-1 text-lg font-bold text-gray-900">
          {t('outOfHeartsTitle')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">{t('outOfHeartsBody')}</p>
        <div className="flex flex-col gap-2">
          {canBuy && (
            <button
              type="button"
              onClick={onBuyHeart}
              style={{ minHeight: 48 }}
              className="rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
            >
              {t('outOfHeartsBuy', { cost: HEART_COST_POINTS })}
            </button>
          )}
          <button
            type="button"
            onClick={onExit}
            style={{ minHeight: 48 }}
            className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-red-300 hover:text-red-600"
          >
            {t('outOfHeartsExit')}
          </button>
        </div>
      </div>
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
        <p className="flex items-center gap-1.5 rounded-full bg-brand-txakoli-tint px-3 py-1.5 text-sm font-bold text-brand-txakoli-text">
          <PointsIcon className="h-4 w-4" />
          {tCount('pointsEarned', pointsEarned)}
        </p>
      )}
      <p className="text-base text-gray-600">{t(messageKey)}</p>
      <button
        type="button"
        onClick={onDone}
        style={{ minHeight: 48 }}
        className="w-full rounded-xl bg-brand-forest text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
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

// Gates the mid-lesson streak nudge alongside the session-level cooldown
// (`randomStreakNudgeCooldown`, in `lessonLogic.js`) — even once eligible,
// only a chance of actually firing, so it reads as an occasional surprise
// rather than a predictable popup.
const STREAK_NUDGE_CHANCE = 0.6

// Pulled out to its own (impure) function — the `react-hooks/purity` rule
// forbids `Math.random` calls written directly inside component bodies, even
// inside event handlers, since it can't always tell render code from event
// code apart. Calling it from `handleSelect`, in response to an answer, is
// fine: that's an event, not a render.
function rollStreakNudgeChance() {
  return Math.random() < STREAK_NUDGE_CHANCE
}

export function ExerciseScreen({
  lesson,
  attempts,
  errorStats,
  hearts,
  points,
  onExit,
  onComplete,
  canShowStreakNudge,
  onStreakNudgeShown,
  onWrongAnswer,
  onBuyHeart,
}) {
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

  // #464: a lesson counts as having unsaved progress once the learner has
  // gotten at least one question right or wrong — read via refs (rather than
  // as a dependency) inside the popstate handler below so that handler always
  // sees the latest value without needing to be torn down and re-registered
  // on every answer.
  const hasProgress = state.correctCount > 0 || (state.misses?.length ?? 0) > 0
  const hasProgressRef = useRef(hasProgress)
  const onExitRef = useRef(onExit)
  const tRef = useRef(t)
  useEffect(() => {
    hasProgressRef.current = hasProgress
    onExitRef.current = onExit
    tRef.current = t
  }, [hasProgress, onExit, t])

  // #464: pressing the browser back button during a lesson should return to
  // the lesson list rather than navigate browser history away from the app —
  // pushing a history entry on mount gives the back button something of ours
  // to pop, which `popstate` then turns into a (possibly confirmed) exit.
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.history.pushState({ aditzakLesson: true }, '')
    function handlePopState() {
      if (hasProgressRef.current && !window.confirm(tRef.current('lessonAbandonConfirm'))) {
        window.history.pushState({ aditzakLesson: true }, '')
        return
      }
      onExitRef.current()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleExitClick() {
    if (hasProgressRef.current && typeof window !== 'undefined' && !window.confirm(t('lessonAbandonConfirm'))) {
      return
    }
    onExit()
  }

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
  // A fresh attempt (never completed before *this session started* — fixed
  // at mount via `attempts`, not re-derived per question, so a lesson that
  // was already complete when this screen mounted stays a "replay" for its
  // whole duration even though `attempts` only updates in the parent after
  // `onComplete`) that runs out of hearts gets force-stopped by
  // `OutOfHeartsOverlay` below; a replay of an already-completed lesson is
  // never interrupted by hearts. `hearts` is a prop straight from `App.jsx`'s
  // state, so this is purely derived — no local state/effect needed to track
  // it, and it clears itself the instant `hearts.currentHearts` moves off 0
  // (regen or purchase).
  const isFreshAttempt = attempts === 0
  const outOfHearts = isFreshAttempt && hearts?.currentHearts === 0
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
    // Every incorrect submission costs a heart, including retries of the same
    // question — unlike `misses`/scoring (which only count a question's
    // first attempt), the heart economy's trigger is "an incorrect answer is
    // submitted," full stop (see `docs/HEART_ECONOMY_ANALYSIS.md`).
    if (!isCorrect) onWrongAnswer()
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
          onClick={handleExitClick}
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

        <QuestionPrompt
          verb={verb}
          tenseMeta={tenseMeta}
          question={question}
          showVerb={!lesson.review || !question.options || question.kind === 'form'}
        />

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
        lureRationale={state.status === 'incorrect' ? getLureRationale(question, state.selected, t) : null}
        showExplanation={showExplanation}
        onToggleExplanation={() => setShowExplanation((expanded) => !expanded)}
        onContinue={handleContinue}
        lesson={lesson}
        question={question}
        verb={verb}
        selected={state.selected}
      />

      {outOfHearts && (
        <OutOfHeartsOverlay canBuy={canBuyHeart(hearts, points)} onBuyHeart={onBuyHeart} onExit={onExit} />
      )}
    </div>
  )
}
