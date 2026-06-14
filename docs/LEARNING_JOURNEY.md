# Aditzak — Learning Journey (acquisition order)

> **37-unit layout** (renumbered 2026-06-14, issue #137/#149 — see
> `docs/DECISIONS.md`). Unit numbers here are "P-n" in
> `docs/LEARNING_JOURNEY_PROPOSED.md`, the self-contained reference spec for
> the full design (Pronoun-Fading Matrix, morphophonological pacing,
> production/recognition scoping, the Distractor Engine Matrix, and the
> architectural data resolutions for the still-pending units).
> `docs/LEARNING_JOURNEY_EVALUATION.md` records *why* — the findings that
> motivated this layout and the old (O-n) → new (P-n) mapping.
>
> Units 1–16 are implemented — see `journey.js`'s `available` units and
> `LESSONS` in `src/data/lessons.js`. Units 6, 17+ remain content design only —
> no exercises, no `VERBS` data yet (Unit 6 is a new split-off of the old
> Expansion unit; its content currently still lives inside Unit 5, see below).
> Units are ordered by communicative goal rather than grammatical category, and
> prioritize usefulness over implementation-ease where the two trade off.

## Core pedagogical realignment

1. **The "Me, You, and It" horizon.** Real conversation runs overwhelmingly on
   `ni`/`zu`/`hura` (1sg, 2sg-neutral, 3sg). Every verb's *first* lesson is
   restricted to these three forms; `gu`/`zuek`/`haiek` are unlocked across
   Units 5–6 (the Expansion units) once enough verbs exist to make the
   expansion feel like "more of what you know" rather than "six new words."
2. **`zu` is the default "you," from lesson one.** `zu` is foundational from
   the start, and `hi` is **deferred** to Phase V's Stage 12 (Units 30–33),
   which teaches it *together with* the allocutive register (hitanoa), staged
   across four units rather than crammed into one — see
   `LEARNING_JOURNEY_EVALUATION.md` finding F1. The "core" person grid for
   Phases I–IV is `ni/zu/hura/gu/zuek/haiek`.
3. **Functional grouping over grammatical grouping.** A learner doesn't care
   that `ikusi` is periphrastic and `eduki` is synthetic — both just say
   "I see / I have." Units are named for what they let you *say*
   (Location & State, Movement, Daily Routine, ...), drawing from whichever
   verb shape fits, with the synthetic/periphrastic distinction explained
   in passing rather than used as a unit boundary.
4. **Refresh Gates are structural, not optional.** Gate units (`gate: true`:
   Units 8, 18, 25, 37) introduce **zero new verbs** — pure consolidation,
   negation drills, person-grid expansion, or cross-paradigm "which suffix
   goes where" sorting. Units 18, 25, and 37 are **score-gated**: the next unit
   unlocks only once `bestStars >= 2` (≥80%) on the gate, per
   `LEARNING_JOURNEY_PROPOSED.md`'s scope.
5. **Expansion is two units, not one.** Units 5–6 complete the `gu`/`zuek`/
   `haiek` columns for every verb introduced so far (`izan`, `egon`, `ukan`,
   `joan`, `etorri`, `ikusi`), split by paradigm: Unit 5 covers the
   **absolutive** plural (`gara`/`goaz` — marked on the stem: `izan`, `egon`,
   `joan`, `etorri`), Unit 6 the **ergative** plural (`dugu`/`dute` — a suffix
   on the fixed `du-` stem: `ukan`, `ikusi`). Splitting them prevents
   `†dugara`-type blending (`LEARNING_JOURNEY_EVALUATION.md` finding F4).
   **Current status**: Unit 5's shipped lessons (`unit-6-review-*`,
   `ikusi-present-plural*`) still mix both paradigms — issue #143 will
   redistribute the `ukan`/`ikusi` lessons into Unit 6. From Unit 9
   onward, **every new verb is taught with its full 6-person grid**
   (`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`) — but per the app-wide "max 3 persons
   per exercise" rule (`docs/DECISIONS.md`, 2026-06-12), that grid is split
   across **two** lessons per (verb × tense) — a `ni`/`zu`/`hura` lesson
   immediately followed by a `gu`/`zuek`/`haiek` `-plural` sibling.
