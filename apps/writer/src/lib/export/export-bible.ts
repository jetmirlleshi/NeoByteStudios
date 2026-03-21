/**
 * Generate a "Story Bible" export in JSON or Markdown format.
 *
 * The bible aggregates all worldbuilding data for a project:
 * characters, relationships, locations, items, factions,
 * magic systems, world rules, timeline events, and subplots.
 *
 * A `sections` filter controls which categories are included.
 */

// ---- Types ----

export interface BibleParams {
  project: {
    title: string;
    subtitle?: string | null;
    description?: string | null;
    genre?: string | null;
    worldName?: string | null;
    worldDescription?: string | null;
    worldTone?: string | null;
    worldThemes?: string[] | null;
  };
  characters: Array<Record<string, unknown>>;
  relationships: Array<Record<string, unknown>>;
  locations: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
  factions: Array<Record<string, unknown>>;
  magicSystem: Record<string, unknown> | null;
  worldRules: Array<Record<string, unknown>>;
  timeline: Array<Record<string, unknown>>;
  subplots: Array<Record<string, unknown>>;
  /** Which sections to include. Default: all */
  sections: string[];
}

export const ALL_BIBLE_SECTIONS = [
  "project",
  "characters",
  "relationships",
  "locations",
  "items",
  "factions",
  "magicSystem",
  "worldRules",
  "timeline",
  "subplots",
] as const;

export type BibleSection = (typeof ALL_BIBLE_SECTIONS)[number];

// ---- Helpers ----

/** Remove internal fields (id, projectId, timestamps, deletedAt) for cleaner export */
function cleanRecord(record: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    // Skip internal / meta fields
    if (
      key === "id" ||
      key === "projectId" ||
      key === "deletedAt" ||
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "imageUrl"
    ) {
      continue;
    }
    // Skip null/undefined values
    if (value === null || value === undefined) continue;
    // Skip empty strings
    if (typeof value === "string" && value.trim() === "") continue;
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) continue;

    cleaned[key] = value;
  }
  return cleaned;
}

function hasSection(sections: string[], name: string): boolean {
  return sections.includes(name);
}

// ---- JSON export ----

export function generateBibleJson(params: BibleParams): Record<string, unknown> {
  const { project, sections } = params;
  const bible: Record<string, unknown> = {};

  // Project overview
  if (hasSection(sections, "project")) {
    bible.project = {
      title: project.title,
      ...(project.subtitle && { subtitle: project.subtitle }),
      ...(project.description && { description: project.description }),
      ...(project.genre && { genre: project.genre }),
      ...(project.worldName && { worldName: project.worldName }),
      ...(project.worldDescription && { worldDescription: project.worldDescription }),
      ...(project.worldTone && { worldTone: project.worldTone }),
      ...(project.worldThemes?.length && { worldThemes: project.worldThemes }),
    };
  }

  // Characters
  if (hasSection(sections, "characters") && params.characters.length > 0) {
    bible.characters = params.characters.map(cleanRecord);
  }

  // Relationships
  if (hasSection(sections, "relationships") && params.relationships.length > 0) {
    bible.relationships = params.relationships.map(cleanRecord);
  }

  // Locations
  if (hasSection(sections, "locations") && params.locations.length > 0) {
    bible.locations = params.locations.map(cleanRecord);
  }

  // Items
  if (hasSection(sections, "items") && params.items.length > 0) {
    bible.items = params.items.map(cleanRecord);
  }

  // Factions
  if (hasSection(sections, "factions") && params.factions.length > 0) {
    bible.factions = params.factions.map(cleanRecord);
  }

  // Magic System
  if (hasSection(sections, "magicSystem") && params.magicSystem) {
    bible.magicSystem = cleanRecord(params.magicSystem);
  }

  // World Rules
  if (hasSection(sections, "worldRules") && params.worldRules.length > 0) {
    bible.worldRules = params.worldRules.map(cleanRecord);
  }

  // Timeline
  if (hasSection(sections, "timeline") && params.timeline.length > 0) {
    bible.timeline = params.timeline.map(cleanRecord);
  }

  // Subplots
  if (hasSection(sections, "subplots") && params.subplots.length > 0) {
    bible.subplots = params.subplots.map(cleanRecord);
  }

  return bible;
}

