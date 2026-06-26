# Conjugation Tracking

Tools to track when conjugated forms (actual Basque words like "naiz", "dut", "gara") are introduced in the curriculum.

## Quick Start

**View all conjugations:**
```bash
cat conjugations-list.txt
```

**See when each form is introduced:**
```bash
node src/validateConjugationIntroductions.js
```

**Export with lesson context:**
```bash
node src/exportConjugations.js csv  # → conjugations-by-lesson.csv
node src/exportConjugations.js json # → conjugations-by-lesson.json
```

## Files

- **`conjugations-list.txt`** — All 4,284 Basque words, one per line, alphabetically sorted
- **`conjugations-by-lesson.csv`** — All forms with context (verb, tense, person, lesson)
- **`conjugations-by-lesson.json`** — Same data in structured format
- **`src/conjugationIntroductions.js`** — Query API for use in code
- **`src/validateConjugationIntroductions.js`** — Timeline and analysis tool
- **`src/exportConjugations.js`** — Generate CSV/JSON exports
- **`src/listAllConjugations.js`** — Generate clean conjugation list

## Query API

```javascript
import {
  getConjugationIntroduction,    // When is "naiz" introduced?
  getConjugationsForLesson,      // All words in a lesson?
  getConjugationsForVerb,        // All conjugations for verb+tense?
  isConjugationIntroducedBy,     // Is form available by lesson N?
  getSharedConjugations,         // Forms in multiple verbs/tenses?
  getAllConjugations,            // Complete list with timelines
} from './conjugationIntroductions.js'
```

## Current Data

- **4,284 conjugated forms** taught across all lessons
- **61 shared forms** (appearing in multiple verbs/tenses)
- **0 homonyms** (no confusing duplicates)
- **283 lessons** | **104 verbs** | **46 tenses**

## Examples

**When is "naiz" first introduced?**
```bash
grep "^naiz," conjugations-by-lesson.csv
```

**All forms from lesson 0:**
```bash
grep ",0," conjugations-by-lesson.csv
```

**Shared forms (appear in multiple verbs):**
```bash
grep ",YES$" conjugations-by-lesson.csv
```
