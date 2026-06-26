// Helper module to query when forms (verb + tense + person combinations) are introduced
// Useful for curriculum validation and planning

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))
let _cache = null

function buildCache() {
  if (_cache) return _cache

  const formIntroduced = new Map() // "verbId-tense-person" -> { lessonIdx, lessonId }

  function getPersonsForSource(source) {
    const verb = verbsById.get(source.verbId)
    if (!verb) return []
    const table = getComposedTable(verb, source.tense)
    return table ? Object.keys(table) : []
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

  _cache = formIntroduced
  return _cache
}

/**
 * Query when a specific form is first introduced.
 * @param {string} verbId - The verb identifier
 * @param {string} tense - The tense (e.g., 'present', 'past', 'future')
 * @param {string} person - The grammatical person (e.g., 'ni', 'zu', 'hura', 'gu', 'zuek', 'haiek')
 * @returns {{ lessonIdx: number, lessonId: string } | null} Introduction info, or null if not found
 */
export function getFormIntroduction(verbId, tense, person) {
  const cache = buildCache()
  const formKey = `${verbId}-${tense}-${person}`
  return cache.get(formKey) || null
}

/**
 * Get all forms for a verb+tense combination and when they're introduced.
 * @param {string} verbId - The verb identifier
 * @param {string} tense - The tense
 * @returns {Array<{ person: string, lessonIdx: number, lessonId: string }>} Sorted by person order
 */
export function getFormIntroductionsForTense(verbId, tense) {
  const cache = buildCache()
  const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']

  const results = []
  for (const [formKey, intro] of cache) {
    const [vid, t, person] = formKey.split('-')
    if (vid === verbId && t === tense) {
      results.push({ person, ...intro })
    }
  }

  return results.sort((a, b) => personOrder.indexOf(a.person) - personOrder.indexOf(b.person))
}

/**
 * Get all forms for a verb across all tenses and when they're introduced.
 * @param {string} verbId - The verb identifier
 * @returns {Map<string, Array<{ person, lessonIdx, lessonId }>>} Grouped by tense
 */
export function getFormIntroductionsForVerb(verbId) {
  const cache = buildCache()
  const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']

  const byTense = new Map()
  for (const [formKey, intro] of cache) {
    const [vid, tense, person] = formKey.split('-')
    if (vid === verbId) {
      if (!byTense.has(tense)) {
        byTense.set(tense, [])
      }
      byTense.get(tense).push({ person, ...intro })
    }
  }

  // Sort persons within each tense
  for (const forms of byTense.values()) {
    forms.sort((a, b) => personOrder.indexOf(a.person) - personOrder.indexOf(b.person))
  }

  return byTense
}

/**
 * Check if a form has been introduced by a given lesson index.
 * @param {string} verbId
 * @param {string} tense
 * @param {string} person
 * @param {number} upToLessonIdx - Lesson index to check against
 * @returns {boolean}
 */
export function isFormIntroducedBy(verbId, tense, person, upToLessonIdx) {
  const intro = getFormIntroduction(verbId, tense, person)
  return intro !== null && intro.lessonIdx <= upToLessonIdx
}

/**
 * Get summary statistics about form introductions.
 * @returns {{ totalForms: number, uniqueVerbs: number, uniqueTenses: Set<string> }}
 */
export function getFormStatistics() {
  const cache = buildCache()
  const verbs = new Set()
  const tenses = new Set()

  for (const formKey of cache.keys()) {
    const [verbId, tense] = formKey.split('-')
    verbs.add(verbId)
    tenses.add(tense)
  }

  return {
    totalForms: cache.size,
    uniqueVerbs: verbs.size,
    uniqueTenses: tenses,
  }
}
