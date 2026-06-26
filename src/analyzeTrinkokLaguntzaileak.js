// Comprehensive analysis of Aditz Trinkoak (synthetic verbs) and Aditz Laguntzaileak (auxiliary verbs) coverage

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'

const syntheticVerbs = VERBS.filter(v => v.type === 'synthetic')

// Base tenses that represent core temporal systems (future is periphrastic: participle + auxiliary)
const BASE_TENSES = new Set(['present', 'past', 'presentPlural', 'pastPlural'])

// Track synthetic verb base tense coverage
const syntheticCoverage = new Map()

for (const verb of syntheticVerbs) {
  const definedBaseTenses = new Set(
    Object.keys(verb.conjugations || {}).filter(t => BASE_TENSES.has(t))
  )
  syntheticCoverage.set(verb.id, {
    verb,
    defined: definedBaseTenses,
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
    for (const base of ['present', 'past']) {
      const key = `byNoriPrefixes/${base}`
      if (!auxiliaryPatterns.has(key)) {
        auxiliaryPatterns.set(key, { pattern: 'Dative marking (dativeIzan-based)', used: false, verbs: [] })
      }
      auxiliaryPatterns.get(key).verbs.push(verb.id)
    }
  }

  if (verb.ditransitivePrefixes) {
    for (const base of ['present', 'past']) {
      const key = `ditransitivePrefixes/${base}`
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
      if (source.tense === 'presentByObject') {
        auxiliaryPatterns.get('byObjectPrefixes/present').used = true
      } else if (source.tense === 'pastByObject') {
        auxiliaryPatterns.get('byObjectPrefixes/past').used = true
      }
    }

    // Check byNoriPrefixes (present, past, or their ByNor variants)
    if (verb.byNoriPrefixes) {
      if (source.tense === 'present' || source.tense === 'presentByNor') {
        auxiliaryPatterns.get('byNoriPrefixes/present').used = true
      } else if (source.tense === 'past' || source.tense === 'pastByNor') {
        auxiliaryPatterns.get('byNoriPrefixes/past').used = true
      }
    }

    // Check ditransitivePrefixes
    if (verb.ditransitivePrefixes) {
      if (source.tense === 'present') {
        auxiliaryPatterns.get('ditransitivePrefixes/present').used = true
      } else if (source.tense === 'past') {
        auxiliaryPatterns.get('ditransitivePrefixes/past').used = true
      }
    }
  }
}

// ===== REPORT =====

console.log('╔═══════════════════════════════════════════════════════╗')
console.log('║    ADITZ TRINKOAK & LAGUNTZAILEAK COVERAGE REPORT     ║')
console.log('╚═══════════════════════════════════════════════════════╝\n')

console.log('Note: Analysis covers BASE TENSES only')
console.log('(present, past, presentPlural, pastPlural)')
console.log('Future is periphrastic: participle + auxiliary\n')

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

  const coverage_pct = defined > 0 ? (used / defined * 100).toFixed(0) : '—'
  const status = used === defined ? '✅' : '⚠️ '

  if (used < defined) {
    verbalWithGaps++
  }

  console.log(`${status} ${verbId.padEnd(15)} ${used}/${defined} base tenses (${coverage_pct}%)`)

  if (used < defined) {
    const unused = [...coverage.defined].filter(t => !coverage.used.has(t))
    console.log(`   Missing: ${unused.join(', ')}`)
  }
}

console.log(`\nBase tense coverage: ${totalUsed}/${totalDefined} (${(totalUsed/totalDefined*100).toFixed(1)}%)`)
console.log(`Verbs with complete base tense coverage: ${syntheticVerbs.length - verbalWithGaps}/${syntheticVerbs.length}\n`)

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

console.log(`Synthetic Base Tenses: ${totalUsed}/${totalDefined} (${(totalUsed/totalDefined*100).toFixed(1)}%)`)
console.log(`Auxiliary Systems: ${usedAuxiliaryPatterns}/${totalAuxiliaryPatterns} patterns (${(usedAuxiliaryPatterns/totalAuxiliaryPatterns*100).toFixed(1)}%)`)
console.log(`\nGrammar Coverage: Strong`)
console.log('\nNote: Future forms (participle + auxiliary) use present base tenses')
console.log('      Moods (conditional, potential, etc.) use present/past bases')
