# Aditzak — Proposed Learning Journey (reference specification)

> **Status: proposed curriculum spec — not yet implemented in code.** This is a
> self-contained reference for the intended acquisition order, written to be
> evaluated against in future. It does not describe the currently-shipped
> journey (`journey.js`/`LESSONS`, Units 1–17 live); the evaluation that
> motivated this spec, and the mapping from the shipped journey to this one,
> live in `docs/LEARNING_JOURNEY_EVALUATION.md`.
>
> Linguistic forms are grounded in `docs/CONJUGATIONS.md`,
> `docs/VERB_COVERAGE.md` (VC), and `docs/LANGUAGE_DECISIONS.md` (LD). Engine
> touch-points reference `docs/EXERCISE_ENGINE.md`.

The journey is **37 units** across six phases. Units are ordered by
communicative goal, not grammatical category, and prioritize usefulness over
implementation-ease where the two trade off.

---

## Design principles

1. **The "Me, You, & It" horizon (Phase I).** Every verb's first lesson is
   restricted to `ni`/`zu`/`hura` (1sg, 2sg-neutral, 3sg) — the three persons
   conversation runs on. The plural persons arrive in a dedicated Expansion
   block once enough verbs exist to make them feel like "more of what you know."
2. **`zu` is the default "you" from lesson one.** `hi` (the intimate register)
   is deferred to Phase V, where it is taught together with allocutive marking
   (hitanoa). The core person grid is `ni/zu/hura/gu/zuek/haiek`.
3. **Functional grouping.** Units are named for what they let you *say*
   (Location & State, Movement, Daily Routine…), drawing from whichever verb
   shape fits; the synthetic/periphrastic distinction is explained in passing,
   not used as a unit boundary.
4. **Refresh Gates are structural.** Each phase ends in a gate unit with **zero
   new verbs** — consolidation, negation, case-sorting. Gates carry
   `gate: true` and are **score-gated**: the next unit unlocks at
   `bestStars >= 2` (≥80%); a sub-threshold attempt leaves the next unit locked
   and the gate replayable with a "needs 80% to continue" prompt (no lockout).
5. **Difficulty-weighted practice.** Easy units (new vocabulary in a known
   pattern) get one practice lesson per (verb × tense) plus the auto-generated
   reviews. Units introducing a **new grammatical relation or register** get
   one or more **dedicated extra-practice lessons**, enumerated per unit below.
6. **The 2-lesson person split, with a fatigue valve.** Per the "max 3 persons
   per exercise" rule, a 6-person grid is split into a `ni`/`zu`/`hura` lesson +
   a `gu`/`zuek`/`haiek` `-plural` sibling. For mechanically-trivial verbs the
   plural sibling folds into the trailing mixer review instead of a standalone
   lesson (same coverage, less low-value drill); the full split is reserved for
   the difficulty-flagged units.

### Pronoun Fading Matrix

The same sentence is shown with shrinking pronoun support as the learner
advances — explicit pronouns build the case-frame, then fade to native
pro-drop, reappearing only for contrast. Every Payload below is tagged with its
stage.

| Stage | Phases | Subject pronoun | Example ("I'm going home") |
|---|---|---|---|
| **A — Explicit** | I | always present | **Ni** etxera **noa**. |
| **B — Optional** | II–III | parenthesized; reviews drop it | **(Ni)** etxera noa. |
| **C — Pro-drop default** | III–IV | dropped; pronoun for emphasis only | Etxera noa. *(contrast: **NIK** dakit, ez zuk.)* |
| **D — Full null-anaphora** | IV–VI | all arguments droppable incl. dative/ergative | Gustatzen **zait**. |

### Morphophonological Pacing Schedule

Each suffix alternation is introduced with a **minimal pair in the same unit**,
so the conditioning environment is seen, not guessed. Units staging a pair are
marked **MP**.

- **Imperfective `-t(z)en`** (first pair: Unit 11) — **`-ten`** after
  radical-final **/n/ and sibilants/affricates** (`jan→jaten`, `egin→egiten`,
  `eros→erosten`, `ikus→ikusten`, `idatz→idazten`, `utz→uzten`, `itx→ixten`);
  **`-tzen`** after **vowels, liquids /l r/, and oral stops** (`har→hartzen`,
  `sal→saltzen`, `irakur→irakurtzen`, `bila→bilatzen`, `zabal→zabaltzen`).
