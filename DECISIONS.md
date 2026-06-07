# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

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
