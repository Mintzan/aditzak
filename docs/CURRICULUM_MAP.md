# Aditzak — Curriculum Map (Units, Lessons & New Conjugations)

**Status: reference.** This document exists so it's possible to see, at a glance, everything the app currently teaches (or plans to teach) — every unit, every lesson inside it, and which verb/tense combination it drills — without having to read `journey.js`/`lessons.js` directly.

It is a companion to `docs/LEARNING_JOURNEY.md`, which is now the *design-rationale* document (why units are ordered/scoped the way they are, what pedagogical principles drove each decision, what data/engine work each unit required). This document only answers "what is unit N, and what does lesson X teach?" — split out because the two questions ("why is it built this way" vs. "what does it contain") were getting tangled together in one 600+ line file.

**How to read a lesson line:**
- `verb ("meaning") — Tense [persons]` — a **practice** lesson: one verb, one tense, drilling the grammatical persons listed (omitted = full `ni/zu/hura/gu/zuek/haiek` grid).
- `**Pooled practice**: verb (Tense), verb (Tense), …` — one lesson mixing several verbs that share the same pattern (distractors drawn across all of them).
- `**Review**: …` — a harder, no-hand-holding consolidation lesson at the end of a unit (or a cross-unit Refresh Gate), covering everything the unit/pool just introduced.
- `N verbs pooled — Tense` — a review/pool wide enough (7+ verbs) that listing every verb by name would be unreadable; see `docs/DECISIONS.md` for why large pools collapse to a count in the UI too.
- 🛡️ = Refresh Gate (zero new verbs, pure consolidation — some are score-gated, see `LEARNING_JOURNEY.md`). ✨ = Bonus (opt-in, never blocks the main spine). ⏳ = not implemented yet.

This is generated from live data (`src/journey.js` + `src/data/lessons.js`), so unit numbers, lesson ids, and verb/tense pairings are guaranteed to match what's actually in the app. If you regenerate it, `src/journey.test.js` (run via `npm test`) is the check that every lesson id here is real and every real lesson id is listed somewhere.

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

## Units & lessons, in full

## Phase I · A1 — Survive — Survival Present (Me, You, & It)

### Stage 1 — Being, Having & the Ergative Leap

#### Unit 1 — izan & egon — Who and Where

**What you learn:** izan + egon, present tense

**Example:** "I am a student."

**Lessons:**

- `izan-present` — izan ("to be") — Present [ni/zu/hura]
- `egon-present` — egon ("to be (located / in a state)") — Present [ni/zu/hura]
- `unit-1-review` — **Review** [ni/zu/hura]: izan (Present), egon (Present)

#### Unit 2 — ukan — The Ergative Leap

**What you learn:** ukan present (object fixed to hura), taught alone — ni/zu/hura

**Example:** "I have a car." (Nik auto bat dut.)

**Lessons:**

- `ukan-present` — ukan ("to have") — Present [ni/zu/hura]
- `ukan-ni-nik-shift-review` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
- `unit-2-review` — **Review** [ni/zu/hura]: ukan (Present)

#### Unit 3 — "Ni" vs. "Nik" — The Case-Marking Checkpoint

**What you learn:** zero new verbs — bare izan/egon subjects vs. ergative ukan subjects, ni/zu/hura

**Example:** "Ni ikaslea naiz" vs. "Nik liburua dut."

**Lessons:**

- `case-marking-sort-review` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
- `case-marking-drift-review` — **Review** [ni/zu/hura]: egon (Present), ukan (Present)
- `case-marking-checkpoint-review` — **Review** [ni/zu/hura]: izan (Present), egon (Present), ukan (Present)

#### Unit 4 — jakin & nahi — Knowing & Wanting

**What you learn:** jakin (synthetic, same ergative suffixes as ukan) + nahi + ukan

**Example:** "I don't know." (Ez dakit.)

**Lessons:**

- `jakin-present` — jakin ("to know (a fact)") — Present [ni/zu/hura]
- `nahi-present` — nahi izan ("to want") — Present [ni/zu/hura]
- `jakin-suffix-family-review` — **Review** [ni/zu/hura]: jakin (Present), ukan (Present)
- `knowing-wanting-review` — **Review** [ni/zu/hura]: jakin (Present), nahi izan (Present), ukan (Present)

### Stage 2 — Seeing & Moving

#### Unit 5 — ikusi — First Periphrastic Verb (-tzen dut)

**What you learn:** ikusi present (ni/zu/hura) — Phase I's first periphrastic verb

**Example:** "I see the mountain."

**Lessons:**

- `ikusi-present` — ikusi ("to see") — Present [ni/zu/hura]
- `ikusi-present-review` — **Review** [ni/zu/hura]: ikusi (Present)

#### Unit 6 — joan/etorri/ibili — The NOR Present

**What you learn:** joan + etorri + ibili, present tense

**Example:** "I'm going to the beach."

**Lessons:**

- `joan-present` — joan ("to go") — Present [ni/zu/hura]
- `etorri-present` — etorri ("to come") — Present [ni/zu/hura]
- `ibili-present` — ibili ("to walk around / be doing") — Present [ni/zu/hura]
- `unit-3-review` — **Review** [ni/zu/hura]: joan (Present), etorri (Present), ibili (Present)
- `nor-fodder-present` — **Pooled practice** [ni/zu/hura]: 7 verbs pooled — Present
- `nor-fodder-present-plural` — **Pooled practice** [gu/zuek/haiek]: 7 verbs pooled — Present

#### Unit 7 — Expansion: Absolutive Plurals (🛡️ Refresh Gate)

**What you learn:** Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri, and ikusi — zero new verbs

**Example:** "We are teachers." (Irakasleak gara)

**Lessons:**

- `unit-6-review-1` — **Review** [gu/zuek/haiek]: izan (Present), ukan (Present)
- `unit-6-review-2` — **Review** [gu/zuek/haiek]: egon (Present), joan (Present)
- `unit-6-review-3` — **Review** [gu/zuek/haiek]: etorri (Present)

#### Unit 8 — Expansion: Ergative Plurals

**What you learn:** ukan + ikusi — adds gu/zuek/haiek to the ergative ("nor-nork") paradigm, framed as "the plural moved — now it's a suffix"

**Example:** "We have a car." (Auto bat dugu)

**Lessons:**

- `ukan-present-plural` — ukan ("to have") — Present [gu/zuek/haiek]
- `ikusi-present-plural` — ikusi ("to see") — Present [gu/zuek/haiek]
- `ikusi-present-plural-review` — **Review** [gu/zuek/haiek]: ikusi (Present)
- `unit-8-ergative-review` — **Review** [gu/zuek/haiek]: ukan (Present), ikusi (Present)

#### Unit 9 — ari + izan — The Immediate Continuous

**What you learn:** ari + izan

**Example:** "What are you doing?" (Zer egiten ari zara?)

**Lessons:**

- `ari-present` — ari izan ("to be busy (doing something)") — Present
- `unit-4-review` — **Review**: ari izan (Present)

