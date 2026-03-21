import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwItems,
  eq,
  and,
  isNull,
  asc,
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

// GET /api/projects/[projectId]/items — List items for a project
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const { searchParams } = new URL(request.url);
  const importance = searchParams.get("importance");

  const conditions = [
    eq(nbwItems.projectId, projectId),
    isNull(nbwItems.deletedAt),
  ];

  if (importance) {
    conditions.push(
      eq(nbwItems.importance, importance as typeof nbwItems.importance.enumValues[number])
    );
  }

  const items = await db
    .select()
    .from(nbwItems)
    .where(and(...conditions))
    .orderBy(asc(nbwItems.name));

  return NextResponse.json({ items });
}

// POST /api/projects/[projectId]/items — Create an item
export async function POST(request: NextRequest, context: RouteContext) {
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

  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return badRequest("Name is required");
  }

  // Pick only valid item fields from the body
  const allowedFields = [
    "name",
    "type",
    "description",
    "appearance",
    "powers",
    "weaknesses",
    "origin",
    "history",
    "currentOwner",
    "ownerHistory",
    "importance",
    "imageUrl",
  ] as const;

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure name is trimmed
  values.name = (body.name as string).trim();

  const [item] = await db
    .insert(nbwItems)
    .values(values as typeof nbwItems.$inferInsert)
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
