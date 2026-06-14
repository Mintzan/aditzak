#!/usr/bin/env node
// One-off research script — NOT part of `npm test`/`npm run build`.
//
// Enumerates every cross-verb form substitution reachable through the
// Exercise Variety Plan's distractor pools (`getCrossVerbCandidates` for the
// `sentence`/`negative`/`form` kinds, `generateCrossVerbQuestions`/
// `generateCaseMixerQuestions` for the `verb-choice`/`case-mixer` kinds) across
// every review lesson in `LESSONS`, and writes `docs/CROSS_CANDIDATE_REVIEW.md`
// as a checklist for a native speaker/maintainer to mark each substitution as
// "both valid" (exclude) or "wrong" (keep as a distractor).
//
// This is Layer 2a of the remediation plan in
// `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` (GitHub issue #113) — it produces the
// input for Layer 2b (#114, the curated `CROSS_CANDIDATE_EXCLUSIONS` table).
// It doesn't change any runtime behaviour; `src/lessonLogic.js` is only
// imported from, never modified.
//
// Regenerate after a `LESSONS`/`VERBS` change with:
//   node scripts/list-cross-candidates.mjs

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { LESSONS } from '../src/data/lessons.js'
import { VERBS } from '../src/data/verbs.js'
import {
  agreementsCompatible,
  generateCaseMixerQuestions,
  generateCrossVerbQuestions,
  getCrossVerbCandidates,
  getIntroducedSources,
} from '../src/lessonLogic.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'docs', 'CROSS_CANDIDATE_REVIEW.md')

const findVerb = (verbId) => VERBS.find((v) => v.id === verbId)

// Running multiple passes widens coverage of `generateCrossVerbQuestions`/
// `generateCaseMixerQuestions`, whose underlying `collectCrossSourceCandidates`
// caps each (verb, tense, person)'s sibling pool at 3 random distractors per
// call — a single pass could miss a sibling when more than 3 are eligible.
const PASSES = 25

// key: `${template}|||${subForm}` -> entry
const entries = new Map()

