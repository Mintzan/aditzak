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

- [x] `scripts/grounding-audit.mjs` — walks every spine practice lesson ×
      drilled person and reports which degrade to bare `kind: 'form'`
      (i.e. no `sentences` variant ⇒ no sentence-grounded kind available).
      Output: markdown table (lesson id, verb, tense, persons missing).
      This is the **M2 worklist** (the screenshot's `edan · pastPlural` card
      is row 1).
- [x] `scripts/lesson-diet-audit.mjs` — lists every single-verb periphrastic
      lesson with the #309 test (1–4 / introducer carve-out) it claims to
      pass, or `VIOLATION`. This is the **M6 worklist**.
- [x] Commit both outputs as an appendix section in this document (tables
      are small; regenerating beats hand-maintenance).

**Files:** `scripts/` only. **Acceptance:** both scripts run via
`node scripts/<name>.mjs`, deterministic output, no app code touched.

### M1 — Reframe: paradigm-first learner-facing copy (2 PRs)

*Goal: REVIEW §3.5 / R2 — what the app* says *it teaches becomes the
paradigm; carriers demote to examples. Pure copy/display; zero data-model
risk.*

**PR 1 — `describeLesson` leads with the paradigm.**
- [x] In `src/lessonDisplay.js`, practice/pool cards title as
      *family · tense (exemplar)* — e.g. "NOR-NORK · iragana · objektu
      plurala (**zenituzten**)" — with the carrier verb + gloss in the
      subtitle slot. Derive family from `agreement` via `AGREEMENT_META`;
      exemplar = the `hura`(or axis-fixed) cell of the resolved table.
- [x] Layer D exception: synthetic verbs keep verb-first titles (the verb
      *is* the paradigm); construction lessons (`nahi`/`behar`/`ari`/
      `ahal`/hitanoa/`-arazi`) keep construction-first titles.
- [x] Family label derived from `AGREEMENT_META` at runtime; no new i18n
      strings needed (NOR/NORI/NORK labels are language-invariant grammatical
      terms; exemplar is always a Basque form). No `AGREEMENT_META`/`TENSE_META`
      extension required for this PR.
- [x] No test updates needed: all affected tests use `izan` (synthetic, unchanged)
      or match on substrings that remain stable after the change.

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

---

## Appendix A — M0 audit outputs (2026-07-08)

_Generated by `node scripts/grounding-audit.mjs` and
`node scripts/lesson-diet-audit.mjs`. Regenerate when lessons or verb data
change; do not hand-edit._

### A1 — M2 Grounding Audit

## M2 Grounding Audit — Spine Lessons Missing Sentence Data

_Every row below is a (lesson × verb × tense) slot where at least one drilled_
_person has no `sentences[tense][person]` entry, so that slot would degrade to_
_bare `kind: 'form'`. Close these gaps (per-paradigm, in batches) for M2._

