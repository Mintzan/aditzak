// Core computation for the validFor delta audit (Epic #220, issue [A1]).
// Shared by the CLI script (`validfor-delta-audit.mjs`) and the CI guard test
// (`src/validfor-audit.test.js`) so both stay in lock-step by construction.
//
// A "gap slot" for verb W is a tagged sentence variant, hosted by some other
// verb V, where W's same-person form is a distinct, agreement-compatible form
// that isn't listed in that variant's `validFor` — i.e. it would currently be
// offered as a "wrong" distractor. See docs/DISTRACTOR_STRATEGY.md §4.2 and
// issue [A1] for the exact definition this replicates.

import { agreementsCompatible, getComposedTable, normalizeSentence } from '../src/lessonLogic.js'

const TAGGED_FIELDS = ['sentences', 'negativeSentences']

// Flattens `sentences[tense][person]` (a bare string, a tagged
// `{ text, validFor }` object, or an array of either) into every tagged
// variant it contains, paired with its `tense`/`person`. Each entry is
// normalized via `normalizeSentence` (so bare strings and tagged objects are
// handled uniformly); entries whose `validFor` isn't an array are skipped —
// they're "not yet vetted", not "vetted as validFor: []".
function collectTaggedVariants(verb, field) {
  const variants = []
  const byTense = verb[field]
  if (!byTense) return variants
  for (const [tense, byPerson] of Object.entries(byTense)) {
    for (const [person, value] of Object.entries(byPerson ?? {})) {
      const entries = Array.isArray(value) ? value : [value]
      for (const entry of entries) {
        const normalized = entry === undefined ? undefined : normalizeSentence(entry)
        if (!normalized || !Array.isArray(normalized.validFor)) continue
        variants.push({ tense, person, text: normalized.text, validFor: normalized.validFor })
      }
    }
  }
  return variants
}

// Every gap slot in the verb set, as flat records: one per (host verb,
// field, tense, person, variant, gap verb W).
export function computeGapSlots(verbs) {
  const slots = []
  for (const hostVerb of verbs) {
    for (const field of TAGGED_FIELDS) {
      for (const variant of collectTaggedVariants(hostVerb, field)) {
        const { tense, person, text, validFor } = variant
        for (const gapVerb of verbs) {
          if (gapVerb.id === hostVerb.id) continue
          if (!agreementsCompatible(gapVerb.agreement, hostVerb.agreement)) continue
          const gapForm = getComposedTable(gapVerb, tense)?.[person]
          if (!gapForm) continue
          const hostForm = getComposedTable(hostVerb, tense)?.[person]
          if (gapForm === hostForm) continue
          if (validFor.includes(gapVerb.id)) continue
          slots.push({
            gapVerbId: gapVerb.id,
            hostVerbId: hostVerb.id,
            field,
            tense,
            person,
            text,
            gapForm,
            validFor,
          })
        }
      }
    }
  }
  return slots
}

// Per-verb gap-slot counts (`{ [verbId]: count }`) — the audit's baseline
// shape, keyed by the verb whose form would leak in as a false "wrong"
// distractor.
export function computeGapCounts(verbs) {
  const counts = {}
  for (const slot of computeGapSlots(verbs)) {
    counts[slot.gapVerbId] = (counts[slot.gapVerbId] ?? 0) + 1
  }
  return counts
}
