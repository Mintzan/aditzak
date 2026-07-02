// Shared icon set replacing the app's emoji touchpoints — see
// docs/VISUAL_IDENTITY.md §11 for the full system rules and the
// emoji→icon→color→component mapping this file implements. 24×24 grid,
// 2px stroke (2.5px for Check/Cross), rounded caps/joins, stroke="currentColor"
// so color comes from whatever className/style is passed in, not the icon itself.
function Icon({ children, strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function HomeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V10" />
    </Icon>
  )
}

export function ProgressIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20V13" />
      <path d="M12 20V7" />
      <path d="M20 20v-5" />
      <path d="M2.5 20h19" />
    </Icon>
  )
}

export function ProfileIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5" />
    </Icon>
  )
}

export function StreakIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3c1 3-3 4-3 7.5a3 3 0 0 0 6 0c1.5 1 2 2.7 2 4.2A6 6 0 0 1 6 15c0-3.5 2-5 3-7 0 0 1.5 1.5 3-5Z" />
    </Icon>
  )
}

export function PointsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 4h10l4 5-9 12L3 9l4-5Z" />
      <path d="M3 9h18" />
      <path d="M7 4 12 21M17 4 12 21" />
    </Icon>
  )
}

export function HeartIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9.5c0 6-8 11-8 11Z" />
    </Icon>
  )
}

export function HeartBrokenIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9.5c0 6-8 11-8 11Z" />
      <path d="M13 6.5 10.5 11l3 2-2 5.5" strokeWidth="1.6" />
    </Icon>
  )
}

export function LockIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </Icon>
  )
}

export function GateIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3 4.5 5.5v6c0 5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.5 7.5-9.5v-6L12 3Z" />
    </Icon>
  )
}

export function LightbulbIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9v.2h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z" />
    </Icon>
  )
}

export function FlagIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5.5 20.5V4" />
      <path d="M5.5 5l12-2 2.5 3-2.5 3-12-2" />
    </Icon>
  )
}

export function CheckIcon(props) {
  return (
    <Icon strokeWidth={2.5} {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </Icon>
  )
}

export function CrossIcon(props) {
  return (
    <Icon strokeWidth={2.5} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  )
}

export function EnvelopeIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 6.5 12 13l8-6.5" />
    </Icon>
  )
}

export function CloudIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 17.5a4 4 0 0 1-1-7.9 5 5 0 0 1 9.6-1.8A4.2 4.2 0 0 1 17.5 17.5H7Z" />
    </Icon>
  )
}

export function TrophyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4a2.5 2.5 0 0 0 3 3.9" />
      <path d="M17 5.5h3a2.5 2.5 0 0 1-3 3.9" />
      <path d="M12 13v3" />
      <path d="M9 20.5h6" />
      <path d="M9.5 20.5c0-1.8.7-3 2.5-3.5 1.8.5 2.5 1.7 2.5 3.5" />
    </Icon>
  )
}

export function BonusIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5Z" />
      <path d="M19 15c.25 1.75.75 2.25 2 2.5-1.25.25-1.75.75-2 2.5-.25-1.75-.75-2.25-2-2.5 1.25-.25 1.75-.75 2-2.5Z" />
    </Icon>
  )
}
