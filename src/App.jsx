import { useEffect, useMemo, useReducer, useState } from 'react'
import {
  exerciseReducer,
  generateQuestions,
  getUnlockedLessonIds,
  recordResult,
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

// Lessons are simply (verb × tense) pairs, in data order: izan/present,
// izan/past, ukan/present, ukan/past.
const LESSONS = VERBS.flatMap((verb) =>
  Object.keys(verb.conjugations).map((tense) => ({
    id: `${verb.id}-${tense}`,
    verbId: verb.id,
    tense,
  })),
)

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

function groupLessonsByVerb(lessons) {
  const order = []
  const byVerb = new Map()
  lessons.forEach((lesson) => {
    if (!byVerb.has(lesson.verbId)) {
      byVerb.set(lesson.verbId, [])
      order.push(lesson.verbId)
    }
    byVerb.get(lesson.verbId).push(lesson)
  })
  return order.map((verbId) => ({
    verb: VERBS.find((verb) => verb.id === verbId),
    lessons: byVerb.get(verbId),
  }))
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

function LessonNode({ lesson, verb, locked, stars, onSelect }) {
  const meta = TENSE_META[lesson.tense]
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
        {locked ? '🔒' : meta.label[0]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {meta.label} <span className="font-normal text-gray-400">· {meta.basque}</span>
        </p>
        <p className="truncate text-sm text-gray-500">
          {verb.verb} — {verb.meaning}
        </p>
      </div>
      <Stars count={stars} />
    </button>
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
      <div className="flex flex-col gap-3">
        {lessons.map((lesson) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            verb={verb}
            locked={!unlockedIds.has(lesson.id)}
            stars={progress[lesson.id]?.bestStars ?? 0}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

function LearnTab({ progress, onSelectLesson }) {
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress), [progress])
  const groups = useMemo(() => groupLessonsByVerb(LESSONS), [])

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">Pick a lesson to practice. Finish one to unlock the next.</p>
      {groups.map(({ verb, lessons }) => (
        <VerbSection
          key={verb.id}
          verb={verb}
          lessons={lessons}
          progress={progress}
          unlockedIds={unlockedIds}
          onSelect={onSelectLesson}
        />
      ))}
    </div>
  )
}

function ProgressTab({ progress }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Your progress</h2>
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const verb = VERBS.find((v) => v.id === lesson.verbId)
          const meta = TENSE_META[lesson.tense]
          const entry = progress[lesson.id]
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {verb.verb} · {meta.label}
                </p>
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
// Multiple choice exercise screen
// =============================================================================

function createExerciseState(verb, tense) {
  return {
    questions: generateQuestions(verb, tense),
    index: 0,
    selected: null,
    status: 'active', // 'active' | 'correct' | 'incorrect'
    correctCount: 0,
  }
}

function getOptionStatus(option, question, state) {
  if (state.status === 'active') return 'idle'
  if (option === question.correct) return 'correct'
  if (option === state.selected) return 'incorrect'
  return 'idle'
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

function FeedbackBar({ status, correctAnswer, isLast, onContinue }) {
  if (status === 'active') return null
  const isCorrect = status === 'correct'
  return (
    <div className={`px-5 pt-4 pb-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`mb-3 flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        <span className="text-2xl" aria-hidden="true">
          {isCorrect ? '✓' : '✕'}
        </span>
        {isCorrect ? (
          <span>Bikain! Great job!</span>
        ) : (
          <span>
            Not quite — the answer is <span className="underline">{correctAnswer}</span>
          </span>
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

function MultipleChoiceScreen({ verb, tense, onExit, onComplete }) {
  const [state, dispatch] = useReducer(exerciseReducer, undefined, () => createExerciseState(verb, tense))

  const total = state.questions.length
  const question = state.questions[state.index]
  const isAnswered = state.status !== 'active'
  const isLast = state.index === total - 1
  const tenseMeta = TENSE_META[tense]
  const progressValue = (state.index + (isAnswered ? 1 : 0)) / total

  function handleSelect(option) {
    if (isAnswered) return
    dispatch({ type: 'answer', option })
  }

  function handleContinue() {
    if (isLast) {
      onComplete({ correctCount: state.correctCount, total })
    } else {
      dispatch({ type: 'next' })
    }
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

        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
          {verb.verb} — {verb.meaning} · {tenseMeta.label}
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-gray-900">{question.person}</h2>
        <p className="mt-1 text-gray-500">{PERSON_LABELS[question.person]}</p>

        <p className="mt-8 mb-3 text-base font-semibold text-gray-700">Which form is correct?</p>
        <div className="flex flex-col gap-3">
          {question.options.map((option) => (
            <AnswerOption
              key={option}
              option={option}
              status={getOptionStatus(option, question, state)}
              disabled={isAnswered}
              onSelect={() => handleSelect(option)}
            />
          ))}
        </div>
      </div>

      <FeedbackBar status={state.status} correctAnswer={question.correct} isLast={isLast} onContinue={handleContinue} />
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

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  function handleResetProgress() {
    if (typeof window !== 'undefined' && !window.confirm('Reset all lesson progress? This cannot be undone.')) {
      return
    }
    setProgress({})
  }

  if (activeLessonId) {
    const lesson = LESSONS.find((l) => l.id === activeLessonId)
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    return (
      <MultipleChoiceScreen
        key={lesson.id}
        verb={verb}
        tense={lesson.tense}
        onExit={() => setActiveLessonId(null)}
        onComplete={(result) => {
          setProgress((previous) => recordResult(previous, lesson.id, result))
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