### Refresh Gate A — The "Ez" Trap

#### Unit 10 — REFRESH — The Inversion Matrix (🛡️ Refresh Gate)

**What you learn:** Negation drills across Units 1–9 — zero new verbs

**Lessons:**

- `unit-5-review-1` — **Review** [ni/zu/hura]: izan (Present), ukan (Present)
- `unit-5-review-2` — **Review** [ni/zu/hura]: egon (Present), joan (Present)
- `unit-5-review-3` — **Review** [ni/zu/hura]: jakin (Present), etorri (Present)


## Phase II · A2 — Everyday Life — Transitivity & Everyday Life

### Stage 3 — Looking Back I

#### Unit 11 — The Present Perfect (Lehenaldiko Burutua) — What Just Happened

**What you learn:** Lehenaldiko Burutua — perfective participle + present auxiliary (etorri naiz / ikusi dut), taught on a known core (izan/etorri + ikusi); the recency contrast gaur ... da vs. atzo ... zen

**Example:** "I have come / I came today." (Gaur etorri naiz)

**Lessons:**

- `izan-present-perfect-pool` — **Pooled practice** [ni/zu/hura]: izan (Present perfect), joan (Present perfect), etorri (Present perfect)
- `izan-present-perfect-pool-plural` — **Pooled practice** [gu/zuek/haiek]: izan (Present perfect), joan (Present perfect), etorri (Present perfect)
- `ikusi-present-perfect` — ikusi ("to see") — Present perfect [ni/zu/hura]
- `ikusi-present-perfect-plural` — ikusi ("to see") — Present perfect [gu/zuek/haiek]
- `unit-11-review` — **Review** [ni/zu/hura]: izan (Present perfect), etorri (Present perfect), ikusi (Present perfect)

#### Unit 12 — The "izan" Past Pool — Looking Back I

**What you learn:** the izan past auxiliary (nintzen/zinen/zen/ginen/zineten/ziren), mixed across izan, joan, etorri, ibili

**Example:** "I was young."

**Lessons:**

- `izan-past-pool` — **Pooled practice** [ni/zu/hura]: 11 verbs pooled — Past
- `izan-past-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 11 verbs pooled — Past

### Stage 4 — Daily Actions

#### Unit 13 — The NOR-NORK Present — dut/duzu/du

**What you learn:** the ukan present auxiliary (dut/duzu/du/dugu/duzue/dute), mixed across jan, edan, erosi, ikusi, hartu — first -tzen/-ten minimal pair (jaten vs. hartzen); plus the NOR-number axis (dut vs. ditut) across ukan, jan, edan, erosi, hartu, ikusi, eduki

**Example:** "I ate."

**Lessons:**

- `unit-10-present` — **Pooled practice** [ni/zu/hura]: 52 verbs pooled — Present
- `unit-10-present-plural` — **Pooled practice** [gu/zuek/haiek]: 52 verbs pooled — Present
- `nor-nork-present-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Present (plural)
- `nor-nork-present-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Present (plural)

#### Unit 14 — gustatu — "I Like It" (NOR-NORI Present)

**What you learn:** present NOR-NORI (zait/zaizu/zaio/zaigu/zaizue/zaie) — gustatu/iruditu/ahaztu, plus their plural-NOR (zaizkit) number split; a case-frame buffer and a pooled mixer review widening past the three founding verbs to jarraitu/jario

**Example:** "I like this." (Hau gustatzen zait)

**Lessons:**

- `gustatu-present` — gustatu ("to like / please") — Present
- `iruditu-present` — iruditu ("to seem (to someone)") — Present
- `ahaztu-present` — ahaztu ("to forget") — Present
- `gustatu-present-plural` — gustatu ("to like / please") — Present (plural)
- `iruditu-present-plural` — iruditu ("to seem (to someone)") — Present (plural)
- `ahaztu-present-plural` — ahaztu ("to forget") — Present (plural)
- `unit-23-number-split-review` — **Review**: gustatu (Present), gustatu (Present (plural)), iruditu (Present), iruditu (Present (plural)), ahaztu (Present), ahaztu (Present (plural))
- `unit-23-case-frame-buffer` — **Review**: gustatu (Present), iruditu (Present), ahaztu (Present)
- `nor-nori-present-pool` — **Review**: gustatu (Present), iruditu (Present), ahaztu (Present), jarraitu (Present), jario (Present), etorri (Present (NORI axis))

#### Unit 15 — The NOR-NORK Past — nuen/zenuen/zuen

**What you learn:** the ukan past auxiliary (nuen/zenuen/zuen/genuen/zenuten/zuten), mixed across ukan, jan, edan, erosi, ikusi, jakin; plus the NOR-number axis in the past (zenuen vs. zenituen) across ukan, jan, edan, erosi, hartu, ikusi, eduki

**Example:** "I had a car."

**Lessons:**

- `ukan-past-pool` — **Pooled practice** [ni/zu/hura]: 53 verbs pooled — Past
- `ukan-past-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 53 verbs pooled — Past
- `nor-nork-past-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Past (plural)
- `nor-nork-past-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Past (plural)

#### Unit 16 — maite izan — Loving Someone (The Non-3rd-Person Object)

**What you learn:** ukan/maite/ikusi/jan/edan/erosi/hartu's presentByObject/pastByObject tables (#346/#347/#348/#378/#379) — the object (NOR) shifts off the default hura to ni/zu/zuek/haiek, with nork fixed at ni, plus a pooled review (#380/#381) drawing distractors across all seven verbs; #416/#435 then drill the reverse direction (someone/something acting on me/us/you) by fixing nork at hura/gu/zu/zuek/haiek in turn, rotating the practice verb across the full seven-verb set and adding a pooled review per NORK value; #443 widens every pooled review's verb pool to ~37 periphrastic transitive verbs

**Example:** "I love you." (Maite zaitut.) / "It surprised me." (Harritu nau.)

**Lessons:**

