import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  eq,
  and,
  isNull,
  asc,
  sql,
  max,
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

// GET /api/projects/[projectId]/chapters — List chapters for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const chapters = await db
    .select()
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    )
    .orderBy(asc(nbwChapters.order));

  return NextResponse.json({ items: chapters });
}

// POST /api/projects/[projectId]/chapters — Create a chapter
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  let body: { title?: string; summary?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.title?.trim()) {
    return badRequest("Title is required");
  }

  // Auto-calculate number and order (max existing + 1)
  const [result] = await db
    .select({
      maxNumber: max(nbwChapters.number),
      maxOrder: max(nbwChapters.order),
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    );

  const nextNumber = (result?.maxNumber ?? 0) + 1;
  const nextOrder = (result?.maxOrder ?? -1) + 1;

  const [chapter] = await db
    .insert(nbwChapters)
    .values({
      projectId,
      title: body.title.trim(),
      number: nextNumber,
      order: nextOrder,
      summary: body.summary?.trim() || null,
      notes: body.notes?.trim() || null,
    })
    .returning();

  return NextResponse.json({ chapter }, { status: 201 });
}
