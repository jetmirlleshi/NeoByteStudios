# NeoByteWriter v2 — Contesto Completo per Claude Code

> Questo file contiene tutto il contesto necessario per lavorare sul progetto NeoByteWriter v2.
> Ultimo aggiornamento: 2026-02-23. Build: 0 errori, 49 API routes, Next.js 16.1.6.

---

## 1. Cos'è NeoByteWriter

NeoByteWriter è uno **strumento di scrittura AI-powered per autori di fiction** (fantasy, sci-fi, thriller, ecc.). Fa parte dell'ecosistema **NeoByteStudios** (monorepo Turborepo). L'app permette di:

- Scrivere romanzi con un editor professionale (TipTap)
- Gestire il worldbuilding (personaggi, luoghi, fazioni, oggetti, magia, timeline, relazioni, sottotrame, regole)
- Usare un assistente AI per generazione testo, controllo coerenza, suggerimenti
- Tracciare statistiche di scrittura e analisi del testo
- Esportare in DOCX, Markdown, e come "bibbia del mondo"
- Gestire abbonamenti con Stripe (FREE / WRITER / PROFESSIONAL)

---

## 2. Monorepo Structure

```
C:\Users\miri\Desktop\Progetti\neobytestudios\
├── apps/
│   ├── web/              ← Sito marketing NeoByteStudios (Next.js, separato)
│   └── writer/           ← NeoByteWriter v2 (QUESTO PROGETTO)
├── packages/
│   ├── db/               ← Drizzle ORM + schema PostgreSQL (Neon)
│   ├── auth/             ← Neon Auth config (server + client)
│   └── ui/               ← Shared UI (quasi vuoto per ora)
├── turbo.json
├── package.json          ← pnpm workspaces, Turbo v2
└── pnpm-workspace.yaml
```

**Package manager**: pnpm 9.15.4
**Node**: >= 20
**Turbo**: v2.8.10

---

## 3. Tech Stack

| Area | Tecnologia |
|------|-----------|
| Framework | Next.js 16.1.6, App Router, Turbopack |
| React | React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4, CSS Variables (oklch), shadcn/ui (new-york) |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Auth | Neon Auth (`@neondatabase/auth`) |
| AI | Anthropic Claude (`@anthropic-ai/sdk`), OpenAI (embeddings) |
| Vector DB | Pinecone (`@pinecone-database/pinecone`) |
| Editor | TipTap v3 |
| State | Zustand v5 (6 stores), TanStack Query v5 |
| Payments | Stripe v20 |
| Email | Resend |
| i18n | next-intl (configurato, non ancora integrato nei componenti) |
| Testing | Vitest (unit), Playwright (E2E) |
| UI Components | shadcn/ui: card, badge, button, tabs, select, dialog, progress, checkbox, label, separator, sheet, input, tooltip, popover, scroll-area, dropdown-menu, accordion, switch |
| Icons | lucide-react |
| Notifications | sonner |
| Theme | next-themes (dark/light/system) |
| Charts | Recharts v3 |
| Export | docx v9 (DOCX), custom (Markdown, Bible) |
| Command Palette | cmdk |

---

## 4. Convenzioni Critiche

### 4.1 Imports DB — MAI importare drizzle-orm direttamente

```typescript
// CORRETTO - sempre da @neobytestudios/db
import { db, eq, and, isNull, sql, count, desc, asc } from "@neobytestudios/db";
import { nbwProjects, nbwChapters, nbwCharacters } from "@neobytestudios/db/schema";

// SBAGLIATO - causa duplicate resolution nel monorepo
import { eq } from "drizzle-orm"; // MAI FARE QUESTO nell'app writer
```

### 4.2 Auth Pattern

