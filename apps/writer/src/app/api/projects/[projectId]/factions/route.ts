import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwFactions,
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

// GET /api/projects/[projectId]/factions — List factions for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const factions = await db
    .select()
    .from(nbwFactions)
    .where(
      and(
        eq(nbwFactions.projectId, projectId),
        isNull(nbwFactions.deletedAt)
      )
    )
    .orderBy(asc(nbwFactions.name));

  return NextResponse.json({ items: factions });
}

// POST /api/projects/[projectId]/factions — Create a faction
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

  // Pick only valid faction fields from the body
  const allowedFields = [
    "name",
    "type",
    "description",
    "ideology",
    "leadership",
    "resources",
    "headquarters",
    "allies",
    "enemies",
  ] as const;

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure name is trimmed
  values.name = (body.name as string).trim();

  const [faction] = await db
    .insert(nbwFactions)
    .values(values as typeof nbwFactions.$inferInsert)
    .returning();

  return NextResponse.json({ faction }, { status: 201 });
}
