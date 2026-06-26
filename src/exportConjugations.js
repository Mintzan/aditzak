// Export all conjugations with introduction points as CSV
// Run with: node src/exportConjugations.js [format]

import fs from 'fs'
import { getAllConjugations, getSharedConjugations } from './conjugationIntroductions.js'

const format = process.argv[2] || 'csv'

const allConjugations = getAllConjugations()
const sharedConjugations = getSharedConjugations()

// Mark which forms are shared
const sharedForms = new Set(sharedConjugations.keys())
for (const conj of allConjugations) {
  conj.shared = sharedForms.has(conj.form) ? 'YES' : 'NO'
}

if (format === 'csv') {
  // CSV format
  const rows = [['Conjugation', 'Verb', 'Tense', 'Person', 'Lesson#', 'Lesson ID', 'Shared']]
  for (const conj of allConjugations) {
    rows.push([
      conj.form,
      conj.verbId,
      conj.tense,
      conj.person,
      conj.lessonIdx.toString(),
      conj.lessonId,
      conj.shared,
    ])
  }

  const csv = rows.map((row) => row.map((cell) => {
    const str = String(cell)
    return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
  }).join(',')).join('\n')

  console.log(csv)
  fs.writeFileSync('/home/user/aditzak/conjugations-by-lesson.csv', csv)
  console.error('✅ Saved to conjugations-by-lesson.csv')
} else if (format === 'json') {
  // JSON format
  const data = {
    generated: new Date().toISOString(),
    totalConjugations: allConjugations.length,
    sharedConjugations: sharedConjugations.size,
    conjugations: allConjugations.map((c) => ({
      form: c.form,
      verbId: c.verbId,
      tense: c.tense,
      person: c.person,
      lessonIdx: c.lessonIdx,
      lessonId: c.lessonId,
      shared: c.shared === 'YES',
    })),
  }
  console.log(JSON.stringify(data, null, 2))
  fs.writeFileSync('/home/user/aditzak/conjugations-by-lesson.json', JSON.stringify(data, null, 2))
  console.error('✅ Saved to conjugations-by-lesson.json')
} else {
  console.error(`Unknown format: ${format}. Use 'csv' or 'json'.`)
  process.exit(1)
}
