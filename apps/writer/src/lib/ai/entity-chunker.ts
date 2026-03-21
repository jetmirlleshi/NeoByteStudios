import type {
  NbwCharacter,
  NbwLocation,
  NbwWorldRule,
  NbwItem,
  NbwFaction,
} from "@neobytestudios/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EntityChunk {
  /** The text content to embed */
  content: string;
  /** Semantic type of the chunk (e.g. "CHARACTER_INFO", "LOCATION_INFO") */
  type: string;
  /** ID of the source entity */
  sourceId: string;
  /** Type of the source entity (e.g. "character", "location") */
  sourceType: string;
  /** Metadata attached to the vector for filtering */
  metadata: Record<string, string | number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a prose line only if the value is non-null and non-empty. */
function line(label: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (str.length === 0) return "";
  return `${label}: ${str}`;
}

/** Build a prose line for an array field (joined with ", "). */
function arrayLine(
  label: string,
  values: string[] | null | undefined
): string {
  if (!values || values.length === 0) return "";
  const joined = values.filter(Boolean).join(", ");
  if (joined.length === 0) return "";
  return `${label}: ${joined}`;
}

/** Filter out empty strings and join with newlines. */
function joinLines(lines: string[]): string {
  return lines.filter((l) => l.length > 0).join("\n");
}

// ---------------------------------------------------------------------------
// Character chunker
// ---------------------------------------------------------------------------

/**
 * Produce up to 4 chunks from a character entity:
 *
 * 1. **Identity** - name, aliases, age, role, status, faction
 * 2. **Voice** - speech pattern, vocabulary, catch phrases, never says, verbosity
 * 3. **Arc** - arc stages + backstory
 * 4. **Abilities** - abilities, limitations, physical description
 *
 * Empty chunks (where all fields are null/empty) are skipped.
 */
