# Ambiguous multiple-choice distractors — audit

Like `docs/EXERCISE_VARIETY_PLAN.md`, this is a map of a problem, not a set of
decisions — it exists to capture an audit's findings before a fix is designed,
so the reasoning doesn't have to be redone. Once a remediation is chosen, log
it in `docs/DECISIONS.md` (and update/retire this doc).

## Status

Tracked by epic #115, split into three sub-issues:

- **#112 (Layer 1, mechanical literal-sentence-collision check) — done**, see
  `docs/DECISIONS.md` ("Excluded cross-verb distractors that collide with a
  sibling verb's own sentence template"). This resolves the `unit-2-review`
  `ukan`/`nahi` case described below.
- **#113 (Layer 2a, generate a triage list) — done.** `scripts/list-cross-candidates.mjs`
  enumerates every cross-verb substitution reachable via `getCrossVerbCandidates`/
  `generateCrossVerbQuestions`/`generateCaseMixerQuestions` across all `review: true`
  lessons (2101 entries as of 2026-06-13) and writes them as a checklist to
  `docs/CROSS_CANDIDATE_REVIEW.md`. **Next step (#114): a native speaker/maintainer
  ticks each entry's "both valid" or "wrong/ungrammatical" checkbox** — those ticks
  become the input for #114's curated `CROSS_CANDIDATE_EXCLUSIONS` table. Regenerate
  the doc with `node scripts/list-cross-candidates.mjs` after a `LESSONS`/`VERBS`
  change (re-triage only the new/changed entries). `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`
  groups the 2101 entries into 3 priority tiers (which verb pairs are most/least
  likely to need a "both valid" tick) — start there rather than reading in order.
  It also flags a likely *second* "both valid" pair beyond `ukan`/`nahi`/`eduki`/
  `ikusi`/`jakin`: `joan`↔`etorri` (shared allative adjunct, opposite direction —
  "Ane etxera dator." vs "Ane etxera doa." are both grammatical, different-meaning
  sentences).
- **#114 (Layer 2b/3, encode curated exclusions)** — **partially done**: the
  `ukan`↔`nahi` pair (both directions) is now encoded in
  `CROSS_CANDIDATE_EXCLUSIONS` (`src/lessonLogic.js`), prompted by a live
  in-the-wild report (the `nahi` `hura` sentence "Katuak esne pixka bat ___."
  offering `ukan`'s `du` as a distractor — see `docs/DECISIONS.md`,
  2026-06-13). The corresponding 20 `docs/CROSS_CANDIDATE_REVIEW.md` entries
  (1865-1872, 2090-2101) are ticked. The broader "different sentence text,
  both still valid" cases below (`eduki` vs `ukan`/`ikusi`, `jakin`'s `dakit`,
  `joan`↔`etorri`, etc.) remain blocked on the native-speaker triage above —
  see `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`.

## Summary

Learners are occasionally seeing multiple-choice questions where more than one
option is, on its own merits, a grammatically correct completion of the
sentence shown — just with a different meaning than the one the lesson is
testing. Picking the "other valid" option is marked wrong. This started after
the Exercise Variety Plan's four deliveries (all shipped 2026-06-13, see
`docs/EXERCISE_VARIETY_PLAN.md`/`docs/DECISIONS.md`), which widened review
lessons' option pools with cross-verb forms.

This is the *multiple-choice* sibling of the issue already fixed for typed
answers (`docs/DECISIONS.md`, "Excluded type-verb/type-negative for forms
ambiguous with another verb's form") — same underlying cause (Basque's
NOR-NORK transitive clause frame is shared across semantically unrelated
verbs), different surface (a *distractor* turns out to also be correct, rather
than the *typed answer* colliding with another verb's form).

## Mechanism: how "opening up more options" introduced this

Four places now mix one verb's conjugated forms into another verb's question,
gated only by `agreementsCompatible(a, b)` (`lessonLogic.js`) — which checks
*one* axis: does the sibling verb mark an ergative subject (`nork`) the same
way the source verb does (`nor` ↔ `nor`, `nor-nork` ↔ `nor-nork`)?

1. **`buildOptions`'s `extraCandidates`** (Delivery 1, widened by Delivery 4's
   `extraSources` fallback) — for review lessons, `sentence`/`negative`
   questions' distractor pool includes sibling sources' same-person forms
   (`getCrossVerbCandidates`).
