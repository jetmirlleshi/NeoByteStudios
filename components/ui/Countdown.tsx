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
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Sec', value: time.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span
            className="font-display text-3xl md:text-5xl font-bold tabular-nums"
            style={{
              color: 'var(--accent)',
              animation: 'count-glow 3s ease-in-out infinite',
            }}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
