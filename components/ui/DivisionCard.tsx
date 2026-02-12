import type { Division } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

/**
 * Props for the DivisionCard component.
 * @property division     - A Division object from the DIVISIONS array in constants.
 * @property shimmerIndex - Index used to stagger the shimmer delay on coming-soon cards.
 */
interface DivisionCardProps {
  division: Division
  shimmerIndex?: number
}

/**
 * A card that represents a single NeoByteStudios division.
 *
 * - **Active divisions** are wrapped in an `<a>` tag linking to the division URL.
 *   They have an energetic hover effect: slight scale-up and a brighter glow.
 * - **Coming-soon divisions** are rendered as a plain `<div>` (not clickable).
 *   They feel mysterious with reduced opacity that increases on hover.
 *
 * The left border and name use the division's accent color.
 * A colored box-shadow glow appears on hover via a CSS custom property.
 *
 * This is a **server component** — all hover effects are pure CSS.
 */
export default function DivisionCard({ division, shimmerIndex = 0 }: DivisionCardProps) {
  const isActive = division.status === 'active'

  /* ── Shared card content ──────────────────────────────────────── */
  const cardContent = (
    <>
      {/* Division icon */}
      <span className="text-3xl" role="img" aria-label={division.name}>
        {division.icon}
      </span>

      {/* Division name in its accent color */}
      <h3
        className="mt-3 text-lg font-semibold"
        style={{ color: division.color }}
      >
        {division.name}
      </h3>

      {/* Tagline */}
      <p className="mt-1 text-sm text-text-secondary">{division.tagline}</p>

      {/* Description */}
      <p className="mt-2 text-sm text-text-muted">{division.description}</p>

      {/* Status badge */}
      <div className="mt-4">
        <Badge status={division.status} color={division.color} />
      </div>
    </>
  )

  /* ── Shared styles ────────────────────────────────────────────── */
  const baseClasses =
    'flex flex-col rounded-xl border-l-2 border-border bg-bg-card p-6 transition-all duration-300'

  /* ── Inline style with CSS custom property for the hover glow ── */
  const cardStyle: React.CSSProperties = {
    borderLeftColor: division.color,
    '--card-glow': `0 0 20px ${division.color}33, 0 0 40px ${division.color}15`,
    /* Active cards get a subtle coloured top edge via a gradient border image */
    ...(isActive && {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderImageSource: `linear-gradient(to right, ${division.color}4D, transparent)`,
      borderImageSlice: 1,
    }),
    /* Coming-soon cards get a slight desaturation to feel "not yet activated" */
    ...(!isActive && {
      filter: 'saturate(0.7) brightness(0.95)',
      '--shimmer-delay': `${shimmerIndex * 0.8}s`,
    }),
  } as React.CSSProperties

  /* ── Active: clickable link with energetic hover ──────────────── */
  if (isActive) {
    return (
      <a
        href={division.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} cursor-pointer hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`}
        style={cardStyle}
      >
        {cardContent}
      </a>
    )
  }

  /* ── Coming soon: non-clickable with shimmer + subtle mystery effect */
  return (
    <div
      className={`${baseClasses} card-shimmer cursor-default overflow-hidden opacity-80 hover:opacity-100`}
      style={cardStyle}
    >
      {cardContent}
    </div>
  )
}
