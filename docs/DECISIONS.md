# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

## 2026-06-12 — Made `deploy-worker.yml` skip (not fail) when Cloudflare secrets are unset

**Decision:** The `cloudflare/wrangler-action@v3` step now only runs `if:
secrets.CLOUDFLARE_API_TOKEN != ''`, with a sibling step emitting a
`::warning::` and skipping when it's empty, instead of letting `wrangler
deploy` hard-fail the workflow run on `main`.

**Why:** `docs/CLOUDFLARE_FEEDBACK_WORKER.md` already documents
`CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` as repo secrets the maintainer
adds manually post-merge — until that's done, every push to `main` touching
`worker/**` (or the workflow file itself) showed a failing "Deploy feedback
worker" run, which read as a broken main branch even though the app build
(CI, Pages deploy) was fine. Skipping with a warning keeps `main` green while
still surfacing that the deploy hasn't actually run yet.

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
