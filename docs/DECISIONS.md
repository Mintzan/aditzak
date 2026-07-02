# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

## 2026-07-02 — Round 5: audited the visual identity guide against the real components, closed every gap that surfaced

Previous rounds only checked the guide's internal consistency (contrast math,
palette drift, anatomy). This round read the actual UI code it's meant to be
applied to (`ExerciseScreen.jsx`, `HomeScreen.jsx`, `badges.jsx`,
`data/verbs.js`) and found the guide was missing roughly 10 distinct
Tailwind hues in active use, a button/card geometry that doesn't match
anything shipped, motion timings invented without reference to the real
(already-tuned) CSS, no font-loading step despite specifying two fonts, and
an unscoped icon system. Decided all of it rather than re-flagging:

- **Grammar-badge palette** (`TYPE_META`/`AGREEMENT_META` — 5 more hues:
  `indigo`/`rose`/`blue`/`purple`/`amber`): NOR/NORI/NORK now reuse the three
  brand colors instead of getting a fourth arbitrary hue set — ties the
  grammar-role system to the brand rather than adding to the palette. Verb
  type (synthetic/periphrastic) moves off color entirely onto a filled-vs-
  outlined value distinction, which also resolves a real collision: it had
  been sharing `rose` with `HeartsBadge` for an unrelated meaning.
- **`accent-hearts`**: formalized `rose` as hearts' own standalone token,
  closing the open question from the original gap analysis. Now that verb
  type is off `rose`, it has exactly one meaning in the app.
- **Streak/points/bonus/repair-card colors**: mapped onto `brand-clay`
  (streak), `brand-txakoli` (points/bonus — same "reward" association as
  stars), and `semantic-warning` (streak-repair — it's a "needs attention"
  prompt, the guide's warning token finally getting a real match).
- **Button/card geometry**: dropped the original "3px bottom-border-offset
  keycap" button spec — it doesn't exist anywhere in the app, which
  consistently uses a flat fill + `active:scale-[0.98]` press pattern across
  ~20 buttons already. Kept that pattern; buttons move to 12px radius, cards
  keep their existing 16px, badges stay `rounded-full`.
- **Motion timings**: the guide's numbers (0.98→1.03→1.0/200ms,
  ±6px/three-cycle/250ms) didn't match `index.css`'s shipped `animate-flash`
  (350ms, 1→1.04→1) or `animate-shake` (400ms, asymmetric 5-step wobble).
  Documented the real values as canonical for the existing answer-feedback
  micro-interactions; reserved the original invented numbers for a
  mascot-avatar-specific reaction only, since that's genuinely new motion
  with nothing to reconcile against. Also explicitly scoped the confetti/
  firework 3-star celebration's independent 7-color rainbow as deliberately
  outside the brand palette (a celebration should read as spectacle, not a
  branded moment) rather than a silent gap.
- **Fonts**: neither Space Grotesk nor Inter loads today — added the actual
  `<link>` tags as an implementation step, not left as a token-only mention.
- **Icon system**: ~15 emoji touchpoints app-wide stay emoji — no vector
  icon set was ever proposed to replace them, and the mascot's coverage
  stays scoped to exactly the two feedback-drawer avatars already decided.

**Still open, deliberately not decided here**: whether the mascot/animation
system gets built at all — that's a product-scope call, not something a
component audit can resolve, and every other mascot-adjacent question (icon
scope, motion, triggers) is now fully specified *conditional on* that yes/no.
Revised the "Recommended path" note to reflect real effort: the palette
consolidation and button-geometry change touch two screen files' worth of
working code, not just a token file — bounded and doable, but not the
"low-risk, incremental" framing the guide had before this round.

## 2026-07-02 — Fixed header overflow on narrow screens (hearts pill from #534 was clipped)

