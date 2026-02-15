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
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg px-4 py-2.5 text-sm bg-white/5 border border-border-custom text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary transition-shadow duration-200"
        style={{ '--tw-ring-color': color } as React.CSSProperties}
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        style={{ background: color }}
      >
        {status === 'loading' ? '...' : 'Join'}
      </button>
      {status === 'error' && (
        <p className="absolute mt-12 text-xs text-red-400">{message}</p>
      )}
    </form>
  )
}
