import Link from 'next/link'
import { SITE, DIVISIONS, SOCIAL_LINKS } from '@/lib/constants'

// ── Inline SVG icons for socials ─────────────────────────────────
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'X':
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'IG':
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'in':
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
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
      {/* ── Top gradient separator ─────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-brand-from to-brand-to opacity-40" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* ── 3-column grid ─────────────────────────────────── */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1 — Brand */}
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              {SITE.name}
            </span>
            <p className="mt-3 text-sm text-text-secondary">
              {SITE.tagline}
            </p>
          </div>

          {/* Column 2 — Divisions */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Divisions
            </h3>
            <ul className="flex flex-col gap-3">
              {DIVISIONS.map((div) => (
                <li key={div.slug} className="flex items-center gap-2">
                  {/* Colored dot */}
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: div.color }}
                    aria-hidden="true"
                  />
                  <Link
                    href={`/divisions/${div.slug}`}
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from rounded-sm focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  >
                    {div.name}
                    {div.status === 'coming-soon' && (
                      <span className="text-xs italic text-text-muted/60 ml-1">
                        (coming soon)
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Social links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Connect
            </h3>
            <ul className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-custom text-text-secondary transition-all duration-200 hover:border-brand-from hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-custom pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <p className="text-xs text-text-muted">
            Built with AI. Powered by imagination.
          </p>
        </div>
      </div>
    </footer>
  )
}
