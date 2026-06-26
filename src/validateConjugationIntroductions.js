// Validate that conjugated forms are introduced in pedagogically sound order
// Run with: node src/validateConjugationIntroductions.js

import { getAllConjugations, getSharedConjugations, getConjugationStatistics } from './conjugationIntroductions.js'

console.log('=== CONJUGATION INTRODUCTION VALIDATION ===\n')

const allConjugations = getAllConjugations()
const sharedConjugations = getSharedConjugations()
const stats = getConjugationStatistics()

// ============================================================================
// Report shared conjugations (same word in multiple verbs/tenses)
// ============================================================================
console.log('=== SHARED CONJUGATIONS ===\n')
console.log(`Forms appearing in multiple verbs/tenses: ${sharedConjugations.size}\n`)

const sortedShared = [...sharedConjugations.entries()].sort((a, b) => {
  // Sort by first lesson where form appears
  const aLesson = allConjugations.find((c) => c.form === a[0])?.lessonIdx || 0
  const bLesson = allConjugations.find((c) => c.form === b[0])?.lessonIdx || 0
  return aLesson - bLesson
})

// Show examples (first 30)
console.log('Examples of shared forms (appear in multiple verbs/tenses):\n')
for (const [form, sources] of sortedShared.slice(0, 30)) {
  const intro = allConjugations.find((c) => c.form === form)
  console.log(`"${form}" (first in: ${intro.verbId}/${intro.tense}/${intro.person})`)
  console.log(`  Also appears in: ${sources.slice(1).map((s) => `${s.verbId}/${s.tense}/${s.person}`).join(', ')}`)
}

console.log(`\n... and ${Math.max(0, sharedConjugations.size - 30)} more shared forms\n`)

// ============================================================================
// Timeline: All conjugations by first introduction
// ============================================================================
console.log('=== CONJUGATION INTRODUCTION TIMELINE ===\n')

// Group by lesson
const byLesson = new Map()
for (const conj of allConjugations) {
  if (!byLesson.has(conj.lessonIdx)) {
    byLesson.set(conj.lessonIdx, [])
  }
  byLesson.get(conj.lessonIdx).push(conj)
}

for (const [lessonIdx, conjugations] of [...byLesson.entries()].slice(0, 50)) {
  const lesson = conjugations[0] // All have same lessonId
  console.log(`Lesson ${lessonIdx} (${lesson.lessonId}):`)
  const forms = conjugations.map((c) => `"${c.form}"${c.person ? ` (${c.verbId}/${c.tense}/${c.person})` : ''}`).join(', ')
  console.log(`  ${forms}`)
}
console.log(`\n... and ${Math.max(0, byLesson.size - 50)} more lessons`)

// ============================================================================
// Check for problematic patterns
// ============================================================================
console.log('\n=== PEDAGOGICAL ANALYSIS ===\n')

const warnings = []

// Check: same conjugation across different persons being taught in same lesson
const conjugationsByForm = new Map()
for (const conj of allConjugations) {
  if (!conjugationsByForm.has(conj.form)) {
    conjugationsByForm.set(conj.form, [])
  }
  conjugationsByForm.get(conj.form).push(conj)
}

let homonyms = 0
for (const [form, sources] of conjugationsByForm) {
  if (sources.length > 1) {
    const samePerson = sources.filter((s) => s.person === sources[0].person)
    if (samePerson.length > 1) {
      homonyms++
      if (homonyms <= 10) {
        warnings.push(
          `"${form}" appears ${sources.length} times (${sources.map((s) => `${s.verbId} ${s.person}`).join(', ')}) — learners may see same form in different contexts`,
        )
      }
    }
  }
}

if (warnings.length > 0) {
  console.log('Homonym patterns (same conjugated form in multiple contexts):')
  warnings.forEach((w) => console.log(`  ℹ️  ${w}`))
  console.log(`\n... and ${Math.max(0, homonyms - 10)} more homonyms\n`)
}

// ============================================================================
// Summary
// ============================================================================
console.log('=== SUMMARY ===\n')
console.log(`Total conjugated forms taught: ${allConjugations.length}`)
console.log(`Unique forms: ${conjugationsByForm.size}`)
console.log(`Shared forms (appear in 2+ verbs/tenses): ${sharedConjugations.size}`)
console.log(`Homonyms (same person, multiple verbs): ${homonyms}`)
console.log(`Lessons: ${byLesson.size}`)
console.log(`Verbs: ${stats.uniqueVerbs}`)
console.log(`Tenses: ${stats.uniqueTenses.size}`)
console.log()
