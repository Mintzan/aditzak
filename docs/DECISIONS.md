# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

## 2026-07-06 — Lessons can never be locked behind the learner's own recorded progress

Journey reorganisations can leave stored progress inconsistent with the current
`LESSONS` order, and the strictly linear unlock rule then produced permanently
blocked lessons *in the middle* of the journey: insert two or more new lessons
back-to-back before content the learner already finished and the second one
can never unlock (its predecessor is also new/unattempted, and the
"already-attempted lessons stay unlocked" exception doesn't cover it). Same
for a gate unit added before an already-played region.

**Fix (`getUnlockedLessonIds`, new `getProgressedPastFlags` helper):** a
lesson also unlocks when recorded attempts exist *beyond* it — the learner
demonstrably passed that point of the journey under whatever shape it had
then. Scoped per track: a spine lesson unblocks off any later attempted
lesson; a bonus lesson only off a later attempted bonus lesson in its own
contiguous run, so spine progress past an opt-in bonus track still doesn't
force the track open (it stays its own linear, skippable progression). Gates
are deliberately bypassed by this rule (historical progress wins over a
retroactively-inserted gate), but the gate soft wall is untouched at the
frontier — nothing *after* the furthest attempted lesson unlocks early, and
in normally-played progress the rule is a no-op (every lesson before the
frontier already has attempts). `isLockedByGateScore` correspondingly returns
false for a lesson that isn't actually locked (own attempts, or unblocked by
this rule), so the "needs 80% to continue" prompt can't appear on a playable
lesson.

This is deliberately not a full progress-migration strategy (none exists
yet) — it's the invariant that makes reorganisations safe by default: the
learner can always keep playing, worst case replaying or catching up on
inserted material at their own pace.

## 2026-07-06 — Replaced 101 per-verb `pronouns` maps with one shared declension table + a `personAxis` field

Follow-up to today's earlier pronoun-labels fix, prompted by a user pointing out that
declined pronouns aren't a per-verb fact. They were right by the data: 101 verbs carried a
`pronouns` map but only three paradigms existed — absolutive (9 verbs), ergative (86,
byte-identical copies), dative (6). The map is a pure function of *which case role the
verb's `conjugations[tense]` person keys range over*, a fact that previously wasn't
stored anywhere (`agreement` can't determine it: `etorri` is `nor-nori` but its tables
vary NOR, `gustatu` is `nor-nori` and varies NORI) — the maps were where it got
smuggled in, as its consequence. Now: `PRONOUN_DECLENSIONS` (`data/verbs.js`, keyed
`nor`/`nork`/`nori`, declension is fully regular) + a per-verb `personAxis: 'nork' |
'nori'` field (default `'nor'`), looked up via `personPronoun(verb, person)`. Every
`verb.pronouns` consumer switched: the four display sites, `generateQuestions`'s
`pronoun`/`type-pronoun` kinds (options/correct now come from the axis table; the kind
gate is `pronounSentences` alone — no verb had those without a map, so nothing newly
enables), and `getCaseFramePronounLure`.

