# Aditzak — Learning Journey (acquisition order)

> Content design only — no exercises, no `VERBS` data yet. Units are ordered
> by communicative goal rather than grammatical category, and prioritize
> usefulness over implementation-ease where the two trade off.

## Core pedagogical realignment

1. **The "Me, You, and It" horizon.** Real conversation runs overwhelmingly on
   `ni`/`zu`/`hura` (1sg, 2sg-neutral, 3sg). Every verb's *first* lesson is
   restricted to these three forms; `gu`/`zuek`/`haiek` are unlocked together
   in one **Expansion** unit (Refresh Gate A) once enough verbs exist to make
   the expansion feel like "more of what you know" rather than "six new
   words."
2. **`zu` is the default "you," from lesson one.** `zu` is foundational from
   the start, and `hi` is **deferred entirely** to a single late unit that
   teaches it *together with* the allocutive register (hitanoa) — `hi` was
   always going to need that register context to make sense, so folding the
   two into one "intimate register" unit (Phase V, Unit 21) is both more
   natural *and* simpler than maintaining `hi` as a 7th person throughout the
   core curriculum. The "core" person grid is `ni/zu/hura/gu/zuek/haiek`.
3. **Functional grouping over grammatical grouping.** A learner doesn't care
   that `ikusi` is periphrastic and `eduki` is synthetic — both just say
   "I see / I have." Units are named for what they let you *say*
   (Location & State, Movement, Daily Routine, ...), drawing from whichever
   verb shape fits, with the synthetic/periphrastic distinction explained
   in passing rather than used as a unit boundary.
4. **Refresh Gates are structural, not optional.** Every Phase ends with a
   gate unit that introduces **zero new verbs** — pure consolidation,
   negation drills, person-grid expansion, or cross-paradigm "which suffix
   goes where" sorting. Gates are the device that gives the otherwise-linear
   `getUnlockedLessonIds` progression its spaced-repetition character.
5. **Person-Expansion Rule**: the 3-persons-first restriction applies only to
   **Phase I** (Units 1–4).
   Refresh Gate A's "Expansion" unit (Unit 6) completes the `gu`/`zuek`/
   `haiek` columns for *every* verb introduced so far (`izan`, `egon`,
   `ukan`, `joan`, `etorri` — `ari`/`nahi` ride `izan`/`ukan`'s tables and
   need no separate expansion). From Unit 7 onward, **every new verb is
   taught with its full 6-person grid (`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`)**
   — but per the app-wide "max 3 persons per exercise" rule
   (`docs/DECISIONS.md`, 2026-06-12), that grid is now split across **two**
   lessons per (verb × tense) — a `ni`/`zu`/`hura` lesson immediately
   followed by a `gu`/`zuek`/`haiek` `-plural` sibling — rather than drilled
   all 6 persons in one lesson. Unit 6's own reviews (`unit-6-review-*`) are
   similarly scoped to `gu`/`zuek`/`haiek` only.
6. **Difficulty-weighted extra practice.** Most units introduce one new verb
   in a pattern the learner already knows (same `nor`/`nor-nork` shape, just
   new vocabulary) and get the standard treatment: one practice lesson per new
   (verb × tense), plus the auto-generated verb/mixed reviews from
   `docs/DECISIONS.md`'s "ramps up in three stages" entry. A handful of units
   instead introduce a *new grammatical relation or register* the learner has
   never used before — these get one or more **additional dedicated practice
   lessons** (beyond the standard verb-review), drilling that new relation in
   isolation, before the unit's own review caps it off. Flagged units, to be
   reflected in their `lessonIds` once implemented:
   - **Unit 2** — first `nor-nork`/ergative subject (`ukan`); `jakin`
     reinforces this immediately afterward by showing the *same* `-t`/`-zu`/∅
     suffixes on a fully synthetic verb, not a periphrastic one
   - **Unit 8** — first full 6-person transitive grid
   - **Unit 15** — first NOR-NORI / dative-subject forms (`zait`/`zaizu`/`zaio`)
   - **Unit 16** — first NOR-NORI-NORK / ditransitive — the steepest jump in
     the whole sequence, gets **two** extra practice lessons, not one
   - **Unit 20** — imperative (a new register)
   - **Unit 21** — `hi` + hitanoa (a new register)
   - **Unit 23** — first valency-*increasing* derivation (`-arazi` turning
     `nor` into `nor-nork`) — a new morphological operation, not just new
     vocabulary in a known pattern
   - **Unit 24** — extends `-arazi` to `nor-nori-nork` — same "steepest jump"
     character as Unit 16, gets two extra practice lessons like it did

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

- **`egon`/`joan`/`etorri`/`ibili` (§6) already have `zu` rows** — §6's data
  was written with 7 persons (`ni`/`hi`/`hura`/`gu`/`zu`/`zuek`/`haiek`) from
  the start, so this journey just stops asking for `hi`'s row until Unit 21.
