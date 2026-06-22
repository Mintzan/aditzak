#!/usr/bin/env node
// Native-speaker sentence review generator (#316, part of epic #310).
//
// Turns a batch of VERBS' tagged sentences into a plain-language markdown
// checklist a non-technical native speaker can fill in directly — no
// `validFor`, no person keys, no JS. See docs/SENTENCE_FRAMES.md for the
// `validFor` schema this feeds, and docs/DECISIONS.md (#316) for why the
// report looks the way it does.
//
// Workflow (documented here per the issue's "Done when" — this is the
// canonical place to look, not just the issue thread):
//   1. Generate a report for the batch under review (this script).
//   2. The reviewer opens the .md file and ticks checkboxes / writes notes —
//      no tooling needed, any text/markdown editor works.
//   3. The *implementer* (not the reviewer) translates the marked-up file
//      back into data changes:
//      - "¿Es natural?" ticked No, with a correction note → fix the sentence
//        text (or, if the targeted form itself is wrong, the conjugation
//        table — that's a docs/LANGUAGE_DECISIONS.md-tier call, out of scope
//        for this script per the issue's scope boundary).
//      - Each ticked alternative → add that alternative's verb id to the
//        sentence's `validFor` array. Unticked alternatives stay excluded
//        (`validFor` already defaults to listing nothing for them).
//
// Scope note: the "gloss" the issue's worked example shows is a full
// sentence translation ("Hura medikua da." -> "(Él/ella es médico/a.)").
// VERBS has no per-sentence translation field (only `meaning` per verb), so
// generating that exactly isn't possible from existing data without a new
// data field — out of scope here. Instead each entry glosses the verb form
// itself via `meaning[lang]`, which is enough for a native speaker reading
// the Basque sentence directly; full sentence translation is left as a
// possible future extension if per-sentence glosses get added to VERBS.
//
// Usage:
//   node scripts/generate-sentence-review.mjs
//   node scripts/generate-sentence-review.mjs --verbs izan,egon,ukan
//   node scripts/generate-sentence-review.mjs --verbs jarraitu --lang eu
//   node scripts/generate-sentence-review.mjs --verbs izan --out docs/reviews/foo.md
//   node scripts/generate-sentence-review.mjs --verbs izan --limit 3   # first N variants/verb (spot-check sample)

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { VERBS, TENSE_META, PERSON_LABEL_KEYS } from '../src/data/verbs.js'
import { agreementsCompatible, normalizeSentence } from '../src/lessonLogic.js'
import { TRANSLATIONS } from '../src/i18n/translations.js'

const TAGGED_FIELDS = ['sentences', 'negativeSentences']
const DEFAULT_BATCH = ['izan', 'egon', 'ukan']

function parseArgs(argv) {
  const args = { verbs: DEFAULT_BATCH, lang: 'es', out: null, batch: null, limit: null }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--verbs') args.verbs = argv[i + 1].split(',').map((id) => id.trim())
    if (argv[i] === '--lang') args.lang = argv[i + 1]
    if (argv[i] === '--out') args.out = argv[i + 1]
    if (argv[i] === '--batch') args.batch = argv[i + 1]
    if (argv[i] === '--limit') args.limit = Number(argv[i + 1])
  }
  return args
}

// Every tagged sentence variant for a verb, in stable VERBS-authoring order —
// mirrors scripts/validforGapAudit.mjs's collectTaggedVariants, but keeps
// untagged (bare-string / missing-validFor) entries too, since a review's
// whole point can be deciding their validFor for the first time.
function collectVariants(verb) {
  const variants = []
  for (const field of TAGGED_FIELDS) {
    const byTense = verb[field]
    if (!byTense) continue
    for (const [tense, byPerson] of Object.entries(byTense)) {
      for (const [person, value] of Object.entries(byPerson ?? {})) {
        const entries = Array.isArray(value) ? value : [value]
        for (const entry of entries) {
          if (entry === undefined) continue
          const normalized = normalizeSentence(entry)
          variants.push({
            field,
            tense,
            person,
            text: normalized.text,
            validFor: normalized.validFor,
          })
        }
      }
    }
  }
  return variants
}

function fillBlank(text, form) {
  return text.replace('___', `**${form}**`)
}

function personLabel(person, lang) {
  const key = PERSON_LABEL_KEYS[person]
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.es[key] ?? person
}

function tenseLabel(tense, lang) {
  const meta = TENSE_META[tense]
  if (!meta) return tense
  return TRANSLATIONS[lang]?.[meta.labelKey] ?? meta.basque
}

