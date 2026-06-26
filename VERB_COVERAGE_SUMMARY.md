# Verb Coverage Summary

## Overview

Complete pedagogical coverage of Basque grammatical systems:
- **12 Aditz Trinkoak** (synthetic verbs) - all represented
- **3 Aditz Laguntzaileak** (auxiliary verb systems) - 100% covered
- **92 Aditz Perifrastikoak** (periphrastic verbs) - partial coverage

## Aditz Trinkoak (Synthetic Verbs)

**Complete inventory (12 verbs):**

| Verb | Agreement | Base Tenses | Total Tenses |
|------|-----------|-------------|--------------|
| ados-egon | nor | 2/2 | 3 |
| eduki | nor,nork | 4/4 | 6 |
| egon | nor | 2/2 | 4 |
| ekarri | nor,nork | 2/2 | 3 |
| eraman | nor,nork | 2/2 | 3 |
| etorri | nor | 2/2 | 7 |
| ibili | nor | 2/2 | 4 |
| izan | nor | 2/2 | 13 |
| jakin | nor,nork | 3/4 | 5 ⚠️ |
| jario | nor,nori | 2/2 | 2 |
| joan | nor | 2/2 | 6 |
| ukan | nor,nork | 4/4 | 22 |

**Base Tense Coverage:** 11/12 verbs complete (91.7%)
- Missing: jakin (presentPlural, pastPlural)

## Aditz Laguntzaileak (Auxiliary Verb Systems)

**100% Coverage** - Implemented through prefix composition:

✅ **Object-axis system (edun-based)**
- Marks transitive object agreement
- Used for verbs with nor,nork agreement

✅ **Dative system (dativeIzan-based)**
- Marks dative recipient/experiencer
- Used for psychological verbs with nor,nori agreement

✅ **Indirect object system (diot-based)**
- Marks both direct and indirect objects
- Used for ditransitive verbs with nor,nori,nork agreement

All three systems have present and past forms fully represented in curriculum.

## Aditz Perifrastikoak (Periphrastic Verbs)

**92 verbs** using auxiliary combinations:

By agreement type:
- **nor** (10) - intransitive
- **nor,nork** (59) - transitive
- **nor,nori** (4) - dative/experiencer
- **nor,nori,nork** (19) - ditransitive

See `VERBS_INVENTORY.txt` for complete list.

## Validation Tools

1. **`src/listAllVerbs.js`** - Generate verb inventory
2. **`src/analyzeTrinkokLaguntzaileak.js`** - Coverage report
3. **`src/findMissingConjugations.js`** - Form-level validation

All conjugations used in lessons are properly defined.