- `ukan-object-axis-present` — ukan ("to have") — Present (object axis) [hura/zu/zuek/haiek]
- `maite-object-axis-present` — maite izan ("to love") — Present (object axis) [hura/zu/zuek/haiek]
- `ukan-object-axis-past` — ukan ("to have") — Past (object axis) [hura/zu/zuek/haiek]
- `maite-object-axis-past` — maite izan ("to love") — Past (object axis) [hura/zu/zuek/haiek]
- `object-axis-present-review` — **Review** [hura/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review` — **Review** [hura/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)

#### Unit 17 — eraman/ekarri — More NOR-NORK Synthetics

**What you learn:** eraman ("to carry/take") + ekarri ("to bring") — nor-nork synthetic verbs in the already-taught eduki/jakin shape, present + past

**Example:** Nik nire txakurra daramat mendira.

**Lessons:**

- `eraman-present` — eraman ("to carry / take (something somewhere)") — Present [ni/zu/hura]
- `eraman-present-plural` — eraman ("to carry / take (something somewhere)") — Present [gu/zuek/haiek]
- `ekarri-present` — ekarri ("to bring") — Present [ni/zu/hura]
- `ekarri-present-plural` — ekarri ("to bring") — Present [gu/zuek/haiek]
- `eraman-past` — eraman ("to carry / take (something somewhere)") — Past [ni/zu/hura]
- `eraman-past-plural` — eraman ("to carry / take (something somewhere)") — Past [gu/zuek/haiek]
- `ekarri-past` — ekarri ("to bring") — Past [ni/zu/hura]
- `ekarri-past-plural` — ekarri ("to bring") — Past [gu/zuek/haiek]
- `unit-42-review` — **Review** [ni/zu/hura]: eraman (Present), ekarri (Present), eraman (Past), ekarri (Past)
- `unit-42-review-plural` — **Review** [gu/zuek/haiek]: eraman (Present), ekarri (Present), eraman (Past), ekarri (Past)

### Stage 5 — Possessions & Looking Back II

#### Unit 18 — eduki — Physical States & Possessions

**What you learn:** eduki — full 6-person grid; ibili gains gu/zuek/haiek (present introduced in Unit 6)

**Example:** "I have the keys in my pocket."

**Lessons:**

- `eduki-present` — eduki ("to have / hold (physically)") — Present [ni/zu/hura]
- `eduki-present-plural` — eduki ("to have / hold (physically)") — Present [gu/zuek/haiek]
- `ibili-present-plural` — ibili ("to walk around / be doing") — Present [gu/zuek/haiek]
- `unit-8-review` — **Review** [ni/zu/hura]: eduki (Present)
- `unit-8-review-plural` — **Review** [gu/zuek/haiek]: eduki (Present), ibili (Present)

#### Unit 19 — eduki — "I Had It" (Simple Past)

**What you learn:** eduki — simple past, its own synthetic paradigm (neukan, zeneukan, zeukan, geneukan, zeneukaten, zeukaten)

**Example:** "I had the keys."

**Lessons:**

- `eduki-past` — eduki ("to have / hold (physically)") — Past [ni/zu/hura]
- `eduki-past-review` — **Review** [ni/zu/hura]: eduki (Past)
- `eduki-past-plural` — eduki ("to have / hold (physically)") — Past [gu/zuek/haiek]
- `eduki-past-plural-review` — **Review** [gu/zuek/haiek]: eduki (Past)

#### Unit 20 — egon — "I Was There" (Simple Past)

**What you learn:** egon — simple past, its own synthetic paradigm (nengoen, zeunden, zegoen, geunden, zeundeten, zeuden); #440 folds in ados egon's present + past (same paradigm, invariant particle glued on) since Unit 30 was dissolved

**Example:** "I was at home."

**Lessons:**

- `ados-egon-present` — ados egon ("to agree / to be in agreement") — Present [ni/zu/hura]
- `ados-egon-present-plural` — ados egon ("to agree / to be in agreement") — Present [gu/zuek/haiek]
- `egon-past` — egon ("to be (located / in a state)") — Past [ni/zu/hura]
- `ados-egon-past` — ados egon ("to agree / to be in agreement") — Past [ni/zu/hura]
- `egon-past-review` — **Review** [ni/zu/hura]: egon (Past), ados egon (Past)
- `egon-past-plural` — egon ("to be (located / in a state)") — Past [gu/zuek/haiek]
- `ados-egon-past-plural` — ados egon ("to agree / to be in agreement") — Past [gu/zuek/haiek]
- `egon-past-plural-review` — **Review** [gu/zuek/haiek]: egon (Past), ados egon (Past)

### Stage 6 — The Future (Geroa)

#### Unit 21 — izan/ukan — The Future Rule, Across Every Verb

**What you learn:** forming the future with -ko/-go + present auxiliaries — first -ko/-go minimal pair (izango vs. etorriko), ukan called out as the one suppletive exception (izango, not "ukango"); #417 adds the NOR-number axis (izango dut vs. izango ditut); #423 pools the rule across every fodder verb's future table plus a dedicated -ko/-go suffix-choice question

**Example:** "I will be a teacher" (irakasle izango naiz)

**Lessons:**

- `izan-future` — izan ("to be") — Future [ni/zu/hura]
- `izan-future-plural` — izan ("to be") — Future [gu/zuek/haiek]
- `ukan-future` — ukan ("to have") — Future [ni/zu/hura]
- `ukan-future-plural` — ukan ("to have") — Future [gu/zuek/haiek]
- `future-intro-review` — **Review** [ni/zu/hura]: izan (Future), ukan (Future), joan (Future), etorri (Future)
- `future-intro-review-plural` — **Review** [gu/zuek/haiek]: izan (Future), ukan (Future), joan (Future), etorri (Future)
- `nor-nork-future-plural-pool` — **Pooled practice** [ni/zu/hura]: 18 verbs pooled — Future (plural)
- `nor-nork-future-plural-pool-plural` — **Pooled practice** [gu/zuek/haiek]: 18 verbs pooled — Future (plural)
- `future-mixer-pool` — **Review** [ni/zu/hura]: 69 verbs pooled — Future
- `future-mixer-pool-plural` — **Review** [gu/zuek/haiek]: 67 verbs pooled — Future

#### Unit 22 — behar — Requirements & Obligations

**What you learn:** behar + ukan, present and future

**Example:** "I have to go." (Joan behar dut)

**Lessons:**

- `behar-present` — behar izan ("to need to / have to") — Present
- `behar-future` — behar izan ("to need to / have to") — Future
- `unit-19-review` — **Review**: behar izan (Present), behar izan (Future), ukan (Present), ukan (Future)

### Refresh Gate B — The Core Tense Checkpoint

#### Unit 23 — REFRESH — Cumulative Present/Past/Future Mixer (🛡️ Refresh Gate)

**What you learn:** Synthetic + periphrastic, positive + negative, present + past + future — zero new verbs, score-gated (bestStars >= 2 to continue)

**Lessons:**

- `unit-20-review-1` — **Review** [ni/zu/hura]: izan (Present), izan (Past), izan (Future), ukan (Present), ukan (Past), ukan (Future)
- `unit-20-review-2` — **Review** [ni/zu/hura]: joan (Present), joan (Past), joan (Future), ikusi (Present), ikusi (Past), ikusi (Future)
- `unit-20-review-3` — **Review** [gu/zuek/haiek]: izan (Present), izan (Past), izan (Future), ukan (Present), ukan (Past), ukan (Future)
- `unit-20-review-4` — **Review** [gu/zuek/haiek]: joan (Present), joan (Past), joan (Future), ikusi (Present), ikusi (Past), ikusi (Future)
- `unit-20-review-5` — **Review** [ni/zu/hura]: eduki (Present), ibili (Present), izan (Past), ukan (Past), jakin (Past)
- `unit-20-review-6` — **Review** [ni/zu/hura]: izan (Past), ukan (Future), joan (Present), ikusi (Past)


## Phase III · B1 — Into the Past — Shifting to the Past

### Stage 7 — Aspect in the Past

#### Unit 24 — The Imperfective Past — "I Used To..."

**What you learn:** imperfective/habitual past (etortzen nintzen, "I used to come / I was coming") — distinct from the simple past taught in Units 12/14/17/18

**Example:** "I used to come here every day."

**Lessons:**

- `etorri-habitual-past` — etorri ("to come") — Past (habitual) [ni/zu/hura]
- `etorri-habitual-past-plural` — etorri ("to come") — Past (habitual) [gu/zuek/haiek]
- `ikusi-habitual-past` — ikusi ("to see") — Past (habitual) [ni/zu/hura]
- `ikusi-habitual-past-plural` — ikusi ("to see") — Past (habitual) [gu/zuek/haiek]
- `unit-21-review` — **Review**: etorri (Past (habitual)), ikusi (Past (habitual))

#### Unit 25 — joan/etorri/ibili — Motion in Progress (Past)

**What you learn:** joan/etorri/ibili's native imperfective past forms (nindoan, zetorren)

**Example:** "I was on my way (when...)."

**Lessons:**

- `motion-imperfective-past-pool` — **Review** [ni/zu/hura]: joan (Past (imperfective, motion)), etorri (Past (imperfective, motion)), ibili (Past (imperfective, motion))
- `motion-imperfective-past-pool-plural` — **Review** [gu/zuek/haiek]: joan (Past (imperfective, motion)), etorri (Past (imperfective, motion)), ibili (Past (imperfective, motion))


## Phase IV · B1 — People & Relationships — Interpersonal & Relationship Dynamics

### Stage 8 — The Dative Shift (NOR-NORI)

#### Unit 26 — NOR-NORI Past & Future — Dative Across Time

**What you learn:** NOR-NORI past + future — recombines Unit 25's dative grid with the periphrastic past and -ko/-go future; ends with a pooled mixer review (#385), mirroring Unit 25's present pool

**Example:** "I liked it yesterday." (Atzo gustatu zitzaidan)

**Lessons:**

- `gustatu-past` — gustatu ("to like / please") — Past
- `gustatu-future` — gustatu ("to like / please") — Future
- `iruditu-past` — iruditu ("to seem (to someone)") — Past
- `iruditu-future` — iruditu ("to seem (to someone)") — Future
- `ahaztu-past` — ahaztu ("to forget") — Past
- `ahaztu-future` — ahaztu ("to forget") — Future
- `nor-nori-past-pool` — **Review**: gustatu (Past), iruditu (Past), ahaztu (Past), jarraitu (Past), jario (Past), etorri (Past (NORI axis))

#### Unit 27 — The NOR-NORI Object Axis — natzaizu/gatzaizu

**What you learn:** the NOR-NORI object axis (natzaizu/gatzaizu/zaizkizu) — gustatu/iruditu/ahaztu/jarraitu's presentByNor/pastByNor tables (#358) shift NOR off the default hura/haiek to ni/gu/zuek; a pooled cross-verb review for each fixed nori value (zu/ni/hura/gu/zuek/haiek) drills the full table across all four verbs at once (#441/#469)

**Example:** "Do you like me?" (Gustatzen natzaizu?) / "I like him." (Gustatzen natzaio.)

**Lessons:**

- `nor-axis-present-review-zu` — **Review** [ni/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-zu` — **Review** [ni/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
- `nor-axis-present-review-ni` — **Review** [zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-ni` — **Review** [zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
- `nor-axis-present-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
- `nor-axis-present-review-gu` — **Review** [ni/zu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-gu` — **Review** [ni/zu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
- `nor-axis-present-review-zuek` — **Review** [ni/zu/gu]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-zuek` — **Review** [ni/zu/gu]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))
- `nor-axis-present-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Present (NOR axis)), iruditu (Present (NOR axis)), ahaztu (Present (NOR axis)), jarraitu (Present (NOR axis))
- `nor-axis-past-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Past (NOR axis)), iruditu (Past (NOR axis)), ahaztu (Past (NOR axis)), jarraitu (Past (NOR axis))

### Stage 9 — Communication & Giving (NOR-NORI-NORK)

#### Unit 28 — The NOR-NORI-NORK Present — diot/diozu/dio

**What you learn:** present NOR-NORI-NORK (esan, eman), axis-scaffolded — each lesson fixes one axis (NORK or NORI) before recombining both, plus plural-object (-zki-) fodder and extra-practice reviews; #334 adds a pooled present carrier for the ditransitive optionally-dative fodder (saldu/utzi/adierazi/eskatu/galdetu)

**Example:** "I give it to him." (Ematen diot)

**Lessons:**

- `esan-present` — esan ("to tell / say (to someone)") — Present
- `eman-present` — eman ("to give") — Present
- `esan-present-plural` — esan ("to tell / say (to someone)") — Present (plural)
- `eman-present-plural` — eman ("to give") — Present (plural)
- `unit-25-fix-nori-review` — **Review**: esan (Present), esan (Past), esan (Future)
- `unit-25-fix-nork-review` — **Review**: eman (Present), eman (Past), eman (Future)
- `unit-25-object-number-review` — **Review**: esan (Present), esan (Present (plural)), eman (Present), eman (Present (plural))
- `unit-25-two-axis-review` — **Review**: esan (Present), eman (Present)
- `ditransitive-dative-present` — **Pooled practice** [ni/zu/hura]: saldu (Present), utzi (Present), adierazi (Present), eskatu (Present), galdetu (Present)
- `ditransitive-dative-present-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Present), utzi (Present), adierazi (Present), eskatu (Present), galdetu (Present)

#### Unit 29 — NOR-NORI-NORK Past & Future — Telling & Giving Across Time

**What you learn:** NOR-NORI-NORK past + future — reuses the periphrastic past and -ko/-go future on the axis-fixed slices from Unit 25; #334 adds pooled past/future/review carriers for the same ditransitive fodder

**Example:** "I told him." (Esan nion)

**Lessons:**

- `esan-past` — esan ("to tell / say (to someone)") — Past
- `esan-future` — esan ("to tell / say (to someone)") — Future
- `eman-past` — eman ("to give") — Past
- `eman-future` — eman ("to give") — Future
- `esan-past-plural` — esan ("to tell / say (to someone)") — Past (plural)
- `eman-past-plural` — eman ("to give") — Past (plural)
- `ditransitive-dative-past` — **Pooled practice** [ni/zu/hura]: saldu (Past), utzi (Past), adierazi (Past), eskatu (Past), galdetu (Past)
- `ditransitive-dative-past-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Past), utzi (Past), adierazi (Past), eskatu (Past), galdetu (Past)
- `ditransitive-dative-future` — **Pooled practice** [ni/zu/hura]: saldu (Future), utzi (Future), adierazi (Future), eskatu (Future), galdetu (Future)
- `ditransitive-dative-future-plural` — **Pooled practice** [gu/zuek/haiek]: saldu (Future), utzi (Future), adierazi (Future), eskatu (Future), galdetu (Future)
- `ditransitive-dative-review` — **Review** [ni/zu/hura]: 15 verbs pooled — Present
- `ditransitive-dative-review-plural` — **Review** [gu/zuek/haiek]: 15 verbs pooled — Present

