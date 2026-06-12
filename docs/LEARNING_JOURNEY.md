# Aditzak — Learning Journey (acquisition order)

> Units 1-19 are implemented — see `journey.js`'s `available` units and
> `LESSONS` in `App.jsx`. Units 20+ remain content design only — no
> exercises, no `VERBS` data yet. Units are ordered by communicative goal
> rather than grammatical category, and prioritize usefulness over
> implementation-ease where the two trade off.

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
   two into one "intimate register" unit (Phase V, Unit 28) is both more
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
   **Phase I** (Units 1–5).
   Refresh Gate A's "Expansion" unit (Unit 7) completes the `gu`/`zuek`/
   `haiek` columns for *every* verb introduced so far (`izan`, `egon`,
   `ukan`, `joan`, `etorri`, `ikusi` — `ari`/`nahi` ride `izan`/`ukan`'s
   tables and need no separate expansion). `ikusi`'s table was already
   6-person when it arrived in Unit 3 (reused from Phase II's original
   table), so Unit 7 adds it via a dedicated `ikusi-present-plural`
   lesson+review rather than retrofitting data, alongside the
   `izan`/`egon`/`ukan`/`joan`/`etorri` retrofit. From Unit 8 onward, **every
   new verb is taught with its full 6-person grid (`ni`/`zu`/`hura`/`gu`/
   `zuek`/`haiek`)** — but per the app-wide "max 3 persons per exercise" rule
   (`docs/DECISIONS.md`, 2026-06-12), that grid is now split across **two**
   lessons per (verb × tense) — a `ni`/`zu`/`hura` lesson immediately
   followed by a `gu`/`zuek`/`haiek` `-plural` sibling — rather than drilled
   all 6 persons in one lesson. Unit 7's own reviews (still ids'd
   `unit-6-review-*`, predating this redesign's renumbering) are similarly
   scoped to `gu`/`zuek`/`haiek` only.
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
   - **Unit 22** — first NOR-NORI / dative-subject forms (`zait`/`zaizu`/`zaio`)
   - **Unit 23** — first NOR-NORI-NORK / ditransitive — the steepest jump in
     the whole sequence, gets **two** extra practice lessons, not one
   - **Unit 27** — imperative (a new register)
   - **Unit 28** — `hi` + hitanoa (a new register)
   - **Unit 30** — first valency-*increasing* derivation (`-arazi` turning
     `nor` into `nor-nork`) — a new morphological operation, not just new
     vocabulary in a known pattern
   - **Unit 31** — extends `-arazi` to `nor-nori-nork` — same "steepest jump"
     character as Unit 23, gets two extra practice lessons like it did

   The "Looking Back I/II" units (8-9, 12-13) are deliberately **not** on this
   list — they pair an already-taught verb's *simple past* with its present,
   the same `nor`/`nor-nork` shape the learner already drilled in Units 1-2/
   4/10-11, so nothing here is a "new relation" in this section's sense (the
   full 6-person grid itself was already introduced for these verbs by Unit
   7's Expansion).

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
  the start, so this journey just stops asking for `hi`'s row until Unit 28.
- **§6's "Past" column for `joan`/`etorri`/`ibili` is imperfective
  ("I was going" — `nindoan`, `zetorren`), not simple past ("I went" —
  periphrastic `joan nintzen`).** Those forms express ongoing/habitual past
  motion, the opposite of "completed."
  **Resolved**: simple/completed past for `joan`/`etorri`/`ibili`
  (`joan nintzen`, `etorri nintzen`, `ibili nintzen`) was implemented in Units
  9 and 13 ("Looking Back I/II") via the periphrastic Lehenaldi Mugatua
  pattern (§11: perfective participle + `izan`'s past auxiliary, §1) — see
  `docs/LANGUAGE_DECISIONS.md`. Unit 21 ("Motion in Progress (Past)") remains
  pending for §6's distinct imperfective forms (`nindoan`/`zetorren`/
  `nenbilen`).
