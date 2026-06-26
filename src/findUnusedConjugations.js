// Find conjugations defined in VERBS that are NOT used in any lesson

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

// Track which verb/tense combinations are used
const usedCombinations = new Set()
const usedByVerb = new Map() // verb -> Set of tenses

for (const lesson of LESSONS) {
  const sources = lesson.verbId
    ? [{ verbId: lesson.verbId, tense: lesson.tense }]
    : (lesson.sources || [])

  for (const source of sources) {
    usedCombinations.add(`${source.verbId}/${source.tense}`)
    if (!usedByVerb.has(source.verbId)) {
      usedByVerb.set(source.verbId, new Set())
    }
    usedByVerb.get(source.verbId).add(source.tense)
  }
}

// Find all defined verb/tense combinations
// We need to check not just direct conjugations but also synthetic ones
const allCombinations = new Map() // verb/tense -> { tense, formCount }
const unusedCombinations = new Map() // verb -> [{ tense, formCount, key }]

// Helper to get all possible synthetic tenses for a verb
function getPossibleTenses(verb) {
  const tenses = new Set(Object.keys(verb.conjugations || {}))

  // Add synthetic tenses if prefixes exist
  if (verb.byObjectPrefixes) {
    tenses.add('presentByObject')
    tenses.add('pastByObject')
  }

  if (verb.byNoriPrefixes) {
    tenses.add('present')
    tenses.add('past')
    tenses.add('future')
    tenses.add('presentByNor')
    tenses.add('pastByNor')
  }

  if (verb.ditransitivePrefixes) {
    tenses.add('present')
    tenses.add('past')
    tenses.add('future')
  }

  return tenses
}

for (const verb of VERBS) {
  const verbUnused = []
  const possibleTenses = getPossibleTenses(verb)

  for (const tense of possibleTenses) {
    const key = `${verb.id}/${tense}`
    const table = getComposedTable(verb, tense)

    // Count how many forms in this tense
    let formCount = 0
    if (table) {
      for (const value of Object.values(table)) {
        if (typeof value === 'string') {
          formCount++
        } else if (typeof value === 'object') {
          formCount += Object.keys(value).length
        }
      }
    }

    if (formCount > 0) {
      allCombinations.set(key, { tense, formCount })

      if (!usedCombinations.has(key)) {
        verbUnused.push({ tense, formCount, key })
      }
    }
  }

  if (verbUnused.length > 0) {
    unusedCombinations.set(verb.id, verbUnused)
  }
}

console.log('=== UNUSED CONJUGATIONS ANALYSIS ===\n')

console.log(`Total verb/tense combinations defined: ${allCombinations.size}`)
console.log(`Total verb/tense combinations used: ${usedCombinations.size}`)
console.log(`Total unused: ${allCombinations.size - usedCombinations.size}\n`)

// Show by verb
const sortedVerbs = [...unusedCombinations.entries()].sort((a, b) => {
  const aTotal = a[1].reduce((sum, item) => sum + item.formCount, 0)
  const bTotal = b[1].reduce((sum, item) => sum + item.formCount, 0)
  return bTotal - aTotal
})

console.log('=== VERBS WITH UNUSED TENSES ===\n')

let totalUnusedForms = 0
for (const [verbId, tenses] of sortedVerbs) {
  const verb = VERBS.find(v => v.id === verbId)
  const totalForms = tenses.reduce((sum, t) => sum + t.formCount, 0)
  totalUnusedForms += totalForms

  console.log(`${verbId}: ${tenses.length} unused tenses (${totalForms} forms)`)
  console.log(`  Type: ${verb.type}, Agreement: ${verb.agreement}`)
  console.log(`  Unused tenses:`)

  for (const item of tenses.sort((a, b) => b.formCount - a.formCount)) {
    console.log(`    - ${item.tense} (${item.formCount} forms)`)
  }
  console.log()
}

console.log(`\n=== SUMMARY ===`)
console.log(`Total defined verb/tense combinations: ${allCombinations.size}`)
console.log(`Total unused combinations: ${unusedCombinations.size}`)
console.log(`Total unused forms: ${totalUnusedForms}`)
console.log(`Coverage: ${((usedCombinations.size / allCombinations.size) * 100).toFixed(1)}%`)