```typescript
// Server-side
import { auth } from "@/lib/auth/server"; // re-export da @neobytestudios/auth
const { data: session } = await auth.getSession();
// session.user.id, session.user.name, session.user.email

// Client-side
import { authClient } from "@/lib/auth/client"; // re-export da @neobytestudios/auth/client

// API route auth helper
import { getAuthSession, unauthorized, badRequest, notFound, forbidden, conflict } from "@/lib/api-helpers";
```

### 4.3 API Routes — Next.js 16 async params

```typescript
// Next.js 16: params è una Promise
export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  // ...
}
```

### 4.4 Middleware (proxy.ts, NON middleware.ts)

```typescript
// src/proxy.ts — Next.js 16 ha rinominato middleware.ts → proxy.ts
import { auth } from "@/lib/auth/server";
export default auth.middleware({ loginUrl: "/auth/sign-in" });
export const config = { matcher: ["/dashboard/:path*", "/account/:path*"] };
```

### 4.5 Componenti Client

```typescript
"use client"; // Prima riga, obbligatorio per componenti interattivi
```

### 4.6 shadcn/ui imports

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Radix primitives usano "radix-ui" (NON "@radix-ui/react-*")
```

### 4.7 Drizzle schema — NON usare .js extension

```typescript
// In packages/db/src/schema/*.ts — MAI usare .js nelle import
export * from "./user-profiles"; // CORRETTO
export * from "./user-profiles.js"; // SBAGLIATO — drizzle-kit non risolve
```

### 4.8 Testo UI

Tutto il testo UI deve essere in **italiano**. I termini tecnici (nomi di file, variabili, codice) restano in inglese.

---

## 5. Database Schema (Drizzle)

Package: `packages/db/src/schema/`

### Tabelle principali (prefisso `nbw_`)

| File | Tabelle | Descrizione |
|------|---------|-------------|
| `user-profiles.ts` | `nbwUserProfiles` | Profili utente, tier billing, AI counter, Stripe IDs, preferences (JSON) |
| `projects.ts` | `nbwProjects` | Progetti con target parole/capitoli, deadline, writing style |
| `chapters.ts` | `nbwChapters`, `nbwScenes`, `nbwChapterVersions` | Capitoli con contentHtml/Json, wordCount, order, POV, versioning |
| `characters.ts` | `nbwCharacters` | 30+ campi (fisico, psicologia, voce, arco, poteri) |
| `worldbuilding.ts` | `nbwLocations`, `nbwItems`, `nbwFactions`, `nbwMagicSystems`, `nbwWorldRules`, `nbwTimelineEvents`, `nbwSubplots`, `nbwRelationships` | Tutte le entita worldbuilding |
| `ai.ts` | `nbwAiMemoryChunks`, `nbwCoherenceAlerts`, `nbwNarrativeFacts`, `nbwChapterSummaries` | Chunks, alert coerenza, fatti narrativi, riassunti |
| `analytics.ts` | `nbwWritingSessions`, `nbwDailyStats`, `nbwActivityLogs`, `nbwNewsletterSubscribers`, `nbwProjectMembers`, `nbwFeedback` | Sessioni scrittura, stats, newsletter, feedback |
| `bridge-tables.ts` | `nbwCharacterLocations`, `nbwChapterCharacters`, `nbwSubplotChapters` | Tabelle ponte M:N |

### Enum principali
- `subscriptionTierEnum`: FREE, WRITER, PROFESSIONAL
- `projectStatusEnum`: PLANNING, WRITING, EDITING, REVISING, COMPLETE
- `chapterStatusEnum`: DRAFT, WRITING, REVIEW, COMPLETE
- `coherenceAlertSeverityEnum`: LOW, MEDIUM, HIGH
- `coherenceAlertStatusEnum`: OPEN, DISMISSED, RESOLVED, FALSE_POSITIVE
- `feedbackTypeEnum`: BUG, SUGGESTION, OTHER
- `relationshipTypeEnum`: ALLY, ENEMY, FAMILY, ROMANTIC, MENTOR, RIVAL, NEUTRAL, BUSINESS, COMPLEX

### Soft-delete pattern
Molte tabelle hanno `deletedAt` (timestamp, null = attivo). Filtrare sempre con `isNull(table.deletedAt)`.

---

## 6. Struttura File Writer App

```
apps/writer/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout (NeonAuthUIProvider, Providers, metadata SEO)
│   │   ├── page.tsx                ← Landing page completa (hero, features, pricing, FAQ)
│   │   ├── globals.css             ← Tailwind v4 + shadcn CSS variables
│   │   ├── sitemap.ts              ← Sitemap dinamica
│   │   ├── robots.ts               ← robots.txt
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          ← Dashboard layout (Sidebar + Header)
│   │   │   ├── dashboard/page.tsx  ← Dashboard principale
│   │   │   └── projects/[projectId]/
│   │   │       ├── page.tsx        ← Dettaglio progetto
│   │   │       └── chapters/[chapterId]/page.tsx ← Editor capitolo
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx          ← Layout marketing (niente sidebar)
│   │   │   └── pricing/page.tsx    ← Pagina prezzi
│   │   ├── auth/[path]/page.tsx    ← Auth pages (Neon Auth UI)
│   │   ├── account/[path]/page.tsx ← Account settings
│   │   └── api/                    ← 49 API routes (vedi sezione 7)
│   ├── components/
│   │   ├── ui/                     ← shadcn/ui components (18 componenti)
│   │   ├── dashboard/              ← Sidebar, Header, MobileSidebar, DashboardContent
│   │   ├── editor/                 ← TipTap editor, toolbar, status bar, extensions
│   │   ├── projects/               ← ProjectCard, CreateProjectDialog, ProjectDetailContent, TrashPanel
│   │   ├── chapters/               ← ChapterList
│   │   ├── ai/                     ← AIGeneratePanel, AISuggestionsPanel, CoherencePanel
│   │   ├── analytics/              ← StatCard, ProgressChart, WritingCalendar, CharacterChart, TextAnalysisPanel
│   │   ├── export/                 ← ManuscriptExportCard, BibleExportCard
│   │   ├── billing/                ← PlanCard, UsageCard, UpgradeOverlay
│   │   ├── command-palette/        ← CommandPalette (Cmd+K)
│   │   ├── onboarding/             ← OnboardingWizard, OnboardingChecklist
│   │   ├── landing/                ← LandingFaq, MobileNav, PricingFaq
│   │   ├── newsletter/             ← NewsletterForm
│   │   ├── feedback/               ← FeedbackDialog
│   │   └── providers.tsx           ← QueryClient + ThemeProvider + Toaster
│   ├── hooks/                      ← 22 custom hooks (TanStack Query v5)
│   ├── stores/                     ← 6 Zustand stores
│   ├── lib/
│   │   ├── ai/                     ← LLM client, RAG, chunking, coherence (3 tier), prompts, suggestions
│   │   ├── analytics/              ← Stats, text analysis (Gulpease, TTR, dialogue ratio)
│   │   ├── auth/                   ← Server + client auth re-exports
│   │   ├── billing/                ← Stripe client, feature gating (limits.ts)
│   │   ├── email/                  ← Resend client, 5 email templates
│   │   ├── export/                 ← DOCX, Markdown, Bible export, HTML utils
│   │   ├── security/               ← Rate limiter, input sanitization
│   │   ├── api-helpers.ts          ← Auth helper, error responses
│   │   └── utils.ts                ← cn() utility (shadcn)
│   ├── i18n/request.ts             ← next-intl config
│   └── proxy.ts                    ← Auth middleware
├── e2e/                            ← Playwright E2E tests
├── messages/                       ← i18n (it.json, en.json)
├── vitest.config.ts
├── playwright.config.ts
├── next.config.ts                  ← Security headers, optimizePackageImports, images
├── components.json                 ← shadcn/ui config
├── tsconfig.json
└── package.json
```

---

## 7. API Routes (49 totali)

### Auth
- `POST/GET /api/auth/[...path]` — Neon Auth catch-all

### Projects
- `GET /api/projects` — Lista progetti utente
- `POST /api/projects` — Crea progetto
- `GET /api/projects/[projectId]` — Dettaglio progetto
- `PATCH /api/projects/[projectId]` — Aggiorna progetto
- `DELETE /api/projects/[projectId]` — Soft-delete progetto

### Chapters
- `GET /api/projects/[projectId]/chapters` — Lista capitoli
- `POST /api/projects/[projectId]/chapters` — Crea capitolo
- `PATCH /api/projects/[projectId]/chapters/reorder` — Riordina capitoli
- `GET /api/chapters/[chapterId]` — Dettaglio capitolo
- `PATCH /api/chapters/[chapterId]` — Aggiorna capitolo
- `DELETE /api/chapters/[chapterId]` — Soft-delete capitolo
- `GET /api/chapters/[chapterId]/content` — Contenuto capitolo
- `PUT /api/chapters/[chapterId]/content` — Salva contenuto (conflict detection con version)
- `GET /api/chapters/[chapterId]/versions` — Lista versioni
- `POST /api/chapters/[chapterId]/versions/[versionId]/restore` — Ripristina versione

### Worldbuilding (CRUD per entita)
- `GET/POST /api/projects/[projectId]/characters`
- `GET/PATCH/DELETE /api/characters/[characterId]`
- `GET/POST /api/projects/[projectId]/locations`
- `GET/PATCH/DELETE /api/locations/[locationId]`
- `GET/POST /api/projects/[projectId]/items`
- `GET/PATCH/DELETE /api/items/[itemId]`
- `GET/POST /api/projects/[projectId]/factions`
- `GET/PATCH/DELETE /api/factions/[factionId]`
- `GET/PUT /api/projects/[projectId]/magic-system`
- `GET/POST /api/projects/[projectId]/world-rules`
- `GET/PATCH/DELETE /api/world-rules/[ruleId]`
- `GET/POST /api/projects/[projectId]/timeline`
- `GET/PATCH/DELETE /api/timeline/[eventId]`
- `GET/POST /api/projects/[projectId]/subplots`
- `GET/PATCH/DELETE /api/subplots/[subplotId]`
- `GET/POST /api/projects/[projectId]/relationships`
- `GET/PATCH/DELETE /api/relationships/[relationshipId]`

### Trash
- `GET /api/projects/[projectId]/trash` — Elementi nel cestino
- `POST /api/projects/[projectId]/trash/restore` — Ripristina dal cestino

### AI
- `POST /api/ai/generate` — Generazione testo (streaming SSE)
- `POST /api/ai/search` — RAG semantic search
- `POST /api/ai/suggest` — Suggerimenti AI
- `POST /api/ai/coherence` — Check coerenza (tier 2 o 3)
- `GET /api/ai/coherence/alerts` — Lista alert coerenza
- `PATCH /api/ai/coherence/alerts` — Aggiorna stato alert

### Analytics
- `GET /api/projects/[projectId]/stats` — Statistiche progetto
- `GET /api/projects/[projectId]/analytics/progress` — Progresso giornaliero
- `GET /api/projects/[projectId]/analytics/calendar` — Calendario heatmap
- `GET /api/projects/[projectId]/analytics/characters` — Uso personaggi
- `GET /api/projects/[projectId]/analytics/text-analysis` — Analisi testo
- `POST /api/projects/[projectId]/analytics/sessions` — Track sessione scrittura

### Export
- `POST /api/projects/[projectId]/export/manuscript` — Export DOCX/Markdown/Text
- `POST /api/projects/[projectId]/export/bible` — Export bibbia JSON/Markdown
- `POST /api/user/export` — GDPR export completo

### Billing
- `POST /api/billing/checkout` — Crea sessione Stripe Checkout
- `POST /api/billing/portal` — Crea sessione Stripe Customer Portal
- `GET /api/billing/status` — Stato billing (tier, usage, limiti)
- `POST /api/webhooks/stripe` — Stripe webhook handler

### User
- `GET /api/user/onboarding` — Stato onboarding
- `POST /api/user/onboarding` — Completa onboarding

### Newsletter & Feedback
- `POST /api/newsletter/subscribe` — Iscrizione newsletter (pubblica)
- `POST /api/newsletter/unsubscribe` — Disiscrizione
- `POST /api/feedback` — Invia feedback (auth richiesta)

---

## 8. Hooks (22 totali)

| Hook | File | Descrizione |
|------|------|-------------|
| `useProjects`, `useDeleteProject` | `use-projects.ts` | CRUD progetti |
| `useChapters`, `useCreateChapter`, `useReorderChapters` | `use-chapters.ts` | CRUD capitoli |
| `useChapterVersions`, `useRestoreVersion` | `use-chapter-versions.ts` | Versioning |
| `useAutoSave` | `use-auto-save.ts` | Auto-save con debounce + conflict detection |
| `useCharacters`, `useCreateCharacter`, `useUpdateCharacter`, `useDeleteCharacter` | `use-characters.ts` | CRUD personaggi |
| `useLocations` + CRUD | `use-locations.ts` | Luoghi |
| `useItems` + CRUD | `use-items.ts` | Oggetti |
| `useFactions` + CRUD | `use-factions.ts` | Fazioni |
| `useMagicSystem` | `use-magic-system.ts` | Sistema magico (1:1 per progetto) |
| `useWorldRules` + CRUD | `use-world-rules.ts` | Regole del mondo |
| `useTimeline` + CRUD | `use-timeline.ts` | Eventi timeline |
| `useSubplots` + CRUD | `use-subplots.ts` | Sottotrame |
| `useRelationships` + CRUD | `use-relationships.ts` | Relazioni personaggi |
| `useTrash`, `useRestoreFromTrash` | `use-trash.ts` | Cestino |
| `useAIGeneration` | `use-ai-generation.ts` | Generazione streaming + cancel |
| `useAISearch` | `use-ai-search.ts` | Ricerca semantica RAG |
| `useAISuggestions` | `use-ai-suggestions.ts` | Suggerimenti AI |
| `useCoherence`, `useCoherenceAlerts` | `use-coherence.ts` | Check coerenza 3 tier |
| `useProjectStats`, `useProgress`, `useCalendar`, `useCharacterAnalytics`, `useTextAnalysis`, `useTrackSession` | `use-analytics.ts` | Analytics |
| `useManuscriptExport`, `useBibleExport`, `useGDPRExport` | `use-export.ts` | Export con blob download |
| `useBillingStatus`, `useCreateCheckout`, `useCreatePortal` | `use-billing.ts` | Billing Stripe |
| `useOnboardingStatus`, `useCompleteOnboarding` | `use-onboarding.ts` | Onboarding wizard |
| `useMediaQuery`, `useIsMobile`, `useIsTablet`, `useIsDesktop` | `use-media-query.ts` | Responsive |
| `useSubscribeNewsletter`, `useUnsubscribeNewsletter` | `use-newsletter.ts` | Newsletter |
| `useSendFeedback` | `use-feedback.ts` | Feedback |

---

## 9. Stores Zustand (6 totali)

| Store | File | State |
|-------|------|-------|
| `useEditorStore` | `editor-store.ts` | content, isDirty, wordCount, isSaving, lastSaved |
| `useProjectStore` | `project-store.ts` | currentProject, currentChapter |
| `useAIStore` | `ai-store.ts` | isGenerating, streamingText, suggestions, history |
| `useCoherenceStore` | `coherence-store.ts` | alerts per tier, characterPhysicalLookup |
| `useUIStore` | `ui-store.ts` | sidebarCollapsed |
| `useBillingStore` | `billing-store.ts` | upgradeDialogOpen, upgradeFeature |

---

## 10. Feature Gating (Tier Limits)

```typescript
// src/lib/billing/limits.ts
TIER_LIMITS = {
  FREE:         { aiPerDay: 15,       maxProjects: 2,        canExport: false, coherenceTiers: [1] },
  WRITER:       { aiPerDay: 150,      maxProjects: 10,       canExport: true,  coherenceTiers: [1,2] },
  PROFESSIONAL: { aiPerDay: Infinity, maxProjects: Infinity, canExport: true,  coherenceTiers: [1,2,3] },
}
```

---

## 11. AI System

### Pipeline generazione (6 tipi)
`continue`, `dialogue`, `description`, `action`, `transition`, `flashback`

### Context Builder
Budget 16K token allocato per priorita:
1. **Mandatory**: capitolo corrente, system prompt
2. **High**: personaggi presenti, luogo scena, regole strict
3. **Dynamic**: summaries capitoli precedenti, fatti narrativi, sottotrame attive
4. **RAG**: risultati ricerca semantica per riempire budget rimanente

### Coherence (3 tier)
1. **Tier 1 (Client)**: Regex locale per colore occhi/capelli, personaggi morti
2. **Tier 2 (Haiku)**: Estrazione e confronto fatti narrativi
3. **Tier 3 (Sonnet)**: Analisi profonda 9 aree con tutto il contesto

### RAG Pipeline
Pinecone + embeddings OpenAI → Reciprocal Rank Fusion → Temporal decay → Reranking Haiku

---

## 12. Variabili d'Ambiente Necessarie

```env
# Database
DATABASE_URL=postgresql://...@neon.tech/neondb

