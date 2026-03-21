// ---------------------------------------------------------------------------
// Tier 3 - Deep coherence analysis with Claude Sonnet (PROFESSIONAL tier)
// ---------------------------------------------------------------------------

import {
  db,
  nbwChapters,
  nbwCharacters,
  nbwWorldRules,
  nbwSubplots,
  nbwNarrativeFacts,
  eq,
  and,
  ne,
  isNull,
  desc,
} from "@neobytestudios/db";
import { generateWithClaude, MODEL_SONNET } from "@/lib/ai/llm";

// --- Types ---

export interface Tier3Alert {
  type:
    | "PHYSICAL_INCONSISTENCY"
    | "TIMELINE_ERROR"
    | "LOCATION_ERROR"
    | "RULE_VIOLATION"
    | "PLOT_HOLE"
    | "CHARACTER_VOICE"
    | "MISSING_SUBPLOT"
    | "UNUSED_CHARACTER"
    | "BROKEN_PROMISE"
    | "OTHER";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  textSnippet: string;
  suggestion: string;
  characterId?: string;
}

export interface Tier3Params {
  projectId: string;
  chapterId: string;
}

// --- Valid types and severities for response validation ---

const VALID_TYPES = new Set([
  "PHYSICAL_INCONSISTENCY",
  "TIMELINE_ERROR",
  "LOCATION_ERROR",
  "RULE_VIOLATION",
  "PLOT_HOLE",
  "CHARACTER_VOICE",
  "MISSING_SUBPLOT",
  "UNUSED_CHARACTER",
  "BROKEN_PROMISE",
  "OTHER",
]);

const VALID_SEVERITIES = new Set(["CRITICAL", "WARNING", "INFO"]);

// --- Helpers ---

/**
 * Validates and sanitises a single alert object from the LLM response.
 * Returns null if the alert is malformed.
 */
function validateAlert(raw: unknown): Tier3Alert | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const type = typeof obj.type === "string" ? obj.type.toUpperCase() : null;
  const severity =
    typeof obj.severity === "string" ? obj.severity.toUpperCase() : null;
  const title = typeof obj.title === "string" ? obj.title : null;
  const description =
    typeof obj.description === "string" ? obj.description : null;
  const textSnippet =
    typeof obj.textSnippet === "string" ? obj.textSnippet : "";
  const suggestion =
    typeof obj.suggestion === "string" ? obj.suggestion : "";
  const characterId =
    typeof obj.characterId === "string" ? obj.characterId : undefined;

  if (!type || !VALID_TYPES.has(type)) return null;
  if (!severity || !VALID_SEVERITIES.has(severity)) return null;
  if (!title || !description) return null;

  return {
    type: type as Tier3Alert["type"],
    severity: severity as Tier3Alert["severity"],
    title,
    description,
    textSnippet,
    suggestion,
    characterId,
  };
}

/**
 * Attempts to extract a JSON array from the LLM response text.
 * Handles cases where the model wraps the JSON in markdown code fences.
 */
function parseJsonArray(text: string): unknown[] {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Could not parse
      }
    }
    return [];
  }
}

/**
 * Strips HTML tags and normalises whitespace to produce plain text.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Public API ---

/**
 * Runs a Tier 3 deep coherence analysis using Claude Sonnet.
 *
 * Fetches the full chapter, all project characters, world rules,
 * active subplots, recent chapter summaries, and narrative facts,
 * then performs a comprehensive multi-category coherence analysis.
 */
