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
- 📖 — broader reference material (sections 3 onward): plausible standard
  Batua forms, merged in from a larger paste and cross-checked where possible
  against the two further sources in §14/§15 (with a handful of typos and one
  mislabel corrected along the way). Treat it as a solid starting point —
  but still not yet verified against `VERBS` itself. The few discrepancies
  the cross-check couldn't settle are flagged inline with ⚠️ at point of use
  (see §6) rather than gathered in a separate list
- 🔍 — partial forms only, as they surfaced while researching
  `VERB_COVERAGE.md`; the full paradigm isn't confirmed, so it's quoted
  verbatim rather than filled in

**Sources merged in, in arrival order:** an initial larger paste (§3 onward);
a professionally-typeset paradigm-chart PDF covering Batua/Bizkaiera/Zuberera
(§14, "Euskal aditz laguntzailea"); a 2011 classroom handout covering ten
synthetic verbs (§15, "Aditz trinkoak"); a PDF on rarer/non-standard synthetic
verbs (§9, "trinko-ezohiko-batzuk", euskarians.wordpress.com, 2012) that
rounded out full present/past paradigms for `iraun`, `jario`, `irudi`, and
`etzan` — the entire former 🔍-partial roster of §9. §14/§15 mostly serve as
*cross-checks* on material already here — though §14's compact NOR-NORI row
templates ended up doing real generative work of their own: re-mined twice
over, they grew §5 from a `NOR ∈ {hura, haiek}` citation slice into the full
seven-by-seven `NORI`×`NOR` grid (present and past), mechanically applying
the same `-zki-`/`K-N`↔`A-NA` regularities already trusted elsewhere in this
document — see §5's own notes for the formula (and a `zu`/`zuek` derivation
this document briefly got backwards before correcting it). §9's new source
instead grows verbs that were previously
fragmentary, sample-only, or barely sourced at all — see each section's own
notes for exactly what each contributed.

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

## 2. `ukan` — "to have" (the `du` auxiliary) · nor-nork · ✅

Shown in its citation paradigm — fixed 3rd-person-singular absolutive object
("it/him/her"), as `VERBS` itself notes (`object: 'hura'`).

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | dut | nuen |
| hi | duk | huen |
| hura | du | zuen |
| gu | dugu | genuen |
| zuek | duzue | zenuten |
| haiek | dute | zuten |

---

# Broader reference (📖 — merged in, not yet verified)

Everything from here down was merged in from a larger conjugation reference
and goes well beyond what's coded into `VERBS`. It includes the `zu` person
the app doesn't model, fuller `NOR-NORK`/`NOR-NORI`/`NOR-NORI-NORK`
object-agreement grids, more synthetic verbs, the imperative, and the
periphrastic system. It's been cross-checked against the further sources in
§14/§15 — what that caught and fixed is folded straight into the tables below,
and the handful of discrepancies it couldn't resolve are flagged inline with
⚠️ right where they occur (see §6).

## 3. `izan` — additional paradigms · 📖

`izan`'s full mood/tense system, sourced from §14's plain-word paradigm lists
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

Second/third-person only, like every Basque imperative (§10) — `izan`
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

## 4. `ukan` — NOR-NORK system · 📖

`VERBS` only models `ukan` in its citation form (NOR fixed at 3sg `hura`).
The full paradigm varies the verb by **both** subject (`NORK`, rows) and
object (`NOR`, columns) — laid out as a grid, the natural shape for a
transitive paradigm, rather than the one-`NOR`-at-a-time tables this section
started as. *Blank cells are sourcing gaps, not claims that a form doesn't
exist* — except where marked `(refl.)`, meaning the combination is reflexive
and just doesn't occur ("I have me"). The entirely-empty `hi`-as-object
column is itself worth noting: **no source has been found yet that spells out
any "(someone) has you, familiar" form outright** — a gap of exactly the kind
`VERB_COVERAGE.md` §1 already flags for `hi`/`zu`. (The "Completing the grid"
subsection below has a first attempt at it — 🔍-marked, recipe-derived rather
than found spelled out, so still not a source in the sense meant here.)

### Present

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* |  | dut | *(refl.)* | zaitut | zaituztet | ditut |
| hik *(masc. subj., `-k`)* | nauk |  | duk |  |  |  |  |
| hik *(fem. subj., `-n`)* | naun |  | dun |  |  |  |  |
| hark | nau |  | du | gaitu | zaitu | zaituzte | ditu |
| guk |  |  | dugu | *(refl.)* | zaitugu | zaituztegu | ditugu |
| zuk | nauzu |  | duzu | gaituzu | *(refl.)* |  |  |
| zuek | nauzue |  | duzue | gaituzue |  | *(refl.)* |  |
| haiek | naute |  | dute | gaituzte | zaituzte | zaituzte | dituzte |

### Past

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* |  | nuen | *(refl.)* | zintudan |  | nituen |
| hik |  |  | huen |  |  |  | hituen |
| hark | ninduen |  | zuen | gintuen | zintuen |  | zituen |
| guk |  |  | genuen | *(refl.)* | zintugun |  | genituen |
| zuk | ninduzun |  | zenuen |  | *(refl.)* |  | zenituen |
| zuek |  |  | zenuten |  |  | *(refl.)* | zenituzten |
| haiek | ninduten |  | zuten | gintuzten | zintuzten |  | zituzten |

`hituen` is newly filled in from §14 — its plain-word `HURA`/`HAIEK`
past-tense lists spell `nuen/huen/zuen/…/zuten` and `nituen/hituen/zituen/…
/zituzten` side by side, and `hituen` hadn't turned up in any source until
now. Note also that `hik`'s row isn't gender-split in the past the way it is
in the present (`huen` only, vs. `duk`/`dun`) — every source agrees on that,
so it's reproduced as-is rather than "completed" with an invented split;
whether that reflects a real grammatical fact (no past-tense gender marking)
or just a shared simplification across teaching sources is exactly the kind
of question a grammar reference would settle.

### Further moods (citation paradigm: `NOR` fixed at `hura`/`haiek`)

§14 spells these out as plain `HURA`/`HAIEK` word-pairs too, which is what
let this grow from a five-cell "conditional" fragment into a full picture
across six tense/mood combinations — shown as paired columns since `NOR`
only takes the singular/plural-object contrast in this paradigm shape, the
same shape `VERBS` already uses for `ukan` itself (§2):

