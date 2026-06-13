// =============================================================================
// Verb data
//
// `type` separates synthetic verbs (conjugated directly, "aditz trinkoak")
// from periphrastic ones (participle + auxiliary, "aditz perifrastikoak"),
// so the UI can badge them differently once periphrastic verbs are added.
//
// `agreement` lists which arguments the verb marks on the finite form
// (nor = absolutive, nori = dative, nork = ergative) — the famous
// nor-nori-nork system. `ukan` is shown here in its citation paradigm,
// i.e. with a fixed 3rd-person-singular absolutive object ("it/him/her").
//
// `dialect` is a placeholder for future variants: a verb could later carry
// e.g. `dialectVariants: { bizkaiera: { conjugations: {...} } }` overrides
// without changing this shape.
//
// `sentences` (optional, by tense → person) gives an example sentence with
// `___` marking where the conjugated form belongs. It powers the
// "complete the sentence" question style — `generateQuestions` mixes those
// in alongside bare-form questions wherever a sentence is available, falling
// back to bare-form-only for verbs/persons that don't have one yet.
//
// `pronouns` + `pronounSentences` are the equivalent pair for a second
// "complete the sentence" flavour: filling in the correctly-declined personal
// pronoun (e.g. "Nik" for the ergative subject of `ukan`) rather than the verb
// form. `pronouns` gives the declined form for each grammatical person — the
// case depends on which argument that pronoun fills for this verb (absolutive
// for `izan`'s `nor` subject, ergative for `ukan`'s `nork` subject) — and
// `pronounSentences` gives a sentence with `___` marking where it goes, with
// the verb already spelled out.
//
// `negativeSentences` (optional, by tense → person) is the negative-statement
// counterpart of `sentences`: a sentence with `___` marking the conjugated
// form, but in negative word order — `ez` immediately before the verb, with
// "ez [verb]" fronted to right after the subject (e.g. "Ni ez ___ irakaslea."
// → "naiz"). Only present on verbs whose conjugated form is a single word
// that stays intact under negation (`izan`/`egon`/`ukan`/`joan`/`etorri`/
// `jakin`) — `nahi`/`ari`'s two-word forms ("nahi dut", "ari naiz") break
// apart under negation ("ez dut ... nahi", "ez naiz ari ...") and so don't fit
// this single-blank shape; see `docs/DECISIONS.md` (Unit 6). Powers the
// `negative`/`type-negative` question kinds, which only appear when a lesson
// opts in via `includeNegation` (see `generateQuestions`) — Unit 6's
// `unit-5-review-1`/`-2`/`-3` are the only lessons that currently do.
//
// Per `docs/LEARNING_JOURNEY.md`'s Phase I ("Survival Present"), every verb's
// first lesson is restricted to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` (and,
// much later, `hi`) are added together in Unit 7 ("Expansion"). `izan`/`egon`/
// `ukan`/`joan`/`etorri`'s `present` tables already contain all 6 persons (Unit
// 7 grew them in place — see `docs/DECISIONS.md`); their pre-Unit-7 lessons
// (`LESSONS` in `src/data/lessons.js`) use a `persons` filter to stay on the 3-person
// horizon instead (`docs/EXERCISE_ENGINE.md`, "Phase I's 3-person horizon",
// option (b)). Verbs whose first lesson is still pending (`nahi`/`jakin`/`ari`)
// simply have 3-person tables (option (a)) since there's nothing to expand yet.
// =============================================================================