export function chunkCharacter(char: NbwCharacter): EntityChunk[] {
  const chunks: EntityChunk[] = [];

  const baseMeta: Record<string, string | number> = {
    entityId: char.id,
    entityType: "character",
    entityName: char.name,
    projectId: char.projectId,
  };

  // --- 1. Identity ---
  const identity = joinLines([
    `Character: ${char.name}`,
    line("Full name", char.fullName),
    arrayLine("Also known as", char.aliases),
    line("Age", char.age),
    line("Role", char.role),
    line("Status", char.status),
    line("Faction", char.factionId),
    line("Personality", char.personality),
    line("Motivation", char.motivation),
    arrayLine("Fears", char.fears),
    arrayLine("Strengths", char.strengths),
    arrayLine("Weaknesses", char.weaknesses),
    line("Fatal flaw", char.fatalFlaw),
    line("Secrets", char.secrets),
  ]);

  if (identity.trim().length > 0) {
    chunks.push({
      content: identity,
      type: "CHARACTER_INFO",
      sourceId: char.id,
      sourceType: "character",
      metadata: { ...baseMeta, chunk: "identity" },
    });
  }

  // --- 2. Voice ---
  const voice = joinLines([
    `Character voice: ${char.name}`,
    line("Speech pattern", char.speechPattern),
    line("Vocabulary level", char.vocabulary),
    arrayLine("Catch phrases", char.catchPhrases),
    arrayLine("Never says", char.neverSays),
    line("Verbosity", char.verbosity),
  ]);

  // Only include if there's data beyond the header line
  if (voice.split("\n").length > 1) {
    chunks.push({
      content: voice,
      type: "CHARACTER_INFO",
      sourceId: char.id,
      sourceType: "character",
      metadata: { ...baseMeta, chunk: "voice" },
    });
  }

  // --- 3. Arc ---
  const arc = joinLines([
    `Character arc: ${char.name}`,
    line("Arc start", char.arcStart),
    line("Arc midpoint", char.arcMidpoint),
    line("Arc crisis", char.arcCrisis),
    line("Arc end", char.arcEnd),
    line("Arc lesson", char.arcLesson),
    line("Backstory", char.backstory),
  ]);

  if (arc.split("\n").length > 1) {
    chunks.push({
      content: arc,
      type: "CHARACTER_INFO",
      sourceId: char.id,
      sourceType: "character",
      metadata: { ...baseMeta, chunk: "arc" },
    });
  }

  // --- 4. Abilities + Physical description ---
  const abilities = joinLines([
    `Character abilities & appearance: ${char.name}`,
    line("Abilities", char.abilities),
    line("Limitations", char.limitations),
    line("Height", char.height),
    line("Build", char.build),
    line("Hair color", char.hairColor),
    line("Hair style", char.hairStyle),
    line("Eye color", char.eyeColor),
    line("Skin tone", char.skinTone),
    line("Distinctive features", char.distinctiveFeatures),
    line("Clothing", char.clothing),
  ]);

  if (abilities.split("\n").length > 1) {
    chunks.push({
      content: abilities,
      type: "CHARACTER_INFO",
      sourceId: char.id,
      sourceType: "character",
      metadata: { ...baseMeta, chunk: "abilities" },
    });
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Location chunker
// ---------------------------------------------------------------------------

/**
 * Produce 1 chunk from a location entity with all sensory information.
 */
export function chunkLocation(loc: NbwLocation): EntityChunk[] {
  const content = joinLines([
    `Location: ${loc.name}`,
    line("Type", loc.type),
    line("Region", loc.region),
    line("Controlled by", loc.controlledBy),
    line("Population", loc.population),
    line("Description", loc.description),
    line("Mood", loc.mood),
    line("Sounds", loc.sounds),
    line("Smells", loc.smells),
    line("Temperature", loc.temperature),
    line("Special rules", loc.specialRules),
  ]);

  if (content.split("\n").length <= 1) return [];

  return [
    {
      content,
      type: "LOCATION_INFO",
      sourceId: loc.id,
      sourceType: "location",
      metadata: {
        entityId: loc.id,
        entityType: "location",
        entityName: loc.name,
        projectId: loc.projectId,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// World rule chunker
// ---------------------------------------------------------------------------

/**
 * Produce 1 chunk from a world rule entity.
 */
export function chunkWorldRule(rule: NbwWorldRule): EntityChunk[] {
  const content = joinLines([
    `World rule: ${rule.rule}`,
    line("Explanation", rule.explanation),
    line("Category", rule.category),
    `Strict: ${rule.isStrict ? "yes" : "no"}`,
  ]);

  return [
    {
      content,
      type: "WORLD_RULE",
      sourceId: rule.id,
      sourceType: "worldRule",
      metadata: {
        entityId: rule.id,
        entityType: "worldRule",
        entityName: rule.rule,
        projectId: rule.projectId,
        isStrict: rule.isStrict ? 1 : 0,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Item chunker
// ---------------------------------------------------------------------------

/**
 * Produce 1 chunk from an item entity.
 */
export function chunkItem(item: NbwItem): EntityChunk[] {
  const content = joinLines([
    `Item: ${item.name}`,
    line("Type", item.type),
    line("Description", item.description),
    line("Appearance", item.appearance),
    line("Powers", item.powers),
    line("Weaknesses", item.weaknesses),
    line("Origin", item.origin),
    line("History", item.history),
    line("Current owner", item.currentOwner),
    line("Importance", item.importance),
  ]);

  if (content.split("\n").length <= 1) return [];

  return [
    {
      content,
      type: "ITEM_INFO",
      sourceId: item.id,
      sourceType: "item",
      metadata: {
        entityId: item.id,
        entityType: "item",
        entityName: item.name,
        projectId: item.projectId,
        importance: item.importance,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Faction chunker
// ---------------------------------------------------------------------------

/**
 * Produce 1 chunk from a faction entity.
 */
export function chunkFaction(faction: NbwFaction): EntityChunk[] {
  const content = joinLines([
    `Faction: ${faction.name}`,
    line("Type", faction.type),
    line("Description", faction.description),
    line("Leader", faction.leader),
    line("Goals", faction.goals),
    arrayLine("Values", faction.values),
    line("Methods", faction.methods),
    line("Resources", faction.resources),
    line("Territory", faction.territory),
    arrayLine("Allies", faction.allies),
    arrayLine("Enemies", faction.enemies),
  ]);

  if (content.split("\n").length <= 1) return [];

  return [
    {
      content,
      type: "FACTION_INFO",
      sourceId: faction.id,
      sourceType: "faction",
      metadata: {
        entityId: faction.id,
        entityType: "faction",
        entityName: faction.name,
        projectId: faction.projectId,
      },
    },
  ];
}
