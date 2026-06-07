import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  computeStars,
  exerciseReducer,
  generateQuestions,
  getEncouragement,
  getStreakEncouragement,
  getUnlockedLessonIds,
  isAnswerCorrect,
  recordResult,
  shuffle,
} from './lessonLogic'

// =============================================================================
// Verb data
//
// `type` separates synthetic verbs (conjugated directly, "aditz trinkoak")
// from periphrastic ones (participle + auxiliary, "aditz perifrastikoak"),
// so the UI can badge them differently once periphrastic verbs are added.
//
// `agreement` lists which arguments the verb marks on the finite form
// (nor = absolutive, nori = dative, nork = ergative) — the famous
// nor-nori-nork system. `ukan` is shown here in its citation paradigm,
// i.e. with a fixed 3rd-person-singular absolutive object ("it/him/her").
//
// `dialect` is a placeholder for future variants: a verb could later carry
// e.g. `dialectVariants: { bizkaiera: { conjugations: {...} } }` overrides
// without changing this shape.
//
// `sentences` (optional, by tense → person) gives an example sentence with
// `___` marking where the conjugated form belongs. It powers the
// "complete the sentence" question style — `generateQuestions` mixes those
// in alongside bare-form questions wherever a sentence is available, falling
// back to bare-form-only for verbs/persons that don't have one yet.
//
// `pronouns` + `pronounSentences` are the equivalent pair for a second
// "complete the sentence" flavour: filling in the correctly-declined personal
// pronoun (e.g. "Nik" for the ergative subject of `ukan`) rather than the verb
// form. `pronouns` gives the declined form for each grammatical person — the
// case depends on which argument that pronoun fills for this verb (absolutive
// for `izan`'s `nor` subject, ergative for `ukan`'s `nork` subject) — and
// `pronounSentences` gives a sentence with `___` marking where it goes, with
// the verb already spelled out.
// =============================================================================

const VERBS = [
  {
    id: 'izan',
    verb: 'izan',
    meaning: 'to be',
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'naiz', hi: 'haiz', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
      past: { ni: 'nintzen', hi: 'hintzen', hura: 'zen', gu: 'ginen', zuek: 'zineten', haiek: 'ziren' },
    },
    sentences: {
      present: {
        ni: 'Ni irakaslea ___.',
        hi: 'Hi ikaslea ___.',
        hura: 'Hura medikua ___.',
        gu: 'Gu lagunak ___.',
        zuek: 'Zuek azkarrak ___.',
        haiek: 'Haiek euskaldunak ___.',
      },
      past: {
        ni: 'Ni gaztea ___.',
        hi: 'Hi nire laguna ___.',
        hura: 'Hura irakasle ona ___.',
        gu: 'Gu ikasle onak ___.',
        zuek: 'Zuek oso azkarrak ___.',
        haiek: 'Haiek nire lagunak ___.',
      },
    },
    pronouns: { ni: 'Ni', hi: 'Hi', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ irakaslea naiz.',
        hi: '___ ikaslea haiz.',
        hura: '___ medikua da.',
        gu: '___ lagunak gara.',
        zuek: '___ azkarrak zarete.',
        haiek: '___ euskaldunak dira.',
      },
      past: {
        ni: '___ gaztea nintzen.',
        hi: '___ nire laguna hintzen.',
        hura: '___ irakasle ona zen.',
        gu: '___ ikasle onak ginen.',
        zuek: '___ oso azkarrak zineten.',
        haiek: '___ nire lagunak ziren.',
      },
    },
  },
  {
    id: 'ukan',
    verb: 'ukan',
    meaning: 'to have',
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'dut', hi: 'duk', hura: 'du', gu: 'dugu', zuek: 'duzue', haiek: 'dute' },
      past: { ni: 'nuen', hi: 'huen', hura: 'zuen', gu: 'genuen', zuek: 'zenuten', haiek: 'zuten' },
    },
    sentences: {
      present: {
        ni: 'Nik liburu bat ___.',
        hi: 'Hik auto bat ___.',
        hura: 'Berak etxe bat ___.',
        gu: 'Guk denbora ___.',
        zuek: 'Zuek arazo bat ___.',
        haiek: 'Haiek aukera bat ___.',
      },
      past: {
        ni: 'Nik diru asko ___.',
        hi: 'Hik liburu bat ___.',
        hura: 'Hark ideia on bat ___.',
        gu: 'Guk arrazoi ___.',
        zuek: 'Zuek galdera bat ___.',
        haiek: 'Haiek denbora gutxi ___.',
      },
    },
    pronouns: { ni: 'Nik', hi: 'Hik', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ liburu bat dut.',
        hi: '___ auto bat duk.',
        hura: '___ etxe bat du.',
        gu: '___ denbora dugu.',
        zuek: '___ arazo bat duzue.',
        haiek: '___ aukera bat dute.',
      },
      past: {
        ni: '___ diru asko nuen.',
        hi: '___ liburu bat huen.',
        hura: '___ ideia on bat zuen.',
        gu: '___ arrazoi genuen.',
        zuek: '___ galdera bat zenuten.',
        haiek: '___ denbora gutxi zuten.',
      },
    },
  },
]

