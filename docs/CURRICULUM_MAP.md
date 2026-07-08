# Aditzak — Curriculum Map (Units, Lessons & New Conjugations)

**Status: reference.** This document exists so it's possible to see, at a glance, everything the app currently teaches (or plans to teach) — every unit, every lesson inside it, which verb/tense combination it drills, **the actual conjugated Basque forms it produces**, and exactly what's new versus what's review — without having to read `journey.js`/`lessons.js`/`verbs.js` directly.

It is a companion to `docs/LEARNING_JOURNEY.md`, which is the *design-rationale* document (why units are ordered/scoped the way they are). This document only answers "what is unit N, and what conjugated forms does lesson X actually teach?"

**How to read a lesson entry:**
- The bullet line names the lesson: verb + tense + persons drilled (practice), or the verb/tense mix it pools (pooled practice / review).
- `Forms:` lists the **actual conjugated Basque words** the lesson drills, one per grammatical person (e.g. `izan-present` → **naiz** (ni), **zara** (zu), **da** (hura)). These are resolved live from `verbs.js`'s `conjugations` tables — including axis-composed tables (`getComposedTable`/`resolveObjectAxisTable`, the same helpers the app itself uses to generate questions) — so they match exactly what a learner sees in the app. A pooled/review lesson lists forms per verb wherever a tag below calls out something new; a fully-covered review lists no forms of its own since nothing in it is new.
- The tag(s) below that say what's *new* about this specific lesson:
  - 🆕 **New grammar pattern** — the first time this conjugation *pattern* (e.g. Potential, or the NOR-NORI object axis) appears anywhere in the curriculum, for any verb.
  - 📗 **New verb** — the first time this verb appears at all, in any tense.
  - ✅ **Taught this tense for the first time** — an already-known verb getting a conjugation table it didn't have before (e.g. `ikusi` already known in the present, now getting its past), with the actual new forms shown.
  - ➕ **Adds persons** — the same verb+tense table the learner already has, gaining grammatical persons it didn't cover yet (e.g. `ni/zu/hura` → `gu/zuek/haiek`), with the actual new forms shown.
  - No tag (_"Review/practice only"_) — the lesson is pure consolidation: every form in it was already introduced by an earlier lesson.
- A pool/review wide enough that listing every verb by name would be unreadable collapses to `verb, verb, verb, +N more (N total)`, showing full forms for the first few as examples.
- 🛡️ = Refresh Gate (zero new verbs, pure consolidation — some are score-gated, see `LEARNING_JOURNEY.md`). ✨ = Bonus (opt-in, never blocks the main spine). ⏳ = not implemented yet.

