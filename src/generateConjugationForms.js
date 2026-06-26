// Generate comprehensive listing of all conjugated forms from Aditz Trinkoak and Laguntzaileak

import { VERBS } from './data/verbs.js'

const syntheticVerbs = VERBS.filter(v => v.type === 'synthetic').sort((a, b) => a.id.localeCompare(b.id))

console.log('═══════════════════════════════════════════════════════════════════════════════')
console.log('ALL CONJUGATED FORMS: ADITZ TRINKOAK & LAGUNTZAILEAK')
console.log('═══════════════════════════════════════════════════════════════════════════════\n')

for (const verb of syntheticVerbs) {
  console.log(`${verb.id.toUpperCase()}`)
  console.log('─'.repeat(77))

  const tenses = Object.keys(verb.conjugations || {}).sort()

  for (const tense of tenses) {
    const conjugations = verb.conjugations[tense]
    const isSimple = typeof conjugations[Object.keys(conjugations)[0]] === 'string'

    if (isSimple) {
      // Simple conjugations: person -> form
      console.log(`\n  ${tense}:`)
      for (const person of Object.keys(conjugations).sort()) {
        const form = conjugations[person]
        console.log(`    ${person.padEnd(20)} ${form}`)
      }
    } else {
      // 2D conjugations: nork/nori -> nor -> form (for object/ditransitive axes)
      console.log(`\n  ${tense}: [2D table]`)
      const axis1Keys = Object.keys(conjugations).sort()
      for (const axis1 of axis1Keys) {
        const axis2Data = conjugations[axis1]
        for (const axis2 of Object.keys(axis2Data).sort()) {
          const form = axis2Data[axis2]
          console.log(`    ${axis1.padEnd(10)} → ${axis2.padEnd(10)} ${form}`)
        }
      }
    }
  }

  // Auxiliary patterns
  if (verb.byObjectPrefixes) {
    console.log(`\n  [Object-axis auxiliary forms via byObjectPrefixes]`)
    for (const base of Object.keys(verb.byObjectPrefixes).sort()) {
      const patterns = verb.byObjectPrefixes[base]
      if (patterns && typeof patterns === 'object') {
        for (const prefix of Object.keys(patterns).sort()) {
          const form = patterns[prefix]
          if (form) console.log(`    byObjectPrefixes.${base}[${prefix}] = ${form}`)
        }
      }
    }
  }

  if (verb.byNoriPrefixes) {
    console.log(`\n  [Dative auxiliary forms via byNoriPrefixes]`)
    for (const base of Object.keys(verb.byNoriPrefixes).sort()) {
      const patterns = verb.byNoriPrefixes[base]
      if (patterns && typeof patterns === 'object') {
        for (const prefix of Object.keys(patterns).sort()) {
          const form = patterns[prefix]
          if (form) console.log(`    byNoriPrefixes.${base}[${prefix}] = ${form}`)
        }
      }
    }
  }

  if (verb.ditransitivePrefixes) {
    console.log(`\n  [Ditransitive auxiliary forms via ditransitivePrefixes]`)
    for (const base of Object.keys(verb.ditransitivePrefixes).sort()) {
      const patterns = verb.ditransitivePrefixes[base]
      if (patterns && typeof patterns === 'object') {
        for (const prefix of Object.keys(patterns).sort()) {
          const form = patterns[prefix]
          if (form) console.log(`    ditransitivePrefixes.${base}[${prefix}] = ${form}`)
        }
      }
    }
  }

  console.log('\n')
}

// Count total forms
let totalForms = 0
for (const verb of syntheticVerbs) {
  const tenses = Object.keys(verb.conjugations || {})
  for (const tense of tenses) {
    const conjugations = verb.conjugations[tense]
    const isSimple = typeof conjugations[Object.keys(conjugations)[0]] === 'string'

    if (isSimple) {
      totalForms += Object.keys(conjugations).length
    } else {
      for (const axis1 of Object.keys(conjugations)) {
        totalForms += Object.keys(conjugations[axis1]).length
      }
    }
  }

  // Count auxiliary forms
  if (verb.byObjectPrefixes) {
    for (const base of Object.keys(verb.byObjectPrefixes)) {
      totalForms += Object.keys(verb.byObjectPrefixes[base] || {}).length
    }
  }
  if (verb.byNoriPrefixes) {
    for (const base of Object.keys(verb.byNoriPrefixes)) {
      totalForms += Object.keys(verb.byNoriPrefixes[base] || {}).length
    }
  }
  if (verb.ditransitivePrefixes) {
    for (const base of Object.keys(verb.ditransitivePrefixes)) {
      totalForms += Object.keys(verb.ditransitivePrefixes[base] || {}).length
    }
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════')
console.log(`TOTAL FORMS: ${totalForms}`)
console.log('═══════════════════════════════════════════════════════════════════════════════')
