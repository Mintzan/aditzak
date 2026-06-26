# Unused Conjugations Analysis

## Summary

The curriculum covers **96.8%** of defined conjugations. There are **17 verb/tense combinations (100 conjugated forms)** that are grammatically valid and linguistically defined in VERBS but not yet incorporated into any lesson.

| Metric | Value |
|--------|-------|
| Total verb/tense combinations defined | 539 |
| Used in lessons | 522 |
| Unused (available but not taught) | 17 |
| Coverage rate | 96.8% |

## Unused Conjugations by Verb

### Dative/Psychological Verbs (High Priority)

These verbs have defined plural/future forms that would extend learning to new contexts:

#### **ahaztu** (forget) - 2 unused tenses
- Agreement: nor,nori (dative)
- Unused: `pastPlural`, `futurePlural` (12 forms)
- Learning stage: Currently has present/past/conditional forms, missing plural variants
- Pedagogical value: Would teach about plural addressees in dative contexts

#### **gustatu** (like/please) - 2 unused tenses
- Agreement: nor,nori (dative)
- Unused: `pastPlural`, `futurePlural` (12 forms)
- Learning stage: Has singular present/past, missing plural variants

#### **iruditu** (seem/think) - 2 unused tenses
- Agreement: nor,nori (dative)
- Unused: `pastPlural`, `futurePlural` (12 forms)
- Learning stage: Has singular present/past, missing plural variants

**Pattern:** These three psychological verbs (ahaztu, gustatu, iruditu) all lack their plural tense variants. Since they already have some forms taught, adding plural would be a natural progression.

### Modal/Auxiliary-like Verbs

#### **behar** (need/must) - 1 unused tense
- Agreement: nor,nork (transitive)
- Unused: `past` (6 forms)
- Current coverage: present, future
- Gap: Past tense forms like "behar nuen" (I needed)
- Pedagogical value: Common in narrative contexts

#### **nahi** (want) - 1 unused tense
- Agreement: nor,nork (transitive)
- Unused: `presentPlural` (6 forms)
- Current coverage: present, future
- Gap: Plural forms like "nahi dugu" (we want)

#### **hartu** (take) - 1 unused tense
- Agreement: nor,nork (transitive)
- Unused: `past` (6 forms)
- Current coverage: present, future
- Gap: Past tense forms like "hartu nuen" (I took)

### Emotion/Perception Verbs

#### **maite** (love) - 2 unused tenses
- Agreement: nor,nork (transitive)
- Unused: `present`, `past` (12 forms)
- Current coverage: None! This verb is fully defined but never used
- Gap: Complete absence from curriculum
- Pedagogical value: Basic emotion verb that would pair well with other sentiment verbs

### Knowledge/Cognitive Verbs

#### **jakin** (know) - 2 unused tenses
- Agreement: nor,nork (transitive)
- Unused: `presentPlural`, `pastPlural` (12 forms)
- Current coverage: Simple present/past/future
- Gap: Plural variants not taught

### Motion Verbs

#### **eraman** (carry/take away) - 1 unused tense
- Agreement: nor,nork (transitive)
- Unused: `future` (6 forms)
- Current coverage: present, past
- Gap: Future tense forms

#### **ekarri** (bring) - 1 unused tense
- Agreement: nor,nork (transitive)
- Unused: `future` (6 forms)
- Current coverage: present, past
- Gap: Future tense forms

### Ditransitive Verbs

#### **esan** (say/tell) - 1 unused tense
- Agreement: nor,nori,nork (ditransitive)
- Unused: `futurePlural` (6 forms)
- Current coverage: Most forms except future plural
- Gap: Limited to future planning with multiple recipients

#### **eman** (give) - 1 unused tense
- Agreement: nor,nori,nork (ditransitive)
- Unused: `futurePlural` (4 forms)
- Current coverage: Most forms except future plural
- Gap: Limited to future planning with multiple recipients

## Patterns in Coverage Gaps

### By Tense
- **Future forms**: eraman, ekarri (motion verbs missing future)
- **Plural forms**: nahi, jakin, ahaztu, gustatu, iruditu, esan, eman (missing plural variants)
- **Past forms**: behar, hartu (missing past tense)
- **Complete gaps**: maite (entirely absent despite being defined)

### By Agreement Type
- **Dative verbs** (nor,nori): Most affected - all three dative psych verbs missing plural forms
- **Transitive verbs** (nor,nork): Some gaps in past/plural forms
- **Ditransitive verbs** (nor,nori,nork): Only missing plural future forms

### By Verb Category
- **Psychological verbs** (ahaztu, gustatu, iruditu): 6 unused tenses
- **Modal verbs** (behar, nahi): 2 unused tenses
- **Motion verbs** (eraman, ekarri): 2 unused tenses
- **Other**: 7 unused tenses spread across emotion, knowledge, ditransitive verbs

## Pedagogical Recommendations

### Phase 1 - Quick Wins (Low hanging fruit)
**Priority: HIGH** - These verbs already have some forms taught

1. **Add maite forms** - This emotion verb is completely absent despite being defined
   - Would provide complement to basic feeling expressions
   - Relatively simple transitive paradigm

2. **Add behar/past** - Common in narrative contexts
   - Natural progression after present/future
   - Useful for talking about needs in the past

3. **Add nahi/presentPlural** - Completes the modal verb set
   - Necessary for "we want" / "you (pl) want" expressions
   - Aligns with existing nahi coverage

### Phase 2 - Natural Progressions
**Priority: MEDIUM** - Would extend existing curriculum units

1. **Dative verb plural forms** (ahaztu, gustatu, iruditu)
   - All three together as a unit covering plural dative recipients
   - Would follow existing singular dative lessons
   - Important for expressing feelings about groups

2. **Motion verb futures** (eraman, ekarri)
   - Complete the motion verb set
   - Important for future planning expressions

### Phase 3 - Future Planning
**Priority: LOW** - For advanced/extended curriculum

1. **Remaining plural forms** (jakin/presentPlural, esan/futurePlural, eman/futurePlural)
   - These are less frequently used combinations
   - Could be added after core curriculum is complete
   - Useful for advanced multi-participant scenarios

## Technical Notes

- All 100 unused forms are properly conjugated and valid
- They follow the same grammatical patterns as currently taught forms
- No missing data - they just haven't been assigned to lessons yet
- Could be added to existing units or created as new review exercises

## Files
- `src/findUnusedConjugations.js` - Script to identify pedagogical gaps
- `UNUSED_CONJUGATIONS_ANALYSIS.md` - This analysis document
