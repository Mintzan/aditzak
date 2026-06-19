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
// `object` names a fixed absolutive (`nor`) argument — always `'hura'` so
// far. For `nor-nork` verbs it's the fixed *object* ("it/him/her", citation
// paradigm); #146 reuses it the same way for `nor-nori` (dative-subject /
// "psych") verbs like `gustatu`, where `nor` ("it") is likewise fixed to
// `hura` and `person` instead ranges over `nori` (CONJUGATIONS.md §4).
// NOR-NORI-NORK (ditransitive) verbs' `conjugations`
// are genuinely 2D (NORK x NORI — see `CONJUGATIONS.md` §5), which a single
// `person` key can't represent; #142's axis-fixed approach instead fixes one
// of the two free arguments per verb/lesson, mirroring `object`:
//   - `recipient` fixes NORI, so `person` varies over NORK (e.g.
//     `recipient: 'hura'` -> `conjugations[tense]` is `diot`/`diozu`/`dio`/...
//     "I/you/he tell *him*").
//   - `agent` fixes NORK, so `person` varies over NORI (e.g. `agent: 'ni'` ->
//     `conjugations[tense]` is `diot`/`dizut`/`diet`/... "I tell him/you/them").
// Exactly one of the two is set on a ditransitive verb; `getFixedArgument`
// (`lessonLogic.js`) resolves either into `{ role, person }` for the UI.
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

// Locate a specific verb: grep for `id: 'verbId'` (e.g. `id: 'izan'`) — each
// verb's whole block starts there.

