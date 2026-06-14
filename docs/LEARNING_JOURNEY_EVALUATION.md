# Learning Journey — Evaluation Results

Evaluation of the shipped learning journey (`docs/LEARNING_JOURNEY.md` and the
implemented `journey.js`/`LESSONS`, state of 2026-06-14) against the
pedagogical criteria below. The redesigned curriculum these findings motivate is
specified separately in `docs/LEARNING_JOURNEY_PROPOSED.md` (the "proposed
journey"); this document is the *why*, and the map from the shipped units to the
proposed ones. Unit numbers written **O-n** refer to the shipped journey,
**P-n** to the proposed one.

## Criteria

1. **Asymmetric practicality vs. mastery** — high-utility phrases up front;
   disproportionate content on steep jumps (ergative, NOR-NORI, ditransitive);
   compress mechanically-simple concepts.
2. **Cognitive load & scaffolding** — paradigms (NOR / NOR-NORK / NOR-NORI /
   NOR-NORI-NORK) spaced to prevent structural interference; the intimate
   register (hitanoa) not overloaded.
3. **Advanced safeguards** — intentional morphophonological pacing; a pronoun
   fading progression; engineered distractors that catch named slippage.

## Verdict at a glance

The shipped journey is structurally sound on its best ideas — the 3-person
horizon, functional grouping, early simple-past pooling, future compression, and
structural refresh gates all hold up. Five problems warrant change, in
descending order of impact:

1. **Unit O-26 collapses three independent novelties** (`hi` + toka + noka) into
   one unit — the largest cognitive cliff.
2. **The two dative paradigms are present-only** — NOR-NORI and NOR-NORI-NORK
   are introduced and then abandoned at the present tense; their useful
   past/future forms have no scheduled home.
3. **The subjunctive is under-budgeted and mis-framed** — crammed with the
   imperative into one unit (O-25) and drilled as isolated morphology rather
   than as the subordinate-clause construction it actually is.
4. **The Expansion gate (O-5) interleaves two unrelated plural paradigms**,
   manufacturing predictable blend errors.
5. **Morphophonology arrives by accident** — `-tzen`/`-ten` and `-ko`/`-go` are
   never staged as deliberate minimal pairs.

---

## Findings

### F1 — Unit O-26 (`hi` + hitanoa) triple-novelty cliff  ·  criterion 2

**Observed.** O-26 introduces `hi` (a brand-new 7th person, deferred the entire
course), allocutive agreement itself, *and* both gender registers (toka `-k` /
noka `-n`) at once, "as one register, not two facts."

**Friction.** Three independent novelties are conflated: (1) `hi` as a
referential person (new agreement slots everywhere), (2) addressee-agreement as
a *concept* — a verb with no `hi` argument changing shape based on who you're
talking to, the steepest conceptual jump in the language, and (3) a masc./fem.
bifurcation that doubles the table the instant it appears. With all three live,
a wrong answer is undiagnosable: person, register, or gender? The "one register,
not two facts" framing is elegant but removes the scaffolding.

**Resolution → P-30…P-33.** Stage the three novelties one at a time: P-30 *Meet
`hi`* (subject only, no allocutivity), P-31 *Toka* (one gender), P-32 *Noka*
(taught as the `-k`→`-n` transform of P-31), P-33 *Recombine + when not to use
it* (subordinate-clause ban, `-ke-` clash).

### F2 — Dative paradigms are present-only  ·  criteria 1, 2

**Observed.** NOR-NORI enters at O-20 (present), NOR-NORI-NORK at O-21
(present). After that, neither recurs in any other tense except indirectly
(imperative O-25, causative O-29). The future stage (O-14/15) sits in Phase II,
structurally *before* the dative system, so it can never reach `esan`/`eman`.
The past pools (O-8/9) and conditional/potential units (O-23/24, which reference
§2/§3 = `nor`/`nor-nork` only) likewise never touch the dative grids — though
§4/§5 document them fully.

**Friction.** The highest-utility missing forms are everyday: `esan nion`
("I told him"), `eman zidan` ("he gave it to me"), `esango dizut` ("I'll tell
you"), `gustatu zitzaidan` ("I liked it"), `ahaztu zitzaidan` ("I forgot it").
A learner finishes the dative system unable to say any of these in the past or
future — a direct asymmetric-practicality failure.

**Resolution → P-22, P-24.** Add a NOR-NORI *past + future* unit (P-22) and a
NOR-NORI-NORK *past + future* unit (P-24), each a *recombination* reusing the
periphrastic-past and `-ko`/`-go` machinery the learner already owns. The
genuinely advanced dative moods (conditional / potential / subjunctive
ditransitive) are deliberately scoped **recognition-only / deferred**, not
crammed in — see F3 and the proposed coverage map.

### F3 — Subjunctive under-budgeted and mis-framed  ·  criteria 1, 2

**Observed.** O-25 ("Command & Subjunctives") teaches the **imperative** across
NOR/NOR-NORK/ditransitive *and* the **subjunctive** across them, in one unit.

**Friction.** Two different moods with different difficulty profiles share one
slot. Worse, the subjunctive barely exists as a standalone conjugation in
Basque — it surfaces almost only embedded in subordinate clauses
(`Nahi dut etor dadin`). Drilling "conjugate this verb in the subjunctive"
trains the wrong skill; it has to be taught as a *construction* (matrix verb +
subordinate clause), i.e. a syntax lesson. Bundled with the imperative and
spread across three agreement patterns, it is both rushed and taught at the
wrong altitude — exactly the kind of hard mood the criteria say must get *more*
room, not less.

**Resolution → P-28, P-29 + scope conventions.** Split into P-28 *Commands*
(concrete, high-utility, first) and P-29 *Purpose & Wishing* (subjunctive as a
construction, recognition-first). Add an explicit **production-vs-recognition
scoping rule** and a **Mood Difficulty Ladder** to the proposed spec, so each
(agreement × mood) cell is consciously tagged drilled-for-production **[P]** or
recognition-only **[R]** — instead of implying full-paradigm mastery of every
cell, which no A2/B1 learner reaches for the dative moods.

### F4 — Expansion gate interleaves two plural paradigms  ·  criterion 2

**Observed.** O-5 expands `gu`/`zuek`/`haiek` for six verbs at once
(`izan`/`egon`/`ukan`/`joan`/`etorri`/`ikusi`).

**Friction.** Those verbs split across two unrelated plural systems: absolutive
(`gara`/`goaz`, marked on the stem) and ergative (`dugu`/`dute`, a suffix on the
fixed `du-` stem). Bundling them invites `†dugara`/`†garete` chimeras and
ergative-suffix-on-intransitive-subject errors — the very confusion the shipped
doc's own "Ergative Suffix Drift Detection" note anticipates having to catch
later.

**Resolution → P-5, P-6.** Split into two consecutive, internally-homogeneous
units: P-5 *Absolutive Plurals*, P-6 *Ergative Plurals* (framed as "the plural
moved — now it's a suffix"). The shipped journey's good instinct — placing
Expansion early, right after O-4 — is kept.

### F5 — Morphophonology arrives by accident  ·  criterion 3

**Observed.** Verb vocabulary is chosen by communicative theme; the
`-tzen`/`-ten` and `-ko`/`-go` alternations fall wherever the chosen verbs land.

**Friction.** A learner who meets `jaten`/`edaten`/`erosten` (all `-ten`) before
any `-tzen` verb silently induces the wrong rule and mis-produces the first
`-tzen` verb; same for `-ko`/`-go`.

**Resolution → P-11, P-15 (MP tags) + the Pacing Schedule.** Introduce each
alternation with a **minimal pair in the same unit** (`jaten` vs `hartzen`;
`izango` vs `etorriko`), so the conditioning environment is seen, not inferred.
A content-ordering constraint, not an engine change.

### Endorsed without change

- **3-person horizon (Phase I)** — matches frequency, holds working memory at
  the "max 3 persons" ceiling, lets the learner say something true by Unit 1.
- **Functional grouping over grammatical grouping.**
- **Early simple-past pooling (O-8/9)** — tense variety by Unit 9 instead of
  after 8+ present-only units; the redesign's best idea, kept verbatim.
- **Future compression (O-14/15)** — rule once + cross-verb mixer; the model
  application of "compress mechanically-simple concepts." Kept, with the
  Distractor Matrix made to target the one real difficulty (`-ko`/`-go` +
  auxiliary choice).
- **Refresh gates as structural consolidation.** Kept; score-gating made
  concrete (`bestStars >= 2`, replayable soft wall).

### Secondary resolutions folded in

- **Anti-interference spacing (O-20/21 adjacency).** The proposal adds a buffer
  lesson at the tail of P-21 and makes Gate C (P-25) a mandatory score-gated
  pass between the 2-argument and (in Phase V) higher-argument material.
- **2-lesson person-split fatigue.** Kept for hard units; for trivial verbs the
  plural sibling folds into the mixer review (P design principle 6).
- **Distractor floor.** The imperative's small table (P-28) borrows distractors
  from sibling verbs rather than dropping to 3 options.

---

## Coverage-gap matrices (shipped journey)

Agreement pattern × tense/mood as scheduled in the shipped journey.
✅ scheduled · ⚠️ partial/single-pattern or crammed · ❌ gap.

| | Present | Simple past | Imperf. past | Future | Potential | Conditional | Imperative | Subjunctive |
|---|---|---|---|---|---|---|---|---|
| **NOR** | ✅ O-1,4,6 | ✅ O-8,12 | ✅ O-18,19 | ✅ O-14/15 | ✅ O-23 | ✅ O-24 | ✅ O-25 | ⚠️ O-25 |
| **NOR-NORK** | ✅ O-2,3,10,11 | ✅ O-9,13 | ⚠️ O-18 | ✅ O-14/15 | ✅ O-23 | ✅ O-24 | ⚠️ O-25 | ⚠️ O-25 |
| **NOR-NORI** | ✅ O-20 | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | ❌ |
| **NOR-NORI-NORK** | ✅ O-21 | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ O-25 | ❌ |

The gaps cluster entirely in the two dative patterns (F2) and the hard moods
(F3). NOR and NOR-NORK are well covered. See the proposed coverage map (in
`LEARNING_JOURNEY_PROPOSED.md`) for how P-21…P-29 and the [P]/[R]/[—] scoping
close the high-utility gaps while consciously deferring the mastery-tier cells.

---

## Old → new unit mapping

| Shipped (O) | Proposed (P) | Change |
|---|---|---|
| O-1 | P-1 | — |
| O-2 | P-2 | — |
| O-3 | P-3 | — |
| O-4 | P-4 | — |
| O-5 (Expansion, 6 verbs) | **P-5 + P-6** | split: absolutive / ergative plurals (F4) |
| O-6 (ari) | P-7 | renumber |
| O-7 (negation gate) | P-8 | renumber |
| O-8 (Looking Back izan) | P-9 | renumber |
| O-9 (Looking Back ukan) | P-10 | renumber |
| O-10 (Daily Routine) | P-11 | + MP tag (F5) |
| O-11 (eduki/ibili) | P-12 | renumber |
| O-12 (egon past) | P-13 | renumber |
| O-13 (eduki past) | P-14 | renumber |
| O-14 (future rule) | P-15 | + MP tag (F5) |
| O-15 (future mixer) | P-16 | renumber |
| O-16 (behar) | P-17 | renumber |
| O-17 (Gate B) | P-18 | + score-gating made concrete |
| O-18 (imperfective past) | P-19 | renumber |
| O-19 (motion past) | P-20 | renumber |
| O-20 (NOR-NORI present) | P-21 | + buffer lesson (anti-interference) |
| — | **P-22** | new: NOR-NORI past + future (F2) |
| O-21 (NOR-NORI-NORK present) | P-23 | axis-scaffolded |
| — | **P-24** | new: NOR-NORI-NORK past + future (F2) |
| O-22 (Gate C) | P-25 | + dative past/future recombination; mandatory pass |
| O-23 (Ahalera) | P-26 | + [R] scoping for dative |
| O-24 (Conditional) | P-27 | + [R] scoping for dative |
| O-25 (Imperative + Subjunctive) | **P-28 + P-29** | split: commands / subjunctive-as-construction (F3) |
| O-26 (`hi` + hitanoa) | **P-30 + P-31 + P-32 + P-33** | split into four staged units (F1) |
| O-27 (reading) | P-34 | renumber |
| O-28 (causative intransitive) | P-35 | renumber |
| O-29 (causative transitive) | P-36 | renumber |
| O-30 (Gate D) | P-37 | renumber |

30 shipped units → 37 proposed units (net +7: two splits of one unit each, one
three-way net split of O-25, a four-way split of O-26, and two new dative
recombination units).

---

## Adoption order (cheapest-first, dependency-aware)

1. **MP pacing + Pronoun-Fading tags** — pure content ordering; no code.
2. **Expansion split (P-5/P-6)** — reorganize existing data; no new `VERBS`.
3. **Score-gating predicate** — small `getUnlockedLessonIds` change; unblocks
   Gate B.
4. **`ahaztu` data + P-21/P-22** — Tier 1 data; the dative shift incl. past.
5. **Ditransitive axis-fixed data + P-23/P-24** — Tier 1 data + `recipient`/
   `agent` metadata.
6. **Distractor-floor fix** — unblocks P-28 and the small allocutive tables.
7. **P-28/P-29 split + scope conventions** — the subjunctive done right.
8. **P-30…P-33 hitanoa staging** — needs the allocutive data-shape decision
   (`EXERCISE_ENGINE.md` Tier 3).
9. **`-arazi` data + Phase VI** — last, by design.

Adopting any item means updating the shipped `docs/LEARNING_JOURNEY.md`,
`journey.js`, `LESSONS`, and `VERBS` together (per `CLAUDE.md`'s "files to keep
in sync") with a dated `docs/DECISIONS.md` entry — these proposals are not live
until that happens.
