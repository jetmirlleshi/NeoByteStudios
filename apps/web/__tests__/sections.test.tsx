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

// Mock dynamic imports
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

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

// ─── Stats ──────────────────────────────────────────────────

import Stats from '@/components/sections/Stats'

describe('Stats', () => {
  it('renders section heading', () => {
    render(<Stats />)
    expect(screen.getByText('The One-Person Studio Model')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<Stats />)
    expect(screen.getByText('Creators on Waitlist')).toBeInTheDocument()
    expect(screen.getByText('Creative Divisions')).toBeInTheDocument()
  })
})
