import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { nbwUserProfiles } from "./user-profiles";

export const projectStatusEnum = pgEnum("nbw_project_status", [
  "PLANNING",
  "DRAFTING",
  "REVISING",
  "EDITING",
  "COMPLETE",
  "ARCHIVED",
]);

export const nbwProjects = pgTable(
  "nbw_projects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => nbwUserProfiles.userId),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    genre: text("genre"),
    coverImage: text("cover_image"),
    status: projectStatusEnum("status").default("PLANNING").notNull(),
    worldName: text("world_name"),
    worldDescription: text("world_description"),
    worldTone: text("world_tone"),
    worldThemes: text("world_themes").array(),
    writingStyle: jsonb("writing_style").default({}).notNull(),
    targetWordCount: integer("target_word_count").default(80000).notNull(),
    targetChapters: integer("target_chapters").default(24).notNull(),
    deadline: timestamp("deadline", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_projects_user_idx").on(table.userId),
    index("nbw_projects_status_idx").on(table.status),
  ]
);

export type NbwProject = typeof nbwProjects.$inferSelect;
export type NewNbwProject = typeof nbwProjects.$inferInsert;
