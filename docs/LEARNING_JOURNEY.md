# Aditzak — Learning Journey (acquisition order)

**Status: current/authoritative.** Mirrors what's actually implemented in `journey.js`/`LESSONS`. For the still-pending redesign, see `LEARNING_JOURNEY_PROPOSED.md` (spec) and `LEARNING_JOURNEY_EVALUATION.md` (why).

> **47-unit core layout** (renumbered 2026-06-14/15, issues #137/#149/#151;
> present perfect inserted as Unit 11 on 2026-06-19; "Carrying & Bringing"
> repositioned from the Phase VII bonus tail to Unit 15 on 2026-06-19, #296;
> a new "non-3rd-person object" unit inserted as Unit 15 — pushing "Carrying
> & Bringing" and everything after it up by one more, to Unit 16 onward — on
> 2026-06-21, #350; a new "non-3rd-person NOR" unit inserted as Unit 28
> (after Unit 27's NOR-NORI past/future, before Stage 9's ditransitive jump)
> — pushing everything from Unit 29 onward up by one more — on 2026-06-21,
> #359; see `docs/DECISIONS.md` for all four). Unit numbers 1–10
> still match `docs/LEARNING_JOURNEY_PROPOSED.md`'s "N-n" scheme; **from Unit
> 12 through 14 the live number is that spec's N-n + 1** (the
> present-perfect offset); **Unit 15 has no PROPOSED-spec equivalent** (it's
> wholly new, added by #350); **from Unit 16 through 27 it's N-n + 3** (the
> #296 offset plus #350's later insertion); **Unit 28 has no PROPOSED-spec
> equivalent either** (wholly new, added by #359); **and from Unit 29 onward
> it's N-n + 4**. See the present-perfect, #296, #350, and #359 placement
> entries in `docs/DECISIONS.md` for the reasoning behind each insertion. The PROPOSED spec
> remains the self-contained reference for the full design (Pronoun-Fading
> Matrix, morphophonological pacing, production/recognition scoping, the
> Distractor Engine Matrix, and the architectural data resolutions for the
> still-pending units); `docs/LEARNING_JOURNEY_EVALUATION.md` records *why* —
> the findings that motivated this layout and the old (O-n) → new (N-n)
> mapping.
>
> Implemented: Units 1–24 (Unit 8 included) — see `journey.js`'s
> `available` units and `LESSONS` in `src/data/lessons.js` for the
> up-to-date picture of which later units are also implemented. Units are
> ordered by communicative goal rather than grammatical category, and
> prioritize usefulness over implementation-ease where the two trade off.

## Core pedagogical realignment

1. **The "Me, You, and It" horizon.** Real conversation runs overwhelmingly on
   `ni`/`zu`/`hura` (1sg, 2sg-neutral, 3sg). Every verb's *first* lesson is
   restricted to these three forms; `gu`/`zuek`/`haiek` are unlocked across
   Units 7–8 (the Expansion units) once enough verbs exist to make the
   expansion feel like "more of what you know" rather than "six new words."
2. **`zu` is the default "you," from lesson one.** `zu` is foundational from
   the start, and `hi` is **deferred** to Phase V's Stage 12 (Units 38–41),
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
   Units 10, 23, 33, 45) introduce **zero new verbs** — pure consolidation,
   negation drills, person-grid expansion, or cross-paradigm "which suffix
   goes where" sorting. Units 23, 33, and 45 are **score-gated**: the next unit
   unlocks only once `bestStars >= 2` (≥80%) on the gate, per
   `LEARNING_JOURNEY_PROPOSED.md`'s scope.
5. **Expansion is two units, not one.** Units 7–8 complete the `gu`/`zuek`/
   `haiek` columns for every verb introduced so far (`izan`, `egon`, `ukan`,
   `joan`, `etorri`, `ikusi`), split by paradigm: Unit 7 covers the
   **absolutive** plural (`gara`/`goaz` — marked on the stem: `izan`, `egon`,
   `joan`, `etorri`), Unit 8 the **ergative** plural (`dugu`/`dute` — a suffix
   on the fixed `du-` stem: `ukan`, `ikusi`). Splitting them prevents
   `†dugara`-type blending (`LEARNING_JOURNEY_EVALUATION.md` finding F4).
   **Current status**: both units are implemented — Unit 7 keeps its
   original `unit-6-review-1` `izan`+`ukan` pairing (a small absolutive/
   ergative mix left as-is, see `docs/DECISIONS.md`), while `ikusi`'s plural
   lessons and a dedicated `ukan-present-plural` practice lesson live under
   Unit 8. From Unit 12
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
   - **Units 2–4** — the ergative leap, given a three-unit on-ramp instead of
     one crowded unit (`LEARNING_JOURNEY_EVALUATION.md` findings F6/F7): Unit 2
     introduces `ukan` (first `nor-nork`/ergative subject) **alone**, with
     extra practice isolating the `ni` → `nik` shift; Unit 3 is a dedicated,
     zero-new-verb "Ni vs. Nik" case-marking checkpoint drilling bare
     (`izan`/`egon`) vs. ergative (`ukan`) subjects; Unit 4 then reinforces the
     same suffixes on `jakin`, a fully synthetic verb, alongside `nahi`
   - **Unit 26** — first NOR-NORI / dative-subject forms (`zait`/`zaizu`/`zaio`),
     four extra lessons ending with a case-frame buffer before Unit 29
   - **Unit 29** — first NOR-NORI-NORK / ditransitive — the steepest jump in
     the whole sequence, gets **four** extra practice lessons, axis-scaffolded
   - **Unit 36** — imperative (a new register), with the distractor-floor fix
   - **Unit 37** — subjunctive as a construction (a new register)
   - **Units 38–41** — `hi` + hitanoa, staged across four units (one extra
     lesson each) instead of crammed into one
   - **Unit 43** — first valency-*increasing* derivation (`-arazi` turning
     `nor` into `nor-nork`) — a new morphological operation, not just new
     vocabulary in a known pattern
   - **Unit 44** — extends `-arazi` to `nor-nori-nork` — same "steepest jump"
     character as Unit 29, gets extra practice lessons like it did

   The "Looking Back I/II" units (12-14, 17-19) are deliberately **not** on
   this list — they pair an already-taught verb's *simple past* with its
   present, the same `nor`/`nor-nork` shape the learner already drilled in
   Units 1-2/6/14/17, so nothing here is a "new relation" in this section's
   sense.

   These extra lessons compound with the engine's per-lesson ramp (a lesson's
   first `BARE_FORM_ATTEMPTS` attempts stay multiple-choice/recognition-only,
   and a one-time conjugation-table preview is shown before a lesson's first
   attempt — see `App.jsx`'s `LessonPreviewScreen`), so a hard unit gets both
   *more lessons* and *more gentle reps within each lesson* than an easy one —
   without changing the linear `getUnlockedLessonIds` unlock model or the
   stored-progress shape.
7. **Pattern-first: a verb earns its own lesson only when it adds something
   specific** (#309). The learning target is a `(agreement-pattern × tense)`
   conjugation goal (`dut`/`duzu`/`du`, `naiz`/`zara`/`da`, …), not any one
   verb — once a learner knows a pattern, every verb that rides it is
   interchangeable. A verb gets a **dedicated** lesson only when it adds:
   1. **Irregular synthetic morphology** — each synthetic verb is its own
      paradigm (`egon: nago/zaude/dago` ≠ `joan: noa/zoaz/doa`), not derivable
      from a shared suffix (`izan`, `ukan`, `egon`, `eduki`, `joan`, `etorri`,
      `ibili`, `jakin`, `eraman`, `ekarri`, …).
   2. **A distinct agreement frame** — dative-governing verbs, NOR-NORI psych
      verbs (`gustatu`/`iruditu`/`ahaztu`), NOR-NORI-NORK ditransitives
      (`esan`/`eman`).
   3. **A special construction** — `egin` light verbs, modal particles
      (`nahi`/`behar`/`ari`/`ahal`), causatives (`-arazi`), allocutive
      register (toka/noka), the imperative/subjunctive as constructions.
   4. **A specific known error to drill** — e.g. the optionally-ditransitive
      `dut`-vs-`diot` confusion (#293).

   **Carve-out — pattern *introducers* may be single-verb.** A pattern's
   *first* appearance can be taught with one clean carrier verb even when
   that verb is otherwise regular; only *subsequent* exposure to the same
   pattern is pooled. `ikusi-present` (Unit 5) is the running example — it
   introduces the periphrastic `-tzen dut` pattern (so the synthetic/
   periphrastic contrast shows up early), not a redundant solo drill of an
   already-known pattern.

   Everything else — regular periphrastic (`-tu`/`-i`/`-n` riding `dut`) and
   regular `nor` (riding `naiz`) verbs that don't meet one of the four tests
   above — is **interchangeable pool fodder**: it belongs *inside* an
   existing pattern-drill pool (e.g. `unit-10-present`'s `sources` array) as
   vocabulary variety, never as its own lesson id. See `docs/DECISIONS.md`'s
   2026-06-20 `#309` entry for the audit confirming the current `LESSONS`
   conforms to this rule, and its pool-size caveat for future fodder
   additions (#304); the `#333` entry re-confirms this against the final
   19-verb dedicated-lesson set after #331's fodder collapse, including
   `ari`'s placement in bucket 3 alongside `nahi`/`behar`.

## Data & architecture implications (read before building)

These are the things this journey *requires* that don't exist yet — flagged
here so they're decided once, deliberately, rather than discovered mid-build.
The architectural resolutions for `ahaztu`, the `esan`/`eman` ditransitive
slices, and `-arazi` are spelled out in full in
`LEARNING_JOURNEY_PROPOSED.md`'s "Architectural data resolutions" section.

- **`egon`/`joan`/`etorri`/`ibili` (§6) already have `zu` rows** — §6's data
  was written with 7 persons (`ni`/`hi`/`hura`/`gu`/`zu`/`zuek`/`haiek`) from
  the start, so this journey just stops asking for `hi`'s row until Unit 38.
- **§6's "Past" column for `joan`/`etorri`/`ibili` is imperfective
  ("I was going" — `nindoan`, `zetorren`), not simple past ("I went" —
  periphrastic `joan nintzen`).** Those forms express ongoing/habitual past
  motion, the opposite of "completed."
  **Resolved**: simple/completed past for `joan`/`etorri`/`ibili`
  (`joan nintzen`, `etorri nintzen`, `ibili nintzen`) was implemented in Units 12 and 18 ("Looking Back I/II") via the periphrastic Lehenaldi Mugatua
  pattern (§11: perfective participle + `izan`'s past auxiliary, §1) — see
  `docs/LANGUAGE_DECISIONS.md`. Unit 25 ("Motion in Progress (Past)") has now
  implemented §6's distinct imperfective forms (`nindoan`/`zetorren`/
  `nenbilen`).
- **Restricting a lesson to `ni`/`zu`/`hura`** isn't something the current
  `generateQuestions`/`conjugations` shape distinguishes by default.
  **Resolved** via a `persons` filter on lessons, applied retroactively where
  needed — see `docs/EXERCISE_ENGINE.md`'s "Phase I's 3-person horizon" and
  `docs/DECISIONS.md`'s 2026-06-12 entries. The app-wide rule is: never drill
  more than 3 grammatical persons in a single exercise.
- **Negation (`ez`) drills (Unit 10)** needed a sentence pattern this app
  didn't have: Basque negation moves the auxiliary in front of the
  participle/predicate (`Mutila etorri da` → `Mutila ez da etorri`), so it's
  not just "swap in a different conjugated form" — the *word order* changes.
  **Resolved**: implemented as a `negativeSentences` table (mirroring
  `pronounSentences`'s shape) plus `negative`/`type-negative` question kinds —
  see `docs/DECISIONS.md`'s "Implemented Unit 5" entry (predates this
  redesign's renumbering; that unit is now Unit 10). **Refresh Gate C (Unit 33)** drills the same "candidate full sentences, pick the right/wrong one"
  shape for NOR/NORI/NORK role-swaps instead of negation, and is expected to
  reuse this same question-kind machinery with a role-swapped sentence-pair
  source.
- **`kind: 'word-order'` (#185-#188)** debuts in **both** Phase I and Unit 10,
  not one or the other: `generateQuestions` adds it to any lesson's roll pool
  the moment a person's filled sentence (or, under `includeNegation`, negated
  sentence) clears the 4-token floor — no per-unit opt-in, no new `LESSONS`
  entries. In Unit 10 it **supplements** rather than replaces
  `negative`/`type-negative` (the roll pool becomes `[negative,
  type-negative, word-order]` once eligible), since auxiliary-fronting is
  exactly the word-order change this kind is best at drilling. See
  `docs/EXERCISE_ENGINE.md`'s "Word-order question contract" and
  `docs/DECISIONS.md`.
- **Score-gating (Units 23, 33, 45)** needs `getUnlockedLessonIds` to check
  `bestStars >= 2` on the gate's review lesson before unlocking the next unit,
  with the gate itself remaining replayable on a sub-threshold attempt (no
  hard lockout) — see `LEARNING_JOURNEY_PROPOSED.md`'s "Score-gating
  predicate" and issue #138.
- **Causative (`-arazi`/`-erazi`, Phase VI, Units 43-44) needs no new data
  shape** — per VERB_COVERAGE §6, a causativized verb is just another
  `type: 'periphrastic'` entry (`[radical]+(a/e)razi` participle + `izan`/
  `ukan` auxiliary), so its `conjugations`/`sentences`/`pronounSentences`
  tables follow the Tier 1 pattern in `EXERCISE_ENGINE.md`. The only new work
  is content: picking representative verbs and writing their causativized
  forms — `docs/SAMPLE_SENTENCES.md`'s causative bank is the starting
  material. The `-arazi`/`-erazi` conditioning rule is specified in
  `LEARNING_JOURNEY_PROPOSED.md`.
- **`jakin`'s past tense (`CONJUGATIONS.md` §7) had gaps** (`hik`/`zuk`/`zuek`
  were `—`), which is why `jakin` had been left out of Unit 14 ("Looking Back
  I — The 'ukan' Past Pool") despite riding `ukan`'s suffix family there too.
  #245 sourced the missing rows (`hekien`/`zenekien`/`zenekiten`) and added
  `jakin` to Unit 14's past pool — see `docs/LANGUAGE_DECISIONS.md`.
- **Unit 9's `ari` examples cover three imperfective participles** (`jaten`,
  `egiten`, `irakurtzen`/`ikasten`) rather than resting on `jaten` alone — see
  `docs/LANGUAGE_DECISIONS.md` (#244). `jaten` (`jan`'s participle, Unit 14's
  verb) remains the anchor example, since Unit 14 teaches `jan`'s full table
  anyway, so introducing its participle here costs nothing extra later and
  gives Unit 14 a head start.

## The journey

### Phase I — Survival Present (Me, You, & It)

Persons in scope throughout Phase I: **`ni` / `zu` / `hura`** only (plurals
arrive at Units 7–8). Pronoun stage: **A (explicit)**.

#### Stage 1: Being, Having & the Ergative Leap

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 1 | **izan & egon** — Who and Where, present | "I am a student." / "Where are you?" / "He is at home." | ni/zu/hura: `naiz`/`zara`/`da`, `nago`/`zaude`/`dago` | §1 (izan), §6 (egon) | ✅ implemented |
| 2 | **ukan — The Ergative Leap** — present (object fixed `hura`), taught alone | "I have a car." (`Nik auto bat dut.`) / "Do you have coffee?" (`Kafea duzu?`) / "He has a house." (`Hark etxe bat du.`) | ni/zu/hura: `dut`/`duzu`/`du` | §3 (ukan) | ✅ implemented — extra practice isolating the absolutive→ergative `ni`→`nik` shift (`LEARNING_JOURNEY_EVALUATION.md` finding F6) |
| 3 | **"Ni" vs. "Nik" — The Case-Marking Checkpoint** — zero new verbs | `Ni ikaslea naiz` vs. `Nik liburua dut.` / `Zu etxean zaude` vs. `Zuk kafea duzu.` | ni/zu/hura: contrasts bare (`izan`/`egon`) vs. ergative (`ukan`) subjects | §1/§3/§6 | ✅ implemented — drills ergative `-k` drift, the most common beginner error, at its source (finding F7); the "spot the drift" framing reuses today's case-mixer/verb-choice primitives, see `docs/DECISIONS.md` |
| 4 | **jakin & nahi** — Knowing & Wanting, `jakin` (synthetic, same ergative suffixes as `ukan`) | "I don't know." (`Ez dakit.`) / "Do you want to come?" (`Etorri nahi duzu?`) | ni/zu/hura: `dakit`/`dakizu`/`daki`, `nahi dut`/`nahi duzu`/`nahi du` | §7 (jakin), VERB_COVERAGE §5 (`nahi`) | ✅ implemented |

#### Stage 2: Seeing & Moving

| Unit | Focus | Payload | Persons | Ref | Data status |
|---|---|---|---|---|---|
| 5 | **ikusi — First Periphrastic Verb (-tzen dut)** — present (ni/zu/hura), Phase I's first periphrastic verb | "I see the mountain." / "Do you see it?" / "She sees the film." | ni/zu/hura: `ikusten dut`/`ikusten duzu`/`ikusten du` | §7 (ikusi) | ✅ implemented — reuses `ikusi`'s existing 6-person `present` table via `persons: PHASE_1_PERSONS` |
| 6 | **joan/etorri/ibili — The NOR Present** | "I'm going to the beach." / "She's coming tomorrow." / "She wanders around town." | ni/zu/hura: `noa`/`zoaz`/`doa`, `nator`/`zatoz`/`dator`, `nabil`/`zabiltza`/`dabil` | §6 | ✅ implemented — `ibili`'s present moved here from Unit 17 (#143) so it precedes its past (Unit 12's `izan`-past pool); its plural forms still arrive in Unit 17 |
| 7 | 🛡️ **Expansion: Absolutive Plurals** | "We are teachers." (`Irakasleak gara.`) / "You all are at home." (`Etxean zaudete.`) / "We're going to the beach." (`Hondartzara goaz.`) | gu/zuek/haiek (`nor`): `izan`, `egon`, `joan`, `etorri` | §1/§6 | ✅ implemented — `unit-6-review-1` keeps its original `izan`+`ukan` pairing, a small absolutive/ergative mix left as-is |
| 8 | 🛡️ **Expansion: Ergative Plurals** | "We have a car." (`Auto bat dugu.`) / "They watch the film." (`Filma ikusten dute.`) | gu/zuek/haiek (`nor-nork`): `ukan`, `ikusi` | §3/§7 | ✅ implemented — `ukan-present-plural` (new dedicated practice) plus `ikusi-present-plural*` (moved from Unit 7) and a `unit-8-ergative-review` |
| 9 | **ari + izan — The Immediate Continuous** | "What are you doing?" (`Zer egiten ari zara?`) / "I'm eating." (`Jaten ari naiz`) / "I'm studying." (`Ikasten ari naiz`) | reuses Unit 1's `izan` present table under `ari` | VERB_COVERAGE §5 | ✅ implemented — `jaten`/`egiten`/`ikasten` (#244) cover three imperfective participles rather than `jaten` alone; `jaten` (`jan`'s participle, Unit 13's verb) remains the anchor example |

### 🛡️ Refresh Gate A — The "Ez" Trap

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 10 | **REFRESH — The Inversion Matrix** | zero new verbs; negation only | Drills `ez` + auxiliary-fronting across Units 1–9's verbs (`Mutila etorri da` → `Mutila ez da etorri`). `ikusi` (Unit 5) has no `negativeSentences` — like `nahi`/`ari`, its auxiliary splits from the invariant participle under negation, out of scope for this exclusive-negation lesson. |

---

### Phase II — Transitivity & Everyday Life

Persons in scope from here on: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`**
grid, every verb, from each verb's first lesson. Pronoun stage: **B
(optional)**.

#### Stage 3: Looking Back I

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 11 | **The Present Perfect (Lehenaldiko Burutua) — What Just Happened** — perfective participle + **present** auxiliary (`etorri naiz`, `ikusi dut`), taught on an already-known core (`izan`/`joan`/`etorri` on the `izan` branch, `ikusi` on the `ukan` branch); the recency contrast `gaur ... da` vs. `atzo ... zen` | "I have come / I came today." (`Gaur etorri naiz`) / "I have seen it." (`Ikusi dut`) / "She has gone." (`Joan da`) | §11 (periphrastic tense matrix, *Lehenaldiko Burutua* row) | ✅ implemented — `izan-present-perfect-pool*` (`izan`/`joan`/`etorri`) + `ikusi-present-perfect*` + `unit-11-review`; the `gaur ... da` vs. `atzo ... zen` recency-contrast distractor (#283) is wired into the engine via `getRecencyContrastLure` |
| 12 | **The "izan" Past Pool — Looking Back I** — the `izan` past auxiliary (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`), mixed across `izan`, `joan`, `etorri`, `ibili` | "I was young." / "I went to the beach." / "She came yesterday." / "We wandered around town." | `izan`: §1; `joan`/`etorri`/`ibili`: §11 (periphrastic Lehenaldi Mugatua) + §1 (`izan` past auxiliary) | ✅ implemented |

**Why Unit 11 comes first in this stage.** The present perfect is the journey's
**on-ramp into the past system**, and it's the cheapest tense to add: it's the
*same* perfective participle the "Looking Back" pools use, paired with the
*present* auxiliary the learner already mastered in Units 1–2 — so it introduces
the participle with **zero new auxiliary**. Units 12/14 then swap that known
participle onto the *past* auxiliary (`etorri naiz` → `etorri nintzen`,
`ikusi dut` → `ikusi nuen`), which lets them foreground the **recency
contrast** — `gaur etorri da` ("came today / has come", present perfect) vs.
`atzo etorri zen` ("came yesterday", simple past) — that the `atzo`-only
past-frame data fix had to sidestep (see `docs/LANGUAGE_DECISIONS.md`'s
present-perfect scope note). This follows the journey's standing principle of
**not introducing two novelties at once** (cf. the ergative leap's 3-unit
on-ramp, the Expansion split into Units 7–8). It is deliberately *not* a late
Phase III "aspect" unit: the form is foundational and high-frequency (Gate A's
negation drills, Unit 10, already manipulate it implicitly in `Mutila ez da
etorri`), so it belongs at the front of the past system, not as a refinement.

This unit pools its verbs the way Unit 13 pools `jan`/`edan`/`erosi`/`ikusi`/
`hartu`'s present tense (`docs/DECISIONS.md`): one drill per person, but which
verb's participle supplies a given question varies question-to-question,
instead of marching through one verb's full table at a time —
`izan`/`joan`/`etorri`/`ibili` share *exactly* the same past-auxiliary shape
(see issue #84). `ukan`/`jan`/`edan`/`erosi`/`ikusi` share another past
auxiliary (Unit 14); `egon` and `eduki` each have their own distinct synthetic
past paradigm and fit neither pool — they get their own units in Stage 5
instead.

Pairing each verb group's simple past with its present soon after — rather
than saving *all* past tense for Phase III — is this journey's central idea:
tense variety (present → past → future) now arrives by Unit 14, instead of
after 10+ units of present-only drilling.

#### Stage 4: Daily Actions

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 13 | **The NOR-NORK Present — dut/duzu/du** — the `ukan` present auxiliary (`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`), drilled across a pool of verbs (`jan`, `edan`, `erosi`, `ikusi`, `hartu`) rather than one lesson per verb. **MP**: first `-tzen`/`-ten` minimal pair (`jaten` vs. `hartzen`). Also drills the NOR-number axis (`dut` vs. `ditut`) across `ukan`, `jan`, `edan`, `erosi`, `hartu`, `ikusi`, `eduki` (#286). | "I eat." / "You drink water." / "I buy a book." / "Do you see it?" / "I take the bus." / "I have them." (`ditut`, not `dut`) | §7 (jan/edan/erosi/ikusi); VERB_COVERAGE §4b-bis (`hartu`) | ✅ implemented |
| 14 | **The NOR-NORK Past — nuen/zenuen/zuen** — the `ukan` past auxiliary (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`), mixed across `ukan`, `jan`, `edan`, `erosi`, `ikusi`, `jakin`. Also drills the NOR-number axis in the past (`zenuen` vs. `zenituen`) across `ukan`, `jan`, `edan`, `erosi`, `hartu`, `ikusi`, `eduki` (#286). | "I had a car." / "I ate the apple." / "You drank coffee." / "We bought a house." / "She saw the film." / "I knew the answer." (`Erantzuna nekien`) / "You had them." (`zenituen`, not `zenuen`) | `ukan`: §3; `jan`/`edan`/`erosi`/`ikusi`: §7 (periphrastic, participle + `ukan` past auxiliary); `jakin`: §7 (synthetic, #245) | ✅ implemented |
| 15 | **maite izan — Loving Someone (The Non-3rd-Person Object)** — `ukan`/`maite`/`ikusi`/`jan`/`edan`/`erosi`/`hartu`'s `presentByObject`/`pastByObject` tables (#346/#347/#348/#378/#379), drilling the object (NOR) away from the default `hura` to `ni`/`zu`/`zuek`/`haiek`, with the subject (NORK) fixed at `ni` | "I love you." (`Maite zaitut.`) | VERB_COVERAGE §3 (ukan), §4b-bis (maite) | ✅ implemented — four single-verb practice lessons (`ukan`/`maite` × present/past) plus a pooled review spanning all seven verbs (`generateCrossVerbQuestions` gained `objectAxis` support in #380) — see `docs/DECISIONS.md` (#350, #380, #381) |
| 16 | **eraman/ekarri — More NOR-NORK Synthetics** — `eraman` ("to carry/take") + `ekarri` ("to bring"), plain `nor-nork` synthetic verbs in the already-taught `eduki`/`jakin` shape, present + past | "I carry my dog to the mountain." (`Nik nire txakurra daramat mendira.`) / "A friend brings a small drum from the Donostia Tamborrada." (`Lagunak danbor txiki bat dakar Donostiako Danborradatik.`) | VERB_COVERAGE §4b-bis | ✅ implemented — moved here from the Phase VII bonus tail (formerly Unit 44); see `docs/DECISIONS.md` (#296) |

`ikusi` moved to Unit 5 as Phase I's first periphrastic verb, but rejoins
Unit 13's verb pool here — it already has full present-tense
`sentences`/`pronounSentences`, so it costs nothing extra to include. `hartu`
(new in this unit, #143) stages the first `-tzen`/`-ten` minimal pair against
`jan`'s `jaten` — see `docs/LANGUAGE_DECISIONS.md` for its sourcing. Unit 14
follows Unit 13 immediately so every pooled verb's present (Unit 13) is taught
before its past (this unit) — closing `LEARNING_JOURNEY_EVALUATION.md` finding
F8. Unit 15 (`maite izan`) follows immediately after — same `ukan` NOR-NORK
paradigm just taught, recombined along its other axis (the object rather than
the subject), landing on "Maite zaitut" as its payoff; see `docs/DECISIONS.md`
(#350) for why it's scoped to four single-verb lessons with no pooled review.
Unit 16 (`eraman`/`ekarri`) rounds out the stage with two more everyday
transitive verbs in the same already-known synthetic shape, no new grammar
required — see `docs/DECISIONS.md` (#296) for why it moved here from the
Phase VII bonus tail.

#### Stage 5: Possessions & Looking Back II

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 17 | **eduki — Physical States & Possessions** — full 6-person grid; `ibili` gains `gu`/`zuek`/`haiek` (its present debuted in Unit 6) | "I have the keys in my pocket." / "They are wandering around town." | §7 (eduki), §6 (ibili) | ✅ implemented |
| 18 | **eduki — "I Had It" (Simple Past)** — its own synthetic paradigm (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/`zeukaten`), full 6-person grid | "I had the keys." / "We had time." | §7 | ✅ implemented |
| 19 | **egon — "I Was There" (Simple Past)** — its own synthetic paradigm (`nengoen`/`zeunden`/`zegoen`/`geunden`/`zeundeten`/`zeuden`), full 6-person grid | "I was at home." / "We were at the beach." | §6 | ✅ implemented |

`ibili`'s present moved to Unit 6 (#143), so only its plural forms arrive
here, alongside `eduki`'s full present grid. `eduki` and `egon` are the two
"odd ones out" (issue #84) whose past forms don't pool with anything —
`joan`/`etorri`/`ibili`'s past lives in Unit 12's pool and `jan`/`edan`/
`erosi`/`ikusi`'s in Unit 14's. Unit 18 keeps `eduki`'s present (Unit 17) and
past (this unit) adjacent, mirroring Units 13/14's present/past adjacency,
with `egon`'s own past following in Unit 19.

#### Stage 6: The Future (*Geroa*)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 20 | **izan/ukan/joan — The Future Rule** — forming the future with `-ko`/`-go` + present auxiliaries, taught on a three-verb core spanning both auxiliary patterns (`nor`/`naiz` and `nor-nork`/`dut`). **MP**: first `-ko`/`-go` minimal pair (`izango` vs. `etorriko`). | "I will be a teacher" (`irakasle izango naiz`) / "We will have a car" (`autoa izango dugu`) / "I will go tomorrow" (`bihar joango naiz`) | §11 (periphrastic tense matrix) | ✅ implemented |
| 21 | **The Future, Across Every Verb** — the same `-ko`/`-go` rule applied across all remaining known verbs (`egon`, `etorri`, `ibili`, `jan`, `edan`, `erosi`, `ikusi`, `eduki`, `nahi`, `jakin`), drilled as cross-verb mixer reviews rather than per-verb tables | "You will see it" (`ikusiko duzu`) / "We will buy a house" (`etxe bat erosiko dugu`) / "Will you know?" (`jakingo duzu?`) | §11 | ✅ implemented |
| 22 | **behar — Requirements & Obligations** — `behar` + `ukan`, present and future | "I have to go." (`Joan behar dut`) / "You'll have to come." (`Etorri beharko duzu`) | VERB_COVERAGE §5 (point 2 — the construction's head, not the lexical verb, picks the auxiliary) | available (#148) — reuses `ukan`'s suffixes exactly like Unit 4's `nahi`; form-only (no sentence frames — `behar`'s complement is an infinitive, not an object noun) |

The Basque future is morphologically trivial — one participle rule (`-ko`/`-go`)
layered onto auxiliaries already mastered in Units 1-19 — so Stage 6 teaches
that rule once (Unit 20) and then spreads it across the remaining verbs as
cross-verb *mixer reviews* (Unit 21) rather than re-drilling each verb's table
one at a time. See `docs/DECISIONS.md` (2026-06-14, "Compressed the future
stage").

### 🛡️ Refresh Gate B — The Core Tense Checkpoint

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 23 | **REFRESH — Cumulative Present/Past/Future Mixer** | zero new verbs; **score-gated** (`bestStars >= 2`) | Mixes synthetic + periphrastic, positive + negative (reuses Gate A's negation pattern), and present + past + future — the full tense range Units 1-22 introduced. ✅ implemented — `unit-20-review-1..4` mix `izan`/`ukan`/`joan`/`ikusi` across present/past/future (singular then plural); `unit-20-review-5` extends negation to `eduki`/`ibili` (present) and, for the first time, past tense (`izan`/`ukan`/`jakin`, via `negativeSentences.past`'s auto-extend); `unit-20-review-6` is the gate-checked capstone. |

---

### Phase III — Shifting to the Past (aspect)

Pronoun stage: **C (pro-drop default)**.

#### Stage 7: Aspect in the Past

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 24 | **The Imperfective Past — "I Used To..."** | "I used to come here every day." / "I was working when she called." | imperfective/habitual past (`etortzen nintzen`, "I used to come / I was coming") — distinct from the simple past taught in Units 12/14/18/19 | implemented (`etorri`/`ikusi`'s `habitualPast`) |
| 25 | **joan/etorri/ibili — Motion in Progress (Past)** — native imperfective past forms (`nindoan`, `zetorren`) | "I was on my way (when...)." / "He was coming (and then...)." | §6 | implemented (`joan`/`etorri`/`ibili`'s `imperfectivePast`) — framed explicitly as imperfective/progressive, contrasted with Units 12/18's `joan nintzen`/`ibili nintzen` |

This phase is narrower than the surrounding ones — completed simple past
("I went", "I saw", "I ate", "I had") moved to Units 12/14/18/19, so Phase III's
two units cover only the genuinely *new* aspectual forms — habitual/ongoing
past, not "first past exposure."

---

### Phase IV — Interpersonal & Relationship Dynamics

Pronoun stage: **D (full null-anaphora; dative/ergative droppable)**.

#### Stage 8: The Dative Shift (NOR-NORI)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 26 | **The NOR-NORI Present — zait/zaizu/zaio** — 3rd-person subjects (`zaigu`/`zaizue`/`zaie` too) | "I like it." / "It seems good to me." / "I forgot (it slipped my mind)." | §4 (gustatu, iruditu, ahaztu) | available (#146, #164) — singular-NOR present (#146) plus plural-NOR (`-zki-`) production drills, a number-split review, and a case-frame buffer review (#164) |
| 27 | **NOR-NORI Past & Future — Dative Across Time** — recombining Unit 26's grid with the periphrastic past and `-ko`/`-go` future | "I liked it yesterday." (`Atzo gustatu zitzaidan`) / "I'll forget the keys." (`Giltzak ahaztuko zaizkit`) | §4; §11 | pending — **new unit** (closes `LEARNING_JOURNEY_EVALUATION.md` finding F2) |
| 28 | **The NOR-NORI Object Axis — natzaizu/gatzaizu** — `presentByNor`/`pastByNor` (#358): NOR shifts off the default `hura`/`haiek` to `ni`/`gu`/`zuek`, with NORI fixed at `zu` — direct contrast with Units 26-27's stimulus-is-3rd-person forms | "Do you like me?" (`Gustatzen natzaizu?`) | §4 | available (#358, #359) |

#### Stage 9: Communication & Giving (NOR-NORI-NORK)

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 29 | **The NOR-NORI-NORK Present — diot/diozu/dio** — (`esan`, `eman`), axis-scaffolded, plus plural-object (`-zki-`) fodder, a four-lesson extra-practice sequence, and a pooled present carrier for the ditransitive optionally-dative fodder (`saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu`) | "I give it to him" (`ematen diot`) / "You tell it to him" (`esaten diozu`) / "I tell him lies." (`Gezurrak esaten dizkiot`) | §5, §8 | available (#147, #162, ditransitive-dative pool added by #334) |
| 30 | **NOR-NORI-NORK Past & Future — Telling & Giving Across Time** — reusing the periphrastic past and `-ko`/`-go` future on Unit 29's axis-fixed slices, plus pooled past/future/review carriers for the same ditransitive-dative fodder | "I told him." (`Esan nion`) / "He gave it to me." (`Eman zidan`) / "I'll tell you tomorrow." (`Bihar esango dizut`) | §5; §11 | available (#147, ditransitive-dative pool added by #334) |
| 31 | **The "egin" Construction** — `hitz`/`lan`/`lo`/`ahaleginak egin`, `parte`/`kontuan hartu`, `arreta eman`, `ados egon`, `arriskuan jarri`; invariant noun/particle + conjugated auxiliary, same shape as `nahi`/`behar izan`; placed here, the first point where `egin`/`hartu` (Units 13-14) and `eman` (Units 29-30) are all individually taught | "I speak Basque." (`Euskaraz hitz egiten dut`) | VERB_COVERAGE §7 | available (#306, repositioned by #325, future added by #334) |
| 32 | **Covert-Dative NOR-NORI-NORK — Agentive Verbs** — `lagundu`/`ekin`/`erantzun`/`deitu`/`eragin`/`antzeman` + the dative `egin` compounds (`mesede`/`kalte`/`aurre egin`) + `itxaron`'s dative reading, pooled present/past/future, reusing the `diot`-family paradigm from Units 29-30 — but with no overt direct object signaling NORI, drilling the exact "covert dative" confusion #293 targets | "I help him." (`Laguntzen diot`) | §4, §5; VERB_COVERAGE §2/§4 | available (#307, future added by #334, itxaron-dative carrier added by #334) |

### 🛡️ Refresh Gate C — The Multi-Argument Audit

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 33 | **REFRESH — The Case-Ending Mixer** | zero new verbs; **score-gated**, mandatory pass before Phase V | Isolates and drills the NOR/NORK/NORI distinction — sentences that swap which argument is absolutive vs. ergative vs. dative, heading off the classic "mixed up the `-k`" error — plus a dative past/future recombination drill bridging Units 27/29. |

---

### Phase V — Nuance, Modality, & Social Context

#### Stage 10: Hypotheticals & Potentials

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 34 | **Ahalera — Permissions & Capability** — `dezaket`/`naiteke` contrasted with periphrastic `ahal izan`, plus `ukan`'s NOR-NORK object axis (`zaitzaket`-type forms, #352) across all three Ahalera sub-tenses (present/hypothetical/past) | "I can come." / "I could (have) ..." | NOR/NOR-NORK [P]; dative [R] | §2, §3, VERB_COVERAGE §5 (`ahal`/`ezin`) | available (#148, object axis added by #352) — `izan`/`ukan` potential, form-only; dative [R] paradigms deferred |
| 35 | **Baldintza & Ondorioa — Conditionals** — `ba-` protasis + `-ke` apodosis, plus `ukan`'s NOR-NORK object axis (`bazintut`/`zintuket`-type forms, #353) across Baldintza and Ondorioa present/past | "If I had money, I would buy that" (`Dirua banu, hori erosiko nuke`) | NOR/NOR-NORK [P]; dative [R] | §2, §3 | available (#148, object axis added by #353) — `izan`/`ukan` baldintza + ondorioa-present, form-only; dative [R] paradigms deferred |

#### Stage 11: Directives & Wishes

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 36 | **Agintera — Commands** — the imperative | "Come here!" (`Hadi hona!`) | izan/ukan NOR/NOR-NORK [P]; gustatu/iruditu/ahaztu NOR-NORI object axis (#364) [P]; ditransitive (`iezadazu`) [R] | §16 | available (#171, #364) — izan/ukan + dative object axis; ditransitive/jussive/hortative/egon-etorri-joan deferred |
| 37 | **Purpose & Wishing (Subjuntiboa)** — the subjunctive **as a construction** (matrix verb + subordinate clause) | "I want him to come." (`Nahi dut etor dadin`) / "She told him to come." (`Esan dio etor dadila`) / "...so that he sees it." (`...ikus dezan`) | NOR/NOR-NORK 3rd-person in-construction [P]; dative [R] | §16 | pending |

Two different moods with different difficulty profiles get their own units —
the imperative is concrete, high-utility, and second-person, taught first; the
subjunctive barely exists as a standalone form outside subordinate clauses, so
Unit 37 teaches it as a *syntactic construction*, recognition-first (see
`LEARNING_JOURNEY_EVALUATION.md` finding F3).

#### Stage 12: The Intimate Register (`hi` + Hitanoa)

`hi` enters here for the first time. Four units stage three independent
novelties — new person, addressee-agreement, gender — one at a time (see
`LEARNING_JOURNEY_EVALUATION.md` finding F1).

| Unit | Focus | Payload | Ref | Data status |
|---|---|---|---|---|
| 38 | **hi — Meet "hi"** (no allocutivity) — as a subject in known paradigms, plus `hi`-as-NORK's own gender split | `Hi ikaslea haiz.` / `Hago lasai.` / `Hator hona.` / `Hik badakik?` | §3/§6 | available (#144, #167) |
| 39 | **Toka (masculine allocutive)** — addressee-agreement on 3rd-person statements, one gender | `Lanean dik.` / `Etorri duk.` / `Ez nauk ondo.` | §10 | available (#167) |
| 40 | **Noka (feminine allocutive)** — taught as the `-k`→`-n` transform of Unit 39 | `Lanean din.` / `Etorri dun.` / `Ez naun ondo.` | §10 | available (#167) |
| 41 | **Hitanoa Recombined** — mixed toka/noka + *when not to use it* (subordinate clauses, formal `-ke-` moods) | choose register by addressee gender | §10, `LANGUAGE_DECISIONS.md` 2026-06-11 | pending |

#### Stage 13: Reading Real Text

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 42 | **The Passive nor-shift — Reading Real Text** — non-finite forms, nor-shift (`ireki dut` → `ireki da`) | comprehension over real sentences | [R] throughout | §14/§15 | available (#145, #170) — `kind: 'reading'`, §15 nor-shift + §14 non-finite forms |

---

### Phase VI — Making Things Happen (Causatives)

Persons in scope: full **`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`** grid plus `hi`
(available since Unit 38). The causative is a *morphological operation*
(`-arazi`) that recombines everything prior; placed last so every piece it
recombines already exists.

#### Stage 14: The Causative Suffix (`-arazi`)

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 43 | **Making Someone Do It** — `-arazi` on intransitives (`nor`→`nor-nork`) | "The storm made the climbers turn back." (`itzularazi zituen`) / "The music made the kids dance." (`dantzarazi ditu`) | present/past/future [P] | VERB_COVERAGE §6 | pending |
| 44 | **Making Someone Do Something to Someone** — `-arazi` on transitives (`nor-nork`→`nor-nori-nork`) | "Grandma made the kids eat the beans." (`janarazi zizkien`) / "The teacher made the students write it." (`idatzarazi die`) | present/past/future [P] | VERB_COVERAGE §6 | pending |

#### 🛡️ Refresh Gate D — The Causative Recombination

| Unit | Focus | Constraint | Notes |
|---|---|---|---|
| 45 | **REFRESH — Causatives Across Tenses & Moods** | zero new verbs; **score-gated** | Recombines Units 43-44's `-arazi` forms with future (Units 20-21), conditional (Unit 35), and imperative (Unit 36) — "makes/made/will make/would make/make (someone do X)". |

### Phase VII — Bonus: Curiosities & Color

Optional flavor content layered on top of the already-complete core curriculum (Units 1-44) — neither unit unlocks new agreement coverage that isn't already taught elsewhere; see `docs/DECISIONS.md` for why each was scoped this way.

#### Stage 15: Verbs That Don't Need an Auxiliary

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 46 | **Synthetic Curiosities** — `jario` (`nor-nori`, "dario"/"zerion"), `etzan` (`nor`, "datza"), `irudi` (`nor-nork`, "dirudi"); recognition-only | "Tears flow from him." (`Malkoak dario`) / "What does the exercise consist of?" (`Zertan datza ariketa?`) / "You look tired." (`Nekatuta zaude, dirudizu`) | VERB_COVERAGE §4a; CONJUGATIONS §8 | pending |

#### Stage 16: Talking About Weather

| Unit | Focus | Payload | Coverage | Ref | Data status |
|---|---|---|---|---|---|
| 47 | **Talking About Weather** — `ari` + `ukan` ("euria ari du"), `izan`/`egon` weather idioms; fixed 3rd person only, zero new conjugation tables | "It's raining." (`Euria ari du`) / "It's cold." (`Hotz da`) / "It's sunny." (`Eguzkia dago`) | reuses existing `ari`/`izan`/`egon` entries | pending |

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
