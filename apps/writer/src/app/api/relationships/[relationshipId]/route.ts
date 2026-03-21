import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCharacters,
  nbwRelationships,
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

type RouteContext = { params: Promise<{ relationshipId: string }> };

const VALID_RELATIONSHIP_TYPES = [
  "FAMILY",
  "ROMANTIC",
  "FRIENDSHIP",
  "RIVALRY",
  "ENEMY",
  "MENTOR_STUDENT",
  "EMPLOYER_EMPLOYEE",
  "ALLY",
  "NEUTRAL",
] as const;

// Helper: get relationship with ownership verification
// Ownership chain: relationship → fromCharacter → project → userId
async function getOwnedRelationship(relationshipId: string, userId: string) {
  const [relationship] = await db
    .select()
    .from(nbwRelationships)
    .where(eq(nbwRelationships.id, relationshipId));

  if (!relationship) return null;

  // Get the fromCharacter to find the project
  const [fromCharacter] = await db
    .select()
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.id, relationship.fromCharacterId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  if (!fromCharacter) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, fromCharacter.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return relationship;
}

// GET /api/relationships/[relationshipId] — Get a single relationship
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { relationshipId } = await context.params;
  const relationship = await getOwnedRelationship(relationshipId, session.user.id);
  if (!relationship) return notFound("Relationship not found");

  return NextResponse.json({ relationship });
}

// PATCH /api/relationships/[relationshipId] — Update a relationship
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { relationshipId } = await context.params;
  const relationship = await getOwnedRelationship(relationshipId, session.user.id);
  if (!relationship) return notFound("Relationship not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Validate type if provided
  if (
    body.type !== undefined &&
    !VALID_RELATIONSHIP_TYPES.includes(body.type as typeof VALID_RELATIONSHIP_TYPES[number])
  ) {
    return badRequest(
      `Invalid relationship type. Valid types: ${VALID_RELATIONSHIP_TYPES.join(", ")}`
    );
  }

  const allowedFields = [
    "type",
    "description",
    "startState",
    "currentState",
    "endState",
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
    .update(nbwRelationships)
    .set(updates)
    .where(eq(nbwRelationships.id, relationshipId))
    .returning();

  return NextResponse.json({ relationship: updated });
}

// DELETE /api/relationships/[relationshipId] — Hard-delete a relationship
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { relationshipId } = await context.params;
  const relationship = await getOwnedRelationship(relationshipId, session.user.id);
  if (!relationship) return notFound("Relationship not found");

  await db
    .delete(nbwRelationships)
    .where(eq(nbwRelationships.id, relationshipId));

  return NextResponse.json({ success: true });
}
