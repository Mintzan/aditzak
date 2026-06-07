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
filled out `jario`'s paradigm and supplied `etzan`'s from scratch. §14/§15
mostly serve as *cross-checks* on material already here; §9's new source
instead grows verbs that were previously fragmentary or single-form-only —
see each section's own notes for exactly what each contributed.

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
column is itself worth noting: **no source seen so far gives any "(someone)
has you, familiar" form** — a gap of exactly the kind `VERB_COVERAGE.md` §1
already flags for `hi`/`zu`.

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

## 5. `izan` with dative — NOR-NORI system · 📖

Used with intransitive verbs that take an indirect object — `gustatu`,
`iruditu`, etc. (`VERB_COVERAGE.md` §2 covers why this pattern usually rides
on `izan`'s own auxiliary paradigm rather than a standalone lexical verb).
Laid out as a grid (`NORI` rows × `NOR` columns) rather than one-`NOR`-at-a-
time, like §4 — `NOR` only takes the singular/plural-object contrast here, so
the columns line up directly with §4's "further moods" pairing. Once you lay
it out this way, the `NOR = haiek` column visibly **= the `NOR = hura` column
with `-zki-` infixed** (`zait → zaizkit`, `zaio → zaizkio`, …) — a clean,
regular pattern, for whatever that's worth from an unverified 📖 source.

### Present

| NORI ↓ ╲ NOR → | hura ("it") | haiek ("they") |
|---|---|---|
| niri | zait | zaizkit |
| hiri | zaik *(masc.)* / zain *(fem.)* |  |
| hari | zaio | zaizkio |
| guri | zaigu | zaizkigu |
| zuri | zaizu |  |
| zuei | zaizue |  |
| haiei | zaie | zaizkie |

### Past

| NORI ↓ ╲ NOR → | hura ("it") |
|---|---|
| niri | zitzaidan |
| hari | zitzaion |
| guri | zitzaigun |
| haiei | zitzaien |

(Blanks are sourcing gaps, same convention as §4 — not "doesn't exist".)

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

## 9. `iraun`, `jario`, `esan`, `irudi`, `etzan` · 🔍 / 📖

`iraun`/`irudi` are unchanged from the original research pass — see
`VERB_COVERAGE.md` for full context and sourcing, still partial/🔍. `esan` no
longer belongs in that company: §15 filled it in completely (📖, full table
below) — kept here rather than relocated, since it's still the same verb
this section was already tracking. `jario` and `etzan` have grown the same
way, courtesy of a new PDF dedicated to rarer/non-standard synthetic verbs
("trinko-ezohiko-batzuk", euskarians.wordpress.com, 2012): it spells out
`jario`'s full present/past `NOR-NORI` paradigm (templated, below — far more
than the fragment that was here before) and supplies `etzan`'s complete `nor`
paradigm from scratch (it previously had only its bare 3sg `datza` confirmed —
`VERB_COVERAGE.md` flags it as a rare, "recognise it when you see it" verb
that native teaching materials steer learners away from).

### `iraun` — "to last / endure" (present only)

| Person | Present |
|---|---|
| ni | diraut |
| hi | dirauk / diraun *(masc./fem. — see allocutive note in `VERB_COVERAGE.md` §1)* |
| hura | dirau |
| gu | diraugu |
| zu | dirauzu |
| zuek | dirauzue |
| haiek | diraute |

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

- **dirudi**, **dirudizu**… A false-friend pairing flagged in
  `VERB_COVERAGE.md`: `iruditu` ("iruditzen zait" = "it seems to me",
  subjective opinion, nor-nori) vs. `irudi` ("dirudizu" = "you give the
  impression", external appearance, nor-nork) — cognates that drifted apart in
  both meaning *and* agreement.

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
