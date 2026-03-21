import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwFactions,
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

type RouteContext = { params: Promise<{ factionId: string }> };

// Helper: get faction with ownership verification through its project
async function getOwnedFaction(factionId: string, userId: string) {
  const [faction] = await db
    .select()
    .from(nbwFactions)
    .where(
      and(
        eq(nbwFactions.id, factionId),
        isNull(nbwFactions.deletedAt)
      )
    );

  if (!faction) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, faction.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return faction;
}

// GET /api/factions/[factionId] — Get a single faction
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { factionId } = await context.params;
  const faction = await getOwnedFaction(factionId, session.user.id);
  if (!faction) return notFound("Faction not found");

  return NextResponse.json({ faction });
}

// PATCH /api/factions/[factionId] — Update faction fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { factionId } = await context.params;
  const faction = await getOwnedFaction(factionId, session.user.id);
  if (!faction) return notFound("Faction not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Allow updating any faction field except id, projectId, createdAt
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
    .update(nbwFactions)
    .set(updates)
    .where(eq(nbwFactions.id, factionId))
    .returning();

  return NextResponse.json({ faction: updated });
}

// DELETE /api/factions/[factionId] — Soft-delete a faction
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { factionId } = await context.params;
  const faction = await getOwnedFaction(factionId, session.user.id);
  if (!faction) return notFound("Faction not found");

  await db
    .update(nbwFactions)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwFactions.id, factionId));

  return NextResponse.json({ success: true });
}