# Neon Auth
NEON_AUTH_BASE_URL=https://...neon.tech
NEON_AUTH_COOKIE_SECRET=<base64-32-bytes>

# AI
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Vector DB
PINECONE_API_KEY=...
PINECONE_INDEX=neobyte-writer

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_WRITER_MONTHLY=price_...
STRIPE_PRICE_WRITER_YEARLY=price_...
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
STRIPE_PRICE_PROFESSIONAL_YEARLY=price_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=NeoByteWriter <noreply@neobytestudios.com>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 13. Stato Fasi di Costruzione

| Fase | Stato | Descrizione |
|------|-------|-------------|
| **FASE 0** | COMPLETATA | Setup Turborepo, pacchetti workspace, Drizzle schema, config base |
| **FASE 1** | COMPLETATA | Auth Neon Auth (OAuth Google/GitHub, email OTP), layout dashboard, proxy middleware |
| **FASE 2** | COMPLETATA | Projects CRUD, Chapters CRUD + versioning, Editor TipTap (toolbar, extensions, auto-save, conflict detection), Worldbuilding completo (9 entita), Menzioni @/# nell'editor, Cestino con ripristino |
| **FASE 3** | COMPLETATA | AI generation (6 tipi, streaming SSE), RAG (Pinecone + embeddings + RRF), Coherence 3 tier, Suggerimenti AI, Context builder (16K budget), Rate limiting per tier |
| **FASE 4** | COMPLETATA | Writing statistics, Calendar heatmap, Text analysis (Gulpease), Character analytics, Export DOCX/MD/Bible/GDPR, Stripe billing (checkout, portal, webhook, feature gating) |
| **FASE 5** | COMPLETATA | Command Palette (Cmd+K), Onboarding (wizard + checklist), Responsive (mobile sidebar), Landing page + SEO (sitemap, robots, OpenGraph), Newsletter + Feedback, Email templates (Resend), Security headers + rate limiter + sanitization, Testing (Vitest + Playwright config + tests), i18n config (next-intl, messages it/en) |

