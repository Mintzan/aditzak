# Decisions Archive

Older entries from `docs/DECISIONS.md`, moved here to keep the active log short (see that file's header and `CLAUDE.md`'s "Decisions log" section). Newest entries at the top, same as the active log.

## 2026-07-03 — Implementation iteration 10: mascot rollout, part 5 — in-lesson error-prone callout (final placement)

Wires the last of the 8 mascot placements — the in-lesson Haserre callout §1C scoped ("a callout accent for flagging a genuinely error-prone conjugation pattern within a lesson... pedagogical, not behavioral") but never resolved to a build-ready trigger. This was explicitly a user-delegated call ("follow your intuition, we'll adjust later"), so documenting the reasoning in full rather than treating it as settled:

**Per-learner, not static.** The guide's own example ("a commonly-confused irregular form") could mean a form that's objectively tricky for everyone (would need a new "commonly confused" annotation added to `verbs.js`) or a form *this learner* has personally struggled with. Went with per-learner: the app already persists per-form miss counts across sessions (`errorStats`/`recordErrors`, `lessonLogic.js`), currently used to inject extra review questions via `getWeakSpotQuestions` — reusing that instead of inventing new static content data, and it's more genuinely "pedagogical" (reacting to this learner's actual history) than a one-size-fits-all flag would be.

**Threshold: 2+ prior misses** on that exact verb/tense/person (new `getMissCount(errorStats, verbId, tense, person)` helper, `ERROR_PRONE_THRESHOLD` in `ExerciseScreen.jsx`). A single miss is ordinary first-exposure noise; 2 is a real, repeated pattern for that learner specifically. Persists once crossed (matching how `getWeakSpotQuestions` already treats cumulative counts) rather than clearing after one correct answer, since a real callout on the third attempt of a form the learner has now gotten right would look like the app doesn't trust them.

**Where/how:** a quiet, neutral-toned banner (`border-neutral-400`/`bg-neutral-200`, not `semantic-warning` — that token already has an established "your streak/gate needs attention" meaning from iteration 4, and reusing it here would blur it into a *user*-behavior warning, exactly the framing §7 rejects) above the question prompt, shown only while the question is still active (not lingering into the feedback state, where `FeedbackBar`'s own mascot avatar already has that slot). Gated on `question.person` existing — match-pairs questions drill a whole table at once and have no single person, so they never trigger it. New `latxa-face-haserre.svg` face crop, same treatment as the other three expressions (the full `latxa-expression-haserre.svg` illustration has the same "illegible at avatar sizes" problem iterations 6/8 already found and fixed for the other three).

**This is the 8th and final mascot placement** — the whole "Mascot placement plan" (round 6) is now fully shipped across iterations 6-10.

Wires the last of the three "adopted trigger" mascot placements from §1C: an accuracy-based Nekatuta indicator in `HomeScreen.jsx`'s `ProgressTab`, next to any attempted lesson with `bestStars === 0` (under 50% correct, the same "weak" threshold iteration 8 used for the lesson-results Nekatuta band, kept consistent app-wide rather than inventing a second cutoff). Deliberately excludes never-attempted lessons — those already read as "not started," and flagging them as "needs review" would be wrong (nothing to review yet).

Rendered as a small inline hint (24px mascot icon + `progressNeedsReview` text, new i18n key in all three languages) below the lesson's score line, not a full avatar circle like the other placements — this needed its own asset-fit check at a smaller size than iterations 6-8 used (confirmed the `latxa-face-nekatuta.svg` crop stays legible down to 20-24px, chose 24px for a visible-but-quiet treatment). Copy reads "Could use a review" / "Merezi du berrikustea" / "Conviene repasarlo" — deliberately not "you're bad at this," per §7's anti-guilt rule and §1C's explicit rejection of Nekatuta's original "re-engagement nag" framing in favor of the "weak-skill" half only.

This closes out every mascot placement except the in-lesson error-prone-pattern callout (Haserre) — the one placement §1C's own trigger-adoption table left without a resolved implementation, since "what counts as error-prone" still needs a product decision (see the open item in the mascot placement plan).

## 2026-07-03 — Fixed missing `pronouns` on the NOR-NORI verbs (gustatu/iruditu/ahaztu/jarraitu/jario)

`ExerciseScreen.jsx`'s bare-form heading (`ConjugationTable`'s preview list and the plain `form` question's hero word) falls back to the raw person key (`verb.pronouns?.[person] ?? person`) whenever a verb has no `pronouns` table — fine for NOR/NOR-NORK verbs, where the raw key (`ni`/`hura`/`haiek`) already *is* the pronoun the person axis represents. But all five of the app's NOR-NORI verbs (`person` ranges over the dative NORI experiencer, not the absolutive NOR) were missing `pronouns` entirely, so their heading showed the absolutive pronoun (`haiek`) instead of the correctly-declined dative one (`haiei`) — reported via a screenshot of `gustatu-present` showing "haiek" above a "gustatzen zaie" answer. `eman` (a NOR-NORI ditransitive) had already been fixed this way (see its own `pronouns` comment, #289) but the fix was never extended to the five verbs whose *entire* person axis is NORI. Added the same `{ ni: 'Niri', zu: 'Zuri', hura: 'Hari', gu: 'Guri', zuek: 'Zuei', haiek: 'Haiei' }` table to each. None of the five have `pronounSentences`, so this only fixes the heading fallback — it does not newly enable the `pronoun`/`type-pronoun` question kinds, which need both.

## 2026-07-02 — Implementation iteration 8: mascot rollout, part 3 — lesson-results score-band mascot

Wires the mascot into `ExerciseScreen.jsx`'s `LessonResultsScreen` — the app's single biggest per-session moment, previously a generic `getEncouragement` emoji in a plain circle. New `mascotExpressionForStars(stars)` maps `computeStars`' 0-3 bands onto the placement plan's three expressions: 3 stars → Gora! (strong), 0 stars → Nekatuta (weak/tired), and **both 2 and 1 stars → Pozik** — a band-count mismatch the guide's own "strong/solid/weak" three-way language didn't resolve. Reasoned it through: 1 star is 50-79% correct, still a passing result, and routing a middling-but-passing score to a tired-looking mascot would read as discouraging, cutting against §7's anti-guilt rule — reserved Nekatuta only for the genuinely weak (<50%) band. This fully replaces the emoji circle (unlike iteration 7's feedback drawer, which explicitly keeps the icon *alongside* the avatar per §12's wording) — the placement plan's own language here was "a mascot chosen per existing band," describing a swap, not an addition. `getEncouragement`'s `icon` field is no longer read by any component but was left in place (and its test) since it's still a documented, tested part of that function's contract — removing it would mean touching `lessonLogic.js` business logic and its test suite for a UI-only iteration, out of proportion to the actual change.

**Same asset-fit problem as iteration 6, twice over:** both `latxa-expression-gora.svg` and `latxa-expression-nekatuta.svg` are full 400×400 body illustrations, same "illegible mud at avatar sizes" issue as `latxa-logo.svg`. Cropped both to the same face-only `viewBox` as `latxa-face-pozik.svg` (new assets `latxa-face-gora.svg`/`latxa-face-nekatuta.svg`) for a consistent three-face set. Nekatuta's "Z" sleep marks (upper-right of the full illustration) don't survive a circular avatar crop regardless of viewBox width — tested a wider box too, no improvement, since a circular mask cuts hardest exactly where the Z's sit — the droopy eyes and downturned eyebrows alone still read clearly as tired, so used the same crop as the other two faces rather than a one-off wider box for a detail that doesn't show up either way.

**Verification note:** confirmed all three face crops render legibly at 80px in isolation (matching iteration 6/7's asset-fit check), and confirmed the wiring is low-risk by inspection (`stars` is an existing, already-tested value the component already uses for `Stars`/`vibrateResult`/the celebration trigger — not a new computation). Attempting a full scripted lesson playthrough to screenshot each of the three live score bands didn't converge reliably in this sandbox (word-order/match-pairs question types don't respond cleanly to rapid scripted multi-click automation) — noting this honestly rather than claiming an end-to-end screenshot verification that wasn't actually achieved.

## 2026-07-02 — Implementation iteration 7: mascot rollout, part 2 — feedback-drawer mini avatars

Wires `latxa-icon-correct.svg`/`latxa-icon-incorrect.svg` into `ExerciseScreen.jsx`'s `FeedbackBar`, per §10 Swatch 3 and §12 Example 3's reconciled spec ("mascot mini-avatar sitting alongside the checkmark rather than replacing it"). Unlike iteration 6's `latxa-logo.svg` (which needed a face-crop to read at avatar sizes), these two assets are already purpose-built for small sizes — 32px viewBox, no body/legs — so wired them in as-is after confirming that at a render test rather than assuming it.

New `FeedbackMascotAvatar` (`src/components/mascot.jsx`) — a 48px circle, white background, 2px `semantic-correct`/`semantic-error` border matching the drawer's own color — sits to the left of the existing check/cross icon + headline, inside the same flex row. Also adds `animate-mascot-react` (`src/index.css`, `0.98→1.03→1.0`/200ms) — the motion §6 reserved specifically for "the mascot's own reaction" at this exact placement, distinct from the answer-option `animate-flash`/`animate-shake` which keep their own already-shipped timings.

## 2026-07-02 — Implementation iteration 6: mascot rollout, part 1 — static Pozik placements

Starts Track B (the mascot rollout, round 6's "placement plan") — the only major piece left after Track A finished in iteration 5. Ships the 4 lowest-risk placements from the plan: home tab banner (`JourneyTab`), lesson preview greeting (`LessonPreviewScreen`), Profile tab avatar (replacing `ProfileIcon`), and the onboarding screen (replacing the 🌍 emoji). All four use the same asset/component, no new state or logic.

**Real design gap found and resolved:** the guide's asset plan assumed `latxa-logo.svg` (the 400×400 full-body illustration, ground-shadow included) could be dropped directly into these "Pozik" placements. Rendering it at avatar scale (48–80px, per the actual sizes these four contexts need) makes it illegible mud — the wool texture, legs, and shadow ellipse all compress into noise. Rendered three candidates side by side (full logo scaled down / face-cropped on a solid-color circle / face-cropped on a light-tint circle) before deciding: cropped the same artwork to a face-only `viewBox` (ears, face mask, eyes, eyebrows, smile — the parts that actually read at small sizes and carry the "happy" expression), new asset `public/brand/latxa-face-pozik.svg`, on a `brand-forest-tint` circle matching the existing avatar-circle convention. Shared as `src/components/mascot.jsx`'s `MascotAvatar` (a `size` prop for the four different circle sizes) rather than repeating the `<img>`+circle markup four times.

This is a precedent for the remaining placements too: `latxa-icon-correct.svg`/`-incorrect.svg` (already 32px-viewBox mini avatars, iteration 7's feedback drawer) and the three 400px expression files (Gora!/Haserre/Nekatuta, iterations 8/9/10) need the same "does this asset actually fit this context's real pixel size" check before wiring, not an assumption that the guide's asset list is implementation-ready as-is.

## 2026-07-02 — Implementation iteration 5: neutral-scale leftovers + a missed icon (review lessons)

Finishes Track A (palette/typography/component) per the guide's own roadmap. `LessonNode`'s card border (`border-gray-200`→`border-neutral-800`) and its locked-avatar circle (`bg-gray-300 text-gray-500`→`bg-neutral-400 text-neutral-600`) pick up the §3 neutral scale, per §12 Example 2's explicit worked example — verified in a screenshot that the darker charcoal border reads as a deliberate structural signal, not a regression, consistent with the guide's "structurally precise" design language. `MATCH_TILE_STYLES.selected` (a transient "chosen but not yet graded" match-pairs state) moves from `blue` to the `neutral-800`/`neutral-200`/`neutral-900` triad the original §2 mapping table specified. `badges.jsx`'s `Stars` component moves `text-amber-400`→`text-brand-txakoli` — verified this is a slight contrast *improvement* (1.92:1 vs. 1.67:1 on white), not a regression, even though both fall short of the 4.5:1 text minimum; this is acceptable since the glyphs are decorative (always paired with an `aria-label` count, not conveying meaning through color alone). Left untouched, deliberately: every other `border-gray-200`/`text-gray-500` instance app-wide (inputs, passive display cards, nav bar, header) — none of these were named in §12 Example 2 or the §2 mapping table, and a full app-wide gray sweep was never decided by the guide, so extending this scope further would be inventing a decision rather than applying one.

Also fixed a real gap the round-5 component audit missed entirely: `lessonDisplay.js`'s `describeLesson` returns a raw `🔁` emoji for review lessons, a separate code path from the lock/gate/heart-broken icons `LessonNode` already had wired to the icon system — caught via a user screenshot of the "Errepasoa" review card. Added `RepeatIcon`/`icon-repeat.svg` (18th icon) and wired it into `LessonNode` off `lesson.review` directly rather than routing it back through `describeLesson`'s `icon` field, since a review's icon is fixed, not derived from lesson content the way the letter/emoji practice-lesson icons are — removed the now-dead `icon: '🔁'` field from `describeLesson`'s review branch accordingly.

## 2026-07-02 — Implementation iteration 4: remaining palette (grammar badges + stat pills)

Finishes `docs/VISUAL_IDENTITY.md` §2's color-mapping table — the rows iteration 3 explicitly deferred. `TYPE_META.synthetic`/`.periphrastic` (`data/verbs.js`) move off color entirely onto a value distinction (filled `neutral-900`/white vs. outlined `neutral-800` border/`neutral-900` text), resolving the `periphrastic`/`HeartsBadge` `rose` collision the round-5 audit flagged. `AGREEMENT_META.nor`/`.nori`/`.nork` reuse the three brand colors as tint-pill badges (`brand-forest`/`brand-txakoli`/`brand-clay`). The streak/points/bonus pills and the streak-repair card move to `brand-clay`/`brand-txakoli`/`semantic-warning` respectively; the two hint texts (`recognitionOnly`, `gateNeedsScore`) move to `neutral-600`/`semantic-warning`.

`brand-txakoli` (#EAB308, a bright yellow) needed a real color-math step the guide's own contrast note (§2, "generate a light tint and a readable-on-that-tint text shade... not assumed from the base-token table") called out but didn't do the math for: used as literal foreground text on its own 10%-tint background, it measures 1.8:1 — badly failing 4.5:1, unlike `brand-forest`/`brand-clay`, which are dark enough to double as their own tint-pill text. Fixed by darkening the same hue in HSL (L 47%→27%) to a new `brand-txakoli-text` token (`#856605`), verified at 5.0:1 on the tint. Added a matching `semantic-warning-hover` (lightens on hover, same pattern as `brand-forest-hover`) for the streak-repair button, and picked up its `rounded-2xl`→`rounded-xl` radius fix in passing — the only button iteration 3's green-only regex missed, since this one was orange.

Extended the ProfileTab's streak/trophy/points stat-card icons (not literally in the round-5 audit table, which only covered the header pill's exact classes) to the same `brand-clay`/`brand-txakoli-text` tokens as the header pills — same reasoning as iteration 3's language-picker extension: leaving a visually identical concept on old Tailwind hues on one screen while its twin migrates on another would read as a bug, not a deliberate scope boundary.

Synced `docs/VISUAL_IDENTITY.md`/`public/design-guide.html` status markers — iterations 1–4 are now shipped; only the neutral-scale application to card borders/locked-icon color and the full mascot rollout remain.

## 2026-07-02 — Implementation iteration 3: primary palette + button geometry

Wires `docs/VISUAL_IDENTITY.md` §2's primary-button/feedback-triad tokens and §5's 12px button radius into `src/`, following §12 Example 3 (the guide's own worked before/after for exactly this change) as the spec: `bg-green-500`/`hover:bg-green-600` primary buttons become `bg-brand-forest`/`hover:bg-brand-forest-hover` (lightens on hover per §2's note, since the base is already low-luminance), the correct/incorrect answer-option/input/match-tile/word-chip triads become `semantic-correct`/`semantic-error` (border + a computed ~10%-over-white tint background + text, all contrast-verified: 7.7:1 / 7.0:1 text-on-tint, both well past 4.5:1), and every one of those interactive elements drops from `rounded-2xl` (16px) to `rounded-xl` (12px) — cards keep their 16px per §5 (verified `LessonNode`'s own container radius stayed put; only its avatar-circle fill and the feedback/option elements changed).

Per §12 Example 3's explicit "brand-forest Continue button" (not conditionally red), the exercise `FeedbackBar`'s Continue button is now always `brand-forest` regardless of correct/incorrect — previously it flipped to red on a wrong answer, which the guide's own worked example calls out as the pre-migration state to move away from.

Extended slightly beyond §2's literal audited-file table (`ExerciseScreen.jsx`/`HomeScreen.jsx`/`badges.jsx`/`data/verbs.js`) to three more `bg-green-500`-as-"primary/selected-brand-marker" spots the audit didn't enumerate but are the same idiom: the Profile tab's language switcher, the onboarding language picker in `App.jsx` (not part of the round-5 audit scope, but visually the same selectable-pill pattern and would otherwise be left inconsistent with its Profile-tab twin), and the `ProgressBar` fill in `badges.jsx`. Added tokens for these as a light §2-style tint pattern (`brand-forest-tint`, contrast-verified 8.1:1) rather than reusing `semantic-correct` — a language selection isn't a correctness judgment, so it shouldn't borrow that token's meaning.

Not touched this iteration (deferred to iteration 4, "remaining palette"): `TYPE_META`/`AGREEMENT_META` grammar badges, the streak/points/bonus stat pills, the `MATCH_TILE_STYLES.selected` neutral-scale change, and any `neutral-*` scale application (locked-lesson icon color, card borders) — all still on their pre-migration Tailwind hues.

## 2026-07-02 — Implementation iteration 2: wired the 17-icon system into real components

`docs/VISUAL_IDENTITY.md` §11 documented the icon system (round 7) without
touching `src/`. This iteration builds `src/components/icons.jsx` (the
17 icons as React components, same SVG paths as `public/brand/icons/*.svg`,
`stroke="currentColor"` so callers control color via className) and wires
every documented emoji touchpoint in `badges.jsx`, `ExerciseScreen.jsx`, and
`HomeScreen.jsx` over to it, using each spot's *existing* Tailwind color
(e.g. `text-rose-400` for the heart-broken states, `text-sky-600`/`-700` for
points) rather than introducing new tokens — consistent with the
color-scoping decision from round 7 that decouples the icon rollout from the
still-unstarted palette migration.

Left untouched, deliberately: the plain `✕`/`×` dismiss glyphs (lesson
preview exit, modal close buttons) — never part of the 17-icon mapping
table, since they're navigational punctuation, not iconography. Also
untouched: the celebratory streak-encouragement emoji set in
`lessonLogic.js` (🎉🌟🏆👏😄✨💪👍📈🌱🔄🧭🔥⚡🚀) and the header's plain `★`
stars pill — neither is in the documented mapping table either.

## 2026-07-02 — Round 8: added worked before/after examples to the visual identity guide

Every prior round documented individual decisions in isolation (a color
token here, a radius change there, an icon mapping table). Added §12 to
`docs/VISUAL_IDENTITY.md` showing what several of them look like applied
*together* to three real, currently-shipped components — the home header
pills, `LessonNode` (lesson card), and the `AnswerOption`/`FeedbackBar`
exercise feedback — rendered and verified in a headless browser, not just
described.

Deliberately included what does *not* change alongside what does: the
header's stars pill and hearts pill are correctly left untouched in the
"after" state (★ is a plain Unicode glyph never in §11's icon-system scope;
`accent-hearts` was already decided to stay as-is in §2), and lesson cards
keep their existing 16px radius since §5 only drops *buttons* to 12px, not
cards. Showing the "no change" cases alongside the "change" cases was a
deliberate choice — a before/after that only ever shows things changing
would misrepresent how narrowly some of these decisions were actually
scoped.

**Still illustrative, not implemented** — same status as every other
asset-complete-but-uncoded section (§10, §11): no `src/` file was touched.

## 2026-07-02 — Round 7: proposed a 17-icon system to replace emoji (docs/assets only)

Revisits round 5's "emoji stay app-wide" call. That decision was reasonable
when the mascot was confined to two feedback-drawer micro-moments; with the
mascot now central (round 6, nine placements across five screens), bare
emoji sitting next to it reads as more inconsistent than it did before.

Designed and verified (rendered in a headless browser, including at 18px —
the actual inline size several usages need) a 17-icon set covering every
emoji touchpoint the round-5 audit found, plus one it missed
(`FeedbackBar`'s plain-text ✓/✕ status glyphs). System: 24×24 viewBox, 2px
stroke (2.5px for check/cross), rounded caps/joins, `stroke="currentColor"`
so color is set by whatever embeds the icon rather than baked into the
asset. Added `icon-heart-broken.svg` — a heart with a jagged crack — since
the existing four expressions/mini-avatars had no "depleted hearts" state
to reuse for 💔's two meanings (locked lesson, out of hearts).

**Color scoping decision, made explicitly rather than left ambiguous:**
icons pick up whatever Tailwind color is already present at each usage site
(e.g. the streak icon uses the same orange the streak pill already does),
not the brand tokens from §2. Track A (the full brand-palette migration)
is still separate and unimplemented — wiring icons to brand hex values now
would create visible mismatches (a brand-clay terracotta icon inside a
still-orange Tailwind pill) until Track A actually ships. Icons and the
palette migration are independent tracks that happen to both be about
color; keeping them decoupled avoids forcing Track A's timeline just to
ship icons.

**Deliberately not decided or implemented here**: the actual component
wiring. Assets exist at `public/brand/icons/*.svg` (17 files) and the full
emoji→icon→color→component mapping is documented in
`docs/VISUAL_IDENTITY.md` §11, but no `src/` file has been touched —
touching `HomeScreen.jsx`/`ExerciseScreen.jsx`/`badges.jsx` is real
engineering work for a separate pass, not implied by documenting the
proposal. The doc also recommends the implementation shape (a shared
`src/components/icons.jsx` of small SVG-wrapper components, not `<img>`
tags) without building it.

## 2026-07-02 — Round 6: mascot system greenlit as a central part of the app

Round 5 explicitly left one question unresolved — whether Aditzak becomes a
mascot-driven app at all — on the grounds that it's a product-scope call a
component audit can't make. Product decision: **yes, and centrally**, not
confined to the two feedback-drawer micro-moments the guide had originally
scoped.

Turned "central" into a concrete, named placement plan rather than leaving
it directional — nine placements across five screens, all using the four
expressions and two mini-avatars already built and reconciled onto the
canonical palette in round 4, so no new artwork is required to execute it:
Home tab header and Profile tab avatar (currently a plain 🧑‍🎓 emoji) get
Pozik; the lesson preview screen (currently no character at all) gets a
greeting Pozik; the lesson results screen (currently a generic emoji in a
circle, the app's single biggest per-session moment) maps Gora!/Pozik/
Nekatuta onto the score bands `getEncouragement`/`computeStars` already
compute, with the weak-result case deliberately landing on Nekatuta's
established "let's review together" meaning rather than a scolding face, to
stay inside the anti-guilt voice rule (§7); onboarding/language-selection
(not previously in scope) gets a first-impression Pozik; the three
already-scoped micro-moments (feedback drawer, in-lesson error-pattern
callout, Progress-tab low-accuracy indicator) carry over unchanged.

Un-hedged every place the guide had written mascot-dependent specs as
conditional now that the yes/no call is made: §6's mascot-reaction motion
timing, §8's dual-indicator rule, and §1C's icon-system scope (emoji still
stay the default everywhere *outside* the nine named placements — this
isn't a wholesale icon-system replacement, just a much bigger mascot
footprint than before).

**Deliberately not decided here**: the actual implementation (new avatar
components across five screens, wiring the results-screen score-band
mapping) — that's real engineering work belonging to a future session, not
implied by settling the scope question. `docs/VISUAL_IDENTITY.md`'s
"Recommended path" now describes two independent tracks (palette/component
work; mascot placement work) that can ship in either order.

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

## 2026-06-25 — #441: widened Unit 27's NOR-NORI object axis to jarraitu and added pooled cross-verb reviews, without building #436's axis-generic composer for this axis

#441 found the same "concrete verbs, no pool" gap #436 was originally scoped to fix on the NOR-NORK side, but on the NOR-NORI `byNor` axis (Unit 27): `gustatu`/`iruditu`/`ahaztu` had 36 single-verb lessons across six fixed-`nori` slices and zero pooled review, because `generateCrossVerbQuestions`'s `objectAxis` pooling support (#380) postdated this axis's lessons. Added `jarraitu.presentByNor`/`pastByNor` (literal 2D tables, byte-identical to `gustatu`'s cells with only the participle prefix swapped — same auxiliary family) to make it a 4th pool member, and one pooled review lesson per `nori` value per tense (`nor-axis-{present,past}-review-{zu,ni,hura,gu,zuek,haiek}`, 12 total), mixing all four verbs via `sources`/`objectAxis`. `jario` stays out (thing-NOR, #442).

Deliberately did **not** attempt #436's "stop storing redundant tables, compose at runtime" treatment here, even though #441's issue body asked for it: `getComposedTable` (`lessonLogic.js`) only composes the NOR-NORK `byObject` axis today (`tense === 'presentByObject' | 'pastByObject'` is hardcoded) — extending it to also handle `byNor` is real composer work, already tracked as its own family in #448 ("axis-generic runtime composition for the remaining 3 table families"). Bolting that onto this issue risked the same "half-finished composer" outcome #436 itself called out and avoided. `jarraitu`'s tables are hand-written literal tables, matching exactly how `gustatu`/`iruditu`/`ahaztu`'s `byNor` tables already exist today — no regression, just consistent with the current (pre-#448) state of the world. `jario`'s `animateObject: false` flag (#442) still has no live effect on this axis until #448 lands; it's already set for forward-compatibility.

## 2026-06-24 — #442: added `animateObject` to gate personal-object cells out of a composed axis table, but didn't flip it on any verb that's actually wired into a shipped lesson

#442 split out of #436 to add the `animateObject` (default `true`) flag: when `false`, `getComposedTable` (`lessonLogic.js`) omits a verb's personal (`ni`/`hi`/`gu`/`zu`/`zuek`) `nor` cells from its composed `presentByObject`/`pastByObject` table, so a thing-only verb's object axis can't produce or offer a "[verb] you/me/us" form. Marked `false` on `irakurri`/`idatzi`/`argudiatu`/`ondorioztatu`/`planteatu`/`borobildu`/`saldu`/`galdu` (unambiguously thing-only/metaphor) and `jario` (its future NOR-NORI subject slot) — every one of these is a no-op today, since none of them has a composed axis table yet.

Deliberately did **not** mark `jan`/`edan` `false`, even though #442's issue body names them as the intended reclassification — both already have a composed `presentByObject`/`pastByObject` table (#436) wired into shipped Unit 15 lessons (`edan-object-axis-present-zu`, `jan-object-axis-past-gu`, the pooled `object-axis-*-review*` lessons, `src/data/lessons.js`) that drill exactly the personal-`nor` cells this flag would remove. Flipping it now would silently orphan those lessons (`journey.test.js` would fail on a now-missing `person`) rather than just gate a still-unused table. Left to #443, which reworks Unit 15's pool anyway and can apply the flag while rewiring lesson coverage in the same pass. Similarly left `hartu`/`erosi` unset — also already composed and lesson-wired, and a genuinely borderline call per the issue ("hartu likely true, erosi likely false") that needs native-speaker confirmation, not a guess; tracked as an open question in `docs/LANGUAGE_DECISIONS.md`.

## 2026-06-24 — #436: composed the NOR-NORK by-object tables (`presentByObject`/`pastByObject`) from a shared skeleton instead of storing them per verb

`ukan`/`maite`/`ikusi`/`jan`/`edan`/`erosi`/`hartu`'s `presentByObject`/`pastByObject` 2D tables (#346/#347/#348/#378/#379) were each just `<per-verb prefix> + ukan`'s own cell, repeated verb-by-verb (7 × 36 cells). Replaced with one shared skeleton (`OBJECT_AXIS_SKELETONS.edun` in `data/verbs.js`, present + past) plus each verb's `byObjectPrefixes: { present, past }` (`''`/`''` for `ukan` itself, `'maite '`/`'maite '` for `maite`, `'ikusten '`/`'ikusi '` for `ikusi`, etc.), composed at read time by `getComposedTable(verb, tense)` (`lessonLogic.js`).

Routed every choke point that used to read `verb.conjugations[tense]` directly for these two tenses — `generateQuestions`, `collectCrossSourceCandidates`, `getDativeOvergenerationLure`, `hasAmbiguousTypedForm`, plus the `journey.test.js`/`logic.test.js` cross-checks — through `getComposedTable` instead, so the 2D-vs-composed distinction never leaks past this one function. Behavior-preserving by construction: the existing #347/#348/#378/#379 tests (already asserting `presentByObject`/`pastByObject` cells match `<prefix> + ukan`'s cell) were rewritten against `getComposedTable`'s output rather than the now-removed literal fields, so they still guard the composition.

Scoped to just this one table family (NOR-NORK by-object) — the issue's follow-up comments asked for the same treatment on the NOR-NORI flat tables (Units 25/26), the NOR-NORI `byNor` 2D tables, and the ditransitive `diot`-family tables (Units 28/29), but folding all four into one PR risked a half-finished composer; left those three as follow-up work once each is actually needed.

## 2026-06-24 — #434: synced the feedback worker's `diagnostics` validator with `buildFlagDiagnostics`, added a cross-package regression test

The worker's `isValidDiagnostics` (`worker/src/index.js`) was written for the original sentence/options/items question kinds and never updated as `buildFlagDiagnostics` (`src/lessonLogic.js`) grew `source`/`pairs`/`tokens`/`punctuation` for `reading`/`match-pairs`/`word-order`, so flagging those question kinds 400'd. Fixed by widening `QUESTION_KEYS` and adding type checks for the new sub-fields, and by treating `verbId`/`tense`/`person` as nullable (like the existing `userAnswer`) instead of required strings, since `match-pairs` has no single `person` and `reading` has none of the three.

To stop the two from drifting apart silently again, exported `isValidDiagnostics` from the worker and added `src/feedbackWorkerDiagnostics.test.js`, which runs one fixture question per kind through `buildFlagDiagnostics` and asserts the worker accepts the result — even though `worker/` is its own package with no test runner of its own, importing its module from a `src/` Vitest test is enough to catch the next drift, and avoids standing up a whole second test setup for one validator function.

## 2026-06-24 — #435: widened Unit 15's reverse-direction object-axis block from `ukan`/`maite`-only to all seven object-axis verbs

#416 had extended Unit 15's reverse-direction block (NORK fixed at `hura`/`gu`/`zu`/`zuek`/`haiek`, drilling forms like `nau`/`gaitu`/`naute`) but deliberately scoped it to `ukan`/`maite` only, leaving 20 of those 26 lessons as a straight `ukan`/`maite` alternation — `ikusi`/`jan`/`edan`/`erosi`/`hartu` (which already had the same `presentByObject`/`pastByObject` table shape since #378/#379) appeared only inside the `fixed: 'ni'` block's pooled reviews, never as standalone practice.

Resolved by, per remaining NORK value: replacing the fixed `ukan`-present + `maite`-present + `ukan`-past + `maite`-past four-lesson shape with **one rotated verb per tense** (cycling through all seven object-axis verbs across the ten present/past slots — `ukan`/`maite` twice each, `ikusi` twice, `jan`/`edan`/`erosi`/`hartu` once each — so the headline verbs stay most frequent without dominating), plus **a pooled present/past review per NORK value** spanning all seven verbs, mirroring what #381 already did for `fixed: 'ni'`. Net lesson count for the block is unchanged (20 in, 20 out: 10 practice + 10 review), so Unit 15 stays roughly its original size while gaining real lexical variety. No engine changes needed — `generateCrossVerbQuestions`'s `objectAxis` pooling already supports one shared `fixed` per review, which is all this needed (the "mixed-fixed-person" pooling #416/#419/#424 flagged as unbuilt is a different, harder feature this didn't require). #436 tracks widening the fodder pool itself to verbs beyond these seven.

## 2026-06-24 — Extended the NOR-number object pools (Units 13/14 + future) with 8 long-tail transitive verbs

Fixing the plural-object agreement bug (see `docs/LANGUAGE_DECISIONS.md`, same date) added `presentPlural`/`pastPlural`/`futurePlural` tables to `egin`/`irakurri`/`idatzi`/`ikasi`/`entzun`/`utzi`/`bilatu`/`saldu`. Rather than leave those tables as dead data (reachable only as object-number distractor lures via `getObjectNumberLure`), wired all 8 into the existing object-number pools — `nor-nork-{present,past,future}-plural-pool` and their `-plural` siblings — so the new `ditut`/`nituen` forms are actually drilled.

- This grows the object-number core from the curated 7 verbs (`ukan`/`jan`/`edan`/`erosi`/`hartu`/`ikusi`/`eduki`) to 15. Accepted: these 8 already appear in the singular `unit-10-present` pool (~30 verbs), so the asymmetry of teaching their singular forms but not their plural ones was the odd state, not the fix. No `journey.js` change needed — the pools' `lessonIds` are unchanged, only their `sources` grew, so the trio cross-check (`journey.test.js`) still holds.
- The relocated plural-object sentences make these 8 verbs' plural pool lessons sentence-bearing (e.g. "Guk baserriko barazkiak plazan ___" → `saltzen ditugu`), unlike `jan`/`erosi`'s table-only plural lessons — fine, since the engine already supports plural-tense sentence buckets (`ukan`/`nahi`/`esan`/`gustatu` have them). Partial singular buckets (some persons now sentence-less) degrade gracefully to bare-form questions per `rollQuestionKind`.
- Regenerated `scripts/validfor-gap-baseline.json`: the new plural forms add cross-verb gap slots of the same kind as these verbs' existing untagged singular gaps (project policy tags only a core set, never `saldu`/`utzi`/...), so no new `validFor` entries — counts-only baseline refresh.

## 2026-06-24 — #370: implemented Units 42–44 (causative `-arazi`), four new standalone `VERBS` entries, zero new data shapes

Per the prior research pass (#430, `docs/CONJUGATIONS.md` §17), causatives need no new shape — each is just another `type: 'periphrastic'` entry whose participle is `[radical]+arazi`.

- **`itzularazi`/`dantzarazi`** (Unit 42, `nor`→`nor-nork`): `object: 'haiek'` (the causee — "mendizaleak"/"umeak" — stays absolutive but plural in both citation sentences from `VERB_COVERAGE.md` §6), `person` varies over `nork` (the causer). Plain `ukan`-plural-object paradigm (`ditu`-family), no dative.
- **`janarazi`/`idatzarazi`** (Unit 43, `nor-nork`→`nor-nori-nork`): `recipient: 'haiek'` (the causee — "umeei"/"ikasleei" — is plural and dative in both citation sentences), `person` varies over `nork`, mirroring `esan`'s `recipient: 'hura'` convention (#147) one dative-number step up. `janarazi`'s `nor` (babarrunak) is plural, so it rides the `-zki-`-infixed (`dizkie`-family) row; `idatzarazi`'s `nor` (hori) is singular, so it rides the plain `die`-family row — verified cell-for-cell against both citation sentences (`janarazi zizkien`, `idatzarazi die`).
- `journey.js`'s teaser `payload` strings for `dantzarazi`/`idatzarazi` read as present-perfect (bare perfective participle + present aux, e.g. "idatzarazi die") rather than the habitual-present shape ("idatzarazten die") this app's `present` tables always use elsewhere (`jan`/`idatzi`/`itzularazi`). Treated the teaser strings as loose illustrative gloss rather than literal table citations, and built `present` using the established imperfective-participle convention for internal consistency — flagged in both verbs' `conjugations.past` comments.
- **Unit 44 (gate)** scoped down from its `journey.js`/i18n teaser's "recombines with future, conditional, and imperative" to present/past/future only, mirroring Unit 22 gate's own scope (no mood-recombination beyond the three core tenses) — conditional/imperative causative forms exist in principle (§17.4) but need their own tables, out of scope here. Gate gets dedicated `unit-44-review-1`/`-2` lessons (not a reuse of Units 42/43's own review lesson ids) since `journey.test.js` requires every `LESSONS` id referenced exactly once, matching Unit 22's own `unit-20-review-*` precedent.
- Regenerated `scripts/validfor-gap-baseline.json` after manually auditing every new gap slot the four verbs create against existing pool verbs (`ukan`, `nahi`, `esan`, `eman`, ...) via `validfor-delta-audit.mjs` — none are natural completions (different lexical content despite matching agreement), so `validFor: []` throughout is correct and the larger baseline reflects genuinely-unfillable gaps, not an oversight.
- Closes #370 (closed early by the repo owner ahead of this implementation landing) and the last open sub-issue of epic #182.

## 2026-06-24 — #369: implemented Unit 36 (Subjuntiboa) as data-only, present-tense, 3rd-person-restricted

Per #406's earlier mechanic decision, the subjunctive needed no new engine `kind` — just a `subjunctivePresent` tense key plus `sentences`/`conjugations` entries, like every other tense.

- **izan**/**ukan** (NOR / NOR-NORK): `sentences`-based in-construction production over a `nahi izan` ("Nahi dut ... ___") frame, restricted to `persons: ['hura', 'haiek']` per the journey's stated "3rd-person... production" scope — `ni`/`zu`/`gu`/`zuek` forms are still in `conjugations` for completeness/cross-referencing but have no lesson.
- **gustatu**/**iruditu**/**ahaztu** (dative) and **esan**/**eman** (ditransitive): recognition-only (`mode: 'recognition'`, pooled per family into `unit-36-dative-review`/`unit-36-ditransitive-review`), no `sentences` — matches the journey's "dative/ditransitive recognition-only" scope and the existing precedent for these verbs' other mood tables (potential/baldintza/conditional).
- Forms sourced from `CONJUGATIONS.md` §2-4/§16.1/§16.3, verified cell-for-cell against its citation tables. `gustatu`/`iruditu`/`ahaztu` use the full participle prefix (`gustatu dakion`, not the doc's literal bare-radical `gusta dakion`), matching #364's precedent for `imperativeByNor` rather than §16.3's general Radical/Bare-Stem Rule, for consistency with this codebase's existing tables. `esan`/`eman` use the bare auxiliary with no prefix, matching their existing `potential`/`baldintza`/`conditional` convention.
- Added the missing `TENSE_META.subjunctivePresent` entry (+ `tenseSubjunctivePresent` i18n key in all three locales) — omitting it crashes `describeLesson` for any lesson list touching the tense, which is what the 45 failing tests during development turned out to be.

## 2026-06-23 — #425: drilled `gustatu`/`iruditu`/`ahaztu`'s Baldintza/Ondorioa/Ahalera/Agintera object-axis tables, all zero-lesson before now, with recognition-only mood lessons

Unlike #419's gap (17 of 18 NORI rows undrilled, but every row at least reachable through a `fixed: 'zu'`-adjacent table elsewhere), the six mood tables here (`baldintzaByNor`, `conditionalByNor`, `conditionalPastByNor`, `potentialByNor`, `potentialAlegiazkoaByNor`, `potentialLehenaldiaByNor`) had **no** lessons at any NORI value, and `imperativeByNor` only had the single `fixed: 'zu'` lesson from #364.

- Added 108 new lessons (3 verbs × 6 tables × 6 NORI values), each `objectAxis: { vary: 'nor', fixed: <person> }` with `mode: 'recognition'` — these tables structurally restrict NOR to `{ni,zu,gu,zuek}` (nothing pleases/seems-to/forgets itself in 3rd person), and use literal-diagonal-only exclusion (e.g. `fixed: 'zu'` excludes only NOR=`zu`, not `zuek`, unlike the NOR-NORK object-axis tables' broader same-person-category exclusion). `mode: 'recognition'` fulfills Units 33/34's focus text, which already flagged "recognition-only for the dative paradigms" as deferred scope from #148.
- Added 15 more lessons for `imperativeByNor`'s remaining NORI values (`ni`/`hura`/`gu`/`zuek`/`haiek` — `zu` already existed from #364), matching the existing `gustatu-imperative-axis`-style lessons with no `mode` override, since that precedent treats imperative production as in-scope rather than recognition-only. `imperativeByNor` uniquely allows `hura`/`haiek` as NOR (no flat `imperative` table to be redundant with) while excluding `ni`/`gu` (can't command something to please yourself/us).
- No pooled cross-verb review added, per #416/#419/#424's precedent — `generateCrossVerbQuestions` doesn't support multi-fixed-value `objectAxis` pooling.
- Generated the 123 lesson entries and their `journey.js` wiring programmatically (Node scripts against the live `verbs.js` shapes, then spliced in) rather than hand-typing each one, given the scale — reviewed via lint and the full `journey.test.js`/`logic.test.js`/`shareUtils.test.js` cross-check rather than line-by-line authorship.

## 2026-06-23 — #424: extended `ukan`'s Baldintza/Ondorioa/Ahalera object-axis tables to every NORK value, mirroring #416's `presentByObject`/`pastByObject` extension

`ukan`'s six mood/tense object-axis tables (`potentialByObject`, `potentialAlegiazkoaByObject`, `potentialLehenaldiaByObject`, `baldintzaByObject`, `conditionalByObject`, `conditionalPastByObject`) each carry a full `ni`/`hura`/`gu`/`zu`/`zuek`/`haiek` NORK row, but every lesson touching them only ever fixed `objectAxis.fixed: 'ni'` — forms like `bagintuzue` ("if you all had us") existed in the data with no question able to ask for them.

- Added one practice lesson per remaining NORK value (`hura`/`gu`/`zu`/`zuek`/`haiek`) for each of the six tables — 30 new lessons total — each `persons` list matching that NORK row's actual NOR keys (the reflexive-gap pattern — `nork: 'ni'`/`'gu'` excludes NOR=`ni`/`gu`; `nork: 'zu'`/`'zuek'` excludes NOR=`zu`/`zuek` — is identical across all six tables, since they share `presentByObject`/`pastByObject`'s table shape).
- Followed #416's precedent exactly: no new pooled review was added (`generateCrossVerbQuestions` has no `objectAxis` pooling support beyond a single fixed value per review, and there's no other verb sharing this exact table shape to pool against) — just the individual practice lessons, wired into Units 33/34's existing `lessonIds`.
- `potentialByObject`/`potentialAlegiazkoaByObject`/`potentialLehenaldiaByObject` already had `fixed: 'ni'` lessons by the time this issue was picked up (added between #424 being filed and worked) — only the NORK extension was missing, not the base lessons the issue description assumed were absent.

## 2026-06-23 — #423: collapsed the old Units 20-21 (Future) into one pooled unit; trimmed `joan`'s redundant table, kept `ukan`'s as the suppletive callout

The old two-unit Future stage taught the `-ko`/`-go` rule on a three-verb core (`izan`/`ukan`/`joan`) in Unit 20, then re-drilled it across the rest of the fodder via three curated themed mixer pairs + a capstone in Unit 21 — a curated handful, not the full pool. Collapsed both into one Unit 20:

- **Trimmed `joan-future`/`joan-future-plural`** from the lesson list — `joan` is `nor`-agreement exactly like `izan`, so its own dedicated future table taught nothing `izan`'s didn't already.
- **Kept `ukan-future`/`ukan-future-plural`** as their own dedicated lessons, specifically *because* `ukan`'s future (`izango`) is borrowed wholesale from `izan` rather than derived from `ukan`'s own stem — drilling it on its own keeps that suppletive exception visible.
- **Replaced the three mixer pairs + capstone with one pooled review** (`future-mixer-pool` + plural sibling) whose `sources` spans every regular fodder verb's `future` table not already covered elsewhere (~58 verbs, including the existing 14 named verbs — no reason to exclude them from the same pool). `CARRIERS_PER_SESSION = 4` already handles pools this large with zero engine changes (random 4-carrier sample per play, rotating over repeated plays).
- **Added a `suffixChoice: true` flag** on the pooled review, consumed by a new `generateSuffixChoiceQuestions` (`lessonLogic.js`) producing a handful of `kind: 'suffix-choice'` questions that isolate the "pick `-ko` or `-go`" decision from full conjugation production. The rule is derived from `verb.id` (ends in `n` → `-go`, else → `-ko`) rather than stored data. `ukan` is excluded from this pool specifically — the mechanical rule would coincidentally-but-wrongly predict `-go` for it — while still being drilled normally for its actual conjugation.
- **`*-dative` variants, the agentive covert-dative set, and invariant-noun constructions** stay out of scope, as before.
- **Renumbering cascade**: every unit from the old Unit 22 onward shifts down by one (old 22 → new 21, ... old 47 → new 46), following the #137 precedent — lesson `id` strings are untouched; only `number:`/translation-key fields and prose move. Updated `journey.js`, `lessons.js`, `journeyTranslations.js`, and `LEARNING_JOURNEY.md` accordingly; `journey.js`'s header comment got an appended (not rewritten) clause documenting the shift, same append-only convention used for #296/#307/#350/#359.

## 2026-06-22 — #417: drilled the dead `futurePlural`/`pastPlural` data with new pool/lesson entries, no scope cuts needed

Two unrelated unused-data gaps in the same issue: (1) `futurePlural` (`izango ditut` vs `izango dut`) existed in `verbs.js` for `ukan`/`jan`/`edan`/`erosi`/`hartu`/`ikusi`/`eduki`/`nahi` but no lesson ever selected it — `nor-nork-present-plural-pool`/`nor-nork-past-plural-pool` had the present/past tenses covered but no future counterpart; (2) `esan`/`eman`'s `pastPlural` (`esan nizkion` vs `esan nion`) existed but only their `presentPlural` got a lesson.

Fixed both directly, no scope cut: added `nor-nork-future-plural-pool`/`-plural` (mirrors the present/past pools exactly, same 8-verb-eligible list plus `nahi` — `nahi`'s own singular `future` table is 3-person-only, per Unit 18's "stay 3-person" comment, but its `futurePlural` table was sourced with the full 6 persons, so it's no different from the rest here) into Unit 20 (`izan/ukan/joan — The Future Rule`, the unit that introduces `ukan-future`, same placement logic as Units 13/14 hosting the present/past plural pools), and added `esan-past-plural`/`eman-past-plural` into Unit 30 (`NOR-NORI-NORK Past & Future`, alongside `esan-past`/`eman-past`).

These are non-`review` pooled lessons (no `review: true`), so they go through `App.jsx`'s plain per-source `generateQuestions` path, not `generateCrossVerbQuestions` — verified via a throwaway script that all 24 expected (8 verbs × 3 persons) `futurePlural` cells are reachable, and that `esan`/`eman`'s `pastPlural` lessons reach all 6/4 persons respectively.

## 2026-06-22 — #419: drill the NORI≠zu object-axis cells, extending Unit 28 rather than opening a new unit, all three NOR-NORI verbs

The direct NOR-NORI analogue of #416 below: `gustatu`/`iruditu`/`ahaztu`'s `presentByNor`/`pastByNor` tables (`{ [nori]: { [nor]: form } }`) held 17 cells — every NORI row other than `zu` (`ni`/`hura`/`gu`/`zuek`/`haiek`) — that Unit 28's lessons never exposed, since all of them fix `objectAxis: { vary: 'nor', fixed: 'zu' }`.

Same two calls as #416, for consistency: **extended Unit 28 in place** (36 new `lessonIds`, one present+past pair per remaining NORI value × all three verbs) rather than opening a new unit, per the #286 precedent. Unlike #416's `ukan`/`maite` scope cut, did all three NOR-NORI verbs here since there are only three (no `ikusi`-style sibling family to defer) — but still **no pooled cross-verb review**, same reasoning as #416: `generateCrossVerbQuestions`'s `objectAxis` pooling expects one shared fixed value across sources, and pooling across different NORI rows is the same unbuilt "mixed-fixed-person" design noted there. Left for a future issue if wanted.

## 2026-06-22 — #416: drill the NORK≠ni object-axis cells, extending Unit 15 rather than opening a new unit, scoped to `ukan`/`maite`

`ukan`/`maite`'s `presentByObject`/`pastByObject` 2D tables (`{ [nork]: { [nor]: form } }`) already held 19 cells — every NORK row other than `ni` (`hura`/`gu`/`zu`/`zuek`/`haiek`) — that no lesson ever exposed: Unit 15's four practice lessons all fix `nork: 'ni'`, so forms like `nau`/`gaitu`/`naute` ("someone/something acts on me/us") were undrillable even though the data already supported them via `objectAxis: { vary: 'nor', fixed }`.

**Placement:** extended Unit 15 in place (20 new `lessonIds`, one present+past pair per remaining NORK value × `ukan`/`maite`) instead of opening a new unit, following the same #286 "extend the existing unit, don't add a new one" precedent #381 already used when it added the pooled `fixed: 'ni'` review to this same unit — this is more of the same grammatical relation (the NOR-NORK object axis), not a new one.

**Scope cut:** deliberately limited to `ukan`/`maite` for this pass, mirroring Unit 15's *original* four-lesson shape (before #378-#381 layered in `ikusi`/`jan`/`edan`/`erosi`/`hartu` and the pooled cross-verb review as separate follow-up issues). No pooled review across the new NORK values was added either — `generateCrossVerbQuestions`'s `objectAxis` pooling expects every source to share one fixed value, and mixing different NORK rows into one review is a different (currently unbuilt) "mixed-fixed-person" design, not a quick addition. Extending to the other five verbs, and/or building that pooled-mixed review, is left for a future issue exactly as `#378`-`#381` did incrementally for `fixed: 'ni'`.

## 2026-06-22 — #410/#411: periphrastic `ahal`/`ezin` get two `VERBS` entries each (izan-carrier + ukan-carrier), not one

`ahal` ("can") and its negation `ezin` ("can't") were entirely missing from
the implemented app even though Unit 34's own Focus text advertised `ahal
izan` and `VERB_COVERAGE.md` §5 flagged `ezin` as high-priority. Added four
dedicated `VERBS` entries — `ahal-izan`, `ahal-ukan`, `ezin-izan`,
`ezin-ukan` — following #306's "dedicated entries over sentences-layered-
on-host" precedent.

**Why two entries per particle, not one:** `nahi`/`behar` always take `ukan`
regardless of the embedded verb's own transitivity (`joan nahi dut`, not
`joan nahi naiz`). `ahal`/`ezin` don't get that exemption — they're
auxiliary-*transparent*, taking whatever auxiliary the carrier verb itself
would pick (`izan` for an intransitive carrier: "etorri ahal naiz"; `ukan`
for a transitive one: "esan ahal dut"). A single invariant-particle entry
can't show both halves of that contrast, so each particle is split exactly
the way Unit 34 already splits `izan-potential`/`ukan-potential`.

**Data shape:** flat conjugation tables (`ahal naiz`, `ezin dut`, ...), no
infinitive baked in — same shape as `behar`'s entry. The carrier verb's
infinitive lives only in the sentence text (`'Ni gaur etxera joan ___.'`),
mirroring `behar`'s infinitive-complement sentences (#267/#288) exactly.
`validFor: []` throughout: ran `scripts/validfor-delta-audit.mjs` against
all four new ids and reviewed every flagged gap by hand — all are false
positives, either because the host sentence has no infinitive complement
for `ahal`/`ezin` to attach to (every plain noun-object/predicate-nominal
sentence in the corpus), or because the candidate's auxiliary family
doesn't match the carrier verb's transitivity (e.g. `ezin-ukan`'s "ezin
dut" can't complete an intransitive `joan`/`etorri` sentence, which needs
the izan-shaped "ezin naiz"). Regenerated `scripts/validfor-gap-baseline.json`
accordingly.

**Placement:** appended to Unit 34 (already `available`) rather than a new
unit — four new lessons (`ahal-izan-present`, `ahal-ukan-present`,
`ezin-izan-present`, `ezin-ukan-present`) plus a review, added to its
`lessonIds`. `docs/LEARNING_JOURNEY.md` and `docs/VERB_COVERAGE.md` §5
updated to reflect that `ahal`/`ezin` are now implemented, not just
referenced.

**Question kinds:** plain form-only multiple-choice for now (matching the
existing `izan-potential`/`ukan-potential` lessons) — `negative`/`word-order`
question kinds for `ezin` specifically are a reasonable follow-up but out of
scope here, since `ezin` is lexically negative rather than `ez`+positive-verb
negation, so the existing negation-question machinery wasn't assumed to
apply without separate review.

## 2026-06-22 — #413: izan/ukan potential/baldintza/conditional/imperative sentence frames authored; `validFor: []` verified rather than assumed

Authored `sentences` data for `izan`'s and `ukan`'s `potential`, `baldintza`,
and `conditional` tenses (predicate-nominal / noun-object frames reusing the
existing pronoun-subject style) and `imperative` (predicate-adjective for
`izan`; the "Pazientzia ___!" idiom for `ukan`). These were deferred
form-only by #148 and unblocked in design by #367/#412.

For potential/baldintza/conditional on both verbs, `validFor: []` is tagged
with confidence, not as a stylistic default: grepping `verbs.js` confirms no
`nor-nork` periphrastic sibling (`nahi`/`behar`/`jakin`/`eduki`/`maite`) has
any of those three tense tables, so no cross-verb distractor candidate can
exist regardless of which noun the sentence uses.

`izan`'s `imperative` is the one case left with `validFor` absent
(unvetted) rather than `[]`: its real `nor`-cluster siblings (`egon`/`joan`/
`etorri`) do have `imperative` tables, so asserting "no sibling fits" would
need a real per-sentence naturalness judgment this pass didn't do. Per
`docs/SENTENCE_FRAMES.md`, absent `validFor` safely falls back to
same-table-only distractors, so this is the correct conservative choice
rather than a guess. `ukan`'s `imperative` siblings have no such table, so
its `validFor: []` is verified the same way as the other three tenses.

No `pronounSentences`/`negativeSentences` were added for these tenses —
none of `izan`/`ukan`'s existing `potential`/`baldintza`/`conditional`/
`imperative` lessons currently exercise those question kinds, so there was
nothing to extend.

## 2026-06-22 — #367: `behar`'s infinitive-complement frame shape was already decided (#267/#288); izan/ukan's potential/baldintza/conditional/imperative need no new pattern at all

#367 was blocked on "decide `behar`'s infinitive-complement frame shape
before forms are written" (#148's original deferral). Checking `src/data/
verbs.js`, this was actually already resolved when `behar`'s `present`/
`past`/`future` sentences were authored (#267/#288) — just never written up
as a standing decision in `docs/SENTENCE_FRAMES.md`, so #367 still listed it
as open. Documented the existing pattern there: the blank is always the
trailing auxiliary token right after the infinitive (never repeating
`behar`/`beharko` in the template), and `validFor: []` throughout (`ukan` is
excluded by construction — its bare form is textually identical to `behar`'s
trailing auxiliary, so it would be a duplicate-correct option, not a real
distractor — not by a noun-object naturalness check, which doesn't apply to
an infinitive complement in the first place).

Also realized the rest of #367's scope (`izan`/`ukan`'s `potential`/
`baldintza`/`conditional`/`imperative` lessons) was never actually blocked by
this question: `behar` has no tenses beyond `present`/`past`/`future`, so the
infinitive-complement pattern has nowhere else to extend to, and `izan`/
`ukan`'s own potential/baldintza/conditional/imperative forms (`naiteke`,
`banintz`, `nuke`, ...) are ordinary synthetic forms with their usual `nor`/
`nor-nork` agreement and no infinitive complement at all — their sentences
just need ordinary predicate-nominal (`izan`)/noun-object (`ukan`) authoring
under the existing `validFor` scheme, same as those verbs' `present`/`past`/
`future` already use. No engine or schema change needed anywhere in #367's
scope; unblocked the issue to move straight to content authoring.

No code changes; `npm test`/`lint`/`build` unaffected (docs-only).

## 2026-06-22 — #383 sub-issue 3: Units 26-28 already use conjugation-led titles; fixed stale unit-number references in their copy instead

#383's third sub-issue asked to rename Unit 28 and audit Units 26-28's
`focus`/`payload` copy for "verb-first" framing — `gustatu/iruditu/ahaztu —
The Non-3rd-Person NOR` was the complained-about title. Checking the current
`journey.js`/`docs/LEARNING_JOURNEY.md`/`journeyTranslations.js`, that
specific complaint is already moot: Unit 28 was built fresh by #358/#359
(same day #383 was filed) with the conjugation-led title `The NOR-NORI Object
Axis — natzaizu/gatzaizu`, and Units 26-27 already led with their pattern
names too. No rename was needed.

The audit did surface real staleness from stacked renumbering, left over from
before #358/#359/#385 landed — fixed:
- `journey.js`'s Unit 26 focus said "ahead of Unit 26's ditransitive jump"
  (self-referential — the ditransitive jump is Stage 9's Unit 29).
- `journey.js`'s Unit 27 focus said "recombines Unit 24's dative grid" (the
  present NOR-NORI table it recombines with is Unit 26, not 24).
- `docs/LEARNING_JOURNEY.md`'s Unit 27 row still said "pending — new unit"
  despite `journey.js` marking it `available` since #385 (same staleness
  flagged but deliberately left alone during #385 itself, now in scope here).
- `journeyTranslations.js`'s es/eu copy for Units 26-27 hadn't been updated
  past #146/#385 at all — referenced "unidad 25"/"unidad 23" for the same
  ditransitive-jump/predecessor-grid unit numbers, and didn't mention the
  #385 pools the English copy does. Brought in line with the corrected
  English text.

No code/engine changes; `npm test` + `npm run lint` + `npm run build` all
green throughout.

## 2026-06-22 — #406: hitanoa (#212/Unit 41) and subjunctive (#369/Unit 37) don't need a shared new engine mechanic

#406 asked us to resolve `docs/EXERCISE_ENGINE.md`'s open "Allocutive
register / `hi`" either/or and decide whether subjunctive needs a similar
new "context-selected question type" mechanic, possibly shared between the
two. Researching both turned up that the premise didn't hold:

- **Hitanoa's data-shape question was already resolved and shipped** two
  issues ago (#144: `hi`/`hi-m`/`hi-f` as person keys; #167: toka/noka as
  new tense keys, plus the `hi`-as-NORK gender split). `EXERCISE_ENGINE.md`'s
  section was simply never updated after that work landed — it was
  presenting a settled, implemented decision as an open one. Unit 41
  ("Hitanoa Recombined") needs no further data-shape work, just content.
- **Subjunctive needs no new mechanic at all.** It fits the same
  generic-tense-key precedent already used for toka/noka (#148/#162/#164/
  #167): a new tense is an opaque string key to `generateQuestions`, so
  `subjunctivePresent` etc. need zero engine changes. The construction/
  trigger (purpose clause, `nahi izan` volitional, indirect command) lives in
  the hand-authored sentence text, exactly like every other tense's
  `sentences` already encode whatever real-world context they describe —
  no new "construction frame" field, no new question `kind`. The existing
  `grounded` distractor invariant (`docs/DISTRACTOR_STRATEGY.md` §4.3)
  already covers safety for a subjunctive sentence question.

Net effect: no shared mechanic was needed because there was no real
remaining design gap on either side once each was checked against what's
already shipped. Updated `docs/EXERCISE_ENGINE.md` to replace the stale
hitanoa either/or with the resolved/shipped account and added a new
subjunctive section reasoning through the above. No code changes — #369
(Unit 37) and #212 (Unit 41) can drop their `blocked` status and proceed as
ordinary Tier 1 content work.

## 2026-06-22 — #385: added a pooled NOR-NORI mixer review to Units 26-27

Units 26-27 (Stage 8, the dative-shift NOR-NORI pattern) only ever drilled
three lexical examples (`gustatu`/`iruditu`/`ahaztu`) — every other
multi-verb tense in the journey backs its dedicated lessons with a pooled,
cross-verb review that varies *which verb* supplies a question (Unit 14's
`ukan-past-pool`, Unit 21's future mixer), but Stage 8 had no equivalent.
Added `nor-nori-present-pool` (Unit 26) and `nor-nori-past-pool` (Unit 27),
each pooling the three founding verbs plus `jarraitu` and `jario`
(`docs/lessons.js`'s `sources` shape, same as `ukan-past-pool`).

`jario` is folded into the pool as-is rather than split into a separate
recognition-only review: its verb-level `recognitionOnly: true` flag (#330)
already exists specifically so a rare verb can ride alongside ordinary
production carriers in a mixed pool/session while staying recognition-only
itself (`generateQuestions`'s `noProduction` gate reads `verb.recognitionOnly`
per-source, not a lesson-level `mode`) — no `mode: 'recognition'` needed on
either pool lesson. Comfortably under the existing 6-source pool cap at 5
sources each.

## 2026-06-22 — #404: upgraded #321's 12 academic/rare fodder verbs to one colorful sentence per person, correcting the prior "out of scope" call

The entry directly below this one (from earlier the same day, PR #403)
judged #321's academic/rare tier "out of scope" for #314's colorful-sentences
bar entirely. Re-reading #314's own issue body surfaced that this was wrong:
it only argues against *variety* for this tier ("don't over-invest — one
good sentence is enough for exposure"), not against *quality* — it
explicitly still requires "≥1 sentence each." The earlier reasoning
conflated "skip the multi-variant array" (a real, separately-justified call
per `mode: 'recognition'`) with "skip the upgrade entirely" (not justified).

Rather than silently fixing the merged #403/#314 framing, this discrepancy
was surfaced to the user, who asked for a new tracked issue instead of
folding the fix back into #314 — hence #404. Replaced all 12 verbs'
(`hausnartu`, `argudiatu`, `ondorioztatu`, `gaitzetsi`, `aldarrikatu`,
`plazaratu`, `sustatu`, `bultzatu`, `bermatu`, `babestu`, `ziurtatu`,
`borobildu`) single present/past sentence frame per person with concrete,
culturally-grounded text — still one frame per person, no arrays added,
preserving the `mode: 'recognition'` rationale for variety. Also tagged
these verbs' `past` entries as `{ text, validFor: [] }` objects (previously
bare untagged strings, same fix #403 already applied to #320's tier).
Singularized a few plural placeholder objects (`eskubideak`, `emaitzak`,
`mehatxupeko espezieak`) per the #285 number-agreement convention while
rewriting. New sentences recorded in `docs/SAMPLE_SENTENCES.md`'s new
"Fodder verbs — academic/rare tier" section, which also corrects that
section's and the mid/low-tier section's prior "out of scope" framing.
With all three tiers (#319/#320/#321) now done, #314 itself closes.

## 2026-06-22 — #314: authored colorful sentences for #320's 18 mid/low-frequency fodder verbs

Replaced the schematic placeholder sentences for `eskatu`, `galdetu`,
`adierazi`, `bukatu`, `amaitu`, `gainditu`, `bereiztu`, `ezagutu`, `sentitu`,
`pentsatu`, `sumatu`, `ulertu`, `aztertu`, `ukatu`, `batu`, `planteatu`,
`erori`, `jaiki` with culturally-grounded present/past pairs (same pattern
#314 already used for #319's 16 high-frequency verbs). Also converted these
verbs' `past` entries from bare untagged strings to `{ text, validFor: [] }`
objects — they'd never been tagged at all, unlike `present`, which already
had `validFor: []` wrappers around its old placeholder text. `future` needed
no separate authoring (`future ← present` reuse-by-reference). New sentences
recorded in `docs/SAMPLE_SENTENCES.md`'s new "Fodder verbs — mid/low-frequency
tier" section per #314's rule.

**`#321`'s academic/rare tier is out of scope for #314's "colorful sentences"
bar, not just deferred.** Re-read its own decision
(`docs/LANGUAGE_DECISIONS.md`'s #321 entry): that tier's sentences are
deliberately minimal — one frame per person, `mode: 'recognition'`, no typed
exercises ever read a second variant — a decision made *before* #314 existed
but for an unrelated-but-overlapping reason (recognition-only pools don't
need variety, full stop, regardless of how colorful a single frame is).
Authoring richer alternatives there wouldn't change anything a learner sees.
Concluded #314's mid/low-tier work (this entry) is the last piece that
*needs* doing; #314 can close once that's confirmed, with #321 noted as
"intentionally minimal," not "still TODO."

**Accepted the gap-audit baseline delta without per-sentence curation,
same call as #314's high-frequency-tier entry above:** tagging 18 more
verbs' `past` sentences with `validFor: []` (previously untracked, since
bare strings) inflates `scripts/validforGapAudit.mjs`'s agreement-based gap
counts dataset-wide, purely mechanically. Spot-checked the deltas against a
sample of largest-affected hosts (`kontuan-hartu`, `ondorioztatu`,
`ziurtatu`) — every new gap was the same "grammatically valid but
semantically unrelated" shape already accepted pre-#314 (e.g. an `ondorioztatu`-form
flagged against an unrelated `ukan`-cluster sentence). Regenerated
`scripts/validfor-gap-baseline.json` wholesale via
`node scripts/validfor-delta-audit.mjs --json`. #316's native-speaker review
remains the backstop if any specific sentence's judgment call turns out
wrong.

**Word count:** a few new `past` sentences run to 10-11 words (e.g. `batu`'s
`haiek` past), matching the existing high-frequency tier's own 9-10-word
items (`irakurri`'s `hura`/`haiek` past) — `WORD_ORDER_MAX_WORDS = 9` (#315)
just excludes the longer ones from the `word-order` question pool; it's not
a validity constraint on sentence content.

This file keeps the most recent ~25 entries. Older entries live in
`docs/DECISIONS_ARCHIVE.md` — check there too if you don't find the
context you're looking for here.

## 2026-06-22 — #316: native-speaker sentence review generator

Built `scripts/generate-sentence-review.mjs` (part of epic #310) — turns
`VERBS`' tagged `sentences`/`negativeSentences` into a plain-language Spanish
(or Basque, `--lang eu`) markdown checklist a non-technical native speaker
can fill in directly, no `validFor`/person-key/JS exposure:

- **Alternatives = every `agreementsCompatible` sibling, unfiltered** — same
  definition `scripts/validforGapAudit.mjs` already uses for the
  delta-audit's gap slots. Considered narrowing this (e.g. to siblings that
  share an object-class per `docs/OBJECT_FRAME_TAGGING.md`), but the
  point of human review is precisely to filter the overgenerated structural
  candidate set down to the semantically real ones — pre-filtering with a
  second heuristic would just relocate the judgment call into the tool. The
  cost: a long-established cluster (`ukan`'s "nor-nork" siblings) produces a
  long alternatives list per sentence (50+) — that's the actual size of the
  open question, not a generator bug.
- **No full-sentence translation gloss** — the issue's worked example shows
  one ("Hura medikua da." → "(Él/ella es médico/a.)"), but `VERBS` has no
  per-sentence translation field, only a per-verb `meaning`. Glossing the
  highlighted form via `meaning[lang]` is the closest derivable equivalent
  without adding a new data field; a native-speaker reviewer reading the
  Basque sentence directly needs this least of all the checklist's parts.
- **`--limit <n>` caps variants per verb** — added so the sample artifact
  committed at `docs/reviews/sentence-review-sample-izan-egon-ukan.md` stays
  reviewable-sized; real review runs omit it to cover a full batch.
- Workflow (generate → reviewer ticks checkboxes inline → implementer maps
  ticked alternatives into `validFor`, "No" + correction into a sentence/text
  fix) is documented in the script's own header rather than only here, since
  that's where someone running it will actually look.

## 2026-06-22 — #366: esan/eman ditransitive Baldintza/Ondorioa/Ahalera

Added `docs/CONJUGATIONS.md:751-1081`'s ditransitive Baldintza/Ondorioa
(present + past)/Ahalera (Orainaldia/Lehenaldia/Alegiazkoa) grids to `esan`
and `eman`, mirroring the existing `present`/`past`/`future`/
`imperativeDitransitive` axis-fixed convention from #142/#368:

- **New flat (non-2D) tense keys**: `conditionalPast`, `potentialLehenaldia`,
  `potentialAlegiazkoa`, plus their `*Plural` (NOR=haiek, `-zki-`) siblings,
  and `baldintzaPlural`/`conditionalPlural`/`conditionalPastPlural`/
  `potentialPlural`. These names already existed as `*ByObject`/`*ByNor` 2D
  tables (added by #352/#353/#362) — the new ones here are deliberately
  *flat* siblings, since `esan`/`eman`'s tables are single-axis-fixed (like
  their existing `present`/`past`/`future`), not genuinely 2D. Same name,
  different shape, disambiguated by which verb it lives on.
- `esan` keeps `recipient: 'hura'` fixed (NORI = hari), varying NORK; `eman`
  keeps `agent: 'ni'` fixed (NORK = nik), varying NORI — each table below is
  that grid's fixed-axis row/column, read straight off the source doc.
- Wired into Units 34 (Ahalera) and 35 (Baldintza/Ondorioa) rather than new
  units — both units' focus text already said "recognition-only for the
  dative paradigms," and `unit-34-ditransitive-review`/
  `unit-35-ditransitive-review` pool esan+eman (singular and plural object
  together) in one `mode: 'recognition'` lesson each, mirroring Unit 30's
  `unit-30-ditransitive-review` (#368) treatment of the same two verbs.

## 2026-06-22 — #368: Unit 36 Agintera remainder — jussive/hortative, plural-object, ditransitive, egon/etorri/joan

Filled in the rest of `docs/CONJUGATIONS.md` §16.2's Agintera (imperative)
picture, flagged as out of scope by #171's own table comment:

- **`ukan.conjugations.imperative`** gained `hura: 'beza'` (3rd-person
  jussive) and `gu: 'dezagun'` (1st-person hortative) directly in the
  existing flat table, plus `haiek: 'bezate'`. Since `ukan-imperative`'s
  lesson has no `persons` filter, `generateQuestions`'s `personsFilter ??
  Object.keys(table)` default means these new cells are picked up
  automatically — no `lessons.js` change needed for this piece, only the
  `logic.test.js` exact-table assertion had to be updated.
- **`ukan.conjugations.imperativePlural`** is a new sibling table for the
  `-itz-` plural-object column (`itzak`/`itzan`/`itzazu`/`itzazue`/`bitza`/
  `ditzagun`/`bitzate`), named to match the existing `presentPlural`/
  `pastPlural` convention. Drilled recognition-only against the singular
  table (`unit-30-plural-object-review`), same rationale as Unit 25's
  `unit-25-object-number-review`.
- **`esan.conjugations.imperativeDitransitive`** = `{ zu, zuek, 'hi-m',
  'hi-f' }` reuses `esan`'s existing `recipient: 'hura'`-fixed/NORK-varies
  shape directly — the imperative's addressee dimension maps onto the same
  NORK axis `esan` already varies over, just restricted to addressable
  persons.
- **`eman.conjugations.imperativeDitransitive`** = `{ ni, hura, gu, haiek }`
  keeps `eman`'s NORI-varies shape, but fixes the addressee at `zu` instead
  of `eman`'s usual `agent: 'ni'` for this one table only (documented via a
  comment on the table, not a change to `eman`'s general `agent` field) —
  you can't command someone to give to themselves as agent, so the
  imperative needs a real addressee, and `zu` is the only one available.
  This also happens to produce the doc's own canonical worked example,
  "Eman iezadazu" ("Give me that"). Both ditransitive tables are
  recognition-only (`unit-30-ditransitive-review`), pooling esan and eman
  the same way Unit 25's `unit-25-two-axis-review` already does for their
  other axes.
- **`egon`/`etorri`/`joan` each gained a flat `imperative` table** that's a
  literal copy of their existing `present` table's `hi`/`zu`/`zuek` cells,
  per the synthetic-imperative-=-present-tense rule (CONJUGATIONS.md
  §16.2). `egon` additionally gets `hura: 'bego'`/`haiek: 'begoz'` (it has
  its own synthetic jussive); `etorri`/`joan` don't, since their 3rd-person
  jussive (`etor bedi`/`joan bedi`) needs the Radical/Bare-Stem rule
  (§16.2's bare-stem-before-subjunctive-auxiliary pattern) — a new stem
  concept not currently in the data model, judged too large for this issue
  and left out of scope. New `egon-imperative`/`etorri-imperative`/
  `joan-imperative` lessons, added to Unit 36's `lessonIds`.
- **Explicitly excluded**: `izan`'s own missing `hura: 'bedi'`/`haiek:
  'bitez'` jussive forms (documented in CONJUGATIONS.md §2 but never part of
  #368's cited scope, which pointed only at the NOR-NORK section) — a
  separate, not-yet-filed gap rather than something to fold in here.

## 2026-06-21 — #364: NOR-NORI Inperatiboa object axis (`imperativeByNor`) for `gustatu`/`iruditu`/`ahaztu` — `hura`/`haiek` included (unlike #361/#362), extended Unit 36 rather than a new unit

Unlike Baldintza/Ondorioa (#361) and Potentziala (#362), there's no flat
`imperative` table for these verbs for `hura`/`haiek` to be redundant
with — Units 26-27 never taught a dative imperative at any `NOR` value.
So `imperativeByNor`'s inner (`NOR`) axis is `{hura, zu, zuek, haiek}`
(structurally missing `ni`/`gu` — you can't command something to be
pleasing to yourself/us — and `hi` deferred per the journey's hika
deferral), not the `{ni, zu, gu, zuek}` restriction #361/#362
established. Bare participle prefix (`gustatu bekio`, not `gustatuko
bekio`), matching `past`/Potentziala's convention rather than
Baldintza/Ondorioa's `-ko` future participle.

Placement: extended Unit 36 (Agintera) with three new `objectAxis: {
vary: 'nor', fixed: 'zu' }` lessons (`gustatu-imperative-axis`/
`iruditu-imperative-axis`/`ahaztu-imperative-axis`, `persons: ['hura',
'zuek', 'haiek']`), rather than giving it a dedicated unit the way Unit
28 (#358/#359) did for the present/past object axis. Reasoning: Unit 28
needed its own unit because it covered two tenses (present + past) for
three verbs = six lessons, a substantial new chunk; the imperative's
grammar gap (no `ni`/`gu` cells, `hi` deferred) leaves only a three-lesson
addition, not worth fragmenting the curriculum for. Unlike #361/#362,
this issue's own scope explicitly required the journey wiring, so (per
Unit 28's precedent) it's full production, not recognition-only.

## 2026-06-21 — #362: NOR-NORI Potentziala object axis (`potentialByNor`/`potentialAlegiazkoaByNor`/`potentialLehenaldiaByNor`) for `gustatu`/`iruditu`/`ahaztu` — bare participle, not the `-ko` future participle used by Baldintza/Ondorioa

`#361` added Baldintza/Ondorioa's NOR-NORI object axis riding the future
`-ko` participle (`gustatuko balitzait`, etc.) — matching the codebase's
existing `future = perfective participle + -ko` rule. Potentziala
(Ahalera) does **not** follow that prefix: standard Basque ahalera takes
the **bare/perfective participle**, the same one `past` already uses
(`gustatu zakidake`, not `*gustatuko zakidake`) — mirroring synthetic
`dezaket`-type forms like "irakurri dezaket" rather than "*irakurriko
dezaket". Reused the rest of #361's conventions unchanged: the NOR axis
is restricted to `{ni, zu, gu, zuek}` (no `hura`/`haiek` inner keys —
those are already covered by the flat `present`/`past` tables), and only
the literal diagonal is excluded as reflexive (not the whole
same-person-category block, unlike `ukan`'s NOR-NORK tables). As with
#361, lesson/journey wiring is out of scope per the issue's "Done when"
checklist — this only adds the verb data.

## 2026-06-21 — #361: NOR-NORI Baldintza/Ondorioa object axis (`baldintzaByNor`/`conditionalByNor`/`conditionalPastByNor`) for `gustatu`/`iruditu`/`ahaztu` — narrower reflexive rule, narrower NOR axis than `ukan`'s object-axis tables

**Decision:** Added the `*ByNor` siblings of `baldintza`/`conditional` for
`gustatu`/`iruditu`/`ahaztu`, transcribed from `docs/CONJUGATIONS.md:468-483`
(Baldintza) and `:494-528` (Ondorioa present/past). Two things differ from
`ukan`'s NOR-NORK object-axis tables (#352/#353), both confirmed by direct
inspection of the source grids rather than assumed by analogy:

1. **Reflexive exclusion is narrower.** NOR-NORK (`ukan`) excludes the whole
   same-person-*category* block (e.g. `nik`→`ni` *and* `nik`→`gu`, since NORK
   and NOR are the same argument-role type — subject vs. object). NOR-NORI
   (`gustatu` et al.) excludes *only* the literal diagonal (`niri`→`ni`,
   `guri`→`gu`, `zuri`→`zu`, `zuei`→`zuek`) — NORI (dative) and NOR
   (absolutive) are different roles, so e.g. `guri`→`ni` is a fully
   grammatical, non-excluded cell.
2. **The NOR axis itself is narrower.** Matching the existing
   `presentByNor`/`pastByNor` precedent (#358), `nor` only ranges over
   `{ni, zu, gu, zuek}` — `nor=hura`/`nor=haiek` are deliberately omitted
   because those are exactly the default-object meaning the flat
   `present`/`past`/`presentPlural`/`pastPlural` tables already cover; adding
   them to the 2D table would be redundant, not new content.

Each verb's cells prefix its own *future* participle (`gustatuko`/
`irudituko`/`ahaztuko`) over the bare dative-auxiliary forms transcribed
verbatim from the grids — the same `-ko` shape `future` already uses
(`irudituko zait`), extended into the hypothetical moods. No flat
single-axis `baldintza`/`conditional`/`conditionalPast` table exists yet for
these three verbs to cross-check against (unlike `ukan`, which has flat
`baldintza`/`conditional` siblings) — verified instead by matching the new
tables' shape exactly against `presentByNor`/`pastByNor`'s established
per-outer-person key sets.

Lessons/journey wiring was left out of scope — the issue's "Done when"
checklist only requires the `VERBS` data and a green `npm test`, unlike
#352/#353 which explicitly called out Unit 34/35 `lessonIds`.

## 2026-06-21 — #353: Baldintza/Ondorioa object-axis follows #352's pattern — `conditionalPastByObject` is the only key with no flat sibling

Added `ukan`'s NOR-NORK object axis for Baldintza and Ondorioa present/past
(`bazintut`/`zintuket`-type forms, `docs/CONJUGATIONS.md`:236-282),
extending Unit 35's `lessonIds` per the same #351/#286 precedent #352 used.
Same naming convention as #352: `baldintzaByObject`/`conditionalByObject`
mirror the existing flat `baldintza`/`conditional` tables, while
`conditionalPastByObject` (Ondorioa past) is net-new since no flat
single-axis table for Ondorioa past exists yet — same situation as #352's
Alegiazkoa/Lehenaldia sub-tenses. The `-zke-` merger forms
(`docs/CONJUGATIONS.md`:276-282) were transcribed verbatim from the grids
rather than derived, per the issue's explicit warning that the rule isn't a
simple suffix-concatenation. Lesson wiring reuses Unit 15/#352's
`objectAxis: { vary: 'nor', fixed: 'ni' }` convention, with one pooled
review spanning all three sub-tenses.

## 2026-06-21 — #352: Ahalera object-axis tense keys named `potential*ByObject`, all three sub-tenses get new keys even without flat counterparts

Added `ukan`'s NOR-NORK object axis for Ahalera (`zaitzaket`-type forms,
`docs/CONJUGATIONS.md:316-358`), extending Unit 34 per #351's precedent
(extend an existing unit's `lessonIds` rather than insert a new unit).
Two naming decisions worth recording:

- **Tense keys**: `potentialByObject` (Orainaldia/present, mirrors the
  existing flat `potential` table the same way `presentByObject` mirrors
  `present`), plus net-new `potentialAlegiazkoaByObject` (hypothetical) and
  `potentialLehenaldiaByObject` (past) — neither of the latter two has a
  flat single-axis counterpart in `VERBS` (the issue only asked for the
  object-axis tables), but `TENSE_META` entries were still added for all
  three so the UI can label them like every other tense.
- **Reflexive exclusion**: the issue's text describes Ahalera's exclusion
  rule (any same-person-category pair, not just the literal `nork===nor`
  diagonal) as "broader" than the present/past indicative's. Checking
  `presentByObject`/`pastByObject`'s actual cells shows they already apply
  that same broader rule (see the file-level comment at the top of
  `verbs.js`) — so no new exclusion logic was needed, just the same
  cell-omission convention applied to three more tables.

Lesson wiring reuses Unit 15's `objectAxis: { vary: 'nor', fixed: 'ni' }`
convention verbatim (same `persons` list, same `fixed: 'ni'` choice for the
same "direct payoff sentence" reason), plus one pooled review spanning all
three sub-tenses since there's a single verb (`ukan`) rather than several.

## 2026-06-21 — #386: Unit 28 retitled to lead with the pattern, not the verb list

Unit 28's title (`'gustatu/iruditu/ahaztu — The Non-3rd-Person NOR'`) broke
the convention every other unit follows (Units 13/20/26: name the
conjugation pattern, verbs as the worked example) — confusing right next to
Unit 26, which covers the same three verbs and is titled `'The NOR-NORI
Present — zait/zaizu/zaio'`. Renamed to `'The NOR-NORI Object Axis —
natzaizu/gatzaizu'` in `journey.js`, `docs/LEARNING_JOURNEY.md`, and the
Spanish/Basque copy in `journeyTranslations.js`. Copy-only change — no
`lessonIds`/data touched, Units 26-27's titles were already pattern-led and
didn't need changes.

## 2026-06-21 — #343: pool lessons collapse verb-name labels above a small threshold

`describeLesson` joined every verb name in a multi-source pool/review lesson
(`verbNames.join(' & ')`) for `subtitle.main`/`heading`, which is unreadable
for large pools (`ukan-past-pool`'s 46 verbs, `unit-10-present`'s 45) and
shows up with no truncation at all in `handleShareResult`'s native share
text. Fixed by collapsing to a generic `t('verbCount', { count })` label
("46 verbs") once `verbNames.length > 3`, joining as before below that
threshold — small pools (2-3 verbs, e.g. `izan & egon`) are still more
informative joined than collapsed, and existing tests already asserted that
readable joined form. The fix applies to both the practice and review
branches' `subtitle.main` — the review branch's `heading` already collapsed
multi-verb names to "mixed review" from an earlier fix, but its
`subtitle.main` had the same unjoined-names defect as the practice branch
and wasn't covered by that earlier fix.

## 2026-06-21 — #381: object-axis pooled review extends Unit 15, not a new unit

Once #378-#380 gave `ikusi`/`jan`/`edan`/`erosi`/`hartu` `presentByObject`/
`pastByObject` tables and pooling support, the question was where the
resulting cross-verb review should live. Extended Unit 15's existing
`lessonIds` with two new lessons (`object-axis-present-review`,
`object-axis-past-review`) rather than spinning out a new unit, following
the #286 precedent ("extend the unit that introduced the grammar, don't add
a new one for more of the same drill"). This is still the same NOR-NORK
non-3rd-person-object relation Unit 15 already teaches, just pooled across
the full verb set instead of `ukan`/`maite` alone — no new grammatical
relation, no renumber needed.

Both new lessons share one `objectAxis: { vary: 'nor', fixed: 'ni' }` and
`persons` across all seven sources, matching #380's design (a review fixes
one shared axis for every pooled source, never a per-source value). Verified
via a `logic.test.js` test against the real `LESSONS`/`VERBS` data that the
pooled review's `verb-choice` questions draw distractors from more than two
of the seven verbs, not just a couple.

## 2026-06-21 — #380: generateCrossVerbQuestions learns objectAxis pooling

Gave `generateCrossVerbQuestions` (and the `collectCrossSourceCandidates`
helper it shares with `generateCaseMixerQuestions`) an optional `objectAxis`
parameter so a pooled review can mix `ukan`/`maite`/`ikusi`/`jan`/`edan`/
`erosi`/`hartu`'s `presentByObject`/`pastByObject` 2D tables, not just flat
ones — the prerequisite for #381's Unit 15 pooled review.

Treated `objectAxis` as **one shared value across every pooled source**,
matching the existing convention that `objectAxis` is a lesson-level field
(`data/lessons.js`'s Unit 15/28 lessons each fix a single `{ vary, fixed }`
for the whole lesson) — a review never needs a different fixed value per
source, so there was no reason to make this a per-source option.

None of the `objectAxis` verbs have `sentences[tense]` data for these tables
yet, so when `objectAxis` is set, the sentence requirement (and the
`validFor`-based sibling narrowing it drives) is dropped entirely for that
call — every agreement-compatible sibling's resolved form is a fair
distractor, and the resulting questions have no `sentence` (`fixedArgument`
is computed and threaded through instead, same shape `generateQuestions`
already produces for a single-verb `objectAxis` lesson). `App.jsx`'s
`QuestionPrompt` already renders a bare person+badge header whenever
`sentence` is falsy, so no UI change was needed.

Left `generateCaseMixerQuestions` without `objectAxis` support — its whole
point is nor-vs-nor-nork agreement *mismatch*, and every `objectAxis` verb is
already nor-nork, so there's nothing for it to mix in practice; it still
calls `collectCrossSourceCandidates` positionally and simply never passes the
new argument.

Did not wire `lesson.objectAxis` through from `App.jsx`'s
`generateCrossVerbQuestions` call site — that's #381's job (the actual Unit
15 pooled-review wiring), once the lessons that need it exist.

## 2026-06-21 — #379: jan/edan/erosi/hartu gain presentByObject/pastByObject; fixed a latent getDativeOvergenerationLure bug along the way

Extended `ikusi`'s #378 pattern to four more `ukan`-auxiliary periphrastic
verbs — `jan` ("eat"), `edan` ("drink"), `erosi` ("buy"), `hartu` ("take") —
each gaining `presentByObject`/`pastByObject`, every cell `ukan`'s matching
cell with the verb's own prefix swapped in (`jaten `/`jan `, `edaten
`/`edan `, `erosten `/`erosi `, `hartzen `/`hartu `, read off each verb's own
existing flat `present`/`past` tables, same convention as `ikusi`/`maite`).
Chosen per the issue for thematic variety (eat/drink/buy/take vs. ikusi's
"see") so Unit 15's eventual pooled review (#381) doesn't just rotate
between near-synonyms.

While running the new tests, found that `erosi` and `hartu` — both flagged
`dativeOvergeneration: true` — crashed `getDativeOvergenerationLure`
(`src/lessonLogic.js`) when given an `objectAxis` lesson: it looked up
`verb.conjugations[tense]?.[person]` directly, which for a 2D
`presentByObject`/`pastByObject` table returns a nested object instead of a
form string, the same class of bug #350 already fixed in
`hasAmbiguousTypedForm`. `ikusi`/`maite`/`ukan` never exposed this because
none of them carry `dativeOvergeneration: true`. Fixed
`getDativeOvergenerationLure` the same way #350 fixed its sibling: take an
optional `objectAxis` param and resolve both the verb's own and its sibling's
table through `resolveObjectAxisTable` before indexing by `person`.

No `LESSONS`/`journey.js` wiring yet — still deferred to #380 (pooled-review
engine support for `objectAxis`) and #381 (the wiring itself), per epic
#377's sequencing.

## 2026-06-21 — #378: ikusi gains presentByObject/pastByObject, riding ukan's table with ikusi's own two prefixes

`ikusi` (periphrastic, `ukan`-auxiliary) now carries `presentByObject`/
`pastByObject`, the same NOR-NORK 2D table `maite` already rides (#348) —
following through on the follow-up #347 and #350 both flagged as still open.
Unlike `maite`, which uses a single `'maite '` prefix for both tenses
because it's a fixed nominal-predicate phrase, `ikusi` needs **two** distinct
prefixes matching its own existing `present`/`past` tables' shapes: `'ikusten
'` for present (the imperfective `-ten` marker `present` already carries) and
`'ikusi '` for past (the bare participle `past` already carries). Every cell
is generated by prefixing `ukan.presentByObject`/`pastByObject`'s matching
cell, so `presentByObject.ni.zu === 'ikusten ' + ukan.presentByObject.ni.zu`
("ikusten zaitut") holds by construction — pinned in `src/logic.test.js`
alongside the existing `nor: 'hura'`-column cross-check against `ikusi`'s own
flat `present`/`past` tables.

No `LESSONS`/`journey.js` wiring yet — that's deferred to #380 (pooled-review
engine support for `objectAxis`, needed so `ikusi`'s distractors can mix with
`ukan`/`maite`'s rather than each verb getting its own siloed lesson) per
epic #377's sequencing.

## 2026-06-21 — #359: new Unit 28 places gustatu/iruditu/ahaztu's non-3rd-person NOR axis (#358) directly after its NOR-NORI predecessor, shifting Gates C/D to 33/45

Placed the new unit (`gustatu-nor-axis-present`/`-past` ×3 verbs, `objectAxis:
{ vary: 'nor', fixed: 'zu' }`) as Unit 28 — directly after Unit 27 (NOR-NORI
Past & Future), before Stage 9's ditransitive jump (now Unit 29). This follows
epic #357's placement analysis verbatim (written in pre-#350-renumber
numbering as "after Unit 26, before Unit 27"; re-mapped onto the current
post-#350 numbering as "after current Unit 27, before current Unit 28").
Rationale carried over from the epic: the unit directly contrasts with what
the learner just finished — Units 26-27 only ever fix NOR at `hura`/`haiek`,
so seeing NOR vary to `ni`/`gu`/`zuek` right after is the sharpest possible
contrast, while staying inside the same dative-shift stage rather than
waiting until after Stage 9's harder ditransitive content. Mirrors #350's own
placement of its NOR-NORK sibling unit directly after the paradigm it extends.

`fixed: 'zu'` was chosen because it's the unit's payoff sentence's dative
person ("Gustatzen natzaizu?" = "Do you like me?"); `zu` itself is the
reflexive gap missing from the table (a person can't be dative to themself in
this paradigm), and `hura` as NOR is already covered by Units 26-27's flat
tables, so the new unit's `persons` are exactly `ni`/`gu`/`zuek` — no overlap,
no redundant drilling.

Inserting a unit shifts every later unit's `number` by +1 (`journey.js`,
`docs/LEARNING_JOURNEY.md`'s table, `journeyTranslations.js`'s numeric keys) —
Gates C/D move from 32/44 to 33/45. Per #137/#350's precedent, lesson `id`
strings are **not** renumbered, only the `number` field and human-readable
prose — a unit's id is a stable identity, its number is just current display
position. Same scope limit as #347/#350: no pooled cross-verb review for this
unit, since `generateCrossVerbQuestions` doesn't support `objectAxis` yet.

## 2026-06-21 — #358: NOR-NORI's `objectAxis` extension (`presentByNor`/`pastByNor`) generalizes `fixedArgument.role`, fixing a latent NORK/NORI mis-badge

`gustatu`/`iruditu`/`ahaztu` (NOR-NORI) now carry `presentByNor`/`pastByNor` —
the same real-2D-table shape `ukan.presentByObject`/`pastByObject` (#346/#347)
introduced for NOR-NORK, but keyed outer-NORI/inner-NOR instead of
outer-NORK/inner-NOR, unlocking the missing "natzaizu-type" forms (non-3rd-
person NOR, e.g. "Gustatzen natzaizu?" = "Do you like me?"). Named `...ByNor`
rather than `...ByObject` since NOR isn't "the object" for a NOR-NORI verb the
way it is for NOR-NORK — the suffix names the newly-varying axis, not a fixed
semantic role.

`resolveObjectAxisTable` needed **no code change** — it was already
axis-name-agnostic (only outer-vs-inner position matters, never `'nor'`/
`'nork'` literally) — only its doc comment needed generalizing.

`generateQuestions`'s `fixedArgument` derivation **did** need a real fix:
it hardcoded `objectAxis.vary === 'nor' ? 'nork' : 'nor'`, correct only for
NOR-NORK verbs. For a NOR-NORI verb this would have badged the fixed NORI
argument as "NORK" (wrong color, wrong label, via `AGREEMENT_META`).
Generalized to `verb.agreement.find((role) => role !== objectAxis.vary)`,
which is behavior-preserving for existing NOR-NORK callers and correct for
NOR-NORI. Caught before shipping by reading `AGREEMENT_META`'s distinct
per-role styling, not by a failing test — added `src/logic.test.js` coverage
(`objectAxis on a NOR-NORI verb (#358)`) pinning `fixedArgument.role ===
'nori'` so a regression here fails loudly next time.

Like #347, scoped to logic-level tests only — no `LESSONS`/`journey.js`
wiring yet; that's deferred to a separate journey-placement issue (#359),
mirroring #350's role for #346/#347/#348.

## 2026-06-21 — #350: new Unit 15 ("non-3rd-person object"), inserted after Unit 14, shifting everything from there on +1

**Decision:** inserted a new journey unit teaching `ukan`/`maite`'s
`presentByObject`/`pastByObject` tables (#346/#347/#348) with the *object*
(NOR) drilled away from the default `hura` — `objectAxis: { vary: 'nor',
fixed: 'ni' }` — landing on "Maite zaitut" ("I love you") as the payoff
sentence. Placed it as Unit 15, directly after Unit 14's NOR-NORK past pool
(the first unit to introduce `ukan`'s ergative agreement fully), and shifted
every unit number from the old 15 onward by +1 across `journey.js`,
`journeyTranslations.js`, and `docs/LEARNING_JOURNEY.md`. The four Refresh
Gates shifted from Units 10/22/31/43 to 10/23/32/44 as a result.

Scoped to four single-verb practice lessons
(`ukan-object-axis-present`/`maite-object-axis-present`/`ukan-object-axis-past`/`maite-object-axis-past`)
with no pooled review and no `ikusi`: `generateCrossVerbQuestions` (the
review/pooled-lesson path) has no `objectAxis` support at all, and `ikusi`
has no `*ByObject` table yet. Both are pre-existing engine gaps noted in
`docs/EXERCISE_ENGINE.md`, not something to solve inside this issue. Unit 12
(`izan-past-pool`/`izan-past-pool-plural`, no trailing review) is precedent
that a unit doesn't need a review to be valid.

This is also `LESSONS`' first actual use of the `objectAxis` field — it's
existed in the engine since #346 but no lesson had exercised it until now.
That surfaced a real latent bug: `hasAmbiguousTypedForm` (`lessonLogic.js`)
indexed `verb.conjugations[tense][person]` directly, which works for a flat
table but returns a nested object (not a string) for a 2D `objectAxis`
table, crashing on `.includes(' ')` the moment `generateQuestions` is called
with `verbs` passed — exactly what `createExerciseState` does for every real
lesson. None of #346/#347/#348's existing tests caught it because they all
call `generateQuestions` without `verbs`, short-circuiting that code path.
Fixed by teaching `hasAmbiguousTypedForm` to resolve through
`resolveObjectAxisTable` itself (given an `objectAxis`) before comparing
forms, and added a permanent regression test in `logic.test.js` that passes
`verbs: VERBS` for an objectAxis lesson. Also tightened
`journey.test.js`'s person-validation check, which previously checked
`person in verb.conjugations[tense]` directly — for an objectAxis lesson
that spuriously passes (nork/nor share the same person vocabulary) without
confirming the resolved cell actually exists; now it resolves through
`resolveObjectAxisTable` first.

## 2026-06-21 — #348: `maite izan` added, form-only (no `sentences` at all, not even `present`/`past`)

**Decision:** added `maite` (`maite izan`, "to love") to `VERBS`, riding
`ukan`'s `present`/`past`/`presentByObject`/`pastByObject` (#346/#347)
verbatim with a `'maite '` prefix on every cell — `maite.presentByObject.ni.zu
=== 'maite ' + ukan.presentByObject.ni.zu` ("maite zaitut") by construction.
No `presentPlural`/`futurePlural` (out of scope) and no `sentences` for any
tense, including the plain `present`/`past`.

**Why no `sentences`, not even for `present`/`past`:** first pass added
`sentences.presentByObject`/`pastByObject` (keyed by the *varying* `nor`
axis, e.g. `hura`/`zu`/`zuek`/`haiek` — matching `ukan.presentByObject.ni`'s
row, i.e. authored for a future lesson fixing `nork: 'ni'`) with
subject-pronoun-free text ("Jon ___.", "Bihotz-bihotzez ___."). That broke
`validforGapAudit.mjs`'s `computeGapSlots`: it reads
`verb.conjugations[tense]?.[person]` assuming a flat table, but
`presentByObject`/`pastByObject` are 2D (`{ [nork]: { [nor]: form } }`) —
indexing a 2D table by a bare `nor` person returns the wrong row (or, worse,
an object), corrupting the gap-count baseline (`[object Object]`-shaped
"forms" showing up as new gap slots). Rather than patch the audit script to
understand 2D tables for what would be its first caller, dropped the
sentences entirely and leaned on a logic-level smoke test
(`src/logic.test.js`'s `"generates real maite-zaitut-type questions..."`
case) instead — the same "exercises the new axis without an audit-script/
LESSONS-entry side effect" move #347 already made for `ukan` itself. Also
dropped the plain `sentences.present`/`sentences.past` (the hura-fixed
citation tables) for the same reason `ukan` skipped them: a "Nik X maite
dut" frame needs an object noun, but `maite`'s actual point is the
object-axis tables, not the citation column.

**Follow-up:** the `validforGapAudit.mjs` 2D-table blind spot is real and
will resurface the moment any verb's object-axis tense gets `sentences` — if
that's wanted later (e.g. for #350's lesson), `computeGapSlots`/
`collectTaggedVariants` need to learn to resolve 2D tables the same way
`generateQuestions`/`resolveObjectAxisTable` (#346) already do, not just
treat `conjugations[tense][person]` as a flat lookup.

## 2026-06-21 — #347: ukan's full NOR-NORK object-axis paradigm (zaitut-type forms), form-only, no LESSONS entry

**Decision:** added `pastByObject` alongside `presentByObject` (#346) on `ukan`
— same core 6-person grid shape (`hi` omitted, reflexive-block cells absent),
transcribed from `docs/CONJUGATIONS.md` §3's "Past — NOR = 1st/2nd person"
grid, cross-checked against the existing flat `past` table the same way
`presentByObject` was checked against `present`. Went form-only (no
`sentences`/`validFor`) for both — a "Nik zu ___." frame reads closer to a
`maite izan`/psych-verb sentence than a noun-object `nor-nork` one, so authoring
one now would mean inventing a frame this verb doesn't naturally take, rather
than reusing an existing pattern. Follows the `behar`/Unit 21 form-only
precedent already in this log. The "exercises the new axis" bar from the
issue's checklist was met with a logic-level smoke test
(`src/logic.test.js`'s `"generates real zaitut-type questions..."` case) that
runs `generateQuestions` against the real `VERBS` `ukan` entry rather than
adding a `LESSONS` entry — an orphan `LESSONS` entry would still surface in
`ProgressTab` (which renders every `LESSONS` item unconditionally, regardless
of whether any `journey.js` unit references it) and shift
`getUnlockedLessonIds`'s array-order-based unlock chain, so it's not actually
inert the way #346's "no `LESSONS`/`journey.js` entry" scope call assumed.
Curriculum wiring (a real lesson + unit) stays #350's job, same boundary #346
already drew, just confirmed by checking what `LESSONS` membership alone
would have changed.

**Why no `ikusi` parallel yet:** the issue flags `ikusi` (the other plain
`nor-nork` verb already taught) as a candidate for the same treatment, for
distractor-pool variety. Left as a follow-up rather than folded in here,
consistent with how the fodder-pool extensions (#318-321) were sequenced as
their own issues rather than piggybacked onto whichever issue touched the
data shape first.

## 2026-06-21 — #346: NOR-NORK object axis via real 2D table, resolved to flat before `generateQuestions` runs

**Decision:** chose option (b) from the issue (a real 2D table,
`conjugations[tense] = { [nork]: { [nor]: form } }`) over option (a)
(fixing the object and only varying the subject, as every verb did before
this). `ukan` gained a sibling tense, `presentByObject`, alongside its
existing flat `present` — `present` itself is untouched, so no existing
lesson's behavior changes. A new pure function,
`resolveObjectAxisTable(table2D, { vary, fixed })` (`lessonLogic.js`),
collapses the 2D table to a flat `{ [person]: form }` table for whichever
axis a caller wants to drill; `generateQuestions` gained an `objectAxis`
option that, when set, runs the table through this resolver and derives
`fixedArgument` from it before any of the function's existing logic
executes.

**Why:** the issue's own write-up suggested `buildOptions` would also need
updating to handle a 2D distractor pool. Resolving to a flat table *before*
`generateQuestions`'s other logic runs (sentences, persons, fixedArgument,
and eventually `buildOptions`) makes the rest of the pipeline axis-agnostic
automatically — it sees the same `{ [person]: form }` shape it always has.
`buildOptions`/`buildTaggedOptions` needed **zero changes**. This is cheaper
and lower-risk than threading 2D-awareness through the distractor-building
code, and keeps the new feature fully additive/opt-in: a verb/tense with no
`objectAxis` caller behaves exactly as before.

The which-cells-are-gaps question turned out broader than the issue text's
literal description ("nik→ni, guk→gu, zuk→zu, zuek→zuek" — the reflexive
diagonal only). `CONJUGATIONS.md` §3's authoritative grid marks whole
same-person-category blocks as `*(refl.)*`/impossible, not just the single
diagonal cell — e.g. nik excludes both `ni` and `gu` as objects (not just
`ni`), zuk excludes both `zu` and `zuek` (not just `zu`). No hark/haiek (3rd
person) cells are excluded. Followed the grid over the issue's simplified
text; `ukan.presentByObject` was transcribed directly from it and
cross-checked in `logic.test.js` against the existing `present` table
(`presentByObject[nork].hura === present[nork]` for all six norks).

Deliberately did **not** wire a `LESSONS`/`journey.js` entry for this axis.
`journey.test.js` cross-checks that every `lesson.persons` entry is a key of
`verb.conjugations[lesson.tense]` — for a 2D table those top-level keys are
`nork` values, not the drilled axis's persons, so a curriculum lesson would
need either a test update or lesson-level axis resolution first. The issue's
"Done when" checklist only asks for engine/data/test support for "at least
one verb's tense," not curriculum integration, so this is left for whichever
future issue actually adds an object-axis unit to the journey.

## 2026-06-21 — #314: authored colorful sentences for #319's 16 high-frequency fodder verbs

Replaced the schematic placeholder sentences (from the now-closed
#318–#321) with culturally-grounded present/past pairs for all 16 of
#319's verbs: `egin`, `irakurri`, `idatzi`, `ikasi`, `entzun`, `utzi`,
`aurkitu`, `bilatu`, `galdu`, `jaso`, `saldu`, `itxaron`, `sartu`, `atera`,
`hasi`, `bizi-izan`. `future` needed no separate authoring — it's already
covered by the pre-existing `future ← present` reuse-by-reference loop.
Every variant is tagged `validFor: []`: each sentence anchors on a concrete,
specific real-world object/setting (a named dish, a named place, a named
person's writings) deliberately chosen so no sibling verb's same-person
form is also a natural fit. New sentences recorded in
`docs/SAMPLE_SENTENCES.md`'s new "Fodder verbs — high-frequency tier" section
per #314's rule that uncovered-verb sentences get added there too.

**Decision (accepted the full validFor gap-audit delta without further
curation):** adding 16 new agreement-compatible verbs to `VERBS`
mechanically inflates `scripts/validforGapAudit.mjs`'s gap counts for
*every* existing curated `validFor` list dataset-wide — the audit is purely
agreement-based (does `gapVerb`'s form exist, differ, and sit outside the
host's `validFor` array?), not semantic. Spot-checked the new gaps against
the largest-delta host pools (`izan`'s identity/profession sentences,
`ukan`'s possession cluster, the synthetic-verb present-tense sentences):
in every case the new gap was a grammatically valid sentence in an
unrelated semantic relation (e.g. "Nik liburu bat itxaron dut" — I waited
for a book — being flagged against `ukan`'s curated "have/want/need/buy"
cluster), the same shape as pre-existing accepted false positives in that
cluster (`jan`/`edan` were already gap candidates there pre-#314, never
added). Concluded none of the 16 verbs need `validFor` additions to
existing sentences, then regenerated `scripts/validfor-gap-baseline.json`
wholesale via `node scripts/validfor-delta-audit.mjs --json`. #316's
native-speaker review remains the backstop if this judgment call turns out
wrong for any specific sentence.

#320's mid/low-frequency tier (18 verbs) and #321's academic/rare tier (12
verbs) — the rest of #314's ~46-verb scope — are deferred; #314 stays open
until both land.

## 2026-06-21 — #313: extended cultural sentences to imperfectivePast (joan/etorri/ibili), nahi/gustatu/iruditu/ari, and a new futurePlural reuse loop

Closed out #312's left-behind `imperfectivePast` question (see the #312
entry below): confirmed programmatically that the synthetic-verb bank's
"Past" examples for `joan`/`etorri`/`ibili` are genuinely `imperfectivePast`
forms, and added `sentences.imperfectivePast` blocks for all three. `joan`'s
bare-locative `ni` item is tagged `validFor: ['ibili']` (no directional cue,
closer to ibili's territory than joan's usual allative sense) rather than
joan's typical `['etorri']` — flagged as tentative for #316's native-speaker
review, same as the #312-era locative item it sits next to. `etorri`'s
imperfectivePast items are ablative-only and get `validFor: []`, extending
the convention already established for `etorri`'s present-tense ablative
sentences (no sibling shares "coming from X" without also needing a
destination). `etorri`'s `habitualPast` (the periphrastic `etortzen
nintzen` construction, distinct from `imperfectivePast`) stays form-only —
no bank section targets it.

Also adopted: `nahi`'s remaining present/infinitive-complement items and a
new `presentPlural` block; `gustatu`/`iruditu`'s future-ready `present.haiek`
items; `ari`'s one ready `present.zu` item (the rest of `ari`'s bank stays
deferred — its table has no `gu`/`zuek`/`haiek` cells and no `past`/`future`
at all, a conjugation-table gap rather than a sentence-curation one).

**Decision (new `futurePlural ← presentPlural` reuse-by-reference loop):**
found that `futurePlural` sentences were unreachable for `ukan`/`nahi`/
`esan`/`eman`/`gustatu`/`iruditu`/`ahaztu` despite each having both a
`futurePlural` conjugations table and existing `presentPlural` sentences —
no loop aliased one to the other (only `future ← present` existed). Added a
loop mirroring the existing pattern, since the blank doesn't care whether
the plural-object drill is present- or future-tense. This is a structural
fix, not new bank content — distinguished explicitly from genuine
bank-content gaps (e.g. `izan`/`ukan`'s potential/baldintza/conditional/
imperative, which stay form-only because no bank sentence targets them) in
`docs/SAMPLE_SENTENCES.md`'s new "Coverage inventory (#313)" section.

Causative (`-arazi`/`-erazi`) and `ahal` remain explicitly out of scope per
the epic body — documented in the coverage inventory but no `VERBS` entries
authored.

## 2026-06-21 — #312: adopted cultural-bank present/past sentences into egon/joan/etorri/ibili/ukan/jakin/gustatu/ahaztu/saldu-dative

Adopted the "ready" items from #311's curation pass
(`docs/SAMPLE_SENTENCES.md`'s "Adoption-readiness curation" section) as new
array entries alongside each verb's existing sentences — `egon` (5 present +
7 past added), `joan`/`etorri` (present-only, allative/directional,
`validFor: ['etorri']`/`['joan']`), `ibili` (5 present), `ukan` (a new
`presentPlural.haiek` entry + one `past.gu` entry), `jakin` (3 `present.ni`
entries + a new `negativeSentences.past` block), `gustatu` (`presentPlural.ni`),
`ahaztu` (a new `pastPlural.zu` block — `ahaztu` didn't have one yet), and
`saldu-dative` (a new `sentences.past.haiek` — `saldu-dative` had no
`sentences` block at all before this).

**Decision (skipped joan/etorri/ibili's past cultural-bank sentences):** the
curation doc classified these "ready", but checking them against the actual
`VERBS` tables surfaced a mismatch it missed: the bank's "Past (Lehena)"
examples for these three verbs use `imperfectivePast` forms (`zihoazen`,
`zetorren`, `zenbiltzaten`, ...), not the modeled `past` table
(`joan zen`, `etorri zen`, `ibili zen`) `sentences.past` actually drills.
`imperfectivePast` is form-only (no `sentences` support, per its own
doc-comment) — adopting the literal text as-is would silently mismatch the
blank's expected answer with the surrounding sentence's tense reading.
Rewriting them to fit the simple past (e.g. inserting a comma and switching
to a completed-action reading) is plausible but changes the sentence's
nuance enough to want a native speaker's sign-off — left for #316 rather than
guessed here. Same reasoning for `etorri`'s two "needs-rewrite" frameless
past items and `jakin`'s `ba-`-emphatic and conditional past items already
flagged by the curation doc — left unadopted.

**Decision (regenerated `validfor-gap-baseline.json` without new `validFor`
additions):** the new gap slots the CI guard (`validfor-audit.test.js`)
flagged all replicate each verb's *already-established* `validFor` judgment
applied to more variants (e.g. `egon`'s long-standing "no `nor`-sibling takes
a bare locative" rationale, `ukan`'s "nahi/eduki/ikusi/erosi/behar" concrete-
object set) — not new naturalness findings, so the baseline was regenerated
as-is rather than adding new cross-verb `validFor` entries.

## 2026-06-21 — #315: word-order length cap + widened validFor coverage enforcement

**Decision (word-order length policy):** Added `WORD_ORDER_MAX_WORDS = 9`
(`lessonLogic.js`) alongside the existing `WORD_ORDER_MIN_WORDS = 4` —
`meetsWordOrderThreshold` now requires the filled sentence's word count to
fall in `[MIN, MAX]`. Chose an upper cap (over a per-sentence `wordOrder:
false` opt-out tag) because the bound is structural, not sentence-specific:
sampling the cultural bank showed the curated "ready" sentences mostly land
6-9 words, with a tail running to 11; 9 keeps the bulk eligible while
excluding the handful of longer, more syntactically elaborate ones the issue
flagged as becoming unwieldy 12+-token taps. A per-sentence flag would have
meant manually annotating that tail rather than deriving the cutoff once.

**Decision (validFor coverage test):** Widened the existing `nor-nork`
coverage test (#124) to check every tense (not just `present`) and
`negativeSentences` too, since #267 already gives verbs their own
hand-written `sentences.past` rather than reusing `present` by reference.
Scoped to an **explicit allowlist** of the cultural-bank epic's (#310)
`nor-nork` verbs (`ukan`/`jakin`/`eraman`/`ekarri`/`jan`/`edan`/`erosi`/
`hartu`/`ikusi`/`eduki`/`esan`/`eman`/`behar`), not every
`agreement.includes('nork')` verb — widening it to literally every verb or
every `nor-nork` verb surfaced ~39 unrelated vocabulary-expansion verbs
(`egin`, `irakurri`, `saldu`, `bultzatu`, ...) whose hand-written
`sentences.past` predates #310 and has never been `validFor`-tagged. Fixing
that backlog is a substantial, unrelated native-speaker-judgment task, not
something #315 (an engine/test stream) should absorb. `ibili`/`ari` (the
`nor`-cluster verbs #312/#313 are about to enrich) have the same gap and are
left for a follow-up pass once their cultural data actually lands, rather
than pre-emptively tagged now.

**Spot-error/availability check:** no cultural-bank data has landed yet
(#312-314 are still pending), so there's nothing to spot-check the
question-kind distribution against yet — deferred to #312's actual adoption
pass rather than checked against today's unchanged data.

## 2026-06-20 — #311: curated the cultural sentence bank for adoption-readiness

**Decision:** Added an "Adoption-readiness curation (#311)" section to
`docs/SAMPLE_SENTENCES.md` classifying every sentence in its cultural banks
(by-argument-structure, advanced-tenses, extended-set, modal, continuous-aspect,
synthetic-verbs) as `ready`/`needs-rewrite`/`defer`, with a target
`verbId`/`tense`/`person`, a #285 plural-object-agreement flag, and a draft
`validFor`. Doc-only — no `VERBS` changes, per #311's scope; #312–314 do the
actual adoption.

**Why `defer` so often:** two structural gaps drive most verdicts: (1) most
verbs only have `present`/`past`/`future` tables — `conditional`/`potential`/
`imperative` only exist for `izan`/`ukan`, so advanced-tense-bank sentences
mostly can't be adopted yet; (2) `ari` is `present`-only and only has
`ni`/`zu`/`hura`, gutting the continuous-aspect bank. The causative and `ahal`
banks are deferred wholesale per the epic body rather than re-litigated
per-sentence, since both are explicitly pending their own future units.

**Surfaced but not previously documented:** the doc had gone stale relative to
`verbs.js` — `eraman`/`ekarri`'s synthetic-bank sentences and most of
`behar`'s and three of `nahi`'s modal-bank sentences were already adopted
under #260/#261/#266/#267, but the doc still framed itself as "none of this is
in `VERBS` yet." Flagged inline so #312–314 don't re-author already-shipped
content.

## 2026-06-20 — #332: theme-unit audit — front-loaded every available unit's title with its conjugation target

**Decision:** Reframed every `available` unit's `title` (`journey.js`, mirrored
in `journeyTranslations.js`'s es/eu and `docs/LEARNING_JOURNEY.md`) so the
*conjugation/grammar target* leads, with any semantic theme demoted to a
trailing clause — per #332's framing, a unit's identity should be the pattern
it teaches, not a life-theme the pattern happens to illustrate. Also trimmed
every multi-sentence `payload` down to its first example, per #332's "one
example sentence retained" criterion (uniformly across en/es/eu).

**Audit (keep/reframe/merge), by unit:**

| Unit(s) | Verdict | Why |
|---|---|---|
| 1, 2, 4, 5, 6, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 24, 25, 26, 27, 28, 30, 32, 33, 34, 36, 40 | **Reframe** | Title reordered to front-load the verb/grammar term already present in the title or `focus` (e.g. `'Who and Where'` → `'izan & egon — Who and Where'`; `'Daily Routine (Transitive)'` → `'The NOR-NORK Present — dut/duzu/du'`). No new prose invented beyond reordering existing terms, except the 7 units #332 itself proposed wording for (5, 6, 13, 14, 15, 25, 27), which follow the issue's suggested phrasing closely. |
| 3, 7, 8, 10 (gate), 20, 22 (gate), 29, 37, 38 | **Keep** | Title already leads with a grammatical/pattern term (case-marking, "Expansion," a gate's REFRESH name, a construction name, an allocutive-register name) rather than a semantic theme — nothing to reframe. Payload trimmed where it had multiple sentences. |
| 31, 35, 39, 41–45 | **N/A (pending)** | #332's acceptance criteria apply only to `available` units; these have no lesson content yet, so their `pending`-card titles are out of scope for this pass. |
| (none) | **Merge** | No two available units' titles were found to be redundant theme-restatements of the same conjugation target — each maps to a distinct pattern, so no merges were warranted. |

**Why reorder rather than rewrite:** composing new prose carries real risk for
the `eu` (Basque) column in a learner-facing app — this session isn't a native
speaker, so titles were built by rearranging vocabulary/grammar terms already
verified correct elsewhere in the same file, rather than inventing new
phrasing. The `eu` wording was shown to the user for a spot-check before merge.

## 2026-06-20 — #333: audited the dedicated-lesson set against #329's particularity test

**Decision:** Confirmed every remaining single-verb (non-pooled) practice
lesson in `src/data/lessons.js` falls into exactly one of #329's
particularity buckets — no regular verb slipped through as a standalone
lesson after #331's fodder collapse. 19 verbs carry dedicated lessons:

| Verb(s) | Bucket | Why |
|---|---|---|
| `izan`, `ukan`, `egon`, `joan`, `etorri`, `ibili`, `eduki`, `jakin`, `eraman`, `ekarri` | Irregular synthetic morphology | Forms can't be derived from a participle + auxiliary rule; each has its own conjugation table that must be shown directly. |
| `gustatu`, `iruditu`, `ahaztu` | Distinct agreement frame (NOR-NORI) | Dative-subject "psych" verbs — `nor` fixed to `hura`, `person` ranges over `nori` instead of the default `nor`/`nork` axis. |
| `esan`, `eman` | Distinct agreement frame (NOR-NORI-NORK) | Ditransitive — introduce the axis-fixed `recipient`/`agent` metadata (#142) no other taught verb uses. |
| `nahi`, `behar`, `ari` | Modal/aspectual construction | Invariant noun/particle + conjugated auxiliary, not a regular lexical verb — `nahi`/`behar` always select `ukan`, `ari` always selects `izan`, regardless of the lexical verb's own transitivity (`docs/VERB_COVERAGE.md` §5). `ari` isn't named in #329's own "keep dedicated" list, but it's the same shape as `nahi`/`behar` and `VERB_COVERAGE.md` §5 already groups all three together — treated as belonging to this bucket rather than left unclassified. |
| `ikusi` | Pattern introducer (#309 carve-out) | First periphrastic verb taught — introduces the `-tzen dut` shape, present perfect, and imperfective past before any pool reuses them. |

Zero unclassifiable (regular-verb) standalone lessons remain — every fodder
verb (`jan`, `edan`, `erosi`, `hartu`, `egin`, and the rest of `unit-10-present`/
`ukan-past-pool`'s pools, plus `lagundu`/`ekin`/etc. in `dative-verb-*`, plus
the `egin`-construction compounds) lives only in a pooled `sources` array, per
#331's collapse. The Unit 29 dative verbs and `egin` construction are pools,
not dedicated lessons, matching #329 Workstream D's framing of them as
"already pooled" patterns. Causative is still `pending` (not yet in
`LESSONS`), so it has no standalone-lesson question to audit yet.

**Why this matters:** this is the guardrail that #329's restructure actually
achieved its stated point — the journey's surviving per-verb lessons exist
because of a *particularity*, not because a regular verb happened to get its
own lesson before the pooling convention existed.

## 2026-06-20 — #325: repositioned Unit 44 ("The egin Construction") to Unit 29

Moved the egin-construction unit out of the appended-at-the-end Phase
VIII/Stage 17 wrapper (#306's placeholder spot) into its natural position as
a 4th unit inside the existing `phase-4-stage-9` (Communication & Giving),
immediately after Unit 28. That's the earliest point where all four base
verbs the construction draws on (`egin`, `hartu`, `eman`, `egon`) are fully
taught: `egon` lands in Units 2/18, `egin`/`hartu` in Units 13-14 (pool-only
fodder since #331's collapse), and `eman` — the last to complete — in Units
27-28's dedicated NOR-NORI-NORK lessons. Units 29-44 renumbered to 30-45 to
make room (`journey.js`, `journeyTranslations.js`'s `units` keys,
`docs/LEARNING_JOURNEY.md`'s table); the unit's 6 lessons moved within
`lessons.js`'s array (which drives unlock order, independent of `journey.js`'s
`number`) to sit right after `eman-future`. Added the new unit inside the
existing stage rather than a new stage to avoid renumbering stage ids
10-17, following the same precedent #307 set for the same reason. The empty
Phase VIII/Stage 17 wrapper was removed entirely now that it has no content.

## 2026-06-20 — #331: collapsed fodder pool chains into one canonical lesson per pattern

Folded every `-2/-3/…`/`recognition-{1,2}` fodder sibling lesson back into its
canonical pattern lesson, now that #330's carrier sampling bounds session
length regardless of pool size: `unit-10-present`(+`-plural`) absorbed
`-2`…`-6` and `-recognition-1`/`-2` (now 45 sources), `ukan-past-pool`
absorbed the same shape (46 sources, one more than the present pool because
`egin`'s past landed in `-2` rather than `-1`), `izan-past-pool` absorbed
`-2` (10 sources), `dative-verb-present`/`-past` absorbed `-2` (9 sources
each), and `egin-construction-present`/`-past` absorbed `-2` (9 sources
each). The 12 former `recognition-*` pool members (`hausnartu`, `argudiatu`,
`ondorioztatu`, `gaitzetsi`, `aldarrikatu`, `plazaratu`, `sustatu`,
`bultzatu`, `bermatu`, `babestu`, `ziurtatu`, `borobildu`) now carry
`recognitionOnly: true` on their `VERBS` entry instead of living in a
separate `mode: 'recognition'` lesson, so they stay exposure-only even
mixed into a production pool. Removed the 24 deleted ids from `journey.js`'s
`lessonIds` (`nor-fodder-present` was already canonical — never had `-2/-3/…`
siblings — so it needed no change). No `STORAGE_KEY` bump: dropped lesson ids
just leave inert orphan progress entries (`loadProgress` tolerates unknown
keys). Supersedes #318's chaining, per #329's conjugation-first restructure.

## 2026-06-20 — #330: per-session carrier sampling (`CARRIERS_PER_SESSION = 4`)

`createExerciseState` now shuffles and samples up to `CARRIERS_PER_SESSION`
(pinned to 4) sources per play once a pool lesson's `sources` exceeds that
count, instead of generating a round per source. This reverses #318's
chaining of large pools into `-2/-3/…` sibling lessons — the original fix
for the same "pool too big for one session" problem — by removing the reason
that chaining existed: a pool can now stay a single lesson node regardless of
size, with exposure to less-common carriers happening across repeated plays
rather than within every single session. `errorStats` stays keyed
`verbId:tense:person`, so weak-spot reinforcement (review lessons only) still
reaches a verb even on a session that didn't sample it in. Also added
`verb.recognitionOnly`, the per-*carrier* counterpart to lesson-level
`mode: 'recognition'`: it drops every production-adjacent framing including
`spot-error` (which `mode: 'recognition'` deliberately keeps), since a single
recognition-only carrier mixed into an otherwise-typed pool has no per-lesson
"recognition tier" to belong to. Sets up #331's pool collapse (part of #329's
conjugation-first restructure).

## 2026-06-20 — #307: nine "covert dative" verbs land as Unit 29, shifting Units 29–44 to 30–45

Added `lagundu`/`ekin`/`erantzun`/`deitu`/`eragin`/`antzeman`/`mesede-egin`/
`kalte-egin`/`aurre-egin` as new `nor-nori-nork` `VERBS` entries riding
`esan`'s exact shape (`recipient: 'hura'`, dio-family auxiliary, no
`future` table — matching #306's scope precedent). All `validFor: []`,
so none of the cross-verb `agreementsCompatible` overlap these verbs now
have with `esan`/`eman`/each other (confirmed via `agreementsCompatible`
in `src/lessonLogic.js`, which only checks `nork`/`nori` membership) can
leak into distractor generation — the explicit allowlist already used
since #293 means this coordination is satisfied by construction, not by
new engine code.

Placed the new unit as **Unit 29**, immediately after `esan`/`eman`
(Units 27–28, where the dio-paradigm these verbs depend on is taught) —
not literally "after Unit 26" as #307's issue text said, since that
number predated earlier renumbers. Inserting mid-sequence (rather than
appending, as #306 did) forced shifting every `number:` field from
29–44 up to 30–45 across `journey.js`/`journeyTranslations.js`/
`LEARNING_JOURNEY.md`. Per #137's already-confirmed precedent, existing
lesson ids did **not** need to change despite their unit's `number:`
moving — only the new lessons needed ids, and since `unit-29-review`
etc. were already taken by older (now renumbered) units, the new
lessons use descriptive `dative-verb-*` ids instead. New unit added as
a third unit inside the existing `phase-4-stage-9` rather than a new
stage, since stage ids are a single flat sequence across all phases and
a new stage would have forced renumbering stage ids too.

New lessons were inserted **mid-array** in `lessons.js` (between
`eman-future` and the pre-existing Unit-28 block), not appended at the
end like #306's were — lesson unlocking is driven by array order, not
`journey.js`'s `number:` field, so an end-append would have placed
these dative-verb lessons after content that comes much later in the
actual journey.

The "optionally-dative" verb set (`itxaron`/`saldu`/`utzi`/`adierazi`/
`eskatu`/`galdetu`) was deferred to a follow-up issue rather than
bundled in — see `docs/LANGUAGE_DECISIONS.md`'s #307 entry for why it
needs a different sourcing pass.

## 2026-06-20 — #306: `egin`-construction expressions get dedicated `VERBS` entries, appended at the end of the journey

Modeled `hitz`/`lan`/`lo`/`ahaleginak egin`, `parte`/`kontuan hartu`,
`arreta eman`, `ados egon`, `arriskuan jarri` as nine dedicated `VERBS`
entries (Unit 44, "The 'egin' Construction") rather than `sentences` layered
onto the existing `egin`/`hartu`/`eman`/`egon` entries. Each conjugation
string includes the invariant noun/particle (`hitz egiten dut`, `ados
nago`) — same shape as `nahi`/`behar` (`nahi dut`, `behar dut`), not `ari`
(`ari naiz` + a separately-varying participle), because here the invariant
word is genuinely fixed per expression rather than varying per sentence.
Dedicated entries win over layering because each expression's meaning ("to
talk", "to pay attention", "to agree") is opaque from the base verb's gloss
alone — a learner drilling `egin`'s own table never discovers "hitz egin"
exists unless it has its own lesson identity. This also resolves §5's open
design question in `docs/VERB_COVERAGE.md`, left open since `nahi`/`behar`/
`ari` first landed.

`jarri` itself does **not** get a standalone `VERBS` entry — per #306's own
suggested fallback, `arriskuan-jarri` is modeled as one self-contained
phrase entry (`agreement: ['nor']`, riding `izan`'s suffixes + `jarri`'s
derived `jartzen`/`-ko` non-finite forms) instead of standing up a base
`jarri` paradigm that nothing else in the curriculum currently needs.

Unit 44 is **appended at the end of `journey.js`** (a new Phase VIII)
rather than inserted at its "natural" curricular spot, right after `egin`/
`hartu`/`eman`/`egon` are first taught. Lesson unlocking
(`getUnlockedLessonIds`) keys off `LESSONS`' array order, not `journey.js`'s
unit `number` field, so inserting mid-sequence would force re-numbering
~30 subsequent units (Phases V-VII) just to keep the displayed numbers
contiguous — pure churn with no functional benefit, since the unlock chain
itself doesn't care about `number`. A follow-up issue tracks doing that
renumber deliberately and moving Unit 44 to wherever it best fits once
the curriculum is reorganized on purpose, rather than as a side effect of
this change.

## 2026-06-20 — #321: academic/rare fodder tier landed as `mode: 'recognition'` pools, completing #304's split

The last of #304's split-out tiers. 12 regular nor-nork verbs
(`hausnartu`, `argudiatu`, `ondorioztatu`, `gaitzetsi`, `aldarrikatu`,
`plazaratu`, `sustatu`, `bultzatu`, `bermatu`, `babestu`, `ziurtatu`,
`borobildu`) landed in their own pools (`unit-10-present-recognition-1/2`
+ `-plural`, `ukan-past-pool-recognition-1/2` + `-plural`) rather than
mixed into `unit-10-present-4/5/6`/`ukan-past-pool-4/5/6`, since #318
reserved this tier as `mode: 'recognition'` — exposure-only, no typed
production framings — and `generateQuestions`/`describeLesson` already
support that flag on a plain `sources`-array pool lesson without
`review: true` (precedented by `unit-23-number-split-review` etc., but
nothing required pairing the two). Keeping a separate set of pools (rather
than flagging the whole existing pool-4/5/6 set as recognition-only) keeps
the regular fodder tier's typed-production drilling intact. Closes #304's
split (#318/#319/#320/#321 all landed).

## 2026-06-20 — #320: mid/low fodder tier landed exactly per #318's reserved plan; completes the regular-`nor` pools #319 left partial

Implemented #318's reserved pool plan for the 18 mid/low-tier (+ #304's seven previously-unassigned) verbs: added `unit-10-present-4`/`-5`/`-6` (+`ukan-past-pool-4`/`-5`/`-6`, +`-plural` siblings) for the 16 `nor-nork` verbs, split 6/6/4 exactly as #318's table specified, and wired them into Unit 13/14's `lessonIds`. For the 2 regular-`nor` verbs (`erori`, `jaiki`), filled `nor-fodder-present`/`-plural`'s and `izan-past-pool-2`/`-plural`'s remaining slots — both pools now sit at #318's 6-source cap, completing the pools #319 had explicitly left at partial capacity (4 and 2 sources respectively) pending this issue. No cap deviations needed this time — every pool lands at or under 6 sources.

## 2026-06-20 — #319: high-frequency fodder tier landed; one deviation from #318's reserved plan

Implemented #318's reserved pool plan for the 16 high-frequency verbs: extended `unit-10-present`/`-plural` with `egin` (filling its last slot to the 6-source cap); added `unit-10-present-2`/`-3` (+`-plural` siblings) and the regular-`nor` `nor-fodder-present`/`-plural` pool (Unit 6); added `izan-past-pool-2`/`-plural` (Unit 12, partial — `hasi`/`bizi izan` only, 2 of #318's eventual 4, since the other 2 (`erori`/`jaiki`) belong to #320's tier) and filled `izan-past-pool`'s 2 free slots with `sartu`/`atera`.

**One deviation:** #318's table paired `unit-10-present`'s `egin` extension with no past-side counterpart, but `ukan-past-pool` was already at the 6-source cap with no free slot. Rather than leave `egin`'s past unpooled, it joins `ukan-past-pool-2` alongside the pool-2 present-side verbs — 7 sources, matching the already-accepted `nor-nork-*-plural-pool` precedent (not a new cap-busting exception, just reusing the one that already exists). `unit-10-present-2` itself stays at 6 (no `egin`) since its present-side slot was already used by the cap-1 extension above.

## 2026-06-20 — #318: fodder pool capacity plan — cap at 6 sources, chain into `-2`/`-3`/… siblings, new pools for regular `nor` fodder

**The cap.** `TARGET_EXERCISE_COUNT`'s rounding floor (see the #309 entry below) means a 3-person pool's question count is `3 × sources × max(1, round(4/sources))` — flat at 12-15 up to 5 sources, then growing by +3 per source past that. Capping every fodder pool at **6 sources** (18 questions) keeps new pools close to today's existing ceiling (the live `nor-nork-present-plural-pool`/`nor-nork-past-plural-pool` already sit at 7 sources/21 questions — accepted, but not exceeded further). When a tier's verb list would overflow a pool's remaining capacity, the overflow starts a new sibling pool suffixed `-2`, `-3`, etc., rather than growing one array without bound — same shape `unit-10-present`/`unit-10-present-plural` already use.

**`nor-nork` side — chain off the existing ukan-present/ukan-past pools.** `unit-10-present`/`-plural` (5 sources today) has one slot free before the cap; `ukan-past-pool`/`-plural` (6 sources) is already at cap, so its chain starts fresh at `-2`. Reserved plan, by #304's tiers (verbs assigned to the *same-numbered* pool in both chains, so a verb's present and past always travel together):

| Pool pair | Verbs | Tier |
|---|---|---|
| `unit-10-present(+plural)` (extend, +1 slot) | `egin` | high-freq |
| `unit-10-present-2(+plural)` / `ukan-past-pool-2(+plural)` | `irakurri, idatzi, ikasi, entzun, utzi, aurkitu` | high-freq |
| `unit-10-present-3(+plural)` / `ukan-past-pool-3(+plural)` | `bilatu, galdu, jaso, saldu, itxaron` | high-freq (5 — completes the 12-verb tier with `egin`+pool-2) |
| `unit-10-present-4(+plural)` / `ukan-past-pool-4(+plural)` | `eskatu, galdetu, adierazi, bukatu, amaitu, gainditu` | mid/low |
| `unit-10-present-5(+plural)` / `ukan-past-pool-5(+plural)` | `bereiztu, ezagutu, sentitu, pentsatu, sumatu, ulertu` | mid/low |
| `unit-10-present-6(+plural)` / `ukan-past-pool-6(+plural)` | `aztertu, ukatu, batu, planteatu` | mid/low (4 — completes the 16-verb tier with pools 4+5) |
| `unit-10-present-recognition-1(+plural)` / `ukan-past-pool-recognition-1(+plural)` | `hausnartu, argudiatu, ondorioztatu, gaitzetsi, aldarrikatu, plazaratu` | academic/rare, `mode: 'recognition'` |
| `unit-10-present-recognition-2(+plural)` / `ukan-past-pool-recognition-2(+plural)` | `sustatu, bultzatu, bermatu, babestu, ziurtatu, borobildu` | academic/rare, `mode: 'recognition'` (completes the 12-verb tier) |

Recognition pools still respect the 6-source cap — `mode` doesn't change the rounding math, only the question style.

**`nor` side — no pool exists yet, so these are new lesson ids.** Unit 6 ("Moving Around") and Unit 12 ("izan Past Pool") today hold `joan-present`/`etorri-present`/`ibili-present` (single-verb, not pooled) and `izan-past-pool` (pooled: `izan, joan, etorri, ibili` — 4 sources, 2 slots free) respectively. Per #304's 6 regular-`nor` fodder verbs (`sartu, atera, hasi, bizi izan, erori, jaiki` — no academic/rare tier on this side):
- **Present:** brand-new pool `nor-fodder-present`/`nor-fodder-present-plural`, all 6 verbs (fits the cap exactly) — attaches to Unit 6's `lessonIds`, after `unit-3-review`. `joan-present`/`etorri-present`/`ibili-present` are left untouched (they're synthetic-paradigm introducer lessons per #309, not fodder).
- **Past:** extend `izan-past-pool`/`-plural` with its 2 free slots (`sartu, atera` — the highest-frequency two), reaching cap (6); the remaining 4 (`hasi, bizi izan, erori, jaiki`) go to a new `izan-past-pool-2`/`-plural`, attached to Unit 12's `lessonIds`.

**Future tense is out of scope for now.** Per the `behar`/`nahi` precedent ("past isn't drilled until/unless a future unit adds it" — `lessons.js`), a fodder verb's `-ko`/`-go` future can be sourced into `verbs.js` without a dedicated lesson; wiring it into a future-mixer-style review (Unit 18's pattern) is deferred until/unless a future issue picks it up.

**Open question from #318 resolved: don't land empty-`sources` placeholder lessons now.** `journey.test.js` requires every `lessonIds` entry to resolve into `LESSONS` and vice versa, and `generateQuestions` can't run against an empty `sources` array — so the pool ids above are *reserved names*, not yet-created entries. Each tier issue (#319 high-freq, #320 mid/low, #321 academic/rare) wires its own pools into `lessons.js`/`journey.js` atomically with its verb data landing in `verbs.js`, using exactly the pool ids/groupings reserved here so the three issues don't collide or re-decide pool shape.

## 2026-06-20 — #309: codified "pattern-first" as the journey's organizing rule; audit found the journey already conforms

**Decision:** wrote the pattern-first principle (a verb earns a dedicated lesson only for irregular synthetic morphology, a distinct agreement frame, a special construction, or a specific known error to drill — everything else is interchangeable pool fodder) into `docs/LEARNING_JOURNEY.md`'s "Core pedagogical realignment" as item 7, including the **introducer carve-out**: a pattern's first appearance may use one clean carrier verb even if that verb is otherwise regular (`ikusi-present`, Unit 5, introducing the `-tzen dut` pattern, keeps its slot on this basis — it's not redundant verb-drilling).

**Audit of every single-verb practice lesson in `src/data/lessons.js`** (per #309's expected outcome — "nearly all are synthetic or introducers; flag any true fodder-as-standalone exceptions"):
- **Synthetic** (own irregular paradigm, correctly keeps a dedicated lesson): `izan`, `egon`, `ukan`, `jakin`, `joan`, `etorri`, `ibili`, `eduki` — across every tense/register lesson built on them (present/past/future/potential/baldintza/conditional/imperative/toka/noka/hi). `eraman`/`ekarri` are also `type: 'synthetic'` in `verbs.js` (their present/past are single-word native forms, not `-tzen dut`-style periphrastic), so Unit 15's `eraman-present`/`ekarri-present` etc. are synthetic-paradigm lessons, not fodder, despite being added later (#296) on the "already-taught nor-nork shape" framing.
- **Introducer** (Decision A's carve-out): `ikusi-present`/`-present-plural`/`-present-perfect`/`-habitual-past` — `ikusi` is `type: 'periphrastic'` and otherwise a regular `nor-nork` verb, but each of these lessons is the *first* appearance of its respective pattern (`-tzen dut`, the present-perfect participle+aux shape, the imperfective-past shape), with no other periphrastic verb pooled in yet at that point in the sequence.
- **Distinct agreement frame**: `gustatu`/`iruditu`/`ahaztu` (NOR-NORI), `esan`/`eman` (NOR-NORI-NORK) — correctly dedicated, per the rule's test 2.
- **Special construction**: `nahi`/`behar` (modal, infinitive-complement frame) — correctly dedicated, per test 3.

**Result: zero fodder-as-standalone exceptions found.** No single-verb lesson needs to be torn down or folded into a pool; #304/#306/#307 can proceed without a prerequisite refactor here.

**Decision B (in-context meaning for pool fodder) — already implemented, no engine work needed.** Checked `ExerciseScreen` (`App.jsx`): the one-time conjugation-table preview (`LessonPreviewScreen`) is already gated on `!lesson.sources` (line ~2235), so pooled multi-verb lessons (e.g. `unit-10-present`) already skip the single-verb preview and rely on in-question gloss/sentence exposure — exactly Decision B's intended behavior, pre-existing.

**Distractor plausibility at larger pool sizes — no action needed.** `buildTaggedOptions` caps every question at 3 distractors (`.slice(0, 3)` in `lessonLogic.js`) regardless of how many sources/sibling verbs are available to borrow from, so growing a pool's `sources` array doesn't degrade plausibility or flood a question with near-identical participles — it only widens the *variety* of which 3 get picked. No engine change needed; #304 just needs to watch the question-*count* ceiling above, not distractor count.

**Flag for #304 — pool question-count ceilings will need attention as fodder lands.** `TARGET_EXERCISE_COUNT = 12` (`App.jsx`) self-balances `rounds` per source (`rounds = max(1, round(targetPerSource / personCount))`), but that floor of 1 round per source means a pool's total question count grows roughly linearly once `sources.length` exceeds `TARGET_EXERCISE_COUNT / personCount` (~4 sources for a 3-person pool) — today's pools (5-7 sources) already sit a bit over 12 questions for this reason. #304 plans to append ~40 verbs to a handful of existing pools (`unit-10-present`, the `nor-nork-*-plural-pool`s, the Unit 6/12 motion pools); appending all of them to one `sources` array would land such a pool well past 30 questions. #304's own "frequency sequencing" section already anticipates splitting by tier (high/mid/academic) rather than one mega-pool — this confirms that split is necessary, not just a nice-to-have, and should produce multiple sibling pool lessons (mirroring the existing `unit-10-present`/`-plural` pattern) rather than one `sources` array per pattern.

## 2026-06-20 — #293: dative-overgeneration lure swaps just the auxiliary, not a constructed minimal pair

**Decision:** the `eramango diot`-for-`eramango dut` distractor (learners over-extending a phantom dative onto verbs that are optionally ditransitive in real usage) is built by reusing real data, not by hand-authoring a fake `nor-nori-nork` conjugation. `eraman`/`ekarri`/`erosi`/`hartu`'s periphrastic tenses already have the shape `<participle> <auxiliary>` (`eramango dut`), and `esan`'s same-tense/person form is also `<participle> <auxiliary>` (`esango diot`) — so `getDativeOvergenerationLure` (`lessonLogic.js`) just takes the verb's own participle and grafts on the sibling's auxiliary. This sidesteps the issue's original concern that no `nor-nori-nork` data exists for these verbs to borrow a whole form from — the auxiliary half is the only part that needs to come from a sibling, and `esan` already supplies it. It also means no new exercise/sentence-completion format is needed: the lure slots into the existing per-table multiple-choice `priorityCandidates` mechanism alongside `getCaseFrameLure`, gated on the same `nork`/`nori` condition.

The sibling lookup (`getDativeOvergenerationSibling`) is the inverse axis of `getCaseFrameSibling` — same `nork` status, opposite `nori` status — and additionally requires `recipient` (not `agent`) on the candidate, since only a `recipient`-fixed verb's `person` key means NORK the same way the NOR-NORK verb's does; `eman` (`agent`-fixed, `person` over NORI) would pair up unrelated persons if used. Eligibility is opt-in via a new `dativeOvergeneration: true` flag on `eraman`/`ekarri`/`erosi`/`hartu` rather than firing for every NOR-NORK verb — `jan`/`edan` don't take a natural dative in basic sentences, so the same swap there wouldn't reflect a real learner error. `eduki`/`ikusi` (flagged "to a lesser extent" in the issue) were left unflagged for now; can be added later with no further mechanism work.

## 2026-06-19 — #296: "Carrying & Bringing" repositioned from the Phase VII bonus tail to Stage 4, as new Unit 15

Moved `eraman`/`ekarri` ("Carrying & Bringing") out of Phase VII's "Bonus: Curiosities & Color" (where it had been appended as Unit 43 purely to avoid a renumber — see the #262 entry below) into Phase II / Stage 4 "Daily Actions", as new Unit 15, immediately after Unit 14. `eraman`/`ekarri` are plain `nor-nork` synthetic verbs in the already-taught `eduki`/`jakin` shape, introducing zero new grammar — they were never actually a "curiosity," just stranded at the end of the curriculum by the renumber-avoidance tradeoff. This time the renumber cost is paid directly: every unit from the old 15 onward shifts +1 (old 43 → 44 would have resulted from a naive shift, but since old 43's content *is* the relocated unit, the final count stays at 43 units, not 44). Refresh Gates B/C/D shift again, from 21/28/40 to 22/29/41. Lesson ids (`eraman-present`, `ekarri-present`, etc.) are unchanged despite the renumber, per the "lesson ids stay stable across renumbers" precedent (#137) — only the `number:`/translation-key fields move. The original issue text said to insert the unit "before Unit 14," but #286 (same day, landed first) had already extended both Units 13 and 14's `lessonIds` with NOR-number-axis pool lessons, so the new unit was placed *after* Unit 14 instead — same stage, same intent, keeps Unit 14's now-extended content as one coherent block.

## 2026-06-19 — #286: NOR-number-axis pools added as extra `lessonIds` on Units 13/14, not a new unit

The plural-object (`dut` vs. `ditut`, `zenuen` vs. `zenituen`) drills for the core transitive verbs (`ukan`/`jan`/`edan`/`erosi`/`hartu`/`ikusi`/`eduki`) were added as two new pool lessons each (`nor-nork-present-plural-pool(-plural)`, `nor-nork-past-plural-pool(-plural)`), appended to Unit 13's and Unit 14's existing `lessonIds` rather than spun out into a dedicated unit — mirrors the Unit 23/26 precedent where the dative family's object-number drills (`gustatu-present-plural` etc.) were added as extra lessons within the unit that introduced the verb family, not a new unit, and avoids a renumber. `eduki` is included in both pools even though its singular-object present doesn't debut until Unit 15 — its `presentPlural`/`pastPlural` tables share the same `ditut`/`zenituen` suffix family as the rest of the pool (#284), and excluding it just to wait for Unit 15 would have meant either a third pool or asymmetric coverage for no real benefit. `jakin` is excluded from the past-plural pool (no `pastPlural` table — its plural-object form is the synthetic `dakizki-` family, a different shape, tracked separately in #287).

## 2026-06-19 — #283: `getRecencyContrastLure` is a new function alongside `getCrossTenseLure`, not a replacement

Unit 11's present-perfect/simple-past lure (`etorri naiz` vs. `etorri nintzen`) is a *separate* function from #141's existing `getCrossTenseLure` (which only ever returns `past`'s own *present*-tense form), rather than extending `getCrossTenseLure` to prefer `presentPerfect` over `present` when both exist. Reusing it would have changed `izan`'s long-standing past-tense lure (`naiz`, the present form) to `izan naiz` (the presentPerfect form) as a side effect, churning existing behaviour and tests for a verb the recency-contrast lesson isn't really about — `izan`'s own present/past confusion (`naiz`/`nintzen`) predates `presentPerfect` and is still the more apt lure there. The two lures now coexist as separate `priorityCandidates` entries (`getCaseFrameLure`/`getCrossTenseLure`/`getRecencyContrastLure`/`getObjectNumberLure`), gated on `tense === 'past' || tense === 'presentPerfect' || ...` — `presentPerfect` added to that gate since nothing previously triggered `baseFormLures` for it. Generalized `lureRationaleTense`'s three i18n strings (en/es/eu) to be tense-agnostic ("a different tense", not "the present-tense form... in the past") since the lure can now point either direction.

## 2026-06-19 — #282: Unit 11 lessons split izan/ukan-branch, single `unit-11-review`, no recency-contrast questions yet

Unit 11 (`presentPerfect`, #281's data) flips to `available` with five lessons: an `izan`-branch pool (`izan`/`joan`/`etorri`, mirroring `izan-past-pool`'s shape) + its `-plural` sibling, an `ukan`-branch single-verb lesson (`ikusi` — the only Unit 13 verb with a `presentPerfect` table) + its `-plural` sibling, and one `unit-11-review`. The review only sources `presentPerfect` material (not `past`), even though the unit's whole point is the `gaur ... da` vs. `atzo ... zen` recency contrast — `past` for these verbs is taught in Unit 12, which comes *after* Unit 11 in the strictly-linear lesson order, so a Unit 11 review can't yet draw on it without jumping ahead. Added a missing `TENSE_META.presentPerfect` entry (and `tensePresentPerfect` i18n keys) that `describeLesson` needed to render these lessons at all — `#281` added the conjugation data but not this UI metadata, since it only touched `verbs.js`'s data, not lesson-facing labels.

## 2026-06-19 — #285: plural-object nouns paired with singular-object auxiliaries fixed by singularizing the noun, not by moving the sentence to a plural table

**Decision:** audited every NOR-NORK verb's `sentences`/`pronounSentences` for
a noun/auxiliary number mismatch (e.g. `erosi`'s `'Zuk sagarrak ___?'` reads
plural "apples" but its `present` table only conjugates the singular-object
`du`-stem, not the plural-object `ditu`-stem). Found and fixed 12 instances
across `erosi` (8), `hartu` (1), `ikusi` (2), and `eraman` (1) — `ukan`,
`eduki`, `jan`, `edan`, `nahi`, `jakin`, and `ekarri` were already clean.
For `sentences` entries (blank-fill, conjugated form substituted at question
time) the fix is to singularize the noun (`sagarrak` → `sagar bat`) rather
than move the sentence into `presentPlural`/`pastPlural`, since #286's
dedicated plural-object lessons don't exist yet and an unreachable sentence
fixes nothing. For `pronounSentences` (fully literal strings, no
substitution) the fix is the opposite — correct the auxiliary to its plural
form in place (`erosi`'s `zuek` cell: `duzue` → `dituzue`, keeping
"liburuak" plural) — since there's no noun/conjugation pairing to break.
`eraman`'s `haiek`-past cell was singularized rather than aux-pluralized
because `eraman` has no plural-object conjugation table at all (per its own
code comment), so a plural noun there has no correct aux to pair it with
either way.

## 2026-06-19 — Present perfect (*Lehenaldiko Burutua*) added to the journey as Unit 11; later units renumbered +1

**Decision:** inserted a present-perfect unit ("What Just Happened — The Recent
Past") into `JOURNEY` as **Unit 11**, the first unit of Phase II's Stage 3
("Looking Back I"), immediately before the `izan` past pool. Every existing
unit numbered ≥ 11 shifted up by one (old 11–42 → 12–43); the score-gated
Refresh Gates are now **B = Unit 21, C = Unit 28, D = Unit 40** (Gate A stays
Unit 10). The unit is `pending` — placement is settled, but its conjugation
tables and lessons are not built yet (tracked by dedicated implementation
issues).

**Why here, and why a real unit (not 11a/11b):** the present perfect is the
perfective participle + a *present* auxiliary (`etorri naiz`, `ikusi dut`) — the
*same* participle the "Looking Back" past pools use, but with the present
auxiliary already mastered in Units 1–2. So it's the natural **on-ramp into the
past system**: it introduces the participle with **zero new auxiliary**, then
Units 12/14 swap that known participle onto the *past* auxiliary, letting them
foreground the **recency contrast** (`gaur etorri da` vs. `atzo etorri zen`)
that `LANGUAGE_DECISIONS.md`'s present-perfect scope note (the `atzo`-only
past-frame fix) had to sidestep. This honours the journey's "don't introduce two
novelties at once" principle (cf. the ergative leap's 3-unit on-ramp, the
Expansion split into Units 7–8). It is deliberately **not** a late Phase III
"aspect" unit: the form is foundational and high-frequency (Gate A's Unit 10
negation drills already manipulate it implicitly in `Mutila ez da etorri`).

**What this touched:** `src/journey.js` (new pending unit + `number:` bumps +
gate-reference comments), `src/i18n/journeyTranslations.js` (new Unit 11 entry +
unit-key renumber; `npm test`'s `journey.test.js` enforces a translation entry
per unit number), and `docs/LEARNING_JOURNEY.md` (new row + renumber + banner).
Lesson ids are unaffected (none added; the unit is pending). The design specs
keep their own numbering: `LEARNING_JOURNEY_PROPOSED.md` got a note that live
Unit N = its N-n − 1 for N ≥ 12, and `LEARNING_JOURNEY_EVALUATION.md` is frozen
historical. Data/lesson work (a `presentPerfect` tense table per core verb,
mirroring the existing `past` pool tables, plus the lessons and the recency
distractor) is deferred to the implementation issues rather than folded in here.

## 2026-06-19 — #267: `behar` gets `sentences` (infinitive-complement) + a `past` table

**Decision:** added `behar`'s first `sentences` data (`present`/`past`/
`future`, one variant per person, all `validFor: []`) and a `past`
conjugation table (`behar nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten` —
`ukan`'s exact past suffixes, no `-ko`, mirroring how `present`/`future`
already ride `ukan`'s suffixes), closing the "behar has no past tense or any
sentences data" gap from epic #256/2026-06-18's deferral note.

**Sentence shape:** unlike the `nor-nork` cluster's "[subject] [object noun]
___" frames, `behar`'s complement is an infinitive ("Joan behar dut"), so
each sentence blanks only the trailing `ukan` auxiliary after an
infinitive-complement clause (e.g. "Sukaldariak legatz freskoa garbitu behar
___."). This needed no `lessonLogic.js` changes — the blank is still a single
trailing token, the same shape the object-noun sentences already use.
Sentences are adapted (not copied verbatim) from `docs/SAMPLE_SENTENCES.md`'s
modal-verb bank: several of the bank's drafted `behar` sentences use a
plural complement object (e.g. "ura eta mapak" → `dituzte`), which doesn't
match `behar`'s singular-object-only table (`object: 'hura'`, no
`*Plural` conjugations) — those were paraphrased to a singular object
instead of adding a parallel plural-object table, which felt like scope
creep for this issue. Revisit if `behar` ever gets `presentPlural`/etc.

**`validFor`:** left empty throughout, same reasoning already established
for `nahi`'s own infinitive-complement variants (`'Zuk etorri ___?'` etc.):
an infinitive complement has no `nor-nork` object-noun sibling whose form
actually fits the sentence, and `behar`'s trailing auxiliary is identical to
`ukan`'s bare form for the same person/tense (`dut`, `zuen`, ...) — tagging
`ukan` would surface a same-text "duplicate correct" option, not a real
distractor.

**Baseline note:** adding `behar`'s `past` table newly exposes ~62
`validfor-delta-audit.mjs` gap slots on *other* verbs' `past`/`future`
sentences (`eduki`/`ekarri`/`eraman`/`edan`/...) that already had `behar`-
shaped present/future gaps unaddressed before this change (128 → 190 total
gaps for `behar` as audit *host* target) — these are pre-existing, *other*
verbs' validFor decisions, out of scope for this issue; regenerated
`scripts/validfor-gap-baseline.json` to reflect the new count rather than
tagging them here.

## 2026-06-19 — #268: past-tense sentences no longer reuse present-tense text by reference

**Decision:** the post-`VERBS`-array loop that filled in `sentences.past`
used to run `verb.sentences.past = verb.sentences.present` unconditionally
for every verb with a `conjugations.past` table — reusing the exact same
sentence object (by reference) for both tenses. That reads as tense-
ambiguous: "Hura kalean ___." gives no cue whether the blank wants `dabil`
(present) or `ibili zen` (past), since nothing in the sentence marks *when*.
Gave `izan`/`egon`/`jakin`/`joan`/`etorri`/`jan`/`edan`/`erosi`/`ikusi`/
`eduki`/`ibili` their own hand-written `sentences.past`, each variant
derived from its present-tense counterpart by inserting a past-time adverb
(rotating through `atzo`/`herenegun`/`joan den astean`/`lehengo egunean`/
`duela bi egun`/`aurreko igandean`/`iaz` for variety within a verb — reuse
across *different* verbs is fine) right after the subject noun phrase (or
after the fronted dative phrase for nor-nori verbs). `etorri`'s present
sentences already baked in present/future time words (`orain`/`bihar`/
`gaur`); those got swapped for past equivalents rather than having a second
time word appended. Every `{text, validFor}` variant keeps its exact
original `validFor` array; bare-string variants stay bare in the past
version (no new `validFor` key invented for them).

Also extended the same treatment to `gustatu`/`iruditu`/`ahaztu` even
though #264 concluded no changes were needed there — #264's reasoning was
specific to *closing the gap-surface delta*, but the underlying ambiguity
this issue is about applies just as much to them (their present sentences
carry no time-marking at all, e.g. "Niri hau ___." for `gustatu`), so they
now also get explicit `sentences.past` with a time word inserted after the
fronted dative phrase. This doesn't reopen #264 — it's a different axis
(naturalness of the frame, not `validFor` coverage) addressed here.

The loop itself changed from unconditional reuse to a fallback: `if
(!verb.sentences?.past && verb.sentences?.present) verb.sentences.past =
verb.sentences.present`. That fallback turned out to matter beyond just
guarding future additions — it surfaced a pre-existing bug where the old
unconditional version was silently clobbering `ukan` (#259), `eraman`, and
`ekarri` (#260/#261)'s own hand-written `sentences.past` tables with their
`sentences.present` object on every module load. Those three verbs' data
was untouched by this change; only the loop logic fix was needed for their
real past sentences to actually take effect.

`pronounSentences.past` keeps the reuse-by-reference behavior unchanged —
`pronoun`/`type-pronoun` questions don't surface a sentence frame's tense
the same way, so they're out of scope here, as is the separate
`negativeSentences.past` loop gated by `SINGLE_WORD_PAST_NEGATION`.

Regenerated `scripts/validfor-gap-baseline.json`: `jakin`/`jan`/`edan`/
`hartu`/`eraman`/`ekarri` gap counts dropped (new past sentences/restored
real past sentences close some previously-shared present/past gap slots),
`erosi`/`ikusi` rose slightly (new past variants add genuinely new gap
slots not present in the old reused-by-reference present text); all other
verbs' counts are unchanged.

## 2026-06-19 — #265: `esan`/`eman`'s `validFor` stays empty — confirmed, not just left over

**Decision:** no `validFor` tags added between `esan` and `eman` (`src/data/
verbs.js`'s only two `nor-nori-nork` verbs) — every variant keeps `validFor:
[]`, across `present`/`presentPlural` and (via the `sentences.future =
sentences.present`/`sentences.past = sentences.present` reference-sharing
loops also covered in #264) `past`/`future` too. `node scripts/
validfor-delta-audit.mjs --verb esan`/`--verb eman` confirms exactly 16 gap
slots each, one per `{tense, person}` cell where the other verb has a
same-person form — and all 16 are correctly left untagged.

**Why no substitution works, for any of them:** `agreementsCompatible`
returns `true` for two `nor-nori-nork` verbs (same agreement-array shape), so
the engine would happily offer `eman`'s forms as `esan` distractors (and vice
versa) if `validFor` invited it. Two independent reasons block it:

1. **Fixed-argument mismatch.** `esan`'s `recipient: 'hura'` fixes NORI, so
   its varying `person` tracks NORK ("Zuk egia esan**diozu**" — *you* tell
   him). `eman`'s `agent: 'ni'` fixes NORK, so its varying `person` tracks
   NORI ("Nik liburua zuri ema**ten dizut**" — I give it to *you*). The same
   `person` key (`zu`, `hura`, `zuek`, `haiek`) therefore names a different
   grammatical role in each verb's conjugated form — dropping `eman`'s
   `zu`-form into `esan`'s "Zuk egia ___." sentence isn't "wrong verb, right
   shape," it's a subject/object agreement mismatch baked into the
   morphology, the same class of break the per-sentence `validFor` schema
   (`docs/SENTENCE_FRAMES.md`) was built to keep out.
2. **No idiomatic overlap.** Even where the morphology lined up, "egia eman"
   ("give the truth") and "liburua esan" ("tell the book") aren't natural
   Basque the way "egia esan"/"liburua eman" are — the verbs' own cue nouns
   (truth vs. book) were chosen because they don't cross over.

Added explanatory comments at both verbs' `sentences` blocks (replacing a
stale comment on `esan` that claimed `agreementsCompatible` itself excludes
nor-nori-nork cross-borrowing — it doesn't; `esan`/`eman` *are* mutually
`agreementsCompatible`, they're just not substitutable for the reasons
above). No third `nor-nori-nork` verb exists yet, so this is necessarily
within-pair only — re-examine if one is added.

## 2026-06-19 — #264: `gustatu`/`iruditu`/`ahaztu`'s past/future `validFor` — no-op, confirmed via reference

**Decision:** no `src/data/verbs.js` edits needed beyond #263. Confirmed via
`scripts/validfor-delta-audit.mjs --verb <id>` and reading `verbs.js`'s
post-`VERBS`-array loops:

- `sentences.future = sentences.present` and `sentences.past =
  sentences.present` (object-reference assignment, not a copy) already run
  for every verb with a `future`/`past` conjugation table — including
  `gustatu`/`iruditu`/`ahaztu`. So #263's present-tense `validFor` judgments
  (`gustatu`↔`ahaztu` substitute, `iruditu` substitutes with neither)
  automatically apply to `past`/`future` too, with zero duplication needed —
  the delta-audit tool confirms identical gap entries (same sentence text,
  same `validFor: []` on `iruditu`'s host slots) showing up under `past`/
  `future` exactly mirroring `present`.
- `pastPlural`/`futurePlural` have **no `sentences` sub-table at all** for
  any of the three verbs (only `presentPlural` does) — confirmed there's no
  analogous reuse loop for the plural variants, and the delta-audit tool
  reports zero gap slots under either key. Per `verb.sentences?.[tense] ??
  {}`'s fallback (`lessonLogic.js`), lessons drilling these tenses simply
  fall back to plain conjugation-table questions — the same "form-only, no
  sentence frames" shape already established for `behar` (`docs/
  LEARNING_JOURNEY.md`, Unit 19). Nothing to tag.

## 2026-06-19 — #263: tagged `gustatu`/`iruditu`/`ahaztu`'s present `validFor`

**Decision:** replaced the empty `validFor: []` placeholders in
`gustatu`/`iruditu`/`ahaztu`'s `sentences.present`/`presentPlural` with real
cross-verb tags, judged per-sentence rather than assuming full mutual
substitution among the three `agreementsCompatible` siblings:

- `gustatu` ("X pleases me") ↔ `ahaztu` ("X got forgotten to me") tag each
  other: both take a bare object + dative auxiliary with no further
  complement, so "Niri liburua gustatzen zait" / "...ahaztu zait" are each
  fully natural, self-contained sentences either way.
- `iruditu` ("X seems [to be some way] to me") tags neither direction, and
  isn't tagged onto by either sibling: its sentences need a predicate/adverb
  telling *how* something seems (`"Niri ongi ___."` — "ongi" is the
  predicate `iruditu` requires), and that adverb doesn't combine naturally
  with `gustatu` ("ongi gustatzen zait" reads oddly) or `ahaztu` ("ongi
  ahaztu zait" doesn't parse). Conversely, bare "Niri hau/liburua iruditzen
  zait" (no predicate) reads as incomplete, so `iruditu`'s form doesn't
  substitute into `gustatu`'s/`ahaztu`'s bare-object sentences either.

Regenerated `scripts/validfor-gap-baseline.json` — gap counts for `gustatu`/
`ahaztu` *dropped* (48 → 24 each) rather than rose, since closing previously
-unclaimed `validFor: []` slots closes gaps instead of opening new ones (the
inverse of the usual "new verb/sentence" pattern, but the same underlying
mechanism). The remaining 24 gaps on each are `iruditu`'s present-tense
sentences, explicitly left untagged per the judgment above — `#264` covers
`past`/`future`/`pastPlural`/`futurePlural`.

## 2026-06-19 — #262: wired `eraman`/`ekarri` into `LESSONS`/`journey.js`

**Decision:** placed `eraman`/`ekarri` as a brand-new **Unit 42 ("Carrying &
Bringing"), Phase VII Stage 17**, rather than folding them into any existing
`pending` unit or inserting them earlier in the renumbered core sequence
(Units 1-39). Surveyed every currently-`pending` unit (27, 31, 35, 37-39, 40,
41) and none thematically fit "carry/bring" — but both verbs are plain
nor-nork synthetic verbs in the *already-taught* `eduki`/`jakin` shape, with
no new grammatical relation to introduce. That's exactly Phase VII's stated
criterion ("optional flavor content... neither unit unlocks new agreement
coverage that isn't already taught elsewhere") — the same reasoning that
placed Unit 40's `jario`/`etzan`/`irudi` and Unit 41's weather idioms there.
Appending rather than inserting also avoids renumbering every downstream
unit, a much larger and riskier change than this issue's data-wiring scope.

Added `eraman-present(-plural)`, `ekarri-present(-plural)`,
`eraman-past(-plural)`, `ekarri-past(-plural)`, and a present+past unit
review (singular + plural) to `LESSONS`; added the unit to `journey.js` as
`available` with those `lessonIds`; added matching `journeyTranslations.js`
entries (`phase-7-stage-17`, unit 42) — `journey.test.js` cross-checks both.

## 2026-06-19 — #261: added `eraman`/`ekarri` sentences + `validFor` tagging

**Decision:** added `sentences.present/past`, `pronouns`, and
`pronounSentences.present` for `eraman` ("to carry/take") and `ekarri` ("to
bring") — adapted from `docs/SAMPLE_SENTENCES.md`'s `ERAMAN`/`EKARRI` banks
(fishermen carrying tuna to port, hikers' cheese/bread, a dog taken to see
sheep, dancers driven to a festival; a drum/sack/bottle gifted, Basque
pastries from the bakery, mountain-spring water). The source sentences
mostly use plural-object forms (`daramatzate`, `zeramatzaten`,
`zekartzan`...); since #260 only tabulated the singular-object conjugation
alternant (matching `eduki`/`jakin`'s precedent), every sentence here was
singularized to one fish/cheese-and-bread bundle/dog/dancer/drum/sack/
bottle/pastry/jug rather than picking a different, unmatched plural form.

`validFor`: `ukan`/`eduki` read as natural alternates throughout (carrying
or bringing something is close enough to "having" it on you that swapping
in "Nik ... daramat" → "Nik ... dut/daukat" still reads as a sensible, if
flatter, sentence). `hartu` ("to take") was added per-sentence rather than
uniformly — it fits literal hand-it-over/carry-along sentences (gifting a
drum, carrying a dancer along) but not routine-sourcing ones (carrying
cheese *for* the mountain, bringing water from a spring, bread from the
oven) where "took" reads oddly against the destination/purpose framing.
`ikusi`/`erosi`/`nahi`/`behar` never fit either verb — none of them mean
"carry" or "bring."

`scripts/validfor-delta-audit.mjs`'s gap counts rose further for both verbs
and several siblings (`ukan`, `jakin`, etc.) — confirmed these are, again,
the expected pattern: pre-existing gap slots on other verbs' sentences that
simply became newly auditable now that `eraman`/`ekarri` have their own
`validFor`-tagged sentences to check against. Baseline regenerated
accordingly.

## 2026-06-19 — #260: added `eraman`/`ekarri` conjugation tables (no sentences yet)

**Decision:** added `VERBS` entries for `eraman` ("to carry/take") and
`ekarri` ("to bring") — `type: 'synthetic'`, `agreement: ['nor', 'nork']`,
`present`/`past`/`future` conjugations only, no `sentences` yet (that's a
separate, later issue). Present/past forms come straight from
`docs/CONJUGATIONS.md` §7's already-sourced tables (singular-object
alternant, matching `eduki`/`jakin`'s precedent of only tabulating the
singular-object form — the `/daramatza`-, `/dakartza`-style plural-object
alternants aren't used in `VERBS`). `hi` is omitted for both: unlike
`jakin`'s sourced hitanoa present split (#144/#245), CONJUGATIONS.md's
`eraman`/`ekarri` tables have no `hik` row at all to begin with. `future`
was derived rather than independently sourced — `eraman` (root ends in
`-n`) takes `-go` the same way `jakin` → `jakingo` does; `ekarri` (root ends
in `-i`) takes `-ko` the same way `eduki` → `edukiko` does — both just
`root + suffix + ukan`'s present suffixes, the standard periphrastic future
shape already used throughout `VERBS`.

`scripts/validfor-delta-audit.mjs`'s gap count jumped sharply for both new
verbs (456 each) purely because they have no `sentences` of their own yet —
every slot is "some other verb's existing sentence, where this new verb's
form hasn't been reviewed for fit," which is expected and deferred (along
with `eraman`/`ekarri`'s own sentence-completion content) to a later issue
rather than blocking this one. Baseline regenerated to reflect the
intentional, reviewed increase.

## 2026-06-19 — #266: `nahi` extended to all 6 persons (`gu`/`zuek`/`haiek`)

**Decision:** `nahi.conjugations.present/future` previously only covered
`ni`/`zu`/`hura`. Added `gu`/`zuek`/`haiek`, riding `ukan`'s existing
`dugu`/`duzue`/`dute` present suffixes and `nahiko` + the same suffixes for
future — no new suffix pattern, same rationale already used for `ni`/`zu`/
`hura`. Added matching `sentences.present`, `pronouns`, and
`pronounSentences.present` entries for the 3 new persons (object-noun
variants tagged like the existing persons', plus one infinitive-complement
variant per person sourced from `docs/SAMPLE_SENTENCES.md`'s modal-verb
bank, `validFor: []` since an infinitive complement has no `nor-nork`
object-noun sibling that fits).

No `lessonLogic.js` change needed: `buildOptions`'s 3-person-table
`borrowPool` fallback is documented as a no-op once a table has 4+ persons,
which `nahi` now does.

`scripts/validfor-delta-audit.mjs --verb nahi`'s gap count rose from 57 to
87 after this change — confirmed by diffing the before/after output that
every new gap slot is a `gu`/`zuek`/`haiek` slot on *another* verb's
sentence (`ukan`/`hartu`/`ikusi`/`eduki`) that simply wasn't auditable for
`nahi` before (since `nahi` lacked those persons), not a tagging problem
introduced by this change. The checked-in `scripts/validfor-gap-baseline.json`
was regenerated accordingly so `validfor-audit.test.js` reflects the new,
reviewed baseline.

## 2026-06-19 — #259: added `ukan`'s missing past `sentences`

**Decision:** `ukan.sentences` previously only had a `present` key — `past`
lessons/reviews had no sentence-completion frames at all. Added a `past`
block (all 6 persons, `ni`/`hi`/`hura`/`gu`/`zuek`/`haiek`) adapted from
`docs/SAMPLE_SENTENCES.md`'s `ukan` past table (Eskola/Familia eta etxea/
Bidaiak/Eguneroko bizitza columns, deduplicated per person).

`validFor` was judged per-noun rather than copying present's full
`['nahi', 'eduki', 'ikusi', 'erosi', 'behar']` set uniformly: concrete
ownable/visible/buyable/needable objects (book, house, map, passport,
ticket, plane) keep the full set; kinship nouns (brother/son) stay
`['nahi', 'eduki']` only, consistent with present's existing kinship
judgment; abstract event-like or mass nouns one can "have"/"need" but not
sensibly "buy" or always "see" (money, an exam, a problem, a job, time, a
reason, a question) got a narrower, per-noun set (e.g. `'Nik arazo bat
___.'` → `['eduki', 'ikusi']`, `'Guk arrazoi ___.'` →
`['nahi', 'eduki', 'behar']`) — same judgment approach as the present-tense
"bilera bat" → `['eduki', 'behar']` precedent.

`present`'s sentences don't cover the `hi` person (no `hi` key exists
there), but `past`'s conjugation table does have an unsplit `hi: 'huen'`
(per #167, past doesn't get the present's `hi-m`/`hi-f` gender split) — so
`past.sentences.hi` was added even though `present.sentences` has no `hi`
counterpart to mirror.

## 2026-06-18 — Added Phase VII roadmap structure (Units 40/41), `pending`, no `VERBS`/`LESSONS` yet

**Decision:** Added two new `pending` units to `journey.js`/`LEARNING_JOURNEY.md` (structure only, per explicit request — no `VERBS` data, no `LESSONS` entries, no `lessonIds`): Unit 40 ("Synthetic Curiosities" — `jario`/`etzan`/`irudi`, recognition-only) and Unit 41 ("Talking About Weather" — `ari`+`ukan` weather idioms plus `izan`/`egon` weather vocabulary, fixed 3rd-person-only). Both sit in a new Phase VII ("Bonus: Curiosities & Color"), after Phase VI's causatives, since they're explicitly optional flavor content rather than core curriculum.

**Why these don't unlock new agreement coverage (and why that's fine):** `VERB_COVERAGE.md` originally pitched `jario` as the cheapest route to `nor-nori` agreement and `etzan` as a `nor` example — both now moot, since `nor-nori` shipped via `gustatu`/`iruditu`/`ahaztu` (Units 23-24) and `nor`/`nor-nork` are thoroughly covered already. Their remaining value is narrower: genuine native-synthetic morphology curiosities (`jario`/`etzan`/`irudi` conjugate with no auxiliary at all) and a teachable false-friend pair (`irudi` vs. the already-taught `iruditu`). The weather unit reuses `ari`/`izan`/`egon`'s *existing* conjugation tables verbatim (same "costs nothing in new conjugation data" shape as §5's `nahi`/`behar`/`ari`) — its only new content is sentence frames, restricted to 3rd person since weather nouns have no `ni`/`hi`/`gu` form. `ari` here is doing a third job beyond the already-modeled progressive-marker (`ari` + `izan`) and engaged-in (`jardun`-adjacent) senses — `ari` + `ukan` with the weather noun as `nork` subject — worth flagging as a distinct argument structure under the same surface word.

**Why `pending`/structure-only:** explicit user request to scope this session to roadmap visibility (`CLAUDE.md`'s "rendered as a locked 'coming soon' roadmap card from its `title`/`focus`/payload alone") rather than full data+lesson authoring. Follow-up work to move either unit to `available` needs: `VERBS` entries (form-only, no `sentences`, for Unit 40; new `sentences` layered onto existing `ari`/`izan`/`egon` entries for Unit 41), `LESSONS` entries (`review: true`, `mode: 'recognition'` for Unit 40 per the `#140` precedent; `persons: ['hura', 'haiek']`-restricted for Unit 41, mirroring the imperative's person-restricted lesson precedent), and `lessonIds` wiring.

## 2026-06-18 — Implemented Unit 20 (Refresh Gate B — cumulative tense mixer)

**Decision:** Implemented Unit 20, zero new `VERBS` data — purely `LESSONS`/
`journey.js` wiring, since score-gating (`GATE_PASS_STARS`/`GATE_LESSON_IDS`
in `lessonLogic.js`/`journey.js`) turned out to already be implemented
generically (Gate A already uses it); `docs/EXERCISE_ENGINE.md`'s "Tier 2 —
score-gating still needed" section was stale and has been updated to ✅.
Six `review: true` lessons (`unit-20-review-1..6`): `-1`/`-2` mix `izan`/
`ukan`/`joan`/`ikusi` across present/past/future (`PHASE_1_PERSONS`), `-3`/
`-4` repeat that same split for `PHASE_1_PLURAL_PERSONS`, `-5` is a
`negation: true` lesson extending Gate A's negation drill to `eduki`/`ibili`
(present, the two verbs introduced after Gate A) and — for the first time —
to past tense (`izan`/`ukan`/`jakin`, made possible by the
`SINGLE_WORD_PAST_NEGATION` auto-extend in `verbs.js`), and `-6` is the
gate-checked capstone (`bestStars >= 2` required to unlock Unit 21).

**Why split singular/plural into separate review pairs rather than one mixed
lesson:** mirrors the existing `ukan-past-pool`/`-plural` precedent (6-source
pools are an established size) and keeps each lesson's `targetPerSource` from
collapsing too thin if all 12 (verb × tense) combinations were pooled into a
single lesson.

**Why no future-tense negation:** no verb has `negativeSentences.future` —
the future is periphrastic everywhere (`izango naiz`, etc.) and nothing in
the existing data extends negation to it, unlike past tense's
`SINGLE_WORD_PAST_NEGATION` shortcut. Left out of scope rather than inventing
new sentence data for a Refresh Gate that's supposed to introduce zero new
content.

## 2026-06-18 — Implemented Units 21/22 (imperfective/habitual past)

**Decision:** Implemented Unit 21 ("I Used To..." — The Imperfective Past)
and Unit 22 (Motion in Progress (Past)), both Tier 1/data-only per
`docs/EXERCISE_ENGINE.md`. Added four new `VERBS` tense tables sourced from
`docs/CONJUGATIONS.md` §6/§11: `etorri.habitualPast`/`ikusi.habitualPast`
(general periphrastic rule — imperfective participle + past auxiliary, e.g.
`etortzen nintzen`, `ikusten nuen`) for Unit 21, and `joan.imperfectivePast`/
`etorri.imperfectivePast`/`ibili.imperfectivePast` (the native synthetic
exception specific to motion verbs — `nindoan`, `zetorren`, `nenbilen`) for
Unit 22. All four are form-only (no `sentences`), following `behar`'s
precedent. Unit 21 teaches the periphrastic rule on a small two-verb core —
`etorri` (NOR, izan-auxiliary) + `ikusi` (NOR-NORK, ukan-auxiliary) — mirroring
Unit 17/18's future-rule design, rather than rolling out the rule across
every known verb immediately. Unit 22 pools all three motion verbs into one
review-style lesson pair (split by `PHASE_1_PERSONS`/`PHASE_1_PLURAL_PERSONS`)
since they share no suffix family to drill individually, mirroring Unit 11's
`izan`-past-pool pattern. Also added `TENSE_META`/i18n entries for both new
tense keys (`tenseHabitualPast`/`tenseImperfectivePast`) across all three
languages — these were missing and broke `describeLesson`/`LessonNode`
rendering until added.

## 2026-06-18 — Split Unit 7's ergative-plural lessons into Unit 8

**Decision:** Implemented Unit 8 ("Expansion: Ergative Plurals"), which had
sat `pending` since the #137 renumber even though the `gu`/`zuek`/`haiek`
data it needed (`ukan`/`ikusi`'s present tables) already existed — no `VERBS`
changes required, only `LESSONS`/`journey.js` wiring. Moved `ikusi-present-
plural`/`ikusi-present-plural-review` out of Unit 7's `lessonIds` into
Unit 8's (Unit 7's title is "Absolutive Plurals", and `ikusi` is `nor-nork`/
ergative — it never belonged there), and added a new dedicated
`ukan-present-plural` practice lesson plus a `unit-8-ergative-review`
(`ukan`+`ikusi`) to round out the unit. Deliberately left `unit-6-review-1`
(Unit 7) mixing `izan`+`ukan` present-plural as-is rather than rebalancing
it — that pairing predates this split, and `ukan`'s now-explicit Unit 8
practice lesson makes the leftover absolutive/ergative mix in one review
harmless rather than worth the churn of resplitting Unit 7's three-way
review balance.

## 2026-06-18 — [A5] (#240): jan/edan/erosi's food-drink validFor symmetry fix, keeping the jan↔edan exclusion

**Decision:** Added `ukan`/`nahi`/`eduki`/`ikusi` to `jan`/`edan`/`erosi`'s
food-object `sentences` (present, reused by reference for past/future) per
the [A3] spike's finding #1 — these verbs' own food sentences were
under-tagged relative to the symmetric `nahi`/`ukan`-hosted food sentences.
Deliberately did **not** add `jan` to `edan`'s validFor or `edan` to `jan`'s,
even though the class model's `food-drink` admission set includes both and
flags it as a candidate `add` — "I drink an apple"/"I eat water" aren't
natural completions; the class model can't distinguish solid food from
drink, this is exactly the kind of edge case the [A3] spike's finding #3
warned needs human judgment. `edan`'s `'Katuak esnea ___.'` (cat subject)
got `ukan`/`nahi`/`eduki`/`ikusi` (it can plausibly have/want/hold/see milk)
but not `erosi`/`behar` (a cat can't buy or need it) — same reasoning `ukan`'s
parallel `'Txakurrak hezur bat ___.'` already uses. Regenerated
`scripts/validfor-gap-baseline.json` for the [A1] CI guard.

**Why:** This was the one real content bug the [A3] spike's diff surfaced
(104 `adds`, concentrated in `jan`/`edan`/`erosi`) rather than a class-model
artifact — closes out Epic #220's last open child.

## 2026-06-18 — [A4] (#239): class-model validFor audit adopted as tooling only, layered onto [A1]'s CLI

**Decision:** Refactored the [A3]/#225 spike's class model (`CLASS_ADMISSION`,
the derive/diff logic) out of `scripts/frame-derive-diff.mjs` into a shared
`scripts/frameClasses.mjs` module, and added a `--classes` mode to
`scripts/validfor-delta-audit.mjs` that prints class-derived candidate
`validFor` additions (optionally scoped with `--verb <id>`), clearly labeled
as a second pass for human review. `frame-derive-diff.mjs` now imports from
the shared module too, with no change to its own output. No runtime
derivation, no `class` field on `verbs.js`, no edits to `verbs.js` from this
tooling — matches the spike's explicit "reject auto-derivation" recommendation.

**Why:** The spike found a real class of `validFor` gap (object semantics,
e.g. food vs. furniture) the agreement-only [A1] audit structurally can't
catch, but also found edge cases (the spike's finding #3) where a human still needs
to sign off before a class-predicted addition lands in `verbs.js`. A CLI mode
that surfaces candidates without writing them gets the detection benefit
without the auto-derivation risk. Shared module exists so the diff script and
the new CLI mode can't drift out of sync the way two copy-pasted
implementations eventually would.

## 2026-06-18 — [C3] (#230): `baseVerb` sentence tag + dedicated lure bypasses agreement-compatibility for ari's progressive-vs-plain distractor

**Decision:** `ari izan` ("ari naiz jaten" = "I am eating") never offered the
real-world confusion distractor — the base verb's plain present ("jaten dut" =
"I eat") — because the existing borrow-pool mechanism is gated by
`agreementsCompatible`, and `ari`'s agreement (`['nor']`) structurally excludes
`jan`'s (`['nor', 'nork']`). Added an optional `baseVerb` tag to a sentence
variant (`{ text, baseVerb }`, read transparently by the existing
`normalizeSentence`), tagged `ari`'s two "jaten" sentences with `baseVerb:
'jan'`, and added `getProgressiveBaseLure(verbs, baseVerbId, person)` — a
helper that resolves the tag straight to `jan.conjugations.present[person]`,
bypassing `agreementsCompatible` entirely rather than trying to special-case it.
Wired into `buildQuestion`'s `formLures` only when `sentence.baseVerb` is set,
and added `LURE_WHY_KEYS['progressive-vs-plain']` plus its 3-locale
explanation string.

**Why:** Generalizing `agreementsCompatible` itself to admit this one case
risked loosening it for unrelated lure slots; a sentence-level tag that
deterministically names the embedded verb (instead of string-parsing the
participle) keeps the fix scoped to exactly the sentences a human has vetted.
Only `ari`'s `jan`-based sentences are tagged for now — the other variants'
embedded verbs (`egin`/`ikasi`/`idatzi`/`irakurri`/`jolastu`) aren't in `VERBS`
yet, so they stay untagged until those verbs exist. The grounding invariant
from [B2]/#227 means this lure can never leak into an ungrounded bare-`form`
question, with no extra guard needed.

## 2026-06-18 — [A3] (#225): object-class `validFor` derivation spike — adopt with changes, no code shipped

**Decision:** Investigated whether `validFor` could be derived from a small
vocabulary of object semantic classes (`concrete-ownable`, `food-drink`,
`kinship`, etc.) instead of hand-tagged per-sentence, as a follow-up to
[A1]/[A2]'s gap-audit tooling. Wrote a read-only research spike —
`docs/OBJECT_FRAME_TAGGING.md` (the proposal), `scripts/frame-classes.json`
(sentence → class mapping), and `scripts/frame-derive-diff.mjs` (derives
`validFor` from the class model and diffs against the real hand-tagged data)
— with **no changes to `src/data/verbs.js` or any runtime code**, per the
issue's explicit scope.

**Why:** The diff surfaced a real, systematic bug invisible to the existing
agreement-only gap audit: `jan`/`edan`/`erosi`'s own food-object sentences are
under-tagged relative to the same objects' tagging under `nahi` (missing
`ukan`/`nahi`/`eduki`/`ikusi`). But it also showed classes can't fully
replace human judgment — a few hand-tagged sentences are deliberately
narrower than their class predicts (e.g. `ikusi`'s "Txakurrak katua ___."),
and two verbs' incomplete conjugation tables (`nahi` has no `gu/zuek/haiek`;
`behar` has no `past`) produce expected diff noise unrelated to the class
model's correctness.

**Outcome — recommend adopt with changes, not adopted yet:** layer the class
vocabulary into the existing delta-audit CLI as a second-pass, human-reviewed
suggestion mode (not an auto-apply), and file a dedicated follow-up issue for
the concrete `jan`/`edan`/`erosi` under-tagging finding. Neither of those
follow-ups is in scope for this spike; see `docs/OBJECT_FRAME_TAGGING.md` for
the full vocabulary, admission table, and diff numbers.

## 2026-06-18 — [C2] (#229): per-question "why this was wrong" feedback for lure distractors

**Decision:** Extended the `{ form, source }` provenance tagging from
[B1]/#226 with an optional `errorType` on `'lure'` candidates
(`priorityCandidates` is now `Array<{ form, errorType }>` rather than bare
strings — `getCaseFrameLure`/`getCrossTenseLure`/`getObjectNumberLure`'s call
sites in `buildQuestion` wrap each lure's form with its `errorType`:
`'case-frame'`, `'tense'`, `'object-number'`). `buildOptions` turns any
`'lure'` distractor that survives into the question's `optionRationale: {
[form]: { errorType, whyKey } }`, where `whyKey` is looked up from a small
`errorType` → i18n-key table (`LURE_WHY_KEYS`). `options` itself is
unchanged — still a plain array of form strings — so grading
(`isAnswerCorrect`/`exerciseReducer`) needed no changes at all.

A new `getLureRationale(question, selected, t)` (parallel to `getExplanation`)
looks up `question.optionRationale?.[selected]` and returns the localized
"why" line, or `null` if the wrong pick wasn't a tagged lure (a plain
same-table distractor, or any question kind without `optionRationale` at
all — `form` questions never get one, since [B2]/#227's `grounded: false`
already drops lures from them).

`FeedbackBar` (`App.jsx`) renders this rationale immediately — unlike the
existing "why is this correct?" `ExplanationToggle`, it's *not* behind a tap.
Rationale: that toggle explains a general fact about the correct answer and
competes with the main feedback if shown by default; this explains the
specific wrong answer just picked, which is the one piece of feedback that
particular incorrect attempt needs, so hiding it behind an extra tap would
bury it.

Added three i18n keys (`lureRationaleCaseFrame`/`lureRationaleTense`/
`lureRationaleObjectNumber`) in en/es/eu, each interpolating `{form}` (the
wrong pick) and `{correct}` (the right answer) — same `{placeholder}`
pattern as the existing `explanation*` keys.

Out of scope per the issue: rolling cross-question error-pattern detection
and remedial mini-lessons (`docs/EXERCISE_ENGINE.md`'s Tier-4 note) — this is
per-question feedback only, ticked as the "per-question half" of that Tier-4
item.

## 2026-06-18 — [B2] (#227): unify Family B's distractor-leak gates into one `grounded` invariant

**Decision:** Replaced `generateQuestions`'s accreting pile of context gates
(`reviewScoped`, `borrowPool`, the `sources`/`review`-keyed scoping added
across #139 → #174 → #200 → #203) with a single boolean, `grounded`, added to
`buildTaggedOptions`/`buildOptions`. A question kind with a sentence or
visible verb name to anchor correctness (`sentence`, `negative`, `pronoun`)
passes `grounded: true`; the bare `kind: 'form'` case — which never has
either — always passes `grounded: false`. When `false`,
`buildTaggedOptions` ignores `extraCandidates`/`borrowPool`/
`priorityCandidates` entirely and draws distractors only from the verb's own
table, accepting fewer than 3 distractors rather than showing an ungrounded
cross-verb form or lure. This replaces *every* prior gate uniformly — a bare
`form` question never borrows or gets a lure now, full stop, regardless of
`sources`/review-vs-practice — rather than each new context rediscovering
the same leak with its own conditional.

`getBorrowedDistractors` is unscoped again (borrows from every
`agreementsCompatible` sibling in `verbs`, #139's original behaviour) since
`grounded` is now the only gate that matters, and it returns
`Array<{ verbId, form }>` instead of bare strings so a grounded
`sentence`/`negative` question can narrow its borrowed pool through
`filterExtraCandidates`'s `validFor` check exactly like `extraCandidates`
already was — this closes a real leak: pre-#227, a borrowed sibling form
bypassed `validFor` filtering even when that sibling was explicitly listed
in the sentence's `validFor` (i.e. genuinely also correct for that exact
sentence, and so doubly wrong to show as a "wrong answer").

One observable behavior change from unifying onto `grounded` rather than
keeping `sources`-scoping for non-`form` kinds: an untagged (plain-string,
pre-`validFor`-migration) sentence's implicit `validFor: undefined` already
meant `filterExtraCandidates` excluded every `extraCandidates` sibling (the
"not yet vetted" safe default, see `docs/SENTENCE_FRAMES.md`) — borrowed
forms are now held to that same default, so an untagged sentence's
`sentence`/`negative` question no longer gets a borrowed top-up either.
Every verb currently in `VERBS` has migrated its `sentences`/
`negativeSentences` to the tagged `{ text, validFor }` shape, so this has no
production impact today; `src/logic.test.js`'s synthetic small-table
fixtures were updated to use `validFor: []` (vetted, excludes nothing)
rather than bare strings so they still exercise #139's borrowing behaviour
under the new rule.

`docs/DISTRACTOR_STRATEGY.md` §1 Family B updated to describe the retired
gates and the new invariant.

## 2026-06-18 — [A2] (#224): backfill `behar`'s `validFor` across the nor-nork cluster

**Decision:** Ran `scripts/validfor-delta-audit.mjs --verb behar` (293 gap
slots across `ukan`/`nahi`/`jakin`/`jan`/`edan`/`erosi`/`hartu`/`ikusi`/
`eduki`) and added `'behar'` ("need") to every slot where "X behar dut"
reads naturally, judged against the same naturalness test #155 used for
`erosi`. Included: all concrete/ownable objects bought by an agentive human
subject (book, car, ticket, house, etc. in `ukan`/`nahi`/`erosi`'s own
sentences); all food/drink objects in `jan`/`edan`; all of `erosi`'s and
`hartu`'s own sentence objects (a bus, an umbrella, a decision are all
things one can "need"); `ikusi`'s "filma" and "Gurasoek etxea" entries (a
film/house is something one can need to see). Excluded: kinship objects
(`ukan`/`nahi`'s "arreba"/"anaia"/"seme" — an indefinite "a sister" isn't
naturally "needed" any more than "seen" or "bought"); non-agentive subjects
(the dog-and-bone, house-and-garden, cat-and-milk examples — same reasoning
as #155's `erosi` exclusions); `jakin`'s fact/answer objects ("erantzuna",
"egia", "bidea" — you don't "need an answer" the way you "know" one, this
verb's whole cluster stayed `behar`-free); `eduki`'s "in pocket/hand"
location-bound frames (`scripts/validfor-delta-audit.mjs --verb behar`'s
remaining 98 gap slots are entirely `eduki`'s pocket/hand sentences plus
the above kinship/fact/non-agentive exclusions — left untagged as
out-of-scope per the issue, matching its explicit "X in pocket" no-example).
`ikusi`'s landscape ("mendia"/"itsasoa"/"zerua") and generic `"hori"`/`"Mikel"`
entries were also left untagged, conservatively, since "needing to see the
sky" or a maximally generic "that thing" didn't clear the same bar as the
two included `ikusi` cases. Regenerated `scripts/validfor-gap-baseline.json`
so the A1 CI guard (`src/validfor-audit.test.js`) tracks the new, smaller
gap count instead of flagging it as drift.

## 2026-06-18 — [C1] (#228): review `kind:'form'` questions show the verb name

**Decision:** `ExerciseScreen`'s `showVerb` prop to `QuestionPrompt`
(`src/App.jsx`) now also shows the verb name for `kind: 'form'` questions,
even in review mode — `showVerb={!lesson.review || !question.options ||
question.kind === 'form'}`. Took the issue's recommended option (show the
verb) over the alternative (drop bare `form` questions from reviews
entirely): a review's `form` question has no sentence, so with the verb name
hidden too there's no way to tell *which verb* is under test, making a
deliberately-hard lure (e.g. `izan`'s `dira` offered for `ikusi`'s `haiek`
form) indistinguishable from a broken question. Other review MC kinds
(`sentence`/`negative`/`pronoun`) keep the verb name hidden — their sentence
already grounds the question, and naming the verb there would trivialize any
cross-verb distractor (`getCrossVerbCandidates`). Added an `App.test.jsx`
test (`'review form question'`) asserting a review's bare form question
renders the verb name.

## 2026-06-18 — [B1] (#226): provenance-typed distractor candidates, no behaviour change

**Decision:** Split `buildOptions` (`src/lessonLogic.js`) into a new exported
`buildTaggedOptions`, which builds the same priority/pool/borrow-pool
distractor selection but keeps each candidate as `{ form, source }` with
`source ∈ 'same-table' | 'sibling' | 'lure'` throughout, and a thin
`buildOptions` wrapper that flattens `distractors` to plain form strings for
the existing `{ correct, options }` return shape. Same-table forms (the
other persons' table entries) are tagged `'same-table'`; `extraCandidates`
and the last-resort `borrowPool` are both tagged `'sibling'` (both are
"another verb's form," whether pulled in via a review's declared sources or
the broader borrow pool); `priorityCandidates` (case-frame/cross-tense/
object-number/pronoun lures) are tagged `'lure'`. Dedup-by-form, the
3-distractor cap, and priority-slot ordering are unchanged — `buildOptions`'s
call sites in `generateQuestions` needed no changes, since the wrapping
happens entirely inside `buildOptions`/`buildTaggedOptions`. `npm test`
passes with zero changes to any existing fixture or assertion, proving no
behaviour change; two new `buildTaggedOptions`-specific tests in
`logic.test.js` lock the tagging contract. This is pure plumbing for [B2]
(#227), which will use the tags to collapse the `reviewScoped`/`borrowPool`
gates into a single grounding invariant.

## 2026-06-18 — [A1] (#223): validFor delta-audit script + CI guard

**Decision:** Added `scripts/validforGapAudit.mjs` (the shared
`computeGapSlots`/`computeGapCounts` core), `scripts/validfor-delta-audit.mjs`
(the CLI: per-verb table by default, `--verb <id>` for the worklist, `--json`
for the baseline), `scripts/validfor-gap-baseline.json` (checked-in baseline,
matches the §3 sizing run's counts exactly), and `src/validfor-audit.test.js`
(fails with an actionable message whenever the gap surface changes).
Deliberately **not** an absolute lint — per `docs/DISTRACTOR_STRATEGY.md` §3
that would be ~all noise; this only forces a human look when the surface
*changes*, e.g. a new verb/tense being added. No `validFor` data was touched
in this issue — the baseline reflects the current (gappy, `behar`-under-tagged)
state as-is; closing those gaps is [A2]'s job, using this tool's `--verb behar`
output as its worklist.

## 2026-06-17 — #218: consolidated distractor/ambiguity strategy in `docs/DISTRACTOR_STRATEGY.md`

**Decision:** Added `docs/DISTRACTOR_STRATEGY.md` as the standing
full-picture planning doc for distractor selection and ambiguity, restoring
the institutional-memory role `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` had before
#126 deleted it. The `validFor` *schema* stays in `docs/SENTENCE_FRAMES.md`;
the new doc is the *direction/methodology* layer above it. No runtime change.

**Why:** ~30 issues have touched distractors as if it were one topic; it's
actually three families (A: false-negative ambiguity → `validFor`; B: leakage
of borrowed/lure forms into ungrounded `form` questions → the repeatedly-
patched #139/#174/#200/#203 line; C: lure pedagogy/legibility). Conflating
them is why fixes to one resurface as regressions in another. #218 is a fresh
batch spanning all three, so the picture was worth writing down once.

**Calibration evidence (read-only sizing run, this date):** the `validFor`
completeness-review surface is **structural — driven by agreement-cluster
size, not recency.** A verb joining the ~16-member `nor-nork` cluster creates
~300–370 review slots; a dative-cluster verb creates dozens. An *absolute*
completeness lint is therefore noise (3,969 "gap slots" across 898 tagged
variants, mostly correct distractors); only a *delta* audit at verb-add time
is useful. The raw count can't tell bug-density from review-surface (`behar`'s
293 land on semantically-close sentences and are likely real omissions;
`jan`/`edan`'s ~370 are mostly correct distractors). Net direction:
frame-derived `validFor` for the core cluster, manual + delta-audit for the
dative tail, provenance-typed distractors to retire Family B's accreted gates,
and legible/targeted lures for Family C. Open decisions enumerated in the doc;
`behar` flagged as known content debt. **No short-term fixes made** per the
issue owner's call — this is planning only.

## 2026-06-17 — #203: `generateQuestions`'s review-scoping needs an explicit `review` flag, not just `sources.length > 1`

**Decision:** `generateQuestions` now takes an explicit `review` boolean
(passed by the App.jsx call site from `lesson.review`), and `reviewScoped`
is `true` when *either* `review` is set *or* `sources.length > 1`. Reported
bug: `ikusi-present-plural-review` (a single-source review,
`sources: [{ verbId: 'ikusi', tense: 'present' }]`) showed a bare `kind:
'form'` "haiek" question offering `dira` (izan's haiek form) alongside
ikusi's own `ikusten X` forms — `dira` doesn't even agree with `ikusi`
(NOR vs NOR-NORK), so with no sentence or verb name shown (review lessons
hide both for `form` questions) it read as a random, ungrounded option.

**Why it happened:** `reviewScoped` (added by #200) keyed entirely off
`sources.length > 1`, but a review can legitimately have just one source —
`ikusi-present-plural-review` only reviews `ikusi` itself, restricted to
plural persons. With `reviewScoped` false, the code took the ordinary-
practice-lesson path: `formLures` (the case-frame lure — e.g. izan's `naiz`
offered for ukan's `dut`, intentionally surfaced as a "wrong subject case"
distractor when a sentence's marking can disqualify it) got injected into
`buildOptions` unconditionally, even for the sentence-less `form` kind. The
fix also gates `formLures`, not just the borrow pool, behind `reviewScoped`
— both are "diagnosable mistake" distractors that need a sentence to read
as wrong, not bare ones.

## 2026-06-17 — #177: literal NOR-NORI-NORK cross-axis lure closed as "addressed differently"

**Decision:** Won't author new per-verb tables (e.g. an "esan to zu" table,
or a "zuk eman" table) just to produce a same-verb, same-axis-varying wrong
form for `esan`/`eman`. The generalized case-frame lure (#165) and
`getObjectNumberLure` (#165) stay the only NOR-NORI-NORK distractor rows for
this slot.

**Why:** `esan`'s data is fixed at `recipient: 'hura'` and `eman`'s at
`agent: 'ni'` — each verb only has the one axis-fixed table its lessons
actually use. A literal "wrong NORK"/"wrong NORI" same-verb lure needs a
second full table per verb varying the *other* axis, which has no use
outside manufacturing this one distractor — six more hand-authored forms per
verb per tense, for a lure that's only a refinement on one #165 already
ships (case-frame mismatch: missing/extra ergative marking entirely, a
coarser but real trap in the same family). That's a weak trade against the
cost of a new table shape with no pedagogical use of its own. If a
ditransitive verb is ever added whose lessons *need* a second table for
other reasons (e.g. varying NORI across persons), revisit then — the lure
would come for free.

**Scope note:** this resolves only #177's first row. Its other three rows
(future illegal-voicing non-word safety, the hi/hitanoa wrong-gender/neutral
lures, and the mood rows) are still blocked on #167's gendered toka/noka
data and #171/#182's dative-paradigm mood content, respectively.

## 2026-06-17 — #204: `jakin`'s "sekretua" sentence adds `ukan` to `validFor`

**Decision:** `jakin`'s `present`/`negativeSentences` "sekretua" ("a secret")
frames now list `'ukan'` alongside `'nahi'` in `validFor` — "Zuk sekretua
duzu" ("You have the secret") reads as a natural, grammatically valid
Basque sentence alongside "Zuk sekretua dakizu" ("You know the secret"), so
`ukan`'s `duzu` shouldn't have been excludable as a definitely-wrong
distractor there.

**Why this doesn't contradict #114's `jakin`↔`ukan` "confirmed wrong pair"
verdict:** that backfill pass judged the pair in general, but
`docs/SENTENCE_FRAMES.md` deliberately scopes `validFor` per sentence, not
per verb pair — abstract-but-ownable nouns like "sekretua" admit more
candidates than ones that are only "known" (e.g. "egia"/"the truth", left
unchanged: "Zuk egia duzu" reads shakier and wasn't confirmed). Don't
generalize this to other `jakin` sentences without the same per-sentence
check.

## 2026-06-17 — #188: `word-order` debuts in both Phase I and Unit 10, as a supplement

**Decision:** Both candidates from #188 — early Phase I and Unit 10's negation
drills — get `kind: 'word-order'`, not just one of them, and in Unit 10 it's
added to the existing `negative`/`type-negative` roll rather than replacing
either.

**Why both, not a choice:** #186's engine already gates `word-order`
generically on "does this person's filled sentence (or negated sentence,
under `includeNegation`) clear the 4-token floor" — there's no per-unit
opt-in to write, so restricting it to only one of the two candidates would
mean adding an artificial exclusion to a mechanism that's already correctly
scoped. Phase I lessons get it as one more kind alongside `sentence`/
`type-verb`/`spot-error` the same way `spot-error` itself slots into existing
lessons without new `LESSONS` entries; Unit 10 gets it for the same reason,
and because a word-order question over a negated sentence is a more direct
test of "where does `ez` go" than `spot-error`'s "pick the right sentence"
framing.

**Why supplement instead of replace in Unit 10:** replacing `negative`/
`type-negative` would mean a learner could pass through Unit 10 without ever
producing the negated form by typing or close reading — `word-order`'s
recognition-by-rearrangement is a different (and easier) skill than
`type-negative`'s production. Keeping all three in the roll pool means the
unit still drills production, recognition, and rearrangement rather than
narrowing to just one.

**No `LESSONS`/`journey.js` changes needed**: kind selection happens inside
`generateQuestions` per-question, not per-lesson, so this is a documentation-
only resolution — see `docs/LEARNING_JOURNEY.md`'s Unit 10 entry and
`docs/EXERCISE_ENGINE.md`'s "Word-order question contract" (#185).

## 2026-06-17 — #186: `kind: 'word-order'` engine, not gated by `noTyping`/`noProduction`

**Decision:** `generateQuestions` adds `word-order` to the `availableKinds` pool (per #185's contract) gated only by the 4-token minimum and, for negation lessons, `includeNegation` — it is **not** additionally excluded when `noTyping`/`noProduction` (recognition mode) is set, unlike `type-verb`/`type-pronoun`/`type-negative`/`spot-error`.

**Why:** those other kinds are excluded under `noTyping`/recognition mode because they require typing a form from memory. `word-order` never does — the learner only taps pre-given tokens into place, the same interaction model as `match-pairs`. Excluding it under "no typing" settings would be excluding a kind that was never typing in the first place.

## 2026-06-17 — #185: word-order question contract resolved

**Decision:** Settled the `kind: 'word-order'` design questions (full writeup in `docs/EXERCISE_ENGINE.md`'s Tier 3, alongside the negation-drills section) before any engine code lands, mirroring how `docs/SENTENCE_FRAMES.md` settled `validFor` before #123's implementation:

- Tokens are `{ id, text }` pairs (handles duplicate words); `correct` stays a plain reassembled-sentence string, so `isAnswerCorrect`/`exerciseReducer` need no changes — the UI just joins tapped tokens with `' '` and calls the existing `submitAnswer`.
- Retry reshuffles, via a local UI shuffle keyed off `question.attempt` rather than an engine-level reshuffle — the same precedent `MatchPairsBoard` (#191) set, since re-showing an identical wrong cloud is a worse retry experience than #191's frozen-board bug was for matching.
- Gated by a 4-token minimum (post-fill, post-split) so short sentences (≤3 words, ≤6 permutations) don't roll this kind — too trivial to test real word-order knowledge.
- Offered for `negativeSentences` only under `includeNegation`, supplementing rather than replacing `negative`/`type-negative` in that lesson's roll pool, since auxiliary-fronting is exactly the word-order change this kind targets.

**Why resolve this before #186 (engine):** the duplicate-word token-id question in particular has a real fork — a token-id-array comparison would force changes to `case 'answer'`, whereas the plain-string-join approach doesn't. Better to settle that before writing `generateWordOrderQuestions`, not discover it mid-implementation.

## 2026-06-17 — #192: wire `generateMatchPairsQuestions` into `createExerciseState`

**Decision:** `createExerciseState` now calls `generateMatchPairsQuestions(resolvedSources, { persons: lesson.persons })` and appends its result to every lesson's queue, except when `lesson.negation` is set (Unit 10's Refresh Gate A and the `unit-5-review-*` lessons) — there the whole point is the `ez`/auxiliary-fronting drill, and a bare person↔form match would dilute it.

**Why automatic rather than a per-lesson flag:** eligibility is already gated inside the generator itself (≥3 in-scope persons, all with distinct forms — see `generateMatchPairsQuestions`'s own guard), so a lesson either has a matchable table or it doesn't; hand-curating a second flag per lesson on top of that would just be a second place the same fact could go stale. The single `lesson.negation` exception is the only case where a table *is* matchable but shouldn't be matched.

**Why mixed into existing lessons instead of a dedicated "match-pairs lesson":** the journey's unit structure (`JOURNEY`/`LESSONS`) is unaffected — no new lesson ids, no `journey.test.js` changes needed. A match-pairs round is one more question *kind* in an existing lesson's queue, like `spot-error` or `pronoun`, not a new unit.

**Scoring:** counts as a single question toward `bestScore`/`totalQuestions`/stars, same as any other kind — no `STORAGE_KEY` bump, since the stored shape (`{ attempts, bestScore, totalQuestions, bestStars, lastPlayed }`) doesn't change.

## 2026-06-17 — #191: `MatchPairsBoard` UI + retry-remount fix for `kind: 'match-pairs'`

**Decision:** Added `MatchTile`/`MatchPairsBoard` (`App.jsx`) to render
`kind: 'match-pairs'` questions (#190): two independently-shuffled columns
(persons, forms) where tapping a left tile then a right tile attempts a
match — a correct pair locks green, an incorrect one flashes red briefly and
clears the selection. `ExerciseScreen`'s answer-area branches on
`question.pairs` ahead of the existing `question.options`/typed-answer
branches. `onComplete` reports `!hadMistake` once every pair is matched,
which `ExerciseScreen` submits as `question.correct` (pass) or `'incomplete'`
(fail) — no changes needed to `isAnswerCorrect`/the generic scoring path.

**Bug found and fixed along the way:** the board originally keyed itself on
`state.queue.length`, which doesn't change when a question is requeued for a
retry (`exerciseReducer`'s `'next'` case pushes the same question to the back
of an unchanged-length queue) — so a retried match-pairs question reused its
already-fully-matched, frozen component state with no way to interact
further. Fixed by having `exerciseReducer` increment a new `attempt` field on
every retry (instead of just setting `retry: true` once) and keying the
board on `${verbId}-${tense}-${attempt}`, so a retry always remounts fresh.

**Testing:** `createExerciseState` doesn't generate `match-pairs` questions
yet (that's #192) and `App.jsx` has no named exports for isolated component
testing, so `App.test.jsx` mocks `generateQuestions` (via `vi.mock` +
`importOriginal`, gated by a test-local flag) to inject a fixed
match-pairs question into a real lesson's queue — covering the full
tap-to-match flow through the actually-rendered app without doing #192's
production wiring early.

## 2026-06-17 — #190: `generateMatchPairsQuestions`/`kind: 'match-pairs'` engine support

**Decision:** Added `generateMatchPairsQuestions(resolvedSources, { persons,
count })` alongside `generateCaseMixerQuestions`/`generateCrossVerbQuestions`
— a `kind: 'match-pairs'` question covers a whole source's table at once
(every in-scope person matched to its form) rather than one person at a
time like every other kind. Eligibility is automatic by table shape: ≥3
in-scope persons, all with distinct forms — no per-lesson opt-in flag.
`correct: 'complete'` is a sentinel string; the UI board itself (landing in
#191) determines success/failure and submits `'complete'`/`'incomplete'`
through the existing `submitAnswer` path, so `isAnswerCorrect`/
`exerciseReducer`'s `case 'answer'` needed no changes.

**Why the `misses`-tracking guard changed from `question.verbId` to
`question.verbId && question.person`:** a missed `match-pairs` question has
no single `person` field (it spans every person in its table), so without
the guard a miss would push a `{ person: undefined }` entry into
`misses`/`errorStats`, corrupting `getWeakSpotQuestions`' per-person lookup.

This is the engine half of #189's match-pairs epic; #191 (UI) and #192
(wiring into `createExerciseState` + docs) land separately per the issue
split.

## 2026-06-17 — #194: repo structure for agent workability (no behavior change)

**Decision:** Four navigability changes, no logic touched:

- Split `docs/DECISIONS.md` at the 25-most-recent-entries mark into this
  active log plus `docs/DECISIONS_ARCHIVE.md` for everything older, since
  `CLAUDE.md` requires reading this file before journey/verb-data changes and
  it had grown to ~3200 lines / 122 entries — the single largest forced read
  for routine work. Picked a flat count (25) over a date cutoff since entry
  density isn't uniform across days.
- Added a one-line `**Status:**` note to the top of each
  `LEARNING_JOURNEY*`/`EXERCISE_*` doc (current/authoritative vs. open
  proposal vs. historical) instead of renaming files or merging them — the
  docs' own prose already cross-references each other reasonably well; the
  missing piece was just a scannable authority signal at the top.
- Added a section-index comment block to the top of `src/App.jsx` listing its
  existing `// ===` banner sections with approximate line numbers, so a
  glance at the top is enough to jump to the right section without scanning.
- Added a one-line "grep for `id: '...'`" locate-by-id note to
  `src/data/verbs.js` and `src/data/lessons.js`, since both are large flat
  data files where most edits target exactly one entry.

**Why no cross-reference rewrite:** many existing `docs/DECISIONS.md`
references elsewhere in the codebase (e.g. "see `docs/DECISIONS.md`,
2026-06-13") now point at entries that live in the archive instead. Left
these as-is — the archive's own header note covers the redirect, and
rewriting every dated cross-reference across the repo to say which of the
two files it's in would be a large, low-value mechanical change orthogonal
to this issue's "don't force a full-file read" goal.

## 2026-06-17 — #174: scope `getBorrowedDistractors` to a review's `sources` when there are 2+

**Decision:** `getBorrowedDistractors` (#139's small-table distractor-floor
top-up) now takes the question's `sources` (a lesson's `{ verbId, tense }[]`)
and, when `sources.length > 1`, restricts its sibling pool to just those
verbs instead of scanning all of `VERBS`. With 0 or 1 `sources`, it still
falls back to the full `verbs` pool — unchanged from before #174.

**Why:** a bare `kind: 'form'` question has no sentence to make a sibling
verb's same-person form read as "wrong" — #121 already enforced this for
`extraCandidates`, but `getBorrowedDistractors` (added later, by #139) was a
separate, still-unscoped path. The repro (#174): `unit-5-review-1` reviews
only `izan`+`ukan`, but its `ni` question for `izan` could still borrow
`egon`'s `nago` — `egon` is `agreementsCompatible` but isn't one of the
review's 2 declared sources, and `egon`/`izan` both gloss as "I am" in
English, so the question reads as two correct answers instead of one
correct + distractors.

**Why not scope single-source lessons too:** an ordinary, non-review lesson
(e.g. `nahi-present`, `jakin-present`) has exactly one declared source — its
own verb — so scoping to `sources` there would mean scoping to nothing
(`getBorrowedDistractors` already excludes the anchor verb itself),
silently dropping the #139 distractor-floor top-up these 3-person tables
were built to rely on. Single-source lessons keep borrowing from the full
`verbs` pool, same as pre-#174 — the ambiguity risk #174 describes is
specific to multi-source reviews where a compatible-but-undeclared sibling
(like `egon`) can sneak in.

**Why this doesn't regress #144's `hi`-drill:** `unit-32-hi-present`/
`unit-32-hi-past` declare exactly the 4 intended siblings (`izan`/`egon`/
`joan`/`etorri`) as `sources`, so scoping to `sources` still yields exactly
those 4 verbs' `hi` forms — the borrowing #144 designed for is preserved
because it was already "in scope" by the lesson's own declaration.

## 2026-06-17 — #171: Unit 30 imperative (agintera), izan/ukan core scope

#171 is a large follow-up to #148 covering five separate deferred areas
(dative potential/conditional, sentence frames, imperative, subjunctive,
causatives). Picked Unit 30's imperative (agintera) as this PR's core scope
since it's the next `pending` unit in journey order and is directly
tabulated in `CONJUGATIONS.md` §9/§16.2 — the rest (N-28/29 dative
paradigms, sentence frames, Unit 31 subjunctive, Units 37-39 causatives)
moved to a follow-up issue.

- **`imperative` is a new tense key** on `izan`/`ukan`, second-person only
  (`hi`/`zu`/`zuek` — no `ni`/`hura`/`gu`/`haiek` cells exist for the
  imperative at all, per §9).
- **`izan`'s `hi` stays a single invariant key** (`hadi`) — `izan`'s `hi` is
  a `NOR` argument, not `NORK`, so there's no allocutive-style gender split
  here (consistent with #144's plain-`hi` convention).
- **`ukan`'s `hi` splits into `hi-m`/`hi-f`** (`ezak`/`ezan`) — here `hi` is
  the grammatical `NORK` subject of "do it!", matching #167's `hi`-as-NORK
  convention exactly.
- **Deferred**: the ditransitive (`iezadazu`) imperative, 3rd-person jussive
  (`beza`/`bitza`) and 1st-person hortative (`dezagun`) forms, the
  plural-object (`-itz-`) column, and `egon`/`etorri`/`joan`'s imperative
  (which §16.2 notes is identical to their present tense — likely a quick
  follow-up, but still new lesson/data work). `izan`/`ukan` aren't
  `agreementsCompatible`, so `unit-30-review` (which pools both) gets no
  cross-verb distractor borrowing — accepted as-is, same call as #167's
  toka/noka review lessons.

## 2026-06-17 — #170: §14 non-finite-form reading items for Unit 36

Added 8 new `kind: 'reading'` items (`reading-nonfinite-*` in
`src/data/readingItems.js`) covering `CONJUGATIONS.md` §14's verbal-noun
suffixes (`-tea`/`-teari`/`-teagatik`/`-teko`/`-tean`), the `-tako`
(attributive) vs. `-a`+`izan` (resultative predicate) participle contrast,
and the `-z` modal/instrumental adverbial — the content #145 deliberately
left out of the original 10-item set. To minimize the risk of subtle errors
in non-finite forms (flagged by #170 itself), every `source` sentence reuses
one of §14's own worked examples verbatim rather than authoring new ones.

Put the new items in a second lesson (`unit-36-reading-nonfinite`) rather
than folding them into `unit-36-reading`, since 10+8 items would make a
single lesson too long — both are added to Unit 36's `lessonIds`. No engine
changes — `generateReadingQuestions`/`READING_ITEMS` already generalize over
arbitrary item lists.

## 2026-06-17 — #167: Hitanoa allocutive register, Units 33/34 + hi-as-NORK gender split (core scope)

Core scope: Units 33 (toka) + 34 (noka) data/lessons, plus item 4 — `ukan`/
`jakin`'s `hi`-as-NORK present-tense gender split. Deferred to a follow-up
issue: Unit 35 (recombination + addressee-gender toggle + "when not to use
hitanoa"), item 5 (wiring a hi/hitanoa row into the distractor matrix — wrong
gender/neutral-form lures), and item 6 (`ibili`'s `hi`-past gap).

1. **Toka/noka modeled as new tense keys, not person keys** —
   `presentToka`/`presentNoka`/`pastToka`/`pastNoka` on `izan`/`ukan`, each a
   `{ hura, haiek }` table. Considered modeling this as gender-suffixed
   person keys (`hura-m`/`hura-f`) instead, but tense keys both follow the
   established generic-tense-key precedent (#148/#162/#164 — `tense` is an
   opaque string key to `generateQuestions`, zero engine changes needed) and
   correctly reflect that the gender dimension here attaches to the
   *addressee* of the utterance, not to the statement's own subject (`hura`/
   `haiek` stays the subject throughout).
2. **Only `hura`/`haiek` are tabulated** — `docs/CONJUGATIONS.md` §10 itself
   only gives these two rows for izan/ukan's toka/noka (no full person grid
   exists in the source), so the data and lessons stay 2-person/binary-choice
   by design, not as a gap. `options.length === 2` is already a precedented,
   tested pattern elsewhere in the suite (e.g. `jakin`'s 2-distractor cases).
3. **No cross-verb borrowing between izan's and ukan's toka/noka** — `izan`
   (`agreement: ['nor']`) and `ukan` (`agreement: ['nor', 'nork']`) are not
   `agreementsCompatible`, so `unit-33-review`/`unit-34-review` pool both
   verbs for spaced repetition but only get within-verb cross-tense
   borrowing (e.g. izan's `pastToka` can lure on an izan `presentToka`
   question), not cross-verb borrowing. Accepted as-is rather than
   engineering a workaround — see item 5 of the follow-up issue for a
   possible distractor-matrix-level fix.
4. **hi-as-NORK's own gender split modeled as `hi-m`/`hi-f` person keys** —
   added to `ukan`'s and `jakin`'s existing `present` tables (`duk`/`dun`,
   `dakik`/`dakin`), matching #144's established `hi`/`hi-m`/`hi-f`
   convention exactly: here the addressee genuinely *is* the grammatical
   NORK argument, unlike toka/noka above. `ukan`'s past stays a single
   unsplit `hi: 'huen'` (CONJUGATIONS.md §3 doesn't split the past here).
   `ukan` and `jakin` *are* `agreementsCompatible`, so `unit-32-hi-nork-
   present` (pooling both) gets real cross-verb distractor borrowing.
5. Linguistic data (the toka/noka tables, especially the past-tense
   `-a-`/`-na-` insertions and the `du`→`di`-stem shift distinguishing
   ukan's toka/noka from hi-as-NORK's own `duk`/`dun`) is flagged in
   `docs/LANGUAGE_DECISIONS.md` for native-speaker/grammar-reference
   confirmation before relying on it pedagogically beyond this app.

## 2026-06-17 — #165: NOR-NORI/NOR-NORI-NORK distractor matrix rows (core scope)

Closes #141's NOR-NORI/NOR-NORI-NORK deferral now that #162/#164 have landed
the plural-object fodder it needed. Two changes to `src/lessonLogic.js`:

1. **Generalized `getCaseFrameSibling`** — dropped the `agreement.includes
   ('nori')` exclusion and changed the matching rule from "both lack `nori`,
   `nork` inverted" to "same `nori` status, `nork` inverted." This is a
   strict generalization (izan/ukan still match exactly as before) that also
   pairs gustatu/iruditu/ahaztu (`nor-nori`) with esan/eman (`nor-nori-nork`)
   — e.g. `gustatzen zait` offered as a "wrong case frame" distractor for
   `esaten diot`, and vice versa. Person keys line up mechanically the same
   way they already did for izan/ukan (different grammatical roles share the
   same person-key space), so no new lookup logic was needed, just a wider
   net.
2. **New `getObjectNumberLure(verb, tense, person)`** — returns
   `verb.conjugations[\`${tense}Plural\`]?.[person]`, i.e. the verb's own
   plural-object form for the same tense/person where one exists (`esaten
   dizkiot` offered alongside `esaten diot`). Covers the matrix's "wrong
   object number" slot for gustatu/iruditu/ahaztu/esan/eman; harmlessly
   `undefined` for every other verb (no `<tense>Plural` table).

Both lures slot into the existing `formLures` array at the same call site
#141 added; the gating condition widened from `tense === 'past' ||
agreement.includes('nork')` to also include `agreement.includes('nori')`, so
NOR-NORI verbs' present/future tenses get lures too (previously only
NOR-NORK present and any past tense did).

**What this does *not* cover, and isn't planned to**: the issue's literal
"Slot 1 = wrong-NORK" / "Slot 2 = wrong-NORI" for NOR-NORI-NORK verbs would
need a same-verb table with the *other* axis varying (e.g. an "esan to zu"
table, or a "zuk eman" table) — `esan`/`eman`'s data model only has one
table each (their axis-fixed slice), so there's no such form to pull from
without authoring an entirely new table per verb. The generalized
case-frame lure above offers a related but distinct trap (missing
NORK-marking entirely, not a same-axis wrong value) as a partial,
honest-about-its-limits substitute. Filed **#177** for: this literal
same-verb cross-axis lure (if ever desired), the future-tense
illegal-voicing non-word safety mechanism, the hi/hitanoa wrong-gender/
neutral-form rows (blocked on #167's gendered toka/noka data), and the mood
rows (blocked on #171's dative-paradigm potential/conditional content).

Added `npm test` coverage in `src/logic.test.js` (`#165 NOR-NORI/NOR-NORI-
NORK distractor matrix rows`) following #141's existing test pattern: direct
unit tests on the two lure functions, plus `generateQuestions` integration
tests asserting the new distractors actually appear in `options`.

## 2026-06-16 — #162: Unit 25 `-zki-` object-number fodder + four extra-practice reviews

Closes #147's deferred scope items 2 and 4. Added `presentPlural`/
`pastPlural`/`futurePlural` conjugation tables to `esan`/`eman` (reusing
#164's tense-key names — zero new `TENSE_META`/i18n entries needed, since
both pairs of verbs describe the same "absolutive `NOR` argument goes
plural" concept) plus `esan-present-plural`/`eman-present-plural` lessons,
proving the generic-tense-key pattern extends to `nor-nori-nork` verbs too.

The issue's four "extra-practice" lesson types (fix-NORI, fix-NORK,
object-number, two-axis recombination) were all built as `review: true`
lessons pooling existing single-axis sources, rather than as a literal 2D
`NORK`×`NORI` table — the current data model only supports one varying
`person` axis per `conjugations` table (the other axis fixed via
`recipient`/`agent`), and adding genuine dual-axis variation within a single
question would require new data structure and new `generateQuestions`
code. The issue itself only requires the *two-axis recombination* lesson to
be recognition-only ("last recognition-first"), which is satisfiable by
pooling `esan`'s NORK-varying source and `eman`'s NORI-varying source into
one recognition review (`unit-25-two-axis-review`) — each individual
question still varies a single axis, but the lesson as a whole recombines
both rather than drilling either in isolation. Pooling for the same reason
on `unit-25-object-number-review` (singular vs. plural object contrast).
`unit-25-fix-nori-review`/`unit-25-fix-nork-review` are plain (non-
recognition) reviews pooling each verb's present+past+future, since those
just reinforce an already-drilled single axis.

Deferred: a true single-question dual-axis "type both the NORK pronoun and
the NORI suffix" lesson kind — no follow-up issue filed for this, since the
issue's own acceptance criteria only ask for a recognition-first two-axis
*review*, which the pooled approach above satisfies; revisit only if a
future issue explicitly asks for production-level dual-axis recombination.

## 2026-06-16 — #164: Unit 23 plural-NOR fodder + extra-practice lessons

Closes #146's deferred scope. Added `presentPlural`/`pastPlural`/`futurePlural`
as new `conjugations`/`TENSE_META` tense keys on `gustatu`/`iruditu`/`ahaztu`
— reusing the existing `generateQuestions`/`describeLesson` machinery
generically (same pattern as #148's `potential`/`baldintza`/`conditional`
keys), so no engine changes were needed. Unit 23 gained three new production
lessons drilling the plural forms directly (`*-present-plural`), plus two
review lessons: `unit-23-number-split-review` (recognition-mode, interleaving
each verb's singular and plural present sources to drill the `zait`-vs-
`zaizkit` contrast) and `unit-23-case-frame-buffer` (production-mode,
mixing all three verbs' singular present to over-learn the case frame ahead
of Unit 25's ditransitive jump) — both built from the existing `review: true`
+ `sources` pooling, no new lesson-engine code required.

Deliberately scoped out: a true side-by-side "pick zait or zaizkit for this
exact sentence" question kind (would need new `kind` handling in
`generateQuestions`/`buildQuestion`, since the engine currently treats each
`(verb, tense, person)` triple as a single fixed answer, not a number choice)
— the interleaved recognition review above drills the same contrast across
separate questions instead, which needs no engine work and is good enough for
now. Also out of scope: dedicated Unit 24 lessons for `pastPlural`/
`futurePlural` (the data exists as distractor fodder for #141's Distractor
Engine Matrix, per the issue's own framing, but #164 only asked for Unit 23's
lessons) — left as data without lessons, same "fodder first, lesson later"
split #141 itself depends on.

## 2026-06-16 — #155: `erosi` re-audit for purchasable-object `validFor` (residual #124 gap)

The #124 `validFor` backfill that shipped to `main` was more conservative than
the alternative drafted in the superseded PR #132: for concrete/purchasable
objects bought by an agentive human subject (book, car, pencil, ticket,
passport, map, house, coffee, water, gift, film, the generic "hori"), it
omitted `erosi` from `validFor`, meaning a correct "I buy X" alternative could
be offered as a wrong distractor. Added `erosi` to `ukan`/`nahi`/`ikusi`'s
matching sentences. Symmetrically, `erosi`'s own sentences for the same
object classes (book, jacket, car, house, ticket, gift, record) were missing
`ukan`/`nahi`/`eduki`/`ikusi` entirely — only `jan` had been considered as a
candidate sibling for `erosi`'s non-food objects, so that gap was closed too.

Left unchanged, with reasoning re-confirmed: kinship objects (sister/brother/
son) and non-agentive subjects (a dog with a bone, a cat with milk, "Etxeak
lorategi bat" — a house "having" a garden) keep `erosi` excluded — none of
"a sister"/the dog/the cat/the house is a plausible buyer in these frames.
`eduki`'s "object in pocket/hand" sentences (key, money, phone, card) also
keep `erosi` excluded — "I buy a key in my pocket" doesn't read as the same
statement as "I have a key in my pocket"; the location modifier doesn't
combine with a buying-event reading. `jakin`'s fact/answer objects aren't
purchasable, so `erosi` was never a candidate there. The confirmed-wrong pairs
(`jan`↔`edan`, `ukan`↔`jakin`, `eduki`↔`jakin`) stay excluded throughout.

## 2026-06-16 — #148: `behar` + Ahalera/Baldintza/Ondorioa (Units 19/28/29, core scope)

The epic's final sub-issue covers N-19 (behar/obligation), N-28 (Ahalera/
potential), N-29 (Baldintza & Ondorioa/conditional), N-30 (imperative), N-31
(subjunctive), and N-37–39 (causatives). Core scope for this PR is N-19/28/29
only — the three new `VERBS` tenses (`potential`, `baldintza`, `conditional`)
and the new `behar` entry are all directly tabulated in
`docs/CONJUGATIONS.md` §2 (`izan`) and §3 (`ukan`, `NOR` = `hura` column),
needing no derivation. N-30/31/37-39 need new mechanics (imperative's
addressee-only person gaps, subjunctive's construction-based recognition,
causative's `-arazi`/`-erazi` conditioning) and are deferred to a follow-up
issue.

`izan`/`ukan`'s three new tenses are **form-only** — no `sentences`/
`pronounSentences`/`negativeSentences` — same choice already made for
`behar`. `generateQuestions` falls back to `kind: 'form'` (plain
multiple-choice over the conjugation table) when a tense has no sentence
data, so this needed zero engine changes; `TENSE_META` additions are
similarly additive only. Sentence frames for these tenses (and for `behar`,
whose complement is an infinitive — "Joan behar dut" — not an object noun,
so #124's noun-object `validFor` tagging doesn't apply as-is) are deferred to
the same follow-up.

`ukan`'s three new tenses omit `hi` (6 persons, matching its existing
`present`/`past`/`future` tables); `izan`'s include `hi` (7 persons, directly
tabulated in CONJUGATIONS.md §2). Both verbs' dative-paradigm potential/
conditional (`gustatu`/`iruditu`/`ahaztu`/`esan`/`eman`, recognition-only per
the journey's own focus text) are deferred — they have zero existing
potential/conditional keys and need a careful pass against §5's ditransitive
Ahalera/Ondorioa grids.

## 2026-06-15 — #145: `kind: 'reading'` comprehension questions (Unit 36, core scope)

**Decision:** Implemented Unit 36 ("Passive & Reading Real Text") as a new
`kind: 'reading'` question type, grounded entirely in CONJUGATIONS.md §15's
"nor-shift" table (`Nik atea ireki dut.` → `Atea ireki da.`, plus its
"impersonal/passive" siblings like `hitz egin`/`erre`/`idatzi`). §14's
non-finite forms are **not** covered — authoring correct non-finite items
without native-speaker verification was judged too risky for a core scope;
deferred to a follow-up issue alongside expanding `READING_ITEMS` beyond its
10 starter items.

**Data shape:** `src/data/readingItems.js` exports `READING_ITEMS`, an array
of `{ id, source, gloss: {en,es,eu}, prompt: {en,es,eu}, options, answer }` —
a Basque `source` sentence, a `gloss` (translation/restatement), a `prompt`
(the comprehension question), and four candidate Basque sentences. Items 1-8
go agent → agentless (anticausative/impersonal nor-shift); items 9-10 go the
other way (agentless → "who does this?"), since both directions appear in
§15's prose examples. `gloss.eu` deliberately repeats `source` verbatim
(a Basque-speaking learner needs no translation of Basque) — `QuestionPrompt`
skips the gloss line when it equals `source`, rather than inventing a
from-scratch Basque paraphrase of each sentence.

**Engine integration:** `generateReadingQuestions` (`lessonLogic.js`) is a new
sibling to `generateCrossVerbQuestions`/`generateCaseMixerQuestions` — takes
`READING_ITEMS`-shaped items and `{ rounds }`, returns `{ kind: 'reading',
itemId, source, gloss, prompt, correct, options }`. `unit-36-reading`
(`data/lessons.js`) is `{ review: true, kind: 'reading', mode: 'recognition',
itemIds: [...] }` — a lesson with neither `verbId` nor `sources`, the first of
its kind. `createExerciseState` (`App.jsx`) special-cases `lesson.kind ===
'reading'` with an early return before the `sources`/cross-verb/case-mixer
machinery (none of which applies — a reading item has no verb/tense/person).
Three other `App.jsx` spots needed guards for a `kind: 'reading'`
lesson/question having no `verbId`/`tense`: `describeLesson` (new top branch,
before the `lesson.sources.map` that assumes pooled/review shape),
`ExerciseScreen`'s `showPreview` (excluded, since `LessonPreviewScreen` needs
a real verb/tense), and `QuestionPrompt` (new early branch rendering
`source`/`gloss`/`prompt` instead of `verb`/`tenseMeta`). `getExplanation`
needed no change — its existing kind-checks already fall through to `null`
without touching `verb` for an unrecognized kind.
`flagQuestionSummary`/`buildFlagDiagnostics` needed only additive guards
(`question.source`). `exerciseReducer` also gained a `question.verbId` guard
before recording a miss, so a missed reading question doesn't add a bogus
`undefined:undefined:undefined` entry to `errorStats`.

## 2026-06-15 — #144: `hi` as a new ungendered person (Unit 32, core scope)

**Decision:** Implemented Unit 32 ("Meet `hi`" — `hi` as a subject in known
paradigms, no allocutivity yet) as #144's core scope, deferring Units 33-35
(toka/noka allocutive forms), `jakin`/`ukan`'s gender-split `hi`-as-`NORK`
present (`dakik`/`dakin`, `duk`/`dun`), and the hi/hitanoa distractor-matrix
row to a follow-up issue (#167).

**Data-shape convention** (resolving #144's central question): `hi` is added
as a plain, **ungendered** person key wherever Basque genuinely has a single
invariant `hi`-as-subject form — `izan`/`egon`/`joan`/`etorri` are `nor`-only,
so `hi` as the absolutive subject takes one form per tense regardless of `hi`'s
own gender (`haiz`/`hago`/`hoa`/`hator`, `hintzen`/`hengoen`/`joan
hintzen`/`etorri hintzen`, CONJUGATIONS.md §1/§6). `hi-m`/`hi-f` keys are
reserved for cells where Basque *does* split by gender — either `hi`-as-`NORK`
present tense (`ukan`'s `duk`/`dun`, `jakin`'s `dakik`/`dakin`, CONJUGATIONS.md
§3) or allocutive (hitanoa) marking on verbs where `hi` isn't even an argument
(§10) — both deferred to #167. This lets #144 add `hi` with zero changes to
`buildOptions`/`generateQuestions`/the UI: it's just a 7th key in
`conjugations`/`pronouns`, like any other person.

`joan`/`etorri`'s `hi` past is the periphrastic `joan hintzen`/`etorri
hintzen` — matching their existing `ni: 'joan nintzen'`/`ni: 'etorri nintzen'`
shape (the "Simple Past" forms, 2026-06-12) — not CONJUGATIONS.md §6's
synthetic literary `hindoan`/`hentorren`, which `VERBS` doesn't use for these
verbs' other persons either.

No `sentences`/`pronounSentences`/`negativeSentences` were added for `hi` —
`hi` questions are always `kind: 'form'` (bare conjugated form). Two new pooled
review lessons (`unit-32-hi-present`/`unit-32-hi-past`, `persons: ['hi']`,
sources = izan/egon/joan/etorri) rely on #139's cross-verb borrowing: each
verb's `hi` question borrows its 3 distractors from the other three verbs' `hi`
forms for that tense — exactly 3 siblings, exactly 3 distractors, no padding
needed. Past-tense questions also pick up #141's cross-tense lure (`haiz`
alongside `hintzen`) automatically.

Unit 32's payload dropped its `jakin` example ("Hik badakik?") since `jakin`
isn't touched by this core scope (its `hi`-as-`NORK` present is gender-split,
deferred to #167).

## 2026-06-15 — #141: Case-frame/cross-tense distractor lures (core scope)

**Decision:** Implemented the Distractor Engine Matrix (`docs/LEARNING_JOURNEY_PROPOSED.md`)
rows implementable with existing `izan`/`ukan` data — NOR-NORK present, past
pools, and the case-marking checkpoint's `pronoun` questions — as a new
**case-frame lure** primitive, deferring NOR-NORI, NOR-NORI-NORK, future,
hi/hitanoa, and the moods with no data yet to a follow-up issue (#165).

`getCaseFrameLure`/`getCaseFramePronounLure` (`lessonLogic.js`) find a verb's
*case-frame-inverse* sibling — same `nori` status, opposite `nork` status
(`izan` <-> `ukan`) — and return that sibling's same-person form/pronoun as a
designated "ergative drift" distractor (`naiz` alongside `dut`, `Nik`
alongside `Ni`). `getCrossTenseLure` returns a past-tense question's own
verb's present-tense form for the same person (`naiz` alongside `nintzen`) —
the matrix's "Past pools" Slot 3. Both are gated by `agreement.includes('nori')`,
so NOR-NORI/NOR-NORI-NORK verbs (#146/#147) never participate until #165.

**Automatic, not opt-in**: `buildOptions` gained a `priorityCandidates` param —
forms guaranteed a distractor slot (ahead of the random same-table pool) when
present and distinct from `correct`, still counting toward the existing
3-distractor cap. `generateQuestions` computes these lures and passes them for
every `form`/`sentence`/`negative`/`pronoun` question where the matrix calls
for one (NOR-NORK present, any verb's past, any non-NOR-NORI verb's `pronoun`
questions) — rather than a new opt-in flag like `mode`/`includeNegation` —
because the acceptance criterion ("each agreement pattern generates
distractors matching its matrix row") reads as a blanket guarantee, and the
lures gracefully no-op (return `undefined`, filtered out) without `verbs` or
for agreement shapes that don't qualify, so existing test fixtures without
`agreement`/`pronouns` are unaffected. One existing #139 fixture
(`incompatibleSibling` in `logic.test.js`) had its `agreement` changed from
`['nor']` to `['nor', 'nori']` to stay genuinely unrelated to its NOR-NORK
anchor under the new case-frame-inverse matching — it was previously *only*
"not agreement-compatible", which #141 now redefines as "case-frame-inverse
and thus a deliberate lure".

## 2026-06-15 — #142: Axis-fixed metadata (`recipient`/`agent`) for future ditransitive verbs

**Decision:** NOR-NORI-NORK (ditransitive) verbs' `conjugations` are genuinely
2D (NORK x NORI), which the existing `conjugations[tense][person]` shape can't
represent directly. Rather than redesign the data model now (no ditransitive
verb exists yet — that's #147's job), added forward-compatible *axis-fixed*
metadata mirroring `nor-nork`'s existing `object: 'hura'`: a ditransitive verb
sets exactly one of `recipient` (fixes NORI, so `person` varies over NORK —
e.g. `recipient: 'hura'` → `diot`/`diozu`/`dio`/... "I/you/he tell *him*") or
`agent` (fixes NORK, so `person` varies over NORI — e.g. `agent: 'ni'` →
`diot`/`dizut`/`diet`/... "I tell him/you/them"). A lesson on such a verb is
thus still a flat `conjugations[tense][person]` table, just with one argument
held constant across the whole table.

Added `getFixedArgument(verb)` (`lessonLogic.js`) to resolve `recipient`/
`agent` into `{ role, person }` (or `null` for every current verb), threaded
it into `generateQuestions`'s per-question `source.fixedArgument`, and added a
`FixedArgumentBadge` (`App.jsx`) that shows e.g. "NORI: hura" — used in
`VerbBadgeRow` (verb preview), `LessonNode` (lesson list), and `QuestionPrompt`
(per-question during exercises), so learners always know which argument is
held fixed. Also extended `agreementsCompatible` to compare `nori`-inclusion
(in addition to the existing `nork` check), so cross-verb distractor borrowing
won't mix ditransitive and non-ditransitive forms once #147 lands.

All of this is currently inert — no `VERBS` entry sets `recipient`/`agent` or
has `nori` in `agreement` — but a `logic.test.js` test loops over any future
ditransitive `VERBS` entries to enforce exactly one fixed argument resolves
correctly, so #147 gets fast feedback if it misses a field.

## 2026-06-15 — #143: Phase II reorder (present-before-past), `ibili`/`hartu` moves, MP staging

**Decision:** Reordered Phase II per `docs/LEARNING_JOURNEY_PROPOSED.md`'s
Stage 3-7 layout: Unit 12 ("Daily Routine (Transitive)" — `jan`/`edan`/`erosi`/
`ikusi`/`hartu` present) now precedes Unit 13 (the `ukan` past pool covering
those same verbs), so every verb's present is taught before its past
(`LEARNING_JOURNEY_EVALUATION.md` finding F8). Similarly, Unit 15 (`eduki`
past) now precedes Unit 16 (`egon` past), keeping `eduki`'s present (Unit 14)
and past (Unit 15) adjacent like Units 12/13. `ibili`'s present moved from
Unit 14 to Unit 6 (alongside `joan`/`etorri`) — its past was already in Unit
11's `izan`-past pool, so it was debuting in the past before the present
(F8); only its `gu`/`zuek`/`haiek` forms still arrive in Unit 14.

**New verb — `hartu` ("to take"):** added to Unit 12's pool to stage the first
`-tzen`/`-ten` minimal pair against `jan`'s `jaten` (`jaten` vs. `hartzen`).
Full periphrastic nor-nork present/past/future tables, regular `-tu`
conjugation. Sentence objects (autobusa/trena/taxia/aterkia/katua/erabakia/
txanda) are deliberately non-food/drink/purchase so `validFor: []` holds
against every other pool verb (jan/edan/erosi/ikusi) without a cross-verb
audit — flagged in `docs/LANGUAGE_DECISIONS.md` for a native-speaker sanity
check of the forms/sentences themselves.

**`-ko`/`-go` MP at Unit 17:** `future-intro-review`/`-plural` (Unit 17) now
include `etorri`'s future alongside `izan`/`ukan`/`joan`, staging `izango`
(-go) vs. `etorriko` (-ko) — `etorri`'s future table already existed for Unit
18's mixer, so this needed no new `VERBS` data.

**Stage regroup — merged rather than split:** The proposed doc gives Phase II
five stages (3: Looking Back I; 4: Daily Actions; 5: Possessions; 6: Location,
past; 7: The Future). Stage numbers are global across the whole journey
(`src/i18n/journeyTranslations.js`'s "Etapa N"/"N. atala" labels), and Phase III's
existing stage is already `phase-3-stage-7` — adding a fifth Phase II stage
would either collide with that id or require renumbering every stage from
Phase III onward (through Phase VI), which is out of scope here. Instead,
Phase II keeps **4** stages: Stage 3 (Unit 11 alone), Stage 4 "Daily Actions"
(Units 12-13), Stage 5 "Possessions & Looking Back II" (Units 14-16, merging
the proposed Stages 5 and 6), Stage 6 "The Future" (Units 17-19, unchanged).
The unit-level reordering — the actual substance of F8's fix — is identical
either way.

**Pronoun-Fading:** already compliant — Phase I lessons use explicit
`pronoun`/`pronounSentences` framings (Stage A) and nothing in Phase II-III
introduces pro-drop yet (Stage C arrives with Phase III, #145/#148). No code
changes needed for this item.

## 2026-06-15 — #140: `mode: 'recognition'` lesson scope

**Decision:** Added an optional `mode: 'recognition'` field to `generateQuestions`
(threaded from a `LESSONS` entry via `createExerciseState`), for the
`docs/LEARNING_JOURNEY_PROPOSED.md` units marked **[R]** (recognition-only) —
the dative potential/conditional (N-28/N-29), ditransitive
imperative/subjunctive (N-30/N-31), the reading unit, and the recognized
`-erazi` variant (N-36). It permanently excludes the production framings
(`type-verb`/`type-pronoun`/`type-negative`) for that lesson's entire
lifetime.

**Relationship to `noTyping`:** `noTyping` (a learner's first attempts at any
lesson) *also* drops `spot-error` — recalling/cross-checking a brand-new form
feels too demanding on a first pass. `mode: 'recognition'` keeps `spot-error`
available, since spotting a wrong form in someone else's sentence is itself a
recognition task, not production — exactly the kind of question an [R] unit
should lean on. Internally both collapse into one `noProduction` flag for the
three typed kinds; `spot-error`'s own gate stays keyed to `noTyping` only.

No stored-progress shape change. `describeLesson` now also returns
`recognitionOnly`, surfaced as a small badge (`recognitionOnly` i18n key) on
`LessonNode` — purely cosmetic, no lesson currently sets `mode: 'recognition'`
until the [R]-tagged units (#148) land.

## 2026-06-15 — #139: distractor-floor fix — borrow distractors/spot-error slots for small tables

**Decision:** `buildOptions` requires 3 distractors to reach the usual
4-option multiple choice, but a 3-person conjugation table (e.g. `nahi`/
`jakin`'s `present`/`future`, and the upcoming N-30 imperative) can only
supply 2 from its own other persons — leaving those questions stuck at 3
options. Fixed by adding a last-resort "borrow pool": when `verbs` (the full
`VERBS` list) is passed to `generateQuestions`, `getBorrowedDistractors`
collects the same-person form from every `agreementsCompatible` sibling verb
(skipping the anchor itself), and `buildOptions` tops up its own-table
distractor pool from that borrow pool only when it's short. `buildOptions`'s
dedup/cap logic is unchanged, so 4+-person tables (which already fill 3
distractors from their own table) are unaffected.

The same gap existed for `spot-error` questions, which require
`personsWithSentences.length >= 4`: `nahi`/`jakin` only have 3 sentenced
persons, so they could never qualify. `getBorrowedSpotErrorSlots` lends a
compatible sibling's own (person, sentence, form, altForms) slots for any
person the anchor doesn't already cover (e.g. `ukan`'s `gu`/`zuek`/`haiek`
beyond `nahi`/`jakin`'s `ni`/`zu`/`hura`), and `buildSpotErrorQuestion` was
rewritten around a uniform "slot" shape so anchor/own/borrowed slots are
interchangeable. `availableKinds`'s spot-error gate now checks
`personsWithSentences.length + borrowedSpotErrorSlots.length >= 4`.

**Scope:** `pronoun`/`type-pronoun` questions deliberately don't borrow —
`verb.pronouns` is a tiny fixed 3-entry table unrelated to other verbs'
conjugations, so there's no sensible sibling pool, and they were already
excluded from `extraCandidates` for the same reason. Both new helpers return
`[]` without `verbs` (or without `agreement` — some minimal test fixtures
omit it), preserving the original same-table-only behaviour exactly.

## 2026-06-15 — #151: 37→39 spine renumber — split old Unit 2 into N-2/N-3/N-4

**Decision:** Completed the 37→39 renumber promised by #137/#138 (the
O-n/P-n → N-n mapping in `docs/LEARNING_JOURNEY_EVALUATION.md`). Old Unit 2
("Having, Wanting, Knowing" — `ukan`+`nahi`+`jakin` all at once) is the single
steepest jump in Phase I (the absolutive→ergative `ni`→`nik` subject shift),
per findings F6/F7, so it's now a three-unit on-ramp:

- **N-2 "The Ergative Leap"** — `ukan` present taught *alone* (object fixed to
  `hura`), with extra practice isolating the `ni`→`nik` shift
  (`ukan-ni-nik-shift-review`). `unit-2-review` is redefined to drill `ukan`
  present only (it previously also covered `nahi`/`jakin`, which moved to N-4).
- **N-3 '"Ni" vs. "Nik" — The Case-Marking Checkpoint"** — zero new verbs;
  drills bare (`izan`/`egon`) vs. ergative (`ukan`) subjects to kill ergative
  `-k` drift at its source. N-3·L2's "spot the drift" framing (recognizing
  `†Nik naiz`-style errors) is implemented with today's case-mixer/verb-choice
  primitives (`generateCaseMixerQuestions`/`generateCrossVerbQuestions`)
  rather than a dedicated error-spotting mechanic — that's deferred to #141.
- **N-4 "Knowing & Wanting"** — `jakin` + `nahi`, reinforcing the same
  ergative suffix family on a fully synthetic verb (`jakin`), plus extra
  practice pairing `jakin` with `ukan` (`jakin-suffix-family-review`).

Old units 3-37 shift +2 to new units 5-39 (gates: P-8/18/25/37 → N-10/20/27/39,
matching #138's `GATE_LESSON_IDS`, derived generically from `gate: true` so it
needed no code changes). Updated `journey.js`, `data/lessons.js` (including its
explanatory "Unit N" comments), `i18n/journeyTranslations.js` (new
`units[2]`/`units[3]`/`units[4]`, re-keyed `units[5..39]`, updated stage 1/2
titles), and `docs/LEARNING_JOURNEY.md` throughout.

**Lesson-id stability:** all pre-existing `LESSONS` ids and `STORAGE_KEY`
(`v1`) are unchanged — `ukan-present`, `jakin-present`, `nahi-present` keep
their ids, just reassigned to different units; only new review-lesson ids
(`ukan-ni-nik-shift-review`, `case-marking-sort-review`,
`case-marking-drift-review`, `case-marking-checkpoint-review`,
`jakin-suffix-family-review`, `knowing-wanting-review`) were added. Existing
player progress survives untouched.

## 2026-06-15 — #138: score-gated Refresh Gate units

**Decision:** `getUnlockedLessonIds` (`src/lessonLogic.js`) now takes an
optional `gateLessonIds` set (`journey.js`'s new `GATE_LESSON_IDS` — the last
`lessonIds` entry of every `available`, `gate: true` unit, currently just
Unit 8's `unit-5-review-3`). For the lesson right after one of these, the
unlock predicate is `bestStars >= GATE_PASS_STARS` (2, i.e. ≥80%) instead of
the usual `attempts > 0`. Everything else (already-unlocked lessons never
re-lock, `?dev=unlock-all`, non-gate progression) is unchanged.

A new `isLockedByGateScore` helper distinguishes "locked, gate not attempted
yet" from "locked, gate attempted but under 80%" — `LessonNode` and
`ProgressTab` show a `gateNeedsScore` prompt ("Score 80% on the Refresh Gate
above to continue", translated in all three languages) only in the latter
case. The gate itself stays fully replayable either way — this is a soft
wall, no lockout and no progress loss, per
`docs/LEARNING_JOURNEY_PROPOSED.md` design principle 4.

Implemented against the foundation as it stands today (37-unit layout from
#137, gates at P-8/18/25/37, only P-8 currently `available`) rather than
#138's issue body, which cites "N-10/20/27/39" — the post-#151 39-unit
numbering for these same four gates (#151 tracks the 37→39 spine renumber).
`GATE_LESSON_IDS` is derived generically from `gate: true`, so it needs no
changes once #151 lands and once P-18/25/37 (→ N-20/27/39) gain `lessonIds`.

## 2026-06-14 — #137: renumbered `JOURNEY` to the 37-unit layout

**Decision:** Rewrote `src/journey.js`'s phases/stages/units to match
`docs/LEARNING_JOURNEY_PROPOSED.md`'s 37-unit layout (the O-n → P-n mapping
from `docs/LEARNING_JOURNEY_EVALUATION.md`), updated `docs/LEARNING_JOURNEY.md`
and `src/i18n/journeyTranslations.js` (es/eu) to match, and marked `gate: true`
on the new Refresh Gate units (8, 18, 25, 37). This is part of epic #149 and
unblocks its other sub-issues (#138-#148).

**Lesson-id stability:** No `LESSONS` ids changed and `STORAGE_KEY` stays
`v1` — only `journey.js`'s unit→`lessonIds` wiring and the explanatory
"Unit N" comments in `src/data/lessons.js` were renumbered to match the new
unit numbers (old 6→7, 7→8, 8→9, 9→10, 10→11, 11→12, 12→13, 13→14, 14→15,
15→16; units 1-5 unchanged). Existing player progress survives untouched.

**Unit 5/6 split deferred:** The proposed split of O-5 "Expansion" into P-5
(absolutive plurals) and P-6 (ergative plurals) is *not* done here — Unit 5
keeps all of O-5's existing `lessonIds` (renamed "Expansion: Absolutive
Plurals", `available`) even though some of that content is ergative-paradigm,
and the new Unit 6 "Expansion: Ergative Plurals" is added as `pending` with no
`lessonIds`. Redistributing the actual lessons between Units 5 and 6 is left to
#143, per #137's "data/labels only, no engine changes" scope.

## 2026-06-14 — #126: retired the pair-level cross-candidate audit artifacts

**Decision:** Removed `scripts/list-cross-candidates.mjs`,
`docs/CROSS_CANDIDATE_REVIEW.md`, `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`,
and `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` — the pair-level audit/triage
workflow (#112-115) that `validFor` (#122-125) supersedes.
`CROSS_CANDIDATE_EXCLUSIONS`/`isCrossCandidateExcluded`/
`sentenceTemplatesCollide` were already removed from `src/lessonLogic.js` by
#123, so this is purely doc/script cleanup — confirmed via grep that nothing
in `src/` or `package.json` referenced the removed script. `docs/DECISIONS.md`
entries that reference these now-removed files/identifiers (the #112-115
history below) are left as-is — they're a historical record of what was
decided and why at the time, not living documentation. `docs/SENTENCE_FRAMES.md`
gained a brief "Status: epic #127 complete" note pointing back here instead
of being rewritten — its schema/call-site sections remain the reference for
`validFor`. This closes out epic #127 (#121-126 all done).

## 2026-06-14 — #124: backfilled `validFor` across the `nor-nork` cluster's sentences

**Decision:** Every `sentences.present`/`negativeSentences.present` variant
for the eight `nor-nork` verbs (`ukan`, `nahi`, `jakin`, `eduki`, `ikusi`,
`jan`, `edan`, `erosi`) is now `{ text, validFor }` — no bare strings left in
those fields for this cluster (`future`/`past` automatically inherit via the
existing by-reference reuse loops in `src/data/verbs.js`). A new coverage
test (`src/logic.test.js`, "validFor coverage for the nor-nork cluster")
enforces this going forward: every `agreement.includes('nork')` verb's
present-tense sentence/negative-sentence variants must have an explicit
`validFor` array (even `[]`), for any future sentence additions.

**Judgment approach** (per `docs/SENTENCE_FRAMES.md`'s worked examples):
candidate siblings for each verb were restricted to #114's confirmed
"both valid" pairs (`ukan`↔`nahi`/`eduki`/`ikusi`, `jakin`↔`ikusi`/`nahi`,
`eduki`↔`nahi`, `jan`/`edan`↔`erosi`) — `jakin`↔`ukan`, `jakin`↔`eduki`, and
`jan`↔`edan` (#114's confirmed-*wrong* pairs) never appear in any `validFor`.
Within those candidate pairs, each sentence was judged on its own object:
concrete/ownable/visible nouns (book, car, key, ticket...) admit the full
candidate set (`ukan`'s `'Nik liburu bat ___.'` → `['nahi','eduki','ikusi']`,
matching the doc's worked example exactly); abstract or non-agentive-subject
sentences admit a narrower set or none (`ukan`'s `'Nik bilera bat ___.'` "I
have a meeting" → `['eduki']` only — `nahi`/`ikusi` don't fit "a meeting";
`'Etxeak lorategi bat ___.'` "the house has a garden" → `['eduki']`, since
`nahi`/`ikusi` need an agentive subject). `jakin`'s candidates split on
whether the object is something you can "see" (`'Nik bidea ___.'`, the way →
`['ikusi']`) vs "want" (`'Nik sekretua ___.'`, a secret → `['nahi']`) vs both
(`'Nik erantzuna ___.'`, the answer → `['ikusi','nahi']`) — the same verb pair
gets different verdicts per sentence, as the doc's "book" vs "time" contrast
intends. `eduki`'s `'[object] poltsikoan/eskuan ___.'` ("in my pocket/hand")
sentences all get `['ukan','ikusi']` (near-synonym "have" plus the audit's
"I see X in my hand" example) but never `nahi` ("I want X in my pocket" reads
oddly). `jan`/`edan`'s food/drink objects all get `['erosi']` ("eat/drink X"
vs "buy X" both natural) except `'Katuak esnea ___.'` (a cat can't be the one
buying milk) → `[]`. `erosi`'s own sentences get `['jan']` only for the
literal food objects (`'Nik ogia ___.'`, `'Zuk sagarrak ___?'`, `'Saltzaileak
fruta ___.'`) — non-food objects (books, cars, houses, jackets, tickets,
gifts, records) get `[]`, since `jan`/`edan` forms don't fit them.
`pronounSentences` was left as-is (bare strings) per
`docs/SENTENCE_FRAMES.md`'s "fields that don't consume `validFor` yet" —
`pronoun`/`type-pronoun` questions don't draw cross-verb candidates, so an
untagged `pronounSentences` entry changes nothing.

**Out of scope:** `ari`/`ibili` (the two `nor`-only verbs not covered by
#125's `izan`/`egon`/`joan`/`etorri` pass) — the original audit found no
"both valid" cases for the `nor` cluster and the migration mapping in
`docs/SENTENCE_FRAMES.md` doesn't list any `ari`/`ibili` pairs, so they're
left untagged (the safe default) and outside the new coverage test's scope
(which only covers `agreement.includes('nork')` verbs).

## 2026-06-14 — #125: rewrote `etorri`'s frameless present/negative sentences to carry a discriminating adjunct

**Decision:** `etorri.sentences.present`'s bare-temporal variants (`'Ni orain
___.'`, `'Hura orain ___.'`, `'Zu bihar ___.'`, etc. — 18 of the 24 present
variants) and two `negativeSentences` entries (`zu`: `'Zu ez ___ bihar.'`,
`hura`: `'Hura ez ___ orain.'`) had no destination, location, or predicate —
`da`/`dago`/`doa`/`dator` were all equally grammatical, exactly the
`'Hura orain ___.'` `verb-choice` ambiguity reported in #127. Each was
rewritten to combine its existing subject/time adverb with an allative `-ra`
destination (`'Hura orain ikastolara ___.'`, `'Zu bihar eskolara ___.'`,
etc.), reusing destinations already established in `joan`/`etorri`'s other
variants (`etxera`, `eskolara`, `lanera`, `dendara`, `hondartzara`,
`liburutegira`, `unibertsitatera`, `parkera`) plus two new ones
(`ikastolara`, `auzora`, `kalera`) for variety. All rewritten variants are now
in the same allative frame as `etorri`'s existing tagged variants, so they get
`validFor: ['joan']` (per `docs/SENTENCE_FRAMES.md` worked example 2) instead
of the `['izan', 'egon', 'joan']` "still ambiguous" marker from #124's
backfill.

**Audit of `izan`/`egon`/`joan` for the same pattern**: none found. Every
`izan` variant is a predicate-nominal frame, every `egon` variant is a
locative `-an`/`-en` frame, and every `joan` variant is already an allative
`-ra` frame (`validFor: ['etorri']`) — all already tagged `validFor: []`/
`['etorri']` with no frameless leftovers. The frameless pattern was isolated
to `etorri`.

**Why:** `validFor: ['izan', 'egon', 'joan']` correctly marked these sentences
as "still ambiguous, don't offer any cross candidate" — but left the
underlying ambiguity in place for a learner answering a `verb-choice`/
`case-mixer` question built around one of them (every `nor`-cluster form would
read as equally correct). Rewriting the sentence itself, rather than
permanently excluding it from being a useful source, is the fix #122 always
intended for this case (`docs/SENTENCE_FRAMES.md` worked example 3).

## 2026-06-14 — Results screen vibrates with a result-tier pattern, with variety per tier

**Decision:** Added `pickResultVibrationPattern`/`vibrateResult` to
`hapticsUtils.js`, called once from a `useEffect` in `LessonResultsScreen`
(keyed on `stars`, so it fires once when the screen first mounts). Each star
band (`computeStars`' 0-3) has its own `navigator.vibrate` pattern(s) — 3-star
bands have several options, picked at random, so a perfect score doesn't
always feel identical; 0-star is a single short, gentle pulse, just enough to
mark "done" without reading as punishment. Same `?.()` no-op-on-unsupported
approach as `vibrateCorrect`/`vibrateIncorrect`.

**Why:** Extends the existing per-answer haptics (2026-06-14, below) to the
lesson conclusion, Duolingo-style — the celebration should be felt as well as
seen/read, and varying it the same way `ENCOURAGEMENT_VARIANTS` and
`createCelebration` already vary keeps repeated perfect scores from feeling
mechanical.

## 2026-06-14 — Compressed the future stage (Stage 6) from four units to two, renumbering the downstream curriculum

**Decision:** Stage 6 ("Talking About the Future") was four near-identical
per-verb drill units (old Units 14-17, "Future Groups A-D", ~32 lessons), each
applying the same `-ko`/`-go` participle rule to three more verbs as
singular/plural practice pairs + a review. Collapsed into two:
- **Unit 14 "The Future Tense"** — introduces the rule on a three-verb core
  spanning both auxiliary patterns (`izan` nor/`naiz`, `ukan` nor-nork/`dut`,
  `joan` motion/`naiz`), full singular/plural + an intro-review pair (8 lessons).
- **Unit 15 "The Future, Across Every Verb"** — the remaining ten verbs
  delivered as themed cross-verb *mixer reviews* (`future-mixer-*`) ending in a
  cumulative capstone, rather than per-verb form drills (8 lessons).

Net: 16 lessons across 2 units, down from ~32 across 4. Every verb is still
covered (three focused in Unit 14, all of them across Unit 15's mixers + the
capstone, which reuses the Unit 14 core).

**Why:** the Basque future is morphologically trivial — one participle rule
layered onto auxiliaries already mastered in Units 1-13 — so four units of
verb-by-verb drilling is vocabulary review dressed as grammar, and repetitive.
Reviews are the engine's *more* varied exercise type (cross-verb "which verb
fits?", case-mixer, the full sentence/typing/spot-error mix, weak-spot
boosters), so a mixer-based Unit 15 is both shorter and less monotonous than
re-drilling each table. `TARGET_EXERCISE_COUNT` self-balances each mixer's
length regardless of how many sources it pools, so the mixers stay ~12
questions.

**Renumbering:** collapsing two unit slots shifted every later unit down by two
(old 18→16 … old 32→30). Updated the live trio (`journey.js`,
`data/lessons.js`, `i18n/journeyTranslations.js` — `journey.test.js` green) and
the forward-looking docs (`LEARNING_JOURNEY.md`, `EXERCISE_ENGINE.md`,
`LANGUAGE_DECISIONS.md`, `EXERCISE_VARIETY_PLAN.md`), plus unit-number mentions
in `src/` comments. The old future lesson ids (`*-future` per-verb practice,
`unit-9-review-1..4`) are replaced by `future-intro-review*` and
`future-mixer-*`.

**This log left on its own (multi-scheme) numbering:** `DECISIONS.md` is a
dated archive where each entry uses the numbering current on its date — and
several entries record explicit old→new renumbering arithmetic (e.g. 2026-06-12
"renumbering Units 7-25 to 10-32") that mechanically renumbering would break
rather than make consistent. So past entries are left as written; this entry is
the authoritative record in the current numbering.

## 2026-06-14 — Answer feedback triggers a short vibration via the Vibration API

**Decision:** Added `src/hapticsUtils.js` (`vibrateCorrect`/`vibrateIncorrect`),
called from `submitAnswer` in `App.jsx` right after `isCorrect` is computed —
a short single pulse for correct, a slightly longer triple pulse for
incorrect. Both just call `navigator.vibrate?.(...)`, so on iOS Safari and
other browsers without the Vibration API it's a silent no-op.

**Why:** Cheap, immediate tactile feedback that reinforces the
correct/incorrect visual state, Duolingo-style. No settings toggle was added —
if it turns out to be annoying on some devices, a mute/haptics setting can be
added later, but it didn't seem worth the UI for a first cut.


## 2026-06-14 — #123: `lessonLogic.js` rebuilt around per-sentence `validFor`

**Decision:** Implemented #122's schema. `normalizeSentence(value)` turns a
bare string into `{ text }` (`validFor: undefined`) and passes a `{ text,
validFor }` object through unchanged. `filterExtraCandidates(candidates,
validFor)` is the single chokepoint both `extraCandidates` (the `sentence`/
`negative` cases in `generateQuestions`) and `collectCrossSourceCandidates`
(`verb-choice`/`case-mixer`) go through to decide which sibling forms survive.
`getCrossVerbCandidates` now returns `{ [person]: Array<{ verbId, form }> }`
(was `string[]`) so callers have the `verbId` to check against a sentence's
`validFor`. `sentenceTemplatesCollide`, `CROSS_CANDIDATE_EXCLUSIONS`, and
`isCrossCandidateExcluded` are removed — their job is now done per-sentence by
`validFor`.

**Semantics (correcting #122's entry below, which had this backwards):**
`validFor` *absent* (a not-yet-tagged bare string) is the safe default and
excludes every sibling; `validFor: []` is the vetted, maximally-permissive
state and excludes nothing; `validFor: ['x', ...]` excludes only those
siblings. #122's entry below says "bare strings still accepted as
`validFor: []`" — that was an error (echoed, inconsistently, in #123's own
issue body). The implemented behaviour follows #122's design-doc prose and
#123's algorithm spec (point 2), and `docs/SENTENCE_FRAMES.md` has been
corrected to match.

**Why:** Until #124 backfills `validFor` across `VERBS`, every real sentence
is still an untagged bare string, so `extraCandidates`/`crossVerbQuestions`/
`caseMixerQuestions` are now empty everywhere (verified across all 26 reviews:
0 cross-verb/case-mixer questions, no question with fewer than 2 options) —
expected and temporary, the safe default working as designed. #124 restores
variety by tagging real sentences.

## 2026-06-14 — #122: per-sentence `validFor` tag replaces pair-level cross-candidate exclusions

**Decision:** `docs/SENTENCE_FRAMES.md` documents a new `validFor: string[]`
field on each `sentences`/`pronounSentences`/`negativeSentences` variant
(`{ text, validFor }`, replacing today's bare string/string-array shape,
with bare strings still accepted as `validFor: []`). It lists sibling verb
ids whose same-person form would *also* correctly complete that exact
sentence — `[]` means no `agreementsCompatible` sibling fits, the
maximally-discriminating case. One field is consumed identically by both
`extraCandidates` (`sentence`/`negative`) and `verb-choice`/`case-mixer`
candidate pools — the old `'always'`/`'verb-choice-only'` two-tier split in
`CROSS_CANDIDATE_EXCLUSIONS` is dropped (it had zero `'verb-choice-only'`
entries, so nothing is lost).

**Why:** correctness depends on the *sentence*, not the *verb pair* —
`ukan`'s `'Nik liburu bat ___.'` ("book") makes `nahi`/`eduki`/`ikusi`'s forms
all valid, but a hypothetical `'Nik denbora ___.'` ("time") wouldn't, even
though both are `ukan` sentences and both pairs are `'always'`-excluded today.
Conversely, `etorri`'s `'Hura orain ___.'` has *no* sentence-level fix at the
pair level — every `nor`-cluster verb's form fits because the sentence itself
has no discriminating adjunct; `validFor` makes "this sentence can't usefully
discriminate" an explicit, taggable state (and #125 rewrites that sentence
rather than tagging it). Pure design issue — no `src/` runtime or data changes
here; #123 reimplements `lessonLogic.js` around this schema, #124 backfills
`VERBS`, #125 fixes `etorri`'s frameless variants, #126 retires the
pair-level system.

## 2026-06-14 — #121: `kind: 'form'` questions are exempt from `extraCandidates`

**Decision:** `generateQuestions`'s `default` (`kind: 'form'`) branch in
`lessonLogic.js` no longer passes `extraCandidates` into `buildOptions` — its
options are always same-table "other person" distractors only, same as
`pronoun`/`type-pronoun`.

**Why:** `kind: 'form'` is a bare "Zein forma da zuzena?" question with no
sentence. The `nor`-cluster "safe to mix" reasoning in
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md` relied on each verb's *sentence* having
a distinguishing adjunct that makes a sibling verb's form read as wrong in
context — with no sentence at all, a sibling's same-person form (e.g.
`egon`'s `gaude`/`dago` offered for an `izan` "gu"/"hura" question) is simply
a second correct answer, not a distractor. The audit's "where this is not a
problem" section exempted `pronoun`/`type-pronoun` for the same reason but
missed `form` — this closes that gap. `sentence`/`negative` keep
`extraCandidates`, since they have a sentence to anchor the judgment.

## 2026-06-14 — Scroll-to-last-lesson aligns to top instead of centering

**Decision:** Changed the initial-load scroll behavior in `HomeScreen`
(`App.jsx`) from `scrollIntoView({ block: 'center' })` to
`scrollIntoView({ block: 'start' })`, and added a `scroll-mt-20` class to
`LessonNode`'s button so the target lesson lands just below the sticky
header instead of underneath it.

**Why:** Centering the last-played lesson left only ~1-2 upcoming lessons
visible below the fold, often with one of them clipped. Aligning it to the
top of the viewport (with the scroll margin to clear the header) surfaces
several more upcoming lessons — including locked/"pending" ones — giving
the learner a preview of what's coming next.

## 2026-06-14 — `?dev=unlock-all` query param bypasses lesson unlocking

**Decision:** `getUnlockedLessonIds` (`lessonLogic.js`) now takes an optional
`search` param (defaulting to `window.location.search`) — if it contains
`dev=unlock-all`, every lesson in `LESSONS` is returned as unlocked,
short-circuiting the normal "previous lesson attempted" check entirely.

**Why:** useful for trying out/demoing any lesson (e.g. ones deep in the
journey) without grinding through prerequisites first. A query param needs no
routing/server config (unlike a path segment, which would 404 on GitHub
Pages without a SPA fallback) and requires no UI — kept deliberately
undocumented/no toggle, since it's a developer convenience, not a feature for
learners.

## 2026-06-14 — #114: pair-level triage of Tier 1 + `joan`↔`etorri`, expanded `CROSS_CANDIDATE_EXCLUSIONS`

Following the `ukan`↔`nahi` fix (below), the maintainer reviewed one
representative example sentence per remaining `docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`
Tier 1 pair plus the flagged `joan`↔`etorri` (Tier 2) — a pair-level review
rather than ticking all ~2100 individual `docs/CROSS_CANDIDATE_REVIEW.md`
entries, since `CROSS_CANDIDATE_EXCLUSIONS` operates at pair granularity and a
verdict for one example sentence generalizes to every tense/person/template
for that pair.

**Confirmed "both valid", added to `CROSS_CANDIDATE_EXCLUSIONS`** (all
`'always'`, both directions): `eduki`↔`ukan` ("have/hold" vs "have" —
maintainer: "interchangeable"), `eduki`↔`ikusi`, `ukan`↔`ikusi`,
`jakin`↔`ikusi`, `ikusi`↔`nahi`, `jakin`↔`nahi`, `eduki`↔`nahi`, `jan`↔`erosi`,
`edan`↔`erosi` (consumption verbs — "eat/drink X" vs "buy X", both sensible
for the same object), and `joan`↔`etorri` (`nor`-only — "Ane etxera dator"
"coming to" vs "Ane etxera doa" "going to", same allative adjunct, opposite
direction — maintainer: "it is correct").

**Checked and NOT excluded** (confirmed genuinely-wrong distractors, no
`CROSS_CANDIDATE_EXCLUSIONS` entry): `ukan`↔`jakin` ("Anek auto bat daki" —
"Anek knows a car" — maintainer: "makes no sense"), `eduki`↔`jakin`
("...eskuan daki" — "...knows in hand" — "makes no sense"), `jan`↔`edan`
("Anek entsalada edango du" — "Anek will drink salad" — "doesn't make
semantic sense").

Ticked all 330 newly-resolved `docs/CROSS_CANDIDATE_REVIEW.md` entries (plus
the 20 from the `ukan`↔`nahi` pass, 350 total) via a small one-off script
(`/tmp/tick_pairs.mjs`, not committed) that matches entries by `{verbA, verbB}`
set membership and appends a "Resolved by #114" note — same approach as the
manual `ukan`↔`nahi` edits, just scripted given the volume.

Verified no regression: re-ran the option-pool-size check across all review
lessons (all `roll` values 0-0.95) before/after — unique "fewer than 3 options"
cases went from 85 to 76 (net improvement, some pairs gained a 3rd option
elsewhere), no new 0/1-option cases. `npm test`/`lint`/`build` all pass (214
tests).

Remaining: rest of Tier 2 (`izan`↔`egon`/`etorri`/`joan`, `*`↔`ari`/`ibili`)
and Tier 3 (`case-mixer` pairs) are un-triaged — the audit didn't flag these as
likely "both valid", so they're lower priority; see
`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`'s "Remaining work".

## 2026-06-13 — #114: added `CROSS_CANDIDATE_EXCLUSIONS`, scoped to the confirmed `ukan`↔`nahi` pair

#114 (Layer 2b/3 of `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`) is blocked on a
native-speaker triage of `docs/CROSS_CANDIDATE_REVIEW.md`'s ~2100 entries
(`docs/CROSS_CANDIDATE_TRIAGE_PRIORITY.md`), which hasn't happened yet. But a
live instance of the bug was reported (screenshot of mintzan.github.io):
`nahi`'s `hura` sentence "Katuak esne pixka bat ___." (correct `nahi du`, "the
cat wants some milk") offered `ukan`'s `du` ("the cat has some milk") as a
distractor — also valid Basque, just a different meaning. This is the
`ukan`↔`nahi` pair already double-confirmed by the audit (the literal-template
instance was fixed by #112; this is the same pair's non-literal instances).

Rather than wait for the full triage, implemented just this one pair now:
`CROSS_CANDIDATE_EXCLUSIONS` (`src/lessonLogic.js`) is a curated
`{ [verbId]: { [siblingVerbId]: 'always' | 'verb-choice-only' } }` table,
checked via `isCrossCandidateExcluded(verbId, siblingVerbId, context)` from
both `getCrossVerbCandidates` (`extraCandidates`) and
`collectCrossSourceCandidates` (`verb-choice`/`case-mixer`). Currently holds
only `ukan: { nahi: 'always' }` / `nahi: { ukan: 'always' }`. Ticked the 20
corresponding `docs/CROSS_CANDIDATE_REVIEW.md` entries (1865-1872, 2090-2101)
as resolved.

The other Tier 1 pairs (`eduki`↔`ukan`, `eduki`↔`ikusi`, `jakin`↔`nahi`, etc.)
and the flagged `joan`↔`etorri` (Tier 2) remain unimplemented — they're
plausible per the audit's reasoning but not yet confirmed by an in-the-wild
report or a native speaker, so encoding them now would be guessing at
exclusions per #114's own caution. `CROSS_CANDIDATE_EXCLUSIONS`'s table shape
is designed to take more entries cheaply once those are confirmed.

## 2026-06-13 — Fixed a pre-existing crash in cross-verb question generation for "pool"-shaped lessons

While building #113's triage script (below), `getIntroducedSources` crashed
`generateCrossVerbQuestions`/`generateCaseMixerQuestions` for 7 review lessons
(`unit-8-review`, `unit-8-review-plural`, `egon-past-review`,
`egon-past-plural-review`, `eduki-past-review`, `eduki-past-plural-review`,
`unit-9-review-2-plural`) — all `review: true` with `sources.length < 3`, so
`createExerciseState` (`src/App.jsx`) falls back to `getIntroducedSources` for
`extraSiblingSources`.

Root cause: `getIntroducedSources`'s old filter (`!lesson.review`) let through
"pool" lessons — `izan-past-pool`, `izan-past-pool-plural`, `ukan-past-pool`,
`ukan-past-pool-plural`, `unit-10-present`, `unit-10-present-plural`
(`src/data/lessons.js`) — which are shaped like a review (`{ id, persons,
sources }`) but aren't marked `review: true`. Mapping them to `{ verbId:
verbId, tense: tense }` produced `{ verbId: undefined, tense: undefined }`
entries, and `collectCrossSourceCandidates` (`src/lessonLogic.js`) then read
`sibling.verb.id` on the resulting `{ verb: undefined, tense: undefined }`
sibling source — a `TypeError`.

Fix: `getIntroducedSources`'s filter is now `!lesson.review && lesson.verbId`,
skipping pool lessons entirely (they don't represent a single
verb/tense "introduction" anyway). This is a real production crash, distinct
from the ambiguous-distractors remediation plan itself (Delivery 4's bug, not
a new issue) — fixed alongside #113 because the triage script couldn't run
without it. Covered by two new tests in `src/logic.test.js`
(`getIntroducedSources`'s pool-lesson case, and an integration test running
`generateCrossVerbQuestions`/`generateCaseMixerQuestions` for all 7 affected
lessons with real `LESSONS`/`VERBS`).

## 2026-06-13 — Generated a cross-candidate substitution checklist for native-speaker triage

Layer 2a of the remediation plan (#113): added `scripts/list-cross-candidates.mjs`,
a one-off Node ESM script (not part of `npm test`/`npm run build`) that walks every
`review: true` lesson in `LESSONS` and enumerates every cross-verb form substitution
reachable through `getCrossVerbCandidates` (the `sentence`/`negative`/`form`
distractor pools) and `generateCrossVerbQuestions`/`generateCaseMixerQuestions`
(the `verb-choice`/`case-mixer` kinds), including Delivery 4's `getIntroducedSources`
fallback for reviews with fewer than 3 sources. Each de-duplicated
`(template, substituted form)` combination is rendered as a checklist entry in
`docs/CROSS_CANDIDATE_REVIEW.md` (2101 entries) with both the source verb's own
sentence and the substituted sentence, for a reviewer to mark "both valid" (→ #114's
`CROSS_CANDIDATE_EXCLUSIONS`) or "wrong/ungrammatical" (no action).

Exported `agreementsCompatible` and `pickVariant` from `src/lessonLogic.js` (both
were already pure helpers, just not previously needed outside the module) so the
script can reuse the exact same compatibility/variant logic as the runtime — no
duplicated logic to drift out of sync.

Cross-checked the output against `docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`'s confirmed
examples: `ukan`↔`nahi` (now via different `hura`/`hark`/`anek` sentence templates
than the one #112 already excluded), `eduki`↔`ukan`/`ikusi`, and `jakin`'s `dakit`
all appear as entries. `src/lessonLogic.js` runtime logic is otherwise untouched by
this issue (read-only, per #113's scope) — see the crash fix above for the one
exception, which was a separate pre-existing bug blocking the script from running
at all.

## 2026-06-13 — Excluded cross-verb distractors that collide with a sibling verb's own sentence template

Layer 1 of the remediation plan from the cross-verb-distractor audit below
(GitHub issue #112): added `sentenceTemplatesCollide(verbA, tenseA, verbB,
tenseB, person)` to `src/lessonLogic.js` — a pure, zero-grammar-knowledge
check for whether two verbs' `sentences[tense][person]` entries share a
literal template string (handling `pickVariant`'s `string | string[]` shape
on either side). Wired into `getCrossVerbCandidates` (skip a sibling's form
for a person if its sentence collides with `verb`'s own) and
`collectCrossSourceCandidates` (same skip for `verb-choice`/`case-mixer`
siblings).

This fixes the confirmed `unit-2-review` case: `ukan` and `nahi` both have
`'Nik liburu bat ___.'` in their present-`ni` sentence lists (`dut` vs `nahi
dut`, two different correct answers for the identical sentence) — `nahi dut`
no longer appears as a distractor for `ukan`'s question on that sentence, and
vice versa. A guard test in `src/logic.test.js` scans every
`agreementsCompatible` pair in `VERBS` for any shared `(tense, person)`
sentence template and asserts the exclusion covers it, so a future verb/
sentence addition that reintroduces this kind of collision fails the test
suite instead of shipping silently.

Verified via `npm test`/`npm run lint`/`npm run build` plus the regression
tests exercising the real `ukan`/`nahi`/`jakin` (`unit-2-review`) sources
across a spread of `Math.random` rolls — not via an interactive `npm run dev`
play-through, since this session runs headless.

Out of scope (tracked in #113/#114): broader semantic overlaps where the
sentence *text* differs but both completions are still valid (e.g. `eduki` vs
`ukan`/`ikusi`) — those need native-speaker triage, not a literal-string
check.

## 2026-06-13 — Audited cross-verb distractors for "multiple valid options"

Following up on the Exercise Variety Plan (Deliveries 1-4, shipped earlier the
same day): learners reported multiple-choice questions where more than one
option is independently grammatical for the shown sentence (just with a
different meaning), since `agreementsCompatible`'s NOR/NOR-NORK check doesn't
catch this — Basque's transitive clause frame is shared across semantically
unrelated `nor-nork` verbs (`ukan`/`nahi`/`jakin`/`eduki`/`jan`/`edan`/`erosi`/
`ikusi`), so their forms are often mutually substitutable without becoming
ungrammatical. Confirmed concretely in `unit-2-review` (`ukan`'s and `nahi`'s
`ni`-present sentence lists share the literal string `'Nik liburu bat ___.'`,
with two different correct answers: `dut`/`nahi dut`) and `unit-8-review`
(`eduki` vs `ukan`/`ikusi` via Delivery 4's fallback pool). No remediation
chosen yet — findings and possible directions logged in
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`.

## 2026-06-13 — Sign-in form's "invalid email" error was masking unrelated server errors

A learner with a perfectly valid email saw "Enter a valid email address" when
requesting a magic link. The actual cause was that the sync-worker's
`RESEND_API_KEY` secret was never set, so `/auth/request-link` returned
HTTP 502 — but `AccountModal.handleSubmit` (`App.jsx`) mapped *any* non-OK,
non-429 response to `accountErrorInvalidEmail`.

**Decision:** only a 400 response (the worker's actual "invalid email" code,
`sync-worker/src/routes/auth.js`) maps to `accountErrorInvalidEmail`; other
non-OK statuses (5xx etc.) now map to the existing generic
`accountErrorNetwork` message. Also added
`.github/workflows/set-sync-worker-secret.yml` (mirroring the feedback
worker's secret-setting workflow) so `RESEND_API_KEY` can be provisioned for
the sync-worker without local `wrangler` access.

## 2026-06-13 — Fixed "scroll to last lesson on load" being clobbered by browser scroll restoration

**Problem:** The 2026-06-12 scroll-to-last-completed-lesson feature worked on a
fresh `page.goto`, but not on an actual page reload — which is how most
returning learners "load the page" (reopening a tab, refreshing). Reproduced
with Playwright: load → scroll to last lesson (works) → reload → scroll jumps
back to wherever it was before the reload, not the last lesson.

**Cause:** `history.scrollRestoration` defaults to `'auto'`, so the browser
restores the pre-reload scroll position itself, and it does so *after* React's
effects run — overriding the `scrollIntoView`/`scrollTo` call in
`HomeScreen`'s mount effect.

**Fix:** Set `window.history.scrollRestoration = 'manual'` once at startup
(`src/main.jsx`), opting the app out of the browser's automatic restoration
entirely so our own scroll logic (jump to last lesson on first load, restore
position when returning from an exercise) is the only thing moving the
viewport. Verified with Playwright that a reload now lands back at the last
completed lesson instead of the top.

## 2026-06-13 — Excluded type-verb/type-negative for forms ambiguous with another verb's form

A learner reported a `type-verb` question for `nahi`-present (`ni`): "Nik
liburu bat ___." expects "nahi dut" ("I want a book"), but typing just "dut"
— which the learner knew as `ukan`'s `ni`-present form — was marked wrong
even though "Nik liburu bat dut." ("I have a book") is itself a correct Basque
sentence. The blank alone gives no signal which of the two the lesson wants;
this isn't specific to this one sentence — `nahi`'s present forms are all
literally `'nahi ' + ukan`'s present forms (`nahi dut`/`nahi duzu`/`nahi du`
vs. `dut`/`duzu`/`du`), so *every* `nahi`-present sentence has the same
collision, and the same will apply to future `behar`/`ahal`/`ari`-style
particle+auxiliary verbs.

**Decision:** Added `hasAmbiguousTypedForm` (`lessonLogic.js`): true when a
verb's `conjugations[tense][person]` is a multi-word compound whose trailing
word exactly equals another agreement-compatible verb's (`agreementsCompatible`)
form for the same `[tense][person]`. `generateQuestions` now takes an optional
`verbs` param (the full `VERBS` list, passed from `App.jsx`'s
`createExerciseState` and `getWeakSpotQuestions`) and drops `type-verb`/
`type-negative` from `availableKinds` whenever this holds, falling back to the
multiple-choice framings (`sentence`/`pronoun`/`form`) — their `options` come
from `verb`'s own table, so the colliding bare form never appears as a choice.
Rejected accepting both forms as correct: "dut" alone doesn't mean "I want a
book", so marking it correct for a `nahi` lesson would teach the wrong thing —
the fix is to not ask for a typed answer there at all, not to accept more
answers.

**Consequence:** `nahi`-present's `ni`/`zu`/`hura` lose `type-verb` entirely
(all three collide with `ukan`), staying multiple-choice/bare-form only.

## 2026-06-13 — Fixed unanswerable typed review questions hiding the verb name

A learner reported a `type-verb` question in `unit-5-review-3` (mixes `jakin`
and `etorri`) showing the sentence "Irakasleak erantzun zuzena ___." with no
indication of which verb's table it came from. The blank fits more than one
real Basque word depending on the verb (`jakin`'s `daki` "knows" vs. `edun`'s
`du` "has") — without `options` to narrow it down and without the verb name,
there was no way to tell which form was being asked for.

**Decision:** `showVerb` (`QuestionPrompt`, `App.jsx`) is now
`!lesson.review || !question.options` instead of just `!lesson.review`. The
review-only hiding was originally about not giving away the answer via
cross-verb `options` (Delivery 1 of the Exercise Variety Plan); typed kinds
(`type-verb`/`type-pronoun`/`type-negative`) have no `options` to protect, so
showing the verb name there can't leak anything — it just disambiguates the
blank.

## 2026-06-13 — Resolved issue #97: "Share result" on 3-star lesson results

Added a "Share" button to `LessonResultsScreen`, gated to `stars === 3`,
reusing `shareContent`/`getShareUrl` from #96. **Gated to a perfect score
only** (not shown for 0/1/2-star results) — framed as a celebration moment
(like the existing confetti/fireworks `Celebration`, also 3-star-only), not a
"share to feel okay about your score" nudge offered on every attempt.

Same conventions as #96: clipboard-fallback shows a brief "Link copied!"
confirmation (local state + 2s `setTimeout`, same pattern as the Profile
tab's button), `share_app` analytics event (`variant: 'result'`, plus
`lessonId`), and share text in the sender's current UI language via `t()`.

## 2026-06-13 — Resolved issue #96: "Invite a friend" share entry point

Added `src/shareUtils.js` (`getShareUrl`, `shareContent`) and an "Invite a
friend" button to the Profile tab. `shareContent` uses the Web Share API
(`navigator.share`) where available, falling back to copying
`"${text} ${url}"` to the clipboard with a brief inline "Link copied!"
confirmation (no toast system exists, so this is local state + a 2s
`setTimeout` revert, mirroring `syncTimeoutRef` in `App.jsx`).

**v1 has no referral tracking** — the shared URL is just `getShareUrl()`
(origin + `BASE_URL`), with no query params or codes identifying the sharer.
Analytics only records that a share happened (`share_app` event with the
result: `shared`/`copied`/`cancelled`/`failed`), not who shared or whether the
recipient ever opens the link. Referral tracking could be added later if
needed, but would need its own privacy/consent consideration.

**Share text follows the sender's current UI language** (`shareGenericTitle`/
`shareGenericText` via `t()`), with no special handling for the recipient's
language — the recipient picks their own language on first launch like any
other user, same as the app's existing onboarding flow.

## 2026-06-13 — Resolved issue #92: flag-a-question with diagnostics

Added a 🚩 button to `FeedbackBar` (shown once a question is answered) that
opens `FlagQuestionModal`, posting to the same feedback worker endpoint as
`FeedbackModal` with `context: 'question-flag'` and a `diagnostics` object
built by the new pure `buildFlagDiagnostics` (`lessonLogic.js`).

**Why a separate `diagnostics` field instead of folding everything into
`message`:** keeps the worker's validation precise (known keys, type-checked,
size-capped) rather than trusting a free-text blob, and keeps the email body
readable — a "--- Flagged question ---" block formatted server-side, with the
learner's optional comment (if any) above it. `message` becomes optional in
the worker when `diagnostics` is present, since a flag with no comment is
still a useful report on its own.

**Why `buildFlagDiagnostics` only includes `sentence`/`options`/`items` when
present (rather than always sending the full question object):** the question
shape varies by `kind` (see `generateQuestions`) — sending `undefined`/`null`
placeholders for inapplicable fields would bloat the payload and create
ambiguity (worker-side, "missing" vs "explicitly null") for no benefit, since
`kind` alone tells a reviewer which fields to expect.

**Why `answerSeq` + `key={answerSeq}` on `FeedbackBar`:** the "Reported"
button state is local to `FeedbackBar`/`FlagQuestionModal`, but needs to reset
when the learner moves to the next question — remounting via a changing `key`
(same pattern used elsewhere for per-question reset) was simpler than lifting
that state into `ExerciseScreen`'s reducer.

## 2026-06-13 — Resolved issue #91: points become a PN-Counter, first-sync merge, ongoing background sync, sync status UI

**Points data model (`POINTS_STORAGE_KEY` v1 → v2):** `points` changed from a
single mutable `{ balance }` to a PN-Counter: `{ earned: { [deviceId]: n },
spent: { [deviceId]: n } }`, balance = `sum(earned) - sum(spent)` via the new
`getPointsBalance` (`lessonLogic.js`). Each device only ever increments its
*own* `earned`/`spent` entries (`addPoints`/`repairStreak` now take a
`deviceId`) — this is what makes the cross-device merge (`mergePoints`, "max
per device per counter") lossless and order-independent, unlike a single
shared counter where two devices' concurrent spends could double-count or
clobber each other. A new `aditzak:deviceId:v1` key holds a `crypto.randomUUID`
generated once per device. `pointsStorage.load()` migrates an existing v1
`{ balance }` by attributing the whole balance to this device's `earned`
(`{ earned: { [deviceId]: balance }, spent: {} }`) — chosen over e.g. a
synthetic `"legacy"` device id so the migrated balance still participates
correctly in future per-device merges.

**First-sync merge:** on magic-link sign-in, `AppShell` checks `hasCloudData`
(from `/auth/verify`) and `hasLocalSyncData` (any local progress/streak).
Neither → nothing to do. Cloud-only → adopt the cloud snapshot wholesale,
silently. Local-only → push local data, silently. Both → show `MergeModal`
(reusing the `accountMerge*` keys left over from #90's removed prototype) with
three choices: `keepBest` (per-field "best of both" via `mergeSyncPayload` —
recommended, default-styled button), `useDevice` (push local as-is), or
`useAccount` (overwrite local with the cloud payload). `mergeSyncPayload`
composes four per-field merges: `mergeProgress` (per-lesson max of
attempts/bestScore/totalQuestions/bestStars + most-recent `lastPlayed`),
`mergeDailyStreak` (the side with the more recent `lastActiveDate` wins for
`currentStreak`/`lastActiveDate` — since `currentStreak` resets after a gap
and isn't independently monotonic — while `longestStreak` is maxed),
`mergeErrorStats` (union by `verbId:tense:person`, overlapping entries take
max `count` + latest `lastMissed`), and `mergePoints` (the PN-Counter union
described above).

**Ongoing background sync:** every app load while already signed in re-runs
the same `mergeSyncPayload` pull-merge against `GET /sync` (so edits from
another device since the last visit aren't lost), then pushes the merged
result. After that initial reconcile, any change to `progress`/`dailyStreak`/
`points`/`errorStats` schedules a debounced (`SYNC_PUSH_DEBOUNCE_MS = 1000`)
`PUT /sync` of the latest snapshot. A `skipNextPushRef` (starts `true`) blocks
this debounced effect until the initial reconcile/merge has finished — without
it, the background-push effect would fire on the very first render (before any
merge/pull has happened) and push this device's pre-merge data to the cloud,
potentially overwriting another device's newer data. Failures are swallowed
(`syncStatus = 'error'`); local storage remains the source of truth and the
next save or app load retries — no blocking UI or retry loop.

**Sync status UI:** `accountSyncedJustNow` (now reused for "no `lastSyncedAt`
yet" as well as "synced <1 minute ago") is joined by `accountSyncedMinutesAgo`
(`tCount`, "Synced {n} minute(s) ago"), `accountSyncing` ("Syncing…"), and
`accountSyncFailed` ("Sync failed, will retry"), computed by `syncStatusText`
and shown under the account email in `AccountSection`. `syncStatus`'s initial
value is computed via a `useState` lazy initializer (checking for
`?authToken=` or a stored session) rather than set inside the reconcile
effect, to avoid the `react-hooks/set-state-in-effect` lint rule's "cascading
render" warning for a synchronous `setState` at the top of an effect body.

## 2026-06-13 — Resolved issue #90: wired `AccountModal`/`AccountSection` to the real magic-link auth API, superseding the 2026-06-12 UI-only prototype

**Decision:** `AccountModal`'s email step now calls `POST {SYNC_API_URL}/auth/request-link`
(new `SYNC_API_URL` constant, `VITE_SYNC_API_URL` override following the
`FEEDBACK_API_URL`/`VITE_FEEDBACK_API_URL` pattern — `.env.example`,
`src/App.jsx`, `.github/workflows/deploy.yml`). Errors map to new
translation keys: `accountErrorRateLimited` (429), `accountErrorInvalidEmail`
(other non-2xx), `accountErrorNetwork` (thrown/fetch failure).

`AppShell` now owns `account` state (lifted out of `HomeScreen`, which held
mock `useState(null)` per the 2026-06-12 prototype decision — **that decision
is now superseded**). On mount, it checks the URL for `?authToken=...`: if
present, it's exchanged via `/auth/verify`, the result is stored in a new
`aditzak:session:v1` localStorage key (`{ token, email, expiresAt }` — `load()`
returns `null` for a missing/expired session, unlike the `{}`-defaulting
`createStorage` helper used by `progress`/`streak`/etc.), and `authToken` is
stripped from the URL via `history.replaceState` either way. On later loads
with no `authToken`, a non-expired stored session restores `account` directly
— no network call, per the issue's scope. `expiresAt` is computed client-side
as `now + SESSION_TTL_MS` (60 days, mirroring sync-worker's
`SESSION_TTL_MS`), since `/auth/verify` doesn't return one. "Sign out" calls
`POST /auth/signout` with the stored bearer token best-effort (errors ignored)
and always clears the local session.

**Removed the modal's "merge" step** (`ACCOUNT_MERGE_OPTIONS`, `mergeChoice`,
`hasLocalProgress`/`onSignedIn` props, and the "Continue (demo)" button/
`accountDemoContinue` key). The prototype's flow assumed sign-in *completed*
inside the modal (so a merge choice could follow immediately), but real
sign-in completes out-of-band — the learner clicks the emailed link, which
loads the app fresh and runs the `/auth/verify` effect above; the modal that
requested the link is long gone by then. The `accountMerge*` translation keys
are left in place (unused) since #91 ("first-sync merge") will need similar
copy when it designs where/how the merge choice is actually surfaced — likely
a banner driven by `account.hasCloudData` (now returned by `/auth/verify` and
threaded through, though not yet used) plus local-progress presence, rather
than a modal step.

## 2026-06-13 — Resolved issue #89: progress sync endpoints (`GET`/`PUT /sync`) in `sync-worker/`

**Decision:** `GET /sync` and `PUT /sync` (`src/routes/sync.js`) are
bearer-authenticated via the `authenticateSession` helper from #88 and
read/write a single `progress_snapshots` row per user (upsert via
`ON CONFLICT(user_id) DO UPDATE`, added to `src/db.js`). `GET` returns
`404 { payload: null }` when no snapshot exists — chosen over `200` with a
null body so the frontend's "no cloud data yet" branch is a plain HTTP
status check rather than inspecting the body of a 200.

`PUT`'s `schemaVersion` is stored alongside the payload but not yet
validated/rejected by the backend — reconciling client/server schema
versions is the frontend's job (#91's first-sync merge), this endpoint just
persists whatever it's given. The 256KB cap
(`MAX_PAYLOAD_BYTES` in `src/routes/sync.js`) is checked against the
UTF-8 byte length of the stringified `payload` *after* parsing the request
body — simpler than streaming/Content-Length checks, and acceptable since
Workers' own request body limits (100MB+) make a 256KB JSON parse
negligible.

## 2026-06-13 — Resolved issue #88: magic-link auth endpoints + rate limiting in `sync-worker/`

**Decision:** Implemented `POST /auth/request-link`, `POST /auth/verify`, and
`POST /auth/signout` per #86/#88's spec. Tokens (magic-link and session) are
32 random bytes, base64url-encoded, and only their SHA-256 hash is ever
stored (`src/crypto.js`) — so a leaked D1 row can't be replayed as a token.
Magic links expire after 15 minutes and are single-use (`used_at` checked on
verify); sessions last 60 days and have their `last_seen_at` bumped on every
authenticated request (`src/session.js`'s `authenticateSession`, reused by
the `/sync` follow-up in #89).

**Rate limiting** (`src/rateLimit.js`, `migrations/0002_rate_limits.sql`) uses
fixed-window counters in a single `rate_limits` table, keyed by
`email:m:<email>` / `email:h:<email>` / `ip:m:<ip>` / `ip:h:<ip>` (1/minute
and 5/hour per email and per IP). The four checks short-circuit on first
failure, so a rejected request doesn't increment counters it never reached —
simpler than atomic multi-counter updates, and the slight under-counting on
rejection doesn't weaken the limit (a rejected request is already blocked).

**Email delivery** (`src/email.js`) reuses `worker/`'s Resend pattern but
with this worker's own `RESEND_API_KEY` secret and `AUTH_FROM_EMAIL`/`APP_URL`
vars — kept separate from the feedback worker's secret even though both may
use the same Resend account, since the two workers' configs shouldn't be
coupled.

**Testing:** `@cloudflare/vitest-pool-workers@0.16.15` doesn't expose a
`./config` entrypoint compatible with vitest 4.1.8 (`defineWorkersConfig`
import fails), and the API surface looked likely to keep shifting. Instead,
`sync-worker/test/d1.js` wraps Node's built-in `node:sqlite` (`DatabaseSync`,
experimental as of Node 22) behind a `prepare().bind().first/all/run()` shim
matching D1's API, applying the real `migrations/*.sql` files — real SQLite
semantics without the extra tooling dependency. This needed its own
`sync-worker/vitest.config.js` (`environment: 'node'`) so it doesn't inherit
the root's jsdom config, and the root `vite.config.js` test config now
excludes `sync-worker/**` (and `worker/**`) so `npm test` at the root doesn't
try to bundle `node:sqlite` for jsdom.

## 2026-06-13 — Resolved issue #87: stood up `sync-worker/` (Cloudflare Worker + D1), `/healthz` only for now

**Decision:** Added `sync-worker/` as a sibling of `worker/` (the existing
stateless feedback worker), per epic #86's recommendation (open question #4:
a separate worker, since this one handles PII/session tokens — a different
trust boundary than the feedback relay). Mirrors `worker/`'s structure
(`package.json`, `wrangler.toml`, `src/index.js`, `.gitignore`) and CORS
pattern (`corsHeaders`/`jsonResponse` locked to `ALLOWED_ORIGIN`). Added a D1
binding (`DB` → database `aditzak-sync`) and
`migrations/0001_init.sql` creating `users`/`magic_links`/`sessions`/
`progress_snapshots` exactly as specified in #86/#87. The worker currently
only serves `GET /healthz` — `/auth/*` and `/sync` are separate follow-up
issues (#88/#89).

`.github/workflows/deploy-sync-worker.yml` mirrors `deploy-worker.yml`
(path-filtered on `sync-worker/**`, same `CLOUDFLARE_API_TOKEN`/
`CLOUDFLARE_ACCOUNT_ID` secrets), but runs `wrangler d1 migrations apply
aditzak-sync --remote` before `deploy` on every push — so new migration files
added by #88/#89 are applied automatically. `docs/CLOUDFLARE_SYNC_WORKER.md`
documents the one-time `wrangler d1 create aditzak-sync` provisioning step
(its `database_id` is a placeholder in `wrangler.toml` until that's run) and
notes the deploy token needs **D1: Edit** permission in addition to the
feedback worker's **Workers Scripts: Edit**.

**Verified locally:** `wrangler d1 migrations apply aditzak-sync --local`
applies cleanly, and `wrangler dev` serves `GET /healthz` → `{"ok":true}`
and 404s everything else. Actual `wrangler deploy`/remote D1 provisioning
needs real Cloudflare credentials and wasn't run from this session.

## 2026-06-13 — Resolved issue #83: re-keyed `journeyTranslations.js`'s `units`/`stages` to `journey.js`'s current unit/stage numbering

**Decision:** Did the holistic re-audit issue #83 asked for. Most of the old
`units`/`stages` entries (1-22, plus the gate/stage titles) were content that
still exists in `journey.js` but under a different number after several
renumbering/reorder passes — those were moved to their current numbers (e.g.
old unit 7 "Rutina diaria" → new Unit 10, old unit 10 "Necesidades y
obligaciones" → new Unit 18, old `phase-2-stage-3`'s "Acciones del mundo real"
→ `phase-2-stage-4`, etc.). Entries with no surviving counterpart (old unit 9
"Intenciones y acciones futuras", which Units 14-17 replaced) were dropped.
New units that had no prior translation at all (3, 8, 9, 12, 13, 14-17, 20)
and three new stages (`phase-2-stage-3`, `phase-2-stage-5`, `phase-3-stage-7`)
got fresh ES/EU copy written against `journey.js`'s current English text and
`docs/LEARNING_JOURNEY.md`.

**Drift prevention:** added two checks to `journey.test.js` asserting every
`JOURNEY` unit number and stage id has a `JOURNEY_TRANSLATIONS` entry — this
catches a unit/stage with *no* translation entry (the "23-29 missing
entirely" half of #83), but can't catch a translation entry that exists but
describes the *wrong* unit (the "drifted to the wrong number" half) — that
class of bug requires a human content audit like this one, not a type-level
check.

## 2026-06-13 — Resolved issue #84: pooled Units 8/9's past tense into izan-past/ukan-past auxiliary pools, moved egon-past/eduki-past to their own units (Stage 3/5 reshuffle)

**Decision:** Replaced Units 8/9's six per-verb `-past`/`-past-plural` pairs
(`izan-past`, `egon-past`, `ukan-past`, `joan-past`, `etorri-past`,
`ikusi-past`, plus `looking-back-1a-review`/`looking-back-1b-review` and their
`-plural` siblings) and Units 12/13's five (`jan-past`, `edan-past`,
`erosi-past`, `eduki-past`, `ibili-past`, plus `looking-back-2a-review`/
`looking-back-2b-review` and their `-plural` siblings) — 30 lessons total —
with:

- **Unit 8** ("Looking Back I — The 'izan' Past Pool"): `izan-past-pool` /
  `izan-past-pool-plural`, `sources` covering `izan`/`joan`/`etorri`/`ibili`'s
  past tense — all four conjugate via `izan`'s past auxiliary
  (`nintzen`/`zinen`/`zen`/`ginen`/`zineten`/`ziren`).
- **Unit 9** ("Looking Back I — The 'ukan' Past Pool"): `ukan-past-pool` /
  `ukan-past-pool-plural`, `sources` covering `ukan`/`jan`/`edan`/`erosi`/
  `ikusi`'s past tense — all five conjugate via `ukan`'s past auxiliary
  (`nuen`/`zenuen`/`zuen`/`genuen`/`zenuten`/`zuten`).
- **Unit 12** ("Looking Back II — 'I Was There'"): `egon-past` /
  `egon-past-review` / `egon-past-plural` / `egon-past-plural-review` — `egon`
  keeps its own distinct synthetic past paradigm (`nengoen`/`zeunden`/
  `zegoen`/...), same single-verb practice+review shape as Unit 3/5's
  `ikusi-present`/`ikusi-present-review`.
- **Unit 13** ("Looking Back II — 'I Had It'"): the same shape for
  `eduki-past` (`neukan`/`zeneukan`/...).

12 lessons total, down from 30. No new `VERBS` data — `conjugations.past` for
all eleven verbs already existed from the two prior "Looking Back"
implementation passes — this is purely a `journey.js`/`lessons.js`
restructure following Unit 10's pooling pattern (see the entry below).

**Why a reshuffle across Stages 3 and 5, not a one-unit edit:** issue #84
identified that `izan`-past's auxiliary is shared by verbs originally spread
across Units 8/9/13, and `ukan`-past's by verbs spread across Units 8/9/12 —
pooling either family means moving lessons across unit *and* stage
boundaries. Kept the unit count at 4 (8, 9, 12, 13) and left Units
10/11/14+ untouched — no renumbering cascade — by redistributing *within*
that four-unit budget: Stage 3 (Units 8-9) becomes "the two shared-auxiliary
pools", Stage 5 (Units 12-13) becomes "the two odd-ones-out with their own
paradigm" (`egon`, `eduki`). This still preserves the redesign's "pair each
verb's past with its present soon after" framing for every pooled verb
(`ibili`'s past, Unit 8, is one unit after its present, Unit 11; `jan`/`edan`/
`erosi`/`ikusi`'s past, Unit 9, is right after their present, Unit 10) — the
one regression is `egon`, whose present→past gap grows from Unit 1→8 (7
units) to Unit 1→12 (11 units), accepted as the cost of giving `egon` and
`eduki` each a focused single-verb unit rather than forcing them into a pool
they don't fit.

**`journeyTranslations.js` left untouched**, same precedent as the Unit 10
entry below — its `units` keys are already out of sync with `journey.js`'s
current numbering (a pre-existing issue flagged there), and this redesign
doesn't make that worse; both need the same holistic re-audit.

**No `STORAGE_KEY` bump**: removed lesson ids (`izan-past`, `joan-past`, ...,
`looking-back-*-review*`) leave orphaned-but-harmless `progress` entries, same
precedent as Unit 10's redesign. `egon-past`/`eduki-past` keep their existing
ids, so any progress already recorded against them carries over.

## 2026-06-13 — Unit 10 ("Daily Routine (Transitive)") rebuilt as a pooled "ukan present auxiliary" drill across jan/edan/erosi/ikusi, replacing per-verb practice lessons

**Decision:** Replaced Unit 10's 8 lessons (`jan-present`/`-plural`,
`edan-present`/`-plural`, `erosi-present`/`-plural`, `unit-7-review`/
`-plural`) with 2: `unit-10-present` (ni/zu/hura) and
`unit-10-present-plural` (gu/zuek/haiek), each with `sources` covering
`jan`/`edan`/`erosi`/`ikusi`'s present tense — all four already have full
6-person grids plus `sentences`/`pronounSentences`. `ikusi` (Unit 3) rejoins
this pool: its present tense already shares the exact `ukan` NOR-NORK
auxiliary shape, so it slots in with zero new data.

`describeLesson` (`App.jsx`) gained a third branch alongside single-verb
practice and "🔁 Mixed Review": non-review lessons with `sources` get the same
title/icon layout as single-verb practice (tense label, persons), but
subtitle/heading list the verb pool the way a review does (`mixedPractice`
copy). `LessonPreviewScreen`'s single-verb/single-table layout doesn't fit a
verb pool, so `showPreview` now keys off `!lesson.sources` instead of
`!lesson.review` — pooled lessons skip the preview like reviews do.

`journey.test.js`'s `LESSONS <-> VERBS` checks were split in two: one for
single-verb practice lessons (`lesson.verbId`), one for any lesson with
`sources` (review or pooled) — the latter now also checks `lesson.persons`
against each source's table, which the old review-only check didn't do.

**Why:** the previous design's distractors were already drawn from a single
verb's own table (same participle, varying person — isolating the
auxiliary-by-person pattern), but each *lesson* only ever used one participle
across all its questions. Pooling `jan`/`edan`/`erosi`/`ikusi` into one lesson
keeps that per-question isolation (distractors still come from whichever
verb's table that question rolled) while varying the participle
question-to-question — "to learn a conjugation between persons we can use
whatever verb fits" rather than marching through one verb at a time. It also
makes future additions to this pattern (e.g. `entzun`) a one-line append to
both `sources` arrays, no new lesson ids.

**No `STORAGE_KEY` bump:** removed lesson ids leave orphaned-but-harmless
`progress` entries; `getUnlockedLessonIds` only iterates `LESSONS`'s current
entries, and `unit-10-present`/`unit-10-present-plural` sit in the same array
position the old lessons did, so an existing learner's unlock state carries
over correctly.

**Known pre-existing issue found, not fixed here:** `journeyTranslations.js`'s
`units` keys are out of sync with `journey.js`'s current unit numbers for
several units (e.g. key `10` holds "Requirements & Obligations" copy — the
*old* Unit 10 — while the *current* Unit 10 is "Daily Routine"), so
Spanish/Basque users likely see wrong-unit translated focus/payload text for
several units. Left `journeyTranslations.js` untouched for Unit 10 rather than
adding correct copy under a still-misaligned key — this needs a holistic
re-audit across all renumbered units, not a one-unit patch.

## 2026-06-13 — Delivery 4 of the Exercise Variety Plan: broaden the cross-verb candidate pool for small reviews

**Decision:** added `getIntroducedSources(lessons, upToLessonId)`
(`lessonLogic.js`) — position-based like `getUnlockedLessonIds`, returning
every practice lesson's `{ verbId, tense }` before `upToLessonId` in `LESSONS`
order (review lessons skipped, since they have no `verbId`/`tense` of their
own). Because it only looks *before* the review's own position, it's
inherently spoiler-safe (task 4.3) — a verb's `future` form can't leak into a
`present`-tense review if that verb's `future` lesson hasn't been reached yet.

In `createExerciseState` (`App.jsx`), reviews with fewer than 3 sources
(`unit-1-review`, `unit-3-review`, ...) compute this as `extraSources` and
pass it through three places:
- `getCrossVerbCandidates(verb, tense, sources, VERBS, extraSources)` — its
  new 5th parameter, merged into the sibling pool for Delivery 1's
  `extraCandidates`, deduped against `sources` and restricted to the same
  `tense` as the lookup.
- `generateCrossVerbQuestions`/`generateCaseMixerQuestions`'s new
  `extraSiblingSources` option, threaded into
  `collectCrossSourceCandidates`'s shared sibling pool with the same
  dedup/same-tense rules.

Reviews with 3+ sources are untouched — "this review = these sources" stays
intact where there's already enough variety, per the plan's framing.

**Option-count cap added as part of this delivery:**
`collectCrossSourceCandidates` now caps every `verb-choice`/`case-mixer`
question at 4 options (`correct` + up to 3 randomly-sampled distractors),
matching `buildOptions`'s existing ceiling. Before Delivery 4, a 2-3-source
review's sibling pool was small enough that this never mattered (capped
naturally), but `unit-3-review`'s fallback pool (6 additional `present`-tense
verbs) could otherwise produce 5+ option `case-mixer` questions — capping
keeps every multiple-choice question's option count consistent regardless of
how big the candidate pool gets.

**Pilot:** `unit-1-review` (izan+egon) gets no new candidates — its 2 sources
*are* the only two practice lessons before it, so `extraSources` dedupes to
empty and Delivery 3's behaviour is unchanged. `unit-3-review` (joan+etorri,
both `nor`) is the more useful case: `extraSources` picks up
izan/egon/ukan/nahi/jakin/ikusi's `present` tables, so `verb-choice` options
grow from 2 to 4 (izan/egon now compatible siblings) and `case-mixer` —
previously empty, since joan/etorri are both `nor` — now fires using
ukan/nahi/jakin/ikusi (`nor-nork`) as siblings.

## 2026-06-13 — Delivery 3 of the Exercise Variety Plan: `case-mixer` questions (mechanism only, Unit 24 deferred)

**Decision:** added `generateCaseMixerQuestions` (`lessonLogic.js`) — Delivery
2's `generateCrossVerbQuestions` with `agreementsCompatible`'s filter
*inverted*, so it pairs sources whose `agreement` differs on the `nork` axis
(`nor` vs `nor-nork`) instead of matching ones. Both functions now share a
`collectCrossSourceCandidates`/`pickCrossSourceQuestions` pair of helpers.
`kind: 'case-mixer'` questions are wired into `createExerciseState` for every
review lesson (capped at `CASE_MIXER_QUESTION_COUNT = 1`, deliberately lower
than `verb-choice`'s 2 — this drill is narrower/harder) — reviews whose
sources don't mix `nor`/`nor-nork` simply get none, same graceful
degradation as `verb-choice`. No new UI: `QuestionPrompt` already renders any
`question.sentence`; `getExplanation` gains a `case-mixer` case
(`explanationCaseMixerErgative`/`Absolutive`, reusing the pronoun
explanations' "-k marks the doer" framing) and `QUESTION_PROMPT_KEYS` gains
`questionCaseMixer`.

**Audit (resolves task 3.1):** checked existing mixed-agreement review pairs
(`izan`/`ukan` in `unit-5-review-1`/`unit-6-review-1`, `jakin`/`etorri` in
`unit-5-review-3`, `izan`/`egon`/`ukan` in the `looking-back-1a-review*`
pairs) — every `nor` sentence's subject is written as the bare pronoun
("Ni...", "Zu...", "Hura...") while every `nor-nork` sentence's subject
carries `-k` ("Nik...", "Zuk...", "Hark..."/"Berak..."/a `-k`-marked noun).
Swapping in the wrong verb's form (e.g. "Txakurrak hezur bat da" instead of
"...du") always produces a case-marking mismatch — i.e. a clearly wrong
sentence, never an alternate-but-valid phrasing. Piloted via a throwaway
script against `unit-5-review-1`, `unit-5-review-3`, `unit-6-review-1`, and
`looking-back-1a-review`; `unit-1-review` (izan+egon, both `nor`) correctly
produced zero `case-mixer` questions.

**Unit 24 deferred (resolves the "ship Unit 24 now?" question):** `journey.js`
Unit 24 ("REFRESH — The Case-Ending Mixer", Refresh Gate C) stays `pending`.
Its `docs/LEARNING_JOURNEY.md` description is a full NOR/NORK/**NORI**
role-swap drill depending on Units 22-23's dative verbs (still `pending`,
zero data today) and `docs/EXERCISE_ENGINE.md` describes its likely mechanism
as a `spot-error`-style "pick the right/wrong full sentence" kind — neither
matches this delivery's narrower NOR-vs-NOR-NORK, multiple-choice
`case-mixer` mechanism. Rather than ship a reduced-scope Unit 24 now and
revisit its spec twice, `case-mixer` ships as a general review-lesson
mechanism (active wherever `nor`/`nor-nork` sources already mix, e.g. Gate A's
`unit-5-review-1`/`-3` and `unit-6-review-1`) and Unit 24 itself waits for
Units 22-23 to land so it can be specced and built in its originally-described
full form in one pass.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Delivery 4 remains
open).

## 2026-06-13 — Delivery 2 of the Exercise Variety Plan: dedicated `verb-choice` cross-verb question kind

**Decision:** review lessons (`lesson.review: true` with 2+ `sources`) now
also get a handful of dedicated `kind: 'verb-choice'` questions
(`generateCrossVerbQuestions`, `lessonLogic.js`, capped at
`CROSS_VERB_QUESTION_COUNT = 2`) — each shows one source's example sentence
and asks the learner to pick which verb's conjugated form actually fits it,
with options drawn from that source's correct form plus its
agreement-compatible siblings' (`agreementsCompatible`, shared with Delivery
1) forms for the same person. Unlike Delivery 1's occasional incidental
cross-verb distractor, here "which verb fits this sentence" *is* the
question.

**Final `kind` name (resolves the "final kind name" open decision):**
`verb-choice` is the real name, not a placeholder — it has its own
`QUESTION_PROMPT_KEYS` entry (`questionVerbChoice`) and `getExplanation` case
(`explanationVerbChoice`), translated in `en`/`es`/`eu`.

**UI (task 2.3):** no new rendering branch needed — `QuestionPrompt` already
renders `SentenceWithBlank` whenever `question.sentence` is set, which
`verb-choice` questions always have, and review lessons already pass
`showVerb={false}` (Delivery 1's badge decision), so the verb name stays
hidden automatically. The option-button stack is a vertical flex column, so
2-option questions (the common case for a 2-source review) render fine
without grid changes.

**Option count (resolves part of task 2.2):** not padded — a question's
`options` has exactly as many entries as there are compatible sources with a
usable form for that person (2 for a typical 2-source review, up to 4 for
more sources). A single-source review, or a review whose only other source is
agreement-incompatible, yields zero `verb-choice` questions (`options.length
< 2` for every candidate) — same graceful-degradation behaviour as Delivery
1's `getCrossVerbCandidates`.

**Typed variant (resolves the `type-verb-choice` open decision):** out of
scope for this delivery. `verb-choice` is multiple-choice only for now; a
typed "type the form that fits this sentence, no options" variant is deferred
to a later delivery if it turns out to be needed.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Deliveries 3-4 remain
open).

## 2026-06-13 — Delivery 1 of the Exercise Variety Plan: cross-verb distractors in review lessons

**Decision:** Review lessons (`lesson.review: true` with 2+ `sources`) now
widen `buildOptions`'s distractor pool with each source's *sibling* sources'
same-person conjugated forms (`getCrossVerbCandidates`, `lessonLogic.js`) —
e.g. an `egon-present` `ni` question in `unit-1-review` (sources: izan + egon)
can now occasionally offer `izan`'s `naiz` as a distractor alongside `egon`'s
own `zaude`/`dago`/etc. Only applied to `sentence`/`negative`/`form` kinds
(whose options come from `conjugations[tense]`) — not `pronoun`, whose options
come from a different table (`verb.pronouns`).

**Compatibility filter (resolves task 1.4):** a sibling source's forms are only
mixed in if its verb's `agreement` matches on the `nork` axis (`nor` ↔ `nor`,
`nor-nork` ↔ `nor-nork`) — so a cross-verb distractor is "right shape, wrong
verb" (a real but wrong sentence, e.g. "Ni etxean naiz") rather than
structurally broken ("Nik liburu bat naiz"). The latter — mixing across the
`nor`/`nor-nork` boundary — is deliberately Delivery 3's territory (NOR vs
NOR-NORK case-marking drills).

**Aggressiveness (resolves the "how aggressively to mix" open decision):**
candidates are merged into the pool and `shuffle().slice(0, 3)` picks from the
combined set — so a cross-verb option is *occasional*, not guaranteed every
question. Simpler than forcing one in, and keeps "right verb, wrong person"
distractors (the original behaviour) as the common case.

**Badge treatment (resolves task 1.3 / the badge open decision):** for review
lessons, `ExerciseScreen` no longer renders the per-question `VerbBadgeRow`
(type/agreement/dialect badges), and `QuestionPrompt`'s verb-name/meaning line
is replaced with just the tense label. Chose "hide entirely" over a generic
"Mixed review" badge — hiding is simpler (no new badge component or i18n
strings), and applying it uniformly to *all* review questions (not just ones
whose options happen to include a cross-verb distractor) avoids the badge's
presence/absence itself becoming a tell. Practice lessons are unaffected.

**Rollout (task 1.7):** since `getCrossVerbCandidates` is computed generically
for any review lesson in `createExerciseState`, every multi-source review
benefits automatically — no per-lesson changes needed. Single-source reviews
(`ikusi-present-review`, `unit-4-review`, etc.) get an empty candidate set and
behave exactly as before.

See `docs/EXERCISE_VARIETY_PLAN.md` for the full plan (Deliveries 2-4 remain
open).

## 2026-06-13 — Moved the Expansion gate earlier (now Unit 5, right after "Moving Around")

**Decision:** Reordered Phase I's last three units. "Expansion — Bringing in
the Plural" (zero new verbs; adds `gu`/`zuek`/`haiek` to `izan`/`egon`/`ukan`/
`joan`/`etorri`/`ikusi`) is now **Unit 5**, in Stage 2 right after "Moving
Around" (Unit 4). "The Immediate Continuous" (`ari`) becomes Unit 6, and
"REFRESH — The Inversion Matrix" (negation) becomes Unit 7, still Refresh Gate
A — now a single-unit gate, its title shortened from `Refresh Gate A — The
"Ez" Trap & Person Expansion` to `Refresh Gate A — The "Ez" Trap`. Units 8+ are
unaffected — no renumbering cascade. Lesson ids (`unit-5-review-*` for
negation, `unit-6-review-*` + `ikusi-present-plural*` for Expansion) were left
unchanged, matching existing precedent for ids predating a renumbering; only
`LESSONS`' array order and `journey.js`'s unit/stage placement changed.
`gate: true` no longer implies "sits at a phase/stage boundary" — Unit 5 is
mid-Stage-2, kept the shield icon since it's still zero-new-verbs.
`journeyTranslations.js`'s `units` keys 4/5/6 (which track `unit.number - 1`
for Phase I) were rotated to match, and the Expansion translations gained the
`ikusi` mention the English `focus` already had but the ES/EU strings were
missing.

**Why:** All six verbs Unit 5 expands are introduced by Unit 4, so this is the
earliest point in the journey the expansion can run — previously it ran last
(old Unit 7), meaning a verb's `gu`/`zuek`/`haiek` forms (e.g. `izan`'s
`zarete`) weren't drilled until *three* units after that verb's own present-tense
lesson. Moving Expansion to Unit 5 cuts that gap to one unit for `izan`/`egon`
(Unit 1) and `ukan` (Unit 2), and zero for `joan`/`etorri`/`ikusi` (Units 3-4).
Considered but rejected: pairing every Phase I verb's plural lesson
immediately after its singular one from Unit 1 onward (the Unit 8+ pattern,
applied retroactively) — this would roughly double Units 1-4's lesson count
and walk back the documented "batch the plural unlock once you have a base of
verbs" rationale (`docs/LEARNING_JOURNEY.md`, "The 'Me, You, and It' horizon").
The chosen reorder gets most of the benefit (a much shorter `zarete`-style gap)
via a same-day, low-risk reorder with no new lessons and no data changes.

## 2026-06-12 — Extracted `VERBS`/`LESSONS` out of `App.jsx` into `src/data/`, added a `journey.test.js` consistency check

**Decision:** The previous entry's journey redesign touched `journey.js`,
`App.jsx` (`VERBS` + `LESSONS`, ~1300 of its 3162 lines), and four docs in one
pass — `App.jsx` mixed ~1300 lines of curriculum data into an otherwise
UI-only file, and nothing checked that `journey.js`'s `lessonIds` actually
lined up with `LESSONS`/`VERBS`. To make the next such redesign cheaper and
safer:

- Moved `VERBS` plus its post-processing loops (future/past sentence-reuse,
  `SINGLE_WORD_PAST_NEGATION`) and the lookup-table metadata (`TENSE_META`,
  `TYPE_META`, `AGREEMENT_META`, `DIALECT_LABELS`, `PERSON_LABEL_KEYS`) into
  `src/data/verbs.js`.
- Moved `LESSONS` plus `PHASE_1_PERSONS`/`PHASE_1_PLURAL_PERSONS` into
  `src/data/lessons.js`.
- `App.jsx` now just imports both — purely mechanical, no logic changes;
  `npm run build`/`npm run lint`/`npm test` all still pass. `journey.js`,
  `data/lessons.js`, and `data/verbs.js` are now a self-contained ~1700-line
  "curriculum" trio with zero UI code, so a journey change can be made by
  reading just those three files.
- Added `src/journey.test.js` (part of `npm test`): checks every `JOURNEY`
  unit's `lessonIds` resolve to a `LESSONS` entry and vice versa (each
  referenced exactly once), `available` units have `lessonIds` and `pending`
  ones don't, and every practice/review lesson's `verbId`/`tense`/`persons`
  resolves into `VERBS`. Catches the kind of dangling reference a renumbering
  could silently introduce.
- Added a "Working on the learning journey" section to `CLAUDE.md` mapping
  change types (reorder units, add a verb/tense, flip `pending` →
  `available`) to the files that need updating together.

**Why not split `App.jsx` further (e.g. extracting screen components):** out
of scope here — the goal was specifically to isolate the curriculum *data*
that journey redesigns touch, not a general `App.jsx` reorganization.

## 2026-06-12 — Redesigned the learning journey: pulled `ikusi` into Phase I (new Unit 3), split the future mega-unit into four, and added "Looking Back I/II" past-tense units — renumbering Units 7-25 to 10-32

**Decision:** Addressed three pacing/variety complaints about the journey
(`docs/LEARNING_JOURNEY.md`) in one pass:

1. **Added `ikusi` to Phase I as a new Unit 3 ("Seeing")** — Phase I's first
   periphrastic verb, reusing its existing 6-person `present` table (from the
   old Unit 7) via a `persons: PHASE_1_PERSONS`-filtered `ikusi-present`
   lesson + `ikusi-present-review`. Refresh Gate A's old Unit 6 ("Expansion")
   — now Unit 7 — gained an `ikusi-present-plural` lesson + review alongside
   its existing `gu`/`zuek`/`haiek` retrofit for `izan`/`egon`/`ukan`/`joan`/
   `etorri`. `ikusi` was deliberately **left out of** Unit 6's ("Inversion
   Matrix") negation drills — like `nahi`/`ari`, its auxiliary splits from the
   invariant participle under negation, so it has no `negativeSentences`.
2. **Split the old 32-lesson "Geroa" future unit into four** (now Units
   14-17), one per verb group (`izan/egon/ukan`, `nahi/jakin/joan/etorri`,
   `jan/edan/erosi`, `ikusi/eduki/ibili`) — purely a `journey.js`
   `lessonIds`-redistribution into 4 units; zero `VERBS`/`LESSONS` changes,
   since the future tense's `<verbId>-future` lessons and `unit-9-review-N`
   reviews already existed and slot in 1:1.
3. **Added two new "Looking Back" units, each split into two sub-units**:
   - Unit 8 ("Looking Back I — I Was, I Had"): `izan`/`egon`/`ukan` simple
     past, full 6-person grid, singular+plural lesson pairs per verb +
     `looking-back-1a-review`/`-plural`.
   - Unit 9 ("Looking Back I — I Went, I Came, I Saw"): `joan`/`etorri`/
     `ikusi` simple past, same shape + `looking-back-1b-review`/`-plural`.
   - Unit 12 ("Looking Back II — I Ate, I Drank, I Bought"): `jan`/`edan`/
     `erosi` simple past + `looking-back-2a-review`/`-plural`.
   - Unit 13 ("Looking Back II — I Had, I Walked Around"): `eduki`/`ibili`
     simple past + `looking-back-2b-review`/`-plural`.

   Each "Looking Back" unit is positioned immediately after the present-tense
   unit(s) for the same verbs (Units 1-2/4 → Unit 8/9; Units 10-11 → Units
   12-13), so present and past arrive close together instead of "present for
   everyone, then past for everyone much later." `conjugations.past` was added
   to `joan`/`etorri`/`jan`/`edan`/`erosi`/`ikusi`/`eduki`/`ibili` (8 new
   tables — `izan`/`egon`/`ukan` already had theirs from an earlier session);
   `sentences.past`/`pronounSentences.past` are aliased to each verb's
   `present` arrays by reference (same `pickVariant`-compatible reuse loop as
   the future tense), and `negativeSentences.past` is aliased only for the
   four single-word past forms (`izan`/`egon`/`ukan`/`eduki`) where the past
   form stays intact under negation — periphrastic pasts (`joan nintzen`,
   `ikusi nuen`, ...) split apart under negation just like their present
   counterparts, so they get no `negativeSentences`. See
   `docs/LANGUAGE_DECISIONS.md` for the conjugation-data sourcing.

**Renumbering**: old Units 7-11 (`jan`/`edan`/`erosi`/`ikusi` present through
Gate B) → new Units 10-11 + 14-19 (the `+8`/`-1`/`+N` shifts come from
absorbing old Unit 12's "I Was, I Had" content into new Unit 8, inserting
Units 3/8/9/12/13, and the future split). Old Units 13-25 (Phase III onward)
→ new Units 20-32, a flat `+7` shift (old Unit 12 is absorbed into new Unit 8,
so it has no new-numbering counterpart). **Old `DECISIONS.md`/
`LANGUAGE_DECISIONS.md` entries below this one use the *old* numbering** —
they're a historical record of what was true when written, not rewritten for
this renumbering. Use this entry's mapping to translate: old 5→6, old 6→7, old
7→10, old 8→11, old 9→14-17 (split), old 10→18, old 11→19, old 12→(absorbed
into 8), old 13→20, old 14→21, old 15→22, ..., old 25→32 (flat `+7` from old
13 onward).

**Why reordering `LESSONS` is safe:** `getUnlockedLessonIds` unlocks a lesson
once its *predecessor in `LESSONS` order* has `attempts > 0`, **or** the
lesson itself already has `attempts > 0` (2026-06-12, "Already-attempted
lessons stay unlocked" below) — so inserting new lessons (the Looking Back
units, `ikusi-present`/`-plural`) into the middle of `LESSONS` doesn't re-lock
anything for an existing learner who'd progressed past that point; it only
adds new content for them to backfill. No `STORAGE_KEY` bump — all existing
lesson ids are unchanged, only reordered/regrouped, plus new ids appended.

**Why split into singular/plural "Looking Back" sub-units rather than one big
unit per verb group:** follows the same "max 3 persons per exercise" /
singular-plural-pair convention already established for Units 10-17
(2026-06-12, "App-wide 'max 3 persons per exercise' rule" below) — six verbs ×
(present + past) would otherwise reproduce the old Unit 9's 30+-lesson pacing
cliff this redesign set out to fix.

## 2026-06-12 — Added a UI-only "optional account" prototype to the Profile tab, with mock sign-in state

**Decision:** Added `AccountSection` (a card in `ProfileTab`) and
`AccountModal` (a sign-in bottom sheet, mirroring `FeedbackModal`'s
structure) to `src/App.jsx`, plus `account*` translation keys in all three
locales. The whole flow — "send sign-in link" → "check your email" → a
first-sync merge-choice screen (shown only if the device has local progress)
→ signed-in state with a "Sign out" button — is driven entirely by mock
`useState` in `HomeScreen` (`account`, `showAccountModal`). There is no real
authentication, network request, or backend; "Continue (demo)" stands in for
clicking the email link, and the merge choice is captured but doesn't alter
`progress` since there's no real cloud data to merge with.

**Why:** this was scoped as a UI-first exploration of "what would an optional
cross-device sync account feel like?" before committing to real auth/backend
work (magic-link email, a Worker + KV/D1 datastore, etc. — a bigger and
separate effort). Mock state is deliberately **not persisted** to
`localStorage`: inventing a storage key/schema for throwaway prototype state
would add versioning overhead (per this doc's `STORAGE_KEY` guidance) for a
data shape that will change once real auth is designed. If this UX direction
is approved, a follow-up decision should cover the real auth method and sync
backend, and at that point `account` state would move to persisted storage
with its own versioned key.

## 2026-06-12 — Hardcoded the feedback worker's URL as a default in `src/App.jsx`, `VITE_FEEDBACK_API_URL` now just an override

**Decision:** `FEEDBACK_API_URL` now falls back to the deployed worker's URL
(`https://aditzak-feedback.inakiibarrola.workers.dev`) when
`VITE_FEEDBACK_API_URL` is unset/empty, following the same `|| DEFAULT_X`
pattern `src/analytics.js` uses for PostHog. `.env.example` and
`docs/CLOUDFLARE_FEEDBACK_WORKER.md` updated accordingly; the env var/repo
variable is now only needed to point at a *different* worker (a fork's own
deployment, or local `wrangler dev`).

**Why:** the original "build-time env var, no committed default" choice (see
the "Added a feedback form/modal" entry below) was made before the worker was
deployed and its URL was unknown. In production this left
`VITE_FEEDBACK_API_URL` empty (the `FEEDBACK_API_URL` repo variable was never
set), so `fetch('')` resolved to the Pages site's own URL and got a 405 from
GitHub Pages — feedback submission silently failed. The worker's URL isn't
sensitive (CORS is locked to `ALLOWED_ORIGIN` regardless of who knows the
URL), so hardcoding a working default removes this footgun entirely while
still allowing overrides.

## 2026-06-12 — App-wide "max 3 persons per exercise" rule, applied to Units 6-9 via singular/plural lesson pairs

**Decision:** Generalized the previous entry's fix into a hard app-wide rule:
no single exercise drills more than 3 grammatical persons at once. Added a
second constant, `PHASE_1_PLURAL_PERSONS = ['gu', 'zuek', 'haiek']`, alongside
`PHASE_1_PERSONS`. Applied it retroactively:

- **Unit 6** ("Expansion — Bringing in the Plural"): `unit-6-review-1/-2/-3`
  now use `persons: PHASE_1_PLURAL_PERSONS` instead of the full 6-person table
  — fitting given the unit's framing is specifically "here are the new plural
  forms".
- **Units 7-9** (which previously gave every new verb/tense a full 6-person
  grid in one lesson, per `LEARNING_JOURNEY.md`'s "Person-Expansion Rule"):
  every (verb × tense) practice lesson and unit review is now split into a
  `persons: PHASE_1_PERSONS` lesson immediately followed by a `-plural`
  sibling using `persons: PHASE_1_PLURAL_PERSONS` — e.g. `jan-present` /
  `jan-present-plural`, `unit-7-review` / `unit-7-review-plural`. `journey.js`'s
  `lessonIds` for Units 7-9 were updated to interleave each pair in order.
  `nahi`/`jakin` (3-person-only tables) and Unit 9's `nahi-future`/
  `jakin-future` are unaffected (nothing to split). `unit-9-review-2-plural`
  is asymmetric — its singular sibling covers `nahi`/`jakin`/`joan`/`etorri`
  future, but the plural sibling only covers `joan`/`etorri` future since
  `nahi`/`jakin` have no plural forms.
- `describeLesson` (`App.jsx`) now reads `lesson.persons` and appends a
  `personsLabel` (the persons joined with `/`, e.g. `ni/zu/hura` or
  `gu/zuek/haiek` — literal Basque pronouns, language-independent like
  `TENSE_META`'s `basque` field) to `title.secondary` and `heading`, so
  singular/plural sibling lessons are visually distinguishable in the lesson
  list, progress tab, and results screen. Previously two lessons with the same
  `verbId`/`tense` (or the same review `sources`) would have rendered
  identically.

**Why:** doubles the lesson count for Units 7-9 (e.g. Unit 9 goes from 13
lessons to 32), but keeps every exercise within the "≤3 persons" rule while
still introducing each verb's full paradigm — just across two consecutive,
clearly-labeled lessons instead of one overloaded one. No `STORAGE_KEY` bump:
the new `-plural` ids are simply new entries in the progress map, and existing
progress for ids that keep their id (`jan-present`, etc.) remains valid since
`bestStars`/`bestScore` are ratio-based and the question count per lesson is
unchanged (`TARGET_EXERCISE_COUNT`-driven `rounds` formula, now divided across
3 persons instead of 6).

## 2026-06-12 — Restored Phase I's 3-person pacing with a `persons` filter on `generateQuestions`

**Decision:** Added an optional `persons` field to `generateQuestions`'s
options (`lessonLogic.js`) — when set, it replaces `Object.keys(table)` as the
set of grammatical persons a lesson drills (and the pool `buildOptions`/
`buildSpotErrorQuestion` draw distractors/companions from). `createExerciseState`
(`App.jsx`) reads `lesson.persons` and uses its length (instead of the full
table's) when computing `rounds`, so a filtered lesson's question count is
unchanged. Added a `PHASE_1_PERSONS = ['ni', 'zu', 'hura']` constant and set
`persons: PHASE_1_PERSONS` on `izan-present`, `egon-present`, `unit-1-review`,
`ukan-present`, `unit-2-review`, `joan-present`, `etorri-present`,
`unit-3-review`, and `unit-5-review-1/-2/-3`. `unit-6-review-*` (the
"Expansion" reviews) are deliberately left unfiltered — that's the unit where
`gu`/`zuek`/`haiek` are meant to first appear.

**Why:** Unit 6 grew `izan`/`egon`/`ukan`/`joan`/`etorri`'s `conjugations.present`
tables from 3 to 6 persons *in place* (2026-06-12 "Implemented Unit 6" below),
and that entry's "Side effect" section flagged but accepted the resulting
cascade: every earlier lesson reusing those tables (Units 1-3's own practice
lessons, their reviews, and Unit 5's negation reviews) started drilling all 6
persons too. In practice that meant a brand-new learner's very first exercise
(`izan-present`) jumped straight to `ni`/`zu`/`hura`/`gu`/`zuek`/`haiek` —
exactly the "too many new forms in one exercise" Unit 6 was supposed to be the
*first* place to introduce. A `persons` filter (option (b) from
`docs/EXERCISE_ENGINE.md`'s "Phase I's 3-person horizon", previously passed
over in favor of (a) for Unit 6 itself) re-restricts just the affected
pre-Expansion lessons back to `ni`/`zu`/`hura` without touching the underlying
`VERBS` tables — Unit 6 remains the single deliberate point where the
6-person grid is introduced, for every verb at once, as designed. As a side
benefit, `unit-5-review-*` (negation drills) no longer falls back to
non-negation `sentence`/`pronoun` questions for `gu`/`zuek`/`haiek` (which have
no `negativeSentences`), since those persons are now filtered out entirely.

**General principle for later units:** don't let a unit's exercises drill more
grammatical persons/forms at once than that point in the journey has actually
introduced — use `persons` (or author a smaller table) for any future lesson
that would otherwise inherit a larger table than its place in the journey
calls for.

## 2026-06-12 — Added a feedback form/modal to the Profile tab, wired to the feedback worker via `VITE_FEEDBACK_API_URL`

**Decision:** Added `FeedbackModal` (`src/App.jsx`), opened from a new "Send
feedback" button in `ProfileTab`. The modal is a `message` textarea
(required, `maxLength` 2000) + optional `email` field, `POST`ing
`{ message, email, context: 'profile' }` as JSON to
`import.meta.env.VITE_FEEDBACK_API_URL` — the field limits and payload shape
match the worker added in the 2026-06-12 "Added a standalone Cloudflare
Worker for feedback emails" entry below. Shows a success state on `response.ok`,
or a generic translated error otherwise (network failure, non-2xx, or the env
var unset/empty — `fetch(undefined, ...)` resolves to a relative request that
404s, hitting the same error path). Added `VITE_FEEDBACK_API_URL` to
`.env.example` and `.github/workflows/deploy.yml` (as `vars.FEEDBACK_API_URL`),
following the `VITE_POSTHOG_KEY`/`VITE_POSTHOG_HOST` pattern — build-time env
var, no committed default, since the worker isn't deployed yet and its URL
isn't known. Added `feedback*`/`profileFeedback` keys to all three
`TRANSLATIONS` locales.

**Why no client-side "is the endpoint configured" check:** letting the
`fetch` itself fail and showing the same generic error message for "not yet
configured" and "configured but request failed" avoids a third UI state for a
condition (`VITE_FEEDBACK_API_URL` unset) that's purely a deployment detail —
both cases mean "feedback didn't go through, try again later" from the
learner's perspective. `docs/CLOUDFLARE_FEEDBACK_WORKER.md` documents that the
form renders either way and explains the unset-var behavior for whoever sets
`FEEDBACK_API_URL` once the worker is deployed.

**Why `context: 'profile'` rather than the current lesson/tab:** the feedback
button only exists in the Profile tab (no entry point from an exercise
screen), so `context` is a fixed string for now — the worker's `context`
field already supports richer values if a future entry point (e.g. from
`MultipleChoiceScreen`) wants to report `lessonId`/`verbId`/`tense`.

## 2026-06-12 — Added a manually-triggered workflow to set the worker's `RESEND_API_KEY` secret, as a CLI-free alternative to `wrangler secret put`

**Decision:** Added `.github/workflows/set-worker-secret.yml`
(`workflow_dispatch` only) — installs `worker/`'s deps and runs
`wrangler secret put RESEND_API_KEY` reading the value from a `RESEND_API_KEY`
repo secret, authenticated via the existing `CLOUDFLARE_API_TOKEN`/
`CLOUDFLARE_ACCOUNT_ID`. Documented in `docs/CLOUDFLARE_FEEDBACK_WORKER.md` as
the "no CLI access" path, with a note that the `RESEND_API_KEY` repo secret can
be deleted afterwards since Cloudflare stores it on the worker from then on.

**Why a separate manual workflow, not a step in `deploy-worker.yml`:** the
2026-06-12 entry below ("Added CI deploy for the feedback worker") chose to
keep `RESEND_API_KEY` Cloudflare-side only, set once via CLI, specifically to
avoid duplicating it into GitHub secrets and re-running `secret put` on every
push. That reasoning still holds for users *with* CLI access. But for a user
with none, a one-time manually-triggered workflow achieves the same
"set once, never touched again" property without adding any step to the
push-triggered deploy — `deploy-worker.yml` itself is unchanged.

## 2026-06-12 — Updated `base`/package names/CORS origin for the `gorbeia/testapp005` → `Mintzan/aditzak` repo rename

**Decision:** The GitHub Pages deploy workflow (`.github/workflows/deploy.yml`)
still ran successfully after the repo was renamed, but `vite.config.js`'s
`base: '/testapp005/'` no longer matched the new Pages URL
(`https://mintzan.github.io/aditzak/`), so every built asset URL 404'd and the
deployed site loaded blank. Updated `base` to `/aditzak/`, renamed
`package.json`/`package-lock.json` from `testapp005` to `aditzak`, and updated
the feedback worker's `ALLOWED_ORIGIN` (`worker/wrangler.toml` +
`docs/CLOUDFLARE_FEEDBACK_WORKER.md`'s example) from `gorbeia.github.io` to
`mintzan.github.io`.

**Why:** this is exactly the case the 2026-06-07 "Deploy to GitHub Pages"
entry below flagged — `base` was hardcoded "since the app isn't expected to be
renamed/forked — update `base` if that changes." The rename happened, so the
update follows that documented plan. `ALLOWED_ORIGIN` isn't load-bearing yet
(the feedback worker isn't wired into the app), but keeping it consistent with
the actual Pages origin avoids a stale value surprising whoever wires it up.

## 2026-06-12 — Implemented Unit 9 (future tense, 13 verbs), reused present-tense sentences by reference, split review into 4 lessons

**Decision:** Added a `conjugations.future` table to all 12 of Units 1-8's
verbs except `ari` (`izan`, `egon`, `ukan`, `nahi`, `jakin`, `joan`, `etorri`,
`jan`, `edan`, `erosi`, `ikusi`, `eduki`, `ibili`), per `docs/CONJUGATIONS.md`
§11's `-ko`/`-go` participle + present-auxiliary rule. Added `TENSE_META.future`
(`labelKey: 'tenseFuture'`, `basque: 'geroa'`) and the corresponding
`tenseFuture` translation key (en/es/eu). Since a sentence template's blank
doesn't depend on tense (`"Ni irakaslea ___."` fits `naiz` or `izango naiz`
equally), verbs with a new `future` table have their `sentences.future`/
`pronounSentences.future` set to alias their existing `present` arrays by
reference in a small post-`VERBS` loop, rather than duplicating ~150 lines of
sentence data. Added 13 `<verbId>-future` practice lessons to `LESSONS`
(one per verb, mirroring the existing per-(verb×tense) convention) plus four
`unit-9-review-N` reviews of 3-4 sources each (~18 questions apiece), following
Units 5/6's precedent for splitting oversized consolidation passes. Flipped
Unit 9 to `available` in `journey.js` with all 17 lesson ids. Required zero
changes to `lessonLogic.js`/the exercise engine — confirmed via lint, the full
test suite, build, and a live Playwright run of `izan-future` (preview shows
`izango naiz/zara/da/gara/zarete/dira`; exercise renders a future sentence-fill
question correctly).

**Why:** `docs/LEARNING_JOURNEY.md` describes Unit 9 as reusing "Unit 1-8
auxiliary tables; only the participle-formation rule is new" — confirmed true
in practice. `ari` was excluded because its periphrastic future ("ari izango
naiz") is grammatically valid but rarely used and not part of Unit 9's payload
(see `docs/LANGUAGE_DECISIONS.md` for the linguistic rationale). 13 practice
lessons is the largest single-unit verb count so far, so a single review would
be unwieldy — four grouped reviews matches the question-count ballpark of
other units' reviews while still covering every verb's future forms.

## 2026-06-12 — Implemented Unit 8 (`eduki`/`ibili`), no extra dedicated practice lesson

**Decision:** Added `eduki` (nor-nork, `daukat`/`daukazu`/`dauka`/`daukagu`/
`daukazue`/`daukate`, object fixed `hura`) and `ibili` (nor,
`nabil`/`zabiltza`/`dabil`/`gabiltza`/`zabiltzate`/`dabiltza`) to `VERBS`, both
`type: 'synthetic'` per `docs/CONJUGATIONS.md` §7, both full 6-person grids
from their first lesson. Added `eduki-present`/`ibili-present`/
`unit-8-review` to `LESSONS` and flipped Unit 8 to `available` in
`journey.js` — same `(2 new verbs) + (1 review)` shape as Unit 7, no code
changes needed. Both are single-word forms that stay intact under negation,
so both got `negativeSentences` (ni/zu/hura), like `izan`/`egon`/`ukan`/
`joan`/`etorri`/`jakin`. `eduki`'s present table uses the singular-object
alternants (`daukat`, not `dauzkat`) — consistent with `object: 'hura'`
fixed-singular, same convention as `ukan`.

**Why:** `docs/LEARNING_JOURNEY.md` flags Unit 8 as needing "first full
6-person transitive grid" extra practice (§6's flagged-units list), but Unit 7
(`jan`/`edan`/`erosi`/`ikusi`) already implemented exactly that — every new
verb gets a full 6-person grid from lesson one, per the Person-Expansion Rule
— so by the time Unit 8 was built there was nothing structurally new left to
drill in isolation. Treating that flag as superseded by Unit 7's
implementation and following Unit 7's plain `(verbs) + (review)` shape was
simpler and avoided a redundant lesson; revisit if a future unit's extra-lesson
flag turns out to describe something Unit 7 *didn't* already cover.

## 2026-06-12 — Home screen scroll restoration via `window`/`document` APIs, no library

**Decision:** Added scroll handling around `HomeScreen` in `App.jsx`: on the
very first load, scroll to the last lesson the learner completed
(`getLastPlayedLessonId` in `lessonLogic.js`, keyed off `lastPlayed`); when
returning from an exercise (`onExit`/`onComplete`), restore the `window.scrollY`
the learner had right before opening it. Implemented with a `scrollTarget`
prop computed in `AppShell` (`{ type: 'lastLesson', lessonId }` or
`{ type: 'restore', y }`), consumed by a mount-only `useEffect` in
`HomeScreen` that calls `scrollIntoView`/`scrollTo` inside a
`requestAnimationFrame` (the lesson list isn't at its final layout height on
the same tick as the initial commit). Each `LessonNode` got an
`id={`lesson-${lesson.id}`}` so it can be targeted by `getElementById`.

**Why:** `HomeScreen` scrolls the whole document (`min-h-dvh`, no
`overflow-y-auto` wrapper — unlike `MultipleChoiceScreen`'s fixed `h-dvh`
container), so plain `window`/`document` APIs are sufficient; no scroll-restoration
library needed. `HomeScreen` unmounts whenever `activeLessonId` is set (it's
one of `AppShell`'s two top-level returns), so its scroll position is lost on
every exercise — capturing it in `AppShell` (which stays mounted) and replaying
it via a `[]`-deps effect on remount was the simplest fix. Verified manually
with Playwright; `page.reload()` triggers Chromium's own scroll restoration
*after* React's effects and clobbers the result, so the fresh-navigation
(`page.goto` + `addInitScript`) case is the one that matters and was confirmed
working.

## 2026-06-12 — Fixed `ari`'s `zu` example sentence to include an explicit subject

**Decision:** Changed `ari`'s `sentences.present.zu` from `'Zer ___?'` to
`'Zu zer ___?'`. Same issue as the `nahi`/`zu` fix below: without an explicit
subject, `'Zer ___?'` was ambiguous between `ari naiz`/`ari zara`/`ari da` —
all three complete it into an equally valid (just differently-meant) Basque
question ("What am I/are you/is he-she up to?"), so a learner had no way to
tell which person's form was being asked for. `ari`'s `agreement` is `nor`
(absolutive), so the fix prefixes the absolutive `Zu` rather than the
ergative `Zuk` the `nahi` fix used. `'Zu zer ___?'` → `'Zu zer ari zara?'`
("You, what are you up to?") still reads naturally and keeps the other `zu`
variants (`'Zu zer egiten ___?'`, `'Zu irakurtzen ___?'`) distinct.

## 2026-06-12 — Review lessons get up to 4 extra "weak spot" questions, targeting the learner's most-missed verb/tense/person combos

**Decision:** `exerciseReducer`'s `answer` action now tracks `misses` — one
`{ verbId, tense, person }` entry per question gotten wrong on the *first*
attempt (retries don't count again, mirroring how `correctCount` already only
credits first attempts). `ExerciseScreen` passes `state.misses` through
`onComplete`, and `AppShell` merges them into a new `aditzak:errors:v1`
storage key via `recordErrors` — a map keyed by `verbId:tense:person`, each
entry holding a running `count` and `lastMissed` timestamp. `handleResetProgress`
clears it alongside `progress`/`dailyStreak`/`points`.

`createExerciseState` now also takes `errorStats`, and for `review: true`
lessons calls `getWeakSpotQuestions(errorStats, lesson.sources, VERBS)` —
this picks up to `EXTRA_REVIEW_EXERCISES` (4) of the learner's most-missed
verb/tense/person combos *among this review's own sources* (so a review only
ever drills forms it actually covers), sorted by miss count then recency, and
generates one fresh `generateQuestions` roll for each. These extra questions
are shuffled in alongside the review's normal cross-section, so `total` grows
by up to 4 for a learner with relevant weak spots and is unchanged (0 extra)
for one with none recorded yet.

**Why "among this review's own sources" rather than globally weakest:** a
review lesson's whole point is drilling the verb/tense pairs it was built
from (per the "Every available unit ends with a trailing 'Unit review'
lesson" entry below) — pulling in a weak spot from an unrelated unit would mix
unrelated content into what's supposed to be that unit's consolidation pass.
Scoping to `sources` keeps the boost relevant while still reaching across
*all* of a review's sources (not just one verb), since reviews already mix
several.

**Why re-roll via `generateQuestions` rather than replaying the exact missed
question:** "similar to the failed ones" reads better as another attempt at
the same conjugated-form slot — possibly a different framing/kind or sentence
variant, per the existing per-question rolls — than as literally repeating the
identical question (same sentence, same distractor set) the learner just got
wrong. A person whose conjugation table no longer has the recorded `person`
(e.g. a future data change) is filtered out rather than falling back to a
different person, so "weak spot" questions always match what they claim to
target.

**Why a separate storage key, no `STORAGE_KEY` bump:** same precedent as
`aditzak:streak:v1`/`aditzak:points:v1` — error stats are orthogonal to any
single lesson's `progress` entry and "Reset progress" can clear it
independently.

## 2026-06-12 — Split `unit-5-review`/`unit-6-review` into three reviews each, paired across origin units

**Decision:** Replaced the single `unit-5-review` (6 sources, ~33 questions)
and `unit-6-review` (5 sources, 30 questions) lessons with
`unit-5-review-1`/`-2`/`-3` and `unit-6-review-1`/`-2`/`-3`. Every resulting
lesson lands at exactly 12 questions (`TARGET_EXERCISE_COUNT`) — two 6-person
sources give 6+6, a 6-person + 3-person pair (`jakin`) gives 6+6 via the
`rounds` formula, and a single 6-person source (Unit 6's `etorri`-only
review) gets 2 rounds for 12. Updated `journey.js`'s `lessonIds` for Units
5/6 to the new three-lesson arrays, in order.

Sources are paired *across* their originating units rather than keeping each
origin unit's own pair together: `unit-5/6-review-1` = `izan`(U1)+`ukan`(U2),
`-2` = `egon`(U1)+`joan`(U3), `-3` = `jakin`(U2)+`etorri`(U3) for Unit 5 (Unit
6 drops `jakin`, so its `-3` is `etorri` alone).

**Why:** ~30-33 questions in one sitting was flagged as too long (this entry
follows directly from the "documented tradeoff... flagged here in case a
future session wants to trim it" note in the 2026-06-12 "Implemented Unit 6"
entry below). An earlier version of this split grouped sources by originating
unit (`izan`+`egon`, `ukan`+`jakin`, `joan`+`etorri`), but that defeats a
Refresh Gate's purpose per `docs/LEARNING_JOURNEY.md` — a cumulative
cross-unit mixer, not three separate "redo this unit" sessions. Pairing
across origins keeps each lesson a genuine mix while still hitting 12
questions. Reusing the existing `rounds = max(1, round(targetPerSource /
personCount))` machinery needed no engine changes — `getUnlockedLessonIds`
and `describeLesson` already handle any number of review lessons per unit. No
`STORAGE_KEY` bump: old `unit-5-review`/`unit-6-review` progress entries (if
any) simply become orphaned/unused, same as any renamed lesson id.

Lesson naming stays generic (`unit-5-review-1`/`-2`/`-3`, displayed via
`describeLesson`'s existing "Mixed Review" label) rather than themed by
sentence topic (e.g. "Nature", "Sport") — the current `sentences` data isn't
tagged by topic and doesn't cover topics like that, so topic-themed reviews
would need a separate content pass tagging sentence variants by topic across
`VERBS` first.

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
