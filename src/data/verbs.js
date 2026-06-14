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
    // `validFor` (#124) is decided per object, not blanket per pair, per
    // docs/SENTENCE_FRAMES.md's "book" vs "denbora" contrast:
    // - Concrete, ownable/visible/purchasable objects (liburu/auto/etxe/
    //   txartel/koaderno/mapa/arkatz "book/car/house/card/notebook/map/
    //   pencil") — `nahi dut`/`daukat`/`ikusten dut`/`erosten dut` are all
    //   natural ("want/hold/see/buy X") → `['nahi', 'eduki', 'ikusi', 'erosi']`.
    // - Kinship nouns (arreba/anaia/seme "sister/brother/son") — `nahi`/
    //   `eduki` extend to relations ("I want/have a sibling"), but `ikusten
    //   dut arreba bat` ("I see A sister", indefinite) and buying/eating a
    //   person don't → `['nahi', 'eduki']`.
    // - `bilera bat` ("a meeting") — `daukat`/`nahi dut` ("I have/want a
    //   meeting") are natural; `ikusten dut`/`erosten dut`/`dakit` aren't →
    //   `['nahi', 'eduki']`.
    // - `pasaporte bat` ("a passport") — `nahi`/`eduki`/`ikusi` fit
    //   ("want/hold/see a passport"); passports aren't bought → `['nahi',
    //   'eduki', 'ikusi']`.
    // - `Txakurrak hezur bat ___.` ("the dog ___ a bone") — `nahi`/`eduki`/
    //   `ikusi`/`jan` all read naturally for a dog and a bone → `['nahi',
    //   'eduki', 'ikusi', 'jan']`.
    // - `Etxeak lorategi bat ___.` ("the house ___ a garden") — inanimate
    //   subject narrows this to `eduki` only (`daukat`-style "has"); a house
    //   can't want/see/buy → `['eduki']`.
    // `jakin`↔`ukan` stays untagged everywhere (#114 confirmed genuinely
    // wrong: "Anek auto bat daki" is nonsensical), and `jan`/`edan` only
    // appear where the object is actually edible/drinkable (none of ukan's
    // objects are drinkable).
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik arreba bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Nik txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik bilera bat ___.', validFor: ['nahi', 'eduki'] },
        ],
        zu: [
          { text: 'Zuk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuk koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuk anaia bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Zuk mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        hura: [
          { text: 'Berak etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Hark arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Berak seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Hark pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Mikelek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Anek auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Txakurrak hezur bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'jan'] },
          { text: 'Etxeak lorategi bat ___.', validFor: ['eduki'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Guk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Guk bilera bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Guk txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        zuek: [
          { text: 'Zuek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuek mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuek koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuek arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        haiek: [
          { text: 'Haiek seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Haiek pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Gurasoek etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Ikasleek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
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
        ni: { text: 'Nik ez ___ liburu bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
        zu: { text: 'Zuk ez ___ auto bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
        hura: { text: 'Berak ez ___ etxe bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi'] },
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
    // `validFor` (#124), per-sentence (docs/SENTENCE_FRAMES.md "book" vs
    // "denbora" contrast):
    // - `liburu`/`opari bat` ("book"/"gift") — concrete & purchasable, same
    //   as `ukan`'s equivalents → `['ukan', 'eduki', 'ikusi', 'erosi']`.
    // - `kafe`/`ur`/`esne pixka bat` ("coffee"/"water"/"a little milk") —
    //   drinkable → `edaten dut`/`erosten dut`/`dut`/`daukat` ("drink/buy/
    //   have/hold X") all read naturally, `ikusten dut`/`jaten dut` don't →
    //   `['ukan', 'eduki', 'edan', 'erosi']`. `Katuak esne pixka bat ___.`
    //   (the cat) additionally admits `ikusi` (cats famously eyeing milk) but
    //   not `erosi` (cats don't buy things) → `['ukan', 'eduki', 'edan',
    //   'ikusi']`.
    // - `sagar bat` ("an apple") — food, so `jaten duzu`/`erosten duzu` join
    //   `dut`/`daukat`/`ikusten duzu` → `['ukan', 'eduki', 'jan', 'ikusi',
    //   'erosi']` (flagged: this leaves only `nahi` itself discriminating —
    //   worth a native-speaker check).
    // - `'Zuk etorri ___?'` ("Do you want to come?") — `nahi` + infinitive,
    //   structurally unlike the "X bat ___" frame: no other `nor-nork` verb's
    //   periphrastic form fits a bare infinitive complement this way (`"Zuk
    //   etorri duzu/daukazu/dakizu?"` are all ungrammatical) → `validFor: []`,
    //   despite `nahi` otherwise being a Tier-1 "often excluded" partner.
    // `jakin` stays untagged throughout (confirmed genuinely wrong, #114).
    sentences: {
      present: {
        ni: [
          { text: 'Nik kafe bat ___.', validFor: ['ukan', 'eduki', 'edan', 'erosi'] },
          { text: 'Nik ur bat ___.', validFor: ['ukan', 'eduki', 'edan', 'erosi'] },
          { text: 'Nik liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi'] },
        ],
        zu: [
          { text: 'Zuk etorri ___?', validFor: [] },
          { text: 'Zuk kafe bat ___?', validFor: ['ukan', 'eduki', 'edan', 'erosi'] },
          { text: 'Zuk liburu bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuk sagar bat ___?', validFor: ['ukan', 'eduki', 'jan', 'ikusi', 'erosi'] },
        ],
        hura: [
          { text: 'Hark opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Mikelek kafe bat ___.', validFor: ['ukan', 'eduki', 'edan', 'erosi'] },
          { text: 'Anek liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Katuak esne pixka bat ___.', validFor: ['ukan', 'eduki', 'edan', 'ikusi'] },
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
    // `validFor` (#124): jakin's objects are all facts/information
    // (erantzuna/egia/sekretua "answer/truth/secret", bidea "the way/road").
    // Tier 1 flagged `jakin`↔`nahi`/`ikusi` as "both valid" pairs — per
    // sentence, "nahi dut"/"ikusten dut" ("I want/see the answer/truth/
    // secret") both read naturally → `['nahi', 'ikusi']`. `bidea`/`etxerako
    // bidea` ("the way"/"the way home") are literally visible (`ikusten dut
    // bidea` = "I see the road") but "nahi dut bidea" ("I want the road") is
    // odd, not "I want [to know] the way" → `['ikusi']` only.
    // `jakin`↔`ukan`/`eduki` stay untagged (#114 confirmed genuinely wrong:
    // "Anek auto bat daki" is nonsensical, and the reverse — "I have/hold the
    // answer" — was confirmed not to read naturally either). `jan`/`edan`/
    // `erosi` don't apply (none of these objects are food/drink/purchasable).
    sentences: {
      present: {
        ni: [
          { text: 'Nik erantzuna ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Nik egia ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Nik sekretua ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Nik bidea ___.', validFor: ['ikusi'] },
        ],
        zu: [
          { text: 'Zuk egia ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Zuk erantzuna ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Zuk sekretua ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Zuk bidea ___.', validFor: ['ikusi'] },
        ],
        hura: [
          { text: 'Hark sekretua ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Mikelek erantzuna ___.', validFor: ['nahi', 'ikusi'] },
          { text: 'Irakasleak erantzun zuzena ___.', validFor: ['nahi', 'ikusi'] },
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
        ni: { text: 'Nik ez ___ erantzuna.', validFor: ['nahi', 'ikusi'] },
        zu: { text: 'Zuk ez ___ egia.', validFor: ['nahi', 'ikusi'] },
        hura: { text: 'Hark ez ___ sekretua.', validFor: ['nahi', 'ikusi'] },
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
    // "Ane etxera ___." is the confirmed Tier-2 spot-check). The bare
    // temporal ("orain"/"gaur"/"bihar") variants have no destination,
    // location, or predicate at all — da/dago/doa/dator are *all* grammatical
    // completions (worked example 3), so there's no useful `validFor` to
    // write; `validFor: ['izan', 'egon', 'joan']` lists every other
    // `nor`-cluster sibling as an explicit, honest "still ambiguous, every
    // sibling fits" marker (same exclude-everything effect as the untagged
    // default, but distinguishable from "forgot to tag" by the coverage
    // test). Flagged for #125, which rewrites these to carry a discriminating
    // adjunct — see docs/DECISIONS.md.
    sentences: {
      present: {
        ni: [
          { text: 'Ni etxera ___.', validFor: ['joan'] },
          { text: 'Ni eskolara ___.', validFor: ['joan'] },
          { text: 'Ni orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Ni gaur ___.', validFor: ['izan', 'egon', 'joan'] },
        ],
        zu: [
          { text: 'Zu bihar ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Zu etxera ___.', validFor: ['joan'] },
          { text: 'Zu orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Zu gaur ___.', validFor: ['izan', 'egon', 'joan'] },
        ],
        hura: [
          { text: 'Hura orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Hura etxera ___.', validFor: ['joan'] },
          { text: 'Hura bihar ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Mikel gaur ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Ane etxera ___.', validFor: ['joan'] },
          { text: 'Txakurra orain ___.', validFor: ['izan', 'egon', 'joan'] },
        ],
        gu: [
          { text: 'Gu etxera ___.', validFor: ['joan'] },
          { text: 'Gu orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Gu gaur ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Gu bihar ___.', validFor: ['izan', 'egon', 'joan'] },
        ],
        zuek: [
          { text: 'Zuek bihar ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Zuek etxera ___.', validFor: ['joan'] },
          { text: 'Zuek orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Zuek gaur ___.', validFor: ['izan', 'egon', 'joan'] },
        ],
        haiek: [
          { text: 'Haiek orain ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Haiek etxera ___.', validFor: ['joan'] },
          { text: 'Haiek bihar ___.', validFor: ['izan', 'egon', 'joan'] },
          { text: 'Mikel eta Ane gaur ___.', validFor: ['izan', 'egon', 'joan'] },
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
        zu: { text: 'Zu ez ___ bihar.', validFor: ['izan', 'egon', 'joan'] },
        hura: { text: 'Hura ez ___ orain.', validFor: ['izan', 'egon', 'joan'] },
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
    // #124: jan↔erosi is a Tier-1 "both valid" pair per
    // docs/AMBIGUOUS_DISTRACTORS_AUDIT.md, and jan↔edan is confirmed genuinely
    // wrong (stays untagged/excluded as a distractor). But for every food
    // object here, the general possession/desire/perception/purchase set also
    // completes the sentence — "Nik sagarra daukat/dut/ikusten dut/nahi dut/
    // erosten dut" are all valid alongside "jaten dut" — so every variant
    // shares the same validFor: ukan, nahi, eduki, ikusi, erosi.
    sentences: {
      present: {
        ni: [
          { text: 'Nik sagarra ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik tortilla ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        zu: [
          { text: 'Zuk fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuk arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        hura: [
          { text: 'Hark taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Mikelek pizza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Anek entsalada ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Umeak gaztaina ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        gu: [
          { text: 'Guk arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Guk ogitartekoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        zuek: [
          { text: 'Zuek fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuek taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        haiek: [
          { text: 'Haiek pastela ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Gurasoek arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
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
    // #124: edan↔erosi is a Tier-1 "both valid" pair, and edan↔jan is
    // confirmed genuinely wrong (stays excluded). As with jan, every drink
    // object also accepts the general possession/desire/perception/purchase
    // set — ukan, nahi, eduki, ikusi, erosi — except 'Katuak esnea ___.'
    // (the cat drinks milk), which parallels nahi's cat/milk case: a cat
    // doesn't "buy" milk, so erosi is dropped (→ ukan/nahi/eduki/ikusi only).
    sentences: {
      present: {
        ni: [
          { text: 'Nik ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik esnea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Nik zukua ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        zu: [
          { text: 'Zuk ardoa ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuk kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        hura: [
          { text: 'Hark sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Mikelek tea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Anek ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Katuak esnea ___.', validFor: ['ukan', 'eduki', 'nahi', 'ikusi'] },
        ],
        gu: [
          { text: 'Guk ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Guk kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        zuek: [
          { text: 'Zuek zukua ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Zuek ardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
        ],
        haiek: [
          { text: 'Haiek garagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
          { text: 'Lagunek sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi'] },
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
    // #124: erosi↔jan and erosi↔edan are the Tier-1 "both valid" pairs for
    // food/drink objects (jan: ogia, sagarrak, fruta below — edan doesn't fit
    // any of erosi's objects here, so it never appears). Every object —
    // food or not — also accepts the general possession/desire/perception
    // set ukan/nahi/eduki/ikusi ("daukat/dut/nahi dut/ikusten dut [object]").
    // So: food objects → ukan/nahi/eduki/ikusi/jan; everything else (books,
    // jackets, records, cars, gifts, houses, cards) → ukan/nahi/eduki/ikusi.
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Nik ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'jan'] },
          { text: 'Nik jaka berri bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        zu: [
          { text: 'Zuk sagarrak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'jan'] },
          { text: 'Zuk diskoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        hura: [
          { text: 'Hark autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Mikelek opari bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Anek etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Saltzaileak fruta ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'jan'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Guk txartelak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        zuek: [
          { text: 'Zuek opariak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Zuek liburuak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        haiek: [
          { text: 'Haiek autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
          { text: 'Gurasoek etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
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
    // #124: object-driven validFor per docs/AMBIGUOUS_DISTRACTORS_AUDIT.md
    // (ukan↔ikusi, eduki↔ikusi and ikusi↔nahi are Tier-1 "both valid" pairs;
    // jakin↔ikusi too, but jakin's object must be a fact/clause — "dakit
    // filma"/"dakizki ikasleak" don't work, so jakin only appears below where
    // the object plausibly reads as a "known fact").
    // - filma (a film/DVD): ownable, wantable, buyable → ukan/eduki/nahi/erosi.
    // - mendia/zerua/itsasoa (mountain/sky/sea): not had/wanted/bought/eaten →
    //   validFor: [] (ikusi-specific, nothing to exclude).
    // - 'Zuk/Zuek hori ___?' — "hori" ("that") is a fully generic demonstrative
    //   that could stand for any object/fact/food/drink, so every other
    //   nor-nork sibling's same-person form also completes it. Flagged here
    //   (not left unset) as a deliberately-assessed "still ambiguous" case,
    //   same as etorri's frameless variants from #124/#125.
    // - Mikel (a person): ukan/eduki ("duzu/daukazu Mikel?" — "do you have
    //   Mikel [with/on the line]?") and nahi ("do you want Mikel [on your
    //   team]?") are plausible; jakin doesn't apply to people (ezagutu would),
    //   and jan/edan/erosi a person is nonsensical.
    // - ikasleak (the students): teacher "having" them (roster/care) or
    //   "wanting" them → ukan/eduki/nahi; jakin/jan/edan/erosi don't fit.
    // - katua (the cat): dog having/holding it, wanting to chase it, or
    //   (grimly but validly) eating it → ukan/eduki/nahi/jan.
    // - etxea (the house): classic "have/want/buy a house" set → ukan/eduki/nahi/erosi.
    sentences: {
      present: {
        ni: [
          { text: 'Nik filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi'] },
          { text: 'Nik mendia ___.', validFor: [] },
          { text: 'Nik zerua ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk hori ___?', validFor: ['ukan', 'nahi', 'jakin', 'eduki', 'jan', 'edan', 'erosi'] },
          { text: 'Zuk Mikel ___?', validFor: ['ukan', 'eduki', 'nahi'] },
        ],
        hura: [
          { text: 'Hark itsasoa ___.', validFor: [] },
          { text: 'Anek filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi'] },
          { text: 'Irakasleak ikasleak ___.', validFor: ['ukan', 'eduki', 'nahi'] },
          { text: 'Txakurrak katua ___.', validFor: ['ukan', 'eduki', 'nahi', 'jan'] },
        ],
        gu: [
          { text: 'Guk itsasoa ___.', validFor: [] },
          { text: 'Guk filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi'] },
        ],
        zuek: [
          { text: 'Zuek hori ___?', validFor: ['ukan', 'nahi', 'jakin', 'eduki', 'jan', 'edan', 'erosi'] },
          { text: 'Zuek mendia ___?', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi'] },
          { text: 'Gurasoek etxea ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi'] },
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
    // #124: every variant here is an "X [object] eskuan/poltsikoan ___." physical-
    // possession frame. The same object/location works with ukan ("daukat" → "have"),
    // ikusi ("ikusten dut" → "see") and nahi ("nahi dut" → "want it there") — eduki↔ukan,
    // eduki↔ikusi and eduki↔nahi are all Tier-1 "both valid" pairs per
    // docs/AMBIGUOUS_DISTRACTORS_AUDIT.md. jakin stays excluded (you don't "know" a key
    // in your pocket — eduki↔jakin is genuinely wrong). jan/edan/erosi don't fit the
    // "in my hand/pocket" location frame for any of these objects, so they stay excluded too.
    sentences: {
      present: {
        ni: [
          { text: 'Nik giltza poltsikoan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Nik dirua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Nik liburu bat eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
        ],
        zu: [
          { text: 'Zuk giltza poltsikoan ___?', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Zuk telefonoa eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
        ],
        hura: [
          { text: 'Hark giltza poltsikoan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Mikelek dirua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Anek liburua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Umeak jostailua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
        ],
        gu: [
          { text: 'Guk giltza poltsikoan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Guk dirua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
        ],
        zuek: [
          { text: 'Zuek giltza poltsikoan ___?', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Zuek txartela eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
        ],
        haiek: [
          { text: 'Haiek giltza poltsikoan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
          { text: 'Gurasoek dirua eskuan ___.', validFor: ['ukan', 'ikusi', 'nahi'] },
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
        ni: { text: 'Nik ez ___ giltza poltsikoan.', validFor: ['ukan', 'ikusi', 'nahi'] },
        zu: { text: 'Zuk ez ___ dirua eskuan.', validFor: ['ukan', 'ikusi', 'nahi'] },
        hura: { text: 'Hark ez ___ liburua eskuan.', validFor: ['ukan', 'ikusi', 'nahi'] },
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
