# Form Introductions Validation

This document explains how to validate that all grammatical forms are introduced in a pedagogically sound order.

## Tools

### 1. Validation Script
Run the comprehensive validation report:

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
- Total: 2,982 unique forms across 342 lessons

### 2. Helper Module
Use the `formIntroductions` module to query form introduction data in code:

```javascript
import {
  getFormIntroduction,           // When was a specific form introduced?
  getFormIntroductionsForTense,  // All forms for a verb+tense
  getFormIntroductionsForVerb,   // All forms for a verb across tenses
  isFormIntroducedBy,            // Check if form is available by lesson N
  getFormStatistics,             // Overall stats
} from './formIntroductions.js'

// Example: When is "ni" form of "izan" present first introduced?
const intro = getFormIntroduction('izan', 'present', 'ni')
console.log(`Lesson ${intro.lessonIdx}: ${intro.lessonId}`)

// Example: What's the introduction sequence for "ukan" present?
const forms = getFormIntroductionsForTense('ukan', 'present')
forms.forEach(f => console.log(`  ${f.person}: Lesson ${f.lessonIdx} (${f.lessonId})`))

// Example: Is "joan" future available by lesson 50?
const isAvailable = isFormIntroducedBy('joan', 'future', 'hura', 50)
```

### 3. Journey Tests
The journey validation tests also check form introductions:

```bash
npm test -- journey.test.js
```

Tests verify:
- ✅ No form is used before introduction
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
