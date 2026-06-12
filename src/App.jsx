import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  addPoints,
  canRepairStreak,
  computeLessonPoints,
  computeStars,
  exerciseReducer,
  generateQuestions,
  getActiveStreak,
  getExplanation,
  getEncouragement,
  getLastPlayedLessonId,
  getLocalDateString,
  pickEncouragementVariantIndex,
  getStreakEncouragement,
  getUnlockedLessonIds,
  getWeakSpotQuestions,
  isAnswerCorrect,
  recordDailyStreak,
  recordErrors,
  recordResult,
  repairStreak,
  shuffle,
  STREAK_REPAIR_COST,
} from './lessonLogic'
import { JOURNEY } from './journey'
import { JOURNEY_TRANSLATIONS } from './i18n/journeyTranslations'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { trackEvent } from './analytics'

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
// this single-blank shape; see `docs/DECISIONS.md` (Unit 5). Powers the
// `negative`/`type-negative` question kinds, which only appear when a lesson
// opts in via `includeNegation` (see `generateQuestions`) — Unit 5's
// `unit-5-review-1`/`-2`/`-3` are the only lessons that currently do.
//
// Per `docs/LEARNING_JOURNEY.md`'s Phase I ("Survival Present"), every verb's
// first lesson is restricted to `ni`/`zu`/`hura` — `gu`/`zuek`/`haiek` (and,
// much later, `hi`) are added once Unit 6 ("Expansion") is implemented. Until
// then, a Phase I verb's `present` table simply *contains only* those three
// person keys — `generateQuestions` already builds one question per key in
// the table, so a smaller table is all a 3-person lesson needs (see
// `docs/EXERCISE_ENGINE.md`, "Phase I's 3-person horizon", option (a)).
// =============================================================================