Real-device screenshot (a ~412 CSS px Android) showed the header's 4th pill
(hearts, added in #534) clipped off the right edge entirely, with only a
sliver of the heart icon visible. Root cause: adding a 4th pill to a row
that was already tight pushed it over, and the stars pill's `{total}/{max}`
suffix (e.g. `130/1104`) was by far the widest single element in the row.

Fix, in order of what actually bought back width: (1) dropped the `/{max}`
denominator from the header's stars pill specifically — it now shows the
bare current count, matching how the streak/points pills already read.
(2) Made all four header pills tap-through buttons (`onChangeTab`) to the
tab that still shows full context — stars → Progress, streak/points/hearts
→ Profile — so stripping the header doesn't actually lose the information,
just moves it one tap away. Added a `progressStarsSummary` line ("X of Y
stars earned") to the top of `ProgressTab`, since the aggregate total/max
had no other home in the app before this. (3) Tightened pill padding
(`px-3`→`px-2.5`) and internal icon-gap (`gap-1.5`→`gap-1`) uniformly across
all four, plus the pills' own row gap (`gap-2`→`gap-1.5`) — this is what
actually closed the remaining gap down to a 360px-wide viewport (verified
360/375/412px in the dev server via Playwright, all previously the
`?dev=unlock-all`-style clipping the reported screenshot showed).

`HeartsBadge` (`components/badges.jsx`) gained an optional `onClick` prop —
renders as a `<button>` (with a press affordance) when given, plain `<div>`
otherwise, so the Profile tab's own (non-clickable, already-the-destination)
usage is unaffected. Added a dedicated `totalStarsLabel` i18n key for the
header's aggregate aria-label — the existing `starsLabel` ("{count} of 3
stars") is per-lesson and would've read nonsensically applied to a
curriculum-wide total. Full suite (493 tests) + lint + build green; manually
verified in the dev server at 360/375/412px.

## 2026-07-02 — Reconciled a second mascot deliverable (expression library) against the accepted visual identity

A separately-delivered "Ardi Latxa Guide" (four mascot expressions: Pozik/happy,
Gora!/excited, Haserre/determined, Nekatuta/tired) turned out to be built on
the *pre-fix* round-1 palette (`#374151`/`#111827`/`#1F2937`/`#2D3748`/`#F9FAFB`/
`#E5E7EB`) — confirmed by diffing its hex values against the committed
`public/brand/latxa-logo.svg`, which shares only 2 of 11 colors with it. It also
carried anatomy (visible legs, a muzzle-shadow overlay, inner-ear shading) the
accepted logo had simplified away, and framed two of its four triggers around
missed-practice guilt ("appears if the user repeatedly ignores daily goals",
"used for... missed notifications... to prompt immediate practice") — directly
against §7's anti-guilt-trip voice principle.

Decided rather than just flagged: (1) recolored all three non-duplicate states
onto the canonical §3 scale and stripped the anatomy back to match §1A exactly,
so there's one mascot geometry, not two competing designs — added as
`public/brand/latxa-expression-{gora,haserre,nekatuta}.svg`; Pozik gets no
separate file since, corrected, it's identical to the existing logo. (2)
Formalized the previously-flagged stray `#E2E8F0` shadow color as
`neutral-200`, extending §3 to 6 steps, since a second independent deliverable
using it unprompted is a signal it's a real recurring need, not a one-off
mistake. (3) Rejected the "ignores daily goals" and "missed notifications"
triggers outright rather than reinterpreting them — kept only the legitimate
pedagogical halves (Haserre → in-lesson error-prone-pattern callout; Nekatuta →
Progress-tab low-accuracy indicator, using data `progressStorage` already
tracks), and left both unwired into any actual screen, consistent with the
standing "mascot system is a separate scope decision" note. Full reasoning and
the rejected-trigger table are in `docs/VISUAL_IDENTITY.md` §1C.

## 2026-07-02 — Wrote `docs/VISUAL_IDENTITY.md`: proposed redesign spec, not implemented

Recorded a commissioned visual identity guide (Latxa-sheep mascot, a
forest/clay/txakoli brand palette, a 5-step neutral scale, type/component/motion
specs) as a redesign proposal. Went through three review rounds first: round 1
caught a real WCAG failure (`brand-clay` originally `#DE6B48`, 3.33:1 against
white text — below the guide's own 4.5:1 mandate) and a four-way inconsistent
dark-neutral scale (`#374151`/`#111827`/`#1F2937`/`#2D3748` used
interchangeably); round 2 fixed both, but its "mathematically verified"
contrast decimals didn't match independent recomputation (always in the safe
direction, so no false passes, but the numbers were invented rather than
calculated); round 3 replaced the fabricated decimals with qualitative AA/AAA
bands. Verified by rendering the mascot/favicon SVGs and running an actual
WCAG contrast script rather than trusting the pasted numbers or eyeballing the
XML.

**Explicitly not decided yet**, flagged as open questions in the doc: (1)
whether Aditzak becomes a mascot/animation-driven app at all — the guide specs
per-feedback-state expressions and ear animation, which is a product-scope
decision, not a styling one; (2) how the shipped hearts-economy UI's `rose`
palette (issues #529-#535, merged same day) reconciles with the new tokens,
since the guide never considered it; (3) the grammar-category badge colors
(`TYPE_META`/`AGREEMENT_META`/`DIALECT_LABELS` in `data/verbs.js`) are out of
this guide's scope and need their own pass. No code changed to implement any
of this yet.

## 2026-07-01 — Resolved issue #535: cross-device sync for hearts (final core slice of the hearts epic)

Sixth and final core-buildout slice of the heart economy epic (#529) —
#530-534 (data model, `App.jsx` wiring, lockout UI, mid-lesson
cancellation, badge/purchase UI) are all merged; this closes the loop for
the optional account/sync feature. Added `mergeHearts(local, cloud)` to
`lessonLogic.js` (recency-of-`lastHeartChangeTimestamp` wins, `null`/full
treated as "just regenerated" so a genuinely full side always beats a stale
partial one — written and reasoned through originally while doing #530,
then deliberately deferred to this issue so #530 stayed data-model-only),
folded it into `mergeSyncPayload` as a fifth field, and threaded `hearts`
through every `App.jsx` sync branch that already touches
`progress`/`dailyStreak`/`points`/`errorStats`: the returning-signed-in-device
pull-merge, the fresh-device-via-magic-link wholesale-adopt, both
`MergeModal` choices (`useAccount`/`keepBest`), and the ongoing background
push's dependency array. `api.js`'s `buildSyncPayload` now includes `hearts`
too. No `sync-worker` change needed — `payload_json` is an opaque `TEXT`
blob.

**Verification note:** the acceptance criteria call for testing against the
real deployed `sync-worker`, but there's no live backend reachable from this
sandbox (no D1/wrangler-dev instance stood up, and the magic-link flow needs
a real emailed token). Substituted three checks that together cover the
same ground: (1) `mergeHearts`/`mergeSyncPayload` unit tests (recency-wins,
full-beats-stale-partial); (2) a dev-server run with Playwright route
interception on `*/sync` (GET returns a synthetic cloud snapshot, PUT
captured) confirming a returning signed-in device correctly merges and
re-pushes `hearts` end-to-end, with local's more-recent state legitimately
beating cloud's stale one per the documented policy; (3) the same technique
with `/auth/verify` also mocked, confirming a genuinely fresh device (no
local progress/streak) adopts the cloud's `hearts` wholesale via
`?authToken=`. Full suite (493 tests, including new `mergeHearts` cases and
an updated `mergeSyncPayload` test) + lint + build green.

This completes the hearts epic's core buildout (#530-535). #536 (Phase 2's
"recover a life" forced-review lessons) remains open, deliberately
underspecified until a follow-up design pass.

## 2026-07-01 — Resolved issue #534: hearts display badge + purchase UI

Fifth implementation slice of the heart economy epic (#529). New
`getHeartsRegenRemainingMs(hearts, now)` in `lessonLogic.js` — pure,
display-only ms-until-next-heart — backs a new `HeartsBadge`
(`components/badges.jsx`, alongside `Stars`/`ProgressBar`) that renders a
count pill plus, when `showCountdown` and below `MAX_HEARTS`, a "Next heart
in Xh Ym" line. The countdown ticks live via a plain `setInterval` local to
the component (60s cadence) that only calls `setState` on itself — it never
touches `hearts` or calls `applyHeartRegen`, so it doesn't reintroduce a
background regen timer (the actual mechanic stays exactly as lazy as
`docs/HEART_ECONOMY_ANALYSIS.md` specifies); it's purely cosmetic re-render
plumbing for a value that's already fully derived from props.

`HeartsBadge` is used two ways: compact (no countdown) as a fourth pill in
`HomeScreen`'s header, alongside the existing streak/stars/points pills; and
with `showCountdown` in a new dedicated "Hearts" card in `ProfileTab`
(matching the streak-repair card's shape), which also carries the "Buy a
heart — 50 points" button (`canBuyHeart`-gated, calls the same
`handleBuyHeart` from #533 — no new App.jsx logic needed, just new plumbing
to reach it from `ProfileTab` too). Rejected an earlier draft that put a
manual `{currentHearts}/{MAX_HEARTS}` text *and* the `HeartsBadge` pill in
the same profile card — redundant, dropped the manual text in favor of the
badge alone.

Manually verified in the dev server (Playwright): header pill shows 5/5 at
a fresh profile with no buy button in the profile card; seeding a partial,
regenerating state (2/5, 90 min into a 4h interval) shows "Next heart in 2h
30m" and an enabled buy button; buying immediately updates both the header
pill and the profile card (3/5, points spent) with no reload, and — matching
`buyHeart`'s tested behavior from #530 — leaves the countdown anchored to
the original regen timestamp (only cleared once a purchase reaches
`MAX_HEARTS`). New `getHeartsRegenRemainingMs` unit tests in `logic.test.js`.
Full suite (490 tests) + lint + build green.

## 2026-07-01 — Resolved issue #533: mid-lesson force-cancellation on depletion (ExerciseScreen)

Fourth implementation slice of the heart economy epic (#529) — the one
mechanic not in the original external spec (see the epic's product decision
#2). `ExerciseScreen` now takes `hearts`/`points`/`onBuyHeart` props and
derives `outOfHearts = isFreshAttempt && hearts?.currentHearts === 0` purely
from props each render — deliberately **no local state or effect**: `hearts`
already flows down fresh from `App.jsx` on every wrong answer (and on
regen/purchase), so the moment `currentHearts` moves off 0 the derived
boolean flips back false on its own, no explicit "resume" handling needed.
`isFreshAttempt = attempts === 0` is fixed at mount (the existing `attempts`
prop), so a lesson already complete when the screen mounted stays a "replay"
— never interrupted — for its whole duration.

New `OutOfHeartsOverlay` renders as a **blocking** overlay (no
backdrop-dismiss, unlike `HeartsLockedModal` from #532 — this is a forced
decision point) on top of the still-intact exercise UI underneath, so
"resume at the same question" falls out for free: buying a heart
(`handleBuyHeart`, `App.jsx`, no confirm dialog — the overlay's button is
already the explicit confirmation) doesn't touch `exerciseReducer`'s state
at all, it just stops the overlay's own condition from being true. "Discard
and exit" reuses the existing `onExit` prop directly (bypassing
`handleExitClick`'s unsaved-progress confirm — the overlay itself already
was the confirmation) — since `onExit`/`handleReturnToHome` never calls
`recordResult`/`addPoints`, a cancelled attempt was already guaranteed to
leave no trace without extra code.

One label collision caught before it shipped: the overlay's exit button
would have read "Exit lesson", identical to the X button's existing
`exitLessonLabel` aria-label — ambiguous for both learners mid-panic-reading
and `getByRole` test queries. Renamed to "Discard and exit" (and the
es/eu equivalents) to make the distinct action *and* the button unique.

Manually verified in the dev server (Playwright): wrong answer at 1 heart
→ blocking modal → "Discard and exit" → back at the lesson list with empty
`progress` (and, satisfyingly, #532's lockout immediately shows the lesson
as heart-locked); same setup with points seeded → "Buy a heart" → modal
clears, hearts restored, points spent, `Continue` button still there
mid-feedback; an already-completed lesson at 0 hearts takes a wrong answer
without any modal at all. New test coverage in `App.exerciseScreen.test.jsx`
(`describe('out of hearts mid-lesson (#533)')`) covers the same three paths.
Full suite (487 tests) + lint + build green.

## 2026-07-01 — Resolved issue #532: lesson-list heart lockout (HomeScreen)

Third implementation slice of the heart economy epic (#529), building on
#530/#531. `LessonNode` gained a `heartLocked` prop, computed in `LessonList`
as `!locked && isLockedOut(hearts, lesson.id, progress)` — deliberately
`&&`ed with `!locked` so it only ever applies on top of an already-unlocked
lesson, never overriding the existing progression/gate lock's own icon
(🔒/🛡️) or disabled state. A heart-locked lesson gets its own icon (💔), an
inline hint (`heartsLockedHint`, styled like the existing `gateNeedsScore`
hint), and — unlike a progression-locked lesson — stays clickable so tapping
it opens `HeartsLockedModal` instead of silently doing nothing (a
progression-locked lesson keeps `disabled`, so its tap already did nothing
before this change and still does). The modal is informational only for now
("wait or replay a completed lesson") since there's no purchase affordance
yet (#534). `hearts`/`onHeartLocked` thread down the same prop chain
`progress`/`unlockedIds`/`onSelect` already use (`JourneyTab` →
`PhaseSection` → `StageSection` → `UnitLessons` → `LessonList` →
`LessonNode`) — consistent with the rest of this screen, no context
introduced. Added `heartsLockedHint`/`heartsLockedTitle`/`heartsLockedBody`/
`heartsLockedClose` to all three `translations.js` languages.

Manually verified in the dev server (Playwright, seeded `localStorage`): at
0 hearts, an already-attempted lesson stays fully playable, the next
unlocked-but-never-attempted lesson shows the 💔 treatment and opens the
modal on tap, and lessons already progression-locked are unaffected; at full
hearts the list renders identically to before this change. No heart-count
badge yet (#534) — `ProgressTab` also untouched (display-only, not a lesson
launcher). Full suite (484 tests) + lint + build green.

## 2026-07-01 — Resolved issue #531: wired hearts into App.jsx (load, focus-regen, wrong-answer deduction)

Second implementation slice of the heart economy epic (#529), building on
#530's pure logic. `AppShell` now loads `hearts` via `heartsStorage.load()`
run immediately through `applyHeartRegen(_, Date.now())` (so a session
reopened after a while shows any regen that happened while it was closed,
without waiting on the focus listener), persists it the same way as
`points`/`dailyStreak`/etc., and recomputes regen again on
`document.visibilitychange` (no background timer, per
`docs/HEART_ECONOMY_ANALYSIS.md`). `ExerciseScreen` gained an `onWrongAnswer`
callback, called on **every** incorrect submission including retries of the
same question — a deliberate difference from `misses`/scoring, which only
count a question's first attempt; the heart economy's trigger is "an
incorrect answer is submitted," full stop, matching the original spec's
literal wording. `hearts` also resets alongside `progress`/`points`/etc. in
"Reset progress," and was folded into `dataRef.current` (unused by the sync
payload yet — that's #535 — but the plumbing is there so #535 doesn't need
to touch `App.jsx`'s state wiring again).

Manually verified in the dev server (Playwright): a wrong answer visibly
takes `aditzak:hearts:v1` from `{currentHearts:5,...:null}` to
`{currentHearts:4,...:<timestamp>}`. No visible heart-count UI yet (#534) —
no lockout (#532) or mid-lesson cancellation (#533) either, both deliberately
deferred to their own issues. Full suite (484 tests) + lint + build green.

## 2026-07-01 — Resolved issue #530: hearts data model + pure regen/deduct/buy/lockout logic

First implementation slice of the heart economy epic (#529). Added
`heartsStorage` (`aditzak:hearts:v1`, `storage.js`) alongside the existing
`pointsStorage`/`streakStorage`/`errorStorage`, reusing the plain
`createStorage` helper unchanged — the `{}` empty-object default already
reads as "full hearts, nothing pending" once run through `applyHeartRegen`,
so no custom default-value logic was needed. Added `MAX_HEARTS`,
`HEART_REGEN_TIME_MS`, `HEART_COST_POINTS`, and the pure functions
`applyHeartRegen`/`deductHeart`/`canBuyHeart`/`buyHeart`/`isLockedOut` to
`lessonLogic.js`, grouped as their own "Hearts (lives)" section right after
the existing Points section (they lean on `getPointsBalance`/the
`addPoints`-style `spent[deviceId]` shape). `buyHeart` mirrors
`repairStreak`'s return shape (`{ hearts, points }`) for the same reason:
one call updates two independent pieces of state.

**Scope note:** `mergeHearts` and wiring `hearts` into `mergeSyncPayload`
were deliberately left out of this PR even though they're natural
companions to `applyHeartRegen` — they're issue #535's (cross-device sync)
scope per the epic breakdown, kept separate so each issue lands as an
independently reviewable PR. No `App.jsx`/UI changes yet either (issue
#531) — this is data-model-and-logic only, covered by a new `hearts`-focused
block of unit tests in `logic.test.js` (`applyHeartRegen`/`deductHeart`/
`canBuyHeart`+`buyHeart`/`isLockedOut`). Full suite (484 tests) + lint +
build green.

## 2026-07-01 — Heart economy broken into GitHub issues (#529 epic + #530-536)

Filed the implementation of `docs/HEART_ECONOMY_ANALYSIS.md`/the two prior
2026-07-01 decisions as GitHub issues, mirroring the #86-epic/#87-91-sub-issue
pattern used for the account/sync backend: **#529** (epic, holds the
already-settled product decisions so sub-issues don't relitigate them),
**#530** (heartsStorage + pure regen/deduct/buy/lockout logic in
`lessonLogic.js`), **#531** (wires it into `App.jsx`: load/save, lazy regen
on focus, wrong-answer deduction), **#532** (lesson-list lockout UI),
**#533** (mid-lesson force-cancellation — the one mechanic not in the
original spec), **#534** (heart badge + purchase UI), **#535** (cross-device
sync, `mergeHearts`). **#536** (Phase 2's "recover a life" forced-review
lessons) is filed separately as future work, deliberately left underspecified
until the epic ships. No implementation has started yet.

## 2026-07-01 — Heart/lives economy: lockout/points/motivation questions resolved (still not implemented)

Follow-up to the analysis below. Product decisions: (1) at 0 hearts, only
lessons with a recorded attempt stay playable — everything else the linear
unlock model would allow is additionally blocked until hearts recover; (2) an
in-progress *fresh* attempt (not a replay of an already-completed lesson) must
be force-cancelled the moment hearts hit 0, unless the learner buys a heart on
the spot to continue — a mid-lesson mechanic the original spec didn't cover,
needing a new interstitial/modal and a "don't score a cancelled attempt"
rule (so cancelling can't perversely unlock the next lesson); (3) keep
repeat-lesson points below first-attempt points (already true today), drop
the spec's flat `POINTS_PER_REVIEW`, tune exact numbers later; (4) motivation
confirmed, Phase 2 refined to dedicated forced-review "recover a life"
lessons rather than error-log practice. Recorded in
`docs/HEART_ECONOMY_ANALYSIS.md`'s "Resolved" section. Still no hearts code —
implementation is the next step, not done here.

## 2026-07-01 — Heart/lives economy spec: analysis only, not implemented

An external "Player State, Economy, and Heart System" spec proposed a
hearts/lives mechanic (`MAX_HEARTS`, timestamp-based lazy regen, a
heart-purchase economy). Wrote up the requested analysis (client-clock/
multi-device exploit edge cases, architecture fit, step-by-step regen-function
plan) as `docs/HEART_ECONOMY_ANALYSIS.md` rather than building it — the spec
conflicts with two things already in the codebase (`POINTS_PER_REVIEW=20`
duplicates/contradicts the existing `LESSON_POINTS_REPEAT` repeat-lesson
reward; the proposed lockout rule is a third, unspecified axis on top of the
existing linear-unlock + gate-score model in `getUnlockedLessonIds`) that need
a product decision, not an implementer's guess. No hearts code, storage key,
or UI exists yet — see that doc's "Open questions" before starting.

## 2026-06-27 — milestone phases + unified Bonus phase (rebalance increment 4)

Closed out the rebalance's presentation work. (1) The five spine phases now
carry CEFR milestone bands — Phase I·A1 (Survive), II·A2 (Everyday Life),
III·B1 (Into the Past), IV·B1 (People & Relationships), V·B2 (Nuance &
Modality). (2) **All bonus units (35–51) were consolidated under one "Bonus —
Mastery, Register & Color" phase**, instead of rendering inline in the old
Phases V/VI/VII. Implemented by **redrawing phase/stage boundaries** in
`journey.js` rather than moving any unit object — units 35–51 were already
physically contiguous and ascending, so Phase V was closed after Agintera (34),
the old Phases VI/VII phase-wrappers were dissolved (their stages reparented),
and the existing Bonus phase header was hoisted to open at Unit 35. Net: units
stay ascending 1–51, `LESSONS`/unlock order untouched, completability
invariants re-verified (368 reachable; 194-spine completes without bonus).

Kept the old `phase-5-stage-12`/`phase-6-*`/`phase-7-*` *stage ids* as-is
(only reparented) so their existing i18n entries keep resolving; added one new
stage `phase-bonus-stage-subjunctive` (Unit 35) and orphaned the now-unused
`phase-6`/`phase-7` phase i18n entries (harmless — the test only checks stages
and unit numbers). Updated an `App.homeScreen` test that asserted the exact
heading "Phase I" to a `/Phase I\b/` matcher. Full suite (463) + lint + build
green. The rebalance is now complete bar the §4 unit *reordering* (a
`LESSONS`-order change, deliberately deferred).

## 2026-06-27 — short mandatory spine: demoted Units 35–47 to Bonus

Increment 3. Per the rebalance's "short mandatory spine" principle, everything
after **Agintera (Unit 34)** — subjunctive (35), the whole hitanoa stage
(36–39: hi/toka/noka), reading (40), causatives (41–43, incl. Gate D),
synthetic/unergative curiosities (44/46), weather (45), erabili (47) — is now
`bonus: true`. The mandatory spine is Units 1–34 (194 lessons); the rest
(174 lessons across bonus units 35–51) is opt-in and never gates.

Verified by simulation: no deadlock (all 368 reachable) and the full 194-lesson
spine completes **without ever touching a bonus lesson**. Added a visible
"✨ Bonus · optional" badge (`bonusLabel` i18n key, violet pill) to bonus unit
headers in `HomeScreen` so the optionality is legible — previously bonus only
affected unlock behaviour invisibly. Full suite (463) + lint + build green.

Known cosmetic gap: bonus units 35–47 still render inline in Phases V–VII
(badged) rather than relocated into the "Bonus — Mastery & Depth" phase with
48–51 — deferred to the milestone phase reorg.

## 2026-06-27 — promoted `gustatu` ("I like it") into the present cluster

Increment 2 of the rebalance. The NOR-NORI present unit (`gustatu`/`iruditu`/
`ahaztu`, "I like it" — `gustatzen zait`) was the journey's single most useful
pattern but sat at Unit 25 of 47. Moved it to **Unit 14**, right after the
NOR-NORK present, so a learner can say "I like coffee" near the start instead
of two-thirds in. The NOR-NORI *past/future* stays later (Unit 26, "Dative
Across Time") — the present/past split is intentional per the milestone design.

Mechanics: moved the 9-lesson `gustatu`-present block in `LESSONS` (now index
44/368, right after the NOR-NORK present pool, before the past pools) so the
unlock chain reaches it early — this is the one genuinely-reordering change,
since `getUnlockedLessonIds` unlocks in `LESSONS` order. Relocated the unit
object in `journey.js` from Phase IV Stage 8 into Phase II Stage 4 and did a
local renumber (new gustatu = 14; old 14–24 shift to 15–25; units 26+
unchanged — the spine stays a contiguous 1–47). Rotated the matching
`journeyTranslations.units` keys 14–25 (verified every unit's translation
realigns with its new number) and gave Unit 14 a "Me gusta / Gustatzen zait"
title. No `verbs.js` change, no `STORAGE_KEY` bump (lesson ids unchanged). Full
suite (463) + lint + build green; an unlock simulation confirms gustatu-present
opens once Unit 13 is cleared.

Still deferred: the full competence-milestone (A1→B2) renumber/relabel of the
whole journey — a much larger i18n + structure pass. See
`LEARNING_JOURNEY_REBALANCE.md` §4.

## 2026-06-27 — implemented the journey-rebalance deflation (Bonus tracks)

Landed the first, highest-value increment of the rebalance proposal below:
deflated the four monster units by relocating their object/subject-axis and
ditransitive permutations onto a new opt-in **Bonus — Mastery & Depth** phase.
Unit sizes: **15 maite izan 26→6, 32 Ahalera 51→13, 33 Baldintza 46→8,
34 Agintera 32→8**; 120 lessons moved to four `bonus: true` units (48 "Reverse
Object Axis", 49/50/51 "…Axes in Depth" for potential/conditional/imperative).

Engine support: `getUnlockedLessonIds` gained a `bonusLessonIds` param
(`journey.js` exports `BONUS_LESSON_IDS`). A spine lesson's predecessor now
skips any bonus lessons physically between it and the previous spine lesson, so
a bonus track never gates spine progression; a bonus lesson itself unlocks
linearly off whatever immediately precedes it (the spine point it branches
from). Empty `bonusLessonIds` reduces exactly to the old behaviour. No
`verbs.js`/`lessons.js` change (the move is sequence-preserving — bonus lessons
keep their original `LESSONS` positions) and **no `STORAGE_KEY` bump** (lesson
ids unchanged). Added a `bonusLessonIds` contract test to `logic.test.js`; full
suite (460) + lint + build green.

Deferred to a follow-up increment (the riskier, `LESSONS`-reorder + i18n-rekey
heavy parts): the `gustatu` promotion to the A2 milestone and the full
competence-milestone renumber. See `LEARNING_JOURNEY_REBALANCE.md` §7.

## 2026-06-27 — proposed an aggressive journey rebalance (`LEARNING_JOURNEY_REBALANCE.md`)

Filling in complete synthetic/auxiliary conjugation coverage left the journey
badly unbalanced (four units — 32 Ahalera/51, 33 Baldintza/46, 34 Agintera/32,
15 maite izan/26 — hold ~half of all lessons) *and* mis-ordered: the single
most useful pattern, `gustatzen zait` ("I like it"), was Unit 25 of 47, and the
mandatory path was padded with encyclopedic content (the full mood×object-axis
matrix, hitanoa, synthetic curiosities). Root size cause: the object/subject
axis is drilled combinatorially inside every tense *and every mood* — each
`(axis-value × mood)` slice became its own lesson plus a per-value review.

Wrote `docs/LEARNING_JOURNEY_REBALANCE.md` proposing a layout-only,
data-preserving reorganization (no `verbs.js` change, no `STORAGE_KEY` bump)
around **competence milestones** (A1→B2): a short ~26-unit mandatory spine that
front-loads usefulness (`gustatu` promoted to Unit 8; past/future early), with
everything encyclopedic — mood×axis permutations, hitanoa (hi/toka/noka),
synthetic/unergative curiosities, weather, reading — demoted to opt-in **Bonus
tracks** that never gate progress (a `bonus: true` unit flag). Moods are taught
on the core paradigm only; the ~90 `…ByObject`/`…ByNor` mood splits collapse
into a few wide pooled reviews in Bonus track I. Also flags an engine lever:
stop mechanically doubling every (verb × tense) into singular + `-plural`
lessons (~halves lesson count). The doc keeps a conservative
non-aggressive alternative in its git history (first commit) for a
"reference app" framing. Proposal only — not yet implemented.

## 2026-06-27 — re-split `App.*.test.jsx` along the new module boundaries

The four-way test split below (`App.account`/`App.home`/`App.questionTypes`/
`App.sync`) was made purely for Vitest's file-level worker parallelism, along
the original monolithic `App.test.jsx`'s own pre-existing `describe` blocks —
before the same-day module split above existed. That left it misaligned with
the new architecture: `App.account.test.jsx` mixed `ExerciseScreen.jsx` tests
(question flagging, exit confirmation) with `AppShell`/`HomeScreen.jsx` tests
(account sign-in), and `App.home.test.jsx` mixed `App.jsx` (language
onboarding), `HomeScreen.jsx` (feedback form, "share app"), and
`ExerciseScreen.jsx` (lesson preview, "share result" — `LessonResultsScreen`
lives in `ExerciseScreen.jsx`, not `HomeScreen.jsx`) despite the file's name.

Re-split along the module boundaries instead: `App.exerciseScreen.test.jsx`
(question flagging, exit confirmation, lesson preview, share result) and
`App.exerciseQuestionTypes.test.jsx` (renamed from `App.questionTypes.test.jsx`,
content unchanged — it was already cleanly `ExerciseScreen.jsx`-scoped) cover
`screens/ExerciseScreen.jsx`; `App.homeScreen.test.jsx` covers
`screens/HomeScreen.jsx` (home rendering, feedback form, share app);
`App.appShell.test.jsx` covers `AppShell`'s own remaining logic in `App.jsx`
(language onboarding, account sign-in, cross-device sync).

`ExerciseScreen.jsx` has by far the most test surface, so its tests stayed
split across two files (`App.exerciseScreen.test.jsx` and
`App.exerciseQuestionTypes.test.jsx`) rather than one — collapsing them would
have reintroduced the wall-clock imbalance the original test split fixed,
just along a different axis. `App.homeScreen.test.jsx` ended up comparatively
small (~115 lines); that's fine, since a small file finishes fast rather than
becoming a bottleneck. All five files still only `import App from './App'`
and render the full tree — same as before. `npm run lint`, `npm test`
(460 tests, same count as before the re-split), and `npm run build` all pass.

## 2026-06-27 — split `App.jsx` into screens/storage/api modules, superseding #194

`App.jsx` had grown to 2910 lines (5 sections behind a section-index comment
block — see the superseded #194 entry in `docs/DECISIONS_ARCHIVE.md`, which
explicitly chose *not* to split the file and added that index instead). By
now the file had grown well past where a navigation aid alone still helped:
finding and safely editing one section meant holding the whole file's worth
of unrelated imports/components in view.

Split along the section boundaries the index already named: `storage.js`
(localStorage helpers — `progressStorage`/`streakStorage`/`errorStorage`/
`pointsStorage`/`accountSessionStorage`/`getDeviceId`), `api.js` (feedback
and sync Cloudflare Worker calls/constants), `lessonDisplay.js`
(`describeLesson` and the small pure helpers around it), `components/badges.jsx`
(`TypeBadge`/`AgreementBadge`/`Stars`/`ProgressBar`/etc.), `screens/HomeScreen.jsx`,
and `screens/ExerciseScreen.jsx`. `App.jsx` itself now holds only
`LanguageOnboardingScreen`, `AppShell` (the sync/account/progress state
machine), and the default-exported `App` — about 370 lines.

This is also the first time non-test code imports named exports *from*
former `App.jsx` content (`HomeScreen`, `ExerciseScreen`, `MergeModal`,
the badge components, the storage/api helpers) — #194's original
"don't split" rationale was partly that nothing outside `App.jsx` needed
to import its internals, since tests only used the default `App` export.
That's no longer true now that the pieces live in their own files; existing
tests (`App.*.test.jsx`) were unaffected since they still only import the
default `App` export.

`randomStreakNudgeCooldown` moved from `App.jsx` into `lessonLogic.js`
(rather than being exported from `screens/ExerciseScreen.jsx`, where it was
first extracted to) because `react-refresh/only-export-components` forbids
a `.jsx` file from exporting non-component values alongside a component —
`lessonLogic.js` already holds pure question/progress logic with no JSX, so
it was the natural home.

`npm run lint`, `npm test` (460 tests), and `npm run build` all pass
unchanged after the split.

## 2026-06-27 — split `App.test.jsx` into four files for real test-run parallelism

Profiling `npm test` showed `App.test.jsx` alone accounted for 95 of the
suite's ~97 wall-clock seconds — everything else (the other 6 files, 379
`logic.test.js` tests included) finished in under a second combined. Vitest
parallelizes at the *file* level (one worker per file, up to the CPU count),
so a single dominant file meant the other cores sat idle while one worker
ran ~80 sequential DOM-rendering tests.

Split `App.test.jsx` along its own existing `describe` block boundaries into
`App.home.test.jsx` (top-level rendering, share app/result), `App.questionTypes.test.jsx`
(match-pairs, carrier sampling, word-order, review-form, lure-feedback — the
block that owns the shared `vi.mock('./lessonLogic', ...)` and its
`vi.hoisted` flags, since those mocks are only used by this group), `App.account.test.jsx`
(question flagging, lesson navigation confirmation, account sign-in), and
`App.sync.test.jsx` (cross-device sync, including the three ~3s merge-modal
tests). No test bodies changed — pure file split — so the same 460 tests
still pass; wall-clock time dropped from ~97s to ~55-64s on this 4-core
machine since the four files now run in separate workers concurrently
instead of one file serializing most of the suite.

Considered `test.concurrent` instead (no file restructuring needed), but
rejected it: several `describe` blocks share mutable `vi.hoisted` mock state
(`matchPairsMock`, `generateQuestionsCalls`, etc.) and a single
`afterEach`/`beforeEach` resets `localStorage` for the whole file — running
those tests concurrently within one file risked races and flaky failures
that a plain file split avoids entirely.

Updated `CLAUDE.md`'s Commands section (`src/App.test.jsx` → `src/App.*.test.jsx`)
since `npm test` (`vitest run`) picks up test files by glob, not an explicit
list — no script change needed, just the doc reference.

## 2026-06-27 — deleted `scripts/audit-conjugations.mjs` and `scripts/audit-journey-coverage.mjs`

Both imported `docs/CONJUGATION_COVERAGE.js`, which the same day's docs-staleness
audit deleted (superseded by `VERB_COVERAGE.md`) without checking for script
consumers — both have been crashing with `ERR_MODULE_NOT_FOUND` since, and
neither is referenced from any other file, `package.json` script, or
`docs/DECISIONS*.md` entry, unlike the still-active `validfor-*`/`frame-*`
audit tooling. Removed rather than repointed at `VERB_COVERAGE.md`: that file
isn't structured data (no `CONJUGATION_COVERAGE`-shaped export), so "fix the
import" would mean rewriting both scripts from scratch for an audit nobody
has run in months.

## 2026-06-27 — archived 126 entries to bring `DECISIONS.md` back to its ~25-entry policy

`DECISIONS.md` had grown to 151 entries (3,674 lines) spanning just 13 days,
despite this file's own header (and `CLAUDE.md`'s "Decisions log" section)
saying to keep only the ~25 most recent and move the rest to
`DECISIONS_ARCHIVE.md` — that pruning step had stopped happening somewhere
along the way. Moved everything older than the 25 most recent verbatim to
the top of the archive (no rewriting/merging) — entries were each a unique,
legitimate decision, not duplicates, so trimming content risked losing
detail for no real space win; the actual problem was just that the move
to archive hadn't been kept up.

## 2026-06-27 — docs relevance audit: deleted stale docs, fixed stale summaries

Audited `docs/` for staleness. Deleted `docs/CONJUGATION_COVERAGE.js` (an
unimported, never-updated snapshot of ~16 verbs vs. `VERBS`'s 100+ — fully
superseded by `VERB_COVERAGE.md`, which has been kept current) and
`docs/reviews/sentence-review-sample-izan-egon-ukan.md` (a one-off sample
review artifact, not a living doc). Fixed two stale summary lines that hadn't
kept pace with the rest of their docs: `EXERCISE_ENGINE.md`'s header said
"32-unit sequence" (now 47, 44 `available`); `VERB_COVERAGE.md`'s intro said
the app covers only `izan`/`ukan` even though every section below it had been
kept current — reworded to point at §4 instead of repeating a summary count
that goes stale every time a verb is added. `LEARNING_JOURNEY_PROPOSED.md`/
`LEARNING_JOURNEY_EVALUATION.md`/`EXERCISE_VARIETY_PLAN.md` were reviewed and
left as-is — they already self-label as proposal/historical/shipped and are
still the right reference for "why" a given journey/engine decision was made.

## 2026-06-27 — #518: flipped Unit 44 ("Synthetic Curiosities") to `available`

`jario`/`irudi`/`etzan` already had `recognitionOnly: true` and full
present/past conjugation+sentence data, but #485/#486 deliberately left
Unit 44 `pending` with no lessons, deferring the "what should these
lessons look like" call to a future issue — this is that issue. Went with
the same shape every other recognition-only-by-flag synthetic verb in this
file uses (a plain flat lesson, one per verb/tense) rather than inventing
a lighter "reading" kind, since `verb.recognitionOnly` already forces
`noProduction` in `generateQuestions` regardless of lesson shape — no new
engine behavior was needed, just lessons that point at data that already
exists. Added `mode: 'recognition'` on each new lesson anyway (redundant
with the verb flag for `noProduction` purposes) purely so `LessonNode`'s
"Recognition only" badge renders — that badge reads `lesson.mode`, not
`verb.recognitionOnly` (see `describeLesson` in `App.jsx`), and showing it
matches the unit's own "recognition-only" framing in `focus`. `irudi`'s
present (`hi-m`/`hi-f`) and both verbs' `hi` cells are excluded via
`persons`, matching the established `ihardun`/`iraun`/`erabili` precedent
of excluding ungrounded `hi` cells that have no `sentences` entry.

## 2026-06-27 — #517: wired up `izan`/`ukan`'s 4 foundational mood tenses into the journey

`conditionalPast`, `potentialAlegiazkoa`, `potentialLehenaldia`, and
`subjunctivePast` already had complete conjugation data in `verbs.js`
(added by #495/#496/#497/#494) but no lesson referenced them, so they were
unreachable in the app. Added 8 flat practice lessons (`izan`/`ukan` ×
each tense) plus 3 dedicated review lessons, and extended each tense's
sibling unit's `lessonIds` rather than creating new units, per the
issue's own suggested mapping:

- Units 32 (Ahalera): `potentialAlegiazkoa`/`potentialLehenaldia`, full
  persons — matches `izan-potential`/`ukan-potential`'s own scope.
- Unit 33 (Baldintza & Ondorioa): `conditionalPast`, full persons —
  matches `izan-conditional`/`ukan-conditional`.
- Unit 35 (Subjuntiboa): `subjunctivePast`, restricted to
  `persons: ['hura', 'haiek']` — matches `izan-subjunctive-present`/
  `ukan-subjunctive-present`'s established 3rd-person-only production
  scope for this unit, since the past sub-tense shares the same
  "subjunctive as a construction" framing as its present sibling.

Each new review lesson pools just its own tense pair, separate from the
existing reviews for the present-tense siblings, to keep each review
small and matching the unit's `unit-N-object-axis-review`-style
granularity already established for these units.

## 2026-06-27 — #490: added `ukan`'s `subjunctivePresentByObject`/`subjunctivePastByObject` 2D tables

Added the full NORK×NOR object-axis grids for `ukan`'s subjunctive mood,
mirroring `potentialByObject`/`conditionalByObject`'s existing shape and
gap conventions (`hi` omitted as both subject and object; `ni`<->`gu` and
`zu`<->`zuek` reflexive-like pairs omitted). Sourced from
`CONJUGATIONS.md` §3's full "Subjuntiboa, Orainaldia"/"Subjuntiboa,
Lehenaldia" grids — each table's `hura` column was cross-checked
cell-for-cell against the existing flat `subjunctivePresent`/
`subjunctivePast` tables (already added by #494) and matches exactly.

The issue's own example data was internally inconsistent — it mixed
ditransitive (`NOR-NORI-NORK`) forms like `diezadan`/`diezaan` with plain
`NOR-NORK` forms like `dezan`/`dezaten` under the same table, and labeled
present-tense ditransitive citation forms (`§16.1`'s `NORI`=`niri` present
column) as `subjunctivePast`. Used `CONJUGATIONS.md` §3's actual NOR-NORK
grids directly instead of the issue's example, since those are unambiguous
and already-established as this verb's source of truth.

Added `tenseSubjunctivePresentByObject`/`tenseSubjunctivePastByObject`
`TENSE_META` entries and matching `en`/`es`/`eu` translation strings.

## 2026-06-27 — #486: added `etzan`, third and final Unit 44 verb, scope intentionally limited to data only

Added `etzan` ("to lie (in) / consist of") with `agreement: ['nor']`
(plain absolutive subject, CONJUGATIONS.md §8) and `recognitionOnly: true`,
completing the `jario`/`irudi`/`etzan` trio Unit 44 ("Synthetic
Curiosities") plans as bonus content. Unlike `irudi`, #486's agreement
label in `journey.js`'s existing `focus` text was already correct
(`'etzan (nor, "datza")'`) — no `journey.js` edit needed this time.

`etzan` is rare and largely archaic/literary in modern Euskara Batua; noted
that inline as a usage caveat, since the everyday equivalent is the
periphrastic "etzanda egon". Its only sentence theme is the fixed idiom
"zertan datza X?" ("what does X consist of?"), already foreshadowed in
Unit 44's `payload` field — built present/past sentences for all persons
around that theme. Pronouns use the bare-absolutive style (`Ni`/`Hi`/`Zu`/
...), matching other `nor`-only verbs like `egon`, not `irudi`'s
ergative-style pronouns (`irudi` has `nork`, `etzan` doesn't).

Per #486, did **not** create `etzan-present`/`etzan-past` lessons and did
**not** flip Unit 44 from `pending` to `available` — same deferred
journey-restructuring stance as `jario`/`irudi`.

Checked `scripts/validfor-delta-audit.mjs --verb etzan` — surfaced only
`izan`/`egon` identity/location frames ("Ni irakaslea ___", "Ni etxean
___"); none genuine ("consisting of X" isn't "being X" or "being located
at X"), so `validFor` stays empty; baseline regenerated.

## 2026-06-26 — #485: added `irudi`, corrected Unit 44's agreement label, scope intentionally limited to data only

Added `irudi` ("to seem / give the impression") with `agreement: ['nork']`
(unergative, ergative subject, no absolutive — CONJUGATIONS.md §8) and
`recognitionOnly: true`, same pattern as `jario`. The original issue had
mislabeled it `nor-nork`; corrected both the new verb entry and Unit 44's
own `focus` text in `journey.js`, which carried the same mislabel.

Per #485's explicit scope correction, did **not** create `irudi-present`/
`irudi-past` lessons and did **not** flip Unit 44 from `pending` to
`available` — recognition-only bonus content for this unit (jario/etzan/
irudi together) stays a journey-restructuring decision, not something to
assume while just backfilling one verb's data. `jario` already established
this same "data exists, unit stays pending" precedent.

Kept the `iruditu` distinction inline in `meaning`/the comment block:
`irudi` ("dirudizu" = you give the impression, external appearance) is a
false-friend of `iruditu` ("iruditzen zait" = it seems to me, nor-nori,
subjective opinion) — same root, drifted apart in meaning and agreement.

Checked `scripts/validfor-delta-audit.mjs --verb irudi` for cross-verb
`validFor` candidates — surfaced only the usual `ukan`/`nahi`/`behar`-family
generic-object frames ("Nik liburu bat ___"), none genuine ("seeming" isn't
"having/wanting/needing"), so `validFor` stays empty; baseline regenerated.

## 2026-06-26 — #483: added `erabili`, new Unit 47 (Stage 18)

Added `erabili` ("to use") as a plain nor-nork synthetic verb in the
already-taught `eduki`/`jakin` shape — present/past, no `hi` row (matching
`ekarri`/`eraman`/`eduki`'s own gap, no `hik` form sourced in
CONJUGATIONS.md §7). Skipped the issue's optional "consider plural object
forms" bullet: unlike `eraman`/`ekarri` (whose plural-object `-tza-` forms
feed the cross-verb object-axis review lessons), nothing in the current
curriculum exercises `erabili` against that review pool, so adding the
forms now would be data with no consumer — can be added later if a lesson
actually needs it.

Checked `scripts/validfor-delta-audit.mjs --verb erabili` for cross-verb
`validFor` candidates: surfaced only the usual `ukan`/`eduki`/`jakin`/`jan`-
family generic-object sentences ("Nik liburu bat ___", "Nik sagarra ___")
— "using" something is a distinct action from having/wanting/eating/
knowing it, so none are genuine; `validFor` stays empty throughout and the
gap-audit baseline was regenerated to absorb the surface.

Placed in a new Unit 47 ("erabili — Using Things", Stage 18) rather than
folding into Unit 16 ("eraman/ekarri — More NOR-NORK Synthetics") — Unit 16
is already complete/gated-past in the core sequence, so a same-shape verb
added later belongs in its own bonus-tail unit (same reasoning Unit 16
itself used to justify sitting in Phase VII rather than the renumbered
core).

## 2026-06-26 — #484: added `iraun`, extends Unit 46 alongside `ihardun`

Added `iraun` ("to last / endure") as the second `agreement: ['nork']`-only
verb, following #481's `ihardun` pattern exactly: same `di-`/`-en` di-root
present/past shape, no `nor` slot, `persons` filter excluding `hi` from
typed-fill-in lessons (neither verb has a `sentences` entry for that
person, matching `ukan`/`jakin`'s own gap).

`iraun` is now `ihardun`'s first real `agreementsCompatible` sibling (both
`['nork']`-only), so checked explicitly via
`scripts/validfor-delta-audit.mjs --verb iraun` whether the two verbs'
sentence frames should cross-populate each other's `validFor`. They
shouldn't: "Filmak bi ordu dirau" (the film runs two hours) isn't a frame
"Lanean dihardut" (I'm busy working) could ever complete, and vice versa —
different meanings, no shared object/time-extent slot. Left both verbs'
`validFor` empty and regenerated the gap-audit baseline to absorb the new
surface, same as #481 did.

Extended Unit 46 ("Unergative Curiosities") to cover both verbs rather than
giving `iraun` its own unit — it's the same grammatical curiosity
(unergative, NORK-only) introduced by `ihardun`, just a second example, so
a single unit covering the pattern with two verbs reads better than two
near-identical one-verb units.

## 2026-06-26 — #481: added `ihardun`, the first `agreement: ['nork']`-only verb

Added `ihardun` ("to occupy oneself / be engaged in something") as the first
verb with `agreement: ['nork']` — no `nor` slot at all (unergative: ergative
subject, no absolutive argument). Verified before writing any data that
nothing downstream assumes a `nor` slot exists: `AgreementBadge`/
`AGREEMENT_META` just map over whatever roles are in `agreement`, and
`getCaseFrameSibling`/`getDativeOvergenerationSibling` (`lessonLogic.js`)
both require `nori`, which `ihardun` doesn't have either, so they're
unaffected. `agreementsCompatible(['nork'], ['nor','nork'])` evaluates
`true` (it only compares `nork`/`nori` status, never `nor`) — confirmed via
`scripts/validfor-delta-audit.mjs --verb ihardun` that this surfaces several
hundred new candidate matches against `ukan`'s object-citation sentences
(e.g. "Nik liburu bat ___." accepting `dihardut`). None of these are
genuine — `ihardun` has no object slot and a completely different meaning —
so no `validFor` entries were added for it; the gap-audit baseline was
regenerated to absorb the new (intentionally unfilled) surface rather than
suppressing it.

Placed in a new Unit 46 ("Unergative Curiosities", Stage 17) rather than
folding into Unit 44 ("Synthetic Curiosities") — Unit 44 is scoped
recognition-only (one example sentence each for `jario`/`etzan`/`irudi`,
per #485/#486), while `ihardun` gets full present/past production lessons
per #481's literal ask, so mixing it into Unit 44 would conflate two
different scopes under one unit.

## 2026-06-26 — #498/#501/#502: reopened — "ukan-nori" compound-key plan was based on a misread of `esan`'s entry

#498 had decided to add `ukan`-nori/`ukan`-nori-nork forms as literal
compound tense keys (`presentByNori`, `presentByNoriNork`, etc.) directly
on `ukan`'s own `conjugations`, citing `esan`'s entry as an existing
precedent for that shape. Checked `esan` directly: it has no such keys.
It has `recipient: 'hura'` + `ditransitivePrefixes`, composed at runtime
(`getFixedArgument`/`resolveObjectAxisTable`, `lessonLogic.js`) against
the shared `OBJECT_AXIS_SKELETONS.diot` table — recorded once, reused by
seven verbs (`esan`/`eman`/`saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu`).
The dative-only equivalent is `dativeIzan`/`dativeIzanByNor`, composed the
same way into `gustatu`/`iruditu`/`ahaztu`/`jarraitu` (#448).

Two separate problems, not one:
1. **"ukan-nori" (dative, no ergative) isn't a real paradigm.** `ukan`
   always carries an ergative subject; NORI-without-NORK is `izan`'s
   dative (CONJUGATIONS.md §4), already covered by `dativeIzan`. #501's
   cited "§3 — ukan-nori" doesn't exist; §3 is plain `ukan` NOR-NORK.
2. **The ditransitive (NOR-NORI-NORK) forms #502 asks for already exist**
   as `OBJECT_AXIS_SKELETONS.diot`. Writing them again as literal keys on
   bare `ukan` would duplicate that table cell-for-cell, backing no
   distinct lexical meaning `ukan` doesn't already express through the
   verbs that compose against it.

Reopened #498 with the correction; updated #501/#502 to recommend closing
as superseded once #498 settles, rather than implementing either as
originally written. No `verbs.js`/`lessonLogic.js` changes made — this is
a paused-implementation correction, not a code change.

## 2026-06-26 — #494-497: `izan`/`ukan` past-subjunctive and hypothetical/past mood gaps sourced from CONJUGATIONS.md, not the issues' own example forms

Issues #494-497 (children of the moods epic #487) asked for flat
`subjunctivePast`/`conditionalPast`/`potentialAlegiazkoa`/`potentialLehenaldia`
keys on `izan` and `ukan`. Their example code snippets (auto-generated,
like the rest of the #481-502 batch) contained linguistically wrong forms
for several of these (e.g. fabricated-looking `naitekedan`/`zaitezkkedan`
suffixes for izan's potential moods) — they were not used as a source.
Instead every value was derived independently from `docs/CONJUGATIONS.md`
§2 (izan) and §3 (ukan), and the ukan values were additionally
cross-checked against the existing `*ByObject` 2D tables' `hura` (object)
column, which already encode the same forms (e.g.
`potentialAlegiazkoaByObject.ni.hura === 'nezake'` matches the new flat
`potentialAlegiazkoa.ni`) — all four matched cell-for-cell.

`hi`-inclusion followed each new tense's same-mood-family present-tense
sibling: `izan`'s `conditionalPast`/`potentialAlegiazkoa`/
`potentialLehenaldia` include `hi` (matching `conditional`/`potential`,
which do); `izan`'s `subjunctivePast` omits `hi` (matching
`subjunctivePresent`'s existing hika-deferral note). `ukan`'s four new
tables all omit `hi`, matching every existing ukan mood table.

Added a `tenseSubjunctivePast` `TENSE_META`/i18n entry (the other three
keys already had one, shared with `esan`/`eman`'s existing flat tables).

Related issues #481-486 (ihardun/mintzatu/erabili/iraun/irudi/etzan) and
#212/#213 remain paused/skipped per earlier session decisions — unrelated
to this change.

## 2026-06-26 — #478: `jakin`'s plural-object forms join the existing review pools (not dedicated lessons), after closing its `present`/`presentPlural` gu/zuek/haiek gap

Issue #478 literally asked for dedicated `jakin-present-plural`/
`jakin-past-plural` lessons wired into the journey. Asked the user, who
chose to follow the established precedent instead: every other NOR-NORK
verb's object-plural forms (`ukan`, `eduki`, `eraman`/`ekarri` per #476,
etc.) are pool-only — no dedicated lesson, just sources in
`nor-nork-present-plural-pool`/`nor-nork-past-plural-pool` (and their
`-plural`-suffixed PHASE_1_PLURAL_PERSONS siblings). `jakin` now follows
the same pattern instead of being a one-off exception.

This surfaced a real, pre-existing data gap blocking that: `jakin`'s
`presentPlural` table only covered `ni`/`zu`/`hura` (`gu`/`zuek`/`haiek`
were missing from `present` itself too), which is exactly why
`nor-nork-past-plural-pool`'s old comment had explicitly left `jakin` out.
`docs/CONJUGATIONS.md` §7 already documented the missing `present` cells
(`dakigu`/`dakizue`/`dakite`, #245-sourced) — they just hadn't been ported
into `verbs.js`. Asked the user whether to treat that as in-scope; chose to
close it now rather than ship another half-integrated table. Ported both
`present`'s and `presentPlural`'s missing cells from the documented grid
(not new speculation), which is what let `jakin` join all four plural
pools (present and past, both person-range variants) instead of just the
present-side ones.

Regenerated `scripts/validfor-gap-baseline.json` — the 225-slot increase
for `jakin` is purely from the newly-populated `gu`/`zuek`/`haiek` cells
becoming checkable against other hosts' sentences for the first time;
reviewed via `validfor-delta-audit.mjs --verb jakin` and none are natural
completions, so no `validFor` additions.

## 2026-06-26 — #477: `etorri`'s NOR-NORI dative forms get `presentByNori`/`pastByNori` tables, folded into the existing `nor-nori-*-pool` reviews

Added `etorri`'s confirmed dative forms (`docs/LANGUAGE_DECISIONS.md`'s
existing entry on the data: `datorkit`/`zetorkidan`/`zetorkion`, niri/hari
only) to `verbs.js` and updated `agreement` to `['nor', 'nori']`. Named the
new tables `presentByNori`/`pastByNori` rather than reusing `gustatu`'s
`presentByNor`/`pastByNor` convention: those name the *additional* axis
beyond a verb's usual one, and `etorri`'s usual axis is NOR (the moving
subject) while NORI is the new one here — the opposite of `gustatu`, whose
usual axis is NORI and NOR is the new one. These forms are irregular
synthetic, not decomposable into a `byNoriPrefixes` skeleton like the
periphrastic dative verbs, so the tables are hand-written literals.

No dedicated practice lessons (mirrors #476's precedent): folded
`{ verbId: 'etorri', tense: 'presentByNori' }`/`pastByNori` into the existing
`nor-nori-present-pool`/`nor-nori-past-pool` review lessons in
`src/data/lessons.js` alongside `gustatu`/`iruditu`/`ahaztu`/`jarraitu`/
`jario`. `journey.js` is untouched — `etorri`'s Unit 42 placement already
covers its core present/past, and these pools aren't tied to any unit's
`lessonIds`.

Fixed a side effect: `getCaseFrameSibling` (`lessonLogic.js`) previously
matched any verb whose `agreement` included `nori`, assuming that meant its
*primary* present/past table was dative-keyed. Adding `nori` to `etorri`'s
agreement made it match ahead of `gustatu` in `VERBS` array order, returning
`etorri`'s NOR-axis forms as a nonsensical case-frame lure. Fixed by also
requiring `object`/`recipient`/`agent` (the existing markers for "this verb's
table fixes one argument, varies the other") whenever the candidate's
agreement includes `nori` — verbs without `nori` at all (e.g. `izan`) are
unaffected by the extra check.

Regenerated `scripts/validfor-gap-baseline.json`: widening `etorri`'s
agreement narrowed `agreementsCompatible` matches against plain NOR-only
verbs (no longer considered case-compatible) and widened it against other
NOR-NORI verbs, shifting gap counts across many unrelated verb IDs as an
expected, symmetric consequence — not a sign of bad data. Reviewed
`etorri`'s own new 82 gap slots via `validfor-delta-audit.mjs --verb etorri`:
all are `etorri`'s plain NOR present/past forms leaking into other verbs'
dative-experiencer sentences (e.g. `dator` offered for "Hari hau ___" =
"this seems ___ to him"), which aren't natural completions — no `validFor`
additions made.

## 2026-06-26 — #476: `eraman`/`ekarri`'s plural-object tenses join the existing review pools, no dedicated Unit 42 lessons

`eraman`/`ekarri` gained `presentPlural`/`pastPlural`/`futurePlural` tables
(see `docs/LANGUAGE_DECISIONS.md`'s entry on the data itself — that data had
been added once already in an earlier exploratory pass and reverted as
out-of-scope, then re-added here since #476 needed it). Followed the exact
precedent set for `eduki`'s own plural-object tenses (#286/#417): folded both
verbs into the existing `nor-nork-present-plural-pool(-plural)`,
`nor-nork-past-plural-pool(-plural)`, and `nor-nork-future-plural-pool(-plural)`
review lessons in `src/data/lessons.js`, rather than adding dedicated
practice lessons or a new review unit. Reasoning: like `eduki`'s plural-object
forms, these don't teach a new grammatical relation — the `-tza-` infix rule
was already taught via the pools' other verbs — so they're reinforcement,
not new content, matching how Unit 42 itself was scoped as "no new
grammatical relation" optional flavor content. `journey.js` is untouched:
the pools aren't tied to Unit 42's `lessonIds`, they're reused across many
earlier units, so no roadmap change was needed.

## 2026-06-26 — #464: browser back during a lesson exits via history.pushState + popstate, gated by the same abandon-confirmation as the X button

Browser back during an active lesson should return to the lesson list rather
than navigate actual browser history (which could leave the app). Implemented
by pushing a history entry when `ExerciseScreen` mounts, so the back button
has something of the app's own to pop, and listening for `popstate` to call
the existing `onExit` (the same callback the in-lesson X button uses). If the
learner has unsaved progress (`correctCount > 0 || misses.length > 0`) the
listener shows the same `window.confirm` abandon prompt as the X button; on
cancel it re-pushes the history entry so back still works as an intercept
next time. The listener is registered once per lesson mount (effect with `[]`
deps) and reads `hasProgress`/`onExit`/`t` through refs kept fresh by a
separate effect, so it doesn't need to be torn down and re-registered on every
answer. Voluntary exits (X button, lesson completion) deliberately don't pop
the pushed history entry — a minor, accepted gap rather than risking a
`history.back()` race with the listener's own cleanup.

## 2026-06-26 — #469: collapsed Unit 27's 36 single-verb NOR-NORI object-axis lessons into its 12 pooled reviews

#441 widened Unit 27's `gustatu`/`iruditu`/`ahaztu` NOR-NORI object-axis pool
to include `jarraitu` and added a pooled cross-verb review per fixed NORI
value (zu/ni/hura/gu/zuek/haiek × present/past = 12 reviews), but left the
original 36 single-verb lessons in place instead of removing them, so the
unit grew to 48 lessons instead of shrinking. Since the 12 reviews already
draw from all four verbs and cover every person/tense combination the
single-verb lessons drilled, the single-verb lessons became pure
redundancy — the same situation #445 and #446 fixed for Units 33 and 32's
mood-axis pools (54 → 18). Collapsed Unit 27 the same way: deleted the 36
single-verb lessons from `lessons.js`, kept the 12 pooled reviews, and
updated `journey.js`'s Unit 27 `lessonIds`/`focus` and the
`LEARNING_JOURNEY.md` table row to match (`journeyTranslations.js`'s Unit 27
copy already described the pool generically with no lesson count, so it
needed no change). Took the issue's default full collapse (48 → 12) over its
optional ~15-lesson "keep the founding `zu`-anchors" alternative, for
consistency with how 32/33 were collapsed.

## 2026-06-25 — #448: extended `getComposedTable` to NOR-NORI flat/`byNor` and ditransitive NOR-NORI-NORK

Closed out #436's deferred scope: the NOR-NORI flat `present`/`past`/`future`
(`gustatu`/`iruditu`/`ahaztu`/`jarraitu`), NOR-NORI `presentByNor`/`pastByNor`
(same four), and ditransitive `present`/`past`/`future`
(`esan`/`eman`/`saldu-dative`/`utzi-dative`/`adierazi-dative`/
`eskatu-dative`/`galdetu-dative`) literal tables are now composed at read
time via `getComposedTable`, against new `OBJECT_AXIS_SKELETONS.dativeIzan`/
`dativeIzanByNor`/`diot` skeletons plus each verb's `byNoriPrefixes`/
`ditransitivePrefixes` field — mirroring #436's `byObjectPrefixes`/`edun`
scheme. `jario` is a deliberate, permanent exception: it's fully
irregular/suppletive (no shared skeleton row to decompose against), so it
keeps its literal table, same as #442 already assumed.

While auditing every remaining direct `verb.conjugations[tense]` access
(the same sweep #436 did, but this time catching one site #436 missed):
`scripts/validforGapAudit.mjs`'s `computeGapSlots` read conjugations
directly rather than through `getComposedTable`, so it wasn't on anyone's
radar as a "consumer" until this issue's audit found it. More importantly,
collapsing the composed verbs' `conjugations.future`/`.past` to `{}` silently
broke a *different* mechanism: the `sentences.future`/`.past` reuse-by-
reference fallback loops at the bottom of `verbs.js` gate on
`verb.conjugations.future`/`.past` being truthy, so they stopped firing for
these verbs and `esan` (among others) lost its future/past example sentences
entirely — caught by `npm test`'s validFor-gap-audit baseline test failing
with a ~383-slot drop concentrated on `esan`'s `future`/`ni` sentence. Fixed
by adding a `verbHasComposedTense(verb, tense)` helper that also checks
`byNoriPrefixes`/`ditransitivePrefixes`, used by all three fallback loops.
Once fixed, the gap-audit baseline needed no regeneration — counts came back
byte-identical to pre-#448, confirming the whole refactor is behavior-
preserving rather than a deliberate change to the gap surface. Lesson for any
future axis-generification: a verb's literal-table fields can be read by
more than the obvious lesson-generation call sites, and collapsing a table
to `{}` is observable to any code that checks "does this field exist" rather
than "what does `getComposedTable` return for this tense."

## 2026-06-25 — #446: collapsed Unit 32's 54 single-verb Ahalera (potential) NOR-NORI lessons into 18 pooled cross-verb reviews

Same shape as #441/#444/#445: `gustatu`/`iruditu`/`ahaztu`'s `potentialByNor`/
`potentialAlegiazkoaByNor`/`potentialLehenaldiaByNor` axes (#425) had 54
single-verb, recognition-only lessons (3 verbs × 3 sub-tenses × 6 NORI
values) with no pooled cross-verb review. Added
`jarraitu.potentialByNor`/`potentialAlegiazkoaByNor`/
`potentialLehenaldiaByNor` to `verbs.js` (hand-written literal tables,
byte-identical cells to `gustatu`'s with only the bare-participle prefix
swapped for `jarraitu`'s own — Ahalera takes the bare participle, not the
`-ko` future participle that Baldintza/Ondorioa use, matching `jarraitu`'s
own `past` tense's prefix) as the axis's 4th pool member, and replaced all
54 lessons with 18 pooled reviews (one per sub-tense per NORI value),
preserving `mode: 'recognition'` and each NORI value's existing
reflexive-gap `persons` array. `jario` stays excluded (thing-NOR, #442).

Same as #445, the issue's "Unit 33" label is stale (pre-#440-renumbering);
the actual current unit is Unit 32. And same as #441/#444/#445, "#436's
composer" isn't actually available for the `byNor` family yet — that's
still #448's unlanded follow-up — so `jarraitu`'s three tables here are
hand-written, not composed.

## 2026-06-25 — #445: collapsed Unit 33's 54 single-verb Baldintza/Ondorioa NOR-NORI lessons into 18 pooled cross-verb reviews

Same shape as #441 (Unit 27 present/past) and #444 (Unit 35 imperative):
`gustatu`/`iruditu`/`ahaztu`'s `baldintzaByNor`/`conditionalByNor`/
`conditionalPastByNor` axes (#425) had 54 single-verb, recognition-only
lessons (3 verbs × 3 moods × 6 NORI values) with no pooled cross-verb review.
Added `jarraitu.baldintzaByNor`/`conditionalByNor`/`conditionalPastByNor` to
`verbs.js` (hand-written literal tables, byte-identical cells to `gustatu`'s
with only the bare-future-participle prefix swapped for `jarraitu`'s own,
matching exactly how its `presentByNor`/`pastByNor`/`imperativeByNor` tables
already exist) as the axis's 4th pool member, and replaced all 54 lessons
with 18 pooled reviews (one per mood per NORI value), preserving
`mode: 'recognition'` and each NORI value's existing reflexive-gap `persons`
array. `jario` stays excluded (thing-NOR, #442).

The issue text suggested reusing "#436's composer" for `jarraitu`'s new
tables instead of hand-writing them. That's not actually available:
`getComposedTable` (`lessonLogic.js`) only composes the NOR-NORK `byObject`
axis (`presentByObject`/`pastByObject`) — extending it to the NOR-NORI
`byNor` family is explicitly tracked as its own follow-up, #448, and hasn't
landed (confirmed via `jario`'s own `animateObject` comment in `verbs.js`
and the #441/#444 entries above). Hand-writing `jarraitu`'s three tables
here keeps this issue's scope to the lesson-pooling work it actually
describes, consistent with #441/#444's prior calls not to bolt half of
#448's composer work onto an unrelated issue.

## 2026-06-25 — #440: dissolved Unit 30 ("The egin Construction"), reversing #306; its 9 verbs redistributed into base-paradigm host pools

#440 argued Unit 30's 9 verbs (`hitz-egin`, `lan-egin`, `lo-egin`, `ahaleginak-egin`, `parte-hartu`, `kontuan-hartu`, `arreta-eman`, `ados-egon`, `arriskuan-jarri`) teach no new grammatical relation — each is just an invariant noun/particle glued onto a paradigm already taught elsewhere (`nor-nork` present/past/future for the 7 `egin`/`hartu`/`eman` compounds, `egon`'s own simple-past paradigm for `ados egon`, the `izan`-auxiliary intransitive `nor` paradigm for `arriskuan jarri`). Agreed and reversed #306's decision to give them a dedicated unit (and #325/#331/#334's build-out on top of it): kept all 9 `VERBS` entries and their conjugation tables as-is, deleted Unit 30 and its 8 lessons, and renumbered every later unit down by one (31→30 ... 46→45; Refresh Gates C/D land on Units 31/43).

Redistribution, by paradigm match:
- `hitz-egin`/`lan-egin`/`lo-egin`/`ahaleginak-egin`/`parte-hartu`/`kontuan-hartu`/`arreta-eman` (all plain `nor-nork` transitives) → pooled into Unit 13's present pool (`unit-10-present(-plural)`), Unit 14's past pool (`ukan-past-pool(-plural)`), and Unit 20's universal future pool (`future-mixer-pool(-plural)`).
- `ados-egon` → new `ados-egon-present(-plural)`/`ados-egon-past(-plural)` lessons folded directly alongside `egon`'s own simple-past material in Unit 19 (its present didn't have a dedicated host lesson before; created one rather than pooling, since `egon`'s present lives all the way back in Unit 1's `izan`/`egon` pair, too far from `egon`'s own past to be a natural pool-mate) — and into Unit 20's future pool like the other 7.
- `arriskuan-jarri` → Unit 6's `nor-fodder-present(-plural)` pool and Unit 12's `izan-past-pool(-plural)`, plus Unit 20's future pool.

Two placements the issue itself flagged as needing a judgment call: `ados-egon` got new present lessons (rather than only past) because Unit 19 otherwise had no present-tense practice for it at all, and pairing it with `egon`'s past felt like the closer paradigm match than pooling it into a present-tense pool far upstream; `arriskuan-jarri` went into `nor-fodder-present(-plural)` despite that pool's existing "6-source cap" comment — `CARRIERS_PER_SESSION` already bounds session length regardless of pool size, so the cap was never a hard architectural limit, just a snapshot of the pool's size when that comment was written.

`docs/EXERCISE_ENGINE.md` wasn't touched — it doesn't mention Unit 30, and its own unit-numbering references are already stale relative to the current 46-(now 45-)unit journey (it still describes a "32-unit sequence"), a pre-existing drift out of scope here.

## 2026-06-25 — #439 split into 5 narrower issues instead of one mega-backfill; #240 closed as resolved

#439 asked to backfill `validFor` cross-verb distractor tags so every verb has them, not just 15/104. Investigating before touching any data showed two things that changed the scope: (1) the "core" 15+4 verbs already tagged (`izan, egon, ukan, nahi, jakin, joan, etorri, jan, edan, erosi, ikusi, eduki, hartu, behar, eraman, ekarri, gustatu, ahaztu`) are already thorough — the class-model second-pass audit (`--classes`) only surfaces 64 candidates total across the whole corpus, and 62 of those are false positives (`jan`<->`edan` cross-suggestions the class model can't filter, since `food-drink` doesn't distinguish solid food from drink — see `docs/OBJECT_FRAME_TAGGING.md`); (2) #240's "food-drink under-tagging" finding turns out to already be fixed in the data (`jan`/`edan`/`erosi`'s sentences already carry the full sibling set) — closed #240 as resolved.

The real remaining work is the other 89 verbs, which have *zero* `validFor` tagging at all. Rather than one issue covering all 89 (thousands of agreement-compatible-but-mostly-wrong candidate slots needing real per-sentence linguistic judgment — not a size a single PR/session can responsibly review), split by category since each needs a different method: **#454** (14 `nor`-only intransitive verbs — likely just confirming `validFor: []` is correct, same as `izan`/`egon`'s documented "all-empty classes"), **#455–#458** (52 `nor-nork` verbs, batched into 4 semantic clusters of ~9–18 verbs each so each PR stays reviewable), **#459** (17 dative-tail `nor-nori(-nork)` verbs, which need dative-role matching rather than the plain agreement-based audit `validforGapAudit.mjs` already does). 6 ids (`maite` + 5 `*-dative` table variants) have no `sentences` of their own at all, so no backfill applies to them. See `docs/DISTRACTOR_STRATEGY.md` §6 for the full breakdown.

## 2026-06-25 — #444: widened Unit 35's imperative NOR-NORI object axis to jarraitu and added pooled cross-verb reviews, the imperative twin of #441

#444 found the same gap #441 fixed on Unit 27, this time on Unit 35's `imperativeByNor` axis: `gustatu`/`iruditu`/`ahaztu` had 18 single-verb lessons (3 verbs × 6 fixed-`nori` slices: `zu`/`ni`/`hura`/`gu`/`zuek`/`haiek`) and zero pooled review. Added `jarraitu.imperativeByNor` — a literal 2D table, byte-identical to `gustatu`'s cells with only the bare-participle prefix swapped to `"jarraitu "` (same auxiliary family `presentByNor`/`pastByNor` already used) — as the axis's 4th pool member, then added one pooled review per `nori` value (`imperative-axis-review-{zu,ni,hura,gu,zuek,haiek}`, 6 lessons; this axis has no present/past split to double that to 12 the way #441's did), each pooling all four verbs via `sources`/`objectAxis`. `persons` per review copies the existing solo lessons' arrays exactly (`zu`/`zuek` drop themselves as the reflexive gap; `ni`/`gu` never appear as NOR values in this table at all). `jario` stays out (thing-NOR, #442) — same as #441.

Same composer scope call as #441: did **not** attempt to extend `getComposedTable` to the `byNor` axis here (it only handles the NOR-NORK `byObject` axis, hardcoded to `presentByObject`/`pastByObject`) — that's still #448's tracked follow-up. `jarraitu.imperativeByNor` is hand-written, matching exactly how `gustatu`/`iruditu`/`ahaztu`'s `imperativeByNor` tables already exist today.

## 2026-06-25 — `word-order` drills are now opt-in (`wordOrderSafe`), fail-closed

A user flagged a `word-order` drill marking a grammatically-valid order wrong ("Zuek herriko danborrada **goizean** entzuten duzue" — a focus/galdegaia variant of the authored "...danborrada entzuten duzue goizean"). Root cause: `word-order` was auto-generated from *any* sentence in the 4–9 word range and graded against the single authored string, but Basque's focus rule lets constituents compete for the pre-verb slot, so most object+adjunct sentences have several valid orders.

Considered (a) accepting multiple orders per sentence and (b) auditing/rewriting the pool to remove ambiguity; chose **(c) an opt-in per-sentence `wordOrderSafe: true` tag** gating `word-order` eligibility in `meetsWordOrderThreshold`. Matches the existing per-sentence `validFor` philosophy, fails closed (untagged → never a reorder drill, but all other framings unaffected), and avoids hand-authoring accepted-order lists or encoding the focus rule (too subtle to do reliably). The "is this order the only one a learner would produce" call is a language judgment, so the criterion + seed set live in `docs/LANGUAGE_DECISIONS.md`; the mechanism + tagging guidance in `docs/EXERCISE_ENGINE.md` ("Word-order safety").

Trade-off: until the tagged set grows, `word-order` questions become rare. Accepted — a vetted-but-rare drill beats a frequent-but-unfair one. A first curation pass (see `docs/LANGUAGE_DECISIONS.md`, same date) then tagged the single-complement negatives across the bank (`izan`/`egon`/`ibili`/`ukan`/`jakin`/`joan` all persons, `etorri` `ni` only); affirmatives and multi-constituent negatives stay untagged for a later pass.

## 2026-06-25 — `wordOrderSafe` affirmatives curation pass

Extended `word-order` eligibility to affirmative sentences (see `docs/LANGUAGE_DECISIONS.md` same date for the linguistic criterion). Applied via a scripted, then-reviewed filter — `type: 'periphrastic'` + `agreement` excludes `nori` + exactly four words after filling the blank — which isolates `[subject] [one complement] [participle] [aux]` clauses and excludes synthetic two-complement sentences (`eduki`), dative-reordering verbs, and five-plus-word sentences with a trailing adjunct (the danborrada ambiguity). 87 unique templates tagged across `jan`/`edan`/`erosi`/`ikusi`/`hartu`/`ari`/`nahi`/`ukatu`/`itzularazi`/`dantzarazi`; ~181 affirmative + 31 negative fillings now eligible across 17 verbs.

Used a one-off transform script (not committed) rather than ~90 hand-edits, since the targets were a precise structural set; verified the diff is purely additive (`wordOrderSafe: true` inserted, `validFor`/`baseVerb` untouched) and the `validFor` gap baseline is unchanged (the flag is orthogonal to cross-verb distractor eligibility). Note `sentences.future`/`past` are aliased to `present` by reference (and `negativeSentences.past` for the single-word-past verbs), so tagging a present template auto-covers its other-tense fillings — same two-word verb block, same four-word shape, all safe.

## 2026-06-25 — #443: widened Unit 15's NOR-NORK object axis pool from 7 to ~37 verbs via pooled-review `sources`, left `jan`/`edan`/`erosi`/`hartu`'s `animateObject` call out of scope

#443 added `byObjectPrefixes: { present, past }` (composed against `OBJECT_AXIS_SKELETONS.edun` per #436) to the ~29 remaining periphrastic transitive verbs already in `VERBS` that had no object-axis table at all (`nahi`/`behar`/`entzun`/`ulertu`/`ezagutu`/`aurkitu`/`bilatu`/`babestu`/`bultzatu`/`sustatu`/`bermatu`/`ziurtatu`/`gaitzetsi`/`sentitu`/`sumatu`/`aztertu`/`ukatu`/`bukatu`/`amaitu`/`gainditu`/`bereiztu`/`jaso`/`itxaron`/`hausnartu`/`pentsatu`/`aldarrikatu`/`plazaratu`/`batu`/`adierazi`) plus the `kontuan-hartu` compound, deriving each prefix from the verb's own already-sourced flat `present.ni`/`past.ni` form (strip the trailing `dut`/`nuen`). `nahi` has no `past` table at all (a prior deliberate gap, not new), so it only joined the present-side pool. Wired all ~30 into the `sources` of every one of Unit 15's 12 pooled `object-axis-{present,past}-review*` lessons (`generateCrossVerbQuestions`'s `objectAxis` pooling, #380, needed no changes) — no new standalone single-verb lessons, per the issue's own "one wide pool feeding reviews, not 35 separate lessons" pedagogy; the existing rotated practice lessons (#435) are untouched.

Set `animateObject: false` (#442) on 13 of the new verbs whose modeled sense is thing/abstract-only and would otherwise expose a nonsensical "[verb] you/me/us" form as a correct answer or distractor: `sustatu`/`bermatu`/`ziurtatu` (foster/guarantee/ensure — take abstract nouns, not people), `sentitu`/`hausnartu` (feel/ponder — abstract content), `ukatu`/`bukatu`/`amaitu`/`gainditu`/`bereiztu`/`aldarrikatu`/`plazaratu`/`adierazi` (deny/finish/pass/distinguish/proclaim/reveal/state — all thing-only in their primary sense here). Left the remaining 16 (+`kontuan-hartu`) at the default (animate-ok) where a personal object reads naturally: `ezagutu`/`itxaron` especially (knowing/waiting-for a person is the *primary* sense), plus `entzun`/`ulertu`/`aurkitu`/`bilatu`/`babestu`/`bultzatu`/`gaitzetsi`/`sumatu`/`aztertu`/`jaso`/`pentsatu`/`batu`/`nahi`/`behar`. Sanity-checked with `generateCrossVerbQuestions` directly (not just the test suite) that the thing-only verbs never surface a personal-`nor` cell as an option for any review.

Deliberately left **`jan`/`edan`/`erosi`/`hartu`'s** `animateObject` flag untouched, even though `docs/LANGUAGE_DECISIONS.md`'s 2026-06-24 entry and `docs/EXERCISE_ENGINE.md`'s #442 update both name this as #443's job: those four already have shipped Unit 15 standalone lessons (`hartu-object-axis-present-zuek`, `erosi-object-axis-past-zu`, `ikusi-object-axis-past-haiek`, etc.) whose `persons` arrays include personal `nor` values drawn from their composed tables — flipping any of these four to `animateObject: false` now would silently drop cells those lessons' `generateQuestions` calls expect to exist, not just filter an unused one. Resolving it requires both the linguistic call (`erosi` "buy [a person]" almost certainly should flip given `saldu`'s precedent; `jan`/`edan` "eat/drink [a person]" likely should too; `hartu` "take/fetch [a person]" is plausibly fine as-is) *and* a rewrite of those specific lessons' `persons` arrays in the same change — left as its own follow-up rather than guessing at sensitive semantics (cannibalism/trafficking readings) inside an otherwise mechanical widening PR.

