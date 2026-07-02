// Latxa mascot placements — docs/VISUAL_IDENTITY.md's "Mascot placement
// plan" (round 6). `latxa-face-pozik.svg` is a face-only crop of the full
// 400×400 `latxa-logo.svg` illustration: the full body/legs/ground-shadow
// reads as illegible mud at avatar sizes (48-80px), so compact placements
// use the cropped face instead — see the crop file's own comment for the
// viewBox reasoning. `size` controls the circle's Tailwind h-/w- classes;
// callers size it per context (header banner vs. profile avatar).
export function MascotAvatar({ size = 'h-12 w-12' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-forest-tint ${size}`} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}brand/latxa-face-pozik.svg`} alt="" className="h-full w-full" />
    </div>
  )
}
