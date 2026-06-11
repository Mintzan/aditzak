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

The **Aplikazioa (oraingoa)** column in each table below is the current
`verb.sentences[tense][person]` value from `src/App.jsx` — included for
direct comparison with the new category variants, and itself a candidate to
fold into whichever category column it best fits (or to keep as a bonus
extra variant).

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

| Person | Aplikazioa (oraingoa) | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|---|
| ni | Ni irakaslea ___. | Ni ikaslea ___. | Ni aita ___. | Ni turista ___. | Ni langilea ___. |
| zu | Zu ikaslea ___. | Zu irakaslea ___. | Zu ama ___. | Zu gidaria ___. | Zu auzokidea ___. |
| hura | Hura medikua ___. | Hura zuzendaria ___. | Hura aitona ___. | Hura bidaiaria ___. | Hura saltzailea ___. |

---

## `egon` — "to be (located / in a state)" (present)

| Person | Aplikazioa (oraingoa) | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|---|
| ni | Ni etxean ___. | Ni ikasgelan ___. | Ni etxean ___. | Ni Bilbon ___. | Ni lanean ___. |
| zu | Zu kalean ___. | Zu liburutegian ___. | Zu sukaldean ___. | Zu Donostian ___. | Zu dendan ___. |
| hura | Hura eskolan ___. | Hura patioan ___. | Hura logelan ___. | Hura Gasteizen ___. | Hura kalean ___. |

---

## `ukan` — "to have" (object fixed to `hura`, singular — every object below
takes the indefinite/singular `bat` or a mass noun, to match the `du`/`dut`/…
forms)

### Present

| Person | Aplikazioa (oraingoa) | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|---|
| ni (Nik) | Nik liburu bat ___. | Nik liburu bat ___. | Nik arreba bat ___. | Nik txartel bat ___. | Nik bilera bat ___. |
| hi (Hik) | Hik auto bat ___. | Hik koaderno bat ___. | Hik anaia bat ___. | Hik mapa bat ___. | Hik auto bat ___. |
| hura (Hark/Berak) | Berak etxe bat ___. | Hark arkatz bat ___. | Berak seme bat ___. | Hark pasaporte bat ___. | Berak etxe bat ___. |
| gu (Guk) | Guk denbora ___. | Guk azterketa bat ___. | Guk etxe handi bat ___. | Guk maleta bat ___. | Guk denbora ___. |
| zuek | Zuek arazo bat ___. | Zuek azterketa bat ___. | Zuek lorategi bat ___. | Zuek hotel bat ___. | Zuek arazo bat ___. |
| haiek | Haiek aukera bat ___. | Haiek liburutegi bat ___. | Haiek anaia bat ___. | Haiek hegazkin bat ___. | Haiek aukera bat ___. |

### Past

| Person | Aplikazioa (oraingoa) | Eskola | Familia eta etxea | Bidaiak | Eguneroko bizitza |
|---|---|---|---|---|---|
| ni (Nik) | Nik diru asko ___. | Nik azterketa bat ___. | Nik arazo bat ___. | Nik txartel bat ___. | Nik diru asko ___. |
| hi (Hik) | Hik liburu bat ___. | Hik liburu bat ___. | Hik etxe bat ___. | Hik mapa bat ___. | Hik lan bat ___. |
| hura (Hark/Berak) | Hark ideia on bat ___. | Hark ideia on bat ___. | Berak seme bat ___. | Hark pasaporte bat ___. | Berak auto bat ___. |
| gu (Guk) | Guk arrazoi ___. | Guk azterketa bat ___. | Guk etxe handi bat ___. | Guk maleta bat ___. | Guk arrazoi ___. |
| zuek | Zuek galdera bat ___. | Zuek galdera bat ___. | Zuek anaia bat ___. | Zuek hotel bat ___. | Zuek lan asko ___. |
| haiek | Haiek denbora gutxi ___. | Haiek azterketa bat ___. | Haiek anaia bat ___. | Haiek hegazkin bat ___. | Haiek denbora gutxi ___. |

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

## Cultural sentence bank — modal verbs (nahi, behar, ahal) (future units)

`nahi` (to want), `behar` (to need/must), and `ahal` (to be able to) aren't
conjugated themselves — they pair with a main verb's radical and let `izan`
or `ukan/edun` carry the tense/agreement at the end of the sentence, much
like `CLAUDE.md`'s `periphrastic` type (participle + auxiliary), except the
"participle" slot here is `[main verb radical] + nahi/behar/ahal`. Same
"full sentence, adapt later" status as the banks above; the drilled
auxiliary is whichever finite form sits at the end.

### 1. NAHI (to want)
*Takes a **NOR-NORK** auxiliary (matching the person who wants).*

- **Nik gaur gauean sagardotegira joan nahi dut.**
  - *Translation:* I want to go to the cider house tonight.
- **Gure lagunek Donostiako Danborrada hurbiletik ikusi nahi dute.**
  - *Translation:* Our friends want to see the San Sebastian Drum Festival up
    close.
