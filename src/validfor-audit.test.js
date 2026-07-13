import { describe, it, expect } from 'vitest'
import { VERBS, CELL_FRAMES } from './data/verbs.js'
import { mergeFrameSentences, normalizeSentence } from './lessonLogic.js'
import { computeGapCounts } from '../scripts/validforGapAudit.mjs'
import baseline from '../scripts/validfor-gap-baseline.json'

// CI guard for the validFor delta audit (Epic #220, issue [A1]). The
// per-verb gap-slot counts are a checked-in baseline — see
// docs/academic/DISTRACTOR_STRATEGY.md §4.2. This test fails whenever the gap surface
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

// CI guard for M2 cell-frame infrastructure. Checks that:
// - Every verb with slotVocabulary has well-formed sg/pl entries.
// - mergeFrameSentences fills missing cells with resolved, blank-containing
//   sentences (no leftover {objects} placeholders).
// - It never overrides hand-written sentences.
// - Frame-generated sentences carry validFor: undefined (conservative default).
describe('cell-frame infrastructure (M2)', () => {
  const frameVerbs = VERBS.filter((v) => v.slotVocabulary && v.composedPrefixes)

  it('every slotVocabulary verb has non-empty sg and pl arrays', () => {
    for (const verb of frameVerbs) {
      expect(verb.slotVocabulary.sg?.length, `${verb.id}: missing slotVocabulary.sg`).toBeGreaterThan(0)
      expect(verb.slotVocabulary.pl?.length, `${verb.id}: missing slotVocabulary.pl`).toBeGreaterThan(0)
    }
  })

  it('mergeFrameSentences generates resolved sentences for covered tenses', () => {
    for (const verb of frameVerbs) {
      for (const [frameKey] of Object.entries(CELL_FRAMES)) {
        const [, tense] = frameKey.split(':')
        const frame = CELL_FRAMES[frameKey]
        const persons = Object.keys(frame).filter((k) => k !== 'objectNumber')
        const merged = mergeFrameSentences(verb, tense, {})
        // only check verbs whose family matches this frame key
        const family = frameKey.split(':')[0]
        const verbFamily = verb.agreement?.includes('nork') && !verb.agreement?.includes('nori')
          ? 'norNork' : null
        if (family !== verbFamily) continue
        for (const person of persons) {
          const s = normalizeSentence(merged[person])
          expect(s, `${verb.id}:${tense}:${person}: no sentence generated`).toBeDefined()
          expect(s.text, `${verb.id}:${tense}:${person}: sentence missing ___`).toContain('___')
          expect(s.text, `${verb.id}:${tense}:${person}: unresolved {objects}`).not.toContain('{objects}')
          expect(s.validFor, `${verb.id}:${tense}:${person}: validFor must be undefined`).toBeUndefined()
        }
      }
    }
  })

  it('mergeFrameSentences never overrides hand-written sentences', () => {
    for (const verb of frameVerbs) {
      for (const tense of ['present', 'past', 'future', 'presentPlural', 'pastPlural', 'futurePlural']) {
        const existing = verb.sentences?.[tense]
        if (!existing) continue
        const merged = mergeFrameSentences(verb, tense, existing)
        for (const [person, sentence] of Object.entries(existing)) {
          expect(merged[person]).toBe(sentence)
        }
      }
    }
  })
})
