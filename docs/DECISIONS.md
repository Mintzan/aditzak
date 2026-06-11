# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions specific to the interface-language (i18n) feature live in
`docs/LANGUAGE_DECISIONS.md`.

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

## 2026-06-11 — Filled `izan`/`ukan`'s missing `zu` rows in `CONJUGATIONS.md` §1/§3 — the v2 journey's one concrete prerequisite

**Decision:** Added `zu` (`zara`/`zinen`) to `izan`'s §1 table and `zu`
(`duzu`/`zenuen`) to `ukan`'s §3 table — both previously six-person with an
explicit "no `zu`" note. Both forms were cross-checked against material
already in the document (`mintzatu`'s `zu` row for `izan`; the NOR=1st/2nd
grids for `ukan`) rather than sourced fresh. `egon`/`joan`/`etorri`/`ibili`
already had `zu` rows; `VERBS` itself is unchanged (still six persons, no `zu`
— that's for later units).

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

## 2026-06-11 — Relabeled `ihardun`/`jardun`, `iraun`, `irudi` (§6/§8) as "unergative — nork-only", consistently

**Decision:** Fixed `ihardun`'s mislabeled person-column headers (suffixes are
`NORK`/ergative, not absolutive) to `nik/hik/hark/...` under "(unergative —
nork-only)", and applied the same fix to `iraun`/`irudi` (§8), which have the
identical suffix pattern. Also declined a request to reword `esan`'s heading
from "ditransitive" to "transitive" with a root-etymology framing — `esan`'s
forms fix a `NORI` argument (`hari`), making it genuinely ditransitive;
replaced the disputed etymology with a cross-reference to §5's already-
documented identical grid.

## 2026-06-11 — Confirmed `hiri` doesn't exist in §5's `-ke-` conditional/potential grids — replaced placeholders with an explanation

**Decision:** Verified (second opinion via Gemini) that `hiri` forms genuinely
don't exist for Baldintza/Ondorioa/Ahalera — not just undocumented. The
indicative `hiri` forms work only because they coincide with allocutive
(hitanoa) marking, which is independently banned in subordinate clauses and
clashes register-wise with the formal `-ke-` forms — the combination was never
grammaticalized. Replaced the `—` placeholders with this reasoning and added
the periphrastic alternatives speakers actually use (`emango nian`/`ninan`,
`eman ahal diat`).

## 2026-06-11 — Filled §5's missing `zuei` rows (and marked `hiri` as an honest gap) across the remaining NOR-NORI-NORK conditional/potential grids

