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
// #346: a `nor-nork` verb can *additionally* carry a real 2D table under a
// separate tense key — `conjugations[tense] = { [nork]: { [nor]: form } }`
// instead of the usual flat `[person]: form` — to drill the object axis
// rather than (or in addition to) the subject axis the plain `object: 'hura'`
// tables above are restricted to. `ukan`'s `presentByObject` is the first:
// same cells as `present`'s `hura` column plus the five other `nor` columns
// from `docs/CONJUGATIONS.md` §3's "NOR = 1st/2nd person" grid. `hi` is
// omitted (per #345's scope note) and so is every cell `docs/CONJUGATIONS.md`
// marks `*(refl.)*` — not just the literal `nork === nor` diagonal, but the
// whole same-person-category block (1st: `ni`/`gu`; 2nd: `zu`/`zuek`) the
// grid itself marks reflexive, e.g. `nik` -> `gu` and `guk` -> `ni` are both
// gaps, not just `nik` -> `ni`. A lesson opts into reading this 2D shape via
// `objectAxis: { vary, fixed }` (`generateQuestions`/`resolveObjectAxisTable`
// in `lessonLogic.js`): `vary: 'nor'` fixes `nork` at `fixed` and drills the
// object across `person`; `vary: 'nork'` fixes `nor` at `fixed` and drills
// the subject, the same shape `object: 'hura'` already produces but reusable
// for a non-`hura` fixed object. Once resolved to a flat table, every
// downstream consumer (`buildOptions`, lures, sentences) is unchanged — the
// 2D shape never reaches them directly.
//
// `dialect` is a placeholder for future variants: a verb could later carry
// e.g. `dialectVariants: { bizkaiera: { conjugations: {...} } }` overrides
// without changing this shape.
//
// `dativeOvergeneration` (#293, optional, NOR-NORK verbs only) flags verbs
// that are "optionally ditransitive" in real usage — they're modeled here
// with a fixed `object` and no `nori`, but commonly take an extra "to/for
// someone" dative in natural sentences (`eraman`/`ekarri`/`erosi`/`hartu`:
// carrying/bringing/buying/taking something *to/for* someone). Learners
// over-extend a phantom dative and reach for the NOR-NORI-NORK auxiliary
// family (`eramango diot`) instead of the correct NOR-NORK one (`eramango
// dut`) — see `getDativeOvergenerationLure` (`lessonLogic.js`). Deliberately
// not set on every NOR-NORK verb — `jan`/`edan` rarely take a natural dative
// in basic sentences, so the same lure there wouldn't reflect a real error.
//
// `recognitionOnly` (#330, optional) marks a verb that should never be drilled
// for production (typed answers, fill-in-the-blank, spot-the-error) even when
// it's sampled as a carrier inside an otherwise-production conjugation pool
// (see `CARRIERS_PER_SESSION` in `App.jsx`) — for academic-tier verbs that are
// worth recognising in a sentence but not worth recalling cold. Distinct from
// a lesson's `mode: 'recognition'`, which applies to every source in that
// lesson; this applies per-verb, so a rare carrier stays recognition-only
// even mixed into a pool of otherwise-typed verbs.
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
      // #281/Unit 11 — Lehenaldiko Burutua (present perfect): `izan`'s own
      // participle (`izan`) + its own present auxiliary, per
      // CONJUGATIONS.md §11/§1 ("izan naiz", "I have been"). Same shape as
      // `past` above, just swapping the past aux for the present one.
      presentPerfect: {
        ni: 'izan naiz',
        hi: 'izan haiz',
        zu: 'izan zara',
        hura: 'izan da',
        gu: 'izan gara',
        zuek: 'izan zarete',
        haiek: 'izan dira',
      },
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
          { text: 'Ni upategian ___ txakolin botilak etiketatzen.', validFor: [] },
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
          { text: 'Gaur gure amona baserrian ___.', validFor: [] },
          { text: 'Gure osaba arrantzalea Getariako portuko tabernan ___.', validFor: [] },
        ],
        gu: [
          { text: 'Gu etxean ___.', validFor: [] },
          { text: 'Gu lanean ___.', validFor: [] },
          { text: 'Gu Bilbon ___.', validFor: [] },
          { text: 'Gu liburutegian ___.', validFor: [] },
          { text: 'Gu Bilboko Zazpi Kaleetan ___ lagunen zain.', validFor: [] },
        ],
        zuek: [
          { text: 'Zuek kalean ___.', validFor: [] },
          { text: 'Zuek dendan ___.', validFor: [] },
          { text: 'Zuek Donostian ___.', validFor: [] },
          { text: 'Zuek ikasgelan ___.', validFor: [] },
          { text: 'Zuek gaur oso nekatuta ___ Gorbeia mendira igon ondoren.', validFor: [] },
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
          { text: 'Amona sukaldean ___ marmitakoa sutan prestatzen.', validFor: [] },
        ],
        gu: [
          { text: 'Gu atzo etxean ___.', validFor: [] },
          { text: 'Gu herenegun lanean ___.', validFor: [] },
          { text: 'Gu iaz Bilbon ___.', validFor: [] },
          { text: 'Gu joan den astean liburutegian ___.', validFor: [] },
          { text: 'Gu atzo Bilboko Guggenheim museoaren aurrean ___ zain.', validFor: [] },
          { text: 'Gu atzo arratsaldean Donostiako hondartzan ___ jendea begiratzen.', validFor: [] },
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
          { text: 'Atzo mendizaleak Gorbeiako gailurrean ___ ekaitza hasi zenean.', validFor: [] },
          { text: 'Arrantzaleak itsasontzian ___ ekaitza hasi zenean.', validFor: [] },
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
      // #284: plural-object (`NOR` = `haiek`) forms, per CONJUGATIONS.md §3's
      // "`NOR` = 1st/2nd person" grid's `haiek` column — the same `dit-`-stem
      // pattern already used for `esan`/`eman`/`gustatu`'s `<tense>Plural`
      // tables (#162/#164). `hi`'s past stays unsplit (`hituen`), mirroring
      // the singular `past.hi: 'huen'` above. Flagged in
      // docs/LANGUAGE_DECISIONS.md for native-speaker confirmation.
      presentPlural: { ni: 'ditut', zu: 'dituzu', hura: 'ditu', gu: 'ditugu', zuek: 'dituzue', haiek: 'dituzte', 'hi-m': 'dituk', 'hi-f': 'ditun' },
      pastPlural: { ni: 'nituen', zu: 'zenituen', hura: 'zituen', gu: 'genituen', zuek: 'zenituzten', haiek: 'zituzten', hi: 'hituen' },
      futurePlural: {
        ni: 'izango ditut',
        zu: 'izango dituzu',
        hura: 'izango ditu',
        gu: 'izango ditugu',
        zuek: 'izango dituzue',
        haiek: 'izango dituzte',
      },
      // #171 core scope — NOR-NORK Agintera (imperative, generic "do it!"),
      // singular-object column only, per CONJUGATIONS.md §16.2. `hi`-m/`hi`-f
      // split (`ezak`/`ezan`) since `hi` is the grammatical NORK subject
      // here, matching #167's `hi`-as-NORK convention. 3rd-person jussive
      // (`beza`/`bitza`), 1st-person hortative (`dezagun`), the plural-object
      // (`-itz-`) column, and the ditransitive (`iezadazu`) imperative are
      // out of scope for this table — see the issue filed for #171's
      // remaining scope.
      imperative: { 'hi-m': 'ezak', 'hi-f': 'ezan', zu: 'ezazu', zuek: 'ezazue' },
      // #346: real 2D NOR-NORK table (`{ [nork]: { [nor]: form } }`) — see
      // the `object`-vs-2D note near the top of this file. Transcribed from
      // `docs/CONJUGATIONS.md` §3's "Present — NOR = 1st/2nd person" grid,
      // `hi` omitted and every `*(refl.)*` cell (the whole same-person-
      // category block, not just the literal diagonal) left as a gap. Each
      // `[nork]` row's `hura` cell matches `present[nork]` above exactly
      // (e.g. `presentByObject.ni.hura === present.ni`, both `'dut'`) — the
      // citation paradigm is this grid's `nor: 'hura'` column.
      presentByObject: {
        ni: { hura: 'dut', zu: 'zaitut', zuek: 'zaituztet', haiek: 'ditut' },
        hura: { ni: 'nau', hura: 'du', gu: 'gaitu', zu: 'zaitu', zuek: 'zaituzte', haiek: 'ditu' },
        gu: { hura: 'dugu', zu: 'zaitugu', zuek: 'zaituztegu', haiek: 'ditugu' },
        zu: { ni: 'nauzu', hura: 'duzu', gu: 'gaituzu', haiek: 'dituzu' },
        zuek: { ni: 'nauzue', hura: 'duzue', gu: 'gaituzue', haiek: 'dituzue' },
        haiek: { ni: 'naute', hura: 'dute', gu: 'gaituzte', zu: 'zaituzte', zuek: 'zaituztete', haiek: 'dituzte' },
      },
      // #347: `past`'s NOR-NORK object axis, same shape/sourcing as
      // `presentByObject` above, transcribed from `docs/CONJUGATIONS.md`
      // §3's "Past — NOR = 1st/2nd person" grid. Each `[nork]` row's `hura`
      // cell matches `past[nork]` exactly, same cross-check convention.
      pastByObject: {
        ni: { hura: 'nuen', zu: 'zintudan', zuek: 'zintuztedan', haiek: 'nituen' },
        hura: { ni: 'ninduen', hura: 'zuen', gu: 'gintuen', zu: 'zintuen', zuek: 'zintuzten', haiek: 'zituen' },
        gu: { hura: 'genuen', zu: 'zintugun', zuek: 'zintuztegun', haiek: 'genituen' },
        zu: { ni: 'ninduzun', hura: 'zenuen', gu: 'gintuzun', haiek: 'zenituen' },
        zuek: { ni: 'ninduzuen', hura: 'zenuten', gu: 'gintuzuen', haiek: 'zenituzten' },
        haiek: { ni: 'ninduten', hura: 'zuten', gu: 'gintuzten', zu: 'zintuzten', zuek: 'zintuzteten', haiek: 'zituzten' },
      },
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
      // #312: cultural-bank `presentPlural` item — "ardi latxak" (Latxa
      // sheep) is a plural object, drives `dituzte` rather than `du`/`dute`.
      presentPlural: {
        haiek: [{ text: 'Baserritarrek ardi latxak ___ mendian.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] }],
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
          { text: 'Guk Getariako txakolin botila bat ___ hozkailuan.', validFor: ['nahi', 'eduki', 'ikusi', 'erosi', 'behar'] },
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
      // #284: plural-object (`NOR` = `haiek`) forms, riding `ukan`'s own
      // `presentPlural`/`futurePlural` suffixes the same way the singular
      // tables above ride its `present`/`future` suffixes. No `pastPlural` —
      // `nahi` has no `past` table to mirror.
      presentPlural: { ni: 'nahi ditut', zu: 'nahi dituzu', hura: 'nahi ditu', gu: 'nahi ditugu', zuek: 'nahi dituzue', haiek: 'nahi dituzte' },
      futurePlural: { ni: 'nahiko ditut', zu: 'nahiko dituzu', hura: 'nahiko ditu', gu: 'nahiko ditugu', zuek: 'nahiko dituzue', haiek: 'nahiko dituzte' },
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
          // #313: two more infinitive-complement variants, same `validFor: []`
          // reasoning as `'Zuk etorri ___?'` below.
          { text: 'Nik gaur gauean sagardotegira joan ___.', validFor: [] },
          { text: 'Nik baserriko sukaldean euskal pastela egiten ikasi ___.', validFor: [] },
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
          // #313: NOR-NORK infinitive-complement variant, same shape as the
          // others above.
          { text: 'Arrantzaleek gaur gauean portura garaiz itzuli ___.', validFor: [] },
        ],
      },
      // #313: `presentPlural` block (plural-`NOR` object) — `nahi` had no
      // `past` to mirror, but it does have `presentPlural`/`futurePlural`
      // tables (#284) that #312/the modal bank's earlier pass left
      // unpopulated. Both items here have a genuinely plural object
      // (`itsaslabarrak`/`aditz guztiak`), correctly driving `dituzte`/
      // `ditugu` rather than the singular table's `du`/`dugu`.
      presentPlural: {
        gu: [{ text: 'Guk gure aplikazioan euskal aditz guztiak sartu ___.', validFor: [] }],
        haiek: [{ text: 'Turistek Zumaia Flysch-eko itsaslabarrak argazkitan hartu ___.', validFor: [] }],
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
    // #288: the blank sits directly after the infinitive, with no literal
    // `behar`/`beharko` before it — the conjugated form (`behar dut`,
    // `beharko zuen`, ...) already supplies the modal word, so writing it
    // again in the template doubled it (`... behar behar dute.`).
    sentences: {
      present: {
        ni: [{ text: 'Nik gaur arratsaldean etxera joan ___.', validFor: [] }],
        zu: [{ text: 'Zuk bihar goizean garaiz esnatu ___?', validFor: [] }],
        hura: [{ text: 'Sukaldariak legatz freskoa garbitu ___.', validFor: [] }],
        gu: [{ text: 'Guk aplikazio berria instalatu ___.', validFor: [] }],
        zuek: [{ text: 'Zuek sarrera bat erosi ___?', validFor: [] }],
        haiek: [{ text: 'Herritarrek dantza ondo entrenatu ___.', validFor: [] }],
      },
      past: {
        ni: [{ text: 'Nik atzo etxera joan ___.', validFor: [] }],
        zu: [{ text: 'Zuk atzo goiz esnatu ___?', validFor: [] }],
        hura: [{ text: 'Sukaldariak legatza garbitu ___.', validFor: [] }],
        gu: [{ text: 'Guk aplikazioa instalatu ___.', validFor: [] }],
        zuek: [{ text: 'Zuek sarrera erosi ___?', validFor: [] }],
        haiek: [{ text: 'Herritarrek dantza entrenatu ___.', validFor: [] }],
      },
      future: {
        ni: [{ text: 'Nik bihar lana bukatu ___.', validFor: [] }],
        zu: [{ text: 'Zuk trena goiz hartu ___?', validFor: [] }],
        hura: [{ text: 'Mendizaleak mapa bat eraman ___.', validFor: [] }],
        gu: [{ text: 'Guk etxe berria garbitu ___.', validFor: [] }],
        zuek: [{ text: 'Zuek txartel berria erosi ___?', validFor: [] }],
        haiek: [{ text: 'Sukaldariek txuleta erre ___.', validFor: [] }],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  // `maite izan` ("to love", lit. "to hold dear") — #348, the same
  // invariant-particle + `ukan` shape as `nahi`/`behar` above (see
  // VERB_COVERAGE.md's §5 note), but unlike them its citation object
  // (`hura`) isn't the interesting case: `maite`'s whole point is the
  // NOR-NORK object axis (`ukan.presentByObject`/`pastByObject`), since
  // "I love you" ("Maite zaitut") needs a 2nd-person *object*, not the
  // default 3rd-person one. `present`/`past` ride `ukan.present`/`ukan.past`
  // verbatim with a `'maite '` prefix; `presentByObject`/`pastByObject` do
  // the same to every cell of `ukan.presentByObject`/`ukan.pastByObject`.
  // No `presentPlural`/`futurePlural` (out of #348's scope) and no
  // `sentences` at all — see the form-only note below `conjugations`.
  {
    id: 'maite',
    verb: 'maite izan',
    meaning: { en: 'to love', es: 'querer / amar', eu: 'maite izan' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'maite dut',
        zu: 'maite duzu',
        hura: 'maite du',
        gu: 'maite dugu',
        zuek: 'maite duzue',
        haiek: 'maite dute',
      },
      past: {
        ni: 'maite nuen',
        zu: 'maite zenuen',
        hura: 'maite zuen',
        gu: 'maite genuen',
        zuek: 'maite zenuten',
        haiek: 'maite zuten',
      },
      // 2D NOR-NORK table, same shape/sourcing convention as `ukan`'s own
      // (#346/#347) — every cell is `ukan.presentByObject`'s matching cell
      // with a `'maite '` prefix, so `presentByObject.ni.zu === 'maite ' +
      // ukan.presentByObject.ni.zu` ("maite zaitut") holds by construction.
      presentByObject: {
        ni: { hura: 'maite dut', zu: 'maite zaitut', zuek: 'maite zaituztet', haiek: 'maite ditut' },
        hura: { ni: 'maite nau', hura: 'maite du', gu: 'maite gaitu', zu: 'maite zaitu', zuek: 'maite zaituzte', haiek: 'maite ditu' },
        gu: { hura: 'maite dugu', zu: 'maite zaitugu', zuek: 'maite zaituztegu', haiek: 'maite ditugu' },
        zu: { ni: 'maite nauzu', hura: 'maite duzu', gu: 'maite gaituzu', haiek: 'maite dituzu' },
        zuek: { ni: 'maite nauzue', hura: 'maite duzue', gu: 'maite gaituzue', haiek: 'maite dituzue' },
        haiek: { ni: 'maite naute', hura: 'maite dute', gu: 'maite gaituzte', zu: 'maite zaituzte', zuek: 'maite zaituztete', haiek: 'maite dituzte' },
      },
      pastByObject: {
        ni: { hura: 'maite nuen', zu: 'maite zintudan', zuek: 'maite zintuztedan', haiek: 'maite nituen' },
        hura: { ni: 'maite ninduen', hura: 'maite zuen', gu: 'maite gintuen', zu: 'maite zintuen', zuek: 'maite zintuzten', haiek: 'maite zituen' },
        gu: { hura: 'maite genuen', zu: 'maite zintugun', zuek: 'maite zintuztegun', haiek: 'maite genituen' },
        zu: { ni: 'maite ninduzun', hura: 'maite zenuen', gu: 'maite gintuzun', haiek: 'maite zenituen' },
        zuek: { ni: 'maite ninduzuen', hura: 'maite zenuten', gu: 'maite gintuzuen', haiek: 'maite zenituzten' },
        haiek: { ni: 'maite ninduten', hura: 'maite zuten', gu: 'maite gintuzten', zu: 'maite zintuzten', zuek: 'maite zintuzteten', haiek: 'maite zituzten' },
      },
    },
    // Form-only, same as `ukan.presentByObject`/`pastByObject` (#347) — no
    // `sentences` for *any* tense here, including the plain `present`/
    // `past`. Two independent reasons stack: (1) a `maite`-fits citation
    // frame ("Nik X maite dut") is exactly the awkward-object problem
    // `ukan` itself already opted out of describing for the same reason;
    // (2) `validforGapAudit.mjs`'s `collectTaggedVariants`/`computeGapSlots`
    // reads `verb.conjugations[tense]?.[person]` assuming a flat table —
    // `presentByObject`/`pastByObject` are 2D (`{ [nork]: { [nor]: form } }`),
    // so any `sentences[tense][person]` keyed by the varying axis collides
    // with that flat-lookup assumption and corrupts the gap audit (a
    // `[object Object]`-shaped "form"). The "exercises the new axis" bar is
    // met the same way #347 met it for `ukan`: a logic-level smoke test
    // (`src/logic.test.js`) running `generateQuestions` against this entry.
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
      // #287: plural-object forms, deferred by #284 since `jakin` is its own
      // synthetic stem (not `ukan`'s `dit-` swap, nor `eduki`'s `-z-` infix).
      // Derived by analogy from CONJUGATIONS.md's own NOR-NORI subjunctive
      // grid, which independently attests this exact `daki-`/`zeki-` stem
      // taking a `-zki-` infix right before its person suffix
      // (`dakidan`→`dakizkidan`, `zekidan`→`zekizkidan`, etc.) — applying the
      // same insertion point to the indicative present/past tables above.
      // `presentPlural` only covers the persons already present in `present`
      // (no `gu`/`zuek`/`haiek` there yet, a pre-existing gap, not new here).
      // No `futurePlural`: `future` itself only has 3 persons, same omission
      // precedent as `nahi`'s missing `pastPlural`. Same native-speaker-check
      // caveat as #284 — see docs/LANGUAGE_DECISIONS.md.
      presentPlural: { ni: 'dakizkit', zu: 'dakizkizu', hura: 'dakizki', 'hi-m': 'dakizkik', 'hi-f': 'dakizkin' },
      pastPlural: { ni: 'nekizkien', hi: 'hekizkien', zu: 'zenekizkien', hura: 'zekizkien', gu: 'genekizkien', zuek: 'zenekizkiten', haiek: 'zekizkiten' },
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
          { text: 'Nik ondo ___ Tolosako babarrunak nola prestatu.', validFor: [] },
          { text: 'Nik oso ondo ___ zein den euskal pastelik onena.', validFor: [] },
          { text: 'Nik oso ondo ___ Idiazabal gazta nola egiten den baserrietan.', validFor: [] },
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
    // #289: `gu`/`zuek`/`haiek` added — `jakin`'s `past` table conjugates
    // these persons (NORK, ergative) but `pronouns` previously stopped at
    // `hura`, so the plain-drill heading fell back to the raw key (`gu`)
    // instead of the declined form (`Guk`) for `jakin-past`-family lessons.
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
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
      // #312: cultural-bank negated-past items — both use `ez zekien`/`ez
      // zekiten` ("didn't know that..."), so they're `negativeSentences`
      // entries rather than plain `sentences.past`.
      past: {
        ni: { text: 'Nik ez ___ erantzuna.', validFor: ['ikusi', 'nahi'] },
        zu: { text: 'Zuk ez ___ egia.', validFor: ['ikusi', 'nahi'] },
        hura: { text: 'Aitonak ez ___ gaur gauean sagardotegira joateko plana genuenik.', validFor: [] },
        haiek: { text: 'Gure gurasoek ez ___ bertsolarien saioa gaur arratsaldean zenik.', validFor: [] },
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
      // `docs/CONJUGATIONS.md` §6. #313: now has `sentences` (cultural-bank
      // items below) — see `docs/LANGUAGE_DECISIONS.md`.
      imperfectivePast: {
        ni: 'nindoan',
        hi: 'hindoan',
        zu: 'zindoazen',
        hura: 'zihoan',
        gu: 'gindoazen',
        zuek: 'zindoazten',
        haiek: 'zihoazen',
      },
      // #281/Unit 11 — present perfect: `joan`'s participle (`joan`) + the
      // present `izan` auxiliary, same shape as `past` above with the past
      // aux swapped for the present one.
      presentPerfect: {
        ni: 'joan naiz',
        hi: 'joan haiz',
        zu: 'joan zara',
        hura: 'joan da',
        gu: 'joan gara',
        zuek: 'joan zarete',
        haiek: 'joan dira',
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
          { text: 'Zu gaur goizean Gernikako azokara ___ barazki freskoen bila.', validFor: ['etorri'] },
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
          { text: 'Gu asteburu honetan Baionako festetara ___ lagunekin.', validFor: ['etorri'] },
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
          { text: 'Goizero haurrak oinez ___ herriko eskolara.', validFor: ['etorri'] },
          { text: 'Mendizaleak azkar ___ Anbotoko jatorrizko kobazulorantz.', validFor: ['etorri'] },
          { text: 'Datorren astean, baserritarrak Gernikako azokara ___.', validFor: ['etorri'] },
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
      // #313: cultural-bank items for `imperfectivePast` (ongoing/habitual
      // "I was going..."), distinct from `past`'s simple "I went" above —
      // `docs/SAMPLE_SENTENCES.md`'s synthetic-verbs bank's "Past" examples
      // for `joan` actually use this table's forms (`gindoazen`/`zindoazen`/
      // etc.), not `past`'s (`joan zen`), which #312 missed. Allative/
      // ablative-directional ones keep `joan`'s usual `validFor: ['etorri']`
      // (`etorri` has its own `imperfectivePast` table); `ni`'s is a bare
      // locative ("in the forest") with no directional cue, closer to
      // `ibili`'s territory — tentative `validFor: ['ibili']`, flagged for
      // #316.
      imperfectivePast: {
        ni: [{ text: 'Ni bakarrik ___ basoan Basajaun ikusi nuenean.', validFor: ['ibili'] }],
        zu: [{ text: 'Zu iaz Donostiako Parte Zaharreko pintxo taberna guztietara ___.', validFor: ['etorri'] }],
        gu: [{ text: 'Iaz gu Baionako jaietara ___ autoan bidea galdu genuenean.', validFor: ['etorri'] }],
        zuek: [{ text: 'Zuek iaz oinez ___ Donostiatik Behobiara bide zaharretik.', validFor: ['etorri'] }],
        haiek: [{ text: 'Haurrak korrika ___ Olentzero ikustera plazara.', validFor: ['etorri'] }],
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
      // #281/Unit 11 — present perfect: `etorri`'s participle (`etorri`) +
      // the present `izan` auxiliary, same shape as `past` above with the
      // past aux swapped for the present one.
      presentPerfect: {
        ni: 'etorri naiz',
        hi: 'etorri haiz',
        zu: 'etorri zara',
        hura: 'etorri da',
        gu: 'etorri gara',
        zuek: 'etorri zarete',
        haiek: 'etorri dira',
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
          { text: 'Zu itsasotik datorren haize hotzarekin ___ etxera.', validFor: ['joan'] },
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
          { text: 'Gu pozik ___ frontonetik gure herriko pilotariek irabazi dutelako.', validFor: [] },
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
          { text: 'Begira! Dantzariek Zuberoako jantzi politak jantzita ___.', validFor: ['joan'] },
          { text: 'Begira, Zuberoako maskaradako dantzariak kantuan ___ herriko plazara!', validFor: ['joan'] },
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
      // #281/Unit 11 — present perfect, the recency-marked counterpart to
      // `past` above: same allative frames, `gaur`/`gaurkoan` ("today")
      // instead of `atzo`/`herenegun`, so the adverb cues `presentPerfect`
      // (`etorri da`) over `past` (`etorri zen`) per #283's recency framing.
      presentPerfect: {
        ni: [
          { text: 'Ni gaur etxera ___.', validFor: ['joan'] },
          { text: 'Ni gaur eskolara ___.', validFor: ['joan'] },
          { text: 'Ni gaurkoan hondartzara ___.', validFor: ['joan'] },
        ],
        zu: [
          { text: 'Zu gaur dendara ___.', validFor: ['joan'] },
          { text: 'Zu gaurkoan etxera ___.', validFor: ['joan'] },
        ],
        hura: [
          { text: 'Hura gaur ikastolara ___.', validFor: ['joan'] },
          { text: 'Mikel gaur liburutegira ___.', validFor: ['joan'] },
          { text: 'Ane gaurkoan etxera ___.', validFor: ['joan'] },
        ],
        gu: [
          { text: 'Gu gaur etxera ___.', validFor: ['joan'] },
          { text: 'Gu gaurkoan liburutegira ___.', validFor: ['joan'] },
        ],
        zuek: [
          { text: 'Zuek gaur dendara ___.', validFor: ['joan'] },
          { text: 'Zuek gaurkoan etxera ___.', validFor: ['joan'] },
        ],
        haiek: [
          { text: 'Haiek gaur auzora ___.', validFor: ['joan'] },
          { text: 'Mikel eta Ane gaurkoan liburutegira ___.', validFor: ['joan'] },
        ],
      },
      // #313: cultural-bank items for `imperfectivePast` (`etorri`'s native
      // synthetic "I was coming", distinct from `habitualPast`'s periphrastic
      // form above) — `docs/SAMPLE_SENTENCES.md`'s synthetic-verbs bank's
      // "Past" examples for `etorri` use this table's forms (`zetorren`/
      // `zentozten`/etc.), which #312 missed (it only covered `present`/
      // `past`). Ablative-source-only sentences ("...museotik...",
      // "...baserritik...", "...janketatik...") get the tentative
      // `validFor: []` `etorri` already uses for its own ablative-only
      // present items — no sibling shares the "coming from X" reading
      // without also needing a destination; flagged for #316 confirmation.
      // The "Zuek korrika zentozten Korrika festan..." item is skipped —
      // same bare-locative-with-no-directional-cue problem #125 already
      // fixed for `etorri`'s other tables (needs a rewrite, left for #316).
      imperfectivePast: {
        ni: [{ text: 'Ni oso nekatuta ___ Tolosako babarrun janketatik.', validFor: [] }],
        hura: [{ text: 'Zuzendaria Bilboko Guggenheim museotik ___ nirekin topo egin duenean.', validFor: [] }],
        zuek: [{ text: 'Zuek pilotarien partidatik ___ pozik irabazi zutelako.', validFor: [] }],
        haiek: [{ text: 'Gurasoak goizeko lehen orduan ___ baserritik esnearekin.', validFor: [] }],
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
      // #281/Unit 11 — present perfect, the `gaur` recency counterpart to
      // `past` above (same embedded forms as the `presentPerfect`
      // conjugation table).
      presentPerfect: {
        ni: '___ gaur etxera etorri naiz.',
        zu: '___ gaur etorri zara.',
        hura: '___ gaur etorri da.',
        gu: '___ gaur etxera etorri gara.',
        zuek: '___ gaur etorri zarete.',
        haiek: '___ gaur etorri dira.',
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
        zu: [
          'Zu zer ___?',
          'Zu zer egiten ___?',
          'Zu irakurtzen ___?',
          // #313: embedded verb "dasten" (from "dastatu", not in `VERBS`) —
          // untagged per the comment above, same as the other unlisted
          // participles.
          'Zu Idiazabal gazta eta txakolina dasten ___ plazako azokan.',
        ],
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
      // #284: plural-object (`NOR` = `haiek`) forms — same participle, `dit-`
      // stem auxiliary, per CONJUGATIONS.md §3.
      presentPlural: {
        ni: 'jaten ditut',
        zu: 'jaten dituzu',
        hura: 'jaten ditu',
        gu: 'jaten ditugu',
        zuek: 'jaten dituzue',
        haiek: 'jaten dituzte',
      },
      pastPlural: {
        ni: 'jan nituen',
        zu: 'jan zenituen',
        hura: 'jan zituen',
        gu: 'jan genituen',
        zuek: 'jan zenituzten',
        haiek: 'jan zituzten',
      },
      futurePlural: {
        ni: 'jango ditut',
        zu: 'jango dituzu',
        hura: 'jango ditu',
        gu: 'jango ditugu',
        zuek: 'jango dituzue',
        haiek: 'jango dituzte',
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
      // #284: plural-object (`NOR` = `haiek`) forms — same participle, `dit-`
      // stem auxiliary, per CONJUGATIONS.md §3.
      presentPlural: {
        ni: 'edaten ditut',
        zu: 'edaten dituzu',
        hura: 'edaten ditu',
        gu: 'edaten ditugu',
        zuek: 'edaten dituzue',
        haiek: 'edaten dituzte',
      },
      pastPlural: {
        ni: 'edan nituen',
        zu: 'edan zenituen',
        hura: 'edan zituen',
        gu: 'edan genituen',
        zuek: 'edan zenituzten',
        haiek: 'edan zituzten',
      },
      futurePlural: {
        ni: 'edango ditut',
        zu: 'edango dituzu',
        hura: 'edango ditu',
        gu: 'edango ditugu',
        zuek: 'edango dituzue',
        haiek: 'edango dituzte',
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
    dativeOvergeneration: true,
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
      // #284: plural-object (`NOR` = `haiek`) forms — same participle, `dit-`
      // stem auxiliary, per CONJUGATIONS.md §3.
      presentPlural: {
        ni: 'erosten ditut',
        zu: 'erosten dituzu',
        hura: 'erosten ditu',
        gu: 'erosten ditugu',
        zuek: 'erosten dituzue',
        haiek: 'erosten dituzte',
      },
      pastPlural: {
        ni: 'erosi nituen',
        zu: 'erosi zenituen',
        hura: 'erosi zituen',
        gu: 'erosi genituen',
        zuek: 'erosi zenituzten',
        haiek: 'erosi zituzten',
      },
      futurePlural: {
        ni: 'erosiko ditut',
        zu: 'erosiko dituzu',
        hura: 'erosiko ditu',
        gu: 'erosiko ditugu',
        zuek: 'erosiko dituzue',
        haiek: 'erosiko dituzte',
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
          { text: 'Zuk sagar bat ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
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
          { text: 'Guk txartel bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek opari bat ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Zuek liburu bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
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
          { text: 'Zuk atzo sagar bat ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar', 'jan'] },
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
          { text: 'Guk herenegun txartel bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
        ],
        zuek: [
          { text: 'Zuek atzo opari bat ___?', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
          { text: 'Zuek herenegun liburu bat ___.', validFor: ['ukan', 'nahi', 'eduki', 'ikusi', 'behar'] },
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
        zuek: '___ liburuak erosten dituzue.',
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
    dativeOvergeneration: true,
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
      // #284: plural-object (`NOR` = `haiek`) forms — same participle, `dit-`
      // stem auxiliary, per CONJUGATIONS.md §3.
      presentPlural: {
        ni: 'hartzen ditut',
        zu: 'hartzen dituzu',
        hura: 'hartzen ditu',
        gu: 'hartzen ditugu',
        zuek: 'hartzen dituzue',
        haiek: 'hartzen dituzte',
      },
      pastPlural: {
        ni: 'hartu nituen',
        zu: 'hartu zenituen',
        hura: 'hartu zituen',
        gu: 'hartu genituen',
        zuek: 'hartu zenituzten',
        haiek: 'hartu zituzten',
      },
      futurePlural: {
        ni: 'hartuko ditut',
        zu: 'hartuko dituzu',
        hura: 'hartuko ditu',
        gu: 'hartuko ditugu',
        zuek: 'hartuko dituzue',
        haiek: 'hartuko dituzte',
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
          { text: 'Zuek aterkia ___.', validFor: ['behar'] },
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
      // #284: plural-object (`NOR` = `haiek`) forms — same participle, `dit-`
      // stem auxiliary, per CONJUGATIONS.md §3.
      presentPlural: {
        ni: 'ikusten ditut',
        zu: 'ikusten dituzu',
        hura: 'ikusten ditu',
        gu: 'ikusten ditugu',
        zuek: 'ikusten dituzue',
        haiek: 'ikusten dituzte',
      },
      pastPlural: {
        ni: 'ikusi nituen',
        zu: 'ikusi zenituen',
        hura: 'ikusi zituen',
        gu: 'ikusi genituen',
        zuek: 'ikusi zenituzten',
        haiek: 'ikusi zituzten',
      },
      futurePlural: {
        ni: 'ikusiko ditut',
        zu: 'ikusiko dituzu',
        hura: 'ikusiko ditu',
        gu: 'ikusiko ditugu',
        zuek: 'ikusiko dituzue',
        haiek: 'ikusiko dituzte',
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
      // #281/Unit 11 — present perfect: `ikusi`'s participle (`ikusi`) +
      // `ukan`'s present auxiliary, same shape as `present`'s table but
      // without the imperfective `-ten` marker — `ikusi dut` ("I have seen
      // it"), per CONJUGATIONS.md §11/§3.
      presentPerfect: {
        ni: 'ikusi dut',
        zu: 'ikusi duzu',
        hura: 'ikusi du',
        gu: 'ikusi dugu',
        zuek: 'ikusi duzue',
        haiek: 'ikusi dute',
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
          { text: 'Irakasleak ikaslea ___.', validFor: ['ukan', 'nahi'] },
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
          { text: 'Irakasleak lehengo egunean ikaslea ___.', validFor: ['ukan', 'nahi'] },
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
      // #281/Unit 11 — present perfect, the `gaur` recency counterpart to
      // `past` above (same nouns/`validFor`, present perfect aux instead of
      // simple past).
      presentPerfect: {
        ni: [{ text: 'Nik gaur filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] }],
        zu: [{ text: 'Zuk gaur hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] }],
        hura: [{ text: 'Anek gaur filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] }],
        gu: [{ text: 'Guk gaur filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] }],
        zuek: [{ text: 'Zuek gaur hori ___?', validFor: ['ukan', 'eduki', 'jakin', 'nahi', 'erosi'] }],
        haiek: [{ text: 'Haiek gaur filma ___.', validFor: ['ukan', 'eduki', 'nahi', 'erosi', 'behar'] }],
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
      // #281/Unit 11 — present perfect.
      presentPerfect: {
        ni: '___ gaur filma ikusi dut.',
        zu: '___ gaur hori ikusi duzu?',
        hura: '___ gaur itsasoa ikusi du.',
        gu: '___ gaur itsasoa ikusi dugu.',
        zuek: '___ gaur mendia ikusi duzue?',
        haiek: '___ gaur filma ikusi dute.',
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
      // #284: plural-object forms — unlike the periphrastic verbs above,
      // `eduki` is its own synthetic stem (`dauka-`, not `ukan`'s `du-`), so
      // its plural-object alternant is the `-zk-`-infixed `dauzka-` stem
      // rather than a `dit-` swap, per CONJUGATIONS.md §7's `eduki` table
      // ("(sg./pl. obj.)" column). Future still rides `ukan`'s own
      // `futurePlural` suffixes, same as the singular future above rides its
      // `present` suffixes.
      presentPlural: { ni: 'dauzkat', zu: 'dauzkazu', hura: 'dauzka', gu: 'dauzkagu', zuek: 'dauzkazue', haiek: 'dauzkate' },
      pastPlural: {
        ni: 'neuzkan',
        zu: 'zeneuzkan',
        hura: 'zeuzkan',
        gu: 'geneuzkan',
        zuek: 'zeneuzkaten',
        haiek: 'zeuzkaten',
      },
      futurePlural: {
        ni: 'edukiko ditut',
        zu: 'edukiko dituzu',
        hura: 'edukiko ditu',
        gu: 'edukiko ditugu',
        zuek: 'edukiko dituzue',
        haiek: 'edukiko dituzte',
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
    dativeOvergeneration: true,
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
        haiek: [{ text: 'Sukaldariek txuleta handia ___ txosnatik mahaira.', validFor: ['ukan', 'eduki'] }],
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
    dativeOvergeneration: true,
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
        gu: ['Gu kalean ___.', 'Gu oinez ___.', 'Gu egun osoan aplikazioaren kodea idazten ___ gure sotorik ilunenean.'],
        zuek: ['Zuek non ___?', 'Zuek parkean ___.', 'Zuek basoan ___ sasoiko perretxikoak eta zizak biltzen.'],
        haiek: [
          'Haiek kalean ___.',
          'Mikel eta Ane oinez ___.',
          'Surflariak egun osoan Mundakako olatuetan ___.',
          'Basurdeak gauez herriko baso sakonetan ___ janari bila.',
          'Gazteak Donostiako Parte Zaharrean ___ pintxorik onenaren bila.',
        ],
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
      // #313: cultural-bank items for `imperfectivePast` (ongoing/habitual
      // "I was walking/busy doing X..."), distinct from `past`'s simple
      // "I walked" above — `docs/SAMPLE_SENTENCES.md`'s synthetic-verbs
      // bank's "Past" examples for `ibili` use this table's forms
      // (`zenbiltzaten`/`nenbilen`/`zebiltzan`/`zenbiltzan`), which #312
      // missed. Plain strings, no `validFor`, same as `ibili`'s other tables.
      imperfectivePast: {
        ni: [
          'Ni goiz osoan sukaldean ___ Tolosako babarrunak egosten.',
          'Ni goiz osoan ___ sukaldean euskal pastela labean sartu nahian.',
        ],
        zu: ['Zu atzo Aste Nagusian ___ lagun zaharrak agurtzen.'],
        zuek: ['Zuek atzo arratsaldean Donostiako Parte Zaharrean ___ pintxoak jaten.'],
        haiek: ['Basurdeak gauez herriko soroetan ___ janari bila.'],
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
    // #289: `esan`'s varying `person` axis is NORK (ergative; NORI is fixed
    // to `hura`), so the plain-drill heading needs `ukan`'s ergative
    // pronoun forms — previously missing entirely, so the heading fell back
    // to the raw person key for every `esan-past`/`esan-future` question.
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
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
    // #289: `eman`'s varying `person` axis is NORI (dative; NORK is fixed
    // to `ni`), so the plain-drill heading needs dative forms, not `ukan`'s
    // ergative ones — previously missing entirely, so the heading fell back
    // to the raw person key for every `eman-past`/`eman-future` question.
    // `ni`/`gu` stay absent (reflexive-only, no conjugated forms to label).
    pronouns: { zu: 'Zuri', hura: 'Hari', zuek: 'Zuei', haiek: 'Haiei' },
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
      // #358: real 2D NOR-NORI table (`{ [nori]: { [nor]: form } }`), the
      // NORI-NOR mirror of `ukan.presentByObject` (#346) — `nori` is the
      // existing varying axis from `present` above (outer key, untouched),
      // `nor` is the newly-introduced one (inner key), core grid only (`nor`
      // ∈ `ni`/`zu`/`gu`/`zuek`, no `hi`; reflexive diagonal absent).
      // Transcribed from `docs/CONJUGATIONS.md`'s NOR-NORI present grid
      // (§4): each `[nori]` row's auxiliary (`natzaio`/`zatzaio`/... for
      // `nori: 'hura'`, etc.) prefixed with this verb's own participle
      // (`gustatzen`), the same auxiliary family `present` above already
      // uses — e.g. `presentByNor.hura.zu === 'gustatzen zatzaio'` uses the
      // same `zatzaio` cell the past/future tables' citation column implies.
      presentByNor: {
        ni: { zu: 'gustatzen zatzait', gu: 'gustatzen gatzaizkit', zuek: 'gustatzen zatzaizkit' },
        zu: { ni: 'gustatzen natzaizu', gu: 'gustatzen gatzaizkizu', zuek: 'gustatzen zatzaizkizu' },
        hura: { ni: 'gustatzen natzaio', zu: 'gustatzen zatzaio', gu: 'gustatzen gatzaizkio', zuek: 'gustatzen zatzaizkio' },
        gu: { ni: 'gustatzen natzaigu', zu: 'gustatzen zatzaigu', zuek: 'gustatzen zatzaizkigu' },
        zuek: { ni: 'gustatzen natzaizue', zu: 'gustatzen zatzaizue', gu: 'gustatzen gatzaizkizue' },
        haiek: { ni: 'gustatzen natzaie', zu: 'gustatzen zatzaie', gu: 'gustatzen gatzaizkie', zuek: 'gustatzen zatzaizkie' },
      },
      // #358: `past`'s NOR-NORI object axis, same shape/sourcing as
      // `presentByNor` above, transcribed from `docs/CONJUGATIONS.md`'s
      // NOR-NORI past grid (§4).
      pastByNor: {
        ni: { zu: 'gustatu zintzaidan', gu: 'gustatu gintzaizkidan', zuek: 'gustatu zintzaizkidan' },
        zu: { ni: 'gustatu nintzaizun', gu: 'gustatu gintzaizkizun', zuek: 'gustatu zintzaizkizun' },
        hura: { ni: 'gustatu nintzaion', zu: 'gustatu zintzaion', gu: 'gustatu gintzaizkion', zuek: 'gustatu zintzaizkion' },
        gu: { ni: 'gustatu nintzaigun', zu: 'gustatu zintzaigun', zuek: 'gustatu zintzaizkigun' },
        zuek: { ni: 'gustatu nintzaizuen', zu: 'gustatu zintzaizuen', gu: 'gustatu gintzaizkizuen' },
        haiek: { ni: 'gustatu nintzaien', zu: 'gustatu zintzaien', gu: 'gustatu gintzaizkien', zuek: 'gustatu zintzaizkien' },
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
        // #313: "Uda honetan" makes this naturally future-oriented in the
        // bank's original text, but the blank itself carries no tense
        // marking — placed in `present.haiek` so `sentences.future`'s
        // reuse-by-reference (`docs/DECISIONS.md`) drills it for `future`
        // too, same pattern as #312's joan/etorri future-ready items.
        haiek: [
          { text: 'Haiei hau ___.', validFor: ['ahaztu'] },
          { text: 'Uda honetan, bidaiariei asko ___ Mundakako ezker olatua.', validFor: ['ahaztu'] },
        ],
      },
      // #164: plural-object counterpart of the table above ("these please
      // me", not "it pleases me") — `hau` ("this") becomes `hauek` ("these").
      // #263: same `ahaztu`-only judgment as the singular table above
      // ("Niri hauek ahaztu zaizkit" = "I forgot these").
      presentPlural: {
        ni: [
          { text: 'Niri hauek ___.', validFor: ['ahaztu'] },
          { text: 'Niri asko ___ Tolosako babarrun gorriak.', validFor: ['ahaztu'] },
        ],
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
      // #358: see `gustatu.presentByNor`/`pastByNor` above for the shape and
      // sourcing — same auxiliary family, this verb's own participle
      // (`iruditzen`/`iruditu`) prefixed instead.
      presentByNor: {
        ni: { zu: 'iruditzen zatzait', gu: 'iruditzen gatzaizkit', zuek: 'iruditzen zatzaizkit' },
        zu: { ni: 'iruditzen natzaizu', gu: 'iruditzen gatzaizkizu', zuek: 'iruditzen zatzaizkizu' },
        hura: { ni: 'iruditzen natzaio', zu: 'iruditzen zatzaio', gu: 'iruditzen gatzaizkio', zuek: 'iruditzen zatzaizkio' },
        gu: { ni: 'iruditzen natzaigu', zu: 'iruditzen zatzaigu', zuek: 'iruditzen zatzaizkigu' },
        zuek: { ni: 'iruditzen natzaizue', zu: 'iruditzen zatzaizue', gu: 'iruditzen gatzaizkizue' },
        haiek: { ni: 'iruditzen natzaie', zu: 'iruditzen zatzaie', gu: 'iruditzen gatzaizkie', zuek: 'iruditzen zatzaizkie' },
      },
      pastByNor: {
        ni: { zu: 'iruditu zintzaidan', gu: 'iruditu gintzaizkidan', zuek: 'iruditu zintzaizkidan' },
        zu: { ni: 'iruditu nintzaizun', gu: 'iruditu gintzaizkizun', zuek: 'iruditu zintzaizkizun' },
        hura: { ni: 'iruditu nintzaion', zu: 'iruditu zintzaion', gu: 'iruditu gintzaizkion', zuek: 'iruditu zintzaizkion' },
        gu: { ni: 'iruditu nintzaigun', zu: 'iruditu zintzaigun', zuek: 'iruditu zintzaizkigun' },
        zuek: { ni: 'iruditu nintzaizuen', zu: 'iruditu zintzaizuen', gu: 'iruditu gintzaizkizuen' },
        haiek: { ni: 'iruditu nintzaien', zu: 'iruditu zintzaien', gu: 'iruditu gintzaizkien', zuek: 'iruditu zintzaizkien' },
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
        // #313: same future-via-present-reuse placement as `gustatu`'s
        // analogous item above; `validFor: []` per `iruditu`'s existing
        // "needs a predicate" judgment (no sibling fits this frame either).
        haiek: [
          { text: 'Haiei ongi ___.', validFor: [] },
          { text: 'Atzerriko ikasleei asko ___ euskal kultura zaharra.', validFor: [] },
        ],
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
      // #358: see `gustatu.presentByNor`/`pastByNor` above for the shape and
      // sourcing — `ahaztu`'s present uses the bare participle (not the
      // `-tzen` habitual, same as `present` above), so both rows here prefix
      // the bare `ahaztu` participle, differing only in which auxiliary
      // tense (present vs. past) follows it.
      presentByNor: {
        ni: { zu: 'ahaztu zatzait', gu: 'ahaztu gatzaizkit', zuek: 'ahaztu zatzaizkit' },
        zu: { ni: 'ahaztu natzaizu', gu: 'ahaztu gatzaizkizu', zuek: 'ahaztu zatzaizkizu' },
        hura: { ni: 'ahaztu natzaio', zu: 'ahaztu zatzaio', gu: 'ahaztu gatzaizkio', zuek: 'ahaztu zatzaizkio' },
        gu: { ni: 'ahaztu natzaigu', zu: 'ahaztu zatzaigu', zuek: 'ahaztu zatzaizkigu' },
        zuek: { ni: 'ahaztu natzaizue', zu: 'ahaztu zatzaizue', gu: 'ahaztu gatzaizkizue' },
        haiek: { ni: 'ahaztu natzaie', zu: 'ahaztu zatzaie', gu: 'ahaztu gatzaizkie', zuek: 'ahaztu zatzaizkie' },
      },
      pastByNor: {
        ni: { zu: 'ahaztu zintzaidan', gu: 'ahaztu gintzaizkidan', zuek: 'ahaztu zintzaizkidan' },
        zu: { ni: 'ahaztu nintzaizun', gu: 'ahaztu gintzaizkizun', zuek: 'ahaztu zintzaizkizun' },
        hura: { ni: 'ahaztu nintzaion', zu: 'ahaztu zintzaion', gu: 'ahaztu gintzaizkion', zuek: 'ahaztu zintzaizkion' },
        gu: { ni: 'ahaztu nintzaigun', zu: 'ahaztu zintzaigun', zuek: 'ahaztu zintzaizkigun' },
        zuek: { ni: 'ahaztu nintzaizuen', zu: 'ahaztu zintzaizuen', gu: 'ahaztu gintzaizkizuen' },
        haiek: { ni: 'ahaztu nintzaien', zu: 'ahaztu zintzaien', gu: 'ahaztu gintzaizkien', zuek: 'ahaztu zintzaizkien' },
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
      // #312: cultural-bank pastPlural item — "etxeko giltzak" (the house
      // keys) is a plural object, so it drives `pastPlural` (`zitzaizkizun`)
      // rather than `past`'s singular `zitzaizun`.
      pastPlural: {
        zu: [{ text: 'Zuri ___ etxeko giltzak San Fermin jaietan.', validFor: ['gustatu'] }],
      },
    },
  },
  // #319: high-frequency fodder tier (split from #304/#318). Plain `nor-nork`/
  // `nor` regular verbs feeding the pool lessons #318 designated — no new
  // grammar, so no dedicated single-verb lesson per the pattern-first rule
  // (#309). Sourcing (participle shape, `-tzen`/`-ten` choice, `-ko`/`-go`
  // future) logged in `docs/LANGUAGE_DECISIONS.md`.
  {
    id: 'egin',
    verb: 'egin',
    meaning: { en: 'to do / to make', es: 'hacer', eu: 'egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'egiten dut',
        zu: 'egiten duzu',
        hura: 'egiten du',
        gu: 'egiten dugu',
        zuek: 'egiten duzue',
        haiek: 'egiten dute',
      },
      past: {
        ni: 'egin nuen',
        zu: 'egin zenuen',
        hura: 'egin zuen',
        gu: 'egin genuen',
        zuek: 'egin zenuten',
        haiek: 'egin zuten',
      },
      future: {
        ni: 'egingo dut',
        zu: 'egingo duzu',
        hura: 'egingo du',
        gu: 'egingo dugu',
        zuek: 'egingo duzue',
        haiek: 'egingo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik domekan talo freskoak ___ etxeko sukaldean.', validFor: [] },
        zu: { text: 'Zuk bertso saio bat ___ herriko festetan?', validFor: [] },
        hura: { text: 'Hark intxaur-saltsa goxoa ___ Eguberrietan.', validFor: [] },
        gu: { text: 'Guk erromeria handi bat ___ udan.', validFor: [] },
        zuek: { text: 'Zuek kalejira polita ___ jaien hasieran?', validFor: [] },
        haiek: { text: 'Haiek Aste Nagusiko kartel ofiziala ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo talo freskoak ___ etxeko sukaldean.', validFor: [] },
        zu: { text: 'Zuk herenegun bertso saio bat ___ herriko festetan?', validFor: [] },
        hura: { text: 'Hark lehengo egunean intxaur-saltsa goxoa ___ Eguberrietan.', validFor: [] },
        gu: { text: 'Guk iaz erromeria handi bat ___ udan.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun kalejira polita ___ jaien hasieran?', validFor: [] },
        haiek: { text: 'Haiek joan den astean Aste Nagusiko kartel ofiziala ___.', validFor: [] },
      },
    },
  },
  {
    id: 'irakurri',
    verb: 'irakurri',
    meaning: { en: 'to read', es: 'leer', eu: 'irakurri' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'irakurtzen dut',
        zu: 'irakurtzen duzu',
        hura: 'irakurtzen du',
        gu: 'irakurtzen dugu',
        zuek: 'irakurtzen duzue',
        haiek: 'irakurtzen dute',
      },
      past: {
        ni: 'irakurri nuen',
        zu: 'irakurri zenuen',
        hura: 'irakurri zuen',
        gu: 'irakurri genuen',
        zuek: 'irakurri zenuten',
        haiek: 'irakurri zuten',
      },
      future: {
        ni: 'irakurriko dut',
        zu: 'irakurriko duzu',
        hura: 'irakurriko du',
        gu: 'irakurriko dugu',
        zuek: 'irakurriko duzue',
        haiek: 'irakurriko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik Bernardo Atxagaren eleberri bat ___ gauero.', validFor: [] },
        zu: { text: 'Zuk euskarazko egunkaria ___ goizero?', validFor: [] },
        hura: { text: 'Hark bertso liburu zahar bat ___ liburutegian.', validFor: [] },
        gu: { text: 'Guk Kirmen Uriberen olerkiak ___ ikastaroan.', validFor: [] },
        zuek: { text: 'Zuek Berria egunkaria ___ kafetegian?', validFor: [] },
        haiek: { text: 'Haiek herriko aldizkari txikia ___ plazan.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo Bernardo Atxagaren eleberri bat ___ gauean.', validFor: [] },
        zu: { text: 'Zuk herenegun euskarazko egunkaria ___ goizean?', validFor: [] },
        hura: { text: 'Hark lehengo egunean bertso liburu zahar bat ___ liburutegian.', validFor: [] },
        gu: { text: 'Guk iaz Kirmen Uriberen olerkiak ___ ikastaroan.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun Berria egunkaria ___ kafetegian?', validFor: [] },
        haiek: { text: 'Haiek joan den astean herriko aldizkari txikia ___ plazan.', validFor: [] },
      },
    },
  },
  {
    id: 'idatzi',
    verb: 'idatzi',
    meaning: { en: 'to write', es: 'escribir', eu: 'idatzi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'idazten dut',
        zu: 'idazten duzu',
        hura: 'idazten du',
        gu: 'idazten dugu',
        zuek: 'idazten duzue',
        haiek: 'idazten dute',
      },
      past: {
        ni: 'idatzi nuen',
        zu: 'idatzi zenuen',
        hura: 'idatzi zuen',
        gu: 'idatzi genuen',
        zuek: 'idatzi zenuten',
        haiek: 'idatzi zuten',
      },
      future: {
        ni: 'idatziko dut',
        zu: 'idatziko duzu',
        hura: 'idatziko du',
        gu: 'idatziko dugu',
        zuek: 'idatziko duzue',
        haiek: 'idatziko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik gutun bat ___ amonarentzat.', validFor: [] },
        zu: { text: 'Zuk bertso berriak ___ saiorako?', validFor: [] },
        hura: { text: 'Hark eleberri labur bat euskaraz ___.', validFor: [] },
        gu: { text: 'Guk herriko egunkarirako artikulua ___.', validFor: [] },
        zuek: { text: 'Zuek eskutitz luzea ___ lagunari?', validFor: [] },
        haiek: { text: 'Haiek kantu hitzak ___ jaietarako.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo gutun bat ___ amonarentzat.', validFor: [] },
        zu: { text: 'Zuk herenegun bertso berriak ___ saiorako?', validFor: [] },
        hura: { text: 'Hark lehengo egunean eleberri labur bat euskaraz ___.', validFor: [] },
        gu: { text: 'Guk iaz herriko egunkarirako artikulua ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun eskutitz luzea ___ lagunari?', validFor: [] },
        haiek: { text: 'Haiek joan den astean kantu hitzak ___ jaietarako.', validFor: [] },
      },
    },
  },
  {
    id: 'ikasi',
    verb: 'ikasi',
    meaning: { en: 'to learn / to study', es: 'aprender / estudiar', eu: 'ikasi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ikasten dut',
        zu: 'ikasten duzu',
        hura: 'ikasten du',
        gu: 'ikasten dugu',
        zuek: 'ikasten duzue',
        haiek: 'ikasten dute',
      },
      past: {
        ni: 'ikasi nuen',
        zu: 'ikasi zenuen',
        hura: 'ikasi zuen',
        gu: 'ikasi genuen',
        zuek: 'ikasi zenuten',
        haiek: 'ikasi zuten',
      },
      future: {
        ni: 'ikasiko dut',
        zu: 'ikasiko duzu',
        hura: 'ikasiko du',
        gu: 'ikasiko dugu',
        zuek: 'ikasiko duzue',
        haiek: 'ikasiko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik euskara ___ helduen ikastaroan.', validFor: [] },
        zu: { text: 'Zuk txistua jotzen ___ udalekuan?', validFor: [] },
        hura: { text: 'Hark dantza tradizionalak ___ taldean.', validFor: [] },
        gu: { text: 'Guk Euskal Herriko historia ___ unibertsitatean.', validFor: [] },
        zuek: { text: 'Zuek trikitixa jotzen ___ eskolan?', validFor: [] },
        haiek: { text: 'Haiek arrantza teknikak ___ kostaldean.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik iaz euskara ___ helduen ikastaroan.', validFor: [] },
        zu: { text: 'Zuk herenegun txistua jotzen ___ udalekuan?', validFor: [] },
        hura: { text: 'Hark lehengo egunean dantza tradizionalak ___ taldean.', validFor: [] },
        gu: { text: 'Guk aurten Euskal Herriko historia ___ unibertsitatean.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun trikitixa jotzen ___ eskolan?', validFor: [] },
        haiek: { text: 'Haiek joan den astean arrantza teknikak ___ kostaldean.', validFor: [] },
      },
    },
  },
  {
    id: 'entzun',
    verb: 'entzun',
    meaning: { en: 'to hear / to listen', es: 'oír / escuchar', eu: 'entzun' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'entzuten dut',
        zu: 'entzuten duzu',
        hura: 'entzuten du',
        gu: 'entzuten dugu',
        zuek: 'entzuten duzue',
        haiek: 'entzuten dute',
      },
      past: {
        ni: 'entzun nuen',
        zu: 'entzun zenuen',
        hura: 'entzun zuen',
        gu: 'entzun genuen',
        zuek: 'entzun zenuten',
        haiek: 'entzun zuten',
      },
      future: {
        ni: 'entzungo dut',
        zu: 'entzungo duzu',
        hura: 'entzungo du',
        gu: 'entzungo dugu',
        zuek: 'entzungo duzue',
        haiek: 'entzungo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik txalaparta ___ plazan.', validFor: [] },
        zu: { text: 'Zuk irrati euskalduna ___ goizero?', validFor: [] },
        hura: { text: 'Hark bertsolarien saioa ___ jaialdian.', validFor: [] },
        gu: { text: 'Guk Mikel Laboaren kantuak ___ kotxean.', validFor: [] },
        zuek: { text: 'Zuek herriko danborrada ___ goizean?', validFor: [] },
        haiek: { text: 'Haiek alkatearen hitzaldia ___ udaletxean.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo txalaparta ___ plazan.', validFor: [] },
        zu: { text: 'Zuk herenegun irrati euskalduna ___ goizean?', validFor: [] },
        hura: { text: 'Hark lehengo egunean bertsolarien saioa ___ jaialdian.', validFor: [] },
        gu: { text: 'Guk iaz Mikel Laboaren kantuak ___ kotxean.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun herriko danborrada ___ goizean?', validFor: [] },
        haiek: { text: 'Haiek joan den astean alkatearen hitzaldia ___ udaletxean.', validFor: [] },
      },
    },
  },
  {
    id: 'utzi',
    verb: 'utzi',
    meaning: { en: 'to leave / to let', es: 'dejar', eu: 'utzi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'uzten dut',
        zu: 'uzten duzu',
        hura: 'uzten du',
        gu: 'uzten dugu',
        zuek: 'uzten duzue',
        haiek: 'uzten dute',
      },
      past: {
        ni: 'utzi nuen',
        zu: 'utzi zenuen',
        hura: 'utzi zuen',
        gu: 'utzi genuen',
        zuek: 'utzi zenuten',
        haiek: 'utzi zuten',
      },
      future: {
        ni: 'utziko dut',
        zu: 'utziko duzu',
        hura: 'utziko du',
        gu: 'utziko dugu',
        zuek: 'utziko duzue',
        haiek: 'utziko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik bizikleta plaza ondoan ___.', validFor: [] },
        zu: { text: 'Zuk giltzak leihopean ___?', validFor: [] },
        hura: { text: 'Hark abarketak atarian ___.', validFor: [] },
        gu: { text: 'Guk otarrak sagardotegiko atean ___.', validFor: [] },
        zuek: { text: 'Zuek poltsak autobus geltokian ___?', validFor: [] },
        haiek: { text: 'Haiek txalupa portuan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo bizikleta plaza ondoan ___.', validFor: [] },
        zu: { text: 'Zuk herenegun giltzak leihopean ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean abarketak atarian ___.', validFor: [] },
        gu: { text: 'Guk iaz otarrak sagardotegiko atean ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun poltsak autobus geltokian ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean txalupa portuan ___.', validFor: [] },
      },
    },
  },
  {
    id: 'aurkitu',
    verb: 'aurkitu',
    meaning: { en: 'to find', es: 'encontrar', eu: 'aurkitu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'aurkitzen dut',
        zu: 'aurkitzen duzu',
        hura: 'aurkitzen du',
        gu: 'aurkitzen dugu',
        zuek: 'aurkitzen duzue',
        haiek: 'aurkitzen dute',
      },
      past: {
        ni: 'aurkitu nuen',
        zu: 'aurkitu zenuen',
        hura: 'aurkitu zuen',
        gu: 'aurkitu genuen',
        zuek: 'aurkitu zenuten',
        haiek: 'aurkitu zuten',
      },
      future: {
        ni: 'aurkituko dut',
        zu: 'aurkituko duzu',
        hura: 'aurkituko du',
        gu: 'aurkituko dugu',
        zuek: 'aurkituko duzue',
        haiek: 'aurkituko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik hondartzan kontxa polit bat ___.', validFor: [] },
        zu: { text: 'Zuk Donostiako kale zaharrean dendatxo bat ___?', validFor: [] },
        hura: { text: 'Hark basoan onddo handi bat ___.', validFor: [] },
        gu: { text: 'Guk Gernikako azokan opari egokia ___.', validFor: [] },
        zuek: { text: 'Zuek mendian bide seinale zahar bat ___?', validFor: [] },
        haiek: { text: 'Haiek itsasoan ontzi hondoratu bat ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo hondartzan kontxa polit bat ___.', validFor: [] },
        zu: { text: 'Zuk herenegun Donostiako kale zaharrean dendatxo bat ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean basoan onddo handi bat ___.', validFor: [] },
        gu: { text: 'Guk iaz Gernikako azokan opari egokia ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun mendian bide seinale zahar bat ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean itsasoan ontzi hondoratu bat ___.', validFor: [] },
      },
    },
  },
  {
    id: 'bilatu',
    verb: 'bilatu',
    meaning: { en: 'to search for / to look for', es: 'buscar', eu: 'bilatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'bilatzen dut',
        zu: 'bilatzen duzu',
        hura: 'bilatzen du',
        gu: 'bilatzen dugu',
        zuek: 'bilatzen duzue',
        haiek: 'bilatzen dute',
      },
      past: {
        ni: 'bilatu nuen',
        zu: 'bilatu zenuen',
        hura: 'bilatu zuen',
        gu: 'bilatu genuen',
        zuek: 'bilatu zenuten',
        haiek: 'bilatu zuten',
      },
      future: {
        ni: 'bilatuko dut',
        zu: 'bilatuko duzu',
        hura: 'bilatuko du',
        gu: 'bilatuko dugu',
        zuek: 'bilatuko duzue',
        haiek: 'bilatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik liburutegian erreferentzia zahar bat ___.', validFor: [] },
        zu: { text: 'Zuk Gasteizko kale-mapan helbide bat ___?', validFor: [] },
        hura: { text: 'Hark basoan galdutako ardia ___.', validFor: [] },
        gu: { text: 'Guk azokan opor egokiak ___.', validFor: [] },
        zuek: { text: 'Zuek interneten errezeta tradizionala ___?', validFor: [] },
        haiek: { text: 'Haiek herrian etxe alokagarria ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo liburutegian erreferentzia zahar bat ___.', validFor: [] },
        zu: { text: 'Zuk herenegun Gasteizko kale-mapan helbide bat ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean basoan galdutako ardia ___.', validFor: [] },
        gu: { text: 'Guk iaz azokan opor egokiak ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun interneten errezeta tradizionala ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean herrian etxe alokagarria ___.', validFor: [] },
      },
    },
  },
  {
    id: 'galdu',
    verb: 'galdu',
    meaning: { en: 'to lose', es: 'perder', eu: 'galdu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'galtzen dut',
        zu: 'galtzen duzu',
        hura: 'galtzen du',
        gu: 'galtzen dugu',
        zuek: 'galtzen duzue',
        haiek: 'galtzen dute',
      },
      past: {
        ni: 'galdu nuen',
        zu: 'galdu zenuen',
        hura: 'galdu zuen',
        gu: 'galdu genuen',
        zuek: 'galdu zenuten',
        haiek: 'galdu zuten',
      },
      future: {
        ni: 'galduko dut',
        zu: 'galduko duzu',
        hura: 'galduko du',
        gu: 'galduko dugu',
        zuek: 'galduko duzue',
        haiek: 'galduko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik txapelketako partida ___.', validFor: [] },
        zu: { text: 'Zuk autobusa ___ atzerapenagatik?', validFor: [] },
        hura: { text: 'Hark txapela jokoan ___.', validFor: [] },
        gu: { text: 'Guk pilota txapelketa ___ azken jardunaldian.', validFor: [] },
        zuek: { text: 'Zuek bidea mendian ___?', validFor: [] },
        haiek: { text: 'Haiek finala azken minutuan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo txapelketako partida ___.', validFor: [] },
        zu: { text: 'Zuk herenegun autobusa ___ atzerapenagatik?', validFor: [] },
        hura: { text: 'Hark lehengo egunean txapela jokoan ___.', validFor: [] },
        gu: { text: 'Guk iaz pilota txapelketa ___ azken jardunaldian.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun bidea mendian ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean finala azken minutuan ___.', validFor: [] },
      },
    },
  },
  {
    id: 'jaso',
    verb: 'jaso',
    meaning: { en: 'to receive / to pick up', es: 'recibir / recoger', eu: 'jaso' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'jasotzen dut',
        zu: 'jasotzen duzu',
        hura: 'jasotzen du',
        gu: 'jasotzen dugu',
        zuek: 'jasotzen duzue',
        haiek: 'jasotzen dute',
      },
      past: {
        ni: 'jaso nuen',
        zu: 'jaso zenuen',
        hura: 'jaso zuen',
        gu: 'jaso genuen',
        zuek: 'jaso zenuten',
        haiek: 'jaso zuten',
      },
      future: {
        ni: 'jasoko dut',
        zu: 'jasoko duzu',
        hura: 'jasoko du',
        gu: 'jasoko dugu',
        zuek: 'jasoko duzue',
        haiek: 'jasoko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik gutun bat Ameriketatik ___.', validFor: [] },
        zu: { text: 'Zuk sari bat txapelketan ___?', validFor: [] },
        hura: { text: 'Hark ohorezko domina ___ kontzejuan.', validFor: [] },
        gu: { text: 'Guk laguntza ekonomikoa udaletik ___.', validFor: [] },
        zuek: { text: 'Zuek opari bat zorionetan ___?', validFor: [] },
        haiek: { text: 'Haiek diru-laguntza berria elkartean ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo gutun bat Ameriketatik ___.', validFor: [] },
        zu: { text: 'Zuk herenegun sari bat txapelketan ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean ohorezko domina ___ kontzejuan.', validFor: [] },
        gu: { text: 'Guk iaz laguntza ekonomikoa udaletik ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun opari bat zorionetan ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean diru-laguntza berria elkartean ___.', validFor: [] },
      },
    },
  },
  {
    id: 'saldu',
    verb: 'saldu',
    meaning: { en: 'to sell', es: 'vender', eu: 'saldu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'saltzen dut',
        zu: 'saltzen duzu',
        hura: 'saltzen du',
        gu: 'saltzen dugu',
        zuek: 'saltzen duzue',
        haiek: 'saltzen dute',
      },
      past: {
        ni: 'saldu nuen',
        zu: 'saldu zenuen',
        hura: 'saldu zuen',
        gu: 'saldu genuen',
        zuek: 'saldu zenuten',
        haiek: 'saldu zuten',
      },
      future: {
        ni: 'salduko dut',
        zu: 'salduko duzu',
        hura: 'salduko du',
        gu: 'salduko dugu',
        zuek: 'salduko duzue',
        haiek: 'salduko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik etxeko sagardoa azokan ___.', validFor: [] },
        zu: { text: 'Zuk arrantzatutako legatza portuan ___?', validFor: [] },
        hura: { text: 'Hark gaztandegiko Idiazabal gazta ___.', validFor: [] },
        gu: { text: 'Guk baserriko barazkiak plazan ___.', validFor: [] },
        zuek: { text: 'Zuek artisautza lanak jaietan ___?', validFor: [] },
        haiek: { text: 'Haiek txondorreko ikatza herrian ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo etxeko sagardoa azokan ___.', validFor: [] },
        zu: { text: 'Zuk herenegun arrantzatutako legatza portuan ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean gaztandegiko Idiazabal gazta ___.', validFor: [] },
        gu: { text: 'Guk iaz baserriko barazkiak plazan ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun artisautza lanak jaietan ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean txondorreko ikatza herrian ___.', validFor: [] },
      },
    },
  },
  {
    id: 'itxaron',
    verb: 'itxaron',
    meaning: { en: 'to wait (for something)', es: 'esperar (algo)', eu: 'itxaron' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'itxaroten dut',
        zu: 'itxaroten duzu',
        hura: 'itxaroten du',
        gu: 'itxaroten dugu',
        zuek: 'itxaroten duzue',
        haiek: 'itxaroten dute',
      },
      past: {
        ni: 'itxaron nuen',
        zu: 'itxaron zenuen',
        hura: 'itxaron zuen',
        gu: 'itxaron genuen',
        zuek: 'itxaron zenuten',
        haiek: 'itxaron zuten',
      },
      future: {
        ni: 'itxarongo dut',
        zu: 'itxarongo duzu',
        hura: 'itxarongo du',
        gu: 'itxarongo dugu',
        zuek: 'itxarongo duzue',
        haiek: 'itxarongo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik tranbia geltokian ___.', validFor: [] },
        zu: { text: 'Zuk txapelketako emaitza urduri ___?', validFor: [] },
        hura: { text: 'Hark abiatzeko deia kaian ___.', validFor: [] },
        gu: { text: 'Guk autobusa euripean ___.', validFor: [] },
        zuek: { text: 'Zuek txanda jatetxean ___?', validFor: [] },
        haiek: { text: 'Haiek mareak igotzea kostan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo tranbia geltokian ___.', validFor: [] },
        zu: { text: 'Zuk herenegun txapelketako emaitza urduri ___?', validFor: [] },
        hura: { text: 'Hark lehengo egunean abiatzeko deia kaian ___.', validFor: [] },
        gu: { text: 'Guk iaz autobusa euripean ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun txanda jatetxean ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean mareak igotzea kostan ___.', validFor: [] },
      },
    },
  },
  {
    // #334 — itxaron's dative reading ("wait *for* someone", recipient as
    // NORI, no overt accusative object) per docs/LANGUAGE_DECISIONS.md's
    // #334 entry. Same recipient:'hura'/diot-family shape as the Unit 30
    // covert-dative family (lagundu/ekin/...), since itxaron-dative also has
    // no overt object to hint NORI — wired in as that pool's 10th carrier
    // rather than a separate lesson.
    id: 'itxaron-dative',
    verb: 'itxaron',
    meaning: { en: 'to wait for (someone)', es: 'esperar (a alguien)', eu: 'itxaron (norbaiti)' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'itxaroten diot',
        zu: 'itxaroten diozu',
        hura: 'itxaroten dio',
        gu: 'itxaroten diogu',
        zuek: 'itxaroten diozue',
        haiek: 'itxaroten diote',
      },
      past: {
        ni: 'itxaron nion',
        zu: 'itxaron zenion',
        hura: 'itxaron zion',
        gu: 'itxaron genion',
        zuek: 'itxaron zenioten',
        haiek: 'itxaron zioten',
      },
      future: {
        ni: 'itxarongo diot',
        zu: 'itxarongo diozu',
        hura: 'itxarongo dio',
        gu: 'itxarongo diogu',
        zuek: 'itxarongo diozue',
        haiek: 'itxarongo diote',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    // #334 — saldu's dative reading ("sell *to* someone"), ditransitive with
    // an overt accusative object plus a dative recipient — the esan/eman
    // shape, not the covert-dative shape (see #334's LANGUAGE_DECISIONS
    // entry for why this and the next four verbs get a new pool instead of
    // joining Unit 30's dative-verb-* family).
    id: 'saldu-dative',
    verb: 'saldu',
    meaning: { en: 'to sell (to someone)', es: 'vender (a alguien)', eu: 'saldu (norbaiti)' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'saltzen diot',
        zu: 'saltzen diozu',
        hura: 'saltzen dio',
        gu: 'saltzen diogu',
        zuek: 'saltzen diozue',
        haiek: 'saltzen diote',
      },
      past: {
        ni: 'saldu nion',
        zu: 'saldu zenion',
        hura: 'saldu zion',
        gu: 'saldu genion',
        zuek: 'saldu zenioten',
        haiek: 'saldu zioten',
      },
      future: {
        ni: 'salduko diot',
        zu: 'salduko diozu',
        hura: 'salduko dio',
        gu: 'salduko diogu',
        zuek: 'salduko diozue',
        haiek: 'salduko diote',
      },
    },
    // #312: cultural-bank past item — fresh hake sold to a restaurant; no
    // sibling `-dative` verb plausibly substitutes into this exact combo.
    sentences: {
      past: {
        haiek: [{ text: 'Arrantzaleek jatetxeari goizeko legatz freskoa ___.', validFor: [] }],
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    // #334 — utzi's dative reading ("leave/lend *to* someone"), same
    // esan/eman ditransitive shape as saldu-dative above.
    id: 'utzi-dative',
    verb: 'utzi',
    meaning: { en: 'to leave / lend (to someone)', es: 'dejar (a alguien)', eu: 'utzi (norbaiti)' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'uzten diot',
        zu: 'uzten diozu',
        hura: 'uzten dio',
        gu: 'uzten diogu',
        zuek: 'uzten diozue',
        haiek: 'uzten diote',
      },
      past: {
        ni: 'utzi nion',
        zu: 'utzi zenion',
        hura: 'utzi zion',
        gu: 'utzi genion',
        zuek: 'utzi zenioten',
        haiek: 'utzi zioten',
      },
      future: {
        ni: 'utziko diot',
        zu: 'utziko diozu',
        hura: 'utziko dio',
        gu: 'utziko diogu',
        zuek: 'utziko diozue',
        haiek: 'utziko diote',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    // #334 — adierazi's dative reading ("express/indicate *to* someone").
    id: 'adierazi-dative',
    verb: 'adierazi',
    meaning: {
      en: 'to express / indicate (to someone)',
      es: 'expresar / indicar (a alguien)',
      eu: 'adierazi (norbaiti)',
    },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'adierazten diot',
        zu: 'adierazten diozu',
        hura: 'adierazten dio',
        gu: 'adierazten diogu',
        zuek: 'adierazten diozue',
        haiek: 'adierazten diote',
      },
      past: {
        ni: 'adierazi nion',
        zu: 'adierazi zenion',
        hura: 'adierazi zion',
        gu: 'adierazi genion',
        zuek: 'adierazi zenioten',
        haiek: 'adierazi zioten',
      },
      future: {
        ni: 'adieraziko diot',
        zu: 'adieraziko diozu',
        hura: 'adieraziko dio',
        gu: 'adieraziko diogu',
        zuek: 'adieraziko diozue',
        haiek: 'adieraziko diote',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    // #334 — eskatu's dative reading ("ask/request something *of* someone").
    id: 'eskatu-dative',
    verb: 'eskatu',
    meaning: { en: 'to ask / request (of someone)', es: 'pedir (a alguien)', eu: 'eskatu (norbaiti)' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'eskatzen diot',
        zu: 'eskatzen diozu',
        hura: 'eskatzen dio',
        gu: 'eskatzen diogu',
        zuek: 'eskatzen diozue',
        haiek: 'eskatzen diote',
      },
      past: {
        ni: 'eskatu nion',
        zu: 'eskatu zenion',
        hura: 'eskatu zion',
        gu: 'eskatu genion',
        zuek: 'eskatu zenioten',
        haiek: 'eskatu zioten',
      },
      future: {
        ni: 'eskatuko diot',
        zu: 'eskatuko diozu',
        hura: 'eskatuko dio',
        gu: 'eskatuko diogu',
        zuek: 'eskatuko diozue',
        haiek: 'eskatuko diote',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    // #334 — galdetu's dative reading ("ask (a question) *of* someone").
    id: 'galdetu-dative',
    verb: 'galdetu',
    meaning: { en: 'to ask (someone a question)', es: 'preguntar (a alguien)', eu: 'galdetu (norbaiti)' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'galdetzen diot',
        zu: 'galdetzen diozu',
        hura: 'galdetzen dio',
        gu: 'galdetzen diogu',
        zuek: 'galdetzen diozue',
        haiek: 'galdetzen diote',
      },
      past: {
        ni: 'galdetu nion',
        zu: 'galdetu zenion',
        hura: 'galdetu zion',
        gu: 'galdetu genion',
        zuek: 'galdetu zenioten',
        haiek: 'galdetu zioten',
      },
      future: {
        ni: 'galdetuko diot',
        zu: 'galdetuko diozu',
        hura: 'galdetuko dio',
        gu: 'galdetuko diogu',
        zuek: 'galdetuko diozue',
        haiek: 'galdetuko diote',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'sartu',
    verb: 'sartu',
    meaning: { en: 'to enter / to go in', es: 'entrar', eu: 'sartu' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'sartzen naiz',
        zu: 'sartzen zara',
        hura: 'sartzen da',
        gu: 'sartzen gara',
        zuek: 'sartzen zarete',
        haiek: 'sartzen dira',
      },
      past: {
        ni: 'sartu nintzen',
        zu: 'sartu zinen',
        hura: 'sartu zen',
        gu: 'sartu ginen',
        zuek: 'sartu zineten',
        haiek: 'sartu ziren',
      },
      future: {
        ni: 'sartuko naiz',
        zu: 'sartuko zara',
        hura: 'sartuko da',
        gu: 'sartuko gara',
        zuek: 'sartuko zarete',
        haiek: 'sartuko dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni Gorbeiako babes-etxean ___ ekaitzetik.', validFor: [] },
        zu: { text: 'Zu Tolosako tabernan ___ pintxoetara?', validFor: [] },
        hura: { text: 'Hura San Telmo museoan ___ erakusketa ikustera.', validFor: [] },
        gu: { text: 'Gu Aste Nagusiko jaitsierara ___.', validFor: [] },
        zuek: { text: 'Zuek sagardotegira ___ talo jatera?', validFor: [] },
        haiek: { text: 'Haiek Gernikako frontoira ___ partida ikustera.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni atzo Gorbeiako babes-etxean ___ ekaitzetik.', validFor: [] },
        zu: { text: 'Zu herenegun Tolosako tabernan ___ pintxoetara?', validFor: [] },
        hura: { text: 'Hura lehengo egunean San Telmo museoan ___ erakusketa ikustera.', validFor: [] },
        gu: { text: 'Gu iaz Aste Nagusiko jaitsierara ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun sagardotegira ___ talo jatera?', validFor: [] },
        haiek: { text: 'Haiek joan den astean Gernikako frontoira ___ partida ikustera.', validFor: [] },
      },
    },
  },
  {
    id: 'atera',
    verb: 'atera',
    meaning: { en: 'to go out / to exit', es: 'salir', eu: 'atera' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ateratzen naiz',
        zu: 'ateratzen zara',
        hura: 'ateratzen da',
        gu: 'ateratzen gara',
        zuek: 'ateratzen zarete',
        haiek: 'ateratzen dira',
      },
      past: {
        ni: 'atera nintzen',
        zu: 'atera zinen',
        hura: 'atera zen',
        gu: 'atera ginen',
        zuek: 'atera zineten',
        haiek: 'atera ziren',
      },
      future: {
        ni: 'aterako naiz',
        zu: 'aterako zara',
        hura: 'aterako da',
        gu: 'aterako gara',
        zuek: 'aterako zarete',
        haiek: 'aterako dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni Bilboko Casco Viejotik ___ goizeko hamarretan.', validFor: [] },
        zu: { text: 'Zu lantegitik ___ txirrindulariekin elkartzera?', validFor: [] },
        hura: { text: 'Hura kaira ___ arraina saltzera.', validFor: [] },
        gu: { text: 'Gu Donostiako Zinemalditik ___ gauerdian.', validFor: [] },
        zuek: { text: 'Zuek herriko jaitik ___ goizaldean?', validFor: [] },
        haiek: { text: 'Haiek Aste Nagusiko karpatik ___ kontzertua bukatu ondoren.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni atzo Bilboko Casco Viejotik ___ goizeko hamarretan.', validFor: [] },
        zu: { text: 'Zu herenegun lantegitik ___ txirrindulariekin elkartzera?', validFor: [] },
        hura: { text: 'Hura lehengo egunean kaira ___ arraina saltzera.', validFor: [] },
        gu: { text: 'Gu iaz Donostiako Zinemalditik ___ gauerdian.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun herriko jaitik ___ goizaldean?', validFor: [] },
        haiek: { text: 'Haiek joan den astean Aste Nagusiko karpatik ___ kontzertua bukatu ondoren.', validFor: [] },
      },
    },
  },
  {
    id: 'hasi',
    verb: 'hasi',
    meaning: { en: 'to start / to begin', es: 'empezar / comenzar', eu: 'hasi' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'hasten naiz',
        zu: 'hasten zara',
        hura: 'hasten da',
        gu: 'hasten gara',
        zuek: 'hasten zarete',
        haiek: 'hasten dira',
      },
      past: {
        ni: 'hasi nintzen',
        zu: 'hasi zinen',
        hura: 'hasi zen',
        gu: 'hasi ginen',
        zuek: 'hasi zineten',
        haiek: 'hasi ziren',
      },
      future: {
        ni: 'hasiko naiz',
        zu: 'hasiko zara',
        hura: 'hasiko da',
        gu: 'hasiko gara',
        zuek: 'hasiko zarete',
        haiek: 'hasiko dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni euskara ikastaroarekin ___ irailean.', validFor: [] },
        zu: { text: 'Zu trikitixa ikasten ___ udan?', validFor: [] },
        hura: { text: 'Hura txapelketako entrenamenduekin ___ goiz.', validFor: [] },
        gu: { text: 'Gu Gorbeiako igoerarekin ___ ilunabarrean.', validFor: [] },
        zuek: { text: 'Zuek Aste Nagusiko prestaketekin ___ udaberrian?', validFor: [] },
        haiek: { text: 'Haiek bertso saioarekin ___ berandu.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni iaz euskara ikastaroarekin ___ irailean.', validFor: [] },
        zu: { text: 'Zu herenegun trikitixa ikasten ___ udan?', validFor: [] },
        hura: { text: 'Hura lehengo egunean txapelketako entrenamenduekin ___ goiz.', validFor: [] },
        gu: { text: 'Gu aurten Gorbeiako igoerarekin ___ ilunabarrean.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun Aste Nagusiko prestaketekin ___ udaberrian?', validFor: [] },
        haiek: { text: 'Haiek joan den astean bertso saioarekin ___ berandu.', validFor: [] },
      },
    },
  },
  // `bizi izan` ("to live") — invariant participle + `izan` auxiliary, same
  // shape as `ari izan` (#244/#230): `bizi` never changes form, only the
  // auxiliary conjugates. Unlike `ari`, the participle is a regular `-i`-final
  // verb shape, so it takes the regular `-ko` future (`biziko`), not a special
  // case.
  {
    id: 'bizi-izan',
    verb: 'bizi izan',
    meaning: { en: 'to live', es: 'vivir', eu: 'bizi izan' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'bizi naiz',
        zu: 'bizi zara',
        hura: 'bizi da',
        gu: 'bizi gara',
        zuek: 'bizi zarete',
        haiek: 'bizi dira',
      },
      past: {
        ni: 'bizi nintzen',
        zu: 'bizi zinen',
        hura: 'bizi zen',
        gu: 'bizi ginen',
        zuek: 'bizi zineten',
        haiek: 'bizi ziren',
      },
      future: {
        ni: 'biziko naiz',
        zu: 'biziko zara',
        hura: 'biziko da',
        gu: 'biziko gara',
        zuek: 'biziko zarete',
        haiek: 'biziko dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni Hondarribiko portu zaharretik gertu ___.', validFor: [] },
        zu: { text: 'Zu Arratzuko baserri batean ___?', validFor: [] },
        hura: { text: 'Hura Zuberoako mendi artean ___.', validFor: [] },
        gu: { text: 'Gu Bilboko Casco Viejoan ___.', validFor: [] },
        zuek: { text: 'Zuek Lapurdiko kostaldean ___?', validFor: [] },
        haiek: { text: 'Haiek Arabako lautadan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni garai hartan Hondarribiko portu zaharretik gertu ___.', validFor: [] },
        zu: { text: 'Zu lehen Arratzuko baserri batean ___?', validFor: [] },
        hura: { text: 'Hura urte askoan Zuberoako mendi artean ___.', validFor: [] },
        gu: { text: 'Gu garai hartan Bilboko Casco Viejoan ___.', validFor: [] },
        zuek: { text: 'Zuek lehen Lapurdiko kostaldean ___?', validFor: [] },
        haiek: { text: 'Haiek urte askoan Arabako lautadan ___.', validFor: [] },
      },
    },
  },
  // #320 (fodder, mid/low tier + #304's unassigned verbs, per #318's reserved
  // pool plan — see docs/DECISIONS.md and docs/LANGUAGE_DECISIONS.md).
  {
    id: 'eskatu',
    verb: 'eskatu',
    meaning: { en: 'to ask for / to request', es: 'pedir', eu: 'eskatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'eskatzen dut',
        zu: 'eskatzen duzu',
        hura: 'eskatzen du',
        gu: 'eskatzen dugu',
        zuek: 'eskatzen duzue',
        haiek: 'eskatzen dute',
      },
      past: {
        ni: 'eskatu nuen',
        zu: 'eskatu zenuen',
        hura: 'eskatu zuen',
        gu: 'eskatu genuen',
        zuek: 'eskatu zenuten',
        haiek: 'eskatu zuten',
      },
      future: {
        ni: 'eskatuko dut',
        zu: 'eskatuko duzu',
        hura: 'eskatuko du',
        gu: 'eskatuko dugu',
        zuek: 'eskatuko duzue',
        haiek: 'eskatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik laguntza ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark diru gehiago ___.', validFor: [] },
        gu: { text: 'Guk argibideak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek baimena ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo laguntza ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean diru gehiago ___.',
        gu: 'Guk iaz argibideak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean baimena ___.',
      },
    },
  },
  {
    id: 'galdetu',
    verb: 'galdetu',
    meaning: { en: 'to ask (a question)', es: 'preguntar', eu: 'galdetu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'galdetzen dut',
        zu: 'galdetzen duzu',
        hura: 'galdetzen du',
        gu: 'galdetzen dugu',
        zuek: 'galdetzen duzue',
        haiek: 'galdetzen dute',
      },
      past: {
        ni: 'galdetu nuen',
        zu: 'galdetu zenuen',
        hura: 'galdetu zuen',
        gu: 'galdetu genuen',
        zuek: 'galdetu zenuten',
        haiek: 'galdetu zuten',
      },
      future: {
        ni: 'galdetuko dut',
        zu: 'galdetuko duzu',
        hura: 'galdetuko du',
        gu: 'galdetuko dugu',
        zuek: 'galdetuko duzue',
        haiek: 'galdetuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik galdera bat ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark ordua ___.', validFor: [] },
        gu: { text: 'Guk hainbat gauza ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek bidea ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo galdera bat ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean ordua ___.',
        gu: 'Guk iaz hainbat gauza ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean bidea ___.',
      },
    },
  },
  {
    id: 'adierazi',
    verb: 'adierazi',
    meaning: { en: 'to express / to indicate', es: 'expresar / indicar', eu: 'adierazi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'adierazten dut',
        zu: 'adierazten duzu',
        hura: 'adierazten du',
        gu: 'adierazten dugu',
        zuek: 'adierazten duzue',
        haiek: 'adierazten dute',
      },
      past: {
        ni: 'adierazi nuen',
        zu: 'adierazi zenuen',
        hura: 'adierazi zuen',
        gu: 'adierazi genuen',
        zuek: 'adierazi zenuten',
        haiek: 'adierazi zuten',
      },
      future: {
        ni: 'adieraziko dut',
        zu: 'adieraziko duzu',
        hura: 'adieraziko du',
        gu: 'adieraziko dugu',
        zuek: 'adieraziko duzue',
        haiek: 'adieraziko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik nire iritzia ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark bere asmoa ___.', validFor: [] },
        gu: { text: 'Guk gure kezka ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek beren nahia ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo nire iritzia ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean bere asmoa ___.',
        gu: 'Guk iaz gure kezka ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean beren nahia ___.',
      },
    },
  },
  {
    id: 'bukatu',
    verb: 'bukatu',
    meaning: { en: 'to finish', es: 'terminar', eu: 'bukatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'bukatzen dut',
        zu: 'bukatzen duzu',
        hura: 'bukatzen du',
        gu: 'bukatzen dugu',
        zuek: 'bukatzen duzue',
        haiek: 'bukatzen dute',
      },
      past: {
        ni: 'bukatu nuen',
        zu: 'bukatu zenuen',
        hura: 'bukatu zuen',
        gu: 'bukatu genuen',
        zuek: 'bukatu zenuten',
        haiek: 'bukatu zuten',
      },
      future: {
        ni: 'bukatuko dut',
        zu: 'bukatuko duzu',
        hura: 'bukatuko du',
        gu: 'bukatuko dugu',
        zuek: 'bukatuko duzue',
        haiek: 'bukatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik lana ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark liburua ___.', validFor: [] },
        gu: { text: 'Guk proiektua ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek azterketa ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo lana ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean liburua ___.',
        gu: 'Guk iaz proiektua ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean azterketa ___.',
      },
    },
  },
  {
    id: 'amaitu',
    verb: 'amaitu',
    meaning: { en: 'to finish / to end', es: 'acabar / finalizar', eu: 'amaitu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'amaitzen dut',
        zu: 'amaitzen duzu',
        hura: 'amaitzen du',
        gu: 'amaitzen dugu',
        zuek: 'amaitzen duzue',
        haiek: 'amaitzen dute',
      },
      past: {
        ni: 'amaitu nuen',
        zu: 'amaitu zenuen',
        hura: 'amaitu zuen',
        gu: 'amaitu genuen',
        zuek: 'amaitu zenuten',
        haiek: 'amaitu zuten',
      },
      future: {
        ni: 'amaituko dut',
        zu: 'amaituko duzu',
        hura: 'amaituko du',
        gu: 'amaituko dugu',
        zuek: 'amaituko duzue',
        haiek: 'amaituko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik ikasketak ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark lana ___.', validFor: [] },
        gu: { text: 'Guk bilera ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek partida ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo ikasketak ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean lana ___.',
        gu: 'Guk iaz bilera ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean partida ___.',
      },
    },
  },
  {
    id: 'gainditu',
    verb: 'gainditu',
    meaning: { en: 'to pass / to overcome', es: 'superar / aprobar', eu: 'gainditu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'gainditzen dut',
        zu: 'gainditzen duzu',
        hura: 'gainditzen du',
        gu: 'gainditzen dugu',
        zuek: 'gainditzen duzue',
        haiek: 'gainditzen dute',
      },
      past: {
        ni: 'gainditu nuen',
        zu: 'gainditu zenuen',
        hura: 'gainditu zuen',
        gu: 'gainditu genuen',
        zuek: 'gainditu zenuten',
        haiek: 'gainditu zuten',
      },
      future: {
        ni: 'gaindituko dut',
        zu: 'gaindituko duzu',
        hura: 'gaindituko du',
        gu: 'gaindituko dugu',
        zuek: 'gaindituko duzue',
        haiek: 'gaindituko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik azterketa ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark proba ___.', validFor: [] },
        gu: { text: 'Guk oztopoa ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek azterketa guztiak ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo azterketa ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean proba ___.',
        gu: 'Guk iaz oztopoa ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean azterketa guztiak ___.',
      },
    },
  },
  {
    id: 'bereiztu',
    verb: 'bereiztu',
    meaning: { en: 'to distinguish / to separate', es: 'distinguir / separar', eu: 'bereiztu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'bereizten dut',
        zu: 'bereizten duzu',
        hura: 'bereizten du',
        gu: 'bereizten dugu',
        zuek: 'bereizten duzue',
        haiek: 'bereizten dute',
      },
      past: {
        ni: 'bereiztu nuen',
        zu: 'bereiztu zenuen',
        hura: 'bereiztu zuen',
        gu: 'bereiztu genuen',
        zuek: 'bereiztu zenuten',
        haiek: 'bereiztu zuten',
      },
      future: {
        ni: 'bereiztuko dut',
        zu: 'bereiztuko duzu',
        hura: 'bereiztuko du',
        gu: 'bereiztuko dugu',
        zuek: 'bereiztuko duzue',
        haiek: 'bereiztuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik hondakinak ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark egia eta gezurra ___.', validFor: [] },
        gu: { text: 'Guk arropa garbia ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek bi mota ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo hondakinak ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean egia eta gezurra ___.',
        gu: 'Guk iaz arropa garbia ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean bi mota ___.',
      },
    },
  },
  {
    id: 'ezagutu',
    verb: 'ezagutu',
    meaning: { en: 'to know (a person/place) / to meet', es: 'conocer', eu: 'ezagutu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ezagutzen dut',
        zu: 'ezagutzen duzu',
        hura: 'ezagutzen du',
        gu: 'ezagutzen dugu',
        zuek: 'ezagutzen duzue',
        haiek: 'ezagutzen dute',
      },
      past: {
        ni: 'ezagutu nuen',
        zu: 'ezagutu zenuen',
        hura: 'ezagutu zuen',
        gu: 'ezagutu genuen',
        zuek: 'ezagutu zenuten',
        haiek: 'ezagutu zuten',
      },
      future: {
        ni: 'ezagutuko dut',
        zu: 'ezagutuko duzu',
        hura: 'ezagutuko du',
        gu: 'ezagutuko dugu',
        zuek: 'ezagutuko duzue',
        haiek: 'ezagutuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik herri hau ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark gizon hori ___.', validFor: [] },
        gu: { text: 'Guk auzo berria ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek hizkuntza hori ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo herri hau ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean gizon hori ___.',
        gu: 'Guk iaz auzo berria ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean hizkuntza hori ___.',
      },
    },
  },
  {
    id: 'sentitu',
    verb: 'sentitu',
    meaning: { en: 'to feel', es: 'sentir', eu: 'sentitu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'sentitzen dut',
        zu: 'sentitzen duzu',
        hura: 'sentitzen du',
        gu: 'sentitzen dugu',
        zuek: 'sentitzen duzue',
        haiek: 'sentitzen dute',
      },
      past: {
        ni: 'sentitu nuen',
        zu: 'sentitu zenuen',
        hura: 'sentitu zuen',
        gu: 'sentitu genuen',
        zuek: 'sentitu zenuten',
        haiek: 'sentitu zuten',
      },
      future: {
        ni: 'sentituko dut',
        zu: 'sentituko duzu',
        hura: 'sentituko du',
        gu: 'sentituko dugu',
        zuek: 'sentituko duzue',
        haiek: 'sentituko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik beldurra ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark poza ___.', validFor: [] },
        gu: { text: 'Guk nekea ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek haserrea ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo beldurra ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean poza ___.',
        gu: 'Guk iaz nekea ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean haserrea ___.',
      },
    },
  },
  {
    id: 'pentsatu',
    verb: 'pentsatu',
    meaning: { en: 'to think', es: 'pensar', eu: 'pentsatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'pentsatzen dut',
        zu: 'pentsatzen duzu',
        hura: 'pentsatzen du',
        gu: 'pentsatzen dugu',
        zuek: 'pentsatzen duzue',
        haiek: 'pentsatzen dute',
      },
      past: {
        ni: 'pentsatu nuen',
        zu: 'pentsatu zenuen',
        hura: 'pentsatu zuen',
        gu: 'pentsatu genuen',
        zuek: 'pentsatu zenuten',
        haiek: 'pentsatu zuten',
      },
      future: {
        ni: 'pentsatuko dut',
        zu: 'pentsatuko duzu',
        hura: 'pentsatuko du',
        gu: 'pentsatuko dugu',
        zuek: 'pentsatuko duzue',
        haiek: 'pentsatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik horretan ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark plana ___.', validFor: [] },
        gu: { text: 'Guk irtenbidea ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek aukera berriak ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo horretan ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean plana ___.',
        gu: 'Guk iaz irtenbidea ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean aukera berriak ___.',
      },
    },
  },
  {
    id: 'sumatu',
    verb: 'sumatu',
    meaning: { en: 'to sense / to perceive', es: 'percibir / sospechar', eu: 'sumatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'sumatzen dut',
        zu: 'sumatzen duzu',
        hura: 'sumatzen du',
        gu: 'sumatzen dugu',
        zuek: 'sumatzen duzue',
        haiek: 'sumatzen dute',
      },
      past: {
        ni: 'sumatu nuen',
        zu: 'sumatu zenuen',
        hura: 'sumatu zuen',
        gu: 'sumatu genuen',
        zuek: 'sumatu zenuten',
        haiek: 'sumatu zuten',
      },
      future: {
        ni: 'sumatuko dut',
        zu: 'sumatuko duzu',
        hura: 'sumatuko du',
        gu: 'sumatuko dugu',
        zuek: 'sumatuko duzue',
        haiek: 'sumatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik arriskua ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark aldaketa ___.', validFor: [] },
        gu: { text: 'Guk presioa ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek tentsioa ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo arriskua ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean aldaketa ___.',
        gu: 'Guk iaz presioa ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean tentsioa ___.',
      },
    },
  },
  {
    id: 'ulertu',
    verb: 'ulertu',
    meaning: { en: 'to understand', es: 'entender / comprender', eu: 'ulertu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ulertzen dut',
        zu: 'ulertzen duzu',
        hura: 'ulertzen du',
        gu: 'ulertzen dugu',
        zuek: 'ulertzen duzue',
        haiek: 'ulertzen dute',
      },
      past: {
        ni: 'ulertu nuen',
        zu: 'ulertu zenuen',
        hura: 'ulertu zuen',
        gu: 'ulertu genuen',
        zuek: 'ulertu zenuten',
        haiek: 'ulertu zuten',
      },
      future: {
        ni: 'ulertuko dut',
        zu: 'ulertuko duzu',
        hura: 'ulertuko du',
        gu: 'ulertuko dugu',
        zuek: 'ulertuko duzue',
        haiek: 'ulertuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik azalpena ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark arazoa ___.', validFor: [] },
        gu: { text: 'Guk testua ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek gaia ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo azalpena ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean arazoa ___.',
        gu: 'Guk iaz testua ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean gaia ___.',
      },
    },
  },
  {
    id: 'aztertu',
    verb: 'aztertu',
    meaning: { en: 'to examine / to analyze', es: 'examinar / analizar', eu: 'aztertu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'aztertzen dut',
        zu: 'aztertzen duzu',
        hura: 'aztertzen du',
        gu: 'aztertzen dugu',
        zuek: 'aztertzen duzue',
        haiek: 'aztertzen dute',
      },
      past: {
        ni: 'aztertu nuen',
        zu: 'aztertu zenuen',
        hura: 'aztertu zuen',
        gu: 'aztertu genuen',
        zuek: 'aztertu zenuten',
        haiek: 'aztertu zuten',
      },
      future: {
        ni: 'aztertuko dut',
        zu: 'aztertuko duzu',
        hura: 'aztertuko du',
        gu: 'aztertuko dugu',
        zuek: 'aztertuko duzue',
        haiek: 'aztertuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik datuak ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark egoera ___.', validFor: [] },
        gu: { text: 'Guk emaitzak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek txostena ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo datuak ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean egoera ___.',
        gu: 'Guk iaz emaitzak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean txostena ___.',
      },
    },
  },
  {
    id: 'ukatu',
    verb: 'ukatu',
    meaning: { en: 'to deny', es: 'negar', eu: 'ukatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ukatzen dut',
        zu: 'ukatzen duzu',
        hura: 'ukatzen du',
        gu: 'ukatzen dugu',
        zuek: 'ukatzen duzue',
        haiek: 'ukatzen dute',
      },
      past: {
        ni: 'ukatu nuen',
        zu: 'ukatu zenuen',
        hura: 'ukatu zuen',
        gu: 'ukatu genuen',
        zuek: 'ukatu zenuten',
        haiek: 'ukatu zuten',
      },
      future: {
        ni: 'ukatuko dut',
        zu: 'ukatuko duzu',
        hura: 'ukatuko du',
        gu: 'ukatuko dugu',
        zuek: 'ukatuko duzue',
        haiek: 'ukatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik egia ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark errua ___.', validFor: [] },
        gu: { text: 'Guk akatsa ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek leporatutakoa ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo egia ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean errua ___.',
        gu: 'Guk iaz akatsa ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean leporatutakoa ___.',
      },
    },
  },
  {
    id: 'batu',
    verb: 'batu',
    meaning: { en: 'to gather / to join / to add', es: 'juntar / sumar', eu: 'batu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'batzen dut',
        zu: 'batzen duzu',
        hura: 'batzen du',
        gu: 'batzen dugu',
        zuek: 'batzen duzue',
        haiek: 'batzen dute',
      },
      past: {
        ni: 'batu nuen',
        zu: 'batu zenuen',
        hura: 'batu zuen',
        gu: 'batu genuen',
        zuek: 'batu zenuten',
        haiek: 'batu zuten',
      },
      future: {
        ni: 'batuko dut',
        zu: 'batuko duzu',
        hura: 'batuko du',
        gu: 'batuko dugu',
        zuek: 'batuko duzue',
        haiek: 'batuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik zenbakiak ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark lagunak ___.', validFor: [] },
        gu: { text: 'Guk indarrak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek diru bilketa ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo zenbakiak ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean lagunak ___.',
        gu: 'Guk iaz indarrak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean diru bilketa ___.',
      },
    },
  },
  {
    id: 'planteatu',
    verb: 'planteatu',
    meaning: { en: 'to pose / to raise (an issue)', es: 'plantear', eu: 'planteatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'planteatzen dut',
        zu: 'planteatzen duzu',
        hura: 'planteatzen du',
        gu: 'planteatzen dugu',
        zuek: 'planteatzen duzue',
        haiek: 'planteatzen dute',
      },
      past: {
        ni: 'planteatu nuen',
        zu: 'planteatu zenuen',
        hura: 'planteatu zuen',
        gu: 'planteatu genuen',
        zuek: 'planteatu zenuten',
        haiek: 'planteatu zuten',
      },
      future: {
        ni: 'planteatuko dut',
        zu: 'planteatuko duzu',
        hura: 'planteatuko du',
        gu: 'planteatuko dugu',
        zuek: 'planteatuko duzue',
        haiek: 'planteatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik arazoa ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark galdera ___.', validFor: [] },
        gu: { text: 'Guk proposamen berria ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek hainbat zalantza ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo arazoa ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean galdera ___.',
        gu: 'Guk iaz proposamen berria ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean hainbat zalantza ___.',
      },
    },
  },
  {
    id: 'erori',
    verb: 'erori',
    meaning: { en: 'to fall', es: 'caerse', eu: 'erori' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'erortzen naiz',
        zu: 'erortzen zara',
        hura: 'erortzen da',
        gu: 'erortzen gara',
        zuek: 'erortzen zarete',
        haiek: 'erortzen dira',
      },
      past: {
        ni: 'erori nintzen',
        zu: 'erori zinen',
        hura: 'erori zen',
        gu: 'erori ginen',
        zuek: 'erori zineten',
        haiek: 'erori ziren',
      },
      future: {
        ni: 'eroriko naiz',
        zu: 'eroriko zara',
        hura: 'eroriko da',
        gu: 'eroriko gara',
        zuek: 'eroriko zarete',
        haiek: 'eroriko dira',
      },
    },
    sentences: {
      present: {
        ni: 'Ni lurrera ___.',
        zu: 'Zu eskaileretan ___?',
        hura: 'Hura bizikletatik ___.',
        gu: 'Gu elurretan ___.',
        zuek: 'Zuek eskaileretan ___?',
        haiek: 'Haiek lurrera ___.',
      },
      past: {
        ni: 'Ni atzo lurrera ___.',
        zu: 'Zu herenegun eskaileretan ___?',
        hura: 'Hura lehengo egunean bizikletatik ___.',
        gu: 'Gu iaz elurretan ___.',
        zuek: 'Zuek duela bi egun eskaileretan ___?',
        haiek: 'Haiek joan den astean lurrera ___.',
      },
    },
  },
  {
    id: 'jaiki',
    verb: 'jaiki',
    meaning: { en: 'to get up / to rise', es: 'levantarse', eu: 'jaiki' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'jaikitzen naiz',
        zu: 'jaikitzen zara',
        hura: 'jaikitzen da',
        gu: 'jaikitzen gara',
        zuek: 'jaikitzen zarete',
        haiek: 'jaikitzen dira',
      },
      past: {
        ni: 'jaiki nintzen',
        zu: 'jaiki zinen',
        hura: 'jaiki zen',
        gu: 'jaiki ginen',
        zuek: 'jaiki zineten',
        haiek: 'jaiki ziren',
      },
      future: {
        ni: 'jaikiko naiz',
        zu: 'jaikiko zara',
        hura: 'jaikiko da',
        gu: 'jaikiko gara',
        zuek: 'jaikiko zarete',
        haiek: 'jaikiko dira',
      },
    },
    sentences: {
      present: {
        ni: 'Ni goiz ___.',
        zu: 'Zu berandu ___?',
        hura: 'Hura eguzkiarekin ___.',
        gu: 'Gu lehenbailehen ___.',
        zuek: 'Zuek berandu ___?',
        haiek: 'Haiek goiz ___.',
      },
      past: {
        ni: 'Ni atzo goiz ___.',
        zu: 'Zu herenegun berandu ___?',
        hura: 'Hura lehengo egunean eguzkiarekin ___.',
        gu: 'Gu iaz lehenbailehen ___.',
        zuek: 'Zuek duela bi egun berandu ___?',
        haiek: 'Haiek joan den astean goiz ___.',
      },
    },
  },
  // #321 (fodder, academic/rare tier — recognition-only, per #318's reserved
  // plan; docs/DECISIONS.md). All 12 are regular nor-nork verbs; sentences
  // are deliberately minimal (one frame per person) since this tier is
  // recognition-only exposure, not typed-production drilling — see
  // docs/LANGUAGE_DECISIONS.md.
  {
    id: 'hausnartu',
    verb: 'hausnartu',
    meaning: { en: 'to reflect on / to ponder', es: 'reflexionar sobre', eu: 'hausnartu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'hausnartzen dut',
        zu: 'hausnartzen duzu',
        hura: 'hausnartzen du',
        gu: 'hausnartzen dugu',
        zuek: 'hausnartzen duzue',
        haiek: 'hausnartzen dute',
      },
      past: {
        ni: 'hausnartu nuen',
        zu: 'hausnartu zenuen',
        hura: 'hausnartu zuen',
        gu: 'hausnartu genuen',
        zuek: 'hausnartu zenuten',
        haiek: 'hausnartu zuten',
      },
      future: {
        ni: 'hausnartuko dut',
        zu: 'hausnartuko duzu',
        hura: 'hausnartuko du',
        gu: 'hausnartuko dugu',
        zuek: 'hausnartuko duzue',
        haiek: 'hausnartuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik gaiari buruz ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark erabakiari buruz ___.', validFor: [] },
        gu: { text: 'Guk gaiari buruz ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek erabakiari buruz ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo gaiari buruz ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean erabakiari buruz ___.',
        gu: 'Guk iaz gaiari buruz ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean erabakiari buruz ___.',
      },
    },
  },
  {
    id: 'argudiatu',
    verb: 'argudiatu',
    meaning: { en: 'to argue (a case) / to make a case for', es: 'argumentar', eu: 'argudiatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'argudiatzen dut',
        zu: 'argudiatzen duzu',
        hura: 'argudiatzen du',
        gu: 'argudiatzen dugu',
        zuek: 'argudiatzen duzue',
        haiek: 'argudiatzen dute',
      },
      past: {
        ni: 'argudiatu nuen',
        zu: 'argudiatu zenuen',
        hura: 'argudiatu zuen',
        gu: 'argudiatu genuen',
        zuek: 'argudiatu zenuten',
        haiek: 'argudiatu zuten',
      },
      future: {
        ni: 'argudiatuko dut',
        zu: 'argudiatuko duzu',
        hura: 'argudiatuko du',
        gu: 'argudiatuko dugu',
        zuek: 'argudiatuko duzue',
        haiek: 'argudiatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik nire jarrera ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark bere ikuspuntua ___.', validFor: [] },
        gu: { text: 'Guk gure proposamena ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek beren tesia ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo nire jarrera ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean bere ikuspuntua ___.',
        gu: 'Guk iaz gure proposamena ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean beren tesia ___.',
      },
    },
  },
  {
    id: 'ondorioztatu',
    verb: 'ondorioztatu',
    meaning: { en: 'to conclude / to deduce', es: 'concluir / deducir', eu: 'ondorioztatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'ondorioztatzen dut',
        zu: 'ondorioztatzen duzu',
        hura: 'ondorioztatzen du',
        gu: 'ondorioztatzen dugu',
        zuek: 'ondorioztatzen duzue',
        haiek: 'ondorioztatzen dute',
      },
      past: {
        ni: 'ondorioztatu nuen',
        zu: 'ondorioztatu zenuen',
        hura: 'ondorioztatu zuen',
        gu: 'ondorioztatu genuen',
        zuek: 'ondorioztatu zenuten',
        haiek: 'ondorioztatu zuten',
      },
      future: {
        ni: 'ondorioztatuko dut',
        zu: 'ondorioztatuko duzu',
        hura: 'ondorioztatuko du',
        gu: 'ondorioztatuko dugu',
        zuek: 'ondorioztatuko duzue',
        haiek: 'ondorioztatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik ikerketatik ondorio bat ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark datuetatik ondorio bat ___.', validFor: [] },
        gu: { text: 'Guk azterketatik zerbait ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek emaitzetatik ondorio bat ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo ikerketatik ondorio bat ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean datuetatik ondorio bat ___.',
        gu: 'Guk iaz azterketatik zerbait ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean emaitzetatik ondorio bat ___.',
      },
    },
  },
  {
    id: 'gaitzetsi',
    verb: 'gaitzetsi',
    meaning: { en: 'to condemn / to reprehend', es: 'condenar / reprobar', eu: 'gaitzetsi' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'gaitzesten dut',
        zu: 'gaitzesten duzu',
        hura: 'gaitzesten du',
        gu: 'gaitzesten dugu',
        zuek: 'gaitzesten duzue',
        haiek: 'gaitzesten dute',
      },
      past: {
        ni: 'gaitzetsi nuen',
        zu: 'gaitzetsi zenuen',
        hura: 'gaitzetsi zuen',
        gu: 'gaitzetsi genuen',
        zuek: 'gaitzetsi zenuten',
        haiek: 'gaitzetsi zuten',
      },
      future: {
        ni: 'gaitzetsiko dut',
        zu: 'gaitzetsiko duzu',
        hura: 'gaitzetsiko du',
        gu: 'gaitzetsiko dugu',
        zuek: 'gaitzetsiko duzue',
        haiek: 'gaitzetsiko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik indarkeria ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark erasoa ___.', validFor: [] },
        gu: { text: 'Guk jokabide hori ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek erabaki hori ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo indarkeria ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean erasoa ___.',
        gu: 'Guk iaz jokabide hori ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean erabaki hori ___.',
      },
    },
  },
  {
    id: 'aldarrikatu',
    verb: 'aldarrikatu',
    meaning: { en: 'to proclaim / to declare', es: 'proclamar / declarar', eu: 'aldarrikatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'aldarrikatzen dut',
        zu: 'aldarrikatzen duzu',
        hura: 'aldarrikatzen du',
        gu: 'aldarrikatzen dugu',
        zuek: 'aldarrikatzen duzue',
        haiek: 'aldarrikatzen dute',
      },
      past: {
        ni: 'aldarrikatu nuen',
        zu: 'aldarrikatu zenuen',
        hura: 'aldarrikatu zuen',
        gu: 'aldarrikatu genuen',
        zuek: 'aldarrikatu zenuten',
        haiek: 'aldarrikatu zuten',
      },
      future: {
        ni: 'aldarrikatuko dut',
        zu: 'aldarrikatuko duzu',
        hura: 'aldarrikatuko du',
        gu: 'aldarrikatuko dugu',
        zuek: 'aldarrikatuko duzue',
        haiek: 'aldarrikatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik nire eskubideak ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark independentzia ___.', validFor: [] },
        gu: { text: 'Guk gure eskubideak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek beren eskubideak ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo nire eskubideak ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean independentzia ___.',
        gu: 'Guk iaz gure eskubideak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean beren eskubideak ___.',
      },
    },
  },
  {
    id: 'plazaratu',
    verb: 'plazaratu',
    meaning: { en: 'to bring to light / to make public', es: 'hacer público / sacar a la luz', eu: 'plazaratu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'plazaratzen dut',
        zu: 'plazaratzen duzu',
        hura: 'plazaratzen du',
        gu: 'plazaratzen dugu',
        zuek: 'plazaratzen duzue',
        haiek: 'plazaratzen dute',
      },
      past: {
        ni: 'plazaratu nuen',
        zu: 'plazaratu zenuen',
        hura: 'plazaratu zuen',
        gu: 'plazaratu genuen',
        zuek: 'plazaratu zenuten',
        haiek: 'plazaratu zuten',
      },
      future: {
        ni: 'plazaratuko dut',
        zu: 'plazaratuko duzu',
        hura: 'plazaratuko du',
        gu: 'plazaratuko dugu',
        zuek: 'plazaratuko duzue',
        haiek: 'plazaratuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik txostena ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark albistea ___.', validFor: [] },
        gu: { text: 'Guk emaitzak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek txosten berria ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo txostena ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean albistea ___.',
        gu: 'Guk iaz emaitzak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean txosten berria ___.',
      },
    },
  },
  {
    id: 'sustatu',
    verb: 'sustatu',
    meaning: { en: 'to promote / to foster', es: 'fomentar / impulsar', eu: 'sustatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'sustatzen dut',
        zu: 'sustatzen duzu',
        hura: 'sustatzen du',
        gu: 'sustatzen dugu',
        zuek: 'sustatzen duzue',
        haiek: 'sustatzen dute',
      },
      past: {
        ni: 'sustatu nuen',
        zu: 'sustatu zenuen',
        hura: 'sustatu zuen',
        gu: 'sustatu genuen',
        zuek: 'sustatu zenuten',
        haiek: 'sustatu zuten',
      },
      future: {
        ni: 'sustatuko dut',
        zu: 'sustatuko duzu',
        hura: 'sustatuko du',
        gu: 'sustatuko dugu',
        zuek: 'sustatuko duzue',
        haiek: 'sustatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik tokiko ekonomia ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark berrikuntza ___.', validFor: [] },
        gu: { text: 'Guk parte-hartzea ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek ekimen berria ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo tokiko ekonomia ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean berrikuntza ___.',
        gu: 'Guk iaz parte-hartzea ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean ekimen berria ___.',
      },
    },
  },
  {
    id: 'bultzatu',
    verb: 'bultzatu',
    meaning: { en: 'to push / to drive forward', es: 'impulsar / empujar', eu: 'bultzatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'bultzatzen dut',
        zu: 'bultzatzen duzu',
        hura: 'bultzatzen du',
        gu: 'bultzatzen dugu',
        zuek: 'bultzatzen duzue',
        haiek: 'bultzatzen dute',
      },
      past: {
        ni: 'bultzatu nuen',
        zu: 'bultzatu zenuen',
        hura: 'bultzatu zuen',
        gu: 'bultzatu genuen',
        zuek: 'bultzatu zenuten',
        haiek: 'bultzatu zuten',
      },
      future: {
        ni: 'bultzatuko dut',
        zu: 'bultzatuko duzu',
        hura: 'bultzatuko du',
        gu: 'bultzatuko dugu',
        zuek: 'bultzatuko duzue',
        haiek: 'bultzatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik proiektua ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark aldaketa ___.', validFor: [] },
        gu: { text: 'Guk ekimena ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek erreforma ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo proiektua ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean aldaketa ___.',
        gu: 'Guk iaz ekimena ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean erreforma ___.',
      },
    },
  },
  {
    id: 'bermatu',
    verb: 'bermatu',
    meaning: { en: 'to guarantee / to ensure', es: 'garantizar', eu: 'bermatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'bermatzen dut',
        zu: 'bermatzen duzu',
        hura: 'bermatzen du',
        gu: 'bermatzen dugu',
        zuek: 'bermatzen duzue',
        haiek: 'bermatzen dute',
      },
      past: {
        ni: 'bermatu nuen',
        zu: 'bermatu zenuen',
        hura: 'bermatu zuen',
        gu: 'bermatu genuen',
        zuek: 'bermatu zenuten',
        haiek: 'bermatu zuten',
      },
      future: {
        ni: 'bermatuko dut',
        zu: 'bermatuko duzu',
        hura: 'bermatuko du',
        gu: 'bermatuko dugu',
        zuek: 'bermatuko duzue',
        haiek: 'bermatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik segurtasuna ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark kalitatea ___.', validFor: [] },
        gu: { text: 'Guk eskubideak ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek prozesua ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo segurtasuna ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean kalitatea ___.',
        gu: 'Guk iaz eskubideak ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean prozesua ___.',
      },
    },
  },
  {
    id: 'babestu',
    verb: 'babestu',
    meaning: { en: 'to protect', es: 'proteger', eu: 'babestu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'babesten dut',
        zu: 'babesten duzu',
        hura: 'babesten du',
        gu: 'babesten dugu',
        zuek: 'babesten duzue',
        haiek: 'babesten dute',
      },
      past: {
        ni: 'babestu nuen',
        zu: 'babestu zenuen',
        hura: 'babestu zuen',
        gu: 'babestu genuen',
        zuek: 'babestu zenuten',
        haiek: 'babestu zuten',
      },
      future: {
        ni: 'babestuko dut',
        zu: 'babestuko duzu',
        hura: 'babestuko du',
        gu: 'babestuko dugu',
        zuek: 'babestuko duzue',
        haiek: 'babestuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik natura ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark herria ___.', validFor: [] },
        gu: { text: 'Guk ingurumena ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek mehatxupeko espezieak ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo natura ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean herria ___.',
        gu: 'Guk iaz ingurumena ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean mehatxupeko espezieak ___.',
      },
    },
  },
  {
    id: 'ziurtatu',
    verb: 'ziurtatu',
    meaning: { en: 'to ensure / to make certain', es: 'asegurar / cerciorarse de', eu: 'ziurtatu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'ziurtatzen dut',
        zu: 'ziurtatzen duzu',
        hura: 'ziurtatzen du',
        gu: 'ziurtatzen dugu',
        zuek: 'ziurtatzen duzue',
        haiek: 'ziurtatzen dute',
      },
      past: {
        ni: 'ziurtatu nuen',
        zu: 'ziurtatu zenuen',
        hura: 'ziurtatu zuen',
        gu: 'ziurtatu genuen',
        zuek: 'ziurtatu zenuten',
        haiek: 'ziurtatu zuten',
      },
      future: {
        ni: 'ziurtatuko dut',
        zu: 'ziurtatuko duzu',
        hura: 'ziurtatuko du',
        gu: 'ziurtatuko dugu',
        zuek: 'ziurtatuko duzue',
        haiek: 'ziurtatuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik informazioa ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark datua ___.', validFor: [] },
        gu: { text: 'Guk emaitza ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek prozesua ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo informazioa ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean datua ___.',
        gu: 'Guk iaz emaitza ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean prozesua ___.',
      },
    },
  },
  {
    id: 'borobildu',
    verb: 'borobildu',
    meaning: { en: 'to round off / to finalize', es: 'redondear / cerrar (un acuerdo)', eu: 'borobildu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    recognitionOnly: true,
    conjugations: {
      present: {
        ni: 'borobiltzen dut',
        zu: 'borobiltzen duzu',
        hura: 'borobiltzen du',
        gu: 'borobiltzen dugu',
        zuek: 'borobiltzen duzue',
        haiek: 'borobiltzen dute',
      },
      past: {
        ni: 'borobildu nuen',
        zu: 'borobildu zenuen',
        hura: 'borobildu zuen',
        gu: 'borobildu genuen',
        zuek: 'borobildu zenuten',
        haiek: 'borobildu zuten',
      },
      future: {
        ni: 'borobilduko dut',
        zu: 'borobilduko duzu',
        hura: 'borobilduko du',
        gu: 'borobilduko dugu',
        zuek: 'borobilduko duzue',
        haiek: 'borobilduko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik akordioa ___.', validFor: [] },
        zu: { text: 'Zuk zer ___?', validFor: [] },
        hura: { text: 'Hark eskaintza ___.', validFor: [] },
        gu: { text: 'Guk plana ___.', validFor: [] },
        zuek: { text: 'Zuek zer ___?', validFor: [] },
        haiek: { text: 'Haiek negoziazioa ___.', validFor: [] },
      },
      past: {
        ni: 'Nik atzo akordioa ___.',
        zu: 'Zuk herenegun zer ___?',
        hura: 'Hark lehengo egunean eskaintza ___.',
        gu: 'Guk iaz plana ___.',
        zuek: 'Zuek duela bi egun zer ___?',
        haiek: 'Haiek joan den astean negoziazioa ___.',
      },
    },
  },
  // #306 — fixed noun+verb expressions: `egin`/`hartu`/`eman`/`egon`/`jarri`
  // carry the conjugation, an invariant noun/particle sits in front of it,
  // same shape as `nahi izan`/`behar izan` above (full conjugated string
  // includes the invariant word). Each gets its own dedicated `VERBS` entry
  // rather than `sentences` layered onto the base verb, since the meaning
  // ("to talk", "to work", "to pay attention"...) is opaque from the base
  // verb's gloss alone — see docs/DECISIONS.md.
  {
    id: 'hitz-egin',
    verb: 'hitz egin',
    meaning: { en: 'to talk / to speak', es: 'hablar', eu: 'hitz egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'hitz egiten dut',
        zu: 'hitz egiten duzu',
        hura: 'hitz egiten du',
        gu: 'hitz egiten dugu',
        zuek: 'hitz egiten duzue',
        haiek: 'hitz egiten dute',
      },
      past: {
        ni: 'hitz egin nuen',
        zu: 'hitz egin zenuen',
        hura: 'hitz egin zuen',
        gu: 'hitz egin genuen',
        zuek: 'hitz egin zenuten',
        haiek: 'hitz egin zuten',
      },
      future: {
        ni: 'hitz egingo dut',
        zu: 'hitz egingo duzu',
        hura: 'hitz egingo du',
        gu: 'hitz egingo dugu',
        zuek: 'hitz egingo duzue',
        haiek: 'hitz egingo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik euskaraz ___.', validFor: [] },
        zu: { text: 'Zuk gaztelaniaz ___?', validFor: [] },
        hura: { text: 'Hark ingelesez ___.', validFor: [] },
        gu: { text: 'Guk frantsesez ___.', validFor: [] },
        zuek: { text: 'Zuek euskaraz ___?', validFor: [] },
        haiek: { text: 'Haiek ingelesez ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo euskaraz ___.', validFor: [] },
        zu: { text: 'Zuk herenegun gaztelaniaz ___?', validFor: [] },
        hura: { text: 'Hark bilkuran ingelesez ___.', validFor: [] },
        gu: { text: 'Guk iaz frantsesez ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun euskaraz ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean ingelesez ___.', validFor: [] },
      },
    },
  },
  {
    id: 'lan-egin',
    verb: 'lan egin',
    meaning: { en: 'to work', es: 'trabajar', eu: 'lan egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'lan egiten dut',
        zu: 'lan egiten duzu',
        hura: 'lan egiten du',
        gu: 'lan egiten dugu',
        zuek: 'lan egiten duzue',
        haiek: 'lan egiten dute',
      },
      past: {
        ni: 'lan egin nuen',
        zu: 'lan egin zenuen',
        hura: 'lan egin zuen',
        gu: 'lan egin genuen',
        zuek: 'lan egin zenuten',
        haiek: 'lan egin zuten',
      },
      future: {
        ni: 'lan egingo dut',
        zu: 'lan egingo duzu',
        hura: 'lan egingo du',
        gu: 'lan egingo dugu',
        zuek: 'lan egingo duzue',
        haiek: 'lan egingo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik etxetik ___.', validFor: [] },
        zu: { text: 'Zuk asko ___?', validFor: [] },
        hura: { text: 'Hark ospitalean ___.', validFor: [] },
        gu: { text: 'Guk asteburuetan ___.', validFor: [] },
        zuek: { text: 'Zuek goizean ___?', validFor: [] },
        haiek: { text: 'Haiek elkarrekin ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo etxetik ___.', validFor: [] },
        zu: { text: 'Zuk herenegun asko ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean ospitalean ___.', validFor: [] },
        gu: { text: 'Guk iaz asteburuetan ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun goizean ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean elkarrekin ___.', validFor: [] },
      },
    },
  },
  {
    id: 'lo-egin',
    verb: 'lo egin',
    meaning: { en: 'to sleep', es: 'dormir', eu: 'lo egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'lo egiten dut',
        zu: 'lo egiten duzu',
        hura: 'lo egiten du',
        gu: 'lo egiten dugu',
        zuek: 'lo egiten duzue',
        haiek: 'lo egiten dute',
      },
      past: {
        ni: 'lo egin nuen',
        zu: 'lo egin zenuen',
        hura: 'lo egin zuen',
        gu: 'lo egin genuen',
        zuek: 'lo egin zenuten',
        haiek: 'lo egin zuten',
      },
      future: {
        ni: 'lo egingo dut',
        zu: 'lo egingo duzu',
        hura: 'lo egingo du',
        gu: 'lo egingo dugu',
        zuek: 'lo egingo duzue',
        haiek: 'lo egingo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik zortzi ordu ___.', validFor: [] },
        zu: { text: 'Zuk gutxi ___?', validFor: [] },
        hura: { text: 'Hark egunero hamar ordu ___.', validFor: [] },
        gu: { text: 'Guk gaztelu zaharrean ___.', validFor: [] },
        zuek: { text: 'Zuek tendan ___?', validFor: [] },
        haiek: { text: 'Haiek autobusean ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo gaixorik ___.', validFor: [] },
        zu: { text: 'Zuk herenegun gutxi ___?', validFor: [] },
        hura: { text: 'Hark hegaldian ___.', validFor: [] },
        gu: { text: 'Guk iaz kanpalekuan ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun berandura arte ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean autobusean ___.', validFor: [] },
      },
    },
  },
  {
    id: 'ahaleginak-egin',
    verb: 'ahaleginak egin',
    meaning: { en: 'to make an effort / try hard', es: 'esforzarse', eu: 'ahaleginak egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ahaleginak egiten dut',
        zu: 'ahaleginak egiten duzu',
        hura: 'ahaleginak egiten du',
        gu: 'ahaleginak egiten dugu',
        zuek: 'ahaleginak egiten duzue',
        haiek: 'ahaleginak egiten dute',
      },
      past: {
        ni: 'ahaleginak egin nuen',
        zu: 'ahaleginak egin zenuen',
        hura: 'ahaleginak egin zuen',
        gu: 'ahaleginak egin genuen',
        zuek: 'ahaleginak egin zenuten',
        haiek: 'ahaleginak egin zuten',
      },
      future: {
        ni: 'ahaleginak egingo dut',
        zu: 'ahaleginak egingo duzu',
        hura: 'ahaleginak egingo du',
        gu: 'ahaleginak egingo dugu',
        zuek: 'ahaleginak egingo duzue',
        haiek: 'ahaleginak egingo dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik azterketan ___.', validFor: [] },
        zu: { text: 'Zuk lasterketan ___?', validFor: [] },
        hura: { text: 'Hark ikastean ___.', validFor: [] },
        gu: { text: 'Guk proiektuan ___.', validFor: [] },
        zuek: { text: 'Zuek partidan ___?', validFor: [] },
        haiek: { text: 'Haiek lehiaketan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo azterketan ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lasterketan ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean ikastean ___.', validFor: [] },
        gu: { text: 'Guk iaz proiektuan ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun partidan ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lehiaketan ___.', validFor: [] },
      },
    },
  },
  {
    id: 'parte-hartu',
    verb: 'parte hartu',
    meaning: { en: 'to take part / to participate', es: 'participar', eu: 'parte hartu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'parte hartzen dut',
        zu: 'parte hartzen duzu',
        hura: 'parte hartzen du',
        gu: 'parte hartzen dugu',
        zuek: 'parte hartzen duzue',
        haiek: 'parte hartzen dute',
      },
      past: {
        ni: 'parte hartu nuen',
        zu: 'parte hartu zenuen',
        hura: 'parte hartu zuen',
        gu: 'parte hartu genuen',
        zuek: 'parte hartu zenuten',
        haiek: 'parte hartu zuten',
      },
      future: {
        ni: 'parte hartuko dut',
        zu: 'parte hartuko duzu',
        hura: 'parte hartuko du',
        gu: 'parte hartuko dugu',
        zuek: 'parte hartuko duzue',
        haiek: 'parte hartuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik lehiaketan ___.', validFor: [] },
        zu: { text: 'Zuk biltzarrean ___?', validFor: [] },
        hura: { text: 'Hark txapelketan ___.', validFor: [] },
        gu: { text: 'Guk proiektuan ___.', validFor: [] },
        zuek: { text: 'Zuek ekitaldian ___?', validFor: [] },
        haiek: { text: 'Haiek negoziazioan ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lehiaketan ___.', validFor: [] },
        zu: { text: 'Zuk herenegun biltzarrean ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean txapelketan ___.', validFor: [] },
        gu: { text: 'Guk iaz proiektuan ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun ekitaldian ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean negoziazioan ___.', validFor: [] },
      },
    },
  },
  {
    id: 'kontuan-hartu',
    verb: 'kontuan hartu',
    meaning: { en: 'to take into account', es: 'tener en cuenta', eu: 'kontuan hartu' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'kontuan hartzen dut',
        zu: 'kontuan hartzen duzu',
        hura: 'kontuan hartzen du',
        gu: 'kontuan hartzen dugu',
        zuek: 'kontuan hartzen duzue',
        haiek: 'kontuan hartzen dute',
      },
      past: {
        ni: 'kontuan hartu nuen',
        zu: 'kontuan hartu zenuen',
        hura: 'kontuan hartu zuen',
        gu: 'kontuan hartu genuen',
        zuek: 'kontuan hartu zenuten',
        haiek: 'kontuan hartu zuten',
      },
      future: {
        ni: 'kontuan hartuko dut',
        zu: 'kontuan hartuko duzu',
        hura: 'kontuan hartuko du',
        gu: 'kontuan hartuko dugu',
        zuek: 'kontuan hartuko duzue',
        haiek: 'kontuan hartuko dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik zure iritzia ___.', validFor: [] },
        zu: { text: 'Zuk emaitza ___?', validFor: [] },
        hura: { text: 'Hark eguraldia ___.', validFor: [] },
        gu: { text: 'Guk aurrekontua ___.', validFor: [] },
        zuek: { text: 'Zuek epea ___?', validFor: [] },
        haiek: { text: 'Haiek arriskua ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo zure iritzia ___.', validFor: [] },
        zu: { text: 'Zuk herenegun emaitza ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean eguraldia ___.', validFor: [] },
        gu: { text: 'Guk iaz aurrekontua ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun epea ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean arriskua ___.', validFor: [] },
      },
    },
  },
  {
    id: 'arreta-eman',
    verb: 'arreta eman',
    meaning: { en: 'to pay attention', es: 'prestar atención', eu: 'arreta eman' },
    type: 'periphrastic',
    agreement: ['nor', 'nork'],
    object: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'arreta ematen dut',
        zu: 'arreta ematen duzu',
        hura: 'arreta ematen du',
        gu: 'arreta ematen dugu',
        zuek: 'arreta ematen duzue',
        haiek: 'arreta ematen dute',
      },
      past: {
        ni: 'arreta eman nuen',
        zu: 'arreta eman zenuen',
        hura: 'arreta eman zuen',
        gu: 'arreta eman genuen',
        zuek: 'arreta eman zenuten',
        haiek: 'arreta eman zuten',
      },
      future: {
        ni: 'arreta emango dut',
        zu: 'arreta emango duzu',
        hura: 'arreta emango du',
        gu: 'arreta emango dugu',
        zuek: 'arreta emango duzue',
        haiek: 'arreta emango dute',
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    sentences: {
      present: {
        ni: { text: 'Nik klasean ___.', validFor: [] },
        zu: { text: 'Zuk azalpenari ___?', validFor: [] },
        hura: { text: 'Hark errepideari ___.', validFor: [] },
        gu: { text: 'Guk xehetasunei ___.', validFor: [] },
        zuek: { text: 'Zuek hitzaldian ___?', validFor: [] },
        haiek: { text: 'Haiek seinaleei ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo klasean ___.', validFor: [] },
        zu: { text: 'Zuk herenegun azalpenari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean errepideari ___.', validFor: [] },
        gu: { text: 'Guk iaz xehetasunei ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun hitzaldian ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean seinaleei ___.', validFor: [] },
      },
    },
  },
  {
    id: 'ados-egon',
    verb: 'ados egon',
    meaning: { en: 'to agree / to be in agreement', es: 'estar de acuerdo', eu: 'ados egon' },
    type: 'synthetic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ados nago',
        hi: 'ados hago',
        zu: 'ados zaude',
        hura: 'ados dago',
        gu: 'ados gaude',
        zuek: 'ados zaudete',
        haiek: 'ados daude',
      },
      past: {
        ni: 'ados nengoen',
        hi: 'ados hengoen',
        zu: 'ados zeunden',
        hura: 'ados zegoen',
        gu: 'ados geunden',
        zuek: 'ados zeundeten',
        haiek: 'ados zeuden',
      },
      future: {
        ni: 'ados egongo naiz',
        zu: 'ados egongo zara',
        hura: 'ados egongo da',
        gu: 'ados egongo gara',
        zuek: 'ados egongo zarete',
        haiek: 'ados egongo dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni zurekin ___.', validFor: [] },
        zu: { text: 'Zu planarekin ___?', validFor: [] },
        hura: { text: 'Hura erabakiarekin ___.', validFor: [] },
        gu: { text: 'Gu proposamenarekin ___.', validFor: [] },
        zuek: { text: 'Zuek baldintzekin ___?', validFor: [] },
        haiek: { text: 'Haiek emaitzarekin ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni atzo zurekin ___.', validFor: [] },
        zu: { text: 'Zu herenegun planarekin ___?', validFor: [] },
        hura: { text: 'Hura lehengo astean erabakiarekin ___.', validFor: [] },
        gu: { text: 'Gu iaz proposamenarekin ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun baldintzekin ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean emaitzarekin ___.', validFor: [] },
      },
    },
  },
  {
    id: 'arriskuan-jarri',
    verb: 'arriskuan jarri',
    meaning: { en: 'to put oneself / something at risk', es: 'ponerse en riesgo', eu: 'arriskuan jarri' },
    type: 'periphrastic',
    agreement: ['nor'],
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'arriskuan jartzen naiz',
        zu: 'arriskuan jartzen zara',
        hura: 'arriskuan jartzen da',
        gu: 'arriskuan jartzen gara',
        zuek: 'arriskuan jartzen zarete',
        haiek: 'arriskuan jartzen dira',
      },
      past: {
        ni: 'arriskuan jarri nintzen',
        zu: 'arriskuan jarri zinen',
        hura: 'arriskuan jarri zen',
        gu: 'arriskuan jarri ginen',
        zuek: 'arriskuan jarri zineten',
        haiek: 'arriskuan jarri ziren',
      },
      future: {
        ni: 'arriskuan jarriko naiz',
        zu: 'arriskuan jarriko zara',
        hura: 'arriskuan jarriko da',
        gu: 'arriskuan jarriko gara',
        zuek: 'arriskuan jarriko zarete',
        haiek: 'arriskuan jarriko dira',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Ni mendian ___.', validFor: [] },
        zu: { text: 'Zu abiaduragatik ___?', validFor: [] },
        hura: { text: 'Hura itsasoan ___.', validFor: [] },
        gu: { text: 'Gu dirua galtzeko ___.', validFor: [] },
        zuek: { text: 'Zuek kaletik gindariz ___?', validFor: [] },
        haiek: { text: 'Haiek erabaki txar batekin ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Ni atzo mendian ___.', validFor: [] },
        zu: { text: 'Zu herenegun abiaduragatik ___?', validFor: [] },
        hura: { text: 'Hura lehengo astean itsasoan ___.', validFor: [] },
        gu: { text: 'Gu iaz dirua galtzeko ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun kaletik arinegi ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean erabaki txar batekin ___.', validFor: [] },
      },
    },
  },
  // #307: "agentive verbs with a covert dative" — plain-looking verbs (no
  // overt direct object the way esan/eman have "egia"/a gift) that still
  // select the `diot`-family auxiliary because their NORI argument is the
  // one being helped/called/answered/etc. This covert dative is exactly the
  // #293 confusion trigger, so these ride esan/eman's `recipient: 'hura'`
  // shape (NORI fixed, `person` varies over NORK) rather than a new shape.
  {
    id: 'lagundu',
    verb: 'lagundu',
    meaning: { en: 'to help (someone)', es: 'ayudar (a alguien)', eu: 'lagundu' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'laguntzen diot',
        zu: 'laguntzen diozu',
        hura: 'laguntzen dio',
        gu: 'laguntzen diogu',
        zuek: 'laguntzen diozue',
        haiek: 'laguntzen diote',
      },
      past: {
        ni: 'lagundu nion',
        zu: 'lagundu zenion',
        hura: 'lagundu zion',
        gu: 'lagundu genion',
        zuek: 'lagundu zenioten',
        haiek: 'lagundu zioten',
      },
      future: {
        ni: 'lagunduko diot',
        zu: 'lagunduko diozu',
        hura: 'lagunduko dio',
        gu: 'lagunduko diogu',
        zuek: 'lagunduko diozue',
        haiek: 'lagunduko diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik lagunari ___.', validFor: [] },
        zu: { text: 'Zuk lagunari ___?', validFor: [] },
        hura: { text: 'Hark lagunari ___.', validFor: [] },
        gu: { text: 'Guk lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek lagunari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lagunari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lagunari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean lagunari ___.', validFor: [] },
        gu: { text: 'Guk iaz lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lagunari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'ekin',
    verb: 'ekin',
    meaning: { en: 'to set about / get down to (something)', es: 'ponerse a (algo)', eu: 'ekin' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'ekiten diot',
        zu: 'ekiten diozu',
        hura: 'ekiten dio',
        gu: 'ekiten diogu',
        zuek: 'ekiten diozue',
        haiek: 'ekiten diote',
      },
      past: {
        ni: 'ekin nion',
        zu: 'ekin zenion',
        hura: 'ekin zion',
        gu: 'ekin genion',
        zuek: 'ekin zenioten',
        haiek: 'ekin zioten',
      },
      future: {
        ni: 'ekingo diot',
        zu: 'ekingo diozu',
        hura: 'ekingo dio',
        gu: 'ekingo diogu',
        zuek: 'ekingo diozue',
        haiek: 'ekingo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik lanari ___.', validFor: [] },
        zu: { text: 'Zuk lanari ___?', validFor: [] },
        hura: { text: 'Hark lanari ___.', validFor: [] },
        gu: { text: 'Guk lanari ___.', validFor: [] },
        zuek: { text: 'Zuek lanari ___?', validFor: [] },
        haiek: { text: 'Haiek lanari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lanari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lanari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean lanari ___.', validFor: [] },
        gu: { text: 'Guk iaz lanari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun lanari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lanari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'erantzun',
    verb: 'erantzun',
    meaning: { en: 'to answer (someone/something)', es: 'responder (a alguien/algo)', eu: 'erantzun' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'erantzuten diot',
        zu: 'erantzuten diozu',
        hura: 'erantzuten dio',
        gu: 'erantzuten diogu',
        zuek: 'erantzuten diozue',
        haiek: 'erantzuten diote',
      },
      past: {
        ni: 'erantzun nion',
        zu: 'erantzun zenion',
        hura: 'erantzun zion',
        gu: 'erantzun genion',
        zuek: 'erantzun zenioten',
        haiek: 'erantzun zioten',
      },
      future: {
        ni: 'erantzungo diot',
        zu: 'erantzungo diozu',
        hura: 'erantzungo dio',
        gu: 'erantzungo diogu',
        zuek: 'erantzungo diozue',
        haiek: 'erantzungo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik galderari ___.', validFor: [] },
        zu: { text: 'Zuk galderari ___?', validFor: [] },
        hura: { text: 'Hark galderari ___.', validFor: [] },
        gu: { text: 'Guk galderari ___.', validFor: [] },
        zuek: { text: 'Zuek galderari ___?', validFor: [] },
        haiek: { text: 'Haiek galderari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo galderari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun galderari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean galderari ___.', validFor: [] },
        gu: { text: 'Guk iaz galderari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun galderari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean galderari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'deitu',
    verb: 'deitu',
    meaning: { en: 'to call (someone)', es: 'llamar (a alguien)', eu: 'deitu' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'deitzen diot',
        zu: 'deitzen diozu',
        hura: 'deitzen dio',
        gu: 'deitzen diogu',
        zuek: 'deitzen diozue',
        haiek: 'deitzen diote',
      },
      past: {
        ni: 'deitu nion',
        zu: 'deitu zenion',
        hura: 'deitu zion',
        gu: 'deitu genion',
        zuek: 'deitu zenioten',
        haiek: 'deitu zioten',
      },
      future: {
        ni: 'deituko diot',
        zu: 'deituko diozu',
        hura: 'deituko dio',
        gu: 'deituko diogu',
        zuek: 'deituko diozue',
        haiek: 'deituko diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik lagunari ___.', validFor: [] },
        zu: { text: 'Zuk lagunari ___?', validFor: [] },
        hura: { text: 'Hark lagunari ___.', validFor: [] },
        gu: { text: 'Guk lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek lagunari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lagunari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lagunari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean lagunari ___.', validFor: [] },
        gu: { text: 'Guk iaz lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lagunari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'eragin',
    verb: 'eragin',
    meaning: { en: 'to cause/induce (something) in (someone)', es: 'provocar (algo) en (alguien)', eu: 'eragin' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'eragiten diot',
        zu: 'eragiten diozu',
        hura: 'eragiten dio',
        gu: 'eragiten diogu',
        zuek: 'eragiten diozue',
        haiek: 'eragiten diote',
      },
      past: {
        ni: 'eragin nion',
        zu: 'eragin zenion',
        hura: 'eragin zion',
        gu: 'eragin genion',
        zuek: 'eragin zenioten',
        haiek: 'eragin zioten',
      },
      future: {
        ni: 'eragingo diot',
        zu: 'eragingo diozu',
        hura: 'eragingo dio',
        gu: 'eragingo diogu',
        zuek: 'eragingo diozue',
        haiek: 'eragingo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik lagunari barre ___.', validFor: [] },
        zu: { text: 'Zuk lagunari barre ___?', validFor: [] },
        hura: { text: 'Hark lagunari barre ___.', validFor: [] },
        gu: { text: 'Guk lagunari barre ___.', validFor: [] },
        zuek: { text: 'Zuek lagunari barre ___?', validFor: [] },
        haiek: { text: 'Haiek lagunari barre ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lagunari barre ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lagunari barre ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean lagunari barre ___.', validFor: [] },
        gu: { text: 'Guk iaz lagunari barre ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun lagunari barre ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lagunari barre ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'antzeman',
    verb: 'antzeman',
    meaning: { en: 'to notice/perceive (something)', es: 'percibir/notar (algo)', eu: 'antzeman' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'antzematen diot',
        zu: 'antzematen diozu',
        hura: 'antzematen dio',
        gu: 'antzematen diogu',
        zuek: 'antzematen diozue',
        haiek: 'antzematen diote',
      },
      past: {
        ni: 'antzeman nion',
        zu: 'antzeman zenion',
        hura: 'antzeman zion',
        gu: 'antzeman genion',
        zuek: 'antzeman zenioten',
        haiek: 'antzeman zioten',
      },
      future: {
        ni: 'antzemango diot',
        zu: 'antzemango diozu',
        hura: 'antzemango dio',
        gu: 'antzemango diogu',
        zuek: 'antzemango diozue',
        haiek: 'antzemango diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik zerbaiti ___.', validFor: [] },
        zu: { text: 'Zuk zerbaiti ___?', validFor: [] },
        hura: { text: 'Hark zerbaiti ___.', validFor: [] },
        gu: { text: 'Guk zerbaiti ___.', validFor: [] },
        zuek: { text: 'Zuek zerbaiti ___?', validFor: [] },
        haiek: { text: 'Haiek zerbaiti ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo zerbaiti ___.', validFor: [] },
        zu: { text: 'Zuk herenegun zerbaiti ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean zerbaiti ___.', validFor: [] },
        gu: { text: 'Guk iaz zerbaiti ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun zerbaiti ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean zerbaiti ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  // Dative `egin` compounds (deferred from #306 — same `egin`-as-light-verb
  // shape, but the noun itself selects a dative NORI rather than a plain
  // NORK-only object, so these belong with #307's covert-dative set instead).
  {
    id: 'mesede-egin',
    verb: 'mesede egin',
    meaning: { en: 'to do a favor (for someone)', es: 'hacer un favor (a alguien)', eu: 'mesede egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'mesede egiten diot',
        zu: 'mesede egiten diozu',
        hura: 'mesede egiten dio',
        gu: 'mesede egiten diogu',
        zuek: 'mesede egiten diozue',
        haiek: 'mesede egiten diote',
      },
      past: {
        ni: 'mesede egin nion',
        zu: 'mesede egin zenion',
        hura: 'mesede egin zion',
        gu: 'mesede egin genion',
        zuek: 'mesede egin zenioten',
        haiek: 'mesede egin zioten',
      },
      future: {
        ni: 'mesede egingo diot',
        zu: 'mesede egingo diozu',
        hura: 'mesede egingo dio',
        gu: 'mesede egingo diogu',
        zuek: 'mesede egingo diozue',
        haiek: 'mesede egingo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik lagunari ___.', validFor: [] },
        zu: { text: 'Zuk lagunari ___?', validFor: [] },
        hura: { text: 'Hark lagunari ___.', validFor: [] },
        gu: { text: 'Guk lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek lagunari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo lagunari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun lagunari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean lagunari ___.', validFor: [] },
        gu: { text: 'Guk iaz lagunari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun lagunari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean lagunari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'kalte-egin',
    verb: 'kalte egin',
    meaning: { en: 'to harm (someone)', es: 'hacer daño (a alguien)', eu: 'kalte egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'kalte egiten diot',
        zu: 'kalte egiten diozu',
        hura: 'kalte egiten dio',
        gu: 'kalte egiten diogu',
        zuek: 'kalte egiten diozue',
        haiek: 'kalte egiten diote',
      },
      past: {
        ni: 'kalte egin nion',
        zu: 'kalte egin zenion',
        hura: 'kalte egin zion',
        gu: 'kalte egin genion',
        zuek: 'kalte egin zenioten',
        haiek: 'kalte egin zioten',
      },
      future: {
        ni: 'kalte egingo diot',
        zu: 'kalte egingo diozu',
        hura: 'kalte egingo dio',
        gu: 'kalte egingo diogu',
        zuek: 'kalte egingo diozue',
        haiek: 'kalte egingo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik etsaiari ___.', validFor: [] },
        zu: { text: 'Zuk etsaiari ___?', validFor: [] },
        hura: { text: 'Hark etsaiari ___.', validFor: [] },
        gu: { text: 'Guk etsaiari ___.', validFor: [] },
        zuek: { text: 'Zuek etsaiari ___?', validFor: [] },
        haiek: { text: 'Haiek etsaiari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo etsaiari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun etsaiari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean etsaiari ___.', validFor: [] },
        gu: { text: 'Guk iaz etsaiari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun etsaiari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean etsaiari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
  },
  {
    id: 'aurre-egin',
    verb: 'aurre egin',
    meaning: { en: 'to face/confront (something)', es: 'hacer frente (a algo)', eu: 'aurre egin' },
    type: 'periphrastic',
    agreement: ['nor', 'nori', 'nork'],
    recipient: 'hura',
    dialect: 'batua',
    conjugations: {
      present: {
        ni: 'aurre egiten diot',
        zu: 'aurre egiten diozu',
        hura: 'aurre egiten dio',
        gu: 'aurre egiten diogu',
        zuek: 'aurre egiten diozue',
        haiek: 'aurre egiten diote',
      },
      past: {
        ni: 'aurre egin nion',
        zu: 'aurre egin zenion',
        hura: 'aurre egin zion',
        gu: 'aurre egin genion',
        zuek: 'aurre egin zenioten',
        haiek: 'aurre egin zioten',
      },
      future: {
        ni: 'aurre egingo diot',
        zu: 'aurre egingo diozu',
        hura: 'aurre egingo dio',
        gu: 'aurre egingo diogu',
        zuek: 'aurre egingo diozue',
        haiek: 'aurre egingo diote',
      },
    },
    sentences: {
      present: {
        ni: { text: 'Nik arazoari ___.', validFor: [] },
        zu: { text: 'Zuk arazoari ___?', validFor: [] },
        hura: { text: 'Hark arazoari ___.', validFor: [] },
        gu: { text: 'Guk arazoari ___.', validFor: [] },
        zuek: { text: 'Zuek arazoari ___?', validFor: [] },
        haiek: { text: 'Haiek arazoari ___.', validFor: [] },
      },
      past: {
        ni: { text: 'Nik atzo arazoari ___.', validFor: [] },
        zu: { text: 'Zuk herenegun arazoari ___?', validFor: [] },
        hura: { text: 'Hark lehengo astean arazoari ___.', validFor: [] },
        gu: { text: 'Guk iaz arazoari ___.', validFor: [] },
        zuek: { text: 'Zuek duela bi egun arazoari ___?', validFor: [] },
        haiek: { text: 'Haiek joan den astean arazoari ___.', validFor: [] },
      },
    },
    pronouns: { ni: 'Nik', zu: 'Zuk', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
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

// #313: same reuse-by-reference idea, one level down — a verb with both a
// `futurePlural` table and existing `presentPlural` sentences gets
// `sentences.futurePlural` aliased from `presentPlural` for the same reason
// as the loop above (the blank doesn't care whether the plural-object
// drill is present or future tense).
for (const verb of VERBS) {
  if (!verb.conjugations.futurePlural) continue
  if (verb.sentences?.presentPlural) verb.sentences.futurePlural = verb.sentences.presentPlural
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
  presentPerfect: { labelKey: 'tensePresentPerfect', basque: 'lehenaldiko burutua' },
  // Unit 21/22: imperfective/habitual past — `habitualPast` is the general
  // periphrastic rule (participle + past auxiliary, e.g. `ikusten nuen`);
  // `imperfectivePast` is the native synthetic exception specific to
  // motion verbs (`nindoan`, `zetorren`, `nenbilen`).
  habitualPast: { labelKey: 'tenseHabitualPast', basque: 'lehen burutugabea' },
  imperfectivePast: { labelKey: 'tenseImperfectivePast', basque: 'lehen burutugabea (mugimendua)' },
  // #346: `ukan`'s real 2D NOR-NORK table (`{ [nork]: { [nor]: form } }`,
  // see the `object`-vs-2D note near the top of this file) — `nor` varies
  // (the object) instead of the usual `nork` (the subject). A separate tense
  // key from `present` rather than a reshaping of it, so every existing
  // `present`-keyed lesson/test is untouched.
  presentByObject: { labelKey: 'tensePresentByObject', basque: 'oraina (objektuka)' },
  // #347: `past`'s sibling 2D table, same rationale as `presentByObject`.
  pastByObject: { labelKey: 'tensePastByObject', basque: 'lehenaldia (objektuka)' },
  // #358: `gustatu`/`iruditu`/`ahaztu`'s real 2D NOR-NORI table — the
  // NORI-NOR mirror of `presentByObject`/`pastByObject` above. `nori` is
  // these verbs' usual varying axis (untouched); `nor` is the new one.
  presentByNor: { labelKey: 'tensePresentByNor', basque: 'oraina (nor-ka)' },
  pastByNor: { labelKey: 'tensePastByNor', basque: 'lehenaldia (nor-ka)' },
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
