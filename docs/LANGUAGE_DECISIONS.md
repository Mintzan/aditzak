# Language decisions

A running log of decisions from the research process that filled out
`CONJUGATIONS.md`'s conjugation grids and `VERB_COVERAGE.md` — the Basque
conjugation content being taught, as distinct from the app/code decisions
(including the interface-language/i18n feature) in `docs/DECISIONS.md`.
Newest entries at the top.

## 2026-06-17 — #180: `ibili`'s `hi` isn't a gap — `habil`/`ibili hintzen` by the same rule as `joan`/`etorri`

**Decision:** `ibili` gets `hi: 'habil'` (present) and `hi: 'ibili hintzen'`
(past) added to `src/data/verbs.js`, and is added as a 5th source in Unit
32's `unit-32-hi-present`/`unit-32-hi-past` pooled reviews
(`src/data/lessons.js`) alongside izan/egon/joan/etorri.

**Why this isn't the "irregular verb, may have a gap" research question
#180 flagged:** `CONJUGATIONS.md` §6 only marks `ibili`'s `hi` cell as `—` in
the **imperfective/habitual** past column (`nenbilen`-style) — a different
table from the **simple past** (`Lehenaldi Mugatua`) actually used in
`conjugations.past` (added per the 2026-06-12 "Simple past" entry below).
That simple past is compositional: perfective participle + `izan`'s past
auxiliary, the same formula already used for `joan hintzen`/`etorri
hintzen`. Since `izan`'s past auxiliary has a non-gapped `hi` cell
(`hintzen`), `ibili`'s simple past has one too — `ibili hintzen` — by the
same derivation already trusted for its two siblings. `habil` (present) was
already tabulated in §6 itself, just never wired into the data or Unit 32's
pooling. No native-speaker gap exists here; the omission was that `ibili`
was left out of #144's original four-verb `hi` core scope, not a defect in
the verb.

## 2026-06-17 — #170: §14 non-finite-form reading items reuse doc examples verbatim

