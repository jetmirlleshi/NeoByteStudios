import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwTimelineEvents,
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

// GET /api/projects/[projectId]/timeline — List timeline events for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const events = await db
    .select()
    .from(nbwTimelineEvents)
    .where(eq(nbwTimelineEvents.projectId, projectId))
    .orderBy(asc(nbwTimelineEvents.order), asc(nbwTimelineEvents.date));

  return NextResponse.json({ items: events });
}

// POST /api/projects/[projectId]/timeline — Create a timeline event
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

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return badRequest("Title is required");
  }

  if (body.order == null || typeof body.order !== "number") {
    return badRequest("Order is required and must be a number");
  }

  const allowedFields = [
    "title",
    "description",
    "date",
    "era",
    "order",
    "type",
  ] as const;

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure title is trimmed
  values.title = (body.title as string).trim();

  const [event] = await db
    .insert(nbwTimelineEvents)
    .values(values as typeof nbwTimelineEvents.$inferInsert)
    .returning();

  return NextResponse.json({ event }, { status: 201 });
}