- **Zuk Idiazabal gazta pixka bat erosi nahi zenuen atzoko azokan.**
  - *Translation:* You wanted to buy some Idiazabal cheese at yesterday's
    market.
- **Guk udan Euskal Herriko kosta osoa zeharkatu nahi dugu txalupaz.**
  - *Translation:* We want to cross the entire Basque coast by boat in the
    summer.
- **Arrantzaleek gaur gauean portura garaiz itzuli nahi dute.**
  - *Translation:* The fishermen want to return to the port early tonight.
- **Turistek Zumaia Flysch-eko itsaslabarrak argazkitan hartu nahi dituzte.**
  - *Translation:* The tourists want to take photos of the Zumaia Flysch
    cliffs.
- **Nik baserriko sukaldean euskal pastela egiten ikasi nahi dut.**
  - *Translation:* I want to learn how to make Basque cake in the farmhouse
    kitchen.
- **Zuek bertsolarien saioa plazako lehen lerrotik entzun nahi zenuten.**
  - *Translation:* You all wanted to listen to the bertsolaris' session from
    the front row of the square.
- **Guk gure aplikazioan euskal aditz guztiak sartu nahi ditugu.**
  - *Translation:* We want to include all Basque verbs in our application.
- **Zuek Korrika festan euskararen alde korrika egin nahi duzue.**
  - *Translation:* You all want to run for the Basque language in the Korrika
    festival.
- **Nik Baionako dendan jantzi tradizionalak erosi nahi nituen.**
  - *Translation:* I wanted to buy traditional clothing in the Bayonne shop.

### 2. BEHAR (to need / must)
*Takes a **NOR-NORK** auxiliary (matching the person who needs).*

- **Mendizaleek ura eta mapak eraman behar dituzte Gorbeiara igotzeko.**
  - *Translation:* The mountaineers need to carry water and maps to climb
    Gorbeia.
- **Zuek bihar goizean garaiz esnatu behar duzue Gernikako azokara
  joateko.**
  - *Translation:* You all need to wake up early tomorrow morning to go to
    the Gernika market.
- **Sukaldariak legatz freskoa garbitu behar du marmitakoa egiteko.**
  - *Translation:* The chef needs to clean the fresh hake to make the fish
    stew.
- **Nik euskarazko aditzak ondo ikasi behar nituen azterketa gainditzeko.**
  - *Translation:* I needed to learn the Basque verbs well to pass the exam.
- **Herritarrek dantzari dantza ondo entrenatu behar dute jaietarako.**
  - *Translation:* The townspeople need to practice the traditional dantzari
    dance well for the festivals.
- **Okinak irina eta ur epela nahasi behar ditu ogia labean sartzeko.**
  - *Translation:* The baker needs to mix flour and warm water to put the
    bread in the oven.
- **Nik bihar goizean txakolin botilak sotorik hotzenean gorde behar
  ditut.**
  - *Translation:* Tomorrow morning, I need to store the Txakoli bottles in
    the coldest cellar.
- **Zuk Bilboko Guggenheim museorako sarrerak Internetez erosi behar
  zenituen.**
  - *Translation:* You needed to buy the tickets for the Bilbao Guggenheim
    Museum online.
- **Guk euskal mitologiaren istorioak gazteei kontatu behar dizkiegu.**
  - *Translation:* We must tell the stories of Basque mythology to the
    youth.
- **Sukaldariek txuleta handia txosnan erre behar dute gaur gauean.**
  - *Translation:* The cooks must roast the massive steak in the festival
    stall tonight.
- **Guk gure telefonoetan euskal aditzak ikasteko aplikazioa instalatu behar
  dugu.**
  - *Translation:* We need to install the application to learn Basque verbs
    on our phones.

### 3. AHAL (to be able to)
*Can take a **NOR** or **NOR-NORK** auxiliary, depending on whether the main
action itself is transitive or intransitive.*

- **Haurrak gaur arratsaldean plazan dantzatu ahal dira.**
  - *Translation:* The children can dance in the square this afternoon.
    *(Intransitive action → uses **dira**)*
- **Pilotariek partida gogorra irabazi ahal dute gaurko txapelketan.**
  - *Translation:* The pelota players can win a tough match in today's
    tournament. *(Transitive action → uses **dute**)*
- **Gu bihar San Juan de Gaztelugatxera joan ahal izango gara.**
  - *Translation:* We will be able to go to San Juan de Gaztelugatxe
    tomorrow. *(Future tense with ahal → **ahal izango gara**)*
- **Zuk nire aitona baserritarraren istorioak ulertu ahal dituzu.**
  - *Translation:* You can understand my grandfather the farmer's stories.
    *(Transitive with plural object → uses **dituzu**)*
- **Surflariek Mundakako ezker olatua erraz hartu ahal dute gaur.**
  - *Translation:* The surfers can easily catch Mundaka's left wave today.
- **Gazteak Baionako jaietan goizera arte dantzatu ahal izango dira.**
  - *Translation:* The youths will be able to dance until morning at the
    Bayonne festivals.
