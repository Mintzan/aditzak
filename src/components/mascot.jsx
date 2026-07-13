// Latxa mascot placements — docs/technical/VISUAL_IDENTITY.md's "Mascot placement
// plan" (round 6). `latxa-face-*.svg` are face-only crops of the full
// 400×400 expression illustrations (`latxa-logo.svg`/`latxa-expression-
// gora.svg`/`latxa-expression-nekatuta.svg`/`latxa-expression-haserre.svg`):
// the full body/legs/ground-shadow reads as illegible mud at avatar sizes
// (24-80px), so compact placements use the cropped faces instead — see
// each crop file's own comment for the viewBox reasoning. `size` controls
// the circle's Tailwind h-/w- classes; callers size it per context.
// `expression` selects which cropped face to show — 'pozik' (default) is
// the 4 static placements from iteration 6; 'gora'/'nekatuta' are the
// lesson-results score-band mascot (iteration 8) and the Progress-tab
// indicator (iteration 9); 'haserre' is the in-lesson error-prone-pattern
// callout (iteration 10).
const EXPRESSION_ASSETS = {
  pozik: 'latxa-face-pozik.svg',
  gora: 'latxa-face-gora.svg',
  nekatuta: 'latxa-face-nekatuta.svg',
  haserre: 'latxa-face-haserre.svg',
}

export function MascotAvatar({ size = 'h-12 w-12', expression = 'pozik' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-forest-tint ${size}`} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}brand/${EXPRESSION_ASSETS[expression]}`} alt="" className="h-full w-full" />
    </div>
  )
}

// Feedback-drawer mini avatar (§10 Swatch 3 / §12 Example 3) — unlike
// `MascotAvatar` above, `latxa-icon-correct.svg`/`-incorrect.svg` are
// already purpose-built for small sizes (32px viewBox, no body/legs), so
// no crop is needed here. Sits alongside the drawer's existing check/cross
// icon and headline per §12's explicit "sitting alongside... rather than
// replacing it" — not a replacement for either. `animate-mascot-react`
// (src/index.css) is the 0.98→1.03→1.0/200ms reaction motion §6 reserved
// specifically for this placement.
export function FeedbackMascotAvatar({ isCorrect }) {
  const src = isCorrect ? 'latxa-icon-correct.svg' : 'latxa-icon-incorrect.svg'
  const border = isCorrect ? 'border-semantic-correct' : 'border-semantic-error'
  return (
    <div
      className={`animate-mascot-react flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-white p-1.5 ${border}`}
      aria-hidden="true"
    >
      <img src={`${import.meta.env.BASE_URL}brand/${src}`} alt="" className="h-full w-full" />
    </div>
  )
}
