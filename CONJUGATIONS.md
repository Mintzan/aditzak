# Basque verb conjugations — a reference

A reference for Basque (Euskara) verb conjugation paradigms — covering both
the forms used in Aditzak's lessons and a broader set of synthetic and
periphrastic paradigms.

Persons follow a seven-person model: `ni / hi / hura / gu / zu / zuek /
haiek`. Aditzak's own data (`VERBS` in `src/App.jsx`) uses a six-person model
that omits `zu`.

**Notation:**
- `*(refl.)*` — reflexive: `NOR` and `NORK` (or `NOR` and `NORI`) refer to the
  same person, so the form doesn't occur ("I have me", "I am to myself")
- `*(hika/zuka)*` — `hi` (familiar address, *hika*) and `zu`/`zuek`
  (formal/plural address, *zuka*) are mutually exclusive registers; no verb
  form can take one as one argument and the other as the second
- `*(zu↔zuek)*` — `zu` and `zuek` share a single underlying morpheme block and
  can't simultaneously fill two argument slots (e.g. `NORI` and `NORK`) of the
  same form. Basque routes around this syntactically (e.g. `Zuen buruari
  ematen diozue`, "you-all give it to your own selves") rather than with a
  synthetic form
- `*(masc.)*` / `*(fem.)*` — forms addressed to a `hi`-interlocutor split by
  the addressee's gender (the *hitano*/allocutive `-k`/`-n` or `-a-`/`-na-`
  alternation)
- `(sg./pl. obj.)` or `X(Y)` — plural-object alternants, marked with
  `-z-`/`-zki-`/`-tza-` infixes depending on the paradigm
- `—` — no form (gap, or not applicable)

---

## 1. `izan` — "to be" · nor

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | naiz | nintzen |
| hi | haiz | hintzen |
| hura | da | zen |
| gu | gara | ginen |
| zuek | zarete | zineten |
| haiek | dira | ziren |

---

## 2. `izan` — additional paradigms

`izan`'s full mood/tense system. **Baldintza** (the *if*-clause — "if I
were") and **ondorioa** (the *consequence* clause — "I would be") are two
distinct paradigms that are easy to conflate, so they're kept separate below,
alongside the potential, subjunctive, and `izan`'s own imperative.

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

Second/third-person only, like every Basque imperative (§9) — `izan` doesn't
have first-person or "hura"-as-addressee imperative forms, hence the gaps
below (you can't command yourself or "it"; `bedi`/`bitez` are the 3rd-person
*jussive* "let X be" forms, not commands to "hura"/`haiek`):

| Person | Form |
|---|---|
| ni | — |
| hi | hadi |
| hura | bedi *("let it/him/her be")* |
| gu | — |
| zu | zaitez |
| zuek | zaitezte |
| haiek | bitez *("let them be")* |

## 3. `ukan` — "to have" (the `du` auxiliary) · NOR-NORK system

### Citation form

`VERBS` models `ukan` with `NOR` fixed at 3rd-person singular absolutive
("it/him/her"), as `object: 'hura'`. This is the `hura` column of the full
grid below, restricted to the six persons `VERBS` models (no `zu`; `hi` shown
unsplit):

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | dut | nuen |
| hi | duk | huen |
| hura | du | zuen |
| gu | dugu | genuen |
| zuek | duzue | zenuten |
| haiek | dute | zuten |

The full paradigm varies by both `NORK` (subject, rows) *and* `NOR` (object,
columns) — see the grids below. *Blank cells (`—`) are gaps; `*(refl.)*` and
`*(hika/zuka)*` mark combinations that are impossible by grammar* (see
Notation above).

### Further moods (citation paradigm: `NOR` fixed at `hura`/`haiek`)

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

The citation paradigm and "Further moods" above fix `NOR` at `hura`/`haiek`
("having *something*"). The grids below extend `NOR` across all seven
persons — "*you* have *me*", "*they* had *us*", etc.

Each cell follows the recipe **[`NOR`-prefix] + stem `-u-` + [`NORK`-suffix]**
(+ tense markers):

- **Present** — prefixes `na-/ha-/d-/gait-/zait-/zait-…-zte-/dit-` (for
  `ni/hi/hura/gu/zu/zuek/haiek`) + stem `-u-` + suffixes `-t/-k(/-n)/-∅/-gu/
  -zu/-zue/-te` (for `nik/hik/hark/guk/zuk/zuek/haiek`)
- **Past** — prefixes `nind-/hind-/(—)/gint-/zint-/zint-…-zte-/(—)` (no
  `hura`/`haiek` row — those run on the plain-word paradigm above instead) +
  stem `-u-` + suffixes `-da-n/-a-n(/-na-n)/-en/-gu-n/-zu-n/-zue-n/-te-n`

A plural-object stem (`-it-/-int-`) takes an epenthetic `-z-` right before the
`haiek`-subject suffix `-te(n)`: `dit-u-` + `-te` → `dituzte` (not
`*ditute`), and `gint-u-` + `-te-n` → `gintuzten` (not `*ginduten`).

#### Present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | haut | dut | *(refl.)* | zaitut | zaituztet | ditut |
| hik *(`-k`/`-n`)* | nauk / naun | *(refl.)* | duk / dun | gaituk / gaitun | *(hika/zuka)* | *(hika/zuka)* | dituk / ditun |
| hark | nau | hau | du | gaitu | zaitu | zaituzte | ditu |
| guk | *(refl.)* | haugu | dugu | *(refl.)* | zaitugu | zaituztegu | ditugu |
| zuk | nauzu | *(hika/zuka)* | duzu | gaituzu | *(refl.)* | *(refl.)* | dituzu |
| zuek | nauzue | *(hika/zuka)* | duzue | gaituzue | *(refl.)* | *(refl.)* | dituzue |
| haiek | naute | haute | dute | gaituzte | zaituzte | zaituztete | dituzte |

#### Past — `NOR` = 1st/2nd person

`zuek`-as-object is left blank (`—`) throughout.

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hindudan | nuen | *(refl.)* | zintudan | zintuztedan | nituen |
| hik | ninduan / nindunan | *(refl.)* | huen | gintuan / gintunan | *(hika/zuka)* | *(hika/zuka)* | hituen |
| hark | ninduen | hinduen | zuen | gintuen | zintuen | zintuzten | zituen |
| guk | *(refl.)* | hindugun | genuen | *(refl.)* | zintugun | zintuztegun | genituen |
| zuk | ninduzun | *(hika/zuka)* | zenuen | gintuzun | *(refl.)* | *(refl.)* | zenituen |
| zuek | ninduzuen | *(hika/zuka)* | zenuten | gintuzuen | *(refl.)* | *(refl.)* | zenituzten |
| haiek | ninduten | hinduten | zuten | gintuzten | zintuzten | zintuzteten | zituzten |

`hik`'s row isn't gender-split in the past (`huen` only, vs. present
`duk`/`dun`).

### Baldintza, Ondorioa

These run on the same `nind-/hind-/gint-/zint-` prefix series and `-u(-ke)-`
stem as the indicative grids above. Baldintza adds a `Ba-` protasis prefix and
drops the past `-n` (mirroring `banintz`/`banu`); Ondorioa inserts `-ke-`
before the present/past suffix families respectively. `zuek`-as-object is
again left blank except `hik`→`zuek`, which is `*(hika/zuka)*`-impossible.

#### Baldintza — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | bahindut | banu | *(refl.)* | bazintut | bazintuztet | banitu |
| hik | baninduk / banindun | *(refl.)* | bahu | bagintuk / bagintun | *(hika/zuka)* | *(hika/zuka)* | bahitu |
| hark | banindu | bahindu | balu | bagintu | bazintu | bazintuzte | balitu |
| guk | *(refl.)* | *(refl.)* | bagenu | *(refl.)* | bazintugu | bazintuztegu | bagenitu |
| zuk | baninduzu | *(hika/zuka)* | bazenu | bagintuzu | *(refl.)* | *(refl.)* | bazenitu |
| zuek | baninduzue | *(hika/zuka)* | bazenute | bagintuzue | *(refl.)* | *(refl.)* | bazenituzte |
| haiek | banindute | bahindute | balute | bagintuzte | bazintuzte | bazintuztete | balituzte |

One pragmatic note: `bagintuk`/`bagintun` (`hik`→`gu`, "if you had us") is
structurally fine but rare in practice — addressing one person intimately
(`hi`) while the object is a group (`gu`) doesn't come up much.

#### Ondorioa, present — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hinduket | nuke | *(refl.)* | zintuket | zintuzketet | nituzke |
| hik | nindukek / ninduken | *(refl.)* | huke | gintukek / gintuken | *(hika/zuka)* | *(hika/zuka)* | hituzke |
| hark | ninduke | hinduke | luke | gintuke | zintuke | zintuzkete | lituzke |
| guk | *(refl.)* | *(refl.)* | genuke | *(refl.)* | zintukegu | zintuzketegu | genituzke |
| zuk | nindukezu | *(hika/zuka)* | zenuke | gintukezu | *(refl.)* | *(refl.)* | zenituzke |
| zuek | nindukezue | *(hika/zuka)* | zenukete | gintukezue | *(refl.)* | *(refl.)* | zenituzkete |
| haiek | nindukete | hindukete | lukete | gintuzkete | zintuzkete | zintuzketete | lituzkete |

#### Ondorioa, past — `NOR` = 1st/2nd person

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hindukedan | nukeen | *(refl.)* | zintukedan | zintuzketedan | nituzkeen |
| hik | nindukean / nindukenan | *(refl.)* | hukeen | gintukean / gintukenan | *(hika/zuka)* | *(hika/zuka)* | hituzkeen |
| hark | nindukeen | hindukeen | zukeen | gintukeen | zintukeen | zintuzketen | zituzkeen |
| guk | *(refl.)* | *(refl.)* | genukeen | *(refl.)* | zintukegun | zintuzketegun | genituzkeen |
| zuk | nindukezun | *(hika/zuka)* | zenukeen | gintukezun | *(refl.)* | *(refl.)* | zenituzkeen |
| zuek | nindukezuen | *(hika/zuka)* | zenuketen | gintukezuen | *(refl.)* | *(refl.)* | zenituzketen |
| haiek | ninduketen | hinduketen | zuketen | gintuzketen | zintuzketen | zintuzketeten | zituzketen |

**The `-zke-` merger**: when the object is plural (`NOR` = `zuek`/`haiek`), or
the subject is `haiek` acting on a `zint-`/`gint-` stem, the conditional
`-ke-` merges with the pluralizer `-z-` to become **`-zke-`**, which moves
*before* the tense/person suffixes rather than after: `zint-u-ke-zte` →
`zint-u-zke-te` (`zintuzkete`), not `zintukezte`. The same shape appears in
`lituzke`, `genituzke`, `zenituzke`, `lituzkete`, `hituzke`, `hituzkeen`,
`zituzkeen`, `zituzketen`.

### Ahalera — Orainaldia, Alegiazkoa, Lehenaldia

These three tenses use two different templates:

- **Orainaldia** (present, "I *can* do it") — `NOR` marked by prefix
  (`na-/ha-/de-/gait-/zait-/zait-…-te-/dit-`), `NORK` marked by suffix, stem
  `-zake-` — the same shape as indicative `ukan` above (`dezaket`, `nazake`,
  `gaitzake`, `zaitzaket`, `ditzaket`, …).
- **Alegiazkoa** (hypothetical, "I *could/would be able to* do it") and
  **Lehenaldia** (past, "I *could have* done it") — `NORK` marked by prefix
  (mirroring the `*ezan`-suppletive pattern), `NOR` stem-internal:
  `nezake`/`nezakeen`, `lezake`/`zezakeen`, …

