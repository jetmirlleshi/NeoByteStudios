// ---------------------------------------------------------------------------
// System & user prompts for AI text generation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GenerationType =
  | "continue"
  | "dialogue"
  | "description"
  | "action"
  | "transition"
  | "flashback";

export interface SystemPromptContext {
  worldName?: string;
  worldTone?: string;
  writingStyle?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Base prompts (Italian) — one per generation type
// ---------------------------------------------------------------------------

const BASE_PROMPTS: Record<GenerationType, string> = {
  continue:
    "Sei un assistente di scrittura fantasy. Continua la narrazione mantenendo il tono, " +
    "lo stile e la voce dell'autore. Non ripetere cio che e gia stato scritto. " +
    "Scrivi 200-400 parole.",

  dialogue:
    "Sei un assistente di scrittura fantasy. Scrivi un dialogo naturale tra i personaggi " +
    "presenti, rispettando i loro pattern vocali e personalita. Includi battute e azione.",

  description:
    "Sei un assistente di scrittura fantasy. Scrivi una descrizione vivida e immersiva " +
    "usando tutti i sensi. Mantieni il tono del mondo narrativo.",

  action:
    "Sei un assistente di scrittura fantasy. Scrivi una scena d'azione dinamica e " +
    "coinvolgente con ritmo serrato e verbi forti.",

  transition:
    "Sei un assistente di scrittura fantasy. Scrivi una transizione fluida tra le scene, " +
    "gestendo il passaggio di tempo o luogo in modo naturale.",

  flashback:
    "Sei un assistente di scrittura fantasy. Scrivi un flashback evocativo che riveli " +
    "informazioni importanti sul passato del personaggio.",
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the full system prompt for a given generation type.
 *
 * Appends world rules and tone information when provided.
 */
export function getSystemPrompt(
  type: GenerationType,
  context: SystemPromptContext
): string {
  const parts: string[] = [BASE_PROMPTS[type]];

  if (context.worldTone) {
    parts.push(`Tono: ${context.worldTone}.`);
  }

  if (context.worldName) {
    parts.push(`Mondo narrativo: ${context.worldName}.`);
  }

  if (context.writingStyle && Object.keys(context.writingStyle).length > 0) {
    const styleEntries = Object.entries(context.writingStyle)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(", ");
    parts.push(`Stile di scrittura: ${styleEntries}.`);
  }

  return parts.join("\n\n");
}

/**
 * Build the user-role message that provides recent text context and an
 * optional explicit instruction.
 */
export function getUserPrompt(
  type: GenerationType,
  recentText: string,
  userInstruction?: string
): string {
  const typeLabels: Record<GenerationType, string> = {
    continue: "Continua la narrazione",
    dialogue: "Scrivi un dialogo",
    description: "Scrivi una descrizione",
    action: "Scrivi una scena d'azione",
    transition: "Scrivi una transizione",
    flashback: "Scrivi un flashback",
  };

  const parts: string[] = [];

  if (recentText.trim()) {
    parts.push(`Ecco il testo recente del capitolo:\n\n---\n${recentText}\n---`);
  }

  if (userInstruction?.trim()) {
    parts.push(`Istruzione specifica: ${userInstruction.trim()}`);
  }

  parts.push(typeLabels[type] + ".");

  return parts.join("\n\n");
}