function templatesFor(verb, tense, person) {
  const value = verb.sentences?.[tense]?.[person]
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function describeVerb(verb) {
  return `${verb.id} (${verb.meaning?.en ?? '?'})`
}

function addEntry({ template, ownVerb, ownTense, ownForm, subVerb, subTense, subForm, foundIn }) {
  const key = `${template}|||${subForm}`
  let entry = entries.get(key)
  if (!entry) {
    entry = {
      template,
      ownVerb,
      ownTense,
      ownForm,
      subVerb,
      subTense,
      subForm,
      foundIn: new Set(),
    }
    entries.set(key, entry)
  }
  entry.foundIn.add(foundIn)
}

for (const lesson of LESSONS) {
  if (!lesson.review) continue
  const sources = lesson.sources
  const extraSources = sources.length < 3 ? getIntroducedSources(LESSONS, lesson.id) : []

  // --- Part A: extraCandidates pool (sentence/negative/form distractors) ---
  for (const { verbId, tense } of sources) {
    const verb = findVerb(verbId)
    const candidates = getCrossVerbCandidates(verb, tense, sources, VERBS, extraSources)
    const persons = lesson.persons ?? Object.keys(candidates)

    const known = new Set(sources.map((s) => `${s.verbId}:${s.tense}`))
    const siblingPool = [...sources, ...extraSources.filter((s) => s.tense === tense && !known.has(`${s.verbId}:${s.tense}`))].filter(
      (s) => !(s.verbId === verb.id && s.tense === tense),
    )

    for (const person of persons) {
      const forms = candidates[person]
      if (!forms) continue
      const templates = templatesFor(verb, tense, person)
      if (templates.length === 0) continue
      const ownForm = verb.conjugations[tense]?.[person]

      for (const form of forms) {
        const sibling = siblingPool.find((s) => {
          const sibVerb = findVerb(s.verbId)
          return sibVerb && agreementsCompatible(sibVerb.agreement, verb.agreement) && sibVerb.conjugations[s.tense]?.[person] === form
        })
        const subVerb = sibling ? findVerb(sibling.verbId) : null
        for (const template of templates) {
          addEntry({
            template,
            ownVerb: verb,
            ownTense: tense,
            ownForm,
            subVerb: subVerb ?? { id: '?', meaning: {} },
            subTense: sibling?.tense ?? tense,
            subForm: form,
            foundIn: `${lesson.id} (extra candidate)`,
          })
        }
      }
    }
  }

  // --- Part B: verb-choice / case-mixer pools ---
  const resolvedSources = sources.map(({ verbId, tense }) => ({ verb: findVerb(verbId), tense }))
  const extraSiblingSources = extraSources.map(({ verbId, tense }) => ({ verb: findVerb(verbId), tense }))
  const allSiblingSources = [...resolvedSources, ...extraSiblingSources]

  for (const [kind, generate] of [
    ['verb-choice', generateCrossVerbQuestions],
    ['case-mixer', generateCaseMixerQuestions],
  ]) {
    for (let pass = 0; pass < PASSES; pass += 1) {
      const questions = generate(resolvedSources, { persons: lesson.persons, extraSiblingSources, count: 1000 })
      for (const question of questions) {
        const anchorVerb = findVerb(question.verbId)
        for (const option of question.options) {
          if (option === question.correct) continue
          const sibling = allSiblingSources.find(
            (s) => !(s.verb.id === anchorVerb.id && s.tense === question.tense) && s.verb.conjugations[s.tense]?.[question.person] === option,
          )
          addEntry({
            template: question.sentence,
            ownVerb: anchorVerb,
            ownTense: question.tense,
            ownForm: question.correct,
            subVerb: sibling?.verb ?? { id: '?', meaning: {} },
            subTense: sibling?.tense ?? question.tense,
            subForm: option,
            foundIn: `${lesson.id} (${kind})`,
          })
        }
      }
    }
  }
}

function renderEntry(entry, index) {
  const own = entry.template.replace('___', entry.ownForm)
  const sub = entry.template.replace('___', entry.subForm)
  const foundIn = [...entry.foundIn].sort().join(', ')
  return `### ${index}. \`${entry.ownVerb.id}\` (${entry.ownTense}) vs \`${entry.subVerb.id}\` (${entry.subTense})

- Template: \`${entry.template}\`
- ${describeVerb(entry.ownVerb)} — correct: \`${entry.ownForm}\` → "${own}"
- ${describeVerb(entry.subVerb)} — substitute: \`${entry.subForm}\` → "${sub}"
- Found in: ${foundIn}
- [ ] Both readings are valid Basque — exclude \`${entry.subVerb.id}\` from \`${entry.ownVerb.id}\`'s pool (and consider the reverse direction too)
- [ ] Substitution reads as wrong/ungrammatical — keep as a distractor
`
}

const sorted = [...entries.values()].sort((a, b) => {
  if (a.ownVerb.id !== b.ownVerb.id) return a.ownVerb.id.localeCompare(b.ownVerb.id)
  if (a.subVerb.id !== b.subVerb.id) return a.subVerb.id.localeCompare(b.subVerb.id)
  return a.template.localeCompare(b.template)
})

const header = `# Cross-candidate substitution review

Generated by \`scripts/list-cross-candidates.mjs\` — see
\`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md\` and GitHub issue #113 for context. Each
entry below is a sentence template (from \`sentences[tense][person]\`) where a
sibling verb's same-person conjugated form could appear as a multiple-choice
distractor (via \`getCrossVerbCandidates\`, \`generateCrossVerbQuestions\`, or
\`generateCaseMixerQuestions\`).

For each entry, tick **one** of the two checkboxes:

- **"Both readings are valid Basque"** — the substituted sentence is also
  grammatical, just with a different meaning than the lesson intends (e.g.
  "I have a book" vs "I want a book" for the same template). This is exactly
  the ambiguity \`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md\` describes — these pairs
  become entries in #114's \`CROSS_CANDIDATE_EXCLUSIONS\` table.
- **"Substitution reads as wrong/ungrammatical"** — the substituted sentence
  is a genuinely incorrect/odd Basque sentence, i.e. a good distractor. No
  action needed.

The \`(verb meaning)\` hints come from each verb's general \`meaning.en\` in
\`src/data/verbs.js\`, not a translation of the specific sentence — judge the
actual sentence, not just the verb gloss.

Regenerate with \`node scripts/list-cross-candidates.mjs\` after a
\`LESSONS\`/\`VERBS\` change (this file is a snapshot, not auto-generated on
every run).

**2101 entries is a lot to read in order** — see
\`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md\` for a priority grouping (which verb
pairs are most/least likely to need a "both valid" tick) before diving in.

---

`

const body = sorted.map((entry, index) => renderEntry(entry, index + 1)).join('\n')

writeFileSync(OUTPUT_PATH, header + body)
console.log(`Wrote ${sorted.length} entries to ${path.relative(process.cwd(), OUTPUT_PATH)}`)
