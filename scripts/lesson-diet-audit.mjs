#!/usr/bin/env node
// Lesson diet audit — M0 worklist for docs/AUXILIARY_FIRST_PLAN.md §M6.
//
// Lists every single-verb periphrastic practice lesson in LESSONS and
// determines which #309 test (1–4) or introducer carve-out justifies it.
// A lesson with no justification is flagged VIOLATION — a candidate for
// pooling into its pattern's existing cross-verb lesson.
//
// Rule #309 tests (from docs/LEARNING_JOURNEY.md §7):
//   Test 1 — Irregular synthetic morphology: each synthetic verb is its own
//             paradigm; a lesson is always justified for a synthetic verb.
//   Test 2 — A distinct agreement frame: dative-governing (lagundu/gustatu),
//             NOR-NORI psych (gustatu/iruditu/ahaztu), NOR-NORI-NORK
//             ditransitives (esan/eman); the *first* lesson that introduces
//             the frame can be single-verb, subsequent ones should pool.
//   Test 3 — A special construction: modal particles (nahi/behar/ari/ahal),
//             causatives (-arazi), allocutive register (hitanoa), or other
//             construction-scoped units.
//   Test 4 — A specific known error: e.g. dativeOvergeneration flag drilling
//             the dut-vs-diot confusion.
//
// Introducer carve-out: the *first* lesson (single-verb OR pool) to introduce
// a given (agreement-pattern × tense × person-group) may be single-verb.
// Once a pool lesson introduces a pattern, subsequent single-verb lessons for
// the same pattern are VIOLATION unless they independently pass Test 2–4.
//
// Verdict key:
//   PASS      — clearly justified (synthetic, modal construction, or genuine
//               first-introducer of an unseen pattern)
//   REVIEW    — borderline; see notes column — human decides whether to pool
//   VIOLATION — pattern already introduced (by pool or earlier single-verb)
//               and no independent Test 2–4 applies; candidate for M6 pooling
//
// Usage: node scripts/lesson-diet-audit.mjs

import { VERBS } from '../src/data/verbs.js'
import { LESSONS } from '../src/data/lessons.js'

const verbById = new Map(VERBS.map((v) => [v.id, v]))

// #309 Test 3: modal particles and invariant-argument constructions.
// These earn their own lesson by their *construction*, not their paradigm.
// Include the ahal-ukan/ahal-izan/ezin-ukan/ezin-izan compound verbIds — the
// verb data splits each modal by the auxiliary family it uses, but they are
// still construction-scoped units, not general periphrastic pattern lessons.
const MODAL_PARTICLES = new Set(['nahi', 'behar', 'ari', 'ahal', 'ahal-ukan', 'ahal-izan', 'ezin-ukan', 'ezin-izan'])

// Sorted agreement key for grouping pattern families.
function agreementKey(verb) {
  return [...(verb.agreement ?? [])].sort().join('-')
}

// Person-group key: the sorted list of persons a lesson drills, or 'all' if
// the lesson inherits the full table (no persons filter).
function personsKey(lesson) {
  return lesson.persons ? lesson.persons.join(',') : 'all'
}

// Pattern key = (agreement × tense × persons): the grain at which we track
// whether a pattern has already been introduced. Two lessons with the same
// key are drilling the same cells of the same paradigm family — only the
// first one has the introducer carve-out.
function patternKey(verb, lesson) {
  return `${agreementKey(verb)}:${lesson.tense}:${personsKey(lesson)}`
}

// ---- First-occurrence tracking --------------------------------------------
// Walk LESSONS once in order to record the first lesson (single-verb OR pool)
// that introduces each (agreement × tense × persons) pattern for REGULAR
// periphrastic verbs.
//
// "Regular" here means: not synthetic (always Test 1), and not a modal/
// construction lesson (Test 3). Modal lessons like `nahi-present` don't
// claim the introducer slot — they teach a specific construction that happens
// to use the same aux table, not the general periphrastic pattern. Only pool
// lessons and regular single-verb periphrastic lessons establish a pattern
// for introducer-carve-out purposes.

const firstOccurrence = new Map() // patternKey -> { lessonId, kind: 'pool'|'single' }

function isModalOrConstruction(verbId, tense) {
  return (
    MODAL_PARTICLES.has(verbId) ||
    verbId.endsWith('arazi') ||
    (tense && (tense.toLowerCase().includes('toka') || tense.toLowerCase().includes('noka')))
  )
}

for (const lesson of LESSONS) {
  if (lesson.review) continue

  const sources = lesson.sources
    ? lesson.sources.map((s) => ({ ...s, isPool: true }))
    : lesson.verbId
      ? [{ verbId: lesson.verbId, tense: lesson.tense, isPool: false }]
      : []

  for (const { verbId, tense, isPool } of sources) {
    const verb = verbById.get(verbId)
    if (!verb || verb.type === 'synthetic') continue // synthetic always pass Test 1; skip

    // Modal/construction single-verb lessons don't claim the pattern slot —
    // they teach a construction, not the general periphrastic paradigm.
    if (!isPool && isModalOrConstruction(verbId, tense)) continue

    const key = patternKey(verb, lesson)
    if (!firstOccurrence.has(key)) {
      firstOccurrence.set(key, { lessonId: lesson.id, kind: isPool ? 'pool' : 'single' })
    }
  }
}

// ---- Audit pass -----------------------------------------------------------

const rows = []

