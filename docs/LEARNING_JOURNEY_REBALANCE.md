# Aditzak — Learning Journey Rebalance (proposal)

**Status: partially implemented (2026-06-27).** Two increments have landed:
- **Increment 1 — deflation.** The object/subject-axis and ditransitive
  permutations that bloated Units 15/32/33/34 (26/51/46/32 lessons) were
  relocated to a new opt-in **Bonus — Mastery & Depth** phase (`bonus: true`
  units 48–51), deflating those units to 6/13/8/8, with a `bonusLessonIds`
  engine change so they never gate the spine.
- **Increment 2 — `gustatu` promotion.** "I like it" (NOR-NORI present) moved
  from Unit 25 to **Unit 14** (right after the NOR-NORK present), with the
  spine renumbered to stay a contiguous 1–47 and the i18n keys rotated to
  match. The NOR-NORI past/future stays later (Unit 26).

Still to do: the full competence-milestone (A1→B2) renumber/relabel of the
whole journey (§4, §7) — the larger structural + i18n pass.

Proposes a full reorganization of
the curriculum roadmap (`src/journey.js`'s `JOURNEY` + `src/data/lessons.js`'s
`LESSONS`). It changes **grouping, ordering, sizing, and what is mandatory** —
it does *not* delete any conjugation data (`src/data/verbs.js`); every
conjugation that exists keeps a home, but much of it moves to an **optional
track** that never gates progress.

It supersedes the *layout* of `LEARNING_JOURNEY.md` once accepted. The
pedagogical principles of `LEARNING_JOURNEY_PROPOSED.md` /
`LEARNING_JOURNEY_EVALUATION.md` (the "Me/You/It" horizon, the ergative
on-ramp, production-vs-recognition scoping, the Refresh Gates) are **kept**.

---

## 1. The problem — quantified

The journey grew to 47 units while filling in complete synthetic/auxiliary
conjugation coverage. Counting `lessonIds` per available unit:

| Unit | Title | Lessons |
|---|---|---:|
| 32 | Ahalera — Permissions & Capability | **51** |
| 33 | Baldintza & Ondorioa — Conditionals | **46** |
| 34 | Agintera — Commands | **32** |
| 15 | maite izan — The Non-3rd-Person Object | **26** |
| …most others | | 2–6 |

Four units hold ~half the journey; ~30 others hold 2–6. But size imbalance is
the *symptom*. The deeper problem, read from a **learner's** chair, is two-fold:

**(a) Encyclopedic completeness is on the mandatory path.** The journey drills
every `(object/subject-axis value × tense × mood)` permutation — every NORK
value of `ukan` in the conditional, every NORI value of `gustatu` in the
imperative, the synthetic curiosities (`jario`/`etzan`/`irudi`), the full
allocutive register (toka/noka). A learner does not need to *recognize* "it
could have surprised us (conditional)" to hold a conversation. This is a
reference grammar, not a course.

**(b) The acquisition order buries the most useful forms.** The single most
useful pattern in everyday Basque — `gustatzen zait` ("I like it") — is
**Unit 25 of 47**. Past tense starts at Unit 11. A learner can't say "I like
coffee" or "I went home" until they're most of the way through. Frequency and
acquisition order are badly misaligned.

## 2. Root cause of the size bloat

