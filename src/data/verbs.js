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
    // Every variant here is a predicate-nominal/adjective frame ("Ni
    // irakaslea ___." = "I am a teacher", "Txakurra handia ___." = "The dog is
    // big") — none of egon/joan/etorri's locative/allative forms fit a bare
    // predicate this way, so every variant gets `validFor: []` (#124).
    sentences: {
      present: {
        ni: [
          { text: 'Ni irakaslea ___.', validFor: [] },
          { text: 'Ni ikaslea ___.', validFor: [] },
          { text: 'Ni aita ___.', validFor: [] },
          { text: 'Ni turista ___.', validFor: [] },
          { text: 'Ni langilea ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zu ikaslea ___.', validFor: [] },
          { text: 'Zu irakaslea ___.', validFor: [] },
          { text: 'Zu ama ___.', validFor: [] },
          { text: 'Zu gidaria ___.', validFor: [] },
          { text: 'Zu auzokidea ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hura medikua ___.', validFor: [] },
          { text: 'Hura zuzendaria ___.', validFor: [] },
          { text: 'Hura aitona ___.', validFor: [] },
          { text: 'Hura bidaiaria ___.', validFor: [] },
          { text: 'Hura saltzailea ___.', validFor: [] },
          { text: 'Mikel irakaslea ___.', validFor: [] },
          { text: 'Ane ikaslea ___.', validFor: [] },
          { text: 'Txakurra handia ___.', validFor: [] },
          { text: 'Katua beltza ___.', validFor: [] },
          { text: 'Autoa berria ___.', validFor: [] },
        ],
        gu: [
          { text: 'Gu ikasleak ___.', validFor: [] },
          { text: 'Gu irakasleak ___.', validFor: [] },
          { text: 'Gu lagunak ___.', validFor: [] },
          { text: 'Gu langileak ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek ikasleak ___.', validFor: [] },
          { text: 'Zuek irakasleak ___.', validFor: [] },
          { text: 'Zuek auzokideak ___.', validFor: [] },
          { text: 'Zuek gidariak ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek medikuak ___.', validFor: [] },
          { text: 'Haiek zuzendariak ___.', validFor: [] },
          { text: 'Haiek bidaiariak ___.', validFor: [] },
          { text: 'Mikel eta Ane ikasleak ___.', validFor: [] },
          { text: 'Txakurrak eta katuak handiak ___.', validFor: [] },
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
        ni: { text: 'Ni ez ___ irakaslea.', validFor: [] },
        zu: { text: 'Zu ez ___ ikaslea.', validFor: [] },
        hura: { text: 'Hura ez ___ medikua.', validFor: [] },
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
    // Every variant here is a locative `-an`/`-en` frame ("Ni etxean ___." =
    // "I am at home") — izan doesn't take a bare locative this way, and
    // joan/etorri need an allative (`-ra`/`-tik`), not a locative, so every
    // variant gets `validFor: []` (#124, see docs/SENTENCE_FRAMES.md worked
    // example 1).
    sentences: {
      present: {
        ni: [
          { text: 'Ni etxean ___.', validFor: [] },
          { text: 'Ni ikasgelan ___.', validFor: [] },
          { text: 'Ni Bilbon ___.', validFor: [] },
          { text: 'Ni lanean ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zu kalean ___.', validFor: [] },
          { text: 'Zu liburutegian ___.', validFor: [] },
          { text: 'Zu sukaldean ___.', validFor: [] },
          { text: 'Zu Donostian ___.', validFor: [] },
          { text: 'Zu dendan ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hura eskolan ___.', validFor: [] },
          { text: 'Hura patioan ___.', validFor: [] },
          { text: 'Hura logelan ___.', validFor: [] },
          { text: 'Hura Gasteizen ___.', validFor: [] },
          { text: 'Hura kalean ___.', validFor: [] },
          { text: 'Mikel eskolan ___.', validFor: [] },
          { text: 'Ane etxean ___.', validFor: [] },
          { text: 'Txakurra parkean ___.', validFor: [] },
          { text: 'Katua sukaldean ___.', validFor: [] },
          { text: 'Liburua mahai gainean ___.', validFor: [] },
        ],
        gu: [
          { text: 'Gu etxean ___.', validFor: [] },
          { text: 'Gu lanean ___.', validFor: [] },
          { text: 'Gu Bilbon ___.', validFor: [] },
          { text: 'Gu liburutegian ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek kalean ___.', validFor: [] },
          { text: 'Zuek dendan ___.', validFor: [] },
          { text: 'Zuek Donostian ___.', validFor: [] },
          { text: 'Zuek ikasgelan ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek eskolan ___.', validFor: [] },
          { text: 'Haiek kalean ___.', validFor: [] },
          { text: 'Gurasoak etxean ___.', validFor: [] },
          { text: 'Mikel eta Ane patioan ___.', validFor: [] },
          { text: 'Liburuak mahai gainean ___.', validFor: [] },
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
        ni: { text: 'Ni ez ___ etxean.', validFor: [] },
        zu: { text: 'Zu ez ___ kalean.', validFor: [] },
        hura: { text: 'Hura ez ___ eskolan.', validFor: [] },
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. Concrete/ownable/visible
    // objects (book, car, pencil, ticket, passport, map, house, bone) admit
    // `nahi`/`eduki`/`ikusi` per the worked "book" example; kinship objects
    // (sister/brother/son) admit `nahi`/`eduki` but not `ikusi` (an
    // indefinite "a sister" isn't naturally "seen"); non-agentive-subject or
    // abstract objects (a meeting, a house "having" a garden) admit only
    // `eduki` (per the "denbora"/time worked example) or nothing.
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Nik arreba bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Nik txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Nik bilera bat ___.', validFor: ['eduki'] },
        ],
        zu: [
          { text: 'Zuk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Zuk koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Zuk anaia bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Zuk mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
        ],
        hura: [
          { text: 'Berak etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Hark arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Berak seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Hark pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Mikelek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Anek auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Txakurrak hezur bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Etxeak lorategi bat ___.', validFor: ['eduki'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Guk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Guk bilera bat ___.', validFor: ['eduki'] },
          { text: 'Guk txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
        ],
        zuek: [
          { text: 'Zuek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Zuek mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Zuek koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Zuek arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
        ],
        haiek: [
          { text: 'Haiek seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Haiek pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Gurasoek etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Ikasleek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
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
        ni: { text: 'Nik ez ___ liburu bat.', validFor: ['nahi', 'eduki', 'ikusi'] },
        zu: { text: 'Zuk ez ___ auto bat.', validFor: ['nahi', 'eduki', 'ikusi'] },
        hura: { text: 'Berak ez ___ etxe bat.', validFor: ['nahi', 'eduki', 'ikusi'] },
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. Concrete/ownable/visible
    // objects (coffee, water, book, gift, apple, milk) admit `ukan`/`eduki`/
    // `ikusi` — same "book" cluster as `ukan`'s worked example, including the
    // `'Katuak esne pixka bat ___.'` case that originally surfaced this
    // issue (#114). `'Zuk etorri ___?'` ("do you want to come?") takes an
    // infinitive complement, not an object noun — no `nor-nork` sibling's
    // form fits, so `validFor: []`.
    sentences: {
      present: {
        ni: [
          { text: 'Nik kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Nik ur bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Nik liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Nik opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
        ],
        zu: [
          { text: 'Zuk etorri ___?', validFor: [] },
          { text: 'Zuk kafe bat ___?', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Zuk liburu bat ___?', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Zuk sagar bat ___?', validFor: ['ukan', 'eduki', 'ikusi'] },
        ],
        hura: [
          { text: 'Hark opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Mikelek kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Anek liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
          { text: 'Katuak esne pixka bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
        ],
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. `jakin`'s candidates are
    // `ikusi`/`nahi` only (`ukan`/`eduki` are #114's confirmed-wrong pairs for
    // `jakin`, so never listed). "Erantzuna"/"egia"/"erantzun zuzena" (answer,
    // truth — things that can be seen written down, or wanted) admit both;
    // "bidea"/"etxerako bidea" (the way/route — visible but not "wanted" as
    // such) admit only `ikusi`; "sekretua" (a secret — wantable but not
    // typically "seen") admits only `nahi`.
    sentences: {
      present: {
        ni: [
          { text: 'Nik erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik sekretua ___.', validFor: ['nahi'] },
          { text: 'Nik bidea ___.', validFor: ['ikusi'] },
        ],
        zu: [
          { text: 'Zuk egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk sekretua ___.', validFor: ['nahi'] },
          { text: 'Zuk bidea ___.', validFor: ['ikusi'] },
        ],
        hura: [
          { text: 'Hark sekretua ___.', validFor: ['nahi'] },
          { text: 'Mikelek erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Irakasleak erantzun zuzena ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Txakurrak etxerako bidea ___.', validFor: ['ikusi'] },
        ],
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
        ni: { text: 'Nik ez ___ erantzuna.', validFor: ['ikusi', 'nahi'] },
        zu: { text: 'Zuk ez ___ egia.', validFor: ['ikusi', 'nahi'] },
        hura: { text: 'Hark ez ___ sekretua.', validFor: ['nahi'] },
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
    // Every variant here is an allative `-ra` frame ("Ni hondartzara ___." =
    // "I go to the beach"). `etorri`'s same-person form ("Ni hondartzara
    // nator" = "I'm coming to the beach") is an equally natural, differently-
    // meant completion of the same allative — confirmed Tier-2 finding
    // (docs/SENTENCE_FRAMES.md worked example 2) — so every variant gets
    // `validFor: ['etorri']`. izan/egon don't take an allative this way, so
    // they're never listed.
    sentences: {
      present: {
        ni: [
          { text: 'Ni hondartzara ___.', validFor: ['etorri'] },
          { text: 'Ni eskolara ___.', validFor: ['etorri'] },
          { text: 'Ni lanera ___.', validFor: ['etorri'] },
          { text: 'Ni dendara ___.', validFor: ['etorri'] },
        ],
        zu: [
          { text: 'Zu eskolara ___.', validFor: ['etorri'] },
          { text: 'Zu hondartzara ___.', validFor: ['etorri'] },
          { text: 'Zu lanera ___.', validFor: ['etorri'] },
          { text: 'Zu liburutegira ___.', validFor: ['etorri'] },
        ],
        hura: [
          { text: 'Hura lanera ___.', validFor: ['etorri'] },
          { text: 'Hura eskolara ___.', validFor: ['etorri'] },
          { text: 'Hura hondartzara ___.', validFor: ['etorri'] },
          { text: 'Mikel dendara ___.', validFor: ['etorri'] },
          { text: 'Ane unibertsitatera ___.', validFor: ['etorri'] },
          { text: 'Txakurra parkera ___.', validFor: ['etorri'] },
        ],
        gu: [
          { text: 'Gu hondartzara ___.', validFor: ['etorri'] },
          { text: 'Gu lanera ___.', validFor: ['etorri'] },
          { text: 'Gu eskolara ___.', validFor: ['etorri'] },
          { text: 'Gu dendara ___.', validFor: ['etorri'] },
        ],
        zuek: [
          { text: 'Zuek eskolara ___.', validFor: ['etorri'] },
          { text: 'Zuek hondartzara ___.', validFor: ['etorri'] },
          { text: 'Zuek lanera ___.', validFor: ['etorri'] },
          { text: 'Zuek parkera ___.', validFor: ['etorri'] },
        ],
        haiek: [
          { text: 'Haiek lanera ___.', validFor: ['etorri'] },
          { text: 'Haiek eskolara ___.', validFor: ['etorri'] },
          { text: 'Haiek hondartzara ___.', validFor: ['etorri'] },
          { text: 'Mikel eta Ane dendara ___.', validFor: ['etorri'] },
        ],
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
        ni: { text: 'Ni ez ___ hondartzara.', validFor: ['etorri'] },
        zu: { text: 'Zu ez ___ eskolara.', validFor: ['etorri'] },
        hura: { text: 'Hura ez ___ lanera.', validFor: ['etorri'] },
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
    // Allative `-ra` variants ("Ni etxera ___." = "I'm coming home") get
    // `validFor: ['joan']` — joan's same-person form ("Ni etxera noa" = "I'm
    // going home") is an equally natural, opposite-direction completion of
    // the same allative (docs/SENTENCE_FRAMES.md worked example 2;
    // "Ane etxera ___." is the confirmed Tier-2 spot-check). #125: the
    // formerly-bare-temporal variants ("Hura orain ___.", etc.) had no
    // destination, location, or predicate at all — da/dago/doa/dator were
    // *all* grammatical completions (worked example 3) — so each has been
    // rewritten to combine its existing subject/time adverb with a
    // destination (e.g. "Hura orain ikastolara ___."), putting it back into
    // the same allative frame and `validFor: ['joan']`.
    sentences: {
      present: {
        ni: [
          { text: 'Ni etxera ___.', validFor: ['joan'] },
          { text: 'Ni eskolara ___.', validFor: ['joan'] },
          { text: 'Ni orain hondartzara ___.', validFor: ['joan'] },
          { text: 'Ni gaur parkera ___.', validFor: ['joan'] },
        ],
        zu: [
          { text: 'Zu bihar dendara ___.', validFor: ['joan'] },
          { text: 'Zu etxera ___.', validFor: ['joan'] },
          { text: 'Zu orain etxera ___.', validFor: ['joan'] },
          { text: 'Zu gaur unibertsitatera ___.', validFor: ['joan'] },
        ],
        hura: [
          { text: 'Hura orain ikastolara ___.', validFor: ['joan'] },
          { text: 'Hura etxera ___.', validFor: ['joan'] },
          { text: 'Hura bihar etxera ___.', validFor: ['joan'] },
          { text: 'Mikel gaur liburutegira ___.', validFor: ['joan'] },
          { text: 'Ane etxera ___.', validFor: ['joan'] },
          { text: 'Txakurra orain kalera ___.', validFor: ['joan'] },
        ],
        gu: [
          { text: 'Gu etxera ___.', validFor: ['joan'] },
          { text: 'Gu orain etxera ___.', validFor: ['joan'] },
          { text: 'Gu gaur liburutegira ___.', validFor: ['joan'] },
          { text: 'Gu bihar parkera ___.', validFor: ['joan'] },
        ],
        zuek: [
          { text: 'Zuek bihar dendara ___.', validFor: ['joan'] },
          { text: 'Zuek etxera ___.', validFor: ['joan'] },
          { text: 'Zuek orain etxera ___.', validFor: ['joan'] },
          { text: 'Zuek gaur liburutegira ___.', validFor: ['joan'] },
        ],
        haiek: [
          { text: 'Haiek orain auzora ___.', validFor: ['joan'] },
          { text: 'Haiek etxera ___.', validFor: ['joan'] },
          { text: 'Haiek bihar etxera ___.', validFor: ['joan'] },
          { text: 'Mikel eta Ane gaur liburutegira ___.', validFor: ['joan'] },
        ],
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
        ni: { text: 'Ni ez ___ etxera.', validFor: ['joan'] },
        zu: { text: 'Zu ez ___ bihar eskolara.', validFor: ['joan'] },
        hura: { text: 'Hura ez ___ orain etxera.', validFor: ['joan'] },
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. Every object here is a
    // concrete food/dish, naturally also something one could *buy* —
    // `erosi`'s same-person form is a natural "buy X" alternative for all of
    // them (#114's confirmed `jan`↔`erosi` pair); `edan` stays untagged
    // (#114's confirmed-wrong `jan`↔`edan` pair).
    sentences: {
      present: {
        ni: [
          { text: 'Nik sagarra ___.', validFor: ['erosi'] },
          { text: 'Nik ogia ___.', validFor: ['erosi'] },
          { text: 'Nik tortilla ___.', validFor: ['erosi'] },
        ],
        zu: [
          { text: 'Zuk fruta ___?', validFor: ['erosi'] },
          { text: 'Zuk arroza ___.', validFor: ['erosi'] },
        ],
        hura: [
          { text: 'Hark taloa ___.', validFor: ['erosi'] },
          { text: 'Mikelek pizza ___.', validFor: ['erosi'] },
          { text: 'Anek entsalada ___.', validFor: ['erosi'] },
          { text: 'Umeak gaztaina ___.', validFor: ['erosi'] },
        ],
        gu: [
          { text: 'Guk arroza ___.', validFor: ['erosi'] },
          { text: 'Guk ogitartekoa ___.', validFor: ['erosi'] },
        ],
        zuek: [
          { text: 'Zuek fruta ___?', validFor: ['erosi'] },
          { text: 'Zuek taloa ___.', validFor: ['erosi'] },
        ],
        haiek: [
          { text: 'Haiek pastela ___.', validFor: ['erosi'] },
          { text: 'Gurasoek arroza ___.', validFor: ['erosi'] },
        ],
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. Every drink here is also
    // naturally something one could *buy* — `erosi`'s same-person form fits
    // (#114's confirmed `edan`↔`erosi` pair) — except `'Katuak esnea ___.'`,
    // where the subject (a cat) couldn't plausibly be the one buying it, so
    // it stays untagged.
    sentences: {
      present: {
        ni: [
          { text: 'Nik ura ___.', validFor: ['erosi'] },
          { text: 'Nik esnea ___.', validFor: ['erosi'] },
          { text: 'Nik zukua ___.', validFor: ['erosi'] },
        ],
        zu: [
          { text: 'Zuk ardoa ___?', validFor: ['erosi'] },
          { text: 'Zuk kafea ___.', validFor: ['erosi'] },
        ],
        hura: [
          { text: 'Hark sagardoa ___.', validFor: ['erosi'] },
          { text: 'Mikelek tea ___.', validFor: ['erosi'] },
          { text: 'Anek ura ___.', validFor: ['erosi'] },
          { text: 'Katuak esnea ___.', validFor: [] },
        ],
        gu: [
          { text: 'Guk ura ___.', validFor: ['erosi'] },
          { text: 'Guk kafea ___.', validFor: ['erosi'] },
        ],
        zuek: [
          { text: 'Zuek zukua ___?', validFor: ['erosi'] },
          { text: 'Zuek ardoa ___.', validFor: ['erosi'] },
        ],
        haiek: [
          { text: 'Haiek garagardoa ___.', validFor: ['erosi'] },
          { text: 'Lagunek sagardoa ___.', validFor: ['erosi'] },
        ],
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. `erosi`'s candidates are
    // `jan`/`edan` (#114's confirmed pairs) — only edible/drinkable objects
    // ("ogia", "sagarrak", "fruta") admit them; non-food objects (books,
    // jackets, cars, houses, tickets, gifts, records) admit neither.
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: [] },
          { text: 'Nik ogia ___.', validFor: ['jan'] },
          { text: 'Nik jaka berri bat ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk sagarrak ___?', validFor: ['jan'] },
          { text: 'Zuk diskoa ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hark autoa ___.', validFor: [] },
          { text: 'Mikelek opari bat ___.', validFor: [] },
          { text: 'Anek etxe bat ___.', validFor: [] },
          { text: 'Saltzaileak fruta ___.', validFor: ['jan'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: [] },
          { text: 'Guk txartelak ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek opariak ___?', validFor: [] },
          { text: 'Zuek liburuak ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek autoa ___.', validFor: [] },
          { text: 'Gurasoek etxe bat ___.', validFor: [] },
        ],
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
    id: 'hartu',
    verb: 'hartu',
    meaning: { en: 'to take', es: 'tomar / coger', eu: 'hartu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'hartzen dut',
        zu: 'hartzen duzu',
        hura: 'hartzen du',
        gu: 'hartzen dugu',
        zuek: 'hartzen duzue',
        haiek: 'hartzen dute',
      },
      past: {
        ni: 'hartu nuen',
        zu: 'hartu zenuen',
        hura: 'hartu zuen',
        gu: 'hartu genuen',
        zuek: 'hartu zenuten',
        haiek: 'hartu zuten',
      },
      future: {
        ni: 'hartuko dut',
        zu: 'hartuko duzu',
        hura: 'hartuko du',
        gu: 'hartuko dugu',
        zuek: 'hartuko duzue',
        haiek: 'hartuko dute',
      },
    },
    // #143: `hartu` added to the Unit 12 "daily routine" pool to stage the
    // `jaten`(-ten)/`hartzen`(-tzen) minimal pair. Sentence objects
    // (autobusa/trena/taxia/aterkia/katua/erabakia/txanda) are chosen so that
    // none of the pool's other verbs (jan/edan/erosi/ikusi) would also fit —
    // hence `validFor: []` throughout. Flagged in docs/LANGUAGE_DECISIONS.md
    // for a native-speaker check of these forms/sentences.
    sentences: {
      present: {
        ni: [
          { text: 'Nik autobusa ___.', validFor: [] },
          { text: 'Nik aterkia ___.', validFor: [] },
          { text: 'Nik erabaki bat ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk taxia ___?', validFor: [] },
          { text: 'Zuk telefonoa ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hark trena ___.', validFor: [] },
          { text: 'Mikelek katua ___.', validFor: [] },
          { text: 'Anek txanda ___.', validFor: [] },
          { text: 'Gidariak autobusa ___.', validFor: [] },
        ],
        gu: [
          { text: 'Guk taxia ___.', validFor: [] },
          { text: 'Guk erabaki garrantzitsu bat ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek autobusa ___?', validFor: [] },
          { text: 'Zuek aterkiak ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek trena ___.', validFor: [] },
          { text: 'Gurasoek erabakia ___.', validFor: [] },
        ],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ autobusa hartzen dut.',
        zu: '___ taxia hartzen duzu.',
        hura: '___ trena hartzen du.',
        gu: '___ aterkia hartzen dugu.',
        zuek: '___ autobusa hartzen duzue.',
        haiek: '___ trena hartzen dute.',
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. `ikusi`'s candidates are
    // `ukan`/`eduki`/`jakin`/`nahi` (all four confirmed pairs). "Filma" (a
    // film — ownable, wantable, not "known" as a fact) admits `ukan`/`eduki`/
    // `nahi`; "mendia"/"itsasoa"/"zerua" (mountain/sea/sky — can't be owned,
    // held, known, or wanted in this frame) admit nothing; `'Zuk/Zuek hori
    // ___?'` ("that [thing]") is maximally generic — every candidate fits.
    // "Irakasleak ikasleak ___."/"Gurasoek etxea ___." (teacher has/wants
    // students; parents have/want the house) admit `ukan`/`nahi` (and
    // `eduki` for the house, a near-synonym of `ukan` for ownership);
    // "Txakurrak katua ___." (the dog [sees/has/wants] the cat) admits
    // `eduki`/`nahi`.
    sentences: {
      present: {
        ni: [
          { text: 'Nik filma ___.', validFor: ['ukan', 'eduki', 'nahi'] },
          { text: 'Nik mendia ___.', validFor: [] },
          { text: 'Nik zerua ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi'] },
          { text: 'Zuk Mikel ___?', validFor: [] },
        ],
        hura: [
          { text: 'Hark itsasoa ___.', validFor: [] },
          { text: 'Anek filma ___.', validFor: ['ukan', 'eduki', 'nahi'] },
          { text: 'Irakasleak ikasleak ___.', validFor: ['ukan', 'nahi'] },
          { text: 'Txakurrak katua ___.', validFor: ['eduki', 'nahi'] },
        ],
        gu: [
          { text: 'Guk itsasoa ___.', validFor: [] },
          { text: 'Guk filma ___.', validFor: ['ukan', 'eduki', 'nahi'] },
        ],
        zuek: [
          { text: 'Zuek hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi'] },
          { text: 'Zuek mendia ___?', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek filma ___.', validFor: ['ukan', 'eduki', 'nahi'] },
          { text: 'Gurasoek etxea ___.', validFor: ['ukan', 'eduki', 'nahi'] },
        ],
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
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. `eduki`'s candidates are
    // `ukan`/`ikusi` (#114's confirmed pairs; `jakin` is a confirmed-wrong
    // pair, never listed). Every sentence here is "[object] in my
    // pocket/hand" — `ukan`'s same-person form is a near-synonym for
    // "have" (per #114's "textbook eduki/ukan" finding), and `ikusi`'s
    // ("I see [object] in [my/their] hand") is the audit's worked example
    // for `eduki`. `nahi` is excluded throughout — "I want [object] in my
    // pocket/hand" doesn't read as a natural completion.
    sentences: {
      present: {
        ni: [
          { text: 'Nik giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Nik dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Nik liburu bat eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        zu: [
          { text: 'Zuk giltza poltsikoan ___?', validFor: ['ukan', 'ikusi'] },
          { text: 'Zuk telefonoa eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        hura: [
          { text: 'Hark giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Mikelek dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Anek liburua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Umeak jostailua eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        gu: [
          { text: 'Guk giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Guk dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        zuek: [
          { text: 'Zuek giltza poltsikoan ___?', validFor: ['ukan', 'ikusi'] },
          { text: 'Zuek txartela eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        haiek: [
          { text: 'Haiek giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Gurasoek dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
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
        ni: { text: 'Nik ez ___ giltza poltsikoan.', validFor: ['ukan', 'ikusi'] },
        zu: { text: 'Zuk ez ___ dirua eskuan.', validFor: ['ukan', 'ikusi'] },
        hura: { text: 'Hark ez ___ liburua eskuan.', validFor: ['ukan', 'ikusi'] },
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

// Stage 6 (Units 14-15, "Talking About the Future") gave every verb above (except
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
