# Visual Identity & Design System Guide

**Status: Track A (palette/typography/component) fully implemented; Track B (mascot) 7 of 8 placements shipped.** This started as a from-scratch redesign specification; implementation began 2026-07-02 and is landing in small, independently-shippable PRs rather than one big rewrite. Iterations 1–5 shipped Track A in full. Iterations 6–9 shipped every mascot placement except the in-lesson error-prone-pattern callout (Haserre) — that one's blocked on a product decision about what "error-prone" means, see "Mascot placement plan" below. See "Gap analysis" below for what's changed vs. still pending.

**Mascot Core:** The Latxa Sheep (*Mutur Beltza* variety)
**Design Philosophy:** Culturally grounded, structurally precise, and companion-driven.

This guide was commissioned from an outside designer as a from-scratch visual identity (no prior brand existed — see "Gap analysis"). It went through eight review rounds before reaching this state: round 1 found a genuine WCAG contrast failure (`brand-clay` on white text, 3.33:1) and a four-way inconsistent dark-neutral scale; round 2 fixed both and added the missing lesson-card mockup and a dedicated favicon-scale mark, but its "mathematically verified" contrast ratios didn't match independent recomputation (always in the safe direction — nothing that claimed to pass actually failed, but the specific decimals were invented); round 3 replaced the fabricated decimals with qualitative AA/AAA bands and fixed a table-column mismatch; round 4 reconciled a separately-delivered expression-library catalog that had drifted back onto the pre-fix palette and anatomy, and rejected two of its four proposed mascot triggers for conflicting with §7's anti-guilt voice principle (see §1C); round 5 audited the guide against the actual React components (`ExerciseScreen.jsx`, `HomeScreen.jsx`, `badges.jsx`, `data/verbs.js`) rather than just the guide's own internal consistency, and closed every gap that surfaced — the grammar-badge color system, the hearts-palette question, the button/card geometry, the motion timings, font loading, and icon-system scope; round 6 settled the one question round 5 explicitly couldn't — the mascot system is greenlit, and is to be a central, not incidental, part of the app (see "Mascot placement plan"). round 7 revisits round 5's "emoji stay" call now that the mascot is central, and proposes a 17-icon system to replace every emoji touchpoint — documented and asset-complete (§11), but deliberately not wired into any component yet, since that's real `src/` engineering work belonging to a separate implementation pass. **Round 8 adds worked before/after examples (§12) showing what §2/§5/§11 look like applied together to three real, currently-shipped components** — rendered and verified, not hypothetical, and explicit about what does *and doesn't* change (two of four header pills are correctly left untouched, card radius stays 16px while only buttons drop to 12px). The content below is the reconciled, component-checked, scope-decided version. If these tokens are ever needed for a compliance artifact, re-verify the specific ratios with a real contrast checker (WebAIM, `axe`) rather than citing the labels here.

## Gap analysis: what this changes

The app currently has **no formal design system** — styling is ad hoc Tailwind utility classes applied per-component, spanning roughly 10 distinct hues across `ExerciseScreen.jsx`, `HomeScreen.jsx`, `badges.jsx`, and `data/verbs.js`. Full per-component mapping is in §2's "Full Current-Component Color Mapping" table; summary:

