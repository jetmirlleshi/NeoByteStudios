import {
  db,
  eq,
  nbwUserProfiles,
  sql,
} from "@neobytestudios/db";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum AI generations per day, indexed by subscription tier. */
export const AI_LIMITS: Record<string, number> = {
  FREE: 15,
  WRITER: 150,
  PROFESSIONAL: Infinity,
};

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

interface InMemoryEntry {
  count: number;
  resetAt: number; // epoch ms
}

/**
 * Fallback rate-limit store used when the DB profile doesn't exist yet
 * (e.g. new user before profile row is created).
 */
const memoryStore = new Map<string, InMemoryEntry>();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** How many generations remain in the current window */
  remaining: number;
  /** Epoch ms when the counter resets */
  resetAt: number;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check (and increment) the AI rate limit for a user.
 *
 * Tries the DB-based approach first (nbwUserProfiles.aiGenerationsToday).
 * Falls back to an in-memory Map when no profile row exists.
 */
export async function checkAiRateLimit(
  userId: string,
  tier: string
): Promise<RateLimitResult> {
  const limit = AI_LIMITS[tier] ?? AI_LIMITS.FREE!;

  // Infinite tier — always allowed
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, resetAt: 0 };
  }

  // ------ Try DB-based approach ------
  try {
    const profile = await db
      .select({
        aiGenerationsToday: nbwUserProfiles.aiGenerationsToday,
        aiGenerationsResetAt: nbwUserProfiles.aiGenerationsResetAt,
      })
      .from(nbwUserProfiles)
      .where(eq(nbwUserProfiles.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (profile) {
      return handleDbRateLimit(userId, profile, limit);
    }
  } catch {
    // DB query failed — fall through to in-memory
  }

  // ------ In-memory fallback ------
  return handleInMemoryRateLimit(userId, limit);
}

/**
 * Produce standard rate-limit response headers.
 */
export function rateLimitHeaders(
  remaining: number,
  limit: number,
  resetAt: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit === Infinity ? -1 : limit),
    "X-RateLimit-Remaining": String(remaining === Infinity ? -1 : remaining),
    "X-RateLimit-Reset": String(resetAt),
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function startOfTomorrow(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
}

async function handleDbRateLimit(
  userId: string,
  profile: {
    aiGenerationsToday: number;
    aiGenerationsResetAt: Date | null;
  },
  limit: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = profile.aiGenerationsResetAt?.getTime() ?? 0;

  // If the reset time has passed, reset the counter first
  if (resetAt < now) {
    const newResetAt = startOfTomorrow();

    await db
      .update(nbwUserProfiles)
      .set({
        aiGenerationsToday: 1,
        aiGenerationsResetAt: newResetAt,
        updatedAt: new Date(),
      })
      .where(eq(nbwUserProfiles.userId, userId));

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: newResetAt.getTime(),
    };
  }

  // Counter is still valid for today
  if (profile.aiGenerationsToday >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Increment counter atomically
  await db
    .update(nbwUserProfiles)
    .set({
      aiGenerationsToday: sql`${nbwUserProfiles.aiGenerationsToday} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(nbwUserProfiles.userId, userId));

  return {
    allowed: true,
    remaining: limit - profile.aiGenerationsToday - 1,
    resetAt,
  };
}

function handleInMemoryRateLimit(
  userId: string,
  limit: number
): RateLimitResult {
  const now = Date.now();
  let entry = memoryStore.get(userId);

  // Reset if expired or doesn't exist
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: startOfTomorrow().getTime(),
    };
    memoryStore.set(userId, entry);
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}