**Decision:** Rather than author new sentences for the 8 new
`reading-nonfinite-*` items, every `source` sentence is copied verbatim from
`CONJUGATIONS.md` §14's own worked examples (e.g. `Filma ikusteko etorri
naiz.`, `Atzo ikusitako filma oso ona zen.`, `Etorria da.`). Distractor
options swap in other §14 suffixes/forms of the same verb (e.g. `-tako` vs.
`-a` vs. `-ten` vs. `-ko`) rather than inventing alternate phrasing, so the
only new judgment call is "is this distractor clearly wrong," not "is this
new sentence grammatical." Still worth a native-speaker pass before treating
as authoritative — non-finite forms are exactly where #170 flagged higher
risk of subtle errors.

## 2026-06-17 — #167: toka/noka and hi-as-NORK gender-split forms; need native-speaker check

**Decision:** Added `izan`/`ukan` toka/noka (`hura`/`haiek` only) and `ukan`/
`jakin`'s `hi`-as-NORK present gender split, all sourced from
`docs/CONJUGATIONS.md` §10's synthetic-verb allocutive table (`ukan`'s own
`hi`-as-NORK row is also used for `jakin`'s, per #144's prior decision that
§7's blank `hik` row for `jakin` is filled by §10's data).

- `izan` toka/noka: `da`/`dira` are suppletive — they switch to the `du`-stem
  before the `-k`/`-n` suffix (`duk`/`dun`, `dituk`/`ditun`), rather than the
  unattested `†dak`/`†dan`. Past inserts `-a-`/`-na-` before the final `-n`:
  `zen` → `zuan`/`zunan`, `ziren` → `zituan`/`zitunan`.
- `ukan` toka/noka: `du`/`dute` undergo a `u`→`i` stem shift before the
  `-k`/`-n` suffix (`dik`/`din`, `ditek`/`diten`), specifically so they stay
  distinct from `hi`-as-NORK's own `duk`/`dun` on the same verb. Past:
  `zuen` → `zian`/`zinan`, `zuten` → `zitean`/`zitenan`.
- `ukan`/`jakin` hi-as-NORK present: `duk`/`dun`, `dakik`/`dakin`. `ukan`'s
  past stays unsplit (`huen`) — §3 doesn't show a past split here.

**Caveat:** §10 only tabulates `hura`/`haiek` for izan/ukan's toka/noka (no
full person grid in the source), so the data and the Unit 33/34 lessons are
deliberately 2-person/binary-choice. These forms — especially the past
`-a-`/`-na-` insertions and the `u`→`i` stem shift — should be confirmed
against a native speaker or grammar reference before being treated as
authoritative beyond this app.

## 2026-06-16 — #162: plural-object (`-zki-`) forms for `esan`/`eman`'s axis-fixed slices; forms need native-speaker check

**Decision:** Added `presentPlural`/`pastPlural`/`futurePlural` conjugation
tables to `esan` (`recipient: 'hura'`, NORK still the varying `person`) and
`eman` (`agent: 'ni'`, NORI still the varying `person`), reusing the same
tense-key names as #164's NOR-NORI plural tables since both describe the
same thing — the absolutive `NOR` argument going from singular to plural.
Forms are taken directly from `docs/CONJUGATIONS.md` §5's `NOR`=haiek
present/past grids: for `esan`, the `hari` row across the `NORK` columns
(`dizkiot`/`dizkiozu`/`dizkio`/`dizkiogu`/`dizkiozue`/`dizkiote` present;
`nizkion`/`zenizkion`/`zizkion`/`genizkion`/`zenizkioten`/`zizkioten` past);
for `eman`, the `nik` column across the `NORI` rows (`dizkizut`/`dizkiot`/
`dizkizuet`/`dizkiet` present; `nizkizun`/`nizkion`/`nizkizuen`/`nizkien`
past). Future is the `-go` participle + the present-tense plural aux, same
pattern as the existing singular future tables. Sentence frames use plural
nouns (`gezurrak` "lies" for `esan`, `liburuak` "the books" for `eman`) so
the cue itself signals the `-zki-` slot. Flagged here for the same
native-speaker confirmation #164's plural-NOR forms are pending, since these
were derived from the grid rather than independently verified by a speaker.

## 2026-06-16 — #164: plural-NOR (`-zki-`) forms for `gustatu`/`iruditu`/`ahaztu`; forms need native-speaker check

**Decision:** Added `presentPlural`/`pastPlural`/`futurePlural` conjugation
tables to `gustatu`/`iruditu`/`ahaztu` — the same NORI-suffix family as their
existing singular-`NOR` tables, but `-zki-`-infixed because the fixed `NOR`
argument moves from `hura` ("it") to `haiek` ("they"), per
`docs/CONJUGATIONS.md` §4's `haiek`/`NOR` column. Reused each verb's existing
participle choice (`gustatu`/`iruditu`'s `-tzen` habitual, `ahaztu`'s bare
resultative participle) — only the dative auxiliary changes shape between the
singular and plural tables. Added a `presentPlural` `sentences` table too,
swapping each verb's singular-object cue ("hau"/"ongi"/"liburua") for a
genuine plural-or-pluralizable noun phrase ("hauek"/"gauza hauek
ongi"/"giltzak") — `ahaztu`'s "Niri giltzak ___." directly mirrors the
`docs/LEARNING_JOURNEY_PROPOSED.md`/#164 worked example ("Giltzak ahaztu
zaizkit" = "I forgot the keys").

**Flag for native-speaker review:** same standing flag as #146's singular
tables (still unconfirmed) — these `-zki-` plural forms inherit that
uncertainty and add their own: in particular `iruditu`'s `presentPlural`
sentence frame ("Niri gauza hauek ongi ___.") was constructed by analogy
(`iruditu`'s only existing sentence cue, "ongi", is an adverb rather than a
NOR-bearing noun phrase, so a plural subject had to be introduced) rather than
taken from a worked example in the docs.

## 2026-06-15 — Added `gustatu`/`iruditu`/`ahaztu` (NOR-NORI) as the first dative-subject `VERBS` entries; forms need native-speaker check

**Decision:** #146 added `gustatu` ("to like/please"), `iruditu` ("to seem"),
and `ahaztu` ("to forget") as `VERBS` entries for Unit 23 ("Pleasures,
Opinions, Feelings") and Unit 24 ("Dative Across Time") — the first NOR-NORI
("psych"/dative-subject) verbs. All three use `agreement: ['nor', 'nori']`
with `object: 'hura'` (NOR fixed to "it", reusing the same field `nor-nork`
verbs use for their fixed absolutive object); `person` ranges over NORI, the
dative experiencer, per CONJUGATIONS.md §4's `hari`/NOR=`hura` column:

- Present: `gustatu`/`iruditu` use the `-tzen` habitual participle —
  `gustatzen zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie` and
  `iruditzen zait`/.... `ahaztu` instead uses the **bare participle**
  (`ahaztu zait`/`zaizu`/...) — a resultative/perfect-like "it is in a state
  of being forgotten to me" reading, per `docs/LEARNING_JOURNEY_PROPOSED.md`'s
  dedicated `ahaztu` table and its Unit 23 example ("Liburua ahaztu zait").
  `ahazten zait` ("I tend to forget it", habitual) was *not* used.
- Past: bare participle + past dative aux for all three —
  `gustatu zitzaidan`/..., `iruditu zitzaidan`/..., `ahaztu zitzaidan`/...,
  per CONJUGATIONS.md §4's past grid (`hari` row, NOR=`hura`: `zitzaion` →
  generalizes to `zitzaidan`/`zitzaizun`/`zitzaigun`/`zitzaizuen`/`zitzaien`
  across NORI).
- Future: `[participle]+ko` + present dative aux — `gustatuko zait`/...,
  `irudituko zait`/..., `ahaztuko zait`/..., following the issue's stated
  `-tu` → `-tuko` rule (all three verbs end in `-tu`).

**Flag for native-speaker review:** none of these forms or example sentences
have had a native-speaker check yet — in particular `ahaztu`'s bare-participle
present (vs the `-tzen` habitual) and `iruditu`'s `-tzen`/`zitzai-`/`-ko` forms
(derived by analogy with `gustatu`/`ahaztu` rather than taken from a worked
example in the docs).

**Deferred to a follow-up issue** (same split-out pattern as #147/#162, per
the user's standing instruction): plural-NOR (`-zki-`) distractor fodder
(`zaizkit`/`gustatuko zaizkit`/etc., for the Distractor Engine Matrix's number
slot) and Unit 23's extra-practice lessons (recognition, production,
number-split, case-frame buffer). This PR covers the core "present+past+future
drillable" piece of the acceptance criteria.

## 2026-06-15 — Added `esan`/`eman` (NOR-NORI-NORK) as the first ditransitive `VERBS` entries; forms need native-speaker check

**Decision:** #147 added `esan` ("to tell/say") and `eman` ("to give") as
`VERBS` entries for Unit 25 ("Communication & Giving") and Unit 26 ("Telling &
Giving Across Time"), the first verbs to use #142's `recipient`/`agent`
axis-fixed metadata:

- `esan` sets `recipient: 'hura'` (NORI fixed = "to him/her"), so `person`
  varies over NORK — present `esaten diot`/`esaten diozu`/`esaten dio`/
  `esaten diogu`/`esaten diozue`/`esaten diote` (CONJUGATIONS.md §5's `hari`
  row), past `esan nion`/.../`esan zioten`, future `esango diot`/....
- `eman` sets `agent: 'ni'` (NORK fixed = "I give it to..."), so `person`
  varies over NORI — present `ematen dizut`/`ematen diot`/`ematen dizuet`/
  `ematen diet`, past `eman nizun`/`eman nion`/`eman nizuen`/`eman nien`,
  future `emango dizut`/.... Only 4 persons exist for this axis (`zu`/`hura`/
  `zuek`/`haiek`) — `ni`/`gu` are reflexive-only (§5) and `hi` is hitanoa
  (not yet modeled, #144), same shape as the small allocutive tables #139's
  distractor-floor fix anticipates.

**Present tense is periphrastic** (`esaten`/`ematen` + the `di-` ditransitive
auxiliary), matching `docs/LEARNING_JOURNEY_PROPOSED.md`'s Unit 25 examples
("ematen diot", "esaten diozu") rather than CONJUGATIONS.md §8's bare `diot`
(which §8 frames as `esan`'s own synthetic present but is ambiguous with the
shared `eman`/other-ditransitive auxiliary out of context). Past/future drop
the `-ten` infinitive for the bare participle + auxiliary (`esan nion`,
`esango diot`), per the same proposed-doc examples.

**Flag for native-speaker review:** `esan`'s past forms (`nion`/`zion`/
`genion`/`zenion`) follow CONJUGATIONS.md §5's general `hari`-row past grid
and the proposed doc's "Esan nion" example, but §8's `esan`-specific table
gives `nioen`/`zioen`/`genioen`/`zenioen` for the same NORK cells instead — a
genuine discrepancy between the two doc sections that should be resolved
against a grammar reference. None of `esan`/`eman`'s forms or example
sentences have had a native-speaker check yet.

**Deferred to a follow-up issue** (per #147's scope, split out at the user's
request): the `-zki-` object-number fodder (`dizkiot`, etc.) for the
Distractor Engine Matrix's number slot, and Unit 25's four extra-practice
lessons (fix-NORI, fix-NORK, object-number, two-axis recombination). This PR
covers the core "drillable present+past+future, one axis per lesson" piece of
the acceptance criteria.

## 2026-06-15 — Promoted `hartu` from candidate to a `VERBS` entry; forms need native-speaker check

**Decision:** #143 promoted `hartu` ("to take") from `VERB_COVERAGE.md`
§4b-bis's user-supplied candidate list to a full `VERBS` entry, used to stage
the `jaten`(-ten)/`hartzen`(-tzen) morphophonological pairing alongside `jan`
in Unit 12. Present (`hartzen dut`) and past (`hartu nuen`) reuse the forms
already logged in §4b-bis's 2026-06-13 entry; the future (`hartuko dut`...)
is new, following the regular `-tu` → `-tuko` periphrastic future pattern
used elsewhere (not yet present in VERB_COVERAGE.md's §4b-bis table).

None of `hartu`'s forms — conjugation tables or the example sentences
(`autobusa`/`aterkia`/`trena`/`taxia`/`katua`/`erabakia`/`txanda hartu`) — have
had a native-speaker sanity check yet, unlike most other active `VERBS`
entries. Flagging here so a future pass can confirm both the conjugations and
the naturalness of the example sentences before treating `hartu` as fully
verified.

## 2026-06-13 — Resolved `egin`'s synthetic-vs-periphrastic conflict: both exist, periphrastic is the everyday form

**Decision:** `egin` genuinely has both: rare synthetic forms (`dakit` "I do
it", `egizu` as an hitano imperative in some dialects), mostly preserved in
Western/Central dialects and literary Basque, *and* the everyday periphrastic
`egiten dut`/`egin nuen` (§4b-bis) — also Basque's classic transitive "light
verb" for compounds (`lo egin`, `dantza egin`, `barre egin`...). Not a
conflict to reconcile, like `iraun`'s noted synthetic/periphrastic overlap —
§4a's entry now describes the synthetic side, §4b-bis's the periphrastic side.
Resolves the flag raised in the previous entry.

## 2026-06-13 — Resolved `itxi`'s present-tense form: `ixten dut`

**Decision:** `VERB_COVERAGE.md` §4b-bis's `itxi` entry now reads `Ixten dut`
(not `itxiten dut`), confirmed — resolves the flag raised in the previous
entry.

## 2026-06-13 — Logged a batch of `nor-nork` periphrastic verb candidates in `VERB_COVERAGE.md`

**Decision:** Added §4b-bis to `VERB_COVERAGE.md` — `hartu`, `saldu`,
`irakurri`, `idatzi`, `ikasi`, `utzi`, `bilatu`, `aurkitu`, `zabaldu`, `itxi`,
and `egin`, each with present/past `nor-nork` forms (user-supplied), as
candidates for extending Unit 10's pooled `jan`/`edan`/`erosi`/`ikusi`-style
drill or seeding later units. Documentation only — no `VERBS` entries yet.

`maite izan` ("to love") was *not* added to this table — its "Maite dut" shape
is `maite` + `ukan`, the §5 `nahi`/`behar`-style fixed-expression pattern, not
a participle+auxiliary periphrastic verb. (`itxi`'s and `egin`'s flags, also
raised here, were resolved in later entries above.)

## 2026-06-12 — Simple past (`Lehenaldi Mugatua`) for `joan`/`etorri`/`jan`/`edan`/`erosi`/`ikusi`/`eduki`/`ibili`, for the new "Looking Back I/II" journey units

**Decision:** Added `conjugations.past` for 8 verbs, all full 6-person grids:

- **`jan`/`edan`/`erosi`/`ikusi`** (`jan nuen`/`zenuen`/`zuen`/`genuen`/
  `zenuten`/`zuten`, and the equivalent for `edan`/`erosi`/`ikusi`): perfective
  participle + `ukan`'s past auxiliary, already documented as each verb's
  "Past (lehena)" column in `CONJUGATIONS.md` §7 (`ikusi` was documented
  there already; `jan`/`edan`/`erosi` per the 2026-06-12 "Documented
  `jan`/`edan`/`erosi`" entry below) — copied directly, no new derivation.
- **`eduki`** (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/
  `zeukaten`): synthetic, also already documented as §7's "Past (lehena)"
  column for `eduki` — copied directly.
- **`joan`/`etorri`/`ibili`** (`joan nintzen`/`zinen`/`zen`/`ginen`/`zineten`/
  `ziren`, and the equivalent for `etorri`/`ibili`): perfective participle +
  `izan`'s past auxiliary (§1's `nintzen`/`zinen`/`zen`/`ginen`/`zineten`/
  `ziren`), per §11's periphrastic tense matrix ("Lehenaldi Mugatua" row —
  perfective participle + `izan`/`ukan` past auxiliary, the same mechanism
  Units 14-15's future uses with the present auxiliary). These are **not**
  §6's existing "Past" column for these three verbs (`nindoan`/`zetorren`/
  `nenbilen`) — see below.

`sentences.past`/`pronounSentences.past` for all 8 verbs alias their
`present` arrays by reference (same reuse-loop pattern as the future tense,
since a sentence template's blank doesn't depend on tense).
`negativeSentences.past` is aliased only for `eduki` (joining `izan`/`egon`/
`ukan` from the earlier session) — the other 7 are periphrastic and split
apart under negation (`ez nuen ikusi`, not a single `___` blank), same
reasoning as their present-tense `negativeSentences` exclusion.

**Why this is "simple past" and not §6's "Past" column for `joan`/`etorri`/
`ibili`:** §6's `nindoan`/`zetorren`/`nenbilen`-type forms are **imperfective/
habitual past** ("I was going" / "he was coming" / "I used to walk around") —
ongoing or repeated past action, the opposite of "completed." The new
`conjugations.past` added here is **simple/completed past** ("I went" / "she
came" / "they walked around [that one time]") — what a learner needs to say
"I went to the beach yesterday." These are grammatically distinct forms in
Basque, not two names for the same thing; §6's imperfective forms remain
reserved for Phase III's Unit 19 ("Motion in Progress (Past)"), contrasted
explicitly with this entry's simple past.

**Deferred — `jakin`/`nahi`/`ari` past:** `jakin`'s past
(`CONJUGATIONS.md` §7) has gaps (`hik`/`zuk`/`zuek` rows are `—`), so it was
left out of Unit 8 ("Looking Back I — I Was, I Had") despite riding `ukan`'s
suffix family there. `nahi`/`ari` are modal particles whose past would derive
from `ukan`/`izan`'s past once paired with the right participle (`nahi izan
nuen`, `ari izan nintzen`) — grammatically straightforward but not part of
this redesign's payload (neither old Unit 9's future nor any "Looking Back"
unit's examples call for "I wanted"/"I was [in the middle of]"), so left for a
future pass alongside `jakin`'s gap.

## 2026-06-12 — Future-tense (`Geroa`) forms for Units 1-8's 12 verbs, `izan` as suppletive future participle for `ukan`/`eduki`, `ari` excluded

**Decision:** Per `docs/CONJUGATIONS.md` §11, every verb's future is its
`-ko`/`-go` prospective participle + the present tense of its agreement-
appropriate auxiliary (`izan` for `nor` verbs, `ukan` for `nor-nork` verbs) —
the same auxiliary table each verb already uses for its periphrastic present,
just with a different participle. Concretely: `izan`→`izango naiz/zara/da/
gara/zarete/dira`, `egon`→`egongo naiz/...`, `joan`→`joango naiz/...`,
`etorri`→`etorriko naiz/...`, `ibili`→`ibiliko naiz/...` (all `nor`, `izan`
aux); `ukan`/`eduki`→**`izango dut/duzu/du/dugu/duzue/dute`** (the suppletive
participle for "have" is `izango`, not a `ukan`-stem form — `ukango` doesn't
exist), `nahi`→`nahiko dut/duzu/du`, `jakin`→`jakingo dut/duzu/du`, `jan`→
`jango dut/...`, `edan`→`edango dut/...`, `erosi`→`erosiko dut/...`, `ikusi`→
`ikusiko dut/...` (all `nor-nork`, `ukan` aux, three-person tables kept at
their existing scope for `nahi`/`jakin`, full six for the rest). `ari` was
**not** given a `future` table — its only grammatical future ("ari izango
naiz" / "I will be [in the middle of] doing") is a periphrastic-of-a-
periphrastic that's marginal in everyday Batua and isn't part of Unit 9's
"`-ko`/`-go` + present auxiliaries" payload.

**Why:** All forms follow directly from §11's documented rule plus each verb's
already-established `agreement`/auxiliary pairing from its present-tense
table — no new research or cross-checking needed beyond confirming `izango`
(not `ukango`) is correct for `ukan`/`eduki`'s future, which §11 already notes
as the suppletive pattern. Excluding `ari` keeps Unit 9 to forms a learner
would actually produce, and avoids inventing a "future continuous" framing the
journey doesn't ask for.

## 2026-06-12 — Documented `jan`/`edan`/`erosi` in `CONJUGATIONS.md` §7, completing Unit 7's prerequisite

**Decision:** Added `jan`/`edan`/`erosi` as new `###` subsections appended to
§7 (after `entzun`), same placement precedent as `ikusi`/`entzun` themselves
("avoid renumbering §8-§13"). All three are regular periphrastic NOR-NORK
verbs (`docs/VERB_COVERAGE.md` §4b's "`-i`"/"`-n`" verb groups): imperfective
participle (`jaten`/`edaten`/`erosten`) + `ukan`'s present auxiliary for
"Present (oraina)", perfective participle (`jan`/`edan`/`erosi`) + `ukan`'s
past auxiliary for "Past (lehena)" — the exact same table shape as `ikusi`/
`entzun`, `NOR` fixed at `hura`. These are textbook A1 forms (no Gemini
cross-check needed, unlike the riskier Ahalera/ditransitive grids elsewhere in
this doc).

## 2026-06-11 — Filled `izan`/`ukan`'s missing `zu` rows in `CONJUGATIONS.md` §1/§3 — the v2 journey's one concrete prerequisite

**Decision:** Added `zu` (`zara`/`zinen`) to `izan`'s §1 table and `zu`
(`duzu`/`zenuen`) to `ukan`'s §3 table — both previously six-person with an
explicit "no `zu`" note. Both forms were cross-checked against material
already in the document (`mintzatu`'s `zu` row for `izan`; the NOR=1st/2nd
grids for `ukan`) rather than sourced fresh. `egon`/`joan`/`etorri`/`ibili`
already had `zu` rows; `VERBS` itself is unchanged (still six persons, no `zu`
— that's for later units).

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

