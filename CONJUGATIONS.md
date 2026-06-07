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
  Batua forms, merged in from a larger paste, **not yet checked against a
  grammar source**. Treat as a starting point, not ground truth — see
  "⚠️ Spotted issues" at the end before reusing any of it in `VERBS`. Some
  📖 cells have since been cross-checked against the two further sources in
  §14/§15 (and a few corrected as a result) — those call out their own
  resolution status inline rather than getting a whole new marker
- 🔍 — partial forms only, as they surfaced while researching
  `VERB_COVERAGE.md`; the full paradigm isn't confirmed, so it's quoted
  verbatim rather than filled in

**Sources merged in, in arrival order:** an initial larger paste (§3 onward);
a professionally-typeset paradigm-chart PDF covering Batua/Bizkaiera/Zuberera
(§14, "Euskal aditz laguntzailea"); a 2011 classroom handout covering ten
synthetic verbs (§15, "Aditz trinkoak"). §14 and §15 mostly serve as
*cross-checks* on material already here — see each section's own notes for
exactly what they confirmed, corrected, or couldn't settle.

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
periphrastic system. **Read "⚠️ Spotted issues" before trusting any single
cell** — a few likely typos and one likely mislabel were caught on the first
pass, which means others may remain.

## 3. `izan` — additional paradigms · 📖

### Conditional (baldintza)

| Person | Form |
|---|---|
| ni | nintzateke |
| hi | hintzateke *(corrected — the merged paste had repeated `hintzen`, the past-tense form, here; `hintzateke` is now confirmed directly against the "Euskal aditz laguntzailea" chart, see §14)* |
| hura | litzateke |
| gu | ginateke |
| zu | zinateke |
| zuek | zinatekete |
| haiek | lirateke |

### Potential (ahalera) — partial

| Person | Form |
|---|---|
| ni | naiteke |
| hura | daiteke |
| gu | gaitezke |
| zu | zaitezke |
| haiek | daitezke |

## 4. `ukan` — object-agreement grids (NOR-NORK) · 📖

`VERBS` only models `ukan` in its citation form (NOR fixed at 3sg `hura`).
The full paradigm varies the verb by **both** subject (NORK) and object (NOR)
— the source material breaks this out cell by cell:

### 4a. NOR = hura ("it/him/her") — present

| NORK (subject) | Form |
|---|---|
| nik | dut |
| hik | duk *(masc. subject)* / dun *(fem. subject — see ⚠️)* |
| hark | du |
| guk | dugu |
| zuk | duzu |
| zuek | duzue |
| haiek | dute |

### 4b. NOR = hura — past

| NORK | Form |
|---|---|
| nik | nuen |
| hik | huen |
| hark | zuen |
| guk | genuen |
| zuk | zenuen |
| zuek | zenuten |
| haiek | zuten |

### 4c. NOR = hura — conditional

| NORK | Form |
|---|---|
| nik | nuke |
| hark | luke |
| guk | genuke |
| zuek | zenukete |
| haiek | lukete |

### 4d. NOR = haiek ("them") — present / past

| NORK | Present | Past |
|---|---|---|
| nik | ditut | nituen |
| hark | ditu | zituen |
| guk | ditugu | genituen |
| zuk | dituzu | zenituen |
| zuek | dituzue | zenituzten |
| haiek | dituzte | zituzten |

### 4e. NOR = ni ("me") — present / past

