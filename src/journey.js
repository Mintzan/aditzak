// =============================================================================
// The learning journey — Aditzak's curriculum roadmap
//
// Mirrors `docs/LEARNING_JOURNEY.md`'s phases → stages → units, which in turn
// follows the 39-unit layout specified in `docs/LEARNING_JOURNEY_PROPOSED.md`
// (unit numbers below are that spec's "N-n"; see
// `docs/LEARNING_JOURNEY_EVALUATION.md` for the O-n → N-n mapping that drove
// this renumber — issue #149/#137/#151). Each unit is either:
//   - `available`: has `lessonIds`, pointing at entries in `LESSONS`
//     (App.jsx) that the home screen renders as playable lesson cards. Every
//     available unit's `lessonIds` ends with that unit's `unit-N-review`
//     entry — a trailing `review: true` lesson covering everything the unit
//     introduced, giving each unit its own harder consolidation pass before
//     the next one unlocks.
//   - `pending`: not implemented yet — rendered as a locked "coming soon"
//     roadmap card (title/focus/payload only), so the full curriculum is
//     visible from day one even as units are filled in one at a time.
//
// `gate: true` marks Refresh Gate units — zero-new-verb consolidation or
// expansion checkpoints (Units 10, 22, 32, 44 — the present-perfect
// insertion at Unit 11 first shifted Gates B/C/D up by one from the
// `LEARNING_JOURNEY_PROPOSED.md` N-20/N-27/N-39 to 21/28/40, #296's
// "Carrying & Bringing" reposition (old Unit 43 -> new Unit 15) shifted them
// up by one again to 22/29/41, #307's new "Agentive Verbs with a Covert
// Dative" unit (placed after Unit 28, before Gate C) shifted Gates C/D up by
// one more to 30/42, #350's new "non-3rd-person object" unit (inserted
// as Unit 15, after Unit 14's NOR-NORK past) shifted every gate from there on
// up by one more to 10/23/32/44, #359's new "non-3rd-person NOR" unit
// (inserted as Unit 28, after Unit 27's NOR-NORI past/future) shifted Gates
// C/D up by one final time to 33/45, and #423's collapse of the old Units
// 20-21 (Future) into one unit shifted every gate from Gate B onward back
// down by one, to 22/32/44). Most sit between phases/stages, but
// Phase I's "Expansion" gate (Unit 7) sits mid-phase, right after the verbs it
// expands are introduced — see `docs/DECISIONS.md`, "Moved the Expansion
// gate earlier".
//
// Two units after each "present tense" cluster ("Looking Back I"/"Looking
// Back II") teach the simple past for verbs already met, so tense variety
// (present → past → future) arrives well before Phase III rather than all at
// once — see `docs/DECISIONS.md` for the redesign rationale.
//
// Keep this in sync with `docs/LEARNING_JOURNEY.md` — when a unit moves from
// pending to available, flip its `status` and add its `lessonIds` here.
//
// Lesson ids in `LESSONS` were kept stable across the #137 renumber (see
// `docs/DECISIONS.md`, 2026-06-14 "37-unit journey renumber"). #151's
// ergative restructure (Units 2-4) added new lesson ids and re-scoped
// `unit-2-review` — see `docs/DECISIONS.md`, "#151 ergative restructure", for
// why this didn't need a `STORAGE_KEY` bump either.
// =============================================================================