export const VERBS = [
  {
    id: 'izan',
    verb: 'izan',
    meaning: { en: 'to be', es: 'ser / estar', eu: 'izan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'naiz', zu: 'zara', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
      past: { ni: 'nintzen', zu: 'zinen', hura: 'zen', gu: 'ginen', zuek: 'zineten', haiek: 'ziren' },
      future: {
        ni: 'izango naiz',
        zu: 'izango zara',
        hura: 'izango da',
        gu: 'izango gara',
        zuek: 'izango zarete',
        haiek: 'izango dira',
      },
    },
    sentences: {
      present: {
        ni: ['Ni irakaslea ___.', 'Ni ikaslea ___.', 'Ni aita ___.', 'Ni turista ___.', 'Ni langilea ___.'],
        zu: ['Zu ikaslea ___.', 'Zu irakaslea ___.', 'Zu ama ___.', 'Zu gidaria ___.', 'Zu auzokidea ___.'],
        hura: [
          'Hura medikua ___.',
          'Hura zuzendaria ___.',
          'Hura aitona ___.',
          'Hura bidaiaria ___.',
          'Hura saltzailea ___.',
          'Mikel irakaslea ___.',
          'Ane ikaslea ___.',
          'Txakurra handia ___.',
          'Katua beltza ___.',
          'Autoa berria ___.',
        ],
        gu: ['Gu ikasleak ___.', 'Gu irakasleak ___.', 'Gu lagunak ___.', 'Gu langileak ___.'],
        zuek: ['Zuek ikasleak ___.', 'Zuek irakasleak ___.', 'Zuek auzokideak ___.', 'Zuek gidariak ___.'],
        haiek: [
          'Haiek medikuak ___.',
          'Haiek zuzendariak ___.',
          'Haiek bidaiariak ___.',
          'Mikel eta Ane ikasleak ___.',
          'Txakurrak eta katuak handiak ___.',
        ],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ irakaslea naiz.',
        zu: '___ ikaslea zara.',
        hura: '___ medikua da.',
        gu: '___ ikasleak gara.',
        zuek: '___ irakasleak zarete.',
        haiek: '___ medikuak dira.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Ni ez ___ irakaslea.',
        zu: 'Zu ez ___ ikaslea.',
        hura: 'Hura ez ___ medikua.',
      },
    },
  },
  {
    id: 'egon',
    verb: 'egon',
    meaning: { en: 'to be (located / in a state)', es: 'estar (ubicación o estado)', eu: 'egon (norbait/zerbait non dagoen)' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nago', zu: 'zaude', hura: 'dago', gu: 'gaude', zuek: 'zaudete', haiek: 'daude' },
      past: {
        ni: 'nengoen',
        zu: 'zeunden',
        hura: 'zegoen',
        gu: 'geunden',
        zuek: 'zeundeten',
        haiek: 'zeuden',
      },
      future: {
        ni: 'egongo naiz',
        zu: 'egongo zara',
        hura: 'egongo da',
        gu: 'egongo gara',
        zuek: 'egongo zarete',
        haiek: 'egongo dira',
      },
    },
    sentences: {
      present: {
        ni: ['Ni etxean ___.', 'Ni ikasgelan ___.', 'Ni Bilbon ___.', 'Ni lanean ___.'],
        zu: ['Zu kalean ___.', 'Zu liburutegian ___.', 'Zu sukaldean ___.', 'Zu Donostian ___.', 'Zu dendan ___.'],
        hura: [
          'Hura eskolan ___.',
          'Hura patioan ___.',
          'Hura logelan ___.',
          'Hura Gasteizen ___.',
          'Hura kalean ___.',
          'Mikel eskolan ___.',
          'Ane etxean ___.',
          'Txakurra parkean ___.',
          'Katua sukaldean ___.',
          'Liburua mahai gainean ___.',
        ],
        gu: ['Gu etxean ___.', 'Gu lanean ___.', 'Gu Bilbon ___.', 'Gu liburutegian ___.'],
        zuek: ['Zuek kalean ___.', 'Zuek dendan ___.', 'Zuek Donostian ___.', 'Zuek ikasgelan ___.'],
        haiek: [
          'Haiek eskolan ___.',
          'Haiek kalean ___.',
          'Gurasoak etxean ___.',
          'Mikel eta Ane patioan ___.',
          'Liburuak mahai gainean ___.',
        ],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ etxean nago.',
        zu: '___ kalean zaude.',
        hura: '___ eskolan dago.',
        gu: '___ etxean gaude.',
        zuek: '___ kalean zaudete.',
        haiek: '___ eskolan daude.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Ni ez ___ etxean.',
        zu: 'Zu ez ___ kalean.',
        hura: 'Hura ez ___ eskolan.',
      },
    },
  },
  // Unit 2 ("Having, Wanting, and Knowing") — `ukan` present (with `zu` per
  // `docs/CONJUGATIONS.md` §3; `gu`/`zuek`/`haiek` added by Unit 7
  // "Expansion"). Its `past` table (Unit 8, "Looking Back I") is also `zu`-based
  // and full 6-person, per `docs/CONJUGATIONS.md` §3 — see
  // `docs/LANGUAGE_DECISIONS.md`.
  {
    id: 'ukan',
    verb: 'ukan',
    meaning: { en: 'to have', es: 'tener', eu: 'eduki' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'dut', zu: 'duzu', hura: 'du', gu: 'dugu', zuek: 'duzue', haiek: 'dute' },
      past: { ni: 'nuen', zu: 'zenuen', hura: 'zuen', gu: 'genuen', zuek: 'zenuten', haiek: 'zuten' },
      future: {
        ni: 'izango dut',
        zu: 'izango duzu',
        hura: 'izango du',
        gu: 'izango dugu',
        zuek: 'izango duzue',
        haiek: 'izango dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik liburu bat ___.', 'Nik arreba bat ___.', 'Nik txartel bat ___.', 'Nik bilera bat ___.'],
        zu: ['Zuk auto bat ___.', 'Zuk koaderno bat ___.', 'Zuk anaia bat ___.', 'Zuk mapa bat ___.'],
        hura: [
          'Berak etxe bat ___.',
          'Hark arkatz bat ___.',
          'Berak seme bat ___.',
          'Hark pasaporte bat ___.',
          'Mikelek liburu bat ___.',
          'Anek auto bat ___.',
          'Txakurrak hezur bat ___.',
          'Etxeak lorategi bat ___.',
        ],
        gu: ['Guk etxe bat ___.', 'Guk auto bat ___.', 'Guk bilera bat ___.', 'Guk txartel bat ___.'],
        zuek: ['Zuek liburu bat ___.', 'Zuek mapa bat ___.', 'Zuek koaderno bat ___.', 'Zuek arkatz bat ___.'],
        haiek: [
          'Haiek seme bat ___.',
          'Haiek pasaporte bat ___.',
          'Gurasoek etxe bat ___.',
          'Ikasleek liburu bat ___.',
        ],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ liburu bat dut.',
        zu: '___ auto bat duzu.',
        hura: '___ etxe bat du.',
        gu: '___ etxe bat dugu.',
        zuek: '___ liburu bat duzue.',
        haiek: '___ seme bat dute.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Nik ez ___ liburu bat.',
        zu: 'Zuk ez ___ auto bat.',
        hura: 'Berak ez ___ etxe bat.',
      },
    },
  },
  // `nahi` ("want") — an invariant particle + radical/infinitive + `ukan`,
  // not a lexical verb of its own (see `docs/VERB_COVERAGE.md` §5). Modeled
  // as its own `VERBS` entry — `type: 'periphrastic'` is the closest existing
  // badge for "auxiliary carries the conjugation alongside an invariant
  // element", even though `nahi` isn't a participle in the strict sense.
  // Rides `ukan`'s exact `dut`/`duzu`/`du` suffixes, so it costs nothing in
  // new suffix patterns.
  {
    id: 'nahi',
    verb: 'nahi izan',
    meaning: { en: 'to want', es: 'querer', eu: 'nahi izan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nahi dut', zu: 'nahi duzu', hura: 'nahi du' },
      future: { ni: 'nahiko dut', zu: 'nahiko duzu', hura: 'nahiko du' },
    },
    sentences: {
      present: {
        ni: ['Nik kafe bat ___.', 'Nik ur bat ___.', 'Nik liburu bat ___.', 'Nik opari bat ___.'],
        zu: ['Zuk etorri ___?', 'Zuk kafe bat ___?', 'Zuk liburu bat ___?', 'Zuk sagar bat ___?'],
        hura: ['Hark opari bat ___.', 'Mikelek kafe bat ___.', 'Anek liburu bat ___.', 'Katuak esne pixka bat ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark' },
    pronounSentences: {
      present: {
        ni: '___ kafe bat nahi dut.',
        zu: '___ etorri nahi duzu?',
        hura: '___ opari bat nahi du.',
      },
    },
  },
  // `jakin` ("to know a fact") — fully synthetic, sharing `ukan`'s
  // `-t`/`-zu`/∅ present suffix family (`dakit`/`dakizu`/`daki`), per
  // `docs/CONJUGATIONS.md` §7. Past has `hik`/`zuk`/`zuek` gaps, irrelevant
  // here (present-only, `ni`/`zu`/`hura`).
  {
    id: 'jakin',
    verb: 'jakin',
    meaning: { en: 'to know (a fact)', es: 'saber (un hecho)', eu: 'jakin (informazioa)' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'dakit', zu: 'dakizu', hura: 'daki' },
      future: { ni: 'jakingo dut', zu: 'jakingo duzu', hura: 'jakingo du' },
    },
    sentences: {
      present: {
        ni: ['Nik erantzuna ___.', 'Nik egia ___.', 'Nik sekretua ___.', 'Nik bidea ___.'],
        zu: ['Zuk egia ___.', 'Zuk erantzuna ___.', 'Zuk sekretua ___.', 'Zuk bidea ___.'],
        hura: ['Hark sekretua ___.', 'Mikelek erantzuna ___.', 'Irakasleak erantzun zuzena ___.', 'Txakurrak etxerako bidea ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark' },
    pronounSentences: {
      present: {
        ni: '___ erantzuna dakit.',
        zu: '___ egia dakizu.',
        hura: '___ sekretua daki.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Nik ez ___ erantzuna.',
        zu: 'Zuk ez ___ egia.',
        hura: 'Hark ez ___ sekretua.',
      },
    },
  },
  // Unit 4 ("Moving Around") — `joan` present (`noa`/`zoaz`/`doa`/`goaz`/
  // `zoazte`/`doaz`), per `docs/CONJUGATIONS.md` §6 (already has a `zu` row).
  // `gu`/`zuek`/`haiek` were added by Unit 7 ("Expansion").
  {
    id: 'joan',
    verb: 'joan',
    meaning: { en: 'to go', es: 'ir', eu: 'joan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'noa', zu: 'zoaz', hura: 'doa', gu: 'goaz', zuek: 'zoazte', haiek: 'doaz' },
      past: {
        ni: 'joan nintzen',
        zu: 'joan zinen',
        hura: 'joan zen',
        gu: 'joan ginen',
        zuek: 'joan zineten',
        haiek: 'joan ziren',
      },
      future: {
        ni: 'joango naiz',
        zu: 'joango zara',
        hura: 'joango da',
        gu: 'joango gara',
        zuek: 'joango zarete',
        haiek: 'joango dira',
      },
    },
    sentences: {
      present: {
        ni: ['Ni hondartzara ___.', 'Ni eskolara ___.', 'Ni lanera ___.', 'Ni dendara ___.'],
        zu: ['Zu eskolara ___.', 'Zu hondartzara ___.', 'Zu lanera ___.', 'Zu liburutegira ___.'],
        hura: [
          'Hura lanera ___.',
          'Hura eskolara ___.',
          'Hura hondartzara ___.',
          'Mikel dendara ___.',
          'Ane unibertsitatera ___.',
          'Txakurra parkera ___.',
        ],
        gu: ['Gu hondartzara ___.', 'Gu lanera ___.', 'Gu eskolara ___.', 'Gu dendara ___.'],
        zuek: ['Zuek eskolara ___.', 'Zuek hondartzara ___.', 'Zuek lanera ___.', 'Zuek parkera ___.'],
        haiek: ['Haiek lanera ___.', 'Haiek eskolara ___.', 'Haiek hondartzara ___.', 'Mikel eta Ane dendara ___.'],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ hondartzara noa.',
        zu: '___ eskolara zoaz.',
        hura: '___ lanera doa.',
        gu: '___ hondartzara goaz.',
        zuek: '___ eskolara zoazte.',
        haiek: '___ lanera doaz.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Ni ez ___ hondartzara.',
        zu: 'Zu ez ___ eskolara.',
        hura: 'Hura ez ___ lanera.',
      },
    },
  },
  // `etorri` present, same Unit 4 ("Moving Around") trim — `nator`/`zatoz`/
  // `dator`, per `docs/CONJUGATIONS.md` §6.
  {
    id: 'etorri',
    verb: 'etorri',
    meaning: { en: 'to come', es: 'venir', eu: 'etorri' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nator', zu: 'zatoz', hura: 'dator', gu: 'gatoz', zuek: 'zatozte', haiek: 'datoz' },
      past: {
        ni: 'etorri nintzen',
        zu: 'etorri zinen',
        hura: 'etorri zen',
        gu: 'etorri ginen',
        zuek: 'etorri zineten',
        haiek: 'etorri ziren',
      },
      future: {
        ni: 'etorriko naiz',
        zu: 'etorriko zara',
        hura: 'etorriko da',
        gu: 'etorriko gara',
        zuek: 'etorriko zarete',
        haiek: 'etorriko dira',
      },
    },
    sentences: {
      present: {
        ni: ['Ni etxera ___.', 'Ni eskolara ___.', 'Ni orain ___.', 'Ni gaur ___.'],
        zu: ['Zu bihar ___.', 'Zu etxera ___.', 'Zu orain ___.', 'Zu gaur ___.'],
        hura: ['Hura orain ___.', 'Hura etxera ___.', 'Hura bihar ___.', 'Mikel gaur ___.', 'Ane etxera ___.', 'Txakurra orain ___.'],
        gu: ['Gu etxera ___.', 'Gu orain ___.', 'Gu gaur ___.', 'Gu bihar ___.'],
        zuek: ['Zuek bihar ___.', 'Zuek etxera ___.', 'Zuek orain ___.', 'Zuek gaur ___.'],
        haiek: ['Haiek orain ___.', 'Haiek etxera ___.', 'Haiek bihar ___.', 'Mikel eta Ane gaur ___.'],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ etxera nator.',
        zu: '___ bihar zatoz.',
        hura: '___ orain dator.',
        gu: '___ etxera gatoz.',
        zuek: '___ bihar zatozte.',
        haiek: '___ orain datoz.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Ni ez ___ etxera.',
        zu: 'Zu ez ___ bihar.',
        hura: 'Hura ez ___ orain.',
      },
    },
  },
  // Unit 5 ("The Immediate Continuous") — `ari` ("in the process of") +
  // imperfective participle + `izan`. Modeled as its own `VERBS` entry like
  // `nahi`/`jakin`: conjugates *exactly* like `izan`'s present
  // (`naiz`/`zara`/`da`, per `docs/VERB_COVERAGE.md` §5), so `agreement:
  // ['nor']` and unmarked `pronouns` (no ergative `-k`) — the construction
  // always takes `izan`, regardless of the lexical verb's own transitivity.
  {
    id: 'ari',
    verb: 'ari izan',
    meaning: { en: 'to be busy (doing something)', es: 'estar (haciendo algo)', eu: 'ari izan' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'ari naiz', zu: 'ari zara', hura: 'ari da' },
    },
    sentences: {
      present: {
        ni: ['Ni jaten ___.', 'Ni lan egiten ___.', 'Ni ikasten ___.', 'Ni idazten ___.'],
        zu: ['Zu zer ___?', 'Zu zer egiten ___?', 'Zu irakurtzen ___?'],
        hura: [
          'Hura irakurtzen ___.',
          'Hura jaten ___.',
          'Hura lan egiten ___.',
          'Mikel ikasten ___.',
          'Ane idazten ___.',
          'Txakurra jolasten ___.',
          'Katua lo egiten ___.',
          'Hura telefonoz hizketan ___.',
        ],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
    pronounSentences: {
      present: {
        ni: '___ jaten ari naiz.',
        zu: '___ lanean ari zara.',
        hura: '___ irakurtzen ari da.',
      },
    },
  },
  // Unit 10 ("Daily Routine (Transitive)") — first Phase II verbs, so per the
  // Person-Expansion Rule (`docs/LEARNING_JOURNEY.md`) these start at the full
  // 6-person grid from their first lesson, no separate expansion pass needed.
  // `jan`/`edan`/`erosi`/`ikusi` are all periphrastic `nor-nork` verbs (object
  // fixed to `hura`, like `ukan`/`nahi`/`jakin`): imperfective participle
  // (`jaten`/`edaten`/`erosten`/`ikusten`) + `ukan`'s present auxiliary
  // (`dut`/`duzu`/`du`/`dugu`/`duzue`/`dute`), per `docs/CONJUGATIONS.md` §7's
  // "Present (oraina)" columns. `ikusi` (defined a few entries below) shares
  // this shape but was pulled forward into Unit 3 as Phase I's first
  // periphrastic verb. No `negativeSentences` on any of these — same as
  // `nahi`/`ari`, these two-word forms break apart under negation.
  {
    id: 'jan',
    verb: 'jan',
    meaning: { en: 'to eat', es: 'comer', eu: 'jan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'jaten dut',
        zu: 'jaten duzu',
        hura: 'jaten du',
        gu: 'jaten dugu',
        zuek: 'jaten duzue',
        haiek: 'jaten dute',
      },
      past: {
        ni: 'jan nuen',
        zu: 'jan zenuen',
        hura: 'jan zuen',
        gu: 'jan genuen',
        zuek: 'jan zenuten',
        haiek: 'jan zuten',
      },
      future: {
        ni: 'jango dut',
        zu: 'jango duzu',
        hura: 'jango du',
        gu: 'jango dugu',
        zuek: 'jango duzue',
        haiek: 'jango dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik sagarra ___.', 'Nik ogia ___.', 'Nik tortilla ___.'],
        zu: ['Zuk fruta ___?', 'Zuk arroza ___.'],
        hura: ['Hark taloa ___.', 'Mikelek pizza ___.', 'Anek entsalada ___.', 'Umeak gaztaina ___.'],
        gu: ['Guk arroza ___.', 'Guk ogitartekoa ___.'],
        zuek: ['Zuek fruta ___?', 'Zuek taloa ___.'],
        haiek: ['Haiek pastela ___.', 'Gurasoek arroza ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ sagarra jaten dut.',
        zu: '___ fruta jaten duzu?',
        hura: '___ taloa jaten du.',
        gu: '___ arroza jaten dugu.',
        zuek: '___ fruta jaten duzue?',
        haiek: '___ pastela jaten dute.',
      },
    },
  },
  {
    id: 'edan',
    verb: 'edan',
    meaning: { en: 'to drink', es: 'beber', eu: 'edan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'edaten dut',
        zu: 'edaten duzu',
        hura: 'edaten du',
        gu: 'edaten dugu',
        zuek: 'edaten duzue',
        haiek: 'edaten dute',
      },
      past: {
        ni: 'edan nuen',
        zu: 'edan zenuen',
        hura: 'edan zuen',
        gu: 'edan genuen',
        zuek: 'edan zenuten',
        haiek: 'edan zuten',
      },
      future: {
        ni: 'edango dut',
        zu: 'edango duzu',
        hura: 'edango du',
        gu: 'edango dugu',
        zuek: 'edango duzue',
        haiek: 'edango dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik ura ___.', 'Nik esnea ___.', 'Nik zukua ___.'],
        zu: ['Zuk ardoa ___?', 'Zuk kafea ___.'],
        hura: ['Hark sagardoa ___.', 'Mikelek tea ___.', 'Anek ura ___.', 'Katuak esnea ___.'],
        gu: ['Guk ura ___.', 'Guk kafea ___.'],
        zuek: ['Zuek zukua ___?', 'Zuek ardoa ___.'],
        haiek: ['Haiek garagardoa ___.', 'Lagunek sagardoa ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ ura edaten dut.',
        zu: '___ kafea edaten duzu.',
        hura: '___ sagardoa edaten du.',
        gu: '___ ura edaten dugu.',
        zuek: '___ ardoa edaten duzue.',
        haiek: '___ garagardoa edaten dute.',
      },
    },
  },
  {
    id: 'erosi',
    verb: 'erosi',
    meaning: { en: 'to buy', es: 'comprar', eu: 'erosi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'erosten dut',
        zu: 'erosten duzu',
        hura: 'erosten du',
        gu: 'erosten dugu',
        zuek: 'erosten duzue',
        haiek: 'erosten dute',
      },
      past: {
        ni: 'erosi nuen',
        zu: 'erosi zenuen',
        hura: 'erosi zuen',
        gu: 'erosi genuen',
        zuek: 'erosi zenuten',
        haiek: 'erosi zuten',
      },
      future: {
        ni: 'erosiko dut',
        zu: 'erosiko duzu',
        hura: 'erosiko du',
        gu: 'erosiko dugu',
        zuek: 'erosiko duzue',
        haiek: 'erosiko dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik liburu bat ___.', 'Nik ogia ___.', 'Nik jaka berri bat ___.'],
        zu: ['Zuk sagarrak ___?', 'Zuk diskoa ___.'],
        hura: ['Hark autoa ___.', 'Mikelek opari bat ___.', 'Anek etxe bat ___.', 'Saltzaileak fruta ___.'],
        gu: ['Guk etxe bat ___.', 'Guk txartelak ___.'],
        zuek: ['Zuek opariak ___?', 'Zuek liburuak ___.'],
        haiek: ['Haiek autoa ___.', 'Gurasoek etxe bat ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ liburu bat erosten dut.',
        zu: '___ diskoa erosten duzu.',
        hura: '___ autoa erosten du.',
        gu: '___ etxe bat erosten dugu.',
        zuek: '___ liburuak erosten duzue.',
        haiek: '___ autoa erosten dute.',
      },
    },
  },
  {
    id: 'ikusi',
    verb: 'ikusi',
    meaning: { en: 'to see', es: 'ver', eu: 'ikusi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ikusten dut',
        zu: 'ikusten duzu',
        hura: 'ikusten du',
        gu: 'ikusten dugu',
        zuek: 'ikusten duzue',
        haiek: 'ikusten dute',
      },
      past: {
        ni: 'ikusi nuen',
        zu: 'ikusi zenuen',
        hura: 'ikusi zuen',
        gu: 'ikusi genuen',
        zuek: 'ikusi zenuten',
        haiek: 'ikusi zuten',
      },
      future: {
        ni: 'ikusiko dut',
        zu: 'ikusiko duzu',
        hura: 'ikusiko du',
        gu: 'ikusiko dugu',
        zuek: 'ikusiko duzue',
        haiek: 'ikusiko dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik filma ___.', 'Nik mendia ___.', 'Nik zerua ___.'],
        zu: ['Zuk hori ___?', 'Zuk Mikel ___?'],
        hura: ['Hark itsasoa ___.', 'Anek filma ___.', 'Irakasleak ikasleak ___.', 'Txakurrak katua ___.'],
        gu: ['Guk itsasoa ___.', 'Guk filma ___.'],
        zuek: ['Zuek hori ___?', 'Zuek mendia ___?'],
        haiek: ['Haiek filma ___.', 'Gurasoek etxea ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ filma ikusten dut.',
        zu: '___ hori ikusten duzu?',
        hura: '___ itsasoa ikusten du.',
        gu: '___ itsasoa ikusten dugu.',
        zuek: '___ mendia ikusten duzue?',
        haiek: '___ filma ikusten dute.',
      },
    },
  },
  // Unit 11 ("Physical States & Possessions", Phase II). `eduki` ("to have/
  // hold physically") is a synthetic nor-nork verb riding the same
  // `-t`/`-zu`/∅/`-gu`/`-zue`/`-te` suffix family as `ukan`
  // (`daukat`/`daukazu`/`dauka`/`daukagu`/`daukazue`/`daukate`, object fixed
  // `hura`), per `docs/CONJUGATIONS.md` §7 — full 6-person grid from its
  // first lesson per the Person-Expansion Rule. `ibili` ("to walk around /
  // be doing") is a synthetic nor verb (`nabil`/`zabiltza`/`dabil`/
  // `gabiltza`/`zabiltzate`/`dabiltza`), same shape as `joan`/`etorri`. Both
  // are single-word forms that stay intact under negation, so both get
  // `negativeSentences` like `izan`/`egon`/`ukan`/`joan`/`etorri`/`jakin`.
  {
    id: 'eduki',
    verb: 'eduki',
    meaning: { en: 'to have / hold (physically)', es: 'tener / sostener (físicamente)', eu: 'eduki' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: { ni: 'daukat', zu: 'daukazu', hura: 'dauka', gu: 'daukagu', zuek: 'daukazue', haiek: 'daukate' },
      past: {
        ni: 'neukan',
        zu: 'zeneukan',
        hura: 'zeukan',
        gu: 'geneukan',
        zuek: 'zeneukaten',
        haiek: 'zeukaten',
      },
      future: {
        ni: 'edukiko dut',
        zu: 'edukiko duzu',
        hura: 'edukiko du',
        gu: 'edukiko dugu',
        zuek: 'edukiko duzue',
        haiek: 'edukiko dute',
      },
    },
    sentences: {
      present: {
        ni: ['Nik giltza poltsikoan ___.', 'Nik dirua eskuan ___.', 'Nik liburu bat eskuan ___.'],
        zu: ['Zuk giltza poltsikoan ___?', 'Zuk telefonoa eskuan ___.'],
        hura: [
          'Hark giltza poltsikoan ___.',
          'Mikelek dirua eskuan ___.',
          'Anek liburua eskuan ___.',
          'Umeak jostailua eskuan ___.',
        ],
        gu: ['Guk giltza poltsikoan ___.', 'Guk dirua eskuan ___.'],
        zuek: ['Zuek giltza poltsikoan ___?', 'Zuek txartela eskuan ___.'],
        haiek: ['Haiek giltza poltsikoan ___.', 'Gurasoek dirua eskuan ___.'],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ giltza poltsikoan daukat.',
        zu: '___ telefonoa eskuan daukazu.',
        hura: '___ dirua eskuan dauka.',
        gu: '___ giltza poltsikoan daukagu.',
        zuek: '___ txartela eskuan daukazue.',
        haiek: '___ giltza poltsikoan daukate.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Nik ez ___ giltza poltsikoan.',
        zu: 'Zuk ez ___ dirua eskuan.',
        hura: 'Hark ez ___ liburua eskuan.',
      },
    },
  },
  {
    id: 'ibili',
    verb: 'ibili',
    meaning: { en: 'to walk around / be doing', es: 'andar / estar haciendo', eu: 'ibili' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'nabil', zu: 'zabiltza', hura: 'dabil', gu: 'gabiltza', zuek: 'zabiltzate', haiek: 'dabiltza' },
      past: {
        ni: 'ibili nintzen',
        zu: 'ibili zinen',
        hura: 'ibili zen',
        gu: 'ibili ginen',
        zuek: 'ibili zineten',
        haiek: 'ibili ziren',
      },
      future: {
        ni: 'ibiliko naiz',
        zu: 'ibiliko zara',
        hura: 'ibiliko da',
        gu: 'ibiliko gara',
        zuek: 'ibiliko zarete',
        haiek: 'ibiliko dira',
      },
    },
    sentences: {
      present: {
        ni: ['Ni kalean ___.', 'Ni oinez ___.', 'Ni parkean ___.'],
        zu: ['Zu non ___?', 'Zu lanean ___.'],
        hura: ['Hura kalean ___.', 'Mikel parkean ___.', 'Ane oinez ___.', 'Txakurra etxean ___.'],
        gu: ['Gu kalean ___.', 'Gu oinez ___.'],
        zuek: ['Zuek non ___?', 'Zuek parkean ___.'],
        haiek: ['Haiek kalean ___.', 'Mikel eta Ane oinez ___.'],
      },
    },
    pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ kalean nabil.',
        zu: '___ lanean zabiltza.',
        hura: '___ kalean dabil.',
        gu: '___ kalean gabiltza.',
        zuek: '___ parkean zabiltzate.',
        haiek: '___ kalean dabiltza.',
      },
    },
    negativeSentences: {
      present: {
        ni: 'Ni ez ___ kalean.',
        zu: 'Zu ez ___ lanean.',
        hura: 'Hura ez ___ kalean.',
      },
    },
  },
]

