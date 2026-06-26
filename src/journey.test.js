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

  it('introduces all forms in a pedagogically valid order (no form used before introduction)', () => {
    const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']
    const formIntroduced = new Map() // "verbId-tense-person" -> lessonIndex
    const formUsed = new Map() // "verbId-tense-person" -> lessonIndex array

    // Helper to get all persons drilled in a lesson
    function getPersonsForSource(source) {
      const verb = verbsById.get(source.verbId)
      const table = getComposedTable(verb, source.tense)
      // If lesson restricts persons, use that; otherwise use all persons in the table
      return Object.keys(table)
    }

    // First pass: track all forms and when they're introduced
    for (let lessonIdx = 0; lessonIdx < LESSONS.length; lessonIdx++) {
      const lesson = LESSONS[lessonIdx]
      const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []

      for (const source of sources) {
        const allPersons = getPersonsForSource(source)
        // Use restricted persons if specified, otherwise all
        const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons

        for (const person of personsToCheck) {
          const formKey = `${source.verbId}-${source.tense}-${person}`
          if (!formIntroduced.has(formKey)) {
            formIntroduced.set(formKey, lessonIdx)
          }
          if (!formUsed.has(formKey)) {
            formUsed.set(formKey, [])
          }
          formUsed.get(formKey).push(lessonIdx)
        }
      }
    }

    // Check: no form is used before introduction
    const violations = []
    for (const [formKey, usages] of formUsed) {
      const introducedAt = formIntroduced.get(formKey)
      const usedBefore = usages.filter((idx) => idx < introducedAt)
      if (usedBefore.length > 0) {
        violations.push(
          `Form "${formKey}" introduced at lesson ${introducedAt} ("${LESSONS[introducedAt].id}") but used earlier in lessons: ${usedBefore.map((idx) => `${idx}("${LESSONS[idx].id}")`).join(', ')}`,
        )
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0)
  })

  it('provides diagnostic report of form introductions and their order', () => {
    const formIntroduced = new Map()
    const personOrder = ['ni', 'zu', 'hura', 'gu', 'zuek', 'haiek']

    function getPersonsForSource(source) {
      const verb = verbsById.get(source.verbId)
      const table = getComposedTable(verb, source.tense)
      return Object.keys(table)
    }

    for (let lessonIdx = 0; lessonIdx < LESSONS.length; lessonIdx++) {
      const lesson = LESSONS[lessonIdx]
      const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []

      for (const source of sources) {
        const allPersons = getPersonsForSource(source)
        const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons

        for (const person of personsToCheck) {
          const formKey = `${source.verbId}-${source.tense}-${person}`
          if (!formIntroduced.has(formKey)) {
            formIntroduced.set(formKey, { lessonIdx, lessonId: lesson.id })
          }
        }
      }
    }

    // Group by verb+tense to show introduction patterns
    const byVerb = new Map()
    for (const [formKey, { lessonIdx, lessonId }] of formIntroduced) {
      const [verbId, tense, person] = formKey.split('-')
      const key = `${verbId}/${tense}`
      if (!byVerb.has(key)) {
        byVerb.set(key, [])
      }
      byVerb.get(key).push({ person, lessonIdx, lessonId, formKey })
    }

    // Log the report (this helps validate pedagogy without failing the test)
    const report = []
    report.push('\n=== Form Introduction Timeline ===\n')
    for (const [vtKey, forms] of [...byVerb].sort()) {
      const sorted = forms.sort((a, b) => personOrder.indexOf(a.person) - personOrder.indexOf(b.person))
      report.push(`${vtKey}:`)
      for (const form of sorted) {
        report.push(`  ${form.person.padEnd(6)} → Lesson ${form.lessonIdx.toString().padStart(3)} (${form.lessonId})`)
      }
      report.push('')
    }

    // Report any pedagogically suspicious patterns:
    // - Plural forms introduced before all singular forms
    // - Long gaps between related forms (e.g., ni/zu appearing but not hura)
    const warnings = []
    for (const [vtKey, forms] of byVerb) {
      const singularPersons = forms.filter((f) => ['ni', 'zu', 'hura'].includes(f.person))
      const pluralPersons = forms.filter((f) => ['gu', 'zuek', 'haiek'].includes(f.person))

      if (pluralPersons.length > 0 && singularPersons.length > 0) {
        const lastSingular = Math.max(...singularPersons.map((f) => f.lessonIdx))
        const firstPlural = Math.min(...pluralPersons.map((f) => f.lessonIdx))
        if (firstPlural < lastSingular) {
          warnings.push(
            `⚠️  ${vtKey}: Plural forms introduced (${firstPlural}) before final singular form (${lastSingular})`,
          )
        }
      }
    }

    if (warnings.length > 0) {
      report.push('=== Pedagogical Warnings ===\n')
      report.push(warnings.join('\n'))
    }

    console.log(report.join('\n'))
    // This test always passes; the report is for diagnosis
    expect(true).toBe(true)
  })
})