const PERSON_LABELS = {
  ni: 'I',
  hi: 'you (familiar)',
  hura: 'he / she / it',
  gu: 'we',
  zuek: 'you all',
  haiek: 'they',
}

const TENSE_META = {
  present: { label: 'Present', basque: 'oraina' },
  past: { label: 'Past', basque: 'lehena' },
}

const TYPE_META = {
  synthetic: { label: 'Synthetic · trinkoa', className: 'bg-indigo-100 text-indigo-700' },
  periphrastic: { label: 'Periphrastic · perifrastikoa', className: 'bg-rose-100 text-rose-700' },
}

const AGREEMENT_META = {
  nor: { label: 'NOR', title: 'Absolutive — the subject (or object) being talked about', className: 'bg-blue-100 text-blue-700' },
  nori: { label: 'NORI', title: 'Dative — to / for whom', className: 'bg-purple-100 text-purple-700' },
  nork: { label: 'NORK', title: 'Ergative — who performs the action', className: 'bg-amber-100 text-amber-700' },
}

const DIALECT_LABELS = {
  batua: 'Batua',
}

// The itinerary runs simple-and-singular → richer-and-combined:
//
//  1. Practice lessons are (verb × tense) pairs, in data order — one
//     conjugation at a time, e.g. izan/present, izan/past, ukan/present,
//     ukan/past. `id: '${verbId}-${tense}'`, shape `{ id, verbId, tense }`.
//  2. Once a verb has more than one tense, a "verb review" lesson combining
//     all of them is appended right after its practice lessons — e.g.
//     izan/present + izan/past in one session, so the learner has to tell the
//     two paradigms apart rather than coast on "it's all izan-present-shaped".
//  3. Once there's more than one verb, a final "mixed review" caps the whole
//     sequence, drawing from every (verb × tense) pair across the app — the
//     most demanding checkpoint, mixing both verbs and both tenses.
// Review lessons carry `review: true` and `sources: [{ verbId, tense }, …]`
// (the conjugation tables they draw from) instead of a single `verbId`/
// `tense` — `generateQuestions` is called once per source and the results
// interleaved (see `createExerciseState`), and every generated question keeps
// its own `verbId`/`tense` so the exercise screen can show each one in its
// correct context even as it changes question to question.
function tensesOf(verb) {
  return Object.keys(verb.conjugations)
}

function verbReviewLesson(verb) {
  const tenses = tensesOf(verb)
  if (tenses.length < 2) return null
  return {
    id: `${verb.id}-review`,
    review: true,
    sources: tenses.map((tense) => ({ verbId: verb.id, tense })),
  }
}

const LESSONS = [
  ...VERBS.flatMap((verb) =>
    [...tensesOf(verb).map((tense) => ({ id: `${verb.id}-${tense}`, verbId: verb.id, tense })), verbReviewLesson(verb)].filter(Boolean),
  ),
  ...(VERBS.length > 1
    ? [
        {
          id: 'mixed-review',
          review: true,
          sources: VERBS.flatMap((verb) => tensesOf(verb).map((tense) => ({ verbId: verb.id, tense }))),
        },
      ]
    : []),
]

// =============================================================================
// Progress persistence (localStorage)
// =============================================================================

const STORAGE_KEY = 'aditzak:progress:v1'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage may be unavailable (private browsing, quota) — ignore.
  }
}

// A lesson "belongs" to a single verb's section if every conjugation table it
// draws from is that verb's — true for every practice lesson (one source) and
// for a "verb review" (several sources, but all the same verb). A "mixed
// review" spans more than one verb and so doesn't fit any single section;
// `groupLessonsByVerb` collects those separately so `LearnTab` can show them
// in their own trailing group instead.
function singleVerbId(lesson) {
  const sources = lesson.sources ?? [{ verbId: lesson.verbId }]
  const [first, ...rest] = sources
  return rest.every((source) => source.verbId === first.verbId) ? first.verbId : null
}

