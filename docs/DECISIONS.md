# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

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

## 2026-06-14 — #123: `lessonLogic.js` rebuilt around per-sentence `validFor`

**Decision:** Implemented #122's schema. `normalizeSentence(value)` turns a
bare string into `{ text }` (`validFor: undefined`) and passes a `{ text,
validFor }` object through unchanged. `filterExtraCandidates(candidates,
validFor)` is the single chokepoint both `extraCandidates` (the `sentence`/
`negative` cases in `generateQuestions`) and `collectCrossSourceCandidates`
(`verb-choice`/`case-mixer`) go through to decide which sibling forms survive.
`getCrossVerbCandidates` now returns `{ [person]: Array<{ verbId, form }> }`
(was `string[]`) so callers have the `verbId` to check against a sentence's
`validFor`. `sentenceTemplatesCollide`, `CROSS_CANDIDATE_EXCLUSIONS`, and
`isCrossCandidateExcluded` are removed — their job is now done per-sentence by
`validFor`.

**Semantics (correcting #122's entry below, which had this backwards):**
`validFor` *absent* (a not-yet-tagged bare string) is the safe default and
excludes every sibling; `validFor: []` is the vetted, maximally-permissive
state and excludes nothing; `validFor: ['x', ...]` excludes only those
siblings. #122's entry below says "bare strings still accepted as
`validFor: []`" — that was an error (echoed, inconsistently, in #123's own
issue body). The implemented behaviour follows #122's design-doc prose and
#123's algorithm spec (point 2), and `docs/SENTENCE_FRAMES.md` has been
corrected to match.

**Why:** Until #124 backfills `validFor` across `VERBS`, every real sentence
is still an untagged bare string, so `extraCandidates`/`crossVerbQuestions`/
`caseMixerQuestions` are now empty everywhere (verified across all 26 reviews:
0 cross-verb/case-mixer questions, no question with fewer than 2 options) —
expected and temporary, the safe default working as designed. #124 restores
variety by tagging real sentences.

## 2026-06-14 — #122: per-sentence `validFor` tag replaces pair-level cross-candidate exclusions

**Decision:** `docs/SENTENCE_FRAMES.md` documents a new `validFor: string[]`
field on each `sentences`/`pronounSentences`/`negativeSentences` variant
(`{ text, validFor }`, replacing today's bare string/string-array shape,
with bare strings still accepted as `validFor: []`). It lists sibling verb
ids whose same-person form would *also* correctly complete that exact
sentence — `[]` means no `agreementsCompatible` sibling fits, the
maximally-discriminating case. One field is consumed identically by both
`extraCandidates` (`sentence`/`negative`) and `verb-choice`/`case-mixer`
candidate pools — the old `'always'`/`'verb-choice-only'` two-tier split in
`CROSS_CANDIDATE_EXCLUSIONS` is dropped (it had zero `'verb-choice-only'`
entries, so nothing is lost).

**Why:** correctness depends on the *sentence*, not the *verb pair* —
`ukan`'s `'Nik liburu bat ___.'` ("book") makes `nahi`/`eduki`/`ikusi`'s forms
all valid, but a hypothetical `'Nik denbora ___.'` ("time") wouldn't, even
though both are `ukan` sentences and both pairs are `'always'`-excluded today.
Conversely, `etorri`'s `'Hura orain ___.'` has *no* sentence-level fix at the
pair level — every `nor`-cluster verb's form fits because the sentence itself
has no discriminating adjunct; `validFor` makes "this sentence can't usefully
discriminate" an explicit, taggable state (and #125 rewrites that sentence
rather than tagging it). Pure design issue — no `src/` runtime or data changes
here; #123 reimplements `lessonLogic.js` around this schema, #124 backfills
`VERBS`, #125 fixes `etorri`'s frameless variants, #126 retires the
pair-level system.

## 2026-06-14 — #121: `kind: 'form'` questions are exempt from `extraCandidates`

**Decision:** `generateQuestions`'s `default` (`kind: 'form'`) branch in
`lessonLogic.js` no longer passes `extraCandidates` into `buildOptions` — its
options are always same-table "other person" distractors only, same as
`pronoun`/`type-pronoun`.

**Why:** `kind: 'form'` is a bare "Zein forma da zuzena?" question with no
sentence. The `nor`-cluster "safe to mix" reasoning in
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` relied on each verb's *sentence* having
a distinguishing adjunct that makes a sibling verb's form read as wrong in
context — with no sentence at all, a sibling's same-person form (e.g.
`egon`'s `gaude`/`dago` offered for an `izan` "gu"/"hura" question) is simply
a second correct answer, not a distractor. The audit's "where this is not a
problem" section exempted `pronoun`/`type-pronoun` for the same reason but
missed `form` — this closes that gap. `sentence`/`negative` keep
`extraCandidates`, since they have a sentence to anchor the judgment.

## 2026-06-14 — Scroll-to-last-lesson aligns to top instead of centering

**Decision:** Changed the initial-load scroll behavior in `HomeScreen`
(`App.jsx`) from `scrollIntoView({ block: 'center' })` to
`scrollIntoView({ block: 'start' })`, and added a `scroll-mt-20` class to
`LessonNode`'s button so the target lesson lands just below the sticky
header instead of underneath it.

**Why:** Centering the last-played lesson left only ~1-2 upcoming lessons
visible below the fold, often with one of them clipped. Aligning it to the
top of the viewport (with the scroll margin to clear the header) surfaces
several more upcoming lessons — including locked/"pending" ones — giving
the learner a preview of what's coming next.

## 2026-06-14 — `?dev=unlock-all` query param bypasses lesson unlocking

**Decision:** `getUnlockedLessonIds` (`lessonLogic.js`) now takes an optional
`search` param (defaulting to `window.location.search`) — if it contains
`dev=unlock-all`, every lesson in `LESSONS` is returned as unlocked,
short-circuiting the normal "previous lesson attempted" check entirely.

**Why:** useful for trying out/demoing any lesson (e.g. ones deep in the
journey) without grinding through prerequisites first. A query param needs no
routing/server config (unlike a path segment, which would 404 on GitHub
Pages without a SPA fallback) and requires no UI — kept deliberately
undocumented/no toggle, since it's a developer convenience, not a feature for
learners.

## 2026-06-14 — #114: pair-level triage of Tier 1 + `joan`↔`etorri`, expanded `CROSS_CANDIDATE_EXCLUSIONS`

Following the `ukan`↔`nahi` fix (below), the maintainer reviewed one
representative example sentence per remaining `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`
Tier 1 pair plus the flagged `joan`↔`etorri` (Tier 2) — a pair-level review
rather than ticking all ~2100 individual `docs/CROSS_CANDIDATE_REVIEW.md`
entries, since `CROSS_CANDIDATE_EXCLUSIONS` operates at pair granularity and a
verdict for one example sentence generalizes to every tense/person/template
for that pair.

**Confirmed "both valid", added to `CROSS_CANDIDATE_EXCLUSIONS`** (all
`'always'`, both directions): `eduki`↔`ukan` ("have/hold" vs "have" —
maintainer: "interchangeable"), `eduki`↔`ikusi`, `ukan`↔`ikusi`,
`jakin`↔`ikusi`, `ikusi`↔`nahi`, `jakin`↔`nahi`, `eduki`↔`nahi`, `jan`↔`erosi`,
`edan`↔`erosi` (consumption verbs — "eat/drink X" vs "buy X", both sensible
for the same object), and `joan`↔`etorri` (`nor`-only — "Ane etxera dator"
"coming to" vs "Ane etxera doa" "going to", same allative adjunct, opposite
direction — maintainer: "it is correct").

**Checked and NOT excluded** (confirmed genuinely-wrong distractors, no
`CROSS_CANDIDATE_EXCLUSIONS` entry): `ukan`↔`jakin` ("Anek auto bat daki" —
"Anek knows a car" — maintainer: "makes no sense"), `eduki`↔`jakin`
("...eskuan daki" — "...knows in hand" — "makes no sense"), `jan`↔`edan`
("Anek entsalada edango du" — "Anek will drink salad" — "doesn't make
semantic sense").

Ticked all 330 newly-resolved `docs/CROSS_CANDIDATE_REVIEW.md` entries (plus
the 20 from the `ukan`↔`nahi` pass, 350 total) via a small one-off script
(`/tmp/tick_pairs.mjs`, not committed) that matches entries by `{verbA, verbB}`
set membership and appends a "Resolved by #114" note — same approach as the
manual `ukan`↔`nahi` edits, just scripted given the volume.

Verified no regression: re-ran the option-pool-size check across all review
lessons (all `roll` values 0-0.95) before/after — unique "fewer than 3 options"
cases went from 85 to 76 (net improvement, some pairs gained a 3rd option
elsewhere), no new 0/1-option cases. `npm test`/`lint`/`build` all pass (214
tests).

Remaining: rest of Tier 2 (`izan`↔`egon`/`etorri`/`joan`, `*`↔`ari`/`ibili`)
and Tier 3 (`case-mixer` pairs) are un-triaged — the audit didn't flag these as
likely "both valid", so they're lower priority; see
`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`'s "Remaining work".

## 2026-06-13 — #114: added `CROSS_CANDIDATE_EXCLUSIONS`, scoped to the confirmed `ukan`↔`nahi` pair

#114 (Layer 2b/3 of `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`) is blocked on a
native-speaker triage of `docs/CROSS_CANDIDATE_REVIEW.md`'s ~2100 entries
(`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`), which hasn't happened yet. But a
live instance of the bug was reported (screenshot of mintzan.github.io):
`nahi`'s `hura` sentence "Katuak esne pixka bat ___." (correct `nahi du`, "the
cat wants some milk") offered `ukan`'s `du` ("the cat has some milk") as a
distractor — also valid Basque, just a different meaning. This is the
`ukan`↔`nahi` pair already double-confirmed by the audit (the literal-template
instance was fixed by #112; this is the same pair's non-literal instances).

Rather than wait for the full triage, implemented just this one pair now:
`CROSS_CANDIDATE_EXCLUSIONS` (`src/lessonLogic.js`) is a curated
`{ [verbId]: { [siblingVerbId]: 'always' | 'verb-choice-only' } }` table,
checked via `isCrossCandidateExcluded(verbId, siblingVerbId, context)` from
both `getCrossVerbCandidates` (`extraCandidates`) and
`collectCrossSourceCandidates` (`verb-choice`/`case-mixer`). Currently holds
only `ukan: { nahi: 'always' }` / `nahi: { ukan: 'always' }`. Ticked the 20
corresponding `docs/CROSS_CANDIDATE_REVIEW.md` entries (1865-1872, 2090-2101)
as resolved.

The other Tier 1 pairs (`eduki`↔`ukan`, `eduki`↔`ikusi`, `jakin`↔`nahi`, etc.)
and the flagged `joan`↔`etorri` (Tier 2) remain unimplemented — they're
plausible per the audit's reasoning but not yet confirmed by an in-the-wild
report or a native speaker, so encoding them now would be guessing at
exclusions per #114's own caution. `CROSS_CANDIDATE_EXCLUSIONS`'s table shape
is designed to take more entries cheaply once those are confirmed.

## 2026-06-13 — Fixed a pre-existing crash in cross-verb question generation for "pool"-shaped lessons

While building #113's triage script (below), `getIntroducedSources` crashed
`generateCrossVerbQuestions`/`generateCaseMixerQuestions` for 7 review lessons
(`unit-8-review`, `unit-8-review-plural`, `egon-past-review`,
`egon-past-plural-review`, `eduki-past-review`, `eduki-past-plural-review`,
`unit-9-review-2-plural`) — all `review: true` with `sources.length < 3`, so
`createExerciseState` (`src/App.jsx`) falls back to `getIntroducedSources` for
`extraSiblingSources`.

Root cause: `getIntroducedSources`'s old filter (`!lesson.review`) let through
"pool" lessons — `izan-past-pool`, `izan-past-pool-plural`, `ukan-past-pool`,
`ukan-past-pool-plural`, `unit-10-present`, `unit-10-present-plural`
(`src/data/lessons.js`) — which are shaped like a review (`{ id, persons,
sources }`) but aren't marked `review: true`. Mapping them to `{ verbId:
verbId, tense: tense }` produced `{ verbId: undefined, tense: undefined }`
entries, and `collectCrossSourceCandidates` (`src/lessonLogic.js`) then read
`sibling.verb.id` on the resulting `{ verb: undefined, tense: undefined }`
sibling source — a `TypeError`.

Fix: `getIntroducedSources`'s filter is now `!lesson.review && lesson.verbId`,
skipping pool lessons entirely (they don't represent a single
verb/tense "introduction" anyway). This is a real production crash, distinct
from the ambiguous-distractors remediation plan itself (Delivery 4's bug, not
a new issue) — fixed alongside #113 because the triage script couldn't run
without it. Covered by two new tests in `src/logic.test.js`
(`getIntroducedSources`'s pool-lesson case, and an integration test running
`generateCrossVerbQuestions`/`generateCaseMixerQuestions` for all 7 affected
lessons with real `LESSONS`/`VERBS`).

## 2026-06-13 — Generated a cross-candidate substitution checklist for native-speaker triage

Layer 2a of the remediation plan (#113): added `scripts/list-cross-candidates.mjs`,
a one-off Node ESM script (not part of `npm test`/`npm run build`) that walks every
`review: true` lesson in `LESSONS` and enumerates every cross-verb form substitution
reachable through `getCrossVerbCandidates` (the `sentence`/`negative`/`form`
distractor pools) and `generateCrossVerbQuestions`/`generateCaseMixerQuestions`
(the `verb-choice`/`case-mixer` kinds), including Delivery 4's `getIntroducedSources`
fallback for reviews with fewer than 3 sources. Each de-duplicated
`(template, substituted form)` combination is rendered as a checklist entry in
`docs/CROSS_CANDIDATE_REVIEW.md` (2101 entries) with both the source verb's own
sentence and the substituted sentence, for a reviewer to mark "both valid" (→ #114's
`CROSS_CANDIDATE_EXCLUSIONS`) or "wrong/ungrammatical" (no action).

Exported `agreementsCompatible` and `pickVariant` from `src/lessonLogic.js` (both
were already pure helpers, just not previously needed outside the module) so the
script can reuse the exact same compatibility/variant logic as the runtime — no
duplicated logic to drift out of sync.

Cross-checked the output against `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`'s confirmed
examples: `ukan`↔`nahi` (now via different `hura`/`hark`/`anek` sentence templates
than the one #112 already excluded), `eduki`↔`ukan`/`ikusi`, and `jakin`'s `dakit`
all appear as entries. `src/lessonLogic.js` runtime logic is otherwise untouched by
this issue (read-only, per #113's scope) — see the crash fix above for the one
exception, which was a separate pre-existing bug blocking the script from running
at all.

## 2026-06-13 — Excluded cross-verb distractors that collide with a sibling verb's own sentence template

Layer 1 of the remediation plan from the cross-verb-distractor audit below
(GitHub issue #112): added `sentenceTemplatesCollide(verbA, tenseA, verbB,
tenseB, person)` to `src/lessonLogic.js` — a pure, zero-grammar-knowledge
check for whether two verbs' `sentences[tense][person]` entries share a
literal template string (handling `pickVariant`'s `string | string[]` shape
on either side). Wired into `getCrossVerbCandidates` (skip a sibling's form
for a person if its sentence collides with `verb`'s own) and
`collectCrossSourceCandidates` (same skip for `verb-choice`/`case-mixer`
siblings).

This fixes the confirmed `unit-2-review` case: `ukan` and `nahi` both have
`'Nik liburu bat ___.'` in their present-`ni` sentence lists (`dut` vs `nahi
dut`, two different correct answers for the identical sentence) — `nahi dut`
no longer appears as a distractor for `ukan`'s question on that sentence, and
vice versa. A guard test in `src/logic.test.js` scans every
`agreementsCompatible` pair in `VERBS` for any shared `(tense, person)`
sentence template and asserts the exclusion covers it, so a future verb/
sentence addition that reintroduces this kind of collision fails the test
suite instead of shipping silently.

Verified via `npm test`/`npm run lint`/`npm run build` plus the regression
tests exercising the real `ukan`/`nahi`/`jakin` (`unit-2-review`) sources
across a spread of `Math.random` rolls — not via an interactive `npm run dev`
play-through, since this session runs headless.

Out of scope (tracked in #113/#114): broader semantic overlaps where the
sentence *text* differs but both completions are still valid (e.g. `eduki` vs
`ukan`/`ikusi`) — those need native-speaker triage, not a literal-string
check.

## 2026-06-13 — Audited cross-verb distractors for "multiple valid options"

Following up on the Exercise Variety Plan (Deliveries 1-4, shipped earlier the
same day): learners reported multiple-choice questions where more than one
option is independently grammatical for the shown sentence (just with a
different meaning), since `agreementsCompatible`'s NOR/NOR-NORK check doesn't
catch this — Basque's transitive clause frame is shared across semantically
unrelated `nor-nork` verbs (`ukan`/`nahi`/`jakin`/`eduki`/`jan`/`edan`/`erosi`/
`ikusi`), so their forms are often mutually substitutable without becoming
ungrammatical. Confirmed concretely in `unit-2-review` (`ukan`'s and `nahi`'s
`ni`-present sentence lists share the literal string `'Nik liburu bat ___.'`,
with two different correct answers: `dut`/`nahi dut`) and `unit-8-review`
(`eduki` vs `ukan`/`ikusi` via Delivery 4's fallback pool). No remediation
chosen yet — findings and possible directions logged in
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`.

## 2026-06-13 — Sign-in form's "invalid email" error was masking unrelated server errors

A learner with a perfectly valid email saw "Enter a valid email address" when
requesting a magic link. The actual cause was that the sync-worker's
`RESEND_API_KEY` secret was never set, so `/auth/request-link` returned
HTTP 502 — but `AccountModal.handleSubmit` (`App.jsx`) mapped *any* non-OK,
non-429 response to `accountErrorInvalidEmail`.

**Decision:** only a 400 response (the worker's actual "invalid email" code,
`sync-worker/src/routes/auth.js`) maps to `accountErrorInvalidEmail`; other
non-OK statuses (5xx etc.) now map to the existing generic
`accountErrorNetwork` message. Also added
`.github/workflows/set-sync-worker-secret.yml` (mirroring the feedback
worker's secret-setting workflow) so `RESEND_API_KEY` can be provisioned for
the sync-worker without local `wrangler` access.

## 2026-06-13 — Fixed "scroll to last lesson on load" being clobbered by browser scroll restoration

**Problem:** The 2026-06-12 scroll-to-last-completed-lesson feature worked on a
fresh `page.goto`, but not on an actual page reload — which is how most
returning learners "load the page" (reopening a tab, refreshing). Reproduced
with Playwright: load → scroll to last lesson (works) → reload → scroll jumps
back to wherever it was before the reload, not the last lesson.

**Cause:** `history.scrollRestoration` defaults to `'auto'`, so the browser
restores the pre-reload scroll position itself, and it does so *after* React's
effects run — overriding the `scrollIntoView`/`scrollTo` call in
`HomeScreen`'s mount effect.

**Fix:** Set `window.history.scrollRestoration = 'manual'` once at startup
(`src/main.jsx`), opting the app out of the browser's automatic restoration
entirely so our own scroll logic (jump to last lesson on first load, restore
position when returning from an exercise) is the only thing moving the
viewport. Verified with Playwright that a reload now lands back at the last
completed lesson instead of the top.

## 2026-06-13 — Excluded type-verb/type-negative for forms ambiguous with another verb's form

A learner reported a `type-verb` question for `nahi`-present (`ni`): "Nik
liburu bat ___." expects "nahi dut" ("I want a book"), but typing just "dut"
— which the learner knew as `ukan`'s `ni`-present form — was marked wrong
even though "Nik liburu bat dut." ("I have a book") is itself a correct Basque
sentence. The blank alone gives no signal which of the two the lesson wants;
this isn't specific to this one sentence — `nahi`'s present forms are all
literally `'nahi ' + ukan`'s present forms (`nahi dut`/`nahi duzu`/`nahi du`
vs. `dut`/`duzu`/`du`), so *every* `nahi`-present sentence has the same
collision, and the same will apply to future `behar`/`ahal`/`ari`-style
particle+auxiliary verbs.

