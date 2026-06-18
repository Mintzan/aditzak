# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

This file keeps the most recent ~25 entries. Older entries live in
`docs/DECISIONS_ARCHIVE.md` — check there too if you don't find the
context you're looking for here.

## 2026-06-18 — [B1] (#226): provenance-typed distractor candidates, no behaviour change

**Decision:** Split `buildOptions` (`src/lessonLogic.js`) into a new exported
`buildTaggedOptions`, which builds the same priority/pool/borrow-pool
distractor selection but keeps each candidate as `{ form, source }` with
`source ∈ 'same-table' | 'sibling' | 'lure'` throughout, and a thin
`buildOptions` wrapper that flattens `distractors` to plain form strings for
the existing `{ correct, options }` return shape. Same-table forms (the
other persons' table entries) are tagged `'same-table'`; `extraCandidates`
and the last-resort `borrowPool` are both tagged `'sibling'` (both are
"another verb's form," whether pulled in via a review's declared sources or
the broader borrow pool); `priorityCandidates` (case-frame/cross-tense/
object-number/pronoun lures) are tagged `'lure'`. Dedup-by-form, the
3-distractor cap, and priority-slot ordering are unchanged — `buildOptions`'s
call sites in `generateQuestions` needed no changes, since the wrapping
happens entirely inside `buildOptions`/`buildTaggedOptions`. `npm test`
passes with zero changes to any existing fixture or assertion, proving no
behaviour change; two new `buildTaggedOptions`-specific tests in
`logic.test.js` lock the tagging contract. This is pure plumbing for [B2]
(#227), which will use the tags to collapse the `reviewScoped`/`borrowPool`
gates into a single grounding invariant.

## 2026-06-18 — [A1] (#223): validFor delta-audit script + CI guard

**Decision:** Added `scripts/validforGapAudit.mjs` (the shared
`computeGapSlots`/`computeGapCounts` core), `scripts/validfor-delta-audit.mjs`
(the CLI: per-verb table by default, `--verb <id>` for the worklist, `--json`
for the baseline), `scripts/validfor-gap-baseline.json` (checked-in baseline,
matches the §3 sizing run's counts exactly), and `src/validfor-audit.test.js`
(fails with an actionable message whenever the gap surface changes).
Deliberately **not** an absolute lint — per `docs/DISTRACTOR_STRATEGY.md` §3
that would be ~all noise; this only forces a human look when the surface
*changes*, e.g. a new verb/tense being added. No `validFor` data was touched
in this issue — the baseline reflects the current (gappy, `behar`-under-tagged)
state as-is; closing those gaps is [A2]'s job, using this tool's `--verb behar`
output as its worklist.

## 2026-06-17 — #218: consolidated distractor/ambiguity strategy in `docs/DISTRACTOR_STRATEGY.md`

**Decision:** Added `docs/DISTRACTOR_STRATEGY.md` as the standing
full-picture planning doc for distractor selection and ambiguity, restoring
the institutional-memory role `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` had before
#126 deleted it. The `validFor` *schema* stays in `docs/SENTENCE_FRAMES.md`;
the new doc is the *direction/methodology* layer above it. No runtime change.

**Why:** ~30 issues have touched distractors as if it were one topic; it's
actually three families (A: false-negative ambiguity → `validFor`; B: leakage
of borrowed/lure forms into ungrounded `form` questions → the repeatedly-
patched #139/#174/#200/#203 line; C: lure pedagogy/legibility). Conflating
them is why fixes to one resurface as regressions in another. #218 is a fresh
batch spanning all three, so the picture was worth writing down once.

**Calibration evidence (read-only sizing run, this date):** the `validFor`
completeness-review surface is **structural — driven by agreement-cluster
size, not recency.** A verb joining the ~16-member `nor-nork` cluster creates
~300–370 review slots; a dative-cluster verb creates dozens. An *absolute*
completeness lint is therefore noise (3,969 "gap slots" across 898 tagged
variants, mostly correct distractors); only a *delta* audit at verb-add time
is useful. The raw count can't tell bug-density from review-surface (`behar`'s
293 land on semantically-close sentences and are likely real omissions;
`jan`/`edan`'s ~370 are mostly correct distractors). Net direction:
frame-derived `validFor` for the core cluster, manual + delta-audit for the
dative tail, provenance-typed distractors to retire Family B's accreted gates,
and legible/targeted lures for Family C. Open decisions enumerated in the doc;
`behar` flagged as known content debt. **No short-term fixes made** per the
issue owner's call — this is planning only.

## 2026-06-17 — #203: `generateQuestions`'s review-scoping needs an explicit `review` flag, not just `sources.length > 1`

**Decision:** `generateQuestions` now takes an explicit `review` boolean
(passed by the App.jsx call site from `lesson.review`), and `reviewScoped`
is `true` when *either* `review` is set *or* `sources.length > 1`. Reported
bug: `ikusi-present-plural-review` (a single-source review,
`sources: [{ verbId: 'ikusi', tense: 'present' }]`) showed a bare `kind:
'form'` "haiek" question offering `dira` (izan's haiek form) alongside
ikusi's own `ikusten X` forms — `dira` doesn't even agree with `ikusi`
(NOR vs NOR-NORK), so with no sentence or verb name shown (review lessons
hide both for `form` questions) it read as a random, ungrounded option.

**Why it happened:** `reviewScoped` (added by #200) keyed entirely off
`sources.length > 1`, but a review can legitimately have just one source —
`ikusi-present-plural-review` only reviews `ikusi` itself, restricted to
plural persons. With `reviewScoped` false, the code took the ordinary-
practice-lesson path: `formLures` (the case-frame lure — e.g. izan's `naiz`
offered for ukan's `dut`, intentionally surfaced as a "wrong subject case"
distractor when a sentence's marking can disqualify it) got injected into
`buildOptions` unconditionally, even for the sentence-less `form` kind. The
fix also gates `formLures`, not just the borrow pool, behind `reviewScoped`
— both are "diagnosable mistake" distractors that need a sentence to read
as wrong, not bare ones.

## 2026-06-17 — #177: literal NOR-NORI-NORK cross-axis lure closed as "addressed differently"

**Decision:** Won't author new per-verb tables (e.g. an "esan to zu" table,
or a "zuk eman" table) just to produce a same-verb, same-axis-varying wrong
form for `esan`/`eman`. The generalized case-frame lure (#165) and
`getObjectNumberLure` (#165) stay the only NOR-NORI-NORK distractor rows for
this slot.

**Why:** `esan`'s data is fixed at `recipient: 'hura'` and `eman`'s at
`agent: 'ni'` — each verb only has the one axis-fixed table its lessons
actually use. A literal "wrong NORK"/"wrong NORI" same-verb lure needs a
second full table per verb varying the *other* axis, which has no use
outside manufacturing this one distractor — six more hand-authored forms per
verb per tense, for a lure that's only a refinement on one #165 already
ships (case-frame mismatch: missing/extra ergative marking entirely, a
coarser but real trap in the same family). That's a weak trade against the
cost of a new table shape with no pedagogical use of its own. If a
ditransitive verb is ever added whose lessons *need* a second table for
other reasons (e.g. varying NORI across persons), revisit then — the lure
would come for free.

**Scope note:** this resolves only #177's first row. Its other three rows
(future illegal-voicing non-word safety, the hi/hitanoa wrong-gender/neutral
lures, and the mood rows) are still blocked on #167's gendered toka/noka
data and #171/#182's dative-paradigm mood content, respectively.

## 2026-06-17 — #204: `jakin`'s "sekretua" sentence adds `ukan` to `validFor`

**Decision:** `jakin`'s `present`/`negativeSentences` "sekretua" ("a secret")
frames now list `'ukan'` alongside `'nahi'` in `validFor` — "Zuk sekretua
duzu" ("You have the secret") reads as a natural, grammatically valid
Basque sentence alongside "Zuk sekretua dakizu" ("You know the secret"), so
`ukan`'s `duzu` shouldn't have been excludable as a definitely-wrong
distractor there.

**Why this doesn't contradict #114's `jakin`↔`ukan` "confirmed wrong pair"
verdict:** that backfill pass judged the pair in general, but
`docs/SENTENCE_FRAMES.md` deliberately scopes `validFor` per sentence, not
per verb pair — abstract-but-ownable nouns like "sekretua" admit more
candidates than ones that are only "known" (e.g. "egia"/"the truth", left
unchanged: "Zuk egia duzu" reads shakier and wasn't confirmed). Don't
generalize this to other `jakin` sentences without the same per-sentence
check.

## 2026-06-17 — #188: `word-order` debuts in both Phase I and Unit 10, as a supplement

**Decision:** Both candidates from #188 — early Phase I and Unit 10's negation
drills — get `kind: 'word-order'`, not just one of them, and in Unit 10 it's
added to the existing `negative`/`type-negative` roll rather than replacing
either.

**Why both, not a choice:** #186's engine already gates `word-order`
generically on "does this person's filled sentence (or negated sentence,
under `includeNegation`) clear the 4-token floor" — there's no per-unit
opt-in to write, so restricting it to only one of the two candidates would
mean adding an artificial exclusion to a mechanism that's already correctly
scoped. Phase I lessons get it as one more kind alongside `sentence`/
`type-verb`/`spot-error` the same way `spot-error` itself slots into existing
lessons without new `LESSONS` entries; Unit 10 gets it for the same reason,
and because a word-order question over a negated sentence is a more direct
test of "where does `ez` go" than `spot-error`'s "pick the right sentence"
framing.

**Why supplement instead of replace in Unit 10:** replacing `negative`/
`type-negative` would mean a learner could pass through Unit 10 without ever
producing the negated form by typing or close reading — `word-order`'s
recognition-by-rearrangement is a different (and easier) skill than
`type-negative`'s production. Keeping all three in the roll pool means the
unit still drills production, recognition, and rearrangement rather than
narrowing to just one.

**No `LESSONS`/`journey.js` changes needed**: kind selection happens inside
`generateQuestions` per-question, not per-lesson, so this is a documentation-
only resolution — see `docs/LEARNING_JOURNEY.md`'s Unit 10 entry and
`docs/EXERCISE_ENGINE.md`'s "Word-order question contract" (#185).

## 2026-06-17 — #186: `kind: 'word-order'` engine, not gated by `noTyping`/`noProduction`

**Decision:** `generateQuestions` adds `word-order` to the `availableKinds` pool (per #185's contract) gated only by the 4-token minimum and, for negation lessons, `includeNegation` — it is **not** additionally excluded when `noTyping`/`noProduction` (recognition mode) is set, unlike `type-verb`/`type-pronoun`/`type-negative`/`spot-error`.

**Why:** those other kinds are excluded under `noTyping`/recognition mode because they require typing a form from memory. `word-order` never does — the learner only taps pre-given tokens into place, the same interaction model as `match-pairs`. Excluding it under "no typing" settings would be excluding a kind that was never typing in the first place.

## 2026-06-17 — #185: word-order question contract resolved

**Decision:** Settled the `kind: 'word-order'` design questions (full writeup in `docs/EXERCISE_ENGINE.md`'s Tier 3, alongside the negation-drills section) before any engine code lands, mirroring how `docs/SENTENCE_FRAMES.md` settled `validFor` before #123's implementation:

- Tokens are `{ id, text }` pairs (handles duplicate words); `correct` stays a plain reassembled-sentence string, so `isAnswerCorrect`/`exerciseReducer` need no changes — the UI just joins tapped tokens with `' '` and calls the existing `submitAnswer`.
- Retry reshuffles, via a local UI shuffle keyed off `question.attempt` rather than an engine-level reshuffle — the same precedent `MatchPairsBoard` (#191) set, since re-showing an identical wrong cloud is a worse retry experience than #191's frozen-board bug was for matching.
- Gated by a 4-token minimum (post-fill, post-split) so short sentences (≤3 words, ≤6 permutations) don't roll this kind — too trivial to test real word-order knowledge.
- Offered for `negativeSentences` only under `includeNegation`, supplementing rather than replacing `negative`/`type-negative` in that lesson's roll pool, since auxiliary-fronting is exactly the word-order change this kind targets.

**Why resolve this before #186 (engine):** the duplicate-word token-id question in particular has a real fork — a token-id-array comparison would force changes to `case 'answer'`, whereas the plain-string-join approach doesn't. Better to settle that before writing `generateWordOrderQuestions`, not discover it mid-implementation.

## 2026-06-17 — #192: wire `generateMatchPairsQuestions` into `createExerciseState`

**Decision:** `createExerciseState` now calls `generateMatchPairsQuestions(resolvedSources, { persons: lesson.persons })` and appends its result to every lesson's queue, except when `lesson.negation` is set (Unit 10's Refresh Gate A and the `unit-5-review-*` lessons) — there the whole point is the `ez`/auxiliary-fronting drill, and a bare person↔form match would dilute it.

**Why automatic rather than a per-lesson flag:** eligibility is already gated inside the generator itself (≥3 in-scope persons, all with distinct forms — see `generateMatchPairsQuestions`'s own guard), so a lesson either has a matchable table or it doesn't; hand-curating a second flag per lesson on top of that would just be a second place the same fact could go stale. The single `lesson.negation` exception is the only case where a table *is* matchable but shouldn't be matched.

**Why mixed into existing lessons instead of a dedicated "match-pairs lesson":** the journey's unit structure (`JOURNEY`/`LESSONS`) is unaffected — no new lesson ids, no `journey.test.js` changes needed. A match-pairs round is one more question *kind* in an existing lesson's queue, like `spot-error` or `pronoun`, not a new unit.

**Scoring:** counts as a single question toward `bestScore`/`totalQuestions`/stars, same as any other kind — no `STORAGE_KEY` bump, since the stored shape (`{ attempts, bestScore, totalQuestions, bestStars, lastPlayed }`) doesn't change.

## 2026-06-17 — #191: `MatchPairsBoard` UI + retry-remount fix for `kind: 'match-pairs'`

**Decision:** Added `MatchTile`/`MatchPairsBoard` (`App.jsx`) to render
`kind: 'match-pairs'` questions (#190): two independently-shuffled columns
(persons, forms) where tapping a left tile then a right tile attempts a
match — a correct pair locks green, an incorrect one flashes red briefly and
clears the selection. `ExerciseScreen`'s answer-area branches on
`question.pairs` ahead of the existing `question.options`/typed-answer
branches. `onComplete` reports `!hadMistake` once every pair is matched,
which `ExerciseScreen` submits as `question.correct` (pass) or `'incomplete'`
(fail) — no changes needed to `isAnswerCorrect`/the generic scoring path.

**Bug found and fixed along the way:** the board originally keyed itself on
`state.queue.length`, which doesn't change when a question is requeued for a
retry (`exerciseReducer`'s `'next'` case pushes the same question to the back
of an unchanged-length queue) — so a retried match-pairs question reused its
already-fully-matched, frozen component state with no way to interact
further. Fixed by having `exerciseReducer` increment a new `attempt` field on
every retry (instead of just setting `retry: true` once) and keying the
board on `${verbId}-${tense}-${attempt}`, so a retry always remounts fresh.

**Testing:** `createExerciseState` doesn't generate `match-pairs` questions
yet (that's #192) and `App.jsx` has no named exports for isolated component
testing, so `App.test.jsx` mocks `generateQuestions` (via `vi.mock` +
`importOriginal`, gated by a test-local flag) to inject a fixed
match-pairs question into a real lesson's queue — covering the full
tap-to-match flow through the actually-rendered app without doing #192's
production wiring early.

## 2026-06-17 — #190: `generateMatchPairsQuestions`/`kind: 'match-pairs'` engine support

**Decision:** Added `generateMatchPairsQuestions(resolvedSources, { persons,
count })` alongside `generateCaseMixerQuestions`/`generateCrossVerbQuestions`
— a `kind: 'match-pairs'` question covers a whole source's table at once
(every in-scope person matched to its form) rather than one person at a
time like every other kind. Eligibility is automatic by table shape: ≥3
in-scope persons, all with distinct forms — no per-lesson opt-in flag.
`correct: 'complete'` is a sentinel string; the UI board itself (landing in
#191) determines success/failure and submits `'complete'`/`'incomplete'`
through the existing `submitAnswer` path, so `isAnswerCorrect`/
`exerciseReducer`'s `case 'answer'` needed no changes.

**Why the `misses`-tracking guard changed from `question.verbId` to
`question.verbId && question.person`:** a missed `match-pairs` question has
no single `person` field (it spans every person in its table), so without
the guard a miss would push a `{ person: undefined }` entry into
`misses`/`errorStats`, corrupting `getWeakSpotQuestions`' per-person lookup.

This is the engine half of #189's match-pairs epic; #191 (UI) and #192
(wiring into `createExerciseState` + docs) land separately per the issue
split.

## 2026-06-17 — #194: repo structure for agent workability (no behavior change)

**Decision:** Four navigability changes, no logic touched:

- Split `docs/DECISIONS.md` at the 25-most-recent-entries mark into this
  active log plus `docs/DECISIONS_ARCHIVE.md` for everything older, since
  `CLAUDE.md` requires reading this file before journey/verb-data changes and
  it had grown to ~3200 lines / 122 entries — the single largest forced read
  for routine work. Picked a flat count (25) over a date cutoff since entry
  density isn't uniform across days.
- Added a one-line `**Status:**` note to the top of each
  `LEARNING_JOURNEY*`/`EXERCISE_*` doc (current/authoritative vs. open
  proposal vs. historical) instead of renaming files or merging them — the
  docs' own prose already cross-references each other reasonably well; the
  missing piece was just a scannable authority signal at the top.
- Added a section-index comment block to the top of `src/App.jsx` listing its
  existing `// ===` banner sections with approximate line numbers, so a
  glance at the top is enough to jump to the right section without scanning.
- Added a one-line "grep for `id: '...'`" locate-by-id note to
  `src/data/verbs.js` and `src/data/lessons.js`, since both are large flat
  data files where most edits target exactly one entry.

**Why no cross-reference rewrite:** many existing `docs/DECISIONS.md`
references elsewhere in the codebase (e.g. "see `docs/DECISIONS.md`,
2026-06-13") now point at entries that live in the archive instead. Left
these as-is — the archive's own header note covers the redirect, and
rewriting every dated cross-reference across the repo to say which of the
two files it's in would be a large, low-value mechanical change orthogonal
to this issue's "don't force a full-file read" goal.

## 2026-06-17 — #174: scope `getBorrowedDistractors` to a review's `sources` when there are 2+

**Decision:** `getBorrowedDistractors` (#139's small-table distractor-floor
top-up) now takes the question's `sources` (a lesson's `{ verbId, tense }[]`)
and, when `sources.length > 1`, restricts its sibling pool to just those
verbs instead of scanning all of `VERBS`. With 0 or 1 `sources`, it still
falls back to the full `verbs` pool — unchanged from before #174.

**Why:** a bare `kind: 'form'` question has no sentence to make a sibling
verb's same-person form read as "wrong" — #121 already enforced this for
`extraCandidates`, but `getBorrowedDistractors` (added later, by #139) was a
separate, still-unscoped path. The repro (#174): `unit-5-review-1` reviews
only `izan`+`ukan`, but its `ni` question for `izan` could still borrow
`egon`'s `nago` — `egon` is `agreementsCompatible` but isn't one of the
review's 2 declared sources, and `egon`/`izan` both gloss as "I am" in
English, so the question reads as two correct answers instead of one
correct + distractors.

**Why not scope single-source lessons too:** an ordinary, non-review lesson
(e.g. `nahi-present`, `jakin-present`) has exactly one declared source — its
own verb — so scoping to `sources` there would mean scoping to nothing
(`getBorrowedDistractors` already excludes the anchor verb itself),
silently dropping the #139 distractor-floor top-up these 3-person tables
were built to rely on. Single-source lessons keep borrowing from the full
`verbs` pool, same as pre-#174 — the ambiguity risk #174 describes is
specific to multi-source reviews where a compatible-but-undeclared sibling
(like `egon`) can sneak in.

**Why this doesn't regress #144's `hi`-drill:** `unit-32-hi-present`/
`unit-32-hi-past` declare exactly the 4 intended siblings (`izan`/`egon`/
`joan`/`etorri`) as `sources`, so scoping to `sources` still yields exactly
those 4 verbs' `hi` forms — the borrowing #144 designed for is preserved
because it was already "in scope" by the lesson's own declaration.

## 2026-06-17 — #171: Unit 30 imperative (agintera), izan/ukan core scope

#171 is a large follow-up to #148 covering five separate deferred areas
(dative potential/conditional, sentence frames, imperative, subjunctive,
causatives). Picked Unit 30's imperative (agintera) as this PR's core scope
since it's the next `pending` unit in journey order and is directly
tabulated in `CONJUGATIONS.md` §9/§16.2 — the rest (N-28/29 dative
paradigms, sentence frames, Unit 31 subjunctive, Units 37-39 causatives)
moved to a follow-up issue.

- **`imperative` is a new tense key** on `izan`/`ukan`, second-person only
  (`hi`/`zu`/`zuek` — no `ni`/`hura`/`gu`/`haiek` cells exist for the
  imperative at all, per §9).
- **`izan`'s `hi` stays a single invariant key** (`hadi`) — `izan`'s `hi` is
  a `NOR` argument, not `NORK`, so there's no allocutive-style gender split
  here (consistent with #144's plain-`hi` convention).
- **`ukan`'s `hi` splits into `hi-m`/`hi-f`** (`ezak`/`ezan`) — here `hi` is
  the grammatical `NORK` subject of "do it!", matching #167's `hi`-as-NORK
  convention exactly.
- **Deferred**: the ditransitive (`iezadazu`) imperative, 3rd-person jussive
  (`beza`/`bitza`) and 1st-person hortative (`dezagun`) forms, the
  plural-object (`-itz-`) column, and `egon`/`etorri`/`joan`'s imperative
  (which §16.2 notes is identical to their present tense — likely a quick
  follow-up, but still new lesson/data work). `izan`/`ukan` aren't
  `agreementsCompatible`, so `unit-30-review` (which pools both) gets no
  cross-verb distractor borrowing — accepted as-is, same call as #167's
  toka/noka review lessons.

## 2026-06-17 — #170: §14 non-finite-form reading items for Unit 36

Added 8 new `kind: 'reading'` items (`reading-nonfinite-*` in
`src/data/readingItems.js`) covering `CONJUGATIONS.md` §14's verbal-noun
suffixes (`-tea`/`-teari`/`-teagatik`/`-teko`/`-tean`), the `-tako`
(attributive) vs. `-a`+`izan` (resultative predicate) participle contrast,
and the `-z` modal/instrumental adverbial — the content #145 deliberately
left out of the original 10-item set. To minimize the risk of subtle errors
in non-finite forms (flagged by #170 itself), every `source` sentence reuses
one of §14's own worked examples verbatim rather than authoring new ones.

Put the new items in a second lesson (`unit-36-reading-nonfinite`) rather
than folding them into `unit-36-reading`, since 10+8 items would make a
single lesson too long — both are added to Unit 36's `lessonIds`. No engine
changes — `generateReadingQuestions`/`READING_ITEMS` already generalize over
arbitrary item lists.

## 2026-06-17 — #167: Hitanoa allocutive register, Units 33/34 + hi-as-NORK gender split (core scope)

Core scope: Units 33 (toka) + 34 (noka) data/lessons, plus item 4 — `ukan`/
`jakin`'s `hi`-as-NORK present-tense gender split. Deferred to a follow-up
issue: Unit 35 (recombination + addressee-gender toggle + "when not to use
hitanoa"), item 5 (wiring a hi/hitanoa row into the distractor matrix — wrong
gender/neutral-form lures), and item 6 (`ibili`'s `hi`-past gap).

1. **Toka/noka modeled as new tense keys, not person keys** —
   `presentToka`/`presentNoka`/`pastToka`/`pastNoka` on `izan`/`ukan`, each a
   `{ hura, haiek }` table. Considered modeling this as gender-suffixed
   person keys (`hura-m`/`hura-f`) instead, but tense keys both follow the
   established generic-tense-key precedent (#148/#162/#164 — `tense` is an
   opaque string key to `generateQuestions`, zero engine changes needed) and
   correctly reflect that the gender dimension here attaches to the
   *addressee* of the utterance, not to the statement's own subject (`hura`/
   `haiek` stays the subject throughout).
2. **Only `hura`/`haiek` are tabulated** — `docs/CONJUGATIONS.md` §10 itself
   only gives these two rows for izan/ukan's toka/noka (no full person grid
   exists in the source), so the data and lessons stay 2-person/binary-choice
   by design, not as a gap. `options.length === 2` is already a precedented,
   tested pattern elsewhere in the suite (e.g. `jakin`'s 2-distractor cases).
3. **No cross-verb borrowing between izan's and ukan's toka/noka** — `izan`
   (`agreement: ['nor']`) and `ukan` (`agreement: ['nor', 'nork']`) are not
   `agreementsCompatible`, so `unit-33-review`/`unit-34-review` pool both
   verbs for spaced repetition but only get within-verb cross-tense
   borrowing (e.g. izan's `pastToka` can lure on an izan `presentToka`
   question), not cross-verb borrowing. Accepted as-is rather than
   engineering a workaround — see item 5 of the follow-up issue for a
   possible distractor-matrix-level fix.
4. **hi-as-NORK's own gender split modeled as `hi-m`/`hi-f` person keys** —
   added to `ukan`'s and `jakin`'s existing `present` tables (`duk`/`dun`,
   `dakik`/`dakin`), matching #144's established `hi`/`hi-m`/`hi-f`
   convention exactly: here the addressee genuinely *is* the grammatical
   NORK argument, unlike toka/noka above. `ukan`'s past stays a single
   unsplit `hi: 'huen'` (CONJUGATIONS.md §3 doesn't split the past here).
   `ukan` and `jakin` *are* `agreementsCompatible`, so `unit-32-hi-nork-
   present` (pooling both) gets real cross-verb distractor borrowing.
5. Linguistic data (the toka/noka tables, especially the past-tense
   `-a-`/`-na-` insertions and the `du`→`di`-stem shift distinguishing
   ukan's toka/noka from hi-as-NORK's own `duk`/`dun`) is flagged in
   `docs/LANGUAGE_DECISIONS.md` for native-speaker/grammar-reference
   confirmation before relying on it pedagogically beyond this app.

## 2026-06-17 — #165: NOR-NORI/NOR-NORI-NORK distractor matrix rows (core scope)

Closes #141's NOR-NORI/NOR-NORI-NORK deferral now that #162/#164 have landed
the plural-object fodder it needed. Two changes to `src/lessonLogic.js`:

1. **Generalized `getCaseFrameSibling`** — dropped the `agreement.includes
   ('nori')` exclusion and changed the matching rule from "both lack `nori`,
   `nork` inverted" to "same `nori` status, `nork` inverted." This is a
   strict generalization (izan/ukan still match exactly as before) that also
   pairs gustatu/iruditu/ahaztu (`nor-nori`) with esan/eman (`nor-nori-nork`)
   — e.g. `gustatzen zait` offered as a "wrong case frame" distractor for
   `esaten diot`, and vice versa. Person keys line up mechanically the same
   way they already did for izan/ukan (different grammatical roles share the
   same person-key space), so no new lookup logic was needed, just a wider
   net.
2. **New `getObjectNumberLure(verb, tense, person)`** — returns
   `verb.conjugations[\`${tense}Plural\`]?.[person]`, i.e. the verb's own
   plural-object form for the same tense/person where one exists (`esaten
   dizkiot` offered alongside `esaten diot`). Covers the matrix's "wrong
   object number" slot for gustatu/iruditu/ahaztu/esan/eman; harmlessly
   `undefined` for every other verb (no `<tense>Plural` table).

Both lures slot into the existing `formLures` array at the same call site
#141 added; the gating condition widened from `tense === 'past' ||
agreement.includes('nork')` to also include `agreement.includes('nori')`, so
NOR-NORI verbs' present/future tenses get lures too (previously only
NOR-NORK present and any past tense did).

**What this does *not* cover, and isn't planned to**: the issue's literal
"Slot 1 = wrong-NORK" / "Slot 2 = wrong-NORI" for NOR-NORI-NORK verbs would
need a same-verb table with the *other* axis varying (e.g. an "esan to zu"
table, or a "zuk eman" table) — `esan`/`eman`'s data model only has one
table each (their axis-fixed slice), so there's no such form to pull from
without authoring an entirely new table per verb. The generalized
case-frame lure above offers a related but distinct trap (missing
NORK-marking entirely, not a same-axis wrong value) as a partial,
honest-about-its-limits substitute. Filed **#177** for: this literal
same-verb cross-axis lure (if ever desired), the future-tense
illegal-voicing non-word safety mechanism, the hi/hitanoa wrong-gender/
neutral-form rows (blocked on #167's gendered toka/noka data), and the mood
rows (blocked on #171's dative-paradigm potential/conditional content).

Added `npm test` coverage in `src/logic.test.js` (`#165 NOR-NORI/NOR-NORI-
NORK distractor matrix rows`) following #141's existing test pattern: direct
unit tests on the two lure functions, plus `generateQuestions` integration
tests asserting the new distractors actually appear in `options`.

## 2026-06-16 — #162: Unit 25 `-zki-` object-number fodder + four extra-practice reviews

Closes #147's deferred scope items 2 and 4. Added `presentPlural`/
`pastPlural`/`futurePlural` conjugation tables to `esan`/`eman` (reusing
#164's tense-key names — zero new `TENSE_META`/i18n entries needed, since
both pairs of verbs describe the same "absolutive `NOR` argument goes
plural" concept) plus `esan-present-plural`/`eman-present-plural` lessons,
proving the generic-tense-key pattern extends to `nor-nori-nork` verbs too.

The issue's four "extra-practice" lesson types (fix-NORI, fix-NORK,
object-number, two-axis recombination) were all built as `review: true`
lessons pooling existing single-axis sources, rather than as a literal 2D
`NORK`×`NORI` table — the current data model only supports one varying
`person` axis per `conjugations` table (the other axis fixed via
`recipient`/`agent`), and adding genuine dual-axis variation within a single
question would require new data structure and new `generateQuestions`
code. The issue itself only requires the *two-axis recombination* lesson to
be recognition-only ("last recognition-first"), which is satisfiable by
pooling `esan`'s NORK-varying source and `eman`'s NORI-varying source into
one recognition review (`unit-25-two-axis-review`) — each individual
question still varies a single axis, but the lesson as a whole recombines
both rather than drilling either in isolation. Pooling for the same reason
on `unit-25-object-number-review` (singular vs. plural object contrast).
`unit-25-fix-nori-review`/`unit-25-fix-nork-review` are plain (non-
recognition) reviews pooling each verb's present+past+future, since those
just reinforce an already-drilled single axis.

Deferred: a true single-question dual-axis "type both the NORK pronoun and
the NORI suffix" lesson kind — no follow-up issue filed for this, since the
issue's own acceptance criteria only ask for a recognition-first two-axis
*review*, which the pooled approach above satisfies; revisit only if a
future issue explicitly asks for production-level dual-axis recombination.

## 2026-06-16 — #164: Unit 23 plural-NOR fodder + extra-practice lessons

Closes #146's deferred scope. Added `presentPlural`/`pastPlural`/`futurePlural`
as new `conjugations`/`TENSE_META` tense keys on `gustatu`/`iruditu`/`ahaztu`
— reusing the existing `generateQuestions`/`describeLesson` machinery
generically (same pattern as #148's `potential`/`baldintza`/`conditional`
keys), so no engine changes were needed. Unit 23 gained three new production
lessons drilling the plural forms directly (`*-present-plural`), plus two
review lessons: `unit-23-number-split-review` (recognition-mode, interleaving
each verb's singular and plural present sources to drill the `zait`-vs-
`zaizkit` contrast) and `unit-23-case-frame-buffer` (production-mode,
mixing all three verbs' singular present to over-learn the case frame ahead
of Unit 25's ditransitive jump) — both built from the existing `review: true`
+ `sources` pooling, no new lesson-engine code required.

Deliberately scoped out: a true side-by-side "pick zait or zaizkit for this
exact sentence" question kind (would need new `kind` handling in
`generateQuestions`/`buildQuestion`, since the engine currently treats each
`(verb, tense, person)` triple as a single fixed answer, not a number choice)
— the interleaved recognition review above drills the same contrast across
separate questions instead, which needs no engine work and is good enough for
now. Also out of scope: dedicated Unit 24 lessons for `pastPlural`/
`futurePlural` (the data exists as distractor fodder for #141's Distractor
Engine Matrix, per the issue's own framing, but #164 only asked for Unit 23's
lessons) — left as data without lessons, same "fodder first, lesson later"
split #141 itself depends on.

## 2026-06-16 — #155: `erosi` re-audit for purchasable-object `validFor` (residual #124 gap)

The #124 `validFor` backfill that shipped to `main` was more conservative than
the alternative drafted in the superseded PR #132: for concrete/purchasable
objects bought by an agentive human subject (book, car, pencil, ticket,
passport, map, house, coffee, water, gift, film, the generic "hori"), it
omitted `erosi` from `validFor`, meaning a correct "I buy X" alternative could
be offered as a wrong distractor. Added `erosi` to `ukan`/`nahi`/`ikusi`'s
matching sentences. Symmetrically, `erosi`'s own sentences for the same
object classes (book, jacket, car, house, ticket, gift, record) were missing
`ukan`/`nahi`/`eduki`/`ikusi` entirely — only `jan` had been considered as a
candidate sibling for `erosi`'s non-food objects, so that gap was closed too.

Left unchanged, with reasoning re-confirmed: kinship objects (sister/brother/
son) and non-agentive subjects (a dog with a bone, a cat with milk, "Etxeak
lorategi bat" — a house "having" a garden) keep `erosi` excluded — none of
"a sister"/the dog/the cat/the house is a plausible buyer in these frames.
`eduki`'s "object in pocket/hand" sentences (key, money, phone, card) also
keep `erosi` excluded — "I buy a key in my pocket" doesn't read as the same
statement as "I have a key in my pocket"; the location modifier doesn't
combine with a buying-event reading. `jakin`'s fact/answer objects aren't
purchasable, so `erosi` was never a candidate there. The confirmed-wrong pairs
(`jan`↔`edan`, `ukan`↔`jakin`, `eduki`↔`jakin`) stay excluded throughout.

## 2026-06-16 — #148: `behar` + Ahalera/Baldintza/Ondorioa (Units 19/28/29, core scope)

The epic's final sub-issue covers N-19 (behar/obligation), N-28 (Ahalera/
potential), N-29 (Baldintza & Ondorioa/conditional), N-30 (imperative), N-31
(subjunctive), and N-37–39 (causatives). Core scope for this PR is N-19/28/29
only — the three new `VERBS` tenses (`potential`, `baldintza`, `conditional`)
and the new `behar` entry are all directly tabulated in
`docs/CONJUGATIONS.md` §2 (`izan`) and §3 (`ukan`, `NOR` = `hura` column),
needing no derivation. N-30/31/37-39 need new mechanics (imperative's
addressee-only person gaps, subjunctive's construction-based recognition,
causative's `-arazi`/`-erazi` conditioning) and are deferred to a follow-up
issue.

`izan`/`ukan`'s three new tenses are **form-only** — no `sentences`/
`pronounSentences`/`negativeSentences` — same choice already made for
`behar`. `generateQuestions` falls back to `kind: 'form'` (plain
multiple-choice over the conjugation table) when a tense has no sentence
data, so this needed zero engine changes; `TENSE_META` additions are
similarly additive only. Sentence frames for these tenses (and for `behar`,
whose complement is an infinitive — "Joan behar dut" — not an object noun,
so #124's noun-object `validFor` tagging doesn't apply as-is) are deferred to
the same follow-up.

`ukan`'s three new tenses omit `hi` (6 persons, matching its existing
`present`/`past`/`future` tables); `izan`'s include `hi` (7 persons, directly
tabulated in CONJUGATIONS.md §2). Both verbs' dative-paradigm potential/
conditional (`gustatu`/`iruditu`/`ahaztu`/`esan`/`eman`, recognition-only per
the journey's own focus text) are deferred — they have zero existing
potential/conditional keys and need a careful pass against §5's ditransitive
Ahalera/Ondorioa grids.

## 2026-06-15 — #145: `kind: 'reading'` comprehension questions (Unit 36, core scope)

**Decision:** Implemented Unit 36 ("Passive & Reading Real Text") as a new
`kind: 'reading'` question type, grounded entirely in CONJUGATIONS.md §15's
"nor-shift" table (`Nik atea ireki dut.` → `Atea ireki da.`, plus its
"impersonal/passive" siblings like `hitz egin`/`erre`/`idatzi`). §14's
non-finite forms are **not** covered — authoring correct non-finite items
without native-speaker verification was judged too risky for a core scope;
deferred to a follow-up issue alongside expanding `READING_ITEMS` beyond its
10 starter items.

**Data shape:** `src/data/readingItems.js` exports `READING_ITEMS`, an array
of `{ id, source, gloss: {en,es,eu}, prompt: {en,es,eu}, options, answer }` —
a Basque `source` sentence, a `gloss` (translation/restatement), a `prompt`
(the comprehension question), and four candidate Basque sentences. Items 1-8
go agent → agentless (anticausative/impersonal nor-shift); items 9-10 go the
other way (agentless → "who does this?"), since both directions appear in
§15's prose examples. `gloss.eu` deliberately repeats `source` verbatim
(a Basque-speaking learner needs no translation of Basque) — `QuestionPrompt`
skips the gloss line when it equals `source`, rather than inventing a
from-scratch Basque paraphrase of each sentence.

**Engine integration:** `generateReadingQuestions` (`lessonLogic.js`) is a new
sibling to `generateCrossVerbQuestions`/`generateCaseMixerQuestions` — takes
`READING_ITEMS`-shaped items and `{ rounds }`, returns `{ kind: 'reading',
itemId, source, gloss, prompt, correct, options }`. `unit-36-reading`
(`data/lessons.js`) is `{ review: true, kind: 'reading', mode: 'recognition',
itemIds: [...] }` — a lesson with neither `verbId` nor `sources`, the first of
its kind. `createExerciseState` (`App.jsx`) special-cases `lesson.kind ===
'reading'` with an early return before the `sources`/cross-verb/case-mixer
machinery (none of which applies — a reading item has no verb/tense/person).
Three other `App.jsx` spots needed guards for a `kind: 'reading'`
lesson/question having no `verbId`/`tense`: `describeLesson` (new top branch,
before the `lesson.sources.map` that assumes pooled/review shape),
`ExerciseScreen`'s `showPreview` (excluded, since `LessonPreviewScreen` needs
a real verb/tense), and `QuestionPrompt` (new early branch rendering
`source`/`gloss`/`prompt` instead of `verb`/`tenseMeta`). `getExplanation`
needed no change — its existing kind-checks already fall through to `null`
without touching `verb` for an unrecognized kind.
`flagQuestionSummary`/`buildFlagDiagnostics` needed only additive guards
(`question.source`). `exerciseReducer` also gained a `question.verbId` guard
before recording a miss, so a missed reading question doesn't add a bogus
`undefined:undefined:undefined` entry to `errorStats`.

## 2026-06-15 — #144: `hi` as a new ungendered person (Unit 32, core scope)

**Decision:** Implemented Unit 32 ("Meet `hi`" — `hi` as a subject in known
paradigms, no allocutivity yet) as #144's core scope, deferring Units 33-35
(toka/noka allocutive forms), `jakin`/`ukan`'s gender-split `hi`-as-`NORK`
present (`dakik`/`dakin`, `duk`/`dun`), and the hi/hitanoa distractor-matrix
row to a follow-up issue (#167).

**Data-shape convention** (resolving #144's central question): `hi` is added
as a plain, **ungendered** person key wherever Basque genuinely has a single
invariant `hi`-as-subject form — `izan`/`egon`/`joan`/`etorri` are `nor`-only,
so `hi` as the absolutive subject takes one form per tense regardless of `hi`'s
own gender (`haiz`/`hago`/`hoa`/`hator`, `hintzen`/`hengoen`/`joan
hintzen`/`etorri hintzen`, CONJUGATIONS.md §1/§6). `hi-m`/`hi-f` keys are
reserved for cells where Basque *does* split by gender — either `hi`-as-`NORK`
present tense (`ukan`'s `duk`/`dun`, `jakin`'s `dakik`/`dakin`, CONJUGATIONS.md
§3) or allocutive (hitanoa) marking on verbs where `hi` isn't even an argument
(§10) — both deferred to #167. This lets #144 add `hi` with zero changes to
`buildOptions`/`generateQuestions`/the UI: it's just a 7th key in
`conjugations`/`pronouns`, like any other person.

`joan`/`etorri`'s `hi` past is the periphrastic `joan hintzen`/`etorri
hintzen` — matching their existing `ni: 'joan nintzen'`/`ni: 'etorri nintzen'`
shape (the "Simple Past" forms, 2026-06-12) — not CONJUGATIONS.md §6's
synthetic literary `hindoan`/`hentorren`, which `VERBS` doesn't use for these
verbs' other persons either.

No `sentences`/`pronounSentences`/`negativeSentences` were added for `hi` —
`hi` questions are always `kind: 'form'` (bare conjugated form). Two new pooled
review lessons (`unit-32-hi-present`/`unit-32-hi-past`, `persons: ['hi']`,
sources = izan/egon/joan/etorri) rely on #139's cross-verb borrowing: each
verb's `hi` question borrows its 3 distractors from the other three verbs' `hi`
forms for that tense — exactly 3 siblings, exactly 3 distractors, no padding
needed. Past-tense questions also pick up #141's cross-tense lure (`haiz`
alongside `hintzen`) automatically.

Unit 32's payload dropped its `jakin` example ("Hik badakik?") since `jakin`
isn't touched by this core scope (its `hi`-as-`NORK` present is gender-split,
deferred to #167).

## 2026-06-15 — #141: Case-frame/cross-tense distractor lures (core scope)

**Decision:** Implemented the Distractor Engine Matrix (`docs/LEARNING_JOURNEY_PROPOSED.md`)
rows implementable with existing `izan`/`ukan` data — NOR-NORK present, past
pools, and the case-marking checkpoint's `pronoun` questions — as a new
**case-frame lure** primitive, deferring NOR-NORI, NOR-NORI-NORK, future,
hi/hitanoa, and the moods with no data yet to a follow-up issue (#165).

`getCaseFrameLure`/`getCaseFramePronounLure` (`lessonLogic.js`) find a verb's
*case-frame-inverse* sibling — same `nori` status, opposite `nork` status
(`izan` <-> `ukan`) — and return that sibling's same-person form/pronoun as a
designated "ergative drift" distractor (`naiz` alongside `dut`, `Nik`
alongside `Ni`). `getCrossTenseLure` returns a past-tense question's own
verb's present-tense form for the same person (`naiz` alongside `nintzen`) —
the matrix's "Past pools" Slot 3. Both are gated by `agreement.includes('nori')`,
so NOR-NORI/NOR-NORI-NORK verbs (#146/#147) never participate until #165.

**Automatic, not opt-in**: `buildOptions` gained a `priorityCandidates` param —
forms guaranteed a distractor slot (ahead of the random same-table pool) when
present and distinct from `correct`, still counting toward the existing
3-distractor cap. `generateQuestions` computes these lures and passes them for
every `form`/`sentence`/`negative`/`pronoun` question where the matrix calls
for one (NOR-NORK present, any verb's past, any non-NOR-NORI verb's `pronoun`
questions) — rather than a new opt-in flag like `mode`/`includeNegation` —
because the acceptance criterion ("each agreement pattern generates
distractors matching its matrix row") reads as a blanket guarantee, and the
lures gracefully no-op (return `undefined`, filtered out) without `verbs` or
for agreement shapes that don't qualify, so existing test fixtures without
`agreement`/`pronouns` are unaffected. One existing #139 fixture
(`incompatibleSibling` in `logic.test.js`) had its `agreement` changed from
`['nor']` to `['nor', 'nori']` to stay genuinely unrelated to its NOR-NORK
anchor under the new case-frame-inverse matching — it was previously *only*
"not agreement-compatible", which #141 now redefines as "case-frame-inverse
and thus a deliberate lure".

## 2026-06-15 — #142: Axis-fixed metadata (`recipient`/`agent`) for future ditransitive verbs

**Decision:** NOR-NORI-NORK (ditransitive) verbs' `conjugations` are genuinely
2D (NORK x NORI), which the existing `conjugations[tense][person]` shape can't
represent directly. Rather than redesign the data model now (no ditransitive
verb exists yet — that's #147's job), added forward-compatible *axis-fixed*
metadata mirroring `nor-nork`'s existing `object: 'hura'`: a ditransitive verb
sets exactly one of `recipient` (fixes NORI, so `person` varies over NORK —
e.g. `recipient: 'hura'` → `diot`/`diozu`/`dio`/... "I/you/he tell *him*") or
`agent` (fixes NORK, so `person` varies over NORI — e.g. `agent: 'ni'` →
`diot`/`dizut`/`diet`/... "I tell him/you/them"). A lesson on such a verb is
thus still a flat `conjugations[tense][person]` table, just with one argument
held constant across the whole table.

Added `getFixedArgument(verb)` (`lessonLogic.js`) to resolve `recipient`/
`agent` into `{ role, person }` (or `null` for every current verb), threaded
it into `generateQuestions`'s per-question `source.fixedArgument`, and added a
`FixedArgumentBadge` (`App.jsx`) that shows e.g. "NORI: hura" — used in
`VerbBadgeRow` (verb preview), `LessonNode` (lesson list), and `QuestionPrompt`
(per-question during exercises), so learners always know which argument is
held fixed. Also extended `agreementsCompatible` to compare `nori`-inclusion
(in addition to the existing `nork` check), so cross-verb distractor borrowing
won't mix ditransitive and non-ditransitive forms once #147 lands.

All of this is currently inert — no `VERBS` entry sets `recipient`/`agent` or
has `nori` in `agreement` — but a `logic.test.js` test loops over any future
ditransitive `VERBS` entries to enforce exactly one fixed argument resolves
correctly, so #147 gets fast feedback if it misses a field.

## 2026-06-15 — #143: Phase II reorder (present-before-past), `ibili`/`hartu` moves, MP staging

**Decision:** Reordered Phase II per `docs/LEARNING_JOURNEY_PROPOSED.md`'s
Stage 3-7 layout: Unit 12 ("Daily Routine (Transitive)" — `jan`/`edan`/`erosi`/
`ikusi`/`hartu` present) now precedes Unit 13 (the `ukan` past pool covering
those same verbs), so every verb's present is taught before its past
(`LEARNING_JOURNEY_EVALUATION.md` finding F8). Similarly, Unit 15 (`eduki`
past) now precedes Unit 16 (`egon` past), keeping `eduki`'s present (Unit 14)
and past (Unit 15) adjacent like Units 12/13. `ibili`'s present moved from
Unit 14 to Unit 6 (alongside `joan`/`etorri`) — its past was already in Unit
11's `izan`-past pool, so it was debuting in the past before the present
(F8); only its `gu`/`zuek`/`haiek` forms still arrive in Unit 14.

**New verb — `hartu` ("to take"):** added to Unit 12's pool to stage the first
`-tzen`/`-ten` minimal pair against `jan`'s `jaten` (`jaten` vs. `hartzen`).
Full periphrastic nor-nork present/past/future tables, regular `-tu`
conjugation. Sentence objects (autobusa/trena/taxia/aterkia/katua/erabakia/
txanda) are deliberately non-food/drink/purchase so `validFor: []` holds
against every other pool verb (jan/edan/erosi/ikusi) without a cross-verb
audit — flagged in `docs/LANGUAGE_DECISIONS.md` for a native-speaker sanity
check of the forms/sentences themselves.

**`-ko`/`-go` MP at Unit 17:** `future-intro-review`/`-plural` (Unit 17) now
include `etorri`'s future alongside `izan`/`ukan`/`joan`, staging `izango`
(-go) vs. `etorriko` (-ko) — `etorri`'s future table already existed for Unit
18's mixer, so this needed no new `VERBS` data.

**Stage regroup — merged rather than split:** The proposed doc gives Phase II
five stages (3: Looking Back I; 4: Daily Actions; 5: Possessions; 6: Location,
past; 7: The Future). Stage numbers are global across the whole journey
(`src/i18n/journeyTranslations.js`'s "Etapa N"/"N. atala" labels), and Phase III's
existing stage is already `phase-3-stage-7` — adding a fifth Phase II stage
would either collide with that id or require renumbering every stage from
Phase III onward (through Phase VI), which is out of scope here. Instead,
Phase II keeps **4** stages: Stage 3 (Unit 11 alone), Stage 4 "Daily Actions"
(Units 12-13), Stage 5 "Possessions & Looking Back II" (Units 14-16, merging
the proposed Stages 5 and 6), Stage 6 "The Future" (Units 17-19, unchanged).
The unit-level reordering — the actual substance of F8's fix — is identical
either way.

**Pronoun-Fading:** already compliant — Phase I lessons use explicit
`pronoun`/`pronounSentences` framings (Stage A) and nothing in Phase II-III
introduces pro-drop yet (Stage C arrives with Phase III, #145/#148). No code
changes needed for this item.

## 2026-06-15 — #140: `mode: 'recognition'` lesson scope

**Decision:** Added an optional `mode: 'recognition'` field to `generateQuestions`
(threaded from a `LESSONS` entry via `createExerciseState`), for the
`docs/LEARNING_JOURNEY_PROPOSED.md` units marked **[R]** (recognition-only) —
the dative potential/conditional (N-28/N-29), ditransitive
imperative/subjunctive (N-30/N-31), the reading unit, and the recognized
`-erazi` variant (N-36). It permanently excludes the production framings
(`type-verb`/`type-pronoun`/`type-negative`) for that lesson's entire
lifetime.

**Relationship to `noTyping`:** `noTyping` (a learner's first attempts at any
lesson) *also* drops `spot-error` — recalling/cross-checking a brand-new form
feels too demanding on a first pass. `mode: 'recognition'` keeps `spot-error`
available, since spotting a wrong form in someone else's sentence is itself a
recognition task, not production — exactly the kind of question an [R] unit
should lean on. Internally both collapse into one `noProduction` flag for the
three typed kinds; `spot-error`'s own gate stays keyed to `noTyping` only.

No stored-progress shape change. `describeLesson` now also returns
`recognitionOnly`, surfaced as a small badge (`recognitionOnly` i18n key) on
`LessonNode` — purely cosmetic, no lesson currently sets `mode: 'recognition'`
until the [R]-tagged units (#148) land.

## 2026-06-15 — #139: distractor-floor fix — borrow distractors/spot-error slots for small tables

**Decision:** `buildOptions` requires 3 distractors to reach the usual
4-option multiple choice, but a 3-person conjugation table (e.g. `nahi`/
`jakin`'s `present`/`future`, and the upcoming N-30 imperative) can only
supply 2 from its own other persons — leaving those questions stuck at 3
options. Fixed by adding a last-resort "borrow pool": when `verbs` (the full
`VERBS` list) is passed to `generateQuestions`, `getBorrowedDistractors`
collects the same-person form from every `agreementsCompatible` sibling verb
(skipping the anchor itself), and `buildOptions` tops up its own-table
distractor pool from that borrow pool only when it's short. `buildOptions`'s
dedup/cap logic is unchanged, so 4+-person tables (which already fill 3
distractors from their own table) are unaffected.

The same gap existed for `spot-error` questions, which require
`personsWithSentences.length >= 4`: `nahi`/`jakin` only have 3 sentenced
persons, so they could never qualify. `getBorrowedSpotErrorSlots` lends a
compatible sibling's own (person, sentence, form, altForms) slots for any
person the anchor doesn't already cover (e.g. `ukan`'s `gu`/`zuek`/`haiek`
beyond `nahi`/`jakin`'s `ni`/`zu`/`hura`), and `buildSpotErrorQuestion` was
rewritten around a uniform "slot" shape so anchor/own/borrowed slots are
interchangeable. `availableKinds`'s spot-error gate now checks
`personsWithSentences.length + borrowedSpotErrorSlots.length >= 4`.

**Scope:** `pronoun`/`type-pronoun` questions deliberately don't borrow —
`verb.pronouns` is a tiny fixed 3-entry table unrelated to other verbs'
conjugations, so there's no sensible sibling pool, and they were already
excluded from `extraCandidates` for the same reason. Both new helpers return
`[]` without `verbs` (or without `agreement` — some minimal test fixtures
omit it), preserving the original same-table-only behaviour exactly.

## 2026-06-15 — #151: 37→39 spine renumber — split old Unit 2 into N-2/N-3/N-4

**Decision:** Completed the 37→39 renumber promised by #137/#138 (the
O-n/P-n → N-n mapping in `docs/LEARNING_JOURNEY_EVALUATION.md`). Old Unit 2
("Having, Wanting, Knowing" — `ukan`+`nahi`+`jakin` all at once) is the single
steepest jump in Phase I (the absolutive→ergative `ni`→`nik` subject shift),
per findings F6/F7, so it's now a three-unit on-ramp:

- **N-2 "The Ergative Leap"** — `ukan` present taught *alone* (object fixed to
  `hura`), with extra practice isolating the `ni`→`nik` shift
  (`ukan-ni-nik-shift-review`). `unit-2-review` is redefined to drill `ukan`
  present only (it previously also covered `nahi`/`jakin`, which moved to N-4).
- **N-3 '"Ni" vs. "Nik" — The Case-Marking Checkpoint"** — zero new verbs;
  drills bare (`izan`/`egon`) vs. ergative (`ukan`) subjects to kill ergative
  `-k` drift at its source. N-3·L2's "spot the drift" framing (recognizing
  `†Nik naiz`-style errors) is implemented with today's case-mixer/verb-choice
  primitives (`generateCaseMixerQuestions`/`generateCrossVerbQuestions`)
  rather than a dedicated error-spotting mechanic — that's deferred to #141.
- **N-4 "Knowing & Wanting"** — `jakin` + `nahi`, reinforcing the same
  ergative suffix family on a fully synthetic verb (`jakin`), plus extra
  practice pairing `jakin` with `ukan` (`jakin-suffix-family-review`).

Old units 3-37 shift +2 to new units 5-39 (gates: P-8/18/25/37 → N-10/20/27/39,
matching #138's `GATE_LESSON_IDS`, derived generically from `gate: true` so it
needed no code changes). Updated `journey.js`, `data/lessons.js` (including its
explanatory "Unit N" comments), `i18n/journeyTranslations.js` (new
`units[2]`/`units[3]`/`units[4]`, re-keyed `units[5..39]`, updated stage 1/2
titles), and `docs/LEARNING_JOURNEY.md` throughout.

**Lesson-id stability:** all pre-existing `LESSONS` ids and `STORAGE_KEY`
(`v1`) are unchanged — `ukan-present`, `jakin-present`, `nahi-present` keep
their ids, just reassigned to different units; only new review-lesson ids
(`ukan-ni-nik-shift-review`, `case-marking-sort-review`,
`case-marking-drift-review`, `case-marking-checkpoint-review`,
`jakin-suffix-family-review`, `knowing-wanting-review`) were added. Existing
player progress survives untouched.

## 2026-06-15 — #138: score-gated Refresh Gate units

**Decision:** `getUnlockedLessonIds` (`src/lessonLogic.js`) now takes an
optional `gateLessonIds` set (`journey.js`'s new `GATE_LESSON_IDS` — the last
`lessonIds` entry of every `available`, `gate: true` unit, currently just
Unit 8's `unit-5-review-3`). For the lesson right after one of these, the
unlock predicate is `bestStars >= GATE_PASS_STARS` (2, i.e. ≥80%) instead of
the usual `attempts > 0`. Everything else (already-unlocked lessons never
re-lock, `?dev=unlock-all`, non-gate progression) is unchanged.

A new `isLockedByGateScore` helper distinguishes "locked, gate not attempted
yet" from "locked, gate attempted but under 80%" — `LessonNode` and
`ProgressTab` show a `gateNeedsScore` prompt ("Score 80% on the Refresh Gate
above to continue", translated in all three languages) only in the latter
case. The gate itself stays fully replayable either way — this is a soft
wall, no lockout and no progress loss, per
`docs/LEARNING_JOURNEY_PROPOSED.md` design principle 4.

Implemented against the foundation as it stands today (37-unit layout from
#137, gates at P-8/18/25/37, only P-8 currently `available`) rather than
#138's issue body, which cites "N-10/20/27/39" — the post-#151 39-unit
numbering for these same four gates (#151 tracks the 37→39 spine renumber).
`GATE_LESSON_IDS` is derived generically from `gate: true`, so it needs no
changes once #151 lands and once P-18/25/37 (→ N-20/27/39) gain `lessonIds`.

## 2026-06-14 — #137: renumbered `JOURNEY` to the 37-unit layout

**Decision:** Rewrote `src/journey.js`'s phases/stages/units to match
`docs/LEARNING_JOURNEY_PROPOSED.md`'s 37-unit layout (the O-n → P-n mapping
from `docs/LEARNING_JOURNEY_EVALUATION.md`), updated `docs/LEARNING_JOURNEY.md`
and `src/i18n/journeyTranslations.js` (es/eu) to match, and marked `gate: true`
on the new Refresh Gate units (8, 18, 25, 37). This is part of epic #149 and
unblocks its other sub-issues (#138-#148).

**Lesson-id stability:** No `LESSONS` ids changed and `STORAGE_KEY` stays
`v1` — only `journey.js`'s unit→`lessonIds` wiring and the explanatory
"Unit N" comments in `src/data/lessons.js` were renumbered to match the new
unit numbers (old 6→7, 7→8, 8→9, 9→10, 10→11, 11→12, 12→13, 13→14, 14→15,
15→16; units 1-5 unchanged). Existing player progress survives untouched.

**Unit 5/6 split deferred:** The proposed split of O-5 "Expansion" into P-5
(absolutive plurals) and P-6 (ergative plurals) is *not* done here — Unit 5
keeps all of O-5's existing `lessonIds` (renamed "Expansion: Absolutive
Plurals", `available`) even though some of that content is ergative-paradigm,
and the new Unit 6 "Expansion: Ergative Plurals" is added as `pending` with no
`lessonIds`. Redistributing the actual lessons between Units 5 and 6 is left to
#143, per #137's "data/labels only, no engine changes" scope.

## 2026-06-14 — #126: retired the pair-level cross-candidate audit artifacts

**Decision:** Removed `scripts/list-cross-candidates.mjs`,
`docs/CROSS_CANDIDATE_REVIEW.md`, `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`,
and `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` — the pair-level audit/triage
workflow (#112-115) that `validFor` (#122-125) supersedes.
`CROSS_CANDIDATE_EXCLUSIONS`/`isCrossCandidateExcluded`/
`sentenceTemplatesCollide` were already removed from `src/lessonLogic.js` by
#123, so this is purely doc/script cleanup — confirmed via grep that nothing
in `src/` or `package.json` referenced the removed script. `docs/DECISIONS.md`
entries that reference these now-removed files/identifiers (the #112-115
history below) are left as-is — they're a historical record of what was
decided and why at the time, not living documentation. `docs/SENTENCE_FRAMES.md`
gained a brief "Status: epic #127 complete" note pointing back here instead
of being rewritten — its schema/call-site sections remain the reference for
`validFor`. This closes out epic #127 (#121-126 all done).

## 2026-06-14 — #124: backfilled `validFor` across the `nor-nork` cluster's sentences

**Decision:** Every `sentences.present`/`negativeSentences.present` variant
for the eight `nor-nork` verbs (`ukan`, `nahi`, `jakin`, `eduki`, `ikusi`,
`jan`, `edan`, `erosi`) is now `{ text, validFor }` — no bare strings left in
those fields for this cluster (`future`/`past` automatically inherit via the
existing by-reference reuse loops in `src/data/verbs.js`). A new coverage
test (`src/logic.test.js`, "validFor coverage for the nor-nork cluster")
enforces this going forward: every `agreement.includes('nork')` verb's
present-tense sentence/negative-sentence variants must have an explicit
`validFor` array (even `[]`), for any future sentence additions.

**Judgment approach** (per `docs/SENTENCE_FRAMES.md`'s worked examples):
candidate siblings for each verb were restricted to #114's confirmed
"both valid" pairs (`ukan`↔`nahi`/`eduki`/`ikusi`, `jakin`↔`ikusi`/`nahi`,
`eduki`↔`nahi`, `jan`/`edan`↔`erosi`) — `jakin`↔`ukan`, `jakin`↔`eduki`, and
`jan`↔`edan` (#114's confirmed-*wrong* pairs) never appear in any `validFor`.
Within those candidate pairs, each sentence was judged on its own object:
concrete/ownable/visible nouns (book, car, key, ticket...) admit the full
candidate set (`ukan`'s `'Nik liburu bat ___.'` → `['nahi','eduki','ikusi']`,
matching the doc's worked example exactly); abstract or non-agentive-subject
sentences admit a narrower set or none (`ukan`'s `'Nik bilera bat ___.'` "I
have a meeting" → `['eduki']` only — `nahi`/`ikusi` don't fit "a meeting";
`'Etxeak lorategi bat ___.'` "the house has a garden" → `['eduki']`, since
`nahi`/`ikusi` need an agentive subject). `jakin`'s candidates split on
whether the object is something you can "see" (`'Nik bidea ___.'`, the way →
`['ikusi']`) vs "want" (`'Nik sekretua ___.'`, a secret → `['nahi']`) vs both
(`'Nik erantzuna ___.'`, the answer → `['ikusi','nahi']`) — the same verb pair
gets different verdicts per sentence, as the doc's "book" vs "time" contrast
intends. `eduki`'s `'[object] poltsikoan/eskuan ___.'` ("in my pocket/hand")
sentences all get `['ukan','ikusi']` (near-synonym "have" plus the audit's
"I see X in my hand" example) but never `nahi` ("I want X in my pocket" reads
oddly). `jan`/`edan`'s food/drink objects all get `['erosi']` ("eat/drink X"
vs "buy X" both natural) except `'Katuak esnea ___.'` (a cat can't be the one
buying milk) → `[]`. `erosi`'s own sentences get `['jan']` only for the
literal food objects (`'Nik ogia ___.'`, `'Zuk sagarrak ___?'`, `'Saltzaileak
fruta ___.'`) — non-food objects (books, cars, houses, jackets, tickets,
gifts, records) get `[]`, since `jan`/`edan` forms don't fit them.
`pronounSentences` was left as-is (bare strings) per
`docs/SENTENCE_FRAMES.md`'s "fields that don't consume `validFor` yet" —
`pronoun`/`type-pronoun` questions don't draw cross-verb candidates, so an
untagged `pronounSentences` entry changes nothing.

**Out of scope:** `ari`/`ibili` (the two `nor`-only verbs not covered by
#125's `izan`/`egon`/`joan`/`etorri` pass) — the original audit found no
"both valid" cases for the `nor` cluster and the migration mapping in
`docs/SENTENCE_FRAMES.md` doesn't list any `ari`/`ibili` pairs, so they're
left untagged (the safe default) and outside the new coverage test's scope
(which only covers `agreement.includes('nork')` verbs).

## 2026-06-14 — #125: rewrote `etorri`'s frameless present/negative sentences to carry a discriminating adjunct

**Decision:** `etorri.sentences.present`'s bare-temporal variants (`'Ni orain
___.'`, `'Hura orain ___.'`, `'Zu bihar ___.'`, etc. — 18 of the 24 present
variants) and two `negativeSentences` entries (`zu`: `'Zu ez ___ bihar.'`,
`hura`: `'Hura ez ___ orain.'`) had no destination, location, or predicate —
`da`/`dago`/`doa`/`dator` were all equally grammatical, exactly the
`'Hura orain ___.'` `verb-choice` ambiguity reported in #127. Each was
rewritten to combine its existing subject/time adverb with an allative `-ra`
destination (`'Hura orain ikastolara ___.'`, `'Zu bihar eskolara ___.'`,
etc.), reusing destinations already established in `joan`/`etorri`'s other
variants (`etxera`, `eskolara`, `lanera`, `dendara`, `hondartzara`,
`liburutegira`, `unibertsitatera`, `parkera`) plus two new ones
(`ikastolara`, `auzora`, `kalera`) for variety. All rewritten variants are now
in the same allative frame as `etorri`'s existing tagged variants, so they get
`validFor: ['joan']` (per `docs/SENTENCE_FRAMES.md` worked example 2) instead
of the `['izan', 'egon', 'joan']` "still ambiguous" marker from #124's
backfill.

**Audit of `izan`/`egon`/`joan` for the same pattern**: none found. Every
`izan` variant is a predicate-nominal frame, every `egon` variant is a
locative `-an`/`-en` frame, and every `joan` variant is already an allative
`-ra` frame (`validFor: ['etorri']`) — all already tagged `validFor: []`/
`['etorri']` with no frameless leftovers. The frameless pattern was isolated
to `etorri`.

**Why:** `validFor: ['izan', 'egon', 'joan']` correctly marked these sentences
as "still ambiguous, don't offer any cross candidate" — but left the
underlying ambiguity in place for a learner answering a `verb-choice`/
`case-mixer` question built around one of them (every `nor`-cluster form would
read as equally correct). Rewriting the sentence itself, rather than
permanently excluding it from being a useful source, is the fix #122 always
intended for this case (`docs/SENTENCE_FRAMES.md` worked example 3).

## 2026-06-14 — Results screen vibrates with a result-tier pattern, with variety per tier

**Decision:** Added `pickResultVibrationPattern`/`vibrateResult` to
`hapticsUtils.js`, called once from a `useEffect` in `LessonResultsScreen`
(keyed on `stars`, so it fires once when the screen first mounts). Each star
band (`computeStars`' 0-3) has its own `navigator.vibrate` pattern(s) — 3-star
bands have several options, picked at random, so a perfect score doesn't
always feel identical; 0-star is a single short, gentle pulse, just enough to
mark "done" without reading as punishment. Same `?.()` no-op-on-unsupported
approach as `vibrateCorrect`/`vibrateIncorrect`.

**Why:** Extends the existing per-answer haptics (2026-06-14, below) to the
lesson conclusion, Duolingo-style — the celebration should be felt as well as
seen/read, and varying it the same way `ENCOURAGEMENT_VARIANTS` and
`createCelebration` already vary keeps repeated perfect scores from feeling
mechanical.

## 2026-06-14 — Compressed the future stage (Stage 6) from four units to two, renumbering the downstream curriculum

**Decision:** Stage 6 ("Talking About the Future") was four near-identical
per-verb drill units (old Units 14-17, "Future Groups A-D", ~32 lessons), each
applying the same `-ko`/`-go` participle rule to three more verbs as
singular/plural practice pairs + a review. Collapsed into two:
- **Unit 14 "The Future Tense"** — introduces the rule on a three-verb core
  spanning both auxiliary patterns (`izan` nor/`naiz`, `ukan` nor-nork/`dut`,
  `joan` motion/`naiz`), full singular/plural + an intro-review pair (8 lessons).
- **Unit 15 "The Future, Across Every Verb"** — the remaining ten verbs
  delivered as themed cross-verb *mixer reviews* (`future-mixer-*`) ending in a
  cumulative capstone, rather than per-verb form drills (8 lessons).

Net: 16 lessons across 2 units, down from ~32 across 4. Every verb is still
covered (three focused in Unit 14, all of them across Unit 15's mixers + the
capstone, which reuses the Unit 14 core).

**Why:** the Basque future is morphologically trivial — one participle rule
layered onto auxiliaries already mastered in Units 1-13 — so four units of
verb-by-verb drilling is vocabulary review dressed as grammar, and repetitive.
Reviews are the engine's *more* varied exercise type (cross-verb "which verb
fits?", case-mixer, the full sentence/typing/spot-error mix, weak-spot
boosters), so a mixer-based Unit 15 is both shorter and less monotonous than
re-drilling each table. `TARGET_EXERCISE_COUNT` self-balances each mixer's
length regardless of how many sources it pools, so the mixers stay ~12
questions.

**Renumbering:** collapsing two unit slots shifted every later unit down by two
(old 18→16 … old 32→30). Updated the live trio (`journey.js`,
`data/lessons.js`, `i18n/journeyTranslations.js` — `journey.test.js` green) and
the forward-looking docs (`LEARNING_JOURNEY.md`, `EXERCISE_ENGINE.md`,
`LANGUAGE_DECISIONS.md`, `EXERCISE_VARIETY_PLAN.md`), plus unit-number mentions
in `src/` comments. The old future lesson ids (`*-future` per-verb practice,
`unit-9-review-1..4`) are replaced by `future-intro-review*` and
`future-mixer-*`.

**This log left on its own (multi-scheme) numbering:** `DECISIONS.md` is a
dated archive where each entry uses the numbering current on its date — and
several entries record explicit old→new renumbering arithmetic (e.g. 2026-06-12
"renumbering Units 7-25 to 10-32") that mechanically renumbering would break
rather than make consistent. So past entries are left as written; this entry is
the authoritative record in the current numbering.

## 2026-06-14 — Answer feedback triggers a short vibration via the Vibration API

**Decision:** Added `src/hapticsUtils.js` (`vibrateCorrect`/`vibrateIncorrect`),
called from `submitAnswer` in `App.jsx` right after `isCorrect` is computed —
a short single pulse for correct, a slightly longer triple pulse for
incorrect. Both just call `navigator.vibrate?.(...)`, so on iOS Safari and
other browsers without the Vibration API it's a silent no-op.

**Why:** Cheap, immediate tactile feedback that reinforces the
correct/incorrect visual state, Duolingo-style. No settings toggle was added —
if it turns out to be annoying on some devices, a mute/haptics setting can be
added later, but it didn't seem worth the UI for a first cut.

