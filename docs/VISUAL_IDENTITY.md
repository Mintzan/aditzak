# Visual Identity & Design System Guide

**Status: proposed — not yet implemented.** This is a redesign specification, not a description of the current UI. Nothing in the codebase has been touched to match it yet. See "Gap analysis" below for what changes and "Open scope questions" for what needs a product decision before implementation starts.

**Mascot Core:** The Latxa Sheep (*Mutur Beltza* variety)
**Design Philosophy:** Culturally grounded, structurally precise, and companion-driven.

This guide was commissioned from an outside designer as a from-scratch visual identity (no prior brand existed — see "Gap analysis"). It went through five review rounds before reaching this state: round 1 found a genuine WCAG contrast failure (`brand-clay` on white text, 3.33:1) and a four-way inconsistent dark-neutral scale; round 2 fixed both and added the missing lesson-card mockup and a dedicated favicon-scale mark, but its "mathematically verified" contrast ratios didn't match independent recomputation (always in the safe direction — nothing that claimed to pass actually failed, but the specific decimals were invented); round 3 replaced the fabricated decimals with qualitative AA/AAA bands and fixed a table-column mismatch; round 4 reconciled a separately-delivered expression-library catalog that had drifted back onto the pre-fix palette and anatomy, and rejected two of its four proposed mascot triggers for conflicting with §7's anti-guilt voice principle (see §1C). **Round 5 audited the guide against the actual React components** (`ExerciseScreen.jsx`, `HomeScreen.jsx`, `badges.jsx`, `data/verbs.js`) rather than just the guide's own internal consistency, and closed every gap that surfaced — the grammar-badge color system (§2), the hearts-palette question (§2), the button/card geometry (§5), the motion timings (§6), font loading (§4), and icon-system scope (§1C). The content below is the reconciled, component-checked version. If these tokens are ever needed for a compliance artifact, re-verify the specific ratios with a real contrast checker (WebAIM, `axe`) rather than citing the labels here.

## Gap analysis: what this changes

The app currently has **no formal design system** — styling is ad hoc Tailwind utility classes applied per-component, spanning roughly 10 distinct hues across `ExerciseScreen.jsx`, `HomeScreen.jsx`, `badges.jsx`, and `data/verbs.js`. Full per-component mapping is in §2's "Full Current-Component Color Mapping" table; summary:

| Existing element | Current styling | This guide proposes |
|---|---|---|
| `Stars` | `text-amber-400` | `brand-txakoli` (`#EAB308`) — coincidentally almost the same hue, low-risk swap |
| Primary buttons (~15 instances), `ProgressBar` fill | `bg-green-500` | `brand-forest` (`#0A4F35`) — a real visual-weight shift, darker/more muted than today; see §2's hover-state note |
| Correct/incorrect answer states (4 separate style objects in `ExerciseScreen.jsx`) | `border-green-500`/`border-red-500` tint triads | `semantic-correct`/`semantic-error` |
| `DialectBadge` | `bg-gray-100` / `text-gray-500` | **No change** — already an equivalent match |
| `HeartsBadge` | `bg-rose-100` / `text-rose-600` | **No change** — formalized as `accent-hearts`, a deliberate standalone exception (§2) |
| `TYPE_META`/`AGREEMENT_META` (`data/verbs.js`) — 5 more hues (`indigo`/`rose`/`blue`/`purple`/`amber`) | assorted Tailwind colors | Reuses the 3 brand colors for NOR/NORI/NORK; verb type moves to a value distinction instead of a hue (§2) |
| Streak/points/bonus pills, streak-repair card | `orange`/`sky`/`violet` | `brand-clay`/`brand-txakoli`/`semantic-warning` per §2's mapping table |
| Button/card geometry | uniform `rounded-2xl` (16px) everywhere, flat fill + `active:scale-[0.98]` | Buttons move to 12px radius; cards keep 16px; the "keycap" button style from earlier drafts is dropped in favor of the app's existing, working press pattern (§5) |
| Fonts | none loaded (browser default) | Space Grotesk/Inter — needs an actual `<link>` addition, not just a token (§4) |
| Icons | ~15 emoji touchpoints app-wide | **No change** — emoji stay as the default icon system; mascot is additive to 2 spots only (§1C) |
| Logo / favicon | placeholder `public/favicon.svg`, `public/icons.svg` | full mascot SVG (§1A) + dedicated small-scale mark (§1B) — assets exist in `public/brand/`, not yet wired up as the live favicon |
| Mascot / character | none | full mascot system with per-state expressions and animation (§1, §6) — still a separate scope decision, see below |
| 3-star confetti/firework celebration | independent 7-color rainbow | **No change, deliberately** — see §6 |

## Open scope questions

1. **Mascot/animation system is still a product decision, not a styling decision — this is the one open item round 5 didn't and can't resolve.** This guide specifies per-feedback-state facial expressions and ear-rotation animation — that's meaningfully more engineering surface than a color/type token swap, and nothing like it exists today. Decide explicitly whether Aditzak becomes a mascot-driven app before building it; don't let it get absorbed silently into a "palette update." Everything else the mascot touches (icon-system scope, motion, the two feedback-drawer spots) is now fully specified *if and when* this gets a yes — the guide just can't make the yes/no call itself.
2. Tailwind 4 here has no `tailwind.config.js` (theme via the Vite plugin) — implementation will need to route these tokens through `@theme` in `src/index.css`, not a config file.

