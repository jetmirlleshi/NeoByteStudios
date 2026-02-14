'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * HeroVisual — Animated abstract generative shape that serves as the
 * focal visual element in the Hero section. Draws a morphing polygon
 * with gradient fill that slowly rotates and breathes.
 */
export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const prefersReducedMotion = useReducedMotion()

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    ctx.clearRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const baseRadius = Math.min(w, h) * 0.35
    const t = time * 0.0003

    // Draw multiple layered shapes
    for (let layer = 0; layer < 3; layer++) {
      const points = 6 + layer * 2
      const layerOffset = layer * 0.7
      const layerRadius = baseRadius * (1 - layer * 0.15)
      const opacity = 0.08 - layer * 0.02

      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2 + t * (1 + layer * 0.3)
        const wobble = Math.sin(t * 2 + i + layerOffset) * 0.15
        const r = layerRadius * (1 + wobble)
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, layerRadius * 1.2)
      if (layer === 0) {
        grad.addColorStop(0, `rgba(124, 58, 237, ${opacity * 2})`)
        grad.addColorStop(0.5, `rgba(59, 130, 246, ${opacity})`)
        grad.addColorStop(1, 'transparent')
      } else if (layer === 1) {
        grad.addColorStop(0, `rgba(6, 214, 160, ${opacity * 1.5})`)
        grad.addColorStop(0.5, `rgba(124, 58, 237, ${opacity})`)
        grad.addColorStop(1, 'transparent')
      } else {
        grad.addColorStop(0, `rgba(59, 130, 246, ${opacity * 1.5})`)
        grad.addColorStop(0.5, `rgba(244, 114, 182, ${opacity})`)
        grad.addColorStop(1, 'transparent')
      }

      ctx.fillStyle = grad
      ctx.fill()

      // Stroke
      ctx.strokeStyle = layer === 0
        ? `rgba(124, 58, 237, ${0.15 - layer * 0.04})`
        : `rgba(59, 130, 246, ${0.1 - layer * 0.03})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Central glow
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.3)
    glowGrad.addColorStop(0, 'rgba(124, 58, 237, 0.15)')
    glowGrad.addColorStop(0.5, 'rgba(6, 214, 160, 0.05)')
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, w, h)

    // Floating particles
    const particleCount = 40
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 137.508
      const px = ((Math.sin(seed + t * 0.3) * 0.5 + 0.5) * w * 0.8) + w * 0.1
      const py = ((Math.cos(seed * 0.7 + t * 0.2) * 0.5 + 0.5) * h * 0.8) + h * 0.1
      const pSize = 1 + Math.sin(seed) * 0.8
      const pAlpha = 0.15 + Math.sin(t + seed) * 0.1

      ctx.beginPath()
      ctx.arc(px, py, pSize, 0, Math.PI * 2)
      const colors = ['124,58,237', '6,214,160', '59,130,246']
      ctx.fillStyle = `rgba(${colors[i % 3]}, ${pAlpha})`
      ctx.fill()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [prefersReducedMotion, draw])

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center"
      >
        <div
          className="rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)',
          }}
        />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      style={{ opacity: 0.8 }}
    />
  )
}
