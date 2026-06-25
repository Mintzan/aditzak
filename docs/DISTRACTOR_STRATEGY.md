# Distractor & ambiguity strategy

**Status: current/authoritative — planning doc.** Consolidates the direction
for how multiple-choice distractors are chosen and how question ambiguity is
avoided. Written to give future sessions the *full picture* in one place, so
the same questions don't get re-opened one bug report at a time. Supersedes
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` (deleted in #126) as the standing
methodology reference; the per-sentence `validFor` *schema* still lives in
`docs/SENTENCE_FRAMES.md` and is unchanged by this doc.

This doc records a **direction and the evidence for it**. The direction has
now been implemented end-to-end — Epics #220 (Family A), #221 (Family B), and
#222 (Family C) are all closed; see "Decisions (resolved)" at the bottom for
the per-fork outcomes and the issues that landed them. It remains the standing
record so the families and their rationale don't have to be reconstructed from
scratch next time.

---

## 1. The three problem families

Roughly 30 issues have touched distractors/ambiguity. They look like one topic
but are actually **three distinct problems** that share the `buildOptions`
pipeline — which is why fixes to one keep surfacing as regressions in another.
Future work should name which family it's in.

### Family A — Ambiguity / false-negative distractors
*Offering a form that is also a correct completion, then marking it wrong.*

- Issues: #112–#115 (pair-level exclusions), the `validFor` epic #122–#127,
  content top-ups #124, #155, #204, and **#218.1** (`behar` missing from a
  `validFor` list).
- Architecture: replaced pair-level `CROSS_CANDIDATE_EXCLUSIONS` with
  per-sentence `validFor` tags (see `docs/SENTENCE_FRAMES.md`). This was a
  decisive improvement and is **the part of the system that is working** — do
  not rebuild it.
- Recurring failure mode: `validFor` is hand-curated and **point-in-time**.
  Adding a verb does not revisit earlier verbs' `validFor` lists, so the new
  verb's form can be wrongly offered as a "wrong" distractor on a sentence it
  actually completes. The #124 coverage test checks every sentence *has* a
  `validFor` decision — not that the decision is *complete* against the current
  verb set. Result: the same class of gap surfaces as a user-reported bug, one
  verb at a time (#155 erosi, #204 jakin/ukan, #218.1 behar).

### Family B — Distractor leakage into ungrounded contexts
*A borrowed sibling form or a deliberate lure appears where there is no
sentence (or no visible verb name) to make it read as wrong.*

- Issues: #121 → #139 → #174 → #200 → #203 → **#227 ([B2]), which retired the
  gates below.**
- This was **one bug fixed repeatedly**, each fix adding another *context
  gate* rather than fixing the abstraction:
  - #139 added small-table borrowing (`getBorrowedDistractors`).
  - #174 scoped borrowing to a review's `sources`.
  - #200 introduced `reviewScoped`, keyed on `sources.length > 1`.
  - #203 added an explicit `review` flag because `sources.length > 1` missed
    single-source reviews, and also gated `formLures` the same way.
  - Root cause (pre-#227): once a borrowed form or a lure landed in
    `options`, it was a bare string — indistinguishable from a safe
    same-table distractor. Every context (`form` vs `sentence`, review vs
    practice, single vs multi-source) had to *re-derive* "is a cross-verb
    form safe here?" via an accreting pile of conditionals (`reviewScoped`,
    `borrowPool`, `sources`, gated `formLures`).
- **#227 fix:** replaced all of the above with one invariant — `grounded`
  (`buildTaggedOptions`/`buildOptions`'s new boolean param). A question kind
  with a sentence or visible verb name to anchor correctness (`sentence`,
  `negative`, `pronoun`) is `grounded: true`; a bare `kind: 'form'` question
  (no sentence, no visible verb name under any caller) is always
  `grounded: false`, regardless of `sources`/review-vs-practice — when
  `false`, `buildTaggedOptions` ignores `extraCandidates`/`borrowPool`/
  `priorityCandidates` entirely and draws distractors only from the verb's
  own table. `sources`-based scoping is gone; `getBorrowedDistractors` itself
  is also unscoped again (borrows from every `agreementsCompatible` sibling,
  #139's original behaviour) since grounding is now the only gate that
  matters. As a side effect, `getBorrowedDistractors` now returns
  `{ verbId, form }` (not bare strings) so a `sentence`/`negative` question's
  borrowed pool can be narrowed by `filterExtraCandidates`'s `validFor` check
  exactly like `extraCandidates` already was — closing the leak where a
  borrowed form bypassed `validFor` even though `extraCandidates` didn't.

### Family C — Lure quality / pedagogy
*The deliberate-trap side: case-frame, cross-tense, object-number lures.*

- Issues: #141, #165, #177, and **#218.3** is a genuine *gap* here (not a bug).
- Sound design, honestly scoped (`docs/EXERCISE_ENGINE.md`'s Distractor Engine
  Matrix; #177 documents what was deliberately *not* built).
- Two open weaknesses, both visible in #218:
  - **Legibility (#218.2):** a fair-but-hard lure is indistinguishable from a
    broken question when the question shows neither verb name nor sentence
    (bare `kind: 'form'` in reviews). The player can't tell, and neither can a
    maintainer triaging the report.
  - **Coverage (#218.3):** the most pedagogically valuable distractor is
    sometimes *structurally excluded*. For `ari izan` (progressive), the error
    learners actually make is confusing it with the base verb's plain present
    (`jaten ari naiz` vs `jaten dut`) — but the borrow pool is restricted to
    `agreementsCompatible` siblings, and `jan` (nor-nork) is excluded from
    `ari`'s (nor) pool, so that distractor can never appear.

---

## 2. Are we going in circles?

**Not on the data model.** `validFor` was the right call; `SENTENCE_FRAMES.md`
makes the case convincingly and it holds up. A strategy change that rips it out
would discard the one part that works.

**Yes on two process/abstraction points:**
- **Family A content completeness** has no mechanical guard, so gaps ship and
  are found by users one at a time.
- **Family B eligibility** is gated by accreting context flags instead of being
  carried with the distractor, so each new context rediscovers the same leak.

---

## 3. Sizing evidence (the calibration run)

A read-only audit (2026-06-17) measured the **completeness-review surface**:
for every *tagged* sentence variant, how many `agreementsCompatible` sibling
verbs have a distinct same-person form that is *not* listed in its `validFor`
(i.e. are currently asserted to be wrong distractors). Method replicated
`agreementsCompatible` (`lessonLogic.js:497` — `nork`-match AND `nori`-match)
and the `sentences`/`negativeSentences` variant shapes; `pronounSentences`
excluded (its `validFor` is inert).

Findings:

- **898** tagged sentence-variants; **3,969** total "gap slots"; **all 21**
  verbs have ≥1.
- **An absolute completeness lint is a dead end.** 3,969 is not a backlog — it
  is essentially "every cross-verb distractor that exists," and most are
  *correctly* wrong distractors. A naive "compatible verb not in `validFor`"
  scan is ~all noise.
- **The burden is structural — driven by agreement-cluster size, not
  recency.** Top counts: `edan` 372 (pre-#124), `hartu` 372 (post-#124),
  `jan` 363, `ibili` 369, `behar` 293, then the rest of the `nor`/`nor-nork`
  cluster at 168–267. The small dative clusters are far lower: `gustatu`/
  `iruditu`/`ahaztu` 48 each, `esan`/`eman` 16 each. A verb joining the
  ~16-member `nor-nork` cluster creates ~300–370 review slots; a verb joining a
  2–3 member dative cluster creates dozens.
- **The raw count cannot distinguish bug-density from review-surface.**
  `edan`/`jan`'s ~370 are mostly *correct* distractors (hosted by `ukan`'s
  non-food sentences — "I drink a book" is rightly wrong). But `behar`'s 293
  samples land on semantically-*close* `ukan` sentences ("liburu bat",
  "txartel bat") where `behar` is plausibly valid ("need a book/ticket") — so
  `behar` is likely broadly under-tagged, and **#218.1 is one visible symptom
  of a larger `behar` gap.** Telling these apart needs naturalness judgment per
  slot; no metric substitutes for it.

Implication: the per-add cost for **core-cluster** verbs is hundreds of
judgments and recurs every time such a verb is added. The dative tail is cheap.
The right response is **not uniform** across the verb set.

---

## 4. Direction

Keep `validFor` and the Distractor Matrix. Add four things, split by where the
cost actually is.

### 4.1 Family A — split tagging by cluster
- **Small dative clusters** (`esan`/`eman`, `gustatu`/`iruditu`/`ahaztu`):
  manual `validFor` + a *delta* checklist at verb-add time is genuinely cheap
  (dozens of items). Keep as-is.
- **Core `nor`/`nor-nork` cluster:** evaluate **frame-derived tagging**.
  Classify each sentence's object/context *once* by class (e.g.
  concrete-ownable / abstract-ownable / food-drink / kinship / location-bound /
  fact-answer) and define a small **verb × object-class admission table**;
  *derive* `validFor` from it instead of hand-listing verb ids per sentence.
  This turns "N verbs × M sentences" into "M sentences classified once + one
  small table," so a new core-cluster verb becomes one table row, not ~300
  individual judgments.
  - `SENTENCE_FRAMES.md` explicitly *rejected* an abstract-frame layer in
    2024 ("extra indirection for no benefit"). The §3 sizing is the cost
    evidence that justifies revisiting that decision **for the core cluster
    only** — the original rejection was made without it.

### 4.2 Family A — a *delta* audit, not an absolute one
The useful audit is run **when a verb/tense is added**: list only the tagged
sentences where the *new* verb's same-person form would now be offered as a
distractor, for a quick yes/no naturalness pass. (Absolute scans are noise per
§3.) This is what would have caught #218.1 the day `behar` landed. If 4.1's
frame-derived tagging is adopted for the core cluster, the delta audit's core
role shrinks to "does this verb's row in the admission table look right" plus a
spot-check; for the dative tail it stays the primary guard.

### 4.3 Family B — type distractors by provenance, enforce grounding once
Carry `{ form, source: 'same-table' | 'sibling' | 'lure' }` through the
pipeline. Replace the `reviewScoped` / `borrowPool` / gated-`formLures`
conditionals with **one invariant** in `buildOptions`: `sibling`/`lure`
distractors require a grounding sentence; bare `form` questions get same-table
only. This collapses the #174→#200→#203 patches into a single rule and
pre-empts the next variant of the same leak.

### 4.4 Family C — make lures legible, and allow targeted lures
- **Legibility (#218.2):** stop showing bare `form` questions in reviews that
  render neither verb name nor sentence; at minimum always show the verb name.
  Add post-answer "why this was wrong" feedback for lures ("`naiz` marks *I*,
  but the subject here is plural"). The error-categorization metadata for this
  is already sketched as Tier-4 in `docs/EXERCISE_ENGINE.md`.
- **Coverage (#218.3):** allow **hand-authored targeted lures** for specific
  confusable pairs where the most valuable distractor is excluded by
  `agreementsCompatible` (e.g. `ari izan`'s progressive vs. the base verb's
  plain present). This is a Matrix extension, consistent with #141/#165, not a
  borrow-pool change.

---

## 5. Decisions (resolved)

The four forks from §4, with their outcomes:

1. **Frame-derived tagging for the core cluster (4.1)** — resolved by the [A3]
   spike (`docs/OBJECT_FRAME_TAGGING.md` / `scripts/frame-classes.json`):
   adopted **with changes** as a second-pass *audit* tool ([A4]/#239,
   `--classes` mode below), not as automatic `validFor` derivation — some
   sentences need human judgment a fixed object class can't express. The spike
   also surfaced a real bug — food-drink under-tagging on `jan`/`edan`/`erosi`
   (#240 [A5]).
2. **Delta audit (4.2)** — **done (#231):** `scripts/validfor-delta-audit.mjs`
   + `validforGapAudit.mjs` + the CI guard `src/validfor-audit.test.js`. See
   the "Tooling" section for the verb-add workflow.
3. **Provenance-typed distractors (4.3)** — **done (#232 [B1] + #235 [B2]):**
   the accreted `reviewScoped`/`borrowPool`/gated-`formLures` conditionals are
   replaced by the single `grounded` invariant in `buildTaggedOptions`. See §1
   Family B for the mechanism.
4. **Lure legibility + targeted lures (4.4)** — **done:** review `form`
   questions show the verb name (#233 [C1]); post-answer "why this was wrong"
   feedback for lures (#229 [C2]); and the targeted `ari izan` progressive-vs-
   plain lure via `baseVerb`-tagged sentences (#238 [C3]).

## 6. Known content debt

- **`behar` under-tagging** — **actioned (#224 [A2]):** `behar` backfilled
  across the `nor-nork` cluster's ownable-object sentences (incl. #218.1's
  "Gurasoek etxea ___.").
- **food-drink under-tagging on `jan`/`edan`/`erosi`** — surfaced by the #237
  spike (finding #1); tracked in **#240 [A5]**. **Resolved** — confirmed via
  #439's investigation (2026-06-25) that `jan`/`edan`/`erosi`'s food/drink
  sentences already carry the full `[ukan, nahi, eduki, ikusi, erosi/jan/edan,
  behar]` sibling set. The only remaining `--classes` candidates for these
  three are `jan`<->`edan` cross-suggestions (e.g. "Nik sagarra ___" ("I eat
  an apple") suggesting `edan` ("drink") as a valid substitute) — these are a
  known false positive of the `food-drink` class (it doesn't distinguish
  solid food from drink within the class; see `docs/OBJECT_FRAME_TAGGING.md`)
  and should **not** be applied. `#240` can be closed as already resolved.
  The same #439 pass found and fixed one genuine small gap nearby: `ukan`'s
  "Nik/Guk bilera bat ___." ("I/we [have] a meeting") was missing `nahi`
  ("I/we want a meeting") despite every other sentence in that
  `abstract-ownable`-class block already carrying it — a plain oversight, not
  a class-model judgment call. The remaining `--classes` worklist (2 items:
  `ikusi`'s "Txakurrak katua ___." -> `ukan`) is left untouched, per
  `docs/OBJECT_FRAME_TAGGING.md`'s own note that this exact sentence is a
  documented fine-grained judgment call, not a bug.
- **#439's 15/104 verb backfill**: investigated 2026-06-25 — the "core"
  cluster (`izan, egon, ukan, nahi, jakin, joan, etorri, jan, edan, erosi,
  ikusi, eduki, hartu, behar` plus `eraman, ekarri, gustatu, ahaztu`) is
  already thoroughly tagged; the remaining 89 verbs split cleanly into four
  categories with different work needed, tracked as separate issues rather
  than one mega-backfill: **#454** (14 `nor`-only intransitive verbs, mostly
  a verification pass — no object frame to substitute into, same as
  `izan`/`egon`), **#455/#456/#457/#458** (52 `nor-nork` verbs split into 4
  reviewable batches by semantic cluster), **#459** (17 dative-tail
  `nor-nori(-nork)` verbs, which need dative-role matching, not just
  agreement matching). 6 further "untagged" ids (`maite`,
  `itxaron-dative`/`utzi-dative`/`adierazi-dative`/`eskatu-dative`/
  `galdetu-dative`) have zero `sentences` entries of their own — no backfill
  applies to them at all, they're conjugation-table-only variants.
