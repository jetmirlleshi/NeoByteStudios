'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

const TRAIL_COUNT = 5

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const mousePos = useRef({ x: -100, y: -100 })
  const prefersReducedMotion = useReducedMotion()

  const setTrailRef = useCallback((el: HTMLDivElement | null, i: number) => {
    trailRefs.current[i] = el
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    // Only show on non-touch devices
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    document.documentElement.classList.add('custom-cursor-active')

    const positions = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    let rafId: number
    let isTabActive = true

    const animate = () => {
      if (!isTabActive) {
        rafId = requestAnimationFrame(animate)
        return
      }

      const { x, y } = mousePos.current

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 10}px, ${y - 10}px)`
      }

      positions.forEach((pos, i) => {
        const target = i === 0 ? mousePos.current : positions[i - 1]
        const ease = 0.15 - i * 0.02
        pos.x += (target.x - pos.x) * ease
        pos.y += (target.y - pos.y) * ease

        const trail = trailRefs.current[i]
        if (trail) {
          const size = 6 - i
          trail.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`
          trail.style.width = `${size}px`
          trail.style.height = `${size}px`
          trail.style.opacity = `${0.4 - i * 0.07}`
        }
      })

      rafId = requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState === 'visible'
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden mix-blend-difference"
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.8)',
        }}
      />

      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => setTrailRef(el, i)}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9997] hidden rounded-full"
          style={{
            background:
              i % 2 === 0
                ? 'rgba(124, 58, 237, 0.5)'
                : 'rgba(6, 214, 160, 0.5)',
          }}
        />
      ))}
    </>
  )
}
