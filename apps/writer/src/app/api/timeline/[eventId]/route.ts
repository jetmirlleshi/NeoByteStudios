import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwTimelineEvents,
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

type RouteContext = { params: Promise<{ eventId: string }> };

// Helper: get timeline event with ownership verification through its project
async function getOwnedEvent(eventId: string, userId: string) {
  const [event] = await db
    .select()
    .from(nbwTimelineEvents)
    .where(eq(nbwTimelineEvents.id, eventId));

  if (!event) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, event.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return event;
}

// GET /api/timeline/[eventId] — Get a single timeline event
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { eventId } = await context.params;
  const event = await getOwnedEvent(eventId, session.user.id);
  if (!event) return notFound("Timeline event not found");

  return NextResponse.json({ event });
}

// PATCH /api/timeline/[eventId] — Update timeline event fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { eventId } = await context.params;
  const event = await getOwnedEvent(eventId, session.user.id);
  if (!event) return notFound("Timeline event not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const allowedFields = [
    "title",
    "description",
    "date",
    "era",
    "order",
    "type",
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
    .update(nbwTimelineEvents)
    .set(updates)
    .where(eq(nbwTimelineEvents.id, eventId))
    .returning();

  return NextResponse.json({ event: updated });
}

// DELETE /api/timeline/[eventId] — Delete a timeline event
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { eventId } = await context.params;
  const event = await getOwnedEvent(eventId, session.user.id);
  if (!event) return notFound("Timeline event not found");

  await db
    .delete(nbwTimelineEvents)
    .where(eq(nbwTimelineEvents.id, eventId));

  return NextResponse.json({ success: true });
}