---

## 14. Cosa Manca / Prossimi Passi

### Non ancora implementato
1. **Inngest background jobs**: chunking automatico post-save, reset AI counter giornaliero, trial expiration, email inattivita/streak
2. **Upstash Redis**: cache layer per sessioni, rate limiting distribuito (attualmente in-memory)
3. **Cloudflare R2 storage**: upload immagini personaggi/luoghi/copertine
4. **next-intl integrazione completa**: config pronta ma `useTranslations()` non ancora usato nei componenti
5. **Pagine dashboard mancanti**: `/dashboard/analytics`, `/dashboard/settings`, pagine worldbuilding singole (characters, locations, etc.)
6. **Wiring componenti**: CommandPalette e Onboarding non ancora inseriti nel layout
7. **drizzle-kit push**: le nuove tabelle analytics/AI potrebbero necessitare push al DB

### Miglioramenti possibili
- E2E test completi (login, editor, export)
- Performance profiling (LCP < 2.5s)
- Error boundary globale
- Offline recovery (LocalStorage + BroadcastChannel)
- Settings page completa (profilo, preferenze, notifiche)
- Admin dashboard per gestione utenti

---

## 15. Comandi Utili

```bash
# Dev
pnpm dev                          # Avvia tutti i pacchetti
pnpm --filter @neobytestudios/writer dev  # Solo writer (porta 3001)

# Build
pnpm build                        # Build tutti
pnpm --filter @neobytestudios/writer build  # Solo writer

# DB
pnpm db:push                      # Push schema al DB
pnpm db:generate                  # Genera tipi Drizzle
pnpm db:studio                    # Drizzle Studio (GUI)

# Test
pnpm --filter @neobytestudios/writer test       # Unit test (Vitest)
pnpm --filter @neobytestudios/writer test:e2e    # E2E test (Playwright)

# Aggiungi dipendenza
pnpm --filter @neobytestudios/writer add <package>

# Aggiungi componente shadcn
cd apps/writer && npx shadcn@latest add <component> -y
```

