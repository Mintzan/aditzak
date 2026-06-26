// Analyze gaps in synthetic verb conjugation coverage

import { VERBS } from './data/verbs.js'

const syntheticVerbs = VERBS.filter(v => v.type === 'synthetic')

// Collect all tenses that exist across all synthetic verbs
const allTensesSeen = new Set()
const verbTenses = new Map()

for (const verb of syntheticVerbs) {
  const tenses = Object.keys(verb.conjugations || {})
  verbTenses.set(verb.id, new Set(tenses))
  tenses.forEach(t => allTensesSeen.add(t))
}

console.log('═══════════════════════════════════════════════════════════════════════════════')
console.log('CONJUGATION GAPS ANALYSIS')
console.log('═══════════════════════════════════════════════════════════════════════════════\n')

// Print all tenses seen
console.log('All tenses appearing in synthetic verbs:')
console.log([...allTensesSeen].sort().map(t => `  - ${t}`).join('\n'))
console.log()

// For each verb, show which tenses it has and which it's missing
console.log('TENSE COVERAGE BY VERB:')
console.log('─'.repeat(77) + '\n')

const verbsArray = [...verbTenses.entries()].sort((a, b) => a[0].localeCompare(b[0]))

for (const [verbId, tenses] of verbsArray) {
  const allTensesList = [...allTensesSeen].sort()
  const hasTenses = allTensesList.filter(t => tenses.has(t))
  const missingTenses = allTensesList.filter(t => !tenses.has(t))

  console.log(`${verbId.toUpperCase()}`)
  console.log(`  Has: ${hasTenses.join(', ')}`)

  if (missingTenses.length > 0) {
    console.log(`  MISSING: ${missingTenses.join(', ')}`)
  }
  console.log()
}

// Find systematic gaps - tenses that appear in most verbs but missing in some
console.log('\nSYSTEMATIC GAPS (tenses missing in certain verbs):')
console.log('─'.repeat(77) + '\n')

const tensesByFrequency = [...allTensesSeen].sort((a, b) => {
  const aCount = verbsArray.filter(([_, tenses]) => tenses.has(a)).length
  const bCount = verbsArray.filter(([_, tenses]) => tenses.has(b)).length
  return bCount - aCount
})

for (const tense of tensesByFrequency) {
  const verbsWithTense = verbsArray.filter(([_, tenses]) => tenses.has(tense))
  const verbsMissing = verbsArray.filter(([_, tenses]) => !tenses.has(tense))

  if (verbsMissing.length > 0 && verbsMissing.length < syntheticVerbs.length) {
    console.log(`${tense.padEnd(20)} (${verbsWithTense.length}/${syntheticVerbs.length} verbs)`)
    if (verbsMissing.length > 0 && verbsMissing.length <= 6) {
      console.log(`  Missing in: ${verbsMissing.map(([id]) => id).join(', ')}`)
    }
    console.log()
  }
}

// Theoretical gaps - forms that should exist based on verb structure
console.log('\nTHEORETICAL FORM ANALYSIS:')
console.log('─'.repeat(77) + '\n')

const personForms = ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek']

for (const [verbId, tenses] of verbsArray) {
  const verb = syntheticVerbs.find(v => v.id === verbId)
  if (!verb || !verb.conjugations) continue

  const missingPersonsPerTense = new Map()

  for (const tense of tenses) {
    const conjugations = verb.conjugations[tense]
    if (typeof conjugations[Object.keys(conjugations)[0]] !== 'string') {
      continue // Skip 2D tables
    }

    const presentInTense = Object.keys(conjugations)
    const missingPersons = personForms.filter(p => !presentInTense.includes(p))

    if (missingPersons.length > 0) {
      missingPersonsPerTense.set(tense, missingPersons)
    }
  }

  if (missingPersonsPerTense.size > 0) {
    console.log(`${verbId}:`)
    for (const [tense, missing] of missingPersonsPerTense) {
      console.log(`  ${tense}: missing persons: ${missing.join(', ')}`)
    }
    console.log()
  }
}
