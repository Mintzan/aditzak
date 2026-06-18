import { describe, it, expect } from 'vitest'
import { VERBS } from './data/verbs.js'
import { computeGapCounts } from '../scripts/validforGapAudit.mjs'
import baseline from '../scripts/validfor-gap-baseline.json'

// CI guard for the validFor delta audit (Epic #220, issue [A1]). The
// per-verb gap-slot counts are a checked-in baseline — see
// docs/DISTRACTOR_STRATEGY.md §4.2. This test fails whenever the gap surface
// changes (a verb/tense added, a sentence's validFor edited, ...), forcing a
// human naturalness review instead of letting a gap ship silently.
describe('validFor gap surface', () => {
  it('matches the checked-in baseline', () => {
    const counts = computeGapCounts(VERBS)
    expect(
      counts,
      'validFor gap surface changed. Run `node scripts/validfor-delta-audit.mjs --verb <changed>` to review the new gaps for naturalness (add the verb to a sentence\'s validFor only if its form is genuinely an also-correct completion), then regenerate the baseline with `node scripts/validfor-delta-audit.mjs --json > scripts/validfor-gap-baseline.json`.',
    ).toEqual(baseline)
  })
})
