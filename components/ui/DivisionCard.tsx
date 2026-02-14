import type { Division } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import DivisionIcon from '@/components/ui/DivisionIcon'

interface DivisionCardProps {
  division: Division
  shimmerIndex?: number
  featured?: boolean
}

export default function DivisionCard({ division, shimmerIndex = 0, featured = false }: DivisionCardProps) {
  const isActive = division.status === 'active'

  const cardContent = (
    <>
      {/* Color flood overlay */}
      <div
        className="card-flood-overlay"
        style={{ '--flood-color': `${division.color}10` } as React.CSSProperties}
      />

      {/* Division icon — SVG instead of emoji */}
      <div
        className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
          featured ? 'h-14 w-14' : 'h-11 w-11'
        } ${isActive ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}
        style={{
          background: `linear-gradient(135deg, ${division.color}20, ${division.color}08)`,
          border: `1px solid ${division.color}30`,
        }}
      >
        <DivisionIcon
          slug={division.slug}
          color={division.color}
          size={featured ? 28 : 22}
        />
      </div>

      {/* Division name */}
      <h3
        className={`mt-4 font-display font-bold ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}
        style={{ color: division.color }}
      >
        {division.name}
      </h3>

      {/* Tagline */}
      <p className={`mt-1 text-text-secondary ${featured ? 'text-base' : 'text-sm'}`}>
        {division.tagline}
      </p>

      {/* Gradient separator */}
      <div
        className="mt-3 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(to right, ${division.color}4D, transparent)` }}
      />

      {/* Description */}
      <p className={`mt-3 text-text-muted ${featured ? 'text-base' : 'text-sm'}`}>
        {division.description}
      </p>

      {/* Status badge */}
      <div className="mt-auto pt-4">
        <Badge status={division.status} color={division.color} />
      </div>
    </>
  )

  const baseClasses = `group relative flex flex-col rounded-2xl p-6 ${featured ? 'md:p-8' : ''} transition-all duration-300 h-full glass-card`

  const cardStyle: React.CSSProperties = {
    '--card-glow': `0 0 20px ${division.color}33, 0 0 40px ${division.color}15`,
    borderLeft: `2px solid ${division.color}`,
    ...(isActive && {
      borderTop: `1px solid ${division.color}4D`,
    }),
    ...(!isActive && {
      filter: 'saturate(0.7) brightness(0.95)',
      '--shimmer-delay': `${shimmerIndex * 0.8}s`,
    }),
  } as React.CSSProperties

  if (isActive) {
    return (
      <div
        className="division-border-wrap rounded-2xl p-[1px] transition-all duration-300 h-full"
        style={{
          '--division-color-60': `${division.color}99`,
          '--division-color-33': `${division.color}55`,
          '--division-color-20': `${division.color}33`,
        } as React.CSSProperties}
      >
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

  return (
    <div
      className={`${baseClasses} card-shimmer cursor-default overflow-hidden opacity-80 hover:opacity-100`}
      style={cardStyle}
    >
      {cardContent}
    </div>
  )
}
