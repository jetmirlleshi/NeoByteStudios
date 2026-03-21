'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date()
  const diff = Math.max(0, target.getTime() - now.getTime())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const target = new Date('2026-12-31T00:00:00')
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const units = [
    { label: 'Days', value: time?.days },
    { label: 'Hours', value: time?.hours },
    { label: 'Min', value: time?.minutes },
    { label: 'Sec', value: time?.seconds },
  ]

  if (time && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
    return (
      <p
        className="font-display text-2xl md:text-3xl font-bold"
        style={{ color: 'var(--accent)' }}
      >
        The universe has arrived.
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span
            className="font-display text-3xl md:text-5xl font-bold tabular-nums"
            style={{
              color: 'var(--accent)',
              animation: time ? 'count-glow 3s ease-in-out infinite' : undefined,
            }}
          >
            {time !== null ? String(unit.value).padStart(2, '0') : (
              <span className="inline-block w-[1.5ch] h-[1em] rounded bg-border-custom animate-pulse" />
            )}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
