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
  "⚠️ Spotted issues" at the end before reusing any of it in `VERBS`
- 🔍 — partial forms only, as they surfaced while researching
  `VERB_COVERAGE.md`; the full paradigm isn't confirmed, so it's quoted
  verbatim rather than filled in

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
| hi | *(see ⚠️ — pasted source repeated `hintzen`, the past-tense form, here; the pattern of this table suggests it should be `hintzateke`)* |
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

### `ekarri` — "to bring" — nor-nork (synthetic forms are past-only/literary)

| Person | Past |
|---|---|
| nik | nekarren |
| hark | zekarren |
| guk | genekarren |
| haiek | zekartzaten |

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

- **dio / diot / diozu**…

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

## ⚠️ Spotted issues in the merged reference (§3 onward)

Flagging these explicitly rather than silently "fixing" them, since I'm not
certain enough of the correct forms to assert them as fact — exactly the
caution `VERB_COVERAGE.md` urges after getting `irudi`/`etzan` wrong once:

1. **§3 `izan` conditional, `hi` row** — gives `hintzen`, which is `izan`'s
   *past*-tense `hi` form (see §1), not a conditional. Every other person in
   that same table follows an `-ateke`/`-atekete` pattern, which would predict
   something like `hintzateke`. Left as a flagged blank rather than guessed.
2. **§4a `duk`/`dun` gloss** — the source labels these "(to male)" / "(to
   female)", implying *allocutive* agreement (verb shape depends on the
   listener). But `hi` here **is** the grammatical subject (`hik... du`), and
   `VERB_COVERAGE.md` §1 describes a *different*, non-allocutive phenomenon —
   `hi`'s own grammatical-subject forms varying by `hi`'s gender (its `iraun`
   quote shows exactly this: "Hik dirauk/n" as alternatives for the same
   slot). The *forms* `duk`/`dun` are plausibly right; the *explanation*
   attached to them in the source looks like it's reaching for the wrong one
   of two related-but-distinct phenomena.
3. **§4g/§4h `zaituugu`/`zaituzteugu`** — corrected here to `zaitugu`/
   `zaituztegu`; doubled vowels like this don't occur in these endings
   elsewhere in the paradigm, and the corrected forms match the regular
   `-gu`/`-tegu` 1st-person-plural-subject pattern seen throughout §4.
4. **§6 present grid, `niri`/`hark` cell** — shows `zidan`, a past-tense `-an`
   form (compare the present-tense `dio`/`diot` elsewhere in the same row/
   table), sitting in a table labelled "present." Likely belongs in the past
   grid below it instead, leaving the present cell blank — but left as a
   verbatim flag rather than moved, since I can't independently confirm what
   *should* fill the present slot.

None of this should block using the verified §1/§2 tables (or the
corroborated §7 ones) — it's specifically the parts newly merged in via §3–§6
and the gaps in §8–§10 that need a grammar-reference pass before anything from
them goes into `VERBS`.
