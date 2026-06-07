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
| `nor + nori + nork` | all three arguments marked — ditransitive | eman, esan, erakutsi, saldu, bidali, eskaini | 🔲 the fullest expression of the system; good payoff once `nori` exists at all |

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
| eraman | to carry / take | nor-nork | 🔲 — `eroan`/`eruan` is the western/Bizkaian dialectal variant; a `dialectVariants` candidate (see §4c) |
| ekarri | to bring | nor-nork | 🔲 |
| erabili | to use | nor-nork | 🔲 |
| jakin | to know (a fact) | nor-nork | 🔲 — pairs naturally with periphrastic `ezagutu` ("to know/recognise *people*, places") for the classic savoir/connaître-style contrast, see §4b |
| egin | to do / make | nor-nork | 🔲 |
| iraun | to last / endure | nor-nork | 🔲 fully paradigmed (corrected — earlier guess of "defective `nor`" was wrong): "Nik diraut, Hik dirauk/n, Hark dirau, Guk diraugu, Zuk dirauzu, Zuek dirauzue, Haiek diraute" follows the *exact* `root + standard NORK suffix` shape `ukan`/`ekarri`/`eraman`/`eduki` all use (`-t`/`-k`-`n`/∅/`-gu`/`-zu`/`-zue`/`-te`) — about as regular and low-friction a `nor-nork` pick as exists. Also a genuine synthetic/periphrastic overlap in real usage: "Hiru ordu iraun du filmeak" pairs the *participle* `iraun` with `ukan` as auxiliary, right alongside the synthetic `dirau` forms |
| jario | to flow / ooze / stream ("malkoak dario" = tears flow from him) | nor-nori | 🔲 defective (effectively fixed `nor`, varies by `nori` person) — **and** it already has its own present/past synthetic pair: `dario`/`darie` (present) ↔ `erion`/`erien` (past, Bizkaian) — `erion` isn't a separate verb, it's `jario`'s own past stem. That's a remarkably exact match for the app's present+past shape, on top of being the lowest-friction `nor-nori` route (native synthetic, no auxiliary, fits `object`-fixed `conjugations`) |
| esan | to say | nor-nork / nor-nori-nork | 🔲 the everyday, central `nor-nori-nork` verb — its ditransitive forms (`dio`/`diot`/`diozu`...) run on the same defective `*-io-` root that `ukan` borrows for *its* ditransitive auxiliary use; `erran` is the northern (Lapurdian/Zuberoan) dialectal variant, again a `dialectVariants` candidate. A much better first `nor-nori-nork` pick than `eman` or `iritzi` |
| jardun | to be engaged in / at it ("zertan dihardu?" = "what's he up to?") | nor-nork | 🔲 a curiosity worth knowing about rather than prioritising: it expresses the *same* "ongoing action" meaning as `ari`/`ibili` (§5), but — unlike them — conjugates in the transitive `du`-pattern (`dihardut` "I'm at it" ~ `dut`) despite being semantically intransitive. One more data point for "the form doesn't follow the lexical verb's transitivity," alongside `nahi`/`behar`/`ari` |
| etzan | to lie / be situated, recline ("Herria itsasoaren ondoan datza" = "The town lies by the sea") | nor | 🔲 confirmed synthetic — `datza` (3sg) — though it leans literary/descriptive (geography, figurative "resting" senses) rather than the everyday "lie down" a learner would reach for first, and — like `jario` — likely defective toward 3rd person; a real but lower-priority `nor` option, more `dago`'s literary cousin than its replacement |

`atxeki` ("to adhere/cling [to]") and `iharduki` ("to converse, hold forth" —
a relative of `jardun`) are also genuinely synthetic, but rare/dialectal
enough that I couldn't pin down their argument structure or how alive their
paradigms are in modern Batua from the sources at hand — worth a revisit with
a proper grammar reference if either seems promising, rather than guessing at
their forms here.

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
  its own right)
- **`-i` verbs**: jan (to eat), edan (to drink), **ikusi** (to see)
- **`-n` verbs**: **entzun** (to hear/listen)
- **`etorri`** is a natural bridge case: synthetic in present/past, but
  periphrastic in the other tenses

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

