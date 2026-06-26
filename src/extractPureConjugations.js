// Extract ONLY the conjugated form strings (no verb context)
// This shows just the final Basque words, nothing that identifies verbs

import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const allForms = new Set()

for (const verb of VERBS) {
  for (const tense of Object.keys(verb.conjugations || {})) {
    const table = getComposedTable(verb, tense)
    if (!table) continue

    // Extract all values (the actual conjugated forms)
    for (const value of Object.values(table)) {
      if (typeof value === 'string') {
        allForms.add(value)
      } else if (typeof value === 'object' && value !== null) {
        // Handle 2D tables
        for (const subValue of Object.values(value)) {
          if (typeof subValue === 'string') {
            allForms.add(subValue)
          }
        }
      }
    }
  }
}

// Sort alphabetically
const sorted = [...allForms].sort()

console.log(`=== PURE CONJUGATIONS (${sorted.length} unique forms) ===\n`)
sorted.forEach(form => console.log(form))

console.log(`\n=== TOTAL: ${sorted.length} unique conjugations ===`)

// Save to file
import fs from 'fs'
fs.writeFileSync('pure-conjugations.txt', sorted.join('\n'))
console.log('✅ Saved to pure-conjugations.txt')
