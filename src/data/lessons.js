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
// Gate units (8, 18, 25, 37) are a bigger, cross-unit version of the same
// shape once implemented.
// Phase I's "Survival Present" horizon (`docs/LEARNING_JOURNEY.md`) restricts
// every verb's first lessons to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` arrive
// together in Unit 7 ("Expansion"), positioned right after Unit 6 since every
// verb it expands (`izan`/`egon`/`ukan`/`joan`/`etorri`/`ikusi`) is introduced
// by then — see `docs/DECISIONS.md`, "Moved the Expansion gate earlier". Unit
// 7 grew `izan`/`egon`/`ukan`/`joan`/`etorri`'s `conjugations.present` tables
// to 6 persons *in place*, so every other lesson reusing those tables — Units
// 1, 2, and 6's own practice lessons and Unit 10's negation reviews alike —
// needs a `persons` filter to stay within its place in the journey. `persons`
// re-restricts those lessons back to the 3-person horizon — see
// `docs/DECISIONS.md`, "Restored Phase I's 3-person pacing". The app-wide
// rule is: never drill more than 3 grammatical persons in a single exercise.
export const PHASE_1_PERSONS = ['ni', 'zu', 'hura']
export const PHASE_1_PLURAL_PERSONS = ['gu', 'zuek', 'haiek']

