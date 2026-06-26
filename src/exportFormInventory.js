// Export complete form inventory as CSV for spreadsheet analysis
// Run with: node src/exportFormInventory.js [format]
// Formats: csv (default), json

import fs from 'fs'
import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const format = process.argv[2] || 'csv'
const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))

// Collect all possible forms
const allPossibleForms = []
for (const verb of VERBS) {
  for (const tense of Object.keys(verb.conjugations || {})) {
    const table = getComposedTable(verb, tense)
    if (!table) continue
    for (const person of Object.keys(table)) {
      allPossibleForms.push({
        verbId: verb.id,
        tense,
        person,
        formKey: `${verb.id}-${tense}-${person}`,
      })
    }
  }
}

// Collect taught forms
const taughtForms = new Set()
for (const lesson of LESSONS) {
  const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []
  for (const source of sources) {
    const verb = verbsById.get(source.verbId)
    if (!verb) continue
    const table = getComposedTable(verb, source.tense)
    if (!table) continue
    const allPersons = Object.keys(table)
    const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons
    for (const person of personsToCheck) {
      taughtForms.add(`${source.verbId}-${source.tense}-${person}`)
    }
  }
}

// Add coverage status
for (const form of allPossibleForms) {
  form.covered = taughtForms.has(form.formKey) ? 'YES' : 'NO'
}

// Sort for consistent output
allPossibleForms.sort((a, b) => {
  if (a.verbId !== b.verbId) return a.verbId.localeCompare(b.verbId)
  if (a.tense !== b.tense) return a.tense.localeCompare(b.tense)
  const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']
  return personOrder.indexOf(a.person) - personOrder.indexOf(b.person)
})

if (format === 'csv') {
  // CSV format
  const rows = [['Verb', 'Tense', 'Person', 'Covered', 'Form Key']]
  for (const form of allPossibleForms) {
    rows.push([form.verbId, form.tense, form.person, form.covered, form.formKey])
  }
  const csv = rows.map((row) => row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(',')).join('\n')
  console.log(csv)
  fs.writeFileSync('/home/user/aditzak/form-inventory.csv', csv)
  console.error('✅ Saved to form-inventory.csv')
} else if (format === 'json') {
  // JSON format
  const data = {
    generated: new Date().toISOString(),
    totalForms: allPossibleForms.length,
    coveredForms: allPossibleForms.filter((f) => f.covered === 'YES').length,
    uncoveredForms: allPossibleForms.filter((f) => f.covered === 'NO').length,
    forms: allPossibleForms.map((f) => ({
      verb: f.verbId,
      tense: f.tense,
      person: f.person,
      covered: f.covered === 'YES',
    })),
  }
  console.log(JSON.stringify(data, null, 2))
  fs.writeFileSync('/home/user/aditzak/form-inventory.json', JSON.stringify(data, null, 2))
  console.error('✅ Saved to form-inventory.json')
} else {
  console.error(`Unknown format: ${format}. Use 'csv' or 'json'.`)
  process.exit(1)
}