- **Umeak baso ilunean bakarrik ibili ahal ziren Basajaun agertu baino
  lehen.**
  - *Translation:* The children were able to walk alone in the dark forest
    before Basajaun appeared.
- **Nik Tolosako babarrun gorriak nire kabuz prestatu ahal izan ditut.**
  - *Translation:* I have been able to prepare Tolosa's red beans on my own.
- **Zuek pilotari txapeldunari eskua eman ahal zenioten pilotalekuan.**
  - *Translation:* You all were able to shake the champion pelota player's
    hand in the fronton court.
- **Surflariak Mundakako uretan hiru orduz egon ahal izan dira.**
  - *Translation:* The surfers have been able to stay in Mundaka's waters for
    three hours. *(Past potential, intransitive → uses **izan dira**)*
- **Umeek gauean Basajaunen ipuin beldurgarriak entzun ahal dituzte.**
  - *Translation:* The children can listen to scary stories of Basajaun at
    night. *(Transitive with plural object → uses **dituzte**)*

---

## Cultural sentence bank — causative (-arazi/-erazi) (Phase VI, Units 23-25)

The **causative suffix `-arazi`** (sometimes `-erazi`) attaches to a verb's
radical and changes the meaning from *doing* an action to *making, causing,
or forcing someone else* to do it — see `docs/VERB_COVERAGE.md` §6 for the
grammar (the `nor`→`nor-nork` and `nor-nork`→`nor-nori-nork` argument shifts)
and `docs/LEARNING_JOURNEY.md`'s Phase VI (Units 23-25) for where these land
in the curriculum. Same "full sentence, adapt later" status as the banks
above — the drilled form is the auxiliary at the end, exactly like any other
periphrastic verb.

### 1. Transforming intransitive verbs (`nor` → `nor-nork`)
*A basic intransitive verb like "to go" or "to laugh" becomes "to make go" or
"to make laugh."*

- **Bertsolariaren txantxek barre arazi digute plazan.**
  - *Translation:* The bertsolari's jokes made us laugh in the square.
  - *Base verb:* *Barre egin* (to laugh) → *Barre arazi* (to make laugh).
- **Mendiko ekaitz gogorrak kirolariak baserrira itzularazi zituen.**
  - *Translation:* The harsh mountain storm made the athletes return to the
    farmhouse.
  - *Base verb:* *Itzuli* (to return) → *Itzularazi* (to force/make return).
- **Donostiako Danborradako doinuek haurrak pozez dantzariarazi dituzte.**
  - *Translation:* The melodies of San Sebastian's Drum Festival made the
    children dance with joy.
  - *Base verb:* *Dantzatu* (to dance) → *Dantzariarazi* (to make dance).
- **Zuzendariak langileak Bilboko museora joanarazi zituen goizean.**
  - *Translation:* The director made the workers go to the Bilbao museum in
    the morning.
  - *Base verb:* *Joan* (to go) → *Joanarazi* (to make go).
- **Goizeko eguzkiak loreak mendian agertarazi ditu.**
  - *Translation:* The morning sun made the flowers appear on the mountain.
  - *Base verb:* *Agertu* (to appear) → *Agertarazi* (to make appear).
- **Basajaunen beldurrak ardiak basotik korrikarazi zituen.**
  - *Translation:* The fear of Basajaun made the sheep run out of the forest.
  - *Base verb:* *Korrika egin* (to run) → *Korrikarazi* (to make run).
- **Zumaia Flysch-eko olatu handiek turistak atzerarazi zituzten.**
  - *Translation:* The big waves of the Zumaia Flysch made the tourists step
    back.
  - *Base verb:* *Atzera egin* (to step back) → *Atzerarazi* (to make step
    back).
- **Gernikako albisteak herritarrak plazan bilduarazi ditu.**
  - *Translation:* The news from Gernika made the townspeople gather in the
    square.
  - *Base verb:* *Bildu* (to gather) → *Bilduarazi* (to make gather).
- **Lagunaren txakolinak niri logura sarrarazi dit.**
  - *Translation:* My friend's Txakoli made sleepiness enter me (made me
    sleepy).
  - *Base verb:* *Sartu* (to enter) → *Sarrarazi* (to make enter).
- **Entrenatzaileak pilotari gazteak frontonean gogor entrenarazten ditu.**
  - *Translation:* The coach makes the young pelota players train hard in the
    fronton court.
  - *Base verb:* *Entrenatu* (to train) → *Entrenarazi* (to make train).
- **Amonaren errezetak marmitakoari usain bikaina jorazi dio.**
  - *Translation:* Grandmother's recipe made an excellent aroma arise from
    the tuna stew.
  - *Base verb:* *Jario* (to ooze/emanate, a `nor-nori` verb) → *Jorazi* (to
    make emanate) — a candidate example for `docs/VERB_COVERAGE.md` §6's open
    question about causativizing `nor-nori` verbs.

### 2. Transforming transitive verbs (`nor-nork` → `nor-nori-nork`)
*When the original verb already has a direct object (like "to eat meat" or
"to drink wine"), adding `-arazi` requires a three-argument structure: someone
(`nork`) makes someone else (`nori`) do something (`nor`).*

