// Generate complete inventory of Aditz Trinkoak (synthetic) and Aditz Laguntzaileak (auxiliary)

import { VERBS } from './data/verbs.js'

const synthetic = VERBS.filter(v => v.type === 'synthetic')
const periphrastic = VERBS.filter(v => v.type === 'periphrastic')

console.log('═══════════════════════════════════════════════════════════')
console.log('ADITZAK INVENTORY')
console.log('═══════════════════════════════════════════════════════════\n')

// ADITZ TRINKOAK
console.log('ADITZ TRINKOAK (Synthetic Verbs)')
console.log('───────────────────────────────────────────────────────────')
console.log(`Total: ${synthetic.length}\n`)

for (const verb of synthetic.sort((a, b) => a.id.localeCompare(b.id))) {
  const baseTenses = Object.keys(verb.conjugations || {})
    .filter(t => ['present', 'past', 'presentPlural', 'pastPlural'].includes(t))
    .sort()
  const allTenses = Object.keys(verb.conjugations || {}).length
  const agreement = Array.isArray(verb.agreement)
    ? verb.agreement.join(',')
    : verb.agreement

  console.log(`${verb.id.padEnd(15)} | Agreement: ${agreement.padEnd(15)} | Base: ${baseTenses.length} | Total: ${allTenses}`)
}

// ADITZ LAGUNTZAILEAK (Auxiliary patterns)
console.log('\n\nADITZ LAGUNTZAILEAK (Auxiliary Verb Systems)')
console.log('───────────────────────────────────────────────────────────')
console.log('Implemented through prefix composition:\n')

const auxiliarySystemsUsed = new Map()

for (const verb of VERBS) {
  if (verb.byObjectPrefixes) {
    auxiliarySystemsUsed.set('Object-axis (edun-based)', true)
  }
  if (verb.byNoriPrefixes) {
    auxiliarySystemsUsed.set('Dative (dativeIzan-based)', true)
  }
  if (verb.ditransitivePrefixes) {
    auxiliarySystemsUsed.set('Indirect object (diot-based)', true)
  }
}

for (const system of [...auxiliarySystemsUsed.keys()].sort()) {
  console.log(`✓ ${system}`)
}

console.log('\n\nADITZ PERIFRASTIKOAK (Periphrastic Verbs)')
console.log('───────────────────────────────────────────────────────────')
console.log(`Total: ${periphrastic.length}\n`)

// Group by agreement
const byAgreement = new Map()
for (const verb of periphrastic) {
  const agreement = Array.isArray(verb.agreement)
    ? verb.agreement.join(',')
    : verb.agreement
  if (!byAgreement.has(agreement)) {
    byAgreement.set(agreement, [])
  }
  byAgreement.get(agreement).push(verb.id)
}

for (const [agreement, verbs] of [...byAgreement.entries()].sort()) {
  console.log(`Agreement: ${agreement} (${verbs.length} verbs)`)
  for (const verb of verbs.sort()) {
    console.log(`  - ${verb}`)
  }
  console.log()
}

console.log('═══════════════════════════════════════════════════════════')
console.log(`TOTAL VERBS: ${VERBS.length}`)
console.log(`  Synthetic (Trinkoak): ${synthetic.length}`)
console.log(`  Periphrastic: ${periphrastic.length}`)
console.log('═══════════════════════════════════════════════════════════')
