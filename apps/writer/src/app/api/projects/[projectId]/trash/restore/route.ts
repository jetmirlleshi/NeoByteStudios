import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwLocations,
  nbwItems,
  nbwFactions,
  eq,
  and,
  isNull,
  isNotNull,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
  badRequest,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

const VALID_ENTITY_TYPES = [
  "chapter",
  "character",
  "location",
  "item",
  "faction",
] as const;

type EntityType = (typeof VALID_ENTITY_TYPES)[number];

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

// POST /api/projects/[projectId]/trash/restore - Restore a soft-deleted entity
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  let body: { entityType?: string; entityId?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { entityType, entityId } = body;

  if (!entityType || !entityId) {
    return badRequest("entityType and entityId are required");
  }

  if (!VALID_ENTITY_TYPES.includes(entityType as EntityType)) {
    return badRequest(
      `entityType must be one of: ${VALID_ENTITY_TYPES.join(", ")}`
    );
  }

  // Map entity type to the corresponding table and projectId column
  const tableMap = {
    chapter: nbwChapters,
    character: nbwCharacters,
    location: nbwLocations,
    item: nbwItems,
    faction: nbwFactions,
  } as const;

  const table = tableMap[entityType as EntityType];

  // Verify entity belongs to this project and is currently deleted
  const [existing] = await db
    .select({ id: table.id })
    .from(table)
    .where(
      and(
        eq(table.id, entityId),
        eq(table.projectId, projectId),
        isNotNull(table.deletedAt)
      )
    );

  if (!existing) {
    return notFound("Deleted entity not found in this project");
  }

  // Restore: set deletedAt to null
  await db
    .update(table)
    .set({ deletedAt: null })
    .where(eq(table.id, entityId));

  return NextResponse.json({ success: true });
}
