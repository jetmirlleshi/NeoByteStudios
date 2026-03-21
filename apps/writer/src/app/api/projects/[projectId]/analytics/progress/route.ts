import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  eq,
  and,
  isNull,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
} from "@/lib/api-helpers";
import { getDailyProgress } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function checkProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select({ userId: nbwProjects.userId })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt)));
  return project?.userId === userId;
}

// GET /api/projects/[projectId]/analytics/progress?days=90
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const isOwner = await checkProjectOwnership(projectId, session.user.id);
  if (!isOwner) return notFound("Project not found");

  const { searchParams } = new URL(request.url);
  const days = Math.min(
    Math.max(parseInt(searchParams.get("days") ?? "90", 10) || 90, 1),
    365
  );

  const progress = await getDailyProgress(projectId, days);

  return NextResponse.json({ progress, days });
}
