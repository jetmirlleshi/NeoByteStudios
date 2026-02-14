'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedLogoProps {
  size?: number
  className?: string
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay,
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
      },
      opacity: { delay, duration: 0.2 },
    },
  }),
}

export default function AnimatedLogo({
  size = 40,
  className = '',
}: AnimatedLogoProps) {
  const prefersReducedMotion = useReducedMotion()

  const staticProps = { pathLength: 1, opacity: 1 }

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate="visible"
      aria-label="NeoByteStudios logo"
    >
      <defs>
        <linearGradient
          id="anim-logo-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06d6a0" />
        </linearGradient>
        <filter id="anim-logo-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rounded border */}
      <motion.rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="16"
        fill="none"
        stroke="url(#anim-logo-grad)"
        strokeWidth="2"
        variants={prefersReducedMotion ? undefined : draw}
        custom={0}
        {...(prefersReducedMotion ? staticProps : {})}
      />

      {/* N letter */}
      <motion.path
        d="M 30 68 L 30 32 L 48 68 L 48 32"
        fill="none"
        stroke="url(#anim-logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={prefersReducedMotion ? undefined : draw}
        custom={0.5}
        {...(prefersReducedMotion ? staticProps : {})}
      />

      {/* B letter */}
      <motion.path
        d="M 56 32 L 56 68 M 56 32 L 67 32 Q 74 32 74 41 Q 74 50 67 50 L 56 50 M 56 50 L 69 50 Q 76 50 76 59 Q 76 68 69 68 L 56 68"
        fill="none"
        stroke="url(#anim-logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={prefersReducedMotion ? undefined : draw}
        custom={1}
        {...(prefersReducedMotion ? staticProps : {})}
      />

      {/* Post-draw glow */}
      {!prefersReducedMotion && (
        <motion.rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="16"
          fill="none"
          stroke="url(#anim-logo-grad)"
          strokeWidth="1"
          filter="url(#anim-logo-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3] }}
          transition={{ delay: 2, duration: 1 }}
        />
      )}
    </motion.svg>
  )
}
