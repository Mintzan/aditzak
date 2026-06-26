// Track when actual conjugated forms (Basque words) are introduced
// e.g., "naiz", "dut", "gara" - not just verb+tense+person combinations

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable, resolveObjectAxisTable } from './lessonLogic.js'

const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))
let _cache = null

function buildCache() {
  if (_cache) return _cache

  const conjugationIntroduced = new Map() // actual form string -> { lessonIdx, lessonId, verbId, tense, person }

  function extractFormsFromTable(table, verbId, tense, lesson) {
    const forms = []
    if (!table || typeof table !== 'object') return forms

    for (const [person, value] of Object.entries(table)) {
      if (typeof value === 'string') {
        forms.push({ form: value, verbId, tense, person })
      } else if (typeof value === 'object' && value !== null) {
        // Handle 2D tables (e.g., objectAxis)
        for (const subValue of Object.values(value)) {
          if (typeof subValue === 'string') {
            forms.push({ form: subValue, verbId, tense, person })
          }
        }
      }
    }
    return forms
  }

  // Walk through lessons in order
  for (let lessonIdx = 0; lessonIdx < LESSONS.length; lessonIdx++) {
    const lesson = LESSONS[lessonIdx]
    const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []

    for (const source of sources) {
      const verb = verbsById.get(source.verbId)
      if (!verb) continue

      const table = getComposedTable(verb, source.tense)
      if (!table) continue

      // Handle object-axis tables
      let resolvedTable = table
      if (lesson.objectAxis) {
        resolvedTable = resolveObjectAxisTable(table, lesson.objectAxis)
      }

      // Extract forms, respecting person restrictions
      const allPersons = Object.keys(resolvedTable)
      const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons

      for (const person of personsToCheck) {
        const value = resolvedTable[person]
        if (typeof value === 'string') {
          const form = value
          if (!conjugationIntroduced.has(form)) {
            conjugationIntroduced.set(form, {
              lessonIdx,
              lessonId: lesson.id,
              verbId: source.verbId,
              tense: source.tense,
              person,
              firstSource: { verbId: source.verbId, tense: source.tense, person },
            })
          }
        } else if (typeof value === 'object' && value !== null) {
          // 2D table cell
          for (const [subPerson, subForm] of Object.entries(value)) {
            if (typeof subForm === 'string') {
              if (!conjugationIntroduced.has(subForm)) {
                conjugationIntroduced.set(subForm, {
                  lessonIdx,
                  lessonId: lesson.id,
                  verbId: source.verbId,
                  tense: source.tense,
                  person: `${person}→${subPerson}`,
                  firstSource: { verbId: source.verbId, tense: source.tense, person },
                })
              }
            }
          }
        }
      }
    }
  }

  _cache = conjugationIntroduced
  return _cache
}

/**
 * Get when a specific conjugated form (Basque word) is first introduced.
 * @param {string} form - The Basque conjugated form (e.g., "naiz", "dut", "gara")
 * @returns {{ lessonIdx: number, lessonId: string, verbId: string, tense: string, person: string } | null}
 */
export function getConjugationIntroduction(form) {
  const cache = buildCache()
  return cache.get(form) || null
}

/**
 * Get all conjugations that appear in a lesson.
 * @param {string} lessonId - Lesson ID
 * @returns {Array<string>} List of conjugated forms
 */
export function getConjugationsForLesson(lessonId) {
  const cache = buildCache()
  const forms = []
  for (const [form, intro] of cache) {
    if (intro.lessonId === lessonId) {
      forms.push(form)
    }
  }
  return forms.sort()
}

/**
 * Get all conjugations for a specific verb+tense combination.
 * @param {string} verbId
 * @param {string} tense
 * @returns {Array<{ form: string, person: string, lessonIdx: number, lessonId: string }>}
 */
export function getConjugationsForVerb(verbId, tense) {
  const cache = buildCache()
  const results = []
  for (const [form, intro] of cache) {
    if (intro.verbId === verbId && intro.tense === tense) {
      results.push({ form, person: intro.person, lessonIdx: intro.lessonIdx, lessonId: intro.lessonId })
    }
  }
  return results.sort((a, b) => a.lessonIdx - b.lessonIdx)
}

/**
 * Check if a conjugated form has been introduced by a given lesson.
 * @param {string} form - Conjugated Basque form
 * @param {number} upToLessonIdx - Lesson index to check
 * @returns {boolean}
 */
export function isConjugationIntroducedBy(form, upToLessonIdx) {
  const intro = getConjugationIntroduction(form)
  return intro !== null && intro.lessonIdx <= upToLessonIdx
}

/**
 * Get coverage statistics for actual conjugations.
 * @returns {{ totalConjugations: number, uniqueVerbs: number, uniqueTenses: Set<string> }}
 */
export function getConjugationStatistics() {
  const cache = buildCache()
  const verbs = new Set()
  const tenses = new Set()

  for (const intro of cache.values()) {
    verbs.add(intro.verbId)
    tenses.add(intro.tense)
  }

  return {
    totalConjugations: cache.size,
    uniqueVerbs: verbs.size,
    uniqueTenses: tenses,
  }
}

/**
 * Find conjugations that appear in multiple verbs/tenses (shared forms).
 * @returns {Map<string, Array<{verbId, tense, person}>>} Forms with multiple sources
 */
export function getSharedConjugations() {
  const cache = buildCache()
  const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))

  const shared = new Map()

  for (const [form, intro] of cache) {
    // Look for other sources of this same form
    const otherSources = []
    for (const verb of VERBS) {
      for (const [tense, conjugations] of Object.entries(verb.conjugations || {})) {
        if (verb.id === intro.verbId && tense === intro.tense) continue
        const table = getComposedTable(verb, tense)
        if (!table) continue
        for (const [person, value] of Object.entries(table)) {
          if (value === form) {
            otherSources.push({ verbId: verb.id, tense, person })
          }
        }
      }
    }

    if (otherSources.length > 0) {
      if (!shared.has(form)) {
        shared.set(form, [])
      }
      shared.get(form).push({ verbId: intro.verbId, tense: intro.tense, person: intro.person })
      shared.get(form).push(...otherSources)
    }
  }

  return shared
}

/**
 * Get all conjugated forms with their introduction points.
 * @returns {Array<{form, lessonIdx, lessonId, verbId, tense, person}>}
 */
export function getAllConjugations() {
  const cache = buildCache()
  const results = []
  for (const [form, intro] of cache) {
    results.push({ form, ...intro })
  }
  return results.sort((a, b) => a.lessonIdx - b.lessonIdx)
}
