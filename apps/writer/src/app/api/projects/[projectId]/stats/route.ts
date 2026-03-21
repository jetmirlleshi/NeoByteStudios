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
  forbidden,
} from "@/lib/api-helpers";
import { getProjectStats } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function checkProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select({ userId: nbwProjects.userId })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt)));
  return project?.userId === userId;
}

// GET /api/projects/[projectId]/stats — Full project statistics
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const isOwner = await checkProjectOwnership(projectId, session.user.id);
  if (isOwner === false) return notFound("Project not found");

  const stats = await getProjectStats(projectId);

  return NextResponse.json({ stats });
}
