'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * Props for the TextReveal component.
 * @property children  - Content to reveal with the gradient wipe effect.
 * @property className - Additional CSS classes for the wrapper.
 * @property delay     - Extra delay (seconds) before the animation starts. Defaults to 0.
 */
interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Reveals its children with a luminous gradient sweep from left to right —
 * like a forge heating up and revealing glowing text.
 *
 * The content fades in with a subtle upward slide while a purple-tinted
 * gradient overlay sweeps across from left to right, then exits off-screen.
 *
 * Respects `prefers-reduced-motion`: when enabled, renders children
 * immediately without any animation.
 */
export default function TextReveal({
  children,
  className = '',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Content — fades in with a subtle upward slide */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
      >
        {children}
      </motion.div>

      {/* Gradient wipe overlay — sweeps from left to right then disappears */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
        initial={{ x: '-100%' }}
        animate={isInView ? { x: '200%' } : undefined}
        transition={{
          duration: 1.2,
          delay: delay + 0.2,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
      />
    </div>
  )
}