export const VERBS = [
  {
    id: 'izan',
    verb: 'izan',
    meaning: { en: 'to be', es: 'ser / estar', eu: 'izan' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: { ni: 'naiz', hi: 'haiz', zu: 'zara', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
      past: { ni: 'nintzen', hi: 'hintzen', zu: 'zinen', hura: 'zen', gu: 'ginen', zuek: 'zineten', haiek: 'ziren' },
      future: {
        ni: 'izango naiz',
        zu: 'izango zara',
        hura: 'izango da',
        gu: 'izango gara',
        zuek: 'izango zarete',
        haiek: 'izango dira',
      },
      // #148 core scope — Ahalera (potential, "can be"), Baldintza (if-clause,
      // "if I were"), and Ondorioa present (apodosis, "would be"), all
      // directly tabulated in `docs/CONJUGATIONS.md` §2. Form-only (no
      // `sentences`/`pronounSentences`) — see `docs/DECISIONS.md`.
      potential: { ni: 'naiteke', hi: 'haiteke', zu: 'zaitezke', hura: 'daiteke', gu: 'gaitezke', zuek: 'zaitezkete', haiek: 'daitezke' },
      baldintza: { ni: 'banintz', hi: 'bahintz', zu: 'bazina', hura: 'balitz', gu: 'bagina', zuek: 'bazinete', haiek: 'balira' },
      conditional: {
        ni: 'nintzateke',
        hi: 'hintzateke',
        zu: 'zinateke',
        hura: 'litzateke',
        gu: 'ginateke',
        zuek: 'zinatekete',
        haiek: 'lirateke',
      },
      // #167 core scope — Toka/Noka (masculine/feminine allocutive marking):
      // addressee-agreement layered onto a 3rd-person statement, independent
      // of the statement's own subject. `da`/`dira` are suppletive here
      // (switch to the `du`-stem before adding `-k`/`-n`: `duk`/`dun`,
      // `dituk`/`ditun`, not `†dak`/`†dan`), per CONJUGATIONS.md §10. Only
      // `hura`/`haiek` are tabulated there — a full grid (every person) isn't
      // given, so this stays a 2-person table like the doc itself. Past
      // inserts `-a-`/`-na-` before the final `-n` (`zen` -> `zuan`/`zunan`,
      // `ziren` -> `zituan`/`zitunan`). Flagged in LANGUAGE_DECISIONS.md for
      // native-speaker confirmation.
      presentToka: { hura: 'duk', haiek: 'dituk' },
      presentNoka: { hura: 'dun', haiek: 'ditun' },
      pastToka: { hura: 'zuan', haiek: 'zituan' },
      pastNoka: { hura: 'zunan', haiek: 'zitunan' },
      // #171 core scope — Agintera (imperative), second-person only (no
      // ni/hura/gu/haiek cells exist — §9/§16.2). `hi` is invariant (`izan`'s
      // `hi` is NOR, not NORK, so no allocutive-style gender split here,
      // unlike `ukan`'s imperative below). 3rd-person jussive (`bedi`/
      // `bitez`) and 1st-person hortative are out of scope for this table —
      // see the issue filed for #171's remaining scope.
      imperative: { hi: 'hadi', zu: 'zaitez', zuek: 'zaitezte' },
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
      past: {
        ni: [
          { text: 'Ni atzo irakaslea ___.', validFor: [] },
          { text: 'Ni herenegun ikaslea ___.', validFor: [] },
          { text: 'Ni lehengo egunean aita ___.', validFor: [] },
          { text: 'Ni iaz turista ___.', validFor: [] },
          { text: 'Ni duela bi egun langilea ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zu atzo ikaslea ___.', validFor: [] },
          { text: 'Zu herenegun irakaslea ___.', validFor: [] },
          { text: 'Zu iaz ama ___.', validFor: [] },
          { text: 'Zu joan den astean gidaria ___.', validFor: [] },
          { text: 'Zu lehengo egunean auzokidea ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hura atzo medikua ___.', validFor: [] },
          { text: 'Hura herenegun zuzendaria ___.', validFor: [] },
          { text: 'Hura iaz aitona ___.', validFor: [] },
          { text: 'Hura duela bi egun bidaiaria ___.', validFor: [] },
          { text: 'Hura joan den astean saltzailea ___.', validFor: [] },
          { text: 'Mikel atzo irakaslea ___.', validFor: [] },
          { text: 'Ane herenegun ikaslea ___.', validFor: [] },
          { text: 'Txakurra lehengo egunean handia ___.', validFor: [] },
          { text: 'Katua atzo beltza ___.', validFor: [] },
          { text: 'Autoa iaz berria ___.', validFor: [] },
        ],
        gu: [
          { text: 'Gu atzo ikasleak ___.', validFor: [] },
          { text: 'Gu herenegun irakasleak ___.', validFor: [] },
          { text: 'Gu joan den astean lagunak ___.', validFor: [] },
          { text: 'Gu iaz langileak ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek atzo ikasleak ___.', validFor: [] },
          { text: 'Zuek herenegun irakasleak ___.', validFor: [] },
          { text: 'Zuek aurreko igandean auzokideak ___.', validFor: [] },
          { text: 'Zuek iaz gidariak ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek atzo medikuak ___.', validFor: [] },
          { text: 'Haiek herenegun zuzendariak ___.', validFor: [] },
          { text: 'Haiek iaz bidaiariak ___.', validFor: [] },
          { text: 'Mikel eta Ane joan den astean ikasleak ___.', validFor: [] },
          { text: 'Txakurrak eta katuak duela bi egun handiak ___.', validFor: [] },
        ],
      },
    },
    pronouns: { ni: 'Ni', hi: 'Hi', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
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
      present: { ni: 'nago', hi: 'hago', zu: 'zaude', hura: 'dago', gu: 'gaude', zuek: 'zaudete', haiek: 'daude' },
      past: {
        ni: 'nengoen',
        hi: 'hengoen',
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
      past: {
        ni: [
          { text: 'Ni atzo etxean ___.', validFor: [] },
          { text: 'Ni herenegun ikasgelan ___.', validFor: [] },
          { text: 'Ni iaz Bilbon ___.', validFor: [] },
          { text: 'Ni lehengo egunean lanean ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zu atzo kalean ___.', validFor: [] },
          { text: 'Zu herenegun liburutegian ___.', validFor: [] },
          { text: 'Zu duela bi egun sukaldean ___.', validFor: [] },
          { text: 'Zu iaz Donostian ___.', validFor: [] },
          { text: 'Zu joan den astean dendan ___.', validFor: [] },
        ],
        hura: [
          { text: 'Hura atzo eskolan ___.', validFor: [] },
          { text: 'Hura herenegun patioan ___.', validFor: [] },
          { text: 'Hura lehengo egunean logelan ___.', validFor: [] },
          { text: 'Hura iaz Gasteizen ___.', validFor: [] },
          { text: 'Hura duela bi egun kalean ___.', validFor: [] },
          { text: 'Mikel atzo eskolan ___.', validFor: [] },
          { text: 'Ane herenegun etxean ___.', validFor: [] },
          { text: 'Txakurra atzo parkean ___.', validFor: [] },
          { text: 'Katua lehengo egunean sukaldean ___.', validFor: [] },
          { text: 'Liburua iaz mahai gainean ___.', validFor: [] },
        ],
        gu: [
          { text: 'Gu atzo etxean ___.', validFor: [] },
          { text: 'Gu herenegun lanean ___.', validFor: [] },
          { text: 'Gu iaz Bilbon ___.', validFor: [] },
          { text: 'Gu joan den astean liburutegian ___.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek atzo kalean ___.', validFor: [] },
          { text: 'Zuek herenegun dendan ___.', validFor: [] },
          { text: 'Zuek iaz Donostian ___.', validFor: [] },
          { text: 'Zuek aurreko igandean ikasgelan ___.', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek atzo eskolan ___.', validFor: [] },
          { text: 'Haiek herenegun kalean ___.', validFor: [] },
          { text: 'Gurasoak iaz etxean ___.', validFor: [] },
          { text: 'Mikel eta Ane duela bi egun patioan ___.', validFor: [] },
          { text: 'Liburuak lehengo egunean mahai gainean ___.', validFor: [] },
        ],
      },
    },
    pronouns: { ni: 'Ni', hi: 'Hi', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
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
      // #167: `hi-m`/`hi-f` add `hi`-as-`NORK`'s own present-tense gender
      // split (`duk`/`dun`, "you (m./f.) have it") — distinct from this
      // verb's `presentToka`/`presentNoka` below, which mark a *different*
      // statement's addressee while `hura`/`haiek` (not `hi`) stays the
      // subject. Past stays a single unsplit `huen` (CONJUGATIONS.md §3:
      // "`hik`'s row isn't gender-split in the past").
      present: { ni: 'dut', zu: 'duzu', hura: 'du', gu: 'dugu', zuek: 'duzue', haiek: 'dute', 'hi-m': 'duk', 'hi-f': 'dun' },
      past: { ni: 'nuen', zu: 'zenuen', hura: 'zuen', gu: 'genuen', zuek: 'zenuten', haiek: 'zuten', hi: 'huen' },
      future: {
        ni: 'izango dut',
        zu: 'izango duzu',
        hura: 'izango du',
        gu: 'izango dugu',
        zuek: 'izango duzue',
        haiek: 'izango dute',
      },
      // #148 core scope — Ahalera (potential, "can have"), Baldintza, and
      // Ondorioa present, `NOR` fixed at `hura` (object), `NORK` varying —
      // directly tabulated in `docs/CONJUGATIONS.md` §3 ("Ahalera,
      // Orainaldia" and "Baldintza/Ondorioa, present", `NOR` = `hura`
      // column). Form-only, no `hi` row (matching `ukan`'s existing tables).
      potential: { ni: 'dezaket', zu: 'dezakezu', hura: 'dezake', gu: 'dezakegu', zuek: 'dezakezue', haiek: 'dezakete' },
      baldintza: { ni: 'banu', zu: 'bazenu', hura: 'balu', gu: 'bagenu', zuek: 'bazenute', haiek: 'balute' },
      conditional: { ni: 'nuke', zu: 'zenuke', hura: 'luke', gu: 'genuke', zuek: 'zenukete', haiek: 'lukete' },
      // #167 core scope — Toka/Noka, `hark`/`haiek`→`hura` (object) column,
      // per CONJUGATIONS.md §10. `du`/`dute` undergo a `u`->`i` shift before
      // adding `-k`/`-n` (`dik`/`din`, `ditek`/`diten`) specifically to stay
      // distinct from `hi`-as-`NORK`'s own `duk`/`dun` above — same
      // `-a-`/`-na-` past insertion as `izan`'s. Flagged in
      // LANGUAGE_DECISIONS.md for native-speaker confirmation.
      presentToka: { hura: 'dik', haiek: 'ditek' },
      presentNoka: { hura: 'din', haiek: 'diten' },
      pastToka: { hura: 'zian', haiek: 'zitean' },
      pastNoka: { hura: 'zinan', haiek: 'zitenan' },
      // #171 core scope — NOR-NORK Agintera (imperative, generic "do it!"),
      // singular-object column only, per CONJUGATIONS.md §16.2. `hi`-m/`hi`-f
      // split (`ezak`/`ezan`) since `hi` is the grammatical NORK subject
      // here, matching #167's `hi`-as-NORK convention. 3rd-person jussive
      // (`beza`/`bitza`), 1st-person hortative (`dezagun`), the plural-object
      // (`-itz-`) column, and the ditransitive (`iezadazu`) imperative are
      // out of scope for this table — see the issue filed for #171's
      // remaining scope.
      imperative: { 'hi-m': 'ezak', 'hi-f': 'ezan', zu: 'ezazu', zuek: 'ezazue' },
    },
    // #124/#155/#224: `validFor` per docs/SENTENCE_FRAMES.md. Concrete/
    // ownable/visible objects bought by their own (agentive, human) subject
    // (book, car, pencil, ticket, passport, map, house) admit `nahi`/`eduki`/
    // `ikusi`/`erosi`/`behar` per the worked "book" example — #155 closed the
    // residual gap where `erosi` ("buy") had been omitted from this set,
    // #224 did the same for `behar` ("need"), which also extends to abstract
    // objects one can naturally "need" (a meeting); kinship objects (sister/
    // brother/son) admit `nahi`/`eduki` but not `ikusi`/`erosi`/`behar` (an
    // indefinite "a sister" isn't naturally "seen", "bought", or "needed"
    // this way); non-agentive subjects (a dog with a bone) or a house
    // "having" a garden keep `erosi`/`behar` excluded too — the dog isn't the
    // one buying or needing the bone.
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik arreba bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Nik txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik bilera bat ___.', validFor: ['eduki', 'behar'] },
        ],
        zu: [
          { text: 'Zuk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk anaia bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Zuk mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Berak etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Hark arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Berak seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Hark pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Txakurrak hezur bat ___.', validFor: ['nahi', 'eduki', 'ikusi'] },
          { text: 'Etxeak lorategi bat ___.', validFor: ['eduki'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk bilera bat ___.', validFor: ['eduki', 'behar'] },
          { text: 'Guk txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek koaderno bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek arkatz bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Haiek pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Gurasoek etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Ikasleek liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
      },
      // #259: past, adapted from `docs/SAMPLE_SENTENCES.md`'s `ukan` past
      // table (Eskola/Familia eta etxea/Bidaiak/Eguneroko bizitza columns).
      // validFor judged per the same `nahi`/`eduki`/`ikusi`/`erosi`/`behar`
      // standard as present: concrete ownable/visible/buyable/needable
      // objects (book, house, map, passport, ticket, plane) get the full set;
      // kinship nouns (brother/son) stay `nahi`/`eduki` only; abstract
      // event-like nouns one can "have"/"need" but not "buy" (an exam, a
      // meeting, a job, money, time, a reason) get a narrower set, judged
      // per-noun rather than assuming uniform substitution.
      past: {
        ni: [
          { text: 'Nik diru asko ___.', validFor: ['nahi', 'eduki', 'behar'] },
          { text: 'Nik azterketa bat ___.', validFor: ['eduki', 'behar'] },
          { text: 'Nik arazo bat ___.', validFor: ['eduki', 'ikusi'] },
          { text: 'Nik txartel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hi: [
          { text: 'Hik liburu bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Hik etxe bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Hik mapa bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Hik lan bat ___.', validFor: ['nahi', 'eduki', 'behar'] },
        ],
        hura: [
          { text: 'Hark ideia on bat ___.', validFor: ['nahi', 'eduki', 'behar'] },
          { text: 'Berak seme bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Hark pasaporte bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Berak auto bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        gu: [
          { text: 'Guk arrazoi ___.', validFor: ['nahi', 'eduki', 'behar'] },
          { text: 'Guk azterketa bat ___.', validFor: ['eduki', 'behar'] },
          { text: 'Guk etxe handi bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk maleta bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek galdera bat ___.', validFor: ['eduki', 'ikusi'] },
          { text: 'Zuek anaia bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Zuek hotel bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek lan asko ___.', validFor: ['nahi', 'eduki', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek denbora gutxi ___.', validFor: ['nahi', 'eduki', 'behar'] },
          { text: 'Haiek azterketa bat ___.', validFor: ['eduki', 'behar'] },
          { text: 'Haiek anaia bat ___.', validFor: ['nahi', 'eduki'] },
          { text: 'Haiek hegazkin bat ___.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
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
        ni: { text: 'Nik ez ___ liburu bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        zu: { text: 'Zuk ez ___ auto bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        hura: { text: 'Berak ez ___ etxe bat.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
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
      // #266: `gu`/`zuek`/`haiek` added, riding `ukan`'s exact `dugu`/`duzue`/
      // `dute` present suffixes and `nahiko` + the same suffixes for future —
      // same "costs nothing in new suffix patterns" rationale as `ni`/`zu`/
      // `hura` above.
      present: { ni: 'nahi dut', zu: 'nahi duzu', hura: 'nahi du', gu: 'nahi dugu', zuek: 'nahi duzue', haiek: 'nahi dute' },
      future: { ni: 'nahiko dut', zu: 'nahiko duzu', hura: 'nahiko du', gu: 'nahiko dugu', zuek: 'nahiko duzue', haiek: 'nahiko dute' },
    },
    // #124/#155/#224: `validFor` per docs/SENTENCE_FRAMES.md. Concrete/
    // ownable/visible objects bought by an agentive human subject (coffee,
    // water, book, gift, apple) admit `ukan`/`eduki`/`ikusi`/`erosi`/`behar`
    // — same "book" cluster as `ukan`'s worked example; #155 added `erosi`
    // (you can buy a coffee), #224 added `behar` (you can need a coffee).
    // `'Katuak esne pixka bat ___.'` keeps `erosi`/`behar` excluded — the
    // cat isn't the one buying or needing the milk — same reasoning as
    // `ukan`'s bone/garden cases. `'Zuk etorri ___?'` ("do you want to come?") takes an
    // infinitive complement, not an object noun — no `nor-nork` sibling's
    // form fits, so `validFor: []`.
    sentences: {
      present: {
        ni: [
          { text: 'Nik kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik ur bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk etorri ___?', validFor: [] },
          { text: 'Zuk kafe bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk liburu bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk sagar bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Hark opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Katuak esne pixka bat ___.', validFor: ['ukan', 'eduki', 'ikusi'] },
        ],
        // #266: `gu`/`zuek`/`haiek` added — object-noun variants tagged the
        // same as `ni`/`zu`/`hura`'s, plus one infinitive-complement variant
        // per person adapted from `docs/SAMPLE_SENTENCES.md`'s modal-verb
        // bank (`validFor: []`, same reasoning as `'Zuk etorri ___?'` above —
        // an infinitive complement has no `nor-nork` object-noun sibling that
        // fits).
        gu: [
          { text: 'Guk kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk ur bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk udan Euskal Herriko kosta osoa zeharkatu ___ txalupaz.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek kafe bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek liburu bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek opari bat ___?', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek Korrika festan euskararen alde korrika egin ___?', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek kafe bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Haiek liburu bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Haiek opari bat ___.', validFor: ['ukan', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Gure lagunek Donostiako Danborrada hurbiletik ikusi ___.', validFor: [] },
        ],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ kafe bat nahi dut.',
        zu: '___ etorri nahi duzu?',
        hura: '___ opari bat nahi du.',
        gu: '___ kafe bat nahi dugu.',
        zuek: '___ kafe bat nahi duzue.',
        haiek: '___ kafe bat nahi dute.',
      },
    },
  },
  // `behar` ("need to / have to") — #148 (N-19), the same invariant-particle
  // + `ukan` shape as `nahi` (see above), riding `ukan`'s exact 6-person
  // `dut`/`duzu`/`du`/`dugu`/`duzue`/`dute` suffixes for `present`
  // ("behar dut"), `future` ("beharko dut"), and (#267) `past` — `ukan`'s
  // exact past suffixes again, no `-ko` (`behar nuen`/`zenuen`/`zuen`/
  // `genuen`/`zenuten`/`zuten`, CONJUGATIONS.md §3).
  {
    id: 'behar',
    verb: 'behar izan',
    meaning: { en: 'to need to / have to', es: 'tener que / necesitar', eu: 'behar izan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'behar dut',
        zu: 'behar duzu',
        hura: 'behar du',
        gu: 'behar dugu',
        zuek: 'behar duzue',
        haiek: 'behar dute',
      },
      past: {
        ni: 'behar nuen',
        zu: 'behar zenuen',
        hura: 'behar zuen',
        gu: 'behar genuen',
        zuek: 'behar zenuten',
        haiek: 'behar zuten',
      },
      future: {
        ni: 'beharko dut',
        zu: 'beharko duzu',
        hura: 'beharko du',
        gu: 'beharko dugu',
        zuek: 'beharko duzue',
        haiek: 'beharko dute',
      },
    },
    // #267: unlike `nahi`/`jakin`, `behar`'s complement is an infinitive
    // ("Joan behar dut" = "I have to go"), not an object noun — so each
    // sentence here blanks only the trailing `ukan` auxiliary after an
    // infinitive-complement clause (adapted from `docs/SAMPLE_SENTENCES.md`'s
    // modal-verb bank, paraphrased to a singular complement object where the
    // bank's original used a plural one, since `behar` only has a
    // singular-object table — see `docs/DECISIONS.md`). `lessonLogic.js`'s
    // blank-filling needs no changes: the blank is still a single trailing
    // token, same as every `nor-nork` object-noun sentence.
    // `validFor: []` throughout, same reasoning as `nahi`'s own
    // infinitive-complement variants above: an infinitive complement has no
    // `nor-nork` object-noun sibling whose form actually fits the sentence,
    // and `behar`'s own trailing auxiliary is identical to `ukan`'s bare
    // form for the same person/tense (`dut`, `zuen`, ...) — allowing `ukan`
    // as a candidate would offer a same-text "duplicate correct" option
    // rather than a real wrong-answer distractor.
    sentences: {
      present: {
        ni: [{ text: 'Nik gaur arratsaldean etxera joan behar ___.', validFor: [] }],
        zu: [{ text: 'Zuk bihar goizean garaiz esnatu behar ___?', validFor: [] }],
        hura: [{ text: 'Sukaldariak legatz freskoa garbitu behar ___.', validFor: [] }],
        gu: [{ text: 'Guk aplikazio berria instalatu behar ___.', validFor: [] }],
        zuek: [{ text: 'Zuek sarrera bat erosi behar ___?', validFor: [] }],
        haiek: [{ text: 'Herritarrek dantza ondo entrenatu behar ___.', validFor: [] }],
      },
      past: {
        ni: [{ text: 'Nik atzo etxera joan behar ___.', validFor: [] }],
        zu: [{ text: 'Zuk atzo goiz esnatu behar ___?', validFor: [] }],
        hura: [{ text: 'Sukaldariak legatza garbitu behar ___.', validFor: [] }],
        gu: [{ text: 'Guk aplikazioa instalatu behar ___.', validFor: [] }],
        zuek: [{ text: 'Zuek sarrera erosi behar ___?', validFor: [] }],
        haiek: [{ text: 'Herritarrek dantza entrenatu behar ___.', validFor: [] }],
      },
      future: {
        ni: [{ text: 'Nik bihar lana bukatu beharko ___.', validFor: [] }],
        zu: [{ text: 'Zuk trena goiz hartu beharko ___?', validFor: [] }],
        hura: [{ text: 'Mendizaleak mapa bat eraman beharko ___.', validFor: [] }],
        gu: [{ text: 'Guk etxe berria garbitu beharko ___.', validFor: [] }],
        zuek: [{ text: 'Zuek txartel berria erosi beharko ___?', validFor: [] }],
        haiek: [{ text: 'Sukaldariek txuleta erre beharko ___.', validFor: [] }],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  // `jakin` ("to know a fact") — fully synthetic, sharing `ukan`'s
  // `-t`/`-zu`/∅ present suffix family (`dakit`/`dakizu`/`daki`), per
  // `docs/CONJUGATIONS.md` §7.
  {
    id: 'jakin',
    verb: 'jakin',
    meaning: { en: 'to know (a fact)', es: 'saber (un hecho)', eu: 'jakin (informazioa)' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      // #167: `hi-m`/`hi-f` add `hi`-as-`NORK`'s own present-tense gender
      // split (`dakik`/`dakin`), matching `ukan`'s pattern — not tabulated
      // in CONJUGATIONS.md §7's own grid (blank `hik` row there), but given
      // in §10's synthetic-verb allocutive table per #144's DECISIONS.md.
      present: { ni: 'dakit', zu: 'dakizu', hura: 'daki', 'hi-m': 'dakik', 'hi-f': 'dakin' },
      // #245: `hik`/`zuk`/`zuek` were sourced by mapping `ukan`'s past
      // prefix pattern (`nuen`/`huen`/`zenuen`/`zenuten`, per CONJUGATIONS.md
      // §3) onto `jakin`'s already-attested `-ekien`/`-ekiten` stem
      // (`nekien`/`zekien`/`genekien`/`zekiten`) — same prefix consonant,
      // `ukan`'s `-uen`/`-uten` swapped for `jakin`'s `-ekien`/`-ekiten`.
      // `hik` stays unsplit (`hekien`), matching `ukan`'s own "past stays
      // unsplit" precedent (#167) rather than the present's gender split.
      // See docs/LANGUAGE_DECISIONS.md for the full derivation; flagged for
      // native-speaker confirmation per that entry.
      past: { ni: 'nekien', hi: 'hekien', zu: 'zenekien', hura: 'zekien', gu: 'genekien', zuek: 'zenekiten', haiek: 'zekiten' },
      future: { ni: 'jakingo dut', zu: 'jakingo duzu', hura: 'jakingo du' },
    },
    // #124: `validFor` per docs/SENTENCE_FRAMES.md. `jakin`'s candidates are
    // `ikusi`/`nahi`/`ukan` (`eduki` is #114's confirmed-wrong pair for
    // `jakin`, so never listed). "Erantzuna"/"egia"/"erantzun zuzena" (answer,
    // truth — things that can be seen written down, or wanted) admit
    // `ikusi`/`nahi`; "bidea"/"etxerako bidea" (the way/route — visible but
    // not "wanted" as such) admit only `ikusi`; "sekretua" (a secret — an
    // abstract thing one can know, want, *or have/own*, #204) admits
    // `nahi`/`ukan`. "Egia" stays `ikusi`/`nahi`-only — "Zuk egia duzu" reads
    // as shakier than "Zuk sekretua duzu" and #204 didn't confirm it.
    sentences: {
      present: {
        ni: [
          { text: 'Nik erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Nik bidea ___.', validFor: ['ikusi'] },
        ],
        zu: [
          { text: 'Zuk egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Zuk bidea ___.', validFor: ['ikusi'] },
        ],
        hura: [
          { text: 'Hark sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Mikelek erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Irakasleak erantzun zuzena ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Txakurrak etxerako bidea ___.', validFor: ['ikusi'] },
        ],
      },
      past: {
        ni: [
          { text: 'Nik atzo erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik herenegun egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Nik lehengo egunean sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Nik duela bi egun bidea ___.', validFor: ['ikusi'] },
        ],
        zu: [
          { text: 'Zuk atzo egia ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk herenegun erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Zuk iaz sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Zuk lehengo egunean bidea ___.', validFor: ['ikusi'] },
        ],
        hura: [
          { text: 'Hark atzo sekretua ___.', validFor: ['nahi', 'ukan'] },
          { text: 'Mikelek herenegun erantzuna ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Irakasleak lehengo egunean erantzun zuzena ___.', validFor: ['ikusi', 'nahi'] },
          { text: 'Txakurrak duela bi egun etxerako bidea ___.', validFor: ['ikusi'] },
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
        hura: { text: 'Hark ez ___ sekretua.', validFor: ['nahi', 'ukan'] },
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
      present: { ni: 'noa', hi: 'hoa', zu: 'zoaz', hura: 'doa', gu: 'goaz', zuek: 'zoazte', haiek: 'doaz' },
      past: {
        ni: 'joan nintzen',
        hi: 'joan hintzen',
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
      // Unit 22 ("Motion in Progress (Past)") — `joan`'s own *imperfective*
      // past (ongoing/habitual "I was going"), distinct from `past` above
      // (the periphrastic *simple* past "I went", taught in Unit 11). Per
      // `docs/CONJUGATIONS.md` §6. Form-only (no `sentences`), same as
      // `behar`'s tenses — see `docs/LANGUAGE_DECISIONS.md`.
      imperfectivePast: {
        ni: 'nindoan',
        hi: 'hindoan',
        zu: 'zindoazen',
        hura: 'zihoan',
        gu: 'gindoazen',
        zuek: 'zindoazten',
        haiek: 'zihoazen',
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
      past: {
        ni: [
          { text: 'Ni atzo hondartzara ___.', validFor: ['etorri'] },
          { text: 'Ni herenegun eskolara ___.', validFor: ['etorri'] },
          { text: 'Ni lehengo egunean lanera ___.', validFor: ['etorri'] },
          { text: 'Ni duela bi egun dendara ___.', validFor: ['etorri'] },
        ],
        zu: [
          { text: 'Zu atzo eskolara ___.', validFor: ['etorri'] },
          { text: 'Zu herenegun hondartzara ___.', validFor: ['etorri'] },
          { text: 'Zu joan den astean lanera ___.', validFor: ['etorri'] },
          { text: 'Zu lehengo egunean liburutegira ___.', validFor: ['etorri'] },
        ],
        hura: [
          { text: 'Hura atzo lanera ___.', validFor: ['etorri'] },
          { text: 'Hura herenegun eskolara ___.', validFor: ['etorri'] },
          { text: 'Hura iaz hondartzara ___.', validFor: ['etorri'] },
          { text: 'Mikel lehengo egunean dendara ___.', validFor: ['etorri'] },
          { text: 'Ane duela bi egun unibertsitatera ___.', validFor: ['etorri'] },
          { text: 'Txakurra atzo parkera ___.', validFor: ['etorri'] },
        ],
        gu: [
          { text: 'Gu atzo hondartzara ___.', validFor: ['etorri'] },
          { text: 'Gu herenegun lanera ___.', validFor: ['etorri'] },
          { text: 'Gu joan den astean eskolara ___.', validFor: ['etorri'] },
          { text: 'Gu lehengo egunean dendara ___.', validFor: ['etorri'] },
        ],
        zuek: [
          { text: 'Zuek atzo eskolara ___.', validFor: ['etorri'] },
          { text: 'Zuek herenegun hondartzara ___.', validFor: ['etorri'] },
          { text: 'Zuek iaz lanera ___.', validFor: ['etorri'] },
          { text: 'Zuek lehengo egunean parkera ___.', validFor: ['etorri'] },
        ],
        haiek: [
          { text: 'Haiek atzo lanera ___.', validFor: ['etorri'] },
          { text: 'Haiek herenegun eskolara ___.', validFor: ['etorri'] },
          { text: 'Haiek joan den astean hondartzara ___.', validFor: ['etorri'] },
          { text: 'Mikel eta Ane lehengo egunean dendara ___.', validFor: ['etorri'] },
        ],
      },
    },
    pronouns: { ni: 'Ni', hi: 'Hi', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
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
      present: { ni: 'nator', hi: 'hator', zu: 'zatoz', hura: 'dator', gu: 'gatoz', zuek: 'zatozte', haiek: 'datoz' },
      past: {
        ni: 'etorri nintzen',
        hi: 'etorri hintzen',
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
      // Unit 21 ("I Used To..." — the general periphrastic imperfective/
      // habitual past) — imperfective participle `etortzen` + `izan`'s past
      // auxiliary (`docs/CONJUGATIONS.md` §11's "Ondorio Orokorra" formula:
      // stem + `-t(z)en` + past aux). Distinct from `imperfectivePast` below
      // (Unit 22), `etorri`'s own *native synthetic* imperfective ("I was
      // coming") — Basque has both a periphrastic and a synthetic way to say
      // this for motion verbs; this unit teaches the periphrastic rule that
      // generalizes to every other verb, Unit 22 the synthetic exception.
      // Form-only (no `sentences`), same as `behar`'s tenses.
      habitualPast: {
        ni: 'etortzen nintzen',
        zu: 'etortzen zinen',
        hura: 'etortzen zen',
        gu: 'etortzen ginen',
        zuek: 'etortzen zineten',
        haiek: 'etortzen ziren',
      },
      // Unit 22 ("Motion in Progress (Past)") — `etorri`'s own *imperfective*
      // past (ongoing/habitual "I was coming"), per `docs/CONJUGATIONS.md`
      // §6.
      imperfectivePast: {
        ni: 'nentorren',
        hi: 'hentorren',
        zu: 'zentozen',
        hura: 'zetorren',
        gu: 'gentozen',
        zuek: 'zentozten',
        haiek: 'zetozen',
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
      // #268: `present`'s frames lean on `orain`/`gaur`/`bihar` ("now"/
      // "today"/"tomorrow") — fine for `present`'s own `dator`-type forms,
      // but those adverbs contradict the *completed, non-recent* reading
      // `etorri zen` (Lehenaldi Mugatua, "she came [that time]") carries; a
      // native speaker would say `gaur etorri da` (present-perfect-style,
      // not yet in the curriculum — see `docs/LANGUAGE_DECISIONS.md`) for a
      // same-day arrival, not `gaur etorri zen`. So `past` isn't aliased from
      // `present` (unlike every other reused-past verb — see the alias loop
      // below) — same frames/destinations, but `orain`/`gaur`/`bihar` swapped
      // for a varied past-time adverb (`atzo`/`herenegun`/`lehengo egunean`/
      // `iaz`/`duela bi egun`), which `zen` narrates naturally, matching
      // `docs/LEARNING_JOURNEY.md` Unit 11's own example ("Atzo etorri zen").
      past: {
        ni: [
          { text: 'Ni atzo etxera ___.', validFor: ['joan'] },
          { text: 'Ni herenegun eskolara ___.', validFor: ['joan'] },
          { text: 'Ni lehengo egunean hondartzara ___.', validFor: ['joan'] },
          { text: 'Ni duela bi egun parkera ___.', validFor: ['joan'] },
        ],
        zu: [
          { text: 'Zu herenegun dendara ___.', validFor: ['joan'] },
          { text: 'Zu atzo etxera ___.', validFor: ['joan'] },
          { text: 'Zu lehengo egunean etxera ___.', validFor: ['joan'] },
          { text: 'Zu iaz unibertsitatera ___.', validFor: ['joan'] },
        ],
        hura: [
          { text: 'Hura lehengo egunean ikastolara ___.', validFor: ['joan'] },
          { text: 'Hura atzo etxera ___.', validFor: ['joan'] },
          { text: 'Hura herenegun etxera ___.', validFor: ['joan'] },
          { text: 'Mikel iaz liburutegira ___.', validFor: ['joan'] },
          { text: 'Ane atzo etxera ___.', validFor: ['joan'] },
          { text: 'Txakurra lehengo egunean kalera ___.', validFor: ['joan'] },
        ],
        gu: [
          { text: 'Gu atzo etxera ___.', validFor: ['joan'] },
          { text: 'Gu lehengo egunean etxera ___.', validFor: ['joan'] },
          { text: 'Gu iaz liburutegira ___.', validFor: ['joan'] },
          { text: 'Gu herenegun parkera ___.', validFor: ['joan'] },
        ],
        zuek: [
          { text: 'Zuek herenegun dendara ___.', validFor: ['joan'] },
          { text: 'Zuek atzo etxera ___.', validFor: ['joan'] },
          { text: 'Zuek lehengo egunean etxera ___.', validFor: ['joan'] },
          { text: 'Zuek iaz liburutegira ___.', validFor: ['joan'] },
        ],
        haiek: [
          { text: 'Haiek lehengo egunean auzora ___.', validFor: ['joan'] },
          { text: 'Haiek atzo etxera ___.', validFor: ['joan'] },
          { text: 'Haiek herenegun etxera ___.', validFor: ['joan'] },
          { text: 'Mikel eta Ane iaz liburutegira ___.', validFor: ['joan'] },
        ],
      },
    },
    pronouns: { ni: 'Ni', hi: 'Hi', zu: 'Zu', hura: 'Hura', gu: 'Gu', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ etxera nator.',
        zu: '___ bihar zatoz.',
        hura: '___ orain dator.',
        gu: '___ etxera gatoz.',
        zuek: '___ bihar zatozte.',
        haiek: '___ orain datoz.',
      },
      // Same `atzo`-for-`orain`/`bihar` swap as `sentences.past` above, with
      // the embedded form updated to `etorri`'s past table (`present`'s
      // `nator`/`zatoz`/... would otherwise leak a present-tense form into a
      // past-tense lesson, unrelated to but just as misleading as the
      // adverb mismatch).
      past: {
        ni: '___ etxera etorri nintzen.',
        zu: '___ atzo etorri zinen.',
        hura: '___ atzo etorri zen.',
        gu: '___ etxera etorri ginen.',
        zuek: '___ atzo etorri zineten.',
        haiek: '___ atzo etorri ziren.',
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
        // #230: `baseVerb` resolves "jaten" -> `jan` deterministically (the
        // engine never parses the participle string itself) so
        // `getProgressiveBaseLure` can offer `jan`'s plain present
        // ("jaten dut") as a distractor alongside "ari naiz". The other
        // variants' embedded verbs (egin/ikasi/idatzi/irakurri/jolastu)
        // aren't in `VERBS` yet, so they stay untagged — no lure for them
        // until/unless those verbs are added.
        ni: ['Ni lan egiten ___.', 'Ni ikasten ___.', 'Ni idazten ___.', { text: 'Ni jaten ___.', baseVerb: 'jan' }],
        zu: ['Zu zer ___?', 'Zu zer egiten ___?', 'Zu irakurtzen ___?'],
        hura: [
          'Hura irakurtzen ___.',
          { text: 'Hura jaten ___.', baseVerb: 'jan' },
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
    // #244: `zu` rides `egiten` (pairing with the unit's own "Zer egiten ari
    // zara?" payload question) rather than the non-participle "lanean", so
    // the three fixed pronoun examples cover three distinct imperfective
    // participles (jaten/egiten/irakurtzen) instead of leaning on `jaten`
    // alone.
    pronounSentences: {
      present: {
        ni: '___ jaten ari naiz.',
        zu: '___ zer egiten ari zara?',
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
    // #124/#224/#240: `validFor` per docs/SENTENCE_FRAMES.md. Every object
    // here is a concrete food/dish, naturally also something one could
    // *have*/*want*/*hold*/*see*/*buy*/*need* — `ukan`/`nahi`/`eduki`/
    // `ikusi`/`erosi`/`behar`'s same-person forms are all natural
    // alternatives (#240's food-drink symmetry fix, matching `nahi`/`ukan`'s
    // own food sentences). `edan` stays excluded — "I drink an apple" isn't a
    // natural completion despite both verbs sharing the `food-drink` object
    // class (#114's confirmed-wrong `jan`↔`edan` pair; the class model can't
    // distinguish solid food from drink).
    sentences: {
      present: {
        ni: [
          { text: 'Nik sagarra ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik tortilla ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Hark taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek pizza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek entsalada ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Umeak gaztaina ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        gu: [
          { text: 'Guk arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk ogitartekoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek pastela ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Gurasoek arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
      },
      past: {
        ni: [
          { text: 'Nik atzo sagarra ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik herenegun ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik lehengo egunean tortilla ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk atzo fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk herenegun arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Hark atzo taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek herenegun pizza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek lehengo egunean entsalada ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Umeak duela bi egun gaztaina ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        gu: [
          { text: 'Guk atzo arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk herenegun ogitartekoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek atzo fruta ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek herenegun taloa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek atzo pastela ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Gurasoek herenegun arroza ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
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
    // #124/#224/#240: `validFor` per docs/SENTENCE_FRAMES.md. Every drink
    // here is naturally something one could also *have*/*want*/*hold*/*see*/
    // *buy*/*need* — `ukan`/`nahi`/`eduki`/`ikusi`/`erosi`/`behar`'s
    // same-person forms are all natural alternatives (#240's food-drink
    // symmetry fix, matching `nahi`/`ukan`'s own food sentences). `jan` stays
    // excluded — "I eat water" isn't a natural completion despite both verbs
    // sharing the `food-drink` object class (the class model can't
    // distinguish drink from solid food). `'Katuak esnea ___.'`'s subject (a
    // cat) still can't plausibly *buy*/*need* milk, but can have/want/hold/
    // see it (the `non-agentive-subject` class, same reasoning as `ukan`'s
    // "Txakurrak hezur bat ___." parallel) — so it gets `ukan`/`nahi`/`eduki`/
    // `ikusi` only, no `erosi`/`behar`.
    sentences: {
      present: {
        ni: [
          { text: 'Nik ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik esnea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik zukua ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk ardoa ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Hark sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek tea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Katuak esnea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        gu: [
          { text: 'Guk ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek zukua ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek ardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek garagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Lagunek sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
      },
      past: {
        ni: [
          { text: 'Nik atzo ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik herenegun esnea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Nik lehengo egunean zukua ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk atzo ardoa ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuk herenegun kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        hura: [
          { text: 'Hark atzo sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Mikelek herenegun tea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Anek lehengo egunean ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Katuak duela bi egun esnea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi'] },
        ],
        gu: [
          { text: 'Guk atzo ura ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Guk herenegun kafea ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek atzo zukua ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Zuek herenegun ardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek atzo garagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
          { text: 'Lagunek herenegun sagardoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
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
    // #124/#155/#224/#240: `validFor` per docs/SENTENCE_FRAMES.md. Edible/
    // drinkable objects ("ogia", "sagarrak", "fruta") admit `jan` (#114's
    // confirmed pair) plus `ukan`/`nahi`/`eduki`/`ikusi`/`behar` (#240's
    // food-drink symmetry fix — you can also have/want/hold/see/need the food
    // you're buying, same as `jan`'s own sentences). `edan` stays excluded —
    // none of these objects are drinkable. #155 found the reverse gap for
    // `erosi`'s *other* objects: every non-food, concrete/ownable/visible
    // object bought by an agentive human subject (book, jacket, car, house,
    // ticket, gift, record) symmetrically admits `ukan`/`nahi`/`eduki`/
    // `ikusi` — the same "X erosten dut" ↔ "X dut/nahi dut/daukat/ikusten
    // dut" equivalence already applied to those siblings' own sentences, just
    // missing here before that audit; #224 added `behar` on the same
    // reasoning ("X behar dut").
    sentences: {
      present: {
        ni: [
          { text: 'Nik liburu bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Nik ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
          { text: 'Nik jaka berri bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk sagarrak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
          { text: 'Zuk diskoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        hura: [
          { text: 'Hark autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Mikelek opari bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Anek etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Saltzaileak fruta ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
        ],
        gu: [
          { text: 'Guk etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Guk txartelak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek opariak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Zuek liburuak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Gurasoek etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
      },
      past: {
        ni: [
          { text: 'Nik atzo liburu bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Nik herenegun ogia ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
          { text: 'Nik lehengo egunean jaka berri bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zu: [
          { text: 'Zuk atzo sagarrak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
          { text: 'Zuk herenegun diskoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        hura: [
          { text: 'Hark atzo autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Mikelek herenegun opari bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Anek lehengo egunean etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Saltzaileak duela bi egun fruta ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
        ],
        gu: [
          { text: 'Guk atzo etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Guk herenegun txartelak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek atzo opariak ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Zuek herenegun liburuak ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        haiek: [
          { text: 'Haiek atzo autoa ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Gurasoek herenegun etxe bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
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
    // none of the pool's other verbs (jan/edan/erosi/ikusi) would also fit.
    // Flagged in docs/LANGUAGE_DECISIONS.md for a native-speaker check of
    // these forms/sentences. #224 added `behar` ("need X") to every entry —
    // these are all agentive human subjects wanting/needing the object, so
    // "X behar dut" fits each frame.
    sentences: {
      present: {
        ni: [
          { text: 'Nik autobusa ___.', validFor: ['behar'] },
          { text: 'Nik aterkia ___.', validFor: ['behar'] },
          { text: 'Nik erabaki bat ___.', validFor: ['behar'] },
        ],
        zu: [
          { text: 'Zuk taxia ___?', validFor: ['behar'] },
          { text: 'Zuk telefonoa ___.', validFor: ['behar'] },
        ],
        hura: [
          { text: 'Hark trena ___.', validFor: ['behar'] },
          { text: 'Mikelek katua ___.', validFor: ['behar'] },
          { text: 'Anek txanda ___.', validFor: ['behar'] },
          { text: 'Gidariak autobusa ___.', validFor: ['behar'] },
        ],
        gu: [
          { text: 'Guk taxia ___.', validFor: ['behar'] },
          { text: 'Guk erabaki garrantzitsu bat ___.', validFor: ['behar'] },
        ],
        zuek: [
          { text: 'Zuek autobusa ___?', validFor: ['behar'] },
          { text: 'Zuek aterkiak ___.', validFor: ['behar'] },
        ],
        haiek: [
          { text: 'Haiek trena ___.', validFor: ['behar'] },
          { text: 'Gurasoek erabakia ___.', validFor: ['behar'] },
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
      // Unit 21 ("I Used To..." — periphrastic imperfective/habitual past) —
      // imperfective participle `ikusten` + `ukan`'s past auxiliary, per
      // `docs/CONJUGATIONS.md` §11's "Ondorio Orokorra" formula. Pairs with
      // `etorri`'s `habitualPast` as the unit's NOR/NOR-NORK auxiliary-pattern
      // pair, same pairing precedent as `izan`/`ukan` elsewhere. Form-only
      // (no `sentences`).
      habitualPast: {
        ni: 'ikusten nuen',
        zu: 'ikusten zenuen',
        hura: 'ikusten zuen',
        gu: 'ikusten genuen',
        zuek: 'ikusten zenuten',
        haiek: 'ikusten zuten',
      },
    },
    // #124/#155/#224: `validFor` per docs/SENTENCE_FRAMES.md. `ikusi`'s
    // candidates are `ukan`/`eduki`/`jakin`/`nahi`/`erosi` (the four
    // confirmed #114 pairs, plus `erosi` per #155's purchasable-object
    // re-audit). "Filma" (a film — ownable, wantable, buyable, not "known"
    // as a fact) admits `ukan`/`eduki`/`nahi`/`erosi`; "mendia"/"itsasoa"/
    // "zerua" (mountain/sea/sky — can't be owned, held, known, wanted, or
    // bought in this frame) admit nothing; `'Zuk/Zuek hori ___?'` ("that
    // [thing]") is maximally generic — every candidate fits, including
    // `erosi`. "Irakasleak ikasleak ___." (teacher has/wants students — not
    // purchasable) admits `ukan`/`nahi` only; "Gurasoek etxea ___." (parents
    // have/want/buy the house) admits `ukan`/`nahi`/`eduki`/`erosi`;
    // "Txakurrak katua ___." (the dog [sees/has/wants] the cat — the dog
    // isn't the one buying it) admits `eduki`/`nahi`, no `erosi`. #224 added
    // `behar` ("need") only to "filma" and "Gurasoek etxea" — a film and a
    // house are things one can naturally "need to see"; the kinship/animal/
    // landscape/generic-"hori" entries above were judged not to extend
    // naturally to "need" and were left as-is per #224's exclude-by-default
    // guidance.
    sentences: {
      present: {
        ni: [
          { text: 'Nik filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Nik mendia ___.', validFor: [] },
          { text: 'Nik zerua ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] },
          { text: 'Zuk Mikel ___?', validFor: [] },
        ],
        hura: [
          { text: 'Hark itsasoa ___.', validFor: [] },
          { text: 'Anek filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Irakasleak ikasleak ___.', validFor: ['ukan', 'nahi'] },
          { text: 'Txakurrak katua ___.', validFor: ['eduki', 'nahi'] },
        ],
        gu: [
          { text: 'Guk itsasoa ___.', validFor: [] },
          { text: 'Guk filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] },
          { text: 'Zuek mendia ___?', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Gurasoek etxea ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
        ],
      },
      past: {
        ni: [
          { text: 'Nik atzo filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Nik herenegun mendia ___.', validFor: [] },
          { text: 'Nik lehengo egunean zerua ___.', validFor: [] },
        ],
        zu: [
          { text: 'Zuk atzo hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] },
          { text: 'Zuk herenegun Mikel ___?', validFor: [] },
        ],
        hura: [
          { text: 'Hark atzo itsasoa ___.', validFor: [] },
          { text: 'Anek herenegun filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Irakasleak lehengo egunean ikasleak ___.', validFor: ['ukan', 'nahi'] },
          { text: 'Txakurrak duela bi egun katua ___.', validFor: ['eduki', 'nahi'] },
        ],
        gu: [
          { text: 'Guk atzo itsasoa ___.', validFor: [] },
          { text: 'Guk herenegun filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek atzo hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] },
          { text: 'Zuek herenegun mendia ___?', validFor: [] },
        ],
        haiek: [
          { text: 'Haiek atzo filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
          { text: 'Gurasoek herenegun etxea ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] },
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
      past: {
        ni: [
          { text: 'Nik atzo giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Nik herenegun dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Nik lehengo egunean liburu bat eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        zu: [
          { text: 'Zuk atzo giltza poltsikoan ___?', validFor: ['ukan', 'ikusi'] },
          { text: 'Zuk herenegun telefonoa eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        hura: [
          { text: 'Hark atzo giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Mikelek herenegun dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Anek lehengo egunean liburua eskuan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Umeak duela bi egun jostailua eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        gu: [
          { text: 'Guk atzo giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Guk herenegun dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        zuek: [
          { text: 'Zuek atzo giltza poltsikoan ___?', validFor: ['ukan', 'ikusi'] },
          { text: 'Zuek herenegun txartela eskuan ___.', validFor: ['ukan', 'ikusi'] },
        ],
        haiek: [
          { text: 'Haiek atzo giltza poltsikoan ___.', validFor: ['ukan', 'ikusi'] },
          { text: 'Gurasoek herenegun dirua eskuan ___.', validFor: ['ukan', 'ikusi'] },
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
    id: 'eraman',
    verb: 'eraman',
    meaning: { en: 'to carry / take (something somewhere)', es: 'llevar (algo a algún lugar)', eu: 'eraman' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    // #260: present/past sourced from docs/CONJUGATIONS.md §7 (`eraman` —
    // singular-object alternant; the table's `/daramatza`-style plural-object
    // forms aren't used here, matching `eduki`/`jakin`'s precedent of only
    // tabulating the singular-object form). `hi` omitted — CONJUGATIONS.md's
    // table has no `hik` row for `eraman`, unlike `jakin`'s sourced
    // hitanoa split (#144/#245). `future` derived the same way as
    // `eduki`/`jakin`'s (`-n`-final root + `-go` + ukan suffixes, mirroring
    // `jakin` → `jakingo`).
    conjugations: {
      present: { ni: 'daramat', zu: 'daramazu', hura: 'darama', gu: 'daramagu', zuek: 'daramazue', haiek: 'daramate' },
      past: {
        ni: 'neraman',
        zu: 'zeneraman',
        hura: 'zeraman',
        gu: 'generaman',
        zuek: 'zeneramaten',
        haiek: 'zeramaten',
      },
      future: {
        ni: 'eramango dut',
        zu: 'eramango duzu',
        hura: 'eramango du',
        gu: 'eramango dugu',
        zuek: 'eramango duzue',
        haiek: 'eramango dute',
      },
    },
    // #261: adapted from docs/SAMPLE_SENTENCES.md's `ERAMAN` bank
    // (Bidaiak/Eguneroko bizitza columns — fishermen carrying tuna to port,
    // hikers' cheese/bread for the mountain, a dog taken to see sheep,
    // dancers driven to a festival). The source's plural-object forms
    // (`daramatzate`/`zeramatzaten`, etc.) were singularized to match the
    // singular-object conjugations actually tabulated in #260 (one fish, one
    // cheese-and-bread bundle, one dog, one dancer) — same convention
    // `eduki`/`jakin`'s sentences already use.
    // `validFor`: `ukan`/`eduki` (physically carrying something is close
    // enough to "having" it on you) read as natural alternates throughout;
    // `hartu` ("to take") fits only the literal carry-along sentences, not
    // ones where the destination/purpose makes "take" read oddly (e.g.
    // "Guk gazta daramagu mendirako" → "Guk gazta hartzen dugu mendirako"
    // reads slightly off as "we take cheese for the mountain" vs natural
    // "we're bringing/carrying cheese for the mountain"). `ikusi`/`erosi`/
    // `nahi`/`behar` never fit — none of them mean "carry."
    sentences: {
      present: {
        ni: [{ text: 'Nik nire txakurra ___ mendira, ardiak ikustera.', validFor: ['ukan', 'eduki'] }],
        zu: [{ text: 'Zuk Idiazabal gazta zaharra ___ motxilan, afaltzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
        hura: [{ text: 'Arrantzaleak hegaluze freskoa ___ Getariako portura.', validFor: ['ukan', 'eduki'] }],
        gu: [{ text: 'Guk Idiazabal gazta eta ogia ___ mendirako.', validFor: ['ukan', 'eduki'] }],
        zuek: [{ text: 'Zuek dantzaria autoan ___ herriko jaietara.', validFor: ['ukan', 'eduki', 'hartu'] }],
        haiek: [{ text: 'Arrantzaleek hegaluze freskoa ___ Getariako portura.', validFor: ['ukan', 'eduki'] }],
      },
      past: {
        ni: [{ text: 'Nik nire txakurra ___ mendira, ardi latxak ikustera.', validFor: ['ukan', 'eduki'] }],
        zu: [{ text: 'Zuk zurezko soka gogorra ___ herri kiroletarako.', validFor: ['ukan', 'eduki', 'hartu'] }],
        hura: [{ text: 'Sukaldariak txuleta handia ___ txosnatik mahaira.', validFor: ['ukan', 'eduki'] }],
        gu: [{ text: 'Guk Idiazabal gazta eta ogia ___ mendirako.', validFor: ['ukan', 'eduki'] }],
        zuek: [{ text: 'Zuek dantzaria autoan ___ herriko jaietara.', validFor: ['ukan', 'eduki', 'hartu'] }],
        haiek: [{ text: 'Sukaldariek txuleta handiak ___ txosnatik mahaira.', validFor: ['ukan', 'eduki'] }],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ nire txakurra daramat mendira.',
        zu: '___ Idiazabal gazta zaharra daramazu motxilan.',
        hura: '___ hegaluze freskoa darama Getariako portura.',
        gu: '___ Idiazabal gazta eta ogia daramagu mendirako.',
        zuek: '___ dantzaria autoan daramazue herriko jaietara.',
        haiek: '___ hegaluze freskoa daramate Getariako portura.',
      },
    },
  },
  {
    id: 'ekarri',
    verb: 'ekarri',
    meaning: { en: 'to bring', es: 'traer', eu: 'ekarri' },
    type: 'synthetic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    // #260: present/past sourced from docs/CONJUGATIONS.md §7 (`ekarri` —
    // singular-object alternant, same convention as `eraman` above). `hi`
    // omitted for the same reason (no `hik` row sourced in CONJUGATIONS.md).
    // `future` derived the same way as `eduki`'s (`-i`-final root + `-ko` +
    // ukan suffixes, mirroring `eduki` → `edukiko`).
    conjugations: {
      present: { ni: 'dakart', zu: 'dakarzu', hura: 'dakar', gu: 'dakargu', zuek: 'dakarzue', haiek: 'dakarte' },
      past: {
        ni: 'nekarren',
        zu: 'zenekarren',
        hura: 'zekarren',
        gu: 'genekarren',
        zuek: 'zenekarten',
        haiek: 'zekarten',
      },
      future: {
        ni: 'ekarriko dut',
        zu: 'ekarriko duzu',
        hura: 'ekarriko du',
        gu: 'ekarriko dugu',
        zuek: 'ekarriko duzue',
        haiek: 'ekarriko dute',
      },
    },
    // #261: adapted from docs/SAMPLE_SENTENCES.md's `EKARRI` bank
    // (Bidaiak/Familia eta etxea columns — a drum brought as a gift, Txakoli
    // bottles, Basque pastries from the bakery, a sack of Tolosa beans,
    // mountain-spring water). Singularized the same way as `eraman` above to
    // match #260's singular-object conjugations (one drum, one bottle, one
    // pastry, one sack, one jug of water).
    // `validFor`: same `ukan`/`eduki`/`hartu` judgment as `eraman` — bringing
    // something is close enough to "having" it on you throughout; `hartu`
    // fits the literal hand-it-over sentences (gifting a drum/sack) but not
    // ones about routine sourcing (bringing water from a spring, bread from
    // the oven — "hartu" there reads as "picked up" rather than "brought,"
    // a narrower fit). `ikusi`/`erosi`/`nahi`/`behar` never fit.
    sentences: {
      present: {
        ni: [{ text: 'Nik zuri Tolosako babarrun gorri zaku bat ___ oparitzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
        zu: [{ text: 'Zuk niri opari polit bat ___ Baionako denda txikitik.', validFor: ['ukan', 'eduki', 'hartu'] }],
        hura: [{ text: 'Lagunak danbor txiki bat ___ Donostiako Danborradatik, oparitzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
        gu: [{ text: 'Guk baserriko ur berria ___ mendiko iturritik.', validFor: ['ukan', 'eduki'] }],
        zuek: [{ text: 'Zuek opari polit bat ___ Baionako denda txikitik.', validFor: ['ukan', 'eduki', 'hartu'] }],
        haiek: [{ text: 'Lagunek danbor txiki bat ___ Donostiako Danborradatik, oparitzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
      },
      past: {
        ni: [{ text: 'Nik zuri Tolosako babarrun gorri zaku bat ___ oparitzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
        zu: [{ text: 'Zuk niri opari polit bat ___ Baionako denda txikitik.', validFor: ['ukan', 'eduki', 'hartu'] }],
        hura: [{ text: 'Okinak euskal pastel gozoa ___ labetik atera berritan.', validFor: ['ukan', 'eduki'] }],
        gu: [{ text: 'Guk baserriko ur berria ___ mendiko iturritik.', validFor: ['ukan', 'eduki'] }],
        zuek: [{ text: 'Zuek opari polit bat ___ Baionako denda txikitik.', validFor: ['ukan', 'eduki', 'hartu'] }],
        haiek: [{ text: 'Lagunek danbor txiki bat ___ Donostiako Danborradatik, oparitzeko.', validFor: ['ukan', 'eduki', 'hartu'] }],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ zuri Tolosako babarrun gorri zaku bat dakart.',
        zu: '___ niri opari polit bat dakarzu.',
        hura: '___ danbor txiki bat dakar Donostiako Danborradatik.',
        gu: '___ baserriko ur berria dakargu mendiko iturritik.',
        zuek: '___ opari polit bat dakarzue Baionako denda txikitik.',
        haiek: '___ danbor txiki bat dakarte Donostiako Danborradatik.',
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
      present: { ni: 'nabil', hi: 'habil', zu: 'zabiltza', hura: 'dabil', gu: 'gabiltza', zuek: 'zabiltzate', haiek: 'dabiltza' },
      past: {
        ni: 'ibili nintzen',
        hi: 'ibili hintzen',
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
      // Unit 22 ("Motion in Progress (Past)") — `ibili`'s own *imperfective*
      // past, per `docs/CONJUGATIONS.md` §6. No `hi` row — §6 marks it `—`
      // (unattested/not in regular use), same gap noted for `ibili hintzen`
      // in #180 (see `docs/LANGUAGE_DECISIONS.md`).
      imperfectivePast: {
        ni: 'nenbilen',
        zu: 'zenbiltzan',
        hura: 'zebilen',
        gu: 'genbiltzan',
        zuek: 'zenbiltzaten',
        haiek: 'zebiltzan',
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
      past: {
        ni: ['Ni atzo kalean ___.', 'Ni herenegun oinez ___.', 'Ni lehengo egunean parkean ___.'],
        zu: ['Zu non ___?', 'Zu atzo lanean ___.'],
        hura: [
          'Hura atzo kalean ___.',
          'Mikel herenegun parkean ___.',
          'Ane lehengo egunean oinez ___.',
          'Txakurra duela bi egun etxean ___.',
        ],
        gu: ['Gu atzo kalean ___.', 'Gu herenegun oinez ___.'],
        zuek: ['Zuek non ___?', 'Zuek atzo parkean ___.'],
        haiek: ['Haiek atzo kalean ___.', 'Mikel eta Ane herenegun oinez ___.'],
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
  // #147: the first NOR-NORI-NORK (ditransitive) verbs, introducing the
  // `recipient`/`agent` axis-fixed metadata #142 added. Present tense is
  // periphrastic (`esaten`/`ematen` + the `di-` ditransitive auxiliary,
  // mirroring `jan`/`edan`'s `[participle] + ukan` shape); past and future
  // drop the `-ten` infinitive for the bare participle (`esan nion`, `esango
  // diot`), per `docs/LEARNING_JOURNEY_PROPOSED.md` Unit 25/26's examples.
  // `hi`/`hiri` cells are omitted throughout (hitanoa, not yet modeled — see
  // #144), matching every other verb's 6-person table.
  {
    id: 'esan',
    verb: 'esan',
    meaning: { en: 'to tell / say (to someone)', es: 'decir (a alguien)', eu: 'esan' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    // `recipient: 'hura'` fixes NORI = hari ("to him/her"); `person` varies
    // over NORK (25·L1 — "Nik/Zuk/... egia esaten diot/diozu/...").
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'esaten diot',
        zu: 'esaten diozu',
        hura: 'esaten dio',
        gu: 'esaten diogu',
        zuek: 'esaten diozue',
        haiek: 'esaten diote',
      },
      // `nion`/`zion`/`genion`/`zenion` per CONJUGATIONS.md §5's `hari`/past
      // row. §8's `esan`-specific table gives `nioen`/`zioen`/`genioen`/
      // `zenioen` instead for the same cells — flagged in
      // docs/LANGUAGE_DECISIONS.md for native-speaker confirmation; `nion`
      // was chosen as it matches both §5's general grid and the
      // LEARNING_JOURNEY_PROPOSED.md N-26 example ("Esan nion").
      past: {
        ni: 'esan nion',
        zu: 'esan zenion',
        hura: 'esan zion',
        gu: 'esan genion',
        zuek: 'esan zenioten',
        haiek: 'esan zioten',
      },
      future: {
        ni: 'esango diot',
        zu: 'esango diozu',
        hura: 'esango dio',
        gu: 'esango diogu',
        zuek: 'esango diozue',
        haiek: 'esango diote',
      },
      // #162: plural-`NOR` object ("I tell him *lies*") — `-zki-`-infixed per
      // CONJUGATIONS.md §5's `NOR`=haiek grids, `hari` row (NORI still fixed,
      // NORK still the varying `person`). Future reuses the present aux
      // forms with the `-go` participle, mirroring the singular future above.
      presentPlural: {
        ni: 'esaten dizkiot',
        zu: 'esaten dizkiozu',
        hura: 'esaten dizkio',
        gu: 'esaten dizkiogu',
        zuek: 'esaten dizkiozue',
        haiek: 'esaten dizkiote',
      },
      pastPlural: {
        ni: 'esan nizkion',
        zu: 'esan zenizkion',
        hura: 'esan zizkion',
        gu: 'esan genizkion',
        zuek: 'esan zenizkioten',
        haiek: 'esan zizkioten',
      },
      futurePlural: {
        ni: 'esango dizkiot',
        zu: 'esango dizkiozu',
        hura: 'esango dizkio',
        gu: 'esango dizkiogu',
        zuek: 'esango dizkiozue',
        haiek: 'esango dizkiote',
      },
    },
    // #265: `validFor: []` throughout, confirmed rather than assumed.
    // `agreementsCompatible(['nor','nori','nork'], ['nor','nori','nork'])` is
    // `true` (`eman` is the only other nor-nori-nork verb), so the engine
    // *would* offer `eman`'s same-person forms here if tagged — but every
    // such substitution is doubly broken: (1) the fixed argument differs
    // (`esan`'s NORI is fixed to `hura`, varying `person` over NORK; `eman`'s
    // NORK is fixed to `ni`, varying `person` over NORI), so a shared
    // `person` label names a different grammatical role in each verb's form —
    // dropping `eman`'s `zu`-form ("ematen dizut", NORK=ni baked in) into
    // `esan`'s "Zuk egia ___." (subject NORK=zu) is a subject/verb agreement
    // mismatch, not just a meaning mismatch; (2) "egia eman" ("give the
    // truth") isn't an idiom the way "egia esan" ("tell the truth") is, so
    // even where the morphology lined up the sentence would read oddly. Same
    // reasoning applies to `eman`'s sentences below.
    sentences: {
      present: {
        ni: [{ text: 'Nik egia ___.', validFor: [] }],
        zu: [{ text: 'Zuk egia ___.', validFor: [] }],
        hura: [{ text: 'Hark egia ___.', validFor: [] }],
        gu: [{ text: 'Guk egia ___.', validFor: [] }],
        zuek: [{ text: 'Zuek egia ___.', validFor: [] }],
        haiek: [{ text: 'Haiek egia ___.', validFor: [] }],
      },
      // Plural object ("gezurrak", lies) so the cue noun phrase itself signals
      // the `-zki-` slot, mirroring #164's plural-NOR sentence frames.
      presentPlural: {
        ni: [{ text: 'Nik gezurrak ___.', validFor: [] }],
        zu: [{ text: 'Zuk gezurrak ___.', validFor: [] }],
        hura: [{ text: 'Hark gezurrak ___.', validFor: [] }],
        gu: [{ text: 'Guk gezurrak ___.', validFor: [] }],
        zuek: [{ text: 'Zuek gezurrak ___.', validFor: [] }],
        haiek: [{ text: 'Haiek gezurrak ___.', validFor: [] }],
      },
    },
  },
  {
    id: 'eman',
    verb: 'eman',
    meaning: { en: 'to give', es: 'dar', eu: 'eman' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    // `agent: 'ni'` fixes NORK = nik ("I give it to..."); `person` varies
    // over NORI (25·L2 — "Nik liburua zuri/hari/... ematen dizut/diot/...").
    // `ni`/`gu` are reflexive-only ("give it to myself/ourselves" isn't a
    // distinct ditransitive form, per CONJUGATIONS.md §5) and `hi` is
    // hitanoa, so only `zu`/`hura`/`zuek`/`haiek` exist for this axis — a
    // 4-person table, same shape as the small allocutive tables #139's
    // distractor-floor fix anticipates.
    agent: 'ni',
    dialect: 'batua',
    conjugations: {
      present: {
        zu: 'ematen dizut',
        hura: 'ematen diot',
        zuek: 'ematen dizuet',
        haiek: 'ematen diet',
      },
      past: {
        zu: 'eman nizun',
        hura: 'eman nion',
        zuek: 'eman nizuen',
        haiek: 'eman nien',
      },
      future: {
        zu: 'emango dizut',
        hura: 'emango diot',
        zuek: 'emango dizuet',
        haiek: 'emango diet',
      },
      // #162: plural-`NOR` object ("I give him *the books*") — `-zki-`-
      // infixed per CONJUGATIONS.md §5's `NOR`=haiek grids, `nik` column
      // (NORK still fixed, NORI still the varying `person`).
      presentPlural: {
        zu: 'ematen dizkizut',
        hura: 'ematen dizkiot',
        zuek: 'ematen dizkizuet',
        haiek: 'ematen dizkiet',
      },
      pastPlural: {
        zu: 'eman nizkizun',
        hura: 'eman nizkion',
        zuek: 'eman nizkizuen',
        haiek: 'eman nizkien',
      },
      futurePlural: {
        zu: 'emango dizkizut',
        hura: 'emango dizkiot',
        zuek: 'emango dizkizuet',
        haiek: 'emango dizkiet',
      },
    },
    // #265: `validFor: []` throughout — see `esan`'s sentences above for the
    // full reasoning (fixed-argument mismatch + "liburua esan" not being a
    // natural substitute for "liburua eman" any more than the reverse is).
    sentences: {
      present: {
        zu: [{ text: 'Nik liburua zuri ___.', validFor: [] }],
        hura: [{ text: 'Nik liburua hari ___.', validFor: [] }],
        zuek: [{ text: 'Nik liburua zuei ___.', validFor: [] }],
        haiek: [{ text: 'Nik liburua haiei ___.', validFor: [] }],
      },
      // Plural object ("liburuak", the books).
      presentPlural: {
        zu: [{ text: 'Nik liburuak zuri ___.', validFor: [] }],
        hura: [{ text: 'Nik liburuak hari ___.', validFor: [] }],
        zuek: [{ text: 'Nik liburuak zuei ___.', validFor: [] }],
        haiek: [{ text: 'Nik liburuak haiei ___.', validFor: [] }],
      },
    },
  },
  // #146: the first NOR-NORI (dative-subject / "psych") verbs — `gustatu`,
  // `iruditu`, `ahaztu`. `agreement: ['nor', 'nori']` with `object: 'hura'`
  // fixes NOR to `hura` ("it"); `person` ranges over NORI, the dative
  // experiencer (`zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie`, "it
  // [pleases/seems/is-forgotten-by] me/you/...", CONJUGATIONS.md §4).
  // `gustatu`/`iruditu` use the `-tzen` habitual present (`gustatzen zait`,
  // "I like it"); `ahaztu`'s present is the bare participle + present dative
  // aux (`ahaztu zait`, "I forgot it") — a resultative/perfect-like reading,
  // per `docs/LEARNING_JOURNEY_PROPOSED.md`'s dedicated `ahaztu` table and
  // Unit 23 examples. Past keeps the bare participle + past dative aux
  // (`zitzaidan` etc.) for all three; future is `[participle]+ko` + present
  // dative aux (`gustatuko zait`). `hi`/`hiri` cells omitted (hitanoa, see
  // #144). Forms flagged in `docs/LANGUAGE_DECISIONS.md` for native-speaker
  // confirmation.
  {
    id: 'gustatu',
    verb: 'gustatu',
    meaning: { en: 'to like / please', es: 'gustar', eu: 'gustatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nori'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'gustatzen zait', zu: 'gustatzen zaizu', hura: 'gustatzen zaio',
        gu: 'gustatzen zaigu', zuek: 'gustatzen zaizue', haiek: 'gustatzen zaie',
      },
      past: {
        ni: 'gustatu zitzaidan', zu: 'gustatu zitzaizun', hura: 'gustatu zitzaion',
        gu: 'gustatu zitzaigun', zuek: 'gustatu zitzaizuen', haiek: 'gustatu zitzaien',
      },
      future: {
        ni: 'gustatuko zait', zu: 'gustatuko zaizu', hura: 'gustatuko zaio',
        gu: 'gustatuko zaigu', zuek: 'gustatuko zaizue', haiek: 'gustatuko zaie',
      },
      // #164: plural-`NOR` ("they please me") — same `NORI`-suffix family,
      // `-zki-`-infixed per `docs/CONJUGATIONS.md` §4's `haiek`/`NOR` column.
      // `person` here still ranges over `NORI`; the fixed `NOR` argument
      // moves from `hura` to `haiek` for this whole table.
      presentPlural: {
        ni: 'gustatzen zaizkit', zu: 'gustatzen zaizkizu', hura: 'gustatzen zaizkio',
        gu: 'gustatzen zaizkigu', zuek: 'gustatzen zaizkizue', haiek: 'gustatzen zaizkie',
      },
      pastPlural: {
        ni: 'gustatu zitzaizkidan', zu: 'gustatu zitzaizkizun', hura: 'gustatu zitzaizkion',
        gu: 'gustatu zitzaizkigun', zuek: 'gustatu zitzaizkizuen', haiek: 'gustatu zitzaizkien',
      },
      futurePlural: {
        ni: 'gustatuko zaizkit', zu: 'gustatuko zaizkizu', hura: 'gustatuko zaizkio',
        gu: 'gustatuko zaizkigu', zuek: 'gustatuko zaizkizue', haiek: 'gustatuko zaizkie',
      },
    },
    // NORI is the varying slot here, so each sentence leads with the dative
    // pronoun ("Niri"/"Zuri"/...). #263: `validFor: ['ahaztu']` — "Niri hau
    // ahaztu zait" ("I forgot this") is a fully natural, self-contained
    // sentence with the same bare-object + dative-aux shape, so `ahaztu`'s
    // same-person form substitutes cleanly. `iruditu` does not: bare "Niri
    // hau iruditzen zait" reads as incomplete without a predicate/adverb
    // telling *how* it seems (cf. `iruditu`'s own "Niri ongi ___." sentence
    // below) — excluded.
    sentences: {
      present: {
        ni: [{ text: 'Niri hau ___.', validFor: ['ahaztu'] }],
        zu: [{ text: 'Zuri hau ___.', validFor: ['ahaztu'] }],
        hura: [{ text: 'Hari hau ___.', validFor: ['ahaztu'] }],
        gu: [{ text: 'Guri hau ___.', validFor: ['ahaztu'] }],
        zuek: [{ text: 'Zuei hau ___.', validFor: ['ahaztu'] }],
        haiek: [{ text: 'Haiei hau ___.', validFor: ['ahaztu'] }],
      },
      // #164: plural-object counterpart of the table above ("these please
      // me", not "it pleases me") — `hau` ("this") becomes `hauek` ("these").
      // #263: same `ahaztu`-only judgment as the singular table above
      // ("Niri hauek ahaztu zaizkit" = "I forgot these").
      presentPlural: {
        ni: [{ text: 'Niri hauek ___.', validFor: ['ahaztu'] }],
        zu: [{ text: 'Zuri hauek ___.', validFor: ['ahaztu'] }],
        hura: [{ text: 'Hari hauek ___.', validFor: ['ahaztu'] }],
        gu: [{ text: 'Guri hauek ___.', validFor: ['ahaztu'] }],
        zuek: [{ text: 'Zuei hauek ___.', validFor: ['ahaztu'] }],
        haiek: [{ text: 'Haiei hauek ___.', validFor: ['ahaztu'] }],
      },
      past: {
        ni: [{ text: 'Niri atzo hau ___.', validFor: ['ahaztu'] }],
        zu: [{ text: 'Zuri herenegun hau ___.', validFor: ['ahaztu'] }],
        hura: [{ text: 'Hari lehengo egunean hau ___.', validFor: ['ahaztu'] }],
        gu: [{ text: 'Guri iaz hau ___.', validFor: ['ahaztu'] }],
        zuek: [{ text: 'Zuei duela bi egun hau ___.', validFor: ['ahaztu'] }],
        haiek: [{ text: 'Haiei joan den astean hau ___.', validFor: ['ahaztu'] }],
      },
    },
  },
  {
    id: 'iruditu',
    verb: 'iruditu',
    meaning: { en: 'to seem (to someone)', es: 'parecer', eu: 'iruditu' },
    type: 'periphrastic',
    agreement: ['nor', 'nori'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'iruditzen zait', zu: 'iruditzen zaizu', hura: 'iruditzen zaio',
        gu: 'iruditzen zaigu', zuek: 'iruditzen zaizue', haiek: 'iruditzen zaie',
      },
      past: {
        ni: 'iruditu zitzaidan', zu: 'iruditu zitzaizun', hura: 'iruditu zitzaion',
        gu: 'iruditu zitzaigun', zuek: 'iruditu zitzaizuen', haiek: 'iruditu zitzaien',
      },
      future: {
        ni: 'irudituko zait', zu: 'irudituko zaizu', hura: 'irudituko zaio',
        gu: 'irudituko zaigu', zuek: 'irudituko zaizue', haiek: 'irudituko zaie',
      },
      // #164: plural-`NOR` counterpart, see `gustatu`'s table above for the
      // `-zki-` derivation.
      presentPlural: {
        ni: 'iruditzen zaizkit', zu: 'iruditzen zaizkizu', hura: 'iruditzen zaizkio',
        gu: 'iruditzen zaizkigu', zuek: 'iruditzen zaizkizue', haiek: 'iruditzen zaizkie',
      },
      pastPlural: {
        ni: 'iruditu zitzaizkidan', zu: 'iruditu zitzaizkizun', hura: 'iruditu zitzaizkion',
        gu: 'iruditu zitzaizkigun', zuek: 'iruditu zitzaizkizuen', haiek: 'iruditu zitzaizkien',
      },
      futurePlural: {
        ni: 'irudituko zaizkit', zu: 'irudituko zaizkizu', hura: 'irudituko zaizkio',
        gu: 'irudituko zaizkigu', zuek: 'irudituko zaizkizue', haiek: 'irudituko zaizkie',
      },
    },
    // #263: `validFor: []` throughout — "ongi" ("well") modifies *how*
    // something seems, and neither `gustatu` ("ongi gustatzen zait", "it
    // pleases me well") nor `ahaztu` ("ongi ahaztu zait", "it well-forgot to
    // me") combines naturally with that adverb, so no sibling substitutes
    // into either sentence here.
    sentences: {
      present: {
        ni: [{ text: 'Niri ongi ___.', validFor: [] }],
        zu: [{ text: 'Zuri ongi ___.', validFor: [] }],
        hura: [{ text: 'Hari ongi ___.', validFor: [] }],
        gu: [{ text: 'Guri ongi ___.', validFor: [] }],
        zuek: [{ text: 'Zuei ongi ___.', validFor: [] }],
        haiek: [{ text: 'Haiei ongi ___.', validFor: [] }],
      },
      // #164: "ongi" (well/good) is an adverb, not a NOR argument, so the
      // plural-NOR variant swaps in a genuine plural subject ("these
      // things") rather than re-using "ongi" — `iruditu` needs a real noun
      // phrase to host the number contrast.
      presentPlural: {
        ni: [{ text: 'Niri gauza hauek ongi ___.', validFor: [] }],
        zu: [{ text: 'Zuri gauza hauek ongi ___.', validFor: [] }],
        hura: [{ text: 'Hari gauza hauek ongi ___.', validFor: [] }],
        gu: [{ text: 'Guri gauza hauek ongi ___.', validFor: [] }],
        zuek: [{ text: 'Zuei gauza hauek ongi ___.', validFor: [] }],
        haiek: [{ text: 'Haiei gauza hauek ongi ___.', validFor: [] }],
      },
      past: {
        ni: [{ text: 'Niri atzo ongi ___.', validFor: [] }],
        zu: [{ text: 'Zuri herenegun ongi ___.', validFor: [] }],
        hura: [{ text: 'Hari lehengo egunean ongi ___.', validFor: [] }],
        gu: [{ text: 'Guri iaz ongi ___.', validFor: [] }],
        zuek: [{ text: 'Zuei duela bi egun ongi ___.', validFor: [] }],
        haiek: [{ text: 'Haiei joan den astean ongi ___.', validFor: [] }],
      },
    },
  },
  {
    id: 'ahaztu',
    verb: 'ahaztu',
    meaning: { en: 'to forget', es: 'olvidar', eu: 'ahaztu' },
    type: 'periphrastic',
    agreement: ['nor', 'nori'],
    object: 'hura',
    dialect: 'batua',
    // Present is the bare participle + present dative aux (`ahaztu zait`),
    // *not* the `-tzen` habitual (`ahazten zait`, "I tend to forget it") —
    // the resultative reading ("it is [in a state of being] forgotten to
    // me") is what `docs/LEARNING_JOURNEY_PROPOSED.md`'s dedicated `ahaztu`
    // table and Unit 23 example ("Liburua ahaztu zait") both use.
    conjugations: {
      present: {
        ni: 'ahaztu zait', zu: 'ahaztu zaizu', hura: 'ahaztu zaio',
        gu: 'ahaztu zaigu', zuek: 'ahaztu zaizue', haiek: 'ahaztu zaie',
      },
      past: {
        ni: 'ahaztu zitzaidan', zu: 'ahaztu zitzaizun', hura: 'ahaztu zitzaion',
        gu: 'ahaztu zitzaigun', zuek: 'ahaztu zitzaizuen', haiek: 'ahaztu zitzaien',
      },
      future: {
        ni: 'ahaztuko zait', zu: 'ahaztuko zaizu', hura: 'ahaztuko zaio',
        gu: 'ahaztuko zaigu', zuek: 'ahaztuko zaizue', haiek: 'ahaztuko zaie',
      },
      // #164: plural-`NOR` counterpart — this is the pairing the issue's own
      // worked example uses ("Giltzak ahaztu zaizkit" = "I forgot the
      // keys"), since `ahaztu` (unlike `gustatu`/`iruditu`) most naturally
      // takes a concrete, often-plural object in everyday use.
      presentPlural: {
        ni: 'ahaztu zaizkit', zu: 'ahaztu zaizkizu', hura: 'ahaztu zaizkio',
        gu: 'ahaztu zaizkigu', zuek: 'ahaztu zaizkizue', haiek: 'ahaztu zaizkie',
      },
      pastPlural: {
        ni: 'ahaztu zitzaizkidan', zu: 'ahaztu zitzaizkizun', hura: 'ahaztu zitzaizkion',
        gu: 'ahaztu zitzaizkigun', zuek: 'ahaztu zitzaizkizuen', haiek: 'ahaztu zitzaizkien',
      },
      futurePlural: {
        ni: 'ahaztuko zaizkit', zu: 'ahaztuko zaizkizu', hura: 'ahaztuko zaizkio',
        gu: 'ahaztuko zaizkigu', zuek: 'ahaztuko zaizkizue', haiek: 'ahaztuko zaizkie',
      },
    },
    // #263: `validFor: ['gustatu']` — "Niri liburua gustatzen zait" ("I like
    // the book") is a fully natural, self-contained substitution, the mirror
    // of `gustatu`'s own judgment above. `iruditu` excluded for the same
    // "needs a predicate" reason ("liburua iruditzen zait" alone is
    // incomplete).
    sentences: {
      present: {
        ni: [{ text: 'Niri liburua ___.', validFor: ['gustatu'] }],
        zu: [{ text: 'Zuri liburua ___.', validFor: ['gustatu'] }],
        hura: [{ text: 'Hari liburua ___.', validFor: ['gustatu'] }],
        gu: [{ text: 'Guri liburua ___.', validFor: ['gustatu'] }],
        zuek: [{ text: 'Zuei liburua ___.', validFor: ['gustatu'] }],
        haiek: [{ text: 'Haiei liburua ___.', validFor: ['gustatu'] }],
      },
      // #164: the issue's own worked example — "Giltzak ahaztu zaizkit" ("I
      // forgot the keys"). #263: same `gustatu`-only judgment as the
      // singular table above ("Niri giltzak gustatzen zaizkit" = "I like
      // the keys").
      presentPlural: {
        ni: [{ text: 'Niri giltzak ___.', validFor: ['gustatu'] }],
        zu: [{ text: 'Zuri giltzak ___.', validFor: ['gustatu'] }],
        hura: [{ text: 'Hari giltzak ___.', validFor: ['gustatu'] }],
        gu: [{ text: 'Guri giltzak ___.', validFor: ['gustatu'] }],
        zuek: [{ text: 'Zuei giltzak ___.', validFor: ['gustatu'] }],
        haiek: [{ text: 'Haiei giltzak ___.', validFor: ['gustatu'] }],
      },
      past: {
        ni: [{ text: 'Niri atzo liburua ___.', validFor: ['gustatu'] }],
        zu: [{ text: 'Zuri herenegun liburua ___.', validFor: ['gustatu'] }],
        hura: [{ text: 'Hari lehengo egunean liburua ___.', validFor: ['gustatu'] }],
        gu: [{ text: 'Guri iaz liburua ___.', validFor: ['gustatu'] }],
        zuek: [{ text: 'Zuei duela bi egun liburua ___.', validFor: ['gustatu'] }],
        haiek: [{ text: 'Haiei joan den astean liburua ___.', validFor: ['gustatu'] }],
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

// `conjugations.past` table. Unlike the future loop above, `sentences.past`
// is *not* reused-by-reference from `present` here (#267) — a past-tense
// question reusing a present-tense frame verbatim reads as tense-ambiguous
// ("Hura kalean ___." gives no hint whether it's asking for `dabil` or `ibili
// zen`), so every verb in this list now carries its own hand-written
// `sentences.past` with a past-time adverb inserted. This loop only fills in
// `sentences.past` by reference as a fallback for a verb that doesn't have
// one yet (kept so a future verb added to this list without an explicit past
// table degrades gracefully instead of ending up with no sentence at all).
// `pronounSentences.past` mostly keeps the reuse-by-reference behavior —
// `pronoun`/`type-pronoun` questions don't display a sentence frame's tense
// the same way, so they're mostly out of scope for this change — except
// `etorri` (#268), whose embedded present forms (`nator`/`zatoz`/...) would
// otherwise leak into a past-tense lesson; it defines its own
// `pronounSentences.past`, which this loop must not clobber.
for (const verb of VERBS) {
  if (!verb.conjugations.past) continue
  if (!verb.sentences?.past && verb.sentences?.present) verb.sentences.past = verb.sentences.present
  if (!verb.pronounSentences?.past && verb.pronounSentences?.present) verb.pronounSentences.past = verb.pronounSentences.present
}

// Only single-word past forms (`nintzen`, `zegoen`, `zuen`, `zeukan`, ...)
// stay intact under `ez`-negation the same way their present forms do —
// joan/etorri/ikusi/jan/edan/erosi/ibili's past is periphrastic
// (`joan nintzen`, `ikusi nuen`, ...), and negation fronts the auxiliary
// with different word order, same reason those verbs lack
// `negativeSentences` for the present.
const SINGLE_WORD_PAST_NEGATION = ['izan', 'egon', 'ukan', 'eduki', 'jakin']
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
  // #167: `hi`-as-`NORK`'s own present-tense gender split (`duk`/`dun`,
  // `dakik`/`dakin`) — distinct from toka/noka, which are new tense keys
  // below rather than person keys, since there the gender marks the
  // addressee of a *different* statement, not `hi` itself as subject.
  'hi-m': 'personHiM',
  'hi-f': 'personHiF',
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
  potential: { labelKey: 'tensePotential', basque: 'ahalera' },
  baldintza: { labelKey: 'tenseBaldintza', basque: 'baldintza' },
  conditional: { labelKey: 'tenseConditional', basque: 'ondorioa' },
  // #164: plural-`NOR` counterparts of present/past/future for NOR-NORI
  // verbs (`gustatu`/`iruditu`/`ahaztu`) — same tense, `-zki-`-infixed
  // because the fixed `NOR` argument is `haiek` instead of `hura`.
  presentPlural: { labelKey: 'tensePresentPlural', basque: 'oraina (anitza)' },
  pastPlural: { labelKey: 'tensePastPlural', basque: 'lehena (anitza)' },
  futurePlural: { labelKey: 'tenseFuturePlural', basque: 'geroa (anitza)' },
  // #167: toka/noka (allocutive masculine/feminine register) — addressee
  // agreement layered onto a 3rd-person statement, modeled as new tense
  // keys rather than person keys (see PERSON_LABEL_KEYS comment above).
  presentToka: { labelKey: 'tensePresentToka', basque: 'oraina (toka)' },
  presentNoka: { labelKey: 'tensePresentNoka', basque: 'oraina (noka)' },
  pastToka: { labelKey: 'tensePastToka', basque: 'lehena (toka)' },
  pastNoka: { labelKey: 'tensePastNoka', basque: 'lehena (noka)' },
  // #171: imperative (agintera) — second-person only, no ni/hura/gu/haiek cells.
  imperative: { labelKey: 'tenseImperative', basque: 'agintera' },
  // Unit 21/22: imperfective/habitual past — `habitualPast` is the general
  // periphrastic rule (participle + past auxiliary, e.g. `ikusten nuen`);
  // `imperfectivePast` is the native synthetic exception specific to
  // motion verbs (`nindoan`, `zetorren`, `nenbilen`).
  habitualPast: { labelKey: 'tenseHabitualPast', basque: 'lehen burutugabea' },
  imperfectivePast: { labelKey: 'tenseImperfectivePast', basque: 'lehen burutugabea (mugimendua)' },
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
