// Generate a clean list of all conjugations (actual Basque words)

import { getAllConjugations } from './conjugationIntroductions.js'

const allConjugations = getAllConjugations()

// Get unique conjugations only
const uniqueConjugations = new Set()
for (const conj of allConjugations) {
  uniqueConjugations.add(conj.form)
}

// Convert to sorted array
const sorted = [...uniqueConjugations].sort()

console.log(`=== ALL CONJUGATIONS (${sorted.length} unique forms) ===\n`)

// Display in columns
const colWidth = 25
const cols = 3
for (let i = 0; i < sorted.length; i += cols) {
  const row = sorted.slice(i, i + cols)
  console.log(row.map(w => w.padEnd(colWidth)).join(''))
}

console.log(`\n=== TOTAL: ${sorted.length} unique conjugated forms ===`)

// Also save to file
import fs from 'fs'
fs.writeFileSync('conjugations-list.txt', sorted.join('\n'))
console.log('✅ Saved to conjugations-list.txt\n')

// Show some statistics
console.log('Sample conjugations:')
const samples = sorted.slice(0, 20)
samples.forEach(c => console.log(`  "${c}"`))
console.log(`  ... and ${sorted.length - 20} more`)
