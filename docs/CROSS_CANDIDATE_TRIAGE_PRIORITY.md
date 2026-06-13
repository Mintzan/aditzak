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

**This is a priority map, not a triage** — none of `CROSS_CANDIDATE_REVIEW.md`'s
checkboxes have been ticked. Nothing here should be encoded into
`CROSS_CANDIDATE_EXCLUSIONS` (#114) without a native speaker confirming the
specific entries, per #114's "don't guess at exclusions" note.

## Tier 1 — review first (~314 entries): `nor-nork` cluster, same transitive frame

`ukan`/`nahi`/`jakin`/`eduki`/`ikusi`/`jan`/`edan`/`erosi` all mark
`['nor', 'nork']` and share the "Subject(-k) [Object] Verb" frame
(`docs/AMBIGUOUS_DISTRACTORS_AUDIT.md`'s root-cause section). This is where the
audit's *confirmed* "both valid" cases came from (`eduki`↔`ukan`, `eduki`↔`ikusi`,
`ukan`↔`nahi` — the last one's literal-template instances are already excluded
by #112, but other-person/other-template instances of the same pair remain
here). Expect the highest hit rate for "both valid" ticks in this tier.

Pairs (entry counts from `docs/CROSS_CANDIDATE_REVIEW.md`):

- `eduki`↔`ikusi`: 30 + 15 = 45 — e.g. "Nik giltza poltsikoan daukat/ikusten dut."
  (have/hold vs see — both valid per the audit)
- `ukan`↔`ikusi`: 28 + 15 = 43
- `jakin`↔`nahi`: 24 + 23 = 47
- `ukan`↔`nahi`: 12 + 8 = 20 (non-`ni`/non-literal-collision instances)
- `eduki`↔`ukan`: 15 + 15 = 30 — e.g. "Anek liburua eskuan dauka/du." (near-synonyms)
- `jakin`↔`ikusi`: 12 + 9 = 21
- `ikusi`↔`nahi`: 9 + 9 = 18
- `ukan`↔`jakin`: 16 + 12 = 28
- `eduki`↔`jakin`: 9, `eduki`↔`nahi`: 9
- Consumption verbs `jan`/`edan`/`erosi` (all mutual pairs): 15+15+15+14+12+12 = 83
  — e.g. "Anek ura edango du/erosiko du." (drink vs buy — same object, both
  plausible)

## Tier 2 — spot-check, one flagged sub-group (~629 entries): `nor`-cluster verb-choice

`izan`/`egon`/`joan`/`etorri`/`ari`/`ibili` (all `nor`-only) cross-pollinate via
`verb-choice`. The audit found "no clear both valid cases" here in general —
each verb pairs with a different case-marked adjunct (locative for `egon`,
allative for `joan`/`etorri`, predicate nominal for `izan`, progressive
complement for `ari`/`ibili`), so most substitutions should read as genuinely
wrong (the intended "classic mistake" pedagogy).

**Flagged exception — `joan`↔`etorri` (44 + 44 = 88 entries):** both verbs take
the *same* allative (`-ra`) adjunct, just opposite direction. Spot-checked
entry #771: template `Ane etxera ___.` — `etorri`'s `dator` → "Ane etxera
dator." (Ane is coming home) vs `joan`'s `doa` → "Ane etxera doa." (Ane is
going home). **Both are grammatical, different-meaning sentences** — this
looks like a second "both valid" pair beyond the `nor-nork` cluster, likely
needing its own `CROSS_CANDIDATE_EXCLUSIONS` entry (probably symmetric, like
`ukan`↔`nahi`).

The rest of tier 2 (`izan`↔`egon` 66+64, `egon`↔`ukan`... wait, those are tier
3 — see below; the remaining `nor`-only pairs are `izan`↔`egon`, `izan`↔`etorri`/`joan`,
`egon`↔`etorri`/`joan`, `*`↔`ari`/`ibili`) is lower-priority: spot-check a
handful per pair to confirm the "different adjunct → wrong" pattern holds,
especially for `ari`/`ibili` (both take progressive gerund complements —
`"Ane idazten ari da"` vs `"Ane idazten dabil"` — which *might* turn out to be
a third both-valid pair, but is more likely to read as a dialectal/register
difference rather than two standard-Batua-valid sentences; worth one
spot-check, not a full pass).

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

## Suggested order for #114's triage pass

1. Tier 1 (~314 entries) — the main expected source of `CROSS_CANDIDATE_EXCLUSIONS` entries.
2. `joan`↔`etorri` from tier 2 (88 entries) — likely a second exclusion pair.
3. Spot-check the rest of tier 2 and tier 3 (a sample, not all ~1700) to confirm
   they're "wrong/ungrammatical" as expected; only read in full if a spot-check
   surprises you.