| Existing element | Current styling | This guide proposes | Status |
|---|---|---|---|
| `Stars` | `text-amber-400` | `brand-txakoli` (`#EAB308`) — coincidentally almost the same hue, low-risk swap | **Shipped (iteration 5)** |
| Primary buttons (~15 instances), `ProgressBar` fill | `bg-green-500` | `brand-forest` (`#0A4F35`) — a real visual-weight shift, darker/more muted than today; see §2's hover-state note | **Shipped (iteration 3)** |
| Correct/incorrect answer states (4 separate style objects in `ExerciseScreen.jsx`) | `border-green-500`/`border-red-500` tint triads | `semantic-correct`/`semantic-error` | **Shipped (iteration 3)** |
| `DialectBadge` | `bg-gray-100` / `text-gray-500` | **No change** — already an equivalent match | N/A |
| `HeartsBadge` | `bg-rose-100` / `text-rose-600` | **No change** — formalized as `accent-hearts`, a deliberate standalone exception (§2) | N/A |
| `TYPE_META`/`AGREEMENT_META` (`data/verbs.js`) — 5 more hues (`indigo`/`rose`/`blue`/`purple`/`amber`) | assorted Tailwind colors | Reuses the 3 brand colors for NOR/NORI/NORK; verb type moves to a value distinction instead of a hue (§2) | **Shipped (iteration 4)** |
| Streak/points/bonus pills, streak-repair card | `orange`/`sky`/`violet` | `brand-clay`/`brand-txakoli`/`semantic-warning` per §2's mapping table | **Shipped (iteration 4)** |
| Button/card geometry | uniform `rounded-2xl` (16px) everywhere, flat fill + `active:scale-[0.98]` | Buttons move to 12px radius; cards keep 16px; the "keycap" button style from earlier drafts is dropped in favor of the app's existing, working press pattern (§5) | **Shipped (iteration 3)** |
| Fonts | none loaded (browser default) | Space Grotesk/Inter — needs an actual `<link>` addition, not just a token (§4) | **Shipped (iteration 1)** |
| Icons | ~15 emoji touchpoints app-wide | 18-icon SVG system (§11) wired into every documented touchpoint except the mascot's own nine placements (§1C's "Mascot placement plan") and the celebratory streak-encouragement emoji, which stay as-is | **Shipped (iteration 2)** |
| Logo / favicon | placeholder `public/favicon.svg`, `public/icons.svg` | full mascot SVG (§1A) + dedicated small-scale mark (§1B) — assets exist in `public/brand/` | **Shipped (iteration 1)** — live favicon only; the full mascot SVG rollout is still the separate Mascot Placement Plan below |
| Mascot / character | none | full mascot system, **decided (round 6) to be a central part of the app** — see "Mascot placement plan" below, not just the feedback-drawer micro-moments §1C originally scoped | **In progress** — 7 of 8 placements shipped (iterations 6–9); only the in-lesson callout remains, blocked on a product decision |
| 3-star confetti/firework celebration | independent 7-color rainbow | **No change, deliberately** — see §6 | N/A |

## Mascot placement plan (round 6)

**Decision: the mascot is a central part of the app, not an incidental accent.** This supersedes §1C's original framing (mascot = two feedback-drawer avatars, everything else "if and when" greenlit) — it's greenlit, and its footprint is meant to span the app's major screens, not just answer-level micro-feedback. Concrete placements, using the four expressions already built (§1C) with no new artwork required to start:

| Screen / moment | Component | Expression | Notes | Status |
|---|---|---|---|---|
| Home tab header | `HomeScreen.jsx` → `JourneyTab` | Pozik | Currently just "Aditzak" as text + stat pills, no face at all. Becomes the dashboard's visual anchor. | **Shipped (iteration 6)** |
| Lesson preview (before a lesson's first attempt) | `ExerciseScreen.jsx` → `LessonPreviewScreen` | Pozik | Currently zero character presence. A "let's do this together" greeting alongside the conjugation-table preview. | **Shipped (iteration 6)** |
| Answer feedback drawer | `ExerciseScreen.jsx` → `FeedbackBar` | mini correct/incorrect avatars | Already scoped in §1C/§10 Swatch 3 — replaces the plain ✓/✕ text glyphs. | **Shipped (iteration 7)** |
| Lesson results screen | `ExerciseScreen.jsx` → `LessonResultsScreen` | Gora! (strong result) / Pozik (solid) / Nekatuta (weak) | The app's biggest single moment, currently a generic emoji in a circle (`getEncouragement`'s icon) with zero mascot presence. Maps onto the score bands `getEncouragement`/`computeStars` already compute — no new scoring logic needed, just a mascot chosen per existing band. Weak results get Nekatuta's established "let's review together" meaning, not a scolding face — stays inside §7's anti-guilt rule. | **Shipped (iteration 8)** — 3 stars→Gora!, 2/1 stars→Pozik, 0 stars→Nekatuta |
| In-lesson error-prone-pattern callout | `ExerciseScreen.jsx` (question prompt area) | Haserre | Already scoped in §1C. | **Blocked** — "error-prone pattern" trigger not yet defined, needs a product decision (iteration 10) |
| Progress tab, low-accuracy indicator | `HomeScreen.jsx` → `ProgressTab` | Nekatuta | Already scoped in §1C, using `bestScore` data `progressStorage` already tracks. | **Shipped (iteration 9)** |
| Profile tab avatar | `HomeScreen.jsx` → `ProfileTab` | Pozik | Currently a plain 🧑‍🎓 emoji. Swaps for the mascot as the "this is your companion" anchor on the screen most tied to the learner's own progress. | **Shipped (iteration 6)** |
| Onboarding / language selection | `App.jsx` → `LanguageOnboardingScreen` | Pozik | First screen a new user sees — a first-impression mascot moment, not previously in scope at all. | **Shipped (iteration 6)** |

