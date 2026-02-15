import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ─── Mock framer-motion ───────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileHover, whileTap, style, ...rest } = props as Record<string, unknown>
      return <div style={style as React.CSSProperties} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
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

// Mock dynamic imports (for Hero component)
vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<unknown>) => {
    return function DynamicComponent() {
      return <div data-testid="dynamic-component" />
    }
  },
}))

// Mock ScrollReveal to render children directly
vi.mock('@/components/ui/ScrollReveal', () => ({
  default: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

// Mock TextReveal
vi.mock('@/components/ui/TextReveal', () => ({
  default: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

// Mock GradientText to render children
vi.mock('@/components/ui/GradientText', () => ({
  default: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}))

// Mock ScrambleText
vi.mock('@/components/ui/ScrambleText', () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}))

// Mock Countdown
vi.mock('@/components/ui/Countdown', () => ({
  default: () => <div data-testid="countdown" />,
}))

// Mock MagneticButton
vi.mock('@/components/ui/MagneticButton', () => ({
  default: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

// Mock ErrorBoundary
vi.mock('@/components/ui/ErrorBoundary', () => ({
  default: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

// ─── SocialProof ──────────────────────────────────────────────

import SocialProof from '@/components/sections/SocialProof'

describe('SocialProof', () => {
  it('renders section with aria-label', () => {
    render(<SocialProof />)
    expect(screen.getByLabelText('Studio credentials')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<SocialProof />)
    expect(screen.getByText('The One-Person Studio Model')).toBeInTheDocument()
  })

  it('renders all three proof points', () => {
    render(<SocialProof />)
    expect(screen.getByText('Creator')).toBeInTheDocument()
    expect(screen.getByText('Divisions')).toBeInTheDocument()
    expect(screen.getByText('Worlds')).toBeInTheDocument()
  })

  it('renders proof point values', () => {
    render(<SocialProof />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('\u221E')).toBeInTheDocument()
  })

  it('renders tech stack section', () => {
    render(<SocialProof />)
    expect(screen.getByText('Powered by modern technology')).toBeInTheDocument()
  })

  it('renders tech stack items', () => {
    render(<SocialProof />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
  })
})

// ─── IPShowcase ───────────────────────────────────────────────

import IPShowcase from '@/components/sections/IPShowcase'

describe('IPShowcase', () => {
  it('renders section with id', () => {
    const { container } = render(<IPShowcase />)
    const section = container.querySelector('#ip-showcase')
    expect(section).toBeInTheDocument()
  })

  it('renders heading text', () => {
    render(<IPShowcase />)
    expect(screen.getByText('Our first universe is being forged.')).toBeInTheDocument()
  })

  it('renders coming date text', () => {
    render(<IPShowcase />)
    expect(screen.getByText('Coming 2026.')).toBeInTheDocument()
  })

  it('renders countdown component', () => {
    render(<IPShowcase />)
    expect(screen.getByTestId('countdown')).toBeInTheDocument()
  })

  it('renders CTA link', () => {
    render(<IPShowcase />)
    const cta = screen.getByText(/Join the Waitlist/)
    expect(cta).toBeInTheDocument()
    expect(cta.closest('a')).toHaveAttribute('href', '/#divisions')
  })

  it('renders particles as decorative elements', () => {
    const { container } = render(<IPShowcase />)
    const particles = container.querySelectorAll('[aria-hidden="true"].pointer-events-none.absolute')
    expect(particles.length).toBeGreaterThan(0)
  })
})

// ─── Hero ─────────────────────────────────────────────────────

import Hero from '@/components/sections/Hero'

describe('Hero', () => {
  it('renders section with id', () => {
    const { container } = render(<Hero />)
    const section = container.querySelector('#hero')
    expect(section).toBeInTheDocument()
  })

  it('renders h1 heading', () => {
    render(<Hero />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<Hero />)
    expect(screen.getByText('Where AI Meets Imagination')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<Hero />)
    expect(screen.getByText(/One creator, AI-amplified/)).toBeInTheDocument()
  })

  it('renders CTA button', () => {
    render(<Hero />)
    const cta = screen.getByText(/Explore Our Divisions/)
    expect(cta).toBeInTheDocument()
  })

  it('CTA button has correct type', () => {
    render(<Hero />)
    const button = screen.getByText(/Explore Our Divisions/).closest('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('has skip-to-content friendly id structure', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
  })
})
