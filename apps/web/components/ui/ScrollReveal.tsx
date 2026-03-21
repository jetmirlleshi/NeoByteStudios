'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * Props for the ScrollReveal component.
 * @property children  - Content to reveal on scroll.
 * @property delay     - Extra delay (seconds) before the animation starts. Defaults to 0.
 * @property direction - Slide-in direction: 'up', 'left', or 'right'. Defaults to 'up'.
 */
interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

/**
 * Wraps its children in a `motion.div` that fades in with a subtle slide
 * when the element first scrolls into the viewport.
 *
 * - Uses Framer Motion's `useInView` with `once: true` so the animation
 *   plays only the first time.
 * - Initial state: opacity 0 + 30 px offset in the chosen direction.
 * - Animate to: opacity 1 + translate 0.
 *
 * Respects `prefers-reduced-motion` automatically via Framer Motion's
 * built-in accessibility support.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div ref={ref}>{children}</div>
  }

  /* Build the initial offset based on direction */
  const initialOffset = {
    up: { x: 0, y: 30 },
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
  }[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initialOffset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
