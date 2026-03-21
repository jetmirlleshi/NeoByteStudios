'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Returns true if the viewport is ≤768px OR the device has a coarse pointer
 * (touch screen). SSR-safe: always returns false on first render to avoid
 * hydration mismatches.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px), (pointer: coarse)`
    )
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}
