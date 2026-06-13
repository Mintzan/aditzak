// `LESSONS` is the flat, ordered list of currently-playable lessons —
// `getUnlockedLessonIds` unlocks them strictly in this order, one practice
// lesson at a time, `{ id, verbId, tense }`.
//
// Unlike the previous (verb × tense)-derived list, this is now hand-written
// to follow `docs/LEARNING_JOURNEY.md`'s unit sequence — units don't map
// cleanly onto "every tense of every verb" (e.g. a unit can introduce two
// verbs at once, or reuse an earlier verb's table under a different gloss),
// so `journey.js`'s `JOURNEY` is the source of truth for *order and grouping*
// and references these ids via each available unit's `lessonIds`. Append the
// next unit's lessons here as it's implemented, and flip its `status` to
// `'available'` in `journey.js`.
//
// Review lessons carry `review: true` and `sources: [{ verbId, tense }, …]`
// instead of a single `verbId`/`tense` — `generateQuestions` is called once
// per source and the results interleaved, with every generated question
// keeping its own `verbId`/`tense` so the exercise screen can show each one
// in its correct context. Every available unit ends with one of these as a
// "Unit review" — `sources` covers every verb/tense the unit introduced —
// giving each unit an extra, harder consolidation lesson (reviews skip the
// no-typing ramp and the conjugation preview, see `NO_TYPING_ATTEMPTS`/
// `LessonPreviewScreen`) before the next unit unlocks. The journey's Refresh
// Gate units (6, 7, 19, 24, ...) are a bigger, cross-unit version of the same
// shape once implemented.
// Phase I's "Survival Present" horizon (`docs/LEARNING_JOURNEY.md`) restricts
// every verb's first lessons to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` arrive
// together in Unit 7 ("Expansion"). Unit 7 grew `izan`/`egon`/`ukan`/`joan`/
// `etorri`'s `conjugations.present` tables to 6 persons *in place*, which
// cascaded into these verbs' own early-unit lessons and Unit 6's negation
// reviews (all of which run before Unit 7). `persons` re-restricts those
// lessons back to the 3-person horizon — see `docs/DECISIONS.md`, "Restored
// Phase I's 3-person pacing". The app-wide rule is: never drill more than 3
// grammatical persons in a single exercise.
export const PHASE_1_PERSONS = ['ni', 'zu', 'hura']
export const PHASE_1_PLURAL_PERSONS = ['gu', 'zuek', 'haiek']

