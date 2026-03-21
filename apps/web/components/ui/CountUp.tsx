'use client'

import { useRef, useState, useEffect } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
  label: string
}

export default function CountUp({ end, suffix = '', duration = 2000, label }: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current || prefersReducedMotion) {
      if (prefersReducedMotion) setCount(end)
      return
    }
    hasAnimated.current = true

    const start = performance.now()
    function tick() {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, end, duration, prefersReducedMotion])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-from to-accent bg-clip-text text-transparent">
        {count}{suffix}
      </span>
      <span className="mt-2 text-sm text-text-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
