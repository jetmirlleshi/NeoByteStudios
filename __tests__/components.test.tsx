import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'
import GradientText from '@/components/ui/GradientText'

describe('Badge', () => {
  it('renders Active text for active status', () => {
    render(<Badge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders Coming Soon text for coming-soon status', () => {
    render(<Badge status="coming-soon" />)
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('uses custom color when provided', () => {
    const { container } = render(<Badge status="active" color="#ff0000" />)
    const dot = container.querySelector('.animate-ping')
    expect(dot).toHaveStyle({ backgroundColor: '#ff0000' })
  })
})

describe('GradientText', () => {
  it('renders children text', () => {
    render(<GradientText>Hello World</GradientText>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies gradient CSS classes', () => {
    render(<GradientText>Test</GradientText>)
    const el = screen.getByText('Test')
    expect(el.className).toContain('bg-gradient-to-r')
    expect(el.className).toContain('bg-clip-text')
    expect(el.className).toContain('text-transparent')
  })

  it('accepts custom from/to colors', () => {
    render(<GradientText from="#ff0000" to="#00ff00">Custom</GradientText>)
    const el = screen.getByText('Custom')
    expect(el.style.getPropertyValue('--tw-gradient-from')).toBe('#ff0000')
    expect(el.style.getPropertyValue('--tw-gradient-to')).toBe('#00ff00')
  })

  it('merges additional className', () => {
    render(<GradientText className="extra-class">Merged</GradientText>)
    const el = screen.getByText('Merged')
    expect(el.className).toContain('extra-class')
  })
})
