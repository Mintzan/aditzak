# Distractor & ambiguity strategy

**Status: current/authoritative — planning doc.** Consolidates the direction
for how multiple-choice distractors are chosen and how question ambiguity is
avoided. Written to give future sessions the *full picture* in one place, so
the same questions don't get re-opened one bug report at a time. Supersedes
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` (deleted in #126) as the standing
methodology reference; the per-sentence `validFor` *schema* still lives in
`docs/SENTENCE_FRAMES.md` and is unchanged by this doc.

This doc records a **direction and the evidence for it**, not yet-implemented
mechanisms. Nothing here changes runtime behaviour on its own; it's the map
for the decisions listed in "Open decisions" at the bottom.

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

- Issues: #121 → #139 → #174 → #200 → #203, and **#218.2** is the next sighting.
- This is essentially **one bug fixed repeatedly.** Each fix added another
  *context gate* rather than fixing the abstraction:
  - #139 added small-table borrowing (`getBorrowedDistractors`).
  - #174 scoped borrowing to a review's `sources`.
  - #200 introduced `reviewScoped`, keyed on `sources.length > 1`.
  - #203 added an explicit `review` flag because `sources.length > 1` missed
    single-source reviews, and also gated `formLures` the same way.
- Root cause: once a borrowed form or a lure lands in `options`, it is a bare
  string — indistinguishable from a safe same-table distractor. So every
  context (`form` vs `sentence`, review vs practice, single vs multi-source)
  must *re-derive* "is a cross-verb form safe here?" via an accreting pile of
  conditionals (`reviewScoped`, `borrowPool`, `sources`, gated `formLures` in
  `generateQuestions`). The abstraction boundary is in the wrong place.

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

## 5. Open decisions

These are the forks future sessions should resolve deliberately, in roughly
dependency order:

1. **Frame-derived tagging for the core cluster (4.1)** — adopt or not? If yes,
   design the object-class vocabulary and the verb × class admission table, and
   decide migration (derive-and-diff against current hand-tagged `validFor` so
   no existing decision silently flips). This is the highest-leverage call and
   reopens a `SENTENCE_FRAMES.md` rejection on new evidence.
2. **Delta audit (4.2)** — build as a CI script / test that runs on verb
   addition. Cheap, independent of #1, worth doing regardless.
3. **Provenance-typed distractors (4.3)** — an engine refactor of
   `buildOptions`/`generateQuestions`; behaviour-preserving, removes accreted
   gates. Sequence before adding any further Family-B context.
4. **Lure legibility + targeted lures (4.4)** — product/UI work
   (review `form`-question rendering, post-answer feedback) plus a small Matrix
   extension; can proceed independently.

## 6. Known content debt (not yet actioned)

- **`behar` is broadly under-tagged** (§3): #218.1 is the tip. A targeted
  `behar` `validFor` pass across the `nor-nork` cluster's ownable-object
  sentences is owed regardless of whether 4.1 lands.
