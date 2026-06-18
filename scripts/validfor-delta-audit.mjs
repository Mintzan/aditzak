#!/usr/bin/env node
// validFor delta-audit CLI (Epic #220, issue [A1]).
// See docs/DISTRACTOR_STRATEGY.md §4.2 — run this when a verb/tense is added,
// to review the new gap slots it creates for naturalness, then regenerate the
// baseline (`scripts/validfor-gap-baseline.json`) that `src/validfor-audit.test.js`
// guards.
//
// Usage:
//   node scripts/validfor-delta-audit.mjs                 # per-verb gap counts, descending
//   node scripts/validfor-delta-audit.mjs --verb <id>      # every gap slot for that verb
//   node scripts/validfor-delta-audit.mjs --json            # emit `{ [verbId]: count }`

import { VERBS } from '../src/data/verbs.js'
import { computeGapCounts, computeGapSlots } from './validforGapAudit.mjs'

function parseArgs(argv) {
  const args = { verb: null, json: false }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--verb') args.verb = argv[i + 1]
    if (argv[i] === '--json') args.json = true
  }
  return args
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
  console.log(JSON.stringify(computeGapCounts(VERBS), null, 2))
} else if (args.verb) {
  printVerbGaps(args.verb)
} else {
  printCountsTable()
}
