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
- **Gaur goizean mendizaleak azkar igotzen ari dira Gorbeiako gurutzeraino.**
  - *Translation:* This morning, the mountaineers are quickly climbing up to
    the Gorbeia cross.

#### Past Tense (Lehena)
- **Iaz, nire lagunak Donostiako Danborradan ibili ziren gau osoan.**
  - *Translation:* Last year, my friends wandered through San Sebastian's
    Drum Festival all night long.

#### Synthetic Present (Trinko Oraina — no auxiliary)
- **Gaur gurasoak Bilboko Guggenheim museora doaz.**
  - *Translation:* Today, the parents are going to the Guggenheim Museum in
    Bilbao.
  - *Verb focus:* Uses **doaz** (they go), the synthetic form of *joan*.

### 2. NOR-NORK (Transitive)
*Used when a subject (**Nork**, marked with `-k`) does something to a direct
object (**Nor**). Uses the auxiliary **edun** (to have).*

#### Present Tense (Oraina)
- **Sustraik eta Uxuek bertso politak abesten dituzte plazan.**
  - *Translation:* Sustrai and Uxue sing beautiful improvised verses in the
    square.
- **Amonak marmitako epela prestatu du gaurko bazkarirako.**
  - *Translation:* Grandmother has prepared warm tuna stew for today's lunch.

#### Past Tense (Lehena)
- **Atzo arratsaldean, pilotariek partida zirraragarria jokatu zuten
  pilotalekuan.**
  - *Translation:* Yesterday afternoon, the pelota players played an exciting
    match in the fronton court.

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
- **Umeei beldurra zaie basoan dabilen Basajaun mitologikoa.**
  - *Translation:* The children are afraid of the mythological Basajaun
    walking in the woods.

#### Past Tense (Lehena)
- **Zuri ahaztu zitzaizkizun etxeko giltzak San Fermin jaietan.**
  - *Translation:* You forgot the house keys during the San Fermin festivals.

### 4. NOR-NORI-NORK (Three-argument transitive)
*Tracks the subject (**Nork**), direct object (**Nor**), and indirect object
(**Nori**) — typically the **die**-type auxiliary.*

#### Present Tense (Oraina)
- **Nik zuri gaztelerazko liburua euskaratu dizut.**
  - *Translation:* I have translated the Spanish book into Basque for you.
  - *Auxiliary:* **dizut** = it (`d-`) + to you (`-izu-`) + I (`-t`).
- **Goizanek lagunei opari politak ekarri dizkie Baionako dendatik.**
  - *Translation:* Goizane has brought nice gifts to her friends from the shop
    in Bayonne.

#### Past Tense (Lehena)
- **Gurasoek niri txikitan Olentzeroren ipuinak kontatzen zizkidaten.**
  - *Translation:* When I was little, my parents used to tell me stories about
    Olentzero.
- **Arrantzaleek jatetxeari goizeko legatz freskoa saldu zioten.**
  - *Translation:* The fishermen sold the fresh morning hake to the
    restaurant.

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
Tier 1 (Geroa, Units 14–15), Tier 3 (imperative, Unit 25), and Tier 1
(Ahalera/Baldintza/Ondorioa, Units 23–24) entries. Same culture/geography/
folklore approach as above; same "full sentence, adapt later" status.

### 1. NOR (Intransitive) — advanced tenses

#### Future Tense (Geroaldia)
- **Datorren astean, baserritarrak Gernikako azokara joango dira.**
  - *Translation:* Next week, the farmers will go to the Gernika market.

#### Conditional Mood (Baldintza)
- **Dirurik banu, igandean kirolariak ikustera joango nintzateke.**
  - *Translation:* If I had money, I would go to see the rural sports
    athletes on Sunday.
  - *Verb focus:* Uses the past-continuous hypothetical **nintzateke** (I
    would be).

#### Present Potential (Ahalera Oraina)
- **Zuek gaur gauean Donostiako Parte Zaharrean afal zaitezkete.**
  - *Translation:* You all can have dinner in San Sebastian's Old Town
    tonight.
  - *Verb focus:* **zaitezkete** = you all can be (expressing
    capability/permission).

### 2. NOR-NORK (Transitive) — advanced tenses

#### Present Continuous / Progressive (Aridun Oraina)
- **Une honetan, okinak euskal pastela labean sartzen ari dira.**
  - *Translation:* At this moment, the bakers are putting the Basque cake
    into the oven.
  - *Grammar tip:* Created using the locative nominalization **ari dira**
    (they are engaged in).

#### Past Conditional (Lehengo Baldintza)
- **Guk denbora gehiago izan bagenu, sagardotegiko txuleta jango genuen.**
  - *Translation:* If we had had more time, we would have eaten the steak at
    the cider house.
  - *Verb focus:* **genuen** is used here as the apodosis (the "would have"
    part) of a past conditional.

#### Imperative Mood (Agintera)
- **Ekar itzazu gazta eta Idiazabalgo ardoa mahaira, mesedez!**
  - *Translation:* Bring the cheese and the Idiazabal wine to the table,
    please!
  - *Verb focus:* **Ekar itzazu** is the direct command form (radical verb +
    subjunctive auxiliary), with the plural-object form **itzazu** since the
    two coordinated objects (`gazta eta Idiazabalgo ardoa`) count as a plural
    `haiek`.

### 3. NOR-NORI (Intransitive + indirect object) — advanced tenses

#### Future Tense (Geroaldia)
- **Uda honetan, bidaiariei asko gustatuko zaie Mundakako ezker olatua.**
  - *Translation:* This summer, the travelers will really like Mundaka's
    left-hand wave.
  - *Verb focus:* **gustatuko zaie** (it will be pleasing to them).

