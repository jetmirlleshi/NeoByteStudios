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
  metaTitle: string
  metaDescription: string
  longDescription: string
  features: string[]
  useCases: string[]
  faq: { question: string; answer: string }[]
  /** Approximate launch window for coming-soon divisions */
  expectedLaunch?: string
  /** Development progress 0-100 for coming-soon divisions */
  developmentProgress?: number
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
      'Stop losing track of your story. NeoByteWriter keeps your world, characters, and plot threads organized so you can focus on what matters — the writing.',
    metaTitle: 'NeoByteWriter — AI Writing Tool for Fantasy Authors & Worldbuilders',
    metaDescription:
      'Build worlds, track characters, and maintain story coherence with AI-powered writing assistance. Free tool designed specifically for fantasy and sci-fi authors.',
    longDescription:
      'NeoByteWriter is the first division of NeoByteStudios — an AI-powered writing assistant built from the ground up for fantasy and science fiction authors. It acts as your active story secretary: tracking characters, locations, plot threads, and lore so nothing falls through the cracks. Whether you are writing your first novel or managing a sprawling multi-book series, Writer helps you maintain narrative coherence without breaking your creative flow.',
    features: [
      'Character tracking with relationships and arcs',
      'Interactive worldbuilding with lore management',
      'AI-powered consistency checking across chapters',
      'Plot thread visualization and tracking',
      'Export-ready manuscript formatting',
    ],
    useCases: [
      'Fantasy novelists managing complex magic systems',
      'Sci-fi authors building detailed universes',
      'Series writers maintaining continuity across books',
      'Worldbuilders organizing extensive lore',
    ],
    faq: [
      {
        question: 'Is NeoByteWriter free to use?',
        answer: 'NeoByteWriter is currently free during its early access period. We plan to offer a generous free tier alongside premium features in the future.',
      },
      {
        question: 'What genres does NeoByteWriter support?',
        answer: 'While designed with fantasy and sci-fi in mind, NeoByteWriter works for any genre that involves worldbuilding, complex characters, or long-form storytelling.',
      },
      {
        question: 'Does the AI write my story for me?',
        answer: 'No. NeoByteWriter is an organizational and consistency tool, not a ghostwriter. The AI assists with tracking, suggestions, and coherence — the creative vision remains entirely yours.',
      },
    ],
  },
  {
    slug: 'forge',
    name: 'NeoByteForge',
    icon: 'forge',
    color: '#3b82f6',
    status: 'coming-soon',
    url: null,
    expectedLaunch: 'Late 2026',
    developmentProgress: 25,
    tagline: 'The IP creation foundry',
    description:
      'Build universes that span every medium from day one. NeoByteForge is where original intellectual properties are born — designed for cross-media from the start.',
    metaTitle: 'NeoByteForge — Cross-Media IP Creation & Worldbuilding Platform',
    metaDescription:
      'Create original intellectual properties designed for cross-media from day one. Worldbuilding, character design, and lore management — all in one platform.',
    longDescription:
      'NeoByteForge is the creative engine of NeoByteStudios. It provides the tools and framework for building original intellectual properties that are designed from their inception to work across multiple media — books, games, visual content, and licensing. Every world starts with a unified creative bible that ensures consistency no matter where the story is told.',
    features: [
      'Unified IP bible for cross-media consistency',
      'Character design pipeline with visual references',
      'Lore database with relationship mapping',
      'Media adaptation planning tools',
      'Collaborative worldbuilding workspace',
    ],
    useCases: [
      'Creating original fantasy or sci-fi universes',
      'Planning cross-media IP launches',
      'Building consistent worlds for multiple authors',
      'Designing characters with cross-platform appeal',
    ],
    faq: [
      {
        question: 'When will NeoByteForge launch?',
        answer: 'NeoByteForge is currently in active development. Sign up for our waitlist to be among the first to access it when it launches.',
      },
      {
        question: 'How is Forge different from Writer?',
        answer: 'Writer focuses on the writing process itself. Forge is the strategic layer above it — where you design the IP, plan its cross-media life, and manage the creative bible that feeds into Writer, Games, and Vision.',
      },
    ],
  },
  {
    slug: 'games',
    name: 'NeoByteGames',
    icon: 'games',
    color: '#10b981',
    status: 'coming-soon',
    url: null,
    expectedLaunch: '2027',
    developmentProgress: 10,
    tagline: 'Indie games from AI-born universes',
    description:
      'Play the stories you read. NeoByteGames transforms our IPs into interactive experiences — indie games where procedural generation meets handcrafted narrative.',
    metaTitle: 'NeoByteGames — Indie Games from AI-Powered Story Universes',
    metaDescription:
      'Indie games built at the intersection of procedural generation and handcrafted storytelling. Play the universes born from NeoByteStudios IP.',
    longDescription:
      'NeoByteGames is where our intellectual properties become playable. Every game is rooted in a universe first developed through Forge and Writer, ensuring rich lore, deep characters, and a narrative backbone that most indie titles lack. We combine procedural generation with handcrafted story beats to create experiences that feel both expansive and intentional.',
    features: [
      'Games rooted in rich, pre-built lore',
      'Procedural generation guided by narrative design',
      'Cross-media story connections',
      'Indie-scale with AAA worldbuilding depth',
    ],
    useCases: [
      'Story-driven indie game experiences',
      'Exploring NeoByteStudios universes interactively',
      'Narrative RPGs with deep lore',
    ],
    faq: [
      {
        question: 'What kind of games will NeoByteGames make?',
        answer: 'We focus on story-driven indie games — think narrative RPGs, exploration games, and interactive fiction — all set in the universes we create through NeoByteForge.',
      },
      {
        question: 'Will the games be free?',
        answer: 'Pricing will vary per title. Our goal is to make our games accessible while sustaining the studio. Expect a mix of free and premium experiences.',
      },
    ],
  },
  {
    slug: 'vision',
    name: 'NeoByteVision',
    icon: 'vision',
    color: '#f59e0b',
    status: 'coming-soon',
    url: null,
    expectedLaunch: '2027',
    developmentProgress: 5,
    tagline: 'Visual content and IP licensing',
    description:
      'See the worlds we build. NeoByteVision handles art direction, media production, and licensing — bringing our universes to life across every visual medium.',
    metaTitle: 'NeoByteVision — Visual Content & IP Licensing for AI-Born Universes',
    metaDescription:
      'Art direction, media production, and IP licensing. Bringing AI-born creative universes to life across visual media, merchandise, and partnerships.',
    longDescription:
      'NeoByteVision is the visual and commercial arm of NeoByteStudios. It handles everything from concept art and media production to IP licensing and merchandise. When a universe created in Forge reaches visual maturity, Vision takes it to the world — through art books, animated content, licensed products, and brand partnerships.',
    features: [
      'Concept art and visual development pipeline',
      'IP licensing and partnership management',
      'Brand-consistent visual identity across media',
      'Merchandise and product design',
    ],
    useCases: [
      'Visual development for IP universes',
      'Licensing our worlds to partners and platforms',
      'Creating art books and visual companions',
      'Merchandise design and production',
    ],
    faq: [
      {
        question: 'Can I license NeoByteStudios IP?',
        answer: 'Once NeoByteVision launches, we will offer licensing opportunities for select IPs. Join our waitlist to be notified when partnerships open.',
      },
      {
        question: 'What visual media will Vision produce?',
        answer: 'We plan to create concept art collections, art books, animated shorts, and visual companion pieces for our IP universes.',
      },
    ],
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
  { label: 'Blog', href: '/blog' },
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
    'NeoByteStudios is an AI-first creative studio building original cross-media intellectual properties. From writing tools to games and visual media — four divisions, one vision, powered by AI and human creativity.',
  url: 'https://neobytestudios.com',
} as const