- **§6's "Past" column for `joan`/`etorri`/`ibili` is imperfective
  ("I was going" — `nindoan`, `zetorren`), not simple past ("I went" —
  periphrastic `joan nintzen`).** Those forms express ongoing/habitual past
  motion, the opposite of "completed," so Unit 14 ("Motion in Progress
  (Past)") covers them, while "completed motion" (`joan nintzen`,
  `etorri nintzen`) belongs in Unit 13's periphrastic past instead.
- **Restricting a lesson to `ni`/`zu`/`hura`** isn't something the current
  `generateQuestions`/`conjugations` shape distinguishes — it builds one
  question per key in a tense's conjugation object, i.e. however many persons
  that object has. Two ways to get a 3-person lesson without changing the
  data shape: (a) the Phase I `conjugations` entries for `izan`/`ukan`/etc.
  *literally only contain* `ni`/`zu`/`hura` keys at first, and Unit 6 is the
  point where `gu`/`zuek`/`haiek` keys get added to those same objects
  (simplest — no code change, but means a verb's `conjugations.present`
  object grows after the fact); or (b) lessons gain an optional `persons`
  filter applied in `generateQuestions`. (a) requires no new mechanism and
  matches "Unit 6 = Expansion" framing literally — recommended, but flagged
  as a decision for whoever implements this.
