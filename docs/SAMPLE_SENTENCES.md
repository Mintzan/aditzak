# Sample sentences — a categorised bank

A staging ground for `VERBS`'s `sentences` (and, later, `pronounSentences`)
tables in `src/App.jsx`. Today each `verb.sentences[tense][person]` is a
single string, reused verbatim every time that person comes up — including
across the repeated `rounds` a lesson now does to reach
`TARGET_EXERCISE_COUNT` (see `docs/DECISIONS.md`, 2026-06-11). This doc
collects several sentence variants per person, grouped into everyday-life
**categories**, so that "rich and colourful" variety can be added by turning
each `sentences[tense][person]` cell into an array and picking one variant
per question — without inventing new vocabulary on the fly or risking
grammatically-broken combinations (Basque's case marking makes random
template mixing risky, see `docs/CONJUGATIONS.md`).

Each sentence keeps the existing `___` blank marking where the conjugated
verb form goes (`verb.conjugations[tense][person]` fills it in), exactly like
today's single-variant `sentences` tables.

## Categories

| Category | Theme |
|---|---|
| **Eskola** (School) | student/classroom life |
| **Familia eta etxea** (Family & home) | relatives, household |
| **Bidaiak** (Travel) | trips, places, transport |
| **Eguneroko bizitza** (Daily life & work) | errands, jobs, routine |

Using the same four categories across verbs keeps the variety predictable to
author and review, while still spanning enough real-world contexts to feel
"colourful" rather than repetitive.

---

## `izan` — "to be" (present)

| Person | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|
| ni | Ni ikaslea ___. | Ni aita ___. | Ni turista ___. | Ni langilea ___. |
| zu | Zu irakaslea ___. | Zu ama ___. | Zu gidaria ___. | Zu auzokidea ___. |
| hura | Hura zuzendaria ___. | Hura aitona ___. | Hura bidaiaria ___. | Hura saltzailea ___. |

(The current single-variant table uses "Ni irakaslea ___." / "Zu ikaslea
___." / "Hura medikua ___." — close cousins of the **Eskola** column above;
those can be folded in as a fifth variant or swapped for one of these.)

---

## `egon` — "to be (located / in a state)" (present)

| Person | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|
| ni | Ni ikasgelan ___. | Ni etxean ___. | Ni Bilbon ___. | Ni lanean ___. |
| zu | Zu liburutegian ___. | Zu sukaldean ___. | Zu Donostian ___. | Zu dendan ___. |
| hura | Hura patioan ___. | Hura logelan ___. | Hura Gasteizen ___. | Hura kalean ___. |

---

## `ukan` — "to have" (object fixed to `hura`, singular — every object below
takes the indefinite/singular `bat` or a mass noun, to match the `du`/`dut`/…
forms)

### Present

| Person | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|
| ni (Nik) | Nik liburu bat ___. | Nik arreba bat ___. | Nik txartel bat ___. | Nik bilera bat ___. |
| hi (Hik) | Hik koaderno bat ___. | Hik anaia bat ___. | Hik mapa bat ___. | Hik auto bat ___. |
| hura (Hark/Berak) | Hark arkatz bat ___. | Berak seme bat ___. | Hark pasaporte bat ___. | Berak etxe bat ___. |
| gu (Guk) | Guk azterketa bat ___. | Guk etxe handi bat ___. | Guk maleta bat ___. | Guk denbora ___. |
| zuek | Zuek azterketa bat ___. | Zuek lorategi bat ___. | Zuek hotel bat ___. | Zuek arazo bat ___. |
| haiek | Haiek liburutegi bat ___. | Haiek anaia bat ___. | Haiek hegazkin bat ___. | Haiek aukera bat ___. |

### Past

| Person | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|
| ni (Nik) | Nik azterketa bat ___. | Nik arazo bat ___. | Nik txartel bat ___. | Nik diru asko ___. |
| hi (Hik) | Hik liburu bat ___. | Hik etxe bat ___. | Hik mapa bat ___. | Hik lan bat ___. |
| hura (Hark/Berak) | Hark ideia on bat ___. | Berak seme bat ___. | Hark pasaporte bat ___. | Berak auto bat ___. |
| gu (Guk) | Guk azterketa bat ___. | Guk etxe handi bat ___. | Guk maleta bat ___. | Guk arrazoi ___. |
| zuek | Zuek galdera bat ___. | Zuek anaia bat ___. | Zuek hotel bat ___. | Zuek lan asko ___. |
| haiek | Haiek azterketa bat ___. | Haiek anaia bat ___. | Haiek hegazkin bat ___. | Haiek denbora gutxi ___. |

