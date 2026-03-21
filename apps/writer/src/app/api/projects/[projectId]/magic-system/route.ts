import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwMagicSystems,
  eq,
  and,
  isNull,
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

// GET /api/projects/[projectId]/magic-system — Get the magic system for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const [magicSystem] = await db
    .select()
    .from(nbwMagicSystems)
    .where(eq(nbwMagicSystems.projectId, projectId));

  if (!magicSystem) return notFound("Magic system not found");

  return NextResponse.json({ magicSystem });
}

// PUT /api/projects/[projectId]/magic-system — Upsert the magic system for a project
export async function PUT(request: NextRequest, context: RouteContext) {
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

  const allowedFields = [
    "name",
    "description",
    "source",
    "rules",
    "costs",
    "limitations",
    "practitioners",
    "history",
  ] as const;

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure name is trimmed
  values.name = (body.name as string).trim();

  // Check if a magic system already exists for this project
  const [existing] = await db
    .select()
    .from(nbwMagicSystems)
    .where(eq(nbwMagicSystems.projectId, projectId));

  let magicSystem;

  if (existing) {
    // Update existing magic system
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }
    if (updates.name && typeof updates.name === "string") {
      updates.name = updates.name.trim();
    }
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(nbwMagicSystems)
      .set(updates)
      .where(eq(nbwMagicSystems.id, existing.id))
      .returning();

    magicSystem = updated;
  } else {
    // Create new magic system
    const [created] = await db
      .insert(nbwMagicSystems)
      .values(values as typeof nbwMagicSystems.$inferInsert)
      .returning();

    magicSystem = created;
  }

  return NextResponse.json({ magicSystem });
}
