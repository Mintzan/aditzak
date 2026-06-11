# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Aditzak** — a Duolingo-style web app for practicing Basque (Euskara) verb conjugation. Built with React 19, Vite, and Tailwind CSS 4.

## Decisions log

`docs/DECISIONS.md` records notable decisions made during development along with the reasoning behind them (e.g. why logic was split into `lessonLogic.js`, why we have unit tests but not e2e yet). **Read it before making related changes** — it exists so settled questions don't get relitigated without context. **When you make a notable decision** (a non-obvious architectural choice, a tradeoff, something that could plausibly be questioned or reversed later), **add an entry to it** — keep entries short: what was decided and why, dated, newest on top.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint over the project

There is no test suite configured yet.

## Architecture

Most of the app lives in `src/App.jsx`, organized top-to-bottom into clearly delimited sections (look for the `===` banner comments). The curriculum roadmap lives separately in `src/journey.js` (see point 2).

1. **Verb data (`VERBS`)** — the source-of-truth data model. Each verb has:
   - `type`: `synthetic` ("aditz trinkoa", conjugated directly) vs `periphrastic` ("aditz perifrastikoa", participle + auxiliary — not yet present in the data but accounted for in the type system/badges)
   - `agreement`: which arguments the finite form marks (`nor` = absolutive, `nori` = dative, `nork` = ergative — the NOR-NORI-NORK system)
   - `dialect`: currently always `batua`; placeholder for future dialect variants (e.g. a verb could carry `dialectVariants: { bizkaiera: { conjugations: {...} } }` overrides)
   - `conjugations`: nested by tense → grammatical person (`ni`, `hi`, `hura`, `gu`, `zuek`, `haiek`) → conjugated form

2. **Curriculum roadmap (`src/journey.js`'s `JOURNEY`) and lessons (`LESSONS`)** — `JOURNEY` mirrors `docs/LEARNING_JOURNEY.md`'s phases → stages → units; each unit is either `available` (carries `lessonIds` pointing into `LESSONS`) or `pending` (rendered as a locked "coming soon" roadmap card from its `title`/`focus`/payload alone, so the full curriculum is visible from day one). `gate: true` marks the Refresh Gate units. `LESSONS` itself is a small, hand-written, ordered list of currently-playable lessons — `{ id, verbId, tense }` for a practice lesson, or `{ id, review: true, sources: [{ verbId, tense }, …] }` for a review — written to follow the journey's unit sequence rather than derived automatically, since units don't map cleanly onto "every tense of every verb" (a unit can introduce two verbs at once, or reuse an earlier verb's table under a different gloss). When a unit moves from `pending` to `available`, add its lessons to `LESSONS`, flip its `status` in `journey.js`, and set its `lessonIds`. `describeLesson` centralises the practice-vs-review display copy (`LessonNode`/`ProgressTab`/`LessonResultsScreen` all use it).

3. **Progress persistence** — stored in `localStorage` under `STORAGE_KEY = 'aditzak:progress:v1'` as a map of `lessonId → { attempts, bestScore, totalQuestions, bestStars, lastPlayed }`. `recordResult` merges a finished exercise's result into this map; `computeStars` derives a 0–3 star rating from the score ratio (≥100% → 3, ≥80% → 2, ≥50% → 1). **Bump the storage key version suffix (`v1` → `v2`) if you change the shape of stored progress**, so old/incompatible data doesn't crash `loadProgress`.

4. **Lesson unlocking** — `getUnlockedLessonIds` implements a strictly linear progression: a lesson unlocks once the *previous* lesson (in `LESSONS` order) has at least one attempt recorded. The first lesson is always unlocked.

5. **Question generation** — `generateQuestions` builds one multiple-choice question per grammatical person in a lesson's conjugation table; the three distractor options are the *other* conjugated forms from that same table (so every option is a plausible Basque verb form, not a random string).

6. **Screens / state machine** — `App` is a simple two-state shell: either `activeLessonId` is set (renders `MultipleChoiceScreen` for that lesson, keyed by lesson id so it remounts/resets between lessons) or it isn't (renders `HomeScreen`). `HomeScreen` itself switches between three tabs (`home`/`progress`/`profile`) via local `tab` state and `BottomNav`. The exercise flow within `MultipleChoiceScreen` is driven by `exerciseReducer` (a `useReducer` with `answer`/`next` actions tracking `index`, `selected`, `status`, `correctCount`).

7. **Shared presentational bits** — small badge/indicator components (`TypeBadge`, `AgreementBadge`, `DialectBadge`, `Stars`, `ProgressBar`) are driven by lookup-table metadata objects (`TYPE_META`, `AGREEMENT_META`, `TENSE_META`, `DIALECT_LABELS`, `PERSON_LABELS`) defined near the top of the file — extend those tables rather than hardcoding labels/styles inline.

Styling is Tailwind utility classes throughout (Tailwind 4 via the `@tailwindcss/vite` plugin — no separate `tailwind.config.js`). The layout targets a mobile-width column (`max-w-md`, mobile nav bar) rather than full desktop responsiveness.
