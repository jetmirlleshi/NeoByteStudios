'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { SITE, DIVISIONS, SOCIAL_LINKS } from '@/lib/constants'
import DivisionIcon from '@/components/ui/DivisionIcon'
import MagneticButton from '@/components/ui/MagneticButton'

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), {
  ssr: false,
})

// ── Inline SVG icons for socials ─────────────────────────────────
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'X':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'IG':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'in':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    default:
      return <span className="text-xs font-bold">{icon}</span>
  }
}

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* ── Top aurora separator ────────────────────────────── */}
      <div
        className="aurora-line h-[4px] rounded-full opacity-50"
        style={{
          background:
            'linear-gradient(90deg, transparent, #7c3aed, #06d6a0, #3b82f6, #06d6a0, #7c3aed, transparent)',
          backgroundSize: '200% 100%',
          animation: 'aurora-shift 8s ease-in-out infinite',
        }}
      />

      {/* ── Large centered wordmark ───────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-display text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06d6a0] bg-clip-text text-transparent">
            {SITE.name}
          </span>
          <p className="mt-4 text-lg text-text-secondary max-w-md">
            {SITE.tagline}
          </p>

          {/* ── Final CTA ─────────────────────────────────── */}
          <div className="mt-8">
            <MagneticButton>
              <a
                href="https://neobytewriter.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative inline-block rounded-full p-[1px]
                  bg-gradient-to-r from-brand-from to-accent
                  transition-shadow duration-300
                  hover:shadow-[0_0_24px_4px_rgba(6,214,160,0.3)]
                "
              >
                <span className="block rounded-full px-8 py-3 bg-bg-primary text-text-primary font-medium transition-colors duration-300 group-hover:bg-bg-primary/90">
                  Start Creating&nbsp;&rarr;
                </span>
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* ── 3-column grid ─────────────────────────────────── */}
        <nav aria-label="Footer navigation" className="grid gap-12 md:grid-cols-3">
          {/* Column 1 — About */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted font-display">
              Studio
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              One creator, AI-amplified. Building original cross-media intellectual properties across four divisions.
            </p>
          </div>

          {/* Column 2 — Divisions */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted font-display">
              Divisions
            </h2>
            <ul className="flex flex-col gap-3">
              {DIVISIONS.map((div) => (
                <li key={div.slug} className="flex items-center gap-2.5">
                  <DivisionIcon slug={div.slug} color={div.color} size={16} />
                  <Link
                    href={`/divisions/${div.slug}`}
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from rounded-sm focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  >
                    {div.name}
                    {div.status === 'coming-soon' && (
                      <span className="text-xs italic text-text-muted ml-1">
                        (coming soon)
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Social links with brand colors on hover */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted font-display">
              Connect
            </h2>
            <ul className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="social-icon-link group flex h-11 w-11 items-center justify-center rounded-xl border border-border-custom text-text-secondary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                    style={{
                      '--social-color': social.brandColor,
                    } as React.CSSProperties}
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-custom pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <p className="text-xs text-text-muted">
            Built with AI. Powered by imagination.
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      <ScrollToTop />
    </footer>
  )
}
