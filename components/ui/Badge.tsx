import type { DivisionStatus } from '@/lib/constants'
import { cn } from '@/lib/utils'

/**
 * Props for the Badge component.
 * @property status - Division lifecycle status ('active' or 'coming-soon')
 * @property color  - Optional accent color override (hex). Falls back to green for active, brand-from for coming-soon.
 */
interface BadgeProps {
  status: DivisionStatus
  color?: string
}

/**
 * Small inline badge that visually communicates a division's status.
 *
 * - **active**: animated green pulse dot + "Active" label -- feels alive and running.
 * - **coming-soon**: lock icon + "Coming Soon" label -- mysterious, not dull.
 *
 * Server component (no client JS required -- the pulse animation is pure CSS).
 */
export default function Badge({ status, color }: BadgeProps) {
  const isActive = status === 'active'

  /* Resolve accent color: prop override > sensible defaults */
  const accent = color ?? (isActive ? '#22c55e' : '#7c3aed')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        isActive
          ? 'bg-green-500/10 text-green-400'
          : 'bg-brand-from/10 text-brand-from'
      )}
    >
      {isActive ? (
        /* ── Animated pulse dot ─────────────────────────────── */
        <span className="relative flex h-2 w-2">
          {/* outer ping ring */}
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: accent }}
          />
          {/* solid centre dot */}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </span>
      ) : (
        /* ── Lock / clock icon (SVG, 14x14) ────────────────── */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          {/* A simple clock icon -- conveys "not yet" without sadness */}
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {isActive ? 'Active' : 'Coming Soon'}
    </span>
  )
}
