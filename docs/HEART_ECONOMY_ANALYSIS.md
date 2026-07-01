# Heart (Lives) & Point Economy — spec analysis and implementation plan

**Status: analysis/proposal only — nothing in this document is implemented.** A
"Player State, Economy, and Heart System" spec was submitted for review. This
doc is the requested response: edge-case analysis, an architecture
recommendation grounded in what this repo actually is, and a step-by-step plan
for the passive-regeneration function. No hearts mechanic exists in the
codebase today (`git grep -i heart` in `src/` returns nothing) — see "Open
questions" at the end before anyone starts building this.

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
   `docs/LEARNING_JOURNEY_PROPOSED.md` design principle 4. The spec's
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

## Open questions (product decisions needed before implementation)

1. **How does heart-lockout compose with the existing linear-unlock +
   gate-score model** (`getUnlockedLessonIds`, `lessonLogic.js:341-`)? Does
   depletion override it (block *everything* not yet completed, even lessons
   the linear model would otherwise unlock), or only prevent starting new
   lessons while leaving the unlock computation itself untouched?
2. **Reconcile `POINTS_PER_REVIEW` with the existing `LESSON_POINTS_REPEAT`**
   reward (mismatch #1 above) — one rule, not two.
3. Is a hearts/lives mechanic even wanted for this app? It's a solo,
   untimed, no-ads language-learning tool today with no monetization
   surface — worth confirming the product goal (retention pressure? paid
   heart refills later?) before building the lockout UX, since it's a
   meaningful behavior change to the core loop, not just an economy tweak.

The Phase 2 "practice to earn" idea (spec §5) composes cleanly with the plan
above — it's just a fourth path into `currentHearts` (`+1`, bypassing points
entirely) alongside regen/purchase, so nothing here needs to change shape to
accommodate it later.