export const JOURNEY = [
  {
    id: 'phase-1',
    title: 'Phase I',
    subtitle: 'Survival Present (Me, You, & It)',
    stages: [
      {
        id: 'phase-1-stage-1',
        title: 'Stage 1 — Being, Having & the Ergative Leap',
        units: [
          {
            number: 1,
            title: 'izan & egon — Who and Where',
            focus: 'izan + egon, present tense',
            payload: '"I am a student."',
            status: 'available',
            lessonIds: ['izan-present', 'egon-present', 'unit-1-review'],
          },
          // Unit 2 ("The Ergative Leap") used to be bundled with `nahi` and
          // `jakin` (the pre-#151 Unit 2). Per
          // docs/LEARNING_JOURNEY_EVALUATION.md F6/F7, the absolutive→ergative
          // subject shift (`ni naiz` → `nik dut`) is the single steepest
          // conceptual jump in the journey, so it now gets its own unit plus
          // a dedicated case-marking checkpoint (Unit 3) before `jakin`/`nahi`
          // arrive as reinforcement (Unit 4) — see docs/DECISIONS.md, "#151
          // ergative restructure".
          {
            number: 2,
            title: 'ukan — The Ergative Leap',
            focus: 'ukan present (object fixed to hura), taught alone — ni/zu/hura',
            payload: '"I have a car." (Nik auto bat dut.)',
            status: 'available',
            lessonIds: ['ukan-present', 'ukan-ni-nik-shift-review', 'unit-2-review'],
          },
          // Unit 3 — the "Ni vs. Nik" case-marking checkpoint (zero new
          // verbs): drills the absolutive (izan/egon, bare subject) vs.
          // ergative (ukan, -k subject) contrast Unit 2 just introduced —
          // pre-empting "ergative drift" (†Nik naiz), the most common
          // beginner error (F7). The Phase-I counterpart of Gate C (Unit 33).
          {
            number: 3,
            title: '"Ni" vs. "Nik" — The Case-Marking Checkpoint',
            focus:
              'zero new verbs — bare izan/egon subjects vs. ergative ukan subjects, ni/zu/hura',
            payload: '"Ni ikaslea naiz" vs. "Nik liburua dut."',
            status: 'available',
            lessonIds: [
              'case-marking-sort-review',
              'case-marking-drift-review',
              'case-marking-checkpoint-review',
            ],
          },
          {
            number: 4,
            title: 'jakin & nahi — Knowing & Wanting',
            focus: 'jakin (synthetic, same ergative suffixes as ukan) + nahi + ukan',
            payload: '"I don\'t know." (Ez dakit.)',
            status: 'available',
            lessonIds: ['jakin-present', 'nahi-present', 'jakin-suffix-family-review', 'knowing-wanting-review'],
          },
        ],
      },
      {
        id: 'phase-1-stage-2',
        title: 'Stage 2 — Seeing & Moving',
        units: [
          {
            number: 5,
            title: 'ikusi — First Periphrastic Verb (-tzen dut)',
            focus: 'ikusi present (ni/zu/hura) — Phase I\'s first periphrastic verb',
            payload: '"I see the mountain."',
            status: 'available',
            lessonIds: ['ikusi-present', 'ikusi-present-review'],
          },
          {
            number: 6,
            title: 'joan/etorri/ibili — The NOR Present',
            focus: 'joan + etorri + ibili, present tense',
            payload: "\"I'm going to the beach.\"",
            status: 'available',
            lessonIds: [
              'joan-present',
              'etorri-present',
              'ibili-present',
              'unit-3-review',
              'nor-fodder-present',
              'nor-fodder-present-plural',
            ],
          },
          // Unit 7 ("Expansion: Absolutive Plurals") and Unit 8 ("Expansion:
          // Ergative Plurals") split O-5's single "Expansion" gate into two
          // internally-homogeneous units — the absolutive plural (gara/goaz,
          // marked on the stem) and the ergative plural (dugu/dute, a suffix
          // on the fixed du- stem) are different paradigms, and bundling them
          // invites †dugara-type blending (docs/LEARNING_JOURNEY_EVALUATION.md
          // F4). `ikusi`'s plural practice/review (nor-nork, ergative) now
          // live under Unit 8 rather than Unit 7, alongside `ukan`'s own
          // dedicated plural practice — see `docs/DECISIONS.md`, "Split Unit
          // 7's ergative-plural lessons into Unit 8". `unit-6-review-1` keeps
          // mixing `izan`+`ukan` present-plural as a cross-verb review (its
          // original pairing, predating this split) rather than being
          // re-balanced — a small absolutive/ergative mix in one review
          // lesson, left as-is.
          {
            number: 7,
            title: 'Expansion: Absolutive Plurals',
            focus:
              'Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri, and ikusi — zero new verbs',
            payload: '"We are teachers." (Irakasleak gara)',
            status: 'available',
            gate: true,
            lessonIds: ['unit-6-review-1', 'unit-6-review-2', 'unit-6-review-3'],
          },
          {
            number: 8,
            title: 'Expansion: Ergative Plurals',
            focus:
              'ukan + ikusi — adds gu/zuek/haiek to the ergative ("nor-nork") paradigm, framed as "the plural moved — now it\'s a suffix"',
            payload: '"We have a car." (Auto bat dugu)',
            status: 'available',
            lessonIds: ['ukan-present-plural', 'ikusi-present-plural', 'ikusi-present-plural-review', 'unit-8-ergative-review'],
          },
          {
            number: 9,
            title: 'ari + izan — The Immediate Continuous',
            focus: 'ari + izan',
            payload: '"What are you doing?" (Zer egiten ari zara?)',
            status: 'available',
            lessonIds: ['ari-present', 'unit-4-review'],
          },
        ],
      },
      {
        id: 'phase-1-gate-a',
        title: 'Refresh Gate A — The "Ez" Trap',
        units: [
          {
            number: 10,
            title: 'REFRESH — The Inversion Matrix',
            focus: 'Negation drills across Units 1–9 — zero new verbs',
            status: 'available',
            gate: true,
            lessonIds: ['unit-5-review-1', 'unit-5-review-2', 'unit-5-review-3'],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase II',
    subtitle: 'Transitivity & Everyday Life',
    stages: [
      {
        id: 'phase-2-stage-3',
        title: 'Stage 3 — Looking Back I',
        units: [
          // Unit 11 ("What Just Happened") is the on-ramp into the past
          // system: the present perfect (Lehenaldiko Burutua) is the
          // perfective participle + a *present* auxiliary (`etorri naiz` /
          // `ikusi dut`), so it introduces the participle while reusing the
          // already-known present auxiliaries (Units 1/2) — zero new
          // auxiliary. Units 12/14 then swap that same participle onto the
          // *past* auxiliary (`etorri nintzen` / `ikusi nuen`), foregrounding
          // the recency contrast (`gaur etorri da` vs. `atzo etorri zen`)
          // that the `atzo`-only past-frame fix had to sidestep. Inserted
          // here per the present-perfect placement analysis (shifted every
          // later unit +1; #296's later "Carrying & Bringing" reposition
          // shifted everything from Unit 15 on +1 again, so gates are now
          // B-22, C-29, D-41) — see `docs/DECISIONS.md`. Data tables landed
          // in #281; lessons in #282.
          {
            number: 11,
            title: 'The Present Perfect (Lehenaldiko Burutua) — What Just Happened',
            focus:
              'Lehenaldiko Burutua — perfective participle + present auxiliary (etorri naiz / ikusi dut), taught on a known core (izan/etorri + ikusi); the recency contrast gaur ... da vs. atzo ... zen',
            payload: '"I have come / I came today." (Gaur etorri naiz)',
            status: 'available',
            lessonIds: [
              'izan-present-perfect-pool',
              'izan-present-perfect-pool-plural',
              'ikusi-present-perfect',
              'ikusi-present-perfect-plural',
              'unit-11-review',
            ],
          },
          {
            number: 12,
            title: 'The "izan" Past Pool — Looking Back I',
            focus: 'the izan past auxiliary (nintzen/zinen/zen/ginen/zineten/ziren), mixed across izan, joan, etorri, ibili',
            payload: '"I was young."',
            status: 'available',
            lessonIds: ['izan-past-pool', 'izan-past-pool-plural'],
          },
        ],
      },
      {
        id: 'phase-2-stage-4',
        title: 'Stage 4 — Daily Actions',
        units: [
          {
            number: 13,
            title: 'The NOR-NORK Present — dut/duzu/du',
            focus:
              'the ukan present auxiliary (dut/duzu/du/dugu/duzue/dute), mixed across jan, edan, erosi, ikusi, hartu — first -tzen/-ten minimal pair (jaten vs. hartzen); plus the NOR-number axis (dut vs. ditut) across ukan, jan, edan, erosi, hartu, ikusi, eduki',
            payload: '"I ate."',
            status: 'available',
            lessonIds: [
              'unit-10-present',
              'unit-10-present-plural',
              'nor-nork-present-plural-pool',
              'nor-nork-present-plural-pool-plural',
            ],
          },
          {
            number: 14,
            title: 'The NOR-NORK Past — nuen/zenuen/zuen',
            focus:
              'the ukan past auxiliary (nuen/zenuen/zuen/genuen/zenuten/zuten), mixed across ukan, jan, edan, erosi, ikusi, jakin; plus the NOR-number axis in the past (zenuen vs. zenituen) across ukan, jan, edan, erosi, hartu, ikusi, eduki',
            payload: '"I had a car."',
            status: 'available',
            lessonIds: [
              'ukan-past-pool',
              'ukan-past-pool-plural',
              'nor-nork-past-plural-pool',
              'nor-nork-past-plural-pool-plural',
            ],
          },
          // Unit 15 (#350, new) — the non-3rd-person object: `ukan`/`maite`'s
          // `presentByObject`/`pastByObject` tables (#346/#347/#348) let the
          // object (NOR) be ni/zu/zuek/haiek, not just the default `hura`
          // every earlier unit fixes it to. Placed directly after Unit 14
          // (the NOR-NORK past) since it's a direct extension of the same
          // ukan-driven NOR-NORK paradigm, and ahead of `eraman`/`ekarri`
          // (now Unit 16) since those are plain synthetic NOR-NORK verbs
          // that don't touch the object axis at all — every later unit
          // shifted +1 to make room (Gates B/C/D: 22/31/43 -> 23/32/44).
          // `maite izan` ("Maite zaitut" — "I love you") is the unit's
          // payoff: the first sentence in the whole journey where the
          // *object*, not just the subject, isn't `hura`. See
          // `docs/DECISIONS.md` for the placement decision and
          // `docs/EXERCISE_ENGINE.md` for the unit's original `ukan`/`maite`-
          // only scope. #378/#379 then gave `ikusi`/`jan`/`edan`/`erosi`/
          // `hartu` their own `presentByObject`/`pastByObject` tables and
          // #380 taught `generateCrossVerbQuestions` to pool `objectAxis`
          // sources, so #381 extended this unit's `lessonIds` with a pooled
          // review spanning all seven verbs, per the #286 "extend the
          // existing unit, don't add a new one" precedent — this is more of
          // what Unit 15 already teaches, not a new grammatical relation.
          // #416 then extended the reverse-direction block (NORK fixed at
          // hura/gu/zu/zuek/haiek) but scoped it to `ukan`/`maite` only,
          // which left it wall-to-wall those two verbs; #435 rotated the
          // practice verb per NORK/tense slot across the full seven-verb set
          // and added a pooled review per NORK value, matching what #381
          // already did for `fixed: 'ni'`. See `docs/DECISIONS.md`.
          {
            number: 15,
            title: 'maite izan — Loving Someone (The Non-3rd-Person Object)',
            focus:
              "ukan/maite/ikusi/jan/edan/erosi/hartu's presentByObject/pastByObject tables (#346/#347/#348/#378/#379) — the object (NOR) shifts off the default hura to ni/zu/zuek/haiek, with nork fixed at ni, plus a pooled review (#380/#381) drawing distractors across all seven verbs; #416/#435 then drill the reverse direction (someone/something acting on me/us/you) by fixing nork at hura/gu/zu/zuek/haiek in turn, rotating the practice verb across the full seven-verb set and adding a pooled review per NORK value",
            payload: '"I love you." (Maite zaitut.) / "It surprised me." (Harritu nau.)',
            status: 'available',
            lessonIds: [
              'ukan-object-axis-present',
              'maite-object-axis-present',
              'ukan-object-axis-past',
              'maite-object-axis-past',
              'object-axis-present-review',
              'object-axis-past-review',
              'ukan-object-axis-present-hura',
              'maite-object-axis-past-hura',
              'object-axis-present-review-hura',
              'object-axis-past-review-hura',
              'ikusi-object-axis-present-gu',
              'jan-object-axis-past-gu',
              'object-axis-present-review-gu',
              'object-axis-past-review-gu',
              'edan-object-axis-present-zu',
              'erosi-object-axis-past-zu',
              'object-axis-present-review-zu',
              'object-axis-past-review-zu',
              'hartu-object-axis-present-zuek',
              'ukan-object-axis-past-zuek',
              'object-axis-present-review-zuek',
              'object-axis-past-review-zuek',
              'maite-object-axis-present-haiek',
              'ikusi-object-axis-past-haiek',
              'object-axis-present-review-haiek',
              'object-axis-past-review-haiek',
            ],
          },
          // Unit 16 ("Carrying & Bringing") moved here from the Phase VII
          // bonus tail (formerly Unit 43) — see #296. `eraman`/`ekarri` are
          // plain nor-nork synthetic verbs in the already-taught
          // eduki/jakin shape, with no new grammatical relation to
          // introduce, so they belong alongside Stage 4's other everyday
          // transitive verbs rather than after the genuinely niche Units
          // 42-43 (rare synthetics, weather idioms). Lesson ids are
          // unchanged from their #262 original names despite the
          // renumber, per the "lesson ids stay stable across renumbers"
          // precedent (#137).
          {
            number: 16,
            title: 'eraman/ekarri — More NOR-NORK Synthetics',
            focus: 'eraman ("to carry/take") + ekarri ("to bring") — nor-nork synthetic verbs in the already-taught eduki/jakin shape, present + past',
            payload: 'Nik nire txakurra daramat mendira.',
            status: 'available',
            lessonIds: [
              'eraman-present',
              'eraman-present-plural',
              'ekarri-present',
              'ekarri-present-plural',
              'eraman-past',
              'eraman-past-plural',
              'ekarri-past',
              'ekarri-past-plural',
              'unit-42-review',
              'unit-42-review-plural',
            ],
          },
        ],
      },
      {
        id: 'phase-2-stage-5',
        title: 'Stage 5 — Possessions & Looking Back II',
        units: [
          {
            number: 17,
            title: 'eduki — Physical States & Possessions',
            focus: 'eduki — full 6-person grid; ibili gains gu/zuek/haiek (present introduced in Unit 6)',
            payload: '"I have the keys in my pocket."',
            status: 'available',
            lessonIds: [
              'eduki-present',
              'eduki-present-plural',
              'ibili-present-plural',
              'unit-8-review',
              'unit-8-review-plural',
            ],
          },
          {
            number: 18,
            title: 'eduki — "I Had It" (Simple Past)',
            focus: 'eduki — simple past, its own synthetic paradigm (neukan, zeneukan, zeukan, geneukan, zeneukaten, zeukaten)',
            payload: '"I had the keys."',
            status: 'available',
            lessonIds: ['eduki-past', 'eduki-past-review', 'eduki-past-plural', 'eduki-past-plural-review'],
          },
          {
            number: 19,
            title: 'egon — "I Was There" (Simple Past)',
            focus: 'egon — simple past, its own synthetic paradigm (nengoen, zeunden, zegoen, geunden, zeundeten, zeuden)',
            payload: '"I was at home."',
            status: 'available',
            lessonIds: ['egon-past', 'egon-past-review', 'egon-past-plural', 'egon-past-plural-review'],
          },
        ],
      },
      {
        id: 'phase-2-stage-6',
        title: 'Stage 6 — The Future (Geroa)',
        units: [
          // #423 collapsed the old Units 20-21 into this one unit: `joan`'s
          // separate full future drill was trimmed (its "naiz"-pattern future
          // already gets drilled side by side with `izan`'s in
          // `future-intro-review`, so a dedicated `joan-future` lesson taught
          // nothing new), `ukan-future` stays as its own lesson specifically
          // *because* `ukan`'s future is the one suppletive exception
          // (`izango`, not a derived "ukango") worth calling out with
          // dedicated practice rather than silently folding into a mechanical
          // pool, and the old three themed mixer pairs + capstone were
          // replaced by one pooled review (`future-mixer-pool`, + plural
          // sibling) spanning every fodder verb's `future` table — the
          // engine's existing `CARRIERS_PER_SESSION` sampling (`App.jsx`)
          // already bounds session length regardless of pool size, so there
          // was no pedagogical reason to keep curating a small hand-picked
          // subset. `future-mixer-pool` also carries `suffixChoice: true`,
          // adding a handful of "pick -ko or -go" recognition questions that
          // isolate the one genuinely new skill the future teaches (see
          // `generateSuffixChoiceQuestions`, `lessonLogic.js`) — `ukan` is
          // excluded from those specifically, since its future isn't actually
          // derived from its own stem. See `docs/DECISIONS.md`.
          {
            number: 20,
            title: 'izan/ukan — The Future Rule, Across Every Verb',
            focus:
              'forming the future with -ko/-go + present auxiliaries — first -ko/-go minimal pair (izango vs. etorriko), ukan called out as the one suppletive exception (izango, not "ukango"); #417 adds the NOR-number axis (izango dut vs. izango ditut); #423 pools the rule across every fodder verb\'s future table plus a dedicated -ko/-go suffix-choice question',
            payload: '"I will be a teacher" (irakasle izango naiz)',
            status: 'available',
            lessonIds: [
              'izan-future',
              'izan-future-plural',
              'ukan-future',
              'ukan-future-plural',
              'future-intro-review',
              'future-intro-review-plural',
              'nor-nork-future-plural-pool',
              'nor-nork-future-plural-pool-plural',
              'future-mixer-pool',
              'future-mixer-pool-plural',
            ],
          },
          {
            number: 21,
            title: 'behar — Requirements & Obligations',
            focus: 'behar + ukan, present and future',
            payload: '"I have to go." (Joan behar dut)',
            status: 'available',
            lessonIds: ['behar-present', 'behar-future', 'unit-19-review'],
          },
        ],
      },
      {
        id: 'phase-2-gate-b',
        title: 'Refresh Gate B — The Core Tense Checkpoint',
        units: [
          {
            number: 22,
            title: 'REFRESH — Cumulative Present/Past/Future Mixer',
            focus:
              'Synthetic + periphrastic, positive + negative, present + past + future — zero new verbs, score-gated (bestStars >= 2 to continue)',
            status: 'available',
            gate: true,
            lessonIds: [
              'unit-20-review-1',
              'unit-20-review-2',
              'unit-20-review-3',
              'unit-20-review-4',
              'unit-20-review-5',
              'unit-20-review-6',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase III',
    subtitle: 'Shifting to the Past',
    stages: [
      {
        id: 'phase-3-stage-7',
        title: 'Stage 7 — Aspect in the Past',
        units: [
          {
            number: 23,
            title: 'The Imperfective Past — "I Used To..."',
            focus:
              'imperfective/habitual past (etortzen nintzen, "I used to come / I was coming") — distinct from the simple past taught in Units 12/14/17/18',
            payload: '"I used to come here every day."',
            status: 'available',
            lessonIds: [
              'etorri-habitual-past',
              'etorri-habitual-past-plural',
              'ikusi-habitual-past',
              'ikusi-habitual-past-plural',
              'unit-21-review',
            ],
          },
          {
            number: 24,
            title: 'joan/etorri/ibili — Motion in Progress (Past)',
            focus: "joan/etorri/ibili's native imperfective past forms (nindoan, zetorren)",
            payload: '"I was on my way (when...)."',
            status: 'available',
            lessonIds: ['motion-imperfective-past-pool', 'motion-imperfective-past-pool-plural'],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase IV',
    subtitle: 'Interpersonal & Relationship Dynamics',
    stages: [
      {
        id: 'phase-4-stage-8',
        title: 'Stage 8 — The Dative Shift (NOR-NORI)',
        units: [
          {
            number: 25,
            title: 'The NOR-NORI Present — zait/zaizu/zaio',
            focus:
              'present NOR-NORI (zait/zaizu/zaio/zaigu/zaizue/zaie) — gustatu/iruditu/ahaztu, plus their plural-NOR (zaizkit) number split; ends with a case-frame buffer lesson and a pooled mixer review (#385) widening the pattern past the three founding verbs to jarraitu/jario, ahead of Unit 28\'s ditransitive jump',
            payload: '"I like this." (Hau gustatzen zait)',
            status: 'available',
            lessonIds: [
              'gustatu-present',
              'iruditu-present',
              'ahaztu-present',
              'gustatu-present-plural',
              'iruditu-present-plural',
              'ahaztu-present-plural',
              'unit-23-number-split-review',
              'unit-23-case-frame-buffer',
              'nor-nori-present-pool',
            ],
          },
          {
            number: 26,
            title: 'NOR-NORI Past & Future — Dative Across Time',
            focus:
              'NOR-NORI past + future — recombines Unit 25\'s dative grid with the periphrastic past and -ko/-go future; ends with a pooled mixer review (#385), mirroring Unit 25\'s present pool',
            payload: '"I liked it yesterday." (Atzo gustatu zitzaidan)',
            status: 'available',
            lessonIds: [
              'gustatu-past',
              'gustatu-future',
              'iruditu-past',
              'iruditu-future',
              'ahaztu-past',
              'ahaztu-future',
              'nor-nori-past-pool',
            ],
          },
          // Unit 27 (#358/#359, new; renumbered from 28 by #423's Future-unit
          // collapse) — the non-3rd-person NOR: `gustatu`/`iruditu`/`ahaztu`'s
          // `presentByNor`/`pastByNor` tables (#358) let NOR be ni/gu/zuek,
          // not just the default hura/haiek every earlier NOR-NORI lesson
          // fixes it to (Units 25-26 only ever vary NORI).
          // Placed directly after Unit 26 rather than after Stage 9's
          // ditransitive jump (now Unit 28) — it directly contrasts with what
          // the learner just finished (stimulus-is-3rd-person) while staying
          // in the same dative-shift stage, mirroring #350's placement of its
          // NOR-NORK sibling unit right after the paradigm it extends. Every
          // later unit shifted +1 to make room (Gates C/D: 32/44 -> 33/45 at
          // the time; #423 later shifted them back down to 32/44).
          // `objectAxis: { vary: 'nor', fixed: 'zu' }` pins NORI at `zu`
          // (the unit's payoff dative person) and varies NOR across
          // `ni`/`gu`/`zuek` — `zu` itself is the reflexive gap, and `hura`
          // as NOR is already covered by Units 25-26's flat tables. No
          // #441 widened this unit to a 4-verb pool (gustatu/iruditu/ahaztu/
          // jarraitu — `jario` stays out, thing-NOR per #442) and added a
          // pooled cross-verb review per nori value, closing the
          // `generateCrossVerbQuestions`/`objectAxis` gap #347/#350 left open
          // here. See `docs/DECISIONS.md` for the placement decision.
          {
            number: 27,
            title: 'The NOR-NORI Object Axis — natzaizu/gatzaizu',
            focus:
              "the NOR-NORI object axis (natzaizu/gatzaizu/zaizkizu) — gustatu/iruditu/ahaztu's presentByNor/pastByNor tables (#358) shift NOR off the default hura/haiek to ni/gu/zuek, with nori fixed at zu; #419 then drills the rest of the table by fixing nori at ni/hura/gu/zuek/haiek in turn; #441 widens the pool to jarraitu and adds a pooled cross-verb review for each nori value",
            payload: '"Do you like me?" (Gustatzen natzaizu?) / "I like him." (Gustatzen natzaio.)',
            status: 'available',
            lessonIds: [
              'gustatu-nor-axis-present',
              'iruditu-nor-axis-present',
              'ahaztu-nor-axis-present',
              'gustatu-nor-axis-past',
              'iruditu-nor-axis-past',
              'ahaztu-nor-axis-past',
              'nor-axis-present-review-zu',
              'nor-axis-past-review-zu',
              'gustatu-nor-axis-present-ni',
              'iruditu-nor-axis-present-ni',
              'ahaztu-nor-axis-present-ni',
              'gustatu-nor-axis-past-ni',
              'iruditu-nor-axis-past-ni',
              'ahaztu-nor-axis-past-ni',
              'nor-axis-present-review-ni',
              'nor-axis-past-review-ni',
              'gustatu-nor-axis-present-hura',
              'iruditu-nor-axis-present-hura',
              'ahaztu-nor-axis-present-hura',
              'gustatu-nor-axis-past-hura',
              'iruditu-nor-axis-past-hura',
              'ahaztu-nor-axis-past-hura',
              'nor-axis-present-review-hura',
              'nor-axis-past-review-hura',
              'gustatu-nor-axis-present-gu',
              'iruditu-nor-axis-present-gu',
              'ahaztu-nor-axis-present-gu',
              'gustatu-nor-axis-past-gu',
              'iruditu-nor-axis-past-gu',
              'ahaztu-nor-axis-past-gu',
              'nor-axis-present-review-gu',
              'nor-axis-past-review-gu',
              'gustatu-nor-axis-present-zuek',
              'iruditu-nor-axis-present-zuek',
              'ahaztu-nor-axis-present-zuek',
              'gustatu-nor-axis-past-zuek',
              'iruditu-nor-axis-past-zuek',
              'ahaztu-nor-axis-past-zuek',
              'nor-axis-present-review-zuek',
              'nor-axis-past-review-zuek',
              'gustatu-nor-axis-present-haiek',
              'iruditu-nor-axis-present-haiek',
              'ahaztu-nor-axis-present-haiek',
              'gustatu-nor-axis-past-haiek',
              'iruditu-nor-axis-past-haiek',
              'ahaztu-nor-axis-past-haiek',
              'nor-axis-present-review-haiek',
              'nor-axis-past-review-haiek',
            ],
          },
        ],
      },
      {
        id: 'phase-4-stage-9',
        title: 'Stage 9 — Communication & Giving (NOR-NORI-NORK)',
        units: [
          {
            number: 28,
            title: 'The NOR-NORI-NORK Present — diot/diozu/dio',
            focus: 'present NOR-NORI-NORK (esan, eman), axis-scaffolded — each lesson fixes one axis (NORK or NORI) before recombining both, plus plural-object (-zki-) fodder and extra-practice reviews; #334 adds a pooled present carrier for the ditransitive optionally-dative fodder (saldu/utzi/adierazi/eskatu/galdetu)',
            payload: '"I give it to him." (Ematen diot)',
            status: 'available',
            lessonIds: [
              'esan-present', 'eman-present',
              'esan-present-plural', 'eman-present-plural',
              'unit-25-fix-nori-review', 'unit-25-fix-nork-review',
              'unit-25-object-number-review', 'unit-25-two-axis-review',
              'ditransitive-dative-present', 'ditransitive-dative-present-plural',
            ],
          },
          {
            number: 29,
            title: 'NOR-NORI-NORK Past & Future — Telling & Giving Across Time',
            focus: 'NOR-NORI-NORK past + future — reuses the periphrastic past and -ko/-go future on the axis-fixed slices from Unit 25; #334 adds pooled past/future/review carriers for the same ditransitive fodder',
            payload: '"I told him." (Esan nion)',
            status: 'available',
            lessonIds: [
              'esan-past', 'esan-future', 'eman-past', 'eman-future',
              'esan-past-plural', 'eman-past-plural',
              'ditransitive-dative-past', 'ditransitive-dative-past-plural',
              'ditransitive-dative-future', 'ditransitive-dative-future-plural',
              'ditransitive-dative-review', 'ditransitive-dative-review-plural',
            ],
          },
          {
            number: 30,
            title: 'The "egin" Construction',
            focus: 'hitz/lan/lo/ahaleginak egin, parte/kontuan hartu, arreta eman, ados egon, arriskuan jarri — invariant noun/particle + conjugated auxiliary, same shape as nahi/behar izan; placed here as the first unit after egin/hartu (Units 13-14) and eman (Units 28-29) are all individually taught, since this construction draws on all four',
            payload: 'Euskaraz hitz egiten dut.',
            status: 'available',
            lessonIds: [
              'egin-construction-present',
              'egin-construction-present-plural',
              'egin-construction-past',
              'egin-construction-past-plural',
              'egin-construction-future',
              'egin-construction-future-plural',
              'unit-44-review',
              'unit-44-review-plural',
            ],
          },
          {
            number: 31,
            title: 'Covert-Dative NOR-NORI-NORK — Agentive Verbs',
            focus:
              '#307 — pooled present/past/future for lagundu/ekin/erantzun/deitu/eragin/antzeman plus the dative egin compounds (mesede/kalte/aurre egin), plus itxaron\'s dative reading (#334); reuses the diot-family paradigm from Units 28-29, but with no overt direct object to hint NORI — drilling the exact "covert dative" confusion #293 targets',
            payload: '"I help him." (Laguntzen diot)',
            status: 'available',
            lessonIds: [
              'dative-verb-present', 'dative-verb-present-plural',
              'dative-verb-past', 'dative-verb-past-plural',
              'dative-verb-future', 'dative-verb-future-plural',
              'dative-verb-review', 'dative-verb-review-plural',
            ],
          },
        ],
      },
      {
        id: 'phase-4-gate-c',
        title: 'Refresh Gate C — The Multi-Argument Audit',
        units: [
          {
            number: 32,
            title: 'REFRESH — The Case-Ending Mixer',
            focus: 'Drills NOR/NORK/NORI role-swaps plus dative past/future recombination — zero new verbs, score-gated and a mandatory pass before Phase V',
            status: 'pending',
            gate: true,
          },
        ],
      },
    ],
  },
  {
    id: 'phase-5',
    title: 'Phase V',
    subtitle: 'Nuance, Modality, & Social Context',
    stages: [
      {
        id: 'phase-5-stage-10',
        title: 'Stage 10 — Hypotheticals & Potentials',
        units: [
          {
            number: 33,
            title: 'Ahalera — Permissions & Capability',
            focus: 'dezaket/naiteke contrasted with periphrastic ahal izan/ezin (#410/#411) — production for NOR/NOR-NORK; plus ukan\'s NOR-NORK object axis (zaitzaket-type forms, #352, extended to every NORK value by #424) across all three Ahalera sub-tenses — present, hypothetical, and past; gustatu/iruditu/ahaztu\'s NOR-NORI object axis across the same three sub-tenses, recognition-only for every dative value (#425); esan/eman\'s ditransitive Ahalera (diezaioket-type forms, #366) recognition-only',
            payload: '"I can come." / "I can\'t come."',
            status: 'available',
            lessonIds: [
              'izan-potential', 'ukan-potential', 'unit-28-review',
              'ukan-potential-object-axis-present', 'ukan-potential-object-axis-alegiazkoa',
              'ukan-potential-object-axis-lehenaldia', 'unit-34-object-axis-review',
              'ukan-potential-object-axis-present-hura', 'ukan-potential-object-axis-alegiazkoa-hura',
              'ukan-potential-object-axis-lehenaldia-hura',
              'ukan-potential-object-axis-present-gu', 'ukan-potential-object-axis-alegiazkoa-gu',
              'ukan-potential-object-axis-lehenaldia-gu',
              'ukan-potential-object-axis-present-zu', 'ukan-potential-object-axis-alegiazkoa-zu',
              'ukan-potential-object-axis-lehenaldia-zu',
              'ukan-potential-object-axis-present-zuek', 'ukan-potential-object-axis-alegiazkoa-zuek',
              'ukan-potential-object-axis-lehenaldia-zuek',
              'ukan-potential-object-axis-present-haiek', 'ukan-potential-object-axis-alegiazkoa-haiek',
              'ukan-potential-object-axis-lehenaldia-haiek',
              'gustatu-potential-nor-axis-ni', 'gustatu-potential-nor-axis-zu', 'gustatu-potential-nor-axis-hura', 'gustatu-potential-nor-axis-gu', 'gustatu-potential-nor-axis-zuek', 'gustatu-potential-nor-axis-haiek',
              'gustatu-potential-alegiazkoa-nor-axis-ni', 'gustatu-potential-alegiazkoa-nor-axis-zu', 'gustatu-potential-alegiazkoa-nor-axis-hura', 'gustatu-potential-alegiazkoa-nor-axis-gu', 'gustatu-potential-alegiazkoa-nor-axis-zuek', 'gustatu-potential-alegiazkoa-nor-axis-haiek',
              'gustatu-potential-lehenaldia-nor-axis-ni', 'gustatu-potential-lehenaldia-nor-axis-zu', 'gustatu-potential-lehenaldia-nor-axis-hura', 'gustatu-potential-lehenaldia-nor-axis-gu', 'gustatu-potential-lehenaldia-nor-axis-zuek', 'gustatu-potential-lehenaldia-nor-axis-haiek',
              'iruditu-potential-nor-axis-ni', 'iruditu-potential-nor-axis-zu', 'iruditu-potential-nor-axis-hura', 'iruditu-potential-nor-axis-gu', 'iruditu-potential-nor-axis-zuek', 'iruditu-potential-nor-axis-haiek',
              'iruditu-potential-alegiazkoa-nor-axis-ni', 'iruditu-potential-alegiazkoa-nor-axis-zu', 'iruditu-potential-alegiazkoa-nor-axis-hura', 'iruditu-potential-alegiazkoa-nor-axis-gu', 'iruditu-potential-alegiazkoa-nor-axis-zuek', 'iruditu-potential-alegiazkoa-nor-axis-haiek',
              'iruditu-potential-lehenaldia-nor-axis-ni', 'iruditu-potential-lehenaldia-nor-axis-zu', 'iruditu-potential-lehenaldia-nor-axis-hura', 'iruditu-potential-lehenaldia-nor-axis-gu', 'iruditu-potential-lehenaldia-nor-axis-zuek', 'iruditu-potential-lehenaldia-nor-axis-haiek',
              'ahaztu-potential-nor-axis-ni', 'ahaztu-potential-nor-axis-zu', 'ahaztu-potential-nor-axis-hura', 'ahaztu-potential-nor-axis-gu', 'ahaztu-potential-nor-axis-zuek', 'ahaztu-potential-nor-axis-haiek',
              'ahaztu-potential-alegiazkoa-nor-axis-ni', 'ahaztu-potential-alegiazkoa-nor-axis-zu', 'ahaztu-potential-alegiazkoa-nor-axis-hura', 'ahaztu-potential-alegiazkoa-nor-axis-gu', 'ahaztu-potential-alegiazkoa-nor-axis-zuek', 'ahaztu-potential-alegiazkoa-nor-axis-haiek',
              'ahaztu-potential-lehenaldia-nor-axis-ni', 'ahaztu-potential-lehenaldia-nor-axis-zu', 'ahaztu-potential-lehenaldia-nor-axis-hura', 'ahaztu-potential-lehenaldia-nor-axis-gu', 'ahaztu-potential-lehenaldia-nor-axis-zuek', 'ahaztu-potential-lehenaldia-nor-axis-haiek',
              'unit-34-ditransitive-review',
              'ahal-izan-present', 'ahal-ukan-present', 'ezin-izan-present', 'ezin-ukan-present',
              'unit-34-ahal-ezin-review',
            ],
          },
          {
            number: 34,
            title: 'Baldintza & Ondorioa — Conditionals',
            focus: 'ba- protasis + -ke apodosis — production for NOR/NOR-NORK; plus ukan\'s NOR-NORK object axis (bazintut/zintuket-type forms, #353, extended to every NORK value by #424) across Baldintza and Ondorioa present/past; gustatu/iruditu/ahaztu\'s NOR-NORI object axis across Baldintza and Ondorioa present/past, recognition-only for every dative value (#425); esan/eman\'s ditransitive Baldintza/Ondorioa (balio/nioke-type forms, #366) recognition-only',
            payload: '"If I had money, I would buy that" (Dirua banu, hori erosiko nuke)',
            status: 'available',
            lessonIds: [
              'izan-baldintza', 'izan-conditional', 'ukan-baldintza', 'ukan-conditional', 'unit-29-review',
              'ukan-baldintza-object-axis', 'ukan-conditional-object-axis', 'ukan-conditional-past-object-axis',
              'unit-35-object-axis-review',
              'ukan-baldintza-object-axis-hura', 'ukan-conditional-object-axis-hura',
              'ukan-conditional-past-object-axis-hura',
              'ukan-baldintza-object-axis-gu', 'ukan-conditional-object-axis-gu',
              'ukan-conditional-past-object-axis-gu',
              'ukan-baldintza-object-axis-zu', 'ukan-conditional-object-axis-zu',
              'ukan-conditional-past-object-axis-zu',
              'ukan-baldintza-object-axis-zuek', 'ukan-conditional-object-axis-zuek',
              'ukan-conditional-past-object-axis-zuek',
              'ukan-baldintza-object-axis-haiek', 'ukan-conditional-object-axis-haiek',
              'ukan-conditional-past-object-axis-haiek',
              'gustatu-baldintza-nor-axis-ni', 'gustatu-baldintza-nor-axis-zu', 'gustatu-baldintza-nor-axis-hura', 'gustatu-baldintza-nor-axis-gu', 'gustatu-baldintza-nor-axis-zuek', 'gustatu-baldintza-nor-axis-haiek',
              'gustatu-conditional-nor-axis-ni', 'gustatu-conditional-nor-axis-zu', 'gustatu-conditional-nor-axis-hura', 'gustatu-conditional-nor-axis-gu', 'gustatu-conditional-nor-axis-zuek', 'gustatu-conditional-nor-axis-haiek',
              'gustatu-conditional-past-nor-axis-ni', 'gustatu-conditional-past-nor-axis-zu', 'gustatu-conditional-past-nor-axis-hura', 'gustatu-conditional-past-nor-axis-gu', 'gustatu-conditional-past-nor-axis-zuek', 'gustatu-conditional-past-nor-axis-haiek',
              'iruditu-baldintza-nor-axis-ni', 'iruditu-baldintza-nor-axis-zu', 'iruditu-baldintza-nor-axis-hura', 'iruditu-baldintza-nor-axis-gu', 'iruditu-baldintza-nor-axis-zuek', 'iruditu-baldintza-nor-axis-haiek',
              'iruditu-conditional-nor-axis-ni', 'iruditu-conditional-nor-axis-zu', 'iruditu-conditional-nor-axis-hura', 'iruditu-conditional-nor-axis-gu', 'iruditu-conditional-nor-axis-zuek', 'iruditu-conditional-nor-axis-haiek',
              'iruditu-conditional-past-nor-axis-ni', 'iruditu-conditional-past-nor-axis-zu', 'iruditu-conditional-past-nor-axis-hura', 'iruditu-conditional-past-nor-axis-gu', 'iruditu-conditional-past-nor-axis-zuek', 'iruditu-conditional-past-nor-axis-haiek',
              'ahaztu-baldintza-nor-axis-ni', 'ahaztu-baldintza-nor-axis-zu', 'ahaztu-baldintza-nor-axis-hura', 'ahaztu-baldintza-nor-axis-gu', 'ahaztu-baldintza-nor-axis-zuek', 'ahaztu-baldintza-nor-axis-haiek',
              'ahaztu-conditional-nor-axis-ni', 'ahaztu-conditional-nor-axis-zu', 'ahaztu-conditional-nor-axis-hura', 'ahaztu-conditional-nor-axis-gu', 'ahaztu-conditional-nor-axis-zuek', 'ahaztu-conditional-nor-axis-haiek',
              'ahaztu-conditional-past-nor-axis-ni', 'ahaztu-conditional-past-nor-axis-zu', 'ahaztu-conditional-past-nor-axis-hura', 'ahaztu-conditional-past-nor-axis-gu', 'ahaztu-conditional-past-nor-axis-zuek', 'ahaztu-conditional-past-nor-axis-haiek',
              'unit-35-ditransitive-review',
            ],
          },
        ],
      },
      {
        id: 'phase-5-stage-11',
        title: 'Stage 11 — Directives & Wishes',
        units: [
          // #364: extended (not split into a new unit) with gustatu/iruditu/
          // ahaztu's NOR-NORI object axis (imperativeByNor, "bekio"/"zakio"-
          // type forms) — unlike Unit 27's present/past split, the grammar
          // gap (no ni/gu cells, hi deferred) makes this a single small
          // axis, not worth its own unit. See docs/DECISIONS.md.
          // #368: filled in the rest of the Agintera picture in the same
          // unit — ukan's jussive/hortative and plural-object cells,
          // esan/eman's ditransitive forms (recognition-only), and
          // egon/etorri/joan's imperative (= present tense). See
          // docs/DECISIONS.md.
          {
            number: 35,
            title: 'Agintera — Commands',
            focus: 'the imperative — izan/ukan production for NOR/NOR-NORK (including jussive/hortative and plural-object); egon/etorri/joan production; gustatu/iruditu/ahaztu\'s NOR-NORI object axis (#364, bekio/zakio-type forms, extended to every dative value by #425); esan/eman\'s ditransitive (iezadazu) recognition-only',
            payload: 'Hadi hona!',
            status: 'available',
            lessonIds: [
              'izan-imperative', 'ukan-imperative', 'unit-30-review',
              'gustatu-imperative-axis', 'iruditu-imperative-axis', 'ahaztu-imperative-axis',
              'gustatu-imperative-axis-ni', 'gustatu-imperative-axis-hura', 'gustatu-imperative-axis-gu', 'gustatu-imperative-axis-zuek', 'gustatu-imperative-axis-haiek',
              'iruditu-imperative-axis-ni', 'iruditu-imperative-axis-hura', 'iruditu-imperative-axis-gu', 'iruditu-imperative-axis-zuek', 'iruditu-imperative-axis-haiek',
              'ahaztu-imperative-axis-ni', 'ahaztu-imperative-axis-hura', 'ahaztu-imperative-axis-gu', 'ahaztu-imperative-axis-zuek', 'ahaztu-imperative-axis-haiek',
              'egon-imperative', 'etorri-imperative', 'joan-imperative',
              'unit-30-plural-object-review', 'unit-30-ditransitive-review',
            ],
          },
          {
            number: 36,
            title: 'Purpose & Wishing (Subjuntiboa)',
            focus: 'the subjunctive as a construction (matrix verb + subordinate clause) — NOR/NOR-NORK 3rd-person in-construction production, dative/ditransitive recognition-only',
            payload: 'Nahi dut etor dadin. · Esan dio etor dadila. · ...ikus dezan.',
            status: 'available',
            lessonIds: [
              'izan-subjunctive-present', 'ukan-subjunctive-present', 'unit-36-review',
              'unit-36-dative-review', 'unit-36-ditransitive-review',
            ],
          },
        ],
      },
      {
        id: 'phase-5-stage-12',
        title: 'Stage 12 — The Intimate Register (hi + Hitanoa)',
        units: [
          {
            number: 37,
            title: 'hi — Meet "hi"',
            focus: 'hi as a subject in known paradigms, plus hi-as-NORK\'s own gender split',
            payload: 'Hi ikaslea haiz.',
            status: 'available',
            lessonIds: ['unit-32-hi-present', 'unit-32-hi-past', 'unit-32-hi-nork-present'],
          },
          {
            number: 38,
            title: 'Toka (Masculine Allocutive)',
            focus: 'addressee-agreement on 3rd-person statements, masculine register',
            payload: 'Lanean dik.',
            status: 'available',
            lessonIds: ['izan-present-toka', 'ukan-present-toka', 'izan-past-toka', 'ukan-past-toka', 'unit-33-review'],
          },
          {
            number: 39,
            title: 'Noka (Feminine Allocutive)',
            focus: 'taught as the -k → -n transform of Unit 34\'s toka forms, feminine register',
            payload: 'Lanean din.',
            status: 'available',
            lessonIds: ['izan-present-noka', 'ukan-present-noka', 'izan-past-noka', 'ukan-past-noka', 'unit-34-review'],
          },
          {
            number: 40,
            title: 'Hitanoa Recombined',
            focus: 'mixed toka/noka chosen by addressee gender, plus when not to use it — suppressed in subordinate clauses and formal -ke- moods',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-5-stage-13',
        title: 'Stage 13 — Reading Real Text',
        units: [
          {
            number: 41,
            title: 'The Passive nor-shift — Reading Real Text',
            focus: 'non-finite forms, nor-shift (ireki dut → ireki da) — comprehension over real sentences, recognition-only throughout',
            payload: 'Nik atea ireki dut. → Atea ireki da.',
            status: 'available',
            lessonIds: ['unit-36-reading', 'unit-36-reading-nonfinite'],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-6',
    title: 'Phase VI',
    subtitle: 'Making Things Happen (Causatives)',
    stages: [
      {
        id: 'phase-6-stage-14',
        title: 'Stage 14 — The Causative Suffix (-arazi)',
        units: [
          {
            number: 42,
            title: 'Making Someone Do It',
            focus: '-arazi on intransitives (nor → nor-nork), present/past/future',
            payload: 'Ekaitzak mendizaleak itzularazi zituen. · Musikak umeak dantzarazi ditu.',
            status: 'available',
            lessonIds: [
              'itzularazi-present',
              'itzularazi-past',
              'itzularazi-future',
              'dantzarazi-present',
              'dantzarazi-past',
              'dantzarazi-future',
              'unit-42-causative-review',
            ],
          },
          {
            number: 43,
            title: 'Making Someone Do Something to Someone',
            focus: '-arazi on transitives (nor-nork → nor-nori-nork), present/past/future',
            payload: 'Amonak umeei babarrunak janarazi zizkien. · Irakasleak ikasleei hori idatzarazi die.',
            status: 'available',
            lessonIds: [
              'janarazi-present',
              'janarazi-past',
              'janarazi-future',
              'idatzarazi-present',
              'idatzarazi-past',
              'idatzarazi-future',
              'unit-43-causative-review',
            ],
          },
        ],
      },
      {
        id: 'phase-6-gate-d',
        title: 'Refresh Gate D — The Causative Recombination',
        units: [
          {
            number: 44,
            title: 'REFRESH — Causatives Across Tenses & Moods',
            // Scoped to present/past/future (mirroring Unit 22 gate's own
            // scope) rather than also recombining conditional/imperative —
            // those moods would need new causative conjugation tables of
            // their own (CONJUGATIONS.md §17.4), out of scope for this gate.
            focus: 'Recombines Units 42–43\'s -arazi forms across present/past/future — zero new verbs, score-gated',
            status: 'available',
            gate: true,
            lessonIds: ['unit-44-review-1', 'unit-44-review-2'],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-7',
    title: 'Phase VII',
    subtitle: 'Bonus: Curiosities & Color',
    stages: [
      {
        id: 'phase-7-stage-15',
        title: 'Stage 15 — Verbs That Don\'t Need an Auxiliary',
        units: [
          {
            number: 45,
            title: 'Synthetic Curiosities',
            focus: 'jario (nor-nori, "dario"/"zerion"), etzan (nor, "datza"), irudi (nor-nork, "dirudi") — rare native-synthetic verbs, recognition-only',
            payload: 'Malkoak dario. · Zertan datza ariketa? · Nekatuta zaude, dirudizu.',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-7-stage-16',
        title: 'Stage 16 — Talking About Weather',
        units: [
          {
            number: 46,
            title: 'Talking About Weather',
            focus: 'ari + ukan ("euria ari du"), izan/egon weather idioms — fixed 3rd person only, zero new conjugation tables',
            payload: 'Euria ari du. · Hotz da. · Eguzkia dago.',
            status: 'pending',
          },
        ],
      },
    ],
  },
]

// The last `lessonIds` entry of every `available`, `gate: true` unit (Units
// 10, 22, 32, 44 — see the `gate: true` note above) — `getUnlockedLessonIds`
// (`src/lessonLogic.js`) treats reaching `GATE_PASS_STARS` on one of these as
// the unlock condition for the lesson that follows it, instead of the regular
// "previous lesson attempted" rule. A `pending` gate has no `lessonIds` yet
// and contributes nothing.
export const GATE_LESSON_IDS = new Set(
  JOURNEY.flatMap((phase) => phase.stages.flatMap((stage) => stage.units))
    .filter((unit) => unit.gate && unit.lessonIds?.length)
    .map((unit) => unit.lessonIds[unit.lessonIds.length - 1]),
)
