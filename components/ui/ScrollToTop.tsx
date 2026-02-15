'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handleChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      mq.removeEventListener('change', handleChange)
    }
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
      className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border-custom bg-bg-secondary/80 backdrop-blur-sm text-text-secondary transition-all duration-300 hover:text-accent hover:border-accent hover:shadow-[0_0_20px_4px_rgba(6,214,160,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Scroll to top"
      style={reducedMotion ? undefined : { animation: 'bounce-subtle 2s ease-in-out infinite' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