- **Restricting a lesson to `ni`/`zu`/`hura`** isn't something the current
  `generateQuestions`/`conjugations` shape distinguishes by default.
  **Resolved** via a `persons` filter on lessons (option (b) below), applied
  retroactively where needed — see `docs/EXERCISE_ENGINE.md`'s "Phase I's
  3-person horizon" and `docs/DECISIONS.md`'s 2026-06-12 entries. The two
  approaches considered were: (a) a verb's `conjugations` entries *literally
  only contain* `ni`/`zu`/`hura` keys until an Expansion unit adds the rest in
  place (simplest, but a verb's table grows after the fact and retroactively
  changes earlier lessons' distractor pools); or (b) lessons gain an optional
  `persons` filter applied in `generateQuestions`/`buildOptions`/
  `buildSpotErrorQuestion` (more code, but keeps `VERBS` tables complete from
  the start and is reusable for any future partial-grid lesson).
- **Negation (`ez`) drills (Unit 6)** needed a sentence pattern this app
  didn't have: Basque negation moves the auxiliary in front of the
  participle/predicate (`Mutila etorri da` → `Mutila ez da etorri`), so it's
  not just "swap in a different conjugated form" — the *word order* changes.
  **Resolved**: implemented as a `negativeSentences` table (mirroring
  `pronounSentences`'s shape) plus `negative`/`type-negative` question kinds —
  see `docs/DECISIONS.md`'s "Implemented Unit 5" entry (predates this
  redesign's renumbering; that unit is now Unit 6). **Refresh Gate C (Unit
  24)** drills the same "candidate full sentences, pick the right/wrong one"
  shape for NOR/NORI/NORK role-swaps instead of negation, and is expected to
  reuse this same question-kind machinery with a role-swapped sentence-pair
  source.
- **Causative (`-arazi`/`-erazi`, Phase VI) needs no new data shape** — per
  VERB_COVERAGE §6, a causativized verb is just another `type: 'periphrastic'`
  entry (`[radical]+(a/e)razi` participle + `izan`/`ukan` auxiliary), so its
  `conjugations`/`sentences`/`pronounSentences` tables follow the Tier 1
  pattern in `EXERCISE_ENGINE.md`. The only new work is content: picking
  representative verbs for Units 30-31 and writing their causativized forms —
  `docs/SAMPLE_SENTENCES.md`'s causative bank is the starting material. The
  `-arazi`/`-erazi` conditioning rule (which form, when) needs sourcing
  before those `VERBS` entries are written.
- **`jakin`'s past tense (`CONJUGATIONS.md` §7) has gaps** (`hik`/`zuk`/`zuek`
  are `—`) — irrelevant to Unit 2 (present-only, `ni`/`zu`/`hura`, all three
  present forms already documented). This is why `jakin` was left out of Unit
  8 ("Looking Back I — I Was, I Had") despite riding `ukan`'s suffix family
  there too — see `docs/LANGUAGE_DECISIONS.md` for the deferral. Revisit if
  `jakin`'s past gap gets sourced.
- **Unit 5's `ari` examples need at least one verb's imperfective participle
  as vocabulary** before any concrete "I am doing X" sentence can be written —
  `jaten` (`jan`'s participle, Unit 10's verb) is the natural choice, since
  Unit 10 will teach `jan`'s full table anyway, so introducing its participle
  here costs nothing extra later and gives Unit 10 a head start.
- **Refresh Gate units** (6, 7, 19, 24, 32, and the implicit Phase-V wrap-up)
  are structurally `review: true` lessons with `sources` drawn from
  *everything taught so far in that phase* — the existing review-lesson
  mechanism already supports this. The only new idea is that some gates (Unit
  19 specifically) are framed as **must-pass-with-high-accuracy** before the
  next lesson unlocks — `getUnlockedLessonIds` currently only checks "has at
  least one attempt," not score. Gating on score is a small but real change to
  that function, and a product decision (what threshold? what happens on
  failure — replay, or just a warning?) worth making explicitly rather than
  inferring from "high accuracy rating."

## The journey

### Phase I — Survival Present (Me, You, & It)

Persons in scope throughout Phase I: **`ni` / `zu` / `hura`** only.

