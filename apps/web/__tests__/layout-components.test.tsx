import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ─── Mock dependencies for Navbar ──────────────────────────────

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props as Record<string, unknown>
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props as Record<string, unknown>
      return <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props as Record<string, unknown>
      return <p {...(rest as React.HTMLAttributes<HTMLParagraphElement>)}>{children}</p>
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => '0%' }),
  useReducedMotion: () => false,
  useInView: () => true,
}))

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: React.PropsWithChildren) => null,
  SignedOut: ({ children }: React.PropsWithChildren) => <>{children}</>,
  UserButton: () => null,
}))

// Mock dynamic imports
vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<unknown>) => {
    return function DynamicComponent() {
      return null
    }
  },
}))

// Mock AnimatedLogo
vi.mock('@/components/ui/AnimatedLogo', () => ({
  default: () => <div data-testid="animated-logo" />,
}))

// Mock ThemeToggle and SoundToggle
vi.mock('@/components/ui/ThemeToggle', () => ({
  default: () => <button>Theme</button>,
}))

vi.mock('@/components/ui/SoundToggle', () => ({
  default: () => <button>Sound</button>,
}))

import Navbar from '@/components/layout/Navbar'

describe('Navbar', () => {
  it('renders main navigation with aria-label', () => {
    render(<Navbar />)
    const nav = screen.getByLabelText('Main navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders site name', () => {
    render(<Navbar />)
    expect(screen.getByText('NeoByteStudios')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Divisions')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders mobile hamburger button', () => {
    render(<Navbar />)
    const hamburger = screen.getByLabelText('Open navigation menu')
    expect(hamburger).toBeInTheDocument()
    expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  it('has logo link pointing to home', () => {
    render(<Navbar />)
    const logoLink = screen.getByText('NeoByteStudios').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders Sign In link when signed out', () => {
    render(<Navbar />)
    const signInLinks = screen.getAllByText('Sign In')
    expect(signInLinks.length).toBeGreaterThan(0)
  })
})

// ─── Footer ─────────────────────────────────────────────────────

// Mock MagneticButton
vi.mock('@/components/ui/MagneticButton', () => ({
  default: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

// Mock ScrollToTopWrapper
vi.mock('@/components/ui/ScrollToTopWrapper', () => ({
  default: () => null,
}))

// Mock DivisionIcon
vi.mock('@/components/ui/DivisionIcon', () => ({
  default: () => <span data-testid="division-icon" />,
}))

import Footer from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders site name', () => {
    render(<Footer />)
    expect(screen.getByText('NeoByteStudios')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<Footer />)
    expect(screen.getByText('Where AI Meets Imagination')).toBeInTheDocument()
  })

  it('renders footer navigation with aria-label', () => {
    render(<Footer />)
    const nav = screen.getByLabelText('Footer navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders division links', () => {
    render(<Footer />)
    expect(screen.getByText('NeoByteWriter')).toBeInTheDocument()
    expect(screen.getByText('NeoByteForge')).toBeInTheDocument()
    expect(screen.getByText('NeoByteGames')).toBeInTheDocument()
    expect(screen.getByText('NeoByteVision')).toBeInTheDocument()
  })

  it('renders social links with aria-labels', () => {
    render(<Footer />)
    expect(screen.getByLabelText('X (Twitter)')).toBeInTheDocument()
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
  })

  it('social links open in new tab', () => {
    render(<Footer />)
    const xLink = screen.getByLabelText('X (Twitter)')
    expect(xLink).toHaveAttribute('target', '_blank')
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('renders CTA link to NeoByteWriter', () => {
    render(<Footer />)
    expect(screen.getByText('Start Creating →')).toBeInTheDocument()
  })

  it('renders section headings', () => {
    render(<Footer />)
    expect(screen.getByText('Studio')).toBeInTheDocument()
    expect(screen.getByText('Divisions')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })
})
