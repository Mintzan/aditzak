#!/usr/bin/env node

/**
 * audit-conjugations.mjs
 *
 * Validates that all conjugations documented in CONJUGATIONS.md
 * are available in verbs.js. Generates a report of gaps for task creation.
 */

import { CONJUGATION_COVERAGE } from '../docs/CONJUGATION_COVERAGE.js';
import { VERBS } from '../src/data/verbs.js';

const TENSE_MAPPING = {
  // Map canonical tense names to verbs.js keys
  orainaldia: 'present',
  lehenaldia: 'past',
  baldintza: 'baldintza',
  ondorioa_present: 'conditional',
  ondorioa_past: 'conditionalPast',
  ahalera_orainaldia: 'potential',
  ahalera_alegiazkoa: 'potentialAlegiazkoa',
  ahalera_lehenaldia: 'potentialLehena',
  subjuntiboa_orainaldia: 'subjunctivePresent',
  subjuntiboa_lehenaldia: 'subjunctivePast',
  agintera: 'imperative',

  // Special cases
  orainaldia_plural: 'presentPlural',
  lehenaldia_plural: 'pastPlural',

  // Archaic/special
  orainaldia_archaic: 'present_archaic',
};

function findVerbInVerbs(verbId) {
  return VERBS.find(v => v.id === verbId);
}

function hasTense(verb, tense) {
  // Check if verb has conjugation data for the tense
  if (!verb.conjugations) return false;

  // Handle tense aliases
  const tensePath = tense.split('_')[0]; // e.g., 'ondorioa_past' -> 'ondorioa'
  return verb.conjugations[tensePath] !== undefined ||
         verb.conjugations[TENSE_MAPPING[tense]] !== undefined ||
         verb.conjugations[tense] !== undefined;
}

function getConjugationData(verb, tense) {
  // Get conjugation object for tense
  if (verb.conjugations[tense]) return verb.conjugations[tense];
  if (verb.conjugations[TENSE_MAPPING[tense]]) return verb.conjugations[TENSE_MAPPING[tense]];

  // Try base tense (e.g., 'ondorioa' for 'ondorioa_past')
  const baseTense = tense.split('_')[0];
  if (verb.conjugations[baseTense]) return verb.conjugations[baseTense];

  return null;
}

function hasAllPersons(conjugationData, expectedPersons) {
  if (!conjugationData) return false;
  if (typeof conjugationData !== 'object') return false;

  // For simple person-based conjugations
  return expectedPersons.every(person => conjugationData[person] !== undefined);
}

// Generate report
const report = {
  summary: {
    total_documented: 0,
    covered_in_verbs: 0,
    gaps: [],
  },
  by_verb: {},
};

for (const [verbId, coverage] of Object.entries(CONJUGATION_COVERAGE)) {
  const verb = findVerbInVerbs(verbId);
  const verb_report = {
    documented: true,
    in_verbs: verb ? true : false,
    tenses: {},
    missing_tenses: [],
  };

  if (!verb) {
    verb_report.missing_completely = true;
    report.summary.gaps.push({
      type: 'verb_missing',
      verb: verbId,
      reason: 'Verb not in verbs.js',
    });
  } else {
    for (const [tenseName, tenseData] of Object.entries(coverage.tenses)) {
      // Skip non-tabulated forms
      if (tenseData.documented === false) {
        verb_report.tenses[tenseName] = { documented: true, in_verbs: null, status: 'not_tabulated' };
        continue;
      }

      const has_tense = hasTense(verb, tenseName);
      verb_report.tenses[tenseName] = { documented: true, in_verbs: has_tense };

      if (!has_tense) {
        verb_report.missing_tenses.push(tenseName);
        report.summary.gaps.push({
          type: 'tense_missing',
          verb: verbId,
          tense: tenseName,
          note: tenseData.note || '',
        });
      } else if (tenseData.persons && !tenseData.nori_recipients) {
        // Check person coverage for simple tenses
        const conjugationData = getConjugationData(verb, tenseName);
        if (!hasAllPersons(conjugationData, tenseData.persons)) {
          report.summary.gaps.push({
            type: 'persons_incomplete',
            verb: verbId,
            tense: tenseName,
            expected: tenseData.persons,
            found: conjugationData ? Object.keys(conjugationData) : [],
          });
        }
      }
    }
  }

  report.by_verb[verbId] = verb_report;
}

// Print report
console.log('\n===============================================');
console.log('CONJUGATION COVERAGE AUDIT');
console.log('===============================================\n');

console.log(`Total documented verbs: ${Object.keys(CONJUGATION_COVERAGE).length}`);
console.log(`Verbs in verbs.js: ${Object.values(report.by_verb).filter(v => v.in_verbs).length}`);
console.log(`Gaps found: ${report.summary.gaps.length}\n`);

if (report.summary.gaps.length > 0) {
  console.log('GAPS BY TYPE:\n');

  const by_type = {};
  for (const gap of report.summary.gaps) {
    if (!by_type[gap.type]) by_type[gap.type] = [];
    by_type[gap.type].push(gap);
  }

  for (const [type, gaps] of Object.entries(by_type)) {
    console.log(`${type} (${gaps.length}):`);
    for (const gap of gaps) {
      if (gap.type === 'verb_missing') {
        console.log(`  - ${gap.verb}`);
      } else if (gap.type === 'tense_missing') {
        console.log(`  - ${gap.verb}: ${gap.tense}${gap.note ? ` (${gap.note})` : ''}`);
      } else if (gap.type === 'persons_incomplete') {
        console.log(`  - ${gap.verb}/${gap.tense}: expected ${gap.expected.length} persons, found ${gap.found.length}`);
      }
    }
    console.log();
  }
}

console.log('\nDETAILED BY VERB:\n');
for (const [verbId, verb_report] of Object.entries(report.by_verb)) {
  if (verb_report.missing_completely) {
    console.log(`${verbId}: NOT IN verbs.js`);
  } else if (verb_report.missing_tenses.length > 0) {
    console.log(`${verbId}: Missing ${verb_report.missing_tenses.length} tenses`);
    for (const tense of verb_report.missing_tenses) {
      console.log(`  - ${tense}`);
    }
  } else {
    console.log(`${verbId}: ✓ Complete`);
  }
}

console.log('\n===============================================\n');
