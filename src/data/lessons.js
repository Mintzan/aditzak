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
// Gate units (6, 7, 17, 22, ...) are a bigger, cross-unit version of the same
// shape once implemented.
// Phase I's "Survival Present" horizon (`docs/LEARNING_JOURNEY.md`) restricts
// every verb's first lessons to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` arrive
// together in Unit 5 ("Expansion"), positioned right after Unit 4 since every
// verb it expands (`izan`/`egon`/`ukan`/`joan`/`etorri`/`ikusi`) is introduced
// by then — see `docs/DECISIONS.md`, "Moved the Expansion gate earlier". Unit
// 5 grew `izan`/`egon`/`ukan`/`joan`/`etorri`'s `conjugations.present` tables
// to 6 persons *in place*, so every other lesson reusing those tables — Units
// 1-4's own practice lessons and Unit 7's negation reviews alike — needs a
// `persons` filter to stay within its place in the journey. `persons`
// re-restricts those lessons back to the 3-person horizon — see
// `docs/DECISIONS.md`, "Restored Phase I's 3-person pacing". The app-wide
// rule is: never drill more than 3 grammatical persons in a single exercise.
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
  // `PHASE_1_PERSONS` here — its `gu`/`zuek`/`haiek` forms arrive in Unit 5
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
  // Unit 5 ("Expansion — Bringing in the Plural") — zero new verbs for
  // `izan`/`egon`/`ukan`/`joan`/`etorri`. Their `conjugations.present`
  // (plus their `sentences`/`pronouns`/`pronounSentences`) gained `gu`/`zuek`/
  // `haiek` rows directly (see `docs/DECISIONS.md`). Their own lessons above
  // stay on the 3-person horizon via `PHASE_1_PERSONS`, so this unit's own
  // reviews are the *first* place those verbs' present tense is drilled with
  // `gu`/`zuek`/`haiek` — `persons: PHASE_1_PLURAL_PERSONS` keeps each review
  // focused on exactly those three new forms (never more than 3 persons per
  // exercise), matching the unit's "bringing in the plural" focus. This unit's
  // own consolidation pass is split into three reviews, using the same
  // cross-unit pairing as Unit 7 below (Unit 1: izan/egon, Unit 2: ukan, Unit
  // 4: joan/etorri all paired across origins) — a single five-source review
  // landed at 30 questions; each of these three lands at exactly 12. `ikusi`
  // (Unit 3) also expands to `gu`/`zuek`/`haiek` here via its own
  // `-plural`/review pair, mirroring Units 10-11's singular/plural split.
  // Positioned right after Unit 4 ("Moving Around") rather than after the
  // negation gate — every verb this unit expands (`izan`/`egon`/`ukan`/
  // `joan`/`etorri`/`ikusi`) is introduced by Unit 4, so this is the earliest
  // point in the journey `zuek`/`gu`/`haiek` forms (e.g. `zarete`) can appear
  // — see `docs/DECISIONS.md`, "Moved the Expansion gate earlier".
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
  // Unit 6 ("The Immediate Continuous") — `ari`, riding `izan`'s present
  // table.
  { id: 'ari-present', verbId: 'ari', tense: 'present' },
  {
    id: 'unit-4-review',
    review: true,
    sources: [{ verbId: 'ari', tense: 'present' }],
  },
  // Unit 7 ("REFRESH — The Inversion Matrix", Refresh Gate A) — zero new
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
  // Unit 8 ("Looking Back I — The izan-Past Pool") — `izan`'s past auxiliary
  // (nintzen/zinen/zen/ginen/zineten/ziren) is shared *exactly* by `izan`
  // itself (synthetic — it *is* these forms) and by `joan`/`etorri`/`ibili`
  // (periphrastic simple past — "joan/etorri/ibili" + these forms). Pooled
  // into two mixed-verb lessons following Unit 10's "pooled auxiliary" design
  // (`docs/DECISIONS.md`) rather than four near-identical per-verb
  // singular/plural pairs (issue #84) — every question still isolates the
  // auxiliary-by-person pattern within whichever verb's table it rolls, but
  // which verb supplies a given question varies question-to-question. Per the
  // app-wide "max 3 persons per exercise" rule, split into a `PHASE_1_PERSONS`
  // lesson and a `-plural` `PHASE_1_PLURAL_PERSONS` lesson, mirroring
  // `unit-10-present`/`unit-10-present-plural`.
  {
    id: 'izan-past-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
    ],
  },
  {
    id: 'izan-past-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
    ],
  },
  // Unit 9 ("Looking Back I — The ukan-Past Pool") — `ukan`'s past auxiliary
  // (nuen/zenuen/zuen/genuen/zenuten/zuten) is shared *exactly* by `ukan`
  // itself (synthetic) and by `jan`/`edan`/`erosi`/`ikusi` (periphrastic
  // simple past — "jan/edan/erosi/ikusi" + these forms). Same pooling as Unit
  // 8, for the larger of the two past-auxiliary families (issue #84).
  // `joan`/`etorri`/`ibili`'s past is distinct from §6's *imperfective*
  // `nindoan`/`zetorren`/`nenbilen` forms, which stay reserved for Phase III's
  // "Motion in Progress (Past)" unit. See `docs/LANGUAGE_DECISIONS.md` for
  // sourcing.
  {
    id: 'ukan-past-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'jan', tense: 'past' },
      { verbId: 'edan', tense: 'past' },
      { verbId: 'erosi', tense: 'past' },
      { verbId: 'ikusi', tense: 'past' },
    ],
  },
  {
    id: 'ukan-past-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'jan', tense: 'past' },
      { verbId: 'edan', tense: 'past' },
      { verbId: 'erosi', tense: 'past' },
      { verbId: 'ikusi', tense: 'past' },
    ],
  },
  // Unit 10 ("Daily Routine (Transitive)", Phase II) — the `ukan`-present
  // NOR-NORK auxiliary (`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`), drilled
  // across a *pool* of verbs (`jan`/`edan`/`erosi`/`ikusi`, each with a full
  // 6-person grid) rather than one practice lesson per verb. Per
  // `docs/DECISIONS.md`, the point of this unit is the auxiliary pattern, not
  // any one action — every question still isolates that pattern within its
  // own verb's table (same participle, varying person), but which verb
  // supplies a given question varies, so "whatever verb fits" rather than a
  // verb-by-verb march. `ikusi` (Unit 3) already has full present-tense
  // `sentences`/`pronounSentences`, so it slots into the pool with no new
  // data. Per the app-wide "never more than 3 persons per exercise" rule,
  // split into a `PHASE_1_PERSONS` lesson (ni/zu/hura) and a `-plural`
  // `PHASE_1_PLURAL_PERSONS` lesson (gu/zuek/haiek). Adding another
  // present-tense verb to this pattern later is just appending it to both
  // `sources` arrays (plus its own `VERBS` table) — no new lesson ids needed.
  {
    id: 'unit-10-present',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
      { verbId: 'ikusi', tense: 'present' },
    ],
  },
  {
    id: 'unit-10-present-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
      { verbId: 'ikusi', tense: 'present' },
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
  // Unit 12 ("Looking Back II — egon's Own Past") — `egon`'s past
  // (nengoen/zeunden/zegoen/geunden/zeundeten/zeuden) is its own synthetic
  // paradigm, sharing no suffix family with either Unit 8 or Unit 9's pools
  // (issue #84) — `joan`/`ibili` moved into Unit 8's pool, leaving `egon` on
  // its own. Keeps a dedicated practice + review pair, singular and plural,
  // same shape as Unit 3/5's single-verb `ikusi-present`/`ikusi-present-plural`
  // (+ their own `-review` lessons).
  { id: 'egon-past', verbId: 'egon', tense: 'past', persons: PHASE_1_PERSONS },
  {
    id: 'egon-past-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [{ verbId: 'egon', tense: 'past' }],
  },
  { id: 'egon-past-plural', verbId: 'egon', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'egon-past-plural-review',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [{ verbId: 'egon', tense: 'past' }],
  },
  // Unit 13 ("Looking Back II — eduki's Own Past") — `eduki`'s past
  // (neukan/zeneukan/zeukan/geneukan/zeneukaten/zeukaten) is likewise its own
  // synthetic paradigm, the other "odd one out" from issue #84 — `jan`/`edan`/
  // `erosi`/`ikusi` moved into Unit 9's pool, leaving `eduki` on its own. Same
  // practice + review, singular + plural shape as Unit 12.
  { id: 'eduki-past', verbId: 'eduki', tense: 'past', persons: PHASE_1_PERSONS },
  {
    id: 'eduki-past-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [{ verbId: 'eduki', tense: 'past' }],
  },
  { id: 'eduki-past-plural', verbId: 'eduki', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'eduki-past-plural-review',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [{ verbId: 'eduki', tense: 'past' }],
  },
  // Stage 6 — "Talking About the Future (Geroa)", Phase II — zero new verbs,
  // "only the participle-formation rule is new" (`docs/LEARNING_JOURNEY.md`):
  // every verb from Units 1-13 except `ari` (see `docs/LANGUAGE_DECISIONS.md`)
  // can take a `future` form built by reusing its existing present-tense
  // auxiliary table under a `-ko`/`-go` participle.
  //
  // The Basque future is morphologically trivial — one rule, layered onto
  // auxiliaries the learner already drilled in Units 1-13 — so this was
  // deliberately *compressed* from four near-identical per-verb drill units
  // (the old "Future Groups A-D", ~32 lessons) into two: Unit 14 teaches the
  // rule on a small core set, and Unit 15 spreads it across the remaining
  // verbs as cross-verb *mixer reviews* rather than re-drilling each verb's
  // table one at a time. See `docs/DECISIONS.md` (2026-06-14, "Compressed the
  // future stage").
  //
  // Unit 14 (The Future Tense): introduce `-ko`/`-go` on a three-verb core
  // spanning both auxiliary patterns — `izan` (nor / `naiz`), `ukan`
  // (nor-nork / `dut`), `joan` (nor motion / `naiz`) — full singular/plural
  // split (same as Units 10-13) plus an intro-review pair.
  { id: 'izan-future', verbId: 'izan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'izan-future-plural', verbId: 'izan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ukan-future', verbId: 'ukan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'ukan-future-plural', verbId: 'ukan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'joan-future', verbId: 'joan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'joan-future-plural', verbId: 'joan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'future-intro-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
    ],
  },
  {
    id: 'future-intro-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
    ],
  },
  // Unit 15 (The Future, Across Every Verb): the rule is already learned, so
  // the remaining verbs arrive as themed mixer reviews — which the engine
  // makes the *more* varied exercise type (cross-verb "which verb fits?",
  // case-mixer, the full sentence/typing/spot-error mix, weak-spot boosters)
  // rather than another round of one-verb-at-a-time form drills. `nahi`/`jakin`
  // stay 3-person (ni/zu/hura), so they appear only in singular mixers; their
  // plural counterparts simply drop them.
  {
    id: 'future-mixer-being-going',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'egon', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-being-going-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'egon', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-eating-buying',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-eating-buying-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-having-knowing',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'nahi', tense: 'future' },
      { verbId: 'jakin', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-having-knowing-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
    ],
  },
  // Cumulative capstone — a cross-section spanning both units and both
  // auxiliary patterns (nor: izan/joan · nor-nork: ukan/ikusi), so the stage
  // ends on mixed nor/nor-nork case-mixer and verb-choice questions rather
  // than a single verb's table.
  {
    id: 'future-mixer-capstone',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'ikusi', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-capstone-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'ikusi', tense: 'future' },
    ],
  },
]
