# Heart (Lives) & Point Economy — spec analysis and implementation plan

**Status: partially implemented.** A "Player State, Economy, and Heart System" spec was submitted for review. This doc is the requested response: edge-case analysis, architecture recommendation, and step-by-step implementation plan. The hearts mechanic described here **is now implemented** — `heartsStorage` (`src/storage.js`), `deductHeart`/`applyHeartRegen`/`buyHeart` (`src/lessonLogic.js`). The "Open questions" at the end were not formally resolved; check the decisions logs for what was settled in practice.

## How the incoming spec maps onto this codebase

The spec assumes a system with no existing economy. That's not quite this
repo: `pointsStorage`/`computeLessonPoints`/`addPoints`/`getPointsBalance`
(`src/storage.js`, `src/lessonLogic.js:136-217`) already implement a
Duolingo-gems-style point economy, spent today on one thing
(`repairStreak`, `STREAK_REPAIR_COST = 100`). Three concrete mismatches to
resolve before implementation, not silently pick a side on:

1. **`POINTS_PER_REVIEW = 20` collides with the existing repeat-lesson
   reward.** `computeLessonPoints` (`lessonLogic.js:150-157`) already pays out
   for a repeat attempt — `LESSON_POINTS_REPEAT = 5`, half of the
   first-attempt `10`, scaled by accuracy. The spec's flat `20` for
   "completing a lesson whose unit is in `completedUnits`" is a different
   number *and* a different trigger (flat award vs. accuracy-scaled). These
   need to be reconciled into one rule, not run as two parallel reward paths.
2. **"Unit ID" vs. "lesson ID."** The spec's `completedUnits: string[]` reads
   as this codebase's per-lesson `progress` map keys (`storage.js`'s
   `progressStorage`, keyed by `lessonId`), *not* `journey.js`'s `JOURNEY`
   units (a unit is a curriculum grouping that owns one or more
   `lessonIds`). Whoever implements this should use `lessonId`, matching
   existing terminology, and rename the field accordingly (`completedLessons`)
   to avoid a false-friend collision with `journey.js`'s unit concept.
