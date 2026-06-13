# Exercise Variety Plan — making review questions test "which form" not just "which person"

This plan captures a gap identified while reviewing the exercise engine: every
question — including in "mixed review" lessons — is generated from one
already-known verb's conjugation table (`generateQuestions(verb, tense, ...)`
in `lessonLogic.js`), and the per-question badge tells the learner which
verb/tense it's testing. So the only decision a learner ever makes is "which
*person*'s form is this?" — never "which *verb/form* does this sentence even
need?". `buildOptions` compounds this: its distractors are always *other
persons of the same table*, so a learner is never offered a wrong-verb option
to reject.

Real Basque proficiency requires the second skill too — e.g. choosing `egon`
("Ni etxean nago") vs `izan` ("Ni etxean naiz", the classic learner mistake),
or recognising that a sentence's subject is ergative (`Nik`, needs a
`nor-nork` verb like `ukan`) vs absolutive (`Ni`, needs a `nor` verb like
`izan`/`egon`).

Conveniently, `verb.sentences[tense][person]` templates already encode this —
`izan` uses predicate-nominal sentences ("Ni irakaslea ___"), `egon` uses
locatives ("Ni etxean ___"), `ukan`/`nahi`/`jakin` use ergative-subject +
object sentences ("Nik liburu bat ___"), `joan`/`etorri` use allatives ("Ni
hondartzara ___"). Swapping in another verb's conjugated form as a distractor
is therefore a *real* grammatical/semantic error, not an arbitrary one — the
data is ready; the engine just doesn't use it this way yet.

Nothing in this document is a decision yet — it's a map of the work, broken
into ordered deliveries, each independently shippable and testable. As each
delivery ships, add a `docs/DECISIONS.md` entry per the usual convention.

## Goals

- Make "which verb/form fits this sentence" a skill the exercise engine
  actually drills, primarily in review lessons (which already mix multiple
  verbs' tables via `lesson.sources`).
- Increase distractor-option variety so option sets don't repeat the same
  same-table-only set across replays.
- Lay concrete groundwork for Refresh Gate C (`journey.js` Unit 24,
  "REFRESH — The Case-Ending Mixer"), currently just a one-line `pending`
  placeholder with no mechanism.

## Non-goals

- No changes to practice lessons' core framing (one verb/tense introduced at
  a time) — cross-verb reasoning is for *review* lessons, which already have
  multi-source context.
- No `journey.js`/`LESSONS` reordering.
- Periodic flash drills / ergative-suffix-drift detection (Tier 4 in
  `docs/EXERCISE_ENGINE.md`) — separate, unrelated work, not covered here.

## Suggested ordering

```
Delivery 1 ──> Delivery 2 ──> Delivery 3
                  │
                  └────────> Delivery 4
```

Delivery 1 is the cheapest and de-risks the badge/variety questions before
Delivery 2 builds a dedicated question kind on top. Deliveries 3 and 4 both
depend on 2 but are independent of each other.

---

## Delivery 1 — Widen the distractor pool in review lessons

**What:** for review lessons, `buildOptions` draws its 3 distractors from a
pool that includes not just *the same table's other persons*, but also *the
review's sibling sources' forms for the same person*.

**Why:** cheapest possible change. Immediately increases option variety, and
makes "is this actually an `egon` form, or did I just see an `izan` form?"
something a learner has to notice in passing — without inventing a new
question kind yet.

**Example:** today, an `egon-present` `ni` question (`"Ni etxean ___."`,
correct `nago`) in `unit-1-review` (sources: `izan` + `egon`) offers 3
distractors from `{zaude, dago, gaude, zarete, daude}` (all `egon`). After this
change, the pool also includes `izan`'s `naiz` — so the option set
occasionally includes a real "wrong verb" choice.

### Tasks

1. **1.1** — Extend `buildOptions` (`lessonLogic.js`) to accept an optional
   `extraCandidates: string[]` parameter, merged into the distractor pool
   before `shuffle().slice(0, 3)`.
2. **1.2** — In `createExerciseState` (`App.jsx`), for review lessons, compute
   each source's sibling sources' same-person forms (from their
   `conjugations[tense]` tables) and pass them as `extraCandidates` into
   `generateQuestions` → `buildOptions`/`buildSpotErrorQuestion`.
3. **1.3** — Hide or genericize the per-question verb badge for review
   lessons (or specifically for questions whose option set includes a
   cross-verb distractor) — otherwise the badge gives the answer away before
   the learner reads the sentence.
4. **1.4** — Decide & implement an "agreement compatibility" filter: only mix
   in cross-verb candidates whose subject-marking matches the source verb's
   (`nor` ↔ `nor`, `nor-nork` ↔ `nor-nork`) by default, so distractors are
   "plausible but wrong verb" rather than "structurally broken sentence" —
   the latter is deliberately Delivery 3's territory.
5. **1.5** — Update `logic.test.js` for the new `buildOptions` signature/
   behaviour (correct answer always present, option count unchanged, no
   duplicate option values). Confirm `npm test` (incl. `journey.test.js`) and
   `npm run lint`/`npm run build` still pass.
6. **1.6** — Pilot on `unit-1-review` (izan + egon — smallest, cleanest case,
   2 sources). Verify manually via `npm run dev` (or Playwright): play the
   lesson a few times, confirm `naiz`/`nago`-style cross-options appear and
   the question always has exactly one correct answer.
7. **1.7** — Roll out to the other multi-source reviews (`unit-2-review`,
   `unit-3-review`, `unit-5-review-*`, `unit-6-review-*`, `unit-7/8-review*`,
   `looking-back-*-review*`, `unit-9-review-*`) once the pilot is validated.

### Open decisions

- ~~How aggressively to mix in cross-verb candidates — always ensure at least
  one cross-verb distractor when available, or just widen the pool and let
  random sampling decide (so it's *occasional*, not guaranteed every
  question)?~~ Resolved: occasional — see `docs/DECISIONS.md` (2026-06-13,
  Delivery 1).
- ~~Badge treatment: hide the per-question badge entirely for review lessons,
  or replace it with a generic "Mixed review" badge?~~ Resolved: hide
  entirely — see `docs/DECISIONS.md` (2026-06-13, Delivery 1).

---

## Delivery 2 — Dedicated "verb-choice" cross-verb question kind

**What:** a new question kind for review lessons — a sentence whose blank
could plausibly take forms from multiple of the review's source verbs (same
person), where the learner must pick the one that's actually correct for
*that* sentence. Unlike Delivery 1 (where a cross-verb option is an
occasional extra distractor), this kind makes "which verb fits" the explicit
point of the question.

