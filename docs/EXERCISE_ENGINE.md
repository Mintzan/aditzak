# Exercise Engine — Requirements for the Learning Journey

This audits `LEARNING_JOURNEY.md`'s 22-unit sequence against the current
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
  3 distractors.
- **`LESSONS`** is 100% statically derived from `VERBS` (`App.jsx:209-222`):
  one practice lesson per (verb × tense), a verb-review once a verb has 2+
  tenses, and a trailing mixed-review once there's more than one verb.
- **Unlocking** (`getUnlockedLessonIds`, `lessonLogic.js:77-86`) is "previous
  lesson has ≥1 attempt" — no score check.
- **Progress** (`STORAGE_KEY = 'aditzak:progress:v1'`) stores
  `{ attempts, bestScore, totalQuestions, bestStars, lastPlayed }` per lesson
  id — aggregate, not per-question.

## Tier 1 — data-only, no engine changes

These units fit the existing `[tense][person]` shape as long as the new
`VERBS`/tense entries are written out as plain strings, same as today's
`present`/`past`:

- **Units 1–4, 7–8, 12–14** (present/past for `izan`/`egon`/`ukan`/`joan`/
  `etorri`/`ari`/`eduki`/`ibili`, periphrastic past, imperfective-past
  motion): all single-axis `nor` or `nor-nork`(object-fixed) tables, exactly
  like today's `izan`/`ukan`.
- **Units 9–10 (Geroa, future)**: `conjugations.future[person] = 'joango naiz'`
  etc. — a new tense *key*, not a new shape. The "participle-formation rule"
  the journey doc calls out is a content-authoring concern (how the strings
  are derived), not a code concern.