#### Stage 1: Absolute Foundations

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 1 | **Who and Where** — `izan` + `egon` present | "I am a student." / "Where are you?" / "He is at home." | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1 (izan), §6 (egon) | ✅ implemented |
| 2 | **Having, Wanting, and Knowing** — `ukan` present (object fixed `hura`) + `nahi` + `jakin` | "I have a car." / "I want coffee." / "Do you want to come?" / "I don't know." | ni/zu/hura: `dut`/`duzu`/`du`, `nahi dut`/`nahi duzu`/`nahi du`, `dakit`/`dakizu`/`daki` | §3 (ukan), VERB_COVERAGE §5 (`nahi`), §7 (`jakin`) | ✅ implemented |
| 3 | **Seeing** — `ikusi` present (ni/zu/hura), Phase I's first periphrastic verb | "I see the mountain." / "Do you see it?" / "She sees the film." | ni/zu/hura: `ikusten dut`/`ikusten duzu`/`ikusten du` | §7 (ikusi) | ✅ implemented — reuses `ikusi`'s existing 6-person `present` table via `persons: PHASE_1_PERSONS` |

#### Stage 2: Basic Operations & Movement

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 4 | **Moving Around** — `joan` + `etorri` present | "I'm going to the beach." / "She's coming tomorrow." | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator` | §6 | ✅ implemented |
| 5 | **The Immediate Continuous** — `ari` + `izan` | "What are you doing?" (`Zer ari zara?`) / "I'm eating." (`Jaten ari naiz`) | reuses Unit 1's `izan` present table under `ari` | VERB_COVERAGE §5 | ✅ implemented — `jaten` (`jan`'s imperfective participle, Unit 10's verb) introduced here as a single fixed vocabulary item |

### 🛡️ Refresh Gate A — The "Ez" Trap & Person Expansion

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 6 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | Drills `ez` + auxiliary-fronting across Units 1–5's verbs (`Mutila etorri da` → `Mutila ez da etorri`). `ikusi` (Unit 3) has no `negativeSentences` — like `nahi`/`ari`, its auxiliary splits from the invariant participle under negation, out of scope for this exclusive-negation lesson. |
| 7 | **Expansion — Bringing in the Plural** | zero new verbs; completes grids | Adds `gu`/`zuek`/`haiek` to `izan`, `egon`, `ukan`, `joan`, `etorri`, and `ikusi` (via a dedicated `ikusi-present-plural` lesson+review) — per the Person-Expansion Rule, this is the *only* expansion pass; every verb from Unit 8 on starts at the full 6-person grid |

---

### Phase II — Transitivity & Everyday Life

Persons in scope from here on: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`**
grid, every verb, from each verb's first lesson (Person-Expansion Rule).

#### Stage 3: Looking Back I

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 8 | **Looking Back I — "I Was, I Had"** — `izan`, `egon`, `ukan` simple past, full 6-person grid | "I was young." / "She had a dog." / "We were at home." | §1 (izan), §6 (egon), §3 (ukan) | ✅ implemented |
| 9 | **Looking Back I — "I Went, I Came, I Saw"** — `joan`, `etorri`, `ikusi` simple past, full 6-person grid | "I went to the beach." / "She came yesterday." / "We saw the film." | `joan`/`etorri`: §11 (periphrastic Lehenaldi Mugatua) + §1 (`izan` past auxiliary); `ikusi`: §7 (already documented) | ✅ implemented |

Pairing each verb group's simple past with its present soon after — rather
than saving *all* past tense for Phase III — is this redesign's central idea:
tense variety (present → past → future) now arrives by Unit 9, instead of
after 8+ units of present-only drilling.

#### Stage 4: Real-World Actions

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 10 | **Daily Routine (Transitive)** — `jan`, `edan`, `erosi` present (periphrastic + `ukan`) | "I eat." / "You drink water." / "I buy a book." | §7 | ✅ implemented |
| 11 | **Physical States & Possessions** — `eduki`, `ibili` full 6-person grids | "I have the keys in my pocket." / "They are wandering around town." | §7 (eduki), §6 (ibili) | ✅ implemented |

`ikusi` no longer appears here — it moved to Unit 3 as Phase I's first
periphrastic verb, so this unit's verb set is `jan`/`edan`/`erosi` only.