6. **Difficulty-weighted extra practice.** Most units introduce one new verb
   in a pattern the learner already knows (same `nor`/`nor-nork` shape, just
   new vocabulary) and get the standard treatment: one practice lesson per new
   (verb × tense), plus the auto-generated verb/mixed reviews from
   `docs/DECISIONS.md`'s "ramps up in three stages" entry. A handful of units
   instead introduce a *new grammatical relation or register* the learner has
   never used before — these get one or more **additional dedicated practice
   lessons** (beyond the standard verb-review), drilling that new relation in
   isolation, before the unit's own review caps it off. Flagged units (see
   `LEARNING_JOURNEY_PROPOSED.md` for the per-lesson breakdown of each):
   - **Unit 2** — first `nor-nork`/ergative subject (`ukan`); `jakin`
     reinforces this immediately afterward by showing the *same* `-t`/`-zu`/∅
     suffixes on a fully synthetic verb, not a periphrastic one
   - **Unit 21** — first NOR-NORI / dative-subject forms (`zait`/`zaizu`/`zaio`),
     four extra lessons ending with a case-frame buffer before Unit 23
   - **Unit 23** — first NOR-NORI-NORK / ditransitive — the steepest jump in
     the whole sequence, gets **four** extra practice lessons, axis-scaffolded
   - **Unit 28** — imperative (a new register), with the distractor-floor fix
   - **Unit 29** — subjunctive as a construction (a new register)
   - **Units 30–33** — `hi` + hitanoa, staged across four units (one extra
     lesson each) instead of crammed into one
   - **Unit 35** — first valency-*increasing* derivation (`-arazi` turning
     `nor` into `nor-nork`) — a new morphological operation, not just new
     vocabulary in a known pattern
   - **Unit 36** — extends `-arazi` to `nor-nori-nork` — same "steepest jump"
     character as Unit 23, gets extra practice lessons like it did

   The "Looking Back I/II" units (9-10, 13-14) are deliberately **not** on this
   list — they pair an already-taught verb's *simple past* with its present,
   the same `nor`/`nor-nork` shape the learner already drilled in Units 1-2/
   4/11-12, so nothing here is a "new relation" in this section's sense.

   These extra lessons compound with the engine's per-lesson ramp (a lesson's
   first `BARE_FORM_ATTEMPTS` attempts stay multiple-choice/recognition-only,
   and a one-time conjugation-table preview is shown before a lesson's first
   attempt — see `App.jsx`'s `LessonPreviewScreen`), so a hard unit gets both
   *more lessons* and *more gentle reps within each lesson* than an easy one —
   without changing the linear `getUnlockedLessonIds` unlock model or the
   stored-progress shape.

## Data & architecture implications (read before building)

These are the things this journey *requires* that don't exist yet — flagged
here so they're decided once, deliberately, rather than discovered mid-build.
The architectural resolutions for `ahaztu`, the `esan`/`eman` ditransitive
slices, and `-arazi` are spelled out in full in
`LEARNING_JOURNEY_PROPOSED.md`'s "Architectural data resolutions" section.

- **`egon`/`joan`/`etorri`/`ibili` (§6) already have `zu` rows** — §6's data
  was written with 7 persons (`ni`/`hi`/`hura`/`gu`/`zu`/`zuek`/`haiek`) from
  the start, so this journey just stops asking for `hi`'s row until Unit 30.
- **§6's "Past" column for `joan`/`etorri`/`ibili` is imperfective
  ("I was going" — `nindoan`, `zetorren`), not simple past ("I went" —
  periphrastic `joan nintzen`).** Those forms express ongoing/habitual past
  motion, the opposite of "completed."
  **Resolved**: simple/completed past for `joan`/`etorri`/`ibili`
  (`joan nintzen`, `etorri nintzen`, `ibili nintzen`) was implemented in Units
  9 and 13 ("Looking Back I/II") via the periphrastic Lehenaldi Mugatua
  pattern (§11: perfective participle + `izan`'s past auxiliary, §1) — see
  `docs/LANGUAGE_DECISIONS.md`. Unit 20 ("Motion in Progress (Past)") remains
  pending for §6's distinct imperfective forms (`nindoan`/`zetorren`/
  `nenbilen`).
- **Restricting a lesson to `ni`/`zu`/`hura`** isn't something the current
  `generateQuestions`/`conjugations` shape distinguishes by default.
  **Resolved** via a `persons` filter on lessons, applied retroactively where
  needed — see `docs/EXERCISE_ENGINE.md`'s "Phase I's 3-person horizon" and
  `docs/DECISIONS.md`'s 2026-06-12 entries. The app-wide rule is: never drill
  more than 3 grammatical persons in a single exercise.