| Lesson ID | Verb | Tense | Missing persons |
| --- | --- | --- | --- |
| nor-fodder-present | babestu-izan | present | zu, hura |
| nor-fodder-present-plural | babestu-izan | present | gu, zuek, haiek |
| izan-present-perfect-pool | izan | presentPerfect | ni, zu, hura |
| izan-present-perfect-pool | joan | presentPerfect | ni, zu, hura |
| izan-present-perfect-pool-plural | izan | presentPerfect | gu, zuek, haiek |
| izan-present-perfect-pool-plural | joan | presentPerfect | gu, zuek, haiek |
| izan-past-pool | babestu-izan | past | zu, hura |
| izan-past-pool-plural | babestu-izan | past | gu, zuek, haiek |
| unit-10-present | egin | present | ni |
| unit-10-present | idatzi | present | zu |
| unit-10-present | ikasi | present | hura |
| unit-10-present | utzi | present | zu, hura |
| unit-10-present-plural | irakurri | present | gu |
| unit-10-present-plural | idatzi | present | haiek |
| unit-10-present-plural | ikasi | present | haiek |
| unit-10-present-plural | entzun | present | gu |
| unit-10-present-plural | utzi | present | gu, zuek |
| unit-10-present-plural | bilatu | present | gu |
| unit-10-present-plural | saldu | present | gu, zuek |
| nor-nork-present-plural-pool | ukan | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | jan | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | edan | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | erosi | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | hartu | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | ikusi | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | eduki | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | egin | presentPlural | zu, hura |
| nor-nork-present-plural-pool | irakurri | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | idatzi | presentPlural | ni, hura |
| nor-nork-present-plural-pool | ikasi | presentPlural | ni, zu |
| nor-nork-present-plural-pool | entzun | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | utzi | presentPlural | ni |
| nor-nork-present-plural-pool | bilatu | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | saldu | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | eraman | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | ekarri | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool | jakin | presentPlural | ni, zu, hura |
| nor-nork-present-plural-pool-plural | ukan | presentPlural | gu, zuek |
| nor-nork-present-plural-pool-plural | jan | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | edan | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | erosi | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | hartu | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | ikusi | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | eduki | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | egin | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | irakurri | presentPlural | zuek, haiek |
| nor-nork-present-plural-pool-plural | idatzi | presentPlural | gu, zuek |
| nor-nork-present-plural-pool-plural | ikasi | presentPlural | gu, zuek |
| nor-nork-present-plural-pool-plural | entzun | presentPlural | zuek, haiek |
| nor-nork-present-plural-pool-plural | utzi | presentPlural | haiek |
| nor-nork-present-plural-pool-plural | bilatu | presentPlural | zuek, haiek |
| nor-nork-present-plural-pool-plural | saldu | presentPlural | haiek |
| nor-nork-present-plural-pool-plural | eraman | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | ekarri | presentPlural | gu, zuek, haiek |
| nor-nork-present-plural-pool-plural | jakin | presentPlural | gu, zuek, haiek |
| ukan-past-pool | ukan | past | zu |
| ukan-past-pool | egin | past | ni |
| ukan-past-pool | idatzi | past | zu |
| ukan-past-pool | ikasi | past | hura |
| ukan-past-pool | utzi | past | zu, hura |
| ukan-past-pool-plural | jakin | past | gu, zuek, haiek |
| ukan-past-pool-plural | irakurri | past | gu |
| ukan-past-pool-plural | idatzi | past | haiek |
| ukan-past-pool-plural | ikasi | past | haiek |
| ukan-past-pool-plural | entzun | past | gu |
| ukan-past-pool-plural | utzi | past | gu, zuek |
| ukan-past-pool-plural | bilatu | past | gu |
| ukan-past-pool-plural | saldu | past | gu, zuek |
| nor-nork-past-plural-pool | ukan | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | jan | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | edan | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | erosi | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | hartu | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | ikusi | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | eduki | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | egin | pastPlural | zu, hura |
| nor-nork-past-plural-pool | irakurri | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | idatzi | pastPlural | ni, hura |
| nor-nork-past-plural-pool | ikasi | pastPlural | ni, zu |
| nor-nork-past-plural-pool | entzun | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | utzi | pastPlural | ni |
| nor-nork-past-plural-pool | bilatu | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | saldu | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | eraman | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | ekarri | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool | jakin | pastPlural | ni, zu, hura |
| nor-nork-past-plural-pool-plural | ukan | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | jan | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | edan | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | erosi | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | hartu | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | ikusi | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | eduki | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | egin | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | irakurri | pastPlural | zuek, haiek |
| nor-nork-past-plural-pool-plural | idatzi | pastPlural | gu, zuek |
| nor-nork-past-plural-pool-plural | ikasi | pastPlural | gu, zuek |
| nor-nork-past-plural-pool-plural | entzun | pastPlural | zuek, haiek |
| nor-nork-past-plural-pool-plural | utzi | pastPlural | haiek |
| nor-nork-past-plural-pool-plural | bilatu | pastPlural | zuek, haiek |
| nor-nork-past-plural-pool-plural | saldu | pastPlural | haiek |
| nor-nork-past-plural-pool-plural | eraman | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | ekarri | pastPlural | gu, zuek, haiek |
| nor-nork-past-plural-pool-plural | jakin | pastPlural | gu, zuek, haiek |
| nor-nork-future-plural-pool | ukan | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | jan | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | edan | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | erosi | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | hartu | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | ikusi | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | eduki | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | nahi | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | egin | futurePlural | zu, hura |
| nor-nork-future-plural-pool | irakurri | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | idatzi | futurePlural | ni, hura |
| nor-nork-future-plural-pool | ikasi | futurePlural | ni, zu |
| nor-nork-future-plural-pool | entzun | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | utzi | futurePlural | ni |
| nor-nork-future-plural-pool | bilatu | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | saldu | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | eraman | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool | ekarri | futurePlural | ni, zu, hura |
| nor-nork-future-plural-pool-plural | ukan | futurePlural | gu, zuek |
| nor-nork-future-plural-pool-plural | jan | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | edan | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | erosi | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | hartu | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | ikusi | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | eduki | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | nahi | futurePlural | zuek |
| nor-nork-future-plural-pool-plural | egin | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | irakurri | futurePlural | zuek, haiek |
| nor-nork-future-plural-pool-plural | idatzi | futurePlural | gu, zuek |
| nor-nork-future-plural-pool-plural | ikasi | futurePlural | gu, zuek |
| nor-nork-future-plural-pool-plural | entzun | futurePlural | zuek, haiek |
| nor-nork-future-plural-pool-plural | utzi | futurePlural | haiek |
| nor-nork-future-plural-pool-plural | bilatu | futurePlural | zuek, haiek |
| nor-nork-future-plural-pool-plural | saldu | futurePlural | haiek |
| nor-nork-future-plural-pool-plural | eraman | futurePlural | gu, zuek, haiek |
| nor-nork-future-plural-pool-plural | ekarri | futurePlural | gu, zuek, haiek |
| etorri-habitual-past | etorri | habitualPast | ni, zu, hura |
| etorri-habitual-past-plural | etorri | habitualPast | gu, zuek, haiek |
| ikusi-habitual-past | ikusi | habitualPast | ni, zu, hura |
| ikusi-habitual-past-plural | ikusi | habitualPast | gu, zuek, haiek |
| esan-past-plural | esan | pastPlural | ni, zu, hura, gu, zuek, haiek |
| eman-past-plural | eman | pastPlural | zu, hura, zuek, haiek |
| ditransitive-dative-present | saldu-dative | present | ni, zu, hura |
| ditransitive-dative-present | utzi-dative | present | ni, zu, hura |
| ditransitive-dative-present | adierazi-dative | present | ni, zu, hura |
| ditransitive-dative-present | eskatu-dative | present | ni, zu, hura |
| ditransitive-dative-present | galdetu-dative | present | ni, zu, hura |
| ditransitive-dative-present-plural | saldu-dative | present | gu, zuek, haiek |
| ditransitive-dative-present-plural | utzi-dative | present | gu, zuek, haiek |
| ditransitive-dative-present-plural | adierazi-dative | present | gu, zuek, haiek |
| ditransitive-dative-present-plural | eskatu-dative | present | gu, zuek, haiek |
| ditransitive-dative-present-plural | galdetu-dative | present | gu, zuek, haiek |
| ditransitive-dative-past | saldu-dative | past | ni, zu, hura |
| ditransitive-dative-past | utzi-dative | past | ni, zu, hura |
| ditransitive-dative-past | adierazi-dative | past | ni, zu, hura |
| ditransitive-dative-past | eskatu-dative | past | ni, zu, hura |
| ditransitive-dative-past | galdetu-dative | past | ni, zu, hura |
| ditransitive-dative-past-plural | saldu-dative | past | gu, zuek |
| ditransitive-dative-past-plural | utzi-dative | past | gu, zuek, haiek |
| ditransitive-dative-past-plural | adierazi-dative | past | gu, zuek, haiek |
| ditransitive-dative-past-plural | eskatu-dative | past | gu, zuek, haiek |
| ditransitive-dative-past-plural | galdetu-dative | past | gu, zuek, haiek |
| ditransitive-dative-future | saldu-dative | future | ni, zu, hura |
| ditransitive-dative-future | utzi-dative | future | ni, zu, hura |
| ditransitive-dative-future | adierazi-dative | future | ni, zu, hura |
| ditransitive-dative-future | eskatu-dative | future | ni, zu, hura |
| ditransitive-dative-future | galdetu-dative | future | ni, zu, hura |
| ditransitive-dative-future-plural | saldu-dative | future | gu, zuek, haiek |
| ditransitive-dative-future-plural | utzi-dative | future | gu, zuek, haiek |
| ditransitive-dative-future-plural | adierazi-dative | future | gu, zuek, haiek |
| ditransitive-dative-future-plural | eskatu-dative | future | gu, zuek, haiek |
| ditransitive-dative-future-plural | galdetu-dative | future | gu, zuek, haiek |
| dative-verb-present | itxaron-dative | present | ni, zu, hura |
| dative-verb-present-plural | itxaron-dative | present | gu, zuek, haiek |
| dative-verb-past | itxaron-dative | past | ni, zu, hura |
| dative-verb-past-plural | itxaron-dative | past | gu, zuek, haiek |
| dative-verb-future | itxaron-dative | future | ni, zu, hura |
| dative-verb-future-plural | itxaron-dative | future | gu, zuek, haiek |
| izan-potential-alegiazkoa | izan | potentialAlegiazkoa | ni, hi, zu, hura, gu, zuek, haiek |
| ukan-potential-alegiazkoa | ukan | potentialAlegiazkoa | ni, zu, hura, gu, zuek, haiek |
| izan-potential-lehenaldia | izan | potentialLehenaldia | ni, hi, zu, hura, gu, zuek, haiek |
| ukan-potential-lehenaldia | ukan | potentialLehenaldia | ni, zu, hura, gu, zuek, haiek |
| ukan-potential-object-axis-present | ukan | potentialByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-alegiazkoa | ukan | potentialAlegiazkoaByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-lehenaldia | ukan | potentialLehenaldiaByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-present-hura | ukan | potentialByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-potential-object-axis-alegiazkoa-hura | ukan | potentialAlegiazkoaByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-potential-object-axis-lehenaldia-hura | ukan | potentialLehenaldiaByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-potential-object-axis-present-gu | ukan | potentialByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-alegiazkoa-gu | ukan | potentialAlegiazkoaByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-lehenaldia-gu | ukan | potentialLehenaldiaByObject | hura, zu, zuek, haiek |
| ukan-potential-object-axis-present-zu | ukan | potentialByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-alegiazkoa-zu | ukan | potentialAlegiazkoaByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-lehenaldia-zu | ukan | potentialLehenaldiaByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-present-zuek | ukan | potentialByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-alegiazkoa-zuek | ukan | potentialAlegiazkoaByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-lehenaldia-zuek | ukan | potentialLehenaldiaByObject | ni, hura, gu, haiek |
| ukan-potential-object-axis-present-haiek | ukan | potentialByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-potential-object-axis-alegiazkoa-haiek | ukan | potentialAlegiazkoaByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-potential-object-axis-lehenaldia-haiek | ukan | potentialLehenaldiaByObject | ni, hura, gu, zu, zuek, haiek |
| izan-conditional-past | izan | conditionalPast | ni, hi, zu, hura, gu, zuek, haiek |
| ukan-conditional-past | ukan | conditionalPast | ni, zu, hura, gu, zuek, haiek |
| ukan-baldintza-object-axis | ukan | baldintzaByObject | hura, zu, zuek, haiek |
| ukan-conditional-object-axis | ukan | conditionalByObject | hura, zu, zuek, haiek |
| ukan-conditional-past-object-axis | ukan | conditionalPastByObject | hura, zu, zuek, haiek |
| ukan-baldintza-object-axis-hura | ukan | baldintzaByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-conditional-object-axis-hura | ukan | conditionalByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-conditional-past-object-axis-hura | ukan | conditionalPastByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-baldintza-object-axis-gu | ukan | baldintzaByObject | hura, zu, zuek, haiek |
| ukan-conditional-object-axis-gu | ukan | conditionalByObject | hura, zu, zuek, haiek |
| ukan-conditional-past-object-axis-gu | ukan | conditionalPastByObject | hura, zu, zuek, haiek |
| ukan-baldintza-object-axis-zu | ukan | baldintzaByObject | ni, hura, gu, haiek |
| ukan-conditional-object-axis-zu | ukan | conditionalByObject | ni, hura, gu, haiek |
| ukan-conditional-past-object-axis-zu | ukan | conditionalPastByObject | ni, hura, gu, haiek |
| ukan-baldintza-object-axis-zuek | ukan | baldintzaByObject | ni, hura, gu, haiek |
| ukan-conditional-object-axis-zuek | ukan | conditionalByObject | ni, hura, gu, haiek |
| ukan-conditional-past-object-axis-zuek | ukan | conditionalPastByObject | ni, hura, gu, haiek |
| ukan-baldintza-object-axis-haiek | ukan | baldintzaByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-conditional-object-axis-haiek | ukan | conditionalByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-conditional-past-object-axis-haiek | ukan | conditionalPastByObject | ni, hura, gu, zu, zuek, haiek |
| ukan-imperative | ukan | imperative | hi-m, hi-f |
| gustatu-imperative-axis | gustatu | imperativeByNor | hura, zuek, haiek |
| iruditu-imperative-axis | iruditu | imperativeByNor | hura, zuek, haiek |
| ahaztu-imperative-axis | ahaztu | imperativeByNor | hura, zuek, haiek |
| egon-imperative | egon | imperative | hi, zu, zuek, hura, haiek |
| etorri-imperative | etorri | imperative | hi, zu, zuek |
| joan-imperative | joan | imperative | hi, zu, zuek |
| izan-present-toka | izan | presentToka | hura, haiek |
| ukan-present-toka | ukan | presentToka | hura, haiek |
| izan-past-toka | izan | pastToka | hura, haiek |
| ukan-past-toka | ukan | pastToka | hura, haiek |
| izan-present-noka | izan | presentNoka | hura, haiek |
| ukan-present-noka | ukan | presentNoka | hura, haiek |
| izan-past-noka | izan | pastNoka | hura, haiek |
| ukan-past-noka | ukan | pastNoka | hura, haiek |
| ukan-object-axis-present | ukan | presentByObject | hura, zu, zuek, haiek |
| maite-object-axis-present | maite | presentByObject | hura, zu, zuek, haiek |
| ukan-object-axis-past | ukan | pastByObject | hura, zu, zuek, haiek |
| maite-object-axis-past | maite | pastByObject | hura, zu, zuek, haiek |
| ukan-object-axis-present-hura | ukan | presentByObject | ni, hura, gu, zu, zuek, haiek |
| maite-object-axis-past-hura | maite | pastByObject | ni, hura, gu, zu, zuek, haiek |
| ikusi-object-axis-present-gu | ikusi | presentByObject | hura, zu, zuek, haiek |
| jan-object-axis-past-gu | jan | pastByObject | hura, zu, zuek, haiek |
| edan-object-axis-present-zu | edan | presentByObject | ni, hura, gu, haiek |
| erosi-object-axis-past-zu | erosi | pastByObject | ni, hura, gu, haiek |
| hartu-object-axis-present-zuek | hartu | presentByObject | ni, hura, gu, haiek |
| ukan-object-axis-past-zuek | ukan | pastByObject | ni, hura, gu, haiek |
| maite-object-axis-present-haiek | maite | presentByObject | ni, hura, gu, zu, zuek, haiek |
| ikusi-object-axis-past-haiek | ikusi | pastByObject | ni, hura, gu, zu, zuek, haiek |
| gustatu-imperative-axis-ni | gustatu | imperativeByNor | hura, zu, zuek, haiek |
| iruditu-imperative-axis-ni | iruditu | imperativeByNor | hura, zu, zuek, haiek |
| ahaztu-imperative-axis-ni | ahaztu | imperativeByNor | hura, zu, zuek, haiek |
| gustatu-imperative-axis-hura | gustatu | imperativeByNor | hura, zu, zuek, haiek |
| iruditu-imperative-axis-hura | iruditu | imperativeByNor | hura, zu, zuek, haiek |
| ahaztu-imperative-axis-hura | ahaztu | imperativeByNor | hura, zu, zuek, haiek |
| gustatu-imperative-axis-gu | gustatu | imperativeByNor | hura, zu, zuek, haiek |
| iruditu-imperative-axis-gu | iruditu | imperativeByNor | hura, zu, zuek, haiek |
| ahaztu-imperative-axis-gu | ahaztu | imperativeByNor | hura, zu, zuek, haiek |
| gustatu-imperative-axis-zuek | gustatu | imperativeByNor | hura, zu, haiek |
| iruditu-imperative-axis-zuek | iruditu | imperativeByNor | hura, zu, haiek |
| ahaztu-imperative-axis-zuek | ahaztu | imperativeByNor | hura, zu, haiek |
| gustatu-imperative-axis-haiek | gustatu | imperativeByNor | hura, zu, zuek, haiek |
| iruditu-imperative-axis-haiek | iruditu | imperativeByNor | hura, zu, zuek, haiek |
| ahaztu-imperative-axis-haiek | ahaztu | imperativeByNor | hura, zu, zuek, haiek |
| izan-subjunctive-past | izan | subjunctivePast | hura, haiek |
| ukan-subjunctive-past | ukan | subjunctivePast | hura, haiek |