(Cells matching the current single-variant `sentences` tables verbatim —
e.g. "Nik liburu bat ___.", "Hark ideia on bat ___.", "Guk denbora ___.",
"Zuek arazo bat ___.", "Haiek aukera bat ___.", "Nik diru asko ___.", "Hik
liburu bat ___.", "Guk arrazoi ___.", "Zuek galdera bat ___.", "Haiek
denbora gutxi ___." — can simply become one variant in their cell's array.)

---

## Cultural sentence bank — by argument structure (future units)

The sentences below were drafted to give the eventual `joan`/`etorri`/`ibili`/
`eman`/`esan`/`prestatu`/etc. lessons (per `docs/EXERCISE_ENGINE.md`'s Tier
1/3 verbs and `docs/LEARNING_JOURNEY.md`'s later units) a strong dose of real
Basque culture, geography, food, and tradition — grouped by **argument
structure** (NOR / NOR-NORK / NOR-NORI / NOR-NORI-NORK) and **tense**, rather
than by the School/Family/Travel/Daily-life themes above.

These are full sentences, not yet in the `___`-blanked `sentences[tense][person]`
shape — see "Mapping to `VERBS`'s shape" below for how to adapt one once its
verb is implemented.

### 1. NOR (Intransitive)
*Used for actions with just a subject, using the auxiliary **izan** (to be) or
synthetic forms.*

#### Present Tense (Oraina)
- **Zuberoako dantzariak gure herrira etortzen dira.**
  - *Translation:* The dancers from Soule come to our town.
  - *Cultural touch:* Highlights *Zuberoa* (Soule), famous for its complex,
    athletic traditional dances.
- **Gaur goizean mendizaleak azkar igotzen ari dira Gorbeiako gurutzeraino.**
  - *Translation:* This morning, the mountaineers are quickly climbing up to
    the Gorbeia cross.
  - *Cultural touch:* Mountaineering (*mendizaletasuna*) is almost a religion
    in the Basque Country; Mount Gorbeia is an iconic peak.

#### Past Tense (Lehena)
- **Iaz, nire lagunak Donostiako Danborradan ibili ziren gau osoan.**
  - *Translation:* Last year, my friends wandered through San Sebastian's
    Drum Festival all night long.
  - *Cultural touch:* Mentions the *Danborrada*, a massive, loud festival held
    every January 20th.

#### Synthetic Present (Trinko Oraina — no auxiliary)
- **Gaur gurasoak Bilboko Guggenheim museora doaz.**
  - *Translation:* Today, the parents are going to the Guggenheim Museum in
    Bilbao.
  - *Verb focus:* Uses **doaz** (they go), the synthetic form of *joan*.

### 2. NOR-NORK (Transitive)
*Used when a subject (**Nork**, marked with `-k`) does something to a direct
object (**Nor**). Uses the auxiliary **edun** (to have).*

#### Present Tense (Oraina)
- **Sustraiak eta Uxuek bertso politak abesten dituzte plazan.**
  - *Translation:* Sustrai and Uxue sing beautiful improvised verses in the
    square.
  - *Cultural touch:* *Bertsolaritza* is the Basque art of singing
    improvised, rhyming verses. Note the plural-object auxiliary **dituzte**
    (they have them).
- **Amonak marmitako epela prestatu du gaurko bazkarirako.**
  - *Translation:* Grandmother has prepared warm tuna stew for today's lunch.
  - *Cultural touch:* *Marmitako* is a classic Basque fishermen's potato and
    tuna stew.

#### Past Tense (Lehena)
- **Atzo arratsaldean, pilotariek partida zirraragarria jokatu zuten
  pilotalekuan.**
  - *Translation:* Yesterday afternoon, the pelota players played an exciting
    match in the fronton court.
  - *Cultural touch:* *Pilota* (Basque pelota) played in a *pilotaleku*
    (fronton) is the traditional national sport.

#### Future Tense (Geroaldia)
- **Zuk udan Euskal Herriko Kostaldea bisitatuko duzu.**
  - *Translation:* You will visit the Basque Coast in the summer.
  - *Grammar tip:* Notice the future suffix **-ko** on the main verb
    *bisitatuko*.

### 3. NOR-NORI (Intransitive with indirect object)
*Used when something happens **to** someone/something. Tracks the subject
(**Nor**) and the recipient (**Nori**). Uses the auxiliary **izan**.*

#### Present Tense (Oraina)
- **Niri asko gustatzen zaizkit Tolosako babarrun gorriak.**
  - *Translation:* I like Tolosa's red beans a lot. (Literally: Tolosa's red
    beans are pleasing to me.)
  - *Cultural touch:* Tolosa is famous throughout Spain for its high-quality
    black/red beans. Note that **zaizkit** is plural because *babarrunak* is
    plural.
- **Umeei beldurra zaie basoan dabilen Basajaun mitologikoa.**
  - *Translation:* The children are afraid of the mythological Basajaun
    walking in the woods.
  - *Cultural touch:* *Basajaun* (The Lord of the Woods) is a popular hairy
    giant from Basque mythology.

#### Past Tense (Lehena)
- **Zuri ahaztu zitzaizkizun etxeko giltzak San Fermin jaietan.**
  - *Translation:* You forgot the house keys during the San Fermin festivals.
  - *Cultural touch:* *San Fermin* is the world-famous Running of the Bulls
    festival in Pamplona (*Iruñea*).

### 4. NOR-NORI-NORK (Three-argument transitive)
*Tracks the subject (**Nork**), direct object (**Nor**), and indirect object
(**Nori**) — typically the **die**-type auxiliary.*

#### Present Tense (Oraina)
- **Nik zuri gaztelerazko liburua euskaratu dizut.**
  - *Translation:* I have translated the Spanish book into Basque for you.
  - *Auxiliary:* **dizut** = it (`d-`) + to you (`-izu-`) + I (`-t`).
- **Goizaneik lagunei opari politak ekarri dizkie Baionako dendatik.**
  - *Translation:* Goizane has brought nice gifts to her friends from the shop
    in Bayonne.
  - *Cultural touch:* Features *Baiona* (Bayonne), the cultural capital of the
    Northern Basque Country in France.

#### Past Tense (Lehena)
- **Gurasoek niri txikitan Olentzeroren ipuinak kontatzen zizkidaten.**
  - *Translation:* When I was little, my parents used to tell me stories about
    Olentzero.
  - *Cultural touch:* *Olentzero* is the mythical, coal-mining Basque
    gift-giver who comes down from the mountains on Christmas Eve.
- **Arrantzaleek jatetxeari goizeko legatz freskoa saldu zioten.**
  - *Translation:* The fishermen sold the fresh morning hake to the
    restaurant.
  - *Cultural touch:* *Arrantzaleak* (fishermen) and *legatza* (hake)
    represent the deep maritime roots of Basque gastronomy.

### Mapping to `VERBS`'s shape

The current data model doesn't store sentences with a separate
structure/aspect/auxiliary breakdown — `sentences[tense][person]` is just a
`___`-blanked string, with the translation/cultural note kept as a nearby
comment rather than stored data (see `izan`/`egon`/`ukan` above for the
pattern). When a sentence above gets adopted:

1. Identify which `person` it belongs to (the `Nork`/`Nor` argument that
   matches `conjugations[tense][person]`'s key).
2. Replace the drilled finite form with `___`. For periphrastic verbs
   (`type: 'periphrastic'`, participle + auxiliary), only the auxiliary is
   blanked — the participle stays fixed.
3. Carry the translation/cultural note over as a comment above the entry.

e.g. "Amonak marmitako epela prestatu du gaurko bazkarirako." → once
`prestatu` exists in `VERBS` as `periphrastic`, its NOR-NORK present `hura`
entry becomes `sentences.present.hura = 'Amonak marmitako epela prestatu ___
gaurko bazkarirako.'` (blanking the auxiliary `du`, per `CLAUDE.md`'s
`periphrastic` type).

---

## Cultural sentence bank — advanced tenses, moods & aspects (future units)

A second pass over the same four argument structures, this time covering the
**aspect/mood** territory beyond plain present/past — future, conditional,
potential, imperative, and past continuous — per `docs/EXERCISE_ENGINE.md`'s
Tier 1 (Geroa, Units 9–10), Tier 3 (imperative, Unit 20), and Tier 1
(Ahalera/Baldintza/Ondorioa, Units 18–19) entries. Same culture/geography/
folklore approach as above; same "full sentence, adapt later" status.

### 1. NOR (Intransitive) — advanced tenses

#### Future Tense (Geroaldia)
- **Datorren astean, baserritarrak Gernikako azokara joango dira.**
  - *Translation:* Next week, the farmers will go to the Gernika market.
  - *Cultural touch:* *Baserritarra* (the traditional Basque farmer) and the
    historic *Gernika* Monday market are foundational to Basque rural culture.

#### Conditional Mood (Baldintza)
- **Dirurik banu, igandean kirolariak ikustera joango nintzateke.**
  - *Translation:* If I had money, I would go to see the rural sports
    athletes on Sunday.
  - *Verb focus:* Uses the past-continuous hypothetical **nintzateke** (I
    would be).
  - *Cultural touch:* *Herri Kirolak* (Basque rural sports) include
    wood-chopping, stone-lifting, and anvil-tossing.

#### Present Potential (Ahalera Oraina)
- **Zuek gaur gauean Donostiako Parte Zaharrean afal zaitezkete.**
  - *Translation:* You all can have dinner in San Sebastian's Old Town
    tonight.
  - *Verb focus:* **zaitezkete** = you all can be (expressing
    capability/permission).
  - *Cultural touch:* The *Parte Zaharra* is world-famous for having the
    highest concentration of pintxo bars.

### 2. NOR-NORK (Transitive) — advanced tenses

#### Present Continuous / Progressive (Aridun Oraina)
- **Une honetan, okinak euskal pastela labean sartzen ari dira.**
  - *Translation:* At this moment, the bakers are putting the Basque cake
    into the oven.
  - *Grammar tip:* Created using the locative nominalization **ari dira**
    (they are engaged in).
  - *Cultural touch:* *Euskal pastela* (Gâteau Basque) is a traditional
    dessert filled with black cherry jam or pastry cream.

#### Past Conditional (Lehengo Baldintza)
- **Guk denbora gehiago izan bagenu, sagardotegiko txuleta jango genuen.**
  - *Translation:* If we had had more time, we would have eaten the steak at
    the cider house.
  - *Verb focus:* **genuen** is used here as the apodosis (the "would have"
    part) of a past conditional.
  - *Cultural touch:* *Sagardotegia* (cider house season) involves drinking
    cider straight from the barrel (*txotx*) and eating massive
    charcoal-grilled steaks (*txuleta*).

#### Imperative Mood (Agintera)
- **Ekar ezazu gazta eta Idiazabalgo ardoa mahaira, mesedez!**
  - *Translation:* Bring the cheese and the Idiazabal wine to the table,
    please!
  - *Verb focus:* **Ekar ezazu** is the direct command form (radical verb +
    subjunctive auxiliary).
  - *Cultural touch:* *Idiazabal* is a famous smoked sheep's milk cheese from
    the Basque highlands.

### 3. NOR-NORI (Intransitive + indirect object) — advanced tenses

#### Future Tense (Geroaldia)
- **Uda honetan, bidaiariei asko gustatuko zaie Mundakako ezker olatua.**
  - *Translation:* This summer, the travelers will really like Mundaka's
    left-hand wave.
  - *Verb focus:* **gustatuko zaie** (it will be pleasing to them).
  - *Cultural touch:* Mundaka is a world-renowned surf spot famous for its
    perfect, hollow rivermouth wave.

#### Past Potential (Ahalera Lehena)
- **Guri txikitan beldurra dakiokeen Mari jainkosa ager zekiokeen basoan.**
  - *Translation:* To us as kids, the goddess Mari, who can be scary, could
    have appeared in the forest.
  - *Verb focus:* **zekiokeen** (it could have happened to us).
  - *Cultural touch:* *Mari* is the supreme goddess of Basque mythology,
    representing Mother Earth and living in mountain caves (like Anboto).

### 4. NOR-NORI-NORK (Three-argument transitive) — advanced tenses

#### Future Tense (Geroaldia)
- **Etxekoek niri txakolin botila bat irekiko didate afaltzeko.**
  - *Translation:* The hosts will open a bottle of Txakoli wine for me for
    dinner.
  - *Verb focus:* **didate** turns into a future helper when paired with
    *irekiko*.
  - *Cultural touch:* *Txakoli* is a slightly sparkling, very dry white wine
    local to the Basque coast.

#### Conditional Mood (Baldintza)
- **Nik zuei istorio hau kontatuko nizueke, baina sekretua da.**
  - *Translation:* I would tell you all this story, but it's a secret.
  - *Verb focus:* **nizueke** = I would [do it] to you all (it [`d-`] + to you
    all [`-izue-`] + I [`-ke`]).

#### Past Continuous (Lehengo Ari)
- **Zizurkildarrek elizari kanpai berriak jartzen zizkioten olgetan ari
  zirela.**
  - *Translation:* The people of Zizurkil were putting new bells on the
    church while they were joking around.
  - *Verb focus:* **zizkioten** (they [Nork] used to do them [plural Nor] to
    it [Nori] in the past).
  - *Cultural touch:* *Zizurkil* is a traditional town in Gipuzkoa known for
    its rural charm.

### Tagging by aspect/mood/tense

For filtering or future authoring, each sentence above can be tagged along
the same axes `VERBS` already models (`agreement` for argument structure, plus
the tense/mood key it would live under in `conjugations`):

| Sentence fragment | Argument structure (`agreement`) | Aspect / mood | `conjugations` key |
|---|---|---|---|
| *...afal zaitezkete.* | nor | Potential (Ahalera) | `potential` |
| *...jango genuen.* | nor-nork | Conditional (Baldintza) | `conditional` |
| *...kontatuko nizueke.* | nor-nori-nork | Conditional (Baldintza) | `conditional` |
| *Ekar ezazu...* | nor-nork | Imperative (Agintera) | `imperative` |

These map onto new tense *keys* (Tier 1 in `docs/EXERCISE_ENGINE.md`), not new
shapes — once a verb's `conjugations.potential`/`conditional`/`imperative`
table exists, its `sentences`/`pronounSentences` entries follow exactly the
same `___`-blanked pattern as `present`/`past` above.

---

## Cultural sentence bank — extended set (future units)

More sentences across the same four argument structures and advanced
tenses/moods, doubling the pool to draw from for each combination — same
"full sentence, adapt later" status as the two banks above.

### 1. NOR (Intransitive)

#### Future Tense (Geroaldia)
- **Bihar goizean korrikalariak Behobia-Donostia lasterketan lehiatuko dira.**
  - *Translation:* Tomorrow morning, the runners will compete in the
    Behobia-San Sebastian race.
- **Haurrak Korrika festan euskararen alde pozez jantziko dira.**
  - *Translation:* The children will dress up with joy for Basque language
    support during the Korrika festival.

#### Present Potential (Ahalera Oraina)
- **Gazteak gaur gauean Baionako festetan berandu arte egon daitezke.**
  - *Translation:* The youths can stay out until late tonight at the Bayonne
    festivals.
- **Turistak San Juan de Gaztelugatxeko eskaileretatik erraz igo daitezke.**
  - *Translation:* Tourists can easily climb up the stairs of San Juan de
    Gaztelugatxe.

#### Conditional Mood (Baldintza)
- **Atera argituko balitz, gu Urkiolako parkera joango ginateke.**
  - *Translation:* If the weather cleared up, we would go to Urkiola Park.
- **Zuek pilotari profesionalak bazinete, txapelketan arituko zinatekete.**
  - *Translation:* If you all were professional pelota players, you would
    compete in the tournament.

### 2. NOR-NORK (Transitive)

#### Present Continuous (Aridun Oraina)
- **Sukaldariak sasoiko perretxikoak eta zizak garbitzen ari dira.**
  - *Translation:* The chefs are cleaning seasonal wild mushrooms.
- **Neska-mutilak herriko plazan dantzari dantza ikasten ari dira.**
  - *Translation:* The boys and girls are learning the traditional dantzari
    dance in the town square.

#### Past Conditional (Lehengo Baldintza)
- **Guk sarrerak lortu bagenitu, atzo Bilboko Aste Nagusian kontzertua ikusiko
  genuen.**
  - *Translation:* If we had gotten tickets, we would have seen the concert
    at Bilbao's Aste Nagusia yesterday.
- **Zuk ardi latxen esnea erosi bazenu, gazta gozoa egingo zenuen.**
  - *Translation:* If you had bought Latxa sheep's milk, you would have made
    delicious cheese.

#### Imperative Mood (Agintera)
- **Eman iezaiozu buelta tortillari sutatik kendu baino lehen!**
  - *Translation:* Flip the tortilla before taking it off the fire!
- **Idatzi ezazue euskal abesti honen letra zuon koadernoetan!**
  - *Translation:* Write the lyrics of this Basque song in your notebooks!

### 3. NOR-NORI (Intransitive + indirect object)

#### Future Tense (Geroaldia)
- **Atzerriko ikasleei asko irudituko zaie euskal kultura zaharra.**
  - *Translation:* The ancient Basque culture will seem like a lot to the
    foreign students.
- **Zuri bihar goizean itsasontzia Zumaia Flysch-eko uretan hurbilduko
  zaizu.**
  - *Translation:* Tomorrow morning, the boat will approach you in the waters
    of the Zumaia Flysch.

#### Present Potential (Ahalera Oraina)
- **Niri pintxo merkeak eta gozoak Gasteizko tabernetan okurru dakizkit.**
  - *Translation:* Cheap and tasty pintxos can occur to me (be found by me)
    in the bars of Vitoria-Gasteiz.
- **Gurasoei umeak gauez basoan galtzen bazaizkie Olentzero ager dakioke.**
  - *Translation:* If the children get lost in the forest at night, Olentzero
    can appear to the parents.

#### Conditional Mood (Baldintza)
- **Zuei katu beltzak bidera aterako balitzaizkizue, zorte txarra irudituko
  litzazaizkizue.**
  - *Translation:* If black cats came out onto your path, it would seem like
    bad luck to you all.

### 4. NOR-NORI-NORK (Three-argument transitive)

#### Present Tense (Oraina)
- **Etxekoandreak bisitariei sagardo gozoa katiluan zerbitzatzen die.**
  - *Translation:* The hostess serves delicious cider in a bowl to the
    visitors.
- **Lagunek niri Getariako txakolina oparitzen didate urtebetetzean.**
  - *Translation:* My friends gift me Txakoli from Getaria on my birthday.

#### Future Tense (Geroaldia)
- **Nik zuri nire aitonaren baserriko sekretuak kontatuko dizkizut.**
  - *Translation:* I will tell you the secrets of my grandfather's
    farmhouse.
- **Arrantzaleek herritarrei hegaluze freskoa ekarriko diote portura.**
  - *Translation:* The fishermen will bring fresh albacore tuna to the port
    for the townspeople.

#### Conditional Mood (Baldintza)
- **Guk zuei egia esango bagenizue, zuek guri laguntza emango zenigukete.**
  - *Translation:* If we told you the truth, you would give us help.
- **Sustraiek epaimaimahaiari bertso hobeak kantatu balizkio, txapela
  jantziko luke.**
  - *Translation:* If Sustrai had sung better verses to the jury, he would
    wear the championship beret.

---

## Next steps (not yet done)

1. Review/edit these for naturalness and any missing vocabulary gaps.
2. Turn each `sentences[tense][person]` cell into an array of these variants
   in `src/App.jsx`'s `VERBS`, and update `generateQuestions`/
   `buildSpotErrorQuestion` (`src/lessonLogic.js`) to pick one variant at
   random per question.
3. `pronounSentences` (verb filled in, pronoun blanked) can reuse the same
   sentences with the blank repositioned — a follow-up pass once the
   `sentences` variants above are settled.
4. As new verbs/tenses are added (per `docs/EXERCISE_ENGINE.md`'s Tier 1
   list), extend this doc with the same four categories before writing their
   `VERBS` entries.
5. The cultural sentence banks above pair argument structures (and, for the
   advanced bank, aspect/mood) with specific verbs/tenses for future units —
   pull individual sentences from them, blank the drilled form, and fold them
   into that verb's `sentences`/`pronounSentences` tables (plus a theme from
   the categories above) as each unit is implemented.