const VERBS = [
  {
    id: 'izan',
    verb: 'izan',
    meaning: { en: 'to be', es: 'ser / estar', eu: 'izan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'naiz', zu: 'zara', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
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
  // `docs/CONJUGATIONS.md` §3; `gu`/`zuek`/`haiek` added by Unit 6
  // "Expansion"). The old no-`zu`, `hi`-based `past` table was removed —
  // unused by any implemented unit, shaped for the pre-journey model, and
  // will be re-added correctly, with `zu`, when Unit 12 ("I Was, I Had") is
  // implemented (same precedent as `izan`'s past table).
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
  // Unit 3 ("Moving Around") — `joan` present (`noa`/`zoaz`/`doa`/`goaz`/
  // `zoazte`/`doaz`), per `docs/CONJUGATIONS.md` §6 (already has a `zu` row).
  // `gu`/`zuek`/`haiek` were added by Unit 6 ("Expansion").
  {
    id: 'joan',
    verb: 'joan',
    meaning: { en: 'to go', es: 'ir', eu: 'joan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'noa', zu: 'zoaz', hura: 'doa', gu: 'goaz', zuek: 'zoazte', haiek: 'doaz' },
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
  // `etorri` present, same Unit 3 ("Moving Around") trim — `nator`/`zatoz`/
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
  // Unit 4 ("The Immediate Continuous") — `ari` ("in the process of") +
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
  // Unit 7 ("Daily Routine (Transitive)") — first Phase II verbs, so per the
  // Person-Expansion Rule (`docs/LEARNING_JOURNEY.md`) these start at the full
  // 6-person grid from their first lesson, no separate expansion pass needed.
  // All four are periphrastic `nor-nork` verbs (object fixed to `hura`, like
  // `ukan`/`nahi`/`jakin`): imperfective participle (`jaten`/`edaten`/
  // `erosten`/`ikusten`) + `ukan`'s present auxiliary (`dut`/`duzu`/`du`/
  // `dugu`/`duzue`/`dute`), per `docs/CONJUGATIONS.md` §7's "Present (oraina)"
  // columns for these four verbs. No `negativeSentences` — same as `nahi`/
  // `ari`, these two-word forms break apart under negation.
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
  // Unit 8 ("Physical States & Possessions", Phase II). `eduki` ("to have/
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

// Unit 9 ("Intentions & Future Actions") gave every verb above (except `ari`,
// see `docs/LANGUAGE_DECISIONS.md`) a `conjugations.future` table. The blank
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

// Maps grammatical persons / tenses / verb types / agreement roles to the
// translation keys their UI labels live under (`src/i18n/translations.js`) —
// looked up via `t()` at render time so labels follow the interface language.
// `basque`/`basqueLabel`/the NOR/NORI/NORK `label`s themselves are Basque
// grammar terms, shown as-is regardless of interface language.
const PERSON_LABEL_KEYS = {
  ni: 'personNi',
  hi: 'personHi',
  zu: 'personZu',
  hura: 'personHura',
  gu: 'personGu',
  zuek: 'personZuek',
  haiek: 'personHaiek',
}

const TENSE_META = {
  present: { labelKey: 'tensePresent', basque: 'oraina' },
  past: { labelKey: 'tensePast', basque: 'lehena' },
  future: { labelKey: 'tenseFuture', basque: 'geroa' },
}

const TYPE_META = {
  synthetic: { labelKey: 'typeSynthetic', basqueLabel: 'trinkoa', className: 'bg-indigo-100 text-indigo-700' },
  periphrastic: { labelKey: 'typePeriphrastic', basqueLabel: 'perifrastikoa', className: 'bg-rose-100 text-rose-700' },
}

const AGREEMENT_META = {
  nor: { label: 'NOR', titleKey: 'agreementNorTitle', className: 'bg-blue-100 text-blue-700' },
  nori: { label: 'NORI', titleKey: 'agreementNoriTitle', className: 'bg-purple-100 text-purple-700' },
  nork: { label: 'NORK', titleKey: 'agreementNorkTitle', className: 'bg-amber-100 text-amber-700' },
}

const DIALECT_LABELS = {
  batua: 'Batua',
}

// `LESSONS` is the flat, ordered list of currently-playable lessons —
// `getUnlockedLessonIds` unlocks them strictly in this order, one practice
// lesson at a time, `{ id, verbId, tense }`.
//
// Unlike the previous (verb × tense)-derived list, this is now hand-written
// to follow `docs/LEARNING_JOURNEY.md`'s unit sequence — units don't map
// cleanly onto "every tense of every verb" (e.g. a unit can introduce two
// verbs at once, or reuse an earlier verb's table under a different gloss),
// so `journey.js`'s `JOURNEY` is the source of truth for *order and grouping*
// and references these ids via each available unit's `lessonIds`. Append the
// next unit's lessons here as it's implemented, and flip its `status` to
// `'available'` in `journey.js`.
//
// Review lessons carry `review: true` and `sources: [{ verbId, tense }, …]`
// instead of a single `verbId`/`tense` — `generateQuestions` is called once
// per source and the results interleaved, with every generated question
// keeping its own `verbId`/`tense` so the exercise screen can show each one
// in its correct context. Every available unit ends with one of these as a
// "Unit review" — `sources` covers every verb/tense the unit introduced —
// giving each unit an extra, harder consolidation lesson (reviews skip the
// no-typing ramp and the conjugation preview, see `NO_TYPING_ATTEMPTS`/
// `LessonPreviewScreen`) before the next unit unlocks. The journey's Refresh
// Gate units (5, 6, 11, 17, ...) are a bigger, cross-unit version of the same
// shape once implemented.
const LESSONS = [
  { id: 'izan-present', verbId: 'izan', tense: 'present' },
  { id: 'egon-present', verbId: 'egon', tense: 'present' },
  {
    id: 'unit-1-review',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ],
  },
  { id: 'ukan-present', verbId: 'ukan', tense: 'present' },
  { id: 'nahi-present', verbId: 'nahi', tense: 'present' },
  { id: 'jakin-present', verbId: 'jakin', tense: 'present' },
  {
    id: 'unit-2-review',
    review: true,
    sources: [
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'nahi', tense: 'present' },
      { verbId: 'jakin', tense: 'present' },
    ],
  },
  { id: 'joan-present', verbId: 'joan', tense: 'present' },
  { id: 'etorri-present', verbId: 'etorri', tense: 'present' },
  {
    id: 'unit-3-review',
    review: true,
    sources: [
      { verbId: 'joan', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
    ],
  },
  { id: 'ari-present', verbId: 'ari', tense: 'present' },
  {
    id: 'unit-4-review',
    review: true,
    sources: [{ verbId: 'ari', tense: 'present' }],
  },
  // Unit 5 ("REFRESH — The Inversion Matrix", Refresh Gate A) — zero new
  // verbs, drilling `ez` + auxiliary-fronting (`negativeSentences`) across the
  // six Units 1–3 verbs whose present-tense form is a single word that stays
  // intact under negation. `negation: true` tells `createExerciseState` to
  // pass `includeNegation` through to `generateQuestions` for every source.
  // Split into three reviews of two sources each — a single six-source review
  // landed at ~33 questions (see `docs/DECISIONS.md`, 2026-06-12 "Implemented
  // Unit 6"), well past `TARGET_EXERCISE_COUNT`; each of these three lands at
  // exactly 12. Per `docs/LEARNING_JOURNEY.md`, a Refresh Gate's whole point is
  // a cumulative cross-unit mixer, so sources are deliberately paired *across*
  // their originating units (Unit 1: izan/egon, Unit 2: ukan/jakin, Unit 3:
  // joan/etorri) rather than keeping each origin unit's pair together.
  {
    id: 'unit-5-review-1',
    review: true,
    negation: true,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  {
    id: 'unit-5-review-2',
    review: true,
    negation: true,
    sources: [
      { verbId: 'egon', tense: 'present' },
      { verbId: 'joan', tense: 'present' },
    ],
  },
  {
    id: 'unit-5-review-3',
    review: true,
    negation: true,
    sources: [
      { verbId: 'jakin', tense: 'present' },
      { verbId: 'etorri', tense: 'present' },
    ],
  },
  // Unit 6 ("Expansion — Bringing in the Plural", Refresh Gate A) — zero new
  // verbs. `izan`/`egon`/`ukan`/`joan`/`etorri`'s `conjugations.present`
  // (plus their `sentences`/`pronouns`/`pronounSentences`) gained `gu`/`zuek`/
  // `haiek` rows directly (see `docs/DECISIONS.md`), so every practice lesson
  // and review above that already references these verbs' present tense now
  // covers the full 6-person grid automatically — no `persons` filter needed.
  // This unit's own consolidation pass is split into three reviews, using the
  // same cross-unit pairing as Unit 5 above (Unit 1: izan/egon, Unit 2: ukan,
  // Unit 3: joan/etorri all paired across origins) — a single five-source
  // review landed at 30 questions; each of these three lands at exactly 12.
  {
    id: 'unit-6-review-1',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ],
  },
  {
    id: 'unit-6-review-2',
    review: true,
    sources: [
      { verbId: 'egon', tense: 'present' },
      { verbId: 'joan', tense: 'present' },
    ],
  },
  {
    id: 'unit-6-review-3',
    review: true,
    sources: [{ verbId: 'etorri', tense: 'present' }],
  },
  // Unit 7 ("Daily Routine (Transitive)", Phase II) — first unit past Refresh
  // Gate A, introducing four new periphrastic nor-nork verbs (`jan`/`edan`/
  // `erosi`/`ikusi`), each already a full 6-person grid per the
  // Person-Expansion Rule. `unit-7-review` covers all four.
  { id: 'jan-present', verbId: 'jan', tense: 'present' },
  { id: 'edan-present', verbId: 'edan', tense: 'present' },
  { id: 'erosi-present', verbId: 'erosi', tense: 'present' },
  { id: 'ikusi-present', verbId: 'ikusi', tense: 'present' },
  {
    id: 'unit-7-review',
    review: true,
    sources: [
      { verbId: 'jan', tense: 'present' },
      { verbId: 'edan', tense: 'present' },
      { verbId: 'erosi', tense: 'present' },
      { verbId: 'ikusi', tense: 'present' },
    ],
  },
  // Unit 8 ("Physical States & Possessions", Phase II) — two new synthetic
  // verbs, `eduki` (nor-nork) and `ibili` (nor), each already a full
  // 6-person grid per the Person-Expansion Rule. `unit-8-review` covers both.
  { id: 'eduki-present', verbId: 'eduki', tense: 'present' },
  { id: 'ibili-present', verbId: 'ibili', tense: 'present' },
  {
    id: 'unit-8-review',
    review: true,
    sources: [
      { verbId: 'eduki', tense: 'present' },
      { verbId: 'ibili', tense: 'present' },
    ],
  },
  // Unit 9 ("Intentions & Future Actions", Phase II) — zero new verbs, "only
  // the participle-formation rule is new" (`docs/LEARNING_JOURNEY.md`): every
  // verb from Units 1-8 except `ari` (see `docs/LANGUAGE_DECISIONS.md`) gets a
  // `future` practice lesson, reusing its existing present-tense auxiliary
  // table under a `-ko`/`-go` participle. 13 practice lessons is more than any
  // prior unit, so — following Units 5/6's precedent for oversized
  // consolidation passes — the unit's review is split into four
  // `unit-9-review-N` lessons of 3-4 sources each (~18 questions apiece)
  // rather than one review covering all 13.
  { id: 'izan-future', verbId: 'izan', tense: 'future' },
  { id: 'egon-future', verbId: 'egon', tense: 'future' },
  { id: 'ukan-future', verbId: 'ukan', tense: 'future' },
  { id: 'nahi-future', verbId: 'nahi', tense: 'future' },
  { id: 'jakin-future', verbId: 'jakin', tense: 'future' },
  { id: 'joan-future', verbId: 'joan', tense: 'future' },
  { id: 'etorri-future', verbId: 'etorri', tense: 'future' },
  { id: 'jan-future', verbId: 'jan', tense: 'future' },
  { id: 'edan-future', verbId: 'edan', tense: 'future' },
  { id: 'erosi-future', verbId: 'erosi', tense: 'future' },
  { id: 'ikusi-future', verbId: 'ikusi', tense: 'future' },
  { id: 'eduki-future', verbId: 'eduki', tense: 'future' },
  { id: 'ibili-future', verbId: 'ibili', tense: 'future' },
  {
    id: 'unit-9-review-1',
    review: true,
    sources: [
      { verbId: 'izan', tense: 'future' },
      { verbId: 'egon', tense: 'future' },
      { verbId: 'ukan', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-2',
    review: true,
    sources: [
      { verbId: 'nahi', tense: 'future' },
      { verbId: 'jakin', tense: 'future' },
      { verbId: 'joan', tense: 'future' },
      { verbId: 'etorri', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-3',
    review: true,
    sources: [
      { verbId: 'jan', tense: 'future' },
      { verbId: 'edan', tense: 'future' },
      { verbId: 'erosi', tense: 'future' },
    ],
  },
  {
    id: 'unit-9-review-4',
    review: true,
    sources: [
      { verbId: 'ikusi', tense: 'future' },
      { verbId: 'eduki', tense: 'future' },
      { verbId: 'ibili', tense: 'future' },
    ],
  },
]

// =============================================================================
// Progress persistence (localStorage)
// =============================================================================

const STORAGE_KEY = 'aditzak:progress:v1'

// Daily streak data lives under its own key — it tracks calendar-day
// activity across all lessons, not any single lesson's progress, and
// shouldn't need a shape-version bump every time `progress` does (or vice
// versa).
const STREAK_STORAGE_KEY = 'aditzak:streak:v1'

// Points ("gems") earned from lesson results, spendable on streak repair.
// Kept in its own key for the same reasons as the daily streak: it tracks
// something orthogonal to any single lesson's progress, and "Reset progress"
// can clear it without a version bump to `progress`/`STORAGE_KEY`.
const POINTS_STORAGE_KEY = 'aditzak:points:v1'

// Tracks the verb/tense/person combinations the learner has gotten wrong on
// the first attempt (see `lessonLogic.js`'s `recordErrors`), used to surface
// extra "weak spot" questions in review lessons (`getWeakSpotQuestions`).
// Its own key for the same reasons as the streak/points: orthogonal to any
// single lesson's progress, and "Reset progress" can clear it without a
// version bump to `progress`/`STORAGE_KEY`.
const ERROR_STORAGE_KEY = 'aditzak:errors:v1'

// `progress`/`dailyStreak`/`points`/`errorStats` each live under their own key
// (see above) but share the same read/write shape: a JSON object, defaulting
// to `{}` if missing or unparsable, silently no-oping if localStorage itself
// is unavailable (private browsing, quota).
function createStorage(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : {}
      } catch {
        return {}
      }
    },
    save(value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // localStorage may be unavailable (private browsing, quota) — ignore.
      }
    },
  }
}

const progressStorage = createStorage(STORAGE_KEY)
const streakStorage = createStorage(STREAK_STORAGE_KEY)
const pointsStorage = createStorage(POINTS_STORAGE_KEY)
const errorStorage = createStorage(ERROR_STORAGE_KEY)

// Looks up a verb's English/Spanish/Basque gloss, falling back to English if
// the active interface language has no translation for this verb.
function verbMeaning(verb, language) {
  return verb.meaning[language] ?? verb.meaning.en
}

// Display copy for a lesson card/row, covering both practice and review
// shapes so `LessonNode`/`ProgressTab`/`LessonResultsScreen` don't each need
// their own branching. `title`/`subtitle` are `{ main, secondary }` pairs —
// mirroring the two-tone "label · detail" layout `LessonNode` already used
// for practice lessons (e.g. "Present · oraina" / "izan — to be") — and
// `heading` is the single-line form `ProgressTab` shows in its flat list.
// Takes `t`/`language` from the caller's `useLanguage()` since this is a
// plain function, not a component.
function describeLesson(lesson, t, language) {
  if (!lesson.review) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    const meta = TENSE_META[lesson.tense]
    const label = t(meta.labelKey)
    return {
      icon: label[0],
      title: { main: label, secondary: meta.basque },
      subtitle: { main: verb.verb, secondary: verbMeaning(verb, language) },
      heading: `${verb.verb} · ${label}`,
    }
  }
  const verbNames = [...new Set(lesson.sources.map(({ verbId }) => VERBS.find((v) => v.id === verbId).verb))]
  const tenseLabels = [...new Set(lesson.sources.map(({ tense }) => t(TENSE_META[tense].labelKey)))]
  const reviewName = verbNames.length > 1 ? t('mixedReview') : t('verbReview', { verb: verbNames[0] })
  return {
    icon: '🔁',
    title: { main: t('reviewLabel'), secondary: tenseLabels.join(' + ') },
    subtitle: { main: verbNames.join(' & '), secondary: t('mixedPractice') },
    heading: `${reviewName} · ${tenseLabels.join(' + ')}`,
  }
}

// =============================================================================
// Small shared bits
// =============================================================================

function TypeBadge({ type }) {
  const { t } = useLanguage()
  const meta = TYPE_META[type]
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {t(meta.labelKey)} · {meta.basqueLabel}
    </span>
  )
}

function AgreementBadge({ role }) {
  const { t } = useLanguage()
  const meta = AGREEMENT_META[role]
  return (
    <span title={t(meta.titleKey)} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {meta.label}
    </span>
  )
}

function DialectBadge({ dialect }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-gray-500">
      {DIALECT_LABELS[dialect] ?? dialect}
    </span>
  )
}

function VerbBadgeRow({ verb }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <TypeBadge type={verb.type} />
      {verb.agreement.map((role) => (
        <AgreementBadge key={role} role={role} />
      ))}
      <DialectBadge dialect={verb.dialect} />
    </div>
  )
}