**Rows (lesson × verb × tense combos):** 270  
**Total missing (person × verb × tense) slots:** 831

### A2 — M6 Lesson Diet Audit

## M6 Lesson Diet Audit — Single-Verb Practice Lessons vs. Rule #309

_Each row is a single-verb (non-review, non-pool) practice lesson. Verdict:_
_**PASS** = clearly justified. **REVIEW** = borderline, human decides._
_**VIOLATION** = candidate for pooling in M6._

| Lesson ID | Verb | Tense | Agreement | Persons | Tests | Verdict | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| izan-present | izan | present | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| egon-present | egon | present | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ukan-present | ukan | present | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| jakin-present | jakin | present | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| nahi-present | nahi | present | nor-nork | ni,zu,hura | Test 3 (modal particle) | PASS |  |
| ikusi-present | ikusi | present | nor-nork | ni,zu,hura | Introducer carve-out (first for this pattern) | PASS |  |
| joan-present | joan | present | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| etorri-present | etorri | present | nor-nori | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ibili-present | ibili | present | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ikusi-present-plural | ikusi | present | nor-nork | gu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| ukan-present-plural | ukan | present | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ari-present | ari | present | nor | all | Test 3 (modal particle) | PASS |  |
| ikusi-present-perfect | ikusi | presentPerfect | nor-nork | ni,zu,hura | Introducer carve-out (first for this pattern) | PASS |  |
| ikusi-present-perfect-plural | ikusi | presentPerfect | nor-nork | gu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| eduki-present | eduki | present | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| eduki-present-plural | eduki | present | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ibili-present-plural | ibili | present | nor | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| eduki-past | eduki | past | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| eduki-past-plural | eduki | past | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ados-egon-present | ados-egon | present | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ados-egon-present-plural | ados-egon | present | nor | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| egon-past | egon | past | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ados-egon-past | ados-egon | past | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| egon-past-plural | egon | past | nor | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ados-egon-past-plural | ados-egon | past | nor | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| izan-future | izan | future | nor | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| izan-future-plural | izan | future | nor | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-future | ukan | future | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ukan-future-plural | ukan | future | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| behar-present | behar | present | nor-nork | all | Test 3 (modal particle) | PASS |  |
| behar-future | behar | future | nor-nork | all | Test 3 (modal particle) | PASS |  |
| etorri-habitual-past | etorri | habitualPast | nor-nori | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| etorri-habitual-past-plural | etorri | habitualPast | nor-nori | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ikusi-habitual-past | ikusi | habitualPast | nor-nork | ni,zu,hura | Introducer carve-out (first for this pattern) | PASS |  |
| ikusi-habitual-past-plural | ikusi | habitualPast | nor-nork | gu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| gustatu-past | gustatu | past | nor-nori | all | Test 2 (first distinct-frame lesson) | PASS |  |
| gustatu-future | gustatu | future | nor-nori | all | Test 2 (first distinct-frame lesson) | PASS |  |
| iruditu-past | iruditu | past | nor-nori | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-past; pattern (nor-nori × past × all) already introduced by gustatu-past |
| iruditu-future | iruditu | future | nor-nori | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-future; pattern (nor-nori × future × all) already introduced by gustatu-future |
| ahaztu-past | ahaztu | past | nor-nori | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-past; pattern (nor-nori × past × all) already introduced by gustatu-past |
| ahaztu-future | ahaztu | future | nor-nori | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-future; pattern (nor-nori × future × all) already introduced by gustatu-future |
| esan-present | esan | present | nor-nori-nork | all | Test 2 (first distinct-frame lesson) | PASS |  |
| eman-present | eman | present | nor-nori-nork | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by esan-present; pattern (nor-nori-nork × present × all) already introduced by esan-present |
| esan-present-plural | esan | presentPlural | nor-nori-nork | all | Test 2 (first distinct-frame lesson) | PASS |  |
| eman-present-plural | eman | presentPlural | nor-nori-nork | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by esan-present-plural; pattern (nor-nori-nork × presentPlural × all) already introduced by esan-present-plural |
| esan-past-plural | esan | pastPlural | nor-nori-nork | all | Test 2 (first distinct-frame lesson) | PASS |  |
| eman-past-plural | eman | pastPlural | nor-nori-nork | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by esan-past-plural; pattern (nor-nori-nork × pastPlural × all) already introduced by esan-past-plural |
| esan-past | esan | past | nor-nori-nork | all | Test 2 (first distinct-frame lesson) | PASS |  |
| esan-future | esan | future | nor-nori-nork | all | Test 2 (first distinct-frame lesson) | PASS |  |
| eman-past | eman | past | nor-nori-nork | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by esan-past; pattern (nor-nori-nork × past × all) already introduced by esan-past |
| eman-future | eman | future | nor-nori-nork | all | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by esan-future; pattern (nor-nori-nork × future × all) already introduced by esan-future |
| izan-potential | izan | potential | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-potential | ukan | potential | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-potential-alegiazkoa | izan | potentialAlegiazkoa | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-potential-alegiazkoa | ukan | potentialAlegiazkoa | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-potential-lehenaldia | izan | potentialLehenaldia | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-potential-lehenaldia | ukan | potentialLehenaldia | nor-nork | all | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present | ukan | potentialByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa | ukan | potentialAlegiazkoaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia | ukan | potentialLehenaldiaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present-hura | ukan | potentialByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa-hura | ukan | potentialAlegiazkoaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia-hura | ukan | potentialLehenaldiaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present-gu | ukan | potentialByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa-gu | ukan | potentialAlegiazkoaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia-gu | ukan | potentialLehenaldiaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present-zu | ukan | potentialByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa-zu | ukan | potentialAlegiazkoaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia-zu | ukan | potentialLehenaldiaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present-zuek | ukan | potentialByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa-zuek | ukan | potentialAlegiazkoaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia-zuek | ukan | potentialLehenaldiaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-present-haiek | ukan | potentialByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-alegiazkoa-haiek | ukan | potentialAlegiazkoaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-potential-object-axis-lehenaldia-haiek | ukan | potentialLehenaldiaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ahal-izan-present | ahal-izan | present | nor | all | Test 3 (modal particle) | PASS |  |
| ahal-ukan-present | ahal-ukan | present | nor-nork | all | Test 3 (modal particle) | PASS |  |
| ezin-izan-present | ezin-izan | present | nor | all | Test 3 (modal particle) | PASS |  |
| ezin-ukan-present | ezin-ukan | present | nor-nork | all | Test 3 (modal particle) | PASS |  |
| izan-baldintza | izan | baldintza | nor | all | Test 1 (synthetic) | PASS |  |
| izan-conditional | izan | conditional | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-baldintza | ukan | baldintza | nor-nork | all | Test 1 (synthetic) | PASS |  |
| ukan-conditional | ukan | conditional | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-conditional-past | izan | conditionalPast | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past | ukan | conditionalPast | nor-nork | all | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis | ukan | baldintzaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis | ukan | conditionalByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis | ukan | conditionalPastByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis-hura | ukan | baldintzaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis-hura | ukan | conditionalByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis-hura | ukan | conditionalPastByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis-gu | ukan | baldintzaByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis-gu | ukan | conditionalByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis-gu | ukan | conditionalPastByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis-zu | ukan | baldintzaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis-zu | ukan | conditionalByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis-zu | ukan | conditionalPastByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis-zuek | ukan | baldintzaByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis-zuek | ukan | conditionalByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis-zuek | ukan | conditionalPastByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| ukan-baldintza-object-axis-haiek | ukan | baldintzaByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-object-axis-haiek | ukan | conditionalByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-conditional-past-object-axis-haiek | ukan | conditionalPastByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| izan-imperative | izan | imperative | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-imperative | ukan | imperative | nor-nork | all | Test 1 (synthetic) | PASS |  |
| gustatu-imperative-axis | gustatu | imperativeByNor | nor-nori | hura,zuek,haiek | Test 2 (first distinct-frame lesson) | PASS |  |
| iruditu-imperative-axis | iruditu | imperativeByNor | nor-nori | hura,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis; pattern (nor-nori × imperativeByNor × hura,zuek,haiek) already introduced by gustatu-imperative-axis |
| ahaztu-imperative-axis | ahaztu | imperativeByNor | nor-nori | hura,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis; pattern (nor-nori × imperativeByNor × hura,zuek,haiek) already introduced by gustatu-imperative-axis |
| egon-imperative | egon | imperative | nor | all | Test 1 (synthetic) | PASS |  |
| etorri-imperative | etorri | imperative | nor-nori | all | Test 1 (synthetic) | PASS |  |
| joan-imperative | joan | imperative | nor | all | Test 1 (synthetic) | PASS |  |
| izan-present-toka | izan | presentToka | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-present-toka | ukan | presentToka | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-past-toka | izan | pastToka | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-past-toka | ukan | pastToka | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-present-noka | izan | presentNoka | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-present-noka | ukan | presentNoka | nor-nork | all | Test 1 (synthetic) | PASS |  |
| izan-past-noka | izan | pastNoka | nor | all | Test 1 (synthetic) | PASS |  |
| ukan-past-noka | ukan | pastNoka | nor-nork | all | Test 1 (synthetic) | PASS |  |
| eraman-present | eraman | present | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| eraman-present-plural | eraman | present | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ekarri-present | ekarri | present | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ekarri-present-plural | ekarri | present | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| eraman-past | eraman | past | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| eraman-past-plural | eraman | past | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ekarri-past | ekarri | past | nor-nork | ni,zu,hura | Test 1 (synthetic) | PASS |  |
| ekarri-past-plural | ekarri | past | nor-nork | gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ukan-object-axis-present | ukan | presentByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| maite-object-axis-present | maite | presentByObject | nor-nork | hura,zu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| ukan-object-axis-past | ukan | pastByObject | nor-nork | hura,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| maite-object-axis-past | maite | pastByObject | nor-nork | hura,zu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| ukan-object-axis-present-hura | ukan | presentByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| maite-object-axis-past-hura | maite | pastByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| ikusi-object-axis-present-gu | ikusi | presentByObject | nor-nork | hura,zu,zuek,haiek | — | **VIOLATION** | pattern (nor-nork × presentByObject × hura,zu,zuek,haiek) already introduced by maite-object-axis-present |
| jan-object-axis-past-gu | jan | pastByObject | nor-nork | hura,zu,zuek,haiek | — | **VIOLATION** | pattern (nor-nork × pastByObject × hura,zu,zuek,haiek) already introduced by maite-object-axis-past |
| edan-object-axis-present-zu | edan | presentByObject | nor-nork | ni,hura,gu,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| erosi-object-axis-past-zu | erosi | pastByObject | nor-nork | ni,hura,gu,haiek | Test 4 (dativeOvergeneration error drill) | PASS |  |
| hartu-object-axis-present-zuek | hartu | presentByObject | nor-nork | ni,hura,gu,haiek | Test 4 (dativeOvergeneration error drill) | PASS |  |
| ukan-object-axis-past-zuek | ukan | pastByObject | nor-nork | ni,hura,gu,haiek | Test 1 (synthetic) | PASS |  |
| maite-object-axis-present-haiek | maite | presentByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | Introducer carve-out (first for this pattern) | PASS |  |
| ikusi-object-axis-past-haiek | ikusi | pastByObject | nor-nork | ni,hura,gu,zu,zuek,haiek | — | **VIOLATION** | pattern (nor-nork × pastByObject × ni,hura,gu,zu,zuek,haiek) already introduced by maite-object-axis-past-hura |
| gustatu-imperative-axis-ni | gustatu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (first distinct-frame lesson) | PASS |  |
| iruditu-imperative-axis-ni | iruditu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| ahaztu-imperative-axis-ni | ahaztu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| gustatu-imperative-axis-hura | gustatu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| iruditu-imperative-axis-hura | iruditu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| ahaztu-imperative-axis-hura | ahaztu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| gustatu-imperative-axis-gu | gustatu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| iruditu-imperative-axis-gu | iruditu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| ahaztu-imperative-axis-gu | ahaztu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| gustatu-imperative-axis-zuek | gustatu | imperativeByNor | nor-nori | hura,zu,haiek | Test 2 (first distinct-frame lesson) | PASS |  |
| iruditu-imperative-axis-zuek | iruditu | imperativeByNor | nor-nori | hura,zu,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-zuek; pattern (nor-nori × imperativeByNor × hura,zu,haiek) already introduced by gustatu-imperative-axis-zuek |
| ahaztu-imperative-axis-zuek | ahaztu | imperativeByNor | nor-nori | hura,zu,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-zuek; pattern (nor-nori × imperativeByNor × hura,zu,haiek) already introduced by gustatu-imperative-axis-zuek |
| gustatu-imperative-axis-haiek | gustatu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| iruditu-imperative-axis-haiek | iruditu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| ahaztu-imperative-axis-haiek | ahaztu | imperativeByNor | nor-nori | hura,zu,zuek,haiek | Test 2 (frame repeated) | _REVIEW_ | frame already introduced by gustatu-imperative-axis-ni; pattern (nor-nori × imperativeByNor × hura,zu,zuek,haiek) already introduced by gustatu-imperative-axis-ni |
| izan-subjunctive-present | izan | subjunctivePresent | nor | hura,haiek | Test 1 (synthetic) | PASS |  |
| ukan-subjunctive-present | ukan | subjunctivePresent | nor-nork | hura,haiek | Test 1 (synthetic) | PASS |  |
| izan-subjunctive-past | izan | subjunctivePast | nor | hura,haiek | Test 1 (synthetic) | PASS |  |
| ukan-subjunctive-past | ukan | subjunctivePast | nor-nork | hura,haiek | Test 1 (synthetic) | PASS |  |
| itzularazi-present | itzularazi | present | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| itzularazi-past | itzularazi | past | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| itzularazi-future | itzularazi | future | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| dantzarazi-present | dantzarazi | present | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| dantzarazi-past | dantzarazi | past | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| dantzarazi-future | dantzarazi | future | nor-nork | all | Test 3 (causative -arazi) | PASS |  |
| janarazi-present | janarazi | present | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-present |
| janarazi-past | janarazi | past | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-past |
| janarazi-future | janarazi | future | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-future |
| idatzarazi-present | idatzarazi | present | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-present |
| idatzarazi-past | idatzarazi | past | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-past |
| idatzarazi-future | idatzarazi | future | nor-nori-nork | all | Test 2 (frame repeated); Test 3 (causative -arazi) | PASS | frame already introduced by esan-future |
| ihardun-present | ihardun | present | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| ihardun-past | ihardun | past | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| iraun-present | iraun | present | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| iraun-past | iraun | past | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| erabili-present | erabili | present | nor-nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| erabili-past | erabili | past | nor-nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| jario-present | jario | present | nor-nori | all | Test 1 (synthetic) | PASS |  |
| jario-past | jario | past | nor-nori | all | Test 1 (synthetic) | PASS |  |
| irudi-present | irudi | present | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| irudi-past | irudi | past | nork | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| etzan-present | etzan | present | nor | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |
| etzan-past | etzan | past | nor | ni,zu,hura,gu,zuek,haiek | Test 1 (synthetic) | PASS |  |

**Total single-verb practice lessons:** 184  
**Synthetic (Test 1, always PASS):** 114  
**Periphrastic:** 70  
  — PASS: 43  
  — REVIEW: 24  
  — VIOLATION: 3

### VIOLATION rows (M6 pooling candidates)

- `ikusi-object-axis-present-gu`: pattern (nor-nork × presentByObject × hura,zu,zuek,haiek) already introduced by maite-object-axis-present
- `jan-object-axis-past-gu`: pattern (nor-nork × pastByObject × hura,zu,zuek,haiek) already introduced by maite-object-axis-past
- `ikusi-object-axis-past-haiek`: pattern (nor-nork × pastByObject × ni,hura,gu,zu,zuek,haiek) already introduced by maite-object-axis-past-hura
