import { NextResponse } from "next/server";
import {
  db,
  eq,
  and,
  isNull,
  count,
  nbwUserProfiles,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwAiMemoryChunks,
} from "@neobytestudios/db";
import { getAuthSession, unauthorized } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// GET /api/user/onboarding — Get onboarding status for current user
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // Check if user has completed onboarding via preferences JSON field
  const [profile] = await db
    .select({ preferences: nbwUserProfiles.preferences })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, userId))
    .limit(1);

  const preferences = (profile?.preferences ?? {}) as Record<string, unknown>;
  const onboardingCompleted = preferences.onboardingCompleted === true;

  // Get user's projects (not soft-deleted)
  const [projectResult] = await db
    .select({ total: count(nbwProjects.id) })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.userId, userId), isNull(nbwProjects.deletedAt)));

  const hasProject = (projectResult?.total ?? 0) > 0;

  // Get chapters count across all user projects
  const chapterResult = await db
    .select({ total: count(nbwChapters.id) })
    .from(nbwChapters)
    .innerJoin(nbwProjects, eq(nbwChapters.projectId, nbwProjects.id))
    .where(
      and(
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt),
        isNull(nbwChapters.deletedAt)
      )
    );

  const hasChapter = (chapterResult[0]?.total ?? 0) > 0;

  // Get characters count across all user projects
  const characterResult = await db
    .select({ total: count(nbwCharacters.id) })
    .from(nbwCharacters)
    .innerJoin(nbwProjects, eq(nbwCharacters.projectId, nbwProjects.id))
    .where(
      and(
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt),
        isNull(nbwCharacters.deletedAt)
      )
    );

  const hasCharacter = (characterResult[0]?.total ?? 0) > 0;

  // Check if user has used AI (check ai_memory_chunks or ai_generations_today)
  const [profileAi] = await db
    .select({ aiGenerationsToday: nbwUserProfiles.aiGenerationsToday })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, userId))
    .limit(1);

  let hasUsedAI = (profileAi?.aiGenerationsToday ?? 0) > 0;

  // Also check if any AI memory chunks exist for user's projects
  if (!hasUsedAI) {
    const aiResult = await db
      .select({ total: count(nbwAiMemoryChunks.id) })
      .from(nbwAiMemoryChunks)
      .innerJoin(
        nbwProjects,
        eq(nbwAiMemoryChunks.projectId, nbwProjects.id)
      )
      .where(
        and(eq(nbwProjects.userId, userId), isNull(nbwProjects.deletedAt))
      );

    hasUsedAI = (aiResult[0]?.total ?? 0) > 0;
  }

  // Check if user has exported (check activity logs for export actions)
  // Since we don't have a dedicated export tracking table, check preferences
  const hasExported = preferences.hasExported === true;

  return NextResponse.json({
    completed: onboardingCompleted,
    steps: {
      hasProject,
      hasChapter,
      hasCharacter,
      hasUsedAI,
      hasExported,
    },
  });
}

// POST /api/user/onboarding — Mark onboarding as completed
export async function POST() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // Get current preferences
  const [profile] = await db
    .select({ preferences: nbwUserProfiles.preferences })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, userId))
    .limit(1);

  const currentPreferences = (profile?.preferences ?? {}) as Record<
    string,
    unknown
  >;

  // Update preferences with onboardingCompleted flag
  await db
    .update(nbwUserProfiles)
    .set({
      preferences: {
        ...currentPreferences,
        onboardingCompleted: true,
      },
      updatedAt: new Date(),
    })
    .where(eq(nbwUserProfiles.userId, userId));

  return NextResponse.json({ success: true });
}
