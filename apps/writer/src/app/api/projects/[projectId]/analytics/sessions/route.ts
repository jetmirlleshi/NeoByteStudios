import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwWritingSessions,
  nbwDailyStats,
  eq,
  and,
  isNull,
  sql,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
  badRequest,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function checkProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select({ userId: nbwProjects.userId })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt)));
  return project?.userId === userId;
}

// POST /api/projects/[projectId]/analytics/sessions — Track a writing session
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const isOwner = await checkProjectOwnership(projectId, session.user.id);
  if (!isOwner) return notFound("Project not found");

  let body: {
    wordsWritten?: number;
    startedAt?: string;
    endedAt?: string;
    chaptersEdited?: number;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (typeof body.wordsWritten !== "number" || body.wordsWritten < 0) {
    return badRequest("wordsWritten must be a non-negative number");
  }

  if (!body.startedAt) {
    return badRequest("startedAt is required");
  }

  const startedAt = new Date(body.startedAt);
  const endedAt = body.endedAt ? new Date(body.endedAt) : null;

  if (isNaN(startedAt.getTime())) {
    return badRequest("startedAt must be a valid date");
  }

  if (endedAt && isNaN(endedAt.getTime())) {
    return badRequest("endedAt must be a valid date");
  }

  // Calculate session duration in minutes
  let minutesActive = 0;
  if (endedAt) {
    minutesActive = Math.round(
      (endedAt.getTime() - startedAt.getTime()) / 60000
    );
    if (minutesActive < 0) minutesActive = 0;
  }

  const chaptersEdited = body.chaptersEdited ?? 0;

  // Insert writing session
  const [writingSession] = await db
    .insert(nbwWritingSessions)
    .values({
      projectId,
      startedAt,
      endedAt,
      wordsWritten: body.wordsWritten,
    })
    .returning();

  // Upsert daily stats using ON CONFLICT on the unique constraint
  // The unique constraint is on (project_id, date)
  const sessionDate = new Date(
    startedAt.getFullYear(),
    startedAt.getMonth(),
    startedAt.getDate()
  );

  await db
    .insert(nbwDailyStats)
    .values({
      projectId,
      date: sessionDate,
      wordsWritten: body.wordsWritten,
      minutesActive,
      chaptersEdited,
    })
    .onConflictDoUpdate({
      target: [nbwDailyStats.projectId, nbwDailyStats.date],
      set: {
        wordsWritten: sql`${nbwDailyStats.wordsWritten} + ${body.wordsWritten}`,
        minutesActive: sql`${nbwDailyStats.minutesActive} + ${minutesActive}`,
        chaptersEdited: sql`${nbwDailyStats.chaptersEdited} + ${chaptersEdited}`,
      },
    });

  return NextResponse.json({ session: writingSession }, { status: 201 });
}
