'use client'

import { useRef, useCallback, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Props for the TiltCard wrapper.
 * @property children  - The content to render inside the tilt container.
 * @property className - Optional extra classes on the outer wrapper.
 * @property enabled   - Whether the 3D tilt effect is active. Defaults to true.
 */
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  enabled?: boolean
}

/**
 * A client-side wrapper that adds a premium 3D tilt effect to its children.
 *
 * On mouse move the card tilts subtly (max 5 degrees) toward the cursor,
 * and a soft radial light reflection follows the pointer. On mouse leave
 * the card smoothly returns to flat.
 *
 * When `enabled` is false or the user prefers reduced motion, the wrapper
 * renders as a plain div with no visual effects.
 */
export default function TiltCard({
  children,
  className = '',
  enabled = true,
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // Whether we're currently hovering (controls the smooth transition class)
  const [hovering, setHovering] = useState(false)

  const isDisabled = !enabled || prefersReducedMotion

  /* ── Mouse move handler: compute tilt values ──────────────────── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return

      const el = containerRef.current
      if (!el) return

      // Cancel any pending rAF to avoid stacking frames
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Normalised offset from center: -1 to 1
        const offsetX = (e.clientX - centerX) / (rect.width / 2)
        const offsetY = (e.clientY - centerY) / (rect.height / 2)

        // Clamp to [-1, 1] for safety
        const clampedX = Math.max(-1, Math.min(1, offsetX))
        const clampedY = Math.max(-1, Math.min(1, offsetY))

        // Maximum rotation: 5 degrees
        const MAX_DEG = 5
        const rotateY = clampedX * MAX_DEG   // horizontal offset -> rotateY
        const rotateX = -clampedY * MAX_DEG  // vertical offset -> rotateX (inverted)

        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

        // Light reflection position — direct DOM update to avoid React re-renders
        if (reflectionRef.current) {
          const rx = ((e.clientX - rect.left) / rect.width) * 100
          const ry = ((e.clientY - rect.top) / rect.height) * 100
          reflectionRef.current.style.background = `radial-gradient(circle at ${rx}% ${ry}%, rgba(255,255,255,0.05) 0%, transparent 60%)`
          reflectionRef.current.style.opacity = '1'
        }
      })
    },
    [isDisabled],
  )

  /* ── Mouse leave: reset tilt smoothly ────────────────────────── */
  const handleMouseLeave = useCallback(() => {
    if (isDisabled) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const el = containerRef.current
    if (el) {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    }

    if (reflectionRef.current) {
      reflectionRef.current.style.opacity = '0'
    }
    setHovering(false)
  }, [isDisabled])

  /* ── Mouse enter: enable hovering state ──────────────────────── */
  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) setHovering(true)
  }, [isDisabled])

  /* ── Disabled / reduced-motion: plain wrapper ────────────────── */
  if (isDisabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: hovering ? 'transform' : 'auto',
        // Smooth recovery on mouse leave; instant follow while hovering
        transition: hovering ? 'none' : 'transform 0.15s ease-out',
      }}
    >
      {children}

      {/* ── Light reflection overlay ──────────────────────────── */}
      <div
        ref={reflectionRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s ease-out',
        }}
      />
    </div>
  )
}
