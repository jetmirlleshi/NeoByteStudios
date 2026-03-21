import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwLocations,
  eq,
  and,
  isNull,
  sql,
  count,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  forbidden,
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

// GET /api/projects/[projectId] — Get project with aggregate stats
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  // Aggregate stats
  const [chapterStats] = await db
    .select({
      chapterCount: count(nbwChapters.id),
      totalWords: sql<number>`coalesce(sum(${nbwChapters.wordCount}), 0)`,
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    );

  const [characterStats] = await db
    .select({ characterCount: count(nbwCharacters.id) })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  const [locationStats] = await db
    .select({ locationCount: count(nbwLocations.id) })
    .from(nbwLocations)
    .where(
      and(
        eq(nbwLocations.projectId, projectId),
        isNull(nbwLocations.deletedAt)
      )
    );

  return NextResponse.json({
    project: {
      ...project,
      totalWords: Number(chapterStats?.totalWords ?? 0),
      chapterCount: Number(chapterStats?.chapterCount ?? 0),
      characterCount: Number(characterStats?.characterCount ?? 0),
      locationCount: Number(locationStats?.locationCount ?? 0),
    },
  });
}

// PATCH /api/projects/[projectId] — Update project fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Only allow updating specific fields
  const allowedFields = [
    "title",
    "subtitle",
    "description",
    "genre",
    "coverImage",
    "status",
    "worldName",
    "worldDescription",
    "worldTone",
    "worldThemes",
    "writingStyle",
    "targetWordCount",
    "targetChapters",
    "deadline",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return badRequest("No valid fields to update");
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(nbwProjects)
    .set(updates)
    .where(eq(nbwProjects.id, projectId))
    .returning();

  return NextResponse.json({ project: updated });
}

// DELETE /api/projects/[projectId] — Soft-delete project
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  await db
    .update(nbwProjects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwProjects.id, projectId));

  return NextResponse.json({ success: true });
}
