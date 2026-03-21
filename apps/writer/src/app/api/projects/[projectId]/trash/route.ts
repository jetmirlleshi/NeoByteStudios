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
import { getAuthSession, unauthorized, notFound } from "@/lib/api-helpers";

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

// GET /api/projects/[projectId]/trash - List all soft-deleted entities
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  // Run all queries in parallel for performance
  const [chapters, characters, locations, items, factions] = await Promise.all([
    db
      .select({
        id: nbwChapters.id,
        title: nbwChapters.title,
        number: nbwChapters.number,
        deletedAt: nbwChapters.deletedAt,
      })
      .from(nbwChapters)
      .where(
        and(
          eq(nbwChapters.projectId, projectId),
          isNotNull(nbwChapters.deletedAt)
        )
      ),
    db
      .select({
        id: nbwCharacters.id,
        name: nbwCharacters.name,
        role: nbwCharacters.role,
        deletedAt: nbwCharacters.deletedAt,
      })
      .from(nbwCharacters)
      .where(
        and(
          eq(nbwCharacters.projectId, projectId),
          isNotNull(nbwCharacters.deletedAt)
        )
      ),
    db
      .select({
        id: nbwLocations.id,
        name: nbwLocations.name,
        type: nbwLocations.type,
        deletedAt: nbwLocations.deletedAt,
      })
      .from(nbwLocations)
      .where(
        and(
          eq(nbwLocations.projectId, projectId),
          isNotNull(nbwLocations.deletedAt)
        )
      ),
    db
      .select({
        id: nbwItems.id,
        name: nbwItems.name,
        type: nbwItems.type,
        deletedAt: nbwItems.deletedAt,
      })
      .from(nbwItems)
      .where(
        and(
          eq(nbwItems.projectId, projectId),
          isNotNull(nbwItems.deletedAt)
        )
      ),
    db
      .select({
        id: nbwFactions.id,
        name: nbwFactions.name,
        deletedAt: nbwFactions.deletedAt,
      })
      .from(nbwFactions)
      .where(
        and(
          eq(nbwFactions.projectId, projectId),
          isNotNull(nbwFactions.deletedAt)
        )
      ),
  ]);

  return NextResponse.json({
    chapters,
    characters,
    locations,
    items,
    factions,
  });
}
