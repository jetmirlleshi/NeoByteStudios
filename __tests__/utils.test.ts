import { describe, it, expect } from 'vitest'
import { cn, seededRandom } from '@/lib/utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles arrays', () => {
    expect(cn(['p-4', 'mt-2'])).toBe('p-4 mt-2')
  })
})

describe('seededRandom()', () => {
  it('returns values between 0 and 1', () => {
    const rand = seededRandom(42)
    for (let i = 0; i < 100; i++) {
      const val = rand()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  it('is deterministic with the same seed', () => {
    const rand1 = seededRandom(42)
    const rand2 = seededRandom(42)
    for (let i = 0; i < 20; i++) {
      expect(rand1()).toBe(rand2())
    }
  })

  it('produces different sequences for different seeds', () => {
    const rand1 = seededRandom(1)
    const rand2 = seededRandom(2)
    const seq1 = Array.from({ length: 5 }, () => rand1())
    const seq2 = Array.from({ length: 5 }, () => rand2())
    expect(seq1).not.toEqual(seq2)
  })
})
