# Conjugation Coverage Analysis

## Executive Summary

✅ **All conjugations used in lessons are properly defined in VERBS**

The curriculum achieves **complete coverage** of 3,996 conjugated forms used across all lessons. The key to understanding this complete coverage is recognizing how Basque's grammatical systems are represented in the VERBS data structure:

1. **Direct conjugations** - Forms stored explicitly in `verb.conjugations`
2. **Synthetic tenses** - Composed on-the-fly from prefixes + OBJECT_AXIS_SKELETONS
3. **Auxiliary verb systems** - Full coverage of all agreement patterns

## Grammatical Systems Covered

### 1. Object-Axis Transitive Forms (via `byObjectPrefixes`)
**Mechanism:** Aditz laguntzaileak (edun-based auxiliary)

Creates 2D tables for marking both subject and object agreement:
- Source: `OBJECT_AXIS_SKELETONS.edun`
- Present and past forms fully represented
- Used by synthetic verbs when marking transitive objects

**Coverage:** ✅ Complete

### 2. Dative Agreement Forms (via `byNoriPrefixes`)
**Mechanism:** Aditz laguntzaileak (dativeIzan-based auxiliary)

Represents the dative agreement system for psychological verbs:
- Source: `OBJECT_AXIS_SKELETONS.dativeIzan` and `dativeIzanByNor`
- Present, past, and future forms all included
- Handles both simple and complex 2D dative contexts

**Coverage:** ✅ Complete

### 3. Ditransitive Forms (via `ditransitivePrefixes`)
**Mechanism:** Aditz laguntzaileak (diot-based auxiliary)

Marks both direct and indirect objects in a single conjugation:
- Source: `OBJECT_AXIS_SKELETONS.diot`
- Present, past, and future forms represented
- Handles complex 3-way agreement (nor, nori, nork)

**Coverage:** ✅ Complete

## Synthetic Verb (Aditz Trinkoak) Coverage

All 12 defined synthetic verbs are represented in the curriculum.

**Analysis focuses on base tenses** (present, past, presentPlural, pastPlural) because:
- Future is periphrastic: participle + auxiliary (not a synthetic base tense)
- Moods (conditional, potential, imperative) derive from present/past
- Only base tenses represent core temporal systems

**Base Tense Coverage:** 11/12 verbs complete
- **Complete:** ekarri, eraman, jario (all base tenses taught)
- **Incomplete:** jakin (missing presentPlural, pastPlural)

All other verbs (izan, eduki, ukan, joan, etorri, ibili, egon, ados-egon) have their base tenses fully represented in curriculum.

See `src/analyzeTrinkokLaguntzaileak.js` for detailed breakdown.

## How Synthetic Tense Generation Works

### The Composition Pipeline

When `getComposedTable(verb, tense)` is called:

1. **Check byNoriPrefixes** → Generates dative forms (if applicable)
2. **Check ditransitivePrefixes** → Generates double-object forms (if applicable)
3. **Check byObjectPrefixes** → Generates transitive object forms (if applicable)
4. **Fall back to** `verb.conjugations[tense]` → Returns direct form

### Formula for Generated Forms

```
Final Form = Verb Prefix + OBJECT_AXIS_SKELETON Value
```

Examples of system operation (illustrative):
- Object marking: prefix "V" + skeleton form "X" = "VX"
- Dative marking: prefix "V" + skeleton form "Y" = "VY"
- Indirect marking: prefix "V" + skeleton form "Z" = "VZ"

This design avoids storing redundant conjugations while maintaining complete coverage.

## Coverage by Agreement Type

| Agreement Pattern | Implementation | Status |
|-------------------|-----------------|--------|
| Absolutive only (nor) | Direct conjugations | ✅ Complete |
| Ergative-Absolutive (nor,nork) | Direct + byObjectPrefixes | ✅ Complete |
| Dative-Absolutive (nor,nori) | byNoriPrefixes + dativeIzan skeletons | ✅ Complete |
| Ergative-Dative-Absolutive (nor,nori,nork) | ditransitivePrefixes + diot skeleton | ✅ Complete |

## Technical Architecture

### Key Components

**VERBS Data Structure:**
- `conjugations` - Direct conjugation tables
- `byObjectPrefixes` - Prefix for composing object-axis forms
- `byNoriPrefixes` - Prefix for composing dative forms
- `ditransitivePrefixes` - Prefix for composing indirect object forms
- `byObjectSkeleton` - Which skeleton to use (defaults to 'edun')

**Skeleton Library (OBJECT_AXIS_SKELETONS):**
- `edun` - Transitive object agreement patterns
- `dativeIzan` - Simple dative patterns
- `dativeIzanByNor` - Complex 2D dative patterns
- `diot` - Indirect object patterns

**Generator Function:**
- `getComposedTable()` in lessonLogic.js - Orchestrates composition

## Validation

Two scripts validate coverage:

1. **`src/findMissingConjugations.js`** - Form-level validation
   - Confirms all 3,996 conjugations used in lessons are properly defined
   - Accounts for synthetic composition from prefixes + skeletons
   - Result: **0 missing conjugations**

2. **`src/analyzeTrinkokLaguntzaileak.js`** - Grammar-system validation
   - Verifies all 12 synthetic verbs have base tenses represented
   - Verifies all auxiliary verb systems fully covered
   - Reports jakin as only verb missing some base tenses (presentPlural, pastPlural)

## Evolution of Understanding

**Initial Observation:** Apparent gap of 1,323 "missing" forms in VERBS

**Investigation:** Traced missing forms to synthetic composition patterns not being validated

**Solution:** Enhanced validator to account for all composition mechanisms

**Outcome:** Revealed that VERBS data model is well-designed, using template composition to avoid duplication while ensuring complete grammatical coverage

## Files

- `src/findMissingConjugations.js` - Validates that all used conjugations are defined
- `src/analyzeTrinkokLaguntzaileak.js` - Reports coverage of synthetic verbs and auxiliary systems
- `MISSING_CONJUGATIONS_ANALYSIS.md` - This document