function groupLessonsByVerb(lessons) {
  const order = []
  const byVerb = new Map()
  const mixedLessons = []
  lessons.forEach((lesson) => {
    const verbId = singleVerbId(lesson)
    if (verbId === null) {
      mixedLessons.push(lesson)
      return
    }
    if (!byVerb.has(verbId)) {
      byVerb.set(verbId, [])
      order.push(verbId)
    }
    byVerb.get(verbId).push(lesson)
  })
  return {
    verbGroups: order.map((verbId) => ({
      verb: VERBS.find((verb) => verb.id === verbId),
      lessons: byVerb.get(verbId),
    })),
    mixedLessons,
  }
}

// Display copy for a lesson card/row, covering both practice and review
// shapes so `LessonNode`/`ProgressTab`/`LessonResultsScreen` don't each need
// their own branching. `title`/`subtitle` are `{ main, secondary }` pairs —
// mirroring the two-tone "label · detail" layout `LessonNode` already used
// for practice lessons (e.g. "Present · oraina" / "izan — to be") — and
// `heading` is the single-line form `ProgressTab` shows in its flat list.
function describeLesson(lesson) {
  if (!lesson.review) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    const meta = TENSE_META[lesson.tense]
    return {
      icon: meta.label[0],
      title: { main: meta.label, secondary: meta.basque },
      subtitle: { main: verb.verb, secondary: verb.meaning },
      heading: `${verb.verb} · ${meta.label}`,
    }
  }
  const verbNames = [...new Set(lesson.sources.map(({ verbId }) => VERBS.find((v) => v.id === verbId).verb))]
  const tenseLabels = [...new Set(lesson.sources.map(({ tense }) => TENSE_META[tense].label))]
  const reviewName = verbNames.length > 1 ? 'Mixed review' : `${verbNames[0]} review`
  return {
    icon: '🔁',
    title: { main: 'Review', secondary: tenseLabels.join(' + ') },
    subtitle: { main: verbNames.join(' & '), secondary: 'mixed practice' },
    heading: `${reviewName} · ${tenseLabels.join(' + ')}`,
  }
}

// =============================================================================
// Small shared bits
// =============================================================================

function TypeBadge({ type }) {
  const meta = TYPE_META[type]
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>{meta.label}</span>
}

function AgreementBadge({ role }) {
  const meta = AGREEMENT_META[role]
  return (
    <span title={meta.title} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {meta.label}
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
    </div>
  )
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-base text-amber-400" aria-label={`${count} of 3 stars`}>
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

// =============================================================================
// Home screen — lesson selection
// =============================================================================

function LessonNode({ lesson, locked, stars, onSelect }) {
  const { icon, title, subtitle } = describeLesson(lesson)
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(lesson.id)}
      style={{ minHeight: 48 }}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${
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
        {locked ? '🔒' : icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {title.main} <span className="font-normal text-gray-400">· {title.secondary}</span>
        </p>
        <p className="truncate text-sm text-gray-500">
          {subtitle.main} — {subtitle.secondary}
        </p>
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
          stars={progress[lesson.id]?.bestStars ?? 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function VerbSection({ verb, lessons, progress, unlockedIds, onSelect }) {
  return (
    <section className="mb-7">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">
          {verb.verb} <span className="font-normal text-gray-400">· {verb.meaning}</span>
        </h2>
        <div className="mt-1.5">
          <VerbBadgeRow verb={verb} />
        </div>
      </div>
      <LessonList lessons={lessons} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
    </section>
  )
}

// Mixed reviews span more than one verb, so they don't have a single verb's
// badges/title to anchor a `VerbSection` on — they get their own trailing
// section instead, with copy that frames what makes them different (combining
// verbs/tenses already met) rather than introducing a single paradigm.
function ReviewSection({ lessons, progress, unlockedIds, onSelect }) {
  return (
    <section className="mb-7">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">Review</h2>
        <p className="mt-1 text-sm text-gray-500">Checkpoints that mix verbs and tenses you've already practiced.</p>
      </div>
      <LessonList lessons={lessons} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
    </section>
  )
}

function LearnTab({ progress, onSelectLesson }) {
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress), [progress])
  const { verbGroups, mixedLessons } = useMemo(() => groupLessonsByVerb(LESSONS), [])

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">Pick a lesson to practice. Finish one to unlock the next.</p>
      {verbGroups.map(({ verb, lessons }) => (
        <VerbSection
          key={verb.id}
          verb={verb}
          lessons={lessons}
          progress={progress}
          unlockedIds={unlockedIds}
          onSelect={onSelectLesson}
        />
      ))}
      {mixedLessons.length > 0 && (
        <ReviewSection lessons={mixedLessons} progress={progress} unlockedIds={unlockedIds} onSelect={onSelectLesson} />
      )}
    </div>
  )
}

function ProgressTab({ progress }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Your progress</h2>
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const { heading } = describeLesson(lesson)
          const entry = progress[lesson.id]
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">
                  {entry
                    ? `Best ${entry.bestScore}/${entry.totalQuestions} · ${entry.attempts} attempt${entry.attempts === 1 ? '' : 's'}`
                    : 'Not started yet'}
                </p>
              </div>
              <Stars count={entry?.bestStars ?? 0} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProfileTab({ onResetProgress }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">🧑‍🎓</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Ikaslea</h2>
        <p className="text-sm text-gray-500">Achievements and streaks are coming soon.</p>
      </div>
      <button
        type="button"
        onClick={onResetProgress}
        style={{ minHeight: 48 }}
        className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
      >
        Reset progress
      </button>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', label: 'Learn', icon: '🏠' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'profile', label: 'Profile', icon: '🧑‍🎓' },
]

function BottomNav({ active, onSelect }) {
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
          {item.label}
        </button>
      ))}
    </nav>
  )
}

