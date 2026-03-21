import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwChapterVersions,
  eq,
  and,
  isNull,
  desc,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
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

// GET /api/chapters/[chapterId]/versions — List versions (newest first, max 50)
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  const versions = await db
    .select()
    .from(nbwChapterVersions)
    .where(eq(nbwChapterVersions.chapterId, chapterId))
    .orderBy(desc(nbwChapterVersions.createdAt))
    .limit(50);

  return NextResponse.json({ versions });
}

// POST /api/chapters/[chapterId]/versions — Create a manual checkpoint
export async function POST(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  const [version] = await db
    .insert(nbwChapterVersions)
    .values({
      chapterId: chapter.id,
      contentJson: chapter.contentJson,
      wordCount: chapter.wordCount,
    })
    .returning();

  return NextResponse.json({ version }, { status: 201 });
}
