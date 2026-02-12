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
 *   They have an energetic hover effect: slight scale-up, a brighter glow, and an
 *   animated border-drawing effect that traces a glowing line around the card perimeter.
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
      {/* Division icon — active cards scale+rotate on hover, coming-soon cards pulse */}
      <span
        className={`text-3xl transition-transform duration-300 ${
          isActive
            ? 'group-hover:scale-115 group-hover:rotate-3'
            : 'group-hover:scale-105'
        }`}
        role="img"
        aria-label={division.name}
      >
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

      {/* Gradient separator line — draws in on hover */}
      <div
        className="mt-2 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(to right, ${division.color}4D, transparent)` }}
      />

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
    'group flex flex-col rounded-xl border-l-2 border-border bg-bg-card p-6 transition-all duration-300'

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

  /* ── Active: clickable link with energetic hover + animated border wrapper */
  if (isActive) {
    return (
      <div
        className="division-border-wrap rounded-xl p-[1px] transition-all duration-300"
        style={{
          /* Default transparent; conic-gradient appears on hover via CSS below */
          '--division-color-60': `${division.color}99`,
          '--division-color-33': `${division.color}55`,
          '--division-color-20': `${division.color}33`,
        } as React.CSSProperties}
      >
        {/* Scoped styles for the animated border drawing effect.
            Uses the global --border-angle property + border-rotate keyframe. */}
        <style>{`
          .division-border-wrap {
            background: transparent;
          }
          .division-border-wrap:hover {
            background: conic-gradient(
              from var(--border-angle),
              var(--division-color-60) 0%,
              transparent 30%,
              var(--division-color-33) 50%,
              transparent 80%
            );
            animation: border-rotate 3s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .division-border-wrap:hover {
              background: var(--division-color-20);
              animation: none;
            }
          }
        `}</style>
        <a
          href={division.url!}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} cursor-pointer hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`}
          style={cardStyle}
        >
          {cardContent}
        </a>
      </div>
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