| Mood / tense | NORK | NOR = hura | NOR = haiek |
|---|---|---|---|
| **Baldintza** ("if I had…") | nik | banu | banitu |
| | hik | bahu | bahitu |
| | hark | balu | balitu |
| | guk | bagenu | bagenitu |
| | zuk | bazenu | bazenitu |
| | zuek | bazenute | bazenituzte |
| | haiek | balute | balituzte |
| **Ondorioa**, present ("would have") | nik | nuke | nituzke |
| | hik | huke | hituzke |
| | hark | luke | lituzke |
| | guk | genuke | genituzke |
| | zuk | zenuke | zenituzke |
| | zuek | zenukete | zenituzkete |
| | haiek | lukete | lituzkete |
| **Ondorioa**, past ("would have had") | nik | nukeen | nituzkeen |
| | hik | hukeen | hituzkeen |
| | hark | zukeen | zituzkeen |
| | guk | genukeen | genituzkeen |
| | zuk | zenukeen | zenituzkeen |
| | zuek | zenuketen | zenituzketen |
| | haiek | zuketen | zituzketen |
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

The Present/Past grids above still leave most of their `ni`/`hi`/`gu`/`zu`/
`zuek` columns blank — the citation paradigm and the "Further moods" table
both fix `NOR` at `hura`/`haiek` ("having *something*"), but the *full*
paradigm also covers "*you* have *me*", "*they* had *us*", etc. §14's chart
gives this other half as compact row-templates rather than spelled-out words —
the same `[NOR-prefix] + [stem] + [NORK-suffix]` recipe §5 decoded for
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
but not independently attested the way the rest of this file's ✅/📖 forms are;
*(refl.)* marks the same impossible-combination diagonal as the grids above
(extended on the same logic to `guk`→`ni`/`hi` and `zuk`/`zuek`→`hi`, which no
source spells out either but which are exactly as reflexive-shaped as the
already-marked `nik`→`gu`/`zu`/`zuek` cells); blank still means "gap, not a
claim the form doesn't exist" — most of the remaining blanks are the same
"`hi` as object" gap §4 already named (the 🔍 forms below are this file's
first attempt at it, built from the recipe rather than found in a source) plus
the `zu`↔`zuek` cross-register cells (e.g. "you-singular have you-all") that
no source addresses either.

#### Present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 haut | dut | *(refl.)* | zaitut | zaituztet | ditut |
| hik *(`-k`/`-n`)* | nauk / naun | *(refl.)* | duk / dun | 🔍 gaituk / gaitun | 🔍 zaituk / zaitun | 🔍 zaituztek / zaituzten | dituk / ditun |
| hark | nau | 🔍 hau | du | gaitu | zaitu | zaituzte | ditu |
| guk | *(refl.)* | *(refl.)* | dugu | *(refl.)* | zaitugu | zaituztegu | ditugu |
| zuk | nauzu | 🔍 hauzu | duzu | gaituzu | *(refl.)* | *(refl.)* | dituzu |
| zuek | nauzue | 🔍 hauzue | duzue | gaituzue | *(refl.)* | *(refl.)* | dituzue |
| haiek | naute | 🔍 haute | dute | gaituzte | zaituzte | zaituzte | dituzte |

#### Past — `NOR` = 1st/2nd person

`zuek`-as-object is left blank throughout (rather than 🔍-guessed): its
present-tense shape pairs the `-zte-` infix straight with a vowel-initial
suffix (`zait-u-zte-t` → `zaituztet`), but every past-tense suffix here is
itself vowel-initial too (`-en`, `-ugu-n`…), and stacking `-zte-` against
*another* vowel risks exactly the kind of contraction/epenthesis surprise the
`dituzte`-vs-`†ditute` wrinkle above already showed this recipe can hide —
better an honest gap than a guess two layers deep.

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hindudan | nuen | *(refl.)* | zintudan | | nituen |
| hik | 🔍 ninduan / nindunan | *(refl.)* | huen | 🔍 gintuan / gintunan | 🔍 zintuan / zintunan | | hituen |
| hark | ninduen | 🔍 hinduen | zuen | gintuen | zintuen | | zituen |
| guk | *(refl.)* | *(refl.)* | genuen | *(refl.)* | 🔍 zintugun | | genituen |
| zuk | ninduzun | 🔍 hinduzun | zenuen | 🔍 gintuzun | *(refl.)* | *(refl.)* | zenituen |
| zuek | 🔍 ninduzuen | 🔍 hinduzuen | zenuten | 🔍 gintuzuen | *(refl.)* | *(refl.)* | zenituzten |
| haiek | ninduten | 🔍 hinduten | zuten | gintuzten | zintuzten | | zituzten |

### Baldintza, Ondorioa — completing the grid the same way

