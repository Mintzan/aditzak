// Find conjugations used in lessons that are NOT defined in VERBS

import fs from 'fs'
import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))

// Extract all defined conjugations from VERBS
const definedConjugations = new Set()
for (const verb of VERBS) {
  for (const tense of Object.keys(verb.conjugations || {})) {
    const table = getComposedTable(verb, tense)
    if (!table) continue

    for (const value of Object.values(table)) {
      if (typeof value === 'string') {
        definedConjugations.add(value)
      } else if (typeof value === 'object' && value !== null) {
        for (const subValue of Object.values(value)) {
          if (typeof subValue === 'string') {
            definedConjugations.add(subValue)
          }
        }
      }
    }
  }
}

// Extract all conjugations used in lessons
const usedConjugations = new Set()
for (const lesson of LESSONS) {
  const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []

  for (const source of sources) {
    const verb = verbsById.get(source.verbId)
    if (!verb) {
      console.error(`Unknown verb: ${source.verbId}`)
      continue
    }

    const table = getComposedTable(verb, source.tense)
    if (!table) {
      console.error(`Missing table: ${source.verbId}/${source.tense}`)
      continue
    }

    const allPersons = Object.keys(table)
    const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons

    for (const person of personsToCheck) {
      const value = table[person]
      if (typeof value === 'string') {
        usedConjugations.add(value)
      } else if (typeof value === 'object' && value !== null) {
        for (const subValue of Object.values(value)) {
          if (typeof subValue === 'string') {
            usedConjugations.add(subValue)
          }
        }
      }
    }
  }
}

// Find missing conjugations
const missing = [...usedConjugations].filter(conj => !definedConjugations.has(conj))

console.log(`=== CONJUGATION ANALYSIS ===\n`)
console.log(`Defined in VERBS: ${definedConjugations.size}`)
console.log(`Used in lessons: ${usedConjugations.size}`)
console.log(`Missing from definitions: ${missing.length}\n`)

if (missing.length > 0) {
  console.log(`❌ MISSING CONJUGATIONS (used in lessons but NOT in VERBS):\n`)
  missing.sort().forEach(conj => console.log(`  "${conj}"`))
  
  fs.writeFileSync('missing-conjugations.txt', missing.sort().join('\n'))
  console.log(`\n✅ Saved to missing-conjugations.txt`)
} else {
  console.log(`✅ All conjugations used in lessons are defined in VERBS`)
}
