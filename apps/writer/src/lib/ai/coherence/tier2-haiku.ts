// ---------------------------------------------------------------------------
// Tier 2 - Lightweight coherence check with Claude Haiku (WRITER+ tier)
// ---------------------------------------------------------------------------

import {
  db,
  nbwNarrativeFacts,
  nbwWorldRules,
  eq,
  and,
} from "@neobytestudios/db";
import { generateWithClaude, MODEL_HAIKU } from "@/lib/ai/llm";

// --- Types ---

export interface Tier2Alert {
  type:
    | "PHYSICAL_INCONSISTENCY"
    | "TIMELINE_ERROR"
    | "LOCATION_ERROR"
    | "RULE_VIOLATION"
    | "PLOT_HOLE"
    | "CHARACTER_VOICE"
    | "OTHER";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  textSnippet: string;
  suggestion: string;
}

export interface Tier2Params {
  projectId: string;
  chapterId: string;
  text: string;
  contextBefore?: string;
  contextAfter?: string;
}

// --- Valid types and severities for response validation ---

const VALID_TYPES = new Set([
  "PHYSICAL_INCONSISTENCY",
  "TIMELINE_ERROR",
  "LOCATION_ERROR",
  "RULE_VIOLATION",
  "PLOT_HOLE",
  "CHARACTER_VOICE",
  "OTHER",
]);

const VALID_SEVERITIES = new Set(["CRITICAL", "WARNING", "INFO"]);

// --- Helpers ---

/**
 * Validates and sanitises a single alert object from the LLM response.
 * Returns null if the alert is malformed.
 */
function validateAlert(raw: unknown): Tier2Alert | null {
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

  if (!type || !VALID_TYPES.has(type)) return null;
  if (!severity || !VALID_SEVERITIES.has(severity)) return null;
  if (!title || !description) return null;

  return {
    type: type as Tier2Alert["type"],
    severity: severity as Tier2Alert["severity"],
    title,
    description,
    textSnippet,
    suggestion,
  };
}

/**
 * Attempts to extract a JSON array from the LLM response text.
 * Handles cases where the model wraps the JSON in markdown code fences.
 */
function parseJsonArray(text: string): unknown[] {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    // Try to find array within text
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

// --- Public API ---

/**
 * Runs a Tier 2 coherence check using Claude Haiku.
 *
 * Fetches narrative facts and strict world rules from the database,
 * then asks Haiku to identify inconsistencies in the provided text.
 */
export async function runTier2Check(params: Tier2Params): Promise<Tier2Alert[]> {
  const { projectId, text, contextBefore, contextAfter } = params;

  if (!text.trim()) return [];

  // 1. Fetch narrative facts (up to 100)
  const facts = await db
    .select()
    .from(nbwNarrativeFacts)
    .where(eq(nbwNarrativeFacts.projectId, projectId))
    .limit(100);

  // 2. Fetch strict world rules
  const rules = await db
    .select()
    .from(nbwWorldRules)
    .where(
      and(
        eq(nbwWorldRules.projectId, projectId),
        eq(nbwWorldRules.isStrict, true)
      )
    );

  // 3. Build prompt sections
  const factsSection =
    facts.length > 0
      ? facts
          .map((f) => `- ${f.subjectName} ${f.predicate} ${f.value}`)
          .join("\n")
      : "(Nessun fatto narrativo registrato)";

  const rulesSection =
    rules.length > 0
      ? rules.map((r) => `- ${r.rule}`).join("\n")
      : "(Nessuna regola del mondo registrata)";

  const contextBeforeSection = contextBefore
    ? `\nCONTESTO PRECEDENTE:\n${contextBefore}`
    : "";

  const contextAfterSection = contextAfter
    ? `\nCONTESTO SUCCESSIVO:\n${contextAfter}`
    : "";

  const systemPrompt = `Sei un assistente editoriale esperto di narrativa. Il tuo compito è analizzare un testo narrativo e identificare problemi di coerenza rispetto ai fatti narrativi stabiliti e alle regole del mondo.

Analizza il seguente testo narrativo per problemi di coerenza.

FATTI NARRATIVI STABILITI:
${factsSection}

REGOLE DEL MONDO (DEVONO essere rispettate):
${rulesSection}

Rispondi SOLO in formato JSON array. Ogni alert deve avere:
- type: one of PHYSICAL_INCONSISTENCY, TIMELINE_ERROR, LOCATION_ERROR, RULE_VIOLATION, PLOT_HOLE, CHARACTER_VOICE, OTHER
- severity: CRITICAL, WARNING, or INFO
- title: brief Italian title
- description: Italian explanation
- textSnippet: the problematic text excerpt
- suggestion: Italian suggestion to fix

Se non ci sono problemi, rispondi con un array vuoto: []`;

  const userMessage = `TESTO DA ANALIZZARE:
${text}
${contextBeforeSection}
${contextAfterSection}`;

  // 4. Call Claude Haiku
  const response = await generateWithClaude({
    model: MODEL_HAIKU,
    maxTokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    temperature: 0.2,
  });

  // 5. Extract text content from response
  const responseText = response.content
    .filter((block) => block.type === "text")
    .map((block) => {
      if (block.type === "text") return block.text;
      return "";
    })
    .join("");

  // 6. Parse and validate alerts
  const rawAlerts = parseJsonArray(responseText);
  const validAlerts: Tier2Alert[] = [];

  for (const raw of rawAlerts) {
    const alert = validateAlert(raw);
    if (alert) validAlerts.push(alert);
  }

  return validAlerts;
}
