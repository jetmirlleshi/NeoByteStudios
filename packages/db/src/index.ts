export { db } from "./client";
export type { Database } from "./client";
export * from "./schema/index";

// Re-export drizzle-orm operators to avoid duplicate resolution in monorepo
export {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  and,
  or,
  not,
  isNull,
  isNotNull,
  like,
  ilike,
  inArray,
  notInArray,
  between,
  desc,
  asc,
  sql,
  count,
  sum,
  avg,
  min,
  max,
} from "drizzle-orm";
