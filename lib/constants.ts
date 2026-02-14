// ─── Design Tokens ─────────────────────────────────────────────
export const COLORS = {
  bg: { primary: '#0a0a0f', secondary: '#111118', card: '#16161f' },
  brand: { from: '#7c3aed', to: '#3b82f6' },
  accent: '#06d6a0',
  accentWarm: '#f472b6',
  divisions: {
    writer: '#7c3aed',
    forge: '#3b82f6',
    games: '#10b981',
    vision: '#f59e0b',
  },
  text: { primary: '#f5f5f5', secondary: '#a0a0b0', muted: '#6b7280' },
  border: '#1e1e2e',
} as const

// ─── Division Types ────────────────────────────────────────────
export type DivisionStatus = 'active' | 'coming-soon'

export interface Division {
  slug: string
  name: string
  icon: string
  color: string
  status: DivisionStatus
  url: string | null
  tagline: string
  description: string
}

// ─── Divisions Data ────────────────────────────────────────────
export const DIVISIONS: Division[] = [
  {
    slug: 'writer',
    name: 'NeoByteWriter',
    icon: 'writer',
    color: '#7c3aed',
    status: 'active',
    url: 'https://neobytewriter.vercel.app',
    tagline: 'AI-powered writing tool for fantasy authors',
    description:
      'Your active secretary for story coherence. Build worlds, track characters, and let AI keep your narrative consistent.',
  },
  {
    slug: 'forge',
    name: 'NeoByteForge',
    icon: 'forge',
    color: '#3b82f6',
    status: 'coming-soon',
    url: null,
    tagline: 'The IP creation foundry',
    description:
      'Where original intellectual properties are born. Worldbuilding, character design, and lore — forged from human creativity and AI power.',
  },
  {
    slug: 'games',
    name: 'NeoByteGames',
    icon: 'games',
    color: '#10b981',
    status: 'coming-soon',
    url: null,
    tagline: 'Indie games from AI-born universes',
    description:
      'Transforming our IPs into playable experiences. Indie games built at the intersection of procedural generation and handcrafted storytelling.',
  },
  {
    slug: 'vision',
    name: 'NeoByteVision',
    icon: 'vision',
    color: '#f59e0b',
    status: 'coming-soon',
    url: null,
    tagline: 'Visual content and IP licensing',
    description:
      'Art direction, media production, and licensing. Bringing our universes to life across every visual medium.',
  },
]

// ─── Layout ───────────────────────────────────────────────────
/** Height of the navbar in pixels — used to offset smooth-scroll targets. */
export const NAVBAR_HEIGHT = 72

// ─── Navigation ────────────────────────────────────────────────
export interface NavLink {
  label: string
  href: string
  external?: boolean
  highlight?: boolean
}

export const NAVIGATION_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Divisions', href: '/#divisions' },
  { label: 'About', href: '/about' },
  { label: 'Try Writer \u2192', href: 'https://neobytewriter.vercel.app', external: true, highlight: true },
]

// ─── Social Links ──────────────────────────────────────────────
export interface SocialLink {
  label: string
  href: string
  icon: string
  brandColor: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'X (Twitter)', href: 'https://x.com/neobytestudios', icon: 'X', brandColor: '#1DA1F2' },
  { label: 'Instagram', href: 'https://instagram.com/neobytestudios', icon: 'IG', brandColor: '#E4405F' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/neobytestudios', icon: 'in', brandColor: '#0A66C2' },
]

// ─── Site Metadata ─────────────────────────────────────────────
export const SITE = {
  name: 'NeoByteStudios',
  tagline: 'Where AI Meets Imagination',
  description:
    'An AI-first studio creating cross-media intellectual properties. Four divisions, one vision.',
  url: 'https://neobytestudios.com',
} as const