#### Past Potential (Ahalera Lehena)
- **Guri txikitan beldurra dakiokeen Mari jainkosa ager zekiokeen basoan.**
  - *Translation:* To us as kids, the goddess Mari, who can be scary, could
    have appeared in the forest.
  - *Verb focus:* **zekiokeen** (it could have happened to us).

### 4. NOR-NORI-NORK (Three-argument transitive) — advanced tenses

#### Future Tense (Geroaldia)
- **Etxekoek niri txakolin botila bat irekiko didate afaltzeko.**
  - *Translation:* The hosts will open a bottle of Txakoli wine for me for
    dinner.
  - *Verb focus:* **didate** turns into a future helper when paired with
    *irekiko*.

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

### Tagging by aspect/mood/tense

For filtering or future authoring, each sentence above can be tagged along
the same axes `VERBS` already models (`agreement` for argument structure, plus
the tense/mood key it would live under in `conjugations`):

| Sentence fragment | Argument structure (`agreement`) | Aspect / mood | `conjugations` key |
|---|---|---|---|
| *...afal zaitezkete.* | nor | Potential (Ahalera) | `potential` |
| *...jango genuen.* | nor-nork | Conditional (Baldintza) | `conditional` |
| *...kontatuko nizueke.* | nor-nori-nork | Conditional (Baldintza) | `conditional` |
| *Ekar itzazu...* | nor-nork | Imperative (Agintera) | `imperative` |

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
- **Niri pintxo merkeak eta gozoak Gasteizko tabernetan bururatu dakizkit.**
  - *Translation:* Cheap and tasty pintxos can occur to me (be found by me)
    in the bars of Vitoria-Gasteiz.
- **Gurasoei umeak gauez basoan galtzen bazaizkie Olentzero ager dakioke.**
  - *Translation:* If the children get lost in the forest at night, Olentzero
    can appear to the parents.

#### Conditional Mood (Baldintza)
- **Zuei katu beltzak bidera aterako balitzaizkizue, zorte txarra irudituko
  litzaizkizue.**
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
- **Sustraik epaimahaiari bertso hobeak kantatu balizkio, txapela
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

## Cultural sentence bank — causative (-arazi/-erazi) (Phase VI, Units 28-30)

The **causative suffix `-arazi`** (sometimes `-erazi`) attaches to a verb's
radical and changes the meaning from *doing* an action to *making, causing,
or forcing someone else* to do it — see `docs/VERB_COVERAGE.md` §6 for the
grammar (the `nor`→`nor-nork` and `nor-nork`→`nor-nori-nork` argument shifts)
and `docs/LEARNING_JOURNEY.md`'s Phase VI (Units 28-30) for where these land
in the curriculum. Same "full sentence, adapt later" status as the banks
above — the drilled form is the auxiliary at the end, exactly like any other
periphrastic verb.

### 1. Transforming intransitive verbs (`nor` → `nor-nork`)
*A basic intransitive verb like "to go" or "to laugh" becomes "to make go" or
"to make laugh."*

- **Bertsolariaren txantxek barre arazi gaituzte plazan.**
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

- **Amonak bilobei Tolosako babarrun gorriak janarazi dizkie.**
  - *Translation:* Grandmother made her grandchildren eat Tolosa's red beans.
  - *Base verb:* *Jan* (to eat) → *Janarazi* (to feed / force to eat).
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
*Pairs with Refresh Gate D (Unit 30)'s recombination of `-arazi` with future,
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
- **Okinaren labe berriak euskal pastela azkarrago erraraziko du.**
  - *Translation:* The baker's new oven will make the Basque cake bake
    faster.
  - *Base verb:* *Erre* (to bake/roast) → *Errarazi* (to make bake). (`-arazi`
    attaches to verb radicals, not nouns — `labe` (oven) + `-arazi` would mean
    "make get put into the oven", not "make bake".)
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
- **Artzaia ardi latxak mendian biltzen ari zen ekaitza hasi aurretik.**
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
- **Zuek korrika zentozten Korrika festan lekukoa eskuz esku
    pasatzen.**
  - *Translation:* You all were coming running in the Korrika festival
    passing the witness baton from hand to hand.
- **Zuek pilotarien partidatik zentozten pozik irabazi zutelako.**
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
- **Guk motxilan Getariako txakolin botila hotz bi daramatzagu.**
  - *Translation:* We are carrying two cold bottles of Getaria Txakoli in our
    backpack.

Past (Lehena):
- **Sukaldariek txuleta handiak zeramatzaten txosnatik mahaira.**
  - *Translation:* The cooks were carrying large steaks from the festival
    stall to the table.
- **Nik nire txakurra neraman mendira ardi latxak ikustera.**
  - *Translation:* I was taking my dog to the mountain to see the Latxa
    sheep.
- **Zuek autoan zeneramatzaten dantzariak herriko jaietara joateko.**
  - *Translation:* You all were carrying the dancers in the car to go to the
    town festivals.

#### EKARRI (to bring)

Present (Oraina):
- **Lagunek Donostiako Danborradako danbor txiki bat dakarte
  oparitzeko.**
  - *Translation:* The friends are bringing a small drum from San Sebastian's
    Drum Festival to gift.
- **Nire lagunek Getariako txakolin botila hotzak dakartzate.**
  - *Translation:* My friends bring cold bottles of Txakoli from Getaria.
- **Nire lagunek goizero euskal pastel gozoak dakartzate gozotegitik.**
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
- **Zuk perretxikoz betetako saski bat zenekarkigun atzo basotik bueltan.**
  - *Translation:* You brought us a basket full of mushrooms yesterday
    returning from the forest.
- **Guk opari politak zekarzkizun Baionako denda txikitik.**
  - *Translation:* We brought you nice gifts from the small shop in Bayonne.

---

## Adoption-readiness curation (#311)

A readiness pass over every sentence in the cultural banks above, per #311's
checklist (naturalness, clean blank, #285 plural-object flag, target
`verbId`/`tense`/`person`, draft `validFor`, classification). **Doc-only —
nothing here has been written into `VERBS` yet**; that's #312 (existing
verbs' present/past), #313 (advanced tenses + landable construction banks),
and #314 (new fodder verbs).