// ---- Markdown export ----

export function generateBibleMarkdown(params: BibleParams): string {
  const { project, sections } = params;
  const lines: string[] = [];

  lines.push(`# ${project.title} - Story Bible`);
  if (project.subtitle) {
    lines.push(`*${project.subtitle}*`);
  }
  lines.push("");

  // ---- Project overview ----
  if (hasSection(sections, "project")) {
    lines.push("## Panoramica del progetto");
    lines.push("");
    if (project.description) {
      lines.push(project.description);
      lines.push("");
    }
    if (project.genre) lines.push(`**Genere:** ${project.genre}`);
    if (project.worldName) lines.push(`**Mondo:** ${project.worldName}`);
    if (project.worldDescription) {
      lines.push(`**Descrizione del mondo:** ${project.worldDescription}`);
    }
    if (project.worldTone) lines.push(`**Tono:** ${project.worldTone}`);
    if (project.worldThemes?.length) {
      lines.push(`**Temi:** ${project.worldThemes.join(", ")}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // ---- Characters ----
  if (hasSection(sections, "characters") && params.characters.length > 0) {
    lines.push("## Personaggi");
    lines.push("");
    for (const raw of params.characters) {
      const c = cleanRecord(raw);
      lines.push(`### ${c.name ?? "Senza nome"}`);
      lines.push("");
      renderFieldsAsMarkdown(c, lines, ["name"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Relationships ----
  if (hasSection(sections, "relationships") && params.relationships.length > 0) {
    lines.push("## Relazioni");
    lines.push("");
    for (const raw of params.relationships) {
      const r = cleanRecord(raw);
      const label = `${r.fromCharacterId ?? "?"} <-> ${r.toCharacterId ?? "?"}`;
      lines.push(`### ${label}`);
      lines.push("");
      renderFieldsAsMarkdown(r, lines, ["fromCharacterId", "toCharacterId"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Locations ----
  if (hasSection(sections, "locations") && params.locations.length > 0) {
    lines.push("## Luoghi");
    lines.push("");
    for (const raw of params.locations) {
      const l = cleanRecord(raw);
      lines.push(`### ${l.name ?? "Senza nome"}`);
      lines.push("");
      renderFieldsAsMarkdown(l, lines, ["name"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Items ----
  if (hasSection(sections, "items") && params.items.length > 0) {
    lines.push("## Oggetti");
    lines.push("");
    for (const raw of params.items) {
      const item = cleanRecord(raw);
      lines.push(`### ${item.name ?? "Senza nome"}`);
      lines.push("");
      renderFieldsAsMarkdown(item, lines, ["name"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Factions ----
  if (hasSection(sections, "factions") && params.factions.length > 0) {
    lines.push("## Fazioni");
    lines.push("");
    for (const raw of params.factions) {
      const f = cleanRecord(raw);
      lines.push(`### ${f.name ?? "Senza nome"}`);
      lines.push("");
      renderFieldsAsMarkdown(f, lines, ["name"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Magic System ----
  if (hasSection(sections, "magicSystem") && params.magicSystem) {
    lines.push("## Sistema Magico");
    lines.push("");
    const ms = cleanRecord(params.magicSystem);
    if (ms.name) {
      lines.push(`### ${ms.name}`);
      lines.push("");
    }
    renderFieldsAsMarkdown(ms, lines, ["name"]);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // ---- World Rules ----
  if (hasSection(sections, "worldRules") && params.worldRules.length > 0) {
    lines.push("## Regole del Mondo");
    lines.push("");
    for (const raw of params.worldRules) {
      const wr = cleanRecord(raw);
      lines.push(`### ${wr.rule ?? "Regola"}`);
      lines.push("");
      renderFieldsAsMarkdown(wr, lines, ["rule"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Timeline ----
  if (hasSection(sections, "timeline") && params.timeline.length > 0) {
    lines.push("## Linea Temporale");
    lines.push("");
    for (const raw of params.timeline) {
      const ev = cleanRecord(raw);
      lines.push(`### ${ev.title ?? "Evento"}`);
      lines.push("");
      renderFieldsAsMarkdown(ev, lines, ["title"]);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // ---- Subplots ----
  if (hasSection(sections, "subplots") && params.subplots.length > 0) {
    lines.push("## Sottotrame");
    lines.push("");
    for (const raw of params.subplots) {
      const sp = cleanRecord(raw);
      lines.push(`### ${sp.name ?? "Sottotrama"}`);
      lines.push("");
      renderFieldsAsMarkdown(sp, lines, ["name"]);
      lines.push("");
    }
  }

  return lines.join("\n").trim() + "\n";
}

// ---- Internal: render object fields as markdown key-value pairs ----

/** Label map for prettier field names */
const FIELD_LABELS: Record<string, string> = {
  fullName: "Nome completo",
  aliases: "Alias",
  age: "Eta",
  role: "Ruolo",
  status: "Stato",
  factionId: "Fazione",
  height: "Altezza",
  build: "Corporatura",
  hairColor: "Colore capelli",
  hairStyle: "Stile capelli",
  eyeColor: "Colore occhi",
  skinTone: "Carnagione",
  distinctiveFeatures: "Tratti distintivi",
  clothing: "Abbigliamento",
  personality: "Personalita",
  motivation: "Motivazione",
  fears: "Paure",
  strengths: "Punti di forza",
  weaknesses: "Debolezze",
  fatalFlaw: "Difetto fatale",
  secrets: "Segreti",
  backstory: "Background",
  speechPattern: "Pattern di parlato",
  vocabulary: "Vocabolario",
  catchPhrases: "Frasi tipiche",
  neverSays: "Non dice mai",
  verbosity: "Verbosita",
  arcStart: "Inizio arco",
  arcMidpoint: "Punto medio arco",
  arcCrisis: "Crisi arco",
  arcEnd: "Fine arco",
  arcLesson: "Lezione arco",
  abilities: "Abilita",
  limitations: "Limitazioni",
  type: "Tipo",
  description: "Descrizione",
  region: "Regione",
  controlledBy: "Controllato da",
  population: "Popolazione",
  mood: "Atmosfera",
  sounds: "Suoni",
  smells: "Odori",
  temperature: "Temperatura",
  connections: "Connessioni",
  specialRules: "Regole speciali",
  appearance: "Aspetto",
  powers: "Poteri",
  origin: "Origine",
  history: "Storia",
  currentOwner: "Proprietario attuale",
  ownerHistory: "Cronologia proprietari",
  importance: "Importanza",
  leader: "Leader",
  goals: "Obiettivi",
  values: "Valori",
  methods: "Metodi",
  resources: "Risorse",
  territory: "Territorio",
  allies: "Alleati",
  enemies: "Nemici",
  source: "Fonte",
  users: "Utilizzatori",
  costs: "Costi",
  rules: "Regole",
  explanation: "Spiegazione",
  category: "Categoria",
  isStrict: "Rigorosa",
  date: "Data",
  era: "Era",
  order: "Ordine",
  progress: "Progresso",
  startState: "Stato iniziale",
  currentState: "Stato attuale",
  endState: "Stato finale",
};

function renderFieldsAsMarkdown(
  obj: Record<string, unknown>,
  lines: string[],
  skipKeys: string[] = []
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (skipKeys.includes(key)) continue;
    if (value === null || value === undefined) continue;

    const label = FIELD_LABELS[key] ?? formatFieldName(key);

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      // Check if items are objects or primitives
      if (typeof value[0] === "object" && value[0] !== null) {
        lines.push(`**${label}:**`);
        lines.push("```json");
        lines.push(JSON.stringify(value, null, 2));
        lines.push("```");
      } else {
        lines.push(`**${label}:** ${value.join(", ")}`);
      }
    } else if (typeof value === "object") {
      lines.push(`**${label}:**`);
      lines.push("```json");
      lines.push(JSON.stringify(value, null, 2));
      lines.push("```");
    } else if (typeof value === "boolean") {
      lines.push(`**${label}:** ${value ? "Si" : "No"}`);
    } else {
      lines.push(`**${label}:** ${String(value)}`);
    }
  }
}

/** Convert camelCase to a readable label */
function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
