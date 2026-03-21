import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCharacters,
  eq,
  and,
  isNull,
  asc,
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

// GET /api/projects/[projectId]/characters — List characters for a project
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const conditions = [
    eq(nbwCharacters.projectId, projectId),
    isNull(nbwCharacters.deletedAt),
  ];

  if (role) {
    conditions.push(
      eq(nbwCharacters.role, role as typeof nbwCharacters.role.enumValues[number])
    );
  }

  const characters = await db
    .select()
    .from(nbwCharacters)
    .where(and(...conditions))
    .orderBy(asc(nbwCharacters.name));

  return NextResponse.json({ items: characters });
}

// POST /api/projects/[projectId]/characters — Create a character
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

  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return badRequest("Name is required");
  }

  // Pick only valid character fields from the body
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

  const values: Record<string, unknown> = { projectId };
  for (const field of allowedFields) {
    if (field in body) {
      values[field] = body[field];
    }
  }

  // Ensure name is trimmed
  values.name = (body.name as string).trim();

  const [character] = await db
    .insert(nbwCharacters)
    .values(values as typeof nbwCharacters.$inferInsert)
    .returning();

  return NextResponse.json({ character }, { status: 201 });
}
