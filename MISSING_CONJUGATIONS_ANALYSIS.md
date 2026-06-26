# Analysis of Missing Conjugations

## Summary

After fixing the false positives in conjugation analysis, **282 legitimate missing conjugations** remain in the VERBS data structure. These are forms actively used in lessons but not defined in the verb conjugation tables.

## Categories of Missing Forms

### 1. Dative Indirect Object Forms (106 forms)
Forms using the "diot" auxiliary for indirect objects. These represent a transitive verb combined with an indirect object marker.

**Examples:**
- `adierazi dio` (he/she tells him/her)
- `esan diot` (I tell him/her) 
- `eman dizut` (I give you)
- `galdetu diogu` (we ask him/her)

**Affected Verbs:**
- `adierazi`, `eman`, `esan`, `eskatu`, `galdetu`, `saldu`, `utzi` (and their imperfective forms)

**Required Implementation:**
- Add new tense variants like `dioPast`, `dioPresent`, `dioFuture` to these verbs
- Or create a "diot" auxiliary verb entry with full conjugations
- Or implement a `diotTenses` system similar to `ditransitivePrefixes`

### 2. Dative Psych Verb Forms (122 forms)
Forms using the dative agreement system for psychological verbs ("zaie", "zaigu", "zaio" patterns).

**Examples:**
- `ahaztu zaie` (he/she forgot them = they forgot)
- `gustatu zaigu` (it pleased us = we liked it)
- `iruditu zitzaidan` (it seemed to me = I thought)
- `jarraitu gintzaizkizuen` (they followed us = we followed them)

**Affected Verbs:**
- `ahaztu` (36 missing forms - but has similar definitions elsewhere!)
- `gustatu`, `gustatzen` (18 forms each)
- `iruditu`, `iruditzen` (18 forms each)
- `jarraitu`, `jarraitzen` (18 forms each)

**Note:** These are particularly complex because:
- `ahaztu` already has some of these defined in its various tenses (presentPlural, pastPlural, etc.)
- But the specific forms aren't being extracted correctly by `getComposedTable`
- The auxiliary forms (gatzaizkit, gintzaizkidan, etc.) come from `OBJECT_AXIS_SKELETONS['dativeIzanByNor']`

### 3. Missing Imperfective/Future Verb Entries (54 forms)
Imperfective participles and future stems used as standalone verb entries in conjugations.

**Examples:**
- `adieraziko` (future participle of adierazi)
- `adierazten` (imperfective participle)
- `ahaztuko` (future participle)
- `esando` (future participle)

**Root Cause:** These forms are created by adding participle/future suffixes to the verb stem, but they're not explicitly entered as conjugation table rows.

## Linguistic Patterns

### Dative Agreement System
Basque psychological verbs use dative marking instead of ergative. The pattern is:
- Person experiencing the feeling = dative (indirect object position)
- Stimulus = absolutive subject

This requires a completely different auxiliary system (OBJECT_AXIS_SKELETONS['dativeIzanByNor']) than the standard transitive system.

### Indirect Object ("diot") System
Some verbs need forms that mark an indirect object with the "diot" auxiliary, creating a ditransitive effect:
- Subject acts on object for/to beneficiary
- Example: "tell (to someone)", "give (to someone)"

## Current Coverage

| Category | Forms | Status |
|----------|-------|--------|
| Transitive (nork-nori-nor) | 4,021 | Complete |
| Missing dative indirect | 106 | Needs implementation |
| Missing dative psych | 122 | Needs implementation* |
| Missing participles | 54 | Needs implementation |
| **Total** | **4,303** | 282 (6.5%) missing |

*Note: Some psych verb forms may already be defined but not correctly extracted by `getComposedTable`

## Recommended Approach

**Phase 1 (Immediate):** Fix dative psych verb extraction
- Investigate why ahaztu's dative forms aren't being extracted properly
- Check if the issue is in verb definition or in `getComposedTable` logic
- May only require fixing existing data, not adding new conjugations

**Phase 2:** Implement diot/indirect object system
- Create "diotTenses" mechanism similar to ditransitivePrefixes
- Or add explicit tense entries to affected verbs
- Required for transitive verbs with indirect objects

**Phase 3:** Handle imperfective/future entries
- Add participle forms as explicit entries
- Or implement automatic generation from stem + suffix rules

## Files
- `missing-conjugations.txt` - Complete list of 282 missing forms
- `src/findMissingConjugations.js` - Script to identify gaps