- **Negation (`ez`) drills (Unit 8)** needed a sentence pattern this app
  didn't have: Basque negation moves the auxiliary in front of the
  participle/predicate (`Mutila etorri da` → `Mutila ez da etorri`), so it's
  not just "swap in a different conjugated form" — the *word order* changes.
  **Resolved**: implemented as a `negativeSentences` table (mirroring
  `pronounSentences`'s shape) plus `negative`/`type-negative` question kinds —
  see `docs/DECISIONS.md`'s "Implemented Unit 5" entry (predates this
  redesign's renumbering; that unit is now Unit 8). **Refresh Gate C (Unit
  25)** drills the same "candidate full sentences, pick the right/wrong one"
  shape for NOR/NORI/NORK role-swaps instead of negation, and is expected to
  reuse this same question-kind machinery with a role-swapped sentence-pair
  source.
- **Score-gating (Units 18, 25, 37)** needs `getUnlockedLessonIds` to check
  `bestStars >= 2` on the gate's review lesson before unlocking the next unit,
  with the gate itself remaining replayable on a sub-threshold attempt (no
  hard lockout) — see `LEARNING_JOURNEY_PROPOSED.md`'s "Score-gating
  predicate" and issue #138.
- **Causative (`-arazi`/`-erazi`, Phase VI, Units 35-37) needs no new data
  shape** — per VERB_COVERAGE §6, a causativized verb is just another
  `type: 'periphrastic'` entry (`[radical]+(a/e)razi` participle + `izan`/
  `ukan` auxiliary), so its `conjugations`/`sentences`/`pronounSentences`
  tables follow the Tier 1 pattern in `EXERCISE_ENGINE.md`. The only new work
  is content: picking representative verbs and writing their causativized
  forms — `docs/SAMPLE_SENTENCES.md`'s causative bank is the starting
  material. The `-arazi`/`-erazi` conditioning rule is specified in
  `LEARNING_JOURNEY_PROPOSED.md`.
- **`jakin`'s past tense (`CONJUGATIONS.md` §7) has gaps** (`hik`/`zuk`/`zuek`
  are `—`) — irrelevant to Unit 2 (present-only, `ni`/`zu`/`hura`, all three
  present forms already documented). This is why `jakin` was left out of Unit
  9 ("Looking Back I — I Was, I Had") despite riding `ukan`'s suffix family
  there too — see `docs/LANGUAGE_DECISIONS.md` for the deferral. Revisit if
  `jakin`'s past gap gets sourced.
- **Unit 7's `ari` examples need at least one verb's imperfective participle
  as vocabulary** before any concrete "I am doing X" sentence can be written —
  `jaten` (`jan`'s participle, Unit 11's verb) is the natural choice, since
  Unit 11 will teach `jan`'s full table anyway, so introducing its participle
  here costs nothing extra later and gives Unit 11 a head start.

## The journey

### Phase I — Survival Present (Me, You, & It)

Persons in scope throughout Phase I: **`ni` / `zu` / `hura`** only (plurals
arrive at Units 5–6). Pronoun stage: **A (explicit)**.

#### Stage 1: Absolute Foundations

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 1 | **Who and Where** — `izan` + `egon` present | "I am a student." / "Where are you?" / "He is at home." | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1 (izan), §6 (egon) | ✅ implemented |
| 2 | **Having, Wanting, and Knowing** — `ukan` present (object fixed `hura`) + `nahi` + `jakin` | "I have a car." / "I want coffee." / "Do you want to come?" / "I don't know." | ni/zu/hura: `dut`/`duzu`/`du`, `nahi dut`/`nahi duzu`/`nahi du`, `dakit`/`dakizu`/`daki` | §3 (ukan), VERB_COVERAGE §5 (`nahi`), §7 (`jakin`) | ✅ implemented |
| 3 | **Seeing** — `ikusi` present (ni/zu/hura), Phase I's first periphrastic verb | "I see the mountain." / "Do you see it?" / "She sees the film." | ni/zu/hura: `ikusten dut`/`ikusten duzu`/`ikusten du` | §7 (ikusi) | ✅ implemented — reuses `ikusi`'s existing 6-person `present` table via `persons: PHASE_1_PERSONS` |

