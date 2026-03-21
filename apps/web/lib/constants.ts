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
  text: { primary: '#f5f5f5', secondary: '#a0a0b0', muted: '#8b92a0' },
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
    tagline: 'AI-native developer toolkit — ship faster, think bigger',
    description:
      'Stop fighting boilerplate. NeoByteForge is an AI-powered developer toolkit built for engineers who want to automate the grunt work and focus on what only they can do: architect, innovate, and ship.',
    metaTitle: 'NeoByteForge — AI Developer Toolkit for Code Generation & Workflow Automation',
    metaDescription:
      'AI-powered code generation, automated refactoring, and dev workflow automation. NeoByteForge is the toolkit that lets developers ship faster without sacrificing quality.',
    longDescription:
      'NeoByteForge is the developer productivity division of NeoByteStudios. Built for engineers who want to harness the full power of AI in their daily workflow — from intelligent, context-aware code generation to automated refactoring, smart documentation, and workflow automation that eliminates repetitive overhead. Whether you are a solo developer shipping at team speed or a dev team looking to radically cut cycle times, Forge gives you an AI co-pilot that understands your stack, your patterns, and your goals. The future of software development is not just writing code faster — it is writing less of the code that does not matter so you can write more of the code that does.',
    features: [
      'AI code generation tailored to your stack and patterns',
      'Automated refactoring with context-aware suggestions',
      'Intelligent documentation generation from existing code',
      'Workflow automation for repetitive dev tasks',
      'Smart debugging assistance with root-cause analysis',
    ],
    useCases: [
      'Solo developers who want to ship at team speed',
      'Startups automating their development workflow to move faster',
      'Engineers tired of writing repetitive boilerplate',
      'Dev teams looking to 10x throughput without scaling headcount',
    ],
    faq: [
      {
        question: 'When will NeoByteForge launch?',
        answer: 'NeoByteForge is in active development targeting a Late 2026 release. Join the waitlist to get early access, shape the product with direct feedback, and be the first to use it.',
      },
      {
        question: 'What languages and frameworks will NeoByteForge support?',
        answer: 'NeoByteForge is being built stack-agnostic from day one — with priority support for JavaScript/TypeScript, Python, Rust, and Go. AI assistance that works where you already work.',
      },
      {
        question: 'Will it replace my IDE?',
        answer: 'No. NeoByteForge is designed to integrate into your existing workflow as an AI co-pilot — not replace your tools. Think of it as the intelligent layer on top of everything you already use.',
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
    tagline: 'Indie games built at the speed of imagination',
    description:
      'NeoByteGames is an AI-powered indie game studio where rich, lore-deep universes become unforgettable interactive experiences — developed faster and more ambitiously than ever before.',
    metaTitle: 'NeoByteGames — AI-Powered Indie Game Studio | Story-First Gaming Experiences',
    metaDescription:
      'AI-accelerated indie games with AAA narrative depth. NeoByteGames builds story-first interactive experiences rooted in rich lore — where procedural generation meets intentional design.',
    longDescription:
      'NeoByteGames is building a new model for indie game development: one where AI compresses the development cycle without compressing the vision. Every title we create is rooted in deep, pre-built lore developed across the NeoByteStudios ecosystem — meaning our games launch with the narrative backbone most studios take years to construct. We combine AI-assisted level design, procedural generation guided by intentional narrative design, and handcrafted story beats to create experiences that feel both expansive and authored. Indie in spirit. AAA in ambition. Powered by AI.',
    features: [
      'AI-accelerated game development pipeline',
      'Procedural generation guided by narrative design — not randomness',
      'Deep lore integration from the full NeoByteStudios universe',
      'Multi-platform publishing: PC, mobile, and console',
      'AI-assisted level design, balancing, and playtesting',
    ],
    useCases: [
      'Players who want story-first indie games with genuine depth',
      'Narrative RPG fans tired of shallow mechanics and thin worlds',
      'Gamers who love handcrafted stories with procedural replay value',
      'Fans of NeoByteStudios IP wanting to explore universes interactively',
    ],
    faq: [
      {
        question: 'What kind of games will NeoByteGames release?',
        answer: 'We focus on story-driven experiences — narrative RPGs, exploration games, and interactive fiction — built on rich lore and developed with AI tools. Indie in scale, AAA in world depth.',
      },
      {
        question: 'How does AI change the way you make indie games?',
        answer: 'AI compresses the timeline radically. Tasks that once required a team of 20 over two years, we can execute with a focused team in months. That means more games, more ambitious worlds, and faster iteration — without sacrificing quality.',
      },
      {
        question: 'Will the games be free?',
        answer: 'Pricing will vary per title. Our goal is to make our games widely accessible while sustaining the studio. Expect a mix of free-to-play and premium experiences depending on scope.',
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
    tagline: 'AI-generated visuals that bring worlds to life',
    description:
      'NeoByteVision is where imagination becomes image. AI art generation, video production, and concept design that transforms the worlds we build into stunning visual realities — at a scale no traditional studio can match.',
    metaTitle: 'NeoByteVision — AI Art Generation, Video Production & Concept Design Studio',
    metaDescription:
      'AI-powered concept art, video generation, and visual media production. NeoByteVision brings fictional universes to life through cutting-edge generative AI tools and intentional art direction.',
    longDescription:
      'NeoByteVision is the visual media division of NeoByteStudios — powered by the latest AI art and video generation models, and guided by intentional art direction. We produce concept art, character design sheets, environment visuals, animated content, and full visual identities for the universes we build. What once required a studio full of artists working for months, Vision delivers in days — without sacrificing the quality or coherence that makes visual storytelling powerful. Whether it is a sweeping fantasy landscape, a sci-fi character in exhaustive detail, or a teaser trailer generated entirely with AI, NeoByteVision is the visual engine behind the NeoByteStudios universe.',
    features: [
      'AI-powered concept art and character design generation',
      'Video generation for trailers, animated shorts, and teasers',
      'Visual development pipelines for IP universes',
      'Brand-consistent art direction across all media',
      'IP licensing and visual merchandise partnerships',
    ],
    useCases: [
      'Creators who need professional-grade concept art without a full art team',
      'Studios requiring rapid visual development for new IP universes',
      'Content creators building visually immersive fictional worlds',
      'Partners and brands looking to license stunning AI-generated IP',
    ],
    faq: [
      {
        question: 'Can I commission AI-generated art or visuals through NeoByteVision?',
        answer: 'Yes. NeoByteVision will offer visual development services and tools for creators who want AI-generated concept art, character design, and visual content for their own projects. Join the waitlist to be first in line.',
      },
      {
        question: 'What kind of video content will NeoByteVision produce?',
        answer: 'We are building for everything from short animated clips and teaser trailers to longer-form visual content and art-book-style showcases. The goal is full-stack visual media production, powered by AI and shaped by intentional creative direction.',
      },
      {
        question: 'Can I license NeoByteStudios IP through Vision?',
        answer: 'Once NeoByteVision launches, we will open licensing opportunities for select IP universes. Waitlist members will be the first notified when partnerships become available.',
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
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Vision', href: '/vision' },
  { label: 'Blog', href: '/blog' },
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

// ─── Pricing ──────────────────────────────────────────────────
export interface PricingPlan {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  iconName: string
  color: string
  features: string[]
  cta: string
  popular?: boolean
  stripeLink: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    iconName: 'Sparkles',
    color: 'from-text-muted to-text-secondary',
    features: [
      '1 active project',
      'Basic character tracking',
      'World-building templates',
      '5,000 words per month',
      'Community support',
    ],
    cta: 'Get Started Free',
    stripeLink: 'https://neobytewriter.vercel.app/signup',
  },
  {
    name: 'Pro',
    description: 'For serious creators',
    monthlyPrice: 9,
    yearlyPrice: 90,
    iconName: 'Zap',
    color: 'from-violet-500 to-violet-600',
    features: [
      'Unlimited projects',
      'Advanced AI suggestions',
      'Cloud sync across devices',
      'Unlimited words',
      'Export to PDF/EPUB',
      'Priority support',
      'Version history',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    stripeLink: 'https://neobytewriter.vercel.app/signup',
  },
  {
    name: 'Studio',
    description: 'For professional teams',
    monthlyPrice: 29,
    yearlyPrice: 290,
    iconName: 'Crown',
    color: 'from-amber-500 to-orange-600',
    features: [
      'Everything in Pro',
      'Multi-IP management',
      'Team collaboration (up to 5)',
      'Cross-media planning tools',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
    ],
    cta: 'Contact Sales',
    stripeLink: 'mailto:sales@neobytestudios.com',
  },
]

// ─── Roadmap ──────────────────────────────────────────────────
export interface RoadmapItem {
  name: string
  tagline: string
  description: string
  iconName: string
  status: 'active' | 'development' | 'planned'
  progress: number
  expectedDate?: string
  color: string
  features: string[]
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    name: 'NeoByteWriter',
    tagline: 'AI-powered writing tool for fantasy authors',
    description: 'Stop losing track of your story. NeoByteWriter keeps your world, characters, and plot threads organized so you can focus on what matters — the writing.',
    iconName: 'PenTool',
    status: 'active',
    progress: 100,
    color: 'from-violet-500 to-violet-600',
    features: ['Character tracking', 'World-building tools', 'Plot management', 'AI suggestions'],
  },
  {
    name: 'NeoByteForge',
    tagline: 'The IP creation foundry',
    description: 'Build universes that span every medium from day one. NeoByteForge is where original intellectual properties are born — designed for cross-media from the start.',
    iconName: 'Factory',
    status: 'development',
    progress: 25,
    expectedDate: 'Late 2026',
    color: 'from-blue-500 to-blue-600',
    features: ['IP templates', 'Cross-media planning', 'Asset management', 'Collaboration tools'],
  },
  {
    name: 'NeoByteGames',
    tagline: 'Indie games from AI-born universes',
    description: 'Play the stories you read. NeoByteGames transforms our IPs into interactive experiences — indie games where procedural generation meets handcrafted narrative.',
    iconName: 'Gamepad2',
    status: 'planned',
    progress: 10,
    expectedDate: '2027',
    color: 'from-emerald-500 to-emerald-600',
    features: ['Game engine', 'Narrative systems', 'Procedural worlds', 'Multi-platform'],
  },
  {
    name: 'NeoByteVision',
    tagline: 'Visual content and IP licensing',
    description: 'See the worlds we build. NeoByteVision handles art direction, media production, and licensing — bringing our universes to life across every visual medium.',
    iconName: 'Eye',
    status: 'planned',
    progress: 5,
    expectedDate: '2027',
    color: 'from-amber-500 to-orange-600',
    features: ['Art generation', 'Video production', 'Licensing platform', 'Brand management'],
  },
]

// ─── Testimonials ─────────────────────────────────────────────
export interface Testimonial {
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Fantasy Author',
    avatar: 'SC',
    content: 'NeoByteWriter completely transformed how I organize my world-building. What used to take weeks now takes days. The AI suggestions are incredibly intuitive.',
    rating: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Indie Game Developer',
    avatar: 'MW',
    content: 'The cross-media approach is genius. I can develop my game universe and book simultaneously, keeping everything consistent. Pure magic.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    avatar: 'ER',
    content: 'As a solo creator, I never thought I could compete with big studios. NeoByteStudios proved me wrong. The AI amplification is real.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Screenwriter',
    avatar: 'JP',
    content: 'The character tracking feature alone is worth it. No more continuity errors, no more lost notes. Everything is connected and accessible.',
    rating: 5,
  },
]

// ─── FAQ ──────────────────────────────────────────────────────
export interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Can I switch plans anytime?',
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.",
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: "Absolutely! Pro plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial and won't be charged.",
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains yours. If you cancel, you can export everything in standard formats (PDF, EPUB, JSON). Free accounts keep data for 30 days after cancellation.',
  },
  {
    question: 'Do you offer refunds?',
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If NeoByteWriter isn't right for you, contact support for a full refund.",
  },
  {
    question: 'Can I use NeoByteWriter for commercial projects?',
    answer: "Yes! All plans allow commercial use. You retain 100% ownership of your intellectual property. We're just the tool that helps you create.",
  },
]

// ─── Stats ────────────────────────────────────────────────────
export interface Stat {
  value: number
  suffix: string
  label: string
  iconName: string
  color: string
  delay: number
}

export const STATS: Stat[] = [
  { iconName: 'Users', value: 2847, suffix: '+', label: 'Creators on Waitlist', color: 'bg-gradient-to-br from-violet-500 to-violet-600', delay: 0 },
  { iconName: 'Layers', value: 4, suffix: '', label: 'Creative Divisions', color: 'bg-gradient-to-br from-blue-500 to-blue-600', delay: 100 },
  { iconName: 'Globe', value: 1, suffix: '', label: 'Universal IP in Development', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', delay: 200 },
  { iconName: 'Zap', value: 100, suffix: '%', label: 'AI-Powered Workflow', color: 'bg-gradient-to-br from-amber-500 to-orange-600', delay: 300 },
]

// ─── Vision Cards ─────────────────────────────────────────────
export interface VisionCard {
  title: string
  description: string
  iconName: string
  color: string
  delay: number
}

export const VISION_CARDS: VisionCard[] = [
  {
    iconName: 'Lightbulb',
    title: 'The Vision',
    description: 'NeoByteStudios is built on a radical idea: a single creator, empowered by AI, can rival entire studios. Not by replacing talent, but by removing the bottlenecks that hold visionaries back.',
    color: 'bg-gradient-to-br from-violet-500 to-violet-600',
    delay: 0,
  },
  {
    iconName: 'Layers',
    title: 'Cross-Media DNA',
    description: "Every intellectual property we create is designed for cross-media from day zero. A world isn't just a book — it's a game, a visual experience, a licensable universe.",
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    delay: 150,
  },
  {
    iconName: 'Cpu',
    title: 'AI-Powered Scale',
    description: 'AI makes imagination scalable and frees creators from operational limits. What once required teams of dozens now flows from a single creative mind.',
    color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    delay: 300,
  },
]

// ─── Changelog ────────────────────────────────────────────────
export interface ChangelogEntry {
  id: string
  version: string
  date: string
  title: string
  description: string
  type: 'feature' | 'improvement' | 'bugfix' | 'breaking'
  items: { text: string; type: 'new' | 'improved' | 'fixed' }[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: '1', version: 'v1.2.0', date: '2025-03-01',
    title: 'Character Relationships & Timeline View',
    description: 'Major update focusing on character management and story timeline visualization.',
    type: 'feature',
    items: [
      { text: 'Character relationship mapping with interactive graph', type: 'new' },
      { text: 'Timeline view for tracking story events chronologically', type: 'new' },
      { text: 'Export to PDF with custom formatting options', type: 'improved' },
      { text: 'Faster AI suggestions (2x speed improvement)', type: 'improved' },
    ],
  },
  {
    id: '2', version: 'v1.1.0', date: '2025-02-15',
    title: 'World-Building Templates & Dark Mode',
    description: 'New templates for faster world creation and improved UI with dark mode support.',
    type: 'feature',
    items: [
      { text: '10 new world-building templates (fantasy, sci-fi, horror)', type: 'new' },
      { text: 'Dark mode for late-night writing sessions', type: 'new' },
      { text: 'Improved character form with more fields', type: 'improved' },
      { text: 'Fixed sync issues on mobile devices', type: 'fixed' },
    ],
  },
  {
    id: '3', version: 'v1.0.5', date: '2025-02-01',
    title: 'Bug Fixes & Performance',
    description: 'Stability improvements and bug fixes based on user feedback.',
    type: 'bugfix',
    items: [
      { text: 'Fixed autosave not triggering consistently', type: 'fixed' },
      { text: 'Resolved character deletion bug', type: 'fixed' },
      { text: 'Improved loading speed for large projects', type: 'improved' },
    ],
  },
  {
    id: '4', version: 'v1.0.0', date: '2025-01-20',
    title: 'NeoByteWriter Launch',
    description: 'Official launch of NeoByteWriter - AI-powered writing tool for fantasy authors.',
    type: 'feature',
    items: [
      { text: 'Character tracking and management', type: 'new' },
      { text: 'World-building tools and templates', type: 'new' },
      { text: 'Plot management with chapter organization', type: 'new' },
      { text: 'AI-powered writing suggestions', type: 'new' },
    ],
  },
]

// ─── Upcoming Features ────────────────────────────────────────
export interface UpcomingFeature {
  title: string
  description: string
  eta: string
  status: 'planned' | 'in-progress' | 'beta'
}

export const UPCOMING_FEATURES: UpcomingFeature[] = [
  { title: 'Collaborative Editing', description: 'Real-time collaboration for teams. Multiple authors working on the same project simultaneously.', eta: 'Q2 2025', status: 'in-progress' },
  { title: 'Mobile App', description: 'Native iOS and Android apps for writing on the go with offline support.', eta: 'Q2 2025', status: 'planned' },
  { title: 'Advanced AI Plot Suggestions', description: 'AI that analyzes your story and suggests plot twists, character arcs, and conflict resolutions.', eta: 'Q3 2025', status: 'planned' },
  { title: 'Export to Game Engines', description: 'Direct export to Unity and Unreal Engine for game developers.', eta: 'Q4 2025', status: 'planned' },
]

// ─── Newsletters ──────────────────────────────────────────────
export interface NewsletterArticle {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  readTime: string
  slug: string
}

export const NEWSLETTERS: NewsletterArticle[] = [
  {
    id: '1',
    title: 'AI-Assisted Writing: Tools, Not Ghostwriters',
    excerpt: 'How NeoByteWriter uses AI to help authors organize, track, and maintain consistency — without writing a single word of their story.',
    content: '<p>There is a common misconception about AI writing tools: that they will replace human creativity. At NeoByteStudios, we believe the opposite.</p><h3>The Real Value of AI in Writing</h3><p>AI does not write your story. It handles the operational complexity so you can focus on what matters: the narrative, the characters, the world.</p><ul><li>It remembers character details so you do not have to</li><li>It tracks plot threads across chapters</li><li>It suggests consistency fixes</li><li>It organizes your world-building notes</li></ul><h3>The Human Element</h3><p>Every word of prose, every emotional beat, every plot twist comes from you. The AI just removes the friction.</p>',
    date: '2025-03-05',
    tags: ['AI Writing', 'NeoByteWriter', 'Creativity'],
    readTime: '5 min read',
    slug: 'ai-assisted-writing-tools',
  },
  {
    id: '2',
    title: 'Designing IP for Cross-Media from Day Zero',
    excerpt: 'Why we build every universe to work across books, games, and visual media simultaneously — and how that changes the creative process.',
    content: '<p>Traditional studios create content for one medium, then adapt it to others. Books become movies. Games get novelizations.</p><h3>The NeoByte Approach</h3><p>We design every intellectual property for cross-media from day one. A world is not just a book — it is a game, a visual experience, a licensable universe.</p><h3>What This Means for Creators</h3><ul><li>A narrative foundation that works in any medium</li><li>Character bibles ready for game development</li><li>World maps and lore that translate to visual media</li><li>IP assets that can be licensed</li></ul>',
    date: '2025-02-10',
    tags: ['Cross-Media', 'IP Design', 'Strategy'],
    readTime: '7 min read',
    slug: 'cross-media-ip-design',
  },
  {
    id: '3',
    title: 'Why the One-Person Studio Model Works',
    excerpt: 'How AI is enabling solo creators to build at the scope and quality of traditional studios — and why NeoByteStudios is betting everything on this model.',
    content: '<p>Five years ago, building a game studio required a team of 20+ people. Writers, designers, engineers, producers, marketers.</p><h3>The AI Revolution</h3><p>Today, one creator with the right AI tools can match that output. Not by replacing creativity, but by amplifying it.</p><h3>The Numbers</h3><ul><li>1 creator building 4 divisions</li><li>AI handling operational tasks</li><li>Human focused on vision and story</li><li>Output rivaling traditional studios</li></ul>',
    date: '2025-01-15',
    tags: ['Studio Model', 'AI', 'Solo Creator'],
    readTime: '6 min read',
    slug: 'one-person-studio-model',
  },
]

// ─── Referral Rewards ─────────────────────────────────────────
export interface Reward {
  referrals: number
  reward: string
  icon: string
}

export const REWARDS: Reward[] = [
  { referrals: 1, reward: '1 Month Pro Free', icon: '🎁' },
  { referrals: 3, reward: '3 Months Pro Free', icon: '🚀' },
  { referrals: 5, reward: '6 Months Pro Free', icon: '👑' },
  { referrals: 10, reward: 'Lifetime Pro Access', icon: '💎' },
]

// ─── Launch Date ──────────────────────────────────────────────
export const LAUNCH_DATE = new Date('2026-12-31T00:00:00')

// ─── Footer Links ─────────────────────────────────────────────
export const FOOTER_LINKS = {
  studio: [
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Vision', href: '/vision' },
      { label: 'Blog', href: '/blog' },
  ],
  divisions: [
    { label: 'NeoByteWriter', href: 'https://neobytewriter.vercel.app', external: true },
    { label: 'NeoByteForge', href: '/divisions/forge' },
    { label: 'NeoByteGames', href: '/divisions/games' },
    { label: 'NeoByteVision', href: '/divisions/vision' },
  ],
} as const
