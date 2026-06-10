# Basque verb conjugations — a reference

A single place to look up conjugation forms — both the ones already powering
Aditzak's lessons (verified against `VERBS` in `src/App.jsx`) and a much
broader paradigm reference merged in afterwards. Useful when deciding what to
add to `VERBS` next, and as a sanity check against the kind of mistake
`DECISIONS.md` warns about — content that *looks* like correct Basque but
actually belongs to a different paradigm (it has happened twice already in
`VERB_COVERAGE.md`, with `irudi` and `etzan`).

Persons follow the app's six-person model (`ni / hi / hura / gu / zuek /
haiek`) where the app's own data is concerned; the broader reference below
also includes `zu`, which `VERB_COVERAGE.md` §1 already flags as a real gap in
the app's seven-person paradigm.

**Confidence key:**
- ✅ — verified, copied straight from `VERBS` in `src/App.jsx`; exactly what
  learners are quizzed on today
- 📖 — broader reference material (sections 2 onward): plausible standard
  Batua forms, merged in from a larger paste and cross-checked where possible
  against the two further sources in §13/§14 (with a handful of typos and one
  mislabel corrected along the way). Treat it as a solid starting point —
  but still not yet verified against `VERBS` itself. The few discrepancies
  the cross-check couldn't settle are flagged inline with ⚠️ at point of use
  (see §5) rather than gathered in a separate list
- 🔍 — partial forms only, as they surfaced while researching
  `VERB_COVERAGE.md`; the full paradigm isn't confirmed, so it's quoted
  verbatim rather than filled in

**Sources, beyond `VERBS` itself:** an initial large paste (the basis of §2
onward); a paradigm-chart PDF covering Batua/Bizkaiera/Zuberera (§13, "Euskal
aditz laguntzailea"); a 2011 classroom handout covering ten synthetic verbs
(§14, "Aditz trinkoak"); and a PDF on rarer/non-standard synthetic verbs
(behind §8, "trinko-ezohiko-batzuk", euskarians.wordpress.com, 2012). What
each one settled, corroborated, or generated lives in the relevant section's
own notes (start with §4, §6, §8, §13, §14 for the most substantial finds)
rather than recapped here.

---

## 1. `izan` — "to be" · nor · ✅

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | naiz | nintzen |
| hi | haiz | hintzen |
| hura | da | zen |
| gu | gara | ginen |
| zuek | zarete | zineten |
| haiek | dira | ziren |

---

# Broader reference (📖 — merged in, not yet verified)

Everything from here down was merged in from a larger conjugation reference
and goes well beyond what's coded into `VERBS`. It includes the `zu` person
the app doesn't model, fuller `NOR-NORK`/`NOR-NORI`/`NOR-NORI-NORK`
object-agreement grids, more synthetic verbs, the imperative, and the
periphrastic system. It's been cross-checked against the further sources in
§13/§14 — what that caught and fixed is folded straight into the tables below,
and the handful of discrepancies it couldn't resolve are flagged inline with
⚠️ right where they occur (see §5).

## 2. `izan` — additional paradigms · 📖

`izan`'s full mood/tense system, sourced from §13's plain-word paradigm lists
(see its own notes on why that source is usually quoted only selectively).
**Baldintza** (the *if*-clause — "if I were") and **ondorioa** (the
*consequence* clause — "I would be") are two distinct paradigms that are easy
to conflate, so they're kept separate below, alongside the potential,
subjunctive, and `izan`'s own imperative.

### Baldintza — "if" clause (protasis)

| Person | Form |
|---|---|
| ni | banintz |
| hi | bahintz |
| hura | balitz |
| gu | bagina |
| zu | bazina |
| zuek | bazinete |
| haiek | balira |

### Ondorioa — "would (be)" result clause (apodosis)

| Person | Present | Past |
|---|---|---|
| ni | nintzateke | nintzatekeen |
| hi | hintzateke | hintzatekeen |
| hura | litzateke | zatekeen |
| gu | ginateke | ginatekeen |
| zu | zinateke | zinatekeen |
| zuek | zinatekete | zinateketen |
| haiek | lirateke | ziratekeen |

### Potential (ahalera)

| Person | Present | Past | Hypothetical |
|---|---|---|---|
| ni | naiteke | nintekeen | ninteke |
| hi | haiteke | hintekeen | hinteke |
| hura | daiteke | zitekeen | liteke |
| gu | gaitezke | gintezkeen | gintezke |
| zu | zaitezke | zintezkeen | zintezke |
| zuek | zaitezkete | zintezketen | zintezkete |
| haiek | daitezke | zitezkeen | litezke |

### Subjuntiboa (subjunctive)

| Person | Present | Past |
|---|---|---|
| ni | nadin | nendin |
| hi | hadin | hendin |
| hura | dadin | zedin |
| gu | gaitezen | gintezen |
| zu | zaitezen | zintezen |
| zuek | zaitezten | zintezten |
| haiek | daitezen | zitezen |

### Agintera (imperative) — `izan`'s own forms

Second/third-person only, like every Basque imperative (§9) — `izan`
doesn't have first-person or "hura"-as-addressee imperative forms, hence the
gaps below (you can't command yourself or "it"; `bedi`/`bitez` are the
3rd-person *jussive* "let X be" forms, not commands to "hura"/`haiek`):

| Person | Form |
|---|---|
| ni | — |
| hi | hadi |
| hura | bedi *("let it/him/her be")* |
| gu | — |
| zu | zaitez |
| zuek | zaitezte |
| haiek | bitez *("let them be")* |

## 3. `ukan` — "to have" (the `du` auxiliary) · NOR-NORK system · 📖

`VERBS` models `ukan` only in its citation form — `NOR` fixed at 3rd-person
singular absolutive ("it/him/her"), as `VERBS` itself notes with
`object: 'hura'`. That citation paradigm is the **✅ baseline** the rest of
this section builds out from and was cross-checked against:

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | dut | nuen |
| hi | duk | huen |
| hura | du | zuen |
| gu | dugu | genuen |
| zuek | duzue | zenuten |
| haiek | dute | zuten |

The full paradigm, though, varies the verb by **both** subject (`NORK`, rows)
*and* object (`NOR`, columns) — naturally a grid, not a single column. The
table just above is, in fact, nothing but that grid's `hura` column, narrowed
to the six persons `VERBS` models (no `zu`; `hi` shown unsplit). Keeping it
as a stand-alone section next to the full grid would just be the same ✅ data
twice wearing two hats — merged here instead, both to avoid that duplication
and because seeing it as one column of the bigger picture is the more useful
frame for what follows. *Blank cells are sourcing gaps, not claims that a form
doesn't exist* — except where marked `(refl.)`, meaning the combination is reflexive
and just doesn't occur ("I have me"), or `(hika/zuka)`, meaning the combination
crosses Basque's two mutually exclusive familiar/formal address registers and
so cannot occur in *any* verb form, full stop (see "Completing the grid" below
for what that means in practice). The `hi`-as-object column — long the kind of
gap `VERB_COVERAGE.md` §1 flags for `hi`/`zu` — is no longer a blank wall
either: `haut`, `hau`, `haugu`, and `haute` ("I/he-she/we/they have you,
familiar") are confirmed directly rather than recipe-derived guesses.

### Further moods (citation paradigm: `NOR` fixed at `hura`/`haiek`)

§13 spells these out as plain `HURA`/`HAIEK` word-pairs — the same shape
`VERBS` already uses for `ukan` itself (§3) — across six mood/tense
combinations. Half of them (**Baldintza**, **Ondorioa** present, **Ondorioa**
past) get expanded into full NOR-NORK grids just below, where these same
`hura`/`haiek` forms resurface as that grid's two citation-anchored columns —
no need to show them twice over, so they're left out here. The other half —
**Ahalera** (potential) and **Subjuntiboa** — *don't* get that expansion (see
"An unresolved contradiction" below for why), so what follows is their only
home in this file:

| Mood / tense | NORK | NOR = hura | NOR = haiek |
|---|---|---|---|
| **Ahalera** (potential), pres./hypoth. ("might have") | nik | nezake | nitzake |
| | hik | hezake | hitzake |
| | hark | lezake | litzake |
| | guk | genezake | genitzake |
| | zuk | zenezake | zenitzake |
| | zuek | zenezakete | zenitzakete |
| | haiek | lezakete | litzakete |
| **Ahalera**, past ("might have had") | nik | nezakeen | nitzakeen |
| | hik | hezakeen | hitzakeen |
| | hark | zezakeen | zitzakeen |
| | guk | genezakeen | genitzakeen |
| | zuk | zenezakeen | zenitzakeen |
| | zuek | zenezaketen | zenitzaketen |
| | haiek | zezaketen | zitzaketen |
| **Subjuntiboa**, past ("that … had") | nik | nezan | nitzan |
| | hik | hezan | hitzan |
| | hark | zezan | zitzan |
| | guk | genezan | genitzan |
| | zuk | zenezan | zenitzan |
| | zuek | zenezaten | zenitzaten |
| | haiek | zezaten | zitzaten |

### Completing the grid — `NOR` = 1st/2nd person

The citation paradigm above and the "Further moods" table both fix `NOR` at
`hura`/`haiek` ("having *something*") — covering, between them, only the
3rd-person-object slice of the full picture. The *full* paradigm also covers
"*you* have *me*", "*they* had *us*", etc. — `NOR` ranging across all seven
persons, the way the two grids below (Present and Past — the only two tenses
this section covers in full, `NOR`-wise) lay it out. §13's chart
gives this other half as compact row-templates rather than spelled-out words —
the same `[NOR-prefix] + [stem] + [NORK-suffix]` recipe §4 decoded for
NOR-NORI, with the prefix and suffix columns listed independently (any prefix
combines with any suffix; the seven rows just give seven of each side by side
for compactness):

- **Present** — prefixes `na-/ha-/d-/gait-/zait-/zait-…-zte-/dit-` (for
  `ni/hi/hura/gu/zu/zuek/haiek`) + stem `-u-` + suffixes `-t/-k(/-n)/-∅/-gu/
  -zu/-zue/-te` (for `nik/hik/hark/guk/zuk/zuek/haiek`)
- **Past** — prefixes `nind-/hind-/(—)/gint-/zint-/zint-…-zte-/(—)` (no
  `hura`/`haiek` row — those run on the plain-word paradigm above instead) +
  stem `-u-` + suffixes `-da-n/-a-n(/-na-n)/-en/-gu-n/-zu-n/-zue-n/-te-n`

Cross-checking the recipe against cells *already* sourced above confirms it
mechanically — `nind-` + `-u-` + `-en` → `ninduen` (= the existing `hark`→`ni`
cell), `zint-` + `-u-` + `-zu-n` → `zintuzun`… plus one wrinkle worth flagging
explicitly: a plural-object stem (`-it-/-int-`) takes an epenthetic `-z-`
right before the `haiek`-subject suffix `-te(n)` — `dit-u-` + `-te` surfaces
as `dituzte` (not `†ditute`), and `gint-u-` + `-te-n` as `gintuzten` (matching
the existing `haiek`→`gu` cell), not `†ginduten`. That single rule is enough
to derive every `…-te(n)` cell correctly; nothing else in the recipe needed
adjusting once it was applied. Cells below newly derived this way (rather than
copied from an already-sourced cell) are marked 🔍 — plausible, recipe-built,
but not independently attested the way the rest of this file's ✅/📖 forms are.

Two markers cover the impossible cells, and they mean *different* things.
`*(refl.)*` is the reflexive diagonal ("I have me") — and only that diagonal;
`haut`/`hau`/`haugu`/`haute` ("I/he-she/we/they have you-familiar") are
*not* reflexive (two different people are involved) and are confirmed,
ordinary forms below, no 🔍 (an earlier draft wrongly marked `guk`→`hi` as
`(refl.)` by pattern-matching its shape rather than checking the grammar —
see `DECISIONS.md` 2026-06-08 for the correction). `*(hika/zuka)*` is a
different kind of impossibility entirely: `hi` (familiar address — *hika*)
and `zu`/`zuek` (formal/plural address — *zuka*) are mutually exclusive
registers for addressing someone, so no verb form can take one as subject and
the other as object — `hik`↔`zu`/`zuek` cells (including the `hauzu`/`hauzue`
guesses a native speaker confirmed "don't make sense") are marked this way
throughout the five grids below: impossible by grammar, not by sourcing gap.
Plain blanks keep meaning "gap, not a claim the form doesn't exist" — what's
left of those is mostly the `zu`↔`zuek` cross-register cells ("you-singular
have you-all"), a genuinely open sourcing question rather than a grammatical
impossibility the way `hika`/`zuka` is.

#### Present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | haut | dut | *(refl.)* | zaitut | zaituztet | ditut |
| hik *(`-k`/`-n`)* | nauk / naun | *(refl.)* | duk / dun | gaituk / gaitun | *(hika/zuka)* | *(hika/zuka)* | dituk / ditun |
| hark | nau | hau | du | gaitu | zaitu | zaituzte | ditu |
| guk | *(refl.)* | haugu | dugu | *(refl.)* | zaitugu | zaituztegu | ditugu |
| zuk | nauzu | *(hika/zuka)* | duzu | gaituzu | *(refl.)* | *(refl.)* | dituzu |
| zuek | nauzue | *(hika/zuka)* | duzue | gaituzue | *(refl.)* | *(refl.)* | dituzue |
| haiek | naute | haute | dute | gaituzte | zaituzte | zaituzte | dituzte |

#### Past — `NOR` = 1st/2nd person

`zuek`-as-object is left blank throughout (rather than 🔍-guessed): its
present-tense shape pairs the `-zte-` infix straight with a vowel-initial
suffix (`zait-u-zte-t` → `zaituztet`), but every past-tense suffix here is
itself vowel-initial too (`-en`, `-ugu-n`…), and stacking `-zte-` against
*another* vowel risks exactly the kind of contraction/epenthesis surprise the
`dituzte`-vs-`†ditute` wrinkle above already showed this recipe can hide —
better an honest gap than a guess two layers deep. (`hik`→`zuek` is the one
exception: it doesn't need that contraction question answered at all, because
it's `*(hika/zuka)*`-impossible regardless of how the form would otherwise
come out.)

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hindudan | nuen | *(refl.)* | zintudan | 🔍 zintuztedan | nituen |
| hik | ninduan / nindunan | *(refl.)* | huen | gintuan / gintunan | *(hika/zuka)* | *(hika/zuka)* | hituen |
| hark | ninduen | 🔍 hinduen | zuen | gintuen | zintuen | zintuzten | zituen |
| guk | *(refl.)* | *(refl.)* | genuen | *(refl.)* | zintugun | zintuztegun | genituen |
| zuk | ninduzun | *(hika/zuka)* | zenuen | gintuzun | *(refl.)* | *(refl.)* | zenituen |
| zuek | ninduzuen | *(hika/zuka)* | zenuten | gintuzuen | *(refl.)* | *(refl.)* | zenituzten |
| haiek | ninduten | 🔍 hinduten | zuten | gintuzten | zintuzten | zintuzteten | zituzten |

`hituen` (the confirmed `hik`→`haiek` cell above) was newly filled in from
§13 — its plain-word `HURA`/`HAIEK` past-tense lists spell `nuen/huen/zuen/…
/zuten` and `nituen/hituen/zituen/…/zituzten` side by side, and `hituen`
hadn't turned up in any source until now. Note also that `hik`'s row isn't
gender-split in the past the way it is in the present (`huen` only, vs.
`duk`/`dun`) — every source agrees on that, so it's reproduced as-is rather
than "completed" with an invented split; whether that reflects a real
grammatical fact (no past-tense gender marking) or just a shared
simplification across teaching sources is exactly the kind of question a
grammar reference would settle.

A pass against the paradigm-chart PDF (§13) confirmed six more of this grid's
🔍-derived guesses outright — `ninduan/nindunan`, `gintuan/gintunan`,
`zintugun`, `gintuzun`, `gintuzuen`, `ninduzuen` — letting their 🔍 drop, and
supplied three of the four `zuek`-as-object cells the prose above left an
honest gap for: `zintuzten`, `zintuztegun`, `zintuzteten` (`hark/guk/haiek`
→ `zuek`). Each lands exactly where a `-zte-` infix slots into the matching
`zu`-cell (`zintuen`→`zintuzten`, `zintugun`→`zintuztegun`, the `haiek`→`zu`
cell `zintuzten`→`zintuzteten`) — the contraction risk flagged above resolves
cleanly, not unpredictably. The fourth, `nik`→`zuek`, stays 🔍 rather than
joining the other three: that same `-zte-`-insertion rule predicts
`zintuztedan`, not the `zaituztet`-shaped form that arrived alongside the
others — which is, character for character, this very grid's *present-tense*
`nik`→`zuek` cell. Almost certainly a transcription slip rather than a real
present/past homophony, but worth a second look at the source rather than
silently overwriting a clean derivation with a form that breaks its own
pattern; `zintuztedan` is what's recorded here pending that check.

### Baldintza, Ondorioa — completing the grid the same way

Baldintza and both Ondorioa tenses run on the *exact same* `nind-/hind-/
gint-/zint-` prefix series and `-u(-ke)-` stem as the indicative grids just
decoded — Baldintza just adds a `Ba-` protasis prefix and drops the past `-n`
(mirroring `banintz`/`banu` in §1/§2/§3's own citation row), Ondorioa just
inserts `-ke-` before the same suffix families as present/past respectively.
Same cross-checking discipline as above — 🔍 for recipe-derived cells, blank
for `zuek`-as-object (same `-zte-`-meets-a-vowel concern as the past grid; here
it additionally has to clear an inserted `-ke-` first, one more place for a
silent contraction to hide — except `hik`→`zuek`, which is `*(hika/zuka)*`-
impossible regardless of how that contraction question would resolve),
`*(refl.)*` for the impossible-reflexive diagonal, `*(hika/zuka)*` for the
impossible `hi`↔`zu`/`zuek` register-clash cells, and `hura`/`haiek` columns
sourced straight from §13's plain-word citation paradigm — the same
independently-attested anchors "Further moods" above draws its own rows from
(no 🔍 — those *are* the cross-check anchors):

#### Baldintza — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 bahindut | banu | *(refl.)* | 🔍 bazintut | bazintuztet | banitu |
| hik | baninduk / banindun | *(refl.)* | bahu | 🔍 bagintuk / bagintun | *(hika/zuka)* | *(hika/zuka)* | bahitu |
| hark | banindu | 🔍 bahindu | balu | 🔍 bagintu | 🔍 bazintu | bazintuzte | balitu |
| guk | *(refl.)* | *(refl.)* | bagenu | *(refl.)* | 🔍 bazintugu | bazintuztegu | bagenitu |
| zuk | 🔍 baninduzu | *(hika/zuka)* | bazenu | 🔍 bagintuzu | *(refl.)* | *(refl.)* | bazenitu |
| zuek | 🔍 baninduzue | *(hika/zuka)* | bazenute | 🔍 bagintuzue | *(refl.)* | *(refl.)* | bazenituzte |
| haiek | 🔍 banindute | 🔍 bahindute | balute | 🔍 bagintuzte | 🔍 bazintuzte | bazintuztete | balituzte |

The same PDF pass confirmed `banindu` and `baninduk`/`banindun` (`hark`/`hik`
→ `ni`, dropping their 🔍) and supplied all four `zuek`-as-object cells via
the same `-zte-`-insertion rule validated just above: `bazintuztet`,
`bazintuzte`, `bazintuztegu`, `bazintuztete` (`nik/hark/guk/haiek` → `zuek`).
Worth noting `bazintuzte` lands identically for `hark`→`zuek` and
`haiek`→`zu` — the same kind of syncretism the Present grid's `zaituzte`
cells (appearing at `hark`→`zuek`, `haiek`→`zu`, *and* `haiek`→`zuek` all at
once) already showed; not a new wrinkle, just the rule doing what it does.

#### Ondorioa, present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hinduket | nuke | *(refl.)* | 🔍 zintuket | 🔍 zintukeztet | nituzke |
| hik | 🔍 nindukek / ninduken | *(refl.)* | huke | 🔍 gintukek / gintuken | *(hika/zuka)* | *(hika/zuka)* | hituzke |
| hark | 🔍 ninduke | 🔍 hinduke | luke | 🔍 gintuke | 🔍 zintuke | 🔍 zintukezte | lituzke |
| guk | *(refl.)* | *(refl.)* | genuke | *(refl.)* | 🔍 zintukegu | 🔍 zintukeztegu | genituzke |
| zuk | 🔍 nindukezu | *(hika/zuka)* | zenuke | 🔍 gintukezu | *(refl.)* | *(refl.)* | zenituzke |
| zuek | 🔍 nindukezue | *(hika/zuka)* | zenukete | 🔍 gintukezue | *(refl.)* | *(refl.)* | zenituzkete |
| haiek | 🔍 nindukete | 🔍 hindukete | lukete | 🔍 gintukezte | 🔍 zintukezte | 🔍 zintukeztete | lituzkete |

#### Ondorioa, past — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hindukedan | nukeen | *(refl.)* | 🔍 zintukedan | 🔍 zintukeztedan | nituzkeen |
| hik | 🔍 nindukean / nindukenan | *(refl.)* | hukeen | 🔍 gintukean / gintukenan | *(hika/zuka)* | *(hika/zuka)* | hituzkeen |
| hark | 🔍 nindukeen | 🔍 hindukeen | zukeen | 🔍 gintukeen | 🔍 zintukeen | 🔍 zintukezten | zituzkeen |
| guk | *(refl.)* | *(refl.)* | genukeen | *(refl.)* | 🔍 zintukezun | 🔍 zintukeztegun | genituzkeen |
| zuk | 🔍 nindukezun | *(hika/zuka)* | zenukeen | 🔍 gintukezun | *(refl.)* | *(refl.)* | zenituzkeen |
| zuek | 🔍 nindukezuen | *(hika/zuka)* | zenuketen | 🔍 gintukezuen | *(refl.)* | *(refl.)* | zenituzketen |
| haiek | 🔍 ninduketen | 🔍 hinduketen | zuketen | 🔍 gintukezten | 🔍 zintukezten | 🔍 zintukezteten | zituzketen |

The existing `haiek`→`zu` cell `zintukezte` (Ondorioa-present, just above)
actually does settle the ordering question: it shows `-zte-` (the `haiek`-NORK
plural marker) sitting *after* `-ke-`, not before it. Since both the
object-plural (`NOR`=`zuek`) and subject-plural (`NORK`=`haiek`) `-zte-`
markers follow the same morphological template, the `NOR`=`zuek` one lands
there too — `zint-u-ke-zte-[suffix]` — giving the 🔍-derived cells filled
into both grids above. For `haiek`/`zuek` cells specifically, the same
`bazintuztete` pattern from Baldintza applies: the `NORK`=`haiek` marker
falls back to the shorter `-te` (rather than `-zte-`) when the NOR-marking
`-zte-` is already present, so the form ends in `-zte-te(-n)` rather than
`-zte-zte(-n)`.

### Ahalera — Orainaldia, Alegiazkoa, Lehenaldia: a tense split, not a contradiction

§13's `NOR` = 1st/2nd-person templates for these two moods:

| Mood / tense | Prefix series (`ni/hi/hura/gu/zu/zuek/haiek`) | Stem + markers | Suffix series (`nik/hik/hark/guk/zuk/zuek/haiek`) |
|---|---|---|---|
| Ahalera, present | `na-/ha-/De-/gait-/zait-/zait-…-te-/dit-` | `-zake-` | `-t/-k(/-n)/-∅/-gu/-zu/-zue/-te` |
| Ahalera, past | `nint-/hint-/(—)/gint-/zint-/zint-…-te-/(—)` | `-zake-` | `-da-n/-a(/na)-n/-en/-gu-n/-zu-n/-zue-n/-te-n` |
| Subjuntiboa, present | `na-/ha-/De-/gait-/zait-/zait-…-te-/dit-` | `-za-` | `-da-n/-a(/na)-n/-∅-n/-gu-n/-zu-n/-zue-n/-te-n` |

A previous revision of this document treated the `na-/De-/gait-/zait-/dit-`-
prefix template above as a *mistake* — a recipe carried over from the wrong
paradigm — because it predicts `dezaket` for `nik`/`hura`, while the citation
cells for that same row (`nezake`, `lezake`, `genezake`, …) clearly follow the
*mirror-image* `*ezan`-suppletive pattern (`NORK`-prefix, `NOR`-stem). Both
observations were correct, but the conclusion was wrong: **a user-supplied
reference table (below) shows both patterns are real — they're just different
tenses.** `Orainaldia` (present, "I *can* do it") uses the `na-/De-/gait-/
zait-/dit-`-prefix template after all (`dezaket`, `nazake`, `gaitzake`,
`zaitzaket`, `ditzaket`, …) — `NOR`-marked by prefix, `NORK`-marked by suffix,
exactly like indicative `ukan` (§3). `Alegiazkoa` (hypothetical, "I
*could/would be able to* do it") and `Lehenaldia` (past, "I *could have*
done it") use the `*ezan`-mirrored pattern instead (`nezake`/`nezakeen`,
`lezake`/`zezakeen`, …) — `NORK`-marked by prefix, `NOR`-stem-internal. The
"contradiction" was real cells from two different tenses sitting in the same
row of an over-general abstract template.

The new table also settles the `NOR` = 1st/2nd person question this document
previously marked `❓`: those forms **do exist**, for all three tenses
(`nazake`, `gaitzake`, `zaitzaket`, `nintzake`, `zintzakedan`, …). The only
genuine remaining gap is `hi` (as either `NOR` or `NORK`), which the new
source omits entirely as an allocutive-register simplification — consistent
with `hi`'s patchy coverage everywhere else in this document.

**A new pattern, broader than the old `*(refl.)*` diagonal**: the new source
marks a cell impossible whenever `NOR` and `NORK` belong to the *same person
category* — 1st (`ni`/`gu`) on 1st (`nik`/`guk`), or 2nd (`zu`/`zuek`) on 2nd
(`zuk`/`zuek`) — regardless of whether the *numbers* match. So not just
`nik`→`ni` and `guk`→`gu` (the strict diagonal, "I/we [verb] myself/
ourselves"), but also `guk`→`ni` ("we [verb] me" — I'm one of the "we") and
`nik`→`gu` ("I [verb] us" — same overlap, other direction), and likewise
`zuk`↔`zuek` both ways. All eight such cells are marked `*(refl.)*` below,
extending the marker's existing meaning from the literal `NOR=NORK` diagonal
to this whole same-person-category block.

#### Ahalera, Orainaldia (Present) — "I can…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | ❓ | dezaket | *(refl.)* | zaitzaket | zaitzaketet | ditzaket |
| hik | ❓ | *(refl.)* | dezakek 🔍 / dezaken 🔍 | ❓ | *(hika/zuka)* | *(hika/zuka)* | ditzakek 🔍 / ditzaken 🔍 |
| hark | nazake | ❓ | dezake | gaitzake | zaitzake | zaitzakete | ditzake |
| guk | *(refl.)* | ❓ | dezakegu | *(refl.)* | zaitzakegu | zaitzaketegu | ditzakegu |
| zuk | nazakezu | *(hika/zuka)* | dezakezu | gaitzakezu | *(refl.)* | *(refl.)* | ditzakezu |
| zuek | nazakezue | *(hika/zuka)* | dezakezue | gaitzakezue | *(refl.)* | *(refl.)* | ditzakezue |
| haiek | nazakete | ❓ | dezakete | gaitzakete | zaitzakete | zaitzakete(te) | ditzakete |

`hik`'s `hura`/`haiek` cells are 🔍 — derived by swapping `nik`'s `-t` suffix
for `hik`'s usual `-k`(masc.)/`-n`(fem.) (the same `K`/`N` alternation used
throughout this document), since the new source omits `hik` entirely. The
remaining `hi`-column and `hik`-row `❓`s are the genuine gap noted above.
`zaitzakete(te)` (`haiek`→`zuek`) is reproduced verbatim, parentheses
included — read as the source itself flagging an optional/uncertain extra
`-te`, the same kind of doubled `-te`/`-zte` territory §3's `zuek`-as-object
cells already sit in.

#### Ahalera, Alegiazkoa (Hypothetical) — "I would be able to…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | ❓ | nezake | *(refl.)* | zintzaket | zintzaketet | nitzake |
| hik | ❓ | *(refl.)* | hezake | ❓ | *(hika/zuka)* | *(hika/zuka)* | hitzake |
| hark | nintzake | ❓ | lezake | gintzake | zintzake | zintzakete | litzake |
| guk | *(refl.)* | ❓ | genezake | *(refl.)* | zintzakegu | zintzaketegu | genitzake |
| zuk | nintzakezu | *(hika/zuka)* | zenezake | gintzakezu | *(refl.)* | *(refl.)* | zenitzake |
| zuek | nintzakezue | *(hika/zuka)* | zenezakete | gintzakezue | *(refl.)* | *(refl.)* | zenitzakete |
| haiek | nintzakete | ❓ | lezakete | gintzakete | zintzakete | zintzakete(te) | litzakete |

#### Ahalera, Lehenaldia (Past) — "I could have… / was able to…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | ❓ | nezakeen | *(refl.)* | zintzakedan | zintzaketedan | nitzakeen |
| hik | ❓ | *(refl.)* | hezakeen | ❓ | *(hika/zuka)* | *(hika/zuka)* | hitzakeen |
| hark | nintzakeen | ❓ | zezakeen | gintzakeen | zintzakeen | zintzaketen | zitzakeen |
| guk | *(refl.)* | ❓ | genezakeen | *(refl.)* | zintzakegun | zintzaketegun | genitzakeen |
| zuk | nintzakezun | *(hika/zuka)* | zenezakeen | gintzakezun | *(refl.)* | *(refl.)* | zenitzakeen |
| zuek | nintzakezuen | *(hika/zuka)* | zenezaketen | gintzakezuen | *(refl.)* | *(refl.)* | zenitzaketen |
| haiek | nintzaketen | ❓ | zezaketen | gintzaketen | zintzaketen | zintzakete(te)n | zitzaketen |

The `hark`/`haiek` columns in both grids above match this document's
pre-existing citations exactly (`nezake`/`nitzake`, `lezake`/`litzake`,
`zezakeen`/`zitzakeen`, …) — the new source corroborates the earlier
derivation and the earlier derivation corroborates the new source, in the
same pass.

#### Subjuntiboa, Orainaldia (Present) — "...so that [NORK] may [verb] [NOR]"

*Adibidez:* `Ez dut nahi hark ni ikus nazan` ("I don't want him to see me");
`Ateak ireki ditut nik haiek ikus ditzadan` ("I opened the doors so that I
may see them").

A new user-supplied table gives the *full* `hi` picture for Subjuntiboa,
including the `hika` masc./fem. split that's been a gap everywhere else in
this document. Two things fall out immediately: (1) `hi`-as-`NOR` (the
`hi (M)`/`hi (F)` rows in the source) is **gender-invariant** — both rows
give identical forms, so the `hi` *column* below needs no masc./fem. split;
(2) `hi`-as-`NORK` (the `hik (M)`/`hik (F)` columns) *does* split, via an
`-a-`/`-na-` insertion — `dezaan`/`dezanan`, `nazaan`/`nazanan`, etc. — so the
`hik` *row* below carries both forms per cell, same `*(masc.)* / *(fem.)*`
notation §4 uses.

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hazadan | dezadan | *(refl.)* | zaitzadan | zaitzatedan | ditzadan |
| hik | nazaan *(masc.)* / nazanan *(fem.)* | *(refl.)* | dezaan *(masc.)* / dezanan *(fem.)* | gaitzaan *(masc.)* / gaitzanan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | ditzaan *(masc.)* / ditzanan *(fem.)* |
| hark | nazan | hazan | dezan | gaitzan | zaitzan | zaitzaten | ditzan |
| guk | *(refl.)* | hazagun | dezagun | *(refl.)* | zaitzagun | zaitzategun | ditzagun |
| zuk | nazazun | *(hika/zuka)* | dezazun | gaitzazun | *(refl.)* | *(refl.)* | ditzazun |
| zuek | nazazuen | *(hika/zuka)* | dezazuen | gaitzazuen | *(refl.)* | *(refl.)* | ditzazuen |
| haiek | nazaten | hazaten | dezaten | gaitzaten | zaitzaten | zaitzate(te)n | ditzaten |

Fully populated, no `❓` left — the `de-/dit-`-stem `hura`/`haiek` columns
match the `-za-` + `-da-n/-∅-n/-gu-n/-zu-n/-zue-n/-te-n` suffix series §13
already predicted (`dezadan`, `dezan`, `dezagun`, …), and the same
same-person-category `*(refl.)*` block and `*(hika/zuka)*` cells from the
Ahalera grids reappear here unchanged.

#### Subjuntiboa, Lehenaldia (Past) — "...so that [NORK] could/might have [verb]ed [NOR]"

*Adibidez:* `Gurasoek dirua eman zidaten nik gozokiak eros nitzan` ("My
parents gave me money so that I could buy candies").

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hintzadan | nezan | *(refl.)* | zintzadan | zintzatedan | nitzan |
| hik | nintzaan *(masc.)* / nintzanan *(fem.)* | *(refl.)* | hezan | gintzaan *(masc.)* / gintzanan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | hitzan |
| hark | nintzan | hintzan | zezan | gintzan | zintzan | zintzaten | zitzan |
| guk | *(refl.)* | hintzagun | genezan | *(refl.)* | zintzagun | zintzategun | genitzan |
| zuk | nintzazun | *(hika/zuka)* | zenezan | gintzazun | *(refl.)* | *(refl.)* | zenitzan |
| zuek | nintzazuen | *(hika/zuka)* | zenezaten | gintzazuen | *(refl.)* | *(refl.)* | zenitzaten |
| haiek | nintzaten | hintzaten | zezaten | gintzaten | zintzaten | zintzate(te)n | zitzaten |

Also fully populated. The `hura`/`haiek` columns (`nezan`/`nitzan`,
`zezan`/`zitzan`, `genezan`/`genitzan`, `zenezan`/`zenitzan`,
`zenezaten`/`zenitzaten`, `zezaten`/`zitzaten`) match this document's
pre-existing citations exactly — the new source corroborates them, and they
corroborate the new source. One detail worth flagging: `hik`/`hura`
(`hezan`) is the *same form for both masc. and fem.* — unlike every other
`hik`-row cell in either grid, which all split via `-a-`/`-na-`. Reproduced
as given rather than "corrected" to a guessed `*hezaan`/`*hezanan`, since
nothing here confirms which (if either) is right.

With this, both Subjuntiboa grids and all three Ahalera grids (Orainaldia/
Alegiazkoa/Lehenaldia) are now fully populated for every `NOR`/`NORK`
combination *except* Ahalera's `hi`-column gaps (`nik/hi`, `hark/hi`,
`guk/hi`, `haiek/hi`, plus `hik`'s `ni`/`gu` columns) — those remain `❓`
since the Ahalera source omitted `hi` outright and this Subjuntiboa data,
while suggestive, belongs to a different stem/suffix system and isn't a
safe basis for cross-paradigm extrapolation.

The **imperative**'s `NOR-NORK` cells are, by contrast, barely populated in
§13 at all (mostly `()` placeholders) — consistent with Basque imperatives
being largely restricted to absolutive-marking commands (`zaitez`, `bitez`,
…). Nothing substantial to expand there either.

## 4. `izan` with dative — NOR-NORI system · 📖

Used with intransitive verbs that take an indirect object — `gustatu`,
`iruditu`, etc. (`VERB_COVERAGE.md` §2 covers why this pattern usually rides
on `izan`'s own auxiliary paradigm rather than a standalone lexical verb).
Laid out as a grid (`NORI` rows × `NOR` columns) — and, like §3's `ukan`
grid, the *full* picture varies `NOR` across all seven persons, not just
`hura`/`haiek`. The citation slice most relevant to `gustatu`-class verbs
("it pleases me", "they please me" — `NOR` is the 3rd-person stimulus) sits
in the `hura`/`haiek` columns; the rest of the grid is this *same* auxiliary
wearing its other hat — "I am to him" (`natzaio`, cited in
`VERB_COVERAGE.md` §2 as the synthetic engine behind e.g. `jarraitzen
natzaio`, "I follow him") and its kin across all persons.

§13's compact NOR-NORI row-template spells out, mechanically, how to build
*any* cell: `[NOR person's prefix + stem(+zki if plural)] + [NORI person's
suffix] (+ -n in the past)` — e.g. present `Zai|O` (hura-stem `zai-` +
hari-suffix `-o`) → `zaio`, or `NA tzai|O` (ni-stem `na-tzai-` + hari-suffix
`-o`) → `natzaio`. Three regularities fall straight out of that formula, and
all three are corroborated by patterns this document already relies on
elsewhere:

- **`-zki-` marks a plural `NOR`** — not just for `haiek` (the only plural
  option visible in the old 2-column framing) but for `gu`/`zuek` too
  (`gatzaizkio`, `zatzaizkio`, …) — the same infix §3's grid and §8 already
  use for plural absolutive arguments generally. `zu`, despite being the
  person that triggers a *different* kind of plural-marking elsewhere (the
  `ukan` system's "etiquette plural" `-it-` in `zaitut`, §3), sits this one
  out entirely — it keeps the bare `za-tzai-` shape (`zatzait` = za- +
  -tzai- + -t, no `-zki-`), in contrast with genuinely-plural `zuek`'s
  `zatzaizkit`.
- **The `K/N` ↔ `A/NA` mirroring** — the masc./fem. split tied to a `hi`
  argument — surfaces in the `NORI = hiri` row in exactly the present ↔ past
  pairing already named for §3: `zaik`/`zain` (present) ↔ `zitzaian`/
  `zitzainan` (past). §13's own template spells out `A/NA` for this row,
  *independently corroborating* the 🔍-flagged guess this document made for
  that very form just one revision ago — nice to see a guess confirmed.
- **Reflexive gaps** sit on the same kind of diagonal §3 leaves blank — `ni`-
  to-`niri`, `hi`-to-`hiri`, `gu`-to-`guri`, `zu`-to-`zuri`, `zuek`-to-`zuei`
  ("I am to myself", …) — marked `*(refl.)*` rather than invented. (`hura`-
  to-`hari` and `haiek`-to-`haiei` *aren't* reflexive gaps — "it"/"they" are
  open referential slots that can differ from their dative counterpart, hence
  `zaio`/`zaizkie` are perfectly ordinary attested forms.)
- **`hi`↔`zu`/`zuek` cells are `*(hika/zuka)*`** — the *same* register-clash
  §3 already flags (a single verb form can't take one of *hika*'s `hi` and
  *zuka*'s `zu`/`zuek` as one argument and the other as its second), just
  showing up here in the dative slot instead of the absolutive/ergative one:
  `hiri`'s `zu`/`zuek` columns ("you/you-all are to him-familiar") and the
  mirror-image `zuri`/`zuei` rows' `hi` column ("he-familiar is to you/
  you-all") are impossible by grammar for that reason, not left blank for
  lack of a source — the kind of nonsensical combination
  (`zuek`-to-`hiri` would land on a `zatzaizkik`/`zatzaizkin`-type form) a
  native speaker flagged when reviewing this grid.

**Note: `zu` ≠ `zuek` here**, unlike in `ukan`'s "etiquette plural" (§3's
`zaitut`-type forms, where `zu` itself triggers `-it-`). In *this* NOR-NORI
paradigm `zu` keeps the bare `za-tzai-` shape with no `-zki-` (`zatzait` =
za- + -tzai- + -t), while `zuek` — genuinely plural — takes `-zki-` exactly
like `gu`/`haiek` (`zatzaizkit`); no `-te` enters the picture. The reflexive
diagonal follows suit: `zu`-to-`zuri` is `*(refl.)*` over the bare shape
(`zatzaizu`), `zuek`-to-`zuei` over the `-zki-` shape (`zatzaizkizue`) — so
`zuek` needs no separate sourcing, it's as mechanically derivable as any
other plural `NOR` slot.

### Present

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hatzait | zait | gatzaizkit | zatzait | zatzaizkit | zaizkit |
| hiri | natzaik *(masc.)* / natzain *(fem.)* | *(refl.)* | zaik *(masc.)* / zain *(fem.)* | gatzaizkik *(masc.)* / gatzaizkin *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | zaizkik *(masc.)* / zaizkin *(fem.)* |
| hari | natzaio | hatzaio | zaio | gatzaizkio | zatzaio | zatzaizkio | zaizkio |
| guri | natzaigu | hatzaigu | zaigu | *(refl.)* | zatzaigu | zatzaizkigu | zaizkigu |
| zuri | natzaizu | *(hika/zuka)* | zaizu | gatzaizkizu | *(refl.)* | zatzaizkizu | zaizkizu |
| zuei | natzaizue | *(hika/zuka)* | zaizue | gatzaizkizue | zatzaizue | *(refl.)* | zaizkizue |
| haiei | natzaie | hatzaie | zaie | gatzaizkie | zatzaie | zatzaizkie | zaizkie |

### Past

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hintzaidan | zitzaidan | gintzaizkidan | zintzaidan | zintzaizkidan | zitzaizkidan |
| hiri | nintzaian *(masc.)* / nintzainan *(fem.)* | *(refl.)* | zitzaian *(masc.)* / zitzainan *(fem.)* | gintzaizkian *(masc.)* / gintzaizkinan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | zitzaizkian *(masc.)* / zitzaizkinan *(fem.)* |
| hari | nintzaion | hintzaion | zitzaion | gintzaizkion | zintzaion | zintzaizkion | zitzaizkion |
| guri | nintzaigun | hintzaigun | zitzaigun | *(refl.)* | zintzaigun | zintzaizkigun | zitzaizkigun |
| zuri | nintzaizun | *(hika/zuka)* | zitzaizun | gintzaizkizun | *(refl.)* | zintzaizkizun | zitzaizkizun |
| zuei | nintzaizuen | *(hika/zuka)* | zitzaizuen | gintzaizkizuen | zintzaizuen | *(refl.)* | zitzaizkizuen |
| haiei | nintzaien | hintzaien | zitzaien | gintzaizkien | zintzaien | zintzaizkien | zitzaizkien |

### Baldintza — "if I were to him…" (protasis)

§13 spells this mood out as a *third* NOR-NORI row-template, prefixed `Ba-`
on top of a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/`zin-`/`li-` series (compare
`banintz`/`bahintz`/`balitz`/… in §1/§2 — the familiar conditional prefix,
just riding the dative-marked `tzai` stem instead of `izan`'s own one) and
closing with the *same* `NORI` suffixes as the present grid (no past `-n`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | bahintzait | balitzait | bagintzaizkit | bazintzait | bazintzaizkit | balitzaizkit |
| hiri | banintzaik *(masc.)* / banintzain *(fem.)* | *(refl.)* | balitzaik *(masc.)* / balitzain *(fem.)* | bagintzaizkik *(masc.)* / bagintzaizkin *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | balitzaizkik *(masc.)* / balitzaizkin *(fem.)* |
| hari | banintzaio | bahintzaio | balitzaio | bagintzaizkio | bazintzaio | bazintzaizkio | balitzaizkio |
| guri | banintzaigu | bahintzaigu | balitzaigu | *(refl.)* | bazintzaigu | bazintzaizkigu | balitzaizkigu |
| zuri | banintzaizu | *(hika/zuka)* | balitzaizu | bagintzaizkizu | *(refl.)* | bazintzaizkizu | balitzaizkizu |
| zuei | banintzaizue | *(hika/zuka)* | balitzaizue | bagintzaizkizue | bazintzaizue | *(refl.)* | balitzaizkizue |
| haiei | banintzaie | bahintzaie | balitzaie | bagintzaizkie | bazintzaie | bazintzaizkie | balitzaizkie |

Same formula and same `*(refl.)*` diagonal as the indicative grids above —
this section's `NOR` template just swaps in the `Ba-…` prefix series and
drops the past tense's trailing `-n`. Worth noting this fills a kind of
gap §12 and `VERB_COVERAGE.md` §3b both leave open in their own way — they
sketch `izan`'s baldintza with bare example forms (`banintz`, `banu`, …)
rather than full paradigms; this grid is the dative-marked half of exactly
that picture, laid out in full — for whatever a mechanically-generated table
is worth standing next to genuinely-cited ones.

The remaining eight grids below run the *exact same* mechanical recipe —
[NOR person's prefix + stem(+`-zki-` if plural)] + [NORI person's suffix]
(+ tense/mood markers like `-n`, `-ke`, `-en`) — across the rest of `izan`'s
mood/tense system, mirroring §2's full coverage of the plain (non-dative)
paradigm. `Ondorioa` keeps the `tzai` stem (like the indicative/baldintza
grids above); `potentziala`, `subjuntiboa`, and `inperatiboa` swap in the
bare `ki` stem instead (still `+-zki-` for plural `NOR`) — the same stem
`naiteke`/`dadin`/`bedi` ride in §2's plain paradigm, just dative-marked
here.

### Ondorioa — Present

§13's row-template for this mood runs on a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/
`zin-`/`li-` NOR-prefix series — note `hura`/`haiek` take an overt `li-` here,
unlike present-tense `zai-`'s prefix-less allomorph — riding the `tzai` stem,
closed off with a `-ke`-suffixed NORI series (`-dake`/`-ake`/`-nake`/`-oke`/
`-guke`/`-zuke`/`-zuekete`/`-eke`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hintzaidake | litzaidake | gintzaizkidake | zintzaidake | zintzaizkidake | litzaizkidake |
| hiri | nintzaiake *(masc.)* / nintzainake *(fem.)* | *(refl.)* | litzaiake *(masc.)* / litzainake *(fem.)* | gintzaizkiake *(masc.)* / gintzaizkinake *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | litzaizkiake *(masc.)* / litzaizkinake *(fem.)* |
| hari | nintzaioke | hintzaioke | litzaioke | gintzaizkioke | zintzaioke | zintzaizkioke | litzaizkioke |
| guri | nintzaiguke | hintzaiguke | litzaiguke | *(refl.)* | zintzaiguke | zintzaizkiguke | litzaizkiguke |
| zuri | nintzaizuke | *(hika/zuka)* | litzaizuke | gintzaizkizuke | *(refl.)* | zintzaizkizuke | litzaizkizuke |
| zuei | nintzaizuekete | *(hika/zuka)* | litzaizuekete | gintzaizkizuekete | zintzaizuekete | *(refl.)* | litzaizkizuekete |
| haiei | nintzaieke | hintzaieke | litzaieke | gintzaizkieke | zintzaieke | zintzaizkieke | litzaizkieke |

### Ondorioa — Past

Same `-ke(+-en)` NORI-suffix family as above — now with the trailing `-en`
that marks past throughout this mood, `zuei` taking `-eketen` — but a
*different* `hura`/`haiek` prefix: `zi-`, not `li-` (compare past-tense
`zitzaio`'s own `zi-`), over an otherwise identical `nin-`/`hin-`/`zi-`/
`gin-`/`zin-`/`zin-`/`zi-` series:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hintzaidakeen | zitzaidakeen | gintzaizkidakeen | zintzaidakeen | zintzaizkidakeen | zitzaizkidakeen |
| hiri | nintzaiakeen *(masc.)* / nintzainakeen *(fem.)* | *(refl.)* | zitzaiakeen *(masc.)* / zitzainakeen *(fem.)* | gintzaizkiakeen *(masc.)* / gintzaizkinakeen *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | zitzaizkiakeen *(masc.)* / zitzaizkinakeen *(fem.)* |
| hari | nintzaiokeen | hintzaiokeen | zitzaiokeen | gintzaizkiokeen | zintzaiokeen | zintzaizkiokeen | zitzaizkiokeen |
| guri | nintzaigukeen | hintzaigukeen | zitzaigukeen | *(refl.)* | zintzaigukeen | zintzaizkigukeen | zitzaizkigukeen |
| zuri | nintzaizukeen | *(hika/zuka)* | zitzaizukeen | gintzaizkizukeen | *(refl.)* | zintzaizkizukeen | zitzaizkizukeen |
| zuei | nintzaizueketen | *(hika/zuka)* | zitzaizueketen | gintzaizkizueketen | zintzaizueketen | *(refl.)* | zitzaizkizueketen |
| haiei | nintzaiekeen | hintzaiekeen | zitzaiekeen | gintzaizkiekeen | zintzaiekeen | zintzaizkiekeen | zitzaizkiekeen |

### Potentziala — Present (ahalera)

Potentziala swaps the `tzai` stem for the bare `ki` stem (still `+-zki-` for
plural `NOR`, per the regularity above) riding `na-`/`ha-`/`da-`/`ga-`/`za-`/
`za-`/`da-` — the same prefix shape §2's plain `naiteke`/`gaitezke` paradigm
uses — closed with the same `-ke` NORI-suffix family as Ondorioa-Present:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hakidake | dakidake | gakizkidake | zakidake | zakizkidake | dakizkidake |
| hiri | nakiake *(masc.)* / nakinake *(fem.)* | *(refl.)* | dakiake *(masc.)* / dakinake *(fem.)* | gakizkiake *(masc.)* / gakizkinake *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | dakizkiake *(masc.)* / dakizkinake *(fem.)* |
| hari | nakioke | hakioke | dakioke | gakizkioke | zakioke | zakizkioke | dakizkioke |
| guri | nakiguke | hakiguke | dakiguke | *(refl.)* | zakiguke | zakizkiguke | dakizkiguke |
| zuri | nakizuke | *(hika/zuka)* | dakizuke | gakizkizuke | *(refl.)* | zakizkizuke | dakizkizuke |
| zuei | nakizuekete | *(hika/zuka)* | dakizuekete | gakizkizuekete | zakizuekete | *(refl.)* | dakizkizuekete |
| haiei | nakieke | hakieke | dakieke | gakizkieke | zakieke | zakizkieke | dakizkieke |

### Potentziala — Past

Past and hypothetical both swap in a `ne-`-flavoured prefix series (`nen-`/
`hen-`/…/`gen-`/`zen-`/`zen-`/…); past takes `ze-` for `hura`/`haiek`
(paralleling `zekion`-type forms) and the trailing `-en` on the `-ke` suffix
family:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidakeen | zekidakeen | genkizkidakeen | zenkidakeen | zenkizkidakeen | zekizkidakeen |
| hiri | nenkiakeen *(masc.)* / nenkinakeen *(fem.)* | *(refl.)* | zekiakeen *(masc.)* / zekinakeen *(fem.)* | genkizkiakeen *(masc.)* / genkizkinakeen *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | zekizkiakeen *(masc.)* / zekizkinakeen *(fem.)* |
| hari | nenkiokeen | henkiokeen | zekiokeen | genkizkiokeen | zenkiokeen | zenkizkiokeen | zekizkiokeen |
| guri | nenkigukeen | henkigukeen | zekigukeen | *(refl.)* | zenkigukeen | zenkizkigukeen | zekizkigukeen |
| zuri | nenkizukeen | *(hika/zuka)* | zekizukeen | genkizkizukeen | *(refl.)* | zenkizkizukeen | zekizkizukeen |
| zuei | nenkizueketen | *(hika/zuka)* | zekizueketen | genkizkizueketen | zenkizueketen | *(refl.)* | zekizkizueketen |
| haiei | nenkiekeen | henkiekeen | zekiekeen | genkizkiekeen | zenkiekeen | zenkizkiekeen | zekizkiekeen |

### Potentziala — Hypothetical

…while the hypothetical takes `le-` for `hura`/`haiek` instead (paralleling
`liteke`'s own `li-`/`le-` alternation in §2) and drops the trailing `-en`,
landing back on the bare `-ke` suffix family:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidake | lekidake | genkizkidake | zenkidake | zenkizkidake | lekizkidake |
| hiri | nenkiake *(masc.)* / nenkinake *(fem.)* | *(refl.)* | lekiake *(masc.)* / lekinake *(fem.)* | genkizkiake *(masc.)* / genkizkinake *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | lekizkiake *(masc.)* / lekizkinake *(fem.)* |
| hari | nenkioke | henkioke | lekioke | genkizkioke | zenkioke | zenkizkioke | lekizkioke |
| guri | nenkiguke | henkiguke | lekiguke | *(refl.)* | zenkiguke | zenkizkiguke | lekizkiguke |
| zuri | nenkizuke | *(hika/zuka)* | lekizuke | genkizkizuke | *(refl.)* | zenkizkizuke | lekizkizuke |
| zuei | nenkizuekete | *(hika/zuka)* | lekizuekete | genkizkizuekete | zenkizuekete | *(refl.)* | lekizkizuekete |
| haiei | nenkieke | henkieke | lekieke | genkizkieke | zenkieke | zenkizkieke | lekizkieke |

### Subjuntiboa — Present

Subjuntiboa rides the same `ki`/`-zki-` stem as Potentziala. The present uses
the *same* `na-`/`ha-`/`da-`/… prefix series as Potentziala-Present, but
closes with a bare `-n` NORI-suffix family instead of `-ke` (`-dan`/`-an`/
`-nan`/`-on`/`-gun`/`-zun`/`-zueten`/`-en` — `zuei` alone taking the extra
`-te`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hakidan | dakidan | gakizkidan | zakidan | zakizkidan | dakizkidan |
| hiri | nakian *(masc.)* / nakinan *(fem.)* | *(refl.)* | dakian *(masc.)* / dakinan *(fem.)* | gakizkian *(masc.)* / gakizkinan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | dakizkian *(masc.)* / dakizkinan *(fem.)* |
| hari | nakion | hakion | dakion | gakizkion | zakion | zakizkion | dakizkion |
| guri | nakigun | hakigun | dakigun | *(refl.)* | zakigun | zakizkigun | dakizkigun |
| zuri | nakizun | *(hika/zuka)* | dakizun | gakizkizun | *(refl.)* | zakizkizun | dakizkizun |
| zuei | nakizueten | *(hika/zuka)* | dakizueten | gakizkizueten | zakizueten | *(refl.)* | dakizkizueten |
| haiei | nakien | hakien | dakien | gakizkien | zakien | zakizkien | dakizkien |

### Subjuntiboa — Past

The mood/tense distinction lives entirely in the prefix here: past swaps in
the `ne-`-flavoured series (`nen-`/`hen-`/`ze-`/`gen-`/`zen-`/`zen-`/`ze-`)
over the *exact same* `-n` suffix family as the present:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidan | zekidan | genkizkidan | zenkidan | zenkizkidan | zekizkidan |
| hiri | nenkian *(masc.)* / nenkinan *(fem.)* | *(refl.)* | zekian *(masc.)* / zekinan *(fem.)* | genkizkian *(masc.)* / genkizkinan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | zekizkian *(masc.)* / zekizkinan *(fem.)* |
| hari | nenkion | henkion | zekion | genkizkion | zenkion | zenkizkion | zekizkion |
| guri | nenkigun | henkigun | zekigun | *(refl.)* | zenkigun | zenkizkigun | zekizkigun |
| zuri | nenkizun | *(hika/zuka)* | zekizun | genkizkizun | *(refl.)* | zenkizkizun | zekizkizun |
| zuei | nenkizueten | *(hika/zuka)* | zekizueten | genkizkizueten | zenkizueten | *(refl.)* | zekizkizueten |
| haiei | nenkien | henkien | zekien | genkizkien | zenkien | zenkizkien | zekizkien |

### Inperatiboa (imperative)

Like `izan`'s own imperative (§2's Agintera) and every Basque imperative
(§9), this is second/third-person only — no commanding yourself or "it" —
hence the `—` gaps filling the entire `ni`/`gu` columns. The `be-`-prefixed
`hura`/`haiek` cells are *jussive* ("let it be to me", "let them be to
him/her") rather than literal commands, mirroring `izan`'s own `bedi`/
`bitez`; the rest (`ha-`/`za-`/`za-`/`be-` over the bare present-style suffix
family, no trailing `-n`) is the same formula run one more time:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | — | hakit | bekit | — | zakit | zakizkit | bekizkit |
| hiri | — | *(refl.)* | bekik *(masc.)* / bekin *(fem.)* | — | *(hika/zuka)* | *(hika/zuka)* | bekizkik *(masc.)* / bekizkin *(fem.)* |
| hari | — | hakio | bekio | — | zakio | zakizkio | bekizkio |
| guri | — | hakigu | bekigu | — | zakigu | zakizkigu | bekizkigu |
| zuri | — | *(hika/zuka)* | bekizu | — | *(refl.)* | zakizkizu | bekizkizu |
| zuei | — | *(hika/zuka)* | bekizue | — | zakizue | *(refl.)* | bekizkizue |
| haiei | — | hakie | bekie | — | zakie | zakizkie | bekizkie |

**On confidence:** every cell outside the original `hura`/`haiek` columns
(plus the `hiri`-row masc./fem. split, already covered above) is *generated*
by the formula at the top of this section rather than individually attested
— treat it as 📖-via-systematic-derivation from §13's template, not
📖-via-citation from a dictionary entry. Basque's verb agreement is regular
enough that this is a fairly low-risk way to fill out a paradigm — it's the
same kind of move the `-zki-` and `K/N`↔`A/NA` regularities above already
licensed, just applied across the *whole* grid instead of one column/row —
but it *is* derivation, not citation, and worth flagging as such for anyone
cross-checking against a source that only lists citation forms.

One wrinkle is sharper for the eight `ondorioa`/`potentziala`/`subjuntiboa`/
`inperatiboa` grids just above than for the present/past/baldintza trio:
those three have independently-citable `gustatu`-class anchors in their
`hura`/`haiek` columns (`zait`, `zaio`, `zitzaion`, …) that the rest of each
grid was filled in *around* — a built-in cross-check the formula had to
reproduce before being trusted with the rest. The eight grids above have no
such anchor; this dative paradigm simply isn't where citation dictionaries
go looking for `ondorioa`/`potentziala`/`subjuntiboa`/`inperatiboa` forms, so
*every* cell — `hura`/`haiek` columns fully included — comes straight out of
§13's row-templates with nothing independently attested to validate against.
Same derivation method, just running with no safety net; worth knowing if
you're weighing how much to lean on any one form from these eight.

## 5. `ukan` with dative — NOR-NORI-NORK system · 📖

Used with ditransitive verbs — `eman` ("to give"), `esan` ("to say"), etc.
(`VERB_COVERAGE.md` §2/§4b). Like §4's NOR-NORI grid, the *full* picture has
three dimensions (`NOR`/`NORI`/`NORK`); flattened here into a `NORI`
(indirect object, rows) × `NORK` (subject, columns) grid per `NOR` value —
the same kind of slicing §4 used. The `hari` row's `zuk`/`zuek` columns below
come from §14's `esan` paradigm, which happens to be exactly this grid's
`hari` row (NOR=hura, NORI=hari, NORK varying — the classic ditransitive
citation form).

Two `NOR` values are covered below: `hura` (singular object — "give *it*…")
and `haiek` (plural object — "give *them*…", via §4's `-zki-` infix). These
cover the ditransitive forms that see everyday use; `NOR` = 1st/2nd person
("he gives *me* to him") is a real corner of the paradigm but vanishingly
rare and not attempted here — see the closing note.

### `NOR` = hura — Present

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zidan *(⚠ — see note)* | didagu | didazu | didazue | zidaten |
| hari | diot | dio | diogu | diozu | diozue | diote |
| guri | — | zigun | *(refl.)* | diguzu | diguzue | ziguten |
| zuri | dizut | dizu | dizugu | *(refl.)* | dizuzue 🔍 | dizute |
| haiei | diet | die | diegu | diezu | diezue | diete |

⚠️ **Still open** (§13 couldn't settle this either, see its own notes):
`zidan` in the `niri`/`hark` cell of a *present* table — `-an` is a
past-tense ending (compare this row's own `dio`, and `diot`/`zion` in the
past grid below), so it looks misplaced, and the present `niri`/`hark` cell
is probably the one left blank instead. Reproduced verbatim rather than
moved, since nothing here independently confirms what *should* fill the
present slot.

The newly-filled cells follow the same `di-` + NORI-suffix + NORK-suffix
formula visible in the `hari`/`zuri`/`haiei` rows (NORI-suffixes
`-da-`/`-o-`/`-gu-`/`-zu-`/`-e-` for `niri`/`hari`/`guri`/`zuri`/`haiei`;
NORK-suffixes `-t`/`∅`/`-gu`/`-zu`/`-zue`/`-te` for
`nik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`, same as `hari`'s row already
showed). `didazu` ("you give it to me") is itself a common, independently-
recognizable form, which is reassuring corroboration for the formula.
`guri`/`guk` and `zuri`/`zuk` are newly-identified `*(refl.)*` cells
(NORI=NORK: "we give it to ourselves", "you give it to yourself") — distinct
from the pre-existing `—` cells (`niri`/`nik`, `guri`/`nik`), which are
unsourced gaps from the original citation table rather than confirmed
reflexive impossibilities, so left as `—` rather than reclassified.
`zuri`/`zuek` (`dizuzue`) is marked 🔍 — `zu` and `zuek` aren't a
`*(hika/zuka)*`-style register clash (both are `zuka`), so the cell isn't
grammatically excluded, but it's also not independently attested here.

### `NOR` = hura — Past

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zidan | genidan | zenidan | zenidaten | zidaten |
| hari | nion *(⚠ vs. `nioen`)* | zion *(⚠ vs. `zioen`)* | genion *(⚠ vs. `genioen`)* | zenioen | zenioten | zioten |
| guri | — | zigun | *(refl.)* | zenigun | zeniguten | ziguten |
| zuri | nizun | zizun | genizun | *(refl.)* | zenizuten 🔍 | zizuten |
| haiei | nien | zien | genien | zenien | zenieten | zieten |

⚠️ **New discrepancy spotted while filling this in**: §14's `esan` table
gives this exact row (`hari`, NORK = nik/hark/guk/zuk/zuek/haiek) as `nioen /
zioen / genioen / zenioen / zenioten / zioten` — matching on `zenioen`,
`zenioten`, and `zioten`, but disagreeing with the original paste's `nion` /
`zion` / `genion` on the other three. Both `-o-n` and `-o-en` look like
plausible Basque past-tense shapes (vowel contraction is common — compare
`zuen` vs. a hypothetical `*zuoen`), so this could be a register/contraction
variant rather than an error in either source — but it's exactly the kind of
"two sources disagree and both look right" situation that needs a grammar
reference to resolve, not a guess. Left as-is with both forms shown rather
than picking one.

The same prefix-encodes-NORK pattern that §3's past-tense `ukan` grid uses
(`n-`/`z-`/`gen-`/`zen-`/`zen-…te`/`z-…te` for
`nik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`) accounts for every newly-filled cell
here too — e.g. `genidan` = `gen-i-da-n` (guk→niri), `zenigun` = `zen-i-gu-n`
(zuk→guri), `zenieten` = `zen-i-e-te-n` (zuek→haiei). `guri`/`guk` and
`zuri`/`zuk` are `*(refl.)*` for the same reason as the present grid;
`zuri`/`zuek` (`zenizuten`) carries the same 🔍 as its present-tense
counterpart, for the same reason.

### `NOR` = haiek — Present

Same grid shape, with §4's `-zki-` infix marking the plural object
(`di-` → `di-zki-`), inserted right before the `NORI` suffix — e.g.
`dizkidazu` = `di-zki-da-zu` ("you give them to me"), `dizkio` = `di-zki-o`
("he gives them to him"). Several of these — `dizkidazu`, `dizkit`-type
`dizkida`, `dizkio`, `dizkigu`, `dizkidate` and their kin — are everyday,
widely-recognized forms, giving this grid more independent footing than the
`hura` grid's blanker corners.

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | dizkida | dizkidagu | dizkidazu | dizkidazue | dizkidate |
| hari | dizkiot | dizkio | dizkiogu | dizkiozu | dizkiozue | dizkiote |
| guri | — | dizkigu | *(refl.)* | dizkiguzu | dizkiguzue | dizkigute |
| zuri | dizkizut | dizkizu | dizkizugu | *(refl.)* | dizkizuzue 🔍 | dizkizute |
| haiei | dizkiet | dizkie | dizkiegu | dizkiezu | dizkiezue | dizkiete |

The `—`/`*(refl.)*`/🔍 cells follow the exact same pattern as the `hura` grid
above, just with `-zki-` threaded through every form.

### `NOR` = haiek — Past

Same `-zki-` infix over the past grid's prefix-encodes-NORK forms — e.g.
`zizkidan` = `z-i-zki-da-n` ("he had given them to me"), `nizkion` =
`n-i-zki-o-n` ("I had given them to him"). The `hari` row inherits the
`hura` grid's `-on`/`-oen` ⚠ uncertainty (here `-zkion`/`-zkioen`) for the
same unresolved reason.

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zizkidan | genizkidan | zenizkidan | zenizkidaten | zizkidaten |
| hari | nizkion *(⚠ vs. `nizkioen`)* | zizkion *(⚠ vs. `zizkioen`)* | genizkion *(⚠ vs. `genizkioen`)* | zenizkioen | zenizkioten | zizkioten |
| guri | — | zizkigun | *(refl.)* | zenizkigun | zenizkiguten | zizkiguten |
| zuri | nizkizun | zizkizun | genizkizun | *(refl.)* | zenizkizuten 🔍 | zizkizuten |
| haiei | nizkien | zizkien | genizkien | zenizkien | zenizkieten | zizkieten |

**On `NOR` = 1st/2nd person**: forms like "he gives *me* to him" (NOR=ni)
exist in principle — they'd follow §3's NOR-NORK shape (NOR marked by a
prefix/stem-internal change, e.g. the `nau-`/`gaitu-`-type stems) with a
`NORI` suffix layered on top — but they're vanishingly rare in actual use
(ditransitive verbs overwhelmingly take inanimate/3rd-person direct objects:
you *give* things, you don't usually *give people*), and nothing in this
document's sources attempts them. Left out rather than invented; would need
source material to fill in, the same way the Ahalera/Subjuntiboa `❓` cells
in §3 were left for a future pass.

## 6. More classic synthetic `nor` verbs · 📖 (corroborates §8 of the original notes)

These four overlap with tables already compiled independently while writing
this reference (see the original `egon`/`joan`/`etorri`/`ibili` tables this
file started with — now folded in below with the `zu` row added). Every
overlapping cell **matched**, which is reassuring corroboration for both
sources; the `zu` row is new information from the merged paste.

A *third*, independent source corroborates the same four verbs again — a
classroom reference table covered in §14 (`eduki/egon/ekarri/erabili/eraman/
esan/etorri/ibili/jakin/joan`, from euskarians.wordpress.com, 2011). Every
`egon`/`joan`/`etorri`/`ibili` form it gives matches the table below exactly
— **triple** corroboration now. (That source's own table omits the `hi` row
for these verbs entirely, presumably to dodge the masculine/feminine
alternation rather than out of disagreement — so it neither confirms nor
disputes `hago`/`hoa`/`hator`/`habil`.)

### `egon` — "to be (located / in a state)"

| Person | Present | Past |
|---|---|---|
| ni | nago | nengoen |
| hi | hago | hengoen |
| hura | dago | zegoen |
| gu | gaude | geunden |
| zu | zaude | zeunden |
| zuek | zaudete | zeundeten |
| haiek | daude | zeuden |

### `joan` — "to go"

| Person | Present | Past |
|---|---|---|
| ni | noa | nindoan |
| hi | hoa | hindoan |
| hura | doa | zihoan |
| gu | goaz | gindoazen |
| zu | zoaz | zindoazen |
| zuek | zoazte | zindoazten |
| haiek | doaz | zihoazen |

### `etorri` — "to come"

| Person | Present | Past |
|---|---|---|
| ni | nator | nentorren |
| hi | hator | hentorren |
| hura | dator | zetorren |
| gu | gatoz | gentozen |
| zu | zatoz | zentozen |
| zuek | zatozte | zentozten |
| haiek | datoz | zetozen |

### `ibili` — "to walk around / be (in the process of) doing"

| Person | Present | Past |
|---|---|---|
| ni | nabil | nenbilen |
| hi | habil | *(not given by any source — `hi` consistently the gap, see §14's note above)* |
| hura | dabil | zebilen |
| gu | gabiltza | genbiltzan |
| zu | zabiltza | zenbiltzan *(filled in from §14)* |
| zuek | zabiltzate | zenbiltzaten *(filled in from §14)* |
| haiek | dabiltza | zebiltzan |

## 7. `jakin` and `ekarri` · 📖

### `jakin` — "to know (a fact)" — nor-nork

| Person | Present | Past |
|---|---|---|
| nik | dakit | nekien |
| hik | — | — |
| hark | daki | zekien |
| guk | dakigu | genekien |
| zuk | dakizu | — |
| zuek | dakizue | — |
| haiek | dakite | zekiten |

### `ekarri` — "to bring" — nor-nork

Originally quoted here as "past-only/literary" from a partial source — §14's
classroom table gives a fuller paradigm with **both tenses** and an explicit
singular-vs-plural-object split (`(tza)` = plural-object infix, exactly the
`(z)`/`(zki)` notation `VERBS`/`VERB_COVERAGE.md` already use elsewhere):

| Person | Present (sg./pl. obj.) | Past (sg./pl. obj.) |
|---|---|---|
| nik | dakart / dakartzat | nekarren / nekartzan |
| hark | dakar / dakartza | zekarren / zekartzan |
| guk | dakargu / dakartzagu | genekarren / genekartzan |
| zuk | dakarzu / dakartzazu | zenekarren / zenekartzan |
| zuek | dakarzue / dakartzazue | zenekarten / zenekartzaten |
| haiek | dakarte / dakartzate | zekarten / zekartzaten |

(Note this resolves an ambiguity in the original partial quote: `zekartzaten`
is the *plural-object* haiek-past form — `zekarten` is its singular-object
counterpart, and both exist side by side rather than one superseding the
other.)

## 8. `iraun`, `jario`, `esan`, `irudi`, `etzan` · 📖

This section started out as a holding pen for partial/🔍 leftovers from the
original research pass, but two sources arriving in succession have since
filled in every one of them. §14's classroom table completed `esan` first
(kept here rather than relocated, since it's still the same verb this section
was already tracking). Then a PDF dedicated to rarer/non-standard synthetic
verbs ("trinko-ezohiko-batzuk", euskarians.wordpress.com, 2012) did the same
for the rest in one pass: `iraun` (had a present-only table before; now also
past tense plus two example sentences), `jario` (was a bare fragment; now a
full present/past `NOR-NORI` grid), `irudi` (was a two-cell sample; now a
complete `nor-nork` present-and-past table), and `etzan` (had nothing beyond
a single confirmed form, `datza` — `VERB_COVERAGE.md` flags it as a rare,
"recognise it when you see it" verb that native teaching materials steer
learners away from).

### `iraun` — "to last / endure" (nor-nork)

The same new PDF behind `jario`/`irudi`/`etzan` confirms the present row
below exactly (already sourced, and it's the form `VERB_COVERAGE.md`'s own
corroboration was built on) and adds the past tense, which had no source
until now — plus two example sentences showing the verb's everyday range
goes well beyond the dictionary gloss "to last/endure":

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | diraut | nirauen |
| hi | dirauk / diraun *(masc./fem. — see allocutive note in `VERB_COVERAGE.md` §1)* | hirauen |
| hura | dirau | zirauen |
| gu | diraugu | genirauen |
| zu | dirauzu | zenirauen |
| zuek | dirauzue | zenirauten |
| haiek | diraute | zirauten |

- *1983tik legeak indarrean dirau* — "The law has been in force since 1983"
- *Filmak bi ordu dirau* — "The film runs/lasts two hours"

### `jario` — "to flow / ooze / pour" (nor-nori; defective, effectively fixed `nor`)

The same PDF that supplies `etzan`'s paradigm (below, this section) also spells out
`jario`'s full present/past `NOR-NORI` picture as templates — `(zki)` marks
the plural-`NOR` alternant, the same `(z)`/`(zki)` convention `VERBS` and
`VERB_COVERAGE.md` use elsewhere, so e.g. `niri` reads as **dariot**
(singular `nor`) / **darizkit** (plural `nor`):

| NORI | Present (oraina) | Past (lehenaldia) |
|---|---|---|
| niri | dari(zki)t | zeri(zki)dan |
| hiri | dari(zki)k/n *(masc./fem. — `hi` as `nori`; see allocutive note in `VERB_COVERAGE.md` §1)* | zeri(zki)(n)an *(masc./fem.)* |
| hari | dari(zki)o | zeri(zki)on |
| guri | dari(zki)gu | zeri(zki)gun |
| zuri | dari(zki)zu | zeri(zki)zun |
| zuei | dari(zki)zue | zeri(zki)zuen |
| haiei | dari(zki)e | zeri(zki)en |

Past (Bizkaian variant — `jario`'s own past stem, not a separate verb):
**darie** / **erion**.

The source's own example sentences underline how narrow `jario`'s everyday
use is — almost always a body fluid or liquid as the (singular) `nor`, and
often paired with `egon` rather than standing on its own (rough working
glosses, not grammar-checked):

- *Malkoak zerizkiola azaldu zen* — "He/she appeared/showed up with tears
  streaming [from him/her]"
- *Odola dariola dago* (= *Odoletan dago*) — "He/she is bleeding"
- *Negarra dariola dago* — "He/she is crying"
- *Izerdia dario* — "He/she is sweating"
- *Adurra dariola dago* — "He/she is drooling"
- *Iturriari ura dario* — "Water flows from the fountain"

### `esan` — "to say" (ditransitive forms, on the `*-io-` root `ukan` also borrows)

§14's classroom table fills this in completely — for `esan`, "complete" means
NOR fixed at 3sg (`hura`/"it"), NORI fixed at 3sg (`hari`/"to him-her"), and
NORK varying — the same "citation paradigm" shape `VERBS` already uses for
`ukan` itself (§3):

| Person (nork) | Present | Past |
|---|---|---|
| nik | diot | nioen |
| hark | dio | zioen |
| guk | diogu | genioen |
| zuk | diozu | zenioen |
| zuek | diozue | zenioten |
| haiek | diote | zioten |

### `irudi` — "to seem / give the impression" (nor-nork — *not* `iruditu`'s nor-nori)

A false-friend pairing flagged in `VERB_COVERAGE.md`: `iruditu` ("iruditzen
zait" = "it seems to me", subjective opinion, nor-nori) vs. `irudi`
("dirudizu" = "you give the impression", external appearance, nor-nork) —
cognates that drifted apart in both meaning *and* agreement. The same new PDF
behind `jario` (above) and `etzan` (below) supplies `irudi`'s full present
and past `nor-nork` paradigm too — confirming `dirudi`/`dirudizu` and adding
everything around them, including the past tense that wasn't sourced before:

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | dirudit | nirudien |
| hi | dirudik / dirudin *(masc./fem.)* | hirudien |
| hura | dirudi | zirudien |
| gu | dirudigu | genirudien |
| zu | dirudizu | zenirudien |
| zuek | dirudizue | zeniruditen |
| haiek | dirudite | ziruditen |

### `etzan` — "to lie (in) / consist of" (nor — rare, limited use)

Confirms `datza` (the one form `VERB_COVERAGE.md` had pinned down so far) and
fills out the rest of the paradigm around it — present and past, all seven
persons:

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | natza | nentzan |
| hi | hatza | hentzan |
| hura | datza | zetzan |
| gu | gautza | geuntzan |
| zu | zautza | zeuntzan |
| zuek | zautzate | zeuntzaten |
| haiek | dautza | zeutzan |

📖 — single-sourced and not yet checked against a grammar reference, like the
rest of the broader reference. `datza` lining up exactly with the form
already confirmed independently is a reasonable sign for the rest of the
table, though — same kind of corroboration §6's `egon`/`joan`/`etorri`/`ibili`
got, just from one source instead of three so far.

## 9. Imperative (agintera) · 📖

Second-person only — doesn't fill the usual six/seven-person table
(`VERB_COVERAGE.md` §3e already flags this as needing its own lesson shape).

| Verb | zu (formal sg.) | zuek (pl.) | hi |
|---|---|---|---|
| ukan *(generic "do it")* | ezazu | ezazue | ezak *(masc.)* / ezan *(fem.)* |
| ekarri ("bring") | ekarri ezazu | ekarri ezazue | — |
| etorri ("come") | zatoz | zatozte | hator |
| joan ("go") | zoaz | zoazte | hoa |

## 10. Periphrastic construction reference · 📖

For the ~20 synthetic verbs aside, every other Basque verb conjugates as
**stem + aspect suffix + auxiliary** — exactly the `type: 'periphrastic'`
shape `CLAUDE.md` says the data model already anticipates but no `VERBS`
entry yet uses (see `VERB_COVERAGE.md` §4b).

### Aspect suffixes

| Aspect | Suffix | Example with `ikusi` ("to see") |
|---|---|---|
| Imperfective (habitual/ongoing) | `-ten` / `-tzen` | *ikusten dut* — I see / I'm seeing |
| Perfective (completed action) | `-i` / `-tu` / `-du` / `-n` | *ikusi dut* — I have seen |
| Prospective (future/intention) | `-ko` / `-go` | *ikusiko dut* — I will see |

### Auxiliary selection by agreement pattern

| Pattern | Auxiliary |
|---|---|
| `nor` (intransitive) | `izan` |
| `nor-nork` (transitive) | `ukan` |
| `nor-nori` (intransitive + dative) | `izan` with dative (§4) |
| `nor-nori-nork` (transitive + dative) | `ukan` with dative (§5) |

### Worked examples

| Basque | Gloss |
|---|---|
| etorri naiz | I have come (`izan`, perfective) |
| etortzen naiz | I come / I'm coming (`izan`, imperfective) |
| etorriko naiz | I will come (`izan`, prospective — this is `VERB_COVERAGE.md`'s pick for the cheapest next tense to add) |
| ikusi dut | I have seen it (`ukan`, perfective) |
| ikusten dut | I see it (`ukan`, imperfective) |
| ikusiko dut | I will see it (`ukan`, prospective) |
| eman dio | (S)he gave it to him/her (`ukan` + dative) |
| gustatu zait | I liked it (`izan` + dative) |

## 11. Pronoun & case reference · 📖

Low-risk, high-utility — basic noun-phrase declensions rather than verb
forms. Mirrors the shape of `VERBS`' existing `pronouns` field (declined for
whichever case that verb's subject takes).

| Person | Absolutive (nor) | Ergative (nork) | Dative (nori) |
|---|---|---|---|
| ni | ni | nik | niri |
| hi | hi | hik | hiri |
| hura | hura | hark | hari |
| gu | gu | guk | guri |
| zu | zu | zuk | zuri |
| zuek | zuek | zuek | zuei |
| haiek | haiek | haiek | haiei |

## 12. Beyond present / past — notes

Per `VERB_COVERAGE.md` §3, sketched rather than tabulated:

- **Future (geroa)** — periphrastic: stem + `-ko`/`-go` + auxiliary, e.g.
  *"etorriko naiz"*. Reuses existing auxiliary conjugations — cheapest tense
  to add next.
- **Conditional (baldintza/ondorioa)** — *"banintz"*, *"banu"*, *"banengo"*
  (if-clauses, "baldintza"); *"nintzateke"*, *"nuke"*, *"nengoke"* (the
  "would" result, "ondorioa") — full tables for `izan`/`ukan` now in §2/§3
  above (`egon`'s own — *"nengoke"* — still isn't sourced anywhere).
- **Potential (ahalera)** — *"naiteke"*, *"dezaket"*, *"nagoke"* (present);
  *"nintekeen"*, *"nezakeen"*, *"nengokeen"* (past). A closed synthetic `-ke`
  set, available only to verbs with full synthetic paradigms.
- **Subjunctive (subjuntiboa)** — *"nadin"*, *"dezadan"*, *"nengoen"* — mostly
  embedded in subordinate clauses (*"Nahi dut etor dadin"* = "I want him/her
  to come").
- **Imperative (agintera)** — see §9.

For periphrastic verbs, each of the above is actually a (non-finite verb form
× auxiliary tense) pair — e.g. *"ibiltzen naiz"* (present habitual), *"ibili
naiz"* (present perfect), *"ibiliko naiz"* (future).

---

## 13. Cross-check source: "Euskal aditz laguntzailea" chart · 📖

A dense, professionally-compiled auxiliary-verb paradigm chart (uploaded
2026-06-07) — three pages covering Batua (Lorenzo Zugazaga Martikorena),
Bizkaiera, and Zuberera (Jean Louis Davant), laid out as
mood × tense × `NOR`/`NOR-NORI`/`NOR-NORK`/`NOR-NORI-NORK` grids. It uses
heavily abbreviated morpheme-template notation rather than fully-spelled-out
words in most cells (e.g. `NA U T`, `Di (zki) GU GU`), which makes it
excellent for *checking specific forms someone already wrote down* but
error-prone to transcribe wholesale into prose tables — so it's used here as
a **cross-check against §2–§5's flagged issues**, not copied in full.

This source is also the first one seen so far with full **Bizkaiera and
Zuberera** paradigms side by side with Batua — directly relevant to the
`dialectVariants` extension point `CLAUDE.md` describes (e.g.
`dialectVariants: { bizkaiera: { conjugations: {...} } }`), should the app
ever grow dialect support beyond the current `dialect: 'batua'` placeholder.
Worth keeping in mind as a source for that, once decoded more rigorously.

## 14. Classroom reference table — three new synthetic verbs · 📖

Source: *"Aditz trinkoak: eduki, egon, ekarri, erabili, eraman, esan, etorri,
ibili, jakin, joan"* (`santutxu` / euskarians.wordpress.com, 2011). A one-page
classroom handout giving present + past for ten synthetic verbs side by side,
in a **six-person layout that omits `hi`** (`ni / hura / gu / zu / zuek /
haiek` — the same shape as `ukan`'s citation paradigm in §3). It corroborates
or fills gaps in material already covered elsewhere — see §6's notes for
`egon`/`joan`/`etorri`/`ibili`, §7/§8's for `ekarri`/`esan` — and contributes
**three verbs not seen in any other source**: `eduki`, `erabili`, `eraman`,
none yet in `VERBS`.

### `eduki` — "to have / hold (physically)" — nor-nork

A near-synonym of `ukan` used for physical possession/holding — distinct
enough in register/meaning that it's worth keeping separate from `ukan`
rather than treating as a variant. Like `ekarri` above, the source's
`(Z)`/`(z)` notation marks the plural-object alternant:

| Person | Present (sg./pl. obj.) | Past (sg./pl. obj.) |
|---|---|---|
| nik | daukat / dauzkat | neukan / neuzkan |
| hark | dauka / dauzka | zeukan / zeuzkan |
| guk | daukagu / dauzkagu | geneukan / geneuzkan |
| zuk | daukazu / dauzkazu | zeneukan / zeneuzkan |
| zuek | daukazue / dauzkazue | zeneukaten / zeneuzkaten |
| haiek | daukate / dauzkate | zeukaten / zeuzkaten |

### `erabili` — "to use" — nor-nork

| Person | Present (sg./pl. obj.) | Past (sg./pl. obj.) |
|---|---|---|
| nik | darabilt / darabiltzat | nerabilen / nerabiltzan |
| hark | darabil / darabiltza | zerabilen / zerabiltzan |
| guk | darabilgu / darabiltzagu | generabilen / generabiltzan |
| zuk | darabilzu / darabiltzazu | zenerabilen / zenerabiltzan |
| zuek | darabilzue / darabiltzazue | zenerabilten / zenerabiltzaten |
| haiek | darabilte / darabiltzate | zerabilten / zerabiltzaten |

### `eraman` — "to carry / take (something somewhere)" — nor-nork

| Person | Present (sg./pl. obj.) | Past (sg./pl. obj.) |
|---|---|---|
| nik | daramat / daramatzat | neraman / neramatzan |
| hark | darama / daramatza | zeraman / zeramatzan |
| guk | daramagu / daramatzagu | generaman / generamatzan |
| zuk | daramazu / daramatzazu | zeneraman / zeneramatzan |
| zuek | daramazue / daramatzazue | zeneramaten / zeneramatzaten |
| haiek | daramate / daramatzate | zeramaten / zeramatzaten |

⚠️ As with everything past §1, these are merged in as **unverified leads**,
not facts — the `(sg./pl. obj.)` split is *inferred* from the source's
`X(Y)` shorthand by analogy with `VERBS`' own `(z)`/`(zki)` convention and
with `ekarri`'s spelled-out split above, not spelled out letter-by-letter in
the source itself for `eduki`/`erabili`/`eraman`. Worth a grammar check
before any of the three goes into `VERBS`.