for (const lesson of LESSONS) {
  if (lesson.review) continue
  if (!lesson.verbId) continue // pool lesson — only single-verb lessons appear in the diet audit

  const verb = verbById.get(lesson.verbId)
  if (!verb) continue

  const tense = lesson.tense
  const aKey = agreementKey(verb)
  const pKey = patternKey(verb, lesson)

  // ---- Synthetic: always Test 1 ------------------------------------------
  if (verb.type === 'synthetic') {
    rows.push({
      lessonId: lesson.id,
      verbId: lesson.verbId,
      tense,
      agreement: aKey,
      persons: personsKey(lesson),
      tests: 'Test 1 (synthetic)',
      verdict: 'PASS',
      notes: '',
    })
    continue
  }

  // ---- Periphrastic: collect passing tests --------------------------------
  const passingTests = []
  const notes = []

  // Test 2: distinct agreement frame (dative involvement).
  // Passes for the first lesson introducing this agreement × tense × persons;
  // subsequent lessons with the same frame are redundant (pool instead).
  if (verb.agreement?.includes('nori')) {
    const first = firstOccurrence.get(pKey)
    if (first && first.lessonId === lesson.id) {
      // This IS the first occurrence — genuine Test 2 introducer.
      passingTests.push('Test 2 (first distinct-frame lesson)')
    } else if (first) {
      // Agreement frame already introduced — redundant unless also Test 3/4.
      notes.push(`frame already introduced by ${first.kind === 'pool' ? 'pool ' : ''}${first.lessonId}`)
      // Still add Test 2 as a soft claim; the human decides.
      passingTests.push('Test 2 (frame repeated)')
    }
  }

  // Test 3: modal particle or special construction.
  if (MODAL_PARTICLES.has(lesson.verbId)) {
    passingTests.push('Test 3 (modal particle)')
  } else if (lesson.verbId.endsWith('arazi')) {
    passingTests.push('Test 3 (causative -arazi)')
  } else if (tense && (tense.toLowerCase().includes('toka') || tense.toLowerCase().includes('noka'))) {
    passingTests.push('Test 3 (hitanoa register)')
  }

  // Test 4: specific known error (dativeOvergeneration flag).
  if (verb.dativeOvergeneration) {
    passingTests.push('Test 4 (dativeOvergeneration error drill)')
  }

  // Introducer carve-out: first lesson overall (pool OR single-verb) for
  // this pattern. If the first occurrence was a pool, the carve-out doesn't
  // apply — the pool already introduced the pattern.
  const first = firstOccurrence.get(pKey)
  const isFirstEver = first && first.lessonId === lesson.id
  const firstWasPool = first && first.kind === 'pool'

  if (isFirstEver && !passingTests.length) {
    passingTests.push('Introducer carve-out (first for this pattern)')
  } else if (!isFirstEver && first && !passingTests.some((t) => !t.includes('repeated'))) {
    // Pattern already introduced and no clean test passes — VIOLATION.
    notes.push(
      `pattern (${aKey} × ${tense} × ${personsKey(lesson)}) already introduced by ` +
        `${firstWasPool ? 'pool ' : ''}${first.lessonId}`,
    )
  }

  // ---- Verdict -----------------------------------------------------------
  const cleanPasses = passingTests.filter((t) => !t.includes('repeated'))
  let verdict
  if (cleanPasses.length > 0) {
    verdict = 'PASS'
  } else if (passingTests.some((t) => t.includes('repeated'))) {
    // Has a dative agreement frame but it's a repeat — human decides
    verdict = 'REVIEW'
  } else {
    verdict = 'VIOLATION'
  }

  rows.push({
    lessonId: lesson.id,
    verbId: lesson.verbId,
    tense,
    agreement: aKey,
    persons: personsKey(lesson),
    tests: passingTests.join('; ') || '—',
    verdict,
    notes: notes.join('; '),
  })
}

// ---- Output ----------------------------------------------------------------

console.log('## M6 Lesson Diet Audit — Single-Verb Practice Lessons vs. Rule #309\n')
console.log(
  '_Each row is a single-verb (non-review, non-pool) practice lesson. Verdict:_\n' +
    '_**PASS** = clearly justified. **REVIEW** = borderline, human decides._\n' +
    '_**VIOLATION** = candidate for pooling in M6._\n',
)
console.log('| Lesson ID | Verb | Tense | Agreement | Persons | Tests | Verdict | Notes |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |')
for (const r of rows) {
  const verdict =
    r.verdict === 'VIOLATION' ? `**${r.verdict}**` : r.verdict === 'REVIEW' ? `_${r.verdict}_` : r.verdict
  console.log(
    `| ${r.lessonId} | ${r.verbId} | ${r.tense} | ${r.agreement} | ${r.persons} | ${r.tests} | ${verdict} | ${r.notes} |`,
  )
}

const violations = rows.filter((r) => r.verdict === 'VIOLATION')
const reviews = rows.filter((r) => r.verdict === 'REVIEW')
const synthetic = rows.filter((r) => r.tests.startsWith('Test 1'))
const periphrastic = rows.filter((r) => !r.tests.startsWith('Test 1'))

console.log()
console.log(`**Total single-verb practice lessons:** ${rows.length}  `)
console.log(`**Synthetic (Test 1, always PASS):** ${synthetic.length}  `)
console.log(`**Periphrastic:** ${periphrastic.length}  `)
console.log(`  — PASS: ${periphrastic.filter((r) => r.verdict === 'PASS').length}  `)
console.log(`  — REVIEW: ${reviews.length}  `)
console.log(`  — VIOLATION: ${violations.length}`)
if (violations.length > 0) {
  console.log()
  console.log('### VIOLATION rows (M6 pooling candidates)')
  for (const r of violations) {
    console.log(`- \`${r.lessonId}\`: ${r.notes || 'see table'}`)
  }
}