Everything in this table uses the four expressions and two mini-avatars already built and reconciled onto the canonical palette (§1C) — no new artwork is required to execute the plan as listed. If a placement later needs a state none of the four cover (e.g. a dedicated "onboarding wave" pose), that's a new-asset decision to make explicitly when it comes up, not to assume now.

## Open scope questions

1. Tailwind 4 here has no `tailwind.config.js` (theme via the Vite plugin) — implementation will need to route these tokens through `@theme` in `src/index.css`, not a config file.

**Resolved in round 5:** the hearts/`rose` palette question (§2, `accent-hearts`), the grammar-category badge colors (§2), the button/card geometry mismatch (§5), the motion-timing mismatch (§6), missing font loading (§4), and icon-system scope (§1C, revised further below).

**Resolved in round 6:** whether the mascot system gets built at all — yes, and centrally (see placement plan above). This was the one item round 5 explicitly couldn't resolve on its own; every mascot-adjacent spec that was previously written as conditional (§6's mascot motion, §8's dual-indicator rule) is now unconditional — see those sections.

**Recommended path, revised:** two independent tracks, neither blocking the other. **Track A (palette/typography/component, §2–5):** apply the §2 color mapping table component-by-component (verifying each new tint/text pairing's contrast as built, not assumed), add font loading (§4), drop button radius to 12px (§5) — bounded, touches two screen files' worth of color/class changes. **Track B (mascot placement, this section):** build/wire the nine placements above — bigger in component-count (new avatar components across five screens) but each individual placement is small and the artwork already exists. Track A can ship first and independently; Track B doesn't need to wait for it, but doing A first means Track B's components are being wired into already-correct colors instead of code that gets touched twice.

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

Asset file: `public/brand/latxa-icon.svg` — **shipped as the live site favicon in implementation iteration 1** (`public/favicon.svg`'s content now matches this mark).

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

**Round 6 update:** neither trigger was wired into any screen as of round 5, when this only settled what the mascot was *allowed* to represent pending the scope decision. That decision is now made (see "Mascot placement plan" near the top of this doc) — both triggers are on the build list.

**Relationship to the §1B favicon-scale mark:** the mini circular avatars used in §10 Swatch 3 (`latxa-icon-correct.svg`/`latxa-icon-incorrect.svg`) and this expression library are not redundant with each other. The mini avatars are the high-frequency, low-detail, 32px-viewBox icon for the per-answer feedback drawer. The expression library is the low-frequency, high-detail, 400px-viewBox illustration for larger, rarer moments (dashboard/home state, lesson-complete or streak-milestone screens, and — per the adopted triggers above — in-lesson pattern callouts and Progress-tab review indicators). Same character, two deliberately different resolutions for two different UI contexts.

**Icon system scope (round 5, updated round 6, superseded round 7):** every icon in the app today — nav bar, streak, points, lock, gate shield, lightbulb, flag, checkmark/cross, envelope, cloud-sync, trophy, bonus sparkle, roughly 15 touchpoints total — is a native emoji, not a vector icon. Rounds 5–6 decided emoji should stay everywhere the mascot placement plan doesn't explicitly reach, on the grounds that replacing working icons had no demonstrated benefit. **Round 7 revisits that call** — see §11 for the full 17-icon proposal and rationale for why the calculus changed once the mascot became central. §11 is documentation/assets only for now; nothing below this note or in the component code has changed.

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

**Implementation status: fully shipped.** Primary buttons and correct/incorrect states landed in iteration 3 (with the matching 12px button radius from §5); the grammar-badge rows, streak/points/bonus pills, and both hint-text rows landed in iteration 4. Every row in this table is now applied in `src/`.

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

- **Buttons:** keep the existing flat solid-fill + `active:scale-[0.98]` press pattern. Adopt 12px corner radius (down from the app's current uniform `rounded-2xl`/16px) to differentiate buttons from cards. Minimum 48px height (already the app's standard, `style={{ minHeight: 48 }}` throughout — no change needed there). **Shipped** across implementation iterations 3 (primary-button/feedback-triad elements) and 4 (the streak-repair button).
- **Cards & Canvas Framework:** 16px corner radius (matches the app's current `rounded-2xl` — no change needed here, cards keep their existing radius, only buttons shrink to 12px to create the differentiation above).
- **Grammar Tags / Badges:** capsule shape (`border-radius: 999px`), fixed 24px vertical height — this is a real change from the app's current badges, which use `rounded-full` (equivalent capsule shape, so also effectively no change) at a slightly taller `px-2.5 py-1` padding; fine to standardize on the guide's 24px figure.

## 6. Motion Principles

**Revised in round 5:** the original numbers here (0.98→1.03→1.0/200ms celebration, ±6px/three-cycle/250ms correction) were never checked against the app's actual, already-shipped animations and don't match them. Rather than force a rewrite of tuned, working CSS to hit invented numbers, this section now documents what's real and reserves new numbers only for motion that doesn't exist yet.

- **Correction Response (existing, unchanged):** `animate-shake` in `src/index.css` — 400ms, an asymmetric 5-step wobble (−1px, 2px, −4px, 4px, −4px), not a flat ±6px/three-cycle pattern. This is already applied to incorrect answer options/inputs/word-chips app-wide; keep it as-is.
- **Celebration Response, per-answer (existing, unchanged):** `animate-flash` in `src/index.css` — 350ms, scale 1 → 1.04 → 1. Already applied to correct answer options/inputs.
- **Celebration Response, mascot-specific (new, not yet built, now planned — round 6):** the mascot's own reaction — ear-tilt on correct, eyebrow/expression change on incorrect — is new motion with no existing precedent to reconcile against. The original 0.98→1.03→1.0/200ms figure is kept here, scoped specifically to a mascot avatar's own reaction (the feedback-drawer mini avatars, per the placement plan), not to the answer-option flash/shake above, which stay on their own already-shipped timings regardless.
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

- **Dual-Indicator Rule:** interface state updates (correct/incorrect/cautionary) are never communicated by color alone — pair with an explicit mark (check/×) and, per the round-6 mascot decision, a corresponding mascot expression change at the placements named in the placement plan, as a third reinforcing signal on top of color and mark.
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

## 11. Iconography System (round 7 — shipped in implementation iteration 2)

**Status: implemented.** This reverses round 5's "emoji stay app-wide, outside the mascot's placements" decision — that call was reasonable when the mascot was still confined to two micro-moments, but with the mascot now central (round 6) and occupying its own distinct visual register, bare emoji sitting alongside it reads as more inconsistent than it did before. Assets exist (`public/brand/icons/*.svg`, 18 files) and are wired into `src/` as React components (`src/components/icons.jsx`) at every documented touchpoint in `badges.jsx`, `ExerciseScreen.jsx`, and `HomeScreen.jsx` — see `docs/DECISIONS.md`'s iteration-2 entry for the full list and what was deliberately left as emoji (the `✕`/`×` dismiss glyphs, the celebratory streak-encouragement set, the plain `★` stars pill). `icon-repeat.svg`/`RepeatIcon` was added after initial shipping — the round-5 component audit missed `describeLesson`'s review-lesson icon (🔁, `lessonDisplay.js`), a separate emoji touchpoint from the `LessonNode`/`PendingUnitCard` lock/gate/heart-broken icons it did catch.

Also note: the "proposed color (existing context)" column below reflects the icon system's *original* color-scoping decision (ambient Tailwind colors, deliberately not the brand palette — see the scoping note above). Iterations 3–4 have since migrated many of those same elements' colors to `brand-*`/`semantic-*` tokens (the streak/points pills, `TYPE_META`/`AGREEMENT_META`, etc.) — since every icon uses `stroke="currentColor"`, they picked up their container's new color automatically as a side effect, with no icon-file changes needed. `docs/DECISIONS.md`'s iteration 3/4 entries are the authoritative record of current colors; this table's color column is now historical (what iteration 2 shipped), not current-state.

### System rules

- **24×24 viewBox**, 2px stroke (2.5px for `icon-check`/`icon-cross`, which need to read at a glance), rounded caps and joins throughout.
- **Stroke-based outlines, not filled glyphs** — deliberately a different register from the mascot's solid-fill illustration style, so "character" (mascot) and "function" (icon) don't visually compete for attention.
- **`stroke="currentColor"`** in every file — color is set by whatever embeds the icon (a wrapping element's `color`/`style`, or a Tailwind `text-*` class once inlined as JSX), not baked into the asset.
- **Color scoping decision:** icons use whatever Tailwind color is *already* present at each usage site (e.g. the streak icon picks up the same orange the streak pill's background/text already uses) — **not** the brand tokens from §2's color-mapping table. Track A (the full brand-palette migration) is still a separate, unimplemented decision; wiring icons to brand hex values now would create visible mismatches (an icon in brand-clay terracotta sitting inside a still-orange Tailwind pill) until Track A actually ships. Icons and the palette migration are independent tracks that happen to both be about color — treat them as such.

### Full mapping

Every emoji touchpoint found in the round-5 component audit, plus one gap it missed (`FeedbackBar`'s plain-text ✓/✕ status glyphs, included here for consistency since they're adjacent to the flag icon already being swapped).

| Current emoji | Icon asset | Proposed color (existing context) | Where |
|---|---|---|---|
| 🏠 | `icon-home.svg` | inherits `BottomNav`'s existing active (`text-green-600`)/inactive (`text-gray-400`) logic | `HomeScreen.jsx` `NAV_ITEMS` |
| 📊 | `icon-progress.svg` | same as above | `NAV_ITEMS` |
| 🧑‍🎓 | `icon-profile.svg` | same as above (nav); `text-green-600` (Profile tab avatar, inside its `bg-green-100` circle) | `NAV_ITEMS`; `ProfileTab` |
| 🔥 | `icon-streak.svg` | `text-orange-600` (header pill, matches its `bg-orange-100`); `text-orange-500` (Profile stat card) | Header streak pill; `ProfileTab` |
| 💎 | `icon-points.svg` | `text-sky-600`/`text-sky-700` (matches existing `bg-sky-100 text-sky-700` contexts) | Header points pill; `ProfileTab`; `LessonResultsScreen` points chip |
| ❤️ | `icon-heart.svg` | `text-rose-600` — **no change**, already the color there | `HeartsBadge` (`badges.jsx`) |
| 💔 | `icon-heart-broken.svg` | `text-gray-500` (small `LessonNode` locked-circle context, matches neighboring lock/gate icons); `text-rose-400` (large standalone icon in `OutOfHeartsOverlay`/`HeartsLockedModal`) | `LessonNode`; `OutOfHeartsOverlay`; `HeartsLockedModal` |
| 🔒 | `icon-lock.svg` | `text-gray-500` (matches existing locked-circle treatment) | `LessonNode`; `PendingUnitCard` |
| 🛡️ | `icon-gate.svg` | `text-gray-500` (same context as lock — still a "locked" state, different reason) | `LessonNode`; `PendingUnitCard` |
| 💡 | `icon-lightbulb.svg` | `text-green-600` (matches `ExplanationToggle`'s existing `text-green-700` button) | `ExplanationToggle` |
| 🚩 | `icon-flag.svg` | `text-gray-400`, inherits hover via `currentColor` (matches existing `hover:text-gray-600`) | `FeedbackBar` report button |
| ✓ / ✕ (plain glyphs) | `icon-check.svg` / `icon-cross.svg` | `text-green-700` / `text-red-700` (matches the element's existing text color) | `FeedbackBar` status icon (only when no `streakEncouragement.icon` is present — that's a dynamic per-milestone icon from `lessonLogic.js`, out of scope) |
| ✅ | `icon-check.svg` | `text-green-600` | `FeedbackModal`, `FlagQuestionModal` success states |
| 📧 | `icon-envelope.svg` | `text-gray-400` | `AccountModal` "sent" step |
| ☁️ | `icon-cloud.svg` | `text-sky-500` | `AccountSection` (both signed-in and signed-out variants) |
| 🏆 | `icon-trophy.svg` | `text-amber-500` | `ProfileTab` longest-streak stat |
| ✨ | `icon-bonus.svg` | `text-violet-600` (matches existing `bg-violet-100 text-violet-700`) | `UnitLessons` bonus label |
| 🔁 | `icon-repeat.svg` | inherits `LessonNode`'s existing white-on-`bg-brand-forest` circle (available) / `neutral-600`-on-`neutral-400` circle (locked) — same container the letter/emoji practice-lesson icons already use | `LessonNode`, review lessons only (`lesson.review`) |

### Implementation note for whoever picks this up

The natural shape for this in a React+Tailwind codebase is a shared `src/components/icons.jsx` exporting one small functional component per icon (props passed through to a wrapping `<svg>`, `stroke="currentColor"` already baked in), not `<img src="...">` tags — that lets the color-scoping table above map directly to `className="h-5 w-5 text-orange-600"`-style usage at each call site, consistent with how the rest of the app already styles everything through Tailwind utility classes. This wasn't built as part of this round since it means touching `HomeScreen.jsx`/`ExerciseScreen.jsx`/`badges.jsx` directly, which was explicitly out of scope for a documentation-only pass.

## 12. Before/After: Applying the Guide to Real Components

**Status: mostly shipped.** Every other section documents individual token/color/geometry decisions in isolation. This section shows what applying several of them *together* actually looks like against three real, currently-shipped components — rendered and verified, not just described. Each "before" is the component's real pre-migration markup/classes; each "after" applies §2 (palette), §5 (geometry), §11 (icons), and, for the third example, the mascot mini-avatar already built in §10. Examples 1–3 (icon swaps, the streak/points pill colors, and the palette+radius shift) are all now live (iterations 2–4); Example 3's mascot mini-avatar is still pending — the mascot rollout hasn't started.

### Example 1: Home header pills

The header's four stat pills (`HomeScreen.jsx`).

| | Streak | Stars | Points | Hearts |
|---|---|---|---|---|
| **Before** | 🔥 in `bg-orange-100`/`text-orange-600` | ★ in `bg-amber-100`/`text-amber-700` | 💎 in `bg-sky-100`/`text-sky-700` | ❤️ in `bg-rose-100`/`text-rose-600` (`accent-hearts`) |
| **After** | `icon-streak` in a `brand-clay` tint pill | **unchanged** — ★ is a plain Unicode glyph, not a pictographic emoji, so it was never in §11's scope; still amber | `icon-points` in a `brand-txakoli` tint pill | **unchanged** — `accent-hearts` already decided to stay as-is (§2) |

```html
<!-- Before -->
<span style="border-radius:999px;background:#FFEDD5;padding:6px 10px;color:#EA580C;font-weight:700;">🔥 7</span>

<!-- After -->
<span style="border-radius:999px;background:#FBE8E0;padding:6px 10px;color:#A63816;font-weight:700;">
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#A63816" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3-3 4-3 7.5a3 3 0 0 0 6 0c1.5 1 2 2.7 2 4.2A6 6 0 0 1 6 15c0-3.5 2-5 3-7 0 0 1.5 1.5 3-5Z"/></svg> 7
</span>
```

Notably, **not every pill changes** — this is the point of documenting real application rather than a hypothetical: two of the four pills (stars, hearts) are correctly left alone because they were never in scope for either the palette migration or the icon system, and pretending otherwise would overstate what this guide actually calls for.

### Example 2: Lesson card (`LessonNode`)

| | Before | After |
|---|---|---|
| Avatar circle (available lesson) | `bg-green-500` | `bg-brand-forest` (`#0A4F35`) |
| Avatar circle (locked lesson) | `bg-gray-300`, 🔒/🛡️/💔 emoji | `bg-neutral-400`-ish gray, `icon-lock`/`icon-gate`/`icon-heart-broken` in `neutral-600` |
| Card border/radius | `border-gray-200`, 16px | `border-neutral-800`, 16px — **unchanged radius**, only buttons drop to 12px per §5, not cards |
| Stars | amber, unchanged | amber, unchanged (same reasoning as Example 1) |

The locked-state icon swap is the clearest single win in this example — three different emoji (🔒/🛡️/💔) sharing one gray circle treatment become three icons sharing one `neutral-600` stroke color, which reads as one coherent "locked" language instead of three unrelated pictures that happen to be gray-adjacent.

### Example 3: Exercise feedback (`AnswerOption` + `FeedbackBar`)

| | Before | After |
|---|---|---|
| Correct option | `border-green-500 bg-green-50 text-green-700`, 16px radius | `semantic-correct` triad, **12px radius** (§5) |
| Feedback drawer | `bg-green-50`, plain "✓" text glyph, `bg-green-500` Continue button | `semantic-correct` drawer, `icon-check` svg, mascot mini-avatar (`latxa-icon-correct.svg`, already built in §10) sitting alongside the checkmark rather than replacing it, `brand-forest` Continue button at 12px radius |

This is the example that most shows the guide's pieces working *together*: the palette shift (bright saturated green → darker forest green) is visually the biggest change, the radius drop is a subtle but consistent structural signal, and the mascot avatar adds the companion-driven personality none of the other tracks provide on their own. None of the three tracks alone produces this result — it's what "central mascot" (round 6) plus "real palette" (§2) plus "real geometry" (§5) look like stacked on one actual component.

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
