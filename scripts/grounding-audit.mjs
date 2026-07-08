#!/usr/bin/env node
// Grounding audit — M0 worklist for docs/AUXILIARY_FIRST_PLAN.md §M2.
//
// Walks every spine practice lesson × drilled person and reports which
// degrade to bare kind:'form' (i.e. no sentences[tense][person] entry =>
// no sentence-grounded kind available for that slot).
//
// The output table is the M2 worklist: each row is a (lesson, verb, tense)
// combination that needs at least one sentence frame added per missing person
// before the spine-grounding invariant (M2 final PR) can be enforced.
//
// Exempt from the eventual invariant per D5 (hitanoa and bonus units) but
// still listed here for a complete picture — the human can filter them out
// when prioritising M2 data work.
//
// Usage: node scripts/grounding-audit.mjs

import { VERBS } from '../src/data/verbs.js'
import { LESSONS } from '../src/data/lessons.js'
import { getComposedTable } from '../src/lessonLogic.js'

const verbById = new Map(VERBS.map((v) => [v.id, v]))

const rows = []

for (const lesson of LESSONS) {
  // Reviews are not "spine practice lessons" in D5's sense — skip.
  if (lesson.review) continue

  // Collect (verbId, tense) sources: single-verb lesson or pool.
  const sources = lesson.sources
    ? lesson.sources
    : lesson.verbId
      ? [{ verbId: lesson.verbId, tense: lesson.tense }]
      : []

  for (const { verbId, tense } of sources) {
    const verb = verbById.get(verbId)
    if (!verb) {
      process.stderr.write(`WARNING: verbId not found: ${verbId}\n`)
      continue
    }

    const table = getComposedTable(verb, tense)
    if (!table || Object.keys(table).length === 0) continue

    // Drilled persons: lesson.persons if restricted, otherwise all table keys.
    const drilled = lesson.persons ?? Object.keys(table)

    // A person is grounded if verb.sentences[tense][person] exists.
    const senByPerson = verb.sentences?.[tense] ?? {}
    const missing = drilled.filter((p) => !senByPerson[p])

    if (missing.length > 0) {
      rows.push({
        lessonId: lesson.id,
        verbId,
        tense,
        missing: missing.join(', '),
        missingCount: missing.length,
      })
    }
  }
}

// ---- Output ----------------------------------------------------------------

console.log('## M2 Grounding Audit — Spine Lessons Missing Sentence Data\n')
console.log(
  '_Every row below is a (lesson × verb × tense) slot where at least one drilled_\n' +
    '_person has no `sentences[tense][person]` entry, so that slot would degrade to_\n' +
    '_bare `kind: \'form\'`. Close these gaps (per-paradigm, in batches) for M2._\n',
)
console.log('| Lesson ID | Verb | Tense | Missing persons |')
console.log('| --- | --- | --- | --- |')
for (const r of rows) {
  console.log(`| ${r.lessonId} | ${r.verbId} | ${r.tense} | ${r.missing} |`)
}

const totalMissingSlots = rows.reduce((n, r) => n + r.missingCount, 0)
console.log()
console.log(`**Rows (lesson × verb × tense combos):** ${rows.length}  `)
console.log(`**Total missing (person × verb × tense) slots:** ${totalMissingSlots}`)
