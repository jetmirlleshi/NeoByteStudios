import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { nbwProjects } from "./projects";

// --- Enums ---

export const projectRoleEnum = pgEnum("nbw_project_role", [
  "OWNER",
  "EDITOR",
  "VIEWER",
]);

export const feedbackTypeEnum = pgEnum("nbw_feedback_type", [
  "BUG",
  "SUGGESTION",
  "OTHER",
]);

// --- Tables ---

export const nbwWritingSessions = pgTable(
  "nbw_writing_sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    wordsWritten: integer("words_written").default(0).notNull(),
  },
  (table) => [
    index("nbw_writing_sessions_project_idx").on(table.projectId),
  ]
);

export const nbwDailyStats = pgTable(
  "nbw_daily_stats",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    wordsWritten: integer("words_written").default(0).notNull(),
    minutesActive: integer("minutes_active").default(0).notNull(),
    chaptersEdited: integer("chapters_edited").default(0).notNull(),
  },
  (table) => [
    unique("nbw_daily_stats_project_date_unique").on(
      table.projectId,
      table.date
    ),
  ]
);

export const nbwActivityLogs = pgTable(
  "nbw_activity_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id").notNull(),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_activity_logs_project_created_idx").on(
      table.projectId,
      table.createdAt
    ),
    index("nbw_activity_logs_user_idx").on(table.userId),
  ]
);

export const nbwNewsletterSubscribers = pgTable("nbw_newsletter_subscribers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const nbwProjectMembers = pgTable(
  "nbw_project_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text("project_id")
      .notNull()
      .references(() => nbwProjects.id),
    userId: text("user_id").notNull(),
    role: projectRoleEnum("role").default("VIEWER").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("nbw_project_members_project_user_unique").on(
      table.projectId,
      table.userId
    ),
    index("nbw_project_members_user_idx").on(table.userId),
  ]
);

export const nbwFeedback = pgTable(
  "nbw_feedback",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id").notNull(),
    type: feedbackTypeEnum("type").notNull(),
    message: text("message").notNull(),
    email: text("email"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("nbw_feedback_user_idx").on(table.userId)]
);

// --- Types ---

export type NbwWritingSession = typeof nbwWritingSessions.$inferSelect;
export type NewNbwWritingSession = typeof nbwWritingSessions.$inferInsert;
export type NbwDailyStat = typeof nbwDailyStats.$inferSelect;
export type NewNbwDailyStat = typeof nbwDailyStats.$inferInsert;
export type NbwActivityLog = typeof nbwActivityLogs.$inferSelect;
export type NewNbwActivityLog = typeof nbwActivityLogs.$inferInsert;
export type NbwNewsletterSubscriber =
  typeof nbwNewsletterSubscribers.$inferSelect;
export type NewNbwNewsletterSubscriber =
  typeof nbwNewsletterSubscribers.$inferInsert;
export type NbwProjectMember = typeof nbwProjectMembers.$inferSelect;
export type NewNbwProjectMember = typeof nbwProjectMembers.$inferInsert;
export type NbwFeedback = typeof nbwFeedback.$inferSelect;
export type NewNbwFeedback = typeof nbwFeedback.$inferInsert;
