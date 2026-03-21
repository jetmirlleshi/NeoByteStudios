import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  eq,
  and,
  isNull,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
  badRequest,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

// Helper: get project with ownership check
async function getOwnedProject(projectId: string, userId: string) {
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );
  return project ?? null;
}

// POST /api/projects/[projectId]/chapters/reorder — Reorder chapters
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  let body: { orderedIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
    return badRequest("orderedIds must be a non-empty array of chapter IDs");
  }

  // Update order for each chapter individually
  // (Neon HTTP driver doesn't support interactive transactions)
  for (let i = 0; i < body.orderedIds.length; i++) {
    await db
      .update(nbwChapters)
      .set({ order: i, updatedAt: new Date() })
      .where(
        and(
          eq(nbwChapters.id, body.orderedIds[i]),
          eq(nbwChapters.projectId, projectId),
          isNull(nbwChapters.deletedAt)
        )
      );
  }

  return NextResponse.json({ success: true });
}
