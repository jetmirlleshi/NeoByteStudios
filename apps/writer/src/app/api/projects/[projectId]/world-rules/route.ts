import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwWorldRules,
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

// GET /api/projects/[projectId]/world-rules — List world rules for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const rules = await db
    .select()
    .from(nbwWorldRules)
    .where(eq(nbwWorldRules.projectId, projectId))
    .orderBy(asc(nbwWorldRules.category), asc(nbwWorldRules.rule));

  return NextResponse.json({ items: rules });
}

// POST /api/projects/[projectId]/world-rules — Create a world rule
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

  if (!body.rule || typeof body.rule !== "string" || !body.rule.trim()) {
    return badRequest("Rule is required");
  }

  const allowedFields = [
    "rule",
    "explanation",
    "category",
    "isStrict",
  ] as const;

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure rule is trimmed
  values.rule = (body.rule as string).trim();

  const [rule] = await db
    .insert(nbwWorldRules)
    .values(values as typeof nbwWorldRules.$inferInsert)
    .returning();

  return NextResponse.json({ rule }, { status: 201 });
}