3. **No lockout dimension exists in the unlock model at all today.**
   `getUnlockedLessonIds` (`lessonLogic.js:341-`) is a strictly-linear
   unlock ("previous lesson attempted") plus a soft gate-score wall
   (`GATE_PASS_STARS`) plus opt-in bonus content — see
   `docs/academic/LEARNING_JOURNEY_PROPOSED.md` design principle 4. The spec's
   lockout rule ("if `currentHearts === 0`, block anything not in
   `completedUnits`") is an orthogonal *third* axis that would need to compose
   with both existing ones. That composition isn't specified and shouldn't be
   improvised — see "Open questions."

## Part 1 — Edge cases, desync, and clock-manipulation exploits

**The blunt fact driving most of this: there is no server authority over game
state in this app.** `sync-worker/` (Cloudflare D1) is dumb storage —
`progress_snapshots.payload_json` is an opaque JSON blob
(`sync-worker/migrations/0001_init.sql:39`); the worker never inspects or
validates it (`sync-worker/src/db.js:58-73` is a plain get/upsert). All merge
logic (`mergeSyncPayload`, `lessonLogic.js:301-308`) runs client-side, and the
merged result is whatever gets PUT back. A user can already open devtools and
overwrite `localStorage['aditzak:points:v2']` to grant themselves unlimited
points, or `aditzak:progress:v1` to mark every lesson complete — that's true
today, before hearts exist. Any anti-cheat discussion has to start from that
baseline: **hearts would not be meaningfully more or less exploitable than
what's already trusted client-side**, and this is a free single-player
language app, not a monetized or competitive one. Recommend treating
"a determined user can edit their own localStorage" as explicitly out of
scope (an accepted limitation, documented — not silently assumed), same trust
model the points/streak system already runs on.

That said, the specific mechanisms are worth being precise about:

- **System clock set forward.** Directly fast-forwards
  `now - lastHeartChangeTimestamp`, granting free heart regen. Cheap, no
  devtools needed. Given the "not meaningfully worse than editing
  localStorage directly" framing above, not worth defending against — but
  worth *not making worse*: don't use the client clock as an implicit trust
  anchor for anything higher-stakes than heart regen (e.g. don't later gate a
  leaderboard or streak-freeze purchase on the same unvalidated timestamp
  without revisiting this).
- **System clock set backward / into the past.** `now - lastHeartChangeTimestamp`
  goes negative. Must floor `heartsToAdd` at 0 — a naive
  `Math.floor(elapsed / HEART_REGEN_TIME_MS)` on negative `elapsed` rounds
  *toward negative infinity* in JS-adjacent pseudocode but here `Math.floor`
  of a negative number is still negative, which would need an explicit
  `Math.max(0, …)` guard, not an assumption that "hearts < MAX" already
  prevents it.
- **Multi-device double-spend (the one exploit that's actually specific to
  hearts, not shared with points).** Points/attempts/streak-length are all
  either monotonic (`addPoints` only grows a device's own counter,
  `mergePoints` takes a per-device max — see the comment at
  `lessonLogic.js:282-295`) or explicitly "recency wins, don't resurrect"
  (`mergeDailyStreak`, `lessonLogic.js:247-261`). `currentHearts` is neither:
  it's a *shared bounded resource* that both increases (regen, purchase) and
  decreases (wrong answers) on each device independently. A recency-wins
  merge (mirroring `mergeDailyStreak`) is deterministic but doesn't stop a
  user from depleting hearts on device A, then playing on device B (which
  never synced the depletion and still reads 5 hearts), getting genuinely
  extra attempts out of the desync before the next sync reconciles down to
  whichever side is "most recent." This is a real gap, but the payoff is
  "a few extra practice attempts," not points or progress — recommend
  documenting it as an accepted limitation of the same class as the
  clock-forward case, rather than building sync-time server validation
  (which `sync-worker` doesn't do for anything else) just for this.
- **Stale timestamp at full hearts.** If `currentHearts` reaches `MAX_HEARTS`
  by some path that doesn't clear `lastHeartChangeTimestamp`, a later regen
  calculation must still treat "already full" as "nothing to add" regardless
  of what the timestamp says — guard on `currentHearts >= MAX_HEARTS` first,
  don't trust the timestamp's presence/absence alone.
- **Cross-tab race.** Two tabs of the same device each load `hearts` once,
  compute regen, and later write back independently — classic
  read-modify-write clobber, last tab to save wins. This is not new
  (`points`/`progress` have the identical race today and the app doesn't
  defend against it), so treat it the same way: acceptable, not a new
  regression introduced by hearts. If it matters later, the fix is to make
  hearts a derived value recomputed at read-time (see Part 2) rather than a
  mutate-in-place field, which sidesteps the race by never trusting a stale
  in-memory copy in the first place.
- **Backgrounded PWA / mobile tab never regaining focus.** The spec's "recompute
  on launch or focus" trigger set can leave a user visibly stuck at 0 hearts
  if their tab is merely idle (not backgrounded) for hours — recommend
  computing regen at every *read* of hearts (see below) rather than only at
  two specific lifecycle events, so "how many hearts do I have" is always
  answered fresh no matter when it's asked.

## Part 2 — Architecture recommendation

This is a client-only React/Vite SPA. `localStorage` is the only state store
today (`src/storage.js`); the one server component (`sync-worker/`, Cloudflare
Workers + D1) exists solely for magic-link auth and opaque cross-device
snapshot sync, not game logic. There is no case for introducing a real
database here just for hearts — that would be a new architecture tier
(server-authoritative game state) the rest of the app doesn't have, for a
feature whose worst-case exploit (Part 1) is "a few extra practice
attempts" on a free app. Recommendation: **extend the existing pattern
exactly**, no new backend:

- A fourth standalone `localStorage` key, `aditzak:hearts:v1`, with its own
  `heartsStorage.load/save` in `storage.js` (mirrors `pointsStorage`/
  `streakStorage`/`errorStorage` — see the "orthogonal keys" note at
  `storage.js:23-28`). Shape: `{ currentHearts, lastHeartChangeTimestamp }`.
- Pure transition functions live in `lessonLogic.js` next to
  `computeLessonPoints`/`addPoints`/`repairStreak` — see Part 3.
- Cross-device sync piggybacks on the existing opaque-blob mechanism: add
  `hearts` as a fourth field to the payload `mergeSyncPayload` builds
  (`lessonLogic.js:301-308`) and to whatever `App.jsx` pushes/pulls via
  `api.js`. **No `sync-worker` migration or backend change needed** —
  `payload_json` is `TEXT`, schema-free from the worker's point of view.
- Treat hearts as a **derived value, not a stored mutable field**, at the
  point of use: don't trust `heartsStorage.load()`'s raw `currentHearts`
  directly — always run it through the regen function with `Date.now()`
  first, the same way `getActiveStreak`/`getPointsBalance` derive a
  "current" answer from stored raw counters rather than storing the derived
  answer itself (`lessonLogic.js:129-134`, `214-217`). This is what makes the
  "recompute on every read, not just launch/focus" fix from Part 1 fall out
  for free, and it's already this codebase's convention.

## Part 3 — Step-by-step plan for the passive-regen function

Pure function, colocated with the other economy logic in `lessonLogic.js`:

1. **Constants**, next to `STREAK_REPAIR_COST` (`lessonLogic.js:147-148`):
   `MAX_HEARTS = 5`, `HEART_REGEN_TIME_MS = 4 * 60 * 60 * 1000`,
   `HEART_COST_POINTS = 50`.
2. **`applyHeartRegen(hearts, now = Date.now())`** — the catch-up formula,
   pure and total:
   ```js
   export function applyHeartRegen(hearts, now = Date.now()) {
     const currentHearts = hearts?.currentHearts ?? MAX_HEARTS
     if (currentHearts >= MAX_HEARTS) return { currentHearts: MAX_HEARTS, lastHeartChangeTimestamp: null }
     const elapsed = Math.max(0, now - (hearts?.lastHeartChangeTimestamp ?? now))
     const heartsToAdd = Math.floor(elapsed / HEART_REGEN_TIME_MS)
     if (heartsToAdd <= 0) return { currentHearts, lastHeartChangeTimestamp: hearts?.lastHeartChangeTimestamp ?? null }
     const newHearts = Math.min(MAX_HEARTS, currentHearts + heartsToAdd)
     const lastHeartChangeTimestamp =
       newHearts === MAX_HEARTS ? null : hearts.lastHeartChangeTimestamp + heartsToAdd * HEART_REGEN_TIME_MS
     return { currentHearts: newHearts, lastHeartChangeTimestamp }
   }
   ```
   The `Math.max(0, …)` on `elapsed` is the backward-clock guard from Part 1;
   the `currentHearts >= MAX_HEARTS` early return is the stale-timestamp
   guard, checked before touching the timestamp at all.
3. **`deductHeart(hearts, now = Date.now())`** — applies regen first (so a
   deduction right after reopening the app is computed against fresh state),
   then decrements if `currentHearts > 0`, starting the regen clock only on
   the MAX → MAX-1 transition (matches spec §4.A):
   ```js
   export function deductHeart(hearts, now = Date.now()) {
     const regenerated = applyHeartRegen(hearts, now)
     if (regenerated.currentHearts <= 0) return regenerated
     const wasFull = regenerated.currentHearts === MAX_HEARTS
     return {
       currentHearts: regenerated.currentHearts - 1,
       lastHeartChangeTimestamp: wasFull ? now : regenerated.lastHeartChangeTimestamp,
     }
   }
   ```
4. **`canBuyHeart(hearts, points, now = Date.now())`** /
   **`buyHeart(hearts, points, deviceId, now = Date.now())`** — regen first,
   then gate on `currentHearts < MAX_HEARTS && getPointsBalance(points) >=
   HEART_COST_POINTS`; spending records as a `spent[deviceId]` increment via
   the same shape `addPoints`/`repairStreak` already use, so it merges for
   free through the existing `mergePoints`.
5. **`isLockedOut(hearts, lessonId, progress, now = Date.now())`** —
   `applyHeartRegen(...).currentHearts === 0 && !((progress[lessonId]?.attempts ?? 0) > 0)`,
   the read-side helper `HomeScreen`/`ExerciseScreen` would call per lesson
   card. (Composition with `getUnlockedLessonIds`'s existing linear/gate logic
   is the open question below — this only covers the heart half.)
6. **`mergeHearts(local, cloud)`** — recency-of-touch wins, same shape as
   `mergeDailyStreak`: whichever side has the more recent
   `lastHeartChangeTimestamp` (treating `null` — i.e. "full" — as "just
   regenerated," so a genuinely full side beats a stale partial one) wins
   wholesale. Folds into `mergeSyncPayload` as a fifth field.
7. **Wiring** (once the open questions below are resolved): `App.jsx` gets a
   `hearts` state slot loaded via `heartsStorage.load()` and immediately
   passed through `applyHeartRegen(_, Date.now())`, mirroring the existing
   `points`/`dailyStreak` load-then-effect-save pattern at `App.jsx:86-151`;
   recompute again on `document.visibilitychange`. `ExerciseScreen`'s wrong-
   answer path (the `answer` action in `exerciseReducer`) calls
   `setHearts(deductHeart)`. A new `HeartsBadge` in `components/badges.jsx`
   (same lookup-table-driven style as `Stars`/`ProgressBar`) displays the
   count plus a "buy for 50" affordance on `ProfileTab`.
8. **Tests**: a `hearts` block in `src/logic.test.js` covering regen math
   (zero-elapsed, partial, multi-heart catch-up, backward-clock, already-full
   stale-timestamp), `deductHeart` at each starting count, `buyHeart`
   gating, and `mergeHearts`.

## Resolved (2026-07-01)

The three open questions above are now settled:

1. **Lockout composition:** at `currentHearts === 0`, availability is the
   *intersection* of the existing unlock model and completion — i.e. only
   lessons with at least one recorded attempt (`progress[lessonId].attempts >
   0`) stay playable; everything else `getUnlockedLessonIds` would otherwise
   unlock (locked *or* already-unlocked-but-never-attempted) becomes
   unavailable until hearts recover. This is a depletion-only restriction
   layered on top of `getUnlockedLessonIds`'s result, not a change to that
   function's own logic — `isLockedOut`'s definition in Part 3 step 5 already
   matches this ("no attempts recorded" is exactly "not completed" here).
2. **New requirement not in the original spec: mid-lesson cancellation.** If
   `currentHearts` hits 0 *during* an unfinished, never-completed-before
   lesson (i.e. this is a fresh attempt, not a replay of an already-completed
   one), the exercise must be cancelled — the learner is bounced back to
   `HomeScreen` — unless they buy a heart immediately to continue. This needs
   a spend-check inside `ExerciseScreen`'s wrong-answer path itself (right
   after `deductHeart`, not just at lesson-selection time), plus a small UI
   moment offering "buy a heart to continue" before the forced exit. Replaying
   an already-completed lesson is unaffected by this (per point 1, completed
   lessons stay playable regardless of heart count) — the copy needs to be
   careful to only cancel *new* attempts.
3. **Points:** keep the existing scaled-down repeat reward
   (`LESSON_POINTS_REPEAT = 5` < `LESSON_POINTS_FIRST_ATTEMPT = 10`,
   `lessonLogic.js:144-145`); drop the spec's flat `POINTS_PER_REVIEW = 20`
   entirely rather than reconciling it — the constraint is just "repeat <
   new," already satisfied, exact numbers to be tuned later.
4. **Motivation confirmed**, and the Phase 2 idea is now more specific than
   the original spec's §5: dedicated "recover a life" lessons built from
   already-studied material (forcing spaced review), not just an
   error-log-driven session. Still composes cleanly with the plan above — a
   fourth path into `currentHearts` (`+1`, bypassing points), same as before.

## Consequence for Part 3: one more piece to design

Step 5's `isLockedOut` (lesson-list gating) is unchanged by the above. But
mid-lesson cancellation needs its own piece, not yet speced in Part 3:

- `ExerciseScreen`'s `exerciseReducer` needs the post-`deductHeart` hearts
  value available to its `answer` action (or a `useEffect` watching `hearts`
  after each wrong answer) so it can distinguish "still have hearts, continue
  as normal" from "just hit 0 on a fresh attempt, must stop."
- Whether "fresh attempt" is `!(progress[lessonId]?.attempts > 0)` evaluated
  once at lesson start, or needs to also cover the case where the *lesson in
  progress* was already-completed before (replay) — in which case hitting 0
  hearts mid-replay should **not** cancel it, per point 2 above. The reducer
  needs this fact passed in at mount, not re-derived per question.
- The cancellation UI is a new state, not one of the existing
  `exerciseReducer` statuses (`answer`/`next`) — likely a modal/interstitial
  offering "buy a heart to continue" (calls `buyHeart`, then resumes at the
  same question) vs. "exit" (discards the in-progress attempt, no partial
  `recordResult` — cancelled attempts shouldn't count as a scored attempt,
  otherwise cancelling would perversely unlock the next lesson under the
  existing linear model). This needs a small new component, not an extension
  of `LessonResultsScreen` (that screen assumes a *finished* run).
