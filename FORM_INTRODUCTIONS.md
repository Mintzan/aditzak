# Form Introductions Validation

This document explains how to validate that all grammatical forms are introduced in a pedagogically sound order.

## Quick Start

**Check what forms are missing from the curriculum:**
```bash
node src/validateCompleteCoverage.js
```

**Export all forms as CSV (for spreadsheet analysis):**
```bash
node src/exportFormInventory.js csv > form-inventory.csv
```

**Get a complete JSON export:**
```bash
node src/exportFormInventory.js json
```

## Tools

### 1. Complete Coverage Validation
Check if ALL possible forms (defined in VERBS) are taught somewhere:

```bash
node src/validateCompleteCoverage.js
```

**Output includes:**
- ✅ Forms covered in curriculum vs. total possible
- ❌ List of forms NOT covered (organized by verb/tense)
- 📊 Complete inventory of all forms with coverage status
- 📈 Summary showing which verbs have most gaps

**Current Status:**
- ✅ **2,500 total possible forms**
- ✅ **2,326 forms covered** (93.0% coverage)
- ❌ **174 forms NOT covered** (7.0% gap)

**Known gaps** (by priority):
1. **Dative/conditional axes** for psych verbs (gustatu, iruditu, ahaztu, jarraitu)
   - These are newer tenses/axes with limited curriculum time
2. **Plural forms** for some verbs (ahaztu, gustatu, nahi, jakin)
3. **maite** verb (completely uncovered) — planned for later curriculum phase
4. **The `hi` person** — rarely used in modern Basque, only 6 gaps
5. **behar past** — defined but not yet drilled

### 2. Curriculum Form Validation
Run the comprehensive validation report of introduced forms:

```bash
node src/validateFormIntroductions.js
```

**Output includes:**
- ✅ Verification that no form is used before introduction
- 📋 Timeline of when each form (verb + tense + person) is first introduced
- ⚠️  Pedagogical warnings (e.g., plural forms before all singular forms)
- ℹ️  Notes about large gaps between related forms
- 📊 Summary statistics

**Current Status:**
- ✅ **0 violations**: All forms introduced before use
- ⚠️ **115 pedagogical warnings**: Mostly about axis lessons where plural forms appear before final singular forms
- Total: 2,982 taught forms across 342 lessons

### 3. Export Complete Form Inventory

Export all forms with coverage status as CSV or JSON:

```bash
# CSV format (for spreadsheet analysis)
node src/exportFormInventory.js csv

# JSON format (for programmatic use)
node src/exportFormInventory.js json
```

These generate `form-inventory.csv` and `form-inventory.json` containing all 2,500 possible forms with a "Covered" column showing YES/NO.

**Use cases:**
- Identify exactly which forms need to be added to lessons
- Plan the next curriculum unit
- Verify completeness after lesson additions

### 4. Helper Module
Use the `formIntroductions` module to query form introduction data in code:

```javascript
import {
  getFormIntroduction,           // When was a specific form introduced?
  getFormIntroductionsForTense,  // All forms for a verb+tense
  getFormIntroductionsForVerb,   // All forms for a verb across tenses
  isFormIntroducedBy,            // Check if form is available by lesson N
  getFormStatistics,             // Overall stats
  getCompleteCoverageStatus,     // Which forms are NOT covered?
} from './formIntroductions.js'

// Example: When is "ni" form of "izan" present first introduced?
const intro = getFormIntroduction('izan', 'present', 'ni')
console.log(`Lesson ${intro.lessonIdx}: ${intro.lessonId}`)

// Example: What's the introduction sequence for "ukan" present?
const forms = getFormIntroductionsForTense('ukan', 'present')
forms.forEach(f => console.log(`  ${f.person}: Lesson ${f.lessonIdx} (${f.lessonId})`))

// Example: Is "joan" future available by lesson 50?
const isAvailable = isFormIntroducedBy('joan', 'future', 'hura', 50)

// Example: Get coverage status and identify gaps
const coverage = getCompleteCoverageStatus()
console.log(`${coverage.coveredForms}/${coverage.allForms} forms covered`)
coverage.uncoveredForms.forEach(f => {
  console.log(`  Missing: ${f.verbId} ${f.tense} ${f.person}`)
})
```

### 5. Journey Tests
The journey validation tests also check form introductions:

```bash
npm test -- journey.test.js
```

Tests verify:
- ✅ No form is used before introduction (0 violations currently)
- ✅ All VERBS conjugations are accounted for in curriculum (some gaps expected)
- ✅ Pedagogical ordering concerns (logged to console for review)

## Pedagogical Ordering

The current curriculum follows these principles:

1. **Singular before plural**: Forms for `ni`/`zu`/`hura` are generally introduced before `gu`/`zuek`/`haiek`
   - Exception: Some axis-based lessons have plural first

2. **Consistent tense sequences**: For each verb, typically ordered: `present` → `past` → `future` → other tenses

3. **Verb-specific patterns**:
   - Auxiliaries (`izan`, `ukan`) introduced early
   - Periphrastic verbs (`joan`, `ikusi`) follow shortly
   - Content verbs pooled together later

## Known Issues / Warnings

The validation reports 115 pedagogical warnings, mostly in these patterns:

1. **Axis lessons** (object-axis, baldintza-axis, conditional, etc.):
   - Lessons for `ni` or `zu` persons are split across multiple reviews
   - Plural forms sometimes appear before all singular forms close together

2. **Large gaps**:
   - Some imperatives have 100+ lesson gaps between person variants
   - This is typically acceptable since learners revisit verbs often

## Adding New Lessons

When adding lessons to the curriculum:

1. Run the validation script to ensure no violations:
   ```bash
   node src/validateFormIntroductions.js
   ```

2. Review the pedagogical warnings — while not failures, they indicate ordering worth reconsidering

3. Ensure singular forms generally come before plural for new verbs

4. Consider cross-verb consistency: if `verb-A`'s `ni` form appears in lesson 10, don't introduce `verb-B`'s `gu` form in lesson 5 if possible

## Architecture

### How It Works

1. **Caching**: Form introduction data is built once on first query and cached
2. **Form key**: Unique identifier is `{verbId}-{tense}-{person}`
3. **Introduction point**: Tracked as `{ lessonIdx, lessonId }` — the first lesson where a form appears
4. **Person restrictions**: Lessons with `persons` filters only count those persons as "introduced"

### Files

- `src/validateFormIntroductions.js` — CLI validation script
- `src/formIntroductions.js` — Query module for use in code
- `src/journey.test.js` — Integration tests (include form ordering checks)
- `src/data/lessons.js` — Curriculum data (source of form usage)
- `src/data/verbs.js` — Verb conjugation tables