**Resolved in round 5** (previously open, now closed — see the sections cited): the hearts/`rose` palette question (§2, `accent-hearts`), the grammar-category badge colors (§2), the button/card geometry mismatch (§5), the motion-timing mismatch (§6), missing font loading (§4), and icon-system scope (§1C).

**Recommended path, revised:** the palette/typography/component work (§2–5) is larger than "low-risk, adopt now" as originally framed — the grammar-badge palette consolidation (10+ hues → the brand+semantic set) and the button-radius/geometry change touch real, working code across two screen files, not just a token file. It's still bounded and doable without the mascot: (1) add font loading (§4, trivial), (2) apply the §2 color mapping table component-by-component, verifying each new tint/text pairing's contrast as built rather than assumed, (3) drop button radius to 12px, leave cards and press feedback untouched. None of it requires deciding the mascot question first — that stays a separate, later decision exactly as originally scoped.

---

## 1. Logo & Mascot Assets

The visual identity of Aditzak centers around the **Latxa sheep**, a rugged breed native to the Basque Country known for its long, coarse wool and distinctive dark face (*Mutur Beltza*). This mascot serves as a "linguistic shepherd," guiding adult learners through the complex terrain of Basque verb conjugations with steady, grounded encouragement.

### A. Marketing & Splash Logo (Full Scene)

Used for splash screens, onboarding, and marketing banners. It features the complete mascot character paired with a geometric, heavy lowercase wordmark **"aditzak"** rendered in Space Grotesk.

Asset file: `public/brand/latxa-logo.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <!-- Drop Shadow / Base Plate to anchor the mascot -->
  <ellipse cx="200" cy="375" rx="90" ry="12" fill="#E2E8F0" />

  <!-- Main Shaggy Body Wool (Latxa coarse long wool) -->
  <path d="M 100,170 C 100,90 300,90 300,170 C 330,210 345,270 325,320 L 295,295 L 265,345 L 235,310 L 200,355 L 165,310 L 135,345 L 105,295 L 75,320 C 55,270 70,210 100,170 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 105,295 L 135,345 M 165,310 L 200,355 M 235,310 L 265,345" fill="none" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>

  <!-- Drooping Ears -->
  <path d="M 130,155 C 85,145 55,175 65,205 C 70,220 95,205 125,180 Z" fill="#1E2530" />
  <path d="M 270,155 C 315,145 345,175 335,205 C 330,220 305,205 275,180 Z" fill="#1E2530" />

  <!-- Canonical Dark Face Mask -->
  <path d="M 135,165 C 135,105 265,105 265,165 C 265,220 240,270 200,270 C 160,270 135,220 135,165 Z" fill="#1E2530" />

  <!-- Vector Eyes -->
  <circle cx="175" cy="160" r="22" fill="#FFFFFF" />
  <circle cx="178" cy="160" r="11" fill="#0B0F19" />
  <circle cx="176" cy="156" r="3.5" fill="#FFFFFF" />
  <circle cx="225" cy="160" r="22" fill="#FFFFFF" />
  <circle cx="222" cy="160" r="11" fill="#0B0F19" />
  <circle cx="224" cy="156" r="3.5" fill="#FFFFFF" />

  <!-- Shaggy Forehead Wool ("Bangs") -->
  <path d="M 138,140 C 145,105 255,105 262,140 L 245,155 L 230,140 L 200,165 L 170,140 L 155,155 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round" />

  <!-- Expressive Eyebrows -->
  <path d="M 155,128 Q 170,118 182,126" fill="none" stroke="#1E2530" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 245,128 Q 230,118 218,126" fill="none" stroke="#1E2530" stroke-width="4.5" stroke-linecap="round" />

  <!-- Nose & Happy Smile -->
  <path d="M 190,220 L 210,220 C 215,220 213,228 200,231 C 187,228 185,220 190,220 Z" fill="#0B0F19" />
  <path d="M 184,242 Q 200,254 216,242" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
</svg>
```

Rendered and spot-checked in a headless browser during review — reads as a clear, recognizable sheep face at 300–400px.

**Resolved:** the drop-shadow ellipse's `#E2E8F0` is now a named token — `neutral-200 (Shadow Tint)`, added to the §3 scale — rather than an undocumented sixth gray. It stays a distinct value rather than being forced onto `neutral-400` because it needs to read as a soft ground-shadow, not a border/divider.

### B. Micro-Optimized App Icon & Favicon Mark

To ensure clean rendering at 16×16px or 32×32px, all complex textures (body wool paths, eyebrows, smile lines, and shaggy bangs overlay) are stripped away. This utilizes a high-contrast geometric abstraction of the head, optimized for low-resolution grids.