export const LESSONS = [
  { id: 'izan-present', verbId: 'izan', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'egon-present', verbId: 'egon', tense: 'present', persons: PHASE_1_PERSONS },
  {
    id: 'unit-1-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ],
  },
  { id: 'ukan-present', verbId: 'ukan', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'nahi-present', verbId: 'nahi', tense: 'present' },
  { id: 'jakin-present', verbId: 'jakin', tense: 'present' },
  {
    id: 'unit-2-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'nahi', tense: 'present' },
      { verbId: 'jakin', tense: 'present' },
    ],
  },
  // Unit 3 ("Seeing", Phase I) — `ikusi`, Phase I's first periphrastic verb,
  // introduced here on the same `nor-nork`/object-fixed-`hura` shape as
  // Unit 2's `ukan` so the synthetic/periphrastic contrast shows up early
  // rather than only at Unit 10. Reuses `ikusi`'s existing 6-person
  // `conjugations.present` table (from Unit 10's verb data) restricted to
  // `PHASE_1_PERSONS` here — its `gu`/`zuek`/`haiek` forms arrive in Unit 7
  // ("Expansion") alongside `izan`/`egon`/`ukan`/`joan`/`etorri`'s.
  { id: 'ikusi-present', verbId: 'ikusi', tense: 'present', persons: PHASE_1_PERSONS },
  {
    id: 'ikusi-present-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [{ verbId: 'ikusi', tense: 'present' }],
  },
  { id: 'joan-present', verbId: 'joan', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'etorri-present', verbId: 'etorri', tense: 'present', persons: PHASE_1_PERSONS },
  {
    id: 'unit-3-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
    ],
  },
  { id: 'ari-present', verbId: 'ari', tense: 'present' },
  {
    id: 'unit-4-review',
    review: true,
    sources: [{ verbId: 'ari', tense: 'present' }],
  },
  // Unit 6 ("REFRESH — The Inversion Matrix", Refresh Gate A) — zero new
  // verbs, drilling `ez` + auxiliary-fronting (`negativeSentences`) across the
  // six Units 1-4 verbs whose present-tense form is a single word that stays
  // intact under negation (`ikusi`, Unit 3's periphrastic verb, has no
  // `negativeSentences` — same as every other periphrastic verb, see
  // `docs/LANGUAGE_DECISIONS.md`). `negation: true` tells
  // `createExerciseState` to pass `includeNegation` through to
  // `generateQuestions` for every source. `persons: PHASE_1_PERSONS` keeps
  // this Refresh Gate on Phase I's 3-person horizon (matching the lessons it
  // reviews) — also conveniently the only persons with `negativeSentences`
  // data, so every question stays focused on the `ez`/auxiliary-fronting
  // drill instead of falling back to a plain `sentence`/`pronoun` question
  // for `gu`/`zuek`/`haiek`. Split into three reviews of two sources each — a
  // single six-source review landed at ~33 questions (see `docs/DECISIONS.md`,
  // 2026-06-12 "Implemented Unit 6"), well past `TARGET_EXERCISE_COUNT`; each
  // of these three lands at exactly 12. Per `docs/LEARNING_JOURNEY.md`, a
  // Refresh Gate's whole point is a cumulative cross-unit mixer, so sources
  // are deliberately paired *across* their originating units (Unit 1:
  // izan/egon, Unit 2: ukan/jakin, Unit 4: joan/etorri) rather than keeping
  // each origin unit's pair together.
  {
    id: 'unit-5-review-1',
    review: true,
    negation: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  {
    id: 'unit-5-review-2',
    review: true,
    negation: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'egon', tense: 'present' },
      { verbId: 'joan', tense: 'present' },
    ],
  },
  {
    id: 'unit-5-review-3',
    review: true,
    negation: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jakin', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
    ],
  },
  // Unit 7 ("Expansion — Bringing in the Plural", Refresh Gate A) — zero new
  // verbs for `izan`/`egon`/`ukan`/`joan`/`etorri`. Their `conjugations.present`
  // (plus their `sentences`/`pronouns`/`pronounSentences`) gained `gu`/`zuek`/
  // `haiek` rows directly (see `docs/DECISIONS.md`). Their own lessons above
  // stay on the 3-person horizon via `PHASE_1_PERSONS`, so this unit's own
  // reviews are the *first* place those verbs' present tense is drilled with
  // `gu`/`zuek`/`haiek` — `persons: PHASE_1_PLURAL_PERSONS` keeps each review
  // focused on exactly those three new forms (never more than 3 persons per
  // exercise), matching the unit's "bringing in the plural" focus. This unit's
  // own consolidation pass is split into three reviews, using the same
  // cross-unit pairing as Unit 6 above (Unit 1: izan/egon, Unit 2: ukan, Unit
  // 4: joan/etorri all paired across origins) — a single five-source review
  // landed at 30 questions; each of these three lands at exactly 12. `ikusi`
  // (Unit 3) also expands to `gu`/`zuek`/`haiek` here via its own
  // `-plural`/review pair, mirroring Units 10-11's singular/plural split.
  {
    id: 'unit-6-review-1',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  {
    id: 'unit-6-review-2',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'egon', tense: 'present' },
      { verbId: 'joan', tense: 'present' },
    ],
  },
  {
    id: 'unit-6-review-3',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [{ verbId: 'etorri', tense: 'present' }],
  },
  { id: 'ikusi-present-plural', verbId: 'ikusi', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'ikusi-present-plural-review',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [{ verbId: 'ikusi', tense: 'present' }],
  },
  // Unit 8 ("Looking Back I" — "I Was, I Had, I Saw...") — the first "Looking
  // Back" companion unit: simple past for the Phase I verbs just consolidated
  // in Units 6-7 (`izan`/`egon`/`ukan`), pairing each verb group's past with
  // its present soon after rather than saving *all* past tense for Phase III
  // (see `docs/DECISIONS.md`). Full 6-person grids from the first lesson
  // (Person-Expansion Rule, since `gu`/`zuek`/`haiek` already exist for these
  // verbs) — same singular/plural split as Units 10-11.
  { id: 'izan-past', verbId: 'izan', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'izan-past-plural', verbId: 'izan', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'egon-past', verbId: 'egon', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'egon-past-plural', verbId: 'egon', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ukan-past', verbId: 'ukan', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'ukan-past-plural', verbId: 'ukan', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'looking-back-1a-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'egon', tense: 'past' },
      { verbId: 'ukan', tense: 'past' },
    ],
  },
  {
    id: 'looking-back-1a-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'egon', tense: 'past' },
      { verbId: 'ukan', tense: 'past' },
    ],
  },
  // Unit 9 ("Looking Back I" continued — "I Went, I Came, I Saw") — simple
  // past for `joan`/`etorri`/`ikusi`. `joan`/`etorri`'s past is the
  // periphrastic participle + `izan`'s past auxiliary (`joan nintzen`,
  // `etorri nintzen`) — distinct from §6's *imperfective* `nindoan`/`zetorren`
  // forms, which stay reserved for Phase III's "Motion in Progress (Past)"
  // unit. `ikusi`'s past is participle + `ukan`'s past auxiliary
  // (`ikusi nuen`). See `docs/LANGUAGE_DECISIONS.md` for sourcing.
  { id: 'joan-past', verbId: 'joan', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'joan-past-plural', verbId: 'joan', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'etorri-past', verbId: 'etorri', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'etorri-past-plural', verbId: 'etorri', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ikusi-past', verbId: 'ikusi', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'ikusi-past-plural', verbId: 'ikusi', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'looking-back-1b-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ikusi', tense: 'past' },
    ],
  },
  {
    id: 'looking-back-1b-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ikusi', tense: 'past' },
    ],
  },
  // Unit 10 ("Daily Routine (Transitive)", Phase II) — `jan`/`edan`/`erosi`,
  // each with a full 6-person grid (Person-Expansion Rule). `ikusi` — the
  // fourth verb of this group in the original journey — moved to Unit 3 as
  // Phase I's first periphrastic verb, so `unit-7-review`/`unit-7-review-plural`
  // below cover only `jan`/`edan`/`erosi`. Per the app-wide "never more than 3
  // persons per exercise" rule, each verb's present-tense practice splits into
  // a `PHASE_1_PERSONS` lesson (ni/zu/hura) immediately followed by a
  // `-plural` `PHASE_1_PLURAL_PERSONS` lesson (gu/zuek/haiek).
  { id: 'jan-present', verbId: 'jan', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'jan-present-plural', verbId: 'jan', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'edan-present', verbId: 'edan', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'edan-present-plural', verbId: 'edan', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'erosi-present', verbId: 'erosi', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'erosi-present-plural', verbId: 'erosi', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-7-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
    ],
  },
  {
    id: 'unit-7-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
    ],
  },
  // Unit 11 ("Physical States & Possessions", Phase II) — two new synthetic
  // verbs, `eduki` (nor-nork) and `ibili` (nor), each with a full 6-person
  // grid — same singular/plural split as Unit 10.
  { id: 'eduki-present', verbId: 'eduki', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'eduki-present-plural', verbId: 'eduki', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ibili-present', verbId: 'ibili', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'ibili-present-plural', verbId: 'ibili', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-8-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'eduki', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
    ],
  },
  {
    id: 'unit-8-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'eduki', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
    ],
  },
  // Unit 12 ("Looking Back II" — "I Ate, I Drank, I Bought") — simple past for
  // `jan`/`edan`/`erosi`, directly documented in `docs/CONJUGATIONS.md` §7
  // (participle + `ukan`'s past auxiliary, e.g. `jan nuen`).
  { id: 'jan-past', verbId: 'jan', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'jan-past-plural', verbId: 'jan', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'edan-past', verbId: 'edan', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'edan-past-plural', verbId: 'edan', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'erosi-past', verbId: 'erosi', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'erosi-past-plural', verbId: 'erosi', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'looking-back-2a-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'past' },
      { verbId: 'edan', tense: 'past' },
      { verbId: 'erosi', tense: 'past' },
    ],
  },
  {
    id: 'looking-back-2a-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'past' },
      { verbId: 'edan', tense: 'past' },
      { verbId: 'erosi', tense: 'past' },
    ],
  },
  // Unit 13 ("Looking Back II" continued — "I Had, I Walked Around") — simple
  // past for `eduki` (synthetic, `neukan`/`zeneukan`/...) and `ibili`
  // (periphrastic, `ibili nintzen` — distinct from §6's imperfective
  // `nenbilen`, reserved for Phase III's "Motion in Progress (Past)" unit).
  { id: 'eduki-past', verbId: 'eduki', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'eduki-past-plural', verbId: 'eduki', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ibili-past', verbId: 'ibili', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'ibili-past-plural', verbId: 'ibili', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'looking-back-2b-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'eduki', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
    ],
  },
  {
    id: 'looking-back-2b-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'eduki', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
    ],
  },
  // Units 14-17 ("Intentions & Future Actions", Phase II) — zero new verbs,
  // "only the participle-formation rule is new" (`docs/LEARNING_JOURNEY.md`):
  // every verb from Units 1-13 except `ari` (see `docs/LANGUAGE_DECISIONS.md`)
  // gets a `future` practice lesson, reusing its existing present-tense
  // auxiliary table under a `-ko`/`-go` participle. `nahi`/`jakin`'s `future`
  // tables stay 3-person (ni/zu/hura) like their `present` ones, so they're
  // unchanged below. Every other verb's `future` table is 6-person, so — same
  // singular/plural split as Units 10-13 — each gets a `PHASE_1_PERSONS`
  // lesson immediately followed by a `-plural` `PHASE_1_PLURAL_PERSONS`
  // lesson. This was originally one 32-lesson mega-unit; it's split into four
  // ~8-lesson units (Future Groups A-D) for pacing, each with its own
  // `unit-9-review-N`/`-plural` consolidation pair (`unit-9-review-2-plural`
  // drops `nahi`/`jakin`, which have no plural data, and covers just
  // `joan`/`etorri`).
  // Unit 14 (Future Group A): izan/egon/ukan
  { id: 'izan-future', verbId: 'izan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'izan-future-plural', verbId: 'izan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'egon-future', verbId: 'egon', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'egon-future-plural', verbId: 'egon', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ukan-future', verbId: 'ukan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'ukan-future-plural', verbId: 'ukan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-9-review-1',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'egon', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-1-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'egon', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  // Unit 15 (Future Group B): nahi/jakin/joan/etorri
  { id: 'nahi-future', verbId: 'nahi', tense: 'future' },
  { id: 'jakin-future', verbId: 'jakin', tense: 'future' },
  { id: 'joan-future', verbId: 'joan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'joan-future-plural', verbId: 'joan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'etorri-future', verbId: 'etorri', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'etorri-future-plural', verbId: 'etorri', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-9-review-2',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'nahi', tense: 'future' },
      { verbId: 'jakin', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-2-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
    ],
  },
  // Unit 16 (Future Group C): jan/edan/erosi
  { id: 'jan-future', verbId: 'jan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'jan-future-plural', verbId: 'jan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'edan-future', verbId: 'edan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'edan-future-plural', verbId: 'edan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'erosi-future', verbId: 'erosi', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'erosi-future-plural', verbId: 'erosi', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-9-review-3',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-3-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
    ],
  },
  // Unit 17 (Future Group D): ikusi/eduki/ibili
  { id: 'ikusi-future', verbId: 'ikusi', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'ikusi-future-plural', verbId: 'ikusi', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'eduki-future', verbId: 'eduki', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'eduki-future-plural', verbId: 'eduki', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ibili-future', verbId: 'ibili', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'ibili-future-plural', verbId: 'ibili', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-9-review-4',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-4-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
    ],
  },
]
