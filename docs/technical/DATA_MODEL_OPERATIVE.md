# Aditzak — Operative Data Model

This document explains the **operative** half of the app's data model: the
data the app produces and manages while a learner uses it — the runtime
question objects an exercise runs on, the learner state persisted in
`localStorage` (progress, streak, points, error stats, hearts), and the
optional cloud-sync snapshot of that state.

The **academic** half — the hand-written curriculum data (`VERBS`, `LESSONS`,
`JOURNEY`, `READING_ITEMS`) — is documented separately in
`docs/academic/DATA_MODEL_ACADEMIC.md`.

This is a map, not a spec — the authoritative shape documentation lives as
comments next to the code (`src/storage.js`, `src/lessonLogic.js`,
`src/api.js`), and this doc points into them.

```mermaid
flowchart LR
  CURRICULUM(["Curriculum data<br/>(see DATA_MODEL_ACADEMIC.md)"])

  subgraph Runtime [Runtime, not persisted]
    QUESTIONS["Question objects<br/>(generateQuestions, lessonLogic.js)"]
    STATE["Exercise state<br/>(exerciseReducer)"]
  end

  subgraph Persisted [localStorage (storage.js)]
    MAPS["progress · streak · points<br/>errorStats · hearts"]
  end

  SYNC["Cloud sync snapshot<br/>(Cloudflare Worker, api.js)"]

  CURRICULUM --> QUESTIONS
  QUESTIONS --> STATE
  STATE -- "lesson results / first-attempt misses" --> MAPS
  MAPS <-- "merge on sign-in,<br/>debounced PUT /sync" --> SYNC
```

---

## 1. Runtime question objects (not persisted)

`generateQuestions` (`src/lessonLogic.js`) and its siblings
(`generateCrossVerbQuestions`, `generateCaseMixerQuestions`,
`generateMatchPairsQuestions`, `generateSuffixChoiceQuestions`,
`generateReadingQuestions`) produce the in-memory question list an exercise
runs on. Every question carries its provenance — `verbId`, `tense`,
`fixedArgument`, `person` — plus a `kind` and kind-specific fields:

- Multiple-choice kinds (`form`, `sentence`, `negative`, `pronoun`,
  `verb-choice`, `case-mixer`, `suffix-choice`, `reading`, `spot-error`,
  `word-order`, `match-pairs`): `correct`, `options` (distractors drawn from
  the same conjugation table, `validFor`-gated sibling-verb borrows, and
  targeted error-type "lures"), and often `optionRationale` (maps each lure
  option to an `errorType` like `case-frame`/`tense`/`object-number`, used for
  the post-answer explanation).
- Typed kinds (`type-verb`, `type-pronoun`, `type-negative`): `sentence` +
  `correct` only; the learner types the answer.

Exercise state itself (`exerciseReducer`: `index`, `selected`, `status`,
`correctCount`, first-attempt `misses`) is transient `useReducer` state in
`ExerciseScreen`; only its end-of-lesson summary is persisted, via the stores
below.

---

## 2. Persisted learner state — `localStorage` (`src/storage.js`)

Each concern lives under its **own versioned key**, so shapes can evolve
independently. Reads default to `{}` (or `null` for the session) when missing
or unparsable, and writes silently no-op if `localStorage` is unavailable.

