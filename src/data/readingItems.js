// `READING_ITEMS` backs Unit 36's `kind: 'reading'` lesson (see
// `generateReadingQuestions` in `lessonLogic.js`) — short comprehension
// questions over real sentences rather than conjugation drills. Each item is
// a `{ source, gloss, prompt, options, answer }`:
//   - `source`: the Basque sentence the learner reads.
//   - `gloss`: `{ en, es, eu }` translation/restatement of `source`, shown
//     under it as a comprehension aid. `gloss.eu` deliberately repeats
//     `source` verbatim (a Basque-speaking learner needs no translation) —
//     `QuestionPrompt` skips rendering the gloss line when it matches
//     `source`.
//   - `prompt`: `{ en, es, eu }` the actual comprehension question.
//   - `options`/`answer`: four candidate Basque sentences, one of which
//     (`answer`) correctly answers `prompt` about `source`.
//
// Content is grounded in `docs/CONJUGATIONS.md` §15 ("Passive & impersonal
// voice — the 'nor-shift'"): items 1-8 take a `nor-nork` sentence and ask for
// its agentless `nor`-shifted counterpart (anticausative for change-of-state
// verbs like `ireki`/`hautsi`/`itzali`/`piztu`/`itxi`, impersonal/passive for
// `hitz egin`/`erre`/`idatzi`); items 9-10 go the other way, starting from an
// agentless sentence and asking who's understood to be doing it. §14's
// non-finite forms are intentionally not covered here — see the issue filed
// for #145's deferred scope.
export const READING_ITEMS = [
  {
    id: 'reading-nor-shift-ireki',
    source: 'Nik atea ireki dut.',
    gloss: {
      en: 'I opened the door.',
      es: 'Yo abrí la puerta.',
      eu: 'Nik atea ireki dut.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Atea ireki da.', 'Nik atea ireki dut.', 'Atea ireki dute.', 'Atea irekitzen da.'],
    answer: 'Atea ireki da.',
  },
  {
    id: 'reading-nor-shift-hautsi',
    source: 'Haurrak leihoa hautsi du.',
    gloss: {
      en: 'The child broke the window.',
      es: 'El niño rompió la ventana.',
      eu: 'Haurrak leihoa hautsi du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Leihoa hautsi da.', 'Haurrak leihoa hautsi du.', 'Leihoa hausten du.', 'Leihoak haurra hautsi du.'],
    answer: 'Leihoa hautsi da.',
  },
  {
    id: 'reading-nor-shift-itzali',
    source: 'Norbaitek argia itzali du.',
    gloss: {
      en: 'Someone turned off the light.',
      es: 'Alguien apagó la luz.',
      eu: 'Norbaitek argia itzali du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Argia itzali da.', 'Norbaitek argia itzali du.', 'Argia itzaliko da.', 'Argiak itzali du.'],
    answer: 'Argia itzali da.',
  },
  {
    id: 'reading-impersonal-hitzegin',
    source: 'Guk euskaraz hitz egiten dugu.',
    gloss: {
      en: 'We speak in Basque.',
      es: 'Nosotros hablamos en euskera.',
      eu: 'Guk euskaraz hitz egiten dugu.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Euskaraz hitz egiten da.', 'Guk euskaraz hitz egiten dugu.', 'Euskaraz hitz egin dugu.', 'Euskara hitz egiten du.'],
    answer: 'Euskaraz hitz egiten da.',
  },
  {
    id: 'reading-impersonal-erre',
    source: 'Jendeak hemen erretzen du.',
    gloss: {
      en: 'People smoke here.',
      es: 'La gente fuma aquí.',
      eu: 'Jendeak hemen erretzen du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Hemen erretzen da.', 'Jendeak hemen erretzen du.', 'Hemen erre da.', 'Hemen erretzen dute.'],
    answer: 'Hemen erretzen da.',
  },
  {
    id: 'reading-nor-shift-piztu',
    source: 'Aitak sua piztu du.',
    gloss: {
      en: 'Dad lit the fire.',
      es: 'Papá encendió el fuego.',
      eu: 'Aitak sua piztu du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Sua piztu da.', 'Aitak sua piztu du.', 'Sua pizten da.', 'Suak aita piztu du.'],
    answer: 'Sua piztu da.',
  },
  {
    id: 'reading-nor-shift-itxi',
    source: 'Saltzaileak denda itxi du.',
    gloss: {
      en: 'The shopkeeper closed the store.',
      es: 'El vendedor cerró la tienda.',
      eu: 'Saltzaileak denda itxi du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Denda itxi da.', 'Saltzaileak denda itxi du.', 'Denda itxiko da.', 'Dendak saltzailea itxi du.'],
    answer: 'Denda itxi da.',
  },
  {
    id: 'reading-impersonal-idatzi',
    source: 'Idazleak liburua idatzi du.',
    gloss: {
      en: 'The writer wrote the book.',
      es: 'El escritor escribió el libro.',
      eu: 'Idazleak liburua idatzi du.',
    },
    prompt: {
      en: 'Which sentence says the same thing without naming who did it?',
      es: '¿Qué frase dice lo mismo sin nombrar quién lo hizo?',
      eu: 'Zein esaldik dio gauza bera, nork egin duen aipatu gabe?',
    },
    options: ['Liburua idatzi da.', 'Idazleak liburua idatzi du.', 'Liburua idazten du.', 'Liburuak idazlea idatzi du.'],
    answer: 'Liburua idatzi da.',
  },
  {
    id: 'reading-impersonal-irakurri',
    source: 'Eskolan liburu hau irakurtzen da.',
    gloss: {
      en: 'This book is read at school.',
      es: 'Este libro se lee en la escuela.',
      eu: 'Eskolan liburu hau irakurtzen da.',
    },
    prompt: {
      en: 'Which sentence names who does this?',
      es: '¿Qué frase nombra quién hace esto?',
      eu: 'Zein esaldik aipatzen du nork egiten duen hau?',
    },
    options: [
      'Ikasleek eskolan liburu hau irakurtzen dute.',
      'Eskolan liburu hau irakurtzen da.',
      'Liburu honek ikasleak irakurtzen ditu.',
      'Eskolan liburu hau irakurri da.',
    ],
    answer: 'Ikasleek eskolan liburu hau irakurtzen dute.',
  },
  {
    id: 'reading-impersonal-sagarrak',
    source: 'Sagarrak xehetu egiten dira.',
    gloss: {
      en: 'The apples get chopped.',
      es: 'Las manzanas se trituran.',
      eu: 'Sagarrak xehetu egiten dira.',
    },
    prompt: {
      en: 'Which sentence names who does this?',
      es: '¿Qué frase nombra quién hace esto?',
      eu: 'Zein esaldik aipatzen du nork egiten duen hau?',
    },
    options: [
      'Norbaitek sagarrak xehetu egiten ditu.',
      'Sagarrak xehetu egiten dira.',
      'Sagarrak norbait xehetu egiten du.',
      'Sagarrak xehetuko dira.',
    ],
    answer: 'Norbaitek sagarrak xehetu egiten ditu.',
  },
]
