'use client'

import { useState } from 'react'

interface WaitlistFormProps {
  division: string
  color: string
}

export default function WaitlistForm({ division, color }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), division }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('You\u2019re on the list!')
        setEmail('')
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Could not connect. Try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-4 rounded-xl p-4 text-center" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
        <p className="text-sm font-medium" style={{ color }}>
          {message}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          We&apos;ll notify you when this division launches.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === 'error' ? 'true' : undefined}
          aria-describedby={status === 'error' ? 'waitlist-error' : undefined}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm bg-white/5 border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary transition-shadow duration-200 ${
            status === 'error' ? 'border-red-400' : 'border-border-custom'
          }`}
          style={{ '--tw-ring-color': color } as React.CSSProperties}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          style={{ background: color }}
        >
          {status === 'loading' ? (
            <span className="inline-flex items-center gap-1">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="sr-only">Submitting...</span>
            </span>
          ) : 'Join the Waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p id="waitlist-error" role="alert" className="text-xs text-red-400">{message}</p>
      )}
    </form>
  )
}
