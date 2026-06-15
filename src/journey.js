// =============================================================================
// The learning journey — Aditzak's curriculum roadmap
//
// Mirrors `docs/LEARNING_JOURNEY.md`'s phases → stages → units, which in turn
// follows the 37-unit layout specified in `docs/LEARNING_JOURNEY_PROPOSED.md`
// (unit numbers below are that spec's "P-n"; see
// `docs/LEARNING_JOURNEY_EVALUATION.md` for the O-n → P-n mapping that drove
// this renumber — issue #149/#137). Each unit is either:
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
// expansion checkpoints (P-8, P-18, P-25, P-37). Most sit between
// phases/stages, but Phase I's "Expansion" gate (Unit 5) sits mid-phase,
// right after the verbs it expands are introduced — see `docs/DECISIONS.md`,
// "Moved the Expansion gate earlier".
//
// Two units after each "present tense" cluster ("Looking Back I"/"Looking
// Back II") teach the simple past for verbs already met, so tense variety
// (present → past → future) arrives well before Phase III rather than all at
// once — see `docs/DECISIONS.md` for the redesign rationale.
//
// Keep this in sync with `docs/LEARNING_JOURNEY.md` — when a unit moves from
// pending to available, flip its `status` and add its `lessonIds` here.
//
// Lesson ids in `LESSONS` were kept stable across this renumber (see
// `docs/DECISIONS.md`, 2026-06-14 "37-unit journey renumber") — only this
// file's unit numbers/titles/stage groupings changed, so existing
// `localStorage` progress (keyed by lesson id) survives untouched.
// =============================================================================

