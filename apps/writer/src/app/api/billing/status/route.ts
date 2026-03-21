// ---------------------------------------------------------------------------
// GET /api/billing/status — Current user billing status and usage
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import {
  getAuthSession,
  unauthorized,
} from "@/lib/api-helpers";
import {
  db,
  eq,
  and,
  isNull,
  count,
  nbwUserProfiles,
  nbwProjects,
} from "@neobytestudios/db";
import { TIER_LIMITS, type Tier } from "@/lib/billing/limits";

export const dynamic = "force-dynamic";

export async function GET() {
  // --- Auth ---
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // --- Fetch user profile ---
  const profile = await db.query.nbwUserProfiles.findFirst({
    where: eq(nbwUserProfiles.userId, userId),
  });

  const tier: Tier = (profile?.subscriptionTier as Tier) ?? "FREE";
  const limits = TIER_LIMITS[tier];

  // --- Count active (non-deleted) projects ---
  const [projectRow] = await db
    .select({ value: count() })
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  const projectsUsed = projectRow?.value ?? 0;

  // --- AI generation usage ---
  const aiGenerationsToday = profile?.aiGenerationsToday ?? 0;
  const aiGenerationsLimit = limits.aiGenerationsPerDay;
  const aiGenerationsRemaining = Math.max(
    0,
    aiGenerationsLimit === Infinity
      ? Infinity
      : aiGenerationsLimit - aiGenerationsToday
  );

  return NextResponse.json({
    tier,
    aiGenerationsToday,
    aiGenerationsLimit,
    aiGenerationsRemaining,
    projectsUsed,
    projectsLimit: limits.maxProjects,
    exportEnabled: limits.exportEnabled,
    coherenceTiers: limits.coherenceTiers as number[],
    trialEndsAt: profile?.trialEndsAt?.toISOString() ?? null,
  });
}