- **Amonak bilobei Tolosako babarrun gorriak jandakarazi dizkie.**
  - *Translation:* Grandmother made her grandchildren eat Tolosa's red beans.
  - *Base verb:* *Jan* (to eat) → *Janarazi / Jandakarazi* (to feed / force to
    eat).
- **Etxekoak bisitariei Getariako txakolin hotza edanarazi die afarian.**
  - *Translation:* The host made the visitors drink cold Txakoli from Getaria
    during dinner.
  - *Base verb:* *Edan* (to drink) → *Edanarazi* (to make drink).
- **Irakasleak ikasleei euskal mitologiaren istorioak idatzarazi dizkie.**
  - *Translation:* The teacher made the students write stories of Basque
    mythology.
  - *Base verb:* *Idatzi* (to write) → *Idatzarazi* (to make write).
- **Sukaldariak laguntzaileari Idiazabal gazta zatituarazi dio.**
  - *Translation:* The chef made the assistant slice the Idiazabal cheese.
  - *Base verb:* *Zatitu* (to slice) → *Zatituarazi* (to make slice).
- **Aitona baserritarrak guri euskal kanta zaharrak abestarazi dizkigu.**
  - *Translation:* The grandfather farmer made us sing old Basque songs.
  - *Base verb:* *Abestu* (to sing) → *Abestarazi* (to make sing).
- **Arrantzaleek dendariei hegaluze freskoa merke salduarazi diote.**
  - *Translation:* The fishermen made the shopkeepers sell the fresh albacore
    tuna cheaply.
  - *Base verb:* *Saldu* (to sell) → *Salduarazi* (to make sell).
- **Zuzendariak idazleari bertsoen liburua euskararazi zion iaz.**
  - *Translation:* The director made the writer translate the book of verses
    into Basque last year.
  - *Base verb:* *Euskaratu* (to translate into Basque) → *Euskararazi* (to
    make translate).
- **Epaimahaiak pilotariari txapela kenduarazi dio pilotalekuan.**
  - *Translation:* The jury made the pelota player remove the championship
    beret in the fronton court.
  - *Base verb:* *Kendu* (to remove) → *Kenduarazi* (to make remove).
- **Etxeko jabeak bisitariei upel berritik txakolina edanarazi die.**
  - *Translation:* The house owner made the visitors drink Txakoli from the
    new barrel.
  - *Base verb:* *Edan* (to drink) → *Edanarazi* (to make drink).

### 3. Advanced tenses & moods with `-arazi`
*Pairs with Refresh Gate D (Unit 25)'s recombination of `-arazi` with future,
conditional, and imperative.*

#### Future Tense (Geroaldia)
- **Entrenatzaileak pilotariei partida hobea jokaraziko die datorren
  igandean.**
  - *Translation:* The coach will make the pelota players play a better
    match next Sunday.
  - *Base verb:* *Jokatu* (to play) → *Jokarazi* (to make play).
- **Gurasoek umeei sasoiko perretxikoak mendian bilduaraziko dizkiete
  bihar.**
  - *Translation:* The parents will make the children gather seasonal wild
    mushrooms on the mountain tomorrow.
  - *Base verb:* *Bildu* (to gather) → *Bilduarazi* (to make gather).
- **Okinak labe berriak euskal pastela azkarrago laberaraziko du.**
  - *Translation:* The baker's new oven will make the Basque cake bake
    faster.
  - *Base verb:* *Labean sartu/erre* (to bake) → *Laberazi* (to make bake).
- **Euskal abesti herrikoiek dantzariak gautik goizera dantzariaraziko
  dituzte.**
  - *Translation:* Traditional Basque songs will make the dancers dance from
    night until morning.
  - *Base verb:* *Dantzatu* (to dance) → *Dantzariarazi* (to make dance) — the
    future-tense companion to section 1's present-tense example.

#### Conditional Mood (Baldintza)
- **Gurasoek umeei gelako argia itzalariaraziko baliete, haurrak berehala
  lokartuko lirateke.**
  - *Translation:* If the parents made the children turn off the bedroom
    light, the kids would fall asleep immediately.
  - *Base verb:* *Itzali* (to turn off) → *Itzalarazi* (to make turn off).
- **Guk zuei egia ikusaraziko bagenizue, zuek guri lagunduko zenigukete.**
  - *Translation:* If we made you all see the truth, you would help us.
  - *Base verb:* *Ikusi* (to see) → *Ikusarazi* (to make see).
- **Errezeta honek niri marmitako hobea prestataraziko lidake denbora
  banu.**
  - *Translation:* This recipe would make me prepare a better tuna stew if I
    had time.
  - *Base verb:* *Prestatu* (to prepare) → *Prestatarazi* (to make prepare).

#### Imperative Mood (Agintera)
- **Gernikako okinari euskal pastel gozoa guri dastarazi diezaiola esan!**
  - *Translation:* Tell the baker from Gernika to let us taste the delicious
    Basque cake!
  - *Base verb:* *Dastatu* (to taste) → *Dastarazi* (to let/make taste).
