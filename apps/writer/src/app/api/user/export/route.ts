import { NextResponse } from "next/server";
import {
  db,
  nbwUserProfiles,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwRelationships,
  nbwLocations,
  nbwItems,
  nbwFactions,
  nbwMagicSystems,
  nbwWorldRules,
  nbwTimelineEvents,
  nbwSubplots,
  nbwWritingSessions,
  nbwDailyStats,
  nbwActivityLogs,
  nbwNarrativeFacts,
  nbwCoherenceAlerts,
  nbwAiMemoryChunks,
  eq,
  and,
  isNull,
  inArray,
  asc,
} from "@neobytestudios/db";
import { getAuthSession, unauthorized } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// POST /api/user/export — GDPR data export
export async function POST() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // 1. User profile
  const [profile] = await db
    .select()
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, userId));

  // 2. All user projects (including soft-deleted)
  const projects = await db
    .select()
    .from(nbwProjects)
    .where(eq(nbwProjects.userId, userId));

  const projectIds = projects.map((p) => p.id);

  // If the user has no projects, return early with just the profile
  if (projectIds.length === 0) {
    const exportData = {
      exportedAt: new Date().toISOString(),
      userId,
      profile: profile ?? null,
      projects: [],
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    return new NextResponse(jsonStr, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="NeoByteWriter_Export_${userId.substring(0, 8)}.json"`,
        "Content-Length": String(Buffer.byteLength(jsonStr, "utf-8")),
      },
    });
  }

  // 3. Fetch all project-scoped data in parallel
  const [
    allChapters,
    allCharacters,
    allRelationships,
    allLocations,
    allItems,
    allFactions,
    allMagicSystems,
    allWorldRules,
    allTimeline,
    allSubplots,
    allWritingSessions,
    allDailyStats,
    allActivityLogs,
    allNarrativeFacts,
    allCoherenceAlerts,
    allAiMemoryChunks,
  ] = await Promise.all([
    db
      .select()
      .from(nbwChapters)
      .where(inArray(nbwChapters.projectId, projectIds))
      .orderBy(asc(nbwChapters.order)),
    db
      .select()
      .from(nbwCharacters)
      .where(inArray(nbwCharacters.projectId, projectIds)),
    // Relationships don't have projectId directly - we'll filter by character IDs later
    db.select().from(nbwRelationships),
    db
      .select()
      .from(nbwLocations)
      .where(inArray(nbwLocations.projectId, projectIds)),
    db
      .select()
      .from(nbwItems)
      .where(inArray(nbwItems.projectId, projectIds)),
    db
      .select()
      .from(nbwFactions)
      .where(inArray(nbwFactions.projectId, projectIds)),
    db
      .select()
      .from(nbwMagicSystems)
      .where(inArray(nbwMagicSystems.projectId, projectIds)),
    db
      .select()
      .from(nbwWorldRules)
      .where(inArray(nbwWorldRules.projectId, projectIds)),
    db
      .select()
      .from(nbwTimelineEvents)
      .where(inArray(nbwTimelineEvents.projectId, projectIds))
      .orderBy(asc(nbwTimelineEvents.order)),
    db
      .select()
      .from(nbwSubplots)
      .where(inArray(nbwSubplots.projectId, projectIds)),
    db
      .select()
      .from(nbwWritingSessions)
      .where(inArray(nbwWritingSessions.projectId, projectIds)),
    db
      .select()
      .from(nbwDailyStats)
      .where(inArray(nbwDailyStats.projectId, projectIds)),
    db
      .select()
      .from(nbwActivityLogs)
      .where(eq(nbwActivityLogs.userId, userId)),
    db
      .select()
      .from(nbwNarrativeFacts)
      .where(inArray(nbwNarrativeFacts.projectId, projectIds)),
    db
      .select()
      .from(nbwCoherenceAlerts)
      .where(inArray(nbwCoherenceAlerts.projectId, projectIds)),
    db
      .select()
      .from(nbwAiMemoryChunks)
      .where(inArray(nbwAiMemoryChunks.projectId, projectIds)),
  ]);

  // Filter relationships to only include user's characters
  const characterIds = new Set(allCharacters.map((c) => c.id));
  const userRelationships = allRelationships.filter(
    (r) =>
      characterIds.has(r.fromCharacterId) || characterIds.has(r.toCharacterId)
  );

  // 4. Group data by project
  const projectExports = projects.map((project) => {
    const pid = project.id;

    return {
      ...project,
      chapters: allChapters.filter((c) => c.projectId === pid),
      characters: allCharacters.filter((c) => c.projectId === pid),
      relationships: userRelationships.filter((r) => {
        const charA = allCharacters.find((c) => c.id === r.fromCharacterId);
        return charA?.projectId === pid;
      }),
      locations: allLocations.filter((l) => l.projectId === pid),
      items: allItems.filter((i) => i.projectId === pid),
      factions: allFactions.filter((f) => f.projectId === pid),
      magicSystem: allMagicSystems.find((ms) => ms.projectId === pid) ?? null,
      worldRules: allWorldRules.filter((wr) => wr.projectId === pid),
      timeline: allTimeline.filter((t) => t.projectId === pid),
      subplots: allSubplots.filter((s) => s.projectId === pid),
      writingSessions: allWritingSessions.filter((ws) => ws.projectId === pid),
      dailyStats: allDailyStats.filter((ds) => ds.projectId === pid),
      narrativeFacts: allNarrativeFacts.filter((nf) => nf.projectId === pid),
      coherenceAlerts: allCoherenceAlerts.filter((ca) => ca.projectId === pid),
      aiMemoryChunks: allAiMemoryChunks.filter((am) => am.projectId === pid),
    };
  });

  // 5. Build the final export object
  const exportData = {
    exportedAt: new Date().toISOString(),
    userId,
    profile: profile ?? null,
    activityLogs: allActivityLogs,
    projects: projectExports,
  };

  const jsonStr = JSON.stringify(exportData, null, 2);

  return new NextResponse(jsonStr, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="NeoByteWriter_Export_${userId.substring(0, 8)}.json"`,
      "Content-Length": String(Buffer.byteLength(jsonStr, "utf-8")),
    },
  });
}
