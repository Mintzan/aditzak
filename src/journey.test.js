import { describe, expect, it } from 'vitest'
import { JOURNEY } from './journey'
import { LESSONS } from './data/lessons'
import { VERBS } from './data/verbs'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import { getComposedTable, resolveObjectAxisTable } from './lessonLogic'

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
})
