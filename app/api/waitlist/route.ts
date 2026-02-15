import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, division } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
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
      VALUES (${email.toLowerCase().trim()}, ${division})
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
