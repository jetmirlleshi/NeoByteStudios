import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { nbwProjects } from "./projects";

// --- Enums ---

export const coherenceAlertTypeEnum = pgEnum("nbw_coherence_alert_type", [
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

export const alertSeverityEnum = pgEnum("nbw_alert_severity", [
  "CRITICAL",
  "WARNING",
  "INFO",
]);

export const alertStatusEnum = pgEnum("nbw_alert_status", [
  "OPEN",
  "IGNORED",
  "RESOLVED",
]);

export const aiMemoryTypeEnum = pgEnum("nbw_ai_memory_type", [
  "CHAPTER_CONTENT",
  "CHARACTER_INFO",
  "LOCATION_INFO",
  "WORLD_RULE",
  "MAGIC_RULE",
  "TIMELINE_EVENT",
  "RELATIONSHIP",
  "ITEM_INFO",
  "FACTION_INFO",
  "SUBPLOT_INFO",
  "CHAPTER_SUMMARY",
]);

// --- Tables ---

export const nbwNarrativeFacts = pgTable(
  "nbw_narrative_facts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    subjectName: text("subject_name").notNull(),
    predicate: text("predicate").notNull(),
    value: text("value").notNull(),
    sourceChapterId: text("source_chapter_id"),
    sourceText: text("source_text"),
    validFromChapter: integer("valid_from_chapter"),
    validToChapter: integer("valid_to_chapter"),
    isExplicit: boolean("is_explicit").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_narrative_facts_project_subject_idx").on(
      table.projectId,
      table.subjectId
    ),
    index("nbw_narrative_facts_project_predicate_idx").on(
      table.projectId,
      table.predicate
    ),
    index("nbw_narrative_facts_project_subject_name_idx").on(
      table.projectId,
      table.subjectName
    ),
  ]
);

export const nbwCoherenceAlerts = pgTable(
  "nbw_coherence_alerts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    type: coherenceAlertTypeEnum("type").notNull(),
    severity: alertSeverityEnum("severity").default("WARNING").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    chapterId: text("chapter_id"),
    characterId: text("character_id"),
    locationId: text("location_id"),
    textSnippet: text("text_snippet"),
    suggestion: text("suggestion"),
    status: alertStatusEnum("status").default("OPEN").notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolution: text("resolution"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_coherence_alerts_project_idx").on(table.projectId),
    index("nbw_coherence_alerts_project_status_idx").on(
      table.projectId,
      table.status
    ),
  ]
);

export const nbwAiMemoryChunks = pgTable(
  "nbw_ai_memory_chunks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    type: aiMemoryTypeEnum("type").notNull(),
    sourceId: text("source_id"),
    sourceType: text("source_type"),
    content: text("content").notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    vectorId: text("vector_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_ai_memory_chunks_project_idx").on(table.projectId),
    index("nbw_ai_memory_chunks_project_type_idx").on(
      table.projectId,
      table.type
    ),
    index("nbw_ai_memory_chunks_project_vector_idx").on(
      table.projectId,
      table.vectorId
    ),
  ]
);

// --- Types ---

export type NbwNarrativeFact = typeof nbwNarrativeFacts.$inferSelect;
export type NewNbwNarrativeFact = typeof nbwNarrativeFacts.$inferInsert;
export type NbwCoherenceAlert = typeof nbwCoherenceAlerts.$inferSelect;
export type NewNbwCoherenceAlert = typeof nbwCoherenceAlerts.$inferInsert;
export type NbwAiMemoryChunk = typeof nbwAiMemoryChunks.$inferSelect;
export type NewNbwAiMemoryChunk = typeof nbwAiMemoryChunks.$inferInsert;