In all three grids below, `*(refl.)*` additionally covers cells where `NOR`
and `NORK` belong to the same person category (1st: `ni`/`gu`; 2nd:
`zu`/`zuek`) — not just the literal `NOR`=`NORK` diagonal. So `guk`→`ni` ("we
[verb] me") and `nik`→`gu` ("I [verb] us") are both `*(refl.)*`, and likewise
`zuk`↔`zuek` both ways.

`hi` as `NOR` follows the same `nin-/hin-/gin-/zin-…`-prefix + `-tza-ke(-en)`
stem shape that `ni`/`gu`/`zu`/`zuek` already use (`hintzake` mirrors
`nintzake`/`gintzake`/`zintzake` exactly), closed with the ordinary `NORK`
suffix family (`-t`/`∅`/`-gu`/`-te` for `nik`/`hark`/`guk`/`haiek`; `zuk`/
`zuek`→`hi` are `*(hika/zuka)*`, like every other `hi`-as-argument cell next to
a `zu`/`zuek` argument). `hik` as `NORK` → `ni`/`gu` mirrors Ahalera
Orainaldia's `-k`/`-n` gender split for Alegiazkoa (`nintzakek`/`nintzaken`,
`gintzakek`/`gintzaken`), but for Lehenaldia follows the indicative past's
`-an`/`-nan` split instead (`ninduen`→`ninduan`/`nindunan` mirrored as
`nintzakeen`→`nintzakean`/`nintzakenan`) — the same "present splits via
`-k`/`-n`, past splits via `-a-`/`-na-`" division already seen between
Ahalera-Orainaldia and Subjuntiboa.

#### Ahalera, Orainaldia (Present) — "I can…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hazaket | dezaket | *(refl.)* | zaitzaket | zaitzaketet | ditzaket |
| hik | nazakek *(masc.)* / nazaken *(fem.)* | *(refl.)* | dezakek *(masc.)* / dezaken *(fem.)* | gaitzakek *(masc.)* / gaitzaken *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | ditzakek *(masc.)* / ditzaken *(fem.)* |
| hark | nazake | hazake | dezake | gaitzake | zaitzake | zaitzakete | ditzake |
| guk | *(refl.)* | hazakegu | dezakegu | *(refl.)* | zaitzakegu | zaitzaketegu | ditzakegu |
| zuk | nazakezu | *(hika/zuka)* | dezakezu | gaitzakezu | *(refl.)* | *(refl.)* | ditzakezu |
| zuek | nazakezue | *(hika/zuka)* | dezakezue | gaitzakezue | *(refl.)* | *(refl.)* | ditzakezue |
| haiek | nazakete | hazakete | dezakete | gaitzakete | zaitzakete | zaitzakete(te) | ditzakete |

`hi`-as-`NOR` takes the absolutive-2nd-singular prefix `h-` + `-zake-`,
gender-invariant regardless of who's speaking (`hazake`, `hazaket`,
`hazakegu`, `hazakete` for `hark`/`nik`/`guk`/`haiek` → `hi`). `hik`-as-`NORK`
→ `ni`/`gu` follows the masc./fem. `-k`/`-n` split (`nazakek`/`nazaken`,
`gaitzakek`/`gaitzaken`). `zaitzakete(te)` (`haiek`→`zuek`) is reproduced
verbatim, parentheses included, the same kind of doubled `-te`/`-zte` territory
as the `zuek`-as-object cells in the `ukan` grids above.

#### Ahalera, Alegiazkoa (Hypothetical) — "I would be able to…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hintzaket | nezake | *(refl.)* | zintzaket | zintzaketet | nitzake |
| hik | nintzakek *(masc.)* / nintzaken *(fem.)* | *(refl.)* | hezake | gintzakek *(masc.)* / gintzaken *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | hitzake |
| hark | nintzake | hintzake | lezake | gintzake | zintzake | zintzakete | litzake |
| guk | *(refl.)* | hintzakegu | genezake | *(refl.)* | zintzakegu | zintzaketegu | genitzake |
| zuk | nintzakezu | *(hika/zuka)* | zenezake | gintzakezu | *(refl.)* | *(refl.)* | zenitzake |
| zuek | nintzakezue | *(hika/zuka)* | zenezakete | gintzakezue | *(refl.)* | *(refl.)* | zenitzakete |
| haiek | nintzakete | hintzakete | lezakete | gintzakete | zintzakete | zintzakete(te) | litzakete |

#### Ahalera, Lehenaldia (Past) — "I could have… / was able to…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hintzakedan | nezakeen | *(refl.)* | zintzakedan | zintzaketedan | nitzakeen |
| hik | nintzakean *(masc.)* / nintzakenan *(fem.)* | *(refl.)* | hezakeen | gintzakean *(masc.)* / gintzakenan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | hitzakeen |
| hark | nintzakeen | hintzakeen | zezakeen | gintzakeen | zintzakeen | zintzaketen | zitzakeen |
| guk | *(refl.)* | hintzakegun | genezakeen | *(refl.)* | zintzakegun | zintzaketegun | genitzakeen |
| zuk | nintzakezun | *(hika/zuka)* | zenezakeen | gintzakezun | *(refl.)* | *(refl.)* | zenitzakeen |
| zuek | nintzakezuen | *(hika/zuka)* | zenezaketen | gintzakezuen | *(refl.)* | *(refl.)* | zenitzaketen |
| haiek | nintzaketen | hintzaketen | zezaketen | gintzaketen | zintzaketen | zintzakete(te)n | zitzaketen |

#### Subjuntiboa, Orainaldia (Present) — "...so that [NORK] may [verb] [NOR]"