function Stars({ count }) {
  const { t } = useLanguage()
  return (
    <div className="flex gap-0.5 text-base text-amber-400" aria-label={t('starsLabel', { count })}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? 'opacity-100' : 'opacity-20'}>
          ★
        </span>
      ))}
    </div>
  )
}

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value * 100))
  return (
    <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full rounded-full bg-green-500 transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}

// Looks up a translated phase/stage/unit field from `JOURNEY_TRANSLATIONS`
// (`src/i18n/journeyTranslations.js`), falling back to `journey.js`'s English
// original (`fallback`) for English or any not-yet-translated entry.
function journeyText(scope, id, field, language, fallback) {
  return JOURNEY_TRANSLATIONS[scope]?.[id]?.[field]?.[language] ?? fallback
}

// =============================================================================
// Home screen — lesson selection
// =============================================================================

function LessonNode({ lesson, locked, stars, onSelect }) {
  const { t, language } = useLanguage()
  const { icon, title, subtitle } = describeLesson(lesson, t, language)
  return (
    <button
      type="button"
      id={`lesson-${lesson.id}`}
      disabled={locked}
      onClick={() => onSelect(lesson.id)}
      style={{ minHeight: 48 }}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${
        locked
          ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-60'
          : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${
          locked ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'
        }`}
        aria-hidden="true"
      >
        {locked ? '🔒' : icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {title.main} <span className="font-normal text-gray-400">· {title.secondary}</span>
        </p>
        <p className="truncate text-sm text-gray-500">
          {subtitle.main} — {subtitle.secondary}
        </p>
      </div>
      <Stars count={stars} />
    </button>
  )
}

function LessonList({ lessons, progress, unlockedIds, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => (
        <LessonNode
          key={lesson.id}
          lesson={lesson}
          locked={!unlockedIds.has(lesson.id)}
          stars={progress[lesson.id]?.bestStars ?? 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// A pending unit isn't playable yet, so it renders as a locked roadmap card
// instead of a `LessonNode` — title/focus/payload from `journey.js` give a
// preview of what's coming, with a "Coming soon" badge in place of stars.
// Refresh Gate units (`unit.gate`) get a shield icon instead of a lock to set
// them apart as checkpoints rather than ordinary lessons.
function PendingUnitCard({ unit }) {
  const { t, language } = useLanguage()
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  const payload = unit.payload ? journeyText('units', unit.number, 'payload', language, unit.payload) : null
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 opacity-70">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xl text-gray-400"
        aria-hidden="true"
      >
        {unit.gate ? '🛡️' : '🔒'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-700">
          {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
        </p>
        <p className="mt-0.5 text-sm text-gray-500">{focus}</p>
        {payload && <p className="mt-1 text-sm text-gray-400 italic">{payload}</p>}
        <span className="mt-2 inline-block rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500">{t('comingSoon')}</span>
      </div>
    </div>
  )
}

// An available unit's `lessonIds` point at entries in `LESSONS` — render each
// as a `LessonNode`, with the unit's title/focus from `journey.js` as a label
// above them.
function UnitLessons({ unit, progress, unlockedIds, onSelect }) {
  const { t, language } = useLanguage()
  const lessons = unit.lessonIds.map((id) => LESSONS.find((lesson) => lesson.id === id))
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  return (
    <div>
      <p className="font-semibold text-gray-900">
        {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
      </p>
      <p className="mt-0.5 mb-2 text-sm text-gray-500">{focus}</p>
      <LessonList lessons={lessons} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
    </div>
  )
}

function StageSection({ stage, progress, unlockedIds, onSelect }) {
  const { language } = useLanguage()
  const title = journeyText('stages', stage.id, 'title', language, stage.title)
  return (
    <section className="mb-6">
      <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-400 uppercase">{title}</h3>
      <div className="flex flex-col gap-4">
        {stage.units.map((unit) =>
          unit.status === 'available' ? (
            <UnitLessons key={unit.number} unit={unit} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
          ) : (
            <PendingUnitCard key={unit.number} unit={unit} />
          ),
        )}
      </div>
    </section>
  )
}

function PhaseSection({ phase, progress, unlockedIds, onSelect }) {
  const { language } = useLanguage()
  const title = journeyText('phases', phase.id, 'title', language, phase.title)
  const subtitle = journeyText('phases', phase.id, 'subtitle', language, phase.subtitle)
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {phase.stages.map((stage) => (
        <StageSection key={stage.id} stage={stage} progress={progress} unlockedIds={unlockedIds} onSelect={onSelect} />
      ))}
    </section>
  )
}

// The home tab's lesson list is now driven by `JOURNEY` (`journey.js`) rather
// than `LESSONS` directly: it walks phases → stages → units so the full
// curriculum roadmap is visible, with available units rendering their
// `LessonNode`s and pending units rendering locked `PendingUnitCard`s.
function JourneyTab({ progress, onSelectLesson }) {
  const { t } = useLanguage()
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress), [progress])

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">{t('homeIntro')}</p>
      {JOURNEY.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} progress={progress} unlockedIds={unlockedIds} onSelect={onSelectLesson} />
      ))}
    </div>
  )
}

function ProgressTab({ progress }) {
  const { t, tCount, language } = useLanguage()
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">{t('progressTitle')}</h2>
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const { heading } = describeLesson(lesson, t, language)
          const entry = progress[lesson.id]
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">
                  {entry
                    ? `${t('progressBest', { best: entry.bestScore, total: entry.totalQuestions })} · ${tCount('attempt', entry.attempts)}`
                    : t('progressNotStarted')}
                </p>
              </div>
              <Stars count={entry?.bestStars ?? 0} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Cloudflare Worker endpoint for feedback submissions — see
// docs/CLOUDFLARE_FEEDBACK_WORKER.md. Injected at build time, following the
// same "env var, no committed default" approach as src/analytics.js's
// PostHog overrides (the worker URL isn't known/committed yet).
const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACK_API_URL
// Mirrors the worker's own limits (worker/src/index.js).
const FEEDBACK_MESSAGE_MAX_LENGTH = 2000
const FEEDBACK_EMAIL_MAX_LENGTH = 320

function FeedbackModal({ onClose }) {
  const { t } = useLanguage()
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  async function handleSubmit(event) {
    event.preventDefault()
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: email.trim(), context: 'profile' }),
      })
      if (!response.ok) throw new Error('Feedback request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="feedback-title" className="text-lg font-bold text-gray-900">
            {t('feedbackTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('feedbackClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl" aria-hidden="true">
              ✅
            </span>
            <p className="text-sm text-gray-700">{t('feedbackSuccess')}</p>
            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: 48 }}
              className="w-full rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
            >
              {t('feedbackClose')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="feedback-message" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackMessageLabel')}
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('feedbackMessagePlaceholder')}
                maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
                rows={4}
                required
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="feedback-email" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackEmailLabel')}
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('feedbackEmailPlaceholder')}
                maxLength={FEEDBACK_EMAIL_MAX_LENGTH}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {status === 'error' && <p className="text-sm text-red-500">{t('feedbackError')}</p>}
            <button
              type="submit"
              disabled={status === 'sending' || !message.trim()}
              style={{ minHeight: 48 }}
              className="rounded-2xl bg-green-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'sending' ? t('feedbackSending') : t('feedbackSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function ProfileTab({ streak, points, onResetProgress, onRepairStreak, onOpenFeedback }) {
  const { t, tCount, language, setLanguage, languages } = useLanguage()
  const today = getLocalDateString()
  const currentStreak = getActiveStreak(streak, today)
  const longestStreak = streak?.longestStreak ?? 0
  const balance = points?.balance ?? 0
  const canRepair = canRepairStreak(streak, points, today)
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">🧑‍🎓</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('profileGreeting')}</h2>
        <p className="text-sm text-gray-500">{t('profileAchievements')}</p>
      </div>
      <div className="flex w-full gap-3">
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            🔥
          </span>
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', currentStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakCurrent')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            🏆
          </span>
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', longestStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakLongest')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="text-2xl" aria-hidden="true">
            💎
          </span>
          <span className="text-lg font-bold text-gray-900">{balance}</span>
          <span className="text-xs text-gray-500">{t('pointsBalance')}</span>
        </div>
      </div>
      {canRepair && (
        <div className="w-full rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-bold text-orange-700">{t('streakRepairTitle')}</p>
          <p className="mt-1 text-xs text-orange-600">{t('streakRepairDescription', { cost: STREAK_REPAIR_COST })}</p>
          <button
            type="button"
            onClick={onRepairStreak}
            style={{ minHeight: 48 }}
            className="mt-3 w-full rounded-2xl bg-orange-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-orange-600 active:scale-[0.98]"
          >
            {t('streakRepairButton', { cost: STREAK_REPAIR_COST })}
          </button>
        </div>
      )}
      <div className="w-full">
        <p className="mb-1 text-sm font-semibold text-gray-700">{t('profileLanguage')}</p>
        <p className="mb-2 text-xs text-gray-400">{t('profileLanguageHint')}</p>
        <div className="flex justify-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              style={{ minHeight: 48 }}
              className={`flex-1 rounded-2xl border-2 px-3 text-sm font-bold transition ${
                language === lang.code
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenFeedback}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
      >
        {t('profileFeedback')}
      </button>
      <button
        type="button"
        onClick={onResetProgress}
        style={{ minHeight: 48 }}
        className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
      >
        {t('profileResetProgress')}
      </button>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', labelKey: 'navLearn', icon: '🏠' },
  { id: 'progress', labelKey: 'navProgress', icon: '📊' },
  { id: 'profile', labelKey: 'navProfile', icon: '🧑‍🎓' },
]

function BottomNav({ active, onSelect }) {
  const { t } = useLanguage()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md border-t border-gray-200 bg-white">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          style={{ minHeight: 56 }}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold transition ${
            active === item.id ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl leading-none" aria-hidden="true">
            {item.icon}
          </span>
          {t(item.labelKey)}
        </button>
      ))}
    </nav>
  )
}