function HomeScreen({ progress, tab, onChangeTab, onSelectLesson, onResetProgress }) {
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const maxStars = LESSONS.length * 3

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Aditzak</h1>
          <p className="text-xs text-gray-500">Basque verb conjugation practice</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
          <span aria-hidden="true">★</span>
          <span>
            {totalStars}
            <span className="font-normal text-amber-500">/{maxStars}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-28">
        {tab === 'home' && <LearnTab progress={progress} onSelectLesson={onSelectLesson} />}
        {tab === 'progress' && <ProgressTab progress={progress} />}
        {tab === 'profile' && <ProfileTab onResetProgress={onResetProgress} />}
      </main>

      <BottomNav active={tab} onSelect={onChangeTab} />
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
// block. `onlyBareForm` (see `generateQuestions`) is set only for a learner's
// very first run through a *practice* lesson — review lessons always show the
// full mix of framings, and a lesson being repeated has already had its
// "simple recognition" introduction.
function createExerciseState(lesson, attempts) {
  const sources = lesson.sources ?? [{ verbId: lesson.verbId, tense: lesson.tense }]
  const onlyBareForm = !lesson.review && attempts === 0
  const questions = shuffle(
    sources.flatMap(({ verbId, tense }) => generateQuestions(VERBS.find((verb) => verb.id === verbId), tense, { onlyBareForm })),
  )
  return {
    queue: questions,
    total: questions.length,
    selected: null,
    status: 'active', // 'active' | 'correct' | 'incorrect'
    correctCount: 0,
    streak: 0,
  }
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
      }`}
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
        placeholder="Idatzi erantzuna…"
        aria-label="Type your answer"
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
          Check
        </button>
      )}
    </form>
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

// `generateQuestions` mixes five question styles, but they only differ in two
// independent ways: how the prompt is framed (bare person/label pair, or a
// sentence with a blank — keyed off `question.sentence` rather than listing
// every blanked `kind`, so this stays correct as new blanked framings are
// added) and how the answer is given (multiple choice when `question.options`
// is present, typed in otherwise — see `ExerciseScreen`). Every combination
// still tests recognising/recalling the right Basque form, just packaged
// differently.
function QuestionPrompt({ verb, tenseMeta, question }) {
  return (
    <>
      <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {verb.verb} — {verb.meaning} · {tenseMeta.label}
      </p>
      {question.sentence ? (
        <SentenceWithBlank sentence={question.sentence} />
      ) : (
        <>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
            {(verb.pronouns?.[question.person] ?? question.person).toLowerCase()}
          </h2>
          <p className="mt-1 text-gray-500">{PERSON_LABELS[question.person]}</p>
        </>
      )}
    </>
  )
}

const QUESTION_PROMPTS = {
  form: 'Which form is correct?',
  sentence: 'Which word completes the sentence?',
  pronoun: 'Which pronoun completes the sentence?',
  'type-verb': 'Type the word that completes the sentence.',
  'type-pronoun': 'Type the pronoun that completes the sentence.',
}

function FeedbackBar({ status, isLast, streakEncouragement, onContinue }) {
  if (status === 'active') return null
  const isCorrect = status === 'correct'
  return (
    <div className={`px-5 pt-4 pb-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`mb-3 flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        <span className="text-2xl" aria-hidden="true">
          {streakEncouragement ? streakEncouragement.icon : isCorrect ? '✓' : '✕'}
        </span>
        {streakEncouragement ? (
          <span>
            {streakEncouragement.headline} {streakEncouragement.message}
          </span>
        ) : isCorrect ? (
          <span>Bikain! Great job!</span>
        ) : (
          <span>Not quite — you'll see this one again.</span>
        )}
      </p>
      <button
        type="button"
        onClick={onContinue}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl text-lg font-extrabold tracking-wide text-white uppercase transition active:scale-[0.98] ${
          isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLast ? 'Finish' : 'Continue'}
      </button>
    </div>
  )
}

function LessonResultsScreen({ lesson, correctCount, total, onDone }) {
  const stars = computeStars(correctCount, total)
  const { icon, headline, message } = getEncouragement(correctCount, total)
  const { heading } = describeLesson(lesson)

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-5 bg-white px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">{headline}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {heading} — {correctCount}/{total} correct
        </p>
      </div>
      <Stars count={stars} />
      <p className="text-base text-gray-600">{message}</p>
      <button
        type="button"
        onClick={onDone}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
      >
        Continue
      </button>
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

function ExerciseScreen({ lesson, attempts, onExit, onComplete, canShowStreakNudge, onStreakNudgeShown }) {
  const [state, dispatch] = useReducer(exerciseReducer, undefined, () => createExerciseState(lesson, attempts))
  const [finished, setFinished] = useState(false)
  const [streakEncouragement, setStreakEncouragement] = useState(null)
  // Only used by typed-answer questions (`question.options` absent) — reset
  // whenever a new question comes up so the field doesn't carry over what was
  // typed for the previous one.
  const [typedValue, setTypedValue] = useState('')

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
    const milestone = isCorrect ? getStreakEncouragement(state.streak + 1) : null
    const showEncouragement = milestone !== null && canShowStreakNudge && rollStreakNudgeChance()
    setStreakEncouragement(showEncouragement ? milestone : null)
    if (showEncouragement) onStreakNudgeShown()
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
        onDone={() => onComplete({ correctCount: state.correctCount, total })}
      />
    )
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit lesson"
          style={{ minHeight: 48, minWidth: 48 }}
          className="flex items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
        <ProgressBar value={progressValue} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-8">
        <div className="mb-6">
          <VerbBadgeRow verb={verb} />
        </div>

        <QuestionPrompt verb={verb} tenseMeta={tenseMeta} question={question} />

        <p className="mt-8 mb-3 text-base font-semibold text-gray-700">{QUESTION_PROMPTS[question.kind]}</p>
        {question.options ? (
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

      <FeedbackBar status={state.status} isLast={isLast} streakEncouragement={streakEncouragement} onContinue={handleContinue} />
    </div>
  )
}

// =============================================================================
// App shell
// =============================================================================

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [tab, setTab] = useState('home')
  const [activeLessonId, setActiveLessonId] = useState(null)
  // Session-level gate for the mid-lesson streak nudge: counts down once a
  // nudge has been shown, so the next one waits a few lessons rather than
  // popping up again the moment another milestone streak comes around.
  const [streakNudgeCooldown, setStreakNudgeCooldown] = useState(0)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const handleStreakNudgeShown = useCallback(() => {
    setStreakNudgeCooldown(randomStreakNudgeCooldown())
  }, [])

  function handleResetProgress() {
    if (typeof window !== 'undefined' && !window.confirm('Reset all lesson progress? This cannot be undone.')) {
      return
    }
    setProgress({})
  }

  if (activeLessonId) {
    const lesson = LESSONS.find((l) => l.id === activeLessonId)
    return (
      <ExerciseScreen
        key={lesson.id}
        lesson={lesson}
        attempts={progress[lesson.id]?.attempts ?? 0}
        onExit={() => setActiveLessonId(null)}
        canShowStreakNudge={streakNudgeCooldown === 0}
        onStreakNudgeShown={handleStreakNudgeShown}
        onComplete={(result) => {
          setProgress((previous) => recordResult(previous, lesson.id, result))
          setStreakNudgeCooldown((cooldown) => Math.max(0, cooldown - 1))
          setActiveLessonId(null)
        }}
      />
    )
  }

  return (
    <HomeScreen
      progress={progress}
      tab={tab}
      onChangeTab={setTab}
      onSelectLesson={setActiveLessonId}
      onResetProgress={handleResetProgress}
    />
  )
}
