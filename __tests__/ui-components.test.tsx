import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// ─── ErrorBoundary ────────────────────────────────────────────

import ErrorBoundary from '@/components/ui/ErrorBoundary'

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error')
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders default fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong loading this section.')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('has role="alert" on default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

// ─── ShareBar ─────────────────────────────────────────────────

import ShareBar from '@/components/ui/ShareBar'

describe('ShareBar', () => {
  const defaultProps = {
    url: 'https://example.com/post',
    title: 'Test Post Title',
  }

  it('renders share label', () => {
    render(<ShareBar {...defaultProps} />)
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('renders X share link with correct href', () => {
    render(<ShareBar {...defaultProps} />)
    const xLink = screen.getByLabelText('Share on X')
    expect(xLink).toHaveAttribute('href', expect.stringContaining('x.com/intent/tweet'))
    expect(xLink).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(defaultProps.url)))
  })

  it('renders LinkedIn share link with correct href', () => {
    render(<ShareBar {...defaultProps} />)
    const linkedinLink = screen.getByLabelText('Share on LinkedIn')
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com/sharing'))
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(defaultProps.url)))
  })

  it('renders copy button', () => {
    render(<ShareBar {...defaultProps} />)
    expect(screen.getByLabelText('Copy link')).toBeInTheDocument()
  })

  it('share links open in new tab', () => {
    render(<ShareBar {...defaultProps} />)
    const xLink = screen.getByLabelText('Share on X')
    expect(xLink).toHaveAttribute('target', '_blank')
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

// ─── DivisionIcon ─────────────────────────────────────────────

import DivisionIcon from '@/components/ui/DivisionIcon'

describe('DivisionIcon', () => {
  it('renders SVG for writer division', () => {
    const { container } = render(<DivisionIcon slug="writer" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders SVG for forge division', () => {
    const { container } = render(<DivisionIcon slug="forge" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders SVG for games division', () => {
    const { container } = render(<DivisionIcon slug="games" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders SVG for vision division', () => {
    const { container } = render(<DivisionIcon slug="vision" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders default icon for unknown slug', () => {
    const { container } = render(<DivisionIcon slug="unknown" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    const { container } = render(<DivisionIcon slug="writer" size={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
  })

  it('applies custom color', () => {
    const { container } = render(<DivisionIcon slug="writer" color="#ff0000" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('stroke', '#ff0000')
  })
})

// ─── SectionDivider ───────────────────────────────────────────

import SectionDivider from '@/components/ui/SectionDivider'

describe('SectionDivider', () => {
  it('renders wave variant by default', () => {
    const { container } = render(<SectionDivider />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders gradient variant', () => {
    const { container } = render(<SectionDivider variant="gradient" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
    const div = container.firstElementChild
    expect(div).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders angle variant', () => {
    const { container } = render(<SectionDivider variant="angle" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
    const div = container.firstElementChild
    expect(div).toHaveAttribute('aria-hidden', 'true')
  })

  it('is hidden from screen readers', () => {
    const { container } = render(<SectionDivider />)
    const wrapper = container.firstElementChild
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies flip transform when flip is true', () => {
    const { container } = render(<SectionDivider flip />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('[transform:scaleY(-1)]')
  })

  it('merges custom className', () => {
    const { container } = render(<SectionDivider className="my-custom-class" />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('my-custom-class')
  })
})

// ─── WaitlistForm ─────────────────────────────────────────────

import WaitlistForm from '@/components/ui/WaitlistForm'

describe('WaitlistForm', () => {
  const defaultProps = { division: 'writer', color: '#7c3aed' }

  it('renders email input and submit button', () => {
    render(<WaitlistForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByText('Join the Waitlist')).toBeInTheDocument()
  })

  it('email input has correct type', () => {
    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toBeRequired()
  })

  it('shows success message after successful submission', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    const button = screen.getByText('Join the Waitlist')

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("You\u2019re on the list!")).toBeInTheDocument()
    })
  })

  it('shows error message on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid email' }),
    })

    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    const button = screen.getByText('Join the Waitlist')

    fireEvent.change(input, { target: { value: 'bad@email.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows network error on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    const button = screen.getByText('Join the Waitlist')

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Could not connect. Try again later.')).toBeInTheDocument()
    })
  })

  it('disables input and button during loading', async () => {
    let resolvePromise: (value: unknown) => void
    global.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => { resolvePromise = resolve })
    )

    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    const button = screen.getByText('Join the Waitlist')

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input).toBeDisabled()
    })

    // Resolve to clean up
    act(() => {
      resolvePromise!({ ok: true, json: () => Promise.resolve({ success: true }) })
    })
  })

  it('has aria-invalid on error state', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Error' }),
    })

    render(<WaitlistForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('your@email.com')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Join the Waitlist'))

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })
})

// ─── Countdown ────────────────────────────────────────────────

import Countdown from '@/components/ui/Countdown'

describe('Countdown', () => {
  it('renders four time units', () => {
    render(<Countdown />)
    expect(screen.getByText('Days')).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Min')).toBeInTheDocument()
    expect(screen.getByText('Sec')).toBeInTheDocument()
  })

  it('displays numeric values after mount', async () => {
    render(<Countdown />)
    await waitFor(() => {
      const dayElements = screen.getAllByText(/^\d{2,}$/)
      expect(dayElements.length).toBeGreaterThan(0)
    })
  })
})

// ─── ScrollToTop ──────────────────────────────────────────────

import ScrollToTop from '@/components/ui/ScrollToTop'

describe('ScrollToTop', () => {
  it('does not render when scrollY is 0', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    render(<ScrollToTop />)
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument()
  })

  it('renders when scrollY > 400', async () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    render(<ScrollToTop />)

    // Trigger scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument()
    })
  })

  it('has aria-label for accessibility', async () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    render(<ScrollToTop />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      const button = screen.getByLabelText('Scroll to top')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  it('SVG icon is hidden from screen readers', async () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    render(<ScrollToTop />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      const button = screen.getByLabelText('Scroll to top')
      const svg = button.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