- **Future `-ko`/`-go`** (first pair: Unit 15) — **`-go`** after a participle
  ending in **/n/** (voicing assimilation: `izan→izango`, `joan→joango`,
  `jan→jango`, `egon→egongo`, `jakin→jakingo`); **`-ko`** elsewhere
  (`etorri→etorriko`, `ibili→ibiliko`, `erosi→erosiko`, `hartu→hartuko`).

### Scope conventions — production vs. recognition

Not every (agreement × mood) cell is drilled for production. Each is tagged:

- **[P]** production-drilled — full multiple-choice / type-the-form questions.
- **[R]** recognition-only — comprehension / spot-the-form; never asked to
  produce. Used for the genuinely advanced cells (dative moods, ditransitive
  imperative/subjunctive) where production mastery is beyond an A2/B1 target.
- **[—]** deferred — not taught at this stage.

**Mood Difficulty Ladder** (the order in which moods are introduced, easiest →
hardest, and the production ceiling for each): present/past **[P all]** →
future **[P all]** → potential/conditional **[P for NOR/NOR-NORK; R for
dative]** → imperative **[P for NOR/NOR-NORK; R for ditransitive]** →
subjunctive **[P for NOR/NOR-NORK 3rd-person in-construction; R otherwise]** →
allocutive/hitanoa **[P, staged over four units]** → causative recombination
**[P for tense; R for mood]**.

---

## Phase I — Survival Present (Me, You, & It)

Persons in scope: **`ni` / `zu` / `hura`** (plurals added at Units 5–6).
Pronoun stage: **A (explicit)**.

### Stage 1: Absolute Foundations

| Unit | Focus | Payload (Stage A) | Persons | Ref | Status |
|---|---|---|---|---|---|
| 1 | **Who and Where** — `izan` + `egon` present | **Ni** ikaslea **naiz**. / **Zu** non **zaude**? / **Hura** etxean **dago**. | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1, §6 | ✅ shipped |
| 2 | **Having, Wanting, Knowing** — `ukan` (object `hura`) + `nahi` + `jakin` | **Nik** auto bat **dut**. / **Zuk** kafea **nahi duzu**? / **Nik** ez **dakit**. | ni/zu/hura: `dut`/`duzu`/`du`, `nahi dut…`, `dakit`/`dakizu`/`daki` | §3, VC §5, §7 | ✅ shipped |
| 3 | **Seeing** — `ikusi` present (first periphrastic) | **Nik** mendia **ikusten dut**. / **Zuk ikusten duzu**? | ni/zu/hura: `ikusten dut/duzu/du` | §7 | ✅ shipped |

**Unit 2 — extra practice** (first `nor-nork`/ergative subject — the first new
relation):

1. **2·L1 — Ergative recognition**: `ukan` present, the `-t`/`-zu`/∅ ergative
   suffixes; recognition-ramped.
2. **2·L2 — Same suffixes, synthetic verb** (`jakin`): shows the *identical*
   `dakit`/`dakizu`/`daki` ergative endings on a fully synthetic verb, so the
   suffix family is seen as a system, not a quirk of `ukan`.

### Stage 2: Operations, Movement & Expansion

| Unit | Focus | Payload (Stage A) | Persons | Ref | Status |
|---|---|---|---|---|---|
| 4 | **Moving Around** — `joan` + `etorri` present | **Ni** hondartzara **noa**. / **Hura** bihar **dator**. | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator` | §6 | ✅ shipped |
| 5 | 🛡️ **Expansion: Absolutive Plurals** — `izan`/`egon`/`joan`/`etorri` | Irakasleak **gara**. / Etxean **zaudete**. / Hondartzara **goaz**. | gu/zuek/haiek (`nor`) | §1/§6 | ⚠️ new |
| 6 | 🛡️ **Expansion: Ergative Plurals** — `ukan`/`ikusi` | Auto bat **dugu**. / Filma **ikusten dute**. | gu/zuek/haiek (`nor-nork`) | §3/§7 | ⚠️ new |
| 7 | **The Immediate Continuous** — `ari` + `izan` | Zer **ari zara**? / **Jaten ari naiz**. | reuses Unit 1 `izan` under `ari` | VC §5 | ✅ shipped |

> **Why Expansion is two units.** The absolutive plural (`gara`/`goaz` — marked
> on the verb stem) and the ergative plural (`dugu`/`dute` — a suffix on the
> fixed `du-` stem) are different paradigms. Drilling them apart, with Unit 6
> framed as "the plural moved — now it's a suffix," prevents `†dugara`-type
> blending. Both sit right after Unit 4, the earliest point every expanded verb
> exists.

### 🛡️ Refresh Gate A

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 8 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | `ez` + auxiliary-fronting (`Mutila etorri da` → `Mutila ez da etorri`). Reuses `negativeSentences` + a `spot-error`-style kind. Word-order shift introduced on `nor` verbs first, `nor-nork` second. `ikusi`/`nahi`/`ari` excluded (split auxiliary). |

---

## Phase II — Transitivity & Everyday Life

Persons: full 6-person grid from each verb's first lesson. Pronoun stage:
**B (optional)**.

### Stage 3: Looking Back I (simple past, pooled by shared auxiliary)

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 9 | **Looking Back I — the `izan` past pool** (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`), mixed across `izan`/`joan`/`etorri`/`ibili` | **(Ni)** gaztea **nintzen**. / **(Ni)** hondartzara **joan nintzen**. / **(Hura)** atzo **etorri zen**. | §1; §11+§1 | ✅ shipped |
| 10 | **Looking Back I — the `ukan` past pool** (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`), mixed across `ukan`/`jan`/`edan`/`erosi`/`ikusi` | **(Nik)** auto bat **nuen**. / Sagarra **jan nuen**. / Etxe bat **erosi genuen**. | §3; §7 | ✅ shipped |

### Stage 4: Real-World Actions

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 11 | **Daily Routine (Transitive)** — `ukan` present aux pooled across `jan`/`edan`/`erosi`/`ikusi` — **MP** | **(Nik)** ogia **jaten dut**. / Ura **edaten duzu**. *(MP pair: `jaten` -ten vs `hartzen` -tzen)* | §7 | ✅ shipped |
| 12 | **Physical States & Possessions** — `eduki`, `ibili` full grids | Giltzak poltsikoan **dauzkat**. / Herrian zehar **dabiltza**. | §7, §6 | ✅ shipped |

### Stage 5: Looking Back II (the synthetic-past "odd ones out")

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 13 | **"I Was There"** — `egon` simple past (`nengoen`/`zeunden`/`zegoen`/`geunden`/`zeundeten`/`zeuden`) | **(Ni)** etxean **nengoen**. / Hondartzan **geunden**. | §6 | ✅ shipped |
| 14 | **"I Had It"** — `eduki` simple past (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/`zeukaten`) | Giltzak **neuzkan**. / Denbora **geneukan**. | §7 | ✅ shipped |

### Stage 6: The Future (*Geroa*)

| Unit | Focus | Payload (Stage B→C) | Ref | Status |
|---|---|---|---|---|
| 15 | **The Future Rule** — `-ko`/`-go` + present aux, 3-verb core (`izan`/`ukan`/`joan`) — **MP** | Irakasle **izango naiz**. / Autoa **izango dugu**. / Bihar **joango naiz**. *(MP pair: `izango` -go vs `etorriko` -ko)* | §11 | ✅ shipped |
| 16 | **The Future, Across Every Verb** — cross-verb *mixer reviews* | Hori **ikusiko duzu**. / Etxe bat **erosiko dugu**. / **Jakingo duzu**? | §11 | ✅ shipped |
| 17 | **Requirements & Obligations** — `behar` + `ukan`, present + future | **Joan behar dut**. / **Etorri beharko duzu**. *(`behar` always takes `ukan`, even on intransitive `joan`)* | VC §5 | pending |

### 🛡️ Refresh Gate B

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 18 | **REFRESH — Cumulative Present/Past/Future Mixer** | zero new verbs; **score-gated** | Mixes synthetic+periphrastic, positive+negative, present+past+future — the full Units 1–17 range. |

---

## Phase III — Shifting to the Past (aspect)

Pronoun stage: **C (pro-drop default)**.

| Unit | Focus | Payload (Stage C) | Ref | Status |
|---|---|---|---|---|
| 19 | **"I Used To…" — the Imperfective Past** | Hona egunero **etortzen nintzen**. / Lanean **ari nintzen** deitu zuenean. *(habitual/ongoing — distinct from the completed past of Units 9/10/13/14)* | §11 | pending |
| 20 | **Motion in Progress (Past)** — `joan`/`etorri`/`ibili` native imperfective (`nindoan`/`zetorren`/`nenbilen`) | Bidean **nindoan**… / **Zetorren**, eta orduan… | §6 | pending |

---

## Phase IV — Interpersonal & Relationship Dynamics

Pronoun stage: **D (full null-anaphora; dative/ergative droppable)**.

### Stage 8: The Dative Shift (NOR-NORI)

| Unit | Focus | Payload (Stage D) | Ref | Status |
|---|---|---|---|---|
| 21 | **Pleasures, Opinions, Feelings** — present NOR-NORI (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`) | Hau **gustatzen zait**. / Ongi **iruditzen zaio**. / Liburua **ahaztu zait**. *(plural NOR: Giltzak **ahaztu zaizkit**.)* | §4 | pending |
| 22 | **Dative Across Time** — NOR-NORI **past + future** | Atzo **gustatu zitzaidan**. / Giltzak **ahaztu zitzaizkidan**. / Ziur **gustatuko zaizu**. | §4; §11 | pending — new |

**Unit 21 — extra practice** (first dative-subject forms — a new case frame):

1. **21·L1 — "It pleases me" (recognition)**: `gustatu`, NORI varies, NOR fixed
   `hura`.
2. **21·L2 — "It pleases me" (production)**: same grid; distractors = wrong
   NORI person + plural-NOR `zaizkit` + ergative lure `dut`.
3. **21·L3 — Number split**: NOR=`hura` (`zait`) vs NOR=`haiek` (`zaizkit`).
4. **21·L4 — Case-frame buffer**: mixed `gustatu`/`iruditu`/`ahaztu`, drilled
   to over-learning before the third argument lands in Stage 9.

### Stage 9: Communication & Giving (NOR-NORI-NORK)

| Unit | Focus | Payload (Stage D) | Ref | Status |
|---|---|---|---|---|
| 23 | **Communication & Giving** — present NOR-NORI-NORK (`esan`/`eman`), **axis-scaffolded** | **(Nik, hari)** **ematen diot**. / **(Zuk, hari)** **esaten diozu**. | §5, §8 | pending |
| 24 | **Telling & Giving Across Time** — NOR-NORI-NORK **past + future** | **Esan nion**. / **Eman zidan**. / Bihar **esango dizut**. | §5; §11 | pending — new |

**Unit 23 — extra practice** (first ditransitive — the steepest jump; never
both axes in a learner's first exposure):

1. **23·L1 — Fix NORI, vary NORK** (`diot`/`diozu`/`dio`/`diogu`/`diozue`/`diote`
   — "… *it to him*"): only the ergative subject moves.
2. **23·L2 — Fix NORK, vary NORI** (`dizut`/`diot`/`diet`… — "I tell it *to
   you/him/them*"): only the dative recipient moves.
3. **23·L3 — Object number** (`dizut` vs `dizkizut`): the `-zki-` plural-object
   infix alone.
4. **23·L4 — Two-axis recombination** (recognition-first): both axes vary, only
   after L1–L3 made each legible. If the 2D table shape isn't built, L4 is a
   `spot-error`-style "which sentence assigns the roles correctly?" lesson.

**Unit 24 — extra practice**: a single past/future recombination drill per axis
(reuses the periphrastic-past and `-ko`/`-go` machinery; **conditional /
potential / subjunctive ditransitive are [R] / [—]**, surfaced for recognition
in Stage 10, never production-drilled).

### 🛡️ Refresh Gate C

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 25 | **REFRESH — The Case-Ending Mixer** | zero new verbs; **score-gated** | Isolates NOR/NORK/NORI by swapping which argument is absolutive/ergative/dative across present/past/future — heads off the "`-k` drift" error. Reuses `case-mixer`/`spot-error` machinery. **Mandatory pass before Phase V.** |

---

## Phase V — Nuance, Modality, & Social Context

### Stage 10: Hypotheticals & Potentials

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 26 | **Permissions & Capability (Ahalera)** — `dezaket`/`naiteke` vs periphrastic `ahal izan` | **Etor naiteke**. / Hori **esan dezaket**. / **Ezin dut** etorri. | NOR/NOR-NORK [P]; dative [R] | §2/§3, VC §5 | pending |
| 27 | **Conditionals (Baldintza & Ondorioa)** — `ba-` protasis + `-ke` apodosis | Dirua **banu**, hori **erosiko nuke**. | NOR/NOR-NORK [P]; dative [R] | §2/§3 | pending |

### Stage 11: Directives & Wishes (the hard moods, spaced apart)

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 28 | **Commands (Agintera)** — the imperative | **Etorri!** / **Egizu** lan. / **Emadazu** ura. | NOR/NOR-NORK [P]; ditransitive `iezadazu` [R] | §16 | pending — distractor-floor fix needed |
| 29 | **Purpose & Wishing (Subjuntiboa)** — the subjunctive **as a construction** | Nahi dut **etor dadin**. / Esan dio **etor dadila**. / …ikus **dezan**. | NOR/NOR-NORK 3rd-person in-construction [P]; dative [R] | §16 | pending |

> **Why imperative and subjunctive are separate units.** They are different
> moods with different difficulty profiles. The imperative is concrete,
> high-utility, and second-person — taught first. The subjunctive barely exists
> as a standalone form: it surfaces almost only **embedded in subordinate
> clauses** (purpose, wishing). Unit 29 therefore teaches it as a *syntactic
> construction* (matrix verb + subordinate clause), recognition-first, not as an
> isolated conjugation drill.

**Unit 28 — extra practice**: imperative recognition (commands vs statements) →
production on NOR/NOR-NORK → small-table distractors borrowed from sibling
verbs (the distractor-floor fix).

**Unit 29 — extra practice**: (1) recognize the construction (`nahi dut + […]`);
(2) choose the subordinate form for NOR/NOR-NORK 3rd-person; (3) recognition
pass over dative/ditransitive subjunctive (no production).

### Stage 12: The Intimate Register (`hi` + Hitanoa)

Persons: `hi` enters here for the first time. Four units stage the three
independent novelties — new person, addressee-agreement, gender — one at a time.

| Unit | Focus | Payload | Ref | Status |
|---|---|---|---|---|
| 30 | **Meet `hi`** (no allocutivity) — `hi` as a subject in known paradigms | **Hi** ikaslea **haiz**. / **Hago** lasai. / **Hator** hona. / **Hik** badakik? | §3/§6 | pending |
| 31 | **Toka (masculine allocutive)** — addressee-agreement on 3rd-person statements, one gender | Lanean **dik**. / Etorri **duk**. / Ez **nauk** ondo. | §10 | pending |
| 32 | **Noka (feminine allocutive)** — taught as the `-k`→`-n` transform of Unit 31 | Lanean **din**. / Etorri **dun**. / Ez **naun** ondo. | §10 | pending |
| 33 | **Hitanoa Recombined** — mixed toka/noka + *when not to use it* | choose register by addressee gender; suppress in subordinate clauses / formal `-ke-` moods | §10, LD 2026-06-11 | pending |

**Unit 30–33 — extra practice** (one dedicated lesson per unit): (30) `hi`
subject recognition across known tables; (31) toka on 3rd-person, distractor =
neutral `du`/`da` (register-leak trap); (32) noka transform drill, distractor =
the toka form (gender trap); (33) mixed register switch + subordinate-clause
suppression.

### Stage 13: Reading Real Text

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 34 | **Passive & Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | comprehension over real sentences | [R] throughout | §14/§15 | pending — new `reading` kind |

---

## Phase VI — Making Things Happen (Causatives)

Persons: full 6-person grid + `hi` (available since Unit 30). The causative is a
*morphological operation* (`-arazi`) that recombines everything prior; placed
last so every piece it recombines already exists.

### Stage 14: The Causative Suffix (`-arazi`)

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 35 | **Making Someone Do It** — `-arazi` on intransitives (`nor`→`nor-nork`) | Ekaitzak mendizaleak **itzularazi zituen**. / Musikak umeak **dantzarazi ditu**. | present/past/future [P] | VC §6 | pending |
| 36 | **Making Someone Do Something to Someone** — `-arazi` on transitives (`nor-nork`→`nor-nori-nork`) | Amonak umeei babarrunak **janarazi zizkien**. / Irakasleak ikasleei hori **idatzarazi die**. | present/past/future [P] | VC §6 | pending |

**Unit 35 — extra practice** (first valency-*increasing* derivation): (1) spot
the valency shift (`itzuli ziren` vs `itzularazi zituen`), distractor = the
non-causative auxiliary; (2) produce the causer across persons; (3) the
causative across tense (the aux just inflects).

**Unit 36 — extra practice** (extends causative to `nor-nori-nork`): (1) the new
NORI slot (`umeek jan` → `umeei janarazi`); (2) fix NORI, vary NORK; (3) object
number (`die` vs `dizkie`).

### 🛡️ Refresh Gate D

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 37 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs; score-gated | Recombines Units 35–36's `-arazi` with future (15–16), conditional (27), imperative (28): makes/made/will make/would make/make-them-do-X. |

---

## Coverage map (this proposal)

Agreement pattern × tense/mood, with the production ceiling per cell
(**[P]** production, **[R]** recognition-only, **[—]** deferred). Unit numbers
in parentheses.

| | Present | Simple past | Imperf. past | Future | Potential | Conditional | Imperative | Subjunctive |
|---|---|---|---|---|---|---|---|---|
| **NOR** | [P] 1,4,7 | [P] 9,13 | [P] 19,20 | [P] 15–16 | [P] 26 | [P] 27 | [P] 28 | [P] 29 |
| **NOR-NORK** | [P] 2,3,6,11,12 | [P] 10,14 | [P] 19 | [P] 15–16 | [P] 26 | [P] 27 | [P] 28 | [P] 29 |
| **NOR-NORI** | [P] 21 | [P] 22 | [—] | [P] 22 | [R] 26 | [R] 27 | n/a | [—] |
| **NOR-NORI-NORK** | [P] 23 | [P] 24 | [—] | [P] 24 | [R] 26 | [R] 27 | [R] 28 | [R] 29 |
| **Causative** (derivational) | [P] 35,36 | [P] 35,36 | [—] | [P] 37 | [R] 37 | — | [R] 37 | [—] |

`hi`/hitanoa (Units 30–33) layers across the indicative present/past it teaches
on; allocutive forms of the higher moods are [—].

---

## Distractor Engine Matrix

Rules for the automated multiple-choice engine
(`generateQuestions`/`buildOptions`). A distractor is valuable only if a learner
who picks it reveals one *named* slippage. "Slot 1/2/3" are the three distractor
positions filled alongside the correct answer.

| Paradigm | Correct axis | Slot 1 (primary trap) | Slot 2 (secondary) | Slot 3 (lure) | Error class caught |
|---|---|---|---|---|---|
| **NOR present** | subject person | other in-scope person | second in-scope person | borrowed plural (post-Unit 5) / near-homophone | subject-agreement person |
| **NOR-NORK present** | ergative person | other ergative form | second ergative form | a `nor` form of same gloss (`naiz` for `dut`) | ergative person + aux drift |
| **Past pools** | person, past aux | other person, same aux | cross-pool same-person aux (`nintzen`↔`nuen`) | present same-person form | tense + `izan`/`ukan` drift |
| **Future** | participle+aux | **wrong voicing** (`†izanko`/`†etorrigo`) | **wrong aux** (`izango dut` for `…naiz`) | other-person same aux | `-ko`/`-go` MP + `naiz`/`dut` |
| **Imperfective vs simple past** | aspect | simple-past counterpart | other-person imperfective | present imperfective | aspect (habitual vs completed) |
| **NOR-NORI** | NORI person | other NORI form | **plural-NOR** (`zaizkit`) | **ergative** form (`dut`) | dative person vs NOR number vs case-frame |
| **NOR-NORI-NORK** | one fixed axis | wrong NORK | wrong NORI | wrong object number (`dizkizut`) | ergative-drift vs dative-drift vs number |
| **Potential/Conditional** | mood stem | indicative counterpart (`dut`) | other-person same mood | wrong mood (`nuke` for `dezaket`) | mood confusion |
| **Imperative** | imperative person | other imperative person | **borrowed sibling-verb form** (floor fix) | indicative form | register (command vs statement) |
| **Subjunctive** | in-construction form | indicative counterpart | wrong subordinator (`-(e)la` vs `-(e)n`) | other-person | construction + mood |
| **hi / hitanoa** | allocutive form | **wrong gender** (`dik`↔`din`) | **neutral** form (`du`) | other-person allocutive | toka/noka gender vs register leak |
| **Causative** | post-causative agreement | **non-causative aux** (`ziren` for `zituen`) | wrong NORI on ditransitive causatives (`die`↔`dizkie`) | wrong tense of correct aux | valency-agreement + number |

**Implementation notes.** Slots fill in priority order; a small table (e.g. the
imperative's 3-person grid) **borrows the same-slot form from a sibling verb's
table** rather than dropping to 3 options (`EXERCISE_ENGINE.md` Tier 2). The
"wrong-number"/"wrong-case-frame" slots require sibling forms (`zaizkit`,
`dizkizut`, `ziren`) to exist in the table as inert distractor fodder even when
not the drilled axis — this is what makes "number vs case-marker drift"
separable in scoring. Distractors are always real paradigm forms, except the two
intentional non-word voicing traps (`†izanko`, `†etorrigo`) in the future row,
which exist precisely to test the `-ko`/`-go` rule.

---

## Architectural data resolutions (needed to build the pending units)

### `ahaztu` — NOR-NORI paradigm (Unit 21)

Regular NOR-NORI psych-verb riding `izan`'s dative auxiliary (§4). NOR (the
forgotten thing) fixed `hura`; NORI (the forgetter) is the drilled axis.
`agreement: ['nor','nori']`, `object: 'hura'`, `type: 'periphrastic'`.

| `person` (NORI) | Present | Past | Gloss |
|---|---|---|---|
| ni | `ahaztu zait` | `ahaztu zitzaidan` | I forgot it |
| zu | `ahaztu zaizu` | `ahaztu zitzaizun` | you forgot it |
| hura | `ahaztu zaio` | `ahaztu zitzaion` | he/she forgot it |
| gu | `ahaztu zaigu` | `ahaztu zitzaigun` | we forgot it |
| zuek | `ahaztu zaizue` | `ahaztu zitzaizuen` | you-all forgot it |
| haiek | `ahaztu zaie` | `ahaztu zitzaien` | they forgot it |

Plural-NOR column (`ahaztu zaizkit`/`zaizkizu`/… "forgot *them*") is authored as
distractor fodder and is itself real (`Giltzak ahaztu zaizkit`).

### `esan`/`eman` — ditransitive, axis-fixed (Units 23–24)

§5 grids are 2D (NORK × NORI). The deployment path fixes one axis per lesson
(avoiding the 2D-table engine work): **23·L1** fixes NORI=`hari`
(`recipient: 'hura'`), varies NORK; **23·L2** fixes NORK=`nik` (`agent: 'ni'`),
varies NORI; the `-zki-` forms (`dizkiot`…) supply the number slot. Unit 24
applies the periphrastic past (§5 past grid) and `-ko`/`-go` future to the same
axis-fixed slices. Forward-compatible with the richer 2D shape
(`EXERCISE_ENGINE.md` Tier 3) if ever built.

### `-arazi` — phonetic conditioning (Phase VI)

**Batua standard: `-arazi`, universally, on the verbal radical** (the
*aditzoina* = participle minus `-tu`/`-i`/`-n`, consonant restored):
`jan→janarazi`, `ikus→ikusarazi`, `etor→etorrarazi`, `idatz→idatzarazi`,
`itzul→itzularazi`. The only live junction rules: (1) radical-final `-r` doubles
to `-rr-` before the vowel-initial suffix (`etorrarazi`); (2) the suffix-initial
`/a/` is stable (no assimilation/elision); (3) no voicing change at the seam
(unlike `-ko`/`-go`). The historical `-erazi`/`-erazo`/`-arazo` variants are
recognized in the central/eastern literary tradition — treated **[R]
recognition-only** (e.g. in Unit 34's reading), never production-drilled. A
causativized verb is a `type: 'periphrastic'` entry: fixed `[radical]+arazi`
participle + the auxiliary picked by the *post-causative* agreement
(`ukan` for Unit 35's `nor-nork`; `ukan`'s `*-io-` ditransitive paradigm for
Unit 36's `nor-nori-nork`). Zero new data shapes (VC §6).

### Score-gating predicate (Units 8?, 18, 25, 37 and any `gate: true`)

`getUnlockedLessonIds` checks `bestStars >= 2` (≥80%, per `computeStars`) for
gate lessons; sub-threshold leaves the next unit locked and the gate replayable
with a "needs 80% to continue" prompt. No stored-shape change (`bestStars` is
already recorded).
