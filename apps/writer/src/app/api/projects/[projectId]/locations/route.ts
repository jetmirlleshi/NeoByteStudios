import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwLocations,
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

// GET /api/projects/[projectId]/locations — List locations for a project
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const conditions = [
    eq(nbwLocations.projectId, projectId),
    isNull(nbwLocations.deletedAt),
  ];

  if (type) {
    conditions.push(eq(nbwLocations.type, type));
  }

  const locations = await db
    .select()
    .from(nbwLocations)
    .where(and(...conditions))
    .orderBy(asc(nbwLocations.name));

  return NextResponse.json({ items: locations });
}

// POST /api/projects/[projectId]/locations — Create a location
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

  // Pick only valid location fields from the body
  const allowedFields = [
    "name",
    "type",
    "region",
    "controlledBy",
    "population",
    "description",
    "mood",
    "sounds",
    "smells",
    "temperature",
    "connections",
    "specialRules",
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

  const [location] = await db
    .insert(nbwLocations)
    .values(values as typeof nbwLocations.$inferInsert)
    .returning();

  return NextResponse.json({ location }, { status: 201 });
}
