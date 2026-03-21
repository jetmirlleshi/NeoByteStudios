import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCharacters,
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

type RouteContext = { params: Promise<{ characterId: string }> };

// Helper: get character with ownership verification through its project
async function getOwnedCharacter(characterId: string, userId: string) {
  const [character] = await db
    .select()
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.id, characterId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  if (!character) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, character.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return character;
}

// GET /api/characters/[characterId] — Get a single character
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { characterId } = await context.params;
  const character = await getOwnedCharacter(characterId, session.user.id);
  if (!character) return notFound("Character not found");

  return NextResponse.json({ character });
}

// PATCH /api/characters/[characterId] — Update character fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { characterId } = await context.params;
  const character = await getOwnedCharacter(characterId, session.user.id);
  if (!character) return notFound("Character not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Allow updating any character field except id, projectId, createdAt
  const allowedFields = [
    "name",
    "fullName",
    "aliases",
    "age",
    "role",
    "status",
    "factionId",
    "height",
    "build",
    "hairColor",
    "hairStyle",
    "eyeColor",
    "skinTone",
    "distinctiveFeatures",
    "clothing",
    "personality",
    "motivation",
    "fears",
    "strengths",
    "weaknesses",
    "fatalFlaw",
    "secrets",
    "backstory",
    "speechPattern",
    "vocabulary",
    "catchPhrases",
    "neverSays",
    "verbosity",
    "arcStart",
    "arcMidpoint",
    "arcCrisis",
    "arcEnd",
    "arcLesson",
    "abilities",
    "limitations",
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
    .update(nbwCharacters)
    .set(updates)
    .where(eq(nbwCharacters.id, characterId))
    .returning();

  return NextResponse.json({ character: updated });
}

// DELETE /api/characters/[characterId] — Soft-delete a character
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { characterId } = await context.params;
  const character = await getOwnedCharacter(characterId, session.user.id);
  if (!character) return notFound("Character not found");

  await db
    .update(nbwCharacters)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwCharacters.id, characterId));

  return NextResponse.json({ success: true });
}
