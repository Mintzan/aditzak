# Visual Identity & Design System Guide

**Status: proposed — not yet implemented.** This is a redesign specification, not a description of the current UI. Nothing in the codebase has been touched to match it yet. See "Gap analysis" below for what changes and "Open scope questions" for what needs a product decision before implementation starts.

**Mascot Core:** The Latxa Sheep (*Mutur Beltza* variety)
**Design Philosophy:** Culturally grounded, structurally precise, and companion-driven.

This guide was commissioned from an outside designer as a from-scratch visual identity (no prior brand existed — see "Gap analysis"). It went through three review rounds before acceptance: round 1 found a genuine WCAG contrast failure (`brand-clay` on white text, 3.33:1) and a four-way inconsistent dark-neutral scale; round 2 fixed both and added the missing lesson-card mockup and a dedicated favicon-scale mark, but its "mathematically verified" contrast ratios didn't match independent recomputation (always in the safe direction — nothing that claimed to pass actually failed, but the specific decimals were invented); round 3 replaced the fabricated decimals with qualitative AA/AAA bands and fixed a table-column mismatch. The content below is the accepted round-3 version. If these tokens are ever needed for a compliance artifact, re-verify the specific ratios with a real contrast checker (WebAIM, `axe`) rather than citing the labels here.

## Gap analysis: what this changes

The app currently has **no formal design system** — styling is ad hoc Tailwind utility classes applied per-component. Concretely, as of this writing (`src/components/badges.jsx`):

| Existing element | Current styling | This guide proposes |
|---|---|---|
| `Stars` | `text-amber-400` | `brand-txakoli` (`#EAB308`) — coincidentally almost the same hue, low-risk swap |
| `ProgressBar` fill | `bg-green-500` | `brand-forest` (`#0A4F35`) |
| `DialectBadge` | `bg-gray-100` / `text-gray-500` | `neutral-400`/`neutral-600` scale |
| `HeartsBadge` | `bg-rose-100` / `text-rose-600` (shipped as of the hearts economy, issue #534) | **Not covered by this guide at all** — see open question below |
| Everything else (type/agreement/dialect badge colors, `TYPE_META`/`AGREEMENT_META` in `src/data/verbs.js`) | assorted Tailwind palette colors | not addressed — this guide only specifies brand/semantic/neutral tokens, not the grammar-category color-coding system |
| Logo / favicon | placeholder `public/favicon.svg`, `public/icons.svg` | full mascot SVG (§1A) + dedicated small-scale mark (§1B) |
| Mascot / character | none | full mascot system with per-state expressions and animation (§1, §6) |

The heart economy (issues #529–#535) shipped in full since this guide was drafted — hearts UI, lockout, purchase flow, and cross-device sync are all live using a `rose` palette this guide never considered. Any implementation pass needs to either fold hearts into the new semantic-warning token or explicitly decide rose stays as a deliberate exception.

## Open scope questions (resolve before implementing)

1. **Mascot/animation system is a product decision, not a styling decision.** This guide specifies per-feedback-state facial expressions and ear-rotation animation — that's meaningfully more engineering surface than a color/type token swap, and nothing like it exists today. Decide explicitly whether Aditzak becomes a mascot-driven app before building it; don't let it get absorbed silently into a "palette update."
2. **`HeartsBadge`'s rose palette isn't reconciled.** Either fold hearts styling into `semantic-warning`/`brand-clay`, or document rose as an intentional exception alongside the other tokens.
3. **Grammar-category badge colors (`TYPE_META`, `AGREEMENT_META`, `DIALECT_LABELS` in `src/data/verbs.js`) are out of scope for this guide** and will need their own pass to move onto the new neutral/semantic scale.
4. Tailwind 4 here has no `tailwind.config.js` (theme via the Vite plugin) — implementation will need to route these tokens through `@theme` in `src/index.css`, not a config file.

**Recommended path:** adopt the palette, typography, and component tokens (§2–5) now — that's a low-risk, incremental upgrade over the current ad hoc Tailwind classes. Treat the mascot/animation system (§1, §6) as a separate, explicitly-scoped decision to make later rather than building it as part of the same pass, given the engineering lift called out in question 1.

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

**Known inconsistency:** the drop-shadow ellipse uses `#E2E8F0`, a gray that isn't one of the five tokens in the §3 canonical scale. It's a light shadow tint rather than a "dark neutral" so it doesn't violate §3's letter, but it is an undocumented sixth gray value — worth folding into the scale (or explicitly declaring "shadow tints are exempt from §3") before this becomes a pattern other components copy.

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
| semantic-warning | `#9A3412` | Streak In Jeopardy Outline Frame | White Text | Passes AA |

## 3. Canonical Dark-Neutral Scale

A single 5-step monochromatic scale, replacing what was originally four inconsistent ad hoc dark grays (`#374151`/`#111827`/`#1F2937`/`#2D3748`) across the draft. Do not introduce other dark values.

- **neutral-950 (Ink Black) → `#0B0F19`** — code snippet backgrounds, deep layout border details, pitch-black line paths.
- **neutral-900 (Latxa Charcoal / Mascot Face) → `#1E2530`** — canonical **Text Main** token; all primary body text and heavy UI labels.
- **neutral-800 (Charcoal Border) → `#2D3543`** — interactive element outlines, tactile button border offsets.
- **neutral-600 (Text Muted) → `#525C6C`** — secondary hints, grammar category labels, metadata descriptions.
- **neutral-400 (UI Borders) → `#94A3B8`** — decorative lines, inactive card dividers, disabled framework states.

## 4. Typography System

- **Heading Font Family:** Space Grotesk (geometric open-source sans-serif).
- **Body & UI Label Font Family:** Inter (optimized readability inside dense micro-layouts).

### Mobile Scale Constraints (root 16px)

- `--text-2xl` (24px, SemiBold): success headings, modal milestone banners.
- `--text-xl` (20px, Bold): lesson block drill questions.
- `--text-lg` (18px, Medium): lesson card titles, drawer subheadings.
- `--text-base` (16px, Regular): core structural grammar rules and hints.
- `--text-sm` (14px, SemiBold): multiple-choice options, actionable button labels.
- `--text-xs` (12px, Bold, Uppercase): case category identifiers (NOR, NORK, NORI).

## 5. Component Styling Conventions

All structural elements are built to render safely inside tight mobile displays (**400px maximum width window**, matching the app's existing `max-w-md` layout constraint).

- **Tactile Buttons:** fixed 52px height frame, 12px corner radius. Uses a physical 3px bottom-border offset (`border-bottom: 3px solid <token>`) rather than color gradients, to simulate a tactile click on tap.
- **Cards & Canvas Framework:** 16px corner radius with a subtle bottom-only flat drop shadow to establish depth layering.
- **Grammar Tags:** capsule shape (`border-radius: 999px`), fixed 24px vertical height.

## 6. Motion Principles

- **Celebration Response:** scale transform (0.98 → 1.03 → 1.0) over 200ms; mascot ear paths tilt up 10°.
- **Correction Response:** horizontal shake (±6px), three cycles, 250ms.
- **Layout Navigation Transitions:** content slides right-to-left over 300ms on screen changes, evoking movement along a mountain trail.

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

- **Dual-Indicator Rule:** interface state updates (correct/incorrect/cautionary) are never communicated by color alone — pair with an explicit vector mark (check/×) and a corresponding mascot expression change.
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