**Decision:** Added `zuei` rows to Baldintza, Ondorioa present/past, and all
three Ahalera grids (12 grids total) via the same `-zu-`→`-zue-` mirror used
elsewhere, with `*(refl.)*`/`*(zu↔zuek)*` markers mirrored accordingly. Left
`hiri` as `—` in all of them — unlike the indicative grids, these `-ke-` forms
have no documented allocutive counterpart, and inventing ~24 new forms would
risk teaching incorrect Basque (per the doc's "honest gap over an unverifiable
form" policy).

## 2026-06-11 — Filled §5's missing `hiri`/`zuei` rows for the NOR-NORI-NORK Past grids

**Decision:** Same gap as the Present grids (next entry), same fix, applied to
Past. `zuei` mirrors `zuri` with `-zu-`→`-zue-`; `hiri` uses §10's allocutive
past `-a-`/`-na-`+`-n` forms (`nian`/`ninan`, etc.), with `-zki-` inserted for
the `NOR=haiek` grid at the same position as every other cell.

## 2026-06-11 — Filled §5's missing `hiri`/`zuei` rows for the NOR-NORI-NORK Present grids

**Decision:** §5's `NOR=hura`/`haiek` Present grids tabulated only 5 of 7
`NORI` categories, silently skipping `hiri`/`zuei`. Added `zuei` via the
standard `-zu-`→`-zue-` mirror, and `hiri` via §10's allocutive `-k`/`-n` forms
(`diat`/`dinat`, `dik`/`din`, etc.) — the same syncretism §10 documents from
the other direction. `hik`=`*(refl.)*`, `zuk`/`zuek`=`*(hika/zuka)*`. The
`NOR=haiek` grid gets the same forms with the `-zki-` infix.

## 2026-06-10 — Filled §16.1's missing `niri`/`guri`/`zuri`/`zuei` rows for the NOR-NORI-NORK Subjunctive Present

**Decision:** Added all four rows (each with `NOR=hura`/`haiek` columns),
following the existing "drop `-ke-`, append the Subjuntiboa-`NORK` suffix"
recipe used for `hari`/`haiei`. Roots derived from §5's Ahalera Orainaldia
roots (`zuei`'s `diezazue-` by analogy with §4's NOR-NORI `zuei` row, which has
no §5 antecedent). Gap placement mirrors `zuri`'s pattern with `zuk`/`zuek`
swapped for `zuei`. Closes the last "left for a future pass" item from §16.1;
Subjunctive Past remains an intentional honest gap.

## 2026-06-10 — Filled §5's missing Baldintza/Ondorioa (conditional) grids for the NOR-NORI-NORK ditransitive system

**Decision:** §3/§4 both have a Baldintza/Ondorioa-present/past trio but §5
jumped straight to Ahalera. Added all three, `NOR=hura`/`haiek`, by extending
§3's own Baldintza/Ondorioa relationship to §5's `n-i-`/`h-i-`/etc. shape:
Ondorioa-present swaps `hark`/`haiek`'s `z-`/`zi-` prefix to `l-`/`li-` plus
`-ke` (`zion`→`lioke`); Baldintza drops `-ke` and adds `Ba-` (`lioke`→`balio`);
Ondorioa-past reverts to `z-`/`zi-` and adds `-en`/`-ten` (`lioke`→`ziokeen`).
Flagged but not separately verified: `balio` (the Baldintza form) is
homophonous with the noun "value/worth" — disambiguated by context.

## 2026-06-10 — Added §16 (Subjunctive & Imperative consolidated module)

**Decision:** Gathered subjunctive material scattered across §§2-5 into one
cross-referenced module, plus two new pieces: a NOR-NORI-NORK Subjunctive
Present grid (derived from §5's Ahalera Orainaldia root by dropping `-ke-`)
and a NOR-NORI-NORK Imperative grid, plus synthetic-imperative and NOR-NORK
imperative tables and a syntax/usage section. NOR-NORI-NORK subjunctive past
and the `niri`/`guri`/`zuri`/`zuei` rows are explicitly left untabulated for a
future pass (later filled — see the 2026-06-10 entry above). Used `bedi`
rather than the literal-but-nonstandard `badi` for `izan`'s 3rd-person
imperative, and gave `etorri`/`joan` jussives periphrastically (`etor bedi`)
rather than guessing synthetic forms.

## 2026-06-10 — Added §14 (Non-finite forms) and §15 (Passive/"Nor-shift"), appended at end of document

**Decision:** §14 catalogues non-finite uses of the perfective/imperfective
stems (verbal nouns, attributive vs. resultative participles, modal/
instrumental `-z`). §15 explains Basque's lack of dedicated passive morphology
and the "nor-shift" (`Nik atea ireki dut` → `Atea ireki da`), explicitly
splitting the reading into **anticausative** (change-of-state verbs) vs.
**impersonal/generic** (verbs without that alternation), since collapsing
these would overstate how passive-like it feels — with the genuinely agentive
analytic passive included for completeness but flagged as least idiomatic.

## 2026-06-10 — Filled §5's missing "Ahalera, Alegiazkoa (ditransitive)" hypothetical-potential grid

**Decision:** §4 (NOR-NORI) already had its hypothetical-potential subsection;
the gap was §5 (ditransitive). Filled it by mirroring §3's
Alegiazkoa-vs-Lehenaldia relationship onto every cell of the already-verified
§5 Lehenaldia grids: drop the trailing `-en`, and additionally swap
`hark`/`haiek`'s `zi-`→`li-` prefix. A pure string transformation from
already-verified forms, consistent with the document's methodology — no new
round-trip verification needed.

## 2026-06-10 — Added new verb tables (`ihardun`, `mintzatu`/`hitz egin`, `ikusi`, `entzun`) as appended subsections of §6/§7 rather than a new numbered section

**Decision:** Added these as new `###` subsections at the end of §6/§7 to
avoid renumbering §8-§13. `ihardun` was conjugated by applying §8's `iraun`
di-root pattern. `mintzatu`/`hitz egin` reuse §1's `izan` paradigm (Literary/
Northern `mintzo` + `izan`) plus a regular periphrastic `hitz egin` table.
**`ikusi`/`entzun`: decided not to fabricate synthetic paradigms** — neither
has a productive synthetic conjugation in modern Batua; presented as
periphrastic tables instead, prioritizing accuracy over matching the letter of
"synthetic verbs".

## 2026-06-10 — Filled the last `hik`-as-`NOR`/`NORK` gaps in §3 and §5's Ahalera Alegiazkoa/Lehenaldia grids

**Decision:** Closed remaining `hik` gaps: §3's Ahalera Alegiazkoa/Lehenaldia
grids' blank `hik` rows/cells were derived from the existing
`nin-/hin-/gin-/zin-` + `-tza-ke(-en)` series and the `-k`/`-n`/`-a-`/`-na-`
patterns used elsewhere. §5's Ahalera Lehenaldia ditransitive grids' missing
`hik`-as-`NORK` column was derived via `diezaioke` → `iezaioke` → `hiezaioke`
→ `hiezaiokeen` (drop `d-`, prepend past `h-`, append `-en`), not gender-split,
matching §5's existing past `hik` precedent. No outstanding `hik` gaps remain
in Ahalera/Subjuntiboa.

## 2026-06-10 — New §10 "Allocutive register (hitanoa/alokutiboa)" inserted before Periphrastic; §10-12 renumbered to §11-13

**Decision:** Added a new section covering tokano `-k`/nokano `-n` addressee
agreement (independent of the verb's own arguments), placed as the new §10,
renumbering the three sections after it. Placed between the core finite-mood
sections (which these forms layer on top of) and the periphrastic/reference
material — verified via grep that no existing `§1[0-9]` cross-reference needed
updating.

## 2026-06-10 — Added "The full periphrastic tense matrix" to §11 (Periphrastic)

**Decision:** Added an 8-row tense matrix crossing §11's three aspect suffixes
with `izan`/`ukan`'s present/past/ondorioa paradigms. The four "compound" rows
(Ondorio Orokorra, Lehenaldi Mugatua/Ez-mugatua, Ez-ohiko Baldintza) get
explanatory paragraphs distinguishing, in particular, `Lehenaldi Mugatua`
(`ikusi nuen`, simple past) from `Lehenaldi Ez-mugatua` (`ikusi izan nuen`,
pluperfect via an invariant `izan` participle — the same mechanism §14 uses
for resultatives/passives).

## 2026-06-10 — Completed §5's Ahalera Lehenaldia ditransitive `NOR=haiek` grid via mechanical `-zki-` insertion

**Decision:** Confirmed (via Gemini, with fresh examples) that `-zki-` slots
into Lehenaldia ditransitive forms at the same position as in Orainaldia
(`diezaioke`→`diezazkioke`) across 4 of 5 `NORI` suffixes plus the `nik`
column. Since the `NORK` prefix is structurally separated from where `-zki-`
lands, the rule generalizes across all 6 `NORK` columns — applied to all 26
real cells of the confirmed `NOR=hura` grid to produce the `haiek` grid. Only
`hik`-as-`NORK` remains open for Lehenaldia.

## 2026-06-10 — Filled §5's Ahalera Lehenaldia ditransitive `NOR=hura` grid via cross-pattern composition

**Decision:** Confirmed the predicted `hari` row (5 cells, including the
riskiest `hark` cell, which uses a different prefix for Alegiazkoa vs.
Lehenaldia) via Gemini, each with a fresh, role-correct example. Combined with
the previously-confirmed `nik` column, this pins down both halves of the cell
formula (`NORK` wrapper + `NORI` suffix) with fresh examples for each —
composed to fill the remaining 17 cells. `NOR=haiek` and `hik`-as-`NORK` left
open.

## 2026-06-10 — Started §5's Ahalera Lehenaldia (past potential) ditransitive grid: `nik` row resolved, root differs from Orainaldia

**Decision:** Confirmed via Gemini that the `dieza-`/`diezazki-` Orainaldia
root does not carry over — Lehenaldia uses `niezaiokeen`-type forms.
Cross-checked two ways: against §3's `nezake`→`nezakeen` (`-ke`+`-en`)
transform applied to the verified Orainaldia `hark`-column forms, and against
§5's own indicative grids (the extra `-i-` matches `nion` vs `nuen`). Applied
the `nik` row and wrote up the general derivation rule as a hypothesis for the
rest of the grid, flagging that `hark`'s prefix needs its own check since §3
shows it can differ between Alegiazkoa and Lehenaldia.

## 2026-06-10 — Completed §5's Ahalera Orainaldia ditransitive grid with the `hik` column

**Decision:** Confirmed via Gemini (with fresh, number-appropriate examples for
all 8 masc./fem. pairs) the `hik`-as-`NORK` column, predicted via the `-k`/`-n`
suffix already cross-checked against §3's `hik` row. Applied all 16 forms;
`zuri`/`hik` stays `*(hika/zuka)*`. This completes §5's Ahalera Orainaldia
ditransitive grid (no `—` cells remain — only principled
`*(refl.)*`/`*(zu↔zuek)*`/`*(hika/zuka)*` markers).

## 2026-06-10 — Filled out §5's Ahalera Orainaldia ditransitive grid to `nik`/`guk`/`zuk`/`zuek`/`haiek` (full grid minus `hik`)

**Decision:** Gemini's `nik` column predictions checked out, but it also
supplied full `guk`/`zuk`/`zuek`/`haiek` columns (34 cells) unprompted with
only hand-wavy assurances. Cross-checked these against §3's already-verified
`NORK`-suffix-after-`-ke-` forms and against the `*(refl.)*`/`*(zu↔zuek)*`
placement of this section's existing indicative grid — both checks passed
exactly, so applied the columns. `hik` stays `—` except `zuri`/`hik`=
`*(hika/zuka)*`, deserving its own verification pass.

## 2026-06-10 — Added Ahalera Orainaldia ditransitive `hark` column to §5 (citation table)

**Decision:** Two more focused verification rounds: corrected a
number-mismatched example for `diezaieke` and confirmed `diezazki-` (not
`diezaizki-`) is the plural-object root for `niri`/`hari`/`haiei`; and
confirmed the remaining `guri`/`zuri` cells (`diezaguke`/`diezazuke` and their
`-zki-` siblings) by analogy. Added a new §5 citation table for the `hark`
column (10 cells, all example-backed or pattern-identical).
`nik`/`hik`/`guk`/`zuk`/`zuek`/`haiek` as `NORK` remain open.

## 2026-06-10 — Added `hik` NORK column to §5's `NOR=hura`/`haiek` Present/Past grids

**Decision:** §5's four grids only had 6 `NORK` columns (missing `hik`, unlike
§3). Derived a `hik` column anchored on §3's `duk`/`huen`/`hituen`: Present
uses `di-`/`di-zki-` + `NORI`-suffix + `-k`/`-n` (gender split, self-check
passed against `hari`/`hik`=`diok`/`dion`); Past uses the same `h-` prefix as
`hark`→`z-`, not gender-split (matching §3's `hi`-object past precedent).
`zuri`/`zuei`×`hik` are `*(hika/zuka)*`. Applied directly — every cell follows
an established formula.

A follow-up Ahalera Orainaldia request (`dieza-`/`diezazki-` root) was **not**
applied — its self-check didn't actually reduce algebraically to the cited
forms, needing another verification pass (later resolved in the entries
above).

## 2026-06-10 — Fixed §3's `guk`→`hi` past cell (`*(refl.)*` → `hindugun`); declined a new `*(PCC-blocked)*` marker

**Decision:** `guk`→`hi` past was wrongly marked `*(refl.)*` (no reflexivity
between `gu` and `hi`) — re-derived as `hindugun` from the established `hind-`
past prefix + `-u-` + `-gu-` + `-n`, consistent with `guk`→`hi` present
(`haugu`). Also **declined** a proposed new `*(PCC-blocked)*` marker for the
`hiri` row in the NOR=1st/2nd ditransitive grids — the proposal's marker
placement was internally inconsistent (patching rather than principled), and
§5's existing PCC explanation already covers the substance without a new
marker.

## 2026-06-10 — Fixed §3's `haiek`→`zuek` present cell (`zaituzte`→`zaituztete`); declined Gemini's 10 NOR=1st/2nd grids again

**Decision:** While re-deriving `haiek`→`zuek` present, found §3's existing
`zaituzte` cell conflicted with the `-te-` infix pattern that both past-tense
and Baldintza grids use to distinguish `haiek`→`zu` from `haiek`→`zuek` —
corrected to `zaituztete` (a copy-paste error). **Declined again** to add the
10 full NOR=1st/2nd grids: beyond the `hari`/`haiei` rows (already covered via
cross-reference), the other rows had inconsistent markers, an open `?` cell,
and a garbled example sentence — not reliable enough to tabulate.

## 2026-06-10 — Filled §5's `*(refl.)*` gaps, fixed `zenion`/`zenizkion`, and added a "NOR = 1st/2nd person" subsection instead of full new grids

**Decision:** Filled `niri`/`nik` and `guri`/`nik` (previously `—`) as
`*(refl.)*` per §3's same-person-category extension, across all four
`hura`/`haiek`×Present/Past grids. Corrected `zenioen`→`zenion` and
`zenizkioen`→`zenizkion` for consistency with the parallel `-zki-` forms.
**Did not** paste Gemini's ten full NOR=1st/2nd grids — they had internal
inconsistencies and would have duplicated ~90% of §3's grid. Instead added a
concise "NOR = 1st/2nd person" subsection explaining the Person-Case
Constraint: `NORI`=`hari`/`haiei` cells reduce to §3's plain forms
(cross-referenced), while `NORI`=1st/2nd cells are blocked/clashed, covered by
the `buru` periphrasis in practice.

## 2026-06-10 — Restructured `CONJUGATIONS.md` as a pure reference, stripping process narrative

**Decision:** Removed the ✅/📖/🔍 confidence-marker system, sources list,
per-Gemini discrepancy stories, and cross-references to
`DECISIONS.md`/`VERB_COVERAGE.md` — kept all conjugation tables, examples, and
grammatical explanations (now with markers defined once in a "Notation"
section). `🔍` cells now read as plain forms; `❓` gaps now render as `—`. 1398
lines → 979. **Why:** the doc's purpose is lookup, not an audit trail — that
history lives in `DECISIONS.md`/git history.

## 2026-06-10 — Incorporated Gemini's verification pass: corrected the Ondorioa `-zke-` rule, resolved `-io-`/`-ioe-` and `zidan`/`dit` discrepancies, added a `zu↔zuek` impossibility marker, filled Ahalera-Orainaldia's `hi` cells

**Decision:** Applied a batch of corrections to §3/§5: **Ondorioa
present/past** — supersedes the 2026-06-08 `-zte-after-ke` entries; the real
rule is that a plural object or `haiek`-subject merges `-ke-`+`-z-` into
`-zke-` *before* the suffixes (`zint-u-zke-te`, not `zint-u-ke-zte`), recasting
~12 cells. **§5 `hari`-past**: `nion`/`zion`/`genion` (not `-ioe-`, a Bizkaian
variant) confirmed standard Batua, applied to the parallel `-zki-` row too.
**§5 `hura`-present `niri`/`hark`**: `zidan` was a past form wrongly placed in
the present grid — corrected to `dit` (and `didate` for `haiek`,
formula-derived). **New `*(zu↔zuek)*` marker**: the four `zuri`/`zuek` cells
across §5's grids don't exist (`zu`/`zuek` can't fill both NORI/NORK slots —
`Zuen buruari ematen diozue` is used instead). **§3 Ahalera Orainaldia
`hi`-cells**: filled `hi`-as-`NOR` (`hazake` etc., gender-invariant) and
`hik`-as-`NORK`→`ni`/`gu`; Alegiazkoa/Lehenaldia's `hi`-cells remain open.

## 2026-06-10 — Filled both Subjuntiboa NOR-NORK grids (Present + Past) from a user-supplied table, including the `hi` masc./fem. split

**Decision:** A user-supplied table provided full Subjuntiboa Present (new)
and completed the Past grid's remaining cells, including `hi` as both `NOR`
and `NORK` for the first time in any NOR-NORK grid — `hari`/`haiei` columns of
the Past grid matched pre-existing citations, corroborating both sources.
**Finding:** `hi`-as-`NOR` is gender-invariant; only `hi`-as-`NORK` splits via
`-a-`/`-na-` insertion (one exception, `hezan`, given as identical for both
genders, reproduced as-is). Did **not** use this data to fill Ahalera's `hi`
gaps — Subjuntiboa's `-a-`/`-na-` mechanism differs from Ahalera's `-k`/`-n`
suffix pattern, so cross-paradigm extrapolation isn't safe.

## 2026-06-10 — Ahalera "contradiction" was a tense split, not an error; filled the `❓` NOR=1st/2nd-person cells from a user-supplied table

**Decision:** A previous session had concluded `dezaket` was a mistaken
artifact and marked the entire NOR=1st/2nd block `❓`. A user-supplied
reference table showed **both recipes are real, for different tenses**:
Orainaldia uses the `dezaket`/`nazake`-type prefix recipe, while
Alegiazkoa/Lehenaldia use the `nezake`/`nintzake`-type `*ezan`-mirrored recipe.
Replaced the old combined grid with three full grids
(Orainaldia/Alegiazkoa/Lehenaldia), filling nearly all previously-`❓` cells.
**New finding:** same-person-category blocking is broader than the old strict
diagonal — extended `*(refl.)*` to the whole 1st-on-1st/2nd-on-2nd 8-cell block
per grid. `hi` (omitted by the new source) and Subjuntiboa remain `❓`.

## 2026-06-09 — Started NOR-NORI-NORK (§5): completed the `hura` grid, added a `haiek` (`-zki-`) grid, scoped out NOR=1st/2nd person

**Decision:** §5 had a single `NOR=hura` grid with several blank cells. Filled
them via the same `di-`+NORI-suffix+NORK-suffix formula visible elsewhere (one
fill, `didazu`, is a well-known form, corroborating it); two cells turned out
reflexive (`*(refl.)*`), two pre-existing unexplained `—` cells were left
as-is. Added a parallel `NOR=haiek` grid (Present+Past) using §4's `-zki-`
infix. **Scoped out:** NOR=1st/2nd person ditransitive forms ("he gives *me*
to him") — vanishingly rare and unattested in any source, left out entirely
rather than invented.

## 2026-06-08 — Filled Ondorioa `zuek`-as-object blanks using a `-zte-after-ke` rule

**⚠️ Superseded** by the 2026-06-10 entry above — the real rule merges
`-ke-`+`-z-` into `-zke-` instead. Kept for history: extended an existing
`[zint-u-ke-zte-suffix]` pattern to the NOR=zuek marker in both Ondorioa grids,
marking all 8 cells `🔍`.

## 2026-06-08 — Cross-checked `ukan`'s NOR-NORK 🔍-cells against the paradigm-chart PDF; recovered the `-zte-`-insertion rule for `zuek`-as-object cells

**Note:** The Past/Baldintza findings here (no `-ke-` involved) still stand;
only the Ondorioa extension was superseded 2026-06-10.

**Decision:** User-supplied forms from the paradigm-chart PDF either confirmed
existing 🔍-derived guesses or filled previously-honest `zuek`-as-object gaps.
Comparing fills against their `zu`-cell counterparts revealed the rule:
`-zte-` slots in right after the stem `-u-`, before the `NORK` suffix. Applied
to 3/4 Past cells and all 4 Baldintza cells; the 4th Past cell (`nik`→`zuek`)
got a rule-derived form (`zintuztedan`) instead of the user-supplied
`zaituztet` (which duplicates the present-tense cell, flagged as a likely
transcription slip). The rule wasn't extended to the Ondorioa grids — an extra
`-ke-` layer means nothing pins down which side of it `-zte-` lands, so those
cells were left blank rather than guess two layers deep.

## 2026-06-08 — Merged `ukan`'s citation paradigm into its NOR-NORK section; renumbered §3-§15 down by one; removed two further duplications

**Decision:** `CONJUGATIONS.md` had a duplicate `ukan` citation table and full
NOR-NORK grid (same `hura` column) — merged the citation table into the
NOR-NORK section's intro as the **✅ baseline** the grid was built against,
deleted the old section, and renumbered everything after it down by one
(updating ~60 `§N` cross-references). Sequential numbering was kept rather
than leaving a gap, since a silent gap is exactly the kind of small structural
debt that compounds.

Two more duplications found the same day, same pattern ("gradually fill in a
grid" leaves a stale partial copy): a sparse Present/Past grid wholly subsumed
by a complete one later in the section was deleted (one unique note moved to
the surviving grid); and a "Further moods" citation table's Baldintza/Ondorioa
rows duplicated the full NOR-NORK grids built later — trimmed to just
Ahalera/Subjuntiboa (the two moods without full-grid expansions), with
dependent grids re-sourced from §13's citation paradigm.

## 2026-06-08 — `CONJUGATIONS.md` keeps the *current* picture; the story of how it got there belongs in `DECISIONS.md`

**Decision:** Trimmed `CONJUGATIONS.md` of in-place retrospectives ("an
earlier pass assumed X, that was backwards...") down to short notes stating the
current fact plus a pointer to the dated `DECISIONS.md` entry. Also compressed
the intro's "sources merged in arrival order" changelog-as-prose into a flat
source list, and deleted a closing "Where this stands" section that restated
already-inline ⚠️-flagged discrepancies. **Why:** a reference doc's job is to
answer "what's true, and how sure are we?" as fast as possible — a paragraph
narrating a now-fixed mistake is friction that points backwards, and
`DECISIONS.md` already exists to carry that story without two places going out
of sync.

## 2026-06-08 — Filling NOR-NORK's "NOR = 1st/2nd person" gap: derive-and-flag where the recipe checks out, stop where it contradicts a sourced form

**Decision:** Extended §4 (`ukan`'s NOR-NORK system) with the "you have
*me*"-type grids the citation framing had left blank, decoding the PDF chart's
`[prefix]+[stem]+[suffix]` templates and cross-checking each against
already-sourced cells before trusting them on new ones. **Present/past/
baldintza/ondorioa(×2)** cross-checked cleanly (with one wrinkle: a `-z-`
appears between a plural-object stem and the `haiek`-subject suffix, e.g.
`dituzte` not `†ditute`) and were filled, marked 🔍 where not independently
attested. **Ahalera/Subjuntiboa** did *not* cross-check — the PDF's
"NOR=1st/2nd" template gives `dezaket` for a cell whose sourced citation form
is `nezake` (different agreement marking entirely) — written up as an open
discrepancy rather than silently picked. `zuek`-as-object was left blank
throughout (its `-zte-` infix would collide with a vowel-initial suffix, an
untested juncture).

**Same-day corrections:** A native speaker confirmed `haut`/`hau`/`haugu`/
`haute` ("I/he/we/they have you-familiar") as real (no longer 🔍), and flagged
that `guk`/`zuk`/`zuek`→`hi` had been wrongly marked `*(refl.)*` (different
people aren't reflexive — pattern-matched on shape, not grammar). Also
identified that `hi` (hika) and `zu`/`zuek` (zuka) are mutually exclusive
registers, so `hik`↔`zu`/`zuek` cells are *impossible*, not unsourced — given a
new `*(hika/zuka)*` marker, applied across all five expanded grids and (in a
same-day follow-up) to the equivalent dative-argument clash in §5's NOR-NORI
grids. **Lesson:** a blank cell's impossibility needs its own justification,
not one inherited from a similar-looking cell.

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