---

## 16. Pattern Codice Ricorrenti

### API Route con auth + project ownership

```typescript
import { getAuthSession, unauthorized, notFound } from "@/lib/api-helpers";
import { db, eq, and, isNull } from "@neobytestudios/db";
import { nbwProjects } from "@neobytestudios/db/schema";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(and(
      eq(nbwProjects.id, projectId),
      eq(nbwProjects.userId, session.user.id),
      isNull(nbwProjects.deletedAt)
    ));

  if (!project) return notFound("Progetto non trovato");

  return NextResponse.json(project);
}
```

### Hook TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const keys = {
  all: ["resource"] as const,
  list: (projectId: string) => [...keys.all, "list", projectId] as const,
  detail: (id: string) => [...keys.all, "detail", id] as const,
};

export function useResources(projectId: string) {
  return useQuery({
    queryKey: keys.list(projectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/resources`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateResource(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInput) => {
      const res = await fetch(`/api/projects/${projectId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(projectId) }),
  });
}
```

### Zustand Store

```typescript
import { create } from "zustand";

interface MyState {
  value: string;
  setValue: (v: string) => void;
  reset: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
  reset: () => set({ value: "" }),
}));
```

---

## 17. Known Issues / Gotchas

- **Zod v4**: Usa `.issues` non `.errors` su `ZodError`. Il tipo di `path` è `PropertyKey[]`
- **Lucide icons**: `LinkOff` non esiste, usare `Link2Off`
- **TipTap v3**: `setContent(content, false)` → `setContent(content, { emitUpdate: false })`
- **Recharts PieLabel**: Le funzioni custom label richiedono cast `as (props: PieLabelRenderProps) => string`
- **Next.js Image**: Usare `unoptimized` per URL esterni/dinamici (DALL-E)
- **Prisma/Drizzle Json fields**: Usare `?? undefined` non `?? null` per campi Json opzionali
- **Turbo v2**: Non esiste `globalDotEnv`. Ogni pacchetto necessita il proprio `.env`
- **@neondatabase/auth**: Richiede Next.js >= 16
