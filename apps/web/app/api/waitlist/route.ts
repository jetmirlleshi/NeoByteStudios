import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Rate limiter in-memory (sliding window, reset ad ogni cold start in serverless)
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minuti

const ipRequestMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const timestamps = (ipRequestMap.get(ip) ?? []).filter(t => t > windowStart)

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return true
  }

  timestamps.push(now)
  ipRequestMap.set(ip, timestamps)
  return false
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const body = await request.json()
    const { email, division } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = typeof email === 'string' ? email.trim() : ''
    if (!email || typeof email !== 'string' || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    if (!division || typeof division !== 'string') {
      return NextResponse.json(
        { error: 'Division is required' },
        { status: 400 },
      )
    }

    const validDivisions = ['forge', 'games', 'vision', 'writer']
    if (!validDivisions.includes(division)) {
      return NextResponse.json(
        { error: 'Invalid division' },
        { status: 400 },
      )
    }

    const sql = getDb()

    await sql`
      INSERT INTO waitlist (email, division)
      VALUES (${trimmedEmail.toLowerCase()}, ${division})
      ON CONFLICT (email, division) DO NOTHING
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    // Check for missing DATABASE_URL
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Waitlist is not configured yet' },
        { status: 503 },
      )
    }

    console.error('[waitlist]', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
