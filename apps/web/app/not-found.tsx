import Link from 'next/link'
import GradientText from '@/components/ui/GradientText'
import { DIVISIONS, NAVIGATION_LINKS } from '@/lib/constants'
import DivisionIcon from '@/components/ui/DivisionIcon'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center py-24">
      <h1 className="sr-only">Page Not Found</h1>
      <GradientText from="var(--brand-from)" to="var(--accent)" className="font-display text-6xl md:text-8xl font-bold" aria-hidden="true">
        404
      </GradientText>
      <p className="text-lg text-text-secondary mt-4">
        This page doesn&apos;t exist in any of our universes&hellip; yet.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-brand-from to-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      >
        Back to Home
      </Link>

      {/* Quick links */}
      <div className="mt-12 w-full max-w-md">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
          Or explore these pages
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-text-secondary glass-card hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Division shortcuts */}
      <div className="mt-8 w-full max-w-lg">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
          Our Divisions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DIVISIONS.map((division) => (
            <Link
              key={division.slug}
              href={`/divisions/${division.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl p-4 glass-card hover:scale-105 transition-all duration-200 group"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200"
                style={{
                  background: `linear-gradient(135deg, ${division.color}20, ${division.color}08)`,
                  border: `1px solid ${division.color}30`,
                }}
              >
                <DivisionIcon slug={division.slug} color={division.color} size={20} />
              </div>
              <span
                className="text-xs font-medium transition-colors duration-200"
                style={{ color: division.color }}
              >
                {division.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
