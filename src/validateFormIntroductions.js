// Script to validate form introductions and generate a pedagogical report
// Run with: node src/validateFormIntroductions.js

import { LESSONS } from './data/lessons.js'
import { VERBS } from './data/verbs.js'
import { getComposedTable } from './lessonLogic.js'

const verbsById = new Map(VERBS.map((verb) => [verb.id, verb]))
const personOrder = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']
const formIntroduced = new Map() // "verbId-tense-person" -> { lessonIdx, lessonId }
const formUsed = new Map() // "verbId-tense-person" -> lessonIdx array

function getPersonsForSource(source) {
  const verb = verbsById.get(source.verbId)
  if (!verb) {
    console.warn(`Unknown verb: ${source.verbId}`)
    return []
  }
  const table = getComposedTable(verb, source.tense)
  return table ? Object.keys(table) : []
}

// Track all forms across lessons
for (let lessonIdx = 0; lessonIdx < LESSONS.length; lessonIdx++) {
  const lesson = LESSONS[lessonIdx]
  const sources = lesson.verbId ? [{ verbId: lesson.verbId, tense: lesson.tense }] : lesson.sources || []

  for (const source of sources) {
    const allPersons = getPersonsForSource(source)
    const personsToCheck = lesson.persons?.length > 0 ? lesson.persons : allPersons

    for (const person of personsToCheck) {
      const formKey = `${source.verbId}-${source.tense}-${person}`
      if (!formIntroduced.has(formKey)) {
        formIntroduced.set(formKey, { lessonIdx, lessonId: lesson.id })
      }
      if (!formUsed.has(formKey)) {
        formUsed.set(formKey, [])
      }
      formUsed.get(formKey).push(lessonIdx)
    }
  }
}

// ============================================================================
// Check for violations: forms used before introduction
// ============================================================================
console.log('\n=== FORM INTRODUCTION VALIDATION ===\n')

const violations = []
for (const [formKey, usages] of formUsed) {
  const introducedAt = formIntroduced.get(formKey)
  const usedBefore = usages.filter((idx) => idx < introducedAt.lessonIdx)
  if (usedBefore.length > 0) {
    violations.push({
      formKey,
      introducedAt: introducedAt.lessonIdx,
      introducedIn: introducedAt.lessonId,
      usedBefore: usedBefore.map((idx) => ({ idx, lessonId: LESSONS[idx].id })),
    })
  }
}

if (violations.length > 0) {
  console.log('❌ VIOLATIONS: Forms used before introduction:\n')
  for (const violation of violations) {
    console.log(`  ${violation.formKey}`)
    console.log(`    First introduced: Lesson ${violation.introducedAt} ("${violation.introducedIn}")`)
    console.log(`    But used in: ${violation.usedBefore.map((u) => `Lesson ${u.idx} ("${u.lessonId}")`).join(', ')}`)
  }
  console.log()
} else {
  console.log('✅ All forms introduced before use\n')
}

// ============================================================================
// Report form introductions grouped by verb/tense
// ============================================================================
console.log('=== FORM INTRODUCTION TIMELINE ===\n')

const byVerb = new Map()
for (const [formKey, { lessonIdx, lessonId }] of formIntroduced) {
  const [verbId, tense, person] = formKey.split('-')
  const key = `${verbId}/${tense}`
  if (!byVerb.has(key)) {
    byVerb.set(key, [])
  }
  byVerb.get(key).push({ person, lessonIdx, lessonId, formKey })
}

// Sort and display
const sortedVerbTenses = [...byVerb.keys()].sort()
for (const vtKey of sortedVerbTenses) {
  const forms = byVerb.get(vtKey)
  const sorted = forms.sort((a, b) => personOrder.indexOf(a.person) - personOrder.indexOf(b.person))

  console.log(`${vtKey}:`)
  for (const form of sorted) {
    const completeness = form.person.length === 2 ? form.person : form.person.padEnd(5)
    console.log(`  ${completeness} → Lesson ${form.lessonIdx.toString().padStart(3)} (${form.lessonId})`)
  }
  console.log()
}

// ============================================================================
// Pedagogical analysis
// ============================================================================
console.log('=== PEDAGOGICAL ANALYSIS ===\n')

const warnings = []
const suggestions = []

for (const [vtKey, forms] of byVerb) {
  const singularPersons = forms.filter((f) => ['ni', 'zu', 'hura'].includes(f.person))
  const pluralPersons = forms.filter((f) => ['gu', 'zuek', 'haiek'].includes(f.person))

  // Check: plural before all singular
  if (pluralPersons.length > 0 && singularPersons.length > 0) {
    const lastSingular = Math.max(...singularPersons.map((f) => f.lessonIdx))
    const firstPlural = Math.min(...pluralPersons.map((f) => f.lessonIdx))
    if (firstPlural < lastSingular) {
      warnings.push(
        `⚠️  ${vtKey}: Plural forms introduced before final singular form\n     First plural: Lesson ${firstPlural} (${LESSONS[firstPlural].id})\n     Last singular: Lesson ${lastSingular} (${LESSONS[lastSingular].id})`,
      )
    }
  }

  // Check: gaps within singular persons (e.g., ni then big gap then zu)
  if (singularPersons.length > 1) {
    const sorted = singularPersons.sort((a, b) => a.lessonIdx - b.lessonIdx)
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].lessonIdx - sorted[i].lessonIdx
      if (gap > 5) {
        suggestions.push(
          `ℹ️  ${vtKey}: Large gap between ${sorted[i].person} (Lesson ${sorted[i].lessonIdx}) and ${sorted[i + 1].person} (Lesson ${sorted[i + 1].lessonIdx}) — ${gap} lessons apart`,
        )
      }
    }
  }
}

if (warnings.length > 0) {
  console.log('Warnings:')
  console.log(warnings.join('\n') + '\n')
} else {
  console.log('✅ No pedagogical warnings\n')
}

if (suggestions.length > 0) {
  console.log('Notes:')
  console.log(suggestions.join('\n'))
}

// ============================================================================
// Summary stats
// ============================================================================
console.log('\n=== SUMMARY ===\n')
console.log(`Total unique forms: ${formIntroduced.size}`)
console.log(`Total lessons: ${LESSONS.length}`)
console.log(`Form violations: ${violations.length}`)
console.log(`Pedagogical warnings: ${warnings.length}`)

if (violations.length === 0 && warnings.length === 0) {
  console.log('\n✅ Form introduction is valid and pedagogically sound\n')
  process.exit(0)
} else {
  console.log('\n❌ Issues found — see above for details\n')
  process.exit(violations.length > 0 ? 1 : 0)
}
