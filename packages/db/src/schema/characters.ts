import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { nbwProjects } from "./projects";

// --- Enums ---

export const characterRoleEnum = pgEnum("nbw_character_role", [
  "PROTAGONIST",
  "ANTAGONIST",
  "DEUTERAGONIST",
  "MENTOR",
  "LOVE_INTEREST",
  "SIDEKICK",
  "SUPPORTING",
  "MINOR",
]);

export const characterStatusEnum = pgEnum("nbw_character_status", [
  "ALIVE",
  "DEAD",
  "UNKNOWN",
  "TRANSFORMED",
]);

export const relationshipTypeEnum = pgEnum("nbw_relationship_type", [
  "FAMILY",
  "ROMANTIC",
  "FRIENDSHIP",
  "RIVALRY",
  "ENEMY",
  "MENTOR_STUDENT",
  "EMPLOYER_EMPLOYEE",
  "ALLY",
  "NEUTRAL",
]);

// --- Tables ---

export const nbwCharacters = pgTable(
  "nbw_characters",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    name: text("name").notNull(),
    fullName: text("full_name"),
    aliases: text("aliases").array(),
    age: integer("age"),
    role: characterRoleEnum("role").default("SUPPORTING").notNull(),
    status: characterStatusEnum("status").default("ALIVE").notNull(),
    factionId: text("faction_id"),

    // Physical
    height: text("height"),
    build: text("build"),
    hairColor: text("hair_color"),
    hairStyle: text("hair_style"),
    eyeColor: text("eye_color"),
    skinTone: text("skin_tone"),
    distinctiveFeatures: text("distinctive_features"),
    clothing: text("clothing"),

    // Psychology
    personality: text("personality"),
    motivation: text("motivation"),
    fears: text("fears").array(),
    strengths: text("strengths").array(),
    weaknesses: text("weaknesses").array(),
    fatalFlaw: text("fatal_flaw"),
    secrets: text("secrets"),
    backstory: text("backstory"),

    // Voice
    speechPattern: text("speech_pattern"),
    vocabulary: text("vocabulary"),
    catchPhrases: text("catch_phrases").array(),
    neverSays: text("never_says").array(),
    verbosity: text("verbosity"),

    // Narrative Arc
    arcStart: text("arc_start"),
    arcMidpoint: text("arc_midpoint"),
    arcCrisis: text("arc_crisis"),
    arcEnd: text("arc_end"),
    arcLesson: text("arc_lesson"),

    // Abilities
    abilities: text("abilities"),
    limitations: text("limitations"),

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
    index("nbw_characters_project_idx").on(table.projectId),
    index("nbw_characters_project_name_idx").on(table.projectId, table.name),
  ]
);

export const nbwRelationships = pgTable(
  "nbw_relationships",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    fromCharacterId: text("from_character_id")
      .notNull()
      .references(() => nbwCharacters.id),
    toCharacterId: text("to_character_id")
      .notNull()
      .references(() => nbwCharacters.id),
    type: relationshipTypeEnum("type").default("NEUTRAL").notNull(),
    description: text("description"),
    startState: text("start_state"),
    currentState: text("current_state"),
    endState: text("end_state"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("nbw_relationships_pair_unique").on(
      table.fromCharacterId,
      table.toCharacterId
    ),
  ]
);

// --- Types ---

export type NbwCharacter = typeof nbwCharacters.$inferSelect;
export type NewNbwCharacter = typeof nbwCharacters.$inferInsert;
export type NbwRelationship = typeof nbwRelationships.$inferSelect;
export type NewNbwRelationship = typeof nbwRelationships.$inferInsert;
