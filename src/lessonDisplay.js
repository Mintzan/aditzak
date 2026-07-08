import { getFixedArgument, getComposedTable, CONSTRUCTION_VERB_IDS } from './lessonLogic'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import { VERBS, TENSE_META, AGREEMENT_META } from './data/verbs'

function isConstruction(lesson) {
  const { verbId, tense } = lesson
  if (!verbId) return false
  return (
    CONSTRUCTION_VERB_IDS.has(verbId) ||
    verbId.endsWith('arazi') ||
    (tense != null && (tense.includes('Toka') || tense.includes('Noka')))
  )
}

// "NOR-NORK", "NOR-NORI", etc. from verb.agreement array.
function agreementFamilyLabel(agreement) {
  return (agreement ?? ['nor']).map((a) => AGREEMENT_META[a].label).join('-')
}

// The most representative form for a lesson — the hura (3sg) cell of the
// resolved table, or the appropriate 2D cell for object-axis lessons.
function lessonExemplar(verb, lesson) {
  const table = getComposedTable(verb, lesson.tense)
  if (!table) return null
  if (lesson.objectAxis) {
    const { vary, fixed } = lesson.objectAxis
    if (vary === 'nor') {
      // 2D table outer=NOR, inner=NORK; fixed role is NORK
      const cell = table.hura?.[fixed]
      return typeof cell === 'string' ? cell : null
    }
    // 2D table outer=NORI/NOR; fixed outer, NOR=hura inner
    const row = table[fixed]
    if (!row) return null
    return typeof row.hura === 'string' ? row.hura : (Object.values(row).find((v) => typeof v === 'string') ?? null)
  }
  return typeof table.hura === 'string' ? table.hura : null
}

// Looks up a verb's English/Spanish/Basque gloss, falling back to English if
// the active interface language has no translation for this verb.
export function verbMeaning(verb, language) {
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
export function personsLabel(persons) {
  return persons?.join('/')
}

export function describeLesson(lesson, t, language) {
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
    // #346: a lesson drilling a verb's 2D object-axis table pins a
    // different argument than `getFixedArgument(verb)` would derive from
    // the verb's own (`recipient`/`agent`) metadata — see
    // `generateQuestions`'s `objectAxis` doc comment in `lessonLogic.js`.
    const fixedArgument = lesson.objectAxis
      ? { role: lesson.objectAxis.vary === 'nor' ? 'nork' : 'nor', person: lesson.objectAxis.fixed }
      : getFixedArgument(verb)
    // M1 PR1 Layer D: synthetic verbs (verb IS the paradigm) and construction
    // lessons (nahi/behar/ari/ahal/causative/hitanoa) keep verb/construction-first.
    if (verb.type === 'synthetic' || isConstruction(lesson)) {
      return {
        icon: label[0],
        title: { main: label, secondary: persons ? `${meta.basque} · ${persons}` : meta.basque },
        subtitle: { main: verb.verb, secondary: verbMeaning(verb, language) },
        heading: persons ? `${verb.verb} · ${label} (${persons})` : `${verb.verb} · ${label}`,
        recognitionOnly,
        fixedArgument,
      }
    }
    // Regular periphrastic: paradigm-first — family leads, carrier verb demotes to subtitle.
    const family = agreementFamilyLabel(verb.agreement)
    const exemplar = lessonExemplar(verb, lesson)
    const familyTense = `${family} · ${label}`
    const secondaryParts = [persons, exemplar].filter(Boolean)
    return {
      icon: label[0],
      title: {
        main: familyTense,
        secondary: secondaryParts.length ? secondaryParts.join(' · ') : meta.basque,
      },
      subtitle: { main: verb.verb, secondary: verbMeaning(verb, language) },
      heading: persons ? `${familyTense} · ${persons} (${verb.verb})` : `${familyTense} (${verb.verb})`,
      recognitionOnly,
      fixedArgument,
    }
  }
  const verbNames = [...new Set(lesson.sources.map(({ verbId }) => VERBS.find((v) => v.id === verbId).verb))]
  const tenseLabels = [...new Set(lesson.sources.map(({ tense }) => t(TENSE_META[tense].labelKey)))]
  const tenseLabel = tenseLabels.join(' + ')
  // A pool spanning more than a handful of verbs collapses to a generic
  // label (`t('verbCount')`) instead of joining every verb name — a pool of
  // dozens of verbs (e.g. `ukan-past-pool`'s 46) otherwise produces an
  // unreadable string everywhere this is shown: the results screen, the
  // lesson card/progress tab (clipped by CSS `truncate`, but still present
  // in full in the DOM/accessibility tree and in share-result text, which
  // has no such clipping at all). Small pools (a handful of verbs or fewer)
  // still join the names, since that's still readable and more informative.
  const verbsLabel = verbNames.length > 3 ? t('verbCount', { count: verbNames.length }) : verbNames.join(' & ')
  if (!lesson.review) {
    const meta = TENSE_META[lesson.sources[0].tense]
    const poolVerb = VERBS.find((v) => v.id === lesson.sources[0].verbId)
    const poolFamily = poolVerb ? agreementFamilyLabel(poolVerb.agreement) : null
    const familyTense = poolFamily ? `${poolFamily} · ${tenseLabel}` : tenseLabel
    return {
      icon: tenseLabel[0],
      title: { main: familyTense, secondary: persons ? `${meta.basque} · ${persons}` : meta.basque },
      subtitle: { main: verbsLabel, secondary: t('mixedPractice') },
      heading: persons ? `${verbsLabel} · ${familyTense} (${persons})` : `${verbsLabel} · ${familyTense}`,
      recognitionOnly,
    }
  }
  const reviewName = verbNames.length > 1 ? t('mixedReview') : t('verbReview', { verb: verbNames[0] })
  return {
    // No `icon` here — `LessonNode` renders `RepeatIcon` for review lessons
    // directly off `lesson.review` instead of a display value from this
    // function, since a review's icon is fixed (not derived from lesson
    // content the way the letter/emoji icons above are).
    title: { main: t('reviewLabel'), secondary: persons ? `${tenseLabel} · ${persons}` : tenseLabel },
    subtitle: { main: verbsLabel, secondary: t('mixedPractice') },
    heading: persons ? `${reviewName} · ${tenseLabel} (${persons})` : `${reviewName} · ${tenseLabel}`,
    recognitionOnly,
  }
}

// Looks up a translated phase/stage/unit field from `JOURNEY_TRANSLATIONS`
// (`src/i18n/journeyTranslations.js`), falling back to `journey.js`'s English
// original (`fallback`) for English or any not-yet-translated entry.
export function journeyText(scope, id, field, language, fallback) {
  return JOURNEY_TRANSLATIONS[scope]?.[id]?.[field]?.[language] ?? fallback
}