- **Negation (`ez`) drills (Unit 5)** need a sentence pattern this app
  doesn't have yet: Basque negation moves the auxiliary in front of the
  participle/predicate (`Mutila etorri da` → `Mutila ez da etorri`), so it's
  not just "swap in a different conjugated form" — the *word order* changes.
  This likely needs its own `sentences`-like data (a `negativeSentences`
  table mirroring `pronounSentences`'s shape) and possibly its own question
  `kind` (cf. `DECISIONS.md`'s `spot-error` precedent for "a new kind when the
  existing shapes don't fit").
- **Causative (`-arazi`/`-erazi`, Phase VI) needs no new data shape** — per
  VERB_COVERAGE §6, a causativized verb is just another `type: 'periphrastic'`
  entry (`[radical]+(a/e)razi` participle + `izan`/`ukan` auxiliary), so its
  `conjugations`/`sentences`/`pronounSentences` tables follow the Tier 1
  pattern in `EXERCISE_ENGINE.md`. The only new work is content: picking
  representative verbs for Units 23-24 and writing their causativized forms —
  `docs/SAMPLE_SENTENCES.md`'s causative bank is the starting material. The
  `-arazi`/`-erazi` conditioning rule (which form, when) needs sourcing
  before those `VERBS` entries are written.
- **`jakin`'s past tense (`CONJUGATIONS.md` §7) has gaps** (`hik`/`zuk`/`zuek`
  are `—`) — irrelevant to Unit 2 (present-only, `ni`/`zu`/`hura`, all three
  present forms already documented), but flag before any later unit
  (e.g. Unit 12, "I Was, I Had") considers extending to `jakin`'s past.
- **Unit 4's `ari` examples need at least one verb's imperfective participle
  as vocabulary** before any concrete "I am doing X" sentence can be written —
  `jaten` (`jan`'s participle, Unit 7's verb) is the natural choice, since
  Unit 7 will teach `jan`'s full table anyway, so introducing its participle
  here costs nothing extra later and gives Unit 7 a head start.
- **Refresh Gate units** (5, 11, 17, 25, and the implicit Phase-V wrap-up) are
  structurally `review: true` lessons with `sources` drawn from *everything
  taught so far in that phase* — the existing review-lesson mechanism already
  supports this. The only new idea is that some gates (Unit 11 specifically)
  are framed as **must-pass-with-high-accuracy** before the next lesson
  unlocks — `getUnlockedLessonIds` currently only checks "has at least one
  attempt," not score. Gating on score is a small but real change to that
  function, and a product decision (what threshold? what happens on failure
  — replay, or just a warning?) worth making explicitly rather than
  inferring from "high accuracy rating."

## The journey

### Phase I — Survival Present (Me, You, & It)

Persons in scope throughout Phase I: **`ni` / `zu` / `hura`** only.

#### Stage 1: Absolute Foundations

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 1 | **Who and Where** — `izan` + `egon` present | "I am a student." / "Where are you?" / "He is at home." | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1 (izan), §6 (egon) | ✅ both have `zu` rows in `CONJUGATIONS.md` |
| 2 | **Having, Wanting, and Knowing** — `ukan` present (object fixed `hura`) + `nahi` + `jakin` | "I have a car." / "I want coffee." / "Do you want to come?" / "I don't know." | ni/zu/hura: `dut`/`duzu`/`du`, `nahi dut`/`nahi duzu`/`nahi du`, `dakit`/`dakizu`/`daki` | §3 (ukan), VERB_COVERAGE §5 (`nahi`), §7 (`jakin`) | ✅ `ukan` has its `zu` row; `jakin`'s `dakit`/`dakizu`/`daki` are all documented in `CONJUGATIONS.md` §7 |

#### Stage 2: Basic Operations & Movement

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 3 | **Moving Around** — `joan` + `etorri` present | "I'm going to the beach." / "She's coming tomorrow." | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator` | §6 | ✅ already has `zu` |
| 4 | **The Immediate Continuous** — `ari` + `izan` | "What are you doing?" (`Zer ari zara?`) / "I'm eating." (`Jaten ari naiz`) | reuses Unit 1's `izan` present table under `ari` | VERB_COVERAGE §5 | ✅ reuses Unit 1's table; `jaten` (`jan`'s imperfective participle, Unit 7's verb) introduced here as a single fixed vocabulary item — no new conjugation, and primes Unit 7's `jan` table |

### 🛡️ Refresh Gate A — The "Ez" Trap & Person Expansion

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 5 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | Drills `ez` + auxiliary-fronting across Units 1–4's verbs (`Mutila etorri da` → `Mutila ez da etorri`). Needs the `negativeSentences`-shape data flagged above. |
| 6 | **Expansion — Bringing in the Plural** | zero new verbs; completes grids | Adds `gu`/`zuek`/`haiek` to `izan`, `egon`, `ukan`, `joan`, `etorri` (per the Person-Expansion Rule, this is the *only* expansion pass — every verb from Unit 7 on starts at the full 6-person grid) |

---

### Phase II — Transitivity & Everyday Life

Persons in scope from here on: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`**
grid, every verb, from each verb's first lesson (Person-Expansion Rule).

#### Stage 3: Real-World Actions

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 7 | **Daily Routine (Transitive)** — `jan`, `edan`, `erosi` (periphrastic + `ukan`), `ikusi` | "I ate." / "You drink water." / "I bought a book." / "Do you see it?" | §7 (`ikusi` only) | `jan`/`edan`/`erosi` are **not yet in `CONJUGATIONS.md`** — straightforward `-ukan` periphrastics, but need a documentation pass first, same as `ikusi`/`entzun` got |
| 8 | **Physical States & Possessions** — `eduki`, `ibili` (full 6-person grids) | "I have the keys in my pocket." / "They are wandering around town." | §7 (eduki), §6 (ibili) | ✅ both already have `zu` rows |

#### Stage 4: Talking About the Future (*Geroa*)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 9 | **Intentions & Future Actions** — `-ko`/`-go` + present auxiliaries, applied to every verb so far | "I will go tomorrow" (`joango naiz`) / "We will buy a house" (`erosiko dugu`) | §11 (periphrastic tense matrix) | reuses Unit 1–8 auxiliary tables; only the participle-formation rule is new |
| 10 | **Requirements & Obligations** — `behar` + `ukan`, present and future | "I have to go." (`Joan behar dut`) / "You'll have to come." (`Etorri beharko duzu`) | VERB_COVERAGE §5 (point 2 — the construction's head, not the lexical verb, picks the auxiliary) | reuses `ukan` tables exactly like Unit 2's `nahi`; payload deliberately reuses Unit 3's intransitive `joan`/`etorri` (`naiz`-pattern alone) to surface the `behar`-always-takes-`ukan` "aha" moment |

### 🛡️ Refresh Gate B — The Core Present Checkpoint

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 11 | **REFRESH — Cumulative Present Mixer** | zero new verbs; comprehensive | Mixes synthetic + periphrastic, positive + negative (reuses Gate A's negation pattern across the whole verb set), and present + future. **Gate-by-score**: should require a high-accuracy pass before Phase III unlocks — see "score-gating" in the implications section above for what that requires. |

---

### Phase III — Shifting to the Past

#### Stage 5: Storytelling Basics

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 12 | **"I Was, I Had"** — `izan`/`ukan` past, full grid | "I was young." / "She had a dog." | §1, §3 | ✅ `zu`'s `zinen`/`zenuen` are in `CONJUGATIONS.md` |
| 13 | **Past Narrative Flow** — periphrastic past (`ikusi nuen`), imperfective/habitual past (`etortzen nintzen`), **and completed motion** (`joan nintzen`, `etorri nintzen`) | "I saw it." / "I used to come (often)." / "I went." / "She came." | §11 (periphrastic tense matrix), §13 | `joan`/`etorri` simple-past (`joan nintzen`) belongs *here*, not Unit 14 |
| 14 | **Motion in Progress (Past)** — `joan`/`etorri`/`ibili`'s native past forms (`nindoan` "I was going", `zetorren` "he was coming") | "I was on my way (when...)." / "He was coming (and then...)." | §6 | ✅ already in §6's tables; framed explicitly as imperfective/progressive, contrasted with Unit 13's `joan nintzen` |

---

### Phase IV — Interpersonal & Relationship Dynamics

#### Stage 6: The Dative Shift ("To Me / For Me")

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 15 | **Pleasures, Opinions, and Physical Feelings** — present NOR-NORI, 3rd-person subjects (`zait`/`zaizu`/`zaio`) | "I like it." / "It seems good to me." / "I forgot (it slipped my mind)." | §4 (gustatu, iruditu) | `gustatu`/`iruditu` ✅ documented; **`ahaztu` is not yet in `CONJUGATIONS.md`** — same family of forms (`zait`-paradigm) but needs its own pass |
| 16 | **Communication & Giving** — present NOR-NORI-NORK (`esan`, `eman`) | "I give it to you" (`ematen dizut`) / "You tell it to him" (`esaten diozu`) | §5, §8 | ✅ documented |

### 🛡️ Refresh Gate C — The Multi-Argument Audit

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 17 | **REFRESH — The Case-Ending Mixer** | zero new verbs | Isolates and drills the NOR/NORK/NORI distinction specifically — sentences that swap which argument is absolutive vs. ergative vs. dative, to head off the classic "mixed up the `-k`" error this stage's grammar invites. |

---

### Phase V — Nuance, Modality, & Social Context

#### Stage 7: Hypotheticals and Potentials

| Unit | Focus | Payload | Ref |
|---|---|---|---|
| 18 | **Permissions & Capability (Ahalera)** — `dezaket`/`naiteke` contrasted with periphrastic `ahal izan` | "I can come." / "I could (have) ..." | §2, §3, VERB_COVERAGE §5 (`ahal`/`ezin`) |
| 19 | **Conditionals (Baldintza & Ondorioa)** — `ba-` protasis + `-ke` apodosis | "If I had money, I would buy that" (`Dirua banu, hori erosiko nuke`) | §2, §3 |

#### Stage 8: Social Registers & Complete Native Integration

| Unit | Focus | Payload | Ref |
|---|---|---|---|
| 20 | **Command & Subjunctives (Agintera, Subjuntiboa)** | direct commands; "so that..." purpose clauses | §9, §16 |
| 21 | **The Intimate Social Register (`hi` + Hitanoa/Hiketa)** | `hi` introduced **for the first time**, immediately paired with toka/noka allocutive marking — taught as one register, not two separate facts | §10 |
| 22 | **Passive Transformation & Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | recognition-oriented: reading real sentences | §14, §15 |

---

### Phase VI — Making Things Happen (Causatives)

Persons in scope: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`** grid (Person-
Expansion Rule), plus `hi` (available since Unit 21).

This phase sits last because it isn't "one more verb" — it's a *morphological
operation* (`-arazi`/`-erazi`, VERB_COVERAGE §6) that recombines everything
taught so far: it turns a `nor` verb into `nor-nork` (Units 1-8's territory)
or a `nor-nork` verb into `nor-nori-nork` (Unit 16's), and the result still
inflects for future (Unit 9), conditional (Unit 19), and imperative (Unit 20)
exactly like any other periphrastic verb — the auxiliary at the end carries
tense/mood (`type: 'periphrastic'`, `CLAUDE.md`). Placing it last means a
learner already has every piece this phase recombines, and it needs no new
`VERBS` shape (VERB_COVERAGE §6) — just new vocabulary in the existing
`periphrastic` pattern.

#### Stage 9: The Causative Suffix (-arazi/-erazi)

| Unit | Focus | Payload | Ref |
|---|---|---|---|
| 23 | **Making Someone Do It** — `-arazi` on intransitive verbs (`nor` → `nor-nork`) | "The storm made the climbers turn back." (`itzularazi zituen`) / "The music made the kids dance." (`dantzarazi ditu`) | VERB_COVERAGE §6 |
| 24 | **Making Someone Do Something To Someone** — `-arazi` on transitive verbs (`nor-nork` → `nor-nori-nork`) | "Grandma made the kids eat the beans." (`janarazi dizkie`) / "The teacher made the students write it." (`idatzarazi die`) | VERB_COVERAGE §6 |

#### 🛡️ Refresh Gate D — The Causative Recombination

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 25 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs | Recombines Units 23-24's `-arazi` forms with future (Unit 9), conditional (Unit 19), and imperative (Unit 20) — "makes/made/will make/would make/make (someone do X)" — same cross-paradigm-sorting character as the other Refresh Gates. |

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
after Phase IV (Stage 6/Refresh Gate C) makes NOR/NORK/NORI confusion a live
issue worth detecting.