Important context this pass surfaced: `VERBS` has grown substantially since
these banks were drafted — `joan`/`etorri`/`ibili`/`eduki`/`gustatu`/
`iruditu`/`ahaztu`/`nahi`/`behar`/`eraman`/`ekarri`/`jakin`/`ukan` are now all
implemented (most weren't when "future units" was written), and `eraman`'s
and `ekarri`'s synthetic-bank sentences plus most of `behar`'s and three of
`nahi`'s modal-bank sentences have **already been adopted** (`#260`/`#261`/
`#266`/`#267` in `src/data/verbs.js`) — flagged below so #312–314 don't
re-author them. Two structural facts drive most `defer` verdicts below:

- **Tense-table gating** — only `izan`/`ukan` have `conditional`/`potential`/
  `imperative` tables; only `izan`/`egon`/`ukan` have `futurePlural`/
  `pastPlural` *and* `future` together with the rest. Most other verbs have
  `present`/`past`/`future` only. `ahal`'s bank and the causative bank are
  deferred wholesale per the epic body (pending the `ahal` unit and the
  Phase VI causative units, respectively) — not re-litigated per-sentence
  here.
- **`ari`'s table is minimal** — `present` only, and only `ni`/`zu`/`hura`
  (no `gu`/`zuek`/`haiek`, no `past`/`future` at all). This guts most of the
  "continuous aspect" bank until `ari` is extended.

