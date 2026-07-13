# Aditzak — Proposed Learning Journey (reference specification)

**Status: open proposal, not yet implemented.** The currently-shipped journey is `LEARNING_JOURNEY.md`; this spec is being adopted incrementally as units move from `pending` to `available` (see `docs/DECISIONS.md`'s renumbering entries).

> **Numbering note (2026-06-19):** the live journey inserted a present-perfect
> unit (*Lehenaldi Burutua*) at **Unit 11**, which this spec does not have.
> As a result the live unit numbers diverge from this spec's "N-n" from Unit 11
> on: **live Unit 11 = present perfect (new); live Unit N = this spec's N-n − 1
> for every N ≥ 12.** This spec keeps its original numbering; see
> `docs/LEARNING_JOURNEY.md` and `docs/DECISIONS.md` for the live layout.

> **Status: proposed curriculum spec — not yet implemented in code.** This is a
> self-contained reference for the intended acquisition order, written to be
> evaluated against in future. It does not describe the currently-shipped
> journey (`journey.js`/`LESSONS`, Units 1–17 live); the evaluation that
> motivated this spec, and the mapping from the shipped journey to this one,
> live in `docs/archive/LEARNING_JOURNEY_EVALUATION.md`.
>
> Linguistic forms are grounded in `docs/CONJUGATIONS.md`,
> `docs/VERB_COVERAGE.md` (VC), and `docs/LANGUAGE_DECISIONS.md` (LD). Engine
> touch-points reference `docs/EXERCISE_ENGINE.md`.

The journey is **39 units** across six phases. Units are ordered by
communicative goal, not grammatical category, and prioritize usefulness over
implementation-ease where the two trade off. The steepest *conceptual* jumps —
ergative alignment (Phase I), the dative shift and the ditransitive (Phase IV),
the intimate register and the hard moods (Phase V) — each get their own unit(s)
with nothing competing for attention, while mechanically-trivial concepts
(the future suffix, modal particles) are compressed into mixers.

---

## Design principles

1. **The "Me, You, & It" horizon (Phase I).** Every verb's first lesson is
   restricted to `ni`/`zu`/`hura` (1sg, 2sg-neutral, 3sg) — the three persons
   conversation runs on. The plural persons arrive in a dedicated Expansion
   block once enough verbs exist to make them feel like "more of what you know."
2. **Ergativity is taught alone, then consolidated.** The absolutive→ergative
   subject shift (`ni naiz` → `nik dut`) is the single steepest conceptual jump
   in Basque, so `ukan` gets its own introduction unit, immediately followed by
   a **case-marking checkpoint** that drills the `ni`/`nik` contrast before any
   further transitive vocabulary piles on.
3. **`zu` is the default "you" from lesson one.** `hi` (the intimate register)
   is deferred to Phase V, where it is taught together with allocutive marking
   (hitanoa). The core person grid is `ni/zu/hura/gu/zuek/haiek`.
4. **Functional grouping.** Units are named for what they let you *say*; the
   synthetic/periphrastic distinction is explained in passing, not used as a
   unit boundary.
5. **Present before past, per lexeme.** A verb is introduced in the present
   before (or in the same stage as) its past, so no verb's *meaning* debuts in a
   harder tense than necessary.
6. **Refresh Gates are structural and score-gated.** Each phase ends in a gate
   unit with **zero new verbs**. Gates carry `gate: true`; the next unit unlocks
   at `bestStars >= 2` (≥80%); a sub-threshold attempt leaves the next unit
   locked and the gate replayable with a "needs 80% to continue" prompt (no
   lockout).
7. **Difficulty-weighted practice.** Easy units get one practice lesson per
   (verb × tense) plus the auto-generated reviews. Units introducing a **new
   grammatical relation or register** get one or more **dedicated extra-practice
   lessons**, enumerated per unit below.
8. **The 2-lesson person split, with a fatigue valve.** Per the "max 3 persons
   per exercise" rule, a 6-person grid splits into a `ni`/`zu`/`hura` lesson + a
   `gu`/`zuek`/`haiek` `-plural` sibling. For mechanically-trivial verbs the
   plural sibling folds into the trailing mixer review instead of a standalone
   lesson; the full split is reserved for the difficulty-flagged units.

### Pronoun Fading Matrix

The same sentence is shown with shrinking pronoun support as the learner
advances. Every Payload below is tagged with its stage.

| Stage | Phases | Subject pronoun | Example ("I'm going home") |
|---|---|---|---|
| **A — Explicit** | I | always present | **Ni** etxera **noa**. |
| **B — Optional** | II–III | parenthesized; reviews drop it | **(Ni)** etxera noa. |
| **C — Pro-drop default** | III–IV | dropped; pronoun for emphasis only | Etxera noa. *(contrast: **NIK** dakit, ez zuk.)* |
| **D — Full null-anaphora** | IV–VI | all arguments droppable incl. dative/ergative | Gustatzen **zait**. |

### Morphophonological Pacing Schedule

Each suffix alternation is introduced with a **minimal pair in the same unit**.
Units staging a pair are marked **MP**.

- **Imperfective `-t(z)en`** (first pair: Unit 12) — **`-ten`** after
  radical-final **/n/ and sibilants/affricates** (`jan→jaten`, `egin→egiten`,
  `eros→erosten`, `ikus→ikusten`, `idatz→idazten`); **`-tzen`** after **vowels,
  liquids /l r/, and oral stops** (`har→hartzen`, `sal→saltzen`,
  `irakur→irakurtzen`). Unit 12 stages `jaten` (-ten) vs `hartzen` (-tzen).
- **Future `-ko`/`-go`** (first pair: Unit 17) — **`-go`** after a participle
  ending in **/n/** (`izan→izango`, `joan→joango`, `jan→jango`, `jakin→jakingo`);
  **`-ko`** elsewhere (`etorri→etorriko`, `erosi→erosiko`, `hartu→hartuko`).
  Unit 17 stages `izango` (-go) vs `etorriko` (-ko).

### Scope conventions — production vs. recognition

Each (agreement × mood) cell is tagged **[P]** production-drilled, **[R]**
recognition-only (comprehension / spot-the-form; never produced — for advanced
cells like the dative moods and ditransitive imperative/subjunctive), or
**[—]** deferred.

**Mood Difficulty Ladder** (introduction order, easiest → hardest, and the
production ceiling per mood): present/past **[P all]** → future **[P all]** →
potential/conditional **[P for NOR/NOR-NORK; R for dative]** → imperative **[P
for NOR/NOR-NORK; R for ditransitive]** → subjunctive **[P for NOR/NOR-NORK
3rd-person in-construction; R otherwise]** → allocutive/hitanoa **[P, staged
over four units]** → causative recombination **[P for tense; R for mood]**.

---

## Phase I — Survival Present (Me, You, & It)

Persons in scope: **`ni` / `zu` / `hura`** (plurals added at Units 7–8).
Pronoun stage: **A (explicit)**.

### Stage 1: Being, Having & the Ergative Leap

| Unit | Focus | Payload (Stage A) | Persons | Ref | Status |
|---|---|---|---|---|---|
| 1 | **Who and Where** — `izan` + `egon` present (identity vs. location) | **Ni** ikaslea **naiz**. / **Zu** non **zaude**? / **Hura** etxean **dago**. | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1, §6 | ✅ shipped |
| 2 | **The Ergative Leap** — `ukan` present (object `hura`), taught alone | **Nik** auto bat **dut**. / **Zuk** kafea **duzu**? / **Hark** etxe bat **du**. | ni/zu/hura: `dut`/`duzu`/`du` | §3 | ⚠️ split out |
| 3 | **Ni vs. Nik** — absolutive/ergative case-marking checkpoint (zero new verbs) | **Ni** ikaslea **naiz** ↔ **Nik** liburua **dut**. / **Zu** etxean **zaude** ↔ **Zuk** kafea **duzu**. | ni/zu/hura: contrast `izan`/`egon` (bare) vs `ukan` (`-k`) | §1/§3/§6 | ⚠️ new |
| 4 | **Knowing & Wanting** — `jakin` (synthetic, same ergative suffixes) + `nahi` + `ukan` | **Nik** ez **dakit**. / **Zuk** etorri **nahi duzu**? | ni/zu/hura: `dakit`/`dakizu`/`daki`, `nahi dut…` | §7, VC §5 | ⚠️ split out |

**Unit 2 — extra practice** (the steepest conceptual jump; isolated and
over-resourced):

1. **2·L1 — Ergative recognition**: `ukan` present, the `-t`/`-zu`/∅ suffixes;
   recognition-ramped.
2. **2·L2 — The `ni`→`nik` shift**: same gloss, contrasting the bare Unit-1
   subject (`ni naiz`) with the ergative subject (`nik dut`).

**Unit 3 — extra practice** (the case-marking checkpoint — pre-empting the
single most common beginner error, ergative drift):

1. **3·L1 — Sort the subject**: given a sentence, choose bare `ni`/`zu` vs.
   ergative `nik`/`zuk` by whether the verb is `izan`/`egon` or `ukan`.
2. **3·L2 — Spot the drift**: candidate sentences, one with `-k` wrongly on an
   intransitive subject (`†Nik naiz`); pick the correct one.

**Unit 4 — extra practice**: `jakin`'s `dakit`/`dakizu`/`daki` shown as the
*same* ergative suffix family on a fully synthetic verb, so the pattern reads as
a system, not a quirk of `ukan`.

### Stage 2: Seeing & Moving

| Unit | Focus | Payload (Stage A) | Persons | Ref | Status |
|---|---|---|---|---|---|
| 5 | **Seeing** — `ikusi` present (first periphrastic) | **Nik** mendia **ikusten dut**. / **Zuk ikusten duzu**? | ni/zu/hura: `ikusten dut/duzu/du` | §7 | ✅ shipped |
| 6 | **Moving Around** — `joan` + `etorri` + `ibili` present | **Ni** hondartzara **noa**. / **Hura** bihar **dator**. / **Ni** herrian **nabil**. | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator`, `nabil`/`zabiltza`/`dabil` | §6 | ⚠️ +`ibili` |
| 7 | 🛡️ **Expansion: Absolutive Plurals** — `izan`/`egon`/`joan`/`etorri`/`ibili` | Irakasleak **gara**. / Etxean **zaudete**. / Herrian **dabiltza**. | gu/zuek/haiek (`nor`) | §1/§6 | ⚠️ new |
| 8 | 🛡️ **Expansion: Ergative Plurals** — `ukan`/`jakin`/`ikusi` | Auto bat **dugu**. / **Dakigu**. / Filma **ikusten dute**. | gu/zuek/haiek (`nor-nork`) | §3/§7 | ⚠️ new |
| 9 | **The Immediate Continuous** — `ari` + `izan` | Zer **ari zara**? / **Jaten ari naiz**. | reuses Unit 1 `izan` under `ari` | VC §5 | ✅ shipped |

> **`ibili` is introduced here** (with the other movement verbs) so its present
> precedes its past (Unit 11's `izan` pool). **Expansion is two units** because
> the absolutive plural (`gara`/`goaz`/`dabiltza` — marked on the stem) and the
> ergative plural (`dugu`/`dute` — a suffix on the fixed `du-` stem) are
> different paradigms; Unit 8 is framed as "the plural moved — now it's a
> suffix."

### 🛡️ Refresh Gate A

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 10 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | `ez` + auxiliary-fronting (`Mutila etorri da` → `Mutila ez da etorri`). Reuses `negativeSentences` + a `spot-error`-style kind. Word-order shift on `nor` verbs first, `nor-nork` second. |

---

## Phase II — Transitivity & Everyday Life

Persons: full 6-person grid from each verb's first lesson. Pronoun stage:
**B (optional)**. Present pools precede past pools throughout (principle 5).

### Stage 3: Looking Back I — early past (verbs already known in present)

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 11 | **Looking Back I — the `izan` past pool** (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`), mixed across `izan`/`joan`/`etorri`/`ibili` | **(Ni)** gaztea **nintzen**. / **(Ni)** hondartzara **joan nintzen**. / **(Gu)** herrian zehar **ibili ginen**. | §1; §11+§1 | ✅ shipped |

### Stage 4: Daily Actions (present, then their past)

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 12 | **Daily Routine (Transitive)** — `ukan` present aux pooled across `jan`/`edan`/`erosi`/`ikusi`/`hartu` — **MP** | **(Nik)** ogia **jaten dut**. / Liburua **hartzen dut**. *(MP pair: `jaten` -ten vs `hartzen` -tzen)* | §7, VC §4b-bis | ⚠️ +`hartu` |
| 13 | **Looking Back I — the `ukan` past pool** (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`), mixed across `ukan`/`jan`/`edan`/`erosi`/`ikusi` | **(Nik)** auto bat **nuen**. / Sagarra **jan nuen**. / Etxe bat **erosi genuen**. | §3; §7 | ✅ shipped |

### Stage 5: Possessions (present, then past)

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 14 | **Physical States & Possessions** — `eduki` present | Giltzak poltsikoan **dauzkat**. / Denbora **daukagu**. | §7 | ✅ shipped |
| 15 | **"I Had It"** — `eduki` simple past (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/`zeukaten`) | Giltzak **neuzkan**. / Denbora **geneukan**. | §7 | ✅ shipped |

### Stage 6: Location, past

| Unit | Focus | Payload (Stage B) | Ref | Status |
|---|---|---|---|---|
| 16 | **"I Was There"** — `egon` simple past (`nengoen`/`zeunden`/`zegoen`/`geunden`/`zeundeten`/`zeuden`) | **(Ni)** etxean **nengoen**. / Hondartzan **geunden**. | §6 | ✅ shipped |

### Stage 7: The Future (*Geroa*)

| Unit | Focus | Payload (Stage B→C) | Ref | Status |
|---|---|---|---|---|
| 17 | **The Future Rule** — `-ko`/`-go` + present aux, 3-verb core (`izan`/`ukan`/`joan`) — **MP** | Irakasle **izango naiz**. / Autoa **izango dugu**. / Bihar **joango naiz**. *(MP pair: `izango` -go vs `etorriko` -ko)* | §11 | ✅ shipped |
| 18 | **The Future, Across Every Verb** — cross-verb *mixer reviews* | Hori **ikusiko duzu**. / Etxe bat **erosiko dugu**. / **Jakingo duzu**? | §11 | ✅ shipped |
| 19 | **Requirements & Obligations** — `behar` + `ukan`, present + future | **Joan behar dut**. / **Etorri beharko duzu**. *(`behar` always takes `ukan`, even on intransitive `joan`)* | VC §5 | pending |

### 🛡️ Refresh Gate B

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 20 | **REFRESH — Cumulative Present/Past/Future Mixer** | zero new verbs; **score-gated** | Mixes synthetic+periphrastic, positive+negative, present+past+future — the full Units 1–19 range. |

---

## Phase III — Shifting to the Past (aspect)

Pronoun stage: **C (pro-drop default)**.

| Unit | Focus | Payload (Stage C) | Ref | Status |
|---|---|---|---|---|
| 21 | **"I Used To…" — the Imperfective Past** | Hona egunero **etortzen nintzen**. / Lanean **ari nintzen** deitu zuenean. | §11 | pending |
| 22 | **Motion in Progress (Past)** — `joan`/`etorri`/`ibili` native imperfective (`nindoan`/`zetorren`/`nenbilen`) | Bidean **nindoan**… / **Zetorren**, eta orduan… | §6 | pending |

---

## Phase IV — Interpersonal & Relationship Dynamics

Pronoun stage: **D (full null-anaphora; dative/ergative droppable)**.

### Stage 8: The Dative Shift (NOR-NORI)

| Unit | Focus | Payload (Stage D) | Ref | Status |
|---|---|---|---|---|
| 23 | **Pleasures, Opinions, Feelings** — present NOR-NORI (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`) | Hau **gustatzen zait**. / Ongi **iruditzen zaio**. / Liburua **ahaztu zait**. *(plural NOR: Giltzak **ahaztu zaizkit**.)* | §4 | pending |
| 24 | **Dative Across Time** — NOR-NORI **past + future** | Atzo **gustatu zitzaidan**. / Giltzak **ahaztu zitzaizkidan**. / Ziur **gustatuko zaizu**. | §4; §11 | pending — new |

**Unit 23 — extra practice** (first dative-subject forms): (1) recognition; (2)
production, distractors = wrong NORI + plural-NOR `zaizkit` + ergative lure
`dut`; (3) number split (`zait` vs `zaizkit`); (4) case-frame buffer (mixed
`gustatu`/`iruditu`/`ahaztu`, over-learned before the ditransitive lands).

### Stage 9: Communication & Giving (NOR-NORI-NORK)

| Unit | Focus | Payload (Stage D) | Ref | Status |
|---|---|---|---|---|
| 25 | **Communication & Giving** — present NOR-NORI-NORK (`esan`/`eman`), **axis-scaffolded** | **(Nik, hari)** **ematen diot**. / **(Zuk, hari)** **esaten diozu**. | §5, §8 | pending |
| 26 | **Telling & Giving Across Time** — NOR-NORI-NORK **past + future** | **Esan nion**. / **Eman zidan**. / Bihar **esango dizut**. | §5; §11 | pending — new |

**Unit 25 — extra practice** (the ditransitive — never both axes at first
exposure): (1) fix NORI, vary NORK (`diot`/`diozu`/…); (2) fix NORK, vary NORI
(`dizut`/`diot`/`diet`); (3) object number (`dizut` vs `dizkizut`); (4) two-axis
recombination, recognition-first. **Unit 26**: past/future recombination per
axis; conditional/potential/subjunctive ditransitive are **[R]/[—]**.

### 🛡️ Refresh Gate C

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 27 | **REFRESH — The Case-Ending Mixer** | zero new verbs; **score-gated** | Isolates NOR/NORK/NORI by swapping which argument is absolutive/ergative/dative across present/past/future. Reuses `case-mixer`/`spot-error` machinery. **Mandatory pass before Phase V.** |

---

## Phase V — Nuance, Modality, & Social Context

### Stage 10: Hypotheticals & Potentials

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 28 | **Permissions & Capability (Ahalera)** — `dezaket`/`naiteke` vs periphrastic `ahal izan` | **Etor naiteke**. / Hori **esan dezaket**. / **Ezin dut** etorri. | NOR/NOR-NORK [P]; dative [R] | §2/§3, VC §5 | pending |
| 29 | **Conditionals (Baldintza & Ondorioa)** — `ba-` protasis + `-ke` apodosis | Dirua **banu**, hori **erosiko nuke**. | NOR/NOR-NORK [P]; dative [R] | §2/§3 | pending |

### Stage 11: Directives & Wishes (the hard moods, spaced apart)

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 30 | **Commands (Agintera)** — the imperative | **Etorri!** / **Egizu** lan. / **Emadazu** ura. | NOR/NOR-NORK [P]; ditransitive `iezadazu` [R] | §16 | pending — distractor-floor fix needed |
| 31 | **Purpose & Wishing (Subjuntiboa)** — the subjunctive **as a construction** | Nahi dut **etor dadin**. / Esan dio **etor dadila**. | NOR/NOR-NORK 3rd-person in-construction [P]; dative [R] | §16 | pending |

> **Imperative and subjunctive are separate units** with different difficulty
> profiles. The subjunctive barely exists standalone — it surfaces almost only
> embedded in subordinate clauses, so Unit 31 teaches it as a *construction*
> (matrix verb + subordinate clause), recognition-first.

### Stage 12: The Intimate Register (`hi` + Hitanoa)

`hi` enters here for the first time. Four units stage the three independent
novelties — new person, addressee-agreement, gender — one at a time.

| Unit | Focus | Payload | Ref | Status |
|---|---|---|---|---|
| 32 | **Meet `hi`** (no allocutivity) — `hi` as a subject in known paradigms | **Hi** ikaslea **haiz**. / **Hago** lasai. / **Hator** hona. / **Hik** badakik? | §3/§6 | pending |
| 33 | **Toka (masculine allocutive)** — addressee-agreement on 3rd-person statements, one gender | Lanean **dik**. / Etorri **duk**. / Ez **nauk** ondo. | §10 | pending |
| 34 | **Noka (feminine allocutive)** — taught as the `-k`→`-n` transform of Unit 33 | Lanean **din**. / Etorri **dun**. / Ez **naun** ondo. | §10 | pending |
| 35 | **Hitanoa Recombined** — mixed toka/noka + *when not to use it* | choose register by addressee gender; suppress in subordinate clauses / formal `-ke-` moods | §10, LD 2026-06-11 | pending |

### Stage 13: Reading Real Text

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 36 | **Passive & Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | comprehension over real sentences | [R] throughout | §14/§15 | pending — new `reading` kind |

---

## Phase VI — Making Things Happen (Causatives)

Persons: full grid + `hi` (available since Unit 32). The causative is a
*morphological operation* (`-arazi`) recombining everything prior; placed last
so every piece it recombines already exists.

### Stage 14: The Causative Suffix (`-arazi`)

| Unit | Focus | Payload | Coverage | Ref | Status |
|---|---|---|---|---|---|
| 37 | **Making Someone Do It** — `-arazi` on intransitives (`nor`→`nor-nork`) | Ekaitzak mendizaleak **itzularazi zituen**. / Musikak umeak **dantzarazi ditu**. | present/past/future [P] | VC §6 | pending |
| 38 | **Making Someone Do Something to Someone** — `-arazi` on transitives (`nor-nork`→`nor-nori-nork`) | Amonak umeei babarrunak **janarazi zizkien**. / Irakasleak ikasleei hori **idatzarazi die**. | present/past/future [P] | VC §6 | pending |

### 🛡️ Refresh Gate D

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 39 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs; score-gated | Recombines Units 37–38's `-arazi` with future (17–18), conditional (29), imperative (30). |

---

## Coverage map (this proposal)

Agreement × tense/mood, with the production ceiling per cell (**[P]**
production, **[R]** recognition-only, **[—]** deferred). Unit numbers in
parentheses.

| | Present | Simple past | Imperf. past | Future | Potential | Conditional | Imperative | Subjunctive |
|---|---|---|---|---|---|---|---|---|
| **NOR** | [P] 1,6,9 | [P] 11,16 | [P] 21,22 | [P] 17–18 | [P] 28 | [P] 29 | [P] 30 | [P] 31 |
| **NOR-NORK** | [P] 2,4,5,12,14 | [P] 13,15 | [P] 21 | [P] 17–18 | [P] 28 | [P] 29 | [P] 30 | [P] 31 |
| **NOR-NORI** | [P] 23 | [P] 24 | [—] | [P] 24 | [R] 28 | [R] 29 | n/a | [—] |
| **NOR-NORI-NORK** | [P] 25 | [P] 26 | [—] | [P] 26 | [R] 28 | [R] 29 | [R] 30 | [R] 31 |
| **Causative** (derivational) | [P] 37,38 | [P] 37,38 | [—] | [P] 39 | [R] 39 | — | [R] 39 | [—] |

The **case-marking checkpoint (Unit 3)** is not a tense/mood cell — it drills
the absolutive/ergative *subject* contrast across the present forms already
taught, and is the Phase-I counterpart to Gate C (Unit 27). `hi`/hitanoa (Units
32–35) layers across the indicative present/past it teaches on.

---

## Distractor Engine Matrix

A distractor is valuable only if a learner who picks it reveals one *named*
slippage. "Slot 1/2/3" are the three distractor positions filled alongside the
correct answer (`generateQuestions`/`buildOptions`).

| Paradigm | Correct axis | Slot 1 (primary trap) | Slot 2 (secondary) | Slot 3 (lure) | Error class caught |
|---|---|---|---|---|---|
| **NOR present** | subject person | other in-scope person | second in-scope person | borrowed plural (post-Unit 7) / near-homophone | subject-agreement person |
| **NOR-NORK present** | ergative person | other ergative form | second ergative form | a `nor` form of same gloss (`naiz` for `dut`) | ergative person + aux drift |
| **Case-marking (Unit 3)** | bare vs `-k` subject | the wrong-case subject (`†Nik naiz`) | other-person wrong-case | correct verb, wrong person | **ergative drift** (the `ni`/`nik` error) |
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
not the drilled axis. Distractors are always real paradigm forms, except the two
intentional non-word voicing traps (`†izanko`, `†etorrigo`) in the future row,
which exist to test the `-ko`/`-go` rule and must never appear in a correct
position.

---

## Architectural data resolutions (needed to build the pending units)

### `ahaztu` — NOR-NORI paradigm (Unit 23)

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

Plural-NOR column (`ahaztu zaizkit`/… "forgot *them*") is distractor fodder and
itself real (`Giltzak ahaztu zaizkit`).

### `esan`/`eman` — ditransitive, axis-fixed (Units 25–26)

§5 grids are 2D (NORK × NORI). The deployment path fixes one axis per lesson:
**25·L1** fixes NORI=`hari` (`recipient: 'hura'`), varies NORK; **25·L2** fixes
NORK=`nik` (`agent: 'ni'`), varies NORI; the `-zki-` forms (`dizkiot`…) supply
the number slot. Unit 26 applies the §5 past grid and `-ko`/`-go` future to the
same axis-fixed slices. Forward-compatible with a real 2D table
(`EXERCISE_ENGINE.md` Tier 3).

### `-arazi` — phonetic conditioning (Phase VI)

**Batua standard: `-arazi`, universally, on the verbal radical** (the
*aditzoina* = participle minus `-tu`/`-i`/`-n`, consonant restored):
`jan→janarazi`, `ikus→ikusarazi`, `etor→etorrarazi`, `idatz→idatzarazi`,
`itzul→itzularazi`. Live junction rules: (1) radical-final `-r` doubles to
`-rr-` before the vowel-initial suffix; (2) the suffix-initial `/a/` is stable
(no assimilation/elision); (3) no voicing change at the seam. The historical
`-erazi`/`-erazo`/`-arazo` variants are recognized in the central/eastern
literary tradition — **[R] recognition-only** (Unit 36's reading), never
production-drilled. A causativized verb is a `type: 'periphrastic'` entry:
`[radical]+arazi` participle + the auxiliary picked by the *post-causative*
agreement (`ukan` for Unit 37's `nor-nork`; `ukan`'s `*-io-` ditransitive
paradigm for Unit 38's `nor-nori-nork`). Zero new data shapes (VC §6).

### Score-gating predicate (gate units 10, 20, 27, 39)

`getUnlockedLessonIds` checks `bestStars >= 2` (≥80%, per `computeStars`) for
gate lessons; sub-threshold leaves the next unit locked and the gate replayable
with a "needs 80% to continue" prompt. No stored-shape change.
