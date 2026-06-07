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
| zu | — | 🔲 **not modeled** — the everyday neutral "you" in spoken/written Batua (etymologically plural, used as the default polite/standard singular); arguably more essential for a learner than `hi`, which is reserved for close/informal relationships |
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
The ~12 verbs Batua still conjugates directly, ranked roughly by how often
they come up in everyday speech:

| Verb | Meaning | Agreement | Status |
|---|---|---|---|
| izan | to be | nor | ✅ |
| ukan | to have (auxiliary) | nor-nork | ✅ |
| egon | to be (located / in a state) | nor | 🔲 flagged in `DECISIONS.md` as needed before `izan`'s location/state example sentences can be written correctly |
| joan | to go | nor | 🔲 |
| etorri | to come | nor | 🔲 |
| ibili | to walk around / be doing | nor | 🔲 |
| eduki | to hold / keep / have | nor-nork | 🔲 |
| eraman | to carry / take | nor-nork | 🔲 |
| ekarri | to bring | nor-nork | 🔲 |
| erabili | to use | nor-nork | 🔲 |
| jakin | to know (a fact) | nor-nork (nor-nori-nork in literary register) | 🔲 |
| esan | to say | nor-nork / nor-nori-nork | 🔲 good ditransitive candidate |
| egin | to do / make | nor-nork | 🔲 |
| iruditu | to seem | nor-nori | 🔲 clean, canonical nor-nori teaching example ("...iruditzen zait") |
| gustatu | to like / please | nor-nori | 🔲 the other canonical nor-nori example |

### 4b. Representative periphrastic verbs (aditz perifrastikoak)
None yet — `TYPE_META.periphrastic` exists but no verb actually conjugates as
participle + auxiliary. Good first picks, chosen to cover distinct participle
endings and both auxiliaries:
- **`-tu` verbs** (the largest class): erosi (to buy), ikusi (to see)
- **`-i` verbs**: jan (to eat), edan (to drink)
- **`-n` verbs**: eman (to give — doubles as a nor-nori-nork ditransitive),
  egin (to do/make)
- **`etorri`** is a natural bridge case: synthetic in present/past, but
  periphrastic in the other tenses

## 5. Suggested coverage checklist

Not a commitment — just a way to see how much runway sits past the current
`izan`/`ukan` × present/past × nor/nor-nork slice, roughly in priority order:

- [x] `nor` agreement, present + past — `izan`
- [x] `nor-nork` agreement, present + past — `ukan`
- [ ] `nor-nori` agreement, any tense — e.g. `gustatu` or `iruditu`
- [ ] future tense, any verb/agreement — reuses existing auxiliary forms
- [ ] `nor-nori-nork` agreement, any tense — e.g. `eman` or `esan`
- [ ] a periphrastic verb (participle + auxiliary), any tense
- [ ] `zu` modeled as a person, alongside or instead of `hi`
- [ ] conditional / potential / subjunctive / imperative — stretch goals;
      imperative in particular needs its own lesson shape (no `ni`/`hura`/etc.)