Asset file: `public/brand/latxa-icon.svg` — **not yet wired up** as the site favicon (`index.html` still points at the placeholder `public/favicon.svg`); swapping it in is an explicit step for whoever implements this guide, not implied by this file existing.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
  <!-- Outer Head Canvas Shape -->
  <path d="M 6,12 C 6,6 26,6 26,12 C 26,20 22,26 16,26 C 10,26 6,20 6,12 Z" fill="#1E2530" />
  <!-- Drooping Ears Simplified -->
  <path d="M 7,11 C 2,10 0,14 2,17 Z" fill="#1E2530" />
  <path d="M 25,11 C 30,10 32,14 30,17 Z" fill="#1E2530" />
  <!-- High Contrast Crisp Eye Geometry (Scaled up for micro grids) -->
  <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
  <circle cx="12" cy="12" r="1.5" fill="#0B0F19" />
  <circle cx="20" cy="12" r="3.5" fill="#FFFFFF" />
  <circle cx="20" cy="12" r="1.5" fill="#0B0F19" />
</svg>
```

Verified at true render size during review: clear and legible at 32px and 64px; at true 16px (actual browser favicon size) the eyes compress to small dots — usable, but that's the legibility floor, not a defect to iterate further on.

### C. Expression Library

A separately-commissioned four-state expression catalog (Pozik/happy, Gora!/excited, Haserre/determined, Nekatuta/tired) arrived on the *pre-fix* palette from round 1 (`#374151`/`#111827`/`#1F2937`/`#2D3748`/`#F9FAFB`/`#E5E7EB`) — the exact inconsistent grays §2/§3 replaced. It also carried anatomy (visible legs, a muzzle-shadow overlay, an inner-ear shadow detail) that the accepted §1A logo simplified away, and framed two of its four triggers around missed-practice guilt, which §7 explicitly rejects. Rather than leave that as an open question, here's the reconciliation:

**Color and anatomy — recolored onto the canonical tokens, simplified to match §1A's geometry exactly** (no legs, no muzzle shadow, no inner-ear shadow — one mascot, one anatomy, used at different scales/detail levels for different contexts, not two competing character designs). Two colors outside the neutral scale survive the correction, both deliberately:
- The Gora! mouth interior keeps `#991B1B` — it happens to already equal the `semantic-error` token, but here it's anatomical (mouth-interior shading), not a status signal, so the coincidence is harmless and no new value was introduced.
- The Gora! tongue keeps `#F43F5E` — this is Tailwind's `rose-500`, which ties it to the same rose family `HeartsBadge` already uses in the shipped UI (`bg-rose-100`/`text-rose-600`). Treated as an intentional thread connecting the mascot to the one place `rose` already exists in the app, not a new arbitrary accent.

Assets: `public/brand/latxa-expression-gora.svg`, `public/brand/latxa-expression-haserre.svg`, `public/brand/latxa-expression-nekatuta.svg`. **Pozik has no separate file** — once recolored and simplified, it's pixel-for-pixel the same artwork as `public/brand/latxa-logo.svg` (§1A), so that file *is* the Pozik state; a duplicate would just be a second copy to keep in sync.

**Trigger conditions — Haserre and Nekatuta's originally-proposed triggers are rejected, not adopted:**

| State | Rejected trigger (as originally proposed) | Why rejected | Adopted trigger instead |
|---|---|---|---|
| Haserre | "Appears if the user repeatedly ignores daily goals... alerts... pops up during time-attack validation modes" | The "ignores daily goals" half is a disappointed-mascot-for-missed-practice mechanic — functionally the guilt pattern §7 names as the thing to avoid, just moved from copy into the mascot's face. "Time-attack validation" references an unbuilt, unscoped feature. | A callout accent for flagging a genuinely error-prone conjugation pattern *within* a lesson (e.g. a commonly-confused irregular form) — pedagogical, not behavioral. |
| Nekatuta | "Used for weak-skill warnings or missed notifications... to prompt immediate practice" | "Missed notifications... prompt immediate practice" is a re-engagement nag, same guilt-mechanic problem as Haserre. | The "weak-skill" half is legitimate and kept: an accuracy-based indicator in the Progress tab next to a lesson with a low `bestScore` (data that `progressStorage` already tracks), signaling "this needs review" — not "you didn't open the app." |

Neither adopted trigger is wired into any screen yet — this only settles what the mascot is *allowed* to represent if/when someone builds it, consistent with §1's "mascot system is a separate scope decision" note.

**Relationship to the §1B favicon-scale mark:** the mini circular avatars used in §10 Swatch 3 (`latxa-icon-correct.svg`/`latxa-icon-incorrect.svg`) and this expression library are not redundant with each other. The mini avatars are the high-frequency, low-detail, 32px-viewBox icon for the per-answer feedback drawer. The expression library is the low-frequency, high-detail, 400px-viewBox illustration for larger, rarer moments (dashboard/home state, lesson-complete or streak-milestone screens, and — per the adopted triggers above — in-lesson pattern callouts and Progress-tab review indicators). Same character, two deliberately different resolutions for two different UI contexts.

