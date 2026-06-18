#!/usr/bin/env node
// Object-class derivation diff for the [A3]/#225 design spike (read-only —
// see docs/OBJECT_FRAME_TAGGING.md). Does NOT read or write `src/data/verbs.js`'s
// `validFor` data; it only reports what a class-based `validFor` derivation
// *would* produce, against what's hand-tagged today, for review.
//
// For every tagged sentence/negativeSentence variant of a core-cluster verb
// that has a class entry in `frame-classes.json`, derives the admitted verb
// set from CLASS_ADMISSION (filtered by agreement compatibility and form
// distinctness, mirroring scripts/validforGapAudit.mjs's gap-slot logic) and
// diffs it against the hand-tagged `validFor`.
//
// The shared class model (`CLASS_ADMISSION`, `deriveValidFor`,
// `computeClassDiff`) lives in `scripts/frameClasses.mjs`, also used by
// `validfor-delta-audit.mjs`'s `--classes` mode ([A4]/#239).
//
// Usage:
//   node scripts/frame-derive-diff.mjs            # summary counts per host verb
//   node scripts/frame-derive-diff.mjs --samples   # + a few example diffs per verb
//   node scripts/frame-derive-diff.mjs --json      # machine-readable full report

import { VERBS } from '../src/data/verbs.js'
import { CLASS_ADMISSION, computeClassDiff } from './frameClasses.mjs'

export { CLASS_ADMISSION }

function printSummary(report, showSamples) {
  let totalExact = 0
  let totalAdds = 0
  let totalRemoves = 0
  let totalUnmapped = 0
  for (const [verbId, entry] of Object.entries(report)) {
    totalExact += entry.exact
    totalAdds += entry.adds
    totalRemoves += entry.removes
    totalUnmapped += entry.unmapped
    console.log(
      `${verbId.padEnd(8)} exact=${entry.exact} adds=${entry.adds} removes=${entry.removes} unmapped=${entry.unmapped}`,
    )
    if (showSamples) {
      for (const sample of entry.samples) {
        console.log(
          `    "${sample.text}" [${sample.class}] tagged=[${sample.validFor.join(',')}] derived=[${sample.derived.join(',')}] adds=[${sample.adds.join(',')}] removes=[${sample.removes.join(',')}]`,
        )
      }
    }
  }
  console.log(`\nTotals: exact=${totalExact} adds=${totalAdds} removes=${totalRemoves} unmapped=${totalUnmapped}`)
}

const args = process.argv.slice(2)
const report = computeClassDiff(VERBS)

if (args.includes('--json')) {
  console.log(JSON.stringify(report, null, 2))
} else {
  printSummary(report, args.includes('--samples'))
}
