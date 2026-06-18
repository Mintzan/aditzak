// Shared object-class model for the validFor frame-tagging spike ([A3]/#225,
// adopted with changes as a second-pass audit by [A4]/#239 — see
// docs/OBJECT_FRAME_TAGGING.md). Read-only: nothing here writes
// `src/data/verbs.js`. Used by both `frame-derive-diff.mjs` (the original
// spike's diff report) and `validfor-delta-audit.mjs`'s `--classes` mode, so
// the two stay in lock-step by construction.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { agreementsCompatible, normalizeSentence } from '../src/lessonLogic.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

// Sentence-text → class mapping for all tagged core-cluster sentences.
export function loadFrameClasses() {
  return JSON.parse(readFileSync(join(__dirname, 'frame-classes.json'), 'utf8'))
}

export const FRAME_CLASSES = loadFrameClasses()

export const TAGGED_FIELDS = ['sentences', 'negativeSentences']

// Flattens `sentences[tense][person]` (a bare string, a tagged
// `{ text, validFor }` object, or an array of either) into every tagged
// variant it contains. Same flattening shape as
// `scripts/validforGapAudit.mjs`'s `collectTaggedVariants` (kept separate
// since that one isn't exported).
export function collectTaggedVariants(verb, field) {
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

// The class-derived `validFor` for `hostVerb`'s sentence of the given
// `className`, `tense`/`person` — admitted class members minus `hostVerb`
// itself, filtered to agreement-compatible siblings with a conjugated form
// for that tense/person. Returns `null` for an unknown class.
export function deriveValidFor(hostVerb, tense, person, className, verbs) {
  const admitted = CLASS_ADMISSION[className]
  if (!admitted) return null
  const derived = []
  for (const candidateId of admitted) {
    if (candidateId === hostVerb.id) continue
    const candidateVerb = verbs.find((v) => v.id === candidateId)
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

// Per-verb diff report (`{ [verbId]: { exact, adds, removes, unmapped, samples } }`)
// — the original [A3] spike's report shape, used by `frame-derive-diff.mjs`.
export function computeClassDiff(verbs) {
  const report = {}
  for (const hostVerb of verbs) {
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
        const derived = deriveValidFor(hostVerb, tense, person, className, verbs)
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

// Flat candidate-fix rows for [A4]'s `--classes` audit mode: one row per
// (host sentence, missing sibling) the class model would add to `validFor`,
// plus the list of tagged sentences with no `frame-classes.json` entry
// (`unmapped`) so newly-added sentences are visible rather than silently
// skipped.
export function computeClassCandidateSlots(verbs) {
  const slots = []
  const unmapped = []
  for (const hostVerb of verbs) {
    const classMap = FRAME_CLASSES[hostVerb.id]
    if (!classMap) continue
    for (const field of TAGGED_FIELDS) {
      for (const variant of collectTaggedVariants(hostVerb, field)) {
        const { tense, person, text, validFor } = variant
        const className = classMap[text]
        if (!className) {
          unmapped.push({ hostVerbId: hostVerb.id, field, tense, person, text })
          continue
        }
        const derived = deriveValidFor(hostVerb, tense, person, className, verbs)
        if (!derived) continue
        for (const addVerbId of derived) {
          if (validFor.includes(addVerbId)) continue
          const addVerb = verbs.find((v) => v.id === addVerbId)
          const addForm = addVerb.conjugations[tense]?.[person]
          slots.push({ hostVerbId: hostVerb.id, field, tense, person, text, className, addVerbId, addForm })
        }
      }
    }
  }
  return { slots, unmapped }
}
