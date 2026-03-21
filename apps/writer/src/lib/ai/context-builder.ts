// ---------------------------------------------------------------------------
// Context builder — assemble a 16K-token context window for AI generation
// ---------------------------------------------------------------------------

import {
  db,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwWorldRules,
  nbwSubplots,
  eq,
  and,
  isNull,
  desc,
  asc,
  sql,
} from "@neobytestudios/db";
import { getSystemPrompt, getUserPrompt } from "@/lib/ai/prompts";
import { searchRAG } from "@/lib/ai/rag";
import type { GenerationType } from "@/lib/ai/prompts";
import type { RAGResult } from "@/lib/ai/rag";

export type { GenerationType } from "@/lib/ai/prompts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GenerationContext {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  estimatedTokens: number;
}

export interface BuildContextParams {
  projectId: string;
  chapterId: string;
  generationType: GenerationType;
  recentText: string;
  userInstruction?: string;
}

// ---------------------------------------------------------------------------
// Constants — token budget (1 token ~ 4 chars)
// ---------------------------------------------------------------------------

const CHARS_PER_TOKEN = 4;
const TOTAL_TOKEN_BUDGET = 16_000;
const TOTAL_CHAR_BUDGET = TOTAL_TOKEN_BUDGET * CHARS_PER_TOKEN; // 64,000 chars

// Mandatory layer: ~3,450 tokens / ~14,000 chars
const SYSTEM_PROMPT_CHARS = 800 * CHARS_PER_TOKEN; // 3,200
const RECENT_TEXT_CHARS = 1_100 * CHARS_PER_TOKEN; // 4,400
const CHARACTERS_CHARS = 800 * CHARS_PER_TOKEN; // 3,200
const LOCATION_CHARS = 400 * CHARS_PER_TOKEN; // 1,600
const WRITING_STYLE_CHARS = 150 * CHARS_PER_TOKEN; // 600

// High priority layer: ~1,500 tokens / ~6,000 chars
const WORLD_RULES_CHARS = 600 * CHARS_PER_TOKEN; // 2,400
const CHAPTER_SUMMARIES_CHARS = 500 * CHARS_PER_TOKEN; // 2,000
const SUBPLOTS_CHARS = 400 * CHARS_PER_TOKEN; // 1,600

// Dynamic layer gets the rest
const MANDATORY_CHARS =
  SYSTEM_PROMPT_CHARS +
  RECENT_TEXT_CHARS +
  CHARACTERS_CHARS +
  LOCATION_CHARS +
  WRITING_STYLE_CHARS;

const HIGH_PRIORITY_CHARS =
  WORLD_RULES_CHARS + CHAPTER_SUMMARIES_CHARS + SUBPLOTS_CHARS;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a complete generation context by gathering project data, RAG results,
 * and assembling them into a structured prompt within the 16K token budget.
 */
