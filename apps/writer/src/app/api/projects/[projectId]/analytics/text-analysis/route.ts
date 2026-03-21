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
} from "@/lib/api-helpers";
import { analyzeText } from "@/lib/analytics/text-analysis";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function checkProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select({ userId: nbwProjects.userId })
    .from(nbwProjects)
    .where(and(eq(nbwProjects.id, projectId), isNull(nbwProjects.deletedAt)));
  return project?.userId === userId;
}

// GET /api/projects/[projectId]/analytics/text-analysis
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;

  const isOwner = await checkProjectOwnership(projectId, session.user.id);
  if (!isOwner) return notFound("Project not found");

  // Fetch all non-deleted chapter HTML content
  const chapters = await db
    .select({ contentHtml: nbwChapters.contentHtml })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    );

  // Concatenate all chapter content
  const fullHtml = chapters
    .map((ch) => ch.contentHtml ?? "")
    .filter((html) => html.length > 0)
    .join(" ");

  if (fullHtml.length === 0) {
    return NextResponse.json({
      analysis: {
        topWords: [],
        sentenceStats: {
          avg: 0,
          median: 0,
          min: 0,
          max: 0,
          distribution: { short: 0, medium: 0, long: 0 },
        },
        dialogueRatio: 0,
        gulpease: 0,
        typeTokenRatio: 0,
      },
      chapterCount: 0,
    });
  }

  const analysis = analyzeText(fullHtml);

  return NextResponse.json({ analysis, chapterCount: chapters.length });
}
