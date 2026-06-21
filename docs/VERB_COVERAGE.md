# Basque verb coverage — a roadmap

A scoping reference for what `VERBS` would need to grow into for Aditzak to
give learners a reasonably complete picture of Basque (Euskara Batua) verb
conjugation. A lesson is built from three axes — **verb**, **tense/mood**, and
**agreement pattern (NOR-NORI-NORK)** — plus **grammatical person**, which cuts
across all of them. Each section marks what exists today (✅) vs. open ground
(🔲), so this can double as a checklist when picking the next verb/tense to add.

Today the app covers exactly one slice of this space: `izan` and `ukan`, in
`present`/`past`, with `nor` and `nor+nork` agreement, across six persons.

## 1. Grammatical persons (pertsonak)

| Person | App label | Status |
|---|---|---|
| ni | I | ✅ |
| hi | you (familiar) | ✅ — intimate/informal register ("hika") |
| zu | — | 🔲 **not modeled** — the everyday neutral "you" in spoken/written Batua (etymologically plural, used as the default polite/standard singular); arguably more essential for a learner than `hi`, which is reserved for close/informal relationships. Worth noting: every conjugation reference that's come up while writing this doc (e.g. `iraun`'s table — "Hik dirauk/n" *and* "Zuk dirauzu" as separate rows, with their own distinct past forms `hirauen`/`zenirauen`) lists `zu` as a full, distinct person alongside `hi`, not a substitute for it — reinforcing that this is a real gap in the seven-person paradigm, not an arbitrary six-person simplification |
| hura | he / she / it | ✅ |
| gu | we | ✅ |
| zuek | you all | ✅ |
| haiek | they | ✅ |

Past these seven sits **allocutive agreement (hitano)**: when speaking *to*
someone as `hi`, finite verb forms change shape based on the addressee's
perceived gender — "toka" (`-k`) forms for a male addressee, "noka" (`-n`)
forms for a female one — independent of who the grammatical subject is (e.g.
"Etorri duk" / "Etorri dun" both mean "(s)he came", said to a male/female `hi`
respectively). It's the genuine ceiling of "full mastery," but a fine thing to
leave out of a learner-facing app for a long time.

## 2. Agreement patterns — NOR / NORI / NORK

`agreement` is already typed as a subset of `['nor', 'nori', 'nork']`. Four
combinations occur in the language:

| Pattern | What it marks | Example verbs | Status |
|---|---|---|---|
| `nor` | absolutive only — intransitive subject | izan, egon, joan, etorri, ibili | ✅ `izan` |
| `nor + nork` | absolutive object + ergative subject — transitive | ukan, eduki, eraman, ekarri, erabili, egin, ikusi | ✅ `ukan` |
| `nor + nori` | absolutive stimulus + dative experiencer — "psych" verbs | gustatu ("gustatzen zait" = I like it, lit. "it pleases to-me"), iruditu, interesatu, ahaztu, gertatu | 🔲 no example yet — produces some of Basque's most distinctive sentence patterns and is worth prioritizing |
| `nor + nori + nork` | all three arguments marked — ditransitive | eman, esan, erakutsi, saldu, bidali, eskaini; also the covert-dative batch `lagundu`/`ekin`/`erantzun`/`deitu`/`eragin`/`antzeman` + dative `egin` compounds (#307), `itxaron`'s dative reading (#334), and the ditransitive-dative readings of `saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu` (#334) | ✅ `esan`/`eman` (§4a/§4b), extended by #307 (§4b-ter) and #334 (§4b-ter/§4b-quater) |

`AGREEMENT_META` already has copy and a badge style for `nori` — only the verb
data is missing to exercise it.

**Important wrinkle:** NOR-NORI and NOR-NORI-NORK agreement is *usually* carried
by `izan`'s and `ukan`'s synthetic auxiliary paradigms (`zait`/`zaio`/
`natzaio`... for NOR-NORI; `dio`/`diot`/`diet`... for NOR-NORI-NORK) rather
than by an independently-synthetic lexical verb — that's the route `gustatu`
and `iruditu` (both regular `-tu` participles, periphrastic) take; their
"conjugation table" *is* `izan`'s NOR-NORI auxiliary paradigm — see §4b.

But there *is* a small family of native synthetic exceptions — verbs that
mark `nori` (or `nori`+`nork`) themselves, no auxiliary needed — and two of
them are a better first target than reaching for a periphrastic verb at all:

- **`jario`** ("to flow/ooze" — "Iturriari ura dario" = "Water flows from
  the fountain"; "Izerdia dario" = "He's sweating") conjugates directly
  (present `dari(zki)t/k/o/gu/zu/zue/e`, i.e. `dariot`/`dario`/`darizkio`...)
  and is defective — almost always used with an inanimate `nor` (water,
  tears, sweat, blood, words) — so a lesson would naturally fix `nor`
  (mirroring `ukan`'s `object: 'hura'`) and vary the table by **`nori`
  person** instead, which the existing `conjugations` shape already
  supports. Its standard-Batua past paradigm (`zeridan`/`zerion`/`zerigun`...)
  and Bizkaian variant (`darie`/`erion`) are both just `jario`'s own past
  forms, not separate verbs — an unusually exact fit for the app's
  present+past shape. (One honest caveat, straight from the source above:
  it explicitly calls `jario` itself "oso erabilpen mugatua" — of very
  limited everyday use. It remains the *grammatically* cleanest synthetic
  `nor-nori` route; "commonly reached for in conversation" is a separate
  question §4b's `gustatu`/`iruditu` answer better.) See §4a.
- **`esan`** ("to say") is the everyday, central case for `nor-nori-nork` —
  and a source surfaced while researching this says so explicitly: "Aditz
  honek NOR-NORI-NORK erabilera ere badu, batez ere Bizkaia aldean" ("This
  verb also has NOR-NORI-NORK use, especially in the Bizkaia area"). Its
  `dio`/`diot`/`diozu`... forms run on the same defective `*-io-` root that
  `ukan` itself borrows when *it's* used ditransitively as an auxiliary —
  see §4a. A markedly better first pick than `eman` (periphrastic, §4b) or
  `iritzi`/`deritzo` ("to deem/consider" — rarer, more literary).

Both routes land their agreement pattern *and* stay fully synthetic — no
periphrastic plumbing required, unlike `gustatu`/`iruditu`/`eman` in §4b.

**A correction worth flagging in public:** an earlier draft of this document
filed `irudi` here as "the rarer literary cousin of `iruditu`, in NOR-NORI
territory." That was wrong on both counts. A teaching source's conjugation
table labels `irudi` (`dirudi`, `dirudizu`...) explicitly **NOR-NORK** — same
`-t`/`-k`-`n`/∅/`-gu`/`-zu`/`-zue`/`-te` suffix shape as `esan`/`jardun`/
`iraun` — *and* spells out that it is **not** a synthetic stand-in for
`iruditu` at all: "Ez nahastu: iruditzen zait = uste dut / dirudizu = ematen
duzu" ("Don't confuse: 'it seems to me' [`iruditu`] = 'I think' (subjective
opinion, NOR-NORI) vs. 'you seem/look' [`irudi`] = 'you give the impression'
(external appearance, NOR-NORK)"). They're cognates that have drifted apart in
both meaning *and* agreement — exactly the kind of false-friend pairing that's
easy to bake into bad lesson content by analogy. `iruditu` remains the right
`nor-nori` teaching example; `irudi`/`dirudi` is, if anything, one more
perfectly regular `nor-nork` option in the same family as `esan`/`jardun`/
`iraun` (and another instance of "synthetic morphology doesn't telegraph the
verb's semantic transitivity" — see `jardun` and §5).

## 3. Tenses / moods (denborak eta moduak)

The app's two tenses are the indicative core. Roughly in the order a learner
would meet them next:

### 3a. Indicative (indikatiboa)
- **Oraina** (present) — naiz, dut, nago, nabil, noa, nator — ✅
- **Lehena / Iragana** (past) — nintzen, nuen, nengoen, nenbilen — ✅
- **Geroa** (future) — 🔲 the natural third tense. For the verbs above it's
  formed periphrastically (root + `-ko`/`-go` + auxiliary, e.g. "etorriko
  naiz" = "I will come"), so it reuses the existing auxiliary conjugations as
  scaffolding rather than requiring a whole new synthetic paradigm

### 3b. Conditional / hypothetical (baldintza / hipotetikoa) — 🔲
- **Baldintza** ("if" clauses): banintz, banu, banengo
- **Ondorioa** (the "would" result): nintzateke, nuke, nengoke

### 3c. Potential (ahalera) — 🔲
- Present: naiteke, dezaket, nagoke
- Past: nintekeen, nezakeen, nengokeen
- This synthetic `-ke` paradigm is historically `ahal` ("ability/possibility")
  grammaticalized into a suffix — and it's a *closed set*, available only to
  verbs that already carry full synthetic conjugations (`izan`, `ukan`/`eduki`,
  `egon`, `ibili`, `joan`, `etorri`, `jakin`...). For every other — i.e. most
  — verb in the language, "can" is expressed the *other* way `ahal` shows up:
  periphrastically, see §5

### 3d. Subjunctive (subjuntiboa) — 🔲
- nadin, dezadan, nengoen — mostly appears embedded in subordinate clauses
  ("Nahi dut etor dadin" = "I want him/her to come")

### 3e. Imperative (agintera) — 🔲
- hadi / zaitez / zaitezte (be!), ezak / itzazu (have it!) — second-person
  only, so it's the one mood that can't fill the usual
  ni/hi/hura/gu/zuek/haiek table; it would need its own lesson/question shape

For **periphrastic verbs**, each "tense" above is actually a (non-finite verb
form × auxiliary tense) pair — e.g. "ibiltzen naiz" (present, habitual),
"ibili naiz" (present perfect), "ibiltzen nintzen" (past habitual), "ibiliko
naiz" (future). That's a second axis of complexity synthetic verbs don't have,
and is presumably what the `type: 'periphrastic'` plumbing is there for.

## 4. Verbs to cover

### 4a. Synthetic verbs (aditz trinkoak)
The lexical verbs Batua still conjugates directly (i.e. *they themselves*
take person/agreement endings, with no participle+auxiliary needed). The first
dozen are common, everyday `nor`/`nor-nork` verbs; the last few are rarer but
each unlocks something the first dozen structurally can't — `jario` is the
cleanest route to `nor-nori`, `esan` to `nor-nori-nork`:

| Verb | Meaning | Agreement | Status |
|---|---|---|---|
| izan | to be | nor | ✅ |
| ukan | to have (auxiliary) | nor-nork | ✅ |
| egon | to be (located / in a state) | nor | 🔲 flagged in `DECISIONS.md` as needed before `izan`'s location/state example sentences can be written correctly |
| joan | to go | nor | 🔲 |
| etorri | to come | nor | 🔲 |
| ibili | to walk around / be doing | nor | 🔲 |
| eduki | to hold / keep / have | nor-nork | 🔲 |
| eraman | to carry / take | nor-nork | ✅ (#260) — `eroan`/`eruan` is the western/Bizkaian dialectal variant; a `dialectVariants` candidate (see §4c) |
| ekarri | to bring | nor-nork | ✅ (#260) |
| erabili | to use | nor-nork | 🔲 |
| jakin | to know (a fact) | nor-nork | 🔲 — pairs naturally with periphrastic `ezagutu` ("to know/recognise *people*, places") for the classic savoir/connaître-style contrast, see §4b |
| egin | to do / make | nor-nork | 🔲 — like `iraun`, a genuine synthetic/periphrastic overlap: rare synthetic forms exist (e.g. `dakit` "I do it", `egizu` as an hitano imperative in some dialects), mostly preserved in Western/Central dialects and literary Basque, but everyday Batua uses the periphrastic `egiten dut`/`egin nuen` (§4b-bis) — also Basque's classic transitive "light verb" for compound verbs (`lo egin` "to sleep", `dantza egin` "to dance", `barre egin` "to laugh") |
| iraun | to last / endure | nor-nork | 🔲 fully paradigmed (corrected — earlier guess of "defective `nor`" was wrong): "Nik diraut, Hik dirauk/n, Hark dirau, Guk diraugu, Zuk dirauzu, Zuek dirauzue, Haiek diraute" follows the *exact* `root + standard NORK suffix` shape `ukan`/`ekarri`/`eraman`/`eduki` all use (`-t`/`-k`-`n`/∅/`-gu`/`-zu`/`-zue`/`-te`) — about as regular and low-friction a `nor-nork` pick as exists. Also a genuine synthetic/periphrastic overlap in real usage: "Hiru ordu iraun du filmeak" pairs the *participle* `iraun` with `ukan` as auxiliary, right alongside the synthetic `dirau` forms |
| jario | to flow / ooze / stream ("malkoak dario" = tears flow from him) | nor-nori | 🔲 defective (effectively fixed `nor`, varies by `nori` person) — **and** it already has its own present/past synthetic pair: `dario`/`darie` (present) ↔ `erion`/`erien` (past, Bizkaian) — `erion` isn't a separate verb, it's `jario`'s own past stem. That's a remarkably exact match for the app's present+past shape, on top of being the lowest-friction `nor-nori` route (native synthetic, no auxiliary, fits `object`-fixed `conjugations`) |
| esan | to say | nor-nork / nor-nori-nork | 🔲 the everyday, central `nor-nori-nork` verb — its ditransitive forms (`dio`/`diot`/`diozu`...) run on the same defective `*-io-` root that `ukan` borrows for *its* ditransitive auxiliary use; `erran` is the northern (Lapurdian/Zuberoan) dialectal variant, again a `dialectVariants` candidate. A much better first `nor-nori-nork` pick than `eman` or `iritzi` |
| jardun | to be engaged in / at it ("zertan dihardu?" = "what's he up to?") | nor-nork | 🔲 a curiosity worth knowing about rather than prioritising: it expresses the *same* "ongoing action" meaning as `ari`/`ibili` (§5), but — unlike them — conjugates in the transitive `du`-pattern (`dihardut` "I'm at it" ~ `dut`) despite being semantically intransitive. One more data point for "the form doesn't follow the lexical verb's transitivity," alongside `nahi`/`behar`/`ari` |
| etzan | (corrected — not "to lie/recline"; that example was my fabrication) the source's actual gloss is narrower: either the static position of a body/corpse, or — its real teaching use — the abstract "to consist of / for the essence of something to lie in [something]," as in "Zertan datza ariketa? Paragrafo bat irakurtzean datza." ("What does the exercise consist of? It consists of reading a paragraph.") | nor | 🔲 full `nor` paradigm (present + past, all seven persons) now sourced and in `CONJUGATIONS.md` §9 — confirms `datza` (3sg) and fills in the rest. But the original source remains blunt about it: "oso erabilpen mugatua du" (it has very limited usage) and "egon eta izan aditzen bidez erraz saihes liteke" (it can easily be avoided by using `egon`/`izan` instead). In other words, native teaching materials actively steer learners away from it. Keep it on the radar as a genuine `nor` form, but `egon` remains the far better everyday `nor` pick — `etzan` is more a "recognise it when you see it" item than a core lesson candidate |

**`atxiki`** (corrected spelling — not "atxeki"; "to adhere/cling [to],
hold fast") and **`iharduki`** ("to converse, hold forth" — a relative of
`jardun`) are also genuinely synthetic and listed in EGLU-II alongside the
verbs above, but a closer pass (EGLU-II + OEH, June 2026) shows the original
caution above wasn't a research gap — both are *historically* defective,
not just under-researched:

- **`atxiki`**: only a single synthetic form is independently attested —
  3sg present `datxika`/`datxeka` (nor-nori). No past paradigm is attested
  at all, and no other person is attested or even safely pattern-derivable
  from the sources at hand. Effectively a one-cell paradigm — too defective
  to support a per-person lesson table; documentation-only.
- **`iharduki`** (nor-nork, like `jardun`/`irudi`): present has 3 directly
  attested persons — `dihardu` (hura), `dihardu(zu)` (zu), `dihardukite`
  (haiek) — plus 2 more that are pattern-derived/rare rather than directly
  attested; `hi`/`zuek` present are unattested. Past has exactly 1 attested
  form (3sg). Archaic and restricted to classical Lapurdian/Zuberoan
  literary register — its attested forms trace to Leiçarraga's 1571 Basque
  New Testament translation. Richer than `atxiki` but still too partial and
  too archaic/regional for a standard lesson table; documentation-only for
  now. See `LANGUAGE_DECISIONS.md` #246 for the full sourcing writeup.

### 4b. Representative periphrastic verbs (aditz perifrastikoak)
None yet — `TYPE_META.periphrastic` exists but no verb actually conjugates as
participle + auxiliary. Good first picks, chosen to cover distinct participle
endings, both auxiliaries, *and* (for `nor-nori`/`nor-nori-nork`) as a second,
auxiliary-driven route alongside the native-synthetic one in §4a:
- **`gustatu`/`iruditu`** ("to like"/"to seem", `-tu` participles) — `izan`'s
  NOR-NORI auxiliary paradigm wearing a participle (`gustatzen zait/zaio/
  zaigu...`); picking either buys new agreement *and* a first periphrastic
  verb in one addition
- **`jarraitu`** ("to follow", `-tu` participle, `jarraiki` in the
  East/Lapurdian-Zuberoan tradition — another `dialectVariants` candidate) —
  a more concrete `nor-nori` example than `gustatu`/`iruditu` ("jarraitzen
  zaio" = "follows him/her"), though it can also pattern as `nor-nork`
  ("jarraitzen dio" = "continues it") depending on sense/register, so it's a
  noisier first pick than the two above
- **`eman`/`esan`** ("to give"/"to say", `-n` participles) — the auxiliary-
  driven route to `nor + nori + nork`, via `ukan`'s ditransitive forms
  (`ematen dio/diot/diet...`); §4a's native-synthetic `esan` is the cleaner
  pick if the goal is *just* landing the agreement pattern
- **other `-tu` verbs**: erosi (to buy), **ezagutu** (to know/recognise
  *people, places* — pairs with synthetic `jakin`, "to know *facts*", for the
  classic savoir/connaître-style contrast that's a great teaching moment in
  its own right; ✅ in `VERBS` as of #320, plain `nor-nork` reading)
- **`-i` verbs**: jan (to eat), edan (to drink), **ikusi** (to see)
- **`-n` verbs**: **entzun** (to hear/listen)
- **`etorri`** is a natural bridge case: synthetic in present/past, but
  periphrastic in the other tenses

### 4b-bis. More periphrastic `nor-nork` candidates (participle + `ukan`)
A further batch of everyday verbs, all the same low-friction shape as
`jan`/`edan`/`erosi`/`ikusi` (radical + `-tzen`/`-ten` for the present,
bare participle + `ukan`'s past auxiliary for the past) — good fits for
extending Unit 10's pooled drill or seeding later units:

| Verb | Meaning | Present (nor-nork) | Past (nor-nork) | Notes |
|---|---|---|---|---|
| hartu | to take / receive | Hartzen dut | Hartu nuen | ✅ in `VERBS` |
| saldu | to sell | Saltzen dut | Saldu nuen | ✅ in `VERBS` (#319, plain `nor-nork` reading; the `nor-nori-nork`/"saldu dio" reading is `saldu-dative`, §4b-quater, #334) |
| irakurri | to read | Irakurtzen dut | Irakurri nuen | ✅ in `VERBS` (#319) |
| idatzi | to write | Idazten dut | Idatzi nuen | ✅ in `VERBS` (#319); still a §6 causative candidate (`idatzarazi`) |
| ikasi | to learn / study | Ikasten dut | Ikasi nuen | ✅ in `VERBS` (#319) |
| utzi | to leave / let | Uzten dut | Utzi nuen | ✅ in `VERBS` (#319, plain reading; the dative reading is `utzi-dative`, §4b-quater, #334) |
| bilatu | to search / look for | Bilatzen dut | Bilatu nuen | ✅ in `VERBS` (#319); pairs with `aurkitu` (search/find) |
| aurkitu | to find | Aurkitzen dut | Aurkitu nuen | ✅ in `VERBS` (#319) |
| zabaldu | to open / spread | Zabaltzen dut | Zabaldu nuen | 🔲 not yet added |
| itxi | to close | Ixten dut | Itxi nuen | 🔲 not yet added |
| egin | to do / make | Egiten dut | Egin nuen | ✅ in `VERBS` (#319) — the everyday Batua form; also Basque's common transitive "light verb" (`lo egin`, `dantza egin`, `barre egin`...) |
| eskatu | to ask for / request | Eskatzen dut | Eskatu nuen | ✅ in `VERBS` (#320); dative reading is `eskatu-dative`, §4b-quater, #334 |
| galdetu | to ask (a question) | Galdetzen dut | Galdetu nuen | ✅ in `VERBS` (#320); dative reading is `galdetu-dative`, §4b-quater, #334 |
| adierazi | to express / indicate | Adierazten dut | Adierazi nuen | ✅ in `VERBS` (#320); dative reading is `adierazi-dative`, §4b-quater, #334 |
| bukatu | to finish | Bukatzen dut | Bukatu nuen | ✅ in `VERBS` (#320) |
| amaitu | to finish / end | Amaitzen dut | Amaitu nuen | ✅ in `VERBS` (#320) |
| gainditu | to pass / overcome | Gainditzen dut | Gainditu nuen | ✅ in `VERBS` (#320) |
| bereiztu | to distinguish / separate | Bereizten dut | Bereiztu nuen | ✅ in `VERBS` (#320) |
| sentitu | to feel | Sentitzen dut | Sentitu nuen | ✅ in `VERBS` (#320) |
| pentsatu | to think | Pentsatzen dut | Pentsatu nuen | ✅ in `VERBS` (#320) |
| sumatu | to sense / perceive | Sumatzen dut | Sumatu nuen | ✅ in `VERBS` (#320) |
| ulertu | to understand | Ulertzen dut | Ulertu nuen | ✅ in `VERBS` (#320) |
| aztertu | to examine / analyze | Aztertzen dut | Aztertu nuen | ✅ in `VERBS` (#320) |
| ukatu | to deny | Ukatzen dut | Ukatu nuen | ✅ in `VERBS` (#320) |
| batu | to gather / join / add | Batzen dut | Batu nuen | ✅ in `VERBS` (#320) |
| planteatu | to pose / raise (an issue) | Planteatzen dut | Planteatu nuen | ✅ in `VERBS` (#320) |

`maite izan` ("to love", lit. "to hold dear") doesn't fit this table:
"Maite dut"/"Maite nuen" are `maite` + `ukan`, the same fixed-expression-plus-
auxiliary shape as §5's `nahi`/`behar` rather than a participle+auxiliary
periphrastic verb — a §5-style candidate, not a §4b one. ✅ in `VERBS` (#348),
including the NOR-NORK object-axis paradigm (`presentByObject`/`pastByObject`,
riding `ukan`'s own #346/#347 tables with a `'maite '` prefix) — its actual
payoff, since "Maite zaitut" ("I love you") needs a 2nd-person object.

### 4b-ter. Agentive verbs with a covert dative (#307)
A distinct pattern from §4a/§4b's `esan`/`eman`: plain-looking verbs with no
overt direct object the way `esan`'s "egia" or `eman`'s gift is, that still
select the `diot`-family auxiliary because their NORI argument is the
person/thing helped, called, answered, etc. ("Mireni lagundu diot" — no
visible object signals the dative the way "egia esan" does) — the exact
"covert dative" trigger #293's lure mechanism targets. All ride `esan`'s
`recipient: 'hura'` shape (NORI fixed, `person` varies over NORK):

| Verb | Meaning | Present (nor-nori-nork) | Past (nor-nori-nork) | Notes |
|---|---|---|---|---|
| lagundu | to help (someone) | Laguntzen diot | Lagundu nion | ✅ in `VERBS` (#307) |
| ekin | to set about / get down to (something) | Ekiten diot | Ekin nion | ✅ in `VERBS` (#307) |
| erantzun | to answer (someone/something) | Erantzuten diot | Erantzun nion | ✅ in `VERBS` (#307) |
| deitu | to call (someone) | Deitzen diot | Deitu nion | ✅ in `VERBS` (#307) |
| eragin | to cause/induce (something) in (someone) | Eragiten diot | Eragin nion | ✅ in `VERBS` (#307) |
| antzeman | to notice/perceive (something) | Antzematen diot | Antzeman nion | ✅ in `VERBS` (#307) |
| mesede egin | to do a favor (for someone) | Mesede egiten diot | Mesede egin nion | ✅ in `VERBS` (#307) — dative `egin` compound, deferred from #306 |
| kalte egin | to harm (someone) | Kalte egiten diot | Kalte egin nion | ✅ in `VERBS` (#307) — dative `egin` compound, deferred from #306 |
| aurre egin | to face/confront (something) | Aurre egiten diot | Aurre egin nion | ✅ in `VERBS` (#307) — dative `egin` compound, deferred from #306 |
| itxaron-dative | to wait for (someone) | Itxaroten diot | Itxaron nion | ✅ in `VERBS` (#334) — `itxaron`'s dative reading, same covert-dative shape as the rest of this table (no overt object); carrier in this pool's present/past/future |

`itxaron` joins this table's shape exactly (no overt object the way "lagunari laguntzen diot" has none either), so its dative reading (`itxaron-dative`) was added as this pool's 10th carrier rather than a new pool. `saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu`'s dative readings are genuinely ditransitive instead (overt accusative object + dative recipient — the `esan`/`eman` shape, not this table's covert-dative shape), so they got their own pool family (`ditransitive-dative-*`) wired into Units 27-28 alongside `esan`/`eman` — see §4b-quater and `docs/LANGUAGE_DECISIONS.md`'s #334 entry.

### 4b-quater. Optionally-dative ditransitive fodder (#334)
`saldu`, `utzi`, `adierazi`, `eskatu`, `galdetu` each carry two readings: a plain `nor-nork` reading already in `VERBS` (#319, table above) and a ditransitive `nor-nori-nork` reading ("saldu diot" — "I sold it to him") with an overt accusative object plus a dative recipient, the `esan`/`eman` shape (§4a/§4b) rather than §4b-ter's covert-dative shape. Sourced as separate `<verb>-dative` `VERBS` entries (`recipient: 'hura'`, `person` varies over NORK) since no existing convention lets one verb id carry two simultaneous agreement-frame readings:

| Verb | Meaning (dative reading) | Present (nor-nori-nork) | Past (nor-nori-nork) | Notes |
|---|---|---|---|---|
| saldu-dative | to sell (to someone) | Saltzen diot | Saldu nion | ✅ in `VERBS` (#334) |
| utzi-dative | to leave / lend (to someone) | Uzten diot | Utzi nion | ✅ in `VERBS` (#334) |
| adierazi-dative | to express / indicate (to someone) | Adierazten diot | Adierazi nion | ✅ in `VERBS` (#334) |
| eskatu-dative | to ask / request (of someone) | Eskatzen diot | Eskatu nion | ✅ in `VERBS` (#334) |
| galdetu-dative | to ask (someone a question) | Galdetzen diot | Galdetu nion | ✅ in `VERBS` (#334) |

All five are carriers (present/past/future) in the new `ditransitive-dative-*` pool family, wired into Unit 27 (present) and Unit 28 (past/future/review) alongside `esan`/`eman`'s individual lessons — not a new pool in §4b-ter's Unit 30, since mixing an overt-object reading into that pool's specifically "no-overt-object" carriers would muddy the #293 covert-dative confusion it's built to drill.

### 4c. A natural cluster for `dialectVariants`
Three East/West dialectal pairs turned up while surveying §4a/§4b — exactly
the shape `dialectVariants: { bizkaiera: { conjugations: {...} } }` in
`CLAUDE.md` anticipates, and a tidy little batch to tackle together once that
field gets its first real use:

| Batua | Variant | Region | Verb |
|---|---|---|---|
| eraman | eroan / eruan | western (Bizkaian) | "to carry/take" |
| esan | erran | northern (Lapurdian/Zuberoan) | "to say" |
| jarraitu | jarraiki | eastern (Lapurdian/Zuberoan) | "to follow" |

## 5. Modal & aspectual constructions — `nahi` / `behar` / `ari` / `ahal` (+ `ezin`)

These don't sit anywhere on the verb/tense/agreement grid above — they're not
lexical verbs at all, but invariant nouns/particles that combine with a main
verb's non-finite form plus an existing auxiliary to express **want**,
**need/must**, **ongoing action**, and — the newest addition here —
**ability/possibility** (plus its mirror image, **inability**):

- **`nahi`** ("want/wish") + radical/participle + `ukan` — "Etorri nahi dut" =
  "I want to come"; "Liburu bat nahi dut" = "I want a book"
- **`behar`** ("need/necessity") + radical/participle + `ukan` — "Joan behar
  dut" = "I have to / must go"
- **`ari`** ("in the process of") + imperfective participle (`-tzen`/`-ten`)
  + `izan` — "Lan egiten ari naiz" = "I'm working (right now)"; "Zer ari
  zara?" = "What are you doing?"
- **`ahal`** ("ability/possibility") + radical/participle + auxiliary —
  "Etorri ahal naiz" = "I can come"; "Hori esan ahal dut" = "I can say that."
  Its negation **`ezin`** — a fused contraction of `ez` + `ahal` — is, if
  anything, even more common in everyday speech: "Ezin dut etorri" = "I
  can't come"

Four things make these unusually attractive — possibly *more* so than
anything in §4:

1. **They're likely what a beginner most wants to say.** "I want to…", "I
   need to…", "I'm doing…", "I can/can't…" outrank most lexical verbs in
   conversational payoff per form learned.
2. **The auxiliary is chosen by the construction's head, not the lexical
   verb — a genuinely teachable "aha" moment.** `nahi`/`behar` *always* take
   `ukan` ("Joan behar **dut**", not "joan behar naiz", even though `joan`
   alone is `noa`/intransitive); `ari` *always* takes `izan` ("Liburua
   irakurtzen **ari naiz**", not "ari dut", even though `irakurri` alone is
   `dut`/transitive). A learner who's internalised "the auxiliary matches the
   verb" needs precisely this counter-example to get the real rule.
3. **`ahal`/`ezin` are the perfect counter-counter-example — and the *pair*
   with point 2 is the actual lesson.** Unlike `nahi`/`behar` (fix the
   auxiliary to `ukan`) and `ari` (fixes it to `izan`), `ahal`/`ezin` fix
   *nothing*: they're semantically transparent, so the auxiliary just falls
   through to whatever the lexical verb underneath would pick on its own —
   intransitive `etorri` → `naiz` ("etorri ahal naiz"), transitive
   `esan`/`egin` → `dut` ("esan/egin ahal dut"). Teaching `nahi`/`behar`/`ari`
   in isolation risks leaving a learner with the overgeneralised rule "the
   construction's head always decides"; `ahal` is what completes the real
   rule — *some* heads override, others are transparent pass-throughs, and
   you can't tell which from the gloss alone.
4. **They cost nothing in new conjugation data.** `nahi`/`behar` conjugate
   *exactly* like `ukan` (`nahi dut/duk/du/dugu/duzue/dute`) and `ari`
   *exactly* like `izan` (`ari naiz/haiz/da/gara/zarete/dira`) — because
   that's literally what they are: `ukan`/`izan` with an invariant word in
   front. `ahal`/`ezin` cost even less to *model* (no fixed auxiliary to
   pick at all — they piggyback on whichever `izan`/`ukan` table the lexical
   verb already uses) but cost a bit more to *teach*, since "which auxiliary"
   becomes a live question again rather than a fixed fact about the
   construction. No new paradigm to source, verify, or maintain either way.

That last point doubles as the open design question: do they become **new
`sentences`/`pronounSentences` content layered onto the existing `izan`/`ukan`
entries** (zero new lessons, but "nahi" never becomes a thing to discover and
learn in its own right), or **new `VERBS`-shaped entries whose `conjugations`
table is just `izan`'s/`ukan`'s with a fixed prefix word** (gives them
dedicated lesson identity, but raises "how do we avoid hand-duplicating data
that has to stay in sync with `izan`/`ukan`")? Either is far cheaper than
standing up a periphrastic verb from scratch — worth resolving *before*
reaching for §4b, not after.

**Resolved (#306):** dedicated `VERBS`-shaped entries, not `sentences`
layered onto `izan`/`ukan`/`egon` — extended to a broader family of fixed
noun(/particle)+verb expressions beyond just `nahi`/`behar`/`ari`: `hitz`/
`lan`/`lo`/`ahaleginak egin`, `parte`/`kontuan hartu`, `arreta eman`, `ados
egon`, `arriskuan jarri`. Each gets its own gloss and lesson identity
(Unit 44, "The 'egin' Construction") since the meaning is opaque from the
base verb (`egin`/`hartu`/`eman`/`egon`/`jarri`) alone — see
`docs/DECISIONS.md`.

## 6. Valency-changing morphology — the causative (`-arazi`/`-erazi`)

🔲 Not represented anywhere in `VERBS` yet — flagged here, and given a home in
`LEARNING_JOURNEY.md`'s new Phase VI (Units 28-30), so it isn't lost.

The causative suffix **`-arazi`** (an **`-erazi`** alternant also occurs; 🔲
the exact conditioning environment — stem-final segment, dialect, or both —
needs a grammar-reference pass before writing `VERBS` entries) attaches to a
verb's radical and adds a **causer** argument: "X does Y" → "Z makes/lets X
do Y." This *increases the verb's valency by one slot*, which shifts its
agreement pattern (§2) one of two ways — both attested in
`docs/SAMPLE_SENTENCES.md`'s causative bank:

- **`nor` → `nor-nork`**: the original `nor` subject becomes the new `nor`
  (now an object), and the causer fills a new `nork` slot. "Mendizaleak
  itzuli ziren" (the climbers returned, `nor`) → "Ekaitzak mendizaleak
  itzularazi zituen" (the storm made the climbers turn back, `nor-nork`).
- **`nor-nork` → `nor-nori-nork`**: the original `nork` subject becomes the
  new `nori` (the one made to act), the original `nor` object stays `nor`,
  and the causer fills the new `nork` slot. "Umeek babarrunak jan zituzten"
  (the kids ate the beans, `nor-nork`) → "Amonak umeei babarrunak janarazi
  zizkien" (Grandma made the kids eat the beans, `nor-nori-nork`).

🔲 Whether `nor-nori` verbs (`gustatu`-class, §2) can also be causativized,
and what agreement pattern results, isn't covered by the sentences gathered
so far — worth checking once Unit 20's verbs exist.

**Fits the existing data model with zero new shapes.** A causativized verb
behaves exactly like any other `type: 'periphrastic'` entry (`CLAUDE.md`):
`[radical]+(a/e)razi` is the fixed "participle," and the `izan`/`ukan`
auxiliary at the end — chosen by the *new* (post-causativization) agreement
pattern above — is the conjugated, drilled form. So
`conjugations`/`sentences`/`pronounSentences` follow the same `___`-blanked-
auxiliary pattern as `present`/`past` elsewhere in this doc, and Tier 1 of
`EXERCISE_ENGINE.md` applies unchanged.

**Compounds with every tense/mood already in the curriculum** — the
auxiliary just inflects normally, so "make X do Y" (present), "made" (past),
"will make" (future, Units 14-15), "would make" (conditional, Unit 24), and "make
him do it!" (imperative, Unit 25) are all the *same* causativized verb with a
different auxiliary form. `docs/SAMPLE_SENTENCES.md`'s causative bank has
worked examples of all of these — `LEARNING_JOURNEY.md`'s Phase VI (Units
28-30) recombines `-arazi` with those tenses/moods explicitly rather than
introducing them as "new" again.

**Candidate verbs** (drawn from the sample-sentence bank, all already
candidates elsewhere in this doc): `itzuli`→`itzularazi` (§4a, "to return"),
`joan`→`joanarazi` (§4a), `jan`→`janarazi`/`edan`→`edanarazi` (§4b, both Unit
10 candidates), `idatzi`→`idatzarazi`, `jokatu`→`jokarazi`,
`itzali`→`itzalarazi`, `dastatu`→`dastarazi` — picking 2-3 of these for Units
28-29 means Phase VI introduces no vocabulary a learner hasn't already met by
then.

## 7. Suggested coverage checklist

Not a commitment — just a way to see how much runway sits past the current
`izan`/`ukan` × present/past × nor/nor-nork slice, roughly in priority order:

- [x] `nor` agreement, present + past — `izan`
- [x] `nor-nork` agreement, present + past — `ukan`
- [ ] **`nahi`/`behar`/`ari`/`ahal`/`ezin`** — arguably do this *first*:
      highest conversational payoff, zero new conjugation data, reuses
      `izan`/`ukan` verbatim — and `ahal`/`ezin` are the necessary second
      half of the "which auxiliary?" lesson the other three set up (per §5)
- [ ] `nor-nori` agreement, the low-friction way — `jario` (native synthetic,
      no new plumbing, *and* its `erion` past stem is an unusually exact fit
      for the present/past shape already in place; per §4a)
- [ ] future tense, any verb/agreement — reuses existing auxiliary forms
- [ ] a first periphrastic verb (participle + auxiliary) — `gustatu`/`iruditu`
      double as *another*, auxiliary-driven route into `nor-nori` (per §4b)
- [x] `nor-nori-nork` agreement — `esan`/`eman` (per §4a/§4b), extended by
      #307's "agentive verbs with a covert dative" batch (`lagundu`/`ekin`/
      `erantzun`/`deitu`/`eragin`/`antzeman` + the dative `egin` compounds,
      per §4b-ter)
- [ ] `zu` modeled as a person, alongside or instead of `hi`
- [ ] conditional / potential / subjunctive / imperative — stretch goals;
      imperative in particular needs its own lesson shape (no `ni`/`hura`/etc.)
- [ ] **causative (`-arazi`/`-erazi`)** — valency-increasing derivation
      (`nor`→`nor-nork`, `nor-nork`→`nor-nori-nork`, per §6); needs zero new
      data shapes (just another `periphrastic` entry) but does need the
      `-arazi`/`-erazi` conditioning rule sourced before writing `VERBS`
      entries
- [x] **fixed noun(/particle)+verb expressions beyond `nahi`/`behar`/`ari`**
      — `hitz`/`lan`/`lo`/`ahaleginak egin`, `parte`/`kontuan hartu`,
      `arreta eman`, `ados egon`, `arriskuan jarri` (per §5's resolved open
      question, Unit 44)