export const JOURNEY = [
  {
    id: 'phase-1',
    title: 'Phase I',
    subtitle: 'Survival Present (Me, You, & It)',
    stages: [
      {
        id: 'phase-1-stage-1',
        title: 'Stage 1 — Absolute Foundations',
        units: [
          {
            number: 1,
            title: 'Who and Where',
            focus: 'izan + egon, present tense',
            payload: '"I am a student." · "Where are you?" · "He is at home."',
            status: 'available',
            lessonIds: ['izan-present', 'egon-present', 'unit-1-review'],
          },
          {
            number: 2,
            title: 'Having, Wanting, and Knowing',
            focus: 'ukan present (object fixed to hura) + nahi + jakin',
            payload:
              '"I have a car." · "I want coffee." · "Do you want to come?" · "I don\'t know."',
            status: 'available',
            lessonIds: ['ukan-present', 'nahi-present', 'jakin-present', 'unit-2-review'],
          },
          {
            number: 3,
            title: 'Seeing',
            focus: 'ikusi present (ni/zu/hura) — Phase I\'s first periphrastic verb',
            payload: '"I see the mountain." · "Do you see it?" · "She sees the film."',
            status: 'available',
            lessonIds: ['ikusi-present', 'ikusi-present-review'],
          },
        ],
      },
      {
        id: 'phase-1-stage-2',
        title: 'Stage 2 — Operations, Movement & Expansion',
        units: [
          {
            number: 4,
            title: 'Moving Around',
            focus: 'joan + etorri, present tense',
            payload: "\"I'm going to the beach.\" · \"She's coming tomorrow.\"",
            status: 'available',
            lessonIds: ['joan-present', 'etorri-present', 'unit-3-review'],
          },
          // Unit 5 ("Expansion: Absolutive Plurals") and Unit 6 ("Expansion:
          // Ergative Plurals") split O-5's single "Expansion" gate into two
          // internally-homogeneous units — the absolutive plural (gara/goaz,
          // marked on the stem) and the ergative plural (dugu/dute, a suffix
          // on the fixed du- stem) are different paradigms, and bundling them
          // invites †dugara-type blending (docs/LEARNING_JOURNEY_EVALUATION.md
          // F4). This renumber (#137) keeps O-5's existing lessons — which mix
          // both paradigms (izan/egon/joan/etorri absolutive plus ukan/ikusi
          // ergative) — under Unit 5 for now; #143 does the actual content
          // split (redistributing the ukan/ikusi lessons into Unit 6).
          {
            number: 5,
            title: 'Expansion: Absolutive Plurals',
            focus:
              'Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri, and ikusi — zero new verbs',
            payload:
              '"We are teachers." (Irakasleak gara) · "You all are at home." (Etxean zaudete) · "We\'re going to the beach." (Hondartzara goaz)',
            status: 'available',
            gate: true,
            lessonIds: [
              'unit-6-review-1',
              'unit-6-review-2',
              'unit-6-review-3',
              'ikusi-present-plural',
              'ikusi-present-plural-review',
            ],
          },
          {
            number: 6,
            title: 'Expansion: Ergative Plurals',
            focus:
              'ukan + ikusi — adds gu/zuek/haiek to the ergative ("nor-nork") paradigm, framed as "the plural moved — now it\'s a suffix"',
            payload: '"We have a car." (Auto bat dugu) · "They watch the film." (Filma ikusten dute)',
            status: 'pending',
          },
          {
            number: 7,
            title: 'The Immediate Continuous',
            focus: 'ari + izan',
            payload: '"What are you doing?" (Zer ari zara?) · "I\'m eating." (Jaten ari naiz)',
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
            number: 8,
            title: 'REFRESH — The Inversion Matrix',
            focus: 'Negation drills across Units 1–7 — zero new verbs',
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
          {
            number: 9,
            title: 'Looking Back I — The "izan" Past Pool',
            focus: 'the izan past auxiliary (nintzen/zinen/zen/ginen/zineten/ziren), mixed across izan, joan, etorri, ibili',
            payload: '"I was young." · "I went to the beach." · "She came yesterday." · "We wandered around town."',
            status: 'available',
            lessonIds: ['izan-past-pool', 'izan-past-pool-plural'],
          },
          {
            number: 10,
            title: 'Looking Back I — The "ukan" Past Pool',
            focus: 'the ukan past auxiliary (nuen/zenuen/zuen/genuen/zenuten/zuten), mixed across ukan, jan, edan, erosi, ikusi',
            payload: '"I had a car." · "I ate the apple." · "You drank coffee." · "We bought a house." · "She saw the film."',
            status: 'available',
            lessonIds: ['ukan-past-pool', 'ukan-past-pool-plural'],
          },
        ],
      },
      {
        id: 'phase-2-stage-4',
        title: 'Stage 4 — Real-World Actions',
        units: [
          {
            number: 11,
            title: 'Daily Routine (Transitive)',
            focus: 'the ukan present auxiliary (dut/duzu/du/dugu/duzue/dute), mixed across jan, edan, erosi, ikusi — first -tzen/-ten minimal pair (jaten vs. hartzen)',
            payload: '"I ate." · "You drink water." · "I bought a book." · "Do you see it?"',
            status: 'available',
            lessonIds: ['unit-10-present', 'unit-10-present-plural'],
          },
          {
            number: 12,
            title: 'Physical States & Possessions',
            focus: 'eduki, ibili — full 6-person grids',
            payload: '"I have the keys in my pocket." · "They are wandering around town."',
            status: 'available',
            lessonIds: [
              'eduki-present',
              'eduki-present-plural',
              'ibili-present',
              'ibili-present-plural',
              'unit-8-review',
              'unit-8-review-plural',
            ],
          },
        ],
      },
      {
        id: 'phase-2-stage-5',
        title: 'Stage 5 — Looking Back II',
        units: [
          {
            number: 13,
            title: 'Looking Back II — "I Was There"',
            focus: 'egon — simple past, its own synthetic paradigm (nengoen, zeunden, zegoen, geunden, zeundeten, zeuden)',
            payload: '"I was at home." · "We were at the beach."',
            status: 'available',
            lessonIds: ['egon-past', 'egon-past-review', 'egon-past-plural', 'egon-past-plural-review'],
          },
          {
            number: 14,
            title: 'Looking Back II — "I Had It"',
            focus: 'eduki — simple past, its own synthetic paradigm (neukan, zeneukan, zeukan, geneukan, zeneukaten, zeukaten)',
            payload: '"I had the keys." · "We had time."',
            status: 'available',
            lessonIds: ['eduki-past', 'eduki-past-review', 'eduki-past-plural', 'eduki-past-plural-review'],
          },
        ],
      },
      {
        id: 'phase-2-stage-6',
        title: 'Stage 6 — The Future (Geroa)',
        units: [
          {
            number: 15,
            title: 'The Future Rule',
            focus: 'forming the future with -ko/-go + present auxiliaries (izan, ukan, joan) — first -ko/-go minimal pair (izango vs. etorriko)',
            payload:
              '"I will be a teacher" (irakasle izango naiz) · "We will have a car" (autoa izango dugu) · "I will go tomorrow" (bihar joango naiz)',
            status: 'available',
            lessonIds: [
              'izan-future',
              'izan-future-plural',
              'ukan-future',
              'ukan-future-plural',
              'joan-future',
              'joan-future-plural',
              'future-intro-review',
              'future-intro-review-plural',
            ],
          },
          {
            number: 16,
            title: 'The Future, Across Every Verb',
            focus: 'the same -ko/-go rule applied across all known verbs, drilled as cross-verb mixers',
            payload:
              '"You will see it" (ikusiko duzu) · "We will buy a house" (etxe bat erosiko dugu) · "Will you know?" (jakingo duzu?)',
            status: 'available',
            lessonIds: [
              'future-mixer-being-going',
              'future-mixer-being-going-plural',
              'future-mixer-eating-buying',
              'future-mixer-eating-buying-plural',
              'future-mixer-having-knowing',
              'future-mixer-having-knowing-plural',
              'future-mixer-capstone',
              'future-mixer-capstone-plural',
            ],
          },
          {
            number: 17,
            title: 'Requirements & Obligations',
            focus: 'behar + ukan, present and future',
            payload:
              '"I have to go." (Joan behar dut) · "You\'ll have to come." (Etorri beharko duzu)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-2-gate-b',
        title: 'Refresh Gate B — The Core Tense Checkpoint',
        units: [
          {
            number: 18,
            title: 'REFRESH — Cumulative Present/Past/Future Mixer',
            focus:
              'Synthetic + periphrastic, positive + negative, present + past + future — zero new verbs, score-gated (bestStars >= 2 to continue)',
            status: 'pending',
            gate: true,
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
            number: 19,
            title: '"I Used To..." — The Imperfective Past',
            focus:
              'imperfective/habitual past (etortzen nintzen, "I used to come / I was coming") — distinct from the simple past taught in Units 9/10/13/14',
            payload: '"I used to come here every day." · "I was working when she called."',
            status: 'pending',
          },
          {
            number: 20,
            title: 'Motion in Progress (Past)',
            focus: "joan/etorri/ibili's native imperfective past forms (nindoan, zetorren)",
            payload: '"I was on my way (when...)." · "He was coming (and then...)."',
            status: 'pending',
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
            number: 21,
            title: 'Pleasures, Opinions, Feelings',
            focus:
              'present NOR-NORI (zait/zaizu/zaio/zaigu/zaizue/zaie) — gustatu/iruditu/ahaztu; ends with a case-frame buffer lesson ahead of Unit 23\'s ditransitive jump',
            payload: '"I like this." (Hau gustatzen zait) · "It seems good to him/her." (Ongi iruditzen zaio) · "I forgot the book." (Liburua ahaztu zait)',
            status: 'pending',
          },
          {
            number: 22,
            title: 'Dative Across Time',
            focus: 'NOR-NORI past + future — recombines Unit 21\'s dative grid with the periphrastic past and -ko/-go future',
            payload: '"I liked it yesterday." (Atzo gustatu zitzaidan) · "I forgot the keys." (Giltzak ahaztu zitzaizkidan) · "You\'ll like it for sure." (Ziur gustatuko zaizu)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-4-stage-9',
        title: 'Stage 9 — Communication & Giving (NOR-NORI-NORK)',
        units: [
          {
            number: 23,
            title: 'Communication & Giving',
            focus: 'present NOR-NORI-NORK (esan, eman), axis-scaffolded — each lesson fixes one axis (NORK or NORI) before recombining both',
            payload: '"I give it to him." (Ematen diot) · "You tell it to him." (Esaten diozu)',
            status: 'pending',
          },
          {
            number: 24,
            title: 'Telling & Giving Across Time',
            focus: 'NOR-NORI-NORK past + future — reuses the periphrastic past and -ko/-go future on the axis-fixed slices from Unit 23',
            payload: '"I told him." (Esan nion) · "He gave it to me." (Eman zidan) · "I\'ll tell you tomorrow." (Bihar esango dizut)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-4-gate-c',
        title: 'Refresh Gate C — The Multi-Argument Audit',
        units: [
          {
            number: 25,
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
            number: 26,
            title: 'Permissions & Capability (Ahalera)',
            focus: 'dezaket/naiteke contrasted with periphrastic ahal izan — production for NOR/NOR-NORK, recognition-only for the dative paradigms',
            payload: '"I can come." · "I could (have)..."',
            status: 'pending',
          },
          {
            number: 27,
            title: 'Conditionals (Baldintza & Ondorioa)',
            focus: 'ba- protasis + -ke apodosis — production for NOR/NOR-NORK, recognition-only for the dative paradigms',
            payload: '"If I had money, I would buy that" (Dirua banu, hori erosiko nuke)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-5-stage-11',
        title: 'Stage 11 — Directives & Wishes',
        units: [
          {
            number: 28,
            title: 'Commands (Agintera)',
            focus: 'the imperative — production for NOR/NOR-NORK, ditransitive (iezadazu) recognition-only; small tables borrow distractors from sibling verbs (distractor-floor fix)',
            payload: 'Etorri! · Egizu lan. · Emadazu ura.',
            status: 'pending',
          },
          {
            number: 29,
            title: 'Purpose & Wishing (Subjuntiboa)',
            focus: 'the subjunctive as a construction (matrix verb + subordinate clause) — NOR/NOR-NORK 3rd-person in-construction production, dative/ditransitive recognition-only',
            payload: 'Nahi dut etor dadin. · Esan dio etor dadila. · ...ikus dezan.',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-5-stage-12',
        title: 'Stage 12 — The Intimate Register (hi + Hitanoa)',
        units: [
          {
            number: 30,
            title: 'Meet "hi"',
            focus: 'hi as a subject in known paradigms — no allocutivity yet',
            payload: 'Hi ikaslea haiz. · Hago lasai. · Hator hona. · Hik badakik?',
            status: 'pending',
          },
          {
            number: 31,
            title: 'Toka (Masculine Allocutive)',
            focus: 'addressee-agreement on 3rd-person statements, masculine register',
            payload: 'Lanean dik. · Etorri duk. · Ez nauk ondo.',
            status: 'pending',
          },
          {
            number: 32,
            title: 'Noka (Feminine Allocutive)',
            focus: 'taught as the -k → -n transform of Unit 31\'s toka forms, feminine register',
            payload: 'Lanean din. · Etorri dun. · Ez naun ondo.',
            status: 'pending',
          },
          {
            number: 33,
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
            number: 34,
            title: 'Passive & Reading Real Text',
            focus: 'non-finite forms, nor-shift (ireki dut → ireki da) — comprehension over real sentences, recognition-only throughout',
            status: 'pending',
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
            number: 35,
            title: 'Making Someone Do It',
            focus: '-arazi on intransitives (nor → nor-nork), present/past/future',
            payload: 'Ekaitzak mendizaleak itzularazi zituen. · Musikak umeak dantzarazi ditu.',
            status: 'pending',
          },
          {
            number: 36,
            title: 'Making Someone Do Something to Someone',
            focus: '-arazi on transitives (nor-nork → nor-nori-nork), present/past/future',
            payload: 'Amonak umeei babarrunak janarazi zizkien. · Irakasleak ikasleei hori idatzarazi die.',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-6-gate-d',
        title: 'Refresh Gate D — The Causative Recombination',
        units: [
          {
            number: 37,
            title: 'REFRESH — Causatives Across Tenses & Moods',
            focus: 'Recombines Units 35–36\'s -arazi with future, conditional, and imperative — zero new verbs, score-gated',
            status: 'pending',
            gate: true,
          },
        ],
      },
    ],
  },
]

// The last `lessonIds` entry of every `available`, `gate: true` unit (P-8,
// P-18, P-25, P-37 — see the `gate: true` note above) — `getUnlockedLessonIds`
// (`src/lessonLogic.js`) treats reaching `GATE_PASS_STARS` on one of these as
// the unlock condition for the lesson that follows it, instead of the regular
// "previous lesson attempted" rule. A `pending` gate has no `lessonIds` yet
// and contributes nothing.
export const GATE_LESSON_IDS = new Set(
  JOURNEY.flatMap((phase) => phase.stages.flatMap((stage) => stage.units))
    .filter((unit) => unit.gate && unit.lessonIds?.length)
    .map((unit) => unit.lessonIds[unit.lessonIds.length - 1]),
)