**Icon system scope (round 5 — closes an open question the original guide never addressed):** every icon in the app today — nav bar, streak, points, lock, gate shield, lightbulb, flag, checkmark/cross, envelope, cloud-sync, trophy, bonus sparkle, roughly 15 touchpoints total — is a native emoji, not a vector icon. **Decision: emoji stay, app-wide, as the default icon system.** They're free, already accessible (paired with `aria-hidden` + adjacent text/`aria-label`, consistently, everywhere already), and replacing working icons with new vector assets has no demonstrated benefit — this guide never proposed a general vector icon set to replace them with. The mascot's mini avatars are additive, scoped to exactly the two feedback-drawer moments already decided in §10 Swatch 3, not a wholesale icon-system replacement. Nothing else in the app is expected to grow a mascot or vector-icon treatment unless a future decision explicitly says so.

## 2. Color Palette & Design Tokens

The palette links the natural color properties of the Latxa sheep with deep, saturated accent tones inspired by the Basque landscape (coastal oaks, terracotta roofing tiles, and Txakoli vineyards).

### Core Palettes (Light Mode)

| Token Name | Hex Value | Primary Application | Contrast Pairing | WCAG Status |
|---|---|---|---|---|
| wool-white | `#F8FAFC` | App Background Canvas | Text Main (`#1E2530`) | Passes AAA |
| neutral-card | `#FFFFFF` | Lesson Cards / Background Elements | Text Main (`#1E2530`) | Passes AAA |
| brand-forest | `#0A4F35` | Headers / Primary Action Buttons | White Text | Passes AAA |
| brand-clay | `#A63816` | Streaks / Achievements / Milestones | White Text | Passes AA |
| brand-txakoli | `#EAB308` | Stars / Points / Reward Badges | Text Main (`#1E2530`) | Passes AA |

`brand-clay` was originally specified as `#DE6B48` and failed its own accessibility mandate (3.33:1 against white text, verified with an independent contrast script). `#A63816` is the corrected value (6.57:1, verified).

### Semantic System (Micro-Feedback Canvas)

| Token Name | Hex Value | Application Context | Contrast Pairing | WCAG Status |
|---|---|---|---|---|
| semantic-correct | `#14532D` | Correct Answer Bottom Drawer | White Text | Passes AAA |
| semantic-error | `#991B1B` | Incorrect Answer Bottom Drawer | White Text | Passes AAA |
| semantic-warning | `#9A3412` | Streak In Jeopardy Outline Frame, Streak-Repair Prompt, Gate-Score-Needed Hint | White Text | Passes AA |

### Grammar-Accent System (NOR/NORI/NORK + Verb Type)