// Units 14-17 ("Intentions & Future Actions") gave every verb above (except
// `ari`, see `docs/LANGUAGE_DECISIONS.md`) a `conjugations.future` table. The blank
// in a `sentences`/`pronounSentences` template doesn't depend on tense — "Ni
// irakaslea ___." fills equally well with `naiz` (present) or `izango naiz`
// (future) — so rather than duplicate every present-tense sentence array
// under a new `future` key, verbs with a `future` table simply reuse their
// `present` ones by reference.
for (const verb of VERBS) {
  if (!verb.conjugations.future) continue
  if (verb.sentences?.present) verb.sentences.future = verb.sentences.present
  if (verb.pronounSentences?.present) verb.pronounSentences.future = verb.pronounSentences.present
}

// "Looking Back" units (8/9/12/13) give `izan`/`egon`/`ukan`/`joan`/`etorri`/
// `ikusi`/`jan`/`edan`/`erosi`/`eduki`/`ibili` a `conjugations.past` table —
// same sentence-reuse rationale as the future loop above: the blank doesn't
// depend on tense, so verbs with a `past` table reuse their `present`
// sentences/pronounSentences by reference.
for (const verb of VERBS) {
  if (!verb.conjugations.past) continue
  if (verb.sentences?.present) verb.sentences.past = verb.sentences.present
  if (verb.pronounSentences?.present) verb.pronounSentences.past = verb.pronounSentences.present
}