#### Stage 5: Looking Back II

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 12 | **Looking Back II — "I Ate, I Drank, I Bought"** — `jan`, `edan`, `erosi` simple past, full 6-person grid | "I ate the apple." / "You drank coffee." / "We bought a house." | §7 | ✅ implemented |
| 13 | **Looking Back II — "I Had, I Walked Around"** — `eduki`, `ibili` simple past, full 6-person grid | "I had the keys." / "They were wandering around town." | `eduki`: §7 (synthetic, `neukan` etc.); `ibili`: §11 + §1 (periphrastic simple past `ibili nintzen`, distinct from §6's imperfective `nenbilen`) | ✅ implemented |

#### Stage 6: Talking About the Future (*Geroa*)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 14 | **Future — Being & Having** — `-ko`/`-go` + present auxiliaries, applied to `izan`, `egon`, `ukan` | "I will be a teacher" (`irakasle izango naiz`) / "We will have a car" (`autoa izango dugu`) | §11 (periphrastic tense matrix) | ✅ implemented |
| 15 | **Future — Wanting, Knowing & Moving** — applied to `nahi`, `jakin`, `joan`, `etorri` | "I will go tomorrow" (`joango naiz`) / "Will you know?" (`jakingo duzu?`) | §11 | ✅ implemented |
| 16 | **Future — Eating, Drinking & Buying** — applied to `jan`, `edan`, `erosi` | "We will buy a house" (`erosiko dugu`) / "I will eat later" (`geroago jango dut`) | §11 | ✅ implemented |
| 17 | **Future — Seeing, Having & Walking** — applied to `ikusi`, `eduki`, `ibili` | "You will see it" (`ikusiko duzu`) / "They will have time" (`denbora edukiko dute`) | §11 | ✅ implemented |
| 18 | **Requirements & Obligations** — `behar` + `ukan`, present and future | "I have to go." (`Joan behar dut`) / "You'll have to come." (`Etorri beharko duzu`) | VERB_COVERAGE §5 (point 2 — the construction's head, not the lexical verb, picks the auxiliary) | pending — reuses `ukan` tables exactly like Unit 2's `nahi`; payload deliberately reuses Unit 4's intransitive `joan`/`etorri` (`naiz`-pattern alone) to surface the `behar`-always-takes-`ukan` "aha" moment |

These four future units (14-17) are a 1-for-1 split of what was originally a
single 32-lesson "Geroa" unit — same content, same source tables (§11), just
grouped into four ~8-lesson units that match the pacing of Units 1-13 instead
of sitting as a single oversized unit right after them.

### 🛡️ Refresh Gate B — The Core Tense Checkpoint

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 19 | **REFRESH — Cumulative Present/Past/Future Mixer** | zero new verbs; comprehensive | Mixes synthetic + periphrastic, positive + negative (reuses Gate A's negation pattern), and present + past + future — the full tense range Units 1-18 introduced. **Gate-by-score**: should require a high-accuracy pass before Phase III unlocks — see "score-gating" in the implications section above for what that requires. |

---

### Phase III — Shifting to the Past

#### Stage 7: Aspect in the Past

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 20 | **"I Used To..." — The Imperfective Past** | "I used to come here every day." / "I was working when she called." | imperfective/habitual past (`etortzen nintzen`, "I used to come / I was coming") — distinct from the simple past taught in Units 8/9/12/13 | pending |
| 21 | **Motion in Progress (Past)** — `joan`/`etorri`/`ibili`'s native imperfective past forms (`nindoan`, `zetorren`) | "I was on my way (when...)." / "He was coming (and then...)." | §6 | pending — ✅ already in §6's tables; framed explicitly as imperfective/progressive, contrasted with Units 9/13's `joan nintzen`/`ibili nintzen` |

This phase is now narrower than before this redesign: completed simple past
("I went", "I saw", "I ate", "I had") moved to Units 8/9/12/13, so Phase III's
two units cover only the genuinely *new* aspectual forms — habitual/ongoing
past, not "first past exposure."

---

### Phase IV — Interpersonal & Relationship Dynamics

#### Stage 8: The Dative Shift ("To Me / For Me")

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 22 | **Pleasures, Opinions, and Physical Feelings** — present NOR-NORI, 3rd-person subjects (`zait`/`zaizu`/`zaio`) | "I like it." / "It seems good to me." / "I forgot (it slipped my mind)." | §4 (gustatu, iruditu) | pending — `gustatu`/`iruditu` ✅ documented; **`ahaztu` is not yet in `CONJUGATIONS.md`** — same family of forms (`zait`-paradigm) but needs its own pass |
| 23 | **Communication & Giving** — present NOR-NORI-NORK (`esan`, `eman`) | "I give it to you" (`ematen dizut`) / "You tell it to him" (`esaten diozu`) | §5, §8 | pending — ✅ documented |

### 🛡️ Refresh Gate C — The Multi-Argument Audit

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 24 | **REFRESH — The Case-Ending Mixer** | zero new verbs | Isolates and drills the NOR/NORK/NORI distinction specifically — sentences that swap which argument is absolutive vs. ergative vs. dative, to head off the classic "mixed up the `-k`" error this stage's grammar invites. |

---

### Phase V — Nuance, Modality, & Social Context

#### Stage 9: Hypotheticals and Potentials

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 25 | **Permissions & Capability (Ahalera)** — `dezaket`/`naiteke` contrasted with periphrastic `ahal izan` | "I can come." / "I could (have) ..." | §2, §3, VERB_COVERAGE §5 (`ahal`/`ezin`) | pending |
| 26 | **Conditionals (Baldintza & Ondorioa)** — `ba-` protasis + `-ke` apodosis | "If I had money, I would buy that" (`Dirua banu, hori erosiko nuke`) | §2, §3 | pending |

#### Stage 10: Social Registers & Complete Native Integration

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 27 | **Command & Subjunctives (Agintera, Subjuntiboa)** | direct commands; "so that..." purpose clauses | §9, §16 | pending |
| 28 | **The Intimate Social Register (`hi` + Hitanoa/Hiketa)** | `hi` introduced **for the first time**, immediately paired with toka/noka allocutive marking — taught as one register, not two separate facts | §10 | pending |
| 29 | **Passive Transformation & Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | recognition-oriented: reading real sentences | §14, §15 | pending |

---

### Phase VI — Making Things Happen (Causatives)

Persons in scope: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`** grid (Person-
Expansion Rule), plus `hi` (available since Unit 28).

This phase sits last because it isn't "one more verb" — it's a *morphological
operation* (`-arazi`/`-erazi`, VERB_COVERAGE §6) that recombines everything
taught so far: it turns a `nor` verb into `nor-nork` (Units 1-11's territory)
or a `nor-nork` verb into `nor-nori-nork` (Unit 23's), and the result still
inflects for future (Units 14-17), conditional (Unit 26), and imperative (Unit
27) exactly like any other periphrastic verb — the auxiliary at the end
carries tense/mood (`type: 'periphrastic'`, `CLAUDE.md`). Placing it last
means a learner already has every piece this phase recombines, and it needs no
new `VERBS` shape (VERB_COVERAGE §6) — just new vocabulary in the existing
`periphrastic` pattern.

#### Stage 11: The Causative Suffix (-arazi/-erazi)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 30 | **Making Someone Do It** — `-arazi` on intransitive verbs (`nor` → `nor-nork`) | "The storm made the climbers turn back." (`itzularazi zituen`) / "The music made the kids dance." (`dantzarazi ditu`) | VERB_COVERAGE §6 | pending |
| 31 | **Making Someone Do Something To Someone** — `-arazi` on transitive verbs (`nor-nork` → `nor-nori-nork`) | "Grandma made the kids eat the beans." (`janarazi dizkie`) / "The teacher made the students write it." (`idatzarazi die`) | VERB_COVERAGE §6 | pending |

#### 🛡️ Refresh Gate D — The Causative Recombination

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 32 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs | Recombines Units 30-31's `-arazi` forms with future (Units 14-17), conditional (Unit 26), and imperative (Unit 27) — "makes/made/will make/would make/make (someone do X)" — same cross-paradigm-sorting character as the other Refresh Gates. |

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
after Phase IV (Stage 8/Refresh Gate C) makes NOR/NORK/NORI confusion a live
issue worth detecting.