- **Entrenatzaileak kirolariei soka gogorrago tiraerazi diezaiola!**
  - *Translation:* Have the coach make the athletes pull the rope harder!
  - *Base verb:* *Tira egin* (to pull) → *Tiraerazi* (to make pull).
- **Erakutsarazi iezaiozu Baionako mapa lagunari bidea gal ez dezan!**
  - *Translation:* Make your friend show the map of Bayonne so they don't get
    lost!
  - *Base verb:* *Erakutsi* (to show) → *Erakutsarazi* (to make show).

---

## Cultural sentence bank — continuous aspect (`ari izan`) (future units)

A handful of earlier sentences (in the "Present Continuous" subsections
above) already used **ari**, but it deserves its own treatment: `ari izan`
is how Basque forms continuous/progressive tenses (English "-ing"). The main
verb takes the verbal-noun suffix (`-tzen`/`-ten`), followed by `ari`, then
an auxiliary.

**Crucial for tagging by `agreement`:** `ari` *always* takes a **NOR**
auxiliary (`izan`), even when the embedded verb is transitive — e.g. "we are
developing an app" uses `gara`, not `dugu`. So a future `ari`-periphrastic
`VERBS` entry would carry `agreement: ['nor']` regardless of the main verb's
own valency; the object/subject of the embedded verb stays baked into the
sentence text rather than the auxiliary.

### 1. Present Continuous (Oraina + Ari)
*Structure: [Verb]-tzen/-ten + ari + Present NOR Auxiliary (naiz, zara, da,
gara, zarete, dira)*

- **Une honetan, sukaldariak marmitako gozoa prestatzen ari dira
  sukaldean.**
  - *Translation:* At this moment, the chefs are preparing delicious tuna
    stew in the kitchen.
- **Arrantzaleak Getariako portuan sareak konpontzen ari dira.**
  - *Translation:* The fishermen are repairing the nets in the port of
    Getaria.
- **Gu aplikazio eder bat garatzen ari gara euskal aditzak irakasteko.**
  - *Translation:* We are developing a beautiful application to teach Basque
    verbs.
- **Zu Idiazabal gazta eta txakolina dasten ari zara plazako azokan.**
  - *Translation:* You are tasting Idiazabal cheese and txakoli wine at the
    square's market.
- **Dantzariak plazako lurra zapaltzen ari dira fandangoa dantzatzeko.**
  - *Translation:* The dancers are stepping on the square's ground to dance
    the fandango.
- **Gu Zumaia Flysch-eko itsaslabarren artean oinez ibiltzen ari gara.**
  - *Translation:* We are walking among the cliffs of the Zumaia Flysch.

### 2. Past Continuous (Lehena + Ari)
*Structure: [Verb]-tzen/-ten + ari + Past NOR Auxiliary (nintzen, zinen, zen,
ginen, zineten, ziren)*

- **Atzo arratsaldean, dantzariak Donostiako kaleetan dantzatzen ari
  ziren.**
  - *Translation:* Yesterday afternoon, the dancers were dancing in the
    streets of San Sebastian.
- **Mendizaleak Gorbeiako gurutzeraino igotzen ari ziren ekaitza hasi
  denean.**
  - *Translation:* The mountaineers were climbing up to the Gorbeia cross
    when the storm started.
- **Ni bertsolarien saioa irratiz entzuten ari nintzen afaltzen nuen
  bitartean.**
  - *Translation:* I was listening to the bertsolaris' session on the radio
    while I was having dinner.
- **Zuek pilotarien partida zirraragarria ikusten ari zineten
  pilotalekuan.**
  - *Translation:* You all were watching the exciting pelota match in the
    fronton court.
- **Artzaia ardi latzak mendian biltzen ari zen ekaitza hasi aurretik.**
  - *Translation:* The shepherd was gathering the Latxa sheep on the mountain
    before the storm started.
- **Aste Nagusian su artifizialak zeruan lehertzen ari ziren herritarrek
  begiratzen zieten bitartean.**
  - *Translation:* During the Aste Nagusia, fireworks were exploding in the
    sky while the citizens watched them.

### 3. Future Continuous (Geroa + Ari)
*Structure: [Verb]-tzen/-ten + ari + izango + Present NOR Auxiliary (also
seen contracted as `arituko`/`ariko` + Present NOR Auxiliary)*

- **Bihar goizean, baserritarrak Gernikako azokan barazkiak saltzen ari
  izango dira.**
  - *Translation:* Tomorrow morning, the farmers will be selling vegetables
    at the Gernika market.
- **Hurrengo astean, surflariak Mundakako ezker olatua hartzen ari izango
  dira.**
  - *Translation:* Next week, the surfers will be catching Mundaka's left
    wave.
- **Haurrak Olentzeroren abestia ikasten ariko dira datorren abenduan.**
  - *Translation:* The children will be learning Olentzero's song next
    December. *(`ariko` is the contracted form of `ari izango`.)*