- **#454, resolved (2026-06-25):** reviewed all 14 `nor`-only intransitive
  verbs (`izan, egon, ahal-izan, ezin-izan, ari, ibili, sartu, atera, hasi,
  bizi-izan, erori, jaiki, ados-egon, arriskuan-jarri`) — confirmed each has
  `agreement: ['nor']` only (no object frame to substitute into). 12 of the
  14 already carried `validFor: []` throughout, and manual review found no
  genuine cross-verb sibling for any of them (each is a distinct frame:
  identity, location, ability/inability, motion-into/out-of, inceptive,
  residence, falling, waking, agreement-with-someone, danger). `ari`/`ibili`
  were the two real findings: both had entirely *untagged* sentences (bare
  strings — "not yet vetted", not "vetted empty"), so this was tagging work,
  not pure verification. `ari` came back `validFor: []` throughout (its
  blank always carries an embedded activity participle marking the
  progressive-aspect frame itself, distinct from any sibling's sense). For
  `ibili`, the `kalean`/`lanean` variants got a genuine sibling: "kalean
  ibili" ("to be out and about") and "lanean ibili" ("to be busy/working")
  are standard Basque idioms where `egon`'s same-person form also correctly
  completes those exact blanks — so those specific variants (on both `egon`
  and `ibili`) now list each other in `validFor`; every other locative/
  manner variant on either verb (etxean, oinez, parkean, ...) isn't a fixed
  idiom shared with the other verb, so stayed `[]`. Baseline regenerated
  accordingly (the gap surface also widened mechanically for every other
  `nor`-only verb, since `ari`/`ibili` going from untagged to vetted-empty
  makes them newly visible as gap-candidates in everyone else's slots — not
  a content change on those verbs, just the audit now seeing them).
- **#455, resolved (2026-06-25):** backfilled `validFor` on batch 1 of the
  `nor-nork` cluster — the 9 modal/request/completion verbs `behar,
  ahal-ukan, ezin-ukan, eskatu, galdetu, adierazi, bukatu, amaitu, gainditu`.
  `behar`/`ahal-ukan`/`ezin-ukan` cross-tagged each other on `present` only
  (the only tense `ahal-ukan`/`ezin-ukan` have): all three share the exact
  "[infinitive clause] + invariant particle + auxiliary" shape, so each
  one's auxiliary substitutes cleanly into the others' sentence text.
  `eskatu` (request-an-object verb) got per-object tagging with `ukan`/
  `eduki`/`behar` broadly, `nahi` on `present` only (no `past` table), and
  `ikusi`/`erosi` only where the object is concretely visible/buyable.
  `galdetu` (ask-for-information verb) needed a different sibling set
  entirely (`jakin`/`ikusi`, not the ownable-things cluster) since its
  objects are pieces of information, not things; its `gu` sentence keeps a
  unique dative argument ("to a hiker") that blocks every sibling, so it
  stays `validFor: []`. `adierazi` (express/state an opinion) got `ukan`/
  `eduki` on the 3 objects where an "have an opinion/intention/doubt"
  reading is natural Basque (`iritzia`/`asmoa`/`zalantza`); the other 3
  (`protesta`/`babesa`/`poztasuna`) don't support a "have" collocation, so
  stayed `[]`. `bukatu`/`amaitu` are near-total synonyms ("finish") and got
  a full mutual cross-tag on every sentence, both tenses. `gainditu`
  ("pass"/"overcome") was reviewed but left untagged — its overlap with
  `bukatu`/`amaitu` is inconsistent per-object (works for `azterketa`/
  `maratoia`, fails for `gidabaimena`/`kontratua`/`lan-txanda`) and too
  marginal to tag without native-speaker confirmation; tracked as open debt
  below. Two further debt items surfaced and were deliberately left out of
  scope for #455: (1) `nahi` is a genuine semantic fit for the
  `behar`/`ahal-ukan`/`ezin-ukan` infinitive-complement sentences but wasn't
  retroactively cross-tagged onto them, since `nahi`'s own `validFor: []`
  predates this batch and touching it is a separate, asymmetric change; (2)
  the `--classes` object-frame-class audit tool produced zero candidates for
  any of this batch's 9 verbs (their object nouns aren't yet in
  `scripts/frameClasses.mjs`'s lookup table), so it gave no independent
  second-pass signal here, unlike for the `--classes`-covered verbs above.
- Remaining distractor work outside this strategy: **#213** (hi/hitanoa
  wrong-gender/neutral-form lure row) is the last Distractor-Matrix row, blocked
  on native-speaker confirmation of #167's toka/noka data, not on engineering.
