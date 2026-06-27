# Exercise Engine — Requirements for the Learning Journey

**Status: current/authoritative.** Tracks which engine work each journey unit still needs before it can move from `pending` to `available`; update it as units land.

This audits `LEARNING_JOURNEY.md`'s 47-unit sequence (44 currently `available`) against the current
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
  pool as `sentence`/`type-verb`/`spot-error`, gated by (a) the
  `wordOrderSafe: true` opt-in tag (see "Word-order safety" below) and (b) a
  minimum word count — **at least 4 tokens** (post-fill, post-split). Below
  that a cloud degenerates into trivial trial-and-error (a 3-word sentence has
  only 6 permutations) rather than testing word order.
- **Negation interaction**: offered for `negativeSentences` only when
  `includeNegation` is set (same gating `negative`/`type-negative` already
  use), and it **supplements** rather than replaces them — Unit 10's roll
  pool becomes `[negative, type-negative, word-order]` once the negated
  sentence clears the 4-token floor, since auxiliary-fronting is exactly the
  word-order change this kind is best at drilling.

### Word-order safety (`wordOrderSafe`) — resolved
A user flagged that a `word-order` drill marked a grammatically-correct order
wrong: for "Zuek herriko danborrada entzuten duzue goizean", tapping
"...danborrada **goizean** entzuten duzue" is valid Basque (it just shifts the
galdegaia/focus onto *goizean*), but the drill grades against the single
authored string. The root cause: `word-order` was auto-generated from *any*
sentence in the 4–9 word range, and Basque's focus rule lets constituents
compete for the pre-verb slot, so most object-plus-adjunct sentences have more
than one valid order.

Fix: `word-order` generation is now **opt-in and fail-closed**. A sentence
variant only becomes a reorder drill if it carries `wordOrderSafe: true`
(checked in `meetsWordOrderThreshold` alongside the word-count window).
Untagged sentences — the default — keep all their other framings
(`sentence`/`type-verb`/`negative`/…) but never become `word-order`.

The tag is a **curatorial language judgment**, not a claim of strict
grammatical uniqueness. Tag a variant only when its taught/neutral order has
**no reasonable competing arrangement a learner would produce**. In practice
that means:

- **Strongest candidates — negative copula/auxiliary patterns**
  (`[Subject] ez [aux] [predicate]`, e.g. "Ni ez naiz irakaslea"): the
  `ez`+finite-verb sequence is grammatically pinned and the predicate sits
  after it, so there's effectively one order. This is exactly the
  auxiliary-fronting change `word-order` drills best.
- **Avoid tagging** affirmative sentences carrying both an object and a
  separate adjunct (time/place) — those are precisely the
  multiple-valid-order cases the focus rule produces (the danborrada bug).

Two curation passes have run (see `docs/LANGUAGE_DECISIONS.md` for per-verb
rationale and the exact invariants):

