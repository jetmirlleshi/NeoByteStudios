import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
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
  conflict,
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

// PUT /api/chapters/[chapterId]/content — Update chapter content with optimistic locking
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  let body: {
    contentJson?: string;
    contentHtml?: string;
    wordCount?: number;
    expectedVersion?: number;
  };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (
    body.contentJson === undefined ||
    body.contentHtml === undefined ||
    body.wordCount === undefined ||
    body.expectedVersion === undefined
  ) {
    return badRequest(
      "contentJson, contentHtml, wordCount, and expectedVersion are required"
    );
  }

  // Optimistic locking: check version matches
  if (chapter.version !== body.expectedVersion) {
    return conflict(
      `Version conflict: expected ${body.expectedVersion} but chapter is at version ${chapter.version}. Please refresh and try again.`
    );
  }

  const [updated] = await db
    .update(nbwChapters)
    .set({
      contentJson: body.contentJson,
      contentHtml: body.contentHtml,
      wordCount: body.wordCount,
      version: sql`${nbwChapters.version} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(nbwChapters.id, chapterId),
        eq(nbwChapters.version, body.expectedVersion)
      )
    )
    .returning();

  // If no row was updated, another write happened between our read and update
  if (!updated) {
    return conflict(
      "Version conflict: the chapter was modified by another request. Please refresh and try again."
    );
  }

  return NextResponse.json({ chapter: updated });
}
