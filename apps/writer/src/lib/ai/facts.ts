// ---------------------------------------------------------------------------
// Narrative fact extraction using Claude Haiku
// ---------------------------------------------------------------------------

import {
  db,
  eq,
  and,
  isNull,
  nbwCharacters,
  nbwNarrativeFacts,
} from "@neobytestudios/db";
import { generateWithClaude, MODEL_HAIKU } from "@/lib/ai/llm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtractedFact {
  subjectType: string;
  subjectId: string | null;
  subjectName: string;
  predicate: string;
  value: string;
  sourceText: string;
  isExplicit: boolean;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildExtractionPrompt(
  text: string,
  characters: Array<{ id: string; name: string }>
): string {
  const characterList =
    characters.length > 0
      ? characters.map((c) => `- ${c.name} (ID: ${c.id})`).join("\n")
      : "(nessun personaggio registrato)";

  return `Analizza il seguente testo narrativo ed estrai TUTTI i fatti concreti menzionati.

PERSONAGGI NOTI:
${characterList}

TESTO:
${text}

Per ogni fatto, fornisci in formato JSON array:
- subjectType: "CHARACTER" | "LOCATION" | "ITEM" | "WORLD" | "EVENT"
- subjectId: ID del personaggio se noto, altrimenti null
- subjectName: nome del soggetto
- predicate: cosa viene affermato (es. "ha gli occhi", "vive a", "possiede", "è morto", "è alleato di")
- value: il valore concreto (es. "blu", "Gondor", "Spada di Fuoco")
- sourceText: la frase esatta dal testo che supporta questo fatto
- isExplicit: true se esplicitamente dichiarato, false se implicato

Estrai fatti su: aspetto fisico, possesso, relazioni, ubicazione, stato (vivo/morto), abilità, eventi accaduti.
Rispondi SOLO con il JSON array.`;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_SUBJECT_TYPES = new Set([
  "CHARACTER",
  "LOCATION",
  "ITEM",
  "WORLD",
  "EVENT",
]);

function isValidFact(item: unknown): item is ExtractedFact {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;

  return (
    typeof obj.subjectType === "string" &&
    VALID_SUBJECT_TYPES.has(obj.subjectType) &&
    (obj.subjectId === null || typeof obj.subjectId === "string") &&
    typeof obj.subjectName === "string" &&
    obj.subjectName.length > 0 &&
    typeof obj.predicate === "string" &&
    obj.predicate.length > 0 &&
    typeof obj.value === "string" &&
    obj.value.length > 0 &&
    typeof obj.sourceText === "string" &&
    typeof obj.isExplicit === "boolean"
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract narrative facts from a chapter's text using Claude Haiku.
 *
 * 1. Fetches existing characters for ID matching
 * 2. Sends the text to Haiku with a structured prompt
 * 3. Parses and validates the JSON response
 */
export async function extractNarrativeFacts(params: {
  projectId: string;
  chapterId: string;
  chapterNumber: number;
  text: string;
}): Promise<ExtractedFact[]> {
  const { projectId, text } = params;

  if (!text.trim()) return [];

  // 1. Fetch known characters for this project
  const characters = await db
    .select({ id: nbwCharacters.id, name: nbwCharacters.name })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  // 2. Build prompt and call Haiku
  const prompt = buildExtractionPrompt(text, characters);

  const response = await generateWithClaude({
    model: MODEL_HAIKU,
    maxTokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  // 3. Extract text content from response
  const responseText = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  // 4. Parse JSON from response (handle markdown code fences)
  let parsed: unknown;
  try {
    const cleaned = responseText
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[facts] Failed to parse Haiku response as JSON");
    return [];
  }

  // 5. Validate each extracted fact
  if (!Array.isArray(parsed)) {
    console.error("[facts] Haiku response is not an array");
    return [];
  }

  const validFacts = parsed.filter(isValidFact);

  return validFacts;
}

/**
 * Persist extracted facts into the database.
 *
 * - If a fact with the same subjectName + predicate already exists for this
 *   project, update its value (tracking the change).
 * - Otherwise, insert a new row.
 */
export async function persistFacts(
  projectId: string,
  chapterId: string,
  chapterNumber: number,
  facts: ExtractedFact[]
): Promise<void> {
  if (facts.length === 0) return;

  for (const fact of facts) {
    try {
      // Check if a similar fact already exists (same project + subjectName + predicate)
      const [existing] = await db
        .select()
        .from(nbwNarrativeFacts)
        .where(
          and(
            eq(nbwNarrativeFacts.projectId, projectId),
            eq(nbwNarrativeFacts.subjectName, fact.subjectName),
            eq(nbwNarrativeFacts.predicate, fact.predicate)
          )
        )
        .limit(1);

      if (existing) {
        // Update only if value changed
        if (existing.value !== fact.value) {
          await db
            .update(nbwNarrativeFacts)
            .set({
              value: fact.value,
              sourceChapterId: chapterId,
              sourceText: fact.sourceText,
              validFromChapter: existing.validFromChapter,
              isExplicit: fact.isExplicit,
              updatedAt: new Date(),
            })
            .where(eq(nbwNarrativeFacts.id, existing.id));
        }
      } else {
        // Insert new fact
        await db.insert(nbwNarrativeFacts).values({
          projectId,
          subjectType: fact.subjectType,
          subjectId: fact.subjectId ?? "",
          subjectName: fact.subjectName,
          predicate: fact.predicate,
          value: fact.value,
          sourceChapterId: chapterId,
          sourceText: fact.sourceText,
          validFromChapter: chapterNumber,
          validToChapter: null,
          isExplicit: fact.isExplicit,
        });
      }
    } catch (error) {
      // Log but don't throw — continue processing remaining facts
      console.error(
        `[facts] Failed to persist fact "${fact.subjectName} ${fact.predicate}":`,
        error
      );
    }
  }
}
