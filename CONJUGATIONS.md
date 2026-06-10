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
| haiek | naute | haute | dute | gaituzte | zaituzte | zaituzte | dituzte |

#### Past — `NOR` = 1st/2nd person

`zuek`-as-object is left blank (`—`) throughout.

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | hindudan | nuen | *(refl.)* | zintudan | zintuztedan | nituen |
| hik | ninduan / nindunan | *(refl.)* | huen | gintuan / gintunan | *(hika/zuka)* | *(hika/zuka)* | hituen |
| hark | ninduen | hinduen | zuen | gintuen | zintuen | zintuzten | zituen |
| guk | *(refl.)* | *(refl.)* | genuen | *(refl.)* | zintugun | zintuztegun | genituen |
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

`hi`-forms (as either `NOR` or `NORK`) aren't attested for Alegiazkoa/
Lehenaldia and are left blank (`—`).

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
| nik | *(refl.)* | — | nezake | *(refl.)* | zintzaket | zintzaketet | nitzake |
| hik | — | *(refl.)* | hezake | — | *(hika/zuka)* | *(hika/zuka)* | hitzake |
| hark | nintzake | — | lezake | gintzake | zintzake | zintzakete | litzake |
| guk | *(refl.)* | — | genezake | *(refl.)* | zintzakegu | zintzaketegu | genitzake |
| zuk | nintzakezu | *(hika/zuka)* | zenezake | gintzakezu | *(refl.)* | *(refl.)* | zenitzake |
| zuek | nintzakezue | *(hika/zuka)* | zenezakete | gintzakezue | *(refl.)* | *(refl.)* | zenitzakete |
| haiek | nintzakete | — | lezakete | gintzakete | zintzakete | zintzakete(te) | litzakete |

#### Ahalera, Lehenaldia (Past) — "I could have… / was able to…"

| NORK ↓ ╲ NOR → | ni | hi | hura | gu | zu | zuek | haiek |
|---|---|---|---|---|---|---|---|
| nik | *(refl.)* | — | nezakeen | *(refl.)* | zintzakedan | zintzaketedan | nitzakeen |
| hik | — | *(refl.)* | hezakeen | — | *(hika/zuka)* | *(hika/zuka)* | hitzakeen |
| hark | nintzakeen | — | zezakeen | gintzakeen | zintzakeen | zintzaketen | zitzakeen |
| guk | *(refl.)* | — | genezakeen | *(refl.)* | zintzakegun | zintzaketegun | genitzakeen |
| zuk | nintzakezun | *(hika/zuka)* | zenezakeen | gintzakezun | *(refl.)* | *(refl.)* | zenitzakeen |
| zuek | nintzakezuen | *(hika/zuka)* | zenezaketen | gintzakezuen | *(refl.)* | *(refl.)* | zenitzaketen |
| haiek | nintzaketen | — | zezaketen | gintzaketen | zintzaketen | zintzakete(te)n | zitzaketen |

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
`NOR` = 1st/2nd person ("he gives *me* to him") exists in principle — it
would follow §3's NOR-NORK shape (`NOR` marked by a prefix/stem-internal
change, e.g. the `nau-`/`gaitu-`-type stems) with a `NORI` suffix layered on
top — but is vanishingly rare in practice and not covered here.

### `NOR` = hura — Present

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | dit | didagu | didazu | didazue | didate |
| hari | diot | dio | diogu | diozu | diozue | diote |
| guri | — | zigun | *(refl.)* | diguzu | diguzue | ziguten |
| zuri | dizut | dizu | dizugu | *(refl.)* | *(zu↔zuek)* | dizute |
| haiei | diet | die | diegu | diezu | diezue | diete |

Each form follows **`di-` + `NORI`-suffix + `NORK`-suffix**: `NORI`-suffixes
`-da-`/`-o-`/`-gu-`/`-zu-`/`-e-` for `niri`/`hari`/`guri`/`zuri`/`haiei`;
`NORK`-suffixes `-t`/`∅`/`-gu`/`-zu`/`-zue`/`-te` for
`nik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`.

`guri`/`guk` and `zuri`/`zuk` are `*(refl.)*` ("we give it to ourselves",
"you give it to yourself") — distinct from the `—` cells (`niri`/`nik`,
`guri`/`nik`), which are gaps rather than reflexive impossibilities.

### `NOR` = hura — Past

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zidan | genidan | zenidan | zenidaten | zidaten |
| hari | nion | zion | genion | zenioen | zenioten | zioten |
| guri | — | zigun | *(refl.)* | zenigun | zeniguten | ziguten |
| zuri | nizun | zizun | genizun | *(refl.)* | *(zu↔zuek)* | zizuten |
| haiei | nien | zien | genien | zenien | zenieten | zieten |

The prefix-encodes-`NORK` pattern from §3's past-tense `ukan` grid
(`n-`/`z-`/`gen-`/`zen-`/`zen-…te`/`z-…te` for
`nik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`) accounts for every cell here too —
e.g. `genidan` = `gen-i-da-n` (guk→niri), `zenigun` = `zen-i-gu-n` (zuk→guri),
`zenieten` = `zen-i-e-te-n` (zuek→haiei).

### `NOR` = haiek — Present

Same grid shape, with the `-zki-` infix marking the plural object (`di-` →
`di-zki-`), inserted right before the `NORI` suffix — e.g. `dizkidazu` =
`di-zki-da-zu` ("you give them to me"), `dizkio` = `di-zki-o` ("he gives them
to him").

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | dizkida | dizkidagu | dizkidazu | dizkidazue | dizkidate |
| hari | dizkiot | dizkio | dizkiogu | dizkiozu | dizkiozue | dizkiote |
| guri | — | dizkigu | *(refl.)* | dizkiguzu | dizkiguzue | dizkigute |
| zuri | dizkizut | dizkizu | dizkizugu | *(refl.)* | *(zu↔zuek)* | dizkizute |
| haiei | dizkiet | dizkie | dizkiegu | dizkiezu | dizkiezue | dizkiete |

### `NOR` = haiek — Past

Same `-zki-` infix over the past grid's prefix-encodes-`NORK` forms — e.g.
`zizkidan` = `z-i-zki-da-n` ("he had given them to me"), `nizkion` =
`n-i-zki-o-n` ("I had given them to him").

| NORI ↓ ╲ NORK → | nik | hark | guk | zuk | zuek | haiek |
|---|---|---|---|---|---|---|
| niri | — | zizkidan | genizkidan | zenizkidan | zenizkidaten | zizkidaten |
| hari | nizkion | zizkion | genizkion | zenizkioen | zenizkioten | zizkioten |
| guri | — | zizkigun | *(refl.)* | zenizkigun | zenizkiguten | zizkiguten |
| zuri | nizkizun | zizkizun | genizkizun | *(refl.)* | *(zu↔zuek)* | zizkizuten |
| haiei | nizkien | zizkien | genizkien | zenizkien | zenizkieten | zizkieten |

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

## 10. Periphrastic construction reference

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

## 11. Pronoun & case reference

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

## 12. Beyond present / past — notes

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
