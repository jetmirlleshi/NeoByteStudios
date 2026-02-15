'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAVBAR_HEIGHT, NAVIGATION_LINKS, SITE, type NavLink } from '@/lib/constants'
import AnimatedLogo from '@/components/ui/AnimatedLogo'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SoundToggle from '@/components/ui/SoundToggle'

// ── NavItem — shared between desktop and mobile ──────────────

interface NavItemProps {
  link: NavLink
  mobile?: boolean
  active: boolean
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

function NavItem({ link, mobile = false, active, onNavigate }: NavItemProps) {
  // Resolve class names based on context
  const desktopNormal = `nav-link-hover rounded-md px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
    active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
  }`

  const desktopHighlight =
    'group relative ml-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'

  const mobileNormal = `block rounded-md px-4 py-3 text-base transition-colors hover:bg-bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary ${
    active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
  }`

  const mobileHighlight =
    'mt-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-from to-brand-to px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary'

  const className = mobile
    ? (link.highlight ? mobileHighlight : mobileNormal)
    : (link.highlight ? desktopHighlight : desktopNormal)

  // Highlight inner content (gradient border effect) — desktop only
  const highlightContent = !mobile && link.highlight ? (
    <>
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-from to-brand-to" />
      <span className="absolute inset-[1px] rounded-[7px] bg-bg-primary transition-colors duration-200 group-hover:bg-bg-secondary" />
      <span className="relative">{link.label}</span>
    </>
  ) : (
    link.label
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {highlightContent}
      </a>
    )
  }

  return (
    <Link
      href={link.href}
      scroll={!link.href.includes('#')}
      onClick={(e) => onNavigate(e, link.href)}
      className={className}
    >
      {highlightContent}
    </Link>
  )
}

// ── Main Navbar ─────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  const isActive = (href: string): boolean => {
    if (href.startsWith('/#')) return pathname === '/'
    return pathname === href
  }

  // ── Scroll to hash after cross-page navigation ──────────────
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const timer = setTimeout(() => {
        const target = document.querySelector(hash)
        if (target) {
          const top =
            target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  // ── Focus trap + Escape for mobile menu ─────────────────────
  useEffect(() => {
    if (!mobileOpen) return

    const panel = mobileMenuRef.current
    if (panel) {
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button, input, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) focusable[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        hamburgerRef.current?.focus()
        return
      }

      if (e.key === 'Tab' && panel) {
        const focusable = panel.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // ── Scroll detection ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Lock body scroll when mobile menu is open ───────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Smooth scroll handler for anchor links ──────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf('#')
      if (hashIndex !== -1) {
        const path = href.substring(0, hashIndex) || '/'
        const hash = href.substring(hashIndex)

        if (pathname === path || (path === '/' && pathname === '/')) {
          e.preventDefault()
          const target = document.querySelector(hash)
          if (target) {
            const top =
              target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
            window.scrollTo({ top, behavior: 'smooth' })
          }
        }
        setMobileOpen(false)
      } else if (!href.startsWith('http')) {
        setMobileOpen(false)
      }
    },
    [pathname],
  )

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-primary/80 backdrop-blur-lg border-b border-border-custom'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <AnimatedLogo size={32} />
            <span className={`font-display text-xl font-bold tracking-tight bg-gradient-to-r from-[#7c3aed] to-[#06d6a0] bg-clip-text text-transparent motion-safe:hover:animate-[logo-glitch_0.3s_ease-in-out] ${
              !scrolled ? 'motion-safe:animate-[logo-breathe_4s_ease-in-out_infinite]' : ''
            }`}>
              {SITE.name}
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem
                  link={link}
                  active={isActive(link.href)}
                  onNavigate={handleNavClick}
                />
              </li>
            ))}
          </ul>

          {/* Desktop toggles */}
          <div className="hidden items-center gap-1 md:flex ml-2">
            <ThemeToggle />
            <SoundToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text-primary md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-brand-from via-accent to-brand-to"
          style={{ scaleX }}
        />
      </nav>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
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

            <motion.div
              ref={mobileMenuRef}
              key="mobile-menu"
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-bg-secondary pt-24 shadow-2xl md:hidden"
            >
              <div className="flex items-center gap-2 px-6 mb-4">
                <ThemeToggle />
                <SoundToggle />
              </div>

              <ul className="flex flex-col gap-2 px-6">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.label}>
                    <NavItem
                      link={link}
                      mobile
                      active={isActive(link.href)}
                      onNavigate={handleNavClick}
                    />
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