This is generated from live data (`src/journey.js` + `src/data/lessons.js` + `src/data/verbs.js` + `src/lessonLogic.js`'s table-resolution helpers), walked in the exact order a learner encounters it, so both the conjugated forms and the "new vs. review" verdict are computed the same way the app itself would — not hand-transcribed. If you regenerate it, `src/journey.test.js` (run via `npm test`) is the check that every lesson id here is real and every real lesson id is listed somewhere.

## Curriculum at a glance

- **51 units** across 7 phases (+ 1 bonus phase), **368 lessons** total.
- **48 units implemented** (`available`), **3 still pending** (Units 31, 39, 45 — roadmap cards only, no lessons yet).
- **5 Refresh Gates** (zero-new-verb consolidation checkpoints): Units 7, 10, 23, 31, 43.
- **17 units are `✨ Bonus`** (Units 35–51): optional depth/register/color content that never gates the mandatory spine (Units 1–34).

## New conjugation patterns, in the order they're introduced

| Pattern | First taught in |
|---|---|
| Present | Unit 1 |
| Present perfect | Unit 11 |
| Past | Unit 12 |
| Present (plural) | Unit 13 |
| Present (NORI axis) | Unit 14 |
| Past (plural) | Unit 15 |
| Present (object axis) | Unit 16 |
| Past (object axis) | Unit 16 |
| Future | Unit 21 |
| Future (plural) | Unit 21 |
| Past (habitual) | Unit 24 |
| Past (imperfective, motion) | Unit 25 |
| Past (NORI axis) | Unit 26 |
| Present (NOR axis) | Unit 27 |
| Past (NOR axis) | Unit 27 |
| Potential (Ahalera) | Unit 32 |
| Potential, hypothetical | Unit 32 |
| Potential, past | Unit 32 |
| Conditional-if (Baldintza) | Unit 33 |
| Conditional-would (Ondorioa) | Unit 33 |
| Conditional-would, past | Unit 33 |
| Imperative (Agintera) | Unit 34 |
| Imperative (plural) | Unit 34 |
| Imperative (ditransitive) | Unit 34 |
| Subjunctive (present) | Unit 35 |
| Subjunctive (past) | Unit 35 |
| Present (toka) | Unit 37 |
| Past (toka) | Unit 37 |
| Present (noka) | Unit 38 |
| Past (noka) | Unit 38 |
| Potential (object axis) | Unit 49 |
| Potential, hypothetical (object axis) | Unit 49 |
| Potential, past (object axis) | Unit 49 |
| Potential (NOR axis) | Unit 49 |
| Potential, hypothetical (NOR axis) | Unit 49 |
| Potential, past (NOR axis) | Unit 49 |
| Potential (plural) | Unit 49 |
| Potential, past (plural) | Unit 49 |
| Potential, hypothetical (plural) | Unit 49 |
| Conditional-if (object axis) | Unit 50 |
| Conditional-would (object axis) | Unit 50 |
| Conditional-would, past (object axis) | Unit 50 |
| Conditional-if (NOR axis) | Unit 50 |
| Conditional-would (NOR axis) | Unit 50 |
| Conditional-would, past (NOR axis) | Unit 50 |
| Conditional-if (plural) | Unit 50 |
| Conditional-would (plural) | Unit 50 |
| Conditional-would, past (plural) | Unit 50 |
| Imperative (NOR axis) | Unit 51 |


---

## Units & lessons, in full — conjugated forms and what's new in each one

## Phase I · A1 — Survive — Survival Present (Me, You, & It)

### Stage 1 — Being, Having & the Ergative Leap

#### Unit 1 — izan & egon — Who and Where

**What you learn:** izan + egon, present tense

**Example:** "I am a student."

**Lessons:**

- `izan-present` — izan ("to be") — Present [ni/zu/hura]
  - Forms: **naiz** (ni), **zara** (zu), **da** (hura)
  - 🆕 **New grammar pattern:** Present — first appearance of this conjugation pattern (ni/zu/hura)
  - 📗 **New verb:** izan
- `egon-present` — egon ("to be (located / in a state)") — Present [ni/zu/hura]
  - Forms: **nago** (ni), **zaude** (zu), **dago** (hura)
  - 📗 **New verb:** egon
- `unit-1-review` — **Review** [ni/zu/hura]: izan (Present), egon (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 2 — ukan — The Ergative Leap

**What you learn:** ukan present (object fixed to hura), taught alone — ni/zu/hura

**Example:** "I have a car." (Nik auto bat dut.)

**Lessons:**

- `ukan-present` — ukan ("to have") — Present [ni/zu/hura]
  - Forms: **dut** (ni), **duzu** (zu), **du** (hura)
  - 📗 **New verb:** ukan
- `ukan-ni-nik-shift-review` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-2-review` — **Review** [ni/zu/hura]: ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 3 — "Ni" vs. "Nik" — The Case-Marking Checkpoint

**What you learn:** zero new verbs — bare izan/egon subjects vs. ergative ukan subjects, ni/zu/hura

**Example:** "Ni ikaslea naiz" vs. "Nik liburua dut."

**Lessons:**

- `case-marking-sort-review` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `case-marking-drift-review` — **Review** [ni/zu/hura]: egon (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `case-marking-checkpoint-review` — **Review** [ni/zu/hura]: izan (Present), egon (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 4 — jakin & nahi — Knowing & Wanting

**What you learn:** jakin (synthetic, same ergative suffixes as ukan) + nahi + ukan

**Example:** "I don't know." (Ez dakit.)

**Lessons:**

- `jakin-present` — jakin ("to know (a fact)") — Present [ni/zu/hura]
  - Forms: **dakit** (ni), **dakizu** (zu), **daki** (hura)
  - 📗 **New verb:** jakin
- `nahi-present` — nahi izan ("to want") — Present [ni/zu/hura]
  - Forms: **nahi dut** (ni), **nahi duzu** (zu), **nahi du** (hura)
  - 📗 **New verb:** nahi izan
- `jakin-suffix-family-review` — **Review** [ni/zu/hura]: jakin (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `knowing-wanting-review` — **Review** [ni/zu/hura]: jakin (Present), nahi izan (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 2 — Seeing & Moving

#### Unit 5 — NOR-NORK Periphrastic — the -tzen dut Pattern (with ikusi)

**What you learn:** ikusi present (ni/zu/hura) — Phase I's first periphrastic verb

**Example:** "I see the mountain."

**Lessons:**

- `ikusi-present` — ikusi ("to see") — Present [ni/zu/hura]
  - Forms: **ikusten dut** (ni), **ikusten duzu** (zu), **ikusten du** (hura)
  - 📗 **New verb:** ikusi
- `ikusi-present-review` — **Review** [ni/zu/hura]: ikusi (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 6 — joan/etorri/ibili — The NOR Present

**What you learn:** joan + etorri + ibili, present tense

**Example:** "I'm going to the beach."

**Lessons:**

- `joan-present` — joan ("to go") — Present [ni/zu/hura]
  - Forms: **noa** (ni), **zoaz** (zu), **doa** (hura)
  - 📗 **New verb:** joan
- `etorri-present` — etorri ("to come") — Present [ni/zu/hura]
  - Forms: **nator** (ni), **zatoz** (zu), **dator** (hura)
  - 📗 **New verb:** etorri
- `ibili-present` — ibili ("to walk around / be doing") — Present [ni/zu/hura]
  - Forms: **nabil** (ni), **zabiltza** (zu), **dabil** (hura)
  - 📗 **New verb:** ibili
- `unit-3-review` — **Review** [ni/zu/hura]: joan (Present), etorri (Present), ibili (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-fodder-present` — **Pooled practice** [ni/zu/hura]: 7 verbs pooled — Present
  - 📗 **New verbs:** sartu, atera, hasi, +4 more (7 total)
- `nor-fodder-present-plural` — **Pooled practice** [gu/zuek/haiek]: 7 verbs pooled — Present
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: sartu, atera, hasi, +4 more (7 total)
    - sartu: **sartzen gara** (gu), **sartzen zarete** (zuek), **sartzen dira** (haiek)
    - atera: **ateratzen gara** (gu), **ateratzen zarete** (zuek), **ateratzen dira** (haiek)
    - hasi: **hasten gara** (gu), **hasten zarete** (zuek), **hasten dira** (haiek)

#### Unit 7 — Expansion: Absolutive Plurals (Refresh Gate)

**What you learn:** Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri, and ikusi — zero new verbs

**Example:** "We are teachers." (Irakasleak gara)

**Lessons:**

- `unit-6-review-1` — **Review** [gu/zuek/haiek]: izan (Present), ukan (Present)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: izan, ukan
    - izan: **gara** (gu), **zarete** (zuek), **dira** (haiek)
    - ukan: **dugu** (gu), **duzue** (zuek), **dute** (haiek)
- `unit-6-review-2` — **Review** [gu/zuek/haiek]: egon (Present), joan (Present)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: egon, joan
    - egon: **gaude** (gu), **zaudete** (zuek), **daude** (haiek)
    - joan: **goaz** (gu), **zoazte** (zuek), **doaz** (haiek)
- `unit-6-review-3` — **Review** [gu/zuek/haiek]: etorri (Present)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: etorri
    - etorri: **gatoz** (gu), **zatozte** (zuek), **datoz** (haiek)

#### Unit 8 — Expansion: Ergative Plurals

**What you learn:** ukan + ikusi — adds gu/zuek/haiek to the ergative ("nor-nork") paradigm, framed as "the plural moved — now it's a suffix"

**Example:** "We have a car." (Auto bat dugu)

**Lessons:**

- `ukan-present-plural` — ukan ("to have") — Present [gu/zuek/haiek]
  - Forms: **dugu** (gu), **duzue** (zuek), **dute** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ikusi-present-plural` — ikusi ("to see") — Present [gu/zuek/haiek]
  - Forms: **ikusten dugu** (gu), **ikusten duzue** (zuek), **ikusten dute** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: ikusi
- `ikusi-present-plural-review` — **Review** [gu/zuek/haiek]: ikusi (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-8-ergative-review` — **Review** [gu/zuek/haiek]: ukan (Present), ikusi (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 9 — ari + izan — The Immediate Continuous

**What you learn:** ari + izan

**Example:** "What are you doing?" (Zer egiten ari zara?)

**Lessons:**

- `ari-present` — ari izan ("to be busy (doing something)") — Present
  - Forms: **ari naiz** (ni), **ari zara** (zu), **ari da** (hura)
  - 📗 **New verb:** ari izan
- `unit-4-review` — **Review**: ari izan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Refresh Gate A — The "Ez" Trap

#### Unit 10 — REFRESH — The Inversion Matrix (Refresh Gate)

**What you learn:** Negation drills across Units 1–9 — zero new verbs

**Lessons:**

- `unit-5-review-1` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-5-review-2` — **Review** [ni/zu/hura]: egon (Present), joan (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-5-review-3` — **Review** [ni/zu/hura]: jakin (Present), etorri (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._


## Phase II · A2 — Everyday Life — Transitivity & Everyday Life

### Stage 3 — Looking Back I

#### Unit 11 — The Present Perfect (Lehenaldi Burutua) — What Just Happened

**What you learn:** Lehenaldi Burutua — perfective participle + present auxiliary (etorri naiz / ikusi dut), taught on a known core (izan/etorri + ikusi); the recency contrast gaur ... da vs. atzo ... zen

**Example:** "I have come / I came today." (Gaur etorri naiz)

**Lessons:**

- `izan-present-perfect-pool` — **Pooled practice** [ni/zu/hura]: izan (Present perfect), joan (Present perfect), etorri (Present perfect)
  - 🆕 **New grammar pattern:** Present perfect — first appearance of this conjugation pattern (ni/zu/hura), e.g. **izan naiz** (ni), **izan zara** (zu), **izan da** (hura)
  - ✅ **Taught this tense for the first time:** izan, joan, etorri — Present perfect
    - izan: **izan naiz** (ni), **izan zara** (zu), **izan da** (hura)
    - joan: **joan naiz** (ni), **joan zara** (zu), **joan da** (hura)
    - etorri: **etorri naiz** (ni), **etorri zara** (zu), **etorri da** (hura)
- `izan-present-perfect-pool-plural` — **Pooled practice** [gu/zuek/haiek]: izan (Present perfect), joan (Present perfect), etorri (Present perfect)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present perfect table: izan, joan, etorri
    - izan: **izan gara** (gu), **izan zarete** (zuek), **izan dira** (haiek)
    - joan: **joan gara** (gu), **joan zarete** (zuek), **joan dira** (haiek)
    - etorri: **etorri gara** (gu), **etorri zarete** (zuek), **etorri dira** (haiek)
- `ikusi-present-perfect` — ikusi ("to see") — Present perfect [ni/zu/hura]
  - Forms: **ikusi dut** (ni), **ikusi duzu** (zu), **ikusi du** (hura)
  - ✅ **Taught this tense for the first time:** ikusi — Present perfect
- `ikusi-present-perfect-plural` — ikusi ("to see") — Present perfect [gu/zuek/haiek]
  - Forms: **ikusi dugu** (gu), **ikusi duzue** (zuek), **ikusi dute** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present perfect table: ikusi
- `unit-11-review` — **Review** [ni/zu/hura]: izan (Present perfect), etorri (Present perfect), ikusi (Present perfect)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 12 — The "izan" Past Pool — Looking Back I

**What you learn:** the izan past auxiliary (nintzen/zinen/zen/ginen/zineten/ziren), mixed across izan, joan, etorri, ibili

**Example:** "I was young."

**Lessons:**

- `izan-past-pool` — **Pooled practice** [ni/zu/hura]: 11 verbs pooled — Past
  - 🆕 **New grammar pattern:** Past — first appearance of this conjugation pattern (ni/zu/hura), e.g. **nintzen** (ni), **zinen** (zu), **zen** (hura)
  - ✅ **Taught this tense for the first time:** izan, joan, etorri, +8 more (11 total) — Past
    - izan: **nintzen** (ni), **zinen** (zu), **zen** (hura)
    - joan: **joan nintzen** (ni), **joan zinen** (zu), **joan zen** (hura)
    - etorri: **etorri nintzen** (ni), **etorri zinen** (zu), **etorri zen** (hura)
- `izan-past-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 11 verbs pooled — Past
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: izan, joan, etorri, +8 more (11 total)
    - izan: **ginen** (gu), **zineten** (zuek), **ziren** (haiek)
    - joan: **joan ginen** (gu), **joan zineten** (zuek), **joan ziren** (haiek)
    - etorri: **etorri ginen** (gu), **etorri zineten** (zuek), **etorri ziren** (haiek)

### Stage 4 — Daily Actions

#### Unit 13 — The NOR-NORK Present — dut/duzu/du

**What you learn:** the ukan present auxiliary (dut/duzu/du/dugu/duzue/dute), mixed across jan, edan, erosi, ikusi, hartu — first -tzen/-ten minimal pair (jaten vs. hartzen); plus the NOR-number axis (dut vs. ditut) across ukan, jan, edan, erosi, hartu, ikusi, eduki

**Example:** "I ate."

**Lessons:**

- `unit-10-present` — **Pooled practice** [ni/zu/hura]: 52 verbs pooled — Present
  - 📗 **New verbs:** jan, edan, erosi, +48 more (51 total)
- `unit-10-present-plural` — **Pooled practice** [gu/zuek/haiek]: 52 verbs pooled — Present
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: jan, edan, erosi, +48 more (51 total)
    - jan: **jaten dugu** (gu), **jaten duzue** (zuek), **jaten dute** (haiek)
    - edan: **edaten dugu** (gu), **edaten duzue** (zuek), **edaten dute** (haiek)
    - erosi: **erosten dugu** (gu), **erosten duzue** (zuek), **erosten dute** (haiek)
- `nor-nork-present-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Present (plural)
  - 🆕 **New grammar pattern:** Present (plural) — first appearance of this conjugation pattern (ni/zu/hura), e.g. **ditut** (ni), **dituzu** (zu), **ditu** (hura)
  - 📗 **New verbs:** eduki, eraman, ekarri
  - ✅ **Taught this tense for the first time:** ukan, jan, edan, +12 more (15 total) — Present (plural)
    - ukan: **ditut** (ni), **dituzu** (zu), **ditu** (hura)
    - jan: **jaten ditut** (ni), **jaten dituzu** (zu), **jaten ditu** (hura)
    - edan: **edaten ditut** (ni), **edaten dituzu** (zu), **edaten ditu** (hura)
- `nor-nork-present-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Present (plural)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present (plural) table: ukan, jan, edan, +15 more (18 total)
    - ukan: **ditugu** (gu), **dituzue** (zuek), **dituzte** (haiek)
    - jan: **jaten ditugu** (gu), **jaten dituzue** (zuek), **jaten dituzte** (haiek)
    - edan: **edaten ditugu** (gu), **edaten dituzue** (zuek), **edaten dituzte** (haiek)

#### Unit 14 — NOR-NORI Present — zait (with gustatu: "I Like It")

**What you learn:** present NOR-NORI (zait/zaizu/zaio/zaigu/zaizue/zaie) — gustatu/iruditu/ahaztu, plus their plural-NOR (zaizkit) number split; a case-frame buffer and a pooled mixer review widening past the three founding verbs to jarraitu/jario

**Example:** "I like this." (Hau gustatzen zait)

**Lessons:**

- `gustatu-present` — gustatu ("to like / please") — Present
  - Forms: **gustatzen zait** (ni), **gustatzen zaizu** (zu), **gustatzen zaio** (hura), **gustatzen zaigu** (gu), **gustatzen zaizue** (zuek), **gustatzen zaie** (haiek)
  - 📗 **New verb:** gustatu
- `iruditu-present` — iruditu ("to seem (to someone)") — Present
  - Forms: **iruditzen zait** (ni), **iruditzen zaizu** (zu), **iruditzen zaio** (hura), **iruditzen zaigu** (gu), **iruditzen zaizue** (zuek), **iruditzen zaie** (haiek)
  - 📗 **New verb:** iruditu
- `ahaztu-present` — ahaztu ("to forget") — Present
  - Forms: **ahaztu zait** (ni), **ahaztu zaizu** (zu), **ahaztu zaio** (hura), **ahaztu zaigu** (gu), **ahaztu zaizue** (zuek), **ahaztu zaie** (haiek)
  - 📗 **New verb:** ahaztu
- `gustatu-present-plural` — gustatu ("to like / please") — Present (plural)
  - Forms: **gustatzen zaizkit** (ni), **gustatzen zaizkizu** (zu), **gustatzen zaizkio** (hura), **gustatzen zaizkigu** (gu), **gustatzen zaizkizue** (zuek), **gustatzen zaizkie** (haiek)
  - ✅ **Taught this tense for the first time:** gustatu — Present (plural)
- `iruditu-present-plural` — iruditu ("to seem (to someone)") — Present (plural)
  - Forms: **iruditzen zaizkit** (ni), **iruditzen zaizkizu** (zu), **iruditzen zaizkio** (hura), **iruditzen zaizkigu** (gu), **iruditzen zaizkizue** (zuek), **iruditzen zaizkie** (haiek)
  - ✅ **Taught this tense for the first time:** iruditu — Present (plural)
- `ahaztu-present-plural` — ahaztu ("to forget") — Present (plural)
  - Forms: **ahaztu zaizkit** (ni), **ahaztu zaizkizu** (zu), **ahaztu zaizkio** (hura), **ahaztu zaizkigu** (gu), **ahaztu zaizkizue** (zuek), **ahaztu zaizkie** (haiek)
  - ✅ **Taught this tense for the first time:** ahaztu — Present (plural)
- `unit-23-number-split-review` — **Review**: gustatu (Present), gustatu (Present (plural)), iruditu (Present), iruditu (Present (plural)), ahaztu (Present), ahaztu (Present (plural))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-23-case-frame-buffer` — **Review**: gustatu (Present), iruditu (Present), ahaztu (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-nori-present-pool` — **Review**: gustatu (Present), iruditu (Present), ahaztu (Present), jarraitu (Present), jario (Present), etorri (Present (NORI axis))
  - 🆕 **New grammar pattern:** Present (NORI axis) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **datorkit** (ni), **datorkizu** (zu), **datorkigu** (gu)
  - 📗 **New verbs:** jarraitu, jario
  - ✅ **Taught this tense for the first time:** etorri — Present (NORI axis)
    - etorri: **datorkit** (ni), **datorkizu** (zu), **datorkigu** (gu)

#### Unit 15 — The NOR-NORK Past — nuen/zenuen/zuen

**What you learn:** the ukan past auxiliary (nuen/zenuen/zuen/genuen/zenuten/zuten), mixed across ukan, jan, edan, erosi, ikusi, jakin; plus the NOR-number axis in the past (zenuen vs. zenituen) across ukan, jan, edan, erosi, hartu, ikusi, eduki

**Example:** "I had a car."

**Lessons:**

- `ukan-past-pool` — **Pooled practice** [ni/zu/hura]: 53 verbs pooled — Past
  - ✅ **Taught this tense for the first time:** ukan, jan, edan, +50 more (53 total) — Past
    - ukan: **nuen** (ni), **zenuen** (zu), **zuen** (hura)
    - jan: **jan nuen** (ni), **jan zenuen** (zu), **jan zuen** (hura)
    - edan: **edan nuen** (ni), **edan zenuen** (zu), **edan zuen** (hura)
- `ukan-past-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 53 verbs pooled — Past
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: ukan, jan, edan, +50 more (53 total)
    - ukan: **genuen** (gu), **zenuten** (zuek), **zuten** (haiek)
    - jan: **jan genuen** (gu), **jan zenuten** (zuek), **jan zuten** (haiek)
    - edan: **edan genuen** (gu), **edan zenuten** (zuek), **edan zuten** (haiek)
- `nor-nork-past-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Past (plural)
  - 🆕 **New grammar pattern:** Past (plural) — first appearance of this conjugation pattern (ni/zu/hura), e.g. **nituen** (ni), **zenituen** (zu), **zituen** (hura)
  - ✅ **Taught this tense for the first time:** ukan, jan, edan, +15 more (18 total) — Past (plural)
    - ukan: **nituen** (ni), **zenituen** (zu), **zituen** (hura)
    - jan: **jan nituen** (ni), **jan zenituen** (zu), **jan zituen** (hura)
    - edan: **edan nituen** (ni), **edan zenituen** (zu), **edan zituen** (hura)
- `nor-nork-past-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Past (plural)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past (plural) table: ukan, jan, edan, +15 more (18 total)
    - ukan: **genituen** (gu), **zenituzten** (zuek), **zituzten** (haiek)
    - jan: **jan genituen** (gu), **jan zenituzten** (zuek), **jan zituzten** (haiek)
    - edan: **edan genituen** (gu), **edan zenituzten** (zuek), **edan zituzten** (haiek)

#### Unit 16 — NOR-NORK — Non-3rd-Person Objects (with maite: "I Love You")

**What you learn:** ukan/maite/ikusi/jan/edan/erosi/hartu's presentByObject/pastByObject tables (#346/#347/#348/#378/#379) — the object (NOR) shifts off the default hura to ni/zu/zuek/haiek, with nork fixed at ni, plus a pooled review (#380/#381) drawing distractors across all seven verbs; #416/#435 then drill the reverse direction (someone/something acting on me/us/you) by fixing nork at hura/gu/zu/zuek/haiek in turn, rotating the practice verb across the full seven-verb set and adding a pooled review per NORK value; #443 widens every pooled review's verb pool to ~37 periphrastic transitive verbs

**Example:** "I love you." (Maite zaitut.) / "It surprised me." (Harritu nau.)

**Lessons:**

- `ukan-object-axis-present` — ukan ("to have") — Present (object axis) [hura/zu/zuek/haiek]
  - Forms: **dut** (hura), **zaitut** (zu), **zaituztet** (zuek), **ditut** (haiek)
  - 🆕 **New grammar pattern:** Present (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Present (object axis)
- `maite-object-axis-present` — maite izan ("to love") — Present (object axis) [hura/zu/zuek/haiek]
  - Forms: **maite dut** (hura), **maite zaitut** (zu), **maite zaituztet** (zuek), **maite ditut** (haiek)
  - 📗 **New verb:** maite izan
- `ukan-object-axis-past` — ukan ("to have") — Past (object axis) [hura/zu/zuek/haiek]
  - Forms: **nuen** (hura), **zintudan** (zu), **zintuztedan** (zuek), **nituen** (haiek)
  - 🆕 **New grammar pattern:** Past (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Past (object axis)
- `maite-object-axis-past` — maite izan ("to love") — Past (object axis) [hura/zu/zuek/haiek]
  - Forms: **maite nuen** (hura), **maite zintudan** (zu), **maite zintuztedan** (zuek), **maite nituen** (haiek)
  - ✅ **Taught this tense for the first time:** maite izan — Past (object axis)
- `object-axis-present-review` — **Review** [hura/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
  - 📗 **New verb:** behar izan
  - ✅ **Taught this tense for the first time:** ikusi, jan, edan, +31 more (34 total) — Present (object axis)
    - ikusi: **ikusten dut** (hura), **ikusten zaitut** (zu), **ikusten zaituztet** (zuek), **ikusten ditut** (haiek)
    - jan: **jaten dut** (hura), **jaten zaitut** (zu), **jaten zaituztet** (zuek), **jaten ditut** (haiek)
    - edan: **edaten dut** (hura), **edaten zaitut** (zu), **edaten zaituztet** (zuek), **edaten ditut** (haiek)
- `object-axis-past-review` — **Review** [hura/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
  - ✅ **Taught this tense for the first time:** ikusi, jan, edan, +31 more (34 total) — Past (object axis)
    - ikusi: **ikusi nuen** (hura), **ikusi zintudan** (zu), **ikusi zintuztedan** (zuek), **ikusi nituen** (haiek)
    - jan: **jan nuen** (hura), **jan zintudan** (zu), **jan zintuztedan** (zuek), **jan nituen** (haiek)
    - edan: **edan nuen** (hura), **edan zintudan** (zu), **edan zintuztedan** (zuek), **edan nituen** (haiek)

#### Unit 17 — eraman/ekarri — More NOR-NORK Synthetics

**What you learn:** eraman ("to carry/take") + ekarri ("to bring") — nor-nork synthetic verbs in the already-taught eduki/jakin shape, present + past

**Example:** Nik nire txakurra daramat mendira.

**Lessons:**

- `eraman-present` — eraman ("to carry / take (something somewhere)") — Present [ni/zu/hura]
  - Forms: **daramat** (ni), **daramazu** (zu), **darama** (hura)
  - ✅ **Taught this tense for the first time:** eraman — Present
- `eraman-present-plural` — eraman ("to carry / take (something somewhere)") — Present [gu/zuek/haiek]
  - Forms: **daramagu** (gu), **daramazue** (zuek), **daramate** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: eraman
- `ekarri-present` — ekarri ("to bring") — Present [ni/zu/hura]
  - Forms: **dakart** (ni), **dakarzu** (zu), **dakar** (hura)
  - ✅ **Taught this tense for the first time:** ekarri — Present
- `ekarri-present-plural` — ekarri ("to bring") — Present [gu/zuek/haiek]
  - Forms: **dakargu** (gu), **dakarzue** (zuek), **dakarte** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: ekarri
- `eraman-past` — eraman ("to carry / take (something somewhere)") — Past [ni/zu/hura]
  - Forms: **neraman** (ni), **zeneraman** (zu), **zeraman** (hura)
  - ✅ **Taught this tense for the first time:** eraman — Past
- `eraman-past-plural` — eraman ("to carry / take (something somewhere)") — Past [gu/zuek/haiek]
  - Forms: **generaman** (gu), **zeneramaten** (zuek), **zeramaten** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: eraman
- `ekarri-past` — ekarri ("to bring") — Past [ni/zu/hura]
  - Forms: **nekarren** (ni), **zenekarren** (zu), **zekarren** (hura)
  - ✅ **Taught this tense for the first time:** ekarri — Past
- `ekarri-past-plural` — ekarri ("to bring") — Past [gu/zuek/haiek]
  - Forms: **genekarren** (gu), **zenekarten** (zuek), **zekarten** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: ekarri
- `unit-42-review` — **Review** [ni/zu/hura]: eraman (Present), ekarri (Present), eraman (Past), ekarri (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-42-review-plural` — **Review** [gu/zuek/haiek]: eraman (Present), ekarri (Present), eraman (Past), ekarri (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 5 — Possessions & Looking Back II

#### Unit 18 — eduki — Physical States & Possessions

**What you learn:** eduki — full 6-person grid; ibili gains gu/zuek/haiek (present introduced in Unit 6)

**Example:** "I have the keys in my pocket."

**Lessons:**

- `eduki-present` — eduki ("to have / hold (physically)") — Present [ni/zu/hura]
  - Forms: **daukat** (ni), **daukazu** (zu), **dauka** (hura)
  - ✅ **Taught this tense for the first time:** eduki — Present
- `eduki-present-plural` — eduki ("to have / hold (physically)") — Present [gu/zuek/haiek]
  - Forms: **daukagu** (gu), **daukazue** (zuek), **daukate** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: eduki
- `ibili-present-plural` — ibili ("to walk around / be doing") — Present [gu/zuek/haiek]
  - Forms: **gabiltza** (gu), **zabiltzate** (zuek), **dabiltza** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: ibili
- `unit-8-review` — **Review** [ni/zu/hura]: eduki (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-8-review-plural` — **Review** [gu/zuek/haiek]: eduki (Present), ibili (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 19 — eduki — "I Had It" (Simple Past)

**What you learn:** eduki — simple past, its own synthetic paradigm (neukan, zeneukan, zeukan, geneukan, zeneukaten, zeukaten)

**Example:** "I had the keys."

**Lessons:**

- `eduki-past` — eduki ("to have / hold (physically)") — Past [ni/zu/hura]
  - Forms: **neukan** (ni), **zeneukan** (zu), **zeukan** (hura)
  - ✅ **Taught this tense for the first time:** eduki — Past
- `eduki-past-review` — **Review** [ni/zu/hura]: eduki (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `eduki-past-plural` — eduki ("to have / hold (physically)") — Past [gu/zuek/haiek]
  - Forms: **geneukan** (gu), **zeneukaten** (zuek), **zeukaten** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: eduki
- `eduki-past-plural-review` — **Review** [gu/zuek/haiek]: eduki (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 20 — egon — "I Was There" (Simple Past)

**What you learn:** egon — simple past, its own synthetic paradigm (nengoen, zeunden, zegoen, geunden, zeundeten, zeuden); #440 folds in ados egon's present + past (same paradigm, invariant particle glued on) since Unit 30 was dissolved

**Example:** "I was at home."

**Lessons:**

- `ados-egon-present` — ados egon ("to agree / to be in agreement") — Present [ni/zu/hura]
  - Forms: **ados nago** (ni), **ados zaude** (zu), **ados dago** (hura)
  - 📗 **New verb:** ados egon
- `ados-egon-present-plural` — ados egon ("to agree / to be in agreement") — Present [gu/zuek/haiek]
  - Forms: **ados gaude** (gu), **ados zaudete** (zuek), **ados daude** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: ados egon
- `egon-past` — egon ("to be (located / in a state)") — Past [ni/zu/hura]
  - Forms: **nengoen** (ni), **zeunden** (zu), **zegoen** (hura)
  - ✅ **Taught this tense for the first time:** egon — Past
- `ados-egon-past` — ados egon ("to agree / to be in agreement") — Past [ni/zu/hura]
  - Forms: **ados nengoen** (ni), **ados zeunden** (zu), **ados zegoen** (hura)
  - ✅ **Taught this tense for the first time:** ados egon — Past
- `egon-past-review` — **Review** [ni/zu/hura]: egon (Past), ados egon (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `egon-past-plural` — egon ("to be (located / in a state)") — Past [gu/zuek/haiek]
  - Forms: **geunden** (gu), **zeundeten** (zuek), **zeuden** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: egon
- `ados-egon-past-plural` — ados egon ("to agree / to be in agreement") — Past [gu/zuek/haiek]
  - Forms: **ados geunden** (gu), **ados zeundeten** (zuek), **ados zeuden** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: ados egon
- `egon-past-plural-review` — **Review** [gu/zuek/haiek]: egon (Past), ados egon (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 6 — The Future (Geroa)

#### Unit 21 — izan/ukan — The Future Rule, Across Every Verb

**What you learn:** forming the future with -ko/-go + present auxiliaries — first -ko/-go minimal pair (izango vs. etorriko), ukan called out as the one suppletive exception (izango, not "ukango"); #417 adds the NOR-number axis (izango dut vs. izango ditut); #423 pools the rule across every fodder verb's future table plus a dedicated -ko/-go suffix-choice question

**Example:** "I will be a teacher" (irakasle izango naiz)

**Lessons:**

- `izan-future` — izan ("to be") — Future [ni/zu/hura]
  - Forms: **izango naiz** (ni), **izango zara** (zu), **izango da** (hura)
  - 🆕 **New grammar pattern:** Future — first appearance of this conjugation pattern (ni/zu/hura)
  - ✅ **Taught this tense for the first time:** izan — Future
- `izan-future-plural` — izan ("to be") — Future [gu/zuek/haiek]
  - Forms: **izango gara** (gu), **izango zarete** (zuek), **izango dira** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: izan
- `ukan-future` — ukan ("to have") — Future [ni/zu/hura]
  - Forms: **izango dut** (ni), **izango duzu** (zu), **izango du** (hura)
  - ✅ **Taught this tense for the first time:** ukan — Future
- `ukan-future-plural` — ukan ("to have") — Future [gu/zuek/haiek]
  - Forms: **izango dugu** (gu), **izango duzue** (zuek), **izango dute** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: ukan
- `future-intro-review` — **Review** [ni/zu/hura]: izan (Future), ukan (Future), joan (Future), etorri (Future)
  - ✅ **Taught this tense for the first time:** joan, etorri — Future
    - joan: **joango naiz** (ni), **joango zara** (zu), **joango da** (hura)
    - etorri: **etorriko naiz** (ni), **etorriko zara** (zu), **etorriko da** (hura)
- `future-intro-review-plural` — **Review** [gu/zuek/haiek]: izan (Future), ukan (Future), joan (Future), etorri (Future)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: joan, etorri
    - joan: **joango gara** (gu), **joango zarete** (zuek), **joango dira** (haiek)
    - etorri: **etorriko gara** (gu), **etorriko zarete** (zuek), **etorriko dira** (haiek)
- `nor-nork-future-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Future (plural)
  - 🆕 **New grammar pattern:** Future (plural) — first appearance of this conjugation pattern (ni/zu/hura), e.g. **izango ditut** (ni), **izango dituzu** (zu), **izango ditu** (hura)
  - ✅ **Taught this tense for the first time:** ukan, jan, edan, +15 more (18 total) — Future (plural)
    - ukan: **izango ditut** (ni), **izango dituzu** (zu), **izango ditu** (hura)
    - jan: **jango ditut** (ni), **jango dituzu** (zu), **jango ditu** (hura)
    - edan: **edango ditut** (ni), **edango dituzu** (zu), **edango ditu** (hura)
- `nor-nork-future-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Future (plural)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future (plural) table: ukan, jan, edan, +15 more (18 total)
    - ukan: **izango ditugu** (gu), **izango dituzue** (zuek), **izango dituzte** (haiek)
    - jan: **jango ditugu** (gu), **jango dituzue** (zuek), **jango dituzte** (haiek)
    - edan: **edango ditugu** (gu), **edango dituzue** (zuek), **edango dituzte** (haiek)
- `future-mixer-pool` — **Review** [ni/zu/hura]: 69 verbs pooled — Future
  - ✅ **Taught this tense for the first time:** egon, ibili, jan, +62 more (65 total) — Future
    - egon: **egongo naiz** (ni), **egongo zara** (zu), **egongo da** (hura)
    - ibili: **ibiliko naiz** (ni), **ibiliko zara** (zu), **ibiliko da** (hura)
    - jan: **jango dut** (ni), **jango duzu** (zu), **jango du** (hura)
- `future-mixer-pool-plural` — **Review** [gu/zuek/haiek]: 67 verbs pooled — Future
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: egon, ibili, jan, +60 more (63 total)
    - egon: **egongo gara** (gu), **egongo zarete** (zuek), **egongo dira** (haiek)
    - ibili: **ibiliko gara** (gu), **ibiliko zarete** (zuek), **ibiliko dira** (haiek)
    - jan: **jango dugu** (gu), **jango duzue** (zuek), **jango dute** (haiek)

#### Unit 22 — behar — Requirements & Obligations

**What you learn:** behar + ukan, present and future

**Example:** "I have to go." (Joan behar dut)

**Lessons:**

- `behar-present` — behar izan ("to need to / have to") — Present
  - Forms: **behar dut** (ni), **behar duzu** (zu), **behar du** (hura), **behar dugu** (gu), **behar duzue** (zuek), **behar dute** (haiek)
  - ✅ **Taught this tense for the first time:** behar izan — Present
- `behar-future` — behar izan ("to need to / have to") — Future
  - Forms: **beharko dut** (ni), **beharko duzu** (zu), **beharko du** (hura), **beharko dugu** (gu), **beharko duzue** (zuek), **beharko dute** (haiek)
  - ✅ **Taught this tense for the first time:** behar izan — Future
- `unit-19-review` — **Review**: behar izan (Present), behar izan (Future), ukan (Present), ukan (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Refresh Gate B — The Core Tense Checkpoint

#### Unit 23 — REFRESH — Cumulative Present/Past/Future Mixer (Refresh Gate)

**What you learn:** Synthetic + periphrastic, positive + negative, present + past + future — zero new verbs, score-gated (bestStars >= 2 to continue)

**Lessons:**

- `unit-20-review-1` — **Review** [ni/zu/hura]: izan (Present), izan (Past), izan (Future), ukan (Present), ukan (Past), ukan (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-20-review-2` — **Review** [ni/zu/hura]: joan (Present), joan (Past), joan (Future), ikusi (Present), ikusi (Past), ikusi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-20-review-3` — **Review** [gu/zuek/haiek]: izan (Present), izan (Past), izan (Future), ukan (Present), ukan (Past), ukan (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-20-review-4` — **Review** [gu/zuek/haiek]: joan (Present), joan (Past), joan (Future), ikusi (Present), ikusi (Past), ikusi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-20-review-5` — **Review** [ni/zu/hura]: eduki (Present), ibili (Present), izan (Past), ukan (Past), jakin (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-20-review-6` — **Review** [ni/zu/hura]: izan (Past), ukan (Future), joan (Present), ikusi (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._


## Phase III · B1 — Into the Past — Shifting to the Past

### Stage 7 — Aspect in the Past

#### Unit 24 — The Imperfective Past — "I Used To..."

**What you learn:** imperfective/habitual past (etortzen nintzen, "I used to come / I was coming") — distinct from the simple past taught in Units 12/14/17/18

**Example:** "I used to come here every day."

**Lessons:**

- `etorri-habitual-past` — etorri ("to come") — Past (habitual) [ni/zu/hura]
  - Forms: **etortzen nintzen** (ni), **etortzen zinen** (zu), **etortzen zen** (hura)
  - 🆕 **New grammar pattern:** Past (habitual) — first appearance of this conjugation pattern (ni/zu/hura)
  - ✅ **Taught this tense for the first time:** etorri — Past (habitual)
- `etorri-habitual-past-plural` — etorri ("to come") — Past (habitual) [gu/zuek/haiek]
  - Forms: **etortzen ginen** (gu), **etortzen zineten** (zuek), **etortzen ziren** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past (habitual) table: etorri
- `ikusi-habitual-past` — ikusi ("to see") — Past (habitual) [ni/zu/hura]
  - Forms: **ikusten nuen** (ni), **ikusten zenuen** (zu), **ikusten zuen** (hura)
  - ✅ **Taught this tense for the first time:** ikusi — Past (habitual)
- `ikusi-habitual-past-plural` — ikusi ("to see") — Past (habitual) [gu/zuek/haiek]
  - Forms: **ikusten genuen** (gu), **ikusten zenuten** (zuek), **ikusten zuten** (haiek)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past (habitual) table: ikusi
- `unit-21-review` — **Review**: etorri (Past (habitual)), ikusi (Past (habitual))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 25 — joan/etorri/ibili — Motion in Progress (Past)

**What you learn:** joan/etorri/ibili's native imperfective past forms (nindoan, zetorren)

**Example:** "I was on my way (when...)."

**Lessons:**

- `motion-imperfective-past-pool` — **Review** [ni/zu/hura]: joan (Past (imperfective, motion)), etorri (Past (imperfective, motion)), ibili (Past (imperfective, motion))
  - 🆕 **New grammar pattern:** Past (imperfective, motion) — first appearance of this conjugation pattern (ni/zu/hura), e.g. **nindoan** (ni), **zindoazen** (zu), **zihoan** (hura)
  - ✅ **Taught this tense for the first time:** joan, etorri, ibili — Past (imperfective, motion)
    - joan: **nindoan** (ni), **zindoazen** (zu), **zihoan** (hura)
    - etorri: **nentorren** (ni), **zentozen** (zu), **zetorren** (hura)
    - ibili: **nenbilen** (ni), **zenbiltzan** (zu), **zebilen** (hura)
- `motion-imperfective-past-pool-plural` — **Review** [gu/zuek/haiek]: joan (Past (imperfective, motion)), etorri (Past (imperfective, motion)), ibili (Past (imperfective, motion))
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past (imperfective, motion) table: joan, etorri, ibili
    - joan: **gindoazen** (gu), **zindoazten** (zuek), **zihoazen** (haiek)
    - etorri: **gentozen** (gu), **zentozten** (zuek), **zetozen** (haiek)
    - ibili: **genbiltzan** (gu), **zenbiltzaten** (zuek), **zebiltzan** (haiek)


## Phase IV · B1 — People & Relationships — Interpersonal & Relationship Dynamics

### Stage 8 — The Dative Shift (NOR-NORI)

#### Unit 26 — NOR-NORI Past & Future — Dative Across Time

**What you learn:** NOR-NORI past + future — recombines Unit 25's dative grid with the periphrastic past and -ko/-go future; ends with a pooled mixer review (#385), mirroring Unit 25's present pool

**Example:** "I liked it yesterday." (Atzo gustatu zitzaidan)

**Lessons:**

- `gustatu-past` — gustatu ("to like / please") — Past
  - Forms: **gustatu zitzaidan** (ni), **gustatu zitzaizun** (zu), **gustatu zitzaion** (hura), **gustatu zitzaigun** (gu), **gustatu zitzaizuen** (zuek), **gustatu zitzaien** (haiek)
  - ✅ **Taught this tense for the first time:** gustatu — Past
- `gustatu-future` — gustatu ("to like / please") — Future
  - Forms: **gustatuko zait** (ni), **gustatuko zaizu** (zu), **gustatuko zaio** (hura), **gustatuko zaigu** (gu), **gustatuko zaizue** (zuek), **gustatuko zaie** (haiek)
  - ✅ **Taught this tense for the first time:** gustatu — Future
- `iruditu-past` — iruditu ("to seem (to someone)") — Past
  - Forms: **iruditu zitzaidan** (ni), **iruditu zitzaizun** (zu), **iruditu zitzaion** (hura), **iruditu zitzaigun** (gu), **iruditu zitzaizuen** (zuek), **iruditu zitzaien** (haiek)
  - ✅ **Taught this tense for the first time:** iruditu — Past
- `iruditu-future` — iruditu ("to seem (to someone)") — Future
  - Forms: **irudituko zait** (ni), **irudituko zaizu** (zu), **irudituko zaio** (hura), **irudituko zaigu** (gu), **irudituko zaizue** (zuek), **irudituko zaie** (haiek)
  - ✅ **Taught this tense for the first time:** iruditu — Future
- `ahaztu-past` — ahaztu ("to forget") — Past
  - Forms: **ahaztu zitzaidan** (ni), **ahaztu zitzaizun** (zu), **ahaztu zitzaion** (hura), **ahaztu zitzaigun** (gu), **ahaztu zitzaizuen** (zuek), **ahaztu zitzaien** (haiek)
  - ✅ **Taught this tense for the first time:** ahaztu — Past
- `ahaztu-future` — ahaztu ("to forget") — Future
  - Forms: **ahaztuko zait** (ni), **ahaztuko zaizu** (zu), **ahaztuko zaio** (hura), **ahaztuko zaigu** (gu), **ahaztuko zaizue** (zuek), **ahaztuko zaie** (haiek)
  - ✅ **Taught this tense for the first time:** ahaztu — Future
- `nor-nori-past-pool` — **Review**: gustatu (Past), iruditu (Past), ahaztu (Past), jarraitu (Past), jario (Past), etorri (Past (NORI axis))
  - 🆕 **New grammar pattern:** Past (NORI axis) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **zetorkidan** (ni), **zetorkion** (hura)
  - ✅ **Taught this tense for the first time:** jarraitu, jario — Past
    - jarraitu: **jarraitu zitzaidan** (ni), **jarraitu zitzaizun** (zu), **jarraitu zitzaion** (hura), **jarraitu zitzaigun** (gu), **jarraitu zitzaizuen** (zuek), **jarraitu zitzaien** (haiek)
    - jario: **zeridan** (ni), **zerizun** (zu), **zerion** (hura), **zerigun** (gu), **zerizuen** (zuek), **zerien** (haiek)
  - ✅ **Taught this tense for the first time:** etorri — Past (NORI axis)
    - etorri: **zetorkidan** (ni), **zetorkion** (hura)

#### Unit 27 — The NOR-NORI Object Axis — natzaizu/gatzaizu

**What you learn:** the NOR-NORI object axis (natzaizu/gatzaizu/zaizkizu) — gustatu/iruditu/ahaztu/jarraitu's presentByNor/pastByNor tables (#358) shift NOR off the default hura/haiek to ni/gu/zuek; a pooled cross-verb review for each fixed nori value (zu/ni/hura/gu/zuek/haiek) drills the full table across all four verbs at once (#441/#469)

**Example:** "Do you like me?" (Gustatzen natzaizu?) / "I like him." (Gustatzen natzaio.)

**Lessons:**

- `nor-axis-present-review-zu` — **Review** [ni/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - 🆕 **New grammar pattern:** Present (NOR axis) — first appearance of this conjugation pattern (ni/gu/zuek), e.g. **gustatzen natzaizu** (ni), **gustatzen gatzaizkizu** (gu), **gustatzen zatzaizkizu** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Present (NOR axis)
    - gustatu: **gustatzen natzaizu** (ni), **gustatzen gatzaizkizu** (gu), **gustatzen zatzaizkizu** (zuek)
    - iruditu: **iruditzen natzaizu** (ni), **iruditzen gatzaizkizu** (gu), **iruditzen zatzaizkizu** (zuek)
    - ahaztu: **ahaztu natzaizu** (ni), **ahaztu gatzaizkizu** (gu), **ahaztu zatzaizkizu** (zuek)
- `nor-axis-past-review-zu` — **Review** [ni/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - 🆕 **New grammar pattern:** Past (NOR axis) — first appearance of this conjugation pattern (ni/gu/zuek), e.g. **gustatu nintzaizun** (ni), **gustatu gintzaizkizun** (gu), **gustatu zintzaizkizun** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Past (NOR axis)
    - gustatu: **gustatu nintzaizun** (ni), **gustatu gintzaizkizun** (gu), **gustatu zintzaizkizun** (zuek)
    - iruditu: **iruditu nintzaizun** (ni), **iruditu gintzaizkizun** (gu), **iruditu zintzaizkizun** (zuek)
    - ahaztu: **ahaztu nintzaizun** (ni), **ahaztu gintzaizkizun** (gu), **ahaztu zintzaizkizun** (zuek)
- `nor-axis-present-review-ni` — **Review** [zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - ➕ **Adds persons zu** to the already-known Present (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatzen zatzait** (zu)
    - iruditu: **iruditzen zatzait** (zu)
    - ahaztu: **ahaztu zatzait** (zu)
- `nor-axis-past-review-ni` — **Review** [zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - ➕ **Adds persons zu** to the already-known Past (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatu zintzaidan** (zu)
    - iruditu: **iruditu zintzaidan** (zu)
    - ahaztu: **ahaztu zintzaidan** (zu)
- `nor-axis-present-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-past-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-present-review-gu` — **Review** [ni/zu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-past-review-gu` — **Review** [ni/zu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-present-review-zuek` — **Review** [ni/zu/gu]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-past-review-zuek` — **Review** [ni/zu/gu]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-present-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `nor-axis-past-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 9 — Communication & Giving (NOR-NORI-NORK)

#### Unit 28 — The NOR-NORI-NORK Present — diot/diozu/dio

**What you learn:** present NOR-NORI-NORK (esan, eman), axis-scaffolded — each lesson fixes one axis (NORK or NORI) before recombining both, plus plural-object (-zki-) fodder and extra-practice reviews; #334 adds a pooled present carrier for the ditransitive optionally-dative fodder (saldu/utzi/adierazi/eskatu/galdetu)

**Example:** "I give it to him." (Ematen diot)

**Lessons:**

- `esan-present` — esan ("to tell / say (to someone)") — Present
  - Forms: **esaten diot** (ni), **esaten diozu** (zu), **esaten dio** (hura), **esaten diogu** (gu), **esaten diozue** (zuek), **esaten diote** (haiek)
  - 📗 **New verb:** esan
- `eman-present` — eman ("to give") — Present
  - Forms: **ematen dizut** (zu), **ematen diot** (hura), **ematen dizuet** (zuek), **ematen diet** (haiek)
  - 📗 **New verb:** eman
- `esan-present-plural` — esan ("to tell / say (to someone)") — Present (plural)
  - Forms: **esaten dizkiot** (ni), **esaten dizkiozu** (zu), **esaten dizkio** (hura), **esaten dizkiogu** (gu), **esaten dizkiozue** (zuek), **esaten dizkiote** (haiek)
  - ✅ **Taught this tense for the first time:** esan — Present (plural)
- `eman-present-plural` — eman ("to give") — Present (plural)
  - Forms: **ematen dizkizut** (zu), **ematen dizkiot** (hura), **ematen dizkizuet** (zuek), **ematen dizkiet** (haiek)
  - ✅ **Taught this tense for the first time:** eman — Present (plural)
- `unit-25-fix-nori-review` — **Review**: esan (Present), esan (Past), esan (Future)
  - ✅ **Taught this tense for the first time:** esan — Past
    - esan: **esan nion** (ni), **esan zenion** (zu), **esan zion** (hura), **esan genion** (gu), **esan zenioten** (zuek), **esan zioten** (haiek)
  - ✅ **Taught this tense for the first time:** esan — Future
    - esan: **esango diot** (ni), **esango diozu** (zu), **esango dio** (hura), **esango diogu** (gu), **esango diozue** (zuek), **esango diote** (haiek)
- `unit-25-fix-nork-review` — **Review**: eman (Present), eman (Past), eman (Future)
  - ✅ **Taught this tense for the first time:** eman — Past
    - eman: **eman nizun** (zu), **eman nion** (hura), **eman nizuen** (zuek), **eman nien** (haiek)
  - ✅ **Taught this tense for the first time:** eman — Future
    - eman: **emango dizut** (zu), **emango diot** (hura), **emango dizuet** (zuek), **emango diet** (haiek)
- `unit-25-object-number-review` — **Review**: esan (Present), esan (Present (plural)), eman (Present), eman (Present (plural))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-25-two-axis-review` — **Review**: esan (Present), eman (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ditransitive-dative-present` — **Pooled practice** [ni/zu/hura]: saldu (Present), utzi (Present), adierazi (Present), eskatu (Present), galdetu (Present)
  - 📗 **New verbs:** saldu, utzi, adierazi, +2 more (5 total)
- `ditransitive-dative-present-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Present), utzi (Present), adierazi (Present), eskatu (Present), galdetu (Present)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: saldu, utzi, adierazi, +2 more (5 total)
    - saldu: **saltzen diogu** (gu), **saltzen diozue** (zuek), **saltzen diote** (haiek)
    - utzi: **uzten diogu** (gu), **uzten diozue** (zuek), **uzten diote** (haiek)
    - adierazi: **adierazten diogu** (gu), **adierazten diozue** (zuek), **adierazten diote** (haiek)

#### Unit 29 — NOR-NORI-NORK Past & Future — Telling & Giving Across Time

**What you learn:** NOR-NORI-NORK past + future — reuses the periphrastic past and -ko/-go future on the axis-fixed slices from Unit 25; #334 adds pooled past/future/review carriers for the same ditransitive fodder

**Example:** "I told him." (Esan nion)

**Lessons:**

- `esan-past` — esan ("to tell / say (to someone)") — Past
  - Forms: **esan nion** (ni), **esan zenion** (zu), **esan zion** (hura), **esan genion** (gu), **esan zenioten** (zuek), **esan zioten** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `esan-future` — esan ("to tell / say (to someone)") — Future
  - Forms: **esango diot** (ni), **esango diozu** (zu), **esango dio** (hura), **esango diogu** (gu), **esango diozue** (zuek), **esango diote** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `eman-past` — eman ("to give") — Past
  - Forms: **eman nizun** (zu), **eman nion** (hura), **eman nizuen** (zuek), **eman nien** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `eman-future` — eman ("to give") — Future
  - Forms: **emango dizut** (zu), **emango diot** (hura), **emango dizuet** (zuek), **emango diet** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `esan-past-plural` — esan ("to tell / say (to someone)") — Past (plural)
  - Forms: **esan nizkion** (ni), **esan zenizkion** (zu), **esan zizkion** (hura), **esan genizkion** (gu), **esan zenizkioten** (zuek), **esan zizkioten** (haiek)
  - ✅ **Taught this tense for the first time:** esan — Past (plural)
- `eman-past-plural` — eman ("to give") — Past (plural)
  - Forms: **eman nizkizun** (zu), **eman nizkion** (hura), **eman nizkizuen** (zuek), **eman nizkien** (haiek)
  - ✅ **Taught this tense for the first time:** eman — Past (plural)
- `ditransitive-dative-past` — **Pooled practice** [ni/zu/hura]: saldu (Past), utzi (Past), adierazi (Past), eskatu (Past), galdetu (Past)
  - ✅ **Taught this tense for the first time:** saldu, utzi, adierazi, +2 more (5 total) — Past
    - saldu: **saldu nion** (ni), **saldu zenion** (zu), **saldu zion** (hura)
    - utzi: **utzi nion** (ni), **utzi zenion** (zu), **utzi zion** (hura)
    - adierazi: **adierazi nion** (ni), **adierazi zenion** (zu), **adierazi zion** (hura)
- `ditransitive-dative-past-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Past), utzi (Past), adierazi (Past), eskatu (Past), galdetu (Past)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: saldu, utzi, adierazi, +2 more (5 total)
    - saldu: **saldu genion** (gu), **saldu zenioten** (zuek), **saldu zioten** (haiek)
    - utzi: **utzi genion** (gu), **utzi zenioten** (zuek), **utzi zioten** (haiek)
    - adierazi: **adierazi genion** (gu), **adierazi zenioten** (zuek), **adierazi zioten** (haiek)
- `ditransitive-dative-future` — **Pooled practice** [ni/zu/hura]: saldu (Future), utzi (Future), adierazi (Future), eskatu (Future), galdetu (Future)
  - ✅ **Taught this tense for the first time:** saldu, utzi, adierazi, +2 more (5 total) — Future
    - saldu: **salduko diot** (ni), **salduko diozu** (zu), **salduko dio** (hura)
    - utzi: **utziko diot** (ni), **utziko diozu** (zu), **utziko dio** (hura)
    - adierazi: **adieraziko diot** (ni), **adieraziko diozu** (zu), **adieraziko dio** (hura)
- `ditransitive-dative-future-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Future), utzi (Future), adierazi (Future), eskatu (Future), galdetu (Future)
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: saldu, utzi, adierazi, +2 more (5 total)
    - saldu: **salduko diogu** (gu), **salduko diozue** (zuek), **salduko diote** (haiek)
    - utzi: **utziko diogu** (gu), **utziko diozue** (zuek), **utziko diote** (haiek)
    - adierazi: **adieraziko diogu** (gu), **adieraziko diozue** (zuek), **adieraziko diote** (haiek)
- `ditransitive-dative-review` — **Review** [ni/zu/hura]: 15 verbs pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ditransitive-dative-review-plural` — **Review** [gu/zuek/haiek]: 15 verbs pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 30 — Covert-Dative NOR-NORI-NORK — Agentive Verbs

**What you learn:** #307 — pooled present/past/future for lagundu/ekin/erantzun/deitu/eragin/antzeman plus the dative egin compounds (mesede/kalte/aurre egin), plus itxaron's dative reading (#334); reuses the diot-family paradigm from Units 28-29, but with no overt direct object to hint NORI — drilling the exact "covert dative" confusion #293 targets

**Example:** "I help him." (Laguntzen diot)

**Lessons:**

- `dative-verb-present` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Present
  - 📗 **New verbs:** lagundu, ekin, erantzun, +7 more (10 total)
- `dative-verb-present-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Present
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Present table: lagundu, ekin, erantzun, +7 more (10 total)
    - lagundu: **laguntzen diogu** (gu), **laguntzen diozue** (zuek), **laguntzen diote** (haiek)
    - ekin: **ekiten diogu** (gu), **ekiten diozue** (zuek), **ekiten diote** (haiek)
    - erantzun: **erantzuten diogu** (gu), **erantzuten diozue** (zuek), **erantzuten diote** (haiek)
- `dative-verb-past` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Past
  - ✅ **Taught this tense for the first time:** lagundu, ekin, erantzun, +7 more (10 total) — Past
    - lagundu: **lagundu nion** (ni), **lagundu zenion** (zu), **lagundu zion** (hura)
    - ekin: **ekin nion** (ni), **ekin zenion** (zu), **ekin zion** (hura)
    - erantzun: **erantzun nion** (ni), **erantzun zenion** (zu), **erantzun zion** (hura)
- `dative-verb-past-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Past
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Past table: lagundu, ekin, erantzun, +7 more (10 total)
    - lagundu: **lagundu genion** (gu), **lagundu zenioten** (zuek), **lagundu zioten** (haiek)
    - ekin: **ekin genion** (gu), **ekin zenioten** (zuek), **ekin zioten** (haiek)
    - erantzun: **erantzun genion** (gu), **erantzun zenioten** (zuek), **erantzun zioten** (haiek)
- `dative-verb-future` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Future
  - ✅ **Taught this tense for the first time:** lagundu, ekin, erantzun, +7 more (10 total) — Future
    - lagundu: **lagunduko diot** (ni), **lagunduko diozu** (zu), **lagunduko dio** (hura)
    - ekin: **ekingo diot** (ni), **ekingo diozu** (zu), **ekingo dio** (hura)
    - erantzun: **erantzungo diot** (ni), **erantzungo diozu** (zu), **erantzungo dio** (hura)
- `dative-verb-future-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Future
  - ➕ **Adds persons gu/zuek/haiek** to the already-known Future table: lagundu, ekin, erantzun, +7 more (10 total)
    - lagundu: **lagunduko diogu** (gu), **lagunduko diozue** (zuek), **lagunduko diote** (haiek)
    - ekin: **ekingo diogu** (gu), **ekingo diozue** (zuek), **ekingo diote** (haiek)
    - erantzun: **erantzungo diogu** (gu), **erantzungo diozue** (zuek), **erantzungo diote** (haiek)
- `dative-verb-review` — **Review** [ni/zu/hura]: 30 verbs pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `dative-verb-review-plural` — **Review** [gu/zuek/haiek]: 30 verbs pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Refresh Gate C — The Multi-Argument Audit

#### Unit 31 — REFRESH — The Case-Ending Mixer (Refresh Gate, score-gated — 🛡️)

**What you learn:** Drills NOR/NORK/NORI role-swaps plus dative past/future recombination — zero new verbs, mandatory pass before Phase V. Pools `izan` (nor) / `ukan` (nor-nork) / `gustatu` (nor-nori) / `esan` (nor-nori-nork) across present/past/future so every review fires `kind: 'case-mixer'` questions across all three role contrasts at once (a `caseMixerCount` opt-in raises the count above the usual incidental 1), plus a dedicated past/future pool bridging Unit 26's dative verbs (`gustatu`/`iruditu`/`ahaztu`) with Unit 28's ditransitives (`esan`/`eman`).

**Example:** "Hark egia esaten dio." vs. "Hark egia da." (case-marking mismatch)

**Lessons:**

- `unit-31-mixer-present` — **Review** [ni/zu/hura]: izan, ukan, gustatu, esan pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-mixer-present-plural` — **Review** [gu/zuek/haiek]: izan, ukan, gustatu, esan pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-mixer-past` — **Review** [ni/zu/hura]: izan, ukan, gustatu, esan pooled — Past
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-mixer-past-plural` — **Review** [gu/zuek/haiek]: izan, ukan, gustatu, esan pooled — Past
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-mixer-future` — **Review** [ni/zu/hura]: izan, ukan, gustatu, esan pooled — Future
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-mixer-future-plural` — **Review** [gu/zuek/haiek]: izan, ukan, gustatu, esan pooled — Future
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-dative-recombination` — **Review**: gustatu, iruditu, ahaztu, esan, eman pooled — Past & Future
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-31-review` — **Review** (gate — reach 2+ stars to unlock Phase V): izan, ukan, gustatu, esan, lagundu pooled — Present/Past/Future
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._


## Phase V · B2 — Nuance & Modality — Nuance, Modality, & Social Context

### Stage 10 — Hypotheticals & Potentials

#### Unit 32 — Ahalera — Permissions & Capability

**What you learn:** dezaket/naiteke contrasted with periphrastic ahal izan/ezin (#410/#411) — production for NOR/NOR-NORK; plus ukan's NOR-NORK object axis (zaitzaket-type forms, #352, extended to every NORK value by #424) across all three Ahalera sub-tenses — present, hypothetical, and past; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis across the same three sub-tenses, recognition-only for every dative value (#425, pooled into cross-verb reviews with jarraitu by #446); esan/eman's ditransitive Ahalera (diezaioket-type forms, #366) recognition-only

**Example:** "I can come." / "I can't come."

**Lessons:**

- `izan-potential` — izan ("to be") — Potential (Ahalera)
  - Forms: **naiteke** (ni), **zaitezke** (zu), **daiteke** (hura), **gaitezke** (gu), **zaitezkete** (zuek), **daitezke** (haiek)
  - 🆕 **New grammar pattern:** Potential (Ahalera) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Potential (Ahalera)
- `ukan-potential` — ukan ("to have") — Potential (Ahalera)
  - Forms: **dezaket** (ni), **dezakezu** (zu), **dezake** (hura), **dezakegu** (gu), **dezakezue** (zuek), **dezakete** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential (Ahalera)
- `unit-28-review` — **Review**: izan (Potential (Ahalera)), ukan (Potential (Ahalera))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `izan-potential-alegiazkoa` — izan ("to be") — Potential, hypothetical
  - Forms: **ninteke** (ni), **zintezke** (zu), **liteke** (hura), **gintezke** (gu), **zintezkete** (zuek), **litezke** (haiek)
  - 🆕 **New grammar pattern:** Potential, hypothetical — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Potential, hypothetical
- `ukan-potential-alegiazkoa` — ukan ("to have") — Potential, hypothetical
  - Forms: **nezake** (ni), **zenezake** (zu), **lezake** (hura), **genezake** (gu), **zenezakete** (zuek), **lezakete** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential, hypothetical
- `izan-potential-lehenaldia` — izan ("to be") — Potential, past
  - Forms: **nintekeen** (ni), **zintezkeen** (zu), **zitekeen** (hura), **gintezkeen** (gu), **zintezketen** (zuek), **zitezkeen** (haiek)
  - 🆕 **New grammar pattern:** Potential, past — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Potential, past
- `ukan-potential-lehenaldia` — ukan ("to have") — Potential, past
  - Forms: **nezakeen** (ni), **zenezakeen** (zu), **zezakeen** (hura), **genezakeen** (gu), **zenezaketen** (zuek), **zezaketen** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential, past
- `unit-28-alegiazkoa-lehenaldia-review` — **Review**: izan (Potential, hypothetical), ukan (Potential, hypothetical), izan (Potential, past), ukan (Potential, past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ahal-izan-present` — ahal izan ("to be able to (intransitive)") — Present
  - Forms: **ahal naiz** (ni), **ahal zara** (zu), **ahal da** (hura), **ahal gara** (gu), **ahal zarete** (zuek), **ahal dira** (haiek)
  - 📗 **New verb:** ahal izan
- `ahal-ukan-present` — ahal izan ("to be able to (transitive)") — Present
  - Forms: **ahal dut** (ni), **ahal duzu** (zu), **ahal du** (hura), **ahal dugu** (gu), **ahal duzue** (zuek), **ahal dute** (haiek)
  - 📗 **New verb:** ahal izan
- `ezin-izan-present` — ezin ("to not be able to / can't (intransitive)") — Present
  - Forms: **ezin naiz** (ni), **ezin zara** (zu), **ezin da** (hura), **ezin gara** (gu), **ezin zarete** (zuek), **ezin dira** (haiek)
  - 📗 **New verb:** ezin
- `ezin-ukan-present` — ezin ("to not be able to / can't (transitive)") — Present
  - Forms: **ezin dut** (ni), **ezin duzu** (zu), **ezin du** (hura), **ezin dugu** (gu), **ezin duzue** (zuek), **ezin dute** (haiek)
  - 📗 **New verb:** ezin
- `unit-34-ahal-ezin-review` — **Review**: ahal izan (Present), ezin (Present)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 33 — Baldintza & Ondorioa — Conditionals

**What you learn:** ba- protasis + -ke apodosis — production for NOR/NOR-NORK; plus ukan's NOR-NORK object axis (bazintut/zintuket-type forms, #353, extended to every NORK value by #424) across Baldintza and Ondorioa present/past; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis across Baldintza and Ondorioa present/past, recognition-only for every dative value (#425, pooled into cross-verb reviews with jarraitu by #445); esan/eman's ditransitive Baldintza/Ondorioa (balio/nioke-type forms, #366) recognition-only

**Example:** "If I had money, I would buy that" (Dirua banu, hori erosiko nuke)

**Lessons:**

- `izan-baldintza` — izan ("to be") — Conditional-if (Baldintza)
  - Forms: **banintz** (ni), **bazina** (zu), **balitz** (hura), **bagina** (gu), **bazinete** (zuek), **balira** (haiek)
  - 🆕 **New grammar pattern:** Conditional-if (Baldintza) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Conditional-if (Baldintza)
- `izan-conditional` — izan ("to be") — Conditional-would (Ondorioa)
  - Forms: **nintzateke** (ni), **zinateke** (zu), **litzateke** (hura), **ginateke** (gu), **zinatekete** (zuek), **lirateke** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would (Ondorioa) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Conditional-would (Ondorioa)
- `ukan-baldintza` — ukan ("to have") — Conditional-if (Baldintza)
  - Forms: **banu** (ni), **bazenu** (zu), **balu** (hura), **bagenu** (gu), **bazenute** (zuek), **balute** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-if (Baldintza)
- `ukan-conditional` — ukan ("to have") — Conditional-would (Ondorioa)
  - Forms: **nuke** (ni), **zenuke** (zu), **luke** (hura), **genuke** (gu), **zenukete** (zuek), **lukete** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-would (Ondorioa)
- `unit-29-review` — **Review**: izan (Conditional-if (Baldintza)), izan (Conditional-would (Ondorioa)), ukan (Conditional-if (Baldintza)), ukan (Conditional-would (Ondorioa))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `izan-conditional-past` — izan ("to be") — Conditional-would, past
  - Forms: **nintzatekeen** (ni), **zinatekeen** (zu), **zatekeen** (hura), **ginatekeen** (gu), **zinateketen** (zuek), **ziratekeen** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would, past — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Conditional-would, past
- `ukan-conditional-past` — ukan ("to have") — Conditional-would, past
  - Forms: **nukeen** (ni), **zenukeen** (zu), **zukeen** (hura), **genukeen** (gu), **zenuketen** (zuek), **zuketen** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-would, past
- `unit-29-conditional-past-review` — **Review**: izan (Conditional-would, past), ukan (Conditional-would, past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 11 — Agintera (Commands)

#### Unit 34 — Agintera — Commands

**What you learn:** the imperative — izan/ukan production for NOR/NOR-NORK (including jussive/hortative and plural-object); egon/etorri/joan production; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis (#364, bekio/zakio-type forms, extended to every dative value by #425, pooled into cross-verb reviews with jarraitu by #444); esan/eman's ditransitive (iezadazu) recognition-only

**Example:** Hadi hona!

**Lessons:**

- `izan-imperative` — izan ("to be") — Imperative (Agintera)
  - Forms: **zaitez** (zu), **zaitezte** (zuek)
  - 🆕 **New grammar pattern:** Imperative (Agintera) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Imperative (Agintera)
- `ukan-imperative` — ukan ("to have") — Imperative (Agintera)
  - Forms: **ezazu** (zu), **beza** (hura), **dezagun** (gu), **ezazue** (zuek), **bezate** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Imperative (Agintera)
- `unit-30-review` — **Review**: izan (Imperative (Agintera)), ukan (Imperative (Agintera))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `egon-imperative` — egon ("to be (located / in a state)") — Imperative (Agintera)
  - Forms: **zaude** (zu), **bego** (hura), **zaudete** (zuek), **begoz** (haiek)
  - ✅ **Taught this tense for the first time:** egon — Imperative (Agintera)
- `etorri-imperative` — etorri ("to come") — Imperative (Agintera)
  - Forms: **zatoz** (zu), **zatozte** (zuek)
  - ✅ **Taught this tense for the first time:** etorri — Imperative (Agintera)
- `joan-imperative` — joan ("to go") — Imperative (Agintera)
  - Forms: **zoaz** (zu), **zoazte** (zuek)
  - ✅ **Taught this tense for the first time:** joan — Imperative (Agintera)
- `unit-30-plural-object-review` — **Review**: ukan (Imperative (Agintera)), ukan (Imperative (plural))
  - 🆕 **New grammar pattern:** Imperative (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **itzazu** (zu), **bitza** (hura), **ditzagun** (gu), **itzazue** (zuek), **bitzate** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Imperative (plural)
    - ukan: **itzazu** (zu), **bitza** (hura), **ditzagun** (gu), **itzazue** (zuek), **bitzate** (haiek)
- `unit-30-ditransitive-review` — **Review**: esan (Imperative (ditransitive)), eman (Imperative (ditransitive))
  - 🆕 **New grammar pattern:** Imperative (ditransitive) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **iezaiozu** (zu), **iezaiozue** (zuek)
  - ✅ **Taught this tense for the first time:** esan, eman — Imperative (ditransitive)
    - esan: **iezaiozu** (zu), **iezaiozue** (zuek)
    - eman: **iezadazu** (ni), **iezaiozu** (hura), **iezaguzu** (gu), **iezaiezu** (haiek)


## Bonus — Mastery, Register & Color — Optional deep dives, off the main path — never required to finish the core

### Directives & Wishes — The Subjunctive

#### Unit 35 — Purpose & Wishing (Subjuntiboa) (Bonus)

**What you learn:** the subjunctive as a construction (matrix verb + subordinate clause) — NOR/NOR-NORK 3rd-person in-construction production, dative/ditransitive recognition-only

**Example:** Nahi dut etor dadin. · Esan dio etor dadila. · ...ikus dezan.

**Lessons:**

- `izan-subjunctive-present` — izan ("to be") — Subjunctive (present) [hura/haiek]
  - Forms: **dadin** (hura), **daitezen** (haiek)
  - 🆕 **New grammar pattern:** Subjunctive (present) — first appearance of this conjugation pattern (hura/haiek)
  - ✅ **Taught this tense for the first time:** izan — Subjunctive (present)
- `ukan-subjunctive-present` — ukan ("to have") — Subjunctive (present) [hura/haiek]
  - Forms: **dezan** (hura), **dezaten** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Subjunctive (present)
- `unit-36-review` — **Review**: izan (Subjunctive (present)), ukan (Subjunctive (present))
  - ➕ **Adds persons ni/zu/gu/zuek** to the already-known Subjunctive (present) table: izan, ukan
    - izan: **nadin** (ni), **zaitezen** (zu), **gaitezen** (gu), **zaitezten** (zuek)
    - ukan: **dezadan** (ni), **dezazun** (zu), **dezagun** (gu), **dezazuen** (zuek)
- `unit-36-dative-review` — **Review**: gustatu (Subjunctive (present)), iruditu (Subjunctive (present)), ahaztu (Subjunctive (present))
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu — Subjunctive (present)
    - gustatu: **gustatu dakidan** (ni), **gustatu dakizun** (zu), **gustatu dakion** (hura), **gustatu dakigun** (gu), **gustatu dakizueten** (zuek), **gustatu dakien** (haiek)
    - iruditu: **iruditu dakidan** (ni), **iruditu dakizun** (zu), **iruditu dakion** (hura), **iruditu dakigun** (gu), **iruditu dakizueten** (zuek), **iruditu dakien** (haiek)
    - ahaztu: **ahaztu dakidan** (ni), **ahaztu dakizun** (zu), **ahaztu dakion** (hura), **ahaztu dakigun** (gu), **ahaztu dakizueten** (zuek), **ahaztu dakien** (haiek)
- `unit-36-ditransitive-review` — **Review**: esan (Subjunctive (present)), eman (Subjunctive (present))
  - ✅ **Taught this tense for the first time:** esan, eman — Subjunctive (present)
    - esan: **diezaiodan** (ni), **diezaiozun** (zu), **diezaion** (hura), **diezaiogun** (gu), **diezaiozuen** (zuek), **diezaioten** (haiek)
    - eman: **diezazudan** (zu), **diezaiodan** (hura), **diezazuedan** (zuek), **diezaiedan** (haiek)
- `izan-subjunctive-past` — izan ("to be") — Subjunctive (past) [hura/haiek]
  - Forms: **zedin** (hura), **zitezen** (haiek)
  - 🆕 **New grammar pattern:** Subjunctive (past) — first appearance of this conjugation pattern (hura/haiek)
  - ✅ **Taught this tense for the first time:** izan — Subjunctive (past)
- `ukan-subjunctive-past` — ukan ("to have") — Subjunctive (past) [hura/haiek]
  - Forms: **zezan** (hura), **zezaten** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Subjunctive (past)
- `unit-36-past-review` — **Review**: izan (Subjunctive (past)), ukan (Subjunctive (past))
  - ➕ **Adds persons ni/zu/gu/zuek** to the already-known Subjunctive (past) table: izan, ukan
    - izan: **nendin** (ni), **zintezen** (zu), **gintezen** (gu), **zintezten** (zuek)
    - ukan: **nezan** (ni), **zenezan** (zu), **genezan** (gu), **zenezaten** (zuek)

### Stage 12 — The Intimate Register (hi + Hitanoa)

#### Unit 36 — hi — Meet "hi" (Bonus)

**What you learn:** hi as a subject in known paradigms, plus hi-as-NORK's own gender split

**Example:** Hi ikaslea haiz.

**Lessons:**

- `unit-32-hi-present` — **Review** [hi]: izan (Present), egon (Present), joan (Present), etorri (Present), ibili (Present)
  - ➕ **Adds persons hi** to the already-known Present table: izan, egon, joan, +2 more (5 total)
    - izan: **haiz** (hi)
    - egon: **hago** (hi)
    - joan: **hoa** (hi)
- `unit-32-hi-past` — **Review** [hi]: izan (Past), egon (Past), joan (Past), etorri (Past), ibili (Past)
  - ➕ **Adds persons hi** to the already-known Past table: izan, egon, joan, +2 more (5 total)
    - izan: **hintzen** (hi)
    - egon: **hengoen** (hi)
    - joan: **joan hintzen** (hi)
- `unit-32-hi-nork-present` — **Review** [hi-m/hi-f]: ukan (Present), jakin (Present)
  - ➕ **Adds persons hi-m/hi-f** to the already-known Present table: ukan, jakin
    - ukan: **duk** (hi-m), **dun** (hi-f)
    - jakin: **dakik** (hi-m), **dakin** (hi-f)

#### Unit 37 — Toka (Masculine Allocutive) (Bonus)

**What you learn:** addressee-agreement on 3rd-person statements, masculine register

**Example:** Lanean dik.

**Lessons:**

- `izan-present-toka` — izan ("to be") — Present (toka)
  - Forms: **duk** (hura), **dituk** (haiek)
  - 🆕 **New grammar pattern:** Present (toka) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Present (toka)
- `ukan-present-toka` — ukan ("to have") — Present (toka)
  - Forms: **dik** (hura), **ditek** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Present (toka)
- `izan-past-toka` — izan ("to be") — Past (toka)
  - Forms: **zuan** (hura), **zituan** (haiek)
  - 🆕 **New grammar pattern:** Past (toka) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Past (toka)
- `ukan-past-toka` — ukan ("to have") — Past (toka)
  - Forms: **zian** (hura), **zitean** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Past (toka)
- `unit-33-review` — **Review**: izan (Present (toka)), ukan (Present (toka)), izan (Past (toka)), ukan (Past (toka))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 38 — Noka (Feminine Allocutive) (Bonus)

**What you learn:** taught as the -k → -n transform of Unit 34's toka forms, feminine register

**Example:** Lanean din.

**Lessons:**

- `izan-present-noka` — izan ("to be") — Present (noka)
  - Forms: **dun** (hura), **ditun** (haiek)
  - 🆕 **New grammar pattern:** Present (noka) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Present (noka)
- `ukan-present-noka` — ukan ("to have") — Present (noka)
  - Forms: **din** (hura), **diten** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Present (noka)
- `izan-past-noka` — izan ("to be") — Past (noka)
  - Forms: **zunan** (hura), **zitunan** (haiek)
  - 🆕 **New grammar pattern:** Past (noka) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** izan — Past (noka)
- `ukan-past-noka` — ukan ("to have") — Past (noka)
  - Forms: **zinan** (hura), **zitenan** (haiek)
  - ✅ **Taught this tense for the first time:** ukan — Past (noka)
- `unit-34-review` — **Review**: izan (Present (noka)), ukan (Present (noka)), izan (Past (noka)), ukan (Past (noka))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 39 — Hitanoa Recombined (Bonus)

**What you learn:** mixed toka/noka chosen by addressee gender, plus when not to use it — suppressed in subordinate clauses and formal -ke- moods. Zero new conjugation forms: pools Units 37-38's toka/noka tables together instead of one register at a time, plus a lesson juxtaposing them against Unit 32's `izan`/`ukan` Ahalera (`potential`) forms — the formal `-ke-` mood that never takes toka/noka marking — so the "leave it out here" rule is taught by contrast rather than a new question mechanic.

**Example:** Lanean dik. / Lanean din. / Joan naiteke. (no hitanoa here)

**Lessons:**

- `unit-39-recombined-present` — **Review**: izan (Present (toka)), izan (Present (noka)), ukan (Present (toka)), ukan (Present (noka)) pooled
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-39-recombined-past` — **Review**: izan (Past (toka)), izan (Past (noka)), ukan (Past (toka)), ukan (Past (noka)) pooled
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-39-when-not-to-use` — **Review**: izan/ukan's Present (toka/noka) pooled with izan/ukan's Ahalera (potential) — contrasts hitanoa-marked forms against the formal `-ke-` mood that never takes them
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-39-review` — **Review**: all of the above pooled — Present/Past toka/noka plus Ahalera
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 13 — Reading Real Text

#### Unit 40 — The Passive nor-shift — Reading Real Text (Bonus)

**What you learn:** non-finite forms, nor-shift (ireki dut → ireki da) — comprehension over real sentences, recognition-only throughout

**Example:** Nik atea ireki dut. → Atea ireki da.

**Lessons:**

- `unit-36-reading` — **Reading comprehension** (recognition-only): 10 real-sentence items (non-finite forms / nor-shift)
  - _Recombines forms already taught — no new conjugation paradigm._
- `unit-36-reading-nonfinite` — **Reading comprehension** (recognition-only): 8 real-sentence items (non-finite forms / nor-shift)
  - _Recombines forms already taught — no new conjugation paradigm._

### Stage 14 — The Causative Suffix (-arazi)

#### Unit 41 — Making Someone Do It (Bonus)

**What you learn:** -arazi on intransitives (nor → nor-nork), present/past/future

**Example:** Ekaitzak mendizaleak itzularazi zituen. · Musikak umeak dantzarazi ditu.

**Lessons:**

- `itzularazi-present` — itzularazi ("to make (someone) turn back") — Present
  - Forms: **itzularazten ditut** (ni), **itzularazten dituzu** (zu), **itzularazten ditu** (hura), **itzularazten ditugu** (gu), **itzularazten dituzue** (zuek), **itzularazten dituzte** (haiek)
  - 📗 **New verb:** itzularazi
- `itzularazi-past` — itzularazi ("to make (someone) turn back") — Past
  - Forms: **itzularazi nituen** (ni), **itzularazi zenituen** (zu), **itzularazi zituen** (hura), **itzularazi genituen** (gu), **itzularazi zenituzten** (zuek), **itzularazi zituzten** (haiek)
  - ✅ **Taught this tense for the first time:** itzularazi — Past
- `itzularazi-future` — itzularazi ("to make (someone) turn back") — Future
  - Forms: **itzularaziko ditut** (ni), **itzularaziko dituzu** (zu), **itzularaziko ditu** (hura), **itzularaziko ditugu** (gu), **itzularaziko dituzue** (zuek), **itzularaziko dituzte** (haiek)
  - ✅ **Taught this tense for the first time:** itzularazi — Future
- `dantzarazi-present` — dantzarazi ("to make (someone) dance") — Present
  - Forms: **dantzarazten ditut** (ni), **dantzarazten dituzu** (zu), **dantzarazten ditu** (hura), **dantzarazten ditugu** (gu), **dantzarazten dituzue** (zuek), **dantzarazten dituzte** (haiek)
  - 📗 **New verb:** dantzarazi
- `dantzarazi-past` — dantzarazi ("to make (someone) dance") — Past
  - Forms: **dantzarazi nituen** (ni), **dantzarazi zenituen** (zu), **dantzarazi zituen** (hura), **dantzarazi genituen** (gu), **dantzarazi zenituzten** (zuek), **dantzarazi zituzten** (haiek)
  - ✅ **Taught this tense for the first time:** dantzarazi — Past
- `dantzarazi-future` — dantzarazi ("to make (someone) dance") — Future
  - Forms: **dantzaraziko ditut** (ni), **dantzaraziko dituzu** (zu), **dantzaraziko ditu** (hura), **dantzaraziko ditugu** (gu), **dantzaraziko dituzue** (zuek), **dantzaraziko dituzte** (haiek)
  - ✅ **Taught this tense for the first time:** dantzarazi — Future
- `unit-42-causative-review` — **Review**: itzularazi (Present), itzularazi (Past), itzularazi (Future), dantzarazi (Present), dantzarazi (Past), dantzarazi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

#### Unit 42 — Making Someone Do Something to Someone (Bonus)

**What you learn:** -arazi on transitives (nor-nork → nor-nori-nork), present/past/future

**Example:** Amonak umeei babarrunak janarazi zizkien. · Irakasleak ikasleei hori idatzarazi die.

**Lessons:**

- `janarazi-present` — janarazi ("to make (someone) eat (something)") — Present
  - Forms: **janarazten dizkiet** (ni), **janarazten dizkiezu** (zu), **janarazten dizkie** (hura), **janarazten dizkiegu** (gu), **janarazten dizkiezue** (zuek), **janarazten dizkiete** (haiek)
  - 📗 **New verb:** janarazi
- `janarazi-past` — janarazi ("to make (someone) eat (something)") — Past
  - Forms: **janarazi nizkien** (ni), **janarazi zenizkien** (zu), **janarazi zizkien** (hura), **janarazi genizkien** (gu), **janarazi zenizkieten** (zuek), **janarazi zizkieten** (haiek)
  - ✅ **Taught this tense for the first time:** janarazi — Past
- `janarazi-future` — janarazi ("to make (someone) eat (something)") — Future
  - Forms: **janaraziko dizkiet** (ni), **janaraziko dizkiezu** (zu), **janaraziko dizkie** (hura), **janaraziko dizkiegu** (gu), **janaraziko dizkiezue** (zuek), **janaraziko dizkiete** (haiek)
  - ✅ **Taught this tense for the first time:** janarazi — Future
- `idatzarazi-present` — idatzarazi ("to make (someone) write (something)") — Present
  - Forms: **idatzarazten diet** (ni), **idatzarazten diezu** (zu), **idatzarazten die** (hura), **idatzarazten diegu** (gu), **idatzarazten diezue** (zuek), **idatzarazten diete** (haiek)
  - 📗 **New verb:** idatzarazi
- `idatzarazi-past` — idatzarazi ("to make (someone) write (something)") — Past
  - Forms: **idatzarazi nien** (ni), **idatzarazi zenien** (zu), **idatzarazi zien** (hura), **idatzarazi genien** (gu), **idatzarazi zenieten** (zuek), **idatzarazi zieten** (haiek)
  - ✅ **Taught this tense for the first time:** idatzarazi — Past
- `idatzarazi-future` — idatzarazi ("to make (someone) write (something)") — Future
  - Forms: **idatzaraziko diet** (ni), **idatzaraziko diezu** (zu), **idatzaraziko die** (hura), **idatzaraziko diegu** (gu), **idatzaraziko diezue** (zuek), **idatzaraziko diete** (haiek)
  - ✅ **Taught this tense for the first time:** idatzarazi — Future
- `unit-43-causative-review` — **Review**: janarazi (Present), janarazi (Past), janarazi (Future), idatzarazi (Present), idatzarazi (Past), idatzarazi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Refresh Gate D — The Causative Recombination

#### Unit 43 — REFRESH — Causatives Across Tenses & Moods (Refresh Gate, Bonus)

**What you learn:** Recombines Units 42–43's -arazi forms across present/past/future — zero new verbs, score-gated

**Lessons:**

- `unit-44-review-1` — **Review**: itzularazi (Present), itzularazi (Past), itzularazi (Future), dantzarazi (Present), dantzarazi (Past), dantzarazi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-44-review-2` — **Review**: janarazi (Present), janarazi (Past), janarazi (Future), idatzarazi (Present), idatzarazi (Past), idatzarazi (Future)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 15 — Verbs That Don't Need an Auxiliary

#### Unit 44 — Synthetic Curiosities (Bonus)

**What you learn:** jario (nor-nori, "dario"/"zerion"), etzan (nor, "datza"), irudi (unergative, nork-only, "dirudi" — not iruditu's nor-nori) — rare native-synthetic verbs, recognition-only

**Example:** Malkoak dario. · Zertan datza ariketa? · Nekatuta zaude, dirudizu.

**Lessons:**

- `jario-present` — jario ("to flow / ooze") — Present
  - Forms: **darit** (ni), **darizu** (zu), **dario** (hura), **darigu** (gu), **darizue** (zuek), **darie** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `jario-past` — jario ("to flow / ooze") — Past
  - Forms: **zeridan** (ni), **zerizun** (zu), **zerion** (hura), **zerigun** (gu), **zerizuen** (zuek), **zerien** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `irudi-present` — irudi ("to seem / give the impression (not iruditu's "it seems to me")") — Present [ni/zu/hura/gu/zuek/haiek]
  - Forms: **dirudit** (ni), **dirudizu** (zu), **dirudi** (hura), **dirudigu** (gu), **dirudizue** (zuek), **dirudite** (haiek)
  - 📗 **New verb:** irudi
- `irudi-past` — irudi ("to seem / give the impression (not iruditu's "it seems to me")") — Past [ni/zu/hura/gu/zuek/haiek]
  - Forms: **nirudien** (ni), **zenirudien** (zu), **zirudien** (hura), **genirudien** (gu), **zeniruditen** (zuek), **ziruditen** (haiek)
  - ✅ **Taught this tense for the first time:** irudi — Past
- `etzan-present` — etzan ("to lie (in) / consist of") — Present [ni/zu/hura/gu/zuek/haiek]
  - Forms: **natza** (ni), **zautza** (zu), **datza** (hura), **gautza** (gu), **zautzate** (zuek), **dautza** (haiek)
  - 📗 **New verb:** etzan
- `etzan-past` — etzan ("to lie (in) / consist of") — Past [ni/zu/hura/gu/zuek/haiek]
  - Forms: **nentzan** (ni), **zeuntzan** (zu), **zetzan** (hura), **geuntzan** (gu), **zeuntzaten** (zuek), **zeutzan** (haiek)
  - ✅ **Taught this tense for the first time:** etzan — Past
- `unit-44-curiosities-review` — **Review**: jario (Present), jario (Past), irudi (Present), irudi (Past), etzan (Present), etzan (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 16 — Talking About Weather

#### Unit 45 — Talking About Weather (Bonus)

**What you learn:** ari + ukan ("euria ari du"), izan/egon/ibili weather idioms — fixed 3rd person (hura) only, zero new conjugation tables. Reuses `izan`/`egon`/`ibili`/`ukan`'s existing `hura`-present forms (`da`/`dago`/`dabil`/`du`) via 4 small dedicated "weather idiom" `VERBS` entries, each with its own sentence content rather than editing those verbs' own (much larger, unrelated) sentence arrays directly.

**Example:** Euria ari du. · Hotz da. · Eguzkia dago. · Haizea dabil.

**Lessons:**

- `unit-45-weather` — **Pooled practice** [hura]: eguraldia-ari, eguraldia-izan, eguraldia-egon, eguraldia-ibili pooled — Present
  - 📗 **New verbs:** eguraldia-ari (**du**), eguraldia-izan (**da**), eguraldia-egon (**dago**), eguraldia-ibili (**dabil**) — all four forms are the exact `hura`-present cells `ukan`/`izan`/`egon`/`ibili` already teach, reused rather than newly conjugated
- `unit-45-review` — **Review** [hura]: eguraldia-ari, eguraldia-izan, eguraldia-egon, eguraldia-ibili pooled — Present
  - _Review/practice only — no new conjugation forms; reinforces what the practice lesson already introduced._

### Stage 17 — Subjects Without Objects

#### Unit 46 — Unergative Curiosities (Bonus)

**What you learn:** ihardun ("dihardut"/"niharduen"), iraun ("dirau"/"zirauen") — unergative, NORK-only, ergative subject with no absolutive argument

**Example:** Lanean dihardut. · Filmak bi ordu dirau.

**Lessons:**

- `ihardun-present` — ihardun ("to occupy oneself / be engaged (in something)") — Present [ni/zu/hura/gu/zuek/haiek]
  - Forms: **dihardut** (ni), **diharduzu** (zu), **dihardu** (hura), **dihardugu** (gu), **diharduzue** (zuek), **dihardute** (haiek)
  - 📗 **New verb:** ihardun
- `ihardun-past` — ihardun ("to occupy oneself / be engaged (in something)") — Past [ni/zu/hura/gu/zuek/haiek]
  - Forms: **niharduen** (ni), **zeniharduen** (zu), **ziharduen** (hura), **geniharduen** (gu), **zeniharduten** (zuek), **ziharduten** (haiek)
  - ✅ **Taught this tense for the first time:** ihardun — Past
- `iraun-present` — iraun ("to last / endure") — Present [ni/zu/hura/gu/zuek/haiek]
  - Forms: **diraut** (ni), **dirauzu** (zu), **dirau** (hura), **diraugu** (gu), **dirauzue** (zuek), **diraute** (haiek)
  - 📗 **New verb:** iraun
- `iraun-past` — iraun ("to last / endure") — Past [ni/zu/hura/gu/zuek/haiek]
  - Forms: **nirauen** (ni), **zenirauen** (zu), **zirauen** (hura), **genirauen** (gu), **zenirauten** (zuek), **zirauten** (haiek)
  - ✅ **Taught this tense for the first time:** iraun — Past
- `unit-46-review` — **Review**: ihardun (Present), ihardun (Past), iraun (Present), iraun (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### Stage 18 — Tools & Usage

#### Unit 47 — erabili — Using Things (Bonus)

**What you learn:** erabili ("darabilt"/"nerabilen") — nor-nork synthetic verb in the already-taught eduki/jakin shape, present + past

**Example:** Nik ordenagailua darabilt egunero.

**Lessons:**

- `erabili-present` — erabili ("to use") — Present [ni/zu/hura/gu/zuek/haiek]
  - Forms: **darabilt** (ni), **darabilzu** (zu), **darabil** (hura), **darabilgu** (gu), **darabilzue** (zuek), **darabilte** (haiek)
  - 📗 **New verb:** erabili
- `erabili-past` — erabili ("to use") — Past [ni/zu/hura/gu/zuek/haiek]
  - Forms: **nerabilen** (ni), **zenerabilen** (zu), **zerabilen** (hura), **generabilen** (gu), **zenerabilten** (zuek), **zerabilten** (haiek)
  - ✅ **Taught this tense for the first time:** erabili — Past
- `unit-47-review` — **Review**: erabili (Present), erabili (Past)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### The Object Axis in Depth

#### Unit 48 — The Reverse Object Axis — Acting on Me / Us / You (Bonus)

**What you learn:** the NOR-NORK object axis with NORK fixed at hura/gu/zu/zuek/haiek in turn (someone/something acting on me/us/you) — the deep-practice half of Unit 15, recognition-pooled across ~37 transitive verbs

**Example:** "It surprised me." (Harritu nau.) / "They saw us." (Ikusi gaituzte.)

**Lessons:**

- `ukan-object-axis-present-hura` — ukan ("to have") — Present (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nau** (ni), **du** (hura), **gaitu** (gu), **zaitu** (zu), **zaituzte** (zuek), **ditu** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Present (object axis) table: ukan
- `maite-object-axis-past-hura` — maite izan ("to love") — Past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **maite ninduen** (ni), **maite zuen** (hura), **maite gintuen** (gu), **maite zintuen** (zu), **maite zintuzten** (zuek), **maite zituen** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Past (object axis) table: maite izan
- `object-axis-present-review-hura` — **Review** [ni/hura/gu/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
  - ➕ **Adds persons ni/gu** to the already-known Present (object axis) table: maite izan, ikusi, jan, +33 more (36 total)
    - maite izan: **maite nau** (ni), **maite gaitu** (gu)
    - ikusi: **ikusten nau** (ni), **ikusten gaitu** (gu)
    - jan: **jaten nau** (ni), **jaten gaitu** (gu)
- `object-axis-past-review-hura` — **Review** [ni/hura/gu/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
  - ➕ **Adds persons ni/gu** to the already-known Past (object axis) table: ukan, ikusi, jan, +32 more (35 total)
    - ukan: **ninduen** (ni), **gintuen** (gu)
    - ikusi: **ikusi ninduen** (ni), **ikusi gintuen** (gu)
    - jan: **jan ninduen** (ni), **jan gintuen** (gu)
- `ikusi-object-axis-present-gu` — ikusi ("to see") — Present (object axis) [hura/zu/zuek/haiek]
  - Forms: **ikusten dugu** (hura), **ikusten zaitugu** (zu), **ikusten zaituztegu** (zuek), **ikusten ditugu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `jan-object-axis-past-gu` — jan ("to eat") — Past (object axis) [hura/zu/zuek/haiek]
  - Forms: **jan genuen** (hura), **jan zintugun** (zu), **jan zintuztegun** (zuek), **jan genituen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-present-review-gu` — **Review** [hura/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-past-review-gu` — **Review** [hura/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `edan-object-axis-present-zu` — edan ("to drink") — Present (object axis) [ni/hura/gu/haiek]
  - Forms: **edaten nauzu** (ni), **edaten duzu** (hura), **edaten gaituzu** (gu), **edaten dituzu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `erosi-object-axis-past-zu` — erosi ("to buy") — Past (object axis) [ni/hura/gu/haiek]
  - Forms: **erosi ninduzun** (ni), **erosi zenuen** (hura), **erosi gintuzun** (gu), **erosi zenituen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-present-review-zu` — **Review** [ni/hura/gu/haiek]: 37 verbs pooled — Present (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-past-review-zu` — **Review** [ni/hura/gu/haiek]: 36 verbs pooled — Past (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `hartu-object-axis-present-zuek` — hartu ("to take") — Present (object axis) [ni/hura/gu/haiek]
  - Forms: **hartzen nauzue** (ni), **hartzen duzue** (hura), **hartzen gaituzue** (gu), **hartzen dituzue** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-object-axis-past-zuek` — ukan ("to have") — Past (object axis) [ni/hura/gu/haiek]
  - Forms: **ninduzuen** (ni), **zenuten** (hura), **gintuzuen** (gu), **zenituzten** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-present-review-zuek` — **Review** [ni/hura/gu/haiek]: 37 verbs pooled — Present (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-past-review-zuek` — **Review** [ni/hura/gu/haiek]: 36 verbs pooled — Past (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `maite-object-axis-present-haiek` — maite izan ("to love") — Present (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **maite naute** (ni), **maite dute** (hura), **maite gaituzte** (gu), **maite zaituzte** (zu), **maite zaituztete** (zuek), **maite dituzte** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ikusi-object-axis-past-haiek` — ikusi ("to see") — Past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **ikusi ninduten** (ni), **ikusi zuten** (hura), **ikusi gintuzten** (gu), **ikusi zintuzten** (zu), **ikusi zintuzteten** (zuek), **ikusi zituzten** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-present-review-haiek` — **Review** [ni/hura/gu/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `object-axis-past-review-haiek` — **Review** [ni/hura/gu/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

### The Axes Inside the Moods

#### Unit 49 — Potential — The Axes in Depth (Bonus)

**What you learn:** ukan's NOR-NORK object axis, gustatu/iruditu/ahaztu/jarraitu's NOR-NORI dative axis, and esan/eman's ditransitive — across all three Ahalera sub-tenses (present/hypothetical/past), recognition-pooled. The deep-practice half of Unit 23 (Ahalera).

**Example:** "It could surprise me." / "I could like him."

**Lessons:**

- `ukan-potential-object-axis-present` — ukan ("to have") — Potential (object axis) [hura/zu/zuek/haiek]
  - Forms: **dezaket** (hura), **zaitzaket** (zu), **zaitzaketet** (zuek), **ditzaket** (haiek)
  - 🆕 **New grammar pattern:** Potential (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential (object axis)
- `ukan-potential-object-axis-alegiazkoa` — ukan ("to have") — Potential, hypothetical (object axis) [hura/zu/zuek/haiek]
  - Forms: **nezake** (hura), **zintzaket** (zu), **zintzaketet** (zuek), **nitzake** (haiek)
  - 🆕 **New grammar pattern:** Potential, hypothetical (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential, hypothetical (object axis)
- `ukan-potential-object-axis-lehenaldia` — ukan ("to have") — Potential, past (object axis) [hura/zu/zuek/haiek]
  - Forms: **nezakeen** (hura), **zintzakedan** (zu), **zintzaketedan** (zuek), **nitzakeen** (haiek)
  - 🆕 **New grammar pattern:** Potential, past (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Potential, past (object axis)
- `unit-34-object-axis-review` — **Review** [hura/zu/zuek/haiek]: ukan (Potential (object axis)), ukan (Potential, hypothetical (object axis)), ukan (Potential, past (object axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-present-hura` — ukan ("to have") — Potential (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nazake** (ni), **dezake** (hura), **gaitzake** (gu), **zaitzake** (zu), **zaitzakete** (zuek), **ditzake** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Potential (object axis) table: ukan
- `ukan-potential-object-axis-alegiazkoa-hura` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nintzake** (ni), **lezake** (hura), **gintzake** (gu), **zintzake** (zu), **zintzakete** (zuek), **litzake** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Potential, hypothetical (object axis) table: ukan
- `ukan-potential-object-axis-lehenaldia-hura` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nintzakeen** (ni), **zezakeen** (hura), **gintzakeen** (gu), **zintzakeen** (zu), **zintzaketen** (zuek), **zitzakeen** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Potential, past (object axis) table: ukan
- `ukan-potential-object-axis-present-gu` — ukan ("to have") — Potential (object axis) [hura/zu/zuek/haiek]
  - Forms: **dezakegu** (hura), **zaitzakegu** (zu), **zaitzaketegu** (zuek), **ditzakegu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-alegiazkoa-gu` — ukan ("to have") — Potential, hypothetical (object axis) [hura/zu/zuek/haiek]
  - Forms: **genezake** (hura), **zintzakegu** (zu), **zintzaketegu** (zuek), **genitzake** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-lehenaldia-gu` — ukan ("to have") — Potential, past (object axis) [hura/zu/zuek/haiek]
  - Forms: **genezakeen** (hura), **zintzakegun** (zu), **zintzaketegun** (zuek), **genitzakeen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-present-zu` — ukan ("to have") — Potential (object axis) [ni/hura/gu/haiek]
  - Forms: **nazakezu** (ni), **dezakezu** (hura), **gaitzakezu** (gu), **ditzakezu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-alegiazkoa-zu` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/haiek]
  - Forms: **nintzakezu** (ni), **zenezake** (hura), **gintzakezu** (gu), **zenitzake** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-lehenaldia-zu` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/haiek]
  - Forms: **nintzakezun** (ni), **zenezakeen** (hura), **gintzakezun** (gu), **zenitzakeen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-present-zuek` — ukan ("to have") — Potential (object axis) [ni/hura/gu/haiek]
  - Forms: **nazakezue** (ni), **dezakezue** (hura), **gaitzakezue** (gu), **ditzakezue** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-alegiazkoa-zuek` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/haiek]
  - Forms: **nintzakezue** (ni), **zenezakete** (hura), **gintzakezue** (gu), **zenitzakete** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-lehenaldia-zuek` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/haiek]
  - Forms: **nintzakezuen** (ni), **zenezaketen** (hura), **gintzakezuen** (gu), **zenitzaketen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-present-haiek` — ukan ("to have") — Potential (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nazakete** (ni), **dezakete** (hura), **gaitzakete** (gu), **zaitzakete** (zu), **zaitzaketete** (zuek), **ditzakete** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-alegiazkoa-haiek` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nintzakete** (ni), **lezakete** (hura), **gintzakete** (gu), **zintzakete** (zu), **zintzaketete** (zuek), **litzakete** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-potential-object-axis-lehenaldia-haiek` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nintzaketen** (ni), **zezaketen** (hura), **gintzaketen** (gu), **zintzaketen** (zu), **zintzaketeten** (zuek), **zitzaketen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - 🆕 **New grammar pattern:** Potential (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatu zakidake** (zu), **gustatu gakizkidake** (gu), **gustatu zakizkidake** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Potential (NOR axis)
    - gustatu: **gustatu zakidake** (zu), **gustatu gakizkidake** (gu), **gustatu zakizkidake** (zuek)
    - iruditu: **iruditu zakidake** (zu), **iruditu gakizkidake** (gu), **iruditu zakizkidake** (zuek)
    - ahaztu: **ahaztu zakidake** (zu), **ahaztu gakizkidake** (gu), **ahaztu zakizkidake** (zuek)
- `potential-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - ➕ **Adds persons ni** to the already-known Potential (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatu nakizuke** (ni)
    - iruditu: **iruditu nakizuke** (ni)
    - ahaztu: **ahaztu nakizuke** (ni)
- `potential-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-alegiazkoa-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - 🆕 **New grammar pattern:** Potential, hypothetical (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatu zenkidake** (zu), **gustatu genkizkidake** (gu), **gustatu zenkizkidake** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Potential, hypothetical (NOR axis)
    - gustatu: **gustatu zenkidake** (zu), **gustatu genkizkidake** (gu), **gustatu zenkizkidake** (zuek)
    - iruditu: **iruditu zenkidake** (zu), **iruditu genkizkidake** (gu), **iruditu zenkizkidake** (zuek)
    - ahaztu: **ahaztu zenkidake** (zu), **ahaztu genkizkidake** (gu), **ahaztu zenkizkidake** (zuek)
- `potential-alegiazkoa-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - ➕ **Adds persons ni** to the already-known Potential, hypothetical (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatu nenkizuke** (ni)
    - iruditu: **iruditu nenkizuke** (ni)
    - ahaztu: **ahaztu nenkizuke** (ni)
- `potential-alegiazkoa-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-alegiazkoa-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-alegiazkoa-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-alegiazkoa-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-lehenaldia-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - 🆕 **New grammar pattern:** Potential, past (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatu zenkidakeen** (zu), **gustatu genkizkidakeen** (gu), **gustatu zenkizkidakeen** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Potential, past (NOR axis)
    - gustatu: **gustatu zenkidakeen** (zu), **gustatu genkizkidakeen** (gu), **gustatu zenkizkidakeen** (zuek)
    - iruditu: **iruditu zenkidakeen** (zu), **iruditu genkizkidakeen** (gu), **iruditu zenkizkidakeen** (zuek)
    - ahaztu: **ahaztu zenkidakeen** (zu), **ahaztu genkizkidakeen** (gu), **ahaztu zenkizkidakeen** (zuek)
- `potential-lehenaldia-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - ➕ **Adds persons ni** to the already-known Potential, past (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatu nenkizukeen** (ni)
    - iruditu: **iruditu nenkizukeen** (ni)
    - ahaztu: **ahaztu nenkizukeen** (ni)
- `potential-lehenaldia-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-lehenaldia-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-lehenaldia-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `potential-lehenaldia-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-34-ditransitive-review` — **Review**: 12 verbs pooled — Potential (Ahalera)
  - 🆕 **New grammar pattern:** Potential (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **diezazkioket** (ni), **diezazkiokezu** (zu), **diezazkioke** (hura), **diezazkiokegu** (gu), **diezazkiokezue** (zuek), **diezazkiokete** (haiek)
  - 🆕 **New grammar pattern:** Potential, past (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **niezazkiokeen** (ni), **zeniezazkiokeen** (zu), **ziezazkiokeen** (hura), **geniezazkiokeen** (gu), **zeniezazkioketen** (zuek), **ziezazkioketen** (haiek)
  - 🆕 **New grammar pattern:** Potential, hypothetical (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **niezazkioke** (ni), **zeniezazkioke** (zu), **liezazkioke** (hura), **geniezazkioke** (gu), **zeniezazkiokete** (zuek), **liezazkiokete** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential (Ahalera)
    - esan: **diezaioket** (ni), **diezaiokezu** (zu), **diezaioke** (hura), **diezaiokegu** (gu), **diezaiokezue** (zuek), **diezaiokete** (haiek)
    - eman: **diezazuket** (zu), **diezaioket** (hura), **diezazueket** (zuek), **diezaieket** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential, past
    - esan: **niezaiokeen** (ni), **zeniezaiokeen** (zu), **ziezaiokeen** (hura), **geniezaiokeen** (gu), **zeniezaioketen** (zuek), **ziezaioketen** (haiek)
    - eman: **niezazukeen** (zu), **niezaiokeen** (hura), **niezazuekeen** (zuek), **niezaiekeen** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential, hypothetical
    - esan: **niezaioke** (ni), **zeniezaioke** (zu), **liezaioke** (hura), **geniezaioke** (gu), **zeniezaiokete** (zuek), **liezaiokete** (haiek)
    - eman: **niezazuke** (zu), **niezaioke** (hura), **niezazueke** (zuek), **niezaieke** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential (plural)
    - esan: **diezazkioket** (ni), **diezazkiokezu** (zu), **diezazkioke** (hura), **diezazkiokegu** (gu), **diezazkiokezue** (zuek), **diezazkiokete** (haiek)
    - eman: **diezazkizuket** (zu), **diezazkioket** (hura), **diezazkizueket** (zuek), **diezazkieket** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential, past (plural)
    - esan: **niezazkiokeen** (ni), **zeniezazkiokeen** (zu), **ziezazkiokeen** (hura), **geniezazkiokeen** (gu), **zeniezazkioketen** (zuek), **ziezazkioketen** (haiek)
    - eman: **niezazkizukeen** (zu), **niezazkiokeen** (hura), **niezazkizuekeen** (zuek), **niezazkiekeen** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Potential, hypothetical (plural)
    - esan: **niezazkioke** (ni), **zeniezazkioke** (zu), **liezazkioke** (hura), **geniezazkioke** (gu), **zeniezazkiokete** (zuek), **liezazkiokete** (haiek)
    - eman: **niezazkizuke** (zu), **niezazkioke** (hura), **niezazkizueke** (zuek), **niezazkieke** (haiek)

#### Unit 50 — Conditionals — The Axes in Depth (Bonus)

**What you learn:** ukan's NOR-NORK object axis, the NOR-NORI dative axis, and esan/eman's ditransitive — across Baldintza and Ondorioa present/past, recognition-pooled. The deep-practice half of Unit 24 (Baldintza).

**Example:** "If you loved me…" / "I would like him."

**Lessons:**

- `ukan-baldintza-object-axis` — ukan ("to have") — Conditional-if (object axis) [hura/zu/zuek/haiek]
  - Forms: **banu** (hura), **bazintut** (zu), **bazintuztet** (zuek), **banitu** (haiek)
  - 🆕 **New grammar pattern:** Conditional-if (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-if (object axis)
- `ukan-conditional-object-axis` — ukan ("to have") — Conditional-would (object axis) [hura/zu/zuek/haiek]
  - Forms: **nuke** (hura), **zintuket** (zu), **zintuzketet** (zuek), **nituzke** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-would (object axis)
- `ukan-conditional-past-object-axis` — ukan ("to have") — Conditional-would, past (object axis) [hura/zu/zuek/haiek]
  - Forms: **nukeen** (hura), **zintukedan** (zu), **zintuzketedan** (zuek), **nituzkeen** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would, past (object axis) — first appearance of this conjugation pattern (hura/zu/zuek/haiek)
  - ✅ **Taught this tense for the first time:** ukan — Conditional-would, past (object axis)
- `unit-35-object-axis-review` — **Review** [hura/zu/zuek/haiek]: ukan (Conditional-if (object axis)), ukan (Conditional-would (object axis)), ukan (Conditional-would, past (object axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-baldintza-object-axis-hura` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **banindu** (ni), **balu** (hura), **bagintu** (gu), **bazintu** (zu), **bazintuzte** (zuek), **balitu** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Conditional-if (object axis) table: ukan
- `ukan-conditional-object-axis-hura` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **ninduke** (ni), **luke** (hura), **gintuke** (gu), **zintuke** (zu), **zintuzkete** (zuek), **lituzke** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Conditional-would (object axis) table: ukan
- `ukan-conditional-past-object-axis-hura` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nindukeen** (ni), **zukeen** (hura), **gintukeen** (gu), **zintukeen** (zu), **zintuzketen** (zuek), **zituzkeen** (haiek)
  - ➕ **Adds persons ni/gu** to the already-known Conditional-would, past (object axis) table: ukan
- `ukan-baldintza-object-axis-gu` — ukan ("to have") — Conditional-if (object axis) [hura/zu/zuek/haiek]
  - Forms: **bagenu** (hura), **bazintugu** (zu), **bazintuztegu** (zuek), **bagenitu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-object-axis-gu` — ukan ("to have") — Conditional-would (object axis) [hura/zu/zuek/haiek]
  - Forms: **genuke** (hura), **zintukegu** (zu), **zintuzketegu** (zuek), **genituzke** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-past-object-axis-gu` — ukan ("to have") — Conditional-would, past (object axis) [hura/zu/zuek/haiek]
  - Forms: **genukeen** (hura), **zintukegun** (zu), **zintuzketegun** (zuek), **genituzkeen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-baldintza-object-axis-zu` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/haiek]
  - Forms: **baninduzu** (ni), **bazenu** (hura), **bagintuzu** (gu), **bazenitu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-object-axis-zu` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/haiek]
  - Forms: **nindukezu** (ni), **zenuke** (hura), **gintukezu** (gu), **zenituzke** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-past-object-axis-zu` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/haiek]
  - Forms: **nindukezun** (ni), **zenukeen** (hura), **gintukezun** (gu), **zenituzkeen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-baldintza-object-axis-zuek` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/haiek]
  - Forms: **baninduzue** (ni), **bazenute** (hura), **bagintuzue** (gu), **bazenituzte** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-object-axis-zuek` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/haiek]
  - Forms: **nindukezue** (ni), **zenukete** (hura), **gintukezue** (gu), **zenituzkete** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-past-object-axis-zuek` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/haiek]
  - Forms: **nindukezuen** (ni), **zenuketen** (hura), **gintukezuen** (gu), **zenituzketen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-baldintza-object-axis-haiek` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **banindute** (ni), **balute** (hura), **bagintuzte** (gu), **bazintuzte** (zu), **bazintuztete** (zuek), **balituzte** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-object-axis-haiek` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **nindukete** (ni), **lukete** (hura), **gintuzkete** (gu), **zintuzkete** (zu), **zintuzketete** (zuek), **lituzkete** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ukan-conditional-past-object-axis-haiek` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/zu/zuek/haiek]
  - Forms: **ninduketen** (ni), **zuketen** (hura), **gintuzketen** (gu), **zintuzketen** (zu), **zintuzketeten** (zuek), **zituzketen** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `baldintza-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - 🆕 **New grammar pattern:** Conditional-if (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatuko bazintzait** (zu), **gustatuko bagintzaizkit** (gu), **gustatuko bazintzaizkit** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Conditional-if (NOR axis)
    - gustatu: **gustatuko bazintzait** (zu), **gustatuko bagintzaizkit** (gu), **gustatuko bazintzaizkit** (zuek)
    - iruditu: **irudituko bazintzait** (zu), **irudituko bagintzaizkit** (gu), **irudituko bazintzaizkit** (zuek)
    - ahaztu: **ahaztuko bazintzait** (zu), **ahaztuko bagintzaizkit** (gu), **ahaztuko bazintzaizkit** (zuek)
- `baldintza-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - ➕ **Adds persons ni** to the already-known Conditional-if (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatuko banintzaizu** (ni)
    - iruditu: **irudituko banintzaizu** (ni)
    - ahaztu: **ahaztuko banintzaizu** (ni)
- `baldintza-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `baldintza-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `baldintza-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `baldintza-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - 🆕 **New grammar pattern:** Conditional-would (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatuko zintzaidake** (zu), **gustatuko gintzaizkidake** (gu), **gustatuko zintzaizkidake** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Conditional-would (NOR axis)
    - gustatu: **gustatuko zintzaidake** (zu), **gustatuko gintzaizkidake** (gu), **gustatuko zintzaizkidake** (zuek)
    - iruditu: **irudituko zintzaidake** (zu), **irudituko gintzaizkidake** (gu), **irudituko zintzaizkidake** (zuek)
    - ahaztu: **ahaztuko zintzaidake** (zu), **ahaztuko gintzaizkidake** (gu), **ahaztuko zintzaizkidake** (zuek)
- `conditional-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - ➕ **Adds persons ni** to the already-known Conditional-would (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatuko nintzaizuke** (ni)
    - iruditu: **irudituko nintzaizuke** (ni)
    - ahaztu: **ahaztuko nintzaizuke** (ni)
- `conditional-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-past-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - 🆕 **New grammar pattern:** Conditional-would, past (NOR axis) — first appearance of this conjugation pattern (zu/gu/zuek), e.g. **gustatuko zintzaidakeen** (zu), **gustatuko gintzaizkidakeen** (gu), **gustatuko zintzaizkidakeen** (zuek)
  - ✅ **Taught this tense for the first time:** gustatu, iruditu, ahaztu, jarraitu — Conditional-would, past (NOR axis)
    - gustatu: **gustatuko zintzaidakeen** (zu), **gustatuko gintzaizkidakeen** (gu), **gustatuko zintzaizkidakeen** (zuek)
    - iruditu: **irudituko zintzaidakeen** (zu), **irudituko gintzaizkidakeen** (gu), **irudituko zintzaizkidakeen** (zuek)
    - ahaztu: **ahaztuko zintzaidakeen** (zu), **ahaztuko gintzaizkidakeen** (gu), **ahaztuko zintzaizkidakeen** (zuek)
- `conditional-past-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - ➕ **Adds persons ni** to the already-known Conditional-would, past (NOR axis) table: gustatu, iruditu, ahaztu, jarraitu
    - gustatu: **gustatuko nintzaizukeen** (ni)
    - iruditu: **irudituko nintzaizukeen** (ni)
    - ahaztu: **ahaztuko nintzaizukeen** (ni)
- `conditional-past-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-past-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-past-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `conditional-past-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `unit-35-ditransitive-review` — **Review**: 12 verbs pooled — Conditional-if (Baldintza)
  - 🆕 **New grammar pattern:** Conditional-if (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **banizkio** (ni), **bazenizkio** (zu), **balizkio** (hura), **bagenizkio** (gu), **bazenizkiote** (zuek), **balizkiote** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **nizkioke** (ni), **zenizkioke** (zu), **lizkioke** (hura), **genizkioke** (gu), **zenizkiokete** (zuek), **lizkiokete** (haiek)
  - 🆕 **New grammar pattern:** Conditional-would, past (plural) — first appearance of this conjugation pattern (ni/zu/hura/gu/zuek/haiek), e.g. **nizkiokeen** (ni), **zenizkiokeen** (zu), **zizkiokeen** (hura), **genizkiokeen** (gu), **zenizkioketen** (zuek), **zizkioketen** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-if (Baldintza)
    - esan: **banio** (ni), **bazenio** (zu), **balio** (hura), **bagenio** (gu), **bazeniote** (zuek), **baliote** (haiek)
    - eman: **banizu** (zu), **banio** (hura), **banizue** (zuek), **banie** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-would (Ondorioa)
    - esan: **nioke** (ni), **zenioke** (zu), **lioke** (hura), **genioke** (gu), **zeniokete** (zuek), **liokete** (haiek)
    - eman: **nizuke** (zu), **nioke** (hura), **nizueke** (zuek), **nieke** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-would, past
    - esan: **niokeen** (ni), **zeniokeen** (zu), **ziokeen** (hura), **geniokeen** (gu), **zenioketen** (zuek), **zioketen** (haiek)
    - eman: **nizukeen** (zu), **niokeen** (hura), **nizuekeen** (zuek), **niekeen** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-if (plural)
    - esan: **banizkio** (ni), **bazenizkio** (zu), **balizkio** (hura), **bagenizkio** (gu), **bazenizkiote** (zuek), **balizkiote** (haiek)
    - eman: **banizkizu** (zu), **banizkio** (hura), **banizkizue** (zuek), **banizkie** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-would (plural)
    - esan: **nizkioke** (ni), **zenizkioke** (zu), **lizkioke** (hura), **genizkioke** (gu), **zenizkiokete** (zuek), **lizkiokete** (haiek)
    - eman: **nizkizuke** (zu), **nizkioke** (hura), **nizkizueke** (zuek), **nizkieke** (haiek)
  - ✅ **Taught this tense for the first time:** esan, eman — Conditional-would, past (plural)
    - esan: **nizkiokeen** (ni), **zenizkiokeen** (zu), **zizkiokeen** (hura), **genizkiokeen** (gu), **zenizkioketen** (zuek), **zizkioketen** (haiek)
    - eman: **nizkizukeen** (zu), **nizkiokeen** (hura), **nizkizuekeen** (zuek), **nizkiekeen** (haiek)

#### Unit 51 — Commands — The Axes in Depth (Bonus)

**What you learn:** gustatu/iruditu/ahaztu/jarraitu's NOR-NORI dative-axis imperative (bekio/zakio-type) across every dative value, recognition-pooled. The deep-practice half of Unit 25 (Agintera).

**Example:** "Let it appeal to me!" (bekit)

**Lessons:**

- `gustatu-imperative-axis` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zuek/haiek]
  - Forms: **gustatu bekizu** (hura), **gustatu zakizkizu** (zuek), **gustatu bekizkizu** (haiek)
  - 🆕 **New grammar pattern:** Imperative (NOR axis) — first appearance of this conjugation pattern (hura/zuek/haiek)
  - ✅ **Taught this tense for the first time:** gustatu — Imperative (NOR axis)
- `iruditu-imperative-axis` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zuek/haiek]
  - Forms: **iruditu bekizu** (hura), **iruditu zakizkizu** (zuek), **iruditu bekizkizu** (haiek)
  - ✅ **Taught this tense for the first time:** iruditu — Imperative (NOR axis)
- `ahaztu-imperative-axis` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zuek/haiek]
  - Forms: **ahaztu bekizu** (hura), **ahaztu zakizkizu** (zuek), **ahaztu bekizkizu** (haiek)
  - ✅ **Taught this tense for the first time:** ahaztu — Imperative (NOR axis)
- `gustatu-imperative-axis-ni` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **gustatu bekit** (hura), **gustatu zakit** (zu), **gustatu zakizkit** (zuek), **gustatu bekizkit** (haiek)
  - ➕ **Adds persons zu** to the already-known Imperative (NOR axis) table: gustatu
- `gustatu-imperative-axis-hura` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **gustatu bekio** (hura), **gustatu zakio** (zu), **gustatu zakizkio** (zuek), **gustatu bekizkio** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `gustatu-imperative-axis-gu` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **gustatu bekigu** (hura), **gustatu zakigu** (zu), **gustatu zakizkigu** (zuek), **gustatu bekizkigu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `gustatu-imperative-axis-zuek` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/haiek]
  - Forms: **gustatu bekizue** (hura), **gustatu zakizue** (zu), **gustatu bekizkizue** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `gustatu-imperative-axis-haiek` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **gustatu bekie** (hura), **gustatu zakie** (zu), **gustatu zakizkie** (zuek), **gustatu bekizkie** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `iruditu-imperative-axis-ni` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **iruditu bekit** (hura), **iruditu zakit** (zu), **iruditu zakizkit** (zuek), **iruditu bekizkit** (haiek)
  - ➕ **Adds persons zu** to the already-known Imperative (NOR axis) table: iruditu
- `iruditu-imperative-axis-hura` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **iruditu bekio** (hura), **iruditu zakio** (zu), **iruditu zakizkio** (zuek), **iruditu bekizkio** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `iruditu-imperative-axis-gu` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **iruditu bekigu** (hura), **iruditu zakigu** (zu), **iruditu zakizkigu** (zuek), **iruditu bekizkigu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `iruditu-imperative-axis-zuek` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/haiek]
  - Forms: **iruditu bekizue** (hura), **iruditu zakizue** (zu), **iruditu bekizkizue** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `iruditu-imperative-axis-haiek` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **iruditu bekie** (hura), **iruditu zakie** (zu), **iruditu zakizkie** (zuek), **iruditu bekizkie** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ahaztu-imperative-axis-ni` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **ahaztu bekit** (hura), **ahaztu zakit** (zu), **ahaztu zakizkit** (zuek), **ahaztu bekizkit** (haiek)
  - ➕ **Adds persons zu** to the already-known Imperative (NOR axis) table: ahaztu
- `ahaztu-imperative-axis-hura` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **ahaztu bekio** (hura), **ahaztu zakio** (zu), **ahaztu zakizkio** (zuek), **ahaztu bekizkio** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ahaztu-imperative-axis-gu` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **ahaztu bekigu** (hura), **ahaztu zakigu** (zu), **ahaztu zakizkigu** (zuek), **ahaztu bekizkigu** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ahaztu-imperative-axis-zuek` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/haiek]
  - Forms: **ahaztu bekizue** (hura), **ahaztu zakizue** (zu), **ahaztu bekizkizue** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `ahaztu-imperative-axis-haiek` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
  - Forms: **ahaztu bekie** (hura), **ahaztu zakie** (zu), **ahaztu zakizkie** (zuek), **ahaztu bekizkie** (haiek)
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `imperative-axis-review-zu` — **Review** [hura/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - ✅ **Taught this tense for the first time:** jarraitu — Imperative (NOR axis)
    - jarraitu: **jarraitu bekizu** (hura), **jarraitu zakizkizu** (zuek), **jarraitu bekizkizu** (haiek)
- `imperative-axis-review-ni` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - ➕ **Adds persons zu** to the already-known Imperative (NOR axis) table: jarraitu
    - jarraitu: **jarraitu zakit** (zu)
- `imperative-axis-review-hura` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `imperative-axis-review-gu` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `imperative-axis-review-zuek` — **Review** [hura/zu/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._
- `imperative-axis-review-haiek` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
  - _Review/practice only — no new conjugation forms; reinforces what earlier lessons already introduced._

