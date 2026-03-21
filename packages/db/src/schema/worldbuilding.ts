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

export const itemImportanceEnum = pgEnum("nbw_item_importance", [
  "MCGUFFIN",
  "MAJOR",
  "MODERATE",
  "MINOR",
]);

export const timelineEventTypeEnum = pgEnum("nbw_timeline_event_type", [
  "HISTORICAL",
  "STORY",
  "FUTURE",
]);

export const subplotStatusEnum = pgEnum("nbw_subplot_status", [
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "RESOLVED",
]);

// --- Tables ---

export const nbwLocations = pgTable(
  "nbw_locations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    name: text("name").notNull(),
    type: text("type"),
    region: text("region"),
    controlledBy: text("controlled_by"),
    population: text("population"),
    description: text("description"),
    mood: text("mood"),
    sounds: text("sounds"),
    smells: text("smells"),
    temperature: text("temperature"),
    connections: jsonb("connections").default([]).notNull(),
    specialRules: text("special_rules"),
    imageUrl: text("image_url"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_locations_project_idx").on(table.projectId),
    index("nbw_locations_project_name_idx").on(table.projectId, table.name),
  ]
);

export const nbwItems = pgTable(
  "nbw_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    name: text("name").notNull(),
    type: text("type"),
    description: text("description"),
    appearance: text("appearance"),
    powers: text("powers"),
    weaknesses: text("weaknesses"),
    origin: text("origin"),
    history: text("history"),
    currentOwner: text("current_owner"),
    ownerHistory: jsonb("owner_history").default([]).notNull(),
    importance: itemImportanceEnum("importance").default("MINOR").notNull(),
    imageUrl: text("image_url"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("nbw_items_project_idx").on(table.projectId)]
);

export const nbwFactions = pgTable(
  "nbw_factions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    name: text("name").notNull(),
    type: text("type"),
    description: text("description"),
    leader: text("leader"),
    goals: text("goals"),
    values: text("values").array(),
    methods: text("methods"),
    resources: text("resources"),
    territory: text("territory"),
    allies: text("allies").array(),
    enemies: text("enemies").array(),
    imageUrl: text("image_url"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("nbw_factions_project_idx").on(table.projectId)]
);

export const nbwMagicSystems = pgTable("nbw_magic_systems", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  projectId: text("project_id")
    .notNull()
    .unique()
    .references(() => nbwProjects.id),
  name: text("name").notNull(),
  description: text("description"),
  source: text("source"),
  users: text("users"),
  costs: text("costs"),
  limitations: text("limitations"),
  weaknesses: text("weaknesses").array(),
  rules: jsonb("rules").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const nbwWorldRules = pgTable(
  "nbw_world_rules",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    rule: text("rule").notNull(),
    explanation: text("explanation"),
    category: text("category"),
    isStrict: boolean("is_strict").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("nbw_world_rules_project_idx").on(table.projectId)]
);

export const nbwTimelineEvents = pgTable(
  "nbw_timeline_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    title: text("title").notNull(),
    description: text("description"),
    date: text("date"),
    era: text("era"),
    order: integer("order").notNull(),
    type: timelineEventTypeEnum("type").default("STORY").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_timeline_events_project_idx").on(table.projectId),
    index("nbw_timeline_events_project_order_idx").on(
      table.projectId,
      table.order
    ),
  ]
);

export const nbwSubplots = pgTable(
  "nbw_subplots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type"),
    status: subplotStatusEnum("status").default("PLANNED").notNull(),
    progress: integer("progress").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("nbw_subplots_project_idx").on(table.projectId)]
);

// --- Types ---

export type NbwLocation = typeof nbwLocations.$inferSelect;
export type NewNbwLocation = typeof nbwLocations.$inferInsert;
export type NbwItem = typeof nbwItems.$inferSelect;
export type NewNbwItem = typeof nbwItems.$inferInsert;
export type NbwFaction = typeof nbwFactions.$inferSelect;
export type NewNbwFaction = typeof nbwFactions.$inferInsert;
export type NbwMagicSystem = typeof nbwMagicSystems.$inferSelect;
export type NewNbwMagicSystem = typeof nbwMagicSystems.$inferInsert;
export type NbwWorldRule = typeof nbwWorldRules.$inferSelect;
export type NewNbwWorldRule = typeof nbwWorldRules.$inferInsert;
export type NbwTimelineEvent = typeof nbwTimelineEvents.$inferSelect;
export type NewNbwTimelineEvent = typeof nbwTimelineEvents.$inferInsert;
export type NbwSubplot = typeof nbwSubplots.$inferSelect;
export type NewNbwSubplot = typeof nbwSubplots.$inferInsert;