#### Stage 2: Operations, Movement & Expansion

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 4 | **Moving Around** — `joan` + `etorri` present | "I'm going to the beach." / "She's coming tomorrow." | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator` | §6 | ✅ implemented |
| 5 | 🛡️ **Expansion: Absolutive Plurals** | "We are teachers." (`Irakasleak gara.`) / "You all are at home." (`Etxean zaudete.`) / "We're going to the beach." (`Hondartzara goaz.`) | gu/zuek/haiek (`nor`): `izan`, `egon`, `joan`, `etorri` | §1/§6 | ✅ implemented — currently still carries the `ukan`/`ikusi` (ergative) lessons too; #143 redistributes those into Unit 6 |
| 6 | 🛡️ **Expansion: Ergative Plurals** | "We have a car." (`Auto bat dugu.`) / "They watch the film." (`Filma ikusten dute.`) | gu/zuek/haiek (`nor-nork`): `ukan`, `ikusi` | §3/§7 | pending — content currently lives inside Unit 5's lessons (`unit-6-review-1`, `ikusi-present-plural*`); #143 splits it out |
| 7 | **The Immediate Continuous** — `ari` + `izan` | "What are you doing?" (`Zer ari zara?`) / "I'm eating." (`Jaten ari naiz`) | reuses Unit 1's `izan` present table under `ari` | VERB_COVERAGE §5 | ✅ implemented — `jaten` (`jan`'s imperfective participle, Unit 11's verb) introduced here as a single fixed vocabulary item |

### 🛡️ Refresh Gate A — The "Ez" Trap

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 8 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | Drills `ez` + auxiliary-fronting across Units 1–7's verbs (`Mutila etorri da` → `Mutila ez da etorri`). `ikusi` (Unit 3) has no `negativeSentences` — like `nahi`/`ari`, its auxiliary splits from the invariant participle under negation, out of scope for this exclusive-negation lesson. |

---

### Phase II — Transitivity & Everyday Life

Persons in scope from here on: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`**
grid, every verb, from each verb's first lesson. Pronoun stage: **B
(optional)**.

#### Stage 3: Looking Back I

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 9 | **Looking Back I — The "izan" Past Pool** — the `izan` past auxiliary (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`), mixed across `izan`, `joan`, `etorri`, `ibili` | "I was young." / "I went to the beach." / "She came yesterday." / "We wandered around town." | `izan`: §1; `joan`/`etorri`/`ibili`: §11 (periphrastic Lehenaldi Mugatua) + §1 (`izan` past auxiliary) | ✅ implemented |
| 10 | **Looking Back I — The "ukan" Past Pool** — the `ukan` past auxiliary (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`), mixed across `ukan`, `jan`, `edan`, `erosi`, `ikusi` | "I had a car." / "I ate the apple." / "You drank coffee." / "We bought a house." / "She saw the film." | `ukan`: §3; `jan`/`edan`/`erosi`/`ikusi`: §7 (periphrastic, participle + `ukan` past auxiliary) | ✅ implemented |