**Decision:** Added `hasAmbiguousTypedForm` (`lessonLogic.js`): true when a
verb's `conjugations[tense][person]` is a multi-word compound whose trailing
word exactly equals another agreement-compatible verb's (`agreementsCompatible`)
form for the same `[tense][person]`. `generateQuestions` now takes an optional
`verbs` param (the full `VERBS` list, passed from `App.jsx`'s
`createExerciseState` and `getWeakSpotQuestions`) and drops `type-verb`/
`type-negative` from `availableKinds` whenever this holds, falling back to the
multiple-choice framings (`sentence`/`pronoun`/`form`) — their `options` come
from `verb`'s own table, so the colliding bare form never appears as a choice.
Rejected accepting both forms as correct: "dut" alone doesn't mean "I want a
book", so marking it correct for a `nahi` lesson would teach the wrong thing —
the fix is to not ask for a typed answer there at all, not to accept more
answers.

**Consequence:** `nahi`-present's `ni`/`zu`/`hura` lose `type-verb` entirely
(all three collide with `ukan`), staying multiple-choice/bare-form only.

## 2026-06-13 — Fixed unanswerable typed review questions hiding the verb name

A learner reported a `type-verb` question in `unit-5-review-3` (mixes `jakin`
and `etorri`) showing the sentence "Irakasleak erantzun zuzena ___." with no
indication of which verb's table it came from. The blank fits more than one
real Basque word depending on the verb (`jakin`'s `daki` "knows" vs. `edun`'s
`du` "has") — without `options` to narrow it down and without the verb name,
there was no way to tell which form was being asked for.

**Decision:** `showVerb` (`QuestionPrompt`, `App.jsx`) is now
`!lesson.review || !question.options` instead of just `!lesson.review`. The
review-only hiding was originally about not giving away the answer via
cross-verb `options` (Delivery 1 of the Exercise Variety Plan); typed kinds
(`type-verb`/`type-pronoun`/`type-negative`) have no `options` to protect, so
showing the verb name there can't leak anything — it just disambiguates the
blank.

## 2026-06-13 — Resolved issue #97: "Share result" on 3-star lesson results

Added a "Share" button to `LessonResultsScreen`, gated to `stars === 3`,
reusing `shareContent`/`getShareUrl` from #96. **Gated to a perfect score
only** (not shown for 0/1/2-star results) — framed as a celebration moment
(like the existing confetti/fireworks `Celebration`, also 3-star-only), not a
"share to feel okay about your score" nudge offered on every attempt.

Same conventions as #96: clipboard-fallback shows a brief "Link copied!"
confirmation (local state + 2s `setTimeout`, same pattern as the Profile
tab's button), `share_app` analytics event (`variant: 'result'`, plus
`lessonId`), and share text in the sender's current UI language via `t()`.

## 2026-06-13 — Resolved issue #96: "Invite a friend" share entry point

Added `src/shareUtils.js` (`getShareUrl`, `shareContent`) and an "Invite a
friend" button to the Profile tab. `shareContent` uses the Web Share API
(`navigator.share`) where available, falling back to copying
`"${text} ${url}"` to the clipboard with a brief inline "Link copied!"
confirmation (no toast system exists, so this is local state + a 2s
`setTimeout` revert, mirroring `syncTimeoutRef` in `App.jsx`).

**v1 has no referral tracking** — the shared URL is just `getShareUrl()`
(origin + `BASE_URL`), with no query params or codes identifying the sharer.
Analytics only records that a share happened (`share_app` event with the
result: `shared`/`copied`/`cancelled`/`failed`), not who shared or whether the
recipient ever opens the link. Referral tracking could be added later if
needed, but would need its own privacy/consent consideration.

**Share text follows the sender's current UI language** (`shareGenericTitle`/
`shareGenericText` via `t()`), with no special handling for the recipient's
language — the recipient picks their own language on first launch like any
other user, same as the app's existing onboarding flow.

## 2026-06-13 — Resolved issue #92: flag-a-question with diagnostics

Added a 🚩 button to `FeedbackBar` (shown once a question is answered) that
opens `FlagQuestionModal`, posting to the same feedback worker endpoint as
`FeedbackModal` with `context: 'question-flag'` and a `diagnostics` object
built by the new pure `buildFlagDiagnostics` (`lessonLogic.js`).

**Why a separate `diagnostics` field instead of folding everything into
`message`:** keeps the worker's validation precise (known keys, type-checked,
size-capped) rather than trusting a free-text blob, and keeps the email body
readable — a "--- Flagged question ---" block formatted server-side, with the
learner's optional comment (if any) above it. `message` becomes optional in
the worker when `diagnostics` is present, since a flag with no comment is
still a useful report on its own.

**Why `buildFlagDiagnostics` only includes `sentence`/`options`/`items` when
present (rather than always sending the full question object):** the question
shape varies by `kind` (see `generateQuestions`) — sending `undefined`/`null`
placeholders for inapplicable fields would bloat the payload and create
ambiguity (worker-side, "missing" vs "explicitly null") for no benefit, since
`kind` alone tells a reviewer which fields to expect.

**Why `answerSeq` + `key={answerSeq}` on `FeedbackBar`:** the "Reported"
button state is local to `FeedbackBar`/`FlagQuestionModal`, but needs to reset
when the learner moves to the next question — remounting via a changing `key`
(same pattern used elsewhere for per-question reset) was simpler than lifting
that state into `ExerciseScreen`'s reducer.

## 2026-06-13 — Resolved issue #91: points become a PN-Counter, first-sync merge, ongoing background sync, sync status UI

