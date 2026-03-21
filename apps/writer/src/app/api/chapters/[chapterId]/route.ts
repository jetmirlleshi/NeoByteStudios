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

type RouteContext = { params: Promise<{ chapterId: string }> };

// Helper: get chapter with ownership verification through its project
async function getOwnedChapter(chapterId: string, userId: string) {
  const [chapter] = await db
    .select()
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.id, chapterId),
        isNull(nbwChapters.deletedAt)
      )
    );

  if (!chapter) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, chapter.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return chapter;
}

// GET /api/chapters/[chapterId] — Get a single chapter
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  return NextResponse.json({ chapter });
}

// PATCH /api/chapters/[chapterId] — Update chapter fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Only allow updating specific fields
  const allowedFields = [
    "title",
    "summary",
    "notes",
    "status",
    "pov",
    "timelineDay",
    "timelineMoment",
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
    .update(nbwChapters)
    .set(updates)
    .where(eq(nbwChapters.id, chapterId))
    .returning();

  return NextResponse.json({ chapter: updated });
}

// DELETE /api/chapters/[chapterId] — Soft-delete a chapter
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  await db
    .update(nbwChapters)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwChapters.id, chapterId));

  return NextResponse.json({ success: true });
}
