// Extract ONLY conjugation endings/morphs (without verb stems)
// For compound forms, take just the auxiliary part

import { getAllConjugations } from './conjugationIntroductions.js'

const allConjugations = getAllConjugations()
const endings = new Set()

for (const conj of allConjugations) {
  const form = conj.form
  
  // For compound forms (contains space), take everything after the space
  if (form.includes(' ')) {
    const parts = form.split(' ')
    endings.add(parts[parts.length - 1])
  } else {
    // For simple forms, add as-is (these are the conjugations)
    endings.add(form)
  }
}

const sorted = [...endings].sort()

console.log(`=== CONJUGATION ENDINGS/MORPHS (${sorted.length} unique) ===\n`)
sorted.forEach(form => console.log(form))

console.log(`\n=== TOTAL: ${sorted.length} unique conjugations ===`)

import fs from 'fs'
fs.writeFileSync('conjugation-endings.txt', sorted.join('\n'))
console.log('✅ Saved to conjugation-endings.txt')
