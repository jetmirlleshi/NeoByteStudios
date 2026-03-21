"use client";

// ---------------------------------------------------------------------------
// Tier 1 - Client-side regex-based coherence checks (FREE tier, zero API cost)
// ---------------------------------------------------------------------------

// --- Types ---

export interface CharacterInfo {
  id: string;
  name: string;
  status: string;
  eyeColor?: string;
  hairColor?: string;
  height?: string;
  aliases?: string[];
}

export interface Tier1Alert {
  type: "PHYSICAL_INCONSISTENCY" | "DEAD_CHARACTER_ACTION";
  severity: "CRITICAL";
  title: string;
  description: string;
  characterId: string;
  textSnippet: string;
}

// --- Italian color words ---

const ITALIAN_COLORS: Record<string, string[]> = {
  nero: ["nero", "nera", "neri", "nere"],
  biondo: ["biondo", "bionda", "biondi", "bionde"],
  rosso: ["rosso", "rossa", "rossi", "rosse"],
  castano: ["castano", "castana", "castani", "castane"],
  blu: ["blu"],
  azzurro: ["azzurro", "azzurra", "azzurri", "azzurre"],
  verde: ["verde", "verdi"],
  grigio: ["grigio", "grigia", "grigi", "grigie"],
  marrone: ["marrone", "marroni"],
  bianco: ["bianco", "bianca", "bianchi", "bianche"],
};

// Build a flat set of all Italian color words
const ALL_COLOR_WORDS = new Set(
  Object.values(ITALIAN_COLORS).flat()
);

// Build a map from any color form back to the canonical color name
const COLOR_TO_CANONICAL = new Map<string, string>();
for (const [canonical, forms] of Object.entries(ITALIAN_COLORS)) {
  for (const form of forms) {
    COLOR_TO_CANONICAL.set(form.toLowerCase(), canonical);
  }
}

// All color forms joined for regex
const COLOR_PATTERN = Array.from(ALL_COLOR_WORDS).join("|");

// --- Helpers ---

/**
 * Builds a regex-safe alternation pattern from a character name and their aliases.
 */
