// =============================================================================
// The learning journey — Aditzak's curriculum roadmap
//
// Mirrors `docs/LEARNING_JOURNEY.md`'s phases → stages → units. Each unit is
// either:
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
// expansion checkpoints. Most sit between phases/stages, but Phase I's
// "Expansion" gate (Unit 5) sits mid-phase, right after the verbs it expands
// are introduced — see `docs/DECISIONS.md`, "Moved the Expansion gate
// earlier".
//
// Two units after each "present tense" cluster ("Looking Back I"/"Looking
// Back II") teach the simple past for verbs already met, so tense variety
// (present → past → future) arrives well before Phase III rather than all at
// once — see `docs/DECISIONS.md` for the redesign rationale.
//
// Keep this in sync with `docs/LEARNING_JOURNEY.md` — when a unit moves from
// pending to available, flip its `status` and add its `lessonIds` here.
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
        title: 'Stage 2 — Basic Operations & Movement',
        units: [
          {
            number: 4,
            title: 'Moving Around',
            focus: 'joan + etorri, present tense',
            payload: "\"I'm going to the beach.\" · \"She's coming tomorrow.\"",
            status: 'available',
            lessonIds: ['joan-present', 'etorri-present', 'unit-3-review'],
          },
          {
            number: 5,
            title: 'Expansion — Bringing in the Plural',
            focus:
              'Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri, and ikusi — zero new verbs',
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
            number: 7,
            title: 'REFRESH — The Inversion Matrix',
            focus: 'Negation drills across Units 1–6 — zero new verbs',
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
            number: 8,
            title: 'Looking Back I — "I Was, I Had"',
            focus: 'izan, egon, ukan — simple past, full 6-person grid',
            payload: '"I was young." · "She had a dog." · "We were at home."',
            status: 'available',
            lessonIds: [
              'izan-past',
              'izan-past-plural',
              'egon-past',
              'egon-past-plural',
              'ukan-past',
              'ukan-past-plural',
              'looking-back-1a-review',
              'looking-back-1a-review-plural',
            ],
          },
          {
            number: 9,
            title: 'Looking Back I — "I Went, I Came, I Saw"',
            focus: 'joan, etorri, ikusi — simple past, full 6-person grid',
            payload: '"I went to the beach." · "She came yesterday." · "We saw the film."',
            status: 'available',
            lessonIds: [
              'joan-past',
              'joan-past-plural',
              'etorri-past',
              'etorri-past-plural',
              'ikusi-past',
              'ikusi-past-plural',
              'looking-back-1b-review',
              'looking-back-1b-review-plural',
            ],
          },
        ],
      },
      {
        id: 'phase-2-stage-4',
        title: 'Stage 4 — Real-World Actions',
        units: [
          {
            number: 10,
            title: 'Daily Routine (Transitive)',
            focus: 'the ukan present auxiliary (dut/duzu/du/dugu/duzue/dute), mixed across jan, edan, erosi, ikusi',
            payload: '"I ate." · "You drink water." · "I bought a book." · "Do you see it?"',
            status: 'available',
            lessonIds: ['unit-10-present', 'unit-10-present-plural'],
          },
          {
            number: 11,
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
            number: 12,
            title: 'Looking Back II — "I Ate, I Drank, I Bought"',
            focus: 'jan, edan, erosi — simple past, full 6-person grid',
            payload: '"I ate the apple." · "You drank coffee." · "We bought a house."',
            status: 'available',
            lessonIds: [
              'jan-past',
              'jan-past-plural',
              'edan-past',
              'edan-past-plural',
              'erosi-past',
              'erosi-past-plural',
              'looking-back-2a-review',
              'looking-back-2a-review-plural',
            ],
          },
          {
            number: 13,
            title: 'Looking Back II — "I Had, I Walked Around"',
            focus: 'eduki, ibili — simple past, full 6-person grid',
            payload: '"I had the keys." · "They were wandering around town."',
            status: 'available',
            lessonIds: [
              'eduki-past',
              'eduki-past-plural',
              'ibili-past',
              'ibili-past-plural',
              'looking-back-2b-review',
              'looking-back-2b-review-plural',
            ],
          },
        ],
      },
      {
        id: 'phase-2-stage-6',
        title: 'Stage 6 — Talking About the Future (Geroa)',
        units: [
          {
            number: 14,
            title: 'Future — Being & Having',
            focus: '-ko/-go + present auxiliaries, applied to izan, egon, ukan',
            payload:
              '"I will be a teacher" (irakasle izango naiz) · "We will have a car" (autoa izango dugu)',
            status: 'available',
            lessonIds: [
              'izan-future',
              'izan-future-plural',
              'egon-future',
              'egon-future-plural',
              'ukan-future',
              'ukan-future-plural',
              'unit-9-review-1',
              'unit-9-review-1-plural',
            ],
          },
          {
            number: 15,
            title: 'Future — Wanting, Knowing & Moving',
            focus: '-ko/-go + present auxiliaries, applied to nahi, jakin, joan, etorri',
            payload: '"I will go tomorrow" (joango naiz) · "Will you know?" (jakingo duzu?)',
            status: 'available',
            lessonIds: [
              'nahi-future',
              'jakin-future',
              'joan-future',
              'joan-future-plural',
              'etorri-future',
              'etorri-future-plural',
              'unit-9-review-2',
              'unit-9-review-2-plural',
            ],
          },
          {
            number: 16,
            title: 'Future — Eating, Drinking & Buying',
            focus: '-ko/-go + present auxiliaries, applied to jan, edan, erosi',
            payload: '"We will buy a house" (erosiko dugu) · "I will eat later" (geroago jango dut)',
            status: 'available',
            lessonIds: [
              'jan-future',
              'jan-future-plural',
              'edan-future',
              'edan-future-plural',
              'erosi-future',
              'erosi-future-plural',
              'unit-9-review-3',
              'unit-9-review-3-plural',
            ],
          },
          {
            number: 17,
            title: 'Future — Seeing, Having & Walking',
            focus: '-ko/-go + present auxiliaries, applied to ikusi, eduki, ibili',
            payload: '"You will see it" (ikusiko duzu) · "They will have time" (denbora edukiko dute)',
            status: 'available',
            lessonIds: [
              'ikusi-future',
              'ikusi-future-plural',
              'eduki-future',
              'eduki-future-plural',
              'ibili-future',
              'ibili-future-plural',
              'unit-9-review-4',
              'unit-9-review-4-plural',
            ],
          },
          {
            number: 18,
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
            number: 19,
            title: 'REFRESH — Cumulative Present/Past/Future Mixer',
            focus:
              'Synthetic + periphrastic, positive + negative, present + past + future — zero new verbs, must-pass-with-high-accuracy',
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
            number: 20,
            title: '"I Used To..." — The Imperfective Past',
            focus:
              'imperfective/habitual past (etortzen nintzen, "I used to come / I was coming") — distinct from the simple past taught in Units 8/9/12/13',
            payload: '"I used to come here every day." · "I was working when she called."',
            status: 'pending',
          },
          {
            number: 21,
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
        title: 'Stage 8 — The Dative Shift ("To Me / For Me")',
        units: [
          {
            number: 22,
            title: 'Pleasures, Opinions, and Physical Feelings',
            focus: 'present NOR-NORI, 3rd-person subjects (zait/zaizu/zaio)',
            payload: '"I like it." · "It seems good to me." · "I forgot."',
            status: 'pending',
          },
          {
            number: 23,
            title: 'Communication & Giving',
            focus: 'present NOR-NORI-NORK (esan, eman)',
            payload: '"I give it to you" (ematen dizut) · "You tell it to him" (esaten diozu)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-4-gate-c',
        title: 'Refresh Gate C — The Multi-Argument Audit',
        units: [
          {
            number: 24,
            title: 'REFRESH — The Case-Ending Mixer',
            focus: 'Drills NOR/NORK/NORI role-swaps — zero new verbs',
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
        id: 'phase-5-stage-9',
        title: 'Stage 9 — Hypotheticals and Potentials',
        units: [
          {
            number: 25,
            title: 'Permissions & Capability (Ahalera)',
            focus: 'dezaket/naiteke contrasted with periphrastic ahal izan',
            payload: '"I can come." · "I could (have)..."',
            status: 'pending',
          },
          {
            number: 26,
            title: 'Conditionals (Baldintza & Ondorioa)',
            focus: 'ba- protasis + -ke apodosis',
            payload: '"If I had money, I would buy that" (Dirua banu, hori erosiko nuke)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-5-stage-10',
        title: 'Stage 10 — Social Registers & Complete Native Integration',
        units: [
          {
            number: 27,
            title: 'Command & Subjunctives (Agintera, Subjuntiboa)',
            focus: 'Direct commands; "so that..." purpose clauses',
            status: 'pending',
          },
          {
            number: 28,
            title: 'The Intimate Social Register (hi + Hitanoa/Hiketa)',
            focus: 'hi introduced for the first time, paired with toka/noka allocutive marking',
            status: 'pending',
          },
          {
            number: 29,
            title: 'Passive Transformation & Reading Real Text',
            focus: 'Non-finite forms, nor-shift (ireki dut → ireki da)',
            status: 'pending',
          },
        ],
      },
    ],
  },
]
