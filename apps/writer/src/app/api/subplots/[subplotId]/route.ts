import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwSubplots,
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

type RouteContext = { params: Promise<{ subplotId: string }> };

// Helper: get subplot with ownership verification through its project
async function getOwnedSubplot(subplotId: string, userId: string) {
  const [subplot] = await db
    .select()
    .from(nbwSubplots)
    .where(eq(nbwSubplots.id, subplotId));

  if (!subplot) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, subplot.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return subplot;
}

// GET /api/subplots/[subplotId] — Get a single subplot
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { subplotId } = await context.params;
  const subplot = await getOwnedSubplot(subplotId, session.user.id);
  if (!subplot) return notFound("Subplot not found");

  return NextResponse.json({ subplot });
}

// PATCH /api/subplots/[subplotId] — Update subplot fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { subplotId } = await context.params;
  const subplot = await getOwnedSubplot(subplotId, session.user.id);
  if (!subplot) return notFound("Subplot not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const allowedFields = [
    "name",
    "description",
    "type",
    "status",
    "progress",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return badRequest("No valid fields to update");
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(nbwSubplots)
    .set(updates)
    .where(eq(nbwSubplots.id, subplotId))
    .returning();

  return NextResponse.json({ subplot: updated });
}

// DELETE /api/subplots/[subplotId] — Delete a subplot
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { subplotId } = await context.params;
  const subplot = await getOwnedSubplot(subplotId, session.user.id);
  if (!subplot) return notFound("Subplot not found");

  await db
    .delete(nbwSubplots)
    .where(eq(nbwSubplots.id, subplotId));

  return NextResponse.json({ success: true });
}
