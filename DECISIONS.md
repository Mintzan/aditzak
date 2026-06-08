# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

## 2026-06-08 — `CONJUGATIONS.md` keeps the *current* picture; the story of how it got there belongs here

**Decision:** Trimmed `CONJUGATIONS.md` of in-place retrospectives — passages
like "an earlier pass assumed X, that was backwards, here's why" sitting
inside table sections (the §4 `hika`/`zuka` writeup, §5's `zu`-vs-`zuek`
correction, the §4 ahalera/subjuntiboa contradiction writeup) — down to short
notes that state the *current* fact plus a pointer to the dated `DECISIONS.md`
entry that records the correction and its reasoning. Also: compressed the
intro's "sources merged in, in arrival order" paragraph (a changelog dressed
as reference prose — accurate today, guaranteed to rot the moment a new
source lands or arrival order stops mattering) into a flat source list with
no ordering claims; trimmed §15's source-description preamble similarly; and
deleted the closing "Where this stands" section, which restated — and had
already drifted slightly out of sync with — the same ⚠️-flagged discrepancies
already documented inline at point of use (the doc's own stated policy).

**Why:** Asked to review the file as a *reference for further decisions* and
flag what wasn't pulling its weight. The throughline: a reference document's
job is to answer "what's true, and how sure are we?" as fast as possible —
every paragraph a reader has to get through to reach that answer is friction,
and a paragraph that *narrates a now-fixed mistake* is friction that actively
points backwards. `DECISIONS.md` already exists to carry exactly that kind of
story (the "why," the false starts, the methodology) — duplicating it inline
in the reference just gives the same content two homes, one of which (the
inline copy) has no mechanism keeping it in sync as understanding evolves
further. Corrections now live in the table itself (the thing that's actually
looked up) plus a one-line pointer to the dated entry that explains them —
shorter to read, and only one place can go stale.

## 2026-06-08 — Filling NOR-NORK's "`NOR` = 1st/2nd person" gap: derive-and-flag where the recipe checks out, stop cold where it contradicts a sourced form

**Decision:** Extended `CONJUGATIONS.md` §4 (`ukan`'s NOR-NORK system) with
grids that fill in the present/past/baldintza/ondorioa(×2) tables' other
half — the `ni`/`hi`/`gu`/`zu`/`zuek`-as-object columns the citation-paradigm
framing had left mostly blank ("you have *me*", "they had *us*", as opposed to
the already-covered "I have *it/them*"). §14's chart (the "Euskal aditz
laguntzailea" PDF) gives this half as compact `[prefix]+[stem]+[suffix]`
row-templates rather than spelled-out words; rather than transcribing those
templates wholesale (§14's own write-up already calls that "error-prone") or
mechanically expanding every cell into a word on faith, each mood got the same
treatment: (a) decode the recipe, (b) *cross-check it* against cells already
sourced elsewhere in §4 before trusting it on cells that aren't, (c) only then
fill — marking everything not already cross-checked 🔍 (recipe-derived, not
independently attested) — or, if the cross-check itself fails, *stop* and
flag the contradiction rather than paper over it. Both outcomes happened:

- **Present/past/baldintza/ondorioa(×2)**: the recipe cross-checks cleanly —
  e.g. `nind-` + `-u-` + `-en` → `ninduen`, matching the existing `hark`→`ni`
  cell — modulo one real wrinkle worth calling out by name: a `-z-` that
  appears between a plural-object stem and the `haiek`-subject suffix
  (`dituzte`, not `†ditute`; `gintuzten`, matching the existing sourced cell,
  not `†ginduten`). With that rule folded in, all five grids are now filled
  (`zuek`-as-object still left blank — see below).
- **Ahalera/Subjuntiboa**: the recipe *doesn't* cross-check. Running §14's own
  "`NOR` = 1st/2nd person" template for ahalera-present on the `nik`/`hura`
  cell yields `dezaket` (3rd-person-style `d-` marking) — but the
  already-sourced citation-paradigm cell for that exact combination is
  `nezake` (1st-singular-style `ne-` marking). These aren't spelling variants;
  they disagree about *which argument the verb is agreeing with*. Rather than
  silently pick a side (or, worse, expand a whole grid on top of an
  unreconciled foundation), this is written up as an open discrepancy and the
  templates are left untouched, unexpanded — the section explicitly says so,
  with the specific contradicting forms named, so a future pass with a better
  source can resolve it instead of having to rediscover it.

**Why:** Asked to use the PDF to build out the NOR-NORK tables, then asked
again to *complete* what was left as bare templates. The natural temptation
with a chart this information-dense is to mechanically expand every template
into every cell — but the `dituzte`-vs-`†ditute` wrinkle (found by
cross-checking the recipe against forms §4 *already* had, before trusting it
on cells it didn't) and, more sharply, the ahalera `dezaket`-vs-`nezake`
contradiction, are exactly the kind of thing that looks like correct Basque
while teaching a paradigm that doesn't exist — the failure mode
`DECISIONS.md`'s very first entries on `izan`/`ukan` content already named.
The two moods where expansion stopped aren't a "ran out of effort" gap; they're
a place where the *cross-check itself* returned "these two facts can't both be
true," and inventing a resolution would be strictly worse than naming the
contradiction — a wrong-but-confident table is harder to fix later than an
honest unresolved flag, because nothing signals it needs a second look.
Leaving `zuek`-as-object blank throughout for a related reason
(its `-zte-` infix would, for the first time in this paradigm, collide with a
*vowel-initial* suffix — `-zte-` + `-en`/`-uzun`/… — exactly the kind of
juncture that produced the `-z-` surprise above) is the same call made
smaller: an honest gap beats a guess stacked on a guess. 🔍-marking the
recipe-derived cells (rather than presenting them at the same ✅/📖 confidence
as sourced material) keeps the file's existing confidence-key promise intact —
"📖 means cross-checked where possible", and these specific cells, by
construction, couldn't be.

**Correction (same day):** A native speaker reviewed the freshly-filled `hi`
column (and, separately, confirmed the recipe-derived `hik`→`gu` present-tense
cell `gaituk`/`gaitun` as correct, promoting it from 🔍 too) and flagged two
things about the `hi` column itself. First, `haut`/`hau`/`haugu`/`haute`
("I/he-she/we/they have you-familiar") are real — confirmed directly, no
longer 🔍. That
also exposed a misclassification: `guk`→`hi` (and, by the same bad reasoning,
`zuk`/`zuek`→`hi`) had been marked `*(refl.)*` on the assumption they'd be
"exactly as reflexive-shaped" as the already-marked `nik`→`gu`/`zu`/`zuek`
diagonal — but "we have you" involves two *different* people, so it was never
reflexive; that was pattern-matching on shape, not checking the actual
grammar, and the file now says so plainly rather than quietly fixing it.
Second — and this is the bigger find — `hauzu`/`hauzue` ("don't make sense",
the speaker said) aren't unsourced gaps either: `hi` (familiar address, *hika*)
and `zu`/`zuek` (formal address, *zuka*) are mutually exclusive registers that
can never both be arguments of one verb form, so `hik`↔`zu`/`zuek` combinations
are *impossible*, not merely unattested. That's a third category distinct from
both "(refl.)" and "🔍 unsourced", so it gets its own marker, `*(hika/zuka)*`,
applied to every such cell across all five expanded grids (replacing what had
been a mix of wrong `(refl.)`, wrong 🔍 guesses, and honest blanks). **Lesson
for future passes on this file:** "shaped like an already-known impossible
diagonal" is not evidence of *being* impossible — each blank cell's
impossibility (or lack of it) needs its own justification, not an inherited
one from a cell that merely looks similar.

## 2026-06-07 — The itinerary now ramps up in three stages: bare forms → richer framings → cross-lesson reviews

**Decision:** Restructured the lesson progression so it starts simple and
single, then layers in complexity and combination, in three stages:

1. **Bare forms first.** `generateQuestions` gained an `onlyBareForm` option
   that suppresses the sentence/pronoun/typed framings entirely, so a brand-new
   conjugation is first met in its simplest, most recognisable shape — pick the
   right form for "hura", nothing else going on. `createExerciseState` sets it
   whenever `attempts === 0` for a (non-review) lesson; from the second run on,
   the lesson opens up to the full mix that already existed.
2. **Richer framings on repeat.** No new mechanism here — this *is* the
   existing sentence/pronoun/typed mix from prior decisions below, now
   deliberately held back until the learner has met the bare paradigm once.
3. **Cross-lesson review checkpoints.** `LESSONS` now appends *review* lessons
   alongside the existing (verb × tense) *practice* ones: once a verb has more
   than one tense, a `{ id: '${verbId}-review', review: true, sources: [...] }`
   lesson combining all of them slots in right after (e.g. izan's present +
   past, interleaved in one session); once there's more than one verb, a final
   cross-verb "mixed review" caps the whole sequence. Review lessons carry
   `sources` (the conjugation tables they draw from) instead of a single
   `verbId`/`tense`; `createExerciseState` runs `generateQuestions` once per
   source and shuffles the results together, and every generated question now
   carries the `verbId`/`tense` it came from so `ExerciseScreen` can derive the
   right verb/badges/prompt context *per question* rather than once for the
   whole lesson — which is what makes a session that jumps between `izan`
   present and `izan` past (or `izan` and `ukan` altogether) render correctly
   and, as a bonus, gives the learner a live "which paradigm am I in right now"
   cue as it changes question to question. `describeLesson` centralises the
   practice-vs-review display copy (icon/title/subtitle/heading) so
   `LessonNode`/`ProgressTab`/`LessonResultsScreen` don't each special-case the
   two shapes, and `groupLessonsByVerb` now splits lessons into per-verb groups
   plus a trailing `mixedLessons` bucket — a "verb review" (all sources share
   one verb) still slots into that verb's section in `LearnTab`, while a
   cross-verb "mixed review" gets its own trailing `ReviewSection`, keeping
   visual order matched to unlock order (no lesson appears somewhere other than
   "right after the one that unlocked it").

**Why:** Asked to plan a learning itinerary that starts with simple,
single-conjugation exercises and works up to complex, combined ones. Gating
question framings on `attempts` (rather than e.g. a global "skill level")
keeps the existing per-lesson progress model as the single source of truth —
no new state to track or persist. Making reviews *lessons* (not, say,
occasional bonus questions mixed into existing lessons) keeps every lesson's
identity and score meaning what it always has — "how well do you know `ukan`
past" stays a question about `ukan` past alone, never diluted by surprise
`izan` questions — which matches the project's running preference (see
"Complete the sentence" below) for folding new ideas in without disturbing
lesson identity, unlocking, or progress storage. Tagging every question with
its `verbId`/`tense` at generation time, rather than threading "current verb"
state through the exercise screen some other way, means `ExerciseScreen` and
`generateQuestions` stay decoupled from whether they're in a single-source or
multi-source lesson — the same code path serves both.

## 2026-06-07 — `izan`'s example sentences must stick to identity/characteristic predicates, not location/state ones (that's `egon`'s job)

**Decision:** Reworded the `hi`/`hura`/`gu`/`zuek`/`haiek` entries of `izan`'s
`sentences.past` and `pronounSentences.past` (e.g. swapped "Hi etxean ___."
→ "Hi nire laguna ___.", "Hura hemen ___." → "Hura irakasle ona ___.",
"Zuek pozik ___." → "Zuek oso azkarrak ___."). The originals predicated
location ("etxean", "hemen", "eskolan", "kanpoan") or a temporary
state/feeling ("pozik") of the subject — in Basque those call for `egon`
("Hura hemen zegoen", not "zen"), a distinct verb from `izan` that the app
doesn't model yet. Pairing `izan`'s conjugated forms with sentences that a
native speaker would only complete with `egon` taught a wrong/non-existent
paradigm. The new sentences all predicate identity, role, or an inherent
characteristic of the subject ("nire laguna", "irakasle ona", "oso
azkarrak"), which is squarely `izan` territory and mirrors the kind of
predicates already used in `sentences.present`/`pronounSentences.present`.

**Why:** A learner flagged that the displayed pronoun for a `nork`-agreement
question (`ukan`) showed the absolutive "ni" instead of the ergative "nik"
(fixed in `QuestionPrompt` by reading the case-correct form from
`verb.pronouns` instead of the bare grammatical-person key), and in the same
pass noticed `izan`'s past-tense sentences leaned on `egon`-flavoured
predicates. Both are the same class of bug — content that *looks* like
correct Basque but tests the wrong paradigm — so worth recording together:
when adding example sentences for a verb, the predicate has to be one that
verb actually governs, not just one that's grammatical with some "to be".

## 2026-06-07 — Typing exercises are two more question kinds, not a separate mode, and reuse the sentence data

**Decision:** Added `kind: 'type-verb'` and `kind: 'type-pronoun'` —
typed-answer siblings of the existing `sentence` and `pronoun` multiple-choice
kinds. They reuse exactly the same blanked-sentence data (`verb.sentences` /
`verb.pronouns` + `verb.pronounSentences`) and roll into the same
`availableKinds` pool in `generateQuestions`, so a verb that already supports
one framing automatically supports its typed sibling with no new data fields.
A typed question carries `correct` but no `options` — `ExerciseScreen` (renamed
from `MultipleChoiceScreen`, since "multiple choice" no longer described every
question) uses `Boolean(question.options)` to pick between the option-button
grid and a new `TypedAnswerInput` text field, and `QuestionPrompt` now keys its
blanked-sentence layout off `Boolean(question.sentence)` rather than an
explicit list of "sentence-flavoured" kinds, so it didn't need to learn about
the two new kinds at all. Correctness for typed answers is judged by a new
`isAnswerCorrect` (trims and case-folds both sides) — also adopted by
`exerciseReducer` for *all* answers, since multiple-choice options are always
exact strings from the same lookup table the correct answer comes from, so
normalising them is a no-op. `rollQuestionKind` was simplified from two
`Math.random` calls (one "is it special", one "which one") to a single roll
that partitions `[0, SPECIAL_QUESTION_CHANCE)` into equal slices, one per
available kind — same distribution, easier to reason about, and makes every
available kind individually reachable by mocking `Math.random` to a constant
(the old two-roll scheme couldn't reach the second half of the kinds list that
way, which is why this also unblocked writing deterministic tests for the new
framings).

**Why:** Asked for an exercise type where the learner types the verb or the
pronoun instead of picking it. Folding it into the existing (verb × tense)
lessons as two more *question kinds* — rather than a parallel typing-mode
lesson type — keeps it consistent with every other "new question style"
decision in this log: no changes to lesson identity, unlocking, progress
storage, or the exercise state machine, and learners get organic variety
within a lesson. Requiring sentence context for both typed kinds (rather than
e.g. a bare "type the form for `hura`") isn't just data reuse for its own
sake — typing without that anchor is ambiguous for pronouns in particular
(which declined form depends on which argument and case the sentence calls
for), and staying consistent between the verb and pronoun typed framings felt
better than making one contextual and the other not. Keeping the correct
answer hidden on an incorrect typed submission (matching the existing
multiple-choice behaviour, see below) means the learner still has to recall
the spelling when the question resurfaces, rather than being handed it.

## 2026-06-07 — Pronoun-fill questions reuse the sentence-completion machinery as a third question kind

**Decision:** Added a second "fill the blank" flavour alongside the existing
verb-completion one: `kind: 'pronoun'`, where the sentence's verb is already
spelled out and the learner picks the correctly-declined personal pronoun
("___ etxe bat du." → "Hark"). Each verb can now carry `pronouns` (the
declined form per grammatical person — e.g. absolutive `Ni/Hi/Hura/...` for
`izan`'s `nor` subject, ergative `Nik/Hik/Hark/...` for `ukan`'s `nork`
subject) and `pronounSentences` (by tense → person, mirroring `sentences` but
blanking the pronoun instead of the verb). `generateQuestions` now rolls a
single "framing" per question from whichever of `sentence`/`pronoun` have
supporting data for that person/tense (`SPECIAL_QUESTION_CHANCE = 0.5`,
split evenly across the available special kinds, else `form`), and a small
`buildOptions` helper builds the four-way multiple choice from whichever
lookup table matches the question's kind — conjugations for `form`/`sentence`,
declined pronouns for `pronoun` — so distractors are always same-kind, plausible
forms. `QuestionPrompt`/`SentenceWithBlank`/`QUESTION_PROMPTS` needed only a
one-line extension since the blanked-sentence layout is identical for both
flavours.

**Why:** Asked for a second sentence-exercise style that drills declined
pronouns instead of verb forms — folding it into the same (verb × tense)
lessons as a third question kind keeps it consistent with the existing
"complete the sentence" decision below (no new lesson type, no changes to
unlocking/progress/the exercise reducer). Storing `pronouns` per-verb rather
than as a single global declension table sidesteps having to encode "which
case does this verb's subject take" as a separate lookup — each verb just
states the forms its own example sentences need, the same way `conjugations`
already does for verb forms. Splitting the roll evenly across whichever
special kinds happen to be available (rather than e.g. a fixed per-kind
chance) means adding a third blank-filling flavour later won't silently
shrink how often any existing one appears.

## 2026-06-07 — "Complete the sentence" questions are mixed into existing lessons, not a separate lesson type

**Decision:** Added an optional `sentences` field to `VERBS` (mirroring
`conjugations`: tense → person → an example sentence with `___` marking where
the conjugated form goes). `generateQuestions` now rolls, once per question
and only where a sentence exists for that person/tense
(`SENTENCE_QUESTION_CHANCE = 0.5`), whether to ask the learner to recognise
the bare form (`kind: 'form'`, the original behaviour) or to fill the blank in
that sentence (`kind: 'sentence'`). `MultipleChoiceScreen` picks its prompt
copy and layout from `question.kind` via `QUESTION_PROMPTS`/`QuestionPrompt`,
rendering the sentence with a dashed visual blank (`SentenceWithBlank`)
instead of the bare person/label pair. Everything downstream — distractors,
`exerciseReducer`, scoring, the retry queue, progress persistence, lesson
unlocking — is untouched, since both kinds still resolve to "pick the right
conjugated form from four options".

**Why:** Asked for a new exercise type where the learner sees a full sentence
and picks the verb. Folding it into the existing (verb × tense) lessons as a
second *question style* — rather than adding a third axis to `LESSONS` or a
parallel lesson type — means no changes to lesson identity, unlocking,
progress storage, or the exercise state machine, and learners get organic
variety within a lesson rather than a whole separate mode to discover and
unlock. Rolling the kind per-question (not per-lesson) keeps lessons feeling
mixed; gating on `Boolean(sentence)` means verbs/persons without an example
sentence yet fall back to the original bare-form question with no special
casing elsewhere. `Math.random` here is fine where `shuffle` already used it
— `react-hooks/purity` only objects to *direct* calls inside component render
bodies, not to impure pure-logic helpers invoked from a `useReducer` lazy
initializer.

## 2026-06-07 — Streak nudges are throttled: a session-level cooldown plus a chance check

**Decision:** Showing the streak nudge (see below) on every milestone got
mechanical fast, so `App` now tracks a `streakNudgeCooldown` (a count of
lessons to wait), passed down as `canShowStreakNudge`. Once a nudge is shown,
`onStreakNudgeShown` resets the cooldown to a random 2–4 lessons
(`randomStreakNudgeCooldown`); it ticks down by one each time a lesson is
completed. Even when eligible, `MultipleChoiceScreen.handleSelect` only shows
the nudge ~60% of the time (`rollStreakNudgeChance`). Both random calls are
pulled into their own top-level functions and invoked from the answer-time
event handler — `react-hooks/purity` (part of `eslint-plugin-react-hooks`'s
recommended config) forbids calling impure functions like `Math.random`
directly inside a component body, even from within a nested event-handler
closure, since it can't always tell render code from event code apart;
wrapping the call in its own function and invoking *that* from the handler
satisfies it without losing the "decide once, at answer time, not at render
time" property that avoids flicker.

**Why:** Asked to make the nudge "smarter" — wait a few lessons after showing
one before showing another, and add randomness so it doesn't feel mechanical.
Cooldown lives in `App` (not `MultipleChoiceScreen`, which remounts per
lesson) since it has to persist across lesson plays for the session. Rolling
the chance check in `handleSelect` (an event, not a render) and stashing the
result in state keeps the decision stable for that answer's feedback bar
without the `useMemo`-during-render purity violation or the flicker a
post-render `useEffect` roll would introduce.

## 2026-06-07 — Mid-lesson streak encouragement lives in the feedback bar, not a new screen

**Decision:** Added a `streak` counter to the exercise state (`exerciseReducer`
increments it on a correct answer, resets it to 0 on a miss) and
`getStreakEncouragement(streak)` to `lessonLogic.js`, which returns
`{ icon, headline, message }` for milestone streaks (5/10/20 in a row) and
`null` otherwise. `FeedbackBar` shows it in place of the usual "Bikain! Great
job!" line — exactly when the streak *lands* on a milestone, so it surfaces
once per streak rather than on every subsequent correct answer.

**Why:** Asked for an encouraging message between exercises (e.g. after 5
correct in a row). A full extra screen (like `LessonResultsScreen`) would
interrupt the flow mid-lesson; reusing the feedback bar that already appears
after every answer keeps the nudge lightweight and in rhythm with the
exercise. Resetting on a miss (rather than e.g. only on first-attempt misses)
keeps "in a row" meaning what it says — an unbroken run of correct picks,
matching the learner's lived experience of the session.

## 2026-06-07 — Failed questions are requeued and hidden, not revealed and skipped

**Decision:** Reworked `exerciseReducer`/`createExerciseState` to drive the
exercise off a `queue` (plus a fixed `total`) instead of a linear
`questions`/`index` pair. A correct answer drops the question from the queue;
an incorrect one pushes it to the *back* of the queue marked `retry: true`, so
it resurfaces later in the same session — the lesson only ends once the queue
is empty, i.e. every question has eventually been answered correctly.
`correctCount` (and therefore the score/star rating shown on
`LessonResultsScreen`) only credits *first*-attempt correct answers, so it
keeps measuring actual recall rather than collapsing to 100% once retries
guarantee everything gets answered right eventually. Also changed
`getOptionStatus`/`FeedbackBar` so a wrong answer only flags the learner's
(incorrect) pick — the correct option/form is no longer revealed — while a
right answer still highlights the chosen option in green as before.

**Why:** Asked for explicitly: don't show the right answer on a miss, let the
learner move on, and bring the missed item back until they get it right
unaided. Hiding the answer only matters if the question can come back, so the
two changes are coupled. Pushing to the back of the queue (rather than e.g.
reinserting a few slots ahead) is the simplest "queue" semantics that still
guarantees some spacing before a retry in lessons with more than one question.

## 2026-06-07 — End-of-lesson encouragement screen keyed off `computeStars` bands

**Decision:** Added `LessonResultsScreen`, shown when `MultipleChoiceScreen`
finishes its last question (via local `finished` state) instead of calling
`onComplete` immediately. Added `getEncouragement(correctCount, total)` to
`lessonLogic.js`, returning `{ icon, headline, message }` selected by the
*same* star band as `computeStars` (3/2/1/0 stars → Bikain!/Oso ondo!/Ondo!/Ez
etsi!, with matching emoji and tone — celebratory for a perfect run, gentle
encouragement to retry for a poor one).

**Why:** Reusing `computeStars`' bands keeps the message, the star rating
shown on the same screen, and the `Stars` badges elsewhere in the app all
telling the same story — no separate thresholds to keep in sync. Kept the
"finished" flag as local component state rather than adding a state to
`exerciseReducer` since it's purely a screen-transition concern, not part of
the scored exercise; `onComplete` (and thus `recordResult`/progress
persistence) still only fires once the learner dismisses the results screen.

## 2026-06-07 — Use `dvh` instead of `vh`/`screen` for full-height screens

**Decision:** Switched `HomeScreen` and `MultipleChoiceScreen` from
`min-h-screen` (`100vh`) to `min-h-dvh`/`h-dvh`. Also restructured
`MultipleChoiceScreen` so the question/options area scrolls internally
(`overflow-y-auto` + `min-h-0` on the flex item) inside a fixed `h-dvh`
container, keeping the close button, progress bar, and `FeedbackBar`
(with its Continue/Finish button) always pinned within the visible area.

**Why:** On mobile browsers, `100vh` reflects the viewport height with the
browser chrome (address bar, gesture nav) hidden — which is taller than
what's actually visible when that chrome is shown. That made the bottom of
`MultipleChoiceScreen` (crucially, the Continue/Finish button) render below
the visible fold, looking cut off with no obvious way to reach it. `dvh`
units track the *current* visible viewport, and the internal-scroll layout
guarantees the action button stays reachable regardless of content height
or browser-chrome state.

## 2026-06-07 — Deploy to GitHub Pages via Actions, with hardcoded `base`

**Decision:** Set `base: '/testapp005/'` in `vite.config.js` and added
`.github/workflows/deploy.yml`, which builds on push to `main` and publishes
`dist/` using the official `actions/upload-pages-artifact` +
`actions/deploy-pages` flow (requires the repo's Pages source to be set to
"GitHub Actions" once in Settings → Pages).

**Why:** GitHub Pages serves project sites from `https://<owner>.github.io/<repo>/`,
so asset URLs need the repo-name prefix — Vite's `base` handles rewriting both
the build output and dev-time references. Hardcoded the repo name rather than
deriving it (e.g. from `process.env.GITHUB_REPOSITORY`) since this app isn't
expected to be renamed or forked under a different name; if that changes,
update `base` to match.

## 2026-06-07 — Extracted pure lesson logic into `src/lessonLogic.js`

**Decision:** Moved `computeStars`, `recordResult`, `getUnlockedLessonIds`,
`shuffle`, `generateQuestions`, and `exerciseReducer` out of `App.jsx` into a
new `src/lessonLogic.js` module.

**Why:** Wanted to unit-test these pure functions directly, but exporting
non-component functions from `App.jsx` trips the
`react-refresh/only-export-components` ESLint rule (it breaks Fast Refresh).
Splitting them out also keeps `App.jsx` focused on components/screens and
makes the logic easier to reason about and test in isolation as the app grows.

## 2026-06-07 — Added unit/component tests (Vitest + RTL), held off on e2e

**Decision:** Set up Vitest + React Testing Library for unit and component
tests (`src/logic.test.js`, `src/App.test.jsx`). Did not add an end-to-end
suite (e.g. Playwright) yet.

**Why:** The riskiest logic — scoring, lesson unlocking, progress persistence,
question generation, the exercise state machine — is pure and cheap to unit
test directly. E2e tests are the slowest and most maintenance-heavy layer of
the testing pyramid; worth adding once the app grows more complex multi-screen
flows that are worth protecting end-to-end (e.g. once periphrastic verbs,
dialect variants, or more navigation land). Playwright + a working Chromium
are already available in the dev container if/when we revisit this.

## 2026-06-07 — Added CI (GitHub Actions: lint, test, build)

**Decision:** `.github/workflows/ci.yml` runs `npm run lint`, `npm test`, and
`npm run build` on every push and pull request.

**Why:** An automated gate is what actually *prevents* regressions from
landing — relying on remembering to run checks locally doesn't scale as the
app evolves and more changes land via agents.

## 2026-06-07 — SessionStart hook installs deps synchronously

**Decision:** `.claude/hooks/session-start.sh` runs `npm install`
synchronously (not in async mode) on Claude Code web sessions, gated on
`$CLAUDE_CODE_REMOTE`.

**Why:** Guarantees dependencies are installed before the agent starts
working, avoiding race conditions where it might try to lint/test/run before
`node_modules` exists. Tradeoff: session start is gated on `npm install`
completing. Can switch to async mode later if startup latency becomes
annoying — see the `session-start-hook` skill.
