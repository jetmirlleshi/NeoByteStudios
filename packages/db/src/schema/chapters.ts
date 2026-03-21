import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { nbwProjects } from "./projects";

// --- Enums ---

export const chapterStatusEnum = pgEnum("nbw_chapter_status", [
  "IDEA",
  "OUTLINE",
  "DRAFT",
  "REVISION",
  "COMPLETE",
]);

// --- Tables ---

export const nbwChapters = pgTable(
  "nbw_chapters",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    title: text("title").notNull(),
    number: integer("number").notNull(),
    summary: text("summary"),
    notes: text("notes"),
    contentJson: text("content_json").default("").notNull(),
    contentHtml: text("content_html").default("").notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    status: chapterStatusEnum("status").default("IDEA").notNull(),
    pov: text("pov"),
    timelineDay: integer("timeline_day"),
    timelineMoment: text("timeline_moment"),
    order: integer("order").notNull(),
    version: integer("version").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_chapters_project_idx").on(table.projectId),
    index("nbw_chapters_project_order_idx").on(table.projectId, table.order),
    index("nbw_chapters_project_number_idx").on(
      table.projectId,
      table.number
    ),
  ]
);

export const nbwScenes = pgTable(
  "nbw_scenes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
    title: text("title"),
    summary: text("summary"),
    notes: text("notes"),
    content: text("content").default("").notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    mood: text("mood"),
    purpose: text("purpose"),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_scenes_chapter_idx").on(table.chapterId),
    index("nbw_scenes_chapter_order_idx").on(table.chapterId, table.order),
  ]
);

export const nbwChapterVersions = pgTable(
  "nbw_chapter_versions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
    contentJson: text("content_json").notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_chapter_versions_chapter_created_idx").on(
      table.chapterId,
      table.createdAt
    ),
  ]
);

// --- Types ---

export type NbwChapter = typeof nbwChapters.$inferSelect;
export type NewNbwChapter = typeof nbwChapters.$inferInsert;
export type NbwScene = typeof nbwScenes.$inferSelect;
export type NewNbwScene = typeof nbwScenes.$inferInsert;
export type NbwChapterVersion = typeof nbwChapterVersions.$inferSelect;
export type NewNbwChapterVersion = typeof nbwChapterVersions.$inferInsert;
