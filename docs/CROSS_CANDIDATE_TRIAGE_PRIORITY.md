# Triage priority for `docs/CROSS_CANDIDATE_REVIEW.md`

`docs/CROSS_CANDIDATE_REVIEW.md` (#113) has ~2100 entries (the exact count
varies slightly between regenerations, since the script samples cross-verb
candidates randomly over 25 passes — see its header) — too many to review
without some way to triage by priority. This doc groups those entries into 3
tiers by *expected* outcome, based on the verb-pair analysis in
`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`, so a reviewer can spend their time where
"both valid" ticks are actually likely, rather than reading all of them in
order. Counts below are from the 2101-entry snapshot and will drift slightly
on regeneration, but the relative groupings/priorities won't change.

**Update (2026-06-14): Tier 1 and the flagged `joan`↔`etorri` pair have now
been triaged at the pair level** (verdicts below, encoded in
`CROSS_CANDIDATE_EXCLUSIONS`/`docs/DECISIONS.md`/`docs/CROSS_CANDIDATE_REVIEW.md`).
Rather than ticking ~2100 individual entries, the maintainer reviewed one
representative example sentence per *pair* — `CROSS_CANDIDATE_EXCLUSIONS`
operates at pair granularity, so a pair-level verdict covers every entry for
that pair regardless of tense/person/template. Tier 2 (minus `joan`↔`etorri`)
and Tier 3 remain un-triaged; nothing there should be encoded into
`CROSS_CANDIDATE_EXCLUSIONS` without a similar pair-level review, per #114's
"don't guess at exclusions" note.

## Tier 1 — `nor-nork` cluster, same transitive frame — TRIAGED

`ukan`/`nahi`/`jakin`/`eduki`/`ikusi`/`jan`/`edan`/`erosi` all mark
`['nor', 'nork']` and share the "Subject(-k) [Object] Verb" frame
(`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`'s root-cause section).

Pairs and verdicts (entry counts from `docs/CROSS_CANDIDATE_REVIEW.md`):

- `eduki`↔`ikusi`: 30 + 15 = 45 — e.g. "Nik giltza poltsikoan daukat/ikusten dut."
  — **both valid, excluded**
- `ukan`↔`ikusi`: 28 + 15 = 43 — **both valid, excluded**
- `jakin`↔`nahi`: 24 + 23 = 47 — **both valid, excluded**
- `ukan`↔`nahi`: 12 + 8 = 20 (non-`ni`/non-literal-collision instances) —
  **both valid, excluded** (the literal-template instances were already
  excluded by #112)
- `eduki`↔`ukan`: 15 + 15 = 30 — e.g. "Anek liburua eskuan dauka/du." — **both
  valid, excluded** (near-synonyms, "interchangeable" per the maintainer)
- `jakin`↔`ikusi`: 12 + 9 = 21 — **both valid, excluded**
- `ikusi`↔`nahi`: 9 + 9 = 18 — **both valid, excluded**
- `eduki`↔`nahi`: 9 — **both valid, excluded**
- `ukan`↔`jakin`: 16 + 12 = 28 — **NOT excluded**: "Anek auto bat daki" ("Anek
  knows a car") "makes no sense" — `jakin`'s forms remain a valid (wrong)
  distractor for `ukan`'s sentences, and vice versa.
- `eduki`↔`jakin`: 9 — **NOT excluded**: "...eskuan daki" ("...knows in hand")
  "makes no sense", same reasoning as `ukan`↔`jakin`.
- Consumption verbs `jan`/`edan`/`erosi` (all mutual pairs, 15+15+15+14+12+12 = 83):
  - `jan`↔`erosi`, `edan`↔`erosi` — **both valid, excluded** (eat/drink X vs
    buy X, same object).
  - `jan`↔`edan` — **NOT excluded**: "Anek entsalada edango du" ("Anek will
    drink salad") "doesn't make semantic sense".

All 10 "excluded" pairs above (plus the pre-existing `ukan`↔`nahi`) are now in
`CROSS_CANDIDATE_EXCLUSIONS` (`src/lessonLogic.js`), and their
`docs/CROSS_CANDIDATE_REVIEW.md` entries are ticked/annotated "Resolved by
#114". The 3 "NOT excluded" pairs (`ukan`↔`jakin`, `eduki`↔`jakin`, `jan`↔`edan`)
were reviewed and confirmed as genuinely-wrong distractors — no further action.

## Tier 2 — `nor`-cluster verb-choice (~629 entries, `joan`↔`etorri` triaged, rest un-triaged)

`izan`/`egon`/`joan`/`etorri`/`ari`/`ibili` (all `nor`-only) cross-pollinate via
`verb-choice`. The audit found "no clear both valid cases" here in general —
each verb pairs with a different case-marked adjunct (locative for `egon`,
allative for `joan`/`etorri`, predicate nominal for `izan`, progressive
complement for `ari`/`ibili`), so most substitutions should read as genuinely
wrong (the intended "classic mistake" pedagogy).

**`joan`↔`etorri` (44 + 44 = 88 entries) — TRIAGED, both valid, excluded.**
Both verbs take the *same* allative (`-ra`) adjunct, just opposite direction.
Spot-checked entry #771: template `Ane etxera ___.` — `etorri`'s `dator` →
"Ane etxera dator." (Ane is coming home) vs `joan`'s `doa` → "Ane etxera doa."
(Ane is going home). Confirmed by the maintainer ("Unibertsitatera dator means
coming to the university, it is correct") — **both grammatical,
different-meaning sentences**. Now in `CROSS_CANDIDATE_EXCLUSIONS`.

The rest of tier 2 (`izan`↔`egon`, `izan`↔`etorri`/`joan`, `egon`↔`etorri`/`joan`,
`*`↔`ari`/`ibili`) remains un-triaged: spot-check a handful per pair to confirm
the "different adjunct → wrong" pattern holds, especially for `ari`/`ibili`
(both take progressive gerund complements — `"Ane idazten ari da"` vs `"Ane
idazten dabil"` — which *might* turn out to be a third both-valid pair, but is
more likely to read as a dialectal/register difference rather than two
standard-Batua-valid sentences; worth one spot-check, not a full pass).

## Tier 3 — likely fine, spot-check a few only (~1158 entries): `case-mixer` (`nor` × `nor-nork`)

These come from `generateCaseMixerQuestions`, which deliberately inverts the
agreement-compatibility filter to mix a `nor`-only form into a `nor-nork`
sentence (or vice versa) — e.g. offering `naiz`/`dago`-type forms where `dut`/
`du`-type forms are needed. This is `case-mixer`'s entire purpose (the
"classic learner mistake" of using the wrong case-marking pattern,
`EXERCISE_VARIETY_PLAN.md`'s intro example). The audit found no "both valid"
cases of this shape. Largest pairs: `izan`↔`egon`/`ukan` (66/64/63/63/53/52),
`etorri`/`joan`↔`egon`/`izan`/`ukan`/`jakin`/`nahi`/`ikusi` (20s-40s),
`eduki`/`ibili` (30/30). Recommend a handful of spot-checks across the largest
pairs to confirm, but don't expect this tier to contribute many ticks.

## Remaining work

1. Spot-check the rest of tier 2 (a sample, not all ~540 remaining) to confirm
   they're "wrong/ungrammatical" as expected, especially `ari`/`ibili`.
2. Spot-check a handful across tier 3's largest pairs.
3. Only read entries in full if a spot-check surprises you.