| NORK | Present | Past |
|---|---|---|
| hik | nauk *(masc.)* / naun *(fem.)* | — |
| hark | nau | ninduen |
| guk | — *(reflexive — "we have me" doesn't occur)* | — |
| zuk | nauzu | ninduzun |
| zuek | nauzue | — |
| haiek | naute | ninduten |

### 4f. NOR = gu ("us") — present / past

| NORK | Present | Past |
|---|---|---|
| hark | gaitu | gintuen |
| zuk | gaituzu | — |
| zuek | gaituzue | — |
| haiek | gaituzte | gintuzten |

### 4g. NOR = zu ("you, sg.") — present / past

| NORK | Present | Past |
|---|---|---|
| nik | zaitut | zintudan |
| hark | zaitu | zintuen |
| guk | zaitugu *(⚠️ pasted source had `zaituugu` — almost certainly a typo)* | zintugun |
| haiek | zaituzte | zintuzten |

### 4h. NOR = zuek ("you, pl.") — present (partial)

| NORK | Form |
|---|---|
| nik | zaituztet |
| hark | zaituzte |
| guk | zaituztegu *(⚠️ pasted source had `zaituzteugu` — almost certainly a typo)* |
| haiek | zaituzte |

## 5. `izan` with dative — NOR-NORI system · 📖

Used with intransitive verbs that take an indirect object — `gustatu`,
`iruditu`, etc. (`VERB_COVERAGE.md` §2 covers why this pattern usually rides
on `izan`'s own auxiliary paradigm rather than a standalone lexical verb).

### NOR = hura ("it") — present

| NORI (indirect object) | Form |
|---|---|
| niri | zait |
| hiri | zaik *(masc.)* / zain *(fem.)* |
| hari | zaio |
| guri | zaigu |
| zuri | zaizu |
| zuei | zaizue |
| haiei | zaie |

### NOR = hura — past

| NORI | Form |
|---|---|
| niri | zitzaidan |
| hari | zitzaion |
| guri | zitzaigun |
| haiei | zitzaien |

### NOR = haiek ("they/them") — present (partial)

| NORI | Form |
|---|---|
| niri | zaizkit |
| hari | zaizkio |
| guri | zaizkigu |
| haiei | zaizkie |

## 6. `ukan` with dative — NOR-NORI-NORK system · 📖

Used with ditransitive verbs — `eman` ("to give"), `esan` ("to say"), etc.
(`VERB_COVERAGE.md` §2/§4b). NOR fixed at 3sg `hura`; rows are NORI
(indirect object), columns are NORK (subject).

### Present

| NORI | NORK = nik | NORK = hark | NORK = guk | NORK = haiek |
|---|---|---|---|---|
| niri | — | zidan | *(blank in source — marked `?`)* | zidaten |
| hari | diot | dio | diogu | diote |
| guri | — | zigun | — | ziguten |
| zuri | dizut | dizu | dizugu | dizute |
| haiei | diet | die | diegu | diete |

⚠️ Note `zidan` in the `niri`/`hark` cell of a *present* table — `-an` is a
past-tense ending (compare `dio` → `zion`, `diot` → `nion` below), so this
looks like it belongs in the past table, not here, and the present `niri`/
`hark` cell is probably the one left blank. Treat this whole grid as
rough-draft until checked.

### Past

| NORI | NORK = nik | NORK = hark | NORK = guk | NORK = haiek |
|---|---|---|---|---|
| niri | — | zidan | — | zidaten |
| hari | nion | zion | genion | zioten |
| guri | — | zigun | — | ziguten |
| zuri | nizun | zizun | genizun | zizuten |
| haiei | nien | zien | genien | zieten |

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
| hi | habil | *(not given)* |
| hura | dabil | zebilen |
| gu | gabiltza | genbiltzan |
| zu | zabiltza | *(not given)* |
| zuek | zabiltzate | *(not given)* |
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

## 9. `iraun`, `jario`, `esan`, `irudi` — partial forms · 🔍

(Unchanged from the original research pass — see `VERB_COVERAGE.md` for full
context and sourcing.)

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

### `jario` — "to flow / ooze" (nor-nori; defective, effectively fixed `nor`)

- Present, by `nori` person: `dari(zki)t/k/o/gu/zu/zue/e` → **dariot** (to me),
  **dario** (to him/her), **darizkio** (to him/her, plural object)…
- Past (standard Batua): **zeridan / zerion / zerigun**…
- Past (Bizkaian variant — `jario`'s own past stem, not a separate verb):
  **darie** / **erion**

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
- **Conditional (baldintza/hipotetikoa)** — *"banintz"*, *"banu"*, *"banengo"*
  (if-clauses); *"nintzateke"*, *"nuke"*, *"nengoke"* (the "would" result) —
  partial tables in §3/§4c above.
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
triple-corroborated) and `ekarri`/`esan` (§8/§9, now filled in above) — and
adds **three verbs not seen in any source so far**: `eduki`, `erabili`,
`eraman`. None of these three are in `VERBS` yet.

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

## ⚠️ Spotted issues in the merged reference (§3–§6) — now cross-checked against §14

Original caution stands — flag rather than silently "fix," per the
`VERB_COVERAGE.md` lesson from getting `irudi`/`etzan` wrong once. Three of
the four items below are now resolved by the §14 chart; one remains open.

1. **✅ RESOLVED — §3 `izan` conditional, `hi` row.** Was `hintzen` (a past
   tense form, wrong paradigm). The §14 chart spells out the full
   `BALDINTZAZKOAK → ONDORIOA → ORAIN` row in plain text: *nintzateke,
   hintzateke, litzateke, ginateke, zinateke, zinatekete, lirateke* —
   confirming the guess. §3's table has been corrected to `hintzateke`.
2. **✅ RESOLVED (re-explained) — §4a `duk`/`dun` gloss.** The §14 chart uses
   the alternation marker `K/N` (and the parallel `A/NA`) consistently and
   *only* in cells where `hi` is itself a grammatical argument — as `NOR`
   (object), `NORI` (dative), and `NORK` (subject) alike (e.g. the `NOR-NORK`
   present key shows `HA U K/N` for the `hi`-marker slot, and the
   `NOR-NORI-NORK` grids show `K/N (A/NA)K/N` wherever `hi` fills `NORI` and/or
   `NORK`). It never shows up attached to *other* persons' forms the way a
   true allocutive marker would (allocutive agreement surfaces on a sentence
   even when `hi` isn't an argument at all — a distinct phenomenon `VERB_COVERAGE.md`
   §1 also discusses, easy to conflate with this one). That distribution lines
   up with "`hi`'s own grammatical-role forms vary by `hi`'s gender," not
   "forms vary by the *addressee's* gender" — so the gloss in the merged paste
   ("(to male)/(to female)") was very likely the wrong one of the two
   related phenomena, exactly as suspected. The forms `duk`/`dun` themselves
   stand confirmed.
3. **✅ RESOLVED — §4g/§4h `zaitugu`/`zaituztegu`.** The §14 `NOR-NORK` present
   key spells the `zu`-object and `zuek`-object templates as `ZA it U ZU`→
   …`+gu` and `ZA it U zte ZUE`→ …`+gu` respectively — i.e. `za-it-u-(zte)-gu`,
   matching the corrected `zaitugu`/`zaituztegu` and ruling out the
   doubled-vowel `zaituugu`/`zaituzteugu` from the original paste.
4. **🔍 STILL OPEN — §6 present grid, `niri`/`hark` cell (`zidan`).** The §14
   chart's `NOR-NORI-NORK` present grid is written in the same compressed
   morpheme-template style as the rest of the chart (no plain-spelled `zidan`/
   `dit`-type forms to compare against directly), so it doesn't settle this
   one either way. Still flagged as probably-misplaced-past-tense rather than
   asserted as fixed.

None of this should block using the verified §1/§2 tables (or the
corroborated §7 ones) — it's specifically item 4 above, plus the gaps in
§8–§10, that still need a grammar-reference pass before anything from them
goes into `VERBS`.
