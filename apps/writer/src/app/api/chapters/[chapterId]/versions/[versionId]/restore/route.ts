import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwChapterVersions,
  eq,
  and,
  isNull,
  sql,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ chapterId: string; versionId: string }>;
};

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

// POST /api/chapters/[chapterId]/versions/[versionId]/restore — Restore chapter to a specific version
export async function POST(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { chapterId, versionId } = await context.params;
  const chapter = await getOwnedChapter(chapterId, session.user.id);
  if (!chapter) return notFound("Chapter not found");

  // Fetch the version to restore
  const [version] = await db
    .select()
    .from(nbwChapterVersions)
    .where(
      and(
        eq(nbwChapterVersions.id, versionId),
        eq(nbwChapterVersions.chapterId, chapterId)
      )
    );

  if (!version) return notFound("Version not found");

  // Update the chapter content and increment its version counter
  const [updated] = await db
    .update(nbwChapters)
    .set({
      contentJson: version.contentJson,
      wordCount: version.wordCount,
      version: sql`${nbwChapters.version} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(nbwChapters.id, chapterId))
    .returning();

  return NextResponse.json({ chapter: updated });
}