Classification legend: **ready** (clean blank, target table exists, drop-in
candidate for #312/313/314) · **needs-rewrite** (fixable issue noted) ·
**defer** (blocked on a verb or tense table that doesn't exist yet).
`validFor` drafts here are a starting point for #312–314, not a final
ruling — final sign-off is #316's native-speaker review, per the epic's own
framing of *why* that review exists.

### 1. NOR (by argument structure)

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Zuberoako dantzariak... etortzen dira | `etorri`/present/haiek | n/a | `['joan']` | **needs-rewrite** — uses the periphrastic habitual `etortzen dira`, not `etorri`'s synthetic present (`datoz`); no tense table backs the literal text. Rewrite to "...gure herrira datoz." |
| Gaur goizean mendizaleak... igotzen ari dira | `igo` (not in `VERBS`) | n/a | — | **defer** — base verb missing. Once added, this is itself an `ari`-continuous sentence (target `ari`, not `igo`'s own table). |
| Iaz, nire lagunak... ibili ziren | `ibili`/past/haiek | n/a | `['egon']`? | **ready**, validFor uncertain — "ibili ziren" (were busy/around) vs `egon`'s "zeuden" (were present) both plausibly fit "Danborradan"; flag for #316. |
| Gaur gurasoak... museora doaz | `joan`/present/haiek | n/a | `['etorri']` | **ready** — allative `-ra`, symmetric to `etorri`'s existing convention. |

### 2. NOR-NORK (by argument structure)

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Sustraik eta Uxuek... abesten dituzte | `abestu` (not in `VERBS`) | plural object ("bertso politak") — will need a `presentPlural`-style table | — | **defer** |
| Amonak marmitako epela prestatu du... | `prestatu` (not in `VERBS`) | singular object, fine | — | **defer** — this is the doc's own worked mapping example (see "Mapping to `VERBS`'s shape" above); keep as-is. |
| Atzo arratsaldean, pilotariek... jokatu zuten | `jokatu` (not in `VERBS`) | singular object, `zuten` is correctly the singular-object form | — | **defer** |
| Zuk udan... bisitatuko duzu | `bisitatu` (not in `VERBS`) | singular object, fine | — | **defer** |

### 3. NOR-NORI (by argument structure)

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Niri asko gustatzen zaizkit Tolosako babarrun gorriak | `gustatu`/presentPlural/ni | plural subject ("babarrun gorriak") correctly drives the `-zki-` plural table (`zaizkit`) | `['ahaztu']` (per `gustatu`'s existing convention) | **ready** |
| Umeei beldurra zaie... Basajaun | no matching verb — bare noun (`beldurra`) + `izan`-dative isn't any current `VERBS` entry's shape (not `gustatu`/`iruditu`/`ahaztu`, which all pair a verbal participle with the dative aux) | — | — | **needs-rewrite** — recast with an existing nor-nori-nork verb (e.g. `eman`: "...Basajaunek umeei beldurra ematen die") or defer until a dedicated entry exists. |
| Zuri ahaztu zitzaizkizun etxeko giltzak... | `ahaztu`/pastPlural/zu | plural object ("etxeko giltzak") correctly drives `-zki-` plural (`zitzaizkizun`) | `['gustatu']` (per `ahaztu`'s existing convention) | **ready** |

### 4. NOR-NORI-NORK (by argument structure)

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Nik zuri gaztelerazko liburua euskaratu dizut | `euskaratu` (not in `VERBS`) | singular object, fine | — | **defer** |
| Goizanek lagunei opari politak ekarri dizkie... | `ekarri` — but `ekarri`'s `VERBS` entry only models the 2-argument `nor-nork` synthetic forms (`dakar`-root); it has no `nor-nori-nork` (dative-recipient) variant, so `dizkie` doesn't fit its table at all | plural object ("opari politak"), but moot until the gap below is closed | — | **defer** — needs a `nor-nori-nork` `ekarri` variant (cf. the `-dative` pattern used for `itxaron`/`saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu`) before this can be adopted. |
| Gurasoek niri... kontatzen zizkidaten | `kontatu` (not in `VERBS`) | plural object ("ipuinak") | — | **defer** — also note the periphrastic habitual `-tzen` form (same `etorri`-style mismatch risk as item 1) for whoever adds `kontatu`. |
| Arrantzaleek jatetxeari... saldu zioten | `saldu-dative`/past | singular object, `zioten` correctly singular | `[]` (specific combo: fresh hake sold to a restaurant — no sibling `-dative` verb plausibly substitutes) | **ready** — verify `saldu-dative`'s past table covers this person before adopting. |

### Advanced-tenses bank (future/conditional/potential/imperative/continuous)

Of the 12 sentences here, only two are adoptable today; the rest are
**deferred on tense-table gating** (see above) rather than rejected on
content grounds — re-evaluate once #313 lands the relevant table.

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Datorren astean, baserritarrak... joango dira | `joan`/future/haiek | n/a | `['etorri']` | **ready** |
| Dirurik banu... joango nintzateke | conditional — no table | — | — | **defer** |
| Zuek gaur gauean... afal zaitezkete | `ahal` bank | — | — | **defer** (epic-level) |
| Une honetan, okinak... sartzen ari dira | `ari`/present/haiek | — | — | **defer** — `ari`'s table has no `haiek`; also the embedded `sartu` is used transitively here, but `VERBS`' `sartu` only models the intransitive `nor` sense — flag for whoever extends `ari`. |
| Guk denbora gehiago izan bagenu... txuleta jango genuen | `jan`? — actually the drilled form `genuen` is plain past, but `jan` doesn't appear; re-read: verb is `ukan`'s/host pattern — **clarify against source verb before adopting**; if literally `ukan`'s past, target `ukan`/past/gu | n/a | `[]` (tentative) | **needs-rewrite** — confirm which verb's past table this is meant to drill; as written it's ambiguous between a real `past` form and an unmodeled future-in-past conditional shape. |
| Ekar itzazu gazta eta Idiazabalgo ardoa... | imperative — no table outside `izan`/`ukan` | plural objects correctly drive `itzazu` | — | **defer** |
| Uda honetan, bidaiariei... gustatuko zaie Mundakako ezker olatua | `gustatu`/future/haiek | singular subject, correct singular table | `['ahaztu']` | **ready** |
| Guri txikitan... zekiokeen... | potential — no table | — | — | **defer** (also reads awkwardly; flag for rewrite regardless once potential exists) |
| Etxekoek niri txakolin botila bat irekiko didate... | `ireki` (not in `VERBS`) | singular object, fine | — | **defer** |
| Nik zuei istorio hau kontatuko nizueke... | conditional — no table; `kontatu` also not in `VERBS` | — | — | **defer** |
| Zizurkildarrek elizari kanpai berriak jartzen zizkioten... | `jarri` (not in `VERBS`); also past-continuous `ari` not modeled | plural object ("kanpai berriak") | — | **defer** |

### Extended-set bank (second NOR/NOR-NORK/NOR-NORI/NOR-NORI-NORK pass)

Same gating pattern as the advanced-tenses bank — almost everything here is
future/conditional/potential/imperative/continuous on a verb that either
doesn't exist yet or doesn't have that tense's table. Two items are ready
now; the rest defer for the reasons in each row.

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Bihar goizean korrikalariak... lehiatuko dira | `lehiatu` (not in `VERBS`) | — | — | **defer** |
| Haurrak Korrika festan... jantziko dira | `jantzi` (not in `VERBS`) | — | — | **defer** |
| Gazteak gaur gauean... egon daitezke / Turistak... igo daitezke | potential — no table outside `izan`/`ukan` | — | — | **defer** |
| Atera argituko balitz... joango ginateke / Zuek pilotari profesionalak bazinete... | conditional — no table | — | — | **defer** |
| Sukaldariak... garbitzen ari dira / Neska-mutilak... ikasten ari dira | `ari`/present, but person is `haiek` (not yet in `ari`'s table); embedded verbs (`garbitu`, `ikasi`'s habitual) need checking too | — | — | **defer** |
| Guk sarrerak lortu bagenitu... ikusiko genuen / Zuk... erosi bazenu... egingo zenuen | future-in-past conditional apodosis (`ikusiko genuen`, `egingo zenuen`) — distinct from any modeled tense; no verb's table covers this shape | — | — | **defer** |
| Eman iezaiozu... / Idatzi ezazue... | imperative — no table outside `izan`/`ukan` | `idatzi` plural object via `ezazue` (verify against an imperative table once one exists) | — | **defer** |
| Atzerriko ikasleei... irudituko zaie euskal kultura zaharra | `iruditu`/future/haiek | singular subject, correct singular table | `[]` (per `iruditu`'s established "needs a predicate" judgment) | **ready** |
| Zuri bihar... hurbilduko zaizu | `hurbildu` (not in `VERBS`) | — | — | **defer** |
| Niri pintxo merkeak... bururatu dakizkit / Gurasoei umeak... | potential — no table | plural subject ("pintxo merkeak") | — | **defer** |
| Zuei katu beltzak... balitzaizkizue... | conditional — no table | — | — | **defer** |
| Etxekoandreak bisitariei... zerbitzatzen die / Lagunek niri... oparitzen didate | `zerbitzatu`/`oparitu` (not in `VERBS`) | — | — | **defer** |
| Nik zuri... kontatuko dizkizut / Arrantzaleek herritarrei... ekarriko diote | `kontatu` not in `VERBS`; `ekarri` lacks a `nor-nori-nork` variant (same gap as the by-argument-structure bank above) | plural object ("sekretuak") for the first | — | **defer** |
| Guk zuei... esango bagenizue... / Sustraik epaimahaiari... kantatu balizkio... | conditional — no table | — | — | **defer** |

### Modal-verb bank (`nahi`, `behar`, `ahal`)

`behar`'s entire 11-sentence set is **already adopted** (`#267`,
paraphrased to `behar`'s singular-object table). `nahi`'s set is **partly
adopted**: 3 of 11 (`gu`/`zuek`/`haiek` infinitive-complement variants,
`#266`) are already in `src/data/verbs.js`; the rest are below. `ahal`'s
11 sentences stay **deferred wholesale** per the epic body (pending the
`ahal` unit) — not re-evaluated per-sentence.

| Sentence | Target | #285 | `validFor` draft | Status |
|---|---|---|---|---|
| Nik gaur gauean sagardotegira joan nahi dut | `nahi`/present/ni | n/a (infinitive complement) | `[]` | **ready** — not yet adopted (the `ni` slot currently only has the kafe/ur/liburu/opari-bat variants). |
| Gure lagunek... ikusi nahi dute | — | — | — | **✅ already adopted** (`nahi.sentences.present.haiek`) |
| Zuk Idiazabal gazta... erosi nahi zenuen atzoko azokan | `nahi` — no `past` table | — | — | **defer** |
| Guk udan... zeharkatu nahi dugu txalupaz | — | — | — | **✅ already adopted** (`nahi.sentences.present.gu`) |
| Arrantzaleek gaur gauean... itzuli nahi dute | `nahi`/present/haiek | n/a | `[]` | **ready** |
| Turistek... hartu nahi dituzte | `nahi`/presentPlural/haiek | plural object ("itsaslabarrak") correctly needs the plural table | `[]` | **ready** |
| Nik baserriko sukaldean... egiten ikasi nahi dut | `nahi`/present/ni | n/a (infinitive complement) | `[]` | **ready** |
| Zuek bertsolarien saioa... entzun nahi zenuten | `nahi` — no `past` table | — | — | **defer** |
| Guk gure aplikazioan... sartu nahi ditugu | `nahi`/presentPlural/gu | plural object ("aditz guztiak") correctly needs the plural table | `[]` | **ready** |
| Zuek Korrika festan... korrika egin nahi duzue | — | — | — | **✅ already adopted** (`nahi.sentences.present.zuek`) |
| Nik Baionako dendan... erosi nahi nituen | `nahi` — no `past` table | plural object ("jantzi tradizionalak") would also need the plural table once `past` exists | — | **defer** |

### Continuous aspect (`ari izan`) bank

`ari`'s table is `present`-only, `ni`/`zu`/`hura` (no `gu`/`zuek`/`haiek`,
no `past`/`future` at all — see above). Of the 15 sentences, exactly one
uses a person `ari` already supports.

| Sentence | Target | Status |
|---|---|---|
| Une honetan, sukaldariak... / Arrantzaleak... / Gu aplikazio eder bat garatzen ari gara / Dantzariak... / Gu Zumaia Flysch-eko... ibiltzen ari gara | `ari`/present/`haiek` or `gu` | **defer** — `ari` has no `gu`/`haiek` present cells yet. |
| Zu Idiazabal gazta eta txakolina dasten ari zara plazako azokan | `ari`/present/zu | **ready** — `validFor: []`. |
| All 6 past-continuous sentences | `ari`/past/* | **defer** — no `past` table at all. |
| All 3 future-continuous sentences | `ari`/future/* | **defer** — no `future` table at all. |

### Synthetic verbs (`aditz trinkoak`) bank

All eight verbs here (`egon`, `joan`, `etorri`, `ibili`, `ukan`/`edun`,
`jakin`, `eraman`, `ekarri`) are now in `VERBS` — a big change from this
bank's "none of these are yet in `VERBS`" framing (see top-of-section
note in the bank itself, now stale). `eraman`'s and `ekarri`'s sentences
here are **already adopted** (`#260`/`#261`, singularized to match their
singular-object tables) — #312/313 don't need to re-author those two.

**EGON** (5 present + 5 past) — all map cleanly onto `egon`'s existing
`present`/`past` tables, one sentence per person already used (`ni`/`hura`/
`gu`/`zuek` present, `hura`×2/`gu`×2 past — see bank text for the
person-to-sentence mapping). All **ready**, `validFor: []` throughout (same
locative-only judgment as `egon`'s existing `'Ni etxean ___.'` sentences —
no `nor`-cluster sibling takes a bare locative the way `egon` does).

**JOAN** (4 present + 5 past) — all **ready** except one. Allative/
directional sentences (`-ra`/`-rantz`) get `validFor: ['etorri']`,
symmetric to `etorri`'s own convention. One past sentence — "Ni bakarrik
nindoan basoan Basajaun ikusi nuenean" — uses the *locative* `-an`
("in the forest") rather than an allative, which is closer to `ibili`'s
territory ("I was wandering in the forest") than `joan`'s typical
directional sense; flag `validFor: ['ibili']` (tentative) for #316 rather
than the usual `['etorri']`.

**ETORRI** (4 present + 5 past) — mixed. Sentences with an explicit
allative (`'...plazara!'`, `'...etxera.'`) are **ready**, `validFor:
['joan']`. Sentences with only an ablative source (`'...frontonetik...'`,
`'...museotik...'`, `'...baserritik...'`, `'...partidatik...'`,
`'...janketatik...'`) are tentatively **ready** with `validFor: []` (no
sibling shares etorri's "coming from X, deictically toward here" reading
without also needing a destination) — flag for #316 confirmation. Two
sentences are frameless in the same way #125 already fixed for `etorri`'s
own table (no destination *or* source — "Zuberoako dantzariak... datoz"
above, and "Zuek korrika zentozten Korrika festan...", which has only a
bare locative `-an` with no directional cue): **needs-rewrite**, add a
destination per #125's existing pattern (e.g. "...datoz plazara").

**IBILI** (5 present + 5 past) — all **ready**. Most get `validFor: []`
(locative + purpose clause, e.g. "...bila" — "looking for X" — reads
oddly with static `egon`). Two locative-only sentences without a purpose
clause ("Surflariak... Mundakako olatuetan dabiltza.") are tentatively
`validFor: ['egon']` — flag for #316, since "they were in the waves"
(`egon`) is a plausible static alternate to "they were hanging around in
the waves" (`ibili`).

**UKAN/EDUN** (1 present + 1 past) — both **ready**. "Baserritarrek ardi
latxak dituzte mendian" needs the `presentPlural` table (plural object,
already correctly conjugated as `dituzte`); the past sentence is singular
and targets `past`/`gu` directly. `validFor` draft for both: `['nahi',
'eduki', 'ikusi', 'erosi', 'behar']`, per `ukan`'s established
concrete-object convention (sheep/wine bottle are both ownable/visible/
wantable/buyable/needable, same as the "book" worked example).

**JAKIN** (5 present + 5 past) — present sentences are all **ready**,
`validFor: []` (infinitive- or subordinate-clause complements, the same
shape as `nahi`'s "Zuk etorri ___?" exclusion — no `nor-nork` object-noun
sibling fits). Past sentences need individual handling:
- Two ("Gure gurasoek ez zekiten...", "Aitonak ez zekien...") are negated
  — categorize as `negativeSentences` entries, not plain `sentences`, when
  adopted.
- Two ("Guk bagenekien...", "Zuk bazenekien...") use the `ba-` prefix in
  its **emphatic-affirmative** sense (not the conditional "if" sense) —
  grammatical, but easy to misread as a conditional in a drill context;
  **needs-rewrite** to the plain form (`genekien`/`zenekien`) for
  learnability unless a future "emphatic ba-" unit wants this register
  deliberately.
- One ("Zuk bertsotan... bazenekien, zergatik...") is a genuine conditional
  question — **needs-rewrite**: the blank would have to isolate `zenekien`
  from its `ba-` prefix, which the current single-trailing-token blank
  convention doesn't support cleanly.

---

## Fodder verbs — high-frequency tier (#314, #319)

Unlike the banks above, these sentences weren't staged here first — #314
covers entirely new fodder verbs (added to `VERBS` by the now-closed
#318–#321 with schematic placeholder sentences), so there was no existing
bank entry to adopt. Authored directly in `src/data/verbs.js` and recorded
here per #314's "add new sentences to `SAMPLE_SENTENCES.md`" rule. All are
present/past pairs; `future` is picked up for free via the existing
`future ← present` reuse-by-reference loop. Every variant is tagged
`validFor: []` (each sentence's concrete real-world object/setting is
specific enough that no sibling verb's same-person form also fits).

Covers #319's 16 high-frequency verbs: `egin` (to do/make), `irakurri` (to
read), `idatzi` (to write), `ikasi` (to learn), `entzun` (to hear/listen),
`utzi` (to leave/let), `aurkitu` (to find), `bilatu` (to search for),
`galdu` (to lose), `jaso` (to receive), `saldu` (to sell), `itxaron` (to
wait for — plain transitive sense only, not `itxaron-dative`'s #307 recipient
sense), `sartu` (to enter), `atera` (to go/come out), `hasi` (to start),
`bizi-izan` (to live).

Representative examples (present tense, `ni`/`hura`):
- **egin** — *Nik domekan talo freskoak egiten ditut etxeko sukaldean.* (I
  make fresh talo at home in the kitchen on Sundays.) / *Hark intxaur-saltsa
  goxoa egiten du Eguberrietan.* (He/she makes tasty walnut sauce at
  Christmas.)
- **irakurri** — *Nik Bernardo Atxagaren eleberri bat irakurtzen dut
  gauero.* (I read a Bernardo Atxaga novel every night.)
- **idatzi** — *Nik gutun bat idazten dut amonarentzat.* (I write a letter
  for grandmother.)
- **ikasi** — *Nik euskara ikasten dut helduen ikastaroan.* (I learn Basque
  in the adult course.)
- **entzun** — *Nik txalaparta entzuten dut plazan.* (I hear the txalaparta
  in the square.)
- **utzi** — *Hark abarketak atarian uzten ditu.* (He/she leaves espadrilles
  at the doorway.)
- **aurkitu** — *Nik hondartzan kontxa polit bat aurkitzen dut.* (I find a
  pretty shell on the beach.)
- **bilatu** — *Hark basoan galdutako ardia bilatzen du.* (He/she searches
  for the lost sheep in the forest.)
- **galdu** — *Hark txapela jokoan galtzen du.* (He/she loses the beret in
  the game.)
- **jaso** — *Nik gutun bat Ameriketatik jasotzen dut.* (I receive a letter
  from the Americas.)
- **saldu** — *Hark gaztandegiko Idiazabal gazta saltzen du.* (He/she sells
  Idiazabal cheese from the dairy.)
- **itxaron** — *Nik tranbia geltokian itxaroten dut.* (I wait for the tram
  at the stop.)
- **sartu** — *Ni Gorbeiako aterpean sartzen naiz ekaitzetik.* (I take
  shelter in the Gorbeia refuge from the storm.)
- **atera** — *Ni Bilboko Casco Viejotik ateratzen naiz goizeko hamarretan.*
  (I leave Bilbao's Old Quarter at ten in the morning.)
- **hasi** — *Ni euskara ikastaroarekin hasten naiz irailean.* (I start the
  Basque course in September.)
- **bizi-izan** — *Ni Hondarribiko portu zaharretik gertu bizi naiz.* (I
  live near Hondarribia's old port.)

`saldu`/`itxaron`/`sartu`/`atera`/`hasi`/`bizi-izan` each have a sibling
`-dative` or distinct entry already in `VERBS` (`saldu-dative`,
`itxaron-dative`); only the plain transitive/NOR entries were touched here,
per #319's own scoping. `#320`/`#321`'s mid/low-frequency and academic/rare
tiers (the remaining ~30 fodder verbs from #314's full scope) are not yet
authored — tracked as a "Next steps" item below.

## Fodder verbs — mid/low-frequency tier (#314, #320)

Same approach as the high-frequency tier above: authored directly in
`src/data/verbs.js`, recorded here per #314's bank-extension rule. Present
and past pairs for all 18 of #320's verbs; `future` is free via the
`future ← present` reuse loop. Every variant tagged `validFor: []` (concrete
specific objects/settings, so no sibling's same-person form also fits).

Covers `eskatu` (to ask for/request), `galdetu` (to ask a question),
`adierazi` (to express/indicate), `bukatu`/`amaitu` (to finish), `gainditu`
(to pass/overcome), `bereiztu` (to distinguish/separate), `ezagutu` (to
know/meet), `sentitu` (to feel), `pentsatu` (to think), `sumatu` (to
sense/perceive), `ulertu` (to understand), `aztertu` (to examine/analyze),
`ukatu` (to deny), `batu` (to gather/join/add), `planteatu` (to pose/raise
an issue), and the two `nor`-only verbs `erori` (to fall) / `jaiki` (to get
up).

Representative examples (present tense, `ni`/`hura`):
- **eskatu** — *Nik mahai bat eskatzen dut jatetxean.* (I ask for a table at
  the restaurant.) / *Hark mailegua eskatzen du bankuan.* (He/she asks for a
  loan at the bank.)
- **galdetu** — *Nik ordua galdetzen dut geltokian.* (I ask the time at the
  station.)
- **adierazi** — *Nik nire iritzia adierazten dut bilkuran.* (I express my
  opinion at the meeting.)
- **ezagutu** — *Nik herri hau ondo ezagutzen dut.* (I know this town well.)
- **bereiztu** — *Hark egia gezurretik bereizten du erraz.* (He/she
  distinguishes truth from lies easily.)
- **gainditu** — *Nik azterketa gainditzen dut lehen saiakeran.* (I pass the
  exam on the first try.)
- **erori** — *Hura bizikletatik erortzen da bide zikinean.* (He/she falls
  off the bike on the muddy path.)
- **jaiki** — *Ni goizean goiz jaikitzen naiz lanera joateko.* (I get up
  early in the morning to go to work.)

## Fodder verbs — academic/rare tier (#314, #321/#404)

Same quality bar as the high/mid/low tiers above, but deliberately *not* the
same breadth: #314's own text only asks for "≥1 sentence each... one good
sentence is enough for exposure" on this tier, and `mode: 'recognition'`
(per `docs/LANGUAGE_DECISIONS.md`'s #321 entry) means a recognition-only
lesson never surfaces a second variant anyway — so the single existing
present/past frame per person was upgraded in place, not expanded into
arrays. An earlier pass (PR #403) had mistakenly called this tier "out of
scope" for #314 entirely, conflating "skip variety" with "skip quality";
#404 corrected that — see `docs/DECISIONS.md`.

Covers `hausnartu` (to reflect on/ponder), `argudiatu` (to argue a case),
`ondorioztatu` (to conclude/deduce), `gaitzetsi` (to condemn/reprehend),
`aldarrikatu` (to proclaim/declare), `plazaratu` (to bring to light/make
public), `sustatu` (to promote/foster), `bultzatu` (to push/drive forward),
`bermatu` (to guarantee/ensure), `babestu` (to protect), `ziurtatu` (to
ensure/make certain), and `borobildu` (to round off/finalize).

Representative examples (present tense, `ni`/`hura`):
- **hausnartu** — *Nik bizitzaren zentzuari buruz hausnartzen dut.* (I
  reflect on the meaning of life.) / *Hark bere etorkizunaz hausnartzen du.*
  (He/she reflects on his/her future.)
- **aldarrikatu** — *Nik nire askatasuna ozenki aldarrikatzen dut.* (I
  proclaim my freedom loudly.) / *Hark independentzia balkoitik
  aldarrikatzen du.* (He/she proclaims independence from the balcony.)
- **babestu** — *Nik basoa suteetatik babesten dut.* (I protect the forest
  from fires.) / *Hark herria ekaitzetik babesten du.* (He/she protects the
  town from the storm.)
- **borobildu** — *Nik akordioa azken xehetasunean borobiltzen dut.* (I
  round off the agreement on the last detail.) / *Hark eskaintza azkenean
  borobiltzen du.* (He/she finalizes the offer in the end.)

Plural placeholder objects from the original schematic frames (e.g.
`eskubideak`, `emaitzak`, `mehatxupeko espezieak`) were singularized during
this pass per the #285 number-agreement convention. Every `present`/`past`
variant across all 12 verbs is now tagged `validFor: []` (`past` entries
were previously bare untagged strings, same fix already applied to #320's
tier in PR #403).

## Coverage inventory (#313)

Audit of every `(verb, tense)` pair with a `conjugations` table beyond plain
present/past/future, cross-checked against whether `sentences` exists for
that tense (singular tables and `future`/`futurePlural` reused by reference
per the loops at the bottom of `src/data/verbs.js` count as covered).

**Adopted this pass:**
- `joan`/`etorri`/`ibili`'s `imperfectivePast` — the synthetic-verbs bank's
  "Past" examples for these three (see "Synthetic verbs" section above)
  actually drill this table, not `past`'s simple past — #312 missed this
  because it predates this cross-check. `etorri`'s one frameless item
  (`'Zuek korrika zentozten...'`) stays deferred to #316 (same bare-locative
  issue #125 already fixed elsewhere for `etorri`).
- `nahi`'s remaining modal-bank `present`/`presentPlural` "ready" items not
  yet in `src/data/verbs.js` (2 more `ni` infinitive-complements, 1 `haiek`
  infinitive-complement, `presentPlural.gu`/`presentPlural.haiek`).
- `gustatu`/`iruditu`'s two future-ready NOR-NORI items (placed in
  `present.haiek`, picked up by `future`'s reuse-by-reference, same pattern
  #312 used for `joan`'s future-ready item).
- `ari`'s one ready `present.zu` continuous item.
- A new `futurePlural ← presentPlural` reuse-by-reference loop (mirroring
  the existing `future ← present` one), extending `futurePlural` sentence
  coverage to every verb that already had `presentPlural` sentences
  (`ukan`, `nahi`, `esan`, `eman`, `gustatu`, `iruditu`, `ahaztu`) without
  hand-authoring duplicate text.

**Still form-only, with reasons (not bank-content gaps — structural):**
- `izan`/`ukan`'s `potential`/`baldintza`/`conditional`/`imperative` — these
  are the *only* verbs with these tables, but no bank sentence targets
  `izan`/`ukan` directly in these moods (the bank's conditional/potential/
  imperative examples all target other verbs — `joan`, `ahal`, the
  NOR-NORI-NORK cluster — that don't have the table yet, hence "no table"
  in the curation rows above). Nothing to adopt until a future bank pass
  writes `izan`/`ukan`-specific examples.
- `etorri`/`ikusi`'s `habitualPast` (periphrastic "I used to...") — no bank
  section covers this aspect at all yet.
- `jan`/`edan`/`erosi`/`hartu`/`ikusi`/`eduki`'s `futurePlural` — these never
  got `presentPlural` sentences in the first place (a presentPlural-bank gap,
  not specific to #313's advanced-tense scope), so there's nothing to alias.
- The `-dative` verbs' (`itxaron`/`saldu`/`utzi`/`adierazi`/`eskatu`/
  `galdetu`) `future` — none of these have *any* `sentences.present` yet
  (`saldu-dative` has only `past`, from #312); a present/past NOR-NORI-NORK
  gap predating #313, not an advanced-tense one.

**Explicitly out of scope per the epic body, not re-evaluated per-sentence:**
`ahal` (whole 11-sentence set deferred to its own pending unit) and the
causative (`-arazi`/`-erazi`) bank (blocked on Phase VI units +
`docs/VERB_COVERAGE.md` §6).

## Next steps (not yet done)

1. ~~Review/edit these for naturalness and any missing vocabulary gaps.~~ Done
   — see "Adoption-readiness curation (#311)" above for the per-sentence
   classification (`ready`/`needs-rewrite`/`defer`), `validFor` drafts, and
   #285 plural-object flags.
2. ~~Turn each `sentences[tense][person]` cell into an array of these
   variants in `src/App.jsx`'s `VERBS`, and update `generateQuestions`/
   `buildSpotErrorQuestion` (`src/lessonLogic.js`) to pick one variant at
   random per question.~~ Done for `izan`/`egon`/`ukan` present — see
   `docs/DECISIONS.md`.
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
   ~~Done for the "ready" present/past items targeting `egon`/`joan`/`etorri`/
   `ibili`/`ukan`/`jakin`/`gustatu`/`ahaztu`/`saldu-dative` (#312)~~ — see
   `docs/DECISIONS.md`'s "#312" entry. ~~Done for `joan`/`etorri`/`ibili`'s
   imperfectivePast cultural sentences, `nahi`'s remaining present/
   presentPlural items, `gustatu`/`iruditu`'s future-ready items, and `ari`'s
   one ready continuous item (#313)~~ — see "Coverage inventory (#313)"
   above and `docs/DECISIONS.md`'s "#313" entry. Still outstanding, deferred
   to #316's native-speaker review: `etorri`'s frameless past item, and
   `jakin`'s two `ba-`-emphatic past items plus one conditional-past item.
6. ~~The modal-verb bank pairs with Unit 2 (`nahi`...) and Units 14–16's
   `behar`/Geroa work~~ — `nahi`'s present/presentPlural-tense bank items are
   now fully adopted (#313); its `past`-tense items stay deferred (`nahi` has
   no `past` table). `ahal`'s sentences remain deferred wholesale per the
   epic body (pending the `ahal` unit) — not re-evaluated per-sentence; they
   would double as early `potential`-tense examples once that unit lands.
7. The causative bank pairs with the new Phase VI (Units 28-30,
   `LEARNING_JOURNEY.md`) — `docs/VERB_COVERAGE.md` §6 still needs the
   `-arazi`/`-erazi` conditioning rule sourced before any of these become
   `VERBS` entries.
8. ~~The `ari izan` continuous-aspect bank isn't yet placed in
   `LEARNING_JOURNEY.md`~~ — `ari`'s one ready `present.zu` item is adopted
   (#313); the rest stay deferred since `ari`'s table still has no `gu`/
   `zuek`/`haiek` cells and no `past`/`future` at all (a `LEARNING_JOURNEY.md`
   placement and a conjugation-table expansion, not a sentence-curation gap).
9. ~~The synthetic-verb (`aditz trinkoak`) bank covers `egon`, `joan`,
   `etorri`, `ibili`, `ukan`/`edun`, `jakin`, `eraman`, `ekarri` — none of
   these are yet in `VERBS` or `LEARNING_JOURNEY.md`~~ — all eight are now in
   `VERBS` with `present`/`past`/`future` cultural sentences (and `joan`/
   `etorri`/`ibili` additionally have `imperfectivePast` as of #313). The
   remaining synthetic-bank gaps are tracked individually elsewhere in this
   list (item 5's `imperfectivePast` deferrals, the `habitualPast`/advanced-
   tense items noted in the "Coverage inventory (#313)" section above) rather
   than as one open bank-adoption item.
10. ~~#314's high-frequency tier (#319's 16 verbs) and mid/low-frequency
    tier (#320's 18 verbs) are done~~ — see "Fodder verbs — high-frequency
    tier (#314, #319)" and "Fodder verbs — mid/low-frequency tier (#314,
    #320)" above. #321's academic/rare tier (12 verbs) is now done too (see
    "Fodder verbs — academic/rare tier (#314, #321/#404)" above) — all three
    tiers of #314's scope are complete, so #314 can close.