#### Unit 30 — Covert-Dative NOR-NORI-NORK — Agentive Verbs

**What you learn:** #307 — pooled present/past/future for lagundu/ekin/erantzun/deitu/eragin/antzeman plus the dative egin compounds (mesede/kalte/aurre egin), plus itxaron's dative reading (#334); reuses the diot-family paradigm from Units 28-29, but with no overt direct object to hint NORI — drilling the exact "covert dative" confusion #293 targets

**Example:** "I help him." (Laguntzen diot)

**Lessons:**

- `dative-verb-present` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Present
- `dative-verb-present-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Present
- `dative-verb-past` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Past
- `dative-verb-past-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Past
- `dative-verb-future` — **Pooled practice** [ni/zu/hura]: 10 verbs pooled — Future
- `dative-verb-future-plural` — **Pooled practice** [gu/zuek/haiek]: 10 verbs pooled — Future
- `dative-verb-review` — **Review** [ni/zu/hura]: 30 verbs pooled — Present
- `dative-verb-review-plural` — **Review** [gu/zuek/haiek]: 30 verbs pooled — Present

### Refresh Gate C — The Multi-Argument Audit

#### Unit 31 — REFRESH — The Case-Ending Mixer (🛡️ Refresh Gate, ⏳ pending (not yet implemented))