const COPY = {
  es: {
    title: (label) => `## Repaso de frases — ${label}`,
    sectionNegative: '(frase negativa)',
    frase: (n, tense, person) => `### Frase ${n} · ${tense} · "${person}"`,
    sentenceLabel: '**Frase:**',
    glossLabel: (form, meaning) => `*(forma resaltada **${form}**: ${meaning})*`,
    naturalQ: '¿Es natural y correcta? ☐ Sí ☐ No',
    formQ: (form) => `¿La forma resaltada (**${form}**) es la correcta aquí? ☐ Sí ☐ No`,
    altsQ: (meaning) => `¿Se podría decir también, con el mismo sentido de "${meaning}", con…?`,
    altsHint: '*(marca solo las que de verdad valdrían)*',
    notes: 'Notas / corrección: ____________________',
    noAlts: '*(no hay otras formas con la misma estructura gramatical que puedan sustituirla)*',
  },
  eu: {
    title: (label) => `## Esaldien errepasoa — ${label}`,
    sectionNegative: '(esaldi ezeztatua)',
    frase: (n, tense, person) => `### ${n}. esaldia · ${tense} · "${person}"`,
    sentenceLabel: '**Esaldia:**',
    glossLabel: (form, meaning) => `*(nabarmendutako forma **${form}**: ${meaning})*`,
    naturalQ: 'Naturala eta zuzena da? ☐ Bai ☐ Ez',
    formQ: (form) => `Nabarmendutako forma (**${form}**) zuzena da hemen? ☐ Bai ☐ Ez`,
    altsQ: (meaning) => `Beste honela ere esan liteke, "${meaning}" esanahi berarekin…?`,
    altsHint: '*(benetan balio luketenak markatu soilik)*',
    notes: 'Oharrak / zuzenketa: ____________________',
    noAlts: '*(ez dago egitura gramatikal bera duen forma ordezkagarririk)*',
  },
}

function buildVerbSection(verb, lang, limit) {
  const copy = COPY[lang] ?? COPY.es
  const meaning = verb.meaning?.[lang] ?? verb.meaning?.es ?? verb.verb
  const lines = [copy.title(`${verb.verb.toUpperCase()} (${meaning})`), '']

  const allVariants = collectVariants(verb)
  const variants = limit ? allVariants.slice(0, limit) : allVariants
  variants.forEach((variant, index) => {
    const { field, tense, person, text } = variant
    const form = verb.conjugations[tense]?.[person]
    if (!form) return

    const candidates = VERBS.filter(
      (other) =>
        other.id !== verb.id &&
        agreementsCompatible(other.agreement, verb.agreement) &&
        other.conjugations[tense]?.[person] &&
        other.conjugations[tense][person] !== form,
    )

    lines.push(copy.frase(index + 1, tenseLabel(tense, lang), personLabel(person, lang)))
    if (field === 'negativeSentences') lines.push(copy.sectionNegative)
    lines.push(copy.sentenceLabel, fillBlank(text, form))
    lines.push('', copy.glossLabel(form, meaning))
    lines.push('', `- ${copy.naturalQ}`, `- ${copy.formQ(form)}`)
    lines.push(`- ${copy.altsQ(meaning)}`, `  ${copy.altsHint}`)
    if (candidates.length === 0) {
      lines.push(`  - ${copy.noAlts}`)
    } else {
      for (const candidate of candidates) {
        const candidateForm = candidate.conjugations[tense][person]
        const candidateMeaning = candidate.meaning?.[lang] ?? candidate.meaning?.es ?? candidate.verb
        lines.push(`  - ☐ ${fillBlank(text, candidateForm)} — ${candidate.verb} (${candidateMeaning})`)
      }
    }
    lines.push(`- ${copy.notes}`, '')
  })

  return lines.join('\n')
}

export function buildReport(verbIds, lang, limit = null) {
  const verbs = verbIds.map((id) => {
    const verb = VERBS.find((v) => v.id === id)
    if (!verb) throw new Error(`Unknown verb id: ${id}`)
    return verb
  })
  return verbs.map((verb) => buildVerbSection(verb, lang, limit)).join('\n\n')
}

const args = parseArgs(process.argv.slice(2))
const batchName = args.batch ?? args.verbs.join('-')
const outPath = args.out ?? `docs/reviews/sentence-review-${batchName}.md`

const report = buildReport(args.verbs, args.lang, args.limit)
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${report}\n`)
console.log(`Wrote ${outPath} (${args.verbs.length} verb(s), lang=${args.lang})`)