**Points data model (`POINTS_STORAGE_KEY` v1 → v2):** `points` changed from a
single mutable `{ balance }` to a PN-Counter: `{ earned: { [deviceId]: n },
spent: { [deviceId]: n } }`, balance = `sum(earned) - sum(spent)` via the new
`getPointsBalance` (`lessonLogic.js`). Each device only ever increments its
*own* `earned`/`spent` entries (`addPoints`/`repairStreak` now take a
`deviceId`) — this is what makes the cross-device merge (`mergePoints`, "max
per device per counter") lossless and order-independent, unlike a single
shared counter where two devices' concurrent spends could double-count or
clobber each other. A new `aditzak:deviceId:v1` key holds a `crypto.randomUUID`
generated once per device. `pointsStorage.load()` migrates an existing v1
`{ balance }` by attributing the whole balance to this device's `earned`
(`{ earned: { [deviceId]: balance }, spent: {} }`) — chosen over e.g. a
synthetic `"legacy"` device id so the migrated balance still participates
correctly in future per-device merges.

**First-sync merge:** on magic-link sign-in, `AppShell` checks `hasCloudData`
(from `/auth/verify`) and `hasLocalSyncData` (any local progress/streak).
Neither → nothing to do. Cloud-only → adopt the cloud snapshot wholesale,
silently. Local-only → push local data, silently. Both → show `MergeModal`
(reusing the `accountMerge*` keys left over from #90's removed prototype) with
three choices: `keepBest` (per-field "best of both" via `mergeSyncPayload` —
recommended, default-styled button), `useDevice` (push local as-is), or
`useAccount` (overwrite local with the cloud payload). `mergeSyncPayload`
composes four per-field merges: `mergeProgress` (per-lesson max of
attempts/bestScore/totalQuestions/bestStars + most-recent `lastPlayed`),
`mergeDailyStreak` (the side with the more recent `lastActiveDate` wins for
`currentStreak`/`lastActiveDate` — since `currentStreak` resets after a gap
and isn't independently monotonic — while `longestStreak` is maxed),
`mergeErrorStats` (union by `verbId:tense:person`, overlapping entries take
max `count` + latest `lastMissed`), and `mergePoints` (the PN-Counter union
described above).

**Ongoing background sync:** every app load while already signed in re-runs
the same `mergeSyncPayload` pull-merge against `GET /sync` (so edits from
another device since the last visit aren't lost), then pushes the merged
result. After that initial reconcile, any change to `progress`/`dailyStreak`/
`points`/`errorStats` schedules a debounced (`SYNC_PUSH_DEBOUNCE_MS = 1000`)
`PUT /sync` of the latest snapshot. A `skipNextPushRef` (starts `true`) blocks
this debounced effect until the initial reconcile/merge has finished — without
it, the background-push effect would fire on the very first render (before any
merge/pull has happened) and push this device's pre-merge data to the cloud,
potentially overwriting another device's newer data. Failures are swallowed
(`syncStatus = 'error'`); local storage remains the source of truth and the
next save or app load retries — no blocking UI or retry loop.

**Sync status UI:** `accountSyncedJustNow` (now reused for "no `lastSyncedAt`
yet" as well as "synced <1 minute ago") is joined by `accountSyncedMinutesAgo`
(`tCount`, "Synced {n} minute(s) ago"), `accountSyncing` ("Syncing…"), and
`accountSyncFailed` ("Sync failed, will retry"), computed by `syncStatusText`
and shown under the account email in `AccountSection`. `syncStatus`'s initial
value is computed via a `useState` lazy initializer (checking for
`?authToken=` or a stored session) rather than set inside the reconcile
effect, to avoid the `react-hooks/set-state-in-effect` lint rule's "cascading
render" warning for a synchronous `setState` at the top of an effect body.

## 2026-06-13 — Resolved issue #90: wired `AccountModal`/`AccountSection` to the real magic-link auth API, superseding the 2026-06-12 UI-only prototype

**Decision:** `AccountModal`'s email step now calls `POST {SYNC_API_URL}/auth/request-link`
(new `SYNC_API_URL` constant, `VITE_SYNC_API_URL` override following the
`FEEDBACK_API_URL`/`VITE_FEEDBACK_API_URL` pattern — `.env.example`,
`src/App.jsx`, `.github/workflows/deploy.yml`). Errors map to new
translation keys: `accountErrorRateLimited` (429), `accountErrorInvalidEmail`
(other non-2xx), `accountErrorNetwork` (thrown/fetch failure).

`AppShell` now owns `account` state (lifted out of `HomeScreen`, which held
mock `useState(null)` per the 2026-06-12 prototype decision — **that decision
is now superseded**). On mount, it checks the URL for `?authToken=...`: if
present, it's exchanged via `/auth/verify`, the result is stored in a new
`aditzak:session:v1` localStorage key (`{ token, email, expiresAt }` — `load()`
returns `null` for a missing/expired session, unlike the `{}`-defaulting
`createStorage` helper used by `progress`/`streak`/etc.), and `authToken` is
stripped from the URL via `history.replaceState` either way. On later loads
with no `authToken`, a non-expired stored session restores `account` directly
— no network call, per the issue's scope. `expiresAt` is computed client-side
as `now + SESSION_TTL_MS` (60 days, mirroring sync-worker's
`SESSION_TTL_MS`), since `/auth/verify` doesn't return one. "Sign out" calls
`POST /auth/signout` with the stored bearer token best-effort (errors ignored)
and always clears the local session.

**Removed the modal's "merge" step** (`ACCOUNT_MERGE_OPTIONS`, `mergeChoice`,
`hasLocalProgress`/`onSignedIn` props, and the "Continue (demo)" button/
`accountDemoContinue` key). The prototype's flow assumed sign-in *completed*
inside the modal (so a merge choice could follow immediately), but real
sign-in completes out-of-band — the learner clicks the emailed link, which
loads the app fresh and runs the `/auth/verify` effect above; the modal that
requested the link is long gone by then. The `accountMerge*` translation keys
are left in place (unused) since #91 ("first-sync merge") will need similar
copy when it designs where/how the merge choice is actually surfaced — likely
a banner driven by `account.hasCloudData` (now returned by `/auth/verify` and
threaded through, though not yet used) plus local-progress presence, rather
than a modal step.

## 2026-06-13 — Resolved issue #89: progress sync endpoints (`GET`/`PUT /sync`) in `sync-worker/`

**Decision:** `GET /sync` and `PUT /sync` (`src/routes/sync.js`) are
bearer-authenticated via the `authenticateSession` helper from #88 and
read/write a single `progress_snapshots` row per user (upsert via
`ON CONFLICT(user_id) DO UPDATE`, added to `src/db.js`). `GET` returns
`404 { payload: null }` when no snapshot exists — chosen over `200` with a
null body so the frontend's "no cloud data yet" branch is a plain HTTP
status check rather than inspecting the body of a 200.

`PUT`'s `schemaVersion` is stored alongside the payload but not yet
validated/rejected by the backend — reconciling client/server schema
versions is the frontend's job (#91's first-sync merge), this endpoint just
persists whatever it's given. The 256KB cap
(`MAX_PAYLOAD_BYTES` in `src/routes/sync.js`) is checked against the
UTF-8 byte length of the stringified `payload` *after* parsing the request
body — simpler than streaming/Content-Length checks, and acceptable since
Workers' own request body limits (100MB+) make a 256KB JSON parse
negligible.

## 2026-06-13 — Resolved issue #88: magic-link auth endpoints + rate limiting in `sync-worker/`

**Decision:** Implemented `POST /auth/request-link`, `POST /auth/verify`, and
`POST /auth/signout` per #86/#88's spec. Tokens (magic-link and session) are
32 random bytes, base64url-encoded, and only their SHA-256 hash is ever
stored (`src/crypto.js`) — so a leaked D1 row can't be replayed as a token.
Magic links expire after 15 minutes and are single-use (`used_at` checked on
verify); sessions last 60 days and have their `last_seen_at` bumped on every
authenticated request (`src/session.js`'s `authenticateSession`, reused by
the `/sync` follow-up in #89).

**Rate limiting** (`src/rateLimit.js`, `migrations/0002_rate_limits.sql`) uses
fixed-window counters in a single `rate_limits` table, keyed by
`email:m:<email>` / `email:h:<email>` / `ip:m:<ip>` / `ip:h:<ip>` (1/minute
and 5/hour per email and per IP). The four checks short-circuit on first
failure, so a rejected request doesn't increment counters it never reached —
simpler than atomic multi-counter updates, and the slight under-counting on
rejection doesn't weaken the limit (a rejected request is already blocked).

**Email delivery** (`src/email.js`) reuses `worker/`'s Resend pattern but
with this worker's own `RESEND_API_KEY` secret and `AUTH_FROM_EMAIL`/`APP_URL`
vars — kept separate from the feedback worker's secret even though both may
use the same Resend account, since the two workers' configs shouldn't be
coupled.

**Testing:** `@cloudflare/vitest-pool-workers@0.16.15` doesn't expose a
`./config` entrypoint compatible with vitest 4.1.8 (`defineWorkersConfig`
import fails), and the API surface looked likely to keep shifting. Instead,
`sync-worker/test/d1.js` wraps Node's built-in `node:sqlite` (`DatabaseSync`,
experimental as of Node 22) behind a `prepare().bind().first/all/run()` shim
matching D1's API, applying the real `migrations/*.sql` files — real SQLite
semantics without the extra tooling dependency. This needed its own
`sync-worker/vitest.config.js` (`environment: 'node'`) so it doesn't inherit
the root's jsdom config, and the root `vite.config.js` test config now
excludes `sync-worker/**` (and `worker/**`) so `npm test` at the root doesn't
try to bundle `node:sqlite` for jsdom.

## 2026-06-13 — Resolved issue #87: stood up `sync-worker/` (Cloudflare Worker + D1), `/healthz` only for now

**Decision:** Added `sync-worker/` as a sibling of `worker/` (the existing
stateless feedback worker), per epic #86's recommendation (open question #4:
a separate worker, since this one handles PII/session tokens — a different
trust boundary than the feedback relay). Mirrors `worker/`'s structure
(`package.json`, `wrangler.toml`, `src/index.js`, `.gitignore`) and CORS
pattern (`corsHeaders`/`jsonResponse` locked to `ALLOWED_ORIGIN`). Added a D1
binding (`DB` → database `aditzak-sync`) and
`migrations/0001_init.sql` creating `users`/`magic_links`/`sessions`/
`progress_snapshots` exactly as specified in #86/#87. The worker currently
only serves `GET /healthz` — `/auth/*` and `/sync` are separate follow-up
issues (#88/#89).

`.github/workflows/deploy-sync-worker.yml` mirrors `deploy-worker.yml`
(path-filtered on `sync-worker/**`, same `CLOUDFLARE_API_TOKEN`/
`CLOUDFLARE_ACCOUNT_ID` secrets), but runs `wrangler d1 migrations apply
aditzak-sync --remote` before `deploy` on every push — so new migration files
added by #88/#89 are applied automatically. `docs/CLOUDFLARE_SYNC_WORKER.md`
documents the one-time `wrangler d1 create aditzak-sync` provisioning step
(its `database_id` is a placeholder in `wrangler.toml` until that's run) and
notes the deploy token needs **D1: Edit** permission in addition to the
feedback worker's **Workers Scripts: Edit**.

**Verified locally:** `wrangler d1 migrations apply aditzak-sync --local`
applies cleanly, and `wrangler dev` serves `GET /healthz` → `{"ok":true}`
and 404s everything else. Actual `wrangler deploy`/remote D1 provisioning
needs real Cloudflare credentials and wasn't run from this session.

## 2026-06-13 — Resolved issue #83: re-keyed `journeyTranslations.js`'s `units`/`stages` to `journey.js`'s current unit/stage numbering

**Decision:** Did the holistic re-audit issue #83 asked for. Most of the old
`units`/`stages` entries (1-22, plus the gate/stage titles) were content that
still exists in `journey.js` but under a different number after several
renumbering/reorder passes — those were moved to their current numbers (e.g.
old unit 7 "Rutina diaria" → new Unit 10, old unit 10 "Necesidades y
obligaciones" → new Unit 18, old `phase-2-stage-3`'s "Acciones del mundo real"
→ `phase-2-stage-4`, etc.). Entries with no surviving counterpart (old unit 9
"Intenciones y acciones futuras", which Units 14-17 replaced) were dropped.
New units that had no prior translation at all (3, 8, 9, 12, 13, 14-17, 20)
and three new stages (`phase-2-stage-3`, `phase-2-stage-5`, `phase-3-stage-7`)
got fresh ES/EU copy written against `journey.js`'s current English text and
`docs/LEARNING_JOURNEY.md`.

**Drift prevention:** added two checks to `journey.test.js` asserting every
`JOURNEY` unit number and stage id has a `JOURNEY_TRANSLATIONS` entry — this
catches a unit/stage with *no* translation entry (the "23-29 missing
entirely" half of #83), but can't catch a translation entry that exists but
describes the *wrong* unit (the "drifted to the wrong number" half) — that
class of bug requires a human content audit like this one, not a type-level
check.

## 2026-06-13 — Resolved issue #84: pooled Units 8/9's past tense into izan-past/ukan-past auxiliary pools, moved egon-past/eduki-past to their own units (Stage 3/5 reshuffle)

**Decision:** Replaced Units 8/9's six per-verb `-past`/`-past-plural` pairs
(`izan-past`, `egon-past`, `ukan-past`, `joan-past`, `etorri-past`,
`ikusi-past`, plus `looking-back-1a-review`/`looking-back-1b-review` and their
`-plural` siblings) and Units 12/13's five (`jan-past`, `edan-past`,
`erosi-past`, `eduki-past`, `ibili-past`, plus `looking-back-2a-review`/
`looking-back-2b-review` and their `-plural` siblings) — 30 lessons total —
with:

- **Unit 8** ("Looking Back I — The 'izan' Past Pool"): `izan-past-pool` /
  `izan-past-pool-plural`, `sources` covering `izan`/`joan`/`etorri`/`ibili`'s
  past tense — all four conjugate via `izan`'s past auxiliary
  (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`).
- **Unit 9** ("Looking Back I — The 'ukan' Past Pool"): `ukan-past-pool` /
  `ukan-past-pool-plural`, `sources` covering `ukan`/`jan`/`edan`/`erosi`/
  `ikusi`'s past tense — all five conjugate via `ukan`'s past auxiliary
  (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`).
- **Unit 12** ("Looking Back II — 'I Was There'"): `egon-past` /
  `egon-past-review` / `egon-past-plural` / `egon-past-plural-review` — `egon`
  keeps its own distinct synthetic past paradigm (`nengoen`/`zeunden`/
  `zegoen`/...), same single-verb practice+review shape as Unit 3/5's
  `ikusi-present`/`ikusi-present-review`.
- **Unit 13** ("Looking Back II — 'I Had It'"): the same shape for
  `eduki-past` (`neukan`/`zeneukan`/...).

12 lessons total, down from 30. No new `VERBS` data — `conjugations.past` for
all eleven verbs already existed from the two prior "Looking Back"
implementation passes — this is purely a `journey.js`/`lessons.js`
restructure following Unit 10's pooling pattern (see the entry below).

**Why a reshuffle across Stages 3 and 5, not a one-unit edit:** issue #84
identified that `izan`-past's auxiliary is shared by verbs originally spread
across Units 8/9/13, and `ukan`-past's by verbs spread across Units 8/9/12 —
pooling either family means moving lessons across unit *and* stage
boundaries. Kept the unit count at 4 (8, 9, 12, 13) and left Units
10/11/14+ untouched — no renumbering cascade — by redistributing *within*
that four-unit budget: Stage 3 (Units 8-9) becomes "the two shared-auxiliary
pools", Stage 5 (Units 12-13) becomes "the two odd-ones-out with their own
paradigm" (`egon`, `eduki`). This still preserves the redesign's "pair each
verb's past with its present soon after" framing for every pooled verb
(`ibili`'s past, Unit 8, is one unit after its present, Unit 11; `jan`/`edan`/
`erosi`/`ikusi`'s past, Unit 9, is right after their present, Unit 10) — the
one regression is `egon`, whose present→past gap grows from Unit 1→8 (7
units) to Unit 1→12 (11 units), accepted as the cost of giving `egon` and
`eduki` each a focused single-verb unit rather than forcing them into a pool
they don't fit.

**`journeyTranslations.js` left untouched**, same precedent as the Unit 10
entry below — its `units` keys are already out of sync with `journey.js`'s
current numbering (a pre-existing issue flagged there), and this redesign
doesn't make that worse; both need the same holistic re-audit.

**No `STORAGE_KEY` bump**: removed lesson ids (`izan-past`, `joan-past`, ...,
`looking-back-*-review*`) leave orphaned-but-harmless `progress` entries, same
precedent as Unit 10's redesign. `egon-past`/`eduki-past` keep their existing
ids, so any progress already recorded against them carries over.

## 2026-06-13 — Unit 10 ("Daily Routine (Transitive)") rebuilt as a pooled "ukan present auxiliary" drill across jan/edan/erosi/ikusi, replacing per-verb practice lessons

**Decision:** Replaced Unit 10's 8 lessons (`jan-present`/`-plural`,
`edan-present`/`-plural`, `erosi-present`/`-plural`, `unit-7-review`/
`-plural`) with 2: `unit-10-present` (ni/zu/hura) and
`unit-10-present-plural` (gu/zuek/haiek), each with `sources` covering
`jan`/`edan`/`erosi`/`ikusi`'s present tense — all four already have full
6-person grids plus `sentences`/`pronounSentences`. `ikusi` (Unit 3) rejoins
this pool: its present tense already shares the exact `ukan` NOR-NORK
auxiliary shape, so it slots in with zero new data.

`describeLesson` (`App.jsx`) gained a third branch alongside single-verb
practice and "🔁 Mixed Review": non-review lessons with `sources` get the same
title/icon layout as single-verb practice (tense label, persons), but
subtitle/heading list the verb pool the way a review does (`mixedPractice`
copy). `LessonPreviewScreen`'s single-verb/single-table layout doesn't fit a
verb pool, so `showPreview` now keys off `!lesson.sources` instead of
`!lesson.review` — pooled lessons skip the preview like reviews do.

`journey.test.js`'s `LESSONS <-> VERBS` checks were split in two: one for
single-verb practice lessons (`lesson.verbId`), one for any lesson with
`sources` (review or pooled) — the latter now also checks `lesson.persons`
against each source's table, which the old review-only check didn't do.

**Why:** the previous design's distractors were already drawn from a single
verb's own table (same participle, varying person — isolating the
auxiliary-by-person pattern), but each *lesson* only ever used one participle
across all its questions. Pooling `jan`/`edan`/`erosi`/`ikusi` into one lesson
keeps that per-question isolation (distractors still come from whichever
verb's table that question rolled) while varying the participle
question-to-question — "to learn a conjugation between persons we can use
whatever verb fits" rather than marching through one verb at a time. It also
makes future additions to this pattern (e.g. `entzun`) a one-line append to
both `sources` arrays, no new lesson ids.

**No `STORAGE_KEY` bump:** removed lesson ids leave orphaned-but-harmless
`progress` entries; `getUnlockedLessonIds` only iterates `LESSONS`'s current
entries, and `unit-10-present`/`unit-10-present-plural` sit in the same array
position the old lessons did, so an existing learner's unlock state carries
over correctly.

**Known pre-existing issue found, not fixed here:** `journeyTranslations.js`'s
`units` keys are out of sync with `journey.js`'s current unit numbers for
several units (e.g. key `10` holds "Requirements & Obligations" copy — the
*old* Unit 10 — while the *current* Unit 10 is "Daily Routine"), so
Spanish/Basque users likely see wrong-unit translated focus/payload text for
several units. Left `journeyTranslations.js` untouched for Unit 10 rather than
adding correct copy under a still-misaligned key — this needs a holistic
re-audit across all renumbered units, not a one-unit patch.

## 2026-06-13 — Delivery 4 of the Exercise Variety Plan: broaden the cross-verb candidate pool for small reviews

**Decision:** added `getIntroducedSources(lessons, upToLessonId)`
(`lessonLogic.js`) — position-based like `getUnlockedLessonIds`, returning
every practice lesson's `{ verbId, tense }` before `upToLessonId` in `LESSONS`
order (review lessons skipped, since they have no `verbId`/`tense` of their
own). Because it only looks *before* the review's own position, it's
inherently spoiler-safe (task 4.3) — a verb's `future` form can't leak into a
`present`-tense review if that verb's `future` lesson hasn't been reached yet.

In `createExerciseState` (`App.jsx`), reviews with fewer than 3 sources
(`unit-1-review`, `unit-3-review`, ...) compute this as `extraSources` and
pass it through three places:
- `getCrossVerbCandidates(verb, tense, sources, VERBS, extraSources)` — its
  new 5th parameter, merged into the sibling pool for Delivery 1's
  `extraCandidates`, deduped against `sources` and restricted to the same
  `tense` as the lookup.
- `generateCrossVerbQuestions`/`generateCaseMixerQuestions`'s new
  `extraSiblingSources` option, threaded into
  `collectCrossSourceCandidates`'s shared sibling pool with the same
  dedup/same-tense rules.

Reviews with 3+ sources are untouched — "this review = these sources" stays
intact where there's already enough variety, per the plan's framing.

**Option-count cap added as part of this delivery:**
`collectCrossSourceCandidates` now caps every `verb-choice`/`case-mixer`
question at 4 options (`correct` + up to 3 randomly-sampled distractors),
matching `buildOptions`'s existing ceiling. Before Delivery 4, a 2-3-source
review's sibling pool was small enough that this never mattered (capped
naturally), but `unit-3-review`'s fallback pool (6 additional `present`-tense
verbs) could otherwise produce 5+ option `case-mixer` questions — capping
keeps every multiple-choice question's option count consistent regardless of
how big the candidate pool gets.

**Pilot:** `unit-1-review` (izan+egon) gets no new candidates — its 2 sources
*are* the only two practice lessons before it, so `extraSources` dedupes to
empty and Delivery 3's behaviour is unchanged. `unit-3-review` (joan+etorri,
both `nor`) is the more useful case: `extraSources` picks up
izan/egon/ukan/nahi/jakin/ikusi's `present` tables, so `verb-choice` options
grow from 2 to 4 (izan/egon now compatible siblings) and `case-mixer` —
previously empty, since joan/etorri are both `nor` — now fires using
ukan/nahi/jakin/ikusi (`nor-nork`) as siblings.

## 2026-06-13 — Delivery 3 of the Exercise Variety Plan: `case-mixer` questions (mechanism only, Unit 24 deferred)

**Decision:** added `generateCaseMixerQuestions` (`lessonLogic.js`) — Delivery
2's `generateCrossVerbQuestions` with `agreementsCompatible`'s filter
*inverted*, so it pairs sources whose `agreement` differs on the `nork` axis
(`nor` vs `nor-nork`) instead of matching ones. Both functions now share a
`collectCrossSourceCandidates`/`pickCrossSourceQuestions` pair of helpers.
`kind: 'case-mixer'` questions are wired into `createExerciseState` for every
review lesson (capped at `CASE_MIXER_QUESTION_COUNT = 1`, deliberately lower
than `verb-choice`'s 2 — this drill is narrower/harder) — reviews whose
sources don't mix `nor`/`nor-nork` simply get none, same graceful
degradation as `verb-choice`. No new UI: `QuestionPrompt` already renders any
`question.sentence`; `getExplanation` gains a `case-mixer` case
(`explanationCaseMixerErgative`/`Absolutive`, reusing the pronoun
explanations' "-k marks the doer" framing) and `QUESTION_PROMPT_KEYS` gains
`questionCaseMixer`.

**Audit (resolves task 3.1):** checked existing mixed-agreement review pairs
(`izan`/`ukan` in `unit-5-review-1`/`unit-6-review-1`, `jakin`/`etorri` in
`unit-5-review-3`, `izan`/`egon`/`ukan` in the `looking-back-1a-review*`
pairs) — every `nor` sentence's subject is written as the bare pronoun
("Ni...", "Zu...", "Hura...") while every `nor-nork` sentence's subject
carries `-k` ("Nik...", "Zuk...", "Hark..."/"Berak..."/a `-k`-marked noun).
Swapping in the wrong verb's form (e.g. "Txakurrak hezur bat da" instead of
"...du") always produces a case-marking mismatch — i.e. a clearly wrong
sentence, never an alternate-but-valid phrasing. Piloted via a throwaway
script against `unit-5-review-1`, `unit-5-review-3`, `unit-6-review-1`, and
`looking-back-1a-review`; `unit-1-review` (izan+egon, both `nor`) correctly
produced zero `case-mixer` questions.

**Unit 24 deferred (resolves the "ship Unit 24 now?" question):** `journey.js`
Unit 24 ("REFRESH — The Case-Ending Mixer", Refresh Gate C) stays `pending`.
Its `docs/LEARNING_JOURNEY.md` description is a full NOR/NORK/**NORI**
role-swap drill depending on Units 22-23's dative verbs (still `pending`,
zero data today) and `docs/EXERCISE_ENGINE.md` describes its likely mechanism
as a `spot-error`-style "pick the right/wrong full sentence" kind — neither
matches this delivery's narrower NOR-vs-NOR-NORK, multiple-choice
`case-mixer` mechanism. Rather than ship a reduced-scope Unit 24 now and
revisit its spec twice, `case-mixer` ships as a general review-lesson
mechanism (active wherever `nor`/`nor-nork` sources already mix, e.g. Gate A's
`unit-5-review-1`/`-3` and `unit-6-review-1`) and Unit 24 itself waits for
Units 22-23 to land so it can be specced and built in its originally-described
full form in one pass.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Delivery 4 remains
open).

## 2026-06-13 — Delivery 2 of the Exercise Variety Plan: dedicated `verb-choice` cross-verb question kind

**Decision:** review lessons (`lesson.review: true` with 2+ `sources`) now
also get a handful of dedicated `kind: 'verb-choice'` questions
(`generateCrossVerbQuestions`, `lessonLogic.js`, capped at
`CROSS_VERB_QUESTION_COUNT = 2`) — each shows one source's example sentence
and asks the learner to pick which verb's conjugated form actually fits it,
with options drawn from that source's correct form plus its
agreement-compatible siblings' (`agreementsCompatible`, shared with Delivery
1) forms for the same person. Unlike Delivery 1's occasional incidental
cross-verb distractor, here "which verb fits this sentence" *is* the
question.

**Final `kind` name (resolves the "final kind name" open decision):**
`verb-choice` is the real name, not a placeholder — it has its own
`QUESTION_PROMPT_KEYS` entry (`questionVerbChoice`) and `getExplanation` case
(`explanationVerbChoice`), translated in `en`/`es`/`eu`.

**UI (task 2.3):** no new rendering branch needed — `QuestionPrompt` already
renders `SentenceWithBlank` whenever `question.sentence` is set, which
`verb-choice` questions always have, and review lessons already pass
`showVerb={false}` (Delivery 1's badge decision), so the verb name stays
hidden automatically. The option-button stack is a vertical flex column, so
2-option questions (the common case for a 2-source review) render fine
without grid changes.

**Option count (resolves part of task 2.2):** not padded — a question's
`options` has exactly as many entries as there are compatible sources with a
usable form for that person (2 for a typical 2-source review, up to 4 for
more sources). A single-source review, or a review whose only other source is
agreement-incompatible, yields zero `verb-choice` questions (`options.length
< 2` for every candidate) — same graceful-degradation behaviour as Delivery
1's `getCrossVerbCandidates`.

**Typed variant (resolves the `type-verb-choice` open decision):** out of
scope for this delivery. `verb-choice` is multiple-choice only for now; a
typed "type the form that fits this sentence, no options" variant is deferred
to a later delivery if it turns out to be needed.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Deliveries 3-4 remain
open).

## 2026-06-13 — Delivery 1 of the Exercise Variety Plan: cross-verb distractors in review lessons

**Decision:** Review lessons (`lesson.review: true` with 2+ `sources`) now
widen `buildOptions`'s distractor pool with each source's *sibling* sources'
same-person conjugated forms (`getCrossVerbCandidates`, `lessonLogic.js`) —
e.g. an `egon-present` `ni` question in `unit-1-review` (sources: izan + egon)
can now occasionally offer `izan`'s `naiz` as a distractor alongside `egon`'s
own `zaude`/`dago`/etc. Only applied to `sentence`/`negative`/`form` kinds
(whose options come from `conjugations[tense]`) — not `pronoun`, whose options
come from a different table (`verb.pronouns`).

**Compatibility filter (resolves task 1.4):** a sibling source's forms are only
mixed in if its verb's `agreement` matches on the `nork` axis (`nor` ↔ `nor`,
`nor-nork` ↔ `nor-nork`) — so a cross-verb distractor is "right shape, wrong
verb" (a real but wrong sentence, e.g. "Ni etxean naiz") rather than
structurally broken ("Nik liburu bat naiz"). The latter — mixing across the
`nor`/`nor-nork` boundary — is deliberately Delivery 3's territory (NOR vs
NOR-NORK case-marking drills).

**Aggressiveness (resolves the "how aggressively to mix" open decision):**
candidates are merged into the pool and `shuffle().slice(0, 3)` picks from the
combined set — so a cross-verb option is *occasional*, not guaranteed every
question. Simpler than forcing one in, and keeps "right verb, wrong person"
distractors (the original behaviour) as the common case.

**Badge treatment (resolves task 1.3 / the badge open decision):** for review
lessons, `ExerciseScreen` no longer renders the per-question `VerbBadgeRow`
(type/agreement/dialect badges), and `QuestionPrompt`'s verb-name/meaning line
is replaced with just the tense label. Chose "hide entirely" over a generic
"Mixed review" badge — hiding is simpler (no new badge component or i18n
strings), and applying it uniformly to *all* review questions (not just ones
whose options happen to include a cross-verb distractor) avoids the badge's
presence/absence itself becoming a tell. Practice lessons are unaffected.

**Rollout (task 1.7):** since `getCrossVerbCandidates` is computed generically
for any review lesson in `createExerciseState`, every multi-source review
benefits automatically — no per-lesson changes needed. Single-source reviews
(`ikusi-present-review`, `unit-4-review`, etc.) get an empty candidate set and
behave exactly as before.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Deliveries 2-4 remain
open).

## 2026-06-13 — Moved the Expansion gate earlier (now Unit 5, right after "Moving Around")

**Decision:** Reordered Phase I's last three units. "Expansion — Bringing in
the Plural" (zero new verbs; adds `gu`/`zuek`/`haiek` to `izan`/`egon`/`ukan`/
`joan`/`etorri`/`ikusi`) is now **Unit 5**, in Stage 2 right after "Moving
Around" (Unit 4). "The Immediate Continuous" (`ari`) becomes Unit 6, and
"REFRESH — The Inversion Matrix" (negation) becomes Unit 7, still Refresh Gate
A — now a single-unit gate, its title shortened from `Refresh Gate A — The
"Ez" Trap & Person Expansion` to `Refresh Gate A — The "Ez" Trap`. Units 8+ are
unaffected — no renumbering cascade. Lesson ids (`unit-5-review-*` for
negation, `unit-6-review-*` + `ikusi-present-plural*` for Expansion) were left
unchanged, matching existing precedent for ids predating a renumbering; only
`LESSONS`' array order and `journey.js`'s unit/stage placement changed.
`gate: true` no longer implies "sits at a phase/stage boundary" — Unit 5 is
mid-Stage-2, kept the shield icon since it's still zero-new-verbs.
`journeyTranslations.js`'s `units` keys 4/5/6 (which track `unit.number - 1`
for Phase I) were rotated to match, and the Expansion translations gained the
`ikusi` mention the English `focus` already had but the ES/EU strings were
missing.

**Why:** All six verbs Unit 5 expands are introduced by Unit 4, so this is the
earliest point in the journey the expansion can run — previously it ran last
(old Unit 7), meaning a verb's `gu`/`zuek`/`haiek` forms (e.g. `izan`'s
`zarete`) weren't drilled until *three* units after that verb's own present-tense
lesson. Moving Expansion to Unit 5 cuts that gap to one unit for `izan`/`egon`
(Unit 1) and `ukan` (Unit 2), and zero for `joan`/`etorri`/`ikusi` (Units 3-4).
Considered but rejected: pairing every Phase I verb's plural lesson
immediately after its singular one from Unit 1 onward (the Unit 8+ pattern,
applied retroactively) — this would roughly double Units 1-4's lesson count
and walk back the documented "batch the plural unlock once you have a base of
verbs" rationale (`docs/LEARNING_JOURNEY.md`, "The 'Me, You, and It' horizon").
The chosen reorder gets most of the benefit (a much shorter `zarete`-style gap)
via a same-day, low-risk reorder with no new lessons and no data changes.

## 2026-06-12 — Extracted `VERBS`/`LESSONS` out of `App.jsx` into `src/data/`, added a `journey.test.js` consistency check

**Decision:** The previous entry's journey redesign touched `journey.js`,
`App.jsx` (`VERBS` + `LESSONS`, ~1300 of its 3162 lines), and four docs in one
pass — `App.jsx` mixed ~1300 lines of curriculum data into an otherwise
UI-only file, and nothing checked that `journey.js`'s `lessonIds` actually
lined up with `LESSONS`/`VERBS`. To make the next such redesign cheaper and
safer:

- Moved `VERBS` plus its post-processing loops (future/past sentence-reuse,
  `SINGLE_WORD_PAST_NEGATION`) and the lookup-table metadata (`TENSE_META`,
  `TYPE_META`, `AGREEMENT_META`, `DIALECT_LABELS`, `PERSON_LABEL_KEYS`) into
  `src/data/verbs.js`.
- Moved `LESSONS` plus `PHASE_1_PERSONS`/`PHASE_1_PLURAL_PERSONS` into
  `src/data/lessons.js`.
- `App.jsx` now just imports both — purely mechanical, no logic changes;
  `npm run build`/`npm run lint`/`npm test` all still pass. `journey.js`,
  `data/lessons.js`, and `data/verbs.js` are now a self-contained ~1700-line
  "curriculum" trio with zero UI code, so a journey change can be made by
  reading just those three files.
- Added `src/journey.test.js` (part of `npm test`): checks every `JOURNEY`
  unit's `lessonIds` resolve to a `LESSONS` entry and vice versa (each
  referenced exactly once), `available` units have `lessonIds` and `pending`
  ones don't, and every practice/review lesson's `verbId`/`tense`/`persons`
  resolves into `VERBS`. Catches the kind of dangling reference a renumbering
  could silently introduce.
- Added a "Working on the learning journey" section to `CLAUDE.md` mapping
  change types (reorder units, add a verb/tense, flip `pending` →
  `available`) to the files that need updating together.

**Why not split `App.jsx` further (e.g. extracting screen components):** out
of scope here — the goal was specifically to isolate the curriculum *data*
that journey redesigns touch, not a general `App.jsx` reorganization.

## 2026-06-12 — Redesigned the learning journey: pulled `ikusi` into Phase I (new Unit 3), split the future mega-unit into four, and added "Looking Back I/II" past-tense units — renumbering Units 7-25 to 10-32

**Decision:** Addressed three pacing/variety complaints about the journey
(`docs/LEARNING_JOURNEY.md`) in one pass:

1. **Added `ikusi` to Phase I as a new Unit 3 ("Seeing")** — Phase I's first
   periphrastic verb, reusing its existing 6-person `present` table (from the
   old Unit 7) via a `persons: PHASE_1_PERSONS`-filtered `ikusi-present`
   lesson + `ikusi-present-review`. Refresh Gate A's old Unit 6 ("Expansion")
   — now Unit 7 — gained an `ikusi-present-plural` lesson + review alongside
   its existing `gu`/`zuek`/`haiek` retrofit for `izan`/`egon`/`ukan`/`joan`/
   `etorri`. `ikusi` was deliberately **left out of** Unit 6's ("Inversion
   Matrix") negation drills — like `nahi`/`ari`, its auxiliary splits from the
   invariant participle under negation, so it has no `negativeSentences`.
2. **Split the old 32-lesson "Geroa" future unit into four** (now Units
   14-17), one per verb group (`izan/egon/ukan`, `nahi/jakin/joan/etorri`,
   `jan/edan/erosi`, `ikusi/eduki/ibili`) — purely a `journey.js`
   `lessonIds`-redistribution into 4 units; zero `VERBS`/`LESSONS` changes,
   since the future tense's `<verbId>-future` lessons and `unit-9-review-N`
   reviews already existed and slot in 1:1.
3. **Added two new "Looking Back" units, each split into two sub-units**:
   - Unit 8 ("Looking Back I — I Was, I Had"): `izan`/`egon`/`ukan` simple
     past, full 6-person grid, singular+plural lesson pairs per verb +
     `looking-back-1a-review`/`-plural`.
   - Unit 9 ("Looking Back I — I Went, I Came, I Saw"): `joan`/`etorri`/
     `ikusi` simple past, same shape + `looking-back-1b-review`/`-plural`.
   - Unit 12 ("Looking Back II — I Ate, I Drank, I Bought"): `jan`/`edan`/
     `erosi` simple past + `looking-back-2a-review`/`-plural`.
   - Unit 13 ("Looking Back II — I Had, I Walked Around"): `eduki`/`ibili`
     simple past + `looking-back-2b-review`/`-plural`.

   Each "Looking Back" unit is positioned immediately after the present-tense
   unit(s) for the same verbs (Units 1-2/4 → Unit 8/9; Units 10-11 → Units
   12-13), so present and past arrive close together instead of "present for
   everyone, then past for everyone much later." `conjugations.past` was added
   to `joan`/`etorri`/`jan`/`edan`/`erosi`/`ikusi`/`eduki`/`ibili` (8 new
   tables — `izan`/`egon`/`ukan` already had theirs from an earlier session);
   `sentences.past`/`pronounSentences.past` are aliased to each verb's
   `present` arrays by reference (same `pickVariant`-compatible reuse loop as
   the future tense), and `negativeSentences.past` is aliased only for the
   four single-word past forms (`izan`/`egon`/`ukan`/`eduki`) where the past
   form stays intact under negation — periphrastic pasts (`joan nintzen`,
   `ikusi nuen`, ...) split apart under negation just like their present
   counterparts, so they get no `negativeSentences`. See
   `docs/LANGUAGE_DECISIONS.md` for the conjugation-data sourcing.

**Renumbering**: old Units 7-11 (`jan`/`edan`/`erosi`/`ikusi` present through
Gate B) → new Units 10-11 + 14-19 (the `+8`/`-1`/`+N` shifts come from
absorbing old Unit 12's "I Was, I Had" content into new Unit 8, inserting
Units 3/8/9/12/13, and the future split). Old Units 13-25 (Phase III onward)
→ new Units 20-32, a flat `+7` shift (old Unit 12 is absorbed into new Unit 8,
so it has no new-numbering counterpart). **Old `DECISIONS.md`/
`LANGUAGE_DECISIONS.md` entries below this one use the *old* numbering** —
they're a historical record of what was true when written, not rewritten for
this renumbering. Use this entry's mapping to translate: old 5→6, old 6→7, old
7→10, old 8→11, old 9→14-17 (split), old 10→18, old 11→19, old 12→(absorbed
into 8), old 13→20, old 14→21, old 15→22, ..., old 25→32 (flat `+7` from old
13 onward).

**Why reordering `LESSONS` is safe:** `getUnlockedLessonIds` unlocks a lesson
once its *predecessor in `LESSONS` order* has `attempts > 0`, **or** the
lesson itself already has `attempts > 0` (2026-06-12, "Already-attempted
lessons stay unlocked" below) — so inserting new lessons (the Looking Back
units, `ikusi-present`/`-plural`) into the middle of `LESSONS` doesn't re-lock
anything for an existing learner who'd progressed past that point; it only
adds new content for them to backfill. No `STORAGE_KEY` bump — all existing
lesson ids are unchanged, only reordered/regrouped, plus new ids appended.

**Why split into singular/plural "Looking Back" sub-units rather than one big
unit per verb group:** follows the same "max 3 persons per exercise" /
singular-plural-pair convention already established for Units 10-17
(2026-06-12, "App-wide 'max 3 persons per exercise' rule" below) — six verbs ×
(present + past) would otherwise reproduce the old Unit 9's 30+-lesson pacing
cliff this redesign set out to fix.

## 2026-06-12 — Added a UI-only "optional account" prototype to the Profile tab, with mock sign-in state

**Decision:** Added `AccountSection` (a card in `ProfileTab`) and
`AccountModal` (a sign-in bottom sheet, mirroring `FeedbackModal`'s
structure) to `src/App.jsx`, plus `account*` translation keys in all three
locales. The whole flow — "send sign-in link" → "check your email" → a
first-sync merge-choice screen (shown only if the device has local progress)
→ signed-in state with a "Sign out" button — is driven entirely by mock
`useState` in `HomeScreen` (`account`, `showAccountModal`). There is no real
authentication, network request, or backend; "Continue (demo)" stands in for
clicking the email link, and the merge choice is captured but doesn't alter
`progress` since there's no real cloud data to merge with.

**Why:** this was scoped as a UI-first exploration of "what would an optional
cross-device sync account feel like?" before committing to real auth/backend
work (magic-link email, a Worker + KV/D1 datastore, etc. — a bigger and
separate effort). Mock state is deliberately **not persisted** to
`localStorage`: inventing a storage key/schema for throwaway prototype state
would add versioning overhead (per this doc's `STORAGE_KEY` guidance) for a
data shape that will change once real auth is designed. If this UX direction
is approved, a follow-up decision should cover the real auth method and sync
backend, and at that point `account` state would move to persisted storage
with its own versioned key.

## 2026-06-12 — Hardcoded the feedback worker's URL as a default in `src/App.jsx`, `VITE_FEEDBACK_API_URL` now just an override

**Decision:** `FEEDBACK_API_URL` now falls back to the deployed worker's URL
(`https://aditzak-feedback.inakiibarrola.workers.dev`) when
`VITE_FEEDBACK_API_URL` is unset/empty, following the same `|| DEFAULT_X`
pattern `src/analytics.js` uses for PostHog. `.env.example` and
`docs/CLOUDFLARE_FEEDBACK_WORKER.md` updated accordingly; the env var/repo
variable is now only needed to point at a *different* worker (a fork's own
deployment, or local `wrangler dev`).

**Why:** the original "build-time env var, no committed default" choice (see
the "Added a feedback form/modal" entry below) was made before the worker was
deployed and its URL was unknown. In production this left
`VITE_FEEDBACK_API_URL` empty (the `FEEDBACK_API_URL` repo variable was never
set), so `fetch('')` resolved to the Pages site's own URL and got a 405 from
GitHub Pages — feedback submission silently failed. The worker's URL isn't
sensitive (CORS is locked to `ALLOWED_ORIGIN` regardless of who knows the
URL), so hardcoding a working default removes this footgun entirely while
still allowing overrides.

## 2026-06-12 — App-wide "max 3 persons per exercise" rule, applied to Units 6-9 via singular/plural lesson pairs

**Decision:** Generalized the previous entry's fix into a hard app-wide rule:
no single exercise drills more than 3 grammatical persons at once. Added a
second constant, `PHASE_1_PLURAL_PERSONS = ['gu', 'zuek', 'haiek']`, alongside
`PHASE_1_PERSONS`. Applied it retroactively:

- **Unit 6** ("Expansion — Bringing in the Plural"): `unit-6-review-1/-2/-3`
  now use `persons: PHASE_1_PLURAL_PERSONS` instead of the full 6-person table
  — fitting given the unit's framing is specifically "here are the new plural
  forms".
- **Units 7-9** (which previously gave every new verb/tense a full 6-person
  grid in one lesson, per `LEARNING_JOURNEY.md`'s "Person-Expansion Rule"):
  every (verb × tense) practice lesson and unit review is now split into a
  `persons: PHASE_1_PERSONS` lesson immediately followed by a `-plural`
  sibling using `persons: PHASE_1_PLURAL_PERSONS` — e.g. `jan-present` /
  `jan-present-plural`, `unit-7-review` / `unit-7-review-plural`. `journey.js`'s
  `lessonIds` for Units 7-9 were updated to interleave each pair in order.
  `nahi`/`jakin` (3-person-only tables) and Unit 9's `nahi-future`/
  `jakin-future` are unaffected (nothing to split). `unit-9-review-2-plural`
  is asymmetric — its singular sibling covers `nahi`/`jakin`/`joan`/`etorri`
  future, but the plural sibling only covers `joan`/`etorri` future since
  `nahi`/`jakin` have no plural forms.
- `describeLesson` (`App.jsx`) now reads `lesson.persons` and appends a
  `personsLabel` (the persons joined with `/`, e.g. `ni/zu/hura` or
  `gu/zuek/haiek` — literal Basque pronouns, language-independent like
  `TENSE_META`'s `basque` field) to `title.secondary` and `heading`, so
  singular/plural sibling lessons are visually distinguishable in the lesson
  list, progress tab, and results screen. Previously two lessons with the same
  `verbId`/`tense` (or the same review `sources`) would have rendered
  identically.

**Why:** doubles the lesson count for Units 7-9 (e.g. Unit 9 goes from 13
lessons to 32), but keeps every exercise within the "≤3 persons" rule while
still introducing each verb's full paradigm — just across two consecutive,
clearly-labeled lessons instead of one overloaded one. No `STORAGE_KEY` bump:
the new `-plural` ids are simply new entries in the progress map, and existing
progress for ids that keep their id (`jan-present`, etc.) remains valid since
`bestStars`/`bestScore` are ratio-based and the question count per lesson is
unchanged (`TARGET_EXERCISE_COUNT`-driven `rounds` formula, now divided across
3 persons instead of 6).

## 2026-06-12 — Restored Phase I's 3-person pacing with a `persons` filter on `generateQuestions`

**Decision:** Added an optional `persons` field to `generateQuestions`'s
options (`lessonLogic.js`) — when set, it replaces `Object.keys(table)` as the
set of grammatical persons a lesson drills (and the pool `buildOptions`/
`buildSpotErrorQuestion` draw distractors/companions from). `createExerciseState`
(`App.jsx`) reads `lesson.persons` and uses its length (instead of the full
table's) when computing `rounds`, so a filtered lesson's question count is
unchanged. Added a `PHASE_1_PERSONS = ['ni', 'zu', 'hura']` constant and set
`persons: PHASE_1_PERSONS` on `izan-present`, `egon-present`, `unit-1-review`,
`ukan-present`, `unit-2-review`, `joan-present`, `etorri-present`,
`unit-3-review`, and `unit-5-review-1/-2/-3`. `unit-6-review-*` (the
"Expansion" reviews) are deliberately left unfiltered — that's the unit where
`gu`/`zuek`/`haiek` are meant to first appear.

**Why:** Unit 6 grew `izan`/`egon`/`ukan`/`joan`/`etorri`'s `conjugations.present`
tables from 3 to 6 persons *in place* (2026-06-12 "Implemented Unit 6" below),
and that entry's "Side effect" section flagged but accepted the resulting
cascade: every earlier lesson reusing those tables (Units 1-3's own practice
lessons, their reviews, and Unit 5's negation reviews) started drilling all 6
persons too. In practice that meant a brand-new learner's very first exercise
(`izan-present`) jumped straight to `ni`/`zu`/`hura`/`gu`/`zuek`/`haiek` —
exactly the "too many new forms in one exercise" Unit 6 was supposed to be the
*first* place to introduce. A `persons` filter (option (b) from
`docs/EXERCISE_ENGINE.md`'s "Phase I's 3-person horizon", previously passed
over in favor of (a) for Unit 6 itself) re-restricts just the affected
pre-Expansion lessons back to `ni`/`zu`/`hura` without touching the underlying
`VERBS` tables — Unit 6 remains the single deliberate point where the
6-person grid is introduced, for every verb at once, as designed. As a side
benefit, `unit-5-review-*` (negation drills) no longer falls back to
non-negation `sentence`/`pronoun` questions for `gu`/`zuek`/`haiek` (which have
no `negativeSentences`), since those persons are now filtered out entirely.

**General principle for later units:** don't let a unit's exercises drill more
grammatical persons/forms at once than that point in the journey has actually
introduced — use `persons` (or author a smaller table) for any future lesson
that would otherwise inherit a larger table than its place in the journey
calls for.

## 2026-06-12 — Added a feedback form/modal to the Profile tab, wired to the feedback worker via `VITE_FEEDBACK_API_URL`

**Decision:** Added `FeedbackModal` (`src/App.jsx`), opened from a new "Send
feedback" button in `ProfileTab`. The modal is a `message` textarea
(required, `maxLength` 2000) + optional `email` field, `POST`ing
`{ message, email, context: 'profile' }` as JSON to
`import.meta.env.VITE_FEEDBACK_API_URL` — the field limits and payload shape
match the worker added in the 2026-06-12 "Added a standalone Cloudflare
Worker for feedback emails" entry below. Shows a success state on `response.ok`,
or a generic translated error otherwise (network failure, non-2xx, or the env
var unset/empty — `fetch(undefined, ...)` resolves to a relative request that
404s, hitting the same error path). Added `VITE_FEEDBACK_API_URL` to
`.env.example` and `.github/workflows/deploy.yml` (as `vars.FEEDBACK_API_URL`),
following the `VITE_POSTHOG_KEY`/`VITE_POSTHOG_HOST` pattern — build-time env
var, no committed default, since the worker isn't deployed yet and its URL
isn't known. Added `feedback*`/`profileFeedback` keys to all three
`TRANSLATIONS` locales.

**Why no client-side "is the endpoint configured" check:** letting the
`fetch` itself fail and showing the same generic error message for "not yet
configured" and "configured but request failed" avoids a third UI state for a
condition (`VITE_FEEDBACK_API_URL` unset) that's purely a deployment detail —
both cases mean "feedback didn't go through, try again later" from the
learner's perspective. `docs/CLOUDFLARE_FEEDBACK_WORKER.md` documents that the
form renders either way and explains the unset-var behavior for whoever sets
`FEEDBACK_API_URL` once the worker is deployed.

**Why `context: 'profile'` rather than the current lesson/tab:** the feedback
button only exists in the Profile tab (no entry point from an exercise
screen), so `context` is a fixed string for now — the worker's `context`
field already supports richer values if a future entry point (e.g. from
`MultipleChoiceScreen`) wants to report `lessonId`/`verbId`/`tense`.

## 2026-06-12 — Added a manually-triggered workflow to set the worker's `RESEND_API_KEY` secret, as a CLI-free alternative to `wrangler secret put`

**Decision:** Added `.github/workflows/set-worker-secret.yml`
(`workflow_dispatch` only) — installs `worker/`'s deps and runs
`wrangler secret put RESEND_API_KEY` reading the value from a `RESEND_API_KEY`
repo secret, authenticated via the existing `CLOUDFLARE_API_TOKEN`/
`CLOUDFLARE_ACCOUNT_ID`. Documented in `docs/CLOUDFLARE_FEEDBACK_WORKER.md` as
the "no CLI access" path, with a note that the `RESEND_API_KEY` repo secret can
be deleted afterwards since Cloudflare stores it on the worker from then on.

**Why a separate manual workflow, not a step in `deploy-worker.yml`:** the
2026-06-12 entry below ("Added CI deploy for the feedback worker") chose to
keep `RESEND_API_KEY` Cloudflare-side only, set once via CLI, specifically to
avoid duplicating it into GitHub secrets and re-running `secret put` on every
push. That reasoning still holds for users *with* CLI access. But for a user
with none, a one-time manually-triggered workflow achieves the same
"set once, never touched again" property without adding any step to the
push-triggered deploy — `deploy-worker.yml` itself is unchanged.

## 2026-06-12 — Updated `base`/package names/CORS origin for the `gorbeia/testapp005` → `Mintzan/aditzak` repo rename

**Decision:** The GitHub Pages deploy workflow (`.github/workflows/deploy.yml`)
still ran successfully after the repo was renamed, but `vite.config.js`'s
`base: '/testapp005/'` no longer matched the new Pages URL
(`https://mintzan.github.io/aditzak/`), so every built asset URL 404'd and the
deployed site loaded blank. Updated `base` to `/aditzak/`, renamed
`package.json`/`package-lock.json` from `testapp005` to `aditzak`, and updated
the feedback worker's `ALLOWED_ORIGIN` (`worker/wrangler.toml` +
`docs/CLOUDFLARE_FEEDBACK_WORKER.md`'s example) from `gorbeia.github.io` to
`mintzan.github.io`.

**Why:** this is exactly the case the 2026-06-07 "Deploy to GitHub Pages"
entry below flagged — `base` was hardcoded "since the app isn't expected to be
renamed/forked — update `base` if that changes." The rename happened, so the
update follows that documented plan. `ALLOWED_ORIGIN` isn't load-bearing yet
(the feedback worker isn't wired into the app), but keeping it consistent with
the actual Pages origin avoids a stale value surprising whoever wires it up.

## 2026-06-12 — Implemented Unit 9 (future tense, 13 verbs), reused present-tense sentences by reference, split review into 4 lessons

**Decision:** Added a `conjugations.future` table to all 12 of Units 1-8's
verbs except `ari` (`izan`, `egon`, `ukan`, `nahi`, `jakin`, `joan`, `etorri`,
`jan`, `edan`, `erosi`, `ikusi`, `eduki`, `ibili`), per `docs/CONJUGATIONS.md`
§11's `-ko`/`-go` participle + present-auxiliary rule. Added `TENSE_META.future`
(`labelKey: 'tenseFuture'`, `basque: 'geroa'`) and the corresponding
`tenseFuture` translation key (en/es/eu). Since a sentence template's blank
doesn't depend on tense (`"Ni irakaslea ___."` fits `naiz` or `izango naiz`
equally), verbs with a new `future` table have their `sentences.future`/
`pronounSentences.future` set to alias their existing `present` arrays by
reference in a small post-`VERBS` loop, rather than duplicating ~150 lines of
sentence data. Added 13 `<verbId>-future` practice lessons to `LESSONS`
(one per verb, mirroring the existing per-(verb×tense) convention) plus four
`unit-9-review-N` reviews of 3-4 sources each (~18 questions apiece), following
Units 5/6's precedent for splitting oversized consolidation passes. Flipped
Unit 9 to `available` in `journey.js` with all 17 lesson ids. Required zero
changes to `lessonLogic.js`/the exercise engine — confirmed via lint, the full
test suite, build, and a live Playwright run of `izan-future` (preview shows
`izango naiz/zara/da/gara/zarete/dira`; exercise renders a future sentence-fill
question correctly).

**Why:** `docs/LEARNING_JOURNEY.md` describes Unit 9 as reusing "Unit 1-8
auxiliary tables; only the participle-formation rule is new" — confirmed true
in practice. `ari` was excluded because its periphrastic future ("ari izango
naiz") is grammatically valid but rarely used and not part of Unit 9's payload
(see `docs/LANGUAGE_DECISIONS.md` for the linguistic rationale). 13 practice
lessons is the largest single-unit verb count so far, so a single review would
be unwieldy — four grouped reviews matches the question-count ballpark of
other units' reviews while still covering every verb's future forms.

## 2026-06-12 — Implemented Unit 8 (`eduki`/`ibili`), no extra dedicated practice lesson

**Decision:** Added `eduki` (nor-nork, `daukat`/`daukazu`/`dauka`/`daukagu`/
`daukazue`/`daukate`, object fixed `hura`) and `ibili` (nor,
`nabil`/`zabiltza`/`dabil`/`gabiltza`/`zabiltzate`/`dabiltza`) to `VERBS`, both
`type: 'synthetic'` per `docs/CONJUGATIONS.md` §7, both full 6-person grids
from their first lesson. Added `eduki-present`/`ibili-present`/
`unit-8-review` to `LESSONS` and flipped Unit 8 to `available` in
`journey.js` — same `(2 new verbs) + (1 review)` shape as Unit 7, no code
changes needed. Both are single-word forms that stay intact under negation,
so both got `negativeSentences` (ni/zu/hura), like `izan`/`egon`/`ukan`/
`joan`/`etorri`/`jakin`. `eduki`'s present table uses the singular-object
alternants (`daukat`, not `dauzkat`) — consistent with `object: 'hura'`
fixed-singular, same convention as `ukan`.

**Why:** `docs/LEARNING_JOURNEY.md` flags Unit 8 as needing "first full
6-person transitive grid" extra practice (§6's flagged-units list), but Unit 7
(`jan`/`edan`/`erosi`/`ikusi`) already implemented exactly that — every new
verb gets a full 6-person grid from lesson one, per the Person-Expansion Rule
— so by the time Unit 8 was built there was nothing structurally new left to
drill in isolation. Treating that flag as superseded by Unit 7's
implementation and following Unit 7's plain `(verbs) + (review)` shape was
simpler and avoided a redundant lesson; revisit if a future unit's extra-lesson
flag turns out to describe something Unit 7 *didn't* already cover.

## 2026-06-12 — Home screen scroll restoration via `window`/`document` APIs, no library

**Decision:** Added scroll handling around `HomeScreen` in `App.jsx`: on the
very first load, scroll to the last lesson the learner completed
(`getLastPlayedLessonId` in `lessonLogic.js`, keyed off `lastPlayed`); when
returning from an exercise (`onExit`/`onComplete`), restore the `window.scrollY`
the learner had right before opening it. Implemented with a `scrollTarget`
prop computed in `AppShell` (`{ type: 'lastLesson', lessonId }` or
`{ type: 'restore', y }`), consumed by a mount-only `useEffect` in
`HomeScreen` that calls `scrollIntoView`/`scrollTo` inside a
`requestAnimationFrame` (the lesson list isn't at its final layout height on
the same tick as the initial commit). Each `LessonNode` got an
`id={`lesson-${lesson.id}`}` so it can be targeted by `getElementById`.

**Why:** `HomeScreen` scrolls the whole document (`min-h-dvh`, no
`overflow-y-auto` wrapper — unlike `MultipleChoiceScreen`'s fixed `h-dvh`
container), so plain `window`/`document` APIs are sufficient; no scroll-restoration
library needed. `HomeScreen` unmounts whenever `activeLessonId` is set (it's
one of `AppShell`'s two top-level returns), so its scroll position is lost on
every exercise — capturing it in `AppShell` (which stays mounted) and replaying
it via a `[]`-deps effect on remount was the simplest fix. Verified manually
with Playwright; `page.reload()` triggers Chromium's own scroll restoration
*after* React's effects and clobbers the result, so the fresh-navigation
(`page.goto` + `addInitScript`) case is the one that matters and was confirmed
working.

## 2026-06-12 — Fixed `ari`'s `zu` example sentence to include an explicit subject

**Decision:** Changed `ari`'s `sentences.present.zu` from `'Zer ___?'` to
`'Zu zer ___?'`. Same issue as the `nahi`/`zu` fix below: without an explicit
subject, `'Zer ___?'` was ambiguous between `ari naiz`/`ari zara`/`ari da` —
all three complete it into an equally valid (just differently-meant) Basque
question ("What am I/are you/is he-she up to?"), so a learner had no way to
tell which person's form was being asked for. `ari`'s `agreement` is `nor`
(absolutive), so the fix prefixes the absolutive `Zu` rather than the
ergative `Zuk` the `nahi` fix used. `'Zu zer ___?'` → `'Zu zer ari zara?'`
("You, what are you up to?") still reads naturally and keeps the other `zu`
variants (`'Zu zer egiten ___?'`, `'Zu irakurtzen ___?'`) distinct.

## 2026-06-12 — Review lessons get up to 4 extra "weak spot" questions, targeting the learner's most-missed verb/tense/person combos

**Decision:** `exerciseReducer`'s `answer` action now tracks `misses` — one
`{ verbId, tense, person }` entry per question gotten wrong on the *first*
attempt (retries don't count again, mirroring how `correctCount` already only
credits first attempts). `ExerciseScreen` passes `state.misses` through
`onComplete`, and `AppShell` merges them into a new `aditzak:errors:v1`
storage key via `recordErrors` — a map keyed by `verbId:tense:person`, each
entry holding a running `count` and `lastMissed` timestamp. `handleResetProgress`
clears it alongside `progress`/`dailyStreak`/`points`.

`createExerciseState` now also takes `errorStats`, and for `review: true`
lessons calls `getWeakSpotQuestions(errorStats, lesson.sources, VERBS)` —
this picks up to `EXTRA_REVIEW_EXERCISES` (4) of the learner's most-missed
verb/tense/person combos *among this review's own sources* (so a review only
ever drills forms it actually covers), sorted by miss count then recency, and
generates one fresh `generateQuestions` roll for each. These extra questions
are shuffled in alongside the review's normal cross-section, so `total` grows
by up to 4 for a learner with relevant weak spots and is unchanged (0 extra)
for one with none recorded yet.

**Why "among this review's own sources" rather than globally weakest:** a
review lesson's whole point is drilling the verb/tense pairs it was built
from (per the "Every available unit ends with a trailing 'Unit review'
lesson" entry below) — pulling in a weak spot from an unrelated unit would mix
unrelated content into what's supposed to be that unit's consolidation pass.
Scoping to `sources` keeps the boost relevant while still reaching across
*all* of a review's sources (not just one verb), since reviews already mix
several.

**Why re-roll via `generateQuestions` rather than replaying the exact missed
question:** "similar to the failed ones" reads better as another attempt at
the same conjugated-form slot — possibly a different framing/kind or sentence
variant, per the existing per-question rolls — than as literally repeating the
identical question (same sentence, same distractor set) the learner just got
wrong. A person whose conjugation table no longer has the recorded `person`
(e.g. a future data change) is filtered out rather than falling back to a
different person, so "weak spot" questions always match what they claim to
target.

**Why a separate storage key, no `STORAGE_KEY` bump:** same precedent as
`aditzak:streak:v1`/`aditzak:points:v1` — error stats are orthogonal to any
single lesson's `progress` entry and "Reset progress" can clear it
independently.

## 2026-06-12 — Split `unit-5-review`/`unit-6-review` into three reviews each, paired across origin units

**Decision:** Replaced the single `unit-5-review` (6 sources, ~33 questions)
and `unit-6-review` (5 sources, 30 questions) lessons with
`unit-5-review-1`/`-2`/`-3` and `unit-6-review-1`/`-2`/`-3`. Every resulting
lesson lands at exactly 12 questions (`TARGET_EXERCISE_COUNT`) — two 6-person
sources give 6+6, a 6-person + 3-person pair (`jakin`) gives 6+6 via the
`rounds` formula, and a single 6-person source (Unit 6's `etorri`-only
review) gets 2 rounds for 12. Updated `journey.js`'s `lessonIds` for Units
5/6 to the new three-lesson arrays, in order.

Sources are paired *across* their originating units rather than keeping each
origin unit's own pair together: `unit-5/6-review-1` = `izan`(U1)+`ukan`(U2),
`-2` = `egon`(U1)+`joan`(U3), `-3` = `jakin`(U2)+`etorri`(U3) for Unit 5 (Unit
6 drops `jakin`, so its `-3` is `etorri` alone).

**Why:** ~30-33 questions in one sitting was flagged as too long (this entry
follows directly from the "documented tradeoff... flagged here in case a
future session wants to trim it" note in the 2026-06-12 "Implemented Unit 6"
entry below). An earlier version of this split grouped sources by originating
unit (`izan`+`egon`, `ukan`+`jakin`, `joan`+`etorri`), but that defeats a
Refresh Gate's purpose per `docs/LEARNING_JOURNEY.md` — a cumulative
cross-unit mixer, not three separate "redo this unit" sessions. Pairing
across origins keeps each lesson a genuine mix while still hitting 12
questions. Reusing the existing `rounds = max(1, round(targetPerSource /
personCount))` machinery needed no engine changes — `getUnlockedLessonIds`
and `describeLesson` already handle any number of review lessons per unit. No
`STORAGE_KEY` bump: old `unit-5-review`/`unit-6-review` progress entries (if
any) simply become orphaned/unused, same as any renamed lesson id.

Lesson naming stays generic (`unit-5-review-1`/`-2`/`-3`, displayed via
`describeLesson`'s existing "Mixed Review" label) rather than themed by
sentence topic (e.g. "Nature", "Sport") — the current `sentences` data isn't
tagged by topic and doesn't cover topics like that, so topic-themed reviews
would need a separate content pass tagging sentence variants by topic across
`VERBS` first.

## 2026-06-12 — Filled the remaining sentence-variety gaps: `joan`/`etorri` (all 6 persons) and `nahi`/`jakin`'s `ni`/`zu`

**Decision:** Converted `joan`/`etorri`'s `sentences.present` from single
fixed strings to 4-6-variant arrays per person (same `pickVariant` mechanism
as `izan`/`egon`/`ukan`, per the 2026-06-11 "multiple phrasing variants"
entry), and gave `nahi`/`jakin`'s `ni`/`zu` rows variant arrays too (`hura`
already had 4 variants each). `joan`'s variants rotate the allative
destination (`hondartzara`/`eskolara`/`lanera`/`dendara`/`liburutegira`/
`unibertsitatera`/`parkera`), keeping `hura`/`haiek` rows' existing
name/animal subjects (Mikel, Ane, Txakurra). `etorri`'s mix destinations
(`etxera`/`eskolara`) with time adverbs (`orain`/`bihar`/`gaur`), matching its
existing rows' style. `nahi`/`jakin`'s new variants reuse the same
object-noun pool already used in their `hura` rows (`kafe bat`/`ur
bat`/`liburu bat`/`opari bat`/`sagar bat` for `nahi`; `erantzuna`/`egia`/
`sekretua`/`bidea` for `jakin`), with `nahi`'s `zu` row keeping the explicit
`Zuk` ergative subject (per the 2026-06-11 "nahi's zu example sentence"
entry).

**Why:** these were the last `sentence`/`type-verb`/`spot-error`-eligible
persons across Phase I/II still showing the exact same sentence every time a
question repeats — `joan`/`etorri` had zero variants on any person, and
`nahi`/`jakin`'s `ni`/`zu` had one each. New vocabulary is reused from
elsewhere in `VERBS`/`docs/SAMPLE_SENTENCES.md` rather than invented, per the
doc's "no inventing vocabulary on the fly" guidance. `pronounSentences`/
`negativeSentences` stay single-string — still deferred, per
`docs/SAMPLE_SENTENCES.md`'s "Next steps" item 3.

## 2026-06-12 — Added CI deploy for the feedback worker (`cloudflare/wrangler-action`)

**Decision:** Added `.github/workflows/deploy-worker.yml`, running
`wrangler deploy` on pushes to `main` that touch `worker/**` (or manual
dispatch), authenticated via `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`
repo secrets. Documented token creation/scoping in
`docs/CLOUDFLARE_FEEDBACK_WORKER.md`.

**Why:** keeps the worker deploy on the same "push to main → live" model as
the GitHub Pages site (`deploy.yml`), rather than relying on manual
`wrangler deploy` from a developer machine. `RESEND_API_KEY` stays a
Cloudflare Worker secret (set once via `wrangler secret put`, not a GitHub
secret) since it's read by the worker at runtime, not by the CI job.

## 2026-06-12 — Added a standalone Cloudflare Worker for feedback emails (Resend), no storage/UI yet

**Decision:** Added `worker/` — a Cloudflare Worker (`wrangler.toml` +
`src/index.js`) exposing a single `POST` endpoint that validates a
`{ message, email?, context? }` JSON body and relays it as an email via the
[Resend](https://resend.com/) API to `FEEDBACK_TO_EMAIL`. CORS is restricted
to `ALLOWED_ORIGIN`. No database/KV — each submission is just forwarded, not
stored. See `docs/CLOUDFLARE_FEEDBACK_WORKER.md` for setup/deploy.

**Why:** chose the "lighter" of the options discussed (Worker+D1 vs.
Worker+webhook/email) since feedback volume for this app doesn't justify a
database yet — an email per submission is enough, and avoids provisioning/
managing D1. Resend over a Discord/Slack webhook because feedback lands
directly in the maintainer's inbox. This is infrastructure only: the app
doesn't call this worker yet (no feedback form/UI, no `VITE_FEEDBACK_API_URL`
wiring) — that's a deliberate follow-up so the worker can be deployed and its
URL known first.

## 2026-06-12 — Implemented Unit 7 ("Daily Routine (Transitive)"), adding `jan`/`edan`/`erosi`/`ikusi` as periphrastic NOR-NORK verbs with full 6-person grids

**Decision:** Added four new `VERBS` entries — `jan`, `edan`, `erosi`,
`ikusi` — each `type: 'periphrastic'`, `agreement: ['nor', 'nork']`,
`object: 'hura'` (citation paradigm, same as `ukan`/`nahi`/`jakin`), and
`conjugations.present` built from each verb's imperfective participle
(`jaten`/`edaten`/`erosten`/`ikusten`) + `ukan`'s present auxiliary
(`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`) — `docs/CONJUGATIONS.md` §7's
"Present (oraina)" column for all four (see `docs/LANGUAGE_DECISIONS.md` for
`jan`/`edan`/`erosi`'s new tables; `ikusi`'s was already documented).

Per the Person-Expansion Rule (`docs/LEARNING_JOURNEY.md`), Unit 7 is the
first unit past Refresh Gate A, so all four verbs start at the full
`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek` grid from their first lesson — no
3-person trim, no later expansion pass. `pronouns` reuse `ukan`'s ergative set
(`Nik`/`Zuk`/`Hark`/`Guk`/`Zuek`/`Haiek`). No `negativeSentences` — like
`nahi`/`ari`, these are two-word forms that break apart under negation
(out of scope until a future negation-of-periphrastics pass).

Added `jan-present`/`edan-present`/`erosi-present`/`ikusi-present` plus
`unit-7-review` (sources = all four, present tense) to `LESSONS`, and flipped
Unit 7 to `available` in `journey.js` with those five `lessonIds`.

**Why "oraina"/present rather than the journey doc's literal "I ate"/"I
bought" payload glosses for `jan`/`erosi`:** `docs/LEARNING_JOURNEY.md`'s
Unit 7 payload glosses read past-tense in English ("I ate." / "I bought a
book.") for `jan`/`erosi` but present for `edan`/`ikusi` ("You drink water." /
"Do you see it?") — these are loose "what this unit lets you say" framings,
not a literal spec for which participle (perfective vs. imperfective) each
verb's table should use. Using the imperfective-participle "Present (oraina)"
column uniformly for all four (`jaten`/`edaten`/`erosten`/`ikusten dut`)
keeps `TENSE_META.present`'s "oraina" label accurate for every verb in the
lesson, matches `ikusi`'s already-documented table exactly, and needs no new
tense bucket. "I eat/drink/buy/see [it]" fits "Daily Routine" at least as well
as the journey's literal glosses.

## 2026-06-12 — Implemented Unit 6 ("Expansion — Bringing in the Plural", Refresh Gate A), growing `izan`/`egon`/`ukan`/`joan`/`etorri`'s present tense to the full 6-person grid in place

**Decision:** Added `gu`/`zuek`/`haiek` rows (per `docs/CONJUGATIONS.md` §1/§3/§6)
directly to `izan`/`egon`/`ukan`/`joan`/`etorri`'s existing `present`
`conjugations`, plus matching `sentences`, `pronouns`, and `pronounSentences`
entries for those three persons — option (a) from `docs/LEARNING_JOURNEY.md`'s
"Data & architecture implications" section, picked over adding a `persons`
filter to `generateQuestions` (option (b)) because it needs no engine change
and matches "Unit 6 = Expansion" literally: the same five tables that taught
`ni`/`zu`/`hura` now teach the full grid. `jakin`/`nahi`/`ari` are untouched —
the journey explicitly scopes Unit 6 to those five verbs (`nahi`/`ari` "ride"
`izan`/`ukan`'s tables and `jakin` isn't listed at all).

Added `unit-6-review` (`review: true`, `sources` = the five expanded verbs'
present tense, no `negation`) and flipped Unit 6 to `available` with
`lessonIds: ['unit-6-review']` in `journey.js`.

**Why no `negativeSentences` for `gu`/`zuek`/`haiek`:** Unit 6's focus is
person-grid expansion, not negation (Unit 5 already covered that for
`ni`/`zu`/`hura`). Leaving `negativeSentences` at 3 persons means
`unit-5-review` (which sets `includeNegation: true`) now falls back to the
normal `sentence`/`pronoun`/... mix for `gu`/`zuek`/`haiek` on replay (those
persons have no `negativeSentences[tense][person]`, so `includeNegation`'s
"exclusively negation" branch doesn't apply to them) — a minor dilution of
that lesson's focus on replay, consistent with the existing "data sits unused
for verbs/persons that don't have it" precedent from Unit 5's own entry above.

**Side effect — `conjugations.present` growing from 3 to 6 persons cascades
into every existing lesson/review that references these tables**
(`izan-present`, `egon-present`, `ukan-present`, `joan-present`,
`etorri-present`, `unit-1/2/3/5-review`): `generateQuestions` builds one
question per person in the table, so those lessons now drill all 6 persons
instead of 3. `createExerciseState`'s `rounds = round(targetPerSource /
personCount)` mostly self-corrects single-verb lessons back toward
`TARGET_EXERCISE_COUNT` (e.g. a 3-person lesson's 4 rounds become a 6-person
lesson's 2 rounds, ~12 questions either way), but `unit-5-review` mixes five
now-6-person sources with one still-3-person source (`jakin`) under a
per-source `max(1, …)` floor, so it grows from ~18 to ~33 questions. This is
the documented tradeoff of option (a) — accepted as appropriate for a Refresh
Gate's cumulative review, but flagged here in case a future session wants to
trim it.

## 2026-06-12 — Replaced Cloudflare Web Analytics with PostHog, and added `lesson_started`/`lesson_completed` custom events

**Decision:** Swapped `src/analytics.js`'s `loadCloudflareAnalytics` for
`initAnalytics` (PostHog, EU cloud), called once from `src/main.jsx`, using
the same "committed default + env var override" pattern as before
(`DEFAULT_POSTHOG_KEY`/`DEFAULT_POSTHOG_HOST`, overridable via
`VITE_POSTHOG_KEY`/`VITE_POSTHOG_HOST`). `.github/workflows/deploy.yml` now
passes through `POSTHOG_KEY`/`POSTHOG_HOST` repo variables instead of
`CF_BEACON_TOKEN`. Full setup instructions live in
`docs/POSTHOG_ANALYTICS.md` (replacing `docs/CLOUDFLARE_ANALYTICS.md`).

Also added `trackEvent(name, properties)`, a thin wrapper around
`posthog.capture` that no-ops until `initAnalytics` has run (so tests, which
render components without the app's entry point, don't need a PostHog
instance). Two events are now fired from `App.jsx`: `lesson_started` (in
`ExerciseScreen`, once the preview is dismissed/skipped — `lessonId`,
`review`, `attemptNumber`, plus `verbId`/`tense` for practice lessons) and
`lesson_completed` (in `AppShell`'s `onComplete` — `lessonId`, `review`,
`correctCount`, `total`, `stars`, `isRepeat`, `pointsEarned`).

**Why PostHog over Cloudflare:** Cloudflare Web Analytics only does automatic
pageviews, with no custom-event API — it couldn't answer "where do learners
drop off in the lesson funnel" or "which lessons get replayed". PostHog's free
tier (1M events/mo) covers this app's scale and keeps autocaptured
pageviews/clicks plus custom events in one tool. `person_profiles:
'identified_only'` is set since the app never calls `posthog.identify()` —
events are still captured under an anonymous distinct ID without creating
billable person profiles.

**Why `lesson_started`/`lesson_completed` first:** these are the minimal pair
needed to compute a per-lesson funnel (start → completion rate) and see which
lessons/tenses are hardest (via `correctCount`/`total`/`stars`) or most
replayed (`isRepeat`) — the two events discussed as highest-value before
finer-grained instrumentation (per-question answers, tab switches, etc.),
which can be added later the same way.

## 2026-06-12 — Added Cloudflare Web Analytics, with the beacon token committed as a default in `src/analytics.js`

**Decision:** Added `src/analytics.js`'s `loadCloudflareAnalytics`, called
once from `src/main.jsx`, which injects Cloudflare's beacon `<script>` tag
using `DEFAULT_CF_BEACON_TOKEN` (the token for `gorbeia.github.io`'s Web
Analytics site), unless `VITE_CF_BEACON_TOKEN` is set to override it.
`.github/workflows/deploy.yml` passes a `CF_BEACON_TOKEN` repo variable
through as that env var, for forks/alternate deployments that want their own
Cloudflare site. `.env.example` documents the same for local overrides. Full
setup instructions (creating the Cloudflare Web Analytics site, getting the
token, overriding it) live in `docs/CLOUDFLARE_ANALYTICS.md`.

**Why commit the token as a default:** Cloudflare Web Analytics beacon tokens
are not secrets — they're embedded in every page's public HTML/JS by design,
and can only be used to *send* beacons to that Cloudflare account, not read
data back out. Committing it means analytics work on the deployed site with
zero configuration, instead of requiring a one-time GitHub Actions variable
setup. The env var override exists only for forks that want their own
Cloudflare account, not as a secrecy mechanism.

## 2026-06-12 — Implemented Unit 5 ("REFRESH — The Inversion Matrix"), introducing negation via a new `negativeSentences` data shape and `negative`/`type-negative` question kinds

**Decision:** Added `verb.negativeSentences[tense][person]` — sentence
templates in negative word order (`ez` immediately before the verb, with "ez
[verb]" fronted to right after the subject, e.g. `'Ni ez ___ irakaslea.'` →
`naiz`), and two new question kinds, `negative` (multiple-choice) and
`type-negative` (typed), that reuse `buildOptions(table, ...)` exactly like
`sentence`/`type-verb` — only the sentence template differs. Added
`negativeSentences` to `izan`, `egon`, `ukan`, `jakin`, `joan`, and `etorri`'s
present tense (3 persons each: `ni`/`zu`/`hura`).

`generateQuestions` gained `includeNegation` (default `false`). When set, a
person with `negativeSentences[tense][person]` data gets *exclusively*
`negative`/`type-negative` as its `availableKinds` (instead of the usual
`sentence`/`pronoun`/... mix) — plus the normal chance of falling back to bare
`form`. `unit-5-review` (a `review: true` lesson, `negation: true`,
`sources` covering all 6 verbs' present tense) is the only lesson that sets
`negation: true`, which `createExerciseState` forwards as `includeNegation`.
Unit 5 flipped to `available` in `journey.js` with `lessonIds: ['unit-5-review']`.
`getExplanation` gained an `explanationNegation` case for both new kinds,
explaining the `ez`-fronting word-order shift.

**Why exclusive rather than additive:** Unit 5's whole point ("Inversion
Matrix") is drilling `ez` + auxiliary-fronting. Adding `negative`/
`type-negative` as a 7th/8th option alongside the existing five would dilute
negation to "1 of 8 question kinds" — easy to not see at all in a ~12-question
session. Making it exclusive for persons with negation data, scoped to a
dedicated review lesson via `includeNegation`/`negation: true`, guarantees
every question in that lesson is a negation drill while leaving Units 1-4's
own practice lessons completely unaffected (they never pass `includeNegation`,
so `negativeSentences` data sits unused there).

**Why only 6 verbs, and only `ni`/`zu`/`hura`:** `negative`/`type-negative`
reuse the single-blank/single-`table[person]`-value shape of `sentence`/
`type-verb`, which only works when the conjugated form is one word that stays
intact under negation. `izan`/`egon`/`ukan`/`jakin`/`joan`/`etorri` all
qualify (`naiz`, `nago`, `dut`, `dakit`, `noa`, `nator`, etc.). `nahi` ("nahi
dut") and `ari` ("ari naiz") don't — their auxiliary splits off from the
invariant participle under negation ("ez dut ... nahi", "ez naiz ari ..."),
which doesn't fit a single `___` blank, so they were left without
`negativeSentences`. Limited to `ni`/`zu`/`hura` since that's the horizon all
six verbs' present tables currently cover (Phase I's 3-person horizon, per
Unit 6's pending plural expansion).

No `STORAGE_KEY` bump — new lesson id (`unit-5-review`), no change to stored
progress shape.

## 2026-06-12 — Implemented Unit 4 ("The Immediate Continuous"), modeling `ari` as its own `VERBS` entry

**Decision:** Added an `ari` entry to `VERBS` (`type: 'periphrastic'`,
`agreement: ['nor']`) whose `conjugations.present` is `ari naiz`/`ari
zara`/`ari da` — `izan`'s own present forms with the invariant `ari`
prefixed, per `docs/VERB_COVERAGE.md` §5. Added `ari-present` +
`unit-4-review` (single source) to `LESSONS`, and flipped Unit 4 to
`available` with those `lessonIds` in `journey.js`.

**Why:** same precedent as `nahi`/`jakin` (Unit 2) — `ari` isn't a separate
lexical verb, but modeling it as its own `VERBS` entry costs zero new
conjugation data (it rides `izan`'s exact `naiz`/`zara`/`da` verbatim) while
giving it its own lesson card, sentences, and review, consistent with how the
journey frames it as something new to *discover*. Unlike `nahi`/`jakin`
(which fix the auxiliary to `ukan`, hence ergative `nik`/`hik`/... pronouns),
`ari` always takes `izan`, so `pronouns` stay unmarked (`Ni`/`Zu`/`Hura`),
matching `izan`/`egon`/`joan`/`etorri`. One example sentence ("Zer ___?" →
"ari zara") reproduces the unit's own headline phrase, "Zer ari zara?".

## 2026-06-12 — Reworded the "Why is this correct?" explanations to drop linguistics jargon

**Decision:** Rewrote `explanationPronounErgative`/`explanationPronounAbsolutive`
(`src/i18n/translations.js`, all three locales) to explain the `-k` ending in
plain terms — "the person doing the action always gets a '-k'" / "only one
person here, so no '-k' is needed" — instead of naming the `ergative`/
`absolutive`/`NOR-NORK`/`NOR`/"case ending" terminology.

**Why:** the target audience is language learners, not linguistics students —
terms like "ergative case" and the `NOR-NORK` notation (meaningful to us from
`docs/CONJUGATIONS.md`) are exactly the kind of jargon a beginner has no
context for. The underlying contrast (does the verb need to mark a "doer" vs
just one plain person) is the same; only the wording changed, no behavioral
change to `getExplanation`/`FeedbackBar`.

## 2026-06-12 — Already-attempted lessons stay unlocked, even if their predecessor hasn't been attempted

**Decision:** `getUnlockedLessonIds` (`lessonLogic.js`) now also unlocks a
lesson when `progress[lesson.id]?.attempts > 0`, in addition to the existing
"previous lesson attempted" rule.

**Why:** the previous entry's new `unit-N-review` lessons get inserted into
the *middle* of `LESSONS`, immediately before the unit they review's first
lesson moves one slot later. For a learner who'd already played past that
point (e.g. completed `joan-present`), the newly-inserted `unit-2-review`
becomes `joan-present`'s predecessor — and since that review has 0 attempts,
strict linear unlocking re-locked `joan-present` despite its earned stars,
while `etorri-present` (unlocked earlier, before the insertion) stayed
unlocked. The result: a locked lesson with stars sitting before an unlocked
lesson with none. Falling back to "have I already played this one" fixes that
case and makes future mid-list insertions safe too, without weakening the
strict-linear rule for lessons never attempted.

## 2026-06-12 — Added an optional "Why is this correct?" explanation, for `pronoun`/`type-pronoun` questions only

**Decision:** Added `getExplanation(verb, question, t)` (`lessonLogic.js`),
returning a translated explanation string for `pronoun`/`type-pronoun`
questions — whether the answer pronoun (`Ni`/`Nik`, `Hura`/`Hark`, ...) takes
the ergative `-k` or stays unmarked, based on `verb.agreement` (`nork` present
→ `explanationPronounErgative`, otherwise `explanationPronounAbsolutive`) —
and `null` for every other kind. `FeedbackBar` shows it only after a *correct*
answer, as a collapsed `ExplanationToggle` pill ("💡 Why is this correct?")
above the Continue/Finish button; tapping it expands the explanation text.
`ExerciseScreen` tracks `showExplanation`, reset to collapsed on every new
answer (alongside `streakEncouragement`).

**Why only `pronoun`/`type-pronoun`:** these are the one question kind that
tests a *concept* — Basque's NOR vs NOR-NORK case marking on pronouns, which
has no equivalent in English/Spanish and is easy to answer right by
pattern-matching without understanding why. The other kinds (`form`,
`sentence`, `type-verb`, `spot-error`) are "recognize/produce this conjugated
form", which doesn't have a comparably compact "why" beyond "that's the form"
— `spot-error` in particular isn't reachable yet in any live lesson (needs ≥4
sentenced persons, not available until Unit 6's expansion), so an explanation
for it would be untested dead code for now.

**Why only on correct answers, and collapsed:** revealing the reasoning before
the learner has committed to an answer would give it away; showing it
unconditionally would clutter the feedback bar for the ~5 other question kinds
that have no explanation. A collapsed, tappable pill keeps it discoverable
without competing with the main "Bikain!"/Continue flow.

No `STORAGE_KEY` bump — purely a presentation addition, no new stored state.

## 2026-06-12 — Every available unit ends with a trailing "Unit review" lesson

**Decision:** Added `unit-1-review`/`unit-2-review`/`unit-3-review` to
`LESSONS` — `{ id, review: true, sources: [...] }` entries covering every
verb/tense the unit introduced — and appended each to its unit's `lessonIds`
in `journey.js`. This activates the `review`/`sources` shape that
`describeLesson`/`createExerciseState`/`ProgressTab` already supported but
that `LESSONS` never used.

**Why:** feedback that the journey moves too fast and units don't get enough
consolidation practice. A trailing review needs no new engine work and gives
two things at once: an extra ~9-12 question session per unit (mixing that
unit's tables together), and — for free, via existing rules — the *hardest*
lesson in the unit, since reviews skip both `NO_TYPING_ATTEMPTS`'s no-typing
ramp and `LessonPreviewScreen`'s conjugation preview. Linear unlocking
(`getUnlockedLessonIds`) means the next unit stays locked until the review's
been attempted, making it a real per-unit checkpoint — smaller-scale than the
journey's cross-phase Refresh Gates (5, 6, 11, 17, ...), which remain the
bigger consolidation passes.

**Going forward:** every unit added to `journey.js` should end its
`lessonIds` with its own `unit-N-review` entry, sourced from that unit's
verb/tense pairs — see the header comments in `journey.js`/`App.jsx`'s
`LESSONS`.

## 2026-06-11 — Added variant encouragement copy and a confetti/fireworks celebration to `LessonResultsScreen`

**Decision:** `getEncouragement` (`lessonLogic.js`) now holds 3 icon/headline/
messageKey variants per star band instead of 1, picked via a new
`pickEncouragementVariantIndex(correctCount, total)`. `getEncouragement`
itself stays pure — it takes a `variantIndex` (wrapped with modulo) rather
than calling `Math.random` — and `variantIndex` defaults to `0`, so the
existing variant-0 copy/headlines are unchanged for any caller that doesn't
pass one. `LessonResultsScreen` picks the index once via a lazy `useState`
initializer, the same pattern `createExerciseState` already uses for
`shuffle`, so the choice is stable across re-renders but varies between
lessons. A perfect (3-star) result also gets a one-shot confetti or fireworks
animation (`createCelebration`/`Celebration`, also lazy-`useState`-picked,
CSS-keyframe driven in `index.css`) — picked randomly between the two effects
so finishing perfectly doesn't always look identical. No new dependency: both
effects are plain absolutely-positioned `<span>`s animated with CSS custom
properties (`--confetti-rotation`/`--confetti-drift`/`--firework-angle`), not
canvas or a confetti library.

## 2026-06-11 — Fixed `nahi`'s `zu` example sentence to include an explicit subject

**Decision:** Changed `nahi`'s `sentences.present.zu` from `'Etorri ___?'` to
`'Zuk etorri ___?'`. Without "Zuk", the blank was ambiguous between
`nahi dut`/`nahi duzu`/`nahi du` — Basque verb agreement alone (`dut`/`duzu`/`du`)
disambiguates person, but with no subject and no prior context, all three
options completed the sentence into an equally valid (just differently-meant)
Basque sentence, so the multiple-choice question had no uniquely correct
answer. Every other person/verb in this table (`ni`'s "Nik kafe bat ___.",
`hura`'s "Hark/Mikelek/Anek/Katuak ... ___.", and `ukan`'s `zu` row "Zuk auto
bat ___.") already includes an explicit ergative subject for exactly this
reason — `nahi`'s `zu` row was the one outlier. Also matches
`pronounSentences.present.zu` (`'___ etorri nahi duzu?'`), which already
implies "Zuk etorri nahi duzu?" as the full sentence.

## 2026-06-11 — Diversified Units 1–2's `hura` example sentences with names/animals/objects as subjects

**Decision:** Added extra `hura`-slot variants to `izan`, `egon`, `ukan`,
`nahi`, and `jakin`'s present-tense `sentences` (and converted `nahi`'s and
`jakin`'s single-string `hura` entries to arrays) so a lesson doesn't always
phrase the third-person question as "Hura ___"/"Hark ___" — sometimes the
subject is a name (Mikel, Ane), an animal (txakurra, katua), or an object/role
noun (autoa, etxea, irakaslea). This is purely additive to `pickVariant`'s
existing random-variant pool — no conjugation-table or engine changes needed,
since Basque's 3rd-person-singular verb form (`da`/`dago`/`du`/`daki`) is the
same whether the subject is `hura`, a name, or any singular common noun.
`pronounSentences` (which test producing `Hura`/`Hark` itself) were left
untouched, since those questions are specifically about the pronoun.

Did **not** extend this to plurals (`haiek`) — Units 1–2's conjugation tables
only have `ni`/`zu`/`hura` (per Phase I's 3-person horizon, see Unit 6 in
`journey.js`), and a plural subject would need the `haiek` verb form
(`dira`/`daude`/`dute`/`dakite`), which doesn't exist yet for these verbs.

## 2026-06-11 — Resolved the last 4 doubtful sentences in `docs/SAMPLE_SENTENCES.md` via native-speaker review

**Decision:** The 4 items left open by the entry below were checked with a
native speaker and fixed:

- `zeramatzazten` → `zeneramatzaten` (`eraman` past, `zuek` — confirmed
  correct, follows the same `zen-...-ten` pattern as `ibili`'s
  `zenbiltzaten`).
- `Ekar ezazu gazta eta Idiazabalgo ardoa` → `Ekar itzazu gazta eta
  Idiazabalgo ardoa` (two singular nouns coordinated with `eta` do count as a
  plural object for verb agreement).
- `saski beteta perretxiko zekarzkigun` → `perretxikoz betetako saski bat
  zenekarkigun` — three issues at once: wrong subject-agreement prefix
  (`zen-` for `zuk`, not `ze-`), `saski beteta perretxiko` isn't valid ("a
  basket full of X" needs the instrumental `perretxikoz betetako saski bat`),
  and with `saski bat` as the head noun the object is singular, not plural
  (`-zki-` was wrong).
- `Okinak ... laberaraziko du` → `Okinaren labe berriak ... erraraziko du` —
  `-arazi` only attaches to verb radicals; `laberazi` (from the noun `labe`)
  would mean "make get put in the oven", not "make bake". `erre` (to
  bake/roast) → `errarazi` is the right base verb.

The one-off `docs/SAMPLE_SENTENCES_REVIEW_PROMPT.md` used to gather this
feedback has been deleted now that it's resolved.

## 2026-06-11 — Fixed 13 grammar/spelling errors in `docs/SAMPLE_SENTENCES.md`'s cultural sentence banks

**Decision:** Corrected the following in the "future units" cultural sentence
banks (none of these are wired into `VERBS` yet, so no code/data changes were
needed):

- Ergative case on vowel-final names: `Sustraiak`/`Sustraiek` → `Sustraik`,
  `Goizaneik` → `Goizanek` (vowel-final names take bare `-k`, not `-ek`/`-ak`).
- `epaimaimahaiari` → `epaimahaiari` (duplicated syllable typo).
- `okurru dakizkit` → `bururatu dakizkit` (`okurru` is a non-standard
  Spanish-derived coinage; `bururatu` is the standard "occur to someone" verb,
  and `dakizkit` is already the correct plural potential NOR-NORI form).
- `litzazaizkizue` → `litzaizkizue` (duplicated syllable typo; parallels
  `balitzaizkizue` earlier in the same sentence).
- `barre arazi digute` → `barre arazi gaituzte` (causative of an `egin`-type
  intransitive follows this section's `nor`→`nor-nork` pattern — the original
  subject becomes the absolutive object — consistent with the section's other
  examples like `korrikarazi zituen`/`itzularazi zituen`).
- `jandakarazi` → `janarazi` (non-standard double-marked causative; matches
  `docs/VERB_COVERAGE.md` §6's own `janarazi` example for the same
  `nor-nork`→`nor-nori-nork` shift).
- `Okinak labe berriak ... du` → `Okinaren labe berriak ... du` (the
  translation says "the baker's new oven" — possessive needs the genitive
  `-aren`, not the ergative `-ak`).
- `zenetozten` → `zentozten` (×2 — `etorri` past, `zuek`).
- `daramagu` → `daramatzagu` (a numeral like `bi` ("two") triggers plural
  object agreement even though the noun itself stays unmarked).
- `dakarte` → `dakartzate` (×2 — plural object `botila hotzak`/`pastel
  gozoak` needs the `-tza-` plural marker).
- `ardi latzak` → `ardi latxak` (×2, for consistency with the existing
  correct `ardi latxak` elsewhere in the doc — Latxa is the sheep breed named
  in the English translations).

The 4 items originally left for native-speaker review here were resolved —
see the entry above.

## 2026-06-11 — `sentences[tense][person]` can hold multiple phrasing variants, picked at random per question

**Decision:** `verb.sentences[tense][person]` (and, by extension, anything
read through it — `sentence`/`type-verb`/`spot-error` questions) now accepts
either a single string (unchanged) or an array of strings. `lessonLogic.js`
gained a small `pickVariant(value)` helper — returns the value as-is for a
plain string, or a randomly-picked element for an array — used in
`generateQuestions`'s `buildQuestion` and in `buildSpotErrorQuestion`.
`personsWithSentences`'s truthiness check on `sentences[candidate]` already
works unchanged for non-empty arrays, so no other logic needed to change.

**Data:** `izan`, `egon`, and `ukan` present-tense `sentences.ni/zu/hura` are
now arrays of 4-5 variants each, drawn from the categorized "Aplikazioa /
Eskola / Familia eta etxea / Bidaiak / Eguneroko bizitza" tables in
`docs/SAMPLE_SENTENCES.md` (its "Next steps" item 2), with duplicate cells
across categories deduplicated. `ukan`'s table has no `zu`/`Zuk` row, only
`hi`/`Hik` — its variants were adapted by substituting `Zuk` for `Hik` (the
table's `Hik auto bat ___.` cell already matched the existing single-string
`zu` sentence under that substitution, so the rest of the row's variants
follow the same pattern). Other verbs (`nahi`, `jakin`, `joan`, `etorri`) keep
single-string sentences for now. `pronounSentences` variants are deferred, per
the doc's "Next steps" item 3.

## 2026-06-11 — Added a Duolingo-gems-style points system, spendable to repair a broken streak

**Decision:** Added `aditzak:points:v1` (`{ balance }`), a third standalone
storage key alongside `progress`/`aditzak:streak:v1`, for the same reason as
the streak: it's orthogonal to any single lesson's progress and "Reset
progress" can clear it without a version bump elsewhere.

Points are earned per lesson completion, scaled by accuracy
(`computeLessonPoints` in `lessonLogic.js`):
- **First attempt** at a lesson: `round(10 × correctCount/total)` (0-10).
- **Repeat attempt** (the lesson already had `attempts > 0` *before* this
  completion): `round(5 × correctCount/total)` (0-5) — half rate, since
  repeats are review rather than new material.

`AppShell`'s `onComplete` checks `progress[lesson.id]?.attempts` *before*
calling `recordResult` to decide first-vs-repeat, then awards via
`addPoints`. `ExerciseScreen` independently computes the same value (it
already receives `attempts` as a prop) purely for display on
`LessonResultsScreen` ("+N 💎") — both call the same pure function so the
displayed and stored amounts can't drift apart.

**Streak repair:** `STREAK_REPAIR_COST = 100`. When a streak reads as broken
(`getActiveStreak` returns 0 but `currentStreak > 0`) and the balance covers
the cost, `ProfileTab` shows a "Repair streak" card. `repairStreak`
backdates `lastActiveDate` to "yesterday" (via a new `shiftDateString` helper
that does the date-string arithmetic in UTC, matching how
`recordDailyStreak`/`getActiveStreak` already compare dates) — this makes
`getActiveStreak` read `currentStreak` as alive again without resetting or
incrementing it, so the learner resumes exactly where they left off with
today still open to extend it. Costs `STREAK_REPAIR_COST` points,
confirmed via `window.confirm` like the existing reset-progress flow.

**Rejected:** a separate one-time bonus for "finishing a unit" (as initially
proposed) — folded into the per-lesson first-attempt rate instead, since a
unit is just its lessons and tracking unit-level completion state separately
would duplicate what `progress`/`getUnlockedLessonIds` already derive.

## 2026-06-11 — `generateQuestions` cycles through a person's framings before repeating one, to fix near-duplicate questions in small lessons

**Decision:** For Phase I's 3-person (`ni`/`zu`/`hura`) lessons, a kind's
content is otherwise fully determined by `person` — e.g. the `sentence`
question for `ni` is always "Ni etxean ___." with options `{nago, zaude,
dago}`. During `noTyping` (a learner's first `NO_TYPING_ATTEMPTS`), only
`['form', 'sentence', 'pronoun']` are available per person, but
`TARGET_EXERCISE_COUNT` gives such lessons `rounds: 4` — four independent
per-person rolls into a 3-outcome distribution, which by the pigeonhole
principle guarantees at least one repeat, and often more. The result (e.g. on
Unit 1's `egon-present` lesson) was the same question appearing multiple times
in a single ~12-question session.

`generateQuestions` now tracks, per person, which kinds have already been
rolled across rounds (`usedKinds`). If a roll repeats a kind that's already
been used and an unused one remains (`form` plus `availableKinds`), it's
swapped for one of the unused kinds instead. With `rounds <= ` the number of
available kinds, this guarantees zero repeats for that person; beyond that,
repeats only start once every framing has appeared once. `rounds: 1` (the
default, used by all existing single-round tests) leaves `used` empty before
the first roll, so this is a no-op there — existing weighted-roll behaviour
and tests for the first occurrence per person are unchanged.

## 2026-06-11 — Daily streak tracked in its own storage key, computed via a "live vs. broken" split

**Decision:** Added a Duolingo-style daily streak: completing any lesson
records today's local date (`getLocalDateString` — local, not UTC, so the day
boundary matches the learner's clock) into `aditzak:streak:v1`
(`{ currentStreak, longestStreak, lastActiveDate }`), via the pure
`recordDailyStreak` in `lessonLogic.js`. Kept as a separate localStorage key
rather than folded into `progress`/`STORAGE_KEY`, so its shape can evolve
independently and "Reset progress" can clear both without a version bump to
either.

`recordDailyStreak` only ever increments (consecutive day), restarts at 1 (gap
of 2+ days), or no-ops (same day again) — it never resets `currentStreak` to 0
itself. Whether a streak currently *reads* as alive or broken is a separate,
display-only concern handled by `getActiveStreak`: a `lastActiveDate` of today
or yesterday still counts (the learner has until the end of today to extend
it), anything older reads as 0. This split means the stored streak only
changes on actual lesson completions, while the UI (header flame badge,
Profile tab's current/longest cards) always reflects today's reality without
needing a background job or app-open side effect to "expire" stale streaks.

## 2026-06-11 — Increased real-sentence usage in exercises: raised `SPECIAL_QUESTION_CHANCE` to 0.75 and let the no-typing ramp keep sentence/pronoun framings

**Decision:** Two changes to `lessonLogic.js`'s `generateQuestions`, prompted
by feedback that a learner doing Unit 2's exercises saw no example-sentence
questions at all:

1. **`SPECIAL_QUESTION_CHANCE` raised from `0.5` to `0.75`.** Previously, even
   once sentence/pronoun framings were available, only half of questions used
   them — the other half were bare `form` questions ("hura → ?", no context).
   Now real Basque sentences (`sentence`/`type-verb`/`spot-error`/`pronoun`/
   `type-pronoun`) are the common case (75%) and the bare form is the
   occasional variation (25%).
2. **Replaced `onlyBareForm` with `noTyping`** (and renamed
   `BARE_FORM_ATTEMPTS` to `NO_TYPING_ATTEMPTS` in `App.jsx`, still `2`). The
   old `onlyBareForm` zeroed out `sentences`/`pronounSentences` entirely for a
   learner's first two attempts at a lesson — so *no* sentence-based question
   could appear for two full ~12-question sessions, which is what the learner
   ran into in Unit 2. `noTyping` instead only excludes the framings that
   demand recalling/cross-checking a brand-new form from scratch
   (`type-verb`, `type-pronoun`, `spot-error`); the multiple-choice
   `sentence`/`pronoun` fill-in-the-blank framings remain available from the
   very first question. The "don't make a learner type a form they've never
   seen" rationale behind the original ramp (2026-06-11, "Extended the
   bare-form ramp..." entry below) is preserved — only typing/spot-error are
   gated — while sentence exposure starts immediately.

**Why not just raise the chance and leave the ramp as-is:** raising
`SPECIAL_QUESTION_CHANCE` alone wouldn't have fixed the reported symptom —
`onlyBareForm` set `sentences`/`pronounSentences` to `{}`, so `availableKinds`
was always empty and `rollQuestionKind` always returned `'form'` regardless of
the chance, for a learner's first two attempts at every non-review lesson.

**No `STORAGE_KEY` bump:** purely a question-generation change, no change to
stored progress shape.

## 2026-06-11 — "Source language" is the existing interface language, picked via a one-time onboarding screen, with Euskara prioritised

**Decision:** Rather than add a second language preference, "source language"
(for hints/translations) reuses the existing interface-language setting from
`LanguageContext`. `LANGUAGES` is now ordered `eu`/`es`/`en` (Euskara first,
since most users already know some Basque), and the Profile picker is
relabelled "Source language". `LanguageContext` exposes `hasChosenLanguage`;
first-time visitors see `LanguageOnboardingScreen` (Euskara flagged
"Recommended") before anything else, and picking a language persists it
permanently to `aditzak:lang:v1`.

## 2026-06-11 — Added interface-language i18n (English/Spanish/Basque), keeping the Basque content being taught untranslated

**Decision:** Added `src/i18n/` (`translations.js` + `LanguageContext.jsx`)
providing `{ language, setLanguage, languages, t, tCount }`, persisted under
`aditzak:lang:v1` (separate from progress) with browser-language fallback to
`DEFAULT_LANGUAGE = 'en'`. The Basque verb forms/sentences being taught, plus
"app voice" flavor text and grammar terminology (NOR/NORI/NORK, `TENSE_META`'s
Basque labels), stay untranslated — everything else (nav, instructions,
feedback, person/tense/type labels, verb glosses via `meaning: { en, es, eu
}`) is translated.

`journey.js`'s curriculum text is translated via a parallel lookup table
(`journeyTranslations.js`) rather than restructuring `journey.js` itself, so a
missing translation falls back to English instead of breaking. Existing
lookup-table patterns (`TENSE_META`, `PERSON_LABELS`, etc.) were extended with
`labelKey`s rather than replaced. No `STORAGE_KEY` bump — `aditzak:lang:v1` is
additive.

## 2026-06-11 — Implemented Unit 3 ("Moving Around"): new `joan`/`etorri` present-tense verbs

**Decision:** Added `joan-present` and `etorri-present` lessons and flipped
Unit 3 to `available`. Both verbs are fully synthetic, `agreement: ['nor']`,
trimmed to the `ni`/`zu`/`hura` horizon (`noa`/`zoaz`/`doa`,
`nator`/`zatoz`/`dator`) per `CONJUGATIONS.md` §6, with full sentence/pronoun
data for the same question-kind variety as other Phase I verbs. No engine
changes needed; no `STORAGE_KEY` bump (new lesson ids).

## 2026-06-11 — Implemented Unit 2 ("Having, Wanting, and Knowing"): `ukan` present trimmed to 3-person horizon, plus new `nahi`/`jakin` verbs

**Decision:** Added `ukan-present`, `nahi-present`, `jakin-present` lessons and
flipped Unit 2 to `available`. Trimmed `ukan`'s `present` to `ni`/`zu`/`hura`
(`dut`/`duzu`/`du`), removing the old 6-person `hi`-based present/past tables
(unused, wrong shape — `past` will return correctly for Unit 12). `nahi`
(`nahi izan`) rides `ukan`'s exact suffixes and is the first `VERBS` entry
tagged `type: 'periphrastic'`. `jakin` is fully synthetic
(`dakit`/`dakizu`/`daki`), sharing `ukan`'s suffix family. All three have full
sentence/pronoun data. No `STORAGE_KEY` bump — progress shape unchanged, new
lesson ids have no prior progress.

## 2026-06-11 — Three journey-content fixes: `jakin` added to Unit 2, Unit 4's forward-referencing payload fixed, Unit 10's payload rewritten

**Decision:** A review of still-`pending` Units 2, 4, 10 in
`LEARNING_JOURNEY.md` found three content gaps, fixed in the doc and mirrored
in `journey.js`'s `focus`/`payload` (no `VERBS`/`LESSONS` data existed yet, so
this was content/sequencing only):

1. `jakin` ("to know") had no home in the journey despite being documented —
   added to Unit 2 alongside `ukan`/`nahi`, since it shares `ukan`'s suffix
   family.
2. Unit 4's payload referenced `jan` before Unit 7 introduces it — kept
   `jaten` but reframed it as a single fixed vocabulary item for Unit 4's
   `ari` examples, which primes Unit 7.
3. Unit 10's payload missed the point of teaching `behar` separately from
   `nahi` (its auxiliary-mismatch "aha moment") — replaced with `Joan behar
   dut`/`Etorri beharko duzu`, reusing Unit 3's intransitive `joan`/`etorri`
   so the `naiz`→`dut` shift is visible.

Fixed while still `pending` — the cheapest point to correct framing before any
conjugation data is authored.

## 2026-06-11 — Added Phase VI (causative `-arazi`/`-erazi`, Units 23-25) to `LEARNING_JOURNEY.md`

**Decision:** The causative suffix wasn't covered anywhere in the 22-unit
journey. Added a new **Phase VI — Making Things Happen (Causatives)** after
Phase V, with Stage 9 (Units 23-24: `-arazi` shifting `nor`→`nor-nork`→
`nor-nori-nork`) and Refresh Gate D (Unit 25, recombining with
future/conditional/imperative). Also added `VERB_COVERAGE.md` §6 documenting
the morphology/argument-shift rules.

**Why last:** causatives are a morphological *operation* recombining
everything taught earlier, so a learner needs every piece it recombines first
— same logic as Unit 22 (passive) being a late-game transformation. A
causativized verb is just another `type: 'periphrastic'` entry, so Tier 1 of
`EXERCISE_ENGINE.md` applies unchanged — flagged as content work, not engine
work.

## 2026-06-11 — Lessons now repeat each person to reach ~12 exercises (`TARGET_EXERCISE_COUNT`), instead of one question per person

**Decision:** `generateQuestions` previously produced one question per
grammatical person (3-6 total), making sessions too short for spaced
repetition. Added a `rounds` option (default `1`, backward-compatible) that
repeats the shuffle-and-roll pass independently each time. `createExerciseState`
picks `rounds` per source from `TARGET_EXERCISE_COUNT = 12` (each source's
share of 12, divided by its person count, rounded, floored at 1).

**Why 12:** 3-4 repetitions per form is enough for the testing effect without
dragging, and 12 divides evenly by both 3 and 6 (the table sizes in play),
keeping session length consistent regardless of a verb's person count.

## 2026-06-11 — Extended the bare-form ramp to two attempts, added a one-time conjugation preview, and flagged high-difficulty units for extra practice

**Decision:** Three changes addressing feedback that the journey moves too
fast:

1. `BARE_FORM_ATTEMPTS = 2` — `onlyBareForm` now applies whenever `attempts <
   2`, giving two recognition-only passes before richer framings mix in.
2. `LessonPreviewScreen` — shown once before a lesson's first attempt: a plain
   conjugation table with a "Start" button. Review lessons skip it.
3. `LEARNING_JOURNEY.md` gained a "Difficulty-weighted extra practice" note
   (§1.6) flagging units introducing a new grammatical relation (Units 2, 8,
   15, 16, 20, 21) for extra practice lessons, with Unit 16 (NOR-NORI-NORK)
   getting two.

(1) and (2) are general engine improvements with no new stored state, so no
`STORAGE_KEY` bump; (3) is a flag for future unit authors. Also fixed a
test-isolation bug: `setupTests.js` now calls RTL's `cleanup` in `afterEach`.

## 2026-06-11 — Restructured the home screen around `LEARNING_JOURNEY.md` and implemented Unit 1 ("Who and Where")

**Decision:** Added `src/journey.js` exporting `JOURNEY` — a data-only mirror
of `LEARNING_JOURNEY.md`'s phases → stages → units, each `available` (with
`lessonIds`) or `pending` (roadmap preview only, `gate: true` for Refresh
Gates). The home screen now walks this structure, rendering available units
via `LessonNode`/`LessonList` and pending units as locked `PendingUnitCard`s —
so the full curriculum is visible from day one. The old auto-derived `LESSONS
= (verb × tense)` cross product and verb-grouped
`VerbSection`/`ReviewSection`/`LearnTab` are gone; `LESSONS` is now a small
hand-written list, since units don't map cleanly onto "every tense of every
verb".

**Unit 1** (izan + new `egon` verb, present, `ni`/`zu`/`hura`) is implemented,
adopting the 3-person-horizon via partial conjugation tables rather than a
`persons` filter — `generateQuestions`/`buildOptions` already degrade
gracefully with fewer than 4/6 persons. `izan`'s old 6-person `hi`-based past
table was removed (will return correctly, with `zu`, for Unit 12).

**Note for existing learners:** `izan-present`'s table shrank from 6 to 3
persons, changing its question pool, but the *shape* of stored progress is
unchanged so `STORAGE_KEY` was not bumped.

## 2026-06-11 — Added `EXERCISE_ENGINE.md`: a unit-by-unit audit of engine gaps, superseding scattered `LEARNING_JOURNEY.md` notes

**Decision:** Added `docs/EXERCISE_ENGINE.md`, auditing all 22 journey units
against the current engine and sorting gaps into four tiers: data-only (most
of Phase I-III), small localized code changes (distractor floors, Phase I
person-restriction, Refresh Gate score-gating), new data shapes (negation,
ditransitive NOR-NORI-NORK, allocutive, non-finite/passive), and structural
engine work (flash drills, error-pattern detection). Audit-only — no decisions
made, just consolidated for when each unit comes up.

**Highest-priority open decisions flagged:** the Phase I 3-person-horizon
mechanism (per-verb partial tables vs. a `persons` filter — resolved in favor
of partial tables by the entry above) and the Unit 16 ditransitive table shape
(fixed-recipient vs. genuine 2D grid).

## 2026-06-11 — Rewrote `LEARNING_JOURNEY.md` (v2): acquisition order replaces grammar order; `zu` becomes the default "you", `hi` deferred to the allocutive unit

**Decision:** Replaced v1's 17-stage grammar-ordered sequence with an
acquisition-ordered one (per an external proposal), keeping v1's "usefulness
over implementation-ease" tiebreaker. Key changes: a **3-person horizon**
(every verb's first lesson covers only `ni`/`zu`/`hura`, with
`gu`/`zuek`/`haiek` unlocked together in a later "Expansion" Refresh Gate),
**functional grouping** (units named for communicative goals, not grammar
categories), and a **Refresh Gate** ending each phase.

**Resolved differently than the proposal:** rather than keep a 7-person model
with `hi` reappearing only in the hitanoa unit, this revision **defers `hi`
entirely** to that one unit and uses `zu` as the sole 2nd-person-singular
throughout — a 6-person core grid (`ni`/`zu`/`hura`/`gu`/`zuek`/`haiek`),
resolving v1's "Stage 11: zu retrofit" problem by making `zu` foundational
from the start.

**Concrete prerequisite surfaced:** `izan`/`ukan`'s citation tables (§1/§3)
were missing `zu` rows — fixed in the entry above. Also corrected the
proposal's Unit 14 mislabeling of `joan`/`etorri`/`ibili`'s imperfective "Past"
forms (those are progressive "I was going", not simple past) and moved
simple-past forms into Unit 13.

Two engine-level proposals (periodic flash drills; ergative-drift error
detection) were recorded as design notes but not folded into the sequence —
real feature work deserving their own design pass.

## 2026-06-11 — Added `LEARNING_JOURNEY.md`: a ~50-unit/17-stage curriculum sequence, ordered by usefulness rather than implementation effort

**Decision:** Added a content-design roadmap sequencing `VERB_COVERAGE.md`'s
open items into a linear unit-by-unit order (no exercises/`VERBS` data yet) —
"Unit" = one verb (or invariant-construction group) gaining one or more
tenses, mapping onto the existing `LESSONS` derivation. Largely superseded by
the v2 rewrite above, kept for history.

**Key ordering choices:** high-value invariant constructions
(`nahi`/`behar`/`ari`/`ahal`/`ezin`) and the future tense are pulled forward
since they reuse existing `izan`/`ukan` tables; `gustatu`/`iruditu`
(high-frequency periphrastic NOR-NORI) lead the dative stage over `jario` (per
`CONJUGATIONS.md`'s "very limited use" flag) — usefulness over
implementation-ease, the doc's stated tiebreaker; `zu` (Stage 11) is placed
after a solid core verb set but before the tense/mood explosion, the cheapest
point to retrofit a 7th person; not-yet-documented verbs/moods (`egin`, etc.)
are left out pending a `CONJUGATIONS.md` pass.

## 2026-06-08 — "Spot the error" is a sixth question kind that bundles four sentences instead of testing one person

**Decision:** Added `kind: 'spot-error'`: shows four filled-in example
sentences (one person's own plus three random companions) and asks the learner
to pick the one whose verb form was swapped for a different person's. Reuses
`verb.sentences[tense][person]` data, storing the wrong sentence as `correct`
and all four as `options` so existing grading/rendering work unchanged —
`QuestionPrompt` only needed one branch for when `question.items` is present.
Gated on `personsWithSentences.length >= 4`. It's an intentional narrow
exception to "one question tests one person" (still consumes one slot in the
per-person loop) — generalizing `generateQuestions` for variable-width
questions would be a much bigger change for one kind.

**Why:** the other five kinds only ever show correct forms to recognize/recall;
framing this as "find the one wrong sentence among four" gives error-*detection*
practice at the same ~25% guess rate as the other kinds. Distractors are picked
uniformly at random rather than biased toward near-miss persons, to avoid extra
data-shape complexity.

## 2026-06-07 — The itinerary now ramps up in three stages: bare forms → richer framings → cross-lesson reviews

**Decision:**
1. **Bare forms first** — `generateQuestions` gained `onlyBareForm`,
   suppressing sentence/pronoun/typed framings; `createExerciseState` sets it
   whenever `attempts === 0` for a non-review lesson.
2. **Richer framings on repeat** — the existing sentence/pronoun/typed mix,
   now held back until after the first attempt.
3. **Cross-lesson review checkpoints** — `LESSONS` now appends review lessons
   (`{ id, review: true, sources: [...] }`) once a verb has multiple tenses
   (interleaving them) or multiple verbs exist (a final mixed review).
   `createExerciseState` runs `generateQuestions` per source and shuffles
   results together; every question carries its source `verbId`/`tense` so
   `ExerciseScreen` can derive context per-question. `describeLesson`
   centralizes practice-vs-review display copy; `groupLessonsByVerb` splits
   lessons into per-verb groups plus a trailing `mixedLessons` bucket.

**Why:** gating on `attempts` keeps the existing per-lesson progress model as
the single source of truth; making reviews *lessons* (not bonus questions
mixed into existing ones) keeps each lesson's score meaning unchanged.

## 2026-06-07 — `izan`'s example sentences must stick to identity/characteristic predicates, not location/state ones (that's `egon`'s job)

**Decision:** Reworded several of `izan`'s past-tense example sentences that
predicated location ("etxean", "hemen") or temporary state ("pozik") — in
Basque those call for `egon`, a verb the app doesn't model, so pairing them
with `izan`'s forms taught a non-existent paradigm. New sentences predicate
identity/role/inherent characteristics ("nire laguna", "irakasle ona"),
matching the present-tense sentences.

**Why:** found alongside a related bug (a `nork`-agreement question showing
the absolutive pronoun "ni" instead of ergative "nik", fixed in
`QuestionPrompt` by reading from `verb.pronouns`) — both are the same class of
bug: content that looks grammatical but tests the wrong paradigm. Recorded as
a general rule for adding example sentences.

## 2026-06-07 — Typing exercises are two more question kinds, not a separate mode, and reuse the sentence data

**Decision:** Added `kind: 'type-verb'`/`'type-pronoun'`, typed-answer siblings
of `sentence`/`pronoun`, reusing the same blanked-sentence data and rolling
into the same `availableKinds` pool — a verb supporting one framing
automatically supports its typed sibling. `ExerciseScreen` (renamed from
`MultipleChoiceScreen`) picks between an option grid and a new
`TypedAnswerInput` via `Boolean(question.options)`; `QuestionPrompt` keys off
`Boolean(question.sentence)` instead of an explicit kind list. New
`isAnswerCorrect` (trim + case-fold) is used for all answers.
`rollQuestionKind` was simplified from two `Math.random` calls to one roll
partitioning `[0, SPECIAL_QUESTION_CHANCE)` into equal slices per kind — same
distribution, and makes every kind individually reachable by mocking
`Math.random`, unblocking deterministic tests.

**Why:** folding into existing lessons as more question kinds keeps lesson
identity/unlocking/progress untouched. Requiring sentence context for both
typed kinds avoids ambiguity (a declined pronoun depends on the sentence's
argument/case) and keeps the two framings consistent with each other.

## 2026-06-07 — Pronoun-fill questions reuse the sentence-completion machinery as a third question kind

**Decision:** Added `kind: 'pronoun'` — the verb is already spelled out and the
learner picks the correctly-declined pronoun ("___ etxe bat du." → "Hark").
Verbs can carry `pronouns` (declined form per person, in whatever case that
verb's subject takes) and `pronounSentences` (mirroring `sentences` but
blanking the pronoun). `generateQuestions` rolls one "framing" per question
from whichever of `sentence`/`pronoun` have data for that person/tense
(`SPECIAL_QUESTION_CHANCE = 0.5`, split evenly), and a new `buildOptions`
helper builds same-kind multiple choice from the matching lookup table.

**Why:** folding into existing (verb × tense) lessons as a third question kind
avoids a new lesson type. Storing `pronouns` per-verb (rather than a global
declension table) lets each verb state just the forms its own sentences need,
mirroring `conjugations`. Splitting the roll evenly across available special
kinds means adding a future kind won't shrink existing ones' frequency.

## 2026-06-07 — "Complete the sentence" questions are mixed into existing lessons, not a separate lesson type

**Decision:** Added an optional `sentences` field to `VERBS` (tense → person →
sentence with `___`). `generateQuestions` rolls, per question and only where a
sentence exists (`SENTENCE_QUESTION_CHANCE = 0.5`), between `kind: 'form'`
(bare form) and `kind: 'sentence'` (fill the blank). `MultipleChoiceScreen`
picks prompt/layout via `question.kind`/`QUESTION_PROMPTS`, rendering a dashed
blank (`SentenceWithBlank`). Distractors, scoring, retry queue, persistence,
and unlocking are all untouched, since both kinds resolve to "pick the right
conjugated form".

**Why:** folding into existing lessons as a second question style avoids
touching lesson identity/unlocking/progress, and per-question (not per-lesson)
rolling keeps lessons feeling mixed. `Boolean(sentence)` gating means verbs
without example sentences fall back to bare-form questions automatically.

## 2026-06-07 — Streak nudges are throttled: a session-level cooldown plus a chance check

**Decision:** `App` now tracks `streakNudgeCooldown` (lessons to wait), passed
down as `canShowStreakNudge`; showing a nudge resets it to a random 2-4 lessons
(`randomStreakNudgeCooldown`), ticking down per completed lesson. Even when
eligible, `MultipleChoiceScreen.handleSelect` shows the nudge only ~60% of the
time (`rollStreakNudgeChance`). Both random calls live in their own top-level
functions invoked from the answer-time event handler, since
`react-hooks/purity` forbids `Math.random` calls inside component bodies (even
nested in event-handler closures).

**Why:** asked to make the nudge feel less mechanical with cooldown +
randomness. Cooldown lives in `App` (not the per-lesson-remounted screen) since
it persists across lessons for the session; rolling the chance in the event
handler keeps the decision stable for that answer's feedback without a purity
violation or post-render flicker.

## 2026-06-07 — Mid-lesson streak encouragement lives in the feedback bar, not a new screen

**Decision:** Added a `streak` counter to exercise state (incremented on
correct, reset on miss) and `getStreakEncouragement(streak)` returning `{
icon, headline, message }` for milestone streaks (5/10/20), shown in
`FeedbackBar` in place of the usual message exactly when the streak lands on a
milestone.

**Why:** a full extra screen would interrupt flow; reusing the existing
feedback bar keeps the nudge lightweight. Resetting on a miss keeps "in a row"
meaning an unbroken run, matching the learner's lived experience.

## 2026-06-07 — Failed questions are requeued and hidden, not revealed and skipped

**Decision:** Reworked `exerciseReducer`/`createExerciseState` around a
`queue` (plus fixed `total`) instead of linear `questions`/`index`. A correct
answer drops the question; an incorrect one pushes it to the back marked
`retry: true`, so it resurfaces — the lesson ends only when the queue is
empty. `correctCount` (and the star rating) only credits *first*-attempt
correct answers. `getOptionStatus`/`FeedbackBar` now only flag the learner's
incorrect pick — the correct answer is no longer revealed on a miss.

**Why:** explicit request — don't reveal answers, requeue missed items until
answered correctly unaided. Pushing to the back of the queue is the simplest
semantics that still guarantees spacing before a retry.

## 2026-06-07 — End-of-lesson encouragement screen keyed off `computeStars` bands

**Decision:** Added `LessonResultsScreen`, shown when the exercise finishes
(local `finished` state) instead of calling `onComplete` immediately.
`getEncouragement(correctCount, total)` returns `{ icon, headline, message }`
selected by the same star band as `computeStars` (3/2/1/0 → Bikain!/Oso
ondo!/Ondo!/Ez etsi!).

**Why:** reusing `computeStars`' bands keeps the message, star rating, and
`Stars` badges elsewhere telling the same story. `finished` stays local
component state since it's a screen-transition concern, not part of the scored
exercise — `onComplete`/`recordResult` still only fire once the learner
dismisses the results screen.

## 2026-06-07 — Use `dvh` instead of `vh`/`screen` for full-height screens

**Decision:** Switched `HomeScreen`/`MultipleChoiceScreen` from `min-h-screen`
(`100vh`) to `min-h-dvh`/`h-dvh`, and restructured the latter so the
question/options area scrolls internally inside a fixed `h-dvh` container,
keeping the close button, progress bar, and `FeedbackBar` always pinned in
view.

**Why:** on mobile, `100vh` includes space hidden by browser chrome, pushing
the Continue/Finish button below the visible fold. `dvh` tracks the actual
visible viewport, and internal scrolling guarantees the action button stays
reachable.

## 2026-06-07 — Deploy to GitHub Pages via Actions, with hardcoded `base`

**Decision:** Set `base: '/testapp005/'` in `vite.config.js` and added
`.github/workflows/deploy.yml`, building on push to `main` and publishing
`dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages` (requires
Pages source set to "GitHub Actions" in repo settings).

**Why:** GitHub Pages serves project sites from `/<repo>/`, so asset URLs need
the repo-name prefix. Hardcoded rather than derived since the app isn't
expected to be renamed/forked — update `base` if that changes.

## 2026-06-07 — Extracted pure lesson logic into `src/lessonLogic.js`

**Decision:** Moved `computeStars`, `recordResult`, `getUnlockedLessonIds`,
`shuffle`, `generateQuestions`, and `exerciseReducer` out of `App.jsx` into
`src/lessonLogic.js`.

**Why:** wanted to unit-test these pure functions directly, but exporting
non-component functions from `App.jsx` trips `react-refresh/only-export-components`
(breaks Fast Refresh). Splitting also keeps `App.jsx` focused on
components/screens.

## 2026-06-07 — Added unit/component tests (Vitest + RTL), held off on e2e

**Decision:** Set up Vitest + React Testing Library (`src/logic.test.js`,
`src/App.test.jsx`). No end-to-end suite (e.g. Playwright) yet.

**Why:** the riskiest logic (scoring, unlocking, persistence, question
generation, the exercise state machine) is pure and cheap to unit test
directly. E2e is the slowest, most maintenance-heavy layer — worth adding once
the app has more complex multi-screen flows worth protecting end-to-end.
Playwright + Chromium are already available in the dev container if/when
revisited.

## 2026-06-07 — Added CI (GitHub Actions: lint, test, build)

**Decision:** `.github/workflows/ci.yml` runs `npm run lint`, `npm test`, and
`npm run build` on every push and PR.

**Why:** an automated gate is what actually prevents regressions, since
relying on remembering to run checks locally doesn't scale as more changes
land via agents.

## 2026-06-07 — SessionStart hook installs deps synchronously

**Decision:** `.claude/hooks/session-start.sh` runs `npm install`
synchronously (not async) on Claude Code web sessions, gated on
`$CLAUDE_CODE_REMOTE`.

**Why:** guarantees dependencies are installed before the agent starts
working, avoiding race conditions. Tradeoff: session start waits on `npm
install`. Can switch to async later if startup latency becomes annoying — see
the `session-start-hook` skill.