2. **`generateCrossVerbQuestions`** (Delivery 2, `kind: 'verb-choice'`) —
   options are *only* the source's correct form plus compatible siblings'
   forms; "which verb fits this sentence" is the entire question.
3. **`generateCaseMixerQuestions`** (Delivery 3, `kind: 'case-mixer'`) — same
   shape as 2 but with the compatibility filter *inverted* (mixes `nor` with
   `nor-nork`).
4. **Delivery 4's `extraSources`/`extraSiblingSources`** — for reviews with
   <3 sources, broadens 1-3's sibling pool to *any* verb/tense introduced
   earlier in `LESSONS`, not just this review's own sources.

`agreementsCompatible` correctly prevents *case-marking* mismatches (e.g.
mixing `izan`'s `naiz` into an `ukan` sentence would need an ergative subject
`izan` doesn't have — genuinely broken Basque). What it doesn't check is
whether the sibling verb's *meaning* fits the sentence's frame at all.

## Root cause: the NOR-NORK transitive frame is syntactically uniform

Basque's basic transitive clause is "Subject(-k) [Object] Verb" regardless of
the verb's lexical meaning. `ukan` (have), `nahi` (want), `jakin` (know),
`eduki` (have/hold), `jan` (eat), `edan` (drink), `erosi` (buy), `ikusi` (see)
are **all** `agreement: ['nor', 'nork']` and **all** slot into this same frame.
So for almost any `"Nik [NP] ___."` sentence, swapping in *any* of these verbs'
same-person forms produces a grammatical sentence — the only question is
whether the resulting *meaning* is sensible (a different-but-valid sentence)
or absurd (a clearly-wrong distractor, which is what the original "same
table's other persons" distractors and `agreementsCompatible` were designed
around).

By contrast, the `nor`-only cluster (`izan`/`egon`/`joan`/`etorri`/`ari`/
`ibili`) each pairs with a *different* case-marked adjunct — `izan` with a
bare predicate nominal ("Ni irakaslea ___"), `egon` with a locative
("Ni etxean ___"), `joan`/`etorri` with an allative ("Ni hondartzara ___"),
`ari`/`ibili` with a progressive complement. Substituting another `nor` verb's
form there usually *does* produce a case-marking mismatch — a genuinely wrong
sentence, which is exactly the "classic learner mistake" `verb-choice`/
`case-mixer` are designed to test (per `EXERCISE_VARIETY_PLAN.md`'s intro
example, "Ni etxean naiz" vs "Ni etxean nago"). **The `nor` cluster is not the
problem** — the audit below found no clear "both valid" cases there.

## Confirmed examples (high confidence)

### `unit-2-review` (sources: `ukan`, `nahi`, `jakin` present — all `nor-nork`, all mutually `agreementsCompatible`)

- `ukan`'s `ni` sentence list (`src/data/verbs.js`) includes **`'Nik liburu bat ___.'`**
  (correct: `dut` → "I have a book").
- `nahi`'s `ni` sentence list **also includes the literal string
  `'Nik liburu bat ___.'`** (correct: `nahi dut` → "I want a book").
- When `ukan`'s question rolls that sentence, `getCrossVerbCandidates` can
  offer `nahi`'s `nahi dut` as a distractor — but `"Nik liburu bat nahi dut."`
  is exactly `nahi`'s own canonical example for that same sentence. Both
  `dut` and `nahi dut` are correct, common, differently-meant completions.
- Symmetric case in the other direction: `nahi`'s `'Nik kafe bat ___.'`
  (correct `nahi dut`) can offer `ukan`'s `dut` as a distractor —
  `"Nik kafe bat dut."` ("I have a coffee") is equally valid.

This is the clearest case in the data: two verbs share a literal sentence
string with two different, both-correct answers.

**Resolved by #114** (2026-06-13): `ukan`/`nahi` now mutually excluded via
`CROSS_CANDIDATE_EXCLUSIONS` — both the literal-template case above (also
covered by #112) and other-template instances (e.g. `nahi`'s `hura` sentence
"Katuak esne pixka bat ___.").

### `unit-8-review` / `unit-8-review-plural` (sources: `eduki`, `ibili` present — Delivery 4 fallback)

`eduki` (`nor-nork`) and `ibili` (`nor`) aren't `agreementsCompatible`, so they
don't cross-pollinate directly. But both reviews have only 2 sources, so
Delivery 4's `extraSources` (`getIntroducedSources`) adds every `nor-nork`
present-tense verb introduced earlier — `ukan`, `nahi`, `jakin`, `ikusi` — as
extra siblings for `eduki`'s questions.

- `eduki`'s `ni` sentence `'Nik giltza poltsikoan ___.'` (correct: `daukat` →
  "I have/hold the key in my pocket"). `ikusi`'s extra-candidate form
  `ikusten dut` substituted in gives `"Nik giltza poltsikoan ikusten dut."`
  ("I see the key in my pocket") — also a perfectly grammatical sentence.
