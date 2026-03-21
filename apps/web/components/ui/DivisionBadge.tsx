import type { DivisionStatus } from '@/lib/constants'
import { COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BadgeProps {
  status: DivisionStatus
  color?: string
}

export default function Badge({ status, color }: BadgeProps) {
  const isActive = status === 'active'
  const accent = color ?? (isActive ? '#22c55e' : COLORS.brand.from)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-shadow duration-300',
        isActive
          ? 'bg-green-500/10 text-green-400 hover:shadow-[0_0_10px_2px_rgba(34,197,94,0.15)]'
          : 'bg-brand-from/10 text-brand-from'
      )}
      style={isActive ? {
        border: '1px solid rgba(34, 197, 94, 0.15)',
      } : undefined}
    >
      {isActive ? (
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: accent }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{
              backgroundColor: accent,
              boxShadow: '0 0 6px 2px rgba(34, 197, 94, 0.4)',
              animation: 'badge-glow-pulse 2s ease-in-out infinite',
            }}
          />
        </span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
          style={{ animation: 'clock-tick 3s ease-in-out infinite' }}
        >
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
