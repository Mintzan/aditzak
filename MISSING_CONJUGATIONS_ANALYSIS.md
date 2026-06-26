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

All 12 defined synthetic verbs are represented in the curriculum:
- **izan** - 13 tenses
- **eduki** - 6 tenses
- **ukan** - 22 tenses
- **joan** - 6 tenses
- **etorri** - 7 tenses
- **ibili** - 4 tenses
- **egon** - 4 tenses
- **ados-egon** - 3 tenses
- **jakin** - 5 tenses (with minor gaps in plural forms)
- **jario** - 2 tenses
- Plus 2 motion verbs

**Overall Coverage:** 76/78 tenses (97.4%)

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

`src/findMissingConjugations.js` validates that:
1. All conjugations used in lessons are properly defined
2. Synthetic composition mechanisms are functioning correctly
3. Skeleton-based generation is complete

Result: **0 missing conjugations** across all 3,996 forms used.

## Evolution of Understanding

**Initial Observation:** Apparent gap of 1,323 "missing" forms in VERBS

**Investigation:** Traced missing forms to synthetic composition patterns not being validated

**Solution:** Enhanced validator to account for all composition mechanisms

**Outcome:** Revealed that VERBS data model is well-designed, using template composition to avoid duplication while ensuring complete grammatical coverage

## Files

- `src/findMissingConjugations.js` - Validates that all used conjugations are defined
- `src/analyzeTrinkokLaguntzaileak.js` - Reports coverage of synthetic verbs and auxiliary systems
- `MISSING_CONJUGATIONS_ANALYSIS.md` - This document