// Only single-word past forms (`nintzen`, `zegoen`, `zuen`, `zeukan`, ...)
// stay intact under `ez`-negation the same way their present forms do —
// joan/etorri/ikusi/jan/edan/erosi/ibili's past is periphrastic
// (`joan nintzen`, `ikusi nuen`, ...), and negation fronts the auxiliary
// with different word order, same reason those verbs lack
// `negativeSentences` for the present.
const SINGLE_WORD_PAST_NEGATION = ['izan', 'egon', 'ukan', 'eduki']
for (const verb of VERBS) {
  if (!verb.conjugations.past || !SINGLE_WORD_PAST_NEGATION.includes(verb.id)) continue
  if (verb.negativeSentences?.present) verb.negativeSentences.past = verb.negativeSentences.present
}

// Maps grammatical persons / tenses / verb types / agreement roles to the
// translation keys their UI labels live under (`src/i18n/translations.js`) —
// looked up via `t()` at render time so labels follow the interface language.
// `basque`/`basqueLabel`/the NOR/NORI/NORK `label`s themselves are Basque
// grammar terms, shown as-is regardless of interface language.
export const PERSON_LABEL_KEYS = {
  ni: 'personNi',
  hi: 'personHi',
  zu: 'personZu',
  hura: 'personHura',
  gu: 'personGu',
  zuek: 'personZuek',
  haiek: 'personHaiek',
}

export const TENSE_META = {
  present: { labelKey: 'tensePresent', basque: 'oraina' },
  past: { labelKey: 'tensePast', basque: 'lehena' },
  future: { labelKey: 'tenseFuture', basque: 'geroa' },
}

export const TYPE_META = {
  synthetic: { labelKey: 'typeSynthetic', basqueLabel: 'trinkoa', className: 'bg-indigo-100 text-indigo-700' },
  periphrastic: { labelKey: 'typePeriphrastic', basqueLabel: 'perifrastikoa', className: 'bg-rose-100 text-rose-700' },
}

export const AGREEMENT_META = {
  nor: { label: 'NOR', titleKey: 'agreementNorTitle', className: 'bg-blue-100 text-blue-700' },
  nori: { label: 'NORI', titleKey: 'agreementNoriTitle', className: 'bg-purple-100 text-purple-700' },
  nork: { label: 'NORK', titleKey: 'agreementNorkTitle', className: 'bg-amber-100 text-amber-700' },
}

export const DIALECT_LABELS = {
  batua: 'Batua',
}