Small deliberate behavior deltas, both improvements: `hi` now declines everywhere
(`hik` for NORK verbs — the old hand-written maps mostly omitted it, falling back to the
raw key), and the ergative-drift pronoun lure can now fire for persons the sibling's old
map skipped. `hi-m`/`hi-f` stay undeclined (they're table keys, not distinct pronouns).
Known pre-existing limitation, unchanged: an `objectAxis` lesson varying `nor` on a
`nork`-axis verb (Unit 15/16) still labels its bare-form hero with the *verb-level* axis
(ergative), as `verb.pronouns` always did — fixing that needs the question's varying
axis threaded into the display sites, a separate change (filed as #590).

## 2026-07-06 — Hide `hi` from a unit's conjugation tables until the unit that introduces it

A user asked the unit overview's conjugation tables not to include `hi`
(and its gendered `hi-m`/`hi-f` cells) before the unit that actually teaches
it. `hi` isn't taught until Unit 36 ("hi — Meet 'hi'", a bonus unit in Phase
V's "Intimate Register" stage), but `getComposedTable` includes `hi`/
`hi-m`/`hi-f` cells directly in many verbs' base `present`/`past` tables
whenever the data has them (e.g. `ukan.present` carries `'hi-m': 'duk',
'hi-f': 'dun'`) — so Unit 2's overview was already showing "duk"/"dun" to a
learner more than 30 units before `hi` (a register choice, not just another
grammatical person like `gu`/`zuek`/`haiek`) has any context at all.

**Fix:** `ConjugationTable` (`components/conjugationTable.jsx`) takes an
optional `hidePersons` array and filters those keys out of its rendered
rows. `UnitOverviewModal` computes `unit.number < HI_INTRODUCED_UNIT` and
passes `['hi', 'hi-m', 'hi-f']` when true.

**`HI_INTRODUCED_UNIT`** is derived from the data (lowest unit number with a
lesson whose `persons` includes `'hi'`), not hardcoded to `36` — so a future
renumber can't leave it silently stale. Lives in `lessonLogic.js` rather
than `HomeScreen.jsx`: it needs both `JOURNEY` and `LESSONS`, and exporting
a plain constant (not a component) from a screen file trips this repo's
`react-refresh/only-export-components` lint rule (the same reason
`lessonLogic.js` exists separately from `App.jsx` at all, per its own header
comment).

Scoped to `UnitOverviewModal` only, not `LessonPreviewScreen` (the
per-lesson preview shown before a lesson's first attempt) — the user's ask
was specifically about "help," and `LessonPreviewScreen`'s existing behavior
wasn't part of what was reported.

Added a targeted test (Unit 2's `duk`/`dun` no longer appearing) plus a
loop-based check across every `available` unit before `HI_INTRODUCED_UNIT`,
so no other unit's table can leak `hi` either.

## 2026-07-06 — Person tiles and the fixed-argument badge always show Basque pronouns, never translated ones

User report (screenshot, Spanish UI): `arriskuan jarri`'s match-pairs board labeled its
person tiles "yo"/"tú"/"él / ella". The tiles' fallback for a verb with no `pronouns`
map was `t(PERSON_LABEL_KEYS[person])` — the *translated* pronoun — unlike every sibling
display (the `form` question's hero word, `ConjugationTable`'s bold row label,
`flagQuestionSummary`), which all fall back to the raw person key, i.e. the Basque
absolutive pronoun. All 12 pronouns-less verbs are plain `nor`-agreement (plus the
weather verbs, whose only person is `hura`), so the raw key is always the correct Basque
pronoun there; changed the tile fallback to match (`ExerciseScreen.jsx`), with a
regression test next to #201's. Same change to `FixedArgumentBadge` (`badges.jsx`),
which rendered "NORI: él / ella" — its own doc comment had always promised "NORI: hura".
Translated person labels deliberately *stay* where they're a gloss **under** an
already-Basque pronoun (the form question's subheading, `ConjugationTable`'s small gray
line) — there the translation is the point, and the Basque pronoun is already primary.

## 2026-07-05 — Dropped "No new verbs —" from every unit's focus text; it's app trivia, not a concept

Feedback: "Sin verbos nuevos" (Unit 3's Spanish focus) "don't offer any value
to the learner." Right — "no new verbs this unit" is a fact about how the
curriculum is *authored* (whether a unit's lessons carry their own `verbId`
vs. reusing earlier verbs via `sources`), not something a learner needs to
know to do the exercises. Six units had this same prefix: 3, 7, 10, 23, 31,
43 — all zero-new-verb checkpoints/Refresh Gates.

Stripped the prefix from all six (English, Spanish, and — where already
present — Basque) and, where the remaining sentence was still just
mechanics ("practice turning sentences negative", "mixes present, past, and
future") rather than a concept, added the actual grammar point instead:

- **Unit 10** ("The Inversion Matrix"): now names the actual inversion — the
  finite verb flips ahead of the participle once "ez" enters the sentence —
  instead of just "you'll do negation drills."
- **Unit 31** ("The Case-Ending Mixer"): now names the four agreement
  patterns being contrasted (NOR/NOR-NORK/NOR-NORI/NOR-NORI-NORK), not just
  "subject, object, recipient."
- **Unit 43** (causative Refresh Gate): ties back to what `-arazi` actually
  means ("making someone do something"), which Units 41-42 already
  introduced but this gate's own copy never restated.
- Units 7/23 already stated a real fact once the prefix was gone (which
  persons get added, which tenses get mixed) — left those with only the
  prefix removed.

**Basque:** matched the low-risk edits (prefix removal) everywhere, but only
added new explanatory clauses (Units 10, 31, 43) where I had reasonable
confidence — flagged those with `#native-check` comments in
`i18n/journeyTranslations.js`, same convention as the last few entries.

Added a standing test (`App.homeScreen.test.jsx`) asserting no `available`
unit's `focus` text matches `/no new verbs/i`, so this doesn't quietly creep
back in on a future unit.

## 2026-07-05 — Explained *why* izan vs. ukan, not just *that* they differ

A user asked when/how to explain to learners why some verbs take `izan` and
others take `ukan` — Units 1-3 already drilled the *contrast* (bare subject
vs. `-k` subject) but never stated the underlying rule, just presented it as
a fact to memorize. Grounded the explanation in `CONJUGATIONS.md` §11's
already-established "auxiliary selection by agreement pattern" table (`nor`
→ `izan`, `nor-nork` → `ukan`) rather than inventing new terminology —
deliberately avoided framing this as "transitive vs. intransitive" (an
English-grammar label that doesn't map cleanly onto Basque ergativity; Unit
46's `ihardun`/`iraun` are unergative — ergative subject, no object at all —
so "ukan = has an object" would mislead a learner who reaches them). Framed
it instead as: does the subject act on something else, or does it just *is*
or *stay* somewhere.

**Unit 2** (ukan's first exposure — the natural place for the "aha" to land)
now explains *why* this verb's subject gets `-k`: "izan/egon's subject just
is or stays somewhere; ukan's subject acts on something else (what you have)
— that's what earns it the -k." **Unit 3** (the case-marking checkpoint,
already carrying the "ergative drift" mistake callout from the review
earlier today) now ties the mistake back to the same rule: "izan/egon's
subject isn't acting on anything, so the -k shouldn't creep onto them by
mistake." Updated the Spanish translations to match; left Basque
un-elaborated per the same caution as the last two entries — I'd rather
under-translate than write confidently-wrong Basque prose.

This is a simplification a beginner unit can live with (real transitivity
vs. ergativity nuances, e.g. unergative verbs, are deferred to Unit 46's own
"Unergative Curiosities" framing) rather than a claim meant to hold
universally from Unit 2 on.

## 2026-07-05 — Unit 3's overview: surfaced the "ergative drift" mistake it's actually about

Reviewed Unit 3 ("Ni" vs. "Nik" — The Case-Marking Checkpoint) the same way
Units 1/2/16 were reviewed. Unlike those, Unit 3 is a zero-new-verb review
checkpoint — all three of its lessons are `review: true` with `sources`, no
`verbId`, so `UnitOverviewModal`'s conjugation-table feature correctly shows
nothing for it (there's no new verb/tense to preview; izan/egon/ukan's
tables already showed in Units 1-2). That left the modal with only its
one-line `focus` + `payload` example — and that copy didn't mention what the
checkpoint is actually targeting.

`journey.js`'s own code comment above this unit already names it precisely:
"pre-empting 'ergative drift' (†Nik naiz), the most common beginner error
(F7)" — but that context lived only in a comment, invisible to the learner.
Added the same framing to the user-facing `focus` string (`✗ "Nik naiz"` as
the concrete wrong form, "the most common beginner slip" as the why),
matched in the Spanish translation. Left the Basque translation's `focus`
un-elaborated rather than write new explanatory Basque prose from scratch —
same caution as the "Lehenaldiko Burutua" correction earlier today; a
shorter-but-correct translation is preferable to a confidently-wrong longer
one, and translations don't need to be verbatim-parallel across languages
in this app.

## 2026-07-05 — Fixed a crash opening Unit 16's overview: `ConjugationTable` didn't resolve `objectAxis` tenses

A user reported Unit 16's "help" (the unit overview modal) was broken.
Root cause: Unit 16's practice lessons (`ukan-object-axis-present`, etc.) use
`tense: 'presentByObject'`/`'pastByObject'` with an `objectAxis: { vary,
fixed }` field — `getComposedTable` returns those as a 2D `{ [outer]: {
[inner]: form } }` grid, not the flat `{ [person]: form }` shape
`ConjugationTable` expects. Without resolving through `resolveObjectAxisTable`
first, `ConjugationTable` tried to render a form-slot object directly,
throwing "Objects are not valid as a React child" — a hard crash, not just
wrong content. This bug predated `UnitOverviewModal`: `LessonPreviewScreen`
(`ExerciseScreen.jsx`) had the exact same gap for any `objectAxis` lesson's
first-attempt preview, just never surfaced because `ConjugationTable`'s only
caller before #574 was that preview screen and no bug report had come in for
it.

**Fix:** `ConjugationTable` (`components/conjugationTable.jsx`) now takes an
optional `objectAxis` prop and resolves the table through
`resolveObjectAxisTable` when present, matching how `generateQuestions`
already handles the same tenses. Threaded `lesson.objectAxis` through both
call sites — `LessonPreviewScreen` and `UnitOverviewModal`'s
`conjugationEntries` (whose dedup key now also includes the fixed person, so
two lessons sharing a verb/tense but pinning a different `objectAxis.fixed`
each still get their own table).

**Verified it doesn't happen elsewhere:** added a test that renders
`UnitOverviewModal` for every `available` unit in `JOURNEY` (all 51) —
confirmed it reproduces the exact crash for Unit 16 before the fix, and
passes clean for every unit after it, so no other unit is currently hitting
this gap.

## 2026-07-05 — Unit overview affordance: added a visible "info" badge

Feedback on the unit overview modal (#574): tapping a unit's title/card to
open it wasn't discoverable — the header was plain text with only a
`hover:opacity` change, which is invisible on a touch device (no hover) and
gave no indication there was anything to tap at all. `PendingUnitCard`
happened to look tappable anyway since it's already a bordered card, but
`UnitLessons`'s available-unit header sits as bare text above the lesson
list with no visual separation.

Added a small circular `InfoIcon` badge (`components/icons.jsx`) right next
to the unit title in both places, plus a persistent tap-target treatment for
`UnitLessons`'s header (`hover:bg-gray-100` + `active:scale-[0.99]`, matching
the rest of the app's button feedback) instead of the previous opacity-only
hover. Chose a dedicated info icon over reusing `LightbulbIcon` (already
associated with in-exercise hints, a different meaning) or a chevron (implies
navigating *into* something, not opening an overlay).

## 2026-07-05 — #213: toka/noka wrong-gender/neutral-form distractor lures

Now that `izan`/`ukan`'s toka/noka data was native-speaker-confirmed (this
same day, earlier entry below), built the distractor-matrix row #213 asked
for: a toka/noka question's options now include the *wrong-gender* form
(the opposite register, same verb/person — `dun` alongside `duk`) and the
*neutral-form* (the plain, non-hitanoa form — `da` alongside `duk`), on top
of the existing same-table (hura vs haiek) distractor.

**Two new pure lure functions**, `getWrongGenderLure`/`getNeutralFormLure`
(`lessonLogic.js`), mirroring the existing `getCaseFrameLure`/
`getObjectNumberLure` family: `(verb, tense, person) => form`, driven by two
small lookup tables (`HITANOA_GENDER_PAIRS`, `HITANOA_NEUTRAL_TENSES`)
mapping each of the four hitanoa tenses to its opposite-register/neutral
sibling tense.

**One narrow exception to "bare `form` is never grounded."** Every other
lure in this file borrows from a *different* verb, so `buildTaggedOptions`
only trusts them with a sentence to anchor "why this reads as wrong" (the
`grounded` invariant, #227/[B2]) — a bare `kind: 'form'` question has no
sentence, so those lures get dropped entirely there. Toka/noka's own lures
don't have that problem: they're the *same* verb and person, just the wrong
register or no register at all — guaranteed-wrong by construction, nothing
to disambiguate. Rather than loosen `grounded` generally (which would also
surface the *other*, genuinely context-dependent lures on bare `form`
questions elsewhere — out of scope and unreviewed), `generateQuestions`'s
`default` case now special-cases the four hitanoa tenses: `grounded: true`
with only `hitanoaLures` (still `[]` for the general cross-verb pool).

**Effect**: a toka/noka question's 2-person table now yields up to 4 options
(same-table + both lures) instead of 2 — updated the
`logic.test.js` test asserting the old 2-option shape accordingly, and added
dedicated tests for both lure functions plus the `optionRationale`/
`getLureRationale` wiring. Added `lureRationaleWrongGender`/
`lureRationaleNeutralForm` translation keys (all 3 locales), following the
existing `lureRationale*` naming/phrasing convention.

## 2026-07-05 — Unit 45 ("Talking About Weather") shipped — last pending unit; curriculum is now 51/51 available

Weather idioms are always 3rd-person-singular (`hura`) and, per
`docs/LEARNING_JOURNEY.md`'s own framing, reuse `izan`/`egon`/`ibili`/`ukan`'s
existing `hura`-present forms (`da`/`dago`/`dabil`/`du`) rather than
introducing any new conjugated form. The open design question was *how* to
reuse them.

**Rejected: appending weather sentences directly to `izan`/`egon`/`ibili`/
`ukan`'s own `sentences.present.hura` arrays.** Those arrays already hold
8-12 unrelated variants each (predicate-nominal frames, location frames,
motion frames); `pickVariant` picks one at random per question, so a couple
of new weather entries added there would mostly get *diluted out* — a
"Talking About Weather" lesson would show a non-weather sentence most of the
time. It also risks a stray weather sentence surfacing in `izan-present`
(Unit 1) or `ibili-present` (Unit 6) long before a learner reaches Unit 45,
for no benefit.

**Chosen: 4 small dedicated "weather idiom" `VERBS` entries**
(`eguraldia-ari`, `eguraldia-izan`, `eguraldia-egon`, `eguraldia-ibili`),
each a single-cell `{ present: { hura: '<form>' } }` table copying an
already-known form verbatim, with its own `sentences.present.hura` array
holding *only* weather content. This mirrors the existing `lagundu`/
`mesede-egin`/`kalte-egin` cluster precedent (a new thematic entry whose
conjugated forms are generated from — or in this case, identical to — an
already-known paradigm) rather than inventing a new mechanism. Zero new
conjugation *forms* are taught (the whole point per the unit's spec); the
"new `VERBS` entries" are just a home for new *sentences*, keeping the
change's blast radius limited to a bonus unit instead of 40+ existing
lessons that already draw on `izan`/`egon`/`ibili`/`ukan`'s present tense.

**2 lessons**: `unit-45-weather` (first-exposure pooled practice) and
`unit-45-review` (capstone), both `persons: ['hura']`, pooling all four
entries. Reviewed (and accepted) one known side effect: `eguraldia-ari`'s
`agreement: ['nor', 'nork']` (matching `ukan`'s real class, since the form
`du` genuinely is `ukan`'s nor-nork `hura` cell, just used impersonally)
makes it agreement-*incompatible* with the other three (`agreement: ['nor']`)
under `agreementsCompatible` — so its own `sentence`/`type-verb` questions
get thinner ordinary cross-verb distractors than the other three, same
graceful degradation already accepted for Unit 15's `eman` (4-person table).
`case-mixer` (which wants exactly this kind of agreement mismatch) can
occasionally surface a richer question for it instead.

**Also confirmed, not a bug:** `spot-error` questions for these thin
(1-person) sources borrow filler sentences from the entire `VERBS` array via
`getBorrowedSpotErrorSlots` (only the anchor sentence has to be genuinely
correct; the deliberately-wrong option's *topic* doesn't matter for a
"spot the grammar mistake" drill) — this is the same pre-existing, generic
small-table fallback every other thin unit already relies on (e.g. Unit 25's
imperative), not something new introduced here.

Regenerated `scripts/validfor-gap-baseline.json` after reviewing the new gap
slots via `node scripts/validfor-delta-audit.mjs --verb <id>` for all four new
entries — every listed gap was an unrelated, genuinely-non-interchangeable
sentence (e.g. `du` correctly *not* validated against "Hark opari bat ___."),
so nothing needed a `validFor` addition. See `docs/LANGUAGE_DECISIONS.md` for
the weather-phrasing-specific native-speaker-confirmation flag.

Fixed two tests that hardcoded Unit 45 as "the" example pending unit
(`App.homeScreen.test.jsx`) — with this unit shipped, **all 51 curriculum
units are `available`**, so there's no real pending unit left to click
through to. Exported `UnitOverviewModal` (`HomeScreen.jsx`) so the
"coming soon" rendering path can still be tested directly with a synthetic
pending unit, rather than depending on real journey data staying
permanently incomplete.

## 2026-07-05 — Unit 39 ("Hitanoa Recombined") shipped, content-only

`docs/EXERCISE_ENGINE.md` had already resolved this unit's data shape (toka/
noka are just two more directly-selectable tense values, same as every other
tense) and flagged only two open questions, neither blocking: #213 (a
dedicated wrong-gender/neutral-form distractor row) and a "learner-facing
addressee-gender selection control." Both stay open, unaddressed here:

**No selection control needed.** `ExerciseScreen.jsx` already looks up
`TENSE_META[question.tense]` *per question*, not per lesson (confirmed by
reading the code, not assumed) — every pooled review that mixes tenses
(present/past/future mixers, Unit 31's case-mixer reviews, etc.) already
renders each question's own tense badge. Pooling `presentToka`/`presentNoka`
into one review lesson means the badge itself ("Present (toka)" vs "Present
(noka)") already tells the learner which register a question wants — nothing
new to build.

**"When not to use it" via juxtaposition, not a new mechanic.** Basque
suppresses toka/noka in subordinate clauses and formal `-ke-` moods
(`docs/LANGUAGE_DECISIONS.md`, 2026-06-17) — a negative rule with no positive
form to produce, and no existing engine hook for "this construction forbids
register X." Rather than build one, `unit-39-when-not-to-use` pools the
hitanoa forms alongside `izan`/`ukan`'s already-shipped Ahalera (`potential`)
forms in one review: the learner meets both "Present (toka)"-badged and
"Ahalera"-badged questions back to back, and the *absence* of a toka/noka
variant on the Ahalera forms is what teaches the rule. `#213`'s stronger
wrong-gender lure work stays out of scope, same as `docs/EXERCISE_ENGINE.md`
already flagged.

**4 lessons, zero new verbs/tenses**: `unit-39-recombined-present`/`-past`
mix toka+noka together (previously drilled one register at a time in Units
37-38), `unit-39-when-not-to-use` adds the Ahalera contrast, and
`unit-39-review` pools everything as the unit's capstone (not score-gated —
this is a bonus unit, not a Refresh Gate).

## 2026-07-05 — Unit 31 (Refresh Gate C, "The Case-Ending Mixer") shipped, no new question kind

`docs/EXERCISE_ENGINE.md` had speculated this gate would need a `spot-error`-
style "candidate full sentences, pick the right one" mechanism (mirroring the
negation drill), and deliberately left it `pending` until Units 20-21's
dative verbs existed. Both turned out unnecessary once those verbs (Units
26-30) landed:

**`case-mixer` already generalizes to all four agreement shapes.**
`generateCaseMixerQuestions` filters siblings via the *negation* of
`agreementsCompatible`, which was generalized past izan/ukan back in #165 —
so pooling `izan` (nor) / `ukan` (nor-nork) / `gustatu` (nor-nori) / `esan`
(nor-nori-nork) into one review yields case-mixer questions across every
pairwise NOR/NORK/NORI contrast, not just nor-vs-nor-nork. No new question
kind, no new engine mechanic — confirmed empirically (a throwaway script
generating each new review's questions) before writing this up.

**Added `lesson.caseMixerCount` (opt-in).** `CASE_MIXER_QUESTION_COUNT` (1)
is deliberately thin everywhere else — case-mixer is normally an incidental
side effect of a review mixing agreement types, not the point. For Gate C it
*is* the point, so `createExerciseState` (`ExerciseScreen.jsx`) now honors a
per-lesson override, used only by Unit 31's 8 lessons (present/past/future
mixer pairs at 4 each, a dative past/future recombination lesson at 3, the
final gate review at 6). Every other review is unaffected.

**8 lessons, zero new verbs**, per the unit's own constraint: singular/plural
mixer pairs for present, past, and future (izan/ukan/gustatu/esan), a
`unit-31-dative-recombination` lesson bridging Unit 26's dative verbs
(gustatu/iruditu/ahaztu) with Unit 28's ditransitives (esan/eman) across past
and future — the "dative past/future recombination" half of the spec — and a
final cumulative `unit-31-review` (the score-gate checkpoint, adding
`lagundu` from Unit 30 for variety). All sentence data for these four core
verbs already carried vetted `validFor` tags from earlier curation passes, so
no `docs/LANGUAGE_DECISIONS.md` follow-up was needed.

## 2026-07-04 — Unit overview page, as a modal rather than a new screen/route

Added a "what's this unit about" page, reachable by tapping a unit's own
title/card on the home tab (rather than one of its lesson rows).

**Modal, not a third `AppShell` state.** `App.jsx`'s state machine only
toggles between `HomeScreen` and `ExerciseScreen` (`activeLessonId`); adding a
unit-overview screen there would mean threading a new `activeUnitNumber` prop
through `App.jsx` and `HomeScreen` just to render one more full-page view.
Since the content (focus/payload) is read-only and dismissable, it fits the
existing bottom-sheet modal pattern (`FeedbackModal`/`AccountModal`/
`HeartsLockedModal`) instead — state lives locally in `JourneyTab`
(`HomeScreen.jsx`), same scope as those other modals, no prop drilling past
`PhaseSection`/`StageSection`.

**No lesson list in the modal.** The first version also listed every lesson
in the unit inside the modal, but that's pure duplication — the unit's lesson
list is already the content directly below it on the home tab, one tap away
without a modal in front of it. Cut back to just the unit's focus/payload
copy and its gate/bonus badge. A `pending` unit still opens the same modal (no
`lessonIds` yet, so it falls back to a short "coming soon" note) rather than
staying inert — the ask was "for each unit," not "for each available unit."

## 2026-07-05 — Unit overview modal: added a conjugation table per verb/tense

A review of Unit 1's overview found the focus/payload copy alone ("izan and
egon, present tense — say who and where you are" / "I am a student.") doesn't
give a learner the actual forms — there was no way to see e.g. `naiz`/`da`/
`gara` without opening a lesson (and lessons stay locked until the previous
one's been attempted, so a not-yet-unlocked unit's forms were invisible
entirely). Added a conjugation table per distinct verb/tense the unit's
practice lessons cover, reusing the same table `LessonPreviewScreen` already
shows before a lesson's first attempt — extracted into
`components/conjugationTable.jsx` so both places import one implementation
instead of maintaining two copies.

Only *practice* lessons (`lesson.verbId` set) contribute a table; review
lessons (`lesson.sources`) are skipped, since they only recombine verb/tense
pairs a practice lesson already introduced — including them would just repeat
a table already shown earlier in the same modal, not add one. Unit 1 gets two
tables (`izan` present, `egon` present) from its two practice lessons; a unit
whose lessons are entirely pooled reviews (e.g. Unit 27, post-#469) shows no
tables, since there's no single canonical table for a multi-verb pool — moot
for now, since none of the current spine's practice lessons hit that pool
shape in the unit's very first table-eligible lesson.

Tables show the full 6-person paradigm regardless of the lesson's `persons`
restriction (e.g. Unit 1 only drills `ni`/`zu`/`hura`, `PHASE_1_PERSONS`) —
same behavior `LessonPreviewScreen` already had, kept as-is for consistency
rather than filtering one copy and not the other.

## 2026-07-03 — Profile tab: colorful invite/feedback buttons, reset progress demoted to a text link

A user reviewing a Profile-tab screenshot asked for two changes, both scoped
narrowly rather than the fuller "dedupe the header/body stats" rethink
discussed in the same conversation (not implemented — no explicit go-ahead
on that broader piece):

1. **"Invite a friend"/"Send feedback" should be more attractive.** Both
   used the same flat `border-gray-200 text-gray-700` treatment as every
   other secondary button, indistinguishable from "Reset progress" below
   them. Restyled using the app's existing tint-triad idiom (`border-<token>
   bg-<token>-tint text-<token>`, already used for the language-picker's
   selected state and the NOR/NORI/NORK badges) rather than inventing a new
   pattern: invite gets `brand-clay` (warm/social), feedback gets
   `brand-forest` + the existing `EnvelopeIcon` (already used inside the
   feedback modal itself, so this reuses rather than introduces an icon
   association). Both invert to solid-fill/white-text on hover, the same
   high-contrast pairing the Start/Sign-in buttons already use. Deliberately
   did *not* reuse `brand-txakoli`/`accent-hearts` (points/hearts) or a solid
   `brand-forest` fill — those already carry a specific meaning elsewhere
   (points, hearts, "the one primary CTA on screen") that reusing here would
   blur.
2. **"Reset progress" is rare, so it shouldn't compete for attention.** It's
   already `window.confirm`-gated (`handleResetProgress`, `App.jsx`), so the
   destructive action itself was never one accidental tap away — the actual
   problem was purely visual weight, sitting as a bordered button the same
   size/shape as "Invite a friend" a few pixels above it. Demoted to a plain
   underlined text link (`text-xs text-gray-400`, no border/background),
   still a real `<button>` with adequate tap padding, just visually reading
   as low-priority.

Verified with a Playwright screenshot of the live dev server (English
locale) rather than just trusting the class names — confirmed contrast and
layout read correctly before considering this done.

## 2026-07-03 — Stopped rendering `DialectBadge` — every verb is `batua`, so it never varies

A user flagged a screenshot showing a "Batua" pill on every single exercise —
correctly: `verb.dialect` is `'batua'` for all 109 verbs (`data/verbs.js`
documents it as a placeholder for future dialect variants, e.g. a
`dialectVariants: { bizkaiera: {...} }` override on some verb down the
line). Until that actually exists, the badge conveys zero information — it's
the same word on every card, pure clutter alongside `TypeBadge`/
`AgreementBadge`/`FixedArgumentBadge`, which do vary per verb/lesson.

Removed the `<DialectBadge>` line from `VerbBadgeRow` (`src/components/
badges.jsx`) — the single place both `LessonPreviewScreen` and the active
exercise header (`ExerciseScreen.jsx`) source their badge row from, so this
covers every place "Batua" was showing. Kept the `DialectBadge` component,
`DIALECT_LABELS`, and `verb.dialect` data itself untouched — re-adding the
one line to `VerbBadgeRow` is all a future dialect variant needs.

## 2026-07-03 — Rewrote all 51 units' roadmap `focus` text (and a handful of `title`s) to be learner-facing, not dev-facing

`unit.focus` (`journey.js`) isn't internal documentation — `HomeScreen.jsx`'s
`UnitLessons`/`PendingUnitCard` render it directly as the gray subtitle under
every unit's title, for both playable and locked-preview units. It had
drifted into engineering shorthand over ~500 commits: issue numbers (`#410`,
`#446`, …), engine-internal terms (`case-frame buffer`, `cross-verb review`,
`object axis`, `recognition-pooled`, `carrier`), and multi-clause run-ons
describing *implementation history* rather than *what a learner is about to
practice* (Unit 32's old focus: "dezaket/naiteke contrasted with periphrastic
ahal izan/ezin (#410/#411) — production for NOR/NOR-NORK; plus ukan's
NOR-NORK object axis (zaitzaket-type forms, #352, extended to every NORK
value by #424)..."). A user flagged this from a live screenshot.

Rewrote all 51 units' `focus` in `journey.js`, plus the six `title`s that had
the same leaked-jargon problem (Units 16, 27, 48, 49, 50, 51 — e.g. "The
Reverse Object Axis — Acting on Me/Us/You" → "Acting on Me, Us, and You").
Kept genuine grammar vocabulary the app already teaches as badges/tooltips
(NOR/NORI/NORK, ergative/absolutive/dative, "periphrastic") since learners
already meet those terms elsewhere with a plain gloss attached
(`AGREEMENT_META`'s `agreementNorkTitle`: "Ergative — who performs the
action") — the fix targets implementation jargon, not the app's actual
grammar terminology. Style: one plain sentence naming the verb(s) and what
you'll be able to say, not a changelog of which issue added which table.

Also translated the same rewrite into `journeyTranslations.js`'s es/eu
`focus`/`title` fields, matching tone (requested explicitly — the user chose
"rewrite all three languages now" over "English first" when asked). These
are fluent but not native-speaker-reviewed; flagging that honestly rather
than implying a review that didn't happen.

Incidental fixes found while rewriting: Units 48-51's old focus text
referenced stale pre-renumber unit numbers for what they're the "deep
practice" half of (e.g. Unit 48 said "the deep-practice half of Unit 15";
the actual match, confirmed by identical `payload` text, is Unit 16 — likely
never updated after a renumber). Corrected to the current numbers.

Updated `docs/LEARNING_JOURNEY.md`'s authoritative unit table to match the
six retitled units. Left the file's own pre-rebalance-numbering prose
sections (explicitly marked in the file's preamble as historical-rationale,
not synced to current numbering) and `docs/LEARNING_JOURNEY_REBALANCE.md`
untouched, per the same "don't rewrite point-in-time records" reasoning as
the entry below. `docs/CURRICULUM_MAP.md` remains stale pending regeneration
(see its own entry and the two entries below).

## 2026-07-03 — Unit 14 pools gustatu/iruditu/ahaztu into shared lessons instead of one lesson per verb

Follow-up to the entry directly below: a user flagged that Unit 14 having a
separate `gustatu-present`/`iruditu-present`/`ahaztu-present` (and the
matching `-expansion`/`-plural` trios) "makes no sense" — the point being
that NOR-NORI conjugation is one grammatical pattern (`dativeIzan`, composed
via `byNoriPrefixes`) that all three verbs share cell-for-cell; only the
prefix word differs. A separate lesson per verb was drilling the same
pattern three times over with different vocabulary glued on, not three
different things to learn — the same critique `unit-10-present`'s giant
pooled `sources` array (jan/edan/erosi/ikusi/hartu/… all sharing one `ukan`
present table) already settled for the ergative-present cluster, just never
applied here.

Collapsed the 9 lessons (3 verbs × {base, expansion, plural-NOR}) into 3
pooled lessons — `unit-14-present`/`unit-14-present-expansion` (`sources`
listing all three verbs, `persons: PHASE_1_PERSONS`/`PHASE_1_PLURAL_PERSONS`
respectively) and `unit-14-present-plural` (the `presentPlural`/object-plural
axis, also pooled, left unsplit by persons same as before) — exactly
`unit-10-present`/`unit-10-present-plural`'s existing shape, not a new
pattern. `describeLesson`/`LessonPreviewScreen`/`createExerciseState` needed
no changes — pooled non-review practice lessons (`lesson.sources` without
`lesson.review`) were already a supported, tested shape. Unit 14 drops from
12 lessons to 6; spine total 197 → 191. `journey.js`'s focus text and its
`journeyTranslations.js` es/eu counterpart reworded from "per verb" to
"pooled across gustatu/iruditu/ahaztu" to match. `docs/CURRICULUM_MAP.md`
remains stale pending a regeneration (see its own entry and the match-pairs
entry below).

## 2026-07-03 — `gustatu`/`iruditu`/`ahaztu`'s first present lesson restricted to 3 persons, gu/zuek/haiek split into a dedicated expansion lesson

Follow-up to the match-pairs cap above: `gustatu-present`/`iruditu-present`/
`ahaztu-present` had no `persons` filter, so a learner's very first exposure
to each verb was the full 6-person NORI table (`zait`/`zaizu`/`zaio`/
`zaigu`/`zaizue`/`zaie`) — both in `generateQuestions`'s one-question-per-
person queue and (before the cap above) as a 12-tile match-pairs board. That
contradicts `docs/LEARNING_JOURNEY.md`'s stated principle ("every verb's
first lesson is restricted to `ni`/`zu`/`hura`") and the original
`LEARNING_JOURNEY_REBALANCE.md` plan (line 144: this unit was meant to
introduce only `zait`/`zaizu`/`zaio`), which the implementation never
actually matched — these three verbs arrived after Units 7/8 (the general
`gu`/`zuek`/`haiek` expansion gates), and nothing filled the equivalent
per-verb expansion step for them.

Fixed by adding `persons: PHASE_1_PERSONS` to the three first-lessons and
inserting three new lessons (`gustatu-present-expansion`/
`iruditu-present-expansion`/`ahaztu-present-expansion`, `persons:
PHASE_1_PLURAL_PERSONS`) directly after them in both `LESSONS` (which is
what actually drives unlock order, per `getUnlockedLessonIds`) and Unit 14's
`lessonIds` — same "zero new verbs, just the plural persons" framing Units
7/8 use, just applied per-verb since these three didn't exist yet when
7/8 ran. The later reviews in the unit (`unit-23-number-split-review`,
`unit-23-case-frame-buffer`, `nor-nori-present-pool`) are left unfiltered —
by the time a learner reaches them both stages are already taught, so
mixing all 6 persons there is correct. Updated `journey.js`'s focus text,
`journeyTranslations.js`'s es/eu Unit 14 focus, and `LEARNING_JOURNEY.md`'s
lesson-count column (9 → 12) and spine total (194 → 197 lessons) to match.
`docs/CURRICULUM_MAP.md` is generated by an unchecked-in script (see its own
entry below) and is now stale until someone reruns it — a known, accepted
gap per that entry, not new to this change.

Not touched: `LEARNING_JOURNEY_REBALANCE.md` and older dated entries in this
log that mention the pre-fix lesson count — those are historical records of
what was decided *at the time*, not living docs, so they're left as
point-in-time snapshots rather than rewritten.

## 2026-07-03 — `MATCH_PAIRS_MAX_PAIRS` caps a match-pairs board at 4 pairs

A user flagged a `gustatu-present` screenshot (6-person NORI table → 12
tiles, several two-line like "gustatzen zaizue") as overwhelming for a
tap-to-match board. `generateMatchPairsQuestions` (`src/lessonLogic.js`) now
randomly samples down to 4 pairs when a table's in-scope persons exceed that
— eligibility (`>= 3` distinct-form persons) is still checked against the
*full* table first, so a table doesn't become ineligible by capping. No
lesson gets a fixed 4-person subset either: each attempt reshuffles which 4
survive (`shuffle(pairs).slice(0, MAX)`), same as the existing per-attempt
reshuffle in `MatchPairsBoard`, so repeated attempts eventually cover the
whole table instead of hiding 2 persons from it permanently.
## 2026-07-03 — Same composition treatment for NOR-only (intransitive) verbs riding `izan`

Follow-up to the two entries directly below, this time for the `izan`
("to be") side of the auxiliary system instead of `ukan`. `sartu`/`atera`/
`hasi`/`bizi-izan`/`erori`/`jaiki`/`arriskuan-jarri` (present/past/future)
and `ahal-izan`/`ezin-izan` (present only) each hand-carried a literal
table that was mechanically `<own prefix> + izan's own cell` — verified
byte-for-byte, zero exceptions. Added a new `izan` entry to
`OBJECT_AXIS_SKELETONS` (flat, not nested like `edun` — a NOR-only verb has
no second argument to vary over, so no 2D shape is needed) and selected it
via a verb's `byObjectSkeleton: 'izan'`, the field `presentByObject`/
`pastByObject` composition already reads but no verb had used before this.
`getComposedTable`'s flat-tense branch now checks `skeletonName` to decide
between the nested-2D read (`edun`) and the flat read (`izan`).

**Guarded against composing a `*Plural` tense for `izan`-skeleton verbs**:
a NOR-only verb has no object, so there's no object-number axis for it at
all — `presentPlural`/`pastPlural`/`futurePlural` are meaningless concepts
here, unlike for `ukan`-skeleton verbs. Without this guard, a NOR-only verb
with a `composedPrefixes.past` would produce a "pastPlural" table
identical to its own `past` table (same prefix, no `haiek` column to
distinguish it) — which `getObjectNumberLure` calls unconditionally
whenever `tense === 'past'`, regardless of a verb's agreement, as an
"object-number" distractor. That would have offered the *correct* answer
as its own distractor for every NOR-only verb's past-tense question — a
duplicate-correct-option bug, not just a manufactured axis. Caught by
reasoning through `getObjectNumberLure`'s existing call site (`#165`) before
writing the code, not by a failing test.

**Left `ari` out of scope**: unlike the other 9, its literal `present`
table only has 3 persons (`ni`/`zu`/`hura`) — deliberate, per the "Phase I's
3-person horizon, option (a)" convention documented near the top of
`verbs.js` (its lesson hasn't reached Unit 7's 6-person expansion yet, not
a linguistic gap). Composing it against the 6-person `izan` skeleton would
silently *add* `gu`/`zuek`/`haiek` cells that don't exist today — mechanically
correct forms, almost certainly, but the same kind of incidental widening
the `byObjectPrefixes`-vs-`composedPrefixes` split two entries below was
built to avoid. Left as a hand-written 3-cell table; not worth a
per-verb person-filter just to dedupe 3 cells.

Confirmed byte-identical composed output for all 9 verbs against the
pre-refactor literals, and a clean full-block diff (only the intended
`byObjectSkeleton`/`composedPrefixes` lines differ) before relying on
`npm test` — 493 passing on the first run this time, no casualties like
`ikusi`'s two nested tenses from the `ukan` pass.

## 2026-07-03 — Extended composition to the same 14 verbs' plain `present`/`past`/`future` tables too; renamed `pluralPrefixes` → `composedPrefixes`

Follow-up to the entry directly below: a user pointed out the same
duplication also applies one level up — `jan.conjugations.present.ni`
("jaten dut") is *itself* mechanically `jan.byObjectPrefixes.present`
("jaten ") + `ukan.conjugations.present.ni` ("dut"), verified with zero
exceptions across all 14 verbs and all three of `present`/`past`/`future`.
Extended `getComposedTable`'s flat-tense branch to also compose these (the
`hura` column of the same skeleton, vs. plural's `haiek` column), and
deleted the 14 verbs' literal `present`/`past`/`future` tables too, leaving
only `nahi`'s/`ukan`'s already-narrower shapes and each verb's
`composedPrefixes`. Renamed `pluralPrefixes` → `composedPrefixes` (it now
drives 6 tenses, not just the plural 3) via a global identifier rename —
purely mechanical, same field, same values, same scoping rationale (kept
deliberately separate from `byObjectPrefixes` for the reasons below).

**Deliberately scoped to just these 14 verbs**, not all 38 with
`byObjectPrefixes` — asked the user first, since (a) `present`/`past` are
the single most-read table in the app, a materially larger blast radius
than the plural axis, and (b) making them fully computed removes the
"read the verb entry, see its conjugation" property that makes this data
file directly reviewable, a real (if debatable) cost the plural axis barely
had.

**Caught a real data-loss bug during this pass**: the mechanical deletion
regex matched each verb's *entire* `conjugations: { ... }` object body (not
just `present`/`past`/`future`), since it stopped at the first top-level
closing brace — which for most of the 14 was exactly `present`/`past`/
`future`, but `ikusi` also carries `habitualPast`/`presentPerfect` nested in
that same object. Those two tables got silently deleted along with the
intended ones. Caught by `journey.test.js` (`ikusi-present-perfect` lesson
suddenly pointed at nothing) and confirmed by a full block-diff of all 14
verbs' original vs. current source (everything outside `conjugations`/the
prefix fields byte-identical) before restoring `ikusi`'s two tables by
hand. Lesson: a "remove tense X" edit on a shared container needs to name
what's *kept*, not just match up to the next closing brace — especially on
a file where individual verbs accreted tenses over 500+ commits.

Also updated `verbHasComposedTense` (`verbs.js`, gates the "future/past
sentences reuse present/past's" loops) and the `sentences.futurePlural`
aliasing loop to check `composedPrefixes` alongside the literal-table and
`byNoriPrefixes`/`ditransitivePrefixes` checks they already had — same
"existence-check bypasses `getComposedTable`" gotcha as `getObjectNumberLure`
below, now the second and third instances of it. Several `logic.test.js`
assertions that read a touched verb's `.conjugations.present`/`.past`
directly as "known-good" ground truth (comparing against
`presentByObject`/`pastByObject`'s citation column, `getRecencyContrastLure`,
an `ari`-progressive lure test) were updated to read through
`getComposedTable` instead. Re-verified byte-identical composed output for
all 6 tenses across all 14 verbs, and an unchanged `validfor-audit.test.js`
baseline, before relying on `npm test` (493 passing).

## 2026-07-03 — Composed `presentPlural`/`pastPlural`/`futurePlural` for 14 more `ukan`-auxiliary verbs, dropping their literal tables

A user flagged the exact duplication #436 had already fixed for
`presentByObject`/`pastByObject`: `jan`/`edan`/`erosi`/`hartu`/`ikusi`/
`nahi`/`entzun`/`bilatu`/`irakurri`/`idatzi`/`ikasi`/`utzi`/`saldu`/`egin`
each hand-carried their own `presentPlural`/`pastPlural`/`futurePlural`
literal tables — the flat "NOR = haiek" slice of the NOR-NORK object axis —
every cell of which was mechanically `<verb's own prefix> + ukan's own
plural-object cell` (verified byte-for-byte before touching anything).
Extended `getComposedTable` (`lessonLogic.js`) to compose these three tenses
from `OBJECT_AXIS_SKELETONS.edun`'s `present`/`past` `haiek` column, and
deleted the 14 verbs' literal tables in `verbs.js`. `ukan` itself keeps its
own hand-written table (it's the skeleton source, and carries extra
`hi-m`/`hi-f`/`hi` cells the skeleton can't produce). Also fixed
`getObjectNumberLure`, which read `verb.conjugations[`${tense}Plural`]`
directly — the one caller that bypassed `getComposedTable` and would have
silently gone blind for these 14 verbs.

**Deliberately did not reuse `byObjectPrefixes`** for this, even though it
already holds the exact same prefix strings for 8 of these verbs. The ~30
verbs #443 gave a `byObjectPrefixes` for the present/past 2D axis never had
a plural-object table at all; a first pass reused that field and silently
manufactured `presentPlural` for all of them too, which also manufactures
new cross-verb `validFor` gap slots — exactly the surface
`docs/DISTRACTOR_STRATEGY.md` §4.2 says needs a human naturalness review,
not an incidental refactor (caught by `validfor-audit.test.js`'s baseline
diff, not by inspection). Used a new, separate `pluralPrefixes: { present,
past, future }` field instead, added only to the 14 verbs that actually had
a plural table before. Also found and fixed a second casualty of the same
kind: a post-processing loop at the bottom of `verbs.js` that aliases
`sentences.futurePlural` from `sentences.presentPlural` gated on
`verb.conjugations.futurePlural` existing as a literal — now also checks
`verb.pluralPrefixes?.future`. Confirmed both `computeGapCounts`'s baseline
and every composed cell are byte-identical to pre-refactor via a throwaway
script before relying on `npm test` (which also passes clean).

Out of scope: `gustatu`/`iruditu`/`ahaztu` (NOR-NORI, `dativeIzan` skeleton)
and `esan`/`eman` (ditransitive, `diot` skeleton) have their own
`presentPlural`/`pastPlural`/`futurePlural` literal tables with the same
shape of duplication, but ride a different auxiliary family — composing
those would need the same treatment against their own skeletons, left for a
follow-up rather than guessed at here.

## 2026-07-03 — `CURRICULUM_MAP.md` now shows the actual conjugated Basque forms per lesson

The tag-only pass (🆕/📗/✅/➕/review-only) said *that* a lesson was new but never showed *which conjugated words* it actually taught — the literal answer to "what conjugation is introduced here" was still missing. Reworked the generator to resolve real forms straight from `verbs.js`, reusing `lessonLogic.js`'s own `getComposedTable`/`resolveObjectAxisTable` helpers (the same ones `generateQuestions` calls at runtime) rather than reading `conjugations[tense][person]` directly — most axis tenses (`presentByObject`, `presentByNor`, ditransitive `present`/`past`/`future`, …) aren't stored as literal tables at all, they're composed from a shared skeleton plus a per-verb prefix, and a lesson's own `objectAxis` (`{ vary, fixed }`) then has to collapse the composed 2D table down to the flat slice that lesson drills. Reusing the app's real resolution logic instead of reimplementing it means the forms shown are guaranteed to match what a learner actually sees, including every gap (`hi`, reflexive cells) the real tables have.

Every practice lesson now has a `Forms:` line with the actual words (e.g. `izan-present` → **naiz** (ni), **zara** (zu), **da** (hura)); the ✅/➕ new-material tags on pooled/review lessons show forms too, but suppressed for single-verb practice lessons where the `Forms:` line already said the same thing (avoided doubling every line). Wide pools (e.g. Unit 16's 37-verb object-axis review) still cap at 3 example verbs' forms rather than all of them, to keep the file from ballooning into thousands of near-duplicate lines.


