// ---------------------------------------------------------------------------
// POST /api/ai/search — RAG search endpoint
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  eq,
  and,
  isNull,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-helpers";
import { searchRAG } from "@/lib/ai/rag";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchBody {
  projectId?: string;
  query?: string;
  topK?: number;
  filters?: {
    types?: string[];
    excludeChapterIds?: string[];
    currentChapterNumber?: number;
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // --- Auth ---
  const session = await getAuthSession();
  if (!session) return unauthorized();

  // --- Parse body ---
  let body: SearchBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { projectId, query, topK, filters } = body;

  if (!projectId?.trim()) return badRequest("projectId is required");
  if (!query?.trim()) return badRequest("query is required");

  if (topK !== undefined && (typeof topK !== "number" || topK < 1 || topK > 50)) {
    return badRequest("topK must be a number between 1 and 50");
  }

  // --- Validate project ownership ---
  const [project] = await db
    .select({ id: nbwProjects.id })
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, projectId),
        eq(nbwProjects.userId, session.user.id),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return notFound("Project not found");

  // --- Run RAG search ---
  try {
    const results = await searchRAG({
      projectId,
      query,
      topK: topK ?? 10,
      filters,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("[AI Search] RAG search failed:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
