# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

Decisions about the Basque conjugation research behind
`CONJUGATIONS.md`/`VERB_COVERAGE.md` live in `docs/LANGUAGE_DECISIONS.md`
instead.

## 2026-06-25 — #439 split into 5 narrower issues instead of one mega-backfill; #240 closed as resolved

#439 asked to backfill `validFor` cross-verb distractor tags so every verb has them, not just 15/104. Investigating before touching any data showed two things that changed the scope: (1) the "core" 15+4 verbs already tagged (`izan, egon, ukan, nahi, jakin, joan, etorri, jan, edan, erosi, ikusi, eduki, hartu, behar, eraman, ekarri, gustatu, ahaztu`) are already thorough — the class-model second-pass audit (`--classes`) only surfaces 64 candidates total across the whole corpus, and 62 of those are false positives (`jan`<->`edan` cross-suggestions the class model can't filter, since `food-drink` doesn't distinguish solid food from drink — see `docs/OBJECT_FRAME_TAGGING.md`); (2) #240's "food-drink under-tagging" finding turns out to already be fixed in the data (`jan`/`edan`/`erosi`'s sentences already carry the full sibling set) — closed #240 as resolved.

The real remaining work is the other 89 verbs, which have *zero* `validFor` tagging at all. Rather than one issue covering all 89 (thousands of agreement-compatible-but-mostly-wrong candidate slots needing real per-sentence linguistic judgment — not a size a single PR/session can responsibly review), split by category since each needs a different method: **#454** (14 `nor`-only intransitive verbs — likely just confirming `validFor: []` is correct, same as `izan`/`egon`'s documented "all-empty classes"), **#455–#458** (52 `nor-nork` verbs, batched into 4 semantic clusters of ~9–18 verbs each so each PR stays reviewable), **#459** (17 dative-tail `nor-nori(-nork)` verbs, which need dative-role matching rather than the plain agreement-based audit `validforGapAudit.mjs` already does). 6 ids (`maite` + 5 `*-dative` table variants) have no `sentences` of their own at all, so no backfill applies to them. See `docs/DISTRACTOR_STRATEGY.md` §6 for the full breakdown.

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