**Why:** Delivery 1 makes cross-verb reasoning incidental; some questions
should make it the deliberate focus, the way `negative`/`type-negative` made
`ez`-fronting the deliberate focus of Unit 6's reviews.

### Tasks

1. **2.1** — Add `generateCrossVerbQuestions(resolvedSources, { rounds, ... })`
   to `lessonLogic.js`. Input: the review's already-resolved
   `{ verb, tense }` sources (as `createExerciseState` already produces).
   Output: a handful of `kind: 'verb-choice'` questions, one per
   person/source combination (capped to keep total question count
   reasonable — see `TARGET_EXERCISE_COUNT`).
2. **2.2** — Pin down the exact question shape:
   - Which source's sentence is shown (the "correct" verb for this question).
   - How distractors are chosen from sibling sources (reuse Delivery 1.4's
     compatibility filter).
   - How to handle reviews with only 2 sources (→ 2-option questions) vs 3+
     (→ up to 4 options) — accept variable option counts rather than padding.
3. **2.3** — UI: extend `QuestionPrompt`/option rendering (`App.jsx`) to
   handle `kind: 'verb-choice'` — likely near-identical markup to `sentence`,
   reusing the same sentence-with-blank + option-button components. Confirm
   the option-button grid degrades gracefully for 2-3 options (vs the usual
   4).
4. **2.4** — Wire into `createExerciseState`: merge
   `generateCrossVerbQuestions`'s output into `allQuestions`, alongside the
   existing `getWeakSpotQuestions` extras.
