# Exercise Engine — Requirements for the Learning Journey

**Status: current/authoritative.** Tracks which engine work each journey unit still needs before it can move from `pending` to `available`; update it as units land.

This audits `LEARNING_JOURNEY.md`'s 32-unit sequence against the current
exercise engine (`generateQuestions`/`exerciseReducer` in `lessonLogic.js`,
`LESSONS`/`VERBS` and the screen components in `App.jsx`) and sorts the gaps
by how much engine work each needs. It supersedes the scattered "Data &
architecture implications" notes in `LEARNING_JOURNEY.md` with a single
unit-by-unit pass, and expands its "App engine logic" design notes with
concrete touch points. Nothing here is a decision — it's the map needed to
make those decisions deliberately, one at a time, as each unit comes up for
implementation.

## The engine today, in brief

- **One axis per conjugation table.** `verb.conjugations[tense][person]` is a
  single string, where `person` is whichever argument the lesson varies —
  the absolutive subject for `izan`/`egon` (`agreement: ['nor']`), the
  ergative subject for `ukan` with its absolutive object fixed
  (`agreement: ['nor', 'nork']`, `object: 'hura'`). `sentences`,
  `pronouns`, and `pronounSentences` follow the same `[tense][person]` shape.
- **Six question kinds**, all derived from that one table plus the optional
  sentence/pronoun tables (`generateQuestions`, `lessonLogic.js:200-239`):
  `form`, `sentence`, `spot-error`, `pronoun`, `type-verb`, `type-pronoun`.
  `spot-error` needs ≥4 persons with sentence data; the multiple-choice kinds
  need ≥4 persons total so `buildOptions` (`lessonLogic.js:135-139`) can pick
  3 distractors. Two further kinds exist outside `generateQuestions`: `kind:
  'reading'` (`generateReadingQuestions`, Unit 36 only) and `kind:
  'match-pairs'` (`generateMatchPairsQuestions`) — a whole-table round, not a
  per-person one, mixed into a lesson's queue by `createExerciseState`
  whenever a source has ≥3 in-scope persons with distinct forms, except on
  `lesson.negation` lessons (Unit 10's Refresh Gate A and the
  `unit-5-review-*` lessons), where it would dilute the `ez`/auxiliary-
  fronting drill.
- **`LESSONS`** is 100% statically derived from `VERBS` (`App.jsx:209-222`):
  one practice lesson per (verb × tense), a verb-review once a verb has 2+
  tenses, and a trailing mixed-review once there's more than one verb.