The object/subject axis (when an argument isn't the default 3rd-person `hura`:
`maite zaitut` "I love you", `gustatzen natzaizu` "do you like me") is drilled
**combinatorially inside every tense and every mood** — each
`(axis-value × mood)` slice is its own lesson plus a per-value review. Unit 32
alone carries `ukan`'s object axis across 3 potential sub-tenses × 6 NORK
values × (practice + review), plus the dative axis × 6 NORI values, plus the
ditransitive: ~45 permutation lessons bolted onto a 6-lesson idea ("I can / I
can't"). **The axis is the same skill in every mood** — learn "it surprised
me" once and the conditional version just adds the `-ke-` you already know.

## 3. Design principles (aggressive)

1. **Order by frequency / communicative payoff, not by paradigm.** Reorganize
   the journey into **competence milestones** (≈ A1 → B2): each milestone is
   "things you can now say." The fastest route to holding a conversation wins.
2. **Promote the highest-utility forms hard.** `gustatu` ("I like") jumps from
   Unit 25 to the A1 milestone. Past and future come early.
3. **A short mandatory spine.** The *required* path to full communicative
   competence is **~24 tight units (4–8 lessons each)**, not 47. A learner can
   finish the spine and genuinely converse.
4. **Everything encyclopedic becomes an opt-in track that never gates.**
   Allocutive register (hi/toka/noka), the full mood×axis permutation matrix,
   synthetic/unergative curiosities, weather idioms, and the academic-tier verb
   tail all move to **Bonus tracks**. They stay available, fully playable, and
   off the critical path — a learner chooses them, the journey never forces
   them.
5. **Teach each relation once, then reuse.** The object axis and the dative
   "nor" axis each get **one** dedicated indicative unit; moods are taught on
   the **core paradigm only** (NOR `naiz` + NOR-NORK 3rd-person `dut`).
6. **Stop mechanically doubling every tense into singular + plural lessons.**
   `gu`/`zuek`/`haiek` are lower-frequency. Introduce them through the
   Expansion units and through *review* lessons (which can already span 3
   plural persons), rather than authoring a dedicated `-plural` practice lesson
   for every single (verb × tense). This roughly **halves** total lesson count
   without losing the plural grid. (Engine lever — see §7.)
7. **Keep wide pools; cut per-value splits.** A pooled review can draw
   distractors from 37 verbs as a *single* lesson id. The bloat was never the
   pools — it was splitting one idea into a lesson per axis value.

## 4. The rebalanced journey — a milestone spine

`[P]` production, `[R]` recognition. Bold = lesson count. 🛡️ = Refresh Gate.

### 🟢 Milestone A1 — Survive: be, have, go, want
*"I'm a student. I'm at home. I have a car. I'm going. I don't know."*
Persons: `ni`/`zu`/`hura`.

| # | Unit | Introduces | Lessons |
|---|---|---|---:|
| 1 | izan & egon — Who and Where | `izan.present`, `egon.present` | **3** |
| 2 | ukan — The Ergative Leap | `ukan.present` (obj `hura`) | **3** |
| 3 | 🛡️ "Ni" vs "Nik" Checkpoint | sort bare vs ergative subjects | **3** |
| 4 | jakin & nahi — Knowing & Wanting | `jakin.present`, `nahi.present` | **4** |
| 5 | joan/etorri/ibili — Getting Around | NOR present + nor-fodder | **5** |
| 6 | 🛡️ The "Ez" Trap — Negation | negation across A1 | **3** |

### 🟢 Milestone A2 — Do things & react: see, eat, **like**
*"I see the mountain. I eat bread. **I like coffee.** I'm working."*
The big promotion: `gustatu` arrives here, not in the 20s.

| # | Unit | Introduces | Lessons |
|---|---|---|---:|
| 7 | ikusi & the NOR-NORK Present | `present` pool (ikusi/jan/edan/erosi/hartu) — dut/duzu/du | **5** |
| 8 | **gustatu — "I Like It"** (NOR-NORI) | `gustatu`/`iruditu`/`ahaztu` `present`, zait/zaizu/zaio | **6** |
| 9 | ari — "I'm Doing It" (continuous) | `ari.present` | **2** |
| 10 | 🛡️ Expansion: We / You-all / They | gu/zuek/haiek for everything so far (absolutive + ergative) | **5** |
| 11 | 🛡️ Present Checkpoint | cumulative present mixer, ±negation | **4** |

### 🔵 Milestone B1 — Time: past, perfect, future
*"I went home. I have seen it. I will come. I have to go."*

| # | Unit | Introduces | Lessons |
|---|---|---|---:|
| 12 | What Just Happened (Present Perfect) | `presentPerfect` (izan/joan/etorri/ikusi) | **5** |
| 13 | "I Did It" — Simple Past | `past` pools (izan-branch + ukan-branch) | **6** |
| 14 | eduki & egon — States, and Their Past | `eduki.present`, `eduki.past`, `egon.past` | **6** |
| 15 | The Future Rule (`-ko`/`-go`) | `izan`/`ukan` future + pooled fodder | **6** |
| 16 | behar — "I Have To" | `behar` present + future | **3** |
| 17 | 🛡️ Tense Checkpoint (score-gated) | present/past/future mixer | **6** |

### 🔵 Milestone B1 — People as objects
*"I love you. I see you. I give it to him. I tell him."*

| # | Unit | Introduces | Lessons |
|---|---|---|---:|
| 18 | **"Maite zaitut" — I love/see you** | forward object axis (`presentByObject`, obj=ni/zu/zuek/haiek, subj `ni`), carriers ukan/maite/ikusi + 1 wide pooled review | **6** |
| 19 | The Dative Across Time | NOR-NORI `past`/`future` + covert-dative agentive verbs (lagundu/deitu/erantzun…), pooled | **7** |
| 20 | **diot — "I Give/Tell It to Him"** | NOR-NORI-NORK `present` (esan/eman), axis-scaffolded + ditransitive fodder | **7** |
| 21 | Telling & Giving Across Time | NOR-NORI-NORK `past`/`future`, pooled | **6** |
| 22 | 🛡️ Multi-Argument Audit (score-gated) | NOR/NORK/NORI role-swaps | **4** |

### 🟣 Milestone B2 — Nuance: can, would, command, aspect
*"I can come. If I had money… Come here! I used to go."*
Moods taught on the **core paradigm only**.

| # | Unit | Introduces | Lessons |
|---|---|---|---:|
| 23 | Ahalera — "I Can / I Can't" | `potential` + `potentialLehenaldia` (izan/ukan 3rd-person) + `ahal`/`ezin` — **core slice of old Unit 32 (51)** | **7** |
| 24 | Baldintza — "If…, I Would" | `baldintza` + `conditional` + `conditionalPast` (izan/ukan 3rd-person) — **core slice of old Unit 33 (46)** | **7** |
| 25 | Agintera — Commands | `imperative` (izan/ukan + egon/etorri/joan) — **core slice of old Unit 34 (32)** | **6** |
| 26 | Aspect — "I Used To / Was Doing" | `habitualPast` + `imperfectivePast` (motion) | **6** |

**End of the mandatory spine — 26 units.** A learner who finishes here can
discuss the present, past, and future; express likes, obligations, ability,
and hypotheticals; give commands; and handle people-as-objects. That is real,
broad communicative competence.

### ⚪ Bonus Track I — Deeper morphology (opt-in, never gates)
| # | Unit | Introduces |
|---|---|---|
| B1 | Subjuntiboa — Purpose & Wishing `[R]` | `subjunctivePresent`/`Past` as a construction |
| B2 | Causatives `-arazi` (intransitive) | itzularazi/dantzarazi present/past/future |
| B3 | Causatives `-arazi` (transitive) + 🛡️ gate | janarazi/idatzarazi |
| B4 | The Reverse Object Axis in Depth | "it surprised me" — `…ByObject` full matrix `[R]` |
| B5 | Axes in the Moods | every `…ByObject`/`…ByNor` mood slice, pooled `[R]` — **absorbs the ~90 permutation lessons that bloated Units 32–34** |
| B6 | Reading Real Text — the passive nor-shift `[R]` | non-finite, `ireki dut → ireki da` |

### ⚪ Bonus Track II — Register & color (opt-in, never gates)
| # | Unit | Introduces |
|---|---|---|
| C1 | Meet "hi" | hi as subject in known paradigms |
| C2 | Toka (masculine allocutive) | `presentToka`/`pastToka` |
| C3 | Noka (feminine allocutive) | `presentNoka`/`pastNoka` |
| C4 | Hitanoa Recombined | mixed register + suppression rules |
| C5 | Synthetic Curiosities `[R]` | jario, etzan, irudi |
| C6 | Unergative Curiosities | ihardun, iraun |
| C7 | erabili — Using Things | erabili present/past |
| C8 | Talking About Weather | ari+ukan, izan/egon idioms |

## 5. What changed vs the old journey (and why a learner wins)

| Move | From | To | Learner payoff |
|---|---|---|---|
| `gustatu` "I like" | Unit 25/47 | **Unit 8** (A2) | Says "I like coffee" in week one |
| Simple past | Unit 11+ | **Unit 13** (early B1) | Talks about yesterday far sooner |
| Mandatory spine length | 47 units | **26 units** | Reaches competence ~2× faster |
| Ahalera | 51 lessons | **7** (core) + Bonus B5 | A digestible "I can," not a wall |
| Baldintza | 46 | **7** + Bonus B5 | — |
| maite izan | 26 | **6** + Bonus B4 | — |
| hi / toka / noka | mandatory Units 36–39 | **Bonus Track II** | Never forced through regional register |
| jario/etzan/irudi/ihardun | mandatory tail | **Bonus Track II** | Trivia stays optional |
| per-tense `-plural` lessons | every verb×tense | folded into Expansion + reviews | ~½ the grind for the same grid |

## 6. What is *not* lost

No conjugation table is deleted. Every `…ByObject`/`…ByNor`, allocutive,
causative, and synthetic-curiosity form that exists today still has a playable
unit — it just lives in a **Bonus track** the learner opts into, rather than a
mandatory gate. The wide distractor pools (the 37-verb review sources) are
preserved wholesale; only the per-axis-value lesson *splits* collapse into a
handful of pooled reviews.

## 7. Implementation notes (for the follow-up session)

Layout + flag work; data-safe and test-guarded:

1. Reorder/regroup units in `src/journey.js`; re-scope `lessonIds`. Tag Bonus
   tracks so they unlock off the spine (a `bonus: true` flag on units/stages,
   read by `getUnlockedLessonIds` so they don't block the next spine unit).
2. Move `gustatu`'s present lessons up to the A2 milestone; pull the
   `…ByObject`/`…ByNor` mood ids out of old Units 32–34 into Bonus B4/B5.
3. **Engine lever (principle 6):** to drop the mechanical singular/plural
   doubling, either relax "max 3 persons per exercise" for review lessons or
   make `-plural` siblings auto-generated review variants rather than authored
   `LESSONS` entries. This is the one change that touches engine logic, not
   just journey layout — worth its own design pass (see §"App engine logic" in
   `LEARNING_JOURNEY.md`).
4. No `src/data/verbs.js` change and **no `STORAGE_KEY` bump** — progress is
   keyed by lesson id; ids stay stable across the renumber (the #137
   precedent).
5. Run `npm test` — `src/journey.test.js` fails fast on any dangling
   `lessonIds`. Keep `LEARNING_JOURNEY.md`, `journeyTranslations.js`, and
   `GATE_LESSON_IDS` in sync.

## 8. The one judgment call for the maintainer

The aggressive version **demotes carefully-built content** (hitanoa, the
mood×axis matrix, curiosities) from "required" to "optional." That content
isn't wasted — it's still playable — but it stops counting toward "finishing
the course." If the goal is a *reference app* where completion means "every
form drilled," keep more of it mandatory (the conservative rebalance in this
file's git history does that). If the goal is the brief's stated one — "a
learning experience," fastest route to actually speaking — the short spine
above is the answer.
