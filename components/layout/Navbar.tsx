'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAVBAR_HEIGHT, NAVIGATION_LINKS, SITE } from '@/lib/constants'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // ── Helper: is this link "active" based on the current route? ──
  const isActive = (href: string): boolean => {
    // Hash links (e.g. #divisions, #vision) — not tracked by pathname
    if (href.startsWith('#')) return false
    // Exact match for route-based links (/, /about, etc.)
    return pathname === href
  }

  // ── Escape key closes mobile menu ──────────────────────────────
  useEffect(() => {
    if (!mobileOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileOpen])

  // ── Scroll detection ──────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // Check initial position (e.g. if user refreshed mid-page)
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Lock body scroll when mobile menu is open ─────────────────
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // ── Smooth scroll handler for anchor links ────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          const top =
            target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
          window.scrollTo({ top, behavior: 'smooth' })
        }
        setMobileOpen(false)
      } else if (!href.startsWith('http')) {
        // Internal non-anchor link — just close mobile menu
        setMobileOpen(false)
      }
    },
    [],
  )

  return (
    <>
      {/* ── Fixed navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-[#1e1e2e]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          {/* ── Logo ────────────────────────────────────────── */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              {SITE.name}
            </span>
          </Link>

          {/* ── Desktop links ───────────────────────────────── */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  // External link — keep as <a>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      link.highlight
                        ? 'group relative ml-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'
                        : 'rounded-md px-4 py-2 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'
                    }
                  >
                    {link.highlight ? (
                      <>
                        {/* Gradient border background */}
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-from to-brand-to" />
                        {/* Inner fill that leaves a 1px border visible */}
                        <span className="absolute inset-[1px] rounded-[7px] bg-bg-primary transition-colors duration-200 group-hover:bg-bg-secondary" />
                        <span className="relative">{link.label}</span>
                      </>
                    ) : (
                      link.label
                    )}
                  </a>
                ) : (
                  // Internal link — use Next.js <Link>
                  <Link
                    href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                    scroll={false}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={
                      link.highlight
                        ? 'group relative ml-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'
                        : `rounded-md px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
                            isActive(link.href)
                              ? 'text-text-primary'
                              : 'text-text-secondary hover:text-text-primary'
                          }`
                    }
                  >
                    {link.highlight ? (
                      <>
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-from to-brand-to" />
                        <span className="absolute inset-[1px] rounded-[7px] bg-bg-primary transition-colors duration-200 group-hover:bg-bg-secondary" />
                        <span className="relative">{link.label}</span>
                      </>
                    ) : (
                      link.label
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ── Mobile hamburger button ─────────────────────── */}
          <button
            type="button"
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text-primary md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200"
            >
              {mobileOpen ? (
                <>
                  {/* X icon */}
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  {/* Hamburger icon */}
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-in panel ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel from right */}
            <motion.div
              key="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-bg-secondary pt-24 shadow-2xl md:hidden"
            >
              <ul className="flex flex-col gap-2 px-6">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      // External link — keep as <a>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          link.highlight
                            ? 'mt-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-from to-brand-to px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary'
                            : 'block rounded-md px-4 py-3 text-base text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary'
                        }
                      >
                        {link.label}
                      </a>
                    ) : (
                      // Internal link — use Next.js <Link>
                      <Link
                        href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        scroll={false}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={
                          link.highlight
                            ? 'mt-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-from to-brand-to px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary'
                            : `block rounded-md px-4 py-3 text-base transition-colors hover:bg-bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary ${
                                isActive(link.href)
                                  ? 'text-text-primary'
                                  : 'text-text-secondary hover:text-text-primary'
                              }`
                        }
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
