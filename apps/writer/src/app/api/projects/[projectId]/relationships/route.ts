import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCharacters,
  nbwRelationships,
  eq,
  and,
  or,
  isNull,
  asc,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
  badRequest,
  conflict,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

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

// GET /api/projects/[projectId]/relationships — List relationships for a project
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  // Get all non-deleted character IDs for this project
  const projectCharacters = await db
    .select({ id: nbwCharacters.id })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  if (projectCharacters.length === 0) {
    return NextResponse.json({ relationships: [] });
  }

  const characterIds = projectCharacters.map((c) => c.id);

  // Get all relationships where fromCharacterId belongs to this project
  const relationships = await db
    .select()
    .from(nbwRelationships)
    .where(
      or(
        ...characterIds.map((id) => eq(nbwRelationships.fromCharacterId, id))
      )
    )
    .orderBy(asc(nbwRelationships.createdAt));

  return NextResponse.json({ relationships });
}

// POST /api/projects/[projectId]/relationships — Create a relationship
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

  const { fromCharacterId, toCharacterId, type, description, startState, currentState, endState } = body;

  if (!fromCharacterId || typeof fromCharacterId !== "string") {
    return badRequest("fromCharacterId is required");
  }
  if (!toCharacterId || typeof toCharacterId !== "string") {
    return badRequest("toCharacterId is required");
  }
  if (fromCharacterId === toCharacterId) {
    return badRequest("A character cannot have a relationship with itself");
  }
  if (
    type &&
    !VALID_RELATIONSHIP_TYPES.includes(type as typeof VALID_RELATIONSHIP_TYPES[number])
  ) {
    return badRequest(
      `Invalid relationship type. Valid types: ${VALID_RELATIONSHIP_TYPES.join(", ")}`
    );
  }

  // Verify both characters belong to this project and are not deleted
  const [fromCharacter] = await db
    .select()
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.id, fromCharacterId),
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );
  if (!fromCharacter) {
    return badRequest("fromCharacterId does not belong to this project or does not exist");
  }

  const [toCharacter] = await db
    .select()
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.id, toCharacterId as string),
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );
  if (!toCharacter) {
    return badRequest("toCharacterId does not belong to this project or does not exist");
  }

  // Check for duplicate (unique constraint on fromCharacterId + toCharacterId)
  const [existing] = await db
    .select({ id: nbwRelationships.id })
    .from(nbwRelationships)
    .where(
      and(
        eq(nbwRelationships.fromCharacterId, fromCharacterId),
        eq(nbwRelationships.toCharacterId, toCharacterId as string)
      )
    );
  if (existing) {
    return conflict("A relationship between these two characters already exists");
  }

  const values: Record<string, unknown> = {
    fromCharacterId,
    toCharacterId,
  };

  if (type) values.type = type;
  if (typeof description === "string") values.description = description;
  if (typeof startState === "string") values.startState = startState;
  if (typeof currentState === "string") values.currentState = currentState;
  if (typeof endState === "string") values.endState = endState;

  const [relationship] = await db
    .insert(nbwRelationships)
    .values(values as typeof nbwRelationships.$inferInsert)
    .returning();

  return NextResponse.json({ relationship }, { status: 201 });
}
