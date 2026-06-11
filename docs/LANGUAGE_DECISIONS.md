# Language decisions

A running log of decisions specific to the app's interface-language (i18n)
feature — the language the UI is displayed in, as distinct from the Basque
content being taught. Newest entries at the top. See `docs/DECISIONS.md` for
all other decisions.

## 2026-06-11 — "Source language" is the existing interface language, picked via a one-time onboarding screen, with Euskara prioritised

**Decision:** Rather than add a second language preference, "source language"
(for hints/translations) reuses the existing interface-language setting from
`LanguageContext`. `LANGUAGES` is now ordered `eu`/`es`/`en` (Euskara first,
since most users already know some Basque), and the Profile picker is
relabelled "Source language". `LanguageContext` exposes `hasChosenLanguage`;
first-time visitors see `LanguageOnboardingScreen` (Euskara flagged
"Recommended") before anything else, and picking a language persists it
permanently to `aditzak:lang:v1`.

## 2026-06-11 — Added interface-language i18n (English/Spanish/Basque), keeping the Basque content being taught untranslated

**Decision:** Added `src/i18n/` (`translations.js` + `LanguageContext.jsx`)
providing `{ language, setLanguage, languages, t, tCount }`, persisted under
`aditzak:lang:v1` (separate from progress) with browser-language fallback to
`DEFAULT_LANGUAGE = 'en'`. The Basque verb forms/sentences being taught, plus
"app voice" flavor text and grammar terminology (NOR/NORI/NORK, `TENSE_META`'s
Basque labels), stay untranslated — everything else (nav, instructions,
feedback, person/tense/type labels, verb glosses via `meaning: { en, es, eu
}`) is translated.

`journey.js`'s curriculum text is translated via a parallel lookup table
(`journeyTranslations.js`) rather than restructuring `journey.js` itself, so a
missing translation falls back to English instead of breaking. Existing
lookup-table patterns (`TENSE_META`, `PERSON_LABELS`, etc.) were extended with
`labelKey`s rather than replaced. No `STORAGE_KEY` bump — `aditzak:lang:v1` is
additive.
