#!/usr/bin/env node
// validFor delta-audit CLI (Epic #220, issue [A1]).
// See docs/DISTRACTOR_STRATEGY.md §4.2 — run this when a verb/tense is added,
// to review the new gap slots it creates for naturalness, then regenerate the
// baseline (`scripts/validfor-gap-baseline.json`) that `src/validfor-audit.test.js`
// guards.
//
// `--classes` ([A4]/#239) supplements the agreement-based output above with a
// second-pass, object-class-based audit (see docs/OBJECT_FRAME_TAGGING.md) —
// candidate `validFor` additions the agreement-only audit can't see, since it
// has no model of object semantics. Tooling only: never writes `verbs.js`.
//
// Usage:
//   node scripts/validfor-delta-audit.mjs                 # per-verb gap counts, descending
//   node scripts/validfor-delta-audit.mjs --verb <id>      # every gap slot for that verb
//   node scripts/validfor-delta-audit.mjs --json            # emit `{ [verbId]: count }`
//   node scripts/validfor-delta-audit.mjs --classes         # + class-model candidate fixes
//   node scripts/validfor-delta-audit.mjs --classes --verb <id>  # candidates for that verb only

import { VERBS } from '../src/data/verbs.js'
import { computeGapCounts, computeGapSlots } from './validforGapAudit.mjs'
import { computeClassCandidateSlots } from './frameClasses.mjs'

function parseArgs(argv) {
  const args = { verb: null, json: false, classes: false }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--verb') args.verb = argv[i + 1]
    if (argv[i] === '--json') args.json = true
    if (argv[i] === '--classes') args.classes = true
  }
  return args
}

function printClassCandidates(verbId) {
  const { slots, unmapped } = computeClassCandidateSlots(VERBS)
  const filteredSlots = verbId ? slots.filter((slot) => slot.hostVerbId === verbId) : slots
  const filteredUnmapped = verbId ? unmapped.filter((row) => row.hostVerbId === verbId) : unmapped

  console.log('\n--- class-model candidate fixes (review for naturalness) ---')
  if (filteredSlots.length === 0) {
    console.log('No class-model candidate fixes.')
  } else {
    for (const slot of filteredSlots) {
      console.log(
        `host=${slot.hostVerbId} ${slot.field} ${slot.tense}/${slot.person} | "${slot.text}" | ${slot.addVerbId}-form="${slot.addForm}" | class=${slot.className}`,
      )
    }
    console.log(`\n${filteredSlots.length} candidate fix(es).`)
  }
  if (filteredUnmapped.length > 0) {
    console.log(`\n${filteredUnmapped.length} unmapped tagged sentence(s) (no frame-classes.json entry):`)
    for (const row of filteredUnmapped) {
      console.log(`host=${row.hostVerbId} ${row.field} ${row.tense}/${row.person} | "${row.text}"`)
    }
  }
}

function printVerbGaps(verbId) {
  const slots = computeGapSlots(VERBS).filter((slot) => slot.gapVerbId === verbId)
  if (slots.length === 0) {
    console.log(`No gap slots for verb "${verbId}".`)
    return
  }
  for (const slot of slots) {
    console.log(
      `host=${slot.hostVerbId} ${slot.field} ${slot.tense}/${slot.person} | "${slot.text}" | ${slot.gapVerbId}-form="${slot.gapForm}" | validFor=[${slot.validFor.join(', ')}]`,
    )
  }
  console.log(`\n${slots.length} gap slot(s) for "${verbId}".`)
}

function printCountsTable() {
  const counts = computeGapCounts(VERBS)
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1])
  let total = 0
  for (const [verbId, count] of rows) {
    total += count
    console.log(`${String(count).padStart(5)}  ${verbId}`)
  }
  console.log(`\nTotal gap slots: ${total}`)
}

const args = parseArgs(process.argv.slice(2))

if (args.json) {
  const agreement = computeGapCounts(VERBS)
  if (args.classes) {
    const { slots, unmapped } = computeClassCandidateSlots(VERBS)
    const filteredSlots = args.verb ? slots.filter((slot) => slot.hostVerbId === args.verb) : slots
    const filteredUnmapped = args.verb ? unmapped.filter((row) => row.hostVerbId === args.verb) : unmapped
    console.log(JSON.stringify({ agreement, classes: { slots: filteredSlots, unmapped: filteredUnmapped } }, null, 2))
  } else {
    console.log(JSON.stringify(agreement, null, 2))
  }
} else if (args.verb) {
  printVerbGaps(args.verb)
  if (args.classes) printClassCandidates(args.verb)
} else {
  printCountsTable()
  if (args.classes) printClassCandidates(null)
}