Each unit pools its verbs the way Unit 11 pools `jan`/`edan`/`erosi`/`ikusi`'s
present tense (`docs/DECISIONS.md`): one drill per person, but which verb's
participle supplies a given question varies question-to-question, instead of
marching through one verb's full table at a time — `izan`/`joan`/`etorri`/
`ibili` share *exactly* the same past-auxiliary shape, as do `ukan`/`jan`/
`edan`/`erosi`/`ikusi` (see issue #84). `egon` and `eduki` each have their own
distinct synthetic past paradigm and fit neither pool — they get their own
units in Stage 5 instead.

Pairing each verb group's simple past with its present soon after — rather
than saving *all* past tense for Phase III — is this journey's central idea:
tense variety (present → past → future) now arrives by Unit 10, instead of
after 8+ units of present-only drilling.

#### Stage 4: Real-World Actions

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 11 | **Daily Routine (Transitive)** — the `ukan` present auxiliary (`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`), drilled across a pool of verbs (`jan`, `edan`, `erosi`, `ikusi`) rather than one lesson per verb. **MP**: first `-tzen`/`-ten` minimal pair (`jaten` vs. `hartzen`). | "I eat." / "You drink water." / "I buy a book." / "Do you see it?" | §7 | ✅ implemented |
| 12 | **Physical States & Possessions** — `eduki`, `ibili` full 6-person grids | "I have the keys in my pocket." / "They are wandering around town." | §7 (eduki), §6 (ibili) | ✅ implemented |

`ikusi` moved to Unit 3 as Phase I's first periphrastic verb, but rejoins
Unit 11's verb pool here — it already has full present-tense
`sentences`/`pronounSentences`, so it costs nothing extra to include.

#### Stage 5: Looking Back II

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 13 | **Looking Back II — "I Was There"** — `egon` simple past, its own synthetic paradigm (`nengoen`/`zeunden`/`zegoen`/`geunden`/`zeundeten`/`zeuden`), full 6-person grid | "I was at home." / "We were at the beach." | §6 | ✅ implemented |
| 14 | **Looking Back II — "I Had It"** — `eduki` simple past, its own synthetic paradigm (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/`zeukaten`), full 6-person grid | "I had the keys." / "We had time." | §7 | ✅ implemented |

Stage 3's two pools (above) cover every verb whose past tense rides a shared
auxiliary; Stage 5 covers the two "odd ones out" (`egon`, `eduki`) whose past
forms don't pool with anything — `joan`/`etorri`/`ibili`'s past moved into
Unit 9's pool and `jan`/`edan`/`erosi`/`ikusi`'s into Unit 10's, so neither
appears here anymore (see issue #84).

#### Stage 6: The Future (*Geroa*)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 15 | **The Future Rule** — forming the future with `-ko`/`-go` + present auxiliaries, taught on a three-verb core (`izan`, `ukan`, `joan`) spanning both auxiliary patterns (`nor`/`naiz` and `nor-nork`/`dut`). **MP**: first `-ko`/`-go` minimal pair (`izango` vs. `etorriko`). | "I will be a teacher" (`irakasle izango naiz`) / "We will have a car" (`autoa izango dugu`) / "I will go tomorrow" (`bihar joango naiz`) | §11 (periphrastic tense matrix) | ✅ implemented |
| 16 | **The Future, Across Every Verb** — the same `-ko`/`-go` rule applied across all remaining known verbs (`egon`, `etorri`, `ibili`, `jan`, `edan`, `erosi`, `ikusi`, `eduki`, `nahi`, `jakin`), drilled as cross-verb mixer reviews rather than per-verb tables | "You will see it" (`ikusiko duzu`) / "We will buy a house" (`etxe bat erosiko dugu`) / "Will you know?" (`jakingo duzu?`) | §11 | ✅ implemented |
| 17 | **Requirements & Obligations** — `behar` + `ukan`, present and future | "I have to go." (`Joan behar dut`) / "You'll have to come." (`Etorri beharko duzu`) | VERB_COVERAGE §5 (point 2 — the construction's head, not the lexical verb, picks the auxiliary) | pending — reuses `ukan` tables exactly like Unit 2's `nahi`; payload deliberately reuses Unit 4's intransitive `joan`/`etorri` (`naiz`-pattern alone) to surface the `behar`-always-takes-`ukan` "aha" moment |

The Basque future is morphologically trivial — one participle rule (`-ko`/`-go`)
layered onto auxiliaries already mastered in Units 1-14 — so Stage 6 teaches
that rule once (Unit 15) and then spreads it across the remaining verbs as
cross-verb *mixer reviews* (Unit 16) rather than re-drilling each verb's table
one at a time. See `docs/DECISIONS.md` (2026-06-14, "Compressed the future
stage").

### 🛡️ Refresh Gate B — The Core Tense Checkpoint

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 18 | **REFRESH — Cumulative Present/Past/Future Mixer** | zero new verbs; **score-gated** (`bestStars >= 2`) | Mixes synthetic + periphrastic, positive + negative (reuses Gate A's negation pattern), and present + past + future — the full tense range Units 1-17 introduced. |

---

### Phase III — Shifting to the Past (aspect)

Pronoun stage: **C (pro-drop default)**.

#### Stage 7: Aspect in the Past

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 19 | **"I Used To..." — The Imperfective Past** | "I used to come here every day." / "I was working when she called." | imperfective/habitual past (`etortzen nintzen`, "I used to come / I was coming") — distinct from the simple past taught in Units 9/10/13/14 | pending |
| 20 | **Motion in Progress (Past)** — `joan`/`etorri`/`ibili`'s native imperfective past forms (`nindoan`, `zetorren`) | "I was on my way (when...)." / "He was coming (and then...)." | §6 | pending — ✅ already in §6's tables; framed explicitly as imperfective/progressive, contrasted with Units 9/13's `joan nintzen`/`ibili nintzen` |

This phase is narrower than the surrounding ones — completed simple past
("I went", "I saw", "I ate", "I had") moved to Units 9/10/13/14, so Phase III's
two units cover only the genuinely *new* aspectual forms — habitual/ongoing
past, not "first past exposure."

---

### Phase IV — Interpersonal & Relationship Dynamics

Pronoun stage: **D (full null-anaphora; dative/ergative droppable)**.

#### Stage 8: The Dative Shift (NOR-NORI)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 21 | **Pleasures, Opinions, Feelings** — present NOR-NORI, 3rd-person subjects (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`) | "I like it." / "It seems good to me." / "I forgot (it slipped my mind)." | §4 (gustatu, iruditu, ahaztu) | pending — see `LEARNING_JOURNEY_PROPOSED.md` for `ahaztu`'s data shape and the four-lesson extra-practice sequence ending in a case-frame buffer |
| 22 | **Dative Across Time** — NOR-NORI **past + future**, recombining Unit 21's grid with the periphrastic past and `-ko`/`-go` future | "I liked it yesterday." (`Atzo gustatu zitzaidan`) / "I'll forget the keys." (`Giltzak ahaztuko zaizkit`) | §4; §11 | pending — **new unit** (closes `LEARNING_JOURNEY_EVALUATION.md` finding F2) |

#### Stage 9: Communication & Giving (NOR-NORI-NORK)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 23 | **Communication & Giving** — present NOR-NORI-NORK (`esan`, `eman`), axis-scaffolded | "I give it to him" (`ematen diot`) / "You tell it to him" (`esaten diozu`) | §5, §8 | pending — ✅ documented; see `LEARNING_JOURNEY_PROPOSED.md` for the axis-fixed deployment (`recipient`/`agent` metadata) and the four-lesson extra-practice sequence |
| 24 | **Telling & Giving Across Time** — NOR-NORI-NORK **past + future**, reusing the periphrastic past and `-ko`/`-go` future on Unit 23's axis-fixed slices | "I told him." (`Esan nion`) / "He gave it to me." (`Eman zidan`) / "I'll tell you tomorrow." (`Bihar esango dizut`) | §5; §11 | pending — **new unit** (closes finding F2) |

### 🛡️ Refresh Gate C — The Multi-Argument Audit

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 25 | **REFRESH — The Case-Ending Mixer** | zero new verbs; **score-gated**, mandatory pass before Phase V | Isolates and drills the NOR/NORK/NORI distinction — sentences that swap which argument is absolutive vs. ergative vs. dative, heading off the classic "mixed up the `-k`" error — plus a dative past/future recombination drill bridging Units 22/24. |

---

### Phase V — Nuance, Modality, & Social Context

#### Stage 10: Hypotheticals & Potentials

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 26 | **Permissions & Capability (Ahalera)** — `dezaket`/`naiteke` contrasted with periphrastic `ahal izan` | "I can come." / "I could (have) ..." | NOR/NOR-NORK [P]; dative [R] | §2, §3, VERB_COVERAGE §5 (`ahal`/`ezin`) | pending |
| 27 | **Conditionals (Baldintza & Ondorioa)** — `ba-` protasis + `-ke` apodosis | "If I had money, I would buy that" (`Dirua banu, hori erosiko nuke`) | NOR/NOR-NORK [P]; dative [R] | §2, §3 | pending |

#### Stage 11: Directives & Wishes

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 28 | **Commands (Agintera)** — the imperative | "Come!" (`Etorri!`) / "Do the work." (`Egizu lan`) / "Give me water." (`Emadazu ura`) | NOR/NOR-NORK [P]; ditransitive (`iezadazu`) [R] | §16 | pending — distractor-floor fix needed (small tables borrow sibling-verb forms) |
| 29 | **Purpose & Wishing (Subjuntiboa)** — the subjunctive **as a construction** (matrix verb + subordinate clause) | "I want him to come." (`Nahi dut etor dadin`) / "She told him to come." (`Esan dio etor dadila`) / "...so that he sees it." (`...ikus dezan`) | NOR/NOR-NORK 3rd-person in-construction [P]; dative [R] | §16 | pending |

Two different moods with different difficulty profiles get their own units —
the imperative is concrete, high-utility, and second-person, taught first; the
subjunctive barely exists as a standalone form outside subordinate clauses, so
Unit 29 teaches it as a *syntactic construction*, recognition-first (see
`LEARNING_JOURNEY_EVALUATION.md` finding F3).

#### Stage 12: The Intimate Register (`hi` + Hitanoa)

`hi` enters here for the first time. Four units stage three independent
novelties — new person, addressee-agreement, gender — one at a time (see
`LEARNING_JOURNEY_EVALUATION.md` finding F1).

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 30 | **Meet "hi"** (no allocutivity) — `hi` as a subject in known paradigms | `Hi ikaslea haiz.` / `Hago lasai.` / `Hator hona.` / `Hik badakik?` | §3/§6 | pending |
| 31 | **Toka (masculine allocutive)** — addressee-agreement on 3rd-person statements, one gender | `Lanean dik.` / `Etorri duk.` / `Ez nauk ondo.` | §10 | pending |
| 32 | **Noka (feminine allocutive)** — taught as the `-k`→`-n` transform of Unit 31 | `Lanean din.` / `Etorri dun.` / `Ez naun ondo.` | §10 | pending |
| 33 | **Hitanoa Recombined** — mixed toka/noka + *when not to use it* (subordinate clauses, formal `-ke-` moods) | choose register by addressee gender | §10, `LANGUAGE_DECISIONS.md` 2026-06-11 | pending |

#### Stage 13: Reading Real Text

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 34 | **Passive & Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | comprehension over real sentences | [R] throughout | §14/§15 | pending — new `reading` question kind |

---

### Phase VI — Making Things Happen (Causatives)

Persons in scope: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`** grid plus `hi`
(available since Unit 30). The causative is a *morphological operation*
(`-arazi`) that recombines everything prior; placed last so every piece it
recombines already exists.

#### Stage 14: The Causative Suffix (`-arazi`)

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 35 | **Making Someone Do It** — `-arazi` on intransitives (`nor`→`nor-nork`) | "The storm made the climbers turn back." (`itzularazi zituen`) / "The music made the kids dance." (`dantzarazi ditu`) | present/past/future [P] | VERB_COVERAGE §6 | pending |
| 36 | **Making Someone Do Something to Someone** — `-arazi` on transitives (`nor-nork`→`nor-nori-nork`) | "Grandma made the kids eat the beans." (`janarazi zizkien`) / "The teacher made the students write it." (`idatzarazi die`) | present/past/future [P] | VERB_COVERAGE §6 | pending |

#### 🛡️ Refresh Gate D — The Causative Recombination

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 37 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs; **score-gated** | Recombines Units 35-36's `-arazi` forms with future (Units 15-16), conditional (Unit 27), and imperative (Unit 28) — "makes/made/will make/would make/make (someone do X)". |

---

## App engine logic — design notes (not part of the content sequence)

Two engine-level proposals are genuinely good ideas but are
**feature/architecture work**, not curriculum content — noted
here so they're not lost, but deliberately *not* folded into the unit
sequence above.

### 1. Periodic "Time-Delay" Flash Drill
Every ~5 lessons, inject a short (5-question) speed drill pulled from the
user's lowest-scoring *completed* lesson(s), gating access to the next
content lesson. Mechanically: a synthetic `review`-shaped lesson generated
at runtime (not a fixed entry in `LESSONS`) whose `sources` are picked from
`progress` (lowest `bestScore` entries) rather than being statically
authored. This is a bigger change than anything else in this document — it
turns part of `LESSONS` from "static, derived from `VERBS`" into "dynamic,
derived from `progress`" — worth its own design pass.

### 2. Ergative Suffix Drift Detection
Track a specific error pattern (applying `-k`/ergative marking to an
intransitive subject, e.g. "Nik naiz" for "Ni naiz") across consecutive
answers; after two in a row, inject a targeted "Syntactic Role Sorting"
mini-lesson before returning to the main track. This requires per-question
*error categorization* (not just right/wrong) — `exerciseReducer` would need
to classify *why* an answer was wrong, which the current data model
(multiple-choice over plain conjugated forms) doesn't carry enough
information to do without new metadata on distractor options (e.g. tagging
*why* each wrong option is wrong). Also worth its own design pass, likely
after Phase IV (Stage 8/9, Refresh Gate C) makes NOR/NORK/NORI confusion a
live issue worth detecting.