- **Done (#283):** Unit 11's present-perfect <-> simple-past "recency
  contrast" lure (`getRecencyContrastLure`, `etorri naiz` <-> `etorri
  nintzen`) — a Matrix extension in the same vein as #141/#165/#238, gated on
  `tense === 'presentPerfect' || tense === 'past'` alongside the existing
  case-frame/cross-tense/object-number lures.

## Tooling

**Verb-add workflow (issue [A1]):** after adding a verb/tense, run
`node scripts/validfor-delta-audit.mjs --verb <newVerbId>` to list every
gap slot it creates (a tagged sibling sentence where the new verb's
same-person form isn't in that sentence's `validFor`). For each, judge
naturalness and add the new verb id to `validFor` where its form is
genuinely an also-correct completion. Then regenerate the CI-guarded
baseline with `node scripts/validfor-delta-audit.mjs --json > scripts/validfor-gap-baseline.json`
and rerun `npm test` (`src/validfor-audit.test.js` fails on any unreviewed
change to the gap surface, by design — see §4.2). Running the script with
no flags prints a per-verb gap-count table, useful for spotting which verb
is most under-tagged.

**Class-model second-pass audit (issue [A4]):** `node scripts/validfor-delta-audit.mjs --classes`
(optionally `--verb <id>` to scope to one host verb) supplements the
agreement-based output above with object-class candidate fixes — `validFor`
additions the agreement-only audit can't see, because it has no model of
object semantics (e.g. "an apple" and "a meeting" are different classes; see
`docs/OBJECT_FRAME_TAGGING.md`). It's read-only and never edits `verbs.js`;
treat its output as a worklist for human review, the same as [A1]'s gap
slots.