Baldintza and both Ondorioa tenses run on the *exact same* `nind-/hind-/
gint-/zint-` prefix series and `-u(-ke)-` stem as the indicative grids just
decoded — Baldintza just adds a `Ba-` protasis prefix and drops the past `-n`
(mirroring `banintz`/`banu` in §1/§3/§4's own citation row), Ondorioa just
inserts `-ke-` before the same suffix families as present/past respectively.
Same cross-checking discipline as above — 🔍 for recipe-derived cells, blank
for `zuek`-as-object (same `-zte-`-meets-a-vowel concern as the past grid; here
it additionally has to clear an inserted `-ke-` first, one more place for a
silent contraction to hide), `*(refl.)*` for the impossible diagonal, and the
already-sourced `hura`/`haiek` columns copied straight from the "Further
moods" table above (no 🔍 — those *are* the cross-check anchors):

#### Baldintza — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 bahindut | banu | *(refl.)* | 🔍 bazintut | | banitu |
| hik | 🔍 baninduk / banindun | *(refl.)* | bahu | 🔍 bagintuk / bagintun | 🔍 bazintuk / bazintun | | bahitu |
| hark | 🔍 banindu | 🔍 bahindu | balu | 🔍 bagintu | 🔍 bazintu | | balitu |
| guk | *(refl.)* | *(refl.)* | bagenu | *(refl.)* | 🔍 bazintugu | | bagenitu |
| zuk | 🔍 baninduzu | 🔍 bahinduzu | bazenu | 🔍 bagintuzu | *(refl.)* | *(refl.)* | bazenitu |
| zuek | 🔍 baninduzue | 🔍 bahinduzue | bazenute | 🔍 bagintuzue | *(refl.)* | *(refl.)* | bazenituzte |
| haiek | 🔍 banindute | 🔍 bahindute | balute | 🔍 bagintuzte | 🔍 bazintuzte | | balituzte |

#### Ondorioa, present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hinduket | nuke | *(refl.)* | 🔍 zintuket | | nituzke |
| hik | 🔍 nindukek / ninduken | *(refl.)* | huke | 🔍 gintukek / gintuken | 🔍 zintukek / zintuken | | hituzke |
| hark | 🔍 ninduke | 🔍 hinduke | luke | 🔍 gintuke | 🔍 zintuke | | lituzke |
| guk | *(refl.)* | *(refl.)* | genuke | *(refl.)* | 🔍 zintukegu | | genituzke |
| zuk | 🔍 nindukezu | 🔍 hindukezu | zenuke | 🔍 gintukezu | *(refl.)* | *(refl.)* | zenituzke |
| zuek | 🔍 nindukezue | 🔍 hindukezue | zenukete | 🔍 gintukezue | *(refl.)* | *(refl.)* | zenituzkete |
| haiek | 🔍 nindukete | 🔍 hindukete | lukete | 🔍 gintukezte | 🔍 zintukezte | | lituzkete |

#### Ondorioa, past — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | 🔍 hindukedan | nukeen | *(refl.)* | 🔍 zintukedan | | nituzkeen |
| hik | 🔍 nindukean / nindukenan | *(refl.)* | hukeen | 🔍 gintukean / gintukenan | 🔍 zintukean / zintukenan | | hituzkeen |
| hark | 🔍 nindukeen | 🔍 hindukeen | zukeen | 🔍 gintukeen | 🔍 zintukeen | | zituzkeen |
| guk | *(refl.)* | *(refl.)* | genukeen | *(refl.)* | 🔍 zintukezun | | genituzkeen |
| zuk | 🔍 nindukezun | 🔍 hindukezun | zenukeen | 🔍 gintukezun | *(refl.)* | *(refl.)* | zenituzkeen |
| zuek | 🔍 nindukezuen | 🔍 hindukezuen | zenuketen | 🔍 gintukezuen | *(refl.)* | *(refl.)* | zenituzketen |
| haiek | 🔍 ninduketen | 🔍 hinduketen | zuketen | 🔍 gintukezten | 🔍 zintukezten | | zituzketen |

### Ahalera, Subjuntiboa — where the recipe stops being trustworthy

These two don't get the same treatment, and it's worth spelling out why
rather than silently producing a thinner table. §14's `NOR` = 1st/2nd-person
templates for them are:

| Mood / tense | Prefix series (`ni/hi/hura/gu/zu/zuek/haiek`) | Stem + markers | Suffix series (`nik/hik/hark/guk/zuk/zuek/haiek`) |
|---|---|---|---|
| Ahalera, present | `na-/ha-/De-/gait-/zait-/zait-…-te-/dit-` | `-zake-` | `-t/-k(/-n)/-∅/-gu/-zu/-zue/-te` |
| Ahalera, past | `nint-/hint-/(—)/gint-/zint-/zint-…-te-/(—)` | `-zake-` | `-da-n/-a(/na)-n/-en/-gu-n/-zu-n/-zue-n/-te-n` |
| Subjuntiboa, present | `na-/ha-/De-/gait-/zait-/zait-…-te-/dit-` | `-za-` | `-da-n/-a(/na)-n/-∅-n/-gu-n/-zu-n/-zue-n/-te-n` |

Running the recipe on the **Ahalera-present** row gives, e.g., `De-` (object
= `hura`) + `-zake-` + `-t` (subject = `nik`) → `dezaket`. But the *already-
sourced* "Further moods" citation row for the very same cell — `NORK = nik`,
`NOR = hura`, ahalera present — is `nezake` (§4 above, cross-checked against
§14's own plain-word list). `dezaket` and `nezake` aren't variants of the same
form; they're built on different person-marking entirely (`d-` = 3rd-person-
style absolutive marking vs. `ne-` = 1st-singular-style). One of these
templates is marking `NOR`, the other `NORK` — and they can't both be right
about which one the citation row already shown is doing. Rather than pick a
side and risk teaching a contradiction as fact, this is flagged as an open
discrepancy: **the Ahalera/Subjuntiboa citation paradigm and §14's own
"`NOR` = 1st/2nd person" template for the same mood don't reconcile**, and
nothing else in this file resolves it (§14 is the *only* source seen so far
that spells out either side of this particular pair). Likely culprits — a
linearization error in how this densely-laid-out chart's cells got read back
out as text (the same kind of thing this section already corrected once, see
the `dituzte` wrinkle above, just bigger), or a real but unfamiliar syncretism
this file's other sources don't independently corroborate either way. Either
way: better an honest "open question" than a table that's confidently wrong
about which argument it's agreeing with — exactly the failure mode `DECISIONS`
already named for `irudi`/`etzan`. Left as bare templates above, not expanded.

The **imperative**'s `NOR-NORK` cells, by contrast, are barely populated in
§14 at all — mostly `()` placeholders (`NA za ( )`, `Be za -`, `( ) ZU`…),
which squares with the independently-known fact that Basque imperatives are
largely restricted to absolutive-marking commands (`zaitez`, `bitez`, …); a
transitive "have it!" type imperative is at best marginal. No table to
complete there — there's barely a recipe to transcribe, let alone expand.

## 5. `izan` with dative — NOR-NORI system · 📖

Used with intransitive verbs that take an indirect object — `gustatu`,
`iruditu`, etc. (`VERB_COVERAGE.md` §2 covers why this pattern usually rides
on `izan`'s own auxiliary paradigm rather than a standalone lexical verb).
Laid out as a grid (`NORI` rows × `NOR` columns) — and, like §4's `ukan`
grid, the *full* picture varies `NOR` across all seven persons, not just
`hura`/`haiek`. The citation slice most relevant to `gustatu`-class verbs
("it pleases me", "they please me" — `NOR` is the 3rd-person stimulus) sits
in the `hura`/`haiek` columns; the rest of the grid is this *same* auxiliary
wearing its other hat — "I am to him" (`natzaio`, cited in
`VERB_COVERAGE.md` §2 as the synthetic engine behind e.g. `jarraitzen
natzaio`, "I follow him") and its kin across all persons.

§14's compact NOR-NORI row-template spells out, mechanically, how to build
*any* cell: `[NOR person's prefix + stem(+zki if plural)] + [NORI person's
suffix] (+ -n in the past)` — e.g. present `Zai|O` (hura-stem `zai-` +
hari-suffix `-o`) → `zaio`, or `NA tzai|O` (ni-stem `na-tzai-` + hari-suffix
`-o`) → `natzaio`. Three regularities fall straight out of that formula, and
all three are corroborated by patterns this document already relies on
elsewhere:

- **`-zki-` marks a plural `NOR`** — not just for `haiek` (the only plural
  option visible in the old 2-column framing) but for `gu`/`zuek` too
  (`gatzaizkio`, `zatzaizkio`, …) — the same infix §4's grid and §9 already
  use for plural absolutive arguments generally. `zu`, despite being the
  person that triggers a *different* kind of plural-marking elsewhere (the
  `ukan` system's "etiquette plural" `-it-` in `zaitut`, §4), sits this one
  out entirely — it keeps the bare `za-tzai-` shape (`zatzait` = za- +
  -tzai- + -t, no `-zki-`), in contrast with genuinely-plural `zuek`'s
  `zatzaizkit`.
- **The `K/N` ↔ `A/NA` mirroring** — the masc./fem. split tied to a `hi`
  argument — surfaces in the `NORI = hiri` row in exactly the present ↔ past
  pairing already named for §4: `zaik`/`zain` (present) ↔ `zitzaian`/
  `zitzainan` (past). §14's own template spells out `A/NA` for this row,
  *independently corroborating* the 🔍-flagged guess this document made for
  that very form just one revision ago — nice to see a guess confirmed.
- **Reflexive gaps** sit on the same kind of diagonal §4 leaves blank — `ni`-
  to-`niri`, `hi`-to-`hiri`, `gu`-to-`guri`, `zu`-to-`zuri`, `zuek`-to-`zuei`
  ("I am to myself", …) — marked `*(refl.)*` rather than invented. (`hura`-
  to-`hari` and `haiek`-to-`haiei` *aren't* reflexive gaps — "it"/"they" are
  open referential slots that can differ from their dative counterpart, hence
  `zaio`/`zaizkie` are perfectly ordinary attested forms.)

**A correction worth flagging explicitly: `zu` ≠ `zuek` here.** An earlier
pass through this grid assumed `zu` patterned after the plural-triggering
`zu` familiar from the `ukan` system's "etiquette plural" (`zaitut`, §4) —
i.e. that it took the `-zki-` infix — and left `zuek` blank as an unsourced
gap, reasoning (wrongly) that `izan`'s own `-te` plural marker (`zara` →
`zarete`) made `zuek`'s shape unrecoverable from §14's linearized template.
That was backwards on both counts. In *this* NOR-NORI paradigm `zu` keeps
the bare `za-tzai-` shape with no `-zki-` (`zatzait` = za- + -tzai- + -t),
while `zuek` — genuinely plural — takes `-zki-` exactly like `gu`/`haiek`
(`zatzaizkit`); no `-te` ever enters the picture. The reflexive diagonal
follows suit: `zu`-to-`zuri` is `*(refl.)*` over the bare shape (`zatzaizu`),
`zuek`-to-`zuei` is `*(refl.)*` over the `-zki-` shape (`zatzaizkizue`). Once
corrected, `zuek` needs no separate sourcing at all — it's exactly as
mechanically derivable as every other plural `NOR` slot, so the "honest gap"
this section once flagged here turns out not to exist.

### Present

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hatzait | zait | gatzaizkit | zatzait | zatzaizkit | zaizkit |
| hiri | natzaik *(masc.)* / natzain *(fem.)* | *(refl.)* | zaik *(masc.)* / zain *(fem.)* | gatzaizkik *(masc.)* / gatzaizkin *(fem.)* | zatzaik *(masc.)* / zatzain *(fem.)* | zatzaizkik *(masc.)* / zatzaizkin *(fem.)* | zaizkik *(masc.)* / zaizkin *(fem.)* |
| hari | natzaio | hatzaio | zaio | gatzaizkio | zatzaio | zatzaizkio | zaizkio |
| guri | natzaigu | hatzaigu | zaigu | *(refl.)* | zatzaigu | zatzaizkigu | zaizkigu |
| zuri | natzaizu | hatzaizu | zaizu | gatzaizkizu | *(refl.)* | zatzaizkizu | zaizkizu |
| zuei | natzaizue | hatzaizue | zaizue | gatzaizkizue | zatzaizue | *(refl.)* | zaizkizue |
| haiei | natzaie | hatzaie | zaie | gatzaizkie | zatzaie | zatzaizkie | zaizkie |

### Past

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hintzaidan | zitzaidan | gintzaizkidan | zintzaidan | zintzaizkidan | zitzaizkidan |
| hiri | nintzaian *(masc.)* / nintzainan *(fem.)* | *(refl.)* | zitzaian *(masc.)* / zitzainan *(fem.)* | gintzaizkian *(masc.)* / gintzaizkinan *(fem.)* | zintzaian *(masc.)* / zintzainan *(fem.)* | zintzaizkian *(masc.)* / zintzaizkinan *(fem.)* | zitzaizkian *(masc.)* / zitzaizkinan *(fem.)* |
| hari | nintzaion | hintzaion | zitzaion | gintzaizkion | zintzaion | zintzaizkion | zitzaizkion |
| guri | nintzaigun | hintzaigun | zitzaigun | *(refl.)* | zintzaigun | zintzaizkigun | zitzaizkigun |
| zuri | nintzaizun | hintzaizun | zitzaizun | gintzaizkizun | *(refl.)* | zintzaizkizun | zitzaizkizun |
| zuei | nintzaizuen | hintzaizuen | zitzaizuen | gintzaizkizuen | zintzaizuen | *(refl.)* | zitzaizkizuen |
| haiei | nintzaien | hintzaien | zitzaien | gintzaizkien | zintzaien | zintzaizkien | zitzaizkien |

### Baldintza — "if I were to him…" (protasis)

§14 spells this mood out as a *third* NOR-NORI row-template, prefixed `Ba-`
on top of a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/`zin-`/`li-` series (compare
`banintz`/`bahintz`/`balitz`/… in §1/§3 — the familiar conditional prefix,
just riding the dative-marked `tzai` stem instead of `izan`'s own one) and
closing with the *same* `NORI` suffixes as the present grid (no past `-n`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | bahintzait | balitzait | bagintzaizkit | bazintzait | bazintzaizkit | balitzaizkit |
| hiri | banintzaik *(masc.)* / banintzain *(fem.)* | *(refl.)* | balitzaik *(masc.)* / balitzain *(fem.)* | bagintzaizkik *(masc.)* / bagintzaizkin *(fem.)* | bazintzaik *(masc.)* / bazintzain *(fem.)* | bazintzaizkik *(masc.)* / bazintzaizkin *(fem.)* | balitzaizkik *(masc.)* / balitzaizkin *(fem.)* |
| hari | banintzaio | bahintzaio | balitzaio | bagintzaizkio | bazintzaio | bazintzaizkio | balitzaizkio |
| guri | banintzaigu | bahintzaigu | balitzaigu | *(refl.)* | bazintzaigu | bazintzaizkigu | balitzaizkigu |
| zuri | banintzaizu | bahintzaizu | balitzaizu | bagintzaizkizu | *(refl.)* | bazintzaizkizu | balitzaizkizu |
| zuei | banintzaizue | bahintzaizue | balitzaizue | bagintzaizkizue | bazintzaizue | *(refl.)* | balitzaizkizue |
| haiei | banintzaie | bahintzaie | balitzaie | bagintzaizkie | bazintzaie | bazintzaizkie | balitzaizkie |

Same formula and same `*(refl.)*` diagonal as the indicative grids above —
this section's `NOR` template just swaps in the `Ba-…` prefix series and
drops the past tense's trailing `-n`. Worth noting this fills a kind of
gap §13 and `VERB_COVERAGE.md` §3b both leave open in their own way — they
sketch `izan`'s baldintza with bare example forms (`banintz`, `banu`, …)
rather than full paradigms; this grid is the dative-marked half of exactly
that picture, laid out in full — for whatever a mechanically-generated table
is worth standing next to genuinely-cited ones.

The remaining eight grids below run the *exact same* mechanical recipe —
[NOR person's prefix + stem(+`-zki-` if plural)] + [NORI person's suffix]
(+ tense/mood markers like `-n`, `-ke`, `-en`) — across the rest of `izan`'s
mood/tense system, mirroring §3's full coverage of the plain (non-dative)
paradigm. `Ondorioa` keeps the `tzai` stem (like the indicative/baldintza
grids above); `potentziala`, `subjuntiboa`, and `inperatiboa` swap in the
bare `ki` stem instead (still `+-zki-` for plural `NOR`) — the same stem
`naiteke`/`dadin`/`bedi` ride in §3's plain paradigm, just dative-marked
here.

### Ondorioa — Present

§14's row-template for this mood runs on a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/
`zin-`/`li-` NOR-prefix series — note `hura`/`haiek` take an overt `li-` here,
unlike present-tense `zai-`'s prefix-less allomorph — riding the `tzai` stem,
closed off with a `-ke`-suffixed NORI series (`-dake`/`-ake`/`-nake`/`-oke`/
`-guke`/`-zuke`/`-zuekete`/`-eke`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hintzaidake | litzaidake | gintzaizkidake | zintzaidake | zintzaizkidake | litzaizkidake |
| hiri | nintzaiake *(masc.)* / nintzainake *(fem.)* | *(refl.)* | litzaiake *(masc.)* / litzainake *(fem.)* | gintzaizkiake *(masc.)* / gintzaizkinake *(fem.)* | zintzaiake *(masc.)* / zintzainake *(fem.)* | zintzaizkiake *(masc.)* / zintzaizkinake *(fem.)* | litzaizkiake *(masc.)* / litzaizkinake *(fem.)* |
| hari | nintzaioke | hintzaioke | litzaioke | gintzaizkioke | zintzaioke | zintzaizkioke | litzaizkioke |
| guri | nintzaiguke | hintzaiguke | litzaiguke | *(refl.)* | zintzaiguke | zintzaizkiguke | litzaizkiguke |
| zuri | nintzaizuke | hintzaizuke | litzaizuke | gintzaizkizuke | *(refl.)* | zintzaizkizuke | litzaizkizuke |
| zuei | nintzaizuekete | hintzaizuekete | litzaizuekete | gintzaizkizuekete | zintzaizuekete | *(refl.)* | litzaizkizuekete |
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
| hiri | nintzaiakeen *(masc.)* / nintzainakeen *(fem.)* | *(refl.)* | zitzaiakeen *(masc.)* / zitzainakeen *(fem.)* | gintzaizkiakeen *(masc.)* / gintzaizkinakeen *(fem.)* | zintzaiakeen *(masc.)* / zintzainakeen *(fem.)* | zintzaizkiakeen *(masc.)* / zintzaizkinakeen *(fem.)* | zitzaizkiakeen *(masc.)* / zitzaizkinakeen *(fem.)* |
| hari | nintzaiokeen | hintzaiokeen | zitzaiokeen | gintzaizkiokeen | zintzaiokeen | zintzaizkiokeen | zitzaizkiokeen |
| guri | nintzaigukeen | hintzaigukeen | zitzaigukeen | *(refl.)* | zintzaigukeen | zintzaizkigukeen | zitzaizkigukeen |
| zuri | nintzaizukeen | hintzaizukeen | zitzaizukeen | gintzaizkizukeen | *(refl.)* | zintzaizkizukeen | zitzaizkizukeen |
| zuei | nintzaizueketen | hintzaizueketen | zitzaizueketen | gintzaizkizueketen | zintzaizueketen | *(refl.)* | zitzaizkizueketen |
| haiei | nintzaiekeen | hintzaiekeen | zitzaiekeen | gintzaizkiekeen | zintzaiekeen | zintzaizkiekeen | zitzaizkiekeen |

### Potentziala — Present (ahalera)

Potentziala swaps the `tzai` stem for the bare `ki` stem (still `+-zki-` for
plural `NOR`, per the regularity above) riding `na-`/`ha-`/`da-`/`ga-`/`za-`/
`za-`/`da-` — the same prefix shape §3's plain `naiteke`/`gaitezke` paradigm
uses — closed with the same `-ke` NORI-suffix family as Ondorioa-Present:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hakidake | dakidake | gakizkidake | zakidake | zakizkidake | dakizkidake |
| hiri | nakiake *(masc.)* / nakinake *(fem.)* | *(refl.)* | dakiake *(masc.)* / dakinake *(fem.)* | gakizkiake *(masc.)* / gakizkinake *(fem.)* | zakiake *(masc.)* / zakinake *(fem.)* | zakizkiake *(masc.)* / zakizkinake *(fem.)* | dakizkiake *(masc.)* / dakizkinake *(fem.)* |
| hari | nakioke | hakioke | dakioke | gakizkioke | zakioke | zakizkioke | dakizkioke |
| guri | nakiguke | hakiguke | dakiguke | *(refl.)* | zakiguke | zakizkiguke | dakizkiguke |
| zuri | nakizuke | hakizuke | dakizuke | gakizkizuke | *(refl.)* | zakizkizuke | dakizkizuke |
| zuei | nakizuekete | hakizuekete | dakizuekete | gakizkizuekete | zakizuekete | *(refl.)* | dakizkizuekete |
| haiei | nakieke | hakieke | dakieke | gakizkieke | zakieke | zakizkieke | dakizkieke |

### Potentziala — Past

Past and hypothetical both swap in a `ne-`-flavoured prefix series (`nen-`/
`hen-`/…/`gen-`/`zen-`/`zen-`/…); past takes `ze-` for `hura`/`haiek`
(paralleling `zekion`-type forms) and the trailing `-en` on the `-ke` suffix
family:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidakeen | zekidakeen | genkizkidakeen | zenkidakeen | zenkizkidakeen | zekizkidakeen |
| hiri | nenkiakeen *(masc.)* / nenkinakeen *(fem.)* | *(refl.)* | zekiakeen *(masc.)* / zekinakeen *(fem.)* | genkizkiakeen *(masc.)* / genkizkinakeen *(fem.)* | zenkiakeen *(masc.)* / zenkinakeen *(fem.)* | zenkizkiakeen *(masc.)* / zenkizkinakeen *(fem.)* | zekizkiakeen *(masc.)* / zekizkinakeen *(fem.)* |
| hari | nenkiokeen | henkiokeen | zekiokeen | genkizkiokeen | zenkiokeen | zenkizkiokeen | zekizkiokeen |
| guri | nenkigukeen | henkigukeen | zekigukeen | *(refl.)* | zenkigukeen | zenkizkigukeen | zekizkigukeen |
| zuri | nenkizukeen | henkizukeen | zekizukeen | genkizkizukeen | *(refl.)* | zenkizkizukeen | zekizkizukeen |
| zuei | nenkizueketen | henkizueketen | zekizueketen | genkizkizueketen | zenkizueketen | *(refl.)* | zekizkizueketen |
| haiei | nenkiekeen | henkiekeen | zekiekeen | genkizkiekeen | zenkiekeen | zenkizkiekeen | zekizkiekeen |

### Potentziala — Hypothetical

…while the hypothetical takes `le-` for `hura`/`haiek` instead (paralleling
`liteke`'s own `li-`/`le-` alternation in §3) and drops the trailing `-en`,
landing back on the bare `-ke` suffix family:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidake | lekidake | genkizkidake | zenkidake | zenkizkidake | lekizkidake |
| hiri | nenkiake *(masc.)* / nenkinake *(fem.)* | *(refl.)* | lekiake *(masc.)* / lekinake *(fem.)* | genkizkiake *(masc.)* / genkizkinake *(fem.)* | zenkiake *(masc.)* / zenkinake *(fem.)* | zenkizkiake *(masc.)* / zenkizkinake *(fem.)* | lekizkiake *(masc.)* / lekizkinake *(fem.)* |
| hari | nenkioke | henkioke | lekioke | genkizkioke | zenkioke | zenkizkioke | lekizkioke |
| guri | nenkiguke | henkiguke | lekiguke | *(refl.)* | zenkiguke | zenkizkiguke | lekizkiguke |
| zuri | nenkizuke | henkizuke | lekizuke | genkizkizuke | *(refl.)* | zenkizkizuke | lekizkizuke |
| zuei | nenkizuekete | henkizuekete | lekizuekete | genkizkizuekete | zenkizuekete | *(refl.)* | lekizkizuekete |
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
| hiri | nakian *(masc.)* / nakinan *(fem.)* | *(refl.)* | dakian *(masc.)* / dakinan *(fem.)* | gakizkian *(masc.)* / gakizkinan *(fem.)* | zakian *(masc.)* / zakinan *(fem.)* | zakizkian *(masc.)* / zakizkinan *(fem.)* | dakizkian *(masc.)* / dakizkinan *(fem.)* |
| hari | nakion | hakion | dakion | gakizkion | zakion | zakizkion | dakizkion |
| guri | nakigun | hakigun | dakigun | *(refl.)* | zakigun | zakizkigun | dakizkigun |
| zuri | nakizun | hakizun | dakizun | gakizkizun | *(refl.)* | zakizkizun | dakizkizun |
| zuei | nakizueten | hakizueten | dakizueten | gakizkizueten | zakizueten | *(refl.)* | dakizkizueten |
| haiei | nakien | hakien | dakien | gakizkien | zakien | zakizkien | dakizkien |

### Subjuntiboa — Past

The mood/tense distinction lives entirely in the prefix here: past swaps in
the `ne-`-flavoured series (`nen-`/`hen-`/`ze-`/`gen-`/`zen-`/`zen-`/`ze-`)
over the *exact same* `-n` suffix family as the present:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | henkidan | zekidan | genkizkidan | zenkidan | zenkizkidan | zekizkidan |
| hiri | nenkian *(masc.)* / nenkinan *(fem.)* | *(refl.)* | zekian *(masc.)* / zekinan *(fem.)* | genkizkian *(masc.)* / genkizkinan *(fem.)* | zenkian *(masc.)* / zenkinan *(fem.)* | zenkizkian *(masc.)* / zenkizkinan *(fem.)* | zekizkian *(masc.)* / zekizkinan *(fem.)* |
| hari | nenkion | henkion | zekion | genkizkion | zenkion | zenkizkion | zekizkion |
| guri | nenkigun | henkigun | zekigun | *(refl.)* | zenkigun | zenkizkigun | zekizkigun |
| zuri | nenkizun | henkizun | zekizun | genkizkizun | *(refl.)* | zenkizkizun | zekizkizun |
| zuei | nenkizueten | henkizueten | zekizueten | genkizkizueten | zenkizueten | *(refl.)* | zekizkizueten |
| haiei | nenkien | henkien | zekien | genkizkien | zenkien | zenkizkien | zekizkien |

### Inperatiboa (imperative)

Like `izan`'s own imperative (§3's Agintera) and every Basque imperative
(§10), this is second/third-person only — no commanding yourself or "it" —
hence the `—` gaps filling the entire `ni`/`gu` columns. The `be-`-prefixed
`hura`/`haiek` cells are *jussive* ("let it be to me", "let them be to
him/her") rather than literal commands, mirroring `izan`'s own `bedi`/
`bitez`; the rest (`ha-`/`za-`/`za-`/`be-` over the bare present-style suffix
family, no trailing `-n`) is the same formula run one more time:

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | — | hakit | bekit | — | zakit | zakizkit | bekizkit |
| hiri | — | *(refl.)* | bekik *(masc.)* / bekin *(fem.)* | — | zakik *(masc.)* / zakin *(fem.)* | zakizkik *(masc.)* / zakizkin *(fem.)* | bekizkik *(masc.)* / bekizkin *(fem.)* |
| hari | — | hakio | bekio | — | zakio | zakizkio | bekizkio |
| guri | — | hakigu | bekigu | — | zakigu | zakizkigu | bekizkigu |
| zuri | — | hakizu | bekizu | — | *(refl.)* | zakizkizu | bekizkizu |
| zuei | — | hakizue | bekizue | — | zakizue | *(refl.)* | bekizkizue |
| haiei | — | hakie | bekie | — | zakie | zakizkie | bekizkie |

**On confidence:** every cell outside the original `hura`/`haiek` columns
(plus the `hiri`-row masc./fem. split, already covered above) is *generated*
by the formula at the top of this section rather than individually attested
— treat it as 📖-via-systematic-derivation from §14's template, not
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
§14's row-templates with nothing independently attested to validate against.
Same derivation method, just running with no safety net; worth knowing if
you're weighing how much to lean on any one form from these eight.

## 6. `ukan` with dative — NOR-NORI-NORK system · 📖

Used with ditransitive verbs — `eman` ("to give"), `esan` ("to say"), etc.
(`VERB_COVERAGE.md` §2/§4b). `NOR` fixed at 3sg `hura`; grid is `NORI`
(indirect object, rows) × `NORK` (subject, columns) — already the natural
bidimensional shape, just with tidier headers below and two new columns
(`zuk`/`zuek`) filled in courtesy of §15's `esan` paradigm, which happens to
be exactly this grid's `hari` row (NOR=hura, NORI=hari, NORK varying — the
classic ditransitive citation form).

### Present

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zidan *(⚠ — see note)* |  |  |  | zidaten |
| hari | diot | dio | diogu | diozu | diozue | diote |
| guri | — | zigun |  |  |  | ziguten |
| zuri | dizut | dizu | dizugu |  |  | dizute |
| haiei | diet | die | diegu |  |  | diete |

⚠️ **Still open** (§14 couldn't settle this either, see its own notes):
`zidan` in the `niri`/`hark` cell of a *present* table — `-an` is a
past-tense ending (compare this row's own `dio`, and `diot`/`zion` in the
past grid below), so it looks misplaced, and the present `niri`/`hark` cell
is probably the one left blank instead. Reproduced verbatim rather than
moved, since nothing here independently confirms what *should* fill the
present slot.

### Past

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zidan |  |  |  | zidaten |
| hari | nion *(⚠ vs. `nioen`)* | zion *(⚠ vs. `zioen`)* | genion *(⚠ vs. `genioen`)* | zenioen | zenioten | zioten |
| guri | — | zigun |  |  |  | ziguten |
| zuri | nizun | zizun | genizun |  |  | zizuten |
| haiei | nien | zien | genien |  |  | zieten |

⚠️ **New discrepancy spotted while filling this in**: §15's `esan` table
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

## 7. More classic synthetic `nor` verbs · 📖 (corroborates §8 of the original notes)

These four overlap with tables already compiled independently while writing
this reference (see the original `egon`/`joan`/`etorri`/`ibili` tables this
file started with — now folded in below with the `zu` row added). Every
overlapping cell **matched**, which is reassuring corroboration for both
sources; the `zu` row is new information from the merged paste.

A *third*, independent source corroborates the same four verbs again — a
classroom reference table covered in §15 (`eduki/egon/ekarri/erabili/eraman/
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
| hi | habil | *(not given by any source — `hi` consistently the gap, see §15's note above)* |
| hura | dabil | zebilen |
| gu | gabiltza | genbiltzan |
| zu | zabiltza | zenbiltzan *(filled in from §15)* |
| zuek | zabiltzate | zenbiltzaten *(filled in from §15)* |
| haiek | dabiltza | zebiltzan |

## 8. `jakin` and `ekarri` · 📖

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

Originally quoted here as "past-only/literary" from a partial source — §15's
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

## 9. `iraun`, `jario`, `esan`, `irudi`, `etzan` · 📖

This section started out as a holding pen for partial/🔍 leftovers from the
original research pass, but two sources arriving in succession have since
filled in every one of them. §15's classroom table completed `esan` first
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

§15's classroom table fills this in completely — for `esan`, "complete" means
NOR fixed at 3sg (`hura`/"it"), NORI fixed at 3sg (`hari`/"to him-her"), and
NORK varying — the same "citation paradigm" shape `VERBS` already uses for
`ukan` itself (§2):

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
table, though — same kind of corroboration §7's `egon`/`joan`/`etorri`/`ibili`
got, just from one source instead of three so far.

## 10. Imperative (agintera) · 📖

Second-person only — doesn't fill the usual six/seven-person table
(`VERB_COVERAGE.md` §3e already flags this as needing its own lesson shape).

| Verb | zu (formal sg.) | zuek (pl.) | hi |
|---|---|---|---|
| ukan *(generic "do it")* | ezazu | ezazue | ezak *(masc.)* / ezan *(fem.)* |
| ekarri ("bring") | ekarri ezazu | ekarri ezazue | — |
| etorri ("come") | zatoz | zatozte | hator |
| joan ("go") | zoaz | zoazte | hoa |

## 11. Periphrastic construction reference · 📖

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
| `nor-nori` (intransitive + dative) | `izan` with dative (§5) |
| `nor-nori-nork` (transitive + dative) | `ukan` with dative (§6) |

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

## 12. Pronoun & case reference · 📖

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

## 13. Beyond present / past — notes

Per `VERB_COVERAGE.md` §3, sketched rather than tabulated:

- **Future (geroa)** — periphrastic: stem + `-ko`/`-go` + auxiliary, e.g.
  *"etorriko naiz"*. Reuses existing auxiliary conjugations — cheapest tense
  to add next.
- **Conditional (baldintza/ondorioa)** — *"banintz"*, *"banu"*, *"banengo"*
  (if-clauses, "baldintza"); *"nintzateke"*, *"nuke"*, *"nengoke"* (the
  "would" result, "ondorioa") — full tables for `izan`/`ukan` now in §3/§4
  above (`egon`'s own — *"nengoke"* — still isn't sourced anywhere).
- **Potential (ahalera)** — *"naiteke"*, *"dezaket"*, *"nagoke"* (present);
  *"nintekeen"*, *"nezakeen"*, *"nengokeen"* (past). A closed synthetic `-ke`
  set, available only to verbs with full synthetic paradigms.
- **Subjunctive (subjuntiboa)** — *"nadin"*, *"dezadan"*, *"nengoen"* — mostly
  embedded in subordinate clauses (*"Nahi dut etor dadin"* = "I want him/her
  to come").
- **Imperative (agintera)** — see §10.

For periphrastic verbs, each of the above is actually a (non-finite verb form
× auxiliary tense) pair — e.g. *"ibiltzen naiz"* (present habitual), *"ibili
naiz"* (present perfect), *"ibiliko naiz"* (future).

---

## 14. Cross-check source: "Euskal aditz laguntzailea" chart · 📖

A dense, professionally-compiled auxiliary-verb paradigm chart (uploaded
2026-06-07) — three pages covering Batua (Lorenzo Zugazaga Martikorena),
Bizkaiera, and Zuberera (Jean Louis Davant), laid out as
mood × tense × `NOR`/`NOR-NORI`/`NOR-NORK`/`NOR-NORI-NORK` grids. It uses
heavily abbreviated morpheme-template notation rather than fully-spelled-out
words in most cells (e.g. `NA U T`, `Di (zki) GU GU`), which makes it
excellent for *checking specific forms someone already wrote down* but
error-prone to transcribe wholesale into prose tables — so it's used here as
a **cross-check against §3–§6's flagged issues**, not copied in full.

This source is also the first one seen so far with full **Bizkaiera and
Zuberera** paradigms side by side with Batua — directly relevant to the
`dialectVariants` extension point `CLAUDE.md` describes (e.g.
`dialectVariants: { bizkaiera: { conjugations: {...} } }`), should the app
ever grow dialect support beyond the current `dialect: 'batua'` placeholder.
Worth keeping in mind as a source for that, once decoded more rigorously.

## 15. Classroom reference table — three new synthetic verbs · 📖

Source: *"Aditz trinkoak: eduki, egon, ekarri, erabili, eraman, esan, etorri,
ibili, jakin, joan"* (uploaded 2026-06-07; dated 2011, `santutxu` /
euskarians.wordpress.com). A one-page classroom handout giving present + past
for ten synthetic verbs side by side, in a **six-person layout that omits
`hi`** (`ni / hura / gu / zu / zuek / haiek` — same shape as `ukan`'s
citation paradigm in §2, just spread across more verbs). It overlaps with
material already in this file for `egon`/`joan`/`etorri`/`ibili` (§7, now
triple-corroborated, and its `ibili` past-tense gaps for `zu`/`zuek` filled
in from here too) and `ekarri`/`esan` (§8/§9, now filled in above, with
`esan`'s full paradigm doubling as new data for §6's NOR-NORI-NORK grid —
including a discrepancy worth a flag, see §6's notes) — and adds **three
verbs not seen in any source so far**: `eduki`, `erabili`, `eraman`. None of
these three are in `VERBS` yet.

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

⚠️ As with everything past §2, these are merged in as **unverified leads**,
not facts — the `(sg./pl. obj.)` split is *inferred* from the source's
`X(Y)` shorthand by analogy with `VERBS`' own `(z)`/`(zki)` convention and
with `ekarri`'s spelled-out split above, not spelled out letter-by-letter in
the source itself for `eduki`/`erabili`/`eraman`. Worth a grammar check
before any of the three goes into `VERBS`.

---

## Where this stands

The cross-check against §14/§15 resolved every issue it could — those fixes
are folded directly into §3's and §4's tables, not narrated here (per the
`VERB_COVERAGE.md` lesson about flagging rather than silently rewriting:
the corrections themselves are visible in the tables, and that's what matters
for reuse). Two genuine discrepancies survived the cross-check and remain open
— both live in §6, flagged inline at the exact cell where they occur:

- the `niri`/`hark` cell of the **present**-tense `NOR-NORI-NORK` grid
  (`zidan` — looks like a misplaced past-tense form; see §6's first ⚠️ note)
- the `hari` row of the **past**-tense `NOR-NORI-NORK` grid (`nion`/`zion`/
  `genion` vs. `nioen`/`zioen`/`genioen` — two sources disagree; see §6's
  second ⚠️ note)

Neither blocks using the verified §1/§2 tables or the triple-corroborated §7
ones. They — plus the remaining gaps in §8–§10 and the blank cells still
visible in §4–§6's grids — are exactly what a grammar-reference pass would
need to close before anything from the 📖 sections goes into `VERBS`.
