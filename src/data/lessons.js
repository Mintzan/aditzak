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
  // (the old "Future Groups A-D", ~32 lessons) into two: Unit 17 teaches the
  // rule on a small core set, and Unit 18 spreads it across the remaining
  // verbs as cross-verb *mixer reviews* rather than re-drilling each verb's
  // table one at a time. See `docs/DECISIONS.md` (2026-06-14, "Compressed the
  // future stage").
  //
  // Unit 17 (The Future Tense): introduce `-ko`/`-go` on a three-verb core
  // spanning both auxiliary patterns — `izan` (nor / `naiz`), `ukan`
  // (nor-nork / `dut`), `joan` (nor motion / `naiz`) — full singular/plural
  // split (same as Units 12-15) plus an intro-review pair. #143 added
  // `etorri`'s future to that intro-review to stage the first `-ko`/`-go`
  // minimal pair — `izan`'s future (`izango`) takes `-go`, `etorri`'s
  // (`etorriko`) takes `-ko`, drilled side by side here. `etorri`'s future
  // table already existed for Unit 18's "being/going" mixer, so no new
  // `VERBS` data was needed.
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
  // Unit 18 (The Future, Across Every Verb): the rule is already learned, so
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
  // Unit 24 (#146) — NOR-NORI past + future on the same verbs.
  { id: 'gustatu-past', verbId: 'gustatu', tense: 'past' },
  { id: 'gustatu-future', verbId: 'gustatu', tense: 'future' },
  { id: 'iruditu-past', verbId: 'iruditu', tense: 'past' },
  { id: 'iruditu-future', verbId: 'iruditu', tense: 'future' },
  { id: 'ahaztu-past', verbId: 'ahaztu', tense: 'past' },
  { id: 'ahaztu-future', verbId: 'ahaztu', tense: 'future' },
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
      { verbId: 'lagundu', tense: 'past' },
      { verbId: 'ekin', tense: 'past' },
      { verbId: 'erantzun', tense: 'past' },
      { verbId: 'deitu', tense: 'past' },
      { verbId: 'eragin', tense: 'past' },
      { verbId: 'antzeman', tense: 'past' },
      { verbId: 'mesede-egin', tense: 'past' },
      { verbId: 'kalte-egin', tense: 'past' },
      { verbId: 'aurre-egin', tense: 'past' },
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
      { verbId: 'lagundu', tense: 'past' },
      { verbId: 'ekin', tense: 'past' },
      { verbId: 'erantzun', tense: 'past' },
      { verbId: 'deitu', tense: 'past' },
      { verbId: 'eragin', tense: 'past' },
      { verbId: 'antzeman', tense: 'past' },
      { verbId: 'mesede-egin', tense: 'past' },
      { verbId: 'kalte-egin', tense: 'past' },
      { verbId: 'aurre-egin', tense: 'past' },
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
  // Unit 30 (#171 core scope) — Commands (Agintera/imperative), second-person
  // only. izan/ukan are NOT `agreementsCompatible`, so `unit-30-review`
  // (pooling both for spaced repetition) gets no cross-verb borrowing —
  // accepted as-is, same as #167's toka/noka. Ditransitive (`iezadazu`),
  // jussive/hortative forms, and egon/etorri/joan's imperative (= present
  // tense — see CONJUGATIONS.md §16.2) are deferred to the issue filed for
  // #171's remaining scope.
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
]
