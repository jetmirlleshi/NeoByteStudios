import { NextRequest, NextResponse } from "next/server";
import {
  db,
  eq,
  and,
  isNull,
  nbwProjects,
  nbwUserProfiles,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-helpers";
import { checkAiRateLimit, rateLimitHeaders, AI_LIMITS } from "@/lib/ai/rate-limit";
import {
  generateSuggestions,
  type SuggestionTrigger,
} from "@/lib/ai/suggestions";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_TRIGGERS = new Set<string>([
  "chapter_change",
  "location_change",
  "character_intro",
  "writer_block",
]);

// ---------------------------------------------------------------------------
// POST /api/ai/suggest
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Auth check
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // 2. Parse and validate body
  let body: {
    projectId?: string;
    chapterId?: string;
    recentText?: string;
    trigger?: string;
  };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.projectId || typeof body.projectId !== "string") {
    return badRequest("projectId is required");
  }
  if (!body.chapterId || typeof body.chapterId !== "string") {
    return badRequest("chapterId is required");
  }
  if (!body.recentText || typeof body.recentText !== "string") {
    return badRequest("recentText is required");
  }
  if (!body.trigger || !VALID_TRIGGERS.has(body.trigger)) {
    return badRequest(
      `trigger must be one of: ${[...VALID_TRIGGERS].join(", ")}`
    );
  }

  // 3. Verify project ownership
  const [project] = await db
    .select({ id: nbwProjects.id })
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, body.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    )
    .limit(1);

  if (!project) {
    return notFound("Project not found");
  }

  // 4. Get user tier for rate limiting
  const [profile] = await db
    .select({ subscriptionTier: nbwUserProfiles.subscriptionTier })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, userId))
    .limit(1);

  const tier = profile?.subscriptionTier ?? "FREE";

  // 5. Rate limit check
  const rateLimit = await checkAiRateLimit(userId, tier);
  const limit = AI_LIMITS[tier] ?? AI_LIMITS.FREE!;
  const headers = rateLimitHeaders(rateLimit.remaining, limit, rateLimit.resetAt);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "AI generation rate limit exceeded. Try again tomorrow." },
      { status: 429, headers }
    );
  }

  // 6. Generate suggestions
  try {
    const suggestions = await generateSuggestions({
      projectId: body.projectId,
      chapterId: body.chapterId,
      recentText: body.recentText,
      trigger: body.trigger as SuggestionTrigger,
    });

    return NextResponse.json({ suggestions }, { headers });
  } catch (error) {
    console.error("[api/ai/suggest] Failed to generate suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500, headers }
    );
  }
}