---

## Cultural sentence bank — synthetic verbs (`aditz trinkoak`) (future units)

Most Basque verbs are **periphrastic**: a participle plus an auxiliary
(`izan`/`ukan`) that carries tense/person/number, the only pattern `VERBS`
currently models. A small set of high-frequency verbs are instead
**synthetic** (`aditz trinkoak`): tense, person, and number are packed
directly into the verb itself, with no separate auxiliary — and the root
often changes drastically between forms (`joan` → `doa`, `zihoan`,
`gindoazen`...). These are present in everyday speech from day one, so
covering them (even just in `nor` present/past) fills a real gap.

The eight verbs below — `egon`, `joan`, `etorri`, `ibili` (NOR/intransitive)
and `ukan`/`edun`, `jakin`, `eraman`, `ekarri` (NOR-NORK/transitive) — cover
the common synthetic set alongside `izan` (already in `VERBS`). Because the
root itself changes per person/tense rather than just an ending, these don't
fit `VERBS`'s `conjugations[tense][person]` shape any differently than
`izan` already does — same Tier 1 data-only addition per
`docs/EXERCISE_ENGINE.md` — but a future "Trinkoak" focus mode that drills
*only* these eight verbs' root changes side-by-side could be a worthwhile
Tier 3/4 idea once enough of them are in `VERBS` (not yet classified or
scheduled — flagged here for later).

### 1. NOR Synthetic Verbs (Intransitive)

#### EGON (to be / to stay)

Present (Oraina):
- **Gaur gure amona baserrian dago.**
  - *Translation:* Today our grandmother is at the farmhouse.
- **Gure osaba arrantzalea Getariako portuko tabernan dago.**
  - *Translation:* Our uncle the fisherman is at the bar in Getaria's port.
- **Gu Bilboko Zazpi Kaleetan gaude lagunen zain.**
  - *Translation:* We are in Bilbao's Seven Streets waiting for friends.
- **Zuek gaur oso nekatuta zaudete Gorbeia mendira igon ondoren.**
  - *Translation:* You all are very tired today after climbing Mount Gorbeia.
- **Ni upategian nago txakolin botilak etiketatzen.**
  - *Translation:* I am in the winery labeling Txakoli bottles.

Past (Lehena):
- **Atzo mendizaleak Gorbeiako gailurrean zeuden ekaitza hasi zenean.**
  - *Translation:* Yesterday the mountaineers were at the summit of Gorbeia
    when the storm started.
- **Gu atzo Bilboko Guggenheim museoaren aurrean geunden zain.**
  - *Translation:* Yesterday we were waiting in front of the Bilbao
    Guggenheim Museum.
- **Arrantzaleak itsasontzian zeuden ekaitza hasi zenean.**
  - *Translation:* The fishermen were on the boat when the storm started.
- **Amona sukaldean zegoen marmitakoa sutan prestatzen.**
  - *Translation:* Grandmother was in the kitchen preparing the tuna stew on
    the fire.
- **Gu atzo arratsaldean Donostiako hondartzan geunden jendea begiratzen.**
  - *Translation:* Yesterday afternoon we were on San Sebastian's beach
    watching the people.

#### JOAN (to go)

Present (Oraina):
- **Goizero haurrak oinez doaz herriko eskolara.**
  - *Translation:* Every morning the children go on foot to the village
    school.
- **Mendizaleak azkar doaz Anbotoko jatorrizko kobazulorantz.**
  - *Translation:* The mountaineers are going quickly toward the original
    cave of Anboto.
- **Gu asteburu honetan Baionako festetara goaz lagunekin.**
  - *Translation:* This weekend we are going to the Bayonne festivals with
    friends.
- **Zu gaur goizean Gernikako azokara zoaz barazki freskoen bila.**
  - *Translation:* This morning you are going to the Gernika market looking
    for fresh vegetables.

Past (Lehena):
- **Iaz gu Baionako jaietara gindoazen autoan bidea galdu genuenean.**
  - *Translation:* Last year we were going to the Bayonne festivals in the
    car when we got lost.
- **Zu iaz Donostiako Parte Zaharreko pintxo taberna guztietara zindoazen.**
  - *Translation:* Last year you were going to all the pintxo bars in San
    Sebastian's Old Town.
- **Haurrak korrika zihoazen Olentzero ikustera plazara.**
  - *Translation:* The children were going running to the square to see
    Olentzero.
- **Zuek iaz oinez zindoazten Donostiatik Behobiara bide zaharretik.**
  - *Translation:* Last year you all were going on foot from San Sebastian to
    Behobia via the old path.
- **Ni bakarrik nindoan basoan Basajaun ikusi nuenean.**
  - *Translation:* I was going alone in the forest when I saw Basajaun.

#### ETORRI (to come)

Present (Oraina):
- **Begira! Dantzariek Zuberoako jantzi politak jantzita datoz.**
  - *Translation:* Look! The dancers are coming wearing beautiful outfits
    from Soule.