## 5. Modal & aspectual constructions — `nahi` / `behar` / `ari`

These three don't sit anywhere on the verb/tense/agreement grid above — they're
not lexical verbs at all, but invariant nouns/particles that combine with a
main verb's non-finite form plus an existing auxiliary to express **want**,
**need/must**, and **ongoing action**:

- **`nahi`** ("want/wish") + radical/participle + `ukan` — "Etorri nahi dut" =
  "I want to come"; "Liburu bat nahi dut" = "I want a book"
- **`behar`** ("need/necessity") + radical/participle + `ukan` — "Joan behar
  dut" = "I have to / must go"
- **`ari`** ("in the process of") + imperfective participle (`-tzen`/`-ten`)
  + `izan` — "Lan egiten ari naiz" = "I'm working (right now)"; "Zer ari
  zara?" = "What are you doing?"

Three things make these unusually attractive — possibly *more* so than
anything in §4:

1. **They're likely what a beginner most wants to say.** "I want to…", "I
   need to…", "I'm doing…" outrank most lexical verbs in conversational
   payoff per form learned.
2. **The auxiliary is chosen by the construction's head, not the lexical
   verb — a genuinely teachable "aha" moment.** `nahi`/`behar` *always* take
   `ukan` ("Joan behar **dut**", not "joan behar naiz", even though `joan`
   alone is `noa`/intransitive); `ari` *always* takes `izan` ("Liburua
   irakurtzen **ari naiz**", not "ari dut", even though `irakurri` alone is
   `dut`/transitive). A learner who's internalised "the auxiliary matches the
   verb" needs precisely this counter-example to get the real rule.
3. **They cost nothing in new conjugation data.** `nahi`/`behar` conjugate
   *exactly* like `ukan` (`nahi dut/duk/du/dugu/duzue/dute`) and `ari`
   *exactly* like `izan` (`ari naiz/haiz/da/gara/zarete/dira`) — because
   that's literally what they are: `ukan`/`izan` with an invariant word in
   front. No new paradigm to source, verify, or maintain.

That last point doubles as the open design question: do they become **new
`sentences`/`pronounSentences` content layered onto the existing `izan`/`ukan`
entries** (zero new lessons, but "nahi" never becomes a thing to discover and
learn in its own right), or **new `VERBS`-shaped entries whose `conjugations`
table is just `izan`'s/`ukan`'s with a fixed prefix word** (gives them
dedicated lesson identity, but raises "how do we avoid hand-duplicating data
that has to stay in sync with `izan`/`ukan`")? Either is far cheaper than
standing up a periphrastic verb from scratch — worth resolving *before*
reaching for §4b, not after.

## 6. Suggested coverage checklist

Not a commitment — just a way to see how much runway sits past the current
`izan`/`ukan` × present/past × nor/nor-nork slice, roughly in priority order:

- [x] `nor` agreement, present + past — `izan`
- [x] `nor-nork` agreement, present + past — `ukan`
- [ ] **`nahi`/`behar`/`ari`** — arguably do this *first*: highest
      conversational payoff, zero new conjugation data, reuses `izan`/`ukan`
      verbatim (per §5)
- [ ] `nor-nori` agreement, the low-friction way — `jario` (native synthetic,
      no new plumbing, *and* its `erion` past stem is an unusually exact fit
      for the present/past shape already in place; per §4a)
- [ ] future tense, any verb/agreement — reuses existing auxiliary forms
- [ ] a first periphrastic verb (participle + auxiliary) — `gustatu`/`iruditu`
      double as *another*, auxiliary-driven route into `nor-nori` (per §4b)
- [ ] `nor-nori-nork` agreement — `esan` is the standout pick: native
      synthetic, everyday, and its `dio`-paradigm *is* the same root `ukan`
      borrows for ditransitive auxiliary use (per §4a; `eman` remains the
      periphrastic/auxiliary-driven alternative, per §4b)
- [ ] `zu` modeled as a person, alongside or instead of `hi`
- [ ] conditional / potential / subjunctive / imperative — stretch goals;
      imperative in particular needs its own lesson shape (no `ni`/`hura`/etc.)