export async function buildGenerationContext(
  params: BuildContextParams
): Promise<GenerationContext> {
  const {
    projectId,
    chapterId,
    generationType,
    recentText,
    userInstruction,
  } = params;

  // ------ Fetch project metadata and current chapter ------
  const [project, currentChapter] = await Promise.all([
    fetchProject(projectId),
    fetchChapter(chapterId),
  ]);

  if (!project) {
    throw new Error(`Project not found: ${projectId}`);
  }

  // ------ Mandatory layer ------

  // Truncate recent text to budget
  const truncatedRecentText = truncate(recentText, RECENT_TEXT_CHARS);

  // Fetch characters mentioned in recent text
  const characters = await fetchMentionedCharacters(
    projectId,
    truncatedRecentText
  );
  const characterContext = formatCharacters(characters, CHARACTERS_CHARS);

  // Current location from chapter pov/notes
  const locationContext = formatLocation(currentChapter, LOCATION_CHARS);

  // Writing style from project
  const writingStyle =
    (project.writingStyle as Record<string, unknown>) ?? {};
  const writingStyleContext = formatWritingStyle(
    writingStyle,
    WRITING_STYLE_CHARS
  );

  // ------ High priority layer ------
  const [worldRules, chapterSummaries, activeSubplots] = await Promise.all([
    fetchStrictWorldRules(projectId),
    fetchRecentChapterSummaries(projectId, currentChapter?.number ?? 1),
    fetchActiveSubplots(projectId),
  ]);

  const worldRulesContext = formatWorldRules(worldRules, WORLD_RULES_CHARS);
  const summariesContext = formatChapterSummaries(
    chapterSummaries,
    CHAPTER_SUMMARIES_CHARS
  );
  const subplotsContext = formatSubplots(activeSubplots, SUBPLOTS_CHARS);

  // ------ System prompt ------
  const systemPrompt = getSystemPrompt(generationType, {
    worldName: project.worldName ?? undefined,
    worldTone: project.worldTone ?? undefined,
    writingStyle,
  });

  // ------ Calculate remaining budget for dynamic layer ------
  const usedChars =
    systemPrompt.length +
    truncatedRecentText.length +
    characterContext.length +
    locationContext.length +
    writingStyleContext.length +
    worldRulesContext.length +
    summariesContext.length +
    subplotsContext.length;

  const remainingChars = Math.max(TOTAL_CHAR_BUDGET - usedChars, 0);

  // ------ Dynamic layer: RAG ------
  let ragContext = "";
  if (remainingChars > 200) {
    const ragResults = await searchRAG({
      projectId,
      query: truncatedRecentText,
      topK: 15,
      filters: {
        excludeChapterIds: [chapterId],
        currentChapterNumber: currentChapter?.number ?? undefined,
      },
    });
    ragContext = formatRAGResults(ragResults, remainingChars);
  }

  // ------ Assemble user message ------
  const contextSections: string[] = [];

  if (characterContext) {
    contextSections.push(`## Personaggi presenti\n${characterContext}`);
  }
  if (locationContext) {
    contextSections.push(`## Luogo attuale\n${locationContext}`);
  }
  if (writingStyleContext) {
    contextSections.push(`## Stile di scrittura\n${writingStyleContext}`);
  }
  if (worldRulesContext) {
    contextSections.push(`## Regole del mondo (obbligatorie)\n${worldRulesContext}`);
  }
  if (summariesContext) {
    contextSections.push(`## Riassunti capitoli recenti\n${summariesContext}`);
  }
  if (subplotsContext) {
    contextSections.push(`## Sottotrame attive\n${subplotsContext}`);
  }
  if (ragContext) {
    contextSections.push(`## Contesto aggiuntivo\n${ragContext}`);
  }

  const contextBlock =
    contextSections.length > 0
      ? contextSections.join("\n\n") + "\n\n"
      : "";

  const userMessage =
    contextBlock +
    getUserPrompt(generationType, truncatedRecentText, userInstruction);

  // ------ Estimate total tokens ------
  const totalChars = systemPrompt.length + userMessage.length;
  const estimatedTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);

  return {
    systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    estimatedTokens,
  };
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

async function fetchProject(projectId: string) {
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt))
    );
  return project ?? null;
}

async function fetchChapter(chapterId: string) {
  const [chapter] = await db
    .select()
    .from(nbwChapters)
    .where(
      and(eq(nbwChapters.id, chapterId), isNull(nbwChapters.deletedAt))
    );
  return chapter ?? null;
}

/**
 * Fetch characters whose name appears in the recent text.
 *
 * Uses a case-insensitive LIKE check on each character's name against
 * the recent text. This is a pragmatic approximation — we fetch all
 * project characters and filter in-app for accuracy.
 */
async function fetchMentionedCharacters(
  projectId: string,
  recentText: string
) {
  if (!recentText.trim()) return [];

  const allCharacters = await db
    .select({
      id: nbwCharacters.id,
      name: nbwCharacters.name,
      role: nbwCharacters.role,
      personality: nbwCharacters.personality,
      speechPattern: nbwCharacters.speechPattern,
      motivation: nbwCharacters.motivation,
      status: nbwCharacters.status,
    })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  // Filter characters whose name is mentioned in the recent text
  const lowerText = recentText.toLowerCase();
  return allCharacters.filter((c) =>
    lowerText.includes(c.name.toLowerCase())
  );
}

async function fetchStrictWorldRules(projectId: string) {
  return db
    .select({
      rule: nbwWorldRules.rule,
      explanation: nbwWorldRules.explanation,
      category: nbwWorldRules.category,
    })
    .from(nbwWorldRules)
    .where(
      and(
        eq(nbwWorldRules.projectId, projectId),
        eq(nbwWorldRules.isStrict, true)
      )
    );
}

async function fetchRecentChapterSummaries(
  projectId: string,
  currentChapterNumber: number
) {
  return db
    .select({
      number: nbwChapters.number,
      title: nbwChapters.title,
      summary: nbwChapters.summary,
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt),
        sql`${nbwChapters.number} < ${currentChapterNumber}`,
        sql`${nbwChapters.summary} IS NOT NULL`
      )
    )
    .orderBy(desc(nbwChapters.number))
    .limit(3);
}

