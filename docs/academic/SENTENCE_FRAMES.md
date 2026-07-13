# Sentence frames — the `validFor` schema

Design doc for epic #127's per-sentence `validFor` tag, which replaces the
pair-level `agreementsCompatible` + `CROSS_CANDIDATE_EXCLUSIONS` +
`sentenceTemplatesCollide` system (#112-114) for deciding when a sibling
verb's same-person conjugated form can appear as a multiple-choice option
(`sentence`/`negative`/`verb-choice`/`case-mixer`) without making the question
have more than one defensibly-correct answer.

This is a **pure design/documentation issue (#122)** — no `src/` runtime or
`src/data/verbs.js` data changes here. It unblocks #123 (reimplement
candidate selection around `validFor`) and #124 (backfill `validFor` across
`VERBS`).

**Status: epic #127 complete.** #123 (candidate-selection rewrite), #124
(`validFor` backfill across the `nor-nork` cluster), #125 (`etorri`'s
frameless-sentence rewrite), and #126 (retiring `CROSS_CANDIDATE_EXCLUSIONS`/
`isCrossCandidateExcluded`/`scripts/list-cross-candidates.mjs`/
`docs/CROSS_CANDIDATE_REVIEW.md`/`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`/
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`) have all landed — see `docs/DECISIONS.md`.
The sections below describe the schema as designed and remain the reference
for `validFor`'s meaning and call sites; the "needs to"/"#123 should..."
phrasing throughout reflects the original design-time framing and is kept for
historical context.

## Why per-sentence, not per-pair

`CROSS_CANDIDATE_EXCLUSIONS` answers "can verb A's form ever stand in for verb
B's form?" — a single yes/no/conditional per *pair*. That's both too broad and
too narrow:

- **Too broad**: `ukan`↔`nahi`/`eduki`/`ikusi` are excluded *everywhere*
  because `'Nik liburu bat ___.'` ("book") makes `dut`/`nahi dut`/`daukat`/
  `ikusten dut` all read naturally. But `ukan`'s `'Nik denbora ___.'` ("time")
  almost certainly doesn't make `nahi`/`ikusi` equally natural — "Nik denbora
  nahi dut" ("I want time") and "Nik denbora ikusten dut" ("I see time") are
  much weaker than their "book" counterparts. A pair-level exclusion can't
  tell these sentences apart.
- **Too narrow**: `etorri`'s `'Hura orain ___.'` ("He/she/it now ___.") has no
  destination, location, or predicate — `da` (izan), `dago` (egon), `doa`
  (joan), and `dator` (etorri) are *all* grammatical completions, even though
  none of those verbs' sentence tables literally share this string with
  `etorri` (so `sentenceTemplatesCollide` misses it) and the `nor` cluster
  isn't in `CROSS_CANDIDATE_EXCLUSIONS` at all (it was believed safe *because*
  each verb's sentences normally carry a distinguishing adjunct — this variant
  doesn't).

Both gaps share a root cause: correctness depends on **the specific sentence**
(or the absence of a disambiguating adjunct in it), not on the verb pair. So
the unit of judgment moves from "verb pair" to "sentence variant".

## Schema

Today, `sentences[tense][person]` (and `pronounSentences`/`negativeSentences`
entries) is either a plain string or an array of phrasing-variant strings,
consumed via `pickVariant`:

```js
sentences: {
  present: {
    ni: ['Ni irakaslea ___.', 'Ni ikaslea ___.', 'Ni aita ___.'],
    zu: 'Zu kalean ___.',
  },
}
```

### New shape: `{ text, validFor }` per variant

Each variant becomes an object — a bare string stays valid (see "Migration
compatibility" below), but the canonical/tagged form is:

```js
sentences: {
  present: {
    ni: [
      { text: 'Ni irakaslea ___.', validFor: [] },
      { text: 'Ni etxera ___.', validFor: ['joan'] },
    ],
    zu: { text: 'Zu kalean ___.', validFor: [] },
  },
}
```

- `sentences[tense][person]` is still either a single variant or an array of
  variants — only what a *variant* looks like changes (string → `{ text,
  validFor }`).
- `validFor` is a `string[]` of **verb ids** (matching `VERBS[].id` — not
  abstract "frame" names like "locative"/"allative". Verb ids are what
  `agreementsCompatible`, `CROSS_CANDIDATE_EXCLUSIONS`, and `VERBS.find` calls
  already key on, and an abstract frame vocabulary would be an extra
  indirection layer with its own maintenance burden for no benefit).
- The sentence's own verb is never listed in its own `validFor` — it's
  implicit (the `correct` answer is always the source verb's form).
- **`validFor: []` (explicitly empty) is the strong, useful, common case**: no
  `agreementsCompatible` sibling's same-person form is an acceptable
  completion of this exact sentence, so it's safe to draw cross-verb
  candidates from *and* a maximally-discriminating `verb-choice`/`case-mixer`
  source. (An *absent* `validFor` — a not-yet-tagged bare string — means the
  opposite; see "Migration compatibility" below.)
- `pronounSentences`/`negativeSentences` entries get the same `{ text,
  validFor }` shape, for consistency and so the contract is uniform across all
  three sentence-bearing fields — see "Fields that don't consume `validFor`
  yet" below for why `pronounSentences`' tag is currently inert.

### Migration compatibility (bare strings) — and why "absent" ≠ `[]`

#123 lands the candidate-selection rewrite *before* #124 backfills `validFor`
across `VERBS` — so for a transitional period, most variants are still bare
strings (no `validFor` key at all). Critically, **an absent `validFor` is not
the same as `validFor: []`** — they're opposite ends of the exclusion range:

- **`validFor: []`** (explicitly tagged, empty) — "no sibling is *also*
  valid here". Nothing gets excluded: every `agreementsCompatible` sibling's
  same-person form remains eligible as a distractor / `verb-choice` option.
  This is the maximally-discriminating, fully-vetted state (see `egon`'s
  `'Ni etxean ___.'` worked example below).
- **`validFor` absent** (a bare string, or an object with no `validFor` key —
  not yet reached by #124's backfill) — "not yet vetted". The **safe
  default** treats this as if *every* `agreementsCompatible` sibling were
  listed, i.e. **all** cross-verb candidates are excluded, falling back to
  same-table-only distractors (the pre-Exercise-Variety-Plan floor). Never
  "fail open" into offering an unvetted sibling form just because nothing
  says it's invalid yet.

```js
function normalizeSentence(value) {
  if (value === undefined) return undefined
  if (typeof value === 'string') return { text: value } // validFor: absent
  return value // { text, validFor } — validFor may or may not be present
}