export async function runTier3Analysis(
  params: Tier3Params
): Promise<Tier3Alert[]> {
  const { projectId, chapterId } = params;

  // 1. Fetch full chapter content
  const [chapter] = await db
    .select()
    .from(nbwChapters)
    .where(
      and(eq(nbwChapters.id, chapterId), eq(nbwChapters.projectId, projectId))
    );

  if (!chapter) {
    throw new Error(`Chapter ${chapterId} not found in project ${projectId}`);
  }

  const chapterText = chapter.contentHtml
    ? htmlToPlainText(chapter.contentHtml)
    : "";

  if (!chapterText.trim()) return [];

  // 2. Fetch ALL characters for project (not deleted)
  const characters = await db
    .select()
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  // 3. Fetch ALL world rules for project
  const worldRules = await db
    .select()
    .from(nbwWorldRules)
    .where(eq(nbwWorldRules.projectId, projectId));

  // 4. Fetch active subplots
  const subplots = await db
    .select()
    .from(nbwSubplots)
    .where(
      and(
        eq(nbwSubplots.projectId, projectId),
        eq(nbwSubplots.status, "ACTIVE")
      )
    );

  // 5. Fetch last 3 chapter summaries (ordered by number desc, exclude current)
  const recentChapters = await db
    .select({
      number: nbwChapters.number,
      title: nbwChapters.title,
      summary: nbwChapters.summary,
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        ne(nbwChapters.id, chapterId),
        isNull(nbwChapters.deletedAt)
      )
    )
    .orderBy(desc(nbwChapters.number))
    .limit(3);

  // 6. Fetch narrative facts (up to 200)
  const facts = await db
    .select()
    .from(nbwNarrativeFacts)
    .where(eq(nbwNarrativeFacts.projectId, projectId))
    .limit(200);

  // 7. Build prompt sections
  const charactersSection =
    characters.length > 0
      ? characters
          .map((c) => {
            const parts = [`Nome: ${c.name}`, `Ruolo: ${c.role}`, `Status: ${c.status}`];
            if (c.personality) parts.push(`Personalita: ${c.personality}`);
            if (c.eyeColor) parts.push(`Occhi: ${c.eyeColor}`);
            if (c.hairColor) parts.push(`Capelli: ${c.hairColor}`);
            if (c.speechPattern) parts.push(`Pattern vocale: ${c.speechPattern}`);
            if (c.fatalFlaw) parts.push(`Difetto fatale: ${c.fatalFlaw}`);
            return `[${c.id}] ${parts.join(" | ")}`;
          })
          .join("\n")
      : "(Nessun personaggio registrato)";

  const rulesSection =
    worldRules.length > 0
      ? worldRules
          .map(
            (r) =>
              `- ${r.rule}${r.isStrict ? " [RIGIDA]" : " [FLESSIBILE]"}${
                r.explanation ? ` — ${r.explanation}` : ""
              }`
          )
          .join("\n")
      : "(Nessuna regola del mondo registrata)";

  const subplotsSection =
    subplots.length > 0
      ? subplots
          .map(
            (s) =>
              `- ${s.name}: ${s.description ?? "Nessuna descrizione"} (progresso: ${s.progress}%)`
          )
          .join("\n")
      : "(Nessuna subplot attiva)";

  const summariesSection =
    recentChapters.length > 0
      ? recentChapters
          .map(
            (ch) =>
              `Cap. ${ch.number} "${ch.title}": ${ch.summary ?? "(nessun riassunto)"}`
          )
          .join("\n")
      : "(Nessun capitolo precedente)";

  const factsSection =
    facts.length > 0
      ? facts
          .map((f) => `- ${f.subjectName} ${f.predicate} ${f.value}`)
          .join("\n")
      : "(Nessun fatto narrativo registrato)";

  const systemPrompt = `Sei un editor professionale di narrativa fantasy. Analizza in profondita questo capitolo per problemi di coerenza.

PERSONAGGI DEL PROGETTO:
${charactersSection}

REGOLE DEL MONDO:
${rulesSection}

SUBPLOT ATTIVE:
${subplotsSection}

RIASSUNTI CAPITOLI PRECEDENTI:
${summariesSection}

FATTI NARRATIVI:
${factsSection}

Analizza per TUTTE queste categorie:
1. Buchi di trama (PLOT_HOLE)
2. Subplot dimenticate (MISSING_SUBPLOT)
3. Promesse narrative non mantenute (BROKEN_PROMISE)
4. Voce dei personaggi incoerente (CHARACTER_VOICE)
5. Personaggi non utilizzati (UNUSED_CHARACTER)
6. Violazioni regole del mondo (RULE_VIOLATION)
7. Errori nella timeline (TIMELINE_ERROR)
8. Incoerenze fisiche (PHYSICAL_INCONSISTENCY)
9. Errori di luogo (LOCATION_ERROR)

Rispondi SOLO in formato JSON array con:
- type: one of PHYSICAL_INCONSISTENCY, TIMELINE_ERROR, LOCATION_ERROR, RULE_VIOLATION, PLOT_HOLE, CHARACTER_VOICE, MISSING_SUBPLOT, UNUSED_CHARACTER, BROKEN_PROMISE, OTHER
- severity: CRITICAL, WARNING, or INFO
- title: brief Italian title
- description: Italian explanation
- textSnippet: the problematic text excerpt (or empty string if not applicable)
- suggestion: Italian suggestion to fix
- characterId: the character ID from the list above if applicable, otherwise omit

Se non ci sono problemi, rispondi con un array vuoto: []`;

  const userMessage = `CAPITOLO DA ANALIZZARE (Cap. ${chapter.number} "${chapter.title}"):
${chapterText}`;

  // 8. Call Claude Sonnet
  const response = await generateWithClaude({
    model: MODEL_SONNET,
    maxTokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    temperature: 0.3,
  });

  // 9. Extract text content from response
  const responseText = response.content
    .filter((block) => block.type === "text")
    .map((block) => {
      if (block.type === "text") return block.text;
      return "";
    })
    .join("");

  // 10. Parse and return validated alerts
  const rawAlerts = parseJsonArray(responseText);
  const validAlerts: Tier3Alert[] = [];

  for (const raw of rawAlerts) {
    const alert = validateAlert(raw);
    if (alert) validAlerts.push(alert);
  }

  return validAlerts;
}