- **Unit 15 (NOR-NORI present — `gustatu`/`iruditu`/`ahaztu`)**: confirmed
  against `CONJUGATIONS.md` §4 — these grids are NORI-rows × NOR-columns, and
  the `NOR=hura` column (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`) is
  exactly one form per *NORI* person. So `person` here means "to whom", and
  `conjugations[tense][person]` already fits with `agreement: ['nor', 'nori']`
  (badge support already exists, `App.jsx:167-171`) and `object: 'hura'`.
  `pronouns`/`pronounSentences` just need dative-declined pronouns
  (`niri`/`zuri`/...) — same shape, new strings.
- **Units 18–19 (Ahalera/Baldintza/Ondorioa for `izan`/`ukan`)**: same as
  Geroa — new tense keys (`potential`, `conditional`, ...) with full strings.

None of these need a `STORAGE_KEY` bump — `recordResult`/`computeStars`
operate on aggregate scores, indifferent to what's inside a lesson's question
pool.

## Tier 2 — small, localized engine changes

### `buildOptions`'s distractor floor
`buildOptions` (`lessonLogic.js:135-139`) takes `.slice(0, 3)` distractors,
implicitly assuming ≥4 persons in the table. **Unit 20's imperative**
(`hi`/`zu`/`zuek`-only — 3 persons, the open question flagged in
`DECISIONS.md`'s 2026-06-10 entry) breaks this: only 2 distractors available,
so multiple-choice questions would show 3 options instead of 4. Fix is local
to `buildOptions` (and `buildSpotErrorQuestion`'s `personsWithSentences.length
>= 4` check, `lessonLogic.js:213`): either render fewer options when the table
is small, or let distractors borrow forms from a sibling table (e.g. a
different verb's imperative). Worth deciding once, since any future
small-table verb hits the same wall.

### Phase I's 3-person horizon (Units 1–6)
`LEARNING_JOURNEY.md` already names the two options:

- **(a) Data-only**: `izan`/`ukan`/etc.'s `conjugations.present` literally
  contain only `ni`/`zu`/`hura` keys until Unit 6 adds `gu`/`zuek`/`haiek` to
  the *same* objects. Zero code changes; `generateQuestions` already builds
  "one question per key". The cost: a verb's table grows after the fact, and
  Unit 6 retroactively changes the distractor pool for lessons learners may
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

**Resolved as (a) + (b)**: Unit 6 was implemented via (a) — `izan`/`egon`/
`ukan`/`joan`/`etorri`'s `present` tables grew from 3 to 6 persons in place.
That cascaded the 6-person grid into those verbs' pre-Unit-6 lessons too, so
(b)'s `persons` filter was added afterward and applied to just those lessons
to restore the 3-person horizon where the journey still calls for it — see
`docs/DECISIONS.md`, "Restored Phase I's 3-person pacing" (2026-06-12).

### Score-gating Refresh Gates B and beyond (Units 11, 17, Phase V wrap)
`getUnlockedLessonIds` only checks `attempts > 0`. The journey doc's "must
pass with high accuracy" framing for Unit 11 needs it to also check
`bestScore / totalQuestions` (or `bestStars`) against a threshold for lessons
flagged e.g. `gate: true`. Two product decisions, deliberately left open by
the journey doc:

1. **Threshold** — e.g. `bestStars >= 2` (≥80%, per `computeStars`)?
2. **Retry behavior on fail** — does the next lesson simply stay locked until
   a passing attempt (learner can keep retrying the gate), or is there an
   explicit "you need Xpct to continue" message state?

No stored-shape change either way — `bestStars`/`bestScore`/`totalQuestions`
are already recorded per lesson; `getUnlockedLessonIds` just reads them with a
different predicate for gate lessons.

## Tier 3 — new data shapes / new question kinds

### Negation drills (Unit 5 / Refresh Gate A)
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
- **Refresh Gate C (Unit 17)** is described as drilling the *same* kind of
  "candidate full sentences, pick the right/wrong one" exercise but for
  NOR/NORI/NORK role-swaps instead of negation — likely reuses this same new
  question-kind machinery once it exists, with a different sentence-pair
  source (role-swapped rather than negated).

### Ditransitive NOR-NORI-NORK (Unit 16 — `esan`/`eman`)
Confirmed against `CONJUGATIONS.md` §5: these are genuinely **2D** grids
(NORI rows × NORK columns), unlike Unit 15's NORI-only grids. The journey
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
the person-restriction question above.

### Allocutive register / `hi` (Unit 21)
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

Given Unit 21 is late in the sequence (Phase V) this can be deferred, but it's
the second data-shape question (after ditransitives) that doesn't fit
"one string per `[tense][person]` cell".

### Non-finite forms & passive/"nor-shift" (Unit 22)
Explicitly **recognition-oriented** ("reading real sentences"), not
production — doesn't fit `conjugations[tense][person]` at all (there's no
single "correct conjugated form" being drilled). Needs its own data table
(source sentence + gloss/translation + what's being asked about it) and a new
question kind, e.g. `kind: 'reading'`: "what does this sentence mean?" or
"which version of this sentence is the nor-shifted/passive one?", multiple
choice over translations or sentence variants. This is the least-shaped of
all the gaps — closest in spirit to `spot-error`/the negation kind (candidate
full sentences as options) but the *prompt* is a translation/comprehension
question rather than "find the verb form", so `QuestionPrompt`
(`App.jsx:726-744`) likely needs a new branch too.

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
  confusion a live issue — i.e. not before Unit 16/17 content exists to
  generate that confusion.

## Suggested build order

Roughly cheapest-and-most-unblocking first:

1. **Tier 1 content** (Units 1–4, 7–8, 9–10, 12–15, 18–19) — can start
   immediately, no engine work.
2. **Person-restriction decision** (Phase I) — must be settled *before*
   Unit 1's `VERBS` entries are written, since it determines their shape.
3. **`buildOptions` distractor-floor fix** — small, unblocks Unit 20
   (imperative) and removes a latent landmine for any future small table.
4. **Negation question kind** — unblocks Unit 5 (Gate A); Gate C (17) likely
   reuses the same machinery later.
5. **Score-gating** — needed before Gate B (11), independent of the above.
6. **Ditransitive data-shape decision** — needed before Unit 16.
7. **Allocutive/hitanoa shape** — Unit 21, can be deferred until Phase V.
8. **Reading/non-finite question kind** — Unit 22, last in the sequence.
9. **Flash drills / error-pattern detection** — separate design passes,
   whenever prioritized; not blocking any specific unit.