function HomeScreen({ progress, streak, points, tab, onChangeTab, onSelectLesson, onResetProgress, onRepairStreak, scrollTarget }) {
  const { t } = useLanguage()
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const maxStars = LESSONS.length * 3
  const currentStreak = getActiveStreak(streak, getLocalDateString())
  const balance = points?.balance ?? 0
  const [showFeedback, setShowFeedback] = useState(false)

  // Restores the scroll position the learner had before starting an exercise,
  // or — on the very first load — jumps straight to the last lesson they
  // completed, so returning learners don't land back at the top of the whole
  // journey. Runs once per mount (HomeScreen unmounts while an exercise is
  // active), using whichever `scrollTarget` was current at mount time. The
  // `requestAnimationFrame` defers until after layout, since the lesson list
  // isn't at its final height yet on the same tick as the initial commit.
  useEffect(() => {
    if (!scrollTarget) return
    requestAnimationFrame(() => {
      if (scrollTarget.type === 'restore') {
        window.scrollTo(0, scrollTarget.y)
      } else if (scrollTarget.type === 'lastLesson') {
        document.getElementById(`lesson-${scrollTarget.lessonId}`)?.scrollIntoView?.({ block: 'center' })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Aditzak</h1>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-600"
            aria-label={t('streakLabel', { count: currentStreak })}
          >
            <span aria-hidden="true">🔥</span>
            <span>{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
            <span aria-hidden="true">★</span>
            <span>
              {totalStars}
              <span className="font-normal text-amber-500">/{maxStars}</span>
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-700"
            aria-label={t('pointsLabel', { count: balance })}
          >
            <span aria-hidden="true">💎</span>
            <span>{balance}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-28">
        {tab === 'home' && <JourneyTab progress={progress} onSelectLesson={onSelectLesson} />}
        {tab === 'progress' && <ProgressTab progress={progress} />}
        {tab === 'profile' && (
          <ProfileTab
            streak={streak}
            points={points}
            onResetProgress={onResetProgress}
            onRepairStreak={onRepairStreak}
            onOpenFeedback={() => setShowFeedback(true)}
          />
        )}
      </main>

      <BottomNav active={tab} onSelect={onChangeTab} />

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  )
}

// =============================================================================
// Exercise screen — multiple choice and typed-answer questions
// =============================================================================

// A practice lesson has a single source (itself); a review lesson draws from
// several. Either way, `generateQuestions` runs once per source and the
// results are interleaved into one shuffled queue — so a review session mixes
// its conjugation tables together rather than working through them block by
// block.
//
// `noTyping` (see `generateQuestions`) keeps a learner's first
// `NO_TYPING_ATTEMPTS` runs through a *practice* lesson restricted to
// recognition questions — bare forms plus multiple-choice sentence/pronoun
// fill-ins, but no typing or spot-the-error — so a brand-new paradigm is met
// with real example sentences right away, just without being asked to recall
// or cross-check a form from scratch yet. Review lessons always show the full
// mix: by the time a review exists, every form in it has already had its own
// recognition-only introduction.
const NO_TYPING_ATTEMPTS = 2

// A lesson's conjugation table only has 3-6 grammatical persons, which at one
// question per person (the old behaviour) made for a session over in under a
// minute — too short to give a form more than a single retrieval attempt.
// `TARGET_EXERCISE_COUNT` is the rough total a session should reach; for each
// source, `generateQuestions`'s `rounds` is set so that source's
// (persons × rounds) lands close to its even share of the target — e.g. a
// single 3-person source gets 4 rounds (12 questions), while a review with two
// 3-person sources gets 2 rounds each (6 + 6 = 12). Each round is
// independently shuffled and re-rolled, so repeats vary in order and framing
// rather than presenting the exact same question twice in a row.
const TARGET_EXERCISE_COUNT = 12

function createExerciseState(lesson, attempts, errorStats = {}) {
  const sources = lesson.sources ?? [{ verbId: lesson.verbId, tense: lesson.tense }]
  const noTyping = !lesson.review && attempts < NO_TYPING_ATTEMPTS
  const targetPerSource = TARGET_EXERCISE_COUNT / sources.length
  const questions = sources.flatMap(({ verbId, tense }) => {
    const verb = VERBS.find((v) => v.id === verbId)
    const personCount = Object.keys(verb.conjugations[tense]).length
    const rounds = Math.max(1, Math.round(targetPerSource / personCount))
    return generateQuestions(verb, tense, { noTyping, rounds, includeNegation: Boolean(lesson.negation) })
  })
  // Review lessons get up to `EXTRA_REVIEW_EXERCISES` extra questions, drawn
  // from the verb/tense/person combinations this learner has most often
  // gotten wrong on the first try (see `getWeakSpotQuestions`) — extra
  // reinforcement for exactly the forms that need it, on top of the review's
  // normal cross-section.
  const extraQuestions = lesson.review ? getWeakSpotQuestions(errorStats, sources, VERBS) : []
  const allQuestions = shuffle([...questions, ...extraQuestions])
  return {
    queue: allQuestions,
    total: allQuestions.length,
    selected: null,
    status: 'active', // 'active' | 'correct' | 'incorrect'
    correctCount: 0,
    streak: 0,
    misses: [],
  }
}

// Shown once, before a learner's very first attempt at a (non-review)
// lesson: every person's conjugated form for this lesson's verb/tense, laid
// out as a plain list, so the whole paradigm is visible before any question
// is asked. Pairs with `NO_TYPING_ATTEMPTS` — the learner sees the full table
// here, then spends their first attempts recognising those same forms, in
// isolation and in example sentences, before typed answers and
// spot-the-error are introduced.
function ConjugationTable({ verb, tense }) {
  const { t } = useLanguage()
  const table = verb.conjugations[tense]
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      {Object.entries(table).map(([person, form], index) => (
        <div key={person} className={`flex items-center justify-between px-4 py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div>
            <p className="font-semibold text-gray-800">{(verb.pronouns?.[person] ?? person).toLowerCase()}</p>
            <p className="text-xs text-gray-400">{t(PERSON_LABEL_KEYS[person])}</p>
          </div>
          <p className="text-xl font-extrabold text-gray-900">{form}</p>
        </div>
      ))}
    </div>
  )
}

function LessonPreviewScreen({ verb, tense, tenseMeta, onStart, onExit }) {
  const { t, language } = useLanguage()
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onExit}
          aria-label={t('exitLessonLabel')}
          style={{ minHeight: 48, minWidth: 48 }}
          className="flex items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-4">
        <div className="mb-6">
          <VerbBadgeRow verb={verb} />
        </div>
        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
          {verb.verb} — {verbMeaning(verb, language)} · {t(tenseMeta.labelKey)}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">{t('previewTitle')}</h2>
        <p className="mt-1 text-gray-500">{t('previewSubtitle')}</p>
        <div className="mt-6">
          <ConjugationTable verb={verb} tense={tense} />
        </div>
      </div>

      <div className="px-5 pt-4 pb-6">
        <button
          type="button"
          onClick={onStart}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
        >
          {t('start')}
        </button>
      </div>
    </div>
  )
}

// On a correct answer we reveal which option it was; on an incorrect one we
// only flag the wrong pick — the correct form stays hidden so the learner has
// to actually recall it when this question comes back around.
function getOptionStatus(option, question, state) {
  if (state.status === 'active') return 'idle'
  if (state.status === 'correct') return option === question.correct ? 'correct' : 'idle'
  return option === state.selected ? 'incorrect' : 'idle'
}

const OPTION_STYLES = {
  idle: 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50',
  correct: 'border-green-500 bg-green-50 text-green-700 animate-flash',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function AnswerOption({ option, status, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{ minHeight: 48 }}
      className={`w-full rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold transition ${OPTION_STYLES[status]} ${
        disabled ? 'cursor-default' : 'active:scale-[0.98]'
      }`}
    >
      {option}
    </button>
  )
}

// Typed-answer questions (`type-verb` / `type-pronoun`, identifiable by having
// no `options`) swap the option list for a text field — same idle/correct/
// incorrect palette as `AnswerOption` (down to reusing the flash/shake
// animations), so the feedback reads consistently across both interaction
// styles even though one is a button grid and the other a form field. As with
// multiple choice, an incorrect submission doesn't reveal the right spelling —
// the learner has to actually recall it when the question resurfaces.
const TYPED_INPUT_STYLES = {
  active: 'border-gray-200 bg-white text-gray-800 focus:border-green-400',
  correct: 'border-green-500 bg-green-50 text-green-700 animate-flash',
  incorrect: 'border-red-500 bg-red-50 text-red-700 animate-shake',
}

function TypedAnswerInput({ value, status, onChange, onSubmit }) {
  const { t } = useLanguage()
  const isAnswered = status !== 'active'
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-3"
    >
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder={t('typeAnswerPlaceholder')}
        aria-label={t('typeAnswerLabel')}
        value={value}
        disabled={isAnswered}
        onChange={(event) => onChange(event.target.value)}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl border-2 px-5 py-4 text-lg font-semibold transition focus:outline-none ${TYPED_INPUT_STYLES[status]} ${
          isAnswered ? 'cursor-default' : ''
        }`}
      />
      {!isAnswered && (
        <button
          type="submit"
          disabled={value.trim() === ''}
          style={{ minHeight: 48 }}
          className="w-full rounded-2xl bg-green-500 px-5 py-4 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('check')}
        </button>
      )}
    </form>
  )
}

// Renders an example sentence with the conjugated verb redacted — the `___`
// placeholder in the data becomes a visual blank the learner fills in by
// picking an option below, rather than a literal "___" in running text.
function SentenceWithBlank({ sentence }) {
  const [before, after] = sentence.split('___')
  return (
    <p className="mt-3 text-2xl leading-snug font-extrabold text-gray-900">
      {before}
      <span className="mx-1 inline-block w-16 border-b-4 border-dashed border-gray-300 align-middle" aria-hidden="true" />
      {after}
    </p>
  )
}

// `generateQuestions` mixes six question styles, but they differ along just a
// couple of independent axes: how the prompt is framed — a bare person/label
// pair, a single sentence with a blank (keyed off `question.sentence` rather
// than listing every blanked `kind`, so this stays correct as new framings are
// added), or — uniquely for `spot-error` — nothing extra at all, since its
// four already-filled-in sentences (`question.items`) double as both the
// prompt and the answer options rendered below — and how the answer is given:
// multiple choice when `question.options` is present, typed in otherwise (see
// `ExerciseScreen`). Every combination still tests recognising/recalling the
// right Basque form, just packaged differently.
function QuestionPrompt({ verb, tenseMeta, question }) {
  const { t, language } = useLanguage()
  return (
    <>
      <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
        {verb.verb} — {verbMeaning(verb, language)} · {t(tenseMeta.labelKey)}
      </p>
      {question.sentence ? (
        <SentenceWithBlank sentence={question.sentence} />
      ) : question.items ? null : (
        <>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
            {(verb.pronouns?.[question.person] ?? question.person).toLowerCase()}
          </h2>
          <p className="mt-1 text-gray-500">{t(PERSON_LABEL_KEYS[question.person])}</p>
        </>
      )}
    </>
  )
}

// Maps each question `kind` to the translation key for its instruction line
// (`src/i18n/translations.js`) — looked up via `t()` in `ExerciseScreen`.
const QUESTION_PROMPT_KEYS = {
  form: 'questionForm',
  sentence: 'questionSentence',
  'spot-error': 'questionSpotError',
  pronoun: 'questionPronoun',
  'type-verb': 'questionTypeVerb',
  'type-pronoun': 'questionTypePronoun',
  negative: 'questionNegation',
  'type-negative': 'questionTypeNegation',
}

// The explanation toggle is its own pill-shaped button above the
// Continue/Finish button — collapsed by default so it doesn't compete with
// the main "what happened" feedback, but styled to invite a tap (lightbulb
// icon, dashed border, chevron that flips when open) rather than reading as
// throwaway fine print. `showExplanation`/`onToggleExplanation` are owned by
// `ExerciseScreen` (reset alongside the rest of the per-question feedback
// state), not local to this component, so they can be reset together with
// `streakEncouragement`/`typedValue` when a new question comes up.
function ExplanationToggle({ explanation, expanded, onToggle }) {
  const { t } = useLanguage()
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={onToggle}
        style={{ minHeight: 48 }}
        className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-green-300 bg-white px-4 text-left text-sm font-bold text-green-700 transition hover:border-green-400 hover:bg-green-50"
      >
        <span className="text-xl" aria-hidden="true">
          💡
        </span>
        <span className="flex-1">{t('explanationToggle')}</span>
        <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {expanded && <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">{explanation}</p>}
    </div>
  )
}

function FeedbackBar({ status, isLast, streakEncouragement, explanation, showExplanation, onToggleExplanation, onContinue }) {
  const { t } = useLanguage()
  if (status === 'active') return null
  const isCorrect = status === 'correct'
  return (
    <div className={`px-5 pt-4 pb-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`mb-3 flex items-center gap-2 text-lg font-extrabold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        <span className="text-2xl" aria-hidden="true">
          {streakEncouragement ? streakEncouragement.icon : isCorrect ? '✓' : '✕'}
        </span>
        {streakEncouragement ? (
          <span>
            {streakEncouragement.headline} {t(streakEncouragement.messageKey)}
          </span>
        ) : isCorrect ? (
          <span>{t('feedbackCorrect')}</span>
        ) : (
          <span>{t('feedbackIncorrect')}</span>
        )}
      </p>
      {isCorrect && explanation && (
        <ExplanationToggle explanation={explanation} expanded={showExplanation} onToggle={onToggleExplanation} />
      )}
      <button
        type="button"
        onClick={onContinue}
        style={{ minHeight: 48 }}
        className={`w-full rounded-2xl text-lg font-extrabold tracking-wide text-white uppercase transition active:scale-[0.98] ${
          isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLast ? t('finish') : t('continue')}
      </button>
    </div>
  )
}

// Celebration confetti/fireworks shown for a perfect (3-star) result. Picked
// once per results screen — via the lazy `useState` initializer below, the
// same pattern `createExerciseState` uses for `shuffle` — so a perfect score
// doesn't always trigger the identical animation, but it also doesn't
// re-roll (and re-trigger) on every re-render.
const CELEBRATION_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6']
const CONFETTI_PIECE_COUNT = 50
const FIREWORK_BURST_COUNT = 3
const FIREWORK_PARTICLES_PER_BURST = 12

function createCelebration() {
  if (Math.random() < 0.5) {
    const pieces = Array.from({ length: CONFETTI_PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.6,
      rotation: Math.round(Math.random() * 360),
      drift: Math.round((Math.random() - 0.5) * 160),
    }))
    return { effect: 'confetti', pieces }
  }

  const bursts = Array.from({ length: FIREWORK_BURST_COUNT }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    top: 15 + Math.random() * 45,
    color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
    delay: i * 0.3 + Math.random() * 0.2,
  }))
  return { effect: 'fireworks', bursts }
}

function Celebration({ celebration }) {
  if (celebration.effect === 'confetti') {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
        {celebration.pieces.map((piece) => (
          <span
            key={piece.id}
            className="animate-confetti-fall absolute -top-4 block h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--confetti-rotation': `${piece.rotation}deg`,
              '--confetti-drift': `${piece.drift}px`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {celebration.bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: `${burst.left}%`, top: `${burst.top}%` }}>
          {Array.from({ length: FIREWORK_PARTICLES_PER_BURST }).map((_, i) => (
            <span
              key={i}
              className="animate-firework absolute h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: burst.color,
                animationDelay: `${burst.delay}s`,
                '--firework-angle': `${(360 / FIREWORK_PARTICLES_PER_BURST) * i}deg`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function LessonResultsScreen({ lesson, correctCount, total, pointsEarned, onDone }) {
  const { t, tCount, language } = useLanguage()
  const stars = computeStars(correctCount, total)
  const [variantIndex] = useState(() => pickEncouragementVariantIndex(correctCount, total))
  const [celebration] = useState(() => (stars === 3 ? createCelebration() : null))
  const { icon, headline, messageKey } = getEncouragement(correctCount, total, variantIndex)
  const { heading } = describeLesson(lesson, t, language)

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-5 bg-white px-8 text-center">
      {celebration && <Celebration celebration={celebration} />}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">{headline}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {heading} — {t('resultsScore', { correct: correctCount, total })}
        </p>
      </div>
      <Stars count={stars} />
      {pointsEarned > 0 && (
        <p className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-700">
          <span aria-hidden="true">💎</span>
          {tCount('pointsEarned', pointsEarned)}
        </p>
      )}
      <p className="text-base text-gray-600">{t(messageKey)}</p>
      <button
        type="button"
        onClick={onDone}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl bg-green-500 text-lg font-extrabold tracking-wide text-white uppercase transition hover:bg-green-600 active:scale-[0.98]"
      >
        {t('continue')}
      </button>
    </div>
  )
}

// Showing a streak nudge every single time someone hits a milestone would
// get mechanical fast, so it's gated two ways: a session-level cooldown
// (tracked by `App` in lessons, reset to a random span once a nudge is
// shown) and, even once eligible, only a chance of actually firing — so it
// reads as an occasional surprise rather than a predictable popup.
const STREAK_NUDGE_COOLDOWN_RANGE = [2, 4] // lessons to wait before the next one
const STREAK_NUDGE_CHANCE = 0.6

function randomStreakNudgeCooldown() {
  const [min, max] = STREAK_NUDGE_COOLDOWN_RANGE
  return min + Math.floor(Math.random() * (max - min + 1))
}

// Pulled out to its own (impure) function — the `react-hooks/purity` rule
// forbids `Math.random` calls written directly inside component bodies, even
// inside event handlers, since it can't always tell render code from event
// code apart. Calling it from `handleSelect`, in response to an answer, is
// fine: that's an event, not a render.
function rollStreakNudgeChance() {
  return Math.random() < STREAK_NUDGE_CHANCE
}

function ExerciseScreen({ lesson, attempts, errorStats, onExit, onComplete, canShowStreakNudge, onStreakNudgeShown }) {
  const { t } = useLanguage()
  const [state, dispatch] = useReducer(exerciseReducer, undefined, () => createExerciseState(lesson, attempts, errorStats))
  const [finished, setFinished] = useState(false)
  const [streakEncouragement, setStreakEncouragement] = useState(null)
  // Whether the "why is this correct?" panel (see `ExplanationToggle`) is
  // expanded for the current question's feedback — reset to collapsed
  // alongside `streakEncouragement` whenever a new answer is submitted, so
  // each question's explanation starts hidden rather than carrying over the
  // previous question's open/closed state.
  const [showExplanation, setShowExplanation] = useState(false)
  // Only used by typed-answer questions (`question.options` absent) — reset
  // whenever a new question comes up so the field doesn't carry over what was
  // typed for the previous one.
  const [typedValue, setTypedValue] = useState('')
  // Shown once, before the first attempt at a (non-review) lesson — see
  // `LessonPreviewScreen`. Review lessons skip it: every form they cover has
  // already had its own practice-lesson intro.
  const [showPreview, setShowPreview] = useState(!lesson.review && attempts === 0)

  // Fires once the learner is actually answering questions — on mount for
  // review/repeat lessons (which skip the preview), or once the preview's
  // "Start" button is dismissed for a lesson's first attempt.
  useEffect(() => {
    if (showPreview) return
    trackEvent('lesson_started', {
      lessonId: lesson.id,
      review: Boolean(lesson.review),
      attemptNumber: attempts + 1,
      ...(lesson.review ? {} : { verbId: lesson.verbId, tense: lesson.tense }),
    })
  }, [showPreview, lesson, attempts])

  if (showPreview) {
    const verb = VERBS.find((v) => v.id === lesson.verbId)
    return (
      <LessonPreviewScreen
        verb={verb}
        tense={lesson.tense}
        tenseMeta={TENSE_META[lesson.tense]}
        onStart={() => setShowPreview(false)}
        onExit={onExit}
      />
    )
  }

  const total = state.total
  const question = state.queue[0]
  const isAnswered = state.status !== 'active'
  // Finishing means the queue is about to empty — only true once the *last*
  // remaining question has been answered correctly; an incorrect answer to it
  // sends it back to the queue and the lesson carries on.
  const isLast = state.queue.length === 1 && state.status === 'correct'
  // Looked up per *question* rather than once for the whole lesson: a practice
  // lesson's questions all share one verb/tense, but a review lesson's don't —
  // each carries the `verbId`/`tense` it was generated from (see
  // `generateQuestions`), so the prompt and badges always match what's
  // actually being asked, even as that changes question to question.
  const verb = VERBS.find((v) => v.id === question.verbId)
  const tenseMeta = TENSE_META[question.tense]
  const progressValue = (state.total - state.queue.length + (state.status === 'correct' ? 1 : 0)) / total

  // Shared by both interaction styles — a clicked multiple-choice option and a
  // typed-and-submitted string both resolve to "an answer was given for the
  // current question", compared the same forgiving way (`isAnswerCorrect`).
  function submitAnswer(value) {
    if (isAnswered || value === '') return
    // Decided here, at answer time, rather than during render: it rolls the
    // dice, and React render functions must stay pure/idempotent. Gated by
    // the session-level cooldown `App` tracks, plus a chance check, so a
    // milestone streak doesn't *always* trigger a nudge — it should read as
    // an occasional surprise, not a mechanical popup.
    const isCorrect = isAnswerCorrect(value, question.correct)
    const milestone = isCorrect ? getStreakEncouragement(state.streak + 1) : null
    const showEncouragement = milestone !== null && canShowStreakNudge && rollStreakNudgeChance()
    setStreakEncouragement(showEncouragement ? milestone : null)
    if (showEncouragement) onStreakNudgeShown()
    setShowExplanation(false)
    dispatch({ type: 'answer', option: value })
  }

  function handleSubmitTyped() {
    submitAnswer(typedValue.trim())
  }

  function handleContinue() {
    if (isLast) {
      setFinished(true)
    } else {
      setTypedValue('')
      dispatch({ type: 'next' })
    }
  }

  if (finished) {
    return (
      <LessonResultsScreen
        lesson={lesson}
        correctCount={state.correctCount}
        total={total}
        pointsEarned={computeLessonPoints(state.correctCount, total, attempts > 0)}
        onDone={() => onComplete({ correctCount: state.correctCount, total, misses: state.misses })}
      />
    )
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onExit}
          aria-label={t('exitLessonLabel')}
          style={{ minHeight: 48, minWidth: 48 }}
          className="flex items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
        <ProgressBar value={progressValue} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-8">
        <div className="mb-6">
          <VerbBadgeRow verb={verb} />
        </div>

        <QuestionPrompt verb={verb} tenseMeta={tenseMeta} question={question} />

        <p className="mt-8 mb-3 text-base font-semibold text-gray-700">{t(QUESTION_PROMPT_KEYS[question.kind])}</p>
        {question.options ? (
          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <AnswerOption
                key={option}
                option={option}
                status={getOptionStatus(option, question, state)}
                disabled={isAnswered}
                onSelect={() => submitAnswer(option)}
              />
            ))}
          </div>
        ) : (
          <TypedAnswerInput value={typedValue} status={state.status} onChange={setTypedValue} onSubmit={handleSubmitTyped} />
        )}
      </div>

      <FeedbackBar
        status={state.status}
        isLast={isLast}
        streakEncouragement={streakEncouragement}
        explanation={state.status === 'correct' ? getExplanation(verb, question, t) : null}
        showExplanation={showExplanation}
        onToggleExplanation={() => setShowExplanation((expanded) => !expanded)}
        onContinue={handleContinue}
      />
    </div>
  )
}

// =============================================================================
// App shell
// =============================================================================

// Shown once, before anything else, when no source language has been chosen
// yet (`hasChosenLanguage` is false — see `LanguageContext`) — a "fancy"
// full-screen selector so a first-time visitor picks the language they
// already know before seeing any lesson content. Euskara is listed first
// (per `LANGUAGES`) and flagged as recommended, since most Aditzak users
// already have some grounding in Basque. Picking a language calls
// `setLanguage`, which persists the choice and flips `hasChosenLanguage`, so
// this screen doesn't render again.
function LanguageOnboardingScreen() {
  const { t, setLanguage, languages } = useLanguage()
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-8 bg-gradient-to-b from-green-50 to-white px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl" aria-hidden="true">
        🌍
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('onboardingTitle')}</h1>
        <p className="mt-2 text-gray-500">{t('onboardingSubtitle')}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            style={{ minHeight: 64 }}
            className={`flex items-center justify-between rounded-2xl border-2 px-5 text-left text-lg font-bold transition active:scale-[0.98] ${
              lang.code === 'eu'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {lang.name}
            {lang.code === 'eu' && (
              <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">{t('onboardingRecommended')}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function AppShell() {
  const { t, hasChosenLanguage } = useLanguage()
  const [progress, setProgress] = useState(progressStorage.load)
  const [dailyStreak, setDailyStreak] = useState(streakStorage.load)
  const [points, setPoints] = useState(pointsStorage.load)
  const [errorStats, setErrorStats] = useState(errorStorage.load)
  const [tab, setTab] = useState('home')
  const [activeLessonId, setActiveLessonId] = useState(null)
  // Session-level gate for the mid-lesson streak nudge: counts down once a
  // nudge has been shown, so the next one waits a few lessons rather than
  // popping up again the moment another milestone streak comes around.
  const [streakNudgeCooldown, setStreakNudgeCooldown] = useState(0)
  // Where the home screen should scroll to the next time it mounts: the last
  // lesson the learner completed on initial load, or the scroll position they
  // had before starting an exercise when they return from one.
  const [homeScrollTarget, setHomeScrollTarget] = useState(() => {
    const lastLessonId = getLastPlayedLessonId(progressStorage.load())
    return lastLessonId ? { type: 'lastLesson', lessonId: lastLessonId } : null
  })
  const scrollBeforeLessonRef = useRef(null)

  useEffect(() => {
    progressStorage.save(progress)
  }, [progress])

  useEffect(() => {
    streakStorage.save(dailyStreak)
  }, [dailyStreak])

  useEffect(() => {
    pointsStorage.save(points)
  }, [points])

  useEffect(() => {
    errorStorage.save(errorStats)
  }, [errorStats])

  const handleStreakNudgeShown = useCallback(() => {
    setStreakNudgeCooldown(randomStreakNudgeCooldown())
  }, [])

  function handleResetProgress() {
    if (typeof window !== 'undefined' && !window.confirm(t('profileResetConfirm'))) {
      return
    }
    setProgress({})
    setDailyStreak({})
    setPoints({})
    setErrorStats({})
  }

  function handleRepairStreak() {
    if (typeof window !== 'undefined' && !window.confirm(t('streakRepairConfirm', { cost: STREAK_REPAIR_COST }))) {
      return
    }
    const { streak, points: nextPoints } = repairStreak(dailyStreak, points, getLocalDateString())
    setDailyStreak(streak)
    setPoints(nextPoints)
  }

  function handleSelectLesson(lessonId) {
    scrollBeforeLessonRef.current = window.scrollY
    setActiveLessonId(lessonId)
  }

  function handleReturnToHome() {
    setHomeScrollTarget(
      scrollBeforeLessonRef.current !== null ? { type: 'restore', y: scrollBeforeLessonRef.current } : null,
    )
    scrollBeforeLessonRef.current = null
    setActiveLessonId(null)
  }

  if (!hasChosenLanguage) {
    return <LanguageOnboardingScreen />
  }

  if (activeLessonId) {
    const lesson = LESSONS.find((l) => l.id === activeLessonId)
    return (
      <ExerciseScreen
        key={lesson.id}
        lesson={lesson}
        attempts={progress[lesson.id]?.attempts ?? 0}
        errorStats={errorStats}
        onExit={handleReturnToHome}
        canShowStreakNudge={streakNudgeCooldown === 0}
        onStreakNudgeShown={handleStreakNudgeShown}
        onComplete={(result) => {
          const isRepeat = (progress[lesson.id]?.attempts ?? 0) > 0
          const pointsEarned = computeLessonPoints(result.correctCount, result.total, isRepeat)
          trackEvent('lesson_completed', {
            lessonId: lesson.id,
            review: Boolean(lesson.review),
            correctCount: result.correctCount,
            total: result.total,
            stars: computeStars(result.correctCount, result.total),
            isRepeat,
            pointsEarned,
          })
          setProgress((previous) => recordResult(previous, lesson.id, result))
          setDailyStreak((previous) => recordDailyStreak(previous, getLocalDateString()))
          setPoints((previous) => addPoints(previous, pointsEarned))
          setErrorStats((previous) => recordErrors(previous, result.misses))
          setStreakNudgeCooldown((cooldown) => Math.max(0, cooldown - 1))
          handleReturnToHome()
        }}
      />
    )
  }

  return (
    <HomeScreen
      progress={progress}
      streak={dailyStreak}
      points={points}
      tab={tab}
      onChangeTab={setTab}
      onSelectLesson={handleSelectLesson}
      onResetProgress={handleResetProgress}
      onRepairStreak={handleRepairStreak}
      scrollTarget={homeScrollTarget}
    />
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