function buildNamePattern(name: string, aliases?: string[]): string {
  const names = [name, ...(aliases ?? [])].filter(Boolean);
  return names.map(escapeRegex).join("|");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Normalises a stored color value (which might be in any language or format)
 * to its canonical Italian color name for comparison.
 * Returns null if the color cannot be mapped.
 */
function normalizeColor(color: string | undefined): string | null {
  if (!color) return null;
  const lower = color.toLowerCase().trim();
  // Direct match
  if (COLOR_TO_CANONICAL.has(lower)) return COLOR_TO_CANONICAL.get(lower)!;
  // Partial match (e.g., "castano scuro" -> "castano")
  for (const [form, canonical] of COLOR_TO_CANONICAL.entries()) {
    if (lower.includes(form)) return canonical;
  }
  return null;
}

/**
 * Extracts a short snippet around a match position.
 */
function extractSnippet(text: string, matchIndex: number, matchLength: number): string {
  const padding = 40;
  const start = Math.max(0, matchIndex - padding);
  const end = Math.min(text.length, matchIndex + matchLength + padding);
  let snippet = text.slice(start, end).replace(/\n/g, " ");
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

// --- Check: Physical Inconsistency ---

function checkPhysicalInconsistency(
  text: string,
  characters: CharacterInfo[]
): Tier1Alert[] {
  const alerts: Tier1Alert[] = [];

  for (const character of characters) {
    const namePattern = buildNamePattern(character.name, character.aliases);
    const normalizedEyeColor = normalizeColor(character.eyeColor);
    const normalizedHairColor = normalizeColor(character.hairColor);

    // Check eye color
    if (normalizedEyeColor) {
      const eyeRegex = new RegExp(
        `(${namePattern})\\b[^.]{0,80}\\bocch[io]\\s+(${COLOR_PATTERN})`,
        "gi"
      );

      let match: RegExpExecArray | null;
      while ((match = eyeRegex.exec(text)) !== null) {
        const foundColor = match[2]!.toLowerCase();
        const foundCanonical = COLOR_TO_CANONICAL.get(foundColor);
        if (foundCanonical && foundCanonical !== normalizedEyeColor) {
          alerts.push({
            type: "PHYSICAL_INCONSISTENCY",
            severity: "CRITICAL",
            title: `Colore occhi incoerente: ${character.name}`,
            description:
              `${character.name} ha gli occhi "${character.eyeColor}" nella scheda personaggio, ` +
              `ma nel testo viene descritto/a con occhi "${match[2]}".`,
            characterId: character.id,
            textSnippet: extractSnippet(text, match.index, match[0].length),
          });
        }
      }
    }

    // Check hair color
    if (normalizedHairColor) {
      const hairRegex = new RegExp(
        `(${namePattern})\\b[^.]{0,80}\\bcapell[io]\\s+(${COLOR_PATTERN})`,
        "gi"
      );

      let match: RegExpExecArray | null;
      while ((match = hairRegex.exec(text)) !== null) {
        const foundColor = match[2]!.toLowerCase();
        const foundCanonical = COLOR_TO_CANONICAL.get(foundColor);
        if (foundCanonical && foundCanonical !== normalizedHairColor) {
          alerts.push({
            type: "PHYSICAL_INCONSISTENCY",
            severity: "CRITICAL",
            title: `Colore capelli incoerente: ${character.name}`,
            description:
              `${character.name} ha i capelli "${character.hairColor}" nella scheda personaggio, ` +
              `ma nel testo viene descritto/a con capelli "${match[2]}".`,
            characterId: character.id,
            textSnippet: extractSnippet(text, match.index, match[0].length),
          });
        }
      }
    }
  }

  return alerts;
}

// --- Check: Dead Character Acting ---

const DEAD_ACTION_VERBS = [
  "disse",
  "rispose",
  "grid\\u00f2",
  "sussurr\\u00f2",
  "mormor\\u00f2",
  "cammin\\u00f2",
  "corse",
  "sorrise",
  "guard\\u00f2",
  "prese",
  "alz\\u00f2",
  "si volt\\u00f2",
];

function checkDeadCharacterAction(
  text: string,
  characters: CharacterInfo[]
): Tier1Alert[] {
  const alerts: Tier1Alert[] = [];

  const deadCharacters = characters.filter((c) => c.status === "DEAD");
  if (deadCharacters.length === 0) return alerts;

  for (const character of deadCharacters) {
    const deadNamePattern = buildNamePattern(character.name, character.aliases);
    const verbPattern = DEAD_ACTION_VERBS.join("|");

    const actionRegex = new RegExp(
      `(${deadNamePattern})\\s+(${verbPattern})`,
      "gi"
    );

    let match: RegExpExecArray | null;
    while ((match = actionRegex.exec(text)) !== null) {
      alerts.push({
        type: "DEAD_CHARACTER_ACTION",
        severity: "CRITICAL",
        title: `Personaggio morto che agisce: ${character.name}`,
        description:
          `${character.name} risulta "MORTO" nella scheda personaggio, ` +
          `ma nel testo compie un'azione ("${match[2]}"). ` +
          `Verifica se si tratta di un flashback o di un errore.`,
        characterId: character.id,
        textSnippet: extractSnippet(text, match.index, match[0].length),
      });
    }
  }

  return alerts;
}

// --- Public API ---

/**
 * Runs all Tier 1 (client-side, regex-based) coherence checks.
 *
 * This is completely free (no API calls) and runs in the browser.
 * It catches basic physical inconsistencies and dead-character-action errors.
 */
export function runTier1Checks(params: {
  text: string;
  characters: CharacterInfo[];
}): Tier1Alert[] {
  const { text, characters } = params;

  if (!text || characters.length === 0) return [];

  const alerts: Tier1Alert[] = [
    ...checkPhysicalInconsistency(text, characters),
    ...checkDeadCharacterAction(text, characters),
  ];

  return alerts;
}