// Candidate filter: `validFor` is the *picked* variant's tag (possibly
// `undefined`). `candidates` is this person's agreement-compatible sibling
// forms (see `getCrossVerbCandidates`).
function filterExtraCandidates(candidates, validFor) {
  if (!candidates || validFor === undefined) return []
  return candidates.filter(({ verbId }) => !validFor.includes(verbId)).map((c) => c.form)
}
```

`pickVariant` should pick a variant (string or object) and the caller
normalizes it, so `pickVariant` itself doesn't need to know about the new
shape — see the call-site list below for where normalization needs to be
inserted.

### Alternative considered and rejected: parallel `sentenceValidFor` lookup

An alternative is to leave `sentences` as plain strings and add a parallel
`sentenceValidFor[tense][person][index]` array, indexed in lockstep with
`sentences[tense][person]`.

**Rejected**: index-based parallel arrays are fragile — adding, removing, or
reordering a phrasing variant in `sentences` silently desyncs the indices in
`sentenceValidFor`, and nothing would catch this beyond a coverage test
re-deriving the mistake. Co-locating `validFor` with the sentence text it
describes means a sentence and its tag are edited together and can never
drift apart. The `{ text, validFor }` shape costs one extra key per variant in
exchange for that guarantee.

## What `validFor` means

> A sibling verb id `S` belongs in a sentence's `validFor` if and only if
> substituting `S`'s same-person, same-tense conjugated form into this exact
> sentence's blank produces a sentence a native speaker would accept as a
> **natural, correct completion** — not merely grammatically parseable, but a
> sentence they'd actually consider right for this context, just expressing
> something different from the intended (tagging verb's) answer.

This is the same "naturalness" bar #114's pair-level triage already used
(`docs/CROSS_CANDIDATE_REVIEW.md`'s "both valid" vs "wrong/ungrammatical"
ticks) — `validFor` just applies it per sentence instead of per pair.

## Resolving `'always'` vs `'verb-choice-only'`

`CROSS_CANDIDATE_EXCLUSIONS` had two tiers:

- `'always'` — excluded from both `extraCandidates` (same-table-style
  distractors for `sentence`/`negative`/`form`) and `verb-choice`/`case-mixer`
  candidate pools.
- `'verb-choice-only'` — still allowed in `extraCandidates`, but excluded from
  `verb-choice`/`case-mixer` (reasoning: "which verb fits this sentence" is
  the whole question there, so an also-valid sibling makes it unanswerable —
  whereas as one-of-four `extraCandidates` options it was considered an
  acceptable "right shape, wrong verb" distractor).

**Decision: one `validFor` field, consumed identically by both contexts.** If
sibling `S` is in a sentence's `validFor`, `S`'s same-person form is excluded
as a distractor for **both** `extraCandidates` (the `sentence`/`negative`
kinds — `form` is already exempted entirely, #121) **and**
`verb-choice`/`case-mixer` candidate collection, for that sentence.

**Why the two-tier split goes away:** "is `S`'s form also a correct
completion of *this sentence*" is a single yes/no fact about the sentence —
it can't be "yes, but only let it surface in some question kinds and not
others". The old `'verb-choice-only'` tier was a workaround for not having
per-sentence granularity: at the pair level, *some* of a verb's sentences
might tolerate a sibling's form as a harmless distractor while others
wouldn't, so the pair-level table picked the more permissive tier to avoid
losing variety everywhere. With `validFor` decided per sentence, that
trade-off disappears — a sentence where `S`'s form is genuinely "also valid"
gets `S` in `validFor` (excluded everywhere); a sentence where it's a
genuinely-wrong distractor doesn't, and `S`'s form is fair game for
`extraCandidates` *and* `verb-choice`/`case-mixer` alike.

**No information is lost**: as of this writing, every entry in
`CROSS_CANDIDATE_EXCLUSIONS` is `'always'` — the `'verb-choice-only'` tier has
zero entries (see the `src/lessonLogic.js` table). Dropping the tier doesn't
require remapping any existing data.

**Self-limiting for `verb-choice`/`case-mixer` sources**: a sentence with
"too many" valid siblings (e.g. `etorri`'s `'Hura orain ___.'`, where every
`nor`-cluster verb's form fits) naturally stops being usable as a
`verb-choice`/`case-mixer` *source* without any special-casing —
`collectCrossSourceCandidates` already skips a source/person when zero
siblings remain after filtering; if literally every `agreementsCompatible`
sibling is in `validFor`, the distractor pool is empty and the source is
skipped, same as a single-source review today. #125 separately rewrites
`etorri`'s frameless variants so they're useful sources again, but #123's
filtering logic doesn't need to know that's coming.

## Fields that don't consume `validFor` yet

- **`pronounSentences`**: `pronoun`/`type-pronoun` questions build `options`
  from `verb.pronouns` (declined pronouns), not `verb.conjugations` — and
  per the original audit (and #121's `form` fix), they don't receive
  cross-verb `extraCandidates` at all. So a `pronounSentences` entry's
  `validFor` would currently have no reader. It's still part of the schema
  (for the "uniform contract across all three sentence-bearing fields"
  acceptance criterion, and in case a future change wants `pronoun` to mix
  cross-verb pronoun forms), but #123/#124 don't need to populate it
  meaningfully — `validFor: []` (or omitted) on every `pronounSentences` entry
  is fine and changes nothing.
- **`negativeSentences`**: *does* get consumed — `negative`/`type-negative`
  keep `extraCandidates` (#121 only exempted `form`), so `negativeSentences`
  entries need real `validFor` tagging in #124, same as `sentences`.

## Migration mapping from `CROSS_CANDIDATE_EXCLUSIONS`

`CROSS_CANDIDATE_EXCLUSIONS`'s 10 confirmed `'always'` pairs (`docs/DECISIONS.md`,
"#114") are a **prior for #124's backfill worklist**, not a blanket
carry-over:

| Pair | Carry-over rule for #124 |
| --- | --- |
| `ukan`↔`nahi`, `eduki`↔`ukan`, `eduki`↔`ikusi`, `ukan`↔`ikusi`, `jakin`↔`ikusi`, `ikusi`↔`nahi`, `jakin`↔`nahi`, `eduki`↔`nahi` | For each of `ukan`'s/`eduki`'s/etc. `sentences[tense][person]` entries, check **per sentence** whether the sibling's same-person form is a natural completion of *that* sentence's object/context (e.g. "liburu bat" → yes for most of this cluster; "denbora"-like sentences → likely no, see worked example below). Add the sibling to `validFor` only where it checks out. |
| `jan`↔`erosi`, `edan`↔`erosi` | Same per-sentence check — "eat/drink X" vs "buy X" likely holds for most concrete-food/drink objects, but still check each sentence rather than assuming. |
| `joan`↔`etorri` | Per-sentence check for the *allative* (`-ra`, "to X") sentences specifically — see the `etorri`/`'Ni etxera ___.'` worked example. `etorri`'s frameless sentences (`'Hura orain ___.'` etc.) are out of scope for `validFor` tagging — #125 rewrites them instead. |

The 3 pairs #114 checked and confirmed **genuinely wrong** (`ukan`↔`jakin`,
`eduki`↔`jakin`, `jan`↔`edan`) need no `validFor` entries — #124 doesn't need
to re-litigate these; they simply stay untagged (`validFor` absent, the safe
default) for the relevant sentences.

A pair not in `CROSS_CANDIDATE_EXCLUSIONS` at all (e.g. anything in the `nor`
cluster) isn't exempt from review — it just means #114 never checked it
because `sentenceTemplatesCollide` + "the `nor` cluster's sentences carry
distinguishing adjuncts" seemed sufficient at the time. #124's coverage test
(see that issue) is what actually enforces every sentence gets a `validFor`
decision, regardless of whether its pair was ever in
`CROSS_CANDIDATE_EXCLUSIONS`.

## Worked examples

### `nor` cluster

**1. `egon`'s `'Ni etxean ___.'` (present, `ni`) → `validFor: []`**

"Etxean" is the locative `-an` ("at home"). `egon`'s `nago` ("I am [located]
at home") is the natural reading. Substituting `naiz` (izan), `noa` (joan), or
`nator` (etorri) — "Ni etxean naiz/noa/nator" — doesn't work: `izan` doesn't
take a bare locative complement this way, and `joan`/`etorri` need an
allative (`-ra`/`-tik`), not a locative, for "go/come at home" to make sense.
No `nor`-cluster sibling fits → `validFor: []`. Maximally discriminating: safe
as a `extraCandidates` anchor and a `verb-choice`/`case-mixer` source.

**2. `etorri`'s `'Ni etxera ___.'` (present, `ni`) → `validFor: ['joan']`**

"Etxera" is the allative `-ra` ("to home"). `etorri`'s `nator` ("I'm coming
home") and `joan`'s `noa` ("I'm going home") are *both* grammatical — same
adjunct, opposite direction of motion, different meaning (confirmed Tier-2
finding, `docs/DECISIONS.md` "#114"). `egon`'s `nago` and `izan`'s `naiz`
don't fit an allative the way `joan`/`etorri` do → `validFor: ['joan']` only.

**3. `etorri`'s `'Hura orain ___.'` (present, `hura`) → not eligible at all**

No adjunct (no destination, location, or predicate) — `da` (izan), `dago`
(egon), `doa` (joan), and `dator` (etorri) are *all* grammatical. Every `nor`
verb fits, so there's no useful `validFor` to write (it would have to list
every other `nor`-cluster sibling, leaving zero distractors). **This sentence
variant shouldn't exist in the data as-is** — flagged here for #125, which
rewrites it (and any other frameless `etorri` variants) to carry a
discriminating adjunct, e.g. `'Hura orain etxera ___.'` →
`validFor: ['joan']`, following example 2's pattern.

### `nor-nork` cluster

**4. `ukan`'s `'Nik liburu bat ___.'` (present, `ni`) → `validFor: ['nahi', 'eduki', 'ikusi']`**

A book is a concrete, ownable, visible object — `dut` ("I have a book"),
`nahi dut` ("I want a book"), `daukat` ("I'm holding a book"), and `ikusten
dut` ("I see a book") are all natural completions, per #114's Tier 1
"confirmed both valid" findings. → `validFor: ['nahi', 'eduki', 'ikusi']`.

**5. `ukan`'s `'Nik denbora ___.'` / `'Guk denbora ___.'` (present) → `validFor: ['eduki']` only — illustrative, sentence does not exist in `VERBS` yet**

"Time" doesn't behave like "book": `dut` ("I have time") and `daukat` ("I
have/hold time") both read fine, but `nahi dut` ("I want time") and `ikusten
dut` ("I see time") are odd/non-idiomatic — "denbora nahi dut" doesn't mean
what an English speaker might guess ("I want [some] time" isn't how Basque
expresses that), and "denbora ikusten dut" is nonsensical. → `validFor:
['eduki']`, **not** `['nahi', 'eduki', 'ikusi']` — contrast with example 4
despite both sentences belonging to `ukan` and both pairs (`ukan`↔`nahi`,
`ukan`↔`ikusi`) being `'always'`-excluded today. This is the core
improvement `validFor` makes over a pair-level table: the *same verb pair*
gets different verdicts depending on the sentence's object. (This exact
sentence isn't in `ukan`'s `sentences.present.ni`/`.gu` yet — included purely
to illustrate the contrast; #124 may add it as a real entry or may not.)

## Call sites assuming a sentence is a plain string

Complete enumeration for #123, which needs to insert `normalizeSentence`
(or equivalent) at each point a `sentences`/`pronounSentences`/
`negativeSentences` entry is read, and update each `validFor`-relevant
filtering site:

### `src/lessonLogic.js`

- **`pickVariant`** — picks one variant (string or, after #123, possibly `{
  text, validFor }`) from a `string | T | (string | T)[]`. Stays
  shape-agnostic; callers normalize.
- **`buildQuestion`** (inside `generateQuestions`):
  - `const sentence = pickVariant(sentences[person])` — needs
    `normalizeSentence`; `question.sentence` (set on `sentence`/`type-verb`/
    `spot-error`/`negative`/`type-negative`/`pronoun`/`type-pronoun` question
    objects) must stay a **plain string** (`.text`) — `validFor` is consumed
    here, not forwarded to the question object.
  - `const negativeSentence = pickVariant(negativeSentences[person])` — same.
  - `const pronounSentence = verb.pronouns && pronounSentences[person]` — not
    currently run through `pickVariant` at all (no array support for
    `pronounSentences` today); needs `normalizeSentence` for shape
    consistency even though its `validFor` is inert (see "Fields that don't
    consume `validFor` yet").
  - The `extra = extraCandidates?.[person]` candidates passed to
    `buildOptions` for `sentence`/`negative` need filtering by the *current
    question's* sentence's `validFor` — this is the core rewire (#123).
- **`buildSpotErrorQuestion`** — `pickVariant(sentences[candidate]).replace('___',
  form)`. Needs `normalizeSentence(...).text.replace('___', form)`. `validFor`
  isn't relevant here (spot-error doesn't draw cross-verb candidates).
- **`sentenceTemplatesCollide`** — reads `verbA.sentences?.[tenseA]?.[person]`/
  `verbB...`, comparing literal template arrays. **Removed in #123**,
  superseded by `validFor` lookups (a sentence now directly states which
  siblings it tolerates, no need to detect literal collisions).
- **`isCrossCandidateExcluded`** / **`CROSS_CANDIDATE_EXCLUSIONS`** — **removed
  in #126** once #123/#124/#125 land (tracked separately so #123 can land
  first with both old and new mechanisms briefly coexisting if needed, per
  that issue's call).
- **`getCrossVerbCandidates`** — for each `person`, currently calls
  `sentenceTemplatesCollide(verb, tense, siblingVerb, siblingTense, person)`
  and `isCrossCandidateExcluded(verb.id, siblingVerb.id, 'extra-candidates')`
  to decide whether to include `siblingVerb.conjugations[siblingTense]?.[person]`.
  #123 replaces both checks with: normalize `verb.sentences?.[tense]?.[person]`
  (the *anchor* sentence for this candidate set — see note below on which
  sentence "owns" the check), and exclude `siblingVerb.id` if it's in that
  sentence's `validFor`.
  - **Open question for #123**: `getCrossVerbCandidates` computes one
    `extraCandidates[person]` list shared across *all* of a verb's sentence
    variants for that person (it doesn't know which variant `buildQuestion`
    will `pickVariant` later). If different variants for the same person have
    different `validFor` (e.g. `etorri`'s `hura` has both `'Hura etxera ___.'`
    → `validFor: ['joan']` and, post-#125, other variants with different/no
    `validFor`), a single shared `extraCandidates[person]` can't reflect a
    per-variant exclusion. #123 needs to either (a) move the `validFor` filter
    into `buildQuestion` (after `pickVariant` has chosen the actual sentence),
    computing `extraCandidates` unfiltered and filtering at use-time, or (b)
    take the union/intersection of all variants' `validFor` as a
    conservative bound. (a) is more precise (matches "ambiguity is a property
    of the specific sentence shown") and is the recommended direction, but
    #123 should confirm against `buildOptions`'s call sites.
- **`collectCrossSourceCandidates`** (shared by `generateCrossVerbQuestions`/
  `generateCaseMixerQuestions`) — `const sentence = sentences[person]` (used
  for both the truthiness check and, via `pickVariant(sentence)`, the
  question's displayed sentence), plus the `sentenceTemplatesCollide`/
  `isCrossCandidateExcluded` filters on `siblings`. #123 replaces the filter
  with a `validFor` check against the **picked** variant (this function
  already calls `pickVariant` once per source/person, so there's a single
  concrete sentence to check against — no shared-across-variants ambiguity
  here, unlike `getCrossVerbCandidates`).
- **`buildFlagDiagnostics`** — `question.sentence` is read as a plain string
  (`...(question.sentence ? { sentence: question.sentence } : {})`). Unaffected
  as long as `question.sentence` stays a plain string per the `buildQuestion`
  note above.

### `src/App.jsx`

- **`flagQuestionSummary`** — `question.sentence` and
  `question.items.map((item) => item.sentence)` (spot-error). Both already
  plain strings by the time they reach here (post-`.replace`/post-`pickVariant`
  normalization) — unaffected.
- **`SentenceWithBlank`** (rendered via `<SentenceWithBlank sentence={question.sentence} />`)
  — consumes `question.sentence` as a plain string with a literal `___` to
  split on. Unaffected as long as `question.sentence` stays a plain string.

### `src/logic.test.js`

Many fixtures construct `sentences: { present: { ni: 'Ni irakaslea ___.' } }`
as bare strings. Per "Migration compatibility" above, a bare string now means
`validFor` *absent* (the safe default, excluding all cross-verb candidates) —
**not** `validFor: []`. Fixtures whose tests assert non-empty
`extraCandidates`/`crossVerbQuestions`/`caseMixerQuestions` results need their
`sentences` updated to `{ text, validFor: [] }` for #123 to land without
regressing those assertions; fixtures that don't depend on cross-verb
candidates can stay as bare strings. #123's new tests additionally add
`{ text, validFor: [...] }` fixtures to cover the exclusion cases, and #124's
backfill is a separate, incremental data change to `src/data/verbs.js`.

## Infinitive-complement sentences (`behar`) — resolved (#267/#288, confirmed #367)

`behar` ("need to / have to") is the one verb in `VERBS` whose complement is
an **infinitive verb phrase** ("Joan behar dut" = "I have to go"), not an
object noun — so the noun-object `validFor` reasoning above (§"What `validFor`
means", the `ukan`↔`nahi`/`eduki`/`ikusi` worked examples) doesn't apply to it
as written. This was flagged as an open question in #148 and resolved when
`behar`'s `present`/`past`/`future` sentences were authored (#267/#288):

- **The blank is always the trailing auxiliary token only**, placed
  immediately after the infinitive (`'Nik gaur arratsaldean etxera joan
  ___.'`). The conjugated answer (`behar dut`, `beharko zuen`, ...) already
  supplies the modal particle, so the template never repeats `behar`/`beharko`
  before the blank (#288 — writing it twice produced `'... behar behar
  dute.'`).
- **`validFor: []` throughout, with no exceptions to date.** An infinitive
  complement has no `nor-nork` noun-object sibling whose form actually fits
  the sentence (`nahi`/`eduki`/`ikusi`'s sibling-checking logic is about
  *object nouns*, which don't apply here), and `ukan` itself is excluded by
  construction rather than by `validFor`: `behar`'s trailing auxiliary is
  textually identical to `ukan`'s bare form for the same person/tense (`dut`,
  `zuen`, ...), so offering `ukan` as a distractor would just be a duplicate
  of the correct answer, not a wrong one.
- **No new data shape was needed** — `behar`'s sentences use the same
  `{ text, validFor }` per-variant shape as every other verb; only the
  *content* (where the blank sits, what `validFor` evaluates to) differs from
  a noun-object verb's.
- The subject pronoun is always written explicitly in `behar`'s sentence
  text (`'Nik ...'`, `'Zuk ...'`, ...), same as the rest of `VERBS`'s
  sentence bank — this isn't a special rule for infinitive complements, just
  the existing house style, and it happens to sidestep any pro-drop ambiguity
  (e.g. a dropped subject leaving more than one modal/tense grammatically
  possible) before it can come up.

This pattern doesn't need to extend anywhere else: `behar` only has
`present`/`past`/`future` (no `potential`/`baldintza`/`conditional`/
`imperative` tenses), and `izan`/`ukan`'s own `potential`/`baldintza`/
`conditional`/`imperative` tenses are ordinary synthetic forms with the verb's
usual `nor` (`izan`) or `nor-nork` (`ukan`) agreement and no infinitive
complement at all (`naiteke` = "I can be", `banintz` = "if I were", `nuke` =
"I would have", ...) — writing their sentences is just regular noun-object
(`ukan`)/predicate-nominal (`izan`) authoring under the existing `validFor`
scheme already used for those verbs' `present`/`past`/`future`, no new design
decision required.

## Follow-up issues

- **#123** — reimplement `getCrossVerbCandidates`/`collectCrossSourceCandidates`
  filtering around `validFor` per the call-site list above; remove
  `sentenceTemplatesCollide`.
- **#124** — backfill `validFor` across `VERBS`' `sentences`/
  `pronounSentences`/`negativeSentences`, using the migration mapping above as
  a worklist, plus a coverage test (every sentence variant has an explicit
  `validFor` decision, even if `[]`).
- **#125** — rewrite `etorri`'s (and any other) frameless sentence variants
  (worked example 3) to carry a discriminating adjunct.
- **#126** — remove `CROSS_CANDIDATE_EXCLUSIONS`, `isCrossCandidateExcluded`,
  `scripts/list-cross-candidates.mjs`, `docs/CROSS_CANDIDATE_REVIEW.md`,
  `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`, `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`.
