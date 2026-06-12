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
// `gate: true` marks the Refresh Gate units (zero-new-verb consolidation
// checkpoints between phases).
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
        ],
      },
      {
        id: 'phase-1-stage-2',
        title: 'Stage 2 — Basic Operations & Movement',
        units: [
          {
            number: 3,
            title: 'Moving Around',
            focus: 'joan + etorri, present tense',
            payload: "\"I'm going to the beach.\" · \"She's coming tomorrow.\"",
            status: 'available',
            lessonIds: ['joan-present', 'etorri-present', 'unit-3-review'],
          },
          {
            number: 4,
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
        title: 'Refresh Gate A — The "Ez" Trap & Person Expansion',
        units: [
          {
            number: 5,
            title: 'REFRESH — The Inversion Matrix',
            focus: 'Negation drills across Units 1–4 — zero new verbs',
            status: 'available',
            gate: true,
            lessonIds: ['unit-5-review-1', 'unit-5-review-2', 'unit-5-review-3'],
          },
          {
            number: 6,
            title: 'Expansion — Bringing in the Plural',
            focus: 'Adds gu/zuek/haiek to izan, egon, ukan, joan, etorri — zero new verbs',
            status: 'available',
            gate: true,
            lessonIds: ['unit-6-review-1', 'unit-6-review-2', 'unit-6-review-3'],
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
        title: 'Stage 3 — Real-World Actions',
        units: [
          {
            number: 7,
            title: 'Daily Routine (Transitive)',
            focus: 'jan, edan, erosi (periphrastic + ukan), ikusi',
            payload: '"I ate." · "You drink water." · "I bought a book." · "Do you see it?"',
            status: 'available',
            lessonIds: ['jan-present', 'edan-present', 'erosi-present', 'ikusi-present', 'unit-7-review'],
          },
          {
            number: 8,
            title: 'Physical States & Possessions',
            focus: 'eduki, ibili — full 6-person grids',
            payload: '"I have the keys in my pocket." · "They are wandering around town."',
            status: 'available',
            lessonIds: ['eduki-present', 'ibili-present', 'unit-8-review'],
          },
        ],
      },
      {
        id: 'phase-2-stage-4',
        title: 'Stage 4 — Talking About the Future (Geroa)',
        units: [
          {
            number: 9,
            title: 'Intentions & Future Actions',
            focus: '-ko/-go + present auxiliaries, applied to every verb so far',
            payload: '"I will go tomorrow" (joango naiz) · "We will buy a house" (erosiko dugu)',
            status: 'pending',
          },
          {
            number: 10,
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
        title: 'Refresh Gate B — The Core Present Checkpoint',
        units: [
          {
            number: 11,
            title: 'REFRESH — Cumulative Present Mixer',
            focus:
              'Synthetic + periphrastic, positive + negative, present + future — zero new verbs, must-pass-with-high-accuracy',
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
        id: 'phase-3-stage-5',
        title: 'Stage 5 — Storytelling Basics',
        units: [
          {
            number: 12,
            title: '"I Was, I Had"',
            focus: 'izan/ukan past, full grid',
            payload: '"I was young." · "She had a dog."',
            status: 'pending',
          },
          {
            number: 13,
            title: 'Past Narrative Flow',
            focus:
              'periphrastic past (ikusi nuen), imperfective/habitual past (etortzen nintzen), and completed motion (joan nintzen, etorri nintzen)',
            payload: '"I saw it." · "I used to come (often)." · "I went." · "She came."',
            status: 'pending',
          },
          {
            number: 14,
            title: 'Motion in Progress (Past)',
            focus: "joan/etorri/ibili's native past forms (nindoan, zetorren)",
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
        id: 'phase-4-stage-6',
        title: 'Stage 6 — The Dative Shift ("To Me / For Me")',
        units: [
          {
            number: 15,
            title: 'Pleasures, Opinions, and Physical Feelings',
            focus: 'present NOR-NORI, 3rd-person subjects (zait/zaizu/zaio)',
            payload: '"I like it." · "It seems good to me." · "I forgot."',
            status: 'pending',
          },
          {
            number: 16,
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
            number: 17,
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
        id: 'phase-5-stage-7',
        title: 'Stage 7 — Hypotheticals and Potentials',
        units: [
          {
            number: 18,
            title: 'Permissions & Capability (Ahalera)',
            focus: 'dezaket/naiteke contrasted with periphrastic ahal izan',
            payload: '"I can come." · "I could (have)..."',
            status: 'pending',
          },
          {
            number: 19,
            title: 'Conditionals (Baldintza & Ondorioa)',
            focus: 'ba- protasis + -ke apodosis',
            payload: '"If I had money, I would buy that" (Dirua banu, hori erosiko nuke)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'phase-5-stage-8',
        title: 'Stage 8 — Social Registers & Complete Native Integration',
        units: [
          {
            number: 20,
            title: 'Command & Subjunctives (Agintera, Subjuntiboa)',
            focus: 'Direct commands; "so that..." purpose clauses',
            status: 'pending',
          },
          {
            number: 21,
            title: 'The Intimate Social Register (hi + Hitanoa/Hiketa)',
            focus: 'hi introduced for the first time, paired with toka/noka allocutive marking',
            status: 'pending',
          },
          {
            number: 22,
            title: 'Passive Transformation & Reading Real Text',
            focus: 'Non-finite forms, nor-shift (ireki dut → ireki da)',
            status: 'pending',
          },
        ],
      },
    ],
  },
]
