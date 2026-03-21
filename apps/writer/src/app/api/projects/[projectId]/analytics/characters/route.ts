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
import { getCharacterAnalytics } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function checkProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select({ userId: nbwProjects.userId })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt)));
  return project?.userId === userId;
}

// GET /api/projects/[projectId]/analytics/characters
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const isOwner = await checkProjectOwnership(projectId, session.user.id);
  if (!isOwner) return notFound("Project not found");

  const characters = await getCharacterAnalytics(projectId);

  return NextResponse.json({ characters });
}
