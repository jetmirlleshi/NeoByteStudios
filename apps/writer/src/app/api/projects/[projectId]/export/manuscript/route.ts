import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwChapters,
  nbwUserProfiles,
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
import { generateDocx } from "@/lib/export/export-docx";
import { generateMarkdown } from "@/lib/export/export-markdown";
import { stripHtml } from "@/lib/export/html-utils";

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

// Valid export formats
const VALID_FORMATS = ["docx", "markdown", "text"] as const;
type ExportFormat = (typeof VALID_FORMATS)[number];

// Chapter statuses that are considered "ready" (excludes IDEA and OUTLINE)
const READY_STATUSES = ["DRAFT", "REVISION", "COMPLETE"] as const;

// POST /api/projects/[projectId]/export/manuscript
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
  if (!format || !VALID_FORMATS.includes(format as ExportFormat)) {
    return badRequest(`Invalid format. Must be one of: ${VALID_FORMATS.join(", ")}`);
  }

  const options = (body.options ?? {}) as Record<string, unknown>;
  const includeDrafts = options.includeDrafts === true;
  const includeNotes = options.includeNotes === true;

  // Fetch chapters, ordered by `order` asc
  let chapters = await db
    .select()
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    )
    .orderBy(asc(nbwChapters.order));

  // Unless includeDrafts is true, only include DRAFT, REVISION, COMPLETE
  if (!includeDrafts) {
    chapters = chapters.filter((ch) =>
      (READY_STATUSES as readonly string[]).includes(ch.status)
    );
  }

  if (chapters.length === 0) {
    return badRequest("No chapters available for export");
  }

  // Get author name from profile
  const [profile] = await db
    .select({ displayName: nbwUserProfiles.displayName })
    .from(nbwUserProfiles)
    .where(eq(nbwUserProfiles.userId, session.user.id));

  const author = profile?.displayName ?? "Author";

  // Sanitize title for filename (remove special chars)
  const safeTitle = project.title
    .replace(/[^a-zA-Z0-9\s\-_]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100) || "Manuscript";

  // Build chapter data for export functions
  const chapterData = chapters.map((ch) => ({
    title: ch.title,
    number: ch.number,
    contentHtml: ch.contentHtml,
    notes: ch.notes,
  }));

  // Generate output based on format
  switch (format as ExportFormat) {
    case "docx": {
      const buffer = await generateDocx({
        title: project.title,
        subtitle: project.subtitle,
        author,
        chapters: chapterData,
        options: {
          font: (options.font as string) ?? undefined,
          fontSize: typeof options.fontSize === "number" ? options.fontSize : undefined,
          lineSpacing: typeof options.lineSpacing === "number" ? options.lineSpacing : undefined,
          margins: (options.margins as "normal" | "wide" | "narrow") ?? undefined,
          includeNotes,
          includeDrafts,
          titlePage: options.titlePage !== false,
        },
      });

      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeTitle}.docx"`,
          "Content-Length": String(buffer.length),
        },
      });
    }

    case "markdown": {
      const md = generateMarkdown({
        title: project.title,
        subtitle: project.subtitle,
        chapters: chapterData,
        includeNotes,
      });

      return new NextResponse(md, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeTitle}.md"`,
          "Content-Length": String(Buffer.byteLength(md, "utf-8")),
        },
      });
    }

    case "text": {
      // Build plain text version
      const textParts: string[] = [];

      textParts.push(project.title);
      if (project.subtitle) {
        textParts.push(project.subtitle);
      }
      textParts.push(`by ${author}`);
      textParts.push("");
      textParts.push("=".repeat(60));
      textParts.push("");

      for (const chapter of chapterData) {
        textParts.push(`Capitolo ${chapter.number} - ${chapter.title}`);
        textParts.push("-".repeat(40));
        textParts.push("");
        textParts.push(stripHtml(chapter.contentHtml));
        textParts.push("");

        if (includeNotes && chapter.notes) {
          textParts.push(`[Note dell'autore: ${chapter.notes}]`);
          textParts.push("");
        }

        textParts.push("=".repeat(60));
        textParts.push("");
      }

      const text = textParts.join("\n");

      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeTitle}.txt"`,
          "Content-Length": String(Buffer.byteLength(text, "utf-8")),
        },
      });
    }

    default:
      return badRequest("Unsupported format");
  }
}