1. **Negatives** — single-complement negated sentences ("exactly one
   constituent after the pinned `ez`+aux"): `izan`/`egon`/`ibili`/`ukan`/
   `jakin`/`joan` all persons; `etorri` `ni` only.
2. **Affirmatives** — four-word periphrastic clauses (`[subject] [one
   complement] [participle] [aux]`), excluding `nori` (dative) verbs and any
   sentence with a trailing adjunct (five-plus words): `jan`/`edan`/`erosi`/
   `ikusi`/`hartu`/`ari`/`nahi`/`ukatu`/`itzularazi`/`dantzarazi`.

~212 sentence fillings are now eligible across 17 verbs. Still untagged
(deliberately): five-plus-word affirmatives with a trailing time/place adjunct
(the danborrada ambiguity), synthetic-verb sentences with two complements, and
all `nori` verbs. Expanding to those is a later fluent-reviewed pass, which the
opt-in gate makes safe to grow incrementally.

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

**Update (#350)**: the curriculum wiring landed — Unit 15 ("maite izan,"
journey-numbered after #350's renumber) is the first `LESSONS`/`journey.js`
unit to actually use `objectAxis`, with four single-verb practice lessons
(`ukan`/`maite` × present/past, `vary: 'nor'`/`fixed: 'ni'`) landing on "Maite
zaitut." Scoped to single-verb lessons only: `generateCrossVerbQuestions` (the
pooled-review path) has no `objectAxis` support, and `ikusi` still has no
`*ByObject` table, so neither a review lesson nor `ikusi`'s "distractor
variety" follow-up could be folded in here — both remain open for a future
issue. Landing a real lesson also surfaced a bug `journey.test.js`'s
flat-table assumption couldn't have caught on its own: `hasAmbiguousTypedForm`
(`lessonLogic.js`) indexed `verb.conjugations[tense][person]` directly, which
returns a nested object (not a string) for a 2D table — fixed by routing it
through `resolveObjectAxisTable` too. See `docs/DECISIONS.md` (2026-06-21,
#350) for the full writeup.

**Update (#358)**: extended to the NOR-NORI pairing — `gustatu`/`iruditu`/
`ahaztu` gained `presentByNor`/`pastByNor` (outer-NORI/inner-NOR, mirroring
`ukan`'s outer-NORK/inner-NOR), unlocking non-3rd-person-NOR forms like
"Gustatzen natzaizu?". `resolveObjectAxisTable` needed no change (confirmed
axis-name-agnostic, as #346's design note hoped to eventually check), but
`generateQuestions`'s `fixedArgument` role derivation did: it was hardcoded
to only ever produce `'nork'`/`'nor'`, which would have mis-badged a NOR-NORI
verb's fixed NORI argument as NORK. Generalized to derive the role from
`verb.agreement` instead. Same scope as #347/#350: logic-level test coverage
only, no `LESSONS`/`journey.js` wiring (left for #359). See `docs/DECISIONS.md`
(2026-06-21, #358) for the full writeup.

**Update (#378)**: `ikusi` gained `presentByObject`/`pastByObject`, closing
the "`ikusi` getting the same `*ByObject` treatment" follow-up flagged back
in #347's update above. Unlike `maite`'s single `'maite '` prefix, `ikusi`
needed two distinct prefixes (`'ikusten '` present, `'ikusi '` past) matching
its own existing flat tables' shapes — still generated mechanically from
`ukan.presentByObject`/`pastByObject`, same cross-check convention. Still no
`LESSONS`/`journey.js` wiring: `generateCrossVerbQuestions` still has no
`objectAxis` support (tracked by #380), so pooling `ikusi`'s distractors with
`ukan`/`maite`'s — the actual point of adding a third verb to this axis — has
to wait for that engine work first. See `docs/DECISIONS.md` (2026-06-21,
#378) for the full writeup.

**Update (#379)**: `jan`/`edan`/`erosi`/`hartu` gained `presentByObject`/
`pastByObject` too, same mechanical generation from `ukan`'s base tables with
each verb's own present/past prefix. Surfaced a real bug along the way:
`getDativeOvergenerationLure` (`src/lessonLogic.js`) indexed
`verb.conjugations[tense][person]` directly without going through
`resolveObjectAxisTable` first — the same class of bug #350 fixed in
`hasAmbiguousTypedForm` — which crashed for `erosi`/`hartu` specifically,
since they're the first `dativeOvergeneration: true` verbs to carry a 2D
`*ByObject` table. Fixed by giving it the same `objectAxis` param and
resolution `hasAmbiguousTypedForm` already had. Still no `LESSONS`/
`journey.js` wiring (#380/#381 unchanged). See `docs/DECISIONS.md`
(2026-06-21, #379).

**Update (#380)**: `generateCrossVerbQuestions` (and the
`collectCrossSourceCandidates` helper it shares with
`generateCaseMixerQuestions`) now accepts an optional `objectAxis`
parameter, letting a pooled review mix `objectAxis` verbs'
`presentByObject`/`pastByObject` tables instead of just flat ones — the
engine prerequisite for #381's Unit 15 pooled review. `objectAxis` is one
shared `{ vary, fixed }` applied to every pooled source (matching the
existing lesson-level convention), and resolving through it drops the
sentence/`validFor` requirement entirely (none of these verbs have sentence
data for these tables), threading `fixedArgument` through instead — same
shape `generateQuestions` already produces for a single-verb `objectAxis`
lesson. `generateCaseMixerQuestions` intentionally got no `objectAxis`
support (case-mixer drills nor-vs-nor-nork mismatch, which doesn't apply to
already-nor-nork `objectAxis` verbs). `App.jsx`'s call site still doesn't
pass `lesson.objectAxis` through — deferred to #381. See `docs/DECISIONS.md`
(2026-06-21, #380).

**Update (#435)**: #416 had extended Unit 15's reverse-direction block (NORK
fixed at `hura`/`gu`/`zu`/`zuek`/`haiek`) but scoped it to `ukan`/`maite`
only, leaving that half of the unit wall-to-wall those two verbs. #435 closed
that gap with no engine changes — each remaining NORK value now rotates a
single practice verb per tense across the full seven-verb object-axis set,
and gets its own pooled review (one shared `fixed` per review, same shape
`generateCrossVerbQuestions` already supported since #380).

**Update (#436)**: the seven verbs' `presentByObject`/`pastByObject` literal
tables above (`ukan`/`maite`/`ikusi`/`jan`/`edan`/`erosi`/`hartu`) are gone —
each cell was always `<per-verb prefix> + ukan`'s matching cell, so `verbs.js`
now stores that skeleton once (`OBJECT_AXIS_SKELETONS.edun`, present + past)
plus each verb's `byObjectPrefixes: { present, past }`, composed at read time
by `getComposedTable(verb, tense)` (`lessonLogic.js`). Every consumer that
used to read `verb.conjugations[tense]` for these two tenses
(`generateQuestions`, `collectCrossSourceCandidates`,
`getDativeOvergenerationLure`, `hasAmbiguousTypedForm`, plus the
`journey.test.js`/`logic.test.js` cross-checks) now goes through
`getComposedTable` instead — behavior-preserving by construction, guarded by
`logic.test.js`'s existing #347/#348/#378/#379 composition tests, now
rewritten against `getComposedTable`'s output instead of the literal fields.
The NOR-NORI flat/`byNor` tables and the ditransitive `diot`-family tables
flagged in this issue's follow-up comments are out of scope for this pass —
the composer is intentionally only as axis-generic as this one family needs
today; widening it to those three remaining families is left to a follow-up
(#448).

**Update (#442)**: added `animateObject` (default `true`) to the verb model —
when `false`, `getComposedTable` omits every personal (`ni`/`hi`/`gu`/`zu`/
`zuek`) `nor` cell from a composed `presentByObject`/`pastByObject` table,
keeping only the 3rd-person ones, so a thing-only verb's object axis never
yields (or offers as a distractor) a "[verb] you/me/us" form. Marked on the
six verbs that are unambiguously thing-only/metaphor and have no composed
table yet (`irakurri`/`idatzi`/`argudiatu`/`ondorioztatu`/`planteatu`/
`borobildu`/`saldu`/`galdu`) plus `jario` (gates its future NOR-NORI subject
slot instead, once #441/#448 builds that composer) — all no-ops today, ready
for #443/#441 to pick up. `jan`/`edan` (also named as exceptions in #442) and
the borderline `hartu`/`erosi` were deliberately **not** marked: all four
already have a composed table wired into shipped Unit 15 lessons that drill
personal-`nor` cells for them, so flipping the flag now would silently orphan
those lessons rather than just filter a still-unused one — left to #443's
Unit 15 rework (`hartu`/`erosi`'s call also needs native-speaker confirmation,
tracked in `docs/LANGUAGE_DECISIONS.md`).

**Update (#441)**: Unit 27's NOR-NORI `byNor` axis (`gustatu`/`iruditu`/
`ahaztu`'s `presentByNor`/`pastByNor`, #358/#419) had the same "no pooled
review" gap #380 had already fixed on the NOR-NORK side — widened the pool to
4 verbs by adding `jarraitu.presentByNor`/`pastByNor` (literal tables,
matching the existing per-verb-prefix-over-shared-cells pattern `gustatu`/
`iruditu`/`ahaztu` already use — not composed, since `getComposedTable` still
only handles the NOR-NORK `byObject` axis), and added one pooled
`generateCrossVerbQuestions`/`objectAxis` review per `nori` value per tense
(12 lessons total). `jario` stays excluded (thing-NOR, #442); its
`animateObject: false` flag still has no live effect on this axis until #448
extends the composer to `byNor`.

**Update (#444)**: the imperative twin of #441 — Unit 35's `imperativeByNor`
axis (`gustatu`/`iruditu`/`ahaztu`, #364/#425) had the same 18-single-verb-
lesson/no-pooled-review shape. Added `jarraitu.imperativeByNor` (same literal-
table, prefix-swapped pattern as #441's `presentByNor`/`pastByNor` — not
composed, same `getComposedTable` limitation) as the axis's 4th pool member,
and one pooled review per NORI value (`imperative-axis-review-{zu,ni,hura,gu,
zuek,haiek}`, 6 lessons — this axis has no past/present split to double the
count). `jario` stays excluded, same reasoning as #441.

**Update (#443)**: widened Unit 15's NOR-NORK object-axis pool from 7 verbs to
~37 — every periphrastic transitive verb in `VERBS` that had no
`byObjectPrefixes` yet got one (prefix derived from the verb's own flat
`present.ni`/`past.ni`, per #436's composition scheme — no new literal
tables), `animateObject: false` where the personal-object reading is
nonsensical for the verb's modeled sense, and a `sources` entry in every one
of Unit 15's 12 pooled reviews. No engine changes — #380's `objectAxis`
pooling already drops a thing-only verb's personal-`nor` cells from a
review's candidate pool, exactly the case this was built for. `jan`/`edan`/
`erosi`/`hartu`'s long-open `animateObject` question (`docs/LANGUAGE_DECISIONS.md`,
2026-06-24) is still unresolved — see `docs/DECISIONS.md`'s #443 entry for why.

**Update (#445)**: the Baldintza/Ondorioa twin of #441/#444 — Unit 33's
`baldintzaByNor`/`conditionalByNor`/`conditionalPastByNor` axes (`gustatu`/
`iruditu`/`ahaztu`, #425) had the same 54-single-verb-lesson/no-pooled-review
shape (3 verbs × 3 moods × 6 NORI values). Added `jarraitu.baldintzaByNor`/
`conditionalByNor`/`conditionalPastByNor` (same literal-table, prefix-swapped
pattern as #441/#444 — not composed, same `getComposedTable` limitation,
still tracked as #448's follow-up) as the axis's 4th pool member, and 18
pooled reviews (one per mood per NORI value: `baldintza-axis-review-*`,
`conditional-axis-review-*`, `conditional-past-axis-review-*`), replacing all
54 single-verb lessons. `jario` stays excluded, same reasoning as #441/#444.

**Update (#446)**: the Ahalera (potential) twin of #441/#444/#445 — Unit 32's
`potentialByNor`/`potentialAlegiazkoaByNor`/`potentialLehenaldiaByNor` axes
(`gustatu`/`iruditu`/`ahaztu`, #425) had the same 54-single-verb-lesson/
no-pooled-review shape (3 verbs × 3 sub-tenses × 6 NORI values). Added
`jarraitu.potentialByNor`/`potentialAlegiazkoaByNor`/`potentialLehenaldiaByNor`
(same literal-table, prefix-swapped pattern as #441/#444/#445 — not composed,
same `getComposedTable` limitation, still tracked as #448's follow-up) as the
axis's 4th pool member, and 18 pooled reviews (one per sub-tense per NORI
value: `potential-axis-review-*`, `potential-alegiazkoa-axis-review-*`,
`potential-lehenaldia-axis-review-*`), replacing all 54 single-verb lessons.
`jario` stays excluded, same reasoning as #441/#444/#445.

**Update (#448)**: extended `getComposedTable` to the three table families
#436 deliberately left out of scope — NOR-NORI flat `present`/`past`/`future`,
NOR-NORI `presentByNor`/`pastByNor`, and the ditransitive NOR-NORI-NORK
`present`/`past`/`future`. `gustatu`/`iruditu`/`ahaztu`/`jarraitu`'s flat and
`byNor` tables now compose from a `byNoriPrefixes: { present, past, future }`
field against `OBJECT_AXIS_SKELETONS.dativeIzan`/`dativeIzanByNor`, the same
shared-skeleton-plus-per-verb-prefix scheme `byObjectPrefixes` uses. The
ditransitive family (`esan`/`eman`/`saldu-dative`/`utzi-dative`/
`adierazi-dative`/`eskatu-dative`/`galdetu-dative`) composes from a
`ditransitivePrefixes: { present, past, future }` field against
`OBJECT_AXIS_SKELETONS.diot`, resolved through `getFixedArgument`/
`resolveObjectAxisTable` (whichever of NORI/NORK the verb fixes via its
`recipient`/`agent` field becomes the table's fixed cell; the other varies).
`jario` stays a literal table on purpose — fully irregular/suppletive, no
shared skeleton to decompose against (matches #442's note that it gates
rather than composes). Every remaining direct `verb.conjugations[tense]`
read for these tenses — `lessonLogic.js`'s lure/distractor helpers,
`App.jsx`'s `ConjugationTable`, `logic.test.js`'s assertions, and (a genuinely
new finding, not part of #436's original call-site list)
`scripts/validforGapAudit.mjs`'s `computeGapSlots` — now goes through
`getComposedTable` instead. One non-obvious follow-up bug this surfaced: the
`sentences.future`/`.past` reuse-by-reference fallback loops at the bottom of
`verbs.js` keyed their "does this verb have a future/past?" check off
`verb.conjugations.future`/`.past` directly — once those collapsed to `{}`
for the composed verbs, the loops silently stopped firing, dropping `esan`'s
(and siblings') future/past example sentences entirely. Fixed by routing that
check through a small `verbHasComposedTense` helper that also checks
`byNoriPrefixes`/`ditransitivePrefixes`; `npm test`'s validFor-gap-audit
baseline (`scripts/validfor-gap-baseline.json`) needed no regeneration once
this was fixed — the gap counts came back byte-identical to the pre-#448
baseline, confirming the composer is fully behavior-preserving.

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

### Allocutive register / `hi` (Units 39–41) — resolved (#144, #167)
Hitanoa posed two data-shape questions; both are resolved and shipped:

1. **`hi`-as-subject's own gender split** (`hi`-as-NORK present —
   `ukan`'s `duk`/`dun`, `jakin`'s `dakik`/`dakin`) is modeled as separate
   person-like keys, `hi-m`/`hi-f`, alongside plain `hi`. Fits the existing
   shape with zero engine changes — `hi` is just a 7th person key (#144),
   and `hi-m`/`hi-f` are two more (#167 item 4).
2. **Toka/noka** — gender of the *addressee*, on statements where `hi` may
   not even be an argument — is modeled as **new tense keys**
   (`presentToka`/`presentNoka`/`pastToka`/`pastNoka`), not gender-suffixed
   person keys, because the gender dimension attaches to who's being
   addressed, not to the statement's own subject (`hura`/`haiek` stay the
   subject throughout). This follows the established generic-tense-key
   precedent (#148/#162/#164): `tense` is an opaque string key to
   `generateQuestions`, so a new tense needs zero engine changes — just a
   new `VERBS` table entry and `TENSE_META` row. Implemented for
   `izan`/`ukan`, `hura`/`haiek` only (CONJUGATIONS.md §10's own source
   tables are binary, not a gap), shipped as Units 39–40 (#167).

Unit 41 ("Hitanoa Recombined" — mixed toka/noka chosen by addressee gender,
plus "when not to use it") is pure curriculum/content on top of this
already-resolved shape — no further data-shape decision blocks it. What
remains open, tracked separately and not blocking Unit 41's content: **#213**
(a hi/hitanoa wrong-gender/neutral-form distractor-matrix row, blocked on
native-speaker confirmation of the toka/noka data) and a learner-facing
addressee-gender *selection* control for Unit 41 — a UI-state question, not a
data-shape one, since toka/noka already exist as two directly-selectable
tense values.

### Subjunctive constructions (Unit 37 — Subjuntiboa) — resolved (#406)
#369 frames this as construction-based (matrix verb + subordinate clause:
final/purpose, volitional via `nahi izan`, indirect commands —
CONJUGATIONS.md §16.3) and #406 asked whether it needs a new "context-selected
question type" mechanic, possibly shared with hitanoa (#212/Unit 41). It
doesn't, on either count:

- **No new engine mechanic.** Same generic-tense-key precedent used for
  toka/noka (#148/#162/#164/#167) applies directly: subjunctive is just new
  tense keys (e.g. `subjunctivePresent`; a synthetic ditransitive
  `NOR-NORI-NORK` *past* is only added where CONJUGATIONS.md §16.1 actually
  tabulates one — it explicitly doesn't, "an honest gap over an unverifiable
  form," not a gap to engineer around). `generateQuestions`/`buildOptions`/
  `isAnswerCorrect` already treat `tense` as an opaque string key, so this
  needs zero changes.
- **The construction/trigger lives in the sentence text, not a new field.**
  A purpose clause, a `nahi izan` volitional clause, and an indirect command
  with `-(e)la` are three different *sentences* a hand-author writes into
  that tense's `sentences[person]` entry — exactly how every other tense
  already encodes whatever real-world context its examples describe; no
  tense has ever needed a separate "context type" tag. `validFor` keeps
  policing cross-verb safety per `docs/SENTENCE_FRAMES.md`, unchanged.
- **Question shape/rendering: unchanged.** A subjunctive `sentence`-kind
  question is mechanically indistinguishable from any other tense's
  `sentence` question — `QuestionPrompt` keys off `question.sentence`
  generically, not off a list of tenses or kinds. No new `kind` is needed.

### Causative constructions (Units 42-44) — resolved and shipped (#370)
#370 flagged the causative (`-arazi`) as "the most structurally distinct
chunk… likely to need its own data-shape thinking (a causative wraps an
*existing* verb's conjugation rather than being a standalone paradigm)."
`docs/CONJUGATIONS.md` §17 (added researching #370) resolved the *engine*
side of that worry; the `VERBS` data-shape question was resolved during
implementation (see `docs/DECISIONS.md`'s 2026-06-24 `#370` entry):

- **No new engine mechanic, same reasoning as subjunctive above.** A
  causativized stem (`idatzarazi`, `itzularazi`) conjugates with the
  *already-existing* `ukan`/`ukan`-dative auxiliary paradigms (§3/§5) — it's
  an ordinary periphrastic verb on a derived stem, not a new paradigm shape.
  `generateQuestions`/`buildOptions` don't care what produced a verb's
  `conjugations[tense][person]` string.
- **Data placement: standalone `VERBS` entries, not a `derivedFrom` wrapper.**
  Each causative (`itzularazi`, `dantzarazi`, `janarazi`, `idatzarazi`) is its
  own ordinary `VERBS` entry with `type: 'periphrastic'`, the same shape every
  other verb uses — no `baseVerbId` pointer or nested `causative: {...}`
  sub-table was needed. Either shape would have slotted into the existing
  `kind: 'form'`/`'sentence'` machinery unchanged; the standalone-entry shape
  won because it required zero new code paths.
- **Distractors: the existing `grounded` invariant already covers it**
  (`docs/DISTRACTOR_STRATEGY.md` §4.3) — a subjunctive sentence question has
  a grounding sentence, so siblings drawn into `options` go through the
  normal `validFor` check like any other sentence-kind tense. Per #369's
  scope, the NOR/NOR-NORK 3rd-person in-construction forms get full
  production while the dative/ditransitive families stay recognition-only
  (`recognitionOnly: true`, #330) — their much smaller `validFor`-review
  surface (`docs/DISTRACTOR_STRATEGY.md` §3) is a curriculum-scoping choice,
  not an engine one.

So the premise that hitanoa and subjunctive need a *shared* new mechanic
doesn't hold once each is examined on its own: hitanoa's data-shape question
was already resolved and shipped (#144/#167), and subjunctive needs no
data-shape decision at all — it fits the one-tense-key-per-construction
pattern every other tense already uses. Both units can proceed independently
as ordinary Tier 1 content work; see `docs/DECISIONS.md`'s #406 entry.

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
7. **Allocutive/hitanoa shape** — resolved and shipped (#144/#167, Units
   39–40); Unit 41 is content-only from here.
8. **Reading/non-finite question kind** — Unit 36, done for the
   nor-shift/passive half (#145); §14 non-finite forms remain a follow-up.
9. **Subjunctive constructions** — Unit 37, resolved (#406): no data-shape
   or mechanic decision blocks it, content-only from here.
10. **Causative constructions** — Units 42-44, resolved and shipped (#370):
    no new mechanic needed; causatives are standalone `VERBS` entries (not a
    `derivedFrom`-wrapper shape) — content-only from here.
11. **Flash drills / error-pattern detection** — separate design passes,
    whenever prioritized; not blocking any specific unit.
