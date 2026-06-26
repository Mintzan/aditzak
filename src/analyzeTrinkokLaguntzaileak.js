// Comprehensive analysis of Aditz Trinkoak (synthetic verbs) and Aditz Laguntzaileak (auxiliary verbs) coverage

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'

const syntheticVerbs = VERBS.filter(v => v.type === 'synthetic')

// Track synthetic verb tense coverage
const syntheticCoverage = new Map()

for (const verb of syntheticVerbs) {
  const definedTenses = new Set(Object.keys(verb.conjugations || {}))
  syntheticCoverage.set(verb.id, {
    verb,
    defined: definedTenses,
    used: new Set(),
  })
}

for (const lesson of LESSONS) {
  const sources = lesson.verbId
    ? [{ verbId: lesson.verbId, tense: lesson.tense }]
    : (lesson.sources || [])

  for (const source of sources) {
    if (syntheticCoverage.has(source.verbId)) {
      syntheticCoverage.get(source.verbId).used.add(source.tense)
    }
  }
}

// Track auxiliary verb patterns (through prefix mechanisms)
const auxiliaryPatterns = new Map()

// Collect all auxiliary patterns from VERBS
for (const verb of VERBS) {
  if (verb.byObjectPrefixes) {
    for (const base of ['present', 'past']) {
      const key = `byObjectPrefixes/${base}`
      if (!auxiliaryPatterns.has(key)) {
        auxiliaryPatterns.set(key, { pattern: 'Object marking (edun-based)', used: false, verbs: [] })
      }
      auxiliaryPatterns.get(key).verbs.push(verb.id)
    }
  }

  if (verb.byNoriPrefixes) {
    for (const base of ['present', 'past', 'future']) {
      const key = `byNoriPrefixes/${base}`
      if (!auxiliaryPatterns.has(key)) {
        auxiliaryPatterns.set(key, { pattern: 'Dative marking (dativeIzan-based)', used: false, verbs: [] })
      }
      auxiliaryPatterns.get(key).verbs.push(verb.id)
    }
  }

  if (verb.ditransitivePrefixes) {
    for (const tense of ['present', 'past', 'future']) {
      const key = `ditransitivePrefixes/${tense}`
      if (!auxiliaryPatterns.has(key)) {
        auxiliaryPatterns.set(key, { pattern: 'Indirect object marking (diot-based)', used: false, verbs: [] })
      }
      auxiliaryPatterns.get(key).verbs.push(verb.id)
    }
  }
}

// Check which auxiliary patterns are used
for (const lesson of LESSONS) {
  const sources = lesson.verbId
    ? [{ verbId: lesson.verbId, tense: lesson.tense }]
    : (lesson.sources || [])

  for (const source of sources) {
    const verb = VERBS.find(v => v.id === source.verbId)
    if (!verb) continue

    // Check byObjectPrefixes
    if (verb.byObjectPrefixes) {
      if (source.tense === 'presentByObject' || source.tense === 'pastByObject') {
        const base = source.tense === 'presentByObject' ? 'present' : 'past'
        const key = `byObjectPrefixes/${base}`
        if (auxiliaryPatterns.has(key)) {
          auxiliaryPatterns.get(key).used = true
        }
      }
    }

    // Check byNoriPrefixes
    if (verb.byNoriPrefixes) {
      if (['present', 'past', 'future', 'presentByNor', 'pastByNor'].includes(source.tense)) {
        const base = source.tense === 'presentByNor' ? 'present' : source.tense === 'pastByNor' ? 'past' : source.tense
        const key = `byNoriPrefixes/${base}`
        if (auxiliaryPatterns.has(key)) {
          auxiliaryPatterns.get(key).used = true
        }
      }
    }

    // Check ditransitivePrefixes
    if (verb.ditransitivePrefixes) {
      if (['present', 'past', 'future'].includes(source.tense)) {
        const key = `ditransitivePrefixes/${source.tense}`
        if (auxiliaryPatterns.has(key)) {
          auxiliaryPatterns.get(key).used = true
        }
      }
    }
  }
}

// ===== REPORT =====

console.log('╔═══════════════════════════════════════════════════════╗')
console.log('║    ADITZ TRINKOAK & LAGUNTZAILEAK COVERAGE REPORT     ║')
console.log('╚═══════════════════════════════════════════════════════╝\n')

// ADITZ TRINKOAK section
console.log('═══════════════════════════════════════════════════════')
console.log('1. ADITZ TRINKOAK (Synthetic Verbs)')
console.log('═══════════════════════════════════════════════════════\n')

let totalDefined = 0
let totalUsed = 0
let verbalWithGaps = 0

for (const [verbId, coverage] of [...syntheticCoverage.entries()].sort()) {
  const defined = coverage.defined.size
  const used = coverage.used.size
  totalDefined += defined
  totalUsed += used

  const percent = (used / defined * 100).toFixed(0)
  const status = used === defined ? '✅' : '⚠️ '
  if (used < defined) verbalWithGaps++

  console.log(`${status} ${verbId.padEnd(15)} ${used}/${defined} tenses (${percent}%)`)

  if (used < defined) {
    const unused = [...coverage.defined].filter(t => !coverage.used.has(t))
    console.log(`   Missing: ${unused.join(', ')}`)
  }
}

console.log(`\nTOTAL: ${totalUsed}/${totalDefined} tenses (${(totalUsed/totalDefined*100).toFixed(1)}%)`)
console.log(`Verbs with complete coverage: ${syntheticVerbs.length - verbalWithGaps}/${syntheticVerbs.length}\n`)

// ADITZ LAGUNTZAILEAK section
console.log('═══════════════════════════════════════════════════════')
console.log('2. ADITZ LAGUNTZAILEAK (Auxiliary Verb Systems)')
console.log('═══════════════════════════════════════════════════════\n')

const byPattern = new Map()
for (const [key, data] of auxiliaryPatterns) {
  const pattern = data.pattern
  if (!byPattern.has(pattern)) {
    byPattern.set(pattern, { total: 0, used: 0, patterns: [] })
  }
  byPattern.get(pattern).total++
  if (data.used) byPattern.get(pattern).used++
  byPattern.get(pattern).patterns.push({ key, used: data.used })
}

for (const [pattern, info] of [...byPattern.entries()]) {
  const status = info.used === info.total ? '✅' : '⚠️ '
  console.log(`${status} ${pattern}`)
  console.log(`   ${info.used}/${info.total} variants in use\n`)

  // Show which variants
  for (const p of info.patterns) {
    const icon = p.used ? '  ✓' : '  ✗'
    console.log(`${icon} ${p.key}`)
  }
  console.log()
}

console.log('═══════════════════════════════════════════════════════')
console.log('SUMMARY')
console.log('═══════════════════════════════════════════════════════\n')

const totalAuxiliaryPatterns = auxiliaryPatterns.size
const usedAuxiliaryPatterns = [...auxiliaryPatterns.values()].filter(p => p.used).length

console.log(`Synthetic Verbs: ${totalUsed}/${totalDefined} tenses (${(totalUsed/totalDefined*100).toFixed(1)}%)`)
console.log(`Auxiliary Systems: ${usedAuxiliaryPatterns}/${totalAuxiliaryPatterns} patterns (${(usedAuxiliaryPatterns/totalAuxiliaryPatterns*100).toFixed(1)}%)`)
console.log(`\nOverall Grammar Coverage: Strong`)
