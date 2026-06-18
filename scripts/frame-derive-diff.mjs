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
// Usage:
//   node scripts/frame-derive-diff.mjs            # summary counts per host verb
//   node scripts/frame-derive-diff.mjs --samples   # + a few example diffs per verb
//   node scripts/frame-derive-diff.mjs --json      # machine-readable full report

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { VERBS } from '../src/data/verbs.js'
import { agreementsCompatible, normalizeSentence } from '../src/lessonLogic.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRAME_CLASSES = JSON.parse(readFileSync(join(__dirname, 'frame-classes.json'), 'utf8'))

// Canonical admitted-verb-set per object class — see docs/OBJECT_FRAME_TAGGING.md
// §"Object-class vocabulary" for the reasoning behind each set.
export const CLASS_ADMISSION = {
  'concrete-ownable': ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'],
  'food-drink': ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar', 'jan', 'edan'],
  kinship: ['ukan', 'nahi', 'eduki'],
  'abstract-ownable': ['ukan', 'nahi', 'eduki', 'behar'],
  'inanimate-subject-possession': ['eduki'],
  'non-agentive-subject': ['ukan', 'nahi', 'eduki', 'ikusi'],
  'animate-object': ['ukan', 'nahi'],
  'abstract-referent': ['ukan', 'nahi', 'eduki', 'erosi', 'jakin'],
  'possession-in-hand': ['ukan', 'ikusi'],
  'takeable-action': ['behar'],
  'fact-answer': ['ikusi', 'nahi'],
  'secret-knowledge': ['nahi', 'ukan'],
  'path-object': ['ikusi'],
  'directional-destination': ['etorri'],
  'directional-origin': ['joan'],
  'verb-complement': [],
  'predicate-nominal': [],
  location: [],
  'scenery-no-frame': [],
}

const TAGGED_FIELDS = ['sentences', 'negativeSentences']

// Same flattening shape as scripts/validforGapAudit.mjs's collectTaggedVariants
// (kept separate/inlined here since that one isn't exported).
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

function deriveValidFor(hostVerb, tense, person, className) {
  const admitted = CLASS_ADMISSION[className]
  if (!admitted) return null
  const derived = []
  for (const candidateId of admitted) {
    if (candidateId === hostVerb.id) continue
    const candidateVerb = VERBS.find((v) => v.id === candidateId)
    if (!candidateVerb) continue
    if (!agreementsCompatible(candidateVerb.agreement, hostVerb.agreement)) continue
    const candidateForm = candidateVerb.conjugations[tense]?.[person]
    if (!candidateForm) continue
    derived.push(candidateId)
  }
  return derived
}

// Compares two id arrays as sets; returns `{ adds, removes }` (ids the class
// model would add/remove relative to the hand-tagged `validFor`).
function diffSets(derived, actual) {
  const derivedSet = new Set(derived)
  const actualSet = new Set(actual)
  const adds = [...derivedSet].filter((id) => !actualSet.has(id))
  const removes = [...actualSet].filter((id) => !derivedSet.has(id))
  return { adds, removes }
}

export function computeFrameDiffReport() {
  const report = {} // { [verbId]: { exact, adds, removes, unmapped, samples: [...] } }
  for (const hostVerb of VERBS) {
    const classMap = FRAME_CLASSES[hostVerb.id]
    if (!classMap) continue
    const entry = { exact: 0, adds: 0, removes: 0, unmapped: 0, samples: [] }
    for (const field of TAGGED_FIELDS) {
      for (const variant of collectTaggedVariants(hostVerb, field)) {
        const { tense, person, text, validFor } = variant
        const className = classMap[text]
        if (!className) {
          entry.unmapped += 1
          continue
        }
        const derived = deriveValidFor(hostVerb, tense, person, className)
        const { adds, removes } = diffSets(derived, validFor)
        if (adds.length === 0 && removes.length === 0) {
          entry.exact += 1
        } else {
          if (adds.length > 0) entry.adds += 1
          if (removes.length > 0) entry.removes += 1
          if (entry.samples.length < 5) {
            entry.samples.push({ field, tense, person, text, class: className, validFor, derived, adds, removes })
          }
        }
      }
    }
    report[hostVerb.id] = entry
  }
  return report
}

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
const report = computeFrameDiffReport()

if (args.includes('--json')) {
  console.log(JSON.stringify(report, null, 2))
} else {
  printSummary(report, args.includes('--samples'))
}
