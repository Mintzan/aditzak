# Learning Journey — Evaluation Results

**Status: historical.** Records the findings that motivated `LEARNING_JOURNEY_PROPOSED.md`'s redesign; not itself updated as that proposal is implemented.

Evaluation of the shipped learning journey (`docs/LEARNING_JOURNEY.md` and the
implemented `journey.js`/`LESSONS`, state of 2026-06-14) against the
pedagogical criteria below. The redesigned curriculum these findings motivate is
specified separately in `docs/LEARNING_JOURNEY_PROPOSED.md` (the "proposed
journey"); this document is the *why*, and the map from the shipped units to the
proposed ones. Unit numbers written **O-n** refer to the shipped journey,
**N-n** to the proposed one.

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

The shipped journey is structurally sound on its best ideas — functional
grouping, early simple-past pooling, future compression, and structural refresh
gates all hold up. Eight problems warrant change, grouped by where they sit:

**Front of the course (Phase I–II), highest-leverage because every learner hits
them:**

1. **Unit O-2 crams the single steepest jump** (ergative alignment) together
   with `nahi` and `jakin` — the one place the criteria say to *expand*.
2. **No early consolidation of the `ni`/`nik` case contrast** — ergative drift,
   the most common beginner error, is left unaddressed until Gate C ~20 units
   later.
3. **Several verbs debut in the past before their present** (`jan`/`edan`/
   `erosi` in O-9; `ibili` in O-8), inverting natural vocabulary acquisition.

**Later phases:**

4. **Unit O-26 collapses three independent novelties** (`hi` + toka + noka).
5. **The two dative paradigms are present-only** — NOR-NORI / NOR-NORI-NORK are
   introduced then abandoned at the present tense.
6. **The subjunctive is under-budgeted and mis-framed** — crammed with the
   imperative (O-25) and drilled as isolated morphology.
7. **The Expansion gate (O-5) interleaves two unrelated plural paradigms.**
8. **Morphophonology arrives by accident** — `-tzen`/`-ten` and `-ko`/`-go` are
   never staged as deliberate minimal pairs.

---

## Findings

### F1 — Unit O-26 (`hi` + hitanoa) triple-novelty cliff  ·  criterion 2

**Observed.** O-26 introduces `hi` (a deferred 7th person), allocutive agreement
itself, *and* both gender registers (toka `-k` / noka `-n`) at once.

**Friction.** Three independent novelties are conflated — referential `hi`,
addressee-agreement as a concept (the steepest conceptual jump in the language),
and a masc./fem. bifurcation that doubles the table on appearance. A wrong
answer is undiagnosable: person, register, or gender?

**Resolution → N-32…N-35.** Stage them: N-32 *Meet `hi`* (subject only), N-33
*Toka* (one gender), N-34 *Noka* (as the `-k`→`-n` transform), N-35 *Recombine +
when not to use it*.

### F2 — Dative paradigms are present-only  ·  criteria 1, 2

**Observed.** NOR-NORI enters at O-20 (present), NOR-NORI-NORK at O-21
(present); neither recurs in past/future. The future stage (O-14/15) sits in
Phase II, structurally before the dative system, so it can never reach
`esan`/`eman`; the past pools and conditional/potential units reference §2/§3
(`nor`/`nor-nork`) only.

**Friction.** The highest-utility missing forms are everyday: `esan nion`,
`eman zidan`, `esango dizut`, `gustatu zitzaidan`, `ahaztu zitzaidan` — a direct
asymmetric-practicality failure.

**Resolution → N-24, N-26.** Add NOR-NORI *past+future* (N-24) and
NOR-NORI-NORK *past+future* (N-26) recombination units; defer the advanced
dative moods to **[R]/[—]**.

### F3 — Subjunctive under-budgeted and mis-framed  ·  criteria 1, 2

**Observed.** O-25 teaches the imperative across all agreement patterns *and*
the subjunctive across them, in one unit.

**Friction.** Two different moods share one slot. Worse, the subjunctive surfaces
almost only embedded in subordinate clauses (`Nahi dut etor dadin`), so drilling
isolated conjugation trains the wrong skill.

**Resolution → N-30, N-31 + scope conventions.** Split into N-30 *Commands* and
N-31 *Purpose & Wishing* (subjunctive as a construction, recognition-first); add
the production-vs-recognition scoping rule and Mood Difficulty Ladder.

### F4 — Expansion gate interleaves two plural paradigms  ·  criterion 2

**Observed.** O-5 expands `gu`/`zuek`/`haiek` for six verbs at once across two
unrelated plural systems — absolutive (`gara`/`goaz`, on the stem) and ergative
(`dugu`/`dute`, a suffix on the fixed `du-` stem).

**Friction.** Invites `†dugara`/`†garete` chimeras and ergative-suffix-on-
intransitive-subject errors.

**Resolution → N-7, N-8.** Split into N-7 *Absolutive Plurals* and N-8 *Ergative
Plurals* ("the plural moved — now it's a suffix"); keep the early placement.

### F5 — Morphophonology arrives by accident  ·  criterion 3

**Observed.** Verb vocabulary is chosen by theme; `-tzen`/`-ten` and `-ko`/`-go`
fall wherever the chosen verbs land.

**Friction.** A learner meeting `jaten`/`edaten`/`erosten` (all `-ten`) before
any `-tzen` verb induces the wrong rule.

**Resolution → N-12, N-17 (MP tags) + the Pacing Schedule.** Introduce each
alternation with a minimal pair in the same unit (`jaten` vs `hartzen`; `izango`
vs `etorriko`). *This required adding `hartu` to the daily-routine pool* — the
shipped pool (`jan`/`edan`/`erosi`/`ikusi`) is entirely `-ten`, so it could not
stage the pair on its own.

### F6 — Unit O-2 under-resources the ergative leap  ·  criterion 1  *(new)*

**Observed.** O-2 introduces `ukan` (the absolutive→ergative subject shift —
`nik … dut`, the single steepest conceptual jump in Basque) **together with**
`nahi` and `jakin` in one unit.

**Friction.** The criteria explicitly call for *disproportionately more* content
on ergative alignment; the shipped journey instead dilutes the first ergative
exposure with two additional constructions, so the `ni`→`nik` "aha" competes for
attention the moment it appears.

**Resolution → N-2, N-4.** Give `ukan` its own introduction unit (N-2, the
ergative leap, object fixed `hura`), with `jakin`+`nahi` following as
reinforcement (N-4) — `jakin` showing the *same* ergative suffixes on a
synthetic verb. Unit N-2 carries extra practice isolating the `ni`→`nik` shift.

### F7 — No early absolutive/ergative case-marking consolidation  ·  criteria 1, 2  *(new)*

**Observed.** The shipped journey introduces `ni naiz` (O-1) and `nik dut` (O-2)
but never isolates the *contrast*; the first unit to drill case-marking as such
is Gate C (O-22), roughly twenty units later. The shipped engine even carries an
"Ergative Suffix Drift Detection" design note — an admission that the `†Nik
naiz` error is expected and currently uncaught.

**Friction.** The highest-frequency beginner error (ergative `-k` drift) is left
to chance through the entire early course.

**Resolution → N-3.** A dedicated **"Ni vs. Nik" case-marking checkpoint**
immediately after `ukan`, drilling bare (`izan`/`egon`) vs. ergative (`ukan`)
subjects — the Phase-I counterpart of Gate C, killing the error at its source.

### F8 — Verbs debut in the past before their present  ·  criterion 1  *(new)*

**Observed.** `jan`/`edan`/`erosi` first appear in the `ukan` past pool (O-9)
before their present (O-10); `ibili` first appears in the `izan` past pool (O-8)
before its present (O-11).

**Friction.** A learner meets "I ate the apple" before "I eat the apple" — the
verb's *meaning* debuts in a harder tense than necessary, inverting natural
acquisition order.

**Resolution → reorder Phase II + N-6.** Order Phase II so present pools precede
past pools (N-12 daily-routine present before N-13 `ukan` past pool); introduce
`ibili` present with the movement verbs (N-6) so it precedes its past (N-11).
The early-past-variety win is preserved — the `izan` past pool (N-11) still
lands immediately after Phase I, and every verb in it is already known in the
present.

### Endorsed without change

- **3-person horizon (Phase I)** — re-examined and kept: it matches frequency,
  holds working memory at the "max 3 persons" ceiling, and lets the learner say
  something true by Unit 1.
- **Functional grouping; early simple-past pooling (O-8/9 → N-11/13); future
  compression (O-14/15 → N-17/18); refresh gates** — kept, gates now score-gated.

---

## Coverage-gap matrices (shipped journey)

Agreement × tense/mood as scheduled in the shipped journey.
✅ scheduled · ⚠️ partial/crammed · ❌ gap.

| | Present | Simple past | Imperf. past | Future | Potential | Conditional | Imperative | Subjunctive |
|---|---|---|---|---|---|---|---|---|
| **NOR** | ✅ O-1,4,6 | ✅ O-8,12 | ✅ O-18,19 | ✅ O-14/15 | ✅ O-23 | ✅ O-24 | ✅ O-25 | ⚠️ O-25 |
| **NOR-NORK** | ✅ O-2,3,10,11 | ✅ O-9,13 | ⚠️ O-18 | ✅ O-14/15 | ✅ O-23 | ✅ O-24 | ⚠️ O-25 | ⚠️ O-25 |
| **NOR-NORI** | ✅ O-20 | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | ❌ |
| **NOR-NORI-NORK** | ✅ O-21 | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ O-25 | ❌ |

Gaps cluster in the two dative patterns (F2) and the hard moods (F3); the
front-of-course findings (F6–F8) are sequencing/scaffolding rather than coverage
gaps. See the proposed coverage map (`LEARNING_JOURNEY_PROPOSED.md`) for how the
[P]/[R]/[—] scoping closes the high-utility gaps while deferring mastery-tier
cells.

---

## Old → new unit mapping

| Shipped (O) | Proposed (N) | Change |
|---|---|---|
| O-1 | N-1 | — |
| O-2 (ukan + nahi + jakin) | **N-2 + N-3 + N-4** | split: ergative `ukan` alone (N-2) / `ni`-vs-`nik` checkpoint (N-3, new) / `jakin`+`nahi` (N-4) — F6, F7 |
| O-3 (ikusi) | N-5 | renumber |
| O-4 (joan + etorri) | N-6 | + `ibili` present (F8) |
| O-5 (Expansion, 6 verbs) | **N-7 + N-8** | split: absolutive / ergative plurals (F4) |
| O-6 (ari) | N-9 | renumber |
| O-7 (negation gate) | N-10 | renumber |
| O-8 (Looking Back izan) | N-11 | renumber (now precedes the verbs whose present moved earlier) |
| O-10 (Daily Routine present) | N-12 | **moved before** the ukan past pool (F8); + `hartu` for the MP pair (F5) |
| O-9 (Looking Back ukan) | N-13 | **moved after** Daily Routine (F8) |
| O-11 (eduki + ibili) | N-14 | `eduki` present only; `ibili` present moved to N-6 (F8) |
| O-13 (eduki past) | N-15 | renumber (now adjacent to eduki present) |
| O-12 (egon past) | N-16 | renumber |
| O-14 (future rule) | N-17 | + MP tag (F5) |
| O-15 (future mixer) | N-18 | renumber |
| O-16 (behar) | N-19 | renumber |
| O-17 (Gate B) | N-20 | + score-gating made concrete |
| O-18 (imperfective past) | N-21 | renumber |
| O-19 (motion past) | N-22 | renumber |
| O-20 (NOR-NORI present) | N-23 | + buffer lesson (anti-interference) |
| — | **N-24** | new: NOR-NORI past + future (F2) |
| O-21 (NOR-NORI-NORK present) | N-25 | axis-scaffolded |
| — | **N-26** | new: NOR-NORI-NORK past + future (F2) |
| O-22 (Gate C) | N-27 | + dative past/future recombination; mandatory pass |
| O-23 (Ahalera) | N-28 | + [R] scoping for dative |
| O-24 (Conditional) | N-29 | + [R] scoping for dative |
| O-25 (Imperative + Subjunctive) | **N-30 + N-31** | split: commands / subjunctive-as-construction (F3) |
| O-26 (`hi` + hitanoa) | **N-32 + N-33 + N-34 + N-35** | split into four staged units (F1) |
| O-27 (reading) | N-36 | renumber |
| O-28 (causative intransitive) | N-37 | renumber |
| O-29 (causative transitive) | N-38 | renumber |
| O-30 (Gate D) | N-39 | renumber |

30 shipped units → 39 proposed units. The net +9 comes from: O-2 → three units
(F6/F7), O-5 → two (F4), O-25 → two (F3), O-26 → four (F1), and two new dative
recombination units (F2); the Phase II reorder and `ibili`/`hartu` moves (F5/F8)
add no units, only reshuffle.

---

## Adoption order (cheapest-first, dependency-aware)

1. **MP pacing + Pronoun-Fading tags** — content ordering; no code.
2. **Phase I ergative restructure (N-2/N-3/N-4) + Phase II reorder (F8)** —
   reorganize existing data; minimal new data (`hartu`).
3. **Expansion split (N-7/N-8)** — reorganize existing data.
4. **Score-gating predicate** — small `getUnlockedLessonIds` change.
5. **`ahaztu` data + N-23/N-24** — Tier 1 data; the dative shift incl. past.
6. **Ditransitive axis-fixed data + N-25/N-26** — Tier 1 data + `recipient`/
   `agent` metadata.
7. **Distractor-floor fix** — unblocks N-30 and the small allocutive tables.
8. **N-30/N-31 split + scope conventions** — the subjunctive done right.
9. **N-32…N-35 hitanoa staging** — needs the allocutive data-shape decision.
10. **`-arazi` data + Phase VI** — last, by design.

Adopting any item means updating the shipped `docs/LEARNING_JOURNEY.md`,
`journey.js`, `LESSONS`, and `VERBS` together (per `CLAUDE.md`'s "files to keep
in sync") with a dated `docs/DECISIONS.md` entry — these proposals are not live
until that happens.