*Adibidez:* `Ez dut nahi hark ni ikus nazan` ("I don't want him to see me");
`Ateak ireki ditut nik haiek ikus ditzadan` ("I opened the doors so that I
may see them").

`hi`-as-`NOR` is **gender-invariant** (the `hi` column needs no masc./fem.
split); `hik`-as-`NORK` *does* split, via an `-a-`/`-na-` insertion —
`dezaan`/`dezanan`, `nazaan`/`nazanan`, etc.

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hazadan | dezadan | *(refl.)* | zaitzadan | zaitzatedan | ditzadan |
| hik | nazaan *(masc.)* / nazanan *(fem.)* | *(refl.)* | dezaan *(masc.)* / dezanan *(fem.)* | gaitzaan *(masc.)* / gaitzanan *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | ditzaan *(masc.)* / ditzanan *(fem.)* |
| hark | nazan | hazan | dezan | gaitzan | zaitzan | zaitzaten | ditzan |
| guk | *(refl.)* | hazagun | dezagun | *(refl.)* | zaitzagun | zaitzategun | ditzagun |
| zuk | nazazun | *(hika/zuka)* | dezazun | gaitzazun | *(refl.)* | *(refl.)* | ditzazun |
| zuek | nazazuen | *(hika/zuka)* | dezazuen | gaitzazuen | *(refl.)* | *(refl.)* | ditzazuen |
| haiek | nazaten | hazaten | dezaten | gaitzaten | zaitzaten | zaitzate(te)n | ditzaten |

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

`hik`/`hura` (`hezan`) is the same form for both masc. and fem. — unlike every
other `hik`-row cell in either Subjuntiboa grid, which all split via
`-a-`/`-na-`.

Basque imperatives are largely restricted to absolutive-marking commands
(§9), so a `NOR-NORK` imperative grid isn't given here.

## 4. `izan` with dative — NOR-NORI system

Used with intransitive verbs that take an indirect object — `gustatu`,
`iruditu`, etc. Laid out as a grid (`NORI` rows × `NOR` columns) — `NOR`
ranges across all seven persons, not just `hura`/`haiek`. The citation slice
most relevant to `gustatu`-class verbs ("it pleases me", "they please me" —
`NOR` is the 3rd-person stimulus) sits in the `hura`/`haiek` columns; the rest
of the grid is this same auxiliary wearing its other hat — "I am to him"
(`natzaio`, the synthetic engine behind e.g. `jarraitzen natzaio`, "I follow
him") and its kin across all persons.

Each cell follows **[`NOR`-prefix + stem(+`-zki-` if plural)] + [`NORI`-suffix]
(+ `-n` in the past)** — e.g. present `zai-` + `-o` → `zaio`, or `na-tzai-` +
`-o` → `natzaio`.

- **`-zki-` marks a plural `NOR`** — for `gu`/`zuek`/`haiek`
  (`gatzaizkio`, `zatzaizkio`, …), the same infix the `ukan` grids and §8
  use for plural absolutive arguments generally. `zu` sits this out
  entirely — it keeps the bare `za-tzai-` shape (`zatzait` = za- + -tzai- +
  -t, no `-zki-`), in contrast with genuinely-plural `zuek`'s `zatzaizkit`.
- **The `K/N` ↔ `A/NA` mirroring** — the masc./fem. split tied to a `hi`
  argument — surfaces in the `NORI = hiri` row as present `zaik`/`zain` ↔
  past `zitzaian`/`zitzainan`.
- **Reflexive gaps** sit on the diagonal — `ni`-to-`niri`, `hi`-to-`hiri`,
  `gu`-to-`guri`, `zu`-to-`zuri`, `zuek`-to-`zuei` ("I am to myself", …) —
  marked `*(refl.)*`. (`hura`-to-`hari` and `haiek`-to-`haiei` *aren't*
  reflexive gaps — "it"/"they" are open referential slots that can differ
  from their dative counterpart, so `zaio`/`zaizkie` are perfectly ordinary
  forms.)
- **`hi`↔`zu`/`zuek` cells are `*(hika/zuka)*`** — `hiri`'s `zu`/`zuek`
  columns ("you/you-all are to him-familiar") and the mirror-image
  `zuri`/`zuei` rows' `hi` column ("he-familiar is to you/you-all") are
  impossible by grammar.

**Note: `zu` ≠ `zuek` here**, unlike `ukan`'s "etiquette plural" (§3's
`zaitut`-type forms, where `zu` itself triggers `-it-`). In this NOR-NORI
paradigm `zu` keeps the bare `za-tzai-` shape with no `-zki-` (`zatzait`),
while `zuek` — genuinely plural — takes `-zki-` exactly like `gu`/`haiek`
(`zatzaizkit`); no `-te` enters the picture. The reflexive diagonal follows
suit: `zu`-to-`zuri` is `*(refl.)*` over the bare shape (`zatzaizu`),
`zuek`-to-`zuei` over the `-zki-` shape (`zatzaizkizue`).

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

Prefixed `Ba-` on top of a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/`zin-`/`li-`
series (compare `banintz`/`bahintz`/`balitz`/… in §1/§2 — riding the
dative-marked `tzai` stem instead of `izan`'s own one) and closing with the
same `NORI` suffixes as the present grid (no past `-n`):

| NORI ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | bahintzait | balitzait | bagintzaizkit | bazintzait | bazintzaizkit | balitzaizkit |
| hiri | banintzaik *(masc.)* / banintzain *(fem.)* | *(refl.)* | balitzaik *(masc.)* / balitzain *(fem.)* | bagintzaizkik *(masc.)* / bagintzaizkin *(fem.)* | *(hika/zuka)* | *(hika/zuka)* | balitzaizkik *(masc.)* / balitzaizkin *(fem.)* |
| hari | banintzaio | bahintzaio | balitzaio | bagintzaizkio | bazintzaio | bazintzaizkio | balitzaizkio |
| guri | banintzaigu | bahintzaigu | balitzaigu | *(refl.)* | bazintzaigu | bazintzaizkigu | balitzaizkigu |
| zuri | banintzaizu | *(hika/zuka)* | balitzaizu | bagintzaizkizu | *(refl.)* | bazintzaizkizu | balitzaizkizu |
| zuei | banintzaizue | *(hika/zuka)* | balitzaizue | bagintzaizkizue | bazintzaizue | *(refl.)* | balitzaizkizue |
| haiei | banintzaie | bahintzaie | balitzaie | bagintzaizkie | bazintzaie | bazintzaizkie | balitzaizkie |

The remaining grids below run the same recipe — [`NOR`-prefix +
stem(+`-zki-` if plural)] + [`NORI`-suffix] (+ tense/mood markers `-n`,
`-ke`, `-en`) — across the rest of `izan`'s mood/tense system, mirroring §2's
coverage of the plain (non-dative) paradigm. `Ondorioa` keeps the `tzai` stem
(like the indicative/baldintza grids above); `Potentziala`, `Subjuntiboa`, and
`Inperatiboa` swap in the bare `ki` stem instead (still `+-zki-` for plural
`NOR`) — the same stem `naiteke`/`dadin`/`bedi` ride in §2's plain paradigm,
just dative-marked here.

### Ondorioa — Present

Runs on a `nin-`/`hin-`/`li-`/`gin-`/`zin-`/`zin-`/`li-` `NOR`-prefix series —
note `hura`/`haiek` take an overt `li-` here, unlike present-tense `zai-`'s
prefix-less allomorph — riding the `tzai` stem, closed off with a
`-ke`-suffixed `NORI` series (`-dake`/`-ake`/`-nake`/`-oke`/`-guke`/`-zuke`/
`-zuekete`/`-eke`):

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

Same `-ke(+-en)` `NORI`-suffix family as above — now with the trailing `-en`
that marks past throughout this mood, `zuei` taking `-eketen` — but a
*different* `hura`/`haiek` prefix: `zi-`, not `li-` (compare past-tense
`zitzaio`'s own `zi-`), over an otherwise identical
`nin-`/`hin-`/`zi-`/`gin-`/`zin-`/`zin-`/`zi-` series:

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

Swaps the `tzai` stem for the bare `ki` stem (still `+-zki-` for plural
`NOR`) riding `na-`/`ha-`/`da-`/`ga-`/`za-`/`za-`/`da-` — the same prefix
shape §2's plain `naiteke`/`gaitezke` paradigm uses — closed with the same
`-ke` `NORI`-suffix family as Ondorioa-Present:

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

Rides the same `ki`/`-zki-` stem as Potentziala. Uses the *same*
`na-`/`ha-`/`da-`/… prefix series as Potentziala-Present, but closes with a
bare `-n` `NORI`-suffix family instead of `-ke` (`-dan`/`-an`/`-nan`/`-on`/
`-gun`/`-zun`/`-zueten`/`-en` — `zuei` alone taking the extra `-te`):

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

## 5. `ukan` with dative — NOR-NORI-NORK system

Used with ditransitive verbs — `eman` ("to give"), `esan` ("to say"), etc.
The full picture has three dimensions (`NOR`/`NORI`/`NORK`); flattened here
into a `NORI` (indirect object, rows) × `NORK` (subject, columns) grid per
`NOR` value. Two `NOR` values are covered: `hura` (singular object — "give
*it*…") and `haiek` (plural object — "give *them*…", via the `-zki-` infix).
`NOR` = 1st/2nd person ("he gives *me* to him") is covered separately, in
["`NOR` = 1st/2nd person" below](#nor--1st2nd-person), since most of those
forms collapse back onto §3's plain NOR-NORK grid rather than needing a new
table.

### `NOR` = hura — Present

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | didak / didan | dit | didagu | didazu | didazue | didate |
| hari | diot | diok / dion | dio | diogu | diozu | diozue | diote |
| guri | *(refl.)* | diguk / digun | zigun | *(refl.)* | diguzu | diguzue | ziguten |
| zuri | dizut | *(hika/zuka)* | dizu | dizugu | *(refl.)* | *(zu↔zuek)* | dizute |
| haiei | diet | diek / dien | die | diegu | diezu | diezue | diete |

Each form follows **`di-` + `NORI`-suffix + `NORK`-suffix**: `NORI`-suffixes
`-da-`/`-o-`/`-gu-`/`-zu-`/`-e-` for `niri`/`hari`/`guri`/`zuri`/`haiei`;
`NORK`-suffixes `-t`/`-k(/-n)`/`∅`/`-gu`/`-zu`/`-zue`/`-te` for
`nik`/`hik`/`hark`/`guk`/`zuk`/`zuek`/`haiek` — `hik`'s suffix gender-splits
like §3's `-k`/`-n` (`diok`/`dion`, `didak`/`didan`, …). `zuri`/`zuei` with
`NORK`=`hik` are `*(hika/zuka)*`, same register clash as `NORK`=`zuk`/`zuek`
with `NOR`=`hi` in §3.

`niri`/`nik`, `guri`/`nik`, `guri`/`guk`, and `zuri`/`zuk` are all
`*(refl.)*` under §3's same-person-category extension (1st person category =
`ni`/`gu`, 2nd = `zu`/`zuek`): in each of these cells `NORI` and `NORK`
belong to the same person category, so "I give it to myself/us" or "we/you
give it to yourself/ourselves" can't be expressed with a distinct ditransitive
form. In practice these meanings are expressed periphrastically with `buru`
("head/self"), e.g. *nire buruari eman diot* ("I gave it to my own self").

### `NOR` = hura — Past

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hidan | zidan | genidan | zenidan | zenidaten | zidaten |
| hari | nion | hion | zion | genion | zenion | zenioten | zioten |
| guri | *(refl.)* | higun | zigun | *(refl.)* | zenigun | zeniguten | ziguten |
| zuri | nizun | *(hika/zuka)* | zizun | genizun | *(refl.)* | *(zu↔zuek)* | zizuten |
| haiei | nien | hien | zien | genien | zenien | zenieten | zieten |

The prefix-encodes-`NORK` pattern from §3's past-tense `ukan` grid
(`n-`/`h-`/`z-`/`gen-`/`zen-`/`zen-…te`/`z-…te` for
`nik`/`hik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`) accounts for every cell here
too — e.g. `genidan` = `gen-i-da-n` (guk→niri), `zenigun` = `zen-i-gu-n`
(zuk→guri), `zenieten` = `zen-i-e-te-n` (zuek→haiei). `hik`'s `h-` prefix
isn't gender-split here, mirroring §3's `huen`/`hituen` — `hidan` =
`h-i-da-n` (hik→niri), `hion` = `h-i-o-n` (hik→hari).

### `NOR` = haiek — Present

Same grid shape, with the `-zki-` infix marking the plural object (`di-` →
`di-zki-`), inserted right before the `NORI` suffix — e.g. `dizkidazu` =
`di-zki-da-zu` ("you give them to me"), `dizkio` = `di-zki-o` ("he gives them
to him").

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | dizkidak / dizkidan | dizkida | dizkidagu | dizkidazu | dizkidazue | dizkidate |
| hari | dizkiot | dizkiok / dizkion | dizkio | dizkiogu | dizkiozu | dizkiozue | dizkiote |
| guri | *(refl.)* | dizkiguk / dizkigun | dizkigu | *(refl.)* | dizkiguzu | dizkiguzue | dizkigute |
| zuri | dizkizut | *(hika/zuka)* | dizkizu | dizkizugu | *(refl.)* | *(zu↔zuek)* | dizkizute |
| haiei | dizkiet | dizkiek / dizkien | dizkie | dizkiegu | dizkiezu | dizkiezue | dizkiete |

### `NOR` = haiek — Past

Same `-zki-` infix over the past grid's prefix-encodes-`NORK` forms — e.g.
`zizkidan` = `z-i-zki-da-n` ("he had given them to me"), `nizkion` =
`n-i-zki-o-n` ("I had given them to him").

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hizkidan | zizkidan | genizkidan | zenizkidan | zenizkidaten | zizkidaten |
| hari | nizkion | hizkion | zizkion | genizkion | zenizkion | zenizkioten | zizkioten |
| guri | *(refl.)* | hizkigun | zizkigun | *(refl.)* | zenizkigun | zenizkiguten | zizkiguten |
| zuri | nizkizun | *(hika/zuka)* | zizkizun | genizkizun | *(refl.)* | *(zu↔zuek)* | zizkizuten |
| haiei | nizkien | hizkien | zizkien | genizkien | zenizkien | zenizkieten | zizkieten |

### Baldintza

The ditransitive protasis ("if [NORK] were to give [NOR] to [NORI]") rides the
same `n-i-`/`h-i-`/`z-i-`/`gen-i-`/`zen-i-` `NORK`-prefix + linking-`i` +
`NORI`-suffix shape as the Past indicative grids above (`nion`, `zion`,
`genidan`, …), with `hark`/`haiek` swapping their past-tense `z-`/`zi-` prefix
for `l-`/`li-` — the same non-past-conditional alternation §3's
Baldintza/Ondorioa-present use for `zuen`→`balu`/`luke`. Concretely: drop the
past grid's trailing `-n` (or `-ten`'s `-n`), swap `z-`/`zi-`→`l-`/`li-` on the
`hark`/`haiek` columns only, and prefix `Ba-` — e.g. `zion` (hark→hari, "he
gave it to him") → `lio` → `balio` ("if he were to give it to him"); `nion` →
`nio` → `banio` ("if I were to give it to him").

#### `NOR` = hura

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | bahida | balida | bagenida | bazenida | bazenidate | balidate |
| hari | banio | bahio | balio | bagenio | bazenio | bazeniote | baliote |
| guri | *(refl.)* | bahigu | baligu | *(refl.)* | bazenigu | bazenigute | baligute |
| zuri | banizu | *(hika/zuka)* | balizu | bagenizu | *(refl.)* | *(zu↔zuek)* | balizute |
| haiei | banie | bahie | balie | bagenie | bazenie | bazeniete | baliete |

*Adibidea:* `Liburu hau zuri eman banizu, oso pozik egongo zinateke` ("If I
gave you this book, you'd be very happy" — zuri/nik).

**Note:** `balio` (hari/hark — "if he/she were to give it to him/her") is
homophonous with the common noun `balio` ("value/worth", as in `balio izan`,
"to be worth") — context disambiguates the two readings.

#### `NOR` = haiek

Same `-zki-` infix as the indicative grids, inserted after the linking `i`:

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | bahizkida | balizkida | bagenizkida | bazenizkida | bazenizkidate | balizkidate |
| hari | banizkio | bahizkio | balizkio | bagenizkio | bazenizkio | bazenizkiote | balizkiote |
| guri | *(refl.)* | bahizkigu | balizkigu | *(refl.)* | bazenizkigu | bazenizkigute | balizkigute |
| zuri | banizkizu | *(hika/zuka)* | balizkizu | bagenizkizu | *(refl.)* | *(zu↔zuek)* | balizkizute |
| haiei | banizkie | bahizkie | balizkie | bagenizkie | bazenizkie | bazenizkiete | balizkiete |

### Ondorioa, present

The "would" apodosis — used as the auxiliary in periphrastic conditionals
(`emango nizuke`, "I would give it to you"; §13's **Geroa + Ondorioa** =
"Conditional — 'would'"). Same shape as Baldintza's `NOR`=hura grid above,
minus `Ba-` and plus `-ke`: `banio` → `nioke`, `balizu` → `lizuke`.

#### `NOR` = hura

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hidake | lidake | genidake | zenidake | zenidakete | lidakete |
| hari | nioke | hioke | lioke | genioke | zenioke | zeniokete | liokete |
| guri | *(refl.)* | higuke | liguke | *(refl.)* | zeniguke | zenigukete | ligukete |
| zuri | nizuke | *(hika/zuka)* | lizuke | genizuke | *(refl.)* | *(zu↔zuek)* | lizukete |
| haiei | nieke | hieke | lieke | genieke | zenieke | zeniekete | liekete |

*Adibideak:* `Liburu hau emango nizuke, baina jada saldu dut` ("I would give
you this book, but I've already sold it" — zuri/nik); `Sariak irabaziko
balute, opariak haurrei emango lizkiekete` ("If they won the prizes, they'd
give the gifts to the children" — haiei/haiek, `NOR`=haiek — see grid below).

#### `NOR` = haiek

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hizkidake | lizkidake | genizkidake | zenizkidake | zenizkidakete | lizkidakete |
| hari | nizkioke | hizkioke | lizkioke | genizkioke | zenizkioke | zenizkiokete | lizkiokete |
| guri | *(refl.)* | hizkiguke | lizkiguke | *(refl.)* | zenizkiguke | zenizkigukete | lizkigukete |
| zuri | nizkizuke | *(hika/zuka)* | lizkizuke | genizkizuke | *(refl.)* | *(zu↔zuek)* | lizkizukete |
| haiei | nizkieke | hizkieke | lizkieke | genizkieke | zenizkieke | zenizkiekete | lizkiekete |

### Ondorioa, past

The "would have" apodosis — used as the auxiliary in §13's **Ez-ohiko
Baldintza** ("would have", `emango niokeen` = "I would have given it to him").
Keeps Ondorioa-present's prefixes but reverts `hark`/`haiek` to the past-tense
`z-`/`zi-` prefix (mirroring §3's `luke`→`zukeen`) and appends `-en` (`-ten`
where `-te-` already supplies the linking vowel): `nioke`→`niokeen`,
`lioke`→`ziokeen`, `liokete`→`zioketen`.

#### `NOR` = hura

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hidakeen | zidakeen | genidakeen | zenidakeen | zenidaketen | zidaketen |
| hari | niokeen | hiokeen | ziokeen | geniokeen | zeniokeen | zenioketen | zioketen |
| guri | *(refl.)* | higukeen | zigukeen | *(refl.)* | zenigukeen | zeniguketen | ziguketen |
| zuri | nizukeen | *(hika/zuka)* | zizukeen | genizukeen | *(refl.)* | *(zu↔zuek)* | zizuketen |
| haiei | niekeen | hiekeen | ziekeen | geniekeen | zeniekeen | zenieketen | zieketen |

*Adibidea:* `Garaiz jakin izan banu, laguntza eskatuko niokeen` ("If I had
known in time, I would have asked him for help" — hari/nik).

#### `NOR` = haiek

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hizkidakeen | zizkidakeen | genizkidakeen | zenizkidakeen | zenizkidaketen | zizkidaketen |
| hari | nizkiokeen | hizkiokeen | zizkiokeen | genizkiokeen | zenizkiokeen | zenizkioketen | zizkioketen |
| guri | *(refl.)* | hizkigukeen | zizkigukeen | *(refl.)* | zenizkigukeen | zenizkiguketen | zizkiguketen |
| zuri | nizkizukeen | *(hika/zuka)* | zizkizukeen | genizkizukeen | *(refl.)* | *(zu↔zuek)* | zizkizuketen |
| haiei | nizkiekeen | hizkiekeen | zizkiekeen | genizkiekeen | zenizkiekeen | zenizkieketen | zizkieketen |

### Ahalera, Orainaldia (Present potential), ditransitive

The ditransitive potential ("[NORK] can give X to Y") follows a `dieza-`
(`NOR`=`hura`, singular object) / `diezazki-` (`NOR`=`haiek`, plural object,
same `-zki-` infix as the indicative grids above) root, plus a `NORI` suffix,
plus `-ke`, plus a `NORK` suffix.

`NORI`-suffixes are the familiar `-da-/-o-/-gu-/-zu-/-e-` set, with a glide
`-i-` inserted before `-o-`/`-e-` to break up the vowel hiatus that `-za-` +
`-o-`/`-e-` would otherwise create (`zaio`, `zaie`) — `-da-/-gu-/-zu-` need no
glide. `NORK`-suffixes attach directly after `-ke-`: `-t`/`-k(/-n)`/`∅`/`-gu`/
`-zu`/`-zue`/`-te` for `nik`/`hik`/`hark`/`guk`/`zuk`/`zuek`/`haiek` — the same
suffix set as §3's Ahalera grid (`dezaket`/`dezakek`/`dezaken`/`dezake`/
`dezakegu`/`dezakezu`/`dezakezue`/`dezakete`).

`*(refl.)*`/`*(zu↔zuek)*`/`*(hika/zuka)*` cells sit in exactly the same
positions as in this section's indicative present/past grids above:
`niri`/`nik`, `guri`/`nik`, `guri`/`guk`, and `zuri`/`zuk` are `*(refl.)*`;
`zuri`/`zuek` is `*(zu↔zuek)*`; `zuri`/`hik` is `*(hika/zuka)*`. The remaining
`hik` cells (`niri`/`hari`/`guri`/`haiei`) follow the same `-k`/`-n` gender
split as §3's `hik` row (`dezakek`/`dezaken`).

Like §3's Subjuntiboa `hi`-cells, these `hik`-as-`NORK` ditransitive forms are
grammatically regular but rarely heard in spontaneous speech — *hika* speakers
asking about ability typically reach for the indicative (`Emango didak?`,
lit. "will you give it to me?") or a periphrastic `ahal izan` construction
instead of the dense `-zki-`-laden synthetic potential. Still genuinely
attested in formal/literary Basque, so kept here rather than marked
impossible.

#### `NOR` = hura (singular object)

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | diezadakek / diezadaken | diezadake | diezadakegu | diezadakezu | diezadakezue | diezadakete |
| hari | diezaioket | diezaiokek / diezaioken | diezaioke | diezaiokegu | diezaiokezu | diezaiokezue | diezaiokete |
| guri | *(refl.)* | diezagukek / diezaguken | diezaguke | *(refl.)* | diezagukezu | diezagukezue | diezagukete |
| zuri | diezazuket | *(hika/zuka)* | diezazuke | diezazukegu | *(refl.)* | *(zu↔zuek)* | diezazukete |
| haiei | diezaieket | diezaiekek / diezaieken | diezaieke | diezaiekegu | diezaiekezu | diezaiekezue | diezaiekete |

#### `NOR` = haiek (plural object)

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | diezazkidakek / diezazkidaken | diezazkidake | diezazkidakegu | diezazkidakezu | diezazkidakezue | diezazkidakete |
| hari | diezazkioket | diezazkiokek / diezazkioken | diezazkioke | diezazkiokegu | diezazkiokezu | diezazkiokezue | diezazkiokete |
| guri | *(refl.)* | diezazkigukek / diezazkiguken | diezazkiguke | *(refl.)* | diezazkigukezu | diezazkigukezue | diezazkigukete |
| zuri | diezazkizuket | *(hika/zuka)* | diezazkizuke | diezazkizukegu | *(refl.)* | *(zu↔zuek)* | diezazkizukete |
| haiei | diezazkieket | diezazkiekek / diezazkieken | diezazkieke | diezazkiekegu | diezazkiekezu | diezazkiekezue | diezazkiekete |

*Adibideak:* `Lagun horrek mesede handia egin diezaguke egoera honetan` ("That
friend can do us a great favor in this situation" — guri/hark/hura);
`Gidariak guri koadernoak ekar diezazkiguke bulegotik` ("The driver can bring
us the notebooks from the office" — guri/hark/haiek); `Irakasleak azalpena
eman diezaieke ikasleei` ("The teacher can give the explanation to the
students" — haiei/hark/hura).

### Ahalera, Lehenaldia (Past potential), ditransitive

The ditransitive past potential ("[NORK] could have given X to Y") does
**not** reuse the `dieza-`/`diezazki-` root from Orainaldia directly. Instead,
take the Orainaldia `hark`-column form (e.g. `diezaioke`), drop the initial
`d-`, prepend the same past-tense `NORK` prefix already used in §5's
indicative past grid (`n-`/`h-`/`z-`/`gen-`/`zen-`/`zen-…-te-`/`z-…-te-`, from
`nion`/`hion`/`zion`/`genion`/`zenion`/`zenioten`/`zioten`), and append `-en`
(`-ten` where the prefix's `-te-` is shared with the suffix). The resulting
extra `i-` (`n-i-eza-io-ke-en` = `niezaiokeen`) mirrors the same `nion`-vs-
`nuen` linking vowel that distinguishes ditransitive from plain past forms
throughout §5.

`hik` as `NORK` follows the same recipe with the past-tense `h-` prefix
(`hion` = `h-i-o-n`, from §5's own indicative past grid) — `diezaioke` →
`iezaioke` → `hiezaioke` → `hiezaiokeen`. As with §5's indicative past `hik`
column (`hidan`/`hion`/`higun`/`hien`), this isn't gender-split — one form per
cell, not the masc./fem. pair seen in Orainaldia's `hik` column.

#### `NOR` = hura (singular object)

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hiezadakeen | ziezadakeen | geniezadakeen | zeniezadakeen | zeniezadaketen | ziezadaketen |
| hari | niezaiokeen | hiezaiokeen | ziezaiokeen | geniezaiokeen | zeniezaiokeen | zeniezaioketen | ziezaioketen |
| guri | niezagukeen | hiezagukeen | ziezagukeen | *(refl.)* | zeniezagukeen | zeniezaguketen | ziezaguketen |
| zuri | niezazukeen | *(hika/zuka)* | ziezazukeen | geniezazukeen | *(refl.)* | *(zu↔zuek)* | ziezazuketen |
| haiei | niezaiekeen | hiezaiekeen | ziezaiekeen | geniezaiekeen | zeniezaiekeen | zeniezaieketen | ziezaieketen |

*Adibideak:* `Dirua beraiekin utzi izan banu, nik lagunari liburua eros
niezaiokeen` ("If I had left the money with them, I could have bought the
book for my friend" — hari/nik); `Atzo amak umeari zopa beroa eman
ziezaiokeen, baina ahaztu egin zitzaion` ("Yesterday mother could have given
the hot soup to the child, but she forgot" — hari/hark); `Poliziek gidariari
isuna jar ziezaioketen, baina abisua soilik eman zioten` ("The police could
have given the driver a fine, but they only gave a warning" —
hari/haiek).

#### `NOR` = haiek (plural object)

The `-zki-` infix slots in at the same point as in Orainaldia and the
Lehenaldia `nik` column (`niezaiokeen` → `niezazkiokeen`, inserting `-zki-`
right before the `NORI` suffix), giving:

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hiezazkidakeen | ziezazkidakeen | geniezazkidakeen | zeniezazkidakeen | zeniezazkidaketen | ziezazkidaketen |
| hari | niezazkiokeen | hiezazkiokeen | ziezazkiokeen | geniezazkiokeen | zeniezazkiokeen | zeniezazkioketen | ziezazkioketen |
| guri | niezazkigukeen | hiezazkigukeen | ziezazkigukeen | *(refl.)* | zeniezazkigukeen | zeniezazkiguketen | ziezazkiguketen |
| zuri | niezazkizukeen | *(hika/zuka)* | ziezazkizukeen | geniezazkizukeen | *(refl.)* | *(zu↔zuek)* | ziezazkizuketen |
| haiei | niezazkiekeen | hiezazkiekeen | ziezazkiekeen | geniezazkiekeen | zeniezazkiekeen | zeniezazkieketen | ziezazkieketen |

*Adibideak:* `Giltzak poltsikoan eraman izan banitu, nik giltza guztiak
lagunari utz niezazkiokeen bera sartu ahal izateko` ("If I had carried the
keys in my pocket, I could have left all the keys to my friend so he could
get in" — hari/nik); `Argazkiak garaiz inprimatu izan banitu, nik irudiak
nire gurasoei erakuts niezazkiekeen atzo arratsaldean` ("If I had printed the
photos on time, I could have shown the images to my parents yesterday
afternoon" — haiei/nik).

### Ahalera, Alegiazkoa (Hypothetical potential), ditransitive

§4 (NOR-NORI) already has its hypothetical-potential grid — the "[Potentziala
— Hypothetical](#potentziala--hypothetical)" subsection above, with `le-`
replacing `ze-`/`zekion`'s prefix and the trailing `-en` dropped. This section
fills the matching gap on the NOR-NORI-NORK side: "[NORK] would be able to
give X to Y (if…)", as opposed to Lehenaldia's "[NORK] could have given X to
Y".

The derivation mirrors §3's own Alegiazkoa-vs-Lehenaldia relationship
(`zezakeen` → `lezake`, `zitzakeen` → `litzake`): take each Lehenaldia
ditransitive form above and

1. drop the trailing `-en` (or, where the form already ends `-ten`, just the
   final `-n`, since `-te-n` already supplies its own linking vowel) — e.g.
   `niezaiokeen` → `niezaioke`, `zeniezaioketen` → `zeniezaiokete`;
2. for the `hark`/`haiek`-as-`NORK` columns only, swap the leading `zi-` for
   `li-` — e.g. `ziezaiokeen` → `ziezaioke` → `liezaioke`, `ziezaioketen` →
   `ziezaiokete` → `liezaiokete`.

`nik`/`hik`/`guk`/`zuk`/`zuek`-as-`NORK` keep their prefixes unchanged (step 1
only), exactly as `ne-`/`he-`/`gene-`/`zene-`/`zene-…-te` do in §3.

#### `NOR` = hura (singular object)

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hiezadake | liezadake | geniezadake | zeniezadake | zeniezadakete | liezadakete |
| hari | niezaioke | hiezaioke | liezaioke | geniezaioke | zeniezaioke | zeniezaiokete | liezaiokete |
| guri | niezaguke | hiezaguke | liezaguke | *(refl.)* | zeniezaguke | zeniezagukete | liezagukete |
| zuri | niezazuke | *(hika/zuka)* | liezazuke | geniezazuke | *(refl.)* | *(zu↔zuek)* | liezazukete |
| haiei | niezaieke | hiezaieke | liezaieke | geniezaieke | zeniezaieke | zeniezaiekete | liezaiekete |

*Adibideak:* `Denbora gehiago izango banu, liburua oparitu liezaioke
lagunari` ("If he had more time, he could give the book to his friend as a
gift" — hari/hark/hura — note: with `hark` as `NORK`, real usage often
favours `Denbora gehiago balu, liburua oparituko lioke` instead, but the
synthetic `liezaioke` is grammatical and attested in formal registers);
`Baldintzak hobeak balira, dirua itzul niezaieke bezeroei` ("If conditions
were better, I could refund the money to the customers" — haiei/nik/hura).

#### `NOR` = haiek (plural object)

The same `-zki-` infix as Orainaldia/Lehenaldia, applied to the forms above:

| NORI ↓ ╲ NORK → | nik | hik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|---|
| niri | *(refl.)* | hiezazkidake | liezazkidake | geniezazkidake | zeniezazkidake | zeniezazkidakete | liezazkidakete |
| hari | niezazkioke | hiezazkioke | liezazkioke | geniezazkioke | zeniezazkioke | zeniezazkiokete | liezazkiokete |
| guri | niezazkiguke | hiezazkiguke | liezazkiguke | *(refl.)* | zeniezazkiguke | zeniezazkigukete | liezazkigukete |
| zuri | niezazkizuke | *(hika/zuka)* | liezazkizuke | geniezazkizuke | *(refl.)* | *(zu↔zuek)* | liezazkizukete |
| haiei | niezazkieke | hiezazkieke | liezazkieke | geniezazkieke | zeniezazkieke | zeniezazkiekete | liezazkiekete |

### `NOR` = 1st/2nd person

A `NOR` = 1st/2nd person ditransitive ("he gives *me* to him", "you say *me*
to them") is governed by the **Person-Case Constraint (PCC)**: the auxiliary
can cross-reference at most one non-3rd-person core argument alongside a
dative.

- **`NORI` = `hari`/`haiei`** (3rd person dative): the dative simply isn't
  cross-referenced on the verb — the form collapses to exactly §3's plain
  NOR-NORK form for that `NOR`/`NORK` pair, with the dative left to context.
  E.g. "Hark ni hari aurkeztu **nau**" ("He introduced me to him") uses §3's
  `hark`→`ni` present form `nau` unchanged — see [§3's "Completing the
  grid"](#completing-the-grid--nor--1st2nd-person) for the full set of
  `NOR`/`NORK` forms these reduce to.
- **`NORI` = 1st/2nd person**: cross-referencing two non-3rd-person arguments
  (`NOR` and `NORI`) on the same auxiliary is exactly what the PCC rules out.
  Where `NOR` and `NORI` are the *same* person (or share a person category —
  the same extension used throughout §3 and above), this is also reflexive.
  So a full `NOR` = 1st/2nd grid would be filled almost entirely with
  `*(refl.)*`, `*(hika/zuka)*`, `*(zu↔zuek)*`, and PCC-blocked cells — it adds
  little beyond §3's grid plus the reduction rule above, so it isn't
  tabulated separately here.

For the genuinely reflexive/blocked meanings ("I gave you to myself", "we
said ourselves to you"), Basque again falls back to the `buru` periphrasis,
e.g. *zu nire buruari aurkeztu zintudan* ("I introduced you to myself").

## 6. More synthetic `nor` verbs

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
| hi | habil | — |
| hura | dabil | zebilen |
| gu | gabiltza | genbiltzan |
| zu | zabiltza | zenbiltzan |
| zuek | zabiltzate | zenbiltzaten |
| haiek | dabiltza | zebiltzan |

### `ihardun` — "to occupy oneself / be engaged (in something)" (nor)

`ihardun` follows §8's `iraun` di-root pattern exactly: `di-` present prefix
on the bare stem `-hardu-`, `-en` past suffix on the `n/h/z/g/z/z`-prefixed
stem (same mechanical derivation used throughout this document):

| Person | Present | Past |
|---|---|---|
| ni | dihardut | niharduen |
| hi | diharduk / dihardun *(masc./fem.)* | hiharduen |
| hura | dihardu | ziharduen |
| gu | dihardugu | geniharduen |
| zu | diharduzu | zeniharduen |
| zuek | diharduzue | zeniharduten |
| haiek | dihardute | ziharduten |

`jardun` is the more common Batua spelling of this verb (`ih-` → `j-`
throughout); the conjugations above carry over unchanged under that spelling.

- *Lanean dihardu* — "He/she is busy (working)"
- *Zertan dihardugu?* — "What are we engaged in?"

### `mintzatu` / `hitz egin` — "to speak" *(nor — Literary/Northern paradigms)*

In Iparraldeko (Northern) literary Basque, "to be speaking" is often
expressed with the invariant locative participle `mintzo` + `izan` —
paralleling `ari izan` — rather than the Hegoaldeko (Southern) periphrastic
`mintzatzen da`. This reuses §1's `izan` paradigm wholesale, just prefixed
with `mintzo`, giving a clean `nor`-only table:

| Person | Present | Past |
|---|---|---|
| ni | mintzo naiz | mintzo nintzen |
| hi | mintzo haiz | mintzo hintzen |
| hura | mintzo da | mintzo zen |
| gu | mintzo gara | mintzo ginen |
| zu | mintzo zara | mintzo zinen |
| zuek | mintzo zarete | mintzo zineten |
| haiek | mintzo dira | mintzo ziren |

The Hegoaldeko equivalent, `mintzatu` (`nor`, ordinary periphrastic), simply
conjugates `izan` (§1) on `mintzatzen`/`mintzatu` the same way `egiten
da`/`egin zen` works for any `-tu` verb — `mintzatzen naiz`, `mintzatu
nintzen`, etc. — and needs no separate table.

## 7. More synthetic nor-nork verbs

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

`(sg./pl. obj.)` marks the singular- vs. plural-object alternants
(`-tza-` infix for plural):

| Person | Present (sg./pl. obj.) | Past (sg./pl. obj.) |
|---|---|---|
| nik | dakart / dakartzat | nekarren / nekartzan |
| hark | dakar / dakartza | zekarren / zekartzan |
| guk | dakargu / dakartzagu | genekarren / genekartzan |
| zuk | dakarzu / dakartzazu | zenekarren / zenekartzan |
| zuek | dakarzue / dakartzazue | zenekarten / zenekartzaten |
| haiek | dakarte / dakartzate | zekarten / zekartzaten |

`zekartzaten` is the plural-object `haiek`-past form; `zekarten` is its
singular-object counterpart — both exist side by side.

### `eduki` — "to have / hold (physically)" — nor-nork

A near-synonym of `ukan` used for physical possession/holding — distinct
enough in register/meaning to keep separate from `ukan` rather than treating
as a variant.

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

### `ikusi` — "to see" — nor-nork

`ikusi` has no living synthetic paradigm in modern Batua — an archaic
literary `-kus-` root surfaces in older texts (e.g. Etxepare's *dakusquet*),
but it isn't productive and is omitted here for accuracy. In everyday Basque
`ikusi` is always periphrastic, pairing the imperfective/perfective
participles `ikusten`/`ikusi` with `ukan`'s NOR-NORK auxiliary (§3, `NOR` =
`hura`):

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| nik | ikusten dut | ikusi nuen |
| hark | ikusten du | ikusi zuen |
| guk | ikusten dugu | ikusi genuen |
| zuk | ikusten duzu | ikusi zenuen |
| zuek | ikusten duzue | ikusi zenuten |
| haiek | ikusten dute | ikusi zuten |

### `entzun` — "to hear" — nor-nork

Same situation as `ikusi`: no productive synthetic paradigm, always
periphrastic, built on `entzuten`/`entzun` + `ukan`'s NOR-NORK auxiliary
(§3, `NOR` = `hura`):

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| nik | entzuten dut | entzun nuen |
| hark | entzuten du | entzun zuen |
| guk | entzuten dugu | entzun genuen |
| zuk | entzuten duzu | entzun zenuen |
| zuek | entzuten duzue | entzun zenuten |
| haiek | entzuten dute | entzun zuten |

## 8. `iraun`, `jario`, `esan`, `irudi`, `etzan`

### `iraun` — "to last / endure" (nor-nork)

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | diraut | nirauen |
| hi | dirauk / diraun *(masc./fem.)* | hirauen |
| hura | dirau | zirauen |
| gu | diraugu | genirauen |
| zu | dirauzu | zenirauen |
| zuek | dirauzue | zenirauten |
| haiek | diraute | zirauten |

- *1983tik legeak indarrean dirau* — "The law has been in force since 1983"
- *Filmak bi ordu dirau* — "The film runs/lasts two hours"

### `jario` — "to flow / ooze / pour" (nor-nori; defective, effectively fixed `nor`)

`(zki)` marks the plural-`NOR` alternant — e.g. `niri` reads as **dariot**
(singular `nor`) / **darizkit** (plural `nor`):

| NORI | Present (oraina) | Past (lehenaldia) |
|---|---|---|
| niri | dari(zki)t | zeri(zki)dan |
| hiri | dari(zki)k/n *(masc./fem.)* | zeri(zki)(n)an *(masc./fem.)* |
| hari | dari(zki)o | zeri(zki)on |
| guri | dari(zki)gu | zeri(zki)gun |
| zuri | dari(zki)zu | zeri(zki)zun |
| zuei | dari(zki)zue | zeri(zki)zuen |
| haiei | dari(zki)e | zeri(zki)en |

Past (Bizkaian variant — `jario`'s own past stem, not a separate verb):
**darie** / **erion**.

`jario`'s everyday use is narrow — almost always a body fluid or liquid as
the (singular) `nor`, and often paired with `egon` rather than standing on
its own (rough working glosses):

- *Malkoak zerizkiola azaldu zen* — "He/she appeared/showed up with tears
  streaming [from him/her]"
- *Odola dariola dago* (= *Odoletan dago*) — "He/she is bleeding"
- *Negarra dariola dago* — "He/she is crying"
- *Izerdia dario* — "He/she is sweating"
- *Adurra dariola dago* — "He/she is drooling"
- *Iturriari ura dario* — "Water flows from the fountain"

### `esan` — "to say" (ditransitive forms, on the `*-io-` root `ukan` also borrows)

`NOR` fixed at 3sg (`hura`/"it"), `NORI` fixed at 3sg (`hari`/"to him-her"),
`NORK` varying — the same "citation paradigm" shape `VERBS` already uses for
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

A false-friend pairing: `iruditu` ("iruditzen zait" = "it seems to me",
subjective opinion, nor-nori) vs. `irudi` ("dirudizu" = "you give the
impression", external appearance, nor-nork) — cognates that drifted apart in
both meaning *and* agreement.

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

| Person | Present (oraina) | Past (lehena) |
|---|---|---|
| ni | natza | nentzan |
| hi | hatza | hentzan |
| hura | datza | zetzan |
| gu | gautza | geuntzan |
| zu | zautza | zeuntzan |
| zuek | zautzate | zeuntzaten |
| haiek | dautza | zeutzan |

## 9. Imperative (agintera)

Second-person only — doesn't fill the usual six/seven-person table.

| Verb | zu (formal sg.) | zuek (pl.) | hi |
|---|---|---|---|
| ukan *(generic "do it")* | ezazu | ezazue | ezak *(masc.)* / ezan *(fem.)* |
| ekarri ("bring") | ekarri ezazu | ekarri ezazue | — |
| etorri ("come") | zatoz | zatozte | hator |
| joan ("go") | zoaz | zoazte | hoa |

## 10. Allocutive register (hitanoa / alokutiboa)

Alongside the *hika* (`hi`-as-argument) and *zuka* (`zu`/`zuek`-as-argument)
registers already woven through §§1–8, Basque has a third, orthogonal
register: the **allocutive** (*alokutiboa*, colloquially *hitanoa*). An
allocutive verb form cross-references the **gender of the person being
addressed** even when that person (`hi`) is *not* a grammatical argument
(`NOR`/`NORI`/`NORK`) of the sentence at all — it's pure "for your benefit,
listener" agreement, layered on top of an otherwise ordinary 1st/3rd-person
sentence.

### The two sub-registers

- **Tokano** (*gizonezko hizketakidea*, addressing a male `hi`) — marked with
  a final **`-k`**.
- **Nokano** (*emakumezko hizketakidea*, addressing a female `hi`) — marked
  with a final **`-n`**.

These are the same `-k`/`-n` markers used for the masc./fem. split on `hik`-
as-argument cells throughout this document (§§3–5) — allocutive agreement and
*hika* argument-agreement are historically the same morpheme, just attaching
to a different "slot": the addressee, rather than `NOR`/`NORI`/`NORK`.

### When it applies — and when it can't

- The sentence's actual arguments must be 3rd person (or, for transitive
  verbs, 1st person `NORK` acting on a 3rd-person `NOR`) — `Mendira joan da`
  ("She/he went to the mountain") → tokano `Mendira joan duk` / nokano
  `Mendira joan dun` ("..., *[I'm telling you, dude/girl]*").
- **`*(hika/zuka)*`-style clash**: if `hi` or `zu`/`zuek` is *itself* one of
  the sentence's arguments, allocutive marking doesn't stack on top of it —
  the ordinary *hika* (`duk`/`dun` as `NOR`/`NORK`=`hi`) or *zuka* form is
  used as-is, with no separate allocutive layer. Allocutive marking is
  reserved for sentences that would otherwise be in the neutral, no-`zuka`
  register.
- Allocutive forms are emphatically a **spoken-register, informal** layer —
  absent from formal writing, and from `zuka` registers entirely (you can't
  be simultaneously formal-with and intimate-with the same listener).

### Formation: the core 3rd-person `izan`/`ukan` forms

The two auxiliaries' bare 3rd-person citation forms (§1, §3) take the
following allocutive shapes — the table the rest of Basque's allocutive
system is built outward from:

| Plain form | Meaning | Tokano (→ male `hi`) | Nokano (→ female `hi`) |
|---|---|---|---|
| `da` (izan, `hura`) | "(s)he/it is" | `duk` | `dun` |
| `dira` (izan, `haiek`) | "they are" | `dituk` | `ditun` |
| `zen` (izan, `hura`, past) | "(s)he/it was" | `zuan` | `zunan` |
| `ziren` (izan, `haiek`, past) | "they were" | `zituan` | `zitunan` |
| `du` (ukan, `hark`→`hura`) | "(s)he has it" | `dik` | `din` |
| `dute` (ukan, `haiek`→`hura`) | "they have it" | `ditek` | `diten` |
| `zuen` (ukan, `hark`→`hura`, past) | "(s)he had it" | `zian` | `zinan` |
| `zuten` (ukan, `haiek`→`hura`, past) | "they had it" | `zitean` | `zitenan` |

A few rules fall out of this table:

- **`izan`'s `hura`-present is suppletive**: `da` doesn't take `-k`/`-n`
  directly (`†dak`/`†dan`) — it switches to the `du-` stem first, giving
  `duk`/`dun`. (`dira`→`dituk`/`ditun` follows the same `d-` + `-u-`/`-itu-`
  + `-k`/`-n` shape as the `da`/`dira` ↔ `du`/`ditu` stem alternation.)
- **`ukan`'s `du`/`dute` undergo a `u`→`i` stem shift**: `du`→`dik`/`din`,
  `dute`→`ditek`/`diten` — *not* `†duk`/`†dun`/`†dutek`/`†duten`. This shift
  is what keeps the allocutive forms distinct from the *hika*-argument forms
  `duk`/`dun` ("`hik` `duk`/`dun`" = "you-familiar have it") — without it,
  "(s)he has it, [I'm telling you]" and "you (familiar) have it" would
  collide.
- **Past tense inserts `-a-`/`-na-`** before the final `-n` — the same
  `-a-`/`-na-` insertion mechanism used for `hik`-as-`NORK` in Subjuntiboa
  (§3) and in this document's Ahalera Lehenaldia `hik` cells (§3): `zen` →
  `z-` + `-u-` (the same suppletive `du`-stem swap as the present) +
  `-a-`/`-na-` + `-n` = `zuan`/`zunan`; `zuen` → `z-` + `-i-` + `-a-`/`-na-` +
  `-n` = `zian`/`zinan` (the `u`→`i` shift carrying over from the present,
  same as `du`→`dik`/`din`). `ziren`/`zuten` follow the same template with
  the plural `-itu-`/`-ite-` stems: `z-itu-a-n`/`z-itu-na-n` =
  `zituan`/`zitunan`, `z-ite-a-n`/`z-ite-na-n` = `zitean`/`zitenan`.

### Synthetic `nor` verbs (`-a`/`-o`/`-i`-final stems)

Synthetic present-tense `hura` forms that *aren't* `da`/`du` (the `egon`/
`etorri`/`joan`/`ibili`/`jakin`-class verbs of §1, §6–8, all ending in a bare
vowel or `-l`) take `-k`/`-n` **directly**, with an epenthetic `-e-` if the
stem ends in a consonant:

| Plain form | Verb | Tokano | Nokano |
|---|---|---|---|
| `dator` (etorri) | "(s)he comes" | `datork` | `datorn` |
| `doa` (joan) | "(s)he goes" | `doak` | `doan` |
| `dago` (egon) | "(s)he is (located)" | `dagok` | `dagon` |
| `daki` (jakin) | "(s)he knows" | `dakik` | `dakin` |
| `dabil` (ibili) | "(s)he walks/is doing" | `dabilek` | `dabilen` |

`datork`/`dagok`/`doak`/`dakik` add `-k`/`-n` straight onto the vowel-final
present stem; `dabil` (consonant-final) needs the linking `-e-`
(`dabil-e-k`/`dabil-e-n`) to avoid the unpronounceable cluster `†dabilk`/
`†dabiln`.

### Beyond `hura`/`haiek`

The same `-k`/`-n` (present) / `-a-`/`-na-`+`-n` (past) machinery extends to
**every** person of a sentence that doesn't itself involve `hi`/`zu`/`zuek` —
most visibly to 1st-person `NORK` forms, where the allocutive marker slots in
right before the final `-t`:

- `dut` ("I have it") → tokano `diat`, nokano `dinat` — *"Liburua erosi
  diat"* ("I bought the book, [I'm telling you, dude]").
- `nuen` ("I had it") → tokano `nian`, nokano `ninan`.

A full person-by-person allocutive grid for every mood/tense in §§1–8 would
roughly double the size of this document; the core-form table above plus
these formation rules covers the productive pattern the rest of the system
follows.

## 11. Periphrastic construction reference

For the ~20 synthetic verbs aside, every other Basque verb conjugates as
**stem + aspect suffix + auxiliary** — the `type: 'periphrastic'` shape the
data model anticipates.

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

### The full periphrastic tense matrix

Crossing the three aspect suffixes above with the auxiliary's own
mood/tense paradigms (§2's `izan` and §3's `ukan` — present, past, and
**ondorioa**, the "would" conditional) produces every periphrastic tense
Basque has. The table below lays out the complete grid for a transitive verb
(`ikusi`, NOR-NORK, `nik`/`ni`-row, auxiliary `ukan`) and an intransitive one
(`etorri`, NOR, `ni`-row, auxiliary `izan`):

| Tense Name | Formula | Example (`ikusi` / `etorri`) | English Translation |
|---|---|---|---|
| **Oraina** (Present / Present Habitual) | stem + `-t(z)en` + present aux | *ikusten dut* / *etortzen naiz* | "I see it / I'm seeing it" / "I come / I'm coming" |
| **Lehenaldiko Burutua** (Present Perfect) | stem + `-i`/`-tu` + present aux | *ikusi dut* / *etorri naiz* | "I have seen it" / "I have come" |
| **Geroa** (Future / Prospective) | stem + `-ko`/`-go` + present aux | *ikusiko dut* / *etorriko naiz* | "I will see it" / "I will come" |
| **Ondorioa** (Conditional — "would") | stem + `-ko`/`-go` + ondorioa-present aux (§2/§3) | *ikusiko nuke* / *etorriko nintzateke* | "I would see it" / "I would come" |
| **Ondorio Orokorra** (Past Habitual / Imperfect) | stem + `-t(z)en` + past aux | *ikusten nuen* / *etortzen nintzen* | "I used to see it / I was seeing it" / "I used to come / I was coming" |
| **Lehenaldi Mugatua** (Simple/Definite Past) | stem + `-i`/`-tu` + past aux | *ikusi nuen* / *etorri nintzen* | "I saw it" / "I came" |
| **Lehenaldi Ez-mugatua** (Pluperfect) | stem + `-i`/`-tu` + `izan` + past aux | *ikusi izan nuen* / *etorri izan nintzen* | "I had seen it" / "I had come" |
| **Ez-ohiko Baldintza** (Past Conditional — "would have") | stem + `-ko`/`-go` + ondorioa-past aux (§2/§3) | *ikusiko nukeen* / *etorriko nintzatekeen* | "I would have seen it" / "I would have come" |

Notes on the four "compound" rows:

- **Ondorio Orokorra** ("general result", past habitual/imperfect) reuses the
  *imperfective* `-t(z)en` suffix — same as **Oraina** — but swaps the
  present auxiliary for its past form (`dut`→`nuen`, `naiz`→`nintzen`). This
  is the tense for "used to do X" / "was doing X (back then)" — *Lehenago
  euskaraz hitz egiten nuen* ("I used to speak Basque before").
- **Lehenaldi Mugatua** ("bounded/definite past") is the ordinary preterite —
  *perfective* `-i`/`-tu` + past auxiliary, narrating a single completed event
  anchored to a specific point in the past (*Atzo filma hori ikusi nuen* — "I
  saw that film yesterday").
- **Lehenaldi Ez-mugatua** ("unbounded/indefinite past", pluperfect) inserts
  the invariant participle `izan` between the lexical participle and the past
  auxiliary — `ikusi izan nuen`, `etorri izan nintzen` — marking the event as
  *anterior to another past reference point* ("I had (already) seen it
  [before X happened]"), the same role English "had + past participle"
  plays. `izan` here doesn't conjugate — it's the same invariant non-finite
  form regardless of person, mirroring `ukan`/`izan`'s own participles (§14).
- **Ez-ohiko Baldintza** ("unusual/non-habitual conditional", past
  conditional) pairs the *prospective* `-ko`/`-go` suffix with the
  **ondorioa-past** auxiliary (`nukeen`/`nintzatekeen`, §2/§3's "Ondorioa,
  past" grids) — "would have done X (if...)", the counterfactual
  past-conditional: *Garaiz iritsi banintz, kontzertua ikusiko nukeen* ("If
  I'd arrived on time, I would have seen the concert").

### Worked examples

| Basque | Gloss |
|---|---|
| etorri naiz | I have come (`izan`, perfective) |
| etortzen naiz | I come / I'm coming (`izan`, imperfective) |
| etorriko naiz | I will come (`izan`, prospective) |
| ikusi dut | I have seen it (`ukan`, perfective) |
| ikusten dut | I see it (`ukan`, imperfective) |
| ikusiko dut | I will see it (`ukan`, prospective) |
| eman dio | (S)he gave it to him/her (`ukan` + dative) |
| gustatu zait | I liked it (`izan` + dative) |

## 12. Pronoun & case reference

Basic noun-phrase declensions, mirroring the shape of `VERBS`' `pronouns`
field (declined for whichever case that verb's subject takes).

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

- **Future (geroa)** — periphrastic: stem + `-ko`/`-go` + auxiliary, e.g.
  *"etorriko naiz"*. Reuses existing auxiliary conjugations.
- **Conditional (baldintza/ondorioa)** — *"banintz"*, *"banu"*, *"banengo"*
  (if-clauses, "baldintza"); *"nintzateke"*, *"nuke"*, *"nengoke"* (the
  "would" result, "ondorioa") — full tables for `izan`/`ukan` in §2/§3 above
  (`egon`'s own — *"nengoke"* — isn't covered here).
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

## 14. Non-finite forms (aditz-izenak, partizipioak, aditzondoak)

§11 covers the three non-finite stems (`-t(z)en`, `-i`/`-tu`, `-ko`/`-go`) as
they combine with a finite *auxiliary* to build tenses. This section covers
the other jobs those same non-finite stems do *without* a finite auxiliary —
as nouns, adjectives, and adverbs in their own right. All forms below are
built on the perfective participle (`ikusi`, `etorri`) — the same participle
§11 uses for `Lehenaldiko Burutua`/`Lehenaldi Mugatua`.

### The non-finite form inventory

| Form | Suffix | `ikusi` ("see", nor-nork) | `etorri` ("come", nor) | Function |
|---|---|---|---|---|
| Verbal noun — absolutive | `-tea`/`-tzea` | ikustea | etortzea | "(the act of) seeing/coming" — a clause acting as a noun |
| Verbal noun — dative | `-teari`/`-tzeari` | ikusteari | etortzeari | "to/for seeing/coming" |
| Verbal noun — causal | `-teagatik`/`-tzeagatik` | ikusteagatik | etortzeagatik | "because of seeing/coming" |
| Verbal noun — purposive | `-teko`/`-tzeko` | ikusteko | etortzeko | "(in order) to see/come" |
| Verbal noun — temporal/locative | `-tean`/`-tzean` | ikustean | etortzean | "when/upon seeing/coming" |
| Participle as adjective (attributive) | `-tako`/`-dako` | ikusitako | etorritako | "...that was seen" / "...who came" — modifies a following noun |
| Participle as predicate (resultative) | `-a` + `izan` | ikusia izan da | etorria da | "it has been seen" / "he/she has arrived (and is [still] here)" |
| Modal/instrumental adverbial | `-z` | ikusiz | etorriz | "by seeing" / "by coming" |

### Verbal nouns (`-te-`/`-tze-`): a clause that behaves like a noun

The **aditz-izena** ("verb-noun") is formed by adding `-a` to the
imperfective stem already tabulated in §11 (`ikusten` → `ikuste-`, `etortzen`
→ `etortze-`) — `ikustea`, `etortzea` — and then declines exactly like any
other `-a`-final noun, picking up case suffixes:

- **Absolutive** `-tea`: *Filma ikustea gustatzen zait* — "I like watching
  the film" (`ikustea` is the subject of `gustatzen zait`, §4's nor-nori
  `gustatu`).
- **Dative** `-teari`: *Telebista ikusteari utzi diot* — "I've given up
  watching TV" (`utzi` governs a dative complement).
- **Causal** `-teagatik` (`-gatik` = "because of/for"): *Filma berandu
  ikusteagatik, amaiera ez zuen ulertu* — "Because he watched the film late,
  he didn't understand the ending."
- **Purposive** `-teko` (`-ko` = genitive/purpose): *Filma ikusteko etorri
  naiz* — "I came (in order) to watch the film." This is the same `-ko`
  suffix as §11's prospective aspect (`ikusiko`) — both mark "aimed at
  X" — but attaches to the verbal noun rather than the bare participle.
- **Temporal/locative** `-tean` (`-an` = "in/at/on"): *Filma ikustean, negar
  egin nuen* — "When I saw the film [lit. "at the seeing of the film"], I
  cried." Pairs naturally with **Lehenaldi Mugatua** (§11) in the main
  clause.

`etorri` takes the same suffixes on its own imperfective stem `etortze-`:
`etortzea`, `etortzeari`, `etortzeagatik`, `etortzeko`, `etortzean` — *Etxera
etortzean, argia piztu nuen* ("When I got home, I turned on the light").

### Participles as adjectives: `-tako` (attributive) vs. `-a` + `izan` (resultative predicate)

Two distinct ways to use a participle outside a finite clause, easy to
conflate but grammatically and semantically different:

- **`-tako`/`-dako`** (attributive, modifies a noun): the perfective
  participle (`ikusi`, `etorri`) plus `-tako`, placed *before* the noun it
  modifies — *atzo ikusitako filma* ("the film [that was] seen yesterday"),
  *gaur etorritako jendea* ("the people who came today"). Functionally an
  ordinary adjective; it doesn't conjugate and carries no agreement.
- **`-a` + `izan`** (resultative predicate, *describes a state resulting from
  the action*): the perfective participle plus the adjective-forming `-a`,
  used as the complement of a conjugated `izan` — *etorria da* ("he/she has
  arrived [and is here now]"). This contrasts subtly with the ordinary
  perfect *etorri da* ("he/she has arrived/come") — `etorri da` reports the
  *event*, `etorria da` reports the resulting *state*, the same
  event-vs-state distinction English sometimes marks with "has come" vs. "is
  arrived."
  - For `nor-nork` verbs (auxiliary `ukan`, not `izan`), the resultative
    predicate needs `izan` inserted as an extra non-finite layer — *Lana
    eginda dago* (using the `-da` allomorph of `-a` after a vowel, plus
    `egon`) or, more formally, *Lana egina izan da* ("the work has been
    done") — this is also the basis of §15's analytic passive below.

### Modal/instrumental adverbials (`-z`)

Adding `-z` (the instrumental case ending) directly to the **perfective**
participle — *not* the verbal noun — produces a manner/means adverbial
clause, "by V-ing" / "V-ing, …":

- *Liburuak irakurriz, asko ikasten da* — "By reading books, one learns a
  lot."
- *Ikusiz ikasten da* — "One learns by seeing/observing."
- *Etorriz, denak harritu zituen* — "By coming [in person], he surprised
  everyone."

This `-z` adverbial is non-finite and invariant — no person agreement, same
form regardless of the subject of either clause — and is interchangeable in
most contexts with a fuller `-tearekin` ("with the V-ing") or `-ten duenean`
("when X V-s") periphrasis, but `-z` is the most compact and the one most
often seen in proverbs and instructions.

## 15. Passive & impersonal voice ("Nor-shift")

Basque has no dedicated passive *morphology* the way Latin or English does.
Instead, the same effect — backgrounding or omitting the agent — is achieved
syntactically: a `nor-nork` (transitive) periphrastic verb simply **drops its
`NORK` argument and swaps `ukan` for `izan`** on the same participle, turning
a two-argument transitive clause into a one-argument `nor` clause. Compare:

| `nor-nork` (agent expressed) | Gloss | "Nor-shifted" `nor` (agent dropped) | Gloss |
|---|---|---|---|
| Nik atea ireki dut | "I opened the door" | Atea ireki da | "The door opened / has been opened" |
| Haurrak leihoa hautsi du | "The child broke the window" | Leihoa hautsi da | "The window broke / has been broken" |
| Norbaitek argia itzali du | "Someone turned off the light" | Argia itzali da | "The light went off / has been turned off" |
| Guk euskaraz hitz egiten dugu | "We speak Basque" | Euskaraz hitz egiten da | "Basque is spoken (here)" / "People speak Basque" |

Mechanically, this is the *same* participle (`ireki`, `hautsi`, `itzali`,
`hitz egiten`) — only the auxiliary changes, from §3's `ukan` row to §1/§2's
`izan` row (`dut`→`da`, `dugu`→`da`, etc., always landing on `hura`/3rd
person since there's no longer an explicit `NOR` to agree with beyond "it/the
situation").

### Two readings: anticausative vs. impersonal passive

The "agent dropped" reading splits into two cases depending on the verb's
lexical semantics:

- **Change-of-state verbs** (`ireki`, `hautsi`, `itzali`, `piztu`, `itxi`,
  …) have a built-in *anticausative* alternation: *Atea ireki da* most
  naturally means "the door opened (by itself / on its own)" — no agent is
  implied at all, just an event happening to its single argument. This is
  the closer Basque counterpart to English "the door opened" (intransitive)
  rather than "the door was opened (by someone)" (passive).
- **Verbs without that alternation** (`hitz egin`, `idatzi`, `irakurri`,
  most verbs of creation/communication) have no plausible "happened by
  itself" reading, so the nor-shifted `-t(z)en da` form is read as
  unambiguously **impersonal/passive** — "is V-ed (by people in general)."
  This is *the* productive way Basque expresses generic statements,
  instructions, signs, and recipes: *Hemen ez da erretzen* ("No smoking
  here" / lit. "here it isn't smoked"), *Sukaldean euskaraz hitz egiten da*
  ("Basque is spoken in the kitchen"), *Sagarrak xehetu egiten dira* ("The
  apples are chopped up").

### The analytic passive (`-a`/`-ak` + `izan`)

When the agent must be backgrounded but an agentive ("by someone") reading
needs to be kept *explicit* — rather than collapsing into the anticausative
reading above — Basque has a more formal, literary **pasibo analitikoa**:
§14's resultative `-a`/`-ak` participle-as-predicate, with `izan` conjugated
for number:

- *Atea irekia izan da (norbaitek)* — "The door has been opened (by
  someone)" — explicitly agentive, vs. the ambiguous-toward-anticausative
  *Atea ireki da*.
- *Liburuak idatziak izan dira* — "The books have been written" (`-ak`
  agreeing with plural `liburuak`).

This construction is grammatical and occasionally seen in journalism/
translation, but native speakers strongly prefer the nor-shift (`ireki da`)
or impersonal `-t(z)en da` patterns above for the same meanings — the
analytic passive is the *least* idiomatic of the three, included here for
completeness rather than as the recommended form.

## 16. Subjunctive & Imperative (Konjuntiboa eta Agintera)

A consolidated module gathering this document's subjunctive and imperative
material — much of which already lives inside §§2–5 and §9 — into one place,
organised by argument structure (`NOR` / `NOR-NORI` / `NOR-NORK` /
`NOR-NORI-NORK`). The one genuinely new piece is the `NOR-NORI-NORK`
subjunctive and imperative grids, derived from §5's already-verified
ditransitive `Ahalera` forms via the same root-plus-suffix-family recipe §3
uses to relate its own `Ahalera`/`Subjuntiboa` pairs (`dezaket` ↔ `dezadan`).

### 16.1 Subjuntiboa (Subjunctive) — Orainaldia (Present) and Lehenaldia (Past)

#### NOR

`izan`'s own paradigm — see §2:

| Person | Present | Past |
|---|---|---|
| ni | na**din** | nen**din** |
| hi | ha**din** | hen**din** |
| hura | da**din** | ze**din** |
| gu | gaite**zen** | ginte**zen** |
| zu | zaite**zen** | zinte**zen** |
| zuek | zaitez**ten** | zintez**ten** |
| haiek | daite**zen** | zite**zen** |

Every cell ends in the subjunctive's defining **-n** — the surface form of
the same `-(e)n` subordinator that closes Basque subordinate clauses
generally (relative clauses, `-(e)la` complement clauses, etc.), here doing
double duty as the subjunctive mood marker itself.

#### NOR-NORI

Citation slice of §4's Subjuntiboa Present/Past grids — `NORI` rows × `NOR` =
`hura`/`haiek` columns (the **-zki-** infix marks the plural-`NOR` alternant,
e.g. `dakidan` → `dakizkidan`):

| NORI | Present (NOR=hura) | Present (NOR=haiek, -zki-) | Past (NOR=hura) | Past (NOR=haiek, -zki-) |
|---|---|---|---|---|
| niri | daki**dan** | dakizki**dan** | zeki**dan** | zekizki**dan** |
| hiri | dak**ian** / dak**inan** *(masc./fem.)* | dakizk**ian** / dakizk**inan** | zek**ian** / zek**inan** | zekizk**ian** / zekizk**inan** |
| hari | dak**ion** | dakizk**ion** | zek**ion** | zekizk**ion** |
| guri | daki**gun** | dakizki**gun** | zeki**gun** | zekizki**gun** |
| zuri | daki**zun** | dakizki**zun** | zeki**zun** | zekizki**zun** |
| zuei | dakizue**ten** | dakizkizue**ten** | zekizue**ten** | zekizkizue**ten** |
| haiei | daki**en** | dakizki**en** | zeki**en** | zekizki**en** |

The full 7×7 grids (`NOR` ranging across all seven persons, not just
`hura`/`haiek`) are in §4.

#### NOR-NORK

§3's Subjuntiboa Present/Past grids already cover the full 7×7 `NORK`×`NOR`
paradigm, including the plural-object **-it-**/**-tza-** infix (e.g. `dezan`
→ d**itz**an for `hark`→`haiek`). Citation slice (`NOR` = `hura`/`haiek`):

| NORK | Present (NOR=hura) | Present (NOR=haiek, -it-) | Past (NOR=hura) | Past (NOR=haiek, -it-) |
|---|---|---|---|---|
| nik | deza**dan** | ditza**dan** | ne**zan** | ni**tzan** |
| hik | dez**aan** / dez**anan** *(masc./fem.)* | ditz**aan** / ditz**anan** | hezan | hi**tzan** |
| hark | deza**n** | ditza**n** | ze**zan** | zi**tzan** |
| guk | deza**gun** | ditza**gun** | gene**zan** | geni**tzan** |
| zuk | deza**zun** | ditza**zun** | zene**zan** | zeni**tzan** |
| zuek | deza**zuen** | ditza**zuen** | zene**zaten** | zeni**tzaten** |
| haiek | deza**ten** | ditza**ten** | ze**zaten** | zi**tzaten** |

#### NOR-NORI-NORK

Not previously tabulated. Derived from §5's `Ahalera, Orainaldia` ditransitive
grid (`dieza-`/`diezazki-` root) by the same transformation §3 uses to relate
`Ahalera` to `Subjuntiboa`: drop the conditional **-ke-**, then close with the
`Subjuntiboa`-`NORK` suffix family from the NOR-NORK table above
(**-dan**/**-aan**/**-anan**/**-n**/**-gun**/**-zun**/**-zuen**/**-ten**)
instead of `-ke` + the `Ahalera`-`NORK` suffix. E.g. `diezaioket` (Ahalera,
"I can give it to him") → drop `-ke-` → `diezaiot` → swap the bare `-t` for
`-dan` → `diezaiodan` ("...so that I may give it to him").

Two `NORI` rows — `hari` and `haiei` — cover this section's own citation
forms (`diezaion`, `diezaiegun`, `diezazkion`):

##### NORI = hari ("...so that [NORK] may give [NOR] to him/her")

| NORK | Present (NOR=hura) | Present (NOR=haiek, -izki-) |
|---|---|---|
| nik | diezaio**dan** | diezazkio**dan** |
| hik | diezaio**an** / diezaio**nan** *(masc./fem.)* | diezazkio**an** / diezazkio**nan** |
| hark | diezaio**n** | diezazkio**n** |
| guk | diezaio**gun** | diezazkio**gun** |
| zuk | diezaio**zun** | diezazkio**zun** |
| zuek | diezaio**zuen** | diezazkio**zuen** |
| haiek | diezaio**ten** | diezazkio**ten** |

##### NORI = haiei ("...so that [NORK] may give [NOR] to them")

| NORK | Present (NOR=hura) | Present (NOR=haiek, -izki-) |
|---|---|---|
| nik | diezaie**dan** | diezazkie**dan** |
| hik | diezaie**an** / diezaie**nan** *(masc./fem.)* | diezazkie**an** / diezazkie**nan** |
| hark | diezaie**n** | diezazkie**n** |
| guk | diezaie**gun** | diezazkie**gun** |
| zuk | diezaie**zun** | diezazkie**zun** |
| zuek | diezaie**zuen** | diezazkie**zuen** |
| haiek | diezaie**ten** | diezazkie**ten** |

*Adibideak:* `Irakasleak eskatu zidan liburua ikasleari eman diezaiodan`
("The teacher asked me to give the book to the student" — hari/nik);
`Gurasoek nahi dute opariak haurrei eman diezazkien` ("The parents want the
gifts to be given to the children" — haiei/haiek).

`niri`/`guri`/`zuri`/`zuei` as `NORI` follow the identical recipe (root
`diezada-`/`diezagu-`/`diezazu-`/`diezazue-`, from §5's already-verified
`Ahalera` columns, plus the same `-n`-family suffixes) but aren't tabulated
here — left as a future pass, the same posture as other not-yet-expanded
grids in this document (see `DECISIONS.md`).

**Past (Lehenaldia) note:** a synthetic `NOR-NORI-NORK` subjunctive past
(mirroring `niezaiokeen` → `niezaioen`) is morphologically derivable by the
same drop-`-ke-` transformation, but forms this far down the ditransitive
paradigm are vanishingly rare even in formal/literary registers — real usage
reaches for a periphrastic alternative (`eman ahal izan banio...`) well
before this point. Not tabulated, per this document's standing policy of an
honest gap over an unverifiable form (cf. `etzan`, `ikusi`/`entzun` in §§7–8).

### 16.2 Agintera (Imperative)

#### Synthetic imperatives

For verbs whose present tense is itself synthetic, the second-person
imperative is often **identical to the present-tense form** — a real feature
of Basque, not a simplification:

| Verb | hi | zu | zuek |
|---|---|---|---|
| izan | hadi | zaitez | zaitezte |
| egon | hago | zaude | zaudete |
| etorri | hator | zatoz | zatozte |
| joan | hoa | zoaz | zoazte |

`izan` additionally has dedicated 3rd-person **jussive** forms (§2): `bedi`
("let it/him/her be"), `bitez` ("let them be"). `egon` has the parallel
`bego`/`begoz` ("let it stay/be [as is]" — *Bego horrela* = "leave it at
that"). `etorri`/`joan` have no synthetic 3rd-person jussive in Batua; the
periphrastic **bare-radical + `bedi`/`bitez`** construction fills the gap
instead — see the Radical/Bare-Stem rule below (`etor bedi`, `joan bedi`).

#### NOR-NORK imperative (`ukan`-based — "do it!")

| Addressee | Singular object | Plural object (**-itz-**) |
|---|---|---|
| (hik) | ez**ak** *(masc.)* / ez**an** *(fem.)* | itz**ak** *(masc.)* / itz**an** *(fem.)* |
| (zuk) | ez**azu** | itz**azu** |
| (zuek) | ez**azue** | itz**azue** |
| (hark, jussive) | be**za** | bi**tza** |
| (guk, hortative) | deza**gun** | ditza**gun** |
| (haiek, jussive) | be**zate** | bi**tzate** |

*Adibideak:* `Ekarri ezazu liburua` ("Bring the book"); `Irakur itzazu
gutunak` ("Read the letters" — plural object); `Has dezagun lana` ("Let's
start the work" — hortative).

#### NOR-NORI-NORK imperative (ditransitive — "give it to...!")

The ditransitive imperative root is the `NOR-NORI-NORK` subjunctive root
(§16.1) with the leading `d-` dropped — `diezaiozu` → `iezaiozu` — the same
`d-`-dropping relationship as `dezazu` → `ezazu` in the plain `NOR-NORK` grid
above.

| Addressee | → niri ("to me") | → hari ("to him/her") | → guri ("to us") | → haiei ("to them") |
|---|---|---|---|---|
| (zuk) | iezada**zu** | iezaio**zu** | iezagu**zu** | iezaie**zu** |
| (zuek) | iezada**zue** | iezaio**zue** | iezagu**zue** | iezaie**zue** |
| (hik) | iezada**k** / iezada**n** | iezaio**k** / iezaio**n** | iezagu**k** / iezagu**n** | iezaie**k** / iezaie**n** |

Plural object (**-zki-**, "give them to...!"):

| Addressee | → niri | → hari | → guri | → haiei |
|---|---|---|---|---|
| (zuk) | iezazkida**zu** | iezazkio**zu** | iezazkigu**zu** | iezazkie**zu** |
| (zuek) | iezazkida**zue** | iezazkio**zue** | iezazkigu**zue** | iezazkie**zue** |
| (hik) | iezazkida**k** / iezazkida**n** | iezazkio**k** / iezazkio**n** | iezazkigu**k** / iezazkigu**n** | iezazkie**k** / iezazkie**n** |

*Adibideak:* `Eman iezadazu liburua` ("Give me the book") — one of the most
common imperative constructions in everyday Basque; `Eska iezaiozu
barkamena` ("Ask him/her for forgiveness").

### 16.3 Syntax, Usage, and Constraints

#### Subjunctive triggers

- **Final/purpose clauses** — a subordinate clause whose verb is in the
  subjunctive, marking *purpose* ("so that..."): `Leihoa ireki dut, airea sar
  dadin` ("I opened the window so that air would come in"). The
  subjunctive's own **-n** ending *is* the subordinator here — no separate
  complementizer is layered on top.
- **Volitional/desire clauses** — `nahi izan` ("to want") governing a
  subjunctive complement: `Nahi dut etor dadin` ("I want him/her to come");
  `Nahi dute liburua irakur dezadan` ("They want me to read the book").
- **Indirect commands** — verbs of telling/ordering (`esan`, `agindu`,
  `eskatu`) governing a subjunctive complement, optionally with the
  reported-speech complementizer **-(e)la**: `Esan diot etor dadila` ("I told
  him/her to come" — lit. "...that he/she come").

#### The Radical/Bare-Stem Rule

Periphrastic verbs **drop their aspectual suffix** (`-tu`/`-i`/`-tzen`/`-ko`,
§11) and revert to the **bare radical** when paired with a subjunctive or
jussive auxiliary:

| Periphrastic form | Radical | + Subjunctive/jussive auxiliary |
|---|---|---|
| idatzi (`-tu` participle) | idatz- | idatz **dezan** ("so that he/she may write it") |
| etorri (`-i` participle) | etor- | etor **dadin** ("so that he/she may come"), etor **bedi** ("may he/she come" — jussive) |
| joan (`-i` participle) | joan- *(unchanged — already ends in `-n`)* | joan **bedi** ("may he/she go") |
| irakurri (`-i` participle) | irakur- | irakur **dezala** ("let him/her read it" — with `-la`) |

The radical is, structurally, the verb's citation form stripped of every
aspectual ending — `idatzi` → `idatz`, `etorri` → `etor`, `egin` → `egin`
(already bare). It's the same stem the `nahi`/`behar`/`ahal`/`ezin`
constructions surveyed in `VERB_COVERAGE.md` §5 build on.

#### Person-Case Constraint (PCC) — re-verified

§5's "`NOR` = 1st/2nd person" subsection already establishes the rule for
indicative ditransitives; it carries over unchanged to subjunctive and
imperative `NOR-NORI-NORK` forms, since the constraint is about which
*arguments* can be cross-referenced together, independent of mood:

- **`NORI` = 3rd person** (`hari`/`haiei`, as in §16.1/§16.2's tables above):
  `NOR` can be 1st/2nd person, but the form **collapses to the plain
  `NOR-NORK` subjunctive/imperative** (§16.1/§16.2's `NOR-NORK` tables) — the
  dative simply isn't cross-referenced. "So that he may show *me* to him"
  reduces to `NOR-NORK`'s `nazan` ("...so that he may show me"), with "to
  him" left to context — exactly as `Hark ni hari aurkeztu nau` does in the
  indicative (§5).
- **`NORI` = 1st/2nd person** *and* `NOR` = 1st/2nd person: blocked, same as
  the indicative — two non-3rd-person core arguments can't both be
  cross-referenced on one auxiliary. The `buru` ("self") periphrasis (*nire
  buruari erakuts diezaiodan* — "so that I may show it to myself") is the
  workaround, same as §5.

No new exceptions or relaxations apply in these moods — the PCC is a property
of the auxiliary's agreement morphology, not of any one mood/tense built on
top of it.
