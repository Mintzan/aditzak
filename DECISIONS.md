# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

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
