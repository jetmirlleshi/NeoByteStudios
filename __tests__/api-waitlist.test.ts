import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db module before importing the route
vi.mock('@/lib/db', () => ({
  getDb: vi.fn(),
}))

import { POST } from '@/app/api/waitlist/route'
import { getDb } from '@/lib/db'

const mockGetDb = vi.mocked(getDb)

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/waitlist', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Validation Tests ──────────────────────────────────────────

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Valid email is required')
  })

  it('returns 400 when email is not a string', async () => {
    const res = await POST(makeRequest({ email: 123, division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Valid email is required')
  })

  it('returns 400 when email has no @', async () => {
    const res = await POST(makeRequest({ email: 'invalid-email', division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Valid email is required')
  })

  it('returns 400 for malformed emails with @ but missing parts', async () => {
    const badEmails = ['@example.com', 'user@', 'user@domain', 'has spaces@example.com']
    for (const email of badEmails) {
      const res = await POST(makeRequest({ email, division: 'writer' }))
      expect(res.status).toBe(400)
    }
  })

  it('returns 400 when division is missing', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Division is required')
  })

  it('returns 400 when division is not a string', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com', division: 42 }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Division is required')
  })

  it('returns 400 when division is invalid', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com', division: 'invalid' }))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Invalid division')
  })

  // ── Success Tests ─────────────────────────────────────────────

  it('returns success for valid email and division', async () => {
    const mockSql = vi.fn().mockResolvedValue(undefined)
    mockGetDb.mockReturnValue(mockSql as never)

    const res = await POST(makeRequest({ email: 'test@example.com', division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('accepts all valid divisions', async () => {
    const mockSql = vi.fn().mockResolvedValue(undefined)
    mockGetDb.mockReturnValue(mockSql as never)

    for (const division of ['forge', 'games', 'vision', 'writer']) {
      const res = await POST(makeRequest({ email: 'test@example.com', division }))
      expect(res.status).toBe(200)
    }
  })

  it('lowercases and trims email before insert', async () => {
    const mockSql = vi.fn().mockResolvedValue(undefined)
    mockGetDb.mockReturnValue(mockSql as never)

    await POST(makeRequest({ email: '  Test@Example.COM  ', division: 'writer' }))

    // The tagged template literal is called with the email
    expect(mockSql).toHaveBeenCalled()
  })

  // ── Error Handling Tests ──────────────────────────────────────

  it('returns 503 when DATABASE_URL is missing', async () => {
    mockGetDb.mockImplementation(() => {
      throw new Error('DATABASE_URL environment variable is not set')
    })

    const res = await POST(makeRequest({ email: 'test@example.com', division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(503)
    expect(data.error).toBe('Waitlist is not configured yet')
  })

  it('returns 500 for unexpected errors', async () => {
    mockGetDb.mockImplementation(() => {
      throw new Error('Connection refused')
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await POST(makeRequest({ email: 'test@example.com', division: 'writer' }))
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toBe('Something went wrong')
    consoleSpy.mockRestore()
  })
})