**Versioning rule:** if you change the shape stored under a key, bump that
key's version suffix (`v1` → `v2`) so old data is orphaned instead of crashing
the loader — and provide a migration if the data is worth keeping (see
`pointsStorage`'s v1 → v2 migration).

| Key | Shape | Written by |
|---|---|---|
| `aditzak:progress:v1` | `{ [lessonId]: { attempts, bestScore, totalQuestions, bestStars, lastPlayed } }` — `bestStars` is 0–3 from `computeStars` (≥100% → 3, ≥80% → 2, ≥50% → 1); `lastPlayed` ISO timestamp. Also drives lesson unlocking. | `recordResult` |
| `aditzak:streak:v1` | `{ currentStreak, longestStreak, lastActiveDate }` — `lastActiveDate` is a local-timezone `'YYYY-MM-DD'` string (`getLocalDateString`). Same-day repeat is a no-op; next-day extends; a bigger gap restarts at 1. Streak repair backdates `lastActiveDate` to yesterday. | `recordDailyStreak`, `repairStreak` |
| `aditzak:points:v2` | A **PN-Counter**: `{ earned: { [deviceId]: n }, spent: { [deviceId]: n } }`. Each device only increments its own entries, which is what makes cross-device merging lossless and order-independent. Balance = Σ earned − Σ spent (`getPointsBalance`). Migrates a legacy `v1` `{ balance }` into this device's `earned`. | `addPoints`, `repairStreak`, `buyHeart` |
| `aditzak:errors:v1` | `{ ['verbId:tense:person']: { verbId, tense, person, count, lastMissed } }` — first-attempt misses, accumulated per form. Feeds weak-spot review questions (`getWeakSpotQuestions`) and the in-lesson "error-prone pattern" callout. | `recordErrors` |
| `aditzak:hearts:v1` | `{ currentHearts, lastHeartChangeTimestamp }` — the empty object means "full hearts, nothing pending" (`MAX_HEARTS = 5`); regen is computed lazily from the timestamp (`applyHeartRegen`, 4 h/heart), hearts are deducted on wrong answers and purchasable with points. See `docs/technical/HEART_ECONOMY_ANALYSIS.md`. | `deductHeart`, `applyHeartRegen`, `buyHeart` |
| `aditzak:deviceId:v1` | A random UUID generated once per device — the namespace for this device's PN-Counter entries. | `getDeviceId` |
| `aditzak:session:v1` | `{ token, email, expiresAt }` — the signed-in sync session (bearer token from `/auth/verify`). Unlike the maps, missing/invalid/expired reads as `null`, never `{}`. Expiry is computed locally from `SESSION_TTL_MS` (60 days, mirroring the worker). | `accountSessionStorage` |

---

## 3. Cloud sync (`src/api.js` + merge functions in `src/lessonLogic.js`)

Signed-in learners sync the five state maps to a Cloudflare Worker
(`docs/technical/CLOUDFLARE_SYNC_WORKER.md`; the feedback endpoint in the same file is a
separate, stateless worker — `docs/technical/CLOUDFLARE_FEEDBACK_WORKER.md`).

- **Snapshot shape** (`buildSyncPayload`): `{ progress, dailyStreak, points,
  errorStats, hearts }` — exactly the local shapes, stored opaquely by the
  worker alongside a client-owned `schemaVersion` (`SYNC_SCHEMA_VERSION = 1`;
  the backend never validates it — reconciling versions is the frontend's
  job).
- **Push**: the five saves a single lesson completion triggers are debounced
  (`SYNC_PUSH_DEBOUNCE_MS`) into one `PUT /sync`.
- **Pull/merge**: on sign-in, the cloud snapshot is merged with local state via
  per-map merge functions designed to be lossless under concurrent edits from
  multiple devices (`mergeSyncPayload` composing `mergeProgress` — per-lesson
  max of attempts/bests, `mergeDailyStreak`, `mergeErrorStats` — per-key max
  count / latest miss, `mergePoints` — per-device max of each PN-Counter
  entry, `mergeHearts`). The points PN-Counter is the reason spends/earns
  never conflict across devices.

---

## 4. Where the boundaries are

- **Every persisted shape is versioned by key**, and every shape stored in the
  cloud is exactly a local shape — the sync layer adds no schema of its own.
- **Runtime question shapes never persist** — only the end-of-lesson summary
  (result counts, first-attempt misses) crosses into the `localStorage` maps.
- **A device only ever writes its own PN-Counter entries** — the invariant
  that keeps points merging lossless.

Related reading: `docs/academic/DATA_MODEL_ACADEMIC.md` (the academic half of the data
model), `docs/technical/EXERCISE_ENGINE.md`, `docs/academic/DISTRACTOR_STRATEGY.md`,
`docs/technical/HEART_ECONOMY_ANALYSIS.md`, `docs/technical/CLOUDFLARE_SYNC_WORKER.md`,
`docs/technical/CLOUDFLARE_FEEDBACK_WORKER.md`.
