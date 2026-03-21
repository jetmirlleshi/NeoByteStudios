// ---------------------------------------------------------------------------
// Proactive AI writing suggestions using Claude Haiku
// ---------------------------------------------------------------------------

import {
  db,
  eq,
  and,
  isNull,
  inArray,
  nbwCharacters,
  nbwSubplots,
  nbwLocations,
  nbwChapters,
} from "@neobytestudios/db";
import { generateWithClaude, MODEL_HAIKU } from "@/lib/ai/llm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SuggestionTrigger =
  | "chapter_change"
  | "location_change"
  | "character_intro"
  | "writer_block";

export interface Suggestion {
  type: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Trigger descriptions (in Italian, matching the prompt language)
// ---------------------------------------------------------------------------

const TRIGGER_DESCRIPTIONS: Record<SuggestionTrigger, string> = {
  chapter_change:
    "Lo scrittore ha iniziato o è passato a un nuovo capitolo e potrebbe aver bisogno di spunti per proseguire la narrazione.",
  location_change:
    "La scena si è spostata in un nuovo luogo. Suggerisci elementi legati all'ambientazione.",
  character_intro:
    "Un personaggio è appena entrato in scena. Suggerisci interazioni e sviluppi.",
  writer_block:
    "Lo scrittore è bloccato e ha bisogno di idee concrete per proseguire.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Search for character names that appear in the given text.
 * Returns only the characters whose name (or aliases) is found.
 */
async function findCharactersInText(
  projectId: string,
  text: string
): Promise<Array<{ id: string; name: string }>> {
  const allCharacters = await db
    .select({
      id: nbwCharacters.id,
      name: nbwCharacters.name,
      aliases: nbwCharacters.aliases,
    })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  const lowerText = text.toLowerCase();

  return allCharacters.filter((c) => {
    // Check main name
    if (lowerText.includes(c.name.toLowerCase())) return true;
    // Check aliases
    if (c.aliases && Array.isArray(c.aliases)) {
      return c.aliases.some(
        (alias) =>
          typeof alias === "string" && lowerText.includes(alias.toLowerCase())
      );
    }
    return false;
  });
}

/**
 * Fetch active subplots for a project.
 */
async function getActiveSubplots(
  projectId: string
): Promise<Array<{ name: string; description: string | null }>> {
  return db
    .select({
      name: nbwSubplots.name,
      description: nbwSubplots.description,
    })
    .from(nbwSubplots)
    .where(
      and(
        eq(nbwSubplots.projectId, projectId),
        inArray(nbwSubplots.status, ["ACTIVE", "PLANNED"])
      )
    );
}

/**
 * Try to determine the current location from the chapter's POV field
 * or from project locations mentioned in the recent text.
 */
async function inferLocation(
  projectId: string,
  chapterId: string,
  text: string
): Promise<string | null> {
  // First try the chapter's POV/notes for location hints
  const [chapter] = await db
    .select({ pov: nbwChapters.pov })
    .from(nbwChapters)
    .where(eq(nbwChapters.id, chapterId))
    .limit(1);

  // Check if any known locations are mentioned in text
  const locations = await db
    .select({ name: nbwLocations.name })
    .from(nbwLocations)
    .where(
      and(
        eq(nbwLocations.projectId, projectId),
        isNull(nbwLocations.deletedAt)
      )
    );

  const lowerText = text.toLowerCase();
  const foundLocation = locations.find((loc) =>
    lowerText.includes(loc.name.toLowerCase())
  );

  if (foundLocation) return foundLocation.name;

  // Fallback: return POV as context if available
  if (chapter?.pov) return `POV: ${chapter.pov}`;

  return null;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildSuggestionsPrompt(params: {
  characterNames: string[];
  location: string | null;
  subplots: Array<{ name: string; description: string | null }>;
  trigger: SuggestionTrigger;
  recentText: string;
}): string {
  const { characterNames, location, subplots, trigger, recentText } = params;

  const charactersStr =
    characterNames.length > 0
      ? characterNames.join(", ")
      : "nessun personaggio identificato";

  const locationStr = location ?? "non specificato";

  const subplotsStr =
    subplots.length > 0
      ? subplots
          .map((sp) => `- ${sp.name}: ${sp.description ?? "(nessuna descrizione)"}`)
          .join("\n")
      : "nessuna subplot attiva";

  const triggerExplanation = TRIGGER_DESCRIPTIONS[trigger];

  // Truncate recent text to ~2000 chars to stay within token limits
  const truncatedText =
    recentText.length > 2000 ? recentText.slice(-2000) : recentText;

  return `Sei un coach di scrittura creativa per narrativa fantasy.

CONTESTO ATTUALE:
- Personaggi presenti: ${charactersStr}
- Luogo: ${locationStr}
- Subplot attive:
${subplotsStr}
- Trigger: ${triggerExplanation}

TESTO RECENTE (~500 parole):
${truncatedText}

Genera esattamente 3 suggerimenti per lo scrittore. Ogni suggerimento deve essere:
- Specifico al contesto (non generico)
- Azionabile immediatamente
- Diverso dagli altri (uno per trama, uno per personaggio, uno per ambientazione/tensione)

Rispondi in JSON array:
- type: "plot" | "character" | "setting" | "dialogue" | "tension"
- title: titolo breve in italiano (max 10 parole)
- description: descrizione dettagliata in italiano (2-3 frasi)`;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_SUGGESTION_TYPES = new Set([
  "plot",
  "character",
  "setting",
  "dialogue",
  "tension",
]);

function isValidSuggestion(item: unknown): item is Suggestion {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;

  return (
    typeof obj.type === "string" &&
    VALID_SUGGESTION_TYPES.has(obj.type) &&
    typeof obj.title === "string" &&
    obj.title.length > 0 &&
    typeof obj.description === "string" &&
    obj.description.length > 0
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate context-aware writing suggestions using Claude Haiku.
 *
 * 1. Identifies characters present in recent text
 * 2. Infers current location
 * 3. Fetches active subplots
 * 4. Builds a structured prompt and calls Haiku
 * 5. Parses, validates, and returns suggestions
 */
export async function generateSuggestions(params: {
  projectId: string;
  chapterId: string;
  recentText: string;
  trigger: SuggestionTrigger;
}): Promise<Suggestion[]> {
  const { projectId, chapterId, recentText, trigger } = params;

  if (!recentText.trim()) return [];

  // Gather context in parallel
  const [characters, subplots, location] = await Promise.all([
    findCharactersInText(projectId, recentText),
    getActiveSubplots(projectId),
    inferLocation(projectId, chapterId, recentText),
  ]);

  // Build prompt
  const prompt = buildSuggestionsPrompt({
    characterNames: characters.map((c) => c.name),
    location,
    subplots,
    trigger,
    recentText,
  });

  // Call Haiku
  const response = await generateWithClaude({
    model: MODEL_HAIKU,
    maxTokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  // Extract text content
  const responseText = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  // Parse JSON (handle markdown code fences)
  let parsed: unknown;
  try {
    const cleaned = responseText
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[suggestions] Failed to parse Haiku response as JSON");
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.error("[suggestions] Haiku response is not an array");
    return [];
  }

  return parsed.filter(isValidSuggestion);
}