- `eduki` vs `ukan` (`dut`) is the textbook case: `eduki` and `ukan` are
  near-synonyms for "to have" in Basque (`"Nik giltza poltsikoan dut."` reads
  as acceptable, if less idiomatic than `daukat`, to many speakers).

### `unit-9-review-*` (future-tense reviews)

The same verb clusters recur in future tense (`izango dut`/`nahiko dut`/
`jakingo dut`/`edukiko dut`/`ikusiko dut`/...) with the same `nor-nork`
sentence frames — expect the same pairs (`ukan`↔`nahi` at minimum) to produce
the same "both valid" distractors there too.

## Lower-confidence / needs native-speaker review

- `jakin`'s `dakit` substituted into `ukan`/`nahi`'s object sentences
  (`"Nik liburu bat dakit."`) is semantically odd ("I know a book") — likely
  reads as wrong to a learner, but `jakin` *can* take concrete objects
  idiomatically in some contexts, so it's not as clear-cut as the
  `ukan`↔`nahi`/`eduki` cases. Flagged but not confirmed.
- `jan`/`edan`/`erosi` aren't currently mixed into any review (they're only
  used in the non-`review` pooled `unit-10-present`/`-plural` lessons, which
  don't get `extraCandidates`/`verb-choice`/`case-mixer`). If a future review
  pools them, expect similar "X eats/drinks/buys the same object" overlaps
  (e.g. `"Nik kafea erosten dut."` "I buy coffee" vs `"Nik kafea edaten dut."`
  "I drink coffee" — both valid for the same object).

## Where this is *not* a problem

- `pronoun`/`type-pronoun` questions — `buildOptions(verb.pronouns, ...)`
  doesn't take `extraCandidates` (by design, see `generateQuestions`'s doc
  comment), so cross-verb forms never appear there.
- The `nor` cluster (`izan`/`egon`/`joan`/`etorri`/`ari`/`ibili`) — different
  verbs' sentence frames use mutually-exclusive case-marked adjuncts, so
  cross-verb substitutions there read as genuinely wrong Basque (the intended
  pedagogy), not as alternate-but-valid phrasings.
- Same-table "other persons" distractors (the original, pre-Variety-Plan
  design) — a person mismatch (`naiz` in a `hura` sentence) is unambiguously
  wrong regardless of verb.

## Possible remediation directions (none decided)

- **Curated exclusion pairs**: maintain a small list of `nor-nork` verb pairs
  known to share a frame closely enough that their forms are mutually valid
  in each other's sentences (`ukan`↔`nahi`, `ukan`↔`eduki`, `eduki`↔`ikusi` at
  minimum per the above) and exclude each from the other's
  `getCrossVerbCandidates`/`collectCrossSourceCandidates` pools. Smallest
  diff, but needs maintenance as new verbs/sentences are added.
- **Per-sentence "frame" tag**: tag each `sentences[tense][person]` entry (or
  each verb) with a coarse semantic frame (possession / desire / knowledge /
  consumption / perception / ...) and only mix cross-candidates across
  *different* frames for `nor-nork` verbs — mirroring how the `nor` cluster's
  distinct adjunct types already provide this separation "for free".
- **Tighten `agreementsCompatible` itself** for `nor-nork` verbs specifically
  (it's currently a no-op there, since they're all `['nor','nork']`) using
  whichever of the above groupings is chosen.

Any of these would need a quick correctness pass (similar to
`docs/EXERCISE_VARIETY_PLAN.md` Delivery 3's task 3.1) confirming the *exclusion*
itself doesn't remove legitimately-wrong, useful distractors — the goal is
narrowly removing the both-valid cases, not reverting Deliveries 1-4's variety
gains wholesale.
