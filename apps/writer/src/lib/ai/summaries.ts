// ---------------------------------------------------------------------------
// Chapter summary generation using Claude Haiku
// ---------------------------------------------------------------------------

import {
  db,
  eq,
  and,
  isNull,
  nbwChapters,
} from "@neobytestudios/db";
import { generateWithClaude, MODEL_HAIKU } from "@/lib/ai/llm";

// ---------------------------------------------------------------------------
// HTML → plain text helper
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags and decode common entities to produce plain text.
 * This is intentionally simple — no full DOM parser needed server-side.
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  return (
    html
      // Remove script/style blocks entirely
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      // Replace block-level elements with newlines
      .replace(/<\/?(p|div|br|h[1-6]|li|blockquote|tr|hr)[^>]*>/gi, "\n")
      // Remove all remaining tags
      .replace(/<[^>]+>/g, "")
      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Collapse multiple newlines/spaces
      .replace(/\n{3,}/g, "\n\n")
      .replace(/ {2,}/g, " ")
      .trim()
  );
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildSummaryPrompt(
  chapterText: string,
  previousSummary: string | null
): string {
  const prevContext = previousSummary
    ? previousSummary
    : "Questo è il primo capitolo.";

  return `Sei un editor. Scrivi un riassunto conciso (100-200 parole) di questo capitolo narrativo.
Il riassunto deve catturare: eventi principali, sviluppo personaggi, rivelazioni importanti, conflitti.

RIASSUNTO CAPITOLO PRECEDENTE:
${prevContext}

CAPITOLO DA RIASSUMERE:
${chapterText}

Scrivi il riassunto in terza persona, al presente. Non commentare la qualità della scrittura.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a concise summary for a chapter using Claude Haiku.
 *
 * 1. Fetches the chapter content (HTML → plain text)
 * 2. Fetches the previous chapter's summary for continuity
 * 3. Calls Haiku with a structured prompt
 * 4. Stores the summary in the chapter's `summary` field
 * 5. Returns the generated summary text
 */
export async function generateChapterSummary(params: {
  projectId: string;
  chapterId: string;
}): Promise<string> {
  const { projectId, chapterId } = params;

  // 1. Fetch this chapter
  const [chapter] = await db
    .select({
      id: nbwChapters.id,
      number: nbwChapters.number,
      contentHtml: nbwChapters.contentHtml,
      contentJson: nbwChapters.contentJson,
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.id, chapterId),
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    )
    .limit(1);

  if (!chapter) {
    throw new Error(`[summaries] Chapter ${chapterId} not found`);
  }

  // Extract plain text from HTML content (fallback to contentJson if HTML is empty)
  let plainText = stripHtml(chapter.contentHtml);
  if (!plainText && chapter.contentJson) {
    // contentJson is stored as a string; try to extract text from TipTap JSON
    plainText = extractTextFromTipTapJson(chapter.contentJson);
  }

  if (!plainText.trim()) {
    return "";
  }

  // 2. Fetch previous chapter summary for continuity
  let previousSummary: string | null = null;
  if (chapter.number > 1) {
    const [prevChapter] = await db
      .select({ summary: nbwChapters.summary })
      .from(nbwChapters)
      .where(
        and(
          eq(nbwChapters.projectId, projectId),
          eq(nbwChapters.number, chapter.number - 1),
          isNull(nbwChapters.deletedAt)
        )
      )
      .limit(1);

    previousSummary = prevChapter?.summary ?? null;
  }

  // 3. Call Haiku
  const prompt = buildSummaryPrompt(plainText, previousSummary);

  const response = await generateWithClaude({
    model: MODEL_HAIKU,
    maxTokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const summary = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("")
    .trim();

  if (!summary) {
    return "";
  }

  // 4. Store summary in the chapter
  await db
    .update(nbwChapters)
    .set({ summary, updatedAt: new Date() })
    .where(eq(nbwChapters.id, chapterId));

  // 5. Return generated summary
  return summary;
}

// ---------------------------------------------------------------------------
// TipTap JSON text extraction helper
// ---------------------------------------------------------------------------

/**
 * Recursively extract plain text from a TipTap JSON document stored as a string.
 * TipTap JSON has a tree structure with nodes containing `text` and `content` fields.
 */
function extractTextFromTipTapJson(jsonString: string): string {
  try {
    const doc = JSON.parse(jsonString);
    return extractNodeText(doc);
  } catch {
    // If JSON parsing fails, return the raw string (might already be plain text)
    return jsonString;
  }
}

function extractNodeText(node: unknown): string {
  if (typeof node !== "object" || node === null) return "";

  const obj = node as Record<string, unknown>;

  // Text leaf node
  if (typeof obj.text === "string") {
    return obj.text;
  }

  // Recurse into children
  if (Array.isArray(obj.content)) {
    const parts = obj.content.map(extractNodeText);
    const nodeType = typeof obj.type === "string" ? obj.type : "";

    // Add newlines after block-level nodes
    const isBlock = [
      "paragraph",
      "heading",
      "blockquote",
      "listItem",
      "codeBlock",
      "hardBreak",
    ].includes(nodeType);

    return parts.join("") + (isBlock ? "\n" : "");
  }

  return "";
}
