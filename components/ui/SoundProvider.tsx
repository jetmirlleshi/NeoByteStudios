'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'

interface SoundContextType {
  muted: boolean
  toggleMute: () => void
  playHover: () => void
  playClick: () => void
}

const SoundContext = createContext<SoundContextType>({
  muted: true,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
})

export const useSound = () => useContext(SoundContext)

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.03,
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export default function SoundProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [muted, setMuted] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nbs-sound')
    if (stored === 'on') setMuted(false)
  }, [])

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      localStorage.setItem('nbs-sound', next ? 'off' : 'on')
      return next
    })
  }, [])

  const playHover = useCallback(() => {
    if (muted) return
    try {
      const ctx = getCtx()
      playTone(ctx, 800, 0.08, 'sine', 0.02)
    } catch {
      /* Audio not supported */
    }
  }, [muted, getCtx])

  const playClick = useCallback(() => {
    if (muted) return
    try {
      const ctx = getCtx()
      playTone(ctx, 600, 0.06, 'sine', 0.03)
      setTimeout(() => playTone(ctx, 900, 0.1, 'sine', 0.02), 30)
    } catch {
      /* Audio not supported */
    }
  }, [muted, getCtx])

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playHover, playClick }}>
      {children}
    </SoundContext.Provider>
  )
}
