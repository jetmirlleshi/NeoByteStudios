import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCharacters,
  nbwRelationships,
  nbwLocations,
  nbwItems,
  nbwFactions,
  nbwMagicSystems,
  nbwWorldRules,
  nbwTimelineEvents,
  nbwSubplots,
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
import {
  generateBibleJson,
  generateBibleMarkdown,
  ALL_BIBLE_SECTIONS,
  type BibleParams,
} from "@/lib/export/export-bible";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

// Ownership check helper
async function checkProjectOwnership(projectId: string, userId: string) {
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

const VALID_FORMATS = ["json", "markdown"] as const;
type BibleFormat = (typeof VALID_FORMATS)[number];

// POST /api/projects/[projectId]/export/bible
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { projectId } = await context.params;
  const project = await checkProjectOwnership(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const format = body.format as string;
  if (!format || !VALID_FORMATS.includes(format as BibleFormat)) {
    return badRequest(`Invalid format. Must be one of: ${VALID_FORMATS.join(", ")}`);
  }

  // Sections filter: default to all
  let sections: string[];
  if (Array.isArray(body.sections) && body.sections.length > 0) {
    // Validate section names
    sections = (body.sections as string[]).filter((s) =>
      (ALL_BIBLE_SECTIONS as readonly string[]).includes(s)
    );
    if (sections.length === 0) {
      return badRequest(
        `Invalid sections. Valid values: ${ALL_BIBLE_SECTIONS.join(", ")}`
      );
    }
  } else {
    sections = [...ALL_BIBLE_SECTIONS];
  }

  // Fetch all worldbuilding entities in parallel
  const [
    characters,
    relationships,
    locations,
    items,
    factions,
    magicSystems,
    worldRules,
    timeline,
    subplots,
  ] = await Promise.all([
    db
      .select()
      .from(nbwCharacters)
      .where(
        and(
          eq(nbwCharacters.projectId, projectId),
          isNull(nbwCharacters.deletedAt)
        )
      ),
    db.select().from(nbwRelationships),
    db
      .select()
      .from(nbwLocations)
      .where(
        and(
          eq(nbwLocations.projectId, projectId),
          isNull(nbwLocations.deletedAt)
        )
      ),
    db
      .select()
      .from(nbwItems)
      .where(
        and(eq(nbwItems.projectId, projectId), isNull(nbwItems.deletedAt))
      ),
    db
      .select()
      .from(nbwFactions)
      .where(
        and(
          eq(nbwFactions.projectId, projectId),
          isNull(nbwFactions.deletedAt)
        )
      ),
    db
      .select()
      .from(nbwMagicSystems)
      .where(eq(nbwMagicSystems.projectId, projectId)),
    db
      .select()
      .from(nbwWorldRules)
      .where(eq(nbwWorldRules.projectId, projectId)),
    db
      .select()
      .from(nbwTimelineEvents)
      .where(eq(nbwTimelineEvents.projectId, projectId))
      .orderBy(asc(nbwTimelineEvents.order)),
    db
      .select()
      .from(nbwSubplots)
      .where(eq(nbwSubplots.projectId, projectId)),
  ]);

  // Filter relationships to only include characters from this project
  const characterIds = new Set(characters.map((c) => c.id));
  const projectRelationships = relationships.filter(
    (r) =>
      characterIds.has(r.fromCharacterId) && characterIds.has(r.toCharacterId)
  );

  // Build the bible params
  const bibleParams: BibleParams = {
    project: {
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      genre: project.genre,
      worldName: project.worldName,
      worldDescription: project.worldDescription,
      worldTone: project.worldTone,
      worldThemes: project.worldThemes,
    },
    characters: characters as unknown as Array<Record<string, unknown>>,
    relationships: projectRelationships as unknown as Array<Record<string, unknown>>,
    locations: locations as unknown as Array<Record<string, unknown>>,
    items: items as unknown as Array<Record<string, unknown>>,
    factions: factions as unknown as Array<Record<string, unknown>>,
    magicSystem: (magicSystems[0] as unknown as Record<string, unknown>) ?? null,
    worldRules: worldRules as unknown as Array<Record<string, unknown>>,
    timeline: timeline as unknown as Array<Record<string, unknown>>,
    subplots: subplots as unknown as Array<Record<string, unknown>>,
    sections,
  };

  // Sanitize title for filename
  const safeTitle = project.title
    .replace(/[^a-zA-Z0-9\s\-_]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100) || "StoryBible";

  switch (format as BibleFormat) {
    case "json": {
      const json = generateBibleJson(bibleParams);
      const jsonStr = JSON.stringify(json, null, 2);

      return new NextResponse(jsonStr, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeTitle}_Bible.json"`,
          "Content-Length": String(Buffer.byteLength(jsonStr, "utf-8")),
        },
      });
    }

    case "markdown": {
      const md = generateBibleMarkdown(bibleParams);

      return new NextResponse(md, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeTitle}_Bible.md"`,
          "Content-Length": String(Buffer.byteLength(md, "utf-8")),
        },
      });
    }

    default:
      return badRequest("Unsupported format");
  }
}