A round-5 addition, added after auditing the actual component code (`data/verbs.js`'s `TYPE_META`/`AGREEMENT_META`, `components/badges.jsx`) — the original guide never accounted for these at all, but they're the single largest block of hardcoded color in the real app (five arbitrary Tailwind hues: `indigo`, `rose`, `blue`, `purple`, `amber`). Rather than invent a fourth unrelated set of hues, the three case-role badges **reuse the three brand colors** — this ties the grammar-role system into the same visual language as the brand instead of adding new arbitrary accents, and it's the one meaningful design improvement this round makes over just recoloring 1:1.

| Role | Token | Rationale |
|---|---|---|
| NOR (absolutive) | `brand-forest` | The default/core argument every finite verb has — pairs with the primary brand color. |
| NORI (dative) | `brand-txakoli` | The "to/for" recipient argument — a secondary accent, distinct from the primary and the ergative. |
| NORK (ergative) | `brand-clay` | The agent argument — the "acting on" role, paired with the same warm tone used for streaks/achievements (also agency-flavored). |

Verb **type** (synthetic vs. periphrastic) is a binary structural distinction, not a 3-way role, so it doesn't get a hue at all — it's value, not color: synthetic is the majority/default case (filled `neutral-900` badge), periphrastic is the marked case (outlined `neutral-800` badge, `neutral-900` text). This also resolves a real collision the audit found: `TYPE_META.periphrastic` currently uses Tailwind `rose`, the same hue `HeartsBadge` uses for something entirely unrelated — moving type off color entirely frees `rose` for hearts exclusively (see below).

### Accent-Hearts (Standalone Exception)

Answers the open scope question from the original gap analysis ("does `rose` stay or get folded into a token?") — **it stays**, formalized as its own named exception rather than left ambiguous:

| Token Name | Hex Family | Application |
|---|---|---|
| accent-hearts | Tailwind `rose-500`/`rose-600`/`rose-100` (unchanged from what's shipped) | Hearts balance badge, out-of-hearts/heart-locked messaging, and nothing else |

Hearts are a distinct player-economy resource (lives), not a brand or semantic-feedback concept — they deserve their own identity the way Duolingo's hearts are red/pink and separate from its green "correct" color, rather than being forced onto `semantic-warning` or `brand-clay` just to shrink the palette further. The Gora! mascot expression's tongue (`#F43F5E`, Tailwind `rose-500`) already happens to land in this family — that overlap is fine to keep now that `rose` has exactly one meaning in the app instead of two.

### Full Current-Component Color Mapping

The actionable checklist for applying the above — every color actually found in `src/screens/ExerciseScreen.jsx`, `src/screens/HomeScreen.jsx`, `src/components/badges.jsx`, and `src/data/verbs.js`, mapped to its replacement token. Where "no change" is listed, the existing Tailwind class is already an equivalent-enough match (verified during the round-5 component audit) and doesn't need touching.

| Current usage | Current classes | New token |
|---|---|---|
| Primary buttons (Start/Check/Continue/Sign-in/etc., ~15 instances) | `bg-green-500 hover:bg-green-600` | `brand-forest` (see hover-state note below) |
| Correct answer/option/input state | `border-green-500 bg-green-50 text-green-700` | `semantic-correct` (border/bg/text triad — see accessibility note below) |
| Incorrect answer/option/input state | `border-red-500 bg-red-50 text-red-700` | `semantic-error` |
| Match-tile "selected" (not yet correct/incorrect) | `border-blue-400 bg-blue-50 text-blue-700` | `neutral-800` border / `neutral-200` bg / `neutral-900` text — a transient "chosen" state doesn't need its own hue |
| `TYPE_META.synthetic` | `bg-indigo-100 text-indigo-700` | `neutral-900` bg / white text (filled) |
| `TYPE_META.periphrastic` | `bg-rose-100 text-rose-700` | `neutral-800` outline / `neutral-900` text |
| `AGREEMENT_META.nor` | `bg-blue-100 text-blue-700` | `brand-forest` (light tint bg / saturated text, same tint-pill idiom the badges already use — see contrast note below) |
| `AGREEMENT_META.nori` | `bg-purple-100 text-purple-700` | `brand-txakoli` |
| `AGREEMENT_META.nork` | `bg-amber-100 text-amber-700` | `brand-clay` |
| `DialectBadge` | `bg-gray-100 text-gray-500` | **No change** — already an equivalent match to `neutral-200`/`neutral-600` |
| Streak pill/stat, streak-repair card | `bg-orange-100 text-orange-600` (pill), `border-orange-200 bg-orange-50 text-orange-700` + `bg-orange-500` button (repair card) | `brand-clay` (pill), `semantic-warning` (repair card — it's a "your streak needs attention" prompt, not a stat display) |
| Points pill/chip | `bg-sky-100 text-sky-700` | `brand-txakoli` |
| Bonus unit label | `bg-violet-100 text-violet-700` | `brand-txakoli` (reuses the same "reward/special" association as points/stars) |
| Recognition-only hint | `text-sky-600` | `neutral-600` — quiet instructional text, not a warning or a brand moment |
| Gate-needs-score hint | `text-amber-600` | `semantic-warning` |
| Hearts badge, out-of-hearts/heart-locked hint | `bg-rose-100 text-rose-600` / `text-rose-600` | **No change** — formalized as `accent-hearts` above |
| 3-star confetti/firework celebration | `CELEBRATION_COLORS` (7-color rainbow, `ExerciseScreen.jsx`) | **No change, deliberately** — see §6 |

**Hover-state note for `brand-forest`:** it's already a dark, low-luminance green (`#0A4F35`) — a `hover:` state that darkens further (the current pattern, `green-500`→`green-600`) would approach unreadable-dark and lose contrast fast. Lighten on hover instead (e.g. toward a `#0D6444`-range tint), not darken.

**Contrast note on the tint-background triads:** `border-<token> bg-<token>-50 text-<token>-700`-style triads (correct/incorrect states, and the new NOR/NORI/NORK badge treatment) need their *own* light-tint background shade generated per brand color, not reused from Tailwind's built-in `-50`/`-700` steps (those don't exist for custom hex tokens). Whoever implements this needs to generate a light tint (≈10% token color over white) and a readable-on-that-tint text shade for each of `brand-forest`/`brand-clay`/`brand-txakoli`, and verify contrast on the actual generated pair — not assumed from the base-token contrast table above, which was only computed for solid-fill/white-text pairings.

## 3. Canonical Neutral Scale

A single 6-step monochromatic scale (5 dark steps plus one light shadow-tint step), replacing what was originally four inconsistent ad hoc dark grays (`#374151`/`#111827`/`#1F2937`/`#2D3748`) across the draft, plus an undocumented shadow gray (`#E2E8F0`) that a later expression-library addendum also used unchanged. Do not introduce other gray values outside this list.

- **neutral-950 (Ink Black) → `#0B0F19`** — code snippet backgrounds, deep layout border details, pitch-black line paths.
- **neutral-900 (Latxa Charcoal / Mascot Face) → `#1E2530`** — canonical **Text Main** token; all primary body text and heavy UI labels.
- **neutral-800 (Charcoal Border) → `#2D3543`** — interactive element outlines, tactile button border offsets.
- **neutral-600 (Text Muted) → `#525C6C`** — secondary hints, grammar category labels, metadata descriptions.
- **neutral-400 (UI Borders) → `#94A3B8`** — decorative lines, inactive card dividers, disabled framework states.
- **neutral-200 (Shadow Tint) → `#E2E8F0`** — mascot ground-shadow ellipses only; not for borders or text (that's `neutral-400`/`neutral-600`).

## 4. Typography System

- **Heading Font Family:** Space Grotesk (geometric open-source sans-serif).
- **Body & UI Label Font Family:** Inter (optimized readability inside dense micro-layouts).

**Implementation note (round 5):** neither font loads today — checked `index.html` and `index.css` directly; the app currently renders in each browser's default sans-serif. This isn't an open question, it's a missing step. Add to `index.html`'s `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

(Same tags already used in `public/design-guide.html` §10's live swatches — copy from there rather than re-deriving weights.)

### Mobile Scale Constraints (root 16px)

- `--text-2xl` (24px, SemiBold): success headings, modal milestone banners.
- `--text-xl` (20px, Bold): lesson block drill questions.
- `--text-lg` (18px, Medium): lesson card titles, drawer subheadings.
- `--text-base` (16px, Regular): core structural grammar rules and hints.
- `--text-sm` (14px, SemiBold): multiple-choice options, actionable button labels.
- `--text-xs` (12px, Bold, Uppercase): case category identifiers (NOR, NORK, NORI).

## 5. Component Styling Conventions

All structural elements are built to render safely inside tight mobile displays (**400px maximum width window**, matching the app's existing `max-w-md` layout constraint).

**Revised in round 5, against the real component code:** the original "tactile 3px bottom-border-offset" button spec is **dropped**. It doesn't exist anywhere in the current app — every button today is a flat solid fill with `active:scale-[0.98]` press feedback, applied consistently across roughly 20 button instances in `ExerciseScreen.jsx`/`HomeScreen.jsx`. That pattern already works, is already accessible, and replacing it with a heavier bordered "keycap" style would be a real interaction-pattern change for no demonstrated benefit — it was never validated against anything the app actually does. Keep `active:scale-[0.98]` as the standing tactile-feedback convention; the guide's job is the color/radius tokens applied to it, not a new button anatomy.

- **Buttons:** keep the existing flat solid-fill + `active:scale-[0.98]` press pattern. Adopt 12px corner radius (down from the app's current uniform `rounded-2xl`/16px) to differentiate buttons from cards. Minimum 48px height (already the app's standard, `style={{ minHeight: 48 }}` throughout — no change needed there).
- **Cards & Canvas Framework:** 16px corner radius (matches the app's current `rounded-2xl` — no change needed here, cards keep their existing radius, only buttons shrink to 12px to create the differentiation above).
- **Grammar Tags / Badges:** capsule shape (`border-radius: 999px`), fixed 24px vertical height — this is a real change from the app's current badges, which use `rounded-full` (equivalent capsule shape, so also effectively no change) at a slightly taller `px-2.5 py-1` padding; fine to standardize on the guide's 24px figure.

## 6. Motion Principles

**Revised in round 5:** the original numbers here (0.98→1.03→1.0/200ms celebration, ±6px/three-cycle/250ms correction) were never checked against the app's actual, already-shipped animations and don't match them. Rather than force a rewrite of tuned, working CSS to hit invented numbers, this section now documents what's real and reserves new numbers only for motion that doesn't exist yet.

- **Correction Response (existing, unchanged):** `animate-shake` in `src/index.css` — 400ms, an asymmetric 5-step wobble (−1px, 2px, −4px, 4px, −4px), not a flat ±6px/three-cycle pattern. This is already applied to incorrect answer options/inputs/word-chips app-wide; keep it as-is.
- **Celebration Response, per-answer (existing, unchanged):** `animate-flash` in `src/index.css` — 350ms, scale 1 → 1.04 → 1. Already applied to correct answer options/inputs.
- **Celebration Response, mascot-specific (new, not yet built):** *if* the mascot system is greenlit (see Open Scope Questions), its own reaction — ear-tilt on correct, eyebrow/expression change on incorrect — is new motion with no existing precedent to reconcile against. The original 0.98→1.03→1.0/200ms figure is kept here, scoped specifically to a mascot avatar's own reaction, not to the answer-option flash/shake above.
- **3-Star Celebration (existing, unchanged, deliberately out of brand palette):** the confetti/firework system (`createCelebration`, `CELEBRATION_COLORS` in `ExerciseScreen.jsx`) uses its own independent 7-color rainbow, not the brand palette. That's intentional, not an oversight this guide is filling in — a full-screen celebration spectacle reads better as genuinely multicolor than brand-constrained, the same way real confetti isn't tinted to match a logo. If the mascot is added, it can appear *alongside* this effect (e.g. a Gora!-state avatar at the center of the confetti burst) without needing the confetti itself to be recolored.
- **Layout Navigation Transitions:** content slides right-to-left over 300ms on screen changes, evoking movement along a mountain trail. No existing equivalent in the app today (screen changes are currently instant/unanimated) — this remains a genuinely new addition, not a reconciliation.

## 7. Voice & Tone Design Pattern

The Latxa mascot sets a calm, grounded, and encouraging tone — respecting the user's intelligence and the cultural heritage of the language, steering clear of cartoonish guilt trips or childish text.

> **The Rule:** Focus on clear linguistic mechanics and steady encouragement. Celebrate accuracy without overhyping simple steps.

```
Acceptable (encouraging & grounded):
"Oso ondo! You accurately matched the plural Nork marker."
"Hurbil! Take another look at the dative suffix before trying again."

Avoid (childish or threatening):
"Wow! Super-duper job! You're a rockstar!"
"You missed your session today. Don't make your sheep cry!"
```

## 8. Accessibility Mandates

- **Dual-Indicator Rule:** interface state updates (correct/incorrect/cautionary) are never communicated by color alone — pair with an explicit mark (check/× — already the app's convention, plain-text glyphs today) and, only if the mascot system is greenlit (see Open Scope Questions), a corresponding mascot expression change as a third reinforcing signal, not a required one.
- **Contrast Index:** every actionable component must meet 4.5:1 minimum contrast.
- **Touch Targets:** minimum interactive hit zone of 48×48px.

## 9. Dark Mode Adaptation

- **Base Canvas Backdrop:** `#0F172A`
- **Card Element Component:** `#1E293B`

### Dark Mode Contrast Alignment

| Token Name | Hex Value | Target Application Context | Contrast Pairing | WCAG Status |
|---|---|---|---|---|
| text-primary-dark | `#F8FAFC` | Main Typographic Text | Over Card Base (`#1E293B`) | Passes AAA |
| semantic-correct-dark | `#4ADE80` | Emerald Green Text Accent | Over Card Base | Passes AA |
| semantic-error-dark | `#FCA5A5` | Bright Red Text Accent | Over Card Base | Passes AA |
| semantic-warning-dark | `#FDBA74` | Vivid Orange Text Accent | Over Card Base | Passes AA |

No component swatches or mascot-dark variants were produced for dark mode — this section is palette-only. Full dark mode implementation would need dark-mode versions of the §10 component swatches before it's build-ready.

## 10. Code-Ready UI Component Swatches

Three production-ready HTML component swatches applying the tokens above, all within the 400px mobile viewport constraint.

### Swatch 1: Core Lesson Card Component

```html
<div style="max-width: 400px; background-color: #F8FAFC; padding: 16px; font-family: 'Inter', sans-serif; margin: 0 auto;">
  <div style="background-color: #FFFFFF; border: 2px solid #2D3543; border-radius: 16px; padding: 16px; box-shadow: 0 4px 0px 0px #2D3543; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 14px; align-items: center;">
      <div style="width: 48px; height: 48px; background-color: #0A4F35; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #2D3543;">
        <span style="color: #FFFFFF; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;">02</span>
      </div>
      <div>
        <h3 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: #1E2530;">Present Tense: Nor-Nork</h3>
        <p style="margin: 2px 0 0 0; font-size: 13px; color: #525C6C;">Transitive Verbs (Du / Dut / Dit)</p>
      </div>
    </div>
    <div style="background-color: #F8FAFC; border: 2px solid #2D3543; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #1E2530;">
      60%
    </div>
  </div>
</div>
```

### Swatch 2: Active Exercise Workspace (Quiz Interface)

```html
<div style="max-width: 400px; background-color: #F8FAFC; padding: 16px; font-family: 'Inter', sans-serif; border: 1px solid #94A3B8; margin: 0 auto;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
    <span style="font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; color: #1E2530; letter-spacing: 0.05em;">NOR-NORK DRILL</span>
    <div style="flex-grow: 1; background-color: #94A3B8; height: 10px; border-radius: 999px; overflow: hidden;">
      <div style="background-color: #0A4F35; width: 40%; height: 100%; border-radius: 999px;"></div>
    </div>
    <span style="font-size: 12px; font-weight: 600; color: #1E2530;">4/10</span>
  </div>

  <div style="background-color: #FFFFFF; border: 2px solid #2D3543; border-radius: 16px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 0px 0px #2D3543;">
    <div style="background-color: #2D3543; height: 8px; width: 100%;"></div>
    <div style="padding: 20px;">
      <span style="font-size: 11px; font-weight: 700; color: #A63816; text-transform: uppercase; letter-spacing: 0.05em;">Complete the Sentence</span>
      <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #0B0F19; margin: 6px 0 12px 0; line-height: 1.2;">Zuek ni kalean ikusi ________.</h2>
      <p style="font-size: 14px; color: #1E2530; font-style: italic; margin: 0;">Context: "You (plural) saw me on the street."</p>
    </div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 12px;">
    <button style="width: 100%; height: 52px; text-align: left; padding: 0 16px; background-color: #FFFFFF; border: 2px solid #94A3B8; border-bottom: 4px solid #94A3B8; border-radius: 12px; font-size: 15px; font-weight: 600; color: #1E2530; cursor: pointer;">
      nuzue
    </button>
    <button style="width: 100%; height: 52px; text-align: left; padding: 0 16px; background-color: #FFFFFF; border: 2px solid #0A4F35; border-bottom: 4px solid #0A4F35; border-radius: 12px; font-size: 15px; font-weight: 600; color: #0A4F35; cursor: pointer;">
      nauzue
    </button>
  </div>
</div>
```

### Swatch 3: Mascot Feedback Drawer (Correct & Incorrect States)

Mini-avatar assets: `public/brand/latxa-icon-correct.svg`, `public/brand/latxa-icon-incorrect.svg`.

```html
<!-- Correct Feedback Draw State Module -->
<div style="max-width: 400px; background-color: #DCFCE7; border-top: 4px solid #14532D; padding: 16px; font-family: 'Inter', sans-serif; margin: 20px auto 0 auto; display: flex; gap: 16px; align-items: center;">
  <div style="width: 56px; height: 56px; flex-shrink: 0; background-color: #FFFFFF; border-radius: 50%; border: 2px solid #14532D; overflow: hidden; display: flex; align-items: center; justify-content: center;">
    <svg viewBox="0 0 32 32" width="44" height="44">
      <path d="M 6,12 C 6,6 26,6 26,12 C 26,20 22,26 16,26 C 10,26 6,20 6,12 Z" fill="#1E2530" />
      <path d="M 7,11 C 2,10 0,14 2,17 Z" fill="#1E2530" /><path d="M 25,11 C 30,10 32,14 30,17 Z" fill="#1E2530" />
      <path d="M 9,13 Q 12,10 14,13" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 18,13 Q 20,10 23,13" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </div>
  <div>
    <span style="font-weight: 800; color: #14532D; font-size: 16px; display: block;">✓ Oso ondo! (Correct)</span>
    <p style="margin: 2px 0 0 0; color: #14532D; font-size: 13px; line-height: 1.4;">Excellent choice. You verified the transitive singular direct object marker correctly.</p>
  </div>
</div>

<!-- Incorrect Feedback Draw State Module -->
<div style="max-width: 400px; background-color: #FEE2E2; border-top: 4px solid #991B1B; padding: 16px; font-family: 'Inter', sans-serif; margin: 12px auto 0 auto; display: flex; gap: 16px; align-items: center;">
  <div style="width: 56px; height: 56px; flex-shrink: 0; background-color: #FFFFFF; border-radius: 50%; border: 2px solid #991B1B; overflow: hidden; display: flex; align-items: center; justify-content: center;">
    <svg viewBox="0 0 32 32" width="44" height="44">
      <path d="M 6,12 C 6,6 26,6 26,12 C 26,20 22,26 16,26 C 10,26 6,20 6,12 Z" fill="#1E2530" />
      <path d="M 7,11 C 2,10 0,14 2,17 Z" fill="#1E2530" /><path d="M 25,11 C 30,10 32,14 30,17 Z" fill="#1E2530" />
      <circle cx="12" cy="13" r="2.5" fill="#FFFFFF" /><circle cx="12" cy="13" r="1" fill="#0B0F19" />
      <circle cx="20" cy="13" r="2.5" fill="#FFFFFF" /><circle cx="20" cy="13" r="1" fill="#0B0F19" />
    </svg>
  </div>
  <div>
    <span style="font-weight: 800; color: #991B1B; font-size: 16px; display: block;">✕ Berrikusi (Review)</span>
    <p style="margin: 2px 0 0 0; color: #991B1B; font-size: 13px; line-height: 1.4;">"Nuzue" indicates an intransitive root state. Transitive actions require the "nau-" structural base prefix.</p>
  </div>
</div>
```

## Appendix: independently verified contrast ratios

The pairing tables in §2 and §9 use qualitative AA/AAA bands rather than decimals (see the note at the top of this doc for why). These are the actual WCAG relative-luminance contrast ratios, computed directly from the hex values with a real contrast script rather than taken from the guide's own claims — use these, not the AA/AAA labels, if a specific number is ever needed (e.g. for a compliance record).

| Pairing | Actual ratio | §2/§9 label |
|---|---|---|
| `brand-forest` bg + white text | 9.62:1 | AAA |
| `brand-clay` bg + white text | 6.57:1 | AA |
| `brand-txakoli` bg + `neutral-900` text | 8.04:1 | AA *(mislabeled — actually clears AAA's 7:1 line)* |
| `semantic-correct` bg + white text | 9.11:1 | AAA |
| `semantic-error` bg + white text | 8.31:1 | AAA |
| `semantic-warning` bg + white text | 7.31:1 | AA *(mislabeled — actually clears AAA)* |
| dark `text-primary-dark` + card base | 13.98:1 | AAA |
| dark `semantic-correct-dark` + card base | 8.40:1 | AA *(mislabeled — actually clears AAA)* |
| dark `semantic-error-dark` + card base | 7.71:1 | AA *(mislabeled — actually clears AAA)* |
| dark `semantic-warning-dark` + card base | 8.67:1 | AA *(mislabeled — actually clears AAA)* |
| `neutral-card` white + `text-main` | 15.41:1 | AAA |
| `wool-white` bg + `text-main` | 14.73:1 | AAA |

Every pairing clears the 4.5:1 AA floor with real margin — none of the mislabeling above is dangerous, it's all conservative (nothing labeled "passing" is actually failing). The dark-mode rows were only checked against the card surface (`#1E293B`), not the base page canvas (`#0F172A`); since the canvas is darker than the card, contrast against it would only be higher, so this is very likely fine, but it hasn't actually been computed.
