import { describe, expect, it } from 'vitest'
import { JOURNEY, BONUS_LESSON_IDS } from './journey'
import { LESSONS } from './data/lessons'
import { VERBS } from './data/verbs'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import {
  generateFamilyChoiceQuestions,
  getComposedTable,
  mergeFrameSentences,
  resolveByObjectSentences,
  resolveObjectAxisTable,
} from './lessonLogic'

// Cross-checks the three files that make up "the learning journey"
// (`journey.js`'s `JOURNEY`, `data/lessons.js`'s `LESSONS`, `data/verbs.js`'s
// `VERBS`) against each other. These three are edited together but never
// type-checked against each other, so a renumbering/reorder can silently
// leave a dangling `lessonId`, an orphaned `LESSONS` entry, or a lesson
// pointing at a verb/tense/person that doesn't exist — exactly the kind of
// drift a big journey redesign risks introducing.

function allUnits() {
  return JOURNEY.flatMap((phase) => phase.stages.flatMap((stage) => stage.units))
}

describe('JOURNEY <-> LESSONS', () => {
  it('has unique lesson ids', () => {
    const ids = LESSONS.map((lesson) => lesson.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every available unit at least one lessonId, and no pending unit any', () => {
    for (const unit of allUnits()) {
      if (unit.status === 'available') {
        expect(unit.lessonIds?.length, `unit ${unit.number} ("${unit.title}") is available but has no lessonIds`).toBeGreaterThan(0)
      } else {
        expect(unit.lessonIds, `unit ${unit.number} ("${unit.title}") is ${unit.status} but has lessonIds`).toBeUndefined()
      }
    }
  })

  it('only references lessonIds that exist in LESSONS, and each exactly once', () => {
    const lessonIds = new Set(LESSONS.map((lesson) => lesson.id))
    const referenceCounts = new Map()
    for (const unit of allUnits()) {
      for (const id of unit.lessonIds ?? []) {
        expect(lessonIds.has(id), `unit ${unit.number} ("${unit.title}") references unknown lesson "${id}"`).toBe(true)
        referenceCounts.set(id, (referenceCounts.get(id) ?? 0) + 1)
      }
    }
    for (const id of lessonIds) {
      expect(referenceCounts.get(id) ?? 0, `lesson "${id}" should be referenced by exactly one unit's lessonIds`).toBe(1)
    }
  })
})

describe('JOURNEY <-> JOURNEY_TRANSLATIONS', () => {
  it('has a units translation entry for every unit number in JOURNEY', () => {
    for (const unit of allUnits()) {
      expect(JOURNEY_TRANSLATIONS.units[unit.number], `unit ${unit.number} ("${unit.title}") has no journeyTranslations entry`).toBeDefined()
    }
  })

  it('has a stages translation entry for every stage in JOURNEY', () => {
    for (const phase of JOURNEY) {
      for (const stage of phase.stages) {
        expect(JOURNEY_TRANSLATIONS.stages[stage.id], `stage "${stage.id}" ("${stage.title}") has no journeyTranslations entry`).toBeDefined()
      }
    }
  })
})

describe('LESSONS <-> VERBS', () => {
  const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))

  function expectTenseExists(verbId, tense, lessonId) {
    const verb = verbsById.get(verbId)
    expect(verb, `lesson "${lessonId}" references unknown verb "${verbId}"`).toBeDefined()
    expect(getComposedTable(verb, tense), `lesson "${lessonId}" references "${verbId}.conjugations.${tense}", which doesn't exist`).toBeDefined()
    return verb
  }

  it('points every single-verb practice lesson at a real verb + tense, and every person it restricts to', () => {
    for (const lesson of LESSONS) {
      if (!lesson.verbId) continue
      const verb = expectTenseExists(lesson.verbId, lesson.tense, lesson.id)
      // #350: `objectAxis` lessons read a 2D `{ [nork]: { [nor]: form } }`
      // table (see `resolveObjectAxisTable`'s doc comment in
      // `lessonLogic.js`) — `persons` restricts the *varying* axis, not the
      // table's top-level keys, so checking `person in verb.conjugations[tense]`
      // directly would spuriously pass (nork/nor share the same person
      // vocabulary) without actually confirming the resolved cell exists.
      const table = lesson.objectAxis
        ? resolveObjectAxisTable(getComposedTable(verb, lesson.tense), lesson.objectAxis)
        : getComposedTable(verb, lesson.tense)
      for (const person of lesson.persons ?? []) {
        expect(person in table, `lesson "${lesson.id}" restricts to person "${person}", missing from ${lesson.verbId}.conjugations.${lesson.tense}${lesson.objectAxis ? ` (resolved for objectAxis ${JSON.stringify(lesson.objectAxis)})` : ''}`).toBe(true)
      }
    }
  })

  it('points every source of a review or pooled-practice lesson at a real verb + tense, with every restricted person present', () => {
    for (const lesson of LESSONS) {
      if (!lesson.sources) continue
      for (const source of lesson.sources) {
        const verb = expectTenseExists(source.verbId, source.tense, lesson.id)
        for (const person of lesson.persons ?? []) {
          expect(
            person in getComposedTable(verb, source.tense),
            `lesson "${lesson.id}" restricts to person "${person}", missing from ${source.verbId}.conjugations.${source.tense}`,
          ).toBe(true)
        }
      }
    }
  })

  // M5: held-out verbs must never appear in any lesson's source or verbId pool.
  it('no held-out verb appears in any lesson source or verbId pool', () => {
    const heldOutIds = new Set(VERBS.filter((v) => v.heldOut).map((v) => v.id))
    if (heldOutIds.size === 0) return
    for (const lesson of LESSONS) {
      if (lesson.verbId) {
        expect(heldOutIds.has(lesson.verbId), `lesson "${lesson.id}" references held-out verb "${lesson.verbId}"`).toBe(false)
      }
      for (const source of lesson.sources ?? []) {
        expect(heldOutIds.has(source.verbId), `lesson "${lesson.id}" source references held-out verb "${source.verbId}"`).toBe(false)
      }
    }
  })

  // M2 spine-grounding invariant (docs/AUXILIARY_FIRST_PLAN.md §M2, D5).
  // Every spine practice lesson must offer ≥1 sentence-grounded kind per
  // drilled person — i.e. verb.sentences[tense][person] (or a frame-
  // generated entry from mergeFrameSentences) must exist, so the exercise
  // engine never has to degrade to bare kind:'form'.
  //
  // Exemptions (per D5 and known structural limitations):
  //   - Review lessons (lesson.review): not practice lessons.
  //   - Bonus units (BONUS_LESSON_IDS): hitanoa/bonus tracks are D5-exempt.
  //   - hi-m/hi-f persons: hitanoa gender split — by convention this codebase
  //     never keys sentences on these persons (see ukan.sentences.imperative).
  //
  // ByObject tenses are no longer exempt: a 2D object-axis lesson resolves
  // its sentences from `verb.byObjectSentences` via `resolveByObjectSentences`
  // (the structural fix maite's verbs.js comment used to defer to — the data
  // lives outside `verb.sentences`, so the flat-table validFor gap audit
  // never sees it), and Unit 16's spine lessons are held to the same
  // invariant as every flat tense.
  it('every spine practice lesson has a sentence for every drilled person (M2 grounding invariant)', () => {
    // Persons that are hitanoa gender-split keys, exempt by convention.
    const HITANOA_PERSONS = new Set(['hi-m', 'hi-f'])

    for (const lesson of LESSONS) {
      if (lesson.review) continue
      if (BONUS_LESSON_IDS.has(lesson.id)) continue
      if (!lesson.verbId) continue

      const verb = verbsById.get(lesson.verbId)
      if (!verb) continue

      const table = getComposedTable(verb, lesson.tense)
      if (!table || Object.keys(table).length === 0) continue

      const drilled = lesson.persons ?? Object.keys(table)
      const senByPerson = lesson.objectAxis
        ? resolveByObjectSentences(verb, lesson.tense, lesson.objectAxis)
        : mergeFrameSentences(verb, lesson.tense, verb.sentences?.[lesson.tense] ?? {})

      for (const person of drilled) {
        if (HITANOA_PERSONS.has(person)) continue
        expect(
          senByPerson[person],
          `${lesson.id}: ${lesson.verbId}.sentences.${lesson.tense}.${person} missing — spine lesson would degrade to bare kind:'form'`,
        ).toBeDefined()
      }
    }
  })

  // A `familyChoice: true` flag must never be decorative: the generator only
  // yields questions when a lesson's sources carry `familyChoiceSafe`-tagged
  // sentences whose verb has a resolvable cross-family lure, and a flag whose
  // sources have none would silently produce zero questions — the lesson
  // would claim a drill it never runs. `count: 50` swamps the generator's
  // per-lesson cap so the assertion is about candidate existence, not
  // sampling.
  it('every familyChoice lesson yields at least one family-choice question', () => {
    for (const lesson of LESSONS) {
      if (!lesson.familyChoice) continue
      const resolvedSources = (lesson.sources ?? [{ verbId: lesson.verbId, tense: lesson.tense }]).map(
        ({ verbId, tense }) => ({ verb: verbsById.get(verbId), tense }),
      )
      const questions = generateFamilyChoiceQuestions(VERBS, resolvedSources, { count: 50 })
      expect(questions.length, `lesson "${lesson.id}" has familyChoice: true but generates no questions`).toBeGreaterThan(0)
    }
  })

})
