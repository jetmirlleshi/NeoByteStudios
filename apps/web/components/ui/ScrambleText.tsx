'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Props for the ScrambleText component.
 * @property text     - The final text to display after the scramble animation.
 * @property className - Additional CSS classes for the wrapper span.
 * @property delay     - Extra delay (seconds) before the scramble starts. Defaults to 0.
 * @property charset   - Characters used for the random scramble effect.
 * @property duration  - Total duration of the scramble animation in ms. Defaults to 1500.
 */
interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  charset?: string
  duration?: number
}

/**
 * Displays text that "decodes" from random characters into the final string,
 * like data being forged or decoded from noise.
 *
 * Each character settles at a staggered rate (first characters resolve earlier),
 * using `requestAnimationFrame` for smooth 60fps updates.
 *
 * Respects `prefers-reduced-motion`: when enabled, shows the final text
 * immediately without any scramble animation.
 */
export default function ScrambleText({
  text,
  className = '',
  delay = 0,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*',
  duration = 1500,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(text)
  const hasAnimated = useRef(false)

  const scramble = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const chars = text.split('')
    const startTime = performance.now()
    let rafId: number

    function tick() {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const result = chars
        .map((char, i) => {
          if (char === ' ') return ' '
          const charProgress = (progress - (i / chars.length) * 0.5) / 0.5
          if (charProgress >= 1) return char
          return charset[Math.floor(Math.random() * charset.length)]
        })
        .join('')

      setDisplayText(result)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const delayMs = delay * 1000
    const timerId = window.setTimeout(() => {
      rafId = requestAnimationFrame(tick)
    }, delayMs)

    return () => {
      window.clearTimeout(timerId)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [text, delay, charset, duration])

  useEffect(() => {
    if (isInView && !prefersReducedMotion && !hasAnimated.current) {
      const cleanup = scramble()
      return cleanup
    }
  }, [isInView, prefersReducedMotion, scramble])

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {text}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  )
}
