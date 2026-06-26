# Conjugation Introduction Tracking

This document explains how to track when conjugated forms (actual Basque words like "naiz", "dut", "gara") are introduced in the curriculum.

## Quick Start

**See when each conjugated form is first introduced:**
```bash
node src/validateConjugationIntroductions.js
```

**Export all conjugations with introduction points:**
```bash
node src/exportConjugations.js csv  # → conjugations-by-lesson.csv
node src/exportConjugations.js json # → conjugations-by-lesson.json
```

## Tools

### Conjugation Introduction Tracking

Track when actual conjugated forms (the Basque words) are introduced:

```bash
node src/validateConjugationIntroductions.js
```

**Output includes:**
- 📋 Timeline of all conjugated forms by first introduction (lesson order)
- 🔄 Shared conjugations (words appearing in multiple verbs/tenses)
- 📊 Summary statistics

**Current Status:**
- ✅ **4,284 conjugated forms taught**
- ✅ **61 shared conjugations** (e.g., "zaude" in both `egon` present and imperative)
- ✅ **0 homonyms** (same form with same person in different verbs)
- Lessons: 283 | Verbs: 104 | Tenses: 46

**Examples of conjugations:** "naiz" (I am), "dut" (I have), "gara" (we are), "zaude" (you are, present), "dago" (he is)

### Export Conjugations

Export all conjugations with introduction points:

```bash
# CSV format (for spreadsheet analysis)
node src/exportConjugations.js csv

# JSON format (for programmatic use)
node src/exportConjugations.js json
```

These generate `conjugations-by-lesson.csv` and `conjugations-by-lesson.json` containing all taught conjugations with lesson numbers.

**Use cases:**
- See exactly which Basque words learners encounter in each lesson
- Verify no form is taught twice in the same lesson
- Plan new lessons by checking which words are already introduced
- Identify shared forms that reinforce learning

### Helper Module

Use the `conjugationIntroductions` module to query when specific Basque words are introduced:

```javascript
import {
  getConjugationIntroduction,    // When is "naiz" introduced?
  getConjugationsForLesson,      // What words are in lesson X?
  getConjugationsForVerb,        // All conjugations for izan/present?
  isConjugationIntroducedBy,     // Is "naiz" available by lesson 50?
  getSharedConjugations,         // Which words appear in multiple verbs?
  getAllConjugations,            // Complete list with timelines
} from './conjugationIntroductions.js'

// Example: When is "naiz" first introduced?
const intro = getConjugationIntroduction('naiz')
console.log(`"naiz" in: ${intro.verbId}/${intro.tense}/${intro.person} (Lesson ${intro.lessonIdx})`)

// Example: What conjugations are in lesson 3?
const forms = getConjugationsForLesson('ukan-present')
console.log(forms) // ["dut", "duzu", "du", ...]

// Example: Find shared forms
const shared = getSharedConjugations()
for (const [form, sources] of shared) {
  console.log(`"${form}" appears in: ${sources.map(s => `${s.verbId}/${s.person}`).join(', ')}`)
}
```

## Key Insights

### Shared Conjugations

61 conjugations appear in multiple verbs/tenses:
- **"zaude"** (you are) — used in `egon` present AND imperative
- **"zoaz"** (you go) — used in `joan` present AND imperative
- **"zatoz"** (you come) — used in `etorri` present AND imperative

These are **pedagogically positive** — they reinforce learning through multiple contexts.

### Homonyms

**0 homonyms** (no confusing duplicates):
- No form taught with same person in different verbs
- Curriculum is clear on meaning and context

### Coverage

All 4,284 taught conjugations are authentic Basque words:
- Not abstract combinations
- Ready for real conversation and comprehension

## Architecture

### How It Works

1. **Form extraction**: Actual Basque word forms extracted from `VERBS.conjugations`
2. **Tracking**: First lesson where each form appears is recorded
3. **Shared forms**: Words appearing in multiple verb/tense combinations identified
4. **Caching**: Data built once and cached for fast queries

### Files

- `src/conjugationIntroductions.js` — Query module for use in code
- `src/validateConjugationIntroductions.js` — CLI audit script
- `src/exportConjugations.js` — CSV/JSON export generator
- `conjugations-by-lesson.csv` — Exported data (all 4,284 forms)
- `conjugations-by-lesson.json` — Exported data (structured)