- **Unlocking** (`getUnlockedLessonIds`, `lessonLogic.js`) is "previous lesson
  has ≥1 attempt" — *except* when the previous lesson is a `gate: true` unit's
  final lesson (`journey.js`'s `GATE_LESSON_IDS`), which additionally needs
  `bestStars >= GATE_PASS_STARS` (2). Score-gating (see "Tier 2" below) is
  implemented and generic — any unit just needs `gate: true` plus
  `lessonIds`.
- **Progress** (`STORAGE_KEY = 'aditzak:progress:v1'`) stores
  `{ attempts, bestScore, totalQuestions, bestStars, lastPlayed }` per lesson
  id — aggregate, not per-question.

## Tier 1 — data-only, no engine changes

These units fit the existing `[tense][person]` shape as long as the new
`VERBS`/tense entries are written out as plain strings, same as today's
`present`/`past`:

- **Units 1–5, 8–13, 19** (present/past for `izan`/`egon`/`ukan`/`joan`/
  `etorri`/`ikusi`/`ari`/`jan`/`edan`/`erosi`/`eduki`/`ibili`, periphrastic
  past, imperfective-past motion): all single-axis `nor` or
  `nor-nork`(object-fixed) tables, exactly like today's `izan`/`ukan`.
- **Units 14–16 (Geroa, future + `behar`)**: `conjugations.future[person] =
  'joango naiz'` etc. — a new tense *key*, not a new shape. The
  "participle-formation rule" the journey doc calls out is a content-authoring
  concern (how the strings are derived), not a code concern. The future is
  taught across Units 14-15 (the rule once, then a cross-verb mixer) plus Unit
  16 (`behar`+`ukan`) — a grouping/sizing concern, not a code concern either.
- **Unit 20 (NOR-NORI present — `gustatu`/`iruditu`/`ahaztu`)**: confirmed
  against `CONJUGATIONS.md` §4 — these grids are NORI-rows × NOR-columns, and
  the `NOR=hura` column (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`) is
  exactly one form per *NORI* person. So `person` here means "to whom", and
  `conjugations[tense][person]` already fits with `agreement: ['nor', 'nori']`
  (badge support already exists, `App.jsx:167-171`) and `object: 'hura'`.
  `pronouns`/`pronounSentences` just need dative-declined pronouns
  (`niri`/`zuri`/...) — same shape, new strings.
- **Units 23–24 (Ahalera/Baldintza/Ondorioa for `izan`/`ukan`)**: same as
  Geroa — new tense keys (`potential`, `conditional`, ...) with full strings.

None of these need a `STORAGE_KEY` bump — `recordResult`/`computeStars`
operate on aggregate scores, indifferent to what's inside a lesson's question
pool.

## Tier 2 — small, localized engine changes

### `buildOptions`'s distractor floor
`buildOptions` (`lessonLogic.js:135-139`) takes `.slice(0, 3)` distractors,
implicitly assuming ≥4 persons in the table. **Unit 25's imperative**
(`hi`/`zu`/`zuek`-only — 3 persons, the open question flagged in
`DECISIONS.md`'s 2026-06-10 entry) breaks this: only 2 distractors available,
so multiple-choice questions would show 3 options instead of 4. Fix is local
to `buildOptions` (and `buildSpotErrorQuestion`'s `personsWithSentences.length
>= 4` check, `lessonLogic.js:213`): either render fewer options when the table
is small, or let distractors borrow forms from a sibling table (e.g. a
different verb's imperative). Worth deciding once, since any future
small-table verb hits the same wall.

### Phase I's 3-person horizon (Units 1–7)
`LEARNING_JOURNEY.md` already names the two options:

- **(a) Data-only**: `izan`/`ukan`/etc.'s `conjugations.present` literally
  contain only `ni`/`zu`/`hura` keys until Unit 7 adds `gu`/`zuek`/`haiek` to
  the *same* objects. Zero code changes; `generateQuestions` already builds
  "one question per key". The cost: a verb's table grows after the fact, and
  Unit 7 retroactively changes the distractor pool for lessons learners may
  have already 3-starred (izan-present, ukan-present, etc.) — not a stored-
  shape change (no `STORAGE_KEY` bump needed, same as the earlier `zu`-row
  retrofit), but worth a `DECISIONS.md` note when it happens since it's the
  kind of "existing lesson's content silently changes" thing this log exists
  to track.
- **(b) `persons` filter**: lessons gain an optional `persons: ['ni','zu','hura']`
  field; `generateQuestions`, `buildOptions`, and `buildSpotErrorQuestion`
  filter `persons`/`personsWithSentences` against it. More code (three
  functions touched) but keeps `VERBS` tables complete from the start and
  makes "this lesson only drills these persons" reusable for other partial-grid
  needs later (e.g. if a future verb's table has gaps).

This is the single highest-leverage open decision — it shapes how *every*
Phase I verb entry gets authored, so it should be settled before Unit 1's
`VERBS` data is written, not discovered partway through.

**Resolved as (a) + (b)**: Unit 7 (the "Expansion" gate, predating this
redesign's renumbering — implemented as old "Unit 6") was implemented via (a)
— `izan`/`egon`/`ukan`/`joan`/`etorri`'s `present` tables grew from 3 to 6
persons in place. That cascaded the 6-person grid into those verbs'
pre-Expansion lessons too, so (b)'s `persons` filter was added afterward and
applied to just those lessons to restore the 3-person horizon where the
journey still calls for it — see `docs/DECISIONS.md`, "Restored Phase I's
3-person pacing" (2026-06-12).

### Score-gating Refresh Gates B and beyond — ✅ implemented
`getUnlockedLessonIds` checks `bestStars >= GATE_PASS_STARS` (2, ≥80% per
`computeStars`) for any lesson whose previous lesson is in `GATE_LESSON_IDS`
(every `gate: true` unit's last `lessonIds` entry) — generic, no per-unit
code. Retry behavior: the gate stays a "soft wall" — already-unlocked lessons
never re-lock, the gate lesson itself stays replayable, and the next lesson
just shows a "needs 80% to continue" prompt until a passing attempt. No
stored-shape change was needed — `bestStars`/`bestScore`/`totalQuestions` were
already recorded per lesson. First used for Gate A (Units 5/6) and Gate B
(Unit 20).

## Tier 3 — new data shapes / new question kinds

### Negation drills (Unit 6 / Refresh Gate A)
Basque negation fronts the auxiliary (`Mutila etorri da` → `Mutila ez da
etorri`) — a word-order change, not a single `___` substitution, so it doesn't
fit `sentences`/`type-verb`. Needs:

- A `negativeSentences`-shaped table (mirroring `pronounSentences`'s
  `[tense][person] -> string` shape, but holding the *negative* form of each
  sentence already in `sentences`).
- A new question kind — closest existing analog is `spot-error`: present
  several fully-formed sentences (some correctly negated, one with the
  auxiliary in the wrong place or un-negated) and ask which is right/wrong.
  Because `spot-error` already renders `question.items` as ready-made
  sentence options (`App.jsx:730-744`, `QUESTION_PROMPTS['spot-error']`), a
  `kind: 'negate'` (or similar) sibling can likely reuse that same rendering
  path — the new work is mostly in `generateQuestions` (a
  `buildNegationQuestion` alongside `buildSpotErrorQuestion`) plus the new
  `negativeSentences` data per verb/tense/person.
- **Refresh Gate C (Unit 22)** is described as drilling the *same* kind of
  "candidate full sentences, pick the right/wrong one" exercise but for
  NOR/NORI/NORK role-swaps instead of negation — likely reuses this same new
  question-kind machinery once it exists, with a different sentence-pair
  source (role-swapped rather than negated). The Exercise Variety Plan's
  Delivery 3 shipped a narrower NOR-vs-NOR-NORK piece of this
  (`generateCaseMixerQuestions`, `kind: 'case-mixer'` — multiple-choice, not
  this `spot-error`-style mechanism) as a general review-lesson mechanism, but
  deliberately left Unit 22 itself `pending`: its full NOR/NORI/NORK scope
  needs Units 20-21's dative verbs, which don't exist yet. See
  `docs/DECISIONS.md` (2026-06-13, Delivery 3).

### Word-order question contract (#185 — resolved)
`kind: 'word-order'`: the learner taps a shuffled "cloud" of a sentence's
words back into order. Resolved per the design questions raised in #185:

- **Source sentence**: either `sentences[tense][person]` or
  `negativeSentences[tense][person]`, filled the same way `sentence`/
  `negative` already do — `sentence.text.replace('___', table[person])`.
- **Tokenization**: naive `text.split(' ')`, after stripping a trailing `.`
  or `?` (#214) and carrying it separately as `punctuation` — without that,
  it glues onto the last word and becomes something the learner has to
  account for when tapping the order, which isn't part of what this
  exercise tests. `WordOrderBoard` (`App.jsx`) renders `punctuation` as a
  fixed mark right after the assembled tokens rather than dropping it, so
  the displayed sentence still reads as complete.
- **Duplicate words**: tokens are built as `{ id, text }` pairs at
  question-build time (`tokens: shuffle(words.map((text, id) => ({ id,
  text })))`), so two instances of the same word stay distinguishable to the
  UI even though their `text` is identical.
- **Question shape**: `{ ...source, kind: 'word-order', person, tokens,
  correct: fullSentenceText, punctuation }`. `correct` stays a plain,
  punctuation-less string — the UI submits `tappedTokens.map(t =>
  t.text).join(' ')` through the existing `submitAnswer`, so
  `isAnswerCorrect`/`exerciseReducer`'s `case 'answer'` need **zero
  changes**.
- **Retry behavior**: reshuffles. Follows the precedent `MatchPairsBoard`
  set (#191) — rather than the engine re-shuffling `tokens` on the same
  queue item, the UI does its own local shuffle keyed off
  `question.attempt` (the retry counter `exerciseReducer`'s `'next'` case
  already increments), so a missed word-order question gets a fresh cloud
  layout on retry instead of showing the exact same wrong arrangement
  twice — same reasoning as a frozen match-pairs board being a worse retry
  experience than a reshuffled one.
- **Kind-pool gating**: competes in the same `rollQuestionKind(availableKinds)`
  pool as `sentence`/`type-verb`/`spot-error`, gated by a minimum word
  count — **at least 4 tokens** (post-fill, post-split). Below that a cloud
  degenerates into trivial trial-and-error (a 3-word sentence has only 6
  permutations) rather than testing word order.
- **Negation interaction**: offered for `negativeSentences` only when
  `includeNegation` is set (same gating `negative`/`type-negative` already
  use), and it **supplements** rather than replaces them — Unit 10's roll
  pool becomes `[negative, type-negative, word-order]` once the negated
  sentence clears the 4-token floor, since auxiliary-fronting is exactly the
  word-order change this kind is best at drilling.

### NOR-NORK object axis (#346 — resolved)
`ukan`'s `present` table only varied the ergative (NORK) subject against a
fixed absolutive (NOR) object (`object: 'hura'`), so the engine could only
drill "I have it" (`dut`), never "I have you" (`zaitut`). Chose option **(b)
real 2D table**, per the issue's own recommendation:

- `verb.conjugations[tense]` can now optionally be a 2D table, `{ [nork]: {
  [nor]: form } }`, opt-in per verb/tense — `ukan` gained a sibling
  `presentByObject` tense (`TENSE_META.presentByObject`) alongside its
  existing flat `present`, rather than replacing it, so nothing already
  drilling `present` changes shape.
- A new pure function, `resolveObjectAxisTable(table2D, { vary, fixed })`
  (`lessonLogic.js`), collapses the 2D table to an ordinary flat `{ [person]:
  form }` table for whichever axis a lesson wants to drill (`vary: 'nor'`
  holds the subject fixed and varies the object, or vice versa), dropping any
  cell that's missing (the reflexive/impossible cells below).
- `generateQuestions` takes a new `objectAxis: { vary, fixed }` option: when
  set, it resolves the table via `resolveObjectAxisTable` *before* any other
  logic runs, and derives `fixedArgument` from `objectAxis` instead of
  `getFixedArgument(verb)`. Crucially, **`buildOptions`/`buildTaggedOptions`
  needed zero changes** — once the table is flat, distractor-building is
  axis-agnostic by construction. This is a deliberate deviation from the
  issue's suggested touch points (which expected `buildOptions` to also need
  updating for a 2D distractor pool); resolving to flat upfront made that
  unnecessary. See `docs/DECISIONS.md` (2026-06-21) for the full reasoning.
- **Gap cells**: not just the literal reflexive diagonal (nik→ni, guk→gu,
  zuk→zu, zuek→zuek) as the issue text describes, but whole same-person-
  category blocks per `CONJUGATIONS.md` §3's `*(refl.)*` markings — e.g. nik
  excludes both `ni` *and* `gu` as objects, zuk excludes both `zu` *and*
  `zuek`. No hark/haiek (3rd person) cells are excluded. `ukan.presentByObject`
  was transcribed from that authoritative grid, not the issue's simplified
  description, and cross-checked against the existing flat `present` table
  (`presentByObject[nork].hura === present[nork]` for all six norks).
- **Scope**: this lands the engine/data/test support the issue's "Done when"
  checklist asks for, but does **not** wire a `LESSONS`/`journey.js` entry —
  `journey.test.js` cross-checks that every `lesson.persons` entry exists as
  a key in `verb.conjugations[lesson.tense]`, which for a 2D table are `nork`
  values rather than the drilled axis's persons, so a curriculum lesson would
  need either a `journey.test.js` update or lesson-level axis-aware
  resolution before that check could pass. Left for whichever future issue
  actually adds an object-axis unit to the journey.

**Update (#347)**: `ukan` gained the matching `pastByObject` 2D table (same
shape/sourcing, from `CONJUGATIONS.md` §3's past grid), still form-only (no
`sentences`) and still without a `LESSONS` entry. Turns out "no `LESSONS`
entry" isn't quite as inert as #346's scope note assumed: `ProgressTab`
(`App.jsx`) renders every `LESSONS` item unconditionally, regardless of
whether a `journey.js` unit references it, and `getUnlockedLessonIds`'s
linear-progression check depends on array order/position — so an orphan
`LESSONS` entry would show up in the Progress tab and could perturb
unlocking, not just dangle harmlessly. #347's "exercises the new axis" bar
was instead met with a logic-level test exercising the real `ukan` data
through `generateQuestions` (`src/logic.test.js`), leaving an actual
`LESSONS`/`journey.js` lesson for whichever issue does the curriculum wiring
(`ikusi` getting the same `*ByObject` treatment, for distractor variety, is
flagged as a further follow-up rather than folded in here).

### Ditransitive NOR-NORI-NORK (Unit 21 — `esan`/`eman`)
Confirmed against `CONJUGATIONS.md` §5: these are genuinely **2D** grids
(NORI rows × NORK columns), unlike Unit 20's NORI-only grids. The journey
doc's examples vary *both* axes ("I give it to you" = nork=ni,nori=zu vs "you
tell it to him" = nork=zu,nori=hura). `conjugations[tense][person]` can't
represent that with a single `person` key. Two ways forward:

- **(a) Fix one axis, vary the other** — same pattern as `ukan`'s
  `object: 'hura'`: pick a fixed NORI (e.g. always "to you", `zuri`) and let
  `person` vary over NORK only, same as every other verb so far. Minimal —
  just a new fixed-argument metadata field (e.g. `recipient: 'zu'`) alongside
  `object`. Loses some of the "communication & giving" payoff variety the
  journey doc's examples show, but needs no engine change.
- **(b) Real 2D table** — `conjugations[tense]` becomes `{ [nork]: { [nori]:
  form } }` for these verbs. Touches `generateQuestions` (which axis does
  "one question per X" iterate?), `buildOptions` (distractor pool is now 2D),
  `tensesOf`/`LESSONS` derivation (still one lesson per verb×tense, but the
  question-count changes), and `describeLesson`/badges (NOR-NORI-NORK badge
  support already exists via `AGREEMENT_META`, `App.jsx:167-171`, but the UI
  would need to show *which* NORI is in play per question).

(a) is far cheaper and should be the default unless (b)'s richer drilling is
judged worth the cost — flagged here as the decision point, same posture as
the person-restriction question above. **Update (#346):** the NOR-NORK case
above shipped (b) for a 2-argument verb via the "resolve 2D to flat before
`generateQuestions`'s other logic runs" pattern. The same pattern generalizes
to this 3-argument NOR-NORI-NORK case in principle — `conjugations[tense]`
would become `{ [nork]: { [nori]: form } }` (NOR fixed, as it already is for
Unit 21's planned scope) and a `resolveObjectAxisTable`-like helper would
collapse it to a flat `{ [nori]: form }` or `{ [nork]: form }` table before
`generateQuestions` runs — `buildOptions` still wouldn't need changes. The
remaining open question for Unit 21 specifically is the *UI* surfacing of
"which NORI is in play per question" (`describeLesson`/badges), which #346's
NOR-NORK case sidesteps since it never shipped a curriculum lesson.

### Allocutive register / `hi` (Unit 26)
Hitanoa adds an **addressee-gender** dimension (masc./fem. `-k`/`-n` forms)
that the current model has no slot for — `conjugations[tense][person]` cells
are plain strings, and `isAnswerCorrect`/`buildOptions` assume one correct
string per cell. Two shapes to choose between:

- Treat masc./fem. as **separate person-like keys** (e.g. `hi-m`/`hi-f`),
  each a normal string cell with their own `PERSON_LABELS` entries — fits the
  existing shape with zero logic changes, at the cost of `hi` effectively
  becoming two table rows.
- Make `conjugations[tense].hi = { masc: '...', fem: '...' }` and add a
  learner-facing "addressee gender" toggle/setting that
  `generateQuestions`/`buildOptions` read when resolving `hi`'s cell — more
  faithful to "one person, two registers", but touches the table-reading code
  in several places (`generateQuestions`, `buildOptions`,
  `buildSpotErrorQuestion`) and adds new UI state.

Given Unit 26 is late in the sequence (Phase V) this can be deferred, but it's
the second data-shape question (after ditransitives) that doesn't fit
"one string per `[tense][person]` cell".

### Non-finite forms & passive/"nor-shift" (Unit 36) — done (#145, core scope)
Implemented as `kind: 'reading'` (`generateReadingQuestions` in
`lessonLogic.js`, items in `src/data/readingItems.js`, Unit 36 now
`available`). Recognition-only, multiple choice over candidate sentences —
"which sentence says the same thing without naming who did it?" /
"which sentence names who does this?", grounded in CONJUGATIONS.md §15's
nor-shift table. §14's non-finite forms are **not** covered (deferred to a
follow-up issue, see `docs/DECISIONS.md`) — only the nor-shift/passive half of
this gap is closed.

## Tier 4 — structural engine work (explicitly out of the unit sequence)

`LEARNING_JOURNEY.md`'s "App engine logic — design notes" section already
flags both of these as deserving their own design pass; restated here with
concrete touch points so they're not lost:

- **Periodic flash drills**: `LESSONS` would gain a *dynamic* element — a
  synthetic `review`-shaped lesson generated at runtime from `progress`'s
  lowest-`bestScore` entries, injected every ~5 lessons and gating the next
  static lesson. Touches `LESSONS` derivation (currently a pure function of
  `VERBS`, `App.jsx:209-222`), `getUnlockedLessonIds` (needs to recognize/
  generate this dynamic id), and `createExerciseState` (needs `progress` as
  an input, which it currently isn't).
- **Ergative-suffix-drift detection**: requires per-question *error
  categorization* — `exerciseReducer`'s `answer` action
  (`lessonLogic.js:250-262`) only records right/wrong. Distractors would need
  metadata tagging *why* each wrong option is wrong (e.g.
  `{ form, errorType: 'ergative-on-intransitive' }` instead of a bare
  string), `buildOptions` would need to attach that metadata, and `App`/
  `exerciseReducer` would need to track a rolling error-type history across
  questions to decide when to inject a remedial mini-lesson. The journey doc
  suggests this becomes relevant once Phase IV/Gate C makes NOR/NORK/NORI
  confusion a live issue — i.e. not before Unit 20/21 content exists to
  generate that confusion.
  - ✅ **Per-question half done ([C2]/#229).** `buildOptions` now tags lure
    distractors with `{ form, errorType }` and surfaces an
    `optionRationale: { [form]: { errorType, whyKey } }` map on the question;
    `FeedbackBar` shows the matching localized "why this was wrong" line when
    the learner's wrong pick is a tagged lure. The rolling *cross-question*
    error-pattern history and remedial-mini-lesson injection described above
    are still open — #229 was deliberately scoped to per-question feedback
    only (see `docs/DISTRACTOR_STRATEGY.md` §4.4).

## Suggested build order

Roughly cheapest-and-most-unblocking first:

1. **Tier 1 content** (Units 1–5, 8–16, 20, 23–24) — can start
   immediately, no engine work.
2. **Person-restriction decision** (Phase I) — resolved, see "Phase I's
   3-person horizon" above.
3. **`buildOptions` distractor-floor fix** — small, unblocks Unit 25
   (imperative) and removes a latent landmine for any future small table.
4. **Negation question kind** — resolved for Unit 6 (Gate A); Gate C (22)
   likely reuses the same machinery later.
5. **Score-gating** — needed before Gate B (17), independent of the above.
6. **Ditransitive data-shape decision** — needed before Unit 21.
7. **Allocutive/hitanoa shape** — Unit 26, can be deferred until Phase V.
8. **Reading/non-finite question kind** — Unit 36, done for the
   nor-shift/passive half (#145); §14 non-finite forms remain a follow-up.
9. **Flash drills / error-pattern detection** — separate design passes,
   whenever prioritized; not blocking any specific unit.
