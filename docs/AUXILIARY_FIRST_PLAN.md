# Auxiliary-First Plan — Implementation Roadmap

**Status: adopted plan (2026-07-08).** The concrete, ordered work plan that
implements `docs/AUXILIARY_FIRST_REVIEW.md` (read that first — §3 is the
model, §5 the acceptance criteria this plan builds against). This document
answers "what do we build, in what order, in which files, and how do we know
each step is done." When a milestone lands, tick it here and log any
non-obvious deviation in `docs/DECISIONS.md` (language-data judgments in
`docs/LANGUAGE_DECISIONS.md`).

---

## 0. Adopted decisions (defaults from REVIEW §5, locked for this plan)

These were the open parameters; the plan proceeds with these values. Each is
cheap to revise later — none is load-bearing for the architecture.

| # | Decision | Adopted value |
|---|---|---|
| D1 | Cell mastery definition (M3) | *owned* = ≥3 correct, ≥2 distinct carriers, no miss in last 3 attempts; *learning* = touched; *untouched* else. Derived only — no `STORAGE_KEY` bump. |
| D2 | Nonce-verb gate consequence (M5) | **Non-blocking.** Never gates spine unlocks; failure routes weak-spot boosts to the paradigm and is shown on the results screen. |
| D3 | Family-selection safety (M4) | Fail-closed opt-in tag per sentence (`familyChoiceSafe`), machine-audited; aux-alternating verbs (`sartu`/`hasi`/`bukatu`…) excluded from auto-generation, allowed hand-authored. |
| D4 | Participle-selection cues (M4) | Closed temporal-anchor list (*atzo/gaur/bihar/egunero/oraintxe/…*); ambiguous cue × participle pairs excluded by audit. |
| D5 | Bare-form scope (M2) | Invariant applies to **spine practice lessons** only; hitanoa and bonus units exempt initially. |
| D6 | Lesson-diet depth (M6) | Decided row-by-row from the M0 audit table in PR review; lesson ids never deleted-and-reused (#151 precedent). |

## 1. Invariants (do not break)

1. **No `STORAGE_KEY` bump** — every new mastery view is *derived* from the
   existing `progress`/`errorStats` shapes.
2. **Lesson ids are stable** — renames/pooling keep ids (#137/#151
   precedent); collapsed lessons' ids are retired, never reused.
3. **The journey trio stays self-contained** — `VERBS`/`LESSONS`/`JOURNEY`
   changes never touch UI code; `src/journey.test.js` must pass after every
   milestone (`npm test`).
4. **Spine order unchanged** — this plan renames and re-instruments; it does
   not reorder units (REVIEW §3.5).
5. **Data tags are fail-closed** — new capabilities (`familyChoiceSafe`,
   participle cues, `heldOut`) are opt-in per datum and machine-audited,
   following `wordOrderSafe`/`validFor`.
6. **UI copy goes through the `*_META` tables and i18n** (en/es/eu) — no
   hardcoded linguistic labels; journey copy via
   `src/i18n/journeyTranslations.js`.
7. **Docs stay in sync** — `docs/LEARNING_JOURNEY.md` for rationale changes,
   regenerate `docs/CURRICULUM_MAP.md` when `journey.js`/`lessons.js`
   change, decision entries per CLAUDE.md.

---

## 2. Milestones

Dependency shape: **M0 → (M1 ∥ M2 ∥ M3) → M4 → M5**, M6 after M0 anytime.
M1–M3 are mutually independent and can proceed in parallel.

### M0 — Audits & worklists (1 PR, no behavior change)

*Goal: turn the two coverage questions into machine-generated tables this
plan consumes.*

- [ ] `scripts/grounding-audit.mjs` — walks every spine practice lesson ×
      drilled person and reports which degrade to bare `kind: 'form'`
      (i.e. no `sentences` variant ⇒ no sentence-grounded kind available).
      Output: markdown table (lesson id, verb, tense, persons missing).
      This is the **M2 worklist** (the screenshot's `edan · pastPlural` card
      is row 1).
- [ ] `scripts/lesson-diet-audit.mjs` — lists every single-verb periphrastic
      lesson with the #309 test (1–4 / introducer carve-out) it claims to
      pass, or `VIOLATION`. This is the **M6 worklist**.
- [ ] Commit both outputs as an appendix section in this document (tables
      are small; regenerating beats hand-maintenance).

**Files:** `scripts/` only. **Acceptance:** both scripts run via
`node scripts/<name>.mjs`, deterministic output, no app code touched.

### M1 — Reframe: paradigm-first learner-facing copy (2 PRs)

*Goal: REVIEW §3.5 / R2 — what the app* says *it teaches becomes the
paradigm; carriers demote to examples. Pure copy/display; zero data-model
risk.*

**PR 1 — `describeLesson` leads with the paradigm.**
- [ ] In `src/lessonDisplay.js`, practice/pool cards title as
      *family · tense (exemplar)* — e.g. "NOR-NORK · iragana · objektu
      plurala (**zenituzten**)" — with the carrier verb + gloss in the
      subtitle slot. Derive family from `agreement` via `AGREEMENT_META`;
      exemplar = the `hura`(or axis-fixed) cell of the resolved table.
- [ ] Layer D exception: synthetic verbs keep verb-first titles (the verb
      *is* the paradigm); construction lessons (`nahi`/`behar`/`ari`/
      `ahal`/hitanoa/`-arazi`) keep construction-first titles.
- [ ] New label strings in `src/i18n/translations.js` (en/es/eu); extend
      `AGREEMENT_META`/`TENSE_META` rather than branching inline.
- [ ] Update `src/App.homeScreen.test.jsx` / `App.exerciseScreen.test.jsx`
      snapshots/queries.

**PR 2 — journey titles & docs.**
- [ ] `src/journey.js`: retitle the spine units whose head is a
      periphrastic lexical verb (audit from REVIEW §5.1: Units 5, 14, 16,
      22 at minimum; 18–19 stay — `eduki` is synthetic). Keep unit numbers
      and `lessonIds` untouched.
- [ ] `src/i18n/journeyTranslations.js`: en/es/eu for every retitled unit.
- [ ] Sync `docs/LEARNING_JOURNEY.md`, regenerate `docs/CURRICULUM_MAP.md`.

**Acceptance (both PRs):** REVIEW §5.1-I1 — no spine unit/lesson title
headed by a periphrastic lexical verb; `npm test` and `npm run lint` green.

### M2 — Sentence coverage: retire the bare-form fallback on the spine (1 infra PR + N data PRs)

*Goal: REVIEW §3.6 — every spine question is answerable from Basque input,
not lesson metadata.*

**PR 1 — cell-frame infrastructure.**
- [ ] Add `CELL_FRAMES` alongside `OBJECT_AXIS_SKELETONS` in
      `src/data/verbs.js`: sentence-frame skeletons keyed by paradigm cell
      (`family:tense:person`), each with a participle slot and an
      object/adjunct slot that grounds tense and object number in the
      sentence (e.g. `pastPlural:zuek` → `Zuek {objects} atzo {participle}
      ___.`). A resolver in `src/lessonLogic.js` (sibling of
      `getComposedTable`) instantiates a frame for any carrier that
      composes, merging with (never overriding) the carrier's own
      hand-written `sentences`.
- [ ] Per-carrier slot vocabulary (which objects fit which verb) rides the
      existing `validFor`-style audit: extend
      `src/validfor-audit.test.js` to machine-check instantiated frames the
      same way hand-written sentences are checked.
- [ ] Flag the frame skeletons for native-speaker review in
      `docs/LANGUAGE_DECISIONS.md` (same protocol as #143's sentences).

**PRs 2…n — close the M0 worklist in batches** (by paradigm, not by verb:
one PR ≈ one aux table's missing cells across all its spine lessons).

**Final PR — enforce the invariant.**
- [ ] Extend `src/journey.test.js`: every spine practice lesson offers ≥1
      sentence-grounded kind per drilled person (D5 exemptions). Lands only
      once the worklist is empty, then *stays* as the regression guard.

**Acceptance:** grounding audit reports zero spine rows; the invariant test
is green and enforced.

### M3 — Aux-cell mastery: aggregation + paradigm grid (2 PRs)

*Goal: REVIEW §3.1 / R1 — progress the learner sees is "cells of the
auxiliary matrix owned," aggregated across carriers.*

**PR 1 — derivation layer (no UI).**
- [ ] `auxCellKey(verbId, tense, person, objectAxis)` in
      `src/lessonLogic.js`: resolves any answered question to its skeleton
      cell (composed verbs → `edun`/`dativeIzan[ByNor]` cell; synthetic
      verbs → their own `verbId:tense:person`, Layer D). Pure function over
      existing data — unit-test against the composition tables.
- [ ] `deriveCellMastery(errorStats, progress)` implementing D1's
      owned/learning/untouched states.
- [ ] Re-key `getWeakSpotQuestions` boosting by aux cell: a missed
      `ikusi:present:zuek` may be re-drilled as `hartu:present:zuek`
      (tests the rule, not the memory of the item). Raw storage keys
      unchanged (Invariant 1).

**PR 2 — the paradigm mastery grid.**
- [ ] Progress tab (`src/screens/HomeScreen.jsx`): per-family grids
      (NOR / NOR-NORI / NOR-NORK / NOR-NORI-NORK × taught tenses) with
      three-state cells; Layer D synthetics listed as their own grids under
      an "Aditz trinkoak" strand heading (REVIEW §3.5's visible-track
      requirement lands here for free).
- [ ] Reuse the existing table/preview components and `*_META` styling;
      i18n labels en/es/eu.
- [ ] PostHog event for grid views (measurement baseline, §4).

**Acceptance:** REVIEW §5.1-I2 — grid renders from existing stats on a
device with history; weak-spot review presents ≥1 different-carrier
question for a missed cell; headline progress metric shows cells owned.

### M4 — New question kinds: selection joins production (3 PRs)

*Goal: REVIEW §3.2–3.3 / R3+R4 — "when" gets first-class question kinds.*

**PR 1 — family-selection (`kind: 'family-choice'`).**
- [ ] Data: `familyChoiceSafe` tag on qualifying sentences (D3 criteria);
      seed pass over existing `sentences` of izan/ukan carriers (the
      "da or du?" line), then dative families.
- [ ] Engine: `generateFamilyChoiceQuestions` in `src/lessonLogic.js` —
      blank = auxiliary only, options = same tense/person across families
      (promoting `getAuxiliarySwapLure` from lure to answer dimension);
      lure rationale strings for the error-explanation UI.
- [ ] Audit: `validfor-audit`-style test proving every tagged sentence
      rejects all offered lures (D3).
- [ ] Wiring: recurring "da or du?" drill line through spine review
      lessons (a `familyChoice: true` lesson flag, like `suffixChoice`) —
      Units 6, 11, 13, 23 (Gate B), 31 (Gate C) minimum.
- [ ] UI: render + i18n prompt (`questionFamilyChoice`) in
      `src/screens/ExerciseScreen.jsx` / `translations.js`.

**PR 2 — participle-selection (`kind: 'participle-choice'`).**
- [ ] Generalize #423's `generateSuffixChoiceQuestions` → fixed aux, pick
      `-t(z)en`/`-tu`/`-ko` form from a D4 temporal anchor; ambiguity audit
      test; wire into Unit 11 (the aspect on-ramp) and Gate B.
- [ ] Unit 11 preview: the 3 × 2 participle × aux-tense grid on one carrier
      (REVIEW §3.3's explicit aspect "aha") — a data-driven preview screen
      variant, not new curriculum.

**PR 3 — bare-form as aux drill.**
- [ ] Remaining legitimate bare-form reps (early ramp) render participle
      greyed-out with aux highlighted + "works with any verb:
      edan/ikusi/erosi…" caption (REVIEW §3.6 closing rule). Display-only.

**Acceptance:** both kinds appear in their wired lessons; audits enforced in
`npm test`; every distractor in the new kinds carries a rationale string.

### M5 — Generalization gates: the nonce-verb check (1 PR)

*Goal: REVIEW §3.4 / R5 — prove transfer with never-taught carriers.*

- [ ] `heldOut: true` on 4–6 cheap `VERBS` entries (meaning + prefixes + a
      few frames only); **new test**: a held-out verb appears in zero
      `LESSONS` sources/pools (cannot be assumed post-#443).
- [ ] Engine: pool builders skip held-out verbs; gate lessons at Gates B
      (recognition) and C (production) draw them, presenting the verb's
      gloss + frame ("here is a verb you've never seen").
- [ ] D2: non-blocking — results route weak-spot boosts to the paradigm
      (M3's cell keying makes this free) and surface on the results screen;
      `getUnlockedLessonIds` untouched.
- [ ] PostHog event distinguishing nonce items (the transfer metric, §4).

**Acceptance:** REVIEW §5.2-I4 — enforcement test green; a learner failing
the nonce check sees paradigm-targeted review, not an `aipatu` lesson.

### M6 — Lesson diet: pool the redundant single-verb lessons (1–2 PRs)

*Goal: REVIEW §3.5 last bullet — finish #331/#469's collapses.*

- [ ] Take the M0 audit table; for each `VIOLATION` row, pool into the
      pattern's existing cross-verb lesson (mirroring #469's mechanics:
      retire the id, extend the pool's `sources`). D6: each row is a
      reviewable judgment; introducer-carve-out rows stay.
- [ ] Sync `journey.js` `lessonIds`, `docs/LEARNING_JOURNEY.md`, regenerate
      `docs/CURRICULUM_MAP.md`; `docs/DECISIONS.md` entry naming what was
      cut and what was spared, with reasons.

**Acceptance:** audit reports zero unjustified single-verb periphrastic
lessons; `journey.test.js` green.

---

## 3. Sequencing summary

| Order | Milestone | Depends on | Parallel-safe with |
|---|---|---|---|
| 1 | M0 audits | — | everything |
| 2 | M1 reframe | M0 (title audit list) | M2, M3 |
| 2 | M2 sentence coverage | M0 (worklist) | M1, M3 |
| 2 | M3 aggregation + grid | — | M1, M2 |
| 3 | M4 new kinds | M2 (grounded sentences), M3 (cell keying for stats) | M6 |
| 4 | M5 nonce gates | M4 (production items), M3 (routing) | M6 |
| any | M6 lesson diet | M0 (worklist) | M1–M5 |

M1 + M3-PR1 are the highest value-per-risk start (REVIEW §4's "increments
1–2 resolve the substance"); M2 is the long pole (data authoring + native
review) and should start early even though it ships in batches.

## 4. Measurement

Baseline before M4 lands, using existing PostHog wiring
(`docs/POSTHOG_ANALYTICS.md`): error rate per question kind and per aux
cell (M3 keying). Success criteria to revisit ~4 weeks after M4/M5:

- family-selection error rate declines across a learner's exposure
  (the "when" skill is being acquired, not just survived);
- nonce-verb items at Gate C converge toward the learner's error rate on
  *taught* carriers of the same cell (transfer — the thesis metric);
- D1 mastery thresholds re-tuned against the observed distributions.

## 5. Risks & mitigations

- **Generated frames read unnaturally** (M2): every frame skeleton batch is
  flagged for native review in `LANGUAGE_DECISIONS.md` before its lessons
  ship; hand-written `sentences` always win over generated frames.
- **Family-choice items with a defensible second reading** (M4): fail-closed
  tag + machine audit (D3); when in doubt a sentence simply stays untagged.
- **Grid overwhelms beginners** (M3): grids render only for families the
  learner has met (same progressive-disclosure rule the roadmap already
  uses for `pending` units).
- **Copy drift across three languages** (M1): retitles land only with all
  three locales in the same PR; `journeyTranslations` fallback keeps
  missing entries English rather than broken.
- **Long-pole fatigue on M2** (N data PRs): batches are independently
  shippable per paradigm; the invariant test lands last, so the spine
  improves monotonically without a red CI in between.
