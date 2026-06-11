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
import { JOURNEY } from './journey'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'

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
//
// Per `docs/LEARNING_JOURNEY.md`'s Phase I ("Survival Present"), every verb's
// first lesson is restricted to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` (and,
// much later, `hi`) are added once Unit 6 ("Expansion") is implemented. Until
// then, a Phase I verb's `present` table simply *contains only* those three
// person keys — `generateQuestions` already builds one question per key in
// the table, so a smaller table is all a 3-person lesson needs (see
// `docs/EXERCISE_ENGINE.md`, "Phase I's 3-person horizon", option (a)).
// =============================================================================

const VERBS = [
  {
    id: 'izan',
    verb: 'izan',
    meaning: { en: 'to be', es: 'ser / estar', eu: 'izan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'naiz', zu: 'zara', hura: 'da' },
    },
    sentences: {
      present: {
        ni: 'Ni irakaslea ___.',
        zu: 'Zu ikaslea ___.',
        hura: 'Hura medikua ___.',
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
    pronounSentences: {
      present: {
        ni: '___ irakaslea naiz.',
        zu: '___ ikaslea zara.',
        hura: '___ medikua da.',
      },
    },
  },
  {
    id: 'egon',
    verb: 'egon',
    meaning: { en: 'to be (located / in a state)', es: 'estar (ubicación o estado)', eu: 'egon (norbait/zerbait non dagoen)' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nago', zu: 'zaude', hura: 'dago' },
    },
    sentences: {
      present: {
        ni: 'Ni etxean ___.',
        zu: 'Zu kalean ___.',
        hura: 'Hura eskolan ___.',
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
    pronounSentences: {
      present: {
        ni: '___ etxean nago.',
        zu: '___ kalean zaude.',
        hura: '___ eskolan dago.',
      },
    },
  },
  // Unit 2 ("Having, Wanting, and Knowing") — `ukan` present, trimmed to
  // Phase I's `ni`/`zu`/`hura` horizon (with `zu` per `docs/CONJUGATIONS.md`
  // §3). The old 6-person, no-`zu`, `hi`-based `past` table was removed —
  // unused by any implemented unit, shaped for the pre-journey model, and
  // will be re-added correctly, with `zu`, when Unit 12 ("I Was, I Had") is
  // implemented (same precedent as `izan`'s past table).
  {
    id: 'ukan',
    verb: 'ukan',
    meaning: { en: 'to have', es: 'tener', eu: 'eduki' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'dut', zu: 'duzu', hura: 'du' },
    },
    sentences: {
      present: {
        ni: 'Nik liburu bat ___.',
        zu: 'Zuk auto bat ___.',
        hura: 'Berak etxe bat ___.',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark' },
    pronounSentences: {
      present: {
        ni: '___ liburu bat dut.',
        zu: '___ auto bat duzu.',
        hura: '___ etxe bat du.',
      },
    },
  },
  // `nahi` ("want") — an invariant particle + radical/infinitive + `ukan`,
  // not a lexical verb of its own (see `docs/VERB_COVERAGE.md` §5). Modeled
  // as its own `VERBS` entry — `type: 'periphrastic'` is the closest existing
  // badge for "auxiliary carries the conjugation alongside an invariant
  // element", even though `nahi` isn't a participle in the strict sense.
  // Rides `ukan`'s exact `dut`/`duzu`/`du` suffixes, so it costs nothing in
  // new suffix patterns.
  {
    id: 'nahi',
    verb: 'nahi izan',
    meaning: { en: 'to want', es: 'querer', eu: 'nahi izan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nahi dut', zu: 'nahi duzu', hura: 'nahi du' },
    },
    sentences: {
      present: {
        ni: 'Nik kafe bat ___.',
        zu: 'Etorri ___?',
        hura: 'Hark opari bat ___.',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark' },
    pronounSentences: {
      present: {
        ni: '___ kafe bat nahi dut.',
        zu: '___ etorri nahi duzu?',
        hura: '___ opari bat nahi du.',
      },
    },
  },
  // `jakin` ("to know a fact") — fully synthetic, sharing `ukan`'s
  // `-t`/`-zu`/∅ present suffix family (`dakit`/`dakizu`/`daki`), per
  // `docs/CONJUGATIONS.md` §7. Past has `hik`/`zuk`/`zuek` gaps, irrelevant
  // here (present-only, `ni`/`zu`/`hura`).
  {
    id: 'jakin',
    verb: 'jakin',
    meaning: { en: 'to know (a fact)', es: 'saber (un hecho)', eu: 'jakin (informazioa)' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'dakit', zu: 'dakizu', hura: 'daki' },
    },
    sentences: {
      present: {
        ni: 'Nik erantzuna ___.',
        zu: 'Zuk egia ___.',
        hura: 'Hark sekretua ___.',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark' },
    pronounSentences: {
      present: {
        ni: '___ erantzuna dakit.',
        zu: '___ egia dakizu.',
        hura: '___ sekretua daki.',
      },
    },
  },
  // Unit 3 ("Moving Around") — `joan` present, trimmed to Phase I's
  // `ni`/`zu`/`hura` horizon (`noa`/`zoaz`/`doa`), per
  // `docs/CONJUGATIONS.md` §6 (already has a `zu` row). `gu`/`zuek`/`haiek`
  // arrive in Unit 6 ("Expansion"), same as every Phase I verb.
  {
    id: 'joan',
    verb: 'joan',
    meaning: { en: 'to go', es: 'ir', eu: 'joan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'noa', zu: 'zoaz', hura: 'doa' },
    },
    sentences: {
      present: {
        ni: 'Ni hondartzara ___.',
        zu: 'Zu eskolara ___.',
        hura: 'Hura lanera ___.',
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
    pronounSentences: {
      present: {
        ni: '___ hondartzara noa.',
        zu: '___ eskolara zoaz.',
        hura: '___ lanera doa.',
      },
    },
  },
  // `etorri` present, same Unit 3 ("Moving Around") trim — `nator`/`zatoz`/
  // `dator`, per `docs/CONJUGATIONS.md` §6.
  {
    id: 'etorri',
    verb: 'etorri',
    meaning: { en: 'to come', es: 'venir', eu: 'etorri' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nator', zu: 'zatoz', hura: 'dator' },
    },
    sentences: {
      present: {
        ni: 'Ni etxera ___.',
        zu: 'Zu bihar ___.',
        hura: 'Hura orain ___.',
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
    pronounSentences: {
      present: {
        ni: '___ etxera nator.',
        zu: '___ bihar zatoz.',
        hura: '___ orain dator.',
      },
    },
  },
]

// Maps grammatical persons / tenses / verb types / agreement roles to the
// translation keys their UI labels live under (`src/i18n/translations.js`) —
// looked up via `t()` at render time so labels follow the interface language.
// `basque`/`basqueLabel`/the NOR/NORI/NORK `label`s themselves are Basque
// grammar terms, shown as-is regardless of interface language.
const PERSON_LABEL_KEYS = {
  ni: 'personNi',
  hi: 'personHi',
  zu: 'personZu',
  hura: 'personHura',
  gu: 'personGu',
  zuek: 'personZuek',
  haiek: 'personHaiek',
}

const TENSE_META = {
  present: { labelKey: 'tensePresent', basque: 'oraina' },
  past: { labelKey: 'tensePast', basque: 'lehena' },
}

const TYPE_META = {
  synthetic: { labelKey: 'typeSynthetic', basqueLabel: 'trinkoa', className: 'bg-indigo-100 text-indigo-700' },
  periphrastic: { labelKey: 'typePeriphrastic', basqueLabel: 'perifrastikoa', className: 'bg-rose-100 text-rose-700' },
}

const AGREEMENT_META = {
  nor: { label: 'NOR', titleKey: 'agreementNorTitle', className: 'bg-blue-100 text-blue-700' },
  nori: { label: 'NORI', titleKey: 'agreementNoriTitle', className: 'bg-purple-100 text-purple-700' },
  nork: { label: 'NORK', titleKey: 'agreementNorkTitle', className: 'bg-amber-100 text-amber-700' },
}

const DIALECT_LABELS = {
  batua: 'Batua',
}

// `LESSONS` is the flat, ordered list of currently-playable lessons —
// `getUnlockedLessonIds` unlocks them strictly in this order, one practice
// lesson at a time, `{ id, verbId, tense }`.
//
// Unlike the previous (verb × tense)-derived list, this is now hand-written
// to follow `docs/LEARNING_JOURNEY.md`'s unit sequence — units don't map
// cleanly onto "every tense of every verb" (e.g. a unit can introduce two
// verbs at once, or reuse an earlier verb's table under a different gloss),
// so `journey.js`'s `JOURNEY` is the source of truth for *order and grouping*
// and references these ids via each available unit's `lessonIds`. Currently
// just Unit 1 ("Who and Where"); append the next unit's lessons here as it's
// implemented, and flip its `status` to `'available'` in `journey.js`.
//
// Review lessons (not used yet, but supported by `describeLesson`/
// `createExerciseState`/`ProgressTab`) would carry `review: true` and
// `sources: [{ verbId, tense }, …]` instead of a single `verbId`/`tense` —
// `generateQuestions` is called once per source and the results interleaved,
// with every generated question keeping its own `verbId`/`tense` so the
// exercise screen can show each one in its correct context. The journey's
// Refresh Gate units (5, 6, 11, 17, ...) will use this shape once implemented.
const LESSONS = [
  { id: 'izan-present', verbId: 'izan', tense: 'present' },
  { id: 'egon-present', verbId: 'egon', tense: 'present' },
  { id: 'ukan-present', verbId: 'ukan', tense: 'present' },
  { id: 'nahi-present', verbId: 'nahi', tense: 'present' },
  { id: 'jakin-present', verbId: 'jakin', tense: 'present' },
  { id: 'joan-present', verbId: 'joan', tense: 'present' },
  { id: 'etorri-present', verbId: 'etorri', tense: 'present' },
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
function describeLesson(lesson, t, language) {
  if (!lesson.review) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    const meta = TENSE_META[lesson.tense]
    const label = t(meta.labelKey)
    return {
      icon: label[0],
      title: { main: label, secondary: meta.basque },
      subtitle: { main: verb.verb, secondary: verbMeaning(verb, language) },
      heading: `${verb.verb} · ${label}`,
    }
  }
  const verbNames = [...new Set(lesson.sources.map(({ verbId }) => VERBS.find((v) => v.id === verbId).verb))]
  const tenseLabels = [...new Set(lesson.sources.map(({ tense }) => t(TENSE_META[tense].labelKey)))]
  const reviewName = verbNames.length > 1 ? t('mixedReview') : t('verbReview', { verb: verbNames[0] })
  return {
    icon: '🔁',
    title: { main: t('reviewLabel'), secondary: tenseLabels.join(' + ') },
    subtitle: { main: verbNames.join(' & '), secondary: t('mixedPractice') },
    heading: `${reviewName} · ${tenseLabels.join(' + ')}`,
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

function LessonNode({ lesson, locked, stars, onSelect }) {
  const { t, language } = useLanguage()
  const { icon, title, subtitle } = describeLesson(lesson, t, language)
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
        <p className="mt-0.5 text-sm text-gray-500">{focus}</p>
        {payload && <p className="mt-1 text-sm text-gray-400 italic">{payload}</p>}
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
      <p className="mt-0.5 mb-2 text-sm text-gray-500">{focus}</p>
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
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress), [progress])

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
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">
                  {entry
                    ? `${t('progressBest', { best: entry.bestScore, total: entry.totalQuestions })} · ${tCount('attempt', entry.attempts)}`
                    : t('progressNotStarted')}
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
  const { t, language, setLanguage, languages } = useLanguage()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">🧑‍🎓</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('profileGreeting')}</h2>
        <p className="text-sm text-gray-500">{t('profileAchievements')}</p>
      </div>
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

function HomeScreen({ progress, tab, onChangeTab, onSelectLesson, onResetProgress }) {
  const { t } = useLanguage()
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const maxStars = LESSONS.length * 3

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Aditzak</h1>
          <p className="text-xs text-gray-500">{t('appTagline')}</p>
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
        {tab === 'home' && <JourneyTab progress={progress} onSelectLesson={onSelectLesson} />}
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

function createExerciseState(lesson, attempts) {
  const sources = lesson.sources ?? [{ verbId: lesson.verbId, tense: lesson.tense }]
  const noTyping = !lesson.review && attempts < NO_TYPING_ATTEMPTS
  const targetPerSource = TARGET_EXERCISE_COUNT / sources.length
  const questions = shuffle(
    sources.flatMap(({ verbId, tense }) => {
      const verb = VERBS.find((v) => v.id === verbId)
      const personCount = Object.keys(verb.conjugations[tense]).length
      const rounds = Math.max(1, Math.round(targetPerSource / personCount))
      return generateQuestions(verb, tense, { noTyping, rounds })
    }),
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
function QuestionPrompt({ verb, tenseMeta, question }) {
  const { t, language } = useLanguage()
  return (
    <>
      <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {verb.verb} — {verbMeaning(verb, language)} · {t(tenseMeta.labelKey)}
      </p>
      {question.sentence ? (
        <SentenceWithBlank sentence={question.sentence} />
      ) : question.items ? null : (
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
}

function FeedbackBar({ status, isLast, streakEncouragement, onContinue }) {
  const { t } = useLanguage()
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
        onClick={onContinue}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl text-lg font-extrabold tracking-wide text-white uppercase transition active:scale-[0.98] ${
          isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLast ? t('finish') : t('continue')}
      </button>
    </div>
  )
}

function LessonResultsScreen({ lesson, correctCount, total, onDone }) {
  const { t, language } = useLanguage()
  const stars = computeStars(correctCount, total)
  const { icon, headline, messageKey } = getEncouragement(correctCount, total)
  const { heading } = describeLesson(lesson, t, language)

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-5 bg-white px-8 text-center">
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
      <p className="text-base text-gray-600">{t(messageKey)}</p>
      <button
        type="button"
        onClick={onDone}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
      >
        {t('continue')}
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
  const { t } = useLanguage()
  const [state, dispatch] = useReducer(exerciseReducer, undefined, () => createExerciseState(lesson, attempts))
  const [finished, setFinished] = useState(false)
  const [streakEncouragement, setStreakEncouragement] = useState(null)
  // Only used by typed-answer questions (`question.options` absent) — reset
  // whenever a new question comes up so the field doesn't carry over what was
  // typed for the previous one.
  const [typedValue, setTypedValue] = useState('')
  // Shown once, before the first attempt at a (non-review) lesson — see
  // `LessonPreviewScreen`. Review lessons skip it: every form they cover has
  // already had its own practice-lesson intro.
  const [showPreview, setShowPreview] = useState(!lesson.review && attempts === 0)

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
          aria-label={t('exitLessonLabel')}
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

        <p className="mt-8 mb-3 text-base font-semibold text-gray-700">{t(QUESTION_PROMPT_KEYS[question.kind])}</p>
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
    if (typeof window !== 'undefined' && !window.confirm(t('profileResetConfirm'))) {
      return
    }
    setProgress({})
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

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