async function fetchActiveSubplots(projectId: string) {
  return db
    .select({
      name: nbwSubplots.name,
      description: nbwSubplots.description,
      type: nbwSubplots.type,
      progress: nbwSubplots.progress,
    })
    .from(nbwSubplots)
    .where(
      and(
        eq(nbwSubplots.projectId, projectId),
        eq(nbwSubplots.status, "ACTIVE")
      )
    )
    .orderBy(asc(nbwSubplots.name));
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  // Cut at the beginning to keep the most recent text
  return text.slice(-maxChars);
}

function formatCharacters(
  characters: Array<{
    name: string;
    role: string;
    personality: string | null;
    speechPattern: string | null;
    motivation: string | null;
  }>,
  maxChars: number
): string {
  if (characters.length === 0) return "";

  const lines: string[] = [];
  let totalChars = 0;

  for (const c of characters) {
    const parts = [`- **${c.name}** (${c.role})`];
    if (c.personality) parts.push(`Personalita: ${c.personality}`);
    if (c.speechPattern) parts.push(`Parlata: ${c.speechPattern}`);
    if (c.motivation) parts.push(`Motivazione: ${c.motivation}`);

    const line = parts.join(" | ");

    if (totalChars + line.length > maxChars) break;
    lines.push(line);
    totalChars += line.length + 1; // +1 for newline
  }

  return lines.join("\n");
}

function formatLocation(
  chapter: { pov: string | null; notes: string | null } | null,
  maxChars: number
): string {
  if (!chapter) return "";

  const parts: string[] = [];
  if (chapter.pov) parts.push(`POV: ${chapter.pov}`);
  if (chapter.notes) parts.push(chapter.notes);

  const text = parts.join("\n");
  return truncate(text, maxChars);
}

function formatWritingStyle(
  style: Record<string, unknown>,
  maxChars: number
): string {
  const entries = Object.entries(style);
  if (entries.length === 0) return "";

  const text = entries
    .map(([key, value]) => `- ${key}: ${String(value)}`)
    .join("\n");

  return truncate(text, maxChars);
}

function formatWorldRules(
  rules: Array<{
    rule: string;
    explanation: string | null;
    category: string | null;
  }>,
  maxChars: number
): string {
  if (rules.length === 0) return "";

  const lines: string[] = [];
  let totalChars = 0;

  for (const r of rules) {
    const line = r.explanation
      ? `- ${r.rule}: ${r.explanation}`
      : `- ${r.rule}`;

    if (totalChars + line.length > maxChars) break;
    lines.push(line);
    totalChars += line.length + 1;
  }

  return lines.join("\n");
}

function formatChapterSummaries(
  chapters: Array<{
    number: number;
    title: string;
    summary: string | null;
  }>,
  maxChars: number
): string {
  if (chapters.length === 0) return "";

  // Reverse to show oldest first
  const sorted = [...chapters].reverse();
  const lines: string[] = [];
  let totalChars = 0;

  for (const ch of sorted) {
    if (!ch.summary) continue;
    const line = `- Cap. ${ch.number} "${ch.title}": ${ch.summary}`;

    if (totalChars + line.length > maxChars) break;
    lines.push(line);
    totalChars += line.length + 1;
  }

  return lines.join("\n");
}

function formatSubplots(
  subplots: Array<{
    name: string;
    description: string | null;
    type: string | null;
    progress: number;
  }>,
  maxChars: number
): string {
  if (subplots.length === 0) return "";

  const lines: string[] = [];
  let totalChars = 0;

  for (const s of subplots) {
    const desc = s.description ? `: ${s.description}` : "";
    const line = `- ${s.name} (${s.progress}%)${desc}`;

    if (totalChars + line.length > maxChars) break;
    lines.push(line);
    totalChars += line.length + 1;
  }

  return lines.join("\n");
}

function formatRAGResults(results: RAGResult[], maxChars: number): string {
  if (results.length === 0) return "";

  const lines: string[] = [];
  let totalChars = 0;

  for (const r of results) {
    const label = r.type.toLowerCase().replace(/_/g, " ");
    const line = `[${label}] ${r.content}`;

    if (totalChars + line.length > maxChars) {
      // Try to fit a truncated version
      const remaining = maxChars - totalChars;
      if (remaining > 100) {
        lines.push(line.slice(0, remaining));
      }
      break;
    }

    lines.push(line);
    totalChars += line.length + 1;
  }

  return lines.join("\n\n");
}
