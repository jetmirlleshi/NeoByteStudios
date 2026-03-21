import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwUserProfiles,
  eq,
  and,
  isNull,
  desc,
  asc,
  like,
  sql,
  count,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  badRequest,
  getProjectLimit,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// GET /api/projects — List user projects with optional filters
export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const genre = searchParams.get("genre");
  const sortBy = searchParams.get("sortBy") || "updatedAt";

  // Build conditions
  const conditions = [
    eq(nbwProjects.userId, session.user.id),
    isNull(nbwProjects.deletedAt),
  ];

  if (search) {
    conditions.push(like(nbwProjects.title, `%${search}%`));
  }
  if (status) {
    conditions.push(eq(nbwProjects.status, status as typeof nbwProjects.status.enumValues[number]));
  }
  if (genre) {
    conditions.push(eq(nbwProjects.genre, genre));
  }
  if (cursor) {
    conditions.push(sql`${nbwProjects.id} < ${cursor}`);
  }

  // Choose sort order
  const orderColumn =
    sortBy === "title"
      ? asc(nbwProjects.title)
      : sortBy === "createdAt"
        ? desc(nbwProjects.createdAt)
        : desc(nbwProjects.updatedAt);

  // Fetch projects
  const projects = await db
    .select()
    .from(nbwProjects)
    .where(and(...conditions))
    .orderBy(orderColumn)
    .limit(limit + 1);

  // Determine pagination
  const hasMore = projects.length > limit;
  const items = hasMore ? projects.slice(0, limit) : projects;
  const nextCursor = hasMore ? items[items.length - 1]?.id : null;

  // Aggregate word counts per project
  const projectIds = items.map((p) => p.id);
  let statsMap: Record<string, { wordCount: number; chapterCount: number }> = {};

  if (projectIds.length > 0) {
    const stats = await db
      .select({
        projectId: nbwChapters.projectId,
        wordCount: sql<number>`coalesce(sum(${nbwChapters.wordCount}), 0)`,
        chapterCount: count(nbwChapters.id),
      })
      .from(nbwChapters)
      .where(
        and(
          sql`${nbwChapters.projectId} IN (${sql.join(projectIds.map((id) => sql`${id}`), sql`, `)})`,
          isNull(nbwChapters.deletedAt)
        )
      )
      .groupBy(nbwChapters.projectId);

    for (const s of stats) {
      statsMap[s.projectId] = {
        wordCount: Number(s.wordCount),
        chapterCount: Number(s.chapterCount),
      };
    }
  }

  const itemsWithStats = items.map((p) => ({
    ...p,
    totalWords: statsMap[p.id]?.wordCount ?? 0,
    chapterCount: statsMap[p.id]?.chapterCount ?? 0,
  }));

  return NextResponse.json({ items: itemsWithStats, nextCursor });
}

// POST /api/projects — Create a new project
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  let body: { title?: string; genre?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.title?.trim()) {
    return badRequest("Title is required");
  }

  // Check tier limit
  const [profile] = await db
    .select({ tier: nbwUserProfiles.subscriptionTier })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, session.user.id))
    .limit(1);
  const tier = profile?.tier ?? "FREE";
  const maxProjects = getProjectLimit(tier);

  const [{ projectCount }] = await db
    .select({ projectCount: count(nbwProjects.id) })
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.userId, session.user.id),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (projectCount >= maxProjects) {
    return NextResponse.json(
      { error: `Project limit reached (${maxProjects} for ${tier} plan)` },
      { status: 429 }
    );
  }

  const [project] = await db
    .insert(nbwProjects)
    .values({
      userId: session.user.id,
      title: body.title.trim(),
      genre: body.genre?.trim() || null,
      description: body.description?.trim() || null,
    })
    .returning();

  return NextResponse.json({ project }, { status: 201 });
}