// Locate a specific lesson: grep for `id: 'lessonId'` (e.g. `id:
// 'izan-present'`) — each lesson is a single-line entry.

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
  // === N-2 ("The Ergative Leap") — ukan present, taught alone (object fixed
  // to hura), ni/zu/hura. The single steepest jump in the journey (the
  // absolutive-to-ergative subject shift, `ni naiz` → `nik dut`) — given its
  // own unit and extra practice per docs/LEARNING_JOURNEY_EVALUATION.md F6.
  { id: 'ukan-present', verbId: 'ukan', tense: 'present', persons: PHASE_1_PERSONS },
  // N-2·L2 — "the ni→nik shift": izan vs ukan present, side by side.
  {
    id: 'ukan-ni-nik-shift-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // N-2's unit review — ukan present only (nahi/jakin moved to N-4).
  {
    id: 'unit-2-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [{ verbId: 'ukan', tense: 'present' }],
  },
  // === N-3 ('"Ni" vs. "Nik" — The Case-Marking Checkpoint') — zero new verbs.
  // Drills bare (`izan`/`egon`) vs. ergative (`ukan`) subjects to kill
  // ergative `-k` drift, the most common beginner error, at its source —
  // see docs/LEARNING_JOURNEY_EVALUATION.md F7 (the Phase-I counterpart of
  // Gate C). N-3·L2's "spot the drift" framing (`†Nik naiz`) is implemented
  // with today's case-mixer/verb-choice primitives rather than a dedicated
  // error-spotting mechanic — see `docs/DECISIONS.md`, "#151 ergative
  // restructure", which defers that mechanic to issue #141.
  // N-3·L1 — "sort the subject": izan vs ukan.
  {
    id: 'case-marking-sort-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // N-3·L2 — "spot the drift": egon vs ukan.
  {
    id: 'case-marking-drift-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'egon', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // N-3's unit review — izan + egon + ukan together.
  {
    id: 'case-marking-checkpoint-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // === N-4 ("Knowing & Wanting") — jakin (synthetic, same ergative suffixes
  // as ukan) + nahi.
  { id: 'jakin-present', verbId: 'jakin', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'nahi-present', verbId: 'nahi', tense: 'present', persons: PHASE_1_PERSONS },
  // N-4 extra practice — jakin vs ukan (same suffix family).
  {
    id: 'jakin-suffix-family-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jakin', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // N-4's unit review — jakin + nahi + ukan.
  {
    id: 'knowing-wanting-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jakin', tense: 'present' },
      { verbId: 'nahi', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  // Unit 5 ("Seeing", Phase I) — `ikusi`, Phase I's first periphrastic verb,
  // introduced here on the same `nor-nork`/object-fixed-`hura` shape as
  // Unit 2's `ukan` so the synthetic/periphrastic contrast shows up early
  // rather than only at Unit 13. Reuses `ikusi`'s existing 6-person
  // `conjugations.present` table (from Unit 13's verb data) restricted to
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
  // #143: `ibili`'s present joins Unit 6 ("Moving Around") rather than
  // debuting alongside `eduki` in Unit 14 — its past is already drilled in
  // Unit 11's `izan`-past pool, so introducing its present here keeps every
  // verb's present ahead of its past (docs/LEARNING_JOURNEY_EVALUATION.md F8).
  // Its `gu`/`zuek`/`haiek` forms still arrive in Unit 14 via
  // `ibili-present-plural`.
  { id: 'ibili-present', verbId: 'ibili', tense: 'present', persons: PHASE_1_PERSONS },
  {
    id: 'unit-3-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
    ],
  },
  // `nor-fodder-present`/`-plural`: the regular-`nor` fodder pool #318
  // reserved (`sartu`/`atera`/`hasi`/`bizi izan` from #319; `erori`/`jaiki`
  // from #320 complete it to the 6-source cap). `joan-present`/
  // `etorri-present`/`ibili-present` above stay single-verb lessons — they're
  // synthetic-paradigm introducers (#309), not fodder.
  {
    id: 'nor-fodder-present',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'sartu', tense: 'present' },
      { verbId: 'atera', tense: 'present' },
      { verbId: 'hasi', tense: 'present' },
      { verbId: 'bizi-izan', tense: 'present' },
      { verbId: 'erori', tense: 'present' },
      { verbId: 'jaiki', tense: 'present' },
    ],
  },
  {
    id: 'nor-fodder-present-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'sartu', tense: 'present' },
      { verbId: 'atera', tense: 'present' },
      { verbId: 'hasi', tense: 'present' },
      { verbId: 'bizi-izan', tense: 'present' },
      { verbId: 'erori', tense: 'present' },
      { verbId: 'jaiki', tense: 'present' },
    ],
  },
  // Unit 7 ("Expansion: Absolutive Plurals") — zero new verbs for
  // `izan`/`egon`/`joan`/`etorri`. Their `conjugations.present`
  // (plus their `sentences`/`pronouns`/`pronounSentences`) gained `gu`/`zuek`/
  // `haiek` rows directly (see `docs/DECISIONS.md`). Their own lessons above
  // stay on the 3-person horizon via `PHASE_1_PERSONS`, so this unit's own
  // reviews are the *first* place those verbs' present tense is drilled with
  // `gu`/`zuek`/`haiek` — `persons: PHASE_1_PLURAL_PERSONS` keeps each review
  // focused on exactly those three new forms (never more than 3 persons per
  // exercise), matching the unit's "bringing in the plural" focus. This unit's
  // own consolidation pass is split into three reviews, using the same
  // cross-unit pairing as Unit 10 below (Unit 1: izan/egon, Unit 2: ukan, Unit
  // 6: joan/etorri all paired across origins) — a single five-source review
  // landed at 30 questions; each of these three lands at exactly 12.
  // `unit-6-review-1` keeps its original `izan`+`ukan` pairing even though
  // `ukan`'s plural is technically the ergative paradigm Unit 8 is named
  // for — see `docs/DECISIONS.md`, "Split Unit 7's ergative-plural lessons
  // into Unit 8". Positioned right after Unit 6 ("Moving Around") rather than
  // after the negation gate — every verb this unit expands (`izan`/`egon`/
  // `joan`/`etorri`) is introduced by Unit 6, so this is the earliest point in
  // the journey `zuek`/`gu`/`haiek` forms (e.g. `zarete`) can appear — see
  // `docs/DECISIONS.md`, "Moved the Expansion gate earlier".
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
  // Unit 8 ("Expansion: Ergative Plurals") — zero new verbs, the same
  // `gu`/`zuek`/`haiek` rows `ukan`/`ikusi`'s present tables already carry,
  // framed on its own (rather than folded into Unit 7's absolutive-paradigm
  // reviews) so the lesson contrasts a *suffix* on the fixed `du-`/`ikusten
  // du-` stem (`dugu`/`ikusten dute`) against Unit 7's *stem* change (`naiz`
  // → `gara`) — "the plural moved: now it's a suffix". `ikusi-present-plural`
  // mirrors Units 12-13's singular/plural split; `ukan` gets its own
  // dedicated practice lesson (it was previously drilled plural only as part
  // of `unit-6-review-1`'s mixed izan/ukan pairing, which stays in Unit 7 —
  // see that unit's comment above).
  { id: 'ikusi-present-plural', verbId: 'ikusi', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'ikusi-present-plural-review',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [{ verbId: 'ikusi', tense: 'present' }],
  },
  { id: 'ukan-present-plural', verbId: 'ukan', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-8-ergative-review',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'ikusi', tense: 'present' },
    ],
  },
  // Unit 9 ("The Immediate Continuous") — `ari`, riding `izan`'s present
  // table.
  { id: 'ari-present', verbId: 'ari', tense: 'present' },
  {
    id: 'unit-4-review',
    review: true,
    sources: [{ verbId: 'ari', tense: 'present' }],
  },
  // Unit 10 ("REFRESH — The Inversion Matrix", Refresh Gate A) — zero new
  // verbs, drilling `ez` + auxiliary-fronting (`negativeSentences`) across the
  // six Units 1, 2, 4, and 6 verbs whose present-tense form is a single word
  // that stays intact under negation (`ikusi`, Unit 5's periphrastic verb, has
  // no `negativeSentences` — same as every other periphrastic verb, see
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
  // izan/egon, Units 2/4: ukan/jakin, Unit 6: joan/etorri) rather than keeping
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
  // Unit 11 ("What Just Happened — The Recent Past (Present Perfect)",
  // Phase II) — the present perfect (Lehenaldiko Burutua) is the perfective
  // participle + a *present* auxiliary (`etorri naiz` / `ikusi dut`), so it
  // teaches the participle while reusing already-known present auxiliaries
  // (Units 1/2/13) — zero new auxiliary forms. Split along the same
  // izan/ukan branch lines as the past pools that follow it: an
  // `izan`-branch pool (`izan`/`joan`/`etorri`) and an `ukan`-branch lesson
  // (`ikusi` — the only Unit 13 verb with a `presentPerfect` table so far,
  // see #281). `unit-11-review` folds both branches together; the
  // `gaur ... da` vs. `atzo ... zen` recency contrast itself waits for
  // Unit 12's past forms to exist (#283 tracks dedicated recency-contrast
  // distractors) — see `docs/LANGUAGE_DECISIONS.md`.
  {
    id: 'izan-present-perfect-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'presentPerfect' },
      { verbId: 'joan', tense: 'presentPerfect' },
      { verbId: 'etorri', tense: 'presentPerfect' },
    ],
  },
  {
    id: 'izan-present-perfect-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'presentPerfect' },
      { verbId: 'joan', tense: 'presentPerfect' },
      { verbId: 'etorri', tense: 'presentPerfect' },
    ],
  },
  { id: 'ikusi-present-perfect', verbId: 'ikusi', tense: 'presentPerfect', persons: PHASE_1_PERSONS },
  {
    id: 'ikusi-present-perfect-plural',
    verbId: 'ikusi',
    tense: 'presentPerfect',
    persons: PHASE_1_PLURAL_PERSONS,
  },
  {
    id: 'unit-11-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'presentPerfect' },
      { verbId: 'etorri', tense: 'presentPerfect' },
      { verbId: 'ikusi', tense: 'presentPerfect' },
    ],
  },
  // Unit 12 ("Looking Back I — The izan-Past Pool") — `izan`'s past auxiliary
  // (nintzen/zinen/zen/ginen/zineten/ziren) is shared *exactly* by `izan`
  // itself (synthetic — it *is* these forms) and by `joan`/`etorri`/`ibili`
  // (periphrastic simple past — "joan/etorri/ibili" + these forms). Pooled
  // into two mixed-verb lessons following Unit 13's "pooled auxiliary" design
  // (`docs/DECISIONS.md`) rather than four near-identical per-verb
  // singular/plural pairs (issue #84) — every question still isolates the
  // auxiliary-by-person pattern within whichever verb's table it rolls, but
  // which verb supplies a given question varies question-to-question. Per the
  // app-wide "max 3 persons per exercise" rule, split into a `PHASE_1_PERSONS`
  // lesson and a `-plural` `PHASE_1_PLURAL_PERSONS` lesson, mirroring
  // `unit-10-present`/`unit-10-present-plural`.
  // #331 — collapsed the former `izan-past-pool-2`/`-plural` sibling (#318's
  // remaining regular-`nor` fodder, from #319/#320) into this canonical pool.
  {
    id: 'izan-past-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
      { verbId: 'sartu', tense: 'past' },
      { verbId: 'atera', tense: 'past' },
      { verbId: 'hasi', tense: 'past' },
      { verbId: 'bizi-izan', tense: 'past' },
      { verbId: 'erori', tense: 'past' },
      { verbId: 'jaiki', tense: 'past' },
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
      { verbId: 'sartu', tense: 'past' },
      { verbId: 'atera', tense: 'past' },
      { verbId: 'hasi', tense: 'past' },
      { verbId: 'bizi-izan', tense: 'past' },
      { verbId: 'erori', tense: 'past' },
      { verbId: 'jaiki', tense: 'past' },
    ],
  },
  // Unit 12 ("Daily Routine (Transitive)", Phase II) — the `ukan`-present
  // NOR-NORK auxiliary (`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`), drilled
  // across a *pool* of verbs (`jan`/`edan`/`erosi`/`ikusi`/`hartu`, each with
  // a full 6-person grid) rather than one practice lesson per verb. Per
  // `docs/DECISIONS.md`, the point of this unit is the auxiliary pattern, not
  // any one action — every question still isolates that pattern within its
  // own verb's table (same participle, varying person), but which verb
  // supplies a given question varies, so "whatever verb fits" rather than a
  // verb-by-verb march. `ikusi` (Unit 5) already has full present-tense
  // `sentences`/`pronounSentences`, so it slots into the pool with no new
  // data. #143 added `hartu` to stage the first `-ten`/`-tzen` minimal pair —
  // `jan`'s participle (`jaten`) takes `-ten`, `hartu`'s (`hartzen`) takes
  // `-tzen`, now drilled side by side in the same pool. Per the app-wide
  // "never more than 3 persons per exercise" rule, split into a
  // `PHASE_1_PERSONS` lesson (ni/zu/hura) and a `-plural`
  // `PHASE_1_PLURAL_PERSONS` lesson (gu/zuek/haiek). Adding another
  // present-tense verb to this pattern later is just appending it to both
  // `sources` arrays (plus its own `VERBS` table) — no new lesson ids needed.
  // #331 — collapsed from the former `unit-10-present-{2,3,4,5,6}` +
  // `-recognition-{1,2}` chain (#318/#319/#320/#321) into this single
  // canonical pool, now that #330's per-session carrier sampling
  // (`CARRIERS_PER_SESSION`) bounds session length regardless of pool size.
  // The academic-tier verbs (formerly `-recognition-{1,2}`) carry
  // `recognitionOnly` on their `VERBS` entry instead of living in a
  // separate `mode: 'recognition'` lesson, so they stay exposure-only even
  // sampled alongside production carriers.
  {
    id: 'unit-10-present',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
      { verbId: 'ikusi', tense: 'present' },
      { verbId: 'hartu', tense: 'present' },
      { verbId: 'egin', tense: 'present' },
      { verbId: 'irakurri', tense: 'present' },
      { verbId: 'idatzi', tense: 'present' },
      { verbId: 'ikasi', tense: 'present' },
      { verbId: 'entzun', tense: 'present' },
      { verbId: 'utzi', tense: 'present' },
      { verbId: 'aurkitu', tense: 'present' },
      { verbId: 'bilatu', tense: 'present' },
      { verbId: 'galdu', tense: 'present' },
      { verbId: 'jaso', tense: 'present' },
      { verbId: 'saldu', tense: 'present' },
      { verbId: 'itxaron', tense: 'present' },
      { verbId: 'eskatu', tense: 'present' },
      { verbId: 'galdetu', tense: 'present' },
      { verbId: 'adierazi', tense: 'present' },
      { verbId: 'bukatu', tense: 'present' },
      { verbId: 'amaitu', tense: 'present' },
      { verbId: 'gainditu', tense: 'present' },
      { verbId: 'bereiztu', tense: 'present' },
      { verbId: 'ezagutu', tense: 'present' },
      { verbId: 'sentitu', tense: 'present' },
      { verbId: 'pentsatu', tense: 'present' },
      { verbId: 'sumatu', tense: 'present' },
      { verbId: 'ulertu', tense: 'present' },
      { verbId: 'aztertu', tense: 'present' },
      { verbId: 'ukatu', tense: 'present' },
      { verbId: 'batu', tense: 'present' },
      { verbId: 'planteatu', tense: 'present' },
      { verbId: 'hausnartu', tense: 'present' },
      { verbId: 'argudiatu', tense: 'present' },
      { verbId: 'ondorioztatu', tense: 'present' },
      { verbId: 'gaitzetsi', tense: 'present' },
      { verbId: 'aldarrikatu', tense: 'present' },
      { verbId: 'plazaratu', tense: 'present' },
      { verbId: 'sustatu', tense: 'present' },
      { verbId: 'bultzatu', tense: 'present' },
      { verbId: 'bermatu', tense: 'present' },
      { verbId: 'babestu', tense: 'present' },
      { verbId: 'ziurtatu', tense: 'present' },
      { verbId: 'borobildu', tense: 'present' },
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
      { verbId: 'hartu', tense: 'present' },
      { verbId: 'egin', tense: 'present' },
      { verbId: 'irakurri', tense: 'present' },
      { verbId: 'idatzi', tense: 'present' },
      { verbId: 'ikasi', tense: 'present' },
      { verbId: 'entzun', tense: 'present' },
      { verbId: 'utzi', tense: 'present' },
      { verbId: 'aurkitu', tense: 'present' },
      { verbId: 'bilatu', tense: 'present' },
      { verbId: 'galdu', tense: 'present' },
      { verbId: 'jaso', tense: 'present' },
      { verbId: 'saldu', tense: 'present' },
      { verbId: 'itxaron', tense: 'present' },
      { verbId: 'eskatu', tense: 'present' },
      { verbId: 'galdetu', tense: 'present' },
      { verbId: 'adierazi', tense: 'present' },
      { verbId: 'bukatu', tense: 'present' },
      { verbId: 'amaitu', tense: 'present' },
      { verbId: 'gainditu', tense: 'present' },
      { verbId: 'bereiztu', tense: 'present' },
      { verbId: 'ezagutu', tense: 'present' },
      { verbId: 'sentitu', tense: 'present' },
      { verbId: 'pentsatu', tense: 'present' },
      { verbId: 'sumatu', tense: 'present' },
      { verbId: 'ulertu', tense: 'present' },
      { verbId: 'aztertu', tense: 'present' },
      { verbId: 'ukatu', tense: 'present' },
      { verbId: 'batu', tense: 'present' },
      { verbId: 'planteatu', tense: 'present' },
      { verbId: 'hausnartu', tense: 'present' },
      { verbId: 'argudiatu', tense: 'present' },
      { verbId: 'ondorioztatu', tense: 'present' },
      { verbId: 'gaitzetsi', tense: 'present' },
      { verbId: 'aldarrikatu', tense: 'present' },
      { verbId: 'plazaratu', tense: 'present' },
      { verbId: 'sustatu', tense: 'present' },
      { verbId: 'bultzatu', tense: 'present' },
      { verbId: 'bermatu', tense: 'present' },
      { verbId: 'babestu', tense: 'present' },
      { verbId: 'ziurtatu', tense: 'present' },
      { verbId: 'borobildu', tense: 'present' },
    ],
  },
  // #286 — the NOR-number axis (`dut` vs `ditut`, plural *object*, not
  // plural NORK subject) for the core transitive verbs, pooled the same way
  // as `unit-10-present` above. `eduki` doesn't debut its singular-object
  // present until Unit 15, but its `presentPlural` table (#284) shares the
  // same `ditut`-family suffix as the rest of this pool, so it's included
  // here per #286's scope rather than waiting for its own unit.
  {
    id: 'nor-nork-present-plural-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'presentPlural' },
      { verbId: 'jan', tense: 'presentPlural' },
      { verbId: 'edan', tense: 'presentPlural' },
      { verbId: 'erosi', tense: 'presentPlural' },
      { verbId: 'hartu', tense: 'presentPlural' },
      { verbId: 'ikusi', tense: 'presentPlural' },
      { verbId: 'eduki', tense: 'presentPlural' },
      // Long-tail transitive verbs whose example sentences carry plural
      // objects (saldu's "barazkiak", utzi's "giltzak", …); their
      // `presentPlural` tables were added so those sentences agree (`ditugu`,
      // not `dugu`) instead of being singularised.
      { verbId: 'egin', tense: 'presentPlural' },
      { verbId: 'irakurri', tense: 'presentPlural' },
      { verbId: 'idatzi', tense: 'presentPlural' },
      { verbId: 'ikasi', tense: 'presentPlural' },
      { verbId: 'entzun', tense: 'presentPlural' },
      { verbId: 'utzi', tense: 'presentPlural' },
      { verbId: 'bilatu', tense: 'presentPlural' },
      { verbId: 'saldu', tense: 'presentPlural' },
    ],
  },
  {
    id: 'nor-nork-present-plural-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'presentPlural' },
      { verbId: 'jan', tense: 'presentPlural' },
      { verbId: 'edan', tense: 'presentPlural' },
      { verbId: 'erosi', tense: 'presentPlural' },
      { verbId: 'hartu', tense: 'presentPlural' },
      { verbId: 'ikusi', tense: 'presentPlural' },
      { verbId: 'eduki', tense: 'presentPlural' },
      { verbId: 'egin', tense: 'presentPlural' },
      { verbId: 'irakurri', tense: 'presentPlural' },
      { verbId: 'idatzi', tense: 'presentPlural' },
      { verbId: 'ikasi', tense: 'presentPlural' },
      { verbId: 'entzun', tense: 'presentPlural' },
      { verbId: 'utzi', tense: 'presentPlural' },
      { verbId: 'bilatu', tense: 'presentPlural' },
      { verbId: 'saldu', tense: 'presentPlural' },
    ],
  },
  // Unit 13 ("Looking Back I — The "ukan" Past Pool", Phase II) — `ukan`'s
  // past auxiliary (nuen/zenuen/zuen/genuen/zenuten/zuten) is shared *exactly*
  // by `ukan` itself (synthetic) and by `jan`/`edan`/`erosi`/`ikusi`
  // (periphrastic simple past — "jan/edan/erosi/ikusi" + these forms). Same
  // pooling as Unit 11, for the larger of the two past-auxiliary families
  // (issue #84). #143 moved this pool after Unit 12 so every verb's present
  // (Unit 12) is taught before its past (this unit) —
  // docs/LEARNING_JOURNEY_EVALUATION.md F8. `joan`/`etorri`/`ibili`'s past is
  // distinct from §6's *imperfective* `nindoan`/`zetorren`/`nenbilen` forms,
  // which stay reserved for Phase III's "Motion in Progress (Past)" unit.
  // `jakin` (#245) joins this pool once its own past gap (`hik`/`zuk`/`zuek`)
  // was sourced — its present already rides `ukan`'s suffix family (Unit 4),
  // and its past (`nekien`/`zekien`/...) follows the same `-ekien`/`-ekiten`
  // stem alternation on top of `ukan`'s prefix pattern. See
  // `docs/LANGUAGE_DECISIONS.md` for sourcing.
  // #331 — collapsed from the former `ukan-past-pool-{2,3,4,5,6}` +
  // `-recognition-{1,2}` chain (#318/#319/#320/#321) into this single
  // canonical pool (mirrors `unit-10-present`'s collapse). Academic-tier
  // verbs carry `recognitionOnly` on their `VERBS` entry instead of a
  // separate `mode: 'recognition'` lesson.
  {
    id: 'ukan-past-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'jan', tense: 'past' },
      { verbId: 'edan', tense: 'past' },
      { verbId: 'erosi', tense: 'past' },
      { verbId: 'ikusi', tense: 'past' },
      { verbId: 'jakin', tense: 'past' },
      { verbId: 'egin', tense: 'past' },
      { verbId: 'irakurri', tense: 'past' },
      { verbId: 'idatzi', tense: 'past' },
      { verbId: 'ikasi', tense: 'past' },
      { verbId: 'entzun', tense: 'past' },
      { verbId: 'utzi', tense: 'past' },
      { verbId: 'aurkitu', tense: 'past' },
      { verbId: 'bilatu', tense: 'past' },
      { verbId: 'galdu', tense: 'past' },
      { verbId: 'jaso', tense: 'past' },
      { verbId: 'saldu', tense: 'past' },
      { verbId: 'itxaron', tense: 'past' },
      { verbId: 'eskatu', tense: 'past' },
      { verbId: 'galdetu', tense: 'past' },
      { verbId: 'adierazi', tense: 'past' },
      { verbId: 'bukatu', tense: 'past' },
      { verbId: 'amaitu', tense: 'past' },
      { verbId: 'gainditu', tense: 'past' },
      { verbId: 'bereiztu', tense: 'past' },
      { verbId: 'ezagutu', tense: 'past' },
      { verbId: 'sentitu', tense: 'past' },
      { verbId: 'pentsatu', tense: 'past' },
      { verbId: 'sumatu', tense: 'past' },
      { verbId: 'ulertu', tense: 'past' },
      { verbId: 'aztertu', tense: 'past' },
      { verbId: 'ukatu', tense: 'past' },
      { verbId: 'batu', tense: 'past' },
      { verbId: 'planteatu', tense: 'past' },
      { verbId: 'hausnartu', tense: 'past' },
      { verbId: 'argudiatu', tense: 'past' },
      { verbId: 'ondorioztatu', tense: 'past' },
      { verbId: 'gaitzetsi', tense: 'past' },
      { verbId: 'aldarrikatu', tense: 'past' },
      { verbId: 'plazaratu', tense: 'past' },
      { verbId: 'sustatu', tense: 'past' },
      { verbId: 'bultzatu', tense: 'past' },
      { verbId: 'bermatu', tense: 'past' },
      { verbId: 'babestu', tense: 'past' },
      { verbId: 'ziurtatu', tense: 'past' },
      { verbId: 'borobildu', tense: 'past' },
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
      { verbId: 'jakin', tense: 'past' },
      { verbId: 'egin', tense: 'past' },
      { verbId: 'irakurri', tense: 'past' },
      { verbId: 'idatzi', tense: 'past' },
      { verbId: 'ikasi', tense: 'past' },
      { verbId: 'entzun', tense: 'past' },
      { verbId: 'utzi', tense: 'past' },
      { verbId: 'aurkitu', tense: 'past' },
      { verbId: 'bilatu', tense: 'past' },
      { verbId: 'galdu', tense: 'past' },
      { verbId: 'jaso', tense: 'past' },
      { verbId: 'saldu', tense: 'past' },
      { verbId: 'itxaron', tense: 'past' },
      { verbId: 'eskatu', tense: 'past' },
      { verbId: 'galdetu', tense: 'past' },
      { verbId: 'adierazi', tense: 'past' },
      { verbId: 'bukatu', tense: 'past' },
      { verbId: 'amaitu', tense: 'past' },
      { verbId: 'gainditu', tense: 'past' },
      { verbId: 'bereiztu', tense: 'past' },
      { verbId: 'ezagutu', tense: 'past' },
      { verbId: 'sentitu', tense: 'past' },
      { verbId: 'pentsatu', tense: 'past' },
      { verbId: 'sumatu', tense: 'past' },
      { verbId: 'ulertu', tense: 'past' },
      { verbId: 'aztertu', tense: 'past' },
      { verbId: 'ukatu', tense: 'past' },
      { verbId: 'batu', tense: 'past' },
      { verbId: 'planteatu', tense: 'past' },
      { verbId: 'hausnartu', tense: 'past' },
      { verbId: 'argudiatu', tense: 'past' },
      { verbId: 'ondorioztatu', tense: 'past' },
      { verbId: 'gaitzetsi', tense: 'past' },
      { verbId: 'aldarrikatu', tense: 'past' },
      { verbId: 'plazaratu', tense: 'past' },
      { verbId: 'sustatu', tense: 'past' },
      { verbId: 'bultzatu', tense: 'past' },
      { verbId: 'bermatu', tense: 'past' },
      { verbId: 'babestu', tense: 'past' },
      { verbId: 'ziurtatu', tense: 'past' },
      { verbId: 'borobildu', tense: 'past' },
    ],
  },
  // #286 — `pastPlural` counterpart to `nor-nork-present-plural-pool` above
  // (`zenituen` vs `zenuten`), same pool of verbs plus `eduki`, mirroring
  // `ukan-past-pool`'s shape. `jakin` gained a `pastPlural` table in #287,
  // but stays out of this pool for now: its sibling `presentPlural` table
  // only covers `ni`/`zu`/`hura` (its own `present` is still missing
  // `guk`/`zuek`/`haiek` cells, a pre-existing gap), so adding `jakin` here
  // but not to the present-plural pools above would be an inconsistent
  // half-integration — left for a follow-up once that gap is closed.
  {
    id: 'nor-nork-past-plural-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'pastPlural' },
      { verbId: 'jan', tense: 'pastPlural' },
      { verbId: 'edan', tense: 'pastPlural' },
      { verbId: 'erosi', tense: 'pastPlural' },
      { verbId: 'hartu', tense: 'pastPlural' },
      { verbId: 'ikusi', tense: 'pastPlural' },
      { verbId: 'eduki', tense: 'pastPlural' },
      // Long-tail transitive verbs (see present-plural pool above) — their
      // `pastPlural` tables (`saldu nituen`, `utzi nituen`, …).
      { verbId: 'egin', tense: 'pastPlural' },
      { verbId: 'irakurri', tense: 'pastPlural' },
      { verbId: 'idatzi', tense: 'pastPlural' },
      { verbId: 'ikasi', tense: 'pastPlural' },
      { verbId: 'entzun', tense: 'pastPlural' },
      { verbId: 'utzi', tense: 'pastPlural' },
      { verbId: 'bilatu', tense: 'pastPlural' },
      { verbId: 'saldu', tense: 'pastPlural' },
    ],
  },
  {
    id: 'nor-nork-past-plural-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'pastPlural' },
      { verbId: 'jan', tense: 'pastPlural' },
      { verbId: 'edan', tense: 'pastPlural' },
      { verbId: 'erosi', tense: 'pastPlural' },
      { verbId: 'hartu', tense: 'pastPlural' },
      { verbId: 'ikusi', tense: 'pastPlural' },
      { verbId: 'eduki', tense: 'pastPlural' },
      { verbId: 'egin', tense: 'pastPlural' },
      { verbId: 'irakurri', tense: 'pastPlural' },
      { verbId: 'idatzi', tense: 'pastPlural' },
      { verbId: 'ikasi', tense: 'pastPlural' },
      { verbId: 'entzun', tense: 'pastPlural' },
      { verbId: 'utzi', tense: 'pastPlural' },
      { verbId: 'bilatu', tense: 'pastPlural' },
      { verbId: 'saldu', tense: 'pastPlural' },
    ],
  },
  // Unit 14 ("Physical States & Possessions", Phase II) — `eduki` (nor-nork)
  // debuts here with a full 6-person grid, same singular/plural split as Unit
  // 12. `ibili` (nor) debuted in Unit 6 (#143); only its `gu`/`zuek`/`haiek`
  // forms (`ibili-present-plural`) arrive here.
  { id: 'eduki-present', verbId: 'eduki', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'eduki-present-plural', verbId: 'eduki', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ibili-present-plural', verbId: 'ibili', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-8-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [{ verbId: 'eduki', tense: 'present' }],
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
  // Unit 15 ("Looking Back II — eduki's Own Past") — `eduki`'s past
  // (neukan/zeneukan/zeukan/geneukan/zeneukaten/zeukaten) is its own synthetic
  // paradigm, the "odd one out" from issue #84 — `jan`/`edan`/`erosi`/`ikusi`
  // moved into Unit 13's pool, leaving `eduki` on its own. #143 moved this
  // block ahead of `egon`'s past (now Unit 16) so `eduki`'s present (Unit 14)
  // and past (this unit) sit next to each other, mirroring Units 12/13's
  // present/past adjacency. Practice + review, singular + plural shape, same
  // as Unit 16.
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
  // Unit 16 ("Looking Back II — egon's Own Past") — `egon`'s past
  // (nengoen/zeunden/zegoen/geunden/zeundeten/zeuden) is its own synthetic
  // paradigm, sharing no suffix family with either Unit 11 or Unit 13's pools
  // (issue #84) — `joan`/`ibili` moved into Unit 11's pool, leaving `egon` on
  // its own. #143 moved this block after `eduki`'s past (Unit 15) as part of
  // the Phase II stage regroup (docs/DECISIONS.md). Dedicated practice +
  // review pair, singular and plural, same shape as Unit 5/7's single-verb
  // `ikusi-present`/`ikusi-present-plural` (+ their own `-review` lessons).
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
  // Stage 6 — "Talking About the Future (Geroa)", Phase II — zero new verbs,
  // "only the participle-formation rule is new" (`docs/LEARNING_JOURNEY.md`):
  // every verb from Units 1-15 except `ari` (see `docs/LANGUAGE_DECISIONS.md`)
  // can take a `future` form built by reusing its existing present-tense
  // auxiliary table under a `-ko`/`-go` participle.
  //
  // The Basque future is morphologically trivial — one rule, layered onto
  // auxiliaries the learner already drilled in Units 1-15 — so this was
  // deliberately *compressed* from four near-identical per-verb drill units
  // (the old "Future Groups A-D", ~32 lessons) into one unit (originally two
  // — see `docs/DECISIONS.md`, 2026-06-14, "Compressed the future stage";
  // #423 later merged them into one, see below): a rule intro on a small
  // core set, plus a single pooled review spreading it across every other
  // fodder verb rather than re-drilling each verb's table one at a time.
  //
  // The rule intro: `-ko`/`-go` on a two-verb core spanning both auxiliary
  // patterns — `izan` (nor / `naiz`), `ukan` (nor-nork / `dut`, also the
  // future's one suppletive exception — see below) — full singular/plural
  // split (same as Units 12-15) plus an intro-review. #143 added `etorri`'s
  // future to that intro-review to stage the first `-ko`/`-go` minimal pair
  // — `izan`'s future (`izango`) takes `-go`, `etorri`'s (`etorriko`) takes
  // `-ko`, drilled side by side here. `joan`'s own future was trimmed by
  // #423: it's `nor`-agreement like `izan` and was already redundant with
  // the intro-review's coverage, with no new skill of its own. `ukan-future`
  // stays as a dedicated lesson specifically because its future (`izango`)
  // is borrowed wholesale from `izan` rather than derived from `ukan`'s own
  // stem (which the mechanical `-ko`/`-go` rule would wrongly predict as
  // "ukango") — drilling it on its own keeps that exception visible instead
  // of folding it silently into the mechanical pool below.
  { id: 'izan-future', verbId: 'izan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'izan-future-plural', verbId: 'izan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ukan-future', verbId: 'ukan', tense: 'future', persons: PHASE_1_PERSONS },
  { id: 'ukan-future-plural', verbId: 'ukan', tense: 'future', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'future-intro-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
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
      { verbId: 'etorri', tense: 'future' },
    ],
  },
  // #417 — `futurePlural` counterpart to `nor-nork-present-plural-pool`/
  // `nor-nork-past-plural-pool` (`izango ditut` vs `izango dut`), same
  // pool of verbs plus `nahi` (whose own singular `future` table is
  // 3-person-only per the comment below, but `futurePlural` was sourced
  // with the full 6-person table, so it joins this pool same as the rest).
  {
    id: 'nor-nork-future-plural-pool',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'futurePlural' },
      { verbId: 'jan', tense: 'futurePlural' },
      { verbId: 'edan', tense: 'futurePlural' },
      { verbId: 'erosi', tense: 'futurePlural' },
      { verbId: 'hartu', tense: 'futurePlural' },
      { verbId: 'ikusi', tense: 'futurePlural' },
      { verbId: 'eduki', tense: 'futurePlural' },
      { verbId: 'nahi', tense: 'futurePlural' },
      // Long-tail transitive verbs (see present-plural pool above) — their
      // `futurePlural` tables (`salduko ditut`, `utziko ditut`, …).
      { verbId: 'egin', tense: 'futurePlural' },
      { verbId: 'irakurri', tense: 'futurePlural' },
      { verbId: 'idatzi', tense: 'futurePlural' },
      { verbId: 'ikasi', tense: 'futurePlural' },
      { verbId: 'entzun', tense: 'futurePlural' },
      { verbId: 'utzi', tense: 'futurePlural' },
      { verbId: 'bilatu', tense: 'futurePlural' },
      { verbId: 'saldu', tense: 'futurePlural' },
    ],
  },
  {
    id: 'nor-nork-future-plural-pool-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'ukan', tense: 'futurePlural' },
      { verbId: 'jan', tense: 'futurePlural' },
      { verbId: 'edan', tense: 'futurePlural' },
      { verbId: 'erosi', tense: 'futurePlural' },
      { verbId: 'hartu', tense: 'futurePlural' },
      { verbId: 'ikusi', tense: 'futurePlural' },
      { verbId: 'eduki', tense: 'futurePlural' },
      { verbId: 'nahi', tense: 'futurePlural' },
      { verbId: 'egin', tense: 'futurePlural' },
      { verbId: 'irakurri', tense: 'futurePlural' },
      { verbId: 'idatzi', tense: 'futurePlural' },
      { verbId: 'ikasi', tense: 'futurePlural' },
      { verbId: 'entzun', tense: 'futurePlural' },
      { verbId: 'utzi', tense: 'futurePlural' },
      { verbId: 'bilatu', tense: 'futurePlural' },
      { verbId: 'saldu', tense: 'futurePlural' },
    ],
  },
  // #423 — the rule is already learned, so every other fodder verb with a
  // `future` table (not already covered by a dative/covert-dative/invariant-
  // noun construction elsewhere) arrives pooled into one review rather than
  // a handful of hand-picked themed mixer pairs (the old "being/going",
  // "eating/buying", "having/knowing" pairs + capstone this replaces) — the
  // future is morphologically trivial enough that drilling it on a curated
  // 14-verb subset had no pedagogical edge over drilling it on the full
  // pool, and `CARRIERS_PER_SESSION` (`App.jsx`) already bounds session
  // length regardless of pool size. `suffixChoice: true` adds a handful of
  // "pick -ko or -go" recognition questions (see
  // `generateSuffixChoiceQuestions`, `lessonLogic.js`) isolating the actual
  // suffix decision from full conjugation — `ukan` is excluded from those
  // specifically (its future is `izan`'s suppletive `izango`, not its own
  // stem + suffix) even though it's still drilled here for the ordinary
  // conjugation practice. `nahi`/`jakin` stay 3-person (ni/zu/hura), so they
  // appear only in the singular pool; the plural pool simply drops them.
  {
    id: 'future-mixer-pool',
    review: true,
    suffixChoice: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
      { verbId: 'egon', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'nahi', tense: 'future' },
      { verbId: 'jakin', tense: 'future' },
      { verbId: 'hartu', tense: 'future' },
      { verbId: 'egin', tense: 'future' },
      { verbId: 'irakurri', tense: 'future' },
      { verbId: 'idatzi', tense: 'future' },
      { verbId: 'ikasi', tense: 'future' },
      { verbId: 'entzun', tense: 'future' },
      { verbId: 'utzi', tense: 'future' },
      { verbId: 'aurkitu', tense: 'future' },
      { verbId: 'bilatu', tense: 'future' },
      { verbId: 'galdu', tense: 'future' },
      { verbId: 'jaso', tense: 'future' },
      { verbId: 'saldu', tense: 'future' },
      { verbId: 'itxaron', tense: 'future' },
      { verbId: 'sartu', tense: 'future' },
      { verbId: 'atera', tense: 'future' },
      { verbId: 'hasi', tense: 'future' },
      { verbId: 'bizi-izan', tense: 'future' },
      { verbId: 'eskatu', tense: 'future' },
      { verbId: 'galdetu', tense: 'future' },
      { verbId: 'adierazi', tense: 'future' },
      { verbId: 'bukatu', tense: 'future' },
      { verbId: 'amaitu', tense: 'future' },
      { verbId: 'gainditu', tense: 'future' },
      { verbId: 'bereiztu', tense: 'future' },
      { verbId: 'ezagutu', tense: 'future' },
      { verbId: 'sentitu', tense: 'future' },
      { verbId: 'pentsatu', tense: 'future' },
      { verbId: 'sumatu', tense: 'future' },
      { verbId: 'ulertu', tense: 'future' },
      { verbId: 'aztertu', tense: 'future' },
      { verbId: 'ukatu', tense: 'future' },
      { verbId: 'batu', tense: 'future' },
      { verbId: 'planteatu', tense: 'future' },
      { verbId: 'erori', tense: 'future' },
      { verbId: 'jaiki', tense: 'future' },
      { verbId: 'hausnartu', tense: 'future' },
      { verbId: 'argudiatu', tense: 'future' },
      { verbId: 'ondorioztatu', tense: 'future' },
      { verbId: 'gaitzetsi', tense: 'future' },
      { verbId: 'aldarrikatu', tense: 'future' },
      { verbId: 'plazaratu', tense: 'future' },
      { verbId: 'sustatu', tense: 'future' },
      { verbId: 'bultzatu', tense: 'future' },
      { verbId: 'bermatu', tense: 'future' },
      { verbId: 'babestu', tense: 'future' },
      { verbId: 'ziurtatu', tense: 'future' },
      { verbId: 'borobildu', tense: 'future' },
    ],
  },
  {
    id: 'future-mixer-pool-plural',
    review: true,
    suffixChoice: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
      { verbId: 'egon', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'hartu', tense: 'future' },
      { verbId: 'egin', tense: 'future' },
      { verbId: 'irakurri', tense: 'future' },
      { verbId: 'idatzi', tense: 'future' },
      { verbId: 'ikasi', tense: 'future' },
      { verbId: 'entzun', tense: 'future' },
      { verbId: 'utzi', tense: 'future' },
      { verbId: 'aurkitu', tense: 'future' },
      { verbId: 'bilatu', tense: 'future' },
      { verbId: 'galdu', tense: 'future' },
      { verbId: 'jaso', tense: 'future' },
      { verbId: 'saldu', tense: 'future' },
      { verbId: 'itxaron', tense: 'future' },
      { verbId: 'sartu', tense: 'future' },
      { verbId: 'atera', tense: 'future' },
      { verbId: 'hasi', tense: 'future' },
      { verbId: 'bizi-izan', tense: 'future' },
      { verbId: 'eskatu', tense: 'future' },
      { verbId: 'galdetu', tense: 'future' },
      { verbId: 'adierazi', tense: 'future' },
      { verbId: 'bukatu', tense: 'future' },
      { verbId: 'amaitu', tense: 'future' },
      { verbId: 'gainditu', tense: 'future' },
      { verbId: 'bereiztu', tense: 'future' },
      { verbId: 'ezagutu', tense: 'future' },
      { verbId: 'sentitu', tense: 'future' },
      { verbId: 'pentsatu', tense: 'future' },
      { verbId: 'sumatu', tense: 'future' },
      { verbId: 'ulertu', tense: 'future' },
      { verbId: 'aztertu', tense: 'future' },
      { verbId: 'ukatu', tense: 'future' },
      { verbId: 'batu', tense: 'future' },
      { verbId: 'planteatu', tense: 'future' },
      { verbId: 'erori', tense: 'future' },
      { verbId: 'jaiki', tense: 'future' },
      { verbId: 'hausnartu', tense: 'future' },
      { verbId: 'argudiatu', tense: 'future' },
      { verbId: 'ondorioztatu', tense: 'future' },
      { verbId: 'gaitzetsi', tense: 'future' },
      { verbId: 'aldarrikatu', tense: 'future' },
      { verbId: 'plazaratu', tense: 'future' },
      { verbId: 'sustatu', tense: 'future' },
      { verbId: 'bultzatu', tense: 'future' },
      { verbId: 'bermatu', tense: 'future' },
      { verbId: 'babestu', tense: 'future' },
      { verbId: 'ziurtatu', tense: 'future' },
      { verbId: 'borobildu', tense: 'future' },
    ],
  },
  // Unit 19 (#148) — `behar` ("need to / have to"), riding `ukan`'s present/
  // future suffixes (`behar dut` / `beharko dut`). #267 later added
  // `sentences` (infinitive-complement frames) and a `past` table to
  // `verbs.js`'s `behar` entry, but this unit's own present/future scope is
  // unchanged — `past` isn't drilled until/unless a future unit adds it.
  { id: 'behar-present', verbId: 'behar', tense: 'present' },
  { id: 'behar-future', verbId: 'behar', tense: 'future' },
  {
    id: 'unit-19-review',
    review: true,
    sources: [
      { verbId: 'behar', tense: 'present' },
      { verbId: 'behar', tense: 'future' },
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  // Unit 20 ("REFRESH — Cumulative Present/Past/Future Mixer", Refresh Gate
  // B) — zero new verbs. Mixes synthetic (`izan`) + periphrastic (`ukan`/
  // `joan`/`ikusi`) sources across present/past/future (the full tense range
  // Units 1-19 introduced), then revisits negation (Gate A's `unit-5-review-*`
  // pattern) — first extending it to the two verbs that debuted after Gate A
  // (`eduki`/`ibili`, present-only negation data) and then to past tense,
  // which `negativeSentences.past`'s auto-extend (see the
  // `SINGLE_WORD_PAST_NEGATION` loop above) makes possible for the first time.
  // `unit-20-review-6` is this unit's `gate: true` checkpoint in `journey.js`
  // — `bestStars >= 2` there gates Unit 21.
  {
    id: 'unit-20-review-1',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  {
    id: 'unit-20-review-2',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'present' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'ikusi', tense: 'present' },
      { verbId: 'ikusi', tense: 'past' },
      { verbId: 'ikusi', tense: 'future' },
    ],
  },
  {
    id: 'unit-20-review-3',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
      { verbId: 'izan', tense: 'future' },
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  {
    id: 'unit-20-review-4',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'present' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'ikusi', tense: 'present' },
      { verbId: 'ikusi', tense: 'past' },
      { verbId: 'ikusi', tense: 'future' },
    ],
  },
  {
    id: 'unit-20-review-5',
    review: true,
    negation: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'eduki', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
      { verbId: 'ukan', tense: 'past' },
      { verbId: 'jakin', tense: 'past' },
    ],
  },
  {
    id: 'unit-20-review-6',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'ukan', tense: 'future' },
      { verbId: 'joan', tense: 'present' },
      { verbId: 'ikusi', tense: 'past' },
    ],
  },
  // Unit 21 — the imperfective/habitual past (participle + past auxiliary,
  // e.g. `etortzen nintzen`, `ikusten nuen`), taught on a small two-verb
  // core spanning both auxiliary-selection patterns: `etorri` (NOR, izan)
  // and `ikusi` (NOR-NORK, ukan) — mirrors Unit 17/18's future-rule design.
  // Form-only (no `sentences`) — see `src/data/verbs.js`'s `behar` precedent.
  { id: 'etorri-habitual-past', verbId: 'etorri', tense: 'habitualPast', persons: PHASE_1_PERSONS },
  {
    id: 'etorri-habitual-past-plural',
    verbId: 'etorri',
    tense: 'habitualPast',
    persons: PHASE_1_PLURAL_PERSONS,
  },
  { id: 'ikusi-habitual-past', verbId: 'ikusi', tense: 'habitualPast', persons: PHASE_1_PERSONS },
  {
    id: 'ikusi-habitual-past-plural',
    verbId: 'ikusi',
    tense: 'habitualPast',
    persons: PHASE_1_PLURAL_PERSONS,
  },
  {
    id: 'unit-21-review',
    review: true,
    sources: [
      { verbId: 'etorri', tense: 'habitualPast' },
      { verbId: 'ikusi', tense: 'habitualPast' },
    ],
  },
  // Unit 22 — `joan`/`etorri`/`ibili`'s native synthetic imperfective-past
  // forms (`nindoan`, `zetorren`, `nenbilen`) — a motion-verb-specific
  // exception to Unit 21's general periphrastic rule, pooled across all
  // three verbs since they share no suffix family (mirrors Unit 11's
  // izan-past-pool pattern). `ibili` has no `hi` form (documented gap).
  {
    id: 'motion-imperfective-past-pool',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'imperfectivePast' },
      { verbId: 'etorri', tense: 'imperfectivePast' },
      { verbId: 'ibili', tense: 'imperfectivePast' },
    ],
  },
  {
    id: 'motion-imperfective-past-pool-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'joan', tense: 'imperfectivePast' },
      { verbId: 'etorri', tense: 'imperfectivePast' },
      { verbId: 'ibili', tense: 'imperfectivePast' },
    ],
  },
  // Unit 23 (#146) — present NOR-NORI: `gustatu`/`iruditu`/`ahaztu`, `person`
  // ranges over NORI (object: 'hura' fixes NOR = "it").
  { id: 'gustatu-present', verbId: 'gustatu', tense: 'present' },
  { id: 'iruditu-present', verbId: 'iruditu', tense: 'present' },
  { id: 'ahaztu-present', verbId: 'ahaztu', tense: 'present' },
  // #164 — plural-NOR ("they please me") production drills, same three
  // verbs, `object: 'haiek'` instead of `hura`.
  { id: 'gustatu-present-plural', verbId: 'gustatu', tense: 'presentPlural' },
  { id: 'iruditu-present-plural', verbId: 'iruditu', tense: 'presentPlural' },
  { id: 'ahaztu-present-plural', verbId: 'ahaztu', tense: 'presentPlural' },
  // #164 — number-split review: each verb's singular and plural present
  // forms interleaved, recognition-only, drilling the `zait`-vs-`zaizkit`
  // contrast directly (#164 scope item 2's "number-split" lesson).
  {
    id: 'unit-23-number-split-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'gustatu', tense: 'present' },
      { verbId: 'gustatu', tense: 'presentPlural' },
      { verbId: 'iruditu', tense: 'present' },
      { verbId: 'iruditu', tense: 'presentPlural' },
      { verbId: 'ahaztu', tense: 'present' },
      { verbId: 'ahaztu', tense: 'presentPlural' },
    ],
  },
  // #164 — case-frame buffer: `gustatu`/`iruditu`/`ahaztu` mixed and
  // over-learned (production) ahead of Unit 25's ditransitive jump (#164
  // scope item 2's "case-frame buffer" lesson).
  {
    id: 'unit-23-case-frame-buffer',
    review: true,
    sources: [
      { verbId: 'gustatu', tense: 'present' },
      { verbId: 'iruditu', tense: 'present' },
      { verbId: 'ahaztu', tense: 'present' },
    ],
  },
  // #385 — present NOR-NORI mixer review: widens Unit 26's pool past the
  // three founding verbs to include `jarraitu` (ordinary production carrier)
  // and `jario` (`recognitionOnly: true`, #330's "carrier folded into a
  // mixed pool" mechanism — it stays recognition-only on its own even
  // without a lesson-level `mode: 'recognition'`), so a learner sees the
  // dative-shift pattern applied beyond the three lexical examples they
  // already have dedicated lessons for.
  {
    id: 'nor-nori-present-pool',
    review: true,
    sources: [
      { verbId: 'gustatu', tense: 'present' },
      { verbId: 'iruditu', tense: 'present' },
      { verbId: 'ahaztu', tense: 'present' },
      { verbId: 'jarraitu', tense: 'present' },
      { verbId: 'jario', tense: 'present' },
    ],
  },
  // Unit 24 (#146) — NOR-NORI past + future on the same verbs.
  { id: 'gustatu-past', verbId: 'gustatu', tense: 'past' },
  { id: 'gustatu-future', verbId: 'gustatu', tense: 'future' },
  { id: 'iruditu-past', verbId: 'iruditu', tense: 'past' },
  { id: 'iruditu-future', verbId: 'iruditu', tense: 'future' },
  { id: 'ahaztu-past', verbId: 'ahaztu', tense: 'past' },
  { id: 'ahaztu-future', verbId: 'ahaztu', tense: 'future' },
  // #385 — past sibling of `nor-nori-present-pool`, mirroring Unit 13/14's
  // present/past pool pairing.
  {
    id: 'nor-nori-past-pool',
    review: true,
    sources: [
      { verbId: 'gustatu', tense: 'past' },
      { verbId: 'iruditu', tense: 'past' },
      { verbId: 'ahaztu', tense: 'past' },
      { verbId: 'jarraitu', tense: 'past' },
      { verbId: 'jario', tense: 'past' },
    ],
  },
  // Unit 25 (#147) — axis-scaffolded NOR-NORI-NORK: L1 fixes NORI (`esan`,
  // `recipient: 'hura'`, NORK varies), L2 fixes NORK (`eman`, `agent: 'ni'`,
  // NORI varies).
  { id: 'esan-present', verbId: 'esan', tense: 'present' },
  { id: 'eman-present', verbId: 'eman', tense: 'present' },
  // #162: extra-practice lessons. Plural-object (-zki-) production drills,
  // then four reviews approximating the proposed doc's "fix-NORI / fix-NORK /
  // object-number / two-axis recombination" set using the existing
  // review+sources(+recognition mode) machinery rather than new 2D
  // NORK×NORI table/engine support — see docs/DECISIONS.md.
  { id: 'esan-present-plural', verbId: 'esan', tense: 'presentPlural' },
  { id: 'eman-present-plural', verbId: 'eman', tense: 'presentPlural' },
  // #417 — `pastPlural` counterpart to the two lessons above; `esan`/`eman`
  // already had the data (`verbs.js`) but no lesson selected it.
  { id: 'esan-past-plural', verbId: 'esan', tense: 'pastPlural' },
  { id: 'eman-past-plural', verbId: 'eman', tense: 'pastPlural' },
  {
    // Reinforces esan's axis (NORI fixed, NORK varies) across all three tenses.
    id: 'unit-25-fix-nori-review',
    review: true,
    sources: [
      { verbId: 'esan', tense: 'present' },
      { verbId: 'esan', tense: 'past' },
      { verbId: 'esan', tense: 'future' },
    ],
  },
  {
    // Reinforces eman's axis (NORK fixed, NORI varies) across all three tenses.
    id: 'unit-25-fix-nork-review',
    review: true,
    sources: [
      { verbId: 'eman', tense: 'present' },
      { verbId: 'eman', tense: 'past' },
      { verbId: 'eman', tense: 'future' },
    ],
  },
  {
    // Singular vs. plural object contrast ("diot" vs "dizkiot") — recognition
    // mode since the point is noticing the -zki- infix, not free production.
    id: 'unit-25-object-number-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'present' },
      { verbId: 'esan', tense: 'presentPlural' },
      { verbId: 'eman', tense: 'present' },
      { verbId: 'eman', tense: 'presentPlural' },
    ],
  },
  {
    // Two-axis recombination: pools esan's NORK-varying source with eman's
    // NORI-varying source in one recognition-only review, per the issue's
    // "last recognition-first" note — each question still varies one axis at
    // a time (the data model has no 2D NORK×NORI table), but the lesson as a
    // whole recombines both axes rather than drilling either in isolation.
    id: 'unit-25-two-axis-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'present' },
      { verbId: 'eman', tense: 'present' },
    ],
  },
  // Unit 26 (#147) — past + future on the same axis-fixed slices.
  { id: 'esan-past', verbId: 'esan', tense: 'past' },
  { id: 'esan-future', verbId: 'esan', tense: 'future' },
  { id: 'eman-past', verbId: 'eman', tense: 'past' },
  { id: 'eman-future', verbId: 'eman', tense: 'future' },
  // #334 — saldu/utzi/adierazi/eskatu/galdetu's dative reading ("sell/leave/
  // express/ask/ask *to/of* someone"). Genuinely ditransitive (overt
  // accusative object + dative recipient), the esan/eman shape rather than
  // Unit 30's covert-dative shape, so it gets its own pool family here
  // rather than joining dative-verb-* — see docs/LANGUAGE_DECISIONS.md.
  { id: 'ditransitive-dative-present', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'present' },
    { verbId: 'utzi-dative', tense: 'present' },
    { verbId: 'adierazi-dative', tense: 'present' },
    { verbId: 'eskatu-dative', tense: 'present' },
    { verbId: 'galdetu-dative', tense: 'present' },
  ] },
  { id: 'ditransitive-dative-present-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'present' },
    { verbId: 'utzi-dative', tense: 'present' },
    { verbId: 'adierazi-dative', tense: 'present' },
    { verbId: 'eskatu-dative', tense: 'present' },
    { verbId: 'galdetu-dative', tense: 'present' },
  ] },
  { id: 'ditransitive-dative-past', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'past' },
    { verbId: 'utzi-dative', tense: 'past' },
    { verbId: 'adierazi-dative', tense: 'past' },
    { verbId: 'eskatu-dative', tense: 'past' },
    { verbId: 'galdetu-dative', tense: 'past' },
  ] },
  { id: 'ditransitive-dative-past-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'past' },
    { verbId: 'utzi-dative', tense: 'past' },
    { verbId: 'adierazi-dative', tense: 'past' },
    { verbId: 'eskatu-dative', tense: 'past' },
    { verbId: 'galdetu-dative', tense: 'past' },
  ] },
  { id: 'ditransitive-dative-future', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'future' },
    { verbId: 'utzi-dative', tense: 'future' },
    { verbId: 'adierazi-dative', tense: 'future' },
    { verbId: 'eskatu-dative', tense: 'future' },
    { verbId: 'galdetu-dative', tense: 'future' },
  ] },
  { id: 'ditransitive-dative-future-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'saldu-dative', tense: 'future' },
    { verbId: 'utzi-dative', tense: 'future' },
    { verbId: 'adierazi-dative', tense: 'future' },
    { verbId: 'eskatu-dative', tense: 'future' },
    { verbId: 'galdetu-dative', tense: 'future' },
  ] },
  {
    id: 'ditransitive-dative-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'saldu-dative', tense: 'present' },
      { verbId: 'utzi-dative', tense: 'present' },
      { verbId: 'adierazi-dative', tense: 'present' },
      { verbId: 'eskatu-dative', tense: 'present' },
      { verbId: 'galdetu-dative', tense: 'present' },
      { verbId: 'saldu-dative', tense: 'past' },
      { verbId: 'utzi-dative', tense: 'past' },
      { verbId: 'adierazi-dative', tense: 'past' },
      { verbId: 'eskatu-dative', tense: 'past' },
      { verbId: 'galdetu-dative', tense: 'past' },
      { verbId: 'saldu-dative', tense: 'future' },
      { verbId: 'utzi-dative', tense: 'future' },
      { verbId: 'adierazi-dative', tense: 'future' },
      { verbId: 'eskatu-dative', tense: 'future' },
      { verbId: 'galdetu-dative', tense: 'future' },
    ],
  },
  {
    id: 'ditransitive-dative-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'saldu-dative', tense: 'present' },
      { verbId: 'utzi-dative', tense: 'present' },
      { verbId: 'adierazi-dative', tense: 'present' },
      { verbId: 'eskatu-dative', tense: 'present' },
      { verbId: 'galdetu-dative', tense: 'present' },
      { verbId: 'saldu-dative', tense: 'past' },
      { verbId: 'utzi-dative', tense: 'past' },
      { verbId: 'adierazi-dative', tense: 'past' },
      { verbId: 'eskatu-dative', tense: 'past' },
      { verbId: 'galdetu-dative', tense: 'past' },
      { verbId: 'saldu-dative', tense: 'future' },
      { verbId: 'utzi-dative', tense: 'future' },
      { verbId: 'adierazi-dative', tense: 'future' },
      { verbId: 'eskatu-dative', tense: 'future' },
      { verbId: 'galdetu-dative', tense: 'future' },
    ],
  },
  // #325 — the `egin`/`hartu`/`eman`/`egon`/`jarri` fixed noun+verb
  // expressions (see the matching `VERBS` block above), moved here from the
  // end of the array (#306's original placement) now that egin/hartu
  // (Units 13-14) and eman (Units 27-28) are all individually taught —
  // lesson unlocking is driven by this array's order, so the lessons had to
  // move along with journey.js's Unit 29 renumber, not just journey.js.
  // #331 — collapsed the former `egin-construction-{present,past}-2`/
  // `-plural` siblings (arreta-eman/ados-egon/arriskuan-jarri) into these
  // canonical pools.
  {
    id: 'egin-construction-present',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'present' },
      { verbId: 'lan-egin', tense: 'present' },
      { verbId: 'lo-egin', tense: 'present' },
      { verbId: 'ahaleginak-egin', tense: 'present' },
      { verbId: 'parte-hartu', tense: 'present' },
      { verbId: 'kontuan-hartu', tense: 'present' },
      { verbId: 'arreta-eman', tense: 'present' },
      { verbId: 'ados-egon', tense: 'present' },
      { verbId: 'arriskuan-jarri', tense: 'present' },
    ],
  },
  {
    id: 'egin-construction-present-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'present' },
      { verbId: 'lan-egin', tense: 'present' },
      { verbId: 'lo-egin', tense: 'present' },
      { verbId: 'ahaleginak-egin', tense: 'present' },
      { verbId: 'parte-hartu', tense: 'present' },
      { verbId: 'kontuan-hartu', tense: 'present' },
      { verbId: 'arreta-eman', tense: 'present' },
      { verbId: 'ados-egon', tense: 'present' },
      { verbId: 'arriskuan-jarri', tense: 'present' },
    ],
  },
  {
    id: 'egin-construction-past',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'past' },
      { verbId: 'lan-egin', tense: 'past' },
      { verbId: 'lo-egin', tense: 'past' },
      { verbId: 'ahaleginak-egin', tense: 'past' },
      { verbId: 'parte-hartu', tense: 'past' },
      { verbId: 'kontuan-hartu', tense: 'past' },
      { verbId: 'arreta-eman', tense: 'past' },
      { verbId: 'ados-egon', tense: 'past' },
      { verbId: 'arriskuan-jarri', tense: 'past' },
    ],
  },
  {
    id: 'egin-construction-past-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'past' },
      { verbId: 'lan-egin', tense: 'past' },
      { verbId: 'lo-egin', tense: 'past' },
      { verbId: 'ahaleginak-egin', tense: 'past' },
      { verbId: 'parte-hartu', tense: 'past' },
      { verbId: 'kontuan-hartu', tense: 'past' },
      { verbId: 'arreta-eman', tense: 'past' },
      { verbId: 'ados-egon', tense: 'past' },
      { verbId: 'arriskuan-jarri', tense: 'past' },
    ],
  },
  // #334 — future forms for the 7 verbs (hitz/lan/lo/ahaleginak egin, parte/
  // kontuan hartu, arreta eman) left present+past-only since #306/#331;
  // ados-egon/arriskuan-jarri already had future, so they ride along here too
  // for parity with the present/past pools above.
  {
    id: 'egin-construction-future',
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'future' },
      { verbId: 'lan-egin', tense: 'future' },
      { verbId: 'lo-egin', tense: 'future' },
      { verbId: 'ahaleginak-egin', tense: 'future' },
      { verbId: 'parte-hartu', tense: 'future' },
      { verbId: 'kontuan-hartu', tense: 'future' },
      { verbId: 'arreta-eman', tense: 'future' },
      { verbId: 'ados-egon', tense: 'future' },
      { verbId: 'arriskuan-jarri', tense: 'future' },
    ],
  },
  {
    id: 'egin-construction-future-plural',
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'future' },
      { verbId: 'lan-egin', tense: 'future' },
      { verbId: 'lo-egin', tense: 'future' },
      { verbId: 'ahaleginak-egin', tense: 'future' },
      { verbId: 'parte-hartu', tense: 'future' },
      { verbId: 'kontuan-hartu', tense: 'future' },
      { verbId: 'arreta-eman', tense: 'future' },
      { verbId: 'ados-egon', tense: 'future' },
      { verbId: 'arriskuan-jarri', tense: 'future' },
    ],
  },
  {
    id: 'unit-44-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'present' },
      { verbId: 'lan-egin', tense: 'present' },
      { verbId: 'lo-egin', tense: 'present' },
      { verbId: 'ahaleginak-egin', tense: 'present' },
      { verbId: 'parte-hartu', tense: 'present' },
      { verbId: 'kontuan-hartu', tense: 'present' },
      { verbId: 'arreta-eman', tense: 'present' },
      { verbId: 'ados-egon', tense: 'present' },
      { verbId: 'arriskuan-jarri', tense: 'present' },
      { verbId: 'hitz-egin', tense: 'past' },
      { verbId: 'lan-egin', tense: 'past' },
      { verbId: 'lo-egin', tense: 'past' },
      { verbId: 'ahaleginak-egin', tense: 'past' },
      { verbId: 'parte-hartu', tense: 'past' },
      { verbId: 'kontuan-hartu', tense: 'past' },
      { verbId: 'arreta-eman', tense: 'past' },
      { verbId: 'ados-egon', tense: 'past' },
      { verbId: 'arriskuan-jarri', tense: 'past' },
      { verbId: 'hitz-egin', tense: 'future' },
      { verbId: 'lan-egin', tense: 'future' },
      { verbId: 'lo-egin', tense: 'future' },
      { verbId: 'ahaleginak-egin', tense: 'future' },
      { verbId: 'parte-hartu', tense: 'future' },
      { verbId: 'kontuan-hartu', tense: 'future' },
      { verbId: 'arreta-eman', tense: 'future' },
      { verbId: 'ados-egon', tense: 'future' },
      { verbId: 'arriskuan-jarri', tense: 'future' },
    ],
  },
  {
    id: 'unit-44-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'hitz-egin', tense: 'present' },
      { verbId: 'lan-egin', tense: 'present' },
      { verbId: 'lo-egin', tense: 'present' },
      { verbId: 'ahaleginak-egin', tense: 'present' },
      { verbId: 'parte-hartu', tense: 'present' },
      { verbId: 'kontuan-hartu', tense: 'present' },
      { verbId: 'arreta-eman', tense: 'present' },
      { verbId: 'ados-egon', tense: 'present' },
      { verbId: 'arriskuan-jarri', tense: 'present' },
      { verbId: 'hitz-egin', tense: 'past' },
      { verbId: 'lan-egin', tense: 'past' },
      { verbId: 'lo-egin', tense: 'past' },
      { verbId: 'ahaleginak-egin', tense: 'past' },
      { verbId: 'parte-hartu', tense: 'past' },
      { verbId: 'kontuan-hartu', tense: 'past' },
      { verbId: 'arreta-eman', tense: 'past' },
      { verbId: 'ados-egon', tense: 'past' },
      { verbId: 'arriskuan-jarri', tense: 'past' },
      { verbId: 'hitz-egin', tense: 'future' },
      { verbId: 'lan-egin', tense: 'future' },
      { verbId: 'lo-egin', tense: 'future' },
      { verbId: 'ahaleginak-egin', tense: 'future' },
      { verbId: 'parte-hartu', tense: 'future' },
      { verbId: 'kontuan-hartu', tense: 'future' },
      { verbId: 'arreta-eman', tense: 'future' },
      { verbId: 'ados-egon', tense: 'future' },
      { verbId: 'arriskuan-jarri', tense: 'future' },
    ],
  },
  // New Unit (#307) — agentive verbs with a covert dative (lagundu/ekin/
  // erantzun/deitu/eragin/antzeman + the dative `egin` compounds mesede/
  // kalte/aurre egin): inserted here, after esan/eman teach the `diot`-family
  // paradigm explicitly, rather than right after Unit 26 as the issue's own
  // older unit numbers suggested — see docs/DECISIONS.md's #307 entry. Named
  // descriptively (not `unit-NN-*`) since "unit-29-review" etc. are already
  // taken by stale ids further down whose journey.js `number` has since moved
  // (#137's "ids stay stable" convention, applied here in reverse).
  // #331 — collapsed the former `dative-verb-{present,past}-2`/`-plural`
  // siblings (mesede-egin/kalte-egin/aurre-egin) into these canonical pools.
  { id: 'dative-verb-present', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'present' },
    { verbId: 'ekin', tense: 'present' },
    { verbId: 'erantzun', tense: 'present' },
    { verbId: 'deitu', tense: 'present' },
    { verbId: 'eragin', tense: 'present' },
    { verbId: 'antzeman', tense: 'present' },
    { verbId: 'mesede-egin', tense: 'present' },
    { verbId: 'kalte-egin', tense: 'present' },
    { verbId: 'aurre-egin', tense: 'present' },
    { verbId: 'itxaron-dative', tense: 'present' },
  ] },
  { id: 'dative-verb-present-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'present' },
    { verbId: 'ekin', tense: 'present' },
    { verbId: 'erantzun', tense: 'present' },
    { verbId: 'deitu', tense: 'present' },
    { verbId: 'eragin', tense: 'present' },
    { verbId: 'antzeman', tense: 'present' },
    { verbId: 'mesede-egin', tense: 'present' },
    { verbId: 'kalte-egin', tense: 'present' },
    { verbId: 'aurre-egin', tense: 'present' },
    { verbId: 'itxaron-dative', tense: 'present' },
  ] },
  { id: 'dative-verb-past', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'past' },
    { verbId: 'ekin', tense: 'past' },
    { verbId: 'erantzun', tense: 'past' },
    { verbId: 'deitu', tense: 'past' },
    { verbId: 'eragin', tense: 'past' },
    { verbId: 'antzeman', tense: 'past' },
    { verbId: 'mesede-egin', tense: 'past' },
    { verbId: 'kalte-egin', tense: 'past' },
    { verbId: 'aurre-egin', tense: 'past' },
    { verbId: 'itxaron-dative', tense: 'past' },
  ] },
  { id: 'dative-verb-past-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'past' },
    { verbId: 'ekin', tense: 'past' },
    { verbId: 'erantzun', tense: 'past' },
    { verbId: 'deitu', tense: 'past' },
    { verbId: 'eragin', tense: 'past' },
    { verbId: 'antzeman', tense: 'past' },
    { verbId: 'mesede-egin', tense: 'past' },
    { verbId: 'kalte-egin', tense: 'past' },
    { verbId: 'aurre-egin', tense: 'past' },
    { verbId: 'itxaron-dative', tense: 'past' },
  ] },
  // #334 — future forms for all 9, left present+past-only since #307/#331.
  // itxaron-dative joins as a 10th carrier (added by #334 alongside the
  // future forms, so it rides all three tenses from the start).
  { id: 'dative-verb-future', persons: PHASE_1_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'future' },
    { verbId: 'ekin', tense: 'future' },
    { verbId: 'erantzun', tense: 'future' },
    { verbId: 'deitu', tense: 'future' },
    { verbId: 'eragin', tense: 'future' },
    { verbId: 'antzeman', tense: 'future' },
    { verbId: 'mesede-egin', tense: 'future' },
    { verbId: 'kalte-egin', tense: 'future' },
    { verbId: 'aurre-egin', tense: 'future' },
    { verbId: 'itxaron-dative', tense: 'future' },
  ] },
  { id: 'dative-verb-future-plural', persons: PHASE_1_PLURAL_PERSONS, sources: [
    { verbId: 'lagundu', tense: 'future' },
    { verbId: 'ekin', tense: 'future' },
    { verbId: 'erantzun', tense: 'future' },
    { verbId: 'deitu', tense: 'future' },
    { verbId: 'eragin', tense: 'future' },
    { verbId: 'antzeman', tense: 'future' },
    { verbId: 'mesede-egin', tense: 'future' },
    { verbId: 'kalte-egin', tense: 'future' },
    { verbId: 'aurre-egin', tense: 'future' },
    { verbId: 'itxaron-dative', tense: 'future' },
  ] },
  {
    id: 'dative-verb-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'lagundu', tense: 'present' },
      { verbId: 'ekin', tense: 'present' },
      { verbId: 'erantzun', tense: 'present' },
      { verbId: 'deitu', tense: 'present' },
      { verbId: 'eragin', tense: 'present' },
      { verbId: 'antzeman', tense: 'present' },
      { verbId: 'mesede-egin', tense: 'present' },
      { verbId: 'kalte-egin', tense: 'present' },
      { verbId: 'aurre-egin', tense: 'present' },
      { verbId: 'itxaron-dative', tense: 'present' },
      { verbId: 'lagundu', tense: 'past' },
      { verbId: 'ekin', tense: 'past' },
      { verbId: 'erantzun', tense: 'past' },
      { verbId: 'deitu', tense: 'past' },
      { verbId: 'eragin', tense: 'past' },
      { verbId: 'antzeman', tense: 'past' },
      { verbId: 'mesede-egin', tense: 'past' },
      { verbId: 'kalte-egin', tense: 'past' },
      { verbId: 'aurre-egin', tense: 'past' },
      { verbId: 'itxaron-dative', tense: 'past' },
      { verbId: 'lagundu', tense: 'future' },
      { verbId: 'ekin', tense: 'future' },
      { verbId: 'erantzun', tense: 'future' },
      { verbId: 'deitu', tense: 'future' },
      { verbId: 'eragin', tense: 'future' },
      { verbId: 'antzeman', tense: 'future' },
      { verbId: 'mesede-egin', tense: 'future' },
      { verbId: 'kalte-egin', tense: 'future' },
      { verbId: 'aurre-egin', tense: 'future' },
      { verbId: 'itxaron-dative', tense: 'future' },
    ],
  },
  {
    id: 'dative-verb-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'lagundu', tense: 'present' },
      { verbId: 'ekin', tense: 'present' },
      { verbId: 'erantzun', tense: 'present' },
      { verbId: 'deitu', tense: 'present' },
      { verbId: 'eragin', tense: 'present' },
      { verbId: 'antzeman', tense: 'present' },
      { verbId: 'mesede-egin', tense: 'present' },
      { verbId: 'kalte-egin', tense: 'present' },
      { verbId: 'aurre-egin', tense: 'present' },
      { verbId: 'itxaron-dative', tense: 'present' },
      { verbId: 'lagundu', tense: 'past' },
      { verbId: 'ekin', tense: 'past' },
      { verbId: 'erantzun', tense: 'past' },
      { verbId: 'deitu', tense: 'past' },
      { verbId: 'eragin', tense: 'past' },
      { verbId: 'antzeman', tense: 'past' },
      { verbId: 'mesede-egin', tense: 'past' },
      { verbId: 'kalte-egin', tense: 'past' },
      { verbId: 'aurre-egin', tense: 'past' },
      { verbId: 'itxaron-dative', tense: 'past' },
      { verbId: 'lagundu', tense: 'future' },
      { verbId: 'ekin', tense: 'future' },
      { verbId: 'erantzun', tense: 'future' },
      { verbId: 'deitu', tense: 'future' },
      { verbId: 'eragin', tense: 'future' },
      { verbId: 'antzeman', tense: 'future' },
      { verbId: 'mesede-egin', tense: 'future' },
      { verbId: 'kalte-egin', tense: 'future' },
      { verbId: 'aurre-egin', tense: 'future' },
      { verbId: 'itxaron-dative', tense: 'future' },
    ],
  },
  // Unit 28 (#148) — Ahalera (potential): `izan`/`ukan` production for
  // NOR/NOR-NORK. Dative-paradigm (gustatu/iruditu/ahaztu/esan/eman)
  // recognition-only potential is deferred — see the issue filed for #148's
  // remaining scope.
  { id: 'izan-potential', verbId: 'izan', tense: 'potential' },
  { id: 'ukan-potential', verbId: 'ukan', tense: 'potential' },
  {
    id: 'unit-28-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'potential' },
      { verbId: 'ukan', tense: 'potential' },
    ],
  },
  // #352: Ahalera's NOR-NORK object axis (`zaitzaket`-type forms) — the
  // `ukan-potential` lesson above only drills the subject axis (NORK varies,
  // NOR fixed at `hura`); these three lessons drill the object instead,
  // mirroring Unit 15's `objectAxis: { vary: 'nor', fixed: 'ni' }` convention
  // (`ukan-object-axis-present`/`-past` above) — `fixed: 'ni'` again makes
  // the payoff sentence direct ("Zaitzaket lagundu" — well-formed NORK=ni,
  // NOR=zu reading). `gu` stays excluded from `persons` for the same reason
  // as Unit 15: `nork: 'ni'` has no cell for NOR=`gu` (reflexive gap).
  {
    id: 'ukan-potential-object-axis-present',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'unit-34-object-axis-review',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'ukan', tense: 'potentialByObject' },
      { verbId: 'ukan', tense: 'potentialAlegiazkoaByObject' },
      { verbId: 'ukan', tense: 'potentialLehenaldiaByObject' },
    ],
  },
  // #424: the block above only ever fixes `nork` at `ni` — every other NORK
  // value sits in `potentialByObject`/`potentialAlegiazkoaByObject`/
  // `potentialLehenaldiaByObject` already but was never wired into a lesson.
  // Same shape as #416's extension of `presentByObject`/`pastByObject`
  // above: one lesson per remaining NORK value, per sub-tense, `persons`
  // matching that NORK row's actual NOR keys (the reflexive-gap pattern is
  // identical across all three sub-tenses, since they share `presentByObject`/
  // `pastByObject`'s table shape).
  {
    id: 'ukan-potential-object-axis-present-hura',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa-hura',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia-hura',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-potential-object-axis-present-gu',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa-gu',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia-gu',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-potential-object-axis-present-zu',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa-zu',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia-zu',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-potential-object-axis-present-zuek',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa-zuek',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia-zuek',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-potential-object-axis-present-haiek',
    verbId: 'ukan',
    tense: 'potentialByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ukan-potential-object-axis-alegiazkoa-haiek',
    verbId: 'ukan',
    tense: 'potentialAlegiazkoaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ukan-potential-object-axis-lehenaldia-haiek',
    verbId: 'ukan',
    tense: 'potentialLehenaldiaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  // #366 — esan/eman's ditransitive Ahalera (`diezaioket`-type forms, plus
  // their Lehenaldia/Alegiazkoa sub-tenses and `-zki-` plural-object
  // siblings), recognition-only per this unit's focus text, pooled across
  // both verbs mirroring Unit 30's `unit-30-ditransitive-review` treatment.
  {
    id: 'unit-34-ditransitive-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'potential' },
      { verbId: 'esan', tense: 'potentialLehenaldia' },
      { verbId: 'esan', tense: 'potentialAlegiazkoa' },
      { verbId: 'esan', tense: 'potentialPlural' },
      { verbId: 'esan', tense: 'potentialLehenaldiaPlural' },
      { verbId: 'esan', tense: 'potentialAlegiazkoaPlural' },
      { verbId: 'eman', tense: 'potential' },
      { verbId: 'eman', tense: 'potentialLehenaldia' },
      { verbId: 'eman', tense: 'potentialAlegiazkoa' },
      { verbId: 'eman', tense: 'potentialPlural' },
      { verbId: 'eman', tense: 'potentialLehenaldiaPlural' },
      { verbId: 'eman', tense: 'potentialAlegiazkoaPlural' },
    ],
  },
  // #410/#411: periphrastic `ahal`/`ezin`, the auxiliary-transparent
  // positive/negative pair this unit's Focus already advertises but never
  // delivered — contrasted against the synthetic `naiteke`/`dezaket` drilled
  // above. Each gets an `izan`-carrier and a `ukan`-carrier lesson so the
  // "which auxiliary?" pass-through point actually lands.
  { id: 'ahal-izan-present', verbId: 'ahal-izan', tense: 'present' },
  { id: 'ahal-ukan-present', verbId: 'ahal-ukan', tense: 'present' },
  { id: 'ezin-izan-present', verbId: 'ezin-izan', tense: 'present' },
  { id: 'ezin-ukan-present', verbId: 'ezin-ukan', tense: 'present' },
  {
    id: 'unit-34-ahal-ezin-review',
    review: true,
    sources: [
      { verbId: 'ahal-izan', tense: 'present' },
      { verbId: 'ahal-ukan', tense: 'present' },
      { verbId: 'ezin-izan', tense: 'present' },
      { verbId: 'ezin-ukan', tense: 'present' },
    ],
  },
  // Unit 29 (#148) — Baldintza (if-clause) + Ondorioa present (would):
  // `izan`/`ukan` production for NOR/NOR-NORK. Dative-paradigm recognition-
  // only conditional is deferred alongside Unit 28's — see the issue filed
  // for #148's remaining scope.
  { id: 'izan-baldintza', verbId: 'izan', tense: 'baldintza' },
  { id: 'izan-conditional', verbId: 'izan', tense: 'conditional' },
  { id: 'ukan-baldintza', verbId: 'ukan', tense: 'baldintza' },
  { id: 'ukan-conditional', verbId: 'ukan', tense: 'conditional' },
  {
    id: 'unit-29-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'baldintza' },
      { verbId: 'izan', tense: 'conditional' },
      { verbId: 'ukan', tense: 'baldintza' },
      { verbId: 'ukan', tense: 'conditional' },
    ],
  },
  // #353: Baldintza/Ondorioa's NOR-NORK object axis (`bazintut`/`zintuket`-
  // type forms) — the `ukan-baldintza`/`-conditional` lessons above only
  // drill the subject axis; these drill the object instead, same
  // `objectAxis: { vary: 'nor', fixed: 'ni' }` convention as Unit 15/#352.
  {
    id: 'ukan-baldintza-object-axis',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ukan-conditional-object-axis',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ukan-conditional-past-object-axis',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'unit-35-object-axis-review',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'ukan', tense: 'baldintzaByObject' },
      { verbId: 'ukan', tense: 'conditionalByObject' },
      { verbId: 'ukan', tense: 'conditionalPastByObject' },
    ],
  },
  // #424: the block above only ever fixes `nork` at `ni` — every other NORK
  // value sits in `baldintzaByObject`/`conditionalByObject`/
  // `conditionalPastByObject` already but was never wired into a lesson.
  // Same shape as #416's extension of `presentByObject`/`pastByObject` and
  // the Ahalera block above — one lesson per remaining NORK value, per
  // sub-tense, `persons` matching that NORK row's actual NOR keys.
  {
    id: 'ukan-baldintza-object-axis-hura',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-conditional-object-axis-hura',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-conditional-past-object-axis-hura',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ukan-baldintza-object-axis-gu',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-conditional-object-axis-gu',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-conditional-past-object-axis-gu',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ukan-baldintza-object-axis-zu',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-conditional-object-axis-zu',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-conditional-past-object-axis-zu',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ukan-baldintza-object-axis-zuek',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-conditional-object-axis-zuek',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-conditional-past-object-axis-zuek',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-baldintza-object-axis-haiek',
    verbId: 'ukan',
    tense: 'baldintzaByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ukan-conditional-object-axis-haiek',
    verbId: 'ukan',
    tense: 'conditionalByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ukan-conditional-past-object-axis-haiek',
    verbId: 'ukan',
    tense: 'conditionalPastByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  // #366 — esan/eman's ditransitive Baldintza/Ondorioa (`balio`/`nioke`-type
  // forms, plus Ondorioa's past sub-tense and `-zki-` plural-object
  // siblings), recognition-only per this unit's focus text, pooled across
  // both verbs mirroring Unit 30's `unit-30-ditransitive-review` treatment.
  {
    id: 'unit-35-ditransitive-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'baldintza' },
      { verbId: 'esan', tense: 'conditional' },
      { verbId: 'esan', tense: 'conditionalPast' },
      { verbId: 'esan', tense: 'baldintzaPlural' },
      { verbId: 'esan', tense: 'conditionalPlural' },
      { verbId: 'esan', tense: 'conditionalPastPlural' },
      { verbId: 'eman', tense: 'baldintza' },
      { verbId: 'eman', tense: 'conditional' },
      { verbId: 'eman', tense: 'conditionalPast' },
      { verbId: 'eman', tense: 'baldintzaPlural' },
      { verbId: 'eman', tense: 'conditionalPlural' },
      { verbId: 'eman', tense: 'conditionalPastPlural' },
    ],
  },
  // Unit 30 (#171 core scope) — Commands (Agintera/imperative), second-person
  // only. izan/ukan are NOT `agreementsCompatible`, so `unit-30-review`
  // (pooling both for spaced repetition) gets no cross-verb borrowing —
  // accepted as-is, same as #167's toka/noka. #368 fills in the rest of
  // `ukan`'s imperative (jussive/hortative cells added directly to this same
  // `imperative` table — auto-picked-up by this lesson since it has no
  // `persons` filter — plus the plural-object and ditransitive axes below),
  // and adds egon/etorri/joan's imperative (= present tense — see
  // CONJUGATIONS.md §16.2).
  { id: 'izan-imperative', verbId: 'izan', tense: 'imperative' },
  { id: 'ukan-imperative', verbId: 'ukan', tense: 'imperative' },
  {
    id: 'unit-30-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'imperative' },
      { verbId: 'ukan', tense: 'imperative' },
    ],
  },
  // #364: the NOR-NORI object axis for Agintera — gustatu/iruditu/ahaztu's
  // `imperativeByNor` tables, same `objectAxis: { vary: 'nor', fixed: 'zu' }`
  // convention Unit 28 (#358) established for this verb family's dative
  // axis. `zu` is excluded from `persons` (the reflexive gap), and unlike
  // Unit 28, `hura` stays IN scope here — `imperativeByNor` has no flat
  // `imperative` table to be redundant with (see the comment on
  // `gustatu.conjugations.imperativeByNor` in `verbs.js`). #444 later added
  // jarraitu plus pooled cross-verb reviews for this axis (see below, near
  // the rest of the `imperativeByNor` solo lessons).
  {
    id: 'gustatu-imperative-axis',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-imperative-axis',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-imperative-axis',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  // #368 — egon/etorri/joan's imperative, per the synthetic-imperative-=-
  // present-tense rule (CONJUGATIONS.md §16.2): these three tables are
  // literal copies of cells already taught in Units 3-4's present tense, so
  // production here is really "notice the present-tense form doubles as a
  // command," not new conjugation to learn.
  { id: 'egon-imperative', verbId: 'egon', tense: 'imperative' },
  { id: 'etorri-imperative', verbId: 'etorri', tense: 'imperative' },
  { id: 'joan-imperative', verbId: 'joan', tense: 'imperative' },
  // #368 — singular-vs-plural-object contrast on `ukan`'s Agintera
  // (`ezazu` vs `itzazu`), recognition-only since the point is noticing the
  // `-itz-` infix, same rationale as Unit 25's `unit-25-object-number-review`.
  {
    id: 'unit-30-plural-object-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'ukan', tense: 'imperative' },
      { verbId: 'ukan', tense: 'imperativePlural' },
    ],
  },
  // #368 — esan/eman's ditransitive Agintera (`iezaiozu`/`iezadazu`),
  // recognition-only and pooled across both verbs, mirroring Unit 25's
  // `unit-25-two-axis-review` treatment of these same two verbs' other axes.
  {
    id: 'unit-30-ditransitive-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'imperativeDitransitive' },
      { verbId: 'eman', tense: 'imperativeDitransitive' },
    ],
  },
  // Unit 32 (#144, +#180 `ibili`) — "Meet hi": `hi` (familiar "you") joins
  // izan/egon/joan/etorri/ibili's present and past tables as a 7th person.
  // These five are `nor`-only verbs, so `hi`-as-subject takes a single
  // invariant form in both tenses (`haiz`/`hago`/`hoa`/`hator`/`habil`,
  // `hintzen`/`hengoen`/`joan hintzen`/`etorri hintzen`/`ibili hintzen`) — no
  // allocutive (toka/noka) gender split here (see docs/DECISIONS.md for the
  // `hi`/`hi-m`/`hi-f` data-shape convention). `ibili`'s `hi` form was
  // omitted from the original #144 core scope and only added later (#180) —
  // see docs/LANGUAGE_DECISIONS.md for why `ibili hintzen` isn't a gap.
  // `persons: ['hi']` pools each tense across all five verbs, so every `hi`
  // question borrows its distractors from the other four verbs' `hi` forms
  // (#139's borrowing, capped at 3 distractors by `buildOptions`).
  {
    id: 'unit-32-hi-present',
    review: true,
    persons: ['hi'],
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
      { verbId: 'joan', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
    ],
  },
  {
    id: 'unit-32-hi-past',
    review: true,
    persons: ['hi'],
    sources: [
      { verbId: 'izan', tense: 'past' },
      { verbId: 'egon', tense: 'past' },
      { verbId: 'joan', tense: 'past' },
      { verbId: 'etorri', tense: 'past' },
      { verbId: 'ibili', tense: 'past' },
    ],
  },
  // #167 — hi-as-NORK's own present-tense gender split (`duk`/`dun`,
  // `dakik`/`dakin`): unlike Unit 32's invariant `hi`, here `hi` IS the
  // grammatical NORK argument, so the form itself splits by addressee
  // gender (`hi-m`/`hi-f` person keys, not new tense keys — see #144's
  // DECISIONS.md convention). `ukan` and `jakin` share agreement
  // (`agreementsCompatible`), so pooling them gives real cross-verb
  // distractor borrowing in addition to the m/f pairing within each verb.
  {
    id: 'unit-32-hi-nork-present',
    review: true,
    persons: ['hi-m', 'hi-f'],
    sources: [
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'jakin', tense: 'present' },
    ],
  },
  // Unit 33 (#167 core scope) — Toka (masculine allocutive): addressee
  // agreement layered onto a 3rd-person statement, independent of `hi` as a
  // grammatical argument. izan/ukan are NOT `agreementsCompatible` (differ
  // on `nork`), so these stay separate per-verb lessons rather than a single
  // pooled review with cross-verb borrowing — `presentToka`/`pastToka`
  // tables are 2-person (`hura`/`haiek`), so each lesson is a binary
  // (2-option) choice per question, a precedented pattern elsewhere in the
  // suite. `unit-33-review` pools all four for spaced repetition (only
  // within-verb cross-tense borrowing applies, e.g. izan's `pastToka` can
  // lure on izan's `presentToka` question).
  { id: 'izan-present-toka', verbId: 'izan', tense: 'presentToka' },
  { id: 'ukan-present-toka', verbId: 'ukan', tense: 'presentToka' },
  { id: 'izan-past-toka', verbId: 'izan', tense: 'pastToka' },
  { id: 'ukan-past-toka', verbId: 'ukan', tense: 'pastToka' },
  {
    id: 'unit-33-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'presentToka' },
      { verbId: 'ukan', tense: 'presentToka' },
      { verbId: 'izan', tense: 'pastToka' },
      { verbId: 'ukan', tense: 'pastToka' },
    ],
  },
  // Unit 34 (#167 core scope) — Noka (feminine allocutive), the `-k` -> `-n`
  // transform of Unit 33's toka forms. Same structure as Unit 33.
  { id: 'izan-present-noka', verbId: 'izan', tense: 'presentNoka' },
  { id: 'ukan-present-noka', verbId: 'ukan', tense: 'presentNoka' },
  { id: 'izan-past-noka', verbId: 'izan', tense: 'pastNoka' },
  { id: 'ukan-past-noka', verbId: 'ukan', tense: 'pastNoka' },
  {
    id: 'unit-34-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'presentNoka' },
      { verbId: 'ukan', tense: 'presentNoka' },
      { verbId: 'izan', tense: 'pastNoka' },
      { verbId: 'ukan', tense: 'pastNoka' },
    ],
  },
  // Unit 36 (#145) — Stage 13, "Passive & Reading Real Text": a new
  // `kind: 'reading'` lesson, comprehension questions over real sentences
  // rather than a conjugation table. `itemIds` resolve into
  // `src/data/readingItems.js`'s `READING_ITEMS`; `mode: 'recognition'`
  // marks it recognition-only per the unit's focus (composes with #140's
  // recognition-mode flag). §14 non-finite-form items (#170) get their own
  // lesson below rather than being folded into this one.
  {
    id: 'unit-36-reading',
    review: true,
    kind: 'reading',
    mode: 'recognition',
    itemIds: [
      'reading-nor-shift-ireki',
      'reading-nor-shift-hautsi',
      'reading-nor-shift-itzali',
      'reading-impersonal-hitzegin',
      'reading-impersonal-erre',
      'reading-nor-shift-piztu',
      'reading-nor-shift-itxi',
      'reading-impersonal-idatzi',
      'reading-impersonal-irakurri',
      'reading-impersonal-sagarrak',
    ],
  },
  // #170 — §14 ("Non-finite forms") reading items: a second Unit 36 lesson
  // rather than folding into `unit-36-reading` above, since 10+8 items would
  // make a single lesson too long.
  {
    id: 'unit-36-reading-nonfinite',
    review: true,
    kind: 'reading',
    mode: 'recognition',
    itemIds: [
      'reading-nonfinite-verbalnoun-absolutive',
      'reading-nonfinite-verbalnoun-dative',
      'reading-nonfinite-verbalnoun-causal',
      'reading-nonfinite-verbalnoun-purposive',
      'reading-nonfinite-verbalnoun-temporal',
      'reading-nonfinite-participle-attributive',
      'reading-nonfinite-participle-resultative',
      'reading-nonfinite-modal-z',
    ],
  },
  // Unit 42 (#262, Phase VII Stage 17 — "Carrying & Bringing") — `eraman`/
  // `ekarri`, both nor-nork synthetic verbs in the same already-taught shape
  // as `eduki`/`jakin` (Units 14/4). No new grammatical relation, so — like
  // Unit 40's `jario`/`etzan`/`irudi` and Unit 41's weather idioms — this
  // slots into Phase VII rather than the renumbered core sequence (Units
  // 1-39): "optional flavor content... neither unit unlocks new agreement
  // coverage that isn't already taught elsewhere" (docs/LEARNING_JOURNEY.md).
  // Present + past, full 6-person grid, singular/plural split per the
  // app-wide 3-persons-per-exercise rule.
  { id: 'eraman-present', verbId: 'eraman', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'eraman-present-plural', verbId: 'eraman', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ekarri-present', verbId: 'ekarri', tense: 'present', persons: PHASE_1_PERSONS },
  { id: 'ekarri-present-plural', verbId: 'ekarri', tense: 'present', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'eraman-past', verbId: 'eraman', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'eraman-past-plural', verbId: 'eraman', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  { id: 'ekarri-past', verbId: 'ekarri', tense: 'past', persons: PHASE_1_PERSONS },
  { id: 'ekarri-past-plural', verbId: 'ekarri', tense: 'past', persons: PHASE_1_PLURAL_PERSONS },
  {
    id: 'unit-42-review',
    review: true,
    persons: PHASE_1_PERSONS,
    sources: [
      { verbId: 'eraman', tense: 'present' },
      { verbId: 'ekarri', tense: 'present' },
      { verbId: 'eraman', tense: 'past' },
      { verbId: 'ekarri', tense: 'past' },
    ],
  },
  {
    id: 'unit-42-review-plural',
    review: true,
    persons: PHASE_1_PLURAL_PERSONS,
    sources: [
      { verbId: 'eraman', tense: 'present' },
      { verbId: 'ekarri', tense: 'present' },
      { verbId: 'eraman', tense: 'past' },
      { verbId: 'ekarri', tense: 'past' },
    ],
  },
  // Unit 15 (#350, new — inserted after Unit 14's NOR-NORK past pool, shifting
  // every later unit +1) — the non-3rd-person object: `ukan`/`maite`'s
  // `presentByObject`/`pastByObject` tables (#346/#347/#348) let the *object*
  // (NOR) be ni/zu/zuek/haiek, not just the default `hura` every earlier unit
  // fixes it to. `objectAxis: { vary: 'nor', fixed: 'ni' }` is `LESSONS`'
  // first-ever use of that field — `generateQuestions`/`createExerciseState`
  // have supported it since #346, but no lesson exercised it until now.
  // `fixed: 'ni'` (rather than some other NORK) makes the payoff sentence
  // "Maite zaitut" ("I love you") come out directly: NORK=ni, NOR=zu. `hura`
  // stays in `persons` (its by-object form, "(maite) dut", is the one every
  // earlier unit already drilled, so it's free reinforcement here) but `gu`
  // is excluded — `nork: 'ni'` can't take `gu` as its own object (no
  // first-person-plural-includes-the-speaker reflexive in this paradigm; see
  // `resolveObjectAxisTable`'s "missing cell" handling in `lessonLogic.js`).
  // At the time this unit was written, `ikusi` had no `*ByObject` table and
  // `generateCrossVerbQuestions` didn't support `objectAxis` pooling at all,
  // so this was four single-verb practice lessons with no pooled review,
  // matching the precedent set by Unit 12 (`izan-past-pool`/
  // `izan-past-pool-plural` alone, no trailing `unit-N-review`). #378/#379
  // gave `ikusi`/`jan`/`edan`/`erosi`/`hartu` their own `*ByObject` tables and
  // #380 added the pooling support, so #381 appended
  // `object-axis-present-review`/`object-axis-past-review` below, spanning
  // all seven verbs.
  {
    id: 'ukan-object-axis-present',
    verbId: 'ukan',
    tense: 'presentByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'maite-object-axis-present',
    verbId: 'maite',
    tense: 'presentByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ukan-object-axis-past',
    verbId: 'ukan',
    tense: 'pastByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'maite-object-axis-past',
    verbId: 'maite',
    tense: 'pastByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  // #381: now that `ikusi`/`jan`/`edan`/`erosi`/`hartu` have their own
  // `presentByObject`/`pastByObject` tables (#378/#379) and
  // `generateCrossVerbQuestions` can pool `objectAxis` sources (#380), Unit
  // 15 gets a pooled review spanning all seven object-axis verbs —
  // `review: true` + `sources` lets `generateCrossVerbQuestions` draw
  // "which verb fits" distractors across the whole set, not just
  // `ukan`/`maite`. Same `persons`/`objectAxis` as the four practice lessons
  // above (every source shares one fixed axis, see `docs/DECISIONS.md`).
  {
    id: 'object-axis-present-review',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },

  // #416: the block above only ever fixes `nork` at `ni` — every other NORK
  // value (`hura`/`gu`/`zu`/`zuek`/`haiek`) sits in `ukan`/`maite`'s
  // `presentByObject`/`pastByObject` tables already but was never wired into
  // a lesson, so forms like `nau`/`gaitu`/`naute` (someone/something acting
  // on me/us) were undrillable. #416 itself scoped this to `ukan`/`maite`
  // only, which left the unit wall-to-wall `maite`/`ukan` (see #435).
  //
  // #435: rather than a fixed `ukan`+`maite` pair per remaining NORK value,
  // each value now carries a single *rotated* practice verb per tense — the
  // ten present/past slots below cycle through all seven object-axis verbs
  // (`ukan`/`maite` twice each as the unit's headline anchors, `ikusi` twice,
  // `jan`/`edan`/`erosi`/`hartu` once each) so every fodder verb gets a real
  // standalone practice lesson instead of living only inside the #350/#381
  // `fixed: 'ni'` review. Each NORK value also gains its own pooled
  // `present`/`past` review spanning all seven verbs, mirroring #381's
  // `fixed: 'ni'` reviews — `generateCrossVerbQuestions`'s `objectAxis`
  // pooling only needs one shared `fixed` per review, which each of these
  // already has. See docs/DECISIONS.md.
  {
    id: 'ukan-object-axis-present-hura',
    verbId: 'ukan',
    tense: 'presentByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'maite-object-axis-past-hura',
    verbId: 'maite',
    tense: 'pastByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'object-axis-present-review-hura',
    review: true,
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review-hura',
    review: true,
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },
  {
    id: 'ikusi-object-axis-present-gu',
    verbId: 'ikusi',
    tense: 'presentByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'jan-object-axis-past-gu',
    verbId: 'jan',
    tense: 'pastByObject',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'object-axis-present-review-gu',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review-gu',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },
  {
    id: 'edan-object-axis-present-zu',
    verbId: 'edan',
    tense: 'presentByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'erosi-object-axis-past-zu',
    verbId: 'erosi',
    tense: 'pastByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'object-axis-present-review-zu',
    review: true,
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review-zu',
    review: true,
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },
  {
    id: 'hartu-object-axis-present-zuek',
    verbId: 'hartu',
    tense: 'presentByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ukan-object-axis-past-zuek',
    verbId: 'ukan',
    tense: 'pastByObject',
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'object-axis-present-review-zuek',
    review: true,
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review-zuek',
    review: true,
    persons: ['ni', 'hura', 'gu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },
  {
    id: 'maite-object-axis-present-haiek',
    verbId: 'maite',
    tense: 'presentByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ikusi-object-axis-past-haiek',
    verbId: 'ikusi',
    tense: 'pastByObject',
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'object-axis-present-review-haiek',
    review: true,
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
    sources: [
      { verbId: 'ukan', tense: 'presentByObject' },
      { verbId: 'maite', tense: 'presentByObject' },
      { verbId: 'ikusi', tense: 'presentByObject' },
      { verbId: 'jan', tense: 'presentByObject' },
      { verbId: 'edan', tense: 'presentByObject' },
      { verbId: 'erosi', tense: 'presentByObject' },
      { verbId: 'hartu', tense: 'presentByObject' },
      { verbId: 'nahi', tense: 'presentByObject' },
      { verbId: 'behar', tense: 'presentByObject' },
      { verbId: 'entzun', tense: 'presentByObject' },
      { verbId: 'ulertu', tense: 'presentByObject' },
      { verbId: 'ezagutu', tense: 'presentByObject' },
      { verbId: 'aurkitu', tense: 'presentByObject' },
      { verbId: 'bilatu', tense: 'presentByObject' },
      { verbId: 'babestu', tense: 'presentByObject' },
      { verbId: 'bultzatu', tense: 'presentByObject' },
      { verbId: 'sustatu', tense: 'presentByObject' },
      { verbId: 'bermatu', tense: 'presentByObject' },
      { verbId: 'ziurtatu', tense: 'presentByObject' },
      { verbId: 'gaitzetsi', tense: 'presentByObject' },
      { verbId: 'sentitu', tense: 'presentByObject' },
      { verbId: 'sumatu', tense: 'presentByObject' },
      { verbId: 'aztertu', tense: 'presentByObject' },
      { verbId: 'ukatu', tense: 'presentByObject' },
      { verbId: 'bukatu', tense: 'presentByObject' },
      { verbId: 'amaitu', tense: 'presentByObject' },
      { verbId: 'gainditu', tense: 'presentByObject' },
      { verbId: 'bereiztu', tense: 'presentByObject' },
      { verbId: 'jaso', tense: 'presentByObject' },
      { verbId: 'itxaron', tense: 'presentByObject' },
      { verbId: 'hausnartu', tense: 'presentByObject' },
      { verbId: 'pentsatu', tense: 'presentByObject' },
      { verbId: 'aldarrikatu', tense: 'presentByObject' },
      { verbId: 'plazaratu', tense: 'presentByObject' },
      { verbId: 'batu', tense: 'presentByObject' },
      { verbId: 'adierazi', tense: 'presentByObject' },
      { verbId: 'kontuan-hartu', tense: 'presentByObject' },
    ],
  },
  {
    id: 'object-axis-past-review-haiek',
    review: true,
    persons: ['ni', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
    sources: [
      { verbId: 'ukan', tense: 'pastByObject' },
      { verbId: 'maite', tense: 'pastByObject' },
      { verbId: 'ikusi', tense: 'pastByObject' },
      { verbId: 'jan', tense: 'pastByObject' },
      { verbId: 'edan', tense: 'pastByObject' },
      { verbId: 'erosi', tense: 'pastByObject' },
      { verbId: 'hartu', tense: 'pastByObject' },
      { verbId: 'behar', tense: 'pastByObject' },
      { verbId: 'entzun', tense: 'pastByObject' },
      { verbId: 'ulertu', tense: 'pastByObject' },
      { verbId: 'ezagutu', tense: 'pastByObject' },
      { verbId: 'aurkitu', tense: 'pastByObject' },
      { verbId: 'bilatu', tense: 'pastByObject' },
      { verbId: 'babestu', tense: 'pastByObject' },
      { verbId: 'bultzatu', tense: 'pastByObject' },
      { verbId: 'sustatu', tense: 'pastByObject' },
      { verbId: 'bermatu', tense: 'pastByObject' },
      { verbId: 'ziurtatu', tense: 'pastByObject' },
      { verbId: 'gaitzetsi', tense: 'pastByObject' },
      { verbId: 'sentitu', tense: 'pastByObject' },
      { verbId: 'sumatu', tense: 'pastByObject' },
      { verbId: 'aztertu', tense: 'pastByObject' },
      { verbId: 'ukatu', tense: 'pastByObject' },
      { verbId: 'bukatu', tense: 'pastByObject' },
      { verbId: 'amaitu', tense: 'pastByObject' },
      { verbId: 'gainditu', tense: 'pastByObject' },
      { verbId: 'bereiztu', tense: 'pastByObject' },
      { verbId: 'jaso', tense: 'pastByObject' },
      { verbId: 'itxaron', tense: 'pastByObject' },
      { verbId: 'hausnartu', tense: 'pastByObject' },
      { verbId: 'pentsatu', tense: 'pastByObject' },
      { verbId: 'aldarrikatu', tense: 'pastByObject' },
      { verbId: 'plazaratu', tense: 'pastByObject' },
      { verbId: 'batu', tense: 'pastByObject' },
      { verbId: 'adierazi', tense: 'pastByObject' },
      { verbId: 'kontuan-hartu', tense: 'pastByObject' },
    ],
  },

  // #358/#359: the NOR-NORI mirror of the block above — `gustatu`/`iruditu`/
  // `ahaztu`'s `presentByNor`/`pastByNor` tables (#358) let NOR be ni/gu/zuek,
  // not just the default hura/haiek every earlier NOR-NORI lesson fixes it
  // to. `objectAxis: { vary: 'nor', fixed: 'zu' }` pins NORI at `zu` (the
  // unit's payoff dative person, "Gustatzen natzaizu?") and varies NOR —
  // `zu` itself is the reflexive gap (absent from the table), and `hura` as
  // NOR is already covered by Units 26-27's flat `present`/`past` tables, so
  // `persons` here is just `ni`/`gu`/`zuek`. Same scope limits as the block
  // above: no `ikusi`-style sibling (no other taught NOR-NORI verb to extend)
  // and no pooled review (`generateCrossVerbQuestions` has no `objectAxis`
  // support), so this is six single-verb practice lessons with no trailing
  // `unit-N-review`.
  {
    id: 'gustatu-nor-axis-present',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-nor-axis-present',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-nor-axis-present',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-nor-axis-past',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-nor-axis-past',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-nor-axis-past',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  // #441: the pooled cross-verb review this axis never had — mixes
  // gustatu/iruditu/ahaztu/jarraitu's presentByNor/pastByNor, same
  // `generateCrossVerbQuestions`'s `objectAxis` pooling (#380) Unit 15's
  // `object-axis-*-review-*` lessons already use.
  {
    id: 'nor-axis-present-review-zu',
    review: true,
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-zu',
    review: true,
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },

  // #419: the block above only ever fixes `nori` at `zu` — every other NORI
  // value (`ni`/`hura`/`gu`/`zuek`/`haiek`) sits in `gustatu`/`iruditu`/
  // `ahaztu`'s `presentByNor`/`pastByNor` tables already but was never wired
  // into a lesson, so forms like `natzaio`/`gatzaizkit`/`zatzaizkie` were
  // undrillable. One `objectAxis: { vary: 'nor', fixed: <nori> }` pair
  // (present + past) per remaining NORI value, all three verbs, mirrors the
  // shape Unit 28 already established for `fixed: 'zu'` above — extending
  // this unit rather than opening a new one, same #286/#416 "extend, don't
  // add a new unit" precedent. No pooled cross-verb review here either,
  // same scope cut as #416 made for the NOR-NORK side — see docs/DECISIONS.md.
  {
    id: 'gustatu-nor-axis-present-ni',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-nor-axis-present-ni',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-nor-axis-present-ni',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-nor-axis-past-ni',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-nor-axis-past-ni',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-nor-axis-past-ni',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'nor-axis-present-review-ni',
    review: true,
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-ni',
    review: true,
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },
  {
    id: 'gustatu-nor-axis-present-hura',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-nor-axis-present-hura',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-nor-axis-present-hura',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-nor-axis-past-hura',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-nor-axis-past-hura',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-nor-axis-past-hura',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'nor-axis-present-review-hura',
    review: true,
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-hura',
    review: true,
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },
  {
    id: 'gustatu-nor-axis-present-gu',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-nor-axis-present-gu',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-nor-axis-present-gu',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-nor-axis-past-gu',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-nor-axis-past-gu',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-nor-axis-past-gu',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'nor-axis-present-review-gu',
    review: true,
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-gu',
    review: true,
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },
  {
    id: 'gustatu-nor-axis-present-zuek',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-nor-axis-present-zuek',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-nor-axis-present-zuek',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-nor-axis-past-zuek',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-nor-axis-past-zuek',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-nor-axis-past-zuek',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'nor-axis-present-review-zuek',
    review: true,
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-zuek',
    review: true,
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },
  {
    id: 'gustatu-nor-axis-present-haiek',
    verbId: 'gustatu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-nor-axis-present-haiek',
    verbId: 'iruditu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-nor-axis-present-haiek',
    verbId: 'ahaztu',
    tense: 'presentByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-nor-axis-past-haiek',
    verbId: 'gustatu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-nor-axis-past-haiek',
    verbId: 'iruditu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-nor-axis-past-haiek',
    verbId: 'ahaztu',
    tense: 'pastByNor',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'nor-axis-present-review-haiek',
    review: true,
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
    sources: [
      { verbId: 'gustatu', tense: 'presentByNor' },
      { verbId: 'iruditu', tense: 'presentByNor' },
      { verbId: 'ahaztu', tense: 'presentByNor' },
      { verbId: 'jarraitu', tense: 'presentByNor' },
    ],
  },
  {
    id: 'nor-axis-past-review-haiek',
    review: true,
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
    sources: [
      { verbId: 'gustatu', tense: 'pastByNor' },
      { verbId: 'iruditu', tense: 'pastByNor' },
      { verbId: 'ahaztu', tense: 'pastByNor' },
      { verbId: 'jarraitu', tense: 'pastByNor' },
    ],
  },
  // #425: gustatu/iruditu/ahaztu's Baldintza/Ondorioa/Ahalera/Agintera
  // object-axis tables (baldintzaByNor/conditionalByNor/conditionalPastByNor/
  // potentialByNor/potentialAlegiazkoaByNor/potentialLehenaldiaByNor) had
  // zero lessons across any NORI value -- unlike presentByNor/pastByNor
  // above, there was no #358-style "fixed: 'zu'" starting lesson to extend,
  // so this covers all six NORI values (ni/zu/hura/gu/zuek/haiek) directly,
  // for all three verbs, across all six tables. `mode: 'recognition'`
  // fulfills Units 33/34's focus text, which already advertised "recognition-
  // only for the dative paradigms" as in-scope but deferred (see #148's
  // remaining-scope issue) -- this is that deferred content landing. `persons`
  // mirrors each NORI row's actual NOR keys, same reflexive-gap pattern
  // (`nor` is structurally `ni`/`zu`/`gu`/`zuek` only -- no `hura`/`haiek` as
  // NOR in these tables) `presentByNor`/`pastByNor` already established.
  // No pooled cross-verb review, same `objectAxis` limitation as every
  // earlier block in this file.
  {
    id: 'gustatu-baldintza-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-baldintza-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-baldintza-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-baldintza-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-baldintza-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-baldintza-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-baldintza-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-baldintza-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'baldintzaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-conditional-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-conditional-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-conditional-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-conditional-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-conditional-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-conditional-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-conditional-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-conditional-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-conditional-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-conditional-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-conditional-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-conditional-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-conditional-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'conditionalByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-conditional-past-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-conditional-past-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-conditional-past-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'conditionalPastByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-potential-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-potential-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-potential-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-potential-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-potential-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-potential-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-potential-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-potential-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-potential-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-potential-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-potential-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-potential-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-potential-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-potential-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-potential-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-potential-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-potential-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-potential-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'potentialByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-potential-alegiazkoa-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-potential-alegiazkoa-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-potential-alegiazkoa-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'potentialAlegiazkoaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-ni',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-ni',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-ni',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-zu',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-zu',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-zu',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-hura',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-hura',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-hura',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-gu',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-gu',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-gu',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-zuek',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-zuek',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-zuek',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-potential-lehenaldia-nor-axis-haiek',
    verbId: 'gustatu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-potential-lehenaldia-nor-axis-haiek',
    verbId: 'iruditu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-potential-lehenaldia-nor-axis-haiek',
    verbId: 'ahaztu',
    tense: 'potentialLehenaldiaByNor',
    mode: 'recognition',
    persons: ['ni', 'zu', 'gu', 'zuek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  // #425: imperativeByNor's remaining NORI values (#364 only ever fixed
  // `nori` at `zu` -- `gustatu-imperative-axis`/etc. above). Same shape,
  // `persons` mirroring each NORI row's actual NOR keys (`hura`/`haiek` ARE
  // valid NOR values here, per `imperativeByNor`'s own comment in
  // `verbs.js` -- no flat `imperative` table to be redundant with).
  {
    id: 'gustatu-imperative-axis-ni',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'iruditu-imperative-axis-ni',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'ahaztu-imperative-axis-ni',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
  },
  {
    id: 'gustatu-imperative-axis-hura',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'iruditu-imperative-axis-hura',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'ahaztu-imperative-axis-hura',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
  },
  {
    id: 'gustatu-imperative-axis-gu',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'iruditu-imperative-axis-gu',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'ahaztu-imperative-axis-gu',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
  },
  {
    id: 'gustatu-imperative-axis-zuek',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'iruditu-imperative-axis-zuek',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'ahaztu-imperative-axis-zuek',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
  },
  {
    id: 'gustatu-imperative-axis-haiek',
    verbId: 'gustatu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'iruditu-imperative-axis-haiek',
    verbId: 'iruditu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  {
    id: 'ahaztu-imperative-axis-haiek',
    verbId: 'ahaztu',
    tense: 'imperativeByNor',
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
  },
  // #444: the pooled cross-verb review this axis never had — the imperative
  // twin of #441's `nor-axis-{present,past}-review-*`. Mixes
  // gustatu/iruditu/ahaztu/jarraitu's `imperativeByNor`, one review per NORI
  // value, `persons` matching each fixed value's own solo lessons above
  // (`zu`/`zuek` drop themselves as the reflexive gap; `ni`/`gu` are never
  // valid NOR values in this table at all). `jario` stays out (thing-NOR,
  // #442).
  {
    id: 'imperative-axis-review-zu',
    review: true,
    persons: ['hura', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zu' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  {
    id: 'imperative-axis-review-ni',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'ni' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  {
    id: 'imperative-axis-review-hura',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'hura' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  {
    id: 'imperative-axis-review-gu',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'gu' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  {
    id: 'imperative-axis-review-zuek',
    review: true,
    persons: ['hura', 'zu', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'zuek' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  {
    id: 'imperative-axis-review-haiek',
    review: true,
    persons: ['hura', 'zu', 'zuek', 'haiek'],
    objectAxis: { vary: 'nor', fixed: 'haiek' },
    sources: [
      { verbId: 'gustatu', tense: 'imperativeByNor' },
      { verbId: 'iruditu', tense: 'imperativeByNor' },
      { verbId: 'ahaztu', tense: 'imperativeByNor' },
      { verbId: 'jarraitu', tense: 'imperativeByNor' },
    ],
  },
  // #369 — Unit 36, "Purpose & Wishing (Subjuntiboa)". izan/ukan get
  // in-construction production (sentences over the volitional `nahi izan`
  // frame), restricted to `hura`/`haiek` per the unit's stated "3rd-person...
  // production" scope. gustatu/iruditu/ahaztu's dative and esan/eman's
  // ditransitive subjunctive are recognition-only, pooled per verb family —
  // same `unit-N-dative-review`/`unit-N-ditransitive-review` split every
  // prior unit in this stage uses.
  {
    id: 'izan-subjunctive-present',
    verbId: 'izan',
    tense: 'subjunctivePresent',
    persons: ['hura', 'haiek'],
  },
  {
    id: 'ukan-subjunctive-present',
    verbId: 'ukan',
    tense: 'subjunctivePresent',
    persons: ['hura', 'haiek'],
  },
  {
    id: 'unit-36-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'subjunctivePresent' },
      { verbId: 'ukan', tense: 'subjunctivePresent' },
    ],
  },
  {
    id: 'unit-36-dative-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'gustatu', tense: 'subjunctivePresent' },
      { verbId: 'iruditu', tense: 'subjunctivePresent' },
      { verbId: 'ahaztu', tense: 'subjunctivePresent' },
    ],
  },
  {
    id: 'unit-36-ditransitive-review',
    review: true,
    mode: 'recognition',
    sources: [
      { verbId: 'esan', tense: 'subjunctivePresent' },
      { verbId: 'eman', tense: 'subjunctivePresent' },
    ],
  },
  // #370 — Unit 42, "Making Someone Do It": causative `nor` → `nor-nork`
  // (`itzularazi`/`dantzarazi`), present/past/future per LEARNING_JOURNEY.md.
  { id: 'itzularazi-present', verbId: 'itzularazi', tense: 'present' },
  { id: 'itzularazi-past', verbId: 'itzularazi', tense: 'past' },
  { id: 'itzularazi-future', verbId: 'itzularazi', tense: 'future' },
  { id: 'dantzarazi-present', verbId: 'dantzarazi', tense: 'present' },
  { id: 'dantzarazi-past', verbId: 'dantzarazi', tense: 'past' },
  { id: 'dantzarazi-future', verbId: 'dantzarazi', tense: 'future' },
  {
    id: 'unit-42-causative-review',
    review: true,
    sources: [
      { verbId: 'itzularazi', tense: 'present' },
      { verbId: 'itzularazi', tense: 'past' },
      { verbId: 'itzularazi', tense: 'future' },
      { verbId: 'dantzarazi', tense: 'present' },
      { verbId: 'dantzarazi', tense: 'past' },
      { verbId: 'dantzarazi', tense: 'future' },
    ],
  },
  // #370 — Unit 43, "Making Someone Do Something to Someone": causative
  // `nor-nork` → `nor-nori-nork` (`janarazi`/`idatzarazi`), present/past/future.
  { id: 'janarazi-present', verbId: 'janarazi', tense: 'present' },
  { id: 'janarazi-past', verbId: 'janarazi', tense: 'past' },
  { id: 'janarazi-future', verbId: 'janarazi', tense: 'future' },
  { id: 'idatzarazi-present', verbId: 'idatzarazi', tense: 'present' },
  { id: 'idatzarazi-past', verbId: 'idatzarazi', tense: 'past' },
  { id: 'idatzarazi-future', verbId: 'idatzarazi', tense: 'future' },
  {
    id: 'unit-43-causative-review',
    review: true,
    sources: [
      { verbId: 'janarazi', tense: 'present' },
      { verbId: 'janarazi', tense: 'past' },
      { verbId: 'janarazi', tense: 'future' },
      { verbId: 'idatzarazi', tense: 'present' },
      { verbId: 'idatzarazi', tense: 'past' },
      { verbId: 'idatzarazi', tense: 'future' },
    ],
  },
  // #370 — Unit 44, Refresh Gate D: zero new verbs, dedicated gate review
  // lessons pooling Units 42-43's verbs (mirroring Unit 22 gate's own
  // dedicated `unit-20-review-*` lessons rather than reusing the prior
  // units' review lesson ids — every LESSONS id is referenced exactly once).
  {
    id: 'unit-44-review-1',
    review: true,
    sources: [
      { verbId: 'itzularazi', tense: 'present' },
      { verbId: 'itzularazi', tense: 'past' },
      { verbId: 'itzularazi', tense: 'future' },
      { verbId: 'dantzarazi', tense: 'present' },
      { verbId: 'dantzarazi', tense: 'past' },
      { verbId: 'dantzarazi', tense: 'future' },
    ],
  },
  {
    id: 'unit-44-review-2',
    review: true,
    sources: [
      { verbId: 'janarazi', tense: 'present' },
      { verbId: 'janarazi', tense: 'past' },
      { verbId: 'janarazi', tense: 'future' },
      { verbId: 'idatzarazi', tense: 'present' },
      { verbId: 'idatzarazi', tense: 'past' },
      { verbId: 'idatzarazi', tense: 'future' },
    ],
  },
]
