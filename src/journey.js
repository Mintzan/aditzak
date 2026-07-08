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
// expansion checkpoints (Units 10, 22, 31, 43 — the present-perfect
// insertion at Unit 11 first shifted Gates B/C/D up by one from the
// `LEARNING_JOURNEY_PROPOSED.md` N-20/N-27/N-39 to 21/28/40, #296's
// "Carrying & Bringing" reposition (old Unit 43 -> new Unit 15) shifted them
// up by one again to 22/29/41, #307's new "Agentive Verbs with a Covert
// Dative" unit (placed after Unit 28, before Gate C) shifted Gates C/D up by
// one more to 30/42, #350's new "non-3rd-person object" unit (inserted
// as Unit 15, after Unit 14's NOR-NORK past) shifted every gate from there on
// up by one more to 10/23/32/44, #359's new "non-3rd-person NOR" unit
// (inserted as Unit 28, after Unit 27's NOR-NORI past/future) shifted Gates
// C/D up by one final time to 33/45, #423's collapse of the old Units
// 20-21 (Future) into one unit shifted every gate from Gate B onward back
// down by one, to 22/32/44, and #440's dissolution of Unit 30 (folded into
// its base-paradigm host units) shifted Gates C/D down by one final time to
// 22/31/43). Most sit between phases/stages, but
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
    title: 'Phase I · A1 — Survive',
    subtitle: 'Survival Present (Me, You, & It)',
    stages: [
      {
        id: 'phase-1-stage-1',
        title: 'Stage 1 — Being, Having & the Ergative Leap',
        units: [
          {
            number: 1,
            title: 'izan & egon — Who and Where',
            focus: 'izan (to be) and egon (to be, to stay), present tense — say who and where you are',
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
            focus:
              'ukan (to have), present tense — your first ergative (-k) subject, for ni/zu/hura. izan/egon\'s subject just is or stays somewhere; ukan\'s subject acts on something else (what you have) — that\'s what earns it the -k',
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
              'Telling plain subjects (izan/egon) apart from ergative -k subjects (ukan): izan/egon\'s subject isn\'t acting on anything, so the -k shouldn\'t creep onto them by mistake (✗ "Nik naiz") — the most common beginner slip',
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
            focus: 'jakin (to know) and nahi (to want) — jakin takes the same ergative endings as ukan',
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
            title: 'NOR-NORK Periphrastic — the -tzen dut Pattern (with ikusi)',
            focus: 'ikusi (to see), present tense — your first two-word verb: ikusten + dut',
            payload: '"I see the mountain."',
            status: 'available',
            lessonIds: ['ikusi-present', 'ikusi-present-review'],
          },
          {
            number: 6,
            title: 'joan/etorri/ibili — The NOR Present',
            focus: 'joan (to go), etorri (to come), and ibili (to walk/move), present tense',
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
              'Adding gu/zuek/haiek (we/you-all/they) to izan, egon, ukan, joan, etorri, and ikusi',
            payload: '"We are teachers." (Irakasleak gara)',
            status: 'available',
            gate: true,
            lessonIds: ['unit-6-review-1', 'unit-6-review-2', 'unit-6-review-3'],
          },
          {
            number: 8,
            title: 'Expansion: Ergative Plurals',
            focus:
              'ukan and ikusi — adds gu/zuek/haiek to the ergative pattern; notice the plural moves from the verb stem to a suffix',
            payload: '"We have a car." (Auto bat dugu)',
            status: 'available',
            lessonIds: ['ukan-present-plural', 'ikusi-present-plural', 'ikusi-present-plural-review', 'unit-8-ergative-review'],
          },
          {
            number: 9,
            title: 'ari + izan — The Immediate Continuous',
            focus: "ari + izan — say what's happening right now, like English \"-ing\"",
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
            focus: 'Turning Units 1–9\'s sentences negative with "ez" — the finite verb flips ahead of the participle once "ez" enters the sentence',
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
    title: 'Phase II · A2 — Everyday Life',
    subtitle: 'Transitivity & Everyday Life',
    stages: [
      {
        id: 'phase-2-stage-3',
        title: 'Stage 3 — Looking Back I',
        units: [
          // Unit 11 ("What Just Happened") is the on-ramp into the past
          // system: the present perfect (Lehenaldi Burutua) is the
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
            title: 'The Present Perfect (Lehenaldi Burutua) — What Just Happened',
            focus:
              'The present perfect (etorri naiz, ikusi dut) — say what just happened, and contrast gaur ("today") with atzo ("yesterday")',
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
            focus: 'The izan past (nintzen/zinen/zen...) — shared by izan, joan, etorri, and ibili',
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
              'The ukan present (dut/duzu/du...) across jan, edan, erosi, ikusi, and hartu — plus dut vs. ditut when the object is plural',
            payload: '"I ate."',
            status: 'available',
            lessonIds: [
              'unit-10-present',
              'unit-10-present-plural',
              'nor-nork-present-plural-pool',
              'nor-nork-present-plural-pool-plural',
            ],
          },
          // #rebalance — "I Like It" promoted from its old Phase IV slot
          // (was Unit 25) into the present cluster, right after the NOR-NORK
          // present. `gustatzen zait` ("I like it") is one of the highest-
          // frequency things in everyday Basque, so it arrives near the start
          // of the journey instead of two thirds of the way through. NOR-NORI
          // *past/future* stays later (Unit 26, "Dative Across Time"). See
          // `docs/LEARNING_JOURNEY_REBALANCE.md`.
          {
            number: 14,
            title: 'NOR-NORI Present — zait (with gustatu: "I Like It")',
            focus:
              'gustatu, iruditu, and ahaztu in the present (zait/zaizu/zaio...) — say what you like, what seems true to you, and what you forget',
            payload: '"I like this." (Hau gustatzen zait)',
            status: 'available',
            lessonIds: [
              'unit-14-present',
              'unit-14-present-expansion',
              'unit-14-present-plural',
              'unit-23-number-split-review',
              'unit-23-case-frame-buffer',
              'nor-nori-present-pool',
            ],
          },
          {
            number: 15,
            title: 'The NOR-NORK Past — nuen/zenuen/zuen',
            focus:
              'The ukan past (nuen/zenuen/zuen...) across ukan, jan, edan, erosi, ikusi, and jakin — plus zenuen vs. zenituen when the object is plural',
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
          // already did for `fixed: 'ni'`. #443 then widened the pool
          // feeding every one of those pooled reviews from seven verbs to
          // ~37 (every #436-composable periphrastic transitive verb in the
          // data, gated by #442's `animateObject` flag for the thing-only/
          // metaphor ones) — standalone practice lessons still rotate a
          // handful of verbs (no single verb dominates), the wide pool lives
          // in the reviews' `sources`, not as 30 new single-verb lessons. See
          // `docs/DECISIONS.md`.
          {
            number: 16,
            title: 'NOR-NORK — Non-3rd-Person Objects (with maite: "I Love You")',
            focus:
              'ukan, maite, ikusi, and more — say "I love you" instead of always "I love it", by shifting who the object is',
            payload: '"I love you." (Maite zaitut.) / "It surprised me." (Harritu nau.)',
            // #rebalance: the "reverse direction" object-axis blocks (someone/
            // something acting on me/us/you — NORK fixed at hura/gu/zu/zuek/
            // haiek) moved out of this spine unit into the opt-in Bonus unit
            // "The Object Axis in Depth" (`phase-bonus-stage-axes`), leaving
            // Unit 15 as the tight forward-direction unit ("Maite zaitut") it
            // was meant to be (was 26 lessons; now 6). See
            // `docs/LEARNING_JOURNEY_REBALANCE.md`.
            status: 'available',
            lessonIds: [
              'ukan-object-axis-present',
              'maite-object-axis-present',
              'ukan-object-axis-past',
              'maite-object-axis-past',
              'object-axis-present-review',
              'object-axis-past-review',
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
            number: 17,
            title: 'eraman/ekarri — More NOR-NORK Synthetics',
            focus: 'eraman (to carry/take) and ekarri (to bring), present and past — same pattern as eduki and jakin',
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
            number: 18,
            title: 'eduki — Physical States & Possessions',
            focus: 'eduki (to have/hold), all six persons — plus gu/zuek/haiek for ibili',
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
            number: 19,
            title: 'eduki — "I Had It" (Simple Past)',
            focus: 'eduki in the simple past (neukan, zeneukan, zeukan...) — its own conjugation pattern',
            payload: '"I had the keys."',
            status: 'available',
            lessonIds: ['eduki-past', 'eduki-past-review', 'eduki-past-plural', 'eduki-past-plural-review'],
          },
          {
            number: 20,
            title: 'egon — "I Was There" (Simple Past)',
            focus: 'egon in the simple past (nengoen, zeunden, zegoen...) — plus ados egon ("to agree"), which follows the same pattern',
            payload: '"I was at home."',
            status: 'available',
            lessonIds: [
              'ados-egon-present',
              'ados-egon-present-plural',
              'egon-past',
              'ados-egon-past',
              'egon-past-review',
              'egon-past-plural',
              'ados-egon-past-plural',
              'egon-past-plural-review',
            ],
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
            number: 21,
            title: 'izan/ukan — The Future Rule, Across Every Verb',
            focus:
              'The future with -ko/-go — izan and ukan lead the way (ukan\'s izango is the one exception to learn by heart), then the same rule across every verb you know',
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
            number: 22,
            title: 'behar — Requirements & Obligations',
            focus: 'behar (to need/have to) with ukan, present and future',
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
            number: 23,
            title: 'REFRESH — Cumulative Present/Past/Future Mixer',
            focus:
              'Mixing present, past, and future, positive and negative, so you tell the three tenses apart instead of guessing from context. Score at least 2 stars to move on',
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
    title: 'Phase III · B1 — Into the Past',
    subtitle: 'Shifting to the Past',
    stages: [
      {
        id: 'phase-3-stage-7',
        title: 'Stage 7 — Aspect in the Past',
        units: [
          {
            number: 24,
            title: 'The Imperfective Past — "I Used To..."',
            focus:
              'The habitual past (etortzen nintzen, "I used to come") — different from the simple past you already know',
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
            number: 25,
            title: 'joan/etorri/ibili — Motion in Progress (Past)',
            focus: "joan, etorri, and ibili's own past-in-progress forms (nindoan, zetorren...)",
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
    title: 'Phase IV · B1 — People & Relationships',
    subtitle: 'Interpersonal & Relationship Dynamics',
    stages: [
      {
        id: 'phase-4-stage-8',
        title: 'Stage 8 — The Dative Shift (NOR-NORI)',
        units: [
          // #rebalance: the NOR-NORI *present* unit ("I Like It") was promoted
          // out of here into Phase II (right after the NOR-NORK present, as
          // Unit 14) so a learner meets `gustatzen zait` near the start. This
          // stage now opens on the dative past/future, recombining that
          // already-known present grid with the past and future tenses.
          {
            number: 26,
            title: 'NOR-NORI Past & Future — Dative Across Time',
            focus:
              'gustatu, iruditu, and ahaztu in the past and future — the same "liking" pattern from Unit 14, now across time',
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
          // here. #469 then collapsed the 36 now-redundant single-verb
          // lessons, mirroring #445/#446's mood-unit collapses, leaving just
          // the 12 pooled reviews. See `docs/DECISIONS.md` for both
          // decisions.
          {
            number: 27,
            title: 'gustatu\'s Other Direction — natzaizu/gatzaizu',
            focus:
              '"I appeal to you" (natzaizu), "we appeal to you" (gatzaizu) — gustatu, iruditu, ahaztu, and jarraitu when the liked thing, not just the person, changes',
            payload: '"Do you like me?" (Gustatzen natzaizu?) / "I like him." (Gustatzen natzaio.)',
            status: 'available',
            lessonIds: [
              'nor-axis-present-review-zu',
              'nor-axis-past-review-zu',
              'nor-axis-present-review-ni',
              'nor-axis-past-review-ni',
              'nor-axis-present-review-hura',
              'nor-axis-past-review-hura',
              'nor-axis-present-review-gu',
              'nor-axis-past-review-gu',
              'nor-axis-present-review-zuek',
              'nor-axis-past-review-zuek',
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
            focus: 'esan (to say/tell) and eman (to give) in the present (diot/diozu/dio...) — your first verbs that track three people at once: who, to whom, and by whom',
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
            focus: 'esan and eman in the past and future — the same three-way pattern from Unit 28, now across time',
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
          // #440 — the former Unit 30 ("The egin Construction") was dissolved:
          // its 9 verbs are plain nor-nork/nor-egon/nor-izan paradigms with an
          // invariant noun/particle glued on, not a new grammatical relation,
          // so they were redistributed into their base-paradigm host units
          // (Units 13/14/19/20) instead of keeping a dedicated unit — see
          // `docs/DECISIONS.md`. Every later unit in Phases IV-VII shifts -1.
          {
            number: 30,
            title: 'Covert-Dative NOR-NORI-NORK — Agentive Verbs',
            focus:
              'lagundu (to help), erantzun (to answer), deitu (to call), and more — verbs that quietly take a "to whom" even without an obvious object',
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
            number: 31,
            title: 'REFRESH — The Case-Ending Mixer',
            focus: 'Telling who\'s the subject (-k), the object, and the recipient apart by their case ending, across NOR, NOR-NORK, NOR-NORI, and NOR-NORI-NORK verbs. A required pass before Phase V',
            status: 'available',
            gate: true,
            lessonIds: [
              'unit-31-mixer-present', 'unit-31-mixer-present-plural',
              'unit-31-mixer-past', 'unit-31-mixer-past-plural',
              'unit-31-mixer-future', 'unit-31-mixer-future-plural',
              'unit-31-dative-recombination',
              'unit-31-review',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-5',
    title: 'Phase V · B2 — Nuance & Modality',
    subtitle: 'Nuance, Modality, & Social Context',
    stages: [
      {
        id: 'phase-5-stage-10',
        title: 'Stage 10 — Hypotheticals & Potentials',
        units: [
          {
            number: 32,
            title: 'Ahalera — Permissions & Capability',
            focus: 'dezaket/naiteke ("I can") alongside ahal izan and ezin ("to be able to" / "can\'t") — say what you can and can\'t do',
            payload: '"I can come." / "I can\'t come."',
            // #rebalance: the NOR-NORK object-axis, NOR-NORI dative-axis, and
            // ditransitive permutations of the potential mood moved out of this
            // spine unit into the opt-in Bonus unit "Potential — The Axes in
            // Depth" (`phase-bonus-stage-moods`). What stays is the core
            // communicative slice: izan/ukan potential across all three
            // sub-tenses plus the periphrastic ahal/ezin (was 51 lessons; now
            // 13). See `docs/LEARNING_JOURNEY_REBALANCE.md`.
            status: 'available',
            lessonIds: [
              'izan-potential', 'ukan-potential', 'unit-28-review',
              'izan-potential-alegiazkoa', 'ukan-potential-alegiazkoa',
              'izan-potential-lehenaldia', 'ukan-potential-lehenaldia',
              'unit-28-alegiazkoa-lehenaldia-review',
              'ahal-izan-present', 'ahal-ukan-present', 'ezin-izan-present', 'ezin-ukan-present',
              'unit-34-ahal-ezin-review',
            ],
          },
          {
            number: 33,
            title: 'Baldintza & Ondorioa — Conditionals',
            focus: '"If..." (ba-) and "would..." (-ke) — build conditional sentences like "If I had money, I would buy that"',
            payload: '"If I had money, I would buy that" (Dirua banu, hori erosiko nuke)',
            // #rebalance: the NOR-NORK object-axis, NOR-NORI dative-axis, and
            // ditransitive permutations of the conditional moved out of this
            // spine unit into the opt-in Bonus unit "Conditionals — The Axes in
            // Depth" (`phase-bonus-stage-moods`). What stays is the core
            // izan/ukan ba-/-ke conditional across present and past (was 46
            // lessons; now 8). See `docs/LEARNING_JOURNEY_REBALANCE.md`.
            status: 'available',
            lessonIds: [
              'izan-baldintza', 'izan-conditional', 'ukan-baldintza', 'ukan-conditional', 'unit-29-review',
              'izan-conditional-past', 'ukan-conditional-past', 'unit-29-conditional-past-review',
            ],
          },
        ],
      },
      {
        id: 'phase-5-stage-11',
        title: 'Stage 11 — Agintera (Commands)',
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
          // #444: the imperative twin of #441 — added jarraitu as this
          // axis's 4th pool member and one pooled cross-verb review per
          // NORI value (`imperative-axis-review-{zu,ni,hura,gu,zuek,haiek}`),
          // mirroring #441's `nor-axis-{present,past}-review-*` for Unit 27.
          // See docs/DECISIONS.md.
          {
            number: 34,
            title: 'Agintera — Commands',
            focus: 'The imperative — give commands with izan, ukan, egon, etorri, and joan',
            payload: 'Hadi hona!',
            // #rebalance: the gustatu/iruditu/ahaztu NOR-NORI dative-axis
            // imperative permutations moved out of this spine unit into the
            // opt-in Bonus unit "Commands — The Axes in Depth"
            // (`phase-bonus-stage-moods`). What stays is the core imperative —
            // izan/ukan (incl. plural-object and ditransitive review) plus
            // egon/etorri/joan (was 32 lessons; now 8). See
            // `docs/LEARNING_JOURNEY_REBALANCE.md`.
            status: 'available',
            lessonIds: [
              'izan-imperative', 'ukan-imperative', 'unit-30-review',
              'egon-imperative', 'etorri-imperative', 'joan-imperative',
              'unit-30-plural-object-review', 'unit-30-ditransitive-review',
            ],
          },
        ],
      },
    ],
  },
  // =========================================================================
  // Bonus — Mastery, Register & Color (#rebalance, see
  // `docs/LEARNING_JOURNEY_REBALANCE.md`). Everything past Agintera (Unit 34)
  // lives here: it is all `bonus: true`, so `getUnlockedLessonIds` (via
  // `BONUS_LESSON_IDS`) never lets it gate the main spine — a learner finishes
  // the core curriculum at Unit 34 and dips into these for deeper morphology
  // (subjunctive, causatives, the axis/mood permutations), register
  // (hi/hitanoa), and color (curiosities, weather). Units stay in ascending
  // order; the lessons keep their original `LESSONS` positions, so each one
  // unlocks once the learner reaches the spine point it branches from.
  // =========================================================================
  {
    id: 'phase-bonus',
    title: 'Bonus — Mastery, Register & Color',
    subtitle: 'Optional deep dives, off the main path — never required to finish the core',
    stages: [
      {
        id: 'phase-bonus-stage-subjunctive',
        title: 'Directives & Wishes — The Subjunctive',
        units: [
          {
            number: 35,
            bonus: true,
            title: 'Purpose & Wishing (Subjuntiboa)',
            focus: 'The subjunctive — say what you want someone else to do, as in "I want him to come"',
            payload: 'Nahi dut etor dadin. · Esan dio etor dadila. · ...ikus dezan.',
            status: 'available',
            lessonIds: [
              'izan-subjunctive-present', 'ukan-subjunctive-present', 'unit-36-review',
              'unit-36-dative-review', 'unit-36-ditransitive-review',
              'izan-subjunctive-past', 'ukan-subjunctive-past', 'unit-36-past-review',
            ],
          },
        ],
      },
      {
        id: 'phase-5-stage-12',
        title: 'Stage 12 — The Intimate Register (hi + Hitanoa)',
        units: [
          {
            number: 36,
            bonus: true,
            title: 'hi — Meet "hi"',
            focus: 'Meet hi, the intimate "you" — and how it splits by the speaker\'s gender when it\'s the subject of ukan-type verbs',
            payload: 'Hi ikaslea haiz.',
            status: 'available',
            lessonIds: ['unit-32-hi-present', 'unit-32-hi-past', 'unit-32-hi-nork-present'],
          },
          {
            number: 37,
            bonus: true,
            title: 'Toka (Masculine Allocutive)',
            focus: 'Toka — the masculine way of subtly flagging hi as your listener, even in sentences about someone else',
            payload: 'Lanean dik.',
            status: 'available',
            lessonIds: ['izan-present-toka', 'ukan-present-toka', 'izan-past-toka', 'ukan-past-toka', 'unit-33-review'],
          },
          {
            number: 38,
            bonus: true,
            title: 'Noka (Feminine Allocutive)',
            focus: 'Noka — the feminine counterpart to toka: swap the -k endings you just learned for -n',
            payload: 'Lanean din.',
            status: 'available',
            lessonIds: ['izan-present-noka', 'ukan-present-noka', 'izan-past-noka', 'ukan-past-noka', 'unit-34-review'],
          },
          {
            number: 39,
            bonus: true,
            title: 'Hitanoa Recombined',
            focus: 'Put toka and noka together — choose the right one for your listener, and learn when to leave hitanoa out',
            status: 'available',
            lessonIds: [
              'unit-39-recombined-present', 'unit-39-recombined-past',
              'unit-39-when-not-to-use', 'unit-39-review',
            ],
          },
        ],
      },
      {
        id: 'phase-5-stage-13',
        title: 'Stage 13 — Reading Real Text',
        units: [
          {
            number: 40,
            bonus: true,
            title: 'The Passive nor-shift — Reading Real Text',
            focus: 'Read real sentences and spot the passive shift: ireki dut ("I opened it") → ireki da ("it opened")',
            payload: 'Nik atea ireki dut. → Atea ireki da.',
            status: 'available',
            lessonIds: ['unit-36-reading', 'unit-36-reading-nonfinite'],
          },
        ],
      },
      {
        id: 'phase-6-stage-14',
        title: 'Stage 14 — The Causative Suffix (-arazi)',
        units: [
          {
            number: 41,
            bonus: true,
            title: 'Making Someone Do It',
            focus: 'The causative -arazi — say you made or had someone do something, e.g. itzularazi ("to make [someone] return")',
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
            number: 42,
            bonus: true,
            title: 'Making Someone Do Something to Someone',
            focus: '-arazi on verbs that already have an object — say you had someone do something to someone else, e.g. janarazi ("to make [someone] eat [something]")',
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
            number: 43,
            bonus: true,
            title: 'REFRESH — Causatives Across Tenses & Moods',
            // Scoped to present/past/future (mirroring Unit 22 gate's own
            // scope) rather than also recombining conditional/imperative —
            // those moods would need new causative conjugation tables of
            // their own (CONJUGATIONS.md §17.4), out of scope for this gate.
            focus: 'The causative -arazi (making someone do something) across present, past, and future, all at once',
            status: 'available',
            gate: true,
            lessonIds: ['unit-44-review-1', 'unit-44-review-2'],
          },
        ],
      },
      {
        id: 'phase-7-stage-15',
        title: 'Stage 15 — Verbs That Don\'t Need an Auxiliary',
        units: [
          {
            number: 44,
            bonus: true,
            title: 'Synthetic Curiosities',
            // #485: corrected `irudi`'s agreement label — unergative,
            // NORK-only (ergative subject, no absolutive argument), not
            // nor-nork. Not `iruditu`'s nor-nori form (CONJUGATIONS.md §8
            // flags this as a false-friend pairing — distinct verb).
            focus: 'jario ("to flow/drip"), etzan ("to lie/consist of"), and irudi ("to appear/seem") — rare, old-fashioned verb forms you\'ll mostly just recognize',
            payload: 'Malkoak dario. · Zertan datza ariketa? · Nekatuta zaude, dirudizu.',
            status: 'available',
            lessonIds: [
              'jario-present', 'jario-past',
              'irudi-present', 'irudi-past',
              'etzan-present', 'etzan-past',
              'unit-44-curiosities-review',
            ],
          },
        ],
      },
      {
        id: 'phase-7-stage-16',
        title: 'Stage 16 — Talking About Weather',
        units: [
          {
            number: 45,
            bonus: true,
            title: 'Talking About Weather',
            focus: 'Weather idioms — euria ari du ("it\'s raining"), hotz da ("it\'s cold"), and more, always in the 3rd person',
            payload: 'Euria ari du. · Hotz da. · Eguzkia dago.',
            status: 'available',
            lessonIds: ['unit-45-weather', 'unit-45-review'],
          },
        ],
      },
      {
        id: 'phase-7-stage-17',
        title: 'Stage 17 — Subjects Without Objects',
        units: [
          {
            // #481/#484: `ihardun`/`iraun` (unergative, NORK-only —
            // ergative subject, no absolutive argument at all). Full
            // present/past production lessons, unlike Unit 44's
            // recognition-only scope — neither verb has a journey-documented
            // "bonus, one example sentence" plan the way jario/etzan/irudi do.
            number: 46,
            bonus: true,
            title: 'Unergative Curiosities',
            focus: 'ihardun ("to be at/busy with") and iraun ("to last") — verbs with an ergative subject but no object at all',
            payload: 'Lanean dihardut. · Filmak bi ordu dirau.',
            status: 'available',
            lessonIds: ['ihardun-present', 'ihardun-past', 'iraun-present', 'iraun-past', 'unit-46-review'],
          },
        ],
      },
      {
        id: 'phase-7-stage-18',
        title: 'Stage 18 — Tools & Usage',
        units: [
          {
            // #483: `erabili` ("to use") — plain nor-nork synthetic in the
            // already-taught eduki/jakin shape, same "no new grammatical
            // relation" story as Unit 16's eraman/ekarri, so it slots into
            // Phase VII's bonus tail alongside them rather than the
            // renumbered core sequence.
            number: 47,
            bonus: true,
            title: 'erabili — Using Things',
            focus: 'erabili (to use), present and past — same pattern as eduki and jakin',
            payload: 'Nik ordenagailua darabilt egunero.',
            status: 'available',
            lessonIds: ['erabili-present', 'erabili-past', 'unit-47-review'],
          },
        ],
      },
      {
        id: 'phase-bonus-stage-axes',
        title: 'The Object Axis in Depth',
        units: [
          {
            number: 48,
            title: 'Acting on Me, Us, and You',
            focus:
              'Flip the direction — "it surprised me" (harritu nau), "they saw us" (ikusi gaituzte). Deep practice for Unit 16\'s pattern, across dozens of verbs',
            payload: '"It surprised me." (Harritu nau.) / "They saw us." (Ikusi gaituzte.)',
            status: 'available',
            bonus: true,
            lessonIds: [
              'ukan-object-axis-present-hura',
              'maite-object-axis-past-hura',
              'object-axis-present-review-hura',
              'object-axis-past-review-hura',
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
              'object-axis-present-review-haiek',
              'object-axis-past-review-haiek',
            ],
          },
        ],
      },
      {
        id: 'phase-bonus-stage-moods',
        title: 'The Axes Inside the Moods',
        units: [
          {
            number: 49,
            title: 'Ahalera, in Depth',
            focus:
              'More "can" sentences — "it could surprise me", "I could like him". Deep practice for Unit 32 (Ahalera)',
            payload: '"It could surprise me." / "I could like him."',
            status: 'available',
            bonus: true,
            lessonIds: [
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
              'potential-axis-review-ni', 'potential-axis-review-zu', 'potential-axis-review-hura', 'potential-axis-review-gu', 'potential-axis-review-zuek', 'potential-axis-review-haiek',
              'potential-alegiazkoa-axis-review-ni', 'potential-alegiazkoa-axis-review-zu', 'potential-alegiazkoa-axis-review-hura', 'potential-alegiazkoa-axis-review-gu', 'potential-alegiazkoa-axis-review-zuek', 'potential-alegiazkoa-axis-review-haiek',
              'potential-lehenaldia-axis-review-ni', 'potential-lehenaldia-axis-review-zu', 'potential-lehenaldia-axis-review-hura', 'potential-lehenaldia-axis-review-gu', 'potential-lehenaldia-axis-review-zuek', 'potential-lehenaldia-axis-review-haiek',
              'unit-34-ditransitive-review',
            ],
          },
          {
            number: 50,
            title: 'Conditionals, in Depth',
            focus:
              'More "if/would" sentences — "if you loved me...", "I would like him". Deep practice for Unit 33 (Baldintza)',
            payload: '"If you loved me…" / "I would like him."',
            status: 'available',
            bonus: true,
            lessonIds: [
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
              'baldintza-axis-review-ni', 'baldintza-axis-review-zu', 'baldintza-axis-review-hura', 'baldintza-axis-review-gu', 'baldintza-axis-review-zuek', 'baldintza-axis-review-haiek',
              'conditional-axis-review-ni', 'conditional-axis-review-zu', 'conditional-axis-review-hura', 'conditional-axis-review-gu', 'conditional-axis-review-zuek', 'conditional-axis-review-haiek',
              'conditional-past-axis-review-ni', 'conditional-past-axis-review-zu', 'conditional-past-axis-review-hura', 'conditional-past-axis-review-gu', 'conditional-past-axis-review-zuek', 'conditional-past-axis-review-haiek',
              'unit-35-ditransitive-review',
            ],
          },
          {
            number: 51,
            title: 'Commands, in Depth',
            focus:
              'More commands — "let it appeal to me!" (bekit) and its family, across every "to whom". Deep practice for Unit 34 (Agintera)',
            payload: '"Let it appeal to me!" (bekit)',
            status: 'available',
            bonus: true,
            lessonIds: [
              'gustatu-imperative-axis', 'iruditu-imperative-axis', 'ahaztu-imperative-axis',
              'gustatu-imperative-axis-ni', 'gustatu-imperative-axis-hura', 'gustatu-imperative-axis-gu', 'gustatu-imperative-axis-zuek', 'gustatu-imperative-axis-haiek',
              'iruditu-imperative-axis-ni', 'iruditu-imperative-axis-hura', 'iruditu-imperative-axis-gu', 'iruditu-imperative-axis-zuek', 'iruditu-imperative-axis-haiek',
              'ahaztu-imperative-axis-ni', 'ahaztu-imperative-axis-hura', 'ahaztu-imperative-axis-gu', 'ahaztu-imperative-axis-zuek', 'ahaztu-imperative-axis-haiek',
              'imperative-axis-review-zu', 'imperative-axis-review-ni', 'imperative-axis-review-hura', 'imperative-axis-review-gu', 'imperative-axis-review-zuek', 'imperative-axis-review-haiek',
            ],
          },
        ],
      },
    ],
  },
]

// The last `lessonIds` entry of every `available`, `gate: true` unit (Units
// 10, 22, 31, 43 — see the `gate: true` note above) — `getUnlockedLessonIds`
// (`src/lessonLogic.js`) treats reaching `GATE_PASS_STARS` on one of these as
// the unlock condition for the lesson that follows it, instead of the regular
// "previous lesson attempted" rule. A `pending` gate has no `lessonIds` yet
// and contributes nothing.
export const GATE_LESSON_IDS = new Set(
  JOURNEY.flatMap((phase) => phase.stages.flatMap((stage) => stage.units))
    .filter((unit) => unit.gate && unit.lessonIds?.length)
    .map((unit) => unit.lessonIds[unit.lessonIds.length - 1]),
)

// Every lesson id belonging to a `bonus: true` unit (the "Bonus — Mastery &
// Depth" phase above). `getUnlockedLessonIds` (`src/lessonLogic.js`) uses this
// so bonus lessons never gate the main spine — see its `bonusLessonIds` doc
// comment. A learner reaches a bonus track once they pass the spine lesson it
// branches from, but never has to complete it to advance.
export const BONUS_LESSON_IDS = new Set(
  JOURNEY.flatMap((phase) => phase.stages.flatMap((stage) => stage.units))
    .filter((unit) => unit.bonus && unit.lessonIds?.length)
    .flatMap((unit) => unit.lessonIds),
)
