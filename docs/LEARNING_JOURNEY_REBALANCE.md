# Aditzak — Learning Journey Rebalance (proposal)

**Status: proposal, not yet implemented.** This document proposes a full
reorganization of the curriculum roadmap (`src/journey.js`'s `JOURNEY` +
`src/data/lessons.js`'s `LESSONS`). It does *not* change any conjugation data
(`src/data/verbs.js`) — every conjugation that exists today keeps a home; what
changes is **how units are grouped, ordered, and sized**.

It supersedes the *layout* of `LEARNING_JOURNEY.md` (the current authoritative
state) once accepted. The pedagogical principles of
`LEARNING_JOURNEY_PROPOSED.md` / `LEARNING_JOURNEY_EVALUATION.md` (the
"Me/You/It" horizon, the ergative on-ramp, production-vs-recognition scoping,
the Refresh Gates) are **kept** — this proposal only fixes the size/balance
problems that crept in as the data grew to cover every synthetic and auxiliary
conjugation.

---

## 1. The problem — quantified

The journey grew to 47 units while filling in complete conjugation coverage.
Counting `lessonIds` per available unit today:

| Unit | Title | Lessons |
|---|---|---:|
| 32 | Ahalera — Permissions & Capability | **51** |
| 33 | Baldintza & Ondorioa — Conditionals | **46** |
| 34 | Agintera — Commands | **32** |
| 15 | maite izan — The Non-3rd-Person Object | **26** |
| 27 / 29 | NOR-NORI object axis / NOR-NORI-NORK past | 12 each |
| 16 / 18 / 28 | eraman-ekarri / Future / ditransitive present | 10 each |
| …most others | | **2–6** |

Four units hold **155 lessons** between them — roughly **half the entire
journey** — while ~30 other units hold 2–6 each. The journey has become, in the
words of the brief, "a catalog of conjugations" rather than "a learning
experience." A learner who reaches Unit 32 hits a 51-lesson wall; a learner in
Unit 23 breezes through 2.

## 2. Root cause

The bloat is not spread evenly — it comes from **one structural mistake**: the
*object/subject axis* (who-acts-on-whom when neither argument is the default
3rd-person `hura`) is drilled **combinatorially inside every tense and every
mood**, instead of being taught once as a concept and then reused.

Concretely, the data added these cross-cutting axes:

- **NOR-NORK object axis** (`presentByObject`/`pastByObject`): the object is
  `ni/zu/zuek/haiek` (e.g. `maite zaitut` "I love you", `harritu nau` "it
  surprised me"), and the reverse — subject is `hura/gu/zu/zuek/haiek`.
- **NOR-NORI "nor" axis** (`presentByNor`/`pastByNor`): the subject of a psych
  verb is `ni/gu/zuek` (`gustatzen natzaizu` "do you like me").
- The same two axes **repeated inside each mood**: `potentialByObject`,
  `baldintzaByObject`, `conditionalByObject`, `potentialByNor`,
  `conditionalByNor`, `imperativeByNor`, … (see `verbs.js`'s tense-key census).

Each `(axis-value × tense/mood)` slice became its own practice lesson **plus** a
pooled review per fixed person value. Unit 32 alone carries `ukan`'s object
axis across **three** potential sub-tenses × **six** NORK values × (practice +
review), plus the dative axis × six NORI values, plus the ditransitive — ~45
lessons of permutation on top of a 6-lesson core idea ("I can / I can't").

**The axis is a real skill, but it is the *same* skill in every mood.** Once a
learner can say "it surprised me" (reverse object axis, indicative), the
potential version ("it could surprise me") adds the `-ke-` morphology they
already know from the mood's core lessons — it is not a new relation worth 45
fresh drills inline.

## 3. Design principles for the rebalance

1. **Target 4–8 lessons per unit.** No mandatory unit exceeds ~8. Units that
   are pure checkpoints (gates) or bonus flavor may be smaller (2–3); nothing
   is allowed to be larger.
2. **Teach each relation once, then reuse.** The object axis and the dative
   "nor" axis each get their **own dedicated indicative unit** (Phase III / the
   dative stage). Moods are then taught on the **core paradigm only**
   (NOR `naiz` + NOR-NORK 3rd-person `dut`, plus the mood's key sub-tenses).
3. **Axis × mood permutations move to an optional "Mood Mastery" stage.** All
   the `…ByObject` / `…ByNor` mood slices — which are recognition-only deep
   drills today — collect into one late, clearly-optional phase. This single
   move deflates Units 32/33/34 from 51/46/32 to ~8/8/6.
4. **Order by usefulness, not by paradigm completeness.** High-frequency,
   high-utility forms come first; rare synthetics and weather idioms stay in
   the bonus tail (already true, kept).
5. **Pools stay cheap.** A pooled review can draw distractors from 37 verbs
   while being a *single* lesson id — wide vocabulary coverage does **not** cost
   lessons. The bloat was never the pools; it was the per-axis-value lesson
   *splits*. Keep the wide pools, cut the splits.
6. **Keep the four Refresh Gates** (A negation, B core tense, C multi-argument,
   D causative) and the score-gating model unchanged.

## 4. The rebalanced journey

Renumbered cleanly 1…49. Every unit lists the **conjugations it introduces**
(verb × tense/mood × persons) and a lesson breakdown. `[P]` = production,
`[R]` = recognition-only, as in the existing docs. Lesson counts in **bold**.

### Phase I — Survival Present (`ni`/`zu`/`hura`)
*Unchanged from today — this phase is already well-balanced.*

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 1 | izan & egon — Who and Where | `izan.present`, `egon.present` (ni/zu/hura) | **3** |
| 2 | ukan — The Ergative Leap | `ukan.present`, object fixed `hura` | **3** |
| 3 | 🛡️ "Ni" vs "Nik" — Case-Marking Checkpoint | zero new (sort izan/egon vs ukan subjects) | **3** |
| 4 | jakin & nahi — Knowing & Wanting | `jakin.present`, `nahi.present` | **4** |
| 5 | ikusi — First Periphrastic (`-tzen dut`) | `ikusi.present` | **2** |
| 6 | joan/etorri/ibili — The NOR Present | 3 synthetics + `nor`-fodder pool | **6** |
| 7 | 🛡️ Expansion: Absolutive Plurals | gu/zuek/haiek for izan/egon/joan/etorri | **3** |
| 8 | 🛡️ Expansion: Ergative Plurals | gu/zuek/haiek for ukan/ikusi | **4** |
| 9 | ari — The Immediate Continuous | `ari.present` | **2** |
| 10 | 🛡️ Refresh Gate A — The "Ez" Trap | negation across Units 1–9 | **3** |

### Phase II — Everyday Transitivity & Tense

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 11 | Present Perfect — What Just Happened | `presentPerfect` (izan/joan/etorri/ikusi) | **5** |
| 12 | Simple Past I — The izan Pool | `past` for izan/joan/etorri/ibili + nor-fodder | **4** |
| 13 | NOR-NORK Present — dut/duzu/du | `present` pool (jan/edan/erosi/ikusi/hartu + long tail) + plural-object `ditut` (`presentPlural`) | **4** |
| 14 | NOR-NORK Past — nuen/zenuen/zuen | `past` pool + plural-object `pastPlural` | **4** |
| 15 | eduki — Possessions | `eduki.present` (full grid) + `ibili` plural | **5** |
| 16 | Simple Past II — eduki & egon | `eduki.past`, `egon.past`, `ados-egon` (**merges old Units 18+19**) | **6** |
| 17 | eraman/ekarri — More NOR-NORK Synthetics | present/past (+ plural) — **trimmed from 10** | **6** |
| 18 | The Future Rule — `-ko`/`-go` | `izan`/`ukan` `future` core + pooled fodder + suffix-choice + plural-object — **trimmed from 10** | **6** |
| 19 | behar — Requirements & Obligations | `behar` present + future | **3** |
| 20 | 🛡️ Refresh Gate B — Core Tense Mixer | present/past/future, ±negation, score-gated | **6** |

### Phase III — The Object Axis (who acts on whom)
**Replaces the 26-lesson Unit 15.** The forward and reverse directions become
two balanced units, both placed right after the NOR-NORK past whose paradigm
they extend.

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 21 | "I Love You" — The Forward Object Axis | `presentByObject`/`pastByObject`, object = ni/zu/zuek/haiek, subject `ni`; carriers ukan/maite/ikusi; one wide pooled review | **6** |
| 22 | "It Surprised Me" — The Reverse Object Axis | same tables, subject = hura/gu/zu/zuek/haiek acting on me/us; pooled review per direction (wide verb pool, few lesson ids) | **6** |

### Phase IV — Aspect in the Past

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 23 | The Imperfective Past — "I Used To…" | `habitualPast` (etorri/ikusi) | **5** |
| 24 | Motion in Progress (Past) | `imperfectivePast` (joan/etorri/ibili) | **4** |

### Phase V — Dative & Ditransitive

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 25 | NOR-NORI Present — zait/zaizu/zaio | `present` (gustatu/iruditu/ahaztu) + number split + case-frame buffer — **trimmed from 9** | **6** |
| 26 | NOR-NORI Past & Future | `past`/`future`, pooled mixer | **6** |
| 27 | The NOR-NORI Object Axis — natzaizu | `presentByNor`/`pastByNor`, pooled cross-verb review per NORI value (**consolidated from 12; drop redundant single-verb splits**) | **6** |
| 28 | NOR-NORI-NORK Present — diot/diozu/dio | `present` (esan/eman), axis-scaffolded, + ditransitive fodder pool — **trimmed from 10** | **8** |
| 29 | NOR-NORI-NORK Past & Future | `past`/`future`, axis-fixed slices + fodder pool — **trimmed from 12** | **8** |
| 30 | Covert-Dative Agentive Verbs | lagundu/ekin/erantzun/deitu/eragin/antzeman + dative `egin` compounds, pooled present/past/future | **8** |
| 31 | 🛡️ Refresh Gate C — Multi-Argument Audit | NOR/NORK/NORI role-swaps, score-gated | **4** |

### Phase VI — Modality & Mood (**core paradigm only**)
**The deflation.** Each mood is taught on NOR (`naiz`-pattern) + NOR-NORK
3rd-person (`dut`-pattern) plus the mood's own key sub-tenses. The dative,
ditransitive, and object-axis versions of each mood are *removed from these
units* and collected in Phase VII.

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 32 | Ahalera — Can / Can't | `potential` + `potentialAlegiazkoa` + `potentialLehenaldia` (izan/ukan, 3rd-person) + periphrastic `ahal izan`/`ezin` — **from 51** | **8** |
| 33 | Baldintza & Ondorioa — Conditionals | `baldintza` + `conditional` + `conditionalPast` (izan/ukan, 3rd-person) — **from 46** | **8** |
| 34 | Agintera — Commands | `imperative` (izan/ukan incl. jussive/hortative/plural-object) + egon/etorri/joan — **from 32** | **6** |
| 35 | Subjuntiboa — Purpose & Wishing | `subjunctivePresent`/`subjunctivePast` as a construction, 3rd-person | **6** |

### Phase VII — Mood Mastery (**optional deep dives**)
Holds every `…ByObject` / `…ByNor` / ditransitive mood slice pulled out of
Phase VI. Recognition-pooled, score-gated *off* the main path so a learner can
finish the core curriculum without them. This is where the ~70 permutation
lessons that bloated Units 32–34 live — but as a handful of wide pooled
reviews, not as per-axis-value splits.

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 36 | The Object Axis in the Moods | `potentialByObject`/`baldintzaByObject`/`conditionalByObject`/… (ukan), pooled review per direction `[R]` | **~8** |
| 37 | Dative & Ditransitive in the Moods | `potentialByNor`/`conditionalByNor`/`imperativeByNor`/… (gustatu/iruditu/ahaztu/jarraitu) + esan/eman ditransitive across moods, pooled `[R]` | **~8** |

### Phase VIII — The Intimate Register (`hi` + Hitanoa)

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 38 | Meet "hi" | `hi` as subject in known paradigms + hi-as-NORK gender split | **3** |
| 39 | Toka (Masculine Allocutive) | `presentToka`/`pastToka` (izan/ukan) | **5** |
| 40 | Noka (Feminine Allocutive) | `presentNoka`/`pastNoka` (izan/ukan) | **5** |
| 41 | Hitanoa Recombined | mixed toka/noka + suppression rules | *pending* |

### Phase IX — Causatives (`-arazi`)

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 42 | Making Someone Do It | `-arazi` on intransitives (itzularazi/dantzarazi), present/past/future | **7** |
| 43 | Making Someone Do Something to Someone | `-arazi` on transitives (janarazi/idatzarazi), present/past/future | **7** |
| 44 | 🛡️ Refresh Gate D — Causative Recombination | -arazi across tenses, score-gated | **2** |

### Phase X — Reading & Curiosities (Bonus)

| # | Unit | Conjugations introduced | Lessons |
|---|---|---|---:|
| 45 | The Passive nor-shift — Reading Real Text | non-finite forms, `ireki dut → ireki da` `[R]` | **2** |
| 46 | Synthetic Curiosities | jario (nor-nori), etzan (nor), irudi (unergative) `[R]` | *pending* |
| 47 | Unergative Curiosities | ihardun, iraun (NORK-only) present/past | **5** |
| 48 | erabili — Using Things | `erabili` present/past | **3** |
| 49 | Talking About Weather | ari+ukan, izan/egon idioms, 3rd-person | *pending* |

## 5. Deflation map (the four monster units)

| Old unit | Old | New home(s) | New size |
|---|---:|---|---:|
| 15 maite izan | 26 | **21** Forward axis + **22** Reverse axis | 6 + 6 |
| 32 Ahalera | 51 | **32** Ahalera (core) + **36** Object axis in moods | 8 + (~8 shared) |
| 33 Baldintza | 46 | **33** Baldintza (core) + **37** Dative/ditransitive in moods | 8 + (~8 shared) |
| 34 Agintera | 32 | **34** Agintera (core) + **37** (imperativeByNor slice) | 6 + shared |

No conjugation table is deleted. The object-axis and mood-axis tables that
exist today (`presentByObject`, `potentialByNor`, `imperativeByNor`, …) all
keep a home — either in their dedicated indicative unit (Phase III / 27) or in
the optional Mood Mastery phase (36–37).

## 6. Result

- **Every mandatory unit is 2–8 lessons.** The 51/46/32/26 walls are gone.
- **Total mandatory lessons drop** (the per-axis-value splits in Units 32–34
  collapse into ~16 pooled reviews in Phase VII), without losing any coverage —
  the wide verb pools are preserved as distractor sources.
- **The journey reads as a learning experience**: a learner moves present →
  past → object-axis → aspect → dative → ditransitive → moods, each in a
  digestible unit, with the encyclopedic axis×mood permutations available as
  opt-in mastery content rather than a mandatory wall.

## 7. Implementation notes (for the follow-up session)

This proposal is **layout only**; turning it into code is mechanical and
test-guarded:

1. Reorder/regroup units in `src/journey.js`; re-scope `lessonIds`.
2. Split Unit 15's 26 ids into Units 21/22; pull the `…ByObject`/`…ByNor` mood
   ids out of Units 32–34 into new Phase VII units 36/37.
3. No `src/data/verbs.js` change and **no `STORAGE_KEY` bump** (progress is
   keyed by lesson id; ids can be kept stable across a renumber, per the #137
   precedent in `DECISIONS.md`).
4. Run `npm test` — `src/journey.test.js` cross-checks that every `lessonIds`
   entry resolves to a `LESSONS` id and vice versa, so a dangling reference
   fails fast.
5. Keep `docs/LEARNING_JOURNEY.md`, `journeyTranslations.js`, and the gate
   index (`GATE_LESSON_IDS`) in sync, per `CLAUDE.md`'s "Working on the
   learning journey".
