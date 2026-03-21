import { seededRandom } from '@/lib/utils'

/**
 * FloatingOrbs — decorative background orbs that slowly drift across the
 * viewport, adding depth and atmosphere to sections. Each orb is a large,
 * heavily blurred gradient circle positioned behind content.
 *
 * This is a **server component**. Animation is pure CSS (keyframes defined
 * in globals.css), so no client JS is needed.
 *
 * Respects prefers-reduced-motion via the `.floating-orb` class rule in
 * globals.css which freezes all animation.
 */

interface OrbConfig {
  /** CSS left position as percentage string */
  left: string
  /** CSS top position as percentage string */
  top: string
  /** Diameter in pixels */
  size: number
  /** CSS blur radius in pixels */
  blur: number
  /** CSS opacity */
  opacity: number
  /** Animation duration in seconds */
  duration: number
  /** Animation delay in seconds */
  delay: number
  /** Which drift keyframe to use (1-4) */
  driftIndex: number
  /** Gradient colors */
  color1: string
  color2: string
}

/** Brand-aligned orb color pairs — purple, blue, green/teal, amber accents */
const ORB_PALETTES: [string, string][] = [
  ['rgba(124, 58, 237, 0.6)', 'rgba(99, 40, 210, 0.2)'],   // purple (brand-from)
  ['rgba(59, 130, 246, 0.6)', 'rgba(37, 99, 235, 0.2)'],    // blue   (brand-to)
  ['rgba(16, 185, 129, 0.4)', 'rgba(59, 130, 246, 0.2)'],   // teal-blue (games+forge)
  ['rgba(124, 58, 237, 0.5)', 'rgba(59, 130, 246, 0.3)'],   // purple-blue blend
]

function generateOrbs(seed: number): OrbConfig[] {
  const rand = seededRandom(seed)
  const count = 4
  const orbs: OrbConfig[] = []

  for (let i = 0; i < count; i++) {
    const palette = ORB_PALETTES[i % ORB_PALETTES.length]
    orbs.push({
      left: `${10 + rand() * 70}%`,
      top: `${5 + rand() * 70}%`,
      size: 300 + Math.round(rand() * 200),
      blur: 80 + Math.round(rand() * 40),
      opacity: 0.07 + rand() * 0.05,
      duration: 35 + Math.round(rand() * 25),
      delay: Math.round(rand() * 10),
      driftIndex: (i % 4) + 1,
      color1: palette[0],
      color2: palette[1],
    })
  }
  return orbs
}

interface FloatingOrbsProps {
  /** Seed for deterministic orb placement (default: 7) */
  seed?: number
}

export default function FloatingOrbs({ seed = 7 }: FloatingOrbsProps) {
  const orbs = generateOrbs(seed)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="floating-orb absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at center, ${orb.color1}, ${orb.color2}, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            animation: `orb-drift-${orb.driftIndex} ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            /* willChange removed — CSS animation promotes layer */
          }}
        />
      ))}
    </div>
  )
}
