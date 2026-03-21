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

export const subscriptionTierEnum = pgEnum("nbw_subscription_tier", [
  "FREE",
  "WRITER",
  "PROFESSIONAL",
]);

export const nbwUserProfiles = pgTable(
  "nbw_user_profiles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id").notNull().unique(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .default("FREE")
      .notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    aiGenerationsToday: integer("ai_generations_today").default(0).notNull(),
    aiGenerationsResetAt: timestamp("ai_generations_reset_at", {
      withTimezone: true,
    }),
    preferences: jsonb("preferences").default({}).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("nbw_user_profiles_stripe_idx").on(table.stripeCustomerId),
  ]
);

export type NbwUserProfile = typeof nbwUserProfiles.$inferSelect;
export type NewNbwUserProfile = typeof nbwUserProfiles.$inferInsert;