- **Begira, Zuberoako maskaradako dantzariak kantuan datoz herriko
  plazara!**
  - *Translation:* Look, the dancers of the Soule masquerade are coming
    singing to the town square!
- **Gu pozik gatoz frontonetik gure herriko pilotariek irabazi
  dutelako.**
  - *Translation:* We are coming happily from the fronton because our town's
    pelota players won.
- **Zu itsasotik datorren haize hotzarekin zatoz etxera.**
  - *Translation:* You are coming home with the cold wind that comes from the
    sea.

Past (Lehena):
- **Zuzendaria Bilboko Guggenheim museotik zetorren nirekin topo egin
  duenean.**
  - *Translation:* The director was coming from the Bilbao Guggenheim Museum
    when he ran into me.
- **Gurasoak goizeko lehen orduan zetozen baserritik esnearekin.**
  - *Translation:* The parents were coming from the farmhouse with the milk
    at the first hour of the morning.
- **Zuek korrika zenetozten Korrika festan lekukoa eskuz esku
    pasatzen.**
  - *Translation:* You all were coming running in the Korrika festival
    passing the witness baton from hand to hand.
- **Zuek pilotarien partidatik zenetozten pozik irabazi zutelako.**
  - *Translation:* You all were coming from the pelota players' match happy
    because they won.
- **Ni oso nekatuta nentorren Tolosako babarrun janketatik.**
  - *Translation:* I was coming back very tired from the Tolosa bean feast.

#### IBILI (to walk / to roam / to be busy with)

Present (Oraina):
- **Surflariak egun osoan Mundakako olatuetan dabiltza.**
  - *Translation:* The surfers are hanging around the Mundaka waves all day.
- **Basurdeak gauez herriko baso sakonetan dabiltza janari bila.**
  - *Translation:* The wild boars are roaming the deep forests of the town at
    night looking for food.
- **Gazteak Donostiako Parte Zaharrean dabiltza pintxorik onenaren
  bila.**
  - *Translation:* The youths are roaming around San Sebastian's Old Town
    looking for the best pintxo.
- **Gu egun osoan aplikazioaren kodea idazten gabiltza gure sotorik
  ilunenean.**
  - *Translation:* We are busy writing the application's code all day in our
    darkest cellar.
- **Zuek basoan zabiltzate sasoiko perretxikoak eta zizak biltzen.**
  - *Translation:* You all are walking in the forest gathering seasonal wild
    mushrooms.

Past (Lehena):
- **Zuek atzo arratsaldean Donostiako Parte Zaharrean zenbiltzaten
  pintxoak jaten.**
  - *Translation:* You all were walking around San Sebastian's Old Town
    yesterday afternoon eating pintxos.
- **Ni goiz osoan sukaldean nenbilen Tolosako babarrunak egosten.**
  - *Translation:* I was busy in the kitchen all morning boiling Tolosa
    beans.
- **Basurdeak gauez herriko soroetan zebiltzan janari bila.**
  - *Translation:* The wild boars were roaming the village fields at night
    looking for food.
- **Ni goiz osoan nenbilen sukaldean euskal pastela labean sartu
  nahian.**
  - *Translation:* I was busy all morning in the kitchen trying to get the
    Basque cake into the oven.
- **Zu atzo Aste Nagusian zenbiltzan lagun zaharrak agurtzen.**
  - *Translation:* Yesterday you were walking around the Aste Nagusia
    greeting old friends.

### 2. NOR-NORK Synthetic Verbs (Transitive)

#### UKAN / EDUN (to have)

Present (Oraina):
- **Baserritarrek ardi latxak dituzte mendian.**
  - *Translation:* The farmers have Latxa sheep on the mountain.

Past (Lehena):
- **Guk Getariako txakolin botila bat genuen hozkailuan.**
  - *Translation:* We had a bottle of Txakoli from Getaria in the fridge.

#### JAKIN (to know information)

Present (Oraina):
- **Nik ondo dakit Tolosako babarrunak nola prestatu.**
  - *Translation:* I know well how to prepare Tolosa's beans.
- **Nik oso ondo dakit zein den euskal pastelik onena.**
  - *Translation:* I know very well which is the best Basque cake.
- **Nik oso ondo dakit Idiazabal gazta nola egiten den baserrietan.**
  - *Translation:* I know very well how Idiazabal cheese is made in
    farmhouses.
- **Guk badakigu bertsolariak nola rimatu behar dituen bertsoak plazan.**
  - *Translation:* We know how the bertsolari must rhyme the verses in the
    square.
- **Zuek al dakizue nor den Mundakako ezker olatua hobekien hartzen duen
  surflaria?**
  - *Translation:* Do you all know who is the surfer that catches Mundaka's
    left wave best?

Past (Lehena):
- **Zuk bertsotan abesten bazenekien, zergatik ez zenuen parte hartu?**
  - *Translation:* If you knew how to sing improvised verses, why didn't you
    participate?
- **Gure gurasoek ez zekiten bertsolarien saioa gaur arratsaldean
  zenik.**
  - *Translation:* Our parents did not know that the bertsolaris' session
    was this afternoon.