**What you learn:** Drills NOR/NORK/NORI role-swaps plus dative past/future recombination — zero new verbs, score-gated and a mandatory pass before Phase V

_Not implemented yet — no lessons._


## Phase V · B2 — Nuance & Modality — Nuance, Modality, & Social Context

### Stage 10 — Hypotheticals & Potentials

#### Unit 32 — Ahalera — Permissions & Capability

**What you learn:** dezaket/naiteke contrasted with periphrastic ahal izan/ezin (#410/#411) — production for NOR/NOR-NORK; plus ukan's NOR-NORK object axis (zaitzaket-type forms, #352, extended to every NORK value by #424) across all three Ahalera sub-tenses — present, hypothetical, and past; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis across the same three sub-tenses, recognition-only for every dative value (#425, pooled into cross-verb reviews with jarraitu by #446); esan/eman's ditransitive Ahalera (diezaioket-type forms, #366) recognition-only

**Example:** "I can come." / "I can't come."

**Lessons:**

- `izan-potential` — izan ("to be") — Potential (Ahalera)
- `ukan-potential` — ukan ("to have") — Potential (Ahalera)
- `unit-28-review` — **Review**: izan (Potential (Ahalera)), ukan (Potential (Ahalera))
- `izan-potential-alegiazkoa` — izan ("to be") — Potential, hypothetical
- `ukan-potential-alegiazkoa` — ukan ("to have") — Potential, hypothetical
- `izan-potential-lehenaldia` — izan ("to be") — Potential, past
- `ukan-potential-lehenaldia` — ukan ("to have") — Potential, past
- `unit-28-alegiazkoa-lehenaldia-review` — **Review**: izan (Potential, hypothetical), ukan (Potential, hypothetical), izan (Potential, past), ukan (Potential, past)
- `ahal-izan-present` — ahal izan ("to be able to (intransitive)") — Present
- `ahal-ukan-present` — ahal izan ("to be able to (transitive)") — Present
- `ezin-izan-present` — ezin ("to not be able to / can't (intransitive)") — Present
- `ezin-ukan-present` — ezin ("to not be able to / can't (transitive)") — Present
- `unit-34-ahal-ezin-review` — **Review**: ahal izan (Present), ezin (Present)

#### Unit 33 — Baldintza & Ondorioa — Conditionals

**What you learn:** ba- protasis + -ke apodosis — production for NOR/NOR-NORK; plus ukan's NOR-NORK object axis (bazintut/zintuket-type forms, #353, extended to every NORK value by #424) across Baldintza and Ondorioa present/past; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis across Baldintza and Ondorioa present/past, recognition-only for every dative value (#425, pooled into cross-verb reviews with jarraitu by #445); esan/eman's ditransitive Baldintza/Ondorioa (balio/nioke-type forms, #366) recognition-only

**Example:** "If I had money, I would buy that" (Dirua banu, hori erosiko nuke)

**Lessons:**

- `izan-baldintza` — izan ("to be") — Conditional-if (Baldintza)
- `izan-conditional` — izan ("to be") — Conditional-would (Ondorioa)
- `ukan-baldintza` — ukan ("to have") — Conditional-if (Baldintza)
- `ukan-conditional` — ukan ("to have") — Conditional-would (Ondorioa)
- `unit-29-review` — **Review**: izan (Conditional-if (Baldintza)), izan (Conditional-would (Ondorioa)), ukan (Conditional-if (Baldintza)), ukan (Conditional-would (Ondorioa))
- `izan-conditional-past` — izan ("to be") — Conditional-would, past
- `ukan-conditional-past` — ukan ("to have") — Conditional-would, past
- `unit-29-conditional-past-review` — **Review**: izan (Conditional-would, past), ukan (Conditional-would, past)

### Stage 11 — Agintera (Commands)

#### Unit 34 — Agintera — Commands

**What you learn:** the imperative — izan/ukan production for NOR/NOR-NORK (including jussive/hortative and plural-object); egon/etorri/joan production; gustatu/iruditu/ahaztu/jarraitu's NOR-NORI object axis (#364, bekio/zakio-type forms, extended to every dative value by #425, pooled into cross-verb reviews with jarraitu by #444); esan/eman's ditransitive (iezadazu) recognition-only

**Example:** Hadi hona!

**Lessons:**

- `izan-imperative` — izan ("to be") — Imperative (Agintera)
- `ukan-imperative` — ukan ("to have") — Imperative (Agintera)
- `unit-30-review` — **Review**: izan (Imperative (Agintera)), ukan (Imperative (Agintera))
- `egon-imperative` — egon ("to be (located / in a state)") — Imperative (Agintera)
- `etorri-imperative` — etorri ("to come") — Imperative (Agintera)
- `joan-imperative` — joan ("to go") — Imperative (Agintera)
- `unit-30-plural-object-review` — **Review**: ukan (Imperative (Agintera)), ukan (Imperative (plural))
- `unit-30-ditransitive-review` — **Review**: esan (Imperative (ditransitive)), eman (Imperative (ditransitive))


## Bonus — Mastery, Register & Color — Optional deep dives, off the main path — never required to finish the core

### Directives & Wishes — The Subjunctive

#### Unit 35 — Purpose & Wishing (Subjuntiboa) (✨ Bonus)

**What you learn:** the subjunctive as a construction (matrix verb + subordinate clause) — NOR/NOR-NORK 3rd-person in-construction production, dative/ditransitive recognition-only

**Example:** Nahi dut etor dadin. · Esan dio etor dadila. · ...ikus dezan.

**Lessons:**

- `izan-subjunctive-present` — izan ("to be") — Subjunctive (present) [hura/haiek]
- `ukan-subjunctive-present` — ukan ("to have") — Subjunctive (present) [hura/haiek]
- `unit-36-review` — **Review**: izan (Subjunctive (present)), ukan (Subjunctive (present))
- `unit-36-dative-review` — **Review**: gustatu (Subjunctive (present)), iruditu (Subjunctive (present)), ahaztu (Subjunctive (present))
- `unit-36-ditransitive-review` — **Review**: esan (Subjunctive (present)), eman (Subjunctive (present))
- `izan-subjunctive-past` — izan ("to be") — Subjunctive (past) [hura/haiek]
- `ukan-subjunctive-past` — ukan ("to have") — Subjunctive (past) [hura/haiek]
- `unit-36-past-review` — **Review**: izan (Subjunctive (past)), ukan (Subjunctive (past))

### Stage 12 — The Intimate Register (hi + Hitanoa)

#### Unit 36 — hi — Meet "hi" (✨ Bonus)

**What you learn:** hi as a subject in known paradigms, plus hi-as-NORK's own gender split

**Example:** Hi ikaslea haiz.

**Lessons:**

- `unit-32-hi-present` — **Review** [hi]: izan (Present), egon (Present), joan (Present), etorri (Present), ibili (Present)
- `unit-32-hi-past` — **Review** [hi]: izan (Past), egon (Past), joan (Past), etorri (Past), ibili (Past)
- `unit-32-hi-nork-present` — **Review** [hi-m/hi-f]: ukan (Present), jakin (Present)

#### Unit 37 — Toka (Masculine Allocutive) (✨ Bonus)

**What you learn:** addressee-agreement on 3rd-person statements, masculine register

**Example:** Lanean dik.

**Lessons:**

- `izan-present-toka` — izan ("to be") — Present (toka)
- `ukan-present-toka` — ukan ("to have") — Present (toka)
- `izan-past-toka` — izan ("to be") — Past (toka)
- `ukan-past-toka` — ukan ("to have") — Past (toka)
- `unit-33-review` — **Review**: izan (Present (toka)), ukan (Present (toka)), izan (Past (toka)), ukan (Past (toka))

#### Unit 38 — Noka (Feminine Allocutive) (✨ Bonus)

**What you learn:** taught as the -k → -n transform of Unit 34's toka forms, feminine register

**Example:** Lanean din.

**Lessons:**

- `izan-present-noka` — izan ("to be") — Present (noka)
- `ukan-present-noka` — ukan ("to have") — Present (noka)
- `izan-past-noka` — izan ("to be") — Past (noka)
- `ukan-past-noka` — ukan ("to have") — Past (noka)
- `unit-34-review` — **Review**: izan (Present (noka)), ukan (Present (noka)), izan (Past (noka)), ukan (Past (noka))

#### Unit 39 — Hitanoa Recombined (✨ Bonus, ⏳ pending (not yet implemented))

**What you learn:** mixed toka/noka chosen by addressee gender, plus when not to use it — suppressed in subordinate clauses and formal -ke- moods

_Not implemented yet — no lessons._

### Stage 13 — Reading Real Text

#### Unit 40 — The Passive nor-shift — Reading Real Text (✨ Bonus)

**What you learn:** non-finite forms, nor-shift (ireki dut → ireki da) — comprehension over real sentences, recognition-only throughout

**Example:** Nik atea ireki dut. → Atea ireki da.

**Lessons:**

- `unit-36-reading` — **Reading comprehension** (recognition-only): 10 real-sentence items (non-finite forms / nor-shift)
- `unit-36-reading-nonfinite` — **Reading comprehension** (recognition-only): 8 real-sentence items (non-finite forms / nor-shift)

### Stage 14 — The Causative Suffix (-arazi)

#### Unit 41 — Making Someone Do It (✨ Bonus)

**What you learn:** -arazi on intransitives (nor → nor-nork), present/past/future

**Example:** Ekaitzak mendizaleak itzularazi zituen. · Musikak umeak dantzarazi ditu.

**Lessons:**

- `itzularazi-present` — itzularazi ("to make (someone) turn back") — Present
- `itzularazi-past` — itzularazi ("to make (someone) turn back") — Past
- `itzularazi-future` — itzularazi ("to make (someone) turn back") — Future
- `dantzarazi-present` — dantzarazi ("to make (someone) dance") — Present
- `dantzarazi-past` — dantzarazi ("to make (someone) dance") — Past
- `dantzarazi-future` — dantzarazi ("to make (someone) dance") — Future
- `unit-42-causative-review` — **Review**: itzularazi (Present), itzularazi (Past), itzularazi (Future), dantzarazi (Present), dantzarazi (Past), dantzarazi (Future)

#### Unit 42 — Making Someone Do Something to Someone (✨ Bonus)

**What you learn:** -arazi on transitives (nor-nork → nor-nori-nork), present/past/future

**Example:** Amonak umeei babarrunak janarazi zizkien. · Irakasleak ikasleei hori idatzarazi die.

**Lessons:**

- `janarazi-present` — janarazi ("to make (someone) eat (something)") — Present
- `janarazi-past` — janarazi ("to make (someone) eat (something)") — Past
- `janarazi-future` — janarazi ("to make (someone) eat (something)") — Future
- `idatzarazi-present` — idatzarazi ("to make (someone) write (something)") — Present
- `idatzarazi-past` — idatzarazi ("to make (someone) write (something)") — Past
- `idatzarazi-future` — idatzarazi ("to make (someone) write (something)") — Future
- `unit-43-causative-review` — **Review**: janarazi (Present), janarazi (Past), janarazi (Future), idatzarazi (Present), idatzarazi (Past), idatzarazi (Future)

### Refresh Gate D — The Causative Recombination

#### Unit 43 — REFRESH — Causatives Across Tenses & Moods (🛡️ Refresh Gate, ✨ Bonus)

**What you learn:** Recombines Units 42–43's -arazi forms across present/past/future — zero new verbs, score-gated

**Lessons:**

- `unit-44-review-1` — **Review**: itzularazi (Present), itzularazi (Past), itzularazi (Future), dantzarazi (Present), dantzarazi (Past), dantzarazi (Future)
- `unit-44-review-2` — **Review**: janarazi (Present), janarazi (Past), janarazi (Future), idatzarazi (Present), idatzarazi (Past), idatzarazi (Future)

### Stage 15 — Verbs That Don't Need an Auxiliary

#### Unit 44 — Synthetic Curiosities (✨ Bonus)

**What you learn:** jario (nor-nori, "dario"/"zerion"), etzan (nor, "datza"), irudi (unergative, nork-only, "dirudi" — not iruditu's nor-nori) — rare native-synthetic verbs, recognition-only

**Example:** Malkoak dario. · Zertan datza ariketa? · Nekatuta zaude, dirudizu.

**Lessons:**

- `jario-present` — jario ("to flow / ooze") — Present
- `jario-past` — jario ("to flow / ooze") — Past
- `irudi-present` — irudi ("to seem / give the impression (not iruditu's "it seems to me")") — Present [ni/zu/hura/gu/zuek/haiek]
- `irudi-past` — irudi ("to seem / give the impression (not iruditu's "it seems to me")") — Past [ni/zu/hura/gu/zuek/haiek]
- `etzan-present` — etzan ("to lie (in) / consist of") — Present [ni/zu/hura/gu/zuek/haiek]
- `etzan-past` — etzan ("to lie (in) / consist of") — Past [ni/zu/hura/gu/zuek/haiek]
- `unit-44-curiosities-review` — **Review**: jario (Present), jario (Past), irudi (Present), irudi (Past), etzan (Present), etzan (Past)

### Stage 16 — Talking About Weather

#### Unit 45 — Talking About Weather (✨ Bonus, ⏳ pending (not yet implemented))

**What you learn:** ari + ukan ("euria ari du"), izan/egon weather idioms — fixed 3rd person only, zero new conjugation tables

**Example:** Euria ari du. · Hotz da. · Eguzkia dago.

_Not implemented yet — no lessons._

### Stage 17 — Subjects Without Objects

#### Unit 46 — Unergative Curiosities (✨ Bonus)

**What you learn:** ihardun ("dihardut"/"niharduen"), iraun ("dirau"/"zirauen") — unergative, NORK-only, ergative subject with no absolutive argument

**Example:** Lanean dihardut. · Filmak bi ordu dirau.

**Lessons:**

- `ihardun-present` — ihardun ("to occupy oneself / be engaged (in something)") — Present [ni/zu/hura/gu/zuek/haiek]
- `ihardun-past` — ihardun ("to occupy oneself / be engaged (in something)") — Past [ni/zu/hura/gu/zuek/haiek]
- `iraun-present` — iraun ("to last / endure") — Present [ni/zu/hura/gu/zuek/haiek]
- `iraun-past` — iraun ("to last / endure") — Past [ni/zu/hura/gu/zuek/haiek]
- `unit-46-review` — **Review**: ihardun (Present), ihardun (Past), iraun (Present), iraun (Past)

### Stage 18 — Tools & Usage

#### Unit 47 — erabili — Using Things (✨ Bonus)

**What you learn:** erabili ("darabilt"/"nerabilen") — nor-nork synthetic verb in the already-taught eduki/jakin shape, present + past

**Example:** Nik ordenagailua darabilt egunero.

**Lessons:**

- `erabili-present` — erabili ("to use") — Present [ni/zu/hura/gu/zuek/haiek]
- `erabili-past` — erabili ("to use") — Past [ni/zu/hura/gu/zuek/haiek]
- `unit-47-review` — **Review**: erabili (Present), erabili (Past)

### The Object Axis in Depth

#### Unit 48 — The Reverse Object Axis — Acting on Me / Us / You (✨ Bonus)

**What you learn:** the NOR-NORK object axis with NORK fixed at hura/gu/zu/zuek/haiek in turn (someone/something acting on me/us/you) — the deep-practice half of Unit 15, recognition-pooled across ~37 transitive verbs

**Example:** "It surprised me." (Harritu nau.) / "They saw us." (Ikusi gaituzte.)

**Lessons:**

- `ukan-object-axis-present-hura` — ukan ("to have") — Present (object axis) [ni/hura/gu/zu/zuek/haiek]
- `maite-object-axis-past-hura` — maite izan ("to love") — Past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `object-axis-present-review-hura` — **Review** [ni/hura/gu/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review-hura` — **Review** [ni/hura/gu/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
- `ikusi-object-axis-present-gu` — ikusi ("to see") — Present (object axis) [hura/zu/zuek/haiek]
- `jan-object-axis-past-gu` — jan ("to eat") — Past (object axis) [hura/zu/zuek/haiek]
- `object-axis-present-review-gu` — **Review** [hura/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review-gu` — **Review** [hura/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)
- `edan-object-axis-present-zu` — edan ("to drink") — Present (object axis) [ni/hura/gu/haiek]
- `erosi-object-axis-past-zu` — erosi ("to buy") — Past (object axis) [ni/hura/gu/haiek]
- `object-axis-present-review-zu` — **Review** [ni/hura/gu/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review-zu` — **Review** [ni/hura/gu/haiek]: 36 verbs pooled — Past (object axis)
- `hartu-object-axis-present-zuek` — hartu ("to take") — Present (object axis) [ni/hura/gu/haiek]
- `ukan-object-axis-past-zuek` — ukan ("to have") — Past (object axis) [ni/hura/gu/haiek]
- `object-axis-present-review-zuek` — **Review** [ni/hura/gu/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review-zuek` — **Review** [ni/hura/gu/haiek]: 36 verbs pooled — Past (object axis)
- `maite-object-axis-present-haiek` — maite izan ("to love") — Present (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ikusi-object-axis-past-haiek` — ikusi ("to see") — Past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `object-axis-present-review-haiek` — **Review** [ni/hura/gu/zu/zuek/haiek]: 37 verbs pooled — Present (object axis)
- `object-axis-past-review-haiek` — **Review** [ni/hura/gu/zu/zuek/haiek]: 36 verbs pooled — Past (object axis)

### The Axes Inside the Moods

#### Unit 49 — Potential — The Axes in Depth (✨ Bonus)

**What you learn:** ukan's NOR-NORK object axis, gustatu/iruditu/ahaztu/jarraitu's NOR-NORI dative axis, and esan/eman's ditransitive — across all three Ahalera sub-tenses (present/hypothetical/past), recognition-pooled. The deep-practice half of Unit 23 (Ahalera).

**Example:** "It could surprise me." / "I could like him."

**Lessons:**

- `ukan-potential-object-axis-present` — ukan ("to have") — Potential (object axis) [hura/zu/zuek/haiek]
- `ukan-potential-object-axis-alegiazkoa` — ukan ("to have") — Potential, hypothetical (object axis) [hura/zu/zuek/haiek]
- `ukan-potential-object-axis-lehenaldia` — ukan ("to have") — Potential, past (object axis) [hura/zu/zuek/haiek]
- `unit-34-object-axis-review` — **Review** [hura/zu/zuek/haiek]: ukan (Potential (object axis)), ukan (Potential, hypothetical (object axis)), ukan (Potential, past (object axis))
- `ukan-potential-object-axis-present-hura` — ukan ("to have") — Potential (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-potential-object-axis-alegiazkoa-hura` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-potential-object-axis-lehenaldia-hura` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-potential-object-axis-present-gu` — ukan ("to have") — Potential (object axis) [hura/zu/zuek/haiek]
- `ukan-potential-object-axis-alegiazkoa-gu` — ukan ("to have") — Potential, hypothetical (object axis) [hura/zu/zuek/haiek]
- `ukan-potential-object-axis-lehenaldia-gu` — ukan ("to have") — Potential, past (object axis) [hura/zu/zuek/haiek]
- `ukan-potential-object-axis-present-zu` — ukan ("to have") — Potential (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-alegiazkoa-zu` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-lehenaldia-zu` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-present-zuek` — ukan ("to have") — Potential (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-alegiazkoa-zuek` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-lehenaldia-zuek` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/haiek]
- `ukan-potential-object-axis-present-haiek` — ukan ("to have") — Potential (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-potential-object-axis-alegiazkoa-haiek` — ukan ("to have") — Potential, hypothetical (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-potential-object-axis-lehenaldia-haiek` — ukan ("to have") — Potential, past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `potential-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential (NOR axis)), iruditu (Potential (NOR axis)), ahaztu (Potential (NOR axis)), jarraitu (Potential (NOR axis))
- `potential-alegiazkoa-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-alegiazkoa-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-alegiazkoa-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-alegiazkoa-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-alegiazkoa-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-alegiazkoa-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, hypothetical (NOR axis)), iruditu (Potential, hypothetical (NOR axis)), ahaztu (Potential, hypothetical (NOR axis)), jarraitu (Potential, hypothetical (NOR axis))
- `potential-lehenaldia-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `potential-lehenaldia-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `potential-lehenaldia-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `potential-lehenaldia-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `potential-lehenaldia-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `potential-lehenaldia-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Potential, past (NOR axis)), iruditu (Potential, past (NOR axis)), ahaztu (Potential, past (NOR axis)), jarraitu (Potential, past (NOR axis))
- `unit-34-ditransitive-review` — **Review**: 12 verbs pooled — Potential (Ahalera)

#### Unit 50 — Conditionals — The Axes in Depth (✨ Bonus)

**What you learn:** ukan's NOR-NORK object axis, the NOR-NORI dative axis, and esan/eman's ditransitive — across Baldintza and Ondorioa present/past, recognition-pooled. The deep-practice half of Unit 24 (Baldintza).

**Example:** "If you loved me…" / "I would like him."

**Lessons:**

- `ukan-baldintza-object-axis` — ukan ("to have") — Conditional-if (object axis) [hura/zu/zuek/haiek]
- `ukan-conditional-object-axis` — ukan ("to have") — Conditional-would (object axis) [hura/zu/zuek/haiek]
- `ukan-conditional-past-object-axis` — ukan ("to have") — Conditional-would, past (object axis) [hura/zu/zuek/haiek]
- `unit-35-object-axis-review` — **Review** [hura/zu/zuek/haiek]: ukan (Conditional-if (object axis)), ukan (Conditional-would (object axis)), ukan (Conditional-would, past (object axis))
- `ukan-baldintza-object-axis-hura` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-conditional-object-axis-hura` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-conditional-past-object-axis-hura` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-baldintza-object-axis-gu` — ukan ("to have") — Conditional-if (object axis) [hura/zu/zuek/haiek]
- `ukan-conditional-object-axis-gu` — ukan ("to have") — Conditional-would (object axis) [hura/zu/zuek/haiek]
- `ukan-conditional-past-object-axis-gu` — ukan ("to have") — Conditional-would, past (object axis) [hura/zu/zuek/haiek]
- `ukan-baldintza-object-axis-zu` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/haiek]
- `ukan-conditional-object-axis-zu` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/haiek]
- `ukan-conditional-past-object-axis-zu` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/haiek]
- `ukan-baldintza-object-axis-zuek` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/haiek]
- `ukan-conditional-object-axis-zuek` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/haiek]
- `ukan-conditional-past-object-axis-zuek` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/haiek]
- `ukan-baldintza-object-axis-haiek` — ukan ("to have") — Conditional-if (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-conditional-object-axis-haiek` — ukan ("to have") — Conditional-would (object axis) [ni/hura/gu/zu/zuek/haiek]
- `ukan-conditional-past-object-axis-haiek` — ukan ("to have") — Conditional-would, past (object axis) [ni/hura/gu/zu/zuek/haiek]
- `baldintza-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `baldintza-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `baldintza-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `baldintza-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `baldintza-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `baldintza-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-if (NOR axis)), iruditu (Conditional-if (NOR axis)), ahaztu (Conditional-if (NOR axis)), jarraitu (Conditional-if (NOR axis))
- `conditional-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would (NOR axis)), iruditu (Conditional-would (NOR axis)), ahaztu (Conditional-would (NOR axis)), jarraitu (Conditional-would (NOR axis))
- `conditional-past-axis-review-ni` — **Review** [zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `conditional-past-axis-review-zu` — **Review** [ni/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `conditional-past-axis-review-hura` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `conditional-past-axis-review-gu` — **Review** [ni/zu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `conditional-past-axis-review-zuek` — **Review** [ni/zu/gu]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `conditional-past-axis-review-haiek` — **Review** [ni/zu/gu/zuek]: gustatu (Conditional-would, past (NOR axis)), iruditu (Conditional-would, past (NOR axis)), ahaztu (Conditional-would, past (NOR axis)), jarraitu (Conditional-would, past (NOR axis))
- `unit-35-ditransitive-review` — **Review**: 12 verbs pooled — Conditional-if (Baldintza)

#### Unit 51 — Commands — The Axes in Depth (✨ Bonus)

**What you learn:** gustatu/iruditu/ahaztu/jarraitu's NOR-NORI dative-axis imperative (bekio/zakio-type) across every dative value, recognition-pooled. The deep-practice half of Unit 25 (Agintera).

**Example:** "Let it appeal to me!" (bekit)

**Lessons:**

- `gustatu-imperative-axis` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zuek/haiek]
- `iruditu-imperative-axis` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zuek/haiek]
- `ahaztu-imperative-axis` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zuek/haiek]
- `gustatu-imperative-axis-ni` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `gustatu-imperative-axis-hura` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `gustatu-imperative-axis-gu` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `gustatu-imperative-axis-zuek` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/haiek]
- `gustatu-imperative-axis-haiek` — gustatu ("to like / please") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `iruditu-imperative-axis-ni` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `iruditu-imperative-axis-hura` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `iruditu-imperative-axis-gu` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `iruditu-imperative-axis-zuek` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/haiek]
- `iruditu-imperative-axis-haiek` — iruditu ("to seem (to someone)") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `ahaztu-imperative-axis-ni` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `ahaztu-imperative-axis-hura` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `ahaztu-imperative-axis-gu` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `ahaztu-imperative-axis-zuek` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/haiek]
- `ahaztu-imperative-axis-haiek` — ahaztu ("to forget") — Imperative (NOR axis) [hura/zu/zuek/haiek]
- `imperative-axis-review-zu` — **Review** [hura/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
- `imperative-axis-review-ni` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
- `imperative-axis-review-hura` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
- `imperative-axis-review-gu` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
- `imperative-axis-review-zuek` — **Review** [hura/zu/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))
- `imperative-axis-review-haiek` — **Review** [hura/zu/zuek/haiek]: gustatu (Imperative (NOR axis)), iruditu (Imperative (NOR axis)), ahaztu (Imperative (NOR axis)), jarraitu (Imperative (NOR axis))