5. **2.5** — Badge/explanation handling: reuse Delivery 1.3's badge decision
   for these questions too. Consider whether `getExplanation` needs a
   `verb-choice` case (explaining *why* the correct verb fits this sentence
   and the distractor verb(s) don't) — likely yes, since this is exactly the
   kind of "why" that benefits from an explanation, per the existing
   pronoun-question precedent.
6. **2.6** — Unit tests for `generateCrossVerbQuestions`: correct answer
   always present and unique among options, option count matches source
   count (capped), no two options resolve to the same surface form.
7. **2.7** — Pilot: izan-vs-egon `verb-choice` questions in `unit-1-review`
   and the Gate A reviews (`unit-5-review-*`, `unit-6-review-*`, all of which
   pair `izan`/`egon` with other verbs).

### Open decisions

- ~~Final `kind` name (`verb-choice` used as a placeholder here) and whether
  it needs its own `QUESTION_PROMPTS` entry or piggybacks on `sentence`'s.~~
  Resolved: `verb-choice` is the real name, with its own
  `QUESTION_PROMPT_KEYS`/`getExplanation` entries — see `docs/DECISIONS.md`
  (2026-06-13, Delivery 2).
- ~~Whether a typed variant (`type-verb-choice` — type the correct form with
  no options at all, the hardest version) is in scope now or deferred to a
  later delivery.~~ Resolved: deferred — see `docs/DECISIONS.md` (2026-06-13,
  Delivery 2).

---

## Delivery 3 — NOR vs NOR-NORK case-marking drills (Refresh Gate C groundwork)

**What:** extend Delivery 2's mechanism to source pairs with *different*
`agreement` shapes — e.g. `izan`/`egon` (`nor`, unmarked subject `Ni`) vs
`ukan`/`jakin`/`nahi` (`nor-nork`, ergative subject `Nik`). The distinguishing
feature becomes subject case-marking, not just verb meaning — deliberately
relaxing Delivery 1.4's "compatible agreement" filter.

**Why:** this is the "steepest" cross-verb confusion, and is exactly what
`journey.js`'s Unit 24 ("REFRESH — The Case-Ending Mixer — drills NOR/NORK/
NORI role-swaps, zero new verbs") is meant to cover. Today that unit is a
one-line `pending` placeholder with no spec; this delivery gives it a concrete
mechanism reusing Delivery 2's machinery.

### Tasks

1. **3.1** — Audit existing `sentences`/`pronouns` data for the relevant verbs
   to confirm cross-pairing produces unambiguous right/wrong answers — e.g.
   confirm `"Nik liburu bat naiz"` (ukan's sentence + izan's `ni` form) reads
   as clearly wrong, not as an alternate-but-valid phrasing, for every pair
   this delivery would generate.
2. **3.2** — Extend `generateCrossVerbQuestions` (or add a sibling function)
   to allow mixed-agreement source pairs, with Delivery 1.4's filter
   deliberately disabled/inverted for these questions.
3. **3.3** — Flesh out Unit 24's spec in `docs/LEARNING_JOURNEY.md` describing
   this mechanism concretely (what sources, what persons, how many
   questions), then add a real review lesson to `data/lessons.js` and flip
   Unit 24's `status`/`lessonIds` in `journey.js`.
4. **3.4** — Update `docs/EXERCISE_ENGINE.md`'s "Score-gating Refresh Gates"
   and "Refresh Gate C" notes to reference this as the resolved approach
   (mirroring how the doc already tracks Gate A's negation-kind resolution).
5. **3.5** — Add a `docs/DECISIONS.md` entry once shipped.

**Dependencies:** builds directly on Delivery 2; don't start before 2 is
validated and shipped.

---

## Delivery 4 (stretch) — Broaden the distractor pool beyond a review's own sources

**What:** when a review has too few sources to give Deliveries 1/2 enough
variety (e.g. `unit-1-review`/`unit-3-review` have only 2 sources → only 1
cross-verb candidate), fall back to same-person forms from *any verb already
introduced earlier in `LESSONS`*, not just this review's own sources.

**Why:** removes the "2-source review = only 1 cross-verb distractor"
ceiling noted during planning, without weakening Delivery 1/2's "this review
= these sources" framing for reviews that already have enough sources.

### Tasks

1. **4.1** — Add a helper, e.g. `getIntroducedVerbIds(lessons, upToLessonId)`,
   deriving "verbs taught so far" from `LESSONS` order (position-based,
   mirroring how `getUnlockedLessonIds` already reasons about `LESSONS`
   order).
2. **4.2** — Extend Delivery 1/2's candidate-pool logic to fall back to this
   broader set only when a review's own sibling sources don't provide enough
   candidates (e.g. fewer than 1-2 cross-verb candidates available).
3. **4.3** — Guard against spoilers: exclude tenses/forms not yet introduced
   for a given verb even if the verb itself has been introduced elsewhere
   (e.g. don't pull a verb's `future` form into a present-tense review if that
   verb's `future` lesson hasn't been reached yet).
4. **4.4** — Tests + manual validation on a 2-source review (e.g.
   `unit-1-review` or `unit-3-review`).

---

## How to use this document

This is a backlog, not a spec frozen in time — as each delivery's open
decisions get resolved, update this doc in place (or strike through
resolved items and link to the `docs/DECISIONS.md` entry, the way
`docs/EXERCISE_ENGINE.md` does for its own resolved items). Deliveries don't
need to ship in a single pass each — e.g. Delivery 1 could ship for
`unit-1-review` alone first (task 1.6) before 1.7's wider rollout.
