import Link from 'next/link'
import type { Division } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import DivisionIcon from '@/components/ui/DivisionIcon'

interface DivisionCardProps {
  division: Division
  shimmerIndex?: number
  featured?: boolean
}

export default function DivisionCard({ division, shimmerIndex = 0 }: DivisionCardProps) {
  const isActive = division.status === 'active'

  const cardContent = (
    <>
      {/* Color flood overlay */}
      <div
        className="card-flood-overlay"
        style={{ '--flood-color': `${division.color}10` } as React.CSSProperties}
      />

      {/* Subtle top glow line */}
      <div
        className="pointer-events-none absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${division.color}60, transparent)` }}
      />

      {/* Icon */}
      <div
        className="flex h-13 w-13 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${division.color}22, ${division.color}08)`,
          border: `1px solid ${division.color}35`,
          boxShadow: `0 0 20px ${division.color}12`,
        }}
      >
        <DivisionIcon slug={division.slug} color={division.color} size={26} />
      </div>

      {/* Name */}
      <h3
        className="mt-5 font-display text-xl font-bold"
        style={{ color: division.color }}
      >
        {division.name}
      </h3>

      {/* Tagline */}
      <p className="mt-1.5 text-sm text-text-secondary leading-snug">
        {division.tagline}
      </p>

      {/* Gradient separator */}
      <div
        className="mt-4 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(to right, ${division.color}4D, transparent)` }}
      />

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-text-muted line-clamp-3">
        {division.description}
      </p>

      {/* Progress bar + expected launch for coming-soon */}
      {!isActive && division.developmentProgress != null && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Development</span>
            <span className="font-medium text-text-secondary">{division.developmentProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${division.developmentProgress}%`,
                background: `linear-gradient(90deg, ${division.color}, ${division.color}99)`,
                boxShadow: `0 0 8px ${division.color}40`,
              }}
            />
          </div>
          {division.expectedLaunch && (
            <p className="text-xs text-text-muted">
              Expected: <span className="text-text-secondary">{division.expectedLaunch}</span>
            </p>
          )}
        </div>
      )}

      {/* Badge — pushed to bottom */}
      <div className="mt-auto pt-5">
        <Badge status={division.status} color={division.color} />
      </div>
    </>
  )

  const baseClasses = 'group relative flex flex-col rounded-2xl p-7 transition-all duration-300 h-full min-h-0 overflow-hidden glass-card'

  const cardStyle: React.CSSProperties = {
    '--card-glow': `0 0 24px ${division.color}30, 0 0 48px ${division.color}12`,
    borderLeft: `2px solid ${division.color}60`,
    ...(isActive && {
      borderTop: `1px solid ${division.color}4D`,
    }),
    ...(!isActive && {
      '--shimmer-delay': `${shimmerIndex * 0.8}s`,
    }),
  } as React.CSSProperties

  if (isActive && division.url) {
    return (
      <div
        className="division-border-wrap rounded-2xl p-[1px] transition-all duration-300 h-full"
        style={{
          '--division-color-60': `${division.color}99`,
          '--division-color-33': `${division.color}55`,
          '--division-color-20': `${division.color}33`,
        } as React.CSSProperties}
      >
        <a
          href={division.url}
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

  return (
    <Link
      href={`/divisions/${division.slug}`}
      className={`${baseClasses} card-shimmer overflow-hidden opacity-90 hover:opacity-100 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`}
      style={cardStyle}
    >
      {cardContent}
    </Link>
  )
}
