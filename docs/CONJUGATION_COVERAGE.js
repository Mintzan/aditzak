/**
 * CONJUGATION_COVERAGE.js
 *
 * Structured reference of all conjugations documented in CONJUGATIONS.md
 * Used for validation against verbs.js to identify teaching gaps
 *
 * Format: verb -> agreement -> tenses -> persons/NORI combinations
 * 'documented': true means present in CONJUGATIONS.md
 * 'active': true means currently in verbs.js (to be verified)
 */

export const CONJUGATION_COVERAGE = {
  // §2: izan (foundational NOR-NORK auxiliary)
  izan: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§2',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      baldintza: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_present: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_past: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_alegiazkoa: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      agintera: {
        persons: ['hi', 'zu', 'zuek', 'hara', 'haiek'],
        documented: true,
        note: 'Imperative (no 1st person ni/gu)',
      },
    },
  },

  // §4: ukan (NOR-NORK transitive auxiliary)
  ukan: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§4',
    tenses: {
      orainaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      baldintza: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_present: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_past: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_orainaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_alegiazkoa: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_lehenaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_orainaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_lehenaldia: {
        variants: ['singular', 'plural'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      agintera: {
        variants: ['singular', 'plural'],
        persons: ['hi', 'zu', 'zuek', 'hara', 'haiek'],
        documented: true,
        note: 'Imperative',
      },
    },
  },

  // §3: ukan (NOR-NORI dative auxiliary)
  // Note: This is the same auxiliary as §4, but cross-referencing a NORI recipient
  // Included for completeness but likely not separate conjugations in verbs.js
  'ukan-nori': {
    type: 'synthetic',
    agreement: 'nor-nori',
    documented: true,
    section: '§3',
    note: 'Same auxiliary as nor-nork ukan, different agreement pattern',
    nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
    tenses: {
      orainaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      baldintza: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_present: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_past: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_orainaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_alegiazkoa: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_lehenaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_orainaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_lehenaldia: {
        nori_recipients: ['niri', 'hiri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      agintera: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuei', 'haiei'],
        persons: ['hi', 'zu', 'zuek', 'hara', 'haiek'],
        documented: true,
        note: 'Imperative',
      },
    },
  },

  // §5: ukan (NOR-NORI-NORK ditransitive auxiliary)
  'ukan-nori-nork': {
    type: 'synthetic',
    agreement: 'nor-nori-nork',
    documented: true,
    section: '§5',
    note: 'Ditransitive auxiliary, same stem as nor-nork ukan',
    nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
    object_variants: ['singular', 'plural'],
    tenses: {
      baldintza: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_present: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      ondorioa_past: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_orainaldia: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_alegiazkoa: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      ahalera_lehenaldia: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_orainaldia: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      subjuntiboa_lehenaldia: {
        nori_recipients: ['niri', 'hari', 'guri', 'zuri', 'zuei', 'haiei'],
        object_variants: ['singular', 'plural'],
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: false,
        note: 'Morphologically derivable but not tabulated: forms vanishingly rare/unverifiable',
      },
      agintera: {
        nori_recipients: ['niri', 'hari', 'guri', 'haiei'],
        object_variants: ['singular', 'plural'],
        addressees: ['zuk', 'zuek', 'hik', 'haiek'],
        documented: true,
        note: 'Imperative (2nd/3rd person addressee only)',
      },
    },
  },

  // §6: nor verbs (synthetic, intransitive)
  egon: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  joan: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  etorri: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      'nori-orainaldia': {
        nori_recipients: ['niri', 'zuri', 'guri'],
        object_variants: ['singular'],
        persons: ['ni', 'zu', 'gu'],
        documented: true,
        note: 'NOR-NORI dative forms (present only, confirmed forms)',
      },
      'nori-lehenaldia': {
        nori_recipients: ['niri', 'hari'],
        object_variants: ['singular'],
        persons: ['zu', 'hura'],
        documented: true,
        note: 'NOR-NORI dative forms (past only, confirmed forms)',
      },
    },
  },

  ibili: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  ihardun: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  mintzatu: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§6',
    note: 'Literary/Northern paradigm',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  // §7: nor-nork verbs (synthetic, transitive)
  jakin: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§7',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      orainaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms (tza- infix)',
      },
      lehenaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
    },
  },

  ekarri: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§7',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      orainaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
      lehenaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
    },
  },

  eduki: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§7',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      orainaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
      lehenaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
    },
  },

  erabili: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§7',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  eraman: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§7',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      orainaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
      lehenaldia_plural: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
        note: 'Plural object forms',
      },
    },
  },

  // §8: Other verbs
  iraun: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§8',
    note: 'Unergative (nork-only, absolutive is implicit/fixed)',
    tenses: {
      orainaldia: {
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  jario: {
    type: 'synthetic',
    agreement: 'nor-nori',
    documented: true,
    section: '§8',
    note: 'Defective, effectively fixed NOR',
    tenses: {
      orainaldia: {
        nori_recipients: ['hiri', 'hari'],
        documented: true,
      },
      lehenaldia: {
        nori_recipients: ['hiri', 'hari'],
        documented: true,
      },
    },
  },

  esan: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§8',
    note: 'Archaic synthetic forms only (diot, dio); modern usage is periphrastic',
    tenses: {
      orainaldia_archaic: {
        persons: ['ni', 'zu', 'hura'],
        documented: true,
        note: 'Archaic finite forms (diot, diozun, dio)',
      },
    },
  },

  irudi: {
    type: 'synthetic',
    agreement: 'nor-nork',
    documented: true,
    section: '§8',
    note: 'Unergative (nork-only)',
    tenses: {
      orainaldia: {
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['nik', 'hik', 'hark', 'guk', 'zuk', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },

  etzan: {
    type: 'synthetic',
    agreement: 'nor',
    documented: true,
    section: '§8',
    note: 'Rare, limited use (to lie in / consist of)',
    tenses: {
      orainaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
      lehenaldia: {
        persons: ['ni', 'hi', 'hura', 'gu', 'zu', 'zuek', 'haiek'],
        documented: true,
      },
    },
  },
};

/**
 * Summary statistics
 */
export const COVERAGE_STATS = {
  total_verbs: Object.keys(CONJUGATION_COVERAGE).length,
  nor_verbs: ['egon', 'joan', 'etorri', 'ibili', 'ihardun', 'mintzatu', 'etzan'].length,
  'nor-nork_verbs': ['izan', 'ukan', 'jakin', 'ekarri', 'eduki', 'erabili', 'eraman', 'iraun', 'esan', 'irudi'].length,
  'nor-nori_verbs': ['ukan-nori', 'jario'].length,
  'nor-nori-nork_verbs': ['ukan-nori-nork'].length,
  note: 'Run validation against verbs.js to identify teaching gaps',
};
