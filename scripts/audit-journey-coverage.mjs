#!/usr/bin/env node

/**
 * audit-journey-coverage.mjs
 *
 * Identifies which conjugations documented in CONJUGATIONS.md are NOT yet
 * in the learning journey (verbs.js + lessons.js). Outputs gaps organized
 * for GitHub issue creation.
 */

import { CONJUGATION_COVERAGE } from '../docs/CONJUGATION_COVERAGE.js';
import { VERBS } from '../src/data/verbs.js';
import { LESSONS } from '../src/data/lessons.js';

const TENSE_MAPPING = {
  // Map canonical tense names to verbs.js keys
  orainaldia: 'present',
  lehenaldia: 'past',
  baldintza: 'baldintza',
  ondorioa_present: 'conditional',
  ondorioa_past: 'conditionalPast',
  ahalera_orainaldia: 'potential',
  ahalera_alegiazkoa: 'potentialAlegiazkoa',
  ahalera_lehenaldia: 'potentialLehenaldia',
  subjuntiboa_orainaldia: 'subjunctivePresent',
  subjuntiboa_lehenaldia: 'subjunctivePast',
  agintera: 'imperative',

  // Special cases
  orainaldia_plural: 'presentPlural',
  lehenaldia_plural: 'pastPlural',

  // Archaic/special
  orainaldia_archaic: 'present_archaic',
};

// Collect all tenses taught in lessons
const taught_tenses = new Set();
for (const lesson of LESSONS) {
  if (lesson.verbId && lesson.tense) {
    const key = `${lesson.verbId}:${lesson.tense}`;
    taught_tenses.add(key);
  }
  if (lesson.sources) {
    for (const source of lesson.sources) {
      if (source.verbId && source.tense) {
        const key = `${source.verbId}:${source.tense}`;
        taught_tenses.add(key);
      }
    }
  }
}

// Find gaps
const gaps = {
  completely_missing_verbs: [],
  partially_missing_tenses: [],
};

for (const [verbId, coverage] of Object.entries(CONJUGATION_COVERAGE)) {
  const verb = VERBS.find(v => v.id === verbId);

  // Skip special cases (ukan-nori, etc.)
  if (verbId.includes('-')) {
    continue;
  }

  if (!verb) {
    gaps.completely_missing_verbs.push({
      verb: verbId,
      agreement: coverage.agreement,
      section: coverage.section,
      note: coverage.note || '',
    });
  } else {
    // Check which tenses are missing from lessons
    for (const [tenseName, tenseData] of Object.entries(coverage.tenses)) {
      // Skip non-tabulated forms
      if (tenseData.documented === false) continue;

      // Map to verbs.js key
      const verbsjs_tense = TENSE_MAPPING[tenseName] || tenseName;
      const key = `${verbId}:${verbsjs_tense}`;

      // Check if this tense is taught
      if (!taught_tenses.has(key) && verb.conjugations?.[verbsjs_tense]) {
        gaps.partially_missing_tenses.push({
          verb: verbId,
          tense: tenseName,
          in_verbs: true,
          in_lessons: false,
          note: tenseData.note || '',
        });
      }
    }
  }
}

// Sort and categorize gaps by priority
const by_priority = {
  foundational: [],
  common: [],
  niche: [],
};

for (const gap of gaps.completely_missing_verbs) {
  if (['izan', 'ukan'].includes(gap.verb)) {
    by_priority.foundational.push(gap);
  } else if (['jakin', 'ekarri', 'eduki', 'eraman'].includes(gap.verb)) {
    by_priority.common.push(gap);
  } else {
    by_priority.niche.push(gap);
  }
}

for (const gap of gaps.partially_missing_tenses) {
  if (['izan', 'ukan'].includes(gap.verb)) {
    by_priority.foundational.push(gap);
  } else if (['jakin', 'ekarri', 'eduki', 'eraman', 'etorri'].includes(gap.verb)) {
    by_priority.common.push(gap);
  } else {
    by_priority.niche.push(gap);
  }
}

// Print report
console.log('\n===============================================');
console.log('JOURNEY COVERAGE AUDIT');
console.log('===============================================\n');

console.log(`Verbs completely missing from app: ${gaps.completely_missing_verbs.length}`);
console.log(`Tenses in verbs.js but not taught: ${gaps.partially_missing_tenses.length}\n`);

// Output JSON for issue generation
const issues = [];

// Group by verb for issue creation
const by_verb = {};
for (const gap of [...gaps.completely_missing_verbs, ...gaps.partially_missing_tenses]) {
  if (!by_verb[gap.verb]) {
    by_verb[gap.verb] = [];
  }
  by_verb[gap.verb].push(gap);
}

for (const [verb, gaps_for_verb] of Object.entries(by_verb)) {
  const tenses = gaps_for_verb.map(g => g.tense || 'ALL').join(', ');
  issues.push({
    verb,
    tenses,
    count: gaps_for_verb.length,
    gaps: gaps_for_verb,
  });
}

console.log('ISSUES TO CREATE:\n');

const foundational_issues = issues.filter(i => ['izan', 'ukan'].includes(i.verb));
const common_issues = issues.filter(i => ['jakin', 'ekarri', 'eduki', 'eraman', 'etorri', 'jario'].includes(i.verb));
const other_issues = issues.filter(i => !['izan', 'ukan', 'jakin', 'ekarri', 'eduki', 'eraman', 'etorri', 'jario'].includes(i.verb));

console.log('HIGH PRIORITY (Foundational):');
for (const issue of foundational_issues) {
  console.log(`  ${issue.verb}: ${issue.tenses} (${issue.count} gaps)`);
}

console.log('\nMEDIUM PRIORITY (Common verbs):');
for (const issue of common_issues) {
  console.log(`  ${issue.verb}: ${issue.tenses} (${issue.count} gaps)`);
}

console.log('\nLOWER PRIORITY (Niche/Rare):');
for (const issue of other_issues) {
  console.log(`  ${issue.verb}: ${issue.tenses} (${issue.count} gaps)`);
}

// Export for programmatic use
console.log('\n===============================================\n');
console.log('JSON OUTPUT FOR ISSUE CREATION:');
console.log(JSON.stringify(issues, null, 2));
