import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwLocations,
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

type RouteContext = { params: Promise<{ locationId: string }> };

// Helper: get location with ownership verification through its project
async function getOwnedLocation(locationId: string, userId: string) {
  const [location] = await db
    .select()
    .from(nbwLocations)
    .where(
      and(
        eq(nbwLocations.id, locationId),
        isNull(nbwLocations.deletedAt)
      )
    );

  if (!location) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, location.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return location;
}

// GET /api/locations/[locationId] — Get a single location
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { locationId } = await context.params;
  const location = await getOwnedLocation(locationId, session.user.id);
  if (!location) return notFound("Location not found");

  return NextResponse.json({ location });
}

// PATCH /api/locations/[locationId] — Update location fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { locationId } = await context.params;
  const location = await getOwnedLocation(locationId, session.user.id);
  if (!location) return notFound("Location not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Allow updating any location field except id, projectId, createdAt
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
    .update(nbwLocations)
    .set(updates)
    .where(eq(nbwLocations.id, locationId))
    .returning();

  return NextResponse.json({ location: updated });
}

// DELETE /api/locations/[locationId] — Soft-delete a location
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { locationId } = await context.params;
  const location = await getOwnedLocation(locationId, session.user.id);
  if (!location) return notFound("Location not found");

  await db
    .update(nbwLocations)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwLocations.id, locationId));

  return NextResponse.json({ success: true });
}