- **Aitonak ez zekien gaur gauean sagardotegira joateko plana genuenik.**
  - *Translation:* Grandfather did not know that we had a plan to go to the
    cider house tonight.
- **Guk bagenekien Zumaia Flysch-eko itsaslabarrak arriskutsuak zirela.**
  - *Translation:* We knew that the cliffs of the Zumaia Flysch were
    dangerous.
- **Zuk bazenekien euskal aditz trinkoak ikastea zaila izango zela.**
  - *Translation:* You knew that learning Basque synthetic verbs was going to
    be difficult.

#### ERAMAN (to carry / to take along)

Present (Oraina):
- **Arrantzaleek hegaluze freskoa daramate Getariako portura.**
  - *Translation:* The fishermen are carrying fresh albacore tuna to the port
    of Getaria.
- **Guk motxilan Idiazabal gazta eta ogia daramagu mendirako.**
  - *Translation:* We are carrying Idiazabal cheese and bread in our
    backpacks for the mountain.
- **Arrantzaleek hegaluze fresko ugari daramate gaurko kaxetan.**
  - *Translation:* The fishermen are carrying a lot of fresh albacore tuna in
    today's boxes.
- **Zuk daramazun zurezko soka oso gogorra da herri kiroletarako.**
  - *Translation:* The wooden rope you are carrying is very tough for rural
    sports.
- **Zuk motxilan Idiazabal gazta zaharra daramazu afaltzeko.**
  - *Translation:* You are carrying old Idiazabal cheese in your backpack for
    dinner.
- **Guk motxilan Getariako txakolin botila hotz bi daramagu.**
  - *Translation:* We are carrying two cold bottles of Getaria Txakoli in our
    backpack.

Past (Lehena):
- **Sukaldariek txuleta handiak zeramatzaten txosnatik mahaira.**
  - *Translation:* The cooks were carrying large steaks from the festival
    stall to the table.
- **Nik nire txakurra neraman mendira ardi latzak ikustera.**
  - *Translation:* I was taking my dog to the mountain to see the Latxa
    sheep.
- **Zuek autoan zeramatzazten dantzariak herriko jaietara joateko.**
  - *Translation:* You all were carrying the dancers in the car to go to the
    town festivals.

#### EKARRI (to bring)

Present (Oraina):
- **Lagunek Donostiako Danborradako danbor txiki bat dakarte
  oparitzeko.**
  - *Translation:* The friends are bringing a small drum from San Sebastian's
    Drum Festival to gift.
- **Nire lagunek Getariako txakolin botila hotzak dakarte.**
  - *Translation:* My friends bring cold bottles of Txakoli from Getaria.
- **Nire lagunek goizero euskal pastel gozoak dakarte gozotegitik.**
  - *Translation:* My friends bring delicious Basque cakes from the pastry
    shop every morning.
- **Nik zuri Tolosako babarrun gorri zaku bat dakart oparitzeko.**
  - *Translation:* I bring you a sack of Tolosa red beans as a gift.
- **Guk baserriko ur berria dakargu mendiko iturritik.**
  - *Translation:* We bring fresh farmhouse water from the mountain spring.

Past (Lehena):
- **Okinak euskal pastel gozo-gozoak zekartzan labetik atera berritan.**
  - *Translation:* The baker was bringing delicious Basque cakes fresh out of
    the oven.
- **Okinak goizero ogi laberatu berriak zekartzan gurdi gainean.**
  - *Translation:* The baker brought freshly baked bread on top of the cart
    every morning.
- **Zuk saski beteta perretxiko zekarzkigun atzo basotik bueltan.**
  - *Translation:* You brought us a basket full of mushrooms yesterday
    returning from the forest.
- **Guk opari politak zekarzkizun Baionako denda txikitik.**
  - *Translation:* We brought you nice gifts from the small shop in Bayonne.

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
6. The modal-verb bank pairs with Unit 2 (`nahi` per `journey.js`'s "Having
   and Wanting") and Units 9–10's `behar`/Geroa work — `ahal`'s sentences also
   double as early `potential`-tense examples once that tense exists.
7. The causative bank pairs with the new Phase VI (Units 23-25,
   `LEARNING_JOURNEY.md`) — `docs/VERB_COVERAGE.md` §6 still needs the
   `-arazi`/`-erazi` conditioning rule sourced before any of these become
   `VERBS` entries.
8. The `ari izan` continuous-aspect bank isn't yet placed in
   `LEARNING_JOURNEY.md` — find or add a unit for it (likely paired with
   present/past tense units, since it reuses their NOR auxiliaries) before
   pulling sentences from it.
9. The synthetic-verb (`aditz trinkoak`) bank covers `egon`, `joan`, `etorri`,
   `ibili`, `ukan`/`edun`, `jakin`, `eraman`, `ekarri` — none of these are yet
   in `VERBS` or `LEARNING_JOURNEY.md`. `docs/VERB_COVERAGE.md` should gain a
   section noting these as a distinct "synthetic verbs" coverage area once
   units are planned for them.
