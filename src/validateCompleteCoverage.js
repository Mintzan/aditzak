// Script to validate that ALL possible forms are covered in the curriculum
// Run with: node src/validateCompleteCoverage.js

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))
const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']

// Step 1: Collect all POSSIBLE forms from VERBS
const allPossibleForms = new Map() // "verbId-tense-person" -> true

console.log('=== COMPLETE FORM COVERAGE ANALYSIS ===\n')

for (const verb of VERBS) {
  for (const tense of Object.keys(verb.conjugations || {})) {
    const table = getComposedTable(verb, tense)
    if (!table) continue

    for (const person of Object.keys(table)) {
      const formKey = `${verb.id}-${tense}-${person}`
      allPossibleForms.set(formKey, { verb: verb.id, tense, person })
    }
  }
}

console.log(`Found ${allPossibleForms.size} total possible forms across all verbs and tenses\n`)

// Step 2: Collect all TAUGHT forms from LESSONS
const taughtForms = new Set() // "verbId-tense-person"

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
      taughtForms.add(formKey)
    }
  }
}

console.log(`Forms covered in lessons: ${taughtForms.size} / ${allPossibleForms.size}\n`)

// Step 3: Find uncovered forms
const uncoveredForms = []
for (const [formKey, info] of allPossibleForms) {
  if (!taughtForms.has(formKey)) {
    uncoveredForms.push(info)
  }
}

if (uncoveredForms.length === 0) {
  console.log('✅ COMPLETE COVERAGE: All possible forms are taught somewhere in the curriculum\n')
} else {
  console.log(`❌ GAPS: ${uncoveredForms.length} forms are NOT covered in any lesson:\n`)

  // Group by verb/tense for readability
  const byVerb = new Map()
  for (const form of uncoveredForms) {
    const key = `${form.verb}/${form.tense}`
    if (!byVerb.has(key)) {
      byVerb.set(key, [])
    }
    byVerb.get(key).push(form.person)
  }

  // Display gaps
  const sorted = [...byVerb.entries()].sort()
  for (const [vtKey, persons] of sorted) {
    const sortedPersons = persons.sort((a, b) => personOrder.indexOf(a) - personOrder.indexOf(b))
    console.log(`${vtKey}:`)
    console.log(`  Missing persons: ${sortedPersons.join(', ')}`)
  }
  console.log()
}

// Step 4: Create a full inventory list
console.log('=== COMPLETE FORM INVENTORY ===\n')
console.log('All forms organized by verb and tense:\n')

const byVerb = new Map()
for (const [formKey, info] of allPossibleForms) {
  const key = info.verb
  if (!byVerb.has(key)) {
    byVerb.set(key, new Map())
  }
  const byTense = byVerb.get(key)
  if (!byTense.has(info.tense)) {
    byTense.set(info.tense, [])
  }
  byTense.get(info.tense).push(info.person)
}

for (const [verbId, byTense] of [...byVerb.entries()].sort()) {
  console.log(`${verbId}:`)
  for (const [tense, persons] of [...byTense.entries()].sort()) {
    const sorted = persons.sort((a, b) => personOrder.indexOf(a) - personOrder.indexOf(b))
    const coverage = sorted.map((p) => {
      const formKey = `${verbId}-${tense}-${p}`
      const isTaught = taughtForms.has(formKey)
      return isTaught ? p : `[${p}]` // Bracket uncovered persons
    })
    console.log(`  ${tense}: ${coverage.join(', ')}`)
  }
  console.log()
}

console.log('Note: Forms in brackets [like-this] are NOT covered in any lesson\n')

// Step 5: Summary statistics
console.log('=== SUMMARY ===\n')
const coveragePercent = ((taughtForms.size / allPossibleForms.size) * 100).toFixed(1)
console.log(`Coverage: ${taughtForms.size} / ${allPossibleForms.size} forms (${coveragePercent}%)`)
console.log(`Gaps: ${uncoveredForms.length} forms`)
console.log(`Total lessons: ${LESSONS.length}`)
console.log(`Total verbs: ${byVerb.size}`)

// Group gaps by reason (mostly likely: pending units, optional forms)
if (uncoveredForms.length > 0) {
  console.log('\nCommon patterns in gaps:')

  // Check if gaps are mostly from high-index verbs (less mature curriculum)
  const verbsWithGaps = new Set(uncoveredForms.map((f) => f.verb))
  const gapSummary = new Map()
  for (const verb of verbsWithGaps) {
    const verbGaps = uncoveredForms.filter((f) => f.verb === verb)
    gapSummary.set(verb, verbGaps.length)
  }

  const sortedGaps = [...gapSummary.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  console.log('\nVerbs with most uncovered forms:')
  for (const [verb, count] of sortedGaps) {
    const total = [...allPossibleForms.keys()].filter((k) => k.startsWith(verb + '-')).length
    console.log(`  ${verb}: ${count} / ${total} uncovered`)
  }
}

console.log()
